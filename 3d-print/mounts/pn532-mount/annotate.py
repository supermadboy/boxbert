#!/usr/bin/env python3
"""Caption real OpenSCAD renders; previews are not RF simulation."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parent
fontfile=next(Path('/nix/store').glob('*dejavu-fonts*/share/fonts/truetype/DejaVuSans.ttf'))
def lines(draw,xy,text,size=30,step=44,fill='#d9e3ef'):
    x,y=xy
    for line in text.split('\n'):
        draw.text((x,y),line,font=ImageFont.truetype(str(fontfile),size),fill=fill);y+=step

def overview():
    canvas=Image.new('RGB',(1600,1080),'#151c27');d=ImageDraw.Draw(canvas)
    lines(d,(35,20),'PN532-Mount · Messabgleich 21.10.2026 · Laschen links/oben',39)
    for x,name,label in [(0,'iso-board.png','Mit transparenter Platine'),(800,'iso.png','Nur Druckteil')]:
        im=Image.open(ROOT/name).convert('RGB').resize((800,633),Image.Resampling.LANCZOS)
        canvas.paste(im,(x,95));lines(d,(x+25,750),label,29)
    lines(d,(35,815),'Plexiglas: 3 mm · PCB zur Scheibe: nominal 2 mm\nDurchbruch: 47,5 × 45,2 mm · äußerer Falz: 51,5 × 49,2 mm',31,step=48)
    lines(d,(35,935),'I2C oben (+y), Kabel nach oben/innen · Wände unten/rechts · Antenne nur schematisch.\nPCB 1,15 mm · Löcher Ø2,93 · Lochraster 27,25 × 24,95 mm laut Nutzer. Steckerhülle ungemessen.\nDigital geprüft ist keine Druck-, Passungs- oder Lesereichweitenfreigabe.',24,step=38,fill='#a7b4c6')
    canvas.save(ROOT/'overview.png')

def height():
    canvas=Image.new('RGB',(1800,1100),'#151c27');d=ImageDraw.Draw(canvas)
    lines(d,(35,22),'Gerade Seitenansicht · Deckelausschnitt geöffnet',38)
    canvas.paste(Image.open(ROOT/'height-raw.png').convert('RGB'),(0,95))
    lines(d,(1220,110),'Nominale Ebenen z [mm]',30)
    lines(d,(1220,175),'30,5  Holz / Glas außen\n27,5  Glas unten\n27,0  M2-Kopf oben (max.)\n25,5  PCB außen\n24,35 PCB innen / Auflage\n23,0  Führungsspitze\n19,35 Elektronikhülle unten\n18,5  Holzanschlag\n15,0  Holzlasche unten\n  8,35 Steckerhülle unten\n  2,0  Gitterboden oben\n  0,0  Druckteil-Unterseite',26,step=45)
    lines(d,(1220,755),'PCB → Glas: 2 mm\nKopf → Glas: 0,5 mm\nBauteil-/Steckerhüllen angenommen.\nRF-Reichweite ungetestet.',26,step=43)
    lines(d,(30,1045),'Orange: Druckteil · Rot: PCB · Dunkel: Elektronik/Stecker · Braun: Holz · Blau: Glas/Kabel',24,fill='#a7b4c6')
    canvas.save(ROOT/'height-side.png')
if __name__=='__main__':overview();height()
