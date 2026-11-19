/* /demo/amairanymua-01 — COCOA home: the opening and the hero's stack of reels.

   THE OPENING (only when the gate in <body> set html.intro): about 2.9 s.
     0.00        espresso panel; her lockup at the centre (painted by CSS before this runs)
     0.15–0.70   a fine latte rule draws under the lockup
     0.30–1.40   three numbers count up (text only; they end exactly on HER.years and SOCIAL)
     1.40–2.15   the hero's own first three reel cards slide up from below into a fan
     2.05–2.70   the lockup travels into its place in the header
     2.10–2.85   the panel lifts away upward (panel -100% / its pane +100%: the edge rises, the
                 print stays still) revealing the cream hero already composed; the fan glides
                 into the hero stack as the edge passes
   Engineering (from the Sass by Kass entrance): only transform and opacity, on wrappers; the cards
   are never duplicated (they ARE the hero's cards, lifted above the panel); the lockup copy wipes
   into the real header lockup as the panel's edge crosses it; when everything ends, every
   animation is cancelled and the classes removed in the same frame, so the page rests on its
   static styles. Any wheel, touchmove, pointerdown (not on a link or button) or key other than
   Tab/Shift finishes it at once; the Inquire button stays clickable throughout.

   THE STACK: a carousel of vertical reels. Every ~4.2 s the card behind on the right slides
   forward over the front one (never two faces dissolving: the incoming card is opaque and on top
   from its first frame). Pause/play, previous/next, swipe, a tap on a side card. Rests off screen
   and when the tab is hidden; never advances under reduced motion. */
(function () {
  'use strict';
  var win = window, doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduced = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var films = function () { return (win.__cocoa && win.__cocoa.films) || null; };

  /* ================= the stack ================= */
  var stack = $('[data-stack]');
  var Stack = null;
  if (stack) Stack = (function () {
    var cards = $$('.hs-c', stack), n = cards.length;
    var cap = $('[data-stack-cap]'), btns = $('[data-stack-btns]');
    var prev = $('[data-stack-prev]'), next = $('[data-stack-next]'), toggle = $('[data-stack-toggle]');
    var hold = parseInt(stack.getAttribute('data-hold'), 10) || 4200;
    var cur = 0, timer = 0, paused = reduced, visible = true, blocked = false;
    var kOf = function (i) { var k = (i - cur + n) % n; return k === 0 ? '0' : k === 1 ? '1' : k === n - 1 ? '-1' : 'h'; };
    var apply = function (announce) {
      cards.forEach(function (c, i) {
        var k = kOf(i);
        c.setAttribute('data-k', k);
        if (k === '0') c.removeAttribute('aria-hidden'); else c.setAttribute('aria-hidden', 'true');
        /* one clip plays in the stack: the front one, from where her finished glam appears */
        var v = c.querySelector('video');
        if (!v) return;
        if (k !== '0') { v.setAttribute('data-film-rest', ''); return; }
        v.removeAttribute('data-film-rest');
      });
      if (cap) {
        cap.setAttribute('aria-live', announce ? 'polite' : 'off');
        cap.innerHTML = cards[cur].getAttribute('data-cap') || '';
      }
      var f = films(); if (f) setTimeout(f.refresh, 40);
    };
    var running = function () { return !paused && visible && !blocked && !doc.hidden && n > 1; };
    var schedule = function () { clearTimeout(timer); if (running()) timer = setTimeout(function () { go(1, false); }, hold); };
    var go = function (dir, user) {
      cur = (cur + dir + n) % n;
      apply(user);
      schedule();
    };
    var face = function () {
      if (!toggle) return;
      toggle.classList.toggle('is-paused', paused);
      toggle.setAttribute('aria-label', paused ? 'Play the reels' : 'Pause the reels');
    };
    if (btns) btns.hidden = false;
    face();
    apply(false);
    if (prev) prev.addEventListener('click', function () { go(-1, true); });
    if (next) next.addEventListener('click', function () { go(1, true); });
    if (toggle) toggle.addEventListener('click', function () { paused = !paused; face(); schedule(); });
    /* a tap on a side card brings it forward */
    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        if (moved) return;
        var k = c.getAttribute('data-k');
        if (k === '1') go(1, true); else if (k === '-1') go(-1, true);
      });
    });
    /* swipe (touch or mouse drag), horizontal only; vertical scrolling is left to the page */
    var x0 = null, y0 = 0, moved = false;
    stack.addEventListener('pointerdown', function (e) { if (e.button > 0) return; x0 = e.clientX; y0 = e.clientY; moved = false; }, { passive: true });
    stack.addEventListener('pointermove', function (e) { if (x0 !== null && Math.abs(e.clientX - x0) > 8) moved = true; }, { passive: true });
    var end = function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1, true);
      setTimeout(function () { moved = false; }, 0);
    };
    stack.addEventListener('pointerup', end, { passive: true });
    stack.addEventListener('pointercancel', function () { x0 = null; moved = false; }, { passive: true });
    /* rest off screen and in a hidden tab */
    if ('IntersectionObserver' in win) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting; }); schedule(); }, { threshold: 0.15 }).observe(stack);
    }
    doc.addEventListener('visibilitychange', schedule);
    return {
      cards: cards,
      front: function () { return cards[cur]; },
      visibleCards: function () { return cards.filter(function (c, i) { return kOf(i) !== 'h'; }); },
      block: function (b) { blocked = b; schedule(); },
      start: schedule
    };
  })();

  /* ================= the opening ================= */
  var finished = false;
  var plain = function () { if (Stack) Stack.start(); };
  if (!root.classList.contains('intro')) { plain(); return; }
  root.classList.add('intro-run');
  if (Stack) Stack.block(true);

  var op = $('.op'), bg = $('.op-bg'), pane = $('.op-pane'), opLk = $('.op-lk'), mid = $('.op-mid'), rule = $('.op-rule');
  var anims = [], raf = 0;
  var counters = $$('.op-v-c');
  var done = function () {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-to'); });
    /* the same frame: cancel every animation and drop the pre-state, so the page rests on its own styles */
    anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
    var deck = $('.hs-deck'); if (deck) deck.style.transformOrigin = '';
    root.classList.remove('intro', 'intro-run');
    var f = films(); if (f) f.setHold(null);
    if (Stack) Stack.block(false);
    try { history.scrollRestoration = 'auto'; } catch (e) {}
    removeEventListener('wheel', skip, true); removeEventListener('touchmove', skip, true);
    removeEventListener('pointerdown', onDown, true); removeEventListener('keydown', onKey, true);
  };
  var skip = function () { if (finished) return; anims.forEach(function (a) { try { a.finish(); } catch (e) {} }); done(); };
  var onDown = function (e) { var t = e.target; if (t && t.closest && t.closest('a,button')) return; skip(); };
  var onKey = function (e) { if (e.key === 'Tab' || e.key === 'Shift') return; skip(); };

  try {
    if (!op || !bg || !pane || !opLk || !doc.body.animate) throw 0;
    try { history.scrollRestoration = 'manual'; } catch (e) {}
    if ((win.scrollY || 0) > 0) win.scrollTo(0, 0);
    var vw = root.clientWidth, vh = win.innerHeight;
    var A = function (el, kf, o) { if (!el) return null; var a = el.animate(kf, Object.assign({ fill: 'both' }, o)); anims.push(a); return a; };
    var OUT = 'cubic-bezier(.16,.84,.24,1)', GLIDE = 'cubic-bezier(.65,0,.2,1)', LIFT = 'cubic-bezier(.72,0,.22,1)';

    /* 1 — the rule and the numbers */
    A(rule, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { delay: 150, duration: 550, easing: OUT });
    $$('.op-n').forEach(function (n, i) { A(n, [{ opacity: 0, transform: 'translate3d(0,14px,0)' }, { opacity: 1, transform: 'none' }], { delay: 300 + i * 90, duration: 620, easing: OUT }); });
    A($('.op-date'), [{ opacity: 0 }, { opacity: 1 }], { delay: 900, duration: 500, easing: 'ease-out' });
    /* the count: text only, eased, ending exactly on the published figure */
    var specs = counters.map(function (c) {
      var to = c.getAttribute('data-to'), m = to.match(/^([\d.]+)(\D*)$/) || [to, '0', ''];
      return { el: c, to: to, n: parseFloat(m[1]) || 0, dec: (m[1].split('.')[1] || '').length, suf: m[2] };
    });
    var t0 = performance.now();
    var tickCount = function (now) {
      var p = Math.min(1, Math.max(0, (now - t0 - 300) / 1100));
      var e = 1 - Math.pow(1 - p, 3);
      specs.forEach(function (s) { s.el.textContent = p >= 1 ? s.to : (s.n * e).toFixed(s.dec) + s.suf; });
      if (p < 1 && !finished) raf = requestAnimationFrame(tickCount);
    };
    raf = requestAnimationFrame(tickCount);

    /* 2 — the fan: the hero's own cards, lifted above the panel. The deck is moved (one transform)
       from its hero place to a fan under the numbers, and each card rises into it from below. */
    var deck = $('.hs-deck');
    if (deck && Stack) {
      var D = deck.getBoundingClientRect();
      var M = mid ? mid.getBoundingClientRect() : { bottom: vh * 0.5 };
      var top = M.bottom + Math.max(18, vh * 0.03);
      var room = vh - top;
      var s = Math.max(0.5, Math.min(1, (room + D.height * 0.12) / D.height, vw < 900 ? 1 : 0.92));
      var dx = vw / 2 - (D.left + D.width / 2), dy = top - D.top;
      deck.style.transformOrigin = '50% 0';
      var fan = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
      var near = Math.abs(dx) < 4 && Math.abs(dy) < 4 && s > 0.99;
      if (!near) A(deck, [{ transform: fan }, { transform: 'none' }], { delay: 2150, duration: 700, easing: GLIDE });
      /* rise order: behind left, front, behind right */
      var order = ['-1', '0', '1'];
      Stack.cards.forEach(function (c) {
        var k = c.getAttribute('data-k'), i = order.indexOf(k);
        var inner = c.querySelector('.hs-in');
        A(inner, [{ transform: 'translate3d(0,' + Math.round(vh * 1.1) + 'px,0)' }, { transform: 'none' }], { delay: 1400 + (i < 0 ? 0 : i) * 95, duration: 760, easing: OUT });
      });
      /* posters first; the front clip starts as the fan lands, the others once the hero is theirs */
      var front = Stack.front().querySelector('video');
      var f = films();
      if (f) {
        f.setHold(function (v) { return v !== front || performance.now() - t0 < 1650; });
        setTimeout(function () { if (!finished && f) f.refresh(); }, 1700);
      }
    }

    /* 3 — the lockup travels into the header, then the panel lifts away */
    var real = $('#siteHeader .hd-logo .lk');
    if (real) {
      var R = real.getBoundingClientRect();
      var from = getComputedStyle(opLk).transform;
      A(opLk, [{ transform: from }, { transform: 'translate(' + R.left.toFixed(1) + 'px,' + R.top.toFixed(1) + 'px) scale(1)' }], { delay: 2050, duration: 650, easing: GLIDE });
    }
    if (mid) A(mid, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translate3d(0,-44px,0)' }], { delay: 2080, duration: 560, easing: 'cubic-bezier(.5,0,.75,0)' });
    A(bg, [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,-100%,0)' }], { delay: 2120, duration: 760, easing: LIFT });
    A(pane, [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,100%,0)' }], { delay: 2120, duration: 760, easing: LIFT });

    /* hand the page back once everything has finished; never in the way meanwhile */
    Promise.all(anims.map(function (a) { return a.finished; })).then(done, done);
    setTimeout(done, 3600); /* a ceiling, whatever happens to the animations */
    addEventListener('wheel', skip, { capture: true, passive: true });
    addEventListener('touchmove', skip, { capture: true, passive: true });
    addEventListener('pointerdown', onDown, true);
    addEventListener('keydown', onKey, true);
    addEventListener('pagehide', done, { once: true });
  } catch (e) { done(); }
})();
