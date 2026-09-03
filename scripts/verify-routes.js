import fs from 'node:fs';
import path from 'node:path';

import { languages } from '../src/i18n/ui.ts';
import { toBcp47 } from '../src/i18n/locales.ts';

const DIST_DIR = 'dist';
// Read the roster from the site itself — a guard with its own copy of the locale
// list can't catch a locale that was added to src/i18n/ but missed elsewhere.
// Segments must stay lowercase (see CASING_RATIONALE below); toBcp47() supplies
// the real-cased hreflang value.
const LANGUAGES = Object.keys(languages);

const BASE_ROUTES = ['', 'privacy', 'tac', 'iv-calculator', 'movedex', 'whats-new', 'gbl-calendar', 'team-builder', 'move-counts'];

const CASING_RATIONALE = `
  WHY THIS FAILS THE BUILD:
  Netlify's CDN normalizes every URL path to lowercase with a 301 and this is
  not configurable. So a mixed-case path (e.g. /zh-Hant/iv-calculator/) is never
  a real URL — it always 301s to its lowercase form. When we emit mixed-case in
  a canonical, that canonical points at a redirect, i.e. the live page declares
  a canonical that redirects back to itself. Google reports these as
  "Page with redirect" and drops them from the index.

  THE RULE:
    - URL paths           -> always lowercase   (/zh-hant/...)
    - Language-tag VALUES -> BCP 47             (hreflang="zh-Hant", lang="zh-Hant")
  These are different things. RFC 5646 tags are case-insensitive, so BCP 47 is
  not a reason to put uppercase in a path. A previous fix was reverted for
  exactly that reason and the regression shipped.

  Full context: docs/locale-casing-fix-plan.md
`;

let missingPages = [];
let totalExpected = 0;

function checkPage(route) {
  totalExpected++;
  const filePath = path.join(DIST_DIR, route, 'index.html');
  if (!fs.existsSync(filePath)) {
    missingPages.push(route);
  }
}

// 1. Check English (root) routes
BASE_ROUTES.forEach(route => checkPage(route));

// 2. Check localized routes
LANGUAGES.filter(lang => lang !== 'en').forEach(lang => {
  BASE_ROUTES.forEach(route => checkPage(path.join(lang, route)));
});

console.log(`\n🔍 Verifying ${totalExpected} routes in ${DIST_DIR}/...`);

if (missingPages.length > 0) {
  console.error('\n❌ ERROR: The following pages were not found in the build output:');
  missingPages.forEach(page => console.error(`   - ${page}`));
  process.exit(1);
}

console.log(`✅ All ${totalExpected} routes found.`);

// --- Casing guards -----------------------------------------------------------
// Everything below enforces the lowercase-path rule described in
// CASING_RATIONALE. Route existence alone can't catch a casing regression:
// APFS is case-insensitive, so dist/zh-Hant/ satisfies a dist/zh-hant/ lookup
// locally while still emitting mixed-case URLs to Google.

const casingErrors = [];

const walkDirs = (dir) => fs.readdirSync(dir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .flatMap(entry => {
    const full = path.join(dir, entry.name);
    return [full, ...walkDirs(full)];
  });

const walkFiles = (dir, predicate) => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(full, predicate);
    return predicate(full) ? [full] : [];
  });

const hasUppercase = (str) => /[A-Z]/.test(str);

console.log('\n🔍 Verifying URL path casing...');

// Guard 1: no uppercase directory names in dist/ (they become URL segments).
walkDirs(DIST_DIR)
  .filter(dir => hasUppercase(path.basename(dir)))
  .forEach(dir => casingErrors.push(`uppercase directory: ${dir}/`));

// Guard 2: no uppercase in the PATH of any canonical / hreflang alternate href.
// The hreflang ATTRIBUTE VALUE is deliberately exempt — that one is BCP 47.
const LINK_TAG = /<link\s+[^>]*rel="(?:canonical|alternate)"[^>]*>/gi;
const HREF = /href="([^"]+)"/i;

walkFiles(DIST_DIR, f => f.endsWith('.html')).forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  for (const tag of html.match(LINK_TAG) ?? []) {
    const href = tag.match(HREF)?.[1];
    if (!href) continue;

    let pathname;
    try {
      pathname = new URL(href, 'https://battleflow.app').pathname;
    } catch {
      continue;
    }

    if (hasUppercase(pathname)) {
      casingErrors.push(`uppercase path in ${file}: ${tag.trim()}`);
    }
  }
});

// Guard 3: no uppercase path in any sitemap <loc>.
fs.readdirSync(DIST_DIR)
  .filter(file => /^sitemap.*\.xml$/.test(file))
  .forEach(file => {
    const xml = fs.readFileSync(path.join(DIST_DIR, file), 'utf8');
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      let pathname;
      try {
        pathname = new URL(loc).pathname;
      } catch {
        continue;
      }

      if (hasUppercase(pathname)) {
        casingErrors.push(`uppercase path in ${file}: <loc>${loc}</loc>`);
      }
    }
  });

if (casingErrors.length > 0) {
  console.error('\n❌ ERROR: mixed-case URL paths found in the build output:\n');
  casingErrors.forEach(e => console.error(`   - ${e}`));
  console.error(CASING_RATIONALE);
  process.exit(1);
}

console.log('✅ All URL paths are lowercase.');

// --- Sitemap guards ----------------------------------------------------------
// @astrojs/sitemap fails *silently*: an invalid option (e.g. an hreflang value
// its schema's /^[a-zA-Z-]+$/ rejects) logs one WARN line and emits no sitemap
// at all. The hreflang alternates are hand-rolled in astro.config.mjs for that
// reason — these guards make either regression a build failure. See docs/SEO.md.
console.log('\n🔍 Verifying the sitemap...');

const sitemapErrors = [];
const sitemapPath = path.join(DIST_DIR, 'sitemap-0.xml');

if (!fs.existsSync(path.join(DIST_DIR, 'sitemap-index.xml')) || !fs.existsSync(sitemapPath)) {
  sitemapErrors.push('no sitemap in dist/ — check the @astrojs/sitemap WARN lines in the build log');
} else {
  const xml = fs.readFileSync(sitemapPath, 'utf8');

  const entries = [...xml.matchAll(/<url>(.*?)<\/url>/gs)].map(([, body]) => ({
    loc: body.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '',
    tags: [...body.matchAll(/hreflang="([^"]+)"/g)].map(([, tag]) => tag),
  }));

  entries.filter(e => !e.loc.endsWith('/'))
    .forEach(e => sitemapErrors.push(`<loc> without a trailing slash: ${e.loc}`));

  // Alternates are checked per URL, not once for the whole file: "the tag appears
  // somewhere" still passes when 149 of 150 entries have lost their alternates.
  // The expected set is derived from the sitemap's own contents — locales sharing
  // a base path — so a legitimately locale-limited page (an empty What's New) is
  // not a failure, while a dropped locale is.
  const basePath = (loc) => {
    const [, first, ...rest] = new URL(loc).pathname.split('/');
    return LANGUAGES.includes(first) && first !== 'en' ? `/${rest.join('/')}` : new URL(loc).pathname;
  };
  const groups = new Map();
  for (const e of entries) groups.set(basePath(e.loc), (groups.get(basePath(e.loc)) ?? 0) + 1);

  for (const e of entries) {
    const siblings = groups.get(basePath(e.loc)) ?? 1;
    if (siblings < 2) continue;                       // no alternates expected
    const expected = siblings + 1;                    // + x-default
    if (e.tags.length !== expected) {
      sitemapErrors.push(`${e.loc}: ${e.tags.length} hreflang alternates, expected ${expected}`);
    }
  }

  // …and every locale must be represented, x-default included.
  const allTags = new Set(entries.flatMap(e => e.tags));
  ['x-default', ...LANGUAGES.map(toBcp47)]
    .filter(tag => !allTags.has(tag))
    .forEach(tag => sitemapErrors.push(`no <xhtml:link> alternate for hreflang="${tag}"`));
}

if (sitemapErrors.length > 0) {
  console.error('\n❌ ERROR: sitemap problems in the build output:\n');
  sitemapErrors.forEach(e => console.error(`   - ${e}`));
  process.exit(1);
}

console.log('✅ Sitemap has trailing-slash <loc>s and every locale alternate.');
console.log('\n✅ SUCCESS: All checks passed!');
process.exit(0);
