/* /demo/amairanymua-01 — site "atelier": the WORK pages.

   portfolio()        The title card (both ways to book), The Looks (the arched runway, stills with her
                      clips among them, advancing on its own), The Reel (her own clips in arched
                      windows: the three pinned posts with their dated view counts, then a gallery wall
                      of the rest), Every look (all of LOOKS3 by category, with a viewer), and a closing
                      invitation to follow her on Instagram and TikTok on the page's one espresso band.
   journal()          The index: a featured article large, the other beside it.
   postPrepare()      "How to prepare for your glam": ONLY HER.prepare, the trial and extension answers
                      in HER.faq, and the touch-up points of HER.packages.
   postDestination()  "Destination bride?": ONLY HER.destination and the travel answer in HER.faq.

   Honesty: every fact is read from site.mjs; her own lines are quoted as hers (first person), the
   article voice is third person; both articles are labelled "Sample article, to be written with
   Amairany"; collaborator credits print wherever a credited look or clip appears; view counts carry
   SOCIAL.asOf. Reel stills (576 wide) and clips never render wider than ~600 CSS px. */
import { page, S, AT, kicker, h, lede, spec, actions, more, next, arch, archFilm, frame, section, sectionHead, cover, quote, rail, pair, arrow } from './shell.mjs';
import { SITE, HER, L, PHOTOS, FILMS, SOCIAL, LOOKS3, LOOK_CATS3, looksIn3, PORTFOLIO_PAGE, href, inquire, book, film, filmSrc, pic, src, srcset, esc } from '../site.mjs';

const pad2 = (k) => String(k).padStart(2, '0');
const plain = (s) => String(s).replace(/&amp;/g, '&').replace(/&rsquo;|’/g, '’').replace(/<[^>]+>/g, '');
/** the largest file of a photograph (the no-script target of every tile, and the viewer's "Full size") */
const largest = (k) => { const ws = PHOTOS[k].widths ?? [480, 800, 1280]; return src(k, ws[ws.length - 1]); };
const credited = (k, credit) => credit ?? PHOTOS[k]?.credit;
const SAMPLE = `Sample article, to be written with ${SITE.first}`;

/* =====================================================================
   PORTFOLIO
   ===================================================================== */
const COVER_FILM = 'f6';
/* Two clips open on the artist herself before the bride is on screen: play them from the bride and
   loop back to that moment (site.js reads data-start). Keyed by clip file. */
const START = { 'morning-veil': 4.4, 'veil-reveal': 1.4 };
const withStarts = (html) => html.replace(/<video data-film([^>]*?) poster="([^"]*\/film\/([a-z-]+)\.jpg)"/g, (m, pre, p, file) => (START[file] ? `<video data-film data-start="${START[file]}"${pre} poster="${p}"` : m));
/* tile crops that keep her own burned-in caption out of the frame (the viewer shows the whole picture) */
const TILE_POS = { 'reel-final-touch': '50% 100%', 'reel-bride-gown': '50% 62%' };

/* The Looks: stills from LOOKS3 with her clips among them (no still with a burned-in caption, none of
   the clips the cover or The Reel leads with). Captions are LOOKS3's own; credits print by arch(). */
const capOf = (k) => LOOKS3.find((l) => l.photo === k)?.cap ?? '';
const RAIL = [
  { photo: 'reel-morning-veil' },
  { film: 'f4' },
  { photo: 'bride-crystal' },
  { photo: 'reel-bride-pearls-updo' },
  { film: 'f9' },
  { photo: 'waves-blonde' },
  { photo: 'reel-burgundy' },
  { film: 'f12' },
  { photo: 'bride-ruby' },
  { photo: 'reel-copper' },
  { photo: 'bride-gold-waves' },
  { photo: 'reel-bridesmaid-half-up' },
  { film: 'f8' },
  { photo: 'wedding-florals' },
].map((it) => (it.film ? { film: it.film, cap: `Film &middot; ${FILMS[it.film].title}` } : { photo: it.photo, cap: capOf(it.photo) }));

/* The Reel: the three pinned posts (their view counts, dated), then a wall of her other clips. */
const PINNED = SOCIAL.pinned.map((p) => p.film);
const WALL = ['f7', 'f1', 'f5', 'f3', 'f4', 'f10', 'f11', 'f12'];

const reelCard = (id, { big = false } = {}) => {
  const f = FILMS[id];
  const views = f.views ? `<p class="rl-v"><span class="rl-vn">${f.views}</span><span class="rl-vl">views on TikTok</span></p>` : '';
  return `<figure class="rl rv-arch${big ? ' rl--big' : ''}"><div class="arch arch--film${big ? ' arch--line' : ''}" style="--ar:${big ? '3/5' : '9/16'}"><div class="arch-w"><div class="arch-m">${film(id, { label: '' })}</div></div></div>
<figcaption class="rl-cap">${views}<span class="rl-t">${f.title}</span><span class="rl-l">${f.label}${f.views ? ` &middot; as of ${SOCIAL.asOf}` : ''}</span></figcaption></figure>`;
};

/* Every look: one tile per LOOKS3 entry, in LOOKS3 order. Each tile is a link to the look's largest
   file (the no-script behaviour); pages-work.js turns it into the viewer. */
const tile = (l, i) => {
  const P = PHOTOS[l.photo];
  const cr = credited(l.photo, l.credit);
  const crTxt = cr ? `Makeup by ${SITE.first} · ${cr}` : '';
  const fs = l.film && filmSrc(l.film);
  const filmAttrs = fs ? ` data-film-mp4="${fs.mp4}" data-film-poster="${fs.poster}" data-film-alt="${esc(FILMS[l.film].alt)}" data-film-pos="${FILMS[l.film].pos}"` : '';
  return `<li class="lt" data-cats="${l.cats.join(' ')}">
<figure class="lt-f"><a class="lt-a" href="${largest(l.photo)}" data-vw data-i="${i}" data-src="${largest(l.photo)}" data-srcset="${srcset(l.photo)}" data-w="${P.w}" data-h="${P.h}" data-alt="${esc(P.alt)}" data-cap="${esc(plain(l.cap))}"${crTxt ? ` data-cr="${esc(crTxt)}"` : ''}${filmAttrs}><span class="lt-m">${pic(l.photo, { sizes: '(max-width:599px) 46vw, (max-width:899px) 31vw, (max-width:1439px) 23vw, 320px', pos: TILE_POS[l.photo] })}</span><span class="vh">Open larger: </span><span class="lt-n" aria-hidden="true">${pad2(i + 1)}</span>${l.film ? '<span class="lt-fi" aria-hidden="true">Film</span>' : ''}</a>
<figcaption class="cap lt-cap">${l.cap}${cr ? `<span class="cap-cr">Makeup by ${SITE.first} &middot; ${cr}</span>` : ''}</figcaption></figure>
</li>`;
};

const chips = () => {
  const all = `<button class="chip" type="button" data-cat="" aria-pressed="true">All <span class="chip-n">${LOOKS3.length}</span></button>`;
  return `<div class="lk-bar" role="group" aria-label="Show looks by category">${all}${Object.entries(LOOK_CATS3).map(([k, v]) => `<button class="chip" type="button" data-cat="${k}" aria-pressed="false">${v} <span class="chip-n">${looksIn3(k).length}</span></button>`).join('')}</div>`;
};

const viewer = () => `<div class="vw" id="lookViewer" role="dialog" aria-modal="true" aria-labelledby="vwH" hidden>
<div class="vw-top">
<p class="ctr vw-ctr" aria-hidden="true"><span data-vw-n>01</span><i></i><span data-vw-t>${pad2(LOOKS3.length)}</span></p>
<h2 class="vh" id="vwH">Look viewer</h2>
<button class="vw-x" type="button" data-vw-close>Close <span aria-hidden="true">&times;</span></button>
</div>
<div class="vw-stage" data-vw-stage><img class="vw-img" data-vw-img alt="" width="1280" height="1600"><div class="vw-film" data-vw-film hidden></div></div>
<div class="vw-bar">
<button class="ic-btn vw-prev" type="button" data-vw-prev aria-label="Previous look"><span aria-hidden="true">&larr;</span></button>
<p class="vw-cap" data-vw-cap aria-live="polite"></p>
<button class="ic-btn vw-next" type="button" data-vw-next aria-label="Next look"><span aria-hidden="true">&rarr;</span></button>
</div>
<div class="vw-acts"><button class="more vw-clip" type="button" data-vw-clip hidden>Watch the clip</button><a class="more vw-full" data-vw-full href="${largest(LOOKS3[0].photo)}">Full size ${arrow}</a></div>
</div>`;

export const portfolio = () => {
  const coverMain = cover({
    kick: PORTFOLIO_PAGE.kick,
    heading: PORTFOLIO_PAGE.heading,
    sub: `${LOOKS3.length} looks, photographs and her own film, from soft glam to full glam.`,
    film: COVER_FILM,
    after: `<nav class="pf-jump rv" aria-label="On this page"><a href="#looks">The Looks</a><a href="#reel">The Reel</a><a href="#all">Every look</a></nav>`,
  });

  const looks = section({ id: 'looks', tone: 'ivory', rule: true, cls: 'pf-looks', labelledby: 'looksH', wrap: false }, `
<div class="wrap pf-hd">
<div>${kicker('The lookbook', 'rv')}${h(2, ['The', 'Looks'], 'd-xl rv-mask', 'id="looksH"')}</div>
${lede('Brides, glam, hair and colour, with her own film among the photographs. The runway moves on its own; swipe, or use the arrows, to take it at your pace.', 'rv')}
</div>
${rail({ id: 'pfRail', items: RAIL, label: 'The Looks', auto: 3400 })}
<div class="wrap">${next(inquire(S, '<span>Bridal inquiry</span>', 'btn btn--pri'), more('#all', 'Every look'))}</div>`);

  const reel = section({ id: 'reel', tone: 'linen', cls: 'pf-reel', labelledby: 'reelH' }, `
<div class="split split--75 pf-reel-hd">
<div>${kicker('Her own film', 'rv')}${h(2, ['The', 'Reel'], 'd-xl rv-mask', 'id="reelH"')}</div>
<div class="rv">${lede('Her own clips from TikTok, silent and looping. The three posts pinned to her profile lead, with their view counts.')}
<dl class="pf-soc"><div><dt>Followers on TikTok</dt><dd>${SOCIAL.tiktok.followers}</dd></div><div><dt>Likes on TikTok</dt><dd>${SOCIAL.tiktok.likes}</dd></div></dl>
<p class="pf-asof">As of ${SOCIAL.asOf}</p></div>
</div>
<h3 class="pf-sub rv"><span>Pinned on her TikTok</span></h3>
<div class="rl-pin" data-stag=".1">${PINNED.map((id) => reelCard(id, { big: true })).join('')}</div>
<h3 class="pf-sub rv"><span>More from her chair</span></h3>
<div class="rl-wall" data-stag=".06">${WALL.map((id) => reelCard(id)).join('')}</div>
${next(`<a class="btn btn--pri" href="${L.tiktok}" rel="external"><span>Watch more on TikTok</span></a>`, more(L.ig, 'Instagram @amairanymua'))}`);

  const every = section({ id: 'all', tone: 'ivory', cls: 'pf-all', labelledby: 'allH' }, `
${sectionHead({ kick: 'The lookbook, in full', heading: ['Every', 'look'], size: 'd-xl', id: 'allH', line: `All ${LOOKS3.length}: her newest work first, then her photographs. Choose a category, or tap a look to see it larger.` })}
${chips()}
<p class="vh" data-all-status aria-live="polite"></p>
<ul class="lk-g" data-all>${LOOKS3.map(tile).join('')}</ul>
${next(inquire(S, '<span>Begin your inquiry</span>', 'btn btn--pri'), book('event', '<span>Book event glam</span>', 'btn btn--sec'))}`);

  const follow = section({ id: 'follow', tone: 'espresso', cls: 'pf-follow', labelledby: 'followH' }, `
${sectionHead({ kick: PORTFOLIO_PAGE.noteKick, heading: ['Follow', 'the work'], id: 'followH', line: PORTFOLIO_PAGE.note })}
<ul class="pf-fl" data-stag=".1">
<li class="rv"><a class="pf-fa" href="${L.ig}" rel="external"><span class="pf-fk">Instagram</span><span class="pf-fn">${SITE.handle}</span><span class="pf-fg">Open Instagram ${arrow}</span></a></li>
<li class="rv"><a class="pf-fa" href="${L.tiktok}" rel="external"><span class="pf-fk">TikTok</span><span class="pf-fn">${SITE.handle}</span><span class="pf-fm">${SOCIAL.tiktok.followers} followers &middot; as of ${SOCIAL.asOf}</span><span class="pf-fg">Open TikTok ${arrow}</span></a></li>
</ul>
<div class="next rv">${actions({ tone: 'dark', align: 'c' })}</div>`);

  return page({
    path: 'portfolio',
    title: 'Portfolio · The Looks & The Reel',
    description: `Every look by ${SITE.name}, luxury bridal hair and makeup artist in Orlando and Tampa: ${LOOKS3.length} looks, photographs and her own film, from soft glam to full glam.`,
    head: `<link rel="preload" as="image" href="${filmSrc(COVER_FILM).poster}" fetchpriority="high">`,
    css: ['pages-work'],
    js: ['pages-work'],
    bodyClass: 'pf',
    main: withStarts(coverMain + looks + reel + every + follow),
    foot: viewer(),
  });
};

/* =====================================================================
   JOURNAL
   ===================================================================== */
const POSTS = [
  {
    path: 'journal/how-to-prepare', title: 'How to prepare for your glam', lines: ['How to prepare', 'for your glam'],
    dek: `&ldquo;${HER.prepare[0]}&rdquo; Her two asks before your appointment, then the preview, extensions and touch-ups, in her words.`,
    img: 'bride-pearls', cap: 'Bridal &middot; Soft glam',
  },
  {
    path: 'journal/destination-bride', title: 'Destination bride?', lines: ['Destination', 'bride?'],
    dek: '&ldquo;I travel worldwide for my brides.&rdquo; What she says about travel, and how to ask for a custom quote.',
    img: 'golden-hour', cap: 'Wedding day &middot; Golden hour',
  },
];

const jcard = (p, { big = false } = {}) => `<article class="jx${big ? ' jx--big' : ''} rv"><a class="jx-a" href="${href(S, p.path)}">
${frame(p.img, { ar: big ? '5/6' : '4/5', sizes: big ? '(max-width:899px) 92vw, 700px' : '(max-width:899px) 92vw, 480px', alt: '', rv: '' })}
<p class="jx-k">${SAMPLE}</p>
<h2 class="${big ? 'd-l' : 'd-m'} jx-t">${p.title}</h2>
<p class="jx-d">${p.dek}</p>
<span class="more jx-more">Read the article ${arrow}</span></a></article>`;

export const journal = () => {
  const c = cover({
    kick: 'The journal',
    heading: ['Notes from', 'her chair.'],
    sub: `Two sample articles, written only from ${SITE.first}’s own answers, to be finished with her.`,
  });
  const posts = section({ id: 'articles', tone: 'ivory', rule: true, cls: 'jx-sec', label: 'Articles' }, `
<div class="jx-g">${jcard(POSTS[0], { big: true })}${jcard(POSTS[1])}</div>
${next(inquire(S, '<span>Begin your inquiry</span>', 'btn btn--pri'), more(href(S, 'bridal'), 'Bridal packages'))}`);
  return page({
    path: 'journal',
    title: 'Journal',
    description: `Notes from ${SITE.name}’s chair: two sample articles, on preparing for your glam and on destination weddings, built from her own answers.`,
    css: ['pages-work'],
    bodyClass: 'jr-page',
    main: c + posts,
  });
};

/* ---------- the article frame shared by both posts ---------- */
const faqA = (q) => HER.faq.find(([x]) => x === q)?.[1] ?? '';

const article = ({ i, sections, toc, after = '' }) => {
  const p = POSTS[i], other = POSTS[1 - i];
  const c = cover({
    kick: 'The journal &middot; Sample article',
    heading: p.lines,
    sub: p.dek,
    image: p.img,
    after: `<p class="ar-label rv"><span>${SAMPLE}</span></p>`,
  });
  const body = section({ tone: 'ivory', rule: true, cls: 'ar-sec', label: 'The article' }, `
<div class="ar-g">
<aside class="ar-side rv" aria-label="In this article">
<p class="ar-sk">In this article</p>
<ol class="ar-toc">${toc.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ol>
<p class="ar-sk">Next steps</p>
<ul class="ar-go"><li><a href="${href(S, 'bridal')}">Bridal packages</a></li><li>${inquire(S, 'Bridal inquiry')}</li></ul>
</aside>
<article class="ar">
<p class="ar-meta rv">${SAMPLE} &middot; Built from her own words</p>
${sections}
</article>
</div>${after}`);
  const nav = section({ tone: 'ivory', rule: true, cls: 'ar-end', label: 'More from the journal' }, `
<nav class="ar-pn" aria-label="Between articles">
${i === 1 ? `<a class="ar-pn-a ar-pn-prev rv" href="${href(S, other.path)}"><span class="ar-pn-k"><span aria-hidden="true">&larr;</span> Previous article</span><span class="d-s ar-pn-t">${other.title}</span></a>` : `<a class="ar-pn-a ar-pn-prev rv" href="${href(S, 'journal')}"><span class="ar-pn-k"><span aria-hidden="true">&larr;</span> The journal</span><span class="d-s ar-pn-t">All articles</span></a>`}
${i === 0 ? `<a class="ar-pn-a ar-pn-next rv" href="${href(S, other.path)}"><span class="ar-pn-k">Next article <span aria-hidden="true">&rarr;</span></span><span class="d-s ar-pn-t">${other.title}</span></a>` : `<a class="ar-pn-a ar-pn-next rv" href="${href(S, 'journal')}"><span class="ar-pn-k">The journal <span aria-hidden="true">&rarr;</span></span><span class="d-s ar-pn-t">All articles</span></a>`}
</nav>
${next(inquire(S, '<span>Begin your bridal inquiry</span>', 'btn btn--pri'), more(href(S, 'bridal'), 'See the bridal packages'))}`);
  return withStarts(c + body + nav);
};
const hd2 = (id, text) => `<h2 class="d-s ar-h rv" id="${id}">${text}</h2>`;
const para = (text, cls = '') => `<p class="ar-p${cls ? ` ${cls}` : ''} rv">${text}</p>`;
const pq = (text, cite = SITE.first) => quote(`&ldquo;${text}&rdquo;`, cite, 'ar-pq rv');

/* ---------- 1: How to prepare for your glam ---------- */
const TOUCH = HER.packages
  .map((pk) => ({ name: pk.name, who: pk.who.replace(/\s*·\s*most popular/i, ''), pts: pk.points.filter((x) => /touch-up/i.test(x)) }))
  .filter((x) => x.pts.length);

export const postPrepare = () => {
  const trial = faqA('Do you offer trials?');
  const ext = faqA('Do you recommend hair extensions?');
  const ar = article({
    i: 0,
    toc: [['before', 'Two asks before your appointment'], ['preview', 'The preview comes first'], ['extensions', 'On extensions'], ['touchups', 'After the ceremony']],
    sections: `
${hd2('before', 'Two asks before your appointment')}
${para(`Before any appointment, ${SITE.first} asks for two things: a clean face, and hair that was washed and blown out the day before.`, 'ar-lead')}
<ol class="ar-list rv">${HER.prepare.map((x, k) => `<li><span class="ar-ln" aria-hidden="true">${pad2(k + 1)}</span><span>${x}</span></li>`).join('')}</ol>
<p class="ar-src rv">Her own words</p>

${hd2('preview', 'The preview comes first')}
${para(`Preview sessions are available for both hair and makeup. In her own words:`)}
${pq(trial.split('. ').slice(1).join('. '))}

${hd2('extensions', 'On extensions')}
${para(`For maximum volume and longevity with glam waves, she highly recommends hair extensions. They can be rented directly from her, or she can guide you toward the best extensions to purchase.`)}
${pq(ext.split('. ')[0] + '.')}
<div class="ar-fig rv">${pair({ image: 'reel-bride-pearls-updo', film: 'f3', cap: 'Bridal &middot; Sleek updo &amp; pearls', filmCap: `Film &middot; ${FILMS.f3.title}` })}</div>

${hd2('touchups', 'After the ceremony')}
${para('Touch-ups are written into her packages. As listed on her booking page:')}
<dl class="ar-tu rv">${TOUCH.map((x) => `<div><dt><span class="ar-tun">${x.name}</span><span class="ar-tuw">${x.who}</span></dt>${x.pts.map((pt) => `<dd>${pt}</dd>`).join('')}</div>`).join('')}</dl>
${para(`Ready to talk about your day? Start with <a href="${href(S, 'bridal-inquiry')}">the bridal inquiry</a>, or see every package on <a href="${href(S, 'bridal')}">the Bridal page</a>.`)}`,
  });
  return page({
    path: 'journal/how-to-prepare',
    title: 'How to Prepare for Your Glam · Journal',
    description: `${SITE.first} asks for a clean face and hair washed and blown out a day before your appointment; here are her preview sessions, extensions and touch-ups, in her own words.`,
    head: `<link rel="preload" as="image" href="${src(POSTS[0].img, 800)}" imagesrcset="${srcset(POSTS[0].img)}" imagesizes="(max-width:899px) 62vw, 380px" fetchpriority="high">`,
    css: ['pages-work'],
    bodyClass: 'ar-page',
    main: ar,
  });
};

/* ---------- 2: Destination bride? ---------- */
export const postDestination = () => {
  const travel = faqA('Do you travel?');
  const [l1, l2, l3] = HER.destination.body.split(/(?<=[.!])\s+/);
  const ar = article({
    i: 1,
    toc: [['worldwide', 'Worldwide'], ['ask', 'How to ask'], ['home', 'Closer to home']],
    sections: `
${hd2('worldwide', 'Worldwide')}
${para(`${SITE.first} travels worldwide for her brides, and she asks the bride to begin the conversation about travel.`, 'ar-lead')}

${hd2('ask', 'How to ask')}
${para(`For a destination wedding, she asks brides to reach out directly to discuss travel availability and receive a custom quote. The quickest way to start is <a href="${href(S, 'bridal-inquiry')}">the bridal inquiry</a>, or see every package on <a href="${href(S, 'bridal')}">the Bridal page</a>.`)}
<blockquote class="ar-her rv"><p class="ar-sk">${HER.destination.heading}</p><p>&ldquo;${l1} ${l2}&rdquo;</p><cite>${SITE.first}</cite></blockquote>
${pq(l3)}
<div class="ar-fig rv">${pair({ image: 'wedding-night', film: 'f7', cap: 'Wedding day &middot; After dark', filmCap: `Film &middot; ${FILMS.f7.title}` })}</div>

${hd2('home', 'Closer to home')}
${para(`Her own answer, when brides ask whether she travels:`)}
<div class="ar-qa rv"><p class="ar-q">Do you travel?</p><p class="ar-a">&ldquo;${travel}&rdquo;</p><p class="ar-src">${SITE.first}, in her own words</p></div>
${spec(HER.badges, 'rv ar-spec')}`,
  });
  return page({
    path: 'journal/destination-bride',
    title: 'Destination Bride? · Journal',
    description: `${SITE.name} travels worldwide for her brides, and all across Central Florida and out of state; reach out directly for travel availability and a custom quote.`,
    head: `<link rel="preload" as="image" href="${src(POSTS[1].img, 800)}" imagesrcset="${srcset(POSTS[1].img)}" imagesizes="(max-width:899px) 62vw, 380px" fetchpriority="high">`,
    css: ['pages-work'],
    bodyClass: 'ar-page',
    main: ar,
  });
};
