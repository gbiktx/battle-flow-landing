import type { GblLeagueTier } from './gbl-schedule';

/**
 * Badge art for a GBL format, shared by the calendar and the move-counts chart
 * so the same cup can never wear two different icons on two pages.
 *
 * Every badge is named after its cup, matching the app's own derivation in
 * `lib/utils/cup_badge_paths.dart`.
 */
const LEAGUE_LOGO: Record<GblLeagueTier, string> = {
  little: '/assets/images/leagues/little_league.png',
  great: '/assets/images/leagues/great_league.png',
  ultra: '/assets/images/leagues/ultra_league.png',
  master: '/assets/images/leagues/master_league.png',
};

// The three open Mega Editions are the one case a cup name can't name a badge:
// they all share the cup name `mega` and are told apart only by tier. Niantic
// publishes a distinct file for each — the league pennant carrying the Mega
// helix — so key off the tier.
const TIER_MEGA_BADGE: Partial<Record<GblLeagueTier, string>> = {
  great: 'great_mega',
  ultra: 'ultra_mega',
  master: 'master_mega',
};

// Cup badges shipped under public/assets/images/cups. `megacatch` is
// landing-only: the cup exists on Niantic's schedule but not in the app (no
// ranking source).
const CUPS_WITH_LOGO = new Set([
  'sunshine', 'summer', 'fantasy', 'retro', 'premier', 'scroll',
  'weather', 'evolution', 'naic2026', 'willpower', 'color', 'halloween',
  'catch', 'laic2026', 'megacolor', 'megahalloween', 'megacatch',
]);

/** Badge path for a cup, falling back to the tier's league pennant. */
export function cupBadgeSrc(cupName: string, tier: GblLeagueTier): string {
  if (cupName === 'mega') {
    const badge = TIER_MEGA_BADGE[tier];
    if (badge) return `/assets/images/cups/${badge}.png`;
  }
  if (cupName !== 'all' && CUPS_WITH_LOGO.has(cupName)) {
    return `/assets/images/cups/${cupName}.png`;
  }
  return LEAGUE_LOGO[tier];
}

/** The tier's own pennant — the safety net when a badge fails to load. */
export function leagueLogoSrc(tier: GblLeagueTier): string {
  return LEAGUE_LOGO[tier];
}
