#!/usr/bin/env python3
"""Digital mesh checks for hole_template.stl only, no physical approval."""
import collections
import hashlib
import struct
from pathlib import Path

p = Path(__file__).with_name('hole_template.stl')
data = p.read_bytes()
n = struct.unpack_from('<I', data, 80)[0]
assert len(data) == 84 + 50*n
edges = collections.defaultdict(list)
triangles = []
volume = 0

def cross(a, b):
    return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])

def dot(a, b):
    return sum(x*y for x,y in zip(a,b))

for i in range(n):
    v = struct.unpack_from('<12fH', data, 84+50*i)
    t = [tuple(v[j:j+3]) for j in (3,6,9)]
    triangles.append(t)
    a = tuple(y-x for x,y in zip(t[0],t[1]))
    b = tuple(y-x for x,y in zip(t[0],t[2]))
    normal = cross(a,b)
    assert dot(normal,normal) > 1e-16, ('degenerate',i)
    volume += dot(t[0],cross(t[1],t[2]))/6
    for a,b in zip(t,t[1:]+t[:1]):
        edges[tuple(sorted((a,b)))].append((i,a<b))
assert all(len(e)==2 and e[0][1]!=e[1][1] for e in edges.values())
adj = collections.defaultdict(set)
for e in edges.values():
    a,b = e[0][0],e[1][0]
    adj[a].add(b)
    adj[b].add(a)
seen, todo = {0}, [0]
while todo:
    for j in adj[todo.pop()]:
        if j not in seen:
            seen.add(j)
            todo.append(j)
assert len(seen)==n
mins = tuple(min(v[k] for t in triangles for v in t) for k in range(3))
maxs = tuple(max(v[k] for t in triangles for v in t) for k in range(3))
assert mins==(0,0,0) and maxs==(30,48,2)
# Expected volume: rectangular frame minus four polygonal through-holes.
import math
hole_area = 80/2 * 1.35**2 * math.sin(2*math.pi/80)
expected = (30*48 - 12*30 - 4*hole_area)*2
assert abs(volume-expected)<0.001, (volume,expected)
print('PASS: closed, connected, oriented mesh; no degenerate triangles')
print('PASS: bounds',mins,maxs,'; expected frame/hole volume',volume)
print('Triangles:',n)
print('SHA256:',hashlib.sha256(data).hexdigest())
print('Digital template check only; physical hole spacing unverified.')
