import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {recordingStore} from '../src/intro-recordings.mjs';

// Minimal asynchronous IndexedDB boundary; the production store/reset call runs unchanged.
function memoryDatabase(rows){
 const records=new Map(rows.map(row=>[row.uid,row]));
 const indexedDB={open(){const request={};queueMicrotask(()=>{request.result={close(){},transaction(){
  const tx={};let pending=0;
  const schedule=fn=>{const r={};pending++;queueMicrotask(()=>{r.result=fn();r.onsuccess?.();if(!--pending)queueMicrotask(()=>tx.oncomplete?.());});return r;};
  tx.objectStore=()=>({get:key=>schedule(()=>records.get(key)),put:row=>schedule(()=>records.set(row.uid,row)),delete:key=>schedule(()=>records.delete(key)),clear:()=>schedule(()=>records.clear()),getAllKeys:()=>schedule(()=>[...records.keys()])});
  return tx;
 }};request.onsuccess();});return request;}};
 return {indexedDB,records};
}
test('Demo reset deletes demo intros but preserves every device original, including untransferred audio',async t=>{
 const uid='E3:2F:F6:33',blob=new Blob(['untransferred original'],{type:'audio/webm'});
 const original={uid:'device:'+uid,blob,createdAt:123,durationMs:700};
 const db=memoryDatabase([{uid,blob:new Blob(['demo'])},{uid:'other-demo',blob:new Blob(['demo 2'])},original,{uid:'device:other',blob}]);
 const previous=globalThis.indexedDB;globalThis.indexedDB=db.indexedDB;t.after(()=>{globalThis.indexedDB=previous;});
 // Use the actual operation invoked by App.reset(), not an invented reset API.
 const main=await readFile(new URL('../src/main.jsx',import.meta.url),'utf8');
 const operation=main.match(/async function reset\(\)[\s\S]*?await recordingStore\('([^']+)'\)/)?.[1];
 assert.ok(operation,'reset must await recording deletion');
 await recordingStore(operation);
 assert.equal(await recordingStore('get',uid),undefined);
 assert.equal(await recordingStore('get','other-demo'),undefined);
 assert.equal(await recordingStore('get','device:'+uid),original);
 assert.deepEqual([...db.records.keys()],['device:'+uid,'device:other']);
 assert.equal(await original.blob.text(),'untransferred original');
});
