import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

import {
  buildDeck,
  mulberry32,
  type DrillCard,
  type DrillLeague,
  type DrillMode,
} from '../../src/lib/move-counts.ts';
import type { Move } from '../../src/lib/game-data.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// Read the datasets straight off disk. `src/lib/moves-data.ts` and
// `drill-data.ts` import JSON with import attributes, which the test runner's
// transform does not have to support — the files are the same either way.
const readData = <T>(file: string): T =>
  JSON.parse(fs.readFileSync(path.join(root, 'src/data', file), 'utf8')) as T;

export const moves = readData<Move[]>('moves.json');
export const moveById = new Map(moves.map((m) => [m.id, m]));

export const drillLeagues = readData<{ leagues: Record<string, DrillLeague> }>('drill-decks.json').leagues;

/** Powers the "count any Pokémon" lookup — every released species and its move pool. */
export const movePools = readData<{
  moves: Record<string, { name: string; type: string; energy: number; energyGain: number }>;
  species: { id: string; dex: number; name: string; fast: string[]; charged: string[] }[];
}>('move-pools.json');

/**
 * Must match `INITIAL_SEED` in src/components/MoveCountDrill.tsx. The first deck
 * a visitor sees is deliberately deterministic (a random seed in a `useState`
 * initializer would differ between the prerender and hydration), which is what
 * lets these tests assert on the exact cards.
 */
export const INITIAL_SEED = 20260818;
export const SESSION_LENGTH = 10;

/** The deck the page renders on a fresh load, before any replay reseeds it. */
export function initialDeck(leagueId = 'great', mode: DrillMode = 'mixed'): DrillCard[] {
  return buildDeck(drillLeagues[leagueId].species, moveById, { mode }, mulberry32(INITIAL_SEED)).slice(
    0,
    SESSION_LENGTH
  );
}

export const correctAnswer = (card: DrillCard) =>
  card.kind === 'count' ? String(card.choices[card.answerIndex]) : undefined;

/** Index of any option that is not the answer. */
export const wrongIndex = (card: DrillCard) => (card.answerIndex === 0 ? 1 : 0);

export interface TrackedEvent {
  event: string;
  props: Record<string, unknown>;
}

/**
 * Installs a `window.mixpanel` stub before the page loads and returns a reader
 * for what the page tracked.
 *
 * Only the React island's `trackEvent` calls land here. The `Store Click`
 * listener lives in Layout.astro's inline bootstrap and runs only when
 * PUBLIC_MIXPANEL_TOKEN is set, which it is not in a local build — store
 * buttons are asserted structurally instead (see the `data-placement` tests).
 */
export async function recordAnalytics(page: Page) {
  await page.addInitScript(() => {
    (window as any).__events = [];
    (window as any).mixpanel = {
      track: (event: string, props: Record<string, unknown> = {}) => {
        (window as any).__events.push({ event, props });
      },
    };
  });

  return {
    all: () => page.evaluate(() => (window as any).__events as TrackedEvent[]),
    named: async (name: string) =>
      (await page.evaluate(() => (window as any).__events as TrackedEvent[])).filter(
        (e) => e.event === name
      ),
  };
}
