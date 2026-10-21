#!/usr/bin/env bash
# Pinned, user-only CAD environment. No changes to the system or flake.lock.
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v openscad >/dev/null || ! command -v xvfb-run >/dev/null || ! command -v shellcheck >/dev/null; then
  pkgs=github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5
  exec nix shell "$pkgs#openscad" "$pkgs#xvfb-run" "$pkgs#shellcheck" --command bash "$0" "$@"
fi
# Xvfb's server AND OpenSCAD need Mesa; setting this after Xvfb starts is too late.
if [[ -z ${BOXBERT_MESA:-} ]]; then
  export BOXBERT_MESA
  BOXBERT_MESA=$(nix build --no-link --print-out-paths github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5#mesa.drivers)
fi
if [[ -z ${BOXBERT_PYTHON:-} ]]; then
  # shellcheck disable=SC2016
  python_env=$(nix build --impure --no-link --print-out-paths --expr '
    let flake = builtins.getFlake "github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5";
        p = flake.legacyPackages.${builtins.currentSystem};
    in p.python3.withPackages (ps: [ps.pillow ps.shapely])')
  export BOXBERT_PYTHON="$python_env/bin/python3"
fi
export LIBGL_DRIVERS_PATH="$BOXBERT_MESA/lib/dri"
export LD_LIBRARY_PATH="$BOXBERT_MESA/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export LIBGL_ALWAYS_SOFTWARE=1
export QT_QPA_PLATFORM=xcb
if [[ -z ${DISPLAY:-} ]]; then
  exec xvfb-run -a -s '-screen 0 1280x1024x24 +extension GLX' bash "$0" "$@"
fi
mkdir -p logs
bash -n render.sh
shellcheck render.sh
openscad --version >logs/tool-version.log 2>&1
# CGAL is default in the pinned OpenSCAD 2021.01; no unsupported --backend flag.
openscad --hardwarnings --export-format binstl \
  -o feather_window_mount.stl feather_window_mount.scad >logs/export.log 2>&1
openscad --hardwarnings --export-format binstl \
  -o front_cnc.stl front_cnc.scad >logs/front-export.log 2>&1
for part in opening rebate glass; do
  openscad --hardwarnings -D "part=\"$part\"" -o "cnc-$part.dxf" front_cnc.scad >"logs/cnc-$part.log" 2>&1
done
common=(--hardwarnings --preview '--imgsize=1200,950' --colorscheme=Tomorrow --projection=o)
preview() {
  local name=$1 source=$2 camera=$3
  shift 3
  openscad "${common[@]}" --camera="$camera" "$@" -o "$name.png" "$source" >"logs/$name.log" 2>&1
}
preview iso feather_window_mount.scad 25.4,11.43,12,55,0,35,180 -D 'show_board=false'
preview top feather_window_mount.scad 25.4,11.43,12,0,0,0,205 -D 'show_board=false'
preview iso-board feather_window_mount.scad 25.4,11.43,12,55,0,35,180
preview top-board feather_window_mount.scad 25.4,11.43,12,0,0,0,205
preview side-board feather_window_mount.scad 25.4,11.43,12,90,0,90,180
preview connections feather_window_mount.scad 14,11.43,12,125,0,215,200 -D 'show_connections=true'
preview installation assembly.scad 25.4,11.43,20,65,0,35,245 -D 'scene="section"'
preview exploded assembly.scad 25.4,11.43,15,55,0,35,270 -D 'scene="exploded"'
preview seated-inside assembly.scad 25.4,11.43,18,145,0,215,285 -D 'scene="inside"'
preview front-inner front_cnc.scad 25.4,11.43,28,45,0,35,300 -D 'part="inner-view"'
preview front-outer front_cnc.scad 25.4,11.43,28,45,0,35,300 -D 'part="local"'
preview height-side assembly.scad 25.4,11.43,23,90,0,0,230 -D 'scene="section"'
preview front-full assembly.scad 101,11.43,28,0,0,0,650 -D 'scene="outside"'
"$BOXBERT_PYTHON" check_mesh.py | tee logs/mesh-check.log
"$BOXBERT_PYTHON" check_cnc.py | tee logs/cnc-check.log
"$BOXBERT_PYTHON" check_fit.py | tee logs/fit-check.log
