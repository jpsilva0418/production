import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type pg from 'pg';
import { MAX_ATTEMPTS, runDue } from '../../src/server/leads/delivery';
import { submitLead } from '../../src/server/leads/pipeline';
import type { PgLeadStore } from '../../src/server/leads/store';
import { cfg, fakeProvider, freshDb, lead } from './helpers';

let pool: pg.Pool, store: PgLeadStore;
beforeAll(async () => ({ pool, store } = await freshDb()));
afterAll(async () => pool?.end());
beforeEach(async () => pool.query('truncate lead_events, lead_deliveries, leads, rate_limits restart identity cascade'));

const ctx = (p = fakeProvider(), over = {}) => ({ cfg: cfg(over), store, ip: '203.0.113.9', userAgent: 'vitest', fetch: p.fetch, rateLimit: 6 });
const one = async (sql: string, args: unknown[] = []) => (await pool.query(sql, args)).rows;

describe('submitting a lead', () => {
  it('stores it, emails the right queue, and only then reports success with a reference', async () => {
    const p = fakeProvider();
    const r = await submitLead(lead({ categories: ['workers_comp'], locale: 'pt', source: 'web_voice' }), ctx(p));
    expect(r).toMatchObject({ ok: true, status: 201, duplicate: false, delivery: 'delivered' });
    if (!r.ok) throw new Error();
    expect(r.ref).toMatch(/^PI-[2-9A-Z]{6}$/);

    const [row] = await one('select * from leads');
    expect(row).toMatchObject({ ref: r.ref, queue: 'commercial', line: 'commercial', locale: 'pt', source: 'web_voice', delivery_status: 'delivered', follow_up_status: 'new', phone: '+19785550142' });
    expect(row.ip_hash).toHaveLength(32);
    expect(row.ip_hash).not.toContain('203.0.113.9');

    expect(p.calls).toHaveLength(1);
    expect(p.calls[0].url).toBe('https://api.resend.com/emails');
    expect(p.calls[0].body.to).toEqual(['commercial@example.com']);
    expect(p.calls[0].body.reply_to).toBe('maria@example.com');
    expect(p.calls[0].body.subject).toContain(r.ref);
    expect(p.calls[0].body.text).toContain('Portuguese');
    expect(p.calls[0].headers['idempotency-key']).toMatch(/^lead-/);

    const events = (await one('select type from lead_events order by id')).map((e) => e.type);
    expect(events).toEqual(['lead_created', 'delivery_succeeded']);
  });

  it('routes a personal lead to the personal reps and an unclear one to the general queue', async () => {
    const p = fakeProvider();
    await submitLead(lead({ categories: ['homeowners'] }), ctx(p));
    await submitLead(lead({ categories: [], phone: '978-555-0199', email: null, summary: 'not sure what I need' }), ctx(p));
    expect(p.calls.map((c) => c.body.to[0])).toEqual(['personal@example.com', 'office@example.com']);
  });

  it('is idempotent: the same key returns the same reference and delivers once', async () => {
    const p = fakeProvider();
    const body = lead();
    const a = await submitLead(body, ctx(p));
    const b = await submitLead(body, ctx(p));
    expect(b).toMatchObject({ ok: true, status: 200, duplicate: true });
    expect((a as any).ref).toBe((b as any).ref);
    expect(await one('select 1 from leads')).toHaveLength(1);
    expect(p.calls).toHaveLength(1);
  });

  it('survives a double-tap: two simultaneous submissions create one lead', async () => {
    const p = fakeProvider();
    const body = lead();
    const rs = await Promise.all([submitLead(body, ctx(p)), submitLead(body, ctx(p)), submitLead(body, ctx(p))]);
    expect(new Set(rs.map((r: any) => r.ref)).size).toBe(1);
    expect(await one('select 1 from leads')).toHaveLength(1);
    expect(p.calls).toHaveLength(1);
  });

  it('de-duplicates the same inquiry re-sent with a new key within ten minutes', async () => {
    const p = fakeProvider();
    const a = await submitLead(lead(), ctx(p));
    const b = await submitLead(lead(), ctx(p));
    expect(b).toMatchObject({ duplicate: true });
    expect((a as any).ref).toBe((b as any).ref);
    await pool.query(`update leads set created_at = now() - interval '11 minutes'`);
    const c = await submitLead(lead(), ctx(p));
    expect(c).toMatchObject({ duplicate: false, status: 201 });
  });

  it('rejects invalid contact details without storing anything', async () => {
    const r = await submitLead(lead({ phone: '123', email: null }), ctx());
    expect(r).toEqual({ ok: false, status: 400, errors: ['phone'] });
    expect(await one('select 1 from leads')).toHaveLength(0);
  });

  it('quarantines honeypot submissions: kept for review, never emailed', async () => {
    const p = fakeProvider();
    const r = await submitLead(lead({ company_website: 'http://spam.example' }), ctx(p));
    expect(r.ok).toBe(true);
    const [row] = await one('select queue, follow_up_status, delivery_status from leads');
    expect(row).toEqual({ queue: 'quarantine', follow_up_status: 'spam', delivery_status: 'held' });
    expect(p.calls).toHaveLength(0);
  });

  it('rate-limits one address', async () => {
    const p = fakeProvider();
    const results = [];
    for (let i = 0; i < 8; i++) results.push(await submitLead(lead({ phone: `978-555-01${10 + i}`, email: null }), ctx(p)));
    expect(results.filter((r) => r.ok)).toHaveLength(6);
    expect(results.at(-1)).toEqual({ ok: false, status: 429 });
  });

  it('reports "unavailable" — not success — when there is no database or the write fails', async () => {
    expect(await submitLead(lead(), { ...ctx(), store: null })).toEqual({ ok: false, status: 503, reason: 'not_configured' });
    const broken = Object.create(store, { insertLead: { value: async () => { throw new Error('connection lost'); } } });
    expect(await submitLead(lead(), { ...ctx(), store: broken })).toEqual({ ok: false, status: 503, reason: 'storage_failed' });
    expect(await one('select 1 from leads')).toHaveLength(0);
  });

  it('works with the inbox alone when no email provider is configured', async () => {
    const p = fakeProvider();
    const r = await submitLead(lead(), ctx(p, { resendKey: undefined }));
    expect(r).toMatchObject({ ok: true, delivery: 'delivered' });
    expect(p.calls).toHaveLength(0);
    expect(await one(`select channel, status from lead_deliveries`)).toEqual([{ channel: 'inbox', status: 'delivered' }]);
  });
});

describe('delivery failures', () => {
  it('keeps the lead, confirms to the customer, and retries until the provider recovers', async () => {
    const p = fakeProvider();
    p.state.failing = true;
    const r = await submitLead(lead(), ctx(p));
    expect(r).toMatchObject({ ok: true, status: 201, delivery: 'failed' }); // durable, so the customer is told it was received
    let [d] = await one(`select * from lead_deliveries where channel='email'`);
    expect(d).toMatchObject({ status: 'failed', attempts: 1, last_error: 'email provider responded 500' });
    expect(new Date(d.next_attempt_at).getTime()).toBeGreaterThan(Date.now() + 30_000);

    // Not due yet: the retry job leaves it alone.
    expect(await runDue({ cfg: cfg(), store, fetch: p.fetch })).toMatchObject({ attempted: 0 });

    p.state.failing = false;
    await pool.query(`update lead_deliveries set next_attempt_at = now() - interval '1 second' where channel='email'`);
    expect(await runDue({ cfg: cfg(), store, fetch: p.fetch })).toEqual({ attempted: 1, delivered: 1, failed: 0 });
    [d] = await one(`select * from lead_deliveries where channel='email'`);
    expect(d).toMatchObject({ status: 'delivered', attempts: 2, last_error: null });
    expect((await one('select delivery_status from leads'))[0].delivery_status).toBe('delivered');
  });

  it('gives up after the last attempt, marks the lead dead and alerts staff', async () => {
    const p = fakeProvider();
    p.state.failing = true;
    await submitLead(lead(), ctx(p));
    for (let i = 1; i < MAX_ATTEMPTS; i++) {
      await pool.query(`update lead_deliveries set next_attempt_at = now() - interval '1 second' where channel='email'`);
      await runDue({ cfg: cfg(), store, fetch: p.fetch });
    }
    const [d] = await one(`select status, attempts from lead_deliveries where channel='email'`);
    expect(d).toEqual({ status: 'dead', attempts: MAX_ATTEMPTS });
    expect((await one('select delivery_status from leads'))[0].delivery_status).toBe('dead');
    const alert = p.calls.at(-1)!;
    expect(alert.body.to).toEqual(['owner@example.com']);
    expect(alert.body.subject).toMatch(/ACTION NEEDED/);
    expect((await one(`select 1 from lead_events where type='delivery_alert'`)).length).toBe(1);
    // Dead deliveries are not retried forever…
    expect(await runDue({ cfg: cfg(), store, fetch: p.fetch })).toMatchObject({ attempted: 0 });
    // …until a person re-queues them from the inbox.
    const [l] = await one('select id from leads');
    p.state.failing = false;
    await store.requeue(l.id, 'staff');
    expect(await runDue({ cfg: cfg(), store, fetch: p.fetch })).toMatchObject({ delivered: 1 });
  });

  it('treats a provider timeout as a failed attempt, not a hang', async () => {
    const p = fakeProvider();
    p.state.hang = true;
    const r = await submitLead(lead(), ctx(p));
    expect(r).toMatchObject({ ok: true, delivery: 'failed' });
    expect((await one(`select last_error from lead_deliveries where channel='email'`))[0].last_error).toBe('timed out');
  }, 15_000);

  it('signs CRM webhooks and tracks them independently of email', async () => {
    const p = fakeProvider();
    await submitLead(lead(), ctx(p, { crmWebhookUrl: 'https://crm.example.com/hooks/leads', crmWebhookSecret: 'shh' }));
    const hook = p.calls.find((c) => c.url.includes('crm.example.com'))!;
    expect(hook.headers['x-premiere-signature']).toMatch(/^sha256=[0-9a-f]{64}$/);
    expect(hook.body.lead).toMatchObject({ queue: 'personal', contact: { name: 'Maria Souza', phone: '+19785550142' }, categories: ['personal_auto'] });
    expect(await one(`select channel, status from lead_deliveries order by id`)).toEqual([
      { channel: 'inbox', status: 'delivered' }, { channel: 'email', status: 'delivered' }, { channel: 'webhook', status: 'delivered' },
    ]);
  });
});

describe('database guarantees', () => {
  it('refuses a lead with no way to reach the customer, even if application checks were bypassed', async () => {
    await expect(pool.query(`insert into leads (id, ref, idempotency_key, dedupe_hash, source, locale, name, line, queue) values (gen_random_uuid(),'PI-X','k','h','form','en','A B','personal','personal')`)).rejects.toThrow(/leads_contact_present/);
  });
  it('has row level security on every table, so the Supabase REST roles see nothing', async () => {
    const rows = await one(`select relname, relrowsecurity from pg_class where relname in ('leads','lead_deliveries','lead_events','rate_limits')`);
    expect(rows).toHaveLength(4);
    expect(rows.every((r) => r.relrowsecurity)).toBe(true);
    expect(await one(`select 1 from pg_policies where tablename in ('leads','lead_deliveries','lead_events','rate_limits')`)).toHaveLength(0);
  });
});
