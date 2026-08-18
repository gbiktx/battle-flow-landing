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
    { q: t('faq.q6' as Keys), a: t('faq.a6' as Keys) },
    { q: t('faq.q7' as Keys), a: t('faq.a7' as Keys) },
    { q: t('faq.q8' as Keys), a: t('faq.a8' as Keys) },
    { q: t('faq.q9' as Keys), a: t('faq.a9' as Keys) },
    { q: t('faq.q10' as Keys), a: t('faq.a10' as Keys) },
  ];
}

/**
 * Team Builder FAQ. Defined once so the rendered accordion and the FAQPage
 * schema can't drift — they previously each hard-coded their own subset.
 */
export function getTeamBuilderFaqs(t: (key: Keys) => string) {
  return [1, 2, 3, 4].map((n) => ({
    q: t(`team.faq${n}_q` as Keys),
    a: t(`team.faq${n}_a` as Keys),
  }));
}

/** Move-counts FAQ. Same contract as the team builder's: one source for the
 * rendered accordion and the FAQPage schema. */
export function getMoveCountsFaqs(t: (key: Keys) => string) {
  return [1, 2, 3, 4].map((n) => ({
    q: t(`drill.faq${n}_q` as Keys),
    a: t(`drill.faq${n}_a` as Keys),
  }));
}
