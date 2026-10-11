import {go} from './navigation.mjs';
import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
const server=process.env.BOXBERT_URL?null:await createServer({server:{host:'127.0.0.1',port:0},base:'/boxbert/'});
await server?.listen();let browser;
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();
 await page.goto(process.env.BOXBERT_URL||server.resolvedUrls.local[0]);
 await go(page,'Zuordnung');
 const uid='E3:2F:F6:33',other='01:8C:F1:6E';
 const intro=()=>page.getByLabel('Intro für '+uid,{exact:true});
 const save=()=>page.getByRole('button',{name:'Intro für '+uid+' speichern',exact:true});
 await expect(intro()).toHaveValue('');
 await intro().selectOption('/happy-tune.mp3');await save().click();
 await expect(page.locator('.notice')).toContainText('Demo-Intro gespeichert');
 await page.reload();await go(page,'Zuordnung');
 await expect(intro()).toHaveValue('/happy-tune.mp3');
 await expect(page.getByLabel('Datei für '+uid,{exact:true})).toHaveValue('/arcade-music-loop.mp3');
 await expect(page.getByLabel('Intro für '+other,{exact:true})).toHaveValue('');
 await intro().selectOption('');await go(page,'LEDs');await go(page,'Zuordnung');
 await expect(intro()).toHaveValue('/happy-tune.mp3');
 await intro().selectOption('');await page.getByRole('button',{name:'Intro für '+uid+' speichern',exact:true}).click();await expect(page.locator('.notice')).toContainText('Demo-Intro gespeichert');await page.reload();await go(page,'Zuordnung');await expect(intro()).toHaveValue('');
 await intro().selectOption('/happy-tune.mp3');await page.getByText('Verbindung & Demo-Werkzeuge',{exact:true}).click();page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Demo zurücksetzen',exact:true}).click();await expect(page.locator('.notice')).toContainText('Demo zurückgesetzt');await expect(intro()).toHaveValue('');
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 console.log('PASS Intro-Zuordnung Browser: speichern, Reload, deaktivieren, anderer Tag/Song unverändert, Entwurf verworfen, 320/390/1280. Keine Wiedergabe oder ESP-Prüfung.');
 if(process.env.BOXBERT_URL){await expect(page.getByText('Offline-Cache bereit',{exact:false})).toBeVisible();await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();await go(page,'Zuordnung');await intro().selectOption('/happy-tune.mp3');await save().click();await expect(page.locator('.notice')).toContainText('Demo-Intro gespeichert');await context.setOffline(true);const offline=await context.newPage();await offline.goto(new URL('./',process.env.BOXBERT_URL).href);await go(offline,'Zuordnung');await expect(offline.getByLabel('Intro für '+uid,{exact:true})).toHaveValue('/happy-tune.mp3');console.log('PASS echtes HTTPS-Offline: neues Dokument mit gespeicherter Intro-Zuordnung.');}
}finally{await browser?.close();await server?.close();}
