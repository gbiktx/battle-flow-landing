import assert from 'node:assert/strict';
import { test } from 'node:test';

import { moves } from '../src/lib/moves-data.ts';
import { drillLeagues, DRILL_LEAGUE_IDS } from '../src/lib/drill-data.ts';
import { poolMoves, poolSpecies } from '../src/lib/move-pools-data.ts';
import {
  buildCountChoices,
  buildDeck,
  buildMovesetChoices,
  cadenceCounts,
  cadenceDifficulty,
  mulberry32,
  type CountCard,
  type MovesetCard,
} from '../src/lib/move-counts.ts';
import type { Move } from '../src/lib/game-data.ts';

const moveById = new Map<string, Move>(moves.map((m) => [m.id, m]));
const rng = () => mulberry32(1234);

// --- cadence math ------------------------------------------------------------
// Goldens are the counts every GBL player knows by heart. If one of these
// changes, the drill is teaching something wrong.

// `energyGain` is energy per *use*, not per turn: Counter is 3 EPT over 2 turns,
// so it gains 6. Reading it as EPT doubles every count on the page.
test('Counter (6 per use) into Ice Punch (40 energy) is 7 | 7 | 6 | 7', () => {
  const counter = moveById.get('COUNTER')!;
  const icePunch = moveById.get('ICE_PUNCH')!;
  assert.equal(counter.energyGain, 6);
  assert.equal(icePunch.energy, 40);
  assert.deepEqual(cadenceCounts(icePunch.energy, counter.energyGain), [7, 7, 6, 7]);
});

test('Dragon Breath (4 per use) into Sky Attack (50 energy) is 13 | 12 | 13 | 12', () => {
  const dragonBreath = moveById.get('DRAGON_BREATH')!;
  const skyAttack = moveById.get('SKY_ATTACK')!;
  assert.deepEqual(cadenceCounts(skyAttack.energy, dragonBreath.energyGain), [13, 12, 13, 12]);
});

test('leftover energy carries between charges — later charges never cost more', () => {
  const mudShot = moveById.get('MUD_SHOT')!;
  const earthquake = moveById.get('EARTHQUAKE')!;
  const cadence = cadenceCounts(earthquake.energy, mudShot.energyGain);
  assert.equal(cadence.length, 4);
  for (const c of cadence) assert.ok(c <= cadence[0], `${c} > first throw ${cadence[0]}`);
});

test('a cadence that never shifts is steady, one that shifts is shifting', () => {
  assert.equal(cadenceDifficulty([5, 5, 5, 5]), 'steady');
  assert.equal(cadenceDifficulty([5, 4, 5, 4]), 'shifting');
});

test('cadence is empty when the fast move gains no energy', () => {
  assert.deepEqual(cadenceCounts(40, 0), []);
});

test('every charge is reachable — no zero or negative counts anywhere in the decks', () => {
  for (const id of DRILL_LEAGUE_IDS) {
    for (const s of drillLeagues[id].species) {
      const fast = moveById.get(s.moveset[0])!;
      for (const chargedId of s.moveset.slice(1)) {
        const cadence = cadenceCounts(moveById.get(chargedId)!.energy, fast.energyGain);
        assert.equal(cadence.length, 4, `${s.id} ${chargedId}`);
        for (const c of cadence) assert.ok(c > 0, `${s.id} ${chargedId} produced count ${c}`);
      }
    }
  }
});

// --- multiple choice ---------------------------------------------------------

test('count choices contain the answer, are unique, ascending, and all positive', () => {
  for (let answer = 1; answer <= 20; answer++) {
    const choices = buildCountChoices(answer, rng());
    assert.ok(choices.includes(answer), `missing answer ${answer}`);
    assert.equal(new Set(choices).size, choices.length, 'duplicate options');
    assert.deepEqual([...choices].sort((a, b) => a - b), choices, 'not ascending');
    for (const c of choices) assert.ok(c > 0, `non-positive option ${c}`);
  }
});

test('count distractors are near misses, never far-off numbers', () => {
  const choices = buildCountChoices(10, rng());
  for (const c of choices) assert.ok(Math.abs(c - 10) <= 4, `distractor ${c} is not a near miss`);
});

test('moveset choices include the exact correct set and no duplicate sets', () => {
  const fast = moveById.get('COUNTER')!;
  const correct = [fast, moveById.get('ICE_PUNCH')!, moveById.get('DYNAMIC_PUNCH')!];
  const choices = buildMovesetChoices(
    correct,
    [moveById.get('POWER_UP_PUNCH')!, moveById.get('CLOSE_COMBAT')!],
    [moveById.get('KARATE_CHOP')!],
    rng()
  );
  assert.ok(choices.includes(correct), 'correct set is not among the options');
  const keys = choices.map((set) => `${set[0].id}>${set.slice(1).map((m) => m.id).sort().join('+')}`);
  assert.equal(new Set(keys).size, keys.length, 'duplicate option sets');
  for (const set of choices) assert.equal(set.length, correct.length, 'option length gives the answer away');
});

test('moveset choices are empty when the species has no alternative moves to offer', () => {
  const correct = [moveById.get('COUNTER')!, moveById.get('ICE_PUNCH')!];
  assert.deepEqual(buildMovesetChoices(correct, [], [], rng()), []);
});

// --- deck assembly -----------------------------------------------------------

test('every shipped league builds a deck where each card has a valid answer', () => {
  for (const id of DRILL_LEAGUE_IDS) {
    const deck = buildDeck(drillLeagues[id].species, moveById, { mode: 'mixed' }, rng());
    assert.ok(deck.length >= 30, `${id} deck too small: ${deck.length}`);
    for (const card of deck) {
      assert.ok(card.choices.length >= 2, `${card.key} has fewer than two options`);
      assert.ok(card.answerIndex >= 0 && card.answerIndex < card.choices.length, `${card.key} answerIndex out of range`);
    }
  }
});

test('a count card answers with the first throw from zero energy', () => {
  const deck = buildDeck(drillLeagues.great.species, moveById, { mode: 'count' }, rng());
  for (const card of deck as CountCard[]) {
    assert.equal(card.kind, 'count');
    assert.equal(card.choices[card.answerIndex], card.cadence[0]);
  }
});

test('a moveset card answers with the recommended set', () => {
  const deck = buildDeck(drillLeagues.great.species, moveById, { mode: 'moveset' }, rng());
  for (const card of deck as MovesetCard[]) {
    assert.equal(card.kind, 'moveset');
    assert.equal(card.choices[card.answerIndex], card.moves);
  }
});

test('mode filters the deck to a single card kind', () => {
  const counts = buildDeck(drillLeagues.great.species, moveById, { mode: 'count' }, rng());
  const movesets = buildDeck(drillLeagues.great.species, moveById, { mode: 'moveset' }, rng());
  assert.ok(counts.every((c) => c.kind === 'count'));
  assert.ok(movesets.every((c) => c.kind === 'moveset'));
  assert.ok(counts.length > movesets.length, 'a species yields more count cards than moveset cards');
});

test('the hard-cadence filter keeps only shifting cadences', () => {
  const deck = buildDeck(
    drillLeagues.great.species,
    moveById,
    { mode: 'count', difficulties: ['shifting'] },
    rng()
  );
  assert.ok(deck.length > 0, 'no shifting-cadence cards in the Great League deck');
  for (const card of deck as CountCard[]) {
    assert.equal(cadenceDifficulty(card.cadence), 'shifting');
  }
});

test('deck generation is deterministic for a given seed', () => {
  const a = buildDeck(drillLeagues.great.species, moveById, { mode: 'mixed' }, mulberry32(7));
  const b = buildDeck(drillLeagues.great.species, moveById, { mode: 'mixed' }, mulberry32(7));
  assert.deepEqual(a.map((c) => c.key), b.map((c) => c.key));
});

// --- deck data ---------------------------------------------------------------

test('decks reference only moves that exist in moves.json', () => {
  for (const id of DRILL_LEAGUE_IDS) {
    for (const s of drillLeagues[id].species) {
      for (const moveId of [...s.moveset, ...s.fastPool, ...s.chargedPool]) {
        assert.ok(moveById.has(moveId), `${id}/${s.id} references unknown move ${moveId}`);
      }
    }
  }
});

test('decks carry no Shadow or size variants — they duplicate their base form counts', () => {
  for (const id of DRILL_LEAGUE_IDS) {
    for (const s of drillLeagues[id].species) {
      assert.ok(!/_shadow|_xs|_xl/.test(s.id), `${id} deck contains variant ${s.id}`);
    }
  }
});

test('Little League is not offered — its roster is pre-evolutions, not what you count against', () => {
  assert.deepEqual([...DRILL_LEAGUE_IDS], ['great', 'ultra', 'master']);
  assert.equal(drillLeagues.little, undefined);
});

// --- move pools (the "count any Pokémon" lookup) ------------------------------

test('every species in the pool data can produce at least one count', () => {
  assert.ok(poolSpecies.length > 1000, `only ${poolSpecies.length} species`);
  for (const s of poolSpecies) {
    const fast = poolMoves[s.fast[0]];
    const charged = poolMoves[s.charged[0]];
    assert.ok(fast, `${s.id}: fast move ${s.fast[0]} missing from the pool move table`);
    assert.ok(charged, `${s.id}: charged move ${s.charged[0]} missing from the pool move table`);
    const cadence = cadenceCounts(charged.energy, fast.energyGain);
    assert.equal(cadence.length, 4, s.id);
    for (const c of cadence) assert.ok(c > 0, `${s.id} produced count ${c}`);
  }
});

test('pool moves agree with moves.json — the lookup and the chart cannot disagree', () => {
  for (const [id, m] of Object.entries(poolMoves)) {
    const canonical = moveById.get(id);
    assert.ok(canonical, `${id} is not in moves.json`);
    assert.equal(m.energy, canonical!.energy, `${id} energy`);
    assert.equal(m.energyGain, canonical!.energyGain, `${id} energyGain`);
  }
});

test('the pool covers every species the drill decks use', () => {
  const pooled = new Set(poolSpecies.map((s) => s.id));
  for (const id of DRILL_LEAGUE_IDS) {
    for (const s of drillLeagues[id].species) {
      assert.ok(pooled.has(s.id), `${s.id} is drilled but not searchable in the lookup`);
    }
  }
});
