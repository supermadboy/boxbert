import test from 'node:test';
import assert from 'node:assert/strict';
import {DemoAdapter} from '../src/adapters.mjs';
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};};
test('Altdaten erhalten UID, Namen, Buttons, Pixel, Volume und erhalten Musik-Kategorien',async()=>{
 const store=storage(),before=await new DemoAdapter(store).read();
 delete before.categories;before.tags[0].name='Dino 🦕';before.buttons[4].path=before.files[1];
 store.setItem('boxbert-demo-v1',JSON.stringify(before));
 const state=await new DemoAdapter(store).read();
 assert.deepEqual(state.categories,Object.fromEntries(before.files.map(p=>[p,'musik'])));
 const {categories,...rest}=state;assert.deepEqual(rest,before);
});
test('Zweiter NeoPixel migriert unabhängig vom Stick und beide Kanäle persistieren separat',async()=>{
 const store=storage(),old=await new DemoAdapter(store).read();delete old.boardPixel;
 store.setItem('boxbert-demo-v1',JSON.stringify(old));const demo=new DemoAdapter(store);
 const state=await demo.read();assert.deepEqual(state.boardPixel,{color:'#dd5b00',brightness:20,palette:'solid',effect:'aus'});
 const board={color:'#00ff00',brightness:64,effect:'regenbogen'};
 await demo.settings({boardPixel:board});assert.deepEqual((await demo.read()).pixel,old.pixel);
 const stick={color:'#123456',brightness:9,effect:'atmen'};await demo.settings({pixel:stick,volume:4});
 const saved=await new DemoAdapter(store).read();assert.deepEqual(saved.boardPixel,{...board,palette:'rainbow',effect:'statisch'});assert.deepEqual(saved.pixel,{...stick,palette:'solid'});
 await assert.rejects(demo.settings({boardPixel:{...board,brightness:101}}));
 assert.deepEqual(await demo.read(),saved);
 demo.reset();assert.equal((await demo.read()).boardPixel.effect,'aus');
});
test('Upload und spätere Kategorieänderung persistieren nur MP3-Metadaten',async()=>{
 const store=storage(),demo=new DemoAdapter(store);
 await demo.upload(new File(['ID3'],'sound.mp3'),{category:'sounds'});
 assert.equal((await new DemoAdapter(store).read()).categories['/sound.mp3'],'sounds');
 await demo.categorize('/sound.mp3','musik');assert.equal((await new DemoAdapter(store).read()).categories['/sound.mp3'],'musik');
 const before=await demo.read();
 await assert.rejects(demo.upload(new File(['x'],'wrong.wav'),{category:'sounds'}));
 await assert.rejects(demo.upload(new File(['x'],'bad.mp3'),{category:'bad'}));
 await assert.rejects(demo.categorize('/sound.mp3','bad'));
 await assert.rejects(demo.categorize('/missing.mp3','sounds'));
 assert.deepEqual(await demo.read(),before);
 demo.reset();assert.ok(Object.values((await demo.read()).categories).every(c=>c==='musik'));
});
