/* ==========================================================================
   INQUIRY — the one transport every form on this site uses.

   There is exactly one submission path. The contact form and the planner's
   final step both call `sendInquiry()`; neither owns its own fetch, its own
   endpoint, or its own idea of what "sent" means.

   HONESTY RULE, and the reason this module exists:
   a form may never claim to have sent something it did not send. When no
   endpoint is configured, `sendInquiry` returns `{ ok: false, reason:
   'unconfigured' }` and the UI must show the email handoff instead of a
   success state. There is no silent fallback and no fake confirmation.

   CONFIGURING IT (one environment variable, no code change):
     PUBLIC_INQUIRY_ENDPOINT=https://…
   Any endpoint that accepts a JSON POST works — Formspree, Web3Forms, Basin,
   Netlify Forms, or a Cloudflare Worker of your own. Set it in the host's
   environment settings and redeploy. It is a PUBLIC_ variable because the
   POST happens in the browser; never put a private API key here, since
   anything with a PUBLIC_ prefix ships to the client. Services needing a
   secret key must be called from a server route instead.

   If you later add a server route, point this at `/api/inquiry` and
   implement the checklist in the README (size limit, Origin check, strict
   re-validation, CR/LF stripping on mail headers, Turnstile that fails open,
   persist-then-send, quarantine rather than drop).
   ========================================================================== */

/* The site's own function, same origin, is the default. It is a path and not
   a secret, so hard-coding the fallback is safe — and it removes a whole
   class of production failure: if PUBLIC_INQUIRY_ENDPOINT is ever missing
   from the build environment, the forms still post to the real backend
   instead of silently degrading to the email handoff. Set the variable only
   to point the forms somewhere else. */
export const ENDPOINT: string =
  (import.meta.env.PUBLIC_INQUIRY_ENDPOINT as string | undefined) || '/api/inquiry';

export const isConfigured = ENDPOINT.length > 0;

export interface Inquiry {
  /** Which surface it came from — the contact page or the planner. */
  source: 'contact' | 'planner';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  /** One of NEED_OPTIONS in data/services.ts. */
  need?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  /** The planner's full answer set and derived plan, when source is planner. */
  plan?: unknown;
  /** Honeypot. Populated only by bots; a filled value is rejected locally. */
  trap?: string;
}

export type Result =
  | { ok: true; id?: string }
  /** `code` is the backend's own error word — `bad_origin`, `send_failed`,
      `rate_limited`, `email_invalid` — so a failure can be told apart in the
      field instead of guessed at from a status number. */
  | { ok: false; reason: 'unconfigured' | 'network' | 'server' | 'spam'; status?: number; code?: string };

/** A mailto: the UI offers whenever sending is not possible, so an inquiry is
    never lost to a misconfiguration. Built from the same payload. */
export function mailtoFor(d: Inquiry, to: string): string {
  const lines = [
    d.company ? `Business: ${d.company}` : '',
    d.website ? `Current website: ${d.website}` : '',
    d.need ? `Looking for: ${d.need}` : '',
    d.budget ? `Budget: ${d.budget}` : '',
    d.timeline ? `Timeline: ${d.timeline}` : '',
    d.phone ? `Phone: ${d.phone}` : '',
    '',
    d.message ?? '',
  ].filter(Boolean);
  const subject = `Inquiry — ${d.company || d.name || 'my business'}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

export async function sendInquiry(data: Inquiry): Promise<Result> {
  /* Honeypot: a real person never sees this field, so anything in it is a bot.
     Reported as 'spam' so the caller can show the success state without
     sending — the standard way to avoid teaching a bot what rejection
     looks like. */
  if (data.trap) return { ok: false, reason: 'spam' };

  if (!isConfigured) return { ok: false, reason: 'unconfigured' };

  const { trap, ...payload } = data;

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...payload,
        page: typeof location !== 'undefined' ? location.pathname : undefined,
        submittedAt: new Date().toISOString(),
      }),
    });

    /* HTTP 2xx is not the question. The question is whether the message was
       accepted for delivery, and only the body answers it: `id` is the real
       provider message id, `duplicate` means the same submission was already
       accepted moments ago, `skipped` is the honeypot. A 2xx with none of
       those is not a send and is not reported as one. */
    const body = (await res.json().catch(() => null)) as
      | { ok?: boolean; id?: string; duplicate?: boolean; skipped?: string; error?: string }
      | null;

    if (!res.ok || !body?.ok) {
      return { ok: false, reason: 'server', status: res.status, code: body?.error };
    }
    if (body.id || body.duplicate || body.skipped) return { ok: true, id: body.id };
    return { ok: false, reason: 'server', status: res.status, code: 'no_message_id' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
