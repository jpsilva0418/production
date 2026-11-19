/* /demo/amairanymua-01 — BLUSH home: the opening, the hero's orbiting slideshow, and the hand-off
   from "Tell her about your day" into the real inquiry. Plain script, no dependencies, no network.

   THE OPENING (≈2.9 s), only when the gate in <body> set html.intro:
     0.00–0.56  a blush circle grows from the centre
     0.40–1.25  the seal draws: two rings, the ring text writing itself round, the AS monogram
     1.30–1.88  the seal's centre opens into a circular window onto her film (the hero's own frame)
     2.00–2.85  the window travels into the hero's round frame while the seal settles into the
                header mark; the cream lifts and the page rises around it
   Only transform, opacity, clip-path and stroke-dashoffset are animated, all on wrappers or SVG
   parts, never on a photograph. The window IS the hero frame (moved by an inverted transform that
   plays back to none), so nothing is duplicated or swapped. When it ends every animation is
   cancelled and the pre-state classes removed in the same frame: the page rests on its plain
   static styles. Any wheel, touch, pointer press or key (not Tab/Shift) finishes it at once. */
(function () {
  'use strict';
  var win = window, doc = document, root = doc.documentElement;
  var q = function (s, c) { return (c || doc).querySelector(s); };
  var qa = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduced = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var introDone = !root.classList.contains('intro');
  var whenDone = [];
  var afterIntro = function (f) { if (introDone) f(); else whenDone.push(f); };

  /* ---------------- the opening ---------------- */
  (function opening() {
    if (introDone) return;
    root.classList.add('intro-run');
    var anims = [], ended = false;
    var big = q('.hr-big'), bigM = q('.hr-big-m'), bg = q('.op-bg'), disc = q('.op-disc'), sealEl = q('.op-seal');
    var mark = q('#siteHeader .hd-seal');
    var events = ['wheel', 'touchmove', 'pointerdown', 'keydown'];
    var done = function () {
      if (ended) return;
      ended = true;
      events.forEach(function (t) { win.removeEventListener(t, skip, true); });
      root.classList.remove('intro', 'intro-run');
      anims.forEach(function (a) { try { a.cancel(); } catch (e) { /* ignore */ } });
      anims = [];
      introDone = true;
      if (win.__blushFrame) win.__blushFrame();
      whenDone.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } });
      whenDone = [];
    };
    var skip = function (e) {
      if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
      anims.forEach(function (a) { try { a.finish(); } catch (er) { /* ignore */ } });
      done();
    };
    try {
      if (!big || !bigM || !bg || !disc || !sealEl || !mark || !big.animate || win.scrollY > 40) { done(); return; }
      var T = 2900;
      var A = function (el, kf, o) { if (!el) return null; var a = el.animate(kf, Object.assign({ duration: T, fill: 'both' }, o)); anims.push(a); return a; };
      var at = function (ms) { return Math.min(1, Math.max(0, ms / T)); };
      var vw = win.innerWidth, vh = win.visualViewport ? win.visualViewport.height : win.innerHeight;
      var cx = vw / 2, cy = vh / 2;
      var sr = sealEl.getBoundingClientRect(), sw = sr.width;
      var br = big.getBoundingClientRect(), mr = mark.getBoundingClientRect();
      var W0 = sw * 0.73; /* the window: just inside the seal's inner ring (r 146 of 200) */
      var s0 = W0 / br.width;
      var bigFrom = 'translate(' + (cx - (br.left + br.width / 2)).toFixed(1) + 'px,' + (cy - (br.top + br.height / 2)).toFixed(1) + 'px) scale(' + s0.toFixed(4) + ')';
      var sealTo = 'translate(' + ((mr.left + mr.width / 2) - (sr.left + sr.width / 2)).toFixed(1) + 'px,' + ((mr.top + mr.height / 2) - (sr.top + sr.height / 2)).toFixed(1) + 'px) scale(' + (mr.width / sw).toFixed(4) + ')';
      var glide = 'cubic-bezier(.65,0,.2,1)', out = 'cubic-bezier(.2,.75,.2,1)', soft = 'cubic-bezier(.4,0,.2,1)';

      /* the blush circle grows, then the whole seal (disc + lines) settles into the header mark */
      A(disc, [
        { transform: 'scale(0)', opacity: 1, easing: out },
        { transform: 'scale(1)', opacity: 1, offset: at(560) },
        { transform: 'none', opacity: 1, offset: at(1980), easing: glide },
        { transform: sealTo, opacity: 0, offset: at(2830) },
        { transform: sealTo, opacity: 0 }
      ]);
      /* the header's own mark waits under the landing seal, then takes over in one frame */
      A(mark, [{ opacity: 0 }, { opacity: 0, offset: at(2829) }, { opacity: 1, offset: at(2830) }, { opacity: 1 }]);
      A(sealEl, [
        { transform: 'none', opacity: 1 },
        { transform: 'none', opacity: 1, offset: at(2000), easing: glide },
        { transform: sealTo, opacity: 1, offset: at(2830) },
        { transform: sealTo, opacity: 0 }
      ]);
      /* the rings draw */
      A(q('.seal-r1', sealEl), [{ strokeDashoffset: 1 }, { strokeDashoffset: 1, offset: at(400), easing: soft }, { strokeDashoffset: 0, offset: at(1120) }, { strokeDashoffset: 0 }]);
      A(q('.seal-r2', sealEl), [{ strokeDashoffset: 1 }, { strokeDashoffset: 1, offset: at(520), easing: soft }, { strokeDashoffset: 0, offset: at(1200) }, { strokeDashoffset: 0 }]);
      /* the ring text writes itself round while the ring turns, coming to rest upright */
      A(q('.seal-txt', sealEl), [{ transform: 'rotate(-38deg)', easing: 'cubic-bezier(.25,.6,.3,1)' }, { transform: 'rotate(0deg)' }], { duration: 2830 });
      qa('.seal-txt path', sealEl).forEach(function (p, i, all) {
        var d = 430 + i * (600 / all.length);
        A(p, [{ opacity: 0 }, { opacity: 0, offset: at(d) }, { opacity: 1, offset: at(d + 260) }, { opacity: 1 }]);
      });
      /* the monogram: in, out while the window opens on her film, back in as the seal lands */
      A(q('.seal-a', sealEl), [
        { opacity: 0, transform: 'translateY(14px)' }, { opacity: 0, transform: 'translateY(14px)', offset: at(480), easing: out },
        { opacity: 1, transform: 'none', offset: at(920) }, { opacity: 1, transform: 'none', offset: at(1290) },
        { opacity: 0, transform: 'none', offset: at(1490) }, { opacity: 0, transform: 'none', offset: at(2250) },
        { opacity: 1, transform: 'none', offset: at(2700) }, { opacity: 1, transform: 'none' }
      ]);
      A(q('.seal-s', sealEl), [
        { opacity: 0, transform: 'translateX(16px)' }, { opacity: 0, transform: 'translateX(16px)', offset: at(620), easing: out },
        { opacity: 1, transform: 'none', offset: at(1060) }, { opacity: 1, transform: 'none', offset: at(1320) },
        { opacity: 0, transform: 'none', offset: at(1520) }, { opacity: 0, transform: 'none', offset: at(2300) },
        { opacity: 1, transform: 'none', offset: at(2720) }, { opacity: 1, transform: 'none' }
      ]);
      /* the window: her film opens inside the seal, then travels into the hero's frame */
      A(bigM, [
        { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(0% at 50% 50%)', offset: at(1300), easing: 'cubic-bezier(.5,0,.15,1)' },
        { clipPath: 'circle(50% at 50% 50%)', offset: at(1880) }, { clipPath: 'circle(50% at 50% 50%)' }
      ]);
      A(big, [{ transform: bigFrom }, { transform: bigFrom, offset: at(2000), easing: glide }, { transform: 'none', offset: at(2850) }, { transform: 'none' }]);
      /* the cream lifts; the page rises around the settling frame */
      A(bg, [{ opacity: 1 }, { opacity: 1, offset: at(2000), easing: soft }, { opacity: 0, offset: at(2760) }, { opacity: 0 }]);
      var rise = function (el, delay, y) {
        if (!el) return;
        A(el, [{ opacity: 0, transform: 'translate3d(0,' + y + 'px,0)', offset: 0 }], { duration: 700, delay: delay, easing: 'cubic-bezier(.22,.8,.24,1)' });
      };
      qa('.hr-txt > *').forEach(function (el, i) { rise(el, 2080 + i * 90, 18); });
      A(q('.hr-ring'), [{ opacity: 0, transform: 'scale(.9)', offset: 0 }], { duration: 760, delay: 2120, easing: 'cubic-bezier(.22,.8,.24,1)' });
      qa('.hr-o').forEach(function (o, i) {
        A(o, [{ opacity: 0, transform: 'scale(.55)', offset: 0 }], { duration: 640, delay: 2240 + i * 110, easing: 'cubic-bezier(.3,1.25,.4,1)' });
      });
      Promise.all(anims.map(function (a) { return a.finished; })).then(done, done);
      events.forEach(function (t) { win.addEventListener(t, skip, { capture: true, passive: true }); });
      win.addEventListener('pagehide', done, { once: true });
      /* a last guard: whatever happens, the opening never outlives 4 s */
      setTimeout(done, 4000);
    } catch (e) { done(); }
  })();

  /* ---------------- the hero's two orbiting slideshows ----------------
     Each change is a circular wipe: the incoming photograph's circle grows from its centre over the
     outgoing one, which stays fully opaque until it is covered. Never a dissolve. The two circles
     take turns, one step every 1.75 s (so each changes every 3.5 s). Paused off screen, when the tab
     is hidden, by the pause button, and absent under reduced motion. */
  (function orbits() {
    var orbs = qa('[data-orbit]');
    var tog = q('[data-orbit-toggle]');
    if (!orbs.length || reduced) return;
    var sets = orbs.map(function (o) { return { el: o, slides: qa('.hr-o-s', o), i: 0, busy: null }; });
    var loaded = false;
    var load = function () {
      if (loaded) return; loaded = true;
      qa('img[data-src]', q('.hr-art')).forEach(function (img) {
        if (img.getAttribute('data-srcset')) img.srcset = img.getAttribute('data-srcset');
        img.src = img.getAttribute('data-src');
      });
    };
    if (doc.readyState === 'complete') setTimeout(load, 200); else win.addEventListener('load', function () { setTimeout(load, 200); });
    var paused = false, onScreen = true, turn = 0, timer = 0;
    var ready = function (img) { return img && img.complete && img.naturalWidth > 0; };
    var step = function (set) {
      var n = set.slides.length;
      if (n < 2 || set.busy) return;
      var cur = set.slides[set.i], nxt = set.slides[(set.i + 1) % n];
      var img = q('img', nxt);
      if (!ready(img)) return; /* not decoded yet: try again on its next turn */
      nxt.classList.add('is-in');
      nxt.removeAttribute('aria-hidden');
      var a = nxt.animate([{ clipPath: 'circle(0% at 50% 58%)' }, { clipPath: 'circle(72% at 50% 50%)' }], { duration: 980, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'both' });
      set.busy = a;
      var fin = function () {
        if (set.busy !== a) return;
        cur.classList.remove('is-on'); cur.setAttribute('aria-hidden', 'true');
        nxt.classList.add('is-on'); nxt.classList.remove('is-in');
        a.cancel();
        set.busy = null;
        set.i = (set.i + 1) % n;
      };
      a.finished.then(fin, fin);
    };
    var loop = function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (!paused && onScreen && !doc.hidden) { step(sets[turn % sets.length]); turn++; }
        loop();
      }, 1750);
    };
    var face = function () {
      if (!tog) return;
      tog.classList.toggle('is-paused', paused);
      var t = q('.pz-t', tog); if (t) t.textContent = paused ? 'Play' : 'Pause';
      tog.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' the slideshow');
    };
    if (tog) { tog.hidden = false; face(); tog.addEventListener('click', function () { paused = !paused; face(); }); }
    if ('IntersectionObserver' in win) new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; }, { threshold: 0.2 }).observe(q('.hr-art'));
    afterIntro(function () { setTimeout(loop, 600); });
  })();

  /* ---------------- "Tell her about your day" → the real inquiry ----------------
     The date (or "not set yet") is handed to the Bridal Inquiry page through the inquiry's own
     saved state, the sessionStorage entry assets/js/inquiry.js restores on load. Nothing leaves
     this browser. If storage is blocked the link simply opens the form. */
  (function tell() {
    var go = q('[data-tell]'), date = doc.getElementById('tlDate'), unknown = doc.getElementById('tlUnknown');
    if (!go || !date) return;
    var KEY = 'am01-bridal-inquiry-v1';
    if (unknown) {
      unknown.addEventListener('change', function () { if (unknown.checked) date.value = ''; });
      date.addEventListener('input', function () { if (date.value) unknown.checked = false; });
    }
    go.addEventListener('click', function () {
      var v = date.value, u = unknown && unknown.checked;
      if (!v && !u) return;
      try {
        var s = JSON.parse(sessionStorage.getItem(KEY) || 'null') || {};
        var ans = s.answers && typeof s.answers === 'object' ? s.answers : {};
        ans.weddingDate = v || '';
        ans.dateUnknown = u ? 'Not set yet' : '';
        sessionStorage.setItem(KEY, JSON.stringify({ answers: ans, step: 0, view: 'form' }));
      } catch (e) { /* storage blocked: the form opens empty */ }
    });
  })();
})();
