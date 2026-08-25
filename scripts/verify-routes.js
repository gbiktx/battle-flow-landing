import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = 'dist';
// URL path segments — must stay lowercase. See CASING_RATIONALE below.
const LANGUAGES = ['en', 'es', 'es-419', 'fr', 'de', 'it', 'pt', 'zh-hant', 'ja', 'ko'];
const BASE_ROUTES = ['', 'privacy', 'tac', 'blog', 'iv-calculator', 'movedex', 'whats-new', 'gbl-calendar', 'team-builder', 'move-counts'];
const BLOG_SLUGS = fs.readdirSync('src/content/blog/en')
  .filter(file => file.endsWith('.md'))
  .map(file => file.replace(/\.md$/, ''));

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
BLOG_SLUGS.forEach(slug => checkPage(path.join('blog', slug)));

// 2. Check localized routes
LANGUAGES.filter(lang => lang !== 'en').forEach(lang => {
  BASE_ROUTES.forEach(route => checkPage(path.join(lang, route)));
  BLOG_SLUGS.forEach(slug => checkPage(path.join(lang, 'blog', slug)));
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
console.log('\n✅ SUCCESS: All checks passed!');
process.exit(0);
