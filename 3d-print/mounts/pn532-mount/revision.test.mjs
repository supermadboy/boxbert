import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
const file=name=>readFileSync(new URL(name,import.meta.url));
const g=file('./geometry.scad').toString(),part=file('./pn532_mount.scad').toString();
const scalar=name=>{const found=g.match(new RegExp(`(?:^|[;\\s])${name}\\s*=\\s*(-?[0-9.]+)\\s*;`));assert.ok(found,`numeric scalar ${name}`);return Number(found[1]);};
test('Außenfoto: rechteckige PCB, Anschlusskanten und Lochdiagonale',()=>{
 assert.match(g,/photo_holes\s*=\s*\[\[7\.725,32\.675\],\[34\.975,7\.725\]\]/);
 assert.match(g,/board_holes=photo_holes/);assert.match(g,/pcb_w=42\.7; pcb_d=40\.4/);
 assert.equal(34.975-7.725,27.25);assert.ok(Math.abs(32.675-7.725-24.95)<1e-10);
});
test('Gefertigte CNC/Glas-Dateien und Quelle bleiben bytegleich',()=>{
 const baseline={
 'cnc-opening.dxf':'9d61fac72e2f41fa41106a3929f95f84d4a7d103b3e07fe4064622d3b2e31349',
 'cnc-rebate.dxf':'4737e57e52451f322602fe9323bf0ffad079bdcf102f0beca8a9cdcf58a04432',
 'cnc-glass.dxf':'701b159f0435259bb1a4f836c06ed49b5cdc7def6853066d82e47057e2127d9d',
 'panel_cnc.stl':'30a25f49912755436e77e12f22b9702b6dbb884117a3b05f0a461878165183d9',
 'pn532-glass.svg':'42e3b0ac074de68ea6710d5d0d8b73668b41d5981cab1456dea05d7005cee5ef',
 'panel_cnc.scad':'87eeab93fcbf6d3a856aeb7f9c5e0ff46b51ff47f34c37c08124f874a0143406',
 '../common/wave.scad':'6a5d9a16cf88ffd08e158215028f7589b86d98df3031d1c03dc47466de7a07bc'};
 for(const [name,hash] of Object.entries(baseline))assert.equal(createHash('sha256').update(file(name)).digest('hex'),hash,name);
 assert.match(g,/opening=\[-2\.4,-2\.4,47\.5,45\.2\]/);
});
test('Eine Lasche links oben, zweite unten am rechten CAD-Limit mit Guideabstand',()=>{
 assert.match(g,/photo_wood_points=\[\[-10,32\.675\],\[38\.4,-10\]\]/);
 // Lower-right guide starts at x=41.6. 6-mm neck plus 0.2-mm clearance.
 assert.equal(scalar('bottom_tab_x'),41.6-0.2-6/2);
 assert.match(part,/module wood_tabs\(/);
 assert.match(part,/stop_z-tab_h/);
 assert.match(part,/module rear_clearance\(/);
});
test('Prüfhüllen umschließen auch die dargestellten langen Pins',()=>{
 assert.match(part,/board_z-connector_h\]\)cylinder\(d=0\.7,h=connector_h\)/);
 assert.match(part,/board_z-unused_h\]\)cylinder\(d=0\.7,h=unused_h\)/);
});
test('Außenschichtung: Glas vor Bauteilen, Gitter hinter PCB, rückwärtige Steckhüllen',()=>{
 assert.match(g,/\+z OUTSIDE/);
 assert.equal(scalar('board_z'),10);assert.equal(scalar('base_h'),2);
 assert.equal(scalar('rf_gap'),5.5);assert.equal(scalar('glass_inner_z'),16.65);
 assert.ok(scalar('glass_inner_z')-scalar('board_z')-scalar('pcb_t')-scalar('components_h')>0.49);
 assert.match(g,/module cnc_to_photo\(\)\{translate\(\[0,0,-cnc_z_offset\]\)children\(\);\}/);
 assert.match(part,/module connector\(\).*board_z-connector_h/);
 assert.match(part,/module unused_pins\(\).*board_z-unused_h/);
 assert.match(part,/module solder_front\(\).*board_z\+pcb_t/);
 assert.ok(scalar('board_z')-scalar('insert_depth')>scalar('base_h'));
});
