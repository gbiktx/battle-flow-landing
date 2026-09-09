import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Three files pin Node and none of them can see the others:
//   .node-version   what NETLIFY builds with (it does not read package.json engines)
//   .mise.toml      what a local shell builds with
//   package.json    the floor the code actually needs
//
// The floor is real: scripts/validate-data.js imports src/i18n/ui.ts, and
// stripping types from a .ts import needs >=22.12. Below that the build dies at
// ERR_UNKNOWN_FILE_EXTENSION before Astro is even reached. Netlify works today
// only because its default happens to clear the floor; the day that default
// moves, the deploy breaks and nothing here would have warned us.
const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

const parse = (v: string) => v.trim().split('.').map(Number);
const gte = (a: number[], b: number[]) =>
  a[0] !== b[0] ? a[0] > b[0] : a[1] !== b[1] ? a[1] > b[1] : a[2] >= b[2];

const nodeVersion = read('.node-version').trim();
const misePin = read('.mise.toml').match(/^node\s*=\s*"([^"]+)"/m)?.[1];
const engineFloor = JSON.parse(read('package.json')).engines.node.replace(/^>=/, '');

test('.node-version is an exact version', () => {
  assert.match(nodeVersion, /^\d+\.\d+\.\d+$/, `"${nodeVersion}" is not an exact x.y.z — Netlify would float`);
});

test('.mise.toml and .node-version agree', () => {
  assert.equal(misePin, nodeVersion, 'local builds and Netlify builds would run different Node versions');
});

test('the pinned version clears the engines floor', () => {
  assert.ok(
    gte(parse(nodeVersion), parse(engineFloor)),
    `pinned ${nodeVersion} is below the engines floor ${engineFloor} — validate:data cannot import a .ts file`,
  );
});
