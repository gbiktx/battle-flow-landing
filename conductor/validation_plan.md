# Validation Plan: i18n & Broken Link Check

## Objective
To programmatically validate that the BattleFlow Astro site has correctly translated content for all 10 supported languages (`en`, `es`, `fr`, `de`, `it`, `pt`, `zh-Hans`, `zh-Hant`, `ja`, `ko`), and to ensure that no 404 errors exist during the build or runtime process.

## Scope & Impact
- **Target:** All generated HTML files in the `dist/` directory after a production build.
- **Coverage:** 
  - Homepage routes (10)
  - Legal pages: `/privacy` and `/tac` routes (20)
  - Blog Index routes (10)
  - Individual Blog Post routes (40)
  - Total Pages to validate: ~80 pages.
- **Impact:** Ensures 100% data integrity and a seamless user experience globally.

## Implementation Steps

### Phase 1: Static Build Validation
1. Run `npm run build` to generate the static site.
2. The Astro build process acts as the first line of defense. If any dynamic routes fail to resolve or if any internal links within components are broken, the build will throw a warning or fail.
3. Verify the final build output logs to ensure all expected `[lang]` permutations were generated without errors.

### Phase 2: Programmatic Link Checker Script
We will write a Node.js script (`validate_links.cjs`) that spins up a local server (`npm run preview` equivalent) and crawls the generated static site.

**Script Logic:**
1. Start a local server pointing to the `dist/` directory.
2. Initialize an array of seed URLs starting from the root `http://localhost:port/` and all 9 localized root paths (e.g., `/es/`, `/fr/`).
3. **Crawl & Assert:**
   - Fetch each page.
   - Assert HTTP Status is `200 OK` (Catch 404s).
   - Parse the HTML content using a library like `cheerio` or regex.
   - **Translation Check:** Extract specific text nodes (like the Hero title or Footer disclaimer) and verify they match the expected translated string from `src/i18n/ui.ts`.
   - **Content Check:** Verify that blog posts do not contain the `... (full content from read)` string.
4. Extract all internal `<a href="...">` links from the HTML and add them to a queue.
5. Recursively visit the queue until all unique internal links have been checked.

### Phase 3: Asset Validation
1. While crawling, the script will also collect all `<img src="...">` and `<video src="...">` paths.
2. It will verify that these paths exist on the local file system within the `dist/` directory to ensure no missing images or videos cause 404s (e.g., verifying `baru.png` vs `large-logo.png`).

## Verification & Output
- The script will output a final report detailing:
  - Total pages crawled.
  - Number of 404s found (Target: 0).
  - Number of untranslated pages detected (Target: 0).
  - Number of missing assets detected (Target: 0).