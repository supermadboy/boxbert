export async function tools(page){if(!await page.locator('.connection').evaluate(el=>el.open))await page.locator('.connection summary').click();}
export async function go(page,name){await page.getByRole('tab',{name,exact:true}).click();}
