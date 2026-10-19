#!/usr/bin/env python3
"""Export verified non-private firmware binaries and SD UI into a new release directory."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('build', type=Path)
parser.add_argument('destination', type=Path)
args = parser.parse_args()
manifest = json.loads((args.build / 'manifest.json').read_text())
if manifest.get('privateBuild') is not False:
    parser.error('Private or unmarked builds must not be distributed')
root = Path(__file__).resolve().parents[2]
files = {}
for name, digest in manifest['files'].items():
    if Path(name).name != name:
        parser.error('Invalid manifest path')
    data = (args.build / 'artifacts' / name).read_bytes()
    if hashlib.sha256(data).hexdigest() != digest:
        parser.error('Artifact checksum mismatch: ' + name)
    if name.endswith('.bin'):
        files[name] = data
if not files:
    parser.error('No firmware binaries')
args.destination.mkdir(parents=True, exist_ok=False)
for name, data in files.items():
    (args.destination / name).write_bytes(data)
manifest['files'] = {name: hashlib.sha256(data).hexdigest() for name, data in files.items()}
(args.destination / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
shutil.copytree(root / 'app/dist-sd', args.destination / 'sd-www')
print('Exported generic firmware and SD UI:', args.destination)
