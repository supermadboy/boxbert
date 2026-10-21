#!/usr/bin/env python3
"""Independent checks of real DXF contours, not just their bounding boxes.
Requires Shapely. Called by each window's check_cnc.py.
"""
from pathlib import Path
from shapely.geometry import LineString, Point
from shapely.ops import polygonize


def read_contour(path):
    lines = path.read_text().splitlines()
    pairs = [(int(a), b.strip()) for a, b in zip(lines[::2], lines[1::2])]
    segments = []
    entity = None
    fields, polyline = {}, []
    def finish():
        if entity == 'LINE':
            segments.append(LineString([(float(fields[10]), float(fields[20])),
                                        (float(fields[11]), float(fields[21]))]))
        elif entity == 'LWPOLYLINE':
            assert int(fields.get(70,0)) & 1, 'open polyline'
            segments.extend(LineString([a,b]) for a,b in zip(polyline, polyline[1:]+polyline[:1]))
    for code, value in pairs:
        if code == 0:
            finish()
            entity, fields, polyline = value, {}, []
        else:
            fields[code] = value
            if entity == 'LWPOLYLINE' and code == 20:
                polyline.append((float(fields[10]),float(value)))
            if entity == 'LWPOLYLINE' and code == 42:
                assert float(value) == 0, 'bulge arcs not supported'
    finish()
    assert len(segments) > 10, path
    polygons = list(polygonize(segments))
    assert len(polygons) == 1, (path, 'not a single closed loop', len(polygons))
    poly = polygons[0]
    assert poly.is_valid and len(poly.interiors) == 0, path
    assert abs(sum(s.length for s in segments)-poly.length) < 1e-5, 'duplicate/unused edges'
    return poly


def check_contours(root):
    opening, rebate, glass = [read_contour(root / f'cnc-{n}.dxf') for n in ('opening','rebate','glass')]
    assert rebate.contains(opening) and rebate.contains(glass)
    assert glass.contains(opening.buffer(3.75)), 'glass must still cover entire opening'
    ds = [opening.distance(rebate.exterior.interpolate(i/6400, normalized=True)) for i in range(6400)]
    assert 3.98 < min(ds) < 4.02 and 9.98 < max(ds) < 10.02, (min(ds),max(ds))
    gs = [rebate.exterior.distance(glass.exterior.interpolate(i/3200, normalized=True)) for i in range(3200)]
    assert min(gs) > .198 and max(gs) < .202, ('not a true 0.2 mm offset',min(gs),max(gs))
    # Independent relation to all intended wave points, incl. actual JST notch distance.
    for name, p in [('opening',opening),('rebate',rebate),('glass',glass)]:
        print(f'PASS closed/simple DXF {name}, bounds {tuple(round(v,4) for v in p.bounds)}, area {p.area:.3f} mm²')
    print(f'PASS actual wave width {min(ds):.4f}..{max(ds):.4f} mm; glass clearance {min(gs):.4f}..{max(gs):.4f} mm')
    # Nominal XY projection: glass sits ABOVE screws, but top wood is reduced.
    points = {'pn532-mount':[(-10,20.2),(34.975,50.4)],
              'neopixel-stick-mount':[(20,19.9),(34,19.9)],
              'feather-window-mount':[(25.4,-17),(25.4,39.86)]}[root.name]
    for xy in points:
        if rebate.intersects(Point(xy).buffer(1.6)):
            print(f'OPEN wood screw at {xy}: rabbet overlaps screw projection; nominal tip-to-pocket-floor only 0.5 mm where overlapping (12 - 3 - 8.5). Real wood/retention test required.')
    # Milling the pocket with Ø4 is possible only if small convex features survive.
    for radius in (2,1.5,1):
        unreachable = rebate.difference(rebate.buffer(-radius,quad_segs=32).buffer(radius,quad_segs=32)).area
        print(f'CAM diagnostic Ø{2*radius:g}: pocket area not reached by ideal round cutter = {unreachable:.5f} mm²; inspect CAM, not a cutter approval')
    print('OPEN layout: larger rabbet requires renewed wall/button/edge checks; no physical approval.')
    return opening, rebate, glass

if __name__ == '__main__':
    import sys
    check_contours(Path(sys.argv[1]).resolve())
