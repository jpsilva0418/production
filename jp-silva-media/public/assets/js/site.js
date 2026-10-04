/* JP SILVA MEDIA — site-wide runtime (every page)
   Header line after 40px · Index menu (focus trap, Esc, body lock, inert when closed) · reveal safety net. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, w = window, JP = w.JP || {};
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var anim = root.classList.contains('js-anim');
  var page = root.getAttribute('data-page') || (w.JPSM && w.JPSM.page) || '';

  /* pages without an entrance are open from the first frame (the head gate already set it; this is the net) */
  if (page !== 'home') root.classList.add('is-opened');

  /* 1 · header line */
  if (JP.onFrame) JP.onFrame(function (s) { root.classList.toggle('is-scrolled', s.y > 40); });

  /* 2 · Index menu */
  var menu = $('#menu'), menuBtn = $('#menu-btn'), menuClose = $('#menu-close'), lastFocus = null;
  function focusables() { return $$('a[href],button:not([disabled])', menu).filter(function (e) { return e.offsetParent !== null || getComputedStyle(e).position === 'fixed'; }); }
  function openMenu() {
    if (!menu) return;
    lastFocus = d.activeElement;
    menu.removeAttribute('inert'); menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open'); root.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    setTimeout(function () { (menuClose || menu).focus(); }, 60);
    d.addEventListener('keydown', onMenuKey);
  }
  function closeMenu(returnFocus) {
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open'); root.classList.remove('menu-open');
    menu.setAttribute('inert', ''); menu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    d.removeEventListener('keydown', onMenuKey);
    if (returnFocus !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onMenuKey(ev) {
    if (ev.key === 'Escape') { ev.preventDefault(); closeMenu(); return; }
    if (ev.key !== 'Tab') return;
    var f = focusables(); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && d.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && d.activeElement === last) { ev.preventDefault(); first.focus(); }
  }
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', function () { menu.classList.contains('is-open') ? closeMenu() : openMenu(); });
    if (menuClose) menuClose.addEventListener('click', function () { closeMenu(); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { closeMenu(false); }); });
    w.addEventListener('resize', function () { if (w.innerWidth >= 900) closeMenu(false); });
  }

  /* 3 · Reveal safety net. core.js observers are the choreography; this is the net under them: anything with its
         top above the fold is revealed on every frame, and a viewport that suddenly grows past 2× (print,
         full-page capture) lands the whole page finished at once. */
  if (anim) {
    var pending = $$('[data-reveal]');
    var lastVH = w.innerHeight;
    var sweep = function (vh, all) {
      if (!pending.length) return;
      pending = pending.filter(function (el) {
        if (el.classList.contains('is-in')) return false;
        if (all || el.getBoundingClientRect().top < vh * 0.96) { el.classList.add('is-in'); return false; }
        return true;
      });
    };
    if (JP.onFrame) JP.onFrame(function (s) { sweep(s.vh, false); });
    w.addEventListener('resize', function () {
      var vh = w.innerHeight;
      if (vh > lastVH * 2) { root.classList.add('is-capture'); sweep(vh, true); w.dispatchEvent(new CustomEvent('jp:capture')); }
      lastVH = vh;
    });
    w.addEventListener('jp:opened', function () { setTimeout(function () { sweep(w.innerHeight, false); }, 1200); }, { once: true });
    setTimeout(function () { sweep(w.innerHeight, false); }, page === 'home' ? 9000 : 1200);
  }
})();
