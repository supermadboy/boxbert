import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DemoAdapter,validateUpload} from '../src/adapters.mjs';
test('Zehn stabile Demo-Button-IDs: Belegung bleibt nach Reload, Reset leert alle',async()=>{
 const store=storage(),demo=new DemoAdapter(store);
 assert.deepEqual((await demo.read()).buttons,Array.from({length:10},(_,i)=>({id:i+1,path:''})));
 for(let id=1;id<=10;id++)await demo.assignButton(id,'/happy-tune.mp3');
 assert.ok((await new DemoAdapter(store).read()).buttons.every(b=>b.path==='/happy-tune.mp3'));
 await demo.assignButton(10,'');assert.equal((await new DemoAdapter(store).read()).buttons[9].path,'');
 demo.reset();assert.ok((await new DemoAdapter(store).read()).buttons.every(b=>b.path===''));
});
export const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)}};
test('Demo-Zuordnung wird persistiert und Reset stellt Simulation wieder her',async()=>{
 const store=storage(), demo=new DemoAdapter(store);
 assert.equal((await demo.read()).tags.length,2);
 await demo.assign('E3:2F:F6:33','/happy-tune.mp3');
 assert.equal((await new DemoAdapter(store).read()).tags[0].path,'/happy-tune.mp3');
 demo.reset(); assert.equal((await demo.read()).tags[0].path,'/arcade-music-loop.mp3');
});

test('Migration von v1 ergänzt nur leere Buttons und erhält alle alten Daten',async()=>{
 const store=storage(),old={files:['/own.mp3'],tags:[{uid:'E3:2F:F6:33',path:'/own.mp3'},{uid:'01:8C:F1:6E',path:'/own.mp3'}],volume:3,pixel:{color:'#123456',brightness:7,effect:'atmen'}};
 store.setItem('boxbert-demo-v1',JSON.stringify(old));const demo=new DemoAdapter(store),state=await demo.read();
 assert.equal(demo.warning,undefined);assert.equal(state.buttons.length,10);
 const {buttons,...rest}=state;assert.deepEqual(rest,{...old,tags:old.tags.map((t,i)=>({...t,name:`Tag ${i+1}`}))});
 await demo.assignButton(8,'/own.mp3');assert.equal((await new DemoAdapter(store).read()).buttons[7].path,'/own.mp3');
});
test('Ungültige Button-IDs und Dateien werden ohne Speicherung abgewiesen',async()=>{
 const store=storage(),demo=new DemoAdapter(store),initial=await demo.read();
 for(const id of [0,11,'1',null,NaN])await assert.rejects(demo.assignButton(id,'/happy-tune.mp3'),/unbekannt/);
 for(const path of ['/unknown.mp3',null,undefined])await assert.rejects(demo.assignButton(1,path),/unbekannt/);
 assert.deepEqual(await demo.read(),initial);assert.equal(store.getItem('boxbert-demo-v1'),null);
});
test('Beschädigte neue Buttondaten behalten die Speicherwarnung',async()=>{
 const base=await new DemoAdapter(storage()).read();
 for(const mutate of [s=>s.buttons.pop(),s=>s.buttons[9].id=1,s=>s.buttons[0].path='/unknown.mp3',s=>s.buttons=null,s=>s.buttons[0].id='1']){
  const state=structuredClone(base);mutate(state);const store=storage();store.setItem('boxbert-demo-v1',JSON.stringify(state));
  assert.match(new DemoAdapter(store).warning,/beschädigt/);
 }
});
test('Button-Speicherfehler und simulierter Fehler erzeugen keinen Erfolg',async()=>{
 const demo=new DemoAdapter({getItem:()=>null,setItem:()=>{throw Error('quota')}});
 await assert.rejects(demo.assignButton(1,'/happy-tune.mp3'),/Speicher/);assert.equal((await demo.read()).buttons[0].path,'');
 demo.failure='sd';await assert.rejects(demo.assignButton(1,'/happy-tune.mp3'),/Simulierter/);
});
test('Upload validiert Firmware-Namen, Grenzen und Duplikate',async()=>{
 for(const name of ['.a.mp3','x.MP3','a/b.mp3','ä.mp3','a b.mp3','a'.repeat(61)+'.mp3'])assert.throws(()=>validateUpload({name,size:1},[]));
 for(const size of [0,16777217])assert.throws(()=>validateUpload({name:'a.mp3',size},[]));
 validateUpload({name:'A-_.mp3',size:16777216},[]);
 assert.throws(()=>validateUpload({name:'a.mp3',size:1},['/a.mp3']));
 const demo=new DemoAdapter(storage()); await demo.upload(new File(['abc'],'neu.mp3'));
 assert.ok((await demo.read()).files.includes('/neu.mp3'));
});
test('Abbruch und simulierter Fehler hinterlassen keinen Upload',async()=>{
 const demo=new DemoAdapter(storage()), c=new AbortController();
 const transfer=demo.upload(new File(['abc'],'abbruch.mp3'),{signal:c.signal});c.abort();
 await assert.rejects(transfer,{name:'AbortError'});
 assert.ok(!(await demo.read()).files.includes('/abbruch.mp3'));
 demo.failure='sd';await assert.rejects(demo.upload(new File(['abc'],'fehler.mp3')),/SD/);
 assert.ok(!(await demo.read()).files.includes('/fehler.mp3'));
});
test('Demo-Lautstärke und Pixel persistieren; Grenzen werden erzwungen',async()=>{
 const store=storage(),demo=new DemoAdapter(store);
 await demo.settings({volume:4,pixel:{color:'#00ff00',brightness:10,effect:'atmen'}});
 assert.equal((await new DemoAdapter(store).read()).volume,4);
 await assert.rejects(demo.settings({volume:22}),/Lautstärke/);
 await assert.rejects(demo.settings({pixel:{color:'no',brightness:101,effect:'bad'}}));
});
test('Regenbogen persistiert und migriert auch v1 ohne Verlust monochromer Farbe',async()=>{
 const store=storage(),demo=new DemoAdapter(store),pixel={color:'#123456',brightness:0,effect:'regenbogen'};
 await demo.settings({pixel});assert.deepEqual((await new DemoAdapter(store).read()).pixel,pixel);
 const old=await demo.read();delete old.buttons;store.setItem('boxbert-demo-v1',JSON.stringify(old));
 const migrated=new DemoAdapter(store);assert.equal(migrated.warning,undefined);assert.deepEqual((await migrated.read()).pixel,pixel);
 for(const brightness of [-1,101,1.5])await assert.rejects(demo.settings({pixel:{...pixel,brightness}}),/ungültig/);
});
test('Defekter Speicher fällt sichtbar auf; Schreibfehler erzeugt keinen Erfolg',async()=>{
 const store=storage();store.setItem('boxbert-demo-v1','{');const demo=new DemoAdapter(store);
 assert.match(demo.warning,/beschädigt/);
 const broken=new DemoAdapter({getItem:()=>null,setItem:()=>{throw Error('quota')}});
 await assert.rejects(broken.assign('E3:2F:F6:33','/happy-tune.mp3'),/Speicher/);
 assert.equal((await broken.read()).tags[0].path,'/arcade-music-loop.mp3');
});
