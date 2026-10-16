#!/usr/bin/env python3
"""Actual SD mount STL checks; standard library, not physical fit approval."""
from collections import defaultdict
from pathlib import Path
import hashlib
import math
import struct
import sys

ROOT = Path(__file__).resolve().parent


def sub(a, b):
    return tuple(x-y for x, y in zip(a, b))


def dot(a, b):
    return sum(x*y for x, y in zip(a, b))


def cross(a, b):
    return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])


def mesh(path):
    assert path.is_file(), 'Finished SD mount export missing (template is not a mount)'
    raw = path.read_bytes()
    n = struct.unpack_from('<I', raw, 80)[0]
    assert len(raw) == 84+n*50, 'Invalid binary STL'
    triangles, edges, volume = [], defaultdict(list), 0
    for i in range(n):
        v = struct.unpack_from('<12fH', raw, 84+i*50)
        t = tuple(tuple(v[k:k+3]) for k in (3, 6, 9))
        a, b, c = t
        normal = cross(sub(b, a), sub(c, a))
        assert dot(normal, normal) > 1e-16, ('degenerate', i)
        volume += dot(a, cross(b, c))/6
        triangles.append(t)
        for a, b in zip(t, t[1:]+t[:1]):
            edges[tuple(sorted((a, b)))].append((i, a < b))
    assert all(len(e) == 2 and e[0][1] != e[1][1] for e in edges.values()), 'Open/nonmanifold/inconsistent'
    adj = [[] for _ in triangles]
    for e in edges.values():
        a, b = e[0][0], e[1][0]
        adj[a].append(b)
        adj[b].append(a)
    seen, stack = {0}, [0]
    while stack:
        for i in adj[stack.pop()]:
            if i not in seen:
                seen.add(i)
                stack.append(i)
    assert len(seen) == n, 'Disconnected surfaces'
    assert volume > 0
    lo = tuple(min(v[k] for t in triangles for v in t) for k in range(3))
    hi = tuple(max(v[k] for t in triangles for v in t) for k in range(3))
    return triangles, lo, hi, volume


def inside(triangles, point):
    direction, hits = (0.3127, 0.1731, 1), []
    for a, b, c in triangles:
        e1, e2 = sub(b, a), sub(c, a)
        h = cross(direction, e2)
        det = dot(e1, h)
        if abs(det) < 1e-10:
            continue
        s = sub(point, a)
        u = dot(s, h)/det
        if not 0 <= u <= 1:
            continue
        q = cross(s, e1)
        v = dot(direction, q)/det
        if v < 0 or u+v > 1:
            continue
        d = dot(e2, q)/det
        if d > 1e-7:
            hits.append(d)
    unique = []
    for d in sorted(hits):
        if not unique or abs(d-unique[-1]) > 1e-5:
            unique.append(d)
    return bool(len(unique) % 2)


if __name__ == '__main__':
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT/'sd_mount.stl'
    tris, lo, hi, volume = mesh(path)
    assert all(abs(a-b) < 1e-4 for a, b in zip(lo, (0, 0, 0))), lo
    assert all(abs(a-b) < 1e-4 for a, b in zip(hi, (44, 56, 12))), ('Expected finished 44x56x12 mount, not flat template', hi)
    checks: list[tuple[str, tuple[float, float, float], bool]] = [('grid rib', (1, 28, 1), True), ('open grid', (22, 28, 1), False),
              ('no tray/wall', (22, 28, 8), False)]
    for x in (12, 32):
        for y in (9, 47):
            checks += [(f'{x}/{y} bottom pocket', (x, y, 0.1), False),
                       ('pocket ceiling', (x+1.8, y, 7.1), True),
                       ('upper screw channel', (x, y, 11.8), False),
                       ('narrow PCB seat', (x+2, y, 11.8), True),
                       ('wide post ends below pins', (x+3.5, y, 8.2), False)]
            for angle in range(0, 360, 30):
                r = math.radians(angle)
                checks.append(('full insert wall', (x+3.9*math.cos(r), y+3.9*math.sin(r), 4), True))
    for x in (4, 40):
        checks += [('wood bore', (x, 28, 1), False),
                   ('countersink', (x+2.2, 28, 2.75), False),
                   ('material below countersink', (x+2.2, 28, 1.5), True)]
    for label, point, expected in checks:
        assert inside(tris, point) == expected, (label, point)
    print('PASS SD mount: closed/oriented/connected/nondegenerate', len(tris), 'triangles')
    print('Bounds', lo, hi, 'Volume mm^3', round(volume, 3))
    print('PASS', len(checks), 'actual mesh probes: four 20x38 posts, underside pockets, full walls, grid, two countersinks')
    print('SHA256', hashlib.sha256(path.read_bytes()).hexdigest())
    print('Digital geometry only; measured hole spacing / underside / screw heads / real fit still required.')
