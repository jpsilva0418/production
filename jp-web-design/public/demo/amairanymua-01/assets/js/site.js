/* /demo/amairanymua-01 — one small script for all three directions.
   Everything it does is an enhancement: with no script the page still reads,
   the gallery links open the photographs, the reels open on Instagram and
   every booking link works. Booking links are plain links to Amairany's own
   JotForm and Acuity pages; this file never touches them. */
(function () {
  'use strict';
  window.__am01 = 1;
  var d = document, root = d.documentElement;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SAVE = navigator.connection && navigator.connection.saveData;

  /* entrance: ends by itself; any tap, key or scroll ends it at once */
  if (root.classList.contains('intro-play')) {
    var over = false;
    var finish = function (skip) {
      if (over) return; over = true;
      if (skip) root.classList.add('intro-skip');
      setTimeout(function () {
        root.classList.remove('intro-play'); root.classList.remove('intro-skip');
        root.classList.add('intro-done');
      }, skip ? 80 : 0);
    };
    var timer = setTimeout(function () { finish(false); }, +root.getAttribute('data-intro') || 3000);
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
      addEventListener(ev, function () { clearTimeout(timer); finish(true); }, { once: true, passive: true });
    });
  }
  $$('[data-replay]').forEach(function (b) {
    b.addEventListener('click', function () {
      try { sessionStorage.removeItem(b.getAttribute('data-replay')); } catch (e) {}
      scrollTo(0, 0); location.href = location.pathname + '?intro=1';
    });
  });

  /* header, phone booking bar, progress line */
  var nav = $('.nav'), dock = $('.dock'), hero = $('.hero'), prog = $('.prog'), queued = false;
  var par = RM ? [] : $$('[data-par]');
  function onScroll() {
    queued = false;
    var y = window.pageYOffset, max = d.documentElement.scrollHeight - innerHeight;
    if (nav) nav.classList.toggle('is-solid', y > 24);
    if (dock) dock.classList.toggle('is-on', y > (hero ? hero.offsetHeight * 0.7 : 480) && y < max - 260);
    if (prog) prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    /* a slow drift on the closing photograph */
    par.forEach(function (el) {
      var r = el.parentNode.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = 'translate3d(0,' + (p * -46).toFixed(1) + 'px,0) scale(1.12)';
    });
  }
  addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* phone menu */
  var menu = $('#menu'), burger = $('.nav__burger');
  function setMenu(open) {
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    root.classList.toggle('menu-open', open);
    if (open) { var x = $('.menu__x', menu); if (x) x.focus(); }
  }
  if (menu && burger) {
    burger.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) {
      var t = e.target.closest('a,[data-close]');
      if (!t) return;
      setMenu(false);
      if (t.hasAttribute('data-close')) burger.focus();
    });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a,button', menu), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* reveal on scroll */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.04 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* portfolio filter */
  var chips = $$('.chip'), items = $$('.gal__it'), live = $('#gal-live');
  function visible() { return items.filter(function (i) { return !i.hidden; }); }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      items.forEach(function (it) {
        var show = f === 'all' || (' ' + it.getAttribute('data-c') + ' ').indexOf(' ' + f + ' ') > -1;
        it.hidden = !show;
        if (show && !RM) { it.classList.remove('pop'); void it.offsetWidth; it.classList.add('pop'); }
      });
      if (live) live.textContent = visible().length + ' looks shown';
    });
  });

  /* lightbox: arrows, swipe, Esc */
  var lb = $('.lb');
  if (lb && lb.showModal) {
    var img = $('.lb__img', lb), cap = $('.lb__t', lb), num = $('.lb__n', lb), cur = 0, list = [];
    var show = function (i) {
      list = visible(); if (!list.length) return;
      cur = (i + list.length) % list.length;
      var a = list[cur];
      img.src = a.getAttribute('href');
      img.alt = $('img', a).alt;
      cap.textContent = a.getAttribute('data-cap');
      num.textContent = (cur + 1) + ' / ' + list.length;
    };
    items.forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); show(visible().indexOf(a)); lb.showModal(); });
    });
    $('.dlg__x', lb).addEventListener('click', function () { lb.close(); });
    $('.lb__p', lb).addEventListener('click', function () { show(cur - 1); });
    $('.lb__nx', lb).addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('dlg')) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 48) show(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });
    lb.addEventListener('close', function () { img.removeAttribute('src'); });
  }

  /* reels: Instagram's own player, loaded only when a reel is tapped */
  var rd = $('.rd');
  if (rd && rd.showModal) {
    var frame = $('.rd__frame', rd), open = $('.rd__open', rd);
    $$('.reel').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var f = d.createElement('iframe');
        f.title = 'Instagram reel from @amairanymua';
        f.src = 'https://www.instagram.com/reel/' + encodeURIComponent(a.getAttribute('data-id')) + '/embed/';
        f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        f.setAttribute('allowfullscreen', '');
        frame.textContent = ''; frame.appendChild(f);
        open.href = a.href;
        rd.showModal();
      });
    });
    $('.dlg__x', rd).addEventListener('click', function () { rd.close(); });
    rd.addEventListener('click', function (e) { if (e.target === rd || e.target.classList.contains('dlg')) rd.close(); });
    rd.addEventListener('close', function () { frame.textContent = ''; });
  }

  /* Première hero: her stills cut together slowly, after the page has loaded */
  var reel = $('[data-reel]');
  if (reel && !RM && !SAVE) {
    addEventListener('load', function () {
      setTimeout(function () {
        var base = reel.getAttribute('data-base'), first = $('.hero__img', reel), imgs = [first], at = 0;
        reel.getAttribute('data-reel').split(',').forEach(function (k) {
          var im = new Image();
          im.className = 'hero__img'; im.alt = ''; im.decoding = 'async';
          im.sizes = first.sizes;
          im.srcset = base + k + '-800.webp 800w, ' + base + k + '-1280.webp 1280w';
          im.src = base + k + '-800.webp';
          reel.appendChild(im); imgs.push(im);
        });
        setInterval(function () {
          if (d.hidden) return;
          var next = (at + 1) % imgs.length;
          if (!imgs[next].complete || !imgs[next].naturalWidth) return;
          imgs[at].classList.remove('is-on'); imgs[next].classList.add('is-on'); at = next;
        }, 4800);
      }, 2200);
    });
  }
})();
