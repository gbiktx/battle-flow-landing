// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://battleflow.app',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh-hans', 'zh-hant', 'ja', 'ko'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()]
});
