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


path = Path(__file__).with_name("max98357_mount.stl")
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
require(all(abs(a-b) < 1e-5 for a, b in zip(maxs, (38, 26, 12))), "Unexpected maximum bounds / preview dummies?")
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


# ADA3006: Ursprung (10.11,3.475); zwei Gewindepfosten und zwei Stuetzen.
checks = [
    ("Gitterrippe", (1, 8, 1), True),
    ("Gitterzelle offen", (22, 4, 1), False),
    ("Freie Mitte oberhalb Gitter", (19, 13, 3), False),
    ("Massive Stuetze links", (14.61, 10.475, 11), True),
    ("Massive Stuetze rechts", (23.39, 10.475, 11), True),
    ("Pfosten getrennt", (19, 19.985, 7.5), False),
]
for x in (4, 34):
    checks += [
        ("Holzloch durchgehend", (x, 13, 1), False),
        ("Senkung offen", (x+2.2, 13, 2.75), False),
        ("Material unter Senkung", (x+2.2, 13, 1.5), True),
        ("Schraubpolster neben Senkung", (x+3.5, 13, 3.25), True),
    ]
for x, y in ((12.65, 19.985), (25.35, 19.985)):
    checks += [
        ("Einsatzkammer unten offen", (x, y, 0.1), False),
        ("Einsatzkammer bis 6.9 offen", (x+1.8, y, 6.8), False),
        ("Schulter ueber Kammer", (x+1.8, y, 7.1), True),
        ("Schraubenkanal oben", (x, y, 11.9), False),
        ("Schmale obere Auflage", (x+2, y, 11.9), True),
        ("Dicker Pfosten unten", (x+3.8, y, 7.5), True),
        ("Dicker Pfosten endet bei z8", (x+3.8, y, 8.1), False),
    ]
    # Volle umlaufende Wand: Raster um BEIDE Einsatzbereiche, keine Freistiche.
    import math
    for angle in range(0, 360, 15):
        a = math.radians(angle)
        for z in (0.5, 3.5, 5.8, 6.8):
            checks.append(("Umlaufende Einsatzwand", (x+3.9*math.cos(a),
                           y+3.9*math.sin(a), z), True))
# Alle neun Durchkontaktierungsbereiche inkl. der beiden Klemmen-Loetstellen.
pads = [(10.11+1.27+2.54*k, 3.475+2.54) for k in range(7)]
pads += [(10.11+7.09, 3.475+15.494), (10.11+10.59, 3.475+15.494)]
for x, y in pads:
    for z, radius in ((8.6,0.55),(11.8,1.3)):
        for dx, dy in ((0,0),(radius,0),(-radius,0),(0,radius),(0,-radius)):
            checks.append(("Pin-/Lot-Huellraum frei", (x+dx,y+dy,z), False))
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
