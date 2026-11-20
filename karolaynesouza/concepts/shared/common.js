/* Karolayne Souza concepts — shared engine (inlined into each single-file preview by build.py).
 * Facts come from her own materials (media-intake/brand-brief.md): price list, WhatsApp, Square.
 *  · EN | PT: every bilingual string is written twice in the markup (data-l="en" / data-l="pt");
 *    CSS hides the inactive one. The choice is remembered when storage is available.
 *  · Lash drawing: a closed-eye lash map redrawn live for each set (illustration, not a photo).
 *  · Set picker + fill helper: prices from her list; the picker shows her real photo of the chosen
 *    set, and booking goes straight to that service on Square (where its ID is known) or to a
 *    WhatsApp message pre-filled with the set (her own api.whatsapp.com number link from Linktree).
 *  · Nothing here sends data anywhere. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- data (her price list) ---------- */
  var SETS = {
    classic:   { en: 'Classic set', pt: 'Clássica fio a fio', p: [80, 55, 65],
                 den: 'One extension on each natural lash — clean, defined, natural.',
                 dpt: 'Um fio sintético em cada fio natural — limpo, definido e natural.' },
    hybrid:    { en: 'Hybrid volume', pt: 'Volume híbrido', p: [90, 60, 70],
                 den: 'Classic and volume mixed — fuller, still soft.',
                 dpt: 'Mistura de fio a fio e volume — mais cheio, ainda leve.' },
    brazilian: { en: 'Brazilian volume', pt: 'Volume brasileiro', p: [100, 65, 75],
                 den: 'Light, airy fullness with a polished line.',
                 dpt: 'Volume leve e aerado, com acabamento impecável.' },
    russian:   { en: 'Russian volume', pt: 'Volume russo', p: [120, 75, 85],
                 den: 'Handmade fans for the fullest, most dramatic set.',
                 dpt: 'Fans feitos à mão para o resultado mais cheio e marcante.' }
  };
  var WA_PHONE = '13512102876';

  /* ---------- booking: straight to the service on her Square site ----------
   * Square's per-service link is …/location/LR6ZD40XEYFP5?…&service_id=<ID>. The founder supplied
   * Brazilian Volume's ID (QD52BJNCKGB6SGPICOSCNDG5). Add the others here as they arrive; until a
   * service has an ID its buttons open her full Square service list instead of guessing. */
  var SQUARE_SERVICE = 'https://book.squareup.com/appointments/zdyq0s02f101ih/location/LR6ZD40XEYFP5?buttonTextColor=ffffff&color=000000&locale=en&referrer=so&service_id=';
  var SQUARE_ALL = 'https://squareup.com/appointments/book/LR6ZD40XEYFP5';
  var SERVICE_IDS = {
    classic: '', hybrid: '', brazilian: 'QD52BJNCKGB6SGPICOSCNDG5', russian: '',
    browdesign: '', henna: ''
  };
  function bookUrl(key) { return SERVICE_IDS[key] ? SQUARE_SERVICE + SERVICE_IDS[key] : SQUARE_ALL; }
  d.querySelectorAll('[data-book]').forEach(function (a) { a.href = bookUrl(a.getAttribute('data-book')); a.rel = 'external'; });
  var lang = function () { return root.getAttribute('data-lang') === 'pt' ? 'pt' : 'en'; };

  /* ---------- language ---------- */
  function setLang(l, save) {
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l === 'pt' ? 'pt-BR' : 'en');
    d.querySelectorAll('[data-setlang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-setlang') === l)); });
    d.querySelectorAll('[data-title-' + l + ']').forEach(function (e) { d.title = e.getAttribute('data-title-' + l); });
    d.querySelectorAll('[data-ph-' + l + ']').forEach(function (e) { e.setAttribute('placeholder', e.getAttribute('data-ph-' + l)); });
    d.querySelectorAll('[data-aria-' + l + ']').forEach(function (e) { e.setAttribute('aria-label', e.getAttribute('data-aria-' + l)); });
    if (save) { try { localStorage.setItem('ks-lang', l); } catch (e) {} }
    d.dispatchEvent(new CustomEvent('ks:lang'));
  }
  var saved = null; try { saved = localStorage.getItem('ks-lang'); } catch (e) {}
  setLang(saved === 'pt' ? 'pt' : 'en', false);
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-setlang]');
    if (b) setLang(b.getAttribute('data-setlang'), true);
  });

  /* ---------- lash geometry ---------- */
  function q(a, c, b, t) { return [(1-t)*(1-t)*a[0] + 2*(1-t)*t*c[0] + t*t*b[0], (1-t)*(1-t)*a[1] + 2*(1-t)*t*c[1] + t*t*b[1]]; }
  function dq(a, c, b, t) { return [2*(1-t)*(c[0]-a[0]) + 2*t*(b[0]-c[0]), 2*(1-t)*(c[1]-a[1]) + 2*t*(b[1]-c[1])]; }
  function strand(p, ang, len, curl) {
    var dx = Math.cos(ang), dy = Math.sin(ang), px = -dy, py = dx;
    var tx = p[0] + dx*len + px*len*curl, ty = p[1] + dy*len + py*len*curl;
    return 'M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + 'Q' + (p[0]+dx*len*.55).toFixed(1) + ' ' + (p[1]+dy*len*.55).toFixed(1) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1);
  }
  var LID = { a: [18, 64], c: [150, -32], b: [292, 52] };
  function lashPaths(style, lenScale) {
    var deg = function (x) { return x * Math.PI / 180; };
    var fan = function (k, s) { var o = []; for (var j = 0; j < k; j++) o.push(deg(-s/2 + s*j/(k-1))); return o; };
    var per = { classic: function () { return [0]; }, hybrid: function (i) { return i % 2 ? fan(3, 16) : [0]; },
                brazilian: function () { return fan(2, 12); }, russian: function () { return fan(5, 26); } }[style];
    var n = style === 'russian' || style === 'brazilian' ? 26 : 24, out = [];
    for (var i = 0; i < n; i++) {
      var t = .05 + .92 * i / (n - 1), p = q(LID.a, LID.c, LID.b, t), g = dq(LID.a, LID.c, LID.b, t);
      var ang = Math.atan2(-g[0], g[1]) + Math.PI + (t - .5) * .5;
      var L = (18 + 36 * Math.sin(Math.min(1, t * 1.15) * Math.PI * .62)) * (lenScale || 1);
      per(i).forEach(function (o) { out.push(strand(p, ang + o, L * (1 - Math.abs(o) * .9), .22)); });
    }
    return out;
  }
  var WEIGHT = { classic: 1.1, hybrid: .85, brazilian: .75, russian: .55 };
  /* Draw (or redraw) a lash map into an <svg data-eye>. */
  function drawEye(svg, style, lenScale) {
    var NS = 'http://www.w3.org/2000/svg';
    svg.setAttribute('viewBox', '0 0 310 125');
    var g = svg.querySelector('g.lashes');
    if (!g) {
      var lower = d.createElementNS(NS, 'path'); lower.setAttribute('class', 'eye-lower'); lower.setAttribute('d', 'M34 74Q150 116 278 62'); svg.appendChild(lower);
      g = d.createElementNS(NS, 'g'); g.setAttribute('class', 'lashes'); svg.appendChild(g);
      var lid = d.createElementNS(NS, 'path'); lid.setAttribute('class', 'eye-lid'); lid.setAttribute('d', 'M18 64Q150 -32 292 52'); svg.appendChild(lid);
    }
    g.innerHTML = '';
    g.style.setProperty('--w', WEIGHT[style]);
    lashPaths(style, lenScale).forEach(function (dd, i) {
      var p = d.createElementNS(NS, 'path'); p.setAttribute('d', dd); p.setAttribute('pathLength', '1'); p.style.setProperty('--k', i); g.appendChild(p);
    });
    svg.classList.remove('draw'); void svg.getBoundingClientRect(); svg.classList.add('draw');
  }
  d.querySelectorAll('svg[data-eye]').forEach(function (s) { drawEye(s, s.getAttribute('data-eye')); });

  /* ---------- set picker ---------- */
  function money(n) { return '$' + n; }
  function waLink(text) { return 'https://api.whatsapp.com/send?phone=' + WA_PHONE + '&text=' + encodeURIComponent(text); }
  d.querySelectorAll('[data-picker]').forEach(function (pk) {
    var state = { set: pk.getAttribute('data-start') || 'hybrid', vol: 'brazilian' };
    var eye = pk.querySelector('svg[data-pick-eye]');
    var key = function () { return state.set === 'volume' ? state.vol : state.set; };
    function render() {
      var k = key(), s = SETS[k], l = lang();
      pk.querySelectorAll('[data-pick-set]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pick-set') === state.set)); });
      pk.querySelectorAll('[data-pick-vol]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pick-vol') === state.vol)); });
      var volRow = pk.querySelector('[data-vol-row]'); if (volRow) volRow.hidden = state.set !== 'volume';
      var range = pk.querySelector('input[data-pick-scale]');
      if (range) range.value = String(['classic', 'hybrid', 'brazilian', 'russian'].indexOf(k));
      var o = function (n, v) { pk.querySelectorAll('[data-out="' + n + '"]').forEach(function (e) { e.textContent = v; }); };
      o('name', s[l]); o('alt', l === 'pt' ? s.en : s.pt); o('desc', l === 'pt' ? s.dpt : s.den);
      o('full', money(s.p[0])); o('fill2', money(s.p[1])); o('fill3', money(s.p[2]));
      var msg = l === 'pt' ? 'Olá Karolayne! Gostaria de agendar: ' + s.pt + ' (aplicação completa).' : 'Hi Karolayne! I’d like to book a full set: ' + s.en + '.';
      pk.querySelectorAll('[data-out-wa]').forEach(function (a) { a.href = waLink(msg); });
      pk.querySelectorAll('[data-out-book]').forEach(function (a) { a.href = bookUrl(k); });
      pk.querySelectorAll('[data-pick-img]').forEach(function (im) { im.classList.toggle('on', im.getAttribute('data-pick-img') === k); });
      if (eye) drawEye(eye, k);
    }
    pk.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pick-set],[data-pick-vol]'); if (!b) return;
      if (b.hasAttribute('data-pick-set')) state.set = b.getAttribute('data-pick-set'); else { state.set = 'volume'; state.vol = b.getAttribute('data-pick-vol'); }
      render();
    });
    var range = pk.querySelector('input[data-pick-scale]');
    if (range) range.addEventListener('input', function () {
      var k = ['classic', 'hybrid', 'brazilian', 'russian'][+range.value];
      if (k === 'classic' || k === 'hybrid') state.set = k; else { state.set = 'volume'; state.vol = k; }
      render();
    });
    d.addEventListener('ks:lang', render);
    render();
  });

  /* ---------- fill helper ---------- */
  d.querySelectorAll('[data-fill]').forEach(function (fl) {
    var sel = fl.querySelector('select'), rng = fl.querySelector('input[type=range]');
    function render() {
      var s = SETS[sel.value], days = +rng.value, l = lang(), out = fl.querySelector('[data-fill-out]'), dd = fl.querySelector('[data-fill-days]');
      dd.textContent = days;
      var label, price, note;
      if (days <= 15) { label = l === 'pt' ? 'Refil de 15 dias' : '2-week fill'; price = money(s.p[1]); note = l === 'pt' ? 'Até 15 dias desde a última aplicação.' : 'Up to 15 days since your last appointment.'; }
      else if (days <= 25) { label = l === 'pt' ? 'Refil de 16 a 25 dias' : 'Fill · 16–25 days'; price = money(s.p[2]); note = l === 'pt' ? 'Entre 16 e 25 dias desde a última aplicação.' : 'Between 16 and 25 days since your last appointment.'; }
      else { label = l === 'pt' ? 'Fale com a Karolayne' : 'Ask Karolayne'; price = ''; note = l === 'pt' ? 'A tabela dela lista refis até 25 dias. Depois disso, mande uma mensagem para saber se é refil ou aplicação completa.' : 'Her price list covers fills up to 25 days. After that, message her to check whether you need a fill or a new full set.'; }
      out.querySelector('[data-k=label]').textContent = label;
      out.querySelector('[data-k=price]').textContent = price;
      out.querySelector('[data-k=note]').textContent = note;
      out.querySelector('[data-k=set]').textContent = s[l];
    }
    sel.addEventListener('change', render); rng.addEventListener('input', render); d.addEventListener('ks:lang', render);
    render();
  });

  /* ---------- static WhatsApp links with a message ---------- */
  function waStatic() {
    d.querySelectorAll('[data-wa]').forEach(function (a) {
      a.href = waLink(lang() === 'pt' ? 'Olá Karolayne! Gostaria de agendar um horário.' : 'Hi Karolayne! I’d like to book an appointment.');
    });
  }
  waStatic(); d.addEventListener('ks:lang', waStatic);

  /* ---------- reveals ---------- */
  var rv = d.querySelectorAll('.rv');
  if (reduced || !('IntersectionObserver' in window)) rv.forEach(function (e) { e.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (e) { io.observe(e); });
  }

  /* ---------- header state ---------- */
  var hd = d.querySelector('[data-header]');
  if (hd) { var f = function () { hd.classList.toggle('is-scrolled', scrollY > 40); }; addEventListener('scroll', f, { passive: true }); f(); }

  /* ---------- small-screen menu ---------- */
  var mb = d.querySelector('[data-menu-btn]'), mn = d.querySelector('[data-menu]');
  if (mb && mn) {
    var set = function (o) { mn.classList.toggle('open', o); mb.setAttribute('aria-expanded', String(o)); root.classList.toggle('menu-open', o); };
    mb.addEventListener('click', function () { set(!mn.classList.contains('open')); });
    mn.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  }
})();
