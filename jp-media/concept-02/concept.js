/* CONCEPT 02 — FOLIO · entrance, folio counter, parallax pairs, demo-safe email */
(function () {
  'use strict';
  var w = window, d = document, root = d.documentElement, JP = w.JP;
  if (!JP) return;

  /* 1 ─ Entrance (key c02). Classes land on <html>; concept.css reads them.
        0 gutter draws · 600 words rise · 1500 gutter opens + plate drops (long) · 2300 running head. */
  /* 1a ─ The hero plate arrives moving. One clip, played once, never looped: the camera tilts from the horse's
        mane up to her face and the frame is frozen at 2.0 s, just before the film cuts to the wide, by fading the
        video out over the matching still beneath it. The dead head of the tilt (chin under the brim) is skipped:
        playback starts at 0.5 s so the face arrives inside the first seconds. Reduced motion / Save-Data: the still only. */
  var clip = d.querySelector('.hero-clip'), clipFrozen = false, clipStarted = false, clipTimer = 0, hero = d.getElementById('opening');
  var FREEZE_AT = 2.0, START_AT = 0.5;
  function freezeClip() {
    if (!clip || clipFrozen) return; clipFrozen = true;
    clearTimeout(clipTimer);
    try { clip.pause(); } catch (e) {}
    clip.classList.add('is-frozen');
    if (hero) hero.classList.add('is-still');
    /* once the fade has handed the frame back to the still, release the clip and its decoder */
    setTimeout(function () {
      if (!clip) return;
      Array.prototype.forEach.call(clip.querySelectorAll('source'), function (s) { s.remove(); });
      clip.removeAttribute('src'); clip.remove(); clip = null;
    }, 1600);
  }
  if (clip) {
    clip.muted = true; clip.defaultMuted = true; clip.playsInline = true;
    if (JP.reduced || JP.saveData) {
      Array.prototype.forEach.call(clip.querySelectorAll('source'), function (s) { s.remove(); });
      clip.remove(); clip = null;
    } else {
      /* The seek is guarded: a host that ignores Range requests (plain 200, no byte serving) leaves the stream
         non-seekable (Chromium never opens a seekable range on it), and a blind currentTime=0.5 is clamped back to 0. So the seek is
         retried on every readiness event until seekable covers START_AT, then the listeners are dropped. If it
         never does, concept.css frames the from-zero start higher (object-position) so the face is held anyway. */
      var seekEvents = ['loadedmetadata', 'loadeddata', 'progress', 'canplay', 'canplaythrough', 'durationchange'];
      var seekHead = function () {
        if (!clip) return true;
        try {
          if (clip.currentTime >= START_AT) { seekDone(); return true; }
          var sk = clip.seekable;
          if (clip.readyState >= 1 && sk && sk.length && sk.end(sk.length - 1) >= START_AT) {
            clip.currentTime = START_AT;
            if (clip.currentTime >= START_AT - 0.05) { seekDone(); return true; }
          }
        } catch (e) {}
        return false;
      };
      var seekDone = function () { seekEvents.forEach(function (ev) { clip && clip.removeEventListener(ev, seekHead); }); };
      if (!seekHead()) seekEvents.forEach(function (ev) { clip.addEventListener(ev, seekHead); });
      /* Last resort for a host that never byte-serves: once the data is in but the stream still reports no seekable
         range, the same 126 KB file is fetched and handed back to the element as an in-memory source (always
         seekable), but only while play has not yet been requested, so the plate can never visibly restart. */
      var blobTried = false;
      var blobFallback = function () {
        if (blobTried || !clip || clipStarted || !w.fetch || !w.FileReader) return;
        var sk = clip.seekable, src = clip.currentSrc;
        if (!src || /^data:/.test(src) || (sk && sk.length && sk.end(sk.length - 1) >= START_AT)) return;
        blobTried = true;
        fetch(src).then(function (r) { return r.ok ? r.blob() : Promise.reject(); }).then(function (b) {
          /* a data: URL rather than a blob: URL, which Chromium's media loader opens, cancels and reopens (an aborted request) */
          return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.onerror = rej; fr.readAsDataURL(b); });
        }).then(function (u) {
          if (!clip || clipStarted || clipFrozen || typeof u !== 'string') return;
          Array.prototype.forEach.call(clip.querySelectorAll('source'), function (so) { so.remove(); });
          seekEvents.forEach(function (ev) { clip.addEventListener(ev, seekHead); });
          clip.src = u;
        }).catch(function () {});
      };
      clip.addEventListener('loadeddata', blobFallback);
      clip.addEventListener('canplay', blobFallback);
      if (clip.readyState >= 2) blobFallback();
      clip.addEventListener('playing', function () {
        clip.classList.add('is-playing');
        clearTimeout(clipTimer);
        clipTimer = setTimeout(freezeClip, Math.max(0, (FREEZE_AT - clip.currentTime) * 1000));
      });
      clip.addEventListener('timeupdate', function () { if (clip.currentTime >= FREEZE_AT) freezeClip(); });
      clip.addEventListener('ended', freezeClip);
      clip.addEventListener('error', function () { clip.remove(); clip = null; }, true);
    }
  }
  function startClip() {
    if (!clip || clipFrozen) return;
    clipStarted = true;
    /* play the moment the plate begins to drop: the clip-path reveal hides the first frames anyway */
    if (typeof seekHead === 'function') seekHead();
    var p = clip.play(); if (p && p.catch) p.catch(function () {});
  }

  var seq = JP.sequence({
    key: 'c02', tail: 600, skipAfter: 1,
    steps: [
      { at: 0, add: 'p0' },
      { at: 600, add: 'p1' },
      { at: 1500, add: 'p2', long: true, fn: startClip, skipFn: true },
      { at: 2300, add: 'p3' }
    ]
  });
  var started = false;
  /* a tap during the font wait must skip too: arm it before the sequence has started */
  function earlySkip() { go(); seq.skip(); }
  function onEarlyKey(ev) { if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Escape') earlySkip(); }
  d.addEventListener('pointerdown', earlySkip, { passive: true });
  d.addEventListener('keydown', onEarlyKey);
  function go() {
    if (started) return; started = true;
    d.removeEventListener('pointerdown', earlySkip); d.removeEventListener('keydown', onEarlyKey);
    seq.start();
  }
  /* the gutter needs no font: draw it now. The words wait for Fraunces so they rise in the right face, never past 700 ms */
  if (!JP.reduced) root.classList.add('p0');
  if (d.fonts && d.fonts.ready && d.fonts.ready.then) { d.fonts.ready.then(go, go); setTimeout(go, 700); }
  else go();

  /* 2 ─ Folio counter: the red page number in the running head follows the current section (01–06) */
  var sections = Array.prototype.slice.call(d.querySelectorAll('[data-folio]'));
  var outs = [d.getElementById('folio-no')].filter(Boolean);
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
    var keep = [], skipped = root.classList.contains('is-skipped');
    for (var i = 0; i < pending.length; i++) {
      var el = pending[i];
      if (el.classList.contains('is-in')) continue;
      var r = el.getBoundingClientRect();
      if (r.top < 0 || (r.top < vh * 0.92 && r.bottom > 0)) {
        if (skipped) el.style.setProperty('--d', '0s');
        el.classList.add('is-in');
      } else keep.push(el);
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

  /* 3b ─ The reel: the full showreel, muted, loads nothing until the control is pressed; visible pause while it runs,
        pauses itself off-screen, and hands the frame back to the poster when it ends. */
  var reel = d.getElementById('reel'), rv = reel && reel.querySelector('.reel-video'), rb = d.getElementById('reel-btn');
  if (reel && rv && rb) {
    var rk = rb.querySelector('.reel-k');
    var reelState = function (on) {
      reel.classList.toggle('is-on', on);
      rb.setAttribute('aria-pressed', on ? 'true' : 'false');
      rb.setAttribute('aria-label', on ? 'Pause the showreel' : 'Play the showreel, muted');
      if (rk) rk.textContent = on ? 'Pause' : 'Play';
    };
    rv.muted = true; rv.defaultMuted = true; rv.playsInline = true;
    rb.addEventListener('click', function () {
      if (rv.paused || rv.ended) { var p = rv.play(); if (p && p.catch) p.catch(function () { reelState(false); }); }
      else rv.pause();
    });
    rv.addEventListener('playing', function () { reelState(true); });
    rv.addEventListener('pause', function () { reelState(false); });
    rv.addEventListener('ended', function () { reelState(false); try { rv.currentTime = 0; } catch (e) {} });
    /* no decodable source (the reel is mp4 only): the control steps aside and the long-form link in the caption stands */
    rv.addEventListener('error', function (e) {
      if (e.target !== rv && rv.networkState !== 3) return;
      reelState(false); reel.classList.add('is-unavailable'); rb.hidden = true;
    }, true);
    if ('IntersectionObserver' in w) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting && !rv.paused) rv.pause(); }); }, { rootMargin: '80px 0px' }).observe(rv);
    }
    d.addEventListener('visibilitychange', function () { if (d.hidden && !rv.paused) rv.pause(); });
  }

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
