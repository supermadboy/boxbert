import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
const file=name=>readFileSync(new URL(name,import.meta.url));
const g=file('./geometry.scad').toString();
test('Bauteilseiten-Lochbild oben links/unten rechts, rechteckiges Raster',()=>{
 assert.match(g,/photo_holes\s*=\s*\[\[7\.725,32\.675\],\[34\.975,7\.725\]\]/);
 assert.match(g,/board_holes=photo_holes/);
 assert.match(g,/rf_gap=10\.5;/);
 assert.match(g,/board_z=10;/);
 assert.equal(34.975-7.725,27.25);assert.ok(Math.abs(32.675-7.725-24.95)<1e-10);
 assert.match(g,/pcb_w=42\.7; pcb_d=40\.4/);
});
test('Gefertigte CNC/Glas-Dateien und Quelle bleiben bytegleich',()=>{
 const baseline={
  'cnc-opening.dxf':'9d61fac72e2f41fa41106a3929f95f84d4a7d103b3e07fe4064622d3b2e31349',
  'cnc-rebate.dxf':'4737e57e52451f322602fe9323bf0ffad079bdcf102f0beca8a9cdcf58a04432',
  'cnc-glass.dxf':'701b159f0435259bb1a4f836c06ed49b5cdc7def6853066d82e47057e2127d9d',
  'panel_cnc.stl':'30a25f49912755436e77e12f22b9702b6dbb884117a3b05f0a461878165183d9',
  'pn532-glass.svg':'42e3b0ac074de68ea6710d5d0d8b73668b41d5981cab1456dea05d7005cee5ef',
  'panel_cnc.scad':'87eeab93fcbf6d3a856aeb7f9c5e0ff46b51ff47f34c37c08124f874a0143406',
  '../common/wave.scad':'6a5d9a16cf88ffd08e158215028f7589b86d98df3031d1c03dc47466de7a07bc'
 };
 for(const [name,hash] of Object.entries(baseline))assert.equal(createHash('sha256').update(file(name)).digest('hex'),hash,name);
 assert.match(g,/opening=\[-2\.4,-2\.4,47\.5,45\.2\]/);
 assert.match(g,/wood_z=18\.5; wood_h=12; glass_h=3/);
});
const scalar=name=>{
 const found=g.match(new RegExp(`(?:^|[;\\s])${name}\\s*=\\s*(-?[0-9.]+)\\s*;`));
 assert.ok(found,`numeric scalar ${name}`);return Number(found[1]);
};
test('Druckschichtung: Gitter hinter PCB, Einsätze von innen, unveränderte CNC-Ebenen',()=>{
 const z=scalar('board_z'),base=scalar('base_h'),installed=scalar('installed_base_z');
 const glassInner=installed-(scalar('wood_z')+scalar('wood_h')-scalar('glass_h'));
 assert.equal(z,10);assert.equal(base,2);assert.equal(glassInner,-0.5);
 assert.equal(z-glassInner,10.5);assert.equal(scalar('stop_z'),8.5);
 assert.ok(z-scalar('insert_depth')>base);
 assert.ok((scalar('post_d')-scalar('insert_max_d'))/2>=1.6);
 assert.equal(installed-z,17);
 assert.match(g,/translate\(\[pcb_w,0,installed_base_z\]\)rotate\(\[0,180,0\]\)/);
});
test('Foto-links, freie Bauteilseite und gemeinsam vereinigte Prüfhüllen',()=>{
 assert.match(g,/photo_wood_points=\[\[-10,7\.725\],\[-10,32\.675\]\]/);
 const part=file('./pn532_mount.scad').toString(),assembly=file('./assembly.scad').toString();
 assert.match(part,/module electronics\(\).*board_z\+pcb_t/);
 assert.match(part,/module connector\(\).*board_z\+pcb_t/);
 for(const scene of ['electronics','connector_wood','heads_components','metal_components']){
  const line=assembly.split('\n').find(l=>l.includes(`scene=="${scene}"`));
  assert.ok(line.includes('union(){'),`${scene}: hulls must be unioned BEFORE intersection`);
 }
});
