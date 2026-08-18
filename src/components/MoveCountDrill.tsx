import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ui } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';
import { trackEvent } from '../lib/analytics';
import { CTA_VISIBILITY_THRESHOLDS, isCtaVisible } from '../lib/cta-visibility';
import { DRILL_LEAGUE_IDS, LEAGUE_LABEL_KEYS, drillLeagues, type DrillLeagueId } from '../lib/drill-data';
import {
  buildDeck,
  cadenceDifficulty,
  formatCadence,
  mulberry32,
  type DrillCard,
  type DrillMode,
} from '../lib/move-counts';
import { moves as movesData } from '../lib/moves-data';
import { pokemon as pokemonData } from '../lib/pokemon-data';
import StoreCtaButtons from './StoreCtaButtons';
import {
  TYPE_COLORS,
  getMoveName,
  getPokemonName,
  getSpritePath,
  hexToRgba,
  type LocaleDictionary,
  type Move,
  type Pokemon,
} from '../lib/game-data';

interface Props {
  lang: string;
  pokemonTranslations: LocaleDictionary;
  moveTranslations: LocaleDictionary;
}

const RESULT_PLACEMENT = 'move-counts-result';

/** Cards per session. Long enough to produce a real score, short enough to finish. */
const SESSION_LENGTH = 10;

/**
 * The first deck every visitor gets. Fixed rather than random so the static HTML
 * Astro renders matches what React hydrates — a random seed in a `useState`
 * initializer runs once at build time and again in the browser, and the two
 * disagree. Replaying (or switching league/mode) reseeds from `Math.random`.
 */
const INITIAL_SEED = 20260818;

const MOVE_BY_ID = new Map<string, Move>(movesData.map((m) => [m.id, m]));
const POKEMON_BY_ID = new Map<string, Pokemon>(pokemonData.map((p) => [p.id, p]));

const MODES: { id: DrillMode; labelKey: keyof (typeof ui)['en'] }[] = [
  { id: 'mixed', labelKey: 'drill.mode_mixed' },
  { id: 'count', labelKey: 'drill.mode_count' },
  { id: 'moveset', labelKey: 'drill.mode_moveset' },
];

function MoveChip({ move, label }: { move: Move; label: string }) {
  const color = TYPE_COLORS[move.type] ?? '#a3a49e';
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border"
      style={{ backgroundColor: hexToRgba(color, 0.15), borderColor: hexToRgba(color, 0.4), color }}
    >
      {label}
    </span>
  );
}

export default function MoveCountDrill({ lang, pokemonTranslations, moveTranslations }: Props) {
  const t = useTranslations(lang as keyof typeof ui);

  const [leagueId, setLeagueId] = useState<DrillLeagueId>('great');
  const [mode, setMode] = useState<DrillMode>('mixed');
  const [seed, setSeed] = useState(INITIAL_SEED);
  const [index, setIndex] = useState(0);
  /** Chosen option index per answered card; `answers.length` is the cursor. */
  const [answers, setAnswers] = useState<number[]>([]);

  const localizeMove = (m: Move) => getMoveName(m.id, m.name, moveTranslations);
  const localizeSpecies = (id: string) => {
    const p = POKEMON_BY_ID.get(id);
    return p ? getPokemonName(p.id, p.name, pokemonTranslations) : id;
  };

  const cards = useMemo(() => {
    const league = drillLeagues[leagueId];
    return buildDeck(league.species, MOVE_BY_ID, { mode }, mulberry32(seed)).slice(0, SESSION_LENGTH);
  }, [leagueId, mode, seed]);

  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaSeenRef = useRef(false);

  const finished = index >= cards.length;
  const score = answers.reduce((n, choice, i) => n + (choice === cards[i]?.answerIndex ? 1 : 0), 0);
  const current = cards[index];
  const selected = answers[index];
  const answered = selected !== undefined;

  /**
   * Start a fresh session. The progress reset has to happen here, not in an
   * effect keyed on `cards`: an effect runs after commit, leaving one render in
   * which `index` still points past the end of the *new* deck — long enough for
   * the completion effect below to fire a `Drill Complete` scoring the previous
   * session's answers against the new cards, and to latch `completedRef` so the
   * real one never fires.
   */
  const restart = (next: Partial<{ leagueId: DrillLeagueId; mode: DrillMode }> = {}) => {
    startedRef.current = false;
    completedRef.current = false;
    setIndex(0);
    setAnswers([]);
    if (next.leagueId) setLeagueId(next.leagueId);
    if (next.mode) setMode(next.mode);
    setSeed(Math.floor(Math.random() * 2 ** 31));
  };

  const answer = (choice: number) => {
    if (answered) return;
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent('Drill Start', { League: leagueId, Mode: mode });
    }
    setAnswers((prev) => [...prev, choice]);
  };

  useEffect(() => {
    // `answers.length` is the guard that the score describes *this* deck.
    if (!finished || completedRef.current || cards.length === 0) return;
    if (answers.length !== cards.length) return;
    completedRef.current = true;
    trackEvent('Drill Complete', {
      League: leagueId,
      Mode: mode,
      Score: score,
      Total: cards.length,
    });
  }, [finished, cards.length, answers.length, leagueId, mode, score]);

  // One impression per page load — deliberately not reset by `restart()`, so the
  // denominator stays "visitors who saw the CTA" rather than "times it rendered".
  // Pairs with the `move-counts-result` Store Click to separate "never finished
  // a drill" from "finished, didn't click".
  useEffect(() => {
    const el = ctaRef.current;
    if (!finished || !el || ctaSeenRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(isCtaVisible) && !ctaSeenRef.current) {
          ctaSeenRef.current = true;
          trackEvent('CTA Shown', { Placement: RESULT_PLACEMENT });
          observer.disconnect();
        }
      },
      { threshold: CTA_VISIBILITY_THRESHOLDS }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [finished]);

  const missed = finished
    ? cards.filter((card, i) => answers[i] !== card.answerIndex)
    : [];

  const sprite = (speciesId: string) => {
    const p = POKEMON_BY_ID.get(speciesId);
    return p ? getSpritePath(p) : '';
  };

  const optionLabel = (card: DrillCard, choice: number) =>
    card.kind === 'count'
      ? String(card.choices[choice])
      : card.choices[choice].map(localizeMove).join(' · ');

  const answerLabel = (card: DrillCard) => optionLabel(card, card.answerIndex);

  return (
    <div className="container mx-auto px-6" data-testid="drill">
      <div className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> {t('drill.league')}
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
              {DRILL_LEAGUE_IDS.map((id) => (
                <button
                  key={id}
                  data-testid="drill-league"
                  data-league={id}
                  aria-pressed={leagueId === id}
                  onClick={() => restart({ leagueId: id })}
                  className={`py-3 px-1 rounded-xl text-[10px] font-black uppercase transition-all ${
                    leagueId === id
                      ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t(LEAGUE_LABEL_KEYS[id]).replace(/League|Liga|Ligue|Lega|リーグ|聯盟|리그/gi, '').trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> {t('drill.mode')}
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  data-testid="drill-mode"
                  data-mode={m.id}
                  aria-pressed={mode === m.id}
                  onClick={() => restart({ mode: m.id })}
                  className={`py-3 px-1 rounded-xl text-[10px] font-black uppercase transition-all ${
                    mode === m.id
                      ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t(m.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
          {!finished && current ? (
            <>
              {/* Progress */}
              <div className="px-6 py-5 md:px-10 bg-white/5 border-b border-white/10 flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  {cards.map((card, i) => (
                    <span
                      key={card.key}
                      className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6' : 'w-3'} ${
                        i < answers.length
                          ? answers[i] === card.answerIndex
                            ? 'bg-emerald-400'
                            : 'bg-red-400'
                          : i === index
                            ? 'bg-brand-accent'
                            : 'bg-white/15'
                      }`}
                    />
                  ))}
                </div>
                <div data-testid="drill-progress" className="text-[10px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">
                  {index + 1} / {cards.length}
                </div>
              </div>

              <div className="p-6 md:p-10">
                {/* Prompt */}
                <div className="flex flex-col items-center text-center mb-8">
                  <img
                    src={sprite(current.speciesId)}
                    alt=""
                    width={96}
                    height={96}
                    className="w-24 h-24 object-contain drop-shadow-[0_8px_24px_rgba(3,147,218,0.25)]"
                  />
                  <h2 data-testid="drill-species" className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2">
                    {localizeSpecies(current.speciesId)}
                  </h2>
                  <p className="text-sm text-gray-400 font-medium mt-3 mb-5">
                    {current.kind === 'count' ? t('drill.q_count') : t('drill.q_moveset')}
                  </p>
                  {current.kind === 'count' && (
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                      <span data-testid="drill-fast"><MoveChip move={current.fast} label={localizeMove(current.fast)} /></span>
                      <span className="text-gray-500 font-black">→</span>
                      <span data-testid="drill-charged"><MoveChip move={current.charged} label={localizeMove(current.charged)} /></span>
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className={`grid gap-3 ${current.kind === 'count' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1'}`}>
                  {current.choices.map((_, i) => {
                    const isAnswer = i === current.answerIndex;
                    const isPicked = selected === i;
                    let state = 'bg-white/5 border-white/10 text-white hover:border-brand-accent/60 hover:bg-white/10';
                    if (answered && isAnswer) state = 'bg-emerald-400/15 border-emerald-400/60 text-emerald-200';
                    else if (answered && isPicked) state = 'bg-red-400/15 border-red-400/60 text-red-200';
                    else if (answered) state = 'bg-white/5 border-white/10 text-gray-500';
                    return (
                      <button
                        key={i}
                        data-testid="drill-option"
                        data-index={i}
                        data-correct={isAnswer}
                        onClick={() => answer(i)}
                        disabled={answered}
                        className={`rounded-2xl border px-4 py-4 font-black transition-all ${state} ${
                          current.kind === 'count' ? 'text-2xl' : 'text-sm text-left'
                        } ${answered ? 'cursor-default' : 'active:scale-95'}`}
                      >
                        {optionLabel(current, i)}
                      </button>
                    );
                  })}
                </div>

                {/* Reveal */}
                {answered && (
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                      <div>
                        <div
                          data-testid="drill-feedback"
                          data-result={selected === current.answerIndex ? 'correct' : 'wrong'}
                          className={`text-xs font-black uppercase tracking-widest mb-2 ${
                            selected === current.answerIndex ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {selected === current.answerIndex ? t('drill.correct') : t('drill.wrong')}
                        </div>
                        {current.kind === 'count' ? (
                          <>
                            <div data-testid="drill-cadence" className="text-white font-black text-lg tracking-tight">
                              {formatCadence(current.cadence)}
                            </div>
                            <p className="text-xs text-gray-400 mt-1 max-w-md">
                              {t('drill.cadence_hint')}
                              {cadenceDifficulty(current.cadence) === 'shifting' && ` ${t('drill.cadence_shifts')}`}
                            </p>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            {current.moves.map((m) => (
                              <MoveChip key={m.id} move={m} label={localizeMove(m)} />
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        data-testid="drill-next"
                        onClick={() => setIndex(index + 1)}
                        className="bg-brand-accent hover:brightness-110 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-xs shadow-xl shadow-brand-accent/20 active:scale-95 transition-all whitespace-nowrap"
                      >
                        {index + 1 === cards.length ? t('drill.see_results') : t('drill.next')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Results */
            <div data-testid="drill-results" className="p-6 md:p-10">
              <div className="text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                  {t('drill.score_label')}
                </div>
                <div data-testid="drill-score" data-score={score} data-total={cards.length} className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
                  {score}
                  <span className="text-gray-600">/{cards.length}</span>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">
                  {missed.length > 0 ? t('drill.results_review') : t('drill.results_clean')}
                </h3>
                {missed.length > 0 ? (
                  <ul className="space-y-2">
                    {missed.map((card) => (
                      <li
                        key={card.key}
                        data-testid="drill-missed"
                        data-card={card.key}
                        className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-3"
                      >
                        <img src={sprite(card.speciesId)} alt="" width={40} height={40} className="w-10 h-10 object-contain flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-white truncate">
                            {localizeSpecies(card.speciesId)}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {card.kind === 'count'
                              ? `${localizeMove(card.fast)} → ${localizeMove(card.charged)}`
                              : t('drill.mode_moveset')}
                          </div>
                        </div>
                        <div className="text-sm font-black text-emerald-300 text-right whitespace-nowrap">
                          {card.kind === 'count' ? formatCadence(card.cadence) : answerLabel(card)}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">{t('drill.results_clean_hint')}</p>
                )}
              </div>

              <div ref={ctaRef} className="mt-10 pt-10 border-t border-white/10 text-center">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-3 max-w-xl mx-auto leading-tight">
                  {t('drill.cta_title')}
                </h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-8 max-w-lg mx-auto">
                  {t('drill.cta_desc')}
                </p>
                <StoreCtaButtons
                  placement={RESULT_PLACEMENT}
                  iosPrefix={t('download.ios_prefix')}
                  androidPrefix={t('download.android_prefix')}
                />
                <button
                  data-testid="drill-play-again"
                  onClick={() => restart()}
                  className="mt-8 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  {t('drill.play_again')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
