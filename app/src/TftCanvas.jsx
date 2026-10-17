import React,{useEffect,useRef,useState} from 'react';
import {loadTftRenderer,rgb565ToRgba,writeUtf8} from './tft-client.mjs';

export function TftCanvas({snapshot,label,scrollOffset}){
 const canvas=useRef(null),epoch=useRef({title:snapshot.title,time:performance.now()});
 const [renderer,setRenderer]=useState(null),[error,setError]=useState('');
 const [motion,setMotion]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.hidden);
 useEffect(()=>{
  let cancelled=false;
  loadTftRenderer(`${import.meta.env.BASE_URL}tft-renderer.wasm`).then(value=>{if(!cancelled)setRenderer(value);}).catch(reason=>{if(!cancelled)setError(`TFT-Vorschau nicht verfügbar: ${reason.message}`);});
  return()=>{cancelled=true;};
 },[]);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)'),update=()=>setMotion(!media.matches&&!document.hidden);
  media.addEventListener('change',update);document.addEventListener('visibilitychange',update);update();
  return()=>{media.removeEventListener('change',update);document.removeEventListener('visibilitychange',update);};
 },[]);
 useEffect(()=>{
  if(!renderer)return;
  let frame=0,last=-Infinity;
  if(epoch.current.title!==snapshot.title)epoch.current={title:snapshot.title,time:performance.now()};
  const context=canvas.current.getContext('2d');
  function draw(now){
   const timeMs=motion?Math.floor(now-epoch.current.time):0;
   writeUtf8(new Uint8Array(renderer.memory.buffer,renderer.tft_figure_input(),512),snapshot.figure);
   writeUtf8(new Uint8Array(renderer.memory.buffer,renderer.tft_title_input(),2048),snapshot.title);
   const ptr=renderer.tft_render(snapshot.playback,snapshot.elapsed,snapshot.duration,snapshot.volume,snapshot.battery,snapshot.charging,snapshot.wifi,timeMs,scrollOffset);
   const rgba=rgb565ToRgba(new Uint8Array(renderer.memory.buffer,ptr,240*135*2));
   context.putImageData(new ImageData(rgba,240,135),0,0);
   canvas.current.dataset.renderer='ready';canvas.current.dataset.renderTime=String(timeMs);
  }
  function tick(now){if(now-last>=80){draw(now);last=now;}frame=requestAnimationFrame(tick);}
  draw(performance.now());
  if(motion&&scrollOffset<0)frame=requestAnimationFrame(tick);
  return()=>cancelAnimationFrame(frame);
 },[renderer,snapshot,motion,scrollOffset]);
 return <><canvas ref={canvas} width={240} height={135} role="img" aria-label={label} data-renderer="loading"/>{!renderer&&!error&&<span className="tft-loading" role="status">Pixelrenderer wird geladen…</span>}{error&&<span className="tft-load-error" role="alert">{error}</span>}</>;
}
