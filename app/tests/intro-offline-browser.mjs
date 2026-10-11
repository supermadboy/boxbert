// Local HTTPS production-build fixture, not deployed hosting or ESP hardware.
import {createServer} from 'node:https';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {chromium,expect} from '@playwright/test';
import {go} from './navigation.mjs';
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'boxbert-intro-'));
let server,browser;
try{
 execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',path.join(temp,'key.pem'),'-out',path.join(temp,'cert.pem'),'-days','1','-subj','/CN=localhost'],{stdio:'ignore'});
 server=createServer({key:await fs.readFile(path.join(temp,'key.pem')),cert:await fs.readFile(path.join(temp,'cert.pem'))},async(req,res)=>{try{const url=new URL(req.url,'https://localhost');const relative=url.pathname.slice('/boxbert/'.length)||'index.html';if(!url.pathname.startsWith('/boxbert/')||relative.includes('..')){res.writeHead(404).end();return;}const data=await fs.readFile(path.join('dist',relative));res.setHeader('Content-Type',relative.endsWith('.js')?'text/javascript':relative.endsWith('.css')?'text/css':relative.endsWith('.png')?'image/png':relative.endsWith('.svg')?'image/svg+xml':relative.endsWith('.webmanifest')?'application/manifest+json':'text/html');res.end(data);}catch{res.writeHead(404).end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`https://localhost:${server.address().port}/boxbert/`;
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--ignore-certificate-errors','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});const context=await browser.newContext({ignoreHTTPSErrors:true});let page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await expect(page.getByText('Offline-Cache bereit',{exact:false})).toBeVisible();await page.reload();expect(await page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await go(page,'Zuordnung');const uid='E3:2F:F6:33';await page.getByRole('button',{name:'Intro aufnehmen für '+uid,exact:true}).click();await expect(page.getByRole('button',{name:'Stoppen und speichern für '+uid,exact:true})).toBeVisible();await page.waitForTimeout(650);await page.getByRole('button',{name:'Stoppen und speichern für '+uid,exact:true}).click();await expect(page.getByRole('button',{name:'Intro aufnehmen für '+uid,exact:true})).toBeEnabled();await expect(page.getByLabel('Aufnahmestatus für '+uid)).toContainText('Gespeichert');const status=await page.getByLabel('Aufnahmestatus für '+uid).textContent();
 await page.close();await context.setOffline(true);page=await context.newPage();await page.goto(url);await go(page,'Zuordnung');await expect(page.getByLabel('Aufnahmestatus für '+uid)).toHaveText(status);await expect(page.getByLabel('Datei für '+uid,{exact:true})).toHaveValue('/arcade-music-loop.mp3');
 const blob=await page.evaluate(uid=>new Promise((resolve,reject)=>{const r=indexedDB.open('boxbert-intros-v1');r.onsuccess=()=>{const db=r.result,q=db.transaction('recordings').objectStore('recordings').get(uid);q.onsuccess=async()=>{const b=q.result.blob;resolve({size:b.size,bytes:(await b.arrayBuffer()).byteLength,type:b.type,uid:q.result.uid});db.close();};q.onerror=()=>reject(q.error);};}),uid);expect(blob.bytes).toBeGreaterThan(0);expect(blob.size).toBe(blob.bytes);expect(blob.uid).toBe(uid);expect(errors).toEqual([]);
 console.log('PASS lokales HTTPS-Produktionsartefakt: SW-Controller, Offline-Neustart /boxbert/, IndexedDB-Blob unverändert lesbar, UID/Song unverändert:',JSON.stringify(blob));
}finally{await browser?.close();if(server)await new Promise(r=>server.close(r));await fs.rm(temp,{recursive:true,force:true});}
