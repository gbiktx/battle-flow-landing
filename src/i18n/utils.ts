import { ui, defaultLang } from './ui';

type UI = typeof ui;
type DefaultLang = typeof defaultLang;
type Keys = keyof UI[DefaultLang];

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof UI;
  
  // Case-insensitive lookup so legacy inbound URLs (/zh-Hant/) still resolve
  // to the lowercase key. Keys are lowercase; see docs/locale-casing-fix-plan.md.
  const langKey = Object.keys(ui).find(
    (key) => key.toLowerCase() === lang?.toLowerCase()
  );
  if (langKey) return langKey as keyof UI;
  
  return defaultLang;
}

// Re-exported so `toBcp47` stays importable from the module the pages already
// use; it lives in ./locales.ts because node scripts need it without pulling ui.ts.
export { toBcp47 } from './locales';

/**
 * Drop a leading locale segment: `/de/team-builder/` -> `/team-builder/`.
 * The single definition of that rule — hreflang, x-default, and the language
 * switcher all route through it.
 */
export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (Object.keys(ui).some((key) => key.toLowerCase() === segments[0]?.toLowerCase())) {
    segments.shift();
  }
  const base = segments.join('/');
  return `/${base}${base ? '/' : ''}`;
}

/** The same page under another locale. English is served unprefixed. */
export function localizedPath(lang: string, pathname: string): string {
  const base = stripLocalePrefix(pathname);
  return lang === defaultLang ? base : `/${lang}${base}`;
}

export function useTranslations(lang: keyof UI) {
  return function t(key: Keys): string {
    const translation = ui[lang]?.[key as keyof UI[typeof lang]];
    return (translation !== undefined ? translation : ui[defaultLang][key]) as string;
  }
}
