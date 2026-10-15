#!/usr/bin/env python3
"""Independent dimensions of actual exported CNC/STL/DXF and assumed stack."""
from pathlib import Path
import re
from check_mesh import mesh
ROOT=Path(__file__).resolve().parent
if __name__=='__main__':
    _,lo,hi,vol=mesh(ROOT/'panel_cnc.stl')
    assert all(abs(a-b)<0.001 for a,b in zip(lo,(-20,-20,18.5))),lo
    assert all(abs(a-b)<0.001 for a,b in zip(hi,(62.7,60.4,30.5))),hi
    print('PASS closed local wood coupon 82.7 x 80.4 x 12 mm, volume',round(vol,3))
    for name,expected in [('opening',(-2.4,45.1,-2.4,42.8)),('rebate',(-4.4,47.1,-4.4,44.8)),('glass',(-4.2,46.9,-4.2,44.6))]:
        lines=(ROOT/f'cnc-{name}.dxf').read_text().splitlines()
        pairs=[(int(a),b.strip()) for a,b in zip(lines[::2],lines[1::2])]
        assert any(k==0 and v=='LINE' for k,v in pairs)
        xs=[float(v) for k,v in pairs if k in (10,11)];ys=[float(v) for k,v in pairs if k in (20,21)]
        bounds=(min(xs),max(xs),min(ys),max(ys))
        assert all(abs(a-b)<0.001 for a,b in zip(bounds,expected)),(name,bounds)
        print('PASS nominal DXF mm',name,bounds)
    text=(ROOT/'geometry.scad').read_text()
    def value(k):
        m=re.search(r'\b'+k+r'=([0-9.]+)',text);assert m is not None,k
        return float(m[1])
    top=value('wood_z')+value('wood_h')-value('glass_h')-value('rf_gap')
    bottom=top-value('pcb_t');tip=top-value('m2_length')
    engagement=min(value('nut_h')-0.1,(value('nut_pocket_h')-0.2)-(tip+0.2+0.15+0.3))
    assert abs(bottom-23.9)<1e-8
    assert abs(value('rf_gap')-2)<1e-8
    assert value('rf_gap')-value('head_h')>=0.5
    assert tip-0.2-0.15>=0
    assert engagement>=1.2
    assert abs(value('wood_screw_l')-value('tab_h')-8.5)<1e-8
    print('PASS assumed stack PCB',bottom,top,'glass',top+value('rf_gap'),'M2x25 tip',tip,'minimum thread engagement',engagement)
    print('PASS wood engagement 8.5 mm, rest wood 3.5 mm; NO measured RF/physical fit approval')
