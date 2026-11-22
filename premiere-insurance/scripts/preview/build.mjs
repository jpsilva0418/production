// Builds ONE self-contained HTML file of the whole site for review without a server.
//   PUBLIC_DEMO_BANNER=true npm run build:node && node scripts/preview/build.mjs <out.html>
//
// What is real in the preview: every page in three languages, the language switch, the
// assistant's conversation engine and field validation (bundled into the file).
// What is NOT: there is no server, so nothing is stored or delivered. A submitted inquiry
// gets a clearly labelled sample reference. The file says so on every page.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { rolldown } from 'rolldown';

const root = new URL('../../', import.meta.url).pathname;
const dist = join(root, 'dist/client');
const out = process.argv[2];
if (!out) throw new Error('usage: node scripts/preview/build.mjs <out.html>');

// 1. The conversation engine, bundled for the browser.
const bundle = await rolldown({ input: join(root, 'scripts/preview/engine-entry.ts'), platform: 'browser' });
const { output } = await bundle.generate({ format: 'iife', minify: true });
const engineJs = output[0].code;

// 2. Stylesheets with fonts inlined (latin + latin-ext woff2 only).
const astroDir = join(dist, '_astro');
let css = readdirSync(astroDir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(astroDir, f), 'utf8')).join('\n');
css = css.replace(/@font-face\{[^}]*\}/g, (block) => (/vietnamese|cyrillic|greek/.test(block) ? '' : block));
css = css.replace(/url\((\/_astro\/[^)]+?\.woff2)\)\s*format\("woff2"\)(?:,\s*url\([^)]+\.woff\)\s*format\("woff"\))?/g, (_, p) =>
  `url(data:font/woff2;base64,${readFileSync(join(dist, p)).toString('base64')}) format("woff2")`);
const appJs = readFileSync(join(astroDir, readdirSync(astroDir).find((f) => f.endsWith('.js'))), 'utf8');

// 3. Every prerendered page, keyed by its live URL path.
const pages = {};
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (f !== '_astro') walk(p); continue; }
    if (!f.endsWith('.html')) continue;
    const key = '/' + relative(dist, p).replace(/\.html$/, '').replace(/^index$/, '');
    let html = readFileSync(p, 'utf8');
    html = html.replace(/<link rel="stylesheet"[^>]*>/g, '').replace(/<script type="module"[^>]*><\/script>/g, '');
    // The root page's "return to your saved language" redirect would navigate away from the file.
    html = html.replace(/<script>\s*\/\* Returning visitors[\s\S]*?<\/script>/, '');
    html = html.replace('</head>', '<style>/*CSS*/</style><script>/*BOOT*/</script></head>');
    html = html.replace('</body>', '<script type="module">/*APP*/</script></body>');
    html = html.replace('<p class="demo-flag">', '<p class="demo-flag" data-preview-note>').replace(
      'Not the live website.</p>', 'Not the live website. <strong>Preview file:</strong> conversations run in this page; nothing is stored or sent, and reference numbers are samples.</p>');
    pages[key === '/' ? '/' : key] = html;
  }
})(dist);

// 4. Runs inside every page: in-file navigation and a stand-in for the two API routes.
const boot = `
(function () {
  var P = window.parent && window.__go ? window : window;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href[0] !== '/') return;          // tel:, https:, #anchors behave normally
    e.preventDefault();
    var parts = href.split('#');
    if (window.__pages[parts[0]]) window.__go(parts[0], parts[1]);
  }, true);
  var realFetch = window.fetch;
  var seq = 0;
  window.fetch = function (url, init) {
    var path = typeof url === 'string' ? url : url.url;
    var json = function (body, status) { return Promise.resolve(new Response(JSON.stringify(body), { status: status || 200, headers: { 'content-type': 'application/json' } })); };
    try {
      if (path === '/api/assistant/turn') return new Promise(function (r) { setTimeout(r, 350); }).then(function () { return json(Object.assign({ ok: true }, window.__previewEngine.turn(JSON.parse(init.body)))); });
      if (path === '/api/leads') {
        var v = window.__previewEngine.validate(JSON.parse(init.body));
        if (!v.ok) return json({ ok: false, error: 'invalid', fields: v.errors }, 400);
        // No server in a preview file: this reference is a sample and nothing was stored.
        return new Promise(function (r) { setTimeout(r, 500); }).then(function () { return json({ ok: true, reference: 'SAMPLE-' + String(1000 + (++seq)), duplicate: false }, 201); });
      }
    } catch (err) { return json({ ok: false, error: 'bad_request' }, 400); }
    return realFetch.apply(this, arguments);
  };
})();`;

const esc = (s) => s.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
const shell = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Premiere Insurance — demo preview</title><meta name="robots" content="noindex, nofollow"></head><body>
<script id="pv-pages" type="application/json">${esc(JSON.stringify(pages))}</script>
<script id="pv-css" type="text/plain">${esc(css)}</script>
<script id="pv-app" type="text/plain">${esc(appJs)}</script>
<script id="pv-boot" type="text/plain">${esc(boot)}</script>
<script>${esc(engineJs)}</script>
<script>
(function () {
  var get = function (id) { return document.getElementById(id).textContent; };
  var un = function (s) { return s.replace(/<\\\\\\/script/gi, '</' + 'script').replace(/<\\\\!--/g, '<!' + '--'); };
  window.__pages = JSON.parse(get('pv-pages'));
  var css = un(get('pv-css')), app = un(get('pv-app')), boot = un(get('pv-boot'));
  window.__go = function (path, hash) {
    var html = window.__pages[path].replace('/*CSS*/', function () { return css; }).replace('/*BOOT*/', function () { return boot; }).replace('/*APP*/', function () { return app; });
    document.open(); document.write(html); document.close();
    setTimeout(function () { var t = hash && document.getElementById(hash); if (t) t.scrollIntoView(); else window.scrollTo(0, 0); }, 60);
  };
  window.__go('/');
})();
</script></body></html>`;
writeFileSync(out, shell);
console.log(`${Object.keys(pages).length} pages → ${out} (${(shell.length / 1024 / 1024).toFixed(2)} MB)`);
