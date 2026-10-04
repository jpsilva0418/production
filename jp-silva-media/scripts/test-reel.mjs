#!/usr/bin/env node
/* Featured Work reel — behaviour tests (Playwright + a MOCK YouTube IFrame API).
     node scripts/test-reel.mjs [--web=http://127.0.0.1:8788] [--preview=http://127.0.0.1:8791]
   The web build must be served at --web (YouTube engine). For the File engine on the preview build, pass --preview
   (serve it with: node scripts/serve.mjs --dir=.preview --port=8791); without it, the File engine is tested through the
   web build's automatic fallback (API script failure). Exit 1 on any failure. */
import { createRequire } from 'node:module';
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const WEB = arg('web', 'http://127.0.0.1:8788');
const PREVIEW = arg('preview', '');
let chromium;
try { ({ chromium } = await import('playwright')); } catch (e) {
  try { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); } catch (e2) { console.error('Playwright is required'); process.exit(1); }
}
void createRequire;

/* ---------- the mock YT API (served for https://www.youtube.com/iframe_api) ---------- */
const MOCK = `(function(){
  var cfg = window.__yt = window.__yt || {};
  cfg.players = 0; cfg.loads = []; cfg.calls = [];
  var S = { UNSTARTED:-1, ENDED:0, PLAYING:1, PAUSED:2, BUFFERING:3, CUED:5 };
  function Player(el, o) {
    cfg.players++;
    var host = typeof el === 'string' ? document.getElementById(el) : el;
    var f = document.createElement('iframe'); f.className = 'mock-yt'; f.id = host.id; f.setAttribute('title', 'YouTube video player');
    f.src = 'about:blank'; host.parentNode.replaceChild(f, host);
    var self = this; self.__tok = 0; var ev = o.events || {}, t = 0, playing = false, muted = !!(o.playerVars && o.playerVars.mute), vid = o.videoId, iv = 0;
    cfg.player = this; cfg.vars = o.playerVars; cfg.host = o.host; cfg.loads.push(vid);
    function fire(s) { if (ev.onStateChange) ev.onStateChange({ data: s, target: self }); }
    function start() {
      if (cfg.errorFor && cfg.errorFor[vid]) { setTimeout(function(){ ev.onError && ev.onError({ data: cfg.errorFor[vid], target: self }); }, 120); return; }
      if (cfg.blocked) return;
      var tok = ++self.__tok; setTimeout(function(){ if (tok !== self.__tok) return; playing = true; fire(S.PLAYING); }, 120);
    }
    clearInterval(iv); iv = setInterval(function(){ if (playing) t += 0.1 * (cfg.speed || 1); }, 100);
    this.playVideo = function(){ cfg.calls.push('play'); if (!playing) start(); };
    this.pauseVideo = function(){ cfg.calls.push('pause'); if (playing) { playing = false; fire(S.PAUSED); } };
    this.loadVideoById = function(a, s){ var id = typeof a === 'object' ? a.videoId : a; var st = typeof a === 'object' ? a.startSeconds : s; vid = id; t = st || 0; playing = false; self.__tok++; cfg.loads.push(id); cfg.calls.push('load:' + id); fire(S.UNSTARTED); start(); };
    this.mute = function(){ muted = true; }; this.unMute = function(){ muted = false; cfg.calls.push('unmute'); }; this.isMuted = function(){ return muted; };
    this.getDuration = function(){ return 200; }; this.getCurrentTime = function(){ return t; };
    this.seekTo = function(x){ t = x; cfg.calls.push('seek:' + Math.round(x)); };
    this.getVideoData = function(){ return { video_id: vid }; };
    this.destroy = function(){ clearInterval(iv); f.remove(); };
    this.__end = function(){ playing = false; fire(S.ENDED); };
    setTimeout(function(){ ev.onReady && ev.onReady({ target: self }); }, 80);
  }
  window.YT = { Player: Player, PlayerState: S };
  setTimeout(function(){ window.onYouTubeIframeAPIReady && window.onYouTubeIframeAPIReady(); }, 10);
})();`;

const results = [];
const ok = (name, pass, detail = '') => { results.push({ name, pass: !!pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const IGNORE = /Failed to load resource|ERR_TUNNEL|net::ERR_/;   // network noise from assets outside the reel / blocked hosts

async function open({ url = WEB + '/', vp = { width: 1440, height: 900 }, yt = 'mock', cfg = {}, test = {}, reduced = false, spacer = false, mobile = false } = {}) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: reduced ? 'reduce' : 'no-preference', isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  const errors = [], apiHits = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !IGNORE.test(m.text())) errors.push(m.text()); });
  if (spacer) await page.route(url, async r => { const res = await r.fetch(); const b = (await res.text()).replace('<section class="rl"', '<div id="spacer" style="height:4000px"></div><section class="rl"'); return r.fulfill({ response: res, body: b }); });
  await page.route('https://www.youtube.com/iframe_api', r => { apiHits.push(Date.now()); return yt === 'fail' ? r.abort() : r.fulfill({ status: 200, contentType: 'text/javascript', body: MOCK }); });
  await page.route(/youtube-nocookie\.com|ytimg\.com|googlevideo/, r => r.abort());
  await page.addInitScript(([c, t, sp]) => {
    window.__yt = c; window.JPSM_REEL_TEST = t;
    try { sessionStorage.setItem('c01', '1'); } catch (e) {}
  }, [cfg, { segment: 2, blockMs: 1500, apiMs: 2500, errMs: 1500, ...test }, spacer]);
  await page.goto(url, { waitUntil: 'load' });
  const toReel = async () => { await page.evaluate(() => { const s = document.getElementById('featured'); window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 60); }); };
  return { ctx, page, errors, apiHits, toReel };
}
const st = page => page.evaluate(() => ({ i: JPSM_REEL.state.i, mode: JPSM_REEL.state.mode, muted: JPSM_REEL.state.muted, playing: JPSM_REEL.state.playing, engine: JPSM_REEL.engine() }));
const wait = (p, ms) => p.waitForTimeout(ms);
async function until(page, fn, arg, ms = 6000) { try { await page.waitForFunction(fn, arg, { timeout: ms }); return true; } catch (e) { return false; } }

try {
  /* 1 · lazy load only near the viewport */
  {
    const o = await open({ spacer: true });
    await wait(o.page, 1500);
    const before = o.apiHits.length;
    await o.toReel();
    const loaded = await until(o.page, () => window.__yt && window.__yt.players === 1);
    ok('lazy: iframe_api not requested while the reel is far away, requested near the viewport', before === 0 && o.apiHits.length === 1 && loaded, `before=${before} after=${o.apiHits.length}`);
    await o.ctx.close();
  }

  /* 2 · YouTube engine: one player, nocookie host, playerVars, reel advances after the segment, ENDED, controls */
  {
    const o = await open();
    const { page } = o;
    await o.toReel();
    await until(page, () => window.__yt.players === 1 && JPSM_REEL.state.playing);
    const v = await page.evaluate(() => ({ host: __yt.host, vars: __yt.vars, wrap: document.getElementById('rl-yt').classList.contains('is-on') }));
    ok('youtube: one YT.Player on youtube-nocookie with the brief\'s playerVars', v.host === 'https://www.youtube-nocookie.com' && v.vars.mute === 1 && v.vars.controls === 0 && v.vars.playsinline === 1 && v.vars.rel === 0 && v.vars.fs === 0 && v.vars.disablekb === 1 && v.vars.iv_load_policy === 3 && v.vars.origin === new URL(WEB).origin, JSON.stringify(v.vars));
    await until(page, () => document.getElementById('rl-yt').classList.contains('is-on'));
    const seeked = await page.evaluate(() => __yt.calls.some(c => c === 'seek:30'));
    ok('youtube: reel mode starts each film at 15% of its duration', seeked, (await page.evaluate(() => __yt.calls.join(','))));
    const adv = await until(page, () => JPSM_REEL.state.i === 1 && __yt.loads.length > 1 && JPSM_REEL.state.playing, null, 7000);
    const s1 = await page.evaluate(() => ({ loads: __yt.loads, title: document.getElementById('rl-title').textContent, live: document.getElementById('rl-live').textContent, n: document.getElementById('rl-n').textContent }));
    ok('youtube: reel advances after the segment (loadVideoById, title, counter, aria-live)', adv && s1.loads[1] === 'bQmgSBOyIBQ' && /Grave/i.test(s1.title) && s1.n === '02' && /Now playing/.test(s1.live), JSON.stringify(s1));
    const pv = await page.evaluate(() => { const p = document.getElementById('rl-prog'); return { role: p.getAttribute('role'), now: p.getAttribute('aria-valuenow') }; });
    ok('progress: role=progressbar with aria-valuenow', pv.role === 'progressbar' && pv.now !== null, JSON.stringify(pv));
    // controls
    await page.click('#rl-next'); await wait(page, 100);
    let s = await st(page); const afterNext = s.i;
    await page.click('#rl-prev'); await wait(page, 100);
    s = await st(page); const afterPrev = s.i;
    await page.click('.rl-pip[data-i="4"]'); await wait(page, 100);
    s = await st(page); const afterPip = s.i;
    const cur = await page.evaluate(() => document.querySelector('.rl-pip[aria-current="true"]').dataset.i);
    await page.focus('#rl-pp');
    await page.keyboard.press('ArrowRight'); await wait(page, 100);
    const afterKey = (await st(page)).i;
    await page.keyboard.press('ArrowLeft'); await wait(page, 100);
    const afterKeyL = (await st(page)).i;
    ok('controls: next / prev / pip / ←→ keys move through the reel', afterNext === 2 && afterPrev === 1 && afterPip === 4 && cur === '4' && afterKey === 0 && afterKeyL === 4, `${afterNext},${afterPrev},${afterPip},${afterKey},${afterKeyL}`);
    await wait(page, 700);
    await until(page, () => JPSM_REEL.state.playing);
    await page.focus('#rl-prev');
    await page.keyboard.press('k'); await wait(page, 300);
    const paused = !(await st(page)).playing;
    await page.keyboard.press('k'); await until(page, () => JPSM_REEL.state.playing, null, 2000);
    const resumed = (await st(page)).playing;
    ok('keyboard: K pauses and resumes', paused && resumed, paused + ' ' + resumed + ' ' + (await page.evaluate(() => __yt.calls.slice(-8).join(','))));
    await page.keyboard.press('m'); await wait(page, 150);
    const sm = await page.evaluate(() => ({ muted: __yt.player.isMuted(), pressed: document.getElementById('rl-snd').getAttribute('aria-pressed'), label: document.getElementById('rl-snd').textContent.trim(), mode: JPSM_REEL.state.mode }));
    ok('keyboard: M unmutes ("Sound on", aria-pressed=true) and switches to watch mode', !sm.muted && sm.pressed === 'true' && /Sound on/.test(sm.label) && sm.mode === 'watch', JSON.stringify(sm));
    await page.keyboard.press('m'); await wait(page, 100);
    await o.ctx.close();
  }

  /* 3 · unmute → watch mode, no segment cutting; ENDED advances keeping sound */
  {
    const o = await open();
    const { page } = o;
    await o.toReel();
    await until(page, () => JPSM_REEL.state.playing);
    let heard = 0;
    await page.exposeFunction('__heard', () => { heard++; });
    await page.evaluate(() => window.addEventListener('jpsm:sound', e => { if (e.detail && e.detail.owner === 'reel') window.__heard(); }));
    await page.click('#rl-snd');
    await wait(page, 3500);
    const s = await st(page);
    ok('unmute: watch mode, segment cutting stops, jpsm:sound dispatched', s.mode === 'watch' && s.i === 0 && !s.muted && heard === 1, JSON.stringify(s) + ' heard=' + heard);
    await page.evaluate(() => __yt.player.__end());
    await until(page, () => JPSM_REEL.state.i === 1 && JPSM_REEL.state.playing, null, 3000);
    const s2 = await st(page);
    const m2 = await page.evaluate(() => __yt.player.isMuted());
    ok('ENDED advances to the next film and keeps the visitor\'s sound state', s2.i === 1 && !s2.muted && !m2 && s2.mode === 'watch', JSON.stringify(s2));
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('jpsm:sound', { detail: { owner: 'other' } })));
    await wait(page, 300);
    const s3 = await st(page);
    ok('jpsm:sound from another source mutes and pauses the reel', s3.muted && !s3.playing, JSON.stringify(s3));
    ok('youtube: exactly one player after several films', (await page.evaluate(() => __yt.players + ':' + document.querySelectorAll('#rl-yt iframe').length)) === '1:1');
    await o.ctx.close();
  }

  /* 4 · error 150 → YouTube link + Next film, auto-advance in reel mode */
  {
    const o = await open({ cfg: { errorFor: { 'uM2j8bYrv68': 150 } } });
    const { page } = o;
    await o.toReel();
    const shown = await until(page, () => !document.getElementById('rl-err').hidden, null, 4000);
    const e = await page.evaluate(() => ({ href: document.getElementById('rl-err-yt').href, target: document.getElementById('rl-err-yt').target, wrap: document.getElementById('rl-yt').classList.contains('is-on') }));
    ok('error 150: poster + "Watch on YouTube ↗" (new tab) + Next film, player hidden', shown && e.href === 'https://www.youtube.com/watch?v=uM2j8bYrv68' && e.target === '_blank' && !e.wrap, JSON.stringify(e));
    const adv = await until(page, () => JPSM_REEL.state.i === 1 && document.getElementById('rl-err').hidden, null, 4000);
    ok('error 150: auto-advances after the delay', adv);
    await o.ctx.close();
  }

  /* 5 · blocked autoplay → play control; click → playVideo; still nothing → reveal YouTube's own surface */
  {
    const o = await open({ cfg: { blocked: true } });
    const { page } = o;
    await o.toReel();
    const gate = await until(page, () => !document.getElementById('rl-gate').hidden, null, 5000);
    const wrapHidden = await page.evaluate(() => !document.getElementById('rl-yt').classList.contains('is-on'));
    ok('blocked autoplay: Picture Start play control shown over the poster (player hidden beneath)', gate && wrapHidden);
    const calls0 = await page.evaluate(() => __yt.calls.filter(c => c === 'play').length);
    await page.click('#rl-gate');
    await wait(page, 200);
    const calls1 = await page.evaluate(() => __yt.calls.filter(c => c === 'play').length);
    const revealed = await until(page, () => document.getElementById('rl-yt').classList.contains('is-on') && document.getElementById('rl-gate').hidden, null, 4000);
    ok('blocked autoplay: click calls playVideo(), then reveals the player for a direct tap', calls1 > calls0 && revealed, `${calls0}->${calls1}`);
    await o.ctx.close();
  }

  /* 6 · script failure → File engine, which crossfades A/B and advances */
  {
    const o = await open({ yt: 'fail' });
    const { page } = o;
    await o.toReel();
    const t0 = await page.evaluate(() => document.getElementById('rl-title').textContent);
    const fell = await until(page, () => JPSM_REEL.engine() === 'link' && !document.getElementById('rl-err').hidden, null, 8000);
    const t = await page.evaluate(() => ({ title: document.getElementById('rl-title').textContent, n: document.querySelectorAll('.rl-pip').length, yt: document.getElementById('rl-err-yt').href, vids: document.querySelectorAll('#rl-vids video').length }));
    ok('script failure: same films stay (no playlist swap), poster + Watch on YouTube', fell && t.n === 5 && t.title === t0 && /youtube\.com\/watch/.test(t.yt) && t.vids === 0, JSON.stringify(t));
    await page.click('#rl-next'); await wait(page, 500);
    const t2 = await page.evaluate(() => ({ i: JPSM_REEL.state.i, err: !document.getElementById('rl-err').hidden }));
    ok('script failure: next film keeps the YouTube link panel', t2.i === 1 && t2.err, JSON.stringify(t2));
    await o.ctx.close();
  }
  if (PREVIEW) {
    const url = PREVIEW.replace(/\/$/, '') + '/index.html';
    const o = await open({ url, yt: 'fail' });
    const { page } = o;
    await o.toReel();
    const pv = await page.evaluate(() => ({ engine: JSON.parse(document.getElementById('reel-data').textContent).engine, yt: window.JPSM && JPSM.youtube }));
    ok('preview build emits the File engine (engine "file", JPSM.youtube false) - rebuild with --target=preview if this fails', pv.engine === 'file' && pv.yt === false, JSON.stringify(pv));
    await until(page, () => JPSM_REEL.engine() === 'file' && JPSM_REEL.state.playing, null, 6000);
    const a = await page.evaluate(() => [...document.querySelectorAll('#rl-vids video')].map(v => ({ on: v.classList.contains('is-on'), src: (v.currentSrc || '').split('/').pop(), muted: v.muted })));
    // sample mid-crossfade: both videos visible with opacity between 0 and 1
    await until(page, () => JPSM_REEL.state.i === 1, null, 6000);
    const mid = await page.evaluate(() => [...document.querySelectorAll('#rl-vids video')].map(v => +getComputedStyle(v).opacity));
    await wait(page, 1200);
    const b = await page.evaluate(() => [...document.querySelectorAll('#rl-vids video')].map(v => ({ on: v.classList.contains('is-on'), src: (v.currentSrc || '').split('/').pop(), paused: v.paused })));
    const cross = mid.some(x => x > 0.02 && x < 0.98) || (a.filter(x => x.on).length === 1 && b.filter(x => x.on).length === 1 && a.findIndex(x => x.on) !== b.findIndex(x => x.on));
    ok(`file engine${PREVIEW ? ' (preview build)' : ''}: two stacked videos crossfade and the reel advances`, a.length === 2 && cross && b.some(x => x.on && /western/.test(x.src)) && b.some(x => !x.on && x.paused), JSON.stringify({ a, mid, b }));
    await page.click('#rl-snd');
    await wait(page, 300);
    const snd = await page.evaluate(() => { const v = [...document.querySelectorAll('#rl-vids video')].find(x => x.classList.contains('is-on')); return v ? { muted: v.muted, mode: JPSM_REEL.state.mode } : { muted: true, mode: JPSM_REEL.state.mode, novideo: true }; });
    ok('file engine: unmute gives real sound (video.muted=false) and watch mode', !snd.muted && snd.mode === 'watch', JSON.stringify(snd));
    ok('file engine: no console errors', o.errors.length === 0, o.errors.join(' | '));
    await o.ctx.close();
  }

  /* 7 · reduced motion: never autoplays, no auto-advance */
  {
    const o = await open({ reduced: true });
    const { page } = o;
    await o.toReel();
    await wait(page, 3500);
    const r = await page.evaluate(() => ({ players: (window.__yt && __yt.players) || 0, playing: JPSM_REEL.state.playing, gate: !document.getElementById('rl-gate').hidden, i: JPSM_REEL.state.i, vids: [...document.querySelectorAll('video')].filter(v => !v.paused).length }));
    ok('reduced motion: no autoplay (no player, no playing video), poster + play control', r.players === 0 && !r.playing && r.gate && r.i === 0 && r.vids === 0, JSON.stringify(r));
    await page.click('#rl-gate');
    await until(page, () => JPSM_REEL.state.playing, null, 4000);
    await wait(page, 3000);
    const r2 = await st(page);
    ok('reduced motion: a tap plays the film, which is never cut or advanced', r2.playing && r2.i === 0 && r2.mode === 'watch', JSON.stringify(r2));
    await o.ctx.close();
  }

  /* 8 · layout: no horizontal overflow, YouTube stays 16:9, nothing over the playing player; console clean */
  for (const vp of [{ width: 390, height: 844, mobile: true }, { width: 1440, height: 900 }]) {
    const o = await open({ vp: { width: vp.width, height: vp.height }, mobile: !!vp.mobile });
    const { page } = o;
    await o.toReel();
    await until(page, () => document.getElementById('rl-yt').classList.contains('is-on'), null, 5000);
    const L = await page.evaluate(() => {
      const de = document.documentElement, f = document.querySelector('#rl-yt iframe').getBoundingClientRect();
      const cx = f.left + f.width / 2, cy = f.top + f.height / 2;
      const top = document.elementFromPoint(cx, cy);
      const r = document.querySelector('.rl-reel').getBoundingClientRect(), sl = document.querySelector('.rl-slate').getBoundingClientRect();
      const small = [...document.querySelectorAll('#featured button:not([hidden]), #featured a')].filter(el => { const b = el.getBoundingClientRect(); return b.width > 0 && (b.height < 44 || b.width < 44) && el.offsetParent; }).map(el => el.id || el.className);
      return { overflow: de.scrollWidth > innerWidth + 1, ratio: +(f.width / f.height).toFixed(3), frameW: Math.round(f.width), onTop: top && top.tagName, total: Math.round(r.bottom - sl.top), small };
    });
    ok(`layout ${vp.width}: no horizontal overflow`, !L.overflow);
    ok(`layout ${vp.width}: YouTube iframe exactly 16:9 and nothing on top of the playing player`, Math.abs(L.ratio - 1.778) < 0.01 && L.onTop === 'IFRAME', JSON.stringify(L));
    ok(`layout ${vp.width}: reel (slate → controls) fits one screen`, L.total <= vp.height, 'height ' + L.total);
    ok(`layout ${vp.width}: reel touch targets ≥ 44px`, L.small.length === 0, L.small.join(','));
    ok(`layout ${vp.width}: no console errors`, o.errors.length === 0, o.errors.join(' | '));
    await o.ctx.close();
  }

  /* 9 · no JS: poster + title + Watch the film + the other films */
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(WEB + '/', { waitUntil: 'load' });
    const n = await page.evaluate(() => ({ img: document.getElementById('rl-img').getAttribute('src'), title: document.getElementById('rl-title').textContent, cta: getComputedStyle(document.querySelector('.rl-nojs-cta')).display, list: [...document.querySelectorAll('.rl-list a')].filter(a => a.offsetParent).length, ctl: getComputedStyle(document.getElementById('rl-ctl')).display }));
    ok('no-JS: poster, title, "Watch the film" link and the other four films as links; controls hidden', /yt-uM2j8bYrv68/.test(n.img) && /READY/.test(n.title) && n.cta === 'block' && n.list === 4 && n.ctl === 'none', JSON.stringify(n));
    await ctx.close();
  }
} catch (e) {
  ok('test run completed without exceptions', false, e.stack);
}
await browser.close();
const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
