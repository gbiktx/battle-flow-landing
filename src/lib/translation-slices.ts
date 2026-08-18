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

/**
 * Narrow a locale slice to the keys one island actually renders.
 *
 * Island props are serialized into the page HTML, so handing a component the
 * full 1,740-species dictionary costs ~110 KB of markup *per island*. Passing
 * only the ids a component can display keeps that off pages that mount more
 * than one.
 */
export const pickTranslations = (dict: LocaleDictionary, keys: readonly string[]): LocaleDictionary => {
  const out: LocaleDictionary = {};
  for (const k of keys) {
    const v = dict[k];
    if (v !== undefined) out[k] = v;
  }
  return out;
};
