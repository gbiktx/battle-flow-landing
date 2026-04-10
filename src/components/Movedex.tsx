import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import movesData from '../data/moves.json';
import translations from '../data/translations.json';
import { useTranslations } from '../i18n/utils';
import { ui } from '../i18n/ui';
import { trackEvent } from '../lib/analytics';

interface Props {
  lang: string;
}

const TYPE_COLORS: Record<string, string> = {
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

const hexToRgba = (hex: string, opacity: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const toCamelCase = (str: string) => {
  return str.toLowerCase().split('_').map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
};

export default function Movedex({ lang }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [moveType, setMoveType] = useState<'fast' | 'charged'>('fast');

  const t = useTranslations(lang as keyof typeof ui);
  const langTranslations = (translations as any)[lang] || (translations as any)['en'] || {};

  const getMoveName = (id: string, defaultName: string) => {
    const key = 'move' + toCamelCase(id);
    return langTranslations[key] || defaultName;
  };

  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!searchTerm) return;
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      trackEvent('MoveDex Search', { 'Query': searchTerm, 'Move Category': moveType });
    }, 800);
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm]);

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
    setSearchTerm('');
    trackEvent('MoveDex Type Filter', { 'Type': type, 'Move Category': moveType });
  };

  const formatEffect = (move: any) => {
    const effects: string[] = [];
    const chance = Math.round(parseFloat(move.buffApplyChance || '0') * 100);
    const probLabel = t('movedex.prob');
    const guaranteedLabel = t('movedex.guaranteed');
    const chanceStr = chance === 100 ? guaranteedLabel : `${chance}% ${probLabel}`;

    const processBuffs = (buffs: number[], target: string) => {
      const atk = buffs[0];
      const def = buffs[1];
      
      const targetLabels: Record<string, string> = {
        self: t('movedex.self'),
        opponent: t('movedex.opponent')
      };

      const statLabels = {
        atk: t('movedex.attack'),
        def: t('movedex.defense')
      };

      if (atk !== 0) {
        effects.push(`${targetLabels[target]}: ${atk > 0 ? '+' : ''}${atk} ${statLabels.atk.toLowerCase()} | ${chanceStr}`);
      }
      if (def !== 0) {
        effects.push(`${targetLabels[target]}: ${def > 0 ? '+' : ''}${def} ${statLabels.def.toLowerCase()} | ${chanceStr}`);
      }
    };

    if (move.buffsSelf || move.buffsOpponent) {
      if (move.buffsSelf) processBuffs(move.buffsSelf, 'self');
      if (move.buffsOpponent) processBuffs(move.buffsOpponent, 'opponent');
    } else if (move.buffs && move.buffTarget) {
      if (move.buffTarget === 'both') {
        processBuffs(move.buffs, 'self');
        processBuffs(move.buffs, 'opponent');
      } else {
        processBuffs(move.buffs, move.buffTarget);
      }
    }

    return effects;
  };

  const filteredMoves = useMemo(() => {
    return movesData.filter((move: any) => {
      const isCorrectType = moveType === 'fast' ? move.energyGain > 0 : move.energy > 0;
      const matchesSearch = move.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          getMoveName(move.id, move.name).toLowerCase().includes(searchTerm.toLowerCase());
      const moveTypeLower = (move.type || '').toLowerCase();
      const matchesType = selectedType === 'all' || moveTypeLower === selectedType.toLowerCase();
      
      return isCorrectType && matchesSearch && matchesType;
    }).sort((a: any, b: any) => getMoveName(a.id, a.name).localeCompare(getMoveName(b.id, b.name)));
  }, [searchTerm, selectedType, moveType, lang]);

  const types = ['all', ...Object.keys(TYPE_COLORS)];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="glass p-6 rounded-2xl mb-8 border border-white/10 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder={t('movedex.search_placeholder')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-brand-accent transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-full md:w-auto">
            <button
              onClick={() => { setMoveType('fast'); trackEvent('MoveDex Move Category', { 'Move Category': 'fast' }); }}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                moveType === 'fast' ? 'bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('movedex.fast_moves')}
            </button>
            <button
              onClick={() => { setMoveType('charged'); trackEvent('MoveDex Move Category', { 'Move Category': 'charged' }); }}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                moveType === 'charged' ? 'bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('movedex.charged_moves')}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {types.map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => handleTypeClick(type)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                  isSelected
                    ? 'bg-brand-accent text-brand-dark border-brand-accent scale-105 shadow-lg shadow-brand-accent/20'
                    : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {type === 'all' ? t('movedex.all_types') : (t(`type.${type}`) || type)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Moves List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-0">
        {filteredMoves.map((move: any) => {
          const dpt = moveType === 'fast' ? (move.power / move.turns).toFixed(2) : null;
          const ept = moveType === 'fast' ? (move.energyGain / move.turns).toFixed(2) : null;
          const dpe = moveType === 'charged' ? (move.power / move.energy).toFixed(2) : null;
          const effects = formatEffect(move);
          const typeColor = TYPE_COLORS[move.type] || '#ffffff';

          return (
            <div 
              key={move.id} 
              className="glass p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all group overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white mb-1 group-hover:text-brand-accent transition-colors uppercase">
                      {getMoveName(move.id, move.name)}
                    </h3>
                    <div 
                      className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                      style={{ 
                        backgroundColor: hexToRgba(typeColor, 0.25),
                        color: typeColor,
                        border: `1px solid ${hexToRgba(typeColor, 0.5)}`
                      }}
                    >
                      {t(`type.${move.type}`) || move.type}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('movedex.damage')}</div>
                    <div className="text-xl font-black text-white">{move.power}</div>
                  </div>
                  {moveType === 'fast' ? (
                    <>
                      <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('movedex.energy_gain')}</div>
                        <div className="text-xl font-black text-brand-accent">+{move.energyGain}</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('movedex.turns')}</div>
                        <div className="text-xl font-black text-white">{move.turns}</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('movedex.dpt')}</div>
                        <div className="text-xl font-black text-white">{dpt}</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('movedex.ept')}</div>
                        <div className="text-xl font-black text-white">{ept}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('movedex.energy')}</div>
                        <div className="text-xl font-black text-red-400">-{move.energy}</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('movedex.dpe')}</div>
                        <div className="text-xl font-black text-white">{dpe}</div>
                      </div>
                    </>
                  )}
                </div>

                {effects.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('movedex.effects')}</div>
                    <div className="space-y-1">
                      {effects.map((effect, idx) => (
                        <div key={idx} className="text-xs text-white font-black bg-black/20 px-2 py-1.5 rounded">
                          {effect}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
