/* /demo/amairanymua-01 — ATELIER shared runtime: the menu, the header, reveals, her films (lazy,
   at most three playing), the arch slideshow wall, and the arched runway that advances on its own.
   Plain ES2017, one IIFE, no dependencies, no network. Everything is an enhancement: with scripting
   off every page is complete (the runway is a plain swipe rail, each slideshow shows its first look,
   each film shows its poster, every link works). */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, win = window;
  win.__atelier = true;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var mq = function (q) { return !!(win.matchMedia && win.matchMedia(q).matches); };
  var reduced = mq('(prefers-reduced-motion: reduce)');
  var hasIO = 'IntersectionObserver' in win;
  var raf = win.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var EASE_IO = 'cubic-bezier(.7,0,.2,1)', EASE_OUT = 'cubic-bezier(.22,.8,.24,1)';
  var intro = function () { return root.classList.contains('intro'); };
  /* run fn once the home page's opening has handed over (or at once when there is none) */
  var afterIntro = function (fn) {
    if (!intro()) { fn(); return; }
    var fired = false, go = function () { if (!fired) { fired = true; fn(); } };
    doc.addEventListener('atelier:introdone', go, { once: true });
    var iv = setInterval(function () { if (!intro()) { clearInterval(iv); go(); } }, 300);
  };

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

  /* ---- header: a hairline appears once the page has moved. It never hides: "Inquire" lives in it. ---- */
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
  var toReveal = $$('.rv,.rv-mask,.rv-arch');
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

  /* ---- her films ----
     Poster until near the viewport; the clip loads once, plays while on screen, rests off screen.
     At most MAX play at once: the ones most in view win. Never under reduced motion or Save-Data
     (the poster then stands as a still). A film inside a paused group carries data-held. */
  var MAX = 3;
  var films = $$('video[data-film]');
  /* data-start="4.4": play from that moment and loop back to it. The clip is buffered whole first
     (preload auto) while the poster stands; the seek then happens inside the buffer, so it never
     aborts a request or flashes the clip's opening seconds. Every end seeks back the same way. */
  var load = function (el) {
    var start = parseFloat(el.getAttribute('data-start')) || 0;
    $$('source', el).forEach(function (s) { var u = s.getAttribute('data-src'); if (u) s.src = u; });
    if (start) {
      el.loop = false;
      el.preload = 'auto';
      el.__wait = true;
      var whole = function () { var b = el.buffered; return el.duration > 0 && b.length > 0 && b.end(b.length - 1) >= el.duration - 0.15; };
      var arm = function () {
        if (!el.__wait || !whole()) return;
        el.__wait = false;
        var onSeeked = function () { el.removeEventListener('seeked', onSeeked); sync(); };
        el.addEventListener('seeked', onSeeked);
        try { el.currentTime = start; } catch (e) { sync(); }
      };
      el.addEventListener('progress', arm);
      el.addEventListener('canplaythrough', arm);
      /* a slow network: never wait more than 6 s; play from the beginning rather than not at all */
      setTimeout(function () { if (el.__wait) { el.__wait = false; sync(); } }, 6000);
      el.addEventListener('ended', function () { try { el.currentTime = start; } catch (e) {} if (el.hasAttribute('data-held')) return; var p = el.play(); if (p && p.catch) p.catch(function () {}); });
    }
    el.load();
  };
  var vis = [];
  var sync = function () {
    var on = vis.filter(function (v) { return v.r > 0.04 && !v.el.hasAttribute('data-held') && !doc.hidden; })
      .sort(function (a, b) { return b.r - a.r; }).slice(0, MAX);
    vis.forEach(function (v) {
      var want = on.indexOf(v) !== -1;
      if (want) {
        if (!v.loaded) { load(v.el); v.loaded = true; }
        if (v.el.paused && !v.el.__wait) { var p = v.el.play(); if (p && p.catch) p.catch(function () {}); }
      } else if (!v.el.paused) v.el.pause();
    });
  };
  if (reduced || saveData) {
    films.forEach(function (v) { $$('source', v).forEach(function (s) { s.remove(); }); });
  } else if (hasIO && films.length) {
    var fio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = vis.filter(function (x) { return x.el === e.target; })[0];
        if (!v) return;
        /* near (within 300px) counts as a sliver of visibility so the clip is ready on arrival */
        v.r = e.isIntersecting ? Math.max(0.05, e.intersectionRatio) : 0;
      });
      sync();
    }, { rootMargin: '300px 0px', threshold: [0, 0.05, 0.25, 0.5, 0.75, 1] });
    films.forEach(function (el) { vis.push({ el: el, r: 0, loaded: false }); fio.observe(el); });
    doc.addEventListener('visibilitychange', sync);
  }
  win.Atelier = { syncFilms: sync };

  /* a pause button's face */
  var face = function (btn, paused, what) {
    if (!btn) return;
    btn.classList.toggle('is-paused', paused);
    var t = btn.querySelector('.pause-t'); if (t) t.textContent = paused ? 'Play' : 'Pause';
    btn.setAttribute('aria-label', (paused ? 'Play ' : 'Pause ') + what);
  };
  var pad = function (k) { return (k < 10 ? '0' : '') + k; };

  /* ---- the arch slideshow wall: [data-wall] holding [data-cycle] windows ----
     The windows change in turn, one every hold/n ms. Each change is a vertical wipe that rises
     inside the arch: the incoming look is uncovered from the bottom edge up (clip-path), settling
     from a slight scale, while the outgoing look stays fully opaque beneath it until it is
     covered. Never a cross-fade. At the end every animation is cancelled in the same frame the
     classes change, so the slides rest on their static styles. The wall's pause also holds the
     films inside the wall. */
  $$('[data-wall]').forEach(function (wall) {
    var cycles = $$('[data-cycle]', wall).map(function (el) { return { el: el, slides: $$('.cy-s', el), i: 0, busy: false }; })
      .filter(function (c) { return c.slides.length > 1; });
    if (!cycles.length) return;
    var hold = parseInt(wall.getAttribute('data-hold'), 10) || 3600, D = 1150;
    var ctl = doc.querySelector('[data-wall-ctl="' + wall.id + '"]');
    var btn = ctl && ctl.querySelector('[data-wall-toggle]'), capEl = ctl && ctl.querySelector('[data-wall-cap]');
    var turn = 0, timer = 0, started = false, visible = true, userPaused = reduced;
    var loadAll = function () {
      $$('img[data-src]', wall).forEach(function (im) {
        if (im.getAttribute('data-srcset')) { im.srcset = im.getAttribute('data-srcset'); im.removeAttribute('data-srcset'); }
        im.src = im.getAttribute('data-src'); im.removeAttribute('data-src');
      });
    };
    var ready = function (s) { var im = s.querySelector('img'); return !im || (im.complete && im.naturalWidth > 0); };
    var running = function () { return started && !userPaused && visible && !doc.hidden; };
    var schedule = function () {
      clearTimeout(timer);
      if (running()) timer = setTimeout(step, Math.round(hold / cycles.length));
    };
    var change = function (c) {
      if (c.busy) return;
      var k = (c.i + 1) % c.slides.length, prev = c.slides[c.i], nx = c.slides[k];
      if (!ready(nx)) { loadAll(); return; }
      c.busy = true;
      var anims = [];
      var end = function () {
        prev.classList.remove('is-on'); prev.setAttribute('aria-hidden', 'true');
        nx.classList.remove('is-in'); nx.classList.add('is-on'); nx.removeAttribute('aria-hidden');
        anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
        c.i = k; c.busy = false;
      };
      nx.classList.add('is-in');
      if (capEl) capEl.textContent = nx.getAttribute('data-cap') || '';
      if (reduced || !nx.animate) { end(); return; }
      var A = function (node, kf, o) { if (!node) return null; var a = node.animate(kf, Object.assign({ duration: D, easing: EASE_IO, fill: 'both' }, o || {})); anims.push(a); return a; };
      var main = A(nx, [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }]);
      A(nx.querySelector('img'), [{ transform: 'scale(1.12) translateY(4%)' }, { transform: 'none' }], { duration: D + 250, easing: EASE_OUT });
      A(prev.querySelector('img'), [{ transform: 'none' }, { transform: 'translateY(-5%)' }]);
      main.onfinish = end;
      main.oncancel = function () { if (c.busy) end(); };
    };
    var step = function () { change(cycles[turn % cycles.length]); turn++; schedule(); };
    var filmRoots = [wall].concat((wall.getAttribute('data-films') || '').split(' ').map(function (id) { return id && $(id); }).filter(Boolean));
    var held = function (on) {
      filmRoots.forEach(function (r) { $$('video[data-film]', r).forEach(function (v) { if (on) v.setAttribute('data-held', ''); else v.removeAttribute('data-held'); }); });
      sync();
    };
    if (btn) {
      btn.hidden = false; face(btn, userPaused, 'the slideshow and film');
      btn.addEventListener('click', function () {
        userPaused = !userPaused; face(btn, userPaused, 'the slideshow and film');
        held(userPaused);
        if (!userPaused) { started = true; loadAll(); step(); } else clearTimeout(timer);
      });
    }
    /* watch the wall's section: the wall itself is display:contents in some layouts */
    if (hasIO) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; schedule(); }, { threshold: 0.15 }).observe(wall.closest('section') || wall);
    doc.addEventListener('visibilitychange', schedule);
    afterIntro(function () {
      if (started) return;
      started = true;
      if (doc.readyState === 'complete') loadAll(); else win.addEventListener('load', loadAll);
      schedule();
    });
  });

  /* ---- the arched runway: [data-rail] ----
     Native scroll-snap does the swiping. The runway advances on its own every data-auto ms while it
     is on screen; a touch, a mouse hover or focus inside holds it; the pause button stops it;
     reduced motion never starts it. At the end it returns to the first look. */
  $$('[data-rail]').forEach(function (el) {
    var track = el.querySelector('.rail-track');
    var items = $$('.rail-it', el);
    var n = items.length;
    if (!track || n < 2) return;
    var auto = parseInt(el.getAttribute('data-auto'), 10) || 3400;
    var nEl = el.querySelector('[data-rail-n]'), bar = el.querySelector('[data-rail-bar]');
    var prevB = el.querySelector('[data-rail-prev]'), nextB = el.querySelector('[data-rail-next]'), btn = el.querySelector('[data-rail-toggle]');
    var userPaused = reduced, visible = false, holdOn = false, timer = 0, idleT = 0;
    var padL = function () { return items[0].offsetLeft; };
    var maxS = function () { return track.scrollWidth - track.clientWidth; };
    var index = function () {
      var x = track.scrollLeft, p = padL(), best = 0, d = Infinity;
      if (x >= maxS() - 4) return n - 1;
      items.forEach(function (it, k) { var dd = Math.abs(it.offsetLeft - p - x); if (dd < d) { d = dd; best = k; } });
      return best;
    };
    var paint = function () {
      var c = index();
      if (nEl) nEl.textContent = pad(c + 1);
      if (bar) { bar.style.setProperty('--w', (100 / n).toFixed(3) + '%'); bar.style.setProperty('--x', (c * 100) + '%'); }
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
    var running = function () { return !userPaused && visible && !holdOn && !doc.hidden; };
    var schedule = function () { clearTimeout(timer); if (running()) timer = setTimeout(function () { step(1); schedule(); }, auto); };
    var hold = function (on) { holdOn = on; schedule(); };
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
      btn.hidden = false; face(btn, userPaused, 'the runway');
      btn.addEventListener('click', function () {
        userPaused = !userPaused; face(btn, userPaused, 'the runway');
        if (!userPaused) { holdOn = false; step(1); }
        schedule();
      });
    }
    if (hasIO) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; schedule(); }, { threshold: 0.35 }).observe(track);
    doc.addEventListener('visibilitychange', schedule);
    win.addEventListener('resize', paint, { passive: true });
    paint();
  });
})();
