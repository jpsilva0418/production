/* /demo/amairanymua-01 — site "maison": the WORK pages.
   portfolio()        The title card (on black), The Looks (a runway: pinned and driven by the scroll on
                      wide screens, a swipe rail on phones, film among the stills), The Reel (the four
                      film frames), every look by category with a viewer, the invitation to follow her,
                      and the red band.
   journal()          The index: the two sample articles as editorial cards.
   postPrepare()      "How to prepare for your glam": HER.prepare, the trial and extension answers in
                      HER.faq, and the touch-up points in HER.packages. Nothing else.
   postDestination()  "Destination bride?": HER.destination and the travel answer in HER.faq. Nothing else.
   Every fact is read from site.mjs; her own lines are quoted in the first person, the article voice
   is third person. Styles: assets/maison/pages-work.css; behaviour: assets/maison/pages-work.js. */
import { page, S, cover, section, kicker, h, note, bookingLine, more, frame, filmFrame, quote, closing, arrow } from './shell.mjs';
import { SITE, HER, L, A, LOOKS, LOOK_CATS, looksIn, FILMS, PHOTOS, PORTFOLIO_PAGE, href, inquire, pic, src, srcset, esc } from '../site.mjs';

const pad = (k) => String(k).padStart(2, '0');
const preload = (key, sizes) => `<link rel="preload" as="image" href="${src(key)}" imagesrcset="${srcset(key)}" imagesizes="${sizes}" fetchpriority="high">`;
const COVER_SIZES = '(max-width:899px) 92vw, 40vw';
const SAMPLE = `Sample article, to be written with ${SITE.first}`;

/* =====================================================================
   PORTFOLIO
   ===================================================================== */

/* The runway: her looks with two film frames among them, in an order that alternates brides and
   glam so no two neighbours look alike. */
const RUNWAY = [
  { photo: 'bride-crystal' },
  { photo: 'glam-sculpt' },
  { film: 'f1' },
  { photo: 'bride-pearls' },
  { photo: 'waves-blonde' },
  { photo: 'bride-gold-waves' },
  { film: 'f3' },
  { photo: 'glam-bronze' },
  { photo: 'bride-ruby' },
  { photo: 'golden-hour' },
].map((it) => (it.film
  ? { ...it, cap: `Film &middot; ${FILMS[it.film].label}` }
  : { ...it, cap: LOOKS.find((l) => l.photo === it.photo).cap.replace(' · ', ' &middot; ') }));

const RW_SIZES = '(max-width:599px) 74vw, (max-width:899px) 46vw, 34vw';
const runway = () => {
  const n = RUNWAY.length;
  const items = RUNWAY.map((it, i) => `<li class="rw-it${it.film ? ' rw-it--film' : ''}" data-i="${i}">
<figure class="rw-fr"><div class="rw-m">${it.film ? filmFrame(it.film, { shape: '', label: FILMS[it.film].label, rv: '' }) : pic(it.photo, { sizes: RW_SIZES })}</div>
<figcaption class="rw-cap"><span class="rw-no">${pad(i + 1)}</span><span class="rw-ct">${it.cap}</span></figcaption></figure></li>`).join('');
  const end = `<li class="rw-it rw-end"><div class="rw-end-in"><p class="kick">${n - 2} looks &middot; 2 films</p><p class="d-m rw-end-t">The whole collection is below.</p>${more('#every', 'See every look')}</div></li>`;
  return section({ id: 'looks', tone: 'blanc', cls: 'rw', labelledby: 'looksH', wrap: false }, `
<div class="rw-pin">
<div class="wrap rw-hd">
<div>${kicker('The runway', 'rv')}${h(2, ['The', 'Looks'], 'd-l rv-mask', 'id="looksH"')}</div>
<p class="rw-lede rv" style="--d:.1s">Real brides and real glam, with film among the photographs. <span class="rw-how-pin">Keep scrolling: the runway moves with you.</span><span class="rw-how-swipe">Swipe, or use the arrows.</span></p>
</div>
<div class="rw-view"><ul class="rw-track" tabindex="0" aria-label="The Looks: ${n} frames. Use the arrow keys to move.">${items}${end}</ul></div>
<div class="wrap rw-ctl">
<p class="ctr" aria-hidden="true"><span class="ctr-n" data-rw-n>01</span><span class="ctr-sep"></span><span>${pad(n)}</span></p>
<div class="rw-bar" aria-hidden="true"><i data-rw-bar></i></div>
<div class="rw-btns"><button class="ic-btn" type="button" data-rw-prev aria-label="Previous look" hidden><span aria-hidden="true">&larr;</span></button><button class="ic-btn" type="button" data-rw-next aria-label="Next look" hidden><span aria-hidden="true">&rarr;</span></button></div>
</div>
</div>`);
};

/* The Reel: the four film frames. Each is the marked slot until her clips arrive, then plays. */
const REEL = ['f1', 'f2', 'f3', 'f4'];
const reel = () => section({ id: 'reel', tone: 'noir', cls: 'reel', labelledby: 'reelH' }, `
<div class="sec-hd"><div>${kicker('In motion', 'rv')}${h(2, ['The', 'Reel'], 'd-l rv-mask', 'id="reelH"')}</div>
<p class="lede mut rv" style="--d:.1s">Four frames held for clips from ${SITE.handle}’s reels. Each one plays here as soon as its clip is added.</p></div>
<div class="reel-row" data-stag=".08">${REEL.map((f) => `<div class="rv">${filmFrame(f, { shape: 'vert', label: FILMS[f].label, cap: `Film ${pad(FILMS[f].n)} &middot; ${FILMS[f].label}`, rv: '' })}</div>`).join('')}</div>`);

/* Every look, by category, with the viewer. Without script each tile is a plain link to the large
   file; with it the tile opens the viewer. The category bar filters (looksIn) and only appears with
   script; without it every look shows with its categories written under it. */
const CAT_KEYS = Object.keys(LOOK_CATS);
const tile = (l, i) => {
  const P = PHOTOS[l.photo];
  const cats = l.cats.map((c) => LOOK_CATS[c]).join(' &middot; ');
  return `<li class="lt${i === 0 || i === 5 ? ' lt--big' : ''}" data-cats="${l.cats.join(' ')}" data-i="${i}">
<a class="lt-a" href="${A}/img/${l.photo}-1280.webp" data-vw data-src="${src(l.photo, 1280)}" data-srcset="${srcset(l.photo)}" data-w="${P.w}" data-h="${P.h}" data-cap="${esc(l.cap)}" data-alt="${esc(P.alt)}">
<span class="lt-m">${pic(l.photo, { sizes: i === 0 || i === 5 ? '(max-width:899px) 92vw, 46vw' : '(max-width:899px) 46vw, 23vw' })}<span class="lt-open" aria-hidden="true"><i></i></span></span>
<span class="lt-cap"><span class="lt-no" aria-hidden="true">${pad(i + 1)}</span><span class="lt-c">${l.cap.replace(' · ', ' &middot; ')}</span><span class="vh">. Categories: ${cats}. Opens larger.</span></span>
</a></li>`;
};
const every = () => section({ id: 'every', tone: 'blanc', cls: 'all', labelledby: 'allH' }, `
<div class="sec-hd"><div>${kicker('The collection', 'rv')}${h(2, ['Every', 'look.'], 'd-l rv-mask', 'id="allH"')}</div>
<p class="lede rv" style="--d:.1s">All ${LOOKS.length} of her looks. Choose a category, then open any photograph to see it large.</p></div>
<div class="all-bar" role="group" aria-label="Show looks by category">
<button type="button" class="chip" aria-pressed="true" data-cat="">All <span>${pad(LOOKS.length)}</span></button>
${CAT_KEYS.map((c) => `<button type="button" class="chip" aria-pressed="false" data-cat="${c}">${LOOK_CATS[c]} <span>${pad(looksIn(c).length)}</span></button>`).join('')}
</div>
<p class="vh" aria-live="polite" data-all-status></p>
<ul class="all-g" data-all>${LOOKS.map(tile).join('')}</ul>
${viewer()}`);

/* The viewer: a modal dialog, hidden until a tile opens it (pages-work.js). The large file loads
   only when it is opened. */
const viewer = () => `<div class="vw tone-noir" id="lookViewer" role="dialog" aria-modal="true" aria-label="Look viewer" hidden>
<div class="vw-top"><p class="ctr" aria-hidden="true"><span class="ctr-n" data-vw-n>01</span><span class="ctr-sep"></span><span data-vw-t>${pad(LOOKS.length)}</span></p><button class="vw-x" type="button" data-vw-close>Close <span aria-hidden="true">&times;</span></button></div>
<div class="vw-stage" data-vw-stage><img class="vw-img" data-vw-img alt="" width="1280" height="1600" decoding="async"><i class="vw-e" aria-hidden="true"></i></div>
<div class="vw-bot"><p class="vw-cap" data-vw-cap aria-live="polite"></p><div class="vw-btns"><button class="ic-btn" type="button" data-vw-prev aria-label="Previous look"><span aria-hidden="true">&larr;</span></button><button class="ic-btn" type="button" data-vw-next aria-label="Next look"><span aria-hidden="true">&rarr;</span></button></div></div>
</div>`;

/* The invitation: the page's one centred moment. */
const follow = () => section({ id: 'follow', tone: 'silk', cls: 'fol', labelledby: 'folH' }, `
${kicker(PORTFOLIO_PAGE.noteKick, 'rv')}
${h(2, 'Follow the work.', 'd-l rv-mask', 'id="folH"')}
<p class="lede rv" style="--d:.08s">More of her looks and reels, on Instagram and TikTok.</p>
<ul class="fol-l" data-stag=".1">
<li class="rv"><a class="fol-a" href="${L.ig}" rel="external"><span class="fol-k">Instagram</span><span class="fol-h">${SITE.handle}</span><span class="fol-go">Follow on Instagram ${arrow}</span></a></li>
<li class="rv"><a class="fol-a" href="${L.tiktok}" rel="external"><span class="fol-k">TikTok</span><span class="fol-h">${SITE.handle}</span><span class="fol-go">Follow on TikTok ${arrow}</span></a></li>
</ul>`);

export const portfolio = () => page({
  path: 'portfolio',
  title: 'Portfolio · The Looks and The Reel',
  description: `Bridal, soft glam, full glam and glam waves by ${SITE.name}, luxury hair and makeup artist in ${SITE.area}: ${LOOKS.length} looks and four film frames.`,
  head: preload('wedding-night', COVER_SIZES),
  css: ['pages-work'],
  js: ['pages-work'],
  bodyClass: 'pf',
  main: cover({
    kick: PORTFOLIO_PAGE.kick,
    heading: PORTFOLIO_PAGE.heading,
    sub: 'The runway of her looks, the reel, then every photograph, each one opening large.',
    image: 'wedding-night',
    tone: 'noir',
    after: bookingLine('rv cover-book'),
  }) + runway() + reel() + every() + follow() + closing({ line: PORTFOLIO_PAGE.note }),
});

/* =====================================================================
   JOURNAL
   ===================================================================== */
const POSTS = [
  {
    path: 'journal/how-to-prepare', n: '01', topic: 'Before your appointment',
    title: 'How to prepare for your glam',
    dek: `&ldquo;${HER.prepare[0]}&rdquo; Her two asks before your appointment, and how the preview session fits in.`,
    img: 'bride-pearls',
  },
  {
    path: 'journal/destination-bride', n: '02', topic: 'Travel',
    title: HER.destination.heading,
    dek: `&ldquo;I travel worldwide for my brides.&rdquo; What she says about travel, and how to ask for a custom quote.`,
    img: 'golden-hour',
  },
];

const card = (p, i) => `<article class="jx${i % 2 ? ' jx--r' : ''}">
${frame(p.img, { shape: 'tall', sizes: '(max-width:899px) 92vw, 42vw', alt: '', cls: 'jx-ph' })}
<div class="jx-t">
<p class="jx-n rv" aria-hidden="true">${p.n}</p>
<p class="jx-k rv">${p.topic}</p>
<h2 class="d-l jx-h rv-mask"><a class="jx-a" href="${href(S, p.path)}">${p.title}</a></h2>
<p class="jx-d rv">${p.dek}</p>
<p class="jx-s rv">${SAMPLE}</p>
<span class="more jx-go rv" aria-hidden="true">Read the article ${arrow}</span>
</div>
</article>`;

export const journal = () => page({
  path: 'journal',
  title: 'Journal · Notes from her chair',
  description: `Two sample articles built from ${SITE.name}’s own words: how to prepare for your glam, and travel for destination brides.`,
  css: ['pages-work'],
  bodyClass: 'jn',
  main: cover({
    kick: 'The journal',
    heading: ['Notes from', 'her chair.'],
    sub: `Two sample articles, built only from ${SITE.first}’s own words: how to prepare for your glam, and what she says to destination brides.`,
    after: bookingLine('rv cover-book'),
  }) + section({ tone: 'silk', cls: 'jx-list', label: 'Articles' }, POSTS.map(card).join('')) + closing({}),
});

/* =====================================================================
   THE TWO POSTS
   ===================================================================== */
const postHead = (p) => cover({
  kick: `Journal &middot; ${p.n} &middot; ${p.topic}`,
  heading: p.title,
  sub: p.dek,
  image: p.img,
  after: `<p class="ps-sample rv">${SAMPLE}</p>${bookingLine('rv cover-book')}`,
});

/* the side column beside the article: the sample label, where the words come from, and the links */
const aside = () => `<aside class="ps-side" aria-label="About this article">
<p class="ps-side-k">${SAMPLE}</p>
<p class="ps-side-p">Built only from ${SITE.first}’s own words on her booking page. Her lines are quoted as she wrote them.</p>
<div class="ps-side-l">${more(href(S, 'bridal'), 'Bridal packages')}${more(href(S, 'bridal-inquiry'), 'Bridal inquiry')}</div>
</aside>`;

const article = (body) => section({ tone: 'blanc', cls: 'ps', label: 'Article' }, `<div class="ps-g">${aside()}<div class="ps-body">${body}</div></div>`);

/* the end of an article: the two links, then the way to the other post */
const after = (p, other, dir) => section({ tone: 'silk', cls: 'pn', label: 'More from the journal' }, `
<div class="pn-g">
<div class="pn-go">
${kicker('Ready when you are', 'rv')}
<p class="d-m rv">See the six bridal packages, or tell ${SITE.first} about your day.</p>
<div class="acts rv">${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--pri')}<a class="btn btn--sec" href="${href(S, 'bridal')}">Bridal packages</a></div>
</div>
<a class="pn-a rv" href="${href(S, other.path)}" rel="${dir}">
${frame(other.img, { shape: 'wide', sizes: '(max-width:899px) 92vw, 40vw', alt: '', rv: '' })}
<span class="pn-k">${dir === 'next' ? 'Next article' : 'Previous article'} <span aria-hidden="true">${dir === 'next' ? '&rarr;' : '&larr;'}</span></span>
<span class="d-m pn-t">${other.title}</span>
<span class="pn-s">${SAMPLE}</span>
</a>
</div>
${more(href(S, 'journal'), 'All articles', 'rv pn-all')}`);

/* --- 1. How to prepare for your glam --- */
const faqA = (q) => HER.faq.find(([x]) => x === q)[1];
const TRIAL = faqA('Do you offer trials?');
const EXT = faqA('Do you recommend hair extensions?');
/* every touch-up point in her packages, as listed */
const TOUCH = HER.packages
  .map((p) => ({ name: p.name, who: p.who.replace(/\s*·\s*most popular/i, ''), pts: p.points.filter((x) => /touch-up/i.test(x)) }))
  .filter((p) => p.pts.length);

export const postPrepare = () => {
  const p = POSTS[0];
  const body = `<div class="prose prose--drop">
<p>${SITE.first} keeps her list short. Before your appointment, she asks for two things.</p>
</div>
<ol class="asks">${HER.prepare.map((x, i) => `<li><span class="asks-n" aria-hidden="true">${pad(i + 1)}</span><p>&ldquo;${x}&rdquo;</p></li>`).join('')}</ol>
<div class="prose">
<h2>The look, before the day</h2>
<p>Every one of her bridal packages includes a preview of the look before the wedding day: the hair-and-makeup collections open with two-part bridal artistry, a private preview session and then the wedding-day application. And if you would rather try first, a trial can be booked before you sign.</p>
</div>
${quote(TRIAL.replace(/^Yes! /, ''), SITE.first)}
<div class="prose">
<h2>Glam waves that last</h2>
<p>For the most volume and longevity in glam waves, ${SITE.first} highly recommends hair extensions. You can rent them directly from her, or she can guide you toward the best extensions to buy. Hair extension rental is included in The Luxe Gala, and Glam Hair includes an extension install for the bride.</p>
</div>
${quote(EXT.split('. ')[0] + '.', SITE.first)}
<div class="prose">
<h2>After the ceremony</h2>
<p>The glam is looked after once the vows are said, too. These are the touch-ups and touch-up kits listed in her packages.</p>
</div>
<div class="tu" role="table" aria-label="Touch-ups in her packages">
<div class="tu-r tu-hd" role="row"><span role="columnheader">Package</span><span role="columnheader">Touch-ups and kits</span></div>
${TOUCH.map((t) => `<div class="tu-r" role="row"><span class="tu-n" role="rowheader">${t.name}<small>${t.who}</small></span><span role="cell"><ul>${t.pts.map((x) => `<li>${x}</li>`).join('')}</ul></span></div>`).join('')}
</div>
<p class="tu-note">${more(href(S, 'bridal'), 'All six packages, with what each includes')}</p>`;
  return page({
    path: p.path,
    title: `${p.title} · Journal`,
    description: `${SITE.name}’s two asks before your glam appointment, her preview sessions, her advice on hair extensions and the touch-ups in her bridal packages.`,
    head: preload(p.img, COVER_SIZES),
    css: ['pages-work'],
    bodyClass: 'post',
    main: postHead(p) + article(body) + after(p, POSTS[1], 'next') + closing({}),
  });
};

/* --- 2. Destination bride? --- */
const TRAVEL = faqA('Do you travel?');
export const postDestination = () => {
  const p = POSTS[1];
  const [worldwide, reach, chair] = HER.destination.body.split(/(?<=[.!])\s+/);
  const body = `<div class="prose prose--drop">
<p>For the bride marrying far from home, ${SITE.first}’s answer is a short one.</p>
</div>
${quote(worldwide, SITE.first)}
<div class="prose">
<h2>Close to home, and further</h2>
<p>Closer to home, she travels all across Central Florida, and out of state as well.</p>
</div>
${quote(TRAVEL, `${SITE.first}, asked &ldquo;Do you travel?&rdquo;`)}
<div class="prose">
<h2>How to ask</h2>
<p>To ask about a wedding away from home, start with the bridal inquiry or write to her by email. In her words:</p>
</div>
<div class="ask rv">
<p class="ask-q">&ldquo;${reach}&rdquo;</p>
<div class="acts">${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--pri')}<a class="btn btn--sec" href="${L.mail}">Email ${SITE.first}</a></div>
</div>
${note(chair.replace(/!$/, ''), 'ps-note')}`;
  return page({
    path: p.path,
    title: `${p.title} · Journal`,
    description: `${SITE.name} travels worldwide for her brides, all across Central Florida and out of state; reach out directly for travel availability and a custom quote.`,
    head: preload(p.img, COVER_SIZES),
    css: ['pages-work'],
    bodyClass: 'post',
    main: postHead(p) + article(body) + after(p, POSTS[0], 'prev') + closing({}),
  });
};
