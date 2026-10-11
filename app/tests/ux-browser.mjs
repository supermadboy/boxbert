import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
import fs from 'node:fs/promises';
const server=await createServer({server:{host:'127.0.0.1',port:0},base:'/boxbert/'});await server.listen();
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
const go=(page,name)=>page.getByRole('tab',{name,exact:true}).click();
try {
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.BOXBERT_URL||server.resolvedUrls.local[0]);
 await expect(page.locator('.connection')).toHaveJSProperty('open',false);
 await expect(page.getByRole('tab')).toHaveCount(3);
 await expect(page.getByRole('tabpanel')).toHaveCount(1);
 await page.getByRole('tab',{name:'Medienbibliothek'}).focus();await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('tab',{name:'Zuordnung'})).toBeFocused();await expect(page.locator('.box-button')).toHaveCount(10);
 await go(page,'Medienbibliothek');
 await page.getByLabel('MP3-Datei').setInputFiles({name:'draft.mp3',mimeType:'audio/mpeg',buffer:Buffer.from('x')});
 await go(page,'LEDs');await go(page,'Medienbibliothek');await expect(page.getByRole('button',{name:'MP3 hochladen',exact:true})).toBeDisabled();
 await page.getByLabel('Upload-Kategorie').selectOption('sounds');
 await page.getByLabel('MP3-Datei').setInputFiles({name:'ux-sound.mp3',mimeType:'audio/mpeg',buffer:Buffer.from('ID3')});
 await page.getByRole('button',{name:'MP3 hochladen',exact:true}).click();await expect(page.getByText('/ux-sound.mp3',{exact:true})).toBeVisible();
 await page.getByLabel('Kategorie filtern').selectOption('musik');await expect(page.getByText('/ux-sound.mp3',{exact:true})).toHaveCount(0);
 await page.getByLabel('Kategorie filtern').selectOption('sounds');await expect(page.getByText('/ux-sound.mp3',{exact:true})).toBeVisible();
 await page.getByLabel('Kategorie für /ux-sound.mp3').selectOption('musik');await expect(page.locator('.notice')).toContainText('Kategorie gespeichert');
 await page.getByLabel('Kategorie filtern').selectOption('musik');await expect(page.getByText('/ux-sound.mp3',{exact:true})).toBeVisible();
 await page.getByRole('slider',{name:'Lautstärke',exact:true}).fill('4');await page.getByRole('button',{name:'Lautstärke speichern',exact:true}).click();await expect(page.locator('.notice')).toContainText('gespeichert');
 await go(page,'LEDs');
 await page.getByLabel('Farbe',{exact:true}).fill('#123456');await page.getByLabel('Helligkeit (%)',{exact:true}).fill('70');await page.getByLabel('Effekt',{exact:true}).selectOption('atmen');
 await page.getByRole('button',{name:'Einstellungen speichern',exact:true}).click();await expect(page.locator('.notice')).toContainText('gespeichert');
 await page.getByLabel('Onboard Farbe',{exact:true}).fill('#00ff00');await page.getByLabel('Onboard Helligkeit (%)',{exact:true}).fill('42');await page.getByLabel('Onboard Palette',{exact:true}).selectOption('rainbow');await page.getByLabel('Onboard Effekt',{exact:true}).selectOption('farbwechsel');
 await page.getByRole('button',{name:'Onboard-Einstellungen speichern',exact:true}).click();await expect(page.locator('.notice')).toContainText('gespeichert');
 await expect(page.locator('.pixel-preview span')).toHaveCount(8);await expect(page.locator('.board-preview span')).toHaveCount(1);
 await go(page,'Zuordnung');await go(page,'LEDs');await expect(page.getByLabel('Effekt',{exact:true})).toHaveValue('atmen');await expect(page.getByLabel('Onboard Effekt',{exact:true})).toHaveValue('farbwechsel');await expect(page.getByLabel('Onboard Palette',{exact:true})).toHaveValue('rainbow');
 await page.reload();await go(page,'LEDs');await expect(page.getByLabel('Onboard Farbe',{exact:true})).toHaveValue('#00ff00');await expect(page.getByRole('slider',{name:'Lautstärke',exact:true})).toHaveValue('4');
 await fs.mkdir('test-results',{recursive:true});
 for(const colorScheme of ['light','dark'])for(const width of [320,390,1280]){
  await page.emulateMedia({colorScheme,reducedMotion:'reduce'});await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).colorScheme)).toBe(colorScheme);
  for(const name of ['Medienbibliothek','Zuordnung','LEDs']){
   await go(page,name);
   for(const bottom of [false,true]){
    await page.evaluate(b=>window.scrollTo(0,b?document.documentElement.scrollHeight:0),bottom);await page.waitForTimeout(100);
    const bar=await page.locator('.volume-bar').boundingBox();expect(bar.y).toBeGreaterThanOrEqual(0);expect(bar.y+bar.height).toBeLessThanOrEqual(845);
    expect(await page.locator('.volume-bar').evaluate(el=>getComputedStyle(el).position)).toBe('fixed');
    expect(await page.getByRole('button',{name:'Lautstärke speichern',exact:true}).evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})).toBe(true);
    if(bottom){const footer=await page.locator('footer').boundingBox();expect(footer.y+footer.height).toBeLessThanOrEqual(bar.y);}
   }
   await page.screenshot({path:`test-results/ux-${width}-${colorScheme}-${name==='LEDs'?'leds':name==='Zuordnung'?'mapping':'media'}.png`,fullPage:true});
  }
 }
 if(new URL(page.url()).protocol==='https:'){
  await expect(page.getByText('Offline-Cache bereit · Browserdaten können gelöscht werden',{exact:true})).toBeVisible();
  // Release-query deliberately bypasses navigation cache; offline shell uses canonical cached URL.
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.goto(new URL('./',page.url()).href);await page.reload();
  await context.setOffline(true);await page.reload();await go(page,'LEDs');
  await expect(page.getByLabel('Onboard Effekt',{exact:true})).toHaveValue('farbwechsel');await expect(page.getByLabel('Onboard Palette',{exact:true})).toHaveValue('rainbow');
  await expect(page.getByLabel('Effekt',{exact:true})).toHaveValue('atmen');
  const url=page.url();await page.close();const restart=await context.newPage();restart.on('pageerror',e=>errors.push(e.message));await restart.goto(url);
  await expect(restart.getByRole('slider',{name:'Lautstärke',exact:true})).toHaveValue('4');
  await go(restart,'Medienbibliothek');await expect(restart.getByLabel('Kategorie für /ux-sound.mp3')).toHaveValue('musik');
  await go(restart,'LEDs');await expect(restart.getByLabel('Onboard Farbe',{exact:true})).toHaveValue('#00ff00');await expect(restart.getByLabel('Farbe',{exact:true})).toHaveValue('#123456');
  console.log('PASS UX echtes HTTPS: Kategorien + beide LED-Kanäle + Lautstärke nach Offline-Reload und neuem Dokument erhalten');
 }else {
  // Reset must also discard an unsaved volume draft when persisted value already equals the seed.
  await page.getByRole('slider',{name:'Lautstärke',exact:true}).fill('6');await page.getByRole('button',{name:'Lautstärke speichern',exact:true}).click();await expect(page.locator('.notice')).toContainText('gespeichert');
  await page.getByRole('slider',{name:'Lautstärke',exact:true}).fill('9');
  await page.locator('.connection summary').click();page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Demo zurücksetzen'}).click();
  await expect(page.locator('.notice')).toContainText('zurückgesetzt');await expect(page.getByRole('slider',{name:'Lautstärke',exact:true})).toHaveValue('6');
 }
 expect(errors).toEqual([]);console.log('PASS UX: echte 3 Tabs/Keyboard, Kategorie Upload/Filter/Änderung, unabhängige 8+1 LEDs, fixed Volume/Persistence, 320/390/1280 × Light/Dark × alle Reiter, keine Überdeckung/JS-Fehler');
}finally{await browser.close();await server.close();}
