#!/usr/bin/env node
/* Local host that behaves like production: clean URLs, 404 page, byte-range video, and /api/* handled by the same
   Web-standard function modules that deploy to Vercel (api/<name>.mjs exporting POST/GET).
   Inquiries are stored under .data/inquiries/ locally (see lib/inquiry.mjs storage adapters).
     node scripts/serve.mjs [--port=8788] [--dir=dist] */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const PORT = Number(arg('port', 8788));
const DIR = path.resolve(ROOT, arg('dir', 'dist'));
process.env.INQUIRY_STORAGE = process.env.INQUIRY_STORAGE || 'file';
process.env.INQUIRY_DATA_DIR = process.env.INQUIRY_DATA_DIR || path.join(ROOT, '.data');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.ico': 'image/x-icon' };

function resolveFile(p) {
  const clean = decodeURIComponent(p.split('?')[0]).replace(/\/+$/, '') || '/';
  const cands = clean === '/' ? ['index.html'] : [clean.slice(1), clean.slice(1) + '/index.html', clean.slice(1) + '.html'];
  for (const c of cands) { const f = path.join(DIR, c); if (f.startsWith(DIR) && fs.existsSync(f) && fs.statSync(f).isFile()) return f; }
  return null;
}
async function api(req, res, name) {
  const mod = path.join(ROOT, 'api', name + '.mjs');
  if (!fs.existsSync(mod)) { res.writeHead(404, { 'content-type': 'application/json' }); return res.end('{"ok":false,"error":"not_found"}'); }
  const m = await import(pathToFileURL(mod).href + '?t=' + fs.statSync(mod).mtimeMs);
  const fn = m[req.method] || (m.default && m.default.fetch);
  if (!fn) { res.writeHead(405, { allow: 'POST' }); return res.end(); }
  const chunks = []; for await (const c of req) chunks.push(c);
  const body = Buffer.concat(chunks);
  const headers = new Headers(); for (const [k, v] of Object.entries(req.headers)) if (v != null) headers.set(k, Array.isArray(v) ? v.join(', ') : v);
  if (!headers.get('x-forwarded-for')) headers.set('x-forwarded-for', req.socket.remoteAddress || '127.0.0.1');
  const request = new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body });
  const r = await fn(request);
  const out = Buffer.from(await r.arrayBuffer());
  res.writeHead(r.status, Object.fromEntries(r.headers.entries())); res.end(out);
}
http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    if (u.pathname.startsWith('/api/')) return await api(req, res, u.pathname.slice(5).replace(/\/$/, ''));
    let file = resolveFile(u.pathname), status = 200;
    if (!file) { file = path.join(DIR, '404.html'); status = 404; }
    const st = fs.statSync(file), type = MIME[path.extname(file)] || 'application/octet-stream';
    const range = req.headers.range;
    if (range && status === 200) {
      const m = /bytes=(\d*)-(\d*)/.exec(range); let start = m[1] ? Number(m[1]) : 0, end = m[2] ? Number(m[2]) : st.size - 1;
      if (!m[1] && m[2]) { start = st.size - Number(m[2]); end = st.size - 1; }
      if (start >= st.size) { res.writeHead(416, { 'content-range': `bytes */${st.size}` }); return res.end(); }
      res.writeHead(206, { 'content-type': type, 'content-length': end - start + 1, 'content-range': `bytes ${start}-${end}/${st.size}`, 'accept-ranges': 'bytes' });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(status, { 'content-type': type, 'content-length': st.size, 'accept-ranges': 'bytes', 'x-robots-tag': 'noindex' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  } catch (e) { console.error(e); res.writeHead(500); res.end('server error'); }
}).listen(PORT, '127.0.0.1', () => console.log(`JP Silva Media → http://127.0.0.1:${PORT}  (serving ${path.relative(ROOT, DIR)}/)`));
