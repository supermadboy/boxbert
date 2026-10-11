import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
import {go,tools} from './navigation.mjs';

const server=process.env.BOXBERT_URL?null:await createServer({server:{host:'127.0.0.1',port:0},base:'/boxbert/'});
await server?.listen();
let browser;
const uid='E3:2F:F6:33';
const url=process.env.BOXBERT_URL||server.resolvedUrls.local[0];
async function records(page){
 return page.evaluate(()=>new Promise((resolve,reject)=>{
  const r=indexedDB.open('boxbert-intros-v1');
  r.onerror=()=>reject(r.error);
  r.onsuccess=()=>{
   const db=r.result,q=db.transaction('recordings').objectStore('recordings').getAll();
   q.onerror=()=>{db.close();reject(q.error);};
   q.onsuccess=async()=>{db.close();resolve(await Promise.all(q.result.map(async x=>({uid:x.uid,type:x.blob.type,bytes:Array.from(new Uint8Array(await x.blob.arrayBuffer()))}))));};
  };
 }));
}
async function prepare(page){
 await page.goto(url);await go(page,'Zuordnung');
 await page.getByLabel('Name für '+uid,{exact:true}).fill('Reset-Test');
 await page.getByRole('button',{name:'Name für '+uid+' speichern',exact:true}).click();
 await expect(page.locator('.notice')).toContainText('Demo-Name gespeichert');
 await page.getByRole('button',{name:'Intro aufnehmen für '+uid,exact:true}).click();
 const stop=page.getByRole('button',{name:'Stoppen und speichern für '+uid,exact:true});
 await expect(stop).toBeVisible();await page.waitForTimeout(700);await stop.click();
 await expect(page.getByLabel('Aufnahmestatus für '+uid)).toContainText('Gespeichert');
 const saved=await records(page);expect(saved).toHaveLength(1);expect(saved[0].bytes.length).toBeGreaterThan(0);expect(saved[0].type).toMatch(/^audio\//);
 await tools(page);return saved;
}
async function reset(page){
 page.once('dialog',dialog=>dialog.accept());
 await page.getByRole('button',{name:'Demo zurücksetzen',exact:true}).click();
 await expect(page.getByRole('button',{name:'Demo zurücksetzen',exact:true})).toBeEnabled();
}
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/nix/store/crfx5mjs2k6sdw45kbs9404h575mmwlk-playwright-chromium/chrome-linux64/chrome',args:['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
 const context=await browser.newContext({ignoreHTTPSErrors:true});
 const page=await context.newPage(),saved=await prepare(page);
 const metadata=await page.evaluate(()=>localStorage.getItem('boxbert-demo-v1'));
 // Inject only after a real MediaRecorder recording was committed.
 await page.evaluate(()=>{
  window.nativeSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){if(key==='boxbert-demo-v1')throw new DOMException('Reset quota failure','QuotaExceededError');return window.nativeSetItem.call(this,key,value);};
  window.nativeOpen=indexedDB.open.bind(indexedDB);window.resetOpens=0;
  indexedDB.open=(...args)=>{window.resetOpens++;return window.nativeOpen(...args);};
 });
 await reset(page);
 await expect(page.locator('.notice')).toContainText('Browser-Speicher nicht verfügbar oder voll');
 await expect(page.locator('.notice')).toHaveClass(/error/);
 const resetOpens=await page.evaluate(()=>window.resetOpens);
 await page.evaluate(()=>{indexedDB.open=window.nativeOpen;Storage.prototype.setItem=window.nativeSetItem;});
 expect(await records(page),'Failed metadata reset must preserve the actual audio bytes').toEqual(saved);
 expect(resetOpens,'Failed metadata reset must not attempt IndexedDB deletion').toBe(0);
 expect(await page.evaluate(()=>localStorage.getItem('boxbert-demo-v1'))).toBe(metadata);
 await expect(page.getByLabel('Name für '+uid,{exact:true})).toHaveValue('Reset-Test');
 await expect(page.getByLabel('Aufnahmestatus für '+uid)).toContainText('Gespeichert');
 await page.reload();await go(page,'Zuordnung');
 await expect(page.getByLabel('Aufnahmestatus für '+uid)).toContainText('Gespeichert');
 await expect(page.getByLabel('Name für '+uid,{exact:true})).toHaveValue('Reset-Test');
 console.log('PASS localStorage reset failure: metadata + real audio bytes preserved, no IDB deletion, UI/reload consistent (synthetic Chromium microphone).');
 await context.close();
 for(const failure of ['blocked','missing']){
  const c=await browser.newContext({ignoreHTTPSErrors:true}),p=await c.newPage(),audio=await prepare(p);
  await p.evaluate(kind=>{window.nativeIDB=indexedDB;window.nativeOpen=indexedDB.open.bind(indexedDB);if(kind==='missing')Object.defineProperty(window,'indexedDB',{configurable:true,value:undefined});else indexedDB.open=()=>{throw new DOMException('IDB blocked','SecurityError');};},failure);
  await reset(p);await expect(p.locator('.notice')).toContainText('Demo-Daten zurückgesetzt');await expect(p.locator('.notice')).toContainText('Aufnahmen nicht gelöscht');await expect(p.locator('.notice')).toHaveClass(/error/);
  expect(await p.evaluate(()=>JSON.parse(localStorage.getItem('boxbert-demo-v1')).tags[0].name)).toBe('Tag 1');
  await p.evaluate(()=>{Object.defineProperty(window,'indexedDB',{configurable:true,value:window.nativeIDB});indexedDB.open=window.nativeOpen;});
  expect(JSON.stringify(await records(p))===JSON.stringify(audio),'Partial reset preserves audio bytes').toBe(true);
  await p.reload();await go(p,'Zuordnung');await expect(p.getByLabel('Name für '+uid,{exact:true})).toHaveValue('Tag 1');await expect(p.getByLabel('Aufnahmestatus für '+uid)).toContainText('Gespeichert');
  console.log('PASS '+failure+' IndexedDB: metadata reset allowed, partial result explicit, audio preserved, reload consistent.');await c.close();
 }
}finally{await browser?.close();await server?.close();}
