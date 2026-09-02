import { test } from 'node:test';
import assert from 'node:assert/strict';

import { PvPCalculator, MEGA_CAPS } from '../src/lib/pvp-calculator.ts';
import { pokemon } from '../src/lib/pokemon-data.ts';

const azumarill = pokemon.find((p) => p.id === 'azumarill');
if (!azumarill) throw new Error('azumarill missing from pokemon.json');

const sableye = pokemon.find((p) => p.id === 'sableye');
const megaSableye = pokemon.find((p) => p.id === 'sableye_mega');
if (!sableye || !megaSableye) throw new Error('Sableye Mega pair missing from pokemon.json');

const beedrill = pokemon.find((p) => p.id === 'beedrill');
const megaBeedrill = pokemon.find((p) => p.id === 'beedrill_mega');
if (!beedrill || !megaBeedrill) throw new Error('Beedrill Mega pair missing from pokemon.json');

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

test('findBestLevelBeforeEvolution keeps Mega Sableye under the Great League cap', () => {
  assert.deepEqual(
    PvPCalculator.findBestLevelBeforeEvolution(
      sableye,
      megaSableye,
      { atk: 0, def: 15, hp: 12 },
      1500,
      50
    ),
    { level: 30, baseCp: 1132, evolvedCp: 1499 }
  );
});

// The ceiling is computed from the copy's own IVs, never from a per-species
// factor. Beedrill is the case that proves why: base attack 169 against the
// Mega's 303, so the CP multiplier is x1.83 at 15 attack and x1.90 at 0. A
// species-wide x1.83 puts this 816 CP copy at 1495 and calls it legal, when its
// Mega is really 1552 — 52 over the cap.
test('a 0-attack Beedrill gets a lower ceiling than a 15-attack one', () => {
  const lowAtk = PvPCalculator.findBestLevelBeforeEvolution(beedrill, megaBeedrill, { atk: 0, def: 15, hp: 12 }, 1500, 50);
  const highAtk = PvPCalculator.findBestLevelBeforeEvolution(beedrill, megaBeedrill, { atk: 15, def: 15, hp: 15 }, 1500, 50);

  assert.deepEqual(lowAtk, { level: 16, baseCp: 768, evolvedCp: 1461 });
  assert.deepEqual(highAtk, { level: 15.5, baseCp: 817, evolvedCp: 1498 });

  // The reported copy: 0/15/12 at level 17 reads 816 CP and Megas to 1552 —
  // one half-level above its ceiling, so it is already out of the cup.
  assert.equal(PvPCalculator.calculateCp(beedrill, { atk: 0, def: 15, hp: 12 }, 17), 816);
  assert.equal(PvPCalculator.calculateCp(megaBeedrill, { atk: 0, def: 15, hp: 12 }, 17), 1552);
});

// Cross-tool anchor: PvPoke's own `beedrill_mega` cp1500 defaultIVs are
// [16, 6, 14, 15] — level 16 at 6/14/15 — and both tools mean "the highest
// level under the cap", so the levels have to agree.
test('the ceiling level matches PvPoke\'s Mega optimum for the same spread', () => {
  const fit = PvPCalculator.findBestLevelBeforeEvolution(beedrill, megaBeedrill, { atk: 6, def: 14, hp: 15 }, 1500, 50);
  assert.equal(fit?.level, 16);
  assert.equal(fit?.baseCp, 799);
});

test('no ceiling is reported when the Mega fits at the level cap', () => {
  // Mega Sableye is under 2500 even at level 50, so there is nothing to stop
  // short of. Returning level 50 made the card say "keep Sableye at or below
  // 1668 CP" — which is its maximum, not a limit. Mega Mawile, Medicham and
  // Audino did the same at Ultra.
  assert.equal(
    PvPCalculator.findBestLevelBeforeEvolution(sableye, megaSableye, { atk: 15, def: 15, hp: 15 }, 2500, 50),
    null
  );
  // ...while a level cap the Mega really does outgrow still reports one.
  assert.deepEqual(
    PvPCalculator.findBestLevelBeforeEvolution(sableye, megaSableye, { atk: 15, def: 15, hp: 15 }, 1500, 50),
    { level: 27, baseCp: 1138, evolvedCp: 1498 }
  );
});

test('no ceiling is reported when the Mega is over the cap at level 1', () => {
  // The branch that used to return level 1 with an over-cap CP and let the UI
  // state it as fact.
  assert.equal(
    PvPCalculator.findBestLevelBeforeEvolution(sableye, megaSableye, { atk: 15, def: 15, hp: 15 }, 10, 50),
    null
  );
});

test('Mega ceilings are offered for the Great and Ultra caps only', () => {
  // ⛔ 500 is absent on purpose: no Mega is legal in a Little cup. PvPoke ships
  // no mega cup at that cap and BattleFlow's rankings are mega-1500 /
  // mega-2500 / mega-10000, so a Little ceiling would be advice for a format
  // that does not exist.
  assert.deepEqual([...MEGA_CAPS], [1500, 2500]);
  assert.ok(!MEGA_CAPS.includes(500), 'no Mega is allowed in Little League');
  assert.ok(!MEGA_CAPS.includes(10000), 'Master is uncapped, so it has no ceiling');
});
