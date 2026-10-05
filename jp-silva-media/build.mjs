#!/usr/bin/env node
/* ============================================================
   JP SILVA MEDIA — static build (zero dependencies)
     node build.mjs                      → dist/          clean URLs (/work, /work/ready), for a real host
     node build.mjs --target=preview     → .preview/      relative links (work/index.html), for the private
                                                          Claude preview (no YouTube embeds, no /api there)
   Pages are rendered from src/data/*.mjs through src/templates/*.mjs.
   public/ is copied verbatim. Set PREVIEW=0 at launch to drop noindex.
   ============================================================ */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './src/data/site.mjs';
import { projects, categories, sorted } from './src/data/projects.mjs';
import { renderHome } from './src/templates/home.mjs';
import { renderWork } from './src/templates/work.mjs';
import { renderProject } from './src/templates/project.mjs';
import { renderServices } from './src/templates/services.mjs';
import { renderAbout } from './src/templates/about.mjs';
import { renderInquire } from './src/templates/inquire.mjs';
import { renderNotFound } from './src/templates/notfound.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const target = arg('target', 'web');                     // 'web' | 'preview'
const OUT = path.resolve(ROOT, arg('out', target === 'preview' ? '.preview' : 'dist'));
const preview = target === 'preview' || process.env.PREVIEW !== '0';   // noindex unless explicitly launched
/* web build served from a sub-path (e.g. --base=/jp-silva-media/ on preview.jpsilvadigital.com) and its absolute URL */
const BASE = ('/' + arg('base', '/').replace(/^\/+|\/+$/g, '') + '/').replace(/^\/\/$/, '/');
if (arg('site-url')) site.url = arg('site-url').replace(/\/+$/, '');
let ytMeta = {};
try { ytMeta = JSON.parse(await fs.readFile(path.join(ROOT, 'src/data/youtube.json'), 'utf8')); } catch (e) { /* optional */ }

/* route '' → index.html ; 'work' → work/index.html ; '404' → 404.html */
const fileFor = route => route === '' ? 'index.html' : route === '404' ? '404.html' : `${route}/index.html`;
const depthOf = route => route === '' || route === '404' ? 0 : route.split('/').length;

function makeCtx(route) {
  const depth = depthOf(route);
  const up = target === 'preview' ? (depth ? '../'.repeat(depth) : '') : BASE;
  return {
    target, preview, route, site, projects, categories, sorted, ytMeta,
    year: new Date().getFullYear(),
    /* link to another page */
    href(to, hash) {
      const h = hash ? '#' + hash : '';
      if (target === 'preview') return up + fileFor(to) + h;
      return (to === '' ? BASE : BASE + to) + h;
    },
    /* link to a file under public/ */
    asset: p => up + p.replace(/^\//, ''),
    /* absolute URL for canonical/OG/sitemap (launch domain) */
    abs: to => site.url + (to === '' ? '/' : '/' + to),
    /* external host features */
    youtube: target !== 'preview',
    inquiryTransport: target === 'preview' ? 'artifact-db' : 'api'
  };
}

async function copyDir(src, dst) {
  await fs.mkdir(dst, { recursive: true });
  for (const e of await fs.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) await copyDir(s, d); else await fs.copyFile(s, d);
  }
}

const pages = [
  { route: '', render: renderHome },
  { route: 'work', render: renderWork },
  ...sorted().map(p => ({ route: `work/${p.slug}`, render: ctx => renderProject(ctx, p) })),
  { route: 'services', render: renderServices },
  { route: 'about', render: renderAbout },
  { route: 'inquire', render: renderInquire },
  { route: '404', render: renderNotFound }
];

await fs.rm(OUT, { recursive: true, force: true });
await copyDir(path.join(ROOT, 'public'), OUT);
for (const pg of pages) {
  const html = pg.render(makeCtx(pg.route));
  const file = path.join(OUT, fileFor(pg.route));
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
}
/* robots + sitemap */
await fs.writeFile(path.join(OUT, 'robots.txt'), preview
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
if (target !== 'preview') {
  const urls = pages.filter(p => p.route !== '404').map(p => `  <url><loc>${makeCtx(p.route).abs(p.route)}</loc></url>`).join('\n');
  await fs.writeFile(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
console.log(`built ${pages.length} pages → ${path.relative(ROOT, OUT)}/ (${target}${preview ? ', noindex' : ''})`);
