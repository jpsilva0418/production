/* CONCEPT 04 — SILVER · entrance, index table, phone menu, demo-safe contact (≈5 KB) */
(function () {
  'use strict';
  var d = document, root = d.documentElement, JP = window.JP || {};

  /* 1 ─ Entrance: the slate. Phase classes land on <html>; CSS holds every hidden state under .js-anim:not(.is-opened). */
  if (JP.sequence) {
    JP.sequence({
      key: 'c04',
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

  /* 2 ─ Selected work index: one row open at a time, keyboard native (buttons), height via grid-template-rows. */
  var list = d.getElementById('wk');
  var items = list ? Array.prototype.slice.call(list.querySelectorAll('.wk-item')) : [];
  function setOpen(item, open) {
    var btn = item.querySelector('.wk-row'), panel = item.querySelector('.wk-panel');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
    if (open) { var v = panel.querySelector('video.jp-video'); if (v && !v.__jp && JP.video) JP.video(v); }
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

  /* 3 ─ Desktop fine-pointer hover preview (cols 9–12, fixed, crossfade). Polish only; everything works without it. */
  var prev = d.getElementById('wk-prev');
  if (prev && list && JP.finePointer && window.matchMedia('(min-width:1100px)').matches) {
    var imgs = null, cap = d.getElementById('wk-prev-cap'), cur = 0, base = (window.JP_MEDIA && window.JP_MEDIA.base) || '../media/';
    var show = function (item) {
      if (!imgs) imgs = [0, 1].map(function () { var im = d.createElement('img'); im.alt = ''; im.decoding = 'async'; prev.insertBefore(im, cap); return im; });
      var small = item.getAttribute('data-small'), src = base + 'plates/' + small + '.jpg';
      var next = imgs[1 - cur];
      if (imgs[cur].getAttribute('src') === src) { prev.classList.add('is-on'); return; }
      var swap = function () { imgs[cur].classList.remove('is-cur'); next.classList.add('is-cur'); cur = 1 - cur; };
      if (next.getAttribute('src') === src && next.complete) swap();
      else { next.onload = function () { next.onload = null; if (next.getAttribute('src') === src) swap(); }; next.setAttribute('src', src); }
      cap.textContent = item.querySelector('.wk-no').textContent + ' · ' + item.querySelector('.wk-title').textContent + ' · ' + item.querySelector('.wk-year').textContent;
      prev.classList.add('is-on');
    };
    items.forEach(function (item) {
      item.querySelector('.wk-row').addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') show(item); });
    });
    list.addEventListener('pointerleave', function () { prev.classList.remove('is-on'); });
  }

  /* 4 ─ Phone menu: full-screen gunmetal, focus trap, Esc closes, inert when closed, body scroll locked while open. */
  var mb = d.getElementById('menu-btn'), menu = d.getElementById('menu'), lastFocus = null;
  function focusables() { return Array.prototype.slice.call(menu.querySelectorAll('a[href],button:not([disabled])')); }
  function openMenu() {
    lastFocus = d.activeElement;
    menu.hidden = false; menu.removeAttribute('inert');
    mb.setAttribute('aria-expanded', 'true'); d.body.classList.add('menu-open');
    var f = focusables(); if (f[0]) f[0].focus();
    d.addEventListener('keydown', onMenuKey);
  }
  function closeMenu(restore) {
    menu.hidden = true; menu.setAttribute('inert', '');
    mb.setAttribute('aria-expanded', 'false'); d.body.classList.remove('menu-open');
    d.removeEventListener('keydown', onMenuKey);
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onMenuKey(e) {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key !== 'Tab') return;
    var f = focusables().concat([mb]), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (d.activeElement === first || d.activeElement === mb)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
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
