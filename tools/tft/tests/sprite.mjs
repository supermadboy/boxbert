import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
const {instance:{exports:e}}=await WebAssembly.instantiate(readFileSync('tools/tft/build/tft-renderer.wasm'));
const args=[2,42,204,7,78,0,2,0,-1];
const bytes=p=>Buffer.from(new Uint8Array(e.memory.buffer,p,64800));
assert.equal(typeof e.tft_render_v2,'function','optional V2 render entry point');
assert.deepEqual(bytes(e.tft_render_v2(...args)),bytes(e.tft_render(...args)),'missing asset is exact V1 fallback');
console.log('PASS absent sprite: exact V1 fallback');
// Deliberately simple solid frames exercise the binary protocol independently of Blender.
function crc32(data){let c=0xffffffff;for(const b of data){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
const pack=Buffer.alloc(24+64*64*2*12);pack.write('BBT2');
for(const [i,n] of [64,64,12,160].entries())pack.writeUInt32LE(n,4+i*4);
for(let f=0;f<12;f++)for(let i=0;i<4096;i++)pack.writeUInt16LE(f?0x07e0:0xf800,24+f*8192+i*2);
pack.writeUInt32LE(crc32(pack.subarray(24)),20);
assert.equal(typeof e.tft_asset_input,'function','bounded WASM staging buffer');
function load(data){assert.ok(data.length<=e.tft_asset_capacity());new Uint8Array(e.memory.buffer,e.tft_asset_input(),data.length).set(data);return e.tft_set_asset(e.tft_asset_input(),data.length);}
assert.equal(load(pack),1);
const v2=bytes(e.tft_render_v2(...args));
assert.equal(v2.readUInt16LE((26*240+8)*2),0xf800,'LE first sprite pixel');
assert.equal(v2.readUInt16LE((89*240+71)*2),0xf800,'exact 64x64 extent');
assert.equal(v2.readUInt16LE((26*240+72)*2),0x1082,'no sprite outside bounds');
assert.equal(bytes(e.tft_render_v2(...args.slice(0,7),159,-1)).readUInt16LE((26*240+8)*2),0xf800);
assert.equal(bytes(e.tft_render_v2(...args.slice(0,7),160,-1)).readUInt16LE((26*240+8)*2),0x07e0);
assert.deepEqual(bytes(e.tft_render_v2(...args.slice(0,7),1920,-1)),v2,'loop returns to first frame');
assert.equal(bytes(e.tft_render_v2(3,...args.slice(1,7),160,-1)).readUInt16LE((26*240+8)*2),0xf800,'pause freezes first frame');
assert.deepEqual(v2.subarray(91*480),bytes(e.tft_render(...args)).subarray(91*480),'timeline unchanged');
console.log('PASS LE frame bounds, exact timing, loop, pause, unchanged timeline');
for(const mutate of [b=>b.fill(0,0,4),b=>b.writeUInt32LE(0,4),b=>b.writeUInt32LE(0xffffffff,8),b=>b.writeUInt32LE(0,12),b=>b.writeUInt32LE(0,16),b=>b[20]^=1,b=>b[100]^=1]){
 const bad=Buffer.from(pack);mutate(bad);assert.equal(load(bad),0,'corrupt header/payload rejected');
 assert.deepEqual(bytes(e.tft_render_v2(...args)),bytes(e.tft_render(...args)),'corrupt asset resets exact V1');
 assert.equal(load(pack),1,'valid retry');
}
for(const size of [0,23,24,pack.length-1,0xffffffff]){assert.equal(e.tft_set_asset(e.tft_asset_input(),size),0);assert.deepEqual(bytes(e.tft_render_v2(...args)),bytes(e.tft_render(...args)));}
assert.equal(e.tft_set_asset(0,pack.length),0);assert.equal(e.tft_set_asset(0xfffffff0,pack.length),0);
const dir=mkdtempSync(`${tmpdir()}/boxbert-sprite-`),path=`${dir}/test.rgb565`;writeFileSync(path,pack);
assert.equal(load(pack),1);
const native=spawnSync('tools/tft/build/tft-native',['','',...args.map(String),'--asset',path]);
assert.equal(native.status,0,'native runner accepts same optional binary asset');
assert.deepEqual(native.stdout,bytes(e.tft_render_v2(...args)),'native/WASM exact V2 pixels');
console.log('PASS malformed asset fallback, reload, bounded pointers, native/WASM V2 pixels');
const assetPath='assets/tft/boxbert/boxbert.rgb565',actualAsset=readFileSync(assetPath);assert.equal(load(actualAsset),1);
const {states}=JSON.parse(readFileSync('firmware/ui/fixtures/states.json'));
const times=[0,159,...Array.from({length:11},(_,i)=>(i+1)*160),1920,0xffffffff];
let comparisons=0;
for(const s of states)for(const time of times){
 for(const [ptr,text,capacity] of [[e.tft_figure_input(),s.figure,512],[e.tft_title_input(),s.title,2048]]){const target=new Uint8Array(e.memory.buffer,ptr,capacity);target.fill(0);new TextEncoder().encodeInto(text,target.subarray(0,capacity-1));}
 const values=[s.playback,s.elapsedSeconds,s.durationSeconds,s.volume,s.batteryPercent,s.charging,s.wifi,time,s.scrollOverride];
 const rendered=bytes(e.tft_render_v2(...values));
 const real=spawnSync('tools/tft/build/tft-native',[s.figure,s.title,...values.map(String),'--asset',assetPath]);
 assert.equal(real.status,0);assert.deepEqual(real.stdout,rendered,`${s.name}@${time}: native/WASM actual device frames`);
 // Text/status may not overwrite the reserved sprite rectangle.
 const selected=s.playback===2?Math.floor(time/160)%12:0;
 for(let y=0;y<64;y++)assert.deepEqual(rendered.subarray(((26+y)*240+8)*2,((26+y)*240+72)*2),actualAsset.subarray(24+selected*8192+y*128,24+selected*8192+(y+1)*128));
 comparisons++;
}
console.log(`PASS actual Blender device frames: ${comparisons} native/WASM snapshots, all frame selections and unmodified sprite pixels`);
