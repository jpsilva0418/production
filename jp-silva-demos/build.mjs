/* JP Silva Digital · client previews (Vercel project jp-silva-demos, preview.jpsilvadigital.com)
   Builds every client in clients.json into public/<slug>/ with its links rooted at /<slug>/.
   The root has no index and no listing: "/" and unknown paths are a plain 404, so one client's URL never leads to another.
   Every response is noindex (vercel.json headers + each page's robots meta); no sitemap is published. */
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT = path.join(HERE, 'public');
const HOST = process.env.PREVIEW_HOST || 'https://preview.jpsilvadigital.com';
const clients = JSON.parse(await fs.readFile(path.join(HERE, 'clients.json'), 'utf8'));

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

for (const c of clients) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug)) throw new Error(`bad slug: ${c.slug}`);
  const dest = path.join(OUT, c.slug);
  const cmd = `${c.build} --out=${JSON.stringify(dest)} --base=/${c.slug}/ --site-url=${HOST}/${c.slug}`;
  console.log(`· ${c.slug}: ${cmd}`);
  execSync(cmd, { cwd: path.join(REPO, c.dir), stdio: 'inherit', env: { ...process.env, PREVIEW: '1' } });
  /* previews publish no sitemap and no per-client robots file */
  await fs.rm(path.join(dest, 'sitemap.xml'), { force: true });
  await fs.rm(path.join(dest, 'robots.txt'), { force: true });
}

await fs.writeFile(path.join(OUT, '404.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Not found</title>
<style>html{color-scheme:light dark}body{margin:0;min-height:100vh;display:grid;place-items:center;font:15px/1.5 system-ui,sans-serif;background:#0b0b0b;color:#cfcfcf}</style>
</head><body><p>This page doesn't exist.</p></body></html>
`);
/* crawlers may fetch pages so they see noindex; nothing here is listed or linked */
await fs.writeFile(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n');
console.log(`built ${clients.length} client preview(s) → public/`);
