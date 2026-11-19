#!/usr/bin/env node
/* Packs one built Amairany site into ONE self-contained HTML file, for sharing a preview
   where a link cannot go: a chat attachment, an email, a phone's file viewer.

       node scripts/amairanymua-01-build.mjs
       node scripts/amairanymua-01-bundle.mjs <veil|noir|edit> <out.html> [--img 480|800]

   Everything the site needs travels inside the file: the seven pages, their stylesheets and
   scripts, the fonts and her photographs (as data URIs). Page text is gzip-compressed and
   unpacked in the browser (DecompressionStream; iPhone iOS 16.4+). The pages run in a
   full-screen frame; tapping a link to another page of the same site swaps the page inside
   the file, so the whole site can be clicked through offline. Links to her booking pages and
   Instagram open outside. Links to the other two previews show a short note, because each
   preview is its own file.

   Nothing is fetched and nothing is sent: the file makes no network request of its own. It
   reads only the built pages in public/demo/amairanymua-01/ and writes only <out.html>. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE, PAGES, SITES, SITE } from './amairanymua-01/site.mjs';

const [site, out] = process.argv.slice(2);
const IMG = process.argv.includes('--img') ? process.argv[process.argv.indexOf('--img') + 1] : '800';
if (!SITES[site] || !out) { console.error('usage: node scripts/amairanymua-01-bundle.mjs <veil|noir|edit> <out.html> [--img 480|800]'); process.exit(1); }
const DEMO = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'demo', 'amairanymua-01');
const fileOf = (url) => join(DEMO, url.slice(BASE.length + 1));

/* ---- assets: every file under /assets/ becomes a token; its bytes go in once ---- */
const assets = new Map(); // url -> token
const assetData = {};
const MIME = { webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', woff2: 'font/woff2', mp4: 'video/mp4' };
const pickWidth = (url) => url.replace(/-(480|800|1280)\.webp$/, (m, w) => {
  const want = url.replace(/-(480|800|1280)\.webp$/, `-${IMG}.webp`);
  return existsSync(fileOf(want)) ? `-${IMG}.webp` : m;
});
const token = (url) => {
  url = pickWidth(url);
  if (!assets.has(url)) {
    const f = fileOf(url);
    if (!existsSync(f)) throw new Error(`missing asset ${url}`);
    const ext = url.split('.').pop().toLowerCase();
    const t = `@@A${assets.size}@@`;
    assets.set(url, t);
    assetData[t] = `data:${MIME[ext] || 'application/octet-stream'};base64,${readFileSync(f).toString('base64')}`;
  }
  return assets.get(url);
};
const ASSET_RE = new RegExp(`${BASE.replace(/[/.]/g, '\\$&')}/assets/[A-Za-z0-9_./-]+\\.(?:webp|jpg|jpeg|png|svg|woff2|mp4)`, 'g');
const tokenize = (text) => text.replace(ASSET_RE, (u) => token(u));

/* ---- stylesheets and scripts: stored once, spliced into each page at run time ---- */
const css = {}, js = {};
const cssText = (url) => {
  if (css[url] === undefined) {
    let t = readFileSync(fileOf(url), 'utf8');
    // url(...) relative to the stylesheet -> absolute demo URL -> token
    t = t.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => {
      if (/^(data:|#|%23|https?:)/.test(u)) return m;
      const abs = u.startsWith('/') ? u : posix.normalize(posix.join(posix.dirname(url), u));
      return abs.startsWith(`${BASE}/assets/`) ? `url("${token(abs)}")` : m;
    });
    css[url] = tokenize(t);
  }
  return url;
};
const jsText = (url) => { if (js[url] === undefined) js[url] = tokenize(readFileSync(fileOf(url), 'utf8')); return url; };

/* ---- the pages ---- */
const pages = {};
for (const path of PAGES) {
  const f = join(DEMO, site, path, 'index.html');
  if (!existsSync(f)) throw new Error(`page not built: ${site}/${path} (run the build first)`);
  let h = readFileSync(f, 'utf8');
  h = h
    .replace(/<link\b[^>]*\brel="(?:preload|icon|canonical|apple-touch-icon|modulepreload)"[^>]*>\s*/g, '')
    .replace(/<meta\b[^>]*\b(?:property="og:[^"]*"|name="twitter:[^"]*")[^>]*>\s*/g, '')
    .replace(/\s(?:srcset|sizes|imagesrcset|imagesizes)="[^"]*"/g, '')
    .replace(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>/g, (m, u) => (u.startsWith(BASE) ? `<!--am01css:${cssText(u)}-->` : ''));
  // external scripts keep their order and move to the end of <body>, as `defer` would run them
  const tail = [];
  h = h.replace(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>\s*<\/script>/g, (m, u) => { if (u.startsWith(BASE)) tail.push(jsText(u)); return ''; });
  h = h.replace(/<\/body>/, `${tail.map((u) => `<!--am01js:${u}-->`).join('')}</body>`);
  pages[path] = tokenize(h);
}

/* ---- what runs inside every page: storage stand-in, link handling, hash scroll ---- */
const INJECT = `<script>(function(){var P=window.parent!==window?window.parent:null;
function mem(n){var s;try{s=P&&P.__am01store&&P.__am01store[n]}catch(e){}if(!s){s={}}return{getItem:function(k){return Object.prototype.hasOwnProperty.call(s,k)?s[k]:null},setItem:function(k,v){s[k]=String(v)},removeItem:function(k){delete s[k]},clear:function(){for(var k in s)delete s[k]},key:function(i){return Object.keys(s)[i]||null},get length(){return Object.keys(s).length}}}
['sessionStorage','localStorage'].forEach(function(n){var ok=false;try{window[n].setItem('__t','1');window[n].removeItem('__t');ok=true}catch(e){}if(!ok){try{Object.defineProperty(window,n,{value:mem(n),configurable:true})}catch(e){}}});
document.addEventListener('click',function(e){if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');if(!h||h.charAt(0)==='#')return;
if(h.indexOf(${JSON.stringify(BASE)})===0||/^https?:|^mailto:/.test(h)){e.preventDefault();try{P.postMessage({am01:h},'*')}catch(x){}}},false);
/* a sandboxed viewer may block form submission outright (no submit event at all); the inquiry
   never submits anywhere, so its step button is turned into a plain submit EVENT here */
document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('button[type="submit"],input[type="submit"]');if(!b||!b.form)return;e.preventDefault();var ev;try{ev=new SubmitEvent('submit',{bubbles:true,cancelable:true,submitter:b})}catch(x){ev=new Event('submit',{bubbles:true,cancelable:true})}b.form.dispatchEvent(ev)},true);
var go=function(){var id=window.__am01hash;if(id){var el=document.getElementById(id);if(el)el.scrollIntoView()}};document.addEventListener('DOMContentLoaded',function(){setTimeout(go,60)});})();</script>`;

const payload = gzipSync(Buffer.from(JSON.stringify({ pages, css, js, inject: INJECT })), { level: 9 }).toString('base64');
const S = SITES[site];
const other = Object.values(SITES).filter((x) => x.id !== site).map((x) => x.name);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>${SITE.name} — Preview ${S.n}: ${S.name} · design preview</title>
<meta name="theme-color" content="${S.theme}">
<style>
html,body{margin:0;height:100%;background:${S.theme};overflow:hidden}
#am01f{position:fixed;inset:0;width:100%;height:100%;border:0;display:block;background:${S.theme}}
#am01msg{position:fixed;inset:0;display:grid;place-items:center;padding:24px;font:15px/1.5 system-ui,-apple-system,sans-serif;color:#2a2320;background:${S.theme};text-align:center}
#am01note{position:fixed;left:50%;top:16px;transform:translate(-50%,-140%);z-index:9;max-width:min(92vw,420px);padding:12px 16px;border-radius:14px;background:#17110f;color:#f6efe6;font:14px/1.45 system-ui,-apple-system,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,.5);transition:transform .35s ease}
#am01note.on{transform:translate(-50%,0)}
</style>
</head>
<body>
<div id="am01msg">Opening ${SITE.name} &middot; ${S.name}&hellip;</div>
<iframe id="am01f" title="${SITE.name} — ${S.name} (design preview)" hidden></iframe>
<div id="am01note" role="status" aria-live="polite"></div>
<script id="am01data" type="application/octet-stream">${payload}</script>
<script id="am01assets" type="application/json">${JSON.stringify(assetData)}</script>
<script>
(function(){'use strict';
var BASE=${JSON.stringify(BASE)},SITE=${JSON.stringify(site)},OTHER=${JSON.stringify(other)};
var frame=document.getElementById('am01f'),msg=document.getElementById('am01msg'),note=document.getElementById('am01note');
window.__am01store={sessionStorage:{},localStorage:{}};
var D,A=JSON.parse(document.getElementById('am01assets').textContent),noteT;
function say(t){note.textContent=t;note.classList.add('on');clearTimeout(noteT);noteT=setTimeout(function(){note.classList.remove('on')},4200)}
function fill(t){return t.replace(/@@A\\d+@@/g,function(k){return A[k]||k})}
function build(path,hash){var h=D.pages[path];if(h==null)return null;
h=h.replace(/<!--am01css:([^>]+?)-->/g,function(m,u){return '<style>'+fill(D.css[u]||'')+'</style>'});
h=h.replace(/<!--am01js:([^>]+?)-->/g,function(m,u){return '<script>'+(D.js[u]||'').replace(/<\\/script/gi,'<\\\\/script')+'<\\/script>'});
h=h.replace(/<head>/i,'<head>'+(hash?'<script>window.__am01hash='+JSON.stringify(hash)+'<\\/script>':'')+D.inject);
return fill(h)}
function show(path,hash){var h=build(path,hash);if(h==null){say('That page is not in this preview file.');return}
frame.srcdoc=h;frame.hidden=false;msg.hidden=true;try{history.replaceState(null,'','#'+(path||'home'))}catch(e){}}
function route(href){var m=href.match(/^https?:|^mailto:/);if(m){var w=null;try{w=window.open(href,'_blank','noopener')}catch(e){}if(!w){try{window.top.location.href=href}catch(e){say('Links to her booking pages open outside this preview file.')}}return}
var u=href.split('#'),hash=u[1]||'',p=u[0].split('?')[0];
if(p===BASE||p===BASE+'/'){say('The chooser lives on the demo site. This file holds the '+${JSON.stringify(S.name)}+' preview only.');return}
var rest=p.slice(BASE.length+1),seg=rest.split('/'),s=seg[0],path=seg.slice(1).join('/').replace(/\\/$/,'');
if(s!==SITE){say('Each preview is its own file: open the '+OTHER.join(' or ')+' file to see that site.');return}
show(path,hash)}
window.addEventListener('message',function(e){if(e.source!==frame.contentWindow)return;var d=e.data;if(d&&typeof d.am01==='string')route(d.am01)});
function start(){var p=(location.hash||'').slice(1);if(p==='home')p='';show(D.pages[p]!=null?p:'')}
try{var bin=atob(document.getElementById('am01data').textContent.trim()),u8=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
var ds=new DecompressionStream('gzip');new Response(new Blob([u8]).stream().pipeThrough(ds)).text().then(function(t){D=JSON.parse(t);start()}).catch(function(){msg.textContent='This preview needs a newer browser (iPhone: iOS 16.4 or later).'})}
catch(e){msg.textContent='This preview needs a newer browser (iPhone: iOS 16.4 or later).'}
})();
</script>
</body>
</html>
`;
writeFileSync(out, html);
const kb = (n) => `${Math.round(n / 1024)} kB`;
console.log(`${site}: ${out} — ${kb(Buffer.byteLength(html))} (${Object.keys(pages).length} pages, ${assets.size} assets, images at ${IMG}w, text ${kb(payload.length)} base64-gzip)`);
