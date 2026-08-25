// Regional locale variants get their own URL, hreflang, UI copy (src/i18n/ui.ts)
// and game-data dictionary — LatAm Spanish renames 141 of 425 moves. What they
// still share with the base locale is the long-form content nobody has rewritten:
// blog posts, the legal pages, and the localized screenshots. Dependency-free so
// astro.config.mjs can import it too.
const CONTENT_FALLBACK: Record<string, string> = {
  'es-419': 'es',
};

/** The locale whose prose and assets a locale renders. Identity for base locales. */
export const contentLang = (lang: string): string => CONTENT_FALLBACK[lang] ?? lang;
