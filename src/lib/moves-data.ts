import movesData from '../data/moves.json' with { type: 'json' };
import type { Move } from './game-data';

export const moves: Move[] = movesData as Move[];
