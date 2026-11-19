/* /demo/amairanymua-01 — BLUSH portfolio: the filter chips and the look viewer.
   1. Chips (rendered [hidden], shown here): show one category of LOOKS3; a polite live line says
      how many are shown; the viewer then steps through the looks on show.
   2. The viewer: any tile opens it. A dialog: focus moves to Close and is trapped; Escape (or Close)
      leaves and focus returns to the tile; arrow keys, the round buttons and a swipe step through
      the looks; the page behind is inert and pinned, so it does not scroll. Each change cuts to the
      blush ground and her look opens in a circle (clip-path), so two faces never dissolve through
      each other. "See it larger" (her 1280 photographs only; her 576 reel stills are already shown
      at their own size) fetches the large file and follows the pointer or finger; "Watch the clip"
      plays the look's own clip, user-started, muted. Without this script every tile is a plain link
      to its largest file. Only transform, opacity and clip-path animate; animations are cancelled
      when they end. */
(function () {
  'use strict';
  var doc = document, win = window, root = doc.documentElement;
  var reduced = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var canAnim = !reduced && !!(doc.body && doc.body.animate);
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var EASE = 'cubic-bezier(.22,.8,.24,1)';
  var done = function (a) { if (a) a.onfinish = function () { try { a.cancel(); } catch (e) { /* ignore */ } }; return a; };

  var grid = $('pfAll');
  if (!grid) return;
  var tiles = $$('.pa-a', grid);
  var items = $$('.pa-i', grid);

  /* ================= 1. chips ================= */
  var bar = doc.querySelector('.pf-chips'), live = $('pfLive');
  if (bar) {
    bar.hidden = false;
    var chips = $$('.pf-chip', bar);
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        if (c.getAttribute('aria-pressed') === 'true') return;
        var cat = c.getAttribute('data-cat');
        chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
        var shown = [];
        items.forEach(function (li) {
          var on = cat === 'all' || (' ' + li.getAttribute('data-cats') + ' ').indexOf(' ' + cat + ' ') > -1;
          li.hidden = !on;
          if (on) { li.classList.add('in'); shown.push(li); }
        });
        var name = (c.querySelector('.pf-chip-t') || c).textContent;
        if (live) live.textContent = cat === 'all' ? 'Showing all ' + shown.length + ' looks.' : 'Showing ' + shown.length + ' ' + name.toLowerCase() + ' looks.';
        if (canAnim) shown.forEach(function (li, i) {
          done(li.animate([{ opacity: 0, transform: 'translate3d(0,14px,0)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: Math.min(i, 10) * 40, easing: EASE, fill: 'backwards' }));
        });
        if (win.__blushFrame) win.__blushFrame();
      });
    });
  }

  /* ================= 2. the viewer ================= */
  var bv = $('lookViewer');
  if (!bv) return;
  doc.body.appendChild(bv); /* a direct child of <body>, so everything behind it can be inert */
  var box = bv.querySelector('[data-bv-box]'), img = bv.querySelector('[data-bv-img]'), stage = bv.querySelector('[data-bv-stage]');
  var nEl = bv.querySelector('[data-bv-n]'), tEl = bv.querySelector('[data-bv-t]'), capEl = bv.querySelector('[data-bv-cap]'), crEl = bv.querySelector('[data-bv-cr]');
  var bClose = bv.querySelector('[data-bv-close]'), bPrev = bv.querySelector('[data-bv-prev]'), bNext = bv.querySelector('[data-bv-next]');
  var bClip = bv.querySelector('[data-bv-clip]'), clipT = bv.querySelector('[data-bv-clip-t]');
  var bZoom = bv.querySelector('[data-bv-zoom]'), zoomT = bv.querySelector('[data-bv-zoom-t]');
  if (!box || !img || !stage || !bClose) return;

  var read = function (a) {
    var g = function (k) { return a.getAttribute('data-' + k); };
    return { v: +g('v'), key: g('key'), w: +g('w'), h: +g('h'), big: +g('big'), ws: (g('ws') || '').split(',').map(Number), pos: g('pos'), alt: g('alt'), cap: g('cap'), credit: g('credit'), href: a.getAttribute('href'),
      film: g('film'), poster: g('poster'), filmAlt: g('film-alt'), filmPos: g('film-pos'), filmT: g('film-t'), from: parseFloat(g('film-from')) || 0 };
  };
  var looks = tiles.map(read);
  var base = function (L) { return L.href.replace(/-\d+\.webp$/, '-'); };
  var isSmall = function (L) { return L.big <= 640; }; /* her 576-wide reel stills */

  var set = [], at = 0, opener = null, isOpen = false, lockY = 0, token = 0, anims = [];
  var zoomed = false, clipOn = false, vid = null;
  var settle = function () { anims.forEach(function (a) { try { a.cancel(); } catch (e) { /* ignore */ } }); anims = []; };

  /* ---- the clip ---- */
  var stopClip = function () {
    clipOn = false;
    if (vid) { try { vid.pause(); } catch (e) { /* ignore */ } vid.removeAttribute('src'); try { vid.load(); } catch (e) { /* ignore */ } if (vid.parentNode) vid.parentNode.removeChild(vid); vid = null; }
    img.style.visibility = '';
    if (bClip) { bClip.setAttribute('aria-pressed', 'false'); if (clipT) clipT.textContent = 'Watch the clip'; }
  };
  var startClip = function (L) {
    if (!L.film) return;
    if (zoomed) setZoom(false);
    clipOn = true;
    vid = doc.createElement('video');
    vid.className = 'bv-vid';
    vid.muted = true; vid.defaultMuted = true; vid.setAttribute('muted', ''); vid.setAttribute('playsinline', ''); vid.playsInline = true;
    vid.setAttribute('disablepictureinpicture', ''); vid.setAttribute('disableremoteplayback', '');
    vid.preload = 'auto';
    if (L.poster) vid.poster = L.poster;
    vid.style.objectPosition = L.filmPos || '50% 50%';
    vid.setAttribute('aria-label', L.filmAlt || ('Silent clip: ' + (L.filmT || 'her work') + '.'));
    if (L.from > 0) {
      vid.addEventListener('ended', function () { try { vid.currentTime = L.from; } catch (e) { /* ignore */ } var p = vid.play(); if (p && p.catch) p.catch(function () {}); });
    } else vid.loop = true;
    vid.src = L.film + (L.from > 0 ? '#t=' + L.from : '');
    setBox(9 / 16, true);
    box.appendChild(vid);
    img.style.visibility = 'hidden';
    var p = vid.play(); if (p && p.catch) p.catch(function () { /* refused: the poster stands */ });
    if (bClip) { bClip.setAttribute('aria-pressed', 'true'); if (clipT) clipT.textContent = 'Show the photograph'; }
    wipe(0);
  };

  /* ---- the frame: sized to the look, never wider than its file allows ---- */
  var setBox = function (ar, small) {
    box.style.setProperty('--ar', ar.toFixed(4));
    box.classList.toggle('is-big', !small);
  };

  /* ---- the magnifier (1280 photographs only) ---- */
  var Z = 2.2, panXY = [0.5, 0.4], panRaf = 0;
  var applyPan = function () {
    panRaf = 0;
    var w = box.clientWidth, h = box.clientHeight;
    img.style.transform = 'translate3d(' + (-panXY[0] * w * (Z - 1)).toFixed(1) + 'px,' + (-panXY[1] * h * (Z - 1)).toFixed(1) + 'px,0) scale(' + Z + ')';
  };
  var panTo = function (cx, cy) {
    var r = box.getBoundingClientRect();
    panXY = [Math.max(0, Math.min(1, (cx - r.left) / r.width)), Math.max(0, Math.min(1, (cy - r.top) / r.height))];
    if (!panRaf) panRaf = (win.requestAnimationFrame || setTimeout)(applyPan);
  };
  var setZoom = function (on, cx, cy) {
    var L = looks[set[at]];
    if (on && (!L || isSmall(L) || clipOn)) return;
    zoomed = on;
    bv.classList.toggle('is-zoom', on);
    if (bZoom) { bZoom.setAttribute('aria-pressed', String(on)); if (zoomT) zoomT.textContent = on ? 'Back to fit' : 'See it larger'; }
    if (on) {
      settle(); box.style.clipPath = '';
      var big = base(L) + L.big + '.webp';
      if (img.getAttribute('src') !== big) {
        var hi = new Image();
        hi.onload = function () { if (zoomed && looks[set[at]] === L) { img.removeAttribute('srcset'); img.setAttribute('src', big); } };
        hi.src = big;
      }
      if (cx === undefined) { panXY = [0.5, 0.3]; applyPan(); } else panTo(cx, cy);
    } else img.style.transform = '';
  };

  /* ---- a circle opens on the look ---- */
  var wipe = function (dir) {
    if (!canAnim) return;
    settle();
    anims.push(done(box.animate([{ clipPath: 'circle(0% at 50% 42%)' }, { clipPath: 'circle(76% at 50% 42%)' }], { duration: 720, easing: EASE })));
    if (dir) anims.push(done(img.animate([{ transform: 'translate3d(' + (dir * 22) + 'px,0,0) scale(1.04)' }, { transform: 'none' }], { duration: 820, easing: EASE })));
  };

  var show = function (k, dir) {
    if (!set.length) return;
    at = (k + set.length) % set.length;
    var L = looks[set[at]];
    if (!L) return;
    var my = ++token;
    if (zoomed) setZoom(false);
    stopClip();
    nEl.textContent = pad(at + 1); tEl.textContent = pad(set.length);
    capEl.textContent = L.cap;
    if (crEl) { crEl.textContent = L.credit || ''; crEl.hidden = !L.credit; }
    var b = base(L), small = isSmall(L);
    var list = L.ws.filter(function (w) { return w && (small || w <= 800); });
    img.setAttribute('srcset', list.map(function (w) { return b + w + '.webp ' + w + 'w'; }).join(', '));
    img.setAttribute('sizes', small ? '(max-width:899px) 80vw, 420px' : '(max-width:899px) 92vw, 560px');
    img.setAttribute('src', b + (small ? L.big : 800) + '.webp');
    img.setAttribute('width', L.w); img.setAttribute('height', L.h);
    img.setAttribute('alt', L.alt);
    img.style.objectPosition = L.pos;
    setBox(L.w / L.h, small);
    box.classList.toggle('can-zoom', !small);
    if (bZoom) bZoom.hidden = small;
    if (bClip) bClip.hidden = !L.film;
    if (canAnim && dir !== null) {
      box.style.clipPath = 'circle(0% at 50% 42%)';
      var go = function () { if (my !== token) return; box.style.clipPath = ''; wipe(dir); };
      if (img.complete && img.naturalWidth) go();
      else { img.addEventListener('load', go, { once: true }); img.addEventListener('error', go, { once: true }); setTimeout(go, 900); }
    }
  };

  /* ---- open / close ---- */
  var behind = function () { return [doc.querySelector('.skip'), $('siteHeader'), $('main'), doc.querySelector('.ft'), $('blPill')].filter(Boolean); };
  var setInert = function (on) { behind().forEach(function (el) { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); try { el.inert = on; } catch (e) { /* ignore */ } }); };
  /* iOS ignores overflow:hidden on <body>: pin the page while open, as the menu does */
  var lock = function (on) {
    var s = doc.body.style;
    if (on) { lockY = win.scrollY; s.position = 'fixed'; s.top = '-' + lockY + 'px'; s.left = '0'; s.right = '0'; s.width = '100%'; }
    else { s.position = ''; s.top = ''; s.left = ''; s.right = ''; s.width = ''; root.style.scrollBehavior = 'auto'; win.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
  };
  /* the page's clips rest while the viewer is open (at most three ever play) */
  var pagePlaying = [];
  var restPage = function () {
    pagePlaying = $$('main video[data-film]').filter(function (v) { return !v.paused; });
    pagePlaying.forEach(function (v) { try { v.pause(); } catch (e) { /* ignore */ } });
  };
  var open = function (list, k, from) {
    if (isOpen) return;
    isOpen = true; opener = from; set = list;
    restPage();
    lock(true);
    bv.hidden = false;
    doc.body.classList.add('bv-open');
    setInert(true);
    show(k, canAnim ? 0 : null);
    if (canAnim) done(bv.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' }));
    setTimeout(function () { try { bClose.focus({ preventScroll: true }); } catch (e) { bClose.focus(); } }, 20);
  };
  var close = function () {
    if (!isOpen) return;
    isOpen = false; token++;
    settle(); box.style.clipPath = '';
    if (zoomed) setZoom(false);
    stopClip();
    var end = function () {
      bv.hidden = true;
      doc.body.classList.remove('bv-open');
      setInert(false);
      lock(false);
      if (opener) { try { opener.focus({ preventScroll: true }); } catch (e) { opener.focus(); } }
      if (win.__blushFilms && win.__blushFilms.schedule) win.__blushFilms.schedule();
    };
    if (canAnim) { var a = bv.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'ease-in' }); a.onfinish = end; } else end();
  };

  tiles.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      e.preventDefault();
      var list = tiles.filter(function (t) { return !t.closest('.pa-i').hidden; }).map(function (t) { return +t.getAttribute('data-v'); });
      var v = +a.getAttribute('data-v');
      open(list, Math.max(0, list.indexOf(v)), a);
    });
  });
  bClose.addEventListener('click', close);
  if (bPrev) bPrev.addEventListener('click', function () { show(at - 1, -1); });
  if (bNext) bNext.addEventListener('click', function () { show(at + 1, 1); });
  if (bZoom) bZoom.addEventListener('click', function () { setZoom(!zoomed); });
  if (bClip) bClip.addEventListener('click', function () { var L = looks[set[at]]; if (clipOn) { stopClip(); setBox(L.w / L.h, isSmall(L)); wipe(0); } else startClip(L); });
  /* a link inside the viewer (the inquiry) leaves the page: put the page back first */
  $$('a', bv).forEach(function (a) { a.addEventListener('click', function () { opener = null; }); });

  doc.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); if (zoomed) setZoom(false); else close(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1, 1); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1, -1); return; }
    if (e.key !== 'Tab') return;
    var f = $$('button, a[href]', bv).filter(function (el) { return !el.hidden && el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !bv.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !bv.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  });
  /* focus never leaves while it is open (the preview marker's links included) */
  doc.addEventListener('focusin', function (e) { if (isOpen && !bv.contains(e.target)) { try { bClose.focus({ preventScroll: true }); } catch (x) { bClose.focus(); } } });
  win.addEventListener('pageshow', function (e) { if (e.persisted && isOpen) close(); });

  /* swipe to step; tap a large photograph to magnify; drag to look around while magnified */
  var down = null;
  stage.addEventListener('pointerdown', function (e) {
    if (e.button) return;
    down = { x: e.clientX, y: e.clientY, onImg: box.contains(e.target) };
    if (zoomed) { try { stage.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } }
  });
  stage.addEventListener('pointermove', function (e) { if (zoomed && (e.pointerType === 'mouse' || down)) panTo(e.clientX, e.clientY); });
  stage.addEventListener('pointerup', function (e) {
    if (!down) return;
    var dx = e.clientX - down.x, dy = e.clientY - down.y, d = down; down = null;
    if (e.target && e.target.closest && e.target.closest('button')) return;
    if (zoomed) { if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && d.onImg) setZoom(false); return; }
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) { show(at + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); return; }
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && d.onImg && !clipOn) setZoom(true, e.clientX, e.clientY);
  });
  stage.addEventListener('pointercancel', function () { down = null; });
  stage.addEventListener('dragstart', function (e) { e.preventDefault(); });
})();
