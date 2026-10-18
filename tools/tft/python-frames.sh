#!/bin/sh
# Pinned Python + Pillow, not an ambient interpreter with accidental packages.
set -eu
exec nix --extra-experimental-features 'nix-command flakes' shell --expr 'let pkgs = import (builtins.getFlake "github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5").outPath { system = "x86_64-linux"; }; in pkgs.python3.withPackages (p: [p.pillow])' --command python3 -B "$@"
