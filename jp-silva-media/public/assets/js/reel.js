/* FEATURED WORK reel — two engines, one UI.
   YouTube engine (JPSM.youtube): one YT.Player (nocookie), muted reel of segment-long excerpts; watch mode plays through.
   File engine (preview host / YouTube unavailable): two stacked <video>s for a true A/B crossfade, his films with sound.
   Content comes only from #reel-data. Test hooks: window.JPSM_REEL_TEST = { segment, blockMs, apiMs, errMs }. */
(function () {
  'use strict';
  var sec = document.getElementById('featured');
  var dataEl = document.getElementById('reel-data');
  if (!sec || !dataEl) return;
  var DATA;
  try { DATA = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var W = window, JPSM = W.JPSM || {}, JP = W.JP || {};
  var T = W.JPSM_REEL_TEST || {};
  var SEG = T.segment || DATA.segment || 28;
  var BLOCK_MS = T.blockMs || 3500, API_MS = T.apiMs || 6000, ERR_MS = T.errMs || 4000;
  var reduced = !!(JP.reduced || (W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches));
  var saveData = !!JP.saveData;
  var noAuto = reduced || saveData;
  var OWNER = 'reel';

  function $(id) { return document.getElementById(id); }
  var reel = $('rl'), screen = $('rl-screen'), img = $('rl-img'), vids = $('rl-vids'), ytWrap = $('rl-yt'),
    gate = $('rl-gate'), err = $('rl-err'), errYt = $('rl-err-yt'), errNext = $('rl-err-next'),
    pipsEl = $('rl-pips'), prog = $('rl-prog'), cap = $('rl-cap'), tEl = $('rl-title'), mEl = $('rl-meta'), sEl = $('rl-sub'),
    proj = $('rl-proj'), projT = $('rl-proj-t'), nEl = $('rl-n'), ofEl = $('rl-of'), prev = $('rl-prev'), next = $('rl-next'),
    pp = $('rl-pp'), snd = $('rl-snd'), live = $('rl-live'), tc = $('rl-tc'), bign = sec.querySelector('.rl-bign'),
    bigOf = sec.querySelector('.rl-big span'), totalEl = sec.querySelector('.rl-total'), modeEl = sec.querySelector('.rl-mode'),
    sndK = sec.querySelector('.rl-snd-k');

  var S = {
    engine: DATA.engine === 'youtube' && JPSM.youtube && DATA.youtube.length ? 'youtube' : 'file',
    list: null, i: 0, mode: noAuto ? 'watch' : 'reel', muted: true, playing: false,
    userPaused: false, autoPaused: false, started: false, visible: false, near: false,
    segStart: 0, cur: 0, dur: 0
  };
  S.list = S.engine === 'youtube' ? DATA.youtube : DATA.files;
  if (!S.list.length) return;
  sec.classList.add('is-' + S.engine);

  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function tcode(t) { t = Math.max(0, t || 0); var s = Math.floor(t), f = Math.floor((t - s) * 24); return '00:' + pad(Math.floor(s / 60)) + ':' + pad(s % 60) + ':' + pad(f); }
  function film() { return S.list[S.i]; }
  function startOf(f, dur) { if (f.start != null) return f.start; var d = dur || f.duration; return d ? Math.floor(d * 0.15) : 0; }

  /* ---------------- UI ---------------- */
  function buildPips() {
    pipsEl.innerHTML = S.list.map(function (f, i) {
      return '<li><button type="button" class="rl-pip" data-i="' + i + '" aria-label="' + esc(f.display) + '"><i aria-hidden="true"></i></button></li>';
    }).join('');
    ofEl.textContent = pad(S.list.length);
    if (bigOf) bigOf.textContent = '/ ' + pad(S.list.length);
    if (totalEl) totalEl.textContent = pad(S.list.length) + ' films';
    reel.style.setProperty('--rl-n', S.list.length);
  }
  function setProgress(p) {
    p = Math.max(0, Math.min(1, p || 0));
    reel.style.setProperty('--rl-p', p.toFixed(4));
    prog.setAttribute('aria-valuenow', Math.round(p * 100));
  }
  function setMode(m) {
    S.mode = m;
    sec.setAttribute('data-mode', m);
    if (modeEl) modeEl.textContent = m === 'reel' ? 'Reel · ' + SEG + ' s cuts' : 'Full film';
    prog.setAttribute('aria-label', m === 'reel' ? 'Progress of this excerpt' : 'Progress of the film');
  }
  function setPlaying(on) {
    S.playing = on;
    sec.classList.toggle('is-playing', on);
    pp.setAttribute('aria-label', on ? 'Pause' : 'Play');
    // started while scrolled away (it boots ~800px early): hold it until the frame is on screen
    if (on && E && !S.visible && S.mode === 'reel' && !document.hidden) { S.autoPaused = true; E.pause(); }
    else if (on && E && document.hidden) { S.autoPaused = true; E.pause(); }
  }
  function setMutedUI() {
    snd.setAttribute('aria-pressed', S.muted ? 'false' : 'true');
    snd.querySelector('span').textContent = S.muted ? 'Sound off' : 'Sound on';
    if (sndK) sndK.textContent = S.muted ? 'Sound off' : 'Sound on';
  }
  function caption(f, instant) {
    var meta = [f.artist, f.type].filter(Boolean).map(esc).join('<b aria-hidden="true">·</b>');
    var sub = [f.credit, f.duration ? tcode(f.duration).slice(3, 8) : null].filter(Boolean).join(' · ');
    function swap() {
      tEl.textContent = f.display; mEl.innerHTML = meta; sEl.textContent = sub;
      proj.href = f.href; projT.textContent = ' ' + f.display;
    }
    if (instant || reduced) { swap(); return; }
    cap.classList.add('is-out');
    clearTimeout(caption.t);
    caption.t = setTimeout(function () {
      swap();
      cap.classList.add('is-cut'); cap.classList.remove('is-out');
      // start below the mask, then rise
      var spans = cap.querySelectorAll('.rl-l>span');
      Array.prototype.forEach.call(spans, function (s) { s.style.transform = 'translateY(105%)'; });
      void cap.offsetWidth;
      cap.classList.remove('is-cut');
      Array.prototype.forEach.call(spans, function (s, k) { s.style.transitionDelay = (k * 0.06) + 's'; s.style.transform = ''; });
    }, 300);
  }
  function setPoster(f) {
    var src = f.posterSmall && W.innerWidth < 700 ? f.posterSmall : f.poster;
    img.removeAttribute('srcset');
    img.classList.toggle('is-contain', S.engine === 'file');
    img.alt = f.alt || '';
    if (img.getAttribute('src') !== src) img.src = src;
    img.width = f.posterW; img.height = f.posterH;
  }
  function index(i, instant) {
    var f = S.list[i];
    S.i = i;
    nEl.textContent = pad(i + 1);
    if (bign) bign.textContent = pad(i + 1);
    reel.style.setProperty('--rl-i', i);
    Array.prototype.forEach.call(pipsEl.querySelectorAll('.rl-pip'), function (b, k) {
      if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      b.classList.toggle('is-seen', k < i);
    });
    caption(f, instant);
    setPoster(f);
    screen.classList.toggle('is-portrait', !!f.portrait);
    setProgress(0);
    if (tc) tc.textContent = tcode(0);
    hideErr();
    if (!instant) live.textContent = 'Now playing: ' + f.display;
  }
  function showGate(label) {
    gate.querySelector('span').textContent = label || 'Play film';
    gate.hidden = false;
  }
  function hideGate() { gate.hidden = true; }
  function hideErr() { err.hidden = true; clearTimeout(S.errT); }

  /* ---------------- engine-agnostic actions ---------------- */
  var E = null; // current engine
  function go(i, how) {
    var n = S.list.length;
    i = (i + n) % n;
    if (how === 'pick') { setMode('watch'); S.userPaused = false; }
    index(i, false);
    if (E) E.load(i, how);
  }
  function nextFilm(how) { go(S.i + 1, how); }
  function prevFilm(how) { go(S.i - 1, how); }
  function advance() { // natural end of a segment or a film
    if (reduced) { setPlaying(false); return; }
    nextFilm('auto');
  }
  function togglePlay() {
    if (!E) { boot(true); return; }
    if (S.playing) { S.userPaused = true; S.autoPaused = false; E.pause(); }
    else {
      if (S.userPaused || S.started) setMode('watch');
      S.userPaused = false; E.play(true);
    }
  }
  function toggleSound() {
    S.muted = !S.muted;
    setMutedUI();
    if (!S.muted) {
      setMode('watch');
      try { W.dispatchEvent(new CustomEvent('jpsm:sound', { detail: { owner: OWNER } })); } catch (e) {}
    }
    if (!E) { boot(true); return; }
    E.sound();
    if (!S.muted && !S.playing) { S.userPaused = false; E.play(true); }
  }

  /* ---------------- File engine (A/B crossfade) ---------------- */
  function FileEngine() {
    var A = mk(), B = mk(), cur = A, other = B, loaded = { a: -1, b: -1 }, pending = null, blockT = 0;
    function mk() {
      var v = document.createElement('video');
      v.muted = true; v.defaultMuted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
      v.preload = 'metadata'; v.setAttribute('aria-hidden', 'true'); v.tabIndex = -1;
      vids.appendChild(v);
      v.addEventListener('timeupdate', function () { if (v === cur) tick(); });
      v.addEventListener('ended', function () { if (v === cur && S.started) advance(); });
      v.addEventListener('playing', function () { if (v === cur) { clearTimeout(blockT); hideGate(); setPlaying(true); S.started = true; } });
      v.addEventListener('pause', function () { if (v === cur) setPlaying(false); });
      return v;
    }
    function key(v) { return v === A ? 'a' : 'b'; }
    function src(v, i) {
      if (loaded[key(v)] === i) return;
      loaded[key(v)] = i;
      var f = S.list[i];
      v.innerHTML = '<source src="' + f.files.webm + '" type="video/webm"><source src="' + f.files.mp4 + '" type="video/mp4">';
      v.poster = f.poster;
      v.load();
    }
    function seekStart(v, i) {
      var f = S.list[i], st = S.mode === 'reel' ? startOf(f, v.duration) : 0;
      function doit() { try { v.currentTime = st; } catch (e) {} S.segStart = st; }
      if (v.readyState >= 1) doit(); else v.addEventListener('loadedmetadata', doit, { once: true });
      S.segStart = st;
    }
    function tryPlay(v, user) {
      v.muted = S.muted;
      var p = v.play();
      clearTimeout(blockT);
      blockT = setTimeout(function () { if (v === cur && v.paused && !S.userPaused) blocked(); }, BLOCK_MS);
      if (p && p.catch) p.catch(function () { if (v === cur && !S.userPaused) blocked(); });
    }
    function blocked() { setPlaying(false); showGate('Play film'); sec.classList.add('is-blocked'); }
    function preloadNext() { src(other, (S.i + 1) % S.list.length); }
    return {
      kind: 'file',
      start: function (autoplay) {
        src(cur, S.i); seekStart(cur, S.i); cur.classList.add('is-on');
        if (autoplay) tryPlay(cur); else showGate('Play film');
        setTimeout(preloadNext, 1200);
      },
      load: function (i, how) {
        hideGate();
        var from = cur, to = other;
        to.muted = S.muted;
        src(to, i); seekStart(to, i);
        cur = to; other = from;
        var swap = function () {
          cur.classList.add('is-on'); other.classList.remove('is-on');
          setTimeout(function () { if (other !== cur) { other.pause(); preloadNext(); } }, reduced ? 0 : 950);
        };
        if (reduced && how !== 'pick') { swap(); setPlaying(false); showGate('Play film'); return; }
        cur.addEventListener('playing', swap, { once: true });
        tryPlay(cur);
        if (!cur.paused && cur.readyState > 2) swap();
      },
      play: function () { hideGate(); sec.classList.remove('is-blocked'); tryPlay(cur, true); },
      pause: function () { clearTimeout(blockT); cur.pause(); },
      sound: function () { cur.muted = S.muted; other.muted = true; },
      time: function () { return cur.currentTime || 0; },
      duration: function () { return cur.duration || film().duration || 0; },
      els: function () { return [A, B]; }
    };
  }

  /* ---------------- YouTube engine ---------------- */
  var BAD = { 2: 1, 5: 1, 100: 1, 101: 1, 150: 1 };
  function YouTubeEngine() {
    var P = null, ready = false, blockT = 0, revealT = 0, pendingSeek = false, loadingI = -1, retryT = 0, wantPlay = false;
    function reveal(on) { ytWrap.classList.toggle('is-on', !!on); }
    function armBlock() {
      clearTimeout(blockT);
      blockT = setTimeout(function () {
        if (!S.playing && !S.userPaused) { setPlaying(false); reveal(false); showGate('Play film'); sec.classList.add('is-blocked'); }
      }, BLOCK_MS);
    }
    function onState(e) {
      var st = e.data, Y = W.YT && W.YT.PlayerState || { ENDED: 0, PLAYING: 1, PAUSED: 2 };
      if (st === Y.PLAYING) {
        clearTimeout(blockT); clearTimeout(retryT);
        hideGate(); sec.classList.remove('is-blocked');
        S.started = true; setPlaying(true);
        if (pendingSeek) {
          pendingSeek = false;
          var d = P.getDuration ? P.getDuration() : 0, st0 = S.mode === 'reel' ? startOf(film(), d) : 0;
          if (st0 > 0) { P.seekTo(st0, true); S.segStart = st0; clearTimeout(revealT); revealT = setTimeout(function () { reveal(true); }, 350); return; }
          S.segStart = 0;
        }
        clearTimeout(revealT); reveal(true);
      } else if (st === Y.PAUSED) {
        setPlaying(false);
      } else if (st === Y.ENDED) {
        setPlaying(false);
        advance();
      }
    }
    function onError(e) {
      var f = film();
      if (!BAD[e.data]) return;
      clearTimeout(blockT);
      f.bad = true; setPlaying(false); reveal(false); hideGate();
      errYt.href = f.youtubeUrl;
      errYt.setAttribute('aria-label', 'Watch ' + f.display + ' on YouTube (opens in a new tab)');
      err.hidden = false;
      live.textContent = f.display + ' plays on YouTube only.';
      if (S.mode === 'reel' && !reduced) S.errT = setTimeout(function () { nextFilm('auto'); }, ERR_MS);
    }
    function create(autoplay) {
      var f = film();
      wantPlay = autoplay;
      P = new W.YT.Player('rl-yt-host', {
        host: 'https://www.youtube-nocookie.com',
        videoId: f.youtubeId,
        width: '100%', height: '100%',
        playerVars: { autoplay: autoplay ? 1 : 0, mute: 1, playsinline: 1, controls: 0, rel: 0, iv_load_policy: 3, disablekb: 1, fs: 0,
          modestbranding: 1, origin: location.origin, start: f.start != null ? f.start : 0 },
        events: {
          onReady: function () {
            ready = true;
            try { P.mute(); } catch (e) {}
            if (!S.muted) { try { P.unMute(); } catch (e) {} }
            if (wantPlay) { pendingSeek = f.start == null; try { P.playVideo(); } catch (e) {} armBlock(); }
            else showGate('Play film');
          },
          onStateChange: onState,
          onError: onError
        }
      });
    }
    return {
      kind: 'youtube',
      player: function () { return P; },
      start: function (autoplay) { loadingI = S.i; create(autoplay); },
      load: function (i, how) {
        if (!P || !ready) return;
        hideGate(); clearTimeout(blockT); clearTimeout(revealT);
        var f = S.list[i];
        reveal(false);
        if (reduced && how !== 'pick') { try { P.pauseVideo(); } catch (e) {} setPlaying(false); showGate('Play film'); return; }
        var go = function () {
          if (S.i !== i) return;
          pendingSeek = S.mode === 'reel' && f.start == null;
          var st0 = S.mode === 'reel' && f.start != null ? f.start : 0;
          S.segStart = st0;
          try { P.loadVideoById({ videoId: f.youtubeId, startSeconds: st0 }); } catch (e) {}
          if (S.muted) { try { P.mute(); } catch (e) {} } else { try { P.unMute(); } catch (e) {} }
          armBlock();
        };
        if (reduced) go(); else setTimeout(go, 450);
      },
      play: function (user) {
        if (!P || !ready) return;
        hideGate(); sec.classList.remove('is-blocked');
        try { P.playVideo(); } catch (e) {}
        clearTimeout(retryT);
        // a tap that still does not start playback: reveal YouTube's own surface so the visitor can tap it
        if (user) retryT = setTimeout(function () { if (!S.playing) { reveal(true); hideGate(); sec.classList.add('is-revealed'); } }, 2500);
      },
      pause: function () { clearTimeout(blockT); if (P && ready) { try { P.pauseVideo(); } catch (e) {} } },
      sound: function () { if (!P || !ready) return; try { if (S.muted) P.mute(); else P.unMute(); } catch (e) {} },
      time: function () { try { return P && ready ? P.getCurrentTime() || 0 : 0; } catch (e) { return 0; } },
      duration: function () { try { return P && ready ? P.getDuration() || 0 : 0; } catch (e) { return 0; } }
    };
  }

  /* ---------------- clock: progress, timecode, segment cutting ---------------- */
  function tick() {
    if (!E) return;
    var t = E.time(), d = E.duration();
    if (tc) tc.textContent = tcode(t);
    if (S.mode === 'reel') {
      var el = t - S.segStart;
      var len = d ? Math.min(SEG, Math.max(1, d - S.segStart)) : SEG;
      setProgress(el / len);
      if (S.playing && el >= SEG && !reduced) { S.segStart = Infinity; advance(); }
    } else setProgress(d ? t / d : 0);
  }
  setInterval(function () { if (S.playing) tick(); }, 200);

  /* ---------------- boot ---------------- */
  function useFiles() {
    if (E && E.kind === 'file') return;
    S.engine = 'file'; S.list = DATA.files; S.i = 0;
    sec.classList.remove('is-youtube'); sec.classList.add('is-file');
    ytWrap.classList.remove('is-on');
    buildPips(); index(0, true); setPoster(film());
    E = FileEngine();
    E.start(!noAuto || S.wantAfterBoot);
  }
  var apiT = 0;
  function loadYT(autoplay) {
    if (W.YT && W.YT.Player) { E = YouTubeEngine(); E.start(autoplay); return; }
    var prevCb = W.onYouTubeIframeAPIReady;
    W.onYouTubeIframeAPIReady = function () {
      if (prevCb) try { prevCb(); } catch (e) {}
      clearTimeout(apiT);
      if (E) return;
      E = YouTubeEngine(); E.start(autoplay);
    };
    var s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    s.onerror = function () { clearTimeout(apiT); if (!E) useFiles(); };
    document.head.appendChild(s);
    apiT = setTimeout(function () { if (!E && !(W.YT && W.YT.Player)) { useFiles(); } else if (!E && W.YT && W.YT.Player) { E = YouTubeEngine(); E.start(autoplay); } }, API_MS);
  }
  var booted = false;
  function boot(user) {
    if (booted) { if (user && E) E.play(true); return; }
    booted = true;
    var auto = user || !noAuto;
    S.wantAfterBoot = user;
    if (user) { setMode('watch'); }
    if (S.engine === 'youtube') loadYT(auto); else { E = FileEngine(); E.start(auto); }
  }

  /* ---------------- wiring ---------------- */
  buildPips(); index(0, true); setMode(S.mode); setMutedUI();
  if (noAuto) showGate('Play film');

  pipsEl.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.rl-pip') : null; if (!b) return;
    var i = +b.getAttribute('data-i'); if (!booted) { index(i, false); boot(true); return; }
    go(i, 'pick');
  });
  prev.addEventListener('click', function () { if (!booted) { index((S.i - 1 + S.list.length) % S.list.length, false); setPoster(film()); return; } prevFilm('pick'); });
  next.addEventListener('click', function () { if (!booted) { index((S.i + 1) % S.list.length, false); setPoster(film()); return; } nextFilm('pick'); });
  pp.addEventListener('click', togglePlay);
  snd.addEventListener('click', toggleSound);
  gate.addEventListener('click', function () { if (!booted) { boot(true); return; } S.userPaused = false; if (S.started) setMode('watch'); E.play(true); });
  errNext.addEventListener('click', function () { nextFilm('pick'); });

  reel.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = (e.target.tagName || '').toLowerCase();
    var k = e.key;
    if (k === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    else if (k === 'ArrowRight') { e.preventDefault(); next.click(); }
    else if (k === 'k' || k === 'K' || (k === ' ' && tag !== 'button' && tag !== 'a')) { e.preventDefault(); togglePlay(); }
    else if (k === 'm' || k === 'M') { e.preventDefault(); toggleSound(); }
  });

  // swipe on caption/controls and on the file engine's picture; vertical scroll stays native (touch-action: pan-y)
  function swipe(el) {
    var x0 = 0, y0 = 0, on = false;
    el.addEventListener('touchstart', function (e) { var t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; on = true; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (!on) return; on = false;
      var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) { (dx < 0 ? next : prev).click(); }
    }, { passive: true });
  }
  swipe(cap); swipe($('rl-ctl')); swipe(vids); swipe(img.parentNode);

  // only one audible source on the page
  W.addEventListener('jpsm:sound', function (e) {
    var o = e.detail && e.detail.owner;
    if (o && o !== OWNER && !S.muted) {
      S.muted = true; setMutedUI(); if (E) { E.sound(); if (S.playing) { S.userPaused = true; E.pause(); } }
    }
  });

  // lazy start near the viewport; pause when < 25 % visible (resume in reel mode only)
  if ('IntersectionObserver' in W) {
    new IntersectionObserver(function (en) {
      if (en[0].isIntersecting && !booted && !noAuto) boot(false);
    }, { rootMargin: '800px 0px' }).observe(sec);
    new IntersectionObserver(function (en) {
      var r = en[0].intersectionRatio;
      S.visible = r >= 0.25;
      if (!E) return;
      if (!S.visible && S.playing) { S.autoPaused = true; E.pause(); }
      else if (S.visible && S.autoPaused && !S.userPaused && !document.hidden) { S.autoPaused = false; if (S.mode === 'reel') E.play(false); }
    }, { threshold: [0, 0.25, 0.5] }).observe(screen);
  } else if (!noAuto) boot(false);
  document.addEventListener('visibilitychange', function () {
    if (!E) return;
    if (document.hidden) { if (S.playing) { S.autoPaused = true; E.pause(); } }
    else if (S.autoPaused && S.visible && !S.userPaused && S.mode === 'reel') { S.autoPaused = false; E.play(false); }
  });

  W.JPSM_REEL = { state: S, engine: function () { return E && E.kind; }, player: function () { return E && E.player ? E.player() : null } };
})();
