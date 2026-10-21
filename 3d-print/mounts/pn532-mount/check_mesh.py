#!/usr/bin/env python3
"""Check real binary print STL, never preview solids or fabricated results."""
from collections import defaultdict
from pathlib import Path
import struct
import math

ROOT = Path(__file__).resolve().parent

def mesh(path):
    assert path.is_file(), 'Missing new PN532 print export'
    data = path.read_bytes()
    n = struct.unpack_from('<I', data, 80)[0]
    assert len(data) == 84 + n*50
    triangles = []
    edges = defaultdict(list)
    volume = 0
    for i in range(n):
        v = struct.unpack_from('<12fH', data, 84+i*50)
        t = tuple(tuple(v[k:k+3]) for k in (3,6,9))
        a,b,c = t
        ab = [b[k]-a[k] for k in range(3)]
        ac = [c[k]-a[k] for k in range(3)]
        cross = [ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]]
        assert sum(x*x for x in cross)>1e-16, ('degenerate',i)
        volume += (a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6
        triangles.append(t)
        for a,b in zip(t,t[1:]+t[:1]): edges[tuple(sorted((a,b)))].append((i,a<b))
    assert all(len(e)==2 and e[0][1]!=e[1][1] for e in edges.values()), 'open/nonmanifold/inconsistent'
    adj = [[] for _ in triangles]
    for e in edges.values():
        a,b = e[0][0],e[1][0]
        adj[a].append(b)
        adj[b].append(a)
    seen = {0}
    stack = [0]
    while stack:
        for i in adj[stack.pop()]:
            if i not in seen: seen.add(i); stack.append(i)
    assert len(seen)==n,'disconnected surfaces'
    lo = tuple(min(v[k] for t in triangles for v in t) for k in range(3))
    hi = tuple(max(v[k] for t in triangles for v in t) for k in range(3))
    assert volume>0
    return triangles,lo,hi,volume

if __name__=='__main__':
    tris,lo,hi,vol=mesh(ROOT/'pn532_mount.stl')
    assert all(abs(a-b)<1e-4 for a,b in zip(lo,(-16,-2.2,0))),lo
    assert all(abs(a-b)<1e-4 for a,b in zip(hi,(44.9,56.4,24.35))),hi
    print('PASS PN532 STL: closed/oriented/connected/nondegenerate',len(tris),'triangles')
    print('Bounds',lo,hi,'Volume mm^3',round(vol,3))
