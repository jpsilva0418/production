/* /demo/amairanymua-01 — site "blush": the home page.
   1 the opening (her seal draws, its centre opens onto her film, the window becomes the hero's round
     frame while the seal settles into the header) and the round hero; 2 two ways to book, then her
     About right under; 3 her reels in round windows; 4 The Looks, a rail that advances on its own;
     5 three packages; 6 Love Notes; 7 "Tell her about your day", the first step of the real inquiry;
     8 the journal. Every section ends on a next step. */
import { page, S, B, FILM_FROM, sealParts, kicker, h, mix, lede, script, overCaps, bookingLine, actions, more, next, frame, section, secHead, rail, reels, loveNotes, packageCard, packagesNote, quote, socialLine, seal, arrow } from './shell.mjs';
import { SITE, HER, HERO, WORK, PATHS, INQUIRY, PHOTOS, FILMS, L, A, href, inquire, book, pic, film, src, srcset, esc, filmSrc } from '../site.mjs';

const HERO_FILM = 'f7'; /* plays from FILM_FROM.f7: the finished look only */
/* the two small circles beside the hero's film: her photographs, changing on their own */
const ORBIT_A = ['bride-crystal', 'glam-sculpt', 'bride-gold-waves', 'waves-blonde'];
const ORBIT_B = ['reel-morning-veil', 'reel-burgundy', 'reel-bride-gown', 'reel-bride-pearls-updo'];

/* ---------- 1. the opening ----------
   The gate runs first in <body>, before anything can paint. It adds html.intro only when motion is
   allowed, Save-Data is off and the opening has not played in this tab's session (?intro=1 replays
   it, ?intro=0 never plays it). Failsafe: if home.js has not taken over (html.intro-run) within
   2.5 s, the class goes and the finished page shows. Without html.intro every .op element is
   display:none and the page is simply the page. */
const gate = `<script>(function(){var d=document.documentElement;try{var q=location.search;if(/[?&]intro=0/.test(q))return;var force=/[?&]intro=1/.test(q);if(!window.matchMedia||matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!document.body||!document.body.animate)return;var c=navigator.connection;if(!force&&c&&c.saveData)return;var k='am01-intro-blush';try{if(!force&&sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1');}catch(e){}d.classList.add('intro');setTimeout(function(){if(!d.classList.contains('intro-run'))d.classList.remove('intro');},2500);}catch(e){d.classList.remove('intro');}})();</script>`;
const opening = `${gate}
<div class="op" aria-hidden="true">
<div class="op-bg"></div>
<div class="op-disc"><svg class="seal" viewBox="0 0 400 400" focusable="false"><circle class="seal-disc" cx="200" cy="200" r="198"/></svg></div>
<div class="op-seal"><svg class="seal" viewBox="0 0 400 400" focusable="false">${sealParts({ glyphs: true }).replace(/<circle class="seal-disc"[^>]*\/>/, '')}</svg></div>
</div>`;

/* ---------- the round hero ---------- */
const orbit = (keys, cls, sizes) => `<div class="hr-o ${cls}" data-orbit role="group" aria-roledescription="slideshow" aria-label="Her looks, changing every few seconds">${keys.map((k, i) => {
  const P = PHOTOS[k];
  const img = i === 0
    ? pic(k, { sizes, eager: false })
    : `<img data-src="${src(k)}" data-srcset="${srcset(k)}" sizes="${sizes}" width="${P.w}" height="${P.h}" alt="${esc(P.alt)}" style="object-position:${P.pos}" decoding="async">`;
  return `<figure class="hr-o-s${i === 0 ? ' is-on' : ''}"${i === 0 ? '' : ' aria-hidden="true"'}>${img}</figure>`;
}).join('')}</div>`;

const hero = () => `<section class="hr" aria-labelledby="hrH">
<div class="wrap hr-in">
<div class="hr-art">
<i class="hr-ring" aria-hidden="true"></i>
<div class="hr-big" data-film-eager data-film-from="${FILM_FROM[HERO_FILM]}"><div class="hr-big-m">${film(HERO_FILM, { label: '' })}</div></div>
${orbit(ORBIT_A, 'hr-o--a', '(max-width:899px) 30vw, 190px')}
${orbit(ORBIT_B, 'hr-o--b', '(max-width:899px) 26vw, 160px')}
<button class="pz hr-pz" type="button" data-orbit-toggle hidden><span class="pz-i" aria-hidden="true"></span><span class="pz-t">Pause</span></button>
</div>
<div class="hr-txt">
${kicker(`${SITE.name} &middot; ${SITE.area}`, 'hr-k')}
<h1 class="d-xl hr-h" id="hrH">${mix('Soft glam, *cake free,* and all the hype.')}</h1>
${lede(HERO.line, 'hr-l')}
<div class="hr-acts" data-pill-after>${actions({ inq: 'Begin your inquiry', event: 'Book event glam' })}</div>
${bookingLine('hr-chip')}
</div>
</div>
</section>`;

/* ---------- 2. two ways to book, then About right under ---------- */
const ways = () => section({ id: 'book', tone: 'cream', cls: 'bk', labelledby: 'bkH' }, `
${secHead({ kick: 'Book with Amairany', heading: 'Two ways to *begin.*', id: 'bkH', line: 'Brides start with a short inquiry, so the reply is about your day. Events book straight onto her calendar.' })}
<div class="bk-cards" data-stag=".12">
<article class="bk-c bk-c--bride rv">
${frame('bride-pearls', { shape: 'circle', sizes: '120px', rv: '', cls: 'bk-ph', alt: '' })}
<p class="bk-who">I&rsquo;m a bride</p>
<h3 class="d-m">${mix('Secure your *wedding day glam.*')}</h3>
<p class="bk-p">${PATHS[0].body}</p>
<p class="bk-promise"><span class="bk-promise-k">What her inquiry promises</span>${HER.afterInquiry}</p>
<div class="bk-go">${inquire(S, `Begin your inquiry ${arrow}`, 'btn btn--pri')}</div>
</article>
<article class="bk-c bk-c--event rv">
${frame('glam-bronze', { shape: 'circle', sizes: '120px', rv: '', cls: 'bk-ph', alt: '' })}
<p class="bk-who">I have an event</p>
<h3 class="d-m">${mix('Glam for the *celebration.*')}</h3>
<p class="bk-p">${PATHS[1].body}</p>
<ul class="bk-pts">${PATHS[1].points.map((p) => `<li>${p}</li>`).join('')}</ul>
<div class="bk-go">${book('event', `Book event glam ${arrow}`, 'btn btn--sec')}<span class="bk-note">${PATHS[1].note}</span></div>
</article>
</div>`);

const about = () => section({ id: 'meet', tone: 'blush', cls: 'ab', labelledby: 'abH' }, `
<div class="ab-in">
<figure class="ab-art rv">
<i class="ab-disc" aria-hidden="true"></i>
${pic('artist-chair-cut', { sizes: '(max-width:899px) 82vw, 460px', cls: 'ab-img' })}
</figure>
<div class="ab-txt">
${kicker(`Meet ${SITE.first}`, 'rv')}
<h2 class="d-l rv" id="abH">${HER.hello.replace('Gorgeous!', '<em>Gorgeous!</em>')}</h2>
<div class="ab-words rv">${HER.about.map((p) => `<p>${p}</p>`).join('')}<p class="ab-sig">${script(SITE.first)}</p></div>
<dl class="ab-years rv">${HER.years.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
<ul class="ab-badges rv">${HER.badges.map((b) => `<li>${b}</li>`).join('')}</ul>
${next({ cls: 'next--left rv', go: [more(href(S, 'about'), `More about ${SITE.first}`), inquire(S, `Begin your inquiry ${arrow}`, 'more')] })}
</div>
</div>`);

/* ---------- 3. her reels ---------- */
const REEL_IDS = ['f5', 'f6', 'f8', 'f14'];
const reelsSec = () => section({ id: 'reels', tone: 'cream', cls: 'rl', labelledby: 'rlH' }, `
${secHead({ kick: 'Her reels', heading: 'Fresh from *her chair.*', id: 'rlH', line: 'Silent clips of her brides and her glam, from her own TikTok.' })}
${reels({ ids: REEL_IDS })}
<div class="rl-foot rv">${socialLine()}</div>
${next({ go: [more(L.tiktok, 'Watch more on TikTok'), more(L.ig, `Instagram ${SITE.handle}`), inquire(S, `Begin your inquiry ${arrow}`, 'more')] })}`);

/* ---------- 4. The Looks ---------- */
const LOOK_ITEMS = [
  { photo: 'bride-crystal', cap: 'Bridal &middot; Glam waves' },
  { film: 'f4', cap: 'Robe to gown' },
  { photo: 'reel-bride-pearls-updo', cap: 'Bridal &middot; Sleek updo' },
  { photo: 'bride-pearls', cap: 'Bridal &middot; Soft glam' },
  { film: 'f9', cap: 'A curly updo' },
  { photo: 'bride-gold-waves', cap: 'Bridal &middot; Gold shimmer' },
  { photo: 'reel-burgundy', cap: 'Bridal &middot; Big glam waves' },
  { photo: 'glam-sculpt', cap: 'Full glam &middot; Sculpted bronze' },
  { film: 'f2', cap: 'Full glam' },
  { photo: 'bride-ruby', cap: 'Bridal &middot; Full glam' },
  { photo: 'reel-bridesmaid-waves', cap: 'Bridal party &middot; Vintage waves' },
  { photo: 'waves-blonde', cap: 'Glam waves &middot; Smoky eye' },
];
const looks = () => section({ id: 'looks', tone: 'paper', cls: 'lk', labelledby: 'lkH', wrap: false }, `
<div class="wrap">${secHead({ kick: 'The Looks', heading: 'Real skin, *real glam.*', id: 'lkH', line: WORK.line })}</div>
<div class="rv">${rail({ id: 'homeLooks', items: LOOK_ITEMS, label: 'The Looks', auto: 3800 })}</div>
<div class="wrap">${next({ go: [more(href(S, 'portfolio'), WORK.all), inquire(S, `Begin your inquiry ${arrow}`, 'more')] })}</div>`);

/* ---------- 5. packages ---------- */
const packages = () => section({ id: 'packages', tone: 'blush', cls: 'pkg', labelledby: 'pkgH' }, `
${secHead({ kick: 'Bridal packages', heading: 'For the bride, and *her people.*', id: 'pkgH', line: 'Three of her six bridal packages, with prices as listed on her booking page. Each one includes a preview session before the day.' })}
<div class="pks" data-stag=".1">${HER.packages.slice(0, 3).map((p) => `<div class="rv">${packageCard(p)}</div>`).join('')}</div>
${packagesNote('rv')}
${next({ go: [more(href(S, 'bridal'), 'See all six packages'), inquire(S, `Begin your inquiry ${arrow}`, 'more')] })}`);

/* ---------- 6. Love Notes ---------- */
const notes = () => section({ id: 'love-notes', tone: 'cream', cls: 'lv', labelledby: 'lvH' }, `
<div class="lv-in">
${seal({ cls: 'lv-seal seal--spin' })}
<div class="rv">${overCaps({ caps: 'Love', word: 'notes', level: 2, label: 'Love notes' }).replace('<h2 ', '<h2 id="lvH" ')}</div>
<p class="d-m lv-sub rv">${mix('Five-star brides, *one tap away.*')}</p>
<p class="lede lv-l rv">Her reviews live where her clients wrote them: read them in full on WeddingWire, The Knot and Google.</p>
${loveNotes()}
${next({ line: 'Ready to be next?', go: [inquire(S, `Begin your inquiry ${arrow}`, 'more')] })}
</div>`);

/* ---------- 7. Tell her about your day ----------
   An honest first step: the progress row of her four-step inquiry and its first question, the
   wedding date. "Continue" opens the real Bridal Inquiry page; home.js hands the date over through
   the inquiry's own saved state (sessionStorage 'am01-bridal-inquiry-v1', the key assets/js/
   inquiry.js reads on load), so the form opens with the date already filled. Nothing is sent. With
   no script the question is hidden and the link simply opens the form. */
const tell = () => section({ id: 'your-day', tone: 'cream', cls: 'tl', labelledby: 'tlH' }, `
<div class="tl-card rv" data-pill-hide>
<div class="tl-a">
${kicker(INQUIRY.cardKick)}
<h2 class="d-l" id="tlH">${mix('Tell her about *your day.*')}</h2>
<p class="lede">${INQUIRY.body}</p>
${quote('Let’s create magic together!', SITE.first, 'tl-q')}
</div>
<div class="tl-b">
<ol class="tl-steps" aria-label="Her bridal inquiry, four short steps">${INQUIRY.steps.map((s, i) => `<li${i === 0 ? ' class="now" aria-current="step"' : ''}><span class="tl-n" aria-hidden="true">${i + 1}</span><span class="tl-t">${s.label}</span></li>`).join('')}</ol>
<div class="tl-ask">
<p class="tl-legend">Step 1 &middot; ${INQUIRY.steps[0].legend}</p>
<label class="tl-lbl" for="tlDate">When is the wedding?</label>
<div class="tl-row"><input class="tl-in" id="tlDate" type="date" autocomplete="off"><label class="tl-chk"><input type="checkbox" id="tlUnknown"><span>Not set yet</span></label></div>
</div>
${inquire(S, `Continue my inquiry ${arrow}`, 'btn btn--pri tl-go', 'data-tell')}
<p class="tl-note">${HER.afterInquiry}</p>
<p class="tl-fine">${INQUIRY.note}</p>
</div>
</div>
${next({ line: 'Not a bride?', go: [book('event', `Book event glam ${arrow}`, 'more')] })}`);

/* ---------- 8. the journal ---------- */
const POSTS = [
  { path: 'journal/how-to-prepare', image: 'artist-brushes', kick: 'Getting ready', title: 'How to prepare for *your glam*', dek: 'Come with a clean face, hair washed and blown out the day before: her two notes, plus trials and touch-ups.' },
  { path: 'journal/destination-bride', image: 'golden-hour', kick: 'Travel', title: 'Destination *bride?*', dek: 'She travels worldwide for her brides: reach out for travel availability and a custom quote.' },
];
const journal = () => section({ id: 'journal', tone: 'cream', cls: 'jr', labelledby: 'jrH' }, `
${secHead({ kick: 'The journal', heading: 'Notes from *her chair.*', id: 'jrH', line: 'Short guides in her own words, for the months before the wedding.' })}
<div class="jr-cards" data-stag=".12">${POSTS.map((p) => `<article class="jr-c rv">
<a class="jr-a" href="${href(S, p.path)}" aria-label="${p.title.replace(/\*/g, '').replace(/([^?.!])$/, '$1.')} Sample article, to be written with ${SITE.first}.">
${frame(p.image, { shape: 'card', sizes: '(max-width:759px) 88vw, 540px', rv: '', alt: '' })}
<span class="jr-tag">Sample article, to be written with ${SITE.first}</span>
<span class="jr-k">${p.kick}</span>
<h3 class="d-m jr-t">${mix(p.title)}</h3>
<span class="jr-d">${p.dek}</span>
<span class="more jr-more">Read the article ${arrow}</span>
</a>
</article>`).join('')}</div>
${next({ go: [more(href(S, 'journal'), 'Read the journal'), inquire(S, `Begin your inquiry ${arrow}`, 'more')] })}`);

export const home = () => {
  const poster = filmSrc(HERO_FILM)?.poster;
  return page({
    path: '',
    title: 'Bridal Hair & Makeup Artist, Orlando + Tampa',
    description: `${SITE.name}, luxury bridal hair and makeup in Orlando and Tampa: soft glam to full glam, cake free, for brides and their people. ${HER.booking.replace('&amp;', '&')}.`,
    head: poster ? `<link rel="preload" href="${poster}" as="image" fetchpriority="high">` : '',
    css: ['home'],
    js: ['home'],
    bodyClass: 'is-home',
    opening,
    main: `${hero()}
${ways()}
${about()}
${reelsSec()}
${looks()}
${packages()}
${notes()}
${tell()}
${journal()}`,
  });
};
