#!/usr/bin/env python3
"""Add readable captions to REAL OpenSCAD renders; never synthesize CAD views."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parent
fontfile=next(Path('/nix/store').glob('*dejavu-fonts*/share/fonts/truetype/DejaVuSans.ttf'))
def font(n):return ImageFont.truetype(str(fontfile),n)
def lines(draw,xy,text,size=30,fill='#d9e3ef',step=44):
    x,y=xy
    for line in text.split('\n'):
        draw.text((x,y),line,font=font(size),fill=fill);y+=step

def overview():
    canvas=Image.new('RGB',(1600,1010),'#151c27');d=ImageDraw.Draw(canvas)
    lines(d,(40,24),'NeoPixel-Mount · kompakter Rand, gleiche Tiefe',40,step=50)
    for x,name,label in [(0,'iso-board.png','Mit Platine · DIN links'),(800,'iso.png','Nur Druckteil · keine hinteren Holzlaschen')]:
        im=Image.open(ROOT/name).convert('RGB').resize((800,633),Image.Resampling.LANCZOS)
        canvas.paste(im,(x,95));lines(d,(x+25,747),label,27)
    lines(d,(40,810),'Durchbruch: 55,2 × 14,56 mm · nur 2,2 mm je Platinenseite.\nKabel links heraus; beide Holzlaschen vorne nahe der Mitte.',31,step=48)
    lines(d,(40,936),'Digital geprüft · reales Modul vor Druck abgleichen · keine Fertigungsfreigabe',24,fill='#a7b4c6')
    canvas.save(ROOT/'overview.png')

def height():
    canvas=Image.new('RGB',(1800,1060),'#151c27');d=ImageDraw.Draw(canvas)
    lines(d,(35,22),'Gerader Höhenschnitt · +z zeigt nach außen',38)
    im=Image.open(ROOT/'height-raw.png').convert('RGB')
    canvas.paste(im,(0,85))
    lines(d,(1220,120),'Nominale Ebenen z [mm]',31)
    lines(d,(1220,185),'24,0  Holz / Glas außen\n21,0  Glas unten\n18,5  M2-Schraubkopf oben\n18,0  LED-Oberseite\n16,5  PCB oben / Führung\n14,9  PCB-Unterseite\n12,0  Holzanschlag\n  8,5  Holzlasche unten\n  2,0  Gitterboden oben\n  0,0  Druckteil-Unterseite',27,step=49)
    lines(d,(1220,730),'LED → Glas: 3 mm\nGlasfalz: 3 mm tief\nHolz: 12 mm\nHöhen sind Entwurfsannahmen.',27,step=47)
    d.rectangle([0,1000,1800,1060],fill='#151c27')
    lines(d,(30,1015),'Orange: Druckteil · Grün: PCB · Hell: LEDs · Braun: Holz · Blau: Glas · kein Druck-/Passungstest',22,fill='#a7b4c6')
    canvas.save(ROOT/'height-side.png')

def comparison():
    canvas=Image.new('RGB',(1600,900),'#151c27');d=ImageDraw.Draw(canvas)
    lines(d,(35,24),'Fräsloch enger · gleiche Einbautiefe',42)
    raw=Image.open(ROOT/'cnc-compare-raw.png').convert('RGB')
    strip=raw.crop((0,290,1200,660)).resize((1600,493),Image.Resampling.LANCZOS)
    canvas.paste(strip,(0,100))
    lines(d,(170,620),'Bisher: 62,8 × 22,16 mm',30)
    lines(d,(860,620),'Neu: 55,2 × 14,56 mm',30)
    lines(d,(35,700),'Grün: PCB 50,8 × 10,16 mm · Dunkel: Durchbruch · Blau: Glasfalz',27)
    lines(d,(35,752),'Neu nur 2,2 mm Rand je PCB-Seite + 2 mm Falzrand.',29)
    lines(d,(35,804),'Falz neu: 59,2 × 18,56 mm · Tiefe weiterhin 3 mm · gleiche Skalierung',27)
    canvas.save(ROOT/'cnc-compare.png')

if __name__=='__main__':overview();height();comparison()
