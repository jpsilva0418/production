/* /demo/amairanymua-01 — site "atelier": the home page.

   1. The opening (an arched window opens: home.js) and the hero, a gallery wall of arches: her
      clip in the tall centre arch, two stills either side that change on their own.
   2. Two ways to book (The Bride / The Event), then her About directly under, on linen.
   3. The Experience: three numbered steps, from her own facts only.
   4. The Looks: an arched runway of stills and clips that advances on its own.
   5. The bridal collections on the espresso band.
   6. Her own words in the tall caps, then Love Notes.
   7. The Journal.   (The footer carries the closing call to action on every page.) */
import { page, S, AT, lockup, kicker, h, lede, sig, bookingLine, spec, actions, more, next, arch, archFilm, frame, section, sectionHead, steps, packageCard, loveNotes, quote, rail, archShow, wallToggle, arrow } from './shell.mjs';
import { SITE, HER, HERO, PATHS, FILMS, href, inquire, book, film, pic, filmSrc } from '../site.mjs';

/* The hero wall: her bridal morning clip in the centre; faces either side, older 1280 photographs
   and new reel stills alternating (none with burned-in text, none needing a credit line). */
const HERO_FILM = 'f7';
/* the clip opens on the artist herself; the bride (in her veil) is on screen from 4.4 s to the end,
   so the hero plays that part, and loops back to it (site.js reads data-start) */
const HERO_START = 4.4;
const LEFT = [
  ['bride-crystal', 'Bridal · Glam waves'],
  ['reel-bride-pearls-updo', 'Bridal · Sleek updo &amp; pearls'],
  ['bride-gold-waves', 'Bridal · Gold shimmer'],
  ['reel-burgundy', 'Bridal · Burgundy waves'],
];
const RIGHT = [
  ['waves-blonde', 'Glam waves · Smoky eye'],
  ['bride-ruby', 'Bridal · Full glam'],
  ['reel-red-waves', 'Full glam · Red waves'],
  ['glam-bronze', 'Full glam · Winged liner'],
];
const SIDE_SIZES = '(max-width:899px) 96px, (max-width:1439px) 200px, 260px';

/* The opening gate: runs first in <body>, before anything paints, so the first frame is already the
   opening's ivory (no flash of the finished page). Plays once per browser session; ?intro=1 always
   plays, ?intro=0 never; never under reduced motion or Save-Data (unless ?intro=1), never without
   the Web Animations API. Failsafe: if home.js has not taken over within 2.5 s, the class goes and
   the finished page shows. */
const GATE = `<script>(function(){var d=document.documentElement,k='am01-intro-atelier';try{var q=location.search,on=/[?&]intro=1(&|$)/.test(q),off=/[?&]intro=0(&|$)/.test(q);if(off||!document.body.animate||!window.matchMedia)return;if(!on){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(sessionStorage.getItem(k))return;if(navigator.connection&&navigator.connection.saveData)return;}sessionStorage.setItem(k,'1');d.classList.add('intro');setTimeout(function(){if(!d.classList.contains('intro-run'))d.classList.remove('intro');},2500);}catch(e){d.classList.remove('intro');}})();</script>`;
const OVERLAY = `<div class="op" aria-hidden="true"><i class="op-ln"></i><p class="op-b">${HER.badges.join(' &middot; ')}</p></div>`;

/* 1 — the hero */
const hero = () => `<section class="hero" aria-labelledby="heroH">
<div class="hero-in">
<div class="hero-t">
<p class="kick hero-k">${SITE.tagline} &middot; ${SITE.area}</p>
<h1 class="d-hero" id="heroH"><span class="hl"><span>Timeless</span></span> <span class="hl"><span>soft glam.</span></span></h1>
<p class="hero-line">${HERO.line}</p>
${bookingLine('hero-book')}
${actions({ cls: 'hero-acts' })}
</div>
<div class="hero-w">
<figure class="arch arch--film wall-c" id="heroFilm" style="--ar:3/5"><div class="arch-w"><div class="arch-m">${film(HERO_FILM, { label: '' }).replace('<video data-film', `<video data-film data-start="${HERO_START}"`)}</div></div><figcaption class="cap wall-c-cap">Film &middot; ${FILMS[HERO_FILM].title}</figcaption></figure>
<div class="wall-side" id="heroWall" data-wall data-hold="3800" data-films="heroFilm" role="group" aria-roledescription="slideshow" aria-label="Her looks, changing every few seconds">
${archShow({ keys: LEFT.map((x) => x[0]), caps: LEFT.map((x) => x[1]), ar: '5/9', sizes: SIDE_SIZES, eager: false, cls: 'wall-l' })}
${archShow({ keys: RIGHT.map((x) => x[0]), caps: RIGHT.map((x) => x[1]), ar: '4/7', sizes: SIDE_SIZES, eager: false, cls: 'wall-r' })}
</div>
<div class="hero-ctl">${wallToggle({ id: 'heroWall', cap: LEFT[0][1] })}${more(href(S, 'portfolio'), 'The portfolio', 'hero-more')}</div>
</div>
</div>
</section>`;

/* 2 — two ways to book, then About directly under (the founder's exact ask) */
const ways = () => {
  const [bride, event] = PATHS;
  return section({ id: 'book', tone: 'ivory', cls: 'ways', labelledby: 'waysH' }, `
${sectionHead({ kick: 'Two ways to book', heading: 'Begin here.', id: 'waysH', line: 'Weddings start with a short inquiry, so the reply is about your day. Events book straight onto her calendar.' })}
<div class="ways-g">
<article class="way way--bride rv">
${arch('wedding-florals', { ar: '3/4', sizes: '(max-width:899px) 150px, 170px', cls: 'way-ph', rv: '', alt: '' })}
<p class="way-n" aria-hidden="true">I</p>
<p class="kick kick--c">${bride.kicker}</p>
<h3 class="d-m">The Bride</h3>
<p class="way-b">${bride.body}</p>
${inquire(S, '<span>Start your bridal inquiry</span>', 'btn btn--pri')}
<blockquote class="way-q"><p class="way-qk">From her inquiry form</p><p>&ldquo;${HER.afterInquiry}&rdquo;</p></blockquote>
</article>
<article class="way way--event rv" style="--d:.12s">
${arch('reel-editorial', { ar: '3/4', sizes: '(max-width:899px) 150px, 170px', cls: 'way-ph', rv: '', alt: '' })}
<p class="way-n" aria-hidden="true">II</p>
<p class="kick kick--c">${event.kicker}</p>
<h3 class="d-m">The Event</h3>
<p class="way-b">${event.body}</p>
${book('event', '<span>Book event glam</span>', 'btn btn--sec')}
<ul class="way-pts">${event.points.map((p) => `<li>${p}</li>`).join('')}</ul>
</article>
</div>`);
};

const about = () => section({ id: 'about', tone: 'linen', cls: 'hello', labelledby: 'helloH' }, `
<div class="hello-g">
<figure class="hello-ph rv">${pic('artist-chair-cut', { sizes: '(max-width:899px) 86vw, 40vw' })}<figcaption class="cap">${SITE.name} &middot; ${SITE.handle}</figcaption></figure>
<div class="hello-t">
${kicker('About', 'rv')}
${h(2, HER.hello, 'd-l rv-mask', 'id="helloH"')}
<blockquote class="hello-q rv" style="--d:.08s">${HER.about.map((p) => `<p>${p}</p>`).join('')}</blockquote>
${sig(SITE.first, 'rv hello-sig')}
<dl class="hello-yrs rv">${HER.years.map(([k, v]) => `<div><dd>${v.replace(' years', '')}</dd><dt>Years ${k.toLowerCase()}</dt></div>`).join('')}</dl>
${spec(HER.badges, 'rv')}
<div class="hello-next rv">${inquire(S, '<span>Begin your inquiry</span>', 'btn btn--pri')}${more(href(S, 'about'), `More about ${SITE.first}`)}</div>
</div>
</div>`);

/* 3 — The Experience: from her facts only (her form's own promise; the packages' two-part artistry
   and post-ceremony touch-ups). */
const EXPERIENCE = [
  { title: 'Your inquiry', image: 'bride-pearls', body: `Tell ${SITE.first} your date, your timeline and who is getting ready with you. Her form promises a custom investment proposal and availability confirmation within 24 to 48 hours.` },
  { title: 'Your preview', image: 'glam-sculpt', body: 'Two-part bridal artistry: her bridal packages include a private preview session, so your look is designed before the day itself.' },
  { title: 'Your wedding day', image: 'wedding-night', body: 'Wedding-day hair and makeup, then post-ceremony touch-ups and a touch-up kit, as your package includes.' },
];
const experience = () => section({ id: 'experience', tone: 'ivory', cls: 'exp', labelledby: 'expH' }, `
${sectionHead({ kick: 'Working with her', heading: ['The', 'Experience'], size: 'd-xl', id: 'expH', line: 'From the first message to the last touch-up, three steps.' })}
${steps(EXPERIENCE)}
${next(inquire(S, '<span>Begin your inquiry</span>', 'btn btn--pri'), more(href(S, 'bridal'), 'See the packages'))}`);

/* 4 — The Looks: stills and clips in arches */
const LOOK_ITEMS = [
  { photo: 'bride-crystal', cap: 'Bridal · Glam waves' },
  { film: 'f5', cap: 'Film · The glam reveal' },
  { photo: 'reel-curly-updo', cap: 'Hair · Curly updo, pearl pins' },
  { photo: 'bride-ruby', cap: 'Bridal · Full glam' },
  { film: 'f6', cap: 'Film · Her reaction' },
  { photo: 'waves-blonde', cap: 'Glam waves · Smoky eye' },
  { photo: 'reel-bridesmaid-waves', cap: 'Bridal party · Vintage waves' },
  { film: 'f2', cap: 'Film · Full glam' },
  { photo: 'bride-gold-waves', cap: 'Bridal · Gold shimmer' },
  { photo: 'glam-bronze', cap: 'Full glam · Winged liner' },
  { film: 'f12', cap: 'Film · Editorial colour' },
  { photo: 'wedding-night', cap: 'Wedding day · After dark' },
];
const looks = () => section({ id: 'looks', tone: 'ivory', rule: true, cls: 'looks', labelledby: 'looksH', wrap: false }, `
<div class="wrap looks-hd">
<div>${kicker('The lookbook', 'rv')}${h(2, ['The', 'Looks'], 'd-xl rv-mask', 'id="looksH"')}</div>
<p class="lede rv" style="--d:.1s">Real brides and real glam, photographs and her own film. The runway moves on its own; swipe or use the arrows to take it at your pace.</p>
</div>
${rail({ id: 'looksRail', items: LOOK_ITEMS, label: 'The Looks', auto: 3400 })}
<div class="wrap">${next(more(href(S, 'portfolio'), 'Open the portfolio'), inquire(S, '<span>Bridal inquiry</span>', 'btn btn--pri'))}</div>`);

/* 5 — three packages on the espresso band */
const packages = () => section({ id: 'packages', tone: 'espresso', cls: 'pkgs', labelledby: 'pkgH' }, `
${sectionHead({ kick: 'On her booking page', heading: ['The bridal', 'collections'], id: 'pkgH', line: 'Hair and makeup for the whole morning, with a private preview session first.' })}
<div class="pk-g" data-stag=".1">${HER.packages.slice(0, 3).map((p) => `<div class="rv">${packageCard(p)}</div>`).join('')}</div>
<p class="pkgs-note rv">${HER.packagesNote}</p>
<div class="next rv">${more(href(S, 'bridal'), 'All six packages')}${inquire(S, '<span>Bridal inquiry</span>', 'btn btn--pri')}</div>`);

/* 6 — her own words, then Love Notes */
const words = () => section({ id: 'words', tone: 'linen', cls: 'words', labelledby: 'loveH' }, `
<div class="rv-mask words-q">${quote('<span class="hl"><span>Let’s create</span></span> <span class="hl"><span>magic together.</span></span>', `${SITE.first}, in her own words`)}</div>
<div class="words-ln">
${kicker(HER.links.reviewsName, 'kick--c rv')}
<h2 class="vh" id="loveH">${HER.links.reviewsName}: her reviews</h2>
<p class="lede words-lede rv">Her reviews live where her clients wrote them. One tap opens each one in full.</p>
${loveNotes()}
</div>
${next(inquire(S, '<span>Begin your inquiry</span>', 'btn btn--pri'), book('event', '<span>Book event glam</span>', 'btn btn--sec'))}`);

/* 7 — the journal */
const POSTS = [
  { path: 'journal/how-to-prepare', title: 'How to prepare for your glam', dek: `&ldquo;${HER.prepare[0]}&rdquo; Her two asks before your appointment, and how the preview session fits in.`, img: 'reel-final-touch', pos: '50% 100%' },   /* cropped below her own burned-in caption */
  { path: 'journal/destination-bride', title: 'Destination bride?', dek: '&ldquo;I travel worldwide for my brides.&rdquo; What she says about travel, and how to ask for a custom quote.', img: 'golden-hour' },
];
const journal = () => section({ id: 'journal', tone: 'ivory', cls: 'jr', labelledby: 'jrH' }, `
<div class="jr-hd">${kicker('The journal', 'rv')}${h(2, 'Notes from her chair.', 'd-l rv-mask', 'id="jrH"')}</div>
<div class="jr-g">${POSTS.map((p, i) => `<article class="jc rv" style="--d:${(i * 0.12).toFixed(2)}s"><a class="jc-a" href="${href(S, p.path)}">${frame(p.img, { ar: '4/5', sizes: '(max-width:599px) 92vw, (max-width:899px) 80vw, 560px', alt: '', pos: p.pos, rv: '' })}<p class="jc-k">Sample article, to be written with ${SITE.first}</p><h3 class="d-m jc-t">${p.title}</h3><p class="jc-d">${p.dek}</p><span class="more jc-more">Read the article ${arrow}</span></a></article>`).join('')}</div>
${next(more(href(S, 'journal'), 'All journal articles'))}`);

export const home = () => {
  const poster = filmSrc(HERO_FILM).poster;
  return page({
    path: '',
    title: 'Glam By Amairanymua · Bridal Hair & Makeup, Orlando + Tampa',
    description: `${SITE.name}, luxury bridal hair and makeup artist in Orlando and Tampa: timeless soft glam to full glam, cake free. ${HER.booking.replace('&amp;', '&')}.`,
    head: `<link rel="preload" as="image" href="${poster}" fetchpriority="high">`,
    css: ['home'],
    js: ['home'],
    bodyClass: 'home',
    opening: GATE + OVERLAY,
    main: hero() + ways() + about() + experience() + looks() + packages() + words() + journal(),
  });
};
