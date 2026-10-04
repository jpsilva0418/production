/* CONCEPT 03 — DUST & LIGHT · page behaviour (progressive enhancement over shared/core.js) */
(function () {
  'use strict';
  var JP = window.JP, d = document, root = d.documentElement, w = window;
  if (!JP || !JP.sequence) return;

  /* 1 ─ Entrance: the exposure settles. Classes land on <html>; concept.css moves from the intro state. */
  JP.sequence({
    key: 'c03', tail: 450,
    steps: [
      { at: 0, add: 'p0' },                       /* blown out (already painted by CSS) */
      { at: 300, add: 'p1' },                     /* stop down: overlay 1 → 0 over 1.5 s */
      { at: 900, add: 'p2' },                     /* field data types in */
      { at: 1700, add: 'p3', long: true },        /* the name rises out of the ground */
      { at: 2600, add: 'p4' },                    /* subline */
      { at: 3300, add: 'p5' }                     /* header + roll cue */
    ]
  }).start();

  /* 2 ─ Header: a hairline once the hero has scrolled 60px. */
  var head = d.querySelector('.site-head');
  var leak = d.querySelector('.leak'), pass = d.querySelector('.leak-pass');
  JP.onFrame(function (s) {
    if (head) head.classList.toggle('is-scrolled', s.y > 60);
    /* 3 ─ Light leak: a 40vw warm pass travels -40% → 140% of the section while it is in view (transform only). */
    if (pass && leak && !JP.reduced) {
      var pr = JP.progress(leak, s.vh);
      if (pr.inView) {
        var x = (-0.4 + 1.8 * pr.p) * pr.r.width;
        pass.style.transform = 'translateX(' + x.toFixed(1) + 'px) skewX(-12deg)';
      }
    }
  });

  /* 4 ─ Landscape: the 14 s drift runs only while the frame is on screen (desktop, fine pointer; CSS gates the rest). */
  var land = d.querySelector('.land');
  if (land && 'IntersectionObserver' in w) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { land.classList.toggle('in-view', e.isIntersecting); });
    }, { threshold: 0.15 }).observe(land);
  }

  /* 5 ─ Tour strip on touch: when the strip is a horizontal roll, all four frames flash in together (staggered)
         as soon as the strip enters the viewport, so nothing waits off-screen to the right. */
  var strip = d.querySelector('.road-strip');
  if (strip && 'IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (strip.scrollWidth > strip.clientWidth + 4) {
          Array.prototype.forEach.call(strip.querySelectorAll('[data-reveal]'), function (el, i) {
            el.style.setProperty('--d', (i * 0.14).toFixed(2) + 's');
            el.classList.add('is-in');
          });
        }
        io.disconnect();
      });
    }, { threshold: 0.1 });
    io.observe(strip);
  }

  /* 6 ─ Email control is demo-safe: it only lights the note. */
  var mail = d.querySelector('.mail-btn');
  if (mail) {
    var t = 0;
    mail.addEventListener('click', function () {
      mail.classList.add('is-noted');
      clearTimeout(t); t = setTimeout(function () { mail.classList.remove('is-noted'); }, 1800);
    });
  }
})();
