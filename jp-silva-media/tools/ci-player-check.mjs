#!/usr/bin/env node
/* YouTube player check against REAL YouTube. Runs on a GitHub Actions runner (.github/workflows/jpsm-player-check.yml)
   because the build sandbox cannot reach YouTube. A test only: it deploys and publishes nothing.
     A · embeddability, per id in src/data/youtube.json: oEmbed status + a real YT.Player (nocookie host, muted autoplay)
         in headless Chromium on a throwaway harness page (dist/__yt-probe.html, written here, removed at the end).
         embeddable + embedCheckedAt are written back ONLY when the value changes; an inconclusive run writes nothing.
         The GitHub job runs with NO_WRITE=1: it only reports the change (summary + results.json), a person applies it.
     B · the web build served at BASE_URL: each YouTube project page (tap the poster centre → one nocookie iframe,
         playsinline=1, fullscreen + autoplay allowed inside it, the site-wide grain off while it is up,
         #pj-yt[data-yt-state]) and the home reel (one muted player with autoplay allowed, or the Play gate), in
         Chromium (desktop) and WebKit (iPhone 13). One screenshot per page and browser.
     C · a markdown table to stdout and $GITHUB_STEP_SUMMARY; screenshots + results.json in OUT_DIR.
   Exit 1 ONLY on genuine site failures (broken state, navigation away, a popup, more than one player, an iframe without
   playsinline). YouTube bot-checks and network trouble are WARN, never a failure.
     node tools/ci-player-check.mjs
   Env  BASE_URL           served web build (default http://127.0.0.1:8811)
        DIST_DIR           directory BASE_URL serves, for the probe harness (default dist/)
        OUT_DIR            screenshots + results.json (default .data/player-check/, git-ignored)
        PLAYWRIGHT_MODULE  path to playwright's index.mjs (CI installs it outside the repo)
        STUB_YT=1          local dry run: YouTube answered by page.route stubs (STUB_YT_MODE=play|blocked|error);
                           youtube.json is never written
        PW_LAUNCHER        local only: a module exporting launch() for Chromium (e.g. the sandbox's CA-aware launcher)
        NO_WRITE=1 · SKIP_A=1 · SKIP_B=1 · ONLY=<slug>,home */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { projects } from '../src/data/projects.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = process.env;
const BASE = (env.BASE_URL || 'http://127.0.0.1:8811').replace(/\/+$/, '');
const DIST = path.resolve(ROOT, env.DIST_DIR || 'dist');
const OUT = path.resolve(ROOT, env.OUT_DIR || '.data/player-check');
const STUB = env.STUB_YT === '1', STUB_MODE = env.STUB_YT_MODE || 'play';
const WRITE = !STUB && env.NO_WRITE !== '1';
const ONLY = env.ONLY ? env.ONLY.split(',').map(s => s.trim()) : null;
const YT_JSON = path.join(ROOT, 'src/data/youtube.json');
const PROBE_FILE = '__yt-probe.html';
const PROBE_MS = 25000, PAGE_MS = 20000, HOME_MS = 20000;
const BOT = /confirm you.?re not a bot|sign in to confirm|unusual traffic|not a robot/i;
const YT_HOST = /(^|\.)youtube(-nocookie)?\.com$/;

/* ---------- Playwright: installed by the CI job outside the repo (the site has no dev dependencies) ---------- */
let pw = null;
for (const c of [env.PLAYWRIGHT_MODULE, 'playwright', '/opt/node22/lib/node_modules/playwright/index.mjs'].filter(Boolean)) {
  try { pw = await import(c.startsWith('/') ? pathToFileURL(c).href : c); break; } catch (e) { /* next */ }
}
if (!pw) { console.error('Playwright is required (set PLAYWRIGHT_MODULE to its index.mjs)'); process.exit(2); }
const { chromium, webkit, devices } = pw;
const launcher = env.PW_LAUNCHER ? await import(pathToFileURL(path.resolve(env.PW_LAUNCHER)).href) : null;
const launchChromium = (args = []) => launcher ? launcher.launch({ args }) : chromium.launch({ args });

const ytFilms = projects.filter(p => p.media && p.media.kind === 'youtube');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const short = (s, n = 160) => s == null ? null : String(s).replace(/\s+/g, ' ').trim().slice(0, n);
await fs.mkdir(path.join(OUT, 'shots'), { recursive: true });

/* ---------- STUB_YT=1: a stand-in for the IFrame API and the embed page (local dry run only) ---------- */
const MOCK_API = `(function(){
  var MODE = ${JSON.stringify(STUB_MODE)}, S = { UNSTARTED:-1, ENDED:0, PLAYING:1, PAUSED:2, BUFFERING:3, CUED:5 }, n = 0;
  function Player(el, o) {
    o = o || {}; var self = this, ev = o.events || {}, pv = o.playerVars || {}, vid = o.videoId, st = -1, muted = pv.mute == 1, q = [];
    var host = typeof el === 'string' ? document.getElementById(el) : el, f = document.createElement('iframe');
    for (var k in pv) q.push(encodeURIComponent(k) + '=' + encodeURIComponent(pv[k]));
    if (pv.origin == null) q.push('origin=' + encodeURIComponent(location.origin));
    q.push('enablejsapi=1', 'widgetid=' + (++n));
    f.id = host.id; f.setAttribute('frameborder', '0'); f.setAttribute('allowfullscreen', '');
    f.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin'); f.setAttribute('title', 'YouTube video player');
    f.setAttribute('width', o.width || 640); f.setAttribute('height', o.height || 360);
    f.src = (o.host || 'https://www.youtube.com') + '/embed/' + encodeURIComponent(vid || '') + '?' + q.join('&');
    host.parentNode.replaceChild(f, host);
    function fire(s) { st = s; ev.onStateChange && ev.onStateChange({ data: s, target: self }); }
    function start() {
      if (MODE === 'error') { setTimeout(function(){ ev.onError && ev.onError({ data: 150, target: self }); }, 150); return; }
      if (MODE === 'blocked') return;
      setTimeout(function(){ fire(S.BUFFERING); fire(S.PLAYING); }, 200);
    }
    this.playVideo = start; this.pauseVideo = function(){ if (st === 1) fire(S.PAUSED); }; this.stopVideo = function(){ fire(S.CUED); };
    this.loadVideoById = function(a){ vid = typeof a === 'object' ? a.videoId : a; fire(S.UNSTARTED); start(); };
    this.cueVideoById = function(a){ vid = typeof a === 'object' ? a.videoId : a; fire(S.CUED); };
    this.mute = function(){ muted = true; }; this.unMute = function(){ muted = false; }; this.isMuted = function(){ return muted; };
    this.setVolume = function(){}; this.getVolume = function(){ return muted ? 0 : 100; };
    this.getPlayerState = function(){ return st; }; this.getDuration = function(){ return 200; }; this.getCurrentTime = function(){ return 0; };
    this.seekTo = function(){}; this.getVideoData = function(){ return { video_id: vid }; }; this.getIframe = function(){ return f; };
    this.addEventListener = function(){}; this.removeEventListener = function(){}; this.destroy = function(){ f.remove(); };
    setTimeout(function(){ ev.onReady && ev.onReady({ target: self }); if (pv.autoplay == 1) start(); }, 150);
  }
  window.YT = { Player: Player, PlayerState: S, loaded: 1 };
  setTimeout(function(){ window.onYouTubeIframeAPIReady && window.onYouTubeIframeAPIReady(); }, 10);
})();`;
/* the embed page also speaks the widget postMessage protocol, for a plain <iframe enablejsapi=1> */
const STUB_EMBED = `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#000;color:#555;font:12px monospace">stub embed<script>
  var q = new URLSearchParams(location.search), auto = q.get('autoplay') === '1', MODE = ${JSON.stringify(STUB_MODE)};
  function post(o) { o.id = 1; o.channel = 'widget'; parent.postMessage(JSON.stringify(o), '*'); }
  function state(s) { post({ event: 'onStateChange', info: s }); post({ event: 'infoDelivery', info: { playerState: s } }); }
  function start() { if (MODE === 'blocked') return; if (MODE === 'error') { post({ event: 'onError', info: 150 }); return; } setTimeout(function () { state(1); }, 200); }
  addEventListener('message', function (e) {
    var m; try { m = JSON.parse(e.data); } catch (x) { return; }
    if (m.event === 'listening') { post({ event: 'onReady', info: {} }); if (auto) start(); }
    if (m.event === 'command' && m.func === 'playVideo') start();
    if (m.event === 'command' && m.func === 'pauseVideo') state(2);
  });
</script>`;
async function stubRoutes(ctx) {
  if (!STUB) return;
  /* Playwright tries the most recently registered route first: the catch-all goes in first */
  await ctx.route(/youtube\.com|youtube-nocookie\.com|ytimg\.com|googlevideo\.com|doubleclick\.net/, r => r.abort());
  await ctx.route('https://www.youtube.com/iframe_api', r => r.fulfill({ status: 200, contentType: 'text/javascript', body: MOCK_API }));
  await ctx.route(/^https:\/\/www\.youtube(-nocookie)?\.com\/embed\//, r => r.fulfill({ status: 200, contentType: 'text/html', body: STUB_EMBED }));
}

/* ---------- what YouTube's own frame says (bot-check, "Video unavailable") and what its <video> is doing ---------- */
async function ytFrame(page) {
  for (const f of page.frames()) {
    if (!/^https:\/\/www\.youtube(-nocookie)?\.com\/embed\//.test(f.url())) continue;
    try {
      return await f.evaluate(() => {
        const v = document.querySelector('video');
        const err = document.querySelector('.ytp-error, .ytp-error-content');
        /* what the embed document may do: allow / allowfullscreen only count if they were on the iframe before it loaded
           (featurePolicy is Chromium only) */
        const fp = document.featurePolicy;
        return { text: (document.body && document.body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 240),
          error: err ? err.innerText.replace(/\s+/g, ' ').trim().slice(0, 200) : null,
          video: v ? { t: +v.currentTime.toFixed(2), paused: v.paused, muted: v.muted, volume: v.volume } : null,
          fullscreen: typeof document.fullscreenEnabled === 'boolean' ? document.fullscreenEnabled : null,
          autoplay: fp ? fp.allowsFeature('autoplay') : null };
      });
    } catch (e) { return { text: null, error: 'frame not readable: ' + short(e.message, 80), video: null }; }
  }
  return null;
}
const isBot = fr => !!(fr && BOT.test((fr.text || '') + ' ' + (fr.error || '')));

/* ======================================================================================================
   A · Embeddability
   ====================================================================================================== */
const PROBE_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>YouTube probe</title></head>
<body style="margin:0;background:#000"><div id="p"></div>
<script>
  /* CI only (tools/ci-player-check.mjs): one YT.Player, muted autoplay, records what YouTube reports */
  var id = new URLSearchParams(location.search).get('id'), t0 = Date.now();
  window.__probe = { id: id, ready: false, playing: false, states: [], error: null, api: 'loading' };
  window.onYouTubeIframeAPIReady = function () {
    __probe.api = 'ok';
    new YT.Player('p', {
      host: 'https://www.youtube-nocookie.com', videoId: id, width: 640, height: 360,
      playerVars: { autoplay: 1, mute: 1, playsinline: 1, rel: 0, origin: location.origin },
      events: {
        onReady: function (e) { __probe.ready = true; __probe.readyMs = Date.now() - t0; try { e.target.mute(); e.target.playVideo(); } catch (x) {} },
        onStateChange: function (e) { __probe.states.push(e.data); if (e.data === 1) { __probe.playing = true; __probe.playingMs = Date.now() - t0; } },
        onError: function (e) { __probe.error = e.data; }
      }
    });
  };
</script>
<script src="https://www.youtube.com/iframe_api" async onerror="__probe.api = 'failed'"></script>
</body></html>
`;
async function oembed(id) {
  if (STUB) return { status: 200, note: 'stub' };
  try {
    const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, { signal: AbortSignal.timeout(15000) });
    return { status: r.status };
  } catch (e) { return { status: null, note: short(e.message, 80) }; }
}
/* embeddable: false only on a definite refusal; true on a definite yes; null (inconclusive) otherwise */
function verdict(r) {
  if ([401, 403, 404].includes(r.oembed)) return false;
  if (r.botCheck) return null;
  if ([100, 101, 150].includes(r.error)) return false;
  if (r.oembed === 200 && (r.ready || r.reachedPlaying) && r.error !== 101 && r.error !== 150) return true;
  return null;
}
async function probe(browser, id) {
  const o = await oembed(id);
  const r = { id, oembed: o.status, oembedNote: o.note || null, ready: false, reachedPlaying: false, error: null, botCheck: false, api: null, states: [], frame: null };
  const ctx = await browser.newContext({ viewport: { width: 800, height: 450 } });
  await stubRoutes(ctx);
  const page = await ctx.newPage();
  try {
    const res = await page.goto(`${BASE}/${PROBE_FILE}?id=${encodeURIComponent(id)}`, { waitUntil: 'load', timeout: 30000 });
    if (!res || res.status() !== 200) throw new Error(`probe harness not served (HTTP ${res && res.status()}): DIST_DIR must be the directory BASE_URL serves`);
    try { await page.waitForFunction(() => window.__probe && (__probe.playing || __probe.error != null || __probe.api === 'failed'), null, { timeout: PROBE_MS, polling: 250 }); } catch (e) { /* timed out: report what it reached */ }
    const p = await page.evaluate(() => window.__probe);
    Object.assign(r, { ready: !!p.ready, reachedPlaying: !!p.playing, error: p.error, api: p.api, states: p.states, readyMs: p.readyMs || null, playingMs: p.playingMs || null });
    r.frame = await ytFrame(page);
    r.botCheck = isBot(r.frame);
    await page.screenshot({ path: path.join(OUT, 'shots', `probe-${id}.png`) });
  } catch (e) { r.note = short(e.message); console.error(`probe ${id}: ${r.note}`); }
  await ctx.close();
  r.embeddable = verdict(r);
  return r;
}
/* write embeddable + embedCheckedAt next to each other, only for values that changed */
async function writeBack(results) {
  const data = JSON.parse(await fs.readFile(YT_JSON, 'utf8'));
  const now = new Date().toISOString(), changed = [];
  for (const r of results) {
    const rec = data[r.id];
    if (!rec || r.embeddable === null || rec.embeddable === r.embeddable) continue;
    const next = {};
    for (const [k, v] of Object.entries(rec)) {
      if (k === 'embedCheckedAt') continue;
      next[k] = k === 'embeddable' ? r.embeddable : v;
      if (k === 'embeddable') next.embedCheckedAt = now;
    }
    if (!('embeddable' in rec)) { next.embeddable = r.embeddable; next.embedCheckedAt = now; }
    changed.push(`${r.id}: ${rec.embeddable} → ${r.embeddable}`);
    data[r.id] = next;
  }
  if (changed.length && WRITE) await fs.writeFile(YT_JSON, JSON.stringify(data, null, 2) + '\n');
  return changed;
}

/* ======================================================================================================
   B · Site check
   ====================================================================================================== */
const iphone = devices['iPhone 13'];
const PROFILES = [
  { id: 'chromium-desktop', engine: 'chromium', label: 'Chromium · desktop', ctx: { viewport: { width: 1440, height: 900 } }, touch: false },
  { id: 'webkit-iphone13', engine: 'webkit', label: 'WebKit · iPhone 13', ctx: { ...iphone }, touch: true }
];
/* records every data-yt-state the project player passes through */
const STATE_RECORDER = `(function () {
  window.__ytStates = [];
  var t0 = performance.now();
  function arm() {
    var el = document.getElementById('pj-yt'); if (!el) return;
    function rec() { var s = el.getAttribute('data-yt-state'), h = window.__ytStates; if (!h.length || h[h.length - 1].s !== s) h.push({ s: s, t: Math.round(performance.now() - t0) }); }
    rec(); new MutationObserver(rec).observe(el, { attributes: true, attributeFilter: ['data-yt-state'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm); else arm();
})();`;
/* runs in the page: every YouTube iframe, and what the first one looks like */
function framesInPage() {
  const ytHost = /(^|\.)youtube(-nocookie)?\.com$/;
  const list = Array.prototype.filter.call(document.querySelectorAll('iframe'), f => { try { return ytHost.test(new URL(f.src, location.href).hostname); } catch (e) { return false; } });
  const f = list[0];
  if (!f) return { count: 0, all: document.querySelectorAll('iframe').length };
  const u = new URL(f.src, location.href), r = f.getBoundingClientRect();
  const hitEl = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  const name = el => !el ? null : el === f ? 'iframe' : el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '');
  return { count: list.length, all: document.querySelectorAll('iframe').length, src: f.src, host: u.hostname, playsinline: u.searchParams.get('playsinline'),
    allowfullscreen: f.hasAttribute('allowfullscreen'), hit: name(hitEl), w: Math.round(r.width), h: Math.round(r.height) };
}

async function openPage(browser, prof, url, init) {
  const ctx = await browser.newContext(prof.ctx);
  await stubRoutes(ctx);
  const page = await ctx.newPage();
  const popups = [], navs = [], errors = [];
  ctx.on('page', p => popups.push(p.url() || 'about:blank'));
  page.on('pageerror', e => errors.push(short(e.message, 120)));
  page.on('framenavigated', f => { if (f === page.mainFrame()) navs.push(f.url()); });
  if (init) await page.addInitScript(init);
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  navs.length = 0;
  return { ctx, page, popups, navs, errors };
}

async function checkProject(browser, prof, p) {
  const url = `${BASE}/work/${p.slug}/`;
  const r = { kind: 'project', page: `/work/${p.slug}/`, id: p.media.id, browser: prof.label, status: 'FAIL', state: null, detail: '', fails: [] };
  let o;
  try {
    o = await openPage(browser, prof, url, STATE_RECORDER);
    const { page } = o;
    const yt = page.locator('#pj-yt');
    if (!(await yt.count())) throw new Error('no #pj-yt on the page');
    await yt.scrollIntoViewIfNeeded();
    await sleep(500);
    const before = { url: page.url(), frames: (await page.evaluate(framesInPage)).count };
    r.framesBeforeTap = before.frames;
    const box = await yt.boundingBox();
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    r.tapTarget = await page.evaluate(([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '') : null; }, [x, y]);
    if (prof.touch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);

    /* wait for a settled state: playing or error; otherwise report what it reached */
    const t0 = Date.now();
    let st = null;
    while (Date.now() - t0 < PAGE_MS) {
      if (page.url() !== before.url || o.navs.length) break;
      try { st = await page.evaluate(() => { const e = document.getElementById('pj-yt'); return e ? e.getAttribute('data-yt-state') : '#missing'; }); } catch (e) { break; }
      if (st === 'playing' || st === 'error') break;
      await sleep(250);
    }
    if (st === 'playing') await sleep(1500);   // still playing a moment later, nothing laid over it
    r.ms = Date.now() - t0;

    if (page.url() !== before.url || o.navs.length) r.fails.push('navigated away → ' + short(o.navs[o.navs.length - 1] || page.url(), 90));
    if (o.popups.length) r.fails.push('popup opened → ' + short(o.popups[0], 90));
    if (!r.fails.length) {
      const info = await page.evaluate(() => {
        const yt = document.getElementById('pj-yt');
        const vis = el => !!el && !el.hidden && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && +getComputedStyle(el).opacity > 0;
        const out = yt && yt.querySelector('.pj-yt-out');
        const img = yt && yt.querySelector('img');
        return { state: yt ? yt.getAttribute('data-yt-state') : null, history: (window.__ytStates || []).map(h => h.s + '@' + h.t).join(' → '),
          inside: Array.prototype.some.call(yt ? yt.querySelectorAll('iframe') : [], f => /youtube/.test(f.src)),
          fallback: vis(out), fallbackHref: out ? out.href : null, poster: vis(img),
          /* elementFromPoint does not see pointer-events:none layers: the site-wide grain is read on its own */
          grain: document.querySelector('.grain-layer') ? getComputedStyle(document.querySelector('.grain-layer')).visibility : null };
      });
      const fr = await page.evaluate(framesInPage);
      const ytf = await ytFrame(page);
      Object.assign(r, { state: info.state, history: info.history, frames: fr, ytFrame: ytf, botCheck: isBot(ytf) });
      const st2 = info.state;
      if (st2 == null) r.fails.push('#pj-yt has no data-yt-state');
      if (fr.count > 1) r.fails.push(`${fr.count} YouTube iframes on the page (expected 1)`);
      if (st2 === 'error') {
        if (!info.fallback) r.fails.push('error state without the poster fallback (.pj-yt-out not visible)');
        if (!r.fails.length) { r.status = 'WARN'; r.detail = 'error → clean poster fallback (' + short(info.fallbackHref, 60) + ')' + (r.botCheck ? ' · YouTube bot-check' : ''); }
      } else if (st2 != null) {
        if (fr.count === 0) r.fails.push('no YouTube iframe after tapping the poster centre (tap hit ' + r.tapTarget + ')');
        else {
          if (fr.host !== 'www.youtube-nocookie.com') r.fails.push('iframe host ' + fr.host + ' (expected www.youtube-nocookie.com)');
          if (fr.playsinline !== '1') r.fails.push('iframe src without playsinline=1');
          /* read inside the player, not from the attributes; Chromium only (WebKit's iPhone profile is not a reliable
             fullscreen probe) */
          if (prof.engine === 'chromium' && ytf && ytf.fullscreen === false) r.fails.push('fullscreen is not allowed inside the player (document.fullscreenEnabled false)');
          if (prof.engine === 'chromium' && ytf && ytf.autoplay === false) r.fails.push('autoplay is not allowed inside the player');
          if (!info.inside) r.fails.push('iframe is not inside #pj-yt');
          if (st2 === 'playing' && fr.hit !== 'iframe') r.fails.push('something sits over the playing player: ' + fr.hit);
          if (fr.hit === 'iframe' && info.grain === 'visible') r.fails.push(`the site-wide grain is drawn over the player while ${st2}`);
          /* refused autoplay: YouTube's own play button must be reachable, not left under the poster */
          if ((st2 === 'ready' || st2 === 'paused') && fr.hit !== 'iframe') r.fails.push(`player covered while ${st2}: ${fr.hit}`);
        }
        if (!r.fails.length) {
          if (st2 === 'playing') { r.status = 'PASS'; r.detail = 'playing'; }
          else if ((st2 === 'ready' || st2 === 'paused') && prof.engine === 'webkit') { r.status = 'PASS'; r.detail = st2 + ' (WebKit refused autoplay with sound; YouTube’s own play button is live)'; }
          else { r.status = 'WARN'; r.detail = `${st2} after ${Math.round(PAGE_MS / 1000)} s` + (r.botCheck ? ' · YouTube bot-check' : ytf && ytf.error ? ' · YouTube: ' + ytf.error : ' · inconclusive (YouTube slow or unreachable?)'); }
        }
      }
    }
    if (r.fails.length) { r.status = 'FAIL'; r.detail = r.fails.join('; '); }
    if (o.errors.length) r.pageErrors = o.errors;
    try { await page.screenshot({ path: path.join(OUT, 'shots', `work-${p.slug}-${prof.id}.png`) }); } catch (e) {}
  } catch (e) { r.status = 'FAIL'; r.detail = short(e.message); r.fails.push(r.detail); }
  if (o) await o.ctx.close();
  return r;
}

async function checkHome(browser, prof) {
  const r = { kind: 'home', page: '/', browser: prof.label, status: 'FAIL', state: null, detail: '', fails: [] };
  let o;
  try {
    /* a second visit in the session plays the shortened entrance (core.js JP.sequence key c01) */
    o = await openPage(browser, prof, BASE + '/', `try { sessionStorage.setItem('jp-seen-c01', '1'); } catch (e) {}`);
    const { page } = o;
    try { await page.waitForFunction(() => document.documentElement.classList.contains('is-opened'), null, { timeout: 13000 }); } catch (e) { /* the entrance has its own hard guard */ }
    if (!(await page.locator('#featured').count())) throw new Error('no #featured reel on the home page');
    await page.evaluate(() => { const s = document.getElementById('featured'); window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - 60); });
    const snap = () => page.evaluate(() => {
      const R = window.JPSM_REEL, sec = document.getElementById('featured');
      const vis = el => !!el && !el.hidden && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
      let pm = null; try { const P = R && R.player(); pm = P && P.isMuted ? P.isMuted() : null; } catch (e) {}
      return { engine: R ? R.engine() : null, playing: !!(R && R.state.playing), muted: R ? R.state.muted : null, playerMuted: pm,
        gate: vis(document.getElementById('rl-gate')), err: vis(document.getElementById('rl-err')), offline: sec.classList.contains('is-offline'),
        cls: sec.className, mode: sec.getAttribute('data-mode'), i: R ? R.state.i : null };
    });
    const t0 = Date.now();
    let s = null, fr = null;
    while (Date.now() - t0 < HOME_MS) {
      s = await snap(); fr = await page.evaluate(framesInPage);
      if (s.offline || ((fr.count >= 1) && ((s.engine === 'youtube' && s.playing) || s.gate || s.err))) break;
      await sleep(250);
    }
    if (s.playing) { await sleep(1500); s = await snap(); fr = await page.evaluate(framesInPage); }
    r.ms = Date.now() - t0;
    const ytf = await ytFrame(page);
    Object.assign(r, { reel: s, frames: fr, ytFrame: ytf, botCheck: isBot(ytf) });
    r.state = s.playing ? (s.muted ? 'playing muted' : 'playing WITH SOUND') : s.offline ? 'offline' : s.gate ? 'Play gate' : s.err ? 'film error' : 'empty';
    if (o.navs.length) r.fails.push('navigated away → ' + short(o.navs[0], 90));
    if (o.popups.length) r.fails.push('popup opened → ' + short(o.popups[0], 90));
    if (fr.count > 1) r.fails.push(`${fr.count} YouTube iframes on the page (expected 1)`);
    if (fr.count >= 1 && fr.playsinline !== '1') r.fails.push('reel iframe src without playsinline=1');
    if (prof.engine === 'chromium' && ytf && ytf.autoplay === false) r.fails.push('autoplay is not allowed inside the reel player');
    if (s.playing && (!s.muted || s.playerMuted === false)) r.fails.push('the reel autoplays with sound');
    if (!r.fails.length) {
      if (s.offline) { r.status = 'WARN'; r.detail = 'IFrame API unreachable → poster + Watch on YouTube'; }
      else if (fr.count === 0) r.fails.push(`no YouTube iframe within ${HOME_MS / 1000} s (engine ${s.engine})`);
      else if (s.playing) { r.status = 'PASS'; r.detail = `muted playback, film ${s.i + 1}`; }
      else if (s.gate) { r.status = 'PASS'; r.detail = 'autoplay blocked → Play gate visible'; }
      else if (s.err) { r.status = 'WARN'; r.detail = 'film error → Watch on YouTube fallback' + (r.botCheck ? ' · YouTube bot-check' : ''); }
      else if (r.botCheck) { r.status = 'WARN'; r.detail = 'YouTube bot-check; no state'; }
      else r.fails.push('empty state: not playing, no Play gate, no fallback');
    }
    if (r.fails.length) { r.status = 'FAIL'; r.detail = r.fails.join('; '); }
    if (o.errors.length) r.pageErrors = o.errors;
    try { await page.screenshot({ path: path.join(OUT, 'shots', `home-${prof.id}.png`) }); } catch (e) {}
  } catch (e) { r.status = 'FAIL'; r.detail = short(e.message); r.fails.push(r.detail); }
  if (o) await o.ctx.close();
  return r;
}

/* ======================================================================================================
   run
   ====================================================================================================== */
const report = { base: BASE, stub: STUB ? STUB_MODE : false, startedAt: new Date().toISOString(), embeds: [], changed: [], site: [] };
const meta = JSON.parse(await fs.readFile(YT_JSON, 'utf8'));
const titleOf = id => (meta[id] && meta[id].title) || (ytFilms.find(p => p.media.id === id) || {}).title || id;

if (env.SKIP_A !== '1') {
  const probePath = path.join(DIST, PROBE_FILE);
  await fs.writeFile(probePath, PROBE_HTML);
  const b = await launchChromium(['--autoplay-policy=no-user-gesture-required']);
  try {
    for (const id of Object.keys(meta)) {
      const r = await probe(b, id);
      report.embeds.push(r);
      console.log(`probe ${id}  oembed=${r.oembed} ready=${r.ready} playing=${r.reachedPlaying} error=${r.error} bot=${r.botCheck} → embeddable=${r.embeddable}`);
    }
  } finally { await b.close(); await fs.rm(probePath, { force: true }); }
  report.changed = await writeBack(report.embeds);
}

if (env.SKIP_B !== '1') {
  for (const prof of PROFILES) {
    let b = null, label = prof.label, run = prof;
    try { b = prof.engine === 'webkit' ? await webkit.launch() : await launchChromium(); }
    catch (e) {
      if (STUB && prof.engine === 'webkit') {
        /* local dry run without WebKit: the iPhone 13 profile in Chromium, to exercise the mobile layout and touch path */
        const { defaultBrowserType, ...ctx } = prof.ctx; void defaultBrowserType;
        run = { ...prof, engine: 'chromium', label: 'Chromium · iPhone 13 emulation (WebKit not installed)', ctx };
        b = await launchChromium();
      } else {
        report.site.push({ kind: 'browser', page: '—', browser: label, status: 'WARN', detail: 'browser unavailable: ' + short(e.message, 100), fails: [] });
        continue;
      }
    }
    try {
      for (const p of ytFilms) {
        if (ONLY && !ONLY.includes(p.slug)) continue;
        const r = await checkProject(b, run, p);
        report.site.push(r);
        console.log(`${r.status.padEnd(4)} ${r.page}  [${r.browser}]  ${r.detail}${r.history ? '  (' + r.history + ')' : ''}`);
      }
      if (!ONLY || ONLY.includes('home')) {
        const r = await checkHome(b, run);
        report.site.push(r);
        console.log(`${r.status.padEnd(4)} /  [${r.browser}]  ${r.state}: ${r.detail}`);
      }
    } finally { await b.close(); }
  }
}

/* ======================================================================================================
   C · report
   ====================================================================================================== */
const cell = s => String(s == null ? '—' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const md = [];
md.push(`## JP Silva Media · YouTube player check${STUB ? ` (STUB_YT=${STUB_MODE}, local dry run)` : ''}`, '');
if (report.embeds.length) {
  md.push('### A · Embeddability (real YouTube, headless Chromium, muted autoplay)', '',
    '| Film | id | oEmbed | ready | playing | onError | YouTube says | embeddable |', '|---|---|---|---|---|---|---|---|');
  for (const r of report.embeds) {
    const says = r.botCheck ? 'bot-check' : r.frame && r.frame.error ? short(r.frame.error, 60) : r.api === 'failed' ? 'iframe_api failed to load' : '';
    md.push(`| ${cell(titleOf(r.id))} | \`${r.id}\` | ${cell(r.oembed)} | ${r.ready ? 'yes' : 'no'} | ${r.reachedPlaying ? 'yes' : 'no'} | ${cell(r.error)} | ${cell(says)} | **${r.embeddable === null ? 'null (inconclusive)' : r.embeddable}** |`);
  }
  md.push('', report.changed.length ? `youtube.json ${WRITE ? 'updated' : 'would change (not written)'}: ${report.changed.join(' · ')}` : 'youtube.json unchanged (no embeddable value changed, or results inconclusive).', '');
}
if (report.site.length) {
  md.push('### B · Site (web build, tap the poster centre / home reel)', '', '| Page | Browser | Result | State | Detail |', '|---|---|---|---|---|');
  for (const r of report.site) md.push(`| ${cell(r.page)} | ${cell(r.browser)} | **${r.status}** | ${cell(r.state)} | ${cell(r.detail)} |`);
  md.push('');
}
const failed = report.site.filter(r => r.status === 'FAIL');
const warned = report.site.filter(r => r.status === 'WARN').length + report.embeds.filter(r => r.embeddable === null).length;
md.push(failed.length ? `**${failed.length} site failure(s).**` : `**No site failures.**${warned ? ` ${warned} warning(s) (YouTube-side or inconclusive; not failures).` : ''}`, '');
const text = md.join('\n');
console.log('\n' + text);
if (env.GITHUB_STEP_SUMMARY) await fs.appendFile(env.GITHUB_STEP_SUMMARY, text + '\n');
report.finishedAt = new Date().toISOString();
await fs.writeFile(path.join(OUT, 'results.json'), JSON.stringify(report, null, 2) + '\n');
process.exit(failed.length ? 1 : 0);
