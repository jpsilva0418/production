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

  /* ── The hero: her work in motion. Photographs and short clips dissolve
        through one column on phones and three on wide screens. It rests when
        it is off screen, can be paused, and stays still for reduced motion. ── */
  var stage = $('#hero-stage');
  var tagEl = $('#hero-tag');
  var reelToggle = $('.film-toggle');
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var heroReel = (function () {
    var shots = [];
    try { shots = JSON.parse($('#montage-data').textContent); } catch (e) {}
    var wide = window.matchMedia('(min-width: 900px)');
    var cols = stage ? { c: $('[data-col="c"]', stage), l: $('[data-col="l"]', stage), r: $('[data-col="r"]', stage) } : {};
    var beat = 1;          /* shot 0 is already on screen, in the markup */
    var burst = 0;         /* quick cuts left before it settles */
    var wanted = !reduce && !saveData;
    var onScreen = true;
    var started = false;
    var timer = null;

    function put(col, src, pos, film, fast) {
      if (!col) return;
      var el = doc.createElement('div');
      el.className = 'shot';
      var swapped = false;
      var swap = function () {
        if (swapped) return;
        swapped = true;
        var old = $$('.shot', col);
        col.appendChild(el);
        void el.offsetWidth;
        el.classList.add('is-on');
        old.forEach(function (o) {
          o.classList.remove('is-on');
          setTimeout(function () {
            var v = $('video', o);
            if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {} }
            if (o.parentNode) o.parentNode.removeChild(o);
          }, fast ? 60 : 800);
        });
      };
      if (film) {
        var v = doc.createElement('video');
        v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
        v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        v.preload = 'auto';
        v.poster = src;
        v.style.objectPosition = pos;
        v.src = film;
        el.appendChild(v);
        swap();
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function () {});
      } else {
        var im = new Image();
        im.alt = '';
        im.decoding = 'async';
        im.style.objectPosition = pos;
        im.onload = swap;
        im.onerror = function () { swapped = true; }; /* keep what is showing */
        el.appendChild(im);
        im.src = src;
        if (im.complete && im.naturalWidth) swap();
      }
    }

    /* The denser the screen, the taller the picture it needs. */
    function best(p) { return p.hi && (window.devicePixelRatio || 1) * stage.clientHeight > 1050 ? p.hi : p.src; }

    function tick() {
      timer = null;
      if (!wanted || !onScreen || shots.length < 2) return;
      var fast = burst > 0;
      var sh = shots[beat % shots.length];
      /* phones show one full-screen picture: only the beats tall enough to stay sharp */
      if (!wide.matches) {
        for (var guard = 0; !sh.phone && guard < shots.length; guard++) { beat++; sh = shots[beat % shots.length]; }
      }
      stage.classList.toggle('is-fast', fast);
      put(cols.c, best(sh.c), sh.c.pos, null, fast);
      if (wide.matches) {
        /* the side columns: a film clip plays here, never full-bleed */
        setTimeout(function () { put(cols.l, best(sh.l), sh.l.pos, sh.l.film, fast); }, fast ? 0 : 260);
        setTimeout(function () { put(cols.r, best(sh.r), sh.r.pos, sh.r.film, fast); }, fast ? 0 : 520);
      }
      if (tagEl) {
        if (sh.label) tagEl.textContent = sh.label;
        tagEl.classList.toggle('is-on', !!sh.label);
      }
      beat++;
      if (burst) burst--;
      timer = setTimeout(tick, fast ? 250 : 2100);
    }

    function sync() {
      if (reelToggle) {
        reelToggle.setAttribute('aria-pressed', String(!wanted));
        reelToggle.setAttribute('aria-label', wanted ? 'Pause the moving pictures' : 'Play the moving pictures');
      }
      if (!stage) return;
      var go = wanted && onScreen && started;
      $$('video', stage).forEach(function (v) {
        if (go) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause();
      });
      if (go && !timer) timer = setTimeout(tick, 600);
      if (!go && timer) { clearTimeout(timer); timer = null; }
    }

    if (reelToggle) reelToggle.addEventListener('click', function () { wanted = !wanted; started = true; if (wanted) stage.classList.add('is-live'); sync(); });
    if (stage && hasIO) {
      new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(stage);
    }
    sync();

    return {
      start: function (withBurst) {
        if (started || !stage) return;
        started = true;
        if (!wanted) return;
        stage.classList.add('is-live');
        burst = withBurst ? 6 : 0;
        timer = setTimeout(tick, withBurst ? 420 : 2200);
      }
    };
  })();

  /* ── The opening: her logo has been drawing itself since the first paint
        (that part is CSS). Here its eyes open onto the site and the wordmark
        travels up into the header. Any tap, key or scroll does it at once. ── */
  var curtain = $('#curtain');
  if (root.classList.contains('intro') && curtain) {
    window.__yariiIntro = true;
    (function () {
      var logo = $('#intro-logo');
      var done = false;
      var wait = null;
      /* where the wordmark sits inside the logo, as fractions of its box */
      var WM = { x: 0.03083, y: 0.55, w: 0.93 - 0.03083 };
      var finish = function () {
        root.classList.remove('intro', 'intro-out', 'intro-fast');
        if (curtain.parentNode) curtain.parentNode.removeChild(curtain);
        setTimeout(function () { root.classList.remove('hero-in'); }, 2600);
      };
      var open = function (fast) {
        if (done) return;
        done = true;
        clearTimeout(wait);
        var to = $('.bar .brand img').getBoundingClientRect();
        var from = logo.getBoundingClientRect();
        var k = to.width / (from.width * WM.w);
        logo.style.setProperty('--fs', k);
        logo.style.setProperty('--fx', (to.left - from.left - from.width * WM.x * k) + 'px');
        logo.style.setProperty('--fy', (to.top - from.top - from.height * WM.y * k) + 'px');
        if (fast) root.classList.add('intro-fast');
        root.classList.add('intro-out', 'hero-in');
        heroReel.start(true);
        setTimeout(finish, fast ? 560 : 1000);
      };
      /* let the logo finish drawing (1.3s from the start of the page), and give
         the first hero photograph a moment to arrive so the eye opens onto it */
      var first = $('#hero-stage [data-col="c"] img');
      var ready = function () { return !first || (first.complete && first.naturalWidth > 0); };
      var drawn = Math.max(380, 1320 - performance.now());
      wait = setTimeout(function hold() {
        if (ready() || performance.now() > 2600) open(false);
        else wait = setTimeout(hold, 80);
      }, drawn);

      var skip = function () { open(true); };
      curtain.addEventListener('click', skip);
      var head = $('.bar');
      head.addEventListener('click', function barSkip(e) {
        head.removeEventListener('click', barSkip);
        if (!done && !(e.target.closest && e.target.closest('a'))) open(true); /* Book Now is a booking, not a skip */
      });
      ['wheel', 'touchmove', 'keydown'].forEach(function (t) {
        window.addEventListener(t, function once(e) {
          if (t === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
          window.removeEventListener(t, once);
          if (!done) skip();
        }, { passive: true });
      });
    })();
  } else {
    heroReel.start(false);
  }

  /* ── Inquiry: a few short steps; answers survive Back and Next.
        DEMO MODE: nothing is sent anywhere and nothing is stored. ── */
  var inqForm = $('#inq-form');
  if (inqForm) (function () {
    var steps = $$('.inq-step', inqForm);
    var prog = $('#inq-prog');
    var err = $('#inq-err');
    var back = $('#inq-back');
    var next = $('#inq-next');
    var send = $('#inq-send');
    var done = $('#inq-done');
    var recap = $('#inq-recap');
    var DETAILS = {
      'Bridal': 'details-bridal',
      'Sweet 16, prom or graduation': 'details-party',
      'Event or photoshoot': 'details-event',
      'Hair': 'details-hair',
      'Makeup classes': 'details-classes',
      'Something else': 'details-other'
    };
    var KEYS = { bridal: 'Bridal', party: 'Sweet 16, prom or graduation', event: 'Event or photoshoot', hair: 'Hair', classes: 'Makeup classes', other: 'Something else' };
    var LABELS = {
      inquiryType: 'Inquiry', bridalScope: 'Wedding', bridalServices: 'Services', bridalPeople: 'People',
      occasion: 'Occasion', partyServices: 'Services', partyPeople: 'People',
      eventType: 'Event', eventServices: 'Services', eventPeople: 'People',
      hairService: 'Hair', course: 'Class', otherWhat: 'Details',
      date: 'Date', dateFlexible: 'Date not set yet', timeOfDay: 'Time of day', where: 'Getting ready at',
      fullName: 'Name', phone: 'Phone', email: 'Email', contactPref: 'Reach me by', instagram: 'Instagram',
      message: 'Notes', heardFrom: 'Found Yari via'
    };
    var at = 'type';
    var step = function (n) { return steps.filter(function (s) { return s.getAttribute('data-step') === n; })[0]; };
    var type = function () { var c = $('input[name="inquiryType"]:checked', inqForm); return c ? c.value : ''; };
    var flow = function () { return ['type', DETAILS[type()] || 'details-other', 'when', 'contact', 'extras', 'review']; };

    /* no dates in the past */
    var d0 = new Date();
    $('#inq-date').min = d0.getFullYear() + '-' + String(d0.getMonth() + 1).padStart(2, '0') + '-' + String(d0.getDate()).padStart(2, '0');

    function drawProgress() {
      var f = flow();
      var i = f.indexOf(at);
      prog.innerHTML = '';
      f.forEach(function (n, k) {
        var li = doc.createElement('li');
        var sp = doc.createElement('span');
        sp.textContent = step(n).getAttribute('data-label');
        li.appendChild(sp);
        if (k < i) li.className = 'is-done';
        if (k === i) li.setAttribute('aria-current', 'step');
        prog.appendChild(li);
      });
      prog.setAttribute('aria-label', 'Progress: step ' + (i + 1) + ' of ' + f.length);
    }

    function clearErrors() {
      err.textContent = '';
      $$('[aria-invalid]', inqForm).forEach(function (el) { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); });
      $$('.inq-fe', inqForm).forEach(function (el) { el.parentNode.removeChild(el); });
    }

    function fieldError(el, msg) {
      var id = (el.id || el.name) + '-err';
      var p = doc.createElement('p');
      p.className = 'inq-fe';
      p.id = id;
      p.textContent = msg;
      var cardsBox = el.closest('.inq-cards');
      (cardsBox ? cardsBox.parentNode : el.closest('.inq-field') || el.closest('fieldset')).appendChild(p);
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', id);
    }

    function validate(n) {
      var s = step(n);
      var bad = [];
      $$('input[type="radio"][required]', s).forEach(function (r) {
        if (!$('input[name="' + r.name + '"]:checked', s)) bad.push([r, 'Please choose one.']);
      });
      $$('input[required]:not([type="radio"]), textarea[required]', s).forEach(function (el) {
        var v = el.value.trim();
        if (!v) bad.push([el, 'Please fill this in.']);
        else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) bad.push([el, 'Please check the email address.']);
        else if (el.type === 'tel' && v.replace(/\D/g, '').length < 10) bad.push([el, 'Please include the area code.']);
      });
      if (!bad.length) return true;
      bad.forEach(function (b) { fieldError(b[0], b[1]); });
      err.textContent = bad.length === 1 ? 'One answer needs your attention.' : bad.length + ' answers need your attention.';
      bad[0][0].focus();
      return false;
    }

    function values() {
      var out = [];
      flow().forEach(function (n) {
        if (n === 'review') return;
        $$('input, select, textarea', step(n)).forEach(function (el) {
          if (!LABELS[el.name]) return;
          if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) return;
          var v = el.value.trim();
          if (!v) return;
          if (el.type === 'date') {
            var dt = new Date(v + 'T12:00:00');
            if (!isNaN(dt)) v = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
          }
          out.push([LABELS[el.name], v]);
        });
      });
      return out;
    }

    function buildRecap() {
      recap.innerHTML = '';
      values().forEach(function (kv) {
        var row = doc.createElement('div');
        var dt = doc.createElement('dt');
        var dd = doc.createElement('dd');
        dt.textContent = kv[0];
        dd.textContent = kv[1];
        row.appendChild(dt);
        row.appendChild(dd);
        recap.appendChild(row);
      });
    }

    function show(n, focus) {
      at = n;
      steps.forEach(function (s) { s.hidden = s.getAttribute('data-step') !== n; });
      var i = flow().indexOf(n);
      back.hidden = i <= 0;
      next.hidden = n === 'review';
      send.hidden = n !== 'review';
      if (n === 'when') $('legend', step('when')).textContent = type() === 'Makeup classes' ? 'When would you like to start?' : 'When is it?';
      if (n === 'review') buildRecap();
      clearErrors();
      drawProgress();
      if (focus) {
        if (inqForm.getBoundingClientRect().top < 0) inqForm.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
        $('legend', step(n)).focus({ preventScroll: true });
      }
    }

    function restart() {
      inqForm.reset();
      done.hidden = true;
      inqForm.hidden = false;
      show('type', false);
    }

    next.addEventListener('click', function () {
      if (!validate(at)) return;
      var f = flow();
      show(f[f.indexOf(at) + 1], true);
    });
    back.addEventListener('click', function () {
      var f = flow();
      show(f[Math.max(0, f.indexOf(at) - 1)], true);
    });
    $$('input[name="inquiryType"]', inqForm).forEach(function (r) { r.addEventListener('change', drawProgress); });

    inqForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (at !== 'review') { next.click(); return; } /* Enter in a text box means Next */
      if ($('#inq-company').value) return;            /* the hidden field was filled: a bot */
      /* DEMO MODE. A live site would send values() to an approved inbox here,
         with a privacy notice. This demo makes no network request at all. */
      var first = $('#inq-name').value.trim().split(/\s+/)[0] || '';
      $('#inq-done-name').textContent = first ? ', ' + first : '';
      inqForm.hidden = true;
      done.hidden = false;
      if (done.getBoundingClientRect().top < 0) done.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      done.focus({ preventScroll: true });
    });
    $('#inq-again').addEventListener('click', function () { restart(); $('legend', step('type')).focus(); });

    /* buttons that already know their subject say so: inquire?type=bridal */
    var start = function (key) {
      if (!done.hidden) restart();
      if (key && KEYS[key]) {
        $('input[name="inquiryType"][value="' + KEYS[key] + '"]', inqForm).checked = true;
        show(DETAILS[KEYS[key]], false);
        var kick = $('#iq-kick');
        if (kick && FRAMES[key]) kick.textContent = FRAMES[key];
      } else {
        show('type', false);
      }
    };
    var FRAMES = { bridal: 'Bridal inquiry', party: 'Sweet 16, prom & graduation', event: 'Event & photoshoot inquiry', hair: 'Hair inquiry', classes: 'Makeup class inquiry' };
    var m = /[?&#]type=([a-z]+)/.exec(location.search + location.hash);
    window.yariInquiry = { start: start };
    /* "Ask about bridal" on this page switches the form without reloading it */
    $$('a[data-type]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        try { history.replaceState(null, '', a.getAttribute('href')); } catch (err) {}
        start(a.getAttribute('data-type'));
        inqForm.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
        setTimeout(function () { $('legend', step(at)).focus({ preventScroll: true }); }, reduce ? 0 : 600);
      });
    });
    start(m ? m[1] : '');
  })();

  /* ── Header ── */
  var bar = $('.bar');
  var stuck = false;
  function onScroll() {
    var s = window.scrollY > 24;
    if (s !== stuck) { stuck = s; bar.classList.toggle('is-stuck', s); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Moving tiles in the gallery: play while on screen, rest when not ── */
  var tileFilms = $$('.look-film video');
  if (tileFilms.length && hasIO && !reduce && !(navigator.connection && navigator.connection.saveData)) {
    var tileIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) v.src = v.getAttribute('data-src');
          var pr = v.play();
          if (pr && pr.catch) pr.catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { rootMargin: '0px', threshold: 0.15 });
    /* fetch each clip a screen early, so it is ready by the time it arrives */
    var warmIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var v = e.target;
        if (!v.getAttribute('src')) { v.preload = 'auto'; v.src = v.getAttribute('data-src'); }
        warmIO.unobserve(v);
      });
    }, { rootMargin: '900px 0px' });
    tileFilms.forEach(function (v) { warmIO.observe(v); });
    tileFilms.forEach(function (v) { tileIO.observe(v); });
  }

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
  var looksEl = $('#looks') || doc.createElement('ul');  /* the inquiry page has no gallery */
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
    var items = [];
    var idx = 0;
    var opener = null;
    var seq = 0;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };

    var collect = function () {
      items = allLooks.filter(function (li) { return !li.hidden && $('a[data-look]', li); }).map(function (li) {
        var a = $('a', li);
        return {
          a: a,
          href: a.getAttribute('href'),
          w: +a.getAttribute('data-w'),
          h: +a.getAttribute('data-h'),
          alt: $('img', li).getAttribute('alt'),
          title: $('.look-t', li).textContent
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
  if (dock && hasIO && $('#hero-book')) {
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
    $$('.hero, #about, #work, #services, #words, #motion, #book').forEach(function (s) { navIO.observe(s); });
  }
})();
