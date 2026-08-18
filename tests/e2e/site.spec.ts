import { expect, test } from '@playwright/test';

// Mirrors BASE_ROUTES in scripts/verify-routes.js. That script proves the files
// exist in dist/; this proves they render.
const ROUTES = [
  '/',
  '/privacy/',
  '/tac/',
  '/blog/',
  '/iv-calculator/',
  '/movedex/',
  '/whats-new/',
  '/gbl-calendar/',
  '/team-builder/',
  '/move-counts/',
];

const LOCALES = ['es', 'fr', 'de', 'it', 'pt', 'zh-hant', 'ja', 'ko'];

// URL path segments are lowercase; language tag *values* are BCP 47. Netlify
// 301s mixed-case paths, so a mixed-case canonical points at a redirect.
// See docs/locale-casing-fix-plan.md.
const BCP_47: Record<string, string> = { 'zh-hant': 'zh-Hant' };

test.describe('every page renders', () => {
  for (const route of ROUTES) {
    test(`${route} responds 200 with a title and one h1`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));

      const response = await page.goto(route);
      expect(response?.status(), `${route} status`).toBe(200);

      await expect(page).toHaveTitle(/.+/);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);

      expect(errors, `${route} threw`).toEqual([]);
    });
  }
});

test.describe('SEO invariants', () => {
  test('canonical and hreflang paths are always lowercase', async ({ page }) => {
    for (const route of ['/move-counts/', '/zh-hant/move-counts/', '/ja/iv-calculator/']) {
      await page.goto(route);
      const hrefs = await page
        .locator('link[rel="canonical"], link[rel="alternate"]')
        .evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));

      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs) {
        expect(new URL(href).pathname, `${route} -> ${href}`).toBe(new URL(href).pathname.toLowerCase());
      }
    }
  });

  test('/move-counts/ declares every locale alternate plus x-default', async ({ page }) => {
    await page.goto('/move-counts/');

    for (const locale of ['en', ...LOCALES]) {
      const tag = BCP_47[locale] ?? locale;
      const expected = locale === 'en' ? '/move-counts/' : `/${locale}/move-counts/`;
      await expect(page.locator(`link[hreflang="${tag}"]`)).toHaveAttribute('href', new RegExp(`${expected}$`));
    }
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', /\/move-counts\/$/);
  });

  test('/move-counts/ ships WebApplication, BreadcrumbList and FAQPage schema', async ({ page }) => {
    await page.goto('/move-counts/');
    const types = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((el) => JSON.parse(el.textContent ?? '{}')['@type']));

    expect(types).toEqual(expect.arrayContaining(['WebApplication', 'BreadcrumbList', 'FAQPage']));
  });

  test('the FAQ schema matches the questions on the page', async ({ page }) => {
    await page.goto('/move-counts/');
    const schema = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) =>
        els.map((el) => JSON.parse(el.textContent ?? '{}')).find((s) => s['@type'] === 'FAQPage')
      );

    const questions: string[] = schema.mainEntity.map((q: { name: string }) => q.name);
    expect(questions).toHaveLength(4);
    for (const q of questions) {
      await expect(page.locator('summary').filter({ hasText: q })).toHaveCount(1);
    }
  });

  test('the sitemap lists /move-counts/ for every locale', async ({ request }) => {
    const index = await (await request.get('/sitemap-index.xml')).text();
    const sitemapUrl = index.match(/<loc>([^<]*sitemap-0\.xml)<\/loc>/)?.[1];
    expect(sitemapUrl, 'sitemap-0.xml not referenced from the index').toBeTruthy();

    const xml = await (await request.get(new URL(sitemapUrl!).pathname)).text();
    expect(xml).toContain('/move-counts/');
    for (const locale of LOCALES) expect(xml).toContain(`/${locale}/move-counts/`);
  });
});

test.describe('store CTAs', () => {
  // `Store Click` is tagged from `data-placement` by the inline bootstrap in
  // Layout.astro. An untagged link reports `Placement: unknown` and silently
  // disappears from the placement breakdown, so guard it across the whole site.
  for (const route of ROUTES) {
    test(`every store link on ${route} carries a placement`, async ({ page }) => {
      await page.goto(route);
      const untagged = await page
        .locator('a[href*="apps.apple.com"], a[href*="play.google.com"]')
        .evaluateAll((els) =>
          els.filter((el) => !el.getAttribute('data-placement')).map((el) => el.outerHTML)
        );
      expect(untagged).toEqual([]);
    });
  }

  // The React store buttons were extracted out of IvCalculator.tsx into
  // StoreCtaButtons.tsx so /move-counts/ could reuse them. This is the
  // regression guard for that move.
  test('the IV calculator still renders its result CTA store buttons', async ({ page }) => {
    await page.goto('/iv-calculator/');
    const cta = page.locator('a[data-placement="iv-result-cta"]');
    await expect(cta).toHaveCount(2);
    await expect(cta.filter({ hasText: 'App Store' })).toHaveAttribute('href', /ct=iv-result-cta/);
    await expect(cta.filter({ hasText: 'Google Play' })).toHaveAttribute(
      'href',
      /utm_campaign%3Div-result-cta/
    );
  });
});

test.describe('navigation', () => {
  test('the nav links to the move counts page', async ({ page }) => {
    await page.goto('/');

    // The desktop link list is `hidden lg:flex`; below that breakpoint the same
    // links live in the hamburger overlay.
    let link = page.locator('nav a[href="/move-counts/"]').first();
    if (!(await link.isVisible())) {
      await page.locator('#mobile-menu-button').click();
      link = page.locator('#mobile-menu a[href="/move-counts/"]').first();
    }
    await expect(link).toBeVisible();

    await link.click();
    await expect(page).toHaveURL(/\/move-counts\/$/);
    await expect(page.getByTestId('drill')).toBeVisible();
  });

  test('the language switcher keeps you on the same page', async ({ page }) => {
    await page.goto('/move-counts/');
    await page.locator('nav select').selectOption('/es/move-counts/');

    await expect(page).toHaveURL(/\/es\/move-counts\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});

test.describe('localization', () => {
  for (const locale of LOCALES) {
    test(`/${locale}/move-counts/ renders in ${locale}`, async ({ page }) => {
      const response = await page.goto(`/${locale}/move-counts/`);
      expect(response?.status()).toBe(200);

      await expect(page.locator('html')).toHaveAttribute('lang', BCP_47[locale] ?? locale);
      await expect(page.getByTestId('drill')).toBeVisible();
      await expect(page.getByTestId('counts-row').first()).toBeVisible();
    });
  }

  test('localized copy is actually translated, not the English fallback', async ({ page }) => {
    await page.goto('/move-counts/');
    const english = await page.locator('h1').textContent();

    await page.goto('/es/move-counts/');
    await expect(page.locator('h1')).not.toHaveText(english ?? '');
  });
});
