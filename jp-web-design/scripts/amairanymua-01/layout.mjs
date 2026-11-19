/* /demo/amairanymua-01 — the page shell every page is poured into: head, header,
   full-screen menu, footer, back-to-top and the "design preview" marker.

   Ported from the Sass by Kass shell (BaseLayout / Header / Footer), with one
   difference that is honest about the source material: Amairany has no verified
   logo file, so the mark is typography (the `wm` lockup), never an image. */
import { A, BASE, ORIGIN, PICK, SITE, L, DIRS, NAV, FOOTER, href, book, inquire, esc } from './site.mjs';

/** The typographic wordmark used in the header, the menu and the footer. */
export const wordmark = (cls = '') =>
  `<span class="wm${cls ? ` ${cls}` : ''}"><span class="wm-name">${SITE.first} <em>Sierra</em></span><span class="wm-sub">Hair + Makeup</span></span>`;

const isCurrent = (cur, path) => cur === path;

function header(d, cur, { light, home }) {
  const primary = NAV.filter((n) => !n.cta);
  return `<header class="hd${light ? ' hd--lt' : ''}${home ? ' hd--home' : ''}" id="siteHeader">
  <div class="hd-in">
    <a class="hd-logo" href="${href(d)}" aria-label="${SITE.name}, ${SITE.tagline.toLowerCase()} — home">${wordmark()}</a>
    <nav class="hd-nav" aria-label="Primary">
      ${primary.map((n) => `<a href="${href(d, n.path)}"${isCurrent(cur, n.path) ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
    </nav>
    <div class="hd-tools">
      ${inquire(d, 'Bridal inquiry', 'btn btn--solid hd-cta', isCurrent(cur, 'bridal-inquiry') ? 'aria-current="page"' : '')}
      <button class="menu-btn" id="menuOpen" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-btn-t">Menu</span> <span class="bars" aria-hidden="true"><i></i><i></i></span></button>
    </div>
  </div>
</header>
<nav class="menu" id="menu" aria-label="Main menu" aria-hidden="true" inert>
  <div class="menu-top">
    <a class="hd-logo" href="${href(d)}" aria-label="${SITE.name} — home" tabindex="-1">${wordmark()}</a>
    <button class="menu-close" id="menuClose" type="button">Close <span class="x" aria-hidden="true">&times;</span></button>
  </div>
  <div class="menu-body">
    <ul class="menu-list">
      <li><a href="${href(d)}"${cur === '' ? ' aria-current="page"' : ''}><span class="mlb">Home</span><span class="mnote">Start here</span></a></li>
      ${NAV.map((n) => `<li><a href="${href(d, n.path)}"${isCurrent(cur, n.path) ? ' aria-current="page"' : ''}><span class="mlb">${n.menu}</span><span class="mnote">${n.note}</span></a></li>`).join('\n      ')}
    </ul>
    <div class="menu-cta">
      ${inquire(d, 'Bridal inquiry', 'btn btn--ivory')}
      ${book('event', 'Book event glam', 'btn btn--ghost')}
    </div>
    <div class="menu-sub">
      <a href="${L.ig}" rel="external">Instagram ${SITE.handle}</a>
      <a href="${L.mail}">Email</a>
      ${book('bridal-services', 'Bridal services')}
    </div>
  </div>
  <div class="menu-foot">
    <span>${SITE.name}</span>
    <span>${SITE.tagline} &middot; ${SITE.area}</span>
  </div>
</nav>`;
}

function footer(d) {
  return `<footer class="foot">
  <i class="lx-dusk" aria-hidden="true"></i>
  <div class="foot-in">
    <div class="foot-grid">
      <div class="foot-brand">
        <p class="foot-name">${SITE.first} <em>Sierra</em></p>
        <p class="foot-sub">${SITE.tagline} &middot; ${SITE.area}</p>
        <p>${FOOTER.line}</p>
      </div>
      <div>
        <p class="foot-h">Explore</p>
        <ul class="foot-nav">
          <li><a href="${href(d)}">Home</a></li>
          ${NAV.map((n) => `<li><a href="${href(d, n.path)}">${n.menu}</a></li>`).join('\n          ')}
        </ul>
      </div>
      <div>
        <p class="foot-h">Book</p>
        <ul class="foot-contact">
          <li><span class="k">Weddings</span><a href="${href(d, 'bridal-inquiry')}">Bridal inquiry</a></li>
          <li><span class="k">Bridal services</span>${book('bridal-services', 'Explore bridal services')}</li>
          <li><span class="k">Events</span>${book('event', 'Book event makeup &amp; hair')}</li>
          <li><span class="k">Where</span>${SITE.areaLong}</li>
        </ul>
      </div>
      <div>
        <p class="foot-h">Reach ${SITE.first}</p>
        <ul class="foot-contact">
          <li><span class="k">Instagram</span><a href="${L.ig}" rel="external">${SITE.handle}</a></li>
          <li><span class="k">Email</span><a href="${L.mail}" style="overflow-wrap:anywhere">${SITE.email}</a></li>
          <li><span class="k">Reviews</span><a href="${href(d, 'reviews')}">5.0 on WeddingWire</a></li>
        </ul>
      </div>
    </div>
    <p class="foot-fine">${FOOTER.fine}${PICK ? '' : ` <a href="${BASE}">See all three directions</a>.`}</p>
    <div class="foot-bar">
      <span>Design preview &middot; ${SITE.name}</span>
      <span>${SITE.tagline} &middot; ${SITE.areaLong}</span>
      <span><a href="${L.ig}" rel="external">${SITE.handle}</a></span>
    </div>
  </div>
</footer>`;
}

/** The "design preview" marker. During review it also carries the direction switch: the same
 *  page in A, B or C, and the way back to all three. */
function flag(d, cur) {
  const dirs = PICK ? '' : `<span class="demo-dirs" role="navigation" aria-label="Design directions"><span class="demo-dirs-k" aria-hidden="true">Direction</span>${Object.values(DIRS)
    .map((x) => `<a href="${BASE}/${x.id}${cur ? `/${cur}` : ''}"${x.id === d ? ' aria-current="true"' : ''} aria-label="Direction ${x.letter}: ${x.full}">${x.letter}</a>`)
    .join('')}<a class="demo-all" href="${BASE}" aria-label="All three directions">All</a></span>`;
  return `<div class="demo-flag${PICK ? '' : ' demo-flag--review'}"><span class="demo-flag-t">Design preview &middot; not the official site</span>${dirs}</div>`;
}

/** One full page.
 *  d            direction id
 *  path         '' for home, or one of PAGES
 *  title        page title (the site name and "design preview" are appended)
 *  description  meta description
 *  main         the page's <main> contents
 *  headerLight  true when the top of the page is dark (ivory header ink)
 *  home         true on the home page (the header wordmark waits until the bar sticks)
 *  css          extra stylesheet names in assets/css, without .css
 *  js           extra script names in assets/js, without .js
 *  head         extra markup for <head> (preloads, the entrance gate)
 *  bodyClass    extra body classes */
export function page(d, { path = '', title, description, main, headerLight = false, home = false, css = [], js = [], head = '', bodyClass = '' }) {
  const dir = DIRS[d];
  const url = `${ORIGIN}${href(d, path)}`;
  const full = `${title} · ${SITE.name} · design preview`;
  return `<!doctype html>
<html lang="en" data-dir="${d}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)} Design preview, not the official website.">
<meta name="robots" content="noindex,nofollow,noarchive">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name} · design preview">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="A website concept for ${SITE.handle} by JP Silva Digital. Design preview, not the official website.">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ORIGIN}${A}/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="${A}/img/favicon.svg">
<meta name="theme-color" content="${dir.theme}">
<link rel="preload" as="font" type="font/woff2" href="${A}/fonts/fraunces-var.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="${A}/fonts/figtree-var.woff2" crossorigin>
<link rel="stylesheet" href="${A}/css/system.css">
${css.map((c) => `<link rel="stylesheet" href="${A}/css/${c}.css">`).join('\n')}
<script>(function(d){d.classList.add('js');setTimeout(function(){if(!window.__am01)d.classList.remove('js')},3500)})(document.documentElement)</script>
${head}
</head>
<body class="pal-${d}${bodyClass ? ` ${bodyClass}` : ''}">
<a href="#main" class="skip-link">Skip to content</a>
${header(d, path, { light: headerLight, home })}
<main id="main">
${main}
</main>
${footer(d)}
<button id="toTop" type="button" aria-label="Back to top"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
${flag(d, path)}
<script src="${A}/js/site.js" defer></script>
${js.map((s) => `<script src="${A}/js/${s}.js" defer></script>`).join('\n')}
</body>
</html>
`;
}

/* ---------- shared page furniture ---------- */
/** The interior title card (Kass `.cov`): kicker, h1 with an italic tail, a line, actions, a ghost word. */
export const cover = ({ ghost, kick, heading, sub, actions = '' }) => `<section class="cov ghostwrap">
  ${ghost ? `<span class="ghost-w" aria-hidden="true">${ghost}</span>` : ''}
  <div class="cov-c">
    <p class="cov-kick fade">${kick}</p>
    <h1 class="disp rv">${heading[0]} <span class="ital">${heading[1]}</span></h1>
    <p class="cov-sub rv" style="--d:.08s">${sub}</p>
    ${actions ? `<div class="cov-cta fade" style="--d:.16s">${actions}</div>` : ''}
  </div>
</section>`;
/** A chapter slate: the thin titled rule between chapters. tone: '' | 'dk' | 'linen' */
export const slate = (text, tone = '', id = '') =>
  `<div class="chapslate${tone ? ` chapslate--${tone}` : ''} fade" role="presentation"${id ? ` id="${id}"` : ''}><span class="cs-t">${text}</span></div>`;
/** The closing invitation card every interior page ends on: both ways to book. */
export const noteCard = (d, { kick, copy }) => `<div class="note-card rv">
  <span class="caps">${kick}</span>
  <p class="note-copy">${copy}</p>
  <span class="note-rule" aria-hidden="true"></span>
  <div class="note-act">
    ${inquire(d)}
    ${book('event', 'Book event glam', 'btn btn--line')}
  </div>
</div>`;
