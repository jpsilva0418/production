/* ============================================================
   JP MEDIA — shared runtime (no dependencies, ~6 KB)
   Gate · reveal · entrance sequencer · video gating · frame loop · study nav
   Everything here is progressive enhancement over a page that is already
   complete without it.
   ============================================================ */
(function () {
  'use strict';
  var d = document, root = d.documentElement, w = window;
  var reducedMQ = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var reduced = !!reducedMQ.matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var finePointer = w.matchMedia ? w.matchMedia('(pointer: fine)').matches : false;

  var JP = w.JP = w.JP || {};
  JP.reduced = reduced; JP.saveData = saveData; JP.finePointer = finePointer;
  JP.ease = 'cubic-bezier(.16,1,.3,1)';
  JP.clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  JP.lerp = function (a, b, t) { return a + (b - a) * t; };
  JP.map = function (v, a, b, c, e) { return c + (e - c) * JP.clamp((v - a) / (b - a), 0, 1); };

  /* 1 ─ Gate (the inline head script normally did this before paint) */
  root.classList.add('js');
  if (!reduced && !root.classList.contains('js-anim')) root.classList.add('js-anim');
  if (finePointer) root.classList.add('has-pointer');

  /* 2 ─ Reveal grammar. [data-reveal] + optional [data-stag=".06"] on a parent. */
  JP.reveal = function (scope) {
    scope = scope || d;
    scope.querySelectorAll('[data-stag]').forEach(function (s) {
      var step = parseFloat(s.getAttribute('data-stag')) || 0.08;
      var base = parseFloat(s.getAttribute('data-stag-base')) || 0;
      Array.prototype.forEach.call(s.children, function (c, i) { c.style.setProperty('--d', (base + i * step).toFixed(2) + 's'); });
    });
    var els = Array.prototype.slice.call(scope.querySelectorAll('[data-reveal]:not(.is-in)'));
    if (!els.length) return;
    if (reduced || !('IntersectionObserver' in w)) { els.forEach(function (e) { e.classList.add('is-in'); }); JP.__revealReady = true; return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting || en.boundingClientRect.top < 0) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
    JP.__revealReady = true;
  };
  /* watchdog: if the reveal controller never armed, no element may stay hidden */
  setTimeout(function () { if (!JP.__revealReady) root.classList.remove('js-anim'); }, 1500);
  /* the inline head gate schedules its own fallback; cancel it now that the runtime is here */
  JP.__loaded = true;

  /* 3 ─ Entrance sequencer.
     JP.sequence({ steps:[{at:400, add:'p1'}, {at:1200, el:'#x', add:'on'}, {at:2000, fn:function(){}}],
                   target: document.documentElement, done:function(){}, skipOn:true, key:'c01' })
     - html.is-opening while running, html.is-opened when finished, event 'jp:opened'
     - tap / key / wheel skips straight to the final state (all remaining class steps applied)
     - reduced motion: finishes immediately
     - key: second visit in the same session plays a shortened entrance (steps marked long:true are skipped) */
  JP.sequence = function (o) {
    var target = o.target || root, steps = (o.steps || []).slice().sort(function (a, b) { return a.at - b.at; });
    var timers = [], finished = false, started = false;
    var seen = false; try { seen = !!(o.key && sessionStorage.getItem('jp-seen-' + o.key)); } catch (e) {}
    if (seen) steps = steps.filter(function (s) { return !s.long; }).map(function (s) { return Object.assign({}, s, { at: Math.round(s.at * (o.replayScale || 0.55)) }); });
    function el(s) { return s.el ? (typeof s.el === 'string' ? d.querySelector(s.el) : s.el) : target; }
    function apply(s, instant) {
      var e = el(s); if (!e) return;
      if (s.add) s.add.split(' ').forEach(function (c) { e.classList.add(c); });
      if (s.remove) s.remove.split(' ').forEach(function (c) { e.classList.remove(c); });
      if (s.fn && !(instant && s.skipFn)) { try { s.fn(instant); } catch (err) {} }
    }
    function finish(instant) {
      if (finished) return; finished = true;
      timers.forEach(clearTimeout);
      steps.forEach(function (s) { if (!s.__done) { s.__done = true; apply(s, instant); } });
      root.classList.remove('is-opening'); root.classList.add('is-opened');
      if (instant) root.classList.add('is-skipped');
      try { if (o.key) sessionStorage.setItem('jp-seen-' + o.key, '1'); } catch (e) {}
      d.removeEventListener('pointerdown', onSkip); d.removeEventListener('keydown', onKey); d.removeEventListener('wheel', onSkip);
      if (o.done) { try { o.done(instant); } catch (err) {} }
      w.dispatchEvent(new CustomEvent('jp:opened', { detail: { skipped: !!instant } }));
    }
    function onSkip() { finish(true); }
    function onKey(ev) { if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Escape') finish(true); }
    function start() {
      if (started) return; started = true;
      if (reduced) { finish(true); return; }
      root.classList.add('is-opening');
      var end = 0;
      steps.forEach(function (s) {
        end = Math.max(end, s.at);
        timers.push(setTimeout(function () { if (!s.__done) { s.__done = true; apply(s, false); } }, s.at));
      });
      timers.push(setTimeout(function () { finish(false); }, end + (o.tail || 400)));
      /* hard guard: no entrance may hold the page longer than this, whatever happens */
      timers.push(setTimeout(function () { finish(true); }, Math.max(end + 2000, o.max || 12000)));
      if (o.skipOn !== false) {
        setTimeout(function () {
          if (finished) return;
          d.addEventListener('pointerdown', onSkip, { passive: true });
          d.addEventListener('keydown', onKey);
          d.addEventListener('wheel', onSkip, { passive: true });
        }, o.skipAfter || 600);
      }
    }
    return { start: start, skip: function () { finish(true); }, get finished() { return finished; } };
  };

  /* 4 ─ Video gating. <video class="jp-video" muted playsinline loop autoplay preload="metadata" poster="…">
     Reduced motion or Save-Data: sources are dropped and the poster stands as the picture.
     Otherwise: declarative autoplay + a nudge; pause when off-screen; fade in on 'playing'; self-remove on error. */
  JP.video = function (v) {
    if (!v || v.__jp) return; v.__jp = true;
    v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.playsInline = true;
    if (reduced || saveData) {
      v.removeAttribute('autoplay'); v.pause();
      Array.prototype.forEach.call(v.querySelectorAll('source'), function (s) { s.remove(); });
      if (v.getAttribute('src')) v.removeAttribute('src');
      v.classList.add('is-static');
      return;
    }
    var nudge = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    v.addEventListener('playing', function () { v.classList.add('is-playing'); });
    v.addEventListener('error', function () { v.classList.remove('is-playing'); v.remove(); }, true);
    if ('IntersectionObserver' in w) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) nudge(); else v.pause(); });
      }, { rootMargin: '160px 0px' });
      io.observe(v);
    } else nudge();
    d.addEventListener('visibilitychange', function () { if (!d.hidden) nudge(); });
  };
  JP.videos = function (scope) { (scope || d).querySelectorAll('video.jp-video').forEach(JP.video); };

  /* 5 ─ Frame loop for scroll-linked work. JP.onFrame(fn) → fn({y, vh, vw, dy}) on scroll/resize only. */
  var frameFns = [], dirty = true, lastY = 0, raf = 0;
  function tick() {
    raf = 0; if (!dirty) return; dirty = false;
    var y = w.scrollY || w.pageYOffset || 0, s = { y: y, dy: y - lastY, vh: w.innerHeight, vw: w.innerWidth }; lastY = y;
    for (var i = 0; i < frameFns.length; i++) { try { frameFns[i](s); } catch (e) {} }
  }
  function kick() { dirty = true; if (!raf) raf = requestAnimationFrame(tick); }
  JP.onFrame = function (fn) { frameFns.push(fn); if (frameFns.length === 1) { w.addEventListener('scroll', kick, { passive: true }); w.addEventListener('resize', kick); } kick(); return function () { frameFns = frameFns.filter(function (f) { return f !== fn; }); }; };
  JP.kick = kick;
  /* progress of an element through the viewport: 0 = top edge enters at bottom, 1 = bottom edge leaves at top */
  JP.progress = function (el, vh) {
    var r = el.getBoundingClientRect(); vh = vh || w.innerHeight;
    return { p: JP.clamp((vh - r.top) / (vh + r.height), 0, 1), r: r, inView: r.bottom > 0 && r.top < vh };
  };
  /* pinned-section progress: 0 when the section top hits the viewport top, 1 when its bottom hits the viewport bottom */
  JP.pinProgress = function (el, vh) {
    var r = el.getBoundingClientRect(); vh = vh || w.innerHeight;
    return JP.clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
  };

  /* 6 ─ Study nav (from the JP_STUDY manifest in media.js) */
  JP.studyNav = function (opts) {
    var study = w.JP_STUDY; if (!study) return;
    var slug = (opts && opts.current) || (d.body && d.body.getAttribute('data-concept'));
    var list = study.concepts, idx = -1;
    list.forEach(function (c, i) { if (c.slug === slug) idx = i; });
    var prev = idx > 0 ? list[idx - 1] : null, next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
    var rel = (opts && opts.rel) || (idx >= 0 ? '../' : '');
    var nav = d.createElement('nav'); nav.className = 'study-nav' + ((opts && opts.light) || (d.body && d.body.hasAttribute('data-study-light')) ? ' light' : '');
    nav.setAttribute('aria-label', 'Art direction study');
    var h = '';
    h += '<a class="sn-index" href="' + rel + 'index.html" aria-label="All six directions">JP&nbsp;MEDIA<span>&nbsp;· Index</span></a>';
    if (idx >= 0) {
      h += '<span class="sn-cur"><b>' + list[idx].n + ' / 0' + list.length + '</b>' + list[idx].name + '</span>';
      h += prev ? '<a class="sn-arrow" href="' + rel + prev.slug + '/index.html" aria-label="Previous: ' + prev.name + '">&larr;</a>' : '<span class="sn-arrow" aria-hidden="true" style="opacity:.3">&larr;</span>';
      h += next ? '<a class="sn-arrow" href="' + rel + next.slug + '/index.html" aria-label="Next: ' + next.name + '">&rarr;</a>' : '<span class="sn-arrow" aria-hidden="true" style="opacity:.3">&rarr;</span>';
    }
    nav.innerHTML = h;
    d.body.appendChild(nav);
    var live = function () { requestAnimationFrame(function () { nav.classList.add('is-live'); }); };
    if (root.classList.contains('is-opened') || !root.classList.contains('js-anim')) live();
    else { w.addEventListener('jp:opened', live, { once: true }); setTimeout(live, (opts && opts.fallback) || 9000); }
    return nav;
  };

  /* 7 ─ Auto-init */
  function init() {
    JP.reveal();
    JP.videos();
    if (d.body && d.body.hasAttribute('data-concept') && !d.body.hasAttribute('data-no-study-nav')) JP.studyNav();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
