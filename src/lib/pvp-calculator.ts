import cpms from '../data/cpms.json' with { type: 'json' };
import type { Pokemon } from './game-data';

export type { Pokemon };

export interface IVs {
  atk: number;
  def: number;
  hp: number;
}

export interface Stats {
  atk: number;
  def: number;
  hp: number;
}

export interface RankEntry {
  rank: number;
  level: number;
  ivs: IVs;
  stats: Stats;
  cp: number;
  statProduct: number;
  perfection: number;
}

export const MAX_IV = 15;

/**
 * The CP caps that actually have a Mega format, so a Mega ceiling is worth
 * stating for them.
 *
 * ⛔ **Not 500.** No Mega is legal in a Little cup: PvPoke ships no mega cup at
 * that cap and BattleFlow's rankings are `mega-1500` / `mega-2500` /
 * `mega-10000`. A ceiling there is advice for a format that does not exist.
 *
 * ⛔ **Not 10000.** Uncapped in practice — every released Mega fits it at level
 * 50 — so `findBestLevelBeforeEvolution` returns `null` for all of them anyway.
 * Listing it here would just make the caller pay for 61 searches that can only
 * come back empty.
 */
export const MEGA_CAPS: readonly number[] = [1500, 2500];

export class PvPCalculator {
  static calculateCp(pokemon: Pokemon, ivs: IVs, level: number): number {
    const cpm = cpms[Math.round((level - 1) * 2)];
    const atk = pokemon.atk + ivs.atk;
    const def = Math.sqrt(pokemon.def + ivs.def);
    const hp = Math.sqrt(pokemon.hp + ivs.hp);
    return Math.floor((atk * def * hp * Math.pow(cpm, 2)) / 10);
  }

  static getActualStats(pokemon: Pokemon, ivs: IVs, level: number): Stats {
    const cpm = cpms[Math.round((level - 1) * 2)];
    return {
      atk: Number(((pokemon.atk + ivs.atk) * cpm).toFixed(2)),
      def: Number(((pokemon.def + ivs.def) * cpm).toFixed(2)),
      hp: Math.floor((pokemon.hp + ivs.hp) * cpm)
    };
  }

  static getStatProduct(pokemon: Pokemon, ivs: IVs, level: number): number {
    const stats = this.getActualStats(pokemon, ivs, level);
    return (stats.atk * stats.def * stats.hp) / 1000;
  }

  static findBestLevel(pokemon: Pokemon, ivs: IVs, maxCp: number, maxLevel: number = 50): { level: number; cp: number } {
    let bestLevel = 1;
    let bestCp = 10;

    for (let level = 1; level <= maxLevel; level += 0.5) {
      const cp = this.calculateCp(pokemon, ivs, level);
      if (cp <= maxCp) {
        bestLevel = level;
        bestCp = cp;
      } else {
        break;
      }
    }
    return { level: bestLevel, cp: bestCp };
  }

  /**
   * The highest level at which `evolved` still fits `maxCp`, and the CP `base`
   * reads there — i.e. where to stop powering up so a Mega stays legal.
   *
   * Returns `null` when there is no ceiling to state:
   *
   *  - **`evolved` still fits at `maxLevel`.** There is nothing to stop short
   *    of, and printing the row states a limit where none exists: Mega Sableye
   *    fits the 2500 cap at level 50, so "keep Sableye at or below 1668 CP"
   *    named its own maximum as a ceiling. Mega Mawile, Medicham and Audino do
   *    the same at Ultra, and at a level cap of 40 they do it on every spread.
   *  - **It is over `maxCp` even at level 1**, so no level works at all. Not
   *    reachable with today's data, but the old code returned level 1 with an
   *    over-cap `evolvedCp` and the UI stated it as fact.
   *
   * ⚠️ Takes `ivs`, never a per-species factor. The Mega/base CP ratio moves
   * with the attack IV whenever the two forms' base attacks are far apart —
   * Beedrill is 169 -> 303, so x1.83 at 15 attack and **x1.90** at 0. A
   * species-wide factor puts a real 816 CP copy at 1495 and calls it legal when
   * its Mega is 1552, i.e. 52 over the cap.
   */
  static findBestLevelBeforeEvolution(base: Pokemon, evolved: Pokemon, ivs: IVs, maxCp: number, maxLevel: number = 50): { level: number; baseCp: number; evolvedCp: number } | null {
    let bestLevel = 0;
    let baseCp = 0;
    let evolvedCp = 0;

    for (let level = 1; level <= maxLevel; level += 0.5) {
      const candidateEvolvedCp = this.calculateCp(evolved, ivs, level);
      if (candidateEvolvedCp > maxCp) break;
      bestLevel = level;
      baseCp = this.calculateCp(base, ivs, level);
      evolvedCp = candidateEvolvedCp;
    }
    if (bestLevel === 0 || bestLevel >= maxLevel) return null;
    return { level: bestLevel, baseCp, evolvedCp };
  }

  static generateRanks(pokemon: Pokemon, maxCp: number, minIv: number = 0, maxLevel: number = 50): RankEntry[] {
    const entries: RankEntry[] = [];

    for (let atk = minIv; atk <= MAX_IV; atk++) {
      for (let def = minIv; def <= MAX_IV; def++) {
        for (let hp = minIv; hp <= MAX_IV; hp++) {
          const ivs = { atk, def, hp };
          const { level, cp } = this.findBestLevel(pokemon, ivs, maxCp, maxLevel);
          const stats = this.getActualStats(pokemon, ivs, level);
          const statProduct = (stats.atk * stats.def * stats.hp) / 1000;
          
          entries.push({
            rank: 0,
            level,
            ivs,
            stats,
            cp,
            statProduct,
            perfection: 0
          });
        }
      }
    }

    entries.sort((a, b) => b.statProduct - a.statProduct || b.cp - a.cp);
    
    const maxProduct = entries[0].statProduct;
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      perfection: Number(((entry.statProduct / maxProduct) * 100).toFixed(2))
    }));
  }
}
