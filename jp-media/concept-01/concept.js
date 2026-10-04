/* CONCEPT 01 — PICTURE START · runtime
   Entrance sequencer (phase classes p0…p5 on <html>), FLIP of the title into
   its title-card position, letterbox bars, timecode, header line, Index menu,
   feature title cards, contact strip counter + desktop pin, email control. */
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
  /* the letterbox opens to the clip on phones, to the whole 2.39 stage on desktop */
  function measureBars() {
    var lb = wide.matches ? (stage || band) : band; if (!lb) return;
    var r = lb.getBoundingClientRect(), vh = w.innerHeight, half = vh / 2;
    root.style.setProperty('--bt', Math.max(0, r.top / half).toFixed(4));
    root.style.setProperty('--bb', Math.max(0, (vh - r.bottom) / half).toFixed(4));
  }
  function prep() { measureName(); measureBars(); }

  /* ── 1b · The showreel. Phones: hero-montage plays once from the moment the letterbox opens and freezes
         on its last frame (the rooftop sunset). Desktop: three cuts play in sequence across the triptych and the
         third freezes. Either way the frozen frame becomes 01 / 06 and its card emerges around it. ── */
  var reel = $('#reel'), reelTC = $('#band-tc'), reelImg = band ? $('img', band) : null;
  var LAST = '../media/stills/m-rooftop.jpg';
  var tri = $('#tri'), triV = tri ? $$('video', tri) : [], triIdx = -1, triOff = 0, triStarted = false, triPlayed = false;
  var useTri = wide.matches && triV.length === 3 && !JP.reduced && !JP.saveData;
  function setTC(t) { var s = Math.floor(t), f = Math.floor((t - s) * 24); if (reelTC) reelTC.textContent = '00:00:' + pad(s) + ':' + pad(f); }
  function cardNow() { root.classList.add('reel-ended'); }
  function reelFromTop() { if (reel && reel.readyState > 0 && reel.currentTime > 0.2) { try { reel.currentTime = 0; } catch (e) {} } }
  if (reel && reelTC && !useTri) {
    reel.addEventListener('timeupdate', function () { setTC(reel.currentTime); });
    reel.addEventListener('playing', function () { var im = new Image(); im.src = LAST; }, { once: true });
    reel.addEventListener('ended', function () {
      cardNow();
      if (reelImg) { reelImg.removeAttribute('srcset'); reelImg.src = LAST; }
      /* the still underneath is the last frame: fade the player out and drop it so nothing can restart it */
      setTimeout(function () { reel.classList.remove('is-playing'); setTimeout(function () { if (reel.parentNode) reel.remove(); }, 1000); }, 250);
    });
  }
  /* desktop triptych: one clip at a time, left to right, each between its in/out points (the exports carry
     the neighbouring shots at head and tail); a clip pauses on its out-frame, a clip that cannot play is skipped */
  function triIn(v) { return parseFloat(v.getAttribute('data-in')) || 0; }
  function triOut(v) { return parseFloat(v.getAttribute('data-out')) || (v.duration || 9); }
  function triEnd(i) {
    var v = triV[i]; if (triIdx !== i || v.__done) return; v.__done = true;
    clearTimeout(v.__t); try { v.pause(); } catch (e) {}
    triOff += Math.max(0, triOut(v) - triIn(v));
    triPlay(i + 1);
  }
  function triPlay(i) {
    if (i >= triV.length) { cardNow(); return; }
    triIdx = i; var v = triV[i], t0 = triIn(v);
    if (triV[i + 1]) triV[i + 1].preload = 'auto';
    var seek = function () { try { if (Math.abs(v.currentTime - t0) > 0.05) v.currentTime = t0; } catch (e) {} };
    if (v.readyState >= 1) seek(); else v.addEventListener('loadedmetadata', seek, { once: true });
    var p = v.play(); if (p && p.catch) p.catch(function () { if (triIdx === i && !v.__done) { v.__done = true; triPlay(i + 1); } });
  }
  if (useTri) {
    triV[0].preload = 'auto';
    triV.forEach(function (v, i) {
      var last = v.querySelector('source:last-child');
      v.addEventListener('playing', function () {
        triPlayed = true; v.classList.add('is-playing');
        clearTimeout(v.__t); v.__t = setTimeout(function () { triEnd(i); }, Math.max(0, (triOut(v) - v.currentTime) * 1000));
      });
      v.addEventListener('timeupdate', function () { if (triIdx !== i || v.__done) return; if (v.currentTime >= triOut(v)) triEnd(i); else setTC(triOff + Math.max(0, v.currentTime - triIn(v))); });
      v.addEventListener('ended', function () { triEnd(i); });
      v.addEventListener('error', function (ev) { if (triIdx === i && !v.__done && (ev.target === v || ev.target === last)) { v.__done = true; triPlay(i + 1); } }, true);
    });
    d.addEventListener('visibilitychange', function () { if (!d.hidden && triIdx >= 0 && !root.classList.contains('reel-ended')) { var v = triV[triIdx]; if (v.paused && !v.ended && !v.__done) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } } });
  }
  function startReel() {
    if (useTri) { if (!triStarted) { triStarted = true; triPlay(0); } }
    else reelFromTop();
  }
  /* no reel (reduced motion, Save-Data, error, blocked autoplay): the poster is the frame and the card shows */
  if (useTri) {
    w.addEventListener('jp:opened', function () {
      setTimeout(function () { if (!triPlayed) cardNow(); }, 2500);
      setTimeout(cardNow, 12000);
    }, { once: true });
  } else if (!reel || reel.classList.contains('is-static') || JP.reduced || JP.saveData) cardNow();
  else {
    reel.addEventListener('error', cardNow, true);
    w.addEventListener('jp:opened', function () {
      setTimeout(function () { if (!root.classList.contains('reel-ended') && (reel.paused || !reel.parentNode)) cardNow(); }, 2500);
      setTimeout(cardNow, 14000);
    }, { once: true });
  }

  /* the letterbox opens at p3; on a replay p3 (long) is skipped and p4 opens it instead */
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
        /* the title is home: drop the transform hooks so nothing can move it again */
        setTimeout(function () { if (name) { name.style.removeProperty('--flip'); name.style.willChange = 'auto'; } }, 1300);
      }
    }).start();
  } else {
    root.classList.add('is-opened');
  }

  /* ── 2 · Header line after 40px ───────────────────────────────── */
  if (JP.onFrame) JP.onFrame(function (s) { root.classList.toggle('is-scrolled', s.y > 40); });

  /* ── 3 · Index menu: focus trap, Esc, body lock, inert when closed ── */
  var menu = $('#menu'), menuBtn = $('#menu-btn'), menuClose = $('#menu-close'), lastFocus = null;
  function focusables() { return $$('a[href],button:not([disabled])', menu).filter(function (e) { return e.offsetParent !== null || getComputedStyle(e).position === 'fixed'; }); }
  function openMenu() {
    if (!menu) return;
    lastFocus = d.activeElement;
    menu.removeAttribute('inert'); menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open'); root.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    setTimeout(function () { (menuClose || menu).focus(); }, 60);
    d.addEventListener('keydown', onMenuKey);
  }
  function closeMenu(returnFocus) {
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open'); root.classList.remove('menu-open');
    menu.setAttribute('inert', ''); menu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    d.removeEventListener('keydown', onMenuKey);
    if (returnFocus !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onMenuKey(ev) {
    if (ev.key === 'Escape') { ev.preventDefault(); closeMenu(); return; }
    if (ev.key !== 'Tab') return;
    var f = focusables(); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && d.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && d.activeElement === last) { ev.preventDefault(); first.focus(); }
  }
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', function () { menu.classList.contains('is-open') ? closeMenu() : openMenu(); });
    if (menuClose) menuClose.addEventListener('click', function () { closeMenu(); });
    $$('.menu-list a', menu).forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
  }

  /* ── 4 · Feature title cards: rise at ≥ 55% in view, stay until the frame is nearly gone; desktop parallax ── */
  var feats = $$('[data-feature]');
  if (feats.length && 'IntersectionObserver' in w && anim) {
    var fio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('is-on', e.intersectionRatio >= 0.55 || (e.target.classList.contains('is-on') && e.intersectionRatio > 0.1)); });
    }, { threshold: [0, 0.1, 0.55, 1] });
    feats.forEach(function (f) { fio.observe(f); });
  } else {
    feats.forEach(function (f) { f.classList.add('is-on'); });
  }
  if (JP.onFrame && desk.matches && root.classList.contains('has-pointer') && !JP.reduced) {
    var plates = feats.map(function (f) { return { stage: $('.feat-stage', f), img: $('.frame>img', f) }; });
    JP.onFrame(function (s) {
      for (var i = 0; i < plates.length; i++) {
        var pl = plates[i]; if (!pl.img) continue;
        var pr = JP.progress(pl.stage, s.vh);
        if (!pr.inView) continue;
        pl.img.style.setProperty('--py', ((0.5 - pr.p) * pr.r.height * 0.06).toFixed(1) + 'px');
      }
    });
  }

  /* ── 5 · Contact strip: current frame counter; desktop pin link ── */
  var strip = $('#strip'), count = $('.strip-count'), live = $('#strip-live'), items = strip ? $$('li', strip) : [];
  var sraf = 0, liveT = 0, liveLast = -1;
  function stripUpdate() {
    sraf = 0; if (!strip) return;
    var mid = strip.getBoundingClientRect().left + strip.clientWidth * 0.5, best = 0, bd = 1e9;
    /* when the strip is scrolled to its end the last frame is current */
    if (strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 2) best = items.length - 1;
    else items.forEach(function (li, i) { var r = li.getBoundingClientRect(); var c = Math.abs(r.left + r.width / 2 - mid); if (r.left < mid && c < bd) { bd = c; best = i; } });
    items.forEach(function (li, i) { li.classList.toggle('is-cur', i === best); });
    if (count) count.innerHTML = '<b>FR ' + pad(best + 1) + '</b> / ' + pad(items.length);
    if (live && best !== liveLast) { clearTimeout(liveT); liveT = setTimeout(function () { liveLast = best; live.textContent = 'Frame ' + (best + 1) + ' of ' + items.length; }, 600); }
  }
  if (strip) {
    /* the strip is a swipe sequence: fetch its frames once the roll is near */
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

  /* ── 5b · The full reel: muted, preload none, plays only on tap, visible pause; pauses off-screen ── */
  var full = $('#full'), fullFrame = $('#full-frame'), play = $('#play'), fullTC = $('#full-tc');
  if (full && play && fullFrame) {
    var playTxt = $('span', play);
    function fullState(on) {
      fullFrame.classList.toggle('is-playing', on);
      play.setAttribute('aria-pressed', on ? 'true' : 'false');
      play.setAttribute('aria-label', on ? 'Pause the showreel' : 'Play the full showreel, muted');
      if (playTxt) playTxt.textContent = on ? 'Pause' : 'Play';
    }
    play.addEventListener('click', function () {
      if (full.paused || full.ended) { var p = full.play(); if (p && p.catch) p.catch(function () { fullState(false); }); }
      else full.pause();
    });
    full.addEventListener('playing', function () { fullState(true); });
    full.addEventListener('pause', function () { fullState(false); });
    full.addEventListener('ended', function () { fullState(false); try { full.currentTime = 0; } catch (e) {} });
    full.addEventListener('error', function () { fullState(false); play.hidden = true; }, true);
    full.addEventListener('timeupdate', function () {
      if (!fullTC) return; var t = full.currentTime, s = Math.floor(t), f = Math.floor((t - s) * 24);
      fullTC.textContent = '00:00:' + pad(s) + ':' + pad(f);
    });
    if ('IntersectionObserver' in w) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting && !full.paused) full.pause(); }); }, { threshold: 0.2 }).observe(fullFrame);
    }
    d.addEventListener('visibilitychange', function () { if (d.hidden && !full.paused) full.pause(); });
  }

  /* ── 6 · Email control: demo-safe ─────────────────────────────── */
  var ec = $('#email-ctl'), en = $('#email-note');
  if (ec && en) ec.addEventListener('click', function () {
    var open = ec.getAttribute('aria-expanded') === 'true';
    ec.setAttribute('aria-expanded', open ? 'false' : 'true');
    en.innerHTML = open ? 'Email <b>enabled at launch</b>' : 'Preview build: email is <b>enabled at launch</b>. Until then, Instagram @jp.media.';
  });
})();
