// Read-only model of the GO Battle League season rotation, mirroring the
// official schedule on pokemongo.com. Ported from the BattleFlow app
// (lib/ui/gbl/calendar/gbl_schedule.dart) to power the marketing calendar page.
//
// The app deep-links each cup into its team builder; on the landing page the
// calendar is purely informational (a season-at-a-glance SEO/marketing view)
// with a download CTA, so the cup-resolution layer is dropped.

export type GblLeagueTier = 'little' | 'great' | 'ultra' | 'master';

export type GblWindowStatus = 'upcoming' | 'live' | 'ended';

/** Non-type rules that don't reduce to an eligible-type list. */
export type GblRule =
  | 'none'
  | 'megaEdition'
  | 'premierNoMythicalLegendary'
  | 'naicExclusion'
  | 'evolutionOnly'
  | 'retroExclusion';

/** One league or cup running within a weekly window. */
export interface GblFeature {
  /** English title; type names localize via `type.*`, cup titles stay as-is. */
  title: string;
  tier: GblLeagueTier;
  /** Cup id ('all' for open formats, else 'sunshine'/'mega'/'premier'…). */
  cupName: string;
  cpLimit: string;
  /** Inclusion type restriction (type ids). Empty for open / rule-based cups. */
  eligibleTypes: string[];
  rule: GblRule;
}

/** A weekly rotation window. `start`/`end` are ISO UTC strings. */
export interface GblScheduleEntry {
  start: string;
  end: string;
  multiStardust: boolean;
  features: GblFeature[];
}

export interface GblSeason {
  name: string;
  windows: GblScheduleEntry[];
}

export function statusAt(entry: GblScheduleEntry, now: Date): GblWindowStatus {
  const t = now.getTime();
  if (t < Date.parse(entry.start)) return 'upcoming';
  if (t < Date.parse(entry.end)) return 'live';
  return 'ended';
}

/**
 * Index of the window live at [now], or the next upcoming one, else the last.
 * Used to auto-scroll the calendar to "now".
 */
export function focusIndexAt(season: GblSeason, now: Date): number {
  for (let i = 0; i < season.windows.length; i++) {
    if (statusAt(season.windows[i], now) !== 'ended') return i;
  }
  return season.windows.length === 0 ? 0 : season.windows.length - 1;
}

// --- Forever Forward (Jun 2 – Sep 8 2026) -----------------------------------
// Validated against https://pokemongo.com/news/go-battle-league-forever-forward
// All rotations flip at 1:00 p.m. PDT = 20:00 UTC. Encoded once per season; when
// a new season starts, replace this constant (or wire it to a data source).
const SEASON_YEAR = 2026;

const pt = (month: number, day: number): string =>
  new Date(Date.UTC(SEASON_YEAR, month - 1, day, 20)).toISOString();

const feature = (f: Partial<GblFeature> & Pick<GblFeature, 'title' | 'tier' | 'cupName' | 'cpLimit'>): GblFeature => ({
  eligibleTypes: [],
  rule: 'none',
  ...f,
});

const greatLeague = feature({ title: 'Great League', tier: 'great', cupName: 'all', cpLimit: '1500' });
const ultraLeague = feature({ title: 'Ultra League', tier: 'ultra', cupName: 'all', cpLimit: '2500' });
const masterLeague = feature({ title: 'Master League', tier: 'master', cupName: 'all', cpLimit: '10000' });

const window = (
  start: string,
  end: string,
  features: GblFeature[],
  multiStardust = false,
): GblScheduleEntry => ({ start, end, features, multiStardust });

export const foreverForward: GblSeason = {
  name: 'Forever Forward',
  windows: [
    window(pt(6, 2), pt(6, 9), [
      greatLeague,
      feature({
        title: 'NAIC 2026 Cup', tier: 'great', cupName: 'naic2026', cpLimit: '1500',
        eligibleTypes: ['fairy', 'normal', 'psychic', 'water'], rule: 'naicExclusion',
      }),
    ]),
    window(pt(6, 9), pt(6, 16), [
      ultraLeague,
      feature({
        title: 'NAIC 2026 Cup', tier: 'great', cupName: 'naic2026', cpLimit: '1500',
        eligibleTypes: ['fairy', 'normal', 'psychic', 'water'], rule: 'naicExclusion',
      }),
    ]),
    window(pt(6, 16), pt(6, 23), [
      feature({
        title: 'Master League: Mega Edition', tier: 'master', cupName: 'mega',
        cpLimit: '10000', rule: 'megaEdition',
      }),
      feature({
        title: 'Sunshine Cup', tier: 'great', cupName: 'sunshine', cpLimit: '1500',
        eligibleTypes: ['normal', 'fire', 'grass', 'ground'],
      }),
    ], true),
    window(pt(6, 23), pt(6, 30), [greatLeague, ultraLeague, masterLeague], true),
    window(pt(6, 30), pt(7, 7), [
      greatLeague,
      feature({
        title: 'Summer Cup', tier: 'great', cupName: 'summer', cpLimit: '1500',
        eligibleTypes: ['normal', 'fire', 'water', 'grass', 'electric', 'bug'],
      }),
    ]),
    window(pt(7, 7), pt(7, 14), [
      ultraLeague,
      feature({
        title: 'Fantasy Cup: Ultra Edition', tier: 'ultra', cupName: 'fantasy',
        cpLimit: '2500', eligibleTypes: ['dragon', 'steel', 'fairy'],
      }),
    ]),
    window(pt(7, 14), pt(7, 21), [
      masterLeague,
      feature({
        title: 'Retro Cup', tier: 'great', cupName: 'retro', cpLimit: '1500',
        rule: 'retroExclusion',
      }),
    ], true),
    window(pt(7, 21), pt(7, 28), [greatLeague, ultraLeague, masterLeague], true),
    window(pt(7, 28), pt(8, 4), [
      greatLeague,
      feature({
        title: 'Master Premier', tier: 'master', cupName: 'premier', cpLimit: '10000',
        rule: 'premierNoMythicalLegendary',
      }),
    ], true),
    window(pt(8, 4), pt(8, 11), [
      ultraLeague,
      feature({
        title: 'Weather Cup', tier: 'great', cupName: 'weather', cpLimit: '1500',
        eligibleTypes: ['fire', 'water', 'ice', 'rock'],
      }),
    ]),
    window(pt(8, 11), pt(8, 18), [
      masterLeague,
      feature({
        title: 'Evolution Cup', tier: 'great', cupName: 'evolution', cpLimit: '1500',
        rule: 'evolutionOnly',
      }),
    ], true),
    window(pt(8, 18), pt(8, 25), [
      greatLeague,
      feature({
        title: 'Scroll Cup', tier: 'great', cupName: 'scroll', cpLimit: '1500',
        eligibleTypes: ['water', 'fighting', 'dark'],
      }),
    ]),
    window(pt(8, 25), pt(9, 1), [greatLeague, ultraLeague, masterLeague], true),
    window(pt(9, 1), pt(9, 8), [
      feature({
        title: 'Great League: Mega Edition', tier: 'great', cupName: 'all',
        cpLimit: '1500', rule: 'megaEdition',
      }),
      feature({
        title: 'Ultra League: Mega Edition', tier: 'ultra', cupName: 'all',
        cpLimit: '2500', rule: 'megaEdition',
      }),
      feature({
        title: 'Master League: Mega Edition', tier: 'master', cupName: 'all',
        cpLimit: '10000', rule: 'megaEdition',
      }),
    ], true),
  ],
};
