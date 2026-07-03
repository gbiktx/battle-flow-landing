import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  type Pokemon,
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

// Store links for the contextual "now build a team" CTA. `iv-result-cta` tagging
// (data-placement + ct/utm_campaign) keeps this separable from the footer button
// in Store Click analytics. Clicks are auto-tracked by the delegated listener in Layout.astro.
const CTA_APP_STORE_URL = 'https://apps.apple.com/us/app/battleflow/id6738843812?ct=iv-result-cta';
const CTA_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.baru.software.oak&referrer=utm_source%3Dbattleflow-landing%26utm_medium%3Dweb%26utm_campaign%3Div-result-cta';

// Stable across renders — pokemonData is imported, never mutated.
const NON_SHADOW_POKEMON = pokemonData.filter(
  (p) => !p.id.includes('_shadow') && !p.name.includes('(Shadow)')
);

const POKEMON_BY_ID = new Map<string, Pokemon>(pokemonData.map((p) => [p.id, p]));

const PERFECT_IV = { atk: 15, def: 15, hp: 15 };

// Reverse-evolution index: child id -> the first parent that evolves into it.
// Lets us walk *up* to a line's base form (the `evolutions` field is forward-only).
const PRE_EVOLUTION = new Map<string, string>();
for (const p of pokemonData) {
  for (const child of p.evolutions ?? []) {
    if (!PRE_EVOLUTION.has(child)) PRE_EVOLUTION.set(child, p.id);
  }
}

// Base form of a line — walk pre-evolutions to the top (cycle-guarded).
function getEvolutionRoot(id: string): string {
  let current = id;
  const guard = new Set<string>();
  while (PRE_EVOLUTION.has(current) && !guard.has(current)) {
    guard.add(current);
    current = PRE_EVOLUTION.get(current)!;
  }
  return current;
}

const isMegaForm = (p: Pokemon) => (p.tags?.includes('mega') ?? false) || p.id.includes('_mega');

// Strip a mega suffix to the base species id (megas aren't in the evolution graph).
const stripMegaSuffix = (id: string) => id.replace(/_mega(_x|_y)?$/, '');

// Released Mega forms of a species, by the `{id}_mega[_x|_y]` convention —
// megas are absent from `evolutions`, matching the app's EvolutionLeagueSuggester._megasOf.
function getMegasOf(id: string): Pokemon[] {
  const out: Pokemon[] = [];
  for (const suffix of ['_mega', '_mega_x', '_mega_y']) {
    const mega = POKEMON_BY_ID.get(id + suffix);
    if (mega) out.push(mega);
  }
  return out;
}

// Breadth-first walk of a line from `start`: each form, then its evolution
// targets, then its megas (leaves). Depth-capped at 3 and cycle-guarded,
// mirroring the app's _evolutionCandidates. Handles multi-branch lines (Eevee).
function buildFamily(start: Pokemon): Pokemon[] {
  const family: Pokemon[] = [];
  const seen = new Set<string>();
  const queue: { p: Pokemon; depth: number }[] = [{ p: start, depth: 0 }];
  while (queue.length) {
    const { p, depth } = queue.shift()!;
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    family.push(p);
    if (depth >= 3) continue;
    for (const nextId of p.evolutions ?? []) {
      const next = POKEMON_BY_ID.get(nextId);
      if (next && !seen.has(next.id)) queue.push({ p: next, depth: depth + 1 });
    }
    for (const mega of getMegasOf(p.id)) {
      if (!seen.has(mega.id)) queue.push({ p: mega, depth: depth + 1 });
    }
  }
  return family;
}

const stripLeagueWord = (label: string) => label.replace(/League|Liga|Ligue|Cup/gi, '').trim();

// 3-band stat-product verdict color, mirroring the app's percentToColor
// (battle_flow design_system/app_colors.dart): best ≥98 (green), near 96–97
// (amber), low ≤95 (red). floor() matches the app's perfectionPercent.toInt().
// This is an IV-quality verdict (how close the spread is to rank 1 for that
// form+league) — deliberately NOT a claim that the species itself is meta-good.
const STAT_PRODUCT_BANDS = [
  { color: '#00C853', label: '≥98%' },
  { color: '#F2BC4E', label: '96–97%' },
  { color: '#BA1A1A', label: '≤95%' },
] as const;

function statProductBandColor(perfection: number): string {
  const p = Math.floor(perfection);
  if (p >= 98) return STAT_PRODUCT_BANDS[0].color;
  if (p > 95) return STAT_PRODUCT_BANDS[1].color;
  return STAT_PRODUCT_BANDS[2].color;
}

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
  const [showIvInput, setShowIvInput] = useState(false);
  const [tableCollapsed, setTableCollapsed] = useState(false);
  const [collapsedIvKeys, setCollapsedIvKeys] = useState<Set<string>>(new Set());
  
  const atkRef = useRef<HTMLInputElement>(null);
  const defRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);

  const [inputAtk, setInputAtk] = useState('0');
  const [inputDef, setInputDef] = useState('15');
  const [inputHp, setInputHp] = useState('15');
  
  const [trackedIvs, setTrackedIvs] = useState<IVSet[]>([]);

  const t = useTranslations(lang as keyof typeof ui);

  // Jump straight into typing (and raise the mobile keyboard) when the IV fields reveal.
  useEffect(() => {
    if (showIvInput) atkRef.current?.select();
  }, [showIvInput]);

  const currentPokemon = useMemo(
    () =>
      NON_SHADOW_POKEMON.find((p) => p.id === selectedId) ??
      NON_SHADOW_POKEMON.find((p) => p.id === 'azumarill')!,
    [selectedId]
  );

  const localizePokemon = (id: string, fallback: string) =>
    getPokemonName(id, fallback, langTranslations);

  // Mega qualifier ("Mega X"/"Mega Y"/"Mega") from the raw name — localizePokemon
  // strips it, so pull it from `name` to tell the two megas apart.
  const megaQualifier = (p: Pokemon) => p.name.match(/\(([^)]+)\)/)?.[1] ?? 'Mega';

  // Full display name including the mega qualifier (e.g. "Charizard (Mega X)").
  const formDisplayName = (p: Pokemon) => {
    const base = localizePokemon(p.id, p.name);
    if (!isMegaForm(p)) return base;
    const q = megaQualifier(p);
    return base.includes(q) ? base : `${base} (${q})`;
  };

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

  const hasTracked = trackedIvs.length > 0;

  // Grid rows: the current form's evolution targets + megas (what this catch can
  // become). Switcher: the whole line from its base — so you can hop base ↔ final
  // ↔ mega and back regardless of which form is currently analyzed.
  const evolutionFamily = useMemo(
    () => buildFamily(currentPokemon),
    [currentPokemon]
  );

  const switcherForms = useMemo(
    () => buildFamily(POKEMON_BY_ID.get(getEvolutionRoot(stripMegaSuffix(currentPokemon.id))) ?? currentPokemon),
    [currentPokemon]
  );

  // Rank tables per (form, league) across the whole evolution family, at the
  // selected level cap. Keyed independently of the tracked IV values, so adding
  // more IVs only costs cheap lookups. Capped leagues a form can't reach (its
  // perfect CP is under the ceiling) are skipped and render as "—"; Master League
  // has no effective cap, so it's always computed. Only built once an IV is tracked.
  const evolutionRanks = useMemo(() => {
    if (!hasTracked) return null;
    const cache = new Map<string, RankEntry[]>();
    for (const form of evolutionFamily) {
      for (const lg of LEAGUES) {
        const reaches =
          lg.id === 'master' ||
          PvPCalculator.calculateCp(form, PERFECT_IV, maxLevel) >= lg.cap;
        if (!reaches) continue;
        cache.set(`${form.id}|${lg.id}`, PvPCalculator.generateRanks(form, lg.cap, 0, maxLevel));
      }
    }
    return cache;
  }, [hasTracked, evolutionFamily, maxLevel]);

  const showEvolutionSection = hasTracked && evolutionFamily.length > 0;

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

  const handleRemoveTracked = (target: IVSet) =>
    setTrackedIvs((prev) =>
      prev.filter((iv) => !(iv.atk === target.atk && iv.def === target.def && iv.hp === target.hp))
    );

  const toggleIvCollapsed = (key: string) =>
    setCollapsedIvKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

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

  // One grid per tracked IV: family forms as rows, the four leagues as columns.
  // Each cell is that locked spread's rank as that form in that league; the best
  // (lowest-rank) form per league is highlighted — the evolution to aim for.
  const renderEvolutionGrid = (iv: IVSet) => {
    const rows = evolutionFamily.map((form) => ({
      form,
      entries: LEAGUES.map((lg) => {
        const ranks = evolutionRanks?.get(`${form.id}|${lg.id}`);
        return ranks?.find(
          (r) => r.ivs.atk === iv.atk && r.ivs.def === iv.def && r.ivs.hp === iv.hp
        ) ?? null;
      }),
    }));

    const ivKey = `${iv.atk}-${iv.def}-${iv.hp}`;
    const collapsed = collapsedIvKeys.has(ivKey);

    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="flex items-center justify-between gap-2 p-3 md:p-5">
          <button
            onClick={() => toggleIvCollapsed(ivKey)}
            aria-expanded={!collapsed}
            className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${collapsed ? '' : 'rotate-90'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 hidden sm:inline">{t('iv.evo_your_iv')}</span>
            <div className="flex gap-1.5 font-black">
              {[iv.atk, iv.def, iv.hp].map((v, i) => (
                <span key={i} className="w-8 md:w-9 text-center py-1.5 bg-black/40 rounded-lg border border-white/5 text-brand-accent text-sm">{v}</span>
              ))}
            </div>
          </button>
          <button
            onClick={() => handleRemoveTracked(iv)}
            aria-label={t('iv.remove_tracked')}
            title={t('iv.remove_tracked')}
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {!collapsed && (
        <div className="px-3 md:px-5 pb-4 pt-1 border-t border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] border-collapse">
            <thead>
              <tr>
                <th className="w-px"></th>
                {LEAGUES.map((lg) => (
                  <th key={lg.id} className="px-1 py-2 text-center text-[9px] font-black uppercase tracking-wider text-gray-500">
                    {stripLeagueWord(t(lg.labelKey))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.form.id} className="border-t border-white/5">
                  <td className="py-2 pr-2 md:pr-3">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <img
                        src={getSpritePath(row.form)}
                        alt={`${localizePokemon(row.form.id, row.form.name)} sprite`}
                        className="w-7 h-7 md:w-9 md:h-9 object-contain flex-shrink-0"
                        onError={(e) => (e.currentTarget.src = '/assets/images/appicon.png')}
                      />
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-tight text-white leading-[1.15] max-w-[68px] md:max-w-none">
                        {localizePokemon(row.form.id, row.form.name)}
                      </span>
                    </div>
                  </td>
                  {row.entries.map((e, li) => {
                    if (!e) {
                      return (
                        <td key={li} className="text-center py-2">
                          <span className="text-gray-600 text-sm font-black">—</span>
                        </td>
                      );
                    }
                    const band = statProductBandColor(e.perfection);
                    return (
                      <td key={li} className="py-1.5 px-0.5 md:px-1">
                        <div
                          title={`${e.cp} CP · Lvl ${e.level} · ${e.perfection}% stat product`}
                          className="mx-auto w-[48px] md:w-[64px] rounded-xl overflow-hidden bg-black/30 border border-white/5 flex flex-col items-center"
                        >
                          <div className="pt-1.5 pb-1 flex flex-col items-center gap-0.5">
                            <span className="text-sm md:text-base font-black leading-none tracking-tighter text-white">#{e.rank}</span>
                            <span className="text-[9px] font-black leading-none" style={{ color: band }}>{e.perfection}%</span>
                          </div>
                          <div className="h-1 w-full" style={{ backgroundColor: band }}></div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        )}
      </div>
    );
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
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{formDisplayName(currentPokemon)}</h3>
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

            {switcherForms.length > 1 && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('iv.forms')}</label>
                <div className="flex flex-wrap gap-2">
                  {switcherForms.map((f) => {
                    const selected = f.id === currentPokemon.id;
                    const label = isMegaForm(f) ? megaQualifier(f) : localizePokemon(f.id, f.name);
                    return (
                      <button
                        key={f.id}
                        onClick={() => { setSelectedId(f.id); setSearchTerm(''); trackEvent('IV Form Switch', { 'Pokemon': f.id }); }}
                        title={formDisplayName(f)}
                        className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 ${selected ? 'bg-brand-accent/15 border-brand-accent/60' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                      >
                        <img src={getSpritePath(f)} alt="" className="w-9 h-9 object-contain" onError={(e) => (e.currentTarget.src = '/assets/images/appicon.png')} />
                        <span className={`text-[9px] font-black uppercase tracking-tight leading-none text-center whitespace-nowrap ${selected ? 'text-brand-accent' : 'text-gray-400'}`}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
                      className={`py-3 rounded-xl text-[10px] font-black transition-all ${maxLevel === l ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => { setMaxLevel(l); trackEvent('IV Level Cap Select', { 'Level Cap': l }); }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-5 md:p-8 rounded-[2rem] border border-white/10">
              {!showIvInput ? (
                <button
                  onClick={() => setShowIvInput(true)}
                  className="w-full flex items-center justify-center gap-3 bg-brand-accent hover:brightness-110 text-white py-4 md:py-5 rounded-2xl transition-all font-black uppercase tracking-[0.15em] text-sm shadow-xl shadow-brand-accent/20 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                  {t('iv.check_my_ivs')}
                </button>
              ) : (
              <div className="space-y-6">
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Evolution × League breakdown — appears once an IV is tracked, above the generic
          Top-10 table. Shows how the locked spread ranks as each evolution across every league. */}
      {showEvolutionSection && (
        <div className="bg-brand-dark/40 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative z-0 glass">
          <div className="px-5 py-6 md:px-10 md:py-8 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-brand-blue shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
              <h4 className="text-xl font-black text-white uppercase tracking-widest">{t('iv.evo_title')}</h4>
            </div>
            {/* Stat-product verdict legend — color = how close the spread is to rank 1 for
                that form + league (IV quality), matching the app's percentToColor bands. */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {STAT_PRODUCT_BANDS.map((b) => (
                <span key={b.label} className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }}></span>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 md:p-8 space-y-5">
            {trackedIvs.map((iv) => (
              <div key={`${iv.atk}-${iv.def}-${iv.hp}`}>{renderEvolutionGrid(iv)}</div>
            ))}
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-brand-dark/40 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative z-0 glass">
        <div className="px-5 py-6 md:px-10 md:py-10 bg-white/5 border-b border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-3 h-3 rounded-full bg-brand-accent shadow-[0_0_12px_rgba(3,147,218,0.5)]"></div>
            <h4 className="text-xl font-black text-white uppercase tracking-widest">
              {showFullTable ? t('iv.top_100') : t('iv.top_10')}
            </h4>
            <span className="text-[9px] font-black uppercase tracking-wider text-brand-accent/90 bg-brand-accent/10 border border-brand-accent/30 rounded-full px-3 py-1">
              {t('iv.pvp_badge')}
            </span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            {trackedIvs.length > 0 && (
              <button onClick={handleClearTracked} className="text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
                {t('iv.clear_tracked')}
              </button>
            )}
            {!tableCollapsed && (
              <button onClick={() => setShowFullTable(!showFullTable)} className="px-4 py-3 md:px-8 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all shadow-lg">
                {showFullTable ? t('iv.show_top_10') : t('iv.show_top_100')}
              </button>
            )}
            <button onClick={() => setTableCollapsed((v) => !v)} aria-expanded={!tableCollapsed} aria-label={t('iv.toggle_table')} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-lg flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-white transition-transform ${tableCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>

        {!tableCollapsed && (
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
                        {isTracked && <div className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(3,147,218,0.8)]"></div>}
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
                          <div className="h-full bg-brand-accent shadow-[0_0_8px_rgba(3,147,218,0.4)] transition-all duration-1000" style={{ width: `${r.perfection}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Contextual CTA — fires at peak intent, right after the user sees their rank. */}
      <div className="bg-gradient-to-br from-brand-accent/15 via-brand-dark/40 to-brand-blue/10 rounded-[2.5rem] border border-white/10 shadow-2xl glass px-6 py-10 md:px-12 md:py-12 text-center">
        <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase mb-8 max-w-2xl mx-auto leading-tight">
          {t('iv.cta_build_team')}
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <a
            href={CTA_APP_STORE_URL}
            data-placement="iv-result-cta"
            target="_blank"
            rel="noopener"
            className="w-full sm:w-[240px] h-[72px] bg-black border border-white/20 rounded-2xl flex items-center px-6 gap-5 hover:bg-white/5 hover:border-white/60 transition-all group shadow-xl"
          >
            <svg viewBox="0 0 384 512" className="w-9 h-9 flex-shrink-0 fill-white transition-transform group-hover:scale-110">
              <path d="M318.7 268.7c-.2-36.7 21.3-64.4 50.4-81.2-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-83.6-20.8-42.3 0-81.8 24.4-103.2 61.9-43.2 75.2-11.1 186.1 31 247.1 20.6 29.8 44.8 63.3 76.9 62.2 31.3-1.1 43.1-20.1 81-20.1 37.9 0 48.9 20.1 81.1 19.4 33.1-.7 54.4-30.3 74.9-59.7 23.6-34.1 33.2-67.1 33.5-68.8-.7-.3-64.9-24.9-65.5-98.4zM286.1 102c15.7-19.1 26.2-45.5 23.3-71.9-22.1 1-48.8 14.8-64.6 32.5-14.2 15.8-26.7 42.9-23.3 68.7 24.4 1.9 48.9-10.2 64.6-29.3z" />
            </svg>
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Download on</span>
              <span className="text-xl font-black text-white tracking-tight uppercase whitespace-nowrap">App Store</span>
            </div>
          </a>
          <a
            href={CTA_PLAY_STORE_URL}
            data-placement="iv-result-cta"
            target="_blank"
            rel="noopener"
            className="w-full sm:w-[240px] h-[72px] bg-black border border-white/20 rounded-2xl flex items-center px-6 gap-5 hover:bg-white/5 hover:border-white/60 transition-all group shadow-xl"
          >
            <svg viewBox="0 0 512 512" className="w-9 h-9 flex-shrink-0 transition-transform group-hover:scale-110">
              <path fill="#4285F4" d="M12 25c-3 4-5 10-5 18v426c0 8 2 14 5 18l1 1L240 256v-2l-227-230z" />
              <path fill="#FBBC05" d="M316 334l-76-78v-2l76-78 1 1 90 51c26 15 26 39 0 54l-90 51z" />
              <path fill="#EA4335" d="M241 256l-229 231c4 3 10 4 17 0l308-175-96-56z" />
              <path fill="#34A853" d="M241 256l96-56L30 25c-7-4-13-3-17 0l228 231z" />
            </svg>
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Get it on</span>
              <span className="text-xl font-black text-white tracking-tight uppercase whitespace-nowrap">Google Play</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
