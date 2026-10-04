// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

/* TODO(launch) — BLOCKS LAUNCH. The real domain, once registered. This single
   constant drives canonical URLs, Open Graph URLs, the sitemap and all
   structured data, so changing it here is the whole domain migration.
   public/robots.txt carries the same host and must be changed with it. */
export const SITE = 'https://www.jpsilvadigital.com';

export default defineConfig({
  site: SITE,
  integrations: [
    react(),
    /* Segmented sitemaps are a diagnostic instrument: Search Console reports
       indexation per sitemap, so a set of pages Google is declining to index
       shows up as one segment collapsing. On a site whose main future risk is
       thin industry pages, that readout is the early-warning system. */
    sitemap({ filter: (page) => !/\/404/.test(page) }),
  ],
  trailingSlash: 'never',
  build: { inlineStylesheets: 'auto', format: 'file' },
  /* HTML-only prefetch, started on mousedown/touchstart. Deliberately NOT
     'viewport', and deliberately no speculation-rules `prerender` alongside
     it (see Base.astro): prerendering executes the target page's scripts in
     a hidden document, which is what left pages half-animated and
     mid-scroll on arrival. 'tap' warms the cache a few hundred
     milliseconds before the click lands, runs none of the page's
     JavaScript, and costs nothing on pages the visitor never opens. */
  prefetch: { prefetchAll: true, defaultStrategy: 'tap' },
});
