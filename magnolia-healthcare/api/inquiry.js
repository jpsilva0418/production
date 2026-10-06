// Vercel Serverless Function — consultation request handler.
// Ported from the Leti Silva Beauty inquiry Worker (worker/site/inquiry.ts): honeypot,
// per-instance nuisance throttle, required-contact validation, and the same honest
// modes — never a false success:
//   1. RESEND_API_KEY + INQUIRY_TO_EMAIL set -> deliver via Resend (reply_to = requester)
//   2. not configured (the DEMO)             -> accept and discard, { ok, staged: true }
// The demo never sends anything anywhere unless the secrets are deliberately set.

const FIELDS = [
  ['requestType', 'Request type', 80],
  ['careTypes', 'Support considered', 200],
  ['timing', 'Ideal start', 80],
  ['city', 'City', 80],
  ['zip', 'ZIP', 10],
  ['experience', 'Caregiving experience', 80],
  ['availability', 'Availability', 80],
  ['teamNotes', 'Notes (team)', 2000],
  ['otherText', 'Looking for', 2000],
  ['fullName', 'Name', 120],
  ['phone', 'Phone', 40],
  ['email', 'Email', 160],
  ['preferredContact', 'Preferred contact', 40],
  ['notes', 'Notes', 2000],
  ['heardAbout', 'Heard about us', 80],
];
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
const recent = new Map();
function rateLimited(ip, windowMs = 60_000, max = 5) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < windowMs);
  hits.push(now); recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > max;
}

export default async function handler(req, res) {
  res.setHeader('content-type', 'application/json');
  if (req.method !== 'POST') { res.setHeader('allow', 'POST'); return res.status(405).send(JSON.stringify({ ok: false, reason: 'method_not_allowed' })); }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== 'object') return res.status(400).send(JSON.stringify({ ok: false, reason: 'bad_json' }));

  if (clean(body.company, 200)) return res.status(200).send(JSON.stringify({ ok: true })); // honeypot
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).send(JSON.stringify({ ok: false, reason: 'rate_limited' }));

  const record = {};
  for (const [key, , cap] of FIELDS) record[key] = clean(body[key], cap);
  if (!record.fullName || !record.email || !record.phone) return res.status(422).send(JSON.stringify({ ok: false, reason: 'missing_contact' }));

  const { RESEND_API_KEY, INQUIRY_TO_EMAIL, INQUIRY_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !INQUIRY_TO_EMAIL) {
    console.warn('[inquiry] delivery not configured — accepted in demo mode (nothing sent).');
    return res.status(200).send(JSON.stringify({ ok: true, staged: true }));
  }

  const rows = FIELDS.filter(([key]) => record[key]);
  const subject = `Consultation request — ${record.fullName}, ${record.requestType || 'General'}`;
  const html = `<h2 style="font-family:Georgia,serif">New request — Magnolia Healthcare website</h2><table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">` +
    rows.map(([key, label]) => `<tr><td style="color:#4A5450;vertical-align:top"><strong>${esc(label)}</strong></td><td style="white-space:pre-wrap">${esc(record[key])}</td></tr>`).join('') + `</table>`;
  const text = rows.map(([key, label]) => `${label}: ${record[key]}`).join('\n');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: INQUIRY_FROM_EMAIL || 'Magnolia Healthcare Website <onboarding@resend.dev>', to: INQUIRY_TO_EMAIL, reply_to: record.email, subject, html, text }),
  });
  if (!r.ok) { console.error('[inquiry] Resend rejected the email', r.status, await r.text()); return res.status(502).send(JSON.stringify({ ok: false, reason: 'delivery_failed' })); }
  return res.status(200).send(JSON.stringify({ ok: true }));
}
