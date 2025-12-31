// --------------------------------------
// CLEAN (for display / storage)
// --------------------------------------
export function cleanTitle(text) {
  return text.trim().replace(/\s+/g, ' ');
}

// --------------------------------------
// LOWER + spacing normalize (for compare)
// --------------------------------------
export function normalizeForCompare(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // multi spaces → 1
    .replace(/[-–—_/.:;,'"()!?+]+/g, ' ') // punctuation → space
    .replace(/[^a-z0-9\s]/gi, ' ') // any symbol remove
    .replace(/\s+/g, ' ') // collapse again
    .trim();
}

// --------------------------------------
// BASE KEY  (title without part)
// ex:
//  "Rumi Poems Part I" → "rumi poems"
//  "Rumi Poems"        → "rumi poems"
// --------------------------------------
export function baseKey(title) {
  return normalizeForCompare(title).replace(/\s+part\s+[ivx]+$/gi, '');
}

// --------------------------------------
// Roman helper (Part I, II, III … only)
// --------------------------------------
export function roman(n) {
  const map = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  return map[n] || null;
}

// --------------------------------------
// TITLE VALIDATION (shared by add + edit)
// --------------------------------------
export function runTitleValidation(title) {
  if (!title) return { ok: false, msg: 'Title cannot be empty.' };

  // number ending (Rumi 2 ❌)
  if (/\d+$/.test(title)) {
    return { ok: false, msg: 'Title cannot end with numbers.' };
  }

  // dash-number (Rumi - 2 ❌)
  if (/-\s*\d+$/.test(title)) {
    return {
      ok: false,
      msg: 'Looks like Part — please use the Part box.',
    };
  }

  // contains "part ..." (Rumi Part I ❌)
  if (/part\s*[-–—:]?\s*(\d+|[ivx]+)/i.test(title)) {
    return {
      ok: false,
      msg: "Don't write Part in the title — use the Part box instead.",
    };
  }

  // 🚫 Roman AT END  → treated as fake part
  //    Examples blocked:
  //    Rumi I
  //    Rumi — I
  //    Rumi : II
  if (/\b(i|ii|iii|iv|v|vi|vii|viii|ix)$/i.test(title)) {
    return {
      ok: false,
      msg: "Don't write Part in the title — use the Part box.",
    };
  }

  // Roman preceded by dash / colon at end
  if (/[-–—:]\s*(i|ii|iii|iv|v|vi|vii|viii|ix)$/i.test(title)) {
    return {
      ok: false,
      msg: "Don't write Part in the title — use the Part box.",
    };
  }

  return { ok: true };
}
