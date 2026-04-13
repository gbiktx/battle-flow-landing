import fs from 'node:fs';
import { readJson, writeJson } from './lib.js';

const GAMEMASTER_PATH = '/Users/sidon/Developer/projects/flutter/battle_flow_assets/v1/gamemaster.json';
const MOVES_OUT = 'src/data/moves.json';
const POKEMON_OUT = 'src/data/pokemon.json';

// Moves the gamemaster lists as non-`unlisted` but that we don't want in MoveDex
// (Pokémon-specific signature variants, etc.).
const MOVE_DENYLIST = new Set([
  'HYDRO_PUMP_BLASTOISE',
]);

const MOVE_FIELDS = [
  'name',
  'type',
  'power',
  'energy',
  'energyGain',
  'turns',
  'buffs',
  'buffsSelf',
  'buffsOpponent',
  'buffTarget',
  'buffApplyChance',
];

const pickMove = (src) => {
  const out = { id: src.moveId };
  for (const f of MOVE_FIELDS) {
    if (src[f] !== undefined) out[f] = src[f];
  }
  return out;
};

const pickPokemon = (src) => {
  const out = {
    dex: src.dex,
    id: src.speciesId,
    name: src.speciesName,
    atk: src.baseStats.atk,
    def: src.baseStats.def,
    hp: src.baseStats.hp,
    types: src.types.filter((t) => t && t !== 'none'),
    tags: src.tags ?? [],
  };
  if (src.family?.evolutions?.length) out.evolutions = src.family.evolutions;
  return out;
};

const loadPreviousIds = (path) => {
  if (!fs.existsSync(path)) return new Set();
  try { return new Set(readJson(path).map((x) => x.id)); }
  catch { return new Set(); }
};

const previousMoveIds = loadPreviousIds(MOVES_OUT);
const previousPokemonIds = loadPreviousIds(POKEMON_OUT);

console.log(`Reading gamemaster from ${GAMEMASTER_PATH}`);
const gm = readJson(GAMEMASTER_PATH);

const skippedUnlisted = [];
const skippedDenylist = [];
const moves = [];
for (const raw of gm.moves) {
  if (raw.unlisted) {
    skippedUnlisted.push(raw.moveId);
    continue;
  }
  if (MOVE_DENYLIST.has(raw.moveId)) {
    skippedDenylist.push(raw.moveId);
    continue;
  }
  moves.push(pickMove(raw));
}
moves.sort((a, b) => a.id.localeCompare(b.id));

const pokemon = gm.pokemon.map(pickPokemon);

writeJson(MOVES_OUT, moves, { pretty: true });
writeJson(POKEMON_OUT, pokemon);

const currentMoveIds = new Set(moves.map((m) => m.id));
const currentPokemonIds = new Set(pokemon.map((p) => p.id));
const newMoveIds = [...currentMoveIds].filter((id) => !previousMoveIds.has(id));
const removedMoveIds = [...previousMoveIds].filter((id) => !currentMoveIds.has(id));
const newPokemonIds = [...currentPokemonIds].filter((id) => !previousPokemonIds.has(id));
const removedPokemonIds = [...previousPokemonIds].filter((id) => !currentPokemonIds.has(id));

console.log(`\nWrote ${MOVES_OUT} (${moves.length} moves; skipped ${skippedUnlisted.length} unlisted, ${skippedDenylist.length} denylisted)`);
console.log(`Wrote ${POKEMON_OUT} (${pokemon.length} entries)`);

if (newMoveIds.length) console.log(`\n+ new moves (${newMoveIds.length}):\n  ${newMoveIds.join(', ')}`);
if (removedMoveIds.length) console.log(`\n- removed moves (${removedMoveIds.length}):\n  ${removedMoveIds.join(', ')}`);
if (newPokemonIds.length) console.log(`\n+ new pokemon (${newPokemonIds.length}):\n  ${newPokemonIds.slice(0, 20).join(', ')}${newPokemonIds.length > 20 ? ', ...' : ''}`);
if (removedPokemonIds.length) console.log(`\n- removed pokemon (${removedPokemonIds.length}):\n  ${removedPokemonIds.slice(0, 20).join(', ')}${removedPokemonIds.length > 20 ? ', ...' : ''}`);

console.log('\nNext: npm run sync:translations');
