// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

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
  })]
});
