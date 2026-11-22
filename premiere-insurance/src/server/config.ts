// Every secret and integration switch is read here, server-side only.
// Nothing in this file is ever imported by browser code.

const env = (k: string): string | undefined => {
  const v = process.env[k] ?? (import.meta as any).env?.[k];
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
};
const list = (k: string) => (env(k) ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

export function config() {
  return {
    databaseUrl: env('DATABASE_URL'),
    ipSalt: env('IP_HASH_SALT') ?? 'premiere-dev-salt',
    // Routing: who receives which queue. Unset queues fall back to `general`.
    routes: {
      personal: list('LEAD_ROUTE_PERSONAL'),
      commercial: list('LEAD_ROUTE_COMMERCIAL'),
      general: list('LEAD_ROUTE_GENERAL'),
    },
    alertEmails: list('LEAD_ALERT_EMAIL'),
    resendKey: env('RESEND_API_KEY'),
    fromEmail: env('LEADS_FROM_EMAIL'),
    crmWebhookUrl: env('CRM_WEBHOOK_URL'),
    crmWebhookSecret: env('CRM_WEBHOOK_SECRET'),
    staffToken: env('STAFF_INBOX_TOKEN'),
    cronSecret: env('CRON_SECRET'),
    phoneWebhookSecret: env('PHONE_WEBHOOK_SECRET'),
    anthropicKey: env('ANTHROPIC_API_KEY'),
    assistantModel: env('ASSISTANT_MODEL') ?? 'claude-haiku-5-5',
    siteUrl: env('PUBLIC_SITE_URL') ?? 'https://www.premiereinsuranceinc.com',
  };
}
export type Config = ReturnType<typeof config>;
