/* /demo/amairanymua-01 — site "cocoa": the shell (document, header, menu, footer, the persistent
   Inquire bar) and the page kit every Cocoa page is built from. Documented for page authors in
   KIT.md (S/work/cocoa-lead/KIT.md).

   Cocoa: "proven, and booked". Her own espresso and warm cream, in a confident, conversion-first
   manner: cream pages, espresso bands, Libre Caslon Display for names, headlines and every number,
   Castoro italic for an italic word and her "Glam By", Manrope for the interface. 4-6px corners,
   1px oat hairlines, vertical 9:16 reel cards with view chips. No script lettering. */
import { head as stdHead, marker, href, NAV, SITE, HER, REVIEWS, SOCIAL, L, A, PHOTOS, FILMS, finePrint, inquire, book, pic, film, esc, arrow, pagesOf } from '../site.mjs';

export const S = 'cocoa';
/** This site's asset folder: `${C}/home.css`. */
export const C = `${A}/cocoa`;
export { arrow };

/* ---------- small marks (inline SVG, decorative) ---------- */
const STAR = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M6 .6l1.6 3.4 3.7.4-2.8 2.5.8 3.7L6 8.7 2.7 10.6l.8-3.7L.7 4.4l3.7-.4z"/></svg>';
/** Five small stars (decorative; always next to the number they illustrate). */
export const stars = (cls = '') => `<span class="stars${cls ? ` ${cls}` : ''}" aria-hidden="true">${STAR.repeat(5)}</span>`;
export const PLAY = '<svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M1.5 .8v8.4L9 5z"/></svg>';
export const CHEV_L = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M10 2.5 4.5 8l5.5 5.5"/></svg>';
export const CHEV_R = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 2.5 11.5 8 6 13.5"/></svg>';

/* ---------- the lockup ----------
   Her own lockup, "Glam By" over "AMAIRANYMUA", set as type (she has no logo file): Castoro italic
   over Libre Caslon caps, tracked. Decorative inside a labelled link, so aria-hidden by default;
   pass `label` to make it an image. */
export const lockup = ({ cls = '', label = '' } = {}) =>
  `<span class="lk${cls ? ` ${cls}` : ''}" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}><span class="lk-s">${HER.brand.script}</span><span class="lk-c">${HER.brand.caps}</span></span>`;

/* ---------- navigation ----------
   Cocoa's own page set (SITES.cocoa.pages), labelled from NAV where NAV has the page. NAV in
   site.mjs still lists the first sites' Services and Reviews, which Cocoa does not have. */
const NOTES = { portfolio: 'The Looks, The Reel', bridal: 'Packages and prices', about: 'Hey Gorgeous', journal: 'Notes from her chair', 'bridal-inquiry': 'Weddings start here' };
export const CNAV = pagesOf(S)
  .filter((p) => p && !p.includes('/'))
  .map((p) => {
    const n = NAV.find((x) => x.path === p);
    return { path: p, label: p === 'journal' ? 'Journal' : n?.label ?? p, menu: p === 'journal' ? 'Journal' : n?.menu ?? p, note: NOTES[p] ?? n?.note ?? '', cta: p === 'bridal-inquiry' };
  });
const cur = (c, p) => (c === p || (p && c.startsWith(`${p}/`)) ? ' aria-current="page"' : '');

/* ---------- type and furniture ---------- */
/** Small tracked caps above a heading. */
export const kicker = (text, cls = '') => `<p class="kick${cls ? ` ${cls}` : ''}">${text}</p>`;
/** A display heading in Libre Caslon. Put one word in <em> for Castoro italic:
 *  h(2, 'What brings you <em>here?</em>', 'd-l'). Sizes: d-xxl, d-xl, d-l, d-m, d-s. */
export const h = (level, text, cls = 'd-l', attrs = '') => `<h${level} class="${cls}"${attrs ? ` ${attrs}` : ''}>${text}</h${level}>`;
/** A lead paragraph (mocha on cream, oat on espresso). */
export const lede = (text, cls = '') => `<p class="lede${cls ? ` ${cls}` : ''}">${text}</p>`;
/** The standard section intro: kicker, heading (h2 unless level), lede. center: true centres it;
 *  side: markup placed at the right of the row on wide screens (a link, chips). */
export const sectionHead = ({ kick = '', heading, line = '', level = 2, id = '', center = false, side = '', cls = '', size = 'd-l' }) => {
  const inner = `${kick ? kicker(kick, 'rv') : ''}${h(level, heading, `${size} rv`, id ? `id="${id}"` : '')}${line ? lede(line, 'rv') : ''}`;
  return side
    ? `<div class="sh sh--row${cls ? ` ${cls}` : ''}"><div>${inner}</div><div class="rv">${side}</div></div>`
    : `<div class="sh${center ? ' sh--c' : ''}${cls ? ` ${cls}` : ''}">${inner}</div>`;
};
/** Both ways to book as a button pair. tone 'light' (cream/milk/oat ground) | 'dark' (espresso). */
export const actions = ({ inq = 'Inquire here', event = 'Book event glam', tone = 'light', cls = '' } = {}) =>
  `<div class="acts${cls ? ` ${cls}` : ''}">${inquire(S, `${inq} ${arrow}`, `btn ${tone === 'dark' ? 'btn--cream' : 'btn--pri'}`)}${book('event', event, `btn ${tone === 'dark' ? 'btn--out-l' : 'btn--out'}`)}</div>`;
/** A quiet text link with an arrow. more(href(S, 'about'), 'Meet Amairany'). */
export const more = (url, label, cls = '') => `<a class="lnk${cls ? ` ${cls}` : ''}" href="${url}"${/^https?:/.test(url) ? ' rel="external"' : ''}>${label} ${arrow}</a>`;
/** The next step that ends a section: an optional serif line, then the links you pass, then
 *  (unless inq:false) the bridal inquiry as a text link. links: [[url, label], ...] or markup. */
export const nextStep = ({ line = '', links = [], inq = 'Start your bridal inquiry', center = false, cls = '' } = {}) =>
  `<div class="next${center ? ' next--c' : ''}${cls ? ` ${cls}` : ''} rv">${line ? `<p class="next-l">${line}</p>` : ''}${links.map((l) => (Array.isArray(l) ? more(l[0], l[1]) : l)).join('')}${inq ? inquire(S, `${inq} ${arrow}`, 'lnk') : ''}</div>`;
/** "Now booking 2026 & 2027 weddings" as a chip. */
export const bookingChip = (cls = '') => `<p class="chip${cls ? ` ${cls}` : ''}"><span class="chip-dot" aria-hidden="true"></span>${HER.booking}</p>`;

/* the three rating sources, read from site.mjs */
export const RATINGS = {
  google: { name: 'Google', score: REVIEWS.google.score, meta: REVIEWS.google.meta, asOf: REVIEWS.google.asOf, href: L.google, go: 'Read on Google' },
  ww: { name: REVIEWS.sites[0].name, score: REVIEWS.sites[0].score, meta: REVIEWS.sites[0].meta, asOf: SITE.ratingsAsOf, href: REVIEWS.sites[0].href, go: REVIEWS.sites[0].go },
  knot: { name: REVIEWS.sites[1].name, score: REVIEWS.sites[1].score, meta: REVIEWS.sites[1].meta, asOf: SITE.ratingsAsOf, href: REVIEWS.sites[1].href, go: REVIEWS.sites[1].go },
};
/** A rating chip that links to the source: rateChip('google'). */
export const rateChip = (which = 'google', cls = '') => {
  const r = RATINGS[which];
  return `<a class="rate${cls ? ` ${cls}` : ''}" href="${r.href}" rel="external" aria-label="${r.name}: rated ${r.score} from ${r.meta}, as of ${r.asOf}. Read the reviews."><span class="rate-g" aria-hidden="true">${r.name[0]}</span><span class="rate-s" aria-hidden="true">${r.score}</span>${stars()}<span class="rate-n" aria-hidden="true">${r.name}</span></a>`;
};

/* ---------- photographs and film ---------- */
/** Her reels are transformations and open on the "before". Where a clip's finished glam appears
 *  (seconds): the first time a clip plays it starts there (site.js), then loops from the start
 *  like the original. Read from each clip, 2026-11-19. */
export const FILM_START = { f1: 3.0, f2: 4.5, f5: 6.0, f7: 5.0, f9: 9.0, f10: 10.0, f13: 4.0, f14: 1.8 };
const startAttr = (id) => (FILM_START[id] ? ` data-start="${FILM_START[id]}"` : '');
/** The caption for a still: the look, plus the collaborator credit where her caption names one. */
const capWith = (key, cap) => {
  const cr = PHOTOS[key]?.credit;
  if (!cap && !cr) return '';
  return `<figcaption class="cap">${cap}${cr ? `<span class="cap-cr">Makeup by ${SITE.first} &middot; ${cr}</span>` : ''}</figcaption>`;
};
/** One of her photographs in a frame.
 *  shape: 'port' 4:5 | 'tall' 3:4 | 'reel' 9:16 | 'sq' | 'wide' 3:2 | 'circ' circle | 'nat' natural, uncropped
 *  cap: small caps caption (a credited still always gets its credit line). rv: 'rv-im' | 'rv' | ''.
 *  The reel-* stills are 576px wide: keep their frames under ~600 CSS px. */
export const frame = (key, { shape = 'port', sizes = '(max-width:899px) 92vw, 46vw', alt, eager = false, pos, cls = '', cap = '', rv = 'rv-im' } = {}) =>
  `<figure class="fr${shape ? ` fr--${shape}` : ''}${cls ? ` ${cls}` : ''}${rv ? ` ${rv}` : ''}"><div class="fr-m">${pic(key, { alt, sizes, eager, pos })}</div>${capWith(key, cap)}</figure>`;
/** A film in a frame (same shapes as frame). The clip plays near the viewport (site.js). */
export const filmFrame = (id, { shape = 'reel', label = '', cls = '', cap = '', rv = 'rv-im' } = {}) =>
  `<figure class="fr fr--film${shape ? ` fr--${shape}` : ''}${cls ? ` ${cls}` : ''}${rv ? ` ${rv}` : ''}"><div class="fr-m"${startAttr(id)}>${film(id, { label })}</div>${cap ? `<figcaption class="cap">${cap}</figcaption>` : ''}</figure>`;
/** A vertical reel card: the clip, a views chip (the pinned three) or its label, a play mark, and
 *  its title and credit underneath. views: false hides the count. cap: false drops the caption. */
export const reelCard = (id, { views = FILMS[id].views, cap = true, cls = '', rv = 'rv', tag = 'figure' } = {}) => {
  const f = FILMS[id];
  const chip = views ? `<span class="reel-v">${PLAY}<span>${views} views</span></span>` : `<span class="reel-v">${f.label}</span>`;
  const caption = cap ? `<figcaption><span class="reel-t">${f.title}</span>${f.credit ? `<span class="reel-c">Makeup by ${SITE.first} &middot; ${f.credit}</span>` : `<span class="reel-c">${f.label}</span>`}</figcaption>` : '';
  return `<${tag} class="reel${cls ? ` ${cls}` : ''}${rv ? ` ${rv}` : ''}"><div class="reel-m"${startAttr(id)}>${film(id, { label: '' })}${chip}<span class="reel-p" aria-hidden="true">${PLAY}</span></div>${caption}</${tag}>`;
};
/** Picture beside film: a photograph and a clip side by side at every width. */
export const pair = ({ image, film: f = 'f1', cap = '', filmCap = '', alt, pos, cls = '' } = {}) =>
  `<div class="pair${cls ? ` ${cls}` : ''}">${frame(image, { shape: 'port', sizes: '(max-width:899px) 54vw, 34vw', alt, pos, cap })}${filmFrame(f, { shape: 'reel', cap: filmCap, rv: 'rv-im' }).replace('rv-im"', 'rv-im" style="--d:.12s"')}</div>`;

/* ---------- sections ---------- */
/** A section. tone: 'cream' | 'oat' | 'milk' | 'espresso'. wrap:false leaves out the inner .wrap. */
export const section = ({ id = '', tone = 'cream', cls = '', label = '', labelledby = '', wrap = true, attrs = '' }, inner) =>
  `<section class="sec sec--${tone}${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''}${label ? ` aria-label="${esc(label)}"` : ''}${labelledby ? ` aria-labelledby="${labelledby}"` : ''}${attrs ? ` ${attrs}` : ''}>${wrap ? `<div class="wrap">${inner}</div>` : inner}</section>`;

/** The title card that opens an interior page: kicker, the page's h1 (unless h1:false), a lede,
 *  the booking chip, both actions, and optionally a portrait (image) or a clip (film) beside it.
 *  `after` is appended under the actions (e.g. filter chips, a rating chip). */
export const cover = ({ kick = '', heading, sub = '', acts, image = '', film: f = '', alt, pos, h1 = true, chip = true, after = '', id = '', sizes = '(max-width:899px) 86vw, 38vw' } = {}) => {
  const media = image ? frame(image, { shape: 'port', eager: true, alt, pos, sizes, rv: '', cls: 'cover-m' })
    : f ? `<div class="cover-m">${reelCard(f, { rv: '' })}</div>` : '';
  return `<section class="cover${media ? ' cover--m' : ''}"${id ? ` id="${id}"` : ''}>
<div class="wrap cover-in"><div class="cover-txt">
${chip ? bookingChip() : ''}
${kick ? kicker(kick) : ''}
${h(h1 ? 1 : 2, heading, 'd-xl')}
${sub ? lede(sub) : ''}
${acts === false ? '' : acts ?? actions()}
${after}
</div>${media}</div>
</section>`;
};

/* ---------- the numbers band ---------- */
const YEARS_M = HER.years[0][1].replace(/\D+/g, '');   /* "13" */
const YEARS_H = HER.years[1][1].replace(/\D+/g, '');   /* "4" */
const split = (v) => { const m = String(v).match(/^([\d.,]+)(\D*)$/); return m ? `${m[1]}${m[2] ? `<small>${m[2]}</small>` : ''}` : v; };
/** Her proof, editorially, on espresso: years in makeup and hair, TikTok followers and likes, and
 *  5.0 on all three review sites, with the dates the counts were read. Only HER.years, SOCIAL and
 *  REVIEWS: nothing else may be added here. */
export const numbers = ({ id = '', cls = '' } = {}) => `<section class="nums on-dark${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''} aria-label="${SITE.first} in numbers">
<div class="wrap">
<ul class="nums-g" data-stag=".07">
<li class="nums-i rv"><span class="nums-v">${YEARS_M}</span><span class="nums-l">Years in makeup</span></li>
<li class="nums-i rv"><span class="nums-v">${YEARS_H}</span><span class="nums-l">Years in hair</span></li>
<li class="nums-i rv"><span class="nums-v">${split(SOCIAL.tiktok.followers)}</span><span class="nums-l">TikTok followers</span></li>
<li class="nums-i rv"><span class="nums-v">${split(SOCIAL.tiktok.likes)}</span><span class="nums-l">TikTok likes</span></li>
<li class="nums-i nums-i--wide rv"><span class="nums-v">5.0</span><span class="nums-l">Google, WeddingWire &amp; The Knot</span>${stars()}</li>
</ul>
<div class="nums-f rv"><p class="small">TikTok as of ${SOCIAL.asOf}. Ratings: WeddingWire ${RATINGS.ww.meta}, The Knot ${RATINGS.knot.meta} (${SITE.ratingsAsOf}); Google ${RATINGS.google.meta} (${RATINGS.google.asOf}).</p><p class="small">${HER.badges.join(' &middot; ')}</p></div>
</div>
</section>`;

/* ---------- her About ---------- */
/** Her chair portrait (the transparent cut-out) on oat, "Hey Gorgeous! I'm Amairany.", her own
 *  words (first person, quoted as hers), her years and badges, and a next step. Put it in an oat
 *  section. level: the heading level. moreLink: false drops the "Meet Amairany" link. */
export const aboutBlock = ({ level = 2, id = 'aboutH', moreLink = true, eager = false } = {}) => `<div class="ab">
<figure class="ab-fig fr--nat rv-im"><div class="fr-m">${pic('artist-chair-cut', { sizes: '(max-width:899px) 88vw, 44vw', eager })}</div></figure>
<div class="ab-txt">
${kicker('In her words', 'rv')}
${h(level, HER.hello.replace('Amairany.', '<em>Amairany.</em>'), 'd-l rv', `id="${id}"`)}
<blockquote class="ab-q rv" style="--d:.08s">${HER.about.map((p) => `<p>${p}</p>`).join('')}</blockquote>
<p class="ab-by rv">${SITE.name} &middot; ${SITE.handle}</p>
<ul class="ab-facts rv">${HER.years.map(([k, v]) => `<li><b>${v.replace(' years', '')}</b><span>Years ${k.toLowerCase()}</span></li>`).join('')}${HER.badges.map((b) => `<li><b aria-hidden="true">&#10003;</b><span>${b}</span></li>`).join('')}</ul>
<div class="rv">${actions({ inq: 'Start your bridal inquiry' })}</div>
${moreLink ? `<div class="rv" style="margin-top:8px">${more(href(S, 'about'), `Meet ${SITE.first}`)}</div>` : ''}
</div>
</div>`;

/* ---------- Love Notes ---------- */
/** Her name for reviews. Three rating cards, one tap each to the source. No review text is ever
 *  quoted (none has been chosen). */
export const loveNotes = ({ cls = '' } = {}) => `<ul class="ln${cls ? ` ${cls}` : ''}" data-stag=".08">${['ww', 'knot', 'google'].map((k) => { const r = RATINGS[k]; return `<li class="rv"><a class="ln-a" href="${r.href}" rel="external"><span class="ln-n">${r.name}</span><span class="ln-s">${r.score}</span>${stars()}<span class="ln-m">${r.meta} &middot; as of ${r.asOf}</span><span class="ln-go">${k === 'google' ? 'See all reviews on Google' : `See all reviews on ${r.name}`} ${arrow}</span></a></li>`; }).join('')}</ul>`;

/* ---------- packages ---------- */
/** One of HER.packages as a card, price in the serif. featured: the espresso card ("most popular").
 *  points: how many points to list (default all). act: markup for the card's foot (default an
 *  inquiry link). */
export const packageCard = (p, { featured = /most popular/i.test(p.who), points = p.points.length, act, cls = '' } = {}) => `<article class="pk${featured ? ' pk--pop' : ''}${cls ? ` ${cls}` : ''}">
${featured ? '<p class="pk-tag">Most popular</p>' : ''}<h3 class="pk-n">${p.name}</h3><p class="pk-w">${p.who.replace(/\s*·\s*most popular/i, '')}</p>
<p class="pk-p num"><span class="pk-cur">$</span>${p.price}</p>
<ul class="pk-l">${p.points.slice(0, points).map((x) => `<li>${x}</li>`).join('')}</ul>
${act ?? inquire(S, `Inquire about this package ${arrow}`, 'lnk')}
</article>`;
/** The note that must accompany any price. */
export const packagesNote = (cls = '') => `<p class="pk-note${cls ? ` ${cls}` : ''}">${HER.packagesNote}</p>`;

/** Questions and answers as native <details>: faq(HER.faq). Works with no script. */
export const faq = (items, cls = '') => `<div class="faq${cls ? ` ${cls}` : ''}">${items.map(([q, a]) => `<details class="faq-i"><summary><span>${q}</span><i class="faq-x" aria-hidden="true"></i></summary><div class="faq-a"><p>${a}</p></div></details>`).join('')}</div>`;
/** A pull quote of her own words (never a client's). */
export const quote = (text, cite = '', cls = '') => `<blockquote class="pq${cls ? ` ${cls}` : ''}"><p>${text}</p>${cite ? `<cite>${cite}</cite>` : ''}</blockquote>`;

/* ---------- filter chips + the looks rail ---------- */
/** Filter chips that show/hide the items of a target ([data-cats] children of #target).
 *  cats: { key: 'Label' } (e.g. LOOK_CATS). The first chip is "All". Hidden without script, where
 *  every item simply shows. counts: true adds each category's count. */
export const chips = ({ target, cats, label = 'Filter the looks', counts = null, cls = '' }) =>
  `<div class="fchips${cls ? ` ${cls}` : ''}" role="group" aria-label="${esc(label)}" data-filter="${target}"><button class="fchip" type="button" aria-pressed="true" data-cat="all">All</button>${Object.entries(cats).map(([k, v]) => `<button class="fchip" type="button" aria-pressed="false" data-cat="${k}">${v}${counts && counts[k] != null ? `<span class="fchip-n">${counts[k]}</span>` : ''}</button>`).join('')}</div>`;
/** A horizontal swipe rail of looks: stills and clips mixed. items: [{ photo, cap, cats } | { film, cap, cats }].
 *  Arrows (with script) scroll it a card at a time; chips({ target: id }) can filter it. */
export const rail = ({ id, items, label = 'Her looks' }) => `<div class="rail" data-rail>
<ul class="rail-t" id="${id}" tabindex="0" aria-label="${esc(label)}: swipe, or use the arrow keys">${items.map((it) => `<li class="rail-i" data-cats="${(it.cats ?? []).join(' ')}">${it.film
  ? reelCard(it.film, { views: false, cap: false, rv: '' }).replace('</figure>', `<figcaption class="cap">${it.cap ?? FILMS[it.film].title}${FILMS[it.film].credit ? `<span class="cap-cr">Makeup by ${SITE.first} &middot; ${FILMS[it.film].credit}</span>` : ''}</figcaption></figure>`)
  : frame(it.photo, { shape: 'tall', sizes: '(max-width:599px) 62vw, 300px', cap: it.cap ?? '', rv: '' })}</li>`).join('')}<li class="rail-end" aria-hidden="true"></li></ul>
<div class="wrap rail-ctl"><p class="small" data-rail-count aria-live="polite"></p><div class="rail-btns"><button class="ic-btn" type="button" data-rail-prev aria-controls="${id}" aria-label="Previous looks">${CHEV_L}</button><button class="ic-btn" type="button" data-rail-next aria-controls="${id}" aria-label="Next looks">${CHEV_R}</button></div></div>
</div>`;

/** A grid of reel cards (the viral grid). ids: FILMS ids. six: true shows only the first six on phones. */
export const reelGrid = ({ ids, six = false, cls = '' }) => `<div class="vg${six ? ' vg--six' : ''}${cls ? ` ${cls}` : ''}" data-stag=".06">${ids.map((id) => reelCard(id)).join('')}</div>`;

/* ---------- the closing band ---------- */
/** The espresso band that closes a page: her own line "Secure your wedding day glam", both actions,
 *  the booking chip. Use once per page, last thing in <main>. */
export const closing = ({ kick = 'Two ways to book', heading = 'Secure your wedding day <em>glam.</em>', line = 'Weddings start with an inquiry, so the reply is about your day. Events book straight onto her calendar.', id = 'closeH' } = {}) =>
  section({ tone: 'espresso', cls: 'close on-dark', labelledby: id, attrs: 'data-nobar' }, `${bookingChip('rv')}${kicker(kick, 'rv')}${h(2, heading, 'd-xl rv', `id="${id}"`)}${line ? lede(line, 'rv') : ''}<div class="rv">${actions({ tone: 'dark' })}</div>`);

/* ---------- the journal (shared by the home teaser and the journal pages) ---------- */
/** The two sample posts, built only from her own words. Every place that shows one labels it
 *  with POST_LABEL. */
export const POST_LABEL = 'Sample article, to be written with Amairany';
export const POSTS = [
  { path: 'journal/how-to-prepare', kick: 'Bridal prep', title: 'How to prepare for your glam', image: 'reel-bride-pearls-updo', excerpt: 'A clean face, hair washed and blown out the day before, and what her packages already include.' },
  { path: 'journal/destination-bride', kick: 'Travel', title: 'Destination bride?', image: 'reel-morning-veil', excerpt: '“I travel worldwide for my brides.” How to reach out about travel and a custom quote.' },
];
/** A journal card: postCard(POSTS[0]). */
export const postCard = (p, { level = 3, cls = '' } = {}) => `<a class="post${cls ? ` ${cls}` : ''} rv" href="${href(S, p.path)}">${frame(p.image, { shape: '', sizes: '(max-width:759px) 92vw, 560px', rv: '' })}<p class="post-k">${p.kick}</p><h${level} class="post-t">${p.title}</h${level}><p class="post-x">${p.excerpt}</p><p class="post-s">${POST_LABEL}</p></a>`;

/* ---------- header, menu, bar, footer ---------- */
/** The header's right side. `ghost` renders the copy the opening paints over its espresso panel:
 *  same layout, only the Inquire button visible (cream), no ids, out of the tab order. */
export const hdTools = (path, ghost = false) => `<div class="hd-tools">
${book('event', 'Book event', 'hd-ev', ghost ? 'tabindex="-1"' : '')}
${inquire(S, 'Inquire<span class="hd-cta-x">&nbsp;here</span>', 'btn btn--pri btn--sm hd-cta', `${path === 'bridal-inquiry' && !ghost ? 'aria-current="page" ' : ''}${ghost ? 'tabindex="-1"' : ''}`)}
<button class="menu-btn"${ghost ? ' tabindex="-1"' : ' id="menuOpen" aria-expanded="false" aria-controls="menu"'} type="button"><span class="menu-btn-t">Menu</span><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span></button>
</div>`;

function header(path) {
  return `<header class="hd" id="siteHeader">
<div class="wrap hd-in">
<a class="hd-logo" href="${href(S)}" aria-label="Glam By Amairanymua: ${SITE.name}, home">${lockup()}</a>
<nav class="hd-nav" aria-label="Primary">${CNAV.filter((n) => !n.cta).map((n) => `<a href="${href(S, n.path)}"${cur(path, n.path)}>${n.label}</a>`).join('')}</nav>
${hdTools(path)}
</div>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" inert>
<div class="wrap menu-top"><a class="hd-logo" href="${href(S)}" aria-label="${SITE.name}, home">${lockup()}</a><button class="menu-x" id="menuClose" type="button">Close <i aria-hidden="true"></i></button></div>
<div class="wrap menu-body">
<nav aria-label="Main menu"><ol class="menu-list">
<li><a href="${href(S)}"${path === '' ? ' aria-current="page"' : ''}><span class="mn">01</span><span class="ml">Home</span><span class="mo">Start here</span></a></li>
${CNAV.map((n, i) => `<li><a href="${href(S, n.path)}"${cur(path, n.path)}><span class="mn">${String(i + 2).padStart(2, '0')}</span><span class="ml">${n.menu}</span><span class="mo">${n.note}</span></a></li>`).join('\n')}
</ol></nav>
<div class="menu-side">
${bookingChip()}
${actions({ tone: 'dark' })}
<div class="menu-links">
<p class="menu-h">Follow</p>
<a href="${L.ig}" rel="external">Instagram ${SITE.handle}</a><a href="${L.tiktok}" rel="external">TikTok ${SITE.handle}</a><a href="${L.google}" rel="external">Google reviews</a>
<p class="menu-h">${HER.links.reviewsName}</p>
<a href="${L.ww}" rel="external">WeddingWire &middot; 5.0</a><a href="${L.knot}" rel="external">The Knot &middot; 5.0</a>
</div>
</div>
</div>
<div class="wrap"><p class="menu-foot">${HER.badges.join(' &middot; ')} &middot; ${SITE.area}</p></div>
</div>`;
}

const bar = () => `<div class="bar" id="bookBar" role="region" aria-label="Book">${inquire(S, 'Inquire here', 'btn btn--pri')}${book('event', 'Book event', 'btn btn--out')}</div>`;

function footer() {
  return `<footer class="ft" data-nobar>
<div class="wrap">
<div class="ft-top">
<a class="ft-logo" href="${href(S)}" aria-label="Glam By Amairanymua: ${SITE.name}, home">${lockup()}</a>
<p class="ft-line">${SITE.role} &middot; ${SITE.areaLong}. Bridal hair &amp; makeup, soft glam to full glam, glam waves. ${HER.booking}.</p>
${actions({ tone: 'dark' })}
</div>
<div class="ft-grid">
<div><p class="ft-h">Explore</p><ul class="ft-l"><li><a href="${href(S)}">Home</a></li>${CNAV.map((n) => `<li><a href="${href(S, n.path)}">${n.menu}</a></li>`).join('')}</ul></div>
<div><p class="ft-h">Book</p><ul class="ft-l"><li>${inquire(S, 'Bridal inquiry')}</li><li>${book('event', 'Event hair &amp; makeup')}</li><li>${book('bridal-services', 'Bridal services')}</li><li>${book('schedule', 'All services')}</li><li><a href="${L.mail}">Email ${SITE.first}</a></li></ul></div>
<div><p class="ft-h">Follow</p><ul class="ft-l"><li><a href="${L.ig}" rel="external">Instagram</a></li><li><a href="${L.tiktok}" rel="external">TikTok</a></li><li><a href="${L.google}" rel="external">Google reviews</a></li></ul></div>
<div><p class="ft-h">${HER.links.reviewsName}</p><ul class="ft-l"><li><a href="${L.ww}" rel="external">WeddingWire &middot; 5.0 &middot; 31</a></li><li><a href="${L.knot}" rel="external">The Knot &middot; 5.0 &middot; 4</a></li><li><a href="${L.google}" rel="external">Google &middot; ${REVIEWS.google.score} &middot; ${REVIEWS.google.meta.replace(/\D+$/, '')}</a></li></ul></div>
</div>
<div class="ft-base">
<p class="ft-badges"><span>${SITE.name}</span>${HER.badges.map((b) => `<span>${b}</span>`).join('')}<span>${SITE.areaLong}</span></p>
<p class="ft-fine">${finePrint()}</p>
</div>
</div>
</footer>`;
}

/* ---------- the document ---------- */
const FONT_PRELOAD = ['libre-caslon-display-400', 'castoro-italic-400'].map((f) => `<link rel="preload" href="${A}/fonts/${f}.woff2" as="font" type="font/woff2" crossorigin>`).join('\n');
const asset = (x, ext) => (x.includes('/') ? x : `${C}/${x}.${ext}`);

/** A whole Cocoa document.
 *  path, title, description: as head() in site.mjs.  main: the page's content (inside <main id="main">).
 *  head: extra <head> markup (e.g. a preload for the page's lead image).
 *  css / js: extra files in assets/cocoa/ by name without extension (css: ['pages-work']), or full paths.
 *  bodyClass: extra classes on <body>.  bar: false leaves out the phone Inquire bar (the inquiry page).
 *  opening: markup placed first in <body>, before the skip link (home only: the opening's gate and panel).
 *  foot: extra markup after the scripts. */
export const page = ({ path = '', title, description, main, head = '', css = [], js = [], bodyClass = '', bar: withBar = true, opening = '', foot = '' }) => `<!doctype html>
<html lang="en">
<head>
${stdHead(S, { path, title, description })}
${FONT_PRELOAD}
<link rel="stylesheet" href="${C}/site.css">
${css.map((c) => `<link rel="stylesheet" href="${asset(c, 'css')}">`).join('\n')}
<script>(function(d){d.classList.add('js');setTimeout(function(){if(!window.__cocoa)d.classList.remove('js');},3500);})(document.documentElement);</script>
${head}
</head>
<body class="cocoa${withBar ? ' has-bar' : ''}${bodyClass ? ` ${bodyClass}` : ''}">
${opening}<a class="skip" href="#main">Skip to content</a>
${header(path)}
<main id="main">
${main}
</main>
${footer()}
${withBar ? bar() : ''}
${marker(S, path)}
<script src="${C}/site.js" defer></script>
${js.map((j) => `<script src="${asset(j, 'js')}" defer></script>`).join('\n')}
${foot}
</body>
</html>
`;
