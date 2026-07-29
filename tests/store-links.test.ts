import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getAppStoreUrl, getPlayStoreUrl } from '../src/lib/store-links.ts';

// The three original landing CTAs were live before store URLs were centralized.
// App Store Connect and Play Console report on these exact tokens, so the URLs
// are asserted literally: any change to the alias map, a placement rename, or
// the referrer encoding splits a campaign that has months of history behind it.
const LEGACY_URLS = {
  hero: {
    appStore: 'https://apps.apple.com/us/app/battleflow/id6738843812?ct=landing-hero',
    playStore:
      'https://play.google.com/store/apps/details?id=com.baru.software.oak&referrer=utm_source%3Dbattleflow-landing%26utm_medium%3Dweb%26utm_campaign%3Dhero',
  },
  cta: {
    appStore: 'https://apps.apple.com/us/app/battleflow/id6738843812?ct=landing-cta',
    playStore:
      'https://play.google.com/store/apps/details?id=com.baru.software.oak&referrer=utm_source%3Dbattleflow-landing%26utm_medium%3Dweb%26utm_campaign%3Dcta',
  },
  footer: {
    appStore: 'https://apps.apple.com/us/app/battleflow/id6738843812?ct=landing-footer',
    playStore:
      'https://play.google.com/store/apps/details?id=com.baru.software.oak&referrer=utm_source%3Dbattleflow-landing%26utm_medium%3Dweb%26utm_campaign%3Dfooter',
  },
};

test('legacy placements keep their exact pre-existing store URLs', () => {
  for (const [placement, expected] of Object.entries(LEGACY_URLS)) {
    assert.equal(getAppStoreUrl(placement), expected.appStore, `${placement} App Store URL changed`);
    assert.equal(getPlayStoreUrl(placement), expected.playStore, `${placement} Play Store URL changed`);
  }
});

test('new placements pass their campaign through unaliased', () => {
  const campaign = 'team-builder-hero';
  const appStore = new URL(getAppStoreUrl(campaign));
  const playStore = new URL(getPlayStoreUrl(campaign));
  const playReferrer = new URLSearchParams(playStore.searchParams.get('referrer') ?? '');

  assert.equal(appStore.searchParams.get('ct'), campaign);
  assert.equal(playReferrer.get('utm_source'), 'battleflow-landing');
  assert.equal(playReferrer.get('utm_medium'), 'web');
  assert.equal(playReferrer.get('utm_campaign'), campaign);
});

test('aliasing is idempotent, so an already-prefixed token is left alone', () => {
  assert.equal(
    getAppStoreUrl('landing-hero'),
    'https://apps.apple.com/us/app/battleflow/id6738843812?ct=landing-hero'
  );
});
