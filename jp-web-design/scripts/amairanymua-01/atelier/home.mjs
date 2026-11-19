/* /demo/amairanymua-01 — site "atelier": the home page.

   1. The opening (a title card that lifts away: CSS, gated inline) and the hero: Amairany herself,
      her director's-chair portrait art-directed in front of a linen arch, the headline and both
      ways to book; then "The magic in motion", a row of her real clips over stills.
   2. Two ways to book (The Bride / The Event), then her About directly under, on linen.
   3. The Experience: three numbered steps, from her own facts only.
   4. The Looks: an arched runway of stills and clips that advances on its own.
   5. The bridal collections on the espresso band.
   6. Her own words in the tall caps, then Love Notes.
   7. The Journal.   (The footer carries the closing call to action on every page.) */
import { page, S, AT, lockup, kicker, h, lede, sig, bookingLine, spec, actions, more, next, arch, archFilm, frame, section, sectionHead, steps, packageCard, loveNotes, quote, rail, arrow } from './shell.mjs';
import { SITE, HER, PATHS, FILMS, PHOTOS, href, inquire, book, pic, filmSrc, src, srcset } from '../site.mjs';

/* ===================== 1 — the hero: Amairany herself =====================
   Her own director's-chair portrait (artist-chair-cut, the transparent cut-out of her brand photo)
   art-directed into the ivory world: a linen arch stands behind her shoulders and she leans out of
   it, her heels crossing its edge; GLAM, oversized in the thin tall caps, sits between the arch and
   her, her head over its first letters, like a masthead behind a cover portrait; a
   fine taupe arch line and a floor hairline hold the composition. Then the headline and the two
   ways to book, together on the first screen at every size.

   The centrepiece is an IMAGE, on purpose: the founder opens the single-file preview in the iPhone
   file viewer, which paints photographs but never video. Nothing in the hero depends on video,
   script or an animation finishing. */
const PORTRAIT = 'artist-chair-cut';
const PT_SIZES = '(max-width:599px) 86vw, (max-width:899px) 52vw, 44vw';

/* The opening, rebuilt (2026-11-19, round three refinement). One coherent piece, about 2.5 s, that
   ends on the hero above:
     0.00–0.95  an ivory title card: "Glam By" writes on, AMAIRANYMUA rises letter by letter, the
                badges fade in, tiny
     0.95–1.60  the card lifts away like a sheet of paper (transform only)
     1.05–2.05  behind it the linen arch opens from the floor; her portrait rises through a mask
     1.35–2.30  the headline rises line by line; the two buttons and the booking line follow
     2.10–2.50  the start of the film row
   Every hidden state lives only INSIDE a CSS animation (fill: both) under html.intro, so a browser
   without CSS animations, clip-path, script or video still shows the finished page; nothing has a
   static hidden pre-state except the title card itself, and the gate below removes the class after
   2.7 s whatever happens (that is also its own failsafe). Plays once per browser session; ?intro=1
   always plays (except under reduced motion, which always skips it), ?intro=0 never; Save-Data
   skips it unless ?intro=1. Any wheel,
   touchmove, pointerdown or key (not Tab or Shift) finishes it at once: the class goes and the page
   rests on its plain static styles in the same frame. The booking buttons are clickable throughout
   (the title card takes no pointer events). */
const GATE = `<script>(function(){var d=document.documentElement,k='am01-intro-atelier';try{var q=location.search,on=/[?&]intro=1(&|$)/.test(q),off=/[?&]intro=0(&|$)/.test(q);if(off||!window.CSS||!CSS.supports||!CSS.supports('(animation-name:a)'))return;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!on){try{if(sessionStorage.getItem(k))return;}catch(e){}if(navigator.connection&&navigator.connection.saveData)return;}try{sessionStorage.setItem(k,'1');}catch(e){}d.classList.add('intro');var E=['wheel','touchmove','pointerdown','keydown'],end=function(e){if(e&&e.type==='keydown'&&(e.key==='Tab'||e.key==='Shift'))return;d.classList.remove('intro');E.forEach(function(t){removeEventListener(t,end,true);});};E.forEach(function(t){addEventListener(t,end,{capture:true,passive:true});});setTimeout(end,2700);addEventListener('pagehide',end);}catch(e){d.classList.remove('intro');}})();</script>`;
const OVERLAY = `<div class="op" aria-hidden="true"><div class="op-in">${lockup({ cls: 'lk--op' })}<p class="op-b">${HER.badges.join(' &middot; ')}</p></div></div>`;

const hero = () => `<section class="hero" aria-labelledby="heroH">
<div class="hero-in">
<div class="hero-stage">
<div class="hero-fig">
<span class="hero-arch" aria-hidden="true"></span>
<span class="hero-line-arch" aria-hidden="true"></span>
<p class="hero-glam" aria-hidden="true">Glam</p>
<div class="hero-pt">${pic(PORTRAIT, { sizes: PT_SIZES, eager: true, alt: `${SITE.name}, the artist, in a black suit and strappy heels, leaning back in her director’s chair.` })}</div>
<span class="hero-floor" aria-hidden="true"></span>
</div>
<p class="hero-cap" aria-hidden="true">${SITE.name} &middot; ${SITE.handle}</p>
</div>
<div class="hero-t">
<p class="kick hero-k">${SITE.tagline} &middot; ${SITE.area}</p>
<h1 class="d-hero hero-h" id="heroH"><span class="hl"><span>The art of</span></span> <span class="hl"><span>being</span></span> <span class="hl"><span>unforgettable.</span></span></h1>
<p class="hero-sub">Soft-full glam, &ldquo;cake free&rdquo;, by ${SITE.name}: for your wedding day and every moment you want to remember.</p>
<div class="hero-acts">${book('schedule', '<span>Book your glam</span>', 'btn btn--glam')}${inquire(S, '<span>Bridal inquiry</span>', 'btn btn--sec')}</div>
<p class="hero-hint">Choose a service, date and time on her booking calendar &middot; or start a bridal inquiry</p>
${bookingLine('hero-book')}
</div>
</div>
</section>`;

/* ===================== 1b — the magic in motion =====================
   A row of her real clips right under the hero, its continuation: small vertical cards with arched
   tops, two to three visible on a phone, swipe for more. Each card is a real <img> of the look (a
   frame of that same clip) with the clip laid over it: the clip is fetched only after the page has
   loaded and the opening has finished, plays only near the viewport (site.js: at most three at
   once), fades in only once it is actually playing, and is never shown at all under reduced motion,
   Save-Data, without script, or in a viewer that does not play video: the photograph stands.
   Clips start at the finished look (`start`, seconds: most open on the "before"). None of the
   clips with her own burned-in captions (f1, f3, f4, f11). */
const MOTION = [
  { film: 'f7', photo: 'reel-morning-veil', k: 'Bridal', t: 'Morning veil', start: 5 },
  { film: 'f5', photo: 'reel-bride-pearls-updo', k: 'Bridal', t: 'The glam reveal', start: 8 },
  { film: 'f9', photo: 'reel-curly-updo', k: 'Bridal hair', t: 'Curly updo, pearl pins', start: 9 },
  { film: 'f13', photo: 'reel-red-waves', k: 'Transformation', t: 'Red waves', start: 3.4 },
  { film: 'f8', photo: 'reel-bridesmaid-half-up', k: 'Bridal party', t: 'Getting ready', start: 1 },
  { film: 'f14', photo: 'reel-copper', k: 'Full glam', t: 'The finish', start: 1.8 },
  { film: 'f10', photo: 'reel-pink', k: 'Editorial', t: 'Pink transformation', start: 9 },
];
const MV_SIZES = '(max-width:599px) 40vw, (max-width:1099px) 24vw, 200px';
const mvCard = (m) => {
  const f = FILMS[m.film], s = filmSrc(m.film);
  const credit = f.credit ?? PHOTOS[m.photo].credit;
  const video = s ? `<video data-film data-mv data-start="${m.start}" muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback tabindex="-1" aria-hidden="true" style="object-position:${f.pos}"><source data-src="${s.mp4}" type="video/mp4"></video>` : '';
  return `<li class="mv-it"><figure class="mv-card"><div class="mv-m">${pic(m.photo, { sizes: MV_SIZES, alt: PHOTOS[m.photo].alt })}${video}</div><figcaption class="mv-cap"><span class="mv-k">${m.k}</span><span class="mv-t">${m.t}</span>${credit ? `<span class="mv-cr">Makeup by ${SITE.first} &middot; ${credit}</span>` : ''}</figcaption></figure></li>`;
};
const motion = () => `<section class="mv" id="motion" aria-labelledby="mvH">
<div class="wrap mv-hd">
<div class="mv-hd-t"><p class="kick mv-kick">Straight from her chair</p><h2 class="d-l mv-h" id="mvH"><span class="hl"><span>The magic</span></span> <span class="hl"><span>in motion</span></span></h2></div>
<div class="mv-hd-s"><p class="mv-lede">Real brides and real glam, a few silent seconds from her own clips.</p>
<div class="mv-ctl"><button class="ic-btn" type="button" data-mv-prev aria-label="Previous clip" hidden><span aria-hidden="true">&larr;</span></button><button class="ic-btn" type="button" data-mv-next aria-label="Next clip" hidden><span aria-hidden="true">&rarr;</span></button><button class="pause mv-pause" type="button" data-mv-toggle aria-controls="mvTrack" hidden><span class="pause-i" aria-hidden="true"></span><span class="pause-t">Pause</span></button></div></div>
</div>
<ul class="mv-track" id="mvTrack" tabindex="0" aria-label="Her clips: swipe, or scroll with the arrow keys">${MOTION.map(mvCard).join('')}</ul>
<div class="wrap mv-next">${more(`${href(S, 'portfolio')}#reel`, 'Watch the reel')}${book('schedule', '<span>Book your glam</span>', 'btn btn--glam btn--sm')}</div>
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

export const home = () => page({
  path: '',
  title: 'Glam By Amairanymua · Bridal Hair & Makeup, Orlando + Tampa',
  description: `${SITE.name}, luxury bridal hair and makeup artist in Orlando and Tampa: soft-full glam, cake free, for your wedding day and every moment you want to remember. ${HER.booking.replace('&amp;', '&')}.`,
  head: `<link rel="preload" as="image" href="${src(PORTRAIT, 800)}" imagesrcset="${srcset(PORTRAIT)}" imagesizes="${PT_SIZES}" fetchpriority="high">`,
  css: ['home'],
  js: ['home'],
  bodyClass: 'home',
  opening: GATE + OVERLAY,
  main: hero() + motion() + ways() + about() + experience() + looks() + packages() + words() + journal(),
});
