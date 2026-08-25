// Regional locale variants get their own URL, hreflang and game-data dictionary
// (LatAm Spanish renames 141 of 425 moves), but share the base locale's prose,
// screenshots and blog posts until that copy actually diverges — one Spanish
// source, two locales. Dependency-free so astro.config.mjs can import it too.
const CONTENT_FALLBACK: Record<string, string> = {
  'es-419': 'es',
};

/** The locale whose prose and assets a locale renders. Identity for base locales. */
export const contentLang = (lang: string): string => CONTENT_FALLBACK[lang] ?? lang;
