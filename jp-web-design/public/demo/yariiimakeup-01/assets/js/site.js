/* YariiiMakeup · design concept 01
   No dependencies. Every feature below enhances markup that already works
   without it: the gallery tiles are real links to the full photographs, the
   booking buttons are plain links to Booksy, and nothing is hidden until
   this file has actually started running. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ── The hero film: plays quietly, pauses off screen, and can be stopped ── */
  var heroFilm = $('#hero-film');
  var filmToggle = $('.film-toggle');
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var filmWanted = !reduce && !saveData;
  var filmOnScreen = true;
  function syncFilm() {
    if (!heroFilm) return;
    if (filmWanted && !heroFilm.getAttribute('src')) heroFilm.src = heroFilm.getAttribute('data-src');
    if (filmWanted && filmOnScreen) { var pr = heroFilm.play(); if (pr && pr.catch) pr.catch(function () {}); }
    else heroFilm.pause();
    if (filmToggle) {
      filmToggle.setAttribute('aria-pressed', String(!filmWanted));
      filmToggle.setAttribute('aria-label', filmWanted ? 'Pause the film' : 'Play the film');
    }
  }
  if (filmToggle) filmToggle.addEventListener('click', function () { filmWanted = !filmWanted; syncFilm(); });
  if (heroFilm && hasIO) {
    new IntersectionObserver(function (e) { filmOnScreen = e[0].isIntersecting; syncFilm(); }, { threshold: 0.05 }).observe(heroFilm);
  }

  /* ── The opening: film, then her logo, then the logo's wordmark flies up
        into the header. Driven by the film itself, with a fallback at every
        step: a film that will not play goes straight to the logo, and any
        tap, key or scroll ends the opening at once. ── */
  var curtain = $('#curtain');
  var skipBtn = $('#intro-skip');
  function endIntro() {
    root.classList.remove('intro', 'intro-film', 'intro-logo', 'intro-out', 'intro-fast');
    if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
    if (skipBtn && skipBtn.parentNode) skipBtn.parentNode.removeChild(skipBtn);
    setTimeout(function () { root.classList.remove('hero-in'); }, 2600);
    syncFilm();
  }
  if (root.classList.contains('intro') && curtain) {
    window.__yariiIntro = true;
    (function () {
      var film = $('#intro-film');
      var line = $('#intro-bar');
      var logo = $('#intro-logo');
      var state = 0; /* 0 waiting · 1 film · 2 logo · 3 handoff */
      var timers = [];
      var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
      /* where the wordmark sits inside the logo, as fractions of its box */
      var WM = { x: 0.03083, y: 0.55, w: 0.93 - 0.03083 };

      var handoff = function (fast) {
        if (state === 3) return;
        state = 3;
        timers.forEach(clearTimeout);
        try { film.pause(); } catch (e) {}
        var to = $('.bar .brand img').getBoundingClientRect();
        var from = logo.getBoundingClientRect();
        var k = to.width / (from.width * WM.w);
        logo.style.setProperty('--fs', k);
        logo.style.setProperty('--fx', (to.left - from.left - from.width * WM.x * k) + 'px');
        logo.style.setProperty('--fy', (to.top - from.top - from.height * WM.y * k) + 'px');
        if (fast) root.classList.add('intro-fast');
        root.classList.add('intro-out', 'hero-in');
        root.classList.remove('intro-film', 'intro-logo');
        setTimeout(endIntro, fast ? 540 : 900);
      };
      var showLogo = function () {
        if (state >= 2) return;
        state = 2;
        root.classList.add('intro-logo');
        root.classList.remove('intro-film');
        later(function () { handoff(false); }, 1900);
      };
      var skip = function () { handoff(true); };
      var skipClick = function (e) {
        if (e.target.closest && e.target.closest('a')) return; /* Book Now is a booking, not a skip */
        handoff(true);
      };

      film.addEventListener('playing', function () {
        if (state !== 0) return;
        state = 1;
        root.classList.add('intro-film');
      });
      film.addEventListener('timeupdate', function () {
        if (!film.duration) return;
        line.style.transform = 'scaleX(' + Math.min(1, film.currentTime / film.duration) + ')';
        if (film.currentTime >= film.duration - 0.16) showLogo();
      });
      film.addEventListener('ended', showLogo);
      film.addEventListener('error', showLogo);
      var pr = film.play();
      if (pr && pr.catch) pr.catch(showLogo);
      later(function () { if (state === 0) showLogo(); }, 1500);   /* the film never started */
      later(showLogo, 6500);                                       /* the film stalled */

      skipBtn.addEventListener('click', skip);
      curtain.addEventListener('click', skip);
      var head = $('.bar');
      head.addEventListener('click', function barSkip(e) {
        head.removeEventListener('click', barSkip);
        if (state !== 3 && root.classList.contains('intro')) skipClick(e);
      });
      ['wheel', 'touchmove', 'keydown'].forEach(function (t) {
        window.addEventListener(t, function once(e) {
          if (t === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
          window.removeEventListener(t, once);
          if (state !== 3) skip();
        }, { passive: true });
      });
    })();
  } else {
    syncFilm();
  }

  /* ── Header ── */
  var bar = $('.bar');
  var stuck = false;
  function onScroll() {
    var s = window.scrollY > 24;
    if (s !== stuck) { stuck = s; bar.classList.toggle('is-stuck', s); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Tone dots: lip, lid and glow, sampled from each photograph ── */
  $$('.look').forEach(function (li) {
    var tones = (li.getAttribute('data-tones') || '').split(',');
    var c = $('.look-c', li);
    if (tones.length !== 3 || !c) return;
    var wrap = doc.createElement('span');
    wrap.className = 'tones';
    wrap.setAttribute('aria-hidden', 'true');
    tones.forEach(function (t) {
      var i = doc.createElement('i');
      i.style.background = t;
      wrap.appendChild(i);
    });
    c.insertBefore(wrap, c.firstChild);
  });

  /* ── Scroll reveals ── */
  if (hasIO && !reduce) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        revealIO.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    var looks0 = $$('.look');
    looks0.forEach(function (el, i) { el.style.setProperty('--rv-d', (i % 3) * 0.09 + 's'); });
    $$('[data-rv], .look, .svc').forEach(function (el) { revealIO.observe(el); });
    root.classList.add('rv-on');
  } else {
    root.classList.add('rv-on');
    $$('[data-rv], .look, .svc').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ── Mobile menu ── */
  var menuBtn = $('.menu-btn');
  var menu = $('#menu');
  var outside = $$('main, .foot, .concept, .dock');
  function setMenu(open) {
    if (open) {
      menu.hidden = false;
      void menu.offsetWidth;
    }
    menu.classList.toggle('is-open', open);
    root.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    outside.forEach(function (el) { if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
    if (open) {
      var first = $('a', menu);
      if (first) first.focus({ preventScroll: true });
    } else {
      setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduce ? 0 : 420);
    }
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuBtn.focus();
    }
  });
  /* keep Tab inside header + menu while it is open */
  menu.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = $$('a, button', menu);
    if (!e.shiftKey && doc.activeElement === f[f.length - 1]) { e.preventDefault(); $('.brand', bar).focus(); }
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) {
    if (m.matches && menuBtn.getAttribute('aria-expanded') === 'true') setMenu(false);
  });

  /* ── Portfolio filter ── */
  var looksEl = $('#looks');
  var allLooks = $$('.look', looksEl);
  var chips = $$('.chip');
  var status = $('#work-status');
  var swapT;
  function applyFilter(key, label) {
    var n = 0;
    allLooks.forEach(function (li) {
      var on = key === 'all' || (' ' + li.getAttribute('data-cats') + ' ').indexOf(' ' + key + ' ') > -1;
      li.hidden = !on;
      if (on) { n++; li.classList.add('is-in'); li.style.setProperty('--rv-d', '0s'); }
    });
    looksEl.setAttribute('data-count', n);
    if (status) status.textContent = 'Showing ' + n + (n === 1 ? ' look' : ' looks') + (key === 'all' ? '' : ' in ' + label) + '.';
  }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (chip.classList.contains('is-on')) return;
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', String(on));
      });
      var key = chip.getAttribute('data-filter');
      var label = chip.firstChild.textContent.trim();
      clearTimeout(swapT);
      if (reduce) { applyFilter(key, label); return; }
      looksEl.classList.add('is-swapping');
      swapT = setTimeout(function () {
        applyFilter(key, label);
        looksEl.classList.remove('is-swapping');
      }, 280);
    });
  });
  looksEl.setAttribute('data-count', allLooks.length);

  /* ── Lightbox ── */
  var lb = $('#lb');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = $('#lb-img');
    var lbStage = $('#lb-stage');
    var lbTitle = $('#lb-title');
    var lbI = $('#lb-i');
    var lbN = $('#lb-n');
    var lbDots = $$('#lb-dots i');
    var items = [];
    var idx = 0;
    var opener = null;
    var seq = 0;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };

    var collect = function () {
      items = allLooks.filter(function (li) { return !li.hidden; }).map(function (li) {
        var a = $('a', li);
        return {
          a: a,
          href: a.getAttribute('href'),
          w: +a.getAttribute('data-w'),
          h: +a.getAttribute('data-h'),
          alt: $('img', li).getAttribute('alt'),
          title: $('.look-t', li).textContent,
          tones: (li.getAttribute('data-tones') || '').split(',')
        };
      });
    };

    var paint = function (it, dir) {
      lbImg.classList.add('is-drag');
      lbImg.style.transform = dir ? 'translateX(' + dir * 22 + 'px)' : 'scale(.985)';
      lbImg.src = it.href;
      lbImg.alt = it.alt;
      lbImg.width = it.w;
      lbImg.height = it.h;
      void lbImg.offsetWidth;
      lbImg.classList.remove('is-drag');
      lbImg.classList.remove('is-out');
      lbImg.style.transform = '';
    };

    var show = function (i, dir) {
      idx = (i + items.length) % items.length;
      var it = items[idx];
      var my = ++seq;
      lbTitle.textContent = it.title;
      lbI.textContent = pad(idx + 1);
      lbN.textContent = pad(items.length);
      lbDots.forEach(function (d, k) { d.style.background = it.tones[k] || 'transparent'; });
      var pre = new Image();
      var done = false;
      var go = function () {
        if (done || my !== seq) return;
        done = true;
        paint(it, dir);
      };
      pre.onload = go;
      pre.onerror = go;
      if (dir && !reduce) {
        lbImg.classList.add('is-out');
        lbImg.style.transform = 'translateX(' + -dir * 22 + 'px)';
        setTimeout(function () { pre.src = it.href; if (pre.complete) go(); }, 190);
      } else {
        pre.src = it.href;
        if (pre.complete) go();
      }
      /* warm the neighbours so the next swipe is instant */
      [1, -1].forEach(function (d) {
        var nb = items[(idx + d + items.length) % items.length];
        if (nb && nb !== it) { var w = new Image(); w.src = nb.href; }
      });
    };

    looksEl.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-look]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault();
      collect();
      opener = a;
      lbImg.removeAttribute('src');
      lbImg.classList.add('is-out');
      lb.showModal();
      show(Math.max(0, items.findIndex(function (it) { return it.a === a; })), 0);
    });

    /* A browser can swallow the click of a tap that lands just after a swipe.
       On touch, act on the finger lifting instead, and ignore the click that
       usually follows. Mouse and keyboard still use the click. */
    var press = function (el, fn) {
      var touched = 0;
      el.addEventListener('pointerup', function (e) {
        if (e.pointerType !== 'touch') return;
        touched = Date.now();
        fn();
      });
      el.addEventListener('click', function () {
        if (Date.now() - touched > 700) fn();
      });
    };
    press($('[data-lb-close]', lb), function () { lb.close(); });
    press($('[data-lb-prev]', lb), function () { show(idx - 1, -1); });
    press($('[data-lb-next]', lb), function () { show(idx + 1, 1); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1, -1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1, 1); }
    });
    lb.addEventListener('close', function () {
      if (opener) opener.focus({ preventScroll: true });
    });
    lbStage.addEventListener('click', function (e) {
      if (e.target === lbStage && !moved) lb.close();
    });

    /* swipe */
    var x0 = null, y0 = 0, dx = 0, moved = false, pid = null;
    lbStage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('button')) return;
      x0 = e.clientX; y0 = e.clientY; dx = 0; moved = false; pid = e.pointerId;
    });
    lbStage.addEventListener('pointermove', function (e) {
      if (x0 === null || e.pointerId !== pid) return;
      dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - y0)) {
        moved = true;
        try { lbStage.setPointerCapture(pid); } catch (err) {}
      }
      if (moved) {
        lbImg.classList.add('is-drag');
        lbImg.style.transform = 'translateX(' + dx + 'px)';
      }
    });
    var endSwipe = function (e) {
      if (x0 === null || (e && e.pointerId !== pid)) return;
      x0 = null;
      lbImg.classList.remove('is-drag');
      if (moved && Math.abs(dx) > 56) show(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      else lbImg.style.transform = '';
      setTimeout(function () { moved = false; }, 0);
    };
    lbStage.addEventListener('pointerup', endSwipe);
    lbStage.addEventListener('pointercancel', endSwipe);
  }

  /* ── Services: the photograph follows the row you are reading ── */
  var rows = $$('.svc');
  var svcImgs = $$('[data-svc-img]');
  var shown = $('#svc-shown');
  var activeSvc = 'bridal';
  var wasT;
  function setSvc(key) {
    if (key === activeSvc) return;
    var prev = activeSvc;
    activeSvc = key;
    rows.forEach(function (r) {
      var on = r.getAttribute('data-svc') === key;
      r.classList.toggle('is-on', on);
      if (on && shown) shown.textContent = r.getAttribute('data-shown');
    });
    clearTimeout(wasT);
    svcImgs.forEach(function (im) {
      var k = im.getAttribute('data-svc-img');
      im.classList.toggle('was-on', k === prev);
      im.classList.toggle('is-on', k === key);
    });
    wasT = setTimeout(function () {
      svcImgs.forEach(function (im) { im.classList.remove('was-on'); });
    }, 950);
  }
  var wide = window.matchMedia('(min-width: 900px)');
  var hoverLock = 0;
  rows.forEach(function (r) {
    var key = r.getAttribute('data-svc');
    r.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse' && wide.matches) { hoverLock = Date.now(); setSvc(key); }
    });
    r.addEventListener('focusin', function () { if (wide.matches) setSvc(key); });
  });
  if (hasIO) {
    var svcIO = new IntersectionObserver(function (entries) {
      if (!wide.matches || Date.now() - hoverLock < 600) return;
      entries.forEach(function (e) {
        if (e.isIntersecting) setSvc(e.target.getAttribute('data-svc'));
      });
    }, { rootMargin: '-46% 0px -46% 0px' });
    rows.forEach(function (r) { svcIO.observe(r); });
  }

  /* ── The Reel: Instagram's own embed, loaded only when asked for ── */
  var reel = $('.reel');
  if (reel) {
    var url = reel.getAttribute('data-reel');
    var holder = $('.reel-embed', reel);
    var failT;
    var fail = function () {
      if (reel.getAttribute('data-state') === 'ready') return;
      clearTimeout(failT);
      holder.innerHTML = '';
      reel.setAttribute('data-state', 'failed');
    };
    var ready = function () {
      clearTimeout(failT);
      reel.setAttribute('data-state', 'ready');
    };
    $('.reel-play', reel).addEventListener('click', function () {
      if (reel.getAttribute('data-state') !== 'idle') return;
      reel.setAttribute('data-state', 'loading');
      failT = setTimeout(fail, 9000);

      var bq = doc.createElement('blockquote');
      bq.className = 'instagram-media';
      bq.setAttribute('data-instgrm-permalink', url);
      bq.setAttribute('data-instgrm-version', '14');
      var a = doc.createElement('a');
      a.href = url;
      a.textContent = 'Watch this Reel on Instagram';
      bq.appendChild(a);
      holder.appendChild(bq);

      /* Instagram's script swaps the blockquote for its player iframe. */
      if ('MutationObserver' in window) {
        var mo = new MutationObserver(function () {
          var f = $('iframe', holder);
          if (!f) return;
          mo.disconnect();
          f.setAttribute('title', 'Orlando Fashion Kids Reel by @yariiimakeup, on Instagram');
          f.addEventListener('load', ready);
          f.addEventListener('error', fail);
        });
        mo.observe(holder, { childList: true, subtree: true });
      }

      var s = doc.createElement('script');
      s.src = 'https://www.instagram.com/embed.js';
      s.async = true;
      s.onerror = fail;
      s.onload = function () {
        try { window.instgrm.Embeds.process(); } catch (err) { fail(); }
      };
      doc.body.appendChild(s);
    });
  }

  /* ── Sticky booking dock (phones): up once the hero button has scrolled
        away, down again when the final booking section is on screen ── */
  var dock = $('.dock');
  if (dock && hasIO) {
    var heroSeen = true, endSeen = false;
    var syncDock = function () { dock.classList.toggle('is-up', !heroSeen && !endSeen); };
    new IntersectionObserver(function (e) { heroSeen = e[0].isIntersecting; syncDock(); }).observe($('#hero-book'));
    new IntersectionObserver(function (e) { endSeen = e[0].isIntersecting; syncDock(); }, { threshold: 0.35 }).observe($('.finale'));
  } else if (dock) {
    dock.classList.add('is-up');
  }

  /* ── Current section in the desktop nav ── */
  if (hasIO) {
    var links = $$('.nav a');
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) {
          if (l.getAttribute('href') === '#' + e.target.id) l.setAttribute('aria-current', 'true');
          else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('.hero, #work, #services, #words, #artist, #motion, #book').forEach(function (s) { navIO.observe(s); });
  }
})();
