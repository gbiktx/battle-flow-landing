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

export function useTranslations(lang: keyof UI) {
  return function t(key: Keys): string {
    const translation = ui[lang]?.[key as keyof UI[typeof lang]];
    return (translation !== undefined ? translation : ui[defaultLang][key]) as string;
  }
}
