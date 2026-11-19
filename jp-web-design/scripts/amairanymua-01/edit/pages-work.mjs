/* /demo/amairanymua-01 — The Edit: Portfolio and Reviews.

   PORTFOLIO is the home page's palette at full size. The six shimmer pans are the filter
   (a compact that stays beside the work on wide screens, a sticky pill bar on phones), the
   looks are rounded cards in a masonry on three colour fields, one per group, with her four
   film slots among the photographs, and any photograph opens large in a story viewer
   (segmented bars, tap to go on, swipe down or X to close). Without script every tile is a
   plain link to the 1280 file and the filter is not shown (the group links still work).

   REVIEWS is honest about what exists: her public ratings, linked where they were written,
   and an empty state for the excerpts she has not chosen yet. Nothing is quoted.

   Styles: assets/edit/pages-work.css. Runtime: assets/edit/pages-work.js (filter, viewer). */
import { A, SITE, L, LOOKS, LOOK_CATS, FILMS, PHOTOS, PORTFOLIO, PORTFOLIO_PAGE, REVIEWS, href, book, pic, film, src, arrow } from '../site.mjs';
import { page, S, hed, kick, cover, cta, actions, print } from './shell.mjs';

/* ================================================================ portfolio */

const lookOf = (k) => LOOKS.find((x) => x.photo === k);
/* A film belongs to a look only where its own label names one (Bridal, Full glam, Glam waves);
   otherwise it shows under All and On film. Nothing is assigned by guesswork. */
const filmCats = (id) => Object.keys(LOOK_CATS).filter((c) => LOOK_CATS[c] === FILMS[id].label);

const ITEMS = PORTFOLIO.flatMap((g) => g.items);
const N_PHOTOS = ITEMS.filter((x) => x.photo).length;
const N_FILMS = ITEMS.filter((x) => x.film).length;
const N = ITEMS.length;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const tally = (items) => {
  const p = items.filter((x) => x.photo).length, f = items.filter((x) => x.film).length;
  return [p ? plural(p, 'photograph', 'photographs') : '', f ? plural(f, 'film', 'films') : ''].filter(Boolean).join(' &middot; ');
};

/* the pans: the same six shades, in the same order, as the home page's palette */
const PANS = [
  { id: 'bridal', name: LOOK_CATS.bridal, shade: 'champagne' },
  { id: 'soft', name: LOOK_CATS.soft, shade: 'peach' },
  { id: 'full', name: LOOK_CATS.full, shade: 'bronze' },
  { id: 'waves', name: LOOK_CATS.waves, shade: 'lip' },
  { id: 'wedding', name: LOOK_CATS.wedding, shade: 'gulf' },
  { id: 'film', name: 'On film', shade: 'charcoal' },
];
const countFor = (id) => (id === 'film' ? N_FILMS : ITEMS.filter((x) => (x.photo ? lookOf(x.photo).cats : filmCats(x.film)).includes(id)).length);

/* group fields + headings (the second part in Newsreader italic, as every headline here) */
const GROUP = {
  bridal: { tone: 'peach', heading: ['The', 'bride.'] },
  'wedding-day': { tone: 'gulf', heading: ['Wedding', 'day.'] },
  glam: { tone: 'char', heading: ['Glam &amp;', 'waves.'] },
};

const panBtn = (p) => `<button class="pf-pan pf-pan--${p.id}" type="button" data-f="${p.id}" aria-pressed="false" style="--c:var(--${p.shade})"><span class="pf-dish" aria-hidden="true"></span><span class="pf-pan-n">${p.name}</span><span class="pf-pan-c" aria-hidden="true">${countFor(p.id)}</span></button>`;
const allBtn = `<button class="pf-pan pf-pan--all" type="button" data-f="all" aria-pressed="true"><span class="pf-dish pf-dish--all" aria-hidden="true"></span><span class="pf-pan-n">All looks</span><span class="pf-pan-c" aria-hidden="true">${N}</span></button>`;

const filterBar = `<aside class="pf-side" aria-label="Filter the portfolio">
      <div class="pf-case">
        <div class="pf-lid" aria-hidden="true"><span class="pf-lid-t">Pick a shade</span><span class="pf-lid-n">The Edit &middot; six shades</span></div>
        <div class="pf-well" role="group" aria-label="Show looks">${allBtn}${PANS.map(panBtn).join('')}</div>
        <p class="pf-count" data-pf-status aria-live="polite">Showing all ${N}: ${tally(ITEMS)}.</p>
      </div>
    </aside>`;

/* one tile. Photographs are links to the large file (the viewer takes over with script);
   films are the marked slot now and play when FILMS[id].file is set. */
let seq = 0;
const tile = (it, g, j) => {
  const tilt = j === 1 ? ' pf-it--r' : j === 3 ? ' pf-it--l' : '';
  const span = it.span ? ` pf-it--${it.span}` : '';
  if (it.film) {
    const f = FILMS[it.film];
    return `<figure class="pf-it pf-it--film${span}${tilt}" data-cats="film ${filmCats(it.film).join(' ')}">
          <div class="pf-f pf-f--film">${film(it.film, { label: f.label })}</div>
          <figcaption class="pf-cap"><span class="pf-cap-k">On film</span> ${f.label}</figcaption>
        </figure>`;
  }
  const L0 = lookOf(it.photo);
  const p = PHOTOS[it.photo];
  const i = seq++;
  /* the frame carries the photograph's own shape, so nothing jumps while it loads; the
     'wide' and 'big' tiles that go full width on phones are cropped to 5:4 there (face kept by pos) */
  return `<figure class="pf-it${span}${tilt}" data-cats="${L0.cats.join(' ')}">
          <a class="pf-a" href="${src(it.photo, 1280)}" data-lb="${i}" data-full="${src(it.photo, 1280)}" data-w="${p.w}" data-h="${p.h}" data-cap="${L0.cap}">
            <span class="pf-f" style="--ar:${p.w} / ${p.h}">${pic(it.photo, { sizes: it.span === 'big' || it.span === 'wide' ? '(max-width:599px) calc(100vw - 24px), (max-width:1023px) 44vw, 380px' : '(max-width:599px) 46vw, (max-width:1023px) 44vw, 380px' })}<span class="pf-open" aria-hidden="true"></span></span>
            <span class="sr">, view large</span>
          </a>
          <figcaption class="pf-cap">${L0.cap}</figcaption>
        </figure>`;
};

const group = (g, gi) => {
  const G = GROUP[g.id];
  return `<section class="pf-g pf-g--${G.tone}" id="${g.id}" data-group aria-labelledby="${g.id}-h">
        <header class="pf-g-hd">
          <p class="pf-g-no" aria-hidden="true">${String(gi + 1).padStart(2, '0')}</p>
          <div class="pf-g-t">
            ${hed(G.heading, { size: 'l', id: `${g.id}-h` })}
            <p class="pf-g-line">${g.line}</p>
          </div>
          <p class="pf-g-c">${tally(g.items)}</p>
        </header>
        <div class="pf-m">
        ${g.items.map((it, j) => tile(it, g, j)).join('\n        ')}
        </div>
        <p class="pf-none" hidden>No looks in this group for that shade.</p>
      </section>`;
};

/* the cover fan: one picture per group, chosen so the label sits on hair or background, never a face */
const THUMB = { bridal: 'bride-crystal', 'wedding-day': 'wedding-night', glam: 'glam-sculpt' };
const jump = `<nav class="pf-jump" aria-label="Groups">
        ${PORTFOLIO.map((g) => `<a class="pf-jump-a" href="#${g.id}"><span class="pf-jump-ph" aria-hidden="true">${pic(THUMB[g.id], { alt: '', sizes: '200px' })}</span><span class="pf-jump-t">${g.title}<span class="pf-jump-c" aria-hidden="true"></span></span></a>`).join('\n        ')}
      </nav>`;

const viewer = `<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Photograph viewer" hidden>
  <div class="lb-in">
    <div class="lb-top">
      <div class="lb-bars" aria-hidden="true"></div>
      <div class="lb-bar-row">
        <span class="lb-chip"><span class="lb-dot" aria-hidden="true"></span>${SITE.handle}</span>
        <p class="lb-count" aria-live="polite"></p>
        <button class="lb-x" type="button" data-lb-close aria-label="Close the viewer"><span aria-hidden="true"></span></button>
      </div>
    </div>
    <div class="lb-stage" data-lb-stage>
      <div class="lb-card"><img class="lb-img" alt="" decoding="async"></div>
    </div>
    <div class="lb-foot">
      <button class="lb-nav lb-prev" type="button" data-lb-prev aria-label="Previous photograph"><span aria-hidden="true"></span></button>
      <p class="lb-cap"></p>
      <button class="lb-nav lb-next" type="button" data-lb-next aria-label="Next photograph"><span aria-hidden="true"></span></button>
    </div>
    <p class="lb-hint" aria-hidden="true">Tap to go on &middot; swipe down to close</p>
  </div>
</div>`;

export const portfolio = () => {
  seq = 0;
  const groups = PORTFOLIO.map(group).join('\n      ');
  return page({
    path: 'portfolio',
    title: 'Portfolio',
    description: `${N_PHOTOS} looks by ${SITE.name}, ${SITE.role.toLowerCase()} in ${SITE.areaLong}, from bridal and wedding-day glam to soft glam, full glam and glam waves, with film among the photographs.`,
    css: ['pages-work'],
    js: ['pages-work'],
    main: `${cover({
      kick: PORTFOLIO_PAGE.kick,
      heading: PORTFOLIO_PAGE.heading,
      sub: PORTFOLIO_PAGE.sub(N),
      cls: 'pf-cover',
      actions: `${actions()}
      ${jump}`,
    })}
<div class="pf" id="work">
  <div class="wrap pf-in">
    ${filterBar}
    <div class="pf-groups" data-pf>
      ${groups}
      <p class="pf-empty" hidden></p>
    </div>
  </div>
</div>
<section class="pf-ig f-cream" aria-label="Instagram">
  <div class="wrap">
    <a class="pf-ig-a" href="${L.ig}" rel="external"><span class="pf-ig-k">More looks, more film</span><span class="pf-ig-t">${PORTFOLIO_PAGE.ig}</span><span class="pf-ig-go" aria-hidden="true">${arrow}</span></a>
  </div>
</section>
${cta({ kick: PORTFOLIO_PAGE.noteKick, copy: PORTFOLIO_PAGE.note })}
${viewer}`,
  });
};

/* ================================================================ reviews */

const stars = '<span class="rw-stars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>';
const siteCard = (s, i) => `<li class="rs rs--${i === 0 ? 'peach' : 'white'}">
        <a class="rs-a" href="${s.href}" rel="external">
          <span class="rs-top"><span class="rs-score">${s.score}<span class="sr"> out of 5</span></span>${stars}</span>
          <span class="rs-name">${s.name}</span>
          <span class="rs-meta">${s.meta}</span>
          <span class="rs-go">${s.go} ${arrow}</span>
        </a>
      </li>`;

const firstSentence = REVIEWS.sub.slice(0, REVIEWS.sub.indexOf('.') + 1);
const [eh1, eh2] = (() => { const k = REVIEWS.emptyHeading.indexOf(',') + 1; return [REVIEWS.emptyHeading.slice(0, k), REVIEWS.emptyHeading.slice(k).trim()]; })();

export const reviews = () => page({
  path: 'reviews',
  title: 'Reviews',
  description: `${SITE.name} is rated ${REVIEWS.sites.map((s) => `${s.score} on ${s.name} (${s.meta})`).join(' and ')}, as shown on each site on ${SITE.ratingsAsOf}.`,
  css: ['pages-work'],
  main: `${cover({
    kick: REVIEWS.kick,
    heading: REVIEWS.heading,
    sub: firstSentence,
    cls: 'rw-cover',
    image: { photo: 'bride-gold-waves', sticker: SITE.handle },
  })}
<section class="sec f-cream rw-where" id="where" aria-labelledby="where-h">
  <div class="wrap">
    <header class="sec-hd rv">
      ${kick('Where to read them', 'peach')}
      ${hed(['Two sites,', 'one tap each.'], { id: 'where-h' })}
      <p class="lede">Every review is on the site it was written on. Choose one to read them there.</p>
    </header>
    <ul class="rs-grid" data-stag=".1">
      ${REVIEWS.sites.map(siteCard).join('\n      ')}
    </ul>
    <div class="rs-g rv">
      <span class="rs-g-n">${REVIEWS.google.name}</span>
      <span class="rs-g-l">${REVIEWS.google.line}</span>
      <a class="lnk" href="${REVIEWS.google.href}" rel="external">${REVIEWS.google.go} on ${REVIEWS.google.name} ${arrow}</a>
    </div>
    <p class="small rs-date rv">Ratings and review counts as shown on each site on ${SITE.ratingsAsOf}.</p>
  </div>
</section>
<section class="sec f-gulf rw-empty" id="excerpts" aria-labelledby="excerpts-h">
  <div class="wrap rw-empty-in">
    ${print('wedding-florals', { tilt: 'l', ratio: '4/5', sizes: '(max-width:899px) 84vw, 40vw', cls: 'rw-empty-ph rv-card', cap: lookOf('wedding-florals').cap })}
    <div class="rw-slot rv">
      ${kick(REVIEWS.emptyKick, 'cream')}
      ${hed([eh1, eh2], { size: 'l', id: 'excerpts-h' })}
      <p class="rw-slot-b">${REVIEWS.emptyBody}</p>
      <div class="acts">
        <a class="btn btn--solid" href="${REVIEWS.sites[0].href}" rel="external">${REVIEWS.sites[0].go} ${arrow}</a>
        <a class="btn btn--line" href="${href(S, 'portfolio')}">See the portfolio</a>
      </div>
      <p class="rw-slot-s" aria-hidden="true"><span>Slot</span> excerpts to come &middot; ratings live on each site</p>
    </div>
  </div>
</section>
${cta({ kick: REVIEWS.noteKick, copy: REVIEWS.note })}`,
});
