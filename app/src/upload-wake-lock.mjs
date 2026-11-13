// Screen Wake Lock is best effort, not a guarantee of background BLE execution.
// https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
export function keepUploadScreenAwake({navigator=globalThis.navigator,document=globalThis.document,signal,onState=()=>{}}={}){
 let stopped=false,pending=false,lock=null;
 const report=state=>{if(!stopped)onState(state);};
 const release=sentinel=>{try{Promise.resolve(sentinel.release()).catch(()=>{});}catch{/* Cleanup must not mask an upload result. */}};
 function released(){if(lock){lock.removeEventListener('release',released);lock=null;}report(document.visibilityState==='visible'?'released':'hidden');}
 async function acquire(){
  if(stopped||pending)return;
  if(document.visibilityState!=='visible'){report('hidden');return;}
  if(lock&&!lock.released){report('held');return;}
  if(lock){lock.removeEventListener('release',released);lock=null;}
  pending=true;report('requesting');
  try{const next=await navigator.wakeLock.request('screen');
   if(stopped){release(next);return;}
   lock=next;lock.addEventListener('release',released);
   if(lock.released)released();else report(document.visibilityState==='visible'?'held':'hidden');
  }catch{report('denied');}finally{pending=false;}
 }
 function visibility(){if(document.visibilityState==='visible')void acquire();else report('hidden');}
 function cancel(){report('released');stop();}
 function stop(){if(stopped)return;stopped=true;signal?.removeEventListener('abort',cancel);document?.removeEventListener('visibilitychange',visibility);if(lock){lock.removeEventListener('release',released);release(lock);lock=null;}}
 if(signal?.aborted){stopped=true;return stop;}
 signal?.addEventListener('abort',cancel,{once:true});
 if(!document||typeof navigator?.wakeLock?.request!=='function'){report('unavailable');return stop;}
 document.addEventListener('visibilitychange',visibility);void acquire();return stop;
}
export function uploadWakeMessage(state){
 if(state==='held')return 'Display wird während des Uploads wachgehalten. Chrome im Vordergrund lassen; nicht manuell sperren.';
 if(state==='requesting')return 'Display-Wachhalten wird angefragt …';
 if(state==='hidden')return 'Seite im Hintergrund: BLE kann unterbrochen werden. Zur Box-Seite zurückkehren und Display anlassen.';
 return 'Display-Wachhalten nicht verfügbar oder freigegeben. Display-Timeout vorübergehend verlängern und Chrome im Vordergrund lassen.';
}
