/* /demo/amairanymua-01 — MAISON home runtime: the opening. Plain ES2017, one IIFE, no
   dependencies, no network.

   The opening, "her signature":
     0.00        black
     0.10–1.40   "Glam By" writes itself in red, glyph by glyph (each contour's stroke draws on),
                 the fill floods in behind each stroke
     1.05–1.70   AMAIRANYMUA sets beneath in white caps, letters tracking in from wide to rest;
                 under it, tiny: "Licensed & insured · Central Florida"
     1.75–2.60   the lockup travels into the header (it IS the header's own lockup: FLIP)
     1.85–2.15   a red seam draws down the middle of the black
     2.05–2.95   the black parts like a curtain, left and right, each half carrying its red edge,
                 onto the hero, already composed underneath
     2.20–3.30   the hero's words rise and settle; the header's links arrive
   The real page is underneath from the first frame, its lead photograph painting. Only wrappers
   move, with transform, opacity and clip-path (the stroke draw is the one stroke-dashoffset).
   At the end every animation is cancelled in the same frame the pre-state class is removed, so
   the page rests on its plain static styles. A wheel, touchmove, pointerdown or key (not Tab or
   Shift) ends it at once. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, win = window;
  var q = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  if (!root.classList.contains('intro')) return;
  root.classList.add('intro-run');

  var anims = [], ended = false;
  var EVENTS = ['wheel', 'touchmove', 'pointerdown', 'keydown'];
  var lk = q('.hd-logo .lk'), svg = lk && q('.lk-s', lk);
  var done = function () {
    if (ended) return;
    ended = true;
    root.classList.remove('intro', 'intro-run');
    anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
    if (svg) svg.style.removeProperty('--lk-sw');
    EVENTS.forEach(function (t) { win.removeEventListener(t, skip, true); });
    var ev; try { ev = new CustomEvent('maison:introdone'); } catch (e) { ev = doc.createEvent('Event'); ev.initEvent('maison:introdone', false, false); }
    doc.dispatchEvent(ev);
  };
  var skip = function (e) {
    if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
    done();
  };

  try {
    if (!lk || !lk.animate) throw new Error('no lockup');
    var A = function (el, kf, o) {
      if (!el || !el.animate) return null;
      var a = el.animate(kf, Object.assign({ fill: 'both' }, o));
      anims.push(a);
      return a;
    };
    var vw = win.innerWidth;
    var vh = win.visualViewport ? win.visualViewport.height : win.innerHeight;
    var phone = vw < 600;
    var soft = 'cubic-bezier(.45,.05,.3,1)', out = 'cubic-bezier(.22,.8,.24,1)', glide = 'cubic-bezier(.7,0,.16,1)', part = 'cubic-bezier(.76,0,.2,1)';

    /* --- the lockup: the header's own, scaled up to the centre and played back home --- */
    var r = lk.getBoundingClientRect();
    var targetW = Math.min(vw * (phone ? 0.8 : 0.5), vh * 1.05, 640);
    var s0 = targetW / r.width;
    var cy = vh * (phone ? 0.45 : 0.47), cx = vw / 2;
    var tx = cx - targetW / 2 - r.left, ty = cy - (r.height * s0) / 2 - r.top;
    var from = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + s0.toFixed(4) + ')';
    var T = 2600, FLY = 1750;
    A(lk, [{ transform: from, easing: 'linear' }, { transform: from, offset: FLY / T, easing: glide }, { transform: 'none' }], { duration: T });

    /* stroke width: about 1.3 px on screen at the opening's size */
    var svgW = svg.getBoundingClientRect().width * s0;
    svg.style.setProperty('--lk-sw', (1.3 * 3000 / Math.max(1, svgW)).toFixed(2) + 'px');

    /* --- the signature writes itself: each glyph's contours stroke on, the fill follows --- */
    var groups = $$('.lk-sg', lk), fills = $$('.lk-g', lk);
    groups.forEach(function (g, k) {
      var t0 = 100 + k * 150 + (k >= 4 ? 90 : 0);
      $$('path', g).forEach(function (p) {
        A(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 560, delay: t0, easing: soft });
      });
      A(fills[k], [{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: t0 + 300, easing: 'cubic-bezier(.4,0,.2,1)' });
    });
    /* the stroke layer bows out once the fill is in, so the rest state is the fill alone */
    A(q('.lk-sk', lk), [{ opacity: 1 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }], { duration: 1900, easing: 'linear' });

    /* --- the caps set beneath, tracking in from wide --- */
    var caps = $$('.lk-c span', lk), mid = (caps.length - 1) / 2;
    caps.forEach(function (c, i) {
      var off = ((i - mid) * 0.9).toFixed(2);
      A(c, [{ opacity: 0, transform: 'translateX(' + off + 'em)' }, { opacity: 1, transform: 'none' }], { duration: 680, delay: 1050, easing: out });
    });

    /* --- the badges, tiny, under the caps --- */
    var op = q('.op'), badge = q('.op-b');
    if (op) op.style.setProperty('--by', (cy + (r.height * s0) / 2 + Math.max(16, targetW * 0.05)).toFixed(1) + 'px');
    A(badge, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 0, transform: 'translateY(6px)', offset: 1380 / 1900 }, { opacity: 1, transform: 'none', offset: 1640 / 1900 }, { opacity: 0, transform: 'translateY(-4px)' }], { duration: 1900, easing: 'ease-out' });

    /* --- the seam, then the curtain parts --- */
    $$('.op-e').forEach(function (e) {
      A(e, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 320, delay: 1900, easing: soft });
    });
    A(q('.op-l'), [{ transform: 'translateX(0)' }, { transform: 'translateX(-101%)' }], { duration: 900, delay: 2050, easing: part });
    A(q('.op-r'), [{ transform: 'translateX(0)' }, { transform: 'translateX(101%)' }], { duration: 900, delay: 2050, easing: part });

    /* --- the hero, already composed underneath, settles as it is uncovered --- */
    var heroImg = q('.hero-ph .wipe-s.is-on .wipe-i');
    A(heroImg, [{ transform: 'scale(1.07)' }, { transform: 'scale(1)' }], { duration: 1300, delay: 2000, easing: out });
    A(q('.hero-fm .fr-m'), [{ transform: 'scale(1.04)' }, { transform: 'scale(1)' }], { duration: 1300, delay: 2050, easing: out });
    $$('.d-hero .hl > span').forEach(function (s, i) {
      A(s, [{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 900, delay: 2220 + i * 120, easing: glide });
    });
    var rise = function (el, delay) { A(el, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: delay, easing: out }); };
    rise(q('.hero-k'), 2300);
    rise(q('.hero-line'), 2480);
    rise(q('.hero-book'), 2540);
    rise(q('.hero-acts'), 2600);
    rise(q('.hero-txt .wipe-ctl'), 2700);
    A(q('.hd-nav'), [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 2250, easing: 'ease-out' });
    A(q('.hd-tools'), [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 2350, easing: 'ease-out' });

    /* hand the page back to its static styles in one frame, once everything has finished */
    Promise.all(anims.map(function (a) { return a.finished; })).then(done, done);
    EVENTS.forEach(function (t) { win.addEventListener(t, skip, { capture: true, passive: true }); });
    win.addEventListener('pagehide', done, { once: true });
    /* a last guard: whatever happens, the page is the page by 4.5 s */
    setTimeout(done, 4500);
  } catch (e) {
    done();
  }
})();
