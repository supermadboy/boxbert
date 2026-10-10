#!/usr/bin/env python3
"""Check this draft's binary STL with Python stdlib; NOT physical approval.

Fixed coordinate checks belong to the current default SCAD parameters.
Update them deliberately if those parameters change.
"""
import collections
import hashlib
import struct
from pathlib import Path


def sub(a, b):
    return tuple(x - y for x, y in zip(a, b))


def cross(a, b):
    return (a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2],
            a[0]*b[1] - a[1]*b[0])


def dot(a, b):
    return sum(x*y for x, y in zip(a, b))


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


import sys
part = sys.argv[1] if len(sys.argv) > 1 else "base"
require(part in ("base", "bridge"), "Unknown part")
path = Path(__file__).with_name(f"akku_{part}.stl")
data = path.read_bytes()
count = struct.unpack_from("<I", data, 80)[0]
require(len(data) == 84 + 50*count, "Not a valid binary STL")
triangles = []
edges = collections.defaultdict(list)
volume = 0.0
for i in range(count):
    values = struct.unpack_from("<12fH", data, 84 + 50*i)
    t = tuple(tuple(values[j:j+3]) for j in (3, 6, 9))
    triangles.append(t)
    normal = cross(sub(t[1], t[0]), sub(t[2], t[0]))
    require(dot(normal, normal) > 1e-16, f"Degenerate/tiny triangle {i}")
    volume += dot(t[0], cross(t[1], t[2])) / 6
    for a, b in zip(t, t[1:] + t[:1]):
        edges[tuple(sorted((a, b)))].append((i, a < b))

require(all(len(e) == 2 and e[0][1] != e[1][1] for e in edges.values()),
        "Open/nonmanifold/inconsistently oriented edge")
adjacent = [[] for _ in triangles]
for e in edges.values():
    a, b = e[0][0], e[1][0]
    adjacent[a].append(b)
    adjacent[b].append(a)
seen, stack = {0}, [0]
while stack:
    for j in adjacent[stack.pop()]:
        if j not in seen:
            seen.add(j)
            stack.append(j)
require(len(seen) == count, "Disconnected surfaces")
mins = tuple(min(v[k] for t in triangles for v in t) for k in range(3))
maxs = tuple(max(v[k] for t in triangles for v in t) for k in range(3))
require(all(abs(a-b) < 1e-5 for a, b in zip(mins, (0, 0, 0))), "Unexpected minimum bounds")
require(all(abs(a-b) < 1e-5 for a, b in zip(maxs, ((100, 76, 10.5) if part == "base" else (16, 74, 3)))), "Unexpected maximum bounds / preview dummies?")
require(volume > 0, "Incorrect overall orientation")


def inside(p):
    """Oblique ray / Moller-Trumbore; coalesce shared-edge intersections."""
    direction, hits = (0.3127, 0.1731, 1), []
    for a, b, c in triangles:
        e1, e2 = sub(b, a), sub(c, a)
        h = cross(direction, e2)
        det = dot(e1, h)
        if abs(det) < 1e-10:
            continue
        s = sub(p, a)
        u = dot(s, h) / det
        if not 0 <= u <= 1:
            continue
        q = cross(s, e1)
        v = dot(direction, q) / det
        if v < 0 or u + v > 1:
            continue
        distance = dot(e2, q) / det
        if distance > 1e-7:
            hits.append(distance)
    unique = []
    for distance in sorted(hits):
        if not unique or abs(distance - unique[-1]) > 1e-5:
            unique.append(distance)
    return bool(len(unique) % 2)


checks = ([("grid opening", (4,4,1), False),
("grid rib", (1,20,1), True),
("wood hole", (4,38,1), False),
("countersink", (6.2,38,2.9), False),
("insert pocket", (50,6,7), False),
("pocket bottom", (50,6,3), True),
("post wall", (53,6,8), True),
("battery free space", (50,38,8), False),
("stop", (7.5,22,4), True)] if part == "base" else [
("screw hole", (8,5,1.5), False),
("bridge web", (8,37,1.5), True)])
for label, point, expected in checks:
    require(inside(point) == expected, label)
    print("PASS:", label)
print(part, "PASS: watertight, oriented, connected, no degenerate triangles")
print("Bounds:", mins, maxs, "Volume:", volume, "Triangles:", count)
print("SHA256:", hashlib.sha256(data).hexdigest())
