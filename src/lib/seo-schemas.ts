type SchemaObject = Record<string, unknown>;

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
  const homeUrl = new URL(lang === 'en' ? '/' : `/${lang}/`, siteUrl).toString();

  const webApp: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url: pageUrl,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    description,
    inLanguage: lang,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  if (featureList) webApp.featureList = featureList;

  const breadcrumb: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'BattleFlow', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: navCrumbName, item: pageUrl },
    ],
  };

  return [webApp, breadcrumb];
}

export const IV_CALCULATOR_FEATURE_LIST = [
  'PvP IV rank calculator',
  'Stat product ranking for every league',
  'Best-level finder for Great, Ultra, Master, and Little League',
  'Custom IV tracking',
  'Level 40, 41, 50, and 51 caps',
];
