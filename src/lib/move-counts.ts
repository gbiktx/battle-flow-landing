// Card generation for the /move-counts drill.
//
// This is a port of the app's flashcard model — `move_flashcard.dart` and
// `flashcard_deck_builder.dart` in battle_flow-v4. The port is deliberate and
// mechanical: a count taught here must be the count taught in the app, and the
// distractors must be equally plausible, or the web drill trains the wrong
// reflex. Keep the two in step when either changes.
//
// The one intentional divergence: the app identifies the correct moveset option
// by Dart instance identity; JSON round-trips and React keys make that fragile
// here, so a card carries an explicit `answerIndex`, resolved by move ids rather
// than by array reference.

import type { Move } from './game-data';

export interface DrillSpecies {
  id: string;
  /** [fast, charged1, charged2?] — PvPoke's default set, as the app drills it. */
  moveset: string[];
  /** The species' own fast/charged moves, most-used first: the distractor pools. */
  fastPool: string[];
  chargedPool: string[];
}

export interface DrillLeague {
  id: string;
  cp: number;
  species: DrillSpecies[];
}

/** Which drill a session runs. Mirrors the app's trainer mode toggle. */
export type DrillMode = 'count' | 'moveset' | 'mixed';

export interface CountCard {
  kind: 'count';
  /** Stable identity — the app's `masteryKey`: (species, charged move). */
  key: string;
  speciesId: string;
  fast: Move;
  charged: Move;
  /** Throws-to-charge for four consecutive charges, with energy carryover. */
  cadence: number[];
  choices: number[];
  answerIndex: number;
}

export interface MovesetCard {
  kind: 'moveset';
  key: string;
  speciesId: string;
  moves: Move[];
  choices: Move[][];
  answerIndex: number;
}

export type DrillCard = CountCard | MovesetCard;

export type Rng = () => number;

/** Seedable PRNG so deck generation is reproducible in tests. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates, returning a new array. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Throws of a fast move gaining [gain] energy needed to reach four consecutive
 * charges of a move costing [energy], carrying leftover energy between charges.
 * Port of `cadenceCounts` in move_flashcard.dart.
 */
export function cadenceCounts(energy: number, gain: number): number[] {
  if (gain <= 0) return [];
  const counts: number[] = [];
  let e = 0;
  for (let n = 1; n <= 4; n++) {
    const count = Math.ceil((energy - e) / gain);
    counts.push(count);
    e += count * gain - energy;
  }
  return counts;
}

/**
 * A constant cadence collapses first-throw and steady into one easy fact; a
 * cadence that shifts is the genuinely hard card. Derived, never hand-tagged.
 */
export type CadenceDifficulty = 'steady' | 'shifting';

export function cadenceDifficulty(cadence: number[]): CadenceDifficulty {
  return new Set(cadence).size <= 1 ? 'steady' : 'shifting';
}

export const formatCadence = (cadence: number[]): string => cadence.join(' | ');

/** The answer plus up to three near-miss distractors, ascending. */
export function buildCountChoices(answer: number, rng: Rng): number[] {
  if (answer <= 0) return [];
  const distractors = new Set<number>();
  for (let d = 1; d <= 4 && distractors.size < 6; d++) {
    if (answer - d > 0) distractors.add(answer - d);
    distractors.add(answer + d);
  }
  const picked = shuffle([...distractors], rng).slice(0, 3);
  const options = [...new Set([answer, ...picked])].sort((a, b) => a - b);
  return options.length >= 2 ? options : [];
}

const chargedKey = (charged: Move[]) => charged.map((m) => m.id).sort().join('+');
const fullKey = (set: Move[]) => `${set[0].id}>${chargedKey(set.slice(1))}`;

/**
 * Candidate movesets for the recognition drill: the correct set plus up to three
 * distractors built from the species' *own* move pools. Same-species distractors
 * are what make the card hard — a wrong option has to be a set the Pokémon could
 * plausibly run. Varying the fast move too keeps the type chips from giving the
 * fast slot away. Empty when neither pool can produce a distinct option.
 */
export function buildMovesetChoices(
  correct: Move[],
  chargedPool: Move[],
  fastPool: Move[],
  rng: Rng
): Move[][] {
  if (correct.length === 0) return [];
  const correctFast = correct[0];
  const correctCharged = correct.slice(1);
  if (correctCharged.length === 0) return [];

  const correctChargedIds = new Set(correctCharged.map((m) => m.id));
  const altCharged = shuffle(chargedPool.filter((m) => !correctChargedIds.has(m.id)), rng);
  const altFast = shuffle(fastPool.filter((m) => m.id !== correctFast.id), rng);

  if (altCharged.length === 0 && altFast.length === 0) return [];

  // Charged sets the same size as the recommended set, so options stay
  // indistinguishable by shape alone.
  const chargedSets: Move[][] = [correctCharged];
  if (correctCharged.length === 1) {
    for (const alt of altCharged) chargedSets.push([alt]);
  } else {
    for (const alt of altCharged) {
      chargedSets.push([correctCharged[0], alt]);
      chargedSets.push([alt, correctCharged[1]]);
    }
    for (let i = 0; i < altCharged.length; i++) {
      for (let j = i + 1; j < altCharged.length; j++) {
        chargedSets.push([altCharged[i], altCharged[j]]);
      }
    }
  }

  const fasts = [correctFast, ...altFast];
  const seen = new Set<string>([fullKey(correct)]);
  const distractors: Move[][] = [];
  for (const f of fasts) {
    for (const cs of chargedSets) {
      const candidate = [f, ...cs];
      const key = fullKey(candidate);
      if (!seen.has(key)) {
        seen.add(key);
        distractors.push(candidate);
      }
    }
  }
  if (distractors.length === 0) return [];

  return shuffle([correct, ...shuffle(distractors, rng).slice(0, 3)], rng);
}

export function buildCountCard(speciesId: string, fast: Move, charged: Move, rng: Rng): CountCard {
  const cadence = cadenceCounts(charged.energy, fast.energyGain);
  const answer = cadence[0] ?? 0;
  const choices = buildCountChoices(answer, rng);
  return {
    kind: 'count',
    key: `${speciesId}|${charged.id}`,
    speciesId,
    fast,
    charged,
    cadence,
    choices,
    answerIndex: choices.indexOf(answer),
  };
}

export function buildMovesetCard(
  speciesId: string,
  moves: Move[],
  chargedPool: Move[],
  fastPool: Move[],
  rng: Rng
): MovesetCard {
  const choices = buildMovesetChoices(moves, chargedPool, fastPool, rng);
  // By id, not `choices.indexOf(moves)` — reference identity survives only as
  // long as buildMovesetChoices hands back the very array it was given.
  const answer = fullKey(moves);
  return {
    kind: 'moveset',
    key: `${speciesId}|moveset`,
    speciesId,
    moves,
    choices,
    answerIndex: choices.findIndex((set) => fullKey(set) === answer),
  };
}

interface BuildDeckOptions {
  mode: DrillMode;
  /** Keep only count cards of these difficulties. Omit for all. */
  difficulties?: CadenceDifficulty[];
}

/**
 * One count card per (species, charged move) plus one moveset card per species,
 * shuffled. Cards that can't offer at least two options are dropped — the web
 * drill is multiple-choice only, with no reveal-and-self-grade fallback.
 */
export function buildDeck(
  species: readonly DrillSpecies[],
  moveById: ReadonlyMap<string, Move>,
  { mode, difficulties }: BuildDeckOptions,
  rng: Rng
): DrillCard[] {
  const cards: DrillCard[] = [];

  for (const entry of species) {
    const [fastId, ...chargedIds] = entry.moveset;
    const fast = moveById.get(fastId);
    if (!fast || fast.energyGain <= 0) continue;

    const charged = chargedIds
      .map((id) => moveById.get(id))
      .filter((m): m is Move => Boolean(m) && (m as Move).energy > 0);
    if (charged.length === 0) continue;

    if (mode !== 'moveset') {
      for (const move of charged) {
        const card = buildCountCard(entry.id, fast, move, rng);
        if (card.choices.length < 2 || card.answerIndex < 0) continue;
        if (difficulties && !difficulties.includes(cadenceDifficulty(card.cadence))) continue;
        cards.push(card);
      }
    }

    if (mode !== 'count') {
      const resolvePool = (ids: string[], predicate: (m: Move) => boolean) =>
        ids.map((id) => moveById.get(id)).filter((m): m is Move => Boolean(m) && predicate(m as Move));

      const card = buildMovesetCard(
        entry.id,
        [fast, ...charged],
        resolvePool(entry.chargedPool, (m) => m.energy > 0),
        resolvePool(entry.fastPool, (m) => m.energyGain > 0),
        rng
      );
      if (card.choices.length >= 2 && card.answerIndex >= 0) cards.push(card);
    }
  }

  return shuffle(cards, rng);
}
