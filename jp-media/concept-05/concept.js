/* CONCEPT 05 — SOUNDCHECK · runtime
   count-in entrance · hero clip sequence · reel player · menu · velocity skew · scroll-linked statement · strip · marquees · demo email */
(function () {
  'use strict';
  var d = document, root = d.documentElement, w = window, JP = w.JP;
  if (!JP) return;
  var noop = function () {};
  var play = function (v) { var p = v.play(); if (p && p.catch) p.catch(noop); };

  /* 1 ─ The count-in (≈4.15 s). The concert cut is full-bleed from first paint ('pre'); numbers stamp over it
         (visibility only); on 3 and 4 the picture drops to black for a beat; it holds ONE BAR as a soundcheck with a
         label ('sc') and one more black beat; a one-frame red flash; then the DOWNBEAT: the picture cuts down into
         its column as JP slams in. The sparks clip (hero-v2) only starts fetching on the downbeat. */
  var armSparks = function () { var v = d.querySelector('.hero-v2'); if (v && v.preload === 'none') v.preload = 'auto'; };
  var seq = JP.sequence({
    key: 'c05',
    steps: [
      { at: 0,    el: '#opener', add: 'pre' },
      { at: 200,  el: '#opener', add: 'n1', long: true },     { at: 360,  el: '#opener', remove: 'n1', long: true },
      { at: 500,  el: '#opener', add: 'n2', long: true },     { at: 660,  el: '#opener', remove: 'n2', long: true },
      { at: 800,  el: '#opener', add: 'n1', long: true },     { at: 940,  el: '#opener', remove: 'n1', long: true },
      { at: 950,  el: '#opener', add: 'n2', long: true },     { at: 1090, el: '#opener', remove: 'n2', long: true },
      { at: 1100, el: '#opener', add: 'n3', remove: 'pre', long: true }, { at: 1240, el: '#opener', add: 'pre', remove: 'n3', long: true },
      { at: 1250, el: '#opener', add: 'n4', remove: 'pre', long: true }, { at: 1400, el: '#opener', add: 'pre', remove: 'n4', long: true },
      { at: 1500, el: '#opener', add: 'sc', long: true },
      { at: 2250, el: '#opener', remove: 'pre', long: true }, { at: 2350, el: '#opener', add: 'pre', long: true },
      { at: 2600, el: '#opener', add: 'fl', long: true },     { at: 2660, el: '#opener', remove: 'fl sc', long: true },
      { at: 2660, add: 'h-jp', fn: armSparks },
      { at: 3050, add: 'h-silva' },
      { at: 3400, add: 'h-mq' },
      { at: 3750, add: 'h-hd' }
    ],
    tail: 400,
    skipAfter: 500,
    done: function () { var o = d.getElementById('opener'); if (o) o.className = 'opener'; }
  });
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', seq.start); else seq.start();

  /* 2 ─ Hero: concert cut (two beats), then sparks, then back. One clip plays at a time; hard cuts.
         v1 is a .jp-video (core.js gates it); v2 is ours: never loops, starts past its slate frame. */
  var v1 = d.querySelector('.hero-v1'), v2 = d.querySelector('.hero-v2'), heroFrame = d.querySelector('.hero-frame');
  if (v1 && v2) {
    if (JP.reduced || JP.saveData) { v2.remove(); v1.setAttribute('loop', ''); }
    else {
      var cur = v1, heroIn = true, takes = 0, CUT = 0.36, cutTimer = 0, cutting = false;
      /* the concert clip ends on a title card we must not show: it is cut at .36 s, frame-accurately where possible */
      var onCut = function () {
        if (cutting) return; cutting = true; clearTimeout(cutTimer); v1.pause();
        if (!heroIn) { cutting = false; return; }
        var live = root.classList.contains('h-jp') || root.classList.contains('is-opened') || !root.classList.contains('js-anim');
        if (!v2 || !live || ++takes < 2) { try { v1.currentTime = 0; } catch (e) {} cutting = false; play(v1); return; }
        takes = 0; cutting = false; toV2();
      };
      var watch = function (now, meta) { if (v1.paused) return; if ((meta ? meta.mediaTime : v1.currentTime) >= CUT - 0.02) onCut(); else if (v1.requestVideoFrameCallback) v1.requestVideoFrameCallback(watch); };
      v1.addEventListener('playing', function () {
        if (v1.currentTime >= CUT) { try { v1.currentTime = 0; } catch (e) {} }
        clearTimeout(cutTimer); cutTimer = setTimeout(onCut, Math.max(40, (CUT - v1.currentTime) * 1000));
        if (v1.requestVideoFrameCallback) v1.requestVideoFrameCallback(watch);
      });
      v1.addEventListener('pause', function () { clearTimeout(cutTimer); });
      v1.addEventListener('timeupdate', function () { if (!v1.paused && v1.currentTime >= CUT) onCut(); });
      v2.muted = true; v2.defaultMuted = true; v2.playsInline = true;
      var toV1 = function () { cur = v1; v2.pause(); v2.classList.remove('is-playing'); try { v1.currentTime = 0; } catch (e) {} play(v1); };
      var toV2 = function () { cur = v2; armSparks(); try { v2.currentTime = 0.25; } catch (e) {} play(v2); };
      v2.addEventListener('playing', function () { v2.classList.add('is-playing'); v1.classList.remove('is-playing'); });
      v2.addEventListener('error', function () { v2.remove(); v2 = null; cur = v1; play(v1); }, true);
      /* core.js may nudge v1 back on while the sparks run: v1 wins, v2 steps aside */
      v1.addEventListener('play', function () { if (v2 && cur === v2) { cur = v1; v2.pause(); v2.classList.remove('is-playing'); } });
      v1.addEventListener('ended', onCut);
      v2.addEventListener('ended', function () { if (heroIn) toV1(); });
      if ('IntersectionObserver' in w && heroFrame) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            heroIn = e.isIntersecting;
            if (!heroIn) { if (v2) v2.pause(); return; }
            if (cur === v2 && v2 && !v2.ended) play(v2); else if (v1.paused || v1.ended) toV1();
          });
        }, { rootMargin: '160px 0px' }).observe(heroFrame);
      }
    }
  }

  /* 3 ─ The reel: muted long-form, plays only on the button, pauses off-screen, thin red progress bar. */
  var rv = d.getElementById('reel-video'), rb = d.getElementById('reel-btn'), rf = d.getElementById('reel-frame');
  if (rv && rb && rf) {
    var rbar = rf.querySelector('.reel-bar'), rlabel = rb.querySelector('span');
    rv.muted = true; rv.defaultMuted = true; rv.playsInline = true;
    var setState = function (on) {
      rb.setAttribute('aria-pressed', on ? 'true' : 'false');
      rlabel.textContent = on ? 'Pause' : (rv.currentTime > 0.5 && !rv.ended ? 'Resume' : 'Play reel');
      rf.classList.toggle('is-live', on);
    };
    rb.addEventListener('click', function () { if (rv.paused || rv.ended) play(rv); else rv.pause(); });
    rf.addEventListener('click', function () { if (!rv.paused) rv.pause(); else if (rv.currentTime > 0) play(rv); });
    rv.addEventListener('play', function () {
      setState(true);
      /* one playing loop per viewport: rest the nearby loop while the reel runs */
      d.querySelectorAll('.mv video.jp-video').forEach(function (v) { v.pause(); });
    });
    rv.addEventListener('pause', function () { setState(false); });
    rv.addEventListener('ended', function () { setState(false); if (rbar) rbar.style.transform = 'scaleX(1)'; });
    rv.addEventListener('timeupdate', function () { if (rbar && rv.duration) rbar.style.transform = 'scaleX(' + (rv.currentTime / rv.duration).toFixed(3) + ')'; });
    /* if the long mp4 cannot be decoded here, fall back to the 12-second hero edit (webm + mp4) and say so */
    var fellBack = false, wanted = false;
    rv.addEventListener('error', function () {
      if (fellBack) { rb.disabled = true; rlabel.textContent = 'Reel unavailable'; return; }
      fellBack = true;
      while (rv.firstChild) rv.removeChild(rv.firstChild);
      /* assigning src runs the resource selection on its own: no load() call */
      rv.src = '../media/film/hero-montage.' + (rv.canPlayType('video/webm') ? 'webm' : 'mp4');
      var dur = d.querySelector('.reel-dur'); if (dur) dur.textContent = 'Twelve seconds.';
      if (wanted) play(rv);
    }, true);
    rb.addEventListener('click', function () { wanted = true; });
    if ('IntersectionObserver' in w) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting && !rv.paused) rv.pause(); }); }, { rootMargin: '0px' }).observe(rf);
    }
    d.addEventListener('visibilitychange', function () { if (d.hidden && !rv.paused) rv.pause(); });
  }

  /* 4 ─ Menu: full-screen black, stamps in, focus trapped, Esc closes, body locked. */
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
    [btn, closeBtn].forEach(function (el) {
      el.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); el.click(); } });
    });
    menu.querySelectorAll('.menu-list a').forEach(function (a) {
      a.addEventListener('click', function () {
        closeMenu(false);
        var t = d.querySelector(a.getAttribute('href'));
        if (t) { if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); setTimeout(function () { t.focus({ preventScroll: true }); }, 0); }
      });
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

  /* 5 ─ Scroll-linked work: statement lines slide horizontally, big labels skew with velocity (desktop). */
  var kinLines = Array.prototype.slice.call(d.querySelectorAll('.kin-line'));
  var kinWrap = d.querySelector('.kin-wrap');
  var bigs = Array.prototype.slice.call(d.querySelectorAll('.big[data-skew]'));
  var stageGrid = d.querySelector('.stage-grid');
  var skewTimer = 0, desktop = function () { return w.innerWidth >= 900 && root.classList.contains('has-pointer'); };

  if (!JP.reduced && (kinLines.length || bigs.length)) {
    JP.onFrame(function (s) {
      if (kinWrap) {
        var pr = JP.progress(kinWrap, s.vh);
        if (pr.inView) {
          var t = (pr.p - 0.5) * s.vw * (s.vw < 900 ? 0.14 : 0.42);
          kinLines.forEach(function (l) {
            var k = parseFloat(l.getAttribute('data-k')) || 1;
            l.style.transform = 'translate3d(' + (t * k).toFixed(1) + 'px,0,0)';
          });
        }
      }
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

  /* 6 ─ Strip: native everywhere; one "Next" control steps through and wraps. */
  var strip = d.getElementById('strip'), next = d.getElementById('mv-next');
  if (strip && next) {
    next.addEventListener('click', function () {
      var items = strip.querySelectorAll('.mv-item'); if (!items.length) return;
      var step = items[0].getBoundingClientRect().width + (items[1] ? items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().right : 24);
      var max = strip.scrollWidth - strip.clientWidth, left = strip.scrollLeft >= max - 4 ? 0 : Math.min(max, strip.scrollLeft + step);
      strip.scrollTo({ left: left, behavior: JP.reduced ? 'auto' : 'smooth' });
    });
  }

  /* 7 ─ Marquees. The -50% keyframe is seamless only while HALF the track covers the viewport plus one run,
         so pad every track in PAIRS (both halves stay identical) until it does. Re-measured once the fonts land
         and after a rotation; padding is additive, so it never shrinks a track. */
  var padMq = function () {
    d.querySelectorAll('.mq-track').forEach(function (t) {
      var run = t.querySelector('.mq-run'); if (!run) return;
      var rw = run.getBoundingClientRect().width || 1, guard = 0;
      while (t.scrollWidth / 2 < w.innerWidth + rw && guard++ < 10) {
        var a = run.cloneNode(true), b = run.cloneNode(true);
        a.setAttribute('aria-hidden', 'true'); b.setAttribute('aria-hidden', 'true');
        t.appendChild(a); t.appendChild(b);
      }
    });
  };
  padMq();
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(padMq, noop);
  w.addEventListener('resize', function () { clearTimeout(padMq.__t); padMq.__t = setTimeout(padMq, 150); });
  if ('IntersectionObserver' in w) {
    var mio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var t = e.target.querySelector('.mq-track'); if (t) t.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'; });
    }, { rootMargin: '80px 0px' });
    d.querySelectorAll('.marquee').forEach(function (m) { mio.observe(m); });
  }

  /* 8 ─ Email control: demo-safe. It only says what it will do at launch. */
  var em = d.getElementById('email-btn'), note = d.getElementById('email-note');
  if (em && note) {
    em.addEventListener('click', function () {
      note.classList.remove('is-hit'); void note.offsetWidth; note.classList.add('is-hit');
      note.textContent = 'Email opens here at launch';
      clearTimeout(em.__t); em.__t = setTimeout(function () { note.classList.remove('is-hit'); note.textContent = 'Enabled at launch'; }, 2600);
    });
  }
})();
