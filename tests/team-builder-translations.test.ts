import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ui } from '../src/i18n/ui.ts';

const component = fs.readFileSync(new URL('../src/components/TeamBuilder.astro', import.meta.url), 'utf8');
const teamKeys = [...component.matchAll(/t\(['"](team\.[^'"]+)['"]\)/g)].map((match) => match[1]);
const dynamicKeys = [
  ...[1, 2, 3].flatMap((item) => [`team.step${item}_title`, `team.step${item}_desc`]),
  ...['threat', 'coverage', 'recovery', 'consistency'].flatMap((item) => [`team.score_${item}_title`, `team.score_${item}_desc`]),
  ...[1, 2, 3, 4].flatMap((item) => [`team.faq${item}_q`, `team.faq${item}_a`]),
];
const englishTeamKeys = Object.keys(ui.en).filter((key) => key.startsWith('team.'));
const requiredKeys = new Set(['nav.team_builder', ...englishTeamKeys, ...teamKeys, ...dynamicKeys]);

test('every locale includes all Team Builder translations', () => {
  for (const [locale, translations] of Object.entries(ui)) {
    for (const key of requiredKeys) {
      assert.ok(key in translations, `${locale} is missing ${key}`);
      assert.notEqual(translations[key as keyof typeof translations]?.trim(), '', `${locale} has an empty ${key}`);
    }
  }
});
