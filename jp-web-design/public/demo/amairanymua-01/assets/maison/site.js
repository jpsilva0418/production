/* /demo/amairanymua-01 — MAISON shared runtime: the menu, the header, reveals, lazy films, the
   runway rail that advances on its own, and the wipe slideshow. Plain ES2017, one IIFE, no
   dependencies, no network. Everything is an enhancement: with scripting off every page is complete
   (the rail is a plain swipe rail, the slideshow shows its first look, every link works). */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, win = window;
  win.__maison = true;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var mq = function (q) { return !!(win.matchMedia && win.matchMedia(q).matches); };
  var reduced = mq('(prefers-reduced-motion: reduce)');
  var hasIO = 'IntersectionObserver' in win;
  var raf = win.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var EASE_IO = 'cubic-bezier(.77,0,.18,1)';

  /* ---- the menu: a modal sheet; inert when closed; focus moved in, trapped, returned ---- */
  var menu = $('menu'), openBtn = $('menuOpen'), closeBtn = $('menuClose');
  if (menu && openBtn && closeBtn) {
    /* iOS ignores overflow:hidden on <body>: pin the page in place and put it back on close */
    var lockY = 0;
    var lock = function (on) {
      var b = doc.body.style;
      if (on) { lockY = win.scrollY || win.pageYOffset || 0; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
      else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; win.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
    };
    var isOpen = function () { return menu.classList.contains('open'); };
    var setMenu = function (open, restore) {
      if (open === isOpen()) return;
      lock(open);
      menu.classList.toggle('open', open);
      doc.body.classList.toggle('menu-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      menu.inert = !open;
      if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
      openBtn.setAttribute('aria-expanded', String(open));
      if (open) closeBtn.focus({ preventScroll: true });
      else if (restore !== false) openBtn.focus({ preventScroll: true });
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
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) { e.preventDefault(); setMenu(false); } });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !isOpen()) return;
      var f = $$('a[href]:not([tabindex="-1"]), button:not([disabled])', menu);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- header: a hairline appears once the page has moved (it never hides: the lead action
          lives in it) ---- */
  var hd = $('siteHeader');
  if (hd) {
    var hdTick = false;
    var hdFrame = function () { hdTick = false; hd.classList.toggle('hd--stuck', (win.scrollY || 0) > 8); };
    win.addEventListener('scroll', function () { if (!hdTick) { hdTick = true; raf(hdFrame); } }, { passive: true });
    hdFrame();
  }

  /* ---- stagger: data-stag=".08" gives each child its own --d ---- */
  $$('[data-stag]').forEach(function (s) {
    var step = parseFloat(s.getAttribute('data-stag')) || 0.08;
    Array.prototype.forEach.call(s.children, function (c, i) { if (!c.style.getPropertyValue('--d')) c.style.setProperty('--d', (i * step).toFixed(2) + 's'); });
  });

  /* ---- reveals ---- */
  var toReveal = $$('.rv,.rv-mask,.rv-im');
  if (reduced || !hasIO) {
    toReveal.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
    toReveal.forEach(function (el) { io.observe(el); });
    /* never leave anything hidden that is already on screen (fast scrolls, anchors, restores) */
    var sweep = function () { toReveal.forEach(function (el) { if (el.classList.contains('in')) return; var r = el.getBoundingClientRect(); if (r.top < win.innerHeight && r.bottom > 0) el.classList.add('in'); }); };
    win.addEventListener('load', function () { setTimeout(sweep, 300); });
    win.addEventListener('pageshow', function (e) { if (e.persisted) sweep(); });
  }

  /* ---- lazy films: poster until near the viewport, rest off screen; never under reduced
          motion or Save-Data (the poster then stands as a still) ---- */
  $$('video[data-film]').forEach(function (video) {
    if (reduced || saveData) { $$('source', video).forEach(function (s) { s.remove(); }); return; }
    if (!hasIO) return;
    var loaded = false;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          if (!loaded) { $$('source', video).forEach(function (s) { if (s.dataset.src) s.src = s.dataset.src; }); video.load(); loaded = true; }
          var p = video.play(); if (p && p.catch) p.catch(function () {});
        } else video.pause();
      });
    }, { rootMargin: '240px 0px' }).observe(video);
  });

  /* a pause button's face */
  var face = function (btn, paused) {
    if (!btn) return;
    btn.classList.toggle('is-paused', paused);
    var t = btn.querySelector('.pause-t'); if (t) t.textContent = paused ? 'Play' : 'Pause';
    btn.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' the slideshow');
  };
  var pad = function (k) { return (k < 10 ? '0' : '') + k; };

  /* ---- the wipe slideshow: [data-wipe] ----
     Each change is a hard wipe in the direction of reading: the incoming slide's window opens
     from the left (outer translateX -100% -> 0) while its picture is counter-moved (+100% -> 0),
     so the picture itself stands still and only the edge travels; a thin red line rides that
     edge. Transform only, so it runs on the compositor. Never a cross-fade: the outgoing look is
     fully opaque until it is covered. At the end every animation is cancelled in the same frame
     the classes change, so the slides rest on their static styles. */
  var wipes = {};
  $$('[data-wipe]').forEach(function (el) {
    var slides = $$('.wipe-s', el);
    var n = slides.length;
    if (n < 2) return;
    var id = el.id, hold = parseInt(el.getAttribute('data-hold'), 10) || 3200, D = 1050;
    var ctl = doc.querySelector('[data-wipe-ctl="' + id + '"]');
    var nEl = ctl && ctl.querySelector('[data-wipe-n]'), capEl = ctl && ctl.querySelector('[data-wipe-cap]'), btn = ctl && ctl.querySelector('[data-wipe-toggle]');
    var i = 0, timer = 0, started = false, busy = false, visible = true, userPaused = reduced;
    var loadAll = function () {
      $$('img[data-src]', el).forEach(function (im) {
        if (im.getAttribute('data-srcset')) { im.srcset = im.getAttribute('data-srcset'); im.removeAttribute('data-srcset'); }
        im.src = im.getAttribute('data-src'); im.removeAttribute('data-src');
      });
    };
    var ready = function (s) { var im = s.querySelector('img'); return !im || (im.complete && im.naturalWidth > 0); };
    var running = function () { return started && !userPaused && visible && !doc.hidden; };
    var schedule = function () {
      clearTimeout(timer);
      if (running()) timer = setTimeout(function () { go((i + 1) % n); }, hold);
    };
    var go = function (k) {
      if (busy) return;
      var prev = slides[i], next = slides[k];
      if (!next || next === prev) return;
      if (!ready(next)) { loadAll(); timer = setTimeout(function () { go(k); }, 400); return; }
      busy = true;
      var anims = [];
      var end = function () {
        prev.classList.remove('is-on'); prev.setAttribute('aria-hidden', 'true');
        next.classList.remove('is-in'); next.classList.add('is-on'); next.removeAttribute('aria-hidden');
        anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
        i = k; busy = false;
        schedule();
      };
      next.classList.add('is-in');
      if (nEl) nEl.textContent = pad(k + 1);
      if (capEl) capEl.textContent = next.getAttribute('data-cap') || '';
      if (reduced || !next.animate) { end(); return; }
      var A = function (node, kf, o) { if (!node) return null; var a = node.animate(kf, Object.assign({ duration: D, easing: EASE_IO, fill: 'both' }, o || {})); anims.push(a); return a; };
      var main = A(next, [{ transform: 'translate3d(-100%,0,0)' }, { transform: 'translate3d(0,0,0)' }]);
      A(next.querySelector('.wipe-i'), [{ transform: 'translate3d(100%,0,0)' }, { transform: 'translate3d(0,0,0)' }]);
      A(next.querySelector('.wipe-i img'), [{ transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { easing: 'cubic-bezier(.22,.8,.24,1)' });
      A(next.querySelector('.wipe-e'), [{ opacity: 1 }, { opacity: 1, offset: 0.82 }, { opacity: 0 }], { easing: 'linear' });
      A(prev.querySelector('.wipe-i'), [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(-8%,0,0)' }]);
      main.onfinish = end;
      main.oncancel = function () { if (busy) end(); };
    };
    if (btn) {
      btn.hidden = false; face(btn, userPaused);
      btn.addEventListener('click', function () {
        userPaused = !userPaused; face(btn, userPaused);
        if (!userPaused) { if (!started) started = true; loadAll(); go((i + 1) % n); }
        else clearTimeout(timer);
      });
    }
    if (hasIO) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; schedule(); }, { threshold: 0.2 }).observe(el);
    doc.addEventListener('visibilitychange', schedule);
    var start = function () { if (started) return; started = true; if (doc.readyState === 'complete') loadAll(); else win.addEventListener('load', loadAll); schedule(); };
    wipes[id] = { start: start };
    /* the home page's opening holds the slideshow until it has handed over */
    if (root.classList.contains('intro')) {
      doc.addEventListener('maison:introdone', start, { once: true });
      /* and if the opening never ran (its failsafe removed the class), start anyway */
      var iv = setInterval(function () { if (!root.classList.contains('intro')) { clearInterval(iv); start(); } }, 400);
    } else start();
  });

  /* ---- the runway rail: [data-rail] ----
     Native scroll-snap does the swiping. The rail advances on its own every data-auto ms while it
     is on screen; a touch, a hover with a mouse, or focus inside holds it; the pause button stops
     it; reduced motion never starts it. At the end it returns to the first look. */
  $$('[data-rail]').forEach(function (el) {
    var track = el.querySelector('.rail-track');
    var items = $$('.rail-it', el);
    var n = items.length;
    if (!track || n < 2) return;
    var auto = parseInt(el.getAttribute('data-auto'), 10) || 3600;
    var nEl = el.querySelector('[data-rail-n]'), bar = el.querySelector('[data-rail-bar]');
    var prevB = el.querySelector('[data-rail-prev]'), nextB = el.querySelector('[data-rail-next]'), btn = el.querySelector('[data-rail-toggle]');
    var userPaused = reduced, visible = false, held = false, timer = 0, idleT = 0, cur = 0;
    var padL = function () { return items[0].offsetLeft; };
    var maxS = function () { return track.scrollWidth - track.clientWidth; };
    var index = function () {
      var x = track.scrollLeft, p = padL(), best = 0, d = Infinity;
      if (x >= maxS() - 4) return n - 1;
      items.forEach(function (it, k) { var dd = Math.abs(it.offsetLeft - p - x); if (dd < d) { d = dd; best = k; } });
      return best;
    };
    var paint = function () {
      cur = index();
      if (nEl) nEl.textContent = pad(cur + 1);
      if (bar) { bar.style.setProperty('--w', (100 / n).toFixed(3) + '%'); bar.style.setProperty('--x', (cur * 100) + '%'); }
    };
    var goTo = function (k) {
      k = (k + n) % n;
      track.scrollTo({ left: Math.min(maxS(), items[k].offsetLeft - padL()), behavior: reduced ? 'auto' : 'smooth' });
    };
    var step = function (dir) {
      var c = index();
      if (dir > 0 && track.scrollLeft >= maxS() - 4) goTo(0);
      else if (dir < 0 && track.scrollLeft <= 4) goTo(n - 1);
      else goTo(c + dir);
    };
    var running = function () { return !userPaused && visible && !held && !doc.hidden; };
    var schedule = function () { clearTimeout(timer); if (running()) timer = setTimeout(function () { step(1); schedule(); }, auto); };
    var hold = function (on) { held = on; schedule(); };
    var touchHold = function () { hold(true); clearTimeout(idleT); idleT = setTimeout(function () { hold(false); }, 6000); };
    var tick = false;
    track.addEventListener('scroll', function () { if (!tick) { tick = true; raf(function () { tick = false; paint(); }); } }, { passive: true });
    track.addEventListener('pointerdown', touchHold, { passive: true });
    track.addEventListener('touchstart', touchHold, { passive: true });
    track.addEventListener('wheel', touchHold, { passive: true });
    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hold(true); });
    el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hold(false); });
    el.addEventListener('focusin', function () { hold(true); });
    el.addEventListener('focusout', function (e) { if (!el.contains(e.relatedTarget)) hold(false); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
    if (prevB) { prevB.hidden = false; prevB.addEventListener('click', function () { step(-1); }); }
    if (nextB) { nextB.hidden = false; nextB.addEventListener('click', function () { step(1); }); }
    if (btn) {
      btn.hidden = false; face(btn, userPaused);
      btn.setAttribute('aria-label', (userPaused ? 'Play' : 'Pause') + ' the runway');
      btn.addEventListener('click', function () {
        userPaused = !userPaused; face(btn, userPaused);
        btn.setAttribute('aria-label', (userPaused ? 'Play' : 'Pause') + ' the runway');
        if (!userPaused) { held = false; step(1); }
        schedule();
      });
    }
    if (hasIO) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; schedule(); }, { threshold: 0.35 }).observe(track);
    doc.addEventListener('visibilitychange', schedule);
    win.addEventListener('resize', paint, { passive: true });
    paint();
  });

  win.Maison = { wipes: wipes };
})();
