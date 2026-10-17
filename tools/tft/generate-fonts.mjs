import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const revision='0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5';
const expr=`let pkgs = import (builtins.getFlake "github:NixOS/nixpkgs/${revision}").outPath {}; in pkgs.python3.withPackages (ps: [ ps.pillow ])`;
const result=spawnSync('nix',['shell','--impure','--expr',expr,'--command','python3','tools/tft/generate-fonts.py'],{cwd:fileURLToPath(new URL('../../',import.meta.url)),stdio:'inherit'});
process.exit(result.status??1);
