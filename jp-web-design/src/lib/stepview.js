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

/** The token's value, as a number of pixels. */
function tokenHeight() {
  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue('--header-h').trim();
  if (raw.endsWith('px')) return parseFloat(raw);
  if (raw.endsWith('rem')) return parseFloat(raw) * parseFloat(getComputedStyle(root).fontSize);
  return 68; /* the token's current value, if it is ever unreadable */
}

/**
 * How much of the top of the viewport the sticky header actually covers.
 *
 * Measured from the element, not assumed from the token. The token says what
 * the header is designed to be; at a narrow width, with a large system font,
 * or in an in-app browser that scales text, the real header can be taller —
 * and every pixel of that difference is a pixel of the new step hidden
 * underneath it. That is the whole of the "step lands under the header" bug
 * on mobile, and reading the box instead of the variable is the fix.
 *
 * Only a header that is actually pinned counts: a static one scrolls away
 * with the page and covers nothing.
 */
function headerHeight() {
  const el = document.querySelector('header');
  if (el) {
    const pos = getComputedStyle(el).position;
    if (pos === 'sticky' || pos === 'fixed') {
      const h = el.getBoundingClientRect().height;
      if (h > 0) return h;
    }
  }
  return tokenHeight();
}

/**
 * Put the top of `el` just below the sticky header.
 * @param {Element|null} el
 * @param {{gap?: number, smooth?: boolean}} [opts] gap: breathing room under the header.
 */
export function revealTop(el, { gap = 16, smooth = true, verify = true } = {}) {
  if (!el || typeof window === 'undefined') return;
  const target = () => Math.max(0, Math.round(
    el.getBoundingClientRect().top + window.scrollY - headerHeight() - gap,
  ));

  const top = target();
  /* Already there: scrolling again would be a visible twitch for no gain. */
  if (Math.abs(window.scrollY - top) < 4) return;
  window.scrollTo({ top, behavior: smooth && !reduced() ? 'smooth' : 'auto' });

  /* Then check the work. A smooth scroll is asynchronous and can be cut
     short — an in-app browser collapsing its toolbar, a late web font, an
     image above the step settling into its final height — and when it is,
     the step is left sitting at the wrong offset with nothing to correct it.
     This re-measures once the scroll has had time to land and, if the top of
     the step is not where it should be, puts it there without animating. The
     tolerance is loose enough that a correct scroll never triggers a second
     one. */
  if (!verify) return;
  let tries = 0;
  let abandoned = false;
  /* The visitor's own scroll always wins. If they touch the screen or turn a
     wheel while this is settling, the correction is dropped — a page that
     snaps back under your thumb is worse than a step a few pixels low. */
  const giveUp = () => { abandoned = true; };
  const opts = { passive: true, once: true };
  addEventListener('touchstart', giveUp, opts);
  addEventListener('wheel', giveUp, opts);
  addEventListener('keydown', giveUp, opts);

  const stop = () => {
    removeEventListener('touchstart', giveUp);
    removeEventListener('wheel', giveUp);
    removeEventListener('keydown', giveUp);
  };

  const tick = () => {
    if (abandoned) return stop();
    if (++tries > 40) return stop();                 // ~650ms at 60fps, then stop
    const want = target();
    if (Math.abs(window.scrollY - want) < 6) return stop(); // landed
    if (tries < 30) { requestAnimationFrame(tick); return; }
    window.scrollTo({ top: want, behavior: 'auto' });
    stop();
  };
  requestAnimationFrame(tick);
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
