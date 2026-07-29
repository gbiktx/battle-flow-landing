export const APP_STORE_URL = 'https://apps.apple.com/us/app/battleflow/id6738843812';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.baru.software.oak';

// The three original landing CTAs shipped App Store campaign tokens with a
// `landing-` prefix that the Play referrer never carried. App Store Connect
// reports campaigns by that exact token, so renaming them would split the
// historical series. New placements pass their own token through unchanged.
const APP_STORE_CAMPAIGN_ALIASES: Record<string, string> = {
  hero: 'landing-hero',
  cta: 'landing-cta',
  footer: 'landing-footer',
};

export function getAppStoreUrl(campaign: string): string {
  const token = APP_STORE_CAMPAIGN_ALIASES[campaign] ?? campaign;
  return `${APP_STORE_URL}?ct=${encodeURIComponent(token)}`;
}

export function getPlayStoreUrl(campaign: string): string {
  const referrer = new URLSearchParams({
    utm_source: 'battleflow-landing',
    utm_medium: 'web',
    utm_campaign: campaign,
  });

  return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(referrer.toString())}`;
}
