/* ==========================================================================
   STEPVIEW — bringing part of the page into view under a sticky header.

   Used by multi-step flows, where replacing the content of a step does NOT
   move the scroll position: the browser keeps the offset it had, so a tall
   step followed by a short one can leave the visitor below the whole form,
   looking at whatever comes after it.

   Deliberately `window.scrollTo` with a computed offset rather than
   `scrollIntoView` + `scroll-margin-top`. The site already sets
   `html { scroll-padding-top }` globally for #anchor navigation, and
   scroll-padding on the scrollport and scroll-margin on the target BOTH
   apply to scrollIntoView and add together — which would push the step
   roughly twice the header's height down the page. Computing the offset
   once, here, is one mechanism instead of two interacting ones.

   This is page-scroll only. Route navigation has its own policy in
   components/Navigation.astro; the two never touch.
   ========================================================================== */

const reduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Height of the sticky header, read from the design token that defines it. */
function headerHeight() {
  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue('--header-h').trim();
  if (raw.endsWith('px')) return parseFloat(raw);
  if (raw.endsWith('rem')) return parseFloat(raw) * parseFloat(getComputedStyle(root).fontSize);
  return 68; /* the token's current value, if it is ever unreadable */
}

/**
 * Put the top of `el` just below the sticky header.
 * @param {Element|null} el
 * @param {{gap?: number, smooth?: boolean}} [opts] gap: breathing room under the header.
 */
export function revealTop(el, { gap = 16, smooth = true } = {}) {
  if (!el || typeof window === 'undefined') return;
  const top = Math.max(0, Math.round(
    el.getBoundingClientRect().top + window.scrollY - headerHeight() - gap,
  ));
  /* Already there: scrolling again would be a visible twitch for no gain. */
  if (Math.abs(window.scrollY - top) < 4) return;
  window.scrollTo({ top, behavior: smooth && !reduced() ? 'smooth' : 'auto' });
}

/**
 * Make sure `el` is actually visible — used for the first invalid field, where
 * yanking it to the top of the viewport would be heavy-handed. Only scrolls
 * when the element is hidden under the header or below the fold.
 */
export function revealField(el, { gap = 16, smooth = true } = {}) {
  if (!el || typeof window === 'undefined') return;
  const r = el.getBoundingClientRect();
  const top = headerHeight() + gap;
  const bottom = (window.innerHeight || document.documentElement.clientHeight);
  if (r.top >= top && r.bottom <= bottom) return;   // already fully visible
  revealTop(el, { gap: gap + 8, smooth });
}
