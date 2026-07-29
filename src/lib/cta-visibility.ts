/**
 * How much of a CTA must be on screen before it counts as an impression.
 *
 * `IntersectionObserver` always delivers one initial entry describing the
 * current state, regardless of the configured thresholds — so gating on
 * `entry.isIntersecting` records a CTA that is barely peeking above the fold.
 * Compare the ratio instead.
 */
export const CTA_VISIBLE_RATIO = 0.5;

/** Thresholds dense enough that tall CTAs still produce a callback while scrolling past. */
export const CTA_VISIBILITY_THRESHOLDS = [0, 0.25, CTA_VISIBLE_RATIO, 0.75, 1];

/**
 * True once the CTA is meaningfully on screen.
 *
 * A CTA taller than the viewport can never reach a 0.5 intersection ratio, so
 * it also counts as seen when the visible slice fills half the viewport.
 * Mirrored by the inline analytics script in `Layout.astro` — keep both in step.
 */
export function isCtaVisible(entry: IntersectionObserverEntry): boolean {
  if (entry.intersectionRatio >= CTA_VISIBLE_RATIO) return true;
  return entry.intersectionRect.height >= window.innerHeight * CTA_VISIBLE_RATIO;
}
