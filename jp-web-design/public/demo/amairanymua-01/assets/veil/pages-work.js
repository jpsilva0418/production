/* /demo/amairanymua-01 — VEIL: the portfolio viewer.
   Every photograph in the procession is a plain link to its 1280 file; this turns those links
   into a light, modal viewer (<dialog>): focus moves in and is trapped, Escape and the close
   button close it, focus returns to the tile, arrow keys and a sideways swipe move between
   looks, a counter and the caption are shown, the large picture is loaded only when asked
   for (srcset + sizes from the tile), and the page behind is pinned the iOS-safe way. It never
   opens from a tap that was really a scroll: a finger that moved, or a tap that only stopped
   a fling, does nothing. The preview marker is copied into the viewer so it stays on screen.
   No dependencies, no network; without it the links still work. */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var dlg = doc.getElementById('lb');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var tiles = $$('a.pf-a[data-lb]').sort(function (a, b) { return +a.getAttribute('data-lb') - +b.getAttribute('data-lb'); });
  if (!tiles.length) return;
  var im = dlg.querySelector('.lb-im');
  var cap = dlg.querySelector('.lb-cap');
  var num = dlg.querySelector('.lb-n b');
  var closeBtn = dlg.querySelector('[data-lb-close]');
  var prevBtn = dlg.querySelector('[data-lb-prev]');
  var nextBtn = dlg.querySelector('[data-lb-next]');
  var stage = dlg.querySelector('.lb-stage');
  if (!im || !closeBtn) return;

  var data = tiles.map(function (a) {
    var img = a.querySelector('img');
    var fc = a.parentNode && a.parentNode.querySelector('figcaption');
    return {
      srcset: img ? img.getAttribute('srcset') : '',
      src: a.getAttribute('href'),
      alt: img ? img.getAttribute('alt') : '',
      cap: fc ? fc.textContent.replace(/\s+/g, ' ').trim() : '',
      w: a.getAttribute('data-w'), h: a.getAttribute('data-h')
    };
  });
  var n = data.length;
  var cur = 0, opener = null, open = false;
  var pad = function (x) { return (x < 10 ? '0' : '') + x; };

  /* ---- what is shown ---- */
  var token = 0;
  var paint = function (i) {
    var d = data[i];
    im.setAttribute('width', d.w); im.setAttribute('height', d.h);
    im.setAttribute('srcset', d.srcset);
    im.setAttribute('src', d.src);
    im.setAttribute('alt', d.alt);
  };
  var show = function (i, animate) {
    cur = (i + n) % n;
    var d = data[cur];
    if (num) num.textContent = pad(cur + 1);
    if (cap) cap.textContent = d.cap;
    var t = ++token;
    if (!animate || reduced) { paint(cur); im.classList.remove('is-out'); }
    else {
      im.classList.add('is-out');
      setTimeout(function () {
        if (t !== token) return;
        paint(cur);
        var done = function () { if (t === token) im.classList.remove('is-out'); };
        if (im.decode) im.decode().then(done, done); else if (im.complete) done(); else im.onload = done;
      }, 220);
    }
    /* warm the neighbours, quietly */
    [cur + 1, cur - 1].forEach(function (j) {
      var x = data[(j + n) % n], pre = new Image();
      pre.sizes = im.getAttribute('sizes') || '92vw'; pre.srcset = x.srcset;
    });
  };
  var go = function (step) { if (open) show(cur + step, true); };

  /* ---- the page behind stays still ---- */
  var lockY = 0;
  var lock = function (on) {
    var b = doc.body.style;
    if (on) { lockY = window.scrollY || window.pageYOffset; b.position = 'fixed'; b.top = '-' + lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; }
    else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; root.style.scrollBehavior = 'auto'; window.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
  };

  var openAt = function (i, from) {
    if (open) return;
    open = true; opener = from || null;
    show(i, false);
    /* the preview marker must stay on screen; a modal dialog sits above everything, so it
       carries an identical copy of the page's own marker (same markup, same stylesheet) */
    if (!dlg.querySelector('.demo-flag')) {
      var flag = doc.querySelector('.demo-flag');
      if (flag) dlg.appendChild(flag.cloneNode(true));
    }
    lock(true);
    doc.body.classList.add('lb-open');
    dlg.showModal();
    closeBtn.focus({ preventScroll: true });
    requestAnimationFrame(function () { requestAnimationFrame(function () { dlg.classList.add('is-on'); }); });
  };
  var closeIt = function () {
    if (!open) return;
    open = false;
    dlg.classList.remove('is-on');
    var finish = function () {
      if (dlg.open) dlg.close();
      lock(false);
      doc.body.classList.remove('lb-open');
      if (opener) opener.focus({ preventScroll: true });
    };
    if (reduced) finish(); else setTimeout(finish, 420);
  };

  closeBtn.addEventListener('click', closeIt);
  if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });
  /* Escape: the dialog's own cancel, closed our way so focus and scroll come back */
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); closeIt(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'Escape') { e.preventDefault(); closeIt(); }
    else if (e.key === 'Tab') {
      var f = [closeBtn, prevBtn, nextBtn].filter(function (b) { return b && b.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1], at = f.indexOf(doc.activeElement);
      if (e.shiftKey && (at <= 0)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (at === f.length - 1 || at < 0)) { e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted && open) { open = true; closeIt(); } });

  /* ---- sideways swipe on the picture ---- */
  if (stage) {
    var sx = 0, sy = 0, st = 0, tracking = false;
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { tracking = false; return; }
      tracking = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now();
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      var dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3 && Date.now() - st < 900) go(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ---- a tap opens it; a scroll never does ---- */
  var lastScroll = 0, downX = 0, downY = 0, downAt = 0, moved = false;
  window.addEventListener('scroll', function () { lastScroll = Date.now(); }, { passive: true });
  tiles.forEach(function (a, i) {
    a.addEventListener('pointerdown', function (e) {
      downX = e.clientX; downY = e.clientY; downAt = Date.now(); moved = false;
    });
    a.addEventListener('pointermove', function (e) {
      if (downAt && (Math.abs(e.clientX - downX) > 10 || Math.abs(e.clientY - downY) > 10)) moved = true;
    });
    a.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      var fromPointer = e.detail > 0 && downAt;
      if (fromPointer) {
        var far = Math.abs(e.clientX - downX) > 10 || Math.abs(e.clientY - downY) > 10;
        /* a scroll just before the finger came down (stopping a fling) or while it was down */
        var scrolled = lastScroll && lastScroll > downAt - 260;
        downAt = 0;
        if (moved || far || scrolled) return;
      }
      openAt(i, a);
    });
  });
})();
