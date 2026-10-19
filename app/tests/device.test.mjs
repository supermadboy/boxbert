import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto,createHmac} from 'node:crypto';
test('HTTP V1 same-origin RPC authenticates UTF8, rejects cross-origin and remote errors',async()=>{
 const {HttpTransport}=await import('../src/http-transport.mjs');let request;
 const t=new HttpTransport({origin:'http://box.local',password:'päss',fetch:async(url,opts)=>{request={url,opts};return {ok:true,json:async()=>({id:1,ok:true,result:{files:[]}})};}});
 assert.deepEqual(await t.rpc('read'),{files:[]});assert.equal(request.url,'/api/rpc');assert.equal(request.opts.headers.Authorization,'Basic '+Buffer.from('boxbert:päss').toString('base64'));assert.equal(JSON.parse(request.opts.body).op,'read');
 assert.throws(()=>new HttpTransport({origin:'https://external',password:'x'}),/HTTP/);
 const bad=new HttpTransport({origin:'http://box.local',password:'x',fetch:async()=>({ok:true,json:async()=>({id:1,ok:false,error:{code:'sd',message:'Karte fehlt'}})})});await assert.rejects(bad.rpc('stop'),/sd.*Karte fehlt/);
});

test('BLE default timeout accepts 24KB fragmented at firmware 20B/10ms pace (controlled clock)',async context=>{
 const {BleTransport}=await import('../src/ble-transport.mjs');const f=gattFixture();const t=new BleTransport({bluetooth:f.bluetooth,crypto:webcrypto});await t.connect('x');
 context.mock.timers.enable({apis:['setTimeout']});
 t.rx.writeValueWithResponse=async()=>{};
 const response=t.rpc('read');let done=false;response.finally(()=>{done=true;}).catch(()=>{});
 const bytes=new TextEncoder().encode(JSON.stringify({id:t.id,ok:true,result:{payload:'x'.repeat(24000)}})+'\n');
 for(let i=0;i<bytes.length;i+=20)setTimeout(()=>t.receive(bytes.slice(i,i+20)),10*(1+i/20));
 context.mock.timers.tick(10000);await Promise.resolve();assert.equal(done,false,'still receiving after old 10s deadline');
 context.mock.timers.tick(3000);assert.equal((await response).payload.length,24000);assert.equal(t.closed,false);assert.equal(t.timeout,30000);t.disconnect();
});
test('BLE cancelled chooser and delayed GATT setup cannot create zombie connections',async()=>{
 const {BleTransport}=await import('../src/ble-transport.mjs');
 for(const phase of ['chooser','gatt','notifications']){
  const f=gattFixture();let release;const wait=new Promise(r=>release=r);const connect=f.device.gatt.connect;
  if(phase==='gatt')f.device.gatt.connect=async()=>{await wait;return connect();};
  if(phase==='notifications'){const server=await connect(),service=await server.getPrimaryService();(await service.getCharacteristic('3')).startNotifications=()=>wait;}
  const bluetooth=phase==='chooser'?{requestDevice:()=>wait.then(()=>f.device)}:f.bluetooth;
  const t=new BleTransport({bluetooth,crypto:webcrypto});const c=new AbortController();const pending=t.connect('x',{signal:c.signal});
  await new Promise(r=>setImmediate(r));c.abort();t.disconnect();
  assert.equal(await Promise.race([pending.then(()=> 'resolved',()=> 'cancelled'),new Promise(r=>setTimeout(()=>r('hung'),30))]),'cancelled','cancellation does not wait for browser chooser/GATT');release();
  await assert.rejects(pending,/Abgebrochen|aborted|Getrennt/i);assert.equal(f.device.gatt.connected,false,phase);assert.equal(t.closed,true);assert.equal(f.requests.length,0);
 }
});
// Simulated GATT boundary; this is not a Bluetooth hardware test.
function gattFixture({respond=true}={}){
 const device=new EventTarget();let received='';const writes=[],requests=[];const tx=new EventTarget();tx.startNotifications=async()=>{};
 const notify=message=>{const bytes=new TextEncoder().encode(JSON.stringify(message)+'\n');for(let i=0;i<bytes.length;i+=20){const e=new Event('characteristicvaluechanged');e.targetValue=new DataView(bytes.slice(i,i+20).buffer);Object.defineProperty(e,'target',{value:{value:e.targetValue}});tx.dispatchEvent(e);}};
 const rx={writeValueWithResponse:async bytes=>{writes.push(bytes.length);received+=new TextDecoder().decode(bytes);if(received.endsWith('\n')){const r=JSON.parse(received);requests.push(r);received='';if(respond)notify({id:r.id,ok:true,result:r.op==='hello'?{nonce:'a'.repeat(64)}:r.op==='auth'?{authenticated:true}:{saved:true}});}}};
 device.gatt={connected:true,connect:async()=>({getPrimaryService:async()=>({getCharacteristic:async uuid=>uuid.endsWith('2')?rx:tx})}),disconnect:()=>{device.gatt.connected=false;device.dispatchEvent(new Event('gattserverdisconnected'));}};
 const bluetooth={requestDevice:async opts=>{assert.equal(opts.filters[0].services[0],'6f786265-7274-4000-8000-000000000001');return device;}};
 return {bluetooth,device,writes,requests,notify};
}
test('BLE chooser authenticates HMAC, uses <=20B writes and bounded sequential NDJSON',async()=>{
 const {BleTransport}=await import('../src/ble-transport.mjs');const f=gattFixture();const t=new BleTransport({bluetooth:f.bluetooth,crypto:webcrypto,timeout:100});
 await t.connect('päss');assert.equal(f.requests[0].op,'hello');assert.equal(f.requests[1].args.proof,createHmac('sha256','päss').update('a'.repeat(64)).digest('hex'));assert.ok(!JSON.stringify(f.requests).includes('päss'));
 assert.deepEqual(await t.rpc('renameTag',{uid:'E3:2F:F6:33',name:'Grüße'}),{saved:true});assert.ok(f.writes.every(n=>n<=20));
 const pending=t.rpc('read');await assert.rejects(t.rpc('read'),/busy/);await pending;
 f.device.gatt.disconnect();await assert.rejects(t.rpc('read'),/Getrennt/);
});
test('BLE timeout and oversized/malformed notifications disconnect instead of reusing desynchronized stream',async()=>{
 const {BleTransport}=await import('../src/ble-transport.mjs');const f=gattFixture({respond:false});const t=new BleTransport({bluetooth:f.bluetooth,crypto:webcrypto,timeout:15});await assert.rejects(t.connect('x'),/Zeitlimit/);assert.equal(f.device.gatt.connected,false);
 const g=gattFixture();const u=new BleTransport({bluetooth:g.bluetooth,crypto:webcrypto});await u.connect('x');g.notify({id:99,ok:true,result:{text:'x'.repeat(25000)}});assert.equal(g.device.gatt.connected,false);
});

test('Device tag rename sends NFC trimmed names and canonical defaults',async()=>{
 const {DeviceAdapter}=await import('../src/device-adapter.mjs');const state=await demoState(),calls=[];
 const a=new DeviceAdapter({rpc:async(op,args)=>{if(op==='read')return state;calls.push(args);return {saved:true};}});await a.read();
 await a.renameTag(state.tags[0].uid,'  Gru\u0308ße  ');assert.equal(calls.at(-1).name,'Grüße');
 await a.renameTag(state.tags[1].uid,'  ');assert.equal(calls.at(-1).name,'Tag 2');
});
test('Stored missing MP3 assignments remain repairable but cannot be newly assigned or played',async()=>{
 const {DeviceAdapter,validateDeviceState}=await import('../src/device-adapter.mjs');const state=await demoState();
 state.tags[0].path='/missing.mp3';state.tags[0].introPath='/old-intro.mp3';state.buttons[0].path='/old-button.mp3';
 const a=new DeviceAdapter({rpc:async()=>state});assert.deepEqual(await a.read(),state);
 for(const action of [()=>a.assign(state.tags[0].uid,'/missing.mp3'),()=>a.assignIntro(state.tags[0].uid,'/old-intro.mp3'),()=>a.assignButton(1,'/old-button.mp3'),()=>a.play('/missing.mp3')])assert.throws(action,/Datei unbekannt/);
 state.tags[0].path='/../bad.mp3';assert.throws(()=>validateDeviceState(state),/Firmware/);
});
async function demoState(){const {DemoAdapter}=await import('../src/adapters.mjs');const s=await new DemoAdapter({getItem:()=>null}).read();return {...s,status:{playing:false,paused:false,path:'',tagUid:'',positionSeconds:0,durationSeconds:0,batteryPercent:null,batteryVoltage:null,radio:'ble',wifiConnected:false,ip:'',firmware:'fixture-v1'}};}
test('DeviceAdapter maps every mutation, validates read and uploads only acknowledged 384B chunks',async()=>{
 const {DeviceAdapter}=await import('../src/device-adapter.mjs');const state=await demoState();const calls=[];let offset=0;const transport={rpc:async(op,args)=>{calls.push({op,args});if(op==='read')return state;if(op==='uploadBegin'){offset=0;return {offset:0};}if(op==='uploadChunk'){assert.equal(args.offset,offset);const n=Buffer.from(args.data,'base64').length;assert.ok(n<=384);offset+=n;return {offset};}if(op==='uploadCommit')return {path:'/new.mp3',size:800};return op==='play'||['pause','resume','stop'].includes(op)?{accepted:true}:{saved:true};}};
 const a=new DeviceAdapter(transport);await a.read();await a.assign(state.tags[0].uid,state.files[0]);await a.renameTag(state.tags[0].uid,'Neu');await a.assignIntro(state.tags[0].uid,'');await a.assignButton(1,'');await a.categorize(state.files[0],'sounds');await a.settings({volume:2});await a.play(state.files[0]);await a.pause();await a.resume();await a.stop();const progress=[];assert.equal((await a.upload(new File([new Uint8Array(800)],'new.mp3'),{onProgress:p=>progress.push(p)})).path,'/new.mp3');assert.equal(progress.at(-1),100);assert.equal(calls.filter(c=>c.op==='uploadChunk').length,3);
 transport.rpc=async()=>({...state,status:undefined});await assert.rejects(a.read(),/Firmware/);
});
test('Device upload rejects wrong offset, aborts own session and never commits or pretends success',async()=>{
 const {DeviceAdapter}=await import('../src/device-adapter.mjs');const state=await demoState();const calls=[];const a=new DeviceAdapter({rpc:async(op)=>{calls.push(op);if(op==='read')return state;if(op==='uploadBegin')return {offset:0};if(op==='uploadChunk')return {offset:999};return {saved:true};}});await a.read();await assert.rejects(a.upload(new File(['123'],'new.mp3')),/Offset/);assert.ok(calls.includes('uploadAbort'));assert.ok(!calls.includes('uploadCommit'));
});

test('HTTP fetch is invoked with Window receiver',async()=>{const {HttpTransport}=await import('../src/http-transport.mjs');const t=new HttpTransport({origin:'http://box',password:'x',fetch:async function(){assert.equal(this,globalThis);return {ok:true,json:async()=>({id:1,ok:true,result:{saved:true}})};}});await t.rpc('read');});
test('BLE stalled write still rejects within RPC timeout',async()=>{const {BleTransport}=await import('../src/ble-transport.mjs');const f=gattFixture();const t=new BleTransport({bluetooth:f.bluetooth,crypto:webcrypto,timeout:20});await t.connect('x');t.rx.writeValueWithResponse=()=>new Promise(()=>{});const result=await Promise.race([t.rpc('read').then(()=> 'resolved',e=>e.name),new Promise(r=>setTimeout(()=>r('hung'),100))]);assert.equal(result,'TimeoutError');});
