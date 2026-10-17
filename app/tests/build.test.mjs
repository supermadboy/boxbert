import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {execFileSync} from 'node:child_process';
test('Zwei Builds: Hosted PWA hat Scope/Offline-Assets; SD relative Assets ohne SW',async()=>{
 execFileSync(process.execPath,['build.mjs'],{stdio:'pipe'});
 const hosted=await fs.readFile('dist/index.html','utf8'),sd=await fs.readFile('dist-sd/index.html','utf8');
 assert.match(hosted,/\/boxbert\/assets\//);assert.match(sd,/\.\/assets\//);assert.doesNotMatch(sd,/\/boxbert\//);
 const manifest=JSON.parse(await fs.readFile('dist/manifest.webmanifest','utf8'));assert.equal(manifest.scope,'/boxbert/');assert.equal(manifest.start_url,'/boxbert/');assert.equal(manifest.display,'standalone');assert.ok(manifest.icons.some(i=>i.sizes==='192x192'));assert.ok(manifest.icons.some(i=>i.sizes==='512x512'));
 const sw=await fs.readFile('dist/sw.js','utf8');assert.ok(JSON.parse(/SHELL=(\[[^;]+\])/.exec(sw)[1]).includes('/boxbert/'),'Start-URL muss im Shell-Cache enthalten sein');assert.match(sw,/boxbert-shell-/);assert.match(sw,/assets\//);assert.match(sw,/same-origin/);assert.match(sw,/GET/);
 const shell=JSON.parse(/SHELL=(\[[^;]+\])/.exec(sw)[1]);for(const asset of await fs.readdir('dist/assets'))assert.ok(shell.includes('/boxbert/assets/'+asset),'Neues Asset muss offline gecacht sein: '+asset);
 const wasm=await fs.readFile('dist/tft-renderer.wasm');assert.equal(WebAssembly.validate(wasm),true,'echtes WASM muss ausgeliefert werden');
 assert.ok(shell.includes('/boxbert/tft-renderer.wasm'),'Renderer muss offline gecacht sein');
 assert.deepEqual(await fs.readFile('dist-sd/tft-renderer.wasm'),wasm,'Hosted und SD verwenden denselben Renderer');
 await assert.rejects(fs.access('dist-sd/sw.js'));
});
