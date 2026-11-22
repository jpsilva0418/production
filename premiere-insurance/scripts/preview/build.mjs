// Builds ONE self-contained HTML file of the whole site, for review without a server.
//
//   PUBLIC_DEMO_BANNER=true npm run build:node
//   node scripts/preview/build.mjs <out.html> [--mode=panel|call] [--lite]
//
// The file needs no network: every photo, texture, logo and font is embedded, and the two
// homepage videos are embedded as small re-encodes (needs ffmpeg; without it they show their
// poster frame). Service-page videos are replaced by their poster frame to keep the size down.
// The file IS the English home page as static HTML, so it displays even where scripts are
// blocked; with scripts, the other pages are swapped in on navigation.
//
// Real in the preview: every page in three languages, the language switch, the assistant's
// conversation engine and validation (bundled), browser voice where the viewer allows it.
// NOT real: there is no server, so nothing is stored or delivered. A submitted inquiry gets a
// clearly labelled sample reference, and every page says so.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { rolldown } from 'rolldown';
import sharp from 'sharp';

const root = new URL('../../', import.meta.url).pathname;
const dist = join(root, 'dist/client');
const out = process.argv[2];
const mode = (process.argv.find((a) => a.startsWith('--mode=')) ?? '--mode=panel').slice(7) === 'call' ? 'call' : 'panel';
const lite = process.argv.includes('--lite');
if (!out) throw new Error('usage: node scripts/preview/build.mjs <out.html> [--mode=panel|call] [--lite]');
const cacheDir = join(process.env.PREVIEW_CACHE ?? tmpdir(), 'premiere-preview-cache');
mkdirSync(cacheDir, { recursive: true });
const inline = (s) => s.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
const inlineJson = (s) => s.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\u0021--');

// 1. The conversation engine, bundled for the browser.
const bundle = await rolldown({ input: join(root, 'scripts/preview/engine-entry.ts'), platform: 'browser' });
const engineJs = (await bundle.generate({ format: 'iife', minify: true })).output[0].code;

// 2. Stylesheet with the latin fonts inlined.
const astroDir = join(dist, '_astro');
let css = readdirSync(astroDir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(astroDir, f), 'utf8')).join('\n');
css = css.replace(/@font-face\{[^}]*\}/g, (b) => (/latin-ext|vietnamese|cyrillic|greek/.test(b) ? '' : b));
css = css.replace(/url\((\/_astro\/[^)]+?\.woff2)\)\s*format\("woff2"\)(?:,\s*url\([^)]+\.woff\)\s*format\("woff"\))?/g, (_, p) =>
  `url(data:font/woff2;base64,${readFileSync(join(dist, p)).toString('base64')}) format("woff2")`);
const appJs = readFileSync(join(astroDir, readdirSync(astroDir).find((f) => f.endsWith('.js'))), 'utf8');

// 3. Every prerendered page.
const NOTE = ' <strong>Preview file:</strong> conversations run in this page; nothing is stored or sent, and reference numbers are samples.';
const pages = {};
let strings = '', headStyle = '';
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (f !== '_astro') walk(p); continue; }
    if (!f.endsWith('.html')) continue;
    const html = readFileSync(p, 'utf8');
    const key = '/' + relative(dist, p).replace(/\.html$/, '').replace(/^index$/, '');
    if (lite && !(key === '/' || key.endsWith('/home'))) continue;
    headStyle ||= (html.match(/<style>(:root\{--tex-paper[^<]*)<\/style>/) ?? [])[1] ?? '';
    let body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1].replace(/<script type="module"[^>]*>[\s\S]*?<\/script>/g, '');
    // The assistant's three-language strings are identical on every page: keep one copy.
    body = body.replace(/(<script type="application\/json" data-a="strings">)([\s\S]*?)(<\/script>)/, (_, a, s, c) => { strings = s; return `${a}@@STRINGS@@${c}`; });
    body = body.replace('Not the live website.</p>', `Not the live website.${NOTE}</p>`);
    pages[key] = { lang: html.match(/<html lang="([^"]+)"/)[1], locale: html.match(/<body data-locale="([^"]+)"/)[1], title: html.match(/<title>([\s\S]*?)<\/title>/)[1], body };
  }
})(dist);
if (!headStyle) throw new Error('texture variables not found in the built pages');

// 4. Media: every CDN asset becomes an embedded, compressed copy.
// File names on the CDN can contain parentheses, so ")" is allowed; every URL in the markup and CSS is quoted.
const CDN = /https:\/\/cdn\.prod\.website-files\.com\/[^"'\s&]+?\.(?:png|jpe?g|avif|webp|svg|mp4|webm)(?=["'\s&]|$)/gi;
const all = new Set([...(css + headStyle).matchAll(CDN), ...Object.values(pages).flatMap((p) => [...p.body.matchAll(CDN)])].map((m) => m[0]));
const HOME_VIDEOS = { '66e25a56e8d82cb9468a0c2b': { width: 360, seconds: 26 }, '670df505891c270ca4747287': { width: 640, seconds: 10 } };
const haveFfmpeg = (() => { try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; } })();

async function fetchCached(url) {
  const file = join(cacheDir, createHash('sha1').update(url).digest('hex'));
  // curl, not fetch(): it honours the HTTPS proxy and CA settings of locked-down build machines.
  if (!existsSync(file)) execFileSync('curl', ['-sSfL', '--retry', '3', '-m', '60', '-o', file, url]);
  return file;
}
function sizeFor(url) {
  if (/watercolor-paper-texture/.test(url)) return { w: 1000, q: 45 };
  if (/graain/.test(url)) return null; // tiny tiling noise: keep as is
  if (/check\.png|favicon/.test(url)) return { w: 64, q: 80 };
  if (/LOGOPI_PABLO|Logo_Horizontal/.test(url)) return { w: 420, q: 85 };
  if (/Logo_NEGATIVO/.test(url)) return { w: 760, q: 80 };
  if (/logo\.png$/.test(url)) return { w: 180, q: 80 };
  if (/ID%20CARD|RTA%20Form|COI|PRF|BOR/.test(url)) return { w: 320, q: 60 };
  if (/poster-00001/.test(url)) return { w: 760, q: 55 };
  if (/\/(?:66d9|6713|6714|67d4|6674a778)[0-9a-f]+_(?!pexels)/.test(url) && !/Commercial|crane|General|umbrella|Different|Cozy|Sem%20nome|Design%20sem/.test(url)) return { w: 240, q: 80 }; // carrier logos
  return { w: 720, q: 58 }; // photographs
}

const assets = [], index = new Map(), videos = {};
let mediaBytes = 0;
for (const url of all) {
  if (/\.(mp4|webm)$/i.test(url)) {
    const id = Object.keys(HOME_VIDEOS).find((k) => url.includes(k));
    if (id && /\.mp4$/i.test(url) && haveFfmpeg && !videos[id]) {
      const src = await fetchCached(url);
      const dst = join(cacheDir, `${id}-small.mp4`);
      if (!existsSync(dst)) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-t', String(HOME_VIDEOS[id].seconds), '-an', '-vf', `scale=${HOME_VIDEOS[id].width}:-2`, '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p', '-crf', '31', '-preset', 'slow', '-movflags', '+faststart', dst]);
      videos[id] = readFileSync(dst).toString('base64');
      mediaBytes += videos[id].length;
    }
    continue;
  }
  let data;
  try {
    const file = await fetchCached(url);
    const spec = sizeFor(url);
    if (/\.svg$/i.test(url)) data = `data:image/svg+xml;base64,${readFileSync(file).toString('base64')}`;
    else if (!spec) data = `data:image/png;base64,${readFileSync(file).toString('base64')}`;
    else data = `data:image/webp;base64,${(await sharp(file).resize({ width: spec.w, withoutEnlargement: true }).webp({ quality: spec.q }).toBuffer()).toString('base64')}`;
  } catch (e) {
    console.warn('skipped', url, e.message);
    continue;
  }
  index.set(url, assets.length);
  assets.push(data);
  mediaBytes += data.length;
}
const sortedUrls = [...index.keys()].sort((a, b) => b.length - a.length); // longest first: no partial overlaps

// Pages carry placeholders; the first page and the stylesheet carry the data itself.
function embedVideos(body) {
  return body.replace(/<source src="([^"]+)"[^>]*>/g, (m, url) => {
    const id = Object.keys(videos).find((k) => url.includes(k) && /\.mp4$/i.test(url));
    return id ? `<source data-pv-video="${id}" type="video/mp4">` : '';
  });
}
const withPlaceholders = (s) => sortedUrls.reduce((acc, u) => acc.split(u).join(`@@A${index.get(u)}@@`), s);
const withData = (s) => s.replace(/@@A(\d+)@@/g, (_, n) => assets[+n]);
for (const p of Object.values(pages)) p.body = withPlaceholders(embedVideos(p.body));
css = withData(withPlaceholders(css));
headStyle = withData(withPlaceholders(headStyle));
const home = pages['/'];

// 5. In-file navigation, embedded videos, and a stand-in for the two API routes.
const boot = `
(function () {
  var pages = JSON.parse(document.getElementById('pv-pages').textContent);
  var assets = JSON.parse(document.getElementById('pv-assets').textContent);
  var vids = JSON.parse(document.getElementById('pv-videos').textContent);
  var strings = document.getElementById('pv-strings').textContent;
  var app = document.getElementById('pv-app').textContent;
  var blobs = {};
  function videoUrl(id) {
    if (blobs[id]) return blobs[id];
    try {
      var bin = atob(vids[id]), bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      blobs[id] = URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
    } catch (e) { blobs[id] = 'data:video/mp4;base64,' + vids[id]; }
    return blobs[id];
  }
  function hydrateVideos() {
    document.querySelectorAll('source[data-pv-video]').forEach(function (s) {
      s.src = videoUrl(s.getAttribute('data-pv-video'));
      var v = s.parentElement; v.load(); var p = v.play(); if (p && p.catch) p.catch(function () {});
    });
  }
  // Listeners the page script adds to document/window are tracked so they can be removed on navigation.
  var tracked = [];
  [document, window].forEach(function (t) {
    var add = t.addEventListener.bind(t);
    t.addEventListener = function (type, fn, opts) { if (window.__pvTracking) tracked.push([t, type, fn, opts]); return add(type, fn, opts); };
  });
  function run() {
    window.__pvTracking = true;
    var s = document.createElement('script');
    s.type = 'module';
    s.textContent = app + '\\n;window.__pvTracking=false;';
    document.body.appendChild(s);
    hydrateVideos();
  }
  function go(path, hash) {
    var pg = pages[path];
    if (!pg) { alert('This page is in the full preview file. This smaller file holds the three home pages only.'); return; }
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    tracked.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
    tracked = [];
    document.documentElement.lang = pg.lang;
    document.documentElement.style.overflow = '';
    document.title = pg.title;
    document.body.dataset.locale = pg.locale;
    document.body.innerHTML = pg.body.replace('@@STRINGS@@', function () { return strings; }).replace(/@@A(\\d+)@@/g, function (_, n) { return assets[+n]; });
    run();
    var t = hash && document.getElementById(hash);
    if (t) t.scrollIntoView(); else window.scrollTo(0, 0);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) !== '/') return;   // tel:, https: and #anchors behave normally
    e.preventDefault();
    var parts = href.split('#');
    go(parts[0].split('?')[0], parts[1]);
  }, true);

  var realFetch = window.fetch ? window.fetch.bind(window) : null, seq = 0;
  var json = function (body, status) { return new Response(JSON.stringify(body), { status: status || 200, headers: { 'content-type': 'application/json' } }); };
  var later = function (ms, make) { return new Promise(function (r) { setTimeout(function () { r(make()); }, ms); }); };
  window.fetch = function (url, init) {
    var path = typeof url === 'string' ? url : url.url;
    if (path === '/api/assistant/turn') return later(300, function () { try { return json(Object.assign({ ok: true }, window.__previewEngine.turn(JSON.parse(init.body)))); } catch (e) { return json({ ok: false }, 500); } });
    if (path === '/api/leads') return later(500, function () {
      var v; try { v = window.__previewEngine.validate(JSON.parse(init.body)); } catch (e) { return json({ ok: false, error: 'bad_request' }, 400); }
      if (!v.ok) return json({ ok: false, error: 'invalid', fields: v.errors }, 400);
      // No server in a preview file: this reference is a sample and nothing was stored.
      return json({ ok: true, reference: 'SAMPLE-' + (1000 + ++seq), duplicate: false }, 201);
    });
    return realFetch(url, init);
  };
  run();
})();`;

const html = `<!doctype html>
<html lang="${home.lang}" data-voice="${mode}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>${home.title}</title>
<style>${headStyle}</style>
<style>${css.replace(/<\/style/gi, '<\\/style')}</style>
</head>
<body data-locale="${home.locale}">${withData(home.body).replace('@@STRINGS@@', () => strings)}
<script id="pv-pages" type="application/json">${inlineJson(JSON.stringify(pages))}</script>
<script id="pv-assets" type="application/json">${JSON.stringify(assets)}</script>
<script id="pv-videos" type="application/json">${JSON.stringify(videos)}</script>
<script id="pv-strings" type="application/json">${inlineJson(strings)}</script>
<script id="pv-app" type="text/plain">${inline(appJs)}</script>
<script>${inline(engineJs)}</script>
<script>${inline(boot)}</script>
</body>
</html>
`;
writeFileSync(out, html);
console.log(`${mode}: ${Object.keys(pages).length} pages, ${assets.length} images, ${Object.keys(videos).length} videos → ${out} (${(html.length / 1024 / 1024).toFixed(1)} MB; media ${(mediaBytes / 1024 / 1024).toFixed(1)} MB)`);
