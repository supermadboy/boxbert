export const INTRO_DB='boxbert-intros-v1';

// Decode locally, without an audio source, playback, upload or a v1 data migration.
export async function recordingDuration(record){
 if(Number.isFinite(record?.durationMs)&&record.durationMs>=0)return record.durationMs;
 try{
  const Context=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext;
  if(!Context||!record?.blob)return null;
  const context=new Context(1,1,44100);
  const audio=await context.decodeAudioData(await record.blob.arrayBuffer());
  return Number.isFinite(audio.duration)&&audio.duration>=0?audio.duration*1000:null;
 }catch{return null;}
}
export async function recordingStore(operation,uid,blob,{signal,durationMs}={}){
 signal?.throwIfAborted();
 const db=await new Promise((resolve,reject)=>{const r=indexedDB.open(INTRO_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('recordings',{keyPath:'uid'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Aufnahmespeicher blockiert. Andere Fenster schließen.'));});
 try{return await new Promise((resolve,reject)=>{
  signal?.throwIfAborted();const tx=db.transaction('recordings',operation==='get'?'readonly':'readwrite'),store=tx.objectStore('recordings');
  const abort=()=>{try{tx.abort();}catch{}};signal?.addEventListener('abort',abort,{once:true});
  let request;
  if(operation==='get')request=store.get(uid);
  else if(operation==='put')request=store.put({uid,blob,createdAt:Date.now(),...(Number.isFinite(durationMs)&&durationMs>=0?{durationMs}:{})});
  else if(operation==='delete')request=store.delete(uid);
  else if(operation==='clearDemo'){
   request=store.getAllKeys();
   request.onsuccess=()=>{for(const key of request.result)if(typeof key==='string'&&!key.startsWith('device:'))store.delete(key);};
  }else{tx.abort();throw Error('Unbekannte Aufnahmeoperation');}
  tx.oncomplete=()=>{signal?.removeEventListener('abort',abort);resolve(request.result);};
  tx.onabort=tx.onerror=()=>{signal?.removeEventListener('abort',abort);reject(tx.error||new DOMException('Aufnahme abgebrochen','AbortError'));};
 });}finally{db.close();}
}
