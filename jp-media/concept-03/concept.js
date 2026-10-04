/* CONCEPT 03 — DUST & LIGHT · page behaviour (progressive enhancement over shared/core.js) */
(function () {
  'use strict';
  var JP = window.JP, d = document, root = d.documentElement, w = window;
  if (!JP || !JP.sequence) return;

  /* 1 ─ Hero band geometry. Base CSS = the final band (near-native footage, right-aligned). For the intro the band is
         scaled about an origin chosen so the scaled rectangle covers the viewport exactly centred: uniform scale, no
         distortion, and when the step lands it contracts back into its editorial frame. Layout offsets are used
         (not the transformed rect). Runs until the entrance is over. */
  var hero = d.querySelector('.hero'), hf = d.querySelector('.hero-frame');
  function fitBand() {
    if (!hero || !hf || root.classList.contains('is-opened')) return;
    var W = hero.clientWidth, H = hero.clientHeight, x = hf.offsetLeft, y = hf.offsetTop, bw = hf.offsetWidth, bh = hf.offsetHeight;
    if (!bw || !bh) return;
    var k = Math.max(W / bw, H / bh) * 1.02;
    if (k <= 1.001) { hf.style.setProperty('--k', '1'); return; }
    var ox = (x + (k * bw - W) / 2) / (bw * (k - 1)), oy = (y + (k * bh - H) / 2) / (bh * (k - 1));
    hf.style.setProperty('--k', k.toFixed(4));
    hf.style.setProperty('--ox', JP.clamp(ox, 0, 1).toFixed(4));
    hf.style.setProperty('--oy', JP.clamp(oy, 0, 1).toFixed(4));
  }
  fitBand();
  var onRs = function () { fitBand(); };
  w.addEventListener('resize', onRs);
  w.addEventListener('jp:opened', function () { w.removeEventListener('resize', onRs); }, { once: true });

  /* 2 ─ Entrance: the exposure settles. Classes land on <html>; concept.css moves from the intro state. */
  JP.sequence({
    key: 'c03', tail: 600, skipAfter: 250,
    steps: [
      { at: 0, add: 'p0' },                       /* blown out, frame scaled to cover (painted by CSS) */
      { at: 150, add: 'p1' },                     /* stop down: overlay .94 → 0 over 1.3 s */
      { at: 700, add: 'p2' },                     /* field data types in */
      { at: 1300, add: 'p3', long: true },        /* the frame contracts into the band (1.2 s); the still thaws into motion */
      { at: 1900, add: 'p4' },                    /* the name rises out of the ground line while the band lands; up by ≈2.95 s */
      { at: 2600, add: 'p5' },                    /* subline */
      { at: 3200, add: 'p6' }                     /* header + roll cue → opened ≈ 3.8 s */
    ]
  }).start();

  /* 3 ─ Header hairline + light-leak pass (transform only, in view only). */
  var head = d.querySelector('.site-head');
  var leak = d.querySelector('.leak'), pass = d.querySelector('.leak-pass');
  JP.onFrame(function (s) {
    if (head) head.classList.toggle('is-scrolled', s.y > 60);
    if (pass && leak && !JP.reduced) {
      var pr = JP.progress(leak, s.vh);
      if (pr.inView) {
        var x = (-0.4 + 1.8 * pr.p) * pr.r.width;
        pass.style.transform = 'translateX(' + x.toFixed(1) + 'px) skewX(-12deg)';
      }
    }
  });

  /* 4 ─ Landscape: the 14 s drift runs only while the frame is on screen (desktop, fine pointer; CSS gates the rest). */
  var land = d.querySelector('.land');
  if (land && 'IntersectionObserver' in w) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { land.classList.toggle('in-view', e.isIntersecting); });
    }, { threshold: 0.15 }).observe(land);
  }

  /* 5 ─ Native strips on touch (road, YouTube filmstrip): when a strip is a horizontal roll, its frames flash in
         together (staggered) instead of waiting for each to scroll into the viewport sideways. */
  Array.prototype.forEach.call(d.querySelectorAll('.road-strip, .yt'), function (strip) {
    if (!('IntersectionObserver' in w)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (strip.scrollWidth > strip.clientWidth + 4) {
          Array.prototype.forEach.call(strip.querySelectorAll('[data-reveal]'), function (el, i) {
            el.style.setProperty('--d', (i * 0.14).toFixed(2) + 's');
            el.classList.add('is-in');
          });
        }
        io.disconnect();
      });
    }, { threshold: 0.1 });
    io.observe(strip);
  });

  /* 6 ─ Showreel: muted, preload none, plays only on tap, visible pause, Courier timecode, pauses off-screen. */
  var reel = d.querySelector('.reel-video'), rbtn = d.querySelector('.reel-btn'), rframe = d.querySelector('.reel-frame'), rtc = d.querySelector('.reel-tc');
  if (reel && rbtn && rframe) {
    reel.muted = true; reel.defaultMuted = true;
    var fmt = function (t) { t = Math.max(0, Math.floor(t || 0)); var m = Math.floor(t / 60), s = t % 60; return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; };
    var total = '00:47', narrow = function () { try { return matchMedia('(max-width:599px)').matches; } catch (e) { return false; } };
    var ui = function () {
      var on = !reel.paused && !reel.ended;
      rbtn.textContent = on ? 'Pause' : (reel.currentTime > 0 && !reel.ended ? 'Resume' : (narrow() ? 'Play reel' : 'Play showreel'));
      rbtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      rframe.classList.toggle('is-on', on || (reel.currentTime > 0 && !reel.ended));
    };
    var toggle = function () {
      if (reel.paused || reel.ended) { var p = reel.play(); if (p && p.catch) p.catch(function () { ui(); }); }
      else reel.pause();
    };
    rbtn.addEventListener('click', toggle);
    ['play', 'playing', 'pause', 'ended'].forEach(function (ev) { reel.addEventListener(ev, ui); });
    reel.addEventListener('loadedmetadata', function () { if (isFinite(reel.duration)) total = fmt(reel.duration); });
    reel.addEventListener('timeupdate', function () { if (rtc) rtc.textContent = fmt(reel.currentTime) + ' / ' + total; });
    reel.addEventListener('ended', function () { rframe.classList.remove('is-on'); if (rtc) rtc.textContent = '00:00 / ' + total; });
    /* no H.264 decoder (or a failed source): the control becomes the real YouTube link instead of a dead button */
    var ytFirst = d.querySelector('.yt a');
    var fallback = function () {
      if (!ytFirst || !rbtn.parentNode) return;
      var a = d.createElement('a'); a.className = 'reel-btn is-link'; a.href = ytFirst.href; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.textContent = narrow() ? 'YouTube \u2197' : 'Watch on YouTube'; rbtn.parentNode.replaceChild(a, rbtn); if (rtc) rtc.remove();
    };
    reel.addEventListener('error', fallback, true);
    if (!reel.canPlayType || reel.canPlayType('video/mp4; codecs="avc1.42E01E"') === '') fallback();
    if ('IntersectionObserver' in w) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting && !reel.paused) reel.pause(); }); }, { threshold: 0 }).observe(reel);
    }
    d.addEventListener('visibilitychange', function () { if (d.hidden && !reel.paused) reel.pause(); });
  }

  /* 7 ─ Email control is demo-safe: it only lights the note. */
  var mail = d.querySelector('.mail-btn');
  if (mail) {
    var t = 0;
    mail.addEventListener('click', function () {
      mail.classList.add('is-noted');
      clearTimeout(t); t = setTimeout(function () { mail.classList.remove('is-noted'); }, 1800);
    });
  }
})();
