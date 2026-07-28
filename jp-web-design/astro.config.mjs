// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// TODO(launch): replace with the real domain once registered.
export const SITE = 'https://www.jpwebdesign.com';

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
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
