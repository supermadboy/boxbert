import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DemoAdapter,validateUpload} from '../src/adapters.mjs';
export const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)}};
test('Demo-Zuordnung wird persistiert und Reset stellt Simulation wieder her',async()=>{
 const store=storage(), demo=new DemoAdapter(store);
 assert.equal((await demo.read()).tags.length,2);
 await demo.assign('E3:2F:F6:33','/happy-tune.mp3');
 assert.equal((await new DemoAdapter(store).read()).tags[0].path,'/happy-tune.mp3');
 demo.reset(); assert.equal((await demo.read()).tags[0].path,'/arcade-music-loop.mp3');
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
test('Defekter Speicher fällt sichtbar auf; Schreibfehler erzeugt keinen Erfolg',async()=>{
 const store=storage();store.setItem('boxbert-demo-v1','{');const demo=new DemoAdapter(store);
 assert.match(demo.warning,/beschädigt/);
 const broken=new DemoAdapter({getItem:()=>null,setItem:()=>{throw Error('quota')}});
 await assert.rejects(broken.assign('E3:2F:F6:33','/happy-tune.mp3'),/Speicher/);
 assert.equal((await broken.read()).tags[0].path,'/arcade-music-loop.mp3');
});
