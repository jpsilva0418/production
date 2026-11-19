/* /demo/amairanymua-01 — VEIL: the runtime every page shares.
   The tulle-curtain menu (focus moved in and trapped, Escape closes, inert when closed, the
   page pinned the iOS-safe way while it is open), the header that settles into a bar and
   tucks away on the way down, the phone booking bar, reveals (.rv, .rv-line, .rv-im, .fl),
   [data-stag] delays and lazy films. No dependencies, no network. Everything is an
   enhancement: without this file the pages are complete (html.js is removed after 3.5 s). */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  window.__veil = true;

  /* ---- the menu ---- */
  var menu = $('menu'), openBtn = $('menuOpen'), closeBtn = $('menuClose');
  if (menu && openBtn && closeBtn) {
    $$('.menu-list li', menu).forEach(function (li, i) { li.style.setProperty('--i', i); });
    var lockY = 0;
    var lock = function (on) {
      var b = doc.body.style;
      if (on) { lockY = window.scrollY || window.pageYOffset; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
      else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; window.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
    };
    var isOpen = function () { return menu.classList.contains('open'); };
    var setMenu = function (open, restoreFocus) {
      if (open === isOpen()) return;
      lock(open);
      menu.classList.toggle('open', open);
      doc.body.classList.toggle('menu-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
      openBtn.setAttribute('aria-expanded', String(open));
      if (open) closeBtn.focus({ preventScroll: true });
      else if (restoreFocus !== false) openBtn.focus({ preventScroll: true });
    };
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        if (a.pathname !== location.pathname || a.origin !== location.origin) lockY = 0;
        setMenu(false, false);
      });
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted && isOpen()) setMenu(false, false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) setMenu(false); });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !isOpen()) return;
      var f = $$('a[href], button', menu).filter(function (el) { return el.offsetParent !== null || el === closeBtn; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- header + phone booking bar (one scroll frame) ---- */
  var hd = $('siteHeader');
  var bar = $('bookBar');
  var barLinks = bar ? $$('a', bar) : [];
  var heroEl = doc.querySelector('[data-bar-after]');
  var lastY = window.scrollY || 0, tick = false, barOn = null;
  var setBar = function (on) {
    if (!bar || on === barOn) return;
    barOn = on;
    root.classList.toggle('bar-on', on);
    bar.setAttribute('aria-hidden', String(!on));
    barLinks.forEach(function (a) { if (on) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1'); });
  };
  var frame = function () {
    tick = false;
    var y = window.scrollY || window.pageYOffset;
    if (hd) {
      var stuck = y > 40;
      hd.classList.toggle('hd--stuck', stuck);
      if (y < lastY - 4 || y < 300) hd.classList.remove('hd--hide');
      else if (y > lastY + 6 && y > 500 && !hd.contains(doc.activeElement)) hd.classList.add('hd--hide');
    }
    if (bar) {
      var after = heroEl ? heroEl.offsetTop + heroEl.offsetHeight * 0.75 : window.innerHeight * 0.9;
      var nearEnd = y + window.innerHeight > doc.documentElement.scrollHeight - 40;
      setBar(y > after && !nearEnd);
    }
    lastY = y;
  };
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener('resize', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  if (hd) hd.addEventListener('focusin', function () { hd.classList.remove('hd--hide'); });
  frame();

  /* ---- stagger helper: data-stag=".1" gives each child its own --d ---- */
  $$('[data-stag]').forEach(function (s) {
    var step = parseFloat(s.getAttribute('data-stag')) || 0.08;
    Array.prototype.forEach.call(s.children, function (c, i) { c.style.setProperty('--d', (i * step).toFixed(2) + 's'); });
  });

  /* ---- reveals: .rv (rise), .rv-line (from behind a mask), .rv-im (the tulle slides off),
          .fl (one light crosses a foil word) ---- */
  var sel = '.rv,.rv-line,.rv-im,.fl';
  var all = $$(sel);
  var show = function (el) { el.classList.add('in'); };
  if (reduced || !hasIO) all.forEach(show);
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
    all.forEach(function (el) { if (!el.hasAttribute('data-hold')) io.observe(el); });
    /* a page restored or opened mid-way: anything already on screen is shown */
    window.addEventListener('load', function () {
      setTimeout(function () {
        all.forEach(function (el) { if (el.hasAttribute('data-hold')) return; var r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) show(el); });
      }, 300);
    });
    window.__veilReveal = function (ctx) { $$(sel, ctx).forEach(function (el) { el.removeAttribute('data-hold'); io.observe(el); }); };
  }

  /* ---- lazy films: poster until near the viewport, paused off screen, never under reduced
          motion or Save-Data (the poster then stands as a still) ---- */
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
