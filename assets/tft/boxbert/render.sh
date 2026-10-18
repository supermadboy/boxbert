#!/bin/sh
# Local Nix closure only: no root, ports, project flake/lock changes.
set -eu
cd "$(dirname "$0")/../../.."
PIN=github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5
nix --extra-experimental-features 'nix-command flakes' shell "$PIN#blender" --command blender --background --factory-startup --python-exit-code 1 --python assets/tft/boxbert/scene.py -- "${1:-assets/tft/boxbert/masters}"
sh tools/tft/python-frames.sh tools/tft/convert-frames.py --normalize-masters "${1:-assets/tft/boxbert/masters}" "${2:-assets/tft/boxbert}"
