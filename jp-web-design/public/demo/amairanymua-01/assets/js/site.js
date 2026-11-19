/* /demo/amairanymua-01 — shared runtime for every page: the full-screen menu, the header
   that compacts and tucks away, scroll reveals, ghost words, gentle parallax, lazy films
   and the back-to-top button. Ported from the Sass by Kass shell.

   No dependencies and no network requests. Everything here is an enhancement: with
   scripting off, the pages are complete and every link works (see the <noscript> rules
   in system.css callers and the `.js` class this file's host page sets in <head>). */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  window.__am01 = true;

  /* ---- full-screen menu (inert + aria-hidden when closed, focus managed and trapped) ---- */
  var menu = $('menu'), openBtn = $('menuOpen'), closeBtn = $('menuClose');
  if (menu && openBtn && closeBtn) {
    /* iOS ignores overflow:hidden on <body>, so the page is pinned in place while the menu
       is open and returned to the same spot when it closes: never scrolled underneath. */
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
      menu.inert = !open;
      if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
      openBtn.setAttribute('aria-expanded', String(open));
      if (open) closeBtn.focus(); else if (restoreFocus !== false) openBtn.focus({ preventScroll: true });
    };
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    /* a menu link closes the menu; one that leaves this page opens its target at the top */
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        var samePage = a.pathname === location.pathname && a.origin === location.origin;
        if (!samePage && a.origin === location.origin) lockY = 0;
        setMenu(false, false);
      });
    });
    /* back/forward cache: never come back to a page with its menu still open */
    window.addEventListener('pageshow', function (e) { if (e.persisted && menu.classList.contains('open')) setMenu(false, false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !menu.classList.contains('open')) return;
      var f = $$('a[href]:not([tabindex="-1"]), button', menu);
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- header: a compact translucent bar after the top; hides on scroll down, returns on scroll up ---- */
  var hd = $('siteHeader');
  if (hd) {
    var lastY = window.scrollY, hdTick = false;
    var hdFrame = function () {
      hdTick = false;
      var y = window.scrollY;
      var stuck = y > 120;
      hd.classList.toggle('hd--stuck', stuck);
      hd.classList.toggle('hd--hide', stuck && y > lastY && y - lastY > 6 && y > 400);
      lastY = y;
    };
    window.addEventListener('scroll', function () { if (!hdTick) { hdTick = true; requestAnimationFrame(hdFrame); } }, { passive: true });
    hdFrame();
    /* keyboard: never leave a focused control inside a tucked-away bar */
    hd.addEventListener('focusin', function () { hd.classList.remove('hd--hide'); });
  }

  /* ---- stagger helper: data-stag=".1" gives each child its own delay ---- */
  $$('[data-stag]').forEach(function (s) {
    var step = parseFloat(s.getAttribute('data-stag')) || 0.08;
    Array.prototype.forEach.call(s.children, function (c, i) { c.style.setProperty('--d', (i * step).toFixed(2) + 's'); });
  });

  /* ---- reveals ---- */
  var toReveal = $$('.rv,.rv-im,.fade,.sheen');
  if (reduced || !hasIO) {
    toReveal.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    toReveal.forEach(function (el) { io.observe(el); });
    window.addEventListener('load', function () {
      setTimeout(function () {
        toReveal.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in'); });
      }, 400);
    });
  }

  /* ---- ghost words ---- */
  var ghosts = $$('.ghost-w');
  if (ghosts.length && hasIO && !reduced) {
    var gio = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('in', e.isIntersecting); }); }, { threshold: 0.2 });
    ghosts.forEach(function (g) { gio.observe(g); });
  }

  /* ---- gentle parallax pairs (desktop only) ---- */
  var plxHosts = $$('[data-plx-host]');
  var wide = window.matchMedia('(min-width:900px)');
  var plxTick = false;
  var plxFrame = function () {
    plxTick = false;
    if (reduced || !wide.matches) return;
    var vh = window.innerHeight;
    plxHosts.forEach(function (host) {
      var r = host.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) return;
      var off = r.top + r.height / 2 - vh / 2;
      $$('.plx', host).forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-plx')) || 0.06;
        el.style.transform = 'translate3d(0,' + (off * f).toFixed(1) + 'px,0)';
      });
    });
  };
  if (plxHosts.length && !reduced) {
    window.addEventListener('scroll', function () { if (!plxTick) { plxTick = true; requestAnimationFrame(plxFrame); } }, { passive: true });
    plxFrame();
  }

  /* ---- lazy films: poster until near the viewport, rest off screen, and never under
          reduced motion or Save-Data (the poster then stands as a photograph) ---- */
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  $$('video[data-film]').forEach(function (video) {
    if (reduced || saveData) { $$('source', video).forEach(function (s) { s.remove(); }); video.removeAttribute('autoplay'); return; }
    if (!hasIO) return;
    var loaded = false;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          if (!loaded) {
            $$('source', video).forEach(function (s) { if (s.dataset.src) s.src = s.dataset.src; });
            video.load(); loaded = true;
          }
          var p = video.play(); if (p && p.catch) p.catch(function () {});
        } else video.pause();
      });
    }, { rootMargin: '240px 0px' }).observe(video);
  });

  /* ---- back to top ---- */
  var tt = $('toTop');
  if (tt) {
    window.addEventListener('scroll', function () { tt.classList.toggle('show', window.scrollY > 700); }, { passive: true });
    tt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
  }
})();
