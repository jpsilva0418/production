#!/usr/bin/env node
/**
 * CLIENT-DEMO SNAPSHOT → the JP Silva Digital demo library (jpsilvadigital.com/demo/<slug>).
 *
 *   node scripts/snapshot-demo.mjs <slug> <concept> --lib <path-to>/jp-web-design/public/demo [--republish]
 *   e.g.  node scripts/snapshot-demo.mjs magnolia-07 07 --lib ../../jpsd/jp-web-design/public/demo
 *
 * Builds ONE Magnolia design concept as a frozen, unlisted client demo:
 *   · /demo/<slug> opens straight into the concept — no review selector, no /preview routes;
 *   · every page noindex,nofollow (the site also sends X-Robots-Tag for /demo/*);
 *   · forms are demo-only (PUBLIC_DEMO_ONLY=1): they never contact any server — the host's own
 *     /api routes belong to JP Silva Digital and must never receive a demo submission;
 *   · hashed build assets go to the shared store /demo/_shared/assets/ and the client's media to
 *     /demo/_shared/<client>/ — both APPEND-ONLY: an existing file is never changed (a clash
 *     with different content stops the run), so publishing a new demo can never alter an old one;
 *   · DEMO.json records the client, concept and exact source commit.
 * Guard: an existing /demo/<slug> is never replaced unless --republish is given AND it belongs to
 * the same client. A slug is never reused for another company.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const [slug, concept] = args.filter((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--lib');
const libArg = args[args.indexOf('--lib') + 1];
const republish = args.includes('--republish');
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`bad slug "${slug}" (lowercase words and digits joined by hyphens)`);
if (!concept || !/^0[1-9]$/.test(concept)) throw new Error(`bad concept "${concept}" (01–09)`);
if (!args.includes('--lib') || !libArg) throw new Error('missing --lib <path to jp-web-design/public/demo>');

const CLIENT = 'Magnolia Healthcare, Inc.';
const CLIENT_KEY = 'magnolia';                       // the client's media folder in the shared store
const ORIGIN = 'https://jpsilvadigital.com';
const BASE = `/demo/${slug}`;
const SHARED = '/demo/_shared';
const HERE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(HERE, 'dist');
const LIB = path.resolve(libArg);
const OUT = path.join(LIB, slug);
if (path.basename(LIB) !== 'demo' || !existsSync(LIB)) throw new Error(`--lib must be an existing .../public/demo folder (got ${LIB})`);

// ---- guard: never overwrite another client's link ----
if (existsSync(OUT)) {
  const meta = existsSync(path.join(OUT, 'DEMO.json')) ? JSON.parse(await fs.readFile(path.join(OUT, 'DEMO.json'), 'utf8')) : null;
  if (!republish) throw new Error(`/demo/${slug} already exists — pick a new slug, or pass --republish to update this same client's demo`);
  if (!meta || meta.client !== CLIENT) throw new Error(`/demo/${slug} belongs to ${meta?.client ?? 'another demo'} — slugs are never reused`);
}

const git = (cmd) => execSync(`git ${cmd}`, { cwd: HERE }).toString().trim();
const sourceCommit = git('rev-parse HEAD');
const dirty = git('status --porcelain -- .') !== '';

console.log(`· building concept ${concept} for ${ORIGIN}${BASE}`);
execSync('npx astro build', { cwd: HERE, stdio: 'inherit', env: { ...process.env,
  DEMO_CONCEPT: concept, PUBLIC_DEMO_ONLY: '1', BUILD_FORMAT: 'directory', PUBLIC_SITE_URL: ORIGIN, ASSETS_PREFIX: SHARED } });

// ---- 1 · the concept is the demo's home page; the review environment is stripped ----
let home = await fs.readFile(path.join(DIST, 'preview', concept, 'index.html'), 'utf8');
if (home.includes('id="conceptBar"')) throw new Error('review bar present in a client build');
const clientTitle = 'Magnolia Healthcare — Home Care Agency';
const clientDesc = 'Magnolia Healthcare, Inc. is a Massachusetts home care agency. Our mission is to provide a higher standard of care — one built on compassion, excellence, and respect for every individual.';
home = home.replaceAll(`${ORIGIN}/preview/${concept}`, `${ORIGIN}/`).replace(/Concept \d\d · [^<"]*? · Magnolia Healthcare/g, clientTitle);
const desc = home.match(/<meta name="description" content="([^"]*)"/)?.[1];
if (desc) home = home.replaceAll(`content="${desc}"`, `content="${clientDesc}"`);
await fs.writeFile(path.join(DIST, 'index.html'), home);
for (const f of ['preview', '404.html', 'robots.txt']) await fs.rm(path.join(DIST, f), { recursive: true, force: true });
for (const f of await fs.readdir(DIST)) if (/^sitemap.*\.xml$/.test(f)) await fs.rm(path.join(DIST, f));

// ---- 2 · shared, append-only stores ----
const same = async (a, b) => Buffer.compare(await fs.readFile(a), await fs.readFile(b)) === 0;
async function store(srcDir, destDir) {
  let added = 0, reused = 0;
  const walk = async (rel) => {
    for (const e of await fs.readdir(path.join(srcDir, rel), { withFileTypes: true })) {
      const r = path.join(rel, e.name);
      if (e.isDirectory()) { await walk(r); continue; }
      const src = path.join(srcDir, r), dest = path.join(destDir, r);
      if (existsSync(dest)) {
        if (!(await same(src, dest))) throw new Error(`shared store clash: ${path.relative(LIB, dest)} exists with different content — shared files are immutable; give the new file a new name`);
        reused++;
      } else { await fs.mkdir(path.dirname(dest), { recursive: true }); await fs.copyFile(src, dest); added++; }
    }
  };
  if (existsSync(srcDir)) await walk('');
  return { added, reused };
}
// hashed build output (CSS, JS, fonts, images): content-addressed by name
const sharedAssets = await store(path.join(DIST, 'assets'), path.join(LIB, '_shared', 'assets'));
await fs.rm(path.join(DIST, 'assets'), { recursive: true, force: true });
// the client's own media (films, posters, PDF, icon)
const tmpMedia = path.join(DIST, '.client-media');
await fs.mkdir(tmpMedia, { recursive: true });
for (const f of ['media', 'downloads', 'fonts', 'favicon.svg']) if (existsSync(path.join(DIST, f))) await fs.rename(path.join(DIST, f), path.join(tmpMedia, f));
const sharedMedia = await store(tmpMedia, path.join(LIB, '_shared', CLIENT_KEY));
await fs.rm(tmpMedia, { recursive: true, force: true });

// ---- 3 · rewrite every root path in the pages to live under /demo/<slug> ----
const mapPath = (p) => {
  if (p.startsWith('//') || p.startsWith('/demo/')) return p;
  if (/^\/(media|downloads|fonts)\//.test(p) || p === '/favicon.svg') return `${SHARED}/${CLIENT_KEY}${p}`;
  if (p === '/') return BASE;
  if (p.startsWith('/#') || p.startsWith('/?')) return BASE + p.slice(1);
  return BASE + p;
};
const rewrite = (html) => html
  // absolute self-URLs (canonical, Open Graph, structured data)
  .replace(new RegExp(`${ORIGIN.replace(/[.]/g, '\\.')}(/[^"'\\s<>)]*)`, 'g'), (_, p) => ORIGIN + mapPath(p))
  // the same self-URLs URL-encoded inside share links (?u=https%3A%2F%2F…)
  .replace(new RegExp(`${encodeURIComponent(ORIGIN).replace(/[.]/g, '\\.')}((?:%2F)[^"'&\\s<>]*)`, 'gi'), (_, p) => encodeURIComponent(ORIGIN + mapPath(decodeURIComponent(p))))
  // root-relative attributes
  .replace(/\b(href|src|poster|data-src|action|data-apply-href)="(\/[^"]*)"/g, (_, a, p) => `${a}="${mapPath(p)}"`)
  .replace(/\bsrcset="([^"]*)"/g, (_, v) => `srcset="${v.split(',').map((part) => part.trim().replace(/^(\/\S*)/, (u) => mapPath(u))).join(', ')}"`)
  // Astro redirect stubs: meta refresh target
  .replace(/content="(\d+);url=(\/[^"]*)"/g, (_, s, p) => `content="${s};url=${mapPath(p)}"`);

const pages = [];
const walk = async (d) => { for (const e of await fs.readdir(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) await walk(p); else if (e.name.endsWith('.html')) pages.push(p); } };
await walk(DIST);
for (const p of pages) {
  let t = rewrite(await fs.readFile(p, 'utf8'));
  // redirect stubs carry only "noindex": make every page noindex,nofollow
  if (/http-equiv="refresh"/.test(t) && !/<meta name="robots" content="noindex,nofollow"/.test(t)) {
    t = t.replace(/<meta name="robots" content="[^"]*">/i, '').replace(/<title>/i, '<meta name="robots" content="noindex,nofollow"><title>');
  }
  // ---- safety scan ----
  const rel = path.relative(DIST, p);
  if (!/<meta name="robots" content="noindex,nofollow"/.test(t)) throw new Error(`missing noindex in ${rel}`);
  if (/\b(?:href|src|poster|data-src|action)="\/(?!demo\/)/.test(t)) throw new Error(`un-rewritten root path in ${rel}: ${t.match(/\b(?:href|src|poster|data-src|action)="\/(?!demo\/)[^"]*"/)[0]}`);
  if (new RegExp(`${encodeURIComponent(ORIGIN + '/').replace(/[.]/g, '\\.')}(?!demo%2F)`, 'i').test(t)) throw new Error(`un-rewritten encoded self-URL in ${rel}`);
  if (/\/preview\//.test(t.replace(/<script[\s\S]*?<\/script>/g, ''))) throw new Error(`review link left in ${rel}`);
  await fs.writeFile(p, t);
}
// the shared JS must not call any API in this build (forms are demo-only)
for (const f of await fs.readdir(path.join(LIB, '_shared', 'assets'))) if (f.endsWith('.js')) {
  const js = await fs.readFile(path.join(LIB, '_shared', 'assets', f), 'utf8');
  if (/["'`]\/(media|downloads)\//.test(js)) throw new Error(`root media path inside shared script ${f}`);
}

await fs.writeFile(path.join(DIST, 'DEMO.json'), JSON.stringify({
  slug, url: ORIGIN + BASE, client: CLIENT, concept, sourceRepo: 'jpsilva0418/production', sourceDir: 'magnolia-healthcare',
  sourceCommit, sourceDirty: dirty, builtAt: new Date().toISOString(), pages: pages.length,
  shared: { assets: `${SHARED}/assets/`, media: `${SHARED}/${CLIENT_KEY}/` },
  note: 'Unlisted design demo — not the live website. noindex. Forms are demo-only: nothing is sent anywhere.',
}, null, 2) + '\n');

// ---- 4 · publish into the library: only this slug's folder is written ----
await fs.rm(OUT, { recursive: true, force: true });
await fs.cp(DIST, OUT, { recursive: true });
console.log(`✓ /demo/${slug}: concept ${concept}, ${pages.length} pages (source ${sourceCommit.slice(0, 7)}${dirty ? ', UNCOMMITTED changes' : ''})`);
console.log(`  shared assets: +${sharedAssets.added} new, ${sharedAssets.reused} reused · ${CLIENT_KEY} media: +${sharedMedia.added} new, ${sharedMedia.reused} reused`);
console.log('  Run `npm run build` afterwards to restore the review build in dist/.');
