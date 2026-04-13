// This module owns types and helpers only — no JSON imports.
// Concrete data lives in `moves-data.ts` and `pokemon-data.ts` so each feature
// page can import only the dataset it actually needs (Vite code-splits cleanly
// when the JSON side-effect is isolated in its own module).

export interface Move {
  id: string;
  name: string;
  type: string;
  power: number;
  energy: number;
  energyGain: number;
  turns: number;
  buffs?: number[];
  buffsSelf?: number[];
  buffsOpponent?: number[];
  buffTarget?: 'self' | 'opponent' | 'both';
  buffApplyChance?: string;
}

export interface Pokemon {
  dex: number;
  id: string;
  name: string;
  atk: number;
  def: number;
  hp: number;
  types: string[];
  tags: string[];
  evolutions?: string[];
}

export type LocaleDictionary = Record<string, string>;

export type MoveCategory = 'fast' | 'charged';

// Dex IDs whose form suffixes should NOT be appended to the sprite filename
// (forms render as base-dex sprites instead of getting a variant suffix).
const NO_QUALIFIER_DEX_IDS = new Set([
  29, 32, 122, 250, 474, 439, 782, 783, 784, 785, 786, 787, 788, 866, 1001, 1002, 1003, 1004,
]);

export function getSpritePath(p: Pick<Pokemon, 'dex' | 'id'>): string {
  const stripped = (p.id ?? '').replace('_xl', '').replace('_xs', '').replace('_shadow', '');
  let slug: string;
  if (stripped.includes('_alolan')) slug = `${p.dex}-alolan`;
  else if (stripped.includes('_galarian')) slug = `${p.dex}-galarian`;
  else if (stripped.includes('_hisuian')) slug = `${p.dex}-hisuian`;
  else if (stripped.includes('_') && !NO_QUALIFIER_DEX_IDS.has(p.dex)) {
    const [, ...rest] = stripped.split('_');
    slug = [p.dex, ...rest].join('-');
  } else {
    slug = `${p.dex}`;
  }
  return `/assets/images/sprites/${slug}.png`;
}

// Canonical translation-key builder. Must stay in sync with scripts/sync-translations.js.
// Inputs are raw IDs from moves.json / pokemon.json (e.g. "ACID_SPRAY", "charizard_mega_x").
const toCamelCase = (str: string) =>
  str
    .toLowerCase()
    .split('_')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join('');

export const moveKey = (id: string) => `move${toCamelCase(id)}`;
export const pokemonKey = (id: string) => `pokemon${toCamelCase(id)}`;

export const getMoveName = (id: string, fallback: string, dict: LocaleDictionary): string =>
  dict[moveKey(id)] ?? fallback;

export const getPokemonName = (id: string, fallback: string, dict: LocaleDictionary): string =>
  dict[pokemonKey(id)] ?? fallback;

export const TYPE_COLORS: Record<string, string> = {
  bug: '#aec92c',
  dark: '#6e7681',
  dragon: '#067fc4',
  electric: '#fedf6b',
  fairy: '#f6a7e8',
  fighting: '#e34448',
  fire: '#feb04b',
  flying: '#a7c1f2',
  ghost: '#7571d0',
  grass: '#59c079',
  ground: '#d2976b',
  ice: '#94ddd6',
  normal: '#a3a49e',
  poison: '#a662c7',
  psychic: '#fda194',
  rock: '#d7cd90',
  steel: '#5aafb4',
  water: '#6ac7e9',
};

export const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
