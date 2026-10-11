import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DemoAdapter} from '../src/adapters.mjs';
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)}};
test('Legacy LED migration preserves all other demo data and persists canonical independent channels',async()=>{
 const store=storage(),demo=new DemoAdapter(store);await demo.categorize('/happy-tune.mp3','sounds');await demo.assignButton(3,'/happy-tune.mp3');await demo.renameTag('E3:2F:F6:33','Dino');
 const old=await demo.read();old.volume=2;old.pixel={color:'#123456',brightness:60,effect:'regenbogen'};old.boardPixel={color:'#fedcba',brightness:31,effect:'atmen'};
 store.setItem('boxbert-demo-v1',JSON.stringify(old));const migrated=new DemoAdapter(store),state=await migrated.read();assert.equal(migrated.warning,undefined);
 assert.deepEqual(state,{...old,pixel:{...old.pixel,palette:'rainbow',effect:'statisch'},boardPixel:{...old.boardPixel,palette:'solid'}});
 await migrated.settings({pixel:{...state.pixel,effect:'links-rechts'}});assert.deepEqual((await new DemoAdapter(store).read()).pixel,{...state.pixel,effect:'links-rechts'});assert.deepEqual((await migrated.read()).boardPixel,state.boardPixel);
});
test('Legacy settings writes stay supported, invalid channel/schema never persist or silently reset',async()=>{
 const store=storage(),demo=new DemoAdapter(store);await demo.settings({boardPixel:{color:'#abcdef',brightness:33,effect:'regenbogen'}});
 assert.deepEqual((await demo.read()).boardPixel,{color:'#abcdef',brightness:33,palette:'rainbow',effect:'statisch'});
 const initial=await demo.read(),raw=store.getItem('boxbert-demo-v1');
 for(const patch of [{pixel:{...initial.pixel,palette:'bad'}},{boardPixel:{...initial.boardPixel,effect:'links-rechts'}},{pixel:{...initial.pixel,effect:'kerze'}}])await assert.rejects(demo.settings(patch),/ungültig/);
 assert.equal(store.getItem('boxbert-demo-v1'),raw);assert.deepEqual(await demo.read(),initial);
 const bad={...initial,pixel:{...initial.pixel,palette:'bad'}};store.setItem('boxbert-demo-v1',JSON.stringify(bad));assert.match(new DemoAdapter(store).warning,/beschädigt/);assert.deepEqual(JSON.parse(store.getItem('boxbert-demo-v1')),bad);
});
