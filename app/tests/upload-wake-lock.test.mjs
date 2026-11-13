import {test} from 'node:test';
import assert from 'node:assert/strict';
import {keepUploadScreenAwake,uploadWakeMessage} from '../src/upload-wake-lock.mjs';
const settle=()=>new Promise(resolve=>setImmediate(resolve));
class Document extends EventTarget{
 visibilityState='visible';listeners=new Set();
 addEventListener(type,fn,...rest){super.addEventListener(type,fn,...rest);if(type==='visibilitychange')this.listeners.add(fn);}
 removeEventListener(type,fn,...rest){super.removeEventListener(type,fn,...rest);this.listeners.delete(fn);}
 visibility(value){this.visibilityState=value;this.dispatchEvent(new Event('visibilitychange'));}
}
class Sentinel extends EventTarget{
 released=false;releases=0;
 async release(){this.releases++;this.released=true;this.dispatchEvent(new Event('release'));}
}
function fixture(request){const document=new Document(),states=[],locks=[];let requests=0;const navigator={wakeLock:{request:async type=>{assert.equal(type,'screen');requests++;if(request)return request();const lock=new Sentinel();locks.push(lock);return lock;}}};const stop=keepUploadScreenAwake({document,navigator,onState:s=>states.push(s)});return {document,states,locks,stop,get requests(){return requests;}};}
test('upload screen lock is acquired and released exactly once on cleanup',async()=>{
 const f=fixture();await settle();assert.deepEqual(f.states,['requesting','held']);assert.equal(f.document.listeners.size,1);f.stop();f.stop();assert.equal(f.locks[0].releases,1);assert.equal(f.document.listeners.size,0);f.document.visibility('visible');await settle();assert.equal(f.requests,1);
});
test('unsupported API warns without failing or leaving listeners',()=>{
 const document=new Document(),states=[];const stop=keepUploadScreenAwake({document,navigator:{},onState:s=>states.push(s)});assert.deepEqual(states,['unavailable']);assert.equal(document.listeners.size,0);stop();
});
test('permission/power rejection warns and can retry after returning to visible',async()=>{
 const f=fixture(()=>Promise.reject(Error('denied')));await settle();assert.equal(f.states.at(-1),'denied');f.document.visibility('hidden');assert.equal(f.states.at(-1),'hidden');f.document.visibility('visible');await settle();assert.equal(f.requests,2);assert.equal(f.states.at(-1),'denied');f.stop();
});
test('system release warns and reacquires a new lock on return, never loops immediately',async()=>{
 const f=fixture();await settle();await f.locks[0].release();assert.equal(f.states.at(-1),'released');assert.equal(f.requests,1);f.document.visibility('hidden');f.document.visibility('visible');await settle();assert.equal(f.requests,2);assert.equal(f.states.at(-1),'held');f.stop();assert.equal(f.locks[1].releases,1);
});
test('visibility events do not duplicate a held lock or a pending request',async()=>{
 let grant;const f=fixture(()=>new Promise(resolve=>{grant=resolve;}));f.document.visibility('visible');f.document.visibility('visible');assert.equal(f.requests,1);const lock=new Sentinel();grant(lock);await settle();f.document.visibility('visible');await settle();assert.equal(f.requests,1);f.stop();assert.equal(lock.releases,1);
});
test('queued release of an old sentinel cannot clear its replacement',async()=>{
 const f=fixture();await settle();f.locks[0].released=true;f.document.visibility('visible');await settle();assert.equal(f.requests,2);f.locks[0].dispatchEvent(new Event('release'));assert.equal(f.states.at(-1),'held');f.stop();assert.equal(f.locks[1].releases,1);
});
test('late grant after cancellation/unmount is immediately released without stale UI updates',async()=>{
 let grant;const f=fixture(()=>new Promise(resolve=>{grant=resolve;}));f.stop();const before=[...f.states],lock=new Sentinel();grant(lock);await settle();assert.equal(lock.releases,1);assert.deepEqual(f.states,before);assert.equal(f.document.listeners.size,0);
});
test('late rejection and release failures cannot turn a completed upload into an error',async()=>{
 let reject;const f=fixture(()=>new Promise((_,r)=>{reject=r;}));f.stop();reject(Error('late'));await settle();assert.deepEqual(f.states,['requesting']);
 for(const release of [()=>{throw Error('sync');},()=>Promise.reject(Error('async'))]){const lock=new Sentinel();lock.release=release;const g=fixture(()=>lock);await settle();assert.doesNotThrow(g.stop);await settle();}
});
test('hidden document waits until visible before requesting screen lock',async()=>{
 const document=new Document();document.visibilityState='hidden';let requests=0;const stop=keepUploadScreenAwake({document,navigator:{wakeLock:{request:async()=>{requests++;return new Sentinel();}}}});await settle();assert.equal(requests,0);document.visibility('visible');await settle();assert.equal(requests,1);stop();
});
test('abort releases immediately even if transfer cleanup is still pending, including already aborted signal',async()=>{
 const c=new AbortController(),document=new Document(),lock=new Sentinel();let requests=0;
 const options={signal:c.signal,document,navigator:{wakeLock:{request:async()=>{requests++;return lock;}}}};
 const stop=keepUploadScreenAwake(options);await settle();c.abort();assert.equal(lock.releases,1);assert.equal(document.listeners.size,0);stop();assert.equal(lock.releases,1);keepUploadScreenAwake(options)();await settle();assert.equal(requests,1);
});
test('status copy explains active lock limits and manual fallback without promising background BLE',()=>{
 assert.match(uploadWakeMessage('held'),/Vordergrund/);assert.match(uploadWakeMessage('hidden'),/unterbrochen/);for(const state of ['denied','released','unavailable'])assert.match(uploadWakeMessage(state),/Display-Timeout/);
});
