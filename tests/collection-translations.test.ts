import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ui } from '../src/i18n/ui.ts';

const component = fs.readFileSync(new URL('../src/components/Collection.astro', import.meta.url), 'utf8');
const collectionKeys = [...component.matchAll(/t\(['"](collection\.[^'"]+)['"]\)/g)].map((match) => match[1]);
const dynamicKeys = [
  ...['live', 'tap', 'gallery'].flatMap((mode) => [
    `collection.mode_${mode}_title`,
    `collection.mode_${mode}_desc`,
    `collection.mode_${mode}_platform`,
  ]),
  ...[1, 2, 3].flatMap((item) => [`collection.step${item}_title`, `collection.step${item}_desc`]),
  ...['shadow', 'purified', 'lucky', 'shiny', 'buddy', 'favorite', 'max', 'mega', 'costume', 'background'].map(
    (mark) => `collection.mark_${mark}`
  ),
  ...[1, 2, 3, 4, 5].flatMap((item) => [`collection.faq${item}_q`, `collection.faq${item}_a`]),
];
const englishCollectionKeys = Object.keys(ui.en).filter((key) => key.startsWith('collection.'));
const requiredKeys = new Set([
  'nav.collection',
  'nav.group_yours',
  'nav.group_reference',
  'features.collection_link',
  'collection.track_alt',
  ...englishCollectionKeys,
  ...collectionKeys,
  ...dynamicKeys,
]);

test('every locale includes all Collection translations', () => {
  for (const [locale, translations] of Object.entries(ui)) {
    for (const key of requiredKeys) {
      assert.ok(key in translations, `${locale} is missing ${key}`);
      assert.notEqual(translations[key as keyof typeof translations]?.trim(), '', `${locale} has an empty ${key}`);
    }
  }
});
