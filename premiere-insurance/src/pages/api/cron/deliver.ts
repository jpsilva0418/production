import type { APIRoute } from 'astro';
import { timingSafeEqual } from 'node:crypto';
import { runDue } from '../../../server/leads/delivery';
import { json, runtime } from '../../../server/runtime';

export const prerender = false;

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/** Retry job: delivers every lead whose email/CRM delivery is pending or due for another attempt. */
export const GET: APIRoute = async ({ request }) => {
  const { cfg, store } = runtime();
  if (!cfg.cronSecret || !store) return json({ ok: false, error: 'not_configured' }, 503);
  if (!same(request.headers.get('authorization') ?? '', `Bearer ${cfg.cronSecret}`)) return json({ ok: false, error: 'unauthorized' }, 401);
  return json({ ok: true, ...(await runDue({ cfg, store }, { limit: 40 })) });
};
