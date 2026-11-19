/* /demo/amairanymua-01 — NOIR shared runtime: menu, header, phone booking bar, reveals, lazy films.
   Plain ES2017, no dependencies, no network. Everything is an enhancement: without it the
   pages are complete (CSS hides nothing unless html.js is set, and html.js is removed after
   3.5 s if this file never ran). */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  window.__noir = true;
  var mq = function (q) { return window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener: function () {} }; };
  var reduced = mq('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  /* ---- full-screen menu: inert when closed, focus moved in and trapped, Escape closes,
          body pinned in place while open (iOS ignores overflow:hidden on body) ---- */
  var menu = $('menu'), openBtn = $('menuOpen'), closeBtn = $('menuClose');
  if (menu && openBtn && closeBtn) {
    var lockY = 0;
    var lock = function (on) {
      var b = doc.body.style;
      if (on) { lockY = window.scrollY || window.pageYOffset; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
      else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; window.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
    };
    var isOpen = function () { return menu.classList.contains('open'); };
    var setMenu = function (open, restoreFocus) {
      if (open === isOpen()) return;
      if (open) doc.dispatchEvent(new CustomEvent('noir:menu'));
      lock(open);
      menu.classList.toggle('open', open);
      doc.body.classList.toggle('menu-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      if (open) { menu.removeAttribute('inert'); menu.inert = false; } else { menu.setAttribute('inert', ''); menu.inert = true; }
      openBtn.setAttribute('aria-expanded', String(open));
      if (open) closeBtn.focus({ preventScroll: true }); else if (restoreFocus !== false) openBtn.focus({ preventScroll: true });
    };
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        if (a.pathname !== location.pathname && a.origin === location.origin) lockY = 0;
        setMenu(false, false);
      });
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted && isOpen()) setMenu(false, false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) setMenu(false); });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !isOpen()) return;
      var f = $$('a[href], button', menu).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- header: transparent over the opening frame, a blackout bar after; tucks away on the
          way down, returns on the way up; never hides a focused control ---- */
  var hd = $('siteHeader');
  var bar = $('bookBar');
  var heroEl = doc.querySelector('[data-hero]');
  var lastY = window.scrollY || 0, tick = false;
  var frame = function () {
    tick = false;
    var y = window.scrollY || window.pageYOffset || 0;
    var vh = window.innerHeight;
    if (hd) {
      var stuck = y > 40;
      hd.classList.toggle('hd--stuck', stuck);
      var dy = y - lastY;
      if (dy > 6 && y > vh * 0.9 && !hd.contains(doc.activeElement)) hd.classList.add('hd--hide');
      else if (dy < -6 || y < vh * 0.5) hd.classList.remove('hd--hide');
    }
    if (bar) {
      var past = heroEl ? heroEl.getBoundingClientRect().bottom < vh * 0.35 : y > vh * 0.6;
      var nearEnd = (doc.documentElement.scrollHeight - (y + vh)) < 40;
      var on = past && !nearEnd;
      if (on !== bar.classList.contains('on')) {
        bar.classList.toggle('on', on);
        root.classList.toggle('bar-on', on);
      }
    }
    lastY = y;
  };
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener('resize', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  if (hd) hd.addEventListener('focusin', function () { hd.classList.remove('hd--hide'); });
  frame();

  /* ---- stagger: data-stag=".08" gives each child an increasing --d ---- */
  $$('[data-stag]').forEach(function (s) {
    var step = parseFloat(s.getAttribute('data-stag')) || 0.08;
    Array.prototype.forEach.call(s.children, function (c, i) { c.style.setProperty('--d', (i * step).toFixed(2) + 's'); });
  });

  /* ---- reveals ---- */
  var toReveal = $$('.rv,.rv-fade,.rv-mask,.rv-line,.rv-im');
  var reveal = function (el) { el.classList.add('in'); };
  if (reduced || !hasIO) toReveal.forEach(reveal);
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
    toReveal.forEach(function (el) { io.observe(el); });
    /* a jump (anchor, restored scroll) must never leave something half-hidden on screen */
    window.addEventListener('load', function () {
      setTimeout(function () {
        toReveal.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) reveal(el); });
      }, 300);
    });
  }

  /* ---- lazy films: poster until near the viewport, paused off screen, never under reduced
          motion or Save-Data (the poster then stands still) ---- */
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  $$('video[data-film]').forEach(function (video) {
    if (reduced || saveData) { $$('source', video).forEach(function (s) { s.parentNode.removeChild(s); }); return; }
    if (!hasIO) return;
    var loaded = false;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          if (!loaded) { $$('source', video).forEach(function (s) { if (s.getAttribute('data-src')) s.src = s.getAttribute('data-src'); }); video.load(); loaded = true; }
          var p = video.play(); if (p && p.catch) p.catch(function () {});
        } else video.pause();
      });
    }, { rootMargin: '240px 0px' }).observe(video);
  });
  doc.addEventListener('visibilitychange', function () { if (doc.hidden) $$('video[data-film]').forEach(function (v) { v.pause(); }); });
})();
