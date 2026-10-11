import test from 'node:test';
import assert from 'node:assert/strict';
import { migrateLedSettings, validateLedSettings, sampleLedFrame } from '../src/led-effects.mjs';

const settings = (overrides = {}) => ({ color: '#dd5b00', brightness: 20, palette: 'solid', effect: 'statisch', ...overrides });

test('static frames preserve the solid color and normalize brightness for one/eight pixels', () => {
  for (const count of [1, 8]) {
    assert.deepEqual(sampleLedFrame(settings(), count, 0), Array.from({ length: count }, () => ({ color: '#dd5b00', opacity: 0.2 })));
    assert.deepEqual(sampleLedFrame(settings(), count, 0), sampleLedFrame(settings(), count, 9000));
  }
});

test('off and zero brightness never light a pixel', () => {
  for (const count of [1, 8]) for (const config of [settings({ effect: 'aus' }), settings({ brightness: 0 })]) {
    assert.ok(sampleLedFrame(config, count, 1200).every(pixel => pixel.opacity === 0));
  }
});

test('sampling rejects malformed settings, count, time and single-pixel directional effects', () => {
  for (const count of [0, -1, 1.5, NaN, Infinity, '8']) assert.throws(() => sampleLedFrame(settings(), count, 0), TypeError);
  for (const time of [-1, NaN, Infinity, '0', undefined]) assert.throws(() => sampleLedFrame(settings(), 8, time), TypeError);
  assert.throws(() => sampleLedFrame(settings({ palette: 'invalid' }), 8, 0), TypeError);
  assert.throws(() => sampleLedFrame(settings({ effect: 'links-rechts' }), 1, 0), TypeError);
});

test('rainbow palette stays independent of each stick effect', () => {
  for (const effect of ['statisch', 'atmen', 'links-rechts', 'rechts-links', 'mitte-aussen', 'party']) {
    const solid = sampleLedFrame(settings({ effect }), 8, 1200);
    const rainbow = sampleLedFrame(settings({ effect, palette: 'rainbow' }), 8, 1200);
    assert.deepEqual(rainbow.map(p => p.opacity), solid.map(p => p.opacity));
    assert.ok(new Set(rainbow.map(p => p.color)).size > 1, effect);
    assert.ok(solid.every(p => p.color === '#dd5b00'), effect);
  }
  const rainbow = settings({ palette: 'rainbow' });
  assert.deepEqual(sampleLedFrame(rainbow, 8, 0), sampleLedFrame(rainbow, 8, 9000));
  assert.deepEqual(sampleLedFrame(rainbow, 1, 0), [{ color: '#ff0000', opacity: 0.2 }]);
});

const brightest = frame => frame.reduce((indices, pixel, index) => {
  const max = Math.max(...frame.map(p => p.opacity));
  return Math.abs(pixel.opacity - max) < 1e-12 ? [...indices, index] : indices;
}, []);

test('directional highlights progress left/right and start centered for an even count', () => {
  for (const palette of ['solid', 'rainbow']) {
    const frame = (effect, time, count = 8) => sampleLedFrame(settings({ effect, palette }), count, time);
    assert.deepEqual(brightest(frame('links-rechts', 0)), [0]);
    assert.deepEqual(brightest(frame('links-rechts', 2000)), [4]);
    assert.deepEqual(brightest(frame('rechts-links', 0)), [7]);
    assert.deepEqual(brightest(frame('rechts-links', 2000)), [3]);
    assert.deepEqual(brightest(frame('mitte-aussen', 0)), [3, 4]);
    assert.deepEqual(brightest(frame('mitte-aussen', 2000)), [1, 6]);
    assert.deepEqual(brightest(frame('mitte-aussen', 3000)), [0, 7]);
    assert.deepEqual(brightest(frame('mitte-aussen', 0, 7)), [3]);
  }
});

test('breathing is a slow four-second cycle and respects chosen palette/brightness', () => {
  for (const count of [1, 8]) for (const palette of ['solid', 'rainbow']) {
    const config = settings({ effect: 'atmen', palette, brightness: 40 });
    assert.equal(sampleLedFrame(config, count, 0)[0].opacity, 0.4);
    assert.ok(sampleLedFrame(config, count, 2000)[0].opacity < 0.15);
    assert.deepEqual(sampleLedFrame(config, count, 0), sampleLedFrame(config, count, 4000));
  }
});

test('soft party varies gently without hard flashing or rapid transitions', () => {
  for (const count of [1, 8]) for (const palette of ['solid', 'rainbow']) {
    const config = settings({ effect: 'party', palette, brightness: 100 });
    assert.notDeepEqual(sampleLedFrame(config, count, 0), sampleLedFrame(config, count, 1700));
    for (let time = 0; time < 12000; time += 25) {
      const current = sampleLedFrame(config, count, time);
      const next = sampleLedFrame(config, count, time + 25);
      current.forEach((pixel, index) => {
        assert.ok(pixel.opacity >= 0.2 && pixel.opacity <= 1);
        assert.ok(Math.abs(pixel.opacity - next[index].opacity) < 0.025);
      });
    }
  }
});

test('board color cycling changes color slowly while candle changes light level', () => {
  for (const palette of ['solid', 'rainbow']) {
    const cycle = settings({ effect: 'farbwechsel', palette });
    assert.equal(validateLedSettings(cycle, 'board'), true);
    assert.equal(validateLedSettings(cycle, 'stick'), false);
    const start = sampleLedFrame(cycle, 1, 0)[0];
    const later = sampleLedFrame(cycle, 1, 4000)[0];
    assert.notEqual(start.color, later.color);
    assert.equal(start.opacity, later.opacity);
    assert.deepEqual(sampleLedFrame(cycle, 1, 0), sampleLedFrame(cycle, 1, 12000));
    const candle = settings({ effect: 'kerze', palette });
    assert.equal(validateLedSettings(candle, 'board'), true);
    const flame = sampleLedFrame(candle, 1, 0)[0];
    const changed = sampleLedFrame(candle, 1, 750)[0];
    assert.equal(flame.color, changed.color);
    assert.notEqual(flame.opacity, changed.opacity);
    assert.throws(() => sampleLedFrame(candle, 8, 0), TypeError);
  }
  assert.equal(sampleLedFrame(settings({ effect: 'farbwechsel' }), 1, 0)[0].color, '#dd5b00');
  for (const effect of ['links-rechts', 'rechts-links', 'mitte-aussen']) {
    assert.equal(validateLedSettings(settings({ effect }), 'board'), false);
  }
});

test('all frames are deterministic, bounded, fresh and do not mutate frozen inputs', () => {
  for (const count of [1, 8]) for (const palette of ['solid', 'rainbow']) {
    const effects = count === 1 ? ['aus', 'statisch', 'atmen', 'party', 'farbwechsel', 'kerze'] : ['aus', 'statisch', 'atmen', 'party', 'links-rechts', 'rechts-links', 'mitte-aussen'];
    for (const effect of effects) {
      const config = Object.freeze(settings({ effect, palette, brightness: 73 }));
      const before = JSON.stringify(config);
      for (const time of [0, 25, 1999, 3999, 4000, 123456789]) {
        const frame = sampleLedFrame(config, count, time);
        assert.deepEqual(frame, sampleLedFrame(config, count, time));
        assert.equal(frame.length, count);
        frame.forEach(pixel => {
          assert.match(pixel.color, /^#[a-f\d]{6}$/i);
          assert.ok(Number.isFinite(pixel.opacity) && pixel.opacity >= 0 && pixel.opacity <= 0.73);
        });
        frame[0].opacity = -999;
        assert.ok(sampleLedFrame(config, count, time)[0].opacity >= 0);
        assert.ok(sampleLedFrame({ ...config, brightness: 0 }, count, time).every(p => p.opacity === 0));
      }
      assert.equal(JSON.stringify(config), before);
    }
  }
});

test('legacy migration preserves color/brightness and separates rainbow from static', () => {
  const old = Object.freeze({ color: '#AAbB00', brightness: 37, effect: 'regenbogen' });
  assert.deepEqual(migrateLedSettings(old, 'stick'), { ...old, palette: 'rainbow', effect: 'statisch' });
  for (const effect of ['aus', 'statisch', 'atmen']) {
    assert.deepEqual(migrateLedSettings({ ...old, effect }, 'board'), { ...old, effect, palette: 'solid' });
  }
  assert.deepEqual(migrateLedSettings(settings()), settings());
  assert.notEqual(migrateLedSettings(settings()), settings());
});

test('validation rejects invalid or unknown settings without silently resetting them', () => {
  assert.equal(validateLedSettings(settings()), true);
  for (const bad of [null, [], {}, settings({ color: 'red' }), settings({ brightness: -1 }), settings({ brightness: 101 }), settings({ brightness: 1.5 }), settings({ brightness: '20' }), settings({ brightness: NaN }), settings({ palette: 'mystery' }), settings({ effect: 'strobe' })]) {
    assert.equal(validateLedSettings(bad), false);
    assert.throws(() => migrateLedSettings(bad), TypeError);
  }
  assert.equal(validateLedSettings(settings(), 'unknown'), false);
  assert.throws(() => migrateLedSettings(settings(), 'unknown'), TypeError);
});
