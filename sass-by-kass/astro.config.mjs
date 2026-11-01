// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// DEMO ORIGIN — the private preview / client-demo host, never the client's real domain.
// Set PUBLIC_SITE_URL at build time to whichever host the demo is served from.
const SITE = process.env.PUBLIC_SITE_URL || 'https://sass-by-kass-demo.vercel.app';

export default defineConfig({
  site: SITE,
  output: 'static',
  redirects: { '/contact': '/book', '/consultation': '/book', '/portfolio': '/work', '/gallery': '/work' },
  // Vercel (cleanUrls) serves page.html at /page, matching trailingSlash:'never' canonicals.
  // A plain static host needs page/index.html instead: set BUILD_FORMAT=directory there.
  trailingSlash: process.env.BUILD_FORMAT === 'directory' ? 'ignore' : 'never',
  build: {
    format: process.env.BUILD_FORMAT === 'directory' ? 'directory' : 'file', assets: 'assets', inlineStylesheets: 'auto',
    // Client-demo snapshots (scripts/snapshot-demo.mjs) serve their hashed assets from a shared,
    // append-only store, e.g. /demo/_shared — identical files across demos are stored once.
    ...(process.env.ASSETS_PREFIX ? { assetsPrefix: process.env.ASSETS_PREFIX } : {}),
  },
  // The sitemap is generated for a future launch only; the demo's robots.txt disallows everything
  // and every page is noindex. /preview is never listed.
  integrations: [sitemap({ filter: (page) => !page.includes('/404') && !page.includes('/preview') })],
  image: { responsiveStyles: true },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
