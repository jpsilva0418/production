#!/usr/bin/env node
/* Builds /demo/amairanymua-01 — three completely different sites for Amairany Sierra.

       node scripts/amairanymua-01-build.mjs
       node scripts/amairanymua-01-check.mjs      (static safety checks on what was built)

   REVIEW build (PICK = null in amairanymua-01/site.mjs): a chooser at the demo root and
   the three seven-page sites under /veil, /noir and /edit.
   CLIENT build (PICK = 'veil' | 'noir' | 'edit'): that one site at the demo root.

   Sources live in scripts/amairanymua-01/: facts, links, photographs, film slots and
   shared copy in site.mjs; the shared bridal inquiry in inquiry-core.mjs; one folder per
   site (shell, home, pages, inquiry). Each site's stylesheets and scripts are plain files
   under public/demo/amairanymua-01/assets/<site>/. This script writes HTML and DEMO.json
   only, and only inside public/demo/amairanymua-01/. Background, sources and open
   questions: docs/demo-amairanymua-01.md */
import { mkdirSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PICK, BASE, ORIGIN, SITES, BUILT_IDS, PAGES, FILMS, outFile, pagesOf } from './amairanymua-01/site.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'demo', 'amairanymua-01');
/* --dev: for working on one page family while others are mid-edit. A module that fails to
   load or render is reported and skipped (its last good pages stay), and nothing is cleared
   first. The default is strict: clear the generated pages, and any failure stops the build. */
const DEV = process.argv.includes('--dev');
if (!DEV) {
  /* Clear what earlier builds wrote: generated pages only, never assets/. The three single-page
     directions of 2026-11-18 (premiere, cover, golden) are retired; they remain in git history. */
  for (const stale of ['index.html', 'premiere.html', 'cover.html', 'golden.html', 'a', 'b', 'c', ...BUILT_IDS, ...PAGES.filter(Boolean)]) { /* prebuilt sites (rouge) are never cleared here */
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
for (const id of BUILT_IDS) {
  await attempt(`site ${id}`, async () => {
    const { render } = await import(`./amairanymua-01/${id}/index.mjs`);
    for (const path of pagesOf(id)) {
      await attempt(`${id} → ${path || 'home'}`, async () => {
        if (typeof render[path] !== 'function') throw new Error(`${id}/index.mjs has no renderer for "${path}"`);
        write(outFile(id, path), render[path]());
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
  state: PICK ? `client build: ${SITES[PICK].name}` : 'review build: three different sites, awaiting the founder\'s pick',
  sites: Object.fromEntries(Object.values(SITES).map((x) => [x.id, `${x.n} · ${x.name} — ${x.line}`])),
  pages: Object.fromEntries(Object.keys(SITES).map((id) => [id, (SITES[id].prebuilt ? ['(prebuilt)'] : pagesOf(id).map((p) => p || 'home'))])),
  files: written.length,
  filmSlotsOpen: slots,
  source: 'jp-web-design/scripts/amairanymua-01-build.mjs + scripts/amairanymua-01/',
  shared: 'nothing is shared with any other demo — fonts, images, CSS and script all live in this folder',
  note: 'Unlisted design preview — not the official website. noindex. The bridal inquiry is demo-only: nothing typed is sent anywhere, and its last step hands off to her own JotForm. Event bookings link to her Acuity event category.',
}, null, 2) + '\n');
console.log(`built ${written.length} pages in ${OUT}${slots.length ? ` · film slots still open: ${slots.join(', ')}` : ''}${skipped.length ? ` · SKIPPED: ${skipped.join('; ')}` : ''}`);
