import { test } from 'node:test';
import assert from 'node:assert/strict';

import { PvPCalculator } from '../src/lib/pvp-calculator.ts';
import { pokemon } from '../src/lib/pokemon-data.ts';

const azumarill = pokemon.find((p) => p.id === 'azumarill');
if (!azumarill) throw new Error('azumarill missing from pokemon.json');

// Compute once — every property test below reads from this same table.
const ranks = PvPCalculator.generateRanks(azumarill, 1500, 0, 50);

test('generateRanks returns 16^3 = 4096 entries for minIv=0', () => {
  assert.equal(ranks.length, 4096);
});

test('ranks are sequential and rank 1 has 100% perfection', () => {
  assert.equal(ranks[0].rank, 1);
  assert.equal(ranks[0].perfection, 100);
  for (let i = 0; i < ranks.length; i++) {
    assert.equal(ranks[i].rank, i + 1, `rank at index ${i} should be ${i + 1}`);
  }
});

test('all ranked entries stay within the league CP cap', () => {
  for (const r of ranks) assert.ok(r.cp <= 1500, `CP ${r.cp} exceeded cap`);
});

test('stat product is monotonically non-increasing by rank', () => {
  for (let i = 1; i < ranks.length; i++) {
    assert.ok(
      ranks[i - 1].statProduct >= ranks[i].statProduct,
      `statProduct not sorted at rank ${i}`
    );
  }
});

// Golden: Azumarill's rank-1 Great League IVs are the well-known community answer.
test('Azumarill Great League rank 1 is 0/15/15 at level 45.5, CP 1499', () => {
  const top = ranks[0];
  assert.deepEqual(top.ivs, { atk: 0, def: 15, hp: 15 });
  assert.equal(top.level, 45.5);
  assert.equal(top.cp, 1499);
});

test('calculateCp matches a known fixture (Azumarill 15/15/15 level 40)', () => {
  const cp = PvPCalculator.calculateCp(azumarill, { atk: 15, def: 15, hp: 15 }, 40);
  assert.equal(cp, 1588);
});

test('findBestLevel does not exceed maxCp', () => {
  const { level, cp } = PvPCalculator.findBestLevel(
    azumarill,
    { atk: 0, def: 15, hp: 15 },
    1500,
    50
  );
  assert.ok(cp <= 1500);
  assert.ok(level >= 1 && level <= 50);
});
