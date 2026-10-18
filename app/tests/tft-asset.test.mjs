import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as client from '../src/tft-client.mjs';
const wasm=readFileSync(new URL('../../tools/tft/build/tft-renderer.wasm',import.meta.url));
test('V2 lädt echte versionierte Frames unverändert und verwirft CRC-Fehler',async()=>{
 const {instance:{exports:e}}=await WebAssembly.instantiate(wasm);
 const data=readFileSync(new URL('../../assets/tft/boxbert/boxbert.rgb565',import.meta.url));
 const url=buffer=>'data:application/octet-stream;base64,'+buffer.toString('base64');
 await client.loadTftAsset(e,url(data));
 assert.deepEqual(Buffer.from(new Uint8Array(e.memory.buffer,e.tft_asset_input(),data.length)),data);
 const bad=Buffer.from(data);bad[100]^=1;
 await assert.rejects(client.loadTftAsset(e,url(bad)),/Prüfsumme/);
 const args=[2,42,204,7,78,0,2,0,-1],frame=fn=>new Uint8Array(e.memory.buffer,fn(...args),64800).slice();
 assert.deepEqual(frame(e.tft_render_v2),frame(e.tft_render));
 await assert.rejects(client.loadTftAsset(e,url(data),AbortSignal.abort()),{name:'AbortError'});
});

test('V2 lädt Geräteframes in echten WASM und meldet falsches Format mit V1-Fallback',async()=>{
 assert.equal(typeof client.loadTftAsset,'function');
 const {instance:{exports:e}}=await WebAssembly.instantiate(wasm);
 await assert.rejects(client.loadTftAsset(e,'data:application/octet-stream,broken'),/Format|Größe/);
 const args=[2,42,204,7,78,0,2,0,-1],frame=fn=>new Uint8Array(e.memory.buffer,fn(...args),64800).slice();
 assert.deepEqual(frame(e.tft_render_v2),frame(e.tft_render));
});
