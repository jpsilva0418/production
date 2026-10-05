#!/usr/bin/env node
/* ==========================================================================
   LINK + ROUTE CHECKER — run after `npm run build`.

       node scripts/check-links.mjs      (npm run check:links)

   Reads dist/ and asserts, over every page the site actually ships:

     1. every expected route is present in the build
     2. every internal href resolves to a file in dist/
     3. every in-page #fragment has a matching id in the destination document
     4. no href is a placeholder (#, javascript:, about:blank, empty)
     5. no href is a homepage anchor standing in for a real page
     6. every external link opens safely and every icon link has a label
     7. mailto: / tel: use the one canonical address and number

   Exits non-zero on any failure, so it can gate a deploy.
   ========================================================================== */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DIST = join(ROOT, 'dist');

const EXPECTED = [
  '/', '/services', '/services/web-design-development', '/services/google-ads',
  '/services/meta-ads', '/work', '/industries', '/about', '/blog', '/process',
  '/contact', '/free-demo', '/privacy', '/terms', '/accessibility',
  '/industries/construction-web-design',
];

/* Homepage anchors that must never be used as page navigation. A link to
   '/#services' looks like the Services page and lands mid-document. */
const FORBIDDEN_HREFS = [
  /^\/#/, /^#$/, /^javascript:/i, /^about:blank$/i, /^\s*$/,
];

const EMAIL = 'jpsilva0418@gmail.com';
const TEL = 'tel:+17742146352';

const fail = [];
const warn = [];

/* ---------- collect the build ---------- */
const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    statSync(p).isDirectory() ? walk(p) : files.push(p);
  }
})(DIST);

const htmlFiles = files.filter((f) => f.endsWith('.html'));
const routeOf = (f) => {
  const r = '/' + f.slice(DIST.length + 1).replace(/\.html$/, '').replace(/\\/g, '/');
  return r === '/index' ? '/' : r;
};
const docs = new Map(htmlFiles.map((f) => [routeOf(f), readFileSync(f, 'utf8')]));

/* ids present per route, for fragment checking */
const idsOf = new Map(
  [...docs].map(([r, html]) => [r, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]),
);

/* ---------- 1. every expected route shipped ---------- */
for (const r of EXPECTED) if (!docs.has(r)) fail.push(`MISSING ROUTE: ${r} is not in the build`);

/* ---------- walk every link on every page ---------- */
const resolves = (path) => {
  if (docs.has(path)) return true;
  const clean = path.replace(/\/$/, '') || '/';
  if (docs.has(clean)) return true;
  // a static asset shipped in public/
  return existsSync(join(DIST, path.replace(/^\//, '')));
};

let anchorCount = 0;
let internalCount = 0;

for (const [route, html] of docs) {
  // every <a ...> tag, with its attributes
  for (const m of html.matchAll(/<a\s([^>]*?)>/g)) {
    const attrs = m[1];
    const href = /href="([^"]*)"/.exec(attrs)?.[1];
    const where = `${route} → ${href ?? '(no href)'}`;

    if (href === undefined) { fail.push(`NO HREF: <a> without href on ${route}`); continue; }

    /* 4 + 5. placeholders and homepage-anchor-as-page */
    for (const bad of FORBIDDEN_HREFS) {
      if (bad.test(href)) fail.push(`PLACEHOLDER/STALE HREF: ${where}`);
    }

    if (href.startsWith('mailto:')) {
      if (href !== `mailto:${EMAIL}` && !href.startsWith(`mailto:${EMAIL}?`)) {
        fail.push(`WRONG EMAIL: ${where}`);
      }
      continue;
    }
    if (href.startsWith('tel:')) {
      if (href !== TEL) fail.push(`WRONG PHONE: ${where}`);
      continue;
    }
    if (/^https?:\/\//.test(href)) {
      /* 6. external: new tab must be safe, and an icon-only link needs a name */
      if (/target="_blank"/.test(attrs) && !/rel="[^"]*noopener/.test(attrs)) {
        fail.push(`UNSAFE EXTERNAL: ${where} opens a new tab without rel=noopener`);
      }
      const text = html.slice(m.index + m[0].length, html.indexOf('</a>', m.index));
      const labelled = /aria-label="[^"]+"/.test(attrs) || /<title>/.test(text) ||
        text.replace(/<[^>]*>/g, '').trim().length > 0;
      if (!labelled) fail.push(`UNLABELLED LINK: ${where} has no accessible name`);
      continue;
    }
    if (href.startsWith('#')) {
      /* 3. same-page fragment */
      anchorCount++;
      const id = decodeURIComponent(href.slice(1));
      if (id && !idsOf.get(route).has(id)) fail.push(`DEAD ANCHOR: ${where} — no id="${id}" on ${route}`);
      continue;
    }
    if (!href.startsWith('/')) { warn.push(`RELATIVE HREF: ${where}`); continue; }

    /* 2 + 3. internal route, optional query, optional fragment */
    internalCount++;
    const [pathAndQuery, frag] = href.split('#');
    const path = pathAndQuery.split('?')[0];
    if (!resolves(path)) fail.push(`BROKEN LINK: ${where} — ${path} is not in the build`);
    else if (frag) {
      anchorCount++;
      const target = docs.has(path) ? path : path.replace(/\/$/, '') || '/';
      const ids = idsOf.get(target);
      if (ids && !ids.has(decodeURIComponent(frag))) {
        fail.push(`DEAD ANCHOR: ${where} — no id="${frag}" on ${path}`);
      }
    }
  }
}

/* ---------- 8. the production domain, everywhere, identically ----------
   The domain lives in exactly two authored places: SITE in astro.config.mjs
   and the Sitemap line in public/robots.txt. Everything else derives from
   SITE. This asserts they agree and that nothing still advertises an old or
   wrong host — a canonical pointing at a hostname that 308-redirects is a
   page competing with itself. */
const ORIGIN = 'https://jpsilvadigital.com';
/* Hosts that must never appear in shipped output: the www form (it redirects
   to the apex, so it is never canonical) and the domain that was never the
   production domain. */
const WRONG_HOSTS = ['https://www.jpsilvadigital.com', 'jpsilva.digital'];

const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
if (!robots) fail.push('ROBOTS: robots.txt is not in the build');
else if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`)) {
  fail.push(`ROBOTS DOMAIN: sitemap line is not ${ORIGIN}/sitemap-index.xml`);
}

for (const [route, html] of docs) {
  if (/\/404$/.test(route)) continue;
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  const ogUrl = /<meta property="og:url" content="([^"]+)"/.exec(html)?.[1];
  if (!canonical) fail.push(`CANONICAL: ${route} has none`);
  else if (!canonical.startsWith(ORIGIN)) fail.push(`CANONICAL DOMAIN: ${route} -> ${canonical}`);
  if (!ogUrl) fail.push(`OG URL: ${route} has none`);
  else if (!ogUrl.startsWith(ORIGIN)) fail.push(`OG DOMAIN: ${route} -> ${ogUrl}`);
  if (canonical && ogUrl && canonical !== ogUrl) {
    fail.push(`OG/CANONICAL MISMATCH: ${route} — ${ogUrl} vs ${canonical}`);
  }
  /* og:image and twitter:image are absolute, so they carry the host too. */
  for (const m of html.matchAll(/<meta (?:property|name)="(og:image|twitter:image)" content="([^"]+)"/g)) {
    if (!m[2].startsWith(ORIGIN)) fail.push(`${m[1].toUpperCase()} DOMAIN: ${route} -> ${m[2]}`);
  }
  /* Structured data: every absolute URL in every JSON-LD block. */
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    for (const u of m[1].matchAll(/https?:\/\/[^"\\\s]+/g)) {
      const url = u[0];
      if (/jpsilvadigital\.com|jpsilva\.digital/.test(url) && !url.startsWith(ORIGIN)) {
        fail.push(`STRUCTURED DATA DOMAIN: ${route} -> ${url}`);
      }
    }
  }
  for (const bad of WRONG_HOSTS) {
    if (html.includes(bad)) fail.push(`WRONG HOST IN OUTPUT: ${route} contains ${bad}`);
  }
}

/* The sitemap is what Search Console reads; it has to match the canonicals. */
for (const f of files.filter((x) => /sitemap.*\.xml$/.test(x))) {
  const xml = readFileSync(f, 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (!m[1].startsWith(ORIGIN)) fail.push(`SITEMAP DOMAIN: ${m[1]}`);
  }
  for (const bad of WRONG_HOSTS) {
    if (xml.includes(bad)) fail.push(`WRONG HOST IN SITEMAP: ${f.slice(DIST.length + 1)} contains ${bad}`);
  }
}

/* Every canonical must be a URL the sitemap actually lists, and vice versa. */
const sitemapUrls = new Set(
  files.filter((x) => /sitemap-\d+\.xml$/.test(x))
    .flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])),
);
for (const [route, html] of docs) {
  if (/\/404$/.test(route)) continue;
  if (/noindex/.test(html)) continue;
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  if (canonical && !sitemapUrls.has(canonical)) {
    fail.push(`CANONICAL NOT IN SITEMAP: ${route} canonicalises to ${canonical}`);
  }
}

/* ---------- 9. no developer notes in the shipped HTML ----------
   Astro strips {/* ... *\/} but passes <!-- ... --> straight through, so a
   note meant for the source can end up readable in the published page. */
const NOTE = /<!--[^>]*?(TODO|FIXME|HACK|XXX|placeholder|FAKE|REMOVE)[\s\S]*?-->/i;
for (const [route, html] of docs) {
  const m = NOTE.exec(html);
  if (m) fail.push(`DEVELOPER NOTE IN OUTPUT: ${route} ships ${m[0].slice(0, 70).replace(/\s+/g, ' ')}...`);
}

/* ---------- report ---------- */
console.log(
  `checked ${docs.size} pages · ${internalCount} internal links · ${anchorCount} fragments`,
);
for (const w of warn) console.log(`  warn  ${w}`);
if (fail.length) {
  console.error(`\n${fail.length} problem(s):`);
  for (const f of fail) console.error(`  FAIL  ${f}`);
  process.exit(1);
}
console.log('all internal links resolve, every fragment has a target, no placeholders');
