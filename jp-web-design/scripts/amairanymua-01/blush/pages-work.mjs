/* /demo/amairanymua-01 — site "blush": Portfolio, Journal and the two sample posts (WORK).

   Portfolio — a title card with both ways to book and a picture beside her film; "The Looks": the
   kit's rail of rounded cards, stills from LOOKS3 with real clips among them, advancing on its own
   (pause, arrows, swipe); "The Reel": her clips in round windows with titles, credits and the
   pinned view counts, dated SOCIAL.asOf, and "Watch more on TikTok"; then every look in LOOKS3 in a
   soft grid with filter chips by LOOK_CATS3 and a viewer (pages-work.js: a dialog with focus moved
   in and trapped, Escape and Close, arrows and swipe, a counter and caption, the larger file on
   demand, "Watch the clip" where a look has one; without script each tile links to its largest
   file); the closing invitation with Instagram and TikTok.
   Journal — the index (two cards) and the two posts as editorial articles built ONLY from her own
   words: (1) HER.prepare, the trial and extensions answers in HER.faq and the touch-up points of
   HER.packages; (2) HER.destination and the travel answer. Article voice is third person; her own
   lines are quoted as hers. Every card and post carries the "Sample article" label.

   Honesty: nothing is stated here that site.mjs does not hold. Credited looks and clips always say
   "Makeup by Amairany · <credit>" (frame() and film() print it; the grid and viewer print it here). */
import { page, S, kicker, h, mix, lede, script, bookingLine, actions, more, next, frame, filmFrame, section, secHead, closing, rail, reels, quote, socialLine, seal, FILM_FROM, arrow } from './shell.mjs';
import { SITE, HER, SOCIAL, FILMS, PHOTOS, LOOKS3, LOOK_CATS3, looksIn3, PORTFOLIO_PAGE, L, A, href, inquire, book, pic, src, srcset, esc } from '../site.mjs';

const credit = (c) => (c ? `Makeup by ${SITE.first} &middot; ${c}` : '');
const widths = (k) => PHOTOS[k].widths ?? [480, 800, 1280];
const largest = (k) => widths(k).slice(-1)[0];
const lookOf = (photo) => LOOKS3.find((l) => l.photo === photo);
const lookOfFilm = (id) => LOOKS3.find((l) => l.film === id);
const plain = (t) => String(t).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&middot;/g, '·').replace(/&rsquo;|’/g, '’');
const preload = (k, sizes) => `<link rel="preload" as="image" imagesrcset="${srcset(k)}" imagesizes="${sizes}" fetchpriority="high">`;
const PLAY = '<svg class="i-play" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3.2 1.6v8.8L10.4 6z"/></svg>';

/* ======================================================================
   PORTFOLIO
   ====================================================================== */

/* The Looks: stills with clips among them. A clip is never next to its own still, and none with
   burned-in text (f1, f3, f11) leads here. Captions are the looks' own (LOOKS3). */
const RAIL_ITEMS = [
  { photo: 'reel-morning-veil' }, { photo: 'bride-crystal' }, { film: 'f4' }, { photo: 'reel-bride-pearls-updo' },
  { photo: 'bride-gold-waves' }, { film: 'f9' }, { photo: 'reel-burgundy' }, { photo: 'glam-sculpt' },
  { photo: 'reel-copper' }, { film: 'f8' }, { photo: 'bride-ruby' }, { photo: 'reel-red-waves' },
  { photo: 'waves-blonde' }, { film: 'f12' }, { photo: 'wedding-night' }, { photo: 'bride-pearls' },
].map((it) => (it.photo ? { photo: it.photo, cap: lookOf(it.photo).cap } : { film: it.film, cap: lookOfFilm(it.film).cap, label: FILMS[it.film].label }));

/* The Reel: her three pinned posts first (the only view counts worth quoting), then five more.
   With the title card's clip and the four in The Looks, 13 of her 14 clips are on the page. */
const PINNED = SOCIAL.pinned.map((p) => p.film);
const REEL_IDS = [...PINNED, 'f5', 'f7', 'f3', 'f10', 'f1'];
const COVER_FILM = 'f6';
const CLIPS = new Set([COVER_FILM, ...REEL_IDS, ...RAIL_ITEMS.filter((x) => x.film).map((x) => x.film)]).size;

const pfCover = () => `<section class="cover cover--art pf-cover" aria-labelledby="pfH">
<div class="wrap cover-in"><div class="cover-txt">
${kicker(PORTFOLIO_PAGE.kick, 'rv')}
${h(1, `${PORTFOLIO_PAGE.heading[0]} *${PORTFOLIO_PAGE.heading[1]}*`, 'd-xl rv', 'id="pfH"')}
${lede(`Brides first, then soft glam, full glam, hair and editorial colour: ${LOOKS3.length} looks and ${CLIPS} of her own clips, real clients in real light.`, 'rv')}
<div class="rv">${actions()}</div>
${bookingLine('rv')}
<nav class="pf-jump rv" aria-label="On this page"><a href="#looks">The Looks</a><a href="#reel">The Reel</a><a href="#every-look">Every look</a></nav>
</div>
<div class="cover-art"><div class="pair pf-pair">${frame('bride-gold-waves', { shape: 'arch', eager: true, rv: '', cls: 'pair-ph', sizes: '(max-width:899px) 60vw, 330px', cap: lookOf('bride-gold-waves').cap })}${filmFrame(COVER_FILM, { shape: 'circle', rv: '', cls: 'pair-film', cap: FILMS[COVER_FILM].title })}</div></div>
</div>
</section>`;

const pfLooks = () => section({ id: 'looks', tone: 'paper', cls: 'pf-looks', labelledby: 'looksH', wrap: false }, `
<div class="wrap">${secHead({ kick: 'The Looks', heading: 'Soft glam to *full glam.*', id: 'looksH', line: 'Photographs and clips of her work, moving on their own. Swipe, use the arrows, or pause on a look you love.' })}</div>
<div class="rv">${rail({ id: 'pfLooks', items: RAIL_ITEMS, label: 'The Looks', auto: 3800 })}</div>
<div class="wrap">${next({ line: 'Seen your look?', go: [inquire(S, `Bring it to your inquiry ${arrow}`, 'more'), more('#every-look', 'See every look')] })}</div>`);

const pfReel = () => section({ id: 'reel', tone: 'cream', cls: 'pf-reel', labelledby: 'reelH' }, `
${secHead({ kick: `The Reel &middot; ${SITE.handle}`, heading: 'Her clips, *in motion.*', id: 'reelH', line: 'Silent clips of her brides and her glam, from her own TikTok. Her three pinned posts come first.' })}
${reels({ ids: REEL_IDS, cls: 'pf-reels' })}
<div class="pf-reel-foot rv">${socialLine()}<p class="pf-asof">View counts as shown on her pinned TikTok posts on ${SOCIAL.asOf}.</p></div>
${next({ go: [more(L.tiktok, 'Watch more on TikTok'), inquire(S, `Begin your inquiry ${arrow}`, 'more')] })}`);

/* every look: one soft grid in LOOKS3 order, chips by LOOK_CATS3 (counts from looksIn3) */
const TILE_SIZES = '(max-width:759px) 46vw, (max-width:1099px) 31vw, 280px';
const tile = (l, i) => {
  const p = PHOTOS[l.photo];
  const big = largest(l.photo);
  const f = l.film && FILMS[l.film]?.file ? FILMS[l.film] : null;
  const cr = credit(l.credit ?? p.credit);
  const film = f ? ` data-film="${A}/film/${f.file}.mp4" data-poster="${A}/film/${f.file}.jpg" data-film-alt="${esc(f.alt)}" data-film-pos="${f.pos}" data-film-t="${esc(f.title)}"${FILM_FROM[l.film] ? ` data-film-from="${FILM_FROM[l.film]}"` : ''}` : '';
  return `<li class="pa-i rv" data-cats="${l.cats.join(' ')}">
<figure class="fr fr--card pa-f"><a class="fr-m pa-a" href="${src(l.photo, big)}" data-v="${i}" data-key="${l.photo}" data-w="${p.w}" data-h="${p.h}" data-big="${big}" data-ws="${widths(l.photo).join(',')}" data-pos="${p.pos}" data-alt="${esc(p.alt)}" data-cap="${esc(l.cap)}"${cr ? ` data-credit="${esc(cr)}"` : ''}${film}><span class="sr">View larger: </span>${pic(l.photo, { sizes: TILE_SIZES })}${f ? `<span class="pa-clip" aria-hidden="true">${PLAY}<span>Clip</span></span><span class="sr"> (with a clip)</span>` : ''}<span class="pa-plus" aria-hidden="true"></span></a>
<figcaption class="cap">${l.cap}${cr ? `<span class="cap-cr">${cr}</span>` : ''}</figcaption></figure>
</li>`;
};
const chips = () => {
  const all = [['all', 'All looks', LOOKS3.length], ...Object.entries(LOOK_CATS3).map(([k, v]) => [k, v, looksIn3(k).length])];
  return `<div class="pf-chips" role="group" aria-label="Show looks by category" hidden>${all.map(([k, v, n], i) => `<button class="pf-chip" type="button" data-cat="${k}" aria-pressed="${i === 0}" aria-controls="pfAll"><span class="pf-chip-t">${v}</span><span class="pf-chip-n" aria-hidden="true">${n}</span><span class="sr">, ${n} looks</span></button>`).join('')}</div>`;
};
const pfAll = () => section({ id: 'every-look', tone: 'blush', cls: 'pf-all', labelledby: 'allH' }, `
${secHead({ kick: `Every look &middot; ${LOOKS3.length}`, heading: 'Choose a look, *up close.*', id: 'allH', line: 'Bridal, soft glam, full glam, hair, editorial and the wedding day itself. Tap any look to see it larger; where there is a clip, you can watch it.' })}
${chips()}
<p class="sr" id="pfLive" aria-live="polite"></p>
<ul class="pa" id="pfAll">${LOOKS3.map(tile).join('')}</ul>
${next({ line: PORTFOLIO_PAGE.note, go: [inquire(S, `Begin your inquiry ${arrow}`, 'more'), book('event', `Book event glam ${arrow}`, 'more')] })}`);

/* the viewer: appended after the scripts, moved to <body> by pages-work.js (hidden until opened) */
const viewer = () => `<div class="bv" id="lookViewer" role="dialog" aria-modal="true" aria-labelledby="bvT" hidden>
<div class="bv-top">
<p class="bv-n" id="bvT"><span class="sr">The Looks: look </span><span data-bv-n>01</span><span class="bv-of" aria-hidden="true"> / </span><span class="sr"> of </span><span data-bv-t>${LOOKS3.length}</span></p>
<button class="menu-x bv-x" type="button" data-bv-close><span>Close</span><i aria-hidden="true"></i></button>
</div>
<div class="bv-stage" data-bv-stage>
<div class="bv-box" data-bv-box><img class="bv-img" data-bv-img alt="" width="576" height="1024" decoding="async"></div>
</div>
<div class="bv-foot">
<button class="ic bv-arr bv-arr--p" type="button" data-bv-prev aria-label="Previous look"><span aria-hidden="true">&larr;</span></button>
<button class="ic bv-arr bv-arr--n" type="button" data-bv-next aria-label="Next look"><span aria-hidden="true">&rarr;</span></button>
<div class="bv-txt"><p class="bv-cap" data-bv-cap aria-live="polite"></p><p class="bv-cr" data-bv-cr hidden></p></div>
<div class="bv-tools">
<button class="btn btn--soft btn--sm bv-clip" type="button" data-bv-clip aria-pressed="false" hidden>${PLAY}<span data-bv-clip-t>Watch the clip</span></button>
<button class="btn btn--soft btn--sm bv-zoom" type="button" data-bv-zoom aria-pressed="false" hidden><span class="bv-zi" aria-hidden="true"></span><span data-bv-zoom-t>See it larger</span></button>
${inquire(S, `Begin your inquiry ${arrow}`, 'more bv-inq')}
</div>
</div>
</div>`;

const pfClose = () => closing({
  kick: PORTFOLIO_PAGE.noteKick,
  line: PORTFOLIO_PAGE.note,
  image: 'bride-pearls',
}).replace(bookingLine('rv'), `${bookingLine('rv')}<p class="pf-follow rv"><a class="more" href="${L.ig}" rel="external">${PORTFOLIO_PAGE.ig} ${arrow}</a><a class="more" href="${L.tiktok}" rel="external">TikTok ${SITE.handle} ${arrow}</a></p>`);

export const portfolio = () => page({
  path: 'portfolio',
  title: 'Portfolio',
  description: `Bridal and event hair and makeup by ${SITE.name} in ${SITE.area}: ${LOOKS3.length} looks and ${CLIPS} of her own clips, soft glam to full glam.`,
  head: preload('bride-gold-waves', '(max-width:899px) 60vw, 330px'),
  css: ['pages-work'],
  js: ['pages-work'],
  bodyClass: 'pg-portfolio',
  main: `${pfCover()}
${pfLooks()}
${pfReel()}
${pfAll()}
${pfClose()}`,
  foot: viewer(),
});

/* ======================================================================
   JOURNAL
   ====================================================================== */
const LABEL = `Sample article, to be written with ${SITE.first}`;
const label = (cls = '') => `<p class="chip jl${cls ? ` ${cls}` : ''}">${LABEL}</p>`;
const faqA = (re) => (HER.faq.find(([q]) => re.test(q)) ?? [])[1];
const TRIAL = faqA(/trials/i);
const EXT = faqA(/extensions/i);
const TRAVEL = faqA(/travel/i);
/* the touch-up kit and post-ceremony touch-up points, package by package, exactly as listed */
const TOUCH = HER.packages.map((p) => ({ name: p.name, who: p.who.replace(/\s*·\s*most popular/i, ''), pts: p.points.filter((x) => /touch-up/i.test(x)) })).filter((p) => p.pts.length);

const POSTS = [
  {
    path: 'journal/how-to-prepare', image: 'artist-brushes', kick: 'Getting ready', title: 'How to prepare for *your glam*',
    dek: 'Come in with a clean face, hair washed and blown out a day before: her own notes for getting ready, with previews, extensions and touch-ups.',
  },
  {
    path: 'journal/destination-bride', image: 'golden-hour', kick: 'Travel', title: 'Destination *bride?*',
    dek: 'She travels worldwide for her brides: reach out directly to discuss travel availability and receive a custom quote.',
  },
];
const titleText = (p) => p.title.replace(/\*/g, '');

const jCard = (p, i) => `<article class="jc${i % 2 ? ' jc--r' : ''} rv" aria-labelledby="jc${i}">
<a class="jc-im" href="${href(S, p.path)}" tabindex="-1" aria-hidden="true">${frame(p.image, { shape: 'card', sizes: '(max-width:899px) 88vw, 520px', rv: '', alt: '' })}</a>
<div class="jc-txt">
${label()}
<p class="jc-k">${p.kick}</p>
<h2 class="d-l jc-t" id="jc${i}"><a href="${href(S, p.path)}">${mix(p.title)}</a></h2>
<p class="jc-d">${p.dek}</p>
${more(href(S, p.path), 'Read the article')}
</div>
</article>`;

export const journal = () => page({
  path: 'journal',
  title: 'Journal',
  description: `Two sample articles built from ${SITE.name}’s own words: how to prepare for your bridal glam, and booking her as a destination bride.`,
  head: preload('artist-spotlight-crop', '(max-width:899px) 70vw, 34vw'),
  css: ['pages-work'],
  bodyClass: 'pg-journal',
  main: `<section class="cover cover--art jx-cover" aria-labelledby="jxH">
<div class="wrap cover-in"><div class="cover-txt">
${kicker('The journal', 'rv')}
${h(1, 'Notes from *her chair.*', 'd-xl rv', 'id="jxH"')}
${lede('Short guides in her own words, for the months before the wedding: how to arrive for your glam, and how she travels for her brides.', 'rv')}
<div class="rv">${actions()}</div>
${bookingLine('rv')}
</div>
<div class="cover-art"><figure class="fr fr--arch jx-fig"><div class="fr-m">${pic('artist-spotlight-crop', { sizes: '(max-width:899px) 70vw, 34vw', eager: true })}</div><figcaption class="cap">${SITE.name} &middot; ${SITE.handle}</figcaption></figure>${seal({ cls: 'jx-seal seal--spin' })}</div>
</div>
</section>
${section({ tone: 'paper', cls: 'jx', labelledby: 'jxListH' }, `
<h2 class="sr" id="jxListH">The articles</h2>
<div class="jx-list">${POSTS.map(jCard).join('')}</div>
${next({ line: 'Have a question for her?', go: [inquire(S, `Ask it in your inquiry ${arrow}`, 'more'), more(href(S, 'bridal'), 'See bridal packages')] })}`)}
${closing({ image: 'bride-crystal' })}`,
});

/* ---------- the two posts ---------- */
const postHead = (p, { id, crop, pos }) => `<header class="ar-hd">
<div class="wrap ar-hd-in">
<p class="ar-crumb rv"><a href="${href(S, 'journal')}">Journal</a><span aria-hidden="true"> / </span><span>${p.kick}</span></p>
${label('rv')}
${h(1, p.title, 'd-xl ar-h rv', `id="${id}"`)}
${lede(p.dek, 'ar-dek rv')}
<p class="ar-by rv">${seal({ cls: 'ar-by-seal' })}<span>Her words, quoted as she wrote them</span></p>
<div class="acts acts--center ar-acts rv">${inquire(S, `Begin your inquiry ${arrow}`, 'btn btn--pri btn--sm')}${book('event', 'Book event glam', 'btn btn--sec btn--sm')}</div>
</div>
<div class="wrap ar-fig-w">${frame(p.image, { shape: 'wide', eager: true, rv: '', pos, cls: `ar-fig ar-fig--${crop}`, sizes: '(max-width:599px) 92vw, (max-width:1199px) 90vw, 1100px' })}</div>
</header>`;

/* prev / next between the two posts, and the way back to the index */
const pn = (at) => {
  const other = POSTS[at === 0 ? 1 : 0];
  const dir = at === 0 ? 'Next article' : 'Previous article';
  return section({ tone: 'cream', cls: 'pn-sec', label: 'More from the journal' }, `<nav class="pn" aria-label="More from the journal">
<a class="pn-a pn-a--${at === 0 ? 'next' : 'prev'}" href="${href(S, other.path)}">${frame(other.image, { shape: 'circle', sizes: '96px', rv: '', alt: '' })}<span class="pn-t"><span class="pn-k">${at === 0 ? '' : '<span aria-hidden="true">&larr; </span>'}${dir}${at === 0 ? ' <span aria-hidden="true">&rarr;</span>' : ''}</span><span class="pn-h">${mix(other.title)}</span><span class="pn-l">${LABEL}</span></span></a>
<a class="pn-b" href="${href(S, 'journal')}"><span class="pn-k">The journal</span><span class="pn-h">All <em>articles</em></span></a>
</nav>`);
};
const bridalLinks = (line) => next({ line, cls: 'next--left', go: [more(href(S, 'bridal'), 'See the bridal packages'), inquire(S, `Begin your bridal inquiry ${arrow}`, 'more')] });

/* (1) How to prepare: HER.prepare, the trial and extensions answers, the touch-up points */
export const postPrepare = () => {
  const p = POSTS[0];
  return page({
    path: p.path,
    title: titleText(p),
    description: `${SITE.first} asks brides to come in with a clean face and hair washed and blown out a day before; previews, extensions and touch-ups, in her own words.`,
    head: preload(p.image, '(max-width:599px) 92vw, (max-width:1199px) 90vw, 1100px'),
    css: ['pages-work'],
    bodyClass: 'pg-post',
    main: `<article class="ar" aria-labelledby="arH">
${postHead(p, { id: 'arH', crop: 'brushes', pos: '50% 18%' })}
${section({ tone: 'cream', cls: 'ar-sec ar-sec--first', labelledby: 'a1H' }, `<div class="ar-col">
${kicker('Before you sit down', 'rv')}
${h(2, 'Two notes from *her chair.*', 'd-l rv', 'id="a1H"')}
<p class="ar-p rv">Before any appointment, ${SITE.first} asks for two things, in her own words:</p>
<figure class="ar-notes-f"><ol class="ar-notes" data-stag=".12">${HER.prepare.map((x, i) => `<li class="rv"><span class="ar-nn" aria-hidden="true">${i + 1}</span><blockquote><p>${x}</p></blockquote></li>`).join('')}</ol><figcaption class="ar-notes-c rv">${SITE.first}</figcaption></figure>
</div>`)}
${section({ tone: 'paper', cls: 'ar-sec', labelledby: 'a2H' }, `<div class="ar-col">
${kicker('The preview', 'rv')}
${h(2, 'Your look, *before the day.*', 'd-l rv', 'id="a2H"')}
<p class="ar-p rv">Preview sessions are available for both hair and makeup. Her bridal packages already include the preview, and a separate trial session can be booked before signing.</p>
${quote(TRIAL, SITE.first, 'ar-pq rv')}
${next({ cls: 'next--left rv', go: [more(href(S, 'bridal'), 'See what each package includes')] })}
</div>`)}
${section({ tone: 'cream', cls: 'ar-sec', labelledby: 'a3H' }, `<div class="ar-col">
${kicker('Glam waves', 'rv')}
${h(2, 'On *hair extensions.*', 'd-l rv', 'id="a3H"')}
<p class="ar-p rv">For the most volume and the longest-lasting glam waves, ${SITE.first} highly recommends extensions. They can be rented directly from her, or she can guide you toward the best ones to buy.</p>
${quote(EXT, SITE.first, 'ar-pq rv')}
</div>`)}
${section({ tone: 'blush', cls: 'ar-sec ar-touch', labelledby: 'a4H' }, `<div class="ar-col ar-col--wide">
${kicker('After the ceremony', 'rv')}
${h(2, `Touch-ups, ${script('package')} by package.`, 'd-l rv', 'id="a4H"')}
<p class="ar-p rv">Every bridal package lists its own touch-ups: a touch-up kit, time after the ceremony, or both. Here they are, exactly as her booking page lists them.</p>
<ul class="tu" data-stag=".08">${TOUCH.map((t) => `<li class="tu-i rv"><p class="tu-n">${t.name}</p><p class="tu-w">${t.who}</p><ul class="tu-l">${t.pts.map((x) => `<li>${x}</li>`).join('')}</ul></li>`).join('')}</ul>
<p class="pk-note rv">${HER.packagesNote}</p>
${bridalLinks('Ready to choose yours?')}
</div>`)}
</article>
${pn(0)}
${closing({ image: 'bride-ruby' })}`,
  });
};

/* (2) Destination bride: HER.destination and the travel answer */
export const postDestination = () => {
  const p = POSTS[1];
  const [d1, d2, d3] = HER.destination.body.split(/(?<=[.!])\s+/);
  return page({
    path: p.path,
    title: titleText(p),
    description: `${SITE.first} travels worldwide for her brides, and across Central Florida and out of state: reach out directly for travel availability and a custom quote.`,
    head: preload(p.image, '(max-width:599px) 92vw, (max-width:1199px) 90vw, 1100px'),
    css: ['pages-work'],
    bodyClass: 'pg-post',
    main: `<article class="ar" aria-labelledby="arH">
${postHead(p, { id: 'arH', crop: 'golden', pos: '42% 30%' })}
${section({ tone: 'cream', cls: 'ar-sec ar-sec--first', labelledby: 'b1H' }, `<div class="ar-col">
${kicker('Destination weddings', 'rv')}
${h(2, 'She travels *for her brides.*', 'd-l rv', 'id="b1H"')}
<p class="ar-p rv">${SITE.first} travels worldwide for her brides. For a destination wedding, reach out to her directly to discuss travel availability and receive a custom quote.</p>
${quote(d1, SITE.first, 'ar-pq rv')}
</div>`)}
${section({ tone: 'blush', cls: 'ar-sec ar-band', labelledby: 'b2H' }, `<div class="ar-band-in">
${seal({ cls: 'ar-band-seal seal--plain seal--spin' })}
<div class="ar-band-txt">
${kicker('In her words', 'rv')}
<h2 class="d-l rv" id="b2H">${script('Wherever')} ${mix('you say *I do.*')}</h2>
${quote(`${d2} ${d3}`, SITE.first, 'ar-pq ar-pq--lg rv')}
</div>
</div>`)}
${section({ tone: 'cream', cls: 'ar-sec', labelledby: 'b3H' }, `<div class="ar-col">
${kicker('Closer to home', 'rv')}
${h(2, 'Across Central Florida, *and out of state.*', 'd-l rv', 'id="b3H"')}
<p class="ar-p rv">Asked whether she travels, her answer is yes: all across Central Florida and out of state.</p>
${quote(TRAVEL, SITE.first, 'ar-pq rv')}
<div class="ar-ways" data-stag=".1">
<div class="ar-way rv"><p class="ar-way-k">Your wedding</p><p class="ar-way-h">${mix('Start a *bridal inquiry.*')}</p><p class="ar-way-p">Your date, your timeline and who is getting ready with you.</p>${inquire(S, `Begin your inquiry ${arrow}`, 'btn btn--pri btn--sm')}</div>
<div class="ar-way rv"><p class="ar-way-k">Reach out directly</p><p class="ar-way-h">${mix('Write to *Amairany.*')}</p><p class="ar-way-p">For travel availability and a custom quote.</p><a class="btn btn--sec btn--sm" href="${L.mail}">Email ${SITE.first} ${arrow}</a></div>
</div>
${bridalLinks('Planning the rest of the day?')}
</div>`)}
</article>
${pn(1)}
${closing({ image: 'glam-bronze' })}`,
  });
};
