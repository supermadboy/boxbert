import {go,tools} from './navigation.mjs';
import {expect} from '@playwright/test';
export async function checkButtons(page){
 await go(page,'Zuordnung');const buttons=page.locator('.box-button');await expect(buttons).toHaveCount(10);
 expect(await buttons.evaluateAll(bs=>bs.map(b=>Number(b.dataset.buttonId)))).toEqual([1,2,3,4,5,6,7,8,9,10]);
 await go(page,'Zuordnung');await page.getByRole('button',{name:'Demo-Button 1',exact:true}).click();await go(page,'Zuordnung');await page.getByLabel('MP3 für ausgewählten Button').selectOption('/happy-tune.mp3');await go(page,'Zuordnung');await expect(page.locator('.button-assignment')).toContainText('Gespeichert: Unbelegt');
 await go(page,'Zuordnung');await page.getByRole('button',{name:'Demo-Button 2',exact:true}).click();await go(page,'Zuordnung');await expect(page.getByLabel('MP3 für ausgewählten Button')).toHaveValue('');
 await go(page,'Zuordnung');await page.getByRole('button',{name:'Demo-Button 1',exact:true}).click();await go(page,'Zuordnung');await expect(page.getByLabel('MP3 für ausgewählten Button')).toHaveValue('');
 for(let id=1;id<=10;id++){
  await go(page,'Zuordnung');await page.getByRole('button',{name:`Demo-Button ${id}`,exact:true}).click();
  await expect(page.getByRole('heading',{name:`Button ${id} · MP3-Belegung`,exact:true})).toBeVisible();
  expect(await page.getByRole('button',{name:`Demo-Button ${id}`,exact:true}).evaluate(b=>getComputedStyle(b).backgroundColor)).toBe('rgb(0, 104, 197)');
  await go(page,'Zuordnung');await expect(page.getByLabel('MP3 für ausgewählten Button')).toHaveValue('');
  await go(page,'Zuordnung');await page.getByLabel('MP3 für ausgewählten Button').selectOption('/happy-tune.mp3');
  await go(page,'Zuordnung');await page.getByRole('button',{name:'Button-Belegung speichern',exact:true}).click();
  await expect(page.locator('.notice')).toContainText('Demo-Button-Belegung gespeichert');
 }
 await page.reload();
 for(let id=1;id<=10;id++){
  await go(page,'Zuordnung');await page.getByRole('button',{name:`Demo-Button ${id}`,exact:true}).click();
  await go(page,'Zuordnung');await expect(page.getByLabel('MP3 für ausgewählten Button')).toHaveValue('/happy-tune.mp3');
  await go(page,'Zuordnung');await expect(page.locator('.button-assignment')).toContainText('Gespeichert: happy-tune.mp3');
 }
 await go(page,'Zuordnung');await page.getByLabel('MP3 für ausgewählten Button').selectOption('');
 await go(page,'Zuordnung');await page.getByRole('button',{name:'Button-Belegung speichern',exact:true}).click();
 await go(page,'Zuordnung');await expect(page.locator('.button-assignment')).toContainText('Gespeichert: Unbelegt');
 await page.reload();await go(page,'Zuordnung');await page.getByRole('button',{name:'Demo-Button 10',exact:true}).click();
 await go(page,'Zuordnung');await expect(page.getByLabel('MP3 für ausgewählten Button')).toHaveValue('');
 page.once('dialog',d=>d.accept());await tools(page);await page.getByRole('button',{name:'Demo zurücksetzen'}).click();await expect(page.locator('.notice')).toContainText('Demo zurückgesetzt');await page.reload();
 for(let id=1;id<=10;id++){
  await go(page,'Zuordnung');await page.getByRole('button',{name:`Demo-Button ${id}`,exact:true}).click();
  await go(page,'Zuordnung');await expect(page.getByLabel('MP3 für ausgewählten Button')).toHaveValue('');
 }
 for(const width of [320,390,1280]){
  await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const rects=await buttons.evaluateAll(bs=>bs.map(b=>{const r=b.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};}));
  expect(rects[0].width).toBeGreaterThan(rects[4].width);expect(rects[8].width).toBeGreaterThan(rects[0].width);expect(rects[0].x).toBeLessThan(rects[4].x);expect(rects[4].x).toBeLessThan(rects[8].x);
  for(const [i,a] of rects.entries()){expect(a.width).toBeGreaterThanOrEqual(44);expect(a.height).toBeGreaterThanOrEqual(44);for(const b of rects.slice(i+1))expect(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y,`Buttons überlappen bei ${width}px`).toBe(true);}
 }
 await page.setViewportSize({width:390,height:844});
}
