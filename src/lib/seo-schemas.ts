import { toBcp47 } from '../i18n/utils';
import { APP_STORE_URL, PLAY_STORE_URL } from './store-links';

type SchemaObject = Record<string, unknown>;

/**
 * The app is one schema.org entity across every page and locale. Naming it
 * differently per page (e.g. with the page's SEO title) splits the signal
 * Google uses to consolidate app rich results, so the name is fixed here
 * rather than passed in.
 */
const APP_NAME = 'BattleFlow';

export const ORGANIZATION_SAME_AS = [
  APP_STORE_URL,
  PLAY_STORE_URL,
  'https://twitter.com/battleflowapp',
  'https://baru.software',
];

function homeUrlFor(siteUrl: URL, lang: string): string {
  return new URL(lang === 'en' ? '/' : `/${lang}/`, siteUrl).toString();
}

/** The site-root -> page trail every non-home page emits. */
function buildBreadcrumb(siteUrl: URL, lang: string, pageUrl: string, navCrumbName: string): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: APP_NAME, item: homeUrlFor(siteUrl, lang) },
      { '@type': 'ListItem', position: 2, name: navCrumbName, item: pageUrl },
    ],
  };
}

interface FeaturePageSchemasInput {
  siteUrl: URL;
  lang: string;
  pagePath: string;
  name: string;
  description: string;
  navCrumbName: string;
  featureList?: string[];
}

export function buildFeaturePageSchemas({
  siteUrl,
  lang,
  pagePath,
  name,
  description,
  navCrumbName,
  featureList,
}: FeaturePageSchemasInput): SchemaObject[] {
  const pageUrl = new URL(pagePath, siteUrl).toString();

  const webApp: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url: pageUrl,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    description,
    inLanguage: toBcp47(lang),
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  if (featureList) webApp.featureList = featureList;

  return [webApp, buildBreadcrumb(siteUrl, lang, pageUrl, navCrumbName)];
}

interface MobileAppSchemasInput {
  siteUrl: URL;
  lang: string;
  description: string;
  /** Page carrying the schema. Defaults to the locale home. */
  pagePath?: string;
  featureList?: string[];
  /** Supply to append a BreadcrumbList for `pagePath`. */
  navCrumbName?: string;
}

/**
 * The `MobileApplication` pair (iOS + Android) for any page that pitches the
 * app, optionally with a breadcrumb. Every page must describe the same entity,
 * so only the page-specific fields — url, description, featureList — vary.
 */
export function buildMobileAppSchemas({
  siteUrl,
  lang,
  description,
  pagePath,
  featureList,
  navCrumbName,
}: MobileAppSchemasInput): SchemaObject[] {
  const pageUrl = pagePath ? new URL(pagePath, siteUrl).toString() : homeUrlFor(siteUrl, lang);

  const baseApp: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: APP_NAME,
    description,
    inLanguage: toBcp47(lang),
    applicationCategory: 'GameApplication',
    applicationSubCategory: 'Pokémon GO PvP companion',
    url: pageUrl,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Organization', name: 'Baru Software Co', url: 'https://baru.software' },
  };
  if (featureList) baseApp.featureList = featureList;

  const schemas: SchemaObject[] = [
    { ...baseApp, operatingSystem: 'iOS', downloadUrl: APP_STORE_URL, installUrl: APP_STORE_URL },
    { ...baseApp, operatingSystem: 'Android', downloadUrl: PLAY_STORE_URL, installUrl: PLAY_STORE_URL },
  ];
  if (navCrumbName) schemas.push(buildBreadcrumb(siteUrl, lang, pageUrl, navCrumbName));

  return schemas;
}

interface FAQSchemaInput {
  questions: { q: string; a: string }[];
}

export function buildFAQSchema({ questions }: FAQSchemaInput): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export const IV_CALCULATOR_FEATURE_LIST = [
  'PvP IV rank calculator',
  'Stat product ranking for every league',
  'Best-level finder for Great, Ultra, Master, and Little League',
  'Custom IV tracking',
  'Level 40, 41, 50, and 51 caps',
];
