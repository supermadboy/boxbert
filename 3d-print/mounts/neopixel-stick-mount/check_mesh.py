#!/usr/bin/env python3
"""Check real binary print STL, never preview solids or fabricated results."""
from collections import defaultdict
from pathlib import Path
import struct
import math

ROOT = Path(__file__).resolve().parent

def mesh(path):
    assert path.is_file(), 'Missing new NeoPixel print export'
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
    tris,lo,hi,vol = mesh(ROOT/'neopixel_mount.stl')
    assert all(abs(a-b)<1e-4 for a,b in zip(lo,(-8,-16,0))),lo
    assert all(abs(a-b)<1e-4 for a,b in zip(hi,(52.8,12.628,16.5))),hi
    print('PASS mount STL: closed/oriented/connected/nondegenerate',len(tris),'triangles')
    print('Bounds',lo,hi,'Volume mm^3',round(vol,3))
    def inside(point):
        def sub(a,b):return tuple(x-y for x,y in zip(a,b))
        def dot(a,b):return sum(x*y for x,y in zip(a,b))
        def cross(a,b):return (a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
        direction=(0.3127,0.1731,1);hits=[]
        for a,b,c in tris:
            e1,e2=sub(b,a),sub(c,a);h=cross(direction,e2);det=dot(e1,h)
            if abs(det)<1e-10:continue
            s=sub(point,a);u=dot(s,h)/det
            if not 0<=u<=1:continue
            q=cross(s,e1);v=dot(direction,q)/det
            if v<0 or u+v>1:continue
            distance=dot(e2,q)/det
            if distance>1e-7:hits.append(distance)
        unique=[]
        for h in sorted(hits):
            if not unique or abs(h-unique[-1])>1e-5:unique.append(h)
        return bool(len(unique)%2)
    checks=[('PCB M2 bore',(12.7,8.128,14.8),False),
            ('Second M2 bore',(38.1,8.128,14.8),False),
            ('Upper narrow screw post',(14.3,8.128,14.8),True),
            ('Rear-entry hex pocket',(14.7,8.128,1),False),
            ('Full nut pocket wall',(16,8.128,1),True),
            ('Front PCB support',(8,1.1,14.8),True),
            ('Wood screw bore',(18.4,-10,11),False),
            ('Wood head opens toward interior',(20.9,-10,8.6),False),
            ('Wood contact face solid',(20.9,-10,11.9),True),
            ('Second front wood bore',(32.4,-10,11),False),
            ('No rear tab',(25.4,22,10),False),
            ('Grid cell',(2,2,1),False),
            ('Grid rib',(5.5,3,1),True),
            ('Cable tie slot',(-4,-0.3,7.5),False),
            ('Cable tie bridge',(-4,4,7.5),True)]
    for label,point,expected in checks:
        assert inside(point)==expected,label
        print('PASS actual mesh probe',label)
