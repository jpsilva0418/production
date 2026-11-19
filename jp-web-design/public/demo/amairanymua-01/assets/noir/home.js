/* /demo/amairanymua-01 — NOIR home runtime: the opening, the hero reel, scenes, the strip.
   Plain ES2017, one IIFE, no dependencies, no network. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var $ = function (id) { return doc.getElementById(id); };
  var q = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* ===================== hero reel ===================== */
  var reel = $('reel');
  var Reel = (function () {
    if (!reel) return { start: function () {} };
    var beats = $$('.hb', reel);
    var n = beats.length, i = 0, timer = 0, started = false, userPaused = !!reduced, visible = true;
    var btn = $('reelPause'), nEl = $('reelN'), lEl = $('reelL');
    var HOLD = 2800;
    var pad = function (k) { return (k < 10 ? '0' : '') + k; };
    var label = function () {
      if (!btn) return;
      btn.classList.toggle('is-paused', userPaused);
      var t = q('.t', btn); if (t) t.textContent = userPaused ? 'Play' : 'Pause';
    };
    var go = function (k) {
      var prev = beats[i], next = beats[k];
      if (!next || next === prev) return;
      beats.forEach(function (b) { if (b !== prev) b.classList.remove('was'); });
      prev.classList.remove('on'); prev.classList.add('was');
      next.classList.add('on');
      i = k;
      if (nEl) nEl.textContent = pad(k + 1);
      if (lEl) lEl.textContent = next.getAttribute('data-label') || '';
      setTimeout(function () { if (prev !== beats[i]) prev.classList.remove('was'); }, 360);
    };
    var running = function () { return started && !userPaused && visible && !doc.hidden; };
    var schedule = function () {
      clearTimeout(timer);
      reel.classList.toggle('paused', !running());
      if (running()) timer = setTimeout(function () { go((i + 1) % n); schedule(); }, HOLD);
    };
    if (btn) {
      btn.hidden = false; label();
      btn.addEventListener('click', function () {
        userPaused = !userPaused; label();
        if (!userPaused && !reel.classList.contains('playing') && !reduced) reel.classList.add('playing');
        if (!userPaused && reduced) { go((i + 1) % n); }
        schedule();
      });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; schedule(); }, { threshold: 0.15 }).observe(reel);
    }
    doc.addEventListener('visibilitychange', schedule);
    return {
      start: function () {
        if (started) return;
        started = true;
        if (!reduced) reel.classList.add('playing');
        schedule();
      },
    };
  })();

  /* ===================== the opening =====================
     0.00 black, a few pixels of champagne rule at centre
     0.10–1.30 the name strokes itself on, letter by letter; the rule extends; the fill floods in
     1.30–1.55 hold
     1.55–2.55 the reel whips up through the gate, decelerates hard, locks on the lead frame
     1.65–2.45 the name shrinks and travels to the header's corner
     2.40–3.25 the title rises from its mask, the slates tick in, the actions arrive
     The real page is underneath from the first frame; only wrappers move (transform, opacity,
     clip-path; the stroke draw is the one stroke-dashoffset). At the end every animation is
     cancelled in the same frame the pre-state class is removed. */
  var intro = function () {
    if (!root.classList.contains('intro')) return false;
    root.classList.add('intro-run');
    var anims = [], ended = false;
    var done = function () {
      if (ended) return; ended = true;
      root.classList.remove('intro', 'intro-run');
      anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
      var w = q('.hd .wm-s'); if (w) w.style.removeProperty('--wm-sw');
      ['wheel', 'touchmove', 'pointerdown', 'keydown'].forEach(function (t) { window.removeEventListener(t, skip, true); });
      Reel.start();
    };
    var skip = function (e) {
      if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
      anims.forEach(function (a) { try { a.finish(); } catch (er) {} });
      done();
    };
    try {
      var A = function (el, kf, o) { if (!el || !el.animate) return null; var a = el.animate(kf, Object.assign({ fill: 'both' }, o)); anims.push(a); return a; };
      var vw = window.innerWidth, vh = (window.visualViewport ? window.visualViewport.height : window.innerHeight);
      var hero = q('.hr'), op = q('.op'), gate = q('.op-gate'), st = q('.op-st'), strip = q('.op-strip');
      var wm = q('.hd .wm'), rule = q('.op-rule'), line = q('.op-line');
      var heroH = hero ? hero.getBoundingClientRect().height : vh;

      /* load the passing frames now (the lock frame is the preloaded lead photograph) */
      $$('img[data-src]', strip).forEach(function (im) {
        if (im.getAttribute('data-srcset')) im.srcset = im.getAttribute('data-srcset');
        im.src = im.getAttribute('data-src');
      });

      /* --- the name: the header's own wordmark, scaled up to the centre (FLIP) --- */
      var r = wm.getBoundingClientRect();
      var targetW = Math.min(vw * (vw < 600 ? 0.84 : 0.62), 820);
      var s0 = targetW / r.width;
      var cy = Math.min(vh, heroH) * (vw < 600 ? 0.44 : 0.46);
      var cx = vw / 2;
      var tx = cx - targetW / 2 - r.left, ty = cy - (r.height * s0) / 2 - r.top;
      var from = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + s0.toFixed(4) + ')';
      var vbW = 6215;
      var sw = q('.wm-s', wm); if (sw) sw.style.setProperty('--wm-sw', (1.15 * vbW / targetW).toFixed(2) + 'px');
      op.style.setProperty('--ry', (cy + (r.height * s0) / 2 + Math.max(12, targetW * 0.035)).toFixed(1) + 'px');
      op.style.setProperty('--rw', targetW.toFixed(1) + 'px');

      var glide = 'cubic-bezier(.7,0,.18,1)', out = 'cubic-bezier(.22,.8,.24,1)';
      A(wm, [{ transform: from, easing: 'linear' }, { transform: from, offset: 1650 / 2450, easing: glide }, { transform: 'none' }], { duration: 2450 });

      /* --- the draw: each glyph's contours stroke on, left to right; the fill floods in behind --- */
      var groups = $$('.wm-sg', wm), fills = $$('.wm-g', wm);
      var nG = groups.length;
      groups.forEach(function (g, k) {
        var t0 = 100 + k * (620 / Math.max(1, nG - 1));
        $$('path', g).forEach(function (p) {
          A(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 560, delay: t0, easing: 'cubic-bezier(.45,.05,.3,1)' });
        });
        A(fills[k], [{ opacity: 0 }, { opacity: 1 }], { duration: 480, delay: t0 + 300, easing: 'cubic-bezier(.4,0,.2,1)' });
      });
      /* the rule opens beneath the name as it draws, then leaves with the slate */
      A(rule, [{ clipPath: 'inset(0 calc(50% - 3px))', opacity: 1, offset: 0 }, { clipPath: 'inset(0 calc(50% - 3px))', opacity: 1, offset: 100 / 1750 }, { clipPath: 'inset(0 0%)', opacity: 1, offset: 1250 / 1750, easing: 'ease-in' }, { clipPath: 'inset(0 0%)', opacity: 1, offset: 1480 / 1750 }, { clipPath: 'inset(0 0%)', opacity: 0 }], { duration: 1750, easing: 'cubic-bezier(.45,.05,.3,1)' });
      A(line, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 0, transform: 'translateY(6px)', offset: 650 / 1750 }, { opacity: 1, transform: 'none', offset: 1150 / 1750 }, { opacity: 1, transform: 'none', offset: 1480 / 1750 }, { opacity: 0, transform: 'translateY(-4px)' }], { duration: 1750, easing: 'ease-out' });

      /* --- the reel: a strip of portraits whips up through the gate and locks --- */
      var H = gate.getBoundingClientRect().height || heroH;
      var LOCK = 6, y0 = 0.35 * H, y1 = -LOCK * H, over = Math.max(6, H * 0.016);
      A(gate, [{ opacity: 0 }, { opacity: 1 }], { duration: 140, delay: 1550, easing: 'linear' });
      A(strip, [
        { transform: 'translate3d(0,' + y0.toFixed(1) + 'px,0)', easing: 'cubic-bezier(.1,.62,.16,1)' },
        { transform: 'translate3d(0,' + (y1 - over).toFixed(1) + 'px,0)', offset: 0.86, easing: 'cubic-bezier(.4,0,.3,1)' },
        { transform: 'translate3d(0,' + y1.toFixed(1) + 'px,0)' },
      ], { duration: 1000, delay: 1550 });
      A(st, [{ transform: 'scaleY(1.07)' }, { transform: 'scaleY(1.03)', offset: 0.3 }, { transform: 'scaleY(1)', offset: 0.7 }, { transform: 'scaleY(1)' }], { duration: 1000, delay: 1550, easing: 'ease-out' });

      /* --- the site arrives around the settled frame --- */
      var hdItems = $$('.hd-nav, .hd-cta, .hd-menu');
      hdItems.forEach(function (el, k) { A(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 2350 + k * 60, easing: out }); });
      var place = q('.hr-place'), meta = q('.hr-meta'), lines = $$('.hr-l'), hl = q('.hr-line'), acts = q('.hr-acts');
      A(place, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 2420, easing: out });
      A(meta, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 2450, easing: out });
      lines.forEach(function (l, k) {
        A(l, [{ clipPath: 'inset(0 0 100% 0)', transform: 'translateY(.42em)' }, { clipPath: 'inset(-25% -6% -30% -6%)', transform: 'none' }], { duration: 900, delay: 2420 + k * 110, easing: 'cubic-bezier(.2,.75,.2,1)' });
      });
      A(hl, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 650, delay: 2650, easing: out });
      A(acts, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 2700, easing: out });

      Promise.all(anims.map(function (a) { return a.finished; })).then(done, done);
      ['wheel', 'touchmove', 'pointerdown', 'keydown'].forEach(function (t) { window.addEventListener(t, skip, { capture: true, passive: true }); });
      window.addEventListener('pagehide', done, { once: true });
      doc.addEventListener('noir:menu', skip);
      /* belt and braces: never stay in the opening */
      setTimeout(done, 4200);
    } catch (e) { done(); }
    return true;
  };
  if (!intro()) Reel.start();

  /* ===================== scenes: one rAF loop, transforms only =====================
     Each scene after the first is a window (.scn) that rises from the bottom edge while its
     contents (.scn-in) counter-move to stay almost still: the new frame wipes up over the old
     one like film through a gate. The outgoing frame drifts up a little as it is covered, the
     incoming one settles a little as it arrives; a champagne hairline rides the cut. No frame
     is ever drawn at partial opacity. Scroll is mapped to f in [0, N-1+END]: each cut takes
     CUT of a scene's scroll, then the frame holds while its slow push-in continues. */
  var sc = q('[data-scenes]');
  var sticky = sc && !reduced && root.classList.contains('js');
  if (sticky) {
    var stage = q('.sc-stage', sc), scn = $$('.scn', sc), N = scn.length;
    var inner = scn.map(function (s) { return q('.scn-in', s); });
    var ims = scn.map(function (s) { return q('.scn-im', s); });
    var edges = scn.map(function (s) { return q('.scn-edge', s); });
    var prog = q('.sc-prog i', sc), num = q('.sc-n b', sc);
    var CUT = 0.6, LEAD = 0.18, END = 0.35, SETTLE = 12, DRIFT = 9;
    var active = 0, ticking = false, last = -1, vis = [];
    var ease = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(2 - 2 * x, 3) / 2; };
    var wipe = function (f, k) { return k === 0 ? 1 : ease(clamp((f - (k - 1) - LEAD) / CUT, 0, 1)); };
    var frame = function () {
      ticking = false;
      var r = sc.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < -50 || r.top > vh + 50) return;
      var total = Math.max(1, sc.offsetHeight - stage.offsetHeight);
      var p = clamp(-r.top / total, 0, 1);
      if (Math.abs(p - last) < 0.0002) return;
      last = p;
      var f = p * (N - 1 + END);
      var a = 0;
      for (var k = 0; k < N; k++) {
        var w = wipe(f, k), wn = k + 1 < N ? wipe(f, k + 1) : 0;
        var show = w > 0 && wn < 1;
        if (show !== vis[k]) { scn[k].style.visibility = show ? 'visible' : 'hidden'; vis[k] = show; }
        if (w >= 0.5) a = k;
        if (k > 0) scn[k].classList.toggle('on', w >= 0.4);
        if (!show) continue;
        /* the window rises; its contents counter-move (settling SETTLE% as they arrive) and
           drift up DRIFT% while the next frame covers them */
        if (k > 0) scn[k].style.transform = w >= 1 ? 'none' : 'translate3d(0,' + ((1 - w) * 100).toFixed(3) + '%,0)';
        var iy = (k > 0 ? (w - 1) * (100 - SETTLE) : 0) - wn * DRIFT;
        inner[k].style.transform = Math.abs(iy) < 0.001 ? 'none' : 'translate3d(0,' + iy.toFixed(3) + '%,0)';
        if (edges[k]) edges[k].style.opacity = (w > 0 && w < 1 ? Math.min(1, Math.min(w, 1 - w) * 8) * 0.75 : 0).toFixed(3);
        /* a slow push-in across the frame's whole life on screen */
        var lp = clamp((f - (k - 1) - LEAD) / (1 + CUT), 0, 1);
        ims[k].style.transform = 'scale(' + (1 + 0.07 * lp).toFixed(4) + ')';
      }
      if (prog) prog.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      if (a !== active) {
        active = a;
        if (num) num.textContent = (a + 1 < 10 ? '0' : '') + (a + 1);
      }
    };
    var req = function () { if (!ticking) { ticking = true; raf(frame); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', function () { last = -1; req(); }, { passive: true });
    frame();
  }

  /* ===================== the strip: swipe (native), drag with a mouse, arrows, keys ===================== */
  var vp = q('[data-strip]');
  if (vp) {
    var track = q('.strip-track', vp), ctl = q('[data-strip-ctl]');
    var btns = ctl ? $$('button', ctl) : [];
    var step = function () { var it = q('.strip-it', track); if (!it) return vp.clientWidth * 0.8; var g = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16; return it.getBoundingClientRect().width + g; };
    var upd = function () {
      var max = vp.scrollWidth - vp.clientWidth - 2;
      if (btns[0]) btns[0].disabled = vp.scrollLeft <= 2;
      if (btns[1]) btns[1].disabled = vp.scrollLeft >= max;
    };
    if (ctl) {
      ctl.hidden = false;
      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          var dir = parseFloat(b.getAttribute('data-dir')) || 1;
          var n = Math.max(1, Math.floor(vp.clientWidth / step()) - 1);
          vp.scrollBy({ left: dir * step() * n, behavior: reduced ? 'auto' : 'smooth' });
        });
      });
    }
    var sTick = false;
    vp.addEventListener('scroll', function () { if (!sTick) { sTick = true; raf(function () { sTick = false; upd(); }); } }, { passive: true });
    window.addEventListener('resize', upd, { passive: true });
    upd();
    /* mouse drag (touch uses native scrolling, which already feels right) */
    var drag = null;
    vp.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, s: vp.scrollLeft, moved: false, id: e.pointerId };
    });
    vp.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5) { drag.moved = true; vp.classList.add('drag'); try { vp.setPointerCapture(drag.id); } catch (er) {} }
      if (drag.moved) vp.scrollLeft = drag.s - dx;
    });
    var end = function (e) {
      if (!drag) return;
      var moved = drag.moved;
      try { vp.releasePointerCapture(drag.id); } catch (er) {}
      drag = null;
      if (moved) {
        /* release into the nearest look: snapping resumes from where the drag left it */
        var keep = vp.scrollLeft;
        vp.classList.remove('drag');
        vp.scrollLeft = keep;
        var st = step(), target = Math.round(keep / st) * st;
        vp.scrollTo({ left: target, behavior: reduced ? 'auto' : 'smooth' });
        var stop = function (ev) { ev.preventDefault(); ev.stopPropagation(); vp.removeEventListener('click', stop, true); };
        vp.addEventListener('click', stop, true);
        setTimeout(function () { vp.removeEventListener('click', stop, true); }, 50);
      }
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }
})();
