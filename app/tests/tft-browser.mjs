import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
const server=await createServer({server:{host:'127.0.0.1',port:0},base:'/boxbert/'});await server.listen();
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE ERROR:',e.message);});
 await page.goto(process.env.BOXBERT_URL||server.resolvedUrls.local[0]);
 await page.getByRole('tab',{name:'TFT-Vorschau',exact:true}).click();
 await expect(page.getByRole('heading',{name:'TFT-Vorschau',exact:true})).toBeVisible();
 await expect(page.getByText('Beispieldaten · keine Geräteverbindung',{exact:true})).toBeVisible();
 const screen=page.locator('.tft-screen'),canvas=screen.locator('canvas');
 await expect(canvas).toBeVisible();
 await expect(canvas).toHaveAttribute('data-renderer','ready');
 expect(await canvas.evaluate(el=>[el.width,el.height,el.offsetWidth,el.offsetHeight])).toEqual([240,135,240,135]);
 expect(await screen.locator('svg,.boxbert-cube,.tft-title-track')).toHaveCount(0);
 expect(await canvas.evaluate(el=>getComputedStyle(el).imageRendering)).toBe('pixelated');
 await expect(canvas).toHaveAccessibleName(/Fuchs.*Der kleine Fuchs.*Pause.*0:42 \/ 3:24.*Akku 78 Prozent.*Lautstärke 7 von 21.*WLAN verbunden/);
 const pixels=()=>canvas.evaluate(el=>Array.from(el.getContext('2d').getImageData(0,0,240,135).data));
 const initial=await pixels();expect(new Set(initial).size).toBeGreaterThan(4);
 await page.getByRole('button',{name:'Beispiel abspielen',exact:true}).click();
 await expect(canvas).toHaveAccessibleName(/Läuft/);
 await expect(canvas).toHaveAccessibleName(/0:43 \/ 3:24/,{timeout:3500});
 await page.getByRole('button',{name:'Beispiel pausieren',exact:true}).click();
 await expect(canvas).toHaveAccessibleName(/Pause/);
 await page.getByLabel('Beispielposition',{exact:true}).fill('100');
 await expect(canvas).toHaveAccessibleName(/1:40 \/ 3:24/);
 await page.getByRole('combobox',{name:'Beispieltitel',exact:true}).selectOption('moon');
 await expect(canvas).toHaveAccessibleName(/Astronaut.*Mondreise.*0:00 \/ 2:48/);
 const short=await pixels();await page.waitForTimeout(500);expect(await pixels()).toEqual(short);
 await page.getByRole('combobox',{name:'Beispieltitel',exact:true}).selectOption('fox');
 // Actual canvas pixels must move; a CSS animation name is not a rendering proof.
 const before=await pixels();await page.waitForTimeout(3200);expect(await pixels()).not.toEqual(before);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(150);
 const fixed=await pixels();await page.waitForTimeout(500);expect(await pixels()).toEqual(fixed);
 await page.getByRole('button',{name:'Titel nach links',exact:true}).click();
 expect(await pixels()).not.toEqual(fixed);
 await page.getByRole('button',{name:'Titel zurücksetzen',exact:true}).click();expect(await pixels()).toEqual(fixed);
 for(const colorScheme of ['light','dark']){
  await page.emulateMedia({colorScheme});
  expect(await screen.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(12, 18, 25)');
  for(const width of [320,390,1280]){
   await page.setViewportSize({width,height:844});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   expect(await canvas.evaluate(el=>{const a=el.getBoundingClientRect(),b=el.closest('.tft-bezel').getBoundingClientRect();return a.left>=b.left&&a.top>=b.top&&a.right<=b.right+.5&&a.bottom<=b.bottom+.5;})).toBe(true);
  }
 }
 await page.getByRole('tab',{name:'TFT-Vorschau',exact:true}).focus();await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('tab',{name:'Medienbibliothek',exact:true})).toBeFocused();await page.keyboard.press('End');
 await expect(page.getByRole('tab',{name:'TFT-Vorschau',exact:true})).toBeFocused();
 await page.getByLabel('Beispielposition',{exact:true}).fill('204');
 await page.getByRole('button',{name:'Beispiel abspielen',exact:true}).click();
 await expect(canvas).toHaveAccessibleName(/0:00 \/ 3:24/);
 await page.getByRole('button',{name:'Beispiel pausieren',exact:true}).click();
 const pausedName=await canvas.getAttribute('aria-label');await page.waitForTimeout(1150);expect(await canvas.getAttribute('aria-label')).toBe(pausedName);
 await page.getByLabel('Beispielposition',{exact:true}).fill('204');
 await expect(page.getByRole('progressbar',{name:'Beispielfortschritt',exact:true})).toHaveAttribute('aria-valuenow','204');
 for(const [value,name] of [['boot','Startet'],['idle','Keine Figur'],['error','Dateifehler'],['unknown','Dauer unbekannt'],['umlauts','ÄÖÜ äöü ß']]){
  await page.getByRole('combobox',{name:'Beispieltitel',exact:true}).selectOption(value);await expect(canvas).toHaveAccessibleName(new RegExp(name));
 }
 await page.getByRole('combobox',{name:'Beispieltitel',exact:true}).selectOption('unknown');
 await expect(canvas).toHaveAccessibleName(/Akku unbekannt.*Lautstärke unbekannt.*WLAN unbekannt/);
 const unknownProgress=page.getByRole('progressbar',{name:'Beispielfortschritt',exact:true});
 await expect(unknownProgress).not.toHaveAttribute('aria-valuenow');await expect(unknownProgress).not.toHaveAttribute('aria-valuemax');
 await expect(unknownProgress).toHaveAttribute('aria-valuetext','Gesamtdauer unbekannt');
 if(process.env.TFT_SCREENSHOT)await screen.screenshot({path:process.env.TFT_SCREENSHOT});
 expect(errors).toEqual([]);
 console.log('PASS TFT V1: echtes WASM-Canvas 240×135, keine CSS/SVG-Nachbildung, Status/UTF-8/Fehlerfälle, Play/Pause/Seek/Ende/Titelwahl, bewegte Pixel, Reduced Motion + manuelles Scrollen, Light/Dark 320/390/1280, Tastatur, keine JS-Fehler');
}catch(error){console.error(error);throw error;}finally{await browser.close();await server.close();}
