/* /demo/amairanymua-01 — ATELIER home runtime (round four). Plain ES2017, one IIFE, no dependencies,
   no network. The opening needs no script (CSS gated by the inline script in home.mjs). This file:
     · holds the page's clips until the page has loaded and the opening has handed over, so the first
       screen spends its bandwidth on the portrait and the stills (site.js then loads and plays them
       near the viewport, at most three at once, never under reduced motion or Save-Data);
     · shows a clip over its photograph only once it is actually playing (the photograph IS the card:
       a clip that never plays, as in the iPhone file viewer, changes nothing);
     · drives "The magic in motion": an endless glide, one transform on the track, that eases to a stop
       under a hovering pointer, a focused card or a finger (a finger can drag it), rests off screen and
       in a hidden tab, and never starts under reduced motion (the row is then a plain swipe row);
     · rests the Lookbook's drifting columns while they are off screen. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, win = window;
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduced = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var hasIO = 'IntersectionObserver' in win;
  var raf = win.requestAnimationFrame;
  var sync = function () { if (win.Atelier && win.Atelier.syncFilms) win.Atelier.syncFilms(); };

  /* ---- clips over stills ---- */
  var vids = $$('.clip > video[data-film]');
  vids.forEach(function (v) {
    var m = v.parentNode;
    v.addEventListener('playing', function () { m.classList.add('is-live'); });
    v.addEventListener('error', function () { m.classList.remove('is-live'); }, true);
    v.addEventListener('emptied', function () { m.classList.remove('is-live'); });
  });
  if (vids.length && !reduced && !saveData) {
    var gated = true;
    var hold = function () { vids.forEach(function (v) { if (gated) v.setAttribute('data-held', ''); else v.removeAttribute('data-held'); }); sync(); };
    hold();
    var release = function () { if (!gated) return; gated = false; hold(); };
    var whenLoaded = function () {
      var check = function () { if (root.classList.contains('intro')) { setTimeout(check, 250); return; } setTimeout(release, 300); };
      check();
    };
    if (doc.readyState === 'complete') whenLoaded(); else win.addEventListener('load', whenLoaded);
    setTimeout(release, 8000);   /* a last guard: a slow page still gets its film */
  }

  /* ---- the glide ---- */
  var gl = doc.querySelector('[data-glide]');
  var track = gl && gl.querySelector('[data-glide-track]');
  var sets = track ? $$('.gl-set', track) : [];
  if (gl && track && sets.length === 2 && !reduced && raf) {
    gl.classList.add('is-glide');
    var x = 0, v = 0, W = 0, last = 0, running = false;
    var visible = !hasIO, hovered = false, focused = false, touched = false, dragging = false, moved = false, lastX = 0, downX = 0, resumeT = 0;
    var speed = function () { return win.innerWidth >= 900 ? 40 : 30; };   /* px per second */
    var measure = function () { W = sets[1].offsetLeft - sets[0].offsetLeft; };
    var wrap = function () { if (W > 0) x = ((x % W) + W) % W; };
    var paint = function () { track.style.transform = 'translate3d(' + (-x).toFixed(2) + 'px,0,0)'; };
    var wants = function () { return visible && !doc.hidden && !hovered && !focused && !touched; };
    var frame = function (t) {
      var dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
      var target = wants() ? speed() : 0;
      v += (target - v) * Math.min(1, dt * 3.2);
      if (!dragging) x += v * dt;
      wrap(); paint();
      if (!wants() && v < 0.4 && !dragging) { v = 0; running = false; last = 0; return; }
      raf(frame);
    };
    var kick = function () { if (!running) { running = true; last = 0; raf(frame); } };
    measure(); paint();
    win.addEventListener('resize', function () { measure(); wrap(); paint(); }, { passive: true });
    win.addEventListener('load', function () { measure(); kick(); });
    if (hasIO) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) kick(); }, { threshold: 0 }).observe(gl);
    doc.addEventListener('visibilitychange', function () { if (!doc.hidden) kick(); });
    /* a pointer over the row holds it (mouse only: a touch is handled below) */
    gl.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hovered = true; });
    gl.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hovered = false; kick(); } });
    /* keyboard: a focused card holds the row and is brought fully into view */
    gl.addEventListener('focusin', function (e) {
      focused = true;
      var li = e.target.closest && e.target.closest('.gl-it');
      if (!li) return;
      var r = li.getBoundingClientRect(), g = gl.getBoundingClientRect(), pad = 18;
      if (r.left < g.left + pad || r.right > g.right - pad) { x += r.left - g.left - pad; wrap(); paint(); }
    });
    gl.addEventListener('focusout', function (e) { if (!gl.contains(e.relatedTarget)) { focused = false; kick(); } });
    /* a finger holds it, and can drag it sideways (vertical scrolling stays the page's: touch-action pan-y) */
    var letGo = function () {
      dragging = false; gl.classList.remove('is-drag');
      if (!touched) return;
      clearTimeout(resumeT);
      resumeT = setTimeout(function () { touched = false; kick(); }, 1600);
    };
    gl.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      clearTimeout(resumeT);
      if (e.pointerType !== 'mouse') touched = true;
      dragging = true; moved = false; downX = lastX = e.clientX;
      kick();
    });
    gl.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX;
      if (!moved && Math.abs(e.clientX - downX) > 8) { moved = true; touched = true; gl.classList.add('is-drag'); }
      if (moved) { x -= dx; wrap(); paint(); }
    });
    gl.addEventListener('pointerup', letGo);
    gl.addEventListener('pointercancel', letGo);
    gl.addEventListener('touchend', letGo, { passive: true });
    /* a drag is not a tap: it never opens the post */
    gl.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    gl.addEventListener('dragstart', function (e) { e.preventDefault(); });
    kick();
  }

  /* ---- the Lookbook: its columns rest off screen ---- */
  var lb = doc.getElementById('lookbook');
  if (lb && hasIO && !reduced) {
    lb.classList.add('is-off');
    new IntersectionObserver(function (es) { lb.classList.toggle('is-off', !es[0].isIntersecting); }, { threshold: 0 }).observe(lb);
  }
})();
