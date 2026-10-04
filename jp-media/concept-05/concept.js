/* CONCEPT 05 — SOUNDCHECK · runtime
   count-in entrance · menu · velocity skew · scroll-linked statement · strip buttons · demo email */
(function () {
  'use strict';
  var d = document, root = d.documentElement, w = window, JP = w.JP;
  if (!JP) return;

  /* 1 ─ The count-in. Numbers stamp (visibility only), a one-frame red flash, then the downbeat. */
  var seq = JP.sequence({
    key: 'c05',
    steps: [
      { at: 200,  el: '#opener', add: 'n1', long: true }, { at: 320,  el: '#opener', remove: 'n1', long: true },
      { at: 500,  el: '#opener', add: 'n2', long: true }, { at: 620,  el: '#opener', remove: 'n2', long: true },
      { at: 800,  el: '#opener', add: 'n1', long: true }, { at: 920,  el: '#opener', remove: 'n1', long: true },
      { at: 950,  el: '#opener', add: 'n2', long: true }, { at: 1070, el: '#opener', remove: 'n2', long: true },
      { at: 1100, el: '#opener', add: 'n3', long: true }, { at: 1220, el: '#opener', remove: 'n3', long: true },
      { at: 1250, el: '#opener', add: 'n4 fl', long: true }, { at: 1310, el: '#opener', remove: 'fl', long: true },
      { at: 1370, el: '#opener', remove: 'n4', long: true },
      { at: 1400, add: 'h-jp' },
      { at: 1900, add: 'h-silva' },
      { at: 2300, add: 'h-mq' },
      { at: 2700, add: 'h-hd' }
    ],
    tail: 400,
    skipAfter: 500,
    done: function () { var o = d.getElementById('opener'); if (o) o.className = 'opener'; }
  });
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', seq.start); else seq.start();

  /* 2 ─ Menu: full-screen black, stamps in, focus trapped, Esc closes, body locked. */
  var menu = d.getElementById('menu'), btn = d.getElementById('menu-btn'), closeBtn = d.getElementById('menu-close');
  var lastFocus = null, isOpen = false;
  function focusables() { return Array.prototype.slice.call(menu.querySelectorAll('a[href],button')).filter(function (e) { return e.offsetParent !== null; }); }
  function setClosed() { menu.setAttribute('aria-hidden', 'true'); menu.setAttribute('inert', ''); }
  function openMenu() {
    if (isOpen) return; isOpen = true; lastFocus = d.activeElement;
    menu.removeAttribute('inert'); menu.removeAttribute('aria-hidden');
    menu.classList.add('is-open'); root.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true');
    setTimeout(function () { var f = focusables(); if (f.length) f[0].focus(); }, 80);
  }
  function closeMenu(returnFocus) {
    if (!isOpen) return; isOpen = false;
    menu.classList.remove('is-open'); root.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false'); setClosed();
    if (returnFocus !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (menu && btn && closeBtn) {
    setClosed();
    btn.addEventListener('click', function (e) { e.preventDefault(); if (isOpen) closeMenu(); else openMenu(); });
    closeBtn.addEventListener('click', function (e) { e.preventDefault(); closeMenu(); });
    menu.querySelectorAll('.menu-list a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
    d.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
      if (e.key === 'Tab') {
        var f = focusables(); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    if (location.hash === '#menu') { history.replaceState(null, '', location.pathname); openMenu(); }
  }

  /* 3 ─ Scroll-linked work: statement lines slide horizontally, big labels skew with velocity (desktop). */
  var kinLines = Array.prototype.slice.call(d.querySelectorAll('.kin-line'));
  var kinWrap = d.querySelector('.kin-wrap');
  var bigs = Array.prototype.slice.call(d.querySelectorAll('.big[data-skew]'));
  var stageGrid = d.querySelector('.stage-grid');
  var skewTimer = 0, desktop = function () { return w.innerWidth >= 900 && root.classList.contains('has-pointer'); };

  if (!JP.reduced && (kinLines.length || bigs.length)) {
    JP.onFrame(function (s) {
      /* statement */
      if (kinWrap) {
        var pr = JP.progress(kinWrap, s.vh);
        if (pr.inView) {
          var t = (pr.p - 0.5) * s.vw * 0.42;
          kinLines.forEach(function (l) {
            var k = parseFloat(l.getAttribute('data-k')) || 1;
            l.style.transform = 'translate3d(' + (t * k).toFixed(1) + 'px,0,0)';
          });
        }
      }
      /* velocity skew + drift, desktop only */
      if (bigs.length && stageGrid) {
        if (!desktop()) { if (bigs[0].style.transform) bigs.forEach(function (b) { b.style.transform = ''; }); return; }
        var sp = JP.progress(stageGrid, s.vh);
        if (!sp.inView) return;
        var skew = JP.clamp(s.dy * 0.12, -6, 6);
        bigs.forEach(function (b, i) {
          var dir = parseFloat(b.getAttribute('data-skew')) || 1;
          var x = (sp.p - 0.5) * s.vw * (0.06 + i * 0.03) * dir;
          b.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0) skewX(' + (skew * dir).toFixed(2) + 'deg)';
          b.__x = x; b.__dir = dir;
        });
        clearTimeout(skewTimer);
        skewTimer = setTimeout(function () {
          bigs.forEach(function (b) { b.style.transform = 'translate3d(' + (b.__x || 0).toFixed(1) + 'px,0,0) skewX(0deg)'; });
        }, 110);
      }
    });
  }

  /* 4 ─ Strip buttons (desktop convenience; the strip is native on every device). */
  var strip = d.getElementById('strip');
  if (strip) {
    d.querySelectorAll('.mv-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var item = strip.querySelector('.mv-item'); var step = item ? item.getBoundingClientRect().width + 24 : strip.clientWidth * 0.5;
        strip.scrollBy({ left: step * (parseFloat(b.getAttribute('data-dir')) || 1), behavior: JP.reduced ? 'auto' : 'smooth' });
      });
    });
  }

  /* 5 ─ Email control: demo-safe. It only says what it will do at launch. */
  var em = d.getElementById('email-btn'), note = d.getElementById('email-note');
  if (em && note) {
    em.addEventListener('click', function () {
      note.classList.remove('is-hit'); void note.offsetWidth; note.classList.add('is-hit');
      note.textContent = 'Email opens here at launch';
      clearTimeout(em.__t); em.__t = setTimeout(function () { note.classList.remove('is-hit'); note.textContent = 'Enabled at launch'; }, 2600);
    });
  }
})();
