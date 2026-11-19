#!/usr/bin/env node
/* Static safety checks for /demo/amairanymua-01. Run after the build:

       node scripts/amairanymua-01-build.mjs && node scripts/amairanymua-01-check.mjs

   It reads only public/demo/amairanymua-01/ and fails (exit 1) if any page:
     · is missing the noindex robots meta, the "design preview" marker, a <title>, or
       does not have exactly one <h1>;
     · has an <img> without an alt attribute, or an id used twice;
     · carries a booking link (data-book) whose address is not EXACTLY the one in the
       table in docs/demo-amairanymua-01.md (BOOK in site.mjs), or links to her booking
       system without going through data-book;
     · links anywhere outside this demo other than her own published addresses;
     · links to an internal page, fragment or asset that does not exist;
     · reads anything from /demo/_shared/ or another demo, or loads a third-party file;
     · has a form that could post somewhere (action=, method=post);
   and if any script could send data (fetch, XMLHttpRequest, sendBeacon, WebSocket,
   EventSource, form.submit) or any stylesheet imports a remote file. */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE, BOOK, L, FILM_POST, PICK, SITES, BUILT_IDS, outFile, pagesOf } from './amairanymua-01/site.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'demo', 'amairanymua-01');
const fail = [];
const bad = (file, msg) => fail.push(`${file}: ${msg}`);

const all = [];
(function walk(d) { for (const e of readdirSync(d)) { const p = join(d, e); statSync(p).isDirectory() ? walk(p) : all.push(p); } })(OUT);
const rel = (f) => f.slice(OUT.length + 1);
const html = all.filter((f) => f.endsWith('.html'));

/* every page the build promises is there, and nothing else */
const expected = new Set([...BUILT_IDS.flatMap((d) => pagesOf(d).map((p) => outFile(d, p))), ...(PICK ? [] : ['index.html'])]);
/* Prebuilt sites (built elsewhere and copied in whole, e.g. rouge from ../amairanymua-01-rouge):
   every page they ship is expected, and every per-page rule below applies to them too. */
const PREBUILT = Object.keys(SITES).filter((id) => SITES[id].prebuilt);
for (const pre of PREBUILT) if (existsSync(join(OUT, pre))) for (const f of all.filter((x) => x.startsWith(join(OUT, pre) + '/') && x.endsWith('.html'))) expected.add(rel(f));
for (const e of expected) if (!existsSync(join(OUT, e))) bad(e, 'expected page was not built');
for (const f of html) if (!expected.has(rel(f))) bad(rel(f), 'unexpected page in the demo folder');

/* a demo URL -> the file that serves it (Vercel cleanUrls) */
const resolve = (path) => {
  const p = path.slice(BASE.length).replace(/^\//, '');
  for (const c of [p, `${p}.html`, join(p, 'index.html')]) { const f = join(OUT, c); if (c !== '' && existsSync(f) && statSync(f).isFile()) return f; }
  if (p === '' && existsSync(join(OUT, 'index.html'))) return join(OUT, 'index.html');
  return null;
};
const EXTERNAL_OK = new Set([...Object.values(L), ...Object.values(FILM_POST)]); /* her links, and the public TikTok post of each clip */
const BOOK_HOSTS = ['form.jotform.com', 'amairanymua.as.me'];
const ids = new Map();
for (const f of html) ids.set(f, new Set([...readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));

let links = 0, bookLinks = 0, images = 0;
for (const f of html) {
  const name = rel(f);
  const s = readFileSync(f, 'utf8');
  const isChooser = name === 'index.html' && !PICK;
  if (!/<meta name="robots" content="noindex,nofollow,noarchive">/.test(s)) bad(name, 'missing robots noindex meta');
  if (!/<title>[^<]+<\/title>/.test(s)) bad(name, 'missing <title>');
  if (!/design preview/i.test(s.match(/<title>([^<]*)/)?.[1] ?? '')) bad(name, '<title> does not say "design preview"');
  if (!/Design preview(?:\s|&middot;|·)+not the official site/i.test(s)) bad(name, 'missing the "Design preview · not the official site" marker');
  const h1 = (s.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) bad(name, `has ${h1} <h1> elements (needs exactly 1)`);
  for (const m of s.matchAll(/<img\b[^>]*>/g)) { images++; if (!/\salt="/.test(m[0])) bad(name, `image without alt: ${m[0].slice(0, 90)}`); }
  const seen = new Set();
  for (const m of s.matchAll(/\sid="([^"]+)"/g)) { if (seen.has(m[1])) bad(name, `duplicate id "${m[1]}"`); seen.add(m[1]); }
  if (/<form\b[^>]*\b(action|method)=/i.test(s)) bad(name, 'a form declares an action or method');
  if (/_shared\//.test(s)) bad(name, 'references /demo/_shared/');
  if (!isChooser && !/<a\b[^>]*\shref="#main"/.test(s)) bad(name, 'missing a skip link to #main');
  if (!/\sid="main"/.test(s)) bad(name, 'missing id="main"');
  if (!isChooser && !/assets\/css\/marker\.css/.test(s)) bad(name, 'does not load the preview marker stylesheet');
  if (!isChooser && !/class="demo-flag/.test(s)) bad(name, 'missing the preview marker element');
  if (/<html(?![^>]*\slang=)/.test(s)) bad(name, '<html> has no lang');

  /* booking links */
  for (const m of s.matchAll(/<a\b[^>]*>/g)) {
    const tag = m[0];
    const h = tag.match(/\shref="([^"]*)"/)?.[1];
    if (h === undefined) { bad(name, `anchor without href: ${tag.slice(0, 80)}`); continue; }
    links++;
    const kind = tag.match(/\sdata-book="([^"]*)"/)?.[1];
    const href = h.replace(/&amp;/g, '&');
    if (kind !== undefined) {
      bookLinks++;
      if (!BOOK[kind]) bad(name, `unknown data-book "${kind}"`);
      else if (href !== BOOK[kind]) bad(name, `data-book="${kind}" points to ${href}, not ${BOOK[kind]}`);
      if (/\starget=/.test(tag)) bad(name, `booking link opens a new tab (family rule: same tab): ${kind}`);
      continue;
    }
    if (BOOK_HOSTS.some((host) => href.includes(host))) bad(name, `link to her booking system without data-book: ${href}`);
    if (/^(#|javascript:|about:)?$/i.test(href) || /^javascript:/i.test(href)) { bad(name, `placeholder href "${href}"`); continue; }
    if (href.startsWith('#')) { if (!ids.get(f).has(href.slice(1))) bad(name, `in-page link ${href} has no target`); continue; }
    if (/^mailto:/.test(href)) { if (href !== L.mail) bad(name, `unexpected mailto: ${href}`); continue; }
    if (/^https?:/.test(href)) { if (!EXTERNAL_OK.has(href)) bad(name, `external link not in her published set: ${href}`); if (/\starget=/.test(tag)) bad(name, `external link opens a new tab: ${href}`); continue; }
    if (!href.startsWith(`${BASE}`)) { bad(name, `link leaves the demo: ${href}`); continue; }
    const [withQuery, frag] = href.split('#');
    const path = withQuery.split('?')[0]; /* ?intro=1 replays a site's opening */
    const target = resolve(path);
    if (!target) bad(name, `internal link does not resolve: ${href}`);
    else if (frag && !ids.get(target)?.has(frag)) bad(name, `fragment #${frag} not found in ${rel(target)}`);
  }
  /* assets */
  for (const m of s.matchAll(/\s(?:src|href|poster|data-src)="([^"]+\.(?:css|js|webp|jpg|jpeg|png|svg|woff2|mp4|webm))"/g)) {
    const u = m[1];
    if (/^https?:/.test(u)) { if (!u.startsWith('https://jpsilvadigital.com/demo/amairanymua-01/')) bad(name, `third-party file: ${u}`); continue; }
    if (!u.startsWith(`${BASE}/assets/`) && !PREBUILT.some((pre) => u.startsWith(`${BASE}/${pre}/assets/`))) { bad(name, `asset outside this demo's folder: ${u}`); continue; }
    if (!existsSync(join(OUT, u.slice(BASE.length + 1)))) bad(name, `missing asset: ${u}`);
  }
  for (const m of s.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) {
    const u = part.trim().split(/\s+/)[0];
    const okBase = u.startsWith(`${BASE}/assets/`) || PREBUILT.some((pre) => u.startsWith(`${BASE}/${pre}/assets/`));
    if (!okBase || !existsSync(join(OUT, u.slice(BASE.length + 1)))) bad(name, `missing or foreign srcset file: ${u}`);
  }
  if (/<(script|link|img|iframe|video|source)\b[^>]*\s(?:src|href)="(?:https?:)?\/\/(?!jpsilvadigital\.com\/demo\/amairanymua-01)/i.test(s.replace(/<link rel="canonical"[^>]*>/g, ''))) bad(name, 'loads a third-party resource');
  /* inline scripts may not send anything either */
  for (const m of s.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)) if (/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource/.test(m[1])) bad(name, 'an inline script can make a network request');
}

/* scripts and stylesheets */
for (const f of all.filter((x) => extname(x) === '.js')) {
  const s = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  for (const [re, what] of [[/\bfetch\s*\(/, 'fetch()'], [/XMLHttpRequest/, 'XMLHttpRequest'], [/sendBeacon/, 'sendBeacon'], [/\bWebSocket\b/, 'WebSocket'], [/\bEventSource\b/, 'EventSource'], [/\.submit\s*\(/, 'form.submit()'], [/\bimport\s*\(/, 'dynamic import'], [/https?:\/\/(?!form\.jotform\.com\/252119273398160)/, 'a hard-coded remote address']]) {
    if (re.test(s)) bad(rel(f), `uses ${what}`);
  }
}
for (const f of all.filter((x) => extname(x) === '.css')) {
  const s = readFileSync(f, 'utf8');
  if (/@import/.test(s)) bad(rel(f), 'uses @import');
  for (const m of s.matchAll(/url\(\s*["']?([^"')]+)/g)) {
    const u = m[1];
    if (u.startsWith('data:') || u.startsWith('%23') || u.startsWith('#')) continue; /* data URIs and the fragment inside the grain SVG */
    if (/^(https?:)?\/\//.test(u)) { bad(rel(f), `remote url(): ${u}`); continue; }
    const target = u.startsWith('/') ? (u.startsWith(`${BASE}/`) ? join(OUT, u.slice(BASE.length + 1)) : null) : join(dirname(f), u);
    if (!target || !existsSync(target.split(/[?#]/)[0])) bad(rel(f), `url() does not resolve inside this demo: ${u}`);
  }
}

if (fail.length) { console.error(`FAIL — ${fail.length} problem(s):\n` + fail.map((x) => '  · ' + x).join('\n')); process.exit(1); }
console.log(`OK — ${html.length} pages, ${links} links (${bookLinks} booking links, each exactly as documented), ${images} images with alt text, no outbound requests, nothing shared with another demo.`);
