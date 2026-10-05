/* Live check of the unlisted client demo on jpsilvadigital.com (runs on a GitHub runner: real network, Chromium + WebKit iPhone 13).
   Prints one PASS/FAIL line per check and the normalized hashes of the main JP Silva Digital pages, so two runs (before/after
   the demo deploy) can be compared. Read-only: it only fetches pages. */
import crypto from 'node:crypto';
const { chromium, webkit, devices } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const SITE = 'https://jpsilvadigital.com';
const DEMO = SITE + '/demo/jp-silva-media';
let fails = 0;
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fails++; };
const get = async (u, opt = {}) => { const r = await fetch(u, { redirect: 'manual', ...opt }); return { status: r.status, headers: r.headers, text: await r.text(), loc: r.headers.get('location') }; };

/* 1 · main site pages: status, no noindex, canonical on the apex, normalized hash (astro-island uid is random per build) */
for (const p of ['/', '/contact', '/free-demo', '/blog', '/services', '/about', '/work', '/process']) {
  const r = await get(SITE + p);
  const canon = (r.text.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const robots = (r.text.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || '';
  const h = crypto.createHash('sha256').update(r.text.replace(/\suid="[^"]*"/g, '')).digest('hex');
  console.log(`MAIN ${p} status=${r.status} xrobots=${r.headers.get('x-robots-tag') || '-'} robots=${robots || '-'} canonical=${canon} sha=${h}`);
  ok(r.status === 200 && !/noindex/.test((r.headers.get('x-robots-tag') || '') + robots), `main ${p} is 200 and indexable`);
}
/* 2 · sitemaps never list the demo */
const idx = await get(SITE + '/sitemap-index.xml');
const maps = [...idx.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
let listed = false;
for (const m of maps) { const t = (await get(m)).text; if (/\/demo\//.test(t)) listed = true; console.log(`SITEMAP ${m} urls=${(t.match(/<loc>/g) || []).length}`); }
ok(maps.length > 0 && !listed, 'no sitemap lists /demo/');
const robotsTxt = (await get(SITE + '/robots.txt')).text;
ok(!/demo/i.test(robotsTxt), 'robots.txt does not mention the demo');
/* 3 · /demo is not a directory or index; another slug is not served */
for (const p of ['/demo', '/demo/', '/demo/acme-roofing', '/demo/jp-silva-media/nope']) {
  const r = await get(SITE + p);
  ok(r.status === 404 || (r.status >= 300 && r.status < 400 && !/jp-silva-media$/.test(r.loc || '')) , `${p} → ${r.status}${r.loc ? ' ' + r.loc : ''} (no listing)`);
  ok(!/Index of|jp-silva-media"/.test(r.text) || p.startsWith('/demo/jp-silva-media'), `${p} body lists nothing`);
}
/* 4 · demo pages: 200, client site, X-Robots-Tag + meta */
const pages = ['', '/work', '/work/ready', '/work/geronimo', '/work/prints', '/services', '/about', '/inquire'];
for (const p of pages) {
  const r = await get(DEMO + p);
  const xr = r.headers.get('x-robots-tag') || '';
  const meta = (r.text.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || '';
  const title = (r.text.match(/<title>([^<]+)/) || [])[1] || '';
  ok(r.status === 200 && /JP Silva Media/.test(title) && !/JP Silva Digital/.test(title), `demo ${p || '/'} 200 · "${title}"`);
  ok(/noindex/.test(xr) && /nofollow/.test(xr) && /noarchive/.test(xr), `demo ${p || '/'} X-Robots-Tag: ${xr || '(none)'}`);
  ok(meta === 'noindex,nofollow,noarchive', `demo ${p || '/'} robots meta: ${meta || '(none)'}`);
}
const media = await get(DEMO + '/media/films/showreel.mp4', { method: 'HEAD' });
ok(media.status === 200 && /noindex/.test(media.headers.get('x-robots-tag') || ''), `demo media 200 + X-Robots-Tag (${media.status})`);

/* 5 · real browsers: phone (WebKit iPhone 13) and desktop (Chromium) */
for (const [name, type, opts] of [['WebKit · iPhone 13', webkit, devices['iPhone 13']], ['Chromium · desktop', chromium, { viewport: { width: 1440, height: 900 } }]]) {
  const b = await type.launch(); const ctx = await b.newContext(opts); const pg = await ctx.newPage();
  const bad = [], errs = [];
  pg.on('response', r => { const u = r.url(); if (r.status() >= 400 && u.startsWith(SITE) && !/\/api\/inquire/.test(u)) bad.push(r.status() + ' ' + u); });
  pg.on('pageerror', e => errs.push(String(e)));
  for (const p of pages) {
    await pg.goto(DEMO + p, { waitUntil: 'load', timeout: 45000 }); await pg.waitForTimeout(1500);
    const st = await pg.evaluate(() => ({ title: document.title, over: document.documentElement.scrollWidth - window.innerWidth, url: location.pathname, imgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('loading') !== 'lazy').length }));
    ok(st.over <= 1 && st.imgs === 0 && st.url.startsWith('/demo/jp-silva-media'), `${name} ${p || '/'}: "${st.title}" overflow=${st.over} brokenImgs=${st.imgs}`);
    await pg.screenshot({ path: `${process.env.OUT_DIR || '.'}/${name.replace(/\W+/g, '_')}${(p || '/home').replace(/\//g, '_')}.png` });
  }
  /* internal navigation stays inside the demo */
  await pg.goto(DEMO, { waitUntil: 'load' });
  const hrefs = await pg.$$eval('a[href^="/"]', as => [...new Set(as.map(a => a.getAttribute('href')))]);
  ok(hrefs.length > 5 && hrefs.every(h => h.startsWith('/demo/jp-silva-media')), `${name} all ${hrefs.length} internal links stay under /demo/jp-silva-media`);
  /* the READY film plays in the page (tap the poster; never leaves the site) */
  await pg.goto(DEMO + '/work/ready', { waitUntil: 'load' }); await pg.waitForTimeout(800);
  const box = await (await pg.$('#pj-yt')).boundingBox();
  const pages0 = ctx.pages().length;
  if (opts.hasTouch) await pg.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); else await pg.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await pg.waitForTimeout(6000);
  const yt = await pg.evaluate(() => ({ url: location.pathname, frames: [...document.querySelectorAll('#pj-yt iframe')].map(f => f.src.split('?')[0]), state: document.getElementById('pj-yt').getAttribute('data-yt-state') }));
  ok(yt.url === '/demo/jp-silva-media/work/ready' && ctx.pages().length === pages0, `${name} READY tap stays on the page (state=${yt.state}, player=${yt.frames.join(',') || 'fallback poster'})`);
  ok(bad.length === 0, `${name} no failed requests${bad.length ? ': ' + bad.slice(0, 5).join(' | ') : ''}`);
  ok(errs.length === 0, `${name} no script errors${errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''}`);
  await b.close();
}
console.log(fails ? `\n${fails} check(s) failed` : '\nall checks passed');
process.exit(fails ? 1 : 0);
