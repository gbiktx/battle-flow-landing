# Locale URL Casing Fix — Plan (2026-07-16)

## Problem

GSC "Page with redirect" is at **46 URLs and growing** (25 in April → 46 since
Jun 30; see `battle_flow/SEO/battleflow.app-Coverage-Drilldown-2026-07-16`).
The dominant cluster is every `/zh-Hant/…` page, including our best-CTR page
(`/zh-Hant/iv-calculator/`, 5.3% CTR).

Root cause: **Netlify's CDN normalizes URL paths to lowercase with a 301**
(verified live: `/zh-Hant/iv-calculator/` → 301 → `/zh-hant/iv-calculator/`,
which serves 200 even though the deploy folder is `dist/zh-Hant`). Meanwhile
the site emits mixed-case `/zh-Hant/` in:

- `rel="canonical"` — so the live lowercase page declares a canonical that
  **301s back to itself** (canonical → redirect loop, the worst variant)
- every `hreflang` alternate href
- the sitemap `<loc>` entries
- the `netlify.toml` zh-Hans sunset redirect target (`/zh-Hant/:splat`,
  creating a double redirect hop)

## Why previous fixes didn't stick (do not repeat)

| Commit | Date | What it did |
|---|---|---|
| `c620b00` | Mar 17 | Lowercased locales in `astro.config.mjs` — correct direction |
| `923b3fe` | Mar 21 | **Reverted it**: "Standardize language codes to BCP 47 (zh-hant → zh-Hant)" — reintroduced the mismatch |
| `12caebd`, `7a06019` | later | Fixed adjacent symptoms (double-slash hreflang, sitemap trailing slash), not the casing |

The Mar 21 rationale conflated two things: BCP 47 casing applies to the
**language-tag attribute value** (`hreflang="zh-Hant"` — keep this), not to the
**URL path**. RFC 5646 tags are case-insensitive anyway. The host lowercases
paths and that is not configurable, so the path must be lowercase. Period.

`verify-routes.js` (added Mar 17) only checks that files exist in `dist/`, so
the Mar 21 revert sailed through — this plan adds the missing guard (step 6).

## Decision

- **URL paths: always lowercase** → `/zh-hant/…`
- **Language-tag attribute values: BCP 47** → `hreflang="zh-Hant"`,
  `<html lang="zh-Hant">`, OG `zh_TW`
- One internal locale key drives everything; a tiny map provides the BCP 47
  display form where needed.

## Architecture note (why this is navigation-safe)

Every internal URL is interpolated from the single `lang` value that
originates as a key of `languages` in `src/i18n/ui.ts`:

- `Nav.astro` / `Footer.astro` links: `` `/${lang}/blog/` `` etc.
- Language switcher: `Object.entries(languages)` → href from the key
- `[lang]` route params: `getStaticPaths` returns `Object.keys(languages)`
- Canonical: `Astro.url.pathname` (inherits route casing)
- hreflang hrefs: rebuilt from path segments + locale key

There are **no hardcoded `/zh-Hant/` hrefs anywhere in `src/`** (verified by
grep — the only `zh-Hant` occurrences are dictionary keys in `ui.ts`,
`data.ts`, `utils.ts`, `Layout.astro`). Renaming the key renames every link,
route, and tag atomically. `getLangFromUrl` already matches case-insensitively,
so nothing 404s in dev either.

## Changes

### 1. `src/i18n/ui.ts` — the source key (2 occurrences)
- `languages` map: `'zh-Hant': '繁體中文'` → `'zh-hant': '繁體中文'`
- `ui` dictionary: `'zh-Hant': { … }` → `'zh-hant': { … }` (~line 1306)

### 2. `src/i18n/data.ts` — content dictionaries (3 occurrences)
Rename `'zh-Hant'` keys (privacy ~595, tac ~951, whatsNewData ~1419).
⚠️ **This is the silent-breakage trap**: `t()` falls back to English when a
key is missing, so a missed rename here ships an English privacy/ToS page to
zh users with no build error. Verification step 3 covers it.

### 3. `astro.config.mjs`
- `LOCALES`: `'zh-Hant'` → `'zh-hant'` (drives i18n config + the
  `whats-new` sitemap filter regex)
- sitemap `i18n.locales`: `'zh-Hant': 'zh-Hant'` → `'zh-hant': 'zh-Hant'`
  (key = route segment, value = hreflang code — this is where path casing and
  BCP 47 casing are allowed to differ)

### 4. `src/layouts/Layout.astro`
- `ogLocaleMap` key: `'zh-Hant': 'zh_TW'` → `'zh-hant': 'zh_TW'`
- Add a BCP 47 display map and use it for the attribute values only:
  ```ts
  const bcp47: Record<string, string> = { 'zh-hant': 'zh-Hant' };
  const langTag = bcp47[lang] ?? lang;
  ```
  - `<html lang={langTag}>`
  - hreflang loop: `hreflang={bcp47[l] ?? l}` (href keeps the lowercase key)
  - WebSite schema `inLanguage: langTag`
- The inline Mixpanel script already uses lowercase `'zh-hant'` — no change.

### 5. `netlify.toml`
- Both zh-Hans sunset redirects: `to = "/zh-Hant/:splat"` → `"/zh-hant/:splat"`
  (kills the double hop)
- ⚠️ **Do NOT add the "belt-and-suspenders" `/zh-Hant/* -> /zh-hant/:splat`
  rule the original plan called for.** Netlify lowercases the request path
  before matching, so that rule's `from` normalizes to `/zh-hant/*` — the same
  as its `to`. With `force = true` it would bypass the real file and 301 every
  zh page to itself: an infinite loop taking out the whole zh cluster,
  including `/zh-hant/iv-calculator/`. It is unnecessary anyway — the native
  301 is verified live. The `/zh-Hans/*` rules are safe only because their
  target differs from their source.

### 6. `scripts/verify-routes.js` — the regression guard (the actual "fix #5 is final" part)
- `LANGUAGES`: `'zh-Hant'` → `'zh-hant'`
- Add checks that **fail the build** when:
  1. any directory name in `dist/` contains an uppercase character;
  2. any `rel="canonical"` or `rel="alternate" hreflang` **href** in any
     `dist/**/index.html` contains an uppercase character in its path;
  3. any `<loc>` in `dist/sitemap-*.xml` contains an uppercase path.
- Error message must explain *why* (Netlify lowercases paths → canonical
  points at a redirect) and link this doc, so the next "BCP 47 cleanup"
  attempt gets stopped with context instead of a mystery failure.

### 6b. Locale-keyed data files — found during implementation, NOT in the original plan
The plan's "silent-breakage trap" (§2) is broader than `data.ts`. Two more places
key off the locale and fall back silently:

- `src/data/translations.json` — top-level key `'zh-Hant'`.
  `getMoveTranslations`/`getPokemonTranslations` (`src/lib/translation-slices.ts`)
  do an **exact-match** lookup with `?? moveSlices.en`, so a missed rename here
  ships **English Pokémon/move names** on the zh MoveDex and IV Calculator — no
  build error. Rename the key (keep the file minified; `writeJson` emits
  `JSON.stringify` with no trailing newline).
- `scripts/sync-translations.js` `LANG_MAP` and `scripts/validate-data.js`
  `LOCALE_EXPECTS_POKEMON` — same key. In `LANG_MAP` only the **key** is
  lowercased; the value stays `zh-Hant` because it's the Flutter source
  *filename* suffix (`moves_zh-Hant.json`) — same key/value split as the sitemap.

### 6c. `public/assets/images/features/zh-Hant/` — also not in the original plan
`MainFeatures.astro` and `IvCalculator.tsx` build image URLs by interpolating the
same locale key (`/assets/images/features/${lang}`). Renaming the key without
moving this directory would point zh images at a path that only resolves via the
CDN's case-insensitive lookup — and *before* this fix it meant every zh image URL
took a 301 hop. Rename it with the same two-step move as §7.

### 7. `src/content/blog/zh-Hant/` directory — optional, recommended
`[slug].astro` matches the content-dir language case-insensitively (line 22),
so this rename is **not required** for correctness — but do it for
consistency. ⚠️ APFS is case-insensitive: a direct rename is a no-op to git.
Use the two-step move:
```bash
git mv src/content/blog/zh-Hant src/content/blog/zh-hant-tmp
git mv src/content/blog/zh-hant-tmp src/content/blog/zh-hant
```

## What does NOT change

- `hreflang` attribute values stay `zh-Hant` (BCP 47)
- Translation content, language switcher labels, OG locales
- All other locales (already lowercase, single-segment)
- Old external links / bookmarks to `/zh-Hant/…` keep working via 301

## Verification (before deploy)

1. `pnpm build` — must pass with the new verify-routes guard active.
2. `grep -rn "zh-Hant" dist/ | grep -v 'hreflang="zh-Hant"' | grep -v og:` —
   expect **zero** hits in any href/`<loc>`/path.
3. Content-fallback check (the data.ts trap): built
   `dist/zh-hant/privacy/index.html` and `tac` must contain Chinese text
   (e.g. `本隱私政策`), not the English fallback.
   Same check for the §6b trap — `dist/zh-hant/movedex/index.html` must contain
   `溶解液` (Acid) and `dist/zh-hant/iv-calculator/index.html` must contain
   `瑪力露麗` (Azumarill), not the English names.
4. `pnpm preview` navigation matrix:
   - From `/`, switch language to 繁體中文 → lands on `/zh-hant/`
   - Nav links: blog, GBL calendar, MoveDex, IV calculator — all render zh, no 404
   - Footer links: privacy, tac, whats-new
   - Open a zh blog post from `/zh-hant/blog/` index
   - Switch from `/zh-hant/iv-calculator/` back to EN and to another locale
5. Post-deploy curls:
   - `curl -sI https://battleflow.app/zh-hant/iv-calculator/` → **200**, and its
     canonical == the URL itself
   - `curl -sI https://battleflow.app/zh-Hant/` → single 301 → `/zh-hant/`
   - `curl -sI https://battleflow.app/zh-Hans/blog/` → single 301 → `/zh-hant/blog/`

## GSC follow-up (after deploy)

1. Resubmit `sitemap-index.xml` in Search Console.
2. URL-inspect `/zh-hant/iv-calculator/` + `/zh-hant/` → request indexing.
3. On the "Page with redirect" issue → **Validate Fix** (validation takes days
   to weeks; the count should drop from 46 toward the ~15 benign entries:
   http/www scheme variants and old no-trailing-slash blog links).
4. Unrelated items also in the coverage report, tracked separately:
   `whats-new` noindex-vs-sitemap inconsistency, `gbl-calendar` never crawled,
   8 translated blog posts "Crawled – currently not indexed".

## Rollback

Single commit; `git revert` restores the previous state. No data migrations,
no redirects that would need unwinding (the added `/zh-Hant/*` rule matches
Netlify's native behavior).
