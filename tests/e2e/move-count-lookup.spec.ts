import { expect, test, type Page } from '@playwright/test';

import { movePools } from './helpers.ts';
import { cadenceCounts, formatCadence } from '../../src/lib/move-counts.ts';

const PAGE = '/move-counts/';

const species = (id: string) => {
  const s = movePools.species.find((x) => x.id === id);
  if (!s) throw new Error(`${id} is not in move-pools.json`);
  return s;
};

/** What the lookup should render for a species once a fast move is picked. */
const expectedRows = (id: string, fastId = species(id).fast[0]) => {
  const fast = movePools.moves[fastId];
  return species(id)
    .charged.map((chargedId) => ({
      chargedId,
      cadence: formatCadence(cadenceCounts(movePools.moves[chargedId].energy, fast.energyGain)),
    }))
    .sort((a, b) => Number(a.cadence.split(' | ')[0]) - Number(b.cadence.split(' | ')[0]));
};

const renderedRows = (page: Page) =>
  page.getByTestId('lookup-row').evaluateAll((rows) =>
    rows.map((row) => ({
      chargedId: row.getAttribute('data-charged'),
      cadence: row.querySelector('[data-testid="lookup-cadence"]')?.textContent?.trim(),
    }))
  );

async function pick(page: Page, id: string) {
  const s = species(id);
  const input = page.getByTestId('lookup-input');
  await input.fill(s.name);
  // The island is controlled — a fill that lands before hydration is discarded.
  await expect(input).toHaveValue(s.name);
  await page.locator(`[data-testid="lookup-match"][data-species="${id}"]`).click();
  await expect(page.getByTestId('lookup-result')).toHaveAttribute('data-species', id);
}

test.describe('count any Pokémon lookup', () => {
  test('renders a search box and nothing else until a species is picked', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.getByTestId('lookup-input')).toBeVisible();
    await expect(page.getByTestId('lookup-result')).toHaveCount(0);
    await expect(page.getByTestId('lookup-matches')).toHaveCount(0);
  });

  test('every count matches the cadence computed from the shipped pools', async ({ page }) => {
    await page.goto(PAGE);

    // Three species whose fast moves gain different energy per use, so a
    // hardcoded cadence could not pass for all three.
    for (const id of ['medicham', 'altaria', 'lickilicky']) {
      await pick(page, id);
      expect(await renderedRows(page), id).toEqual(expectedRows(id));
      await page.getByTestId('lookup-clear').click();
    }
  });

  test('reaches Pokémon the meta chart does not list', async ({ page }) => {
    await page.goto(PAGE);
    // Not in any of the three drill decks — the whole point of the lookup.
    await pick(page, 'bulbasaur');
    expect((await renderedRows(page)).length).toBeGreaterThan(0);
    await expect(page.locator('[data-testid="counts-row"][data-species="bulbasaur"]')).toHaveCount(0);
  });

  test('switching the fast move recomputes every count', async ({ page }) => {
    await page.goto(PAGE);
    // Medicham: Counter gains 6 per use, Psycho Cut gains 4 — different counts.
    await pick(page, 'medicham');
    expect(await renderedRows(page)).toEqual(expectedRows('medicham', 'COUNTER'));

    await page.locator('[data-testid="lookup-fast"][data-move="PSYCHO_CUT"]').click();
    await expect(page.locator('[data-testid="lookup-fast"][data-move="PSYCHO_CUT"]')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(await renderedRows(page)).toEqual(expectedRows('medicham', 'PSYCHO_CUT'));
  });

  test('a name that matches nothing says so instead of showing a stale result', async ({ page }) => {
    await page.goto(PAGE);
    await page.getByTestId('lookup-input').fill('zzzznotapokemon');

    await expect(page.getByTestId('lookup-empty')).toBeVisible();
    await expect(page.getByTestId('lookup-match')).toHaveCount(0);
    await expect(page.getByTestId('lookup-result')).toHaveCount(0);
  });

  test('clear removes the result and empties the box', async ({ page }) => {
    await page.goto(PAGE);
    await pick(page, 'azumarill');

    await page.getByTestId('lookup-clear').click();

    await expect(page.getByTestId('lookup-result')).toHaveCount(0);
    await expect(page.getByTestId('lookup-input')).toHaveValue('');
  });

  test('searching by the localized name works, not just the English one', async ({ page }) => {
    // The shipped pool data only carries English names; localized names come
    // from the translation slice the island is handed.
    await page.goto('/ja/move-counts/');
    const input = page.getByTestId('lookup-input');

    await input.fill('カビゴン'); // Snorlax
    await expect(page.locator('[data-testid="lookup-match"][data-species="snorlax"]')).toBeVisible();

    await input.fill('Snorlax');
    await expect(page.locator('[data-testid="lookup-match"][data-species="snorlax"]')).toBeVisible();
  });
});
