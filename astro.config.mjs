// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';
import { whatsNewData } from './src/i18n/data.ts';
import { contentLang } from './src/i18n/content-lang.ts';

// URL path segment (always lowercase) -> hreflang value (BCP 47). Netlify's CDN
// 301s mixed-case paths to lowercase, so any uppercase in a *segment* makes
// canonicals point at a redirect; the tag values keep their real casing.
// See docs/locale-casing-fix-plan.md.
const LOCALE_HREFLANG = {
  en: 'en',
  es: 'es',
  'es-419': 'es-419',
  fr: 'fr',
  de: 'de',
  it: 'it',
  pt: 'pt',
  'zh-hant': 'zh-Hant',
  ja: 'ja',
  ko: 'ko',
};
const LOCALES = Object.keys(LOCALE_HREFLANG);
const SITE = 'https://battleflow.app';

// Keep empty What's New pages out of the sitemap (they're noindex until populated).
// Matches /whats-new/ and /<locale>/whats-new/, mapping each to its locale's content.
const hasWhatsNewContent = (url) => {
  const match = url.match(/\/(?:([a-zA-Z0-9-]+)\/)?whats-new\/?$/);
  if (!match) return true;
  const locale = match[1] && LOCALES.includes(match[1]) ? match[1] : 'en';
  return Boolean((whatsNewData[contentLang(locale)] ?? '').trim());
};

// Every URL that survives the filter, so serialize() can build hreflang groups
// from the real page set rather than assuming every route exists in every
// locale. `filter` runs over all pages before the first serialize() call.
const sitemapUrls = new Set();
const shouldIncludeInSitemap = (url) => {
  const keep = hasWhatsNewContent(url);
  if (keep) sitemapUrls.add(url.endsWith('/') ? url : `${url}/`);
  return keep;
};

/** `/es/iv-calculator/` -> `/iv-calculator/`; English is served unprefixed. */
const stripLocale = (pathname) => {
  const [, first, ...rest] = pathname.split('/');
  return LOCALES.includes(first) && first !== 'en' ? `/${rest.join('/')}` : pathname;
};

const localeUrl = (segment, path) =>
  new URL(segment === 'en' ? path : `/${segment}${path}`, SITE).toString();

// Hand-rolled because @astrojs/sitemap's own `i18n` option validates hreflang
// values against /^[a-zA-Z-]+$/: `es-419` fails that schema, and a failed schema
// drops sitemap generation *entirely* (one WARN line, no dist/sitemap-0.xml).
// See docs/SEO.md. Emits x-default too, matching the <head> tags in Layout.astro.
const alternatesFor = (url) => {
  const path = stripLocale(new URL(url).pathname);
  const links = [];
  for (const segment of LOCALES) {
    const sibling = localeUrl(segment, path);
    if (sitemapUrls.has(sibling)) links.push({ lang: LOCALE_HREFLANG[segment], url: sibling });
  }
  if (links.length < 2) return undefined;
  const english = localeUrl('en', path);
  if (sitemapUrls.has(english)) links.push({ lang: 'x-default', url: english });
  return links;
};

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: LOCALES,
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap({
    filter: shouldIncludeInSitemap,
    // trailingSlash is 'always', but @astrojs/sitemap emits <loc> without the
    // slash — that points Google at the non-canonical (redirected) URL of every
    // page, which leaves low-authority pages (the blog) unindexed. Force the
    // canonical trailing-slash form on every entry.
    serialize(item) {
      if (!item.url.endsWith('/')) {
        item.url += '/';
      }
      item.links = alternatesFor(item.url);
      return item;
    }
  }), react()]
});