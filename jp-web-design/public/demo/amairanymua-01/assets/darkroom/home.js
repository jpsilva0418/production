/* /demo/amairanymua-01 — site "darkroom": the home page's two signature interactions.
   1. The stack of prints coming up (hero): every few seconds the next print drops onto the stack
      and develops on top: paper -> faint -> mid -> her photograph. Her films arrive as strips of
      35mm. Pause / Next / a tap on the stack; rests off screen and in a hidden tab; never runs on
      its own under reduced motion (Next still works, as a cut).
   2. The enlarger (contact sheet): choose a frame and the print beside her film cuts to blank
      paper and develops that look.
   Never two faces dissolved through each other: a new face always arrives under blank paper.
   Only transform and opacity are animated; every animation is cancelled when it ends so the
   page rests on its static styles, and a new action first finishes the one in flight. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnim = !reduced && !!(doc.body && doc.body.animate);
  var hasIO = 'IntersectionObserver' in window;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var DEV_EASE = 'cubic-bezier(.55,.06,.45,.94)';

  /* ---- shared helpers ---- */
  var ensureImg = function (img) {
    if (!img) return;
    var ss = img.getAttribute('data-srcset'), s = img.getAttribute('data-src');
    if (ss) { img.setAttribute('srcset', ss); img.removeAttribute('data-srcset'); }
    if (s) { img.setAttribute('src', s); img.removeAttribute('data-src'); }
  };
  var whenImg = function (img, cb, max) {
    var fired = false, go = function () { if (!fired) { fired = true; cb(); } };
    if (!img || (img.complete && img.naturalWidth)) { go(); return; }
    img.addEventListener('load', go, { once: true });
    img.addEventListener('error', go, { once: true });
    setTimeout(go, max || 1500);
  };
  /* load a print's develop stages (once); cb when both settled */
  var stages = function (pr, cb) {
    var dv = pr && pr.querySelector('.dv');
    if (!dv) { if (cb) cb(); return; }
    var key = dv.getAttribute('data-l') + '|' + dv.getAttribute('data-m');
    if (dv.__key === key && dv.__ready) { if (cb) cb(); return; }
    if (dv.__key !== key) {
      dv.__key = key; dv.__ready = false; dv.__cbs = [];
      var want = 0, got = 0;
      var settle = function () { got += 1; if (got >= want) { dv.__ready = true; var c = dv.__cbs; dv.__cbs = []; c.forEach(function (f) { f(); }); } };
      [['data-l', '.dv-l'], ['data-m', '.dv-m']].forEach(function (k) {
        var u = dv.getAttribute(k[0]), el = dv.querySelector(k[1]);
        if (!el) return;
        el.style.backgroundImage = '';
        if (!u) return;
        want += 1;
        var im = new Image();
        im.onload = function () { if (dv.__key === key) el.style.backgroundImage = 'url("' + u + '")'; settle(); };
        im.onerror = settle;
        im.src = u;
      });
      if (!want) dv.__ready = true;
    }
    if (cb) { if (dv.__ready) cb(); else dv.__cbs.push(cb); }
  };
  /* paper -> faint -> mid -> photograph, starting after `delay` ms; returns the animations */
  var develop = function (pr, delay, dur, onEnd) {
    var dv = pr && pr.querySelector('.dv');
    if (!dv || !canAnim) { if (onEnd) onEnd(); return []; }
    pr.classList.add('is-dev');
    var anims = [], ended = false;
    var A = function (sel, a, b) {
      var el = dv.querySelector(sel);
      if (!el) return;
      /* easing per keyframe: an iteration-wide easing would bend the offsets */
      anims.push(el.animate([{ opacity: 1 }, { opacity: 1, offset: a, easing: DEV_EASE }, { opacity: 0, offset: b }, { opacity: 0 }], { duration: dur, delay: delay, fill: 'both' }));
    };
    A('.dv-p', 0, 0.36); A('.dv-l', 0.36, 0.68); A('.dv-m', 0.68, 1);
    var fin = function () { if (ended) return; ended = true; pr.classList.remove('is-dev'); anims.forEach(function (x) { try { x.cancel(); } catch (e) {} }); if (onEnd) onEnd(); };
    Promise.all(anims.map(function (x) { return x.finished; })).then(fin, fin);
    return anims;
  };
  var finishAll = function (list) { (list || []).forEach(function (x) { try { x.finish(); } catch (e) {} }); };

  /* ================= 1. the stack of prints ================= */
  var stack = $('stack');
  if (stack) {
    var items = $$('.st-i', stack), n = items.length;
    var top = 0, timer = null, busy = null, paused = false, offscreen = false, started = false;
    var CYCLE = 3400;
    var btnPause = $('stPause'), btnNext = $('stNext'), countN = stack.parentNode.querySelector('.st-n'), countL = stack.parentNode.querySelector('.st-l');
    var prOf = function (i) { return items[i].firstElementChild; };
    var isFilm = function (i) { return items[i].classList.contains('st-i--film'); };
    var prepare = function (i) { var it = items[i]; ensureImg(it.querySelector('.pr-im img')); if (!isFilm(i)) stages(prOf(i)); };
    var depthClass = function (i) { var k = (top - i + n) % n; return k < 4 ? 'd' + k : 'dx'; };
    var applyDepths = function () {
      items.forEach(function (it, i) {
        var c = depthClass(i);
        it.classList.remove('d0', 'd1', 'd2', 'd3', 'dx');
        it.classList.add(c);
        if (c === 'd0') it.removeAttribute('aria-hidden'); else it.setAttribute('aria-hidden', 'true');
      });
      if (countN) countN.textContent = pad(top + 1);
      if (countL) countL.textContent = items[top].getAttribute('data-label') || '';
    };
    var advance = function () {
      if (busy) { finishAll(busy); busy = null; }
      var next = (top + 1) % n, it = items[next], pr = prOf(next);
      prepare(next);
      top = next;
      it.classList.add('st-up');
      applyDepths();
      prepare((next + 1) % n);
      if (!canAnim) { it.classList.remove('st-up'); return; }
      var drop = pr.animate([
        { transform: 'translate3d(0,-122%,0) rotate(-9deg)', opacity: 0, easing: 'linear' },
        { transform: 'translate3d(0,-112%,0) rotate(-8.4deg)', opacity: 1, offset: 0.07, easing: 'cubic-bezier(.4,.1,.5,1)' },
        { transform: 'translate3d(0,1.6%,0) rotate(.9deg)', opacity: 1, offset: 0.72, easing: 'cubic-bezier(.3,0,.3,1)' },
        { transform: 'none', opacity: 1 }
      ], { duration: 880, fill: 'both' });
      var list = [drop].concat(isFilm(next) ? [] : develop(pr, 560, 1300));
      busy = list;
      var fin = function () {
        if (busy === list) busy = null;
        try { drop.cancel(); } catch (e) {}
        it.classList.remove('st-up');
      };
      Promise.all(list.map(function (x) { return x.finished; })).then(fin, fin);
    };
    /* advance only when the next print's photograph and stages are in (or after a short wait) */
    var advanceWhenReady = function () {
      var next = (top + 1) % n;
      prepare(next);
      var img = items[next].querySelector('.pr-im img');
      if (isFilm(next)) { advance(); return; }
      var waited = false;
      whenImg(img, function () { stages(prOf(next), function () { if (!waited) { waited = true; advance(); } }); setTimeout(function () { if (!waited) { waited = true; advance(); } }, 700); }, 1800);
    };
    var schedule = function () {
      clearTimeout(timer); timer = null;
      if (!started || paused || offscreen || doc.hidden || !canAnim) return;
      timer = setTimeout(function () { timer = null; advanceWhenReady(); schedule(); }, CYCLE);
    };
    var start = function () { if (started) return; started = true; prepare(1); schedule(); };

    if (btnPause) btnPause.addEventListener('click', function () {
      paused = !paused;
      btnPause.setAttribute('aria-pressed', String(paused));
      btnPause.querySelector('.st-bt').textContent = paused ? 'Play' : 'Pause';
      schedule();
    });
    var manual = function () { advance(); schedule(); };
    if (btnNext) btnNext.addEventListener('click', manual);
    stack.addEventListener('click', manual);
    if (!canAnim && btnPause) btnPause.hidden = true;

    if (hasIO) new IntersectionObserver(function (es) { es.forEach(function (e) { offscreen = !e.isIntersecting; schedule(); }); }, { threshold: 0.05 }).observe(stack);
    doc.addEventListener('visibilitychange', schedule);

    if (root.classList.contains('intro') && !window.__drIntroDone) doc.addEventListener('dr:intro-end', start, { once: true });
    else start();
    /* safety: if the opening never reports, start anyway */
    setTimeout(start, 5000);
  }

  /* ================= 2. the enlarger ================= */
  var enl = $('enlPr'), cap = $('enlCap');
  var frames = $$('.work .sh-f[data-photo]');
  if (enl && frames.length) {
    var img = enl.querySelector('.pr-im img'), dv = enl.querySelector('.dv'), im = enl.querySelector('.pr-im');
    var current = enl.getAttribute('data-photo') || '';
    var token = 0, eBusy = [];
    var swapKey = function (s, from, to) { return s ? s.split(from).join(to) : s; };
    frames.forEach(function (f) { if (img && img.getAttribute('src') && img.getAttribute('src').indexOf('/' + f.getAttribute('data-photo') + '-') > -1) { current = f.getAttribute('data-photo'); f.setAttribute('aria-pressed', 'true'); } });
    var choose = function (f) {
      var key = f.getAttribute('data-photo');
      if (!key || key === current) return;
      frames.forEach(function (x) { x.setAttribute('aria-pressed', String(x === f)); });
      var from = current; current = key;
      var my = ++token;
      finishAll(eBusy); eBusy = [];
      var fImg = f.querySelector('img');
      var pos = fImg ? fImg.style.objectPosition : '';
      var n = (f.querySelector('.sh-n') || {}).textContent || '';
      var label = (f.getAttribute('aria-label') || '').replace(/^Frame [^:]+:\s*/, '');
      if (canAnim) { enl.classList.add('is-dev'); var p = dv && dv.querySelector('.dv-p'); if (p) p.style.opacity = '1'; }
      if (dv) { dv.setAttribute('data-l', swapKey(dv.getAttribute('data-l'), '/' + from + '-', '/' + key + '-')); dv.setAttribute('data-m', swapKey(dv.getAttribute('data-m'), '/' + from + '-', '/' + key + '-')); }
      if (img) {
        img.setAttribute('srcset', swapKey(img.getAttribute('srcset'), '/' + from + '-', '/' + key + '-'));
        img.setAttribute('src', swapKey(img.getAttribute('src'), '/' + from + '-', '/' + key + '-'));
        img.setAttribute('alt', f.getAttribute('data-alt') || '');
        if (pos) img.style.objectPosition = pos;
      }
      if (im && pos) im.style.setProperty('--pos', pos);
      if (cap) cap.innerHTML = '<span class="enl-n">&#9656; ' + n + '</span> ' + label;
      var pn = enl.querySelector('.pr-n'); if (pn && n) pn.textContent = '\u25B8 ' + n; /* the frame number on the print's border follows the frame */
      if (!canAnim) return;
      eBusy = [enl.animate([{ transform: 'rotate(-1.2deg)', easing: 'cubic-bezier(.3,0,.4,1)' }, { transform: 'translate3d(0,-10px,0) rotate(-2.4deg) scale(.985)', offset: 0.35, easing: 'cubic-bezier(.3,0,.2,1)' }, { transform: 'rotate(-1.2deg)' }], { duration: 650 })];
      var go = function () {
        if (my !== token) return;
        var p = dv && dv.querySelector('.dv-p'); if (p) p.style.opacity = '';
        eBusy = eBusy.concat(develop(enl, 0, 1400));
      };
      var waited = false;
      whenImg(img, function () { stages(enl, function () { if (!waited) { waited = true; go(); } }); setTimeout(function () { if (!waited) { waited = true; go(); } }, 800); }, 2000);
    };
    frames.forEach(function (f) { f.addEventListener('click', function () { choose(f); }); });
    /* the enlarger develops its first print when it comes into view */
    if (canAnim && hasIO) {
      enl.classList.add('is-dev');
      stages(enl);
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return; io.disconnect();
          var my = token, waited = false;
          var go = function () { if (my !== token || waited) return; waited = true; eBusy = develop(enl, 150, 1500); };
          whenImg(img, function () { stages(enl, go); setTimeout(go, 900); }, 2000);
        });
      }, { threshold: 0.3 });
      io.observe(enl);
    }
  }
})();
