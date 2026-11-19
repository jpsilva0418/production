/* /demo/amairanymua-01 — The Edit: the portfolio runtime.
   1 the masonry: cards placed shortest-column-first, re-flowed with a transform when the
     filter changes (no script: CSS columns);
   2 the filter: the six pans (and All) as pressed buttons, the result announced politely;
   3 the sticky pill bar on phones rides up when the header tucks away;
   4 the viewer: a story of the photographs on show — segmented bars, tap the right to go on
     and the left to go back, swipe sideways, swipe down or X or Escape to close, arrow keys;
     focus moves in, is trapped and comes back to the tile; the page behind does not scroll;
     the large file loads on demand at the size it is shown. It never opens from a scroll.
   Everything is an enhancement: without it every tile is a link to the 1280 file. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var pf = doc.getElementById('work');
  if (!pf) return;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var phoneBar = function () { return window.matchMedia ? window.matchMedia('(max-width: 1023px)').matches : window.innerWidth < 1024; };

  var masons = $$('.pf-m', pf);
  var groups = $$('[data-group]', pf);
  var items = $$('.pf-it', pf);
  var shown = function (el) { return !el.hidden; };

  /* ================================================================ 1 the masonry
     Only the group's lead card (its first visible one, when it is a 'big' or 'wide' look and at
     least three cards are showing) spans two columns, and it always sits top-left, so a span can
     never leave a hole. Everything else takes the shortest column. Then the columns are evened
     out: the shorter ones lengthen their own cards' frames a little (a photograph by at most 30%,
     cropping the sides with the face kept by its object-position; a film slot by up to 50%) so the group ends on one clean line. A group
     with fewer cards than columns keeps the usual card size and is centred on its field. */
  var frameOf = function (it) { return $('.pf-f', it); };
  var layout = function (m) {
    var W = m.clientWidth;
    if (!W) return;
    m._w = W;
    var gap = W < 600 ? 10 : 16, vgap = W < 600 ? 14 : 22;
    var its = $$('.pf-it', m).filter(shown);
    $$('.pf-f', m).forEach(function (f) { f.style.aspectRatio = ''; });
    var n = its.length;
    if (!n) { m.style.height = '0px'; return; }
    var cols = Math.max(2, Math.floor((W + gap) / (240 + gap)));
    var cw = (W - gap * (cols - 1)) / cols;
    var lead = n >= 3 && (its[0].classList.contains('pf-it--big') || its[0].classList.contains('pf-it--wide'));
    var used = Math.min(cols, n), x0 = 0;
    if (n < cols || (n === 1)) {
      /* one or two cards: the usual size (a lone card a touch larger on a phone), centred */
      if (n === 1 && W < 600) cw = Math.min(W, 250);
      used = n;
      x0 = (W - (cw * used + gap * (used - 1))) / 2;
    }
    its.forEach(function (it, k) {
      var s = lead && k === 0 ? Math.min(2, used) : 1;
      it._s = s;
      /* a spanning wide look, or a big one spanning a tablet's whole row, is cropped to 5:4 */
      it.classList.toggle('is-wide', s > 1 && (it.classList.contains('pf-it--wide') || (s === used && W >= 600)));
      it.style.width = (cw * s + gap * (s - 1)).toFixed(2) + 'px';
    });
    var hs = its.map(function (it) { return it.offsetHeight; });
    var col = [], stacks = []; for (var c = 0; c < used; c++) { col.push(0); stacks.push([]); }
    var place = [];
    its.forEach(function (it, k) {
      var s = it._s, bx = 0, by = Infinity;
      for (var x = 0; x + s <= used; x++) {
        var y = 0; for (var j = x; j < x + s; j++) y = Math.max(y, col[j]);
        if (y < by - 1) { by = y; bx = x; }
      }
      place[k] = { x: bx, y: by };
      if (s === 1) stacks[bx].push(k);
      for (var q = bx; q < bx + s; q++) col[q] = by + hs[k] + vgap;
    });
    /* even the columns out */
    var T = Math.max.apply(null, col);
    stacks.forEach(function (ks, c) {
      var need = T - col[c];
      if (need < 2 || !ks.length) return;
      /* a photograph gives at most 30% of its height, a film slot (a flat card) up to 50% */
      var fr = ks.map(function (k) { var f = frameOf(its[k]); return f ? { f: f, w: f.offsetWidth, h: f.offsetHeight, c: f.offsetHeight * (its[k].classList.contains('pf-it--film') ? 0.5 : 0.3) } : null; });
      var cap = fr.reduce(function (a, o) { return a + (o ? o.c : 0); }, 0);
      if (!cap) return;
      var take = Math.min(need, cap), shift = 0;
      ks.forEach(function (k, i) {
        place[k].y += shift;
        var o = fr[i]; if (!o) return;
        var add = take * o.c / cap;
        o.f.style.aspectRatio = o.w.toFixed(1) + ' / ' + (o.h + add).toFixed(1);
        shift += add;
      });
      col[c] += take;
    });
    var fresh = [];
    its.forEach(function (it, k) {
      if (it._new) { it.style.transition = 'none'; fresh.push(it); }
      it.style.transform = 'translate3d(' + (x0 + place[k].x * (cw + gap)).toFixed(2) + 'px,' + place[k].y.toFixed(2) + 'px,0)';
    });
    m.style.height = Math.max(0, Math.max.apply(null, col) - vgap) + 'px';
    if (fresh.length) {
      void m.offsetWidth;
      fresh.forEach(function (it) { it.style.transition = ''; it._new = false; });
      raf(function () { fresh.forEach(function (it) { it.classList.remove('pf-new'); }); });
    }
  };
  var layoutAll = function (still) {
    masons.forEach(function (m) {
      if (m.closest('[data-group]').hidden) return;
      if (still) m.classList.add('pf-still');
      layout(m);
    });
    if (still) raf(function () { raf(function () { masons.forEach(function (m) { m.classList.remove('pf-still'); }); }); });
  };
  masons.forEach(function (m) { m.classList.add('pf-mas'); });
  layoutAll(true);
  var relayoutIfWidth = function () {
    var changed = masons.some(function (m) { return !m.closest('[data-group]').hidden && m.clientWidth !== m._w; });
    if (changed) layoutAll(true);
  };
  var rT = 0;
  window.addEventListener('resize', function () { if (!rT) rT = raf(function () { rT = 0; relayoutIfWidth(); }); }, { passive: true });
  /* fonts and late layout can change a caption's height */
  window.addEventListener('load', function () { layoutAll(true); });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { layoutAll(true); });

  /* ================================================================ 2 the filter */
  var side = $('.pf-side', pf), well = $('.pf-well', pf), status = $('[data-pf-status]', pf);
  var btns = $$('[data-f]', pf);
  var groupsBox = $('[data-pf]', pf), pfIn = $('.pf-in', pf);
  var words = function (p, f) {
    var a = [];
    if (p) a.push(p + (p === 1 ? ' photograph' : ' photographs'));
    if (f) a.push(f + (f === 1 ? ' film' : ' films'));
    return a.join(' and ');
  };
  var apply = function (f, btn, user) {
    var p = 0, fl = 0;
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
    items.forEach(function (it) {
      var cats = (it.getAttribute('data-cats') || '').split(' ');
      var on = f === 'all' || cats.indexOf(f) > -1;
      if (on && it.hidden) { it._new = true; it.classList.add('pf-new'); }
      it.hidden = !on;
      if (on) { if (it.classList.contains('pf-it--film')) fl++; else p++; }
    });
    groups.forEach(function (g) {
      var on = $$('.pf-it:not([hidden])', g);
      g.hidden = !on.length;
      /* the group's own tally follows the filter */
      var c = $('.pf-g-c', g);
      if (c) {
        var gf = on.filter(function (it) { return it.classList.contains('pf-it--film'); }).length, gp = on.length - gf;
        var t = [];
        if (gp) t.push(gp + (gp === 1 ? ' photograph' : ' photographs'));
        if (gf) t.push(gf + (gf === 1 ? ' film' : ' films'));
        c.textContent = t.join(' · ');
      }
    });
    layoutAll(false);
    var name = ($('.pf-pan-n', btn) || btn).textContent;
    if (status) status.textContent = f === 'all' ? 'Showing all ' + (p + fl) + ': ' + words(p, fl) + '.' : 'Showing ' + name + ': ' + words(p, fl) + '.';
    if (!user) return;
    if (!reduced) { btn.classList.remove('glint'); void btn.offsetWidth; btn.classList.add('glint'); }
    /* keep the pressed pill in view on the bar */
    if (well && phoneBar() && well.scrollWidth > well.clientWidth) {
      var l = btn.offsetLeft - 24, r = btn.offsetLeft + btn.offsetWidth + 24;
      if (l < well.scrollLeft || r > well.scrollLeft + well.clientWidth) {
        try { well.scrollTo({ left: Math.max(0, l), behavior: reduced ? 'auto' : 'smooth' }); } catch (e) { well.scrollLeft = Math.max(0, l); }
      }
    }
    /* if the visitor is further down than the work starts, bring the start of the results up */
    var hdH = 64, bar = phoneBar() && side ? side.offsetHeight : 0;
    var top = groupsBox.getBoundingClientRect().top + window.pageYOffset - hdH - bar - 12;
    if (window.pageYOffset > top + 8) {
      try { window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, top); }
    }
  };
  btns.forEach(function (b) { b.addEventListener('click', function () { if (b.getAttribute('aria-pressed') !== 'true') apply(b.getAttribute('data-f'), b, true); }); });

  /* ================================================================ 3 the bar rides with the header */
  var hd = doc.getElementById('siteHeader');
  var bT = 0;
  var barFrame = function () {
    bT = 0;
    if (!side || !pfIn) return;
    if (!phoneBar()) { side.classList.remove('stuck', 'up'); return; }
    var stickTop = parseFloat(window.getComputedStyle(side).top) || 64;
    var r = pfIn.getBoundingClientRect();
    var stuck = r.top < stickTop - 1 && r.bottom > stickTop + side.offsetHeight;
    side.classList.toggle('stuck', stuck);
    side.classList.toggle('up', stuck && !!hd && hd.classList.contains('hd--hide'));
  };
  var lastScroll = 0;
  window.addEventListener('scroll', function () { lastScroll = Date.now(); if (!bT) bT = raf(barFrame); }, { passive: true });
  barFrame();

  /* ================================================================ 4 the viewer */
  var lb = doc.getElementById('lb');
  var links = $$('.pf-a', pf);
  if (!lb || !links.length) return;
  doc.body.appendChild(lb); /* out of <main>, so the page behind can be made inert */
  var stage = $('[data-lb-stage]', lb), card = $('.lb-card', lb), img = $('.lb-img', lb);
  var barsBox = $('.lb-bars', lb), count = $('.lb-count', lb), cap = $('.lb-cap', lb);
  var xBtn = $('[data-lb-close]', lb), pBtn = $('[data-lb-prev]', lb), nBtn = $('[data-lb-next]', lb);
  if (!stage || !card || !img || !xBtn) return;
  pf.classList.add('pf-ready');

  var list = [], idx = 0, isOpen = false, lockY = 0, madeInert = [], bars = [], closing = 0;
  var lock = function (on) {
    var b = doc.body.style;
    if (on) { lockY = window.pageYOffset; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
    else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; window.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
  };
  var setInert = function (on) {
    if (on) {
      madeInert = [];
      Array.prototype.forEach.call(doc.body.children, function (el) {
        if (el === lb || el.tagName === 'SCRIPT' || el.classList.contains('demo-flag') || el.hasAttribute('inert')) return;
        el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); madeInert.push(el);
      });
    } else {
      madeInert.forEach(function (el) { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); });
      madeInert = [];
    }
  };
  var tileImg = function (a) { return $('img', a); };
  var fit = function () {
    var a = list[idx]; if (!a) return 0;
    var w = +a.getAttribute('data-w') || 4, h = +a.getAttribute('data-h') || 5, ar = w / h;
    var r = stage.getBoundingClientRect();
    var aw = Math.max(120, r.width), ah = Math.max(160, r.height - 12);
    var cw = Math.min(aw, ah * ar, 1100), ch = cw / ar;
    card.style.setProperty('--cw', cw.toFixed(1) + 'px');
    card.style.setProperty('--ch', ch.toFixed(1) + 'px');
    return cw;
  };
  var setSrc = function (el, a, cw) {
    var t = tileImg(a);
    el.sizes = Math.round(cw) + 'px';
    if (t && t.getAttribute('srcset')) el.srcset = t.getAttribute('srcset');
    el.src = a.getAttribute('data-full');
  };
  var preload = function (k) {
    var a = list[(k + list.length) % list.length];
    if (!a || a._pre) return;
    a._pre = true;
    var im = new Image(); setSrc(im, a, parseFloat(card.style.getPropertyValue('--cw')) || 600);
  };
  var paintBars = function () {
    bars.forEach(function (b, j) { b.classList.toggle('done', j < idx); b.classList.remove('cur'); });
    if (bars[idx]) { void bars[idx].offsetWidth; bars[idx].classList.add('cur'); }
  };
  var show = function (k, dir) {
    var n = list.length;
    idx = (k + n) % n;
    var a = list[idx], t = tileImg(a);
    var cw = fit();
    img.classList.remove('ok');
    img.alt = t ? t.alt : '';
    img.onload = function () { img.classList.add('ok'); };
    setSrc(img, a, cw);
    if (img.complete && img.naturalWidth) img.classList.add('ok');
    if (cap) cap.textContent = a.getAttribute('data-cap') || '';
    if (count) count.innerHTML = (idx + 1) + ' of ' + n + '<span class="sr">: ' + (a.getAttribute('data-cap') || '') + '</span>';
    paintBars();
    if (dir && !reduced && card.animate) {
      try { card.animate([{ transform: 'translate3d(' + (dir * 28) + 'px,0,0)', opacity: 0.5 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.22,.9,.3,1)' }); } catch (e) { /* no animation */ }
    }
    preload(idx + 1); preload(idx - 1);
  };
  var openAt = function (a) {
    if (isOpen) return;
    clearTimeout(closing);
    list = links.filter(function (x) { return !x.closest('.pf-it').hidden; });
    idx = Math.max(0, list.indexOf(a));
    barsBox.innerHTML = list.map(function () { return '<i></i>'; }).join('');
    bars = $$('i', barsBox);
    isOpen = true;
    lock(true);
    setInert(true);
    root.classList.add('lb-open');
    lb.hidden = false;
    lb.style.opacity = '';
    card.style.transform = '';
    void lb.offsetWidth;
    lb.classList.add('on');
    show(idx, 0);
    xBtn.focus({ preventScroll: true });
  };
  var close = function () {
    if (!isOpen) return;
    isOpen = false;
    var back = list[idx];
    lb.classList.remove('on', 'dragging');
    lb.style.opacity = '';
    setInert(false);
    root.classList.remove('lb-open');
    lock(false);
    if (back) back.focus();
    closing = setTimeout(function () { lb.hidden = true; card.style.transform = ''; card.classList.remove('drag'); img.removeAttribute('src'); img.removeAttribute('srcset'); img.classList.remove('ok'); }, reduced ? 0 : 300);
  };
  var go = function (d) { if (list.length > 1) show(idx + d, d); };

  /* opening: only a deliberate tap or click on a tile; never the end of a scroll or a long press */
  var down = null;
  doc.addEventListener('pointerdown', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('.pf-a') : null;
    down = a ? { a: a, x: e.clientX, y: e.clientY, sy: window.pageYOffset, t: Date.now(), ls: lastScroll } : null;
  }, { passive: true });
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button > 0)) return;
      e.preventDefault();
      if (e.detail !== 0) {
        if (!down || down.a !== a) return;
        var moved = Math.abs(e.clientX - down.x) > 12 || Math.abs(e.clientY - down.y) > 12;
        var scrolled = Math.abs(window.pageYOffset - down.sy) > 6 || (down.t - down.ls) < 140;
        if (moved || scrolled || Date.now() - down.t > 900) return;
      }
      openAt(a);
    });
  });

  xBtn.addEventListener('click', close);
  if (pBtn) pBtn.addEventListener('click', function () { go(-1); });
  if (nBtn) nBtn.addEventListener('click', function () { go(1); });
  /* on the document, not the dialog: a click on the photograph leaves focus on <body> */
  doc.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); return; }
    if (e.key === 'Tab') {
      var f = [xBtn, pBtn, nBtn].filter(function (x) { return x && x.offsetParent !== null; });
      if (!f.length) return;
      var i = f.indexOf(doc.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  /* focus can never be left outside while it is open */
  doc.addEventListener('focusin', function (e) { if (isOpen && !lb.contains(e.target)) xBtn.focus({ preventScroll: true }); });
  window.addEventListener('resize', function () { if (isOpen) { var cw = fit(); img.sizes = Math.round(cw) + 'px'; } }, { passive: true });

  /* gestures on the stage: tap left / right, swipe sideways, swipe down to close */
  var g = null;
  var reset = function () {
    card.classList.remove('drag'); card.style.transform = '';
    lb.style.opacity = ''; lb.classList.remove('dragging');
  };
  stage.addEventListener('pointerdown', function (e) {
    if (e.button && e.button > 0) return;
    g = { id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now(), axis: '' };
    try { stage.setPointerCapture(e.pointerId); } catch (err) { /* fine */ }
  });
  stage.addEventListener('pointermove', function (e) {
    if (!g || e.pointerId !== g.id) return;
    var dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.axis && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) g.axis = Math.abs(dy) > Math.abs(dx) ? 'y' : 'x';
    if (!g.axis) return;
    card.classList.add('drag');
    if (g.axis === 'y') {
      var d = Math.max(0, dy);
      lb.classList.add('dragging');
      card.style.transform = 'translate3d(0,' + d.toFixed(1) + 'px,0) scale(' + (1 - Math.min(d, 400) / 1600).toFixed(4) + ')';
      lb.style.opacity = String(1 - Math.min(d, 320) / 640);
    } else {
      card.style.transform = 'translate3d(' + (dx * 0.55).toFixed(1) + 'px,0,0)';
    }
  });
  var end = function (e, cancel) {
    if (!g || e.pointerId !== g.id) return;
    var dx = e.clientX - g.x, dy = e.clientY - g.y, dt = Math.max(1, Date.now() - g.t), axis = g.axis;
    g = null;
    if (cancel) { reset(); return; }
    if (!axis) {
      if (dt > 700) return;
      var r = stage.getBoundingClientRect();
      go(e.clientX - r.left < r.width * 0.33 ? -1 : 1);
      return;
    }
    if (axis === 'y') {
      if (dy > 90 || (dy > 30 && dy / dt > 0.6)) { card.classList.remove('drag'); close(); }
      else reset();
      return;
    }
    reset();
    if (dx < -50) go(1); else if (dx > 50) go(-1);
  };
  stage.addEventListener('pointerup', function (e) { end(e, false); });
  stage.addEventListener('pointercancel', function (e) { end(e, true); });
})();
