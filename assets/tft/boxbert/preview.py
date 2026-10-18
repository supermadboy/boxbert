#!/usr/bin/env python3
"""Offline contact sheet of the actual RGB565 device payload (not PNG masters)."""
from pathlib import Path
import struct
import zlib
from PIL import Image, ImageDraw

base = Path(__file__).resolve().parent
data = (base / 'boxbert.rgb565').read_bytes()
magic,w,h,count,ms,crc = struct.unpack('<4sIIIII',data[:24])
assert (magic,w,h,count,ms) == (b'BBT2',64,64,12,160)
assert zlib.crc32(data[24:]) == crc
assert len(data) == 24+w*h*count*2
sheet=Image.new('RGB',(4*208,3*226),(16,16,16))
draw=ImageDraw.Draw(sheet)
for i in range(count):
    frame=data[24+i*w*h*2:24+(i+1)*w*h*2]
    rgb=bytearray()
    for (v,) in struct.iter_unpack('<H',frame):
        r,g,b=(v>>11)&31,(v>>5)&63,v&31
        rgb.extend(((r<<3)|(r>>2),(g<<2)|(g>>4),(b<<3)|(b>>2)))
    im=Image.frombytes('RGB',(w,h),bytes(rgb)).resize((192,192),Image.Resampling.NEAREST)
    x,y=(i%4)*208+8,(i//4)*226+8
    sheet.paste(im,(x,y))
    draw.text((x,y+196),f'{i:02d} / {i*ms:04d} ms',fill=(235,235,224))
sheet.save(base / 'contact-sheet.png')
print(f'RGB565 contact sheet: {sheet.size}, 12 verified payload frames')
