/* /demo/amairanymua-01 — site "maison": the home page.

   1. The opening (her signature writes itself in red; the caps set; the black parts like a
      curtain onto the hero) and the split hero: a photograph that changes on its own by a hard
      wipe, beside the film frame.
   2. Two ways to book (The Bride / The Event), then her About directly under.
   3. The Looks: a runway rail that advances on its own.
   4. The packages, on black.   5. Love Notes, on silk.   6. The Journal.   7. The red band. */
import { page, S, M, lockup, kicker, h, note, ruled, bookingLine, spec, actions, more, frame, filmFrame, section, rail, wipe, wipeControls, packageCard, loveNotes, closing, arrow } from './shell.mjs';
import { SITE, HER, PATHS, LOOKS, HERO, REVIEWS, href, inquire, book, src, srcset } from '../site.mjs';

/* the hero's looks: her portraits only (faces), in the montage order */
const HERO_LOOKS = [
  ['bride-crystal', 'Bridal · Glam waves'],
  ['glam-sculpt', 'Full glam · Sculpted bronze'],
  ['bride-gold-waves', 'Bridal · Gold shimmer'],
  ['bride-pearls', 'Bridal · Soft glam'],
  ['waves-blonde', 'Glam waves · Smoky eye'],
  ['bride-ruby', 'Bridal · Full glam'],
  ['glam-bronze', 'Full glam · Winged liner'],
];
const HERO_SIZES = '(max-width:599px) 60vw, (max-width:899px) 56vw, 34vw';

/* The opening gate: runs first in <body>, before anything paints, so the first frame is already
   the opening's black (no flash of the finished page). Plays once per browser session; ?intro=1
   always plays, ?intro=0 never; never under reduced motion or Save-Data (unless ?intro=1), never
   without the Web Animations API. Failsafe: if home.js has not taken over within 2.5 s, the class
   goes and the finished page shows. */
const GATE = `<script>(function(){var d=document.documentElement,k='am01-intro-maison';try{var q=location.search,on=/[?&]intro=1(&|$)/.test(q),off=/[?&]intro=0(&|$)/.test(q);if(off||!document.body.animate||!window.matchMedia||matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!on){if(sessionStorage.getItem(k))return;if(navigator.connection&&navigator.connection.saveData)return;}sessionStorage.setItem(k,'1');d.classList.add('intro');setTimeout(function(){if(!d.classList.contains('intro-run'))d.classList.remove('intro');},2500);}catch(e){d.classList.remove('intro');}})();</script>`;
const OVERLAY = `<div class="op" aria-hidden="true"><div class="op-l"><i class="op-e"></i></div><div class="op-r"><i class="op-e"></i></div><p class="op-b">${HER.badges.join(' &middot; ')}</p></div>`;

const hero = () => `<section class="hero" aria-labelledby="heroH">
<div class="hero-in">
<div class="hero-ph">${wipe({ id: 'heroWipe', keys: HERO_LOOKS.map((x) => x[0]), caps: HERO_LOOKS.map((x) => x[1]), sizes: HERO_SIZES, hold: 3000 })}</div>
<div class="hero-fm">${filmFrame('f1', { shape: '', label: 'Bridal', rv: '' })}</div>
<div class="hero-txt">
<p class="kick hero-k">${SITE.name} &middot; ${SITE.tagline} &middot; ${SITE.area}</p>
<div class="hero-mid">
<h1 class="d-hero" id="heroH"><span class="hl"><span>Soft-full glam.</span></span> <span class="hl hl--in"><span>Cake free.</span></span></h1>
<p class="hero-line">${HERO.line}</p>
${bookingLine('hero-book')}
${actions({ tone: 'light', cls: 'hero-acts' })}
</div>
${wipeControls({ id: 'heroWipe', n: HERO_LOOKS.length, cap: HERO_LOOKS[0][1] })}
</div>
</div>
</section>`;

/* 2 — the two ways to book, then About directly under (the founder's exact ask) */
const ways = () => {
  const [bride, event] = PATHS;
  return section({ id: 'book', tone: 'blanc', cls: 'ways', labelledby: 'waysH' }, `
<div class="ways-hd">${kicker('Two ways to book', 'rv')}${h(2, 'Begin here.', 'd-l rv-mask', 'id="waysH"')}</div>
<div class="ways-g">
<article class="way way--bride rv">
<p class="way-n" aria-hidden="true">I</p>
<p class="kick">${bride.kicker}</p>
<h3 class="d-m">The Bride</h3>
<p>${bride.body}</p>
${inquire(S, `Start your bridal inquiry ${arrow}`, 'btn btn--pri')}
<p class="way-note"><span class="way-nk">From her inquiry form</span>&ldquo;${HER.afterInquiry}&rdquo;</p>
</article>
<article class="way way--event rv" style="--d:.1s">
<p class="way-n" aria-hidden="true">II</p>
<p class="kick">${event.kicker}</p>
<h3 class="d-m">The Event</h3>
<p>${event.body}</p>
${book('event', `Book event glam ${arrow}`, 'btn btn--pri')}
<ul class="way-pts">${event.points.map((p) => `<li>${p}</li>`).join('')}</ul>
</article>
</div>`);
};

const about = () => section({ id: 'about', tone: 'silk', cls: 'hello', labelledby: 'helloH' }, `
<div class="hello-g">
${frame('artist-brushes', { shape: 'port', sizes: '(max-width:899px) 88vw, 38vw', cls: 'hello-ph', cap: `${SITE.name} &middot; ${SITE.handle}` })}
<div class="hello-t">
${kicker('About', 'rv')}
${h(2, HER.hello, 'd-l rv-mask', 'id="helloH"')}
<blockquote class="hello-q rv" style="--d:.08s">${HER.about.map((p) => `<p>${p}</p>`).join('')}</blockquote>
${note('Let’s create magic together', 'rv')}
${spec([...HER.years.map(([k, v]) => `${v} ${k.toLowerCase()}`), ...HER.badges], 'rv')}
${more(href(S, 'about'), `More about ${SITE.first}`, 'rv')}
</div>
</div>`);

/* 3 — The Looks: photographs with two film slots among them */
const LOOK_ITEMS = (() => {
  const items = LOOKS.map((l) => ({ photo: l.photo, cap: l.cap }));
  items.splice(2, 0, { film: 'f1', cap: 'Film · Bridal' });
  items.splice(7, 0, { film: 'f2', cap: 'Film · Full glam' });
  return items;
})();
const looks = () => section({ id: 'looks', tone: 'blanc', cls: 'looks', labelledby: 'looksH', wrap: false }, `
<div class="wrap looks-hd">
<div>${kicker('The runway', 'rv')}${h(2, ['The', 'Looks'], 'd-xxl rv-mask', 'id="looksH"')}</div>
<p class="lede rv" style="--d:.1s">Real brides and real glam, photographs and film. The runway moves on its own; swipe or use the arrows to take it at your pace.</p>
</div>
${rail({ id: 'looksRail', items: LOOK_ITEMS, label: 'The Looks', auto: 3400 })}
<div class="wrap looks-ft">${more(href(S, 'portfolio'), 'Open the portfolio', 'rv')}</div>`);

/* 4 — three packages on black */
const packages = () => {
  const three = HER.packages.slice(0, 3);
  return section({ id: 'packages', tone: 'noir', cls: 'pkgs', labelledby: 'pkgH' }, `
<div class="pkgs-hd">${kicker('The bridal collections', 'rv')}${h(2, ['Hair &amp; makeup,', 'for the whole morning.'], 'd-l rv-mask', 'id="pkgH"')}</div>
<div class="pk-g" data-stag=".08">${three.map((p) => `<div class="rv">${packageCard(p)}</div>`).join('')}</div>
<div class="pkgs-ft rv"><p class="pkgs-note">${HER.packagesNote}</p><div class="pkgs-links">${more(href(S, 'bridal'), 'All six packages')}${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--pri')}</div></div>`);
};

/* 5 — Love Notes */
const love = () => section({ id: 'love', tone: 'silk', cls: 'love', labelledby: 'loveH' }, `
<div class="love-hd"><div>${kicker(HER.links.reviewsName, 'rv')}${h(2, REVIEWS.heading, 'd-l rv-mask', 'id="loveH"')}</div><p class="lede rv" style="--d:.1s">Her reviews live where her clients wrote them. One tap opens each one in full.</p></div>
${loveNotes()}`);

/* 6 — Journal */
const POSTS = [
  { path: 'journal/how-to-prepare', title: 'How to prepare for your glam', dek: `&ldquo;${HER.prepare[0]}&rdquo; Her two asks before your appointment, and how the preview session fits in.`, img: 'bride-pearls', n: '01' },
  { path: 'journal/destination-bride', title: 'Destination bride?', dek: `&ldquo;I travel worldwide for my brides.&rdquo; What she says about travel, and how to ask for a custom quote.`, img: 'golden-hour', n: '02' },
];
const journal = () => section({ id: 'journal', tone: 'blanc', cls: 'jr', labelledby: 'jrH' }, `
<div class="jr-hd">${kicker('The journal', 'rv')}${h(2, 'Notes from her chair.', 'd-l rv-mask', 'id="jrH"')}${more(href(S, 'journal'), 'All articles', 'rv')}</div>
<div class="jr-g">${POSTS.map((p, i) => `<article class="jc rv" style="--d:${(i * 0.1).toFixed(1)}s"><a class="jc-a" href="${href(S, p.path)}">${frame(p.img, { shape: 'wide', sizes: '(max-width:899px) 92vw, 44vw', alt: '', rv: '' })}<p class="jc-k"><span>${p.n}</span>Sample article, to be written with ${SITE.first}</p><h3 class="d-m jc-t">${p.title}</h3><p class="jc-d">${p.dek}</p><span class="more">Read ${arrow}</span></a></article>`).join('')}</div>`);

export const home = () => page({
  path: '',
  title: 'Glam By Amairanymua · Bridal Hair & Makeup, Orlando + Tampa',
  description: `${SITE.name}, luxury bridal hair and makeup artist in Orlando and Tampa: soft-full glam, cake free. ${HER.booking.replace('&amp;', '&')}.`,
  head: `<link rel="preload" as="image" href="${src('bride-crystal')}" imagesrcset="${srcset('bride-crystal')}" imagesizes="${HERO_SIZES}" fetchpriority="high">`,
  css: ['home'],
  js: ['home'],
  bodyClass: 'home',
  opening: GATE + OVERLAY,
  main: hero() + ways() + about() + looks() + packages() + love() + journal() + closing({}),
});
