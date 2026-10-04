/* CONCEPT 04 — SILVER · entrance, index table, phone menu, demo-safe contact (≈6 KB) */
(function () {
  'use strict';
  var d = document, root = d.documentElement, JP = window.JP || {};
  var base = (window.JP_MEDIA && window.JP_MEDIA.base) || '../media/';

  /* 1 ─ Entrance: the slate. Phase classes land on <html>; CSS holds every hidden state under .js-anim:not(.is-opened).
         skipAfter 150: the "Tap to skip" hint is true from the first frame the hint is visible. */
  if (JP.sequence) {
    JP.sequence({
      key: 'c04',
      skipAfter: 150,
      steps: [
        { at: 0, add: 'c4-grid' },
        { at: 700, add: 'c4-slate' },
        { at: 1500, add: 'c4-wm', long: true },
        { at: 2300, add: 'c4-cells c4-wm' },   /* replay (long steps skipped): the wordmark hard-cuts in with the cells */
        { at: 3000, add: 'c4-line' }
      ],
      tail: 450
    }).start();
  }

  /* 2 ─ Selected work index: one row open at a time, keyboard native (buttons), height via grid-template-rows.
         Closed rows carry their media as data attributes only; the poster and the clip are hydrated on first open,
         so nothing below the fold downloads before it is asked for. */
  var list = d.getElementById('wk');
  var items = list ? Array.prototype.slice.call(list.querySelectorAll('.wk-item')) : [];
  function hydrate(scope) {
    scope.querySelectorAll('img[data-src]').forEach(function (n) {
      if (n.dataset.srcset) { n.srcset = n.dataset.srcset; n.removeAttribute('data-srcset'); }
      n.src = n.dataset.src; n.removeAttribute('data-src');
    });
    scope.querySelectorAll('figure[data-film]').forEach(function (f) {
      var id = f.getAttribute('data-film'); f.removeAttribute('data-film');
      if (JP.reduced || JP.saveData) return;            /* the poster stands; core.js would drop the sources anyway */
      var v = d.createElement('video');
      v.className = 'jp-video'; v.muted = true; v.loop = true; v.preload = 'none';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('loop', ''); v.setAttribute('aria-hidden', 'true');
      v.poster = base + 'film/' + id + '-poster.jpg';
      [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(function (t) {
        var s = d.createElement('source'); s.src = base + 'film/' + id + '.' + t[0]; s.type = t[1]; v.appendChild(s);
      });
      var grade = f.querySelector('.frame-grade');
      f.insertBefore(v, grade || null);
      if (JP.video) JP.video(v);
      if (f.closest('.wk-panel')) arbitrate(v);
    });
  }
  /* One playing loop per viewport: while an index clip is on screen AND playing, the hero cell loop (nr-dash) holds
     on its frame; the moment the clip has no pixels on screen (or is paused: row closed, scrolled past core.js's 160px
     margin) the hero is nudged again if it is still in view. core.js's own IO gating stays in charge of everything else. */
  var hero = d.querySelector('.cells video.jp-video');
  var indexVideos = [];
  var visIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.__vis = e.isIntersecting; wake(e.target); }); settle();
  }, { threshold: [0, 0.01] }) : null;
  function heroInView() {
    var r = hero.getBoundingClientRect(), m = 160;
    return r.bottom > -m && r.top < window.innerHeight + m && r.width > 0;
  }
  function indexOn() { return indexVideos.some(function (v) { return v.__vis && !v.paused && !v.ended && v.isConnected; }); }
  function settle() {
    if (!hero || !hero.isConnected) return;
    if (indexOn()) { if (!hero.paused) hero.pause(); return; }
    if (d.hidden || !heroInView()) return;
    if (hero.paused) { var p = hero.play(); if (p && p.catch) p.catch(function () {}); }
    /* the hero owns this viewport: an open row's clip that has scrolled out of sight (but is still inside core.js's
       prefetch margin) holds too; it is nudged back the moment it is visible again */
    indexVideos.forEach(function (v) { if (!v.__vis && !v.paused) v.pause(); });
  }
  function wake(v) {
    if (v.__vis && v.paused && v.isConnected && v.closest('.wk-item.is-open')) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  }
  function arbitrate(v) {
    if (!hero || indexVideos.indexOf(v) > -1) return;
    indexVideos.push(v);
    if (visIO) visIO.observe(v); else v.__vis = true;
    v.addEventListener('playing', settle);
    v.addEventListener('pause', settle);
  }
  if (hero) hero.addEventListener('playing', function () { if (indexOn()) hero.pause(); });
  function setOpen(item, open) {
    var btn = item.querySelector('.wk-row'), panel = item.querySelector('.wk-panel');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { panel.removeAttribute('inert'); hydrate(panel); }
    else panel.setAttribute('inert', '');
    var v = panel.querySelector('video.jp-video');
    if (v) {
      if (open) { if (!v.__jp && JP.video) JP.video(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    }
  }
  items.forEach(function (item) {
    var btn = item.querySelector('.wk-row');
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      items.forEach(function (o) { if (o !== item && o.classList.contains('is-open')) setOpen(o, false); });
      setOpen(item, open);
      if (open) {
        /* keep the row in view once the panel above it has collapsed */
        setTimeout(function () {
          var r = btn.getBoundingClientRect(), head = 64;
          if (r.top < head) window.scrollBy({ top: r.top - head - 8, behavior: 'smooth' });
        }, 460);
      }
    });
  });
  /* media that is in the markup but not asked for yet: the open row's clip (when a quarter of its frame is on screen),
     the exhibition photo in Credits (when the section approaches), the two side hero cells (desktop only). */
  function onView(el, margin, thr, fn) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(); } }); }, { rootMargin: margin, threshold: thr });
    io.observe(el);
  }
  items.forEach(function (item) { if (item.classList.contains('is-open')) { var f = item.querySelector('figure[data-film]'); if (f) onView(f, '0px', 0.25, function () { hydrate(item); }); } });
  var crFig = d.querySelector('.cr-fig');
  if (crFig) onView(crFig, '400px 0px', 0, function () { hydrate(crFig); });
  var cells = d.querySelector('.cells');
  if (cells) { var mq = window.matchMedia('(min-width:900px)'); var cellsIn = function () { if (mq.matches) hydrate(cells); }; cellsIn(); if (mq.addEventListener) mq.addEventListener('change', cellsIn); }

  /* 3 ─ Desktop fine-pointer hover preview (cols 9–12, fixed, crossfade). Polish only; everything works without it. */
  var prev = d.getElementById('wk-prev');
  if (prev && list && JP.finePointer && window.matchMedia('(min-width:1100px)').matches) {
    var imgs = null, cap = d.getElementById('wk-prev-cap'), cur = 0;
    var show = function (item) {
      if (!imgs) imgs = [0, 1].map(function () { var im = d.createElement('img'); im.alt = ''; im.decoding = 'async'; prev.insertBefore(im, cap); return im; });
      var src = base + item.getAttribute('data-prev');
      var next = imgs[1 - cur];
      if (imgs[cur].getAttribute('src') === src) { prev.classList.add('is-on'); return; }
      var swap = function () { imgs[cur].classList.remove('is-cur'); next.classList.add('is-cur'); cur = 1 - cur; };
      if (next.getAttribute('src') === src && next.complete) swap();
      else { next.onload = function () { next.onload = null; if (next.getAttribute('src') === src) swap(); }; next.setAttribute('src', src); }
      var yr = item.querySelector('.wk-year');
      cap.textContent = item.querySelector('.wk-no').textContent + ' · ' + item.querySelector('.wk-title').textContent + (yr ? ' · ' + yr.textContent : '');
      prev.classList.add('is-on');
    };
    items.forEach(function (item) {
      item.querySelector('.wk-row').addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') show(item); });
    });
    list.addEventListener('pointerleave', function () { prev.classList.remove('is-on'); });
  }

  /* 4 ─ Phone menu: full-screen gunmetal dialog, focus trap (menu button ⇄ links), Esc closes,
         inert when closed, the rest of the page inert while open, body scroll locked while open. */
  var mb = d.getElementById('menu-btn'), menu = d.getElementById('menu'), lastFocus = null;
  function focusables() { return Array.prototype.slice.call(menu.querySelectorAll('a[href],button:not([disabled])')); }
  function outside() { return Array.prototype.slice.call(d.querySelectorAll('#main,.foot,.study-nav,.skip')); }
  function openMenu() {
    lastFocus = d.activeElement;
    menu.hidden = false; menu.removeAttribute('inert');
    outside().forEach(function (n) { n.setAttribute('inert', ''); });
    mb.setAttribute('aria-expanded', 'true'); d.body.classList.add('menu-open');
    var f = focusables(); if (f[0]) f[0].focus();
    d.addEventListener('keydown', onMenuKey);
  }
  function closeMenu(restore) {
    menu.hidden = true; menu.setAttribute('inert', '');
    outside().forEach(function (n) { n.removeAttribute('inert'); });
    mb.setAttribute('aria-expanded', 'false'); d.body.classList.remove('menu-open');
    d.removeEventListener('keydown', onMenuKey);
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onMenuKey(e) {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key !== 'Tab') return;
    var f = focusables(), first = f[0], last = f[f.length - 1], a = d.activeElement;
    var inMenu = menu.contains(a) || a === mb;
    if (!e.shiftKey && (a === last || !inMenu)) { e.preventDefault(); mb.focus(); }
    else if (!e.shiftKey && a === mb) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && (a === first || !inMenu)) { e.preventDefault(); mb.focus(); }
    else if (e.shiftKey && a === mb) { e.preventDefault(); last.focus(); }
  }
  if (mb && menu) {
    mb.addEventListener('click', function () { if (menu.hidden) openMenu(); else closeMenu(); });
    menu.addEventListener('click', function (e) { var a = e.target.closest('a[href^="#"]'); if (a) closeMenu(false); });
    window.addEventListener('resize', function () { if (!menu.hidden && window.innerWidth >= 900) closeMenu(false); });
  }

  /* 5 ─ Demo-safe email control: no mailto, no form; it only confirms what happens at launch. */
  var eb = d.getElementById('email-btn'), note = d.getElementById('email-note');
  if (eb && note) {
    var t;
    eb.addEventListener('click', function () {
      note.textContent = 'Email is enabled at launch. Until then: Instagram @jp.media.';
      note.classList.add('is-flash');
      clearTimeout(t); t = setTimeout(function () { note.classList.remove('is-flash'); }, 1400);
    });
  }
})();
