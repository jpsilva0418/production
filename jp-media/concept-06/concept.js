/* CONCEPT 06 — STILL · entrance, index overlay, demo-safe email. Nothing else moves. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, JP = window.JP || {};

  /* 1 · Entrance (key c06). 0 white · 400 frame · 1400 caption · 2200 name + Index · 3000 done. */
  if (JP.sequence) {
    JP.sequence({
      key: 'c06',
      steps: [
        { at: 0, add: 'o0' },
        { at: 400, add: 'o1' },
        { at: 1400, add: 'o2' },
        { at: 2200, add: 'o3' }
      ],
      tail: 800,
      skipAfter: 250
    }).start();
  } else {
    root.classList.add('is-opened');
  }

  /* 2 · Index overlay: white, the same list, Esc / close, focus trap, body lock. */
  var open = d.getElementById('index-open'), ov = d.getElementById('index-overlay'), close = d.getElementById('index-close');
  var src = d.getElementById('index-list'), list = ov && ov.querySelector('.ov-list');
  if (open && ov && close && src && list) {
    list.innerHTML = src.innerHTML;
    var last = null, isOpen = false;
    function focusables() {
      return Array.prototype.filter.call(ov.querySelectorAll('a[href],button:not([disabled])'), function (e) { return e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden'; });
    }
    function show() {
      if (isOpen) return; isOpen = true; last = d.activeElement;
      ov.removeAttribute('inert'); ov.setAttribute('aria-hidden', 'false');
      open.setAttribute('aria-expanded', 'true'); d.body.classList.add('lock');
      requestAnimationFrame(function () { ov.classList.add('is-open'); close.focus({ preventScroll: true }); });
      d.addEventListener('keydown', onKey);
    }
    function hide(returnFocus) {
      if (!isOpen) return; isOpen = false;
      ov.classList.remove('is-open'); ov.setAttribute('aria-hidden', 'true'); ov.setAttribute('inert', '');
      open.setAttribute('aria-expanded', 'false'); d.body.classList.remove('lock');
      d.removeEventListener('keydown', onKey);
      if (returnFocus !== false && last && last.focus) last.focus({ preventScroll: true });
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); hide(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(); if (!f.length) return;
      var first = f[0], end = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); end.focus(); }
      else if (!e.shiftKey && d.activeElement === end) { e.preventDefault(); first.focus(); }
    }
    open.addEventListener('click', function (e) { e.preventDefault(); show(); });
    close.addEventListener('click', function () { hide(); });
    /* a row links to its room: close first, then let the anchor travel */
    list.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      hide(false);
      var t = d.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: JP.reduced ? 'auto' : 'smooth', block: 'start' }); try { history.replaceState(null, '', a.getAttribute('href')); } catch (err) {} }
    });
  }

  /* 3 · Email: demo-safe. The note is always visible; a press just makes it speak up. */
  var btn = d.getElementById('email-btn'), note = d.getElementById('email-note');
  if (btn && note) {
    btn.addEventListener('click', function () {
      note.textContent = 'enabled at launch';
      note.classList.add('is-hot');
      setTimeout(function () { note.classList.remove('is-hot'); }, 1600);
    });
  }
})();
