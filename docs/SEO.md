# SEO & Search Console reference

Operational reference for the landing site's search performance. Numbers go
stale — this doc holds the **durable** stuff: how to pull live data, known
gotchas, and the current backlog. For actual metrics, run the script.

## Querying Google Search Console (live)

No MCP needed — a service-account API user is enough.

- **Property**: domain property `sc-domain:battleflow.app`
- **Service account**: `battleflowgsc@battleflow-52498-500913.iam.gserviceaccount.com`
  (added as a restricted/read user on the GSC property)
- **Key**: a service-account JSON key. Pass its path via the `GSC_KEY` env var.
  **Never commit the key.**
- **Script**: [`scripts/gsc_query.py`](../scripts/gsc_query.py). Needs a venv with
  `google-auth` + `requests`. Paginates to 25k rows.

```bash
GSC_KEY=/path/to/key.json python3 scripts/gsc_query.py \
  --days 90 --dims query,page,country --out out.csv
# per-page drill-down:
GSC_KEY=... python3 scripts/gsc_query.py --days 28 --dims query --page-filter /ja/iv-calculator/
```

Dimensions: `query,page,country,device,date`. Data lags ~2–3 days, goes back ~16 months.
The manual GSC CSV export caps at 1k rows and can't combine dimensions — the API can
(query×page×country is the useful cut).

URL Inspection API (coverage/indexing status per URL) uses the same auth, endpoint
`POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`
with `{inspectionUrl, siteUrl: "sc-domain:battleflow.app"}`.

## App Store Connect — iOS ASO funnel (live)

App-side install/ASO data via the App Store Connect Analytics API.

- **Key**: an ASC API key (`.p8`) with the **Admin** role (Admin is required to
  *register* analytics report types; App Manager — the RevenueCat key — cannot).
  Provide via env, never commit:
  `ASC_KEY_P8` (path), `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_APP_ID` (BattleFlow = `6738843812`).
- **Script**: [`scripts/asc_analytics.py`](../scripts/asc_analytics.py) — `--status`,
  `--list`, `--download "<report name>" --granularity DAILY --out x.csv`.
- **Setup is done**: two `analyticsReportRequests` are registered on the app —
  ONGOING (daily, forward) and ONE_TIME_SNAPSHOT (~1yr history). Apple generates the
  files ~a day after registration; `--status` shows when they're ready.
- **The ASO reports that matter**:
  - `App Store Discovery and Engagement Standard/Detailed` (APP_STORE_ENGAGEMENT) —
    impressions, product-page views, conversion, **by source (Search/Browse/Referral)**;
    Detailed adds **App Store search terms** (the store analog of GSC queries).
  - `App Downloads Standard/Detailed` (COMMERCE) — first-time downloads by territory/source.

Android note: the RevenueCat `billing@` service account reaches Android Publisher +
Play Developer Reporting (ratings/vitals), but Google Play has **no** store-listing
acquisition/conversion API — that data is Play Console UI + the GCS bulk-report bucket.

## ⚠️ Gotchas (don't reintroduce)

- **Sitemap trailing slashes.** `trailingSlash: 'always'`, so every canonical page
  ends in `/`. `@astrojs/sitemap` emits `<loc>` **without** the slash by default,
  which points Google at the non-canonical (redirected) URL of every page and leaves
  low-authority pages (the blog) unindexed. Fixed via a `serialize()` in
  [`astro.config.mjs`](../astro.config.mjs) that appends the slash. **If you touch the
  sitemap config, verify `dist/sitemap-0.xml` still has trailing-slash `<loc>` URLs.**
- **`es-419` has no sitemap `<xhtml:link>` alternates.** `@astrojs/sitemap` validates
  hreflang values against `/^[a-zA-Z-]+$/`, so a digit-bearing BCP 47 region fails the
  schema — and a failed schema kills sitemap generation *entirely* (silent: one WARN
  line, no `dist/sitemap-0.xml`). The locale is therefore left out of `i18n.locales`;
  its pages still carry the full hreflang set in `<head>`. **Any locale tag containing a digit needs
  the same treatment (letter-only tags like `zh-Hant` are fine) — and check that
  `dist/sitemap-0.xml` exists after the build.**
- **Two sitemaps in play.** `@astrojs/sitemap` generates `sitemap-index.xml`; robots.txt
  points there. Make sure GSC has the same one submitted (not a stale `sitemap.xml`),
  and don't submit page URLs (e.g. `/privacy/`) as sitemaps.

## Channel reality (orientation, not exact figures)

- Traffic is ~3/4 Google organic; negligible social/paid. This is an SEO play.
- The IV calculator pages are the keyword magnet (esp. Japanese 個体値チェッカー).
  The landing site is a minority of app installs — App Store organic dominates.
- Strategy lane: **PvPoke gaps × localization × app-unique features.** Do NOT build a
  web battle-simulator or web team-builder (clones PvPoke, which the app is built on).
  Ship what PvPoke lacks / doesn't localize.

## Open backlog

- **JA `/ja/iv-calculator/` CTR.** Ranks page-1 on huge volume but ~0.2% CTR. Title/meta
  keyword fix shipped 2026-06-22. **Re-pull daily JA CTR ~2026-07-13** to judge
  wording-vs-structural (the JP IV-checker SERP is saturated with entrenched tools —
  it may be structural, in which case no snippet fixes it).
- **EN `/iv-calculator/`** ranks page-1-bottom/page-2 (pos ~9–12) for `pvp iv checker`,
  `pvp rank checker`, etc. Title is fine — it's a ranking problem. Lever: internal links
  (homepage + blog → the IV page, "PvP IV / rank checker" anchors) + content depth.
- **Coverage recheck.** After the sitemap fix deploys, confirm blog posts move from
  "Crawled/Discovered – currently not indexed" to indexed (URL Inspection API).
- **MoveDex** converts poorly ("movedex" is brand-ambiguous) — low priority.
