import { readFileSync } from 'node:fs';
import pg from 'pg';
import type { Config } from '../../src/server/config';
import { PgLeadStore } from '../../src/server/leads/store';

// The lead pipeline is tested against a real PostgreSQL, never a stand-in.
// Without TEST_DATABASE_URL the database suites FAIL rather than skip, so a
// green run always means the database behaviour was actually exercised.
export const TEST_DB = process.env.TEST_DATABASE_URL;

export async function freshDb() {
  if (!TEST_DB) throw new Error('TEST_DATABASE_URL is required: these tests run against a real PostgreSQL.');
  const pool = new pg.Pool({ connectionString: TEST_DB, max: 4 });
  await pool.query('drop table if exists lead_events, lead_deliveries, leads, rate_limits cascade');
  await pool.query(readFileSync(new URL('../../db/schema.sql', import.meta.url), 'utf8'));
  return { pool, store: new PgLeadStore(pool) };
}

export const cfg = (over: Partial<Config> = {}): Config => ({
  databaseUrl: TEST_DB, ipSalt: 'test-salt',
  routes: { personal: ['personal@example.com'], commercial: ['commercial@example.com'], general: ['office@example.com'] },
  alertEmails: ['owner@example.com'], resendKey: 're_test', fromEmail: 'Premiere Leads <leads@example.com>',
  crmWebhookUrl: undefined, crmWebhookSecret: undefined, staffToken: 'staff-token', cronSecret: 'cron', phoneWebhookSecret: 'phone-secret',
  anthropicKey: undefined, assistantModel: 'claude-opus-5-5', siteUrl: 'https://example.test', ...over,
});

let n = 0;
export const lead = (over: Record<string, unknown> = {}) => ({
  idempotencyKey: `test-key-${Date.now()}-${++n}-abcdef`,
  source: 'form', locale: 'en', name: 'Maria Souza', phone: '(978) 555-0142', email: 'maria@example.com',
  categories: ['personal_auto'], summary: 'Need auto insurance for a 2019 Corolla.', ...over,
});

/** A scripted email/CRM provider. Records every call; fails while `failing` is true. */
export function fakeProvider() {
  const calls: { url: string; body: any; headers: Record<string, string> }[] = [];
  const state = { failing: false, status: 500, hang: false };
  const fetchImpl = (async (url: any, init: any) => {
    calls.push({ url: String(url), body: JSON.parse(init.body), headers: init.headers });
    if (state.hang) return new Promise((_, rej) => init.signal.addEventListener('abort', () => rej(Object.assign(new Error('aborted'), { name: 'AbortError' }))));
    if (state.failing) return new Response('{"message":"down"}', { status: state.status });
    return new Response(JSON.stringify({ id: `msg_${calls.length}` }), { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
  return { calls, state, fetch: fetchImpl };
}
