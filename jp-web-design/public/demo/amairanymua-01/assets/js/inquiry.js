/* /demo/amairanymua-01 — the shared bridal inquiry's behaviour (all three sites).

   Markup: scripts/amairanymua-01/inquiry-core.mjs. Structure CSS: assets/css/inquiry-core.css.
   Each site skins it with CSS alone (SKINNING.md). Ported from the Sass by Kass inquiry and kept to
   its behaviour contract:
     · every control that is not the step action is type="button"; Enter in a single-line field moves
       forward and never submits or leaves the page;
     · Continue validates the current step: a failed step stays put, shows its messages and focuses
       the first invalid field; errors appear on blur and clear while typing, and a blur caused by a
       tap waits until that tap has landed (a layout shift under the finger swallows the tap);
     · after Continue, Back or Edit the new step's top is scrolled to --cf-scroll-offset below the top
       of the viewport (the site sets it; default 88px) and its legend is focused;
     · answers persist in sessionStorage under 'am01-bridal-inquiry-v1' (shared by the three sites)
       across reloads and through the hand-off, until Start over;
     · the form stays visibility:hidden until state is restored and rendered (.ready).

   DEMO MODE IS ABSOLUTE: the submit handler only prevents the default and moves between steps.
   Nothing here makes a request of any kind, and the hand-off is a plain link in the markup. */
(function () {
  'use strict';

  var form = document.getElementById('cfForm');
  var dataEl = document.getElementById('cfData');
  if (!form || !dataEl) return;

  var cfg;
  try { cfg = JSON.parse(dataEl.textContent || '{}'); } catch (e) { return; }
  if (!cfg || !cfg.steps || !cfg.fields) return;

  var KEY = 'am01-bridal-inquiry-v1';
  var $ = function (id) { return document.getElementById(id); };
  var root = $('cfInquiry') || form.parentNode;
  var progEl = $('cfProg');
  var reviewEl = $('cfReview');
  var backBtn = $('cfBack');
  var nextBtn = $('cfNext');
  var resetBtn = $('cfReset');
  var handoff = $('cfHandoff');
  var handoffHead = $('cfHandoffHead');
  var copyBtn = $('cfCopy');
  var backToAnswers = $('cfBackToAnswers');
  var statusEl = $('cfCopyStatus');
  var copyText = $('cfCopyText');

  /* steps and questions come from the page (written once, in inquiry-core.mjs) */
  var STEPS = cfg.steps.map(function (s) { return s.key; });
  var LABELS = {};
  cfg.steps.forEach(function (s) { LABELS[s.key] = s.label; });
  var FIELDS = cfg.fields.map(function (f) { return { name: f[0], step: f[1], label: f[2], kind: f[3] || '' }; });
  var NAMES = FIELDS.map(function (f) { return f.name; });

  var stepEls = {};
  Array.prototype.forEach.call(form.querySelectorAll('fieldset[data-step]'), function (el) { stepEls[el.getAttribute('data-step')] = el; });
  if (STEPS.some(function (k) { return !stepEls[k]; })) return;

  var answers = {};
  NAMES.forEach(function (n) { answers[n] = ''; });
  var step = 0;
  var view = 'form';
  var reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- persistence (this browser tab only) ---------- */
  function save() {
    try { sessionStorage.setItem(KEY, JSON.stringify({ answers: answers, step: step, view: view })); } catch (e) { /* storage blocked: the form still works */ }
  }
  function clearSaved() { try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ } }
  function controls(name) { return form.querySelectorAll('[name="' + name + '"]'); }
  function writeControls() {
    NAMES.forEach(function (n) {
      Array.prototype.forEach.call(controls(n), function (el) {
        if (el.type === 'radio' || el.type === 'checkbox') el.checked = answers[n] !== '' && answers[n] === el.value;
        else el.value = answers[n];
      });
    });
  }
  function restore() {
    var raw = null;
    try { raw = sessionStorage.getItem(KEY); } catch (e) { return; }
    if (!raw) return;
    try {
      var s = JSON.parse(raw);
      if (s && s.answers) NAMES.forEach(function (n) { if (typeof s.answers[n] === 'string') answers[n] = s.answers[n]; });
      step = Math.min(Math.max(0, (s && s.step) | 0), STEPS.length - 1);
      view = s && s.view === 'handoff' ? 'handoff' : 'form';
    } catch (e) { return; }
    writeControls();
  }
  function hasAnswer() { return NAMES.some(function (n) { return answers[n] !== ''; }); }

  /* ---------- validation ---------- */
  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); };
  var phoneOk = function (v) { return !v.trim() || v.replace(/\D/g, '').length >= 7; };
  /* field -> [its step, test]; a field missing from the page is skipped */
  var RULES = {
    fullName: ['contact', function (v) { return !!v.trim(); }],
    email: ['contact', emailOk],
    phone: ['contact', phoneOk]
  };
  var RULE_ORDER = ['fullName', 'email', 'phone'];
  function inputOf(name) { return $('cf-' + name); }
  function errOf(name) { return $('cf-' + name + '-err'); }
  function setError(name, on) {
    var input = inputOf(name), err = errOf(name);
    if (err) err.hidden = !on;
    if (input) { if (on) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
  }
  function clearErrors() {
    RULE_ORDER.forEach(function (n) { setError(n, false); });
    Array.prototype.forEach.call(form.querySelectorAll('[data-invalid]'), function (el) { el.removeAttribute('data-invalid'); });
  }
  /** the invalid fields of a step, in visual order */
  function invalid(key) {
    return RULE_ORDER.filter(function (n) { return RULES[n][0] === key && inputOf(n) && !RULES[n][1](answers[n]); });
  }

  /* ---------- scrolling: a step's top rests --cf-scroll-offset below the viewport's top ---------- */
  function offset() {
    try {
      var cs = getComputedStyle(form);
      var raw = cs.getPropertyValue('--cf-scroll-offset').trim();
      if (/^-?\d*\.?\d+px$/.test(raw)) return parseFloat(raw);
      /* any other length: core CSS applies it as scroll-margin-top, which the browser resolves to px */
      var resolved = parseFloat(cs.scrollMarginTop);
      if (raw && isFinite(resolved)) return resolved;
    } catch (e) { /* fall through */ }
    return 88;
  }
  function scrollToEl(el) {
    if (!el || !el.getBoundingClientRect) return;
    var y = Math.max(0, el.getBoundingClientRect().top + (window.pageYOffset || 0) - offset());
    try { window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, y); }
  }
  function focusQuiet(el) {
    if (!el) return;
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  }
  var raf = window.requestAnimationFrame ? function (f) { window.requestAnimationFrame(f); } : function (f) { setTimeout(f, 16); };

  /* ---------- formatting for the review and the copied summary ---------- */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function fmtDate(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (!m) return v;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    if (isNaN(d.getTime())) return v;
    return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function fmtTime(v) {
    var m = /^(\d{2}):(\d{2})/.exec(v);
    if (!m) return v;
    var h = +m[1];
    return (h % 12 || 12) + ':' + m[2] + ' ' + (h < 12 ? 'AM' : 'PM');
  }
  function shown(f) {
    var v = answers[f.name].trim();
    if (!v) return '';
    if (f.kind === 'date') return fmtDate(v);
    if (f.kind === 'time') return fmtTime(v);
    return v;
  }
  /* each step's questions, in the order they appear on the page */
  function fieldsOf(key) {
    var inStep = FIELDS.filter(function (f) { return f.step === key; });
    var order = [];
    Array.prototype.forEach.call(stepEls[key].querySelectorAll('[name]'), function (el) { if (order.indexOf(el.name) < 0) order.push(el.name); });
    return inStep.slice().sort(function (a, b) { return order.indexOf(a.name) - order.indexOf(b.name); });
  }

  /* ---------- rendering ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function renderProgress() {
    if (!progEl) return;
    progEl.textContent = '';
    STEPS.forEach(function (key, i) {
      var li = el('li', i < step ? 'done' : i === step ? 'now' : '');
      li.setAttribute('data-step', key);
      li.setAttribute('data-n', String(i + 1));
      if (i === step) li.setAttribute('aria-current', 'step');
      li.appendChild(el('span', 'cf-prog-bar'));
      var lbl = el('span', 'cf-prog-lbl', LABELS[key]);
      lbl.setAttribute('aria-hidden', 'true');
      li.appendChild(lbl);
      li.appendChild(el('span', 'cf-sr', 'Step ' + (i + 1) + ' of ' + STEPS.length + ': ' + LABELS[key] + (i === step ? ' (current)' : '')));
      progEl.appendChild(li);
    });
  }
  function renderReview() {
    if (!reviewEl) return;
    reviewEl.textContent = '';
    STEPS.forEach(function (key, i) {
      var fields = fieldsOf(key);
      if (!fields.length) return;
      var group = el('div', 'cf-rev-group');
      group.setAttribute('data-step', key);
      var head = el('div', 'cf-rev-head');
      head.appendChild(el('h3', 'cf-rev-title', LABELS[key]));
      var edit = el('button', 'cf-rev-edit', 'Edit');
      edit.type = 'button';
      edit.setAttribute('aria-label', 'Edit ' + LABELS[key].toLowerCase());
      edit.addEventListener('click', function () { go(i); });
      head.appendChild(edit);
      group.appendChild(head);
      var rows = fields.filter(function (f) { return shown(f); });
      if (!rows.length) group.appendChild(el('p', 'cf-rev-none', 'Nothing added'));
      else {
        var dl = el('dl', 'cf-rev-list');
        rows.forEach(function (f) {
          var row = el('div', 'cf-rev-row');
          row.appendChild(el('dt', 'cf-rev-q', f.label));
          row.appendChild(el('dd', 'cf-rev-a', shown(f)));
          dl.appendChild(row);
        });
        group.appendChild(dl);
      }
      reviewEl.appendChild(group);
    });
  }
  function render() {
    var key = STEPS[step];
    STEPS.forEach(function (k) { stepEls[k].hidden = k !== key; });
    renderProgress();
    if (key === 'review') renderReview();
    if (backBtn) backBtn.hidden = step === 0;
    if (nextBtn) nextBtn.textContent = 'Continue';
    if (resetBtn) resetBtn.hidden = !hasAnswer();
    form.hidden = view !== 'form';
    if (handoff) handoff.hidden = view !== 'handoff';
    if (root && root.setAttribute) root.setAttribute('data-view', view);
  }
  /** move to a step: render, then bring its top into view and focus its legend */
  function go(n) {
    step = Math.max(0, Math.min(STEPS.length - 1, n));
    view = 'form';
    clearErrors();
    render();
    save();
    var fs = stepEls[STEPS[step]];
    raf(function () { scrollToEl(fs); focusQuiet(fs.querySelector('legend')); });
  }
  function showHandoff() {
    if (!handoff) return;
    view = 'handoff';
    setStatus('');
    if (copyText) copyText.hidden = true;
    render();
    save();
    raf(function () { scrollToEl(handoff); focusQuiet(handoffHead); });
  }

  /* ---------- input ---------- */
  function read(t) {
    var name = t.name;
    if (NAMES.indexOf(name) < 0) return;
    if (t.type === 'checkbox') answers[name] = t.checked ? t.value : '';
    else if (t.type === 'radio') { if (t.checked) answers[name] = t.value; }
    else answers[name] = t.value;
    /* the date and "Date not set yet" clear each other */
    if (name === 'dateUnknown' && answers.dateUnknown) {
      answers.weddingDate = '';
      var d = inputOf('weddingDate'); if (d) d.value = '';
    }
    if (name === 'weddingDate' && answers.weddingDate) {
      answers.dateUnknown = '';
      Array.prototype.forEach.call(controls('dateUnknown'), function (c) { c.checked = false; });
    }
    if (resetBtn) resetBtn.hidden = !hasAnswer();
    save();
  }
  form.addEventListener('input', function (e) { read(e.target); });
  /* some browsers report radios, checkboxes and date pickers only through change */
  form.addEventListener('change', function (e) {
    read(e.target);
    var field = e.target.closest ? e.target.closest('[data-invalid]') : null;
    if (field) field.removeAttribute('data-invalid');
  });

  /* Errors appear on blur and clear while typing. A blur caused by pressing something (a tap on
     Continue or Back) is held until that press has finished, so nothing moves under the finger. */
  var pointerDown = false;
  var lastUp = 0;
  var now = function () { return new Date().getTime(); };
  function runBlur(name) {
    var rule = RULES[name];
    if (!rule || STEPS[step] !== rule[0] || view !== 'form') return;
    if (answers[name] && !rule[1](answers[name])) setError(name, true);
  }
  /* On a touch screen focus moves with the tap's synthesized click, after pointerup; with a mouse
     it moves on press. Either way, wait for that click (or a short while) before showing anything. */
  function deferBlur(name) {
    var done = false;
    function fire() {
      if (done) return;
      done = true;
      document.removeEventListener('click', fire, true);
      setTimeout(function () { if (pointerDown) deferBlur(name); else runBlur(name); }, 0);
    }
    document.addEventListener('click', fire, true);
    setTimeout(fire, 700);
  }
  document.addEventListener('pointerdown', function () { pointerDown = true; }, true);
  function release() { pointerDown = false; lastUp = now(); }
  document.addEventListener('pointerup', release, true);
  document.addEventListener('pointercancel', release, true);
  RULE_ORDER.forEach(function (name) {
    var input = inputOf(name);
    if (!input) return;
    input.addEventListener('blur', function () {
      if (pointerDown || now() - lastUp < 700) deferBlur(name);
      else runBlur(name);
    });
    input.addEventListener('input', function () {
      var err = errOf(name);
      if (err && !err.hidden && RULES[name][1](answers[name])) setError(name, false);
    });
  });

  /* Enter in a single-line field moves forward through the step instead of submitting the page */
  form.addEventListener('keydown', function (e) {
    var t = e.target;
    if (e.key === 'Enter' && t && t.tagName === 'INPUT' && t.type !== 'checkbox' && t.type !== 'radio') {
      e.preventDefault();
      if (nextBtn) nextBtn.click();
    }
  });

  if (backBtn) backBtn.addEventListener('click', function () { if (step > 0) go(step - 1); });
  if (resetBtn) resetBtn.addEventListener('click', function () {
    form.reset();
    NAMES.forEach(function (n) { answers[n] = ''; });
    clearSaved();
    go(0);
    clearSaved();
  });

  /* the only submit: preventDefault, then validate and move. Nothing is ever sent. */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var key = STEPS[step];
    var bad = invalid(key);
    if (bad.length) {
      clearErrors();
      bad.forEach(function (n) { setError(n, true); });
      var first = inputOf(bad[0]);
      raf(function () {
        scrollToEl((first.closest && first.closest('.cf-field')) || first);
        focusQuiet(first);
      });
      return;
    }
    if (key !== 'review') { go(step + 1); return; }
    showHandoff();
  });

  if (backToAnswers) backToAnswers.addEventListener('click', function () { go(STEPS.length - 1); });

  /* ---------- Copy my answers ---------- */
  /** Plain text in the order her own form asks (cfg.fields), grouped under each step's name. */
  function summary() {
    var lines = [cfg.title || 'Bridal inquiry', ''];
    var groups = [];
    FIELDS.forEach(function (f) { if (groups.indexOf(f.step) < 0) groups.push(f.step); });
    groups.forEach(function (key) {
      var rows = FIELDS.filter(function (f) { return f.step === key && shown(f); });
      if (!rows.length) return;
      lines.push(String(LABELS[key] || key).toUpperCase());
      rows.forEach(function (f) { lines.push(f.label + ': ' + shown(f)); });
      lines.push('');
    });
    return lines.join('\n').trim();
  }
  var statusTimer = 0;
  function setStatus(text, ms) {
    if (!statusEl) return;
    clearTimeout(statusTimer);
    statusEl.textContent = text;
    if (ms) statusTimer = setTimeout(function () { statusEl.textContent = ''; }, ms);
  }
  function copied() {
    if (copyText) copyText.hidden = true;
    setStatus('Copied', 2500);
  }
  /* second try: a temporary selected textarea and the old copy command */
  function execCopy(text) {
    var ok = false;
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.setAttribute('aria-hidden', 'true');
    ta.setAttribute('tabindex', '-1');
    ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;font-size:16px;';
    (handoff || document.body).appendChild(ta);
    try {
      ta.select();
      ta.setSelectionRange(0, text.length);
      ok = !!document.execCommand('copy');
    } catch (e) { ok = false; }
    if (ta.parentNode) ta.parentNode.removeChild(ta);
    focusQuiet(copyBtn);
    return ok;
  }
  /* last resort: show the text, selected, and say how to copy it */
  function manualCopy(text) {
    if (!copyText) { setStatus('Your answers could not be copied here.'); return; }
    copyText.value = text;
    copyText.hidden = false;
    focusQuiet(copyText);
    try { copyText.select(); copyText.setSelectionRange(0, text.length); } catch (e) { /* ignore */ }
    var touch = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
    setStatus(touch ? 'Your answers are selected below. Touch and hold them, then choose Copy.' : 'Press Ctrl or Cmd + C to copy');
  }
  function fallback(text) {
    if (execCopy(text)) copied();
    else manualCopy(text);
  }
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var text = summary();
    var p = null;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') p = navigator.clipboard.writeText(text);
    } catch (e) { p = null; }
    if (p && typeof p.then === 'function') p.then(copied, function () { fallback(text); });
    else fallback(text);
  });

  /* ---------- start ---------- */
  restore();
  render();
  form.classList.add('ready');
})();
