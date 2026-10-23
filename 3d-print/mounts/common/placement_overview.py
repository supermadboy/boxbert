#!/usr/bin/env python3
"""Dimensioned placement drawing from active DXFs; no CNC geometry changes.
Run using the Pillow/Shapely environment documented in common/README.md.
"""
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from shapely import affinity
from shapely.geometry import box

from check_wave import read_contour

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'cnc-positionierung'
OUT.mkdir(exist_ok=True)
S = 5
im = Image.new('RGB', (2100, 2470), '#ffffff')
d = ImageDraw.Draw(im)
font_paths = list(Path('/nix/store').glob('*dejavu-fonts*/share/fonts/truetype/DejaVuSans.ttf'))
font_paths += list(Path('/usr/share/fonts').glob('**/DejaVuSans.ttf'))
assert font_paths, 'DejaVuSans.ttf required'
INK, BLUE, GRAY = '#1c303b', '#006891', '#66747c'
WOOD, REBATE, HOLE = '#f2e3cc', '#c69b66', '#ffffff'


def text(x, y, s, size=26, color=INK, anchor=None):
    d.text((x, y), s, font=ImageFont.truetype(str(font_paths[0]), size), fill=color, anchor=anchor)


def line(points, color=BLUE, width=2):
    d.line(points, fill=color, width=width)


def arrow(p, toward):
    a = math.atan2(toward[1] - p[1], toward[0] - p[0])
    pts = [p] + [(p[0] + 12 * math.cos(a + t), p[1] + 12 * math.sin(a + t)) for t in (-0.35, 0.35)]
    d.polygon(pts, fill=BLUE)


def hdim(x1, x2, y, from_y, label):
    for x in (x1, x2):
        line([(x, from_y), (x, y + 9)])
    line([(x1, y), (x2, y)])
    arrow((x1, y), (x2, y))
    arrow((x2, y), (x1, y))
    text((x1 + x2) / 2, y - 8, label, 27, BLUE, 'mb')


def vdim(y1, y2, x, from_x, label):
    for y in (y1, y2):
        line([(from_x, y), (x - 9, y)])
    line([(x, y1), (x, y2)])
    arrow((x, y1), (x, y2))
    arrow((x, y2), (x, y1))
    text(x + 14, (y1 + y2) / 2, label, 27, BLUE, 'lm')


def leader(points, label, tx, ty):
    line(points)
    d.ellipse((points[0][0]-4, points[0][1]-4, points[0][0]+4, points[0][1]+4), fill=BLUE)
    text(tx, ty, label, 27, BLUE)


def fmt(v):
    return f'{v:.3f}'.rstrip('0').rstrip('.').replace('.', ',')


def load(folder, rotation=0):
    return {n: affinity.rotate(read_contour(ROOT / folder / f'cnc-{n}.dxf'), rotation, origin=(0, 0)) for n in ('opening', 'rebate')}


def place(contours, left=None, right=None, top=None, bottom=None, center=None):
    x0, y0, x1, y1 = contours['rebate'].bounds
    dx = left-x0 if left is not None else right-x1 if right is not None else center-(x0+x1)/2
    dy = top-y1 if top is not None else bottom-y0
    return {n: affinity.translate(p, dx, dy) for n, p in contours.items()}, (dx, dy)


# Whole PN532 assembly rotates 90° CCW: photo-right becomes final lid-back.
# NeoPixel and front use the active exported CNC orientation (+X right, +Y up).
pn, pn_shift = place(load('pn532-mount', 90), right=245, top=175)
neo, neo_shift = place(load('neopixel-stick-mount'), center=125, top=175)
esp, esp_shift = place(load('feather-window-mount'), right=245, bottom=10)
assert abs(250-pn['rebate'].bounds[2]-5) < 1e-8
assert abs(180-pn['rebate'].bounds[3]-5) < 1e-8
assert abs(180-neo['rebate'].bounds[3]-5) < 1e-8
assert abs((neo['rebate'].bounds[0]+neo['rebate'].bounds[2])/2-125) < 1e-8
assert abs(250-esp['rebate'].bounds[2]-5) < 1e-8
assert abs(esp['rebate'].bounds[1]-10) < 1e-8
assert box(0, 0, 250, 180).contains(pn['rebate'])
assert box(0, 0, 250, 180).contains(neo['rebate'])
assert box(0, 0, 250, 110).contains(esp['rebate'])
assert not neo['rebate'].intersects(pn['rebate'])

text(80, 42, 'BOXBERT  |  CNC-Positionierung', 46)
text(80, 108, 'Alle Maße in mm · Außenansichten · Randabstände zur äußersten Falzkontur', 28)
text(80, 153, 'Maßzahlen gelten. Bild nicht als 1:1-Schablone verwenden.', 25, GRAY)

X, LY, FY = 165, 300, 1540


def xy(p, y, height):
    return X + p[0]*S, y + (height-p[1])*S


def panel(y, height, modules):
    d.rectangle((X, y, X+1250, y+height*S), fill=WOOD, outline=INK, width=3)
    for contours in modules:
        for n, fill, edge in [('rebate', REBATE, '#815c32'), ('opening', HOLE, INK)]:
            pts = [xy(p, y, height) for p in contours[n].exterior.coords]
            d.polygon(pts, fill=fill)
            line(pts, edge, 2)


text(80, 225, 'A  DECKEL — von oben', 32)
panel(LY, 180, [neo, pn])
hdim(X, X+1250, 280, LY, '250')
vdim(LY, LY+900, 80, X, '180')
text(X+15, LY+855, 'VORNE / DISPLAYSEITE', 25, GRAY)
text(X+15, LY+22, 'HINTEN', 23, GRAY)
# Centerline; the NeoPixel center refers to the actual rebate envelope.
cx = X+125*S
for yy in range(LY-8, LY+270, 22):
    line([(cx, yy), (cx, yy+12)], GRAY, 1)
nb = neo['rebate'].bounds
pb = pn['rebate'].bounds
text(cx, LY+(180-nb[1])*S+20, 'NeoPixel · mittig', 28, anchor='mt')
hdim(X, cx, 610, 555, '125 bis Mitte')
text(X+(pb[0]+pb[2])/2*S, LY+(180-pb[1])*S+25, 'RFID / PN532', 28, anchor='mt')
# Gap arrows sit on exact envelope limits; leaders name the short dimensions.
for contours, tx, label_y in [(neo, cx-150, 196), (pn, X+1120, 196)]:
    p = max(contours['rebate'].exterior.coords, key=lambda p: p[1])
    px, py = xy(p, LY, 180)
    line([(px, LY), (px, py)])
    arrow((px, LY), (px, py)); arrow((px, py), (px, LY))
    leader([(px, (LY+py)/2), (px-35, 245), (tx+40, 245)], '5', tx+25, label_y+40)
p = max(pn['rebate'].exterior.coords, key=lambda p: p[0])
px, py = xy(p, LY, 180)
line([(px, py), (X+1250, py)])
arrow((px, py), (X+1250, py)); arrow((X+1250, py), (px, py))
leader([((px+X+1250)/2, py), (1470, py+40), (1470, 900)], '5 rechts', 1435, 915)
text(X+20, 1050, 'Nur diese zwei Fenster positioniert.', 26, GRAY)
text(X+20, 1090, 'Buttons, Leisten und weitere Bohrungen nicht dargestellt.', 24, GRAY)

text(1535, 255, 'FRÄSKONTUREN', 30)
text(1535, 308, 'Braun: Falz, 3 mm tief', 24)
text(1535, 347, 'Weiß: durch das Holz', 24)
text(1535, 420, 'NeoPixel', 29)
text(1535, 466, 'Falz-Hülle:', 25)
text(1535, 503, f'{fmt(nb[2]-nb[0])} × {fmt(nb[3]-nb[1])}', 27)
text(1535, 546, 'Durchbruch: 58,4 × 14,3', 24)
text(1535, 625, 'RFID / PN532', 29)
text(1535, 672, 'Falz-Hülle, eingebaut:', 25)
text(1535, 710, f'{fmt(pb[2]-pb[0])} × {fmt(pb[3]-pb[1])}', 27)
text(1535, 753, 'Durchbruch: 45,2 × 47,5', 24)
text(1535, 796, 'DXF + Halter gemeinsam', 23)
text(1535, 830, 'um 90° gegen Uhrzeiger', 23)
text(1535, 864, 'drehen.', 23)
text(1535, 955, 'Wichtig', 29)
text(1535, 1002, 'Hüllmaß ist nicht die', 24)
text(1535, 1038, 'Fräskontur. Die Wellen', 24)
text(1535, 1074, 'aus der DXF übernehmen.', 24)

text(80, 1300, 'B  FRONT — von außen, aufrecht', 32)
text(80, 1350, 'Platte 250 × 110 × 12 laut bestehendem CAD; tatsächlichen Zuschnitt prüfen.', 25, GRAY)
hdim(X, X+1250, 1485, FY, '250')
panel(FY, 110, [esp])
vdim(FY, FY+550, 80, X, '110')
eb = esp['rebate'].bounds
text(X+35, FY+40, 'OBEN / DECKEL', 25, GRAY)
text(X+35, FY+490, 'UNTEN / BODEN', 25, GRAY)
text(X+(eb[0]+eb[2])/2*S, FY+(110-eb[3])*S-25, 'ESP32 / TFT', 28, anchor='mb')
p = max(esp['rebate'].exterior.coords, key=lambda p: p[0])
px, py = xy(p, FY, 110)
line([(px, py), (X+1250, py)])
arrow((px, py), (X+1250, py)); arrow((X+1250, py), (px, py))
leader([((px+X+1250)/2, py), (1465, py+35), (1465, 1940)], '5 rechts', 1435, 1960)
p = min(esp['rebate'].exterior.coords, key=lambda p: p[1])
px, py = xy(p, FY, 110)
line([(px, py), (px, FY+550)])
arrow((px, py), (px, FY+550)); arrow((px, FY+550), (px, py))
leader([(px, (py+FY+550)/2), (px-65, 2140), (1000, 2140)], '10 unten (Inlay)', 1000, 2153)
text(1535, 1510, 'ESP32 / TFT', 29)
text(1535, 1560, 'Falz-Hülle:', 25)
text(1535, 1600, f'{fmt(eb[2]-eb[0])} × {fmt(eb[3]-eb[1])}', 27)
text(1535, 1665, 'Grunddurchbruch:', 25)
text(1535, 1705, '64,8 × 36,86', 27)
text(1535, 1747, '+ JST-Auslass laut DXF', 24)
text(1535, 1820, '10 mm unten sind', 24)
text(1535, 1857, 'Abstand zur Holzkante,', 24)
text(1535, 1894, 'nicht die Frästiefe.', 24)

line([(80, 2230), (2020, 2230)], '#c7cdd0')
text(80, 2250, 'Fertigung: nur von außen. Zuerst Wellenfalz 3 mm tief, dann Durchbruch.', 27)
text(80, 2295, '12 mm Holz nominal. Keine Innentasche. USB-Aussparung am ESP bleibt Handarbeit.', 25)
text(80, 2345, 'Vor Fertigung klären: Schraubenreserve unter PN532-/NeoPixel-Falz, reale Passung und Glasfixierung.', 24, '#9a3b1b')
text(80, 2390, 'Positionierungsblatt, keine Gesamtfreigabe. Aktive cnc-opening.dxf / cnc-rebate.dxf sind maßgeblich.', 24, GRAY)
im.save(OUT / 'boxbert-cnc-positionierung.png')
im.save(OUT / 'boxbert-cnc-positionierung.pdf', resolution=180)

records = {}
for name, contours, shift, rotation, stock in [('pn532', pn, pn_shift, 90, [250,180]), ('neopixel', neo, neo_shift, 0, [250,180]), ('esp32', esp, esp_shift, 0, [250,110])]:
    records[name] = {'stock_mm': stock, 'rotation_deg_ccw': rotation, 'translation_mm': shift,
                     'rebate_bounds_mm': list(contours['rebate'].bounds),
                     'opening_bounds_mm': list(contours['opening'].bounds)}
    print(name, json.dumps(records[name]))
print(f'PASS specified edge gaps, NeoPixel centering, panel containment; lid rebate separation {neo["rebate"].distance(pn["rebate"]):.3f} mm')
(OUT / 'placement.json').write_text(json.dumps(records, indent=2)+'\n')
print(OUT / 'boxbert-cnc-positionierung.png')
