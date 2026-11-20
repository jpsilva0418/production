// Builds the three home-page variations.
//   node src/build.mjs            → dist/site/   (linked, srcset'd assets) + dist/preview/ (self-contained files)
//   node src/build.mjs --publish  → the demo library: jp-web-design/public/demo/luciana-alvarenga-01/
//                                   media in the append-only store /demo/_shared/luciana-alvarenga/
//   Live link after the site deploys: https://jpsilvadigital.com/demo/luciana-alvarenga-01
import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dict, quotes as Q, wa, waService, WA_DEFAULT, IG } from './content.mjs';
import { EXTRA, bodyIV, bodyV, CSS_IV, CSS_V, policyList } from './fresh.mjs';
Object.assign(dict.pt, EXTRA.pt); Object.assign(dict.en, EXTRA.en);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLISH = process.argv.includes('--publish');
const SLUG = 'luciana-alvarenga-01';
const LIB = join(ROOT, '..', 'jp-web-design', 'public', 'demo');
const SHARED = join(LIB, '_shared', 'luciana-alvarenga');
const DEMO_BASE = 'https://jpsilvadigital.com/demo/' + SLUG;
// assets/ is local (rebuilt by scripts/media.sh from the client zips); once published,
// the shared store in the demo library is the canonical copy.
const A = existsSync(join(ROOT, 'assets')) ? join(ROOT, 'assets') : SHARED;
const CSS = readFileSync(join(ROOT, 'src/styles.css'), 'utf8');
const JS = readFileSync(join(ROOT, 'src/runtime.js'), 'utf8');

/* ---------------- asset registry ---------------- */
const dims = {};
for (const f of readdirSync(join(A, 'img'))) {
  const [w, h] = execFileSync('identify', ['-format', '%w %h', join(A, 'img', f)]).toString().split(' ').map(Number);
  dims[f] = { w, h };
}
const mime = (f) => f.endsWith('.webp') ? 'image/webp' : f.endsWith('.mp4') ? 'video/mp4' : f.endsWith('.woff2') ? 'font/woff2' : f.endsWith('.jpg') ? 'image/jpeg' : 'application/octet-stream';
const b64cache = {};
let MODE = 'site'; // 'site' | 'inline' | 'publish'
let INLINE = false;
const url = (rel) => {
  if (MODE === 'publish') return `/demo/_shared/luciana-alvarenga/${rel}`;
  if (!INLINE) return `assets/${rel}`;
  return (b64cache[rel] ??= `data:${mime(rel)};base64,${readFileSync(join(A, rel)).toString('base64')}`);
};
const variantHref = (v) => MODE === 'publish' ? `/demo/${SLUG}${v.path}` : `${v.slug}.html`;
const widthsOf = (name) => [480, 800, 1280].filter((w) => dims[`${name}-${w}.webp`]);
// Each result's own Instagram post (from media-manifest.csv)
const IGP = { r01: 'p/Dcm7enauTBH', r03: 'p/DQ3LJBKjp9f', r04: 'p/DSQZswTgTCL', r05: 'p/DSVyg_RgRcE', r06: 'p/DdNgqMoDmbI', r07: 'p/Da4ID5qOwPX',
  r08: 'p/DRtbe7Jjm8x', r09: 'p/DT4Gj8hjCiT', r11: 'p/DelNi2njq65', r14: 'p/DO2T6gPjPVP', r16: 'p/DIIZHcDR0Bb', r17: 'p/Dd0PMlojj1s', r18: 'p/DdVV32hDsFn',
  r19: 'p/Da4JAUJuQ40', masculino: 'p/DNPQFUXRMBT', 'studio-room': 'p/Df7ft4VILvj', 'studio-mirror': 'p/Df7ft4VILvj', 'studio-cart': 'p/Df7ft4VILvj', 'studio-lounge': 'p/Df7ft4VILvj',
  'v01-lamination': 'reel/DRZ-SbADkVR', 'v03-six-weeks': 'reel/DIFzpwmxwI5', 'v04-process': 'reel/DNw5lKcWAK8', 'v05-lash': 'reel/DQ3Kg65jtlj', 'v06-lash': 'reel/DSVx4yWAaVI' };
const igAttr = (n) => IGP[n] ? ` data-ig="https://www.instagram.com/${IGP[n]}/"` : '';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function img(name, { alt = '', sizes = '100vw', cls = '', eager = false, inlineW = 800, pos = '' } = {}) {
  const ws = widthsOf(name);
  if (!ws.length) throw new Error('missing image ' + name);
  const pick = INLINE ? (ws.filter((w) => w <= inlineW).pop() ?? ws[0]) : ws[ws.length - 1];
  const { w, h } = dims[`${name}-${pick}.webp`];
  const srcset = INLINE ? '' : ` srcset="${ws.map((x) => `${url(`img/${name}-${x}.webp`)} ${x}w`).join(', ')}" sizes="${sizes}"`;
  const load = eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy" decoding="async"';
  const style = pos ? ` style="object-position:${pos}"` : '';
  return `<img${igAttr(name)}${cls ? ` class="${cls}"` : ''} src="${url(`img/${name}-${pick}.webp`)}"${srcset} width="${w}" height="${h}" alt="${esc(alt)}"${load}${style}>`;
}
function vid(name, { label = '', cls = '', loop = true, pos = '' } = {}) {
  const style = pos ? ` style="object-position:${pos}"` : '';
  return `<video${igAttr(name)}${cls ? ` class="${cls}"` : ''} muted autoplay playsinline webkit-playsinline${loop ? ' loop' : ''} preload="none" disablepictureinpicture poster="${url(`video/${name}-poster.webp`)}" data-src="${url(`video/${name}.mp4`)}"${label ? ` aria-label="${esc(label)}"` : ' aria-hidden="true"'}${style}></video>`;
}

/* ---------------- i18n helpers ---------------- */
const T = (key, tag = 'span', attrs = '') => `<${tag} data-i18n="${key}"${attrs ? ' ' + attrs : ''}>${dict.pt[key]}</${tag}>`;
const t = (key) => dict.pt[key];
const quote = (q, cls = '', tag = 'p') => `<${tag} class="${cls}"><span class="q">${q.pt}</span><span class="tr">${q.en}</span></${tag}>`;

/* ---------------- logo (recreated — replace with the vector) ---------------- */
let lgN = 0;
const STAR = 'M0 -7C.9-1 1-.9 7 0C1 .9.9 1 0 7C-.9 1-1 .9-7 0C-1-.9-.9-1 0-7Z';
function mark(tone) {
  const id = `lg${++lgN}`;
  const [a, b] = tone === 'light' ? ['#FEE8B0', '#C9A06E'] : ['#B08F66', '#7A572C'];
  return {
    id,
    defs: `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`,
    body: `<path d="M50 96A72 72 0 0 1 190 96" fill="none" stroke="url(#${id})" stroke-width="1.1"/>
      <text x="92" y="122" text-anchor="middle" font-family="'Bodoni Moda',Didot,Georgia,serif" font-size="98" fill="url(#${id})">L</text>
      <text x="139" y="126" text-anchor="middle" font-family="'Bodoni Moda',Didot,Georgia,serif" font-size="88" fill="url(#${id})">A</text>
      <path d="M40 100C70 74 100 78 122 90S164 112 200 80" fill="none" stroke="url(#${id})" stroke-width="1.7" stroke-linecap="round"/>
      <path d="M58 104C86 90 106 92 124 99" fill="none" stroke="url(#${id})" stroke-width=".8" stroke-linecap="round" opacity=".8"/>`,
  };
}
function logoFull(tone = 'light', title = 'Studio Luciana Alvarenga — Designer de Sobrancelhas') {
  const m = mark(tone); const ink = tone === 'light' ? 'currentColor' : '#312017';
  return `<!-- recreated, replace with the vector --><svg viewBox="0 0 480 262" role="img" aria-label="${title}"><defs>${m.defs}</defs>
    <g transform="translate(120 0)">${m.body}</g>
    <text x="240" y="196" text-anchor="middle" font-family="Cinzel,'Trajan Pro',Georgia,serif" font-size="22" letter-spacing="5.2" fill="${ink}">STUDIO LUCIANA ALVARENGA</text>
    <text x="240" y="224" text-anchor="middle" font-family="Cinzel,'Trajan Pro',Georgia,serif" font-size="12" letter-spacing="5.4" fill="url(#${m.id})">DESIGNER DE SOBRANCELHAS</text>
    <path d="M150 246H226M254 246H330" stroke="url(#${m.id})" stroke-width=".8"/><path transform="translate(240 246)" d="${STAR}" fill="url(#${m.id})"/></svg>`;
}
function logoH(tone = 'light') {
  const m = mark(tone); const ink = tone === 'light' ? 'currentColor' : '#312017';
  return `<!-- recreated, replace with the vector --><svg viewBox="0 0 372 96" role="img" aria-label="Studio Luciana Alvarenga"><defs>${m.defs}</defs>
    <g transform="translate(-20 -26) scale(.82)">${m.body}</g>
    <text x="178" y="47" font-family="Cinzel,'Trajan Pro',Georgia,serif" font-size="15.5" letter-spacing="3.2" fill="${ink}">STUDIO LUCIANA</text>
    <text x="178" y="69" font-family="Cinzel,'Trajan Pro',Georgia,serif" font-size="15.5" letter-spacing="3.2" fill="${ink}">ALVARENGA</text>
    <path d="M178 84H372" stroke="url(#${m.id})" stroke-width=".8" opacity=".7"/></svg>`;
}
const favicon = () => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1A0E0C"/><text x="25" y="46" text-anchor="middle" font-family="Didot,Bodoni 72,Georgia,serif" font-size="40" fill="#E9C6A1">L</text><text x="40" y="48" text-anchor="middle" font-family="Didot,Bodoni 72,Georgia,serif" font-size="34" fill="#E9C6A1">A</text><path d="M8 40C20 30 30 32 36 37S48 44 58 32" fill="none" stroke="#E9C6A1" stroke-width="1.6"/></svg>`);
const swash = () => `<svg class="swash" viewBox="0 0 420 40" aria-hidden="true"><path d="M6 26C70 4 130 6 190 20S300 38 360 16C380 9 398 10 414 14"/><path class="star" transform="translate(210 22) scale(.9)" d="${STAR}"/></svg>`;

/* ---------------- variations ---------------- */
const VARIANTS = [
  { n: 1, path: '', slug: 'variacao-1-champagne-glow', name: 'Champagne Glow', roman: 'I', hero: 'cinema', h: 'v1',
    tones: { artist: 'lt', runway: 'alt', sig: 'dk', svc: 'lt', lash: 'alt', studio: 'fade', pol: 'lt', depo: 'alt' },
    note: 'A direção do briefing: vídeo cinematográfico, porcelana e noir.' },
  { n: 2, path: '/noir-dourado', slug: 'variacao-2-noir-dourado', name: 'Noir Dourado', roman: 'II', hero: 'split', h: 'v2',
    tones: { artist: 'alt', runway: 'dk', sig: 'lt', svc: 'dk2', lash: 'alt', studio: 'dk', pol: 'lt', depo: 'alt' },
    note: 'Noturna e editorial: noir dominante, Bodoni itálico, vídeo em tela dividida.' },
  { n: 3, path: '/atelier-porcelana', slug: 'variacao-3-atelier-porcelana', name: 'Atelier Porcelana', roman: 'III', hero: 'arch', h: 'v3',
    tones: { artist: 'lt', runway: 'alt', sig: 'dk', svc: 'lt', lash: 'alt', studio: 'lt', pol: 'alt', depo: 'lt' },
    note: 'Luminosa: o arco da sua marca como portal do vídeo, como no render "VEM AÍ".' },
  { n: 4, path: '/preto-e-branco', slug: 'variacao-4-preto-e-branco', name: 'Preto & Branco', roman: 'IV', hero: 'mono', h: 'v1',
    tones: { artist: 'lt', runway: 'alt', sig: 'dk', svc: 'lt', lash: 'alt', studio: 'lt', pol: 'lt', depo: 'alt' },
    note: 'Básica e atemporal: branco puro, preto e um fio de dourado. Nada de cor forte.' },
  { n: 5, path: '/rose', slug: 'variacao-5-rose', name: 'Rosé', roman: 'V', hero: 'mosaic', h: 'v2',
    tones: { artist: 'alt', runway: 'lt', sig: 'dk', svc: 'alt', lash: 'lt', studio: 'dk', pol: 'alt', depo: 'lt' },
    note: 'Diferente em tudo: rosé e vinho suaves, mosaico de vídeo, cantos arredondados, outra tipografia.' },
];

const VARIANT_CSS = {
  1: ``,
  2: `
:root{--engraved:'Marcellus','Trajan Pro',Georgia,serif}
.disp,.mlb,.finale-c h2,.sig-quote{font-style:italic}
.hero--split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.08fr);text-align:left;place-items:stretch}
.hero--split .hero-c{display:flex;flex-direction:column;justify-content:center;padding:clamp(7rem,16vh,9rem) clamp(2rem,5vw,5.5rem) clamp(5rem,10vh,6rem) max(5vw,calc((100vw - var(--wrapv))/2));position:relative;z-index:5}
.hero--split .hero-media{position:relative;inset:auto;min-height:100svh;border-left:1px solid var(--hairdk-strong)}
.hero--split .hero-media::after{content:"";position:absolute;inset:0;z-index:2;background:linear-gradient(90deg,rgba(26,14,12,.7),rgba(26,14,12,.12) 34%,rgba(26,14,12,.08) 70%,rgba(26,14,12,.42)),linear-gradient(rgba(26,14,12,.35),rgba(26,14,12,0) 30%,rgba(26,14,12,0) 70%,rgba(26,14,12,.55))}
.hero--split .hero-h{text-indent:0;letter-spacing:.1em;font-size:clamp(1.9rem,4.2vw,4.1rem);font-style:normal;line-height:1.14}
.hero--split .hero-h .lo:nth-child(2) .li{font-style:italic;text-transform:none;letter-spacing:.02em;color:var(--champagne)}
.hero--split .hero-it{margin-left:0}
.hero--split .hero-cta{justify-content:flex-start}
.hero--split .hero-kick{margin-bottom:1.8rem}
.hero--split .hero-cue{left:max(5vw,calc((100vw - var(--wrapv))/2));transform:none;align-items:flex-start}
.hero--split .hero-cue span{text-indent:0}
.hero-frame{position:absolute;inset:clamp(18px,2.4vw,34px);z-index:4;border:1px solid rgba(233,198,161,.32);pointer-events:none}
@media(max-width:899px){
  .hero--split{display:block;text-align:center}
  .hero--split .hero-media{position:absolute;inset:0;min-height:0;border:0}
  .hero--split .hero-media::after{background:linear-gradient(rgba(26,14,12,.66),rgba(26,14,12,.4) 42%,rgba(26,14,12,.5) 66%,rgba(26,14,12,.84))}
  .hero--split .hero-c{min-height:100svh;padding:7rem 6vw 6rem;align-items:center}
  .hero--split .hero-cta{justify-content:center}
  .hero--split .hero-cue{left:50%;transform:translateX(-50%);align-items:center}
  .hero--split .hero-h{text-indent:.1em}
}`,
  3: `
.hero--arch{background:radial-gradient(70% 60% at 50% 46%,#FBF4EA 0%,var(--porcelain) 55%,#EFE3D4 100%);color:var(--cocoa);padding:0}
.hero--arch .hero-c{padding:clamp(6.4rem,13vh,8rem) 5vw clamp(4.6rem,9vh,6rem)}
.arch-stage{--aw:clamp(230px,25vw,380px);display:grid;grid-template-columns:1fr var(--aw) 1fr;align-items:center;column-gap:clamp(1.4rem,3.4vw,3.6rem);width:var(--wrapv);margin:0 auto}
.arch-stage .hero-h{grid-row:1;grid-column:1/-1;display:grid;grid-template-columns:1fr var(--aw) 1fr;column-gap:inherit;align-items:center;
  color:var(--cocoa);font-size:clamp(1.25rem,2.3vw,2.35rem);letter-spacing:.16em;text-indent:0;line-height:1.36}
.arch-stage .hero-h .lo:nth-child(1){grid-column:1;text-align:right}
.arch-stage .hero-h .lo:nth-child(2){grid-column:3;text-align:left;font-style:italic}
.portal{grid-row:1;grid-column:2;position:relative;z-index:2;opacity:0;animation:fadeUp 1.4s var(--ease) .5s both}
.portal-in{position:relative;aspect-ratio:3/4.3;border-radius:999px 999px 0 0;overflow:hidden;clip-path:inset(-14px round 999px 999px 0 0);background:var(--noir);
  box-shadow:0 0 0 1px rgba(176,143,102,.55),0 0 0 10px rgba(246,239,230,.9),0 0 0 11px rgba(176,143,102,.45),0 0 60px 14px rgba(254,232,176,.55),0 40px 80px -30px rgba(49,32,23,.45)}
.portal-in img,.portal-in video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 38%;filter:saturate(.84) sepia(.1) contrast(1.02)}
.portal-in video{opacity:0;transition:opacity 1.4s ease}.portal-in video.on{opacity:1}
.portal-in::after{content:"";position:absolute;inset:0;z-index:2;background:radial-gradient(90% 70% at 50% 40%,rgba(26,14,12,0) 55%,rgba(26,14,12,.35) 100%)}
.portal-glow{position:absolute;inset:-18% -40%;z-index:-1;background:radial-gradient(50% 45% at 50% 45%,rgba(254,232,176,.75),rgba(233,198,161,.25) 45%,rgba(246,239,230,0) 70%);animation:glowBreath 9s ease-in-out infinite alternate}
.hero--arch .hero-kick{margin-bottom:clamp(1.6rem,3.4vh,2.6rem)}
.hero--arch .hero-it{color:var(--cocoa-soft);margin-top:clamp(2rem,4vh,3rem)}
.hero--arch .tlk{color:var(--gold-text)}.hero--arch .tlk:hover{color:var(--cocoa)}
.hero--arch .hero-cue span{color:var(--gold-text)}.hero--arch .hero-cue i{background:linear-gradient(var(--gold),rgba(176,143,102,0))}
.hero--arch .script-sig{font-family:var(--scriptf);font-size:clamp(1.6rem,2.6vw,2.2rem);color:var(--gold-text);margin-top:.6rem}
.rw-fig:not(.rw-reel) .ph{border-radius:200px 200px 0 0;outline:0;clip-path:inset(0 round 200px 200px 0 0)}
.hero--arch .hero-cue{display:none}
.svc .ph{border-radius:999px 999px 0 0;aspect-ratio:4/4.4;clip-path:inset(0 round 999px 999px 0 0)}
.studio-row .ph{border-radius:999px 999px 0 0;clip-path:inset(0 round 999px 999px 0 0);outline:0}
@media(max-width:899px){
  .arch-stage{display:flex;flex-direction:column;align-items:center;--aw:min(68vw,320px)}
  .arch-stage .hero-h{display:block;margin-bottom:2rem;font-size:clamp(1.2rem,5.4vw,1.7rem);letter-spacing:.14em}
  .arch-stage .hero-h .lo{text-align:center!important}
  .portal{width:var(--aw)}
}`,
};

/* ---------------- section builders ---------------- */
const HEADLINE = (v) => `<h1 class="hero-h"><span class="lo"><span class="li" data-i18n="h.${v.h}.1">${t(`h.${v.h}.1`)}</span></span><span class="lo"><span class="li" data-i18n="h.${v.h}.2">${t(`h.${v.h}.2`)}</span></span></h1>`;
// Opening screens use Luciana's own photoshoot — never the client close-up reels (they start mid-grin).
const HERO_IMG = { 1: ['luciana-blazer', '50% 16%'], 2: ['luciana-mirror', '50% 28%'], 3: ['luciana-portrait', '50% 30%'] };
const HERO_MEDIA = (v) => { const [n, pos] = HERO_IMG[v.n]; return img(n, { alt: 'Luciana Alvarenga, designer de sobrancelhas', eager: true, inlineW: 1280, sizes: '100vw', pos, cls: 'hero-still' }); };
const HERO_CTA = `<div class="ctas hero-cta"><a class="btnv btnv--solid" href="${WA_DEFAULT}" target="_blank" rel="noopener">${T('h.cta')}</a><a class="tlk" href="#resultados">${T('h.link')}</a></div>`;
const CUE = `<div class="hero-cue" aria-hidden="true">${T('h.cue')}<i></i></div>`;

function hero(v) {
  if (v.hero === 'cinema') return `
  <section class="hero hero--dark" id="inicio" aria-label="Início">
    <div class="hero-media" aria-hidden="true">${HERO_MEDIA(v)}</div>
    <div class="hero-scrim" aria-hidden="true"></div><i class="grain" aria-hidden="true"></i><i class="lx-glow" aria-hidden="true"></i>
    <div class="hero-c">
      <div class="hero-logo">${logoFull('light')}</div>
      ${HEADLINE(v)}
      <p class="hero-it" data-i18n="h.it">${t('h.it')}</p>
      ${HERO_CTA}
    </div>
    ${CUE}
  </section>`;
  if (v.hero === 'split') return `
  <section class="hero hero--split hero--dark tone-dk" id="inicio" aria-label="Início">
    <div class="hero-c">
      <p class="capsv hero-kick fade in" data-i18n="h.kick">${t('h.kick')}</p>
      ${HEADLINE(v)}
      <p class="hero-it" data-i18n="h.it">${t('h.it')}</p>
      ${HERO_CTA}
    </div>
    <div class="hero-media" aria-hidden="true">${HERO_MEDIA(v)}<i class="grain"></i><i class="lx-glow"></i><i class="hero-frame"></i></div>
    ${CUE}
  </section>`;
  if (v.hero === 'mono') return `
  <section class="hero hero--mono" id="inicio" aria-label="Início">
    <div class="mono-in">
      <div class="mono-copy">
        <p class="capsv hero-kick" data-i18n="h.kick">${t('h.kick')}</p>
        ${HEADLINE(v)}
        <p class="hero-it" data-i18n="h.it">${t('h.it')}</p>
        <div class="ctas hero-cta"><a class="btnv btnv--solid" href="${WA_DEFAULT}" target="_blank" rel="noopener">${T('h.cta')}</a><a class="tlk" href="#resultados">${T('h.link')}</a></div>
        <div class="mono-meta"><span>Studio Luciana Alvarenga</span><span>Goiânia · GO</span></div>
      </div>
      <div class="mono-media" aria-hidden="true">${HERO_MEDIA(v)}</div>
    </div>
  </section>`;
  if (v.hero === 'mosaic') return `
  <section class="hero hero--mosaic hero--dark" id="inicio" aria-label="Início">
    <div class="mos">
      <div class="t t1" aria-hidden="true">${HERO_MEDIA(v)}</div>
      <div class="t t2">${img('r11', { alt: 'Resultado de design de sobrancelhas e lash lifting', sizes: '(max-width:899px) 50vw, 36vw', eager: true })}<span class="mos-tag" data-i18n="r.7">${t('r.7')}</span></div>
      <div class="t t3">${img('r04', { alt: 'Resultado de lash lifting em close', sizes: '(max-width:899px) 50vw, 36vw', eager: true })}<span class="mos-tag" data-i18n="r.3">${t('r.3')}</span></div>
      <div class="mos-c">
        <p class="capsv hero-kick" style="color:var(--champagne)" data-i18n="h.kick">${t('h.kick')}</p>
        ${HEADLINE(v)}
        <p class="hero-it" data-i18n="h.it">${t('h.it')}</p>
        ${HERO_CTA}
      </div>
    </div>
  </section>`;
  return `
  <section class="hero hero--arch" id="inicio" aria-label="Início">
    <i class="lx-shaft" aria-hidden="true"></i>
    <div class="hero-c">
      <p class="kick kick--c hero-kick" data-i18n="h.kick">${t('h.kick')}</p>
      <div class="arch-stage">
        ${HEADLINE(v)}
        <div class="portal" aria-hidden="true"><i class="portal-glow"></i><div class="portal-in">${HERO_MEDIA(v)}<i class="grain"></i></div></div>
      </div>
      <p class="hero-it" data-i18n="h.it">${t('h.it')}</p>
      <div class="ctas hero-cta"><a class="btnv btnv--ink" href="${WA_DEFAULT}" target="_blank" rel="noopener">${T('h.cta')}</a><a class="tlk" href="#resultados">${T('h.link')}</a></div>
    </div>
    ${CUE}
  </section>`;
}

function artist(v) {
  const tone = v.tones.artist;
  const fig = v.n === 2
    ? `<div class="ph ph--framed rv">${img('luciana-portrait', { alt: 'Luciana Alvarenga, designer de sobrancelhas, segurando a pinça junto à sobrancelha', sizes: '(max-width:899px) 90vw, 560px', cls: 'lv' })}<i class="grain" aria-hidden="true"></i></div>`
    : `<div class="arch-fr rv"><div class="ph">${img(v.n === 3 ? 'luciana-seated' : 'luciana-portrait', { alt: 'Luciana Alvarenga, designer de sobrancelhas, segurando a pinça junto à sobrancelha', sizes: '(max-width:899px) 90vw, 560px', cls: 'lv' })}<i class="grain" aria-hidden="true"></i></div></div>`;
  return `
  <section class="sec tone-${tone} ghostwrap" id="artista" aria-labelledby="t-artista">
    ${tone === 'lt' ? '<i class="lx-shaft" aria-hidden="true"></i>' : ''}
    <div class="wrapv chap">
      <div class="chap-l rv">
        <p class="kick kick--short" data-i18n="a.kick">${t('a.kick')}</p>
        <h2 class="disp chap-t" id="t-artista" data-i18n="a.t">${t('a.t')}</h2>
        <a class="tlk" href="${WA_DEFAULT}" target="_blank" rel="noopener">${T('a.link')}&nbsp;&rarr;</a>
      </div>
      <div class="artist-r">
        <div class="artist-copy">
          ${quote(Q.image, 'lede ital rv')}
          <div class="body rv" style="--d:.08s">
            ${quote(Q.purpose, '')}
            <p data-i18n="a.p2">${t('a.p2')}</p>
          </div>
          <p class="cert fade" style="--d:.12s" data-i18n="a.cert">${t('a.cert')}</p>
          <p class="tags rv" style="--d:.16s" data-i18n="a.tags">${t('a.tags')}</p>
        </div>
        <figure class="artist-fig">
          ${fig}
          <figcaption class="cap fade" style="--d:.18s" data-i18n="a.cap">${t('a.cap')}</figcaption>
        </figure>
      </div>
    </div>
  </section>`;
}

function runway(v) {
  const card = (no, key, media, extra = '') => `<figure class="rw-fig${extra}"><div class="ph rv-im sheen">${media}<i class="shn" aria-hidden="true"></i></div><figcaption class="rw-plaque"><span class="n">No. ${no}</span> <span data-i18n="${key}">${t(key)}</span></figcaption></figure>`;
  const vcard = (no, key, media) => `<figure class="rw-fig"><div class="ph rv-im sheen">${media}<span class="vid-badge" data-i18n="r.vid">${t('r.vid')}</span><i class="shn" aria-hidden="true"></i></div><figcaption class="rw-plaque"><span class="n">No. ${no}</span> <span data-i18n="${key}">${t(key)}</span></figcaption></figure>`;
  const s = '(max-width:899px) 70vw, 340px';
  return `
  <section class="runway tone-${v.tones.runway}" id="resultados" aria-labelledby="t-res">
    <div class="rw-pin">
      <div class="rw-head">
        <div>
          <p class="caps-xs" data-i18n="r.kick">${t('r.kick')}</p>
          <h2 class="disp" id="t-res" data-i18n="r.t">${t('r.t')}</h2>
          <p class="ital" data-i18n="r.it">${t('r.it')}</p>
        </div>
        <p class="rw-count" data-i18n="r.count">${t('r.count')}</p>
      </div>
      <div class="rw-vp">
        <div class="rw-track" data-stag=".05">
          ${card('I', 'r.1', img('r01', { alt: 'Resultado de design de sobrancelhas com henna, em close', sizes: s }))}
          ${vcard('II', 'r.2', vid('v01-lamination', { label: 'Vídeo: resultado de brow lamination' }))}
          ${card('III', 'r.3', img('r04', { alt: 'Resultado de lash lifting nos cílios naturais, em close', sizes: s }))}
          ${card('IV', 'r.4', img('r09', { alt: 'Resultado de brow lamination no rosto da cliente', sizes: s }))}
          <figure class="rw-fig rw-reel"><div class="arch-fr rv"><div class="ph sheen">${vid('v05-lash', { label: 'Vídeo: resultado de lash lifting em close' })}<span class="vid-badge" data-i18n="r.vid">${t('r.vid')}</span><i class="grain" aria-hidden="true"></i><i class="shn" aria-hidden="true"></i></div></div><figcaption class="rw-plaque"><span class="n">No. V</span> <span data-i18n="r.5">${t('r.5')}</span></figcaption></figure>
          ${card('VI', 'r.6', img('r07', { alt: 'Close de brow lamination com os fios alinhados', sizes: s }))}
          ${card('VII', 'r.7', img('r11', { alt: 'Resultado de design de sobrancelhas e lash lifting', sizes: s }))}
          ${vcard('VIII', 'r.8', vid('v04-process', { label: 'Vídeo: o processo do design com tintura' }))}
          ${card('IX', 'r.9', img('r03', { alt: 'Lash lifting com a sobrancelha desenhada', sizes: s }))}
          ${card('X', 'r.10', img('r19', { alt: 'Resultado de brow lamination com tintura', sizes: s }))}
          <a class="rw-end" href="${IG}" target="_blank" rel="noopener">
            <p class="disp" data-i18n="r.end">${t('r.end')}</p>
            <p class="handle">@studiolucianaalvarenga</p>
            <span class="tlk">${T('r.endl')}</span>
          </a>
        </div>
      </div>
    </div>
  </section>`;
}

function signature(v) {
  const tone = v.tones.sig;
  return `
  <div class="chapslate tone-${tone} fade" role="presentation"><span class="cs-t"><b>✦</b><span data-i18n="s.slate">${t('s.slate')}</span><b>✦</b></span></div>
  <section class="sec tone-${tone}" id="brow-lamination" aria-labelledby="t-sig" style="padding-top:clamp(40px,6vw,90px)">
    ${tone === 'dk' ? '<i class="lx-glow" aria-hidden="true" style="opacity:.55"></i>' : ''}
    <div class="wrapv chap" style="position:relative;z-index:5">
      <div class="chap-l rv">
        <h2 class="disp chap-t" id="t-sig">${t('s.t')}</h2>
        <p class="chap-line" data-i18n="s.line">${t('s.line')}</p>
        <a class="tlk" href="#servicos">${T('s.link')}</a>
      </div>
      <div>
        ${quote(Q.lamination, 'sig-quote rv')}
        <span class="sig-attr fade" data-i18n="s.attr">${t('s.attr')}</span>
        <ul class="coll-rows" data-stag=".05">
          ${[1, 2, 3, 4].map((i) => `<li class="fade"><span class="rn">${['i.', 'ii.', 'iii.', 'iv.'][i - 1]}</span><span class="nm" data-i18n="s.i${i}">${t(`s.i${i}`)}</span><span class="note" data-i18n="s.n${i}">${t(`s.n${i}`)}</span></li>`).join('')}
        </ul>
        <div class="sig-media">
          <figure>
            <div class="ph ph-v ph--framed rv-im sheen">${vid('v03-six-weeks', { label: 'Vídeo: brow lamination com quase seis semanas de procedimento' })}<span class="vid-badge" data-i18n="r.vid">${t('r.vid')}</span><i class="grain" aria-hidden="true"></i><i class="shn" aria-hidden="true"></i></div>
            <figcaption class="sig-cap">${quote(Q.sixWeeks, '', 'span')}<small data-i18n="s.capsmall">${t('s.capsmall')}</small></figcaption>
          </figure>
          <figure><div class="ph ph-s ph--framed rv-im">${img('r17', { alt: 'Resultado de brow lamination no rosto da cliente', sizes: '(max-width:719px) 70vw, 300px' })}</div></figure>
        </div>
        <div class="ctas sig-cta fade">
          <a class="btnv btnv--ink" href="${waService('Brow lamination')}" target="_blank" rel="noopener">${T('s.cta')}</a>
        </div>
      </div>
    </div>
  </section>`;
}

function services(v) {
  const items = [
    ['i', 1, 'r06', 'Design personalizado', 'Design de sobrancelhas personalizado, em close'],
    ['ii', 2, 'r16', 'Design com henna', 'Design com henna bem alinhado, em close'],
    ['iii', 3, 'r18', 'Design com tintura', 'Cliente com design de sobrancelhas com tintura'],
    ['iv', 4, 'r08', 'Brow lamination', 'Brow lamination na altura dos olhos'],
    ['v', 5, 'r05', 'Lash lifting', 'Lash lifting nos cílios naturais'],
    ['vi', 6, 'masculino', 'Design masculino', 'Design de sobrancelhas masculino'],
  ];
  return `
  <section class="sec services tone-${v.tones.svc} ghostwrap" id="servicos" aria-labelledby="t-svc">
    <span class="ghost-w" aria-hidden="true">${t('sv.ghost')}</span>
    <div class="wrapv" style="position:relative;z-index:1">
      <div class="svc-head">
        <div><p class="kick kick--short" data-i18n="sv.kick">${t('sv.kick')}</p><h2 class="disp rv" id="t-svc" data-i18n="sv.t">${t('sv.t')}</h2></div>
        <p class="ital rv" style="--d:.08s" data-i18n="sv.it">${t('sv.it')}</p>
      </div>
      <div class="svc-grid" data-stag=".06">
        ${items.map(([rn, i, im, svc, alt]) => `
        <article class="svc rv">
          <div class="ph rv-im">${img(im, { alt, sizes: '(max-width:599px) 90vw, (max-width:1023px) 45vw, 400px', inlineW: 480 })}</div>
          <span class="caps-xs no">No. ${rn}</span>
          <h3 data-i18n="sv.${i}">${t(`sv.${i}`)}</h3>
          <div><span class="plaque">[DURAÇÃO]</span></div>
          <p data-i18n="sv.${i}d">${t(`sv.${i}d`)}</p>
          <div class="svc-foot"><span class="svc-price"><span data-i18n="sv.price">${t('sv.price')}</span> <span class="ph-tag">[PREÇO]</span></span>
            <a class="tlk" href="${waService(svc)}" target="_blank" rel="noopener" aria-label="Agendar ${svc} pelo WhatsApp">${T('sv.book')}</a></div>
        </article>`).join('')}
      </div>
      <div class="svc-cta ctas fade">
        <a class="btnv btnv--ink" href="${WA_DEFAULT}" target="_blank" rel="noopener">${T('sv.cta')}</a>
        <p class="svc-combos" data-i18n="sv.combos">${t('sv.combos')}</p>
      </div>
    </div>
  </section>`;
}

function lash(v) {
  return `
  <section class="sec tone-${v.tones.lash}" id="lash-lifting" aria-labelledby="t-lash">
    <div class="wrapv lash-grid">
      <figure class="lash-reel">
        <div class="arch-fr rv"><div class="ph sheen">${vid('v06-lash', { label: 'Vídeo: resultado de lash lifting com naturalidade' })}<i class="grain" aria-hidden="true"></i><i class="shn" aria-hidden="true"></i></div></div>
        <figcaption class="cap" data-i18n="l.cap">${t('l.cap')}</figcaption>
      </figure>
      <div class="lash-copy">
        <p class="kick kick--short" data-i18n="l.kick">${t('l.kick')}</p>
        <h2 class="disp rv" id="t-lash">${t('l.t')}</h2>
        ${quote(Q.lashDef, 'lash-def rv')}
        ${quote(Q.lashMascara, 'lash-def2 fade')}
        <div class="lash-stills" data-stag=".08">
          <div class="ph ph--framed rv-im">${img('r14', { alt: 'Lash lifting em close, cílios curvados', sizes: '(max-width:899px) 44vw, 250px', inlineW: 480 })}</div>
          <div class="ph ph--framed rv-im">${img('r05', { alt: 'Resultado de lash lifting', sizes: '(max-width:899px) 44vw, 250px', inlineW: 480 })}</div>
        </div>
        <div class="ctas fade" style="margin-top:clamp(2rem,4vw,3rem)">
          <a class="btnv btnv--ink" href="${waService('Lash lifting')}" target="_blank" rel="noopener">${T('l.cta')}</a>
          <a class="tlk" href="#servicos">${T('l.link')}</a>
        </div>
      </div>
    </div>
  </section>`;
}

function studio(v) {
  const fade = v.tones.studio === 'fade';
  const tone = fade ? 'lt studio-fade' : v.tones.studio;
  const fig = (name, key, alt) => `<figure><div class="ph ph--framed rv-im">${img(name, { alt, sizes: '(max-width:899px) 45vw, 300px', inlineW: 480 })}</div><figcaption class="cap" data-i18n="${key}">${t(key)}</figcaption></figure>`;
  return `
  <section class="sec tone-${tone}" id="estudio" aria-labelledby="t-studio" style="overflow:hidden">
    ${v.tones.studio === 'dk' ? '<i class="lx-glow" aria-hidden="true"></i><i class="grain" aria-hidden="true"></i>' : ''}
    ${v.tones.studio === 'lt' ? '<i class="lx-glow lx-glow--lt" aria-hidden="true"></i>' : ''}
    <div class="wrapv" style="position:relative;z-index:5">
      <div class="studio-head">
        <p class="kick kick--c" data-i18n="st.kick">${t('st.kick')}</p>
        <h2 class="disp rv" id="t-studio" data-i18n="st.t">${t('st.t')}</h2>
        <p class="ital rv" style="--d:.08s;font-size:1.2rem" data-i18n="st.it">${t('st.it')}</p>
      </div>
      <div class="studio-row" data-stag=".08">
        ${fig('studio-room', 'st.c1', 'Sala de atendimento do novo estúdio, com o logo LA iluminado')}
        ${fig('studio-mirror', 'st.c2', 'Espelho orgânico com iluminação de LED no estúdio')}
        ${fig('studio-cart', 'st.c3', 'Carrinho dourado com os produtos do estúdio')}
        ${fig('studio-lounge', 'st.c4', 'Lounge do estúdio com a frase na parede e o certificado')}
      </div>
      <div class="${fade ? 'studio-tail' : ''}">
        ${quote(Q.studio, 'studio-note fade')}
        <div class="orn fade" aria-hidden="true"><span>✦</span></div>
        <p class="script studio-script fade"><span class="q" lang="pt-BR">${Q.wall.pt}</span><span class="tr" style="font-family:var(--poetry);font-size:1rem">${Q.wall.en}</span></p>
        <p class="cap fade" style="margin-top:2rem" data-i18n="st.addr">${t('st.addr')}</p>
      </div>
    </div>
  </section>`;
}

function policies(v) {
  return `
  <section class="sec tone-${v.tones.pol}" id="antes-de-agendar" aria-labelledby="t-pol">
    <!-- [CONFIRMAR: políticas 2027] — texto do flyer de agenda de dezembro/2026, levemente editado -->
    <div class="wrapv pol-grid">
      <div class="pol-l rv">
        <p class="kick kick--short" data-i18n="p.kick">${t('p.kick')}</p>
        <h2 class="disp" id="t-pol" data-i18n="p.t">${t('p.t')}</h2>
        <p class="ital" data-i18n="p.it">${t('p.it')}</p>
        <!-- [CONFIRMAR] horário: o único dado publicado é "Não haverá atendimento aos domingos" -->
        <dl class="hours">
          <dt data-i18n="p.hours">${t('p.hours')}</dt><dd data-i18n="p.h1">${t('p.h1')}</dd><dd data-i18n="p.h2">${t('p.h2')}</dd>
          <dt data-i18n="p.where">${t('p.where')}</dt><dd data-i18n="p.w1">${t('p.w1')}</dd>
        </dl>
      </div>
      <div class="faq" data-stag=".05">
        ${[1, 2, 3, 4, 5].map((i) => `<details class="fade"${i === 1 ? ' open' : ''}><summary><span class="rn">${['i.', 'ii.', 'iii.', 'iv.', 'v.'][i - 1]}</span><span class="t" data-i18n="p.q${i}">${t(`p.q${i}`)}</span></summary><p class="ans" data-i18n="p.a${i}">${t(`p.a${i}`)}</p></details>`).join('')}
      </div>
    </div>
  </section>`;
}

function testimonials(v) {
  return `
  <section class="sec tone-${v.tones.depo}" id="depoimentos" aria-labelledby="t-depo" style="padding-block:clamp(80px,10vw,140px)">
    <!-- NUNCA inventar depoimentos: substituir pelos prints do destaque FEEDBACK, com autorização -->
    <div class="wrapv">
      <p class="kick kick--c" data-i18n="d.kick">${t('d.kick')}</p>
      <h2 class="disp rv" id="t-depo" style="text-align:center;font-size:clamp(2.2rem,4vw,3.6rem);margin-bottom:clamp(2.4rem,5vw,3.6rem)" data-i18n="d.t">${t('d.t')}</h2>
      <div class="depo-grid" data-stag=".08">
        ${[1, 2, 3].map(() => `<blockquote class="depo fade" style="margin:0"><p data-i18n="d.ph">${t('d.ph')}</p><span data-i18n="d.name">${t('d.name')}</span></blockquote>`).join('')}
      </div>
      <p class="depo-note" data-i18n="d.note">${t('d.note')}</p>
    </div>
  </section>`;
}

function finale() {
  return `
  <section class="finale" id="agendar" aria-labelledby="t-fin">
    <div class="finale-media" aria-hidden="true">${img('luciana-standing', { alt: '', sizes: '100vw', inlineW: 1280, cls: 'lv', pos: '50% 20%' })}</div>
    <i class="lx-glow" aria-hidden="true"></i><i class="grain" aria-hidden="true"></i>
    <div class="finale-c">
      <span class="caps-xs fade" data-i18n="f.kick">${t('f.kick')}</span>
      <h2 class="rv" id="t-fin" data-i18n="f.t">${t('f.t')}</h2>
      ${quote(Q.identity, 'q-line fade')}
      <div class="ctas fade" style="--d:.1s">
        <a class="btnv btnv--champ" href="${WA_DEFAULT}" target="_blank" rel="noopener">${T('h.cta')}</a>
        <a class="tlk" href="${IG}" target="_blank" rel="noopener">${T('f.ig')}</a>
      </div>
    </div>
  </section>`;
}

function footer(v) {
  const pol = (name, alt) => `<a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram — ${alt}">${img(name, { alt, sizes: '116px', inlineW: 480 })}</a>`;
  return `
  <footer class="foot">
    <i class="lx-glow" aria-hidden="true" style="opacity:.45"></i>
    <div class="foot-in">
      <p class="foot-follow"><a href="${IG}" target="_blank" rel="noopener"><span data-i18n="ft.follow">${t('ft.follow')}</span> &middot; @studiolucianaalvarenga</a></p>
      <div class="foot-strip">
        ${pol('r01', 'design com henna')}${pol('r04', 'lash lifting')}${pol('luciana-mirror', 'Luciana com o espelho LA')}${pol('studio-mirror', 'o novo estúdio')}
      </div>
      <nav class="foot-nav" aria-label="Rodapé">
        <a href="#inicio" data-i18n="ft.n1">${t('ft.n1')}</a><a href="#resultados" data-i18n="ft.n2">${t('ft.n2')}</a>
        <a href="#brow-lamination" data-i18n="ft.n3">${t('ft.n3')}</a><a href="#servicos" data-i18n="ft.n4">${t('ft.n4')}</a>
        <a href="#lash-lifting" data-i18n="ft.n5">${t('ft.n5')}</a><a href="#estudio" data-i18n="ft.n6">${t('ft.n6')}</a>
        <a href="#antes-de-agendar" data-i18n="ft.n7">${t('ft.n7')}</a><a href="${IG}" target="_blank" rel="noopener">Instagram</a>
        <a href="${WA_DEFAULT}" target="_blank" rel="noopener">WhatsApp · (62) 99305-5281</a>
      </nav>
      <div class="foot-logo">${logoFull('light')}</div>
      ${quote(Q.faith, 'foot-verse')}
      <span class="foot-ref">Luciana Alvarenga</span>
      <div class="foot-bar">
        <span>&copy; 2026 Studio Luciana Alvarenga</span>
        <span>Goiânia · GO — <span class="ph-tag" style="font-size:.5rem">[ENDEREÇO]</span></span>
        <span data-i18n="ft.bar3">${t('ft.bar3')}</span>
      </div>
      <p class="foot-demo">Demo by JP Silva Digital · Variação ${v.roman} — ${v.name}</p>
      <nav class="foot-demo foot-vars" aria-label="Variações do demo">Ver variações: ${VARIANTS.map((o) => o.n === v.n ? `<span aria-current="page">${o.roman} · ${o.name}</span>` : `<a href="${variantHref(o)}">${o.roman} · ${o.name}</a>`).join(' &nbsp;/&nbsp; ')}</nav>
    </div>
  </footer>`;
}

function header(v) {
  const light = !['arch', 'mono'].includes(v.hero);
  return `
  <header class="hd${light ? ' hd--lt' : ''} hd--intro">
    <div class="hd-in">
      <a class="hd-logo" href="#inicio" aria-label="Studio Luciana Alvarenga — início">${logoH(light ? 'light' : 'dark')}</a>
      <div class="hd-tools">
        <a class="hd-link hd-book" href="${WA_DEFAULT}" target="_blank" rel="noopener">${T('nav.book')}</a>
        <div class="lang" role="group" aria-label="Idioma / Language"><button type="button" data-lang="pt" aria-pressed="true">PT</button><i aria-hidden="true">|</i><button type="button" data-lang="en" aria-pressed="false">EN</button></div>
        <button class="menu-btn" id="menuOpen" aria-expanded="false" aria-controls="menu"><span class="mb-l" data-i18n="nav.menu">${t('nav.menu')}</span><span class="sr">Abrir menu</span><span class="bars" aria-hidden="true"><i></i><i></i></span></button>
      </div>
    </div>
  </header>
  <nav class="menu" id="menu" aria-label="Menu principal" aria-hidden="true" inert>
    <i class="lx-glow" aria-hidden="true"></i>
    <div class="menu-top">${logoH('light')}<button class="menu-close" id="menuClose">${T('nav.close')} <span class="x" aria-hidden="true">&times;</span></button></div>
    <div class="menu-body">
      <ul class="menu-list">
        ${[['#inicio', 'm.1'], ['#resultados', 'm.2'], ['#servicos', 'm.3'], ['#estudio', 'm.4'], ['#artista', 'm.5'], ['#agendar', 'm.6']]
          .map(([h, k], i) => `<li><a href="${h}"><span class="mrn">${['i.', 'ii.', 'iii.', 'iv.', 'v.', 'vi.'][i]}</span><span class="mlb" data-i18n="${k}">${t(k)}</span></a></li>`).join('')}
      </ul>
      <div class="menu-sub">
        <a href="#brow-lamination" data-i18n="m.sub1">${t('m.sub1')}</a><a href="#lash-lifting" data-i18n="m.sub2">${t('m.sub2')}</a>
        <a href="#antes-de-agendar" data-i18n="m.sub3">${t('m.sub3')}</a><a href="${IG}" target="_blank" rel="noopener">Instagram</a>
        <a href="${WA_DEFAULT}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
    <div class="menu-foot"><span data-i18n="m.foot1">${t('m.foot1')}</span><span data-i18n="m.foot2">${t('m.foot2')}</span></div>
  </nav>`;
}

/* ---------------- page ---------------- */
function fontCSS(v) {
  const f = (fam, file, w = 400, s = 'normal') => `@font-face{font-family:'${fam}';src:url(${url('fonts/' + file)}) format('woff2');font-weight:${w};font-style:${s};font-display:swap}`;
  return [
    f('Bodoni Moda', 'bodoni-moda-latin-400-normal.woff2'), f('Bodoni Moda', 'bodoni-moda-latin-400-italic.woff2', 400, 'italic'),
    f('Cinzel', 'cinzel-latin-400-normal.woff2'), v.n === 2 ? f('Marcellus', 'marcellus-latin-400-normal.woff2') : '',
    f('Cormorant Garamond', 'cormorant-garamond-latin-400-normal.woff2'), f('Cormorant Garamond', 'cormorant-garamond-latin-500-normal.woff2', 500),
    f('Cormorant Garamond', 'cormorant-garamond-latin-400-italic.woff2', 400, 'italic'),
    f('Montserrat', 'montserrat-latin-400-normal.woff2'), f('Montserrat', 'montserrat-latin-500-normal.woff2', 500),
    f('Parisienne', 'parisienne-latin-400-normal.woff2'),
    v.n >= 4 ? f('Jost', 'jost-latin-400-normal.woff2') + f('Jost', 'jost-latin-500-normal.woff2', 500) : '',
    v.n === 5 ? f('Gilda Display', 'gilda-display-latin-400-normal.woff2') + f('Jost', 'jost-latin-400-normal.woff2') + f('Jost', 'jost-latin-500-normal.woff2', 500) : '',
  ].join('\n');
}

const DESC = 'Studio Luciana Alvarenga, designer de sobrancelhas em Goiânia (GO): design personalizado, design com henna e tintura, brow lamination e lash lifting. Agende pelo WhatsApp (62) 99305-5281.';
let SITE_URL = 'https://studiolucianaalvarenga.com.br/'; // [CONFIRMAR] domínio — demo pages point at their own demo URL instead
let OG_IMG = SITE_URL + 'assets/og-default.jpg';

function jsonLd() {
  return JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BeautySalon', '@id': SITE_URL + '#studio',
    name: 'Studio Luciana Alvarenga', description: DESC, url: SITE_URL, image: OG_IMG,
    telephone: '+55 62 99305-5281', priceRange: 'Sob consulta',
    address: { '@type': 'PostalAddress', streetAddress: '[ENDEREÇO]', addressLocality: 'Goiânia', addressRegion: 'GO', addressCountry: 'BR' },
    // TODO openingHoursSpecification — only "closed on Sundays" is published
    paymentAccepted: 'Pix, Dinheiro, Cartão de crédito, Cartão de débito',
    sameAs: [IG], areaServed: { '@type': 'City', name: 'Goiânia' },
    makesOffer: ['Design de sobrancelhas personalizado', 'Design com henna', 'Design com tintura', 'Brow lamination', 'Lash lifting', 'Design masculino', 'Design infantil']
      .map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
  });
}

function page(v) {
  lgN = 0;
  if (MODE === 'publish') { SITE_URL = `${DEMO_BASE}${v.path}`; OG_IMG = 'https://jpsilvadigital.com/demo/_shared/luciana-alvarenga/og-default.jpg'; }
  const fresh = v.n >= 4;
  const menuHtml = (() => { const h = header(v); return h.slice(h.indexOf('<nav class="menu"')); })();
  const ctx = { img, vid, T, t, quote, Q, waService, WA: WA_DEFAULT, IG, logoH, logoFull, menu: menuHtml, policies: policyList(t) };
  const body = fresh ? [v.n === 4 ? bodyIV(ctx) : bodyV(ctx), footer(v)].join('\n') : [
    header(v), `<main id="conteudo">`, hero(v), artist(v), runway(v), signature(v), services(v), lash(v), studio(v),
    policies(v), testimonials(v), finale(), `</main>`, footer(v),
  ].join('\n');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${dict.pt['meta.title']}</title>
<meta name="description" content="${esc(DESC)}">
<link rel="canonical" href="${SITE_URL}">
<meta name="theme-color" content="#F6EFE6">
<meta name="robots" content="noindex,nofollow"><!-- demo: remove at launch -->
<meta property="og:type" content="website"><meta property="og:site_name" content="Studio Luciana Alvarenga"><meta property="og:locale" content="pt_BR"><meta property="og:locale:alternate" content="en_US">
<meta property="og:title" content="Studio Luciana Alvarenga · Designer de Sobrancelhas em Goiânia"><meta property="og:description" content="${esc(DESC)}">
<meta property="og:url" content="${SITE_URL}"><meta property="og:image" content="${OG_IMG}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${favicon()}" type="image/svg+xml">
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">${jsonLd()}</script>
<style>
${fontCSS(v)}
${CSS}
${VARIANT_CSS[v.n] || ''}${v.n === 4 ? CSS_IV : v.n === 5 ? CSS_V : ''}
</style>
</head>
<body class="v${v.n}">
<a href="#conteudo" class="skip-link" data-i18n="skip">${t('skip')}</a>
<div class="edge edge--l" aria-hidden="true">Studio Luciana Alvarenga — Goiânia · GO</div>
<div class="edge edge--r" aria-hidden="true">Designer de sobrancelhas — Aqui seu olhar é minha responsabilidade</div>
${body}
<div class="mbar" aria-label="Agendar">
  <span class="mbar-n">Studio Luciana Alvarenga<small data-i18n="bar.sub">${t('bar.sub')}</small></span>
  <a class="btnv btnv--solid" href="${WA_DEFAULT}" target="_blank" rel="noopener">${T('bar.cta')}</a>
</div>
<button id="toTop" type="button" aria-label="${t('top')}" data-i18n-label="top">&uarr;</button>
<div class="pv-flag" aria-hidden="true">Prévia · Variação ${v.roman} — ${v.name}</div>
<script>window.__DICT=${JSON.stringify(dict)};</script>
<script>${JS}</script>
</body>
</html>`;
}

/* ---------------- write ---------------- */
if (PUBLISH) { publish(); process.exit(0); }
const out = join(ROOT, 'dist');
mkdirSync(join(out, 'site'), { recursive: true });
mkdirSync(join(out, 'preview'), { recursive: true });
INLINE = false;
for (const v of VARIANTS) writeFileSync(join(out, 'site', `${v.slug}.html`), page(v));
cpSync(A, join(out, 'site', 'assets'), { recursive: true });
writeFileSync(join(out, 'site', 'index.html'), indexPage());
INLINE = true;
for (const v of VARIANTS) writeFileSync(join(out, 'preview', `${v.slug}.html`), page(v));
console.log('built', VARIANTS.map((v) => v.slug).join(', '));

function indexPage() {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Studio Luciana Alvarenga — Prévias</title><meta name="robots" content="noindex">
<style>body{margin:0;min-height:100svh;display:grid;place-items:center;background:#1A0E0C;color:#F6EFE6;font-family:Georgia,serif;padding:24px}main{max-width:560px;width:100%}h1{font-weight:400;font-size:1.6rem;letter-spacing:.04em}a{display:block;border:1px solid rgba(233,198,161,.4);padding:18px 20px;margin:12px 0;color:#E9C6A1;text-decoration:none}a small{display:block;color:rgba(246,239,230,.7);font-size:.9rem;margin-top:4px}</style></head>
<body><main><h1>Studio Luciana Alvarenga — 3 variações</h1>${VARIANTS.map((v) => `<a href="${v.slug}.html">Variação ${v.roman} — ${v.name}<small>${v.note}</small></a>`).join('')}</main></body></html>`;
}

/* ---------------- publish into the demo library (append-only shared store) ---------------- */
function publish() {
  if (!existsSync(LIB)) throw new Error('demo library not found at ' + LIB);
  MODE = 'publish';
  // 1. media → /demo/_shared/luciana-alvarenga/ ; add new files, reuse identical ones, refuse to overwrite a different one
  const walk = (dir, rel = '') => readdirSync(join(dir, rel), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(dir, join(rel, e.name)) : [join(rel, e.name)]);
  let added = 0, reused = 0;
  if (A !== SHARED) for (const rel of walk(A)) {
    const src = readFileSync(join(A, rel)), dst = join(SHARED, rel);
    if (existsSync(dst)) {
      if (!readFileSync(dst).equals(src)) throw new Error(`refusing to overwrite a different file in the shared store: ${rel} — give the new file a new name`);
      reused++; continue;
    }
    mkdirSync(dirname(dst), { recursive: true }); writeFileSync(dst, src); added++;
  }
  // 2. pages
  const slugDir = join(LIB, SLUG);
  for (const v of VARIANTS) {
    const dir = join(slugDir, v.path.replace(/^\//, ''));
    mkdirSync(dir, { recursive: true });
    const html = page(v);
    if (/src="assets\/|href="assets\/|data:video/.test(html)) throw new Error('unpublished asset path left in ' + v.slug);
    if (!html.includes('content="noindex,nofollow"')) throw new Error('robots meta missing in ' + v.slug);
    writeFileSync(join(dir, 'index.html'), html);
  }
  // 3. DEMO.json
  let commit = 'unknown', dirty = true;
  try {
    commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT }).toString().trim();
    dirty = execFileSync('git', ['status', '--porcelain', '.'], { cwd: ROOT }).toString().trim() !== '';
  } catch (e) {}
  writeFileSync(join(slugDir, 'DEMO.json'), JSON.stringify({
    slug: SLUG, url: DEMO_BASE, client: 'Studio Luciana Alvarenga',
    sourceRepo: 'jpsilva0418/production', sourceDir: 'luciana-alvarenga', sourceCommit: commit, sourceDirty: dirty,
    builtAt: new Date().toISOString(), pages: VARIANTS.length,
    shared: { media: '/demo/_shared/luciana-alvarenga/' },
    variations: Object.fromEntries(VARIANTS.map((v) => [v.roman, { name: v.name, path: `/demo/${SLUG}${v.path}` }])),
    note: 'Unlisted design demo — not the live website. noindex. Booking buttons open her real WhatsApp; nothing is sent by the page itself.',
  }, null, 2) + '\n');
  console.log(`published /demo/${SLUG} (${VARIANTS.length} pages); shared store: ${added} added, ${reused} reused`);
}
