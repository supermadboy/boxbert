#!/usr/bin/env bash
# Actual export and fresh previews. No physical fit/safety approval.
set -euo pipefail
cd "$(dirname "$0")"
export QT_QPA_PLATFORM="${QT_QPA_PLATFORM:-offscreen}"
mkdir -p logs
openscad --backend=CGAL --hardwarnings --export-format binstl \
  -o feather_window_mount.stl feather_window_mount.scad >logs/export.log 2>&1
common=(--hardwarnings --preview --imgsize=1200,950 --colorscheme=Tomorrow --projection=o)
openscad "${common[@]}" --camera=25.4,11.43,7,55,0,35,150 \
  -D 'show_board=false' -o iso.png feather_window_mount.scad >logs/iso.log 2>&1
openscad "${common[@]}" --camera=25.4,11.43,7,0,0,0,205 \
  -D 'show_board=false' -o top.png feather_window_mount.scad >logs/top.log 2>&1
openscad "${common[@]}" --camera=25.4,11.43,7,55,0,35,150 \
  -o iso-board.png feather_window_mount.scad >logs/iso-board.log 2>&1
openscad "${common[@]}" --camera=25.4,11.43,7,0,0,0,205 \
  -o top-board.png feather_window_mount.scad >logs/top-board.log 2>&1
openscad "${common[@]}" --camera=25.4,11.43,7,90,0,90,150 \
  -o side-board.png feather_window_mount.scad >logs/side-board.log 2>&1
openscad "${common[@]}" --camera=14,11.43,7,125,0,215,190 \
  -D 'show_connections=true' -o connections.png feather_window_mount.scad >logs/connections.log 2>&1
openscad "${common[@]}" --camera=25.4,11.43,10,90,0,90,170 \
  -D 'show_installation=true' -o installation.png feather_window_mount.scad >logs/installation.log 2>&1
python check_mesh.py | tee logs/mesh-check.log
