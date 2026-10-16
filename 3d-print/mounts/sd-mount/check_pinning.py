#!/usr/bin/env python3
"""Behavioral wrapper regression: preinstalled tools must not bypass Nix.

Isolated command shims test only reexec control flow. They never produce CAD
outputs and cannot replace the real render/mesh/solid checks.
"""
from pathlib import Path
import os
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent
with tempfile.TemporaryDirectory(prefix='sd-pinning-test-') as folder:
    bin_dir = Path(folder)
    calls = bin_dir/'nix.calls'
    for tool in ('openscad', 'xvfb-run', 'shellcheck'):
        p = bin_dir/tool
        p.write_text('#!/bin/sh\nexit 19\n')
        p.chmod(0o700)
    nix = bin_dir/'nix'
    nix.write_text('#!/bin/sh\nprintf "%s\\n" "$@" > "$PIN_TEST_CALLS"\nexit 0\n')
    nix.chmod(0o700)
    env = dict(os.environ, PATH=f'{bin_dir}:/usr/bin:/bin',
               PIN_TEST_CALLS=str(calls), BOXBERT_MESA='/unused-in-control-flow-test',
               DISPLAY=':unused-in-control-flow-test')
    # The normal caller is outside the pinned shell, regardless of inherited guards.
    for name in list(env):
        if name.startswith('BOXBERT_') and name not in ('BOXBERT_MESA',):
            del env[name]
    run = subprocess.run(['/bin/bash', str(ROOT/'render.sh')], env=env,
                         capture_output=True, text=True, timeout=30)
    assert calls.exists(), ('Preinstalled host tools bypass pinned Nix environment', run.returncode, run.stdout, run.stderr)
    arguments = calls.read_text()
    assert '0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5' in arguments, arguments
    assert '--command' in arguments and 'render.sh' in arguments, arguments
    assert run.returncode == 0, (run.returncode, run.stderr)
    print('PASS wrapper control flow: existing host tools still enter pinned Nix; no CAD output simulated.')
