/* /demo/amairanymua-01 — ATELIER Portfolio: the category filter for "Every look" and the look viewer.
   Plain ES2017, one IIFE, no dependencies, no network. Everything is an enhancement: without script
   every look shows and every tile is a link to its largest file. (The runway and the films are
   site.js's; this file only holds the page's films while the viewer covers them.) */
(function () {
  'use strict';
  var doc = document, win = window, root = doc.documentElement;
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var reduced = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var pad = function (k) { return (k < 10 ? '0' : '') + k; };
  var EASE = 'cubic-bezier(.22,.8,.24,1)', EASE_IO = 'cubic-bezier(.7,0,.2,1)';
  var syncFilms = function () { if (win.Atelier && win.Atelier.syncFilms) win.Atelier.syncFilms(); };

  var grid = doc.querySelector('[data-all]');
  if (!grid) return;
  var tiles = $$('.lt', grid);

  /* ---------------- every look: the category filter ---------------- */
  var chips = $$('.lk-bar .chip');
  var status = doc.querySelector('[data-all-status]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var cat = chip.getAttribute('data-cat') || '';
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      var shown = [];
      tiles.forEach(function (t) {
        var show = !cat || (' ' + t.getAttribute('data-cats') + ' ').indexOf(' ' + cat + ' ') > -1;
        t.hidden = !show;
        if (show) shown.push(t);
      });
      if (status) status.textContent = 'Showing ' + shown.length + (shown.length === 1 ? ' look' : ' looks') + (cat ? ': ' + chip.firstChild.textContent.trim() : '') + '.';
      if (!reduced) shown.forEach(function (t, i) {
        if (t.animate && i < 16) t.animate([{ opacity: 0, transform: 'translate3d(0,18px,0)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: i * 45, easing: EASE, fill: 'backwards' });
      });
    });
  });

  /* the home page's named galleries open this page at #bridal, #full or #hair: select that category */
  var fromHash = function () {
    var h = (location.hash || '').slice(1);
    if (!h) return;
    var chip = chips.filter(function (c) { return c.getAttribute('data-cat') === h; })[0];
    if (chip && chip.getAttribute('aria-pressed') !== 'true') chip.click();
  };
  fromHash();
  win.addEventListener('hashchange', fromHash);

  /* ---------------- the look viewer ----------------
     A modal dialog moved to the end of <body> so everything else can be made inert while it is
     open. Focus goes to Close and stays inside; Escape and Close shut it; the arrow keys, the arrow
     buttons and a sideways swipe move through the looks that are showing; the page behind is pinned
     so it cannot scroll, and its films are held (paused) while it is covered; focus returns to the
     tile it came from. The large file loads only when a look is opened, and each change is a wipe in
     the direction of travel (never a cross-fade). Where a look has a clip, "Watch the clip" plays it
     in place of the photograph. */
  var vw = doc.getElementById('lookViewer');
  if (!vw) return;
  doc.body.appendChild(vw);
  var links = $$('[data-vw]', grid);
  var img = vw.querySelector('[data-vw-img]'), stage = vw.querySelector('[data-vw-stage]'), filmBox = vw.querySelector('[data-vw-film]');
  var nEl = vw.querySelector('[data-vw-n]'), tEl = vw.querySelector('[data-vw-t]'), capEl = vw.querySelector('[data-vw-cap]');
  var closeB = vw.querySelector('[data-vw-close]'), prevB = vw.querySelector('[data-vw-prev]'), nextB = vw.querySelector('[data-vw-next]');
  var clipB = vw.querySelector('[data-vw-clip]'), fullA = vw.querySelector('[data-vw-full]');
  if (!img || !stage || !closeB || !capEl) return;
  var list = [], cur = 0, from = null, lockY = 0, token = 0, inerted = [], held = [], video = null, clipOn = false;

  var isOpen = function () { return !vw.hidden; };
  var lock = function (on) {
    var b = doc.body.style;
    if (on) { lockY = win.scrollY || win.pageYOffset || 0; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
    else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; win.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
  };
  var setInert = function (on) {
    if (on) {
      inerted = Array.prototype.filter.call(doc.body.children, function (el) { return el !== vw && el.tagName !== 'SCRIPT' && !el.hasAttribute('inert'); });
      inerted.forEach(function (el) { el.inert = true; el.setAttribute('inert', ''); });
    } else {
      inerted.forEach(function (el) { el.inert = false; el.removeAttribute('inert'); });
      inerted = [];
    }
  };
  /* hold every film on the page while the viewer covers it (site.js honours data-held) */
  var holdFilms = function (on) {
    if (on) {
      held = $$('video[data-film]').filter(function (v) { return !v.hasAttribute('data-held'); });
      held.forEach(function (v) { v.setAttribute('data-held', ''); if (!v.paused) v.pause(); });
    } else {
      held.forEach(function (v) { v.removeAttribute('data-held'); });
      held = [];
    }
    syncFilms();
  };

  var stopClip = function () {
    if (video) { try { video.pause(); } catch (e) {} video.removeAttribute('src'); try { video.load(); } catch (e) {} }
    if (filmBox) filmBox.hidden = true;
    img.hidden = false;
    clipOn = false;
    if (clipB) clipB.textContent = 'Watch the clip';
  };
  var playClip = function () {
    var a = list[cur]; if (!a || !filmBox) return;
    var mp4 = a.getAttribute('data-film-mp4'); if (!mp4) return;
    if (!video) {
      video = doc.createElement('video');
      video.muted = true; video.loop = true; video.playsInline = true;
      video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.setAttribute('disablepictureinpicture', '');
      video.preload = 'auto';
      filmBox.appendChild(video);
    }
    video.controls = reduced;
    video.poster = a.getAttribute('data-film-poster') || '';
    video.style.objectPosition = a.getAttribute('data-film-pos') || '50% 30%';
    var cr = a.getAttribute('data-cr');
    video.setAttribute('aria-label', (a.getAttribute('data-film-alt') || 'Silent looping clip.') + (cr ? ' ' + cr + '.' : ''));
    video.src = mp4;
    img.hidden = true; filmBox.hidden = false;
    clipOn = true;
    if (clipB) clipB.textContent = 'Show the photograph';
    var p = video.play(); if (p && p.catch) p.catch(function () { video.controls = true; });
  };

  var caption = function (k) {
    var a = list[k];
    capEl.textContent = '';
    var hid = doc.createElement('span'); hid.className = 'vh'; hid.textContent = 'Look ' + (k + 1) + ' of ' + list.length + ': ';
    capEl.appendChild(hid);
    capEl.appendChild(doc.createTextNode(a.getAttribute('data-cap') || ''));
    var cr = a.getAttribute('data-cr');
    if (cr) { var c = doc.createElement('span'); c.className = 'cap-cr'; c.textContent = cr; capEl.appendChild(c); }
    if (nEl) nEl.textContent = pad(k + 1);
    if (tEl) tEl.textContent = pad(list.length);
    if (clipB) clipB.hidden = !a.getAttribute('data-film-mp4');
    if (fullA) fullA.href = a.getAttribute('data-src') || a.getAttribute('href');
  };
  var show = function (k, dir) {
    var a = list[k]; if (!a) return;
    cur = k;
    if (clipOn) stopClip();
    caption(k);
    var my = ++token;
    var pre = new Image();
    pre.sizes = '(max-width:599px) 92vw, 600px';
    pre.srcset = a.getAttribute('data-srcset') || '';
    pre.src = a.getAttribute('data-src') || a.getAttribute('href');
    var swap = function () {
      if (my !== token) return;
      img.width = +a.getAttribute('data-w') || 1280; img.height = +a.getAttribute('data-h') || 1600;
      img.sizes = pre.sizes; img.srcset = pre.srcset; img.src = pre.src;
      /* never wider than the file allows: half its width on a phone, its width elsewhere */
      var fw = +a.getAttribute('data-w') || 1280, cap = Math.round(win.innerWidth <= 600 ? fw / 2 : fw);
      img.style.maxWidth = 'min(100%, ' + Math.min(600, cap) + 'px)';
      img.alt = a.getAttribute('data-alt') || '';
      if (dir && !reduced && img.animate) {
        img.animate([{ clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 680, easing: EASE_IO });
        img.animate([{ transform: 'translate3d(' + (dir * 3) + '%,0,0)' }, { transform: 'none' }], { duration: 900, easing: EASE });
      }
    };
    if (pre.decode) pre.decode().then(swap, swap); else { pre.onload = swap; pre.onerror = swap; }
  };
  var step = function (d) { if (list.length > 1) show((cur + d + list.length) % list.length, d); };
  var visibleLinks = function () { return links.filter(function (a) { var li = a.closest('li'); return !li || !li.hidden; }); };

  var open = function (k, el) {
    list = visibleLinks();
    if (k < 0) k = 0;
    from = el;
    var multi = list.length > 1;
    if (prevB) prevB.hidden = !multi;
    if (nextB) nextB.hidden = !multi;
    img.removeAttribute('src'); img.removeAttribute('srcset'); img.alt = '';
    show(k, 0);
    holdFilms(true);
    lock(true); setInert(true);
    vw.hidden = false; doc.body.classList.add('vw-open');
    if (!reduced && vw.animate) vw.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 620, easing: EASE_IO });
    closeB.focus({ preventScroll: true });
  };
  var close = function () {
    if (!isOpen()) return;
    stopClip();
    vw.hidden = true; doc.body.classList.remove('vw-open');
    setInert(false); lock(false);
    token++;
    holdFilms(false);
    if (from) from.focus({ preventScroll: true });
  };

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      open(visibleLinks().indexOf(a), a);
    });
  });
  closeB.addEventListener('click', close);
  if (prevB) prevB.addEventListener('click', function () { step(-1); });
  if (nextB) nextB.addEventListener('click', function () { step(1); });
  if (clipB) clipB.addEventListener('click', function () { if (clipOn) stopClip(); else playClip(); });
  vw.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); return; }
    if (e.key !== 'Tab') return;
    var f = $$('button:not([hidden]), a[href]', vw);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !vw.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !vw.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  });
  /* a sideways swipe on the picture */
  var sx = 0, sy = 0, st = 0;
  stage.addEventListener('touchstart', function (e) { var t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2 && Date.now() - st < 900) step(dx < 0 ? 1 : -1);
  }, { passive: true });
  win.addEventListener('pageshow', function (e) { if (e.persisted && isOpen()) close(); });
})();
