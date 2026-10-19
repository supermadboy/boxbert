import React,{useEffect,useRef,useState} from 'react';
import {recordingStore,recordingDuration} from './intro-recordings.mjs';

function durationLabel(ms){
 const seconds=Math.floor(ms/1000);
 return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
}
function RecordingIcon({kind}){
 return <svg className="recording-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
  {kind==='mic'&&<><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></>}
  {kind==='stop'&&<rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" stroke="none"/>}
  {kind==='cancel'&&<path d="m6 6 12 12M18 6 6 18"/>}
  {kind==='delete'&&<><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/></>}
 </svg>;
}
export function IntroRecorder({uid,demo,enabled=demo,busy,lock,sendIntro}){
 const [saved,setSaved]=useState(null),[phase,setPhase]=useState('idle'),[error,setError]=useState(''),[elapsed,setElapsed]=useState(0);
 const storageUid=demo?uid:'device:'+uid;
 const session=useRef(null),mounted=useRef(false);
 const supported=globalThis.isSecureContext&&!!navigator.mediaDevices?.getUserMedia&&typeof MediaRecorder!=='undefined'&&!!globalThis.indexedDB;
 function cancel(){
  const s=session.current;if(!s)return;
  session.current=null;clearInterval(s.timer);s.controller.abort();s.stream?.getTracks().forEach(t=>t.stop());
  if(s.recorder?.state!=='inactive')try{s.recorder?.stop();}catch{}
  lock(false);if(mounted.current)setPhase('idle');
 }
 useEffect(()=>{
  let active=true;mounted.current=true;setSaved(null);
  recordingStore('get',storageUid).then(async r=>{
   if(!active)return;setSaved(r??null);
   if(r){const durationMs=await recordingDuration(r);if(active)setSaved(current=>current===r?{...r,durationMs}:current);}
  }).catch(e=>{if(active)setError('Aufnahmespeicher: '+e.message);});
  return()=>{active=false;mounted.current=false;cancel();};
 },[uid,demo]);
 async function start(){
  if(busy||session.current)return;
  const s={controller:new AbortController(),chunks:[]};session.current=s;lock(true);setError('');setElapsed(0);setPhase('permission');
  try{
   s.stream=await navigator.mediaDevices.getUserMedia({audio:true});
   if(session.current!==s||!mounted.current){s.stream.getTracks().forEach(t=>t.stop());return;}
   s.recorder=new MediaRecorder(s.stream);
   s.recorder.ondataavailable=e=>{if(e.data.size)s.chunks.push(e.data);};
   s.recorder.onerror=e=>{if(session.current===s){setError('Aufnahme fehlgeschlagen: '+(e.error?.message||'Browserfehler'));cancel();}};
   s.recorder.onstop=async()=>{
    s.stream.getTracks().forEach(t=>t.stop());if(session.current!==s)return;
    if(!s.save){setError('Aufnahme unerwartet beendet. Nicht gespeichert.');cancel();return;}
    try{
     const blob=new Blob(s.chunks,{type:s.recorder.mimeType});if(!blob.size)throw Error('Aufnahme ist leer. Erneut aufnehmen.');
     await recordingStore('put',storageUid,blob,{signal:s.controller.signal,durationMs:s.durationMs});
     if(session.current===s&&mounted.current)setSaved({uid,blob,durationMs:s.durationMs});
    }catch(e){if(session.current===s&&mounted.current)setError('Aufnahme nicht gespeichert: '+e.message);}
    finally{if(session.current===s){clearInterval(s.timer);session.current=null;lock(false);if(mounted.current)setPhase('idle');}}
   };
   s.recorder.start();s.startedAt=performance.now();
   s.timer=setInterval(()=>{if(session.current===s&&mounted.current)setElapsed(performance.now()-s.startedAt);},100);setPhase('recording');
  }catch(e){if(session.current===s){setError('Mikrofon/Aufnahme nicht verfügbar: '+e.message);cancel();}}
 }
 function stop(){
  const s=session.current;if(!s||phase!=='recording')return;
  s.save=true;s.durationMs=performance.now()-s.startedAt;clearInterval(s.timer);setElapsed(s.durationMs);setPhase('saving');s.recorder.stop();s.stream.getTracks().forEach(t=>t.stop());
 }
 async function remove(){
  if(busy||!saved||!confirm('Aufnahme für '+uid+' löschen? Tag und Song bleiben unverändert.'))return;
  lock(true);setError('');
  try{await recordingStore('delete',storageUid);if(mounted.current)setSaved(null);}
  catch(e){if(mounted.current)setError('Aufnahme nicht gelöscht: '+e.message);}
  finally{lock(false);}
 }
 return <div className="intro-recording">
  <h3>Intro aufnehmen</h3>
  <div className="recording-message">
   <div className="recording-summary">
    <span className={'recording-symbol'+(phase==='recording'?' is-recording':'')} aria-hidden="true"><RecordingIcon kind="mic"/></span>
    <div className="recording-info">
     <p aria-label={'Aufnahmestatus für '+uid}>{saved?`Gespeichert · ${Number.isFinite(saved.durationMs)&&saved.durationMs>=0?durationLabel(saved.durationMs):'Dauer unbekannt'}`:'Keine Aufnahme'}{phase!=='idle'&&' · '+({permission:'Mikrofonfreigabe ausstehend',recording:'Aufnahme läuft',saving:'Speichern …'}[phase])}</p>
     {(phase==='recording'||phase==='saving')&&<div className="recording-clock">{phase==='recording'&&<span className="recording-indicator" aria-hidden="true"/>}<output aria-label={'Aufnahmedauer für '+uid} aria-live="off">{durationLabel(elapsed)}</output></div>}
    </div>
   </div>
   <div className="recording-actions">
    {phase==='recording'?<button className="recording-main" aria-label={'Stoppen und speichern für '+uid} onClick={stop}><RecordingIcon kind="stop"/><span>Stoppen & speichern</span></button>:<button className="recording-main" aria-label={'Intro aufnehmen für '+uid} disabled={!enabled||!supported||busy||phase!=='idle'} onClick={start}><RecordingIcon kind="mic"/><span>{saved?'Neu aufnehmen':'Aufnehmen'}</span></button>}
    {phase!=='idle'&&<button aria-label={'Aufnahme abbrechen für '+uid} disabled={phase==='saving'} onClick={cancel}><RecordingIcon kind="cancel"/><span>Abbrechen</span></button>}
    <button className="recording-delete" aria-label={'Aufnahme löschen für '+uid} disabled={!enabled||busy||!saved} onClick={remove}><RecordingIcon kind="delete"/><span>Löschen</span></button>
   </div>
  </div>
  <p className="small">{!supported?'Browseraufnahme nicht unterstützt: HTTPS/localhost, Mikrofon, MediaRecorder und IndexedDB erforderlich.':'Echte Mikrofonaufnahme, nur in diesem Browser pro UID gespeichert (IndexedDB). Browserformat lokal erhalten; explizites Übertragen konvertiert lokal zu MP3 und schreibt auf SD. Neuaufnahme ersetzt erst nach erfolgreichem Speichern. Reiterwechsel bricht ab.'}</p>
  {!demo&&<button aria-label={'Intro auf Gerät übertragen für '+uid} disabled={!enabled||busy||!saved||phase!=='idle'} onClick={()=>sendIntro(uid,saved.blob)}>Intro als MP3 auf Gerät übertragen</button>}
  {error&&<p role="alert">{error}</p>}
 </div>;
}
