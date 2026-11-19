/* /demo/amairanymua-01 — The Edit: the home page runtime.
   1 the opening: three swatches are painted on, her name stamps onto them, the peach swatch
     floods the screen and becomes the hero's ground while the wordmark travels to the header;
   2 the story: her looks as a tap-through story (tap right / left, hold to pause, swipe,
     arrow keys, real buttons), resting off screen and when the tab is hidden;
   3 the palette: six pans as a tablist; each opens its look.
   Everything here is an enhancement: without it the page is complete and still. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var noop = function () {};

  /* ================================================================ 2 the story */
  var story = (function () {
    var st = $('[data-story]');
    if (!st) return { start: noop };
    var frames = $$('.st-f', st), fills = $$('.st-bar i', st), bars = $$('.st-bar', st);
    var lbl = $('.st-lbl', st), pauseBtn = $('.st-pause', st), status = $('[data-story-status]', st);
    var n = frames.length, i = 0, prog = 0, raf = 0, last = 0;
    var started = false, paused = false, held = false, visible = true;
    var auto = !(reduced || saveData);
    var DUR = 3200;
    if (!n) return { start: noop };
    if (!auto && pauseBtn) pauseBtn.hidden = true;

    var load = function (k) {
      var img = $('img[data-src]', frames[(k + n) % n]);
      if (!img) return;
      if (img.getAttribute('data-srcset')) img.srcset = img.getAttribute('data-srcset');
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src'); img.removeAttribute('data-srcset');
    };
    var videoOf = function (k) { return $('video[data-film]', frames[k]); };
    var playVideo = function (v) {
      if (!v || !auto) return;
      if (!v.getAttribute('data-ready')) { $$('source', v).forEach(function (s) { if (s.getAttribute('data-src')) s.src = s.getAttribute('data-src'); }); v.load(); v.setAttribute('data-ready', '1'); }
      try { v.currentTime = 0; } catch (e) { /* not seekable yet */ }
      var p = v.play(); if (p && p.catch) p.catch(noop);
    };
    var dur = function () {
      var v = videoOf(i);
      return v && isFinite(v.duration) && v.duration > 0.5 ? v.duration * 1000 : DUR;
    };
    var paint = function () {
      for (var j = 0; j < n; j++) {
        bars[j].classList.toggle('done', j < i || (j === i && !auto));
        fills[j].style.transform = j === i && auto ? 'scaleX(' + prog.toFixed(4) + ')' : '';
      }
    };
    var show = function (k, user) {
      k = (k + n) % n;
      var old = frames[i], ov = videoOf(i);
      if (ov) ov.pause();
      old.classList.remove('on', 'enter'); old.setAttribute('aria-hidden', 'true');
      i = k; prog = 0;
      var f = frames[i];
      load(i);
      f.classList.add('on'); f.removeAttribute('aria-hidden');
      if (!reduced) { f.classList.remove('enter'); void f.offsetWidth; f.classList.add('enter'); }
      if (lbl) lbl.textContent = f.getAttribute('data-label') || '';
      if (user && status) status.textContent = 'Look ' + (i + 1) + ' of ' + n + ': ' + (f.getAttribute('data-label') || '');
      playVideo(videoOf(i));
      load(i + 1);
      paint();
      last = 0;
      kick();
    };
    var running = function () { return started && auto && !paused && !held && visible && !doc.hidden; };
    var loop = function (ts) {
      raf = 0;
      if (!running()) { last = 0; return; }
      var dt = last ? Math.min(ts - last, 100) : 16;
      last = ts;
      prog += dt / dur();
      if (prog >= 1) { show(i + 1); return; }
      fills[i].style.transform = 'scaleX(' + prog.toFixed(4) + ')';
      raf = requestAnimationFrame(loop);
    };
    var kick = function () { if (!raf && running()) { last = 0; raf = requestAnimationFrame(loop); } };
    var setVideo = function () { var v = videoOf(i); if (!v) return; if (running()) { var p = v.play(); if (p && p.catch) p.catch(noop); } else v.pause(); };

    frames.forEach(function (f, k) { if (k) f.setAttribute('aria-hidden', 'true'); });
    frames[0].classList.add('on');
    paint();

    /* buttons: keyboard and assistive tech use these directly */
    var suppress = false;
    $$('.st-tap', st).forEach(function (b) {
      b.addEventListener('click', function (e) {
        if (suppress) { suppress = false; e.preventDefault(); return; }
        show(i + (b.classList.contains('st-prev') ? -1 : 1), true);
      });
    });
    if (pauseBtn) pauseBtn.addEventListener('click', function () {
      paused = !paused;
      pauseBtn.setAttribute('aria-pressed', String(paused));
      setVideo(); kick();
    });
    st.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'Right') { e.preventDefault(); show(i + 1, true); }
      else if (e.key === 'ArrowLeft' || e.key === 'Left') { e.preventDefault(); show(i - 1, true); }
    });

    /* touch and mouse: a tap barely moves; a hold pauses; a sideways swipe steps; a vertical
       swipe is the page scrolling (touch-action: pan-y hands it to the browser) */
    var track = false, sx = 0, sy = 0, moved = false, holdT = 0;
    var release = function () {
      clearTimeout(holdT);
      if (held) { held = false; st.classList.remove('held'); setVideo(); kick(); }
    };
    st.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || !e.target.closest || !e.target.closest('.st-tap')) return;
      track = true; moved = false; sx = e.clientX; sy = e.clientY;
      clearTimeout(holdT);
      holdT = setTimeout(function () { if (track && !moved) { held = true; st.classList.add('held'); setVideo(); } }, 260);
    });
    st.addEventListener('pointermove', function (e) {
      if (!track) return;
      if (Math.abs(e.clientX - sx) > 10 || Math.abs(e.clientY - sy) > 10) { moved = true; clearTimeout(holdT); }
    }, { passive: true });
    st.addEventListener('pointerup', function (e) {
      if (!track) return;
      track = false;
      var dx = e.clientX - sx, dy = e.clientY - sy, wasHeld = held;
      release();
      if (wasHeld) { suppress = true; setTimeout(function () { suppress = false; }, 400); return; }
      if (moved) {
        suppress = true; setTimeout(function () { suppress = false; }, 400);
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) show(i + (dx < 0 ? 1 : -1), true);
      }
    });
    st.addEventListener('pointercancel', function () { track = false; release(); });
    st.addEventListener('contextmenu', function (e) { if (e.target.closest && e.target.closest('.st-tap')) e.preventDefault(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; setVideo(); kick(); }, { threshold: 0.25 }).observe(st);
    }
    doc.addEventListener('visibilitychange', function () { setVideo(); kick(); });

    return {
      start: function () {
        if (started) return;
        started = true; last = 0;
        load(1);
        playVideo(videoOf(i));
        kick();
      },
    };
  })();

  /* ================================================================ 1 the opening */
  (function () {
    var op = doc.getElementById('op');
    var canAnimate = typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
    if (!root.classList.contains('intro') || !op || !canAnimate) {
      root.classList.remove('intro');
      if (op && op.parentNode) op.parentNode.removeChild(op);
      story.start();
      return;
    }
    window.__editIntro = true;

    var anims = [], timers = [], done = false;
    var A = function (el, kf, o) {
      if (!el) return null;
      o.fill = o.fill || 'both';
      var a = el.animate(kf, o);
      anims.push(a);
      return a;
    };
    var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
    var vw = window.innerWidth, vh = window.innerHeight;

    var finish = function () {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      ['wheel', 'touchmove', 'pointerdown', 'keydown'].forEach(function (t) { window.removeEventListener(t, onInput, true); });
      /* one frame: every animation cancelled and the pre-state gone, so the page rests on its
         plain static styles (nothing left holding a fill) */
      anims.forEach(function (a) { try { a.cancel(); } catch (e) { /* already gone */ } });
      root.classList.remove('intro');
      if (op.parentNode) op.parentNode.removeChild(op);
      story.start();
    };
    var onInput = function (e) {
      if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift' || e.key === 'Meta' || e.key === 'Alt' || e.key === 'Control')) return;
      finish();
    };
    ['wheel', 'touchmove', 'pointerdown', 'keydown'].forEach(function (t) { window.addEventListener(t, onInput, { capture: true, passive: true }); });

    var sw = $$('.op-sw', op), bg = $('.op-bg', op), sws = $('.op-sws', op);
    var wmBox = $('.op-wm', op), wm = $('.wm--op', op), wmC = $('.wm-c', op);
    var hdWm = $('.hd-logo .wm');
    var hand = 'cubic-bezier(.32,.72,.24,1)';
    var base = ['translateX(-5%) rotate(-7deg)', 'translateX(3%) rotate(3.5deg)', 'translateX(-2%) rotate(-2deg)'];
    var from = ['translateX(-9%) rotate(-7deg)', 'translateX(-1%) rotate(3.5deg)', 'translateX(-6%) rotate(-2deg)'];

    /* 0.10–1.10 s: three swatches painted on, one after another */
    var paintAt = function (x) { return 'polygon(-6% -10%,' + (x - 4) + '% -10%,' + (x - 0.5) + '% 18%,' + (x + 1.5) + '% 50%,' + (x - 0.5) + '% 82%,' + (x - 4) + '% 110%,-6% 110%)'; };
    sw.forEach(function (s, k) {
      A(s, [{ clipPath: paintAt(-4), transform: from[k] }, { clipPath: paintAt(112), transform: base[k] }], { duration: 400, delay: 100 + k * 300, easing: hand });
    });
    /* 0.95–1.45 s: the wordmark stamps on */
    A(wmBox, [{ opacity: 0 }, { opacity: 1 }], { duration: 120, delay: 950, easing: 'linear' });
    A(wm, [{ transform: 'scale(1.07)' }, { transform: 'scale(1)' }], { duration: 360, delay: 950, easing: 'cubic-bezier(.2,.9,.25,1)' });
    A(wmC, [{ opacity: 0, transform: 'translate3d(-.3em,0,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }], { duration: 420, delay: 1150, easing: 'cubic-bezier(.22,.9,.3,1)' });

    /* 1.68–2.24 s: the peach stroke floods: it swells across the screen while a flat peach
       field (a plain colour layer, free to draw at any size) rises under it and fills whatever
       the streaks leave open; the other two strokes are swept away; the wordmark travels home.
       The stroke's swell is capped at 4x. (An earlier cut scaled the masked stroke up to ~15x
       on phones, which made the browser raster a texture that big as the flood began: about
       twice the raster work during the hand-off, measured under a 4x CPU throttle.) */
    var flood = $('.op-flood', op);
    var r3 = sw[2].getBoundingClientRect();
    var grow = Math.min(4, Math.max(2.4, 1.25 * vh / Math.max(r3.height, 1), 1.5 * vw / Math.max(r3.width, 1)));
    A(sw[2], [{ transform: base[2] }, { transform: 'translateX(-2%) rotate(-1deg) scale(' + grow.toFixed(2) + ')' }], { duration: 560, delay: 1680, easing: 'cubic-bezier(.62,0,.22,1)', fill: 'forwards' });
    A(flood, [{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: 1800, easing: 'cubic-bezier(.45,0,.55,1)' });
    /* the bronze and deep strokes are swept off to the right (transform + opacity only: a
       clip-path wipe re-rasters a masked layer on every frame) */
    [0, 1].forEach(function (j) {
      A(sw[j], [{ transform: base[j], opacity: 1 }, { opacity: 1, offset: 0.3 }, { transform: base[j].replace(/translateX\([^)]*\)/, 'translateX(' + (j ? 34 : 28) + '%)'), opacity: 0 }], { duration: 440, delay: 1680 + j * 50, easing: 'cubic-bezier(.55,0,.6,1)', fill: 'forwards' });
    });
    /* 2.20 s: the screen is all peach, and so is the hero underneath: the overlay's fields go in
       one frame, so the story rises on the real hero ground with no veil across it */
    [bg, flood, sws].forEach(function (el) { A(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 1, delay: 2240, fill: 'forwards' }); });
    if (hdWm && wm) {
      var a = wmBox.getBoundingClientRect(), b = hdWm.getBoundingClientRect();
      if (a.width > 0 && b.width > 0) {
        var k = b.width / a.width;
        var t = 'translate3d(' + (b.left - a.left).toFixed(1) + 'px,' + (b.top - a.top).toFixed(1) + 'px,0) scale(' + k.toFixed(4) + ')';
        A(wmBox, [{ transform: 'translate3d(0,0,0) scale(1)' }, { transform: t }], { duration: 600, delay: 1760, easing: 'cubic-bezier(.62,0,.18,1)', fill: 'forwards' });
      }
    }

    /* 2.16–3.10 s: the story rises behind the departing wordmark (its chips arrive last, once
       the wordmark has cleared them), and the headline steps in */
    /* where the story sits beside the headline (wide screens, phones held sideways) it is clear
       of the wordmark's path and may rise sooner */
    var beside = vw >= 900 || (vw > vh && vh <= 620);
    var stAt = beside ? 1980 : 2100;
    A($('.hero-story'), [{ opacity: 0, transform: 'translate3d(0,56px,0) scale(.95)' }, { opacity: 1, offset: 0.4 }, { opacity: 1, transform: 'none' }], { duration: 820, delay: stAt, easing: 'cubic-bezier(.22,.9,.3,1)' });
    A($('.st-top'), [{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: stAt + 300, easing: 'linear' });
    A($('.st-bars'), [{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: stAt + 300, easing: 'linear' });
    A($('.hero-tag'), [{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: 2260, easing: 'cubic-bezier(.22,.9,.3,1)' });
    A($('.hero-kick'), [{ opacity: 0, transform: 'translate3d(0,10px,0)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 2260, easing: 'cubic-bezier(.22,.9,.3,1)' });
    $$('.hl-i').forEach(function (el, j) {
      A(el, [{ transform: 'translate3d(0,110%,0)' }, { transform: 'translate3d(0,0,0)' }], { duration: 640, delay: 2340 + j * 120, easing: 'cubic-bezier(.2,.85,.25,1)' });
    });
    A($('.hero-line'), [{ opacity: 0, transform: 'translate3d(0,12px,0)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 2560, easing: 'cubic-bezier(.22,.9,.3,1)' });
    A($('.hero-acts'), [{ opacity: 0, transform: 'translate3d(0,12px,0)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 2640, easing: 'cubic-bezier(.22,.9,.3,1)' });

    /* 2.6 s the first bar begins; 3.18 s everything rests. Both are tied to the animation
       timeline (not to timers), so the opening and its hand-off can never drift apart. */
    var cue = A(op, [{ opacity: 1 }, { opacity: 1 }], { duration: 2600, fill: 'none' });
    if (cue) cue.onfinish = function () { story.start(); };
    var end = A(op, [{ opacity: 1 }, { opacity: 1 }], { duration: 3180, fill: 'none' });
    if (end) end.onfinish = finish; else later(finish, 3180);
    later(finish, 12000); /* belt and braces: never stay in the opening */
  })();

  /* ================================================================ 3 the palette */
  (function () {
    var well = $('[data-pans]'), host = $('[data-looks]');
    if (!well || !host) return;
    var pans = $$('[data-pan]', well), panels = $$('[data-look]', host);
    if (!pans.length || pans.length !== panels.length) return;
    var cur = 0;
    well.setAttribute('role', 'tablist');
    well.setAttribute('aria-label', 'Choose a look');
    host.setAttribute('data-ready', '');
    pans.forEach(function (p, k) {
      p.setAttribute('role', 'tab');
      p.setAttribute('aria-controls', panels[k].id);
      p.removeAttribute('aria-current');
      panels[k].setAttribute('role', 'tabpanel');
      panels[k].setAttribute('aria-labelledby', p.id);
    });
    var select = function (k, how) {
      cur = (k + pans.length) % pans.length;
      pans.forEach(function (p, j) {
        var on = j === cur;
        p.setAttribute('aria-selected', String(on));
        p.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (!how) return;
      var panel = panels[cur], pan = pans[cur];
      if (!reduced) {
        panel.classList.remove('enter'); void panel.offsetWidth; panel.classList.add('enter');
        pan.classList.remove('glint'); void pan.offsetWidth; pan.classList.add('glint');
      }
      if (how === 'key') pan.focus();
      if (how === 'tap') {
        var r = panel.getBoundingClientRect();
        if (r.top > window.innerHeight * 0.82) window.scrollBy({ top: r.top - window.innerHeight * 0.4, behavior: reduced ? 'auto' : 'smooth' });
      }
    };
    pans.forEach(function (p, k) {
      p.addEventListener('click', function (e) { e.preventDefault(); select(k, 'tap'); });
    });
    well.addEventListener('keydown', function (e) {
      var key = e.key, k = -1;
      if (key === 'ArrowRight' || key === 'ArrowDown' || key === 'Right' || key === 'Down') k = cur + 1;
      else if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'Left' || key === 'Up') k = cur - 1;
      else if (key === 'Home') k = 0;
      else if (key === 'End') k = pans.length - 1;
      else if (key === ' ' || key === 'Spacebar') { e.preventDefault(); select(pans.indexOf(doc.activeElement) < 0 ? cur : pans.indexOf(doc.activeElement), 'key'); return; }
      if (k < 0) return;
      e.preventDefault();
      select(k, 'key');
    });
    select(0, null);
  })();
})();
