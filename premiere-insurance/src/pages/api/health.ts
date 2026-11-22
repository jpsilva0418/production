import type { APIRoute } from 'astro';
import { json, runtime } from '../../server/runtime';

export const prerender = false;

/** Which integrations are live on this deployment. Booleans only — never a secret, address or count. */
export const GET: APIRoute = async () => {
  const { cfg, store } = runtime();
  const database = store ? await store.ping() : false;
  return json({
    ok: true,
    leads: { database, emailDelivery: !!(cfg.resendKey && cfg.fromEmail), repsConfigured: { personal: cfg.routes.personal.length > 0, commercial: cfg.routes.commercial.length > 0, general: cfg.routes.general.length > 0 }, crmWebhook: !!cfg.crmWebhookUrl, staffInbox: !!cfg.staffToken },
    assistant: { engine: cfg.anthropicKey ? 'llm' : 'guided' },
    phoneIntake: !!cfg.phoneWebhookSecret,
  });
};
