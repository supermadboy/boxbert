// Final read-back: reject stale sources, missing images and CGAL warnings.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('.',import.meta.url)));
const hash=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const results=JSON.parse(fs.readFileSync('logs/revision/results.json'));
for(const [path,expected] of Object.entries(results.sources))assert.equal(hash(path),expected,`stale result: ${path}`);
const summary={passed:results.tests.filter(t=>t.pass===true).length,failed:results.tests.filter(t=>t.pass===false).length,open:results.tests.filter(t=>t.pass===null).length,release:false};
assert.deepEqual(summary,results.summary);
assert.deepEqual(summary,{passed:47,failed:0,open:1,release:false});
assert.equal(results.tests.find(t=>t.pass===null).scene,'heads_tolerance');
const pngs=['iso','iso-board','top-board','side-board','seated-inside','height-side','exploded'];
const images=Object.fromEntries(pngs.map(name=>{
 const path=`${name}.png`, b=fs.readFileSync(path);
 assert.equal(b.subarray(1,4).toString(),'PNG',path);
 assert.equal(b.readUInt32BE(16),1200,path);assert.equal(b.readUInt32BE(20),950,path);
 return [path,hash(path)];
}));
const logs=fs.readdirSync('logs/revision').filter(p=>p.endsWith('.log'));
const problems=logs.flatMap(path=>fs.readFileSync(`logs/revision/${path}`,'utf8').split('\n').filter(line=>/WARNING:|ERROR:|^FAIL /.test(line)).map(line=>({path,line})));
assert.deepEqual(problems,[],'inspect raw CAD warnings; zero signed volume alone is insufficient');
const audit={generated_at:new Date().toISOString(),summary,sourceHashesVerified:true,logsScanned:logs.length,rawLogProblems:problems,images};
fs.writeFileSync('logs/revision/audit.json',JSON.stringify(audit,null,2)+'\n');
console.log('AUDIT',JSON.stringify(audit));
