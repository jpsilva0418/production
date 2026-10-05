/* JP SILVA MEDIA — Inquire
   Validation (inline on blur, summary on submit) · progressive disclosure · honest submission states.
   Transport: JPSM.inquiry 'api' → POST /api/inquire · 'artifact-db' → window.claude.use('db') or an honest fallback.
   Without this file the form still works: it opens an email to JP. */
(function () {
  'use strict';
  var d = document, w = window, JP = w.JP || {}, CFG = w.JPSM || {};
  var form = d.getElementById('inq-form');
  if (!form) return;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduced = !!JP.reduced || (w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var EMAIL = CFG.email || '';
  var renderedAt = Date.now();
  var MIN_FILL = 3200, TIMEOUT = 15000;
  var key = uuid();
  var sending = false;

  var all = $('#inq-all'), later = $('#inq-later'), summary = $('#inq-summary'), status = $('#inq-status');
  var btn = $('#inq-submit'), btnT = $('.bs-t', btn), errBox = $('#inq-error'), main = $('#inq-main');
  form.noValidate = true;
  form.setAttribute('novalidate', '');

  function uuid() {
    try { if (w.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    var b = new Uint8Array(16);
    try { crypto.getRandomValues(b); } catch (e) { for (var i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256); }
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }

  /* ---------- fields & rules (mirror lib/inquiry.mjs) ---------- */
  var LABEL = { name: 'Name', email: 'Email', phone: 'Phone', type: 'What are you looking for?', timeline: 'Desired date or timeline', date: 'Date',
    location: 'Location', message: 'Tell JP about the project', budget: 'Budget', reference: 'Reference link', social: 'Social or website',
    contactMethod: 'Preferred contact', heardFrom: 'How you heard about JP' };
  var ORDER = ['name', 'email', 'phone', 'type', 'timeline', 'date', 'location', 'message', 'budget', 'reference', 'social', 'contactMethod', 'heardFrom'];
  function val(name) {
    var el = form.elements[name]; if (!el) return '';
    if (el.length !== undefined && !el.tagName) { var r = $('input[name="' + name + '"]:checked', form); return r ? r.value : ''; }
    return String(el.value || '');
  }
  var line = function (s) { return s.replace(/\s+/g, ' ').trim(); };
  var count = function (s) { return Array.from ? Array.from(s).length : s.length; };
  function okUrl(s) {
    if (!/^[a-z][a-z0-9+.-]*:/i.test(s) && /^[\w-]+(\.[\w-]+)+/.test(s)) s = 'https://' + s;
    try { var u = new URL(s); return (u.protocol === 'http:' || u.protocol === 'https:') && u.hostname.indexOf('.') > 0; } catch (e) { return false; }
  }
  function rule(name) {
    var v = name === 'message' ? val(name).trim() : line(val(name));
    switch (name) {
      case 'name': return !v ? 'Add your name.' : v.length > 120 ? 'Keep the name under 120 characters.' : '';
      case 'email': return !v ? 'Add an email address so JP can reply.' : (v.length > 254 || !/^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[^\s@<>()[\],;:"]{2,}$/.test(v)) ? 'That email address does not look complete (name@example.com).' : '';
      case 'phone':
        if (!v) { var m = val('contactMethod'); return (m === 'Phone call' || m === 'Text') ? 'Add a phone number, or choose another way to reach you.' : ''; }
        return (v.length > 40 || !/^[0-9+().\-\s]+$/.test(v) || (v.match(/\d/g) || []).length < 7) ? 'Use digits and + ( ) - . only, or leave it empty.' : '';
      case 'type': return v ? '' : 'Choose what you are looking for.';
      case 'budget': return v ? '' : 'Choose a budget range, or “Not sure yet”.';
      case 'timeline': case 'location': return v.length > 200 ? 'Keep it under 200 characters.' : '';
      case 'date': return v && !/^\d{4}-\d{2}-\d{2}$/.test(v) ? 'Use a full date, or leave it empty.' : '';
      case 'message':
        var n = count(v);
        if (!n) return 'Tell JP a little about the project.';
        if (n < 20) return 'A little more, please: at least 20 characters.';
        if (n > 4000) return 'Keep it under 4000 characters.';
        if ((v.match(/\bhttps?:\/\/|\bwww\./gi) || []).length > 5) return 'Keep it to 5 links or fewer.';
        return '';
      case 'reference': case 'social': return v && (v.length > 300 || !okUrl(v)) ? 'Use a full web link (https://…), or leave it empty.' : '';
      default: return '';
    }
  }
  function target(name) { return name === 'type' || name === 'budget' ? $('#' + name + '-set') : form.elements[name]; }
  function focusTarget(name) {
    if (name === 'type' || name === 'budget') return $('input[name="' + name + '"]:checked', form) || $('input[name="' + name + '"]', form);
    return form.elements[name];
  }
  function show(name, msg) {
    var t = target(name), e = $('#' + name + '-err');
    if (!t || !e) return;
    if (msg) { t.setAttribute('aria-invalid', 'true'); e.textContent = msg; e.hidden = false; }
    else { t.removeAttribute('aria-invalid'); e.textContent = ''; e.hidden = true; }
    if ((name === 'reference' || name === 'social' || name === 'contactMethod' || name === 'heardFrom') && msg) $('#inq-more').open = true;
  }
  function check(name) { var m = rule(name); show(name, m); return m; }

  /* inline: on blur once the field has been touched; re-check while typing once it is invalid */
  var dirty = {};
  ['name', 'email', 'phone', 'timeline', 'location', 'message', 'reference', 'social', 'date'].forEach(function (n) {
    var el = form.elements[n]; if (!el) return;
    el.addEventListener('input', function () { dirty[n] = true; if (el.getAttribute('aria-invalid') === 'true') check(n); });
    el.addEventListener('blur', function () { if (dirty[n] || el.getAttribute('aria-invalid') === 'true') check(n); });
  });
  ['contactMethod', 'heardFrom'].forEach(function (n) {
    var el = form.elements[n]; if (el) el.addEventListener('change', function () { if (n === 'contactMethod' && (dirty.phone || $('#phone').getAttribute('aria-invalid'))) check('phone'); });
  });
  $$('input[name="type"],input[name="budget"]', form).forEach(function (r) { r.addEventListener('change', function () { show(r.name, ''); if (r.name === 'type') open(); }); });

  /* character count */
  var msg = form.elements.message, cnt = $('#message-count'), cntWrap = cnt && cnt.parentNode;
  function counter() {
    var n = count(msg.value.trim());
    cnt.textContent = n;
    cntWrap.classList.toggle('is-short', n > 0 && n < 20);
    cntWrap.classList.toggle('is-ok', n >= 20 && n <= 4000);
    cntWrap.classList.toggle('is-over', n > 4000);
  }
  if (msg && cnt) { msg.addEventListener('input', counter); counter(); }

  /* ---------- progressive disclosure (motion only: without it everything is simply there) ---------- */
  var wait = null;
  function open() {
    if (!later.classList.contains('is-waiting')) return;
    later.classList.remove('is-waiting'); later.removeAttribute('inert');
    if (wait && wait.parentNode) wait.parentNode.removeChild(wait);
  }
  if (!reduced && d.documentElement.classList.contains('js-anim') && !val('type')) {
    later.classList.add('is-waiting'); later.setAttribute('inert', '');
    wait = d.createElement('p'); wait.className = 'inq-wait mono';
    wait.innerHTML = '<i aria-hidden="true"></i>Choose one to continue · Details and budget follow';
    $('#ch-02 .ch-body').appendChild(wait);
    /* never leave the rest unreachable: a deep link or a pre-filled form opens it */
    if (location.hash && /^#(ch-0[34]|message|budget|timeline|location)/.test(location.hash)) open();
  }
  w.addEventListener('pageshow', function () { if (val('type')) open(); counter && msg && counter(); });

  /* ---------- summary ---------- */
  function validateAll() {
    var bad = [];
    ORDER.forEach(function (n) { var m = check(n); if (m) bad.push([n, m]); });
    return bad;
  }
  function showSummary(bad) {
    var ul = $('ul', summary); ul.innerHTML = '';
    bad.forEach(function (b) {
      var li = d.createElement('li'), a = d.createElement('a');
      a.href = '#' + (b[0] === 'type' || b[0] === 'budget' ? b[0] + '-set' : b[0]);
      a.innerHTML = '<span></span>'; a.firstChild.textContent = LABEL[b[0]] + ': ' + b[1];
      a.addEventListener('click', function (e) { e.preventDefault(); if (b[0] === 'type' || b[0] === 'budget') open(); var f = focusTarget(b[0]); if (f) { f.focus(); if (f.scrollIntoView) f.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }); } });
      li.appendChild(a); ul.appendChild(li);
    });
    $('[data-count]', summary).textContent = bad.length === 1 ? 'one thing' : bad.length + ' things';
    summary.hidden = false;
    summary.setAttribute('aria-labelledby', 'inq-summary-h');
    summary.focus();
    if (summary.scrollIntoView) summary.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
  }

  /* ---------- payload & plain text ---------- */
  function payload() {
    var p = {};
    ORDER.forEach(function (n) { p[n] = n === 'message' ? val(n).trim() : line(val(n)); });
    p.company = val('company'); p.renderedAt = renderedAt; p.key = key; p.source = CFG.inquiry === 'artifact-db' ? 'preview' : 'web';
    return p;
  }
  var ROWS = [['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['type', 'Looking for'], ['budget', 'Budget'], ['when', 'Date or timeline'], ['location', 'Location'],
    ['reference', 'Reference link'], ['social', 'Social / website'], ['contactMethod', 'Preferred contact'], ['heardFrom', 'Heard about JP']];
  function rows(p) {
    var q = {}; for (var k in p) q[k] = p[k];
    q.when = [p.date, p.timeline].filter(Boolean).join(' · ');
    return ROWS.filter(function (r) { return q[r[0]]; }).map(function (r) { return [r[1], q[r[0]]]; });
  }
  function plain(p) {
    return 'New project inquiry\n\n' + rows(p).map(function (r) { return r[0] + ': ' + r[1]; }).join('\n') + '\n\n' + (p.message || '') + '\n';
  }
  function mailHref(p) {
    var body = plain(p); if (body.length > 1800) body = body.slice(0, 1800) + '…';
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('New project inquiry' + (p.type ? ': ' + p.type : '')) + '&body=' + encodeURIComponent(body);
  }

  /* ---------- transports ---------- */
  function withTimeout(promise, ms) {
    return new Promise(function (res, rej) {
      var t = setTimeout(function () { var e = new Error('timeout'); e.kind = 'timeout'; rej(e); }, ms);
      promise.then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); });
    });
  }
  function viaApi(p) {
    var ctl = w.AbortController ? new AbortController() : null;
    var t = ctl ? setTimeout(function () { ctl.abort(); }, TIMEOUT) : 0;
    return fetch((CFG.base || '/') + 'api/inquire', {
      method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(p), credentials: 'same-origin', cache: 'no-store', signal: ctl ? ctl.signal : undefined
    }).then(function (r) {
      clearTimeout(t);
      return r.text().then(function (txt) {
        var j = null; try { j = JSON.parse(txt); } catch (e) {}
        if (r.ok && j && j.ok === true && j.id) return { kind: 'sent', id: j.id };
        var e = new Error('http'); e.kind = 'http'; e.status = r.status; e.body = j || {}; throw e;
      });
    }, function (err) {
      clearTimeout(t);
      var e = new Error('network'); e.kind = (err && err.name === 'AbortError') ? 'timeout' : 'network'; throw e;
    });
  }
  function viaDb(p) {
    var c = w.claude, got;
    try { got = c && typeof c.use === 'function' ? c.use('db') : null; } catch (e) { got = null; }
    return withTimeout(Promise.resolve(got), TIMEOUT).then(function (db) {
      if (!db) return { kind: 'offline' };
      var rec = {}; for (var k in p) if (k !== 'company') rec[k] = p[k];
      rec.createdAt = new Date().toISOString();
      return withTimeout(Promise.resolve(db.collection('inquiries').doc(key).set(rec)), TIMEOUT).then(function () {
        return { kind: 'sent', id: 'JPS-' + rec.createdAt.slice(2, 10).replace(/-/g, '') + '-' + key.replace(/-/g, '').slice(0, 6).toUpperCase() };
      }, function (err) { var e = new Error('db'); e.kind = err && err.kind === 'timeout' ? 'timeout' : 'db'; throw e; });
    });
  }

  /* ---------- states ---------- */
  function setSending(on) {
    sending = on;
    form.classList.toggle('is-sending', on);
    form.setAttribute('aria-busy', on ? 'true' : 'false');
    all.disabled = on;
    btnT.textContent = on ? 'Sending' : 'Send inquiry';
    if (on) status.textContent = 'Sending your inquiry.';
  }
  function reason(e) {
    if (e.kind === 'timeout') return 'The connection timed out after 15 seconds, so it may not have arrived. Trying again is safe: it will not be sent twice.';
    if (e.kind === 'network') return 'The connection dropped before the inquiry reached the server. Check your signal and try again.';
    if (e.kind === 'db') return 'The preview could not save it just now.';
    var s = e.status, code = (e.body && e.body.error) || '';
    if (s === 429) return 'Too many attempts from this connection in a few minutes. Wait a little, or email JP directly.';
    if (s === 503 || code === 'storage_unconfigured') return 'Online inquiries are not switched on yet on this server (error 503).';
    if (s === 413) return 'The inquiry is too long to send in one go (error 413). Shorten the message a little.';
    if (code === 'too_fast') return 'That went out faster than a person types. Wait a second and try again.';
    if (s >= 500) return 'The server had a problem saving it (error ' + s + ').';
    return 'The server turned it down (error ' + (s || 'unknown') + (code ? ', ' + code : '') + ').';
  }
  function fail(e, p) {
    setSending(false);
    /* field errors from the server go back to the fields */
    if (e.kind === 'http' && e.status === 422 && e.body && e.body.fields) {
      var bad = [];
      ORDER.forEach(function (n) { if (e.body.fields[n]) { show(n, e.body.fields[n]); bad.push([n, e.body.fields[n]]); } });
      if (bad.length) { status.textContent = 'Some fields need attention.'; showSummary(bad); return; }
    }
    $('#inq-error-why').textContent = reason(e);
    $('#inq-error-text').value = plain(p);
    $('#inq-mail').href = mailHref(p);
    $('.ia-copied', errBox).textContent = '';
    errBox.hidden = false;
    status.textContent = 'Not sent. ' + reason(e);
    errBox.focus();
    if (errBox.scrollIntoView) errBox.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
  }
  function tc(ms) {
    var f = Math.floor(ms / 40), p = function (n) { return (n < 10 ? '0' : '') + n; };
    return p(Math.floor(f / 90000) % 24) + ':' + p(Math.floor(f / 1500) % 60) + ':' + p(Math.floor(f / 25) % 60) + ':' + p(f % 25);
  }
  function swap(tplId, fill) {
    var tpl = $('#' + tplId), node = d.importNode(tpl.content, true).firstElementChild;
    fill(node);
    form.hidden = true;
    main.insertBefore(node, form);
    if (JP.reveal) JP.reveal(node);
    var top = node.getBoundingClientRect().top + (w.pageYOffset || 0) - (parseInt(getComputedStyle(d.documentElement).scrollPaddingTop, 10) || 70) - 24;
    w.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
    node.focus({ preventScroll: true });
    return node;
  }
  function success(id, p) {
    setSending(false);
    swap('inq-end-t', function (n) {
      $('[data-id]', n).textContent = id;
      $('[data-tc]', n).textContent = tc(Date.now() - renderedAt);
      var dl = $('[data-sum]', n);
      rows(p).concat([['Message', p.message]]).forEach(function (r) {
        var row = d.createElement('div'), dt = d.createElement('dt'), dd = d.createElement('dd');
        dt.textContent = r[0]; dd.textContent = r[1]; row.appendChild(dt); row.appendChild(dd); dl.appendChild(row);
      });
    });
    main.classList.add('is-done');
    status.textContent = 'Sent. Your project is in. Reference ' + id + '.';
    try { history.replaceState(null, '', location.pathname + '#sent'); } catch (e) {}
  }
  function offline(p) {
    setSending(false);
    var node = swap('inq-off-t', function (n) {
      $('textarea', n).value = plain(p);
      $('[data-mail]', n).href = mailHref(p);
    });
    status.textContent = 'Not sent. Online inquiries open when the site goes live. Email JP instead.';
    $('[data-back]', node).addEventListener('click', function () {
      node.parentNode.removeChild(node); form.hidden = false;
      btn.focus();
    });
  }

  /* copy-to-clipboard (inside the click), select-all fallback */
  d.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-copy]') : null; if (!b) return;
    var ta = $(b.getAttribute('data-copy')), out = b.parentNode.querySelector('.ia-copied');
    function fallback() {
      ta.focus(); ta.select(); try { ta.setSelectionRange(0, ta.value.length); } catch (x) {}
      var ok = false; try { ok = d.execCommand('copy'); } catch (x) {}
      out.textContent = ok ? 'Copied. Paste it into an email to ' + EMAIL + '.' : 'Selected. Copy it, then paste it into an email to ' + EMAIL + '.';
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ta.value).then(function () { out.textContent = 'Copied. Paste it into an email to ' + EMAIL + '.'; }, fallback);
    } else fallback();
  });

  /* ---------- submit ---------- */
  function submit(e) {
    if (e) e.preventDefault();
    if (sending) return;
    errBox.hidden = true;
    var bad = validateAll();
    if (bad.length) {
      if (bad.some(function (b) { return b[0] === 'type'; })) open();
      status.textContent = bad.length + (bad.length === 1 ? ' field needs' : ' fields need') + ' attention.';
      showSummary(bad); return;
    }
    summary.hidden = true;
    var p = payload();
    setSending(true);
    var gap = Math.max(0, renderedAt + MIN_FILL - Date.now());
    new Promise(function (r) { setTimeout(r, gap); }).then(function () {
      return CFG.inquiry === 'artifact-db' ? viaDb(p) : viaApi(p);
    }).then(function (r) {
      if (r.kind === 'sent') success(r.id, p); else offline(p);
    }, function (err) { fail(err, p); });
  }
  form.addEventListener('submit', submit);
  $('#inq-retry').addEventListener('click', function () { submit(); });
})();
