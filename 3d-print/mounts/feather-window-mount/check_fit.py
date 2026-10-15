#!/usr/bin/env python3
"""Real CGAL solid intersections, including deliberate failing controls."""
import concurrent.futures
import os
from pathlib import Path
import struct
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent

def check(case):
    name, scene, shift, expected = case
    with tempfile.TemporaryDirectory(prefix="boxbert-fit-") as temp:
        target = Path(temp) / "intersection.stl"
        args = ["openscad", "--hardwarnings", "--export-format", "binstl",
                "-o", str(target), "-D", f'scene="{scene}"',
                "-D", f"shift={shift}", "assembly.scad"]
        result = subprocess.run(args, cwd=ROOT, text=True, capture_output=True,
                                env={**os.environ, "QT_QPA_PLATFORM": "offscreen"}, timeout=240)
        text = result.stdout + result.stderr
        (ROOT / "logs" / f"fit-{name}.log").write_text(text)
        empty = "Current top level object is empty" in text
        if empty:
            assert result.returncode in (0, 1), (name, text)
            volume = 0.0
        else:
            assert result.returncode == 0 and target.exists(), (name, text)
            raw = target.read_bytes()
            count = struct.unpack_from("<I", raw, 80)[0]
            assert len(raw) == 84 + 50 * count, name
            volume = 0.0
            for i in range(count):
                v = struct.unpack_from("<12fH", raw, 84 + i * 50)
                a, b, c = v[3:6], v[6:9], v[9:12]
                volume += (a[0]*(b[1]*c[2]-b[2]*c[1]) +
                           a[1]*(b[2]*c[0]-b[0]*c[2]) +
                           a[2]*(b[0]*c[1]-b[1]*c[0])) / 6
            volume = abs(volume)
            assert "WARNING" not in text, (name, text)
        assert (volume > 0.001) == expected, (name, volume, text)
        prefix = 'MANUAL STEP REQUIRED' if name.startswith('KNOWN-LIMIT') else 'PASS'
        return f"{prefix} {name}: intersection {volume:.6f} mm^3"

# 1 micrometre retreat avoids CGAL 2021's zero-thickness contact-face exports.
# Positive controls prove the test detects a misplaced carrier/over-insertion.
CASES = [
    ("seated", "collision", "[0,0,-0.001]", False),
    ("insert-5mm", "collision", "[0,0,-5]", False),
    ("shift-x-control", "collision", "[0.5,0,-0.001]", True),
    ("shift-y-control", "collision", "[0,0.5,-0.001]", True),
    ("depth-control", "collision", "[0,0,0.5]", True),
    ("pcb", "board_collision", "[0,0,0]", False),
    ("dupont-assumed", "plug_collision", "[0,0,0]", False),
    ("usb-jst-assumed", "connector_collision", "[0,0,0]", False),
    ("front-jst-assumed", "front_jst_collision", "[0,0,0]", False),
    # Deliberately NOT approved: the separate side-USB route still intersects front wood.
    ("KNOWN-LIMIT-side-usb", "front_connector_collision", "[0,0,0]", True),
]
if __name__ == "__main__":
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        for line in pool.map(check, CASES):
            print(line, flush=True)
    print("KNOWN LIMIT: direct side-USB route NOT released; front-wood collision remains. No hidden inner pocket.\nDigital geometry only; real plugs, wood and printed fit remain untested.")
