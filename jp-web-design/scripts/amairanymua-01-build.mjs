#!/usr/bin/env node
/* Builds /demo/amairanymua-01 — Amairany Sierra, on the JP Silva Digital demo-family system.

       node scripts/amairanymua-01-build.mjs
       node scripts/amairanymua-01-check.mjs      (static safety checks on what was built)

   REVIEW build (PICK = null in amairanymua-01/site.mjs): a chooser at the demo root and
   one full seven-page site per direction under /a, /b and /c.
   CLIENT build (PICK = 'a' | 'b' | 'c'): that one direction at the demo root.

   Sources live in scripts/amairanymua-01/ (facts, links and copy in site.mjs; one module
   per page family). Stylesheets, scripts, fonts and images are plain files under
   public/demo/amairanymua-01/assets/. This script writes HTML and DEMO.json only, and only
   inside public/demo/amairanymua-01/. Background, sources and open questions:
   docs/demo-amairanymua-01.md */
import { mkdirSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PICK, BASE, ORIGIN, DIRS, DIR_IDS, PAGES, FILMS, outFile } from './amairanymua-01/site.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'demo', 'amairanymua-01');
/* --dev: for working on one page family while others are mid-edit. A module that fails to
   load or render is reported and skipped (its last good pages stay), and nothing is cleared
   first. The default is strict: clear the generated pages, and any failure stops the build. */
const DEV = process.argv.includes('--dev');
const MODULES = [
  ['home.mjs', { '': 'home' }],
  ['pages-work.mjs', { portfolio: 'portfolio', reviews: 'reviews' }],
  ['pages-story.mjs', { bridal: 'bridal', services: 'services', about: 'about' }],
  ['inquiry.mjs', { 'bridal-inquiry': 'inquiry' }],
];

if (!DEV) {
  /* Clear what earlier builds wrote: generated pages only, never assets/. The three single-page
     directions of 2026-11-18 (premiere, cover, golden) are retired; they remain in git history. */
  for (const stale of ['index.html', 'premiere.html', 'cover.html', 'golden.html', 'a', 'b', 'c', ...PAGES.filter(Boolean)]) {
    rmSync(join(OUT, stale), { recursive: true, force: true });
  }
}

const written = [];
const skipped = [];
const write = (rel, html) => {
  const f = join(OUT, rel);
  mkdirSync(dirname(f), { recursive: true });
  const tmp = `${f}.${process.pid}.tmp`;
  writeFileSync(tmp, html);
  renameSync(tmp, f); /* a page on disk is always a whole page */
  written.push(rel);
};
const attempt = async (what, fn) => {
  try { await fn(); } catch (e) {
    if (!DEV) throw e;
    skipped.push(what);
    console.warn(`  skipped ${what}: ${String(e && e.message || e).split('\n')[0]}`);
  }
};
for (const [file, pages] of MODULES) {
  await attempt(file, async () => {
    const mod = await import(`./amairanymua-01/${file}`);
    for (const [path, fn] of Object.entries(pages)) {
      await attempt(`${file} → ${path || 'home'}`, async () => {
        if (typeof mod[fn] !== 'function') throw new Error(`${file} does not export ${fn}()`);
        for (const d of DIR_IDS) write(outFile(d, path), mod[fn](d));
      });
    }
  });
}
if (!PICK) await attempt('chooser.mjs', async () => write('index.html', (await import('./amairanymua-01/chooser.mjs')).chooser()));

const slots = Object.entries(FILMS).filter(([, f]) => !f.file).map(([id]) => id);
writeFileSync(join(OUT, 'DEMO.json'), JSON.stringify({
  slug: 'amairanymua-01',
  url: `${ORIGIN}${BASE}`,
  client: 'Amairany Sierra (@amairanymua)',
  state: PICK ? `client build, direction ${DIRS[PICK].letter} (${DIRS[PICK].full})` : 'review build: three directions, awaiting the founder\'s pick',
  directions: Object.fromEntries(Object.values(DIRS).map((x) => [x.id, `${x.letter} · ${x.full} — ${x.hero}`])),
  pages: PAGES.map((p) => p || 'home'),
  files: written.length,
  filmSlotsOpen: slots,
  source: 'jp-web-design/scripts/amairanymua-01-build.mjs + scripts/amairanymua-01/',
  shared: 'none — fonts, images, CSS and script all live in this folder',
  note: 'Unlisted design preview — not the official website. noindex. The bridal inquiry is demo-only: nothing typed is sent anywhere, and its last step hands off to her own JotForm. Event bookings link to her Acuity event category.',
}, null, 2) + '\n');
console.log(`built ${written.length} pages in ${OUT}${slots.length ? ` · film slots still open: ${slots.join(', ')}` : ''}${skipped.length ? ` · SKIPPED: ${skipped.join('; ')}` : ''}`);
