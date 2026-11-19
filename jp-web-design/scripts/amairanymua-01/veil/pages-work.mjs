/* /demo/amairanymua-01 — site "veil": Portfolio and Reviews.

   PORTFOLIO is a procession. Each group (PORTFOLIO in site.mjs) walks past in sets of one
   large frame and two smaller ones, the large on one side of the page's centre line and the
   two smaller stepped down the other, the sides alternating set by set. Every frame is
   unveiled by tulle as it enters (.rv-im, from the kit). Film slots walk among the stills
   (film() via the frame markup; a clip plays in the same tile once FILMS[id].file is set,
   loaded near the viewport by site.js). Every photograph is a plain link to its 1280 file;
   pages-work.js turns those links into a light viewer (a modal <dialog>: the photograph on
   tulle in a fine frame, a counter and the caption), reading each photograph's srcset, alt and
   caption from the tile itself.

   REVIEWS is honest about what exists: two public rating sites and Google, read on
   SITE.ratingsAsOf, and no quotation of anyone until she chooses which ones to share. */
import { page, cover, chapter, cta, actions, kick, pearl, rule, foil } from './shell.mjs';
import { SITE, L, PHOTOS, LOOKS, FILMS, PORTFOLIO, PORTFOLIO_PAGE, REVIEWS, href, pic, src, film, esc, arrow } from '../site.mjs';

const S = 'veil';

/* ===================== PORTFOLIO ===================== */

const capOf = (key) => (LOOKS.find((x) => x.photo === key) || {}).cap || '';
/* the viewer walks the photographs in page order; films are slots and stay in the page */
const ORDER = PORTFOLIO.flatMap((g) => g.items.filter((it) => it.photo).map((it) => it.photo));
const COUNT = PORTFOLIO.reduce((n, g) => n + g.items.length, 0);
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const plural = (n, w) => `${WORDS[n] ?? n} ${w}${n === 1 ? '' : 's'}`;

/* the width each kind of frame really occupies (mat included), for `sizes` */
const SIZES = {
  big: '(max-width:899px) 86vw, (max-width:1439px) 46vw, 640px',
  sm: '(max-width:899px) 44vw, (max-width:1439px) 22vw, 310px',
  solo: '(max-width:899px) 80vw, (max-width:1439px) 46vw, 640px',
};

/** One photograph: the hairline frame of the kit, its picture a link to the 1280 file. */
const photoTile = (key, role) => {
  const p = PHOTOS[key];
  const i = ORDER.indexOf(key);
  const cap = capOf(key);
  return `<figure class="frame frame--mat pf-tile pf-${role} rv-im" style="--ar:4/5">
    <a class="frame-im pf-a" href="${src(key, 1280)}" data-lb="${i}" data-w="${p.w}" data-h="${p.h}">${pic(key, { sizes: SIZES[role] })}<i class="tulle" aria-hidden="true"></i><span class="pf-zoom" aria-hidden="true"></span><span class="vh">, view larger</span></a>
    <figcaption class="cap">${cap}</figcaption>
  </figure>`;
};

/** One film: the same frame holding film(), the marked slot until a clip arrives. */
const filmTile = (id, role) => {
  const f = FILMS[id];
  return `<figure class="frame frame--mat frame--film pf-tile pf-${role} pf-film rv-im" style="--ar:3/4">
    <span class="frame-im">${film(id, { label: f.label })}<i class="tulle" aria-hidden="true"></i></span>
    <figcaption class="cap">${f.label} &middot; Film</figcaption>
  </figure>`;
};

const tile = (it, role) => (it.film ? filmTile(it.film, role) : photoTile(it.photo, role));

/* Sets for one group: the largest photograph leads (as the group's own `span` says), the
   rest follow in pairs. A set of one stands alone at the centre. */
function sets(items) {
  const lead = items.findIndex((it) => it.photo && it.span === 'big');
  const order = lead > 0 ? [items[lead], ...items.filter((_, i) => i !== lead)] : items.slice();
  const out = [];
  while (order.length) {
    /* each set opens on a photograph where one is left */
    const pi = order.findIndex((it) => it.photo);
    const big = order.splice(pi < 0 ? 0 : pi, 1)[0];
    out.push([big, ...order.splice(0, 2)]);
  }
  return out;
}

let side = 0; /* alternates across the whole page, group to group */
const setHtml = (set) => {
  if (set.length === 1) return `<div class="pf-set pf-set--solo">${tile(set[0], 'solo')}</div>`;
  const dir = side++ % 2 ? 'r' : 'l';
  return `<div class="pf-set pf-set--${dir}${set.length === 2 ? ' pf-set--pair' : ''}">
    ${tile(set[0], 'big')}
    ${set.slice(1).map((it, i) => tile(it, 'sm').replace('pf-sm ', `pf-sm pf-s${i + 1} `)).join('\n    ')}
  </div>`;
};

const groupKick = (g) => {
  const ph = g.items.filter((it) => it.photo).length;
  const fm = g.items.length - ph;
  return `${plural(ph, 'photograph')}${fm ? ` &middot; ${plural(fm, 'film')}` : ''}`;
};

const groupHtml = (g) => {
  return chapter({
    id: `g-${g.id}`,
    kick: groupKick(g),
    heading: g.title.replace(/&(?!amp;)/g, '&amp;'),
    lede: g.line,
    tone: g.id === 'wedding-day' ? 'satin' : '',
    cls: 'pf-group',
    body: `<div class="wrap pf-proc">
    ${sets(g.items).map(setHtml).join('\n    ')}
  </div>`,
  });
};

/* The group index under the title card carries one small plate per group, so the first screen
   of a portfolio already shows her work (decorative repeats: the link text names the group). */
const PLATE = { bridal: 'bride-pearls', 'wedding-day': 'wedding-night', glam: 'glam-bronze' };
const jump = () => `<nav class="pf-jump rv" style="--d:.34s" aria-label="Portfolio groups">
  <ul>${PORTFOLIO.map((g) => `<li><a href="#g-${g.id}">${PLATE[g.id] ? `<span class="pf-jump-im">${pic(PLATE[g.id], { alt: '', sizes: '(max-width:599px) 27vw, 120px' })}</span>` : ''}<span class="pf-jump-l"><span class="pf-jump-t">${g.title.replace(/&(?!amp;)/g, '&amp;')}</span><span class="pf-jump-n">${String(g.items.length).padStart(2, '0')}</span></span></a></li>`).join('')}</ul>
</nav>`;

/* The viewer. Empty until pages-work.js fills it; without script it never opens and every
   tile is a plain link to the photograph. */
const viewer = () => `<dialog class="lb" id="lb" aria-label="Portfolio viewer" aria-describedby="lb-cap">
  <i class="lb-folds" aria-hidden="true"></i>
  <div class="lb-top">
    <p class="lb-n" id="lb-n" aria-live="polite"><b>01</b> / ${String(ORDER.length).padStart(2, '0')}</p>
    <button class="lb-x" type="button" data-lb-close><span>Close</span><i aria-hidden="true"></i></button>
  </div>
  <div class="lb-stage">
    <button class="lb-b lb-prev" type="button" data-lb-prev aria-label="Previous photograph"><span aria-hidden="true">&larr;</span></button>
    <figure class="lb-fig">
      <span class="lb-frame"><img class="lb-im" alt="" decoding="async" sizes="(max-aspect-ratio:3/4) 92vw, 64vh"></span>
      <figcaption class="lb-cap" id="lb-cap">${capOf(ORDER[0])}</figcaption>
    </figure>
    <button class="lb-b lb-next" type="button" data-lb-next aria-label="Next photograph"><span aria-hidden="true">&rarr;</span></button>
  </div>
  <p class="lb-hint" aria-hidden="true"><span class="lb-h-touch">Swipe for the next look</span><span class="lb-h-keys">Arrow keys for the next look &middot; Esc to close</span></p>
</dialog>`;

export const portfolio = () => {
  side = 0;
  const groups = PORTFOLIO.map(groupHtml).join('\n');
  return page({
    path: 'portfolio',
    title: 'Portfolio',
    description: `${SITE.name}’s portfolio: ${COUNT} bridal, wedding-day and glam looks in photographs and film, by a luxury hair and makeup artist across ${SITE.area}.`,
    css: ['pages-work'],
    js: ['pages-work'],
    bodyClass: 'pf-page',
    main: `${cover({
      kick: PORTFOLIO_PAGE.kick,
      heading: PORTFOLIO_PAGE.heading,
      sub: PORTFOLIO_PAGE.sub(COUNT),
      actions: actions(),
      media: jump(),
    })}
${groups}
<section class="pf-ig" aria-label="Instagram">
  <div class="wrap pf-ig-in">
    ${pearl('rv')}
    ${kick('On Instagram', 'rv')}
    <a class="lnk rv" style="--d:.1s" href="${L.ig}" rel="external">${PORTFOLIO_PAGE.ig} ${arrow}</a>
  </div>
</section>
${cta({ kick: PORTFOLIO_PAGE.noteKick, copy: PORTFOLIO_PAGE.note })}
${viewer()}`,
  });
};

/* ===================== REVIEWS ===================== */

const stars = () => `<span class="rs-stars" aria-hidden="true">${'<i></i>'.repeat(5)}</span>`;

const siteCard = (s, i) => `<li class="rs-card rv" style="--d:${(i * 0.12).toFixed(2)}s">
  <a class="rs-a" href="${s.href}" rel="external">
    <span class="rs-name">${s.name}</span>
    <span class="rs-score"><span class="rs-num">${s.score}</span><span class="vh"> out of 5,</span></span>
    ${stars()}
    <span class="rs-meta">${s.meta}</span>
    <span class="rs-go">${s.go} ${arrow}</span>
  </a>
</li>`;

const [EMPTY_A, EMPTY_B] = (() => {
  const h = REVIEWS.emptyHeading;
  const at = h.indexOf(', ');
  return at > 0 ? [h.slice(0, at + 1), h.slice(at + 2)] : [h, ''];
})();

export const reviews = () => page({
  path: 'reviews',
  title: 'Reviews',
  description: `${SITE.name} is rated ${REVIEWS.sites.map((s) => `${s.score} on ${s.name} (${s.meta})`).join(' and ')}, as shown on each site on ${SITE.ratingsAsOf}.`,
  css: ['pages-work'],
  bodyClass: 'rs-page',
  main: `${cover({
    kick: REVIEWS.kick,
    heading: REVIEWS.heading,
    sub: `${REVIEWS.sub.split('. ')[0]}.`,
    actions: actions(),
  })}
${chapter({
  id: 'read',
  kick: 'Where to read them',
  /* the cover already says where they live and to read them in full; this chapter is the way
     in to them (REVIEWS.emptyBody: "every review is one tap away") */
  heading: ['Two sites,', 'one tap away.'],
  cls: 'rs-where',
  body: `<div class="wrap rs-wrap">
    <ul class="rs-cards">
      ${REVIEWS.sites.map(siteCard).join('\n      ')}
    </ul>
    <p class="rs-google rv"><span class="rs-g-name">${REVIEWS.google.name}</span><span class="rs-g-line">${REVIEWS.google.line}</span><a class="lnk" href="${REVIEWS.google.href}" rel="external">${REVIEWS.google.go} on ${REVIEWS.google.name} ${arrow}</a></p>
    ${rule('rv')}
    <p class="rs-asof small rv">Ratings and review counts as shown on each site on ${SITE.ratingsAsOf}.</p>
  </div>`,
})}
<section class="sec sec--satin rs-empty" aria-labelledby="empty-h">
  <div class="wrap grid-2 rs-empty-in">
    <div class="rs-empty-txt">
      ${pearl('rv')}
      ${kick(REVIEWS.emptyKick, 'rv')}
      <h2 class="disp disp--md" id="empty-h"><span class="ln rv-line"><span>${EMPTY_A}</span></span>${EMPTY_B ? ` <span class="ln rv-line" style="--d:.12s"><span>${foil(EMPTY_B)}</span></span>` : ''}</h2>
      <p class="rv" style="--d:.18s">${REVIEWS.emptyBody}</p>
      <div class="rs-empty-act rv" style="--d:.26s">
        <a class="btn" href="${REVIEWS.sites[0].href}" rel="external">${REVIEWS.sites[0].go}</a>
        <a class="lnk" href="${href(S, 'portfolio')}">See the portfolio ${arrow}</a>
      </div>
    </div>
    <figure class="frame frame--mat rs-fig rv-im" style="--ar:4/5"><span class="frame-im">${pic('golden-hour', { sizes: '(max-width:899px) 86vw, (max-width:1439px) 40vw, 560px' })}<i class="tulle" aria-hidden="true"></i></span><figcaption class="cap">${esc(capOf('golden-hour'))}</figcaption></figure>
  </div>
</section>
${cta({ kick: REVIEWS.noteKick, copy: REVIEWS.note })}`,
});
