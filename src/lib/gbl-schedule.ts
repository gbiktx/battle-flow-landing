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
  /**
   * Cup id ('all' for open formats, else 'sunshine'/'mega'/'premier'…). Must
   * match the app's `CupInfo.name` — `{cpLimit}-{cupName}` is what the embed
   * deep-links, and it is also what resolves the badge file.
   */
  cupName: string;
  /**
   * i18n slug for the display name (`gbl.name_<nameKey>`); defaults to
   * [cupName]. The Mega editions are separate app cups (`megacolor`,
   * `megahalloween`) but read as the plain cup plus the Mega Edition pill, the
   * same way `mega` at 1500 reads as "Great League · Mega Edition" — so they
   * point back at the base cup's name rather than needing a duplicate string.
   */
  nameKey: string;
  cpLimit: string;
  /** Inclusion type restriction (type ids). Empty for open / rule-based cups. */
  eligibleTypes: string[];
  rule: GblRule;
  /**
   * Mega-Evolved Pokémon are eligible. Orthogonal to [rule] on purpose: the
   * Mega Catch Cup is both a Mega Edition *and* a season-catch cup, and the
   * Mega Color/Halloween Cups are Mega Editions *and* type-restricted. Folding
   * "mega" into the single-valued [rule] forced a choice between the two and
   * cost the Catch Cup its Mega pill.
   */
  mega: boolean;
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

/**
 * Master League has no CP cap. Niantic publishes it as "unlimited" rather than
 * a number; the app still keys its cup ids off `10000`, so the cap stays 10000
 * in the data and only the *label* becomes a word. Callers render
 * `gbl.cp_unlimited` instead of "CP 10000" when this returns true.
 */
export const isUncappedCp = (cpLimit: string): boolean => cpLimit === '10000';

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

/**
 * 1:00 p.m. Pacific, as UTC.
 *
 * ⚠️ Not a constant offset. US daylight saving ends **November 1, 2026**, so a
 * rotation flipping at 1:00 p.m. PDT (20:00 UTC) in September/October flips at
 * 1:00 p.m. PST (21:00 UTC) from November on. The official post's
 * `data-start-date` attributes carry both: `2026-10-27T20:00:00Z` and
 * `2026-11-03T21:00:00Z`. Hard-coding 20:00 shifted every November window an
 * hour early.
 */
const pt = (month: number, day: number): string => {
  const isPst = month === 12 || (month === 11 && day >= 1);
  return new Date(Date.UTC(SEASON_YEAR, month - 1, day, isPst ? 21 : 20)).toISOString();
};

const feature = (
  f: Partial<GblFeature> & Pick<GblFeature, 'title' | 'tier' | 'cupName' | 'cpLimit'>,
): GblFeature => ({
  eligibleTypes: [],
  rule: 'none',
  mega: false,
  nameKey: f.cupName,
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
// (2026-09-05) — not by reading the rendered table but by parsing the
// `data-slot="GblScheduleBlockItem"` elements, which carry exact UTC
// `data-start-date` / `data-end-date` values and one badge image per feature.
// All 12 windows, their features and their flip times match this file.
//
// One verbatim quirk of Niantic's data is preserved deliberately:
//   - Nov 18 and Nov 24 OVERLAP in the source (Nov 18 is published as running to
//     Nov 25). Every other handoff is a clean 7 days, so this reads as their
//     error; the Nov 18 window is clipped to Nov 24 so two limited cups are never
//     live at once. Restore the published end date only if Niantic corrects it.
//
// The Nov 18 window's own start is `2026-11-18T00:34:00Z` in the source — not
// the 21:00 UTC every other November window uses. That is a CMS artifact, but it
// is what the game will honour, so it is kept as published rather than
// normalized to 1 p.m. PT.
//
// This file is now the ONLY copy of the schedule: the app dropped its native
// calendar and embeds /embed/gbl-calendar instead. Updating a season here ships
// to every app user on the next deploy, with no app release.
const greatMega = feature({
  title: 'Great League: Mega Edition', tier: 'great', cupName: 'mega',
  cpLimit: '1500', mega: true,
});
const ultraMega = feature({
  title: 'Ultra League: Mega Edition', tier: 'ultra', cupName: 'mega',
  cpLimit: '2500', mega: true,
});
const masterMega = feature({
  title: 'Master League: Mega Edition', tier: 'master', cupName: 'mega',
  cpLimit: '10000', mega: true,
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
        title: 'Mega Color Cup', tier: 'great', cupName: 'megacolor', nameKey: 'color',
        cpLimit: '1500', eligibleTypes: ['grass', 'fire', 'water', 'electric'], mega: true,
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
        title: 'Mega Halloween Cup', tier: 'great', cupName: 'megahalloween', nameKey: 'halloween',
        cpLimit: '1500', eligibleTypes: ['bug', 'poison', 'ghost', 'dark', 'fairy'], mega: true,
      }),
    ], true),
    window(pt(11, 3), pt(11, 10), [greatMega, ultraMega, masterMega], true),
    window(pt(11, 10), pt(11, 17), [greatLeague, ultraMega, laic2026]),
    // Published as Nov 18 00:34 UTC -> Nov 25; clipped to Nov 24. See the note above.
    window('2026-11-18T00:34:00.000Z', pt(11, 24), [ultraLeague, masterMega, laic2026], true),
    window(pt(11, 24), pt(12, 1), [
      masterLeague,
      // BattleFlow does not offer a Mega Catch cup: its pool is whatever the
      // player caught this season, so no ranking source can exist for it. The
      // row still appears — Niantic is running it — but `megacatch` matches no
      // `CupInfo`, so the embed's deep link resolves to nothing and the app
      // stays put (see `_openCup`, which names this case). Battles from that
      // week get logged under Great League or Mega Great League instead.
      feature({
        title: 'Mega Catch Cup', tier: 'great', cupName: 'megacatch', nameKey: 'catch',
        cpLimit: '1500', rule: 'seasonCatch', mega: true,
      }),
    ], true),
  ],
};
