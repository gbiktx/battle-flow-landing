# Feature screenshots

WebP only, 640px wide (2x the `width="320"` the components render them at).

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

Referenced by `MainFeatures.astro`, `TeamBuilder.astro`, the `preloadImage` in
`src/pages/[lang]/team-builder.astro` and, as the scan poster,
`IvCalculator.tsx` — all of them through `contentLang()`.
