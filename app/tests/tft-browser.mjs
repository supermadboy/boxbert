import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
const server=await createServer({server:{host:'127.0.0.1',port:0},base:'/boxbert/'});await server.listen();
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BOXBERT_URL||server.resolvedUrls.local[0]);
 await expect(page.getByRole('tab',{name:'TFT-Vorschau',exact:true})).toBeVisible({timeout:2500});
 await page.getByRole('tab',{name:'TFT-Vorschau',exact:true}).click();
 await expect(page.getByRole('heading',{name:'TFT-Vorschau',exact:true})).toBeVisible();
 await expect(page.getByText('Beispieldaten · keine Geräteverbindung', {exact:true})).toBeVisible();
 const screen=page.locator('.tft-screen');
 expect(await screen.evaluate(el=>[el.offsetWidth,el.offsetHeight])).toEqual([240,135]);
 await expect(page.getByRole('img',{name:'Boxbert, ein neugieriges dreidimensionales Box-Maskottchen'})).toBeVisible();
 expect(await page.locator('.boxbert-cube').evaluate(el=>getComputedStyle(el).transformStyle)).toBe('preserve-3d');
 expect(await page.locator('.boxbert-face').count()).toBe(6);
 for(const text of ['Akku 78 %','Lautstärke 35 %','WLAN verbunden','Fuchs','Der kleine Fuchs auf einer großen Reise durch den Zauberwald','0:42 / 3:24']) await expect(screen.getByText(text,{exact:true})).toBeVisible();
 for(const child of await screen.locator('[data-tft-region]').all()) {
  const contained=await child.evaluate(el=>{const a=el.getBoundingClientRect(),b=el.closest('.tft-screen').getBoundingClientRect();return a.left>=b.left&&a.top>=b.top&&a.right<=b.right+.5&&a.bottom<=b.bottom+.5;});
  expect(contained).toBe(true);
 }
 await page.getByRole('button',{name:'Beispiel abspielen',exact:true}).click();
 await expect(screen.getByText('Läuft',{exact:true})).toBeVisible();
 await page.waitForTimeout(1100);
 await expect(screen.getByText('0:43 / 3:24',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Beispiel pausieren',exact:true}).click();
 await expect(screen.getByText('Pause',{exact:true})).toBeVisible();
 await page.getByLabel('Beispielposition').fill('100');
 await expect(screen.getByText('1:40 / 3:24',{exact:true})).toBeVisible();
 await page.getByLabel('Beispieltitel').selectOption('moon');
 await expect(screen.getByText('Mondreise',{exact:true})).toBeVisible();
 await expect(screen.getByText('0:00 / 2:48',{exact:true})).toBeVisible();
 expect(await screen.locator('.tft-title-track').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 await page.getByLabel('Beispieltitel').selectOption('fox');
 expect(await screen.locator('.tft-title-track').evaluate(el=>getComputedStyle(el).animationName)).toBe('tft-marquee');
 await page.emulateMedia({reducedMotion:'reduce'});
 expect(await screen.locator('.tft-title-track').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 for(const selector of ['.boxbert-cube','.boxbert-bob','.boxbert-eye']) expect(await screen.locator(selector).first().evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 for(const colorScheme of ['light','dark']) {
  await page.emulateMedia({colorScheme});
  expect(await screen.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(12, 18, 25)');
  for(const width of [320,390,1280]) {await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 }
 await page.getByRole('tab',{name:'TFT-Vorschau',exact:true}).focus();
 await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('tab',{name:'Medienbibliothek',exact:true})).toBeFocused();
 await page.keyboard.press('End');
 await expect(page.getByRole('tab',{name:'TFT-Vorschau',exact:true})).toBeFocused();
 await page.getByLabel('Beispielposition').fill('204');
 await page.getByRole('button',{name:'Beispiel abspielen',exact:true}).click();
 await expect(screen.getByText('0:00 / 3:24',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Beispiel pausieren',exact:true}).click();
 const pausedTime=await screen.locator('.tft-timeline>span').textContent();
 await page.waitForTimeout(1150);
 expect(await screen.locator('.tft-timeline>span').textContent()).toBe(pausedTime);
 await page.getByLabel('Beispielposition').fill('204');
 await expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow','204');
 if(process.env.TFT_SCREENSHOT) await screen.screenshot({path:process.env.TFT_SCREENSHOT});
 expect(errors).toEqual([]);
 console.log('PASS TFT: eigener Reiter, Beispieldaten, alles innerhalb 240×135, CSS-3D/6 Flächen, Play/Pause/Seek/Ende/Titelwahl, langsame Laufschrift, Reduced Motion, Light/Dark, 320/390/1280, Tastatur, keine JS-Fehler');
}finally{await browser.close();await server.close();}
