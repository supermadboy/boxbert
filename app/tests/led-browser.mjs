import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
import fs from 'node:fs/promises';
const server=await createServer({server:{host:'127.0.0.1',port:0},base:'/boxbert/'});await server.listen();
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:1000}}),page=await context.newPage(),errors=[],api=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/(settings|pixel|files|tags|upload)$/.test(new URL(r.url()).pathname))api.push(r.url());});
 await page.addInitScript(()=>{const pending=new Set(),request=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window);window.__raf=pending;window.requestAnimationFrame=fn=>{const id=request(t=>{pending.delete(id);fn(t)});pending.add(id);return id};window.cancelAnimationFrame=id=>{pending.delete(id);cancel(id)};});
 await page.goto(process.env.BOXBERT_URL||server.resolvedUrls.local[0]);await page.getByRole('tab',{name:'LEDs',exact:true}).click();
 const palette=page.getByLabel('Palette',{exact:true}),effect=page.getByLabel('Effekt',{exact:true}),boardEffect=page.getByLabel('Onboard Effekt',{exact:true});
 const frame=selector=>page.locator(selector+' span').evaluateAll(ps=>ps.map(p=>({color:p.style.background,opacity:Number(p.style.opacity)})));
 await page.getByLabel('Farbe',{exact:true}).fill('#123456');await page.getByLabel('Helligkeit (%)',{exact:true}).fill('60');
 await effect.selectOption('links-rechts');await palette.selectOption('rainbow');await expect(effect).toHaveValue('links-rechts');await expect(page.getByLabel('Farbe',{exact:true})).toBeDisabled();
 expect(new Set((await frame('.pixel-preview')).map(p=>p.color)).size).toBe(8);
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:1000});expect((await palette.boundingBox()).width).toBeGreaterThanOrEqual(140);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}await page.setViewportSize({width:390,height:1000});
 for(const value of ['links-rechts','rechts-links','mitte-aussen','atmen','party']){
  await effect.selectOption(value);const before=await frame('.pixel-preview');await page.waitForTimeout(650);expect(await frame('.pixel-preview')).not.toEqual(before);
 }
 await palette.selectOption('solid');await expect(effect).toHaveValue('party');await expect(page.getByLabel('Farbe',{exact:true})).toHaveValue('#123456');
 await palette.selectOption('rainbow');await effect.selectOption('rechts-links');
 await page.getByRole('button',{name:'Einstellungen speichern',exact:true}).click();await expect(page.locator('.notice')).toContainText('gespeichert');
 await page.getByLabel('Onboard Palette',{exact:true}).selectOption('rainbow');await boardEffect.selectOption('farbwechsel');await page.getByLabel('Onboard Helligkeit (%)',{exact:true}).fill('42');
 const boardBefore=await frame('.board-preview');await page.waitForTimeout(650);expect(await frame('.board-preview')).not.toEqual(boardBefore);
 await page.getByRole('slider',{name:'Lautstärke',exact:true}).fill('4');await page.getByRole('button',{name:'Lautstärke speichern',exact:true}).click();await expect(page.locator('.notice')).toContainText('gespeichert');await expect(boardEffect).toHaveValue('farbwechsel');await expect(effect).toHaveValue('rechts-links');
 // The independent board draft does not persist until its own explicit save.
 let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('boxbert-demo-v1')));expect(saved.boardPixel.effect).toBe('aus');expect(saved.pixel.effect).toBe('rechts-links');
 await page.getByRole('button',{name:'Onboard-Einstellungen speichern',exact:true}).click();await expect(page.locator('.notice')).toContainText('gespeichert');
 for(const value of ['atmen','party','kerze']){await boardEffect.selectOption(value);const before=await frame('.board-preview');await page.waitForTimeout(650);expect(await frame('.board-preview')).not.toEqual(before);}
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);const still=await frame('.pixel-preview'),boardStill=await frame('.board-preview');await page.waitForTimeout(650);expect(await frame('.pixel-preview')).toEqual(still);expect(await frame('.board-preview')).toEqual(boardStill);expect(await page.evaluate(()=>__raf.size)).toBe(0);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(100);expect(await page.evaluate(()=>__raf.size)).toBe(2);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});expect(await page.evaluate(()=>__raf.size)).toBe(0);
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(100);expect(await page.evaluate(()=>__raf.size)).toBe(2);
 await page.getByRole('tab',{name:'Zuordnung',exact:true}).click();expect(await page.evaluate(()=>__raf.size)).toBe(0);
 await page.reload();await page.getByRole('tab',{name:'LEDs',exact:true}).click();await expect(effect).toHaveValue('rechts-links');await expect(boardEffect).toHaveValue('farbwechsel');await expect(palette).toHaveValue('rainbow');
 await fs.mkdir('test-results',{recursive:true});await page.setViewportSize({width:1280,height:1400});for(const colorScheme of ['light','dark']){await page.emulateMedia({colorScheme,reducedMotion:'reduce'});await page.locator('.pixel-preview').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/effects-${colorScheme}.png`,fullPage:true});await page.locator('.led-grid').screenshot({path:`test-results/effects-cards-${colorScheme}.png`});}
 // Drive the real UI clock deterministically to verify the visible spatial direction.
 const direction=await context.newPage();await direction.clock.install({time:new Date('2026-10-11T12:00:00Z')});await direction.clock.pauseAt(new Date('2026-10-11T12:00:01Z'));await direction.goto(process.env.BOXBERT_URL||server.resolvedUrls.local[0]);await direction.getByRole('tab',{name:'LEDs',exact:true}).click();
 await direction.emulateMedia({reducedMotion:'no-preference'});
 const brightest=()=>direction.locator('.pixel-preview span').evaluateAll(ps=>{const levels=ps.map(p=>Number(p.style.opacity)),max=Math.max(...levels);return levels.flatMap((v,i)=>Math.abs(v-max)<0.0001?[i]:[])});
 for(const [value,initial,next] of [['links-rechts',[0],[1]],['rechts-links',[7],[6]],['mitte-aussen',[3,4],[2,5]]]){await direction.getByLabel('Effekt',{exact:true}).selectOption(value);await direction.clock.runFor(32);expect(await brightest()).toEqual(initial);await direction.clock.runFor(650);expect(await brightest()).toEqual(next);}
 await direction.close();
 await page.locator('.connection summary').click();page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Demo zurücksetzen'}).click();await expect(effect).toHaveValue('statisch');await expect(boardEffect).toHaveValue('aus');await expect(palette).toHaveValue('solid');
 await effect.selectOption('party');await boardEffect.selectOption('kerze');page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Demo zurücksetzen'}).click();await expect(effect).toHaveValue('statisch');await expect(boardEffect).toHaveValue('aus');
 expect(api).toEqual([]);expect(errors).toEqual([]);console.log('PASS LED integration: independent palette/effects, 8+1 animated channels/all moving effects, explicit draft/save/reload/reset, reduced motion static, background + unmount RAF cleanup, light/dark screenshots, no hardware requests/errors');
}finally{await browser.close();await server.close();}
