import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
test('intro transfer uses upload deadline and progress, not the normal 30-second action budget',async()=>{
 const main=await fs.readFile(new URL('../src/main.jsx',import.meta.url),'utf8');
 const intro=main.match(/sendIntro=\{\(uid,blob\)=>(.*?) assignIntro=/s)?.[1];
 assert.ok(intro,'actual intro transfer callback found');
 assert.match(intro,/\{upload:\s*true\}\)\}$/);
 assert.match(main,/upload&&!demo\?3600000:30000/,'ordinary operations stay bounded');
});
test('upload progress and cancellation are global; real uploads acquire and always clean up wake lock',async()=>{
 const main=await fs.readFile(new URL('../src/main.jsx',import.meta.url),'utf8');
 const progress=main.indexOf('aria-label="Laufende Übertragung"');
 assert.ok(progress>0&&progress<main.indexOf('<nav role="tablist"'),'progress must be outside media-only panel');
 assert.equal(main.match(/aria-label="Transferfortschritt"/g)?.length,1);
 assert.match(main,/if\(upload&&!demo\)screenLease.current=keepUploadScreenAwake/);
 assert.match(main,/finally\{clearTimeout\(timer\);screenLease.current\?\.\(\)/);
 assert.match(main,/return\(\)=>\{active.current\?\.abort\(\);screenLease.current\?\.\(\)/);
 assert.equal(main.match(/>Abbrechen<\/button>/g)?.length,1,'one global cancel, including mapping tab');
});
test('UI routes real device via capabilities, explicit chooser and player, not demo gate',async()=>{const main=await fs.readFile(new URL('../src/main.jsx',import.meta.url),'utf8');assert.match(main,/new DeviceAdapter/);assert.match(main,/new BleTransport/);assert.match(main,/Gerätestatus/);assert.match(main,/Wiedergabe stoppen/);assert.match(main,/capabilities/);for(const name of ['Settings.jsx','ButtonBoard.jsx']){const s=await fs.readFile(new URL('../src/'+name,import.meta.url),'utf8');assert.ok(!s.includes('disabled={!demo||'),'device capability must not be gated by demo');}});
