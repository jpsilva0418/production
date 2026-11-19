// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

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
    server: { fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } },
  },
});
