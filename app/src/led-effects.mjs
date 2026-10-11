const STICK_EFFECTS = ['aus', 'statisch', 'atmen', 'links-rechts', 'rechts-links', 'mitte-aussen', 'party'];
const BOARD_EFFECTS = ['aus', 'statisch', 'atmen', 'party', 'farbwechsel', 'kerze'];

/** Canonical schema: {color:'#rrggbb', brightness:0..100 integer,
 * palette:'solid'|'rainbow', effect}. Channel is 'stick' (default) or 'board'.
 * Returns a boolean; migration and sampling throw TypeError on invalid input.
 */
export function validateLedSettings(settings, channel = 'stick') {
  const effects = channel === 'stick' ? STICK_EFFECTS : channel === 'board' ? BOARD_EFFECTS : [];
  return Boolean(settings && typeof settings === 'object' && !Array.isArray(settings)
    && typeof settings.color === 'string' && /^#[a-f\d]{6}$/i.test(settings.color)
    && Number.isInteger(settings.brightness) && settings.brightness >= 0 && settings.brightness <= 100
    && ['solid', 'rainbow'].includes(settings.palette) && effects.includes(settings.effect));
}

/** Non-mutating migration of legacy effect='regenbogen' into rainbow + static.
 * Missing palette is the only default; malformed values are never reset.
 */
export function migrateLedSettings(settings, channel = 'stick') {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new TypeError('Invalid LED settings');
  const migrated = { ...settings, palette: settings.palette === undefined ? 'solid' : settings.palette };
  if (settings.effect === 'regenbogen' && settings.palette === undefined) {
    migrated.palette = 'rainbow';
    migrated.effect = 'statisch';
  }
  if (!validateLedSettings(migrated, channel)) throw new TypeError('Invalid LED settings or channel');
  return migrated;
}

/** Sample canonical settings only. A single pixel uses board effects; multi-pixel
 * frames use stick effects. Returns fresh CSS-friendly {color, opacity} pixels.
 * No DOM, timers, clock, random generator or input mutation. The UI owns its
 * animation clock and reduced-motion handling. This preview is neither hardware
 * validation nor an acoustic/child-safety certification.
 */
export function sampleLedFrame(settings, count, timeMs) {
  if (!Number.isSafeInteger(count) || count < 1 || !Number.isFinite(timeMs) || timeMs < 0
    || !validateLedSettings(settings, count === 1 ? 'board' : 'stick')) {
    throw new TypeError('Invalid LED settings, pixel count or time');
  }
  return Array.from({ length: count }, (_, index) => ({
    color: frameColor(settings, index, count, timeMs),
    opacity: settings.brightness / 100 * effectLevel(settings.effect, index, count, timeMs),
  }));
}

// Full-saturation RGB wheel, serialized as portable CSS hex (no browser needed).
function rainbowColor(turn) {
  const sector = ((turn % 1) + 1) % 1 * 6;
  const rising = sector % 1;
  const falling = 1 - rising;
  const rgb = [[1, rising, 0], [falling, 1, 0], [0, 1, rising],
    [0, falling, 1], [rising, 0, 1], [1, 0, falling]][Math.floor(sector)];
  return '#' + rgb.map(value => Math.round(value * 255).toString(16).padStart(2, '0')).join('');
}

function frameColor(settings, index, count, timeMs) {
  const cycle = settings.effect === 'farbwechsel' ? (timeMs % 12000) / 12000 : 0;
  if (settings.palette === 'rainbow') return rainbowColor(index / count + cycle);
  if (settings.effect !== 'farbwechsel' || cycle === 0) return settings.color;
  // Slowly rotate RGB channels, retaining the chosen color at the cycle origin.
  const rgb = settings.color.slice(1).match(/../g).map(hex => parseInt(hex, 16));
  const stops = [rgb, [rgb[2], rgb[0], rgb[1]], [rgb[1], rgb[2], rgb[0]], rgb];
  const segment = cycle * 3;
  const start = Math.floor(segment);
  const fraction = segment - start;
  return '#' + stops[start].map((value, component) =>
    Math.round(value + (stops[start + 1][component] - value) * fraction).toString(16).padStart(2, '0')).join('');
}

function effectLevel(effect, index, count, timeMs) {
  const phase = (timeMs % 4000) / 4000;
  if (effect === 'aus') return 0;
  // Soft party: staggered smooth glints (3.6 s cycle), never a hard on/off
  // strobe. Deliberately no claim of photosensitivity/child-safety validation.
  if (effect === 'party') {
    const wave = (1 + Math.cos((timeMs % 3600) / 3600 * 2 * Math.PI - index * 2.399963229728653)) / 2;
    return 0.2 + 0.8 * wave ** 2;
  }
  // Candle-like warmth is supplied by the selected solid color. Two slow,
  // continuous light-level waves avoid random/flickering timer dependencies.
  if (effect === 'kerze') return 0.7
    + 0.18 * Math.sin((timeMs % 3000) / 3000 * 2 * Math.PI)
    + 0.1 * Math.sin((timeMs % 5000) / 5000 * 2 * Math.PI);
  if (effect === 'atmen') return 0.25 + 0.75 * (1 + Math.cos(phase * 2 * Math.PI)) / 2;
  if (effect === 'links-rechts' || effect === 'rechts-links') {
    const position = phase * count;
    const target = effect === 'rechts-links' ? count - 1 - index : index;
    const distance = Math.abs(target - position);
    return Math.max(0, 1 - Math.min(distance, count - distance));
  }
  if (effect === 'mitte-aussen') {
    const center = (count - 1) / 2;
    const inner = count % 2 === 0 ? 0.5 : 0;
    const ring = Math.abs(index - center) - inner;
    return Math.max(0, 1 - Math.abs(ring - phase * (Math.floor(center) + 1)));
  }
  return 1;
}
