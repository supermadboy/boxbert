const KEY='boxbert-demo-v1';
export const knownUIDs=['E3:2F:F6:33','01:8C:F1:6E'];
export const validName=name=>typeof name==='string'&&name.length>=5&&name.length<=64&&!name.startsWith('.')&&/^[A-Za-z0-9_.-]+\.mp3$/.test(name);
export function validateUpload(file,files){
 if(!file||!validName(file.name))throw Error('Dateiname: 5–64 ASCII-Zeichen (A–Z, a–z, 0–9, -, _, .), kein Pfad/Punkt am Anfang, Endung .mp3.');
 if(!Number.isInteger(file.size)||file.size<=0||file.size>16*1024*1024)throw Error('MP3 muss nicht leer und höchstens 16 MiB groß sein.');
 if(files.includes('/'+file.name))throw Error('Dateiname existiert bereits. Überschreiben ist nicht erlaubt.');
}
const seed=()=>({files:['/arcade-music-loop.mp3','/happy-tune.mp3'],tags:[{uid:knownUIDs[0],path:'/arcade-music-loop.mp3'},{uid:knownUIDs[1],path:'/happy-tune.mp3'}],volume:6,pixel:{color:'#dd5b00',brightness:20,effect:'statisch'}});
function validState(s){return s&&Array.isArray(s.files)&&s.files.every(p=>typeof p==='string'&&p.startsWith('/')&&validName(p.slice(1)))&&Array.isArray(s.tags)&&s.tags.length===2&&s.tags.every((t,i)=>t.uid===knownUIDs[i]&&s.files.includes(t.path))&&Number.isInteger(s.volume)&&s.volume>=0&&s.volume<=21&&validPixel(s.pixel);}
const validPixel=p=>p&&/^#[a-f0-9]{6}$/i.test(p.color)&&Number.isInteger(p.brightness)&&p.brightness>=0&&p.brightness<=100&&['aus','statisch','atmen'].includes(p.effect);
export class HttpAdapter {
 constructor({origin,password,fetch=globalThis.fetch}){if(new URL(origin).protocol!=='http:')throw Error('Geräteverwaltung nur von der lokalen HTTP-Seite (Same Origin). Extern: Demo; BLE noch nicht implementiert.');this.fetch=fetch.bind(globalThis);this.auth='Basic '+btoa(String.fromCharCode(...new TextEncoder().encode('boxbert:'+password)));this.state=null;}
 async request(path,{signal,body,method}={}){
 const r=await this.fetch(path,{signal,body,method,cache:'no-store',credentials:'omit',headers:{Authorization:this.auth}});
 if(!r.ok){const hints={401:'Passwort prüfen.',403:'Origin/Zugriffsfreigabe prüfen.',409:'Musik läuft, Datei existiert oder temporärer Upload blockiert. Musik stoppen und SD prüfen.',413:'Datei größer als 16 MiB.',500:'SD-/Speicherfehler.'};throw Error(`HTTP ${r.status}: ${hints[r.status]||'Anfrage fehlgeschlagen.'}`);}
 let data;try{data=await r.json();}catch{throw Error('Ungültige Firmware-Antwort (JSON erwartet).');}return data;
 }
 async read({signal}={}){
 const [files,tags]=await Promise.all([this.request('/files',{signal}),this.request('/tags',{signal})]);
 if(!Array.isArray(files)||files.some(p=>typeof p!=='string'||!p.startsWith('/')||!validName(p.slice(1)))||!Array.isArray(tags)||tags.length!==2||tags.some(t=>!knownUIDs.includes(t.uid)||typeof t.path!=='string')||new Set(tags.map(t=>t.uid)).size!==2)throw Error('Firmware-Antwort passt nicht zum Etappe-5-Vertrag.');
 this.state={files,tags,volume:null,pixel:null};return structuredClone(this.state);
 }
 async assign(uid,path,{signal}={}){
 if(!this.state?.tags.some(t=>t.uid===uid)||!this.state.files.includes(path))throw Error('Nur die zwei bekannten Tags und vorhandene MP3 sind erlaubt.');
 const r=await this.request('/tags',{method:'POST',body:new URLSearchParams({uid,path}),signal});if(r?.ok!==true)throw Error('Ungültige Firmware-Antwort: Speicherung nicht bestätigt.');
 }
 async upload(file,{signal,onProgress=()=>{}}={}){
 if(!this.state)throw Error('Zuerst Dateiliste laden.');validateUpload(file,this.state.files);const body=new FormData();body.append('file',file);
 const r=await this.request('/upload',{method:'POST',body,signal});if(r?.ok!==true)throw Error('Ungültige Firmware-Antwort: Upload nicht bestätigt.');onProgress(100);
 }
 async settings(){throw Error('Lautstärke und NeoPixel sind in Etappe 5 nicht verfügbar.');}
}
export class DemoAdapter {
 constructor(storage){this.storage=storage;this.failure='none';this.state=seed();try{const raw=storage.getItem(KEY);if(raw){const saved=JSON.parse(raw);if(!validState(saved))throw Error();this.state=saved;}}catch{this.warning='Demo-Speicher nicht zugänglich oder beschädigt. Ausgangsdaten geladen; bitte Demo zurücksetzen.';}}
 async read(){if(this.failure==='disconnect')throw Error('Simulierter Verbindungsabbruch.');return structuredClone(this.state);}
 persist(next){try{this.storage.setItem(KEY,JSON.stringify(next));}catch{throw Error('Browser-Speicher nicht verfügbar oder voll. Änderung nicht gespeichert.');}this.state=next;}
 async assign(uid,path){const next=structuredClone(this.state);const tag=next.tags.find(t=>t.uid===uid);if(!tag||!next.files.includes(path))throw Error('Tag oder Datei unbekannt.');if(this.failure!=='none')throw Error('Simulierter SD-/Verbindungsfehler.');tag.path=path;this.persist(next);}
 reset(){this.persist(seed());this.failure='none';this.warning='';}
 async upload(file,{signal,onProgress=()=>{}}={}){
 validateUpload(file,this.state.files);
 for(let i=1;i<=10;i++){signal?.throwIfAborted();await new Promise(r=>setTimeout(r,80));signal?.throwIfAborted();onProgress(i*10);}
 if(this.failure==='sd')throw Error('Simulierter SD-Fehler.');
 if(this.failure==='busy')throw Error('409: Simulierte Musik läuft. Upload nur bei gestoppter Wiedergabe.');
 if(this.failure==='disconnect')throw Error('Simulierter Verbindungsabbruch.');
 this.persist({...this.state,files:[...this.state.files,'/'+file.name]});
 }
 async settings({volume=this.state.volume,pixel=this.state.pixel}){if(!Number.isInteger(volume)||volume<0||volume>21)throw Error('Lautstärke muss zwischen 0 und 21 liegen (nur Simulation, keine Sicherheitsfreigabe).');if(!validPixel(pixel))throw Error('NeoPixel-Werte ungültig.');if(this.failure!=='none')throw Error('Simulierter Verbindungsfehler.');this.persist({...this.state,volume,pixel});}
}
