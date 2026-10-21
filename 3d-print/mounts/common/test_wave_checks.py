#!/usr/bin/env python3
"""Negative controls prove the real-DXF checks reject wrong widths/clearance."""
import contextlib
import io
from pathlib import Path
import tempfile
import unittest
from shapely.affinity import scale
from check_wave import check_contours, read_contour

ROOT=Path(__file__).resolve().parent.parent

def write_dxf(path,poly):
    points=list(poly.exterior.coords)
    out=['0','SECTION','2','ENTITIES']
    for a,b in zip(points,points[1:]):
        out += ['0','LINE','10',str(a[0]),'20',str(a[1]),'11',str(b[0]),'21',str(b[1])]
    path.write_text('\n'.join(out+['0','ENDSEC','0','EOF'])+'\n')

class WaveChecks(unittest.TestCase):
    def test_real_exports(self):
        for folder in ('pn532-mount','neopixel-stick-mount','feather-window-mount'):
            with self.subTest(folder=folder),contextlib.redirect_stdout(io.StringIO()):
                check_contours(ROOT/folder)

    def rejected(self,mutate):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)/'pn532-mount'
            root.mkdir()
            for name in ('opening','rebate','glass'):
                (root/f'cnc-{name}.dxf').write_bytes((ROOT/'pn532-mount'/f'cnc-{name}.dxf').read_bytes())
            mutate(root)
            with self.assertRaises(AssertionError),contextlib.redirect_stdout(io.StringIO()):
                check_contours(root)

    def test_old_two_mm_lip_rejected(self):
        def mutate(root):
            hole=read_contour(root/'cnc-opening.dxf')
            write_dxf(root/'cnc-rebate.dxf',hole.buffer(2))
            write_dxf(root/'cnc-glass.dxf',hole.buffer(1.8))
        self.rejected(mutate)

    def test_twelve_mm_crests_rejected(self):
        self.rejected(lambda root: write_dxf(root/'cnc-rebate.dxf',read_contour(root/'cnc-rebate.dxf').buffer(2)))

    def test_scaled_glass_rejected(self):
        self.rejected(lambda root: write_dxf(root/'cnc-glass.dxf',scale(read_contour(root/'cnc-rebate.dxf'),.98,.98)))

if __name__=='__main__':
    unittest.main()
