import {build} from 'vite';
import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
// Build the same C++ core used by the native pixel tests, not a JS reimplementation.
execFileSync(process.execPath,[new URL('../tools/tft/build.mjs',import.meta.url).pathname],{stdio:'inherit'});
// Vite imports fingerprint both binaries. Remove only obsolete generated public copies.
await fs.rm('public/tft-renderer.wasm',{force:true});
await fs.rm('public/boxbert.rgb565',{force:true});
for(const [target,base,outDir] of [['hosted','/boxbert/','dist'],['sd','./','dist-sd']]){
 await build({base,define:{'import.meta.env.VITE_TARGET':JSON.stringify(target)},build:{outDir,emptyOutDir:true},plugins:[{name:'manifest-link',transformIndexHtml(html){return target==='hosted'?html.replace('</head>',`<link rel="manifest" href="${base}manifest.webmanifest"></head>`):html;}}]});
 if(target==='sd')continue;
 const manifest={id:base,name:'Boxbert Verwaltung',short_name:'Boxbert',description:'Eigene MP3 und RFID-Zuordnungen verwalten. Demo ohne Gerät.',lang:'de',start_url:base,scope:base,display:'standalone',background_color:'#f6f5f4',theme_color:'#f6f5f4',icons:[192,512].map(size=>({src:`icon-${size}.png`,sizes:`${size}x${size}`,type:'image/png',purpose:'any maskable'}))};
 await fs.writeFile(path.join(outDir,'manifest.webmanifest'),JSON.stringify(manifest,null,2));
 async function list(dir){const items=await fs.readdir(dir,{withFileTypes:true});return(await Promise.all(items.map(async i=>i.isDirectory()?list(path.join(dir,i.name)):path.join(dir,i.name)))).flat();}
 const files=(await list(outDir)).sort();
 const shell=[base,...files.map(f=>base+path.relative(outDir,f))];
 const hash=createHash('sha256').update(JSON.stringify(shell));for(const f of files)hash.update(await fs.readFile(f));const revision=hash.digest('hex').slice(0,16);
 await fs.writeFile(path.join(outDir,'sw.js'),`// Generated shell-only cache. Never caches device APIs, passwords or uploads.
const CACHE='boxbert-shell-${revision}', SHELL=${JSON.stringify(shell)}, PREFIX='boxbert-shell-';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==self.location.origin||!SHELL.includes(url.pathname)||url.search)return;
e.respondWith(caches.open(CACHE).then(async c=>{const cached=await c.match(e.request);return cached||fetch(e.request,{credentials:'same-origin'});}));});
`);
}
