// Real production HTTPS smoke/offline test; never speaks to ESP APIs.
import {chromium,expect} from '@playwright/test';import fs from 'node:fs/promises';
const url=process.env.BOXBERT_URL||'https://habibi.supermittel.com/boxbert/';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1280,height:900},locale:'de-DE'});const page=await context.newPage();const errors=[],failed=[],api=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+': '+r.status());});page.on('request',r=>{if(/\/(files|tags|upload)$/.test(new URL(r.url()).pathname))api.push(r.url());});
 const response=await page.goto(url);expect(response.status()).toBe(200);await expect(page.getByText('Demo · Simulation',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Lokale Box (HTTP)'})).toBeDisabled();
 await expect(page.getByText('Offline-Cache bereit · Browserdaten können gelöscht werden',{exact:true})).toBeVisible();await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();expect(await page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 const manifest=await page.evaluate(async()=>{const link=document.querySelector('link[rel=manifest]');return await (await fetch(link.href)).json();});expect(manifest.scope).toBe('/boxbert/');expect(manifest.display).toBe('standalone');
 for(const icon of manifest.icons){expect(await page.evaluate(async src=>{const img=new Image();img.src=src;await img.decode();return img.naturalWidth;},icon.src)).toBe(parseInt(icon.sizes));}
 await page.getByLabel('MP3-Datei').setInputFiles({name:'live-demo.mp3',mimeType:'audio/mpeg',buffer:Buffer.from('ID3simulated')});await page.getByRole('button',{name:'MP3 hochladen',exact:true}).click();await expect(page.getByText('/live-demo.mp3',{exact:true})).toBeVisible();
 await context.setOffline(true);await page.reload();await expect(page.getByRole('heading',{name:'Deine Musik. Deine Box.'})).toBeVisible();await expect(page.getByText('/live-demo.mp3',{exact:true})).toBeVisible();await expect(page.getByText('Browser offline',{exact:true})).toBeVisible();
 await page.getByLabel('Datei für E3:2F:F6:33').selectOption('/live-demo.mp3');await page.getByRole('button',{name:'Zuordnung für E3:2F:F6:33 speichern'}).click();await expect(page.locator('.notice')).toContainText('Demo-Zuordnung gespeichert');
 await page.getByLabel('Farbe',{exact:true}).fill('#00ff00');await page.getByLabel('Helligkeit (%)').fill('10');await page.getByLabel('Verhalten',{exact:false}).selectOption('atmen');await page.getByRole('button',{name:'Einstellungen speichern'}).click();await expect(page.locator('.notice')).toContainText('gespeichert');
 await page.reload();await expect(page.getByLabel('Datei für E3:2F:F6:33')).toHaveValue('/live-demo.mp3');await expect(page.getByLabel('Farbe',{exact:true})).toHaveValue('#00ff00');
 await fs.mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/https-offline-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'test-results/https-offline-mobile.png',fullPage:true});
 // Closing the document and opening a new page while offline proves shell restart, not only a warm reload.
 await page.close();const restart=await context.newPage();await restart.goto(url);await expect(restart.getByText('/live-demo.mp3',{exact:true})).toBeVisible();await expect(restart.getByLabel('Datei für E3:2F:F6:33')).toHaveValue('/live-demo.mp3');await context.setOffline(false);
 expect(api).toEqual([]);expect(errors).toEqual([]);expect(failed).toEqual([]);console.log('PASS echtes HTTPS: 200, Demo-Interaktionen, Manifest/192+512 Icons, SW Scope/Controller, Offline-Reload + neues Dokument, Persistence, Mobile/Desktop, keine ESP-API, keine Console-/HTTP-Fehler');
}finally{await browser.close();}
