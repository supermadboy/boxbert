#!/usr/bin/env bash
# Reproduzierbarer STL-Export und Konzeptbilder; keine Druckfreigabe.
set -euo pipefail
cd "$(dirname "$0")"
export QT_QPA_PLATFORM="${QT_QPA_PLATFORM:-offscreen}"
openscad --backend=CGAL --hardwarnings --export-format binstl -o stepup_mount.stl stepup_mount.scad
common=(--hardwarnings --preview --imgsize=1100,900 --colorscheme=Tomorrow --projection=o)
openscad "${common[@]}" --camera=13,16,5,55,0,35,95 \
  -D 'show_board=false' -D 'show_insert=false' -o iso.png stepup_mount.scad
openscad "${common[@]}" --camera=13,16,0,0,0,0,95 \
  -D 'show_board=false' -D 'show_insert=false' -o top.png stepup_mount.scad
openscad "${common[@]}" --camera=13,16,5,55,0,35,95 \
  -o iso-board.png stepup_mount.scad
openscad "${common[@]}" --camera=13,16,0,0,0,0,95 \
  -o top-board.png stepup_mount.scad
openscad "${common[@]}" --camera=13,16,5,90,0,90,95 \
  -o side-board.png stepup_mount.scad
