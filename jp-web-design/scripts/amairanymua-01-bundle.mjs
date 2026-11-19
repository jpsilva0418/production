#!/usr/bin/env node
/* Packs one built Amairany site into ONE self-contained HTML file, for sharing a preview
   where a link cannot go: a chat attachment, an email, a phone's file viewer.

       node scripts/amairanymua-01-build.mjs
       node scripts/amairanymua-01-bundle.mjs <site id> <out.html> [--img 480|800]

   Everything the site needs travels inside the file: the pages, their stylesheets and scripts,
   the fonts, her photographs and her clips (as data URIs; clips re-encoded to 360 wide, whole,
   so a preview file stays small enough to send). Page text is gzip-compressed and
   unpacked in the browser (DecompressionStream; iPhone iOS 16.4+). The pages run in a
   full-screen frame; tapping a link to another page of the same site swaps the page inside
   the file, so the whole site can be clicked through offline. Links to her booking pages and
   Instagram open outside. Links to the other two previews show a short note, because each
   preview is its own file.

   Some pages build an image address in script (Darkroom's viewer and enlarger: base + photo +
   size). Those addresses never appear in the page text, so the file also carries a small map
   from each packed asset's address (every size it stands for) to its packed copy, and each page
   carries its own copies of the images (a sandboxed viewer cannot reach the outer file), and
   resolves addresses set in script through them: img src, data-* stage addresses and background
   images. A site's precomputed develop stages (assets/<site>/dev/) are packed whole for that
   reason.

   Nothing is fetched and nothing is sent: the file makes no network request of its own. It
   reads only the built pages in public/demo/amairanymua-01/ and writes only <out.html>. */
import { readFileSync, writeFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { gzipSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE, SITES, SITE, pagesOf } from './amairanymua-01/site.mjs';

const [site, out] = process.argv.slice(2);
/* --lite: a file small enough for chat viewers that refuse big attachments (~2 MB): photos at
   phone width, each clip's last 6 s (her clips end on the finished look) at 240 wide */
const LITE = process.argv.includes('--lite');
/* --sizes <json>: how wide each image family is really drawn (phone CSS px x2, desktop x1), measured
   in a browser. With it, --lite carries every photo at the sharpness it needs instead of one small
   width for all (a 360-wide photo stretched across a phone screen looked blurry: founder, 2026-11-19). */
const SIZES = process.argv.includes('--sizes') ? JSON.parse(readFileSync(process.argv[process.argv.indexOf('--sizes') + 1], 'utf8')) : null;
const familyOf = (url) => url.replace(/-\d+\.(?:webp|jpe?g|png)$/, '');
/* the largest file of an image family on disk (name-480.webp, name-800.webp, ...) */
const largestOf = (url) => {
  const fam = familyOf(url);
  if (fam === url) return { file: fileOf(url), w: 0 };
  const dir = dirname(fileOf(url)), base = fam.split('/').pop();
  let best = null;
  for (const f of readdirSync(dir)) { const m = f.match(/^(.*)-(\d+)\.(webp|jpe?g|png)$/); if (m && m[1] === base && (!best || +m[2] > best.w)) best = { file: join(dir, f), w: +m[2] }; }
  return best || { file: fileOf(url), w: 0 };
};
const IMG = process.argv.includes('--img') ? process.argv[process.argv.indexOf('--img') + 1] : (LITE ? '480' : '800');
if (!SITES[site] || !out) { console.error(`usage: node scripts/amairanymua-01-bundle.mjs <${Object.keys(SITES).join('|')}> <out.html> [--img 480|800] [--lite [--sizes measured.json]]`); process.exit(1); }
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
/* a prebuilt site ships several sizes of one photograph (name.HASH_variant.webp): pack one copy of each */
const sameImage = new Map();
const token = (url) => {
  url = pickWidth(url);
  const fam = url.match(/\/([A-Za-z0-9-]+\.[A-Za-z0-9_-]{8})(?:_[A-Za-z0-9]+)?\.(?:webp|jpe?g|png)$/);
  if (fam && url.includes('/assets/') && !url.includes(`${BASE}/assets/`)) { const k = fam[1]; if (sameImage.has(k)) url = sameImage.get(k); else sameImage.set(k, url); }
  if (!assets.has(url)) {
    const f = fileOf(url);
    if (!existsSync(f)) throw new Error(`missing asset ${url}`);
    const ext = url.split('.').pop().toLowerCase();
    const t = `@@A${assets.size}@@`;
    assets.set(url, t);
    let bytes = readFileSync(f), mime = MIME[ext] || 'application/octet-stream';
    if (ext === 'mp4') {
      // her clips ride inside the file whole (the finished look is often at the end) at phone-preview size: 360 wide, silent
      const tmp = join(tmpdir(), `am01-${process.pid}-${assets.size}.mp4`);
      execFileSync('ffmpeg', LITE
        ? ['-v', 'error', '-y', '-sseof', '-6', '-i', f, '-an', '-vf', 'scale=240:-2,fps=24', '-c:v', 'libx264', '-preset', 'slow', '-crf', '40', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', tmp]
        : ['-v', 'error', '-y', '-i', f, '-an', '-vf', 'scale=360:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '34', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', tmp]);
      bytes = readFileSync(tmp); rmSync(tmp, { force: true });
    }
    if (LITE && SIZES && /^(webp|jpe?g|png)$/.test(ext)) {
      const src = largestOf(url), want = SIZES[familyOf(url)];
      const target = Math.max(160, Math.min(want || 360, 1100));
      bytes = execFileSync('python3', ['-I', '-c', 'import sys,io\nfrom PIL import Image\nim=Image.open(sys.argv[1])\nhas_a=im.mode in ("RGBA","LA")\nim=im.convert("RGBA" if has_a else "RGB")\nw=min(im.width,int(sys.argv[2]))\nim=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS) if w<im.width else im\nb=io.BytesIO();im.save(b,"WEBP",quality=76,method=6);sys.stdout.buffer.write(b.getvalue())', src.file, String(target)], { maxBuffer: 64 * 1024 * 1024 });
      mime = 'image/webp';
    } else if (LITE && /^(webp|jpe?g)$/.test(ext) && bytes.length > 14 * 1024) {
      const hero = /artist-chair/.test(url); /* her portrait is a hero centrepiece: keep it sharper */
      bytes = execFileSync('python3', ['-I', '-c', 'import sys,io\nfrom PIL import Image\nim=Image.open(io.BytesIO(sys.stdin.buffer.read()))\nhas_a=im.mode in ("RGBA","LA")\nim=im.convert("RGBA" if has_a else "RGB")\nw=min(im.width,' + (hero ? 480 : 360) + ')\nim=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)\nb=io.BytesIO();im.save(b,"WEBP",quality=' + (hero ? 74 : 60) + ',method=6);sys.stdout.buffer.write(b.getvalue())'], { input: bytes, maxBuffer: 64 * 1024 * 1024 });
      mime = 'image/webp';
    } else if (/^(webp|jpe?g|png)$/.test(ext) && bytes.length > 110 * 1024) {
      // too heavy for a single-file preview: re-encode at phone size (Pillow), keeping the picture as is
      bytes = execFileSync('python3', ['-I', '-c', 'import sys,io\nfrom PIL import Image\nim=Image.open(io.BytesIO(sys.stdin.buffer.read()))\nim=im.convert("RGB")\nw=min(im.width,820)\nim=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)\nb=io.BytesIO();im.save(b,"WEBP",quality=74,method=6);sys.stdout.buffer.write(b.getvalue())'], { input: bytes, maxBuffer: 64 * 1024 * 1024 });
      mime = 'image/webp';
    }
    assetData[t] = `data:${mime};base64,${bytes.toString('base64')}`;
  }
  return assets.get(url);
};
const ASSET_RE = new RegExp(`${BASE.replace(/[/.]/g, '\\$&')}/(?:[a-z]+/)?assets/[A-Za-z0-9_./-]+\\.(?:webp|jpg|jpeg|png|svg|woff2|mp4)`, 'g');
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
      return new RegExp(`^${BASE}/(?:[a-z]+/)?assets/`).test(abs) ? `url("${token(abs)}")` : m;
    });
    css[url] = tokenize(t);
  }
  return url;
};
const jsText = (url) => { if (js[url] === undefined) js[url] = tokenize(readFileSync(fileOf(url), 'utf8')); return url; };

/* ---- the pages ---- */
const pages = {};
for (const path of pagesOf(site)) {
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

/* ---- addresses built in script: pack the site's develop stages whole, then map every packed
   address (and the other sizes it stands for) to its token ---- */
const devDir = join(DEMO, 'assets', site, 'dev');
if (existsSync(devDir)) for (const f of readdirSync(devDir)) if (f.endsWith(`-${IMG}.webp`)) token(`${BASE}/assets/${site}/dev/${f}`);
const urlMap = {};   /* token ids without their @@ marks, or the page fill would replace them */
for (const [url, tok] of assets) {
  const t = tok.slice(2, -2);
  urlMap[url] = t;
  const m = url.match(/^(.*)-(?:480|800|1280)\.webp$/);
  if (m) for (const w of ['480', '800', '1280']) if (!urlMap[`${m[1]}-${w}.webp`]) urlMap[`${m[1]}-${w}.webp`] = t;
}
/* the images themselves travel inside each page too: a locked-down viewer (a sandboxed frame
   without same-origin) cannot reach the outer file's copies, so the page carries its own. The
   page fill turns each "@@An@@" below into that image's data URI. Images only: fonts and
   stylesheet art never have their address built in script. */
const imgCopies = Object.fromEntries([...new Set(Object.entries(urlMap).filter(([u]) => /\.(?:webp|jpe?g|png)$/.test(u)).map(([, t]) => t))].map((t) => [t, `@@${t}@@`]));

/* ---- what runs inside every page: storage stand-in, link handling, hash scroll ---- */
const INJECT = `<script>(function(){var P=window.parent!==window?window.parent:null;
function mem(n){var s;try{s=P&&P.__am01store&&P.__am01store[n]}catch(e){}if(!s){s={}}return{getItem:function(k){return Object.prototype.hasOwnProperty.call(s,k)?s[k]:null},setItem:function(k,v){s[k]=String(v)},removeItem:function(k){delete s[k]},clear:function(){for(var k in s)delete s[k]},key:function(i){return Object.keys(s)[i]||null},get length(){return Object.keys(s).length}}}
['sessionStorage','localStorage'].forEach(function(n){var ok=false;try{window[n].setItem('__t','1');window[n].removeItem('__t');ok=true}catch(e){}if(!ok){try{Object.defineProperty(window,n,{value:mem(n),configurable:true})}catch(e){}}});
document.addEventListener('click',function(e){if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');if(!h||h.charAt(0)==='#')return;
if(h.indexOf(${JSON.stringify(BASE)})===0||/^https?:|^mailto:/.test(h)){e.preventDefault();try{P.postMessage({am01:h},'*')}catch(x){}}},false);
/* a sandboxed viewer may block form submission outright (no submit event at all); the inquiry
   never submits anywhere, so its step button is turned into a plain submit EVENT here */
document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('button[type="submit"],input[type="submit"]');if(!b||!b.form)return;e.preventDefault();var ev;try{ev=new SubmitEvent('submit',{bubbles:true,cancelable:true,submitter:b})}catch(x){ev=new Event('submit',{bubbles:true,cancelable:true})}b.form.dispatchEvent(ev)},true);
var go=function(){var id=window.__am01hash;if(id){var el=document.getElementById(id);if(el)el.scrollIntoView()}};document.addEventListener('DOMContentLoaded',function(){setTimeout(go,60)});
/* addresses set in script resolve to the packed copies (see the header); a packed copy read back
   from src or a data-* stage attribute reads as its address, so code that edits the address works */
(function(){var AA=${JSON.stringify(imgCopies)},B=${JSON.stringify(BASE)},M=${JSON.stringify(urlMap)},R=new Map();
var at=function(t){var d=t&&AA[t];return d&&d.charCodeAt(0)===100?d:null};
Object.keys(M).forEach(function(u){var d=at(M[u]);if(d&&!R.has(d))R.set(d,u)});
var fw=function(u){if(typeof u!=='string'||u.indexOf(B)<0)return u;var d=at(M[u.split(/[?#]/)[0]]);return d||u};
var fwCss=function(v){return typeof v==='string'&&v.indexOf(B)>-1?v.replace(/url\\((['"]?)([^'")]+)\\1\\)/g,function(m,q,u){return 'url("'+fw(u)+'")'}):v};
var NAMES={src:1,'data-src':1,'data-l':1,'data-m':1,poster:1};
var sa=Element.prototype.setAttribute,ga=Element.prototype.getAttribute,ra=Element.prototype.removeAttribute;
Element.prototype.setAttribute=function(n,v){var k=String(n).toLowerCase();
if(k==='srcset'&&(v==null||v==='null'||String(v).indexOf(B)>-1)){ra.call(this,'srcset');return}
if(NAMES[k]){v=fw(v);if(k==='src'&&(this.tagName==='SOURCE'||this.tagName==='VIDEO'))v=vid(v)}else if(k==='style')v=fwCss(v);return sa.call(this,n,v)};
Element.prototype.getAttribute=function(n){var v=ga.call(this,n);if(v&&v.length>64&&v.charCodeAt(0)===100&&NAMES[String(n).toLowerCase()]&&R.has(v))return R.get(v);return v};
var wrap=function(proto,prop,f){var d=Object.getOwnPropertyDescriptor(proto,prop);if(!d||!d.set)return;Object.defineProperty(proto,prop,{configurable:true,enumerable:d.enumerable,get:d.get,set:function(v){d.set.call(this,f(v,this))}})};
wrap(HTMLImageElement.prototype,'src',function(v){return fw(v)});
wrap(HTMLImageElement.prototype,'srcset',function(v,el){return (v==null||String(v).indexOf(B)>-1)?'':v});
/* clips: a data: video becomes an in-memory blob before it plays (iPhone Safari is unreliable with
   data: video); one blob per clip, made only when a page asks for that clip */
var BC=new Map(),vid=function(v){if(typeof v!=='string'||v.indexOf('data:video/')!==0)return v;var h=v.indexOf('#'),frag=h>-1&&!${LITE}?v.slice(h):'',d=h>-1?v.slice(0,h):v;if(BC.has(d))return BC.get(d)+frag;try{var b=atob(d.slice(d.indexOf(',')+1)),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);var url=URL.createObjectURL(new Blob([u],{type:'video/mp4'}));BC.set(d,url);return url+frag}catch(e){return v}};
if(window.HTMLSourceElement)wrap(HTMLSourceElement.prototype,'src',function(v){return vid(fw(v))});
if(window.HTMLVideoElement)wrap(HTMLVideoElement.prototype,'src',function(v){return vid(fw(v))});
/* clips written straight into the page (a src already in the markup) get the same treatment */
document.addEventListener('DOMContentLoaded',function(){[].forEach.call(document.querySelectorAll('source[src^="data:video/"],video[src^="data:video/"]'),function(el){var v=el.tagName==='VIDEO'?el:el.parentNode,was=v&&!v.paused;el.src=ga.call(el,'src');if(v&&v.load){v.load();if(was){var p=v.play();if(p&&p.catch)p.catch(function(){})}}})});
if(window.HTMLVideoElement)wrap(HTMLVideoElement.prototype,'poster',function(v){return fw(v)});
/* style properties set in script (el.style.backgroundImage = ...) are per-element accessors in
   Chromium, so they are caught after the fact: the rewrite lands before the next style pass */
new MutationObserver(function(ms){ms.forEach(function(m){var t=m.target,v=ga.call(t,'style');if(v&&v.indexOf(B)>-1)sa.call(t,'style',fwCss(v))})}).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['style']});
var sp=CSSStyleDeclaration.prototype.setProperty;CSSStyleDeclaration.prototype.setProperty=function(n,v,pr){return sp.call(this,n,fwCss(v),pr)};
})();})();</script>`;

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
function route(href){var m=href.match(/^https?:|^mailto:/);if(m){/* straight to the site, in the same window, as the live site does; a new window only if the viewer forbids that */var ok=false;try{window.top.location.href=href;ok=true}catch(e){}if(!ok){var w=null;try{w=window.open(href,'_blank','noopener')}catch(e){}if(!w)say('Links to her booking pages open outside this preview file.')}return}
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
