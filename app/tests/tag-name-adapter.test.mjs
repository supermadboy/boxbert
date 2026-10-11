import test from 'node:test';
import assert from 'node:assert/strict';
import {DemoAdapter,HttpAdapter} from '../src/adapters.mjs';
const store=()=>{let raw=null;return {getItem:()=>raw,setItem:(k,v)=>{raw=v;}};};
test('Demo tag names persist repeatedly and reset without changing UID or path',async()=>{
 const storage=store(),a=new DemoAdapter(storage);const before=await a.read();
 assert.equal(typeof a.renameTag,'function');
 await a.renameTag(before.tags[0].uid,'Schleichstegosaurus');
 const b=new DemoAdapter(storage);assert.equal((await b.read()).tags[0].name,'Schleichstegosaurus');
 await b.renameTag(before.tags[0].uid,'Dino 🦕');
 assert.deepEqual((await b.read()).tags[0],{...before.tags[0],name:'Dino 🦕'});
 b.failure='sd';await assert.rejects(b.renameTag(before.tags[0].uid,'Nein'));
 assert.equal((await b.read()).tags[0].name,'Dino 🦕');
 b.reset();assert.equal((await b.read()).tags[0].name,'Tag 1');
});
test('Migration retains legacy files/settings/buttons while adding tag labels',async()=>{
 const storage=store(),a=new DemoAdapter(storage);const legacy=await a.read();delete legacy.tags[0].name;delete legacy.tags[1].name;
 legacy.volume=3;legacy.buttons[0].path=legacy.files[1];storage.setItem('',JSON.stringify(legacy));
 const b=new DemoAdapter(storage);const s=await b.read();assert.equal(s.tags[0].name,'Tag 1');assert.equal(s.tags[1].name,'Tag 2');assert.equal(s.volume,3);assert.deepEqual(s.buttons,legacy.buttons);assert.deepEqual(s.files,legacy.files);
});
test('HTTP cannot rename tags without a firmware API',async()=>{
 const a=new HttpAdapter({origin:'http://box',password:'fixture',fetch:()=>{throw Error('Must not request');}});
 assert.equal(typeof a.renameTag,'function');await assert.rejects(a.renameTag('E3:2F:F6:33','Dino'),/nicht verfügbar/);
});
