/* /demo/amairanymua-01 — The Edit: the STORY pages' only script.
   The full-bleed wedding-day picture drifts a few percent against the scroll, like a print
   sliding under glass. One rAF per scroll burst, passive listeners, only while the frame is
   on screen; nothing under reduced motion or Save-Data, and without script it is a still. */
(function () {
  'use strict';
  var el = document.querySelector('[data-drift]');
  if (!el || !window.requestAnimationFrame) return;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if ((mq && mq.matches) || (navigator.connection && navigator.connection.saveData)) return;
  var box = el.parentNode, ticking = false, visible = true;
  var frame = function () {
    ticking = false;
    if (!visible) return;
    var r = box.getBoundingClientRect(), vh = window.innerHeight || 1;
    if (r.bottom < 0 || r.top > vh) return;
    /* -1 as the frame enters at the bottom, +1 as it leaves at the top */
    var p = ((r.top + r.height / 2) - vh / 2) / ((vh + r.height) / 2);
    if (p > 1) p = 1; else if (p < -1) p = -1;
    el.style.transform = 'translate3d(0,' + (p * 5).toFixed(2) + '%,0)';
  };
  var ask = function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) ask(); }).observe(box);
  }
  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', ask, { passive: true });
  if (mq && mq.addEventListener) mq.addEventListener('change', function (e) { if (e.matches) el.style.transform = ''; });
  frame();
})();
