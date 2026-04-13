import React, { useState, useMemo, useRef } from 'react';
import { PvPCalculator, type RankEntry } from '../lib/pvp-calculator';
import { useTranslations } from '../i18n/utils';
import { ui } from '../i18n/ui';
import { trackEvent } from '../lib/analytics';
import { pokemon as pokemonData } from '../lib/pokemon-data';
import {
  TYPE_COLORS,
  hexToRgba,
  getPokemonName,
  getSpritePath,
  type LocaleDictionary,
} from '../lib/game-data';

interface Props {
  lang: string;
  translations: LocaleDictionary;
}

const LEAGUES = [
  { id: 'little', cap: 500, labelKey: 'iv.little_league' },
  { id: 'great', cap: 1500, labelKey: 'iv.great_league' },
  { id: 'ultra', cap: 2500, labelKey: 'iv.ultra_league' },
  { id: 'master', cap: 10000, labelKey: 'iv.master_league' },
] as const;

const TARGET_LEVELS = [40, 41, 50, 51];

// Stable across renders — pokemonData is imported, never mutated.
const NON_SHADOW_POKEMON = pokemonData.filter(
  (p) => !p.id.includes('_shadow') && !p.name.includes('(Shadow)')
);

interface IVSet {
  atk: number;
  def: number;
  hp: number;
}

export default function IvCalculator({ lang, translations: langTranslations }: Props) {
  const [selectedId, setSelectedId] = useState('azumarill');
  const [league, setLeague] = useState(LEAGUES[1]);
  const [maxLevel, setMaxLevel] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFullTable, setShowFullTable] = useState(false);
  
  const atkRef = useRef<HTMLInputElement>(null);
  const defRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);

  const [inputAtk, setInputAtk] = useState('0');
  const [inputDef, setInputDef] = useState('15');
  const [inputHp, setInputHp] = useState('15');
  
  const [trackedIvs, setTrackedIvs] = useState<IVSet[]>([]);

  const t = useTranslations(lang as keyof typeof ui);

  const currentPokemon = useMemo(
    () =>
      NON_SHADOW_POKEMON.find((p) => p.id === selectedId) ??
      NON_SHADOW_POKEMON.find((p) => p.id === 'azumarill')!,
    [selectedId]
  );

  const localizePokemon = (id: string, fallback: string) =>
    getPokemonName(id, fallback, langTranslations);

  // Dynamic key — TS can't narrow `type.${string}` to a ui.ts key statically.
  const getTypeName = (type: string) => t(`type.${type.toLowerCase()}` as Parameters<typeof t>[0]);

  const filteredPokemonList = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return NON_SHADOW_POKEMON
      .filter((p) =>
        p.id.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        localizePokemon(p.id, p.name).toLowerCase().includes(term)
      )
      .slice(0, 10);
  }, [searchTerm, langTranslations]);

  const allRanks = useMemo(
    () => PvPCalculator.generateRanks(currentPokemon, league.cap, 0, maxLevel),
    [currentPokemon, league, maxLevel]
  );

  const handleAddTracked = () => {
    const atk = parseInt(inputAtk) || 0;
    const def = parseInt(inputDef) || 0;
    const hp = parseInt(inputHp) || 0;
    if (!trackedIvs.some(iv => iv.atk === atk && iv.def === def && iv.hp === hp)) {
      setTrackedIvs([{ atk, def, hp }, ...trackedIvs]);
      trackEvent('IV Track', { 'Pokemon': selectedId, 'IV': `${atk}/${def}/${hp}`, 'League': league.id });
    }
  };

  const handleClearTracked = () => setTrackedIvs([]);

  const spriteUrl = getSpritePath(currentPokemon);

  const tableData = useMemo(() => {
    const limit = showFullTable ? 100 : 10;
    const trackedRankEntries = trackedIvs.map(ti => {
      return allRanks.find(r => r.ivs.atk === ti.atk && r.ivs.def === ti.def && r.ivs.hp === ti.hp);
    }).filter(Boolean) as RankEntry[];

    const topList = allRanks.slice(0, limit);
    const remainingTopList = topList.filter(r => 
      !trackedRankEntries.some(te => te.ivs.atk === r.ivs.atk && te.ivs.def === r.ivs.def && te.ivs.hp === r.ivs.hp)
    );

    return [...trackedRankEntries, ...remainingTopList];
  }, [trackedIvs, allRanks, showFullTable]);

  const handleIvChange = (val: string, field: 'atk' | 'def' | 'hp') => {
    const clean = val.replace(/\D/g, '');
    if (clean === '') {
      if (field === 'atk') setInputAtk('');
      else if (field === 'def') setInputDef('');
      else if (field === 'hp') setInputHp('');
      return;
    }

    const num = parseInt(clean);
    if (num > 15) return;

    const finalVal = num.toString();
    if (field === 'atk') setInputAtk(finalVal);
    else if (field === 'def') setInputDef(finalVal);
    else if (field === 'hp') setInputHp(finalVal);

    // Auto-advance once the entry can't be extended into another valid IV (0 or >=2).
    const shouldAdvance = num >= 2 || clean === '0';
    if (shouldAdvance) {
      if (field === 'atk') defRef.current?.focus();
      else if (field === 'def') hpRef.current?.focus();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Settings Panel */}
      <div className="bg-brand-dark/40 rounded-[2.5rem] border border-white/10 p-5 md:p-8 shadow-2xl relative z-10 glass">
        {/* Decorative Glows */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] bg-brand-blue/10 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-brand-accent/5 blur-[100px] rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

          <div className="lg:col-span-4 space-y-6 relative z-50">

            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-700"></div>
                <div className="relative p-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                  <img src={spriteUrl} alt={`${localizePokemon(currentPokemon.id, currentPokemon.name)} sprite`} className="w-24 h-24 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" onError={(e) => (e.currentTarget.src = '/assets/images/appicon.png')}/>
                </div>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{localizePokemon(currentPokemon.id, currentPokemon.name)}</h3>
              <div className="flex gap-2 mt-3">
                {currentPokemon.types.filter((ty) => ty !== 'none').map((type) => {
                  const color = TYPE_COLORS[type] || '#ffffff';
                  return (
                    <span 
                      key={type} 
                      className="text-[10px] font-black uppercase px-3 py-1 rounded tracking-wider" 
                      style={{ 
                        backgroundColor: hexToRgba(color, 0.25),
                        color: color,
                        border: `1px solid ${hexToRgba(color, 0.5)}`
                      }}
                    >
                      {getTypeName(type)}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <label htmlFor="pokemon-search" className="block text-[10px] font-black mb-2 text-gray-500 uppercase tracking-widest">{t('iv.change_pokemon')}</label>
              <div className="relative">
                <input 
                  id="pokemon-search"
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-hidden focus:ring-2 focus:ring-brand-accent/50 text-white font-bold text-sm placeholder-gray-500 transition-all" 
                  placeholder={t('iv.search_placeholder')} 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {searchTerm && filteredPokemonList.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto z-[100]">
                  {filteredPokemonList.map(p => (
                    <button key={p.id} className="w-full text-left px-5 py-3 hover:bg-white/10 transition-colors flex items-center gap-4 text-white border-b border-white/5 last:border-0" onClick={() => { setSelectedId(p.id); setSearchTerm(''); trackEvent('IV Pokemon Select', { 'Pokemon': p.id }); }}>
                      <img src={getSpritePath(p)} alt={`${localizePokemon(p.id, p.name)} sprite`} className="w-8 h-8 object-contain" onError={(e) => (e.currentTarget.src = '/assets/images/appicon.png')}/>
                      <span className="font-bold text-sm uppercase tracking-tight">{localizePokemon(p.id, p.name)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-center space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> {t('iv.league')}
                </label>
                <div className="grid grid-cols-4 gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                  {LEAGUES.map(l => (
                    <button 
                      key={l.id} 
                      className={`py-3 px-1 rounded-xl text-[10px] font-black uppercase transition-all ${league.id === l.id ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' : 'text-gray-400 hover:text-white'}`} 
                      onClick={() => { setLeague(l); trackEvent('IV League Select', { 'League': l.id }); }}
                    >
                      {t(l.labelKey).replace(/League|Liga|Ligue|Cup/gi, "").trim()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> {t('iv.level_cap')}
                </label>
                <div className="grid grid-cols-4 gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                  {TARGET_LEVELS.map(l => (
                    <button 
                      key={l} 
                      className={`py-3 rounded-xl text-[10px] font-black transition-all ${maxLevel === l ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:text-white'}`} 
                      onClick={() => { setMaxLevel(l); trackEvent('IV Level Cap Select', { 'Level Cap': l }); }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-5 md:p-8 rounded-[2rem] border border-white/10 space-y-6">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{t('iv.analyze_custom')}</label>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="grid grid-cols-3 gap-4 flex-1 w-full">
                  <div className="relative">
                    <input 
                      ref={atkRef} 
                      id="iv-atk"
                      type="text" 
                      inputMode="numeric" 
                      value={inputAtk} 
                      onChange={(e) => handleIvChange(e.target.value, 'atk')}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-2 text-center text-2xl font-black text-brand-accent focus:border-brand-accent outline-hidden transition-all shadow-inner"
                    />
                    <label htmlFor="iv-atk" className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1A2035] px-3 py-0.5 text-[9px] font-black text-gray-400 tracking-widest rounded-full border border-white/10 uppercase cursor-pointer z-20 shadow-lg">{t('iv.attack').slice(0, 3)}</label>
                  </div>
                  <div className="relative">
                    <input 
                      ref={defRef} 
                      id="iv-def"
                      type="text" 
                      inputMode="numeric" 
                      value={inputDef} 
                      onChange={(e) => handleIvChange(e.target.value, 'def')}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-2 text-center text-2xl font-black text-brand-accent focus:border-brand-accent outline-hidden transition-all shadow-inner"
                    />
                    <label htmlFor="iv-def" className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1A2035] px-3 py-0.5 text-[9px] font-black text-gray-400 tracking-widest rounded-full border border-white/10 uppercase cursor-pointer z-20 shadow-lg">{t('iv.defense').slice(0, 3)}</label>
                  </div>
                  <div className="relative">
                    <input 
                      ref={hpRef} 
                      id="iv-hp"
                      type="text" 
                      inputMode="numeric" 
                      value={inputHp} 
                      onChange={(e) => handleIvChange(e.target.value, 'hp')}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-2 text-center text-2xl font-black text-brand-accent focus:border-brand-accent outline-hidden transition-all shadow-inner"
                    />
                    <label htmlFor="iv-hp" className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1A2035] px-3 py-0.5 text-[9px] font-black text-gray-400 tracking-widest rounded-full border border-white/10 uppercase cursor-pointer z-20 shadow-lg">{t('iv.hp').slice(0, 3)}</label>
                  </div>
                </div>
                <button onClick={handleAddTracked} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand-accent hover:brightness-110 text-white px-6 py-4 md:px-10 md:py-5 rounded-2xl transition-all font-black uppercase tracking-[0.15em] text-sm shadow-xl shadow-brand-accent/20 active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                  {t('iv.track_ivs')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-brand-dark/40 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative z-0 glass">
        <div className="px-5 py-6 md:px-10 md:py-10 bg-white/5 border-b border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-brand-accent shadow-[0_0_12px_rgba(218,85,47,0.5)]"></div>
            <h4 className="text-xl font-black text-white uppercase tracking-widest">
              {showFullTable ? t('iv.top_100') : t('iv.top_10')}
            </h4>
          </div>
          
          <div className="flex items-center gap-6">
            {trackedIvs.length > 0 && (
              <button onClick={handleClearTracked} className="text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] mr-2">
                {t('iv.clear_tracked')}
              </button>
            )}
            <button onClick={() => setShowFullTable(!showFullTable)} className="px-4 py-3 md:px-8 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all shadow-lg">
              {showFullTable ? t('iv.show_top_10') : t('iv.show_top_100')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="text-gray-500 bg-white/[0.02] border-b border-white/5">
                <th className="px-10 py-6 font-black uppercase tracking-[0.2em] text-[10px]">{t('iv.rank')}</th>
                <th className="px-10 py-6 font-black uppercase tracking-[0.2em] text-[10px]">{t('iv.iv_set')}</th>
                <th className="px-10 py-6 font-black uppercase tracking-[0.2em] text-[10px]">{t('iv.actual_stats')}</th>
                <th className="px-10 py-6 font-black uppercase tracking-[0.2em] text-[10px]">{t('iv.level')}</th>
                <th className="px-10 py-6 font-black uppercase tracking-[0.2em] text-[10px]">{t('iv.cp')}</th>
                <th className="px-10 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-right">{t('iv.perfection')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/10">
              {tableData.map((r, idx) => {
                const isTracked = trackedIvs.some(iv => iv.atk === r.ivs.atk && iv.def === r.ivs.def && iv.hp === r.ivs.hp);
                const isCurrentInput = r.ivs.atk === parseInt(inputAtk) && r.ivs.def === parseInt(inputDef) && r.ivs.hp === parseInt(inputHp);
                
                return (
                  <tr key={`${r.rank}-${r.ivs.atk}-${r.ivs.def}-${r.ivs.hp}`} 
                    className={`transition-all duration-300 ${isTracked ? 'bg-brand-accent/15' : isCurrentInput ? 'bg-brand-blue/15' : 'hover:bg-white/[0.03]'}`}>
                    <td className="px-10 py-7 font-black text-white">
                      <div className="flex items-center gap-4">
                        {isTracked && <div className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(218,85,47,0.8)]"></div>}
                        <span className={`text-lg ${r.rank <= 10 ? 'text-brand-accent' : 'opacity-60'}`}>#{r.rank}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex gap-2 font-black">
                        <span className="w-11 text-center py-2 bg-black/40 rounded-xl border border-white/5 text-brand-accent">{r.ivs.atk}</span>
                        <span className="w-11 text-center py-2 bg-black/40 rounded-xl border border-white/5 text-brand-accent">{r.ivs.def}</span>
                        <span className="w-11 text-center py-2 bg-black/40 rounded-xl border border-white/5 text-brand-accent">{r.ivs.hp}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 font-bold text-gray-400 tracking-tighter text-sm opacity-80">
                      {r.stats.atk} / {r.stats.def} / {r.stats.hp}
                    </td>
                    <td className="px-10 py-7 font-black text-gray-300 text-sm">Lvl {r.level}</td>
                    <td className="px-10 py-7 font-black text-white tracking-tighter text-xl">{r.cp}</td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`font-black text-xl tracking-tighter ${r.rank <= 10 ? 'text-brand-accent' : 'text-white/90'}`}>{r.perfection}%</span>
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-brand-accent shadow-[0_0_8px_rgba(218,85,47,0.4)] transition-all duration-1000" style={{ width: `${r.perfection}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
