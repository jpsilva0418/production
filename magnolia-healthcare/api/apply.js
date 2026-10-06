// Vercel Serverless Function — caregiver application handler.
// Same contract as api/inquiry.js (ported from the Leti Silva Beauty inquiry Worker):
// honeypot, per-instance throttle, required-contact validation, and honest modes —
//   RESEND_API_KEY + INQUIRY_TO_EMAIL set -> deliver via Resend (reply_to = applicant)
//   not configured (the DEMO)             -> accept and discard, { ok, staged: true }
// The email reproduces the paper form's sections in order, including a blank
// "For Magnolia Healthcare Inc. use only" block for the office.

const SECTIONS = [
  ['Personal information', [['fullName', 'Full legal name', 120], ['phone', 'Phone', 40], ['email', 'Email', 160], ['address', 'Address', 200], ['city', 'City', 80], ['state', 'State', 40], ['zip', 'ZIP', 10]]],
  ['Availability', [['days', 'Days available', 200], ['times', 'Preferred time', 80]]],
  ['Professional certification & license', [['hasCert', 'CNA, HHA or other healthcare-related license/certification', 10], ['certType', 'Type', 40], ['certTypeOther', 'Type (other)', 120], ['certNumber', 'License / certification number', 80], ['certState', 'State', 40], ['certExpiry', 'Expiration date', 40]]],
  ['Caregiving experience', [['hasExperience', 'Previous caregiving experience', 10], ['years', 'Years of caregiving experience', 10], ['workedAt', 'Where have you worked', 300]]],
  ['Areas of experience', [['areas', 'Areas of experience', 600], ['areasOther', 'Other', 200]]],
  ['Employment / caregiving history', [['emp1Employer', 'Experience 1 — employer / agency', 120], ['emp1Position', 'Experience 1 — position', 120], ['emp1Dates', 'Experience 1 — dates of employment', 80], ['emp1Supervisor', 'Experience 1 — supervisor / contact', 160], ['emp2Employer', 'Experience 2 — employer / agency', 120], ['emp2Position', 'Experience 2 — position', 120], ['emp2Dates', 'Experience 2 — dates of employment', 80], ['emp2Supervisor', 'Experience 2 — supervisor / contact', 160]]],
  ['Professional references', [['ref1Name', 'Reference 1 — name / relationship', 160], ['ref1Contact', 'Reference 1 — phone / email', 160], ['ref2Name', 'Reference 2 — name / relationship', 160], ['ref2Contact', 'Reference 2 — phone / email', 160]]],
  ['Applicant certification', [['certify', 'Certification acknowledged', 10], ['signature', 'Applicant signature (typed)', 120], ['signDate', 'Date', 40]]],
];
const FIELDS = SECTIONS.flatMap(([, f]) => f);
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
const recent = new Map();
function rateLimited(ip, windowMs = 60_000, max = 4) {
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
  if (record.certify !== 'Yes' || !record.signature) return res.status(422).send(JSON.stringify({ ok: false, reason: 'missing_certification' }));

  const { RESEND_API_KEY, INQUIRY_TO_EMAIL, INQUIRY_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !INQUIRY_TO_EMAIL) {
    console.warn('[apply] delivery not configured — accepted in demo mode (nothing sent).');
    return res.status(200).send(JSON.stringify({ ok: true, staged: true }));
  }
  const cell = (label, value) => `<tr><td style="color:#4A5450;vertical-align:top;width:40%"><strong>${esc(label)}</strong></td><td style="white-space:pre-wrap">${esc(value)}</td></tr>`;
  const html = `<h2 style="font-family:Georgia,serif">Caregiver application — Magnolia Healthcare website</h2>` +
    SECTIONS.map(([title, fields]) => {
      const rows = fields.filter(([k]) => record[k]).map(([k, label]) => cell(label, record[k])).join('');
      return rows ? `<h3 style="font-family:Georgia,serif;margin-top:22px">${esc(title)}</h3><table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;width:100%">${rows}</table>` : '';
    }).join('') +
    `<h3 style="font-family:Georgia,serif;margin-top:28px;border-top:1px solid #ccc;padding-top:12px">For Magnolia Healthcare Inc. use only</h3>` +
    `<p style="font-family:sans-serif;font-size:14px">Date received: ____________ &nbsp; Reviewed by: ____________<br>Application status: ☐ Approved to proceed &nbsp; ☐ Not selected &nbsp; ☐ Follow-up needed</p>`;
  const text = SECTIONS.map(([title, fields]) => { const rows = fields.filter(([k]) => record[k]).map(([k, label]) => `${label}: ${record[k]}`); return rows.length ? `${title.toUpperCase()}\n${rows.join('\n')}` : ''; }).filter(Boolean).join('\n\n');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: INQUIRY_FROM_EMAIL || 'Magnolia Healthcare Website <onboarding@resend.dev>', to: INQUIRY_TO_EMAIL, reply_to: record.email, subject: `Caregiver application — ${record.fullName}`, html, text }),
  });
  if (!r.ok) { console.error('[apply] Resend rejected the email', r.status, await r.text()); return res.status(502).send(JSON.stringify({ ok: false, reason: 'delivery_failed' })); }
  return res.status(200).send(JSON.stringify({ ok: true }));
}
