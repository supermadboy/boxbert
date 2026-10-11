import {test} from 'node:test';
import assert from 'node:assert/strict';
import {HttpAdapter} from '../src/adapters.mjs';
test('Fetch behält Window/globalThis als Empfänger statt Adapter (Browser Illegal invocation)',async()=>{
 const api=new HttpAdapter({origin:'http://box',password:'',fetch:async function(path){assert.equal(this,globalThis);return Response.json(path==='/files'?['/a.mp3']:[{uid:'E3:2F:F6:33',path:'/a.mp3'},{uid:'01:8C:F1:6E',path:'/a.mp3'}]);}});await api.read();
});
const files=['/a.mp3'];const tags=[{uid:'E3:2F:F6:33',path:'/a.mp3'},{uid:'01:8C:F1:6E',path:'/a.mp3'}];
test('HTTP spricht nur Etappe-5-Routen mit Auth, Form und Multipart',async()=>{
 const calls=[];const api=new HttpAdapter({origin:'http://boxbert.local',password:'test-only',fetch:async(path,opts)=>{calls.push([path,opts]);return Response.json(path==='/files'?files:path==='/tags'&&!opts.method?tags:{ok:true});}});
 const state=await api.read();assert.deepEqual(state.files,files);assert.equal(state.volume,null);
 await api.assign(tags[0].uid,'/a.mp3');await api.upload(new File(['x'],'b.mp3'));
 assert.deepEqual(calls.map(c=>c[0]),['/files','/tags','/tags','/upload']);
 assert.equal(calls[2][1].body.toString(),'uid=E3%3A2F%3AF6%3A33&path=%2Fa.mp3');
 assert.equal(calls[3][1].body.get('file').name,'b.mp3');assert.equal(calls[0][1].cache,'no-store');
 assert.match(calls[0][1].headers.Authorization,/^Basic /);
 await assert.rejects(api.settings({volume:6}),/nicht verfügbar/);assert.equal(calls.length,4);
});
test('Hosted HTTPS kann keinen HTTP-ESP-Adapter starten',()=>{
 assert.throws(()=>new HttpAdapter({origin:'https://habibi.supermittel.com',password:''}),/lokalen HTTP/);
});
test('HTTP Fehler, ungültige Antworten und Abort erzeugen keinen Demo-Erfolg',async()=>{
 for(const status of [401,403,409,413,500]){
 const api=new HttpAdapter({origin:'http://box',password:'',fetch:async()=>new Response('Fehler',{status})});
 await assert.rejects(api.read(),new RegExp(String(status)));
 }
 for(const response of [()=>Response.json({ok:true}),()=>new Response('kein JSON')]){
 const api=new HttpAdapter({origin:'http://box',password:'',fetch:async()=>response()});await assert.rejects(api.read(),/Antwort/);
 }
 const c=new AbortController();c.abort();const api=new HttpAdapter({origin:'http://box',password:'',fetch:async(p,o)=>{o.signal.throwIfAborted()}});
 await assert.rejects(api.read({signal:c.signal}),{name:'AbortError'});
});
test('HTTP Schreibantwort muss ok true sein; unbekannte UID wird nie gesendet',async()=>{
 let count=0;const api=new HttpAdapter({origin:'http://box',password:'',fetch:async(p)=>{count++;return Response.json(p==='/files'?files:p==='/tags'?tags:{ok:false})}});
 await api.read();await assert.rejects(api.assign('NEU','/a.mp3'),/bekannten/);assert.equal(count,2);
 await assert.rejects(api.upload(new File(['x'],'b.mp3')),/Antwort/);
});
