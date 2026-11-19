/* /demo/amairanymua-01 — COCOA Portfolio: the runway that advances on its own, the status line of
   the look filter, and the look viewer. site.js (on every page) already runs the rail's arrows and
   count, the filter chips and the film manager; this file only adds to them.
   Plain ES2017, one IIFE, no dependencies, no network. Without script: the runway is a swipe rail,
   every look shows, and every tile links to its largest file. */
(function () {
  'use strict';
  var doc = document, win = window;
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var reduced = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var films = function () { return (win.__cocoa && win.__cocoa.films) || null; };
  var pad = function (k) { return (k < 10 ? '0' : '') + k; };
  var EASE = 'cubic-bezier(.22,.8,.24,1)', EASE_IO = 'cubic-bezier(.65,0,.2,1)';
  var menu = doc.getElementById('menu');

  /* ---------------- The Looks: the runway advances on its own ----------------
     One card every few seconds (a slide along the rail, never a dissolve), back to the first look
     after the last. It rests while it is off screen, in a hidden tab, while the menu or the viewer
     is open, while a mouse is over it or focus is inside it, and for a while after any swipe, wheel,
     arrow or key. The pause button stops it for good (until pressed again). Under reduced motion it
     starts paused. While it moves on its own the "Looks 3–6 of 16" line stops announcing itself. */
  var runway = doc.querySelector('[data-runway]');
  var vwOpen = false;
  if (runway) (function () {
    var track = runway.querySelector('.rail-t'), btn = runway.querySelector('[data-rail-auto]');
    var count = runway.querySelector('[data-rail-count]');
    if (!track) return;
    var hold = parseInt(runway.getAttribute('data-hold'), 10) || 3800;
    var paused = reduced, visible = false, hover = false, focusIn = false, idleUntil = 0, timer = 0, auto = false;
    var items = function () { return $$('.rail-i', track).filter(function (x) { return !x.hasAttribute('hidden'); }); };
    var stepW = function () {
      var it = items()[0]; if (!it) return track.clientWidth * 0.8;
      var cs = win.getComputedStyle(track);
      return it.getBoundingClientRect().width + (parseFloat(cs.columnGap || cs.gap) || 16);
    };
    var running = function () {
      return !paused && visible && !hover && !focusIn && !doc.hidden && !vwOpen && Date.now() >= idleUntil &&
        !(menu && menu.classList.contains('open')) && items().length > 1;
    };
    var speak = function (on) { if (count) count.setAttribute('aria-live', on ? 'polite' : 'off'); };
    var advance = function () {
      var max = track.scrollWidth - track.clientWidth - 4;
      auto = true; speak(false);
      if (track.scrollLeft >= max) track.scrollTo({ left: 0, behavior: 'smooth' });
      else track.scrollBy({ left: stepW(), behavior: 'smooth' });
    };
    var schedule = function () {
      clearTimeout(timer);
      if (paused) return;
      var wait = Math.max(hold, idleUntil - Date.now());
      timer = setTimeout(function () { if (running()) advance(); schedule(); }, wait);
    };
    var touched = function () { idleUntil = Date.now() + 9000; auto = false; speak(true); schedule(); };
    var face = function () {
      if (!btn) return;
      btn.classList.toggle('is-paused', paused);
      btn.setAttribute('aria-label', paused ? 'Play the looks' : 'Pause the looks');
    };
    if (btn) btn.addEventListener('click', function () { paused = !paused; face(); if (!paused) idleUntil = 0; speak(paused); schedule(); });
    ['pointerdown', 'wheel', 'touchstart'].forEach(function (n) { track.addEventListener(n, touched, { passive: true }); });
    track.addEventListener('keydown', touched);
    $$('[data-rail-prev],[data-rail-next]', runway).forEach(function (b) { b.addEventListener('click', touched); });
    runway.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hover = true; } });
    runway.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hover = false; schedule(); } });
    track.addEventListener('focusin', function () { focusIn = true; speak(true); });
    track.addEventListener('focusout', function () { focusIn = false; schedule(); });
    track.addEventListener('cocoa:filtered', touched);
    if ('IntersectionObserver' in win) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting; }); schedule(); }, { threshold: 0.35 }).observe(track);
    } else visible = true;
    doc.addEventListener('visibilitychange', schedule);
    face();
    schedule();
    win.__cocoaRunway = { schedule: schedule };
  })();

  /* ---------------- every look: a status line for the filter ---------------- */
  var grid = doc.getElementById('pfAll');
  var status = doc.querySelector('[data-all-status]');
  if (grid && status) grid.addEventListener('cocoa:filtered', function (e) {
    var d = e.detail || {}, n = d.shown || 0, lbl = String(d.label || '').replace(/\d+\s*$/, '').trim();
    status.textContent = 'Showing ' + n + (n === 1 ? ' look' : ' looks') + (lbl && lbl !== 'All' ? ': ' + lbl : '') + '.';
    if (!reduced) $$('.pa-i:not([hidden])', grid).forEach(function (t, i) {
      if (t.animate) t.animate([{ opacity: 0, transform: 'translate3d(0,14px,0)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: Math.min(i, 12) * 40, easing: EASE, fill: 'backwards' });
    });
  });

  /* ---------------- the look viewer ----------------
     A modal dialog, moved to the end of <body> so everything else can be made inert while it is
     open. Focus goes to Close and stays inside; Escape and Close shut it; the arrow keys, the
     buttons and a sideways swipe move through the looks currently shown by the filter; the page
     behind is pinned so it cannot scroll; focus returns to the tile it came from. The large file is
     fetched only when a look is opened. Where a look has a clip, "Watch the clip" plays it in place
     (muted, looping, with controls) while every clip on the page behind is held still. */
  var vw = doc.getElementById('lookViewer');
  if (vw && grid) (function () {
    doc.body.appendChild(vw);
    var links = $$('[data-vw]', grid);
    var box = vw.querySelector('[data-vw-box]'), img = vw.querySelector('[data-vw-img]'), stage = vw.querySelector('[data-vw-stage]');
    var nEl = vw.querySelector('[data-vw-n]'), tEl = vw.querySelector('[data-vw-t]'), capEl = vw.querySelector('[data-vw-cap]');
    var closeB = vw.querySelector('[data-vw-close]'), prevB = vw.querySelector('[data-vw-prev]'), nextB = vw.querySelector('[data-vw-next]');
    var clipB = vw.querySelector('[data-vw-clip]'), clipT = vw.querySelector('[data-vw-clip-t]');
    if (!box || !img || !closeB) return;
    var video = null, list = [], cur = 0, last = null, lockY = 0, token = 0, inerted = [];
    var isOpen = function () { return !vw.hidden; };
    var lock = function (on) {
      var b = doc.body.style, r = doc.documentElement;
      if (on) { lockY = win.scrollY || win.pageYOffset || 0; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
      else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; r.style.scrollBehavior = 'auto'; win.scrollTo(0, lockY); r.style.scrollBehavior = ''; }
    };
    var setInert = function (on) {
      if (on) {
        inerted = Array.prototype.filter.call(doc.body.children, function (el) { return el !== vw && el.tagName !== 'SCRIPT' && !el.inert && !el.classList.contains('demo-flag'); });
        inerted.forEach(function (el) { el.inert = true; el.setAttribute('inert', ''); });
      } else {
        inerted.forEach(function (el) { el.inert = false; el.removeAttribute('inert'); });
        inerted = [];
      }
    };
    var hold = function (on) { var f = films(); if (f && f.setHold) f.setHold(on ? function () { return true; } : null); };

    /* the clip, made on demand and reused */
    var stopClip = function () {
      if (!video) return;
      try { video.pause(); } catch (e) {}
      video.hidden = true;
      video.removeAttribute('src');
      try { video.load(); } catch (e) {}
      img.hidden = false;
      if (clipB) { clipB.classList.remove('is-on'); clipB.setAttribute('aria-pressed', 'false'); }
      if (clipT) clipT.textContent = 'Watch the clip';
    };
    var playClip = function () {
      var a = list[cur]; if (!a || !a.getAttribute('data-film')) return;
      if (!video) {
        video = doc.createElement('video');
        video.muted = true; video.loop = true; video.playsInline = true; video.controls = true;
        video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.setAttribute('loop', '');
        video.setAttribute('disablepictureinpicture', ''); video.setAttribute('disableremoteplayback', '');
        video.width = 576; video.height = 1024; video.hidden = true;
        box.appendChild(video);
      }
      video.poster = a.getAttribute('data-poster') || '';
      video.style.objectPosition = a.getAttribute('data-film-pos') || '50% 50%';
      video.setAttribute('aria-label', a.getAttribute('data-film-alt') || 'Silent clip');
      /* her reels open on the "before": start where the finished glam appears, as site.js does */
      var t0 = parseFloat(a.getAttribute('data-film-start')) || 0;
      if (t0) video.addEventListener('loadedmetadata', function () { if (t0 < (video.duration || 0) - 0.5) { try { video.currentTime = t0; } catch (e) {} } }, { once: true });
      video.src = a.getAttribute('data-film');
      img.hidden = true; video.hidden = false;
      var p; try { p = video.play(); } catch (e) {} if (p && p.catch) p.catch(function () {});
      if (clipB) { clipB.classList.add('is-on'); clipB.setAttribute('aria-pressed', 'true'); }
      if (clipT) clipT.textContent = 'Show the photograph';
      if (!reduced && video.animate) video.animate([{ clipPath: 'inset(100% 0 0 0 round 6px)' }, { clipPath: 'inset(0 0 0 0 round 6px)' }], { duration: 560, easing: EASE_IO });
    };

    var caption = function (k) {
      var a = list[k];
      capEl.textContent = '';
      var hid = doc.createElement('span'); hid.className = 'vh'; hid.textContent = 'Look ' + (k + 1) + ' of ' + list.length + '. ';
      capEl.appendChild(hid);
      capEl.appendChild(doc.createTextNode(a.getAttribute('data-cap') || ''));
      var cr = a.getAttribute('data-credit');
      if (cr) { var c = doc.createElement('span'); c.className = 'cap-cr'; c.textContent = cr; capEl.appendChild(c); }
      if (nEl) nEl.textContent = pad(k + 1);
      if (tEl) tEl.textContent = pad(list.length);
      if (clipB) clipB.hidden = !a.getAttribute('data-film');
    };
    var show = function (k, dir) {
      var a = list[k]; if (!a) return;
      cur = k;
      stopClip();
      caption(k);
      var my = ++token;
      var pre = new Image();
      pre.sizes = '(max-width:899px) 92vw, 60vh';
      pre.srcset = a.getAttribute('data-srcset') || '';
      pre.src = a.getAttribute('data-src') || a.getAttribute('href');
      var swap = function () {
        if (my !== token) return;
        img.width = +a.getAttribute('data-w') || 576; img.height = +a.getAttribute('data-h') || 1024;
        img.sizes = pre.sizes; img.srcset = pre.srcset; img.src = pre.src;
        img.alt = a.getAttribute('data-alt') || '';
        if (dir && !reduced && img.animate) {
          img.animate([{ clipPath: dir > 0 ? 'inset(0 0 0 100% round 6px)' : 'inset(0 100% 0 0 round 6px)' }, { clipPath: 'inset(0 0 0 0 round 6px)' }], { duration: 620, easing: EASE_IO });
          img.animate([{ transform: 'translate3d(' + (dir * 3) + '%,0,0)' }, { transform: 'none' }], { duration: 860, easing: EASE });
        }
      };
      if (pre.decode) pre.decode().then(swap, swap); else { pre.onload = swap; pre.onerror = swap; }
    };
    var step = function (d) { if (list.length > 1) show((cur + d + list.length) % list.length, d); };
    var visibleLinks = function () { return links.filter(function (x) { var li = x.closest('li'); return !li || !li.hasAttribute('hidden'); }); };
    var open = function (k, from) {
      list = visibleLinks();
      if (k < 0) k = 0;
      last = from;
      var multi = list.length > 1;
      if (prevB) prevB.hidden = !multi; if (nextB) nextB.hidden = !multi;
      img.removeAttribute('src'); img.removeAttribute('srcset'); img.alt = '';
      vwOpen = true; hold(true);
      show(k, 0);
      lock(true); setInert(true);
      vw.hidden = false; doc.body.classList.add('vw-open'); doc.documentElement.classList.add('vw-on');
      if (!reduced && vw.animate) vw.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 520, easing: EASE_IO });
      try { closeB.focus({ preventScroll: true }); } catch (e) { closeB.focus(); }
    };
    var close = function () {
      if (!isOpen()) return;
      stopClip();
      vw.hidden = true; doc.body.classList.remove('vw-open'); doc.documentElement.classList.remove('vw-on');
      setInert(false); lock(false);
      token++; vwOpen = false; hold(false);
      if (win.__cocoaRunway) win.__cocoaRunway.schedule();
      if (last) { try { last.focus({ preventScroll: true }); } catch (e) { last.focus(); } }
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
    if (clipB) clipB.addEventListener('click', function () { if (video && !video.hidden) stopClip(); else playClip(); });
    vw.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); close(); return; }
      var inVideo = e.target === video;
      if (e.key === 'ArrowRight' && !inVideo) { e.preventDefault(); step(1); return; }
      if (e.key === 'ArrowLeft' && !inVideo) { e.preventDefault(); step(-1); return; }
      if (e.key !== 'Tab') return;
      var f = $$('button:not([hidden]), a[href], video:not([hidden])', vw);
      if (!f.length) return;
      var first = f[0], lastF = f[f.length - 1];
      if (e.shiftKey && (doc.activeElement === first || !vw.contains(doc.activeElement))) { e.preventDefault(); lastF.focus(); }
      else if (!e.shiftKey && (doc.activeElement === lastF || !vw.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
    });
    /* a sideways swipe on the picture (touch), left to the page for vertical moves */
    var sx = 0, sy = 0, st = 0, tracking = false;
    stage.addEventListener('touchstart', function (e) { var t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); tracking = true; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (!tracking) return; tracking = false;
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2 && Date.now() - st < 900) step(dx < 0 ? 1 : -1);
    }, { passive: true });
    win.addEventListener('pageshow', function (e) { if (e.persisted && isOpen()) close(); });
  })();
})();
