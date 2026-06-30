// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';
import { whatsNewData } from './src/i18n/data.ts';

const LOCALES = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh-Hans', 'zh-Hant', 'ja', 'ko'];

// Keep empty What's New pages out of the sitemap (they're noindex until populated).
// Matches /whats-new/ and /<locale>/whats-new/, mapping each to its locale's content.
const shouldIncludeInSitemap = (url) => {
  const match = url.match(/\/(?:([a-zA-Z-]+)\/)?whats-new\/?$/);
  if (!match) return true;
  const locale = match[1] && LOCALES.includes(match[1]) ? match[1] : 'en';
  return Boolean((whatsNewData[locale] ?? '').trim());
};

// https://astro.build/config
export default defineConfig({
  site: 'https://battleflow.app',
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
      return item;
    },
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en',
        es: 'es',
        fr: 'fr',
        de: 'de',
        it: 'it',
        pt: 'pt',
        'zh-Hans': 'zh-Hans',
        'zh-Hant': 'zh-Hant',
        ja: 'ja',
        ko: 'ko'
      }
    }
  }), react()]
});