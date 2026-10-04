/* CONCEPT 06 — STILL · entrance (three seconds of film that come to rest), index overlay with one more
   deliberate move (a row travels to its room and the frame settles 1.02 → 1), demo-safe email. Nothing else moves. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, JP = window.JP || {};
  var still = !!(JP.reduced || JP.saveData);

  /* 1 · Entrance (key c06).
     0 white · 250 the frame fades up and the western clip plays once (hat portrait: the horse's mane, then she turns)
     · 2400 caption · the clip is held at 2.45 s and dissolves into the still of her (o3), at the latest at 3900
     · 4300 name + Index · done ≈ 5000. Replay in the same session: no clip, times × .55. */
  var clip = d.getElementById('hero-clip'), seq = null, rested = false;
  function rest() {                       /* motion → still: the frame comes to rest */
    if (rested) return; rested = true;
    root.classList.add('o3');
    if (clip) { try { clip.pause(); } catch (e) {} }
  }
  if (clip) {
    if (still) {                          /* reduced motion / Save-Data: the still stands, no sources are fetched */
      Array.prototype.forEach.call(clip.querySelectorAll('source'), function (s) { s.remove(); });
      clip.removeAttribute('poster');
    } else {
      clip.addEventListener('playing', function () { if (!rested) clip.classList.add('is-playing'); });
      clip.addEventListener('timeupdate', function () { if (clip.currentTime >= 2.45) rest(); });
      clip.addEventListener('ended', rest);
      clip.addEventListener('error', function (e) {   /* only the element itself or its LAST source failing ends the film */
        if (e.target === clip || e.target === clip.lastElementChild) rest();
      }, true);
    }
  }
  function playClip(instant) {
    if (instant || still || !clip || rested) return;
    var p = clip.play(); if (p && p.catch) p.catch(function () {});
  }
  if (JP.sequence) {
    seq = JP.sequence({
      key: 'c06',
      steps: [
        { at: 0, add: 'o0' },
        { at: 250, add: 'o1' },
        { at: 250, fn: playClip, skipFn: true, long: true },
        { at: 2400, add: 'o2' },
        { at: 3900, fn: function () { rest(); }, skipFn: true },
        { at: 4300, add: 'o4' }
      ],
      tail: 700,
      skipAfter: 250,
      done: function () { rest(); if (clip) clip.classList.remove('is-playing'); }
    });
    seq.start();
  } else {
    root.classList.add('is-opened'); rest();
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
    /* a row links to its room: close first, then travel; the destination frame settles 1.02 → 1 once the page arrives */
    var arriving = null;
    function settle(frame) {
      if (!frame || still || !root.classList.contains('js-anim')) return;
      if (arriving) { arriving.classList.remove('is-arriving', 'is-arrived'); }
      arriving = frame;
      frame.classList.add('is-arriving');
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        frame.classList.remove('is-arriving'); frame.classList.add('is-arrived');
        setTimeout(function () { frame.classList.remove('is-arrived'); if (arriving === frame) arriving = null; }, 1500);
      }); });
    }
    function travel(e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var t = d.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault(); hide(false);
      var behavior = JP.reduced ? 'auto' : 'smooth';
      var frame = t.querySelector('.frame'), from = window.pageYOffset;
      t.scrollIntoView({ behavior: behavior, block: 'start' });
      try { history.replaceState(null, '', a.getAttribute('href')); } catch (err) {}
      t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });   /* keyboard / AT keep their place */
      if (!frame || behavior === 'auto') return;
      var done = false, tid = 0;
      function arrive() { if (done) return; done = true; clearTimeout(tid); window.removeEventListener('scrollend', arrive); settle(frame); }
      if (Math.abs(window.pageYOffset - from) < 2 && Math.abs(t.getBoundingClientRect().top) < 2) { settle(frame); return; }   /* already there */
      window.addEventListener('scrollend', arrive, { once: true });
      tid = setTimeout(arrive, 'onscrollend' in window ? 2500 : 700);
    }
    list.addEventListener('click', travel);
    src.addEventListener('click', travel);
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
