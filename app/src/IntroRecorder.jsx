import React,{useEffect,useRef,useState} from 'react';
import {recordingStore} from './intro-recordings.mjs';
export function IntroRecorder({uid,demo,busy,lock}){
 const [saved,setSaved]=useState(null),[phase,setPhase]=useState('idle'),[error,setError]=useState('');
 const session=useRef(null),mounted=useRef(false);
 const supported=globalThis.isSecureContext&&!!navigator.mediaDevices?.getUserMedia&&typeof MediaRecorder!=='undefined'&&!!globalThis.indexedDB;
 function cancel(){const s=session.current;if(!s)return;session.current=null;s.controller.abort();s.stream?.getTracks().forEach(t=>t.stop());if(s.recorder?.state!=='inactive')try{s.recorder?.stop();}catch{}lock(false);if(mounted.current)setPhase('idle');}
 useEffect(()=>{mounted.current=true;if(demo)recordingStore('get',uid).then(r=>{if(mounted.current)setSaved(r??null);}).catch(e=>{if(mounted.current)setError('Aufnahmespeicher: '+e.message);});return()=>{mounted.current=false;cancel();};},[uid,demo]);
 async function start(){
  if(busy||session.current)return;const s={controller:new AbortController(),chunks:[]};session.current=s;lock(true);setError('');setPhase('permission');
  try{
   s.stream=await navigator.mediaDevices.getUserMedia({audio:true});
   if(session.current!==s||!mounted.current){s.stream.getTracks().forEach(t=>t.stop());return;}
   s.recorder=new MediaRecorder(s.stream);
   s.recorder.ondataavailable=e=>{if(e.data.size)s.chunks.push(e.data);};
   s.recorder.onerror=e=>{if(session.current===s){setError('Aufnahme fehlgeschlagen: '+(e.error?.message||'Browserfehler'));cancel();}};
   s.recorder.onstop=async()=>{
    s.stream.getTracks().forEach(t=>t.stop());if(session.current!==s)return;if(!s.save){setError('Aufnahme unerwartet beendet. Nicht gespeichert.');cancel();return;}
    try{const blob=new Blob(s.chunks,{type:s.recorder.mimeType});if(!blob.size)throw Error('Aufnahme ist leer. Erneut aufnehmen.');await recordingStore('put',uid,blob,{signal:s.controller.signal});if(session.current===s&&mounted.current)setSaved({uid,blob});}
    catch(e){if(session.current===s&&mounted.current)setError('Aufnahme nicht gespeichert: '+e.message);}
    finally{if(session.current===s){session.current=null;lock(false);if(mounted.current)setPhase('idle');}}
   };
   s.recorder.start();setPhase('recording');
  }catch(e){if(session.current===s){setError('Mikrofon/Aufnahme nicht verfügbar: '+e.message);cancel();}}
 }
 function stop(){const s=session.current;if(!s||phase!=='recording')return;s.save=true;setPhase('saving');s.recorder.stop();s.stream.getTracks().forEach(t=>t.stop());}
 async function remove(){if(busy||!saved||!confirm('Aufnahme für '+uid+' löschen? Tag und Song bleiben unverändert.'))return;lock(true);setError('');try{await recordingStore('delete',uid);if(mounted.current)setSaved(null);}catch(e){if(mounted.current)setError('Aufnahme nicht gelöscht: '+e.message);}finally{lock(false);}}
 return <div className="intro-recording"><h3>Intro aufnehmen</h3><p aria-label={'Aufnahmestatus für '+uid}>{saved?`Gespeichert · ${saved.blob.type} · ${saved.blob.size} Bytes`:'Keine Aufnahme'}{phase!=='idle'&&' · '+({permission:'Mikrofonfreigabe ausstehend',recording:'Aufnahme läuft',saving:'Speichern …'}[phase])}</p>
 {phase==='recording'?<button aria-label={'Stoppen und speichern für '+uid} onClick={stop}>Stoppen und speichern</button>:<button aria-label={'Intro aufnehmen für '+uid} disabled={!demo||!supported||busy||phase!=='idle'} onClick={start}>Aufnehmen</button>}
 {phase!=='idle'&&<button aria-label={'Aufnahme abbrechen für '+uid} disabled={phase==='saving'} onClick={cancel}>Aufnahme abbrechen</button>}
 <button aria-label={'Aufnahme löschen für '+uid} disabled={!demo||busy||!saved} onClick={remove}>Aufnahme löschen</button>
 <p className="small">{!demo?'Aufnahme-/Intro-API fehlt in der aktuellen Firmware.':!supported?'Browseraufnahme nicht unterstützt: HTTPS/localhost, Mikrofon, MediaRecorder und IndexedDB erforderlich.':'Echte Mikrofonaufnahme, nur in diesem Browser pro UID gespeichert (IndexedDB). Browserformat, nicht MP3; keine Wiedergabe oder ESP-Übertragung. Neuaufnahme ersetzt erst nach erfolgreichem Speichern. Reiterwechsel bricht ab.'}</p>{error&&<p role="alert">{error}</p>}</div>;
}
