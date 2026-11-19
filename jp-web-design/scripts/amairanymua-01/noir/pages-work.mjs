/* /demo/amairanymua-01 — site "noir": Portfolio and Reviews (the WORK pages).

   Portfolio is the contact reel: a full-bleed dark wall where her faces float, no cards and
   no frames, every picture dissolving into the black at its edges. The reel is cut into the
   three PORTFOLIO groups (Bridal, Wedding day, Glam & waves) with the four film slots among
   the stills; mono slates filter it and carry true counts. Any photograph opens large in a
   full-screen frame viewer (pages-work.js); without script every tile is a plain link to
   the 1280 file.

   Reviews has public ratings and NO approved quotations, so it says exactly that: the two
   rating sites as designed links, the quieter Google one, a dated line, and the honest
   empty state. No quotation, paraphrase or reviewer is written or implied anywhere. */
import { page, cover, chapter, cta, kick, slate, h, S } from './shell.mjs';
import { PORTFOLIO, PORTFOLIO_PAGE, LOOKS, FILMS, PHOTOS, REVIEWS, SITE, L, href, pic, film, src, srcset, esc, arrow } from '../site.mjs';
/* the bright-ground rule shared by every interior page (defined, with its reasons, in pages-story.mjs) */
import { isPrint } from './pages-story.mjs';

const pad = (n) => String(n).padStart(2, '0');
const N_ALL = PORTFOLIO.reduce((n, g) => n + g.items.length, 0);
const N_PH = PORTFOLIO.reduce((n, g) => n + g.items.filter((x) => x.photo).length, 0);
const N_FI = N_ALL - N_PH;
const lookOf = (k) => LOOKS.find((x) => x.photo === k);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const mix = (g) => {
  const p = g.items.filter((x) => x.photo).length;
  const f = g.items.length - p;
  return `${plural(p, 'photograph', 'photographs')}${f ? ` &middot; ${plural(f, 'film', 'films')}` : ''}`;
};

/* ====================================================================
   PORTFOLIO
   ==================================================================== */
const COVER_IMG = 'bride-gold-waves';
const COVER_SIZES = '(max-width:899px) 100vw, 58vw';

/* One tile of the reel. `n` is its frame number in the whole reel, `i` its place in its group
   (the wall's composition is set per place in pages-work.css). */
let lbIndex = 0;
const tile = (it, n, i) => {
  const kind = it.film ? 'film' : it.span === 'wide' ? 'wide' : it.span === 'big' ? 'big' : 'still';
  const num = `<span class="rl-num"><b>${pad(n)}</b> / ${pad(N_ALL)}</span>`;
  if (it.film) {
    const f = FILMS[it.film];
    return `<li class="rl-t rl-t--${i} rl-k--${kind}">
<div class="rl-f">${film(it.film, { label: f.label, cls: 'rl-film' })}</div>
<p class="slate rl-cap">${num}<span class="sep"></span><span>Film ${pad(f.n)} &middot; ${f.label}</span></p>
</li>`;
  }
  const k = it.photo;
  const p = PHOTOS[k];
  const look = lookOf(k);
  const j = lbIndex++;
  const pr = isPrint(k);
  return `<li class="rl-t rl-t--${i} rl-k--${kind}${pr ? ' rl-pr' : ''}">
<a class="rl-a" href="${src(k, 1280)}" data-lb="${j}" data-srcset="${srcset(k)}" data-w="${p.w}" data-h="${p.h}" data-cap="${esc(look.cap)}" data-n="${pad(n)}">
<span class="rl-ph${pr ? ' print' : ''}">${pic(k, { sizes: '(min-width:900px) 46vw, (min-width:600px) 60vw, 92vw' })}</span>
<span class="vh">, open large</span>
</a>
<p class="slate rl-cap">${num}<span class="sep"></span><span>${look.cap}</span></p>
</li>`;
};

const reel = () => {
  lbIndex = 0;
  let n = 0;
  return PORTFOLIO.map((g, gi) => `<section class="rl-g" id="${g.id}" data-group="${g.id}" aria-labelledby="rl-${g.id}">
<header class="wrap rl-gh">
<p class="slate slate--champ rl-gn"><b>${pad(gi + 1)}</b> / ${pad(PORTFOLIO.length)}<span class="sep"></span>${plural(g.items.length, 'frame', 'frames')}</p>
<h2 class="d-m rl-gt rv-mask" id="rl-${g.id}"><em>${g.title}.</em></h2>
<p class="body rl-gl rv">${g.line}</p>
<p class="slate rl-gm rv">${mix(g)}</p>
</header>
<ol class="rl-wall" start="${n + 1}">
${g.items.map((it, i) => tile(it, ++n, i)).join('\n')}
</ol>
</section>`).join('\n');
};

/* The filter: real buttons with aria-pressed, each a slate with its true count. Shown by the
   script (hidden without it, where the group links below do the work instead). */
const filters = () => `<div class="rl-bar" id="reelBar">
<div class="wrap rl-bar-in">
<div class="rl-fl" role="group" aria-label="Show looks" data-reel-filter hidden>
<button type="button" class="rl-b" data-f="all" data-t="all looks" data-now="${plural(N_PH, 'photograph', 'photographs')} &middot; ${plural(N_FI, 'film', 'films')}" aria-pressed="true">All <b>${pad(N_ALL)}</b></button>
${PORTFOLIO.map((g) => `<button type="button" class="rl-b" data-f="${g.id}" data-t="${esc(g.title)}" data-now="${mix(g)}" aria-pressed="false">${g.title} <b>${pad(g.items.length)}</b></button>`).join('\n')}
</div>
<nav class="rl-jump" aria-label="Portfolio groups">
${PORTFOLIO.map((g) => `<a class="rl-b" href="#${g.id}">${g.title} <b>${pad(g.items.length)}</b></a>`).join('\n')}
</nav>
<p class="slate rl-now" id="reelNow" aria-live="polite">${plural(N_PH, 'photograph', 'photographs')} &middot; ${plural(N_FI, 'film', 'films')}</p>
</div>
</div>`;

/* The full-screen frame viewer. Inert markup until the script opens it. */
const viewer = () => `<div class="lb" id="lightbox" aria-label="Photograph viewer">
<div class="lb-top">
<p class="slate lb-n" aria-live="polite"><b id="lbI">01</b> / <span id="lbT">${pad(N_PH)}</span></p>
<button type="button" class="lb-x" id="lbClose"><span>Close</span><i aria-hidden="true"></i></button>
</div>
<div class="lb-stage" id="lbStage"><img id="lbImg" alt="" decoding="async"></div>
<div class="lb-foot">
<button type="button" class="lb-nav lb-prev" id="lbPrev" aria-label="Previous photograph"><span aria-hidden="true">&larr;</span></button>
<p class="lb-cap" id="lbCap"></p>
<button type="button" class="lb-nav lb-next" id="lbNext" aria-label="Next photograph"><span aria-hidden="true">&rarr;</span></button>
</div>
</div>`;

export const portfolio = () => page({
  path: 'portfolio',
  title: 'Portfolio',
  description: `Bridal, wedding-day and glam work by ${SITE.name}, luxury hair + makeup artist in ${SITE.area}: ${N_PH} photographs and ${N_FI} films.`,
  head: `<link rel="preload" as="image" href="${src(COVER_IMG, 800)}" imagesrcset="${srcset(COVER_IMG)}" imagesizes="${COVER_SIZES}">`,
  css: ['pages-work'],
  js: ['pages-work'],
  bodyClass: 'pg-reel',
  main: `${cover({ kick: PORTFOLIO_PAGE.kick, heading: PORTFOLIO_PAGE.heading, sub: PORTFOLIO_PAGE.sub(N_ALL), image: COVER_IMG })}
<div class="rl" id="reel" aria-label="The portfolio" role="region">
${filters()}
<div class="rl-groups" id="reelGroups">
${reel()}
</div>
</div>
<section class="sec rl-ig" aria-labelledby="igH">
<div class="wrap">
<hr class="rule rv-line">
<div class="rl-ig-in">
${slate(`${SITE.handle} <span class="sep"></span> Instagram`, 'slate--champ rv')}
<h2 class="d-m rv-mask" id="igH">The reel <em>continues.</em></h2>
<p class="rv" style="--d:.12s"><a class="lnk" href="${L.ig}" rel="external">${PORTFOLIO_PAGE.ig} ${arrow}</a></p>
</div>
</div>
</section>
${cta({ kick: PORTFOLIO_PAGE.noteKick, copy: PORTFOLIO_PAGE.note })}
${viewer()}`,
});

/* ====================================================================
   REVIEWS
   ==================================================================== */
const stars = () => `<span class="rs-stars" aria-hidden="true">${'<i></i>'.repeat(5)}</span>`;
const EMPTY_IMG = 'wedding-night';
/* a cover dissolves into the black, so it is one of the dark-ground portraits (see PRINT) */
const REV_COVER = 'bride-crystal';
const [eA, eB] = (() => { const t = REVIEWS.emptyHeading; const c = t.indexOf(','); return c > 0 ? [t.slice(0, c + 1), t.slice(c + 2)] : [t, '']; })();

const siteLink = (r, i) => `<li class="rs rv" style="--d:${(i * 0.1).toFixed(2)}s">
<a class="rs-a" href="${r.href}" rel="external">
<span class="slate rs-k"><b>${pad(i + 1)}</b> / ${pad(REVIEWS.sites.length)}<span class="sep"></span>Rating</span>
<span class="rs-score"><span class="rs-num">${r.score}</span><span class="vh"> out of 5 on ${r.name}</span>${stars()}</span>
<span class="rs-name">${r.name}</span>
<span class="slate slate--bone rs-meta">${r.meta}</span>
<span class="lnk rs-go">${r.go} ${arrow}</span>
</a>
</li>`;

export const reviews = () => page({
  path: 'reviews',
  title: 'Reviews',
  description: `${SITE.name} is rated ${REVIEWS.sites.map((r) => `${r.score} on ${r.name} (${r.meta})`).join(' and ')}, as shown on each site on ${SITE.ratingsAsOf}.`,
  head: `<link rel="preload" as="image" href="${src(REV_COVER, 800)}" imagesrcset="${srcset(REV_COVER)}" imagesizes="${COVER_SIZES}">`,
  css: ['pages-work'],
  bodyClass: 'pg-reviews',
  main: `${cover({ kick: REVIEWS.kick, heading: REVIEWS.heading, sub: REVIEWS.sub, image: REV_COVER })}
<section class="sec sec--join rs-sec" aria-labelledby="rsH">
<div class="wrap">
${chapter({ kick: REVIEWS.sites.map((r) => r.name).join(' &middot; '), heading: ['Where to', 'read them.'], id: 'rsH-wrap' }).replace('<h2 class="', '<h2 id="rsH" class="')}
<ul class="rs-list">
${REVIEWS.sites.map(siteLink).join('\n')}
</ul>
<div class="rs-g rv">
<p class="slate rs-g-k">${REVIEWS.google.name}</p>
<p class="rs-g-l">${REVIEWS.google.line}</p>
<a class="lnk" href="${REVIEWS.google.href}" rel="external">${REVIEWS.google.go} on ${REVIEWS.google.name} ${arrow}</a>
</div>
<p class="small rs-asof rv">Ratings and review counts as shown on each site on ${SITE.ratingsAsOf}.</p>
</div>
</section>
<section class="sec rs-empty" aria-labelledby="reH">
<div class="rs-e-ph">${pic(EMPTY_IMG, { sizes: '(min-width:900px) 54vw, 100vw' })}</div>
<div class="wrap rs-e-in">
<div class="rs-e-txt">
${kick(REVIEWS.emptyKick, 'rv')}
${h(2, [eA, eB], 'd-m rv-mask', 'id="reH"')}
<p class="body rv" style="--d:.1s">${REVIEWS.emptyBody}</p>
<div class="acts rs-e-acts rv" style="--d:.18s"><a class="btn btn--line" href="${REVIEWS.sites[0].href}" rel="external">${REVIEWS.sites[0].go} ${arrow}</a><a class="lnk" href="${href(S, 'portfolio')}">See the portfolio ${arrow}</a></div>
</div>
</div>
</section>
${cta({ kick: REVIEWS.noteKick, copy: REVIEWS.note })}`,
});
