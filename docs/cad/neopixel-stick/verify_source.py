#!/usr/bin/env python3
"""Extract the user-approved Adafruit reference, NOT prove NEOPS8 identity."""
import json
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
r = ET.parse(ROOT / 'adafruit-stick-v2.brd')
b = r.find('drawing/board')
assert b is not None
w = [x for x in b.findall('plain/wire') if x.get('layer') == '20']
xs = [float(x.attrib[k]) for x in w for k in ('x1', 'x2')]
ys = [float(x.attrib[k]) for x in w for k in ('y1', 'y2')]
assert (min(xs), max(xs), min(ys), max(ys)) == (0, 50.8, 0, 10.16)
els = b.findall('elements/element')
holes = []
for e in els:
    if e.get('package') == 'MOUNTINGHOLE_2.0_PLATED':
        pkg = b.find(f"libraries/library[@name='{e.get('library')}']/packages/package[@name='{e.get('package')}']")
        assert pkg is not None
        pad = pkg.find('pad')
        assert pad is not None
        holes.append({'xy': [float(e.attrib['x']), float(e.attrib['y'])], 'drill': float(pad.attrib['drill'])})
assert holes == [{'xy': [12.7, 8.128], 'drill': 2.2}, {'xy': [38.1, 8.128], 'drill': 2.2}]
leds = [[float(e.attrib['x']), float(e.attrib['y'])] for e in els if e.get('name', '').startswith('LED')]
assert len(leds) == 8
assert all(abs(a[0]-(3.175+i*6.35)) < 1e-8 and a[1] == 3.81 for i,a in enumerate(leds))
# Trace CN2 through R1 into LED1 DIN; CN1 is the far output.
nets = [{(c.get('element'), c.get('pad')) for c in s.findall('contactref')} for s in b.findall('signals/signal')]
assert any({('CN2', '3'), ('R1', '1')} <= s for s in nets)
assert any({('R1', '2'), ('LED1', '4-DIN')} <= s for s in nets)
assert any({('CN1', '2'), ('LED8', '2-DOUT')} <= s for s in nets)
cn2 = next(e for e in els if e.get('name') == 'CN2')
assert cn2.get('x') == '1.397' and cn2.get('rot') == 'MR90'
facts = {'basis': 'Adafruit 1426 v2, user approved; NEOPS8 identity unverified', 'pcb': [50.8, 10.16], 'holes': holes, 'led_xy': leds, 'din': 'CN2 left at x=1.397, backside', 'dout': 'CN1 right at x=49.403, backside'}
(ROOT / 'source-facts.json').write_text(json.dumps(facts, indent=2) + '\n')
print('PASS Adafruit v2 contour, D2.2 holes, 25.4 pitch, LED coordinates and DIN-left net trace')
print('NEOPS8 physical identity is NOT verified; user approved this reference for design.')
