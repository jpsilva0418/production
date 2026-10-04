/* ============================================================
   JP SILVA MEDIA — inquiries (no dependencies)
   validate · spam rules · storage adapters (file | blob) · idempotency · optional notification · request core
   Used by api/inquire.mjs (Vercel Web-standard function) and scripts/serve.mjs (local host).
   Never logs personal data: only the reference id and the reason class.
   ============================================================ */
import { site } from '../src/data/site.mjs';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const I = site.inquiry;
export const LIMITS = { name: 120, email: 254, phone: 40, timeline: 200, location: 200, url: 300, messageMin: 20, messageMax: 4000, maxUrlsInMessage: 5, minFillMs: 3000 };
const EMAIL_RE = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[^\s@<>()[\],;:"]{2,}$/;
const PHONE_RE = /^[0-9+().\-\s]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const KEY_RE = /^[A-Za-z0-9-]{8,64}$/;
const URL_COUNT_RE = /\bhttps?:\/\/|\bwww\./gi;

/* single line: trim, collapse whitespace, drop control characters */
const line = v => (typeof v === 'string' ? v : v == null ? '' : String(v)).replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim();
/* multi line: keep newlines (max two in a row), drop other control characters */
const block = v => (typeof v === 'string' ? v : v == null ? '' : String(v)).replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
const len = s => [...s].length;
function httpUrl(s) {
  if (!s) return '';
  let v = s;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(v) && /^[\w-]+(\.[\w-]+)+/.test(v)) v = 'https://' + v; // "instagram.com/x" is fine
  try { const u = new URL(v); return (u.protocol === 'http:' || u.protocol === 'https:') && u.hostname.includes('.') ? u.href : null; } catch (e) { return null; }
}

/* validate(input) → { ok, errors: {field: message}, clean } */
export function validate(input) {
  const x = input && typeof input === 'object' ? input : {};
  const errors = {}, clean = {};
  clean.name = line(x.name);
  if (!clean.name) errors.name = 'Add your name.';
  else if (len(clean.name) > LIMITS.name) errors.name = `Keep the name under ${LIMITS.name} characters.`;

  clean.email = line(x.email).toLowerCase();
  if (!clean.email) errors.email = 'Add an email address so JP can reply.';
  else if (clean.email.length > LIMITS.email || !EMAIL_RE.test(clean.email)) errors.email = 'That email address does not look complete (name@example.com).';

  clean.phone = line(x.phone);
  if (clean.phone && (clean.phone.length > LIMITS.phone || !PHONE_RE.test(clean.phone) || (clean.phone.match(/\d/g) || []).length < 7)) errors.phone = 'Use digits and + ( ) - . only, or leave it empty.';

  clean.type = line(x.type);
  if (!clean.type) errors.type = 'Choose what you are looking for.';
  else if (!I.types.includes(clean.type)) errors.type = 'Choose one of the listed options.';

  clean.budget = line(x.budget);
  if (!clean.budget) errors.budget = 'Choose a budget range, or “Not sure yet”.';
  else if (!I.budgets.includes(clean.budget)) errors.budget = 'Choose one of the listed ranges.';

  clean.timeline = line(x.timeline);
  if (len(clean.timeline) > LIMITS.timeline) errors.timeline = `Keep it under ${LIMITS.timeline} characters.`;
  clean.date = line(x.date);
  if (clean.date && (!DATE_RE.test(clean.date) || isNaN(Date.parse(clean.date + 'T00:00:00Z')))) errors.date = 'Use a full date, or leave it empty.';
  clean.location = line(x.location);
  if (len(clean.location) > LIMITS.location) errors.location = `Keep it under ${LIMITS.location} characters.`;

  clean.message = block(x.message);
  const ml = len(clean.message);
  if (!ml) errors.message = 'Tell JP a little about the project.';
  else if (ml < LIMITS.messageMin) errors.message = `A little more, please: at least ${LIMITS.messageMin} characters.`;
  else if (ml > LIMITS.messageMax) errors.message = `Keep it under ${LIMITS.messageMax} characters.`;

  for (const f of ['reference', 'social']) {
    const raw = line(x[f]);
    if (!raw) { clean[f] = ''; continue; }
    const u = raw.length > LIMITS.url ? null : httpUrl(raw);
    if (!u || u.length > LIMITS.url) { errors[f] = 'Use a full web link (https://…), or leave it empty.'; clean[f] = raw.slice(0, LIMITS.url); } else clean[f] = u;
  }
  clean.contactMethod = line(x.contactMethod);
  if (clean.contactMethod && !I.contactMethods.includes(clean.contactMethod)) errors.contactMethod = 'Choose one of the listed options.';
  clean.heardFrom = line(x.heardFrom);
  if (clean.heardFrom && !I.heardFrom.includes(clean.heardFrom)) errors.heardFrom = 'Choose one of the listed options.';
  if (clean.contactMethod === 'Phone call' || clean.contactMethod === 'Text') { if (!clean.phone && !errors.phone) errors.phone = 'Add a phone number, or choose another way to reach you.'; }

  return { ok: Object.keys(errors).length === 0, errors, clean };
}

/* spam(input, now) → null (fine) | { drop:true } (honeypot: accept silently, store nothing) | { status, error } */
export function spam(input, now = Date.now()) {
  const x = input && typeof input === 'object' ? input : {};
  if (line(x.company)) return { drop: true };
  const t = Number(x.renderedAt);
  if (!Number.isFinite(t) || t <= 0) return { status: 400, error: 'bad_request' };
  if (now - t < LIMITS.minFillMs) return { status: 422, error: 'too_fast' };
  const urls = (String(x.message || '').match(URL_COUNT_RE) || []).length;
  if (urls > LIMITS.maxUrlsInMessage) return { status: 422, error: 'spam', fields: { message: `Keep it to ${LIMITS.maxUrlsInMessage} links or fewer.` } };
  return null;
}

export const validKey = k => typeof k === 'string' && KEY_RE.test(k);
/* reference id: readable, derived from the idempotency key so a retry carries the same reference */
export function makeId(key, now = new Date()) {
  const d = now.toISOString().slice(2, 10).replace(/-/g, '');
  const h = crypto.createHash('sha256').update(String(key)).digest('hex').slice(0, 6).toUpperCase();
  return `JPS-${d}-${h}`;
}
const stamp = d => d.toISOString().replace(/[:.]/g, '-');
export const recordPath = (key, d) => `inquiries/${d.toISOString().slice(0, 7)}/${stamp(d)}-${key}.json`;

/* ---------- storage adapters: { kind, find(key) → id|null, save(record) → {id, path} } ---------- */
export function fileStorage(dir) {
  const keysDir = path.join(dir, 'inquiries', '_keys');
  return {
    kind: 'file',
    async find(key) {
      try { return JSON.parse(await fs.readFile(path.join(keysDir, key + '.json'), 'utf8')).id || null; } catch (e) { return null; }
    },
    async save(rec) {
      const rel = recordPath(rec.key, new Date(rec.receivedAt));
      await fs.mkdir(keysDir, { recursive: true });
      /* claim the key first: 'wx' fails if it exists, so two racing requests cannot both write */
      try { await fs.writeFile(path.join(keysDir, rec.key + '.json'), JSON.stringify({ id: rec.id, path: rel }), { flag: 'wx' }); }
      catch (e) { if (e.code === 'EEXIST') { const id = await this.find(rec.key); return { id, path: null, duplicate: true }; } throw e; }
      const file = path.join(dir, rel);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, JSON.stringify(rec, null, 2) + '\n', { flag: 'wx' });
      return { id: rec.id, path: rel };
    }
  };
}

export function blobStorage(token = process.env.BLOB_READ_WRITE_TOKEN) {
  let mod;
  const blob = async () => (mod = mod || await import('@vercel/blob'));
  return {
    kind: 'blob',
    /* key markers are empty blobs named inquiries/_keys/<key>/<id>: list() by prefix finds them without reading private content */
    async find(key) {
      const { list } = await blob();
      const r = await list({ prefix: `inquiries/_keys/${key}/`, limit: 1, token });
      const b = r.blobs && r.blobs[0];
      return b ? b.pathname.split('/').pop() : null;
    },
    async save(rec) {
      const { put } = await blob();
      const rel = recordPath(rec.key, new Date(rec.receivedAt));
      await put(rel, JSON.stringify(rec, null, 2), { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: false, token });
      try { await put(`inquiries/_keys/${rec.key}/${rec.id}`, rec.id, { access: 'private', contentType: 'text/plain', addRandomSuffix: false, allowOverwrite: false, token }); } catch (e) { /* marker is best effort */ }
      return { id: rec.id, path: rel };
    }
  };
}

/* INQUIRY_STORAGE=file|blob; default blob when a token exists; otherwise none (→ 503 storage_unconfigured) */
export function storageFromEnv(env = process.env) {
  const kind = (env.INQUIRY_STORAGE || (env.BLOB_READ_WRITE_TOKEN ? 'blob' : '')).toLowerCase();
  if (kind === 'file') return fileStorage(env.INQUIRY_DATA_DIR || path.join(process.cwd(), '.data'));
  if (kind === 'blob' && env.BLOB_READ_WRITE_TOKEN) return blobStorage(env.BLOB_READ_WRITE_TOKEN);
  return null;
}

/* plain-text summary (notification email, and the client's copy-ready fallback uses the same order) */
export function summaryText(rec) {
  const rows = [['Reference', rec.id], ['Name', rec.name], ['Email', rec.email], ['Phone', rec.phone], ['Looking for', rec.type], ['Budget', rec.budget],
    ['Date or timeline', [rec.date, rec.timeline].filter(Boolean).join(' · ')], ['Location', rec.location], ['Reference link', rec.reference],
    ['Social / website', rec.social], ['Preferred contact', rec.contactMethod], ['Heard about JP', rec.heardFrom]];
  return rows.filter(r => r[1]).map(r => `${r[0]}: ${r[1]}`).join('\n') + `\n\n${rec.message}\n`;
}

/* optional notification after storing: Resend REST API, never fails the request */
export async function notify(rec, env = process.env, fetchImpl = globalThis.fetch) {
  if (!env.RESEND_API_KEY || !env.INQUIRY_NOTIFY_TO || !fetchImpl) return { sent: false, reason: 'unconfigured' };
  try {
    const r = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: env.INQUIRY_NOTIFY_FROM || `${site.brand} <onboarding@resend.dev>`,
        to: env.INQUIRY_NOTIFY_TO.split(',').map(s => s.trim()).filter(Boolean),
        reply_to: rec.email,
        subject: `New inquiry ${rec.id}: ${rec.type}`,
        text: summaryText(rec)
      }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
    });
    return { sent: r.ok, status: r.status };
  } catch (e) { return { sent: false, reason: 'error' }; }
}

/* the whole decision for one parsed body → { status, body }. Transport concerns (size, type, origin, rate) live in the handler. */
const memos = new WeakMap(); // storage → Map(key → id), per instance; storage is the source of truth
export async function handleInquiry(input, { storage = storageFromEnv(), now = Date.now(), env = process.env, fetchImpl, log = console } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { status: 400, body: { ok: false, error: 'bad_request' } };
  const key = input.key;
  if (!validKey(key)) return { status: 400, body: { ok: false, error: 'bad_request', fields: { key: 'Missing request key.' } } };
  const s = spam(input, now);
  if (s && s.drop) { log.info?.(`[inquiry] dropped (honeypot) ${makeId(key, new Date(now))}`); return { status: 200, body: { ok: true, id: makeId(key, new Date(now)) } }; }
  if (s) return { status: s.status, body: { ok: false, error: s.error, ...(s.fields ? { fields: s.fields } : {}) } };
  const v = validate(input);
  if (!v.ok) return { status: 422, body: { ok: false, error: 'validation', fields: v.errors } };
  if (!storage) { log.warn?.('[inquiry] storage_unconfigured'); return { status: 503, body: { ok: false, error: 'storage_unconfigured' } }; }
  const memo = memos.get(storage) || new Map(); memos.set(storage, memo);
  try {
    const known = memo.get(key) || await storage.find(key);
    if (known) return { status: 200, body: { ok: true, id: known, duplicate: true } };
    const d = new Date(now);
    const rec = { id: makeId(key, d), key, receivedAt: d.toISOString(), renderedAt: new Date(Number(input.renderedAt)).toISOString(), ...v.clean, source: line(input.source).slice(0, 40) || 'web' };
    const saved = await storage.save(rec);
    memo.set(key, saved.id);
    if (memo.size > 500) memo.delete(memo.keys().next().value);
    if (!saved.duplicate) { log.info?.(`[inquiry] stored ${saved.id}`); await notify(rec, env, fetchImpl); }
    return { status: 200, body: { ok: true, id: saved.id, ...(saved.duplicate ? { duplicate: true } : {}) } };
  } catch (e) {
    log.error?.(`[inquiry] storage_failed ${e && e.name}`);
    return { status: 500, body: { ok: false, error: 'storage_failed' } };
  }
}
