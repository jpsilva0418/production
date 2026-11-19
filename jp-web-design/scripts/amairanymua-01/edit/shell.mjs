/* /demo/amairanymua-01 — site "edit" (The Edit): the shell and the page kit.

   Peach, cream and Gulf blue with charcoal type. Bricolage Grotesque, heavy and slightly
   condensed, with one Newsreader italic counter-word per headline; pill buttons, big radii,
   prints that sit a degree off-square. Every page is poured into page(); the helpers below
   are the kit the other pages are built from (documented in KIT.md beside the brief).

   Styles: assets/edit/site.css (tokens, type, shell, kit). Runtime: assets/edit/site.js
   (menu, header, dock, reveals, lazy films, ticker). */
import { A, SITE, L, NAV, FOOTER, head, marker, href, book, inquire, finePrint, pic, film, esc } from '../site.mjs';

export const S = 'edit';
const E = `${A}/edit`;

/* ---------------------------------------------------------------- type */

/** The concept wordmark: AMAIRANY over SIERRA, heavy condensed caps, with "hair + makeup"
 *  in Newsreader italic tucked beside SIERRA. Sized by font-size on .wm (everything inside is em). */
export const wordmark = (cls = '') =>
  `<span class="wm${cls ? ` ${cls}` : ''}" aria-hidden="true"><span class="wm-a">Amairany</span><span class="wm-b">Sierra</span><span class="wm-c"><span>hair +</span><span>makeup</span></span></span>`;

/** A headline: heavy Bricolage with the second part in Newsreader italic.
 *  hed(['Soft glam to', 'full glam.'], { tag: 'h1', size: 'xxl' }) */
export const hed = ([a, b = ''], { tag = 'h2', size = 'xl', cls = '', id = '' } = {}) =>
  `<${tag} class="hed hed--${size}${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''}><span class="hed-a">${a}</span>${b ? ` <em class="hed-b">${b}</em>` : ''}</${tag}>`;

/** A pill kicker above a headline. tone: '' (hairline) | 'solid' | 'gulf' | 'cream' | 'peach' */
export const kick = (text, tone = '') => `<p class="kick${tone ? ` kick--${tone}` : ''}">${text}</p>`;

/** The four-point spark used between words (the fonts have no ✦ glyph, so it is drawn). */
export const spark = (cls = '') => `<svg class="spark${cls ? ` ${cls}` : ''}" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 0c.9 5.6 4.4 9.1 10 10-5.6.9-9.1 4.4-10 10-.9-5.6-4.4-9.1-10-10C5.6 9.1 9.1 5.6 10 0z"/></svg>`;

/** Static pills (tags, not links). */
export const pills = (items, cls = '') => `<ul class="pills${cls ? ` ${cls}` : ''}">${items.map((x) => `<li class="pill">${x}</li>`).join('')}</ul>`;

/** A list with sparks for bullets. */
export const ticks = (items, cls = '') => `<ul class="ticks${cls ? ` ${cls}` : ''}">${items.map((x) => `<li>${spark()}<span>${x}</span></li>`).join('')}</ul>`;

/* ---------------------------------------------------------------- pictures */

/** One of her photographs as a print: a big-radius card sitting a degree off-square.
 *  tilt: 'l' | 'r' | '' ; ratio: CSS aspect-ratio for the frame ('4/5' default, '' = natural);
 *  cap: optional caption under the print; sticker: optional pill stuck on its corner. */
export const print = (key, { alt, sizes = '(max-width:899px) 88vw, 40vw', tilt = '', ratio = '4/5', cap = '', sticker = '', eager = false, cls = '', pos } = {}) =>
  `<figure class="print${tilt ? ` print--${tilt}` : ''}${cls ? ` ${cls}` : ''}"><div class="print-f"${ratio ? ` style="aspect-ratio:${ratio}"` : ''}>${pic(key, { alt, sizes, eager, pos })}</div>${sticker ? `<span class="sticker">${sticker}</span>` : ''}${cap ? `<figcaption class="print-cap">${cap}</figcaption>` : ''}</figure>`;

/** A film frame as a print (the marked slot until a clip exists; plays when it does). */
export const filmPrint = (id, { tilt = '', ratio = '9/16', cap = '', cls = '', label } = {}) =>
  `<figure class="print print--film${tilt ? ` print--${tilt}` : ''}${cls ? ` ${cls}` : ''}"><div class="print-f" style="aspect-ratio:${ratio}">${film(id, { label })}</div>${cap ? `<figcaption class="print-cap">${cap}</figcaption>` : ''}</figure>`;

/* ---------------------------------------------------------------- page sections */

/** The default pair of booking actions. */
export const actions = (cls = '') =>
  `<div class="acts${cls ? ` ${cls}` : ''}">${inquire(S, 'Bridal inquiry', 'btn btn--solid')}${book('event', 'Book event glam', 'btn btn--line')}</div>`;

/** A page's title card on a colour field: pill kicker, the h1 (second part italic), one line,
 *  actions, and an optional off-square photo card. This is the ONLY h1 on a page that uses it.
 *  tone: 'peach' (default) | 'cream' | 'gulf'. image: a PHOTOS key, or { photo, alt, pos } / { film }. */
export const cover = ({ kick: k = '', heading, sub = '', actions: acts, image = null, tone = 'peach', id = '', cls = '' }) => {
  const img = image ? (typeof image === 'string' ? { photo: image } : image) : null;
  const fig = img
    ? img.film
      ? filmPrint(img.film, { tilt: 'r', cls: 'cover-print' })
      : print(img.photo, { alt: img.alt, pos: img.pos, tilt: 'r', eager: true, sizes: '(max-width:899px) 80vw, 36vw', cls: 'cover-print', sticker: img.sticker || '' })
    : '';
  return `<section class="cover f-${tone}${img ? ' cover--img' : ''}${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''}>
  <div class="wrap cover-in">
    <div class="cover-copy">
      ${k ? kick(k) : ''}
      ${hed(heading, { tag: 'h1', size: 'xxl' })}
      ${sub ? `<p class="lede cover-sub">${sub}</p>` : ''}
      ${acts === false ? '' : acts || actions()}
    </div>
    ${fig}
  </div>
</section>`;
};

/** A chapter: a section on a field with a kicker, an h2 and an optional line, then its body.
 *  tone: 'cream' (default) | 'peach' | 'gulf' | 'char' | 'white'. align: '' | 'center'. */
export const chapter = ({ id = '', kick: k = '', heading, sub = '', body = '', tone = 'cream', align = '', cls = '', size = 'xl' }) =>
  `<section class="sec f-${tone}${align ? ` sec--${align}` : ''}${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''}${id ? ` aria-labelledby="${id}-h"` : ''}>
  <div class="wrap">
    <header class="sec-hd rv">
      ${k ? kick(k) : ''}
      ${heading ? hed(heading, { size, id: id ? `${id}-h` : '' }) : ''}
      ${sub ? `<p class="lede">${sub}</p>` : ''}
    </header>
    ${body}
  </div>
</section>`;

/** The closing call to book, on peach: a kicker, a heading (default: her own line, "Secure your
 *  wedding day glam."), one line, and both ways to book. */
export const cta = ({ kick: k = 'Ready when you are', copy = '', heading = ['Secure your', 'wedding day glam.'] } = {}) =>
  `<section class="cta f-peach">
  <div class="wrap cta-in rv">
    ${kick(k, 'cream')}
    ${hed(heading, { size: 'xl' })}
    ${copy ? `<p class="lede">${copy}</p>` : ''}
    ${actions('acts--center')}
    <p class="cta-more">${book('bridal-services', 'Explore bridal services', 'lnk')} <span aria-hidden="true">&middot;</span> <a class="lnk" href="${L.ig}" rel="external">Instagram ${SITE.handle}</a></p>
  </div>
</section>`;

/* ---------------------------------------------------------------- shell */

const cur = (p, path) => (p === path ? ' aria-current="page"' : '');

function header(path) {
  const primary = NAV.filter((n) => !n.cta);
  return `<header class="hd" id="siteHeader">
  <div class="hd-in">
    <a class="hd-logo" href="${href(S)}" aria-label="${SITE.name}, ${SITE.tagline.toLowerCase()}, home">${wordmark('wm--hd')}</a>
    <nav class="hd-nav" aria-label="Primary">
      ${primary.map((n) => `<a href="${href(S, n.path)}"${cur(path, n.path)}>${n.label}</a>`).join('')}
    </nav>
    <div class="hd-tools">
      ${inquire(S, 'Bridal inquiry', 'btn btn--solid btn--sm hd-cta', path === 'bridal-inquiry' ? 'aria-current="page"' : '')}
      <button class="hd-menu" id="menuOpen" type="button" aria-expanded="false" aria-controls="menu"><span class="hd-menu-t">Menu</span><span class="hd-menu-i" aria-hidden="true"><i></i><i></i></span></button>
    </div>
  </div>
</header>
<div class="menu f-peach" id="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" inert>
  <div class="menu-top">
    <span class="menu-wm">${wordmark()}</span>
    <button class="menu-close" id="menuClose" type="button">Close <span class="menu-x" aria-hidden="true"></span></button>
  </div>
  <nav class="menu-body" aria-label="Pages">
    <ol class="menu-list">
      <li><a href="${href(S)}"${cur(path, '')}><span class="menu-l">Home</span><span class="menu-n">Start here</span></a></li>
      ${NAV.map((n) => `<li><a href="${href(S, n.path)}"${cur(path, n.path)}><span class="menu-l">${n.menu}</span><span class="menu-n">${n.note}</span></a></li>`).join('\n      ')}
    </ol>
  </nav>
  <div class="menu-foot">
    <div class="acts">${inquire(S, 'Bridal inquiry', 'btn btn--solid')}${book('event', 'Book event glam', 'btn btn--line')}</div>
    <p class="menu-sub"><a href="${L.ig}" rel="external">Instagram ${SITE.handle}</a><a href="${L.mail}">Email ${SITE.first}</a>${book('bridal-services', 'Bridal services')}</p>
  </div>
</div>`;
}

function footer() {
  return `<footer class="ft f-char">
  <div class="wrap">
    <p class="ft-wm">${wordmark('wm--ft')}<span class="sr">${SITE.name}, hair and makeup</span></p>
    <div class="ft-grid">
      <div class="ft-about">
        <p class="ft-line">${FOOTER.line}</p>
        <div class="acts">${inquire(S, 'Bridal inquiry', 'btn btn--cream')}${book('event', 'Book event glam', 'btn btn--line-cream')}</div>
      </div>
      <nav class="ft-col" aria-label="Footer">
        <p class="ft-h">Pages</p>
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
          <li><a href="${L.mail}" class="ft-mail">${SITE.email}</a></li>
          <li><span class="ft-k">${SITE.areaLong}</span></li>
        </ul>
      </div>
    </div>
    <p class="ft-fine">${finePrint()}</p>
  </div>
</footer>`;
}

/* The phone dock: both ways to book, floating at the bottom once the first screen is passed. */
const dockBar = () => `<div class="dock" id="dock" role="group" aria-label="Book" aria-hidden="true">${inquire(S, 'Bridal inquiry', 'btn btn--cream btn--sm', 'tabindex="-1"')}${book('event', 'Book event glam', 'btn btn--line-cream btn--sm', 'tabindex="-1"')}</div>`;

/** One whole page.
 *  path         '' for home, or one of PAGES
 *  title        the page's own title (site name and "design preview" are appended by head())
 *  description  meta description
 *  main         the contents of <main>
 *  head         extra markup for <head> (a preload of the lead image, for instance)
 *  css, js      extra file names in assets/edit/, without extension ('home' -> home.css / home.js)
 *  bodyClass    extra classes on <body>
 *  pre          markup placed right after the skip link, before the header (the home opening)
 *  dock         false to leave out the floating phone dock (the inquiry page) */
export const page = ({ path = '', title, description, main, head: extra = '', css = [], js = [], bodyClass = '', pre = '', dock = true }) => `<!doctype html>
<html lang="en" data-site="edit">
<head>
${head(S, { path, title, description })}
<link rel="preload" as="font" type="font/woff2" href="${A}/fonts/bricolage-grotesque-var.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="${A}/fonts/newsreader-italic-var.woff2" crossorigin>
<link rel="stylesheet" href="${E}/site.css">
${css.map((c) => `<link rel="stylesheet" href="${E}/${c}.css">`).join('\n')}
<script>(function(d){d.classList.add('js');setTimeout(function(){if(!window.__edit)d.classList.remove('js')},3500)})(document.documentElement)</script>
${extra}
</head>
<body class="${['pg-' + (path || 'home'), bodyClass].filter(Boolean).join(' ')}">
<a class="skip" href="#main">Skip to content</a>
${pre}
${header(path)}
<main id="main">
${main}
</main>
${footer()}
${dock ? dockBar() : ''}
${marker(S, path)}
<script src="${E}/site.js" defer></script>
${js.map((j) => `<script src="${E}/${j}.js" defer></script>`).join('\n')}
</body>
</html>
`;

export { esc };
