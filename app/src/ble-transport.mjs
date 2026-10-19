import {rpcResult} from './http-transport.mjs';
export const BLE_SERVICE='6f786265-7274-4000-8000-000000000001';
const RX=BLE_SERVICE.slice(0,-1)+'2',TX=BLE_SERVICE.slice(0,-1)+'3';
export class BleTransport{
 constructor({bluetooth=globalThis.navigator?.bluetooth,crypto=globalThis.crypto,timeout=30000,onDisconnect=()=>{}}={}){this.bluetooth=bluetooth;this.crypto=crypto;this.timeout=timeout;this.onDisconnect=onDisconnect;this.id=0;this.pending=null;this.buffer=[];this.closed=true;}
 async connect(password,options={}){
  const setup=this.setup(password,options);let cancel;
  const cancelled=new Promise((_,reject)=>{cancel=reject;this.cancelConnect=cancel;});
  try{return await Promise.race([setup,cancelled]);}finally{if(this.cancelConnect===cancel)this.cancelConnect=null;}
 }
 async setup(password,{signal}={}){
  if(!this.bluetooth||!this.crypto?.subtle)throw Error('BLE benötigt HTTPS/localhost, Web Bluetooth und WebCrypto (z.B. Chrome/Android).');
  signal?.throwIfAborted();this.disconnect();const generation=this.generation;let device;
  const abort=()=>this.disconnect(signal.reason);signal?.addEventListener('abort',abort,{once:true});
  const check=()=>{if(signal?.aborted||this.generation!==generation){if(device?.gatt.connected)device.gatt.disconnect();throw signal?.reason||new DOMException('Getrennt: Verbindungsaufbau abgebrochen.','AbortError');}};
  try{
   // Called before the first await: requestDevice retains user activation.
   device=await this.bluetooth.requestDevice({filters:[{services:[BLE_SERVICE]}]});check();this.device=device;
   this.lost=()=>this.disconnect(Error('Getrennt: BLE-Verbindung verloren.'));device.addEventListener('gattserverdisconnected',this.lost);
   const server=await device.gatt.connect();check();const service=await server.getPrimaryService(BLE_SERVICE);check();
   const rx=await service.getCharacteristic(RX);check();this.rx=rx;const tx=await service.getCharacteristic(TX);check();this.tx=tx;
   this.notify=e=>this.receive(new Uint8Array(e.target.value.buffer,e.target.value.byteOffset,e.target.value.byteLength));tx.addEventListener('characteristicvaluechanged',this.notify);await tx.startNotifications();check();this.closed=false;
   const {nonce}=await this.rpc('hello',{}, {signal});check();if(typeof nonce!=='string'||!/^[0-9a-f]{64}$/.test(nonce))throw Error('Ungültige BLE-Nonce.');
   const key=await this.crypto.subtle.importKey('raw',new TextEncoder().encode(password),{name:'HMAC',hash:'SHA-256'},false,['sign']);check();
   const signature=await this.crypto.subtle.sign('HMAC',key,new TextEncoder().encode(nonce));check();const proof=Array.from(new Uint8Array(signature),n=>n.toString(16).padStart(2,'0')).join('');await this.rpc('auth',{proof},{signal});check();
  }catch(e){if(this.generation===generation)this.disconnect(e);throw e;}finally{signal?.removeEventListener('abort',abort);}
 }
 receive(bytes){
  if(this.closed)return;
  try{for(const b of bytes){if(b===10){const line=new TextDecoder('utf-8',{fatal:true}).decode(new Uint8Array(this.buffer));this.buffer=[];const response=JSON.parse(line);if(!this.pending||response.id!==this.pending.id)throw Error('Unerwartete BLE-Antwort.');const p=this.pending;try{p.resolve(rpcResult(response,p.id));}catch(e){p.reject(e);}}
   else{if(this.buffer.length>=24576)throw Error('BLE-Antwort zu groß.');this.buffer.push(b);}}}
  catch(e){this.disconnect(e);}
 }
 async rpc(op,args={}, {signal}={}){
  if(this.closed)throw Error('Getrennt: BLE nicht verbunden.');if(this.pending)throw Error('busy: Nur eine RPC gleichzeitig.');signal?.throwIfAborted();const id=++this.id;const bytes=new TextEncoder().encode(JSON.stringify({id,op,args})+'\n');if(bytes.length>4096)throw Error('BLE-Request zu groß.');
  let timer,abort;const result=new Promise((resolve,reject)=>{const finish=(fn,value)=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);this.pending=null;fn(value);};this.pending={id,resolve:v=>finish(resolve,v),reject:e=>finish(reject,e)};abort=()=>this.disconnect(signal.reason||new DOMException('Abgebrochen','AbortError'));signal?.addEventListener('abort',abort,{once:true});timer=setTimeout(()=>this.disconnect(new DOMException('BLE RPC-Zeitlimit','TimeoutError')),this.timeout);});
  // Attach immediately so an early Notify/error cannot become an unhandled rejection during writes.
  result.catch(()=>{});
  void (async()=>{try{for(let offset=0;offset<bytes.length;offset+=20){if(this.closed)break;signal?.throwIfAborted();await this.rx.writeValueWithResponse(bytes.slice(offset,offset+20));}}catch(e){this.disconnect(e);}})();
  return result;
 }
 disconnect(reason=Error('Getrennt: BLE beendet.')){
  this.cancelConnect?.(reason);this.cancelConnect=null;this.generation=(this.generation??0)+1;const wasOpen=!this.closed;this.closed=true;this.buffer=[];this.pending?.reject(reason);
  this.tx?.removeEventListener('characteristicvaluechanged',this.notify);this.device?.removeEventListener('gattserverdisconnected',this.lost);if(this.device?.gatt.connected)this.device.gatt.disconnect();this.rx=null;this.tx=null;
  if(wasOpen)this.onDisconnect(reason);
 }
}
