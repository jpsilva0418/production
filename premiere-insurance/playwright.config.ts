import { defineConfig, devices } from '@playwright/test';

// The suite runs against the production build on a real PostgreSQL (E2E_DATABASE_URL).
// PLAYWRIGHT_CHROMIUM_PATH is honoured only when set, for sandboxes with a pre-installed browser.
const db = process.env.E2E_DATABASE_URL;
if (!db) throw new Error('E2E_DATABASE_URL is required: the browser tests prove leads really reach a database.');
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;
const PORT = 4399;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: `http://127.0.0.1:${PORT}`, launchOptions: { executablePath }, trace: 'off' },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] }, grepInvert: /@desktop/ },
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } }, grep: /@desktop/ },
  ],
  webServer: {
    command: 'node scripts/migrate.mjs && node dist/server/entry.mjs',
    url: `http://127.0.0.1:${PORT}/api/health`,
    reuseExistingServer: false,
    env: { DATABASE_URL: db, HOST: '127.0.0.1', PORT: String(PORT), STAFF_INBOX_TOKEN: 'e2e-staff-code', PHONE_WEBHOOK_SECRET: 'e2e-phone-secret', CRON_SECRET: 'e2e-cron', IP_HASH_SALT: 'e2e' },
  },
});
