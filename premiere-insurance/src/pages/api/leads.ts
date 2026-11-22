import type { APIRoute } from 'astro';
import { submitLead } from '../../server/leads/pipeline';
import { json, readJson, runtime, sameOrigin } from '../../server/runtime';

export const prerender = false;

/** Website form and assistant submissions. Success (with a reference) is returned only after the lead is stored. */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!sameOrigin(request)) return json({ ok: false, error: 'forbidden' }, 403);
  const body = await readJson(request);
  if (!body.ok) return json({ ok: false, error: 'bad_request' }, body.status);
  const raw = body.body as Record<string, unknown> | null;
  // The phone channel has its own authenticated endpoint; the public one cannot claim it.
  if (!raw || typeof raw !== 'object' || raw.source === 'phone') return json({ ok: false, error: 'bad_request' }, 400);

  const { cfg, store } = runtime();
  let ip: string | null = null;
  try { ip = clientAddress; } catch { /* not available on every adapter */ }
  const r = await submitLead(raw, { cfg, store, ip, userAgent: request.headers.get('user-agent'), rateLimit: 6 });

  if (r.ok) return json({ ok: true, reference: r.ref, duplicate: r.duplicate }, r.status);
  if (r.status === 400) return json({ ok: false, error: 'invalid', fields: r.errors }, 400);
  if (r.status === 429) return json({ ok: false, error: 'rate_limited' }, 429, { 'retry-after': '60' });
  return json({ ok: false, error: 'unavailable' }, 503);
};
