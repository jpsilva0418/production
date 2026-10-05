/* ==========================================================================
   /api/inquiry — the ONE server-side destination for every form on the site.

   A plain Vercel Function, deliberately NOT an Astro server route: the site
   stays a fully static build with no adapter, exactly as approved, and this
   file is the only server-side code that exists.

   Both surfaces reach it through src/lib/inquiry.ts#sendInquiry:
     /contact     the general project inquiry
     /free-demo   the same intake plus the eight planner answers in `plan`

   The Resend key is read from process.env and never leaves the server. It is
   not a PUBLIC_ variable, it is not in the bundle, and it is never logged —
   the catch blocks log a reason, never the payload or the credential.

   HONESTY RULE: this returns 2xx only when Resend has accepted the message
   and given it an id. Anything else is a non-2xx, and the browser shows the
   email handoff rather than a success state.
   ========================================================================== */
import { createHash } from 'node:crypto';
import {
  BUSINESS_TYPES, SITUATIONS, GOALS, PACKAGE_CHOICES, FEATURE_GROUPS,
  TIMELINES, RECOMMEND_CHOICES,
} from '../src/components/planner/logic.js';

const TO       = process.env.INQUIRY_TO   || 'jpsilva0418@gmail.com';
const FROM     = process.env.INQUIRY_FROM || 'JP Silva Digital <hello@jpsilvadigital.com>';
const API_KEY  = process.env.RESEND_API_KEY || '';

/* The site's own registrable domain. An Origin on this domain is ours
   whatever the subdomain, which is what makes the apex/www pair safe. */
const SITE_DOMAIN = 'jpsilvadigital.com';

/* Length caps. Applied server-side because a client-side maxlength is a
   suggestion, not a limit. A field over its cap is truncated rather than
   rejected: the lead is worth more than the tidiness of the record. */
const CAPS = {
  name: 120, email: 254, phone: 40, company: 160, website: 300,
  need: 60, budget: 60, timeline: 60, message: 5000,
};
const MAX_BODY = 64 * 1024;

/* ── in-memory guards ──────────────────────────────────────────────────────
   A Vercel Function instance is reused between invocations, so a Map here
   survives across requests on the same instance. That is enough to stop the
   ordinary cases — a stuck submit button, a double tap, a crude script — and
   it is honest about what it is: not a distributed rate limiter. A new
   instance starts with an empty map, which fails OPEN. That is the right
   direction to fail: a missed rate-limit costs an extra email, while a
   false positive costs JP a customer. */
const hits = new Map();      // ip -> number[] (timestamps)
const recent = new Map();    // fingerprint -> timestamp
const WINDOW = 10 * 60_000;  // 10 minutes
const MAX_PER_WINDOW = 5;    // per IP
const DUPLICATE_WINDOW = 5 * 60_000;

function sweep(now) {
  for (const [k, v] of hits) {
    const keep = v.filter((t) => now - t < WINDOW);
    keep.length ? hits.set(k, keep) : hits.delete(k);
  }
  for (const [k, t] of recent) if (now - t > DUPLICATE_WINDOW) recent.delete(k);
}

const clean = (v, cap) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, cap) : '';

/* CR and LF stripped from anything that reaches a mail header. A newline in
   a subject or a display name is header injection. */
const header = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim();

const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ── planner answers: ids to the labels the visitor actually read ───────── */
const LOOKUPS = {
  businessType: BUSINESS_TYPES, situation: SITUATIONS, goal: GOALS,
  packageChoice: PACKAGE_CHOICES, timeline: TIMELINES,
  wantsRecommendation: RECOMMEND_CHOICES,
};
const ALL_FEATURES = FEATURE_GROUPS.flatMap((g) => g.items ?? g.features ?? []);
const labelOf = (list, id) => list?.find((x) => x.id === id)?.label ?? id;

const PLANNER_QUESTIONS = [
  ['businessType',        'Type of business'],
  ['situation',           'Current situation'],
  ['goal',                'Primary goal'],
  ['packageChoice',       'Website type of interest'],
  ['features',            'Features that may matter'],
  ['timeline',            'Would like to begin'],
  ['wantsRecommendation', 'Wants a recommendation'],
];

function plannerRows(answers) {
  if (!answers || typeof answers !== 'object') return [];
  const out = [];
  for (const [key, question] of PLANNER_QUESTIONS) {
    const raw = answers[key];
    let value;
    if (key === 'features') {
      value = Array.isArray(raw) && raw.length
        ? raw.map((id) => labelOf(ALL_FEATURES, id)).join(', ')
        : '';
    } else {
      value = raw ? labelOf(LOOKUPS[key], raw) : '';
      const other = answers[`${key}Other`];
      if (other) value += ` — "${clean(other, 200)}"`;
    }
    if (value) out.push([question, value]);
  }
  return out;
}

/* ── where the request came from ───────────────────────────────────────────
   Instagram's, Facebook's and TikTok's in-app browsers are real Safari
   WebKit, but they do not all send the same request headers a tab does.
   Depending on version a same-site POST arrives with `Origin` set to the
   page's origin, set to the literal string "null", or absent altogether.
   The first version of this check compared `new URL(origin).host` to the
   request host and rejected anything else, which turned both of the other
   two cases into a 403 — a silent failure for exactly the browsers most of
   JP's visitors arrive in.

   So the question is answered honestly instead: is this request one of ours?

     - an Origin on jpsilvadigital.com (apex or any subdomain) is ours
     - an Origin equal to the host that served the request is ours, which
       covers *.vercel.app preview URLs without naming them
     - "null" or no Origin is not evidence of a cross-site request. This
       endpoint reads nothing from a cookie, a session or an Authorization
       header, so there is no ambient authority for a third-party page to
       borrow: the CSRF that an Origin check defends against does not apply.
       `sec-fetch-site`, which WebKit does send, is consulted when present
       and a genuine cross-site value is still refused.
     - anything else — a real cross-site Origin — is refused.

   What actually keeps the inbox clean is downstream and unchanged: the
   honeypot, strict re-validation, the length caps, the per-IP window and
   the duplicate fingerprint. None of that is relaxed here. */
function originVerdict(req) {
  const rawHost = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  const host = rawHost.toLowerCase().split(',')[0].trim().replace(/:\d+$/, '');
  const origin = req.headers.origin;
  const fetchSite = String(req.headers['sec-fetch-site'] || '').toLowerCase();

  if (fetchSite === 'cross-site') return { ok: false, how: 'cross_site_header' };

  if (!origin || origin === 'null') return { ok: true, how: 'no_origin' };

  let oh;
  try { oh = new URL(origin).host.toLowerCase().replace(/:\d+$/, ''); }
  catch { return { ok: false, how: 'unparseable_origin' }; }

  if (oh === host) return { ok: true, how: 'origin_matches_host' };
  if (oh === SITE_DOMAIN || oh.endsWith(`.${SITE_DOMAIN}`)) return { ok: true, how: 'site_domain' };
  return { ok: false, how: 'foreign_origin' };
}

/* ── diagnostics ───────────────────────────────────────────────────────────
   One line per request, in the Vercel function log. Deliberately carries no
   API key, no header values, no name, no email address and no message text —
   only the shape of what happened, which is what a failure needs. */
function log(fields) {
  try { console.log(`[inquiry] ${JSON.stringify(fields)}`); } catch {}
}

/* ── the email ──────────────────────────────────────────────────────────── */
function render(d, meta) {
  const isDemo = d.source === 'planner';
  const who = d.company || d.name;

  const detail = [
    ['Name', d.name],
    ['Email', d.email],
    ['Phone', d.phone],
    ['Business', d.company],
    ['Current website', d.website],
    ['Service requested', d.need],
    ['Budget', d.budget],
    ['Timeline', d.timeline],
  ].filter(([, v]) => v);

  const planner = isDemo ? plannerRows(d.plan?.answers) : [];
  const rec = isDemo ? d.plan?.recommendation : null;

  const subject = isDemo
    ? `New Free Demo Request — ${header(who)}`
    : `New JP Silva Digital Inquiry — ${header(d.name)}`;

  const text = [
    isDemo ? 'FREE HOMEPAGE DEMO REQUEST' : 'NEW PROJECT INQUIRY',
    '',
    ...detail.map(([k, v]) => `${k}: ${v}`),
    '',
    'MESSAGE / PROJECT DETAILS',
    d.message || '(none given)',
    ...(planner.length
      ? ['', 'WEBSITE PROJECT PLANNER', ...planner.map(([k, v]) => `${k}: ${v}`)]
      : []),
    ...(rec?.package ? ['', `Planner suggested: ${rec.package}`] : []),
    '',
    '—',
    `Source: ${isDemo ? 'Free Demo planner (/free-demo)' : 'Contact page (/contact)'}`,
    `Received: ${meta.when}`,
    meta.page ? `Submitted from: ${meta.page}` : '',
    '',
    `Reply straight to this email to reach ${d.name}.`,
  ].filter((l) => l !== undefined).join('\n');

  const row = ([k, v]) =>
    `<tr><td style="padding:7px 14px 7px 0;color:#5a6478;font:13px -apple-system,Segoe UI,Roboto,sans-serif;white-space:nowrap;vertical-align:top">${esc(k)}</td>` +
    `<td style="padding:7px 0;color:#10182b;font:600 14px -apple-system,Segoe UI,Roboto,sans-serif">${esc(v)}</td></tr>`;

  const section = (title, rows) => rows.length
    ? `<p style="margin:26px 0 6px;font:600 11px -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#5a6478">${esc(title)}</p>
       <table style="border-collapse:collapse;width:100%">${rows.map(row).join('')}</table>`
    : '';

  const html = `<!doctype html><html><body style="margin:0;background:#f6f8fc;padding:24px">
<table style="border-collapse:collapse;max-width:620px;margin:0 auto;background:#fff;border:1px solid #e4e9f2;border-radius:14px">
<tr><td style="padding:26px 28px">
  <p style="margin:0 0 2px;font:600 11px -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:${isDemo ? '#0d6b40' : '#2f5cf0'}">
    ${isDemo ? 'Free homepage demo' : 'New inquiry'}
  </p>
  <h1 style="margin:0;font:800 22px/1.25 -apple-system,Segoe UI,Roboto,sans-serif;color:#10182b;letter-spacing:-.02em">${esc(who)}</h1>

  ${section('Contact', detail)}

  <p style="margin:26px 0 6px;font:600 11px -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#5a6478">Message / project details</p>
  <p style="margin:0;padding:13px 15px;background:#f6f8fc;border:1px solid #e4e9f2;border-radius:9px;font:14px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#10182b;white-space:pre-wrap">${esc(d.message || '(none given)')}</p>

  ${section('Website project planner', planner)}
  ${rec?.package ? `<p style="margin:14px 0 0;font:14px -apple-system,Segoe UI,Roboto,sans-serif;color:#10182b">Planner suggested: <strong>${esc(rec.package)}</strong></p>` : ''}

  <table style="border-collapse:collapse;width:100%;margin-top:26px;border-top:1px solid #e4e9f2">
    <tr><td style="padding-top:14px;font:12px/1.7 -apple-system,Segoe UI,Roboto,sans-serif;color:#5a6478">
      Source: <strong style="color:#10182b">${isDemo ? 'Free Demo planner (/free-demo)' : 'Contact page (/contact)'}</strong><br>
      Received: ${esc(meta.when)}${meta.page ? `<br>Submitted from: ${esc(meta.page)}` : ''}<br>
      Reply straight to this email to reach ${esc(d.name)}.
    </td></tr>
  </table>
</td></tr></table></body></html>`;

  return { subject, text, html };
}

export default async function handler(req, res) {
  const started = Date.now();
  let calledResend = false;
  /* Every exit goes through here, so no request can finish unlogged. */
  const finish = (status, error, extra = {}) => {
    log({
      at: new Date(started).toISOString(),
      path: '/api/inquiry',
      method: req.method,
      status,
      ...(error ? { error } : {}),
      resend_called: calledResend,
      ms: Date.now() - started,
      ...extra,
    });
    return error === null
      ? res.status(status).json({ ok: true, ...extra })
      : res.status(status).json({ ok: false, error, ...extra });
  };

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return finish(405, 'method_not_allowed');
  }

  const org = originVerdict(req);
  if (!org.ok) return finish(403, 'bad_origin', { origin_check: org.how });

  let d = req.body;
  if (Buffer.isBuffer(d)) d = d.toString('utf8');
  if (typeof d === 'string') {
    if (d.length > MAX_BODY) return finish(413, 'too_large');
    try { d = JSON.parse(d); } catch { return finish(400, 'bad_json'); }
  }
  if (!d || typeof d !== 'object') return finish(400, 'bad_body');

  /* Honeypot. A real visitor never sees the field, so anything in it is a
     bot — answered 200 so the bot learns nothing, and nothing is sent. */
  if (d.trap) return finish(200, null, { skipped: 'trap' });

  /* Strict server-side re-validation. The client validates too; that is for
     the person's benefit, not a guarantee. */
  const v = {};
  for (const [k, cap] of Object.entries(CAPS)) v[k] = clean(d[k], cap);
  if (!v.name)  return finish(422, 'name_required', { invalid: 'name' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) {
    return finish(422, 'email_invalid', { invalid: 'email' });
  }
  const source = d.source === 'planner' ? 'planner' : 'contact';

  const now = Date.now();
  sweep(now);

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const stamps = hits.get(ip) || [];
  if (stamps.length >= MAX_PER_WINDOW) {
    res.setHeader('Retry-After', '600');
    return finish(429, 'rate_limited');
  }

  /* Duplicate guard: the same person sending the same thing twice inside
     five minutes is a double submit, not two leads. Answered 200 — from the
     visitor's point of view their message did arrive. */
  const fingerprint = `${v.email}|${source}|${v.message.slice(0, 200)}`;
  if (recent.has(fingerprint)) {
    return finish(200, null, { duplicate: true });
  }

  if (!API_KEY) {
    /* No credential: say so plainly rather than pretend. The browser shows
       the email handoff. */
    return finish(503, 'not_configured');
  }

  const payload = {
    source,
    ...v,
    plan: source === 'planner' ? d.plan : undefined,
  };
  const meta = {
    when: new Date(now).toLocaleString('en-US', {
      timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short',
    }) + ' (ET)',
    page: clean(d.page || req.headers.referer, 300),
  };
  const { subject, text, html } = render(payload, meta);

  /* The exact bytes going to Resend, built once so the idempotency key can be
     derived from them. */
  const outgoing = JSON.stringify({
    from: header(FROM),
    to: [TO],
    reply_to: v.email ? header(`${v.name} <${v.email}>`) : undefined,
    subject: header(subject),
    text,
    html,
  });

  /* Idempotency-Key is a hash of that payload, NOT of the submission's
     content fingerprint.

     It used to be the fingerprint — email + source + the first 200 characters
     of the message — and that was wrong in a way production found before any
     customer did. The planner has no free-text field of its own, so its
     message is always the same default sentence; two planner submissions from
     one email therefore produced an identical key with genuinely different
     payloads (different name, different answers). Resend correctly refused the
     second with 409 invalid_idempotent_request, which this endpoint turned
     into a 502 and the visitor saw as a failed send.

     Keyed on the payload hash instead, the guarantee is the one actually
     wanted: an identical request retried is de-duplicated by Resend, and a
     different request is simply a different request. "Same person sent the
     same thing twice" is already handled above by the duplicate window, which
     answers 200 without sending. */
  const idemKey = `inq_${createHash('sha256').update(outgoing).digest('base64url').slice(0, 48)}`;

  try {
    calledResend = true;
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idemKey,
      },
      body: outgoing,
    });

    const body = await r.json().catch(() => ({}));

    /* Accepted ONLY when Resend returns an id. A 2xx with no id is not a
       send, and is not reported as one.

       `upstream` is Resend's own HTTP status and `upstream_name` its error
       name — the two facts that tell a bad credential (401) apart from an
       unverified sender (403) apart from a rate limit (429). Neither is a
       secret, and without them a 502 here is a dead end: that is exactly
       how the first production failure stayed invisible. The message body
       is deliberately not carried over or logged. */
    if (!r.ok || !body?.id) {
      return finish(502, 'send_failed', {
        upstream: r.status,
        upstream_name: typeof body?.name === 'string' ? body.name : undefined,
      });
    }

    hits.set(ip, [...stamps, now]);
    recent.set(fingerprint, now);
    return finish(200, null, { id: body.id, source, origin_check: org.how });
  } catch (e) {
    /* The error's constructor name only — never its message, which can
       carry the URL and the request. */
    return finish(502, 'send_failed', { transport: e?.name || 'Error' });
  }
}
