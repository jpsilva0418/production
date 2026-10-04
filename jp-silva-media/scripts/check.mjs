#!/usr/bin/env node
/* Whole-site checks over a build (default dist/). Fails (exit 1) on any error.
   - every internal href/src/srcset/poster resolves to a built file
   - one <h1> per page, a <title>, a meta description, a canonical, lang
   - noindex present while previewing; robots.txt matches
   - JSON-LD parses
   - every <img> has alt; every <video> is muted+playsinline when it autoplays
   - brand hygiene: no "JP Media" (without Silva), "JP Web Design", "JP Silva Digital", other clients, lorem, TODO
   - no mailto/tel invented: only the site email
     node scripts/check.mjs [--dir=dist] [--target=web|preview] */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/data/site.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const DIR = path.resolve(ROOT, arg('dir', 'dist'));
const target = arg('target', fs.existsSync(path.join(DIR, 'sitemap.xml')) ? 'web' : 'preview');
const errors = [], warns = [];
const err = (f, m) => errors.push(`${path.relative(DIR, f)}: ${m}`), warn = (f, m) => warns.push(`${path.relative(DIR, f)}: ${m}`);
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(DIR), html = files.filter(f => f.endsWith('.html'));
const FORBID = [[/\bJP Media\b/g, 'JP Media (brand is JP Silva Media)'], [/JP Web Design/gi, 'JP Web Design'], [/JP Silva Digital/gi, 'JP Silva Digital'], [/Leti Silva|V ?Cleaning|Behold/gi, 'another client'], [/lorem ipsum/gi, 'lorem'], [/\bTODO\b|\bFIXME\b/g, 'TODO'], [/concept (study|preview)|art direction study|procedural/gi, 'study wording']];
function resolve(fromFile, ref) {
  if (!ref || /^(https?:|mailto:|tel:|data:|blob:|#|javascript:)/.test(ref)) return true;
  const clean = ref.split('#')[0].split('?')[0]; if (!clean) return true;
  let p = clean.startsWith('/') ? path.join(DIR, clean) : path.resolve(path.dirname(fromFile), clean);
  if (fs.existsSync(p) && fs.statSync(p).isFile()) return true;
  if (fs.existsSync(path.join(p, 'index.html'))) return true;
  if (fs.existsSync(p + '.html')) return true;
  return false;
}
const titles = new Map();
for (const f of html) {
  const s = fs.readFileSync(f, 'utf8');
  const text = s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  if (!/<html lang="en"/.test(s)) err(f, 'missing lang');
  const h1 = (s.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) err(f, `${h1} <h1>`);
  const t = (s.match(/<title>([^<]*)<\/title>/) || [])[1]; if (!t) err(f, 'no <title>'); else { if (titles.has(t) && !f.endsWith('404.html')) err(f, `duplicate title with ${titles.get(t)}`); titles.set(t, path.relative(DIR, f)); }
  if (!/<meta name="description" content="[^"]{20,}"/.test(s)) err(f, 'missing/short meta description');
  if (!/<link rel="canonical"/.test(s)) err(f, 'no canonical');
  const noindex = /<meta name="robots" content="noindex/.test(s);
  if (!noindex && process.env.PREVIEW !== '0') err(f, 'preview build without noindex');
  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch (e) { err(f, 'JSON-LD does not parse'); } }
  for (const m of s.matchAll(/\s(?:href|src|poster|data-src|data-poster|data-film)="([^"]+)"/g)) if (!resolve(f, m[1])) err(f, `broken ref ${m[1]}`);
  for (const m of s.matchAll(/\ssrcset="([^"]+)"/g)) for (const part of m[1].split(',')) { const u = part.trim().split(/\s+/)[0]; if (!resolve(f, u)) err(f, `broken srcset ${u}`); }
  for (const m of s.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) err(f, `img without alt: ${m[0].slice(0, 80)}`);
  for (const m of s.matchAll(/<video\b[^>]*>/g)) if (/\sautoplay/.test(m[0]) && !(/\smuted/.test(m[0]) && /\splaysinline/.test(m[0]))) err(f, 'autoplay video not muted+playsinline');
  for (const m of s.matchAll(/mailto:([^"?]+)/g)) if (m[1] !== site.email) err(f, `unexpected mailto ${m[1]}`);
  if (/href="tel:/.test(s)) err(f, 'tel: link present (no phone number is verified)');
  for (const [re, label] of FORBID) { const hits = text.match(re); if (hits) err(f, `forbidden: ${label} ×${hits.length}`); }
  if (target === 'preview' && /youtube(-nocookie)?\.com\/embed|iframe_api/.test(s) && !/data-youtube/.test(s)) warn(f, 'embeds YouTube in preview build');
}
const robots = fs.readFileSync(path.join(DIR, 'robots.txt'), 'utf8');
if (process.env.PREVIEW !== '0' && !/Disallow: \//.test(robots)) errors.push('robots.txt allows crawling in a preview build');
for (const f of files.filter(f => /\.(css|js)$/.test(f))) { const s = fs.readFileSync(f, 'utf8'); for (const [re, label] of FORBID.slice(0, 4)) if (re.test(s)) err(f, `forbidden: ${label}`); }
console.log(`checked ${html.length} pages, ${files.length} files in ${path.relative(ROOT, DIR)}/ (${target})`);
warns.forEach(w => console.log('  warn  ' + w));
if (errors.length) { errors.forEach(e => console.log('  ERROR ' + e)); console.log(`${errors.length} error(s)`); process.exit(1); }
console.log('all checks passed');
