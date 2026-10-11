import {go} from './navigation.mjs';
import {expect} from '@playwright/test';
export async function checkRainbow(page){
 await go(page,'LEDs');await page.getByLabel('Palette',{exact:true}).selectOption('solid');await page.getByLabel('Farbe',{exact:true}).fill('#123456');
 await page.getByLabel('Effekt',{exact:true}).selectOption('statisch');await page.getByLabel('Palette',{exact:true}).selectOption('rainbow');
 await page.getByLabel('Helligkeit (%)',{exact:true}).fill('60');
 const preview=page.locator('.pixel-preview span');await expect(preview).toHaveCount(8);
 const colors=await preview.evaluateAll(ps=>ps.map(p=>getComputedStyle(p).backgroundColor));expect(new Set(colors).size).toBe(8);
 expect(await preview.first().evaluate(p=>getComputedStyle(p).opacity)).toBe('0.6');await expect(page.getByLabel('Farbe',{exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Einstellungen speichern',exact:true}).click();await expect(page.locator('.notice')).toContainText('gespeichert');
 await page.reload();await go(page,'LEDs');await expect(page.getByLabel('Palette',{exact:true})).toHaveValue('rainbow');await expect(page.getByLabel('Effekt',{exact:true})).toHaveValue('statisch');await expect(page.getByLabel('Farbe',{exact:true})).toHaveValue('#123456');
 await page.getByLabel('Helligkeit (%)',{exact:true}).fill('0');expect(await preview.first().evaluate(p=>getComputedStyle(p).opacity)).toBe('0');
 await page.getByLabel('Palette',{exact:true}).selectOption('solid');expect(await preview.first().evaluate(p=>getComputedStyle(p).backgroundColor)).toBe('rgb(18, 52, 86)');
 await page.getByLabel('Palette',{exact:true}).selectOption('rainbow');await page.getByLabel('Helligkeit (%)',{exact:true}).fill('60');
 await page.getByRole('button',{name:'Einstellungen speichern',exact:true}).click();await expect(page.locator('.notice')).toContainText('gespeichert');
}
