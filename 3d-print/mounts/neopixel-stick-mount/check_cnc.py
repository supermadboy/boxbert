#!/usr/bin/env python3
"""Verify actual CNC solid, nominal DXF bounds, and independent stack maths."""
from pathlib import Path
import re
from check_mesh import mesh
ROOT=Path(__file__).resolve().parent
if __name__=='__main__':
    tris,lo,hi,vol=mesh(ROOT/'panel_cnc.stl')
    assert all(abs(a-b)<0.001 for a,b in zip(lo,(-98,-20.46,12))),lo
    assert all(abs(a-b)<0.001 for a,b in zip(hi,(152,159.54,24))),hi
    print('PASS closed CNC panel 250 x 180 x 12 mm, volume',round(vol,3))
    for name,expected in [('opening',(-2.2,56.2,-2.2,12.1)),('rebate',(-12.2,66.2,-12.2,22.1)),('glass',(-12,66,-12,21.9))]:
        lines=(ROOT/f'cnc-{name}.dxf').read_text().splitlines()
        pairs=[(int(a),b.strip()) for a,b in zip(lines[::2],lines[1::2])]
        assert any(k==0 and v in ('LINE','LWPOLYLINE') for k,v in pairs)
        xs=[float(v) for k,v in pairs if k in (10,11)]
        ys=[float(v) for k,v in pairs if k in (20,21)]
        bounds=(min(xs),max(xs),min(ys),max(ys))
        assert all(abs(a-b)<0.001 for a,b in zip(bounds,expected)),(name,bounds)
        print('PASS nominal DXF mm',name,bounds)
    geometry=(ROOT/'geometry.scad').read_text()
    assert 'board_holes=[[13.7,7.7],[39.7,7.7]];' in geometry
    assert 'board_hole_d=3;' in geometry
    assert abs((54-12.8-1.5)-39.7)<1e-8
    assert abs(39.7-13.7-(23+3))<1e-8
    assert abs(9.9-0.7-1.5-7.7)<1e-8
    print('PASS measured hole geometry: D3, pitch26, centers (13.7,7.7)/(39.7,7.7)')
    # Direct values extracted from shared geometry, not success strings.
    s=(ROOT/'geometry.scad').read_text(); vals={}
    for key in ['wood_z','wood_h','glass_h','optical_gap','led_h','pcb_t','nut_h','nut_pocket_h','m2_length','tab_h','wood_screw_l']:
        found=re.search(r'^'+key+r'=([0-9.]+)',s,re.M)
        assert found is not None,key
        vals[key]=float(found[1])
    b=vals['wood_z']+vals['wood_h']-vals['glass_h']-vals['optical_gap']-vals['led_h']-vals['pcb_t']
    gap=vals['wood_z']+vals['wood_h']-vals['glass_h']-b-vals['pcb_t']-vals['led_h']
    tip=b+vals['pcb_t']-vals['m2_length'];nutbottom=vals['nut_pocket_h']-vals['nut_h']
    assert abs(gap-3)<1e-8
    assert 0<tip<nutbottom
    # Deliberate assumed tolerance budget, not measured hardware tolerances.
    # Length -0.2; PCB +0.15; incomplete tip thread 0.3; nut seat -0.2; nut h -0.1.
    min_engagement=min(vals['nut_h']-0.1,(vals['nut_pocket_h']-0.2)-(tip+0.2+0.15+0.3))
    assert min_engagement>=1.2,('insufficient assumed worst-case M2 engagement',min_engagement)
    print('PASS assumed tolerance budget: minimum M2 thread engagement',min_engagement,'mm')
    assert abs(vals['wood_screw_l']-vals['tab_h']-8.5)<1e-8
    print('PASS nominal PCB bottom',b,'LED/glass gap',gap,'M2x16 tip',tip,'nut bottom',nutbottom,'wood engagement 8.5 mm')
    print('CAM compensation, real screw/nut/wood/glass and optical/diffusion tests still required.')
