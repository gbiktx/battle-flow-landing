import { ui, defaultLang } from '../i18n/ui';

type UI = typeof ui;
type Keys = keyof UI[typeof defaultLang];

export function getHomeFaqs(t: (key: Keys) => string) {
  return [
    { q: t('faq.q1' as Keys), a: t('faq.a1' as Keys) },
    { q: t('faq.q2' as Keys), a: t('faq.a2' as Keys) },
    { q: t('faq.q3' as Keys), a: t('faq.a3' as Keys) },
    { q: t('faq.q4' as Keys), a: t('faq.a4' as Keys) },
    { q: t('faq.q5' as Keys), a: t('faq.a5' as Keys) },
  ];
}
