/* /demo/amairanymua-01 — MAISON Portfolio: the runway, the category filter and the look viewer.
   Plain ES2017, one IIFE, no dependencies, no network. Everything is an enhancement: without script
   the runway is a swipe rail, every look shows, and every tile is a link to its large file. */
(function () {
  'use strict';
  var doc = document, win = window;
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var reduced = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var raf = win.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var pad = function (k) { return (k < 10 ? '0' : '') + k; };
  var EASE = 'cubic-bezier(.22,.8,.24,1)', EASE_IO = 'cubic-bezier(.77,0,.18,1)';
  var header = doc.getElementById('siteHeader');
  var hdH = function () { return header ? header.getBoundingClientRect().height : 0; };

  /* ---------------- The Looks: the runway ----------------
     Wide screens with motion allowed: the section is as tall as the runway is long, its viewport
     sticks under the header, and one rAF-throttled scroll handler moves the track sideways
     (transform only) while each photograph drifts a little against it. Everywhere else it is a
     native swipe rail with scroll-snap. The arrows and the keyboard work in both. */
  var rw = doc.querySelector('.rw');
  if (rw) (function () {
    var pin = rw.querySelector('.rw-pin'), track = rw.querySelector('.rw-track');
    if (!pin || !track) return;
    var items = $$('.rw-it[data-i]', track), n = items.length;
    var imgs = items.map(function (it) { return it.querySelector('.rw-m > img'); });
    var nEl = rw.querySelector('[data-rw-n]'), bar = rw.querySelector('[data-rw-bar]');
    var prevB = rw.querySelector('[data-rw-prev]'), nextB = rw.querySelector('[data-rw-next]');
    var pinned = false, maxX = 0, x = 0, tick = false;
    var canPin = function () { return !reduced && win.innerWidth >= 900 && win.innerHeight >= 560; };
    var padL = function () { return items[0].offsetLeft; };
    var measureMax = function () {
      var last = track.lastElementChild;
      var pr = parseFloat(win.getComputedStyle(track).paddingRight) || 0;
      return Math.max(0, last.offsetLeft + last.offsetWidth + pr - track.clientWidth);
    };
    var index = function () {
      if (x >= maxX - 4) return n - 1;
      var p = padL(), best = 0, d = Infinity;
      items.forEach(function (it, k) { var dd = Math.abs(it.offsetLeft - p - x); if (dd < d) { d = dd; best = k; } });
      return best;
    };
    var paint = function () {
      var c = index();
      if (nEl) nEl.textContent = pad(c + 1);
      if (bar) { bar.style.setProperty('--w', (100 / n).toFixed(3) + '%'); bar.style.setProperty('--x', (c * 100) + '%'); }
    };
    var update = function () {
      tick = false;
      if (pinned) {
        var r = rw.getBoundingClientRect();
        x = Math.min(maxX, Math.max(0, hdH() - r.top));
        track.style.transform = 'translate3d(' + (-x).toFixed(1) + 'px,0,0)';
        var vw = track.clientWidth;
        items.forEach(function (it, k) {
          var im = imgs[k]; if (!im) return;
          var d = (it.offsetLeft - x + it.offsetWidth / 2 - vw / 2) / vw;
          if (d > -1.3 && d < 1.3) im.style.transform = 'translate3d(' + (-d * 5).toFixed(2) + '%,0,0) scale(1.12)';
        });
      } else {
        x = track.scrollLeft;
        maxX = Math.max(0, track.scrollWidth - track.clientWidth);
      }
      paint();
    };
    var request = function () { if (!tick) { tick = true; raf(update); } };
    var layout = function () {
      var want = canPin();
      if (want !== pinned) {
        pinned = want;
        rw.classList.toggle('is-pinned', pinned);
        track.scrollLeft = 0;
        if (!pinned) {
          track.style.transform = ''; rw.style.height = '';
          imgs.forEach(function (im) { if (im) im.style.transform = ''; });
        }
      }
      if (pinned) {
        maxX = measureMax();
        rw.style.height = Math.round(pin.offsetHeight + maxX) + 'px';
      }
      update();
    };
    var goTo = function (k) {
      k = (k + n) % n;
      var target = Math.min(maxX, Math.max(0, items[k].offsetLeft - padL()));
      if (pinned) {
        var top = rw.getBoundingClientRect().top + (win.scrollY || win.pageYOffset || 0) - hdH() + target;
        win.scrollTo({ top: Math.round(top), behavior: reduced ? 'auto' : 'smooth' });
      } else {
        track.scrollTo({ left: target, behavior: reduced ? 'auto' : 'smooth' });
      }
    };
    var step = function (dir) {
      var c = index();
      if (dir > 0 && x >= maxX - 4) goTo(0);
      else if (dir < 0 && x <= 4) goTo(n - 1);
      else goTo(c + dir);
    };
    if (prevB) { prevB.hidden = false; prevB.addEventListener('click', function () { step(-1); }); }
    if (nextB) { nextB.hidden = false; nextB.addEventListener('click', function () { step(1); }); }
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
    track.addEventListener('scroll', function () { if (!pinned) request(); }, { passive: true });
    win.addEventListener('scroll', function () { if (pinned) request(); }, { passive: true });
    var rT = 0;
    win.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(layout, 120); }, { passive: true });
    win.addEventListener('load', layout);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(layout);
    layout();
  })();

  /* ---------------- every look: the category filter ---------------- */
  var grid = doc.querySelector('[data-all]');
  var chips = $$('.all-bar .chip');
  var status = doc.querySelector('[data-all-status]');
  var tiles = grid ? $$('.lt', grid) : [];
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
      grid.classList.toggle('is-f', !!cat);
      if (status) status.textContent = 'Showing ' + shown.length + (shown.length === 1 ? ' look' : ' looks') + (cat ? ': ' + chip.firstChild.textContent.trim() : '') + '.';
      if (!reduced) shown.forEach(function (t, i) {
        t.classList.add('in');
        if (t.animate) t.animate([{ opacity: 0, transform: 'translate3d(0,16px,0)' }, { opacity: 1, transform: 'none' }], { duration: 640, delay: i * 50, easing: EASE, fill: 'backwards' });
      });
    });
  });

  /* ---------------- the look viewer ----------------
     A modal dialog: moved to the end of <body> so everything else can be made inert while it is
     open; focus goes to Close and stays inside; Escape, the Close button, the arrows (keys and
     buttons) and a sideways swipe; the page behind is pinned so it cannot scroll; focus returns to
     the tile. The large file loads only when it is asked for, and each change is a wipe in the
     direction of travel (never a cross-fade). */
  var vw = doc.getElementById('lookViewer');
  if (vw && grid) (function () {
    doc.body.appendChild(vw);
    var links = $$('[data-vw]', grid);
    var img = vw.querySelector('[data-vw-img]'), stage = vw.querySelector('[data-vw-stage]');
    var nEl = vw.querySelector('[data-vw-n]'), tEl = vw.querySelector('[data-vw-t]'), capEl = vw.querySelector('[data-vw-cap]');
    var closeB = vw.querySelector('[data-vw-close]'), prevB = vw.querySelector('[data-vw-prev]'), nextB = vw.querySelector('[data-vw-next]');
    var list = [], cur = 0, last = null, lockY = 0, token = 0, inerted = [];
    var isOpen = function () { return !vw.hidden; };
    var lock = function (on) {
      var b = doc.body.style;
      if (on) { lockY = win.scrollY || win.pageYOffset || 0; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
      else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; doc.documentElement.style.scrollBehavior = 'auto'; win.scrollTo(0, lockY); doc.documentElement.style.scrollBehavior = ''; }
    };
    var setInert = function (on) {
      if (on) {
        inerted = Array.prototype.filter.call(doc.body.children, function (el) { return el !== vw && el.tagName !== 'SCRIPT' && !el.inert; });
        inerted.forEach(function (el) { el.inert = true; el.setAttribute('inert', ''); });
      } else {
        inerted.forEach(function (el) { el.inert = false; el.removeAttribute('inert'); });
        inerted = [];
      }
    };
    var caption = function (k) {
      var a = list[k];
      capEl.textContent = '';
      var hid = doc.createElement('span'); hid.className = 'vh'; hid.textContent = 'Look ' + (k + 1) + ' of ' + list.length + '. ';
      capEl.appendChild(hid);
      capEl.appendChild(doc.createTextNode(a.getAttribute('data-cap') || ''));
      if (nEl) nEl.textContent = pad(k + 1);
      if (tEl) tEl.textContent = pad(list.length);
    };
    var show = function (k, dir) {
      var a = list[k]; if (!a) return;
      cur = k;
      caption(k);
      var my = ++token;
      var pre = new Image();
      pre.sizes = '(max-width:899px) 100vw, 72vh';
      pre.srcset = a.getAttribute('data-srcset') || '';
      pre.src = a.getAttribute('data-src') || a.getAttribute('href');
      var swap = function () {
        if (my !== token) return;
        img.width = +a.getAttribute('data-w') || 1280; img.height = +a.getAttribute('data-h') || 1600;
        img.sizes = pre.sizes; img.srcset = pre.srcset; img.src = pre.src;
        img.alt = a.getAttribute('data-alt') || '';
        if (dir && !reduced && img.animate) {
          img.animate([{ clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 640, easing: EASE_IO });
          img.animate([{ transform: 'translate3d(' + (dir * 3) + '%,0,0)' }, { transform: 'none' }], { duration: 900, easing: EASE });
        }
      };
      if (pre.decode) pre.decode().then(swap, swap); else { pre.onload = swap; pre.onerror = swap; }
    };
    var step = function (d) { if (list.length > 1) show((cur + d + list.length) % list.length, d); };
    var open = function (k, from) {
      list = links.filter(function (a) { var li = a.closest('li'); return !li || !li.hidden; });
      if (k < 0) k = 0;
      last = from;
      var multi = list.length > 1;
      if (prevB) prevB.hidden = !multi; if (nextB) nextB.hidden = !multi;
      img.removeAttribute('src'); img.removeAttribute('srcset'); img.alt = '';
      show(k, 0);
      lock(true); setInert(true);
      vw.hidden = false; doc.body.classList.add('vw-open');
      if (!reduced && vw.animate) vw.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 560, easing: EASE_IO });
      closeB.focus({ preventScroll: true });
    };
    var close = function () {
      if (!isOpen()) return;
      vw.hidden = true; doc.body.classList.remove('vw-open');
      setInert(false); lock(false);
      token++;
      if (last) last.focus({ preventScroll: true });
    };
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        var vis = links.filter(function (x) { var li = x.closest('li'); return !li || !li.hidden; });
        open(vis.indexOf(a), a);
      });
    });
    closeB.addEventListener('click', close);
    if (prevB) prevB.addEventListener('click', function () { step(-1); });
    if (nextB) nextB.addEventListener('click', function () { step(1); });
    vw.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); return; }
      if (e.key !== 'Tab') return;
      var f = $$('button:not([hidden]), a[href]', vw);
      if (!f.length) return;
      var first = f[0], lastF = f[f.length - 1];
      if (e.shiftKey && (doc.activeElement === first || !vw.contains(doc.activeElement))) { e.preventDefault(); lastF.focus(); }
      else if (!e.shiftKey && (doc.activeElement === lastF || !vw.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
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
})();
