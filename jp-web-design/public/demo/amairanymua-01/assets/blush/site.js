/* /demo/amairanymua-01 — BLUSH shared runtime (every page): the menu, the header that tucks away,
   the floating inquiry pill, reveals, lazy films (at most three playing), the seals that turn while
   on screen, and the self-advancing Looks rail. Plain script, no dependencies, no network.
   Everything here is an enhancement: with scripting off every page is complete. */
(function () {
  'use strict';
  var win = window, doc = document, root = doc.documentElement;
  win.__blush = true;
  var mq = function (q) { return !!(win.matchMedia && win.matchMedia(q).matches); };
  var reduced = mq('(prefers-reduced-motion: reduce)');
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var hasIO = 'IntersectionObserver' in win;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var raf = win.requestAnimationFrame ? win.requestAnimationFrame.bind(win) : function (f) { return setTimeout(f, 16); };

  /* ---- menu: inert + aria-hidden when closed; focus moved in, trapped, and returned ---- */
  var menu = $('menu'), openBtn = $('menuOpen'), closeBtn = $('menuClose');
  if (menu && openBtn && closeBtn) {
    /* iOS ignores overflow:hidden on <body>: pin the page where it is and put it back on close */
    var lockY = 0;
    var lock = function (on) {
      var b = doc.body.style;
      if (on) { lockY = win.scrollY; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
      else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; win.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
    };
    var isOpen = function () { return menu.classList.contains('open'); };
    var setMenu = function (open, restoreFocus) {
      if (open === isOpen()) return;
      lock(open);
      menu.classList.toggle('open', open);
      doc.body.classList.toggle('menu-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
      menu.inert = !open;
      openBtn.setAttribute('aria-expanded', String(open));
      if (open) closeBtn.focus({ preventScroll: true });
      else if (restoreFocus !== false) openBtn.focus({ preventScroll: true });
    };
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        if (a.origin === location.origin && a.pathname !== location.pathname) lockY = 0;
        setMenu(false, false);
      });
    });
    win.addEventListener('pageshow', function (e) { if (e.persisted && isOpen()) setMenu(false, false); });
    doc.addEventListener('keydown', function (e) { if ((e.key === 'Escape' || e.key === 'Esc') && isOpen()) setMenu(false); });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !isOpen()) return;
      var f = $$('a[href], button', menu).filter(function (el) { return el.offsetParent !== null || el === closeBtn; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- header (tucks away going down, returns going up) and the floating pill ----
     One rAF-throttled scroll handler. The pill shows once the first screen has scrolled away
     (on the home page: once the hero's actions are out of sight) and hides again near the foot,
     where the footer carries both actions; the marker is lifted above it while it shows. */
  var hd = $('siteHeader'), pill = $('blPill');
  var lastY = win.scrollY, tick = false;
  var heroActs = doc.querySelector('[data-pill-after]');
  var foot = doc.querySelector('.ft-top .acts');
  /* [data-pill-hide]: an in-page start of the inquiry; the pill steps aside while one is on screen */
  var hides = $$('[data-pill-hide]');
  var frame = function () {
    tick = false;
    var y = win.scrollY, vh = win.innerHeight;
    if (hd) {
      var stuck = y > 24;
      hd.classList.toggle('hd--stuck', stuck);
      if (!doc.body.classList.contains('menu-open') && !root.classList.contains('intro')) {
        if (y > lastY + 6 && y > 420) hd.classList.add('hd--hide');
        else if (y < lastY - 6 || y < 200) hd.classList.remove('hd--hide');
      }
    }
    if (pill) {
      var past = heroActs ? heroActs.getBoundingClientRect().bottom < 0 : y > vh * 0.7;
      var nearFoot = foot ? foot.getBoundingClientRect().top < vh - 40 : false;
      var covered = hides.some(function (el) { var r = el.getBoundingClientRect(); return r.top < vh - 60 && r.bottom > 80; });
      var on = past && !nearFoot && !covered && !root.classList.contains('intro');
      if (on !== pill.classList.contains('on')) { pill.classList.toggle('on', on); root.classList.toggle('pill-on', on); }
    }
    lastY = y;
  };
  var onScroll = function () { if (!tick) { tick = true; raf(frame); } };
  win.addEventListener('scroll', onScroll, { passive: true });
  win.addEventListener('resize', onScroll, { passive: true });
  frame();
  win.__blushFrame = frame;
  /* keyboard: never leave a focused control inside a tucked-away bar */
  if (hd) hd.addEventListener('focusin', function () { hd.classList.remove('hd--hide'); });

  /* ---- stagger: data-stag=".1" gives each child its own --d ---- */
  $$('[data-stag]').forEach(function (s) {
    var step = parseFloat(s.getAttribute('data-stag')) || 0.08;
    Array.prototype.forEach.call(s.children, function (c, i) { c.style.setProperty('--d', (i * step).toFixed(2) + 's'); });
  });

  /* ---- reveals ---- */
  var toReveal = $$('.rv,.rv-im');
  if (reduced || !hasIO) toReveal.forEach(function (el) { el.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
    toReveal.forEach(function (el) { io.observe(el); });
    /* anything already on screen (a restored scroll position, a jump link) */
    var sweep = function () { toReveal.forEach(function (el) { if (el.classList.contains('in')) return; var r = el.getBoundingClientRect(); if (r.top < win.innerHeight && r.bottom > 0) el.classList.add('in'); }); };
    win.addEventListener('load', function () { setTimeout(sweep, 300); });
    win.addEventListener('pageshow', function (e) { if (e.persisted) sweep(); });
  }

  /* keyboard: a control focused inside something not yet revealed reveals it at once */
  doc.addEventListener('focusin', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('.rv,.rv-im') : null;
    while (el) { el.classList.add('in'); el = el.parentElement ? el.parentElement.closest('.rv,.rv-im') : null; }
  });

  /* ---- seals that turn: only while on screen (CSS pauses the animation otherwise) ---- */
  var spins = $$('.seal--spin');
  if (spins.length && hasIO && !reduced) {
    var sio = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('is-on', e.isIntersecting); }); });
    spins.forEach(function (s) { sio.observe(s); });
  }

  /* ---- films ----
     Poster until near the viewport; then the clip loads and plays. Only the three most visible
     clips play at once; the rest rest. Paused when the tab is hidden. Under reduced motion or
     Save-Data the source is removed and the poster stands as a still. [data-film-eager] on a tile
     (the home hero) loads at once. */
  var films = $$('video[data-film]');
  var loadFilm = function (v) {
    if (v.__loaded) return;
    v.__loaded = true;
    /* data-film-from="4.7" on a tile: play, and loop, from that second (skipping a clip's "before").
       The start is a media fragment (#t=), so the browser fetches from there instead of seeking. */
    var host = v.closest('[data-film-from]');
    var from = host ? parseFloat(host.getAttribute('data-film-from')) || 0 : 0;
    $$('source', v).forEach(function (s) { if (s.getAttribute('data-src')) s.src = s.getAttribute('data-src') + (from > 0 ? '#t=' + from : ''); });
    if (from > 0) {
      v.loop = false;
      v.addEventListener('ended', function () {
        try { v.currentTime = from; } catch (e) { /* ignore */ }
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      });
    }
    try { v.load(); } catch (e) { /* ignore */ }
  };
  /* A clip loads only once it has been chosen to play and has stayed chosen for a moment, so a fast
     scroll past it costs nothing (and never leaves a half-finished download to be cancelled). */
  var schedTimer = 0;
  /* rest a clip; one still downloading finishes its download first (the browser fires 'suspend'
     when it stops fetching), so no request is ever cut off half-way */
  var rest = function (v) {
    if (v.networkState === 2 && !v.__waitSuspend && !v.__settled) {
      v.__waitSuspend = true;
      var settle = function () { if (!v.__waitSuspend) return; v.removeEventListener('suspend', settle); v.__waitSuspend = false; v.__settled = true; schedule(); };
      v.addEventListener('suspend', settle);
      setTimeout(settle, 3000); /* never left playing off screen for long, whatever the network does */
      return;
    }
    if (!v.__waitSuspend) v.pause();
  };
  var schedule = function () {
    var ranked = films.filter(function (v) { return (v.__ratio || 0) > 0; }).sort(function (a, b) { return (b.__ratio || 0) - (a.__ratio || 0); });
    var playing = doc.hidden ? [] : ranked.slice(0, 3);
    films.forEach(function (v) {
      if (playing.indexOf(v) > -1) {
        if (v.__loaded) { var p = v.play(); if (p && p.catch) p.catch(function () { /* autoplay refused: the poster stands */ }); }
      } else if (!v.paused) rest(v);
    });
    if (!schedTimer && playing.some(function (v) { return !v.__loaded; })) {
      schedTimer = setTimeout(function () {
        schedTimer = 0;
        var still = doc.hidden ? [] : films.filter(function (v) { return (v.__ratio || 0) > 0; }).sort(function (a, b) { return (b.__ratio || 0) - (a.__ratio || 0); }).slice(0, 3);
        still.forEach(function (v) { if (!v.__loaded) { loadFilm(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); } });
      }, 450);
    }
  };
  win.__blushFilms = { load: loadFilm, schedule: schedule };
  if (films.length) {
    if (reduced || saveData) {
      films.forEach(function (v) { $$('source', v).forEach(function (s) { s.parentNode.removeChild(s); }); v.removeAttribute('autoplay'); });
    } else if (hasIO) {
      var fio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var v = e.target;
          v.__ratio = e.isIntersecting ? Math.max(e.intersectionRatio, 0.001) : 0;
        });
        schedule();
      }, { rootMargin: '0px', threshold: [0, 0.2, 0.45, 0.7, 1] });
      films.forEach(function (v) {
        if (v.closest('[data-film-eager]')) { loadFilm(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        fio.observe(v);
      });
      doc.addEventListener('visibilitychange', schedule);
    }
  }

  /* ---- the Looks rail: [data-rail] ----
     Native scroll-snap does the swiping. The script adds arrows, a counter, a pause button and
     the auto-advance: one step every data-auto ms, only while the rail is on screen and the tab
     is visible, held for 7 s after any touch, wheel, key or focus inside it, never under reduced
     motion. Each step is one native smooth scroll, so it can never stop half-way. */
  $$('[data-rail]').forEach(function (rail) {
    var track = rail.querySelector('.rail-track');
    var items = $$('.rail-it', rail);
    if (!track || items.length < 2) return;
    var prev = rail.querySelector('[data-rail-prev]'), next = rail.querySelector('[data-rail-next]');
    var tog = rail.querySelector('[data-rail-toggle]'), num = rail.querySelector('[data-rail-n]');
    var every = parseInt(rail.getAttribute('data-auto'), 10) || 3800;
    var paused = false, onScreen = false, holdUntil = 0, timer = 0;
    var padL = function () { return parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0; };
    var index = function () {
      var x = track.scrollLeft + padL(), best = 0, d = Infinity;
      items.forEach(function (it, i) { var dd = Math.abs(it.offsetLeft - x); if (dd < d) { d = dd; best = i; } });
      return best;
    };
    var atEnd = function () { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; };
    var go = function (i) {
      var n = items.length;
      i = (i + n) % n;
      track.scrollTo({ left: Math.max(0, items[i].offsetLeft - padL()), behavior: reduced ? 'auto' : 'smooth' });
    };
    var step = function (dir) {
      if (dir > 0 && atEnd()) go(0);
      else go(index() + dir);
    };
    var face = function () {
      if (!tog) return;
      tog.classList.toggle('is-paused', paused);
      var t = tog.querySelector('.pz-t'); if (t) t.textContent = paused ? 'Play' : 'Pause';
      tog.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' the looks');
    };
    var loop = function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (!paused && onScreen && !doc.hidden && Date.now() > holdUntil && !doc.body.classList.contains('menu-open')) step(1);
        loop();
      }, every);
    };
    var hold = function () { holdUntil = Date.now() + 7000; };
    if (prev) { prev.hidden = false; prev.addEventListener('click', function () { hold(); step(-1); }); }
    if (next) { next.hidden = false; next.addEventListener('click', function () { hold(); step(1); }); }
    var sTick = false;
    track.addEventListener('scroll', function () { if (!sTick) { sTick = true; raf(function () { sTick = false; if (num) num.textContent = String(index() + 1); }); } }, { passive: true });
    ['pointerdown', 'touchstart', 'wheel', 'focusin'].forEach(function (t) { track.addEventListener(t, hold, { passive: true }); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); hold(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); hold(); step(-1); }
    });
    if (!reduced) {
      if (tog) { tog.hidden = false; tog.addEventListener('click', function () { paused = !paused; face(); }); face(); }
      if (hasIO) new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; }, { threshold: 0.35 }).observe(rail);
      else onScreen = true;
      loop();
    }
  });
})();
