import {expect} from '@playwright/test';
export async function checkRainbow(page){
 await page.getByLabel('Farbe',{exact:true}).fill('#123456');
 await page.getByLabel('Verhalten').selectOption('regenbogen');
 await page.getByLabel('Helligkeit (%)').fill('60');
 const preview=page.locator('.pixel-preview span');await expect(preview).toHaveCount(8);
 const colors=await preview.evaluateAll(ps=>ps.map(p=>getComputedStyle(p).backgroundColor));expect(new Set(colors).size).toBe(8);
 expect(await preview.first().evaluate(p=>getComputedStyle(p).opacity)).toBe('0.6');
 await page.getByRole('button',{name:'Einstellungen speichern'}).click();await expect(page.locator('.notice')).toContainText('gespeichert');
 await page.reload();await expect(page.getByLabel('Verhalten')).toHaveValue('regenbogen');await expect(page.getByLabel('Farbe',{exact:true})).toHaveValue('#123456');
 await page.getByLabel('Helligkeit (%)').fill('0');expect(await preview.first().evaluate(p=>getComputedStyle(p).opacity)).toBe('0');
 await page.getByLabel('Verhalten').selectOption('statisch');expect(await preview.first().evaluate(p=>getComputedStyle(p).backgroundColor)).toBe('rgb(18, 52, 86)');
 await page.getByLabel('Verhalten').selectOption('regenbogen');await page.getByLabel('Helligkeit (%)').fill('60');
 await page.getByRole('button',{name:'Einstellungen speichern'}).click();await expect(page.locator('.notice')).toContainText('gespeichert');
}
