import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { Config } from '../config';
import { runDue, type Fetch } from './delivery';
import { queueFor, targetsFor } from './routing';
import { validateLead, type FieldError } from './schema';
import type { LeadStore } from './store';

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ'; // no 0/O/1/I/L/U: readable aloud in any language
export function newRef() {
  const b = randomBytes(6);
  return 'PI-' + [...b].map((x) => ALPHABET[x % ALPHABET.length]).join('');
}

export type SubmitResult =
  | { ok: true; status: 200 | 201; ref: string; duplicate: boolean; delivery: string }
  | { ok: false; status: 400; errors: FieldError[] }
  | { ok: false; status: 429 }
  | { ok: false; status: 503; reason: 'not_configured' | 'storage_failed' };

export interface SubmitCtx {
  cfg: Config;
  store: LeadStore | null;
  ip: string | null;
  userAgent: string | null;
  fetch?: Fetch;
  /** requests per 10 minutes from one address; phone intake is authenticated and exempt */
  rateLimit?: number | null;
}

export const hashIp = (ip: string, salt: string) => createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);

/**
 * The one door every lead comes through — form, assistant (voice or text) and phone intake.
 * Success is returned only after the lead is committed to the database.
 */
export async function submitLead(raw: unknown, ctx: SubmitCtx): Promise<SubmitResult> {
  if (!ctx.store) return { ok: false, status: 503, reason: 'not_configured' };
  const ipHash = ctx.ip ? hashIp(ctx.ip, ctx.cfg.ipSalt) : null;

  try {
    if (ctx.rateLimit && ipHash && (await ctx.store.hit(`lead:${ipHash}`, 600)) > ctx.rateLimit) return { ok: false, status: 429 };
  } catch {
    return { ok: false, status: 503, reason: 'storage_failed' };
  }

  const v = validateLead(raw);
  if (!v.ok) return { ok: false, status: 400, errors: v.errors };
  const lead = v.lead;

  const queue = queueFor(lead);
  const targets = targetsFor(queue, ctx.cfg);
  const dedupeHash = createHash('sha256')
    .update([lead.phone ?? '', lead.email ?? '', [...lead.categories].sort().join(','), lead.summary.toLowerCase()].join('|'))
    .digest('hex');

  let row, created;
  try {
    ({ lead: row, created } = await ctx.store.insertLead({
      id: randomUUID(), ref: newRef(), lead, queue, dedupeHash, ipHash,
      userAgent: ctx.userAgent?.slice(0, 300) ?? null, targets, dedupeWindowMinutes: 10,
    }));
  } catch (e) {
    console.error('[leads] insert failed:', e instanceof Error ? e.message : e);
    return { ok: false, status: 503, reason: 'storage_failed' };
  }
  if (!created) return { ok: true, status: 200, ref: row.ref, duplicate: true, delivery: row.delivery_status };

  // The lead is durable now. Delivery to reps is attempted immediately; if it fails,
  // the retry job picks it up — the customer's confirmation does not depend on it.
  let delivery = row.delivery_status;
  try {
    await runDue({ cfg: ctx.cfg, store: ctx.store, fetch: ctx.fetch }, { leadId: row.id });
    delivery = await ctx.store.refreshLeadStatus(row.id);
  } catch (e) {
    console.error('[leads] immediate delivery errored:', e instanceof Error ? e.message : e);
  }
  return { ok: true, status: 201, ref: row.ref, duplicate: false, delivery };
}
