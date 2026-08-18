import { readJson, writeJson } from './lib.js';

// Builds the move pool every species can actually learn, so /move-counts can
// count *any* Pokémon rather than only the meta 30 the drill decks cover.
//
// Deliberately not a copy of pokemon.json + moves.json: those two are 296 KB
// together and carry stats, tags and buff tables the counter never reads. This
// ships ids, names and the four numbers a count needs (~138 KB raw / 32 KB gz).
//
// Runs after sync-gamemaster.js — it validates every move id against the
// moves.json that script writes, so a move dropped by MOVE_DENYLIST there can
// never survive here.

const GAMEMASTER_PATH = '/Users/sidon/Developer/projects/flutter/battle_flow_assets/v1/gamemaster.json';
const MOVES_FILE = 'src/data/moves.json';
const POKEMON_FILE = 'src/data/pokemon.json';
const OUT_FILE = 'src/data/move-pools.json';

/** Same collapse as sync-drill-decks.js: variants share their base form's energetics. */
const normalizeSpeciesId = (id) => id.replace(/_shadow/g, '').replace(/_xs/g, '').replace(/_xl/g, '');

const gamemaster = readJson(GAMEMASTER_PATH);
const moveById = new Map(readJson(MOVES_FILE).map((m) => [m.id, m]));
const pokemonById = new Map(readJson(POKEMON_FILE).map((p) => [p.id, p]));

const isFast = (id) => (moveById.get(id)?.energyGain ?? 0) > 0;
const isCharged = (id) => (moveById.get(id)?.energy ?? 0) > 0;

const species = [];
const seen = new Set();
const usedMoves = new Set();
const skipped = [];

for (const entry of gamemaster.pokemon) {
  const id = normalizeSpeciesId(entry.speciesId);
  if (seen.has(id)) continue;
  if (!entry.released) continue;

  const mon = pokemonById.get(id);
  if (!mon) {
    skipped.push(`${entry.speciesId} -> base "${id}" not in ${POKEMON_FILE}`);
    continue;
  }

  const fast = (entry.fastMoves ?? []).filter(isFast);
  const charged = (entry.chargedMoves ?? []).filter(isCharged);
  // A species with no legal fast/charged pair has no count to show.
  if (!fast.length || !charged.length) {
    skipped.push(`${entry.speciesId} -> no usable fast/charged pair`);
    continue;
  }

  seen.add(id);
  species.push({ id, dex: mon.dex, name: mon.name, fast, charged });
  for (const m of [...fast, ...charged]) usedMoves.add(m);
}

// Only the moves something can actually learn, in the four fields a count needs.
const moves = {};
for (const id of [...usedMoves].sort()) {
  const m = moveById.get(id);
  moves[id] = { name: m.name, type: m.type, energy: m.energy, energyGain: m.energyGain };
}

const payload = { moves, species };
writeJson(OUT_FILE, payload);

const combos = species.reduce((n, s) => n + s.fast.length * s.charged.length, 0);
const bytes = Buffer.byteLength(JSON.stringify(payload));
console.log(`  ${species.length} species, ${Object.keys(moves).length} moves, ${combos} fast x charged combos`);
console.log(`\nWrote ${OUT_FILE} (${(bytes / 1024).toFixed(1)} KB)`);
if (skipped.length) {
  console.log(`\nSkipped ${skipped.length} gamemaster entries:`);
  for (const s of skipped.slice(0, 10)) console.log(`  - ${s}`);
  if (skipped.length > 10) console.log(`  ... and ${skipped.length - 10} more`);
}
