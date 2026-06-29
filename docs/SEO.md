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

## ⚠️ Gotchas (don't reintroduce)

- **Sitemap trailing slashes.** `trailingSlash: 'always'`, so every canonical page
  ends in `/`. `@astrojs/sitemap` emits `<loc>` **without** the slash by default,
  which points Google at the non-canonical (redirected) URL of every page and leaves
  low-authority pages (the blog) unindexed. Fixed via a `serialize()` in
  [`astro.config.mjs`](../astro.config.mjs) that appends the slash. **If you touch the
  sitemap config, verify `dist/sitemap-0.xml` still has trailing-slash `<loc>` URLs.**
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
