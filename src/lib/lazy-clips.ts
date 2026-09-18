/**
 * Attaches a clip's source only once it is near the viewport.
 *
 * `preload="none"` does not hold back a video that also carries `autoplay`, so
 * the source is withheld from the markup entirely and set here instead. Reduced
 * motion gets the poster and a play button rather than a loop it cannot stop.
 *
 * Safe to call twice over the same DOM: `data-lazy-src` is consumed as it is
 * claimed, so a second pass (a React island re-mounting, or a page where both
 * an island and an Astro script call this) finds nothing left to observe and
 * cannot restart a clip mid-play by re-assigning an identical `src`.
 *
 * @returns a disposer that disconnects any observers still waiting.
 */
export function initLazyClips(root: ParentNode = document): () => void {
  const clips = root.querySelectorAll<HTMLVideoElement>('video[data-lazy-src]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observers: IntersectionObserver[] = [];

  for (const clip of clips) {
    const src = clip.dataset.lazySrc;
    if (!src) continue;
    delete clip.dataset.lazySrc;

    if (reduced) {
      clip.controls = true;
      clip.src = src;
      continue;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      clip.src = src;
      clip.play().catch(() => {
        clip.controls = true;
      });
    }, { rootMargin: '300px' });

    observer.observe(clip);
    observers.push(observer);
  }

  return () => observers.forEach((observer) => observer.disconnect());
}
