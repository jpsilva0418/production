/* JP SILVA MEDIA — HOME (Picture Start) · runtime
   Entrance sequencer (phase classes p0…p5 on <html>), FLIP of the title into its title-card position,
   letterbox bars, timecode, the opening cuts, feature title cards + desktop parallax, contact strip.
   Site-wide behaviour (header line, Index menu, reveal safety net) lives in site.js. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, w = window;
  var JP = w.JP || {};
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var anim = root.classList.contains('js-anim');
  var desk = w.matchMedia ? w.matchMedia('(min-width:900px) and (pointer:fine)') : { matches: false };

  /* ── 1 · Entrance ─────────────────────────────────────────────── */
  var name = $('.name'), band = $('.band'), stage = $('#stage'), opener = $('#opener'), tcEl = $('#tc');
  var wide = w.matchMedia ? w.matchMedia('(min-width:900px)') : { matches: false };
  var phase = 0, tcTimer = 0, frames = 0;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    frames++;
    var s = Math.floor(frames / 24), f = frames % 24;
    if (tcEl) tcEl.textContent = '00:00:' + pad(s) + ':' + pad(f);
  }
  function startTC() { if (tcTimer) return; tcTimer = setInterval(tick, 1000 / 24); }
  function stopTC() { if (tcTimer) { clearInterval(tcTimer); tcTimer = 0; } }

  /* measure the title at rest, then express the intro state as a transform from it */
  function measureName() {
    if (!name) return;
    var prevT = name.style.transition;
    name.style.transition = 'none'; name.style.setProperty('--flip', 'none');
    void name.offsetWidth;
    var r = name.getBoundingClientRect(), vw = w.innerWidth, vh = w.innerHeight;
    var fs = parseFloat(getComputedStyle(name).fontSize) || 1;
    var probe = d.createElement('span'); probe.style.cssText = 'position:absolute;visibility:hidden;font-size:var(--name-intro)';
    d.body.appendChild(probe); var fi = parseFloat(getComputedStyle(probe).fontSize) || fs; probe.remove();
    var k = fi / fs, cw = r.width * k, ch = r.height * k;
    var tx = (vw - cw) / 2 - r.left, ty = (vh - ch) / 2 - r.top;
    name.style.setProperty('--flip', 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + k.toFixed(4) + ')');
    if (opener) opener.style.setProperty('--eb-off', Math.round(ch / 2 + (vw >= 900 ? 40 : 30)) + 'px');
    void name.offsetWidth;
    name.style.transition = prevT;
  }
  /* the letterbox opens to the clip on phones, to the 2.39 band on desktop */
  function measureBars() {
    var lb = wide.matches ? (stage || band) : band; if (!lb) return;
    var r = lb.getBoundingClientRect(), vh = w.innerHeight, half = vh / 2;
    root.style.setProperty('--bt', Math.max(0, r.top / half).toFixed(4));
    root.style.setProperty('--bb', Math.max(0, (vh - r.bottom) / half).toFixed(4));
  }
  function prep() { measureName(); measureBars(); }

  /* ── 1b · The opening cuts. Phones: hero-montage plays once from the moment the letterbox opens and freezes
         on its last frame. Desktop: two landscape cuts play back to back inside the band and the second
         holds its last frame. ── */
  var reel = $('#reel'), reelTC = $('#band-tc'), reelImg = band ? $('img', band) : null;
  var BASE = (w.JPSM && w.JPSM.base) || '/';
  var LAST = BASE + 'media/stills/m-rooftop.jpg';
  var dband = $('#dband'), seqV = dband ? $$('video', dband) : [], seqIdx = -1, seqOff = 0, seqStarted = false, seqPlayed = false;
  var useSeq = wide.matches && seqV.length > 0 && !JP.reduced && !JP.saveData;
  function setTC(t) { var s = Math.floor(t), f = Math.floor((t - s) * 24); if (reelTC) reelTC.textContent = '00:00:' + pad(s) + ':' + pad(f); }
  function reelEnd() { root.classList.add('reel-ended'); }
  function reelFromTop() { if (reel && reel.readyState > 0 && reel.currentTime > 0.2) { try { reel.currentTime = 0; } catch (e) {} } }
  if (reel && reelTC && !useSeq) {
    reel.addEventListener('timeupdate', function () { setTC(reel.currentTime); });
    reel.addEventListener('playing', function () { var im = new Image(); im.src = LAST; }, { once: true });
    reel.addEventListener('ended', function () {
      reelEnd();
      if (reelImg) { reelImg.removeAttribute('srcset'); reelImg.src = LAST; }
      setTimeout(function () { reel.classList.remove('is-playing'); setTimeout(function () { if (reel.parentNode) reel.remove(); }, 1000); }, 250);
    });
  }
  function seqEnd(i) {
    var v = seqV[i]; if (seqIdx !== i || v.__done) return; v.__done = true;
    try { v.pause(); } catch (e) {}
    seqOff += v.duration || 0;
    if (i + 1 < seqV.length) seqPlay(i + 1);
    else { v.classList.add('is-held'); reelEnd(); }
  }
  function seqPlay(i) {
    seqIdx = i; var v = seqV[i];
    if (seqV[i + 1]) seqV[i + 1].preload = 'auto';
    var p = v.play(); if (p && p.catch) p.catch(function () { if (seqIdx === i && !v.__done) { v.__done = true; if (i + 1 < seqV.length) seqPlay(i + 1); else reelEnd(); } });
  }
  if (useSeq) {
    seqV[0].preload = 'auto';
    seqV.forEach(function (v, i) {
      var last = v.querySelector('source:last-child');
      v.addEventListener('playing', function () { seqPlayed = true; v.classList.add('is-playing'); if (i > 0) seqV[i - 1].classList.remove('is-playing'); });
      v.addEventListener('timeupdate', function () { if (seqIdx === i && !v.__done) setTC(seqOff + v.currentTime); });
      v.addEventListener('ended', function () { seqEnd(i); });
      v.addEventListener('error', function (ev) { if (seqIdx === i && !v.__done && (ev.target === v || ev.target === last)) { v.__done = true; if (i + 1 < seqV.length) seqPlay(i + 1); else reelEnd(); } }, true);
    });
    d.addEventListener('visibilitychange', function () { if (!d.hidden && seqIdx >= 0 && !root.classList.contains('reel-ended')) { var v = seqV[seqIdx]; if (v.paused && !v.ended && !v.__done) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } } });
  }
  function startReel() {
    if (useSeq) { if (!seqStarted) { seqStarted = true; seqPlay(0); } }
    else reelFromTop();
  }
  if (useSeq) {
    w.addEventListener('jp:opened', function () {
      setTimeout(function () { if (!seqPlayed) reelEnd(); }, 2500);
      setTimeout(reelEnd, 12000);
    }, { once: true });
  } else if (!reel || reel.classList.contains('is-static') || JP.reduced || JP.saveData) reelEnd();
  else {
    reel.addEventListener('error', reelEnd, true);
    w.addEventListener('jp:opened', function () {
      setTimeout(function () { if (!root.classList.contains('reel-ended') && (reel.paused || !reel.parentNode)) reelEnd(); }, 2500);
      setTimeout(reelEnd, 14000);
    }, { once: true });
  }

  var opened = false;
  function openBox(instant) {
    if (opened) return; opened = true;
    if (!instant) measureBars();
    stopTC(); startReel();
  }
  if (JP.sequence && name) {
    if (anim) {
      try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
      w.scrollTo(0, 0);
      prep();
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { if (phase < 2) prep(); });
      w.addEventListener('resize', function () { if (!root.classList.contains('is-opened')) { if (phase < 2) measureName(); if (!opened) measureBars(); } });
    }
    JP.sequence({
      key: 'c01', tail: 400, skipAfter: 120,
      steps: [
        { at: 0, add: 'p0', fn: function () { phase = 0; startTC(); } },
        { at: 700, add: 'p1', fn: function () { phase = 1; } },
        { at: 1150, add: 'p2', fn: function () { phase = 2; } },
        { at: 1950, add: 'p3', long: true, fn: function (instant) { phase = 3; openBox(instant); } },
        { at: 2650, add: 'p4', fn: function (instant) { phase = 4; openBox(instant); } },
        { at: 3100, add: 'p5', fn: function () { phase = 5; } }
      ],
      done: function () {
        stopTC();
        setTimeout(function () { if (name) { name.style.removeProperty('--flip'); name.style.willChange = 'auto'; } }, 1300);
      }
    }).start();
  } else {
    root.classList.add('is-opened');
  }

  /* ── 4 · Feature title cards: rise once the frame is ≥ 55% in view and stay; desktop parallax ── */
  var feats = $$('[data-feature]');
  function cardOn(f) { if (!f.classList.contains('is-on')) f.classList.add('is-on'); }
  if (feats.length && 'IntersectionObserver' in w && anim) {
    var fio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.intersectionRatio >= 0.55) { cardOn(e.target); fio.unobserve(e.target); } });
    }, { threshold: [0.55, 1] });
    feats.forEach(function (f) { fio.observe(f); });
  } else {
    feats.forEach(cardOn);
  }
  if (JP.onFrame && desk.matches && root.classList.contains('has-pointer') && !JP.reduced) {
    var plates = feats.map(function (f) { return { stage: $('.feat-stage', f), img: $('.frame>img', f) }; });
    JP.onFrame(function (s) {
      for (var i = 0; i < plates.length; i++) {
        var pl = plates[i]; if (!pl.img || !pl.stage) continue;
        var pr = JP.progress(pl.stage, s.vh);
        if (!pr.inView) continue;
        pl.img.style.setProperty('--py', ((0.5 - pr.p) * pr.r.height * 0.06).toFixed(1) + 'px');
      }
    });
  }

  /* ── 4b · Feature cards safety net (site.js covers [data-reveal]): a feature mostly in view is carded ── */
  if (anim && JP.onFrame) {
    JP.onFrame(function (s) { feats.forEach(function (f) { if (f.classList.contains('is-on')) return; var r = f.getBoundingClientRect(); if (r.top < s.vh * 0.45 && r.bottom > s.vh * 0.55) cardOn(f); }); });
    w.addEventListener('jp:capture', function () { feats.forEach(cardOn); });
  }

  /* ── 5 · Contact strip: current frame counter; desktop pin link ── */
  var strip = $('#strip'), count = $('.strip-count'), live = $('#strip-live'), items = strip ? $$('li', strip) : [];
  var sraf = 0, liveT = 0, liveLast = -1;
  function stripUpdate() {
    sraf = 0; if (!strip) return;
    var mid = strip.getBoundingClientRect().left + strip.clientWidth * 0.5, best = 0, bd = 1e9;
    if (strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 2) best = items.length - 1;
    else items.forEach(function (li, i) { var r = li.getBoundingClientRect(); var c = Math.abs(r.left + r.width / 2 - mid); if (r.left < mid && c < bd) { bd = c; best = i; } });
    items.forEach(function (li, i) { li.classList.toggle('is-cur', i === best); });
    if (count) count.innerHTML = '<b>FR ' + pad(best + 1) + '</b> / ' + pad(items.length);
    if (live && best !== liveLast) { clearTimeout(liveT); liveT = setTimeout(function () { liveLast = best; live.textContent = 'Frame ' + (best + 1) + ' of ' + items.length; }, 600); }
  }
  if (strip) {
    if ('IntersectionObserver' in w) {
      var pio = new IntersectionObserver(function (es) {
        if (!es.some(function (e) { return e.isIntersecting; })) return;
        $$('img[loading="lazy"]', strip).forEach(function (im) { im.loading = 'eager'; });
        pio.disconnect();
      }, { rootMargin: '600px 0px' });
      pio.observe(strip);
    }
    strip.addEventListener('scroll', function () { if (!sraf) sraf = requestAnimationFrame(stripUpdate); }, { passive: true });
    var sec = $('.strip-sec');
    if (JP.onFrame && desk.matches && !JP.reduced && sec) {
      JP.onFrame(function (s) {
        var r = sec.getBoundingClientRect();
        if (r.bottom < 0 || r.top > s.vh) return;
        var p = JP.pinProgress(sec, s.vh);
        var max = strip.scrollWidth - strip.clientWidth;
        if (max > 0) strip.scrollLeft = Math.round(p * max);
      });
    }
  }

})();
