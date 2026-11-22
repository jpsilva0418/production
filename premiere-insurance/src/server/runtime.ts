import { config } from './config';
import { getPool, PgLeadStore, type LeadStore } from './leads/store';

/** Shared per-instance wiring for API routes. Returns store=null when no database is configured. */
export function runtime() {
  const cfg = config();
  const store: LeadStore | null = cfg.databaseUrl ? new PgLeadStore(getPool(cfg.databaseUrl)) : null;
  return { cfg, store };
}

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });

/** Read a JSON body with a hard size cap, before parsing. */
export async function readJson(request: Request, maxBytes = 48_000): Promise<{ ok: true; body: unknown; raw: string } | { ok: false; status: 400 | 413 | 415 }> {
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return { ok: false, status: 415 };
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > maxBytes) return { ok: false, status: 413 };
  const raw = await request.text();
  if (raw.length > maxBytes) return { ok: false, status: 413 };
  try {
    return { ok: true, body: JSON.parse(raw), raw };
  } catch {
    return { ok: false, status: 400 };
  }
}

/** Browser POSTs must come from this site. Requests without an Origin header (curl, server-to-server) are not browsers and carry no ambient credentials. */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return request.headers.get('sec-fetch-site') !== 'cross-site';
  try {
    const o = new URL(origin).host;
    const fwd = request.headers.get('x-forwarded-host');
    return o === new URL(request.url).host || o === request.headers.get('host') || (!!fwd && o === fwd);
  } catch {
    return false;
  }
}
