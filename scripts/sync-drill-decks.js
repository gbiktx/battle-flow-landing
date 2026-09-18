import { readJson, writeJson } from './lib.js';

// Builds the /move-counts drill decks from the same PvPoke-derived rankings the
// app ships, so a count taught on the web matches the count taught in the app.
//
// The app's deck builder is `lib/ui/flashcards/model/flashcard_deck_builder.dart`
// in battle_flow-v4. Two rules are copied from it deliberately and must stay in
// step, or the web drill will teach a different fact than the app:
//   1. The moveset drilled is the ranking's `moveset` (PvPoke's default set) —
//      NOT `bfMoveset`, which is a display-only BattleFlow alternative.
//   2. Shadow / size variants collapse into their base species (identical move
//      energetics => identical counts), first occurrence wins.

const RANKINGS_DIR = '/Users/sidon/Developer/projects/flutter/battle_flow_assets/v1/rankings';
const MOVES_FILE = 'src/data/moves.json';
const POKEMON_FILE = 'src/data/pokemon.json';
const OUT_FILE = 'src/data/drill-decks.json';

// The formats Twilight Trails actually runs, per src/lib/gbl-schedule.ts. The
// `id`s are the keys the IV calculator already uses, so a league means the same
// thing on both pages; CHART_LEAGUE_IDS in src/lib/drill-data.ts must list
// exactly these, and tests/move-counts.test.ts fails the build if it does not.
//
// Little League is here for the chart only — the drill still skips it, because
// its roster is pre-evolutions nobody counts against in the everyday meta and
// PvPoke's 500 rankings are dominated by size variants (four Pumpkaboo) that
// collapse into one another. See DRILL_LEAGUE_IDS.
//
// The Fantasy Cup is deliberately absent: its ranking (fantasy-1500.json) is
// from 2026-05-20 while every other file here is current, so it would publish
// counts from a meta four months out of date. The season's Mega Color, Mega
// Halloween and Mega Catch cups are absent for a blunter reason — they have no
// ranking file at all.
//
// LAIC is 2027 here, matching PvPoke's ranking file and the app's own cup name,
// though Niantic's season post calls it the 2026 cup: it is the qualifier for
// the 2027 championship that opens at the end of this year. The GBL calendar
// says 2027 for the same reason.
const LEAGUES = [
  { id: 'great', cp: 1500, file: '1500.json' },
  { id: 'ultra', cp: 2500, file: '2500.json' },
  { id: 'master', cp: 10000, file: '10000.json' },
  { id: 'little', cp: 500, file: '500.json' },
  { id: 'megaGreat', cp: 1500, file: 'mega-1500.json' },
  { id: 'megaUltra', cp: 2500, file: 'mega-2500.json' },
  { id: 'megaMaster', cp: 10000, file: 'mega-10000.json' },
  { id: 'willpower', cp: 1500, file: 'willpower-1500.json' },
  { id: 'retro', cp: 1500, file: 'retro-1500.json' },
  { id: 'laic2027', cp: 1500, file: 'laic2027-1500.json' },
];

// Species per deck. The app caps a custom deck at 40; 30 keeps the shipped JSON
// small while still giving a 10-card session plenty of variety.
const MAX_SPECIES = 30;
// Distractor pools only ever need enough moves to fill three wrong options.
const MAX_POOL = 6;

/** Mirrors `normalizeThreatFamilyId` in the app's lib/core/threat_pool_utils.dart. */
const normalizeSpeciesId = (id) => id.replace(/_shadow/g, '').replace(/_xs/g, '').replace(/_xl/g, '');

const moves = readJson(MOVES_FILE);
const pokemon = readJson(POKEMON_FILE);
const moveById = new Map(moves.map((m) => [m.id, m]));
const pokemonIds = new Set(pokemon.map((p) => p.id));

const isFast = (id) => (moveById.get(id)?.energyGain ?? 0) > 0;
const isCharged = (id) => (moveById.get(id)?.energy ?? 0) > 0;

/** Move ids from a ranking move pool, most-used first, deduped and resolvable. */
const pool = (entries, predicate) =>
  [...(entries ?? [])]
    .sort((a, b) => (b.uses ?? 0) - (a.uses ?? 0))
    .map((m) => m.moveId)
    .filter((id, i, all) => all.indexOf(id) === i && moveById.has(id) && predicate(id))
    .slice(0, MAX_POOL);

const skipped = [];

function buildDeck({ id, cp, file }) {
  const ranking = readJson(`${RANKINGS_DIR}/${file}`);
  const species = [];
  const seenBase = new Set();

  for (const entry of ranking.entries) {
    if (species.length >= MAX_SPECIES) break;

    const baseId = normalizeSpeciesId(entry.speciesId);
    if (seenBase.has(baseId)) continue;

    // The card renders the base form's sprite and name, so the base form has to
    // exist in the landing dataset even when only its Shadow variant ranks.
    if (!pokemonIds.has(baseId)) {
      skipped.push(`${id}: ${entry.speciesId} -> base "${baseId}" not in ${POKEMON_FILE}`);
      continue;
    }

    const moveset = entry.moveset ?? [];
    const [fastId, ...chargedIds] = moveset;
    const charged = chargedIds.filter(isCharged);
    if (!fastId || !isFast(fastId) || charged.length === 0) {
      skipped.push(`${id}: ${entry.speciesId} -> unusable moveset [${moveset.join(', ')}]`);
      continue;
    }

    seenBase.add(baseId);
    species.push({
      id: baseId,
      moveset: [fastId, ...charged],
      fastPool: pool(entry.rankingFastMoves, isFast),
      chargedPool: pool(entry.rankingChargedMoves, isCharged),
    });
  }

  return { id, cp, species };
}

const leagues = {};
for (const league of LEAGUES) {
  const deck = buildDeck(league);
  leagues[league.id] = deck;
  const cards = deck.species.reduce((n, s) => n + s.moveset.length, 0); // counts + 1 moveset card
  console.log(`  ${league.id.padEnd(7)} ${String(deck.species.length).padStart(2)} species -> ${cards} cards`);
}

writeJson(OUT_FILE, { leagues });

const bytes = Buffer.byteLength(JSON.stringify({ leagues }));
console.log(`\nWrote ${OUT_FILE} (${(bytes / 1024).toFixed(1)} KB)`);
if (skipped.length) {
  console.log(`\nSkipped ${skipped.length} ranking entries:`);
  for (const s of skipped.slice(0, 20)) console.log(`  - ${s}`);
  if (skipped.length > 20) console.log(`  ... and ${skipped.length - 20} more`);
}
