import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import statusIcons from '../src/tft-status-icons.json' with {type:'json'};

test('Statussymbole bestehen nur aus portierbaren Zeichenprimitiven innerhalb 24×14 Pixeln',()=>{
 assert.equal(statusIcons.width,24);assert.equal(statusIcons.height,14);
 assert.deepEqual(statusIcons.icons.map(icon=>icon.id),['volume','wifi','battery']);
 for(const icon of statusIcons.icons){
  assert.ok(icon.label);
  for(const shape of icon.shapes){
   assert.ok(['rect','circle','polygon','polyline'].includes(shape.type));
   assert.ok(['none','ink','accent'].includes(shape.fill));
   const points=shape.points??(shape.type==='circle'?[[shape.cx-shape.r,shape.cy-shape.r],[shape.cx+shape.r,shape.cy+shape.r]]:[[shape.x,shape.y],[shape.x+shape.width,shape.y+shape.height]]);
   for(const [x,y] of points){assert.ok(x>=0&&x<=24);assert.ok(y>=0&&y<=14);}
  }
 }
});
test('TFT preview is integrated as an independent fourth app tab',()=>{
 const source=readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
 assert.match(source,/\['tft','TFT-Vorschau'\]/);
 assert.match(source,/<TftPreview\s*\/>/);
 assert.doesNotMatch(source,/%3/);
});
