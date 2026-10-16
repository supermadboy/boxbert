import React,{useEffect,useState} from 'react';
import './tft.css';

// Deliberately independent of the device adapter and saved demo configuration.
const examples={
 fox:{figure:'Fuchs',title:'Der kleine Fuchs auf einer großen Reise durch den Zauberwald',duration:204},
 moon:{figure:'Astronaut',title:'Mondreise',duration:168}
};
const time=value=>`${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`;
function Boxbert(){
 return <div className="boxbert-stage" role="img" aria-label="Boxbert, ein neugieriges dreidimensionales Box-Maskottchen"><div className="boxbert-bob"><div className="boxbert-cube">
  <div className="boxbert-face boxbert-front"><div className="boxbert-eyes"><span className="boxbert-eye"><i/></span><span className="boxbert-eye"><i/></span></div><div className="boxbert-smile"/></div>
  <div className="boxbert-face boxbert-back"/><div className="boxbert-face boxbert-left"/><div className="boxbert-face boxbert-right"><div className="boxbert-speaker"/></div><div className="boxbert-face boxbert-top"><span/></div><div className="boxbert-face boxbert-bottom"/>
 </div></div><div className="boxbert-shadow"/></div>;
}
export function TftPreview(){
 const [example,setExample]=useState('fox'),[position,setPosition]=useState(42),[playing,setPlaying]=useState(false);
 const song=examples[example];
 useEffect(()=>{
  if(!playing)return;
  const timer=setInterval(()=>setPosition(value=>Math.min(song.duration,value+1)),1000);
  return()=>clearInterval(timer);
 },[playing,song.duration]);
 useEffect(()=>{if(position>=song.duration)setPlaying(false);},[position,song.duration]);
 function choose(value){setExample(value);setPosition(0);setPlaying(false);}
 return <section className="card tft-preview"><h2>TFT-Vorschau</h2>
  <p className="tft-disclaimer">Beispieldaten · keine Geräteverbindung</p>
  <figure className="tft-figure"><div className="tft-bezel"><div className="tft-screen" aria-label="TFT-Anzeige mit Beispieldaten">
   <div className="tft-status" data-tft-region><span>Akku 78 %</span><span>Lautstärke 35 %</span></div>
   <div className="tft-wifi" data-tft-region><span className="tft-wifi-dot" aria-hidden="true"/><span>WLAN verbunden</span><span className="tft-demo">DEMO</span></div>
   <div className="tft-character" data-tft-region><Boxbert/></div>
   <div className="tft-identity" data-tft-region><strong>{song.figure}</strong><span>{playing?'Läuft':'Pause'}</span></div>
   <div className="tft-title" data-tft-region tabIndex={0} aria-label={'Songtitel: '+song.title}><span key={song.title} className={'tft-title-track'+(example==='fox'?' is-long':'')}>{song.title}</span></div>
   <div className="tft-timeline" data-tft-region><span>{time(position)} / {time(song.duration)}</span><div role="progressbar" aria-label="Beispielfortschritt" aria-valuemin={0} aria-valuemax={song.duration} aria-valuenow={position}><i style={{width:`${position/song.duration*100}%`}}/></div></div>
  </div></div><figcaption>240 × 135 logische Pixel · vergrößert dargestellt</figcaption></figure>
  <div className="tft-controls"><label>Beispieltitel<select value={example} onChange={e=>choose(e.target.value)}><option value="fox">Fuchs · langer Songtitel</option><option value="moon">Astronaut · Mondreise</option></select></label>
  <button onClick={()=>{if(position>=song.duration)setPosition(0);setPlaying(value=>!value);}}>{playing?'Beispiel pausieren':'Beispiel abspielen'}</button>
  <label>Beispielposition<input type="range" min="0" max={song.duration} value={position} onChange={e=>setPosition(Number(e.target.value))}/></label></div>
  <p className="small">Nur die Anzeige wird simuliert, es wird kein Ton abgespielt. Akku, Lautstärke und WLAN sind feste Beispielwerte. Titelwahl und Zeitleiste ändern keine gespeicherten Daten. Bei reduzierter Bewegung bleibt der Titel manuell horizontal scrollbar; auch per Tastatur fokussierbar.</p>
 </section>;
}
