#!/usr/bin/env python3
"""Export the three existing glass DXF contours as millimetre-sized SVGs.

Requires Shapely, like check_wave.py. No curve fitting or tool compensation.
"""
from pathlib import Path
import xml.etree.ElementTree as ET

from shapely.geometry import Polygon

from check_wave import read_contour

ROOT = Path(__file__).resolve().parent.parent
MODULES = ('feather-window-mount', 'neopixel-stick-mount', 'pn532-mount')
NS = 'http://www.w3.org/2000/svg'


def export_glass(folder):
    source = folder / 'cnc-glass.dxf'
    contour = read_contour(source)
    # SVG's y axis points down; negate y to preserve the CAD top-view shape.
    points = [(x, -y) for x, y in list(contour.exterior.coords)[:-1]]
    xmin, ymin, xmax, ymax = Polygon(points).bounds
    width, height = xmax - xmin, ymax - ymin
    number = lambda value: format(value, '.12g')
    commands = ['M ' + ' '.join(map(number, points[0]))]
    commands.extend('L ' + ' '.join(map(number, point)) for point in points[1:])
    commands.append('Z')
    root = ET.Element('svg', {
        'xmlns': NS,
        'width': number(width) + 'mm',
        'height': number(height) + 'mm',
        'viewBox': ' '.join(map(number, (xmin, ymin, width, height))),
    })
    ET.SubElement(root, 'desc').text = (
        'Nominal glass cutting contour in mm, copied from cnc-glass.dxf. '
        'No kerf or tool-radius compensation; import at 1:1 scale.'
    )
    ET.SubElement(root, 'path', {
        'd': ' '.join(commands), 'fill': 'none', 'stroke': '#000000',
        'stroke-width': '0.01',
    })
    output = folder / (folder.name.removesuffix('-mount') + '-glass.svg')
    ET.ElementTree(root).write(output, encoding='utf-8', xml_declaration=True)

    # Read the actual output back, including its physical scale and closure.
    saved = ET.parse(output).getroot()
    paths = saved.findall(f'{{{NS}}}path')
    assert len(paths) == 1
    tokens = paths[0].attrib['d'].split()
    assert tokens[0] == 'M' and tokens[-1] == 'Z'
    assert all(tokens[i] == 'L' for i in range(3, len(tokens) - 1, 3))
    restored = [(float(tokens[i+1]), -float(tokens[i+2]))
                for i in range(0, len(tokens) - 1, 3)]
    polygon = Polygon(restored)
    assert polygon.is_valid and not polygon.interiors
    assert len(restored) == len(points)
    assert polygon.symmetric_difference(contour).area < 1e-8
    assert polygon.hausdorff_distance(contour) < 1e-8
    box = list(map(float, saved.attrib['viewBox'].split()))
    for key, expected in (('width', box[2]), ('height', box[3])):
        assert saved.attrib[key].endswith('mm')
        assert float(saved.attrib[key][:-2]) == expected
    print(f'PASS {output.relative_to(ROOT)}: {width:.6f} x {height:.6f} mm; '
          f'{len(points)} vertices; closed single path; identical DXF contour')


if __name__ == '__main__':
    for name in MODULES:
        export_glass(ROOT / name)
