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

  /* ── 1b · The showreel: plays once from the moment the letterbox opens, then freezes on its
         last frame (the rooftop sunset) which stays as the hero still. ── */
  var reel = $('#reel'), reelTC = $('#band-tc'), reelImg = band ? $('img', band) : null;
  var LAST = '../media/stills/m-rooftop.jpg';
  function reelFromTop() { if (reel && reel.readyState > 0 && reel.currentTime > 0.2) { try { reel.currentTime = 0; } catch (e) {} } }
  if (reel && reelTC) {
    reel.addEventListener('timeupdate', function () {
      var t = reel.currentTime, s = Math.floor(t), f = Math.floor((t - s) * 24);
      reelTC.textContent = '00:00:' + pad(s) + ':' + pad(f);
    });
    reel.addEventListener('playing', function () { var im = new Image(); im.src = LAST; }, { once: true });
    reel.addEventListener('ended', function () {
      root.classList.add('reel-ended');
      if (reelImg) { reelImg.removeAttribute('srcset'); reelImg.src = LAST; }
      /* the still underneath is the last frame: fade the player out and drop it so nothing can restart it */
      setTimeout(function () { reel.classList.remove('is-playing'); setTimeout(function () { if (reel.parentNode) reel.remove(); }, 1000); }, 250);
    });
  }

  if (JP.sequence && name) {
    if (anim) {
      try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
      w.scrollTo(0, 0);
      prep();
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { if (phase < 2) prep(); });
      w.addEventListener('resize', function () { if (!root.classList.contains('is-opened')) { if (phase < 2) measureName(); if (phase < 3) measureBars(); } });
    }
    JP.sequence({
      key: 'c01', tail: 400,
      steps: [
        { at: 0, add: 'p0', fn: function () { phase = 0; startTC(); } },
        { at: 700, add: 'p1', fn: function () { phase = 1; } },
        { at: 1150, add: 'p2', fn: function () { phase = 2; } },
        { at: 1950, add: 'p3', long: true, fn: function (instant) { phase = 3; if (!instant) measureBars(); reelFromTop(); } },
        { at: 2650, add: 'p4', fn: function () { phase = 4; } },
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

  /* ── 4 · Feature title cards: rise when ≥ 55% in view, both ways; desktop parallax ── */
  var feats = $$('[data-feature]');
  if (feats.length && 'IntersectionObserver' in w && anim) {
    var fio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('is-on', e.intersectionRatio >= 0.55); });
    }, { threshold: [0, 0.55, 1] });
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
  var strip = $('#strip'), count = $('.strip-count'), items = strip ? $$('li', strip) : [];
  var sraf = 0;
  function stripUpdate() {
    sraf = 0; if (!strip) return;
    var mid = strip.getBoundingClientRect().left + strip.clientWidth * 0.5, best = 0, bd = 1e9;
    /* when the strip is scrolled to its end the last frame is current */
    if (strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 2) best = items.length - 1;
    else items.forEach(function (li, i) { var r = li.getBoundingClientRect(); var c = Math.abs(r.left + r.width / 2 - mid); if (r.left < mid && c < bd) { bd = c; best = i; } });
    items.forEach(function (li, i) { li.classList.toggle('is-cur', i === best); });
    if (count) count.innerHTML = '<b>FR ' + pad(best + 1) + '</b> / ' + pad(items.length);
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

  /* ── 6 · Email control: demo-safe ─────────────────────────────── */
  var ec = $('#email-ctl'), en = $('#email-note');
  if (ec && en) ec.addEventListener('click', function () {
    var open = ec.getAttribute('aria-expanded') === 'true';
    ec.setAttribute('aria-expanded', open ? 'false' : 'true');
    en.innerHTML = open ? 'Email <b>enabled at launch</b>' : 'Preview build: email is <b>enabled at launch</b>. Until then, Instagram @jp.media.';
  });
})();
