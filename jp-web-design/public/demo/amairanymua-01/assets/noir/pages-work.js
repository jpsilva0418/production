/* /demo/amairanymua-01 — NOIR Portfolio: the reel's arrival, the look filter and the
   full-screen frame viewer. Plain ES2017, one IIFE, no dependencies, no network.
   Everything is an enhancement: without this file the filter's place is taken by plain links
   to each group, every tile is a plain link to its 1280 file, and nothing is hidden.
   (Films: site.js already loads any video[data-film] near the viewport.) */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, win = window;
  var reel = doc.getElementById('reel');
  if (!reel) return;
  var mq = function (q) { return win.matchMedia ? win.matchMedia(q) : { matches: false }; };
  var reduced = mq('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in win;
  var $ = function (id) { return doc.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ---------------- the reel arrives frame by frame ---------------- */
  var tiles = $$('.rl-t', reel);
  var showTile = function (el) { el.classList.add('in'); };
  if (!reduced && hasIO) {
    root.classList.add('rlx');
    var tio = new IntersectionObserver(function (es) {
      var k = 0;
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.setProperty('--d', (Math.min(k++, 3) * 0.09).toFixed(2) + 's');
        showTile(e.target); tio.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
    tiles.forEach(function (t) { tio.observe(t); });
    /* a jump (fragment, restored scroll) never leaves a frame half-hidden on screen */
    win.addEventListener('load', function () {
      setTimeout(function () {
        tiles.forEach(function (t) { var r = t.getBoundingClientRect(); if (r.top < win.innerHeight && r.bottom > 0) showTile(t); });
      }, 300);
    });
  } else tiles.forEach(showTile);

  /* ---------------- the filter: real buttons, aria-pressed, a polite count ---------------- */
  var fl = doc.querySelector('[data-reel-filter]');
  var jump = doc.querySelector('.rl-jump');
  var groupsWrap = $('reelGroups');
  var groups = $$('.rl-g', reel);
  var now = $('reelNow');
  var bar = $('reelBar');
  if (fl && groupsWrap) {
    fl.hidden = false;
    if (jump) jump.hidden = true;
    var btns = $$('button[data-f]', fl);
    var swapT = 0;
    var apply = function (f) {
      groups.forEach(function (g) { g.hidden = !(f === 'all' || g.getAttribute('data-group') === f); });
      var shown = $$('.rl-g:not([hidden]) .rl-t', reel);
      shown.forEach(function (t, i) {
        t.style.setProperty('--d', (Math.min(i, 5) * 0.06).toFixed(2) + 's');
        showTile(t);
      });
    };
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-pressed') === 'true') return;
        var f = b.getAttribute('data-f');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        if (now) {
          now.textContent = '';
          var vh = doc.createElement('span'); vh.className = 'vh'; vh.textContent = 'Showing ' + b.getAttribute('data-t') + ': ';
          now.appendChild(vh); now.appendChild(doc.createTextNode(b.getAttribute('data-now') || ''));
        }
        /* bring the reel's top into view when the visitor has scrolled past it */
        var goTop = function () {
          if (!bar) return;
          var r = bar.getBoundingClientRect();
          if (r.top < 0) {
            var hd = parseFloat(getComputedStyle(root).getPropertyValue('--hd')) || 60;
            win.scrollTo({ top: Math.max(0, r.top + (win.scrollY || win.pageYOffset) - hd - 8), behavior: reduced ? 'auto' : 'smooth' });
          }
        };
        clearTimeout(swapT);
        if (reduced) { apply(f); goTop(); return; }
        groupsWrap.classList.add('swap');
        swapT = setTimeout(function () {
          apply(f);
          goTop();
          requestAnimationFrame(function () { groupsWrap.classList.remove('swap'); });
        }, 230);
      });
    });
  }

  /* ---------------- the frame viewer ----------------
     role=dialog (not a top-layer <dialog>, so the preview marker stays above it): focus moves
     in and is trapped, the rest of the page is inert, Escape and Close close it, focus returns
     to the tile. Arrows and swipe move between looks; one photograph fades through black into
     the next (never two faces at once). The large file loads only when shown, with a sizes
     value equal to the width it is drawn at. */
  var lb = $('lightbox'), stage = $('lbStage'), img = $('lbImg'), capEl = $('lbCap'), nEl = $('lbI'), tEl = $('lbT');
  var xBtn = $('lbClose'), pBtn = $('lbPrev'), nBtn = $('lbNext');
  if (!lb || !stage || !img || !xBtn) return;

  /* the dialog is markup in the page; lift it out of <main> (which is made inert while it is
     open) and give it its semantics only now that it works */
  if (lb.parentNode !== doc.body) doc.body.appendChild(lb);
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-hidden', 'true');
  lb.setAttribute('aria-describedby', 'lbCap');

  var list = [], cur = -1, trigger = null, isOpen = false, token = 0, lockY = 0, closeT = 0;
  var inerted = [];

  var lock = function (on) {
    var b = doc.body.style;
    if (on) { lockY = win.scrollY || win.pageYOffset; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
    else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; win.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
  };
  var setInert = function (on) {
    if (on) {
      inerted = Array.prototype.filter.call(doc.body.children, function (el) {
        return el !== lb && !el.classList.contains('demo-flag') && el.tagName !== 'SCRIPT' && !el.hasAttribute('inert');
      });
      inerted.forEach(function (el) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); });
    } else {
      inerted.forEach(function (el) { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); });
      inerted = [];
    }
  };

  /* draw size: the photograph contained in the stage, never upscaled past its file */
  var fit = function (a) {
    if (!a) return null;
    var w = +a.getAttribute('data-w') || 1280, h = +a.getAttribute('data-h') || 1600;
    var r = stage.getBoundingClientRect();
    var aw = Math.max(80, r.width), ah = Math.max(80, r.height);
    var dw = Math.min(aw, ah * w / h, w), dh = dw * h / w;
    return { w: Math.round(dw), h: Math.round(dh), iw: w, ih: h };
  };
  var size = function () {
    var a = list[cur], s = fit(a);
    if (!s) return;
    img.style.width = s.w + 'px'; img.style.height = s.h + 'px';
    img.setAttribute('sizes', s.w + 'px');
  };
  var preload = function (i) {
    var a = list[(i + list.length) % list.length], s = fit(a);
    if (!a || !s) return;
    var p = new Image(); p.sizes = s.w + 'px'; p.srcset = a.getAttribute('data-srcset'); p.src = a.getAttribute('href');
  };

  var show = function (i, dir) {
    if (!list.length) return;
    i = (i + list.length) % list.length;
    var a = list[i], my = ++token;
    var first = cur === -1 || !img.classList.contains('in');
    cur = i;
    nEl.textContent = pad(i + 1);
    tEl.textContent = pad(list.length);
    capEl.textContent = a.getAttribute('data-cap') || '';
    var load = function () {
      if (my !== token) return;
      var im = a.querySelector('img');
      img.classList.remove('in');
      img.removeAttribute('src');
      img.removeAttribute('srcset');
      img.alt = im ? im.alt : '';
      img.width = +a.getAttribute('data-w') || 0;
      img.height = +a.getAttribute('data-h') || 0;
      size();
      img.style.transform = reduced || !dir ? '' : 'translate3d(' + (dir * 28) + 'px,0,0)';
      var done = function () {
        if (my !== token) return;
        img.onload = img.onerror = null;
        requestAnimationFrame(function () {
          if (my !== token) return;
          img.style.transform = '';
          img.classList.add('in');
        });
        preload(i + 1); preload(i - 1);
      };
      img.onload = done; img.onerror = done;
      img.srcset = a.getAttribute('data-srcset') || '';
      img.src = a.getAttribute('href');
      if (img.complete && img.naturalWidth) done();
    };
    if (first || reduced) load();
    else {
      /* dip through black: the old frame leaves completely before the new one arrives */
      img.style.transform = 'translate3d(' + (-(dir || 1) * 28) + 'px,0,0)';
      img.classList.remove('in');
      setTimeout(load, 190);
    }
  };

  var open = function (a) {
    list = $$('.rl-g:not([hidden]) .rl-a', reel);
    var i = list.indexOf(a);
    if (i < 0) return;
    clearTimeout(closeT);
    trigger = a; isOpen = true; cur = -1;
    lock(true);
    setInert(true);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    void lb.offsetWidth;
    lb.classList.add('shown');
    show(i, 0);
    xBtn.focus({ preventScroll: true });
  };
  var close = function () {
    if (!isOpen) return;
    isOpen = false; token++;
    lb.classList.remove('shown');
    var finish = function () {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      img.classList.remove('in');
      img.removeAttribute('src'); img.removeAttribute('srcset');
    };
    setInert(false);
    lock(false);
    if (trigger) trigger.focus({ preventScroll: true });
    if (reduced) finish(); else closeT = setTimeout(finish, 330);
  };
  var go = function (d) { if (isOpen && list.length > 1) show(cur + d, d); };

  xBtn.addEventListener('click', close);
  if (pBtn) pBtn.addEventListener('click', function () { go(-1); });
  if (nBtn) nBtn.addEventListener('click', function () { go(1); });
  lb.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); return; }
    if (e.key === 'Tab') {
      var f = [xBtn, pBtn, nBtn].filter(function (el) { return el && el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (doc.activeElement === first || !lb.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (doc.activeElement === last || !lb.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
    }
  });
  /* focus can never wander out (e.g. a click on the backdrop of the marker) */
  doc.addEventListener('focusin', function (e) {
    if (isOpen && !lb.contains(e.target) && !(e.target.closest && e.target.closest('.demo-flag'))) xBtn.focus({ preventScroll: true });
  });
  win.addEventListener('resize', function () { if (isOpen) size(); }, { passive: true });
  win.addEventListener('pageshow', function (e) { if (e.persisted && isOpen) close(); });

  /* swipe: the frame follows the finger; past 50px it moves on, otherwise it settles back */
  var sx = 0, sy = 0, dx = 0, tracking = false, horiz = null;
  stage.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1 || (win.visualViewport && win.visualViewport.scale > 1.05)) { tracking = false; return; }
    tracking = true; horiz = null; dx = 0;
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchmove', function (e) {
    if (!tracking || e.touches.length !== 1) return;
    dx = e.touches[0].clientX - sx;
    var dy = e.touches[0].clientY - sy;
    if (horiz === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) horiz = Math.abs(dx) > Math.abs(dy);
    if (horiz && !reduced) { img.classList.add('drag'); img.style.transform = 'translate3d(' + dx + 'px,0,0)'; }
  }, { passive: true });
  var endSwipe = function () {
    if (!tracking) return;
    tracking = false;
    img.classList.remove('drag');
    if (horiz && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    else img.style.transform = '';
  };
  stage.addEventListener('touchend', endSwipe, { passive: true });
  stage.addEventListener('mousemove', function (e) {
    var r = stage.getBoundingClientRect();
    stage.classList.toggle('lb-l', e.clientX < r.left + r.width / 2);
  });
  /* with a mouse, the stage's two halves are previous and next (the arrows stay the
     labelled controls; this only saves the trip to the foot of the screen) */
  stage.addEventListener('click', function (e) {
    if (!isOpen || e.pointerType === 'touch' || !mq('(pointer: fine)').matches) return;
    var r = stage.getBoundingClientRect();
    go(e.clientX < r.left + r.width / 2 ? -1 : 1);
  });
  stage.addEventListener('touchcancel', endSwipe, { passive: true });

  /* a tile opens the viewer only on a deliberate tap: never at the end of a drag, never on the
     tap that stops a moving scroll, never with a modifier (those open the file as usual) */
  var lastScroll = 0, down = null;
  win.addEventListener('scroll', function () { lastScroll = Date.now(); }, { passive: true });
  reel.addEventListener('pointerdown', function (e) {
    down = { x: e.clientX, y: e.clientY, scrolling: Date.now() - lastScroll < 120 };
  }, { passive: true });
  $$('.rl-a', reel).forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      var d = down; down = null;
      if (d && e.detail > 0) {
        if (d.scrolling) return;
        if (Math.abs(e.clientX - d.x) > 10 || Math.abs(e.clientY - d.y) > 10) return;
      }
      open(a);
    });
  });
})();
