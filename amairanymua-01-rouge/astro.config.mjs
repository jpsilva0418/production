// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

/* The demo's single source of facts lives in ../jp-web-design/scripts/amairanymua-01/. That
   folder belongs to a project with its own tsconfig (extending an Astro preset it does not
   install), which Vite's resolver would try to read for any file there. This plugin serves the
   two modules Rouge imports (site.mjs, inquiry-core.mjs) straight from disk as virtual modules,
   so they are read at build time, unchanged, and never copied. */
const SHARED = fileURLToPath(new URL('../jp-web-design/scripts/amairanymua-01/', import.meta.url));
const sharedModules = () => ({
  name: 'rouge-shared-modules',
  enforce: 'pre',
  resolveId(source, importer) {
    const fromShared = importer?.startsWith('\0rouge-shared:');
    const base = fromShared ? dirname(importer.slice('\0rouge-shared:'.length)) : importer ? dirname(importer) : '';
    if (!source.endsWith('.mjs') || !source.startsWith('.')) return null;
    const abs = resolve(base, source);
    if (abs.startsWith(SHARED)) return `\0rouge-shared:${abs}`;
    return null;
  },
  load(id) {
    if (id.startsWith('\0rouge-shared:')) return readFileSync(id.slice('\0rouge-shared:'.length), 'utf8');
    return null;
  },
});

/* ROUGE — Amairany Sierra, design preview 4 of /demo/amairanymua-01.
   The build is published by scripts/publish.mjs into
   ../jp-web-design/public/demo/amairanymua-01/rouge/ and served from that folder, so the base is
   fixed. Facts, links and photographs are read from ../jp-web-design/scripts/amairanymua-01/site.mjs. */
export const BASE = '/demo/amairanymua-01/rouge';

export default defineConfig({
  site: 'https://jpsilvadigital.com',
  base: BASE,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory', assets: 'assets', inlineStylesheets: 'auto' },
  image: { responsiveStyles: true },
  /* No prefetch: it would fire requests at tel:/sms:/external links, and this preview makes no
     network requests of its own. */
  prefetch: false,
  vite: {
    plugins: [sharedModules()],
    server: { fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } },
  },
});
