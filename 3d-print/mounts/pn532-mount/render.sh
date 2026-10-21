#!/usr/bin/env bash
# User-only pinned CAD toolchain. No system changes and no flake.lock update.
set -euo pipefail
cd "$(dirname "$0")"
script="$PWD/$(basename "$0")"
if ! command -v openscad >/dev/null || ! command -v xvfb-run >/dev/null || ! command -v shellcheck >/dev/null; then
  pkgs=github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5
  exec nix shell "$pkgs#openscad" "$pkgs#xvfb-run" "$pkgs#shellcheck" --command bash "$script" "$@"
fi
if [[ -z ${BOXBERT_MESA:-} ]]; then
  export BOXBERT_MESA
  BOXBERT_MESA=$(nix build --no-link --print-out-paths github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5#mesa.drivers)
fi
if [[ -z ${BOXBERT_PYTHON:-} ]]; then
  # Nix interpolation below is intentional, not shell interpolation.
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
export __GLX_VENDOR_LIBRARY_NAME=mesa
# Always use our headless X server, not an inherited NVIDIA/Xwayland DISPLAY.
if [[ ${BOXBERT_XVFB:-0} != 1 ]]; then
  export BOXBERT_XVFB=1
  exec xvfb-run -a -s '-screen 0 1280x1024x24 +extension GLX' bash "$script" "$@"
fi
mkdir -p logs
bash -n render.sh
shellcheck render.sh
openscad --version >logs/tool-version.log 2>&1
openscad --hardwarnings --export-format binstl -o pn532_mount.stl pn532_mount.scad >logs/export.log 2>&1
"$BOXBERT_PYTHON" check_mesh.py | tee logs/mesh-check.log
openscad --hardwarnings --export-format binstl -o panel_cnc.stl panel_cnc.scad >logs/panel-export.log 2>&1
for part in opening rebate glass; do
  openscad --hardwarnings -D "part=\"$part\"" -o "cnc-$part.dxf" panel_cnc.scad >"logs/cnc-$part.log" 2>&1
done
"$BOXBERT_PYTHON" check_cnc.py | tee logs/cnc-check.log
"$BOXBERT_PYTHON" check_fit.py | tee logs/fit-check.log
common=(--hardwarnings --preview '--imgsize=1200,950' --colorscheme=Tomorrow --projection=o)
preview(){
  local name=$1 source=$2 camera=$3
  shift 3
  openscad "${common[@]}" --camera="$camera" "$@" -o "$name.png" "$source" >"logs/$name.log" 2>&1
}
preview iso pn532_mount.scad 20,20,10,55,0,35,185 -D 'show_board=false'
preview iso-board pn532_mount.scad 20,20,10,55,0,35,185
preview top-board pn532_mount.scad 20,20,10,0,0,0,185
preview height-raw assembly.scad 20,20,16,90,0,0,195 -D 'scene="section"'
preview exploded assembly.scad 20,20,13,60,0,25,300 -D 'scene="exploded"'
preview seated-inside assembly.scad 20,20,12,140,0,210,260 -D 'scene="inside"'
preview outside assembly.scad 20,20,15,0,0,0,240 -D 'scene="outside"'
"$BOXBERT_PYTHON" annotate.py
