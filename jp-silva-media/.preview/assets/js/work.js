/* JP SILVA MEDIA — Work index
   Category filter (aria-pressed, #category hash, aria-live count, re-composed edit with a quick cut) and,
   on fine pointers only, a muted preview of his own films inside the frame on hover (one at a time). */
(function () {
  'use strict';
  var d = document, w = window, JP = w.JP || {};
  var list = d.getElementById('wk-list');
  if (!list) return;
  var items = Array.prototype.slice.call(list.querySelectorAll('.wk-item'));
  var buttons = Array.prototype.slice.call(d.querySelectorAll('.wk-f'));
  var count = d.getElementById('wk-count'), empty = d.getElementById('wk-empty');
  var total = items.length;
  var PATTERN = ['lead', 'pa', 'pb', 'wide', 'pc', 'pd'];
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var valid = buttons.map(function (b) { return b.getAttribute('data-cat'); });
  var current = 'all', cutTimer = 0;

  function compose(n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var k = i % PATTERN.length;
      out.push(n === 1 ? 'lead' : (k === 1 || k === 4) && i === n - 1 ? 'wide' : PATTERN[k]);
    }
    return out;
  }

  function apply(cat, opts) {
    opts = opts || {};
    if (valid.indexOf(cat) < 0) cat = 'all';
    var changed = cat !== current;
    current = cat;
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === cat)); });
    var shown = items.filter(function (it) { return cat === 'all' || (' ' + it.getAttribute('data-cats') + ' ').indexOf(' ' + cat + ' ') > -1; });
    var slots = compose(shown.length);
    function recompose() {
      stopPreview();
      items.forEach(function (it) { it.hidden = shown.indexOf(it) < 0; });
      shown.forEach(function (it, i) { it.setAttribute('data-slot', slots[i]); });
      if (empty) empty.hidden = shown.length > 0;
    }
    if (changed && !opts.instant && !JP.reduced) {
      /* the cut: one beat of black, then the new edit */
      clearTimeout(cutTimer);
      list.classList.add('is-cut');
      cutTimer = setTimeout(function () { recompose(); void list.offsetWidth; list.classList.remove('is-cut'); }, 110);
    } else recompose();
    var btn = buttons.filter(function (b) { return b.getAttribute('data-cat') === cat; })[0];
    var label = btn ? btn.querySelector('span').textContent : '';
    if (count) count.innerHTML = '<b>' + pad(shown.length) + '</b> / ' + pad(total) + ' pieces';
    var live = d.getElementById('wk-live');
    if (live && changed && !opts.silent) live.textContent = shown.length + ' of ' + total + ' pieces shown' + (cat === 'all' ? '' : ': ' + String(label).replace(/\d+\s*$/, '').trim());
  }

  function fromHash() { var h = (location.hash || '').replace(/^#/, ''); return h && valid.indexOf(h) > -1 ? h : 'all'; }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var cat = b.getAttribute('data-cat');
      var url = location.pathname + location.search + (cat === 'all' ? '' : '#' + cat);
      try { history.replaceState(null, '', url); } catch (e) { location.hash = cat === 'all' ? '' : cat; }
      apply(cat);
      /* keep the filter in view when it is pinned and the list is long */
      var f = d.querySelector('.wk-filter');
      if (f && list.getBoundingClientRect().top < 0) {
        var top = list.getBoundingClientRect().top + (w.scrollY || w.pageYOffset) - f.offsetHeight - (parseFloat(getComputedStyle(f).top) || 0) - 8;
        w.scrollTo({ top: Math.max(0, top), behavior: JP.reduced ? 'auto' : 'smooth' });
      }
    });
  });
  w.addEventListener('hashchange', function () { apply(fromHash()); });
  apply(fromHash(), { instant: true, silent: true });

  /* ---- hover previews: his own films only, fine pointer, motion allowed, not on Save-Data ---- */
  var active = null, hoverTimer = 0;
  function stopPreview() {
    clearTimeout(hoverTimer);
    if (!active) return;
    var v = active.querySelector('video.wk-prev');
    if (v) { try { v.pause(); } catch (e) {} v.removeAttribute('src'); while (v.firstChild) v.removeChild(v.firstChild); try { v.load(); } catch (e) {} v.remove(); }
    active.classList.remove('is-previewing');
    active = null;
  }
  function startPreview(it) {
    var fr = it.querySelector('.wk-frame[data-film]');
    if (!fr) return;
    stopPreview();
    active = it;
    var v = d.createElement('video');
    v.className = 'wk-prev'; v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true'); v.preload = 'auto';
    [['data-film', 'video/webm'], ['data-film-mp4', 'video/mp4']].forEach(function (s) {
      var src = d.createElement('source'); src.src = fr.getAttribute(s[0]); src.type = s[1]; v.appendChild(src);
    });
    v.addEventListener('loadedmetadata', function () { if (v.duration > 12) { try { v.currentTime = Math.min(v.duration * 0.18, 12); } catch (e) {} } });
    v.addEventListener('playing', function () { v.classList.add('is-playing'); });
    v.addEventListener('error', function () { if (active === it) stopPreview(); }, true);
    var grade = fr.querySelector('.frame-grade');
    fr.insertBefore(v, grade);
    it.classList.add('is-previewing');
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  var canPreview = JP.finePointer && !JP.reduced && !JP.saveData && w.matchMedia && w.matchMedia('(hover: hover)').matches;
  if (canPreview) {
    items.forEach(function (it) {
      if (it.getAttribute('data-kind') !== 'file') return;
      var link = it.querySelector('.wk-link');
      link.addEventListener('mouseenter', function () { clearTimeout(hoverTimer); hoverTimer = setTimeout(function () { startPreview(it); }, 160); });
      link.addEventListener('mouseleave', function () { if (active === it || !active) stopPreview(); });
    });
    d.addEventListener('visibilitychange', function () { if (d.hidden) stopPreview(); });
    w.addEventListener('jpsm:sound', stopPreview);
    w.addEventListener('scroll', function () { if (active && !active.matches(':hover')) stopPreview(); }, { passive: true });
  }
})();
