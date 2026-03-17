# Route Testing & 404 Fix Plan

## Objective
Fix the current 404 issues with specific locales (like `zh-hant`) and implement a reliable method to test that all expected pages exist for all supported languages.

## Background & Root Cause
The `http://localhost:4321/zh-hant/` 404 issue happens due to a case mismatch between Astro's configuration and your internal i18n data:
- In `astro.config.mjs`, the locales are defined as `zh-Hans` and `zh-Hant` (Capital H).
- In `src/i18n/ui.ts`, the keys are `zh-hans` and `zh-hant` (lowercase). 
Astro's dev server strictly checks the URL against the `locales` defined in `astro.config.mjs`, while your dynamic routes `[lang]` use the lowercase versions from `ui.ts`.

## Implementation Steps

### 1. Fix the Locale Case Mismatch
Update `astro.config.mjs` so the `locales` array exactly matches the keys exported in `src/i18n/ui.ts`.
- Change `'zh-Hans'` to `'zh-hans'`
- Change `'zh-Hant'` to `'zh-hant'`

### 2. Create a Build Verification Script
Since Astro is building a static site (`dist/`), the fastest and most robust way to test routes is to verify the generated HTML files in the output directory.

We will create a Node.js script (e.g., `scripts/verify-routes.js`) that will:
1. Read the supported locales from `src/i18n/ui.ts`.
2. Iterate through all base routes (`/`, `/privacy`, `/tac`, `/blog`).
3. Fetch all blog post slugs from `src/content/blog/en/`.
4. Construct the expected file paths for every combination of locale + route in the `dist/` folder.
5. Check if the `index.html` file exists using `fs.existsSync`.
6. Error out and list any missing pages if a combination is not found.

### 3. Add npm Scripts
Update `package.json` to include the script:
- `"test:routes": "node scripts/verify-routes.js"`
- `"build": "astro build && npm run test:routes"`

This ensures that every time you build the project (and in your CI/CD pipeline), the build will fail if any page is missing a translation or failed to generate.

## Verification
- Run `npm run dev` and visit `http://localhost:4321/zh-hant/` to verify it no longer 404s.
- Run `npm run build` and ensure the `verify-routes.js` script successfully asserts all ~80 pages exist.