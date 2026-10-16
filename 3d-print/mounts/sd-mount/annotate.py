#!/usr/bin/env python3
"""Label actual OpenSCAD renders; no synthetic replacement for geometry."""
from pathlib import Path
import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
font_root = os.environ.get('BOXBERT_FONT_ROOT')
if not font_root:
    font_root = subprocess.check_output([
        'nix', 'build', '--no-link', '--print-out-paths',
        'github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5#dejavu_fonts'
    ], text=True).strip()
FONT = str(Path(font_root)/'share/fonts/truetype/DejaVuSans.ttf')


def label(source, target, title, lines):
    image = Image.open(ROOT/source).convert('RGB')
    canvas = Image.new('RGB', (image.width, image.height+180), '#171b22')
    canvas.paste(image, (0, 180))
    draw = ImageDraw.Draw(canvas)
    title_font = ImageFont.truetype(FONT, 31)
    text_font = ImageFont.truetype(FONT, 23)
    draw.text((28, 18), title, font=title_font, fill='#f5f5f5')
    for i, line in enumerate(lines):
        draw.text((28, 65+i*34), line, font=text_font, fill='#cbd5e1')
    canvas.save(ROOT/target)


if __name__ == '__main__':
    label('iso-board.png', 'overview.png', 'SD-Halter HW-125 | 44 x 56 x 12 mm', [
        'Vier gestufte Pfosten, ruthex M2,5 von unten; zwei Holzschrauben seitlich.',
        'Transparente PCB; Blau: Steckerraum. Violett: Kartenweg. Rot: Unterseitenhülle.',
        'Hardwarehöhen/Lochraster teils angenommen. Erst Passprobe, kein Gehäuselayout.'])
    label('side-board.png', 'height-side.png', 'SD-Halter | gerade Seitenansicht', [
        'Gitter z=0..2 mm | breiter Pfosten bis z=8 | PCB-Auflage z=12 mm.',
        'PCB z=12..13,6 mm (Dicke angenommen); 4 mm Höhenstaffelung am Pfosten.',
        'Inserts z=0,2..5,9 mm, von unten. Kopf maximal Ø4 / Höhe 1,8 mm.'])
