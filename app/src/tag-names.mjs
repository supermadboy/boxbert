/**
 * Human-readable labels only; UID and music paths are separate identities.
 * 80 NFC-normalized Unicode code points is an app/UI design limit, NOT a
 * firmware/SD limit. Emoji sequences may contain multiple code points.
 * Pure helpers: no storage, HTTP routes or claims of SD persistence.
 */
export const MAX_TAG_NAME_LENGTH = 80;

/** Rename one existing UID. Persist the returned array via the demo adapter. */
export function renameTag(tags, uid, name) {
  const index = tags.findIndex(tag => tag.uid === uid);
  if (index < 0) throw new Error('Tag unbekannt.');
  const normalized = normalizeTagName(name, index);
  return tags.map((tag, i) => i === index ? {...tag, name: normalized} : tag);
}

/** Return a new array of shallow-copied tags, adding/normalizing only name. */
export function migrateTagNames(tags) {
  return tags.map((tag, index) => ({...tag, name: normalizeTagName(tag.name, index)}));
}

/** Trim + NFC; null/undefined/blank reset to Tag N (zero-based index). */
export function normalizeTagName(name, index = 0) {
  if (!Number.isSafeInteger(index) || index < 0) {
    throw new TypeError('Tag-Index muss eine nicht negative ganze Zahl sein.');
  }
  if (name != null && typeof name !== 'string') {
    throw new TypeError('Tag-Name muss eine Zeichenkette sein.');
  }
  const normalized = (name ?? '').trim().normalize('NFC');
  if (Array.from(normalized).length > MAX_TAG_NAME_LENGTH) {
    throw new RangeError(`Tag-Name darf höchstens ${MAX_TAG_NAME_LENGTH} Zeichen enthalten.`);
  }
  return normalized || `Tag ${index + 1}`;
}
