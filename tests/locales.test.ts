import { test } from 'node:test';
import assert from 'node:assert/strict';

import { languages } from '../src/i18n/ui.ts';
import { CONTENT_FALLBACK, OG_LOCALE, contentLang, toBcp47 } from '../src/i18n/locales.ts';

// The locale roster is consumed by the pages, the sitemap, the data scripts and
// the route verifier. Everything now derives from `languages`; these guard the
// few maps that still have to be extended by hand when a locale is added.
const locales = Object.keys(languages);

test('every locale has an OpenGraph locale', () => {
  for (const lang of locales) {
    assert.ok(OG_LOCALE[lang], `${lang} is missing from OG_LOCALE — pages would declare og:locale=en_US`);
  }
});

test('hreflang values are distinct', () => {
  const tags = locales.map(toBcp47);
  assert.equal(new Set(tags).size, tags.length, `duplicate hreflang values: ${tags}`);
});

test('locale segments are lowercase', () => {
  // Netlify 301s mixed-case paths, so an uppercase segment makes every canonical
  // under it point at a redirect. See docs/locale-casing-fix-plan.md.
  for (const lang of locales) assert.equal(lang, lang.toLowerCase());
});

test('content fallbacks point at real locales, and are not themselves fallbacks', () => {
  for (const [variant, base] of Object.entries(CONTENT_FALLBACK)) {
    assert.ok(locales.includes(variant), `CONTENT_FALLBACK key "${variant}" is not a shipped locale`);
    assert.ok(locales.includes(base), `CONTENT_FALLBACK["${variant}"] -> "${base}" is not a shipped locale`);
    assert.equal(contentLang(base), base, `"${base}" is itself a variant — fallbacks must not chain`);
  }
});

test('base locales are their own content locale', () => {
  for (const lang of locales) {
    if (lang in CONTENT_FALLBACK) continue;
    assert.equal(contentLang(lang), lang);
  }
});
