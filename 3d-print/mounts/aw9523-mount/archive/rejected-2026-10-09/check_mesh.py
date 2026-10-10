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


path = Path(__file__).with_name("aw9523_mount.stl")
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
require(all(abs(a-b) < 1e-5 for a, b in zip(maxs, (44, 26, 10))), "Unexpected maximum bounds / preview dummies?")
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


# Loch-/Pfostenzentren (Basis-Koordinaten, Stand der SCAD-Parameter):
# A(5.49, 6.65) Schraubpfosten, B(38.51, 6.65) Stuetze,
# C(5.49, 19.35) Stuetze, D(38.51, 19.35) Schraubpfosten.
# Holzpolster: (12,13) und (32,13), D8, 3.5 dick. Freistich an A Richtung
# +x (Kegelzone innen r>=2.61), an D Richtung -x und Richtung JP2-Endpin.
checks = [
    ("Gitterrippe", (1, 10, 1), True),
    ("Gitterzelle offen", (10, 4, 1), False),
    ("Holzloch 1 durchgehend", (12, 13, 1), False),
    ("Holzloch 2 durchgehend", (32, 13, 1), False),
    ("Holzloch oberhalb Gitter offen", (12, 13, 3.25), False),
    ("Erhoehtes Schraubpolster vorhanden", (15.7, 13, 3.25), True),
    ("Senkung kegelfoermig offen", (14.2, 13, 2.75), False),
    ("Material neben Senkung", (14.7, 13, 2.75), True),
    ("2-mm-Material unter Senkung", (14.2, 13, 1.5), True),
    ("Senkung bis D6.2 offen", (13.5, 13, 3.49), False),
    ("Kein erhoehter Boden ausserhalb Polster", (22, 16, 3), False),
    ("Heat-Set Sackloch A offen", (5.49, 6.65, 5), False),
    ("Heat-Set Sackloch D offen", (38.51, 19.35, 5), False),
    ("Sacklochboden A geschlossen", (5.49, 6.65, 3.0), True),
    ("Pfostenwand A gegenueber Freistich", (2.69, 6.65, 7), True),
    ("Kegelfreistich A offen", (8.39, 6.65, 9.5), False),
    ("Kegelfreistich-Wand A (0.61 mm)", (7.99, 6.65, 9.5), True),
    ("Kegelfreistich-Wand A weiter unten", (7.99, 6.65, 8.5), True),
    ("Pinfreistich A offen", (8.79, 6.65, 8.0), False),
    ("Pinfreistich-Wand A (1.16 mm)", (8.49, 6.65, 8.0), True),
    ("Luft fuer Lotkegel/Pin unter Platine A", (8.9, 6.65, 8.6), False),
    ("Kegelfreistich D offen", (35.61, 19.35, 9.5), False),
    ("Kegelfreistich D zum JP2-Endpin offen", (35.52, 17.35, 9.5), False),
    ("Stuetzpfosten B", (38.51, 6.65, 9), True),
    ("Stuetzpfosten C", (5.49, 19.35, 9), True),
    ("Luft unter Platine Mitte", (22, 13, 6), False),
    ("Luft zwischen C und Holzpolster", (8.9, 16.5, 6), False),
]
print("STL-Geometriepruefung — keine physische Passungspruefung")
print("SHA256:", hashlib.sha256(data).hexdigest())
print("Dreiecke:", count)
print("Bounding box:", mins, "..", maxs, "mm")
print(f"Volumen: {volume:.3f} mm^3")
for name, point, expected in checks:
    result = inside(point)
    print(f"  {'OK ' if result == expected else 'FAIL'} {name}: "
          f"{point} -> {'Material' if result else 'Luft'}")
    require(result == expected, f"Check failed: {name}")
print("PASS: eine zusammenhaengende, geschlossene, konsistent orientierte Oberflaeche")
