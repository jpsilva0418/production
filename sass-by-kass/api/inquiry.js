// Vercel Serverless Function — bridal inquiry handler.
// Honeypot, per-instance nuisance throttle, server-side validation, and honest modes —
// never a false success:
//   1. RESEND_API_KEY + INQUIRY_TO_EMAIL set -> deliver via Resend (reply_to = the bride's email)
//   2. not configured                         -> 503 { ok:false, reason:'not_configured' }
// There is no silent "accept and discard": a site without delivery configured tells the visitor
// the inquiry did not send. Demo builds never call this endpoint (PUBLIC_DEMO_ONLY=1).
// Keys live only in the server environment; nothing here reaches the browser.

const FIELDS = [
  ['weddingDate', 'Wedding date', 40],
  ['dateUnknown', 'Date', 40],
  ['weddingPlace', 'Getting ready at', 120],
  ['partySize', 'How many need hair', 40],
  ['bridalStyles', 'Styles', 200],
  ['hairFor', 'Hair for', 200],
  ['packageInterest', 'Package interest', 1000],
  ['trial', 'Trial', 40],
  ['dayNotes', 'About the day', 1500],
  ['fullName', 'Name', 120],
  ['email', 'Email', 160],
  ['phone', 'Phone', 40],
  ['message', 'Message', 2000],
  ['inspiration', 'Inspiration links', 1000],
];
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
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

  if (clean(body.company, 200)) return res.status(200).send(JSON.stringify({ ok: true })); // honeypot: bots get a quiet 200
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).send(JSON.stringify({ ok: false, reason: 'rate_limited' }));

  const record = {};
  for (const [key, , cap] of FIELDS) record[key] = clean(body[key], cap);
  if (!record.fullName || !emailOk(record.email)) return res.status(422).send(JSON.stringify({ ok: false, reason: 'missing_contact' }));
  if (!record.partySize) return res.status(422).send(JSON.stringify({ ok: false, reason: 'missing_party_size' }));

  const { RESEND_API_KEY, INQUIRY_TO_EMAIL, INQUIRY_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !INQUIRY_TO_EMAIL) {
    console.error('[inquiry] delivery not configured — refusing rather than pretending to send.');
    return res.status(503).send(JSON.stringify({ ok: false, reason: 'not_configured' }));
  }

  const rows = FIELDS.filter(([key]) => record[key]);
  const when = record.weddingDate || record.dateUnknown || 'date not given';
  const subject = `Bridal inquiry — ${record.fullName}, ${when}`;
  const html = `<h2 style="font-family:Georgia,serif">New bridal inquiry — Sass by Kass website</h2><table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">` +
    rows.map(([key, label]) => `<tr><td style="color:#4C5872;vertical-align:top"><strong>${esc(label)}</strong></td><td style="white-space:pre-wrap">${esc(record[key])}</td></tr>`).join('') + `</table>`;
  const text = rows.map(([key, label]) => `${label}: ${record[key]}`).join('\n');
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: INQUIRY_FROM_EMAIL || 'Sass by Kass Website <onboarding@resend.dev>', to: INQUIRY_TO_EMAIL, reply_to: record.email, subject, html, text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) { console.error('[inquiry] Resend rejected the email', r.status, await r.text().catch(() => '')); return res.status(502).send(JSON.stringify({ ok: false, reason: 'delivery_failed' })); }
  } catch (err) {
    console.error('[inquiry] delivery threw', err);
    return res.status(502).send(JSON.stringify({ ok: false, reason: 'delivery_failed' }));
  }
  return res.status(200).send(JSON.stringify({ ok: true }));
}
