#!/usr/bin/env python3
"""Extract actual ADA5691 Eagle facts; no assumed standard Feather hole pattern."""
import hashlib
import json
import math
import xml.etree.ElementTree as ET
from pathlib import Path
p = Path(__file__).parent
file = p / 'Adafruit ESP32-S3 Reverse TFT Feather.brd'
r = ET.parse(file).getroot()
board = r.find('.//board')
def package(e):
    return board.find(f'libraries/library[@name="{e.get("library")}"]/packages/package[@name="{e.get("package")}"]')
def world(e, x, y):
    rot = e.get('rot', 'R0')
    if 'M' in rot:
        y = -y
    angle = math.radians(float(rot.split('R')[1]))
    return [round(float(e.get('x')) + x*math.cos(angle)-y*math.sin(angle), 6),
            round(float(e.get('y')) + x*math.sin(angle)+y*math.cos(angle), 6)]
outline = [dict(w.attrib) for w in board.findall('plain/wire') if w.get('layer') == '20']
assert len(outline) == 8
assert max(float(w.get('x1')) for w in outline) == 50.8
assert max(float(w.get('y1')) for w in outline) == 22.86
assert sum(w.get('curve') == '90' for w in outline) == 4
holes = []
for name in ['U$32', 'U$31']:
    e = board.find(f'elements/element[@name="{name}"]')
    pad = package(e).find('pad')
    holes.append({'xy': world(e, float(pad.get('x')), float(pad.get('y'))), 'drill': float(pad.get('drill')), 'source': name})
for h in board.findall('plain/hole'):
    holes.append({'xy': [float(h.get('x')),float(h.get('y'))], 'drill': float(h.get('drill')), 'source': 'plain/hole'})
assert holes == [
    {'xy':[2.54,2.54],'drill':2.5,'source':'U$32'},
    {'xy':[2.54,20.32],'drill':2.5,'source':'U$31'},
    {'xy':[48.26,1.8415],'drill':2.2,'source':'plain/hole'},
    {'xy':[48.26,20.955],'drill':2.2,'source':'plain/hole'}]
pins=[]
for name in ['JP1','JP3']:
    e=board.find(f'elements/element[@name="{name}"]')
    for pad in package(e).findall('pad'):
        pins.append(world(e, float(pad.get('x')), float(pad.get('y'))))
assert len(pins) == 28
nearest = [min(math.dist(h['xy'],pin) for pin in pins) for h in holes]
display = board.find('elements/element[@name="DISP1"]')
display_corners=[world(display,x,y) for x in [-8.8,8.8] for y in [0,31]]
assert abs(min(c[0] for c in display_corners)-11.291)<1e-6
result={'sha256':hashlib.sha256(file.read_bytes()).hexdigest(), 'outline':outline,
        'pcb_mm':[50.8,22.86], 'corner_radius_mm':2.54,'holes':holes,'pins':pins,
        'nearest_header_pin_mm':nearest,'display_footprint_corners':display_corners,
        'display_rot':display.get('rot'),
        'warning':'Footprints are not measured component heights or real solder envelopes.'}
(p/'source-facts.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
