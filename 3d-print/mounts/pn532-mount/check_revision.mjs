import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('.',import.meta.url)));
fs.mkdirSync('logs/revision',{recursive:true});
export function mesh(path){
 const b=fs.readFileSync(path), n=b.readUInt32LE(80);
 assert.equal(b.length,84+n*50,'binary STL size');
 const edges=new Map(), vertices=new Map(), faces=[];let volume=0, areaMin=Infinity;
 const bounds=[[Infinity,Infinity,Infinity],[-Infinity,-Infinity,-Infinity]];
 const key=v=>v.join(','); // preserve exact exported float vertices; do not weld nearby edges
 for(let f=0;f<n;f++){
  const v=[0,1,2].map(i=>[0,1,2].map(j=>b.readFloatLE(84+50*f+12+12*i+4*j)));
  for(const p of v)for(let j=0;j<3;j++){bounds[0][j]=Math.min(bounds[0][j],p[j]);bounds[1][j]=Math.max(bounds[1][j],p[j]);}
  const [a,c,d]=v;volume+=(a[0]*(c[1]*d[2]-c[2]*d[1])+a[1]*(c[2]*d[0]-c[0]*d[2])+a[2]*(c[0]*d[1]-c[1]*d[0]))/6;
  const u=c.map((x,i)=>x-a[i]),w=d.map((x,i)=>x-a[i]);
  areaMin=Math.min(areaMin,Math.hypot(u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0])/2);
  const ids=v.map(p=>{const k=key(p);if(!vertices.has(k))vertices.set(k,vertices.size);return vertices.get(k);});faces.push(ids);
  for(let i=0;i<3;i++){const a=ids[i],b=ids[(i+1)%3],k=[Math.min(a,b),Math.max(a,b)].join(':');const e=edges.get(k)||[];e.push([a,b,f]);edges.set(k,e);}
 }
 let badEdges=0;const adjacency=faces.map(()=>[]);
 for(const e of edges.values()){if(e.length!==2||e[0][0]!==e[1][1])badEdges++;else {adjacency[e[0][2]].push(e[1][2]);adjacency[e[1][2]].push(e[0][2]);}}
 const seen=new Set();let components=0;
 for(let i=0;i<n;i++)if(!seen.has(i)){components++;const todo=[i];while(todo.length){const f=todo.pop();if(seen.has(f))continue;seen.add(f);todo.push(...adjacency[f]);}}
 return {triangles:n,volume,areaMin,badEdges,components,bounds};
}
const m=mesh('pn532_mount.stl');
assert.ok(m.volume>0);assert.equal(m.badEdges,0);assert.equal(m.components,1);assert.ok(m.areaMin>1e-9);
for(let j=0;j<3;j++){assert.ok(Math.abs(m.bounds[0][j]-[-16,-2.2,0][j])<0.001);assert.ok(Math.abs(m.bounds[1][j]-[44.9,42.6,14][j])<0.001);}
console.log('MESH',JSON.stringify(m));
// Export the exact two union solids once; every insertion sample is still cut.
// This avoids repeating an identical expensive CGAL union in all 21 processes.
for(const scene of ['collision_panel','collision_assembly']){
 const path=`logs/revision/${scene}.stl`;fs.rmSync(path,{force:true});
 const r=spawnSync('openscad',['--hardwarnings','--export-format','binstl','-D',`scene="${scene}"`,'-o',path,'assembly.scad'],{encoding:'utf8',timeout:240000});
 fs.writeFileSync(`logs/revision/${scene}.log`,`${r.stdout??''}${r.stderr??''}`);
 assert.equal(r.status,0,`${scene}: ${r.stderr}`);
 const fixture=mesh(path);assert.equal(fixture.badEdges,0);assert.ok(fixture.areaMin>1e-9);assert.ok(fixture.volume>0);
 console.log('FIXTURE',scene,JSON.stringify(fixture));
}
const empty=['wood','glass','pcb','connector','cables','connector_wood','bores','insert_bottom_missing','insert_walls_missing','tools','tab_bores','heads_components','metal_components','metal_back','bottom_sector','tab_material_missing','wood_tools','solder_back'];
empty.push('electronics');
const open=['heads_tolerance'];
const positive=['bottom_control','wall_control','shift_control','depth_control','electronics_control','connector_wood_control','heads_components_control'];
const insertion=Array.from({length:21},(_,i)=>`insertion-${i}`);
let failures=0;const results={generated_at:new Date().toISOString(),sources:Object.fromEntries(['geometry.scad','pn532_mount.scad','assembly.scad','pn532_mount.stl'].map(p=>[p,createHash('sha256').update(fs.readFileSync(p)).digest('hex')])),mesh:m,threshold_mm3:0.00001,tests:[]};
for(const scene of [...empty,...positive,...insertion,...open]){
 const path=`logs/revision/${scene}.stl`;fs.rmSync(path,{force:true});
 const definitions=insertion.includes(scene)?['-D','scene="insertion"','-D',`shift=[0,0,${scene.split('-')[1]}]`]:['-D',`scene="${scene}"`];
 const r=spawnSync('openscad',['--hardwarnings','--export-format','binstl',...definitions,'-o',path,'assembly.scad'],{encoding:'utf8',timeout:240000});
 fs.writeFileSync(`logs/revision/${scene}.log`,`${r.stdout??''}${r.stderr??''}`);
 const isEmpty=r.status===1&&r.stderr?.includes('Current top level object is empty.');
 if(r.status!==0&&!isEmpty)throw Error(`${scene}: ${r.error||r.stderr}`);
 const volume=isEmpty?0:Math.abs(mesh(path).volume);
 const expect=positive.includes(scene)?'positive':open.includes(scene)?'OPEN assumed component/head collision':'empty';
 const pass=expect.startsWith('OPEN')?null:expect==='positive'?volume>0.01:volume<=results.threshold_mm3;
 console.log(`${expect.startsWith('OPEN')?'OPEN':pass?'PASS':'FAIL'} ${scene}: ${volume.toFixed(9)} mm³ (${expect})`);
 results.tests.push({scene,volume,expect,pass});if(pass===false)failures++;
}
// Length budget: no washer. Assumptions explicitly retained in README.
const minLength=1.3+0.1+0.3+3.75+0.2;
const maxLength=6.7-0.3+1.0-0.2;
const range={nominal_min:minLength,nominal_max:maxLength,example6_min_engagement:6-0.2-1.3-0.1-0.3,example6_min_floor_clearance:6.7-(6+0.2-1.0)};
console.log('SCREW_LENGTH_BUDGET',JSON.stringify(range));results.screw_length=range;
results.summary={passed:results.tests.filter(t=>t.pass===true).length,failed:failures,open:results.tests.filter(t=>t.pass===null).length,release:false};
console.log('SUMMARY',JSON.stringify(results.summary));
fs.writeFileSync('logs/revision/results.json',JSON.stringify(results,null,2)+'\n');
assert.equal(failures,0,`${failures} solid checks failed; no release`);
