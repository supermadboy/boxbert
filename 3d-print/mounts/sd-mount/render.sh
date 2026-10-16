#!/usr/bin/env bash
# User-only pinned CAD environment; no global configuration changes.
set -euo pipefail
cd "$(dirname "$0")"
pkgs=github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5
if [[ ${BOXBERT_SD_NIX_SHELL:-} != "$pkgs" ]]; then
  # Nixpkgs manual: Python environments / python.withPackages function.
  # Expand the guard and arguments only in the inner shell.
  # shellcheck disable=SC2016
  exec nix shell --impure --expr "
    let pkgs = import (builtins.getFlake \"$pkgs\") {};
    in [ pkgs.openscad pkgs.xvfb-run pkgs.shellcheck
         (pkgs.python3.withPackages (ps: [ ps.pillow ])) ]
  " --command bash -c 'export BOXBERT_SD_NIX_SHELL=$1; shift; exec bash ./render.sh "$@"' bash "$pkgs" "$@"
fi
if [[ -z ${BOXBERT_MESA:-} ]]; then
  export BOXBERT_MESA
  BOXBERT_MESA=$(nix build --no-link --print-out-paths "$pkgs#mesa.drivers")
fi
export LIBGL_DRIVERS_PATH="$BOXBERT_MESA/lib/dri"
export LD_LIBRARY_PATH="$BOXBERT_MESA/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export LIBGL_ALWAYS_SOFTWARE=1
export QT_QPA_PLATFORM=xcb
if [[ -z ${DISPLAY:-} ]]; then
  exec xvfb-run -a -s '-screen 0 1280x1024x24 +extension GLX' bash ./render.sh "$@"
fi
mkdir -p logs
bash -n render.sh
shellcheck render.sh
openscad --version >logs/tool-version.log 2>&1
openscad --hardwarnings --export-format binstl -o sd_mount.stl sd_mount.scad >logs/export.log 2>&1
python3 check_mesh.py | tee logs/mesh-check.log
common=(--hardwarnings --preview '--imgsize=1200,950' --colorscheme=Tomorrow --projection=o)
preview() {
  local name=$1 camera=$2
  shift 2
  openscad "${common[@]}" --camera="$camera" "$@" -o "$name.png" sd_mount.scad >"logs/$name.log" 2>&1
}
preview iso 22,28,6,55,0,30,170 -D 'show_board=false'
preview top 22,28,6,0,0,0,185 -D 'show_board=false'
preview iso-board 22,28,8,55,0,30,205
preview top-board 22,32.5,8,0,0,0,260
preview side-board 22,28,8,90,0,90,210
preview bottom 22,28,6,180,0,0,185 -D 'show_board=false'
python3 annotate.py
python3 check_fit.py | tee logs/fit-check.log
