/* JP SILVA MEDIA — project page
   The film: YouTube (a tap on the poster → one YT.Player, nocookie host, with sound) or his own file (play with sound,
   then native controls).
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

  /* ---- 2 · YouTube (real host only: on the preview, and for a film whose owner turned embedding off, the control
     stays a plain link to YouTube) ----
     The whole frame is the tap target (the control's hit area is stretched over the poster in work.css).
     Tap → one YT.Player (IFrame API, nocookie host), inline, with sound: never muted, he chose to watch.
     The API is warmed when the frame nears the viewport and on pointerdown / focus, so the player is usually created
     inside the tap itself. The poster stays until the film is starting (or REVEAL_MS after ready, so a browser that
     refuses autoplay shows YouTube's own play button), then poster, grade and control leave the frame.
     Embedding refused, film unavailable, API unreachable or too slow → the player is destroyed and the poster comes
     back with a note and the link to YouTube (the markup the build writes for a film marked embeddable:false).
     Test hooks: #pj-yt[data-yt-state] = loading | ready | playing | paused | ended | error;
                 window.JPSM_PLAYER_TEST = { apiMs, readyMs, revealMs }. */
  var yt = d.getElementById('pj-yt'), ytP = null;
  var ytBtn = yt && yt.querySelector('[data-yt]');
  if (yt && ytBtn && CFG.youtube) (function () {
    var T = w.JPSM_PLAYER_TEST || {};
    var API_MS = T.apiMs || 8000, READY_MS = T.readyMs || 15000, REVEAL_MS = T.revealMs || 2500;
    var id = ytBtn.getAttribute('data-yt'), title = yt.getAttribute('data-title') || 'Film';
    var label = ytBtn.querySelector('span:not(.vh)'), note = ytBtn.querySelector('.vh');
    var api = '', hooked = false, state = '', shown = false, waitT = 0, revealT = 0, aside = [];

    function set(s) { state = s; yt.setAttribute('data-yt-state', s); }

    /* one control, a button named for the film; "opens YouTube in a new tab" only comes back with the link */
    ytBtn.setAttribute('role', 'button');
    ytBtn.setAttribute('aria-label', ytBtn.getAttribute('data-label') || 'Play film');
    if (note) note.parentNode.removeChild(note);

    /* the IFrame API: one script, loaded on intent or warmed just before it */
    function loadApi() {
      if (w.YT && w.YT.Player) api = 'ready';
      if (api === 'loading' || api === 'ready') return;
      api = 'loading';
      if (!hooked) {
        hooked = true;
        var prevCb = w.onYouTubeIframeAPIReady;
        w.onYouTubeIframeAPIReady = function () {
          if (prevCb) { try { prevCb(); } catch (e) {} }
          api = 'ready';
          if (state === 'loading' && !ytP) create();
        };
      }
      var s = d.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      s.onerror = function () { api = 'failed'; if (state === 'loading' && !ytP) fail(); };
      d.head.appendChild(s);
    }
    function warm() { if (!state && !api) loadApi(); }

    function play(e) {
      if (state === 'error') return;                                     // a plain link to YouTube again
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;   // new tab / window: YouTube itself
      e.preventDefault();
      if (state) return;                                                 // already on its way
      set('loading');
      yt.classList.add('is-loading');
      if (label) label.textContent = 'Loading film';
      sound();
      if (api === 'failed') api = '';                                    // a failed warm-up gets one more try
      loadApi();
      if (api === 'ready') create();
      else waitT = setTimeout(function () { if (!ytP) fail(); }, API_MS);
    }

    function create() {
      clearTimeout(waitT);
      var host = d.createElement('div');
      host.id = 'pj-yt-player';
      yt.insertBefore(host, yt.firstChild);                              // under the poster until the film starts
      try {
        ytP = new w.YT.Player(host, {
          host: 'https://www.youtube-nocookie.com', videoId: id, width: '100%', height: '100%',
          playerVars: { autoplay: 1, playsinline: 1, controls: 1, fs: 1, rel: 0, modestbranding: 1, iv_load_policy: 3, origin: location.origin },
          events: { onReady: onReady, onStateChange: onState, onError: function () { fail(); } }
        });
      } catch (err) { fail(); return; }
      nameFrame();
      waitT = setTimeout(function () { if (state === 'loading') fail(); }, READY_MS);
    }
    /* the API writes its own iframe with YouTube's own allow list and allowfullscreen (they only take effect when set
       before the iframe loads, so adding them here would do nothing): the page only names the frame for the film */
    function nameFrame() {
      var f = yt.querySelector('iframe');
      if (f) f.setAttribute('title', title + ' (YouTube video player)');
    }

    function onReady(e) {
      if (state !== 'loading') return;
      if (!ytP && e && e.target) ytP = e.target;
      clearTimeout(waitT);
      nameFrame();
      set('ready');
      /* with sound; a browser that still refuses autoplay gets YouTube's own play button, uncovered */
      try { ytP.unMute(); } catch (x) {}
      if (!d.hidden) { try { ytP.playVideo(); } catch (x) {} }
      revealT = setTimeout(reveal, REVEAL_MS);
    }
    function onState(e) {
      if (state === 'error' || !e) return;
      var S = (w.YT && w.YT.PlayerState) || { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3 };
      if (e.data === S.PLAYING) { reveal(); set('playing'); if (d.hidden) pauseYT(); else sound(); }
      else if (e.data === S.BUFFERING) reveal();
      else if (e.data === S.PAUSED) { reveal(); set('paused'); }
      else if (e.data === S.ENDED) { reveal(); set('ended'); }
    }

    /* the film is starting (or waits for a tap on YouTube's own button): nothing may sit over the player, so the
       poster, grade and control leave the frame (kept, in case YouTube refuses the film later), and the site-wide
       grain steps out while the player is up (html.yt-on, work.css) */
    function reveal() {
      clearTimeout(revealT); clearTimeout(waitT);
      if (shown || !ytP) return;
      shown = true;
      var had = d.activeElement === ytBtn;
      aside = Array.prototype.filter.call(yt.children, function (el) { return el.tagName !== 'IFRAME' && el.id !== 'pj-yt-player'; });
      aside.forEach(function (el) { yt.removeChild(el); });
      yt.classList.remove('is-loading');
      yt.classList.add('is-started');
      root.classList.add('yt-on');
      var f = yt.querySelector('iframe');
      if (f && had) { try { f.focus({ preventScroll: true }); } catch (x) {} }
    }

    /* YouTube said no (embedding off, unavailable) or never answered: no dead iframe, no YouTube error screen.
       The poster comes back with a note, and the control turns back into the plain link it is without JS */
    function fail() {
      if (state === 'error') return;
      clearTimeout(waitT); clearTimeout(revealT);
      var a = d.activeElement, had = a === ytBtn || (!!a && a.tagName === 'IFRAME' && yt.contains(a));
      if (ytP) { try { ytP.destroy(); } catch (x) {} ytP = null; }
      Array.prototype.slice.call(yt.querySelectorAll('iframe, #pj-yt-player')).forEach(function (el) { el.parentNode.removeChild(el); });
      aside.forEach(function (el) { yt.appendChild(el); });
      aside = []; shown = false;
      ytBtn.removeAttribute('role'); ytBtn.removeAttribute('aria-label');
      ytBtn.removeAttribute('data-yt'); ytBtn.removeAttribute('data-label');
      ytBtn.classList.remove('pj-play--full');
      ytBtn.classList.add('pj-yt-out');
      if (label) label.innerHTML = 'Watch on YouTube <b aria-hidden="true">↗</b>';
      if (note) ytBtn.appendChild(note);
      var msg = d.createElement('p');
      msg.className = 'pj-yt-msg mono'; msg.id = 'pj-yt-msg'; msg.setAttribute('role', 'status');
      msg.textContent = 'This film plays on YouTube';
      yt.insertBefore(msg, ytBtn);
      ytBtn.setAttribute('aria-describedby', 'pj-yt-msg');
      yt.classList.remove('is-loading');
      yt.classList.remove('is-started');
      yt.classList.add('is-external');
      root.classList.remove('yt-on');
      set('error');
      if (had) { try { ytBtn.focus({ preventScroll: true }); } catch (x) {} }
    }

    ytBtn.addEventListener('click', play);
    ytBtn.addEventListener('keydown', function (e) { if (e.key === ' ' && state !== 'error') { e.preventDefault(); ytBtn.click(); } });
    ytBtn.addEventListener('pointerdown', warm);
    ytBtn.addEventListener('focus', warm);
    /* warm the API once the page has loaded and the frame is near the viewport (not on Save-Data) */
    if (!JP.saveData && 'IntersectionObserver' in w) {
      var arm = function () {
        var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); warm(); } }, { rootMargin: '300px 0px' });
        io.observe(yt);
      };
      if (d.readyState === 'complete') arm(); else w.addEventListener('load', arm);
    }
  })();
  function pauseYT() { if (ytP && ytP.pauseVideo) { try { ytP.pauseVideo(); } catch (e) {} } }

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
