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
 * How many numbered FAQ pairs each page ships. The count lives here, not at the
 * call sites: every page asks twice — once for the rendered accordion, once for
 * the FAQPage schema in its `<head>` — and a count passed in by hand let the
 * two disagree, which is the drift this module exists to prevent.
 */
const FAQ_COUNTS = {
  team: 4,
  drill: 4,
  collection: 5,
} as const;

export type FaqPrefix = keyof typeof FAQ_COUNTS;

/**
 * One question/answer pair per numbered key, e.g. `team.faq2_q` / `team.faq2_a`.
 * `prefix` is a union rather than a string, so a typo is a build error instead
 * of an accordion of empty `<details>` and a schema of undefined answers.
 */
export function getFaqs(t: (key: Keys) => string, prefix: FaqPrefix) {
  return Array.from({ length: FAQ_COUNTS[prefix] }, (_, i) => ({
    q: t(`${prefix}.faq${i + 1}_q` as Keys),
    a: t(`${prefix}.faq${i + 1}_a` as Keys),
  }));
}
