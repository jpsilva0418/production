#!/usr/bin/env node
/**
 * Client-demo snapshot — builds ONE design concept as a frozen, self-contained static site
 * in ../demos/<slug>/ (repo root), ready to be served on its own host.
 *
 *   node scripts/snapshot-demo.mjs <slug> <concept>      e.g.  magnolia-07 07
 *
 * What it produces (and guarantees):
 *   · the chosen concept is the home page "/" — the client never sees the review selector;
 *   · no /preview routes, no review bar, no keyboard shortcuts (DEMO_CONCEPT build flag);
 *   · client-facing <title>/description/canonical on https://<slug>.demo.jpsilvadigital.com;
 *   · noindex,nofollow on every page (meta) + X-Robots-Tag via vercel.json; no sitemap;
 *   · forms run in labelled demo mode (no /api on a static host: nothing is sent anywhere);
 *   · DEMO.json records the source commit, so every snapshot is traceable and reproducible.
 * A snapshot only changes when this script is re-run for THAT slug — publishing one demo can
 * never touch another (see ../demos/README.md).
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [slug, concept] = process.argv.slice(2);
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`usage: snapshot-demo.mjs <slug> <concept>  (bad slug: ${slug})`);
if (!concept || !/^0[1-9]$/.test(concept)) throw new Error(`bad concept: ${concept} (expected 01–09)`);

const HERE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(HERE, '..');
const DIST = path.join(HERE, 'dist');
const OUT = path.join(REPO, 'demos', slug);
const SITE = `https://${slug}.demo.jpsilvadigital.com`;
const sh = (cmd, env = {}) => execSync(cmd, { cwd: HERE, stdio: 'inherit', env: { ...process.env, ...env } });
const git = (cmd) => execSync(`git ${cmd}`, { cwd: HERE }).toString().trim();

const sourceCommit = git('rev-parse HEAD');
const dirty = git('status --porcelain -- .') !== '';

console.log(`· building concept ${concept} for ${SITE}`);
sh('npx astro build', { DEMO_CONCEPT: concept, BUILD_FORMAT: 'directory', PUBLIC_SITE_URL: SITE });

// 1 · the concept becomes the home page
const conceptHtml = path.join(DIST, 'preview', concept, 'index.html');
let html = await fs.readFile(conceptHtml, 'utf8');
if (html.includes('id="conceptBar"')) throw new Error('review bar present in a client build');
const clientTitle = 'Magnolia Healthcare — Home Care Agency';
const clientDesc = 'Magnolia Healthcare, Inc. is a Massachusetts home care agency. Our mission is to provide a higher standard of care — one built on compassion, excellence, and respect for every individual.';
html = html
  .replaceAll(`${SITE}/preview/${concept}`, `${SITE}/`)
  .replace(/Concept \d\d · [^<"]*? · Magnolia Healthcare/g, clientTitle);
const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
if (desc) html = html.replaceAll(`content="${desc}"`, `content="${clientDesc}"`);
await fs.writeFile(path.join(DIST, 'index.html'), html);

// 2 · nothing from the review environment ships
await fs.rm(path.join(DIST, 'preview'), { recursive: true, force: true });
for (const f of await fs.readdir(DIST)) if (/^sitemap.*\.xml$/.test(f)) await fs.rm(path.join(DIST, f));

// 3 · robots: crawlers may fetch pages only to read their noindex; nothing is listed
await fs.writeFile(path.join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\n# Design demo: every page is noindex,nofollow. No sitemap is published.\n');
await fs.writeFile(path.join(DIST, 'vercel.json'), JSON.stringify({
  $schema: 'https://openapi.vercel.sh/vercel.json',
  headers: [{ source: '/(.*)', headers: [
    { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ] }],
}, null, 2) + '\n');

// 4 · safety scan: no review links, every page noindex
const pages = [];
const walk = async (d) => { for (const e of await fs.readdir(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) await walk(p); else if (e.name.endsWith('.html')) pages.push(p); } };
await walk(DIST);
for (const p of pages) {
  let t = await fs.readFile(p, 'utf8');
  // Astro's redirect stubs (old URLs → new pages) carry no robots tag of their own: add it
  if (/http-equiv="refresh"/.test(t) && !/<meta name="robots" content="noindex,nofollow"/.test(t)) {
    t = t.replace(/<meta name="robots" content="[^"]*">/i, '');
    t = t.replace(/<title>/i, '<meta name="robots" content="noindex,nofollow"><title>');
    await fs.writeFile(p, t);
  }
  if (/href="\/preview/.test(t)) throw new Error(`review link left in ${path.relative(DIST, p)}`);
  if (!/<meta name="robots" content="noindex,nofollow"/.test(t)) throw new Error(`missing noindex in ${path.relative(DIST, p)}`);
}

await fs.writeFile(path.join(DIST, 'DEMO.json'), JSON.stringify({
  slug, client: 'Magnolia Healthcare, Inc.', concept, host: SITE, sourceCommit, sourceDirty: dirty,
  builtAt: new Date().toISOString(), pages: pages.length,
  note: 'Design demo — not the live website. Forms run in demo mode; nothing is sent anywhere.',
}, null, 2) + '\n');

// 5 · replace ONLY this slug's snapshot
await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.cp(DIST, OUT, { recursive: true });
console.log(`✓ ${slug}: concept ${concept}, ${pages.length} pages → demos/${slug}/ (source ${sourceCommit.slice(0, 7)}${dirty ? ', with uncommitted changes' : ''})`);
console.log('  Run `npm run build` afterwards to restore the review build in dist/.');
