import fs from 'node:fs';

export const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

export const writeJson = (p, data, { pretty = false } = {}) =>
  fs.writeFileSync(p, pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data));

// Mirrors `toCamelCase` in src/lib/game-data.ts. The two implementations form a
// cross-language contract for translation-key shape — validate-data.js enforces
// consistency by checking that every move/pokemon has a matching key in the en
// translations bucket.
export const toCamelCase = (str) =>
  str
    .toLowerCase()
    .split('_')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join('');

export const moveKey = (id) => `move${toCamelCase(id)}`;
export const pokemonKey = (id) => `pokemon${toCamelCase(id)}`;
