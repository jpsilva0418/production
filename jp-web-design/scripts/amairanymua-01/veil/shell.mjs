/* /demo/amairanymua-01 — site "veil": the shell and the page kit.

   Veil is the reveal: pearl, satin and champagne foil, light and unhurried. Everything here
   is unveiled, never popped. This file renders the parts every page shares (head, header,
   full-screen menu, footer, the slim booking bar for phones, the preview marker) and the
   furniture the page authors build with. The kit is documented for them in KIT.md (kept in
   the studio's scratch folder): every helper below has a one-line contract above it.

   The monogram is concept styling: an italic A and S from Cormorant Garamond Italic (wght 430),
   converted to outlines once so the mark is crisp at first paint without waiting for a font,
   and filled with the champagne-foil gradient defined once per page in the sprite. */
import { A, NAV, SITE, L, FOOTER, PHOTOS, LOOKS, FILMS, head, marker, href, finePrint, inquire, book, pic, film, esc } from '../site.mjs';

const S = 'veil';
const VA = `${A}/veil`;

/* ---------- the mark ---------- */
export const MONO_D = 'M6 660Q2 660 2 654Q2 648 6 648Q32 648 66 624.2Q100 600.3 136.5 535.6L422 25.3Q424 21.3 431.5 22.6Q439 24 440 27L530.2 576Q534.4 603 540.5 619Q546.6 635 560.8 641.5Q575 648 604.3 648Q608.3 648 608.3 654Q608.3 660 604.3 660Q580.5 660 555.8 658Q531.1 656 502 656Q473.2 656 450.8 658Q428.5 660 404 660Q400.7 660 400.7 654Q400.7 648 404 648Q449.9 648 461.8 633Q473.7 618 466.8 576L390.5 107.9L418.3 74.4L169.3 528.1Q141.9 577.8 139.1 603.8Q136.2 629.8 153.8 638.9Q171.3 648 204.3 648Q208.3 648 208.3 654Q208.3 660 203.3 660Q183.2 660 154.4 658Q125.7 656 98 656Q69 656 50.5 658Q32 660 6 660ZM231.3 389 246.3 368.2H461.7L463.7 389ZM619 672Q586.4 672 554.3 664.5Q522.2 657 486.3 638Q482.3 635 481 630.5Q479.8 626 480.3 619L496.4 486Q496.4 481 501.9 481Q507.4 481 507.7 486Q509.8 530.9 524 569.5Q538.2 608.1 567.9 631.7Q597.5 655.2 643.9 655.2Q673.6 655.2 700.8 643.5Q728 631.7 748.4 606.5Q768.9 581.3 775.8 539.9Q784.2 493.6 769.7 461.2Q755.2 428.9 727.3 404.3Q699.3 379.8 667.9 358.2Q636.9 336.4 609.5 312.7Q582 289 567.5 257.1Q553 225.2 561 179Q571.3 126.7 602.8 92.4Q634.2 58 677.6 41Q721 24 765.9 24Q790.8 24 818.2 29.5Q845.7 35 874.5 48Q887.8 55 886.2 65L873.4 177.6Q873.1 181.3 867.5 181.3Q862 181.3 861.7 177.6Q858.9 143.7 847.8 112Q836.6 80.3 813.3 59.7Q789.9 39.2 748.3 39.2Q710.4 39.2 685.3 56.1Q660.2 73 646 98.2Q631.7 123.4 627 149.9Q619.3 191.1 633.6 220.3Q648 249.6 675.1 271.8Q702.2 294.1 732.6 315.9Q765.6 338 794.9 362.9Q824.2 387.8 840.1 421.1Q856 454.4 848 502.2Q839.7 548.7 810.7 587.4Q781.6 626 733.6 649Q685.7 672 619 672Z';
export const MONO_VB = '0 14 890 666';

/** The defs every page carries once, right after <body>: the foil gradients and the monogram
 *  outline as a symbol. Not display:none (gradients inside display:none SVG do not paint in
 *  every browser); it is a zero-size, aria-hidden box instead. */
const sprite = () => `<svg class="vl-sprite" width="0" height="0" aria-hidden="true" focusable="false"><defs>
<linearGradient id="vl-foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B98F5E"/><stop offset=".42" stop-color="#D9B98A"/><stop offset=".53" stop-color="#F3E3C3"/><stop offset=".64" stop-color="#D9B98A"/><stop offset="1" stop-color="#9C7048"/></linearGradient>
<linearGradient id="vl-foil-ink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8A5C3C"/><stop offset=".45" stop-color="#B98F5E"/><stop offset=".55" stop-color="#D9B98A"/><stop offset=".66" stop-color="#B98F5E"/><stop offset="1" stop-color="#7A4E33"/></linearGradient>
<symbol id="vl-as" viewBox="${MONO_VB}"><path d="${MONO_D}"/></symbol>
</defs></svg>`;

/** The A S monogram. tone: 'foil' (champagne, for tulle and night grounds) | 'ink' (deeper foil,
 *  for small sizes on light). Decorative: always aria-hidden; the name beside it carries meaning. */
export const monogram = (cls = '', tone = 'foil') =>
  `<svg class="mono${cls ? ` ${cls}` : ''}" viewBox="${MONO_VB}" aria-hidden="true" focusable="false"><use href="#vl-as" fill="url(#vl-${tone === 'ink' ? 'foil-ink' : 'foil'})"/></svg>`;

/** The wordmark lockup: monogram + AMAIRANY SIERRA (+ optional sub line). */
export const wordmark = (cls = '', sub = false) =>
  `<span class="wm${cls ? ` ${cls}` : ''}">${monogram('wm-mono', 'ink')}<span class="wm-t"><span class="wm-name">${SITE.name}</span>${sub ? '<span class="wm-sub">Hair + Makeup</span>' : ''}</span></span>`;

/* ---------- small furniture ---------- */
/** A small tracked-caps label. */
export const kick = (text, cls = '') => `<p class="kick${cls ? ` ${cls}` : ''}">${text}</p>`;
/** An italic emphasised word in foil. With light: true, one light crosses it once when it enters. */
export const foil = (text, { light = true } = {}) =>
  `<em class="foil${light ? ' fl' : ''}"${light ? ` data-t="${esc(text.replace(/<[^>]+>/g, ''))}"` : ''}>${text}</em>`;
/** A display heading pair: [plain, italic]. tag h1 | h2 | h3. Lines set from behind a mask. */
export const heading = (h, { tag = 'h2', cls = '', id = '' } = {}) => {
  const [a, b] = Array.isArray(h) ? h : [h, ''];
  return `<${tag} class="disp${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''}><span class="ln rv-line"><span>${a}</span></span>${b ? ` <span class="ln rv-line" style="--d:.12s"><span>${foil(b)}</span></span>` : ''}</${tag}>`;
};
/** A fine hairline with a pearl at its centre. */
export const rule = (cls = '') => `<span class="rule${cls ? ` ${cls}` : ''}" aria-hidden="true"><i></i></span>`;
/** A pearl: the small marker the aisle threads through. */
export const pearl = (cls = '') => `<span class="pearl${cls ? ` ${cls}` : ''}" aria-hidden="true"></span>`;
/** A list of short points, each led by a tiny pearl. */
export const points = (items, cls = '') => `<ul class="points${cls ? ` ${cls}` : ''}">${items.map((p) => `<li>${p}</li>`).join('')}</ul>`;

/** The caption of a look, from LOOKS (or '' if the photograph is not a look). */
export const lookCap = (key) => (LOOKS.find((x) => x.photo === key) || {}).cap || '';

/** One of her photographs in a tall hairline frame, unveiled (a tulle layer slides off) as it
 *  enters. opts: cap (caption html; true = the LOOKS caption), ar ('4/5' default, any CSS
 *  aspect-ratio), sizes, cls, eager, pos, alt, mat (true = a pearl mat around the picture). */
export const frame = (key, { cap = '', ar = '', sizes = '(max-width:899px) 88vw, 40vw', cls = '', eager = false, pos, alt, mat = true } = {}) => {
  if (!PHOTOS[key]) throw new Error(`photo "${key}" is not in PHOTOS`);
  const c = cap === true ? lookCap(key) : cap;
  return `<figure class="frame${mat ? ' frame--mat' : ''}${cls ? ` ${cls}` : ''} rv-im"${ar ? ` style="--ar:${ar}"` : ''}><span class="frame-im">${pic(key, { sizes, eager, pos, alt })}<i class="tulle" aria-hidden="true"></i></span>${c ? `<figcaption class="cap">${c}</figcaption>` : ''}</figure>`;
};
/** A film frame in the same hairline frame: the clip when FILMS[id].file is set, otherwise the
 *  marked slot (styled to look deliberate). cap: true = "<label> · Film". */
export const filmFrame = (id, { cap = true, ar = '', cls = '', mat = true } = {}) => {
  const f = FILMS[id];
  if (!f) throw new Error(`film "${id}" is not in FILMS`);
  const c = cap === true ? `${f.label} &middot; Film` : cap;
  return `<figure class="frame frame--film${mat ? ' frame--mat' : ''}${cls ? ` ${cls}` : ''} rv-im"${ar ? ` style="--ar:${ar}"` : ''}><span class="frame-im">${film(id, { label: f.label })}<i class="tulle" aria-hidden="true"></i></span>${c ? `<figcaption class="cap">${c}</figcaption>` : ''}</figure>`;
};

/** The two booking actions as a pair. variant: '' (on light) | 'night' (on the dark band). */
export const actions = (variant = '', { first = 'Bridal inquiry', second = 'Book event glam' } = {}) =>
  `<div class="acts">${inquire(S, first, variant === 'night' ? 'btn btn--light' : 'btn')}${book('event', second, variant === 'night' ? 'btn btn--line-light' : 'btn btn--line')}</div>`;

/* ---------- page furniture ---------- */
/** The interior title card: a centred cover with a small-caps kicker, the page's h1 (light
 *  display, second part italic in foil, set line by line), a pearl rule, a line, and actions.
 *  media: optional html placed under it (a frame, a film frame, a row of frames). */
export const cover = ({ kick: k, heading: h, sub = '', actions: act = '', media = '', id = '' }) => `<section class="cover"${id ? ` id="${id}"` : ''}>
  <div class="wrap cover-in">
    ${pearl('cover-pearl rv')}
    ${kick(k, 'rv')}
    ${heading(h, { tag: 'h1', cls: 'cover-h' })}
    ${rule('rv')}
    ${sub ? `<p class="cover-sub rv" style="--d:.2s">${sub}</p>` : ''}
    ${act ? `<div class="cover-act rv" style="--d:.28s">${act}</div>` : ''}
  </div>
  ${media ? `<div class="cover-media">${media}</div>` : ''}
</section>`;

/** A chapter: a section with a centred head (pearl, kicker, h2 pair, optional lede) and any body.
 *  tone: '' (tulle) | 'satin' | 'night'. body is raw html placed after the head. */
export const chapter = ({ kick: k, heading: h, lede = '', body = '', id = '', tone = '', cls = '' }) => `<section class="sec chapter${tone ? ` sec--${tone}` : ''}${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''}${id ? ` aria-labelledby="${id}-h"` : ''}>
  <div class="wrap chap-head">
    ${pearl('rv')}
    ${k ? kick(k, 'rv') : ''}
    ${heading(h, { id: id ? `${id}-h` : '' })}
    ${lede ? `<p class="lede rv" style="--d:.18s">${lede}</p>` : ''}
  </div>
  ${body}
</section>`;

/** The closing invitation every interior page ends on: the monogram, a kicker, one line, and
 *  both ways to book (the bridal inquiry and her event booking page), plus bridal services. */
export const cta = ({ kick: k = 'Ready when you are', copy }) => `<section class="sec cta" aria-label="${esc(k.replace(/<[^>]+>/g, ''))}">
  <div class="wrap cta-in">
    ${monogram('cta-mono rv')}
    ${kick(k, 'rv')}
    <p class="cta-copy rv" style="--d:.1s">${copy}</p>
    ${rule('rv')}
    <div class="rv" style="--d:.2s">${actions('', { second: 'Book Event Makeup &amp; Hair' })}</div>
    <p class="cta-more rv" style="--d:.26s">${book('bridal-services', 'Explore Bridal Services', 'lnk')}</p>
  </div>
</section>`;

/* ---------- the shell ---------- */
const cur = (a, b) => (a === b ? ' aria-current="page"' : '');

function header(path) {
  return `<header class="hd" id="siteHeader">
  <div class="hd-in">
    <a class="hd-logo" href="${href(S)}" aria-label="${SITE.name}, ${SITE.tagline.toLowerCase()}: home"${path === '' ? ' aria-current="page"' : ''}>${wordmark()}</a>
    <nav class="hd-nav" aria-label="Primary">
      ${NAV.filter((n) => !n.cta).map((n) => `<a href="${href(S, n.path)}"${cur(path, n.path)}>${n.label}</a>`).join('')}
    </nav>
    <div class="hd-tools">
      ${inquire(S, '<span class="hd-cta-l">Bridal inquiry</span><span class="hd-cta-s" aria-hidden="true">Inquire</span>', 'btn btn--sm hd-cta', path === 'bridal-inquiry' ? 'aria-current="page" aria-label="Bridal inquiry"' : 'aria-label="Bridal inquiry"')}
      <button class="menu-btn" id="menuOpen" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-btn-t">Menu</span><span class="bars" aria-hidden="true"><i></i><i></i></span></button>
    </div>
  </div>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" inert>
  <i class="menu-tulle" aria-hidden="true"></i>
  <div class="menu-top">
    <a class="hd-logo" href="${href(S)}" aria-label="${SITE.name}: home">${wordmark()}</a>
    <button class="menu-close" id="menuClose" type="button"><span>Close</span><span class="x" aria-hidden="true"></span></button>
  </div>
  <nav class="menu-body" aria-label="Main menu">
    <ul class="menu-list">
      <li><a href="${href(S)}"${cur(path, '')}><span class="ml">Home</span><span class="mn">The veil lifts</span></a></li>
      ${NAV.map((n) => `<li><a href="${href(S, n.path)}"${cur(path, n.path)}><span class="ml">${n.menu}</span><span class="mn">${n.note}</span></a></li>`).join('\n      ')}
    </ul>
  </nav>
  <div class="menu-foot">
    ${actions('', { second: 'Book event glam' })}
    <p class="menu-sub"><a href="${L.ig}" rel="external">Instagram ${SITE.handle}</a><a href="${L.tiktok}" rel="external">TikTok</a><a href="${L.google}" rel="external">Google reviews</a><a href="${L.mail}">Email</a>${book('bridal-services', 'Bridal services')}</p>
  </div>
</div>`;
}

function footer() {
  return `<footer class="ft">
  <div class="wrap ft-in">
    <div class="ft-brand">
      ${monogram('ft-mono')}
      <p class="ft-name">${SITE.name}</p>
      <p class="ft-sub">${SITE.tagline} &middot; ${SITE.area}</p>
      <p class="ft-line">${FOOTER.line}</p>
    </div>
    <div class="ft-cols">
      <nav class="ft-col" aria-label="Footer">
        <p class="ft-h">The site</p>
        <ul>
          <li><a href="${href(S)}">Home</a></li>
          ${NAV.map((n) => `<li><a href="${href(S, n.path)}">${n.menu}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      <div class="ft-col">
        <p class="ft-h">Book</p>
        <ul>
          <li>${inquire(S, 'Bridal inquiry')}</li>
          <li>${book('bridal-services', 'Explore bridal services')}</li>
          <li>${book('event', 'Book event makeup &amp; hair')}</li>
        </ul>
      </div>
      <div class="ft-col">
        <p class="ft-h">Reach ${SITE.first}</p>
        <ul>
          <li><a href="${L.ig}" rel="external">Instagram ${SITE.handle}</a></li>
          <li><a href="${L.tiktok}" rel="external">TikTok ${SITE.handle}</a></li>
          <li><a href="${L.google}" rel="external">Google reviews</a></li>
          <li><a href="${L.mail}" class="ft-mail">${SITE.email}</a></li>
          <li><span class="ft-where">${SITE.areaLong}</span></li>
        </ul>
      </div>
    </div>
    ${rule('ft-rule')}
    <p class="ft-fine">${finePrint()}</p>
  </div>
</footer>`;
}

/** The slim bar fixed to the bottom on phones, once the first screen has passed. */
const bar = () => `<div class="bar" id="bookBar" role="group" aria-label="Book" aria-hidden="true">${inquire(S, 'Bridal inquiry', 'btn btn--sm', 'tabindex="-1"')}${book('event', 'Event glam', 'btn btn--sm btn--line', 'tabindex="-1"')}</div>`;

/** One whole page.
 *  path         '' for home, or one of PAGES
 *  title        the page's own title ("· Amairany Sierra · design preview" is appended by head())
 *  description  meta description
 *  main         the contents of <main>
 *  head         extra markup for <head> (preloads)
 *  css, js      extra file names in assets/veil/, without extension (['home'] -> home.css / home.js);
 *               an entry starting with '/' is used as a full path (`${A}/css/inquiry-core.css`)
 *  bodyClass    extra classes on <body>: 'no-bar' hides the phone booking bar on that page
 *  pre          markup placed first in <body> (the home page's opening uses it) */
export function page({ path = '', title, description, main, head: extra = '', css = [], js = [], bodyClass = '', pre = '' }) {
  return `<!doctype html>
<html lang="en" class="vl">
<head>
${head(S, { path, title, description })}
<link rel="preload" as="font" type="font/woff2" href="${A}/fonts/cormorant-garamond-var.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="${A}/fonts/jost-var.woff2" crossorigin>
<link rel="stylesheet" href="${VA}/site.css">
${css.map((c) => `<link rel="stylesheet" href="${c.startsWith('/') ? c : `${VA}/${c}.css`}">`).join('\n')}
<script>(function(d){d.classList.add('js');setTimeout(function(){if(!window.__veil)d.classList.remove('js')},3500)})(document.documentElement)</script>
${extra}
</head>
<body class="vl-body${bodyClass ? ` ${bodyClass}` : ''}">
${sprite()}
${pre}
<a href="#main" class="skip">Skip to content</a>
${header(path)}
<main id="main">
${main}
</main>
${footer()}
${bodyClass.includes('no-bar') ? '' : bar()}
${marker(S, path)}
<script src="${VA}/site.js" defer></script>
${js.map((x) => `<script src="${x.startsWith('/') ? x : `${VA}/${x}.js`}" defer></script>`).join('\n')}
</body>
</html>
`;
}
