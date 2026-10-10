#!/usr/bin/env bash
# Reproduzierbarer STL-Export und Konzeptbilder; keine Druckfreigabe.
set -euo pipefail
cd "$(dirname "$0")"
export QT_QPA_PLATFORM="${QT_QPA_PLATFORM:-offscreen}"
openscad --backend=CGAL --hardwarnings --export-format binstl -o aw9523_mount.stl aw9523_mount.scad
common=(--hardwarnings --preview --imgsize=1100,900 --colorscheme=Tomorrow --projection=o)
openscad "${common[@]}" --camera=22,13,5,55,0,35,95 \
  -D 'show_board=false' -D 'show_pins=false' -D 'show_insert=false' \
  -o iso.png aw9523_mount.scad
openscad "${common[@]}" --camera=22,13,0,0,0,0,95 \
  -D 'show_board=false' -D 'show_pins=false' -D 'show_insert=false' \
  -o top.png aw9523_mount.scad
openscad "${common[@]}" --camera=22,13,5,55,0,35,95 \
  -o iso-board.png aw9523_mount.scad
openscad "${common[@]}" --camera=22,13,0,0,0,0,95 \
  -o top-board.png aw9523_mount.scad
openscad "${common[@]}" --camera=22,13,5,90,0,90,95 \
  -o side-board.png aw9523_mount.scad
