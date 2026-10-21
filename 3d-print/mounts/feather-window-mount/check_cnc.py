#!/usr/bin/env python3
"""Check actual exported CNC solid and DXF nominal contours (mm)."""
from collections import Counter
from pathlib import Path
import struct
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'common'))
from check_wave import check_contours

ROOT = Path(__file__).resolve().parent
raw = (ROOT / "front_cnc.stl").read_bytes()
count = struct.unpack_from("<I", raw, 80)[0]
assert len(raw) == 84 + 50 * count
edges = Counter()
vertices = []
volume = 0
for i in range(count):
    v = struct.unpack_from("<12fH", raw, 84 + i * 50)
    tri = tuple(tuple(v[k:k+3]) for k in (3, 6, 9))
    vertices.extend(tri)
    a, b, c = tri
    volume += (a[0]*(b[1]*c[2]-b[2]*c[1]) +
               a[1]*(b[2]*c[0]-b[0]*c[2]) +
               a[2]*(b[0]*c[1]-b[1]*c[0])) / 6
    for a, b in zip(tri, tri[1:]+tri[:1]):
        edges[a, b] += 1
assert all(n == 1 and edges[b, a] == 1 for (a, b), n in edges.items()), "CNC STL not closed/oriented"
lo = tuple(min(v[k] for v in vertices) for k in range(3))
hi = tuple(max(v[k] for v in vertices) for k in range(3))
assert all(abs(a-b) < 0.0001 for a,b in zip(lo, (-24,-43.57,22)))
assert all(abs(a-b) < 0.0001 for a,b in zip(hi, (226,66.43,34)))
assert volume > 0
print(f"PASS CNC STL: {count} triangles, closed/oriented, bounds {lo}…{hi}, {volume:.3f} mm^3")
opening, rebate, glass = check_contours(ROOT)
expected_volume=250*110*12-opening.area*9-rebate.area*3
assert abs(volume-expected_volume)<0.05, (volume,expected_volume)
assert all(abs(a-b)<0.001 for a,b in zip(opening.bounds,(-7,-7,57.8,32)))
print('PASS CNC STL volume agrees with actual DXF/depths including JST notch')
print("CAM compensation, setup and real material thickness remain user checks.")
