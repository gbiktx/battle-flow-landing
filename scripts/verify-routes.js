import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = 'dist';
const LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh-Hans', 'zh-Hant', 'ja', 'ko'];
const BASE_ROUTES = ['', 'privacy', 'tac', 'blog', 'iv-calculator', 'movedex'];
const BLOG_SLUGS = fs.readdirSync('src/content/blog/en')
  .filter(file => file.endsWith('.md'))
  .map(file => file.replace(/\.md$/, ''));

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
} else {
  console.log('\n✅ SUCCESS: All pages found!');
  process.exit(0);
}
