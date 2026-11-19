/* /demo/amairanymua-01 — VEIL home: the opening's hand-over, the hero picture, the aisle and
   the rail of looks. Plain ES2017, no dependencies, no network. Everything is an enhancement. */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var now = function () { return (window.performance && performance.now) ? performance.now() : Date.now(); };

  /* ================= the opening =================
     The CSS timeline runs from first paint; this only ends it. At the end (or at the first
     wheel, touchmove, pointerdown or key that is not Tab/Shift) the class is removed in one
     frame: every opening animation is cancelled with it and the page rests on its static
     styles. A deliberate interruption also fades the veil out quickly instead of cutting. */
  var reelStart = function () {};
  var playing = root.classList.contains('intro');
  if (playing) {
    window.__veilOp = true;
    var T_END = 3150;
    var t0 = typeof window.__veilT0 === 'number' ? window.__veilT0 : now();
    var ended = false, timer = 0;
    var evs = ['wheel', 'touchmove', 'pointerdown', 'keydown'];
    var onInput = function (e) {
      if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
      end(true);
    };
    var end = function (early) {
      if (ended) return;
      ended = true;
      clearTimeout(timer);
      evs.forEach(function (t) { window.removeEventListener(t, onInput, true); });
      if (early) {
        root.classList.add('op-out');
        setTimeout(function () { root.classList.remove('op-out'); }, 450);
      }
      root.classList.remove('intro');
      if (doc.getAnimations) {
        /* belt and braces: nothing from the opening may linger */
        doc.getAnimations().forEach(function (a) {
          var n = a.animationName || '';
          if (/^op[A-Z]/.test(n)) a.cancel();
        });
      }
      reelStart();
    };
    evs.forEach(function (t) { window.addEventListener(t, onInput, { capture: true, passive: true }); });
    timer = setTimeout(function () { end(false); }, Math.max(0, T_END - (now() - t0)));
    /* a tab opened in the background: do not play to nobody */
    if (doc.hidden) end(false);
  }

  /* ================= the hero picture =================
     One tall picture that cross-dissolves slowly through her work, film beats among the
     stills (the marked slot until a clip exists). Paused when off screen, when the tab is
     hidden, and by the pause control. Under reduced motion it stays on the first still. */
  var reel = doc.querySelector('[data-reel]');
  var pauseBtns = $$('.hero-pause');
  if (reel && !reduced) {
    var beats = $$('.beat', reel);
    var lblN = $$('.hero-n'), lblL = $$('.hero-l');
    /* one still every 2.6 s (a 1.1 s dissolve inside it), so a bride sees her range, not one
       photograph; the first change after the opening comes sooner, because the lead picture
       has already been on screen since the veil lifted */
    var period = 2600, firstHold = 1700, fade = 1100;
    var idx = 0, hold = period, tmr = 0, userPaused = false, visible = true, started = false;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var prime = function (b) {
      var img = b && b.querySelector('img[data-srcset]');
      if (!img) return Promise.resolve();
      img.setAttribute('srcset', img.getAttribute('data-srcset'));
      img.setAttribute('src', img.getAttribute('data-src'));
      img.removeAttribute('data-srcset'); img.removeAttribute('data-src');
      return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    };
    var running = function () { return started && !userPaused && visible && !doc.hidden; };
    /* (re)arm the next change; `due` is when it should happen, so an observer or a visibility
       event firing mid-hold does not restart the count from zero */
    var due = 0;
    var schedule = function () {
      clearTimeout(tmr);
      if (!running()) { due = 0; return; }
      if (!due) due = now() + hold;
      tmr = setTimeout(step, Math.max(0, due - now()));
    };
    var step = function () {
      due = 0;
      if (!running()) return;
      var next = (idx + 1) % beats.length;
      var cur = beats[idx], nb = beats[next];
      prime(nb).then(function () {
        if (!running()) return;
        cur.classList.remove('is-on');
        cur.classList.add('is-prev');
        nb.classList.remove('is-prev');
        nb.classList.add('is-on', 'moved');
        setTimeout(function () { cur.classList.remove('is-prev', 'moved'); }, fade + 80);
        idx = next;
        lblN.forEach(function (n) { n.textContent = pad(idx + 1); });
        lblL.forEach(function (n) { n.textContent = nb.getAttribute('data-label') || ''; });
        prime(beats[(idx + 1) % beats.length]);
        hold = period;
        schedule();
      });
    };
    reelStart = function () {
      if (started) return;
      started = true;
      hold = playing ? firstHold : period;
      schedule();
    };
    /* the next two pictures are fetched and decoded straight away, so the first changes never
       wait on the network */
    prime(beats[1]).then(function () { prime(beats[2]); });
    pauseBtns.forEach(function (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () {
        userPaused = !userPaused;
        pauseBtns.forEach(function (b) {
          b.setAttribute('aria-pressed', String(userPaused));
          b.setAttribute('aria-label', userPaused ? 'Play the slideshow' : 'Pause the slideshow');
        });
        due = 0;
        schedule();
      });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var v = es[0].isIntersecting;
        if (v !== visible) { visible = v; due = 0; }
        schedule();
      }, { threshold: 0.15 }).observe(reel);
    }
    doc.addEventListener('visibilitychange', function () { due = 0; schedule(); });
    if (!playing) reelStart();
  }

  /* ================= the aisle =================
     One rAF frame per scroll: the line draws to the reader's eye line, a pearl rides its tip,
     and each chapter's pearl lights as the tip reaches it. */
  var wrap = doc.querySelector('[data-aisle]');
  if (wrap && !reduced) {
    var line = wrap.querySelector('.aisle-line'), tip = wrap.querySelector('.aisle-tip');
    var pearls = $$('.aisle-pearl', wrap);
    var offs = [], H = 0, tick = false;
    wrap.classList.add('aisle-live');
    var measure = function () {
      var r = wrap.getBoundingClientRect(), top = r.top + window.pageYOffset;
      H = wrap.offsetHeight;
      offs = pearls.map(function (p) { var pr = p.getBoundingClientRect(); return pr.top + window.pageYOffset + pr.height / 2 - top; });
    };
    var draw = function () {
      tick = false;
      var r = wrap.getBoundingClientRect();
      var reach = Math.max(0, Math.min(H, window.innerHeight * 0.62 - r.top));
      var p = H ? reach / H : 0;
      line.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      if (tip) { tip.style.transform = 'translate3d(0,' + reach.toFixed(1) + 'px,0)'; tip.style.opacity = (p > 0.002 && p < 0.998) ? '1' : '0'; }
      for (var i = 0; i < pearls.length; i++) pearls[i].classList.toggle('lit', reach >= offs[i] - 2);
    };
    var req = function () { if (!tick) { tick = true; requestAnimationFrame(draw); } };
    measure(); draw();
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', function () { measure(); req(); }, { passive: true });
    window.addEventListener('load', function () { measure(); req(); });
    if (window.ResizeObserver) new ResizeObserver(function () { measure(); req(); }).observe(wrap);
  }

  /* ================= the rail of looks ================= */
  $$('[data-rail]').forEach(function (rail) {
    var track = rail.querySelector('.rail-track');
    if (!track) return;
    var items = $$('.rail-it', track);
    var prog = rail.querySelector('.rail-prog i');
    var count = rail.querySelector('.rail-count b');
    var prev = rail.querySelector('.rail-prev'), next = rail.querySelector('.rail-next');
    var t = false;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var update = function () {
      t = false;
      var max = track.scrollWidth - track.clientWidth;
      var p = max > 0 ? track.scrollLeft / max : 1;
      var vis = track.clientWidth / track.scrollWidth;
      if (prog) prog.style.transform = 'translateX(' + (p * (1 - vis) * 100 / vis).toFixed(2) + '%) scaleX(1)';
      if (prog) prog.parentNode.style.setProperty('--vis', vis);
      if (prog) prog.style.width = (vis * 100).toFixed(2) + '%';
      var step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : 1;
      var i = Math.min(items.length - 1, Math.round(track.scrollLeft / step));
      if (max > 0 && track.scrollLeft >= max - 2) i = items.length - 1;
      if (count) count.textContent = pad(i + 1);
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    };
    var go = function (dir) {
      var step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth;
      track.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' });
    };
    /* the frames unveil together, left to right, when the rail comes into view */
    var held = $$('.rv-im[data-hold]', rail);
    if (held.length) {
      if (reduced || !('IntersectionObserver' in window)) held.forEach(function (f) { f.classList.add('in'); });
      else {
        var rio = new IntersectionObserver(function (es) {
          if (!es[0].isIntersecting) return;
          held.forEach(function (f) { f.removeAttribute('data-hold'); f.classList.add('in'); });
          rio.disconnect();
        }, { rootMargin: '0px 0px -12% 0px' });
        rio.observe(track);
      }
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', function () { if (!t) { t = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', function () { if (!t) { t = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  });
})();
