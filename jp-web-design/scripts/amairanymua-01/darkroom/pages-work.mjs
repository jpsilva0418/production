/* /demo/amairanymua-01 — site "darkroom": the Portfolio, the Journal index and the two journal posts.

   PORTFOLIO
     1. The title card (both ways to book).
     2. The Looks: her looks hung on a drying line with binder clips, film strips among the stills,
        swaying a little; the line moves sideways (swipe, drag, the arrows, or the keyboard).
     3. The Reel: one strip of 35mm holding her four films (marked slots until the clips arrive).
     4. The contact sheet: every look, by category, on a proof sheet. Any frame (or any print on the
        line) opens under the loupe: a large print on the red-lit table, with its frame number,
        caption and counter; arrows, swipe, Escape. Without script every frame links to its 1280 file.
     5. The closing invitation, Instagram and TikTok, then the end card.
   JOURNAL
     The index (the two posts as editorial rows) and the two posts, built ONLY from her own words:
     "How to prepare for your glam" (HER.prepare, the trial and extension answers in HER.faq, the
     touch-up inclusions in HER.packages) and "Destination bride?" (HER.destination and the travel
     answer in HER.faq). Each is labelled a sample article. */
import { SITE, HER, LOOKS, LOOK_CATS, looksIn, FILMS, film, PHOTOS, PORTFOLIO_PAGE, L, A, href, inquire, src, srcset, esc, arrow } from '../site.mjs';
import { S, D, page, cover, band, chapter, kick, h, note, print, strip, more, cta, POSTS, postCard, SAMPLE, scrawlArrow, tick } from './shell.mjs';

const pad = (n) => String(n).padStart(2, '0');
const plain = (s) => String(s).replace(/&amp;/g, '&');
const fr = (i) => `${i + 1}A`;
const large = (key) => `${A}/img/${key}-1280.webp`;
/* the line's grease-pencil stroke (the kit's underline path), for the category tabs */
const STROKE = '<svg class="mk mk-line" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M3 7c22-3 47-4 70-2 9 1 17 0 24-1"/></svg>';
/* the data the loupe reads from every frame that opens it */
const lookData = (i) => {
  const l = LOOKS[i], p = PHOTOS[l.photo];
  return `data-v="${i}" data-photo="${l.photo}" data-w="${p.w}" data-h="${p.h}" data-pos="${p.pos}" data-cap="${esc(l.cap)}" data-n="${fr(i)}" data-alt="${esc(p.alt)}"`;
};

/* ======================= PORTFOLIO ======================= */

/* the title card's print (bride-ruby, look 6A). It shows from 900px only (preloaded there), so on
   a phone it is lazy and, hidden, never downloads. */
const COVER = LOOKS[5].photo;
const coverPf = (o) => cover(o).replace(' fetchpriority="high"', ' loading="lazy"');

/* The Looks: stills in LOOKS order with three films hung among them */
const LINE = [0, 1, 'f1', 2, 3, 4, 'f4', 5, 6, 'f2', 7, 8, 9];
const SWAY = [-1.4, 0.9, -0.5, 1.3, -1, 0.6, -1.5, 1.1, -0.7, 1.4, -1.1, 0.5, -0.9];
const LINE_SIZES = '(max-width:759px) 64vw, 320px';

const lineItem = (it, k) => {
  const r = SWAY[k % SWAY.length];
  if (typeof it === 'string') {
    const f = FILMS[it];
    return `<li class="dl-i dl-i--film" style="--i:${k};--r:${r}deg"><span class="clip" aria-hidden="true"></span>${strip(it, { n: `F${pad(f.n)}`, label: f.label, cap: `Film ${pad(f.n)} &middot; ${f.label}` })}</li>`;
  }
  const l = LOOKS[it];
  const label = l.cap.split(' · ')[0];
  return `<li class="dl-i${k % 3 === 1 ? ' dl-i--sm' : ''}" style="--i:${k};--r:${r}deg"><span class="clip" aria-hidden="true"></span><a class="dl-a" href="${large(l.photo)}" ${lookData(it)}>${print(l.photo, { shape: 'nat', n: fr(it), note: label, sizes: LINE_SIZES, eager: k < 2, cap: l.cap, stage: 480 })}</a></li>`;
};

const looks = () => band(`${chapter({ kick: 'The Looks', n: '02', heading: ['On the line,', 'drying.'], lead: 'Swipe along the line, drag it, or use the arrows. Tap any print to see it up close, with its frame number and caption.', split: true })}
</div>
<div class="dl" id="dryingLine">
<div class="dl-vp" id="dlVp" tabindex="0" role="region" aria-label="The Looks: ${LOOKS.length} looks and three films on a line. Scroll sideways to see them all.">
<ol class="dl-tr">
${LINE.map(lineItem).join('\n')}
</ol>
</div>
</div>
<div class="wrap">
<div class="dl-ctl">
<p class="dl-hint edge">${note('swipe the line', { rot: -5, cls: 'gp--sm' })} <span>${LOOKS.length} looks &middot; 3 films</span></p>
<span class="dl-prog" aria-hidden="true"><i id="dlProg"></i></span>
<div class="dl-btns"><button class="dl-b" id="dlPrev" type="button" aria-label="Previous prints on the line">${arrow}</button><button class="dl-b" id="dlNext" type="button" aria-label="Next prints on the line">${arrow}</button></div>
</div>`, { tone: 'room', id: 'looks', cls: 'pf-looks', label: 'The Looks', glow: false });

/* The Reel: one strip of film, four frames */
const reel = () => band(`${chapter({ kick: 'The Reel', n: '03', heading: ['The Reel.', 'Four films, one strip.'], lead: 'Bridal, full glam, getting ready and glam waves: her reels, frame by frame on a strip of 35mm. Each frame plays its clip as soon as it is added.', split: true })}
<div class="reel rv" style="--d:.1s">
<div class="reel-vp" tabindex="0" role="region" aria-label="The Reel: four films">
<ol class="reel-l">
${Object.keys(FILMS).map((id, i) => `<li class="reel-f"><span class="reel-e" aria-hidden="true">${i % 2 ? `&#9656; ${pad(FILMS[id].n)}A` : `AMAIRANY 400 &#9656; ${pad(FILMS[id].n)}A`}</span>${film(id, { label: FILMS[id].label })}<p class="reel-cap edge">Film ${pad(FILMS[id].n)} &middot; ${FILMS[id].label}</p></li>`).join('\n')}
</ol>
</div>
</div>`, { tone: 'paper', id: 'reel', cls: 'pf-reel', label: 'The Reel' });

/* The contact sheet: every look, filtered by category, each frame opening the loupe */
const CATS = Object.keys(LOOK_CATS);
const proof = () => band(`${chapter({ kick: 'The contact sheet', n: '04', heading: ['Every look,', 'by category.'], lead: 'Choose a category, then open any frame under the loupe. Use the arrow keys, or swipe, to move from one look to the next.', split: true })}
<div class="pf-tabs rv" role="group" aria-label="Show looks by category">
<button class="pf-tab" type="button" data-cat="all" aria-pressed="true"><span class="pf-tab-t">All</span><span class="pf-tab-n">${LOOKS.length}</span>${STROKE}</button>
${CATS.map((c) => `<button class="pf-tab" type="button" data-cat="${c}" aria-pressed="false"><span class="pf-tab-t">${LOOK_CATS[c]}</span><span class="pf-tab-n">${looksIn(c).length}</span>${STROKE}</button>`).join('\n')}
</div>
<p class="vh" id="pfLive" aria-live="polite"></p>
<div class="pf-sheet rv" style="--d:.08s" id="pfSheet">
${LOOKS.map((l, i) => `<a class="pf-f" href="${large(l.photo)}" ${lookData(i)} data-cats="${l.cats.join(' ')}">
<span class="pf-im"><img src="${src(l.photo, 480)}" srcset="${srcset(l.photo)}" sizes="(max-width:599px) 44vw, (max-width:999px) 30vw, 230px" width="${PHOTOS[l.photo].w}" height="${PHOTOS[l.photo].h}" alt="${esc(PHOTOS[l.photo].alt)}" style="object-position:${PHOTOS[l.photo].pos}" loading="lazy" decoding="async"></span>
<span class="pf-meta"><span class="pf-n" aria-hidden="true">&#9656; ${fr(i)}</span><span class="pf-cap">${l.cap}</span></span>
</a>`).join('\n')}
</div>
<p class="pf-foot edge rv">${tick()} <span>${LOOKS.length} frames &middot; photographs from ${SITE.handle}, shown with her permission</span></p>`, { tone: 'room', id: 'sheet', cls: 'pf-proof', label: 'Every look, by category' });

/* The loupe: one dialog, hidden until a frame opens it (moved to the end of <body> by its script) */
const loupe = () => {
  const l = LOOKS[0], p = PHOTOS[l.photo];
  return `<div class="lp" id="loupe" role="dialog" aria-modal="true" aria-label="Look viewer" data-img="${A}/img/" data-dev="${D}/dev/" hidden>
<span class="grain" aria-hidden="true"></span><span class="lp-glow" aria-hidden="true"></span>
<div class="lp-top">
<p class="lp-count edge"><span id="lpN">01</span> / <span id="lpT">${pad(LOOKS.length)}</span></p>
<button class="lp-x" id="lpClose" type="button"><span>Close</span><i aria-hidden="true"></i></button>
</div>
<div class="lp-stage" id="lpStage">
<figure class="pr pr--nat pr--dvm lp-pr" id="lpPr" style="--tilt:-1deg;--r:${(p.w / p.h).toFixed(4)}">
<span class="pr-im" id="lpIm" style="--pos:${p.pos};aspect-ratio:${p.w}/${p.h}"><img id="lpImg" src="${src(l.photo, 800)}" sizes="(max-width:759px) 88vw, 720px" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" loading="lazy" decoding="async"><span class="dv" aria-hidden="true"><i class="dv-m"></i><i class="dv-l"></i><i class="dv-p"></i></span></span>
<span class="pr-b" aria-hidden="true"><span class="pr-n" id="lpFr">&#9656; ${fr(0)}</span></span>
</figure>
</div>
<div class="lp-bar">
<button class="lp-nav" id="lpPrev" type="button" aria-label="Previous look"><span aria-hidden="true">&larr;</span></button>
<p class="lp-cap" id="lpCap" aria-live="polite"><span class="lp-cn edge" id="lpCn">&#9656; ${fr(0)}</span><span class="lp-ct" id="lpCt">${l.cap}</span></p>
<button class="lp-nav" id="lpNext" type="button" aria-label="Next look"><span aria-hidden="true">&rarr;</span></button>
</div>
<div class="lp-foot">
<button class="lp-zoom" id="lpZoom" type="button" aria-pressed="false"><i aria-hidden="true"></i>Loupe</button>
<p class="lp-hint edge" aria-hidden="true"><span class="lp-h-t">Swipe for the next look</span><span class="lp-h-k">Arrow keys move &middot; Esc closes</span></p>
</div>
</div>`;
};

/* The closing invitation: Instagram and TikTok */
const follow = () => band(`${chapter({ kick: PORTFOLIO_PAGE.noteKick, n: '05', heading: ['More of her work,', 'on her socials.'], lead: PORTFOLIO_PAGE.note, split: true })}
<ul class="pf-soc rv" style="--d:.1s">
<li><a class="pf-so" href="${L.ig}" rel="external"><span class="edge pf-so-k">Instagram</span><span class="pf-so-h">${SITE.handle}</span><span class="pf-so-go">Open Instagram ${arrow}</span></a></li>
<li><a class="pf-so" href="${L.tiktok}" rel="external"><span class="edge pf-so-k">TikTok</span><span class="pf-so-h">${SITE.handle}</span><span class="pf-so-go">Open TikTok ${arrow}</span></a></li>
</ul>`, { tone: 'paper', id: 'follow', cls: 'pf-follow', label: 'Instagram and TikTok' });

export const portfolio = () => page({
  path: 'portfolio',
  title: 'Portfolio',
  description: `${SITE.name}’s bridal, soft glam, full glam, glam waves and wedding-day looks, photographed for clients across ${SITE.area}.`,
  css: ['pages-work'],
  js: ['pages-work'],
  bodyClass: 'pf',
  head: `<link rel="preload" as="image" href="${src(COVER, 800)}" imagesrcset="${srcset(COVER)}" imagesizes="(max-width:759px) 78vw, 36vw" media="(min-width:900px)" fetchpriority="high">`,
  main: `${coverPf({ kick: PORTFOLIO_PAGE.kick, n: '01', heading: PORTFOLIO_PAGE.heading, sub: `${LOOKS.length} of her looks, from bridal to full glam and glam waves, hung on the line with her films among them.`, image: COVER, frame: fr(5), note: 'Bridal', tilt: 2 })}
${looks()}
${reel()}
${proof()}
${follow()}
${cta({ kick: 'Ready when you are', heading: ['Secure your', 'wedding day glam.'], copy: 'Weddings start with an inquiry. Events book straight onto her calendar.', scrawl: 'I’d love to have you in my chair!' })}
${loupe()}`,
});

/* ======================= JOURNAL ======================= */

export const journal = () => page({
  path: 'journal',
  title: 'Journal',
  description: `Two sample notes from ${SITE.name}’s chair, in her own words: how to prepare for your glam, and destination weddings.`,
  css: ['pages-work'],
  bodyClass: 'jx',
  main: `${cover({ kick: 'Journal', n: '01', heading: ['Notes from', 'the chair.'], sub: 'Her own advice, in her own words, for brides getting ready.', actions: false })}
${band(`<p class="jx-label edge rv"><span class="jx-dot" aria-hidden="true"></span>${SAMPLE}s: two notes, drawn only from her own words</p>
<div class="jx-l">${POSTS.map((p, i) => `<div class="jx-i rv" style="--d:${(0.06 * i).toFixed(2)}s"><p class="jx-n edge" aria-hidden="true">Note ${pad(i + 1)}</p>${postCard(p, { level: 2 })}</div>`).join('\n')}</div>`, { tone: 'paper', id: 'notes', cls: 'jx-b', label: 'The notes' })}
${cta({ scrawl: 'I’d love to have you in my chair!' })}`,
});

/* ---------- the article frame shared by both posts ---------- */
/* a pull quote: her own line, first person, in grease pencil */
const pq = (text, { rot = -2.5, src: from = SITE.first, side = '' } = {}) => `<figure class="pq${side ? ` pq--${side}` : ''} rv-w">
<blockquote>${note(`&ldquo;${text}&rdquo;`, { rot, cls: 'pq-t', say: true })}</blockquote>
<figcaption class="edge pq-c">${scrawlArrow('nw', 'pq-ar')}<span>${from}</span></figcaption>
</figure>`;
/* her full answer, quoted as she wrote it */
const said = (q, a, from = 'from her FAQ') => `<blockquote class="said rv"><p class="edge said-q">${q ? `${q} &middot; ` : ''}${from}</p><p>&ldquo;${a}&rdquo;</p></blockquote>`;
const faq = (q) => HER.faq.find(([x]) => x === q)[1];

const article = ({ path, post, lead, sections, glance, glanceH }) => {
  const i = POSTS.indexOf(post);
  const prev = POSTS[i - 1], next = POSTS[i + 1];
  const nav = [prev && { p: prev, k: 'Previous note' }, next && { p: next, k: 'Next note' }].filter(Boolean);
  return `<article class="art">
<header class="art-hd band band--room band--glow">
<span class="grain" aria-hidden="true"></span>
<div class="wrap art-hd-in">
<p class="art-crumb rv"><a href="${href(S, 'journal')}">Journal</a> <span aria-hidden="true">&#9656;</span> <span>${post.tag}</span></p>
${h(1, post.title, 'd-xl art-h rv', 'style="--d:.06s"')}
<p class="art-sample rv" style="--d:.1s"><span class="jx-dot" aria-hidden="true"></span>${SAMPLE}</p>
<p class="lead art-lead rv" style="--d:.14s">${lead}</p>
</div>
<div class="wrap art-fig">${print(post.photo, { shape: 'wide', n: post.n, note: post.tag.toLowerCase(), tilt: i ? 1.2 : -1.2, eager: true, sizes: '(max-width:759px) 92vw, (max-width:1279px) 80vw, 1040px' })}</div>
</header>
<div class="band band--paper art-body">
<div class="wrap art-g">
<aside class="art-side" aria-label="In this note">
<p class="edge art-side-h">In this note</p>
<ol class="art-toc">${sections.map((s, k) => `<li><a href="#${s.id}"><span aria-hidden="true">${pad(k + 1)}</span>${s.toc}</a></li>`).join('')}</ol>
<div class="art-glance"><p class="edge art-side-h">${glanceH}</p><dl>${glance.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
</aside>
<div class="art-tx">
${sections.map((s, k) => `<section class="art-s" id="${s.id}" aria-labelledby="${s.id}-h">
<p class="edge art-s-n rv" aria-hidden="true">${pad(k + 1)}</p>
<h2 class="d-m art-s-h rv" id="${s.id}-h" style="--d:.04s">${s.h}</h2>
<div class="prose art-p">${s.body}</div>
</section>`).join('\n')}
<div class="art-next rv">
<p class="edge">Planning your day?</p>
<p class="art-next-l">Start with her bridal inquiry, or see all six bridal packages.</p>
<div class="art-next-a">${inquire(S, `Start your bridal inquiry ${arrow}`, 'btn btn--main')}${more(href(S, 'bridal'), 'Bridal packages')}</div>
</div>
</div>
</div>
</div>
<nav class="band band--tray art-pn" aria-label="More notes">
<span class="grain" aria-hidden="true"></span>
<div class="wrap">
<div class="art-pn-g">
${nav.map(({ p, k }) => `<a class="art-pn-a art-pn-a--${k.startsWith('Prev') ? 'prev' : 'next'}" href="${href(S, p.path)}">
${print(p.photo, { shape: 'land', n: p.n, alt: '', sizes: '(max-width:759px) 34vw, 200px', stage: 480, dev: false })}
<span class="art-pn-tx"><span class="edge">${k.startsWith('Prev') ? '&larr; ' : ''}${k}${k.startsWith('Next') ? ' &rarr;' : ''}</span><span class="d-s">${p.title}</span><span class="edge art-pn-s">${SAMPLE}</span></span>
</a>`).join('\n')}
<a class="art-pn-all more" href="${href(S, 'journal')}">All notes ${arrow}</a>
</div>
</div>
</nav>
</article>
${cta({ scrawl: 'I’d love to have you in my chair!' })}`;
};

/* ---------- 1. How to prepare for your glam ---------- */
const TOUCH = HER.packages
  .map((p) => ({ name: p.name, who: p.who.replace(/ · most popular$/, ''), pts: p.points.filter((x) => /touch-up/i.test(x)) }))
  .filter((p) => p.pts.length);
const touchBoard = () => `<div class="tb rv">
<p class="edge tb-h">Touch-ups and kits, package by package</p>
<ol class="tb-l">${TOUCH.map((p) => `<li><p class="tb-nm">${p.name}<span class="tb-who">${p.who}</span></p><ul>${p.pts.map((x) => `<li>${x}</li>`).join('')}</ul></li>`).join('')}</ol>
<p class="tb-note edge">Inclusions as listed on her booking page, November 2026.</p>
</div>`;

const prep = POSTS.find((p) => p.path === 'journal/how-to-prepare');
export const postPrepare = () => page({
  path: prep.path,
  title: prep.title,
  description: `How to prepare for your glam with ${SITE.name}: a clean face, hair washed and blown out a day before, the preview in every package, extensions for glam waves and touch-ups after the ceremony.`,
  css: ['pages-work'],
  bodyClass: 'art-page',
  head: `<link rel="preload" as="image" href="${src(prep.photo, 800)}" imagesrcset="${srcset(prep.photo)}" imagesizes="(max-width:759px) 92vw, (max-width:1279px) 80vw, 1040px" fetchpriority="high">`,
  main: article({
    path: prep.path,
    post: prep,
    lead: `Two things to do before your appointment, then what her packages already cover: the preview, the extensions, the touch-ups. All of it from ${SITE.first}’s own words.`,
    glanceH: 'Before your appointment',
    glance: [['Face', 'Clean'], ['Hair', 'Washed and blown out a day before'], ['Preview', 'In every package'], ['Trial', 'Welcome before signing']],
    sections: [
      { id: 'arrive', toc: 'Arrive ready', h: 'Arrive ready for the chair.', body: `<p>Before an appointment, ${SITE.first} asks for two things. The first is about your skin.</p>
${pq(HER.prepare[0], { rot: -3 })}
<p>The second is about your hair, and it happens the day before.</p>
${pq(HER.prepare[1], { rot: -1.5 })}` },
      { id: 'preview', toc: 'The preview', h: 'The preview comes first.', body: `<p>Every one of her six bridal packages includes a preview. For hair and makeup it is the first half of her two-part bridal artistry: a private preview session, then the wedding-day application. The makeup-only and hair-only packages carry their own makeup or hair preview.</p>
${pq('Our packages already include your preview', { rot: -2 })}
<p>And if you would rather see her work on you before you sign, a trial can be booked first. In her words:</p>
${said(HER.faq[4][0], faq('Do you offer trials?'))}` },
      { id: 'extensions', toc: 'Extensions', h: 'For glam waves that last.', body: `<p>If the look is glam waves, she highly recommends hair extensions, for volume and for longevity. You can rent them directly from her, or she can guide you toward the best ones to buy.</p>
${pq('For max volume &amp; longevity with glam waves, hair extensions are highly recommended.', { rot: -1.5 })}
<p>Two packages build them in: The Luxe Gala includes hair extension rental, and Glam Hair includes an extension install for the bride.</p>
${said(HER.faq[2][0], faq('Do you recommend hair extensions?'))}` },
      { id: 'touch-ups', toc: 'Touch-ups', h: 'After the ceremony.', body: `<p>Her bridal packages carry on past the ceremony, with touch-ups and touch-up kits. Here is what each one lists.</p>
${touchBoard()}` },
    ],
  }),
});

/* ---------- 2. Destination bride? ---------- */
const dest = POSTS.find((p) => p.path === 'journal/destination-bride');
const D_BODY = HER.destination.body;
export const postDestination = () => page({
  path: dest.path,
  title: plain(dest.title),
  description: `${SITE.name} travels worldwide for her brides and all across Central Florida and out of state, with a custom quote for every destination wedding.`,
  css: ['pages-work'],
  bodyClass: 'art-page',
  head: `<link rel="preload" as="image" href="${src(dest.photo, 800)}" imagesrcset="${srcset(dest.photo)}" imagesizes="(max-width:759px) 92vw, (max-width:1279px) 80vw, 1040px" fetchpriority="high">`,
  main: article({
    path: dest.path,
    post: dest,
    lead: `${SITE.first} travels worldwide for her brides. Here is how a destination wedding starts, in her own words.`,
    glanceH: 'Travel at a glance',
    glance: [['Worldwide', 'For her brides'], ['Central Florida', 'All across'], ['Out of state', 'Yes'], ['Quote', 'Custom, when you reach out']],
    sections: [
      { id: 'worldwide', toc: 'Worldwide', h: 'Worldwide, for her brides.', body: `<p>Getting married far from home? ${SITE.first} travels worldwide for her brides.</p>
${pq(`${D_BODY.split('. ')[0]}.`, { rot: -2.5 })}` },
      { id: 'closer', toc: 'Closer to home', h: 'Closer to home.', body: `<p>Nearer to home, she travels all across Central Florida, and out of state.</p>
${said(HER.faq[0][0], faq('Do you travel?'))}` },
      { id: 'quote', toc: 'Your quote', h: 'A quote for your destination.', body: `<p>For a destination wedding, reach out to her directly to talk through travel availability and receive a custom quote.</p>
${said(HER.destination.heading, D_BODY, 'from her booking page')}
${pq('I’d love to have you in my chair!', { rot: -4 })}` },
    ],
  }),
});
