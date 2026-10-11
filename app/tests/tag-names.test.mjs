import test from 'node:test';
import assert from 'node:assert/strict';

import * as names from '../src/tag-names.mjs';

test('renames by stable UID repeatedly without mutating any UID, path or other tag', () => {
  const tags = Object.freeze([
    Object.freeze({uid: 'E3:2F:F6:33', path: '/one.mp3', name: 'Tag 1'}),
    Object.freeze({uid: '01:8C:F1:6E', path: '/two.mp3', name: 'Tag 2'})
  ]);
  const renamed = names.renameTag(tags, tags[1].uid, '  Schleichstegosaurus  ');
  assert.deepEqual(renamed, [tags[0], {...tags[1], name: 'Schleichstegosaurus'}]);
  assert.notEqual(renamed, tags);
  assert.equal(tags[1].name, 'Tag 2');
  const again = names.renameTag(renamed, tags[1].uid, 'Dino 🦕');
  assert.equal(again[1].name, 'Dino 🦕');
  assert.equal(names.renameTag(again, tags[1].uid, '  ')[1].name, 'Tag 2');
  assert.throws(() => names.renameTag(tags, 'unknown', 'Dino'), /Tag.*unbekannt/);
  assert.throws(() => names.renameTag(tags, tags[0].uid, 'a'.repeat(81)), RangeError);
  assert.throws(() => names.renameTag(tags, tags[0].uid, {}), TypeError);
  assert.equal(tags[0].name, 'Tag 1');
});

test('migrates legacy tags immutably while preserving UID, path and extra fields', () => {
  const tags = Object.freeze([
    Object.freeze({uid: 'E3:2F:F6:33', path: '/arcade-music-loop.mp3', extra: 42}),
    Object.freeze({uid: '01:8C:F1:6E', path: '/happy-tune.mp3'})
  ]);
  const migrated = names.migrateTagNames(tags);
  assert.deepEqual(migrated, tags.map((tag, i) => ({...tag, name: `Tag ${i + 1}`})));
  assert.notEqual(migrated, tags);
  assert.notEqual(migrated[0], tags[0]);
  assert.equal(tags[0].name, undefined);
  assert.deepEqual(names.migrateTagNames(migrated), migrated);
  assert.deepEqual(names.migrateTagNames([{...tags[0], name: '  Dino 🦕  '}]),
    [{...tags[0], name: 'Dino 🦕'}]);
  assert.deepEqual(names.migrateTagNames([]), []);
});

test('rejects non-string labels and invalid positional default indexes explicitly', () => {
  for (const input of [false, 7, {}, [], {trim: () => 'fake'}]) {
    assert.throws(() => names.normalizeTagName(input), /Tag-Name muss/);
  }
  for (const index of [-1, 0.5, '1', null, Infinity]) {
    assert.throws(() => names.normalizeTagName('', index), /Tag-Index/);
  }
});

test('enforces an explicit 80 Unicode-code-point UI limit after normalization', () => {
  assert.equal(names.MAX_TAG_NAME_LENGTH, 80);
  assert.equal(names.normalizeTagName('🦕'.repeat(80)), '🦕'.repeat(80));
  assert.equal(names.normalizeTagName('  ' + 'e\u0301'.repeat(80) + '  '), 'é'.repeat(80));
  assert.throws(() => names.normalizeTagName('🦕'.repeat(81)), RangeError);
  assert.throws(() => names.normalizeTagName('a'.repeat(81)), /80/);
});

test('normalizes Unicode names without restricting them to MP3 filename rules', () => {
  assert.equal(typeof names.normalizeTagName, 'function');
  assert.equal(names.normalizeTagName('  Schleichstegosaurus  '), 'Schleichstegosaurus');
  assert.equal(names.normalizeTagName('\tDino 🦕 / 音楽\n'), 'Dino 🦕 / 音楽');
  assert.equal(names.normalizeTagName('Cafe\u0301'), 'Café');
  assert.equal(names.normalizeTagName('Dino   Musik'), 'Dino   Musik');
});

test('empty or absent labels reset to the positional default', () => {
  for (const input of ['', ' \t\n ', undefined, null]) {
    assert.equal(names.normalizeTagName(input), 'Tag 1');
    assert.equal(names.normalizeTagName(input, 1), 'Tag 2');
  }
});
