/* /demo/amairanymua-01 — site "blush": the story pages, Bridal and About.

   BRIDAL  the title card (her own line, both ways in: the inquiry and her bridal services page) ·
           all six of her packages with prices as listed, in two groups, the note, and her booking
           page for current pricing · Destination bride? in a blush band, her own words, one script
           word laid over the caps · her FAQ as soft accordions, answers in her words · How to
           prepare beside a picture-and-film pair (her real clip) · the closing invitation.
   ABOUT   her director's-chair portrait on a blush disc with "Hey Gorgeous!" as the page's heading ·
           her About in her own words, set as a signed letter, with her years and badges · "In
           motion": her clips between her stills, and her TikTok reach (dated) · her services, and
           her own words about photography (her fiancé's separate service, never hers) · Love Notes,
           one tap each · the closing invitation.

   Built only from the kit in shell.mjs (KIT.md); the extra layout lives in pages-story.css.
   Every fact comes from site.mjs; nothing here adds a claim. */
import { page, S, kicker, h, mix, lede, overCaps, bookingLine, actions, more, next, frame, filmFrame, pair, section, secHead, cover, closing, packageCard, packagesNote, quote, faq, loveNotes, seal, script, arrow } from './shell.mjs';
import { SITE, HER, BRIDAL, SOCIAL, L, href, inquire, book, pic, src, srcset } from '../site.mjs';

/* the title card's portrait is the page's largest paint: preload it at the size the frame asks for */
const preload = (key, sizes) => `<link rel="preload" as="image" href="${src(key)}" imagesrcset="${srcset(key)}" imagesizes="${sizes}" fetchpriority="high">`;

/* =============================== BRIDAL =============================== */
const B_COVER = 'bride-ruby';
const B_COVER_SIZES = '(max-width:899px) 70vw, 34vw';

const bCover = () => cover({
  kick: BRIDAL.kick,
  heading: 'Secure your *wedding day glam.*',
  sub: BRIDAL.sub,
  actions: `<div class="acts">${inquire(S, `Begin your inquiry ${arrow}`, 'btn btn--pri')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--sec')}</div>`,
  image: B_COVER,
  after: `<p class="st-cover-alt rv"><span class="st-cover-alt-l">Not a bride?</span>${book('event', `Book event glam ${arrow}`, 'more')}</p>`,
});

/* packageCard() writes its name as an <h3>; inside a group (h3) the cards are one level down */
const card = (p) => `<div class="rv">${packageCard(p).replace(/<h3 class="pk-n">([\s\S]*?)<\/h3>/, '<h4 class="pk-n">$1</h4>')}</div>`;
const group = ({ id, title, line, items }) => `<div class="st-grp" aria-labelledby="${id}" role="group">
<div class="st-grp-hd rv"><h3 class="d-s" id="${id}">${mix(title)}</h3><p>${line}</p></div>
<div class="pks" data-stag=".1">${items.map(card).join('')}</div>
</div>`;

const bPackages = () => section({ id: 'packages', tone: 'cream', cls: 'st-pkg', labelledby: 'pkH' }, `
${secHead({ kick: 'Bridal packages', heading: 'Choose your *bridal package.*', id: 'pkH', line: 'All six of her packages, with prices as listed on her booking page. Every one includes a preview session before the day.' })}
${group({ id: 'pkHM', title: 'Hair &amp; makeup *packages*', line: 'The bride, or the bride and her people.', items: HER.packages.slice(0, 3) })}
${group({ id: 'pkSingle', title: 'Single *services*', line: 'Makeup only, or hair only.', items: HER.packages.slice(3) })}
${packagesNote('rv')}
<p class="st-live rv">For current pricing, see ${book('schedule', 'her booking page', 'lnk')}.</p>
${next({ line: 'Found the one?', go: [inquire(S, `Begin your inquiry ${arrow}`, 'more'), book('bridal-services', `Book bridal services ${arrow}`, 'more')] })}`);

const bDestination = () => section({ id: 'destination', tone: 'blush', cls: 'st-dest', labelledby: 'destH' }, `
<div class="st-dest-in">
<div class="st-dest-art">
${frame('wedding-night', { shape: 'circle', sizes: '(max-width:899px) 72vw, 420px', cap: 'Wedding day &middot; After dark', cls: 'st-dest-ph' })}
${seal({ cls: 'st-dest-seal seal--spin' })}
</div>
<div class="st-dest-txt">
${kicker('Weddings away from home', 'rv')}
<div class="rv">${overCaps({ caps: 'Destination', word: 'bride?', level: 2, label: HER.destination.heading, cls: 'st-oc' }).replace('<h2 ', '<h2 id="destH" ')}</div>
${quote(HER.destination.body, SITE.first, 'rv st-dest-q')}
${next({ cls: 'next--left rv', go: [inquire(S, `Ask about your date ${arrow}`, 'more'), more(href(S, 'journal/destination-bride'), 'Destination brides')] })}
</div>
</div>`);

const bFaq = () => section({ id: 'questions', tone: 'cream', cls: 'st-faq', labelledby: 'fqH' }, `
<div class="st-faq-in">
<div class="st-faq-hd">
${secHead({ kick: 'Good to know', heading: 'Before you *inquire.*', id: 'fqH', align: 'left', line: 'Travel, dates, extensions, minimums, trials and photography: her answers, in her own words.' })}
${next({ cls: 'next--left st-faq-next', line: 'Something else?', go: [inquire(S, `Ask her in your inquiry ${arrow}`, 'more')] })}
</div>
${faq(HER.faq, 'rv')}
</div>`);

const bPrepare = () => section({ id: 'prepare', tone: 'paper', cls: 'st-prep', labelledby: 'prepH' }, `
<div class="grid-2 st-prep-in">
${pair({ image: 'bride-pearls', film: 'f4', cap: 'Bridal &middot; Soft glam', filmCap: 'Robe to gown' })}
<div class="st-prep-txt">
${kicker('How to prepare', 'rv')}
${h(2, 'Before you sit in *her chair.*', 'd-l rv', 'id="prepH"')}
${lede(`Two notes from ${SITE.first} for the morning of your glam.`, 'rv')}
<ol class="st-steps" data-stag=".1">${HER.prepare.map((p, i) => `<li class="rv"><span class="st-n" aria-hidden="true">0${i + 1}</span><span>${p}</span></li>`).join('')}</ol>
${next({ cls: 'next--left rv', go: [more(href(S, 'journal/how-to-prepare'), 'Read the article'), inquire(S, `Begin your inquiry ${arrow}`, 'more')] })}
</div>
</div>`);

export const bridal = () => page({
  path: 'bridal',
  title: 'Bridal Packages, Prices & Questions',
  description: `${SITE.name}’s six bridal hair and makeup packages with prices as listed on her booking page, her answers to common questions, and how to prepare.`,
  head: preload(B_COVER, B_COVER_SIZES),
  css: ['pages-story'],
  bodyClass: 'st-page st-bridal',
  main: `${bCover()}
${bPackages()}
${bDestination()}
${bFaq()}
${bPrepare()}
${closing({ kick: 'Two ways to book', heading: 'Ready when *you are.*', line: 'Weddings start with an inquiry. Events book straight onto her calendar.', image: 'bride-gold-waves' })}`,
});

/* =============================== ABOUT =============================== */
const A_SIZES = '(max-width:899px) 84vw, 460px';

/* the title card: cover()'s structure and classes, with her cut-out portrait on a blush disc in
   place of the arch (a clipping frame would cut her head: the figure stands in front of the disc) */
const aCover = () => `<section class="cover cover--art st-acover">
<div class="wrap cover-in"><div class="cover-txt">
${kicker(`About ${SITE.first}`, 'rv')}
<h1 class="d-xl rv">${HER.hello.replace('Gorgeous! ', '<em>Gorgeous!</em><br>')}</h1>
${lede(`Luxury hair and makeup artist across ${SITE.areaLong}, and worldwide for destination brides.`, 'rv')}
<div class="rv">${actions()}</div>
${bookingLine('rv')}
</div><div class="cover-art"><figure class="st-chair"><i class="st-chair-disc" aria-hidden="true"></i>${pic('artist-chair-cut', { sizes: A_SIZES, eager: true, cls: 'st-chair-img' })}<figcaption class="cap">${SITE.name} &middot; ${SITE.handle}</figcaption></figure></div></div>
</section>`;

const aWords = () => section({ id: 'her-words', tone: 'paper', cls: 'st-words', labelledby: 'wdH' }, `
<div class="st-words-in">
<div class="st-words-hd">
${kicker('In her own words', 'rv')}
${h(2, 'Your ultimate *hype woman.*', 'd-l rv', 'id="wdH"')}
${frame('artist-spotlight-crop', { shape: 'circle', sizes: '(max-width:899px) 56vw, 300px', cls: 'st-words-ph' })}
</div>
<div class="st-words-body">
<blockquote class="st-letter rv">
${HER.about.map((p, i) => `<p${i === 0 ? ' class="st-letter-1"' : ''}>${p}</p>`).join('\n')}
<footer class="st-sign"><span class="st-sign-s" aria-hidden="true">${script(SITE.first)}</span><cite>${SITE.name} &middot; ${SITE.handle}</cite></footer>
</blockquote>
<div class="st-facts rv">
<dl class="st-years">${HER.years.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
<ul class="st-badges">${HER.badges.map((b) => `<li>${b}</li>`).join('')}</ul>
</div>
${next({ cls: 'next--left rv', go: [inquire(S, `Begin your inquiry ${arrow}`, 'more'), more(href(S, 'bridal'), 'Packages &amp; prices')] })}
</div>
</div>`);

/* "In motion": her clips between her stills, staggered like a contact strip */
const STRIP = [
  { photo: 'reel-bride-pearls-updo', cap: 'Bridal &middot; Sleek updo &amp; pearls' },
  { film: 'f8', cap: 'The bridesmaids' },
  { photo: 'reel-red-waves', cap: 'Transformation &middot; Red waves' },
  { film: 'f12', cap: 'Editorial colour' },
];
const aMotion = () => section({ id: 'in-motion', tone: 'cream', cls: 'st-motion', labelledby: 'mvH' }, `
${secHead({ kick: 'In motion', heading: 'Her work, *in motion.*', id: 'mvH', line: 'Silent clips from her own TikTok, between stills of her brides and her glam.' })}
<ul class="st-strip" data-stag=".1">${STRIP.map((it) => `<li class="rv">${it.film
    ? filmFrame(it.film, { shape: 'tall', label: 'Clip', cap: it.cap, rv: '' })
    : frame(it.photo, { shape: 'tall', sizes: '(max-width:899px) 44vw, 270px', cap: it.cap, rv: '' })}</li>`).join('')}</ul>
<div class="st-reach rv">
<p class="st-reach-k">On TikTok <span>as of ${SOCIAL.asOf}</span></p>
<dl><div><dt>followers</dt><dd>${SOCIAL.tiktok.followers}</dd></div><div><dt>likes</dt><dd>${SOCIAL.tiktok.likes}</dd></div></dl>
</div>
${next({ go: [more(L.tiktok, 'Watch more on TikTok'), more(L.ig, `Instagram ${SITE.handle}`), inquire(S, `Begin your inquiry ${arrow}`, 'more')] })}`);

const aServices = () => section({ id: 'services', tone: 'blush', cls: 'st-svc', labelledby: 'svH' }, `
<div class="st-svc-in">
<div class="st-svc-main">
${kicker('Her services', 'rv')}
${h(2, 'Bridal, engagement *and event glam.*', 'd-l rv', 'id="svH"')}
<ol class="st-svc-l" data-stag=".1">${HER.services.map((s, i) => `<li class="rv"><span class="st-n" aria-hidden="true">0${i + 1}</span><span class="st-svc-w">${s}</span></li>`).join('')}</ol>
${next({ cls: 'next--left rv', go: [inquire(S, `Bridal: begin your inquiry ${arrow}`, 'more'), book('event', `Events: book event glam ${arrow}`, 'more')] })}
</div>
<aside class="st-photo rv" aria-labelledby="phH">
<p class="kick">A note on photography</p>
<h3 class="d-s" id="phH">${mix('“Do you offer *photography?*”')}</h3>
<p class="st-photo-l">Not as part of her services. Asked on her booking page, she answers:</p>
${quote(HER.faq[5][1], SITE.first, 'st-photo-q')}
</aside>
</div>`);

const aNotes = () => section({ id: 'love-notes', tone: 'paper', cls: 'st-notes', labelledby: 'lnH' }, `
${secHead({ kick: HER.links.reviewsName, heading: 'Five-star brides, *read in full.*', id: 'lnH', line: 'Her reviews live where her clients wrote them, one tap away: WeddingWire, The Knot and Google.' })}
${loveNotes()}
${next({ line: 'Ready to be next?', go: [inquire(S, `Begin your inquiry ${arrow}`, 'more')] })}`);

export const about = () => page({
  path: 'about',
  title: `About ${SITE.first}`,
  description: `Meet ${SITE.name}, a licensed and insured hair and makeup artist in Orlando + Tampa with 13 years in makeup and 4 in hair.`,
  head: preload('artist-chair-cut', A_SIZES),
  css: ['pages-story'],
  bodyClass: 'st-page st-about',
  main: `${aCover()}
${aWords()}
${aMotion()}
${aServices()}
${aNotes()}
${closing({ image: 'waves-blonde' })}`,
});
