import React,{useState,useEffect} from 'react';
import {sampleLedFrame,validateLedSettings} from './led-effects.mjs';

export function VolumeBar({data,demo,busy,save}) {
 const [volume,setVolume]=useState(data?.volume??6);
 useEffect(()=>setVolume(data?.volume??6),[data?.volume]);
 return <section className="volume-bar" aria-label="Lautstärke · nur Simulation">
  <form onSubmit={e=>{e.preventDefault();save({volume});}}>
   <fieldset disabled={!demo||busy||!data}>
    <label className="volume-label">Lautstärke <output>{volume} / 21</output>
     <input aria-label="Lautstärke" type="range" min="0" max="21" value={volume} onChange={e=>setVolume(Number(e.target.value))}/>
    </label>
    <button>Lautstärke speichern</button>
   </fieldset>
   <p className="small">{demo?'Nur Demo · 0–21 ist keine geprüfte Kindersicherheitsgrenze.':'Lautstärke-API fehlt · keine Gerätesteuerung.'}</p>
  </form>
 </section>;
}
const effectNames={aus:'Aus',statisch:'Statisch',atmen:'Atmen','links-rechts':'Lauflicht · links → rechts','rechts-links':'Lauflicht · rechts → links','mitte-aussen':'Mitte → außen',party:'Party · sanftes Funkeln',farbwechsel:'Langsamer Farbwechsel',kerze:'Kerze · sanftes Licht'};
function usePreviewTime(settings) {
 const [time,setTime]=useState(0);
 useEffect(()=>{
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let id=null,start=performance.now();
  const stop=()=>{if(id!==null)cancelAnimationFrame(id);id=null;};
  const tick=now=>{setTime(Math.max(0,now-start));id=requestAnimationFrame(tick);};
  const sync=()=>{stop();start=performance.now();setTime(0);if(!motion.matches&&!document.hidden&&!['aus','statisch'].includes(settings.effect))id=requestAnimationFrame(tick);};
  motion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync();
  return ()=>{stop();motion.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
 },[settings]);
 return time;
}
export function PixelSettings({data,demo,busy,save,board=false}) {
 const key=board?'boardPixel':'pixel',prefix=board?'Onboard ':'';
 const fallback={color:'#dd5b00',brightness:20,palette:'solid',effect:board?'aus':'statisch'};
 const [pixel,setPixel]=useState(data?.[key]??fallback);
 useEffect(()=>setPixel(data?.[key]??fallback),[data?.[key]?.color,data?.[key]?.brightness,data?.[key]?.palette,data?.[key]?.effect]);
 const time=usePreviewTime(pixel),count=board?1:8;
 const valid=validateLedSettings(pixel,board?'board':'stick');
 const frame=valid?sampleLedFrame(pixel,count,time):Array.from({length:count},()=>({color:'#000000',opacity:0}));
 const effects=board?['aus','statisch','atmen','party','farbwechsel','kerze']:['aus','statisch','atmen','links-rechts','rechts-links','mitte-aussen','party'];
 return <section className="card">
  <div className="section-head"><h2>{board?'ESP Onboard · 1 NeoPixel':'NeoPixel-Stick · 8 Pixel'}</h2><span className="badge">{demo?'Nur Simulation':'API fehlt'}</span></div>
  <p>{demo?'Vorschau des Entwurfs · erst Speichern übernimmt diesen Kanal in der Demo. Keine Änderung an einer echten Box.':'Etappe 5 hat keine NeoPixel-API. Einstellungen sind nicht verfügbar.'}</p>
  <form onSubmit={e=>{e.preventDefault();save({[key]:pixel});}}>
   <fieldset disabled={!demo||busy||!data}>
    <div className="pixel-controls">
     <label>{prefix}Palette<select aria-label={prefix+'Palette'} value={pixel.palette} onChange={e=>setPixel({...pixel,palette:e.target.value})}><option value="solid">Einfarbig</option><option value="rainbow">Regenbogen</option></select></label>
     <label>{prefix}Farbe<input aria-label={prefix+'Farbe'} type="color" disabled={pixel.palette==='rainbow'} value={pixel.color} onChange={e=>setPixel({...pixel,color:e.target.value})}/></label>
     <label>{prefix}Helligkeit (%)<input aria-label={prefix+'Helligkeit (%)'} type="number" min="0" max="100" value={pixel.brightness} onChange={e=>setPixel({...pixel,brightness:Number(e.target.value)})}/></label>
     <label>{prefix}Effekt<select aria-label={prefix+'Effekt'} value={pixel.effect} onChange={e=>setPixel({...pixel,effect:e.target.value})}>{effects.map(effect=><option key={effect} value={effect}>{effectNames[effect]}</option>)}</select></label>
    </div>
    <div className={board?'board-preview':'pixel-preview'} aria-label={(board?'Onboard-':'NeoPixel-')+'Vorschau (Simulation)'}>
     {frame.map((p,i)=><span key={i} style={{background:p.color,opacity:p.opacity}}/>)}
    </div>
    {!valid&&<p role="alert">NeoPixel-Werte ungültig. Bitte Helligkeit zwischen 0 und 100 wählen.</p>}
    <button>{board?'Onboard-Einstellungen speichern':'Einstellungen speichern'}</button>
   </fieldset>
  </form>
  <p className="small">Farbe/Regenbogen und Effekt sind unabhängig. Party funkelt langsam und weich, kein Stroboskop. Bei reduzierter Bewegung bleibt eine feste Momentaufnahme; im Hintergrund pausiert die Vorschau. Nur Browser-Simulation, keine Hardware-/Kindersicherheitsfreigabe.{board?' Ein Pixel zeigt nur eine Regenbogenfarbe gleichzeitig; Farbwechsel durchläuft sie langsam. Bei einfarbigem Grau bleibt Farbwechsel grau. Kerze verändert die Helligkeit der gewählten Farbe.':''}</p>
 </section>;
}
