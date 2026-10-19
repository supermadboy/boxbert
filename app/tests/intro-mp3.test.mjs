import {test} from 'node:test';
import assert from 'node:assert/strict';
test('local PCM conversion produces real MP3 frames and clips safely',async()=>{
 const {encodeMp3}=await import('../src/intro-mp3.mjs');const pcm=Float32Array.from({length:44100},(_,i)=>Math.sin(i*440*2*Math.PI/44100)*0.05);const blob=await encodeMp3(pcm,44100);assert.equal(blob.type,'audio/mpeg');const bytes=new Uint8Array(await blob.arrayBuffer());assert.ok(bytes.length>8000);assert.equal(bytes[0],255);assert.equal(bytes[1]&224,224);
 await assert.rejects(encodeMp3(new Float32Array(),44100),/leer/);const c=new AbortController();c.abort();await assert.rejects(encodeMp3(pcm,44100,{signal:c.signal}),{name:'AbortError'});
});
test('intro transfer commits MP3 before assigning and preserves source on device error',async()=>{
 const {transferIntro}=await import('../src/intro-mp3.mjs');const source=new Blob(['original']);const calls=[];const a={upload:async f=>{calls.push(['upload',f.name,f.type]);return {path:'/'+f.name};},read:async()=>{calls.push(['read']);},assignIntro:async(uid,path)=>calls.push(['assign',uid,path])};const convert=async blob=>{assert.equal(blob,source);return new Blob(['encoded'],{type:'audio/mpeg'});};await transferIntro(a,'E3:2F:F6:33',source,{convert});assert.equal(calls[0][2],'audio/mpeg');assert.match(calls[0][1],/^intro-[a-z0-9-]+\.mp3$/);assert.equal(calls.at(-1)[0],'assign');assert.equal(source.size,8);
 a.upload=async()=>{throw Error('sd: failed');};calls.length=0;await assert.rejects(transferIntro(a,'E3:2F:F6:33',source,{convert}),/sd/);assert.equal(calls.length,0);
});
