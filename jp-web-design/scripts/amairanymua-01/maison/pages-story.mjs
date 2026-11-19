/* /demo/amairanymua-01 — site "maison": the STORY pages, Bridal and About.

   Built only from the page kit in shell.mjs (KIT.md) and the facts in site.mjs. Her own words
   (HER.about, HER.destination, HER.faq, HER.prepare) are quoted as hers, first person, and marked
   as quotations; everything else about her stays third person. Page CSS: assets/maison/pages-story.css.

   BRIDAL  blanc cover (booking line, inquiry + bridal services, an index of the page)
           -> noir: the three hair & makeup packages      -> silk: the three single services + the note
           -> noir: Destination bride? (the centred moment, the red script)
           -> blanc: the FAQ, her answers                  -> silk: How to prepare
           -> blanc: picture beside film                   -> rouge: the closing band
   ABOUT   blanc cover (her portrait, "Hey Gorgeous! I'm Amairany.")
           -> silk: her words at length, the spec line     -> noir: her services (+ her photography FAQ answer, set apart)
           -> blanc: In motion, film beside stills (the centred moment)
           -> silk: Love Notes                             -> rouge: the closing band */
import { page, S, cover, section, kicker, h, note, bookingLine, spec, more, frame, filmFrame, pair, packageCard, loveNotes, faq, closing, arrow } from './shell.mjs';
import { SITE, HER, L, href, inquire, book, src, srcset } from '../site.mjs';

const COVER_SIZES = '(max-width:899px) 92vw, 40vw';
const preload = (k) => `<link rel="preload" as="image" href="${src(k)}" imagesrcset="${srcset(k)}" imagesizes="${COVER_SIZES}" fetchpriority="high">`;
const plain = (s) => s.replace(/&amp;/g, '&');

/* ============================== BRIDAL ============================== */

const HM = HER.packages.slice(0, 3);   /* The Luxe Bride, The Signature Soiree, The Luxe Gala */
const SINGLE = HER.packages.slice(3);  /* The Radiant Bride, The Luxe Glam, Glam Hair */
const lowest = Math.min(...HER.packages.map((p) => Number(p.price.replace(/,/g, '')))).toLocaleString('en-US');
const highest = Math.max(...HER.packages.map((p) => Number(p.price.replace(/,/g, '')))).toLocaleString('en-US');

const INDEX = [['packages', 'Packages'], ['single', 'Single services'], ['destination', 'Destination'], ['faq', 'Questions'], ['prepare', 'How to prepare']];

const bridalCover = () => cover({
  kick: 'The Bridal Experience',
  heading: ['Your day,', 'your glam.'],
  sub: 'Six bridal packages, hair and makeup or a single service, for the bride and the people getting ready with her.',
  image: 'bride-gold-waves',
  actions: `<div class="acts">${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--pri')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--sec')}</div>`,
  after: `<div class="b-after rv" style="--d:.28s">${bookingLine()}<nav class="b-idx" aria-label="On this page"><ol>${INDEX.map(([id, t], i) => `<li><a href="#${id}"><span>${String(i + 1).padStart(2, '0')}</span>${t}</a></li>`).join('')}</ol></nav></div>`,
});

const grid = (list) => `<div class="pk-g" data-stag=".08">${list.map((p) => `<div class="rv">${packageCard(p)}</div>`).join('')}</div>`;

const bridalPackages = () => section({ id: 'packages', tone: 'noir', cls: 'b-pk', labelledby: 'pkH' }, `
<div class="sec-hd"><div>${kicker('Hair &amp; makeup packages', 'rv')}${h(2, ['The bridal', 'collections.'], 'd-l rv-mask', 'id="pkH"')}</div>
<p class="lede rv" style="--d:.1s">All three begin with her two-part bridal artistry: a private preview session, then the wedding-day application.</p></div>
${grid(HM)}`);

const bridalSingle = () => section({ id: 'single', tone: 'silk', cls: 'b-pk b-pk--lt', labelledby: 'sgH' }, `
<div class="sec-hd"><div>${kicker('Single services', 'rv')}${h(2, ['Makeup', 'or hair.'], 'd-l rv-mask', 'id="sgH"')}</div>
<p class="lede rv" style="--d:.1s">Makeup only or hair only, for the bride alone or for the bride and four more.</p></div>
${grid(SINGLE)}
<div class="b-pk-ft rv">
<div class="b-pk-note"><p>${HER.packagesNote}</p><p>What each one includes, and current pricing, is always live on ${book('schedule', 'her booking page')}.</p></div>
<div class="acts">${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--pri')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--sec')}</div>
</div>`);

const bridalDestination = () => section({ id: 'destination', tone: 'noir', cls: 'b-dest', labelledby: 'destH', wrap: false }, `
<div class="wrap b-dest-in">
<div class="b-dest-t">
${kicker('Travel', 'rv')}
${h(2, HER.destination.heading, 'd-xl rv-mask', 'id="destH"')}
<blockquote class="b-dest-q rv" style="--d:.1s"><p>&ldquo;${HER.destination.body}&rdquo;</p><cite>${SITE.first}, in her words</cite></blockquote>
${note('I’d love to have you in my chair', 'rv')}
<div class="acts rv" style="--d:.16s">${inquire(S, `Start a bridal inquiry ${arrow}`, 'btn btn--pri')}<a class="btn btn--sec" href="${L.mail}">Email ${SITE.first}</a></div>
</div>
${frame('golden-hour', { shape: 'tall', sizes: '(max-width:899px) 44vw, 22vw', cls: 'b-dest-a', cap: 'Wedding day &middot; Golden hour' })}
${frame('wedding-night', { shape: 'tall', sizes: '(max-width:899px) 44vw, 22vw', pos: '80% 50%', cls: 'b-dest-b', cap: 'Wedding day &middot; After dark' })}
</div>`);

const bridalFaq = () => section({ id: 'faq', tone: 'blanc', cls: 'b-faq', labelledby: 'faqH' }, `
<div class="b-faq-g">
<div class="b-faq-hd">${kicker('Good to know', 'rv')}${h(2, ['Before you', 'inquire.'], 'd-l rv-mask', 'id="faqH"')}<p class="lede mut rv" style="--d:.1s">Her answers to the questions brides ask most, in her own words.</p></div>
<div class="rv" style="--d:.08s">${faq(HER.faq, 'b-faq-l')}</div>
</div>`);

const bridalPrepare = () => section({ id: 'prepare', tone: 'silk', cls: 'b-prep', labelledby: 'prepH' }, `
<div class="sec-hd"><div>${kicker('Before your appointment', 'rv')}${h(2, ['How to', 'prepare.'], 'd-l rv-mask', 'id="prepH"')}</div>
<p class="lede rv" style="--d:.1s">Two things she asks of every client, in her words.</p></div>
<ol class="b-prep-l" data-stag=".1">${HER.prepare.map((t, i) => `<li class="rv"><span class="b-prep-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><p>&ldquo;${t}&rdquo;</p></li>`).join('')}</ol>
${more(href(S, 'journal/how-to-prepare'), 'Read: How to prepare for your glam', 'rv')}`);

const bridalPair = () => section({ id: 'morning', tone: 'blanc', cls: 'b-pair', labelledby: 'pairH' }, `
<div class="b-pair-g">
<div class="b-pair-t">${kicker('The morning of', 'rv')}${h(2, ['Getting', 'ready.'], 'd-l rv-mask', 'id="pairH"')}<p class="lede rv" style="--d:.1s">From the preview session to the touch-ups after the ceremony.</p>${more(href(S, 'portfolio'), 'See the portfolio', 'rv')}</div>
${pair({ image: 'bride-pearls', film: 'f3', cap: 'Bridal &middot; Soft glam', filmCap: 'Film &middot; Getting ready' })}
</div>`);

export const bridal = () => page({
  path: 'bridal',
  title: 'Bridal Packages & Prices',
  description: `${SITE.name}’s six bridal hair and makeup packages, from $${lowest} to $${highest} as listed on her booking page, with her answers on travel, trials and how to prepare.`,
  head: preload('bride-gold-waves'),
  css: ['pages-story'],
  bodyClass: 'bridal',
  main: bridalCover() + bridalPackages() + bridalSingle() + bridalDestination() + bridalFaq() + bridalPrepare() + bridalPair() + closing({}),
});

/* ============================== ABOUT ============================== */

const [helloA, helloB] = HER.hello.split(/(?<=!)\s+/);
const PHOTO_Q = HER.faq.find(([q]) => /photograph/i.test(q));

const aboutCover = () => cover({
  kick: 'About',
  heading: [helloA, helloB],
  sub: `${SITE.role}, ${SITE.areaLong}.`,
  image: 'artist-brushes',
  after: bookingLine('rv a-book'),
});

const aboutWords = () => section({ id: 'words', tone: 'silk', cls: 'a-words', labelledby: 'wordsH' }, `
<div class="a-words-hd">${kicker(`About ${SITE.first}`, 'rv')}${h(2, ['In her', 'own words.'], 'd-l rv-mask', 'id="wordsH"')}</div>
<blockquote class="a-q">
<p class="a-q-lead rv">&ldquo;${HER.about[0]}</p>
<div class="a-q-cols" data-stag=".1">${HER.about.slice(1).map((p, i, a) => `<p class="rv">${p}${i === a.length - 1 ? '&rdquo;' : ''}</p>`).join('')}</div>
</blockquote>
<div class="a-sign">${note('Let’s create magic together', 'rv')}<p class="cap rv">${SITE.name} &middot; ${SITE.handle}</p></div>
${spec([...HER.years.map(([k, v]) => `${v} ${k.toLowerCase()}`), ...HER.badges], 'rv')}`);

const SERVICE_ROWS = {
  Bridal: `<p>Six packages for the bride and the people getting ready with her, the preview session included.</p>${more(href(S, 'bridal'), 'Packages &amp; prices')}`,
  'Event glam': `<p>Soft glam to full glam, in studio or on location.</p>${book('event', `Book event glam ${arrow}`, 'more')}`,
};

/* Photography is her fiancé's separate service, not one of hers: it appears only as her own FAQ
   answer, set apart from the list of her services. */
const aboutServices = () => section({ id: 'services', tone: 'noir', cls: 'a-sv', labelledby: 'svH' }, `
<div class="sec-hd"><div>${kicker('What she offers', 'rv')}${h(2, ['Her', 'services.'], 'd-l rv-mask', 'id="svH"')}</div>
<p class="lede rv" style="--d:.1s">${HER.services.join(', ').replace(/, ([^,]+)$/, ' and $1')}.</p></div>
<ol class="a-sv-l" data-stag=".08">${HER.services.map((s, i) => `<li class="a-sv-i rv"><span class="a-sv-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3 class="d-m a-sv-t">${s}</h3><div class="a-sv-d">${SERVICE_ROWS[s] ?? ''}</div></li>`).join('')}</ol>
${PHOTO_Q ? `<aside class="a-ph rv" aria-label="Photography, a separate service"><p class="a-ph-q">${PHOTO_Q[0]}</p><blockquote class="a-ph-a"><p>&ldquo;${PHOTO_Q[1]}&rdquo;</p><cite>${SITE.first}</cite></blockquote></aside>` : ''}`);

const aboutMotion = () => section({ id: 'motion', tone: 'blanc', cls: 'a-mo', labelledby: 'moH' }, `
<div class="a-mo-hd">${kicker('Photographs and film', 'rv')}${h(2, 'In motion.', 'd-l rv-mask', 'id="moH"')}<p class="lede mut rv" style="--d:.1s">Stills beside film. Her reels play here as they arrive.</p></div>
<div class="a-mo-g">
${frame('artist-spotlight-crop', { shape: 'sq', sizes: '(max-width:899px) 46vw, 22vw', cls: 'a-mo-1', cap: `${SITE.first} &middot; In the studio` })}
${filmFrame('f3', { shape: 'vert', label: 'Getting ready', cls: 'a-mo-2', cap: 'Film &middot; Getting ready' })}
${filmFrame('f2', { shape: 'vert', label: 'Full glam', cls: 'a-mo-3', cap: 'Film &middot; Full glam' })}
${frame('waves-blonde', { shape: 'tall', sizes: '(max-width:899px) 46vw, 22vw', cls: 'a-mo-4', cap: 'Glam waves &middot; Smoky eye' })}
</div>
<div class="a-mo-ft rv">${more(href(S, 'portfolio'), 'Open the portfolio')}</div>`);

const aboutLove = () => section({ id: 'love', tone: 'silk', cls: 'a-love', labelledby: 'loveH' }, `
<div class="sec-hd"><div>${kicker(HER.links.reviewsLine, 'rv')}${h(2, ['Love', 'Notes.'], 'd-l rv-mask', 'id="loveH"')}</div>
<p class="lede rv" style="--d:.1s">Her reviews live where her clients wrote them. One tap opens each one in full.</p></div>
${loveNotes()}`);

export const about = () => page({
  path: 'about',
  title: 'About Amairany',
  description: `${SITE.name} is a luxury hair and makeup artist in ${plain(SITE.areaLong)}, with ${HER.years.map(([k, v]) => `${v} ${k.toLowerCase()}`).join(' and ')}, for bridal, engagement and event glam.`,
  head: preload('artist-brushes'),
  css: ['pages-story'],
  bodyClass: 'about',
  main: aboutCover() + aboutWords() + aboutServices() + aboutMotion() + aboutLove() + closing({}),
});
