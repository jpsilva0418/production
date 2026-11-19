/* /demo/amairanymua-01 — site "cocoa": the home page.

   1. The opening (her lockup on espresso, the numbers count up, three of her pinned reels slide
      up into a fan, the espresso lifts away and the reels settle into the hero), the cream hero
      with its self-advancing stack of reels, and the numbers band.
   2. What brings you here? (three paths: wedding / event / hair only), her About directly under.
   3. Viral on TikTok & Instagram: a grid of her reels.
   4. Services as a numbered list, then three packages with prices.
   5. The Looks: filter chips over a rail of stills and clips.
   6. Love Notes.   7. The journal, then the closing band. */
import { page, S, lockup, sectionHead, actions, more, nextStep, bookingChip, rateChip, reelCard, frame, section, numbers, aboutBlock, loveNotes, packageCard, packagesNote, chips, rail, reelGrid, closing, postCard, POSTS, hdTools, CHEV_L, CHEV_R, arrow } from './shell.mjs';
import { SITE, HER, SOCIAL, FILMS, LOOKS, LOOK_CATS, L, A, href, inquire, book } from '../site.mjs';

/* ---------- the opening ----------
   The gate runs first in <body>, before anything paints, so the first frame is already the
   espresso panel (no flash of the finished page). Plays once per browser session; ?intro=1 always
   plays (except under reduced motion), ?intro=0 never; never under reduced motion, Save-Data, a
   #fragment (someone arriving mid-page) or without the Web Animations API. Failsafe: if home.js has
   not taken over within 2.5 s, the class goes and the finished page shows. */
const GATE = `<script>(function(){var d=document.documentElement,k='am01-intro-cocoa';try{var q=location.search,on=/[?&]intro=1(&|$)/.test(q),off=/[?&]intro=0(&|$)/.test(q);if(off||!document.body||!document.body.animate||!window.matchMedia||matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!on){if(location.hash||sessionStorage.getItem(k))return;if(navigator.connection&&navigator.connection.saveData)return;}sessionStorage.setItem(k,'1');d.classList.add('intro');setTimeout(function(){if(!d.classList.contains('intro-run'))d.classList.remove('intro');},2500);}catch(e){d.classList.remove('intro');}})();</script>`;

/* the three numbers the opening counts up to: exactly HER.years and SOCIAL */
const COUNT = [
  { to: HER.years[0][1].replace(/\D+/g, ''), label: 'Years in makeup' },
  { to: SOCIAL.tiktok.followers, label: 'On TikTok' },
  { to: SOCIAL.tiktok.likes, label: 'TikTok likes' },
];
const OVERLAY = `<div class="op" aria-hidden="true"><div class="op-bg"><div class="op-pane">
<div class="wrap hd-in op-hd"><span class="hd-logo">${lockup()}</span>${hdTools('', true)}</div>
<div class="op-lk">${lockup()}</div>
<div class="op-mid">
<i class="op-rule"></i>
<ul class="op-nums">${COUNT.map((c) => `<li class="op-n"><span class="op-v"><span class="op-v-f">${c.to}</span><span class="op-v-c" data-to="${c.to}">0</span></span><span class="op-l">${c.label}</span></li>`).join('')}</ul>
<p class="op-date">TikTok as of ${SOCIAL.asOf}</p>
</div>
</div></div></div>`;

/* ---------- the hero ----------
   The stack: her pinned reels first (f2 1.6M, f14 1.5M, f13 1.1M: the opening's fan), then bridal
   clips. Positions are data-k: 0 front, 1 behind right, -1 behind left, h hidden behind. The order
   puts f13 last so it starts behind left. */
const STACK = ['f2', 'f14', 'f5', 'f7', 'f4', 'f13'];

const kOf = (i, n) => (i === 0 ? '0' : i === 1 ? '1' : i === n - 1 ? '-1' : 'h');
const capOf = (id) => {
  const f = FILMS[id];
  return `${f.title}${f.views ? ` &middot; ${f.views} views on TikTok` : ` &middot; ${f.label}`}${f.credit ? ` &middot; Makeup by ${SITE.first}, ${f.credit.replace(/^With /, 'with ')}` : ''}`;
};
const hero = () => `<section class="hero" aria-labelledby="heroH" data-bar-after>
<div class="wrap hero-in">
<div class="hero-txt">
<p class="kick hero-k">Luxury bridal hair &amp; makeup</p>
<h1 class="d-xxl hero-h" id="heroH">Amairany <span class="hero-h2">Sierra</span></h1>
<p class="hero-sub">Bridal hair &amp; makeup <i aria-hidden="true">&middot;</i> ${SITE.area} <i aria-hidden="true">&middot;</i> available worldwide</p>
${bookingChip('hero-chip')}
${actions({ cls: 'hero-acts' })}
</div>
<div class="hero-st">
<div class="hs-wrap">
<div class="hs" id="heroStack" data-stack data-hold="4200" role="group" aria-roledescription="carousel" aria-label="Her reels: one slides forward every few seconds">
<div class="hs-deck">${STACK.map((id, i) => {
  const k = kOf(i, STACK.length);
  return `<div class="hs-c" data-k="${k}" data-cap="${capOf(id).replace(/"/g, '&quot;')}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${STACK.length}: ${FILMS[id].title}"${k === '0' ? '' : ' aria-hidden="true"'}><div class="hs-in">${reelCard(id, { cap: false, rv: '', tag: 'div' })}</div></div>`;
}).join('')}</div>
</div>
${rateChip('google', 'hs-rate')}
</div>
<div class="hs-ctl">
<p class="hs-cap" data-stack-cap aria-live="off">${capOf(STACK[0])}</p>
<div class="hs-btns" data-stack-btns hidden>
<button class="ic-btn" type="button" data-stack-prev aria-controls="heroStack" aria-label="Previous reel">${CHEV_L}</button>
<button class="ic-btn hs-pause" type="button" data-stack-toggle aria-controls="heroStack" aria-label="Pause the reels"><span class="hs-pi" aria-hidden="true"></span></button>
<button class="ic-btn" type="button" data-stack-next aria-controls="heroStack" aria-label="Next reel">${CHEV_R}</button>
</div>
</div>
</div>
</div>
</section>`;

/* ---------- 2. What brings you here? + About ---------- */
const PATH_CARDS = [
  {
    kick: 'Brides', title: 'Your wedding day', img: 'bride-crystal',
    body: 'Your date, your morning and who is getting ready with you, in a short inquiry.',
    note: `Her form’s promise: &ldquo;a custom investment proposal &amp; availability confirmation&rdquo; within 24 to 48 hours.`,
    act: inquire(S, `Start your bridal inquiry ${arrow}`, 'btn btn--pri btn--block'),
  },
  {
    kick: 'Events', title: 'An event or a night out', img: 'glam-bronze',
    body: 'Soft glam to full glam for the celebration, the night out or the photoshoot. Choose a time on her calendar.',
    note: 'In studio or on location.',
    act: book('event', `Book event glam ${arrow}`, 'btn btn--out btn--block'),
  },
  {
    kick: 'Hair', title: 'Hair only', img: 'waves-blonde',
    body: 'Glam waves and bridal hair. Glam Hair and the à la carte services live on her bridal services page.',
    note: 'Extensions: rent them with her, or ask which to buy.',
    act: book('bridal-services', `See hair services ${arrow}`, 'btn btn--out btn--block'),
  },
];
const paths = () => section({ id: 'begin', tone: 'cream', cls: 'paths', labelledby: 'pathsH' }, `
${sectionHead({ kick: 'Tailored to you', heading: 'What brings you <em>here?</em>', id: 'pathsH', center: true, line: 'Three ways in. Weddings start with an inquiry; everything else books straight onto her calendar.' })}
<ul class="pt-g" data-stag=".1">${PATH_CARDS.map((p, i) => `<li class="pt rv">
${frame(p.img, { shape: 'port', sizes: '(max-width:759px) 92vw, (max-width:1239px) 31vw, 380px', rv: '' })}
<div class="pt-b"><p class="pt-n num" aria-hidden="true">0${i + 1}</p><p class="kick">${p.kick}</p><h3 class="d-m">${p.title}</h3><p class="pt-x">${p.body}</p><p class="pt-note">${p.note}</p>${p.act}</div>
</li>`).join('')}</ul>`) + section({ id: 'about', tone: 'oat', cls: 'about', labelledby: 'aboutH' }, aboutBlock());

/* ---------- 3. Viral on TikTok & Instagram ---------- */
const VIRAL = ['f2', 'f14', 'f13', 'f1', 'f5', 'f6', 'f8', 'f3'];
const viral = () => section({ id: 'viral', tone: 'milk', cls: 'viral', labelledby: 'viralH' }, `
${sectionHead({ kick: `${SITE.handle} &middot; ${SOCIAL.tiktok.followers} followers`, heading: 'Viral on TikTok &amp; <em>Instagram</em>', id: 'viralH', line: `Her pinned TikToks: ${SOCIAL.pinned.map((p) => p.views).join(', ')} views, and ${SOCIAL.tiktok.likes} likes across her page. Silent here; the sound is on TikTok.`, side: `<p class="small viral-asof">Counts as of ${SOCIAL.asOf}</p>${more(L.tiktok, 'Watch on TikTok')}` })}
${reelGrid({ ids: VIRAL, six: true })}
${nextStep({ line: 'Seen a look you love? Bring it to your inquiry.', links: [[L.tiktok, 'Watch on TikTok'], [L.ig, 'Follow on Instagram']] })}`);

/* ---------- 4. Services + packages ---------- */
const SERVICE_LINES = {
  Bridal: { line: 'Two-part bridal artistry: a private preview session, then your wedding-day glam, for you and the people getting ready with you.', act: inquire(S, `Start your bridal inquiry ${arrow}`, 'lnk') },
  Engagement: { line: 'Soft to full glam on real-life-filter skin, for the photographs you will keep. Choose your service on her booking page.', act: book('schedule', `See all services ${arrow}`, 'lnk') },
  'Event glam': { line: 'Soft glam to full glam and glam waves for the celebration, the night out or the shoot, in studio or on location.', act: book('event', `Book event glam ${arrow}`, 'lnk') },
};
const PKG = ['The Luxe Bride', 'The Signature Soiree', 'The Radiant Bride'].map((n) => HER.packages.find((p) => p.name === n));
const services = () => section({ id: 'services', tone: 'cream', cls: 'svc', labelledby: 'svcH' }, `
<div class="svc-top">
${sectionHead({ kick: 'Services', heading: 'Hair, makeup <em>or both.</em>', id: 'svcH', line: 'Bridal first, then every occasion worth the glam.' })}
<ol class="svc-l">${HER.services.map((s, i) => `<li class="rv"><details class="svc-i"${i === 0 ? ' open' : ''}><summary><span class="svc-n num">0${i + 1}</span><span class="svc-t">${s}</span><i class="faq-x" aria-hidden="true"></i></summary><div class="svc-a"><p>${SERVICE_LINES[s]?.line ?? ''}</p>${SERVICE_LINES[s]?.act ?? ''}</div></details></li>`).join('')}</ol>
</div>
<div class="svc-pk">
<div class="svc-pk-h rv"><p class="kick">Bridal packages</p><h3 class="d-m">Three of her six, <em>as listed.</em></h3></div>
<div class="pks pks--3" data-stag=".08">${PKG.map((p) => `<div class="rv">${packageCard(p, { points: 4 })}</div>`).join('')}</div>
${packagesNote('rv')}
${nextStep({ links: [[href(S, 'bridal'), 'See all six packages']] })}
</div>`);

/* ---------- 5. The Looks ---------- */
/* stills from LOOKS, clips among them; `cats` for a clip is our reading of it, as LOOKS does for stills */
const LOOK_ITEMS = [
  LOOKS[0], { film: 'f1', cats: ['bridal', 'soft'], cap: 'Bridal · A bridal reveal' },
  LOOKS[2], LOOKS[1], { film: 'f4', cats: ['bridal', 'waves'], cap: 'Glam waves · Robe to gown' },
  LOOKS[3], LOOKS[4], { film: 'f6', cats: ['bridal', 'full', 'waves'], cap: 'Bridal · Her reaction' },
  LOOKS[5], LOOKS[6], { film: 'f7', cats: ['bridal', 'soft'], cap: 'Bridal · An early bridal morning' },
  LOOKS[7], LOOKS[8], LOOKS[9],
];
const looks = () => section({ id: 'looks', tone: 'cream', cls: 'looks', labelledby: 'looksH', wrap: false }, `
<div class="wrap">${sectionHead({ kick: 'The Looks', heading: 'Soft glam to <em>full glam.</em>', id: 'looksH', line: 'Real clients in real light, photographs and film. Choose a look to narrow it down.', side: more(href(S, 'portfolio'), 'Open the portfolio') })}</div>
<div class="looks-chips">${chips({ target: 'looksRail', cats: LOOK_CATS })}</div>
${rail({ id: 'looksRail', items: LOOK_ITEMS, label: 'Her looks' })}
<div class="wrap">${nextStep({ links: [[href(S, 'portfolio'), 'Open the portfolio']] })}</div>`);

/* ---------- 6. Love Notes ---------- */
const notes = () => section({ id: 'love-notes', tone: 'oat', cls: 'notes', labelledby: 'notesH' }, `
${sectionHead({ kick: HER.links.reviewsLine, heading: `${HER.links.reviewsName}`, id: 'notesH', center: true, line: 'Five stars everywhere her clients have written. Every review is one tap away, in full, where it was written.' })}
${loveNotes()}
${nextStep({ center: true, links: [[L.google, 'Worked with her? Leave a review']] })}`);

/* ---------- 7. Journal + closing ---------- */
const journal = () => section({ id: 'journal', tone: 'cream', cls: 'jt', labelledby: 'jtH' }, `
${sectionHead({ kick: 'The Journal', heading: 'Notes from <em>her chair.</em>', id: 'jtH', side: more(href(S, 'journal'), 'Read the journal') })}
<div class="posts">${POSTS.map((p) => postCard(p)).join('')}</div>`);

export const home = () => page({
  path: '',
  title: 'Bridal Hair & Makeup Artist, Orlando + Tampa',
  description: `${SITE.name}: luxury bridal hair and makeup in ${SITE.areaLong}, soft glam to full glam, with ${SOCIAL.tiktok.followers} followers on TikTok. ${HER.booking.replace('&amp;', '&')}.`,
  head: `<link rel="preload" as="image" href="${A}/film/${FILMS[STACK[0]].file}.jpg" fetchpriority="high">`,
  css: ['home'],
  js: ['home'],
  bodyClass: 'is-home',
  opening: `${GATE}\n${OVERLAY}\n`,
  main: `${hero()}
${numbers({ id: 'numbers' })}
${paths()}
${viral()}
${services()}
${looks()}
${notes()}
${journal()}
${closing({ kick: 'Ready when you are' })}`,
});
