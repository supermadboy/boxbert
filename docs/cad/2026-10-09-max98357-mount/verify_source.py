#!/usr/bin/env python3
"""Verify original mono board geometry used by this mount, not a physical fit."""
import hashlib
import math
from pathlib import Path
import xml.etree.ElementTree as ET
p = Path(__file__).parent / 'sources/adafruit-max98357.brd'
b = ET.parse(p).getroot().find('.//board')
wires = [w for w in b.findall('./plain/wire') if w.get('layer') == '20']
xs = [float(w.get(k)) for w in wires for k in ('x1', 'x2')]
ys = [float(w.get(k)) for w in wires for k in ('y1', 'y2')]
assert (min(xs), max(xs), min(ys), max(ys)) == (0, 17.78, 0, 19.05)
curves = [w for w in wires if w.get('curve')]
assert len(curves) == 4 and all(w.get('curve') == '-90' for w in curves)
for w in curves:
    chord = math.hypot(float(w.get('x2'))-float(w.get('x1')),
                       float(w.get('y2'))-float(w.get('y1')))
    assert abs(chord/math.sqrt(2)-2.54) < 1e-8
holes, pads = [], []
for e in b.findall('./elements/element'):
    pkg = b.find(f"./libraries/library[@name='{e.get('library')}']/packages/package[@name='{e.get('package')}']")
    if not pkg.findall('pad'):
        continue
    rot = e.get('rot', 'R0')
    assert rot in ('R0', 'R180'), f'Unexpected rotation {rot}'
    sign = -1 if rot == 'R180' else 1
    for pad in pkg.findall('pad'):
        xy = tuple(round(float(e.get(k))+sign*float(pad.get(k)), 6) for k in ('x','y'))
        if e.get('package') == 'MOUNTINGHOLE_2.5_PLATED':
            assert float(pad.get('drill')) == 2.5
            holes.append(xy)
        else:
            assert float(pad.get('drill')) == 1
            pads.append(xy)
assert sorted(holes) == [(2.54,16.51),(15.24,16.51)]
assert sorted(pads) == sorted([(round(1.27+2.54*k,6),2.54) for k in range(7)] + [(7.09,15.494),(10.59,15.494)])
clear = min(math.dist(h,p) for h in holes for p in pads)
assert clear-2.3-1.3 > 0.4
print('SHA256:',hashlib.sha256(p.read_bytes()).hexdigest())
print('Contour: 17.78 x 19.05, R2.54; holes:',holes)
print('Pads transformed:',pads)
print('Closest pad centre:', clear, 'mm; assumed neck/lot clearance:',clear-2.3-1.3)
print('PASS: source geometry matches mount assumptions; NOT physical approval')
