import { expect, test } from '@playwright/test';

import { drillLeagues, moveById } from './helpers.ts';
import { cadenceCounts, formatCadence } from '../../src/lib/move-counts.ts';

const PAGE = '/move-counts/';

/** Every (species, charged move) pair the chart should render for a league. */
const expectedRows = (leagueId: string) =>
  drillLeagues[leagueId].species.flatMap((species) => {
    const fast = moveById.get(species.moveset[0])!;
    return species.moveset.slice(1).map((chargedId) => {
      const charged = moveById.get(chargedId)!;
      return {
        speciesId: species.id,
        chargedId,
        cadence: formatCadence(cadenceCounts(charged.energy, fast.energyGain)),
      };
    });
  });

test.describe('fast move counting chart', () => {
  test('is server-rendered, so it is indexable without JavaScript', async ({ page }) => {
    await page.route('**/*.js', (route) => route.abort());
    await page.goto(PAGE);

    const rows = page.locator('[data-testid="counts-league"][data-league="great"] [data-testid="counts-row"]');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBe(expectedRows('great').length);
  });

  test('ships a table for every league, with Great League open by default', async ({ page }) => {
    await page.goto(PAGE);

    await expect(page.getByTestId('counts-league')).toHaveCount(3);

    const league = (id: string) => page.locator(`[data-testid="counts-league"][data-league="${id}"]`);
    await expect(league('great')).toHaveAttribute('open', '');
    for (const id of ['ultra', 'master']) {
      await expect(league(id)).not.toHaveAttribute('open', '');
    }
  });

  test('every rendered count matches the cadence computed from the shipped data', async ({ page }) => {
    await page.goto(PAGE);

    for (const leagueId of ['great', 'ultra', 'master']) {
      const expected = expectedRows(leagueId);
      const rendered = await page
        .locator(`[data-testid="counts-league"][data-league="${leagueId}"] [data-testid="counts-row"]`)
        .evaluateAll((rows) =>
          rows.map((row) => ({
            speciesId: row.getAttribute('data-species'),
            chargedId: row.getAttribute('data-charged'),
            cadence: row.querySelector('[data-testid="counts-cadence"]')?.textContent?.trim(),
          }))
        );

      expect(rendered, `${leagueId} row count`).toHaveLength(expected.length);
      expect(rendered).toEqual(expected);
    }
  });

  test('a count is always four positive numbers', async ({ page }) => {
    await page.goto(PAGE);
    const cadences = await page
      .locator('[data-testid="counts-cadence"]')
      .evaluateAll((els) => els.map((el) => el.textContent?.trim() ?? ''));

    expect(cadences.length).toBeGreaterThan(100);
    for (const text of cadences) {
      expect(text).toMatch(/^\d+ \| \d+ \| \d+ \| \d+$/);
      for (const n of text.split(' | ')) expect(Number(n)).toBeGreaterThan(0);
    }
  });

  test('no Shadow or size variants are listed — they duplicate their base form', async ({ page }) => {
    await page.goto(PAGE);
    const species = await page
      .getByTestId('counts-row')
      .evaluateAll((rows) => rows.map((r) => r.getAttribute('data-species') ?? ''));

    expect(species.filter((id) => /_shadow|_xs|_xl/.test(id))).toEqual([]);
  });

  test('every sprite in the chart resolves', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (res) => {
      if (res.request().resourceType() === 'image' && res.status() >= 400) failed.push(res.url());
    });

    await page.goto(PAGE);
    // Sprites are lazy — walk the open table into view to force them to load.
    await page.locator('[data-testid="counts-league"][data-league="great"] [data-testid="counts-row"]').last().scrollIntoViewIfNeeded();
    await page.waitForLoadState('networkidle');

    expect(failed).toEqual([]);
  });
});
