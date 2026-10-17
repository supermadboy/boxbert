import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {frame} from './render.mjs';
const {states,timesMs}=JSON.parse(readFileSync('firmware/ui/fixtures/states.json'));
const actual={};
for(const s of states)for(const timeMs of timesMs){
 const bytes=frame(s.figure,s.title,s.playback,s.elapsedSeconds,s.durationSeconds,s.volume,s.batteryPercent,s.charging,s.wifi,timeMs,s.scrollOverride);
 actual[`${s.name}@${timeMs}`]=createHash('sha256').update(bytes).digest('hex');
}
const path='firmware/ui/fixtures/golden-sha256.json';
if(process.argv.includes('--update-goldens')){writeFileSync(path,JSON.stringify(actual,null,2)+'\n');console.log('WROTE reviewed golden hashes');}
else assert.deepEqual(actual,JSON.parse(readFileSync(path)),'RGB565 golden hashes (update only after visual review)');
console.log(`PASS ${states.length} fixtures x ${timesMs.length} fixed times = ${Object.keys(actual).length} exact native/WASM RGB565 comparisons + golden SHA256`);
