/* POST /api/inquire — JP Silva Media inquiry intake (Vercel Web-standard function; also run by scripts/serve.mjs).
   Transport checks here (size, content type, same origin, rate); decisions in lib/inquiry.mjs. */
import { handleInquiry, storageFromEnv } from '../lib/inquiry.mjs';

const MAX_BYTES = 32 * 1024;
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map(); // ip → [timestamps] (best effort, per instance)
let storage, storageSig;

const json = (status, body, extra = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra }
});

function clientIp(req) {
  const xf = req.headers.get('x-forwarded-for');
  return (xf ? xf.split(',')[0] : req.headers.get('x-real-ip') || 'unknown').trim();
}
function limited(ip, now) {
  const list = (hits.get(ip) || []).filter(t => now - t < RATE.windowMs);
  if (list.length >= RATE.max) { hits.set(ip, list); return Math.ceil((RATE.windowMs - (now - list[0])) / 1000); }
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > RATE.windowMs) hits.delete(k);
  return 0;
}
function sameOrigin(req) {
  const site = req.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin' && site !== 'none') return false;
  const origin = req.headers.get('origin');
  if (origin && origin !== 'null') {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || new URL(req.url).host;
    try { if (new URL(origin).host !== host) return false; } catch (e) { return false; }
  }
  return true;
}
function currentStorage() {
  const sig = [process.env.INQUIRY_STORAGE, process.env.INQUIRY_DATA_DIR, !!process.env.BLOB_READ_WRITE_TOKEN].join('|');
  if (sig !== storageSig) { storage = storageFromEnv(); storageSig = sig; }
  return storage;
}

export async function POST(request) {
  const now = Date.now();
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > MAX_BYTES) return json(413, { ok: false, error: 'too_large' });
  const type = (request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (type !== 'application/json') return json(415, { ok: false, error: 'unsupported_media_type' });
  if (!sameOrigin(request)) return json(403, { ok: false, error: 'forbidden_origin' });
  const wait = limited(clientIp(request), now);
  if (wait) return json(429, { ok: false, error: 'rate_limited' }, { 'retry-after': String(wait) });
  let text;
  try {
    const buf = await request.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) return json(413, { ok: false, error: 'too_large' });
    text = new TextDecoder().decode(buf);
  } catch (e) { return json(400, { ok: false, error: 'bad_request' }); }
  let input;
  try { input = JSON.parse(text); } catch (e) { return json(400, { ok: false, error: 'bad_json' }); }
  try {
    const r = await handleInquiry(input, { storage: currentStorage(), now });
    return json(r.status, r.body);
  } catch (e) {
    console.error('[inquiry] unexpected', e && e.name);
    return json(500, { ok: false, error: 'server_error' });
  }
}
export function OPTIONS() { return new Response(null, { status: 204, headers: { allow: 'POST, OPTIONS', 'cache-control': 'no-store' } }); }
const notAllowed = () => json(405, { ok: false, error: 'method_not_allowed' }, { allow: 'POST, OPTIONS' });
export { notAllowed as GET, notAllowed as PUT, notAllowed as PATCH, notAllowed as DELETE, notAllowed as HEAD };
