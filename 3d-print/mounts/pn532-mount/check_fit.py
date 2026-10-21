#!/usr/bin/env python3
"""Actual CGAL solid intersections plus deliberate positive controls."""
from pathlib import Path
import subprocess
import tempfile
import struct
from concurrent.futures import ThreadPoolExecutor
ROOT=Path(__file__).resolve().parent
CASES=[('seated','wood',[0,0,-0.001],False),('shift-x','wood',[0.6,0,-0.001],True),('shift-y','wood',[0,0.6,-0.001],True),('too-deep','wood',[0,0,0.5],True),('pcb','pcb',[0,0,0],False),('electronics','electronics',[0,0,0],False),('connector-mount','connector_mount',[0,0,0],False),('connector-wood','connector_wood',[0,0,0],False),('cable-mount','cable_mount',[0,0,0],False),('cable-wood','cable_wood',[0,0,0],False),('glass','glass',[0,0,0],False),('m2.5-bores','bores',[0,0,0],False),('insertion','insertion',[0,0,0],False)]
def check(case):
    name,scene,shift,expect=case
    if scene=='insertion':
        # Intersection distributes over union. Same 21 poses, no giant union.
        results=[]
        for z in range(-20,1):
            results.append(check((f'insertion-z{z}','insert_pose',[0,0,z-0.001],False)))
        summary='PASS insertion: 21 separate full-solid poses, z=-20..0 mm, all empty'
        (ROOT/'logs'/'fit-insertion.log').write_text(summary+'\n'+'\n'.join(results)+'\n')
        return summary
    with tempfile.TemporaryDirectory(prefix='pn532-fit-') as d:
        target=Path(d)/'intersection.stl'
        result=subprocess.run(['openscad','--hardwarnings','--export-format','binstl','-o',str(target),'-D',f'scene="{scene}"','-D',f'shift={shift}','assembly.scad'],cwd=ROOT,text=True,capture_output=True,timeout=300)
        log=result.stdout+result.stderr
        (ROOT/'logs'/f'fit-{name}.log').write_text(log)
        assert 'WARNING' not in log and 'ERROR' not in log,(name,log)
        if 'Current top level object is empty' in log:
            assert result.returncode in (0,1),(name,log)
            vol=0
        else:
            assert result.returncode==0 and target.exists(),(name,log)
            raw=target.read_bytes();n=struct.unpack_from('<I',raw,80)[0]
            assert len(raw)==84+n*50
            vol=0
            for i in range(n):
                v=struct.unpack_from('<12fH',raw,84+i*50);a,b,c=v[3:6],v[6:9],v[9:12]
                vol+=(a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6
            vol=abs(vol)
        assert (vol>0.001)==expect,(name,vol,log)
        return f'PASS {name}: solid residual/intersection {vol:.6f} mm^3'+(' (positive solid control)' if expect else '')
CASES += [('assumed-15mm-layout-walls','walls',[0,0,0],False),
          ('wood-tab-bores','tab_bores',[0,0,0],False),
          ('left-tab-material','left_tab',[0,0,0],True),
          ('top-tab-material','top_tab',[0,0,0],True),
          ('continuous-base-rim','missing_rim',[0,0,0],False),
          ('straight-left-brace','missing_straight_brace',[0,0,0],False)]
if __name__=='__main__':
    (ROOT/'logs').mkdir(exist_ok=True)
    with ThreadPoolExecutor(max_workers=2) as pool:
        for line in pool.map(check,CASES):print(line,flush=True)
    print('Digital assumed envelopes only; insertion sampled at 1 mm, not physical fit approval.')
