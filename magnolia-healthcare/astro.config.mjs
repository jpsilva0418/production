// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// DEMO ORIGIN — the private preview / client-demo host, never Magnolia's real domain.
// The real production domain is NOT pointed here: this build is a demo. Set
// PUBLIC_SITE_URL at build time to whichever host the demo is served from.
const SITE = process.env.PUBLIC_SITE_URL || 'https://magnolia-healthcare-demo.vercel.app';

export default defineConfig({
  site: SITE,
  output: 'static',
  // Vercel (cleanUrls) serves page.html at /page, matching trailingSlash:'never'
  // canonicals — the Leti Silva Beauty convention. A plain static host (e.g. the Render
  // preview) needs page/index.html instead: set BUILD_FORMAT=directory there.
  trailingSlash: process.env.BUILD_FORMAT === 'directory' ? 'ignore' : 'never',
  build: { format: process.env.BUILD_FORMAT === 'directory' ? 'directory' : 'file', assets: 'assets', inlineStylesheets: 'auto' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  image: { responsiveStyles: true },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
