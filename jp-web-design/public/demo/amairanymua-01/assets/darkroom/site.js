/* /demo/amairanymua-01 — site "darkroom": the runtime every page shares.
   The menu (focus moved in and trapped, Escape closes, inert when closed, iOS-safe scroll lock),
   the header that turns solid after the top, reveals (.rv rise, .rv-w grease-pencil wipe),
   prints that DEVELOP as they come into view (.pr--dv), lazy films, and data-stag delays.
   No dependencies, no network. Everything is an enhancement: without it every page is complete. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  window.__dr = true;

  /* ---- menu ---- */
  var menu = $('menu'), openBtn = $('menuOpen'), closeBtn = $('menuClose');
  if (menu && openBtn && closeBtn) {
    /* iOS ignores overflow:hidden on <body>: pin the page while the menu is open, put it back after */
    var lockY = 0;
    var lock = function (on) {
      var b = doc.body.style;
      if (on) { lockY = window.scrollY; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
      else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; window.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
    };
    var setMenu = function (open, restoreFocus) {
      if (open === menu.classList.contains('open')) return;
      lock(open);
      menu.classList.toggle('open', open);
      doc.body.classList.toggle('menu-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
      try { menu.inert = !open; } catch (e) {}
      openBtn.setAttribute('aria-expanded', String(open));
      if (open) setTimeout(function () { closeBtn.focus(); }, 30);
      else if (restoreFocus !== false) { try { openBtn.focus({ preventScroll: true }); } catch (e) { openBtn.focus(); } }
    };
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        var samePage = a.pathname === location.pathname && a.origin === location.origin;
        if (!samePage && a.origin === location.origin) lockY = 0;
        setMenu(false, false);
      });
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted && menu.classList.contains('open')) setMenu(false, false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !menu.classList.contains('open')) return;
      var f = $$('a[href], button', menu).filter(function (el) { return el.offsetParent !== null || el === closeBtn; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- header: transparent over the first screen, a solid bar after it. It never hides,
         so both ways to book stay one tap away on every screen. ---- */
  var hd = $('siteHeader');
  if (hd) {
    var hdTick = false;
    var hdFrame = function () { hdTick = false; hd.classList.toggle('hd--stuck', window.scrollY > 40); };
    window.addEventListener('scroll', function () { if (!hdTick) { hdTick = true; requestAnimationFrame(hdFrame); } }, { passive: true });
    hdFrame();
  }

  /* ---- stagger helper: data-stag=".08" gives each child its own --d ---- */
  $$('[data-stag]').forEach(function (s) {
    var step = parseFloat(s.getAttribute('data-stag')) || 0.08;
    Array.prototype.forEach.call(s.children, function (c, i) { c.style.setProperty('--d', (i * step).toFixed(2) + 's'); });
  });

  /* ---- reveals ---- */
  var toReveal = $$('.rv,.rv-w');
  var show = function (el) { el.classList.add('in'); };
  if (reduced || !hasIO) toReveal.forEach(show);
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    toReveal.forEach(function (el) { io.observe(el); });
    /* anything already on screen at load is shown even if the observer is slow to report */
    window.addEventListener('load', function () {
      setTimeout(function () { toReveal.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) show(el); }); }, 300);
    });
  }

  /* ---- prints develop: paper -> faint -> mid -> her photograph. The stage images load when a
         print comes near; it develops once it is on screen and its stages are ready (or after a
         short wait without them: then simply paper -> photograph). Never under reduced motion. ---- */
  var prints = $$('.pr--dv').filter(function (p) { return !p.hasAttribute('data-dv-manual'); });
  var finish = function (p) { p.classList.add('in'); setTimeout(function () { p.classList.add('dv-done'); }, 2300); };
  if (reduced || !hasIO) prints.forEach(function (p) { p.classList.add('in', 'dv-done'); });
  else {
    var load = function (p) {
      if (p.__dv) return p.__dv;
      var dv = p.querySelector('.dv'), want = 0, got = 0;
      var st = { ready: false, cb: null };
      p.__dv = st;
      var done = function () { got += 1; if (got >= want) { st.ready = true; if (st.cb) st.cb(); } };
      if (!dv) { st.ready = true; return st; }
      [['l', '.dv-l'], ['m', '.dv-m']].forEach(function (k) {
        var u = dv.getAttribute('data-' + k[0]), el = dv.querySelector(k[1]);
        if (!u || !el) return;
        want += 1;
        var im = new Image();
        im.onload = function () { el.style.backgroundImage = 'url("' + u + '")'; done(); };
        im.onerror = function () { el.style.display = 'none'; done(); };
        im.src = u;
      });
      if (!want) st.ready = true;
      return st;
    };
    var near = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { load(e.target); near.unobserve(e.target); } });
    }, { rootMargin: '600px 0px' });
    var seen = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var p = e.target; seen.unobserve(p);
        var st = load(p), fired = false;
        var go = function () { if (fired) return; fired = true; var img = p.querySelector('.pr-im img');
          /* wait for the photograph itself too, so the paper never fades onto an empty frame */
          if (img && !img.complete) { img.addEventListener('load', function () { finish(p); }, { once: true }); img.addEventListener('error', function () { finish(p); }, { once: true }); setTimeout(function () { finish(p); }, 2500); }
          else finish(p); };
        if (st.ready) go(); else { st.cb = go; setTimeout(function () { var dv = p.querySelector('.dv'); if (!st.ready && dv) { $$('.dv-l,.dv-m', dv).forEach(function (el) { if (!el.style.backgroundImage) el.style.display = 'none'; }); } go(); }, 900); }
      });
    }, { threshold: 0.18 });
    prints.forEach(function (p) { near.observe(p); seen.observe(p); });
  }

  /* ---- lazy films: poster until near, rest off screen, a still under reduced motion / Save-Data ---- */
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
