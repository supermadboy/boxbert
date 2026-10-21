#!/usr/bin/env bash
# Export/validate the three actual CNC models; preserve existing printed STLs.
set -euo pipefail
cd "$(dirname "$0")"
script="$PWD/$(basename "$0")"
pkgs=github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5
if [[ ${BOXBERT_WAVE_TOOLS:-0} != 1 ]]; then
  export BOXBERT_WAVE_TOOLS=1
  exec nix shell "$pkgs#openscad" "$pkgs#xvfb-run" --command bash "$script" "$@"
fi
if [[ -z ${BOXBERT_PYTHON:-} ]]; then
  # shellcheck disable=SC2016
  python_env=$(nix build --impure --no-link --print-out-paths --expr '
    let flake = builtins.getFlake "github:NixOS/nixpkgs/0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5";
        p = flake.legacyPackages.${builtins.currentSystem};
    in p.python3.withPackages (ps: [ps.pillow ps.shapely])')
  export BOXBERT_PYTHON="$python_env/bin/python3"
fi
if [[ -z ${BOXBERT_MESA:-} ]]; then
  export BOXBERT_MESA
  BOXBERT_MESA=$(nix build --no-link --print-out-paths "$pkgs#mesa.drivers")
fi
export LIBGL_DRIVERS_PATH="$BOXBERT_MESA/lib/dri"
export LD_LIBRARY_PATH="$BOXBERT_MESA/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export LIBGL_ALWAYS_SOFTWARE=1 QT_QPA_PLATFORM=xcb __GLX_VENDOR_LIBRARY_NAME=mesa
if [[ ${BOXBERT_WAVE_XVFB:-0} != 1 ]]; then
  export BOXBERT_WAVE_XVFB=1
  exec xvfb-run -a -s '-screen 0 1280x1024x24 +extension GLX' bash "$script" "$@"
fi
for folder in pn532-mount neopixel-stick-mount feather-window-mount; do
  (
    cd "../$folder"
    mkdir -p logs
    case "$folder" in
      pn532-mount) source=panel_cnc; part=panel; center=21.35,20.2,25; zoom=235 ;;
      neopixel-stick-mount) source=panel_cnc; part=local; center=27,4.95,19; zoom=230 ;;
      feather-window-mount) source=front_cnc; part=local; center=25.4,12.5,29; zoom=265 ;;
    esac
    openscad --version >logs/wave-tool-version.log 2>&1
    openscad --hardwarnings --export-format binstl -o "$source.stl" "$source.scad" >logs/wave-panel-export.log 2>&1
    for contour in opening rebate glass; do
      openscad --hardwarnings -D "part=\"$contour\"" -o "cnc-$contour.dxf" "$source.scad" >"logs/wave-$contour-export.log" 2>&1
    done
    "$BOXBERT_PYTHON" check_cnc.py | tee logs/wave-cnc-check.log
    "$BOXBERT_PYTHON" check_mesh.py | tee logs/wave-mount-mesh-check.log
    if [[ ${1:-} == --fit ]]; then
      status=0
      "$BOXBERT_PYTHON" check_fit.py >logs/wave-fit-check.log 2>&1 || status=$?
      echo "$status" >logs/wave-fit-status.txt
      # 2 explicitly means unresolved, pre-existing NeoPixel head clearance.
      if [[ $folder != neopixel-stick-mount || $status != 2 ]]; then
        if (( status != 0 )); then exit "$status"; fi
      else
        printf '%s\n' 'OPEN: NeoPixel screw-head/component clearance; NOT a full fit PASS.'
      fi
    fi
    for view in top iso; do
      angles=0,0,0
      if [[ $view == iso ]]; then angles=48,0,28; fi
      openscad --hardwarnings --preview --imgsize=1200,950 --colorscheme=Tomorrow --projection=o \
        --camera="$center,$angles,$zoom" -D "part=\"$part\"" -o "wave-$view.png" "$source.scad" >"logs/wave-$view.log" 2>&1
    done
    # Refresh existing assembly images too, so none still depicts the old glass.
    for scene in outside exploded inside section; do
      case "$scene" in
        outside) name=outside; angles=0,0,0 ;;
        exploded) name=exploded; angles=60,0,25 ;;
        inside) name=seated-inside; angles=140,0,210 ;;
        section) name=height-raw; angles=90,0,0 ;;
      esac
      if [[ $folder == feather-window-mount ]]; then
        if [[ $scene == outside ]]; then name=front-full; fi
        if [[ $scene == section ]]; then name=height-side; fi
      fi
      openscad --hardwarnings --preview --imgsize=1200,950 --colorscheme=Tomorrow --projection=o \
        --camera="$center,$angles,300" -D "scene=\"$scene\"" -o "$name.png" assembly.scad >"logs/wave-assembly-$scene.log" 2>&1
    done
    if [[ $folder == neopixel-stick-mount ]]; then
      openscad --hardwarnings --preview --imgsize=1200,950 --colorscheme=Tomorrow --projection=o \
        --camera=-14.6,5.08,1,0,0,0,360 -o cnc-compare-raw.png cnc_compare.scad >logs/wave-compare.log 2>&1
    fi
    if [[ -f annotate.py ]]; then "$BOXBERT_PYTHON" annotate.py; fi
  )
done
"$BOXBERT_PYTHON" wave_overview.py
