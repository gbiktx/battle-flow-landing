// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';
import { whatsNewData } from './src/i18n/data.ts';
import { contentLang } from './src/i18n/locales.ts';
import { languages } from './src/i18n/ui.ts';
import { localizedPath, stripLocalePrefix, toBcp47 } from './src/i18n/utils.ts';

// One roster, shared with the <head> tags: `languages` keys are the URL path
// segments (always lowercase — Netlify's CDN 301s mixed-case paths, so uppercase
// in a segment makes canonicals point at a redirect, see
// docs/locale-casing-fix-plan.md) and toBcp47() turns each into its real-cased
// hreflang value. Deriving both from src/i18n/ instead of a second copy is what
// keeps the sitemap's hreflang and the page's own <link rel="alternate"> in step.
const LOCALES = Object.keys(languages);
const SITE = 'https://battleflow.app';

// Keep empty What's New pages out of the sitemap (they're noindex until populated).
// Matches /whats-new/ and /<locale>/whats-new/, mapping each to its locale's content.
// A non-locale parent segment (some other page slugged `whats-new`) is a different
// page and is left alone rather than gated on the English changelog.
const hasWhatsNewContent = (url) => {
  const match = url.match(/\/(?:([a-zA-Z0-9-]+)\/)?whats-new\/?$/);
  if (!match) return true;
  if (match[1] && !LOCALES.includes(match[1])) return true;
  return Boolean((whatsNewData[contentLang(match[1] ?? 'en')] ?? '').trim());
};

// @astrojs/sitemap dropped localized status pages as a side effect of its `i18n`
// option; that option is gone (see the hreflang note below), so do it here.
const STATUS_PAGES = new Set(['404', '500']);
const isStatusPage = (url) => {
  const segments = new URL(url).pathname.split('/').filter(Boolean);
  const last = segments.at(-1);
  return Boolean(last && STATUS_PAGES.has(last));
};

// Every URL that survives the filter, so serialize() can build hreflang groups
// from the real page set rather than assuming every route exists in every
// locale. `filter` runs over all pages before the first serialize() call.
const sitemapUrls = new Set();
const shouldIncludeInSitemap = (url) => {
  const keep = hasWhatsNewContent(url) && !isStatusPage(url);
  if (keep) sitemapUrls.add(url.endsWith('/') ? url : `${url}/`);
  return keep;
};

const localeUrl = (segment, path) => new URL(localizedPath(segment, path), SITE).toString();

// Hand-rolled because @astrojs/sitemap's own `i18n` option validates hreflang
// values against /^[a-zA-Z-]+$/: `es-419` fails that schema, and a failed schema
// drops sitemap generation *entirely* (one WARN line, no dist/sitemap-0.xml).
// See docs/SEO.md. Routing through the same stripLocalePrefix/localizedPath/toBcp47
// the <head> uses keeps the two hreflang sets identical; x-default is emitted here
// too, matching Layout.astro.
const alternatesFor = (url) => {
  const path = stripLocalePrefix(new URL(url).pathname);
  const links = [];
  for (const segment of LOCALES) {
    const sibling = localeUrl(segment, path);
    if (sitemapUrls.has(sibling)) links.push({ lang: toBcp47(segment), url: sibling });
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
    // page, which leaves low-authority pages unindexed. Force the canonical
    // trailing-slash form on every entry.
    serialize(item) {
      if (!item.url.endsWith('/')) {
        item.url += '/';
      }
      item.links = alternatesFor(item.url);
      return item;
    }
  }), react()]
});