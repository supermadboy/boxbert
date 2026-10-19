export function rpcResult(response,id){
 if(!response||response.id!==id||typeof response.ok!=='boolean')throw Error('Ungültige RPC-Antwort.');
 if(!response.ok)throw Error(`${response.error?.code||'unknown'}: ${response.error?.message||'Gerätefehler'}`);
 if(!response.result||typeof response.result!=='object')throw Error('Ungültiges RPC-Ergebnis.');
 return response.result;
}
export class HttpTransport{
 constructor({origin=globalThis.location?.origin,password,fetch=globalThis.fetch,timeout=10000}){
  const url=new URL(origin);if(url.protocol!=='http:'||(globalThis.location&&url.origin!==location.origin))throw Error('HTTP-Gerät nur Same Origin im vertrauten lokalen WLAN. Externe HTTPS-PWA: BLE verwenden.');
  this.fetch=fetch.bind(globalThis);this.auth='Basic '+btoa(String.fromCharCode(...new TextEncoder().encode('boxbert:'+password)));this.id=0;this.timeout=timeout;this.pending=false;this.controller=null;
 }
 async rpc(op,args={}, {signal}={}){
  if(this.pending)throw Error('busy: Nur eine RPC gleichzeitig.');if(!this.auth)throw Error('Getrennt.');signal?.throwIfAborted();this.pending=true;
  const controller=new AbortController();this.controller=controller;const abort=()=>controller.abort(signal.reason);signal?.addEventListener('abort',abort,{once:true});const timer=setTimeout(()=>controller.abort(new DOMException('RPC-Zeitlimit','TimeoutError')),this.timeout);const id=++this.id;
  try{const r=await this.fetch('/api/rpc',{method:'POST',body:JSON.stringify({id,op,args}),headers:{Authorization:this.auth,'Content-Type':'application/json'},signal:controller.signal,cache:'no-store',credentials:'omit',mode:'same-origin'});if(!r.ok)throw Error(`HTTP ${r.status}: ${r.status===401?'Passwort prüfen.':'Geräteanfrage fehlgeschlagen.'}`);return rpcResult(await r.json(),id);}
  finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);this.pending=false;this.controller=null;}
 }
 disconnect(){this.auth='';this.controller?.abort(new DOMException('Getrennt','AbortError'));}
}
