import {go} from './navigation.mjs';
import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
const server=process.env.BOXBERT_URL?null:await createServer({server:{host:'127.0.0.1',port:0},base:'/boxbert/'});
await server?.listen();let browser;
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
 const context=await browser.newContext({ignoreHTTPSErrors:true}),page=await context.newPage();
 const url=process.env.BOXBERT_URL||server.resolvedUrls.local[0],uid='E3:2F:F6:33',other='01:8C:F1:6E';
 const button=(name,tag=uid)=>page.getByRole('button',{name:name+' für '+tag,exact:true});
 const status=(tag=uid)=>page.getByLabel('Aufnahmestatus für '+tag);
 const records=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('boxbert-intros-v1',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('recordings'),q=tx.objectStore('recordings').getAll();tx.oncomplete=()=>{resolve(q.result.map(x=>({uid:x.uid,durationMs:x.durationMs,size:x.blob.size,type:x.blob.type})));db.close();};};}));
 await page.goto(url);await go(page,'Zuordnung');
 await button('Intro aufnehmen').click();await expect(button('Stoppen und speichern')).toBeVisible();
 await expect(page.getByLabel('Aufnahmedauer für '+uid)).toHaveText('00:01',{timeout:4000});
 await button('Stoppen und speichern').click();await expect(button('Intro aufnehmen')).toBeEnabled();
 const saved=await records();expect(saved[0].durationMs).toBeGreaterThanOrEqual(1000);expect(saved[0].durationMs).toBeLessThan(4000);expect(saved[0].size).toBeGreaterThan(0);
 const savedLabel='Gespeichert · 00:'+String(Math.floor(saved[0].durationMs/1000)).padStart(2,'0');await expect(status()).toContainText(savedLabel);
 await page.reload();await go(page,'Zuordnung');await expect(status()).toContainText(savedLabel);expect(await records()).toEqual(saved);
 console.log('PASS live monotonic duration, committed durationMs + Blob, reload:',JSON.stringify(saved));
 // Seed authentic v1 Blob-only rows: a valid 2-second PCM WAV and an undecodable old Blob.
 await page.evaluate(async({uid,other})=>{
  const rate=8000,samples=rate*2,bytes=new ArrayBuffer(44+samples*2),v=new DataView(bytes);
  const text=(at,s)=>[...s].forEach((c,i)=>v.setUint8(at+i,c.charCodeAt(0)));
  text(0,'RIFF');v.setUint32(4,36+samples*2,true);text(8,'WAVE');text(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);text(36,'data');v.setUint32(40,samples*2,true);
  await new Promise((resolve,reject)=>{const r=indexedDB.open('boxbert-intros-v1',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('recordings','readwrite'),s=tx.objectStore('recordings');s.put({uid,blob:new Blob([bytes],{type:'audio/wav'}),createdAt:123});s.put({uid:other,blob:new Blob(['undecodable legacy data'],{type:'audio/webm'}),createdAt:456});tx.oncomplete=()=>{db.close();resolve();};tx.onabort=()=>reject(tx.error);};});
 },{uid,other});
 const legacy=await records();await page.reload();await go(page,'Zuordnung');
 await expect(status()).toContainText('Gespeichert · 00:02');await expect(status(other)).toContainText('Gespeichert · Dauer unbekannt');
 expect(await records()).toEqual(legacy);await page.reload();await go(page,'Zuordnung');await expect(status()).toContainText('Gespeichert · 00:02');
 console.log('PASS non-destructive v1 legacy decode + explicit unknown duration, reload');
 await expect(button('Intro aufnehmen').locator('svg[aria-hidden="true"]')).toHaveCount(1);
 await expect(button('Aufnahme löschen').locator('svg[aria-hidden="true"]')).toHaveCount(1);
 await expect(status()).not.toContainText('Bytes');await expect(status()).not.toContainText('audio/');
 // Observe actual native intervals and streams; do not replace MediaRecorder or IDB.
 await page.evaluate(()=>{window.activeRecordingTimers=new Set();window.recordingStreams=[];const start=window.setInterval.bind(window),stop=window.clearInterval.bind(window),gum=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);window.setInterval=(fn,ms,...args)=>{const id=start(fn,ms,...args);if(ms===100)window.activeRecordingTimers.add(id);return id;};window.clearInterval=id=>{window.activeRecordingTimers.delete(id);stop(id);};navigator.mediaDevices.getUserMedia=async c=>{const stream=await gum(c);window.recordingStreams.push(stream);return stream;};});
 await button('Intro aufnehmen').click();await expect(button('Stoppen und speichern')).toBeVisible();
 await expect(button('Stoppen und speichern').locator('svg[aria-hidden="true"]')).toHaveCount(1);await expect(button('Aufnahme abbrechen').locator('svg[aria-hidden="true"]')).toHaveCount(1);
 await expect(page.locator('.intro-recording').first().locator('.recording-indicator')).toBeVisible();
 for(const colorScheme of ['light','dark']){await page.emulateMedia({colorScheme});for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('.intro-recording').first().evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);}}
 if(process.env.RECORDING_SCREENSHOTS){await page.setViewportSize({width:390,height:900});for(const colorScheme of ['light','dark']){await page.emulateMedia({colorScheme});await page.locator('.intro-recording').first().screenshot({path:process.env.RECORDING_SCREENSHOTS+'-'+colorScheme+'.png'});}}
 await button('Aufnahme abbrechen').click();await expect(button('Intro aufnehmen')).toBeEnabled();expect(await records()).toEqual(legacy);
 expect(await page.evaluate(()=>window.activeRecordingTimers.size)).toBe(0);expect(await page.evaluate(()=>window.recordingStreams.every(s=>s.getTracks().every(t=>t.readyState==='ended')))).toBe(true);
 await button('Intro aufnehmen').click();await expect(button('Stoppen und speichern')).toBeVisible();await go(page,'LEDs');await go(page,'Zuordnung');expect(await page.evaluate(()=>window.activeRecordingTimers.size)).toBe(0);expect(await records()).toEqual(legacy);
 for(const colorScheme of ['light','dark']){await page.emulateMedia({colorScheme});for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}}
 page.once('dialog',d=>d.accept());await button('Aufnahme löschen',other).click();await expect(status(other)).toContainText('Keine Aufnahme');expect(await records()).toEqual([legacy.find(r=>r.uid===uid)]);await expect(status()).toContainText('Gespeichert · 00:02');
 console.log('PASS SVG mic/stop/cancel/delete, indicator, no technical primary status, light/dark 320/390/1280, cancel/unmount timers + streams cleanup, delete second UID isolation');
 if(process.env.BOXBERT_URL){
  await expect(page.getByText('Offline-Cache bereit',{exact:false})).toBeVisible();
  await page.reload();await go(page,'Zuordnung');await expect(status()).toContainText('Gespeichert · 00:02');
  await button('Intro aufnehmen').click();await expect(page.getByLabel('Aufnahmedauer für '+uid)).toHaveText('00:01',{timeout:4000});await button('Stoppen und speichern').click();await expect(button('Intro aufnehmen')).toBeEnabled();
  const online=await records(),durationText=await status().textContent();expect(online[0].durationMs).toBeGreaterThanOrEqual(1000);
  await page.close();await context.setOffline(true);const offline=await context.newPage();await offline.goto(new URL('./',url).href);await go(offline,'Zuordnung');await expect(offline.getByLabel('Aufnahmestatus für '+uid)).toHaveText(durationText);
  const persisted=await offline.evaluate(uid=>new Promise((resolve,reject)=>{const r=indexedDB.open('boxbert-intros-v1',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,q=db.transaction('recordings').objectStore('recordings').get(uid);q.onsuccess=()=>{resolve({durationMs:q.result.durationMs,size:q.result.blob.size});db.close();};};}),uid);
  expect(persisted.durationMs).toBe(online[0].durationMs);expect(persisted.size).toBe(online[0].size);console.log('PASS HTTPS new offline document with unchanged persisted duration + Blob:',JSON.stringify(persisted));
 }else console.log('SKIP offline document: Vite dev server has no production SW; rerun with BOXBERT_URL after parent build.');
}finally{await browser?.close();await server?.close();}
