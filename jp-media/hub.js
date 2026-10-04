/* Hub: entrance, plate crossfade, in-view highlight on touch devices */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var plates = {}; d.querySelectorAll('.plates img').forEach(function (i) { plates[i.getAttribute('data-for')] = i; });
  var current = null;
  function show(c) {
    if (c === current) return; current = c;
    Object.keys(plates).forEach(function (k) { plates[k].classList.toggle('is-on', k === c); });
  }
  var dirs = Array.prototype.slice.call(d.querySelectorAll('.dir'));
  dirs.forEach(function (a) {
    var c = a.getAttribute('data-c');
    a.addEventListener('pointerenter', function () { if (JP.finePointer) show(c); });
    a.addEventListener('focus', function () { show(c); });
  });
  var list = d.querySelector('.list');
  if (list) list.addEventListener('pointerleave', function () { if (JP.finePointer) show('01'); });

  /* touch: the row nearest the middle of the viewport is "active" */
  if (!JP.finePointer && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { dirs.forEach(function (x) { x.classList.remove('is-active'); }); e.target.classList.add('is-active'); show(e.target.getAttribute('data-c')); } });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    dirs.forEach(function (a) { io.observe(a); });
  }

  /* entrance: rule → title lines → the six rows */
  var seq = JP.sequence({
    key: 'hub',
    steps: [
      { at: 120, add: 'p1' },
      { at: 700, add: 'p2' },
      { at: 1500, add: 'p3', long: true },
      { at: 900, fn: function () { show('01'); } }
    ],
    tail: 500,
    skipAfter: 400
  });
  seq.start();
  if (JP.reduced || !root.classList.contains('js-anim')) { root.classList.add('p1', 'p2', 'p3'); show('01'); }
  window.addEventListener('jp:opened', function () { root.classList.add('p1', 'p2', 'p3'); if (!current) show('01'); });
})();
