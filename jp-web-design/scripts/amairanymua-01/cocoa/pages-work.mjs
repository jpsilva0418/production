/* /demo/amairanymua-01 — site "cocoa": Portfolio, Journal and the two sample posts (WORK).

   Portfolio — the title card (PORTFOLIO_PAGE) with both ways to book; "The Looks": a runway of her
   looks, stills with real clips among them, that advances on its own (pause control, swipe, arrows,
   rests off screen, still under reduced motion); "The Reel": her clips with titles, credits and the
   pinned view counts dated SOCIAL.asOf; then every look in LOOKS3 by category, each opening the
   viewer (pages-work.js); the closing invitation with Instagram and TikTok.
   Journal — an index of the two sample posts, and the posts as editorial articles built ONLY from
   her own words: HER.prepare, two FAQ answers and the touch-up points of HER.packages (post 1);
   HER.destination and the travel answer (post 2). Every post and card carries POST_LABEL.

   Honesty: no fact is written here that site.mjs does not hold. Article prose is third person; her
   own lines are quoted as hers. Credited looks and clips always say "Makeup by Amairany · <credit>". */
import { page, S, section, sectionHead, kicker, h, lede, actions, more, nextStep, bookingChip, chips, rail, reelCard, frame, quote, POSTS, POST_LABEL, CHEV_L, CHEV_R, PLAY, FILM_START, arrow } from './shell.mjs';
import { SITE, HER, SOCIAL, FILMS, PHOTOS, LOOKS3, LOOK_CATS3, looksIn3, PORTFOLIO_PAGE, L, A, href, pic, src, srcset, esc } from '../site.mjs';

const lookOf = (photo) => LOOKS3.find((l) => l.photo === photo);
const lookByFilm = (id) => LOOKS3.find((l) => l.film === id);
const credit = (cr) => (cr ? `Makeup by ${SITE.first} &middot; ${cr}` : '');
const preload = (k, sizes) => `<link rel="preload" as="image" imagesrcset="${srcset(k)}" imagesizes="${sizes}" fetchpriority="high">`;
const largest = (k) => (PHOTOS[k].widths ?? [480, 800, 1280]).slice(-1)[0];

/* ======================================================================
   PORTFOLIO
   ====================================================================== */

/* The runway: stills with clips among them. A clip never sits beside its own still (each clip
   here is a look whose frame is not in the runway), and its caption is the look's own. */
const RUNWAY = [
  { photo: 'bride-crystal' }, { film: 'f5' }, { photo: 'reel-morning-veil' }, { photo: 'bride-ruby' },
  { film: 'f4' }, { photo: 'glam-sculpt' }, { photo: 'reel-burgundy' }, { film: 'f9' },
  { photo: 'bride-gold-waves' }, { photo: 'reel-copper' }, { film: 'f13' }, { photo: 'waves-blonde' },
  { photo: 'reel-editorial' }, { film: 'f8' }, { photo: 'wedding-night' }, { photo: 'bride-pearls' },
].map((it) => {
  const l = it.photo ? lookOf(it.photo) : lookByFilm(it.film);
  return it.photo ? { photo: it.photo, cap: l.cap, cats: l.cats } : { film: it.film, cap: l.cap, cats: l.cats };
});
const RAIL_SIZES = '(max-width:599px) 66vw, 340px';

/* The Reel: the three pinned posts first, then a selection of the rest. f11 (a duplicate of f10
   with her own burned-in text), f3 and f9 are left to the runway and the viewer. */
const PINNED = SOCIAL.pinned.map((p) => p.film);
const REST = ['f1', 'f5', 'f7', 'f4', 'f6', 'f8', 'f10', 'f12'];
const CLIPS = PINNED.length + REST.length;

const pfCover = () => `<section class="cover cover--m pf-cover" aria-labelledby="pfH">
<div class="wrap cover-in"><div class="cover-txt">
${bookingChip()}
${kicker('Bridal &amp; event portfolio')}
${h(1, `${PORTFOLIO_PAGE.heading[0]} <em>${PORTFOLIO_PAGE.heading[1]}</em>`, 'd-xl', 'id="pfH"')}
${lede(`A glimpse of ${HER.years[0][1]} of artistry: brides first, then glam, hair and editorial colour. ${LOOKS3.length} looks and ${CLIPS} of her clips.`)}
${actions()}
<nav class="pf-jump" aria-label="On this page"><a href="#looks">The Looks</a><a href="#reel">The Reel</a><a href="#every-look">Every look</a></nav>
</div>
<div class="cover-m pf-cm">
${frame('bride-crystal', { shape: 'port', eager: true, rv: '', sizes: '(max-width:899px) 78vw, 34vw', cap: '' })}
<div class="pf-cm-r">${reelCard('f5', { cap: false, rv: '', tag: 'div' })}</div>
</div>
</div>
</section>`;

const pfLooks = () => {
  const r = rail({ id: 'pfRail', items: RUNWAY, label: 'The Looks: her looks, photographs and clips' })
    .replaceAll("(max-width:599px) 62vw, 300px", RAIL_SIZES)
    .replace('<div class="rail-btns">', `<div class="rail-btns"><button class="ic-btn pf-auto" type="button" data-rail-auto aria-controls="pfRail" aria-label="Pause the looks"><span class="pf-pi" aria-hidden="true"></span></button>`);
  return section({ id: 'looks', tone: 'oat', cls: 'pf-looks', labelledby: 'looksH', wrap: false }, `
<div class="wrap">${sectionHead({ kick: 'The Looks', heading: 'Soft glam to <em>full glam.</em>', id: 'looksH', line: 'Real clients in real light. The runway moves on its own; swipe it, or pause it, to stay on a look.', side: more('#every-look', 'See every look') })}</div>
<div class="pf-runway" data-runway data-hold="3800">${r}</div>
<div class="wrap">${nextStep({ line: 'Seen your look? Bring it to your inquiry.', links: [[href(S, 'bridal'), 'See the bridal packages']] })}</div>`);
};

const pfReel = () => section({ id: 'reel', tone: 'milk', cls: 'pf-reel', labelledby: 'reelH' }, `
${sectionHead({ kick: `The Reel &middot; ${SITE.handle}`, heading: 'Her clips, <em>in motion.</em>', id: 'reelH', line: `${SOCIAL.tiktok.followers} followers and ${SOCIAL.tiktok.likes} likes on TikTok. Silent here; the sound is on TikTok.`, side: `<p class="small pf-asof">View counts as of ${SOCIAL.asOf}</p>${more(L.tiktok, 'Watch more on TikTok')}` })}
<p class="kick pf-sub rv">Her pinned three</p>
<ol class="pf-pins rv">${PINNED.map((id, i) => `<li class="pf-pin"><span class="pf-pin-n num" aria-hidden="true">0${i + 1}</span>${reelCard(id, { rv: '' })}</li>`).join('')}</ol>
<p class="kick pf-sub rv">More from her reels</p>
<div class="vg pf-vg" data-stag=".06">${REST.map((id) => reelCard(id)).join('')}</div>
${nextStep({ links: [[L.tiktok, 'Watch more on TikTok'], [L.ig, 'Follow on Instagram']] })}`);

/* every look, in LOOKS3 order; chips filter by LOOK_CATS3 (counts from looksIn3); each tile links
   to its largest file, and with script opens the viewer */
const COUNTS = Object.fromEntries(Object.keys(LOOK_CATS3).map((k) => [k, looksIn3(k).length]));
const TILE_SIZES = '(max-width:599px) 46vw, (max-width:1023px) 31vw, 290px';
const VW_SIZES = '(max-width:899px) 92vw, 60vh';
const tile = (l, i) => {
  const p = PHOTOS[l.photo];
  const big = largest(l.photo);
  const f = l.film ? FILMS[l.film] : null;
  const film = f?.file ? ` data-film="${A}/film/${f.file}.mp4" data-poster="${A}/film/${f.file}.jpg" data-film-alt="${esc(f.alt)}" data-film-pos="${f.pos}"${FILM_START[l.film] ? ` data-film-start="${FILM_START[l.film]}"` : ''}` : '';
  return `<li class="pa-i rv" data-cats="${l.cats.join(' ')}" style="--d:${((i % 4) * 0.06).toFixed(2)}s">
<figure class="fr fr--tall pa-f"><a class="fr-m pa-a" href="${src(l.photo, big)}" data-vw data-src="${src(l.photo, big)}" data-srcset="${srcset(l.photo)}" data-w="${p.w}" data-h="${p.h}" data-alt="${esc(p.alt)}" data-cap="${esc(l.cap)}"${l.credit ? ` data-credit="${esc(credit(l.credit))}"` : ''}${film}>${pic(l.photo, { sizes: TILE_SIZES })}<span class="pa-zoom" aria-hidden="true"></span>${f ? `<span class="pa-clip" aria-hidden="true">${PLAY}Clip</span>` : ''}<span class="vh">View larger</span></a>
<figcaption class="cap">${l.cap}${l.credit ? `<span class="cap-cr">${credit(l.credit)}</span>` : ''}</figcaption></figure>
</li>`;
};
const viewer = () => `<div class="vw" id="lookViewer" role="dialog" aria-modal="true" aria-labelledby="vwT" hidden>
<div class="vw-top"><p class="vw-n" id="vwT"><span class="vh">Look </span><span data-vw-n>01</span><span class="vw-of" aria-hidden="true">/</span><span class="vh"> of </span><span data-vw-t>${LOOKS3.length}</span></p><button class="vw-x" type="button" data-vw-close>Close <i aria-hidden="true"></i></button></div>
<div class="vw-stage" data-vw-stage><div class="vw-box" data-vw-box><img data-vw-img alt="" width="576" height="1024" decoding="async"></div></div>
<div class="vw-foot">
<p class="vw-cap" data-vw-cap aria-live="polite"></p>
<div class="vw-row"><button class="vw-clip" type="button" data-vw-clip hidden><span class="vw-clip-i" aria-hidden="true">${PLAY}</span><span data-vw-clip-t>Watch the clip</span></button>
<div class="vw-nav"><button class="ic-btn" type="button" data-vw-prev aria-label="Previous look">${CHEV_L}</button><button class="ic-btn" type="button" data-vw-next aria-label="Next look">${CHEV_R}</button></div></div>
</div>
</div>`;

const pfAll = () => section({ id: 'every-look', tone: 'cream', cls: 'pf-all', labelledby: 'allH' }, `
${sectionHead({ kick: `Every look &middot; ${LOOKS3.length}`, heading: 'Choose a look, <em>up close.</em>', id: 'allH', line: 'Bridal, soft glam, full glam, hair, editorial and the wedding day itself. Tap any look to see it large.' })}
<div class="pf-chips">${chips({ target: 'pfAll', cats: LOOK_CATS3, counts: COUNTS, label: 'Show looks by category' })}</div>
<p class="vh" data-all-status aria-live="polite"></p>
<ul class="pa" id="pfAll">${LOOKS3.map(tile).join('')}</ul>
${nextStep({ line: PORTFOLIO_PAGE.note, links: [[href(S, 'about'), `Meet ${SITE.first}`]] })}`);

/* the closing invitation, with Instagram and TikTok */
const pfClose = () => section({ tone: 'espresso', cls: 'close on-dark', labelledby: 'closeH', attrs: 'data-nobar' }, `${bookingChip('rv')}${kicker(PORTFOLIO_PAGE.noteKick, 'rv')}${h(2, 'Secure your wedding day <em>glam.</em>', 'd-xl rv', 'id="closeH"')}${lede('Weddings start with an inquiry, so the reply is about your day. Events book straight onto her calendar.', 'rv')}<div class="rv">${actions({ tone: 'dark' })}</div>
<p class="pf-follow rv"><a class="lnk" href="${L.ig}" rel="external">${PORTFOLIO_PAGE.ig} ${arrow}</a><a class="lnk" href="${L.tiktok}" rel="external">More on TikTok ${SITE.handle} ${arrow}</a></p>`);

export const portfolio = () => page({
  path: 'portfolio',
  title: 'Portfolio',
  description: `Bridal and event hair and makeup by ${SITE.name}, ${SITE.area}: ${LOOKS3.length} looks and ${CLIPS} of her clips, soft glam to full glam.`,
  head: preload('bride-crystal', '(max-width:899px) 78vw, 34vw'),
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
const POST_FIG = '(max-width:899px) 86vw, 460px';
const label = (cls = '') => `<p class="chip art-label${cls ? ` ${cls}` : ''}"><span class="chip-dot" aria-hidden="true"></span>${POST_LABEL}</p>`;

const jxRow = (p, i) => `<article class="jx-r rv" aria-labelledby="jx${i}">
<a class="jx-im" href="${href(S, p.path)}" tabindex="-1" aria-hidden="true">${frame(p.image, { shape: 'port', sizes: '(max-width:759px) 92vw, 460px', rv: '', alt: '' })}</a>
<div class="jx-b">
<p class="jx-n num" aria-hidden="true">0${i + 1}</p>
${kicker(p.kick)}
<h2 class="d-l jx-t" id="jx${i}"><a href="${href(S, p.path)}">${p.title}</a></h2>
<p class="jx-x">${p.excerpt}</p>
<p class="post-s">${POST_LABEL}</p>
${more(href(S, p.path), 'Read the article')}
</div>
</article>`;

export const journal = () => page({
  path: 'journal',
  title: 'Journal',
  description: `Two sample articles built from ${SITE.name}’s own words: how to prepare for your glam, and travel for destination brides.`,
  head: preload('artist-chair-cut', '(max-width:899px) 80vw, 420px'),
  css: ['pages-work'],
  bodyClass: 'pg-journal',
  main: `<section class="cover cover--m jx-cover" aria-labelledby="jxH">
<div class="wrap cover-in"><div class="cover-txt">
${bookingChip()}
${kicker('The Journal')}
${h(1, 'Notes from <em>her chair.</em>', 'd-xl', 'id="jxH"')}
${lede(`How to get ready for your glam, and what to know as a destination bride: two articles in ${SITE.first}’s own words, to be written with her.`)}
${actions()}
</div>
<figure class="cover-m jx-fig fr--nat"><div class="fr-m">${pic('artist-chair-cut', { sizes: '(max-width:899px) 80vw, 420px', eager: true })}</div></figure>
</div>
</section>
${section({ id: 'articles', tone: 'milk', cls: 'jx', labelledby: 'jxListH' }, `
${sectionHead({ kick: `${POSTS.length} articles`, heading: 'From <em>her words.</em>', id: 'jxListH', line: 'Each one is built only from what Amairany has written for her brides. Sample articles, to be written with her.' })}
<div class="jx-l">${POSTS.map(jxRow).join('')}</div>
${nextStep({ line: 'Questions about your day? Start with the inquiry.', links: [[href(S, 'bridal'), 'See the bridal packages']] })}`)}
${section({ tone: 'espresso', cls: 'close on-dark', labelledby: 'closeH', attrs: 'data-nobar' }, `${bookingChip('rv')}${kicker('Two ways to book', 'rv')}${h(2, 'Secure your wedding day <em>glam.</em>', 'd-xl rv', 'id="closeH"')}${lede('Weddings start with an inquiry, so the reply is about your day. Events book straight onto her calendar.', 'rv')}<div class="rv">${actions({ tone: 'dark' })}</div>`)}`,
});

/* ---------- a post page ---------- */
const otherPost = (path) => {
  const i = POSTS.findIndex((p) => p.path === path);
  return { prev: POSTS[i - 1], next: POSTS[i + 1], i };
};
const pnCard = (p, dir) => `<a class="pn-a pn-a--${dir}" href="${href(S, p.path)}">${frame(p.image, { shape: 'sq', sizes: '96px', rv: '', alt: '' })}<span class="pn-b"><span class="pn-k">${dir === 'prev' ? `<span aria-hidden="true">&larr;</span> Previous article` : `Next article <span aria-hidden="true">&rarr;</span>`}</span><span class="pn-t">${p.title}</span><span class="pn-s">${POST_LABEL}</span></span></a>`;

const post = ({ path, title, description, heroSizes = POST_FIG, body, aside = '' }) => {
  const p = POSTS.find((x) => x.path === path);
  const { prev, next } = otherPost(path);
  return page({
    path,
    title,
    description,
    head: preload(p.image, heroSizes),
    css: ['pages-work'],
    bodyClass: 'pg-post',
    main: `<article class="art-w" aria-labelledby="artH">
<header class="cover cover--m art-hd">
<div class="wrap cover-in"><div class="cover-txt">
<nav class="art-crumb" aria-label="Breadcrumb"><a href="${href(S, 'journal')}">The Journal</a><span aria-hidden="true">/</span><span>${p.kick}</span></nav>
${label()}
${h(1, title, 'd-xl', 'id="artH"')}
${lede(p.excerpt)}
${actions({ inq: 'Start your bridal inquiry' })}
</div>
${frame(p.image, { shape: 'port', eager: true, rv: '', sizes: heroSizes, cls: 'cover-m art-hero' })}
</div>
</header>
${section({ tone: 'milk', cls: 'art-sec' }, `<div class="art">
<div class="art-body prose">${body}</div>
<aside class="art-side" aria-label="About this article">
<p class="kick">A note</p>
<p class="art-side-p">${POST_LABEL}. Every fact comes from ${SITE.first}’s own words; her lines are quoted as hers.</p>
${aside}
<div class="art-side-b">${actions({ inq: 'Start your bridal inquiry' })}</div>
</aside>
</div>
${nextStep({ line: 'Ready when you are.', links: [[href(S, 'bridal'), 'See the bridal packages']] })}`)}
</article>
${section({ tone: 'oat', cls: 'pn-sec', label: 'More from the journal' }, `<div class="pn">${prev ? pnCard(prev, 'prev') : ''}${next ? pnCard(next, 'next') : ''}</div><div class="pn-all">${more(href(S, 'journal'), 'All articles')}</div>`)}
${section({ tone: 'espresso', cls: 'close on-dark', labelledby: 'closeH', attrs: 'data-nobar' }, `${bookingChip('rv')}${kicker('Two ways to book', 'rv')}${h(2, 'Secure your wedding day <em>glam.</em>', 'd-xl rv', 'id="closeH"')}${lede('Weddings start with an inquiry, so the reply is about your day. Events book straight onto her calendar.', 'rv')}<div class="rv">${actions({ tone: 'dark' })}</div>`)}`,
  });
};

const ME = `${SITE.name}`;
const faqA = (start) => HER.faq.find(([q]) => q.startsWith(start))[1];

/* post 1: HER.prepare, the trial and extension answers, the touch-up points of HER.packages */
const TRIAL = faqA('Do you offer trials').replace(/^Yes!\s*/, '');
const EXT = faqA('Do you recommend hair extensions');
const TOUCH = HER.packages
  .map((p) => ({ name: p.name, who: p.who.replace(/\s*·\s*most popular/i, ''), items: p.points.filter((x) => /touch-up/i.test(x)) }))
  .filter((p) => p.items.length);

const prepareBody = () => `
<p class="art-lead">Getting ready with ${SITE.first} starts before the brushes come out. Here is what she asks of you before your appointment, the preview her packages already include, her word on extensions, and what stays with you after the ceremony.</p>
<h2>Before your appointment</h2>
<p>She asks for two things, in her words:</p>
<ol class="art-steps">${HER.prepare.map((x, i) => `<li><span class="art-steps-n num" aria-hidden="true">0${i + 1}</span><span>&ldquo;${x}&rdquo;</span></li>`).join('')}</ol>
<h2>Your preview comes first</h2>
<p>Preview sessions are offered for hair and for makeup, and her packages already include yours. If you would rather see the glam before you sign, a trial can be booked first.</p>
${quote(`&ldquo;${TRIAL}&rdquo;`, ME)}
<figure class="fr fr--port art-fig rv-im"><div class="fr-m">${pic('bride-pearls', { sizes: '(max-width:599px) 86vw, 420px' })}</div><figcaption class="cap">${lookOf('bride-pearls').cap}</figcaption></figure>
<h2>Extensions, for glam waves</h2>
<p>Planning glam waves? Ask her about extensions. She rents them, or points you to the ones worth buying.</p>
${quote(`&ldquo;${EXT}&rdquo;`, ME)}
<h2>After the ceremony</h2>
<p>Touch-ups are part of her packages. As listed on her booking page:</p>
<ul class="art-tu">${TOUCH.map((t) => `<li><span class="art-tu-n">${t.name}</span><span class="art-tu-w">${t.who}</span><span class="art-tu-i">${t.items.join(' &middot; ')}</span></li>`).join('')}</ul>
<p>Every package, with what it includes and its price, is on the <a href="${href(S, 'bridal')}">Bridal page</a>.</p>`;

/* post 2: HER.destination and the travel answer */
const TRAVEL = HER.faq.find(([q]) => q.startsWith('Do you travel'));
const [D1, D2, D3] = HER.destination.body.split(/(?<=[.!])\s+/);
const destinationBody = () => `
<p class="art-lead">Planning a wedding away from home? Here is what ${SITE.first} says about travel, in her own words, and how to ask her about your date.</p>
<h2>Worldwide, for her brides</h2>
${quote(`&ldquo;${D1}&rdquo;`, ME)}
<h2>Closer to home</h2>
<p>From her own questions and answers:</p>
<div class="art-qa"><p class="art-qa-q">${TRAVEL[0]}</p><p class="art-qa-a">&ldquo;${TRAVEL[1]}&rdquo;</p><p class="art-qa-by">${ME}</p></div>
<figure class="fr fr--port art-fig rv-im"><div class="fr-m">${pic('golden-hour', { sizes: '(max-width:599px) 86vw, 420px' })}</div><figcaption class="cap">${lookOf('golden-hour').cap}</figcaption></figure>
<h2>How to reach out</h2>
<p>For a destination wedding, she asks you to get in touch with her directly.</p>
${quote(`&ldquo;${D2}&rdquo;`, ME)}
<p>Two ways to do that: start with the <a href="${href(S, 'bridal-inquiry')}">bridal inquiry</a>, or <a href="${L.mail}">email her</a>.</p>
${D3 ? quote(`&ldquo;${D3}&rdquo;`, ME, 'pq--end') : ''}`;

export const postPrepare = () => post({
  path: 'journal/how-to-prepare',
  title: 'How to prepare for your glam',
  description: `How to prepare for bridal glam with ${SITE.name}: a clean face, hair washed and blown out a day before, the preview her packages include, extensions and touch-ups.`,
  body: prepareBody(),
});

export const postDestination = () => post({
  path: 'journal/destination-bride',
  title: HER.destination.heading,
  description: `${SITE.name} travels worldwide for her brides and across Central Florida and out of state; reach out directly for travel availability and a custom quote.`,
  body: destinationBody(),
  aside: `<p class="art-side-p"><a class="lnk" href="${L.mail}">Email ${SITE.first} ${arrow}</a></p>`,
});

