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
  | 'retroExclusion'
  | 'laicExclusion'
  | 'seasonCatch';

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

// --- Twilight Trails (Sep 8 – Dec 1 2026) -----------------------------------
// Validated against https://pokemongo.com/news/go-battle-league-twilight-trails
// (2026-09-04). All rotations flip at 1:00 p.m. PDT = 20:00 UTC.
//
// Two verbatim quirks of Niantic's table are preserved deliberately:
//   - Nov 17 -> Nov 18 is a one-day gap. It is in the source.
//   - Nov 18-25 and Nov 24-Dec 1 OVERLAP in the source. Every other handoff is a
//     clean 7 days, so this reads as their error; the Nov 18 window is clipped to
//     Nov 24 so two limited cups are never live at once. This matches the app
//     (lib/ui/gbl/calendar/gbl_schedule.dart). Restore the published end date
//     only if Niantic corrects the post.
//
// This file is now the ONLY copy of the schedule: the app dropped its native
// calendar and embeds /embed/gbl-calendar instead. Updating a season here ships
// to every app user on the next deploy, with no app release.
const greatMega = feature({
  title: 'Great League: Mega Edition', tier: 'great', cupName: 'mega',
  cpLimit: '1500', rule: 'megaEdition',
});
const ultraMega = feature({
  title: 'Ultra League: Mega Edition', tier: 'ultra', cupName: 'mega',
  cpLimit: '2500', rule: 'megaEdition',
});
const masterMega = feature({
  title: 'Master League: Mega Edition', tier: 'master', cupName: 'mega',
  cpLimit: '10000', rule: 'megaEdition',
});
const littleCup = feature({
  title: 'Little Cup', tier: 'little', cupName: 'all', cpLimit: '500',
});
const laic2026 = feature({
  title: '2026 GO LAIC Cup', tier: 'great', cupName: 'laic2026',
  cpLimit: '1500', rule: 'laicExclusion',
});

export const twilightTrails: GblSeason = {
  name: 'Twilight Trails',
  windows: [
    window(pt(9, 8), pt(9, 15), [greatMega, ultraMega, masterMega], true),
    window(pt(9, 15), pt(9, 22), [
      greatLeague,
      ultraMega,
      feature({
        title: 'Willpower Cup', tier: 'great', cupName: 'willpower', cpLimit: '1500',
        eligibleTypes: ['fighting', 'psychic', 'dark'],
      }),
    ]),
    window(pt(9, 22), pt(9, 29), [
      ultraLeague,
      masterMega,
      feature({
        title: 'Retro Cup', tier: 'great', cupName: 'retro', cpLimit: '1500',
        rule: 'retroExclusion',
      }),
    ], true),
    window(pt(9, 29), pt(10, 6), [
      masterLeague,
      feature({
        title: 'Mega Color Cup', tier: 'great', cupName: 'color', cpLimit: '1500',
        eligibleTypes: ['grass', 'fire', 'water', 'electric'], rule: 'megaEdition',
      }),
    ], true),
    window(pt(10, 6), pt(10, 13), [greatMega, ultraMega, masterMega], true),
    window(pt(10, 13), pt(10, 20), [greatLeague, ultraMega, littleCup]),
    window(pt(10, 20), pt(10, 27), [
      ultraLeague,
      masterMega,
      feature({
        title: 'Fantasy Cup', tier: 'great', cupName: 'fantasy', cpLimit: '1500',
        eligibleTypes: ['dragon', 'steel', 'fairy'],
      }),
    ], true),
    window(pt(10, 27), pt(11, 3), [
      masterLeague,
      feature({
        title: 'Mega Halloween Cup', tier: 'great', cupName: 'halloween', cpLimit: '1500',
        eligibleTypes: ['bug', 'poison', 'ghost', 'dark', 'fairy'], rule: 'megaEdition',
      }),
    ], true),
    window(pt(11, 3), pt(11, 10), [greatMega, ultraMega, masterMega], true),
    window(pt(11, 10), pt(11, 17), [greatLeague, ultraMega, laic2026]),
    // Published as Nov 18 - Nov 25; clipped to Nov 24. See the note above.
    window(pt(11, 18), pt(11, 24), [ultraLeague, masterMega, laic2026], true),
    window(pt(11, 24), pt(12, 1), [
      masterLeague,
      feature({
        title: 'Mega Catch Cup', tier: 'great', cupName: 'catch', cpLimit: '1500',
        rule: 'seasonCatch',
      }),
    ], true),
  ],
};
