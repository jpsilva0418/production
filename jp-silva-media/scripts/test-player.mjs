#!/usr/bin/env node
/* Project page YouTube player — behaviour tests (Playwright + a STUB YouTube IFrame API; YouTube is never reached).
     node scripts/test-player.mjs [--web=http://127.0.0.1:8788] [--preview=http://127.0.0.1:8791] [--pw=<module>]
   Build both targets first (node build.mjs && node build.mjs --target=preview). Without --web / --preview this script
   serves dist/ and .preview/ itself (scripts/serve.mjs on free ports). --pw: a module exporting launch() for Chromium
   (e.g. a CA-aware launcher); otherwise Playwright is imported as in test-reel.mjs.
   Covers: the whole poster is the tap target (iPhone-size touch and desktop click on the poster centre), exactly one
   nocookie player iframe (playsinline=1, fs=1; inside it, fullscreen, autoplay and encrypted-media are allowed), no
   navigation or popup, #pj-yt[data-yt-state] transitions, sound never muted, nothing over the playing player (the
   site-wide grain included), one audible source, onError 150 / iframe_api blocked / iframe_api timeout / player never
   ready → poster + "Watch on YouTube ↗" with no iframe left, blocked autoplay → YouTube's own play button uncovered,
   no horizontal overflow at 320–430 px, embeddable:false at build time (project page + home reel), the preview build
   (external link, no iframe_api) and the home reel (playsinline, autoplay allowed inside its iframe, a film picked
   while the player loads, a refused film never uncovered by Play, a player that never gets ready → posters + "Watch on
   YouTube"). Exit 1 on any failure. */
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { site } from '../src/data/site.mjs';
import { projects, categories, sorted } from '../src/data/projects.mjs';
import { renderProject } from '../src/templates/project.mjs';
import { reelSection } from '../src/templates/reel.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
let launch;
if (arg('pw', '')) ({ launch } = await import(pathToFileURL(path.resolve(arg('pw', ''))).href));
else {
  let chromium;
  try { ({ chromium } = await import('playwright')); } catch (e) {
    try { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); } catch (e2) { console.error('Playwright is required'); process.exit(1); }
  }
  launch = o => chromium.launch(o);
}

/* ---------- servers: the ones given, or our own over dist/ and .preview/ ---------- */
const kids = [];
const freePort = () => new Promise(res => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });
async function serve(dir) {
  if (!fs.existsSync(path.join(ROOT, dir, 'index.html'))) { console.error(`${dir}/ is not built (node build.mjs${dir === '.preview' ? ' --target=preview' : ''})`); process.exit(1); }
  const port = await freePort(), url = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, [path.join(ROOT, 'scripts/serve.mjs'), `--dir=${dir}`, `--port=${port}`], { stdio: 'ignore' });
  kids.push(child);
  for (let i = 0; i < 60; i++) { try { if ((await fetch(url + '/')).ok) return url; } catch (e) { /* not up yet */ } await new Promise(r => setTimeout(r, 100)); }
  throw new Error('server did not start for ' + dir);
}
const WEB = (arg('web', '') || await serve('dist')).replace(/\/$/, '');
const PREVIEW = (arg('preview', '') || await serve('.preview')).replace(/\/$/, '');
const SLUG = 'ready', VID = 'uM2j8bYrv68', TITLE = 'R-Dee — READY';
const PAGE = `${WEB}/work/${SLUG}`;

/* ---------- the stub IFrame API (served for https://www.youtube.com/iframe_api) ----------
   Like the real API it writes an iframe in place of the element, src = host + /embed/ + id + playerVars, with the real
   API's allow list and allowfullscreen set before it is inserted (only then do they count). The tests read what the
   embed document is actually allowed to do (embedPerms), not the attributes.
   window.__yt (set before the page runs): errorFor (onError code after playVideo), blocked (autoplay refused),
   noReady (onReady never fires), readyMs (onReady delay). */
const STUB = `(function(){
  var cfg = window.__yt = window.__yt || {};
  cfg.players = 0; cfg.calls = []; cfg.loads = [];
  var S = { UNSTARTED:-1, ENDED:0, PLAYING:1, PAUSED:2, BUFFERING:3, CUED:5 };
  function Player(el, o) {
    o = o || {}; cfg.players++;
    var self = this, ev = o.events || {}, pv = o.playerVars || {}, st = -1, muted = pv.mute == 1, vid = o.videoId, q = [], t = 0, tok = 0;
    cfg.opts = { host: o.host, videoId: o.videoId, vars: pv, width: o.width, height: o.height }; cfg.loads.push(vid);
    var host = typeof el === 'string' ? document.getElementById(el) : el;
    for (var k in pv) q.push(encodeURIComponent(k) + '=' + encodeURIComponent(pv[k]));
    q.push('enablejsapi=1', 'widgetid=' + cfg.players);
    var f = document.createElement('iframe');
    f.id = host.id; f.setAttribute('frameborder', '0'); f.setAttribute('title', 'YouTube video player'); f.setAttribute('allowfullscreen', '');
    f.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    f.setAttribute('width', o.width || 640); f.setAttribute('height', o.height || 360);
    f.src = (o.host || 'https://www.youtube.com') + '/embed/' + encodeURIComponent(vid || '') + '?' + q.join('&');
    host.parentNode.replaceChild(f, host);
    function fire(s) { st = s; cfg.calls.push('state:' + s); ev.onStateChange && ev.onStateChange({ data: s, target: self }); }
    function start() {
      if (cfg.errorFor) { setTimeout(function(){ cfg.calls.push('error:' + cfg.errorFor); ev.onError && ev.onError({ data: cfg.errorFor, target: self }); }, 60); return; }
      if (cfg.blocked) return;
      var k = ++tok;
      setTimeout(function(){ if (k === tok) fire(S.BUFFERING); }, 40);
      setTimeout(function(){ if (k === tok) fire(S.PLAYING); }, 120);
    }
    this.playVideo = function(){ cfg.calls.push('play'); if (st !== S.PLAYING) start(); };
    this.pauseVideo = function(){ cfg.calls.push('pause'); tok++; if (st === S.PLAYING || st === S.BUFFERING) fire(S.PAUSED); };
    this.loadVideoById = function(a){ vid = typeof a === 'object' ? a.videoId : a; cfg.loads.push(vid); cfg.calls.push('load:' + vid); fire(S.UNSTARTED); start(); };
    this.mute = function(){ cfg.calls.push('mute'); muted = true; };
    this.unMute = function(){ cfg.calls.push('unmute'); muted = false; };
    this.isMuted = function(){ return muted; };
    this.getDuration = function(){ return 200; }; this.getCurrentTime = function(){ return t; }; this.seekTo = function(x){ t = x; };
    this.getIframe = function(){ return f; };
    this.destroy = function(){ cfg.calls.push('destroy'); tok++; if (f.parentNode) f.parentNode.replaceChild(host, f); };   /* the real API puts the element back */
    this.__tap = function(){ cfg.blocked = false; start(); };   /* a tap on YouTube's own play button */
    this.__end = function(){ fire(S.ENDED); };
    cfg.player = this;
    if (!cfg.noReady) setTimeout(function(){ ev.onReady && ev.onReady({ target: self }); }, cfg.readyMs || 80);
  }
  window.YT = { Player: Player, PlayerState: S, loaded: 1 };
  setTimeout(function(){ window.onYouTubeIframeAPIReady && window.onYouTubeIframeAPIReady(); }, 10);
})();`;
const HANG = 'window.YT = { loading: 1 }; /* iframe_api arrived, the widget API never does */';
const EMBED = '<!doctype html><meta charset="utf-8"><body style="margin:0;background:#000">';
const IGNORE = /Failed to load resource|ERR_TUNNEL|net::ERR_/;   // blocked hosts (fonts, YouTube) in the sandbox

const results = [];
const ok = (name, pass, detail = '') => { results.push({ name, pass: !!pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail && !pass ? '  — ' + detail : ''}`); };
const browser = await launch({});
const IPHONE = { vp: { width: 390, height: 844 }, mobile: true, label: 'iPhone 390' };
const DESKTOP = { vp: { width: 1440, height: 900 }, mobile: false, label: 'desktop 1440' };

async function open({ url = PAGE, dev = DESKTOP, cfg = {}, test = {}, reel = null, api = 'stub', html = null } = {}) {
  const ctx = await browser.newContext({ viewport: dev.vp, isMobile: dev.mobile, hasTouch: dev.mobile, deviceScaleFactor: dev.mobile ? 2 : 1 });
  const page = await ctx.newPage();
  const o = { ctx, page, errors: [], popups: [], navs: [], apiHits: [], embeds: [], requests: [] };
  ctx.on('page', p => o.popups.push(p));
  ctx.on('request', r => o.requests.push(r.url()));
  page.on('pageerror', e => o.errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !IGNORE.test(m.text())) o.errors.push(m.text()); });
  page.on('framenavigated', f => { if (f === page.mainFrame()) o.navs.push(f.url()); });
  /* one handler for every YouTube host: the API (stub / blocked / never ready), the embed page, everything else blocked */
  await ctx.route(/youtube\.com|youtube-nocookie\.com|ytimg\.com|googlevideo\.com|doubleclick\.net/, r => {
    const u = r.request().url();
    if (u === 'https://www.youtube.com/iframe_api') {
      o.apiHits.push(u);
      return api === 'fail' ? r.abort() : r.fulfill({ status: 200, contentType: 'text/javascript', body: api === 'hang' ? HANG : STUB });
    }
    if (/^https:\/\/www\.youtube(-nocookie)?\.com\/embed\//.test(u)) { o.embeds.push(u); return r.fulfill({ status: 200, contentType: 'text/html', body: EMBED }); }
    return r.abort();
  });
  if (html) await page.route(url, r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await page.addInitScript(([c, t, rt]) => {
    window.__yt = c; window.JPSM_PLAYER_TEST = t; window.__states = [];
    if (rt) window.JPSM_REEL_TEST = rt;
    try { sessionStorage.setItem('c01', '1'); } catch (e) {}
    document.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById('pj-yt'); if (!el) return;
      const rec = () => { const s = el.getAttribute('data-yt-state'); if (s && window.__states[window.__states.length - 1] !== s) window.__states.push(s); };
      rec(); new MutationObserver(rec).observe(el, { attributes: true, attributeFilter: ['data-yt-state'] });
    });
    /* was the player created inside the tap itself? (counted right after the click has been dispatched) */
    document.addEventListener('click', () => setTimeout(() => { if (window.__afterClick == null) window.__afterClick = window.__yt && window.__yt.players || 0; }, 0), true);
  }, [cfg, { apiMs: 1500, readyMs: 3000, revealMs: 800, ...test }, reel]);
  await page.goto(url, { waitUntil: 'load' });
  if (await page.locator('#pj-yt').count()) await page.locator('#pj-yt').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  o.navs.length = 0;
  o.url = page.url();
  return o;
}
async function until(page, fn, a, ms = 5000) { try { await page.waitForFunction(fn, a, { timeout: ms }); return true; } catch (e) { return false; } }
const stateIs = (page, s, ms) => until(page, x => { const e = document.getElementById('pj-yt'); return e && e.getAttribute('data-yt-state') === x; }, s, ms);
async function centre(page) {
  const b = await page.locator('#pj-yt').boundingBox();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}
async function tapCentre(o, dev) {
  const { x, y } = await centre(o.page);
  if (dev.mobile) await o.page.touchscreen.tap(x, y); else await o.page.mouse.click(x, y);
}
/* everything about the frame, from inside the page */
const snap = page => page.evaluate(() => {
  const yt = document.getElementById('pj-yt'), r = yt.getBoundingClientRect();
  const f = yt.querySelector('iframe'), fr = f && f.getBoundingClientRect();
  const hitEl = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  const vis = el => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && +getComputedStyle(el).opacity > 0;
  const name = el => !el ? null : el === f ? 'IFRAME' : el.tagName + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '');
  const out = yt.querySelector('.pj-yt-out'), msg = yt.querySelector('.pj-yt-msg'), ctl = yt.querySelector('[data-yt]');
  const u = f ? new URL(f.src) : null;
  const focusables = yt.querySelectorAll('a[href],button,input,select,textarea,iframe,[tabindex]:not([tabindex="-1"])').length;
  const box = ctl ? ctl.getBoundingClientRect() : null, cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  return {
    state: yt.getAttribute('data-yt-state'), states: (window.__states || []).join(','),
    iframes: document.querySelectorAll('iframe').length, inYt: yt.querySelectorAll('iframe').length,
    host: u && u.hostname, q: u ? Object.fromEntries(u.searchParams) : null, allow: f ? f.getAttribute('allow') : null,
    afs: f ? f.hasAttribute('allowfullscreen') : null, ftitle: f ? f.title : null,
    fit: fr ? [fr.left - r.left, fr.top - r.top, fr.width - r.width, fr.height - r.height].every(v => Math.abs(v) < 1) : null,
    ratio: +(r.width / r.height).toFixed(3), hit: name(hitEl), hitIsCtl: !!ctl && hitEl === ctl,
    centreInBox: box ? cx >= box.left && cx <= box.right && cy >= box.top && cy <= box.bottom : null,
    poster: vis(yt.querySelector('img')), grade: !!yt.querySelector('.frame-grade'), ctl: !!ctl, focusables,
    ctlRole: ctl && ctl.getAttribute('role'), ctlLabel: ctl && ctl.getAttribute('aria-label'), ctlNote: !!(ctl && ctl.querySelector('.vh')),
    out: out ? { vis: vis(out), href: out.href, target: out.target, rel: out.rel, role: out.getAttribute('role'), label: out.getAttribute('aria-label'),
      text: out.textContent, full: out.classList.contains('pj-play--full'), desc: out.getAttribute('aria-describedby'), rect: out.getBoundingClientRect().toJSON() } : null,
    msg: msg ? { vis: vis(msg), text: msg.textContent, rect: msg.getBoundingClientRect().toJSON() } : null,
    frame: r.toJSON(), hostEl: !!document.getElementById('pj-yt-player') && document.getElementById('pj-yt-player').tagName,
    /* elementFromPoint does not see pointer-events:none layers: the site-wide grain is read on its own */
    grain: document.querySelector('.grain-layer') ? getComputedStyle(document.querySelector('.grain-layer')).visibility : null,
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    players: window.__yt && window.__yt.players || 0, calls: window.__yt && window.__yt.calls ? window.__yt.calls.join(',') : '',
    opts: window.__yt && window.__yt.opts || null, afterClick: window.__afterClick, active: document.activeElement && document.activeElement.tagName
  };
});
/* what the embed document itself may do (allow / allowfullscreen only count if they were there before it loaded) */
async function embedPerms(page) {
  const f = page.frames().find(x => /^https:\/\/www\.youtube(-nocookie)?\.com\/embed\//.test(x.url()));
  if (!f) return null;
  return f.evaluate(() => {
    const fp = document.featurePolicy, has = k => fp ? fp.allowsFeature(k) : null;
    return { fullscreenEnabled: document.fullscreenEnabled, fullscreen: has('fullscreen'), autoplay: has('autoplay'), em: has('encrypted-media'), pip: has('picture-in-picture') };
  });
}
const inside = (a, b) => a.left >= b.left - 0.5 && a.top >= b.top - 0.5 && a.right <= b.right + 0.5 && a.bottom <= b.bottom + 0.5;
const apart = (a, b) => a.bottom <= b.top || b.bottom <= a.top || a.right <= b.left || b.right <= a.left;
/* the clean fallback: poster, note, the link to YouTube; no iframe, no player element, no popup, no navigation */
function fallbackOk(s, o) {
  const bad = [];
  if (s.state !== 'error') bad.push('state ' + s.state);
  if (s.iframes !== 0) bad.push(s.iframes + ' iframe(s) left');
  if (s.hostEl) bad.push('player element left');
  if (!s.poster || !s.grade) bad.push('poster/grade missing');
  if (!s.msg || !s.msg.vis || s.msg.text !== 'This film plays on YouTube') bad.push('note ' + JSON.stringify(s.msg));
  if (!s.out || !s.out.vis || s.out.href !== `https://www.youtube.com/watch?v=${VID}` || s.out.target !== '_blank' || s.out.role || s.out.label || s.out.full
    || !/Watch on YouTube/.test(s.out.text) || !/opens YouTube in a new tab/.test(s.out.text) || s.out.desc !== 'pj-yt-msg') bad.push('link ' + JSON.stringify(s.out));
  if (s.out && s.msg && (!inside(s.out.rect, s.frame) || !inside(s.msg.rect, s.frame) || !apart(s.out.rect, s.msg.rect))) bad.push('note/link outside the frame or overlapping');
  if (s.ctl) bad.push('[data-yt] control still armed');
  if (s.focusables !== 1) bad.push(s.focusables + ' focusables');
  if (o.popups.length || o.navs.length) bad.push('popup/navigation');
  if (s.overflow) bad.push('horizontal overflow');
  if (s.grain !== 'visible') bad.push('grain ' + s.grain);
  return bad;
}

try {
  /* 1 · tap the poster centre → one inline nocookie player with sound (iPhone-size touch, desktop click) */
  for (const dev of [IPHONE, DESKTOP]) {
    const o = await open({ dev });
    const { page } = o;
    const s0 = await snap(page);
    const btn = await page.getByRole('button', { name: `Play ${TITLE}`, exact: true }).count();
    ok(`${dev.label}: one control, a button named "Play ${TITLE}" (no "opens YouTube" note), no state yet`,
      btn === 1 && s0.focusables === 1 && s0.ctlRole === 'button' && s0.ctlLabel === `Play ${TITLE}` && !s0.ctlNote && s0.state === null, JSON.stringify(s0));
    ok(`${dev.label}: the poster centre is the control's hit area, away from the visible corner control`, s0.hitIsCtl && s0.centreInBox === false, s0.hit);
    ok(`${dev.label}: iframe_api warmed after load, before any tap; no player yet`, o.apiHits.length === 1 && s0.players === 0 && s0.iframes === 0, `api=${o.apiHits.length} players=${s0.players}`);
    await tapCentre(o, dev);
    const playing = await stateIs(page, 'playing', 4000);
    const s = await snap(page);
    ok(`${dev.label}: tap → data-yt-state loading → ready → playing`, playing && s.states === 'loading,ready,playing', s.states);
    ok(`${dev.label}: the player is created inside the tap (API already warm)`, s.afterClick === 1, 'players right after the click: ' + s.afterClick);
    ok(`${dev.label}: exactly one player iframe, inside #pj-yt, from www.youtube-nocookie.com`, s.players === 1 && s.iframes === 1 && s.inYt === 1 && s.host === 'www.youtube-nocookie.com' && o.embeds.length === 1 && /^https:\/\/www\.youtube-nocookie\.com\/embed\//.test(o.embeds[0]), JSON.stringify({ players: s.players, iframes: s.iframes, host: s.host, embeds: o.embeds }));
    const q = s.q || {};
    ok(`${dev.label}: src has playsinline=1 fs=1 autoplay=1 controls=1 rel=0 modestbranding=1 iv_load_policy=3 origin, for ${VID}`,
      q.playsinline === '1' && q.fs === '1' && q.autoplay === '1' && q.controls === '1' && q.rel === '0' && q.modestbranding === '1' && q.iv_load_policy === '3' && q.origin === new URL(WEB).origin && s.opts.videoId === VID && s.opts.host === 'https://www.youtube-nocookie.com' && !('mute' in q), JSON.stringify(q));
    const pm = await embedPerms(page);
    ok(`${dev.label}: inside the player, fullscreen, autoplay, encrypted-media and picture-in-picture are allowed; the frame is named for the film`,
      !!pm && pm.fullscreenEnabled === true && pm.fullscreen && pm.autoplay && pm.em && pm.pip && /READY/.test(s.ftitle), JSON.stringify({ pm, title: s.ftitle }));
    ok(`${dev.label}: sound — playVideo() + unMute(), never mute()`, /(^|,)unmute(,|$)/.test(s.calls) && /(^|,)play(,|$)/.test(s.calls) && !/(^|,)mute(,|$)/.test(s.calls), s.calls);
    ok(`${dev.label}: no navigation, no popup`, !o.popups.length && !o.navs.length && page.url() === o.url, JSON.stringify({ popups: o.popups.length, navs: o.navs }));
    ok(`${dev.label}: nothing over the playing player (centre hit = iframe; poster, grade, control gone)`, s.hit === 'IFRAME' && !s.poster && !s.grade && !s.ctl, JSON.stringify({ hit: s.hit, poster: s.poster, grade: s.grade, ctl: s.ctl }));
    ok(`${dev.label}: the site-wide grain is drawn before the tap and steps out while the player is up`, s0.grain === 'visible' && s.grain === 'hidden', JSON.stringify({ before: s0.grain, playing: s.grain }));
    ok(`${dev.label}: the player fills the 16:9 frame exactly, no horizontal overflow`, s.fit && Math.abs(s.ratio - 1.778) < 0.01 && !s.overflow, JSON.stringify({ fit: s.fit, ratio: s.ratio, overflow: s.overflow }));
    await page.waitForTimeout(400);
    const tw = await snap(page);
    ok(`${dev.label}: still exactly one player a moment later`, tw.players === 1 && tw.iframes === 1 && tw.state === 'playing', JSON.stringify({ players: tw.players, iframes: tw.iframes, state: tw.state }));
    if (!dev.mobile) {
      /* one audible source; page hidden; ended */
      await page.evaluate(() => window.dispatchEvent(new CustomEvent('jpsm:sound', { detail: { owner: 'reel' } })));
      const p1 = await stateIs(page, 'paused', 1500);
      await page.evaluate(() => __yt.player.playVideo());
      await stateIs(page, 'playing', 1500);
      await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
      const p2 = await stateIs(page, 'paused', 1500);
      await page.evaluate(() => { delete document.hidden; __yt.player.playVideo(); });
      await stateIs(page, 'playing', 1500);
      await page.evaluate(() => __yt.player.__end());
      const p3 = await stateIs(page, 'ended', 1500);
      const sp = await snap(page);
      ok('desktop: jpsm:sound from another source and a hidden page pause it via pauseVideo(); ENDED → "ended"', p1 && p2 && p3 && (sp.calls.match(/(^|,)pause(,|$)/g) || []).length >= 2 && sp.states === 'loading,ready,playing,paused,playing,paused,playing,ended', sp.states + ' | ' + sp.calls);
    }
    ok(`${dev.label}: no console errors`, o.errors.length === 0, o.errors.join(' | '));
    await o.ctx.close();
  }

  /* 2 · keyboard: Tab to the one control, Space → player, focus moves into it */
  {
    const o = await open();
    const { page } = o;
    let found = false;
    for (let i = 0; i < 40 && !found; i++) { await page.keyboard.press('Tab'); found = await page.evaluate(() => !!document.activeElement && document.activeElement.matches('#pj-yt [data-yt]')); }
    await page.keyboard.press(' ');
    const playing = await stateIs(page, 'playing', 4000);
    const s = await snap(page);
    ok('keyboard: Tab reaches the control, Space plays in the page, focus moves to the player', found && playing && s.iframes === 1 && s.active === 'IFRAME' && !o.popups.length && !o.navs.length, JSON.stringify({ found, state: s.state, active: s.active }));
    await o.ctx.close();
  }

  /* 3 · YouTube refuses the film (onError 150) → poster + note + Watch on YouTube, no iframe left */
  for (const dev of [IPHONE, DESKTOP]) {
    const o = await open({ dev, cfg: { errorFor: 150 } });
    const { page } = o;
    await tapCentre(o, dev);
    const err = await stateIs(page, 'error', 4000);
    const s = await snap(page);
    const bad = fallbackOk(s, o);
    ok(`${dev.label}: onError 150 → player destroyed; poster, note and "Watch on YouTube ↗" restored; no iframe`, err && !bad.length && /(^|,)destroy(,|$)/.test(s.calls) && s.states === 'loading,ready,error', bad.join('; ') + ' | ' + s.states + ' | ' + s.calls);
    const link = await page.locator('#pj-yt').getByRole('link', { name: /Watch on YouTube/ }).count();
    ok(`${dev.label}: the restored link is named "Watch on YouTube…" and described by the note`, link === 1);
    /* a second tap on the poster does not bring a player back or leave the page */
    await tapCentre(o, dev);
    await page.waitForTimeout(400);
    const s2 = await snap(page);
    ok(`${dev.label}: after the fallback the poster centre is inert (no new player, no navigation, no popup)`, s2.players === 1 && s2.iframes === 0 && !o.popups.length && !o.navs.length && s2.state === 'error', JSON.stringify({ players: s2.players, popups: o.popups.length, navs: o.navs }));
    if (!dev.mobile) {
      const [pop] = await Promise.all([o.ctx.waitForEvent('page', { timeout: 3000 }).catch(() => null), page.click('.pj-yt-out')]);
      await page.waitForTimeout(300);
      ok('desktop: the restored link opens YouTube in a new tab (the page stays)', !!pop && o.requests.some(u => u.startsWith(`https://www.youtube.com/watch?v=${VID}`)) && !o.navs.length, JSON.stringify({ pop: !!pop }));
    }
    ok(`${dev.label}: no console errors (onError 150)`, o.errors.length === 0, o.errors.join(' | '));
    await o.ctx.close();
  }

  /* 4 · iframe_api blocked · iframe_api never ready (timeout) · player never ready → the same clean fallback */
  for (const [label, opts, expect] of [
    ['iframe_api blocked', { api: 'fail' }, 'loading,error'],
    ['iframe_api timeout (apiMs)', { api: 'hang', test: { apiMs: 1200 } }, 'loading,error'],
    ['player never ready (readyMs)', { cfg: { noReady: true }, test: { readyMs: 1500 } }, 'loading,error']
  ]) {
    const o = await open({ dev: IPHONE, ...opts });
    const { page } = o;
    await tapCentre(o, IPHONE);
    const t0 = Date.now();
    const err = await stateIs(page, 'error', 5000);
    const ms = Date.now() - t0;
    const s = await snap(page);
    const bad = fallbackOk(s, o);
    ok(`${label} → poster, note and "Watch on YouTube ↗"; no iframe, no navigation`, err && !bad.length && s.states === expect, `${bad.join('; ')} | ${s.states} | ${ms} ms | api hits ${o.apiHits.length}`);
    if (opts.api === 'fail') ok('iframe_api blocked: the failed warm-up gets one retry on the tap, then gives up', o.apiHits.length === 2 && s.players === 0, 'hits ' + o.apiHits.length);
    ok(`${label}: no console errors`, o.errors.length === 0, o.errors.join(' | '));
    await o.ctx.close();
  }

  /* 5 · autoplay refused (Safari): never a broken state — YouTube's own play button is uncovered, then plays */
  {
    const o = await open({ dev: IPHONE, cfg: { blocked: true } });
    const { page } = o;
    await tapCentre(o, IPHONE);
    await stateIs(page, 'ready', 3000);
    const early = await snap(page);
    await page.waitForTimeout(1100);
    const late = await snap(page);
    ok('autoplay refused: state "ready", the poster covers the loading player, then steps aside for YouTube\'s own button',
      early.state === 'ready' && early.poster && early.iframes === 1 && late.state === 'ready' && late.hit === 'IFRAME' && !late.poster && !late.ctl && late.iframes === 1 && late.grain === 'hidden' && !/(^|,)mute(,|$)/.test(late.calls), JSON.stringify({ early: [early.state, early.poster, early.hit], late: [late.state, late.poster, late.hit, late.grain], calls: late.calls }));
    await page.evaluate(() => __yt.player.__tap());
    const playing = await stateIs(page, 'playing', 2000);
    ok('autoplay refused: a tap on YouTube\'s button → "playing", still one player', playing && (await snap(page)).players === 1);
    await o.ctx.close();
  }

  /* 6 · layout at 320–430 px: no horizontal overflow before, while playing and in the fallback; the player fits */
  for (const width of [320, 375, 390, 430]) {
    const dev = { vp: { width, height: 800 }, mobile: true, label: `${width}px` };
    const o = await open({ dev });
    const { page } = o;
    const a = await snap(page);
    await tapCentre(o, dev);
    await stateIs(page, 'playing', 4000);
    const b = await snap(page);
    await o.ctx.close();
    const e = await open({ dev, cfg: { errorFor: 150 } });
    await tapCentre(e, dev);
    await stateIs(e.page, 'error', 4000);
    const c = await snap(e.page);
    const bad = fallbackOk(c, e);
    ok(`layout ${width}: no horizontal overflow (poster / playing / fallback); player fills the frame; note + link inside the frame`, !a.overflow && !b.overflow && b.fit && b.hit === 'IFRAME' && Math.abs(b.ratio - 1.778) < 0.01 && !bad.length, JSON.stringify({ a: a.overflow, b: [b.overflow, b.fit, b.hit, b.ratio], bad }));
    await e.ctx.close();
  }

  /* 7 · embeddable:false in youtube.json → the build writes the poster + link treatment, no player, on the web build */
  {
    const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/youtube.json'), 'utf8'));
    const off = JSON.parse(JSON.stringify(meta)); off[VID].embeddable = false;
    const allOff = Object.fromEntries(Object.entries(meta).map(([k, v]) => [k, { ...v, embeddable: false }]));
    const p = projects.find(x => x.slug === SLUG);
    const web = renderProject(ctxFor('web', off, `work/${SLUG}`), p), webOn = renderProject(ctxFor('web', meta, `work/${SLUG}`), p);
    const prevOff = renderProject(ctxFor('preview', off, `work/${SLUG}`), p), prevOn = renderProject(ctxFor('preview', meta, `work/${SLUG}`), p);
    ok('embeddable:false (web build): no [data-yt], no stretched control; note + pj-yt-out link; data-yt-state="error"',
      !/data-yt=/.test(web) && !/pj-play--full/.test(web) && /class="[^"]*pj-yt-out[^"]*" href="https:\/\/www\.youtube\.com\/watch\?v=uM2j8bYrv68" target="_blank"/.test(web) && /data-yt-state="error"/.test(web) && /pj-yt-msg/.test(web) && /data-yt="uM2j8bYrv68"/.test(webOn));
    ok('embeddable:false does not change the preview build', prevOff === prevOn && !/iframe_api|data-yt=|pj-play--full|pj-yt-out/.test(prevOn));
    const reelData = m => JSON.parse(reelSection(ctxFor('web', m, '')).match(/<script type="application\/json" id="reel-data">([\s\S]*?)<\/script>/)[1].replace(/\\u003c/g, '<'));
    const r1 = reelData(off), r0 = reelData(meta), r2 = reelData(allOff);
    ok('home reel: a film with embeddable:false is left out of the YouTube list (all off → his own films)',
      r0.youtube.length === 5 && r1.youtube.length === 4 && !r1.youtube.some(f => f.youtubeId === VID) && r1.engine === 'youtube' && r2.youtube.length === 0 && r2.engine === 'file',
      JSON.stringify({ on: r0.youtube.length, off: r1.youtube.map(f => f.youtubeId), all: r2.engine }));
    /* the same markup in a browser: nothing loads from YouTube, the poster centre is inert, the link is there */
    const o = await open({ dev: IPHONE, html: web });
    const { page } = o;
    await page.waitForTimeout(600);
    await tapCentre(o, IPHONE);
    await page.waitForTimeout(500);
    const s = await snap(page);
    const bad = fallbackOk(s, o);
    ok('embeddable:false page in the browser: poster + note + link, no iframe_api request, no player, tap on the poster inert', !bad.length && o.apiHits.length === 0 && s.players === 0 && s.states === 'error', bad.join('; ') + ` | api ${o.apiHits.length}`);
    await o.ctx.close();
  }

  /* 8 · preview build: unchanged — the corner link to YouTube, no player, no iframe_api */
  {
    const url = `${PREVIEW}/work/${SLUG}/index.html`;
    const html = await (await fetch(url)).text();
    const o = await open({ url, dev: IPHONE });
    const { page } = o;
    await page.waitForTimeout(600);
    const s = await snap(page);
    const a = await page.evaluate(() => { const l = document.querySelector('#pj-yt a'); return { href: l.href, target: l.target, text: l.textContent, cls: l.className, role: l.getAttribute('role') }; });
    await tapCentre(o, IPHONE);
    await page.waitForTimeout(500);
    const s2 = await snap(page);
    const yt = await page.evaluate(() => window.JPSM && window.JPSM.youtube);
    ok('preview: the poster keeps its "Watch on YouTube ↗" link (new tab), no [data-yt], JPSM.youtube false',
      yt === false && a.href === `https://www.youtube.com/watch?v=${VID}` && a.target === '_blank' && /Watch on YouTube/.test(a.text) && a.cls === 'play pj-play pj-play--corner' && !a.role && !s.ctl, JSON.stringify(a));
    ok('preview: no iframe_api reference in the page and no request for it; no iframe; poster tap changes nothing',
      !/iframe_api/.test(html) && o.apiHits.length === 0 && s2.iframes === 0 && s2.state === null && !o.popups.length && !o.navs.length, JSON.stringify({ api: o.apiHits.length, iframes: s2.iframes, popups: o.popups.length, navs: o.navs }));
    await o.ctx.close();
  }

  /* 9 · home reel follow-ups: its iframe plays inline and allows autoplay; a film picked while the player loads plays */
  {
    const o = await open({ url: WEB + '/', cfg: { readyMs: 1200 } });
    const { page } = o;
    await page.evaluate(() => { const s = document.getElementById('featured'); window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 60); });
    const made = await until(page, () => window.__yt && __yt.players === 1, null, 5000);
    await page.click('#rl-next');
    await until(page, () => __yt.loads.length > 1, null, 4000);
    const r = await page.evaluate(() => { const f = document.querySelector('#rl-yt iframe'), u = new URL(f.src); return { playsinline: u.searchParams.get('playsinline'), mute: u.searchParams.get('mute'), loads: __yt.loads, i: JPSM_REEL.state.i, players: __yt.players, title: document.getElementById('rl-title').textContent }; });
    r.perms = await embedPerms(page);
    ok('home reel: one player, src playsinline=1 & mute=1, autoplay allowed inside its iframe', made && r.players === 1 && r.playsinline === '1' && r.mute === '1' && !!r.perms && r.perms.autoplay === true, JSON.stringify(r));
    ok('home reel: "Next" while the player is still loading → the player starts on the film the caption shows', r.i === 1 && r.loads[r.loads.length - 1] === 'bQmgSBOyIBQ' && /Grave/.test(r.title), JSON.stringify(r));
    await o.ctx.close();
  }

  /* 10 · home reel: a film YouTube refused keeps its card; Play / k / the gate never uncover YouTube's error screen */
  {
    const reelSnap = page => page.evaluate(() => ({ i: JPSM_REEL.state.i, mode: JPSM_REEL.state.mode, playing: JPSM_REEL.state.playing,
      ytOn: document.getElementById('rl-yt').classList.contains('is-on'), err: !document.getElementById('rl-err').hidden, calls: __yt.calls.join(',') }));
    const toReel = page => page.evaluate(() => { const s = document.getElementById('featured'); window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 60); });
    /* a film picked from the pips (watch mode: no auto-advance) is refused, then Play and k */
    const o = await open({ url: WEB + '/', cfg: { errorFor: 150 } });
    await toReel(o.page);
    await until(o.page, () => window.__yt && __yt.players === 1 && !document.getElementById('rl-err').hidden, null, 5000);
    await o.page.click('.rl-pip[data-i="2"]');
    await until(o.page, () => JPSM_REEL.state.i === 2 && __yt.calls.some(c => c === 'load:D9iNANLSWJI') && !document.getElementById('rl-err').hidden, null, 4000);
    await o.page.click('#rl-pp');
    await o.page.waitForTimeout(3000);
    await o.page.keyboard.press('k');
    await o.page.waitForTimeout(3000);
    const a = await reelSnap(o.page);
    ok('home reel: Play and k on a refused film keep the card; the player stays hidden', a.i === 2 && a.mode === 'watch' && !a.playing && !a.ytOn && a.err, JSON.stringify(a));
    await o.ctx.close();
    /* autoplay blocked → the gate; YouTube refuses the film right after the tap */
    const g = await open({ url: WEB + '/', cfg: { blocked: true }, reel: { blockMs: 1000, errMs: 6000 } });
    await toReel(g.page);
    await until(g.page, () => !document.getElementById('rl-gate').hidden, null, 6000);
    await g.page.evaluate(() => { __yt.errorFor = 150; });
    await g.page.click('#rl-gate');
    await g.page.waitForTimeout(3200);
    const b = await reelSnap(g.page);
    ok('home reel: a film refused just after the Play gate keeps its card; the 2.5 s reveal never fires', !b.ytOn && b.err && !b.playing && /error:150/.test(b.calls), JSON.stringify(b));
    await g.ctx.close();
  }

  /* 11 · home reel: iframe_api loads but the player never gets ready → the same films as posters + "Watch on YouTube" */
  {
    const o = await open({ url: WEB + '/', cfg: { noReady: true }, reel: { readyMs: 1500 } });
    const { page } = o;
    await page.evaluate(() => { const s = document.getElementById('featured'); window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 60); });
    const fell = await until(page, () => window.JPSM_REEL && JPSM_REEL.engine() === 'link' && !document.getElementById('rl-err').hidden, null, 6000);
    const r = await page.evaluate(() => ({ engine: JPSM_REEL.engine(), iframes: document.querySelectorAll('#rl-yt iframe').length, players: __yt.players, calls: __yt.calls.join(','),
      yt: document.getElementById('rl-err-yt').href, offline: document.getElementById('featured').classList.contains('is-offline'), title: document.getElementById('rl-title').textContent }));
    await page.click('#rl-next'); await page.waitForTimeout(400);
    const n = await page.evaluate(() => ({ i: JPSM_REEL.state.i, err: !document.getElementById('rl-err').hidden, yt: document.getElementById('rl-err-yt').href }));
    ok('home reel: player never ready → destroyed; poster + "Watch on YouTube" for the same films, Next keeps the link',
      fell && r.players === 1 && r.iframes === 0 && /(^|,)destroy(,|$)/.test(r.calls) && r.offline && r.yt === 'https://www.youtube.com/watch?v=uM2j8bYrv68' && /READY/.test(r.title)
      && n.i === 1 && n.err && n.yt === 'https://www.youtube.com/watch?v=bQmgSBOyIBQ', JSON.stringify({ fell, r, n }));
    ok('home reel (never ready): no console errors', o.errors.length === 0, o.errors.join(' | '));
    await o.ctx.close();
  }
} catch (e) {
  ok('test run completed without exceptions', false, e.stack);
}
await browser.close();
kids.forEach(k => k.kill());
const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);

/* a build context, as build.mjs makeCtx() makes it, with youtube.json swapped for the case under test */
function ctxFor(target, ytMeta, route) {
  const depth = route === '' || route === '404' ? 0 : route.split('/').length;
  const fileFor = r => r === '' ? 'index.html' : r === '404' ? '404.html' : `${r}/index.html`;
  const up = target === 'preview' ? (depth ? '../'.repeat(depth) : '') : '/';
  return {
    target, preview: true, route, site, projects, categories, sorted, ytMeta, year: new Date().getFullYear(),
    href: (to, hash) => { const h = hash ? '#' + hash : ''; return target === 'preview' ? up + fileFor(to) + h : (to === '' ? '/' : '/' + to) + h; },
    asset: p => up + p.replace(/^\//, ''),
    abs: to => site.url + (to === '' ? '/' : '/' + to),
    youtube: target !== 'preview',
    inquiryTransport: target === 'preview' ? 'artifact-db' : 'api'
  };
}
