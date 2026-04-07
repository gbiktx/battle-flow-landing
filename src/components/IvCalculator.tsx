import React, { useState, useMemo, useRef, useEffect } from 'react';
import pokemonData from '../data/pokemon.json';
import translations from '../data/translations.json';
import { PvPCalculator, type RankEntry } from '../lib/pvp-calculator';
import { ui, defaultLang } from '../i18n/ui';

interface Props {
  lang: string;
}

const LEAGUES = [
  { id: 'little', cap: 500, labelKey: 'iv.little_league' },
  { id: 'great', cap: 1500, labelKey: 'iv.great_league' },
  { id: 'ultra', cap: 2500, labelKey: 'iv.ultra_league' },
  { id: 'master', cap: 10000, labelKey: 'iv.master_league' },
];

const TARGET_LEVELS = [40, 41, 50, 51];

const TYPE_COLORS: Record<string, string> = {
  bug: '#aec92c', dark: '#6e7681', dragon: '#067fc4', electric: '#fedf6b',
  fairy: '#f6a7e8', fighting: '#e34448', fire: '#feb04b', flying: '#a7c1f2',
  ghost: '#7571d0', grass: '#59c079', ground: '#d2976b', ice: '#94ddd6',
  normal: '#a3a49e', poison: '#a662c7', psychic: '#fda194', rock: '#d7cd90',
  steel: '#5aafb4', water: '#6ac7e9',
};

const NO_QUALIFIER_IDS = [29, 32, 122, 250, 474, 439, 782, 783, 784, 785, 786, 787, 788, 866, 1001, 1002, 1003, 1004];

interface IVSet {
  atk: number;
  def: number;
  hp: number;
}

export default function IvCalculator({ lang }: Props) {
  const [selectedId, setSelectedId] = useState('azumarill');
  const [league, setLeague] = useState(LEAGUES[1]);
  const [maxLevel, setMaxLevel] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFullTable, setShowFullTable] = useState(false);
  
  // Input refs for auto-focus
  const atkRef = useRef<HTMLInputElement>(null);
  const defRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);

  // Use strings for inputs
  const [inputAtk, setInputAtk] = useState('0');
  const [inputDef, setInputDef] = useState('15');
  const [inputHp, setInputHp] = useState('15');
  
  const [trackedIvs, setTrackedIvs] = useState<IVSet[]>([]);

  // Safe translation helper
  const t = (key: string): string => {
    const currentLang = (lang || 'en') as keyof typeof ui;
    const langObj = ui[currentLang] || ui[defaultLang];
    const translation = (langObj as any)[key];
    return translation !== undefined ? translation : (ui[defaultLang] as any)[key] || key;
  };

  const getSpriteName = (dex: number, id: string) => {
    const safeId = id || '';
    let speciesId = safeId.replace("_xl", "").replace("_xs", "").replace("_shadow", "");
    if (speciesId.includes("_alolan")) return `${dex}-alolan`;
    if (speciesId.includes("_galarian")) return `${dex}-galarian`;
    if (speciesId.includes("_hisuian")) return `${dex}-hisuian`;
    if (speciesId.includes("_") && !NO_QUALIFIER_IDS.includes(dex)) {
      const parts = speciesId.split("_");
      parts[0] = dex.toString();
      return parts.join("-");
    }
    return `${dex}`;
  };

  const nonShadowPokemon = useMemo(() => 
    pokemonData.filter(p => !p.id.includes('_shadow') && !p.name.includes('(Shadow)')), 
  []);

  const currentPokemon = useMemo(() => 
    nonShadowPokemon.find(p => p.id === selectedId) || nonShadowPokemon.find(p => p.id === 'azumarill') || nonShadowPokemon[0], 
  [selectedId, nonShadowPokemon]);

  const langTranslations = (translations as any)[lang] || (translations as any)['en'] || {};

  const getPokemonName = (id: string, defaultName: string) => {
    const safeId = id || '';
    // Special handling for mega and other forms to match translations.json keys
    let lookupId = safeId
      .replace('_mega_x', 'X')
      .replace('_mega_y', 'Y')
      .replace('_mega', 'Mega')
      .replace('_alolan', 'Alolan')
      .replace('_galarian', 'Galarian')
      .replace('_hisuian', 'Hisuian')
      .replace('_paldean', 'Paldean');
    
    const camelCaseId = lookupId.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    return langTranslations[`pokemon${camelCaseId}`] || defaultName;
  };

  const getTypeName = (type: string) => {
    return t(`type.${type.toLowerCase()}`);
  };

  const filteredPokemonList = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return nonShadowPokemon
      .filter(p => 
        p.id.toLowerCase().includes(term) || 
        p.name.toLowerCase().includes(term) ||
        getPokemonName(p.id, p.name).toLowerCase().includes(term)
      )
      .slice(0, 10);
  }, [searchTerm, lang, nonShadowPokemon]);

  const allRanks = useMemo(() => {
    return PvPCalculator.generateRanks(currentPokemon as any, league.cap, 0, maxLevel);
  }, [currentPokemon, league, maxLevel]);

  const handleAddTracked = () => {
    const atk = parseInt(inputAtk) || 0;
    const def = parseInt(inputDef) || 0;
    const hp = parseInt(inputHp) || 0;
    if (!trackedIvs.some(iv => iv.atk === atk && iv.def === def && iv.hp === hp)) {
      setTrackedIvs([{ atk, def, hp }, ...trackedIvs]);
    }
  };

  const handleClearTracked = () => setTrackedIvs([]);

  const spriteUrl = `/assets/images/sprites/${getSpriteName(currentPokemon.dex, currentPokemon.id)}.png`;

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
    // Only allow numbers
    const clean = val.replace(/\D/g, '');
    if (clean === '') {
      if (field === 'atk') setInputAtk('');
      else if (field === 'def') setInputDef('');
      else if (field === 'hp') setInputHp('');
      return;
    }

    const num = parseInt(clean);
    if (num > 15) return;

    // Update state without leading zeros
    const finalVal = num.toString();
    if (field === 'atk') setInputAtk(finalVal);
    else if (field === 'def') setInputDef(finalVal);
    else if (field === 'hp') setInputHp(finalVal);

    // Auto-focus logic: move if it's 0, 2-9, or 10-15. Stay if it's 1.
    const shouldMove = (num >= 2 && num <= 9) || (num >= 10 && num <= 15) || (clean === '0');
    if (shouldMove) {
      if (field === 'atk') defRef.current?.focus();
      else if (field === 'def') hpRef.current?.focus();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* Settings Panel */}
      <div className="bg-brand-dark/40 rounded-[2.5rem] border border-white/10 p-8 shadow-2xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-700"></div>
                <div className="relative p-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                  <img src={spriteUrl} alt="" className="w-20 h-20 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" onError={(e) => (e.currentTarget.src = '/assets/images/appicon.png')}/>
                </div>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tighter">{getPokemonName(currentPokemon.id, currentPokemon.name)}</h3>
              <div className="flex gap-2 mt-2">
                {currentPokemon.types.filter(t => t !== 'none').map(type => (
                  <span key={type} className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white/90" style={{ backgroundColor: TYPE_COLORS[type] }}>{getTypeName(type)}</span>
                ))}
              </div>
            </div>

            <div className="relative">
              <label htmlFor="pokemon-search" className="block text-[10px] font-black mb-2 text-gray-500 uppercase tracking-widest">{t('iv.change_pokemon')}</label>
              <input 
                id="pokemon-search"
                type="text" 
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 focus:outline-hidden focus:ring-2 focus:ring-brand-accent/50 text-white font-bold text-sm" 
                placeholder={t('iv.search_placeholder')} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              {searchTerm && filteredPokemonList.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-brand-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto z-[100]">
                  {filteredPokemonList.map(p => (
                    <button key={p.id} className="w-full text-left px-5 py-3 hover:bg-white/10 transition-colors flex items-center gap-4 text-white border-b border-white/5 last:border-0" onClick={() => { setSelectedId(p.id); setSearchTerm(''); }}>
                      <img src={`/assets/images/sprites/${getSpriteName(p.dex, p.id)}.png`} alt="" className="w-8 h-8 object-contain" onError={(e) => (e.currentTarget.src = '/assets/images/appicon.png')}/>
                      <span className="font-bold text-sm">{getPokemonName(p.id, p.name)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-center space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> League
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {LEAGUES.map(l => (
                    <button key={l.id} className={`py-2.5 px-1 rounded-xl text-[9px] font-black uppercase transition-all border ${league.id === l.id ? 'bg-brand-accent border-brand-accent text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`} onClick={() => setLeague(l)}>
                      {t(l.labelKey).replace(/League|Liga|Ligue|Cup/gi, "").trim()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> {t('iv.level_cap')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TARGET_LEVELS.map(l => (
                    <button key={l} className={`py-2.5 rounded-xl text-[10px] font-black transition-all border ${maxLevel === l ? 'bg-brand-blue border-brand-blue text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`} onClick={() => setMaxLevel(l)}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-black/20 p-6 rounded-3xl border border-white/5 space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">{t('iv.analyze_custom')}</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="grid grid-cols-3 gap-3 flex-1 w-full">
                  <div className="relative">
                    <input 
                      ref={atkRef} 
                      id="iv-atk"
                      type="text" 
                      inputMode="numeric" 
                      value={inputAtk} 
                      onChange={(e) => handleIvChange(e.target.value, 'atk')}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-2 text-center text-xl font-black text-brand-accent focus:border-brand-accent outline-hidden transition-all"
                    />
                    <label htmlFor="iv-atk" className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-dark px-2 text-[8px] font-black text-gray-500 tracking-tighter rounded-full border border-white/5 uppercase cursor-pointer">{t('iv.attack').slice(0, 3)}</label>
                  </div>
                  <div className="relative">
                    <input 
                      ref={defRef} 
                      id="iv-def"
                      type="text" 
                      inputMode="numeric" 
                      value={inputDef} 
                      onChange={(e) => handleIvChange(e.target.value, 'def')}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-2 text-center text-xl font-black text-brand-accent focus:border-brand-accent outline-hidden transition-all"
                    />
                    <label htmlFor="iv-def" className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-dark px-2 text-[8px] font-black text-gray-500 tracking-tighter rounded-full border border-white/5 uppercase cursor-pointer">{t('iv.defense').slice(0, 3)}</label>
                  </div>
                  <div className="relative">
                    <input 
                      ref={hpRef} 
                      id="iv-hp"
                      type="text" 
                      inputMode="numeric" 
                      value={inputHp} 
                      onChange={(e) => handleIvChange(e.target.value, 'hp')}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-2 text-center text-xl font-black text-brand-accent focus:border-brand-accent outline-hidden transition-all"
                    />
                    <label htmlFor="iv-hp" className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-dark px-2 text-[8px] font-black text-gray-500 tracking-tighter rounded-full border border-white/5 uppercase cursor-pointer">{t('iv.hp').slice(0, 3)}</label>
                  </div>
                </div>
                <button onClick={handleAddTracked} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/80 text-white px-8 py-4 rounded-2xl transition-all font-black uppercase tracking-widest shadow-xl active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                  {t('iv.track_ivs')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-dark/40 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
        <div className="px-10 py-8 bg-white/5 border-b border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full bg-brand-accent animate-ping opacity-75"></div>
            <h4 className="text-lg font-black text-white uppercase tracking-widest">
              {showFullTable ? t('iv.top_100') : t('iv.top_10')}
            </h4>
          </div>
          
          <div className="flex items-center gap-4">
            {trackedIvs.length > 0 && (
              <button onClick={handleClearTracked} className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest mr-4">
                {t('iv.clear_tracked')}
              </button>
            )}
            <button onClick={() => setShowFullTable(!showFullTable)} className="px-6 py-2.5 bg-brand-accent/10 border border-brand-accent/30 rounded-full text-[10px] font-black text-brand-accent uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all shadow-lg">
              {showFullTable ? t('iv.show_top_10') : t('iv.show_top_100')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="text-gray-500 bg-white/5 border-b border-white/10">
                <th className="px-10 py-5 font-black uppercase tracking-widest text-[10px]">{t('iv.rank')}</th>
                <th className="px-10 py-5 font-black uppercase tracking-widest text-[10px]">{t('iv.iv_set')}</th>
                <th className="px-10 py-5 font-black uppercase tracking-widest text-[10px]">{t('iv.actual_stats')}</th>
                <th className="px-10 py-5 font-black uppercase tracking-widest text-[10px]">{t('iv.level')}</th>
                <th className="px-10 py-5 font-black uppercase tracking-widest text-[10px]">{t('iv.cp')}</th>
                <th className="px-10 py-5 font-black uppercase tracking-widest text-[10px] text-right">{t('iv.perfection')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/10">
              {tableData.map((r, idx) => {
                const isTracked = trackedIvs.some(iv => iv.atk === r.ivs.atk && iv.def === r.ivs.def && iv.hp === r.ivs.hp);
                const isCurrentInput = r.ivs.atk === parseInt(inputAtk) && r.ivs.def === parseInt(inputDef) && r.ivs.hp === parseInt(inputHp);
                
                return (
                  <tr key={`${r.rank}-${r.ivs.atk}-${r.ivs.def}-${r.ivs.hp}`} 
                    className={`transition-all duration-300 ${isTracked ? 'bg-brand-accent/20' : isCurrentInput ? 'bg-brand-blue/20' : 'hover:bg-white/[0.03]'}`}>
                    <td className="px-10 py-6 font-black text-white">
                      <div className="flex items-center gap-3">
                        {isTracked && <span className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(255,89,94,0.8)]"></span>}
                        <span className={r.rank <= 10 ? 'text-brand-accent text-lg' : ''}>#{r.rank}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex gap-2 font-mono font-black text-white/80">
                        <span className="w-10 text-center py-1.5 bg-black/40 rounded-lg">{r.ivs.atk}</span>
                        <span className="w-10 text-center py-1.5 bg-black/40 rounded-lg">{r.ivs.def}</span>
                        <span className="w-10 text-center py-1.5 bg-black/40 rounded-lg">{r.ivs.hp}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 font-bold text-gray-400 font-mono tracking-tighter">
                      {r.stats.atk} / {r.stats.def} / {r.stats.hp}
                    </td>
                    <td className="px-10 py-6 font-black text-gray-300">Lvl {r.level}</td>
                    <td className="px-10 py-6 font-black text-white tracking-tighter text-lg">{r.cp}</td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`font-black text-lg ${r.rank <= 10 ? 'text-brand-accent' : 'text-white/90'}`}>{r.perfection}%</span>
                        <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-brand-accent transition-all duration-1000" style={{ width: `${r.perfection}%` }}></div>
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
