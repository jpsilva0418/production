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
import {
  BUSINESS_TYPES, SITUATIONS, GOALS, PACKAGE_CHOICES, FEATURE_GROUPS,
  TIMELINES, RECOMMEND_CHOICES,
} from '../src/components/planner/logic.js';

const TO       = process.env.INQUIRY_TO   || 'jpsilva0418@gmail.com';
const FROM     = process.env.INQUIRY_FROM || 'JP Silva Digital <hello@jpsilvadigital.com>';
const API_KEY  = process.env.RESEND_API_KEY || '';

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
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  /* Same-origin only. The form posts from this site; nothing else should. */
  const origin = req.headers.origin;
  if (origin) {
    const host = req.headers['x-forwarded-host'] || req.headers.host || '';
    let ok = false;
    try { ok = new URL(origin).host === host; } catch { ok = false; }
    if (!ok) return res.status(403).json({ ok: false, error: 'bad_origin' });
  }

  let d = req.body;
  if (typeof d === 'string') {
    if (d.length > MAX_BODY) return res.status(413).json({ ok: false, error: 'too_large' });
    try { d = JSON.parse(d); } catch { return res.status(400).json({ ok: false, error: 'bad_json' }); }
  }
  if (!d || typeof d !== 'object') return res.status(400).json({ ok: false, error: 'bad_body' });

  /* Honeypot. A real visitor never sees the field, so anything in it is a
     bot — answered 200 so the bot learns nothing, and nothing is sent. */
  if (d.trap) return res.status(200).json({ ok: true, skipped: 'trap' });

  /* Strict server-side re-validation. The client validates too; that is for
     the person's benefit, not a guarantee. */
  const v = {};
  for (const [k, cap] of Object.entries(CAPS)) v[k] = clean(d[k], cap);
  if (!v.name)  return res.status(422).json({ ok: false, error: 'name_required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) {
    return res.status(422).json({ ok: false, error: 'email_invalid' });
  }
  const source = d.source === 'planner' ? 'planner' : 'contact';

  const now = Date.now();
  sweep(now);

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const stamps = hits.get(ip) || [];
  if (stamps.length >= MAX_PER_WINDOW) {
    res.setHeader('Retry-After', '600');
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  /* Duplicate guard: the same person sending the same thing twice inside
     five minutes is a double submit, not two leads. Answered 200 — from the
     visitor's point of view their message did arrive. */
  const fingerprint = `${v.email}|${source}|${v.message.slice(0, 200)}`;
  if (recent.has(fingerprint)) {
    return res.status(200).json({ ok: true, duplicate: true });
  }

  if (!API_KEY) {
    /* No credential: say so plainly rather than pretend. The browser shows
       the email handoff. */
    console.error('inquiry: RESEND_API_KEY is not set');
    return res.status(503).json({ ok: false, error: 'not_configured' });
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

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        /* Resend de-duplicates on this, so a retry of the same submission
           cannot produce two emails. */
        'Idempotency-Key': `inq_${Buffer.from(fingerprint).toString('base64url').slice(0, 200)}`,
      },
      body: JSON.stringify({
        from: header(FROM),
        to: [TO],
        reply_to: v.email ? header(`${v.name} <${v.email}>`) : undefined,
        subject: header(subject),
        text,
        html,
      }),
    });

    const body = await r.json().catch(() => ({}));

    /* Accepted ONLY when Resend returns an id. A 2xx with no id is not a
       send, and is not reported as one. */
    if (!r.ok || !body?.id) {
      console.error('inquiry: resend rejected', r.status, body?.message || body?.name || '');
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }

    hits.set(ip, [...stamps, now]);
    recent.set(fingerprint, now);
    return res.status(200).json({ ok: true, id: body.id });
  } catch (e) {
    console.error('inquiry: transport error', e?.name || 'Error');
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
}
