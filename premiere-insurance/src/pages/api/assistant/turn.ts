import type { APIRoute } from 'astro';
import { parseTurn, runTurn } from '../../../server/assistant/turn';
import { hashIp } from '../../../server/leads/pipeline';
import { json, readJson, runtime, sameOrigin } from '../../../server/runtime';

export const prerender = false;

/** One conversational turn. Stateless: the browser sends the transcript and the draft; nothing is stored here. */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!sameOrigin(request)) return json({ ok: false, error: 'forbidden' }, 403);
  const body = await readJson(request, 64_000);
  if (!body.ok) return json({ ok: false, error: 'bad_request' }, body.status);
  const turn = parseTurn(body.body);
  if (!turn) return json({ ok: false, error: 'bad_request' }, 400);

  const { cfg, store } = runtime();
  // Rate limiting protects the paid model. Without a database the guided engine still answers.
  if (store) {
    try {
      let ip = 'unknown';
      try { ip = clientAddress; } catch { /* adapter without client address */ }
      if ((await store.hit(`turn:${hashIp(ip, cfg.ipSalt)}`, 600)) > 80) return json({ ok: false, error: 'rate_limited' }, 429, { 'retry-after': '60' });
    } catch { /* storage hiccup: do not block the conversation */ }
  }
  const out = await runTurn(turn, store || !cfg.anthropicKey ? cfg : { ...cfg, anthropicKey: undefined });
  return json({ ok: true, ...out });
};
