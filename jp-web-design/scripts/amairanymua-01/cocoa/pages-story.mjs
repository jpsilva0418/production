/* /demo/amairanymua-01 — site "cocoa": the story pages, Bridal and About.

   BRIDAL  the title card (her booking line, the inquiry and her bridal services page), ALL SIX of
           her packages with their prices in two groups (hair & makeup packages; single services),
           the note that goes with any price and her booking page for current pricing; Destination
           bride? as its own band (her words beside a beach portrait); the FAQ in her words (native
           details); the morning of: How to prepare beside a picture and one of her real clips; the
           closing band.
   ABOUT   the title card: her chair portrait on an arch, "Hey Gorgeous! I'm Amairany." as the h1;
           her About as her own words (first person, quoted as hers); the numbers band (years,
           badges, her TikTok reach dated, the ratings dated); her three services as a numbered
           list, and the photography line in her words (her fiancé's separate service, never hers);
           In motion: real clips beside stills; Love Notes; the closing band.

   Facts only from site.mjs. Page CSS: assets/cocoa/pages-story.css. Built on the kit in shell.mjs
   (KIT.md). */
import { page, S, kicker, h, lede, sectionHead, actions, more, nextStep, bookingChip, rateChip, frame, filmFrame, pair, section, numbers, loveNotes, packageCard, packagesNote, faq, quote, closing, arrow } from './shell.mjs';
import { SITE, HER, SOCIAL, FILMS, L, href, inquire, book, pic, src, srcset } from '../site.mjs';

/* the preload for a page's lead picture: the same srcset and sizes the <img> uses */
const preload = (key, sizes) => `<link rel="preload" as="image" href="${src(key)}" imagesrcset="${srcset(key)}" imagesizes="${sizes}" fetchpriority="high">`;
const plain = (s) => s.replace(/&amp;/g, '&').replace(/<[^>]+>/g, '');

/* =====================================================================
   BRIDAL
   ===================================================================== */
const pk = (name) => HER.packages.find((p) => p.name === name);
const GROUPS = [
  {
    id: 'pkFull', n: '01', kick: 'Hair &amp; makeup packages', heading: 'For the bride, <em>and her party.</em>',
    line: 'A private preview session, then your wedding-day hair and makeup. Travel is included in all three.',
    items: ['The Luxe Bride', 'The Signature Soiree', 'The Luxe Gala'].map(pk),
  },
  {
    id: 'pkSingle', n: '02', kick: 'Single services', heading: 'Makeup only, <em>or hair only.</em>',
    line: 'Each begins with its own preview, then the wedding day.',
    items: ['The Radiant Bride', 'The Luxe Glam', 'Glam Hair'].map(pk),
  },
];
const COVER_B = 'bride-ruby';
const COVER_B_SIZES = '(max-width:899px) 86vw, 38vw';

const pkGroup = (g) => `<div class="bp-g" id="${g.id}">
<div class="bp-gh rv"><span class="bp-gn num" aria-hidden="true">${g.n}</span><div><p class="kick">${g.kick}</p>${h(3, g.heading, 'd-m')}<p class="bp-gl">${g.line}</p></div></div>
<div class="pks pks--3" data-stag=".08">${g.items.map((p) => `<div class="rv">${packageCard(p)}</div>`).join('')}</div>
</div>`;

const packages = () => section({ id: 'packages', tone: 'milk', cls: 'bp', labelledby: 'pkH' }, `
${sectionHead({ kick: 'Her bridal packages', heading: 'Six packages, <em>as listed.</em>', id: 'pkH', line: 'Three for hair and makeup, three single services. Choose one in the inquiry, or tell her what you have in mind.', side: `<p class="small bp-jump"><a href="#pkFull">Hair &amp; makeup</a><span aria-hidden="true"> &middot; </span><a href="#pkSingle">Single services</a></p>` })}
${GROUPS.map(pkGroup).join('')}
<div class="bp-foot rv">${packagesNote()}<p class="bp-live">What each package includes, and current pricing, is always live on ${book('schedule', 'her booking page')}.</p></div>
${nextStep({ line: 'Found your package? Name it in your inquiry.', links: [book('bridal-services', `Explore Bridal Services ${arrow}`, 'lnk')] })}`);

const destination = () => section({ id: 'destination', tone: 'oat', cls: 'dest', labelledby: 'destH', wrap: false }, `
<div class="dest-in">
${frame('golden-hour', { shape: '', cls: 'dest-fig', sizes: '(max-width:899px) 100vw, 50vw', cap: 'Wedding day &middot; Golden hour' })}
<div class="dest-txt">
${kicker('Travel', 'rv')}
${h(2, 'Destination <em>bride?</em>', 'd-xl rv', 'id="destH"')}
<div class="rv" style="--d:.08s">${quote(HER.destination.body, `${SITE.first}, in her words`, 'dest-q')}</div>
<p class="dest-faq rv">${HER.faq[0][0]} <span>&ldquo;${HER.faq[0][1]}&rdquo;</span></p>
<div class="rv">${actions({ inq: 'Ask about your destination', event: 'Book event glam' })}</div>
${nextStep({ links: [[href(S, 'journal/destination-bride'), 'Read: Destination bride?']], inq: false })}
</div>
</div>`);

const questions = () => section({ id: 'faq', tone: 'cream', cls: 'bq', labelledby: 'faqH' }, `
<div class="bq-g">
${sectionHead({ kick: 'Good to know, in her words', heading: 'Before you <em>inquire.</em>', id: 'faqH', line: 'Travel, holding a date, extensions, minimums, trials and photography, answered by Amairany.' })}
<div class="bq-l rv">${faq(HER.faq)}${nextStep({ links: [book('bridal-services', `Explore Bridal Services ${arrow}`, 'lnk')] })}</div>
</div>`);

const morning = () => section({ id: 'prepare', tone: 'milk', cls: 'bm', labelledby: 'prepH' }, `
<div class="bm-g">
<div class="bm-txt">
${sectionHead({ kick: 'Before your appointment', heading: 'How to <em>prepare.</em>', id: 'prepH', line: 'Her two asks, in her words.' })}
<ol class="steps" data-stag=".1">${HER.prepare.map((p, i) => `<li class="rv"><span class="steps-n num" aria-hidden="true">0${i + 1}</span><p>${p}</p></li>`).join('')}</ol>
${nextStep({ links: [[href(S, 'journal/how-to-prepare'), 'Read: How to prepare for your glam']] })}
</div>
<div class="bm-pic">
${pair({ image: 'bride-gold-waves', film: 'f4', cap: 'Bridal &middot; Gold shimmer', filmCap: `Glam waves &middot; ${FILMS.f4.title}` })}
</div>
</div>`);

export const bridal = () => page({
  path: 'bridal',
  title: 'Bridal Packages & Prices',
  description: `${SITE.name}’s six bridal hair and makeup packages with their prices, from The Radiant Bride at $750 to The Luxe Gala at $3,300, with travel, trials and how to prepare answered in her words.`,
  css: ['pages-story'],
  head: preload(COVER_B, COVER_B_SIZES),
  main: `<section class="cover cover--m" aria-labelledby="bridalH">
<div class="wrap cover-in"><div class="cover-txt">
${bookingChip()}
${kicker('The Bridal Experience')}
${h(1, 'Six packages for your <em>wedding day.</em>', 'd-xl', 'id="bridalH"')}
${lede('From makeup only to hair and makeup for you and five VIP guests, and every one begins with a preview session.')}
<div class="acts">${inquire(S, `Start your bridal inquiry ${arrow}`, 'btn btn--pri')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--out')}</div>
<div class="cv-after">${rateChip('ww')}<a class="lnk" href="#packages">See the six packages ${arrow}</a></div>
</div>${frame(COVER_B, { shape: 'port', eager: true, sizes: COVER_B_SIZES, rv: '', cls: 'cover-m', cap: 'Bridal &middot; Full glam' })}</div>
</section>
${packages()}
${destination()}
${questions()}
${morning()}
${closing()}`,
});

/* =====================================================================
   ABOUT
   ===================================================================== */
const CHAIR_SIZES = '(max-width:899px) 84vw, 520px';
const SERVICE = {
  Bridal: { line: 'Hair, makeup or both for the bride and the people getting ready with her, each package beginning with a preview session.', act: `${inquire(S, `Start your bridal inquiry ${arrow}`, 'lnk')}${more(href(S, 'bridal'), 'See the six packages')}` },
  Engagement: { line: 'Soft glam to full glam on real-life-filter skin, for the photographs you will keep.', act: book('schedule', `See all services ${arrow}`, 'lnk') },
  'Event glam': { line: 'Soft glam to full glam and glam waves for the celebration, the night out or the shoot, in studio or on location.', act: book('event', `Book event glam ${arrow}`, 'lnk') },
};
const PHOTO_FAQ = HER.faq.find(([q]) => /photography/i.test(q));

const aboutCover = () => `<section class="cover ac" aria-labelledby="aboutH1">
<div class="wrap cover-in ac-in">
<div class="cover-txt">
${bookingChip()}
${kicker(`Meet ${SITE.first}`)}
${h(1, HER.hello.replace('Amairany.', '<em>Amairany.</em>'), 'd-xl', 'id="aboutH1"')}
${lede(`${SITE.name}: luxury bridal hair &amp; makeup, soft glam to full glam, across ${SITE.areaLong} and wherever her brides travel.`)}
${actions({ inq: 'Start your bridal inquiry' })}
<p class="ac-badges">${HER.badges.map((b) => `<span>${b}</span>`).join('')}<span>${SITE.handle}</span></p>
</div>
<figure class="ac-fig"><span class="ac-arch" aria-hidden="true"></span>${pic('artist-chair-cut', { sizes: CHAIR_SIZES, eager: true })}<figcaption class="cap">${SITE.name} &middot; ${SITE.role}</figcaption></figure>
</div>
</section>`;

const words = () => section({ id: 'words', tone: 'milk', cls: 'aw', labelledby: 'wordsH' }, `
<div class="aw-g">
<div class="aw-h">
${kicker('In her words', 'rv')}
${h(2, 'Your ultimate <em>hype woman.</em>', 'd-l rv', 'id="wordsH"')}
<p class="small aw-note rv">Her About, quoted as she wrote it.</p>
</div>
<figure class="aw-q">
<blockquote class="rv" style="--d:.06s">${HER.about.map((p) => `<p>${p}</p>`).join('')}</blockquote>
<figcaption class="rv">${SITE.name} &middot; ${SITE.handle}</figcaption>
</figure>
</div>
${nextStep({ line: 'Let’s create magic together.', links: [[href(S, 'bridal'), 'See her bridal packages']] })}`);

const services = () => section({ id: 'services', tone: 'cream', cls: 'as', labelledby: 'svcH' }, `
${sectionHead({ kick: 'Services', heading: 'Three things <em>she does.</em>', id: 'svcH', line: 'Hair, makeup or both, for the wedding day and every occasion worth the glam.' })}
<ol class="as-l" data-stag=".08">${HER.services.map((s, i) => `<li class="as-i rv"><span class="as-n num" aria-hidden="true">0${i + 1}</span>${h(3, s, 'd-m as-t')}<p>${SERVICE[s]?.line ?? ''}</p><div class="as-a">${SERVICE[s]?.act ?? ''}</div></li>`).join('')}</ol>
${PHOTO_FAQ ? `<aside class="as-ph rv" aria-labelledby="photoH"><div><p class="kick">A note on photography</p><h3 class="d-s" id="photoH">Not one of her services.</h3></div>${quote(PHOTO_FAQ[1], `${SITE.first}, in her words`, 'as-q')}</aside>` : ''}
${nextStep()}`);

/* real clips beside stills: two of her photographs, two of her clips */
const motion = () => section({ id: 'motion', tone: 'oat', cls: 'am', labelledby: 'motH' }, `
${sectionHead({ kick: 'In motion', heading: 'Real skin, <em>in motion.</em>', id: 'motH', line: `Her photographs beside her own clips, from the TikTok page ${SOCIAL.tiktok.followers} people follow. Silent here; the sound is on TikTok.`, side: `<p class="small am-asof">TikTok as of ${SOCIAL.asOf}</p>${more(L.tiktok, 'Watch on TikTok')}` })}
<div class="am-g">
${frame('bride-pearls', { shape: 'tall', sizes: '(max-width:759px) 46vw, 290px', cap: 'Bridal &middot; Soft glam' })}
${filmFrame('f5', { shape: 'reel', cap: `${FILMS.f5.title} &middot; ${FILMS.f5.label}`, cls: 'am-lo' }).replace('rv-im"', 'rv-im" style="--d:.1s"')}
${frame('reel-bride-gown', { shape: 'tall', sizes: '(max-width:759px) 46vw, 290px', cap: 'Bridal &middot; Glam waves', cls: 'am-lo2' }).replace('rv-im"', 'rv-im" style="--d:.16s"')}
${filmFrame('f7', { shape: 'reel', cap: `${FILMS.f7.title} &middot; ${FILMS.f7.label}`, cls: 'am-hi' }).replace('rv-im"', 'rv-im" style="--d:.22s"')}
</div>
${nextStep({ links: [[href(S, 'portfolio'), 'See the portfolio'], [L.ig, 'Follow on Instagram']] })}`);

const notes = () => section({ id: 'love-notes', tone: 'milk', cls: 'an', labelledby: 'notesH' }, `
${sectionHead({ kick: HER.links.reviewsLine, heading: 'Love <em>Notes.</em>', id: 'notesH', center: true, line: 'Five stars everywhere her clients have written. Every review is one tap away, in full, where it was written.' })}
${loveNotes()}
${nextStep({ center: true, links: [[L.google, 'Worked with her? Leave a review']] })}`);

export const about = () => page({
  path: 'about',
  title: 'About Amairany',
  description: `Meet ${SITE.name}, a licensed and insured luxury bridal hair and makeup artist in ${SITE.areaLong}, with ${plain(HER.years[0][1])} in makeup and ${plain(HER.years[1][1])} in hair.`,
  css: ['pages-story'],
  head: preload('artist-chair-cut', CHAIR_SIZES),
  main: `${aboutCover()}
${words()}
${numbers({ id: 'numbers' })}
${services()}
${motion()}
${notes()}
${closing()}`,
});
