import pokemonData from '../data/pokemon.json';
import cpms from '../data/cpms.json';

export interface Pokemon {
  id: string;
  name: string;
  atk: number;
  def: number;
  hp: number;
  types: string[];
  tags: string[];
  evolutions?: string[];
}

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

  static generateRanks(pokemon: Pokemon, maxCp: number, minIv: number = 0, maxLevel: number = 50): RankEntry[] {
    const entries: RankEntry[] = [];

    for (let atk = minIv; atk <= 15; atk++) {
      for (let def = minIv; def <= 15; def++) {
        for (let hp = minIv; hp <= 15; hp++) {
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
