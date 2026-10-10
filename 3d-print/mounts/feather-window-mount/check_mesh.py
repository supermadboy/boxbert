#!/usr/bin/env python3
"""Check actual Feather-window STL defaults; not a physical approval."""
import collections
import hashlib
import json
import math
import struct
from pathlib import Path
p=Path(__file__).parent

def require(c,m):
    if not c: raise RuntimeError(m)
def sub(a,b): return tuple(x-y for x,y in zip(a,b))
def cross(a,b): return (a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
def dot(a,b): return sum(x*y for x,y in zip(a,b))
raw=(p/'feather_window_mount.stl').read_bytes()
n=struct.unpack_from('<I',raw,80)[0]
require(len(raw)==84+n*50,'Invalid binary STL size')
triangles=[]
edges=collections.defaultdict(list)
volume=0
for i in range(n):
    values=struct.unpack_from('<12fH',raw,84+50*i)
    t=tuple(tuple(values[k:k+3]) for k in (3,6,9))
    triangles.append(t)
    normal=cross(sub(t[1],t[0]),sub(t[2],t[0]))
    require(dot(normal,normal)>1e-16,f'Degenerate triangle {i}')
    volume+=dot(t[0],cross(t[1],t[2]))/6
    for a,b in zip(t,t[1:]+t[:1]):edges[tuple(sorted((a,b)))].append((i,a<b))
require(all(len(e)==2 and e[0][1]!=e[1][1] for e in edges.values()),'Nonmanifold/open/inconsistent edge')
adj=[[] for _ in triangles]
for e in edges.values():
    a,b=e[0][0],e[1][0];adj[a].append(b);adj[b].append(a)
seen={0};stack=[0]
while stack:
    for i in adj[stack.pop()]:
        if i not in seen:seen.add(i);stack.append(i)
require(len(seen)==n,'Disconnected surfaces')
mins=tuple(min(v[k] for t in triangles for v in t) for k in range(3))
maxs=tuple(max(v[k] for t in triangles for v in t) for k in range(3))
require(all(abs(a-b)<1e-5 for a,b in zip(mins,(-5.6,-24,0))),'Unexpected minimum bounds')
require(all(abs(a-b)<1e-5 for a,b in zip(maxs,(56.4,46.86,14))),'Unexpected max bounds / preview solids in STL')
require(volume>0,'Negative signed volume')
def inside(p):
    direction=(0.3127,0.1731,1);hits=[]
    for a,b,c in triangles:
        e1,e2=sub(b,a),sub(c,a);h=cross(direction,e2);det=dot(e1,h)
        if abs(det)<1e-10:continue
        s=sub(p,a);u=dot(s,h)/det
        if not 0<=u<=1:continue
        q=cross(s,e1);v=dot(direction,q)/det
        if v<0 or u+v>1:continue
        distance=dot(e2,q)/det
        if distance>1e-7:hits.append(distance)
    unique=[]
    for h in sorted(hits):
        if not unique or abs(h-unique[-1])>1e-5:unique.append(h)
    return bool(len(unique)%2)
checks=[
 ('Grid cell open',(-2,0,1),False),
 ('Grid rib present',(-4.8,11.43,1),True),
 ('Central opening',(25.4,11.43,1),False),
 ('Lower tab top material',(30,-17,11.8),True),
 ('Lower tab screw bore',(25.4,-17,11),False),
 ('Lower head recess opens INSIDE',(27.8,-17,8.6),False),
 ('Wood-contact face beside bore',(27.8,-17,11.9),True),
 ('Upper tab bore',(25.4,39.86,11),False),
 ('Step leg',(25.4,-5,6),True),
 ('Air below outer tab',(25.4,-20,4),False),
 ('Insert pocket',(2.54,2.54,4),False),
 ('Insert surrounding full wall',(5.54,2.54,4),True),
 ('Upper screw passage',(2.54,2.54,13),False),
 ('Narrow upper screw post',(4.54,2.54,13),True),
 ('Right D2.2-hole location is flat support',(48.26,1.8415,13.9),True),
 ('USB route reserved space',(-10,11.43,12),False),
 ('JST cable reserved space',(10.8,17.5,8),False),
 ('Strain relief slot',(8,27,1),False),
 ('Strain relief bridge',(10.8,27,1),True),
]
print('Feather-window actual STL digital checks — NOT physical fit approval')
print('SHA256',hashlib.sha256(raw).hexdigest())
print('Triangles',n,'Bounds',mins,maxs,'Volume mm^3',round(volume,3))
print('PASS closed, consistently oriented, one connected surface; nondegenerate triangles')
for label,point,expected in checks:
    require(inside(point)==expected,label);print('PASS',label)
# Sample reserved connector boxes against actual mesh, not merely one point.
for label,lo,hi in [('USB',(-23,5.43,9.5),(2,17.43,15.5)),
                    ('JST',(5.8,10.8,5),(15.8,30.8,13))]:
    for ix in range(5):
        for iy in range(5):
            for iz in range(5):
                point=tuple(a+(b-a)*(k+.5)/5 for a,b,k in zip(lo,hi,(ix,iy,iz)))
                require(not inside(point),f'{label} envelope blocked at {point}')
    print('PASS',label,'reserved box 125 interior samples (not proof for every real connector)')
facts=json.loads((p.parents[2]/'docs/cad/feather-window/source-facts.json').read_text())
require([h['drill'] for h in facts['holes']]==[2.5,2.5,2.2,2.2],'Manufacturer source changed')
for h in facts['holes'][:2]:
    require(not inside((*h['xy'],13.9)),'Wrong screw hole location')
for h in facts['holes'][2:]:
    require(inside((*h['xy'],13.9)),'Wrong support location')
print('PASS post locations checked against independently extracted Eagle JSON')
