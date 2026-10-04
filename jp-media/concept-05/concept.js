/* CONCEPT 05 — SOUNDCHECK · runtime
   count-in entrance · hero clip sequence · menu · velocity skew · scroll-linked statement · strip · marquees · demo email */
(function () {
  'use strict';
  var d = document, root = d.documentElement, w = window, JP = w.JP;
  if (!JP) return;

  /* 1 ─ The count-in. Numbers stamp (visibility only); on 3 and 4 the stage column flickers through ('pre');
         a one-frame red flash; the 4 holds until the downbeat. */
  var seq = JP.sequence({
    key: 'c05',
    steps: [
      { at: 200,  el: '#opener', add: 'n1', long: true }, { at: 360,  el: '#opener', remove: 'n1', long: true },
      { at: 500,  el: '#opener', add: 'n2', long: true }, { at: 660,  el: '#opener', remove: 'n2', long: true },
      { at: 800,  el: '#opener', add: 'n1', long: true }, { at: 940,  el: '#opener', remove: 'n1', long: true },
      { at: 950,  el: '#opener', add: 'n2', long: true }, { at: 1090, el: '#opener', remove: 'n2', long: true },
      { at: 1100, el: '#opener', add: 'n3 pre', long: true }, { at: 1240, el: '#opener', remove: 'n3 pre', long: true },
      { at: 1250, el: '#opener', add: 'n4 fl pre', long: true }, { at: 1310, el: '#opener', remove: 'fl', long: true },
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

  /* 2 ─ Hero: concert cut, then sparks, then back. One clip plays at a time; hard cuts between them.
         v1 is a .jp-video (core.js gates it); v2 is ours: no autoplay, starts past its slate frame. */
  var v1 = d.querySelector('.hero-v1'), v2 = d.querySelector('.hero-v2'), heroFrame = d.querySelector('.hero-frame');
  if (v1 && v2) {
    if (JP.reduced || JP.saveData) { v2.remove(); v1.setAttribute('loop', ''); }
    else {
      var cur = v1, heroIn = true;
      var play = function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
      v2.muted = true; v2.defaultMuted = true; v2.playsInline = true;
      v2.addEventListener('playing', function () { v2.classList.add('is-playing'); v1.classList.remove('is-playing'); });
      v2.addEventListener('error', function () { v2.remove(); v1.setAttribute('loop', ''); v1.loop = true; cur = v1; play(v1); }, true);
      v1.addEventListener('play', function () { if (cur === v2) { cur = v1; v2.pause(); v2.classList.remove('is-playing'); } });
      var takes = 0;
      v1.addEventListener('ended', function () {
        if (!v2.parentNode || !heroIn) return;
        /* hold the concert cut until the downbeat has landed; then play it twice (two beats) before the sparks */
        var live = root.classList.contains('h-jp') || root.classList.contains('is-opened') || !root.classList.contains('js-anim');
        if (!live || ++takes < 2) { try { v1.currentTime = 0; } catch (e) {} play(v1); return; }
        takes = 0; cur = v2; v1.classList.remove('is-playing');
        try { v2.currentTime = 0.25; } catch (e) {}
        play(v2);
      });
      v2.addEventListener('ended', function () {
        if (!heroIn) return;
        cur = v1; v2.classList.remove('is-playing');
        try { v1.currentTime = 0; } catch (e) {}
        play(v1);
      });
      if ('IntersectionObserver' in w && heroFrame) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            heroIn = e.isIntersecting;
            if (heroIn) { if (cur === v2) play(v2); } else v2.pause();
          });
        }, { rootMargin: '160px 0px' }).observe(heroFrame);
      }
    }
  }

  /* 3 ─ Menu: full-screen black, stamps in, focus trapped, Esc closes, body locked. */
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

  /* 4 ─ Scroll-linked work: statement lines slide horizontally, big labels skew with velocity (desktop). */
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

  /* 5 ─ Strip: native everywhere; one "Next" control steps through and wraps. */
  var strip = d.getElementById('strip'), next = d.getElementById('mv-next');
  if (strip && next) {
    next.addEventListener('click', function () {
      var items = strip.querySelectorAll('.mv-item'); if (!items.length) return;
      var step = items[0].getBoundingClientRect().width + (items[1] ? items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().right : 24);
      var max = strip.scrollWidth - strip.clientWidth, left = strip.scrollLeft >= max - 4 ? 0 : Math.min(max, strip.scrollLeft + step);
      strip.scrollTo({ left: left, behavior: JP.reduced ? 'auto' : 'smooth' });
    });
  }

  /* 6 ─ Marquees run only while on screen. */
  if ('IntersectionObserver' in w) {
    var mio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var t = e.target.querySelector('.mq-track'); if (t) t.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'; });
    }, { rootMargin: '80px 0px' });
    d.querySelectorAll('.marquee').forEach(function (m) { mio.observe(m); });
  }

  /* 7 ─ Email control: demo-safe. It only says what it will do at launch. */
  var em = d.getElementById('email-btn'), note = d.getElementById('email-note');
  if (em && note) {
    em.addEventListener('click', function () {
      note.classList.remove('is-hit'); void note.offsetWidth; note.classList.add('is-hit');
      note.textContent = 'Email opens here at launch';
      clearTimeout(em.__t); em.__t = setTimeout(function () { note.classList.remove('is-hit'); note.textContent = 'Enabled at launch'; }, 2600);
    });
  }
})();
