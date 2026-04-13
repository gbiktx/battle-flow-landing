import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson, moveKey, pokemonKey } from './lib.js';

const SOURCE_DIR = '/Users/sidon/Developer/projects/flutter/battle_flow_assets/localized_data';
const MOVES_JSON = 'src/data/moves.json';
const POKEMON_JSON = 'src/data/pokemon.json';
const OUT_FILE = 'src/data/translations.json';

// Landing-site locale → Flutter filename suffix (null = not available at source)
const LANG_MAP = {
  en: { moves: 'en', pokemon: 'en' },
  es: { moves: 'es', pokemon: 'es' },
  fr: { moves: 'fr', pokemon: 'fr' },
  de: { moves: 'de', pokemon: 'de' },
  it: { moves: 'it', pokemon: 'it' },
  pt: { moves: 'pt', pokemon: null },
  'zh-Hans': { moves: 'zh-Hans', pokemon: 'zh-Hans' },
  'zh-Hant': { moves: 'zh-Hant', pokemon: 'zh-Hant' },
  ja: { moves: 'ja', pokemon: 'ja' },
  ko: { moves: 'ko', pokemon: 'ko' },
};

const loadIfExists = (file) => (fs.existsSync(file) ? readJson(file) : null);
const loadMovesForLang = (suffix) =>
  loadIfExists(path.join(SOURCE_DIR, 'moves', `moves_${suffix}.json`));
const loadPokemonForLang = (suffix) =>
  suffix ? loadIfExists(path.join(SOURCE_DIR, 'pokemon', `pokemon_${suffix}.json`)) : null;

const moves = readJson(MOVES_JSON);
const pokemon = readJson(POKEMON_JSON);

const result = {};
const stats = {};

for (const [lang, { moves: movesSuffix, pokemon: pokemonSuffix }] of Object.entries(LANG_MAP)) {
  const localizedMoves = loadMovesForLang(movesSuffix);
  const localizedPokemon = loadPokemonForLang(pokemonSuffix);

  if (!localizedMoves) {
    console.warn(`[${lang}] missing moves file — skipping moves`);
  }
  if (pokemonSuffix && !localizedPokemon) {
    console.warn(`[${lang}] missing pokemon file — skipping pokemon`);
  }

  const bucket = {};
  let moveCount = 0;
  let pokemonCount = 0;
  let missingMoves = 0;
  let missingPokemon = 0;

  if (localizedMoves) {
    for (const move of moves) {
      const localized = localizedMoves[move.id];
      if (localized == null || localized === '') {
        missingMoves++;
        continue;
      }
      bucket[moveKey(move.id)] = localized;
      moveCount++;
    }
  }

  if (localizedPokemon) {
    for (const p of pokemon) {
      const localized = localizedPokemon[String(p.dex)];
      if (localized == null || localized === '') {
        missingPokemon++;
        continue;
      }
      bucket[pokemonKey(p.id)] = localized;
      pokemonCount++;
    }
  }

  result[lang] = bucket;
  stats[lang] = { moves: moveCount, pokemon: pokemonCount, missingMoves, missingPokemon };
}

writeJson(OUT_FILE, result);

console.log(`Wrote ${OUT_FILE}`);
console.table(stats);
