import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ui } from '../src/i18n/ui.ts';

const component = fs.readFileSync(new URL('../src/components/Cleanup.astro', import.meta.url), 'utf8');
const cleanupKeys = [...component.matchAll(/t\(['"](cleanup\.[^'"]+)['"]\)/g)].map((match) => match[1]);
const englishCleanupKeys = Object.keys(ui.en).filter((key) => key.startsWith('cleanup.'));
const requiredKeys = new Set(['nav.cleanup', ...englishCleanupKeys, ...cleanupKeys]);

test('every locale includes all Cleanup translations', () => {
  for (const [locale, translations] of Object.entries(ui)) {
    for (const key of requiredKeys) {
      assert.ok(key in translations, `${locale} is missing ${key}`);
      assert.notEqual(translations[key as keyof typeof translations]?.trim(), '', `${locale} has an empty ${key}`);
    }
  }
});
