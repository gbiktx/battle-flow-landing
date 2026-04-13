type SchemaObject = Record<string, unknown>;

const APP_STORE_URL = 'https://apps.apple.com/us/app/battleflow/id6738843812';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.baru.software.oak';

export const ORGANIZATION_SAME_AS = [
  APP_STORE_URL,
  PLAY_STORE_URL,
  'https://twitter.com/battleflowapp',
  'https://baru.software',
];

function homeUrlFor(siteUrl: URL, lang: string): string {
  return new URL(lang === 'en' ? '/' : `/${lang}/`, siteUrl).toString();
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
  const homeUrl = homeUrlFor(siteUrl, lang);

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

interface MobileAppSchemasInput {
  siteUrl: URL;
  lang: string;
  name: string;
  description: string;
}

export function buildMobileAppSchemas({
  siteUrl,
  lang,
  name,
  description,
}: MobileAppSchemasInput): SchemaObject[] {
  const baseApp = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name,
    description,
    inLanguage: lang,
    applicationCategory: 'GameApplication',
    applicationSubCategory: 'Pokémon GO PvP companion',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Organization', name: 'Baru Software Co', url: 'https://baru.software' },
    url: new URL(lang === 'en' ? '/' : `/${lang}/`, siteUrl).toString(),
  };

  return [
    { ...baseApp, operatingSystem: 'iOS', downloadUrl: APP_STORE_URL, installUrl: APP_STORE_URL },
    { ...baseApp, operatingSystem: 'Android', downloadUrl: PLAY_STORE_URL, installUrl: PLAY_STORE_URL },
  ];
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

interface BlogListSchemaInput {
  siteUrl: URL;
  lang: string;
  pagePath: string;
  name: string;
  description: string;
  navCrumbName: string;
  posts: {
    slug: string;
    title: string;
    description: string;
    date: Date;
  }[];
}

export function buildBlogListSchemas({
  siteUrl,
  lang,
  pagePath,
  name,
  description,
  navCrumbName,
  posts,
}: BlogListSchemaInput): SchemaObject[] {
  const pageUrl = new URL(pagePath, siteUrl).toString();
  const homeUrl = homeUrlFor(siteUrl, lang);

  const blog: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name,
    description,
    url: pageUrl,
    inLanguage: lang,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date.toISOString(),
      url: new URL(`${pagePath}${p.slug}/`, siteUrl).toString(),
    })),
  };

  const breadcrumb: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'BattleFlow', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: navCrumbName, item: pageUrl },
    ],
  };

  return [blog, breadcrumb];
}

interface BlogPostSchemaInput {
  siteUrl: URL;
  lang: string;
  pagePath: string;
  title: string;
  description: string;
  author: string;
  date: Date;
  image: string;
  navCrumbName: string;
  blogIndexPath: string;
}

export function buildBlogPostSchemas({
  siteUrl,
  lang,
  pagePath,
  title,
  description,
  author,
  date,
  image,
  navCrumbName,
  blogIndexPath,
}: BlogPostSchemaInput): SchemaObject[] {
  const pageUrl = new URL(pagePath, siteUrl).toString();
  const homeUrl = homeUrlFor(siteUrl, lang);
  const blogUrl = new URL(blogIndexPath, siteUrl).toString();
  const imageUrl = new URL(image, siteUrl).toString();

  const article: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: date.toISOString(),
    dateModified: date.toISOString(),
    inLanguage: lang,
    url: pageUrl,
    image: imageUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    author: { '@type': 'Organization', name: author, url: 'https://baru.software' },
    publisher: {
      '@type': 'Organization',
      name: 'Baru Software Co',
      logo: {
        '@type': 'ImageObject',
        url: new URL('/assets/images/large-logo.png', siteUrl).toString(),
      },
    },
  };

  const breadcrumb: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'BattleFlow', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: navCrumbName, item: blogUrl },
      { '@type': 'ListItem', position: 3, name: title, item: pageUrl },
    ],
  };

  return [article, breadcrumb];
}

export const IV_CALCULATOR_FEATURE_LIST = [
  'PvP IV rank calculator',
  'Stat product ranking for every league',
  'Best-level finder for Great, Ultra, Master, and Little League',
  'Custom IV tracking',
  'Level 40, 41, 50, and 51 caps',
];
