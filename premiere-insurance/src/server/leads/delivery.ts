import { createHmac } from 'node:crypto';
import type { Config } from '../config';
import type { DeliveryRow, LeadRow, LeadStore } from './store';

export const MAX_ATTEMPTS = 6;
// 1 min, 5 min, 15 min, 1 h, 6 h — then the delivery is marked dead and staff are alerted.
const BACKOFF_MIN = [1, 5, 15, 60, 360];
export const retryDelayMs = (attemptsSoFar: number) => BACKOFF_MIN[Math.min(attemptsSoFar, BACKOFF_MIN.length - 1)] * 60_000;

export type Fetch = typeof fetch;
export interface Deps {
  cfg: Config;
  store: LeadStore;
  fetch?: Fetch;
  now?: () => Date;
}

const LABEL: Record<string, string> = {
  life: 'Life', homeowners: 'Homeowners / Renters', personal_auto: 'Personal Auto', recreational: 'Boat / PWC / Snowmobile',
  commercial_auto: 'Commercial Auto', general_liability: 'Businessowner / General Liability', workers_comp: "Workers' Compensation",
  commercial_property: 'Commercial Property', inland_marine: 'Inland Marine', umbrella: 'Umbrella', other: 'Other / not sure',
};
const SOURCE: Record<string, string> = { web_voice: 'Website AI assistant (voice)', web_text: 'Website AI assistant (text)', form: 'Website quote form', phone: 'Phone AI intake' };
const LANG: Record<string, string> = { en: 'English', pt: 'Portuguese (Brazil)', es: 'Spanish' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** The structured payload a CRM receives. Also the shape documented in docs/BACKEND.md. */
export function leadPayload(l: LeadRow) {
  return {
    id: l.id, reference: l.ref, created_at: new Date(l.created_at).toISOString(), source: l.source, language: l.locale,
    queue: l.queue, line: l.line, categories: l.categories,
    contact: { name: l.name, phone: l.phone, email: l.email, preferred: l.preferred_contact, best_time: l.callback_time, sms_consent: l.sms_consent },
    state: l.state, urgency: l.urgency, summary: l.summary, details: l.details, transcript: l.transcript,
  };
}

export function leadEmail(l: LeadRow, siteUrl: string) {
  const cats = l.categories.map((c) => LABEL[c] ?? c).join(', ') || 'Not specified';
  const rows: [string, string | null][] = [
    ['Reference', l.ref], ['Queue', l.queue], ['Source', SOURCE[l.source] ?? l.source], ['Customer language', LANG[l.locale] ?? l.locale],
    ['Name', l.name], ['Phone', l.phone], ['Email', l.email], ['Preferred contact', l.preferred_contact], ['Best time', l.callback_time],
    ['Personal / business', l.line], ['Insurance', cats], ['State', l.state], ['Timing', l.urgency],
    ['Address', [l.details?.address, l.details?.city, l.details?.zip].filter(Boolean).join(', ') || null],
    ['SMS consent', l.sms_consent ? 'Yes' : 'No'],
  ];
  const text = [
    `New ${l.line} insurance inquiry — ${cats}`, '',
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), '',
    'What the customer asked for:', l.summary || '(no description given)', '',
    l.transcript ? 'Transcript (shared with customer consent):\n' + l.transcript.map((m) => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${m.text}`).join('\n') + '\n' : '',
    `Open in the lead inbox: ${siteUrl}/staff/leads`,
    'This inquiry was taken by the website. No coverage was quoted or promised.',
  ].join('\n');
  const html = `<div style="font:15px/1.5 Arial,sans-serif;color:#1a1b1f;max-width:560px">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#c44a00">${esc(l.queue)} queue · ${esc(l.ref)}</p>
<h1 style="font-size:20px;margin:0 0 16px">New ${esc(l.line)} inquiry — ${esc(cats)}</h1>
<table style="border-collapse:collapse;width:100%">${rows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5b5f66;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0"><strong>${esc(String(v))}</strong></td></tr>`).join('')}</table>
<h2 style="font-size:15px;margin:20px 0 6px">What the customer asked for</h2>
<p style="margin:0;padding:12px;background:#f5f5f3;border-left:3px solid #fd6301">${esc(l.summary || '(no description given)')}</p>
${l.transcript ? `<h2 style="font-size:15px;margin:20px 0 6px">Transcript (shared with customer consent)</h2>${l.transcript.map((m) => `<p style="margin:0 0 6px"><strong>${m.role === 'user' ? 'Customer' : 'Assistant'}:</strong> ${esc(m.text)}</p>`).join('')}` : ''}
<p style="margin:20px 0 0"><a href="${esc(siteUrl)}/staff/leads" style="color:#c44a00">Open the lead inbox</a></p>
<p style="margin:12px 0 0;font-size:12px;color:#5b5f66">Taken by the website. No coverage was quoted or promised.</p></div>`;
  return { subject: `[${l.queue}] ${l.name} — ${cats} (${l.ref})`, text, html };
}

async function withTimeout<T>(ms: number, run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), ms);
  try {
    return await run(ac.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function sendEmail(d: Deps, to: string[], msg: { subject: string; text: string; html?: string }, replyTo: string | null, idempotencyKey: string) {
  const f = d.fetch ?? fetch;
  const res = await withTimeout(8000, (signal) =>
    f('https://api.resend.com/emails', {
      method: 'POST',
      signal,
      // Resend de-duplicates on this key, so a retry after a lost response cannot double-send.
      headers: { authorization: `Bearer ${d.cfg.resendKey}`, 'content-type': 'application/json', 'idempotency-key': idempotencyKey },
      body: JSON.stringify({ from: d.cfg.fromEmail, to, subject: msg.subject, text: msg.text, html: msg.html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    }),
  );
  if (!res.ok) throw new Error(`email provider responded ${res.status}`);
  const body = (await res.json().catch(() => ({}))) as { id?: string };
  return body.id;
}

async function sendWebhook(d: Deps, lead: LeadRow) {
  const f = d.fetch ?? fetch;
  const body = JSON.stringify({ type: 'lead.created', lead: leadPayload(lead) });
  const ts = Math.floor((d.now?.() ?? new Date()).getTime() / 1000).toString();
  const headers: Record<string, string> = { 'content-type': 'application/json', 'x-premiere-timestamp': ts, 'idempotency-key': lead.id };
  if (d.cfg.crmWebhookSecret) headers['x-premiere-signature'] = 'sha256=' + createHmac('sha256', d.cfg.crmWebhookSecret).update(`${ts}.${body}`).digest('hex');
  const res = await withTimeout(8000, (signal) => f(d.cfg.crmWebhookUrl!, { method: 'POST', headers, body, signal }));
  if (!res.ok) throw new Error(`CRM endpoint responded ${res.status}`);
  return res.headers.get('x-request-id') ?? undefined;
}

/** Try one delivery. Never throws: the outcome is recorded on the row. */
export async function attemptDelivery(d: Deps, row: DeliveryRow, lead: LeadRow): Promise<boolean> {
  const now = d.now?.() ?? new Date();
  try {
    let providerId: string | undefined;
    if (row.channel === 'email') {
      if (!d.cfg.resendKey || !d.cfg.fromEmail) throw new Error('email delivery is not configured');
      providerId = await sendEmail(d, [row.target], leadEmail(lead, d.cfg.siteUrl), lead.email, `lead-${lead.id}-${row.id}`);
    } else if (row.channel === 'webhook') {
      if (!d.cfg.crmWebhookUrl) throw new Error('CRM webhook is not configured');
      providerId = await sendWebhook(d, lead);
    }
    await d.store.recordAttempt(row.id, { ok: true, providerId });
    return true;
  } catch (e) {
    const error = e instanceof Error ? (e.name === 'AbortError' ? 'timed out' : e.message) : 'unknown error';
    const dead = row.attempts + 1 >= MAX_ATTEMPTS;
    await d.store.recordAttempt(row.id, { ok: false, error, dead, retryAt: new Date(now.getTime() + retryDelayMs(row.attempts)) });
    if (dead) await alertStaff(d, lead, row, error);
    return false;
  }
}

/** A delivery that exhausted its retries must not fail silently. */
async function alertStaff(d: Deps, lead: LeadRow, row: DeliveryRow, error: string) {
  await d.store.addEvent(lead.id, 'system', 'delivery_alert', { channel: row.channel, target: row.target, error });
  console.error(`[leads] delivery dead ref=${lead.ref} channel=${row.channel} error=${error}`); // no customer data in logs
  if (!d.cfg.resendKey || !d.cfg.fromEmail || !d.cfg.alertEmails.length) return;
  try {
    await sendEmail(d, d.cfg.alertEmails, {
      subject: `ACTION NEEDED: lead ${lead.ref} could not be delivered`,
      text: `Lead ${lead.ref} (${lead.queue} queue) could not be delivered by ${row.channel} to ${row.target} after ${MAX_ATTEMPTS} attempts.\nLast error: ${error}\n\nThe lead is safe in the lead inbox: ${d.cfg.siteUrl}/staff/leads`,
    }, null, `alert-${lead.id}-${row.id}`);
  } catch {
    /* the event row and the inbox still show it */
  }
}

/** Run every delivery that is due. Called right after a submission and by the retry cron. */
export async function runDue(d: Deps, opts: { leadId?: string; limit?: number } = {}) {
  const due = opts.leadId
    ? (await d.store.deliveriesFor(opts.leadId)).filter((r) => (r.status === 'pending' || r.status === 'failed') && new Date(r.next_attempt_at) <= (d.now?.() ?? new Date()))
    : await d.store.dueDeliveries(opts.limit ?? 25);
  let delivered = 0, failed = 0;
  const touched = new Set<string>();
  for (const row of due) {
    const lead = await d.store.getLead(row.lead_id);
    if (!lead) continue;
    (await attemptDelivery(d, row, lead)) ? delivered++ : failed++;
    touched.add(row.lead_id);
  }
  for (const id of touched) await d.store.refreshLeadStatus(id);
  return { attempted: due.length, delivered, failed };
}
