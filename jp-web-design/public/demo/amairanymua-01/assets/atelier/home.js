/* /demo/amairanymua-01 — ATELIER home runtime: "The magic in motion" (the row of her clips under
   the hero). Plain ES2017, one IIFE, no dependencies, no network.

   The opening itself needs no script: it is CSS animations gated by the inline script in home.mjs,
   which also ends it. This file only:
     · holds the row's clips until the page has loaded and the opening has finished, so the first
       screen spends its bandwidth on the portrait and the stills (site.js then loads and plays them
       near the viewport, at most three at once, never under reduced motion or Save-Data);
     · reveals a clip over its photograph only once it is actually playing (the photograph IS the
       card: if a clip never plays, nothing changes);
     · wires the row's pause, previous and next buttons. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, win = window;
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var track = doc.getElementById('mvTrack');
  if (!track) return;
  var reduced = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var vids = $$('video[data-mv]', track);
  var sync = function () { if (win.Atelier && win.Atelier.syncFilms) win.Atelier.syncFilms(); };

  /* a clip shows only while it really plays; any failure leaves the photograph */
  vids.forEach(function (v) {
    var m = v.parentNode;
    v.addEventListener('playing', function () { m.classList.add('is-live'); });
    v.addEventListener('error', function () { m.classList.remove('is-live'); }, true);
    v.addEventListener('emptied', function () { m.classList.remove('is-live'); });
  });

  var canPlay = vids.length && !reduced && !saveData;
  var userPaused = false, gated = !!canPlay;
  var hold = function () {
    vids.forEach(function (v) { if (gated || userPaused) v.setAttribute('data-held', ''); else v.removeAttribute('data-held'); });
    sync();
  };
  if (canPlay) {
    hold();
    var release = function () { if (!gated) return; gated = false; hold(); };
    var whenLoaded = function () {
      /* wait for the opening to hand over (the gate removes html.intro), then a beat */
      var check = function () { if (root.classList.contains('intro')) { setTimeout(check, 250); return; } setTimeout(release, 400); };
      check();
    };
    if (doc.readyState === 'complete') whenLoaded(); else win.addEventListener('load', whenLoaded);
    setTimeout(release, 8000);   /* a last guard: a slow page still gets its film */
  }

  /* pause: holds every clip in the row (they rest on the frame they reached) */
  var btn = doc.querySelector('[data-mv-toggle]');
  if (btn && canPlay) {
    var face = function () {
      btn.classList.toggle('is-paused', userPaused);
      var t = btn.querySelector('.pause-t'); if (t) t.textContent = userPaused ? 'Play' : 'Pause';
      btn.setAttribute('aria-label', (userPaused ? 'Play' : 'Pause') + ' the clips');
      btn.setAttribute('aria-pressed', String(userPaused));
    };
    btn.hidden = false; face();
    btn.addEventListener('click', function () {
      userPaused = !userPaused; face();
      if (userPaused) vids.forEach(function (v) { if (!v.paused) v.pause(); });
      if (!userPaused) gated = false;
      hold();
    });
  }

  /* previous / next: one card at a time; shown only when the row overflows */
  var prev = doc.querySelector('[data-mv-prev]'), next = doc.querySelector('[data-mv-next]');
  var items = $$('.mv-it', track);
  var stepW = function () { return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth; };
  var go = function (dir) {
    var max = track.scrollWidth - track.clientWidth;
    var x = track.scrollLeft + dir * stepW();
    if (dir > 0 && track.scrollLeft >= max - 4) x = 0;
    else if (dir < 0 && track.scrollLeft <= 4) x = max;
    track.scrollTo({ left: x, behavior: reduced ? 'auto' : 'smooth' });
  };
  var fit = function () {
    var over = track.scrollWidth > track.clientWidth + 4;
    if (prev) prev.hidden = !over;
    if (next) next.hidden = !over;
  };
  if (prev) prev.addEventListener('click', function () { go(-1); });
  if (next) next.addEventListener('click', function () { go(1); });
  fit();
  win.addEventListener('resize', fit, { passive: true });
  win.addEventListener('load', fit);
})();
