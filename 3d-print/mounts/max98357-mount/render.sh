#!/usr/bin/env bash
# Vorschlagsbilder und Mount-only-STL; keine physische Abnahme.
set -euo pipefail
cd "$(dirname "$0")"
export QT_QPA_PLATFORM="${QT_QPA_PLATFORM:-offscreen}"
openscad --backend=CGAL --hardwarnings --export-format binstl -o max98357_mount.stl max98357_mount.scad
common=(--hardwarnings --preview --imgsize=1100,900 --colorscheme=Tomorrow --projection=o)
openscad "${common[@]}" --camera=19,13,6,55,0,35,110 -D 'show_board=false' -o iso.png max98357_mount.scad
openscad "${common[@]}" --camera=19,13,0,0,0,0,110 -D 'show_board=false' -o top.png max98357_mount.scad
openscad "${common[@]}" --camera=19,13,6,55,0,35,110 -o iso-board.png max98357_mount.scad
openscad "${common[@]}" --camera=19,13,0,0,0,0,110 -o top-board.png max98357_mount.scad
openscad "${common[@]}" --camera=19,13,6,90,0,90,110 -o side-board.png max98357_mount.scad
openscad "${common[@]}" --camera=19,13,5,180,0,0,110 -D 'show_board=false' -o bottom.png max98357_mount.scad
