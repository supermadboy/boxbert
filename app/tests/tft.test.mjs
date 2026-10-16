import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('TFT preview is integrated as an independent fourth app tab',()=>{
 const source=readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
 assert.match(source,/\['tft','TFT-Vorschau'\]/);
 assert.match(source,/<TftPreview\s*\/>/);
 assert.doesNotMatch(source,/%3/);
});
