import { readJson, moveKey, pokemonKey } from './lib.js';

const MOVES_FILE = 'src/data/moves.json';
const POKEMON_FILE = 'src/data/pokemon.json';
const TRANSLATIONS_FILE = 'src/data/translations.json';

const VALID_TYPES = new Set([
  'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying',
  'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock',
  'steel', 'water',
]);

// Locale → whether pokemon translations are expected. Flutter assets have no pt pokemon file.
const LOCALE_EXPECTS_POKEMON = {
  en: true, es: true, fr: true, de: true, it: true,
  pt: false,
  'zh-Hans': true, 'zh-Hant': true, ja: true, ko: true,
};

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const isFiniteNum = (v) => typeof v === 'number' && Number.isFinite(v);

// --- moves.json ---
const moves = readJson(MOVES_FILE);
if (!Array.isArray(moves)) err(`${MOVES_FILE}: expected array`);

const moveIds = new Set();
for (const [i, m] of moves.entries()) {
  const where = `moves[${i}] ${m?.id ?? '<no id>'}`;
  if (!m || typeof m !== 'object') { err(`${where}: not an object`); continue; }

  for (const f of ['id', 'name', 'type']) {
    if (typeof m[f] !== 'string' || !m[f]) err(`${where}: missing/invalid string field "${f}"`);
  }
  for (const f of ['power', 'energy', 'energyGain', 'turns']) {
    if (!isFiniteNum(m[f])) err(`${where}: missing/invalid number field "${f}"`);
  }

  if (moveIds.has(m.id)) err(`${where}: duplicate id`);
  moveIds.add(m.id);

  if (!VALID_TYPES.has(m.type)) err(`${where}: unknown type "${m.type}"`);

  if (isFiniteNum(m.power) && m.power < 0) err(`${where}: negative power ${m.power}`);
  if (isFiniteNum(m.energy) && m.energy < 0) err(`${where}: negative energy ${m.energy}`);
  if (isFiniteNum(m.energyGain) && m.energyGain < 0) err(`${where}: negative energyGain ${m.energyGain}`);
  if (isFiniteNum(m.turns) && m.turns < 1) err(`${where}: turns must be >= 1, got ${m.turns}`);

  const isFast = m.energyGain > 0;
  const isCharged = m.energy > 0;
  if (isFast && isCharged) err(`${where}: cannot have both energy and energyGain`);
  if (!isFast && !isCharged) err(`${where}: has neither energy nor energyGain — not a valid fast or charged move`);

  if (m.buffs !== undefined) {
    if (!Array.isArray(m.buffs) || m.buffs.length !== 2) err(`${where}: buffs must be [atk, def]`);
    if (!m.buffTarget && !m.buffsSelf && !m.buffsOpponent) err(`${where}: has buffs but no buffTarget / buffsSelf / buffsOpponent`);
    if (m.buffTarget && !['self', 'opponent', 'both'].includes(m.buffTarget)) {
      err(`${where}: invalid buffTarget "${m.buffTarget}"`);
    }
    if (m.buffApplyChance !== undefined) {
      const c = parseFloat(m.buffApplyChance);
      if (!(c > 0 && c <= 1)) err(`${where}: buffApplyChance must be (0, 1], got ${m.buffApplyChance}`);
    }
  }
}

// --- pokemon.json ---
const pokemon = readJson(POKEMON_FILE);
if (!Array.isArray(pokemon)) err(`${POKEMON_FILE}: expected array`);

const pokemonIds = new Set();
for (const [i, p] of pokemon.entries()) {
  const where = `pokemon[${i}] ${p?.id ?? '<no id>'}`;
  if (!p || typeof p !== 'object') { err(`${where}: not an object`); continue; }

  for (const f of ['id', 'name']) {
    if (typeof p[f] !== 'string' || !p[f]) err(`${where}: missing/invalid string field "${f}"`);
  }
  for (const f of ['dex', 'atk', 'def', 'hp']) {
    if (!isFiniteNum(p[f])) err(`${where}: missing/invalid number field "${f}"`);
  }
  if (!Array.isArray(p.types)) err(`${where}: types must be array`);
  if (!Array.isArray(p.tags)) err(`${where}: tags must be array`);

  if (pokemonIds.has(p.id)) err(`${where}: duplicate id`);
  pokemonIds.add(p.id);

  if (Array.isArray(p.types)) {
    if (p.types.length === 0) err(`${where}: types array is empty`);
    if (p.types.length > 2) err(`${where}: more than 2 types`);
    for (const t of p.types) {
      if (!VALID_TYPES.has(t)) err(`${where}: unknown type "${t}"`);
    }
  }

  if (isFiniteNum(p.atk) && p.atk <= 0) err(`${where}: atk must be > 0`);
  if (isFiniteNum(p.def) && p.def <= 0) err(`${where}: def must be > 0`);
  if (isFiniteNum(p.hp) && p.hp <= 0) err(`${where}: hp must be > 0`);

  if (p.evolutions !== undefined && !Array.isArray(p.evolutions)) {
    err(`${where}: evolutions must be array if present`);
  }
}

// Evolution references must point to existing pokemon.
for (const p of pokemon) {
  if (!Array.isArray(p.evolutions)) continue;
  for (const ev of p.evolutions) {
    if (!pokemonIds.has(ev)) warn(`pokemon ${p.id}: evolution "${ev}" is not a known pokemon id`);
  }
}

// --- translations.json ---
const translations = readJson(TRANSLATIONS_FILE);
const LOCALES = Object.keys(translations);

// 'en' must cover every move & pokemon — it's the fallback layer for everything else.
const en = translations.en ?? {};
for (const id of moveIds) {
  if (!en[moveKey(id)]) err(`translations.en: missing ${moveKey(id)} (move ${id})`);
}
for (const id of pokemonIds) {
  if (!en[pokemonKey(id)]) warn(`translations.en: missing ${pokemonKey(id)} (pokemon ${id})`);
}

// Non-en locales: warn on missing. Skip pokemon for locales that don't source them (e.g. pt).
for (const loc of LOCALES) {
  if (loc === 'en') continue;
  const bucket = translations[loc] ?? {};
  let missingMoves = 0;
  let missingPokemon = 0;
  for (const id of moveIds) if (!bucket[moveKey(id)]) missingMoves++;
  if (LOCALE_EXPECTS_POKEMON[loc]) {
    for (const id of pokemonIds) if (!bucket[pokemonKey(id)]) missingPokemon++;
  }
  if (missingMoves > 0) warn(`translations.${loc}: missing ${missingMoves} move keys`);
  if (missingPokemon > 0) warn(`translations.${loc}: missing ${missingPokemon} pokemon keys`);
}

// --- report ---
const pad = (n) => String(n).padStart(4);
console.log(`\nValidation report`);
console.log(`  moves.json:        ${pad(moves.length)} entries`);
console.log(`  pokemon.json:      ${pad(pokemon.length)} entries`);
console.log(`  translations.json: ${pad(LOCALES.length)} locales`);
console.log(`  errors:   ${errors.length}`);
console.log(`  warnings: ${warnings.length}`);

if (warnings.length) {
  console.log(`\nWarnings:`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
  console.log(`\nErrors:`);
  for (const e of errors) console.log(`  - ${e}`);
  process.exit(1);
}
console.log(`\nOK`);
