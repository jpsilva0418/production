/* CONCEPT 02 — FOLIO · entrance, folio counter, parallax pairs, demo-safe email */
(function () {
  'use strict';
  var w = window, d = document, root = d.documentElement, JP = w.JP;
  if (!JP) return;

  /* 1 ─ Entrance (key c02). Classes land on <html>; concept.css reads them.
        0 gutter draws · 600 words rise · 1500 gutter opens + plate drops (long) · 2300 running head. */
  var seq = JP.sequence({
    key: 'c02', tail: 600,
    steps: [
      { at: 0, add: 'p0' },
      { at: 600, add: 'p1' },
      { at: 1500, add: 'p2', long: true },
      { at: 2300, add: 'p3' }
    ]
  });
  var started = false;
  function go() { if (started) return; started = true; seq.start(); }
  /* the gutter needs no font: draw it now. The words wait for Fraunces so they rise in the right face, never past 700 ms */
  if (!JP.reduced) root.classList.add('p0');
  if (d.fonts && d.fonts.ready && d.fonts.ready.then) { d.fonts.ready.then(go, go); setTimeout(go, 700); }
  else go();

  /* 2 ─ Folio counter: the red page number follows the current section (01–06) */
  var sections = Array.prototype.slice.call(d.querySelectorAll('[data-folio]'));
  var outs = [d.getElementById('folio-no'), d.getElementById('folio-fixed-no')].filter(Boolean);
  var current = '';
  function setFolio(n) {
    if (n === current) return; current = n;
    outs.forEach(function (o) { o.textContent = n; });
  }

  /* 2b ─ Reveal sweep. Chromium clips IntersectionObserver by the target's own clip-path, so a plate hidden
        with inset(0 0 100% 0) only intersects as a zero-height band at its top edge; after an anchor jump
        from the Index (or scroll restoration) that edge is already above the viewport and the observer never
        fires. This sweep settles anything the observer missed, on scroll only. */
  var pending = Array.prototype.slice.call(d.querySelectorAll('[data-reveal]'));
  function sweep(vh) {
    if (!pending.length) return;
    var keep = [];
    for (var i = 0; i < pending.length; i++) {
      var el = pending[i];
      if (el.classList.contains('is-in')) continue;
      var r = el.getBoundingClientRect();
      if (r.top < 0 || (r.top < vh * 0.92 && r.bottom > 0)) el.classList.add('is-in'); else keep.push(el);
    }
    pending = keep;
  }

  /* 3 ─ Parallax on the overlapping pairs: ±3 % of their own height, fine pointer and wide screens only */
  var pars = Array.prototype.slice.call(d.querySelectorAll('[data-par]'));
  var wideMQ = w.matchMedia ? w.matchMedia('(min-width: 900px)') : { matches: true };

  JP.onFrame(function (s) {
    var vh = s.vh, pick = sections[0] ? sections[0].getAttribute('data-folio') : '01';
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= vh * 0.45) pick = sections[i].getAttribute('data-folio');
    }
    setFolio(pick);
    if (root.classList.contains('is-opened') || !root.classList.contains('js-anim')) sweep(vh);
    var par = JP.finePointer && wideMQ.matches && !JP.reduced;
    for (var j = 0; j < pars.length; j++) {
      var el = pars[j];
      if (!par) { if (el.style.transform) el.style.transform = ''; continue; }
      var pr = JP.progress(el, vh);
      if (!pr.inView) continue;
      var dir = parseFloat(el.getAttribute('data-par')) || 1;
      var y = (pr.p - 0.5) * 2 * 0.03 * pr.r.height * dir;
      el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    }
  });

  /* 4 ─ Email is a demo-safe control: no mailto, the note answers instead */
  var btn = d.getElementById('mail-btn'), wrap = btn && btn.closest('.ct-mail'), note = d.getElementById('mail-note');
  if (btn && wrap && note) {
    var t = 0;
    btn.addEventListener('click', function () {
      wrap.classList.add('is-poked');
      note.textContent = 'Email is enabled at launch';
      clearTimeout(t);
      t = setTimeout(function () { wrap.classList.remove('is-poked'); note.textContent = 'Enabled at launch'; }, 2200);
    });
  }
})();
