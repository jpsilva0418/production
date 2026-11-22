import pg from 'pg';
import type { ValidLead } from './schema';
import type { DeliveryTarget, Queue } from './routing';

export interface LeadRow {
  id: string;
  ref: string;
  created_at: Date;
  source: string;
  locale: string;
  name: string;
  phone: string | null;
  email: string | null;
  preferred_contact: string | null;
  line: string;
  categories: string[];
  state: string | null;
  urgency: string | null;
  callback_time: string | null;
  summary: string;
  details: Record<string, string>;
  transcript: { role: string; text: string }[] | null;
  sms_consent: boolean;
  queue: Queue;
  delivery_status: string;
  follow_up_status: string;
}
export interface DeliveryRow {
  id: number;
  lead_id: string;
  channel: 'inbox' | 'email' | 'webhook';
  target: string;
  status: string;
  attempts: number;
  last_error: string | null;
  next_attempt_at: Date;
  delivered_at: Date | null;
}

export interface InsertResult {
  lead: LeadRow;
  created: boolean; // false => an earlier submission with the same key / same content was found
}

/** Storage boundary. The production implementation is Postgres; tests use the same one against a real database. */
export interface LeadStore {
  insertLead(a: { id: string; ref: string; lead: ValidLead; queue: Queue; dedupeHash: string; ipHash: string | null; userAgent: string | null; targets: DeliveryTarget[]; dedupeWindowMinutes: number }): Promise<InsertResult>;
  getLead(id: string): Promise<LeadRow | null>;
  listLeads(limit: number): Promise<(LeadRow & { deliveries: DeliveryRow[] })[]>;
  deliveriesFor(leadId: string): Promise<DeliveryRow[]>;
  dueDeliveries(limit: number): Promise<DeliveryRow[]>;
  recordAttempt(id: number, r: { ok: true; providerId?: string } | { ok: false; error: string; dead: boolean; retryAt: Date }): Promise<void>;
  refreshLeadStatus(leadId: string): Promise<string>;
  setFollowUp(leadId: string, status: string, actor: string): Promise<boolean>;
  requeue(leadId: string, actor: string): Promise<void>;
  addEvent(leadId: string | null, actor: string, type: string, detail?: Record<string, unknown>): Promise<void>;
  hit(key: string, windowSeconds: number): Promise<number>;
  ping(): Promise<boolean>;
}

let pool: pg.Pool | undefined;
export function getPool(url: string) {
  if (!pool) {
    const local = /@(localhost|127\.0\.0\.1|\/)/.test(url) || url.includes('host=/');
    pool = new pg.Pool({ connectionString: url, max: 3, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 5_000, ssl: local ? undefined : { rejectUnauthorized: false } });
  }
  return pool;
}
export async function closePool() {
  await pool?.end();
  pool = undefined;
}

export class PgLeadStore implements LeadStore {
  constructor(private db: pg.Pool) {}

  async insertLead(a: Parameters<LeadStore['insertLead']>[0]): Promise<InsertResult> {
    const c = await this.db.connect();
    try {
      await c.query('begin');
      // Serialise submissions that share an idempotency key or the same content.
      await c.query('select pg_advisory_xact_lock(hashtext($1)), pg_advisory_xact_lock(hashtext($2))', [a.lead.idempotencyKey, a.dedupeHash]);
      const prior = await c.query<LeadRow>(
        `select * from leads where idempotency_key = $1
            or (dedupe_hash = $2 and created_at > now() - make_interval(mins => $3))
          order by created_at asc limit 1`,
        [a.lead.idempotencyKey, a.dedupeHash, a.dedupeWindowMinutes],
      );
      if (prior.rows[0]) {
        await c.query(`insert into lead_events (lead_id, actor, type, detail) values ($1,'system','duplicate_submission',$2)`, [prior.rows[0].id, { source: a.lead.source }]);
        await c.query('commit');
        return { lead: prior.rows[0], created: false };
      }
      const l = a.lead;
      const ins = await c.query<LeadRow>(
        `insert into leads (id, ref, idempotency_key, dedupe_hash, source, locale, name, phone, email, preferred_contact,
            line, categories, state, urgency, callback_time, summary, details, transcript, transcript_consent, sms_consent,
            queue, delivery_status, follow_up_status, ip_hash, user_agent)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
         returning *`,
        [a.id, a.ref, l.idempotencyKey, a.dedupeHash, l.source, l.locale, l.name, l.phone, l.email, l.preferredContact,
          l.line, l.categories, l.state, l.urgency, l.callbackTime, l.summary, JSON.stringify(l.details),
          l.transcript ? JSON.stringify(l.transcript) : null, l.transcriptConsent, l.smsConsent,
          a.queue, a.queue === 'quarantine' ? 'held' : 'pending', a.queue === 'quarantine' ? 'spam' : 'new', a.ipHash, a.userAgent],
      );
      for (const t of a.targets) {
        // The inbox *is* this database: it is delivered the moment the row commits.
        const inbox = t.channel === 'inbox';
        await c.query(
          `insert into lead_deliveries (lead_id, channel, target, status, delivered_at, attempts) values ($1,$2,$3,$4,$5,$6)`,
          [a.id, t.channel, t.target, inbox ? 'delivered' : 'pending', inbox ? new Date() : null, inbox ? 1 : 0],
        );
      }
      await c.query(`insert into lead_events (lead_id, actor, type, detail) values ($1,'system','lead_created',$2)`, [a.id, { source: l.source, queue: a.queue, targets: a.targets }]);
      await c.query('commit');
      return { lead: ins.rows[0], created: true };
    } catch (e) {
      await c.query('rollback').catch(() => {});
      throw e;
    } finally {
      c.release();
    }
  }

  async getLead(id: string) {
    return (await this.db.query<LeadRow>('select * from leads where id = $1', [id])).rows[0] ?? null;
  }
  async listLeads(limit: number) {
    const leads = (await this.db.query<LeadRow>('select * from leads order by created_at desc limit $1', [limit])).rows;
    if (!leads.length) return [];
    const del = (await this.db.query<DeliveryRow>('select * from lead_deliveries where lead_id = any($1::uuid[]) order by id', [leads.map((l) => l.id)])).rows;
    return leads.map((l) => ({ ...l, deliveries: del.filter((d) => d.lead_id === l.id) }));
  }
  async deliveriesFor(leadId: string) {
    return (await this.db.query<DeliveryRow>('select * from lead_deliveries where lead_id = $1 order by id', [leadId])).rows;
  }
  async dueDeliveries(limit: number) {
    return (await this.db.query<DeliveryRow>(
      `select * from lead_deliveries where status in ('pending','failed') and next_attempt_at <= now() order by next_attempt_at limit $1`, [limit])).rows;
  }
  async recordAttempt(id: number, r: Parameters<LeadStore['recordAttempt']>[1]) {
    if (r.ok) {
      await this.db.query(`update lead_deliveries set status='delivered', attempts=attempts+1, delivered_at=now(), last_error=null, provider_id=$2 where id=$1`, [id, r.providerId ?? null]);
    } else {
      await this.db.query(`update lead_deliveries set status=$2, attempts=attempts+1, last_error=$3, next_attempt_at=$4 where id=$1`, [id, r.dead ? 'dead' : 'failed', r.error.slice(0, 500), r.retryAt]);
    }
    const row = (await this.db.query<DeliveryRow>('select * from lead_deliveries where id=$1', [id])).rows[0];
    await this.addEvent(row.lead_id, 'system', r.ok ? 'delivery_succeeded' : r.dead ? 'delivery_dead' : 'delivery_failed', { channel: row.channel, target: row.target, attempts: row.attempts, error: r.ok ? undefined : r.error.slice(0, 300) });
  }
  /** Lead-level status = the worst state of its external deliveries. */
  async refreshLeadStatus(leadId: string) {
    const r = await this.db.query<{ delivery_status: string }>(
      `update leads l set delivery_status = case
           when l.queue = 'quarantine' then 'held'
           when exists (select 1 from lead_deliveries d where d.lead_id = l.id and d.status = 'dead') then 'dead'
           when exists (select 1 from lead_deliveries d where d.lead_id = l.id and d.status = 'failed') then 'failed'
           when exists (select 1 from lead_deliveries d where d.lead_id = l.id and d.status = 'pending') then 'pending'
           else 'delivered' end
        where l.id = $1 returning delivery_status`, [leadId]);
    return r.rows[0]?.delivery_status ?? 'pending';
  }
  async setFollowUp(leadId: string, status: string, actor: string) {
    const r = await this.db.query(`update leads set follow_up_status = $2 where id = $1`, [leadId, status]);
    if (r.rowCount) await this.addEvent(leadId, actor, 'follow_up_changed', { status });
    return !!r.rowCount;
  }
  async requeue(leadId: string, actor: string) {
    await this.db.query(`update lead_deliveries set status='pending', next_attempt_at=now() where lead_id=$1 and status in ('failed','dead')`, [leadId]);
    await this.addEvent(leadId, actor, 'delivery_requeued');
    await this.refreshLeadStatus(leadId);
  }
  async addEvent(leadId: string | null, actor: string, type: string, detail: Record<string, unknown> = {}) {
    await this.db.query(`insert into lead_events (lead_id, actor, type, detail) values ($1,$2,$3,$4)`, [leadId, actor, type, JSON.stringify(detail)]);
  }
  /** Fixed-window counter shared by every server instance. Returns the count including this hit. */
  async hit(key: string, windowSeconds: number) {
    const r = await this.db.query<{ count: number }>(
      `insert into rate_limits (key, window_start, count)
         values ($1, to_timestamp(floor(extract(epoch from now()) / $2) * $2), 1)
       on conflict (key, window_start) do update set count = rate_limits.count + 1
       returning count`, [key, windowSeconds]);
    if (Math.random() < 0.02) this.db.query(`delete from rate_limits where window_start < now() - interval '1 day'`).catch(() => {});
    return r.rows[0].count;
  }
  async ping() {
    try {
      await this.db.query('select 1 from leads limit 1');
      return true;
    } catch {
      return false;
    }
  }
}
