#!/usr/bin/env python3
"""Actual CGAL solid intersections plus deliberate positive controls."""
from pathlib import Path
import subprocess
import tempfile
import struct
from concurrent.futures import ThreadPoolExecutor
ROOT=Path(__file__).resolve().parent
CASES=[('seated','wood',[0,0,-0.001],False),('shift-x','wood',[0.5,0,-0.001],True),('shift-y','wood',[0,0.5,-0.001],True),('too-deep','wood',[0,0,0.5],True),('heads-components','heads_components',[0,0,0],False),('pcb','pcb',[0,0,0],False),('cable-mount','cable_mount',[0,0,0],False),('cable-wood','cable_wood',[0,0,0],False),('rear-wall','rear',[0,0,0],False),('glass','glass',[0,0,0],False),('insertion','insertion',[0,0,0],False)]
def check(case):
    name,scene,shift,expect=case
    with tempfile.TemporaryDirectory(prefix='neopixel-fit-') as d:
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
        return f'PASS {name}: intersection {vol:.6f} mm^3'+(' (deliberate collision)' if expect else '')
if __name__=='__main__':
    (ROOT/'logs').mkdir(exist_ok=True)
    with ThreadPoolExecutor(max_workers=2) as pool:
        for line in pool.map(check,CASES):print(line,flush=True)
    print('Digital assumed envelopes only; insertion sampled at 1 mm, not physical fit approval.')
