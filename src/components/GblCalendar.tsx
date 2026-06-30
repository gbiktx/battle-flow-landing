import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from '../i18n/utils';
import { ui } from '../i18n/ui';
import { TYPE_COLORS, hexToRgba } from '../lib/game-data';
import {
  foreverForward,
  focusIndexAt,
  statusAt,
  type GblFeature,
  type GblLeagueTier,
  type GblRule,
  type GblScheduleEntry,
  type GblWindowStatus,
} from '../lib/gbl-schedule';

interface Props {
  lang: string;
}

// League accent colors — mirror the brand palette rather than introducing a
// fourth color system. The badge carries league identity at a glance.
const TIER_COLORS: Record<GblLeagueTier, string> = {
  little: '#6ac7e9',
  great: '#59c079',
  ultra: '#fedf6b',
  master: '#a662c7',
};

const RULE_KEYS: Record<Exclude<GblRule, 'none'>, 'gbl.rule_mega' | 'gbl.rule_premier' | 'gbl.rule_naic' | 'gbl.rule_evolution' | 'gbl.rule_retro'> = {
  megaEdition: 'gbl.rule_mega',
  premierNoMythicalLegendary: 'gbl.rule_premier',
  naicExclusion: 'gbl.rule_naic',
  evolutionOnly: 'gbl.rule_evolution',
  retroExclusion: 'gbl.rule_retro',
};

const LEAGUE_LOGO: Record<GblLeagueTier, string> = {
  little: '/assets/images/leagues/little_league.png',
  great: '/assets/images/leagues/great_league.png',
  ultra: '/assets/images/leagues/ultra_league.png',
  master: '/assets/images/leagues/master_league.png',
};

// Cup badges shipped under public/assets/images/cups. The Mega Editions have no
// dedicated badge and fall back to the league-tier logo (app convention) —
// mirrors the app's _featureIconAsset resolution.
const CUPS_WITH_LOGO = new Set([
  'sunshine', 'summer', 'fantasy', 'retro', 'premier', 'scroll',
  'weather', 'evolution', 'naic2026',
]);

function featureIconSrc(f: GblFeature): string {
  if (f.cupName !== 'all' && CUPS_WITH_LOGO.has(f.cupName)) {
    return `/assets/images/cups/${f.cupName}.png`;
  }
  return LEAGUE_LOGO[f.tier];
}

// i18n key for a feature's base name. Open formats and Mega Editions ('all'/
// 'mega') resolve to the league name (the "Edition" reads off the rule pill);
// every other cup maps to `gbl.name_<cupName>`.
function featureNameKey(f: GblFeature): keyof typeof ui['en'] {
  if (f.cupName === 'all' || f.cupName === 'mega') {
    const byTier: Record<GblLeagueTier, keyof typeof ui['en']> = {
      great: 'gbl.name_great',
      ultra: 'gbl.name_ultra',
      master: 'gbl.name_master',
      little: 'gbl.name_little',
    };
    return byTier[f.tier];
  }
  return `gbl.name_${f.cupName}` as keyof typeof ui['en'];
}

function FeatureIcon({ feature }: { feature: GblFeature }) {
  const tierColor = TIER_COLORS[feature.tier];
  return (
    <span
      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border"
      style={{ borderColor: hexToRgba(tierColor, 0.4), backgroundColor: hexToRgba(tierColor, 0.12) }}
      aria-hidden="true"
    >
      <img
        src={featureIconSrc(feature)}
        alt=""
        width={28}
        height={28}
        loading="lazy"
        className="w-7 h-7 object-contain"
        onError={(e) => {
          // Safety net: drop to the league logo if a badge ever fails to load.
          const img = e.currentTarget;
          const fallback = LEAGUE_LOGO[feature.tier];
          if (!img.src.endsWith(fallback)) img.src = fallback;
        }}
      />
    </span>
  );
}

export default function GblCalendar({ lang }: Props) {
  const t = useTranslations(lang as keyof typeof ui);
  const season = foreverForward;

  // Compute "now" on the client so live/upcoming/ended stays accurate against
  // the visitor's clock (the page itself is statically built).
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const focusIndex = useMemo(
    () => (now ? focusIndexAt(season, now) : -1),
    [season, now],
  );

  const focusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusIndex >= 0) {
      focusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusIndex]);

  // Windows are stored at the 20:00 UTC flip; the UTC calendar day is the
  // canonical PT rotation date, so format the fields in UTC (no tz shift).
  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(lang, { month: 'short', day: 'numeric', timeZone: 'UTC' }),
    [lang],
  );
  const dateRange = (e: GblScheduleEntry) =>
    `${dateFmt.format(new Date(e.start))} – ${dateFmt.format(new Date(e.end))}`;

  const seasonSpan = season.windows.length
    ? `${dateFmt.format(new Date(season.windows[0].start))} – ${dateFmt.format(
        new Date(season.windows[season.windows.length - 1].end),
      )}`
    : '';

  return (
    <div className="max-w-3xl mx-auto px-4 pb-8">
      <div className="glass rounded-2xl border border-white/10 p-5 sm:p-6 mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-accent mb-1">
            {t('gbl.season')}
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
            {t('gbl.season_name')}
          </div>
        </div>
        <div className="text-sm font-black uppercase tracking-widest text-white/50 shrink-0 text-right">
          {seasonSpan}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {season.windows.map((entry, i) => {
          const status: GblWindowStatus = now ? statusAt(entry, now) : 'upcoming';
          return (
            <WeekCard
              key={entry.start}
              cardRef={i === focusIndex ? focusRef : undefined}
              entry={entry}
              status={now ? status : null}
              dateRange={dateRange(entry)}
              t={t}
            />
          );
        })}
      </div>
    </div>
  );
}

function WeekCard({
  entry,
  status,
  dateRange,
  t,
  cardRef,
}: {
  entry: GblScheduleEntry;
  status: GblWindowStatus | null;
  dateRange: string;
  t: (key: keyof typeof ui['en']) => string;
  cardRef?: React.Ref<HTMLDivElement>;
}) {
  const isLive = status === 'live';
  const dimmed = status === 'ended';

  return (
    <div ref={cardRef} className={dimmed ? 'opacity-55 transition-opacity' : 'transition-opacity'}>
      <div
        className={`glass rounded-2xl p-5 sm:p-6 border ${
          isLive ? 'border-brand-accent shadow-lg shadow-brand-accent/10' : 'border-white/10'
        }`}
      >
        <div className="flex items-center gap-3 mb-5">
          <span className="text-sm font-black uppercase tracking-widest text-white/70 flex-1">
            {dateRange}
          </span>
          {entry.multiStardust && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/25">
              {t('gbl.stardust')}
            </span>
          )}
          {status && <StatusChip status={status} t={t} />}
        </div>

        <div className="flex flex-col divide-y divide-white/5">
          {entry.features.map((f, i) => (
            <FeatureRow key={`${f.cupName}-${f.cpLimit}-${i}`} feature={f} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureRow({
  feature,
  t,
}: {
  feature: GblFeature;
  t: (key: keyof typeof ui['en']) => string;
}) {
  const ruleLabel = feature.rule !== 'none' ? t(RULE_KEYS[feature.rule]) : null;

  return (
    <div className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0">
      <FeatureIcon feature={feature} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-bold text-white">{t(featureNameKey(feature)) || feature.title}</span>
          <span className="text-[11px] font-black uppercase tracking-wider text-white/40">
            {t('gbl.cp')} {feature.cpLimit}
          </span>
        </div>

        {(feature.eligibleTypes.length > 0 || ruleLabel) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {feature.eligibleTypes.map((type) => {
              const color = TYPE_COLORS[type] || '#a3a49e';
              return (
                <span
                  key={type}
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                  style={{
                    color,
                    borderColor: hexToRgba(color, 0.35),
                    backgroundColor: hexToRgba(color, 0.1),
                  }}
                >
                  {t(`type.${type}` as keyof typeof ui['en']) || type}
                </span>
              );
            })}
            {ruleLabel && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/15 text-white/50">
                {ruleLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusChip({
  status,
  t,
}: {
  status: GblWindowStatus;
  t: (key: keyof typeof ui['en']) => string;
}) {
  const config: Record<GblWindowStatus, { label: string; className: string }> = {
    live: { label: t('gbl.live'), className: 'bg-brand-accent text-brand-dark border-brand-accent' },
    upcoming: { label: t('gbl.upcoming'), className: 'text-white/50 border-white/15' },
    ended: { label: t('gbl.ended'), className: 'text-white/40 border-white/10' },
  };
  const { label, className } = config[status];
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${className}`}>
      {label}
    </span>
  );
}
