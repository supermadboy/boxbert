import test from 'node:test';
import assert from 'node:assert/strict';
import {rgb565ToRgba,writeUtf8,loadTftRenderer} from '../src/tft-client.mjs';

test('RGB565-Kanalexpansion ist explizit und verwendet den Gerätebuffer unverändert',()=>{
 const bytes=Uint8Array.from([0x00,0xf8,0xe0,0x07,0x1f,0x00,0xff,0xff,0,0]);
 assert.deepEqual([...rgb565ToRgba(bytes)], [255,0,0,255,0,255,0,255,0,0,255,255,255,255,255,255,0,0,0,255]);
 const allocation=new Uint8Array(30).fill(123);allocation.set(bytes,8);
 assert.deepEqual(rgb565ToRgba(allocation.subarray(8,18)),rgb565ToRgba(bytes),'WASM-buffer view with nonzero byteOffset');
});

test('UTF-8-Eingabe bleibt begrenzt, terminiert und schneidet keine Umlaute/Emoji an',()=>{
 const target=new Uint8Array(8).fill(99);
 writeUtf8(target,'Äß🦊x');
 assert.equal(new TextDecoder('utf-8',{fatal:true}).decode(target.subarray(0,target.indexOf(0))),'Äß');
 assert.equal(target[7],0);
 writeUtf8(target,'Ö');
 assert.deepEqual([...target],[195,150,0,0,0,0,0,0]);
});

test('Defekter WASM-Download schlägt sichtbar fehl, ohne Ersatzrenderer',async()=>{
 await assert.rejects(loadTftRenderer('data:application/wasm,not-wasm'),WebAssembly.CompileError);
});
