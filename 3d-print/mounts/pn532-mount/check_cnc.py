#!/usr/bin/env python3
"""Independent dimensions of actual exported CNC/STL/DXF and assumed stack."""
from pathlib import Path
import re
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'common'))
from check_wave import check_contours
from check_mesh import mesh
ROOT=Path(__file__).resolve().parent
if __name__=='__main__':
    _,lo,hi,vol=mesh(ROOT/'panel_cnc.stl')
    assert all(abs(a-b)<0.001 for a,b in zip(lo,(-20,-20,18.5))),lo
    assert all(abs(a-b)<0.001 for a,b in zip(hi,(62.7,60.4,30.5))),hi
    print('PASS closed local wood coupon 82.7 x 80.4 x 12 mm, volume',round(vol,3))
    opening, rebate, glass = check_contours(ROOT)
    expected_volume=82.7*80.4*12-opening.area*9-rebate.area*3
    assert abs(vol-expected_volume)<0.05, (vol,expected_volume)
    assert all(abs(a-b)<0.001 for a,b in zip(opening.bounds,(-2.4,-2.4,45.1,42.8)))
    print('PASS CNC STL volume agrees with actual DXF/depths')
    text=(ROOT/'geometry.scad').read_text()
    def value(k):
        m=re.search(r'\b'+k+r'=([0-9.]+)',text);assert m is not None,k
        return float(m[1])
    top=value('wood_z')+value('wood_h')-value('glass_h')-value('rf_gap')
    bottom=top-value('pcb_t');tip=top-value('pcb_screw_length')
    engagement=min(value('nut_h')-0.1,(value('nut_pocket_h')-0.2)-(tip+0.2+0.15+0.3))
    assert abs(bottom-24.35)<1e-8
    assert abs(value('pcb_t')-1.15)<1e-8
    assert abs(value('pcb_hole_d')-2.93)<1e-8
    assert 'board_holes=[[7.725,7.725],[34.975,32.675]]' in text
    assert 'wood_points=[[-10,20.2],[34.975,50.4]]' in text
    print('PASS user measurements: hole spacing 27.25 x 24.95, PCB 1.15, holes 2.93 mm')
    assert 'connector_rect=[10,35.9,12,4]' in text
    print('PASS corrected I2C side: top (+y); precise housing offset/dimensions still assumed')
    assert abs(value('rf_gap')-2)<1e-8
    assert value('rf_gap')-value('head_h')>=0.5
    assert tip-0.2-0.15>=0
    assert engagement>=1.2
    assert abs(value('wood_screw_l')-value('tab_h')-8.5)<1e-8
    print('PASS assumed stack PCB',bottom,top,'glass',top+value('rf_gap'),'M2.5x25 example tip',tip,'minimum thread engagement',engagement)
    print('Nominal wood engagement 8.5 mm; remaining top wood 3.5 mm ONLY outside rabbet, 0.5 mm where rabbet overlaps. NO physical retention approval.')
