import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {execFileSync} from 'node:child_process';
test('Zwei Builds: Hosted PWA hat Scope/Offline-Assets; SD relative Assets ohne SW',async()=>{
 execFileSync(process.execPath,['build.mjs'],{stdio:'pipe'});
 const hosted=await fs.readFile('dist/index.html','utf8'),sd=await fs.readFile('dist-sd/index.html','utf8');
 assert.match(hosted,/\/boxbert\/assets\//);assert.match(sd,/\.\/assets\//);assert.doesNotMatch(sd,/\/boxbert\//);
 const manifest=JSON.parse(await fs.readFile('dist/manifest.webmanifest','utf8'));assert.equal(manifest.scope,'/boxbert/');assert.equal(manifest.start_url,'/boxbert/');assert.equal(manifest.display,'standalone');assert.ok(manifest.icons.some(i=>i.sizes==='192x192'));assert.ok(manifest.icons.some(i=>i.sizes==='512x512'));
 const sw=await fs.readFile('dist/sw.js','utf8');assert.ok(JSON.parse(/SHELL=(\[[^;]+\])/.exec(sw)[1]).includes('/boxbert/'),'Start-URL muss im Shell-Cache enthalten sein');assert.match(sw,/boxbert-shell-/);assert.match(sw,/assets\//);assert.match(sw,/same-origin/);assert.match(sw,/GET/);
 const shell=JSON.parse(/SHELL=(\[[^;]+\])/.exec(sw)[1]);for(const asset of await fs.readdir('dist/assets'))assert.ok(shell.includes('/boxbert/assets/'+asset),'Neues Asset muss offline gecacht sein: '+asset);
 const assets=await fs.readdir('dist/assets');
 const wasmNames=assets.filter(x=>/^tft-renderer-[\w-]+\.wasm$/.test(x)),frameNames=assets.filter(x=>/^boxbert-[\w-]+\.rgb565$/.test(x));
 assert.equal(wasmNames.length,1,'one fingerprinted renderer');assert.equal(frameNames.length,1,'one fingerprinted frame package');
 const wasm=await fs.readFile('dist/assets/'+wasmNames[0]);assert.equal(WebAssembly.validate(wasm),true);
 assert.deepEqual(wasm,await fs.readFile('../tools/tft/build/tft-renderer.wasm'));
 assert.deepEqual(await fs.readFile('dist-sd/assets/'+wasmNames[0]),wasm,'Hosted and SD same renderer');
 const frames=await fs.readFile('../assets/tft/boxbert/boxbert.rgb565');
 assert.deepEqual(await fs.readFile('dist/assets/'+frameNames[0]),frames,'Hosted ships exact device frames');
 assert.deepEqual(await fs.readFile('dist-sd/assets/'+frameNames[0]),frames,'SD ships exact device frames');
 for(const name of [wasmNames[0],frameNames[0]])assert.ok(shell.includes('/boxbert/assets/'+name),'fingerprinted binary cached offline');
 for(const name of ['tft-renderer.wasm','boxbert.rgb565'])await assert.rejects(fs.access('dist/'+name),'obsolete stable binary absent');
 for(const out of ['dist','dist-sd']){
  const notice=await fs.readFile(out+'/third-party-mp3.txt','utf8');assert.match(notice,/@breezystack\/lamejs 1\.2\.7/);assert.match(notice,/1fb0ef5fa177413107e2e107d054a9b994e3f79c/);assert.match(notice,/GNU LESSER GENERAL PUBLIC LICENSE/);assert.match(notice,/GNU GENERAL PUBLIC LICENSE/);
 }
 assert.ok(shell.includes('/boxbert/third-party-mp3.txt'),'license and source notice available offline');
 const pkg=JSON.parse(await fs.readFile('package.json','utf8')),lock=JSON.parse(await fs.readFile('package-lock.json','utf8'));assert.equal(pkg.dependencies['@breezystack/lamejs'],'1.2.7');assert.equal(lock.packages[''].dependencies['@breezystack/lamejs'],'1.2.7');
 await assert.rejects(fs.access('dist-sd/sw.js'));
});
