#!/usr/bin/env node
/* Inquiry tests: unit (validate, spam, idempotency, file storage) · HTTP end-to-end against a server this script starts
   (scripts/serve.mjs --port=8790, INQUIRY_DATA_DIR = temp dir) · browser e2e on /inquire (Playwright, if installed).
     node scripts/test-inquiry.mjs [--port=8790] [--no-browser] [--preview-port=8797] [--shots=<dir>]
   The browser preview tests need a preview build in .preview/ (node build.mjs --target=preview --out=.preview). Exit 1 on failure. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validate, spam, fileStorage, handleInquiry, makeId, notify, storageFromEnv } from '../lib/inquiry.mjs';
import { site } from '../src/data/site.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const PORT = Number(arg('port', 8790)), PPORT = Number(arg('preview-port', 8797));
const SHOTS = arg('shots', '');
const results = [];
async function test(name, fn) {
  try { await fn(); results.push([name, true]); console.log('  ok   ' + name); }
  catch (e) { results.push([name, false, e.message]); console.log('  FAIL ' + name + '\n       ' + (e.stack || e.message).split('\n').slice(0, 3).join('\n       ')); }
}
const tmp = p => fs.mkdtempSync(path.join(os.tmpdir(), p));
const quiet = { info() {}, warn() {}, error() {} };
const listFiles = dir => { const out = []; const walk = d => { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); e.isDirectory() ? walk(f) : out.push(f); } }; walk(dir); return out; };
const records = dir => listFiles(path.join(dir, 'inquiries')).filter(f => !f.includes(`${path.sep}_keys${path.sep}`));
const NOW = Date.UTC(2026, 9, 4, 18, 0, 0);
const good = (o = {}) => ({ name: 'Ana Reyes', email: 'ana@example.com', phone: '', type: site.inquiry.types[0], budget: site.inquiry.budgets[2],
  timeline: 'Late November', date: '', location: 'East Austin', message: 'A performance video for a new single, one location, one day.',
  reference: '', social: '', contactMethod: '', heardFrom: '', company: '', renderedAt: NOW - 60000, key: 'k-' + Math.random().toString(36).slice(2, 12), ...o });

console.log('unit');
await test('validate: a complete inquiry passes and is cleaned', () => {
  const v = validate(good({ name: '  Ana   Reyes ', email: ' ANA@Example.com ', social: 'instagram.com/ana' }));
  assert.equal(v.ok, true, JSON.stringify(v.errors));
  assert.equal(v.clean.name, 'Ana Reyes'); assert.equal(v.clean.email, 'ana@example.com'); assert.equal(v.clean.social, 'https://instagram.com/ana');
});
await test('validate: required fields and enums', () => {
  const v = validate({});
  for (const f of ['name', 'email', 'type', 'budget', 'message']) assert.ok(v.errors[f], f);
  const w = validate(good({ type: 'Wedding', budget: '$1', contactMethod: 'Fax', heardFrom: 'TV' }));
  for (const f of ['type', 'budget', 'contactMethod', 'heardFrom']) assert.ok(w.errors[f], f);
});
await test('validate: limits and formats', () => {
  const v = validate(good({ name: 'x'.repeat(121), email: 'a@b', phone: '12ab', message: 'too short', reference: 'javascript:alert(1)', social: 'ftp://x.com', timeline: 'x'.repeat(201), location: 'y'.repeat(201), date: '2026-13' }));
  for (const f of ['name', 'email', 'phone', 'message', 'reference', 'social', 'timeline', 'location', 'date']) assert.ok(v.errors[f], f);
  assert.ok(validate(good({ message: 'x'.repeat(4001) })).errors.message);
  assert.ok(validate(good({ email: 'a'.repeat(250) + '@b.co' })).errors.email);
  assert.ok(validate(good({ reference: 'https://x.com/' + 'a'.repeat(300) })).errors.reference);
  assert.equal(validate(good({ phone: '+1 (512) 555-0100' })).ok, true);
  assert.ok(validate(good({ contactMethod: 'Text' })).errors.phone, 'text needs a phone');
});
await test('spam: honeypot drops, too fast, too many links', () => {
  assert.deepEqual(spam(good({ company: 'Acme' }), NOW), { drop: true });
  assert.equal(spam(good({ renderedAt: NOW - 1000 }), NOW).error, 'too_fast');
  assert.equal(spam(good({ message: 'see http://a.co http://b.co http://c.co http://d.co http://e.co www.f.co' }), NOW).error, 'spam');
  assert.equal(spam(good({ message: 'see http://a.co http://b.co http://c.co http://d.co http://e.co ok ok ok' }), NOW), null);
  assert.equal(spam(good({ renderedAt: undefined }), NOW).error, 'bad_request');
});
await test('file storage + idempotency: same key → same id, one file', async () => {
  const dir = tmp('inq-unit-'), storage = fileStorage(dir), g = good();
  const a = await handleInquiry(g, { storage, now: NOW, log: quiet, env: {} });
  const b = await handleInquiry({ ...g, message: g.message + ' (retry)' }, { storage, now: NOW + 5000, log: quiet, env: {} });
  const c = await handleInquiry(g, { storage: fileStorage(dir), now: NOW + 9000, log: quiet, env: {} }); // new instance: storage, not memory
  assert.equal(a.status, 200); assert.equal(a.body.id, makeId(g.key, new Date(NOW)));
  assert.equal(b.body.id, a.body.id); assert.equal(c.body.id, a.body.id);
  const files = records(dir); assert.equal(files.length, 1);
  assert.match(path.relative(dir, files[0]).split(path.sep).join('/'), /^inquiries\/2026-10\/2026-10-04T18-00-00-000Z-k-[a-z0-9]+\.json$/);
  const rec = JSON.parse(fs.readFileSync(files[0], 'utf8')); assert.equal(rec.email, 'ana@example.com'); assert.equal(rec.company, undefined);
});
await test('handle: honeypot ok:true without storing; no storage → 503', async () => {
  const dir = tmp('inq-unit-');
  const h = await handleInquiry(good({ company: 'x' }), { storage: fileStorage(dir), now: NOW, log: quiet });
  assert.equal(h.status, 200); assert.equal(h.body.ok, true); assert.equal(records(dir).length, 0);
  const n = await handleInquiry(good(), { storage: null, now: NOW, log: quiet });
  assert.equal(n.status, 503); assert.equal(n.body.error, 'storage_unconfigured');
  assert.equal(storageFromEnv({}), null); assert.equal(storageFromEnv({ INQUIRY_STORAGE: 'file', INQUIRY_DATA_DIR: dir }).kind, 'file');
  assert.equal(storageFromEnv({ BLOB_READ_WRITE_TOKEN: 't' }).kind, 'blob');
});
await test('notify: only when configured; a failing provider never throws', async () => {
  assert.equal((await notify({ ...good(), id: 'X' }, {})).sent, false);
  let called = null;
  const r = await notify({ ...good(), id: 'X' }, { RESEND_API_KEY: 'k', INQUIRY_NOTIFY_TO: 'jp@example.com' }, async (u, o) => { called = [u, JSON.parse(o.body)]; return { ok: true, status: 200 }; });
  assert.equal(r.sent, true); assert.equal(called[0], 'https://api.resend.com/emails'); assert.match(called[1].text, /Ana Reyes/);
  const bad = await notify({ ...good(), id: 'X' }, { RESEND_API_KEY: 'k', INQUIRY_NOTIFY_TO: 'a@b.co' }, async () => { throw new Error('down'); });
  assert.equal(bad.sent, false);
  const dir = tmp('inq-unit-');
  const h = await handleInquiry(good(), { storage: fileStorage(dir), now: NOW, log: quiet, env: { RESEND_API_KEY: 'k', INQUIRY_NOTIFY_TO: 'a@b.co' }, fetchImpl: async () => { throw new Error('down'); } });
  assert.equal(h.status, 200); assert.equal(records(dir).length, 1);
});

/* ---------------- HTTP end-to-end ---------------- */
console.log('http');
const DATA = tmp('inq-http-');
fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const srv = spawn(process.execPath, ['scripts/serve.mjs', `--port=${PORT}`], { cwd: ROOT, env: { ...process.env, INQUIRY_STORAGE: 'file', INQUIRY_DATA_DIR: DATA }, stdio: ['ignore', 'pipe', 'pipe'] });
let srvLog = ''; srv.stdout.on('data', c => srvLog += c); srv.stderr.on('data', c => srvLog += c);
const BASE = `http://127.0.0.1:${PORT}`;
for (let i = 0; i < 50; i++) { try { await fetch(BASE + '/robots.txt'); break; } catch (e) { await new Promise(r => setTimeout(r, 100)); } }
let ipN = 0;
const post = (body, { ip = `10.0.0.${++ipN}`, type = 'application/json', headers = {} } = {}) =>
  fetch(BASE + '/api/inquire', { method: 'POST', headers: { 'content-type': type, 'x-forwarded-for': ip, ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) })
    .then(async r => ({ status: r.status, headers: r.headers, body: await r.json().catch(() => null) }));
const fresh = o => good({ renderedAt: Date.now() - 30000, ...o });
try {
  await test('valid → 200 {ok,id} + file written, no-store', async () => {
    const g = fresh(), r = await post(g);
    assert.equal(r.status, 200); assert.equal(r.body.ok, true); assert.match(r.body.id, /^JPS-\d{6}-[0-9A-F]{6}$/);
    assert.equal(r.headers.get('cache-control'), 'no-store');
    const f = records(DATA).filter(x => x.endsWith(g.key + '.json')); assert.equal(f.length, 1);
  });
  await test('invalid → 422 with field errors', async () => {
    const r = await post(fresh({ email: 'nope', message: 'short', type: '' }));
    assert.equal(r.status, 422); assert.equal(r.body.error, 'validation');
    for (const f of ['email', 'message', 'type']) assert.ok(r.body.fields[f], f);
  });
  await test('honeypot → 200, no file', async () => {
    const before = records(DATA).length, g = fresh({ company: 'Acme SEO' }), r = await post(g);
    assert.equal(r.status, 200); assert.equal(r.body.ok, true); assert.equal(records(DATA).length, before);
  });
  await test('too fast → 422 too_fast', async () => { const r = await post(fresh({ renderedAt: Date.now() - 500 })); assert.equal(r.status, 422); assert.equal(r.body.error, 'too_fast'); });
  await test('too many links → 422 spam', async () => { const r = await post(fresh({ message: 'http://a.co http://b.co http://c.co http://d.co http://e.co http://f.co' })); assert.equal(r.status, 422); assert.equal(r.body.error, 'spam'); });
  await test('oversize → 413', async () => { const r = await post(fresh({ message: 'x'.repeat(40000) })); assert.equal(r.status, 413); });
  await test('wrong content-type → 415', async () => { const r = await post('name=a', { type: 'application/x-www-form-urlencoded' }); assert.equal(r.status, 415); });
  await test('bad JSON → 400', async () => { const r = await post('{nope'); assert.equal(r.status, 400); });
  await test('cross-site origin → 403', async () => { const r = await post(fresh(), { headers: { origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' } }); assert.equal(r.status, 403); });
  await test('same-origin headers accepted', async () => { const r = await post(fresh(), { headers: { origin: BASE, 'sec-fetch-site': 'same-origin' } }); assert.equal(r.status, 200); });
  await test('GET → 405', async () => { const r = await fetch(BASE + '/api/inquire'); assert.equal(r.status, 405); });
  await test('rate limit → 429 on the 6th request in 10 min', async () => {
    const codes = []; for (let i = 0; i < 6; i++) codes.push((await post(fresh(), { ip: '10.9.9.9' })).status);
    assert.deepEqual(codes, [200, 200, 200, 200, 200, 429]);
  });
  await test('duplicate key → same id, one file', async () => {
    const g = fresh(), a = await post(g), b = await post(g, { ip: '10.8.8.8' });
    assert.equal(a.status, 200); assert.equal(b.status, 200); assert.equal(a.body.id, b.body.id);
    assert.equal(records(DATA).filter(x => x.endsWith(g.key + '.json')).length, 1);
  });
  await test('no PII in server log', () => { assert.ok(!/ana@example\.com|Ana Reyes/.test(srvLog), 'log contains PII'); });

  /* ---------------- browser e2e ---------------- */
  let chromium = null;
  if (!process.argv.includes('--no-browser')) {
    try { ({ chromium } = await import('playwright')); } catch (e) { try { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); } catch (e2) { console.log('  skip browser tests (Playwright not installed)'); } }
  }
  if (chromium) {
    console.log('browser');
    const browser = await chromium.launch();
    const pageAt = async (vp = { width: 390, height: 844 }, opts = {}) => { const c = await browser.newContext({ viewport: vp, ...opts }); const p = await c.newPage(); p.__errors = []; p.on('pageerror', e => p.__errors.push(e.message)); return p; };
    const fill = async (p, o = {}) => {
      await p.fill('#name', o.name || 'Browser Test'); await p.fill('#email', 'browser@example.com');
      await p.check('input[name="type"][value="Music video"]', { force: true });
      await p.waitForSelector('#inq-later:not(.is-waiting)');
      await p.fill('#timeline', 'Next spring'); await p.fill('#location', 'Austin');
      await p.fill('#message', o.message || 'A live session for three songs in a small venue downtown.');
      await p.check('input[name="budget"][value="Not sure yet"]', { force: true });
    };
    await test('e2e: fill, submit → "Your project is in." + file exists', async () => {
      const p = await pageAt();
      await p.goto(BASE + '/inquire'); await fill(p, { name: 'E2E Success' });
      const before = records(DATA).length;
      await p.click('#inq-submit');
      await p.waitForSelector('#inq-end', { timeout: 20000 });
      assert.equal((await p.textContent('#inq-end-h')).trim(), 'Your project is in.');
      const id = (await p.textContent('#inq-end [data-id]')).trim(); assert.match(id, /^JPS-/);
      assert.equal(records(DATA).length, before + 1);
      assert.ok(records(DATA).some(f => JSON.parse(fs.readFileSync(f, 'utf8')).id === id));
      assert.equal(await p.evaluate(() => document.activeElement.id), 'inq-end');
      assert.match(await p.textContent('#inq-end [data-sum]'), /E2E Success/);
      if (SHOTS) await p.screenshot({ path: path.join(SHOTS, 'inq-success-m390.png'), fullPage: false });
      assert.deepEqual(p.__errors, []);
    });
    await test('e2e: API 500 → error state, form intact, retry works', async () => {
      const p = await pageAt({ width: 1440, height: 900 });
      let fail = true;
      await p.route('**/api/inquire', r => fail ? r.fulfill({ status: 500, contentType: 'application/json', body: '{"ok":false,"error":"storage_failed"}' }) : r.continue());
      await p.goto(BASE + '/inquire'); await fill(p, { name: 'E2E Error' });
      await p.click('#inq-submit');
      await p.waitForSelector('#inq-error:not([hidden])');
      assert.match(await p.textContent('#inq-error-why'), /error 500/);
      assert.equal(await p.inputValue('#name'), 'E2E Error');
      assert.match(await p.inputValue('#inq-error-text'), /E2E Error/);
      assert.match(await p.getAttribute('#inq-mail', 'href'), /^mailto:/);
      assert.equal(await p.isVisible('#inq-end'), false);
      if (SHOTS) { await p.locator('#inq-error').scrollIntoViewIfNeeded(); await p.screenshot({ path: path.join(SHOTS, 'inq-error-d1440.png') }); }
      fail = false; await p.click('#inq-retry'); await p.waitForSelector('#inq-end', { timeout: 20000 });
    });
    await test('e2e: sending state disables the form; double submit sends once', async () => {
      const p = await pageAt();
      let n = 0, release; const gate = new Promise(r => release = r);
      await p.route('**/api/inquire', async r => { n++; await gate; r.continue(); });
      await p.goto(BASE + '/inquire'); await fill(p);
      await p.click('#inq-submit');
      await p.waitForSelector('form.is-sending');
      assert.equal(await p.evaluate(() => document.getElementById('inq-all').disabled), true);
      assert.equal((await p.textContent('#inq-submit')).trim(), 'Sending');
      await p.evaluate(() => document.getElementById('inq-form').requestSubmit());
      await p.waitForTimeout(3600);
      if (SHOTS) { await p.locator('#inq-submit').scrollIntoViewIfNeeded(); await p.screenshot({ path: path.join(SHOTS, 'inq-sending-m390.png') }); }
      release(); await p.waitForSelector('#inq-end', { timeout: 20000 });
      assert.equal(n, 1);
    });
    await test('e2e: validation errors + summary focus + links to fields', async () => {
      const p = await pageAt();
      await p.goto(BASE + '/inquire');
      await p.fill('#email', 'nope'); await p.locator('#email').blur();
      assert.equal(await p.getAttribute('#email', 'aria-invalid'), 'true');
      await p.click('#inq-submit', { force: true }).catch(() => {});
      await p.evaluate(() => document.getElementById('inq-form').requestSubmit());
      await p.waitForSelector('#inq-summary:not([hidden])');
      assert.equal(await p.evaluate(() => document.activeElement.id), 'inq-summary');
      const items = await p.$$eval('#inq-summary a', a => a.map(x => x.getAttribute('href')));
      for (const h of ['#name', '#email', '#type-set', '#message', '#budget-set']) assert.ok(items.includes(h), h);
      assert.equal(await p.getAttribute('#message', 'aria-invalid'), 'true');
      assert.match(await p.getAttribute('#message', 'aria-describedby'), /message-err/);
      if (SHOTS) await p.screenshot({ path: path.join(SHOTS, 'inq-invalid-m390.png') });
      await p.click('#inq-summary a[href="#name"]');
      assert.equal(await p.evaluate(() => document.activeElement.id), 'name');
    });
    await test('e2e: keyboard-only completion (Tab, arrows, Space, Enter)', async () => {
      const p = await pageAt({ width: 1440, height: 900 });
      await p.goto(BASE + '/inquire');
      await p.focus('#name'); await p.keyboard.type('Keyboard Person');
      await p.keyboard.press('Tab'); await p.keyboard.type('keys@example.com');
      await p.keyboard.press('Tab'); // phone
      await p.keyboard.press('Tab'); // type radio group
      assert.equal(await p.evaluate(() => document.activeElement.name), 'type');
      await p.keyboard.press('ArrowDown'); // moves and checks the second option
      assert.equal(await p.evaluate(() => document.querySelector('input[name=type]:checked')?.value), site.inquiry.types[1]);
      await p.waitForSelector('#inq-later:not(.is-waiting)');
      await p.keyboard.press('Tab'); assert.equal(await p.evaluate(() => document.activeElement.id), 'timeline');
      await p.keyboard.type('June');
      for (let i = 0; i < 6 && await p.evaluate(() => document.activeElement.id) !== 'location'; i++) await p.keyboard.press('Tab'); // date (segments) → location
      assert.equal(await p.evaluate(() => document.activeElement.id), 'location'); await p.keyboard.type('Round Rock');
      await p.keyboard.press('Tab'); await p.keyboard.type('A short documentary about a family bakery in Austin.');
      await p.keyboard.press('Tab'); await p.keyboard.press('Space');
      assert.ok(await p.evaluate(() => !!document.querySelector('input[name=budget]:checked')));
      await p.keyboard.press('Tab'); assert.equal(await p.evaluate(() => document.activeElement.tagName), 'SUMMARY');
      await p.keyboard.press('Enter'); assert.equal(await p.evaluate(() => document.getElementById('inq-more').open), true);
      for (let i = 0; i < 4; i++) await p.keyboard.press('Tab');
      await p.keyboard.press('Tab'); assert.equal(await p.evaluate(() => document.activeElement.id), 'inq-submit');
      await p.keyboard.press('Enter');
      await p.waitForSelector('#inq-end', { timeout: 20000 });
    });
    await test('e2e: reduced motion: chapters 03–04 present before a type is chosen', async () => {
      const p = await pageAt({ width: 390, height: 844 }, { reducedMotion: 'reduce' });
      await p.goto(BASE + '/inquire');
      assert.equal(await p.evaluate(() => document.getElementById('inq-later').classList.contains('is-waiting')), false);
      assert.ok(await p.isVisible('#message'));
    });
    await test('e2e: no JS: everything present, form posts to the site email', async () => {
      const p = await pageAt({ width: 390, height: 844 }, { javaScriptEnabled: false });
      await p.goto(BASE + '/inquire');
      assert.ok(await p.isVisible('#message')); assert.ok(await p.isVisible('#budget-set'));
      assert.match(await p.getAttribute('#inq-form', 'action'), new RegExp('^mailto:' + site.email.replace('.', '\\.')));
      assert.equal(await p.isVisible('#inq-error'), false);
    });
    await test('e2e: no horizontal overflow at 375/390/430/1440', async () => {
      for (const width of [375, 390, 430, 834, 1440]) {
        const p = await pageAt({ width, height: 900 });
        await p.goto(BASE + '/inquire');
        const sw = await p.evaluate(() => document.documentElement.scrollWidth); assert.ok(sw <= width, `${width}: ${sw}`);
        await p.close();
      }
    });
    /* preview build: artifact-db */
    const PREV = path.join(ROOT, '.preview');
    if (fs.existsSync(path.join(PREV, 'inquire', 'index.html')) || fs.existsSync(path.join(PREV, 'inquire.html'))) {
      const ps = spawn(process.execPath, ['scripts/serve.mjs', '--dir=.preview', `--port=${PPORT}`], { cwd: ROOT, stdio: 'ignore' });
      const PB = `http://127.0.0.1:${PPORT}`;
      for (let i = 0; i < 50; i++) { try { await fetch(PB + '/robots.txt'); break; } catch (e) { await new Promise(r => setTimeout(r, 100)); } }
      const prevUrl = PB + (fs.existsSync(path.join(PREV, 'inquire', 'index.html')) ? '/inquire/index.html' : '/inquire.html');
      try {
        await test('preview: db available → write to inquiries/<key>, success card', async () => {
          const p = await pageAt();
          await p.addInitScript(() => { window.__writes = []; window.claude = { use: async n => n === 'db' ? { collection: c => ({ doc: id => ({ set: async v => { window.__writes.push({ c, id, v }); } }) }) } : null }; });
          await p.goto(prevUrl); await fill(p, { name: 'Preview Person' });
          await p.click('#inq-submit'); await p.waitForSelector('#inq-end', { timeout: 20000 });
          const w = await p.evaluate(() => window.__writes);
          assert.equal(w.length, 1); assert.equal(w[0].c, 'inquiries'); assert.equal(w[0].v.key, w[0].id); assert.equal(w[0].v.name, 'Preview Person'); assert.ok(w[0].v.createdAt);
          assert.equal(w[0].v.company, undefined);
        });
        await test('preview: db null → honest "goes live" state with copy-ready text, never "sent"', async () => {
          const p = await pageAt();
          await p.addInitScript(() => { window.claude = { use: async () => null }; });
          await p.goto(prevUrl); await fill(p, { name: 'Signed Out' });
          await p.click('#inq-submit'); await p.waitForSelector('#inq-off', { timeout: 20000 });
          assert.match(await p.textContent('#inq-off-h'), /Online inquiries open when the site goes live/);
          assert.match(await p.inputValue('#inq-off-text'), /Signed Out/);
          assert.equal(await p.$('#inq-end'), null);
          await p.click('#inq-off [data-copy]'); await p.waitForFunction(() => document.querySelector('#inq-off .ia-copied').textContent.length > 0);
          if (SHOTS) await p.screenshot({ path: path.join(SHOTS, 'inq-offline-m390.png') });
          await p.click('#inq-off [data-back]'); assert.ok(await p.isVisible('#inq-form'));
        });
        await test('preview: no window.claude at all → same honest state', async () => {
          const p = await pageAt();
          await p.goto(prevUrl); await fill(p);
          await p.click('#inq-submit'); await p.waitForSelector('#inq-off', { timeout: 20000 });
        });
      } finally { ps.kill(); }
    } else console.log('  skip preview tests (no .preview build)');
    await browser.close();
  }
} finally { srv.kill(); }

const failed = results.filter(r => !r[1]);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exit(1);
