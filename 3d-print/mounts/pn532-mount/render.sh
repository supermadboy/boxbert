#!/usr/bin/env bash
# Pinned, user-only, sequential CAD; never rewrites fabricated CNC artifacts.
set -euo pipefail
cd "$(dirname "$0")"
script="$PWD/$(basename "$0")"
pkgs=github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5
if [[ ${BOXBERT_PINNED:-0} != 1 ]]; then
  exec nix shell "$pkgs#openscad" "$pkgs#xvfb-run" "$pkgs#shellcheck" --command env BOXBERT_PINNED=1 bash "$script" "$@"
fi
if [[ -z ${BOXBERT_MESA:-} ]]; then
  BOXBERT_MESA=$(nix build --no-link --print-out-paths "$pkgs#mesa.drivers")
  export BOXBERT_MESA
fi
export LIBGL_DRIVERS_PATH="$BOXBERT_MESA/lib/dri"
export LD_LIBRARY_PATH="$BOXBERT_MESA/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export LIBGL_ALWAYS_SOFTWARE=1 QT_QPA_PLATFORM=xcb __GLX_VENDOR_LIBRARY_NAME=mesa
if [[ ${BOXBERT_XVFB:-0} != 1 ]]; then
  exec xvfb-run -a -s '-screen 0 1280x1024x24 +extension GLX' env BOXBERT_XVFB=1 bash "$script" "$@"
fi
mkdir -p logs/revision
bash -n render.sh
shellcheck render.sh
openscad --version >logs/revision/tool-version.log 2>&1
node --test revision.test.mjs >logs/revision/unit.log 2>&1
openscad --hardwarnings --export-format binstl -o pn532_mount.stl pn532_mount.scad >logs/revision/export.log 2>&1
for part in opening rebate glass; do
 openscad --hardwarnings -D "part=\"$part\"" -o "logs/revision/cnc-$part.dxf" panel_cnc.scad >"logs/revision/cnc-$part.log" 2>&1
 cmp "cnc-$part.dxf" "logs/revision/cnc-$part.dxf"
done
sha256sum cnc-opening.dxf cnc-rebate.dxf cnc-glass.dxf panel_cnc.stl pn532-glass.svg >logs/revision/cnc-unchanged.sha256
if [[ ${1:-} == --export-only ]]; then exit 0; fi
node check_revision.mjs | tee logs/revision/check.log
common=(--hardwarnings --preview '--imgsize=1200,950' --colorscheme=Tomorrow --projection=o)
preview(){
 local name=$1 source=$2 camera=$3; shift 3
 openscad "${common[@]}" --camera="$camera" "$@" -o "$name.png" "$source" >"logs/revision/$name.log" 2>&1
}
preview iso pn532_mount.scad 25,20,10,55,0,35,185 -D 'show_board=false'
preview iso-board assembly.scad 15,20,15,55,0,35,185 -D 'scene="photo"'
preview top-board assembly.scad 15,20,15,0,0,0,185 -D 'scene="photo_inspection"'
preview side-board pn532_mount.scad 25,20,13,90,0,0,190
preview seated-inside assembly.scad 20,20,15,35,0,0,250 -D 'scene="inside"'
preview height-side assembly.scad 20,20,18,90,0,0,285 -D 'scene="section"'
preview exploded assembly.scad 20,20,20,55,0,25,310 -D 'scene="exploded"'
node audit_revision.mjs | tee logs/revision/audit.log
