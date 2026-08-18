import { expect, test, type Page } from '@playwright/test';

import {
  SESSION_LENGTH,
  correctAnswer,
  initialDeck,
  recordAnalytics,
  wrongIndex,
} from './helpers.ts';

const PAGE = '/move-counts/';

const drill = (page: Page) => page.getByTestId('drill');
const options = (page: Page) => page.getByTestId('drill-option');

/**
 * Answers the current card and advances. `pick` receives the index of the
 * correct option (read from the rendered `data-correct` flags) and returns the
 * index to click, so a test can play a perfect run or a perfectly wrong one
 * without recomputing the deck after a reseed.
 */
async function answerCard(page: Page, pick: (correctIndex: number) => number) {
  const flags = await options(page).evaluateAll((els) =>
    els.map((el) => el.getAttribute('data-correct') === 'true')
  );
  const answerIndex = flags.indexOf(true);
  expect(answerIndex, 'rendered card has no correct option').toBeGreaterThanOrEqual(0);

  await options(page).nth(pick(answerIndex)).click();
  await expect(page.getByTestId('drill-feedback')).toBeVisible();
  await page.getByTestId('drill-next').click();
}

const playAll = async (page: Page, pick: (correctIndex: number) => number) => {
  for (let i = 0; i < SESSION_LENGTH; i++) await answerCard(page, pick);
};

test.describe('move counts drill', () => {
  test('renders the deterministic first card from the shipped deck', async ({ page }) => {
    await page.goto(PAGE);
    const deck = initialDeck();
    const first = deck[0];

    await expect(drill(page)).toBeVisible();
    await expect(page.getByTestId('drill-progress')).toHaveText(`1 / ${SESSION_LENGTH}`);
    await expect(options(page)).toHaveCount(first.choices.length);

    if (first.kind === 'count') {
      await expect(page.getByTestId('drill-fast')).toContainText(first.fast.name);
      await expect(page.getByTestId('drill-charged')).toContainText(first.charged.name);
      await expect(options(page).nth(first.answerIndex)).toHaveText(correctAnswer(first)!);
    } else {
      await expect(page.getByTestId('drill-species')).toBeVisible();
    }
  });

  test('the drill renders in the prerendered HTML, before hydration', async ({ page }) => {
    // The island is `client:load`; if the first card only appeared after
    // hydration, a slow connection would show an empty box.
    await page.route('**/*.js', (route) => route.abort());
    await page.goto(PAGE);
    await expect(drill(page)).toBeVisible();
    await expect(options(page).first()).toBeVisible();
  });

  test('a correct answer is marked correct and reveals the full cadence', async ({ page }) => {
    await page.goto(PAGE);
    const first = initialDeck()[0];

    await options(page).nth(first.answerIndex).click();

    await expect(page.getByTestId('drill-feedback')).toHaveAttribute('data-result', 'correct');
    if (first.kind === 'count') {
      await expect(page.getByTestId('drill-cadence')).toHaveText(first.cadence.join(' | '));
    }
  });

  test('a wrong answer is marked wrong and still reveals the answer', async ({ page }) => {
    await page.goto(PAGE);
    const first = initialDeck()[0];

    await options(page).nth(wrongIndex(first)).click();

    await expect(page.getByTestId('drill-feedback')).toHaveAttribute('data-result', 'wrong');
    await expect(options(page).nth(first.answerIndex)).toBeVisible();
  });

  test('answering twice on the same card does nothing', async ({ page }) => {
    await page.goto(PAGE);
    const first = initialDeck()[0];

    await options(page).nth(first.answerIndex).click();
    await expect(options(page).first()).toBeDisabled();
    await expect(page.getByTestId('drill-progress')).toHaveText(`1 / ${SESSION_LENGTH}`);
  });

  test('a perfect run scores 10/10 and reports nothing missed', async ({ page }) => {
    await page.goto(PAGE);
    await playAll(page, (correct) => correct);

    const score = page.getByTestId('drill-score');
    await expect(score).toHaveAttribute('data-score', String(SESSION_LENGTH));
    await expect(score).toHaveAttribute('data-total', String(SESSION_LENGTH));
    await expect(page.getByTestId('drill-missed')).toHaveCount(0);
  });

  test('every wrong answer comes back in the review list', async ({ page }) => {
    await page.goto(PAGE);
    await playAll(page, (correct) => (correct === 0 ? 1 : 0));

    await expect(page.getByTestId('drill-score')).toHaveAttribute('data-score', '0');
    await expect(page.getByTestId('drill-missed')).toHaveCount(SESSION_LENGTH);

    // Each missed card names the species it was about.
    const keys = await page
      .getByTestId('drill-missed')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-card')));
    expect(new Set(keys).size).toBe(SESSION_LENGTH);
  });

  test('play again starts a fresh session', async ({ page }) => {
    await page.goto(PAGE);
    await playAll(page, (correct) => correct);
    await expect(page.getByTestId('drill-results')).toBeVisible();

    await page.getByTestId('drill-play-again').click();

    await expect(page.getByTestId('drill-results')).toHaveCount(0);
    await expect(page.getByTestId('drill-progress')).toHaveText(`1 / ${SESSION_LENGTH}`);
  });

  test('switching league restarts the session', async ({ page }) => {
    await page.goto(PAGE);
    const firstSpecies = await page.getByTestId('drill-species').textContent();

    await options(page).first().click();
    await page.getByTestId('drill-next').click();
    await expect(page.getByTestId('drill-progress')).toHaveText(`2 / ${SESSION_LENGTH}`);

    const master = page.locator('[data-testid="drill-league"][data-league="master"]');
    await master.click();

    await expect(page.getByTestId('drill-progress')).toHaveText(`1 / ${SESSION_LENGTH}`);
    await expect(master).toHaveAttribute('aria-pressed', 'true');
    // Master League is a different roster, so the card should change.
    await expect(page.getByTestId('drill-species')).not.toHaveText(firstSpecies ?? '');
  });

  test('the counts mode only asks count questions', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('[data-testid="drill-mode"][data-mode="count"]').click();

    for (let i = 0; i < 3; i++) {
      // Count cards always show a fast -> charged pair; moveset cards never do.
      await expect(page.getByTestId('drill-fast')).toBeVisible();
      await expect(options(page).first()).toHaveText(/^\d+$/);
      await options(page).first().click();
      await page.getByTestId('drill-next').click();
    }
  });
});

test.describe('move counts analytics', () => {
  test('tracks Drill Start once, then Drill Complete with the score', async ({ page }) => {
    const events = await recordAnalytics(page);
    await page.goto(PAGE);

    await playAll(page, (correct) => correct);
    await expect(page.getByTestId('drill-results')).toBeVisible();

    const starts = await events.named('Drill Start');
    expect(starts).toHaveLength(1);
    expect(starts[0].props).toMatchObject({ League: 'great', Mode: 'mixed' });

    const completes = await events.named('Drill Complete');
    expect(completes).toHaveLength(1);
    expect(completes[0].props).toMatchObject({
      League: 'great',
      Mode: 'mixed',
      Score: SESSION_LENGTH,
      Total: SESSION_LENGTH,
    });
  });

  test('does not track a start before the first answer', async ({ page }) => {
    const events = await recordAnalytics(page);
    await page.goto(PAGE);
    await expect(drill(page)).toBeVisible();

    expect(await events.named('Drill Start')).toHaveLength(0);
  });

  test('a replay reports its own score, not the previous session against the new deck', async ({ page }) => {
    const events = await recordAnalytics(page);
    await page.goto(PAGE);

    await playAll(page, (correct) => correct);
    await expect(page.getByTestId('drill-results')).toBeVisible();
    expect(await events.named('Drill Complete')).toHaveLength(1);

    // Replaying used to fire a second Drill Complete immediately, scoring the
    // finished session's answers against the freshly seeded deck, and latch the
    // "already reported" flag so the real result never arrived.
    await page.getByTestId('drill-play-again').click();
    await expect(page.getByTestId('drill-progress')).toHaveText(`1 / ${SESSION_LENGTH}`);
    expect(await events.named('Drill Complete')).toHaveLength(1);

    await playAll(page, (correct) => (correct === 0 ? 1 : 0));
    const completes = await events.named('Drill Complete');
    expect(completes).toHaveLength(2);
    expect(completes[1].props).toMatchObject({ Score: 0, Total: SESSION_LENGTH });
  });

  test('switching league does not report a score for a session nobody played', async ({ page }) => {
    const events = await recordAnalytics(page);
    await page.goto(PAGE);
    await playAll(page, (correct) => correct);

    await page.locator('[data-testid="drill-league"][data-league="master"]').click();
    await expect(page.getByTestId('drill-progress')).toHaveText(`1 / ${SESSION_LENGTH}`);

    expect(await events.named('Drill Complete')).toHaveLength(1);
  });

  test('tracks a CTA Shown impression when the result CTA is reached', async ({ page }) => {
    const events = await recordAnalytics(page);
    await page.goto(PAGE);
    await playAll(page, (correct) => correct);

    await page.getByTestId('drill-results').scrollIntoViewIfNeeded();
    await expect
      .poll(async () => (await events.named('CTA Shown')).length, { timeout: 5000 })
      .toBeGreaterThan(0);

    const shown = await events.named('CTA Shown');
    expect(shown.some((e) => e.props.Placement === 'move-counts-result')).toBe(true);
  });
});

test.describe('move counts store CTAs', () => {
  // The `Store Click` event is fired by Layout.astro's inline bootstrap, which
  // only initializes when PUBLIC_MIXPANEL_TOKEN is set (it is not in a local
  // build). What that listener reads is asserted here instead: every store link
  // must carry `data-placement`, or the click reports `Placement: unknown`.
  test('hero store buttons are tagged with the hero placement', async ({ page }) => {
    await page.goto(PAGE);
    const hero = page.locator('a[data-placement="move-counts-hero"]');
    await expect(hero).toHaveCount(2);
    await expect(hero.filter({ hasText: 'App Store' })).toHaveAttribute(
      'href',
      /apps\.apple\.com.*ct=move-counts-hero/
    );
    await expect(hero.filter({ hasText: 'Google Play' })).toHaveAttribute(
      'href',
      /play\.google\.com.*utm_campaign%3Dmove-counts-hero/
    );
  });

  test('result store buttons are tagged with the result placement', async ({ page }) => {
    await page.goto(PAGE);
    await playAll(page, (correct) => correct);

    const cta = page.locator('a[data-placement="move-counts-result"]');
    await expect(cta).toHaveCount(2);
    for (const link of await cta.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener');
    }
  });
});
