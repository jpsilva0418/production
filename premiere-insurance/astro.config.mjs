import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';

// ADAPTER=node builds a standalone server for local runs and the e2e suite.
// The default (Vercel) is what a preview / production deployment uses.
const adapter = process.env.ADAPTER === 'node' ? node({ mode: 'standalone' }) : vercel();

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://www.premiereinsuranceinc.com',
  output: 'static', // pages are prerendered; only /api/* and /staff/* run on demand
  adapter,
  trailingSlash: 'never',
  build: { format: 'file' }, // keeps the live site's extensionless URLs (/en/personal-auto, /pt/home)
  security: { checkOrigin: true },
  server: { host: true },
});
