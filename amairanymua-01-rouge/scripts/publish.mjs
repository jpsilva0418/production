#!/usr/bin/env node
/**
 * Publish ROUGE into the demo library:
 *
 *     node scripts/publish.mjs
 *
 * Builds the site with base /demo/amairanymua-01/rouge (directory format, demo-only), checks
 * that every root-relative address in the pages already lives under that base (re-rooting any
 * hand-written one that Astro did not prefix), drops anything that would not belong in the
 * folder (robots.txt, sitemaps, a 404 page), and replaces
 *     ../jp-web-design/public/demo/amairanymua-01/rouge/
 * with the result. Nothing is written anywhere else: no /demo/_shared, no other demo.
 * Run the demo's own checker afterwards:  cd ../jp-web-design && node scripts/amairanymua-01-check.mjs
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(HERE, 'dist');
const DEMO = '/demo/amairanymua-01';
const BASE = `${DEMO}/rouge`;
const OUT = path.resolve(HERE, '..', 'jp-web-design', 'public', 'demo', 'amairanymua-01', 'rouge');
if (!existsSync(path.dirname(OUT))) throw new Error(`demo folder not found: ${path.dirname(OUT)}`);

console.log(`· building Rouge for ${BASE}`);
await fs.rm(DIST, { recursive: true, force: true });
execSync('npx astro build', { cwd: HERE, stdio: 'inherit', env: { ...process.env, PUBLIC_DEMO_ONLY: '1', BUILD_FORMAT: 'directory' } });

// ---- 1 · nothing that belongs outside the folder ----
for (const f of ['404.html', '404', 'robots.txt']) await fs.rm(path.join(DIST, f), { recursive: true, force: true });
for (const f of await fs.readdir(DIST)) if (/^sitemap.*\.xml$/.test(f)) await fs.rm(path.join(DIST, f));

// ---- 2 · every root path stays inside /demo/amairanymua-01 ----
// Astro prefixes its own assets and the components build links with u(); this catches any
// hand-written root path that slipped through and re-roots it under the base.
const mapPath = (p) => (p.startsWith('//') || p.startsWith(`${DEMO}/`) || p === DEMO ? p : BASE + (p === '/' ? '' : p));
let rerooted = 0;
const rewrite = (html) => html
  // Astro writes an empty alt as a bare `alt`; spell decorative images out as alt=""
  .replace(/<img\b[^>]*>/g, (tag) => tag.replace(/\salt(?=[\s>\/])/, ' alt=""'))
  .replace(/\b(href|src|poster|data-src)="(\/[^"]*)"/g, (m, a, p) => { const q = mapPath(p); if (q !== p) rerooted++; return `${a}="${q}"`; })
  .replace(/\bsrcset="([^"]*)"/g, (_, v) => `srcset="${v.split(',').map((part) => part.trim().replace(/^(\/\S*)/, (x) => { const q = mapPath(x); if (q !== x) rerooted++; return q; })).join(', ')}"`)
  .replace(/url\((['"]?)(\/[^)'"]+)\1\)/g, (m, q, p) => { const r = mapPath(p); if (r !== p) rerooted++; return `url(${q}${r}${q})`; });

const pages = [];
const walk = async (d) => { for (const e of await fs.readdir(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) await walk(p); else if (e.name.endsWith('.html')) pages.push(p); } };
await walk(DIST);
const banned = /kass|kassandra|5085061845|yahoo|glossgenius|massachusetts|sassbykass/i;
for (const p of pages) {
  const rel = path.relative(DIST, p);
  const t = rewrite(await fs.readFile(p, 'utf8'));
  if (!/<meta name="robots" content="noindex,nofollow,noarchive">/.test(t)) throw new Error(`missing noindex in ${rel}`);
  if (/\b(?:href|src|poster|data-src)="\/(?!demo\/amairanymua-01)/.test(t)) throw new Error(`root path outside the demo in ${rel}`);
  if (/_shared\//.test(t)) throw new Error(`reference to /demo/_shared in ${rel}`);
  if (banned.test(t)) throw new Error(`text from the source build left in ${rel}: ${t.match(banned)[0]}`);
  if (/\stel:|\ssms:|href="(?:tel|sms):/.test(t)) throw new Error(`a phone link in ${rel}: she has published no number`);
  await fs.writeFile(p, t);
}
// the built scripts must not be able to send anything
const assets = path.join(DIST, 'assets');
for (const f of existsSync(assets) ? await fs.readdir(assets) : []) {
  const s = await fs.readFile(path.join(assets, f), 'utf8').catch(() => '');
  if (f.endsWith('.js') && /\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|\bimport\s*\(/.test(s)) throw new Error(`network-capable code in ${f}`);
  if ((f.endsWith('.js') || f.endsWith('.css')) && banned.test(s)) throw new Error(`text from the source build in ${f}`);
}

// ---- 3 · publish: only the rouge folder is replaced ----
await fs.rm(OUT, { recursive: true, force: true });
await fs.cp(DIST, OUT, { recursive: true });
console.log(`✓ ${BASE}: ${pages.length} pages${rerooted ? `, ${rerooted} root path(s) re-rooted` : ''} → ${path.relative(process.cwd(), OUT)}`);
