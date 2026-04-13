import translationsData from '../data/translations.json' with { type: 'json' };
import type { LocaleDictionary } from './game-data';

// Precompute per-locale slices once at module load so Astro's per-page
// frontmatter doesn't re-filter ~2000 keys for every one of the 110 pages.
// Two shapes × 10 locales = 20 filter passes total instead of 110+.

const all = translationsData as Record<string, LocaleDictionary>;

const buildMap = (prefix: string): Record<string, LocaleDictionary> => {
  const out: Record<string, LocaleDictionary> = {};
  for (const [lang, dict] of Object.entries(all)) {
    const bucket: LocaleDictionary = {};
    for (const [k, v] of Object.entries(dict)) {
      if (k.startsWith(prefix)) bucket[k] = v;
    }
    out[lang] = bucket;
  }
  return out;
};

const moveSlices = buildMap('move');
const pokemonSlices = buildMap('pokemon');

const EMPTY: LocaleDictionary = {};

export const getMoveTranslations = (lang: string): LocaleDictionary =>
  moveSlices[lang] ?? moveSlices.en ?? EMPTY;

export const getPokemonTranslations = (lang: string): LocaleDictionary =>
  pokemonSlices[lang] ?? pokemonSlices.en ?? EMPTY;
