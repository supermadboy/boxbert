import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const require=createRequire(new URL('../../app/package.json',import.meta.url));
const {chromium,expect}=require('@playwright/test');
const url=process.env.BOXBERT_URL||'https://habibi.supermittel.com/boxbert/?stand=gesamtfirmware-13';
const base=new URL('./',url).href;
const out=path.join(os.homedir(),'.cache/boxbert-verification');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},colorScheme:'dark'});
 const page=await context.newPage(),errors=[],failed=[],deviceRequests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});
 page.on('request',r=>{if(new URL(r.url()).pathname==='/api/rpc')deviceRequests.push(r.url());});
 expect((await page.goto(url)).status()).toBe(200);
 await page.getByText('Verbindung & Demo-Werkzeuge',{exact:true}).click();
 await expect(page.getByRole('button',{name:'Box über BLE',exact:true})).toBeEnabled();
 await expect(page.getByRole('button',{name:'Lokale Box (HTTP)',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Box über BLE',exact:true}).click();
 await expect(page.getByRole('button',{name:'BLE-Gerät auswählen und verbinden',exact:true})).toBeVisible();
 await expect(page.getByText('Echte Box · BLE',{exact:true})).toBeVisible();
 // No requestDevice/real radio attempt is made by this hosting test.
 await page.getByRole('button',{name:'Demo ausprobieren',exact:true}).click();
 await page.getByRole('tab',{name:'TFT-Vorschau',exact:true}).click();
 const canvas=page.locator('.tft-screen canvas');await expect(canvas).toHaveAttribute('data-renderer','ready');await expect(canvas).toHaveAttribute('data-mode','v2');
 expect(await canvas.evaluate(el=>[el.width,el.height])).toEqual([240,135]);
 await expect(page.getByText('Offline-Cache bereit · Browserdaten können gelöscht werden',{exact:true})).toBeVisible();
 await page.evaluate(()=>navigator.serviceWorker.ready);
 await page.goto(base);await page.reload();expect(await page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await context.setOffline(true);await page.close();const offline=await context.newPage();await offline.goto(base);
 await expect(offline.getByRole('heading',{name:'Deine Musik. Deine Box.'})).toBeVisible();
 await offline.getByRole('tab',{name:'TFT-Vorschau',exact:true}).click();await expect(offline.locator('.tft-screen canvas')).toHaveAttribute('data-mode','v2');
 await offline.getByRole('tab',{name:'Zuordnung',exact:true}).click();await expect(offline.locator('.box-button')).toHaveCount(10);
 expect(await offline.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await offline.screenshot({path:path.join(out,'hosted-offline-mobile.png'),fullPage:true});
 expect(errors).toEqual([]);expect(failed).toEqual([]);expect(deviceRequests).toEqual([]);
 console.log('PASS real HTTPS: BLE UI active without radio attempt, local HTTP separated, TFT V2, base-path offline new document, ten buttons, no console/HTTP errors. Screenshot:',out);
}finally{await browser.close();}
