// Locale plumbing with no imports of its own, so astro.config.mjs and the plain
// node scripts in scripts/ can load it as readily as a component can.
//
// Regional locale variants get their own URL, hreflang, UI copy (src/i18n/ui.ts)
// and game-data dictionary — LatAm Spanish renames 141 of 425 moves. What they
// still share with the base locale is the long-form content nobody has rewritten:
// blog posts, the legal pages, and the localized screenshots. Dependency-free so
// astro.config.mjs can import it too.
// Exported for tests/locales.test.ts, which is what catches a typo'd key here:
// a key that isn't a shipped locale is a silent no-op at runtime.
export const CONTENT_FALLBACK: Record<string, string> = {
  'es-419': 'es',
};

/** The locale whose prose and assets a locale renders. Identity for base locales. */
export const contentLang = (lang: string): string => CONTENT_FALLBACK[lang] ?? lang;

// Locale keys are lowercase because they double as URL path segments (Netlify
// 301s mixed-case paths). Language *tag values* — `<html lang>`, `hreflang`,
// schema.org `inLanguage`, the sitemap's `<xhtml:link>` — still want BCP 47
// casing. One map, so the head tags and the sitemap can never disagree.
const BCP_47: Record<string, string> = { 'zh-hant': 'zh-Hant' };

export function toBcp47(lang: string): string {
  return BCP_47[lang] ?? lang;
}

// OpenGraph locale format (underscored, region-suffixed). Facebook's list has no
// `es_419`; `es_LA` is its Latin American Spanish. Every locale in `languages`
// needs an entry — tests/locales.test.ts fails the build if one is missing, since
// the alternative is a page silently declaring og:locale=en_US.
export const OG_LOCALE: Record<string, string> = {
  en: 'en_US',
  es: 'es_ES',
  'es-419': 'es_LA',
  fr: 'fr_FR',
  de: 'de_DE',
  it: 'it_IT',
  pt: 'pt_BR',
  'zh-hant': 'zh_TW',
  ja: 'ja_JP',
  ko: 'ko_KR',
};
