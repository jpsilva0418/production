/* /demo/amairanymua-01 — site "atelier": the home page (round four: black, white and soft cream).

   0. The opening: a logo seal on a black ground (a thin ring draws around her AS monogram, the
      "Glam By AMAIRANYMUA" lockup sets beneath with a hairline and LUXURY HAIR + MAKEUP), then the
      black sheet lifts onto the page. CSS only, gated inline.
   1. The hero, Galya-style: AMAIRANY set huge across the top, her director's-chair portrait in front
      of it, the headline and both ways to book on the first screen.
   1b. The magic in motion: an endless glide of her work (clips over stills, photographs), every card a
      link to that post.
   2. Two ways to book, then About directly under, with the picture-beside-film composition.
   3. The Experience: three numbered steps, from her own facts only.
   4. The Lookbook: her portrait between two columns of her work drifting past in opposite directions.
   5. Named galleries: three of her categories, each opening the portfolio filtered.
   6. The bridal collections on cream.
   7. Her own words in big caps on the black band, with the ratings.
   8. The Journal.   (The footer carries the closing call to action on every page.)

   THE iPHONE FILE-VIEWER RULE: every clip on this page sits on top of a real <img> of the same look
   and is shown only once it is actually playing; nothing depends on video, script or an animation
   finishing to be visible.
   THE SHARPNESS RULE: no image is shown wider than half its file width on a phone or its file width on
   a desktop; every `sizes` below is the rendered width. */
import { page, S, lockup, kicker, h, lede, sig, bookingLine, spec, more, next, arch, frame, section, sectionHead, steps, packageCard, loveNotes, arrow } from './shell.mjs';
import { SITE, HER, PATHS, FILMS, PHOTOS, FILM_POST, L, href, inquire, book, pic, filmSrc, src, srcset, esc } from '../site.mjs';

/* ===================== 0 — the opening =====================
   About 2.4 s, ends on the finished hero:
     0.00–1.00  a thin ivory ring draws clockwise around the AS seal (two half-rings turning behind two
                half-windows: transform only); the seal and its monogram settle in
     0.40–1.15  "Glam By" writes on, AMAIRANYMUA rises letter by letter
     0.95–1.30  a hairline draws, LUXURY HAIR + MAKEUP fades in, spaced
     1.55–2.35  the black sheet lifts away (transform only); behind it AMAIRANY, her portrait, the
                headline and the buttons rise into place
   Every hidden state lives only INSIDE a CSS animation (fill: both) under html.intro, so a browser
   without CSS animations, clip-path, script or video shows the finished page; nothing but the sheet
   itself has a static pre-state, and the gate removes the class after 2.6 s whatever happens (its own
   failsafe). Once per browser session; ?intro=1 always plays (except under reduced motion, which
   always skips it), ?intro=0 never; Save-Data skips it unless ?intro=1. Any wheel, touchmove,
   pointerdown or key (not Tab or Shift) finishes it at once. The sheet takes no pointer events, so
   the booking buttons are live throughout. */
const GATE = `<script>(function(){var d=document.documentElement,k='am01-intro-atelier';try{var q=location.search,on=/[?&]intro=1(&|$)/.test(q),off=/[?&]intro=0(&|$)/.test(q);if(off||!window.CSS||!CSS.supports||!CSS.supports('(animation-name:a)'))return;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!on){try{if(sessionStorage.getItem(k))return;}catch(e){}if(navigator.connection&&navigator.connection.saveData)return;}try{sessionStorage.setItem(k,'1');}catch(e){}d.classList.add('intro');var E=['wheel','touchmove','pointerdown','keydown'],end=function(e){if(e&&e.type==='keydown'&&(e.key==='Tab'||e.key==='Shift'))return;d.classList.remove('intro');E.forEach(function(t){removeEventListener(t,end,true);});};E.forEach(function(t){addEventListener(t,end,{capture:true,passive:true});});setTimeout(end,2600);addEventListener('pagehide',end);}catch(e){d.classList.remove('intro');}})();</script>`;
const OVERLAY = `<div class="op" aria-hidden="true"><div class="op-in">
<div class="op-seal"><span class="op-h op-h--r"><i></i></span><span class="op-h op-h--l"><i></i></span><span class="op-mono"><span>AS</span></span></div>
${lockup({ cls: 'lk--ivory lk--op' })}
<span class="op-rule"></span>
<p class="op-t">${SITE.tagline}</p>
</div></div>`;

/* ===================== 1 — the hero =====================
   Galya's hero is her portrait with her name in huge caps across the top. Here: AMAIRANY in the thin
   tall caps, edge to edge, and her director's-chair portrait (artist-chair-cut, the cut-out of her own
   brand photo, 800 wide) standing IN FRONT of the letters, her head over the first of them, her black
   suit against the white page. A cream floor plane and one hairline hold her. Phones: name, portrait,
   headline, both buttons, all on the first screen. Wide: the name across the whole width, the portrait
   in the middle, the headline on the left and the buttons on the right. */
const PORTRAIT = 'artist-chair-cut';
/* rendered width: phone ≈ min(88vw, H × .96) ≤ 380 px (file 800: ≤ 400 at 2x); wide ≤ 640 px */
const PT_SIZES = '(max-width:599px) 88vw, (max-width:899px) 60vw, 640px';

const hero = () => `<section class="hero" aria-labelledby="heroH">
<div class="hero-in">
<p class="hero-name" aria-hidden="true">Amairany</p>
<div class="hero-stage">
<span class="hero-floor" aria-hidden="true"></span>
<div class="hero-pt">${pic(PORTRAIT, { sizes: PT_SIZES, eager: true, alt: `${SITE.name}, the artist, in a black suit and strappy heels, leaning back in her director’s chair.` })}</div>
</div>
<div class="hero-a">
<p class="kick hero-k">${SITE.tagline}<span class="hk-a"> &middot; ${SITE.area}</span></p>
<p class="sig hero-sig">Hey gorgeous,</p>
<h1 class="d-hero hero-h" id="heroH"><span class="hl"><span>The art of</span></span> <span class="hl"><span>being</span></span> <span class="hl"><span>unforgettable.</span></span></h1>
</div>
<div class="hero-b">
<p class="hero-sub">Soft-full glam, &ldquo;cake free&rdquo;, by ${SITE.name}: for your wedding day and every moment you want to remember.</p>
<div class="hero-acts">${book('schedule', '<span>Book your glam</span>', 'btn btn--pri')}${inquire(S, '<span>Bridal inquiry</span>', 'btn btn--sec')}</div>
<p class="hero-hint">Choose a service, date and time on her booking calendar &middot; or start a bridal inquiry</p>
${bookingLine('hero-book')}
</div>
</div>
</section>`;

/* ===================== 1b — the magic in motion: an endless glide =====================
   A row of her work that moves on its own, right to left, endlessly: her clips (muted, inline,
   looping, each over a frame of the same clip) between her photographs. Every card is a plain
   same-tab link to that post: a clip, or a still taken from a clip, opens its TikTok post
   (FILM_POST); a photograph with no known post opens her Instagram.
   home.js drives it with one transform on the track (a duplicated set makes the loop seamless; the
   copy is inert and hidden from assistive technology). It slows to a stop while a pointer is over it,
   while a card has focus, or while a finger is on it (a finger can also drag it), and picks up again
   after; it rests off screen and in a hidden tab; under reduced motion, or without script, it never
   moves and is simply a row to swipe. No buttons, no play icons. Cards: 3:5, square-cornered. */
const GLIDE = [
  { photo: 'tile-bridal', k: 'Bridal', t: 'Over the shoulder' },
  { film: 'f5', photo: 'reel-bride-pearls-updo', k: 'Bridal', t: 'The glam reveal', start: 8 },
  { photo: 'studio-waves', k: 'Glam', t: 'Short glam waves' },
  { film: 'f9', photo: 'reel-curly-updo', k: 'Bridal hair', t: 'Curly updo, pearl pins', start: 9 },
  { photo: 'reel-morning-veil-2', post: 'f7', k: 'Bridal', t: 'Morning veil' },
  { film: 'f13', photo: 'reel-red-waves', k: 'Transformation', t: 'Red waves', start: 3.4 },
  { photo: 'bride-gold-waves', k: 'Bridal', t: 'Gold shimmer' },
  { film: 'f2', photo: 'reel-copper', k: 'Full glam', t: 'Copper', start: 4.6 },
  { photo: 'tile-engagement', k: 'Engagement', t: 'Rooftop soft glam' },
  { film: 'f10', photo: 'reel-pink', k: 'Editorial', t: 'Pink transformation', start: 9 },
  { photo: 'waves-blonde', k: 'Glam waves', t: 'Smoky eye' },
  { film: 'f12', photo: 'reel-editorial', k: 'Editorial', t: 'Graphic colour', start: 7.5 },
  { photo: 'reel-bridesmaid-updo', post: 'f8', k: 'Bridal party', t: 'Textured updo' },
];
/* card width: phones clamp(136px, 40vw, 164px); wide clamp(180px, 15vw, 230px) */
const GL_SIZES = '(max-width:599px) 164px, 230px';
/** a clip over a still of the same look: the still is the card until the clip really plays */
const clipHtml = (id, start, { hidden = true } = {}) => {
  const f = FILMS[id], s = filmSrc(id);
  if (!s) return '';
  return `<video data-film data-mv${start ? ` data-start="${start}"` : ''} muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback tabindex="-1"${hidden ? ' aria-hidden="true"' : ` aria-label="${esc(f.alt)}"`} style="object-position:${f.pos}"><source data-src="${s.mp4}" type="video/mp4"></video>`;
};
const creditOf = (m) => (m.film && FILMS[m.film].credit) || PHOTOS[m.photo].credit || '';
const glCard = (m) => {
  const postId = m.film || m.post;
  const url = postId ? FILM_POST[postId] : L.ig;
  const where = postId ? 'TikTok' : 'Instagram';
  const credit = creditOf(m);
  return `<li class="gl-it"><a class="gl-a" href="${url}" rel="external"><span class="gl-m clip">${pic(m.photo, { sizes: GL_SIZES, alt: PHOTOS[m.photo].alt })}${m.film ? clipHtml(m.film, m.start) : ''}</span><span class="gl-cap"><span class="gl-k">${m.k}</span><span class="gl-t">${m.t}</span>${credit ? `<span class="gl-cr">Makeup by ${SITE.first} &middot; ${credit}</span>` : ''}<span class="gl-go">${m.film ? 'Watch' : 'See'} on ${where} ${arrow}</span></span></a></li>`;
};
const glide = () => {
  const set = GLIDE.map(glCard).join('');
  return `<section class="mv" id="motion" aria-labelledby="mvH">
<div class="wrap mv-hd">
<div><p class="kick mv-kick">Straight from her chair</p><h2 class="d-l mv-h" id="mvH"><span class="hl"><span>The magic</span></span> <span class="mv-scr">in motion</span></h2></div>
<p class="mv-lede">Real brides, real glam: her own clips and photographs. Tap any one to open the post.</p>
</div>
<div class="gl" data-glide>
<div class="gl-track" data-glide-track>
<ul class="gl-set" aria-label="Her work: ${GLIDE.length} clips and photographs, each a link to the post">${set}</ul>
<ul class="gl-set gl-set--copy" aria-hidden="true" inert>${set.replace(/<a class="gl-a"/g, '<a class="gl-a" tabindex="-1"').replace(/ alt="[^"]*"/g, ' alt=""')}</ul>
</div>
</div>
<div class="wrap mv-next">${more(L.tiktok, 'More on her TikTok')}${book('schedule', '<span>Book your glam</span>', 'btn btn--pri btn--sm')}</div>
</section>`;
};

/* 2 — two ways to book, then About directly under (the founder's exact ask) */
const ways = () => {
  const [bride, event] = PATHS;
  return section({ id: 'book', tone: 'ivory', cls: 'ways', labelledby: 'waysH' }, `
${sectionHead({ kick: 'Two ways to book', heading: 'Begin here.', id: 'waysH', line: 'Weddings start with a short inquiry, so the reply is about your day. Events book straight onto her calendar.' })}
<div class="ways-g">
<article class="way way--bride rv">
${arch('wedding-florals', { ar: '3/4', sizes: '(max-width:899px) 132px, 156px', cls: 'way-ph', rv: '', alt: '' })}
<p class="way-n" aria-hidden="true">I</p>
<p class="kick kick--c">${bride.kicker}</p>
<h3 class="d-m">The Bride</h3>
<p class="way-b">${bride.body}</p>
${inquire(S, '<span>Start your bridal inquiry</span>', 'btn btn--pri')}
<blockquote class="way-q"><p class="way-qk">From her inquiry form</p><p>&ldquo;${HER.afterInquiry}&rdquo;</p></blockquote>
</article>
<article class="way way--event rv" style="--d:.12s">
${arch('tile-event-glam', { ar: '3/4', sizes: '(max-width:899px) 132px, 156px', cls: 'way-ph', rv: '', alt: '' })}
<p class="way-n" aria-hidden="true">II</p>
<p class="kick kick--c">${event.kicker}</p>
<h3 class="d-m">The Event</h3>
<p class="way-b">${event.body}</p>
${book('event', '<span>Book event glam</span>', 'btn btn--sec')}
<ul class="way-pts">${event.points.map((p) => `<li>${p}</li>`).join('')}</ul>
</article>
</div>`);
};

/* About, with the picture-beside-film composition: her own photograph (artist-brushes) large under an
   arched top, and a smaller tall card overlapping its lower right corner holding one of her clips
   (f8, the bridesmaids getting ready; no burned-in caption) over a frame of that same clip, labelled
   "Getting ready". If the clip never plays the card is that frame, never an empty block. */
const COMP = { photo: 'artist-brushes', film: 'f8', still: 'reel-bridesmaid-half-up', start: 1, label: 'Getting ready' };
const composition = () => {
  const f = FILMS[COMP.film];
  return `<figure class="cmp rv">
<div class="cmp-ph"><span class="cmp-line" aria-hidden="true"></span><div class="cmp-ph-m">${pic(COMP.photo, { sizes: '(max-width:599px) 72vw, (max-width:899px) 50vw, 420px', alt: `${SITE.name} holding a fan of makeup brushes toward the camera.` })}</div></div>
<div class="cmp-card"><a class="cmp-a clip" href="${FILM_POST[COMP.film]}" rel="external" aria-label="${esc(f.title)}: watch on TikTok">${pic(COMP.still, { sizes: '(max-width:599px) 38vw, (max-width:899px) 26vw, 220px', alt: PHOTOS[COMP.still].alt })}${clipHtml(COMP.film, COMP.start)}<span class="cmp-lbl" aria-hidden="true"><i></i>${COMP.label}</span></a></div>
<figcaption class="vh">${SITE.name}, and a clip of bridesmaids getting ready with her.</figcaption>
</figure>`;
};
const about = () => section({ id: 'about', tone: 'linen', cls: 'hello', labelledby: 'helloH' }, `
<div class="hello-g">
<div class="hello-ph">${composition()}</div>
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

/* 4 — The Lookbook (Galya): her portrait in the middle under an arched top (artist-spotlight-crop, a
   different photograph from the hero), two columns of her work drifting slowly past on either side in
   opposite directions (CSS, transform only; still under reduced motion; resting off screen), clips
   among the stills, each over a frame of the same clip. Then the heading, her own line and
   "View the looks". The columns are a picture, not a list of links: the one action is the button. */
const LB_L = [
  { photo: 'sheet-luxe-bride' },
  { film: 'f7', photo: 'reel-morning-veil', start: 4.4 },
  { photo: 'sheet-luxe-gala' },
  { photo: 'reel-pearls-updo-2' },
  { photo: 'reel-bridesmaid-waves' },
];
const LB_R = [
  { photo: 'sheet-signature' },
  { film: 'f6', photo: 'reel-burgundy-2', start: 6 },
  { photo: 'sheet-luxe-glam' },
  { photo: 'reel-copper-2' },
  { photo: 'reel-pink-2' },
];
/* column width: phones ≤ 96 px (sheet-* files ≈ 262–282 wide: ≤ 135 at 2x); wide ≤ 176 px */
const LB_SIZES = '(max-width:599px) 96px, (max-width:899px) 136px, 176px';
const lbTile = (m, copy) => {
  const credit = creditOf(m);
  return `<li class="lb-it"><span class="lb-m clip">${pic(m.photo, { sizes: LB_SIZES, alt: copy ? '' : PHOTOS[m.photo].alt })}${m.film ? clipHtml(m.film, m.start) : ''}${credit ? `<span class="lb-cr">Makeup by ${SITE.first} &middot; ${credit}</span>` : ''}</span></li>`;
};
const lbCol = (items, dir) => `<div class="lb-col lb-col--${dir}"><ul class="lb-run">${items.map((m) => lbTile(m, false)).join('')}</ul><ul class="lb-run" aria-hidden="true">${items.map((m) => lbTile(m, true)).join('')}</ul></div>`;
const lookbook = () => `<section class="lb" id="lookbook" aria-labelledby="lbH">
<div class="wrap lb-in">
<div class="lb-stage" data-lb>
${lbCol(LB_L, 'down')}
<figure class="lb-pt">${arch('artist-spotlight-crop', { ar: '3/4', sizes: '(max-width:599px) 46vw, (max-width:899px) 380px, 420px', alt: PHOTOS['artist-spotlight-crop'].alt, rv: '', line: true })}</figure>
${lbCol(LB_R, 'up')}
</div>
<div class="lb-t">
${kicker('Her work', 'rv')}
${h(2, ['The', 'Lookbook'], 'd-xl rv-mask', 'id="lbH"')}
<p class="sig lb-sig rv">never cakey</p>
<p class="lede rv">&ldquo;Real-life filter, never cakey.&rdquo; Customizable soft-full glam, &ldquo;CAKE FREE&rdquo;: bridal mornings, bridesmaids, full glam and colour, in her own photographs and clips.</p>
<div class="lb-next rv">${more(href(S, 'portfolio'), 'View the looks')}${inquire(S, '<span>Bridal inquiry</span>', 'btn btn--pri')}</div>
</div>
</div>
</section>`;

/* 5 — named galleries (Galya's "Timeless Soft Glam · View the gallery"): three of her categories, a
   large photograph each, a small place line between hairlines ("Central Florida", from HER.badges; no
   venue is invented), and "View the gallery" opening the portfolio filtered to that category
   (pages-work.js reads the #fragment; without script the fragment lands on the grid). */
const GALLERIES = [
  { name: 'Bridal soft glam', photo: 'bride-crystal', cat: 'bridal' },
  { name: 'Full glam', photo: 'glam-bronze', cat: 'full' },
  { name: 'Hair &amp; updos', photo: 'studio-updo', cat: 'hair' },
];
const galleries = () => section({ id: 'galleries', tone: 'ivory', rule: true, cls: 'gal', labelledby: 'galH' }, `
${sectionHead({ kick: 'The galleries', heading: ['Choose', 'your glam'], id: 'galH' })}
<div class="gal-g" data-stag=".12">${GALLERIES.map((g) => `<article class="gal-it rv">
<h3 class="d-s gal-n">${g.name}</h3>
<p class="gal-p">${HER.badges[1]}</p>
<a class="gal-a" href="${href(S, 'portfolio')}#${g.cat}" tabindex="-1" aria-hidden="true">${frame(g.photo, { ar: '4/5', sizes: '(max-width:599px) 340px, (max-width:899px) 70vw, 400px', alt: '', rv: '' })}</a>
<a class="btn btn--pri btn--sm gal-go" href="${href(S, 'portfolio')}#${g.cat}"><span>View the gallery</span><span class="vh">: ${g.name}</span></a>
</article>`).join('')}</div>`);

/* 6 — three packages, on cream (the black band is kept for her words below) */
const packages = () => section({ id: 'packages', tone: 'linen', cls: 'pkgs', labelledby: 'pkgH' }, `
${sectionHead({ kick: 'On her booking page', heading: ['The bridal', 'collections'], id: 'pkgH', line: 'Hair and makeup for the whole morning, with a private preview session first.' })}
<div class="pk-g" data-stag=".1">${HER.packages.slice(0, 3).map((p) => `<div class="rv">${packageCard(p)}</div>`).join('')}</div>
<p class="pkgs-note rv">${HER.packagesNote}</p>
<div class="next rv">${more(href(S, 'bridal'), 'All six packages')}${inquire(S, '<span>Bridal inquiry</span>', 'btn btn--pri')}</div>`);

/* 7 — her own words in big caps on the black band (Galya's testimonial band, holding HER words, never a
   review), then the ratings as three one-tap links */
const words = () => section({ id: 'words', tone: 'espresso', cls: 'words', labelledby: 'loveH' }, `
<blockquote class="pq words-q rv-mask"><p><span class="hl"><span>&ldquo;Let’s create</span></span> <span class="hl"><span>magic together.&rdquo;</span></span></p><cite>${SITE.first}, in her own words</cite></blockquote>
<div class="words-ln">
${kicker(HER.links.reviewsName, 'kick--c rv')}
<h2 class="vh" id="loveH">${HER.links.reviewsName}: her reviews</h2>
<p class="lede words-lede rv">Her reviews live where her clients wrote them. One tap opens each one in full.</p>
${loveNotes()}
</div>
<div class="next rv"><div class="acts acts--dark acts--c">${inquire(S, '<span>Begin your inquiry</span>', 'btn btn--pri')}${book('event', '<span>Book event glam</span>', 'btn btn--sec')}</div></div>`);

/* 8 — the journal */
const POSTS = [
  { path: 'journal/how-to-prepare', title: 'How to prepare for your glam', dek: `&ldquo;${HER.prepare[0]}&rdquo; Her two asks before your appointment, and how the preview session fits in.`, img: 'bride-ruby' },
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
  main: hero() + glide() + ways() + about() + experience() + lookbook() + galleries() + packages() + words() + journal(),
});
