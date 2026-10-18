import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
const server=await createServer({server:{host:'127.0.0.1',port:0},base:'/boxbert/'});await server.listen();
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.BOXBERT_URL||server.resolvedUrls.local[0];
 async function open(){await page.goto(base);await page.getByRole('tab',{name:'TFT-Vorschau',exact:true}).click();await expect(page.locator('canvas')).toHaveAttribute('data-renderer','ready');}
 await open();const canvas=page.locator('.tft-screen canvas');
 await expect(canvas).toHaveAttribute('data-mode','v2');
 const toggle=page.getByRole('checkbox',{name:'Boxbert-Animation',exact:true});await expect(toggle).toBeChecked();
 const sprite=()=>canvas.evaluate(el=>Array.from(el.getContext('2d').getImageData(8,26,64,64).data));
 const frame0=await sprite();await page.getByRole('button',{name:'Beispiel abspielen',exact:true}).click();
 await page.waitForTimeout(360);expect(await sprite()).not.toEqual(frame0);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(150);const still=await sprite();await page.waitForTimeout(400);expect(await sprite()).toEqual(still);
 await toggle.uncheck();await expect(canvas).toHaveAttribute('data-mode','v1');
 await toggle.check();await expect(canvas).toHaveAttribute('data-mode','v2');
 for(const colorScheme of ['light','dark'])for(const width of [320,390,1280]){
  await page.emulateMedia({colorScheme});await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(toggle).toBeVisible();expect(await toggle.evaluate(el=>el.getBoundingClientRect().width)).toBeLessThan(40);
 }
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'no-preference',colorScheme:'dark'});
 await page.getByRole('button',{name:'Titel nach links',exact:true}).click();const manual=await sprite();await page.waitForTimeout(360);expect(await sprite()).not.toEqual(manual);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(150);
 if(process.env.TFT_V2_SCREENSHOT)await page.locator('.tft-preview').screenshot({path:process.env.TFT_V2_SCREENSHOT});
 await page.route(/\/boxbert(?:-[^/?]+)?\.rgb565$/,r=>r.fulfill({status:503,body:'unavailable'}));await open();
 await expect(page.getByRole('status').filter({hasText:'V1 bleibt aktiv'})).toContainText('HTTP 503');expect(await page.locator('.tft-screen [role="status"]').count()).toBe(0);await expect(canvas).toHaveAttribute('data-mode','v1');
 await page.unroute(/\/boxbert(?:-[^/?]+)?\.rgb565$/);await page.route(/\/boxbert(?:-[^/?]+)?\.rgb565$/,r=>r.fulfill({status:200,body:'broken'}));await open();
 await expect(page.getByRole('status').filter({hasText:'V1 bleibt aktiv'})).toContainText('Größe');await expect(canvas).toHaveAttribute('data-mode','v1');
 await page.unroute(/\/boxbert(?:-[^/?]+)?\.rgb565$/);
 let release,requested;const gate=new Promise(r=>release=r),request=new Promise(r=>requested=r);
 await page.route(/\/boxbert(?:-[^/?]+)?\.rgb565$/,async r=>{requested();await gate;await r.continue().catch(()=>{});});
 await open();await request;await page.getByRole('tab',{name:'Medienbibliothek',exact:true}).click();release();await page.waitForTimeout(150);
 await page.unroute(/\/boxbert(?:-[^/?]+)?\.rgb565$/);await open();await expect(canvas).toHaveAttribute('data-mode','v2');
 expect(errors).toEqual([]);await context.close();
 console.log('PASS V2 browser: shared sprite pixels, animation, Reduced Motion, toggle, HTTP/corrupt fallback, late unmount/reopen');
}finally{await browser.close();await server.close();}
