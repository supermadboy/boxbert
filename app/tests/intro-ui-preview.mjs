// Visual evidence with a synthetic Chromium microphone, not an ESP/phone test.
import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
import fs from 'node:fs/promises';
import {go} from './navigation.mjs';
const server=process.env.BOXBERT_URL?null:await createServer({server:{host:'127.0.0.1',port:0},base:'/boxbert/'});
await server?.listen();let browser;
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
 const context=await browser.newContext({viewport:{width:390,height:844},colorScheme:'dark',reducedMotion:'reduce'}),page=await context.newPage(),uid='E3:2F:F6:33';
 await page.goto(process.env.BOXBERT_URL||server.resolvedUrls.local[0]);await go(page,'Zuordnung');
 const button=name=>page.getByRole('button',{name:name+' für '+uid,exact:true}),card=page.locator('.intro-recording').first();
 await button('Intro aufnehmen').click();await expect(page.getByLabel('Aufnahmedauer für '+uid)).toHaveText('00:02',{timeout:5000});
 await fs.mkdir('docs/recording-ui',{recursive:true});await card.screenshot({path:'docs/recording-ui/recording-mobile.png'});
 await button('Stoppen und speichern').click();await expect(button('Intro aufnehmen')).toBeEnabled();await expect(page.getByLabel('Aufnahmestatus für '+uid)).toContainText('Gespeichert · 00:');
 await card.screenshot({path:'docs/recording-ui/saved-mobile.png'});
 // Convert this real MediaRecorder result to the previous Blob-only schema,
 // not an invented audio response; decoding must recover its own duration.
 const legacy=await page.evaluate(uid=>new Promise((resolve,reject)=>{const r=indexedDB.open('boxbert-intros-v1',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('recordings','readwrite'),store=tx.objectStore('recordings'),q=store.get(uid);let original;q.onsuccess=()=>{const row=q.result;original={uid:row.uid,size:row.blob.size,type:row.blob.type,durationMs:row.durationMs};delete row.durationMs;store.put(row);};tx.oncomplete=()=>{db.close();resolve(original);};tx.onabort=()=>reject(tx.error);};}),uid);
 await page.reload();await go(page,'Zuordnung');await expect(page.getByLabel('Aufnahmestatus für '+uid)).toContainText(/Gespeichert · \d+:\d{2}/);const recovered=(await page.getByLabel('Aufnahmestatus für '+uid).textContent()).match(/(\d+):(\d{2})/);expect(Math.abs(Number(recovered[1])*60+Number(recovered[2])-Math.floor(legacy.durationMs/1000))).toBeLessThanOrEqual(1);console.log('PASS authentic previous-schema MediaRecorder Blob duration recovered locally:',JSON.stringify(legacy));
 const boxes=await card.locator('button').evaluateAll(elements=>elements.map(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height};}));expect(boxes.every(b=>b.width>=44&&b.height>=44)).toBe(true);
 expect(await card.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);console.log('PASS actual mobile dark recording/saved screenshots, 44px controls and no card overflow. Synthetic microphone; no real phone/ESP test.');
}finally{await browser?.close();await server?.close();}
