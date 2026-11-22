import type { Config } from '../config';
import type { ValidLead } from './schema';

export type Queue = 'personal' | 'commercial' | 'general' | 'quarantine';

/** Personal and commercial inquiries go to separate queues; anything mixed or unclear goes to general. */
export function queueFor(lead: Pick<ValidLead, 'line' | 'honeypot'>): Queue {
  if (lead.honeypot) return 'quarantine';
  if (lead.line === 'personal') return 'personal';
  if (lead.line === 'commercial') return 'commercial';
  return 'general';
}

export interface DeliveryTarget {
  channel: 'inbox' | 'email' | 'webhook';
  target: string;
}

/**
 * Where a lead in `queue` must be delivered.
 *  - `inbox`   the staff lead inbox backed by the database (always present)
 *  - `email`   the representatives configured for the queue, falling back to general
 *  - `webhook` the CRM endpoint, when one is configured
 * Quarantined (suspected spam) leads are kept in the inbox only.
 */
export function targetsFor(queue: Queue, cfg: Pick<Config, 'routes' | 'resendKey' | 'fromEmail' | 'crmWebhookUrl'>): DeliveryTarget[] {
  const targets: DeliveryTarget[] = [{ channel: 'inbox', target: queue }];
  if (queue === 'quarantine') return targets;
  if (cfg.resendKey && cfg.fromEmail) {
    const reps = cfg.routes[queue].length ? cfg.routes[queue] : cfg.routes.general;
    for (const email of reps) targets.push({ channel: 'email', target: email });
  }
  if (cfg.crmWebhookUrl) targets.push({ channel: 'webhook', target: new URL(cfg.crmWebhookUrl).host });
  return targets;
}
