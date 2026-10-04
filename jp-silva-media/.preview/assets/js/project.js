/* JP SILVA MEDIA — project page
   The film: YouTube facade (one nocookie iframe on click) or his own file (play with sound, then native controls).
   One audible source site-wide (jpsm:sound). Pauses when the page is hidden or the lightbox opens.
   Lightbox: full-screen frames, FR counter, prev/next (buttons, arrows, swipe), Esc, focus trap, scroll lock. */
(function () {
  'use strict';
  var d = document, w = window, root = d.documentElement, JP = w.JP || {}, CFG = w.JPSM || {};
  var OWNER = 'project-film';
  function sound() { try { w.dispatchEvent(new CustomEvent('jpsm:sound', { detail: { owner: OWNER } })); } catch (e) {} }

  /* ---- 1 · his own film ---- */
  var film = d.getElementById('pj-film'), video = d.getElementById('pj-video'), play = d.getElementById('pj-play');
  function pauseFilm() { if (video && !video.paused) video.pause(); }
  if (film && video && play) {
    /* facade: poster + our control; native controls only once he has chosen to watch */
    video.controls = false; play.hidden = false;
    play.addEventListener('click', function () {
      film.classList.add('is-started');
      video.controls = true;
      video.muted = false;
      video.preload = 'auto';
      sound();
      var p = video.play();
      if (p && p.catch) p.catch(function () { video.muted = false; });
      video.focus({ preventScroll: true });
    });
    video.addEventListener('play', function () { if (!video.muted) sound(); film.classList.add('is-started'); video.controls = true; });
    video.addEventListener('error', function () { film.classList.add('is-error'); }, true);
  }

  /* ---- 2 · YouTube facade (real host only: on the preview the control is a link to YouTube) ---- */
  var yt = d.getElementById('pj-yt'), ytFrame = null;
  var ytBtn = yt && yt.querySelector('[data-yt]');
  if (yt && ytBtn && CFG.youtube) {
    ytBtn.setAttribute('role', 'button');
    ytBtn.setAttribute('aria-label', ytBtn.getAttribute('data-label') || 'Play film');
    ytBtn.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); ytBtn.click(); } });
    ytBtn.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
      e.preventDefault();
      var id = ytBtn.getAttribute('data-yt');
      var f = d.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&playsinline=1&rel=0&enablejsapi=1';
      f.title = (yt.getAttribute('data-title') || 'Film') + ' (YouTube video player)';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.setAttribute('allowfullscreen', '');
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      /* nothing may sit over a playing player: the poster, grade, control and caption all go */
      while (yt.firstChild) yt.removeChild(yt.firstChild);
      yt.appendChild(f);
      yt.classList.add('is-started');
      ytFrame = f;
      sound();
      f.focus();
    });
  }
  function pauseYT() {
    if (!ytFrame || !ytFrame.contentWindow) return;
    try { ytFrame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*'); } catch (e) {}
  }

  /* one audible source: anything else that starts with sound pauses this page's film */
  w.addEventListener('jpsm:sound', function (e) {
    if (e && e.detail && e.detail.owner === OWNER) return;
    pauseFilm(); pauseYT();
  });
  d.addEventListener('visibilitychange', function () { if (d.hidden) { pauseFilm(); pauseYT(); } });
  w.addEventListener('pagehide', function () { pauseFilm(); pauseYT(); });

  /* ---- 3 · Lightbox ---- */
  var lb = d.getElementById('lb');
  if (!lb) return;
  var data = [];
  try { data = JSON.parse(lb.getAttribute('data-items') || '[]'); } catch (e) { data = []; }
  if (!data.length) return;
  var imgEl = d.getElementById('lb-img'), cap = d.getElementById('lb-cap'), num = d.getElementById('lb-n');
  var prev = d.getElementById('lb-prev'), next = d.getElementById('lb-next'), close = d.getElementById('lb-close'), stage = d.getElementById('lb-stage');
  var idx = 0, last = null, open = false, cache = {};
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var outside = [];

  function preload(i) {
    if (i < 0 || i >= data.length || cache[i]) return;
    var im = new Image(); im.decoding = 'async'; im.src = data[i].src; cache[i] = im;
  }
  function show(i) {
    idx = Math.max(0, Math.min(data.length - 1, i));
    var g = data[idx];
    imgEl.classList.add('is-loading');
    imgEl.onload = function () { imgEl.classList.remove('is-loading'); };
    imgEl.width = g.w; imgEl.height = g.h;
    imgEl.src = g.src; imgEl.alt = g.alt;
    if (imgEl.complete) imgEl.classList.remove('is-loading');
    cap.textContent = g.alt;
    num.textContent = 'FR ' + pad(idx + 1);
    if (prev) prev.disabled = idx === 0;
    if (next) next.disabled = idx === data.length - 1;
    preload(idx + 1); preload(idx - 1);
  }
  function focusables() { return Array.prototype.slice.call(lb.querySelectorAll('button:not([disabled])')).filter(function (b) { return b.offsetParent !== null; }); }
  function openLb(i, opener) {
    last = opener || d.activeElement;
    pauseFilm(); pauseYT();
    show(i);
    lb.hidden = false;
    /* everything behind the dialog is inert while it is open */
    if (lb.parentNode !== d.body) d.body.appendChild(lb);
    outside = Array.prototype.slice.call(d.body.children).filter(function (el) { return el !== lb && el.tagName !== 'SCRIPT' && !el.hasAttribute('inert'); });
    outside.forEach(function (el) { el.setAttribute('inert', ''); });
    root.classList.add('lb-open');
    open = true;
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    close.focus();
    d.addEventListener('keydown', onKey);
  }
  function closeLb() {
    if (!open) return;
    open = false;
    lb.classList.remove('is-open');
    root.classList.remove('lb-open');
    outside.forEach(function (el) { el.removeAttribute('inert'); });
    outside = [];
    d.removeEventListener('keydown', onKey);
    var done = function () { if (!open) lb.hidden = true; };
    if (JP.reduced) done(); else setTimeout(done, 280);
    if (last && last.focus) last.focus({ preventScroll: true });
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeLb(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); return; }
    if (e.key === 'Home') { e.preventDefault(); show(0); return; }
    if (e.key === 'End') { e.preventDefault(); show(data.length - 1); return; }
    if (e.key !== 'Tab') return;
    var f = focusables(); if (!f.length) return;
    var first = f[0], lastF = f[f.length - 1];
    if (!lb.contains(d.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); lastF.focus(); }
    else if (!e.shiftKey && d.activeElement === lastF) { e.preventDefault(); first.focus(); }
  }
  close.addEventListener('click', closeLb);
  if (prev) prev.addEventListener('click', function () { show(idx - 1); });
  if (next) next.addEventListener('click', function () { show(idx + 1); });
  /* a click on the black (not the image, not a control) closes */
  lb.addEventListener('click', function (e) { if (e.target === stage || e.target === lb) closeLb(); });

  /* swipe */
  var sx = 0, sy = 0, st = 0, tracking = false;
  stage.addEventListener('touchstart', function (e) { if (e.touches.length !== 1) return; tracking = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now(); }, { passive: true });
  stage.addEventListener('touchmove', function (e) {
    if (!tracking) return;
    var dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
    if (Math.abs(dx) > Math.abs(dy) && !JP.reduced) imgEl.style.transform = 'translateX(' + (dx * 0.4) + 'px)';
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (!tracking) return; tracking = false;
    imgEl.style.transform = '';
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2 && Date.now() - st < 900) show(idx + (dx < 0 ? 1 : -1));
  });

  /* openers: strip frames and the photograph (links to the image file without JS) */
  Array.prototype.forEach.call(d.querySelectorAll('[data-lb]'), function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
      e.preventDefault();
      openLb(parseInt(a.getAttribute('data-lb'), 10) || 0, a);
    });
  });

  /* strip: amber FR number follows the frame in view */
  var strip = d.querySelector('.pj-strip');
  if (strip && 'IntersectionObserver' in w) {
    var lis = Array.prototype.slice.call(strip.children);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting && en.intersectionRatio > 0.6) { lis.forEach(function (l) { l.classList.toggle('is-cur', l === en.target); }); } });
    }, { root: strip, threshold: [0.6] });
    lis.forEach(function (l) { io.observe(l); });
  }
})();
