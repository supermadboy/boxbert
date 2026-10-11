import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
const server=await createServer({server:{host:'127.0.0.1',port:0},base:'/boxbert/'});
await server.listen();
let browser;
try {
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 await page.goto(server.resolvedUrls.local[0]);
 await page.getByLabel('Name für E3:2F:F6:33',{exact:true}).fill('Schleichstegosaurus');
 await page.getByRole('button',{name:'Name für E3:2F:F6:33 speichern',exact:true}).click();
 await expect(page.getByText('Schleichstegosaurus',{exact:true})).toBeVisible();
 await page.reload();
 await expect(page.getByLabel('Name für E3:2F:F6:33',{exact:true})).toHaveValue('Schleichstegosaurus');
 await page.getByLabel('Name für E3:2F:F6:33',{exact:true}).fill('Dino 🦕');
 await page.getByRole('button',{name:'Name für E3:2F:F6:33 speichern',exact:true}).click();
 await page.reload();
 await expect(page.getByLabel('Name für E3:2F:F6:33',{exact:true})).toHaveValue('Dino 🦕');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('boxbert-demo-v1')));
 expect(saved.tags[0].uid).toBe('E3:2F:F6:33');
 expect(saved.tags[0].path).toBe('/arcade-music-loop.mp3');
 expect(saved.tags[0].name).toBe('Dino 🦕');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 for(const width of [390,1280]){
 await page.setViewportSize({width,height:900});
 await page.getByLabel('Name für E3:2F:F6:33',{exact:true}).fill('X'.repeat(80));
 await page.getByRole('button',{name:'Name für E3:2F:F6:33 speichern',exact:true}).click();
 const title=page.getByText('X'.repeat(80),{exact:true});await expect(title).toBeVisible();
 expect(await title.evaluate(el=>el.getBoundingClientRect().width<=el.parentElement.getBoundingClientRect().width)).toBe(true);
}
console.log('PASS Tag-Namen Browser: wiederholtes Umbenennen, Unicode, Reload-Persistence, UID/MP3 unverändert, Mobile. Keine SD-/Firmwareprüfung.');
} finally {await browser?.close();await server.close();}
