import type { APIRoute } from 'astro';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { submitLead } from '../../../server/leads/pipeline';
import { json, readJson, runtime } from '../../../server/runtime';

export const prerender = false;

/**
 * Provider-neutral intake for a phone-answering AI (Twilio, Vapi, Retell, a SIP bot…).
 * OFF unless PHONE_WEBHOOK_SECRET is set. This endpoint never touches the business's
 * phone number or carrier: it only accepts the structured result of a call that some
 * approved telephony setup has already handled. See docs/PHONE.md.
 *
 * Auth: x-premiere-timestamp (unix seconds, ±5 min) and
 *       x-premiere-signature: sha256=HMAC(secret, `${timestamp}.${rawBody}`)
 */
export const POST: APIRoute = async ({ request }) => {
  const { cfg, store } = runtime();
  if (!cfg.phoneWebhookSecret) return json({ ok: false, error: 'not_enabled' }, 404);
  const body = await readJson(request);
  if (!body.ok) return json({ ok: false, error: 'bad_request' }, body.status);

  const ts = request.headers.get('x-premiere-timestamp') ?? '';
  const sig = request.headers.get('x-premiere-signature') ?? '';
  const expected = 'sha256=' + createHmac('sha256', cfg.phoneWebhookSecret).update(`${ts}.${body.raw}`).digest('hex');
  const fresh = Math.abs(Date.now() / 1000 - Number(ts)) < 300;
  if (!fresh || sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return json({ ok: false, error: 'unauthorized' }, 401);

  const b = (body.body ?? {}) as Record<string, any>;
  if (typeof b.call_id !== 'string' || !/^[A-Za-z0-9_-]{8,72}$/.test(b.call_id)) return json({ ok: false, error: 'invalid', fields: ['call_id'] }, 400);
  const r = await submitLead(
    {
      idempotencyKey: `phone-${b.call_id}`, // a provider retry of the same call can never create a second lead
      source: 'phone',
      locale: b.language,
      name: b.name,
      phone: b.callback_number ?? b.caller_number ?? null,
      email: b.email ?? null,
      preferredContact: b.preferred_contact ?? 'phone',
      line: b.line ?? null,
      categories: b.categories ?? [],
      state: b.state ?? null,
      urgency: b.urgency ?? null,
      callbackTime: b.best_time ?? null,
      summary: b.summary ?? '',
      // A transcript is kept only when the caller agreed to it on the call.
      transcript: b.recording_consent === true ? b.transcript ?? null : null,
      transcriptConsent: b.recording_consent === true,
    },
    { cfg, store, ip: null, userAgent: 'phone-intake', rateLimit: null },
  );
  if (r.ok) return json({ ok: true, reference: r.ref, duplicate: r.duplicate }, r.status);
  if (r.status === 400) return json({ ok: false, error: 'invalid', fields: r.errors }, 400);
  return json({ ok: false, error: 'unavailable' }, 503);
};
