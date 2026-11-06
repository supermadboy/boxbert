import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const config = readFileSync(new URL('../../firmware/Config.h', import.meta.url), 'utf8');
const pin = name => {
  const match = config.match(new RegExp(`\\b${name}\\s*=\\s*(\\d+)\\b`));
  assert.ok(match, `Missing pin: ${name}`);
  return Number(match[1]);
};

test('Encoder-Taster nutzt IO11, PN532-IRQ reserviert IO12', () => {
  assert.equal(pin('EncoderSwitch'), 11);
  assert.equal(pin('ReservedNfcIrq'), 12);
});

test('Boost-Enable bleibt auf IO9', () => {
  assert.equal(pin('BoostEn'), 9);
});
