#!/usr/bin/env python3
"""Check actual exported CNC solid and DXF nominal contours (mm)."""
from collections import Counter
from pathlib import Path
import struct

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
for name, expected in [
    ("opening", (-7,57.8,-7,32)),
    ("rebate", (-11,61.8,-11,36)),
    ("glass", (-10.8,61.6,-10.8,35.8)),
]:
    lines = (ROOT / f"cnc-{name}.dxf").read_text().splitlines()
    pairs = [(int(a), b.strip()) for a,b in zip(lines[::2], lines[1::2])]
    assert any(k == 0 and v == "LINE" for k,v in pairs), name
    xs = [float(v) for k,v in pairs if k in (10,11)]
    ys = [float(v) for k,v in pairs if k in (20,21)]
    bounds = (min(xs),max(xs),min(ys),max(ys))
    assert all(abs(a-b) < 0.001 for a,b in zip(bounds,expected)), (name,bounds)
    print(f"PASS DXF {name}: nominal mm bounds {bounds}")
print("CAM compensation, setup and real material thickness remain user checks.")
