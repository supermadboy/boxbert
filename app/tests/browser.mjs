import { chromium, expect } from '@playwright/test';
import {createServer} from 'vite';
import fs from 'node:fs/promises';
const server=await createServer({server:{host:'127.0.0.1',port:0},base:'/boxbert/'});await server.listen();
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(server.resolvedUrls.local[0]);
 await expect(page.getByRole('heading',{name:'Deine Musik. Deine Box.'})).toBeVisible();
 await expect(page.getByText('Demo · Simulation', {exact:true})).toBeVisible();
 await page.getByLabel('MP3-Datei').setInputFiles({name:'neu.mp3',mimeType:'audio/mpeg',buffer:Buffer.from('ID3demo')});
 await page.getByRole('button',{name:'MP3 hochladen',exact:true}).click();
 await expect(page.getByText('/neu.mp3',{exact:true})).toBeVisible();
 await page.getByLabel('Datei für E3:2F:F6:33').selectOption('/neu.mp3');await page.getByRole('button',{name:'Zuordnung für E3:2F:F6:33 speichern'}).click();
 await page.getByRole('slider',{name:'Lautstärke'}).fill('4');await page.getByRole('button',{name:'Einstellungen speichern'}).click();
 await page.reload();await expect(page.getByLabel('Datei für E3:2F:F6:33')).toHaveValue('/neu.mp3');await expect(page.getByRole('slider',{name:'Lautstärke'})).toHaveValue('4');
 await page.getByLabel('MP3-Datei').setInputFiles({name:'abbruch.mp3',mimeType:'audio/mpeg',buffer:Buffer.from('ID3demo')});await page.getByRole('button',{name:'MP3 hochladen',exact:true}).click();await page.getByRole('button',{name:'Abbrechen',exact:true}).click();
 await expect(page.locator('.notice')).toContainText('Abgebrochen');await expect(page.getByText('/abbruch.mp3',{exact:true})).toHaveCount(0);
 await page.getByLabel('Fehler simulieren').selectOption('sd');await page.getByRole('button',{name:'MP3 hochladen',exact:true}).click();await expect(page.locator('.notice')).toContainText('SD-Fehler');
 await page.getByLabel('Fehler simulieren').selectOption('none');
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Demo zurücksetzen'}).click();await expect(page.getByText('/neu.mp3',{exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Lokale Box (HTTP)'})).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await fs.mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/demo-mobile.png',fullPage:true});
 expect(errors).toEqual([]);console.log('PASS Browser Demo: Upload, RFID, Einstellungen, Persistence, Abbruch, SD-Fehler, Reset, Hosting-Grenze, Mobile/Console');
}finally{await browser.close();await server.close();}
