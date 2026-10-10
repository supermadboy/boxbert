#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export QT_QPA_PLATFORM="${QT_QPA_PLATFORM:-offscreen}"
for part in base bridge; do
 openscad --backend=CGAL --hardwarnings --export-format binstl -D "part=\"$part\"" -o "akku_${part}.stl" akku_mount.scad
done
common=(--hardwarnings --preview --imgsize=1100,900 --colorscheme=Tomorrow --projection=o)
for state in false true; do
 suffix=""; [[ "$state" == true ]] && suffix="-akku"
 openscad "${common[@]}" --camera=50,38,5,55,0,35,270 -D "show_battery=$state" -o "iso${suffix}.png" akku_mount.scad
 openscad "${common[@]}" --camera=50,38,0,0,0,0,220 -D "show_battery=$state" -o "top${suffix}.png" akku_mount.scad
 openscad "${common[@]}" --camera=50,38,5,90,0,0,220 -D "show_battery=$state" -o "side${suffix}.png" akku_mount.scad
done
python check_mesh.py base
python check_mesh.py bridge
