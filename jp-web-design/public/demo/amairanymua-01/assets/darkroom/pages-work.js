/* /demo/amairanymua-01 — site "darkroom": the Portfolio page.
   1. The drying line: prev / next, mouse drag, a progress line; the sway rests off screen.
   2. The contact sheet's category tabs.
   3. The loupe: any frame on the sheet or print on the line opens a large print on the red-lit
      table. Focus moves in and is trapped; Escape and Close leave and focus returns to the frame;
      arrow keys, buttons and swipe step through the looks; the page behind is inert and does not
      scroll. A change of look first cuts to blank paper and then develops (paper -> faint -> mid ->
      her photograph): never two faces dissolved through each other. "Loupe" magnifies the print
      (the 1280 file is fetched only then) and follows the pointer or finger.
   Without this script the line still scrolls natively and every frame links to its 1280 file.
   Only transform and opacity are animated; animations are cancelled when they end. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnim = !reduced && !!(doc.body && doc.body.animate);
  var hasIO = 'IntersectionObserver' in window;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var DEV_EASE = 'cubic-bezier(.55,.06,.45,.94)';
  var finishAll = function (list) { (list || []).forEach(function (x) { try { x.finish(); } catch (e) {} }); };

  /* ================= 1. the drying line ================= */
  var dl = $('dryingLine'), vp = $('dlVp');
  if (dl && vp) {
    var items = $$('.dl-i', vp), prog = $('dlProg'), bPrev = $('dlPrev'), bNext = $('dlNext');
    var ticking = false;
    var frame = function () {
      ticking = false;
      var max = vp.scrollWidth - vp.clientWidth, x = vp.scrollLeft;
      var p = max > 0 ? x / max : 1, seen = vp.scrollWidth ? vp.clientWidth / vp.scrollWidth : 1;
      if (prog) prog.style.transform = 'scaleX(' + Math.min(1, seen + (1 - seen) * p).toFixed(4) + ')';
      if (bPrev) bPrev.setAttribute('aria-disabled', String(x < 4));
      if (bNext) bNext.setAttribute('aria-disabled', String(x > max - 4));
    };
    var queue = function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    vp.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    frame();

    /* step by about a screenful, landing on a print's left edge */
    var step = function (dir) {
      var edge = parseFloat(getComputedStyle(vp).scrollPaddingLeft) || 0;
      var x = vp.scrollLeft, want = x + dir * Math.max(200, (vp.clientWidth - 2 * edge) * 0.85);
      var lefts = items.map(function (it) { return it.offsetLeft - edge; }), best = null;
      var ahead = lefts.filter(function (l) { return dir > 0 ? l > x + 8 : l < x - 8; });
      var inReach = ahead.filter(function (l) { return dir > 0 ? l <= want + 8 : l >= want - 8; });
      if (inReach.length) best = dir > 0 ? Math.max.apply(null, inReach) : Math.min.apply(null, inReach);
      else if (ahead.length) best = dir > 0 ? ahead[0] : ahead[ahead.length - 1];
      else best = dir > 0 ? vp.scrollWidth : 0;
      best = Math.max(0, best);
      try { vp.scrollTo({ left: best, behavior: reduced ? 'auto' : 'smooth' }); } catch (e) { vp.scrollLeft = best; }
    };
    if (bPrev) bPrev.addEventListener('click', function () { if (bPrev.getAttribute('aria-disabled') !== 'true') step(-1); });
    if (bNext) bNext.addEventListener('click', function () { if (bNext.getAttribute('aria-disabled') !== 'true') step(1); });

    /* drag with a mouse (touch and trackpads scroll natively) */
    var drag = null, moved = false;
    vp.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, s: vp.scrollLeft }; moved = false;
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (!moved && Math.abs(dx) > 6) { moved = true; vp.classList.add('is-drag'); }
      if (moved) vp.scrollLeft = drag.s - dx;
    });
    var endDrag = function () {
      if (!drag) return;
      drag = null;
      if (moved) { vp.classList.remove('is-drag'); setTimeout(function () { moved = false; }, 0); }
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    /* a drag is not a tap: swallow the click that ends it */
    vp.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    vp.addEventListener('dragstart', function (e) { e.preventDefault(); });

    /* the sway rests off screen */
    if (hasIO) new IntersectionObserver(function (es) { es.forEach(function (e) { dl.classList.toggle('is-still', !e.isIntersecting); }); }).observe(dl);
  }

  /* ================= 2. the category tabs ================= */
  var tabs = $$('.pf-tab'), frames = $$('.pf-f'), live = $('pfLive');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var c = t.getAttribute('data-cat');
      if (t.getAttribute('aria-pressed') === 'true') return;
      tabs.forEach(function (x) { x.setAttribute('aria-pressed', String(x === t)); });
      var shown = [];
      frames.forEach(function (f) {
        var on = c === 'all' || (' ' + f.getAttribute('data-cats') + ' ').indexOf(' ' + c + ' ') > -1;
        f.hidden = !on;
        if (on) shown.push(f);
      });
      var name = (t.querySelector('.pf-tab-t') || t).textContent;
      if (live) live.textContent = c === 'all' ? 'Showing all ' + shown.length + ' looks.' : 'Showing ' + shown.length + ' ' + name.toLowerCase() + ' looks.';
      if (canAnim) shown.forEach(function (f, i) {
        var a = f.animate([{ opacity: 0, transform: 'translate3d(0,14px,0)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: i * 45, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
        a.onfinish = function () { try { a.cancel(); } catch (e) {} };
      });
    });
  });

  /* ================= 3. the loupe ================= */
  var lp = $('loupe');
  if (!lp) return;
  doc.body.appendChild(lp); /* out of <main>, so everything behind it can be made inert */
  var img = $('lpImg'), im = $('lpIm'), pr = $('lpPr'), dv = pr && pr.querySelector('.dv'), paper = dv && dv.querySelector('.dv-p');
  var nEl = $('lpN'), tEl = $('lpT'), frEl = $('lpFr'), cn = $('lpCn'), ct = $('lpCt');
  var bClose = $('lpClose'), lPrev = $('lpPrev'), lNext = $('lpNext'), bZoom = $('lpZoom'), stage = $('lpStage');
  var IMG = lp.getAttribute('data-img'), DEV = lp.getAttribute('data-dev');
  if (!img || !im || !pr || !bClose) return;

  var read = function (a) {
    return { v: +a.getAttribute('data-v'), key: a.getAttribute('data-photo'), w: +a.getAttribute('data-w'), h: +a.getAttribute('data-h'), pos: a.getAttribute('data-pos'), cap: a.getAttribute('data-cap'), n: a.getAttribute('data-n'), alt: a.getAttribute('data-alt') };
  };
  var looks = [];
  frames.forEach(function (a) { var d = read(a); looks[d.v] = d; });
  var allIdx = looks.map(function (x, i) { return i; });

  /* develop stages, as on the home page: load once per look, then call back */
  var stages = function (cb) {
    if (!dv) { cb(); return; }
    var key = dv.getAttribute('data-l');
    if (dv.__key === key && dv.__ready) { cb(); return; }
    if (dv.__key !== key) {
      dv.__key = key; dv.__ready = false; dv.__cbs = [];
      var want = 0, got = 0;
      var settle = function () { got += 1; if (got >= want) { dv.__ready = true; var c = dv.__cbs; dv.__cbs = []; c.forEach(function (f) { f(); }); } };
      [['data-l', '.dv-l'], ['data-m', '.dv-m']].forEach(function (k) {
        var u = dv.getAttribute(k[0]), el = dv.querySelector(k[1]);
        if (!el) return;
        el.style.backgroundImage = '';
        if (!u) return;
        want += 1;
        var pic = new Image();
        pic.onload = function () { if (dv.__key === key) el.style.backgroundImage = 'url("' + u + '")'; settle(); };
        pic.onerror = settle;
        pic.src = u;
      });
      if (!want) dv.__ready = true;
    }
    if (dv.__ready) cb(); else dv.__cbs.push(cb);
  };
  var whenImg = function (cb, max) {
    var fired = false, go = function () { if (!fired) { fired = true; cb(); } };
    if (img.complete && img.naturalWidth) { go(); return; }
    img.addEventListener('load', go, { once: true });
    img.addEventListener('error', go, { once: true });
    setTimeout(go, max || 1500);
  };
  var develop = function (dur) {
    if (!dv || !canAnim) return [];
    pr.classList.add('is-dev');
    var anims = [], ended = false;
    var A = function (sel, a, b) {
      var el = dv.querySelector(sel);
      if (!el) return;
      anims.push(el.animate([{ opacity: 1 }, { opacity: 1, offset: a, easing: DEV_EASE }, { opacity: 0, offset: b }, { opacity: 0 }], { duration: dur, fill: 'both' }));
    };
    A('.dv-p', 0, 0.36); A('.dv-l', 0.36, 0.68); A('.dv-m', 0.68, 1);
    var fin = function () { if (ended) return; ended = true; pr.classList.remove('is-dev'); anims.forEach(function (x) { try { x.cancel(); } catch (e) {} }); };
    Promise.all(anims.map(function (x) { return x.finished; })).then(fin, fin);
    return anims;
  };

  /* ---- the magnifier ---- */
  var Z = 2.4, zoomed = false, panRaf = 0, panXY = [0.5, 0.5];
  var applyPan = function () {
    panRaf = 0;
    var w = im.clientWidth, h = im.clientHeight;
    img.style.transform = 'translate3d(' + ((0.5 - panXY[0]) * w * (Z - 1)).toFixed(1) + 'px,' + ((0.5 - panXY[1]) * h * (Z - 1)).toFixed(1) + 'px,0) scale(' + Z + ')';
  };
  var panTo = function (cx, cy) {
    var r = im.getBoundingClientRect();
    panXY = [Math.max(0, Math.min(1, (cx - r.left) / r.width)), Math.max(0, Math.min(1, (cy - r.top) / r.height))];
    if (!panRaf) panRaf = requestAnimationFrame(applyPan);
  };
  var setZoom = function (on, cx, cy) {
    zoomed = on;
    pr.classList.toggle('is-zoom', on);
    if (bZoom) bZoom.setAttribute('aria-pressed', String(on));
    if (on) {
      finishAll(busy); busy = [];
      /* the 1280 file, fetched only now; the print keeps the smaller file on screen until it is in */
      var key = looks[set[at]] && looks[set[at]].key, big = IMG + key + '-1280.webp';
      if (key && img.getAttribute('src') !== big) {
        var hi = new Image();
        hi.onload = function () { if (zoomed && looks[set[at]].key === key) { img.removeAttribute('srcset'); img.setAttribute('src', big); } };
        hi.src = big;
      }
      if (cx === undefined) { panXY = [0.5, 0.4]; applyPan(); } else panTo(cx, cy);
    } else {
      img.style.transform = '';
    }
  };

  /* ---- showing a look ---- */
  var set = allIdx, at = 0, opener = null, busy = [], token = 0, isOpen = false, lockY = 0;
  var show = function (k, dir) {
    at = (k + set.length) % set.length;
    var L = looks[set[at]];
    if (!L) return;
    if (zoomed) setZoom(false);
    var my = ++token;
    finishAll(busy); busy = [];
    if (canAnim && paper) { pr.classList.add('is-dev'); paper.style.opacity = '1'; } /* cut to blank paper */
    nEl.textContent = pad(at + 1); tEl.textContent = pad(set.length);
    frEl.textContent = '▸ ' + L.n; cn.textContent = '▸ ' + L.n; ct.textContent = L.cap;
    img.setAttribute('srcset', IMG + L.key + '-480.webp 480w, ' + IMG + L.key + '-800.webp 800w, ' + IMG + L.key + '-1280.webp 1280w');
    img.setAttribute('src', IMG + L.key + '-800.webp');
    img.setAttribute('width', L.w); img.setAttribute('height', L.h);
    img.setAttribute('alt', L.alt);
    img.style.objectPosition = L.pos;
    im.style.aspectRatio = L.w + '/' + L.h;
    im.style.setProperty('--pos', L.pos);
    pr.style.setProperty('--r', (L.w / L.h).toFixed(4));
    if (dv) { dv.setAttribute('data-l', DEV + L.key + '-l-800.webp'); dv.setAttribute('data-m', DEV + L.key + '-m-800.webp'); }
    if (!canAnim) return;
    if (dir) busy.push(stage.animate([{ transform: 'translate3d(' + (dir * 34) + 'px,0,0) rotate(' + (dir * 1.4) + 'deg)', easing: 'cubic-bezier(.2,.8,.2,1)' }, { transform: 'none' }], { duration: 520 }));
    var waited = false;
    var go = function () {
      if (my !== token || waited) return; waited = true;
      if (paper) paper.style.opacity = '';
      busy = busy.concat(develop(1150));
    };
    whenImg(function () { stages(go); setTimeout(go, 800); }, 1600);
  };

  /* ---- open / close ---- */
  var behind = function () { return [doc.querySelector('.skip'), $('siteHeader'), doc.getElementById('main'), doc.querySelector('.ft')].filter(Boolean); };
  var setInert = function (on) { behind().forEach(function (el) { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); try { el.inert = on; } catch (e) {} }); };
  /* iOS ignores overflow:hidden on <body>: pin the page while the loupe is open (as the menu does) */
  var lock = function (on) {
    var b = doc.body.style;
    if (on) { lockY = window.scrollY; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
    else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; window.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
  };
  var open = function (list, k, from) {
    if (isOpen) return;
    isOpen = true; opener = from; set = list.length ? list : allIdx;
    img.loading = 'eager';
    lock(true);
    lp.hidden = false;
    doc.body.classList.add('lp-open');
    setInert(true);
    show(k, 0);
    if (canAnim) {
      lp.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
      busy.push(stage.animate([{ transform: 'translate3d(0,46px,0) rotate(-3deg) scale(.96)', easing: 'cubic-bezier(.2,.8,.2,1)' }, { transform: 'none' }], { duration: 620 }));
    }
    setTimeout(function () { try { bClose.focus({ preventScroll: true }); } catch (e) { bClose.focus(); } }, 30);
  };
  var close = function () {
    if (!isOpen) return;
    isOpen = false; token++;
    finishAll(busy); busy = [];
    if (zoomed) setZoom(false);
    var end = function () {
      lp.hidden = true;
      doc.body.classList.remove('lp-open');
      setInert(false);
      lock(false);
      if (opener) { try { opener.focus({ preventScroll: true }); } catch (e) { opener.focus(); } }
    };
    if (canAnim) { var a = lp.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-in' }); a.onfinish = end; } else end();
  };

  /* every frame on the sheet and every print on the line opens it */
  $$('.pf-f, .dl-a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      e.preventDefault();
      var v = +a.getAttribute('data-v');
      /* from the sheet: the looks the current tab shows; from the line: every look */
      var list = a.classList.contains('pf-f') ? frames.filter(function (f) { return !f.hidden; }).map(function (f) { return +f.getAttribute('data-v'); }) : allIdx;
      open(list, Math.max(0, list.indexOf(v)), a);
    });
  });
  bClose.addEventListener('click', close);
  if (lPrev) lPrev.addEventListener('click', function () { show(at - 1, -1); });
  if (lNext) lNext.addEventListener('click', function () { show(at + 1, 1); });
  if (bZoom) bZoom.addEventListener('click', function () { setZoom(!zoomed); });

  doc.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); if (zoomed) setZoom(false); else close(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1, 1); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1, -1); return; }
    if (e.key !== 'Tab') return;
    var f = $$('button', lp).filter(function (el) { return el.offsetParent !== null && !el.disabled; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !lp.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !lp.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  });
  /* focus never leaves while it is open */
  doc.addEventListener('focusin', function (e) { if (isOpen && !lp.contains(e.target)) { try { bClose.focus({ preventScroll: true }); } catch (x) { bClose.focus(); } } });
  window.addEventListener('pageshow', function (e) { if (e.persisted && isOpen) close(); });

  /* swipe to step, tap the print to magnify, drag to look around while magnified */
  var down = null;
  stage.addEventListener('pointerdown', function (e) {
    if (e.button) return;
    down = { x: e.clientX, y: e.clientY, onPrint: im.contains(e.target), id: e.pointerId };
    if (zoomed) { try { stage.setPointerCapture(e.pointerId); } catch (x) {} }
  });
  stage.addEventListener('pointermove', function (e) {
    if (zoomed && (e.pointerType === 'mouse' || down)) panTo(e.clientX, e.clientY);
  });
  var up = function (e) {
    if (!down) return;
    var dx = e.clientX - down.x, dy = e.clientY - down.y, d = down; down = null;
    if (zoomed) { if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && d.onPrint) setZoom(false); return; }
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) { show(at + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); return; }
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && d.onPrint) setZoom(true, e.clientX, e.clientY);
  };
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', function () { down = null; });
  stage.addEventListener('dragstart', function (e) { e.preventDefault(); });
})();
