#!/usr/bin/env python3
"""Draw all current exported machining contours at the SAME scale."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from check_wave import read_contour

ROOT=Path(__file__).resolve().parent.parent
im=Image.new('RGB',(1920,1000),'#f6f3ec')
d=ImageDraw.Draw(im)
fonts=list(Path('/nix/store').glob('*dejavu-fonts*/share/fonts/truetype/DejaVuSans.ttf'))
def font(size):
    return ImageFont.truetype(str(fonts[0]),size) if fonts else ImageFont.load_default(size=size)
def text(pos,s,size=24,color='#243c45'):
    d.text(pos,s,font=font(size),fill=color)
text((55,35),'Boxbert | Wellenfalz für alle drei Fenster',40)
text((55,100),'Gleicher Maßstab · 10 mm an den Wellenbergen / 4 mm in den Tälern · 3 mm tief',25)
for col,(folder,title,waves) in enumerate([('pn532-mount','PN532',8),('neopixel-stick-mount','NeoPixel',6),('feather-window-mount','TFT / Feather',10)]):
    root=ROOT/folder
    opening,rebate,glass=[read_contour(root/f'cnc-{n}.dxf') for n in ('opening','rebate','glass')]
    left=35+col*635
    text((left+25,190),f'{title} · {waves} Wellen',30)
    d.rounded_rectangle((left,250,left+600,800),radius=18,fill='#dfc297')
    lo,bo,hi,to=rebate.bounds
    cx,cy=(lo+hi)/2,(bo+to)/2
    def xy(p): return (left+300+(p[0]-cx)*5.7,525-(p[1]-cy)*5.7)
    for poly,fill,edge in [(rebate,'#af8659','#785735'),(opening,'#263d46','#152c34')]:
        points=[xy(p) for p in poly.exterior.coords]
        d.polygon(points,fill=fill)
        d.line(points,fill=edge,width=2)
    text((left+25,835),f'Falz-Hüllmaß: {hi-lo:.2f} × {to-bo:.2f} mm',22)
text((55,905),'Passende gewellte Scheiben sind mit exportiert (0,2 mm Konturspiel).',24)
text((55,950),'Digitaler Entwurf – Holzschraubenreserve, Layout und reale Passung vor Fertigung prüfen.',22)
im.save(ROOT/'wellenfalz-uebersicht.png')
