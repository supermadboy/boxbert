// Regression: a real installed V1 service worker must not feed V1 WASM to V2 JS.
import {chromium,expect} from '@playwright/test';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const repo=process.env.AI_HABIBI_REPO||'/srv/ai-habibi',revision='ebaa4ec',prefix='sites/boxbert/dist/';
const files=execFileSync('git',['ls-tree','-r','--name-only',revision,prefix],{cwd:repo,encoding:'utf8'}).trim().split('\n');
const legacy=new Map(files.map(file=>['/boxbert/'+file.slice(prefix.length),execFileSync('git',['show',`${revision}:${file}`],{cwd:repo})]));
let current=false;
const mime=file=>file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.wasm')?'application/wasm':file.endsWith('.json')||file.endsWith('.webmanifest')?'application/json':file.endsWith('.html')||file.endsWith('/')?'text/html':'application/octet-stream';
const server=createServer(async(req,res)=>{
 try{
  const pathname=new URL(req.url,'http://localhost').pathname;
  let key=pathname==='/boxbert/'?'/boxbert/index.html':pathname;
  if(!key.startsWith('/boxbert/')||key.includes('..')){res.writeHead(404).end();return;}
  // Keep the real old worker installed, just as in an already-open offline PWA.
  const data=!current||pathname==='/boxbert/sw.js'?legacy.get(key):await readFile(path.join('dist',key.slice('/boxbert/'.length)));
  if(!data){res.writeHead(404).end();return;}
  res.writeHead(200,{'Content-Type':mime(pathname),'Cache-Control':'no-store'}).end(data);
 }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}/boxbert/`;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext(),old=await context.newPage();
 await old.goto(base);
 await old.evaluate(async()=>{await navigator.serviceWorker.register('/boxbert/sw.js',{scope:'/boxbert/'});await navigator.serviceWorker.ready;});
 await old.reload();
 expect(await old.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 const saved=await old.evaluate(()=>{localStorage.setItem('boxbert-update-regression','must-survive');return JSON.stringify({...localStorage});});
 current=true;
 const page=await context.newPage();await page.goto(base+'?stand=tft-v2-cachefix-12');
 expect(await page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await page.getByRole('tab',{name:'TFT-Vorschau',exact:true}).click();
 const canvas=page.locator('.tft-screen canvas');
 await expect(canvas).toHaveAttribute('data-mode','v2');
 await expect(page.getByText(/tft_set_asset is not a function/)).toHaveCount(0);
 expect(await page.evaluate(()=>JSON.stringify({...localStorage}))).toBe(saved);
 await context.close();
 console.log('PASS real V1 offline worker + new V2 document: V2 sprite ready, no mixed WASM, browser data preserved');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
