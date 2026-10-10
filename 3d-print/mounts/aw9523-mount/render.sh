#!/usr/bin/env bash
# Neuaufbau AW9523: nur aktuelle Dateien/Logs, keine physische Freigabe.
set -euo pipefail
cd "$(dirname "$0")"
export QT_QPA_PLATFORM="${QT_QPA_PLATFORM:-offscreen}"
openscad --backend=CGAL --hardwarnings --export-format binstl -o aw9523_mount.stl aw9523_mount.scad
common=(--hardwarnings --preview --imgsize=1100,900 --colorscheme=Tomorrow --projection=o)
openscad "${common[@]}" --camera=28,13,6,55,0,35,125 -D 'show_board=false' -o iso.png aw9523_mount.scad
openscad "${common[@]}" --camera=28,13,0,0,0,0,125 -D 'show_board=false' -o top.png aw9523_mount.scad
openscad "${common[@]}" --camera=28,13,6,55,0,35,125 -o iso-board.png aw9523_mount.scad
openscad "${common[@]}" --camera=28,13,0,0,0,0,125 -o top-board.png aw9523_mount.scad
openscad "${common[@]}" --camera=28,13,6,90,0,0,125 -o side-board.png aw9523_mount.scad
openscad "${common[@]}" --camera=28,13,0,180,0,0,125 -D 'show_board=false' -o bottom.png aw9523_mount.scad
