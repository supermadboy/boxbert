#!/usr/bin/env python3
"""Print shell exports for the pinned test browser, with usable fonts."""
from pathlib import Path
import shlex
import subprocess

REF = 'github:NixOS/nixpkgs/494ce7fd23ff6a5dff39e1fb11e9b6f2ac74bf25'
cache = Path.home() / '.cache/boxbert-browser'
cache.mkdir(parents=True, exist_ok=True)
paths = []
for attr in ('chromium', 'dejavu_fonts'):
    result = subprocess.check_output(['nix', 'build', '--out-link', str(cache / attr), '--print-out-paths', f'{REF}#{attr}'], text=True)
    paths.append(result.strip().splitlines()[-1])
fonts = cache / 'fonts.conf'
fonts.write_text(f'''<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig><dir>{paths[1]}/share/fonts</dir><cachedir>{cache}/font-cache</cachedir>
<alias><family>system-ui</family><prefer><family>DejaVu Sans</family></prefer></alias>
<alias><family>sans-serif</family><prefer><family>DejaVu Sans</family></prefer></alias>
<alias><family>sans</family><prefer><family>DejaVu Sans</family></prefer></alias>
</fontconfig>''')
print('export CHROMIUM_PATH=' + shlex.quote(paths[0] + '/bin/chromium'))
print('export FONTCONFIG_FILE=' + shlex.quote(str(fonts)))
