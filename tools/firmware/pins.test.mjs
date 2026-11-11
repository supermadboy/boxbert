import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const config = readFileSync(new URL('../../firmware/Config.h', import.meta.url), 'utf8');
const pin = name => {
  const match = config.match(new RegExp(`\\b${name}\\s*=\\s*(\\d+)\\b`));
  assert.ok(match, `Missing pin: ${name}`);
  return Number(match[1]);
};
const array = name => {
  const match = config.match(new RegExp(`\\b${name}\\[\\d+\\]=\\{([^}]+)\\}`));
  assert.ok(match, `Missing array: ${name}`);
  return match[1].split(',').map(Number);
};
test('Measured encoder switch IO5, toggle IO11, NFC IRQ reserved IO12', () => {
  assert.equal(pin('EncoderSwitch'),5);assert.equal(pin('ToggleTwo'),11);assert.equal(pin('ReservedNfcIrq'),12);
});
test('Measured SD/audio and planned boost/stick pins remain distinct', () => {
  assert.equal(pin('BoostEn'),9);assert.equal(pin('Stick'),10);assert.equal(pin('SdCs'),8);
  assert.equal(pin('AudioData'),16);assert.equal(pin('AudioBclk'),17);assert.equal(pin('AudioLrc'),18);
});
test('All ten measured arcade inputs, schematic top row then bottom row', () => {
  assert.deepEqual(array('ButtonGpio'),[255,255,255,255,255,255,255,255,6,255]);
  assert.deepEqual(array('ButtonAw'),[12,6,7,8,5,9,10,0,255,11]);
});
test('Unknown yellow mini disabled; green P17 and red P15', () => {
  assert.deepEqual(array('MiniAw'),[255,15,13]);
  const ports=[...array('ButtonAw'),...array('MiniAw')].filter(p=>p!==255);
  assert.equal(new Set(ports).size,ports.length);
});
