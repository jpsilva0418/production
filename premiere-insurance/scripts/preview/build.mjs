// Builds ONE self-contained HTML file of the whole site for review without a server.
//   npm run preview:file -- <out.html>
//
// The file IS the English home page as plain static HTML, so it displays even in a
// restrictive viewer. The other pages travel inside it and are swapped in on navigation.
//
// Real in the preview: every page in three languages, the language switch, the assistant's
// conversation engine and field validation (bundled into the file).
// NOT real: there is no server, so nothing is stored or delivered. A submitted inquiry gets
// a clearly labelled sample reference, and every page says so.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { rolldown } from 'rolldown';

const root = new URL('../../', import.meta.url).pathname;
const dist = join(root, 'dist/client');
const out = process.argv[2];
if (!out) throw new Error('usage: node scripts/preview/build.mjs <out.html>');
const inline = (s) => s.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
// JSON has no \\! escape, so comment openers are written as a unicode escape instead.
const inlineJson = (s) => s.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\u0021--');
const lite = process.argv.includes('--lite'); // home pages only: a much smaller file

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

// 3. Every prerendered page: language, title and body, keyed by its live URL path.
const NOTE = ' <strong>Preview file:</strong> conversations run in this page; nothing is stored or sent, and reference numbers are samples.';
const pages = {};
let strings = '';
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (f !== '_astro') walk(p); continue; }
    if (!f.endsWith('.html')) continue;
    const html = readFileSync(p, 'utf8');
    const key = '/' + relative(dist, p).replace(/\.html$/, '').replace(/^index$/, '');
    let body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1].replace(/<script type="module"[^>]*>[\s\S]*?<\/script>/g, '');
    // The assistant's three-language strings are identical on every page: keep one copy.
    body = body.replace(/(<script type="application\/json" data-a="strings">)([\s\S]*?)(<\/script>)/, (_, a, s, c) => { strings = s; return `${a}@@STRINGS@@${c}`; });
    body = body.replace('Not the live website.</p>', `Not the live website.${NOTE}</p>`);
    pages[key] = { lang: html.match(/<html lang="([^"]+)"/)[1], locale: html.match(/<body data-locale="([^"]+)"/)[1], title: html.match(/<title>([\s\S]*?)<\/title>/)[1], body };
  }
})(dist);
const home = pages['/'];

// 4. In-file navigation and a stand-in for the two API routes.
const boot = `
(function () {
  var pages = JSON.parse(document.getElementById('pv-pages').textContent);
  var strings = document.getElementById('pv-strings').textContent;
  var app = document.getElementById('pv-app').textContent;
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
    document.body.innerHTML = pg.body.replace('@@STRINGS@@', function () { return strings; });
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
    go(parts[0], parts[1]);
  }, true);

  var realFetch = window.fetch ? window.fetch.bind(window) : null, seq = 0;
  var json = function (body, status) { return new Response(JSON.stringify(body), { status: status || 200, headers: { 'content-type': 'application/json' } }); };
  var later = function (ms, make) { return new Promise(function (r) { setTimeout(function () { r(make()); }, ms); }); };
  window.fetch = function (url, init) {
    var path = typeof url === 'string' ? url : url.url;
    if (path === '/api/assistant/turn') return later(350, function () { try { return json(Object.assign({ ok: true }, window.__previewEngine.turn(JSON.parse(init.body)))); } catch (e) { return json({ ok: false }, 500); } });
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
<html lang="${home.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>${home.title}</title>
<style>${css.replace(/<\/style/gi, '<\\/style')}</style>
</head>
<body data-locale="${home.locale}">${home.body.replace('@@STRINGS@@', () => strings)}
<script id="pv-pages" type="application/json">${inlineJson(JSON.stringify(lite ? Object.fromEntries(Object.entries(pages).filter(([k]) => k === '/' || k.endsWith('/home'))) : pages))}</script>
<script id="pv-strings" type="application/json">${inlineJson(strings)}</script>
<script id="pv-app" type="text/plain">${inline(appJs)}</script>
<script>${inline(engineJs)}</script>
<script>${inline(boot)}</script>
</body>
</html>
`;
writeFileSync(out, html);
console.log(`${Object.keys(pages).length} pages → ${out} (${(html.length / 1024).toFixed(0)} KB)`);
