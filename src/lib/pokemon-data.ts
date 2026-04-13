import pokemonData from '../data/pokemon.json' with { type: 'json' };
import type { Pokemon } from './game-data';

export const pokemon: Pokemon[] = pokemonData as Pokemon[];
