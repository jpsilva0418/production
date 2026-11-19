/* /demo/amairanymua-01 — The Edit: the runtime every page shares.
   Menu (focus moved in and trapped, Escape, inert when closed, iOS-safe scroll lock),
   the header that settles onto cream and tucks away on the way down, the phone dock,
   reveals, lazy films and the ticker's rest state. No dependencies, no network; with
   scripting off every page is complete. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  window.__edit = true;
  var mq = function (q) { return window.matchMedia ? window.matchMedia(q) : { matches: false }; };
  var reduced = mq('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var hasIO = 'IntersectionObserver' in window;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  /* ---- menu ---- */
  var menu = $('menu'), openBtn = $('menuOpen'), closeBtn = $('menuClose');
  if (menu && openBtn && closeBtn) {
    var lockY = 0;
    var lock = function (on) {
      var b = doc.body.style;
      if (on) { lockY = window.pageYOffset; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
      else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; window.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
    };
    var isOpen = function () { return menu.classList.contains('open'); };
    var setMenu = function (open, restore) {
      if (open === isOpen()) return;
      lock(open);
      menu.classList.toggle('open', open);
      root.classList.toggle('menu-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      if (open) { menu.removeAttribute('inert'); } else { menu.setAttribute('inert', ''); }
      menu.inert = !open;
      openBtn.setAttribute('aria-expanded', String(open));
      if (open) { setTimeout(function () { closeBtn.focus(); }, 30); }
      else if (restore !== false) { openBtn.focus({ preventScroll: true }); }
    };
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        if (a.origin === location.origin && a.pathname !== location.pathname) lockY = 0;
        setMenu(false, false);
      });
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted && isOpen()) setMenu(false, false); });
    doc.addEventListener('keydown', function (e) { if ((e.key === 'Escape' || e.key === 'Esc') && isOpen()) { e.preventDefault(); setMenu(false); } });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !isOpen()) return;
      var f = $$('a[href], button', menu).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- header + dock: one rAF per scroll burst ---- */
  var hd = $('siteHeader'), dock = $('dock'), foot = doc.querySelector('.ft');
  var dockLinks = dock ? $$('a', dock) : [];
  var lastY = window.pageYOffset, tick = false, dockOn = false, footIn = false;
  var dockAfter = function () {
    var h = doc.querySelector('[data-dock-after]');
    if (h) return h.getBoundingClientRect().bottom + window.pageYOffset - window.innerHeight * 0.35;
    return window.innerHeight * 0.6;
  };
  var setDock = function (on) {
    if (!dock || on === dockOn) return;
    dockOn = on;
    root.classList.toggle('dock-on', on);
    dock.setAttribute('aria-hidden', String(!on));
    dockLinks.forEach(function (a) { if (on) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1'); });
  };
  var frame = function () {
    tick = false;
    var y = window.pageYOffset;
    if (hd && !root.classList.contains('menu-open')) {
      var stuck = y > 24;
      hd.classList.toggle('hd--stuck', stuck);
      if (y < 300 || y < lastY - 4) hd.classList.remove('hd--hide');
      else if (y > lastY + 6 && !hd.contains(doc.activeElement)) hd.classList.add('hd--hide');
    }
    setDock(y > dockAfter() && !footIn);
    lastY = y;
  };
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener('resize', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  if (hd) hd.addEventListener('focusin', function () { hd.classList.remove('hd--hide'); });
  if (foot && hasIO) {
    new IntersectionObserver(function (es) { footIn = es[0].isIntersecting; frame(); }, { rootMargin: '0px 0px -10% 0px' }).observe(foot);
  }
  frame();

  /* ---- stagger: data-stag=".08" gives each child its own --d ---- */
  $$('[data-stag]').forEach(function (s) {
    var step = parseFloat(s.getAttribute('data-stag')) || 0.08;
    Array.prototype.forEach.call(s.children, function (c, i) { c.style.setProperty('--d', (i * step).toFixed(2) + 's'); });
  });

  /* ---- reveals ---- */
  var toReveal = $$('.rv,.rv-card,.rv-wipe');
  if (reduced || !hasIO) toReveal.forEach(function (el) { el.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    toReveal.forEach(function (el) { io.observe(el); });
    /* anything already on screen at load, and never leave something hidden after a jump */
    var sweep = function () { toReveal.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in'); }); };
    window.addEventListener('load', function () { setTimeout(sweep, 300); });
    window.addEventListener('hashchange', function () { setTimeout(sweep, 60); });
  }

  /* ---- lazy films: poster until near, rest off screen; a still under reduced motion / Save-Data ---- */
  $$('video[data-film]').forEach(function (v) {
    if (v.closest('[data-story]')) return; /* the story drives its own */
    if (reduced || saveData) { $$('source', v).forEach(function (s) { s.parentNode.removeChild(s); }); return; }
    if (!hasIO) return;
    var loaded = false;
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          if (!loaded) { $$('source', v).forEach(function (s) { if (s.getAttribute('data-src')) s.src = s.getAttribute('data-src'); }); v.load(); loaded = true; }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else v.pause();
      });
    }, { rootMargin: '200px 0px' }).observe(v);
  });

  /* ---- ticker: runs only while on screen and the tab is visible ---- */
  $$('.tick').forEach(function (t) {
    if (!hasIO) return;
    var vis = false;
    var set = function () { t.classList.toggle('paused', !vis || doc.hidden); };
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; set(); }).observe(t);
    doc.addEventListener('visibilitychange', set);
  });
})();
