/* /demo/amairanymua-01 — site "atelier": the STORY pages, Bridal and About.

   Built from the page kit in shell.mjs (KIT.md) and the facts in site.mjs only. Her own words
   (HER.about, HER.destination, HER.faq, HER.prepare) are quoted as hers, first person, and marked as
   quotations; everything else about her stays third person. Page CSS: assets/atelier/pages-story.css.
   The footer (shell) closes every page with both ways to book, so no page adds its own closing band.

   BRIDAL  ivory  title card: h1, Bridal inquiry + Explore Bridal Services, the booking line, an index
           linen  the six packages as a price list, two groups (hair & makeup / single services),
                  the note, and current pricing on her booking page
           espresso  Destination bride? (the page's one dark band), an arch either side
           ivory  her FAQ, the heading held beside the questions
           linen  How to prepare, her two asks
           ivory  picture beside film (a real clip), both ways to book
   ABOUT   ivory  title card: "Hey Gorgeous! I'm Amairany." beside her director's-chair portrait,
                  set in front of an arched alcove
           linen  her About in her own words, beside her brushes; her years and badges
           ivory  her services (Bridal, Engagement, Event glam) and, set apart, her own answer
                  about photography (her fiancé's separate service, never one of hers)
           espresso  In motion: her two most-viewed clips beside stills of the same looks, her
                  TikTok reach, dated
           ivory  Love Notes: ratings and dates, one tap each */
import { page, S, cover, section, sectionHead, kicker, h, lede, sig, spec, facts, actions, more, next, arch, archFilm, pair, packageCard, faq, quote, loveNotes, bookingLine, arrow } from './shell.mjs';
import { SITE, HER, L, SOCIAL, FILMS, href, inquire, book, pic, src, srcset } from '../site.mjs';

const pad2 = (n) => String(n).padStart(2, '0');
const preload = (k, sizes) => `<link rel="preload" as="image" href="${src(k)}" imagesrcset="${srcset(k)}" imagesizes="${sizes}" fetchpriority="high">`;
const btn = (label) => `<span>${label}</span>`;

/* ============================== BRIDAL ============================== */

const HM = HER.packages.slice(0, 3);     /* The Luxe Bride, The Signature Soiree (most popular), The Luxe Gala */
const SINGLE = HER.packages.slice(3);    /* The Radiant Bride, The Luxe Glam, Glam Hair */
const priceN = (p) => Number(p.price.replace(/,/g, ''));
const LOW = Math.min(...HER.packages.map(priceN)).toLocaleString('en-US');
const HIGH = Math.max(...HER.packages.map(priceN)).toLocaleString('en-US');

const COVER_B = 'bride-gold-waves';
const COVER_B_SIZES = '(max-width:899px) 62vw, 380px';
const INDEX = [['packages', 'Packages'], ['destination', 'Destination'], ['faq', 'Questions'], ['prepare', 'How to prepare']];

const bridalCover = () => cover({
  kick: 'Bridal hair &amp; makeup',
  heading: ['The Bridal', 'Experience'],
  sub: 'Six packages, hair and makeup or a single service, for you and the people getting ready with you.',
  image: COVER_B,
  actions: `<div class="acts">${inquire(S, btn('Bridal inquiry'), 'btn btn--pri')}${book('bridal-services', btn('Explore Bridal Services'), 'btn btn--sec')}</div>`,
  after: `<nav class="bs-idx rv" style="--d:.28s" aria-label="On this page"><ol>${INDEX.map(([id, t], i) => `<li><a href="#${id}"><span aria-hidden="true">${pad2(i + 1)}</span>${t}</a></li>`).join('')}</ol></nav>`,
});

/* one group of the price list: its heading and line, then the cards */
const group = ({ id, kick, heading, line, list }) => `<div class="bs-grp" id="${id}">
<div class="bs-gh">
<div>${kicker(kick, 'rv')}${h(2, heading, 'd-l rv-mask', `id="${id}H"`)}</div>
${lede(line, 'rv')}
</div>
<div class="pk-g" data-stag=".1">${list.map((p) => `<div class="rv">${packageCard(p)}</div>`).join('')}</div>
</div>`;

const bridalPackages = () => section({ id: 'packages', tone: 'linen', cls: 'bs-pk', label: 'Bridal packages and prices' }, `
${group({ id: 'hairMakeup', kick: 'Hair &amp; makeup', heading: ['Bridal', 'packages'], line: 'Hair and makeup for the bride and her VIP guests, each beginning with her two-part bridal artistry: a private preview session, then the wedding day.', list: HM })}
${group({ id: 'single', kick: 'Makeup or hair', heading: ['Single', 'services'], line: 'Makeup only or hair only, for the bride alone or for the bride and four more.', list: SINGLE })}
<div class="bs-note rv">
<p>${HER.packagesNote}</p>
<p>What each one includes, and current pricing, is always live on ${book('schedule', 'her booking page')}.</p>
</div>
${next(inquire(S, btn('Begin your inquiry'), 'btn btn--pri'), book('bridal-services', btn('Explore Bridal Services'), 'btn btn--sec'))}`);

const bridalDestination = () => section({ id: 'destination', tone: 'espresso', cls: 'bs-dest', labelledby: 'destH' }, `
<div class="bs-dest-g">
${arch('golden-hour', { ar: '3/5', sizes: '(max-width:899px) 40vw, 240px', cls: 'bs-dest-a', cap: 'Wedding day &middot; Golden hour', alt: '' })}
<div class="bs-dest-t">
${kicker('Worldwide', 'kick--c rv')}
${h(2, HER.destination.heading, 'd-l rv-mask', 'id="destH"')}
<blockquote class="bs-dest-q rv" style="--d:.1s"><p>&ldquo;${HER.destination.body}&rdquo;</p><cite>${SITE.first}, in her words</cite></blockquote>
<div class="next rv"><div class="acts acts--dark acts--c">${inquire(S, btn('Start your inquiry'), 'btn btn--pri')}<a class="btn btn--sec" href="${L.mail}">${btn(`Email ${SITE.first}`)}</a></div></div>
<p class="bs-dest-more rv">${more(href(S, 'journal/destination-bride'), 'Read the journal article')}</p>
</div>
${arch('wedding-night', { ar: '3/5', sizes: '(max-width:899px) 40vw, 240px', cls: 'bs-dest-b', cap: 'Wedding day &middot; After dark', alt: '' })}
</div>`);

const bridalFaq = () => section({ id: 'faq', tone: 'ivory', cls: 'bs-faq', labelledby: 'faqH' }, `
<div class="split split--57 split--top">
<div class="bs-faq-hd">
${kicker('Good to know', 'rv')}
${h(2, ['Before you', 'inquire'], 'd-l rv-mask', 'id="faqH"')}
${lede('Travel, dates, extensions, minimums, trials and photography: her answers, in her own words.', 'rv')}
<p class="bs-faq-ask rv">Something else? ${inquire(S, 'Ask in your inquiry')} or <a href="${L.mail}">email ${SITE.first}</a>.</p>
</div>
<div class="rv" style="--d:.08s">${faq(HER.faq.map(([q, a]) => [q, `&ldquo;${a}&rdquo;`]), 'bs-faq-l')}</div>
</div>
${next(inquire(S, btn('Begin your inquiry'), 'btn btn--pri'), book('bridal-services', 'Explore Bridal Services', 'more'))}`);

const bridalPrepare = () => section({ id: 'prepare', tone: 'linen', cls: 'bs-prep', labelledby: 'prepH' }, `
<div class="split split--57">
<div>
${kicker('Before your appointment', 'rv')}
${h(2, ['How to', 'prepare'], 'd-l rv-mask', 'id="prepH"')}
${lede('Two things she asks of every bride, in her words.', 'rv')}
</div>
<ol class="bs-prep-l" data-stag=".12">${HER.prepare.map((t, i) => `<li class="rv"><span class="bs-prep-n" aria-hidden="true">${pad2(i + 1)}</span><p>&ldquo;${t}&rdquo;</p></li>`).join('')}</ol>
</div>
${next(more(href(S, 'journal/how-to-prepare'), 'Read the journal article'), inquire(S, btn('Bridal inquiry'), 'btn btn--pri'))}`);

/* picture beside film: a robe-and-pearls morning beside her own clip of a bride seeing her finished
   glam (f6: no burned-in caption; f4 carries one at the top of the frame) */
const bridalPair = () => section({ id: 'morning', tone: 'ivory', cls: 'bs-pair', labelledby: 'pairH' }, `
<div class="split split--75">
<div class="bs-pair-m">${pair({ image: 'bride-pearls', film: 'f6', cap: 'Bridal &middot; Soft glam', filmCap: `Film &middot; ${FILMS.f6.title}` })}</div>
<div class="bs-pair-t">
${kicker('The morning of', 'rv')}
${h(2, ['The', 'reveal'], 'd-l rv-mask', 'id="pairH"')}
${lede('A robe-and-pearls morning, and one of her own clips: a bride reacting to her finished glam.', 'rv')}
<div class="rv mt-s">${actions({ inq: 'Begin your inquiry' })}</div>
${bookingLine('rv bs-pair-book')}
${more(href(S, 'portfolio'), 'See the portfolio', 'rv')}
</div>
</div>`);

export const bridal = () => page({
  path: 'bridal',
  title: 'Bridal Packages & Prices',
  description: `${SITE.name}’s six bridal hair and makeup packages, from $${LOW} to $${HIGH} as listed on her booking page, with her own answers on travel, trials and how to prepare.`,
  head: preload(COVER_B, COVER_B_SIZES),
  css: ['pages-story'],
  bodyClass: 'story bridal',
  main: bridalCover() + bridalPackages() + bridalDestination() + bridalFaq() + bridalPrepare() + bridalPair(),
});

/* ============================== ABOUT ============================== */

const [HELLO_A, HELLO_B] = HER.hello.split(/(?<=!)\s+/);
const PHOTO_Q = HER.faq.find(([q]) => /photograph/i.test(q));
const POR = 'artist-chair-cut';
const POR_SIZES = '(max-width:899px) 86vw, 480px';

/* the title card, in the kit's .cover classes, with her portrait in front of an arched alcove: the
   cut-out sits over a linen arch and breaks out of it, so no arch ever crops her */
const aboutCover = () => `<section class="cover sec--ivory cover--m ab-cov" aria-labelledby="abH">
<div class="wrap cover-in"><div class="cover-t">
${kicker(`About ${SITE.first}`, 'rv')}
${h(1, [HELLO_A, HELLO_B], 'd-xl rv-mask', 'id="abH"')}
<p class="lede rv" style="--d:.12s">${SITE.role}, ${SITE.areaLong}.</p>
<div class="rv" style="--d:.2s">${actions()}</div>
${bookingLine('rv')}
</div>
<figure class="ab-por cover-m rv" style="--d:.1s"><span class="ab-por-a" aria-hidden="true"></span>${pic(POR, { sizes: POR_SIZES, eager: true })}<figcaption class="cap">${SITE.name} &middot; ${SITE.handle}</figcaption></figure>
</div>
</section>`;

const aboutWords = () => section({ id: 'words', tone: 'linen', cls: 'ab-words', labelledby: 'wordsH' }, `
<div class="split split--57">
${arch('artist-brushes', { ar: '3/4', line: true, sizes: '(max-width:899px) 78vw, 440px', cls: 'ab-words-ph', cap: `${SITE.first} &middot; Behind the brushes`, alt: `${SITE.name} holding a fan of makeup brushes toward the camera.` })}
<div class="ab-words-t">
${kicker('In her own words', 'rv')}
<h2 class="vh" id="wordsH">${SITE.first}, in her own words</h2>
<blockquote class="ab-q">
<p class="ab-q-lead rv">&ldquo;${HER.about[0]}</p>
${HER.about.slice(1).map((p, i, a) => `<p class="rv" style="--d:${((i + 1) * 0.08).toFixed(2)}s">${p}${i === a.length - 1 ? '&rdquo;' : ''}</p>`).join('')}
</blockquote>
${sig(SITE.first, 'rv ab-sig')}
${facts(HER.years, 'rv ab-facts')}
${spec(HER.badges, 'rv ab-spec')}
</div>
</div>
${next(inquire(S, btn('Begin your inquiry'), 'btn btn--pri'), more(href(S, 'bridal'), 'Packages &amp; prices'))}`);

/* her own services; photography is NOT one of them (her fiancé's), so it appears only as her own
   FAQ answer, set apart from the list */
const SERVICE_LINK = {
  Bridal: more(href(S, 'bridal'), 'Packages &amp; prices'),
  Engagement: more(L.mail, `Email ${SITE.first}`),
  'Event glam': book('event', `Book event glam ${arrow}`, 'more'),
};
const aboutServices = () => section({ id: 'services', tone: 'ivory', cls: 'ab-sv', labelledby: 'svH' }, `
${sectionHead({ kick: 'What she offers', heading: ['Her', 'services'], id: 'svH', line: 'Hair, makeup or both.' })}
<ol class="ab-sv-l" data-stag=".1">${HER.services.map((s, i) => `<li class="ab-sv-i rv"><span class="ab-sv-n" aria-hidden="true">${pad2(i + 1)}</span><h3 class="d-m ab-sv-t">${s}</h3><div class="ab-sv-go">${SERVICE_LINK[s] ?? ''}</div></li>`).join('')}</ol>
${PHOTO_Q ? `<aside class="ab-ph rv" aria-labelledby="phQ"><p class="kick kick--c">A separate service</p><h3 class="d-s" id="phQ">${PHOTO_Q[0]}</h3><blockquote><p>&ldquo;${PHOTO_Q[1]}&rdquo;</p><cite>${SITE.first}, in her words</cite></blockquote></aside>` : ''}
${next(inquire(S, btn('Bridal inquiry'), 'btn btn--pri'), book('event', btn('Book event glam'), 'btn btn--sec'))}`);

/* In motion: her two most-viewed clips (SOCIAL.pinned) beside a still of the same look, so each pair
   reads photograph -> film. Collaboration credits: the stills print theirs in the caption (arch()),
   the clips inside the frame (film()). */
const pin = (id) => SOCIAL.pinned.find((p) => p.film === id)?.views;
const MOTION = [
  { photo: 'reel-copper', cap: 'Full glam &middot; Copper' },
  { film: 'f2', cap: `Film &middot; ${FILMS.f2.title} &middot; ${pin('f2')} views` },
  { film: 'f13', cap: `Film &middot; ${FILMS.f13.title} &middot; ${pin('f13')} views` },
  { photo: 'reel-red-waves', cap: 'Full glam &middot; Red waves' },
];
const MO_AR = ['3/5', '5/8', '3/5', '2/3'];
/* both clips open on the "before" (about 4 s) and cut to the finished look: start just before the cut
   and loop back to it, so each still sits beside the same look in motion (site.js reads data-start) */
const MO_START = 3;
const aboutMotion = () => section({ id: 'motion', tone: 'espresso', cls: 'ab-mo', labelledby: 'moH' }, `
<div class="ab-mo-hd">
<div>${kicker('Photographs and film', 'rv')}${h(2, ['In', 'motion'], 'd-l rv-mask', 'id="moH"')}</div>
<div class="ab-mo-side">
${lede('Her two most-viewed TikTok posts, each beside a photograph of the same look.', 'rv')}
<dl class="ab-reach rv" style="--d:.1s"><div><dd>${SOCIAL.tiktok.followers}</dd><dt>TikTok followers</dt></div><div><dd>${SOCIAL.tiktok.likes}</dd><dt>Likes</dt></div></dl>
<p class="ab-asof rv">On TikTok, as of ${SOCIAL.asOf}</p>
</div>
</div>
<div class="ab-mo-g" data-stag=".1">${MOTION.map((m, i) => (m.film
    ? archFilm(m.film, { ar: MO_AR[i], cap: m.cap, cls: `ab-mo-i ab-mo-${i + 1}` }).replace('<video data-film', `<video data-film data-start="${MO_START}"`)
    : arch(m.photo, { ar: MO_AR[i], cap: m.cap, sizes: '(max-width:899px) 44vw, 280px', cls: `ab-mo-i ab-mo-${i + 1}` }))).join('')}</div>
<div class="next rv">${more(L.tiktok, 'Follow on TikTok')}${more(L.ig, 'Follow on Instagram')}${more(href(S, 'portfolio'), 'Open the portfolio')}</div>`);

const aboutLove = () => section({ id: 'love', tone: 'ivory', cls: 'ab-love', labelledby: 'loveH' }, `
<div class="rv-mask ab-love-q">${quote('<span class="hl"><span>Your ultimate</span></span> <span class="hl"><span>hype woman</span></span> <span class="hl"><span>on your big day.</span></span>', `${SITE.first}, in her own words`)}</div>
${sectionHead({ kick: HER.links.reviewsLine, heading: HER.links.reviewsName, id: 'loveH', line: 'Her reviews live where her clients wrote them. One tap opens each one in full.' })}
${loveNotes()}
${next(inquire(S, btn('Begin your inquiry'), 'btn btn--pri'), book('event', btn('Book event glam'), 'btn btn--sec'))}`);

export const about = () => page({
  path: 'about',
  title: 'About Amairany',
  description: `${SITE.name} is a licensed and insured luxury hair and makeup artist in Central Florida, with ${HER.years.map(([k, v]) => `${v} ${k.toLowerCase()}`).join(' and ')}.`,
  head: preload(POR, POR_SIZES),
  css: ['pages-story'],
  bodyClass: 'story about',
  main: aboutCover() + aboutWords() + aboutServices() + aboutMotion() + aboutLove(),
});

