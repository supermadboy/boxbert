#!/usr/bin/env python3
"""Install the pinned, isolated Boxbert Arduino toolchain as the current user."""
import hashlib
from pathlib import Path
import platform
import subprocess
import tarfile
import urllib.request

HOME = Path.home() / '.local/share/boxbert-toolchain'
LIBRARIES = ['Adafruit PN532@1.3.4', 'Adafruit BusIO@1.17.4',
             'Adafruit GFX Library@1.12.6', 'Adafruit ST7735 and ST7789 Library@1.11.0',
             'Adafruit MAX1704X@1.0.3', 'Adafruit NeoPixel@1.15.1',
             'ArduinoJson@7.4.2', 'NimBLE-Arduino@2.3.6']


def download(url, target, digest):
    if not target.exists():
        urllib.request.urlretrieve(url, target)
    actual = hashlib.sha256(target.read_bytes()).hexdigest()
    if actual != digest:
        raise RuntimeError(f'Checksum mismatch for {target}; refusing installation')


def main():
    if platform.system() != 'Linux' or platform.machine() != 'x86_64':
        raise SystemExit('This installer pins Linux x86_64; use Arduino CLI 1.5.1 for your platform.')
    HOME.mkdir(parents=True, exist_ok=True)
    archive = HOME / 'arduino-cli_1.5.1.tar.gz'
    download('https://downloads.arduino.cc/arduino-cli/arduino-cli_1.5.1_Linux_64bit.tar.gz', archive,
             '28a8e119c498a25607821c36cb2dc49e8463941b261a0d99091baa7bc692dd2b')
    binary = HOME / 'bin/arduino-cli'
    if not binary.exists():
        binary.parent.mkdir(exist_ok=True)
        with tarfile.open(archive) as package:
            package.extract('arduino-cli', binary.parent, filter='data')
    config = HOME / 'arduino-cli.yaml'
    if not config.exists():
        config.write_text('board_manager:\n  additional_urls:\n    - https://espressif.github.io/arduino-esp32/package_esp32_index.json\n'
                          f'directories:\n  data: {HOME}/data\n  downloads: {HOME}/downloads\n  user: {HOME}/user\n')
    base = [str(binary), '--config-file', str(config)]
    def cli(*args):
        subprocess.run(base + list(args), check=True)
    cli('core', 'update-index')
    cli('core', 'install', 'esp32:esp32@3.3.12')
    cli('lib', 'install', *LIBRARIES)
    audio = HOME / 'ESP32-audioI2S-4.0.0.zip'
    download('https://github.com/schreibfaul1/ESP32-audioI2S/archive/refs/tags/4.0.0.zip', audio,
             'd7fe9e0c0daf8a045ec4528f341a602dc0a4a64af3e99d3b8c15ef244050a2c4')
    cli('config', 'set', 'library.enable_unsafe_install', 'true')
    try:
        cli('lib', 'install', '--zip-path', str(audio))
    finally:
        cli('config', 'set', 'library.enable_unsafe_install', 'false')
    cli('lib', 'list')
    print('No board has been flashed. Toolchain:', HOME)


if __name__ == '__main__':
    main()
