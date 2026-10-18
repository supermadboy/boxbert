#!/usr/bin/env python3
"""Offline PNG masters → BBT2; no runtime image decoder."""
import struct
import zlib
import hashlib
import json
from pathlib import Path


def normalize(masters):
    """Explicit build step: discard render timestamps/statistics, preserve RGB pixels."""
    from PIL import Image
    for path in sorted(Path(masters).glob('frame-*.png')):
        with Image.open(path) as im:
            clean = Image.frombytes('RGB', im.size, im.convert('RGB').tobytes())
        clean.save(path, format='PNG', compress_level=9)


def convert(masters, output):
    from PIL import Image
    masters, output = Path(masters), Path(output)
    paths = sorted(masters.glob('frame-*.png'))
    if [p.name for p in paths] != [f'frame-{i:03d}.png' for i in range(12)]:
        raise ValueError('Expected exactly frame-000.png through frame-011.png')
    frames, records = [], []
    for i, path in enumerate(paths):
        with Image.open(path) as im:
            if im.size != (64, 64):
                raise ValueError(f'{path}: expected 64x64, got {im.size}')
            if im.mode not in ('RGB', 'RGBA'):
                raise ValueError(f'{path}: expected RGB/RGBA')
            if im.mode == 'RGBA' and im.getchannel('A').getextrema() != (255,255):
                raise ValueError(f'{path}: opaque masters required')
            raw = im.convert('RGB').tobytes()
            frame = rgb565(zip(raw[0::3], raw[1::3], raw[2::3]))
        frames.append(frame)
        records.append({'file': path.name, 'offset': 24 + i * 8192,
                        'bytes': 8192, 'pngSha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                        'rgb565Sha256': hashlib.sha256(frame).hexdigest()})
    data = package(frames, 64, 64, 160)
    manifest = {'format': 'BBT2', 'formatVersion': 2, 'pixelFormat': 'RGB565',
                'byteOrder': 'little', 'headerBytes':24, 'width':64, 'height':64,
                'frameCount':12, 'frameMs':160, 'durationMs':1920,
                'backgroundRgb': [16,16,16], 'backgroundRgb565': '0x1082',
                'quantization': 'R>>3, G>>2, B>>3; no dithering',
                'payloadBytes':len(data)-24, 'packageBytes':len(data),
                'payloadCrc32':f'{zlib.crc32(data[24:]):08x}',
                'packageSha256':hashlib.sha256(data).hexdigest(), 'frames':records}
    output.mkdir(parents=True, exist_ok=True)
    (output / 'boxbert.rgb565').write_bytes(data)
    (output / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    return manifest


def main():
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--normalize-masters', action='store_true', help='rewrite generated PNG masters without volatile render metadata')
    parser.add_argument('masters', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    if args.normalize_masters:
        normalize(args.masters)
    manifest = convert(args.masters, args.output)
    print(json.dumps({k:v for k,v in manifest.items() if k != 'frames'}, indent=2))


def package(frames, width, height, frame_ms):
    if (width, height, len(frames), frame_ms) != (64, 64, 12, 160):
        raise ValueError('BBT2 Boxbert requires 64x64, 12 frames, 160 ms')
    if any(len(frame) != width * height * 2 for frame in frames):
        raise ValueError('Invalid RGB565 frame size')
    payload = b''.join(frames)
    return struct.pack('<4sIIIII', b'BBT2', width, height, len(frames), frame_ms,
                       zlib.crc32(payload)) + payload


def rgb565(pixels):
    return b''.join(struct.pack('<H', ((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3))
                    for r, g, b in pixels)


if __name__ == '__main__':
    main()
