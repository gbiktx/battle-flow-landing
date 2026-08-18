import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ui } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';
import { trackEvent } from '../lib/analytics';
import { cadenceCounts, cadenceDifficulty, formatCadence } from '../lib/move-counts';
import { poolMoves, poolSpecies, type PoolSpecies } from '../lib/move-pools-data';
import {
  TYPE_COLORS,
  getMoveName,
  getPokemonName,
  getSpritePath,
  hexToRgba,
  type LocaleDictionary,
} from '../lib/game-data';

// The chart below covers the meta 30 per league, which is what most visitors
// want and all a crawler can read. This is the escape hatch for the rest: any
// of the ~1,100 released species, every fast x charged pair it can learn.
//
// Deliberately not a set of per-species pages — Search Console shows the
// "[species] move counts" query cluster at effectively zero demand, so 1,100
// thin pages would be crawl budget spent on nothing. One client-side lookup
// covers the same intent.

interface Props {
  lang: string;
  pokemonTranslations: LocaleDictionary;
  moveTranslations: LocaleDictionary;
}

/** Matches shown under the search box. Enough to disambiguate, short enough to tap. */
const MAX_MATCHES = 8;

const SPECIES_BY_ID = new Map(poolSpecies.map((s) => [s.id, s]));

/** Forms sort after their base ("gholdengo" before "giratina_origin"). */
const collator = new Intl.Collator('en');

export default function MoveCountLookup({ lang, pokemonTranslations, moveTranslations }: Props) {
  const t = useTranslations(lang as keyof typeof ui);

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fastId, setFastId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const speciesName = (s: PoolSpecies) => getPokemonName(s.id, s.name, pokemonTranslations);
  const moveName = (id: string) => getMoveName(id, poolMoves[id]?.name ?? id, moveTranslations);

  // Resolving and lower-casing ~1,120 localized names on every keystroke (and
  // twice more per sort comparison) is visible lag on a phone, which is most of
  // this site's traffic. Build the searchable strings once per locale instead.
  const searchIndex = useMemo(
    () =>
      poolSpecies
        .map((species) => {
          const display = getPokemonName(species.id, species.name, pokemonTranslations);
          return { species, display, haystack: `${display}\u0000${species.name}`.toLowerCase() };
        })
        .sort((a, b) => collator.compare(a.display, b.display)),
    [pokemonTranslations]
  );

  // Matches the localized name as well as the English one — a Japanese visitor
  // types the Japanese name, but the dataset only carries the English fallback.
  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    const found: PoolSpecies[] = [];
    for (const entry of searchIndex) {
      if (!entry.haystack.includes(term)) continue;
      found.push(entry.species);
      if (found.length === MAX_MATCHES) break;
    }
    return found;
  }, [query, searchIndex]);

  const listOpen = open && query.trim() !== '';
  const selected = selectedId ? SPECIES_BY_ID.get(selectedId) ?? null : null;
  const fast = selected ? poolMoves[fastId ?? selected.fast[0]] : undefined;
  const activeFastId = selected ? fastId ?? selected.fast[0] : null;

  const rows = useMemo(() => {
    if (!selected || !fast) return [];
    return selected.charged
      .map((id) => {
        const charged = poolMoves[id];
        if (!charged) return null;
        const cadence = cadenceCounts(charged.energy, fast.energyGain);
        return { id, charged, cadence, shifting: cadenceDifficulty(cadence) === 'shifting' };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => a.cadence[0] - b.cadence[0]);
  }, [selected, fast]);

  // Clicking away closes the suggestion list without clearing the selection.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const select = (s: PoolSpecies) => {
    setSelectedId(s.id);
    setFastId(s.fast[0]);
    setQuery('');
    setOpen(false);
    trackEvent('Move Count Lookup', { Species: s.id });
  };

  const clear = () => {
    setSelectedId(null);
    setFastId(null);
    setQuery('');
  };

  const typeStyle = (type: string) => {
    const color = TYPE_COLORS[type] ?? '#a3a49e';
    return {
      backgroundColor: hexToRgba(color, 0.14),
      borderColor: hexToRgba(color, 0.35),
      color,
    };
  };

  return (
    <div className="container mx-auto px-6" data-testid="lookup">
      <div className="max-w-3xl mx-auto glass card-shadow rounded-[2rem] border border-white/10 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-2">
          {t('drill.lookup_title')}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">{t('drill.lookup_intro')}</p>

        <div className="relative" ref={boxRef}>
          <label htmlFor="move-count-search" className="sr-only">
            {t('drill.lookup_placeholder')}
          </label>
          <input
            id="move-count-search"
            data-testid="lookup-input"
            type="search"
            autoComplete="off"
            role="combobox"
            aria-expanded={listOpen}
            aria-controls="move-count-matches"
            aria-autocomplete="list"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-accent transition-colors"
            placeholder={t('drill.lookup_placeholder')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              // Enter takes the top match and Escape dismisses the list, so the
              // search is usable without ever touching the pointer.
              if (e.key === 'Enter' && matches.length > 0) {
                e.preventDefault();
                select(matches[0]);
              } else if (e.key === 'Escape') {
                setOpen(false);
              }
            }}
          />

          {listOpen && (
            <div
              id="move-count-matches"
              role="listbox"
              data-testid="lookup-matches"
              className="absolute z-20 mt-2 w-full max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-brand-dark/95 backdrop-blur-xl shadow-2xl"
            >
              {matches.length === 0 ? (
                <p className="px-5 py-4 text-sm text-gray-500" data-testid="lookup-empty">
                  {t('drill.lookup_empty')}
                </p>
              ) : (
                matches.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    data-testid="lookup-match"
                    data-species={s.id}
                    role="option"
                    aria-selected={false}
                    onClick={() => select(s)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                  >
                    <img
                      src={getSpritePath(s)}
                      alt=""
                      width="32"
                      height="32"
                      loading="lazy"
                      className="w-8 h-8 object-contain flex-shrink-0"
                    />
                    <span className="font-bold text-white">{speciesName(s)}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {selected && fast && (
          <div className="mt-6" data-testid="lookup-result" data-species={selected.id}>
            <div className="flex items-center gap-3 mb-5">
              <img
                src={getSpritePath(selected)}
                alt=""
                width="56"
                height="56"
                className="w-14 h-14 object-contain flex-shrink-0"
              />
              <p className="text-xl font-black text-white flex-1 min-w-0 truncate" data-testid="lookup-name">
                {speciesName(selected)}
              </p>
              <button
                type="button"
                data-testid="lookup-clear"
                onClick={clear}
                className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                {t('drill.lookup_clear')}
              </button>
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              {t('drill.lookup_fast_label')}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {selected.fast.map((id) => {
                const move = poolMoves[id];
                if (!move) return null;
                const active = id === activeFastId;
                return (
                  <button
                    key={id}
                    type="button"
                    data-testid="lookup-fast"
                    data-move={id}
                    aria-pressed={active}
                    onClick={() => setFastId(id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      active ? 'ring-2 ring-brand-accent' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={typeStyle(move.type)}
                  >
                    {moveName(id)}
                    <span className="ml-2 opacity-70 tabular-nums">+{move.energyGain}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
              {t('drill.chart_legend')}
            </p>
            <ul className="space-y-2">
              {rows.map((row) => (
                <li
                  key={row.id}
                  data-testid="lookup-row"
                  data-charged={row.id}
                  className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <span className="flex items-baseline gap-2 min-w-0">
                    <span
                      className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border truncate"
                      style={typeStyle(row.charged.type)}
                    >
                      {moveName(row.id)}
                    </span>
                    <span className="text-[11px] font-bold text-gray-500 tabular-nums flex-shrink-0">
                      {row.charged.energy}e
                    </span>
                  </span>
                  <span
                    data-testid="lookup-cadence"
                    className={`font-black tabular-nums whitespace-nowrap ${
                      row.shifting ? 'text-brand-accent' : 'text-white'
                    }`}
                  >
                    {formatCadence(row.cadence)}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-gray-500 mt-4 leading-relaxed">{t('drill.lookup_hint')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
