// Vollkörpertests an der tatsächlich exportierten STL, OpenSCAD/CGAL.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, mkdirSync } from 'node:fs';
import { spawnSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url));
const scratch = mkdtempSync(join(process.env.TMPDIR, 'neopixel-inserts-'));
process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));
mkdirSync(join(root, 'logs'), { recursive: true });
const holes = [[13.7, 7.7], [39.7, 7.7]];
function volume(raw) {
  const count = raw.readUInt32LE(80);
  assert.equal(raw.length, 84 + count * 50);
  let sum = 0;
  for (let i = 0; i < count; i++) {
    const o = 84 + i * 50 + 12;
    const v = Array.from({ length: 9 }, (_, k) => raw.readFloatLE(o + 4 * k));
    const [ax, ay, az, bx, by, bz, cx, cy, cz] = v;
    sum += (ax * (by * cz - bz * cy) + ay * (bz * cx - bx * cz) + az * (bx * cy - by * cx)) / 6;
  }
  return Math.abs(sum);
}
function solid(name, body) {
  const source = join(scratch, `${name}.scad`);
  const target = join(scratch, `${name}.stl`);
  writeFileSync(source, `$fn=64; module actual(){import(${JSON.stringify(join(root, 'neopixel_mount.stl'))});}\n${body}\n`);
  const r = spawnSync('openscad', ['--hardwarnings', '--export-format', 'binstl', '-o', target, source], { encoding: 'utf8', timeout: 300000 });
  const log = (r.stdout || '') + (r.stderr || '');
  writeFileSync(join(root, 'logs', `insert-${name}.log`), log);
  assert.ifError(r.error);
  assert.doesNotMatch(log, /WARNING|ERROR/);
  if (log.includes('Current top level object is empty')) {
    assert.ok(r.status === 0 || r.status === 1, log);
    return 0;
  }
  assert.equal(r.status, 0, log);
  return volume(readFileSync(target));
}
function cylinderAt([x, y], d, z, h) {
  return `translate([${x},${y},${z}]) cylinder(d=${d},h=${h});`;
}
test('Beide Inserts: volle Ø4-Aufnahme 6,7 mm tief ab unveränderter PCB-Auflage', () => {
  for (const [i, h] of holes.entries()) {
    // 0,01 mm radial/axial Rückzug vermeidet reine Kontaktflächen.
    const v = solid(`pocket-${i}`, `intersection(){actual();${cylinderAt(h, 3.98, 8.08, 6.68)}}`);
    assert.ok(v <= 0.001, `Loch ${i}: Aufnahme blockiert, Schnitt ${v.toFixed(6)} mm³`);
    console.log(`PASS insert pocket ${i}: ${v.toFixed(6)} mm³`);
  }
});

test('Durchgang Ø2,8 durch ganzen Halter, Gegenprobe mit künstlichem Boden', () => {
  for (const [i,h] of holes.entries()) {
    const probe=cylinderAt(h,2.78,-1,18);
    const v=solid(`through-${i}`,`intersection(){actual();${probe}}`);
    assert.ok(v<=0.001,`Durchgang ${i}: ${v} mm³`);
    const blocked=solid(`through-control-${i}`,`intersection(){union(){actual();translate([${h[0]-1.5},${h[1]-1.5},4])cube([3,3,0.4]);}${probe}}`);
    assert.ok(blocked>1,'Gegenprobe muss künstlichen Boden erkennen');
    console.log(`PASS through ${i}: ${v.toFixed(6)} mm³; plugged control ${blocked.toFixed(6)} mm³`);
  }
});
test('Insert-/Werkzeugzugang von oben ohne PCB: Ø8-Prüfhülle', () => {
  for (const [i,h] of holes.entries()) {
    // Prüfhülle, keine Behauptung über reale Lötkolbenspitzenmaße.
    const v=solid(`access-${i}`,`intersection(){actual();${cylinderAt(h,8,14.771,25)}}`);
    assert.ok(v<=0.001,`Zugang ${i}: ${v} mm³`);
    console.log(`PASS access ${i}: Ø8 above z14.77, ${v.toFixed(6)} mm³`);
  }
});
test('Volle mindestens 1,6-mm-Wand um maximal Ø4,6-Einsatz', () => {
  for (const [i,h] of holes.entries()) {
    // Ring r2.31..3.91 liegt innerhalb des facettierten Ø8-Pfostens.
    const ring=`difference(){${cylinderAt(h,7.82,8.08,6.68)}${cylinderAt(h,4.62,8.07,6.70)}}`;
    const missing=solid(`wall-${i}`,`difference(){${ring}actual();}`);
    assert.ok(missing<=0.001,`Wand ${i} fehlt: ${missing} mm³`);
    const control=solid(`wall-control-${i}`,`difference(){${cylinderAt(h,5,9.08,5.68)}actual();}`);
    assert.ok(control>1);
    console.log(`PASS wall ${i}: missing ${missing.toFixed(6)} mm³; control ${control.toFixed(6)} mm³`);
  }
});
const reference='6e14e5e'; // unveränderlicher Vorgänger dieser Nutzerkorrektur
const rel='3d-print/mounts/neopixel-stick-mount/';
function previous(file){return execFileSync('git',['show',`${reference}:${rel}${file}`],{cwd:root,maxBuffer:20*1024*1024});}
test('Form/Mittelbereich/Loch/Laschen/Kabelausgang und CNC unverändert', () => {
  const old=join(scratch,'previous.stl');
  writeFileSync(old,previous('neopixel_mount.stl'));
  const oldSolid=`import(${JSON.stringify(old)});`;
  const allowed=`union(){${holes.map(h=>cylinderAt(h,8.02,-1,18)).join('')}}`;
  for(const [name,a,b] of [['added','actual();',oldSolid],['removed',oldSolid,'actual();']]){
    const v=solid(`unchanged-${name}`,`difference(){difference(){${a}${b}}${allowed}}`);
    assert.ok(v<=0.001,`Änderung außerhalb zweier Pfosten: ${name} ${v} mm³`);
    console.log(`PASS unchanged outside two screw-post cylinders: ${name} ${v.toFixed(6)} mm³`);
  }
  const oldProbe=solid('baseline-reject',`intersection(){${oldSolid}${cylinderAt(holes[0],3.98,8.08,6.68)}}`);
  assert.ok(oldProbe>1,'Vorgänger muss Insertanforderung verfehlen');
  console.log(`PASS predecessor rejected: blocked cavity ${oldProbe.toFixed(6)} mm³`);
  for(const file of ['cnc-opening.dxf','cnc-rebate.dxf','cnc-glass.dxf','panel_cnc.stl']){
    const bytes=readFileSync(join(root,file));
    assert.ok(bytes.equals(previous(file)),`CNC geändert: ${file}`);
    console.log(`PASS CNC byte-identical ${file}: SHA256 ${createHash('sha256').update(bytes).digest('hex')}`);
  }
  const fresh = join(root,'.cad-check','panel_cnc.stl');
  const current = `import(${JSON.stringify(fresh)});`;
  const original = `import(${JSON.stringify(join(root,'panel_cnc.stl'))});`;
  // CGAL may emit triangles in a different order: validate solids, retain CNC bytes.
  for(const [name,a,b] of [['added',current,original],['removed',original,current]]){
    const v=solid(`fresh-cnc-${name}`,`difference(){${a}${b}}`);
    assert.ok(v<=0.001,`Frischer CNC-Export verändert Geometrie: ${name} ${v} mm³`);
    console.log(`PASS fresh CNC solid difference ${name}: ${v.toFixed(6)} mm³`);
  }
});
test('Maßkette RX-M2,5×5,7/M2,5×12 bei erhaltener PCB-Ebene', () => {
  const geometry=readFileSync(join(root,'geometry.scad'),'utf8');
  const val=key=>{const m=geometry.match(new RegExp(`^${key}=([0-9.]+);`,'m'));assert.ok(m,key);return Number(m[1]);};
  const z=val('wood_z')+val('wood_h')-val('glass_h')-val('optical_gap')-val('led_h')-val('pcb_t');
  const tip=z+val('pcb_t')-val('screw_length');
  const bottom=z-val('insert_l'), cavity=z-val('insert_depth');
  assert.ok(Math.abs(z-14.77)<1e-8);
  for(const [key,value] of Object.entries({screw_length:12,screw_clear:2.8,insert_d:4,insert_l:5.7,insert_depth:6.7,insert_max_d:4.6,post_d:8,board_hole_d:3}))assert.equal(val(key),value,key);
  assert.match(geometry,/board_holes=\[\[13\.7,7\.7\],\[39\.7,7\.7\]\];/);
  assert.ok(Math.abs((val('post_d')-val('insert_max_d'))/2-1.7)<1e-8);
  // Angenommen, nicht gemessen: L−0.2, PCB+0.15, Spitzenfase0.3, Sitz+0.2.
  assert.ok(tip+0.2+0.15+0.3<bottom-0.2);
  assert.ok(tip>0 && cavity>tip && bottom>cavity);
  console.log(`PASS stack: PCB underside ${z.toFixed(2)}, top ${(z+val('pcb_t')).toFixed(2)}, insert ${bottom.toFixed(2)}..${z.toFixed(2)}, cavity bottom ${cavity.toFixed(2)}, screw tip ${tip.toFixed(2)} mm; full nominal 5.7-mm insert reached`);
  console.log('USER CONFIRMED small-head PCB pass test; exact head envelope NOT measured/modelled. Heat-set/load/print tests NOT performed.');
});
