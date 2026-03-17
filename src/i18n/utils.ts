import { ui, defaultLang } from './ui';

type UI = typeof ui;
type DefaultLang = typeof defaultLang;
type Keys = keyof UI[DefaultLang];

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof UI;
  return defaultLang;
}

export function useTranslations(lang: keyof UI) {
  return function t(key: Keys): string {
    const translation = ui[lang]?.[key as keyof UI[typeof lang]];
    return (translation || ui[defaultLang][key]) as string;
  }
}
