"""Run: python3 -m unittest discover -s tools/tft/tests -p test_frames.py -v."""
import importlib.util
from pathlib import Path
import struct
import tempfile
import unittest
import zlib

ROOT = Path(__file__).resolve().parents[3]
TOOL = ROOT / 'tools/tft/convert-frames.py'

class Frames(unittest.TestCase):
    def module(self):
        self.assertTrue(TOOL.exists(), 'RGB565 converter has not been implemented')
        spec = importlib.util.spec_from_file_location('frames', TOOL)
        assert spec is not None and spec.loader is not None
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module

    def test_png_normalization_removes_volatile_metadata(self):
        from PIL import Image
        from PIL.PngImagePlugin import PngInfo
        m = self.module()
        self.assertTrue(hasattr(m, 'normalize'), 'deterministic PNG metadata normalization missing')
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'frame-000.png'
            info = PngInfo(); info.add_text('Date', 'different every render')
            Image.new('RGB', (64,64), (16,16,16)).save(path, pnginfo=info)
            m.normalize(Path(tmp))
            with Image.open(path) as im:
                self.assertFalse(im.info)
            first = path.read_bytes()
            m.normalize(Path(tmp))
            self.assertEqual(first, path.read_bytes())

    def test_quantization_and_little_endian(self):
        m = self.module()
        self.assertEqual(m.rgb565([(255,0,0), (0,255,0), (0,0,255), (16,16,16), (255,255,255), (7,3,7)]),
                         bytes.fromhex('00f8e0071f008210ffff0000'))

    def test_package_header_frame_boundaries_integrity_timing(self):
        m = self.module()
        self.assertTrue(hasattr(m, 'package'), 'BBT2 packaging missing')
        frames = [bytes([i]) * 8192 for i in range(12)]
        data = m.package(frames, 64, 64, 160)
        self.assertEqual(struct.unpack('<4sIIIII', data[:24]),
                         (b'BBT2', 64, 64, 12, 160, zlib.crc32(b''.join(frames))))
        self.assertEqual(len(data), 98328)
        for i in range(12):
            self.assertEqual(data[24+i*8192:24+(i+1)*8192], frames[i])

    def test_invalid_dimensions_count_frame_size_and_timing_rejected(self):
        m = self.module()
        good = [b'\x00' * 8192] * 12
        for frames, w, h, ms in [(good, 63, 64, 160), (good, 64, 65, 160),
                                  (good[:-1], 64, 64, 160), ([b'bad']*12, 64,64,160),
                                  (good,64,64,0), (good,64,64,159)]:
            with self.subTest(w=w, h=h, ms=ms, count=len(frames)):
                with self.assertRaises(ValueError):
                    m.package(frames, w, h, ms)

    def test_png_validation_manifest_and_reproducible_conversion(self):
        from PIL import Image
        m = self.module()
        self.assertTrue(hasattr(m, 'convert'), 'PNG conversion missing')
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            masters = base / 'masters'
            masters.mkdir()
            for i in range(12):
                Image.new('RGB', (64,64), (16,16,16)).save(masters / f'frame-{i:03d}.png')
            manifest = m.convert(masters, base)
            data = (base / 'boxbert.rgb565').read_bytes()
            self.assertEqual(manifest['payloadCrc32'], f'{zlib.crc32(data[24:]):08x}')
            self.assertEqual(manifest['frameMs'],160)
            self.assertEqual(manifest['durationMs'],1920)
            self.assertEqual(manifest['frames'][0]['offset'],24)
            self.assertEqual(manifest['frames'][-1]['offset'],90136)
            self.assertEqual(data[24:26],bytes.fromhex('8210'))
            self.assertEqual(manifest, m.convert(masters, base))
            Image.new('RGB',(63,64)).save(masters / 'frame-003.png')
            with self.assertRaises(ValueError):
                m.convert(masters, base)
            Image.new('RGBA',(64,64),(16,16,16,0)).save(masters / 'frame-003.png')
            with self.assertRaises(ValueError):
                m.convert(masters, base)

    def test_real_asset_background_integrity_and_loop_seam(self):
        import hashlib
        import json
        from PIL import Image
        base = ROOT / 'assets/tft/boxbert'
        manifest = json.loads((base / 'manifest.json').read_text())
        data = (base / 'boxbert.rgb565').read_bytes()
        self.assertEqual(hashlib.sha256(data).hexdigest(), manifest['packageSha256'])
        self.assertEqual(zlib.crc32(data[24:]), struct.unpack_from('<I',data,20)[0])
        frames = []
        for i, record in enumerate(manifest['frames']):
            path = base / 'masters' / record['file']
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(),record['pngSha256'])
            im = Image.open(path)
            self.assertEqual(im.size,(64,64))
            for x,y in [(0,0),(63,0),(0,63),(63,63)]:
                self.assertEqual(im.getpixel((x,y)),(16,16,16))
            raw = im.tobytes()
            expected = self.module().rgb565(zip(raw[0::3],raw[1::3],raw[2::3]))
            self.assertEqual(data[record['offset']:record['offset']+8192],expected)
            frames.append(raw)
        # RGB mean absolute difference across the loop seam must be subtle.
        seam = sum(abs(a-b) for a,b in zip(frames[-1],frames[0])) / len(frames[0])
        self.assertLess(seam,2.0)
        self.assertNotEqual(frames[0],frames[8], 'blink must change actual pixels')

if __name__ == '__main__':
    unittest.main()
