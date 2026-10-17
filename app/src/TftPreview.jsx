import React,{useEffect,useState} from 'react';
import {TftCanvas} from './TftCanvas.jsx';
import './tft.css';

// These snapshots never read or write the device adapter or persisted demo data.
const examples={
 fox:{figure:'Fuchs',title:'Der kleine Fuchs auf einer großen Reise durch den Zauberwald',duration:204,playback:3,volume:7,battery:78,charging:0,wifi:2},
 moon:{figure:'Astronaut',title:'Mondreise',duration:168,playback:3,volume:7,battery:78,charging:0,wifi:2},
 boot:{figure:'',title:'',duration:-1,playback:0,volume:-1,battery:-1,charging:0,wifi:1},
 idle:{figure:'',title:'',duration:-1,playback:1,volume:0,battery:100,charging:1,wifi:0},
 error:{figure:'Fuchs',title:'Datei nicht lesbar',duration:-1,playback:5,volume:7,battery:18,charging:0,wifi:0},
 unknown:{figure:'Fuchs',title:'Dauer unbekannt',duration:-1,playback:3,volume:-1,battery:-1,charging:0,wifi:3},
 umlauts:{figure:'ÄÖÜ äöü ß',title:'Grüße, Füße, Spaß … 🦊',duration:204,playback:3,volume:0,battery:55,charging:1,wifi:1}
};
const names={fox:'Fuchs · langer Songtitel',moon:'Astronaut · Mondreise',boot:'Start ohne Messwerte',idle:'Keine Figur · WLAN aus',error:'Dateifehler',unknown:'Unbekannte Dauer und Statuswerte',umlauts:'Umlaute und Ersatzzeichen'};
const states=['Startet','Keine Figur','Läuft','Pause','Ende','Dateifehler'];
const time=value=>`${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`;
export function TftPreview(){
 const [example,setExample]=useState('fox'),[position,setPosition]=useState(42),[playing,setPlaying]=useState(false),[scrollOffset,setScrollOffset]=useState(-1);
 const song=examples[example],canPlay=song.playback===3;
 useEffect(()=>{
  if(!playing)return;
  const timer=setInterval(()=>setPosition(value=>song.duration>0?Math.min(song.duration,value+1):value+1),1000);
  return()=>clearInterval(timer);
 },[playing,song.duration]);
 useEffect(()=>{if(song.duration>0&&position>=song.duration)setPlaying(false);},[position,song.duration]);
 const snapshot={...song,elapsed:position,playback:canPlay?(song.duration>0&&position>=song.duration?4:playing?2:3):song.playback};
 const label=`${song.figure||'Boxbert'} · ${song.title||states[snapshot.playback]} · ${states[snapshot.playback]} · ${time(position)} / ${song.duration>0?time(song.duration):'Dauer unbekannt'} · ${song.battery<0?'Akku unbekannt':`Akku ${song.battery} Prozent`}${song.charging?' · lädt':''} · ${song.volume<0?'Lautstärke unbekannt':`Lautstärke ${song.volume} von 21`} · WLAN ${['aus','verbindet','verbunden','unbekannt'][song.wifi]}`;
 function choose(value){setExample(value);setPosition(0);setPlaying(false);setScrollOffset(-1);}
 return <section className="card tft-preview"><h2>TFT-Vorschau</h2>
  <p className="tft-disclaimer">Beispieldaten · keine Geräteverbindung</p>
  <figure className="tft-figure"><div className="tft-bezel"><div className="tft-screen">
   <TftCanvas snapshot={snapshot} label={label} scrollOffset={scrollOffset}/>
  </div></div><figcaption>V1 ohne Sprite · 240 × 135 logische Pixel · DejaVu Sans</figcaption></figure>
  <div className="tft-controls"><label>Beispieltitel<select value={example} onChange={e=>choose(e.target.value)}>{Object.entries(names).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
  <button disabled={!canPlay} onClick={()=>{if(song.duration>0&&position>=song.duration)setPosition(0);setPlaying(value=>!value);}}>{playing?'Beispiel pausieren':'Beispiel abspielen'}</button>
  <label>Beispielposition<input type="range" min="0" max={song.duration>0?song.duration:300} value={position} disabled={!canPlay} onChange={e=>setPosition(Number(e.target.value))}/></label></div>
  <div className="tft-scroll-controls" role="group" aria-label="Songtitel manuell verschieben"><button onClick={()=>setScrollOffset(value=>Math.min(2048,Math.max(0,value)+24))}>Titel nach links</button><button onClick={()=>setScrollOffset(value=>Math.max(0,value-24))}>Titel nach rechts</button><button onClick={()=>setScrollOffset(-1)}>Titel zurücksetzen</button></div>
  <details className="tft-text"><summary>Vollständigen Anzeigetext lesen</summary><p>{label}</p></details>
  <div className="tft-sr-only" role="progressbar" aria-label="Beispielfortschritt" aria-valuemin={0} aria-valuemax={song.duration>0?song.duration:undefined} aria-valuenow={song.duration>0?position:undefined} aria-valuetext={song.duration>0?`${time(position)} / ${time(song.duration)}`:'Gesamtdauer unbekannt'}/>
  <p className="small">Nur die Anzeige wird simuliert, es wird kein Ton abgespielt. Alle Werte sind Beispiele. Titelwahl und Zeitleiste ändern keine gespeicherten Daten. Bei reduzierter Bewegung steht die Laufschrift still; mit den Titel-Knöpfen bleibt sie manuell verschiebbar. Nicht unterstützte Zeichen erscheinen im Pixelbild als „?“.</p>
 </section>;
}
