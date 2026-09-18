# Feature screenshots

WebP only, 640px wide (2x the `width="320"` the components render them at).

**Exception: `collection-hero.webp` is 990px.** The collection screenshot is the
only one that also serves as a page hero — `/collection/` renders it at
`width="330"` and preloads it as the LCP image — where 640px was visibly soft.
It ships as a *second* file rather than by widening `collection.webp`, because
that one is still rendered at 320px on the home page and 300px in the team
builder; one 990px file for all three slots put 3.5x the bytes on the home page,
which converts best and needs them least. Re-export the hero with:

    cwebp -q 80 -noalpha -resize 990 0 <master>.png -o collection-hero.webp
    cwebp -q 80 -noalpha -resize 640 0 collection-hero.webp -o collection.webp

The English collection screenshot is denser than its siblings (a four-column
species grid rather than eight large tiles), so it weighs ~39KB at 640px against
their ~17KB — in family with `scout.webp` and `simulate.webp`, and not an
encoding mistake: re-encoding it at `-q 80` reproduces the same size.

Exported from the Flutter store-listing repo, one directory per locale. The
1320x2868 PNG masters are **not** kept here: they were ~22 MB, they never
reached a visitor at anything above 320px, and re-exporting is a step in the
store-listing workflow anyway.

To add or replace one:

    cwebp -q 82 -resize 640 0 -metadata none <master>.png -o <name>.webp

One directory per *content* locale, not per locale: regional variants resolve
through `contentLang()` in `src/i18n/locales.ts`, so `/es-419/` renders the `es/`
screenshots and deliberately has no directory of its own. Adding one here does
nothing — nothing reads it. Give a variant its own screenshots by dropping its
entry from `CONTENT_FALLBACK`, then adding the directory.

Referenced by `MainFeatures.astro`, `TeamBuilder.astro`, `Collection.astro`,
`Cleanup.astro`, the `preloadImage` in `src/pages/[lang]/team-builder.astro` and
`src/pages/[lang]/collection.astro` and, as the scan poster, `IvCalculator.tsx`
— all of them through `contentLang()`.
