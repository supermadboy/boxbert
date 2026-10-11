import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DemoAdapter,HttpAdapter} from '../src/adapters.mjs';
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)}};
test('Optionales Intro je RFID bleibt nach Reload, Song und anderer Tag bleiben unverändert',async()=>{
 const store=storage(),demo=new DemoAdapter(store),before=await demo.read();
 await demo.assignIntro(before.tags[0].uid,'/happy-tune.mp3');
 const after=await new DemoAdapter(store).read();
 assert.equal(after.tags[0].introPath,'/happy-tune.mp3');
 assert.equal(after.tags[0].path,before.tags[0].path);
 assert.deepEqual(after.tags[1],before.tags[1]);
 await demo.assignIntro(before.tags[0].uid,'');
 assert.equal((await new DemoAdapter(store).read()).tags[0].introPath,'');
 demo.reset();assert.ok((await demo.read()).tags.every(t=>t.introPath===''));
});
test('Migration ergänzt leere Intros ohne Verlust bestehender Daten',async()=>{
 const store=storage(),old=await new DemoAdapter(store).read();
 old.tags.forEach(t=>delete t.introPath);store.setItem('boxbert-demo-v1',JSON.stringify(old));
 const migrated=new DemoAdapter(store);assert.equal(migrated.warning,undefined);
 assert.deepEqual(await migrated.read(),{...old,tags:old.tags.map(t=>({...t,introPath:''}))});
});
test('Ungültige Intro-Daten, Fehler und voller Speicher erzeugen keinen Erfolg',async()=>{
 const store=storage(),demo=new DemoAdapter(store),before=await demo.read(),uid=before.tags[0].uid;
 for(const path of ['/unknown.mp3',null,undefined])await assert.rejects(demo.assignIntro(uid,path));
 await assert.rejects(demo.assignIntro('unknown','/happy-tune.mp3'));
 demo.failure='sd';await assert.rejects(demo.assignIntro(uid,'/happy-tune.mp3'),/Simulierter/);
 assert.deepEqual(await demo.read(),before);
 const broken=new DemoAdapter({getItem:()=>null,setItem:()=>{throw Error('quota')}});
 await assert.rejects(broken.assignIntro(uid,'/happy-tune.mp3'),/Speicher/);
 assert.equal((await broken.read()).tags[0].introPath,'');
 for(const value of ['/unknown.mp3',null,5]){const invalid=structuredClone(before);invalid.tags[0].introPath=value;store.setItem('boxbert-demo-v1',JSON.stringify(invalid));assert.match(new DemoAdapter(store).warning,/beschädigt/);}
});
test('Geräteadapter verweigert Intros ohne Firmware-API und sendet nichts',async()=>{
 let calls=0;const adapter=new HttpAdapter({origin:'http://boxbert.local',password:'test',fetch:()=>{calls++;}});
 await assert.rejects(adapter.assignIntro('E3:2F:F6:33','/happy-tune.mp3'),/Intro.*nicht verfügbar/);
 assert.equal(calls,0);
});
