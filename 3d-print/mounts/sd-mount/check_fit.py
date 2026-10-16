#!/usr/bin/env python3
"""CGAL intersections: collision iff volume >0.001 mm³; no hardware-fit claim."""
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent
CASES = [('pcb', False), ('underside', False), ('pins', False),
         ('connector', False), ('card', False), ('wood', False), ('heads', False),
         ('heads-tolerance', False), ('heads-control', True),
         ('pins-control', True), ('connector-control', True), ('card-control', True)]


def main():
    (ROOT/'logs').mkdir(exist_ok=True)
    for name, expected in CASES:
        with tempfile.TemporaryDirectory(prefix='hw125-fit-') as d:
            target = Path(d)/'intersection.stl'
            r = subprocess.run(['openscad', '--hardwarnings', '--export-format', 'binstl',
                                '-D', f'fit_case="{name}"', '-o', str(target), 'fit.scad'],
                               cwd=ROOT, text=True, capture_output=True, timeout=180)
            log = r.stdout+r.stderr
            (ROOT/'logs'/f'fit-{name}.log').write_text(log)
            assert 'WARNING' not in log and 'ERROR' not in log, (name, log)
            if 'Current top level object is empty' in log:
                assert r.returncode in (0, 1), (name, log)
                volume = 0
            else:
                assert r.returncode == 0 and target.exists(), (name, log)
                # Multiple separate contact volumes are valid intersections; compute
                # signed volume without requiring one connected collision surface.
                import struct
                raw = target.read_bytes()
                n = struct.unpack_from('<I', raw, 80)[0]
                assert len(raw) == 84+n*50
                volume = 0
                for i in range(n):
                    v = struct.unpack_from('<12fH', raw, 84+i*50)
                    a, b, c = v[3:6], v[6:9], v[9:12]
                    volume += (a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6
                volume = abs(volume)
            assert (volume > 0.001) == expected, (name, volume, log)
            print(f'PASS {name}: {volume:.6f} mm^3'+(' deliberate collision >0.001 mm^3 detected' if expected else ' volume <=0.001 mm^3 (acceptance threshold)'), flush=True)
    print('Heads: max D4, radial play 0.1 and component XY allowance 0.1 mm checked against ASSUMED envelopes only. Real module/head/card/hand fit NOT certified.')


if __name__ == '__main__':
    main()
