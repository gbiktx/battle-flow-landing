// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://battleflow.app',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh-Hans', 'zh-Hant', 'ja', 'ko'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap({
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