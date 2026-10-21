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
  # shellcheck disable=SC2016
  python_env=$(nix build --impure --no-link --print-out-paths --expr '
    let flake = builtins.getFlake "github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5";
        p = flake.legacyPackages.${builtins.currentSystem};
    in p.python3.withPackages (ps: [ps.pillow])')
  export BOXBERT_PYTHON="$python_env/bin/python3"
fi
export LIBGL_DRIVERS_PATH="$BOXBERT_MESA/lib/dri"
export LD_LIBRARY_PATH="$BOXBERT_MESA/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export LIBGL_ALWAYS_SOFTWARE=1
export QT_QPA_PLATFORM=xcb
export __GLX_VENDOR_LIBRARY_NAME=mesa
# Ignore the inherited NVIDIA/Xwayland display; always render headless.
if [[ ${BOXBERT_NEOPIXEL_XVFB:-0} != 1 ]]; then
  export BOXBERT_NEOPIXEL_XVFB=1
  exec xvfb-run -a -s '-screen 0 1280x1024x24 +extension GLX' bash "$script" "$@"
fi
mkdir -p logs
bash -n render.sh
shellcheck render.sh
openscad --version >logs/tool-version.log 2>&1
# Historical reference integrity only; measured PCB now drives geometry.scad.
python3 ../../../docs/cad/neopixel-stick/verify_source.py | tee logs/source-check.log
openscad --hardwarnings --export-format binstl -o neopixel_mount.stl neopixel_mount.scad >logs/export.log 2>&1
openscad --hardwarnings --export-format binstl -o panel_cnc.stl panel_cnc.scad >logs/panel-export.log 2>&1
for part in opening rebate glass; do
  openscad --hardwarnings -D "part=\"$part\"" -o "cnc-$part.dxf" panel_cnc.scad >"logs/cnc-$part.log" 2>&1
done
python3 check_mesh.py | tee logs/mesh-check.log
python3 check_cnc.py | tee logs/cnc-check.log
fit_status=0
python3 check_fit.py | tee logs/fit-check.log || fit_status=$?
# Status 2 means explicitly reported open head clearance, NOT a fit approval.
if (( fit_status != 0 && fit_status != 2 )); then exit "$fit_status"; fi
common=(--hardwarnings --preview '--imgsize=1200,950' --colorscheme=Tomorrow --projection=o)
preview(){
  local name=$1 source=$2 camera=$3
  shift 3
  openscad "${common[@]}" --camera="$camera" "$@" -o "$name.png" "$source" >"logs/$name.log" 2>&1
}
preview iso neopixel_mount.scad 23,0,9,55,0,35,165 -D 'show_board=false'
preview iso-board neopixel_mount.scad 23,0,9,55,0,35,165
preview top-board neopixel_mount.scad 30,8,9,0,0,0,180
preview height-raw assembly.scad 23,0,12,90,0,0,210 -D 'scene="section"'
preview exploded assembly.scad 23,0,12,60,0,25,235 -D 'scene="exploded"'
preview seated-inside assembly.scad 23,0,10,140,0,210,245 -D 'scene="inside"'
preview outside assembly.scad 27,69.54,20,0,0,0,640 -D 'scene="outside"'
preview cnc-compare-raw cnc_compare.scad -14.6,5.08,1,0,0,0,360
"${BOXBERT_PYTHON:-python3}" annotate.py
exit "$fit_status"
