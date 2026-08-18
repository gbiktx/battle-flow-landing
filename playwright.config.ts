import { defineConfig, devices } from '@playwright/test';

// E2E specs live in tests/e2e/*.spec.ts. The unit suite (`pnpm test`) globs
// tests/**/*.test.ts, so the two runners never pick up each other's files.
//
// Tests run against the *built* site via `astro preview`, not the dev server:
// the drill is an Astro island, and only a production build exercises the real
// hydration path and the static HTML search engines actually see. The build is
// part of the webServer command — `astro preview` serves whatever is already in
// dist/, so without it a green run can be validating stale HTML.
const PORT = 4321;

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `pnpm build && pnpm exec astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
