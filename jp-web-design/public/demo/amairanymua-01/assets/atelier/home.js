/* /demo/amairanymua-01 — ATELIER home runtime: the opening. Plain ES2017, one IIFE, no
   dependencies, no network.

   The opening, "an arched window opens":
     0.00–0.60   ivory; a fine espresso hairline draws down the centre, where the window will be
     0.20–1.10   "Glam By" writes on (a clip-path wipe, left to right); AMAIRANYMUA rises beneath
                 it letter by letter from a mask; "Licensed & insured · Central Florida", tiny
     1.10–1.90   out of the hairline an arched window opens (an arch-shaped clip-path growing from
                 a sliver): inside it her bridal morning clip is already playing (poster first)
     1.90–2.90   the window travels into its place in the hero (it IS the hero's centre arch:
                 FLIP), the lockup travels into the header (it IS the header's lockup), the ivory
                 sheet lifts, the words rise, the two side arches open from the bottom
   The real page is underneath from the first frame, its lead image (the clip's poster) painting.
   Only wrappers move, with transform, opacity and clip-path. At the end every animation is
   cancelled in the same frame the pre-state class is removed, so the page rests on its plain
   static styles. A wheel, touchmove, pointerdown or key (not Tab or Shift) ends it at once. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, win = window;
  var q = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  if (!root.classList.contains('intro')) return;
  root.classList.add('intro-run');

  var anims = [], ended = false;
  var EVENTS = ['wheel', 'touchmove', 'pointerdown', 'keydown'];
  var done = function () {
    if (ended) return;
    ended = true;
    root.classList.remove('intro', 'intro-run');
    anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
    EVENTS.forEach(function (t) { win.removeEventListener(t, skip, true); });
    var ev; try { ev = new CustomEvent('atelier:introdone'); } catch (e) { ev = doc.createEvent('Event'); ev.initEvent('atelier:introdone', false, false); }
    doc.dispatchEvent(ev);
  };
  var skip = function (e) {
    if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
    done();
  };
  EVENTS.forEach(function (t) { win.addEventListener(t, skip, { capture: true, passive: true }); });

  try {
    var lk = q('.hd-logo .lk'), win_ = q('.wall-c .arch-m'), op = q('.op');
    if (!lk || !win_ || !op || !lk.animate) throw new Error('missing');
    var A = function (el, kf, o) {
      if (!el || !el.animate) return null;
      var a = el.animate(kf, Object.assign({ fill: 'both' }, o));
      anims.push(a);
      return a;
    };
    var vw = win.innerWidth;
    var vh = win.visualViewport ? win.visualViewport.height : win.innerHeight;
    var phone = vw < 600, land = vh < 500;
    var soft = 'cubic-bezier(.45,.05,.3,1)', out = 'cubic-bezier(.22,.8,.24,1)', glide = 'cubic-bezier(.68,0,.16,1)', open = 'cubic-bezier(.62,0,.24,1)';

    /* --- composition of the opening: the lockup, the badges, the window, centred as one --- */
    var lr = lk.getBoundingClientRect(), ar = win_.getBoundingClientRect();
    var lkW = Math.min(vw * (phone ? 0.62 : 0.26), land ? 200 : 380, vh * 0.5);
    var s0 = lkW / lr.width, lkH = lr.height * s0;
    var gap1 = Math.max(10, lkH * 0.1), badgeH = 14, gap2 = land ? 14 : Math.max(22, vh * 0.035);
    var bottomRoom = phone ? 92 : 70;                      /* the preview marker lives down there */
    var archH = Math.min(vh * (land ? 0.5 : 0.52), (vw - 64) / (ar.width / ar.height), 620);
    var total = lkH + gap1 + badgeH + gap2 + archH;
    var top = Math.max(vh * 0.06, (vh - bottomRoom - total) / 2 + (land ? 0 : vh * 0.02));
    if (top + total > vh - bottomRoom) { archH = Math.max(120, vh - bottomRoom - top - (lkH + gap1 + badgeH + gap2)); }
    var sA = archH / ar.height, archW = ar.width * sA;
    var lkX = vw / 2 - lkW / 2, lkY = top;
    var bY = lkY + lkH + gap1;
    var aX = vw / 2 - archW / 2, aY = bY + badgeH + gap2;

    op.style.setProperty('--by', bY.toFixed(1) + 'px');
    op.style.setProperty('--ly', aY.toFixed(1) + 'px');
    op.style.setProperty('--lh', archH.toFixed(1) + 'px');

    var T = 2900;
    /* --- 0.00–0.60: the hairline draws down where the window will be, then makes way --- */
    var ln = q('.op-ln');
    A(ln, [{ transform: 'scaleY(0)', opacity: 1 }, { transform: 'scaleY(1)', opacity: 1, offset: 0.4 }, { transform: 'scaleY(1)', opacity: 1, offset: 0.78 }, { transform: 'scaleY(1)', opacity: 0 }], { duration: 1500, easing: soft });

    /* --- the lockup: the header's own, carried to the centre and played back home --- */
    var lkFrom = 'translate(' + (lkX - lr.left).toFixed(1) + 'px,' + (lkY - lr.top).toFixed(1) + 'px) scale(' + s0.toFixed(4) + ')';
    A(lk, [{ transform: lkFrom, easing: 'linear' }, { transform: lkFrom, offset: 1900 / T, easing: glide }, { transform: 'none' }], { duration: T });
    /* "Glam By" writes on, left to right */
    A(q('.lk-s', lk), [{ clipPath: 'inset(-10% 100% -10% 0)' }, { clipPath: 'inset(-10% 0% -10% 0)' }], { duration: 900, delay: 200, easing: 'cubic-bezier(.5,.1,.3,1)' });
    /* AMAIRANYMUA rises beneath, one letter after another */
    $$('.lk-c span', lk).forEach(function (c, i) {
      A(c, [{ transform: 'translateY(115%)' }, { transform: 'none' }], { duration: 640, delay: 460 + i * 42, easing: out });
    });
    /* the badges, tiny */
    A(q('.op-b'), [{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 0, transform: 'translateY(5px)', offset: 0.33 }, { opacity: 1, transform: 'none', offset: 0.55 }, { opacity: 1, transform: 'none', offset: 0.86 }, { opacity: 0, transform: 'translateY(-4px)' }], { duration: 2100, easing: 'ease-out' });

    /* --- 1.10–1.90: the window opens out of the hairline; 1.90–2.90: it travels home --- */
    var aFrom = 'translate(' + (aX - ar.left).toFixed(1) + 'px,' + (aY - ar.top).toFixed(1) + 'px) scale(' + sA.toFixed(4) + ')';
    A(win_, [{ transform: aFrom, easing: 'linear' }, { transform: aFrom, offset: 1900 / T, easing: glide }, { transform: 'none' }], { duration: T });
    A(win_, [{ clipPath: 'inset(0% 50% 0% 50% round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)' }], { duration: 820, delay: 1100, easing: open, composite: 'replace' });
    A(q('.film, img', win_), [{ transform: 'scale(1.14)' }, { transform: 'none' }], { duration: 1500, delay: 1100, easing: out });

    /* --- 1.90–2.90: the sheet lifts and the hero assembles around the window --- */
    A(op, [{ opacity: 1 }, { opacity: 0 }], { duration: 650, delay: 2000, easing: 'ease-in-out' });
    $$('.d-hero .hl > span').forEach(function (s, i) {
      A(s, [{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 950, delay: 2080 + i * 110, easing: glide });
    });
    var rise = function (el, delay) { A(el, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 760, delay: delay, easing: out }); };
    rise(q('.hero-k'), 2120);
    rise(q('.hero-line'), 2300);
    rise(q('.hero-book'), 2360);
    rise(q('.hero-acts'), 2420);
    rise(q('.hero-ctl'), 2560);
    rise(q('.wall-c-cap'), 2700);
    $$('.wall-side .arch-m').forEach(function (m, i) {
      A(m, [{ clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0 0 0 round 999px 999px 0 0)' }], { duration: 1050, delay: 2150 + i * 160, easing: open });
    });
    A(q('.hd-tools'), [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 1500, easing: 'ease-out' });
    A(q('.hd-nav'), [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 2350, easing: 'ease-out' });

    /* hand the page back to its static styles in one frame, once everything has finished */
    Promise.all(anims.map(function (a) { return a.finished; })).then(done, done);
    win.addEventListener('pagehide', done, { once: true });
    /* a last guard: whatever happens, the page is the page by 4.5 s */
    setTimeout(done, 4500);
  } catch (e) {
    done();
  }
})();
