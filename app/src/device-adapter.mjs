import {knownUIDs,validName,validateUpload} from './adapters.mjs';
import {renameTag as renamed} from './tag-names.mjs';
import {validateLedSettings} from './led-effects.mjs';
const categoryOK=c=>['musik','sounds'].includes(c);
export function validateDeviceState(s){
 const path=p=>typeof p==='string'&&p.startsWith('/')&&validName(p.slice(1));
 const linked=p=>p===''||path(p);
 const status=s?.status;
 if(!s||!Array.isArray(s.files)||!s.files.every(path)||new Set(s.files).size!==s.files.length||!Array.isArray(s.tags)||s.tags.length!==2||!knownUIDs.every(uid=>s.tags.filter(t=>t?.uid===uid).length===1)||!s.tags.every(t=>typeof t.name==='string'&&linked(t.path)&&linked(t.introPath))||!Array.isArray(s.buttons)||s.buttons.length!==10||!s.buttons.every((b,i)=>b?.id===i+1&&linked(b.path))||!s.categories||!s.files.every(p=>categoryOK(s.categories[p]))||!Number.isInteger(s.volume)||s.volume<0||s.volume>21||!validateLedSettings(s.pixel,'stick')||!validateLedSettings(s.boardPixel,'board')||!status||!['playing','paused','wifiConnected'].every(k=>typeof status[k]==='boolean')||!['path','tagUid','radio','ip','firmware'].every(k=>typeof status[k]==='string')||!['positionSeconds','durationSeconds'].every(k=>Number.isFinite(status[k])&&status[k]>=0)||!['batteryPercent','batteryVoltage'].every(k=>status[k]===null||Number.isFinite(status[k])))throw Error('Firmware-Antwort passt nicht zum Gesamtfirmware-V1-Vertrag.');
 return structuredClone(s);
}
export class DeviceAdapter{
 constructor(transport){this.transport=transport;this.state=null;this.capabilities={device:true,settings:true,mapping:true,categories:true,intro:true,player:true};this.uploading=false;}
 async read(options){this.state=validateDeviceState(await this.transport.rpc('read',{},options));return structuredClone(this.state);}
 async mutate(op,args,options){const r=await this.transport.rpc(op,args,options);if(r.saved!==true)throw Error('Speicherung nicht bestätigt.');return r;}
 tag(uid){if(!this.state?.tags.some(t=>t.uid===uid))throw Error('Tag unbekannt.');}
 path(path,empty=false){if(!(empty&&path==='')&&!this.state?.files.includes(path))throw Error('Datei unbekannt.');}
 assign(uid,path,options){this.tag(uid);this.path(path);return this.mutate('assign',{uid,path},options);}
 renameTag(uid,name,options){this.tag(uid);const normalized=renamed(this.state.tags,uid,name).find(t=>t.uid===uid).name;return this.mutate('renameTag',{uid,name:normalized},options);}
 assignIntro(uid,path,options){this.tag(uid);this.path(path,true);return this.mutate('assignIntro',{uid,path},options);}
 assignButton(id,path,options){if(!Number.isInteger(id)||id<1||id>10)throw Error('Button ungültig.');this.path(path,true);return this.mutate('assignButton',{id,path},options);}
 categorize(path,category,options){this.path(path);if(!categoryOK(category))throw Error('Kategorie ungültig.');return this.mutate('categorize',{path,category},options);}
 settings(values,options){if(!values||Object.keys(values).some(k=>!['volume','pixel','boardPixel'].includes(k))||('volume' in values&&(!Number.isInteger(values.volume)||values.volume<0||values.volume>21))||('pixel' in values&&!validateLedSettings(values.pixel,'stick'))||('boardPixel' in values&&!validateLedSettings(values.boardPixel,'board')))throw Error('Einstellungen ungültig.');return this.mutate('settings',values,options);}
 async player(op,args={},options){const r=await this.transport.rpc(op,args,options);if(r.accepted!==true)throw Error('Playerbefehl nicht bestätigt.');}
 play(path,options){this.path(path);return this.player('play',{path},options);}
 pause(options){return this.player('pause',{},options);}
 resume(options){return this.player('resume',{},options);}
 stop(options){return this.player('stop',{},options);}
 async upload(file,{signal,onProgress=()=>{},category='musik'}={}){
  if(!this.state)throw Error('Zuerst Dateiliste laden.');if(this.uploading)throw Error('busy: Upload aktiv.');validateUpload(file,this.state.files);if(!categoryOK(category))throw Error('Kategorie ungültig.');signal?.throwIfAborted();this.uploading=true;let started=false;
  try{const begin=await this.transport.rpc('uploadBegin',{name:file.name,size:file.size,category},{signal});started=true;if(begin.offset!==0)throw Error('Upload-Offset ungültig.');
   for(let offset=0;offset<file.size;){signal?.throwIfAborted();const bytes=new Uint8Array(await file.slice(offset,offset+384).arrayBuffer());const data=btoa(String.fromCharCode(...bytes));const r=await this.transport.rpc('uploadChunk',{offset,data},{signal});offset+=bytes.length;if(r.offset!==offset)throw Error('Upload-Offset nicht bestätigt.');onProgress(Math.floor(offset/file.size*99));}
   const r=await this.transport.rpc('uploadCommit',{},{signal});if(r.path!=='/'+file.name||r.size!==file.size)throw Error('Upload-Commit nicht bestätigt.');started=false;onProgress(100);return r;
  }catch(e){if(started)try{await this.transport.rpc('uploadAbort');}catch{/* Disconnected firmware clears its own temporary session. */}throw e;}finally{this.uploading=false;}
 }
 disconnect(){this.transport.disconnect();this.state=null;}
}
