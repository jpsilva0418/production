/* /demo/amairanymua-01 — the home page's own runtime, ported from the Sass by Kass Home
   component:
     · the thin progress bar (phones and tablets);
     · [data-pin] sections (the hero) get `is-covered` once the next section's top reaches
       the top of the screen, and any film playing inside a covered pin rests;
     · [data-curve] chapter cards ease their top curve (--cv) from deep to flat as they rise;
     · the portfolio selection: prev / next / dots over a native scroll-snap track.
   No dependencies, no network. Everything here is an enhancement: without it the page is
   complete, the track still swipes, and the dots and arrows are not shown (home.css). */
(function () {
  'use strict';
  var doc = document;
  var win = window;
  var reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = win.matchMedia('(max-width:640px)');
  var all = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var pins = all('[data-pin]');
  var curves = all('[data-curve]');
  var prog = doc.getElementById('c7Prog');
  var after = function (el) {
    var n = el.nextElementSibling;
    while (n && (n.tagName === 'SCRIPT' || n.tagName === 'STYLE')) n = n.nextElementSibling;
    return n;
  };

  var ticking = false;
  var frame = function () {
    ticking = false;
    var y = win.scrollY, vh = win.innerHeight;
    if (prog) {
      var max = doc.documentElement.scrollHeight - vh;
      prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
    /* under reduced motion the hero is not pinned and the curves keep their resting depth */
    if (reduced) return;
    pins.forEach(function (pin) {
      var next = after(pin);
      var covered = !!next && next.getBoundingClientRect().top <= 0;
      if (pin.classList.contains('is-covered') === covered) return;
      pin.classList.toggle('is-covered', covered);
      /* a covered pin is still "on screen" to an IntersectionObserver, so its films are
         rested here. Only the ones that were playing are resumed when it is uncovered:
         which film plays is the hero's decision, never this file's. */
      all('video', pin).forEach(function (v) {
        if (covered) {
          if (!v.paused) { v.pause(); v.setAttribute('data-c7-rest', ''); }
        } else if (v.hasAttribute('data-c7-rest')) {
          v.removeAttribute('data-c7-rest');
          if (v.currentSrc) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        }
      });
    });
    var deep = small.matches ? 34 : 70, flat = small.matches ? 16 : 26;
    curves.forEach(function (c) {
      var t = c.getBoundingClientRect().top;
      if (t > vh + 80 || t < -vh) return;
      var p = Math.min(1, Math.max(0, 1 - t / vh));
      c.style.setProperty('--cv', (deep - (deep - flat) * p).toFixed(1) + 'px');
    });
  };
  win.addEventListener('scroll', function () { if (!ticking) { ticking = true; win.requestAnimationFrame(frame); } }, { passive: true });
  win.addEventListener('resize', frame);
  frame();

  /* the portfolio selection (phones and tablets): prev / next / dots over a native scroll-snap track */
  var trk = doc.getElementById('c7Trk');
  if (trk) {
    var panels = Array.prototype.slice.call(trk.children);
    var dots = all('.c7-dot');
    var prev = doc.getElementById('c7Prev');
    var next = doc.getElementById('c7Next');
    var pad = function () { return parseFloat(win.getComputedStyle(trk).paddingLeft) || 0; };
    var cur = 0;
    var paint = function () {
      dots.forEach(function (d, i) { if (i === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      if (prev) prev.disabled = cur === 0;
      if (next) next.disabled = cur === panels.length - 1;
    };
    var go = function (n) {
      if (!panels.length) return;
      cur = Math.max(0, Math.min(panels.length - 1, n));
      /* measured from the track itself, so it holds whatever the track's offset parent is */
      var left = panels[cur].getBoundingClientRect().left - trk.getBoundingClientRect().left + trk.scrollLeft - pad();
      if (trk.scrollTo) trk.scrollTo({ left: left, behavior: reduced ? 'auto' : 'smooth' }); else trk.scrollLeft = left;
      paint();
    };
    if (prev) prev.addEventListener('click', function () { go(cur - 1); });
    if (next) next.addEventListener('click', function () { go(cur + 1); });
    dots.forEach(function (d) { d.addEventListener('click', function () { go(parseInt(d.getAttribute('data-go') || '0', 10)); }); });
    var t;
    trk.addEventListener('scroll', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var edge = trk.getBoundingClientRect().left + pad();
        var best = 0, dist = Infinity;
        panels.forEach(function (p, i) { var d = Math.abs(p.getBoundingClientRect().left - edge); if (d < dist) { dist = d; best = i; } });
        if (best !== cur) { cur = best; paint(); }
      }, 80);
    }, { passive: true });
    /* a tab stop only while the track really scrolls (it is a plain grid on wide screens) */
    var wide = win.matchMedia('(min-width:900px)');
    var setTab = function () { if (wide.matches) trk.removeAttribute('tabindex'); else trk.tabIndex = 0; };
    if (wide.addEventListener) wide.addEventListener('change', setTab); else if (wide.addListener) wide.addListener(setTab);
    setTab();
    paint();
  }
})();
