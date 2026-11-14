import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const read=p=>fs.readFile(new URL('../../'+p,import.meta.url),'utf8');
test('explicit USB demonstration setup fails closed and changes only two paths and quiet volume',async()=>{
 const source=await read('firmware/boxbert/Transport.h');
 const block=source.split('if(command==D::DemoSongs){')[1]?.split('if(command==D::NfcPause)')[0];
 assert.ok(block);assert.match(block,/!rpc\.hw\.sd\|\|!rpc\.store\.ready\|\|rpc\.store\.damaged\|\|rpc\.progress\.active/);
 assert.match(block,/!rpc\.hw\.exists\("\/arcade-music-loop\.mp3"\)\|\|!rpc\.hw\.exists\("\/happy-tune\.mp3"\)/);
 assert.match(block,/next\.set\(rpc\.store\.data\)/);
 assert.deepEqual(block.match(/next\[[^\n]+=/g),['next["tags"][0]["path"]=','next["tags"][1]["path"]=','next["volume"]=']);
 assert.equal(block.match(/rpc\.store\.save\(next\)/g)?.length,1);
 assert.ok(!block.includes('defaults('));assert.ok(!block.includes('SD.remove'));
 assert.match(block,/rpc\.hw\.audio\.setVolume\(1\);\+\+rpc\.volumeRevision/);
});
test('demonstration setup is an explicit local command, never an automatic boot migration',async()=>{
 const parser=await read('firmware/boxbert/IntegratedState.h');
 assert.match(parser,/!std::strcmp\(line,"demo-songs"\)/);
 const main=await read('firmware/boxbert/boxbert.ino');assert.ok(!main.includes('DemoSongs'));assert.ok(!main.includes('demo-songs'));
 const tool=await read('tools/firmware/usb-diagnostics.py');assert.ok(tool.includes("'demo-songs'"));
});
