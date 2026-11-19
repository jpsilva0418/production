/* /demo/amairanymua-01 — COCOA shared runtime, on every page: the menu, the header, the phone
   Inquire bar, reveals, the film manager (lazy, near the viewport, at most three playing), the
   looks rail and the filter chips. Plain ES2017, one IIFE, no dependencies, no network. Every
   part is an enhancement: without script the pages are complete (see html.js in site.css). */
(function () {
  'use strict';
  var win = window, doc = document, root = doc.documentElement;
  var mq = function (q) { return !!(win.matchMedia && win.matchMedia(q).matches); };
  var reduced = mq('(prefers-reduced-motion: reduce)');
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var hasIO = 'IntersectionObserver' in win;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var api = win.__cocoa = { reduced: reduced, saveData: saveData };

  /* ---- menu: inert + aria-hidden when closed, focus moved in and trapped, Escape closes,
          body pinned in place (iOS ignores overflow:hidden on body) ---- */
  var menu = $('menu'), openBtn = $('menuOpen'), closeBtn = $('menuClose');
  if (menu && openBtn && closeBtn) {
    var lockY = 0;
    var lock = function (on) {
      var b = doc.body.style;
      if (on) { lockY = win.scrollY || win.pageYOffset || 0; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
      else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; win.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
    };
    var setMenu = function (open, restore) {
      if (open === menu.classList.contains('open')) return;
      lock(open);
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', String(!open));
      if (open) { menu.removeAttribute('inert'); menu.inert = false; } else { menu.setAttribute('inert', ''); menu.inert = true; }
      openBtn.setAttribute('aria-expanded', String(open));
      if (open) closeBtn.focus(); else if (restore !== false) { try { openBtn.focus({ preventScroll: true }); } catch (e) { openBtn.focus(); } }
    };
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        if (a.origin === location.origin && a.pathname !== location.pathname) lockY = 0;
        setMenu(false, false);
      });
    });
    win.addEventListener('pageshow', function (e) { if (e.persisted && menu.classList.contains('open')) setMenu(false, false); });
    doc.addEventListener('keydown', function (e) { if ((e.key === 'Escape' || e.key === 'Esc') && menu.classList.contains('open')) setMenu(false); });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !menu.classList.contains('open')) return;
      var f = $$('a[href], button', menu).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- header hairline after the top; the phone bar after the first screen, away again over
          the closing band and the footer (which carry both actions themselves) ---- */
  var hd = $('siteHeader'), bar = $('bookBar');
  var noBar = $$('[data-nobar]'), overNoBar = 0;
  var barFrom = function () {
    var hero = doc.querySelector('[data-bar-after]');
    if (hero) { var r = hero.getBoundingClientRect(); return r.bottom + (win.scrollY || 0) - win.innerHeight * 0.35; }
    return win.innerHeight * 0.6;
  };
  var from = 0, tick = false;
  var frame = function () {
    tick = false;
    var y = win.scrollY || win.pageYOffset || 0;
    if (hd) hd.classList.toggle('is-stuck', y > 8);
    if (bar) root.classList.toggle('bar-on', y > from && !overNoBar && !(menu && menu.classList.contains('open')));
  };
  var onScroll = function () { if (!tick) { tick = true; win.requestAnimationFrame(frame); } };
  if (hd || bar) {
    from = barFrom();
    win.addEventListener('scroll', onScroll, { passive: true });
    win.addEventListener('resize', function () { from = barFrom(); onScroll(); }, { passive: true });
    win.addEventListener('load', function () { from = barFrom(); onScroll(); });
    frame();
  }
  if (bar && hasIO && noBar.length) {
    var seen = [];
    var nio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var i = seen.indexOf(e.target); if (e.isIntersecting && i < 0) seen.push(e.target); if (!e.isIntersecting && i >= 0) seen.splice(i, 1); });
      overNoBar = seen.length; onScroll();
    }, { rootMargin: '0px 0px -10% 0px' });
    noBar.forEach(function (el) { nio.observe(el); });
  }

  /* ---- stagger: data-stag=".08" gives each child its own --d ---- */
  $$('[data-stag]').forEach(function (s) {
    var step = parseFloat(s.getAttribute('data-stag')) || 0.08;
    Array.prototype.forEach.call(s.children, function (c, i) { if (!c.style.getPropertyValue('--d')) c.style.setProperty('--d', (i * step).toFixed(2) + 's'); });
  });

  /* ---- reveals ---- */
  var toReveal = $$('.rv,.rv-im');
  var reveal = function (el) { el.classList.add('in'); };
  if (reduced || !hasIO) toReveal.forEach(reveal);
  else {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); rio.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
    toReveal.forEach(function (el) { rio.observe(el); });
    /* anything not laid out at this width (e.g. the grid's last two cards on a phone) is simply shown */
    toReveal.forEach(function (el) { if (!el.getClientRects().length) reveal(el); });
    var sweep = function () { toReveal.forEach(function (el) { if (el.classList.contains('in')) return; if (!el.getClientRects().length) { reveal(el); return; } var r = el.getBoundingClientRect(); if (r.top < win.innerHeight && r.bottom > 0) reveal(el); }); };
    win.addEventListener('load', function () { setTimeout(sweep, 300); });
    win.addEventListener('pageshow', function (e) { if (e.persisted) sweep(); });
  }

  /* ---- films: poster until near the viewport; then the most visible ones play, at most
          MAX at once; everything rests off screen and when the tab is hidden; under reduced
          motion or Save-Data the sources are removed and the poster stands as a still.
          A video with data-film-rest (e.g. a hidden card of the hero stack) never plays. ---- */
  var MAX = 3;
  var vids = $$('video[data-film]');
  var state = [];   /* { v, ratio, loaded } */
  var hold = null;  /* a function(video) -> true to keep it still (the opening) */
  /* A reel that opens on the "before" carries data-start on a wrapper: the first time it plays,
     it starts where her finished glam appears (seeking only inside what has already downloaded,
     so no request is ever cut short), with its poster held in place until then; after that it
     loops from the beginning like the original. */
  var startOf = function (v) { var h = v.closest ? v.closest('[data-start]') : null; return h ? parseFloat(h.getAttribute('data-start')) || 0 : 0; };
  var prime = function (v) {
    var t = startOf(v);
    if (!t) return;
    var box = v.parentNode, done = false;
    v.classList.add('is-wait');
    if (box && v.poster) { box.style.backgroundImage = 'url("' + v.poster + '")'; box.style.backgroundPosition = v.style.objectPosition || '50% 50%'; box.classList.add('is-wait-bg'); }
    var clear = function () { v.classList.remove('is-wait'); };
    var off = function () { ['progress', 'timeupdate', 'canplaythrough'].forEach(function (n) { v.removeEventListener(n, tryIt); }); };
    var tryIt = function () {
      if (done) return;
      var b = v.buffered;
      if (v.readyState >= 1 && b && b.length && b.end(b.length - 1) >= Math.min(t + 0.6, (v.duration || 99) - 0.1)) {
        done = true; off();
        if (t < (v.duration || 0) - 0.5) { v.addEventListener('seeked', clear, { once: true }); try { v.currentTime = t; } catch (e) { clear(); } }
        else clear();
      }
    };
    ['progress', 'timeupdate', 'canplaythrough'].forEach(function (n) { v.addEventListener(n, tryIt); });
    setTimeout(function () { if (!done) { done = true; off(); clear(); } }, 3000);
  };
  var load = function (s) {
    if (s.loaded) return;
    s.loaded = true;
    prime(s.v);
    $$('source', s.v).forEach(function (src) { var d = src.getAttribute('data-src'); if (d) src.setAttribute('src', d); });
    try { s.v.preload = 'auto'; s.v.load(); } catch (e) {}
  };
  var play = function (v) { var p; try { p = v.play(); } catch (e) {} if (p && p.catch) p.catch(function () {}); };
  var refresh = function () {
    if (!state.length) return;
    var cands = state.filter(function (s) { return s.ratio > 0 && !s.v.hasAttribute('data-film-rest') && !(hold && hold(s.v)); });
    cands.sort(function (a, b) { return b.ratio - a.ratio; });
    var on = doc.hidden ? [] : cands.slice(0, MAX);
    state.forEach(function (s) {
      if (on.indexOf(s) >= 0) { load(s); if (s.v.paused) play(s.v); }
      else if (!s.v.paused) s.v.pause();
    });
  };
  if (reduced || saveData) {
    vids.forEach(function (v) { $$('source', v).forEach(function (s) { s.parentNode.removeChild(s); }); v.removeAttribute('autoplay'); });
  } else if (hasIO && vids.length) {
    var fio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        for (var i = 0; i < state.length; i++) if (state[i].v === e.target) {
          state[i].ratio = e.isIntersecting ? Math.max(e.intersectionRatio, 0.001) : 0;
        }
      });
      refresh();
    }, { rootMargin: '160px 0px', threshold: [0, 0.15, 0.35, 0.6, 0.85, 1] });
    vids.forEach(function (v) { state.push({ v: v, ratio: 0, loaded: false }); fio.observe(v); });
    doc.addEventListener('visibilitychange', refresh);
  }
  api.films = {
    refresh: refresh,
    setHold: function (fn) { hold = fn; refresh(); },
    play: function (v) { for (var i = 0; i < state.length; i++) if (state[i].v === v) { load(state[i]); play(v); } }
  };

  /* ---- filter chips: [data-filter="<id>"] buttons with data-cat show/hide the [data-cats]
          children of #id (hidden attribute), and tell the rail to re-measure ---- */
  $$('[data-filter]').forEach(function (group) {
    var target = $(group.getAttribute('data-filter'));
    if (!target) return;
    var items = $$('[data-cats]', target);
    var btns = $$('button[data-cat]', group);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.getAttribute('data-cat'), shown = 0;
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        items.forEach(function (it) {
          var ok = cat === 'all' || (' ' + it.getAttribute('data-cats') + ' ').indexOf(' ' + cat + ' ') >= 0;
          if (ok) { it.removeAttribute('hidden'); shown++; } else it.setAttribute('hidden', '');
        });
        if (target.scrollTo) target.scrollTo({ left: 0, behavior: 'auto' }); else target.scrollLeft = 0;
        var ev; try { ev = new CustomEvent('cocoa:filtered', { detail: { shown: shown, label: b.textContent } }); } catch (e) { ev = doc.createEvent('CustomEvent'); ev.initCustomEvent('cocoa:filtered', false, false, { shown: shown, label: b.textContent }); }
        target.dispatchEvent(ev);
        refresh();
      });
    });
  });

  /* ---- the looks rail: arrows scroll a card at a time; a live count; keys on the track ---- */
  $$('[data-rail]').forEach(function (r) {
    var track = r.querySelector('.rail-t'), prev = r.querySelector('[data-rail-prev]'), next = r.querySelector('[data-rail-next]'), count = r.querySelector('[data-rail-count]');
    if (!track) return;
    var items = function () { return $$('.rail-i', track).filter(function (x) { return !x.hasAttribute('hidden'); }); };
    var step = function () { var it = items()[0]; if (!it) return track.clientWidth * 0.8; var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16; return it.getBoundingClientRect().width + gap; };
    var go = function (dir) { track.scrollBy({ left: dir * step(), behavior: reduced ? 'auto' : 'smooth' }); };
    var upd = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
      if (count) {
        var n = items().length, s = step(), first = Math.min(n, Math.round(track.scrollLeft / s) + 1);
        var vis = Math.max(1, Math.floor((track.clientWidth + 4) / s));
        count.textContent = n ? 'Looks ' + first + (vis > 1 ? '–' + Math.min(n, first + vis - 1) : '') + ' of ' + n : '';
      }
    };
    var t = false;
    track.addEventListener('scroll', function () { if (!t) { t = true; win.requestAnimationFrame(function () { t = false; upd(); }); } }, { passive: true });
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    track.addEventListener('cocoa:filtered', function () { setTimeout(upd, 60); });
    win.addEventListener('resize', upd, { passive: true });
    upd();
  });
})();
