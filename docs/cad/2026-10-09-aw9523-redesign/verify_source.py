#!/usr/bin/env python3
"""Re-evaluate original Eagle board, including element rotation and arc contour."""
from pathlib import Path
import hashlib
import math
import xml.etree.ElementTree as ET
p = Path(__file__).parent / 'sources/Adafruit_AW9523.brd'
data = p.read_bytes()
r = ET.fromstring(data)
b = r.find('./drawing/board')
packages = {(lib.get('name'), pkg.get('name')): pkg
            for lib in b.findall('./libraries/library') for pkg in lib.findall('./packages/package')}
print('Source SHA256:', hashlib.sha256(data).hexdigest())
contour = [w.attrib for w in b.findall('./plain/wire') if w.get('layer') == '20']
assert len(contour) == 8
assert sum(w.get('curve') == '90' for w in contour) == 4
print('Layer 20 contour:', contour)
pts = [(float(w[k]), float(w[j])) for w in contour for k,j in (('x1','y1'),('x2','y2'))]
assert (min(x for x,y in pts), max(x for x,y in pts), min(y for x,y in pts), max(y for x,y in pts)) == (0,38.1,0,17.78)
holes, pins = [], []
for e in b.findall('./elements/element'):
    pkg = packages[(e.get('library'), e.get('package'))]
    if not e.get('package').startswith(('MOUNTINGHOLE', '1X')):
        continue
    angle = float(e.get('rot','R0')[1:]) * math.pi/180
    for pad in pkg.findall('pad'):
        x,y = float(pad.get('x')),float(pad.get('y'))
        xy = (round(float(e.get('x'))+x*math.cos(angle)-y*math.sin(angle),5),
              round(float(e.get('y'))+x*math.sin(angle)+y*math.cos(angle),5))
        if e.get('package').startswith('MOUNTINGHOLE'):
            assert float(pad.get('drill')) == 2.5
            holes.append(xy)
        else:
            assert float(pad.get('drill')) == 1
            pins.append(xy)
assert set(holes) == {(2.54,2.54),(35.56,2.54),(2.54,15.24),(35.56,15.24)}
expected = {(round(start+2.54*k,5),y) for y,start,n in
            ((2.54,6.35,11),(5.08,21.59,5),(12.7,6.35,11),(15.24,6.35,11)) for k in range(n)}
assert len(pins)==38 and set(pins)==expected
print('Holes D2.5:', sorted(holes))
print('Pins D1.0:', sorted(pins))
for h in sorted(holes):
    distance = min(math.dist(h,p) for p in pins)
    assert distance >= 3.81-1e-6
    print('Hole',h,'nearest pin',distance,'mm; neck/solder clearance',distance-2.3-1.1)
print('PASS: source contour, drills, rotated pads and SCAD coordinate set agree')
