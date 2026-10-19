#!/usr/bin/env python3
"""Run host-side firmware tests against the actual production headers."""
import os
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[2]


def main():
    compiler = os.environ.get('CXX', 'clang++')
    json_include = Path(os.environ.get('ARDUINOJSON_INCLUDE', str(Path.home() / '.local/share/boxbert-toolchain/user/libraries/ArduinoJson/src')))
    if not (json_include / 'ArduinoJson.h').is_file():
        raise SystemExit('ArduinoJson 7.4.2 headers missing: run tools/firmware/setup.py or set ARDUINOJSON_INCLUDE')
    with tempfile.TemporaryDirectory(prefix='boxbert-host-') as directory:
        for source in sorted((ROOT / 'firmware/host-tests').glob('*_test.cpp')):
            binary = Path(directory) / source.stem
            subprocess.run([compiler, '-std=c++17', '-Wall', '-Wextra', '-Werror', '-I', str(json_include),
                            '-fsanitize=address,undefined', '-fno-omit-frame-pointer',
                            str(source), '-o', str(binary)], check=True)
            subprocess.run([str(binary)], check=True)


if __name__ == '__main__':
    main()
