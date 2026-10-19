#!/usr/bin/env python3
"""Prepare and compile Boxbert without changing its reference sketches.

Build output and optional secret headers remain outside the checkout.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_HOME = Path.home() / '.local/share/boxbert-toolchain'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cli', default=os.environ.get('ARDUINO_CLI', str(DEFAULT_HOME / 'bin/arduino-cli')))
    parser.add_argument('--config', default=os.environ.get('ARDUINO_CONFIG', str(DEFAULT_HOME / 'arduino-cli.yaml')))
    parser.add_argument('--secrets', type=Path, help='Private Secrets.h outside any repository; never included in release bundles')
    parser.add_argument('--output', type=Path, help='New build directory outside the checkout')
    args = parser.parse_args()
    if args.secrets and args.secrets.resolve().is_relative_to(ROOT):
        parser.error('Secrets must be outside the repository')
    if (ROOT / 'firmware/boxbert/Secrets.h').exists():
        parser.error('Remove the in-checkout Secrets.h; pass a private external header explicitly')
    base = [args.cli, '--config-file', args.config]
    cli_info = json.loads(subprocess.check_output(base + ['--json', 'version'], text=True))
    if cli_info.get('VersionString') != '1.5.1':
        parser.error('Requires Arduino CLI 1.5.1; run tools/firmware/setup.py')
    core_info = json.loads(subprocess.check_output(base + ['--json', 'core', 'list'], text=True))
    cores = {p['id']: p.get('installed_version') for p in core_info.get('platforms', [])}
    if cores.get('esp32:esp32') != '3.3.12':
        parser.error('Requires esp32:esp32@3.3.12; run tools/firmware/setup.py')
    libs = json.loads(subprocess.check_output(base + ['--json', 'lib', 'list'], text=True))
    versions = {p['library']['name']: p['library']['version'] for p in libs.get('installed_libraries', [])}
    required = {'ESP32-audioI2S-master': '4.0.0', 'NimBLE-Arduino': '2.3.6',
                'ArduinoJson': '7.4.2', 'Adafruit PN532': '1.3.4',
                'Adafruit BusIO': '1.17.4', 'Adafruit GFX Library': '1.12.6',
                'Adafruit ST7735 and ST7789 Library': '1.11.0',
                'Adafruit MAX1704X': '1.0.3', 'Adafruit NeoPixel': '1.15.1'}
    if any(versions.get(name) != version for name, version in required.items()):
        parser.error('Library versions differ from the pinned set; run tools/firmware/setup.py')
    cache = Path.home() / '.cache'
    cache.mkdir(parents=True, exist_ok=True)
    out = args.output.resolve() if args.output else Path(tempfile.mkdtemp(prefix='boxbert-build-', dir=cache))
    if out.is_relative_to(ROOT):
        parser.error('Build output must be outside the repository')
    if args.output:
        out.mkdir(parents=True, exist_ok=False)
    out.chmod(0o700)
    sketch = out / 'source/boxbert'
    shutil.copytree(ROOT / 'firmware/boxbert', sketch)
    shutil.copyfile(ROOT / 'firmware/Config.h', sketch / 'Config.h')
    shutil.copytree(ROOT / 'firmware/ui', sketch / 'src/ui')
    shutil.copytree(ROOT / 'firmware/runtime', sketch / 'src/runtime')
    asset = (ROOT / 'assets/tft/boxbert/boxbert.rgb565').read_bytes()
    with (sketch / 'TftAsset.h').open('w') as handle:
        handle.write('#pragma once\n#include <stdint.h>\nalignas(4) static const uint8_t BoxbertTftAsset[] = {\n')
        for pos in range(0, len(asset), 24):
            handle.write(','.join(f'0x{v:02x}' for v in asset[pos:pos+24]) + ',\n')
        handle.write('};\n')
    if args.secrets:
        shutil.copyfile(args.secrets, sketch / 'Secrets.h')
        (sketch / 'Secrets.h').chmod(0o600)
    command = [args.cli, '--config-file', args.config, 'compile', '--fqbn',
               'esp32:esp32:adafruit_feather_esp32s3_reversetft',
               '--build-path', str(out / 'build'), '--output-dir', str(out / 'artifacts'),
               '--jobs', '2', '--warnings', 'all', str(sketch)]
    print('Build directory:', out, flush=True)
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    (out / 'compile.log').write_text(result.stdout)
    print(result.stdout)
    if result.returncode:
        raise SystemExit(result.returncode)
    manifest = {'fqbn': 'esp32:esp32:adafruit_feather_esp32s3_reversetft',
                'core': '3.3.12', 'libraries': required, 'privateBuild': bool(args.secrets), 'files': {}}
    for artifact in sorted((out / 'artifacts').glob('*')):
        if artifact.is_file():
            manifest['files'][artifact.name] = hashlib.sha256(artifact.read_bytes()).hexdigest()
    (out / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print('Compiled. No device was flashed. Manifest:', out / 'manifest.json')


if __name__ == '__main__':
    main()
