/* /demo/amairanymua-01 — site "noir": the home page.
   1 the opening + hero reel · 2 scenes (scroll-driven) · 3 the artist · 4 the strip ·
   5 two ways to book · 6 end card. Runtime in assets/noir/home.js, styles in home.css. */
import { page, S, kick, h, cta, actions } from './shell.mjs';
import {
  SITE, HERO, INTRO, WORK, FEATURED, PATHS, FINAL, MONTAGE, LOOKS, SERVICES, FILMS,
  href, inquire, book, pic, src, srcset, film, arrow, L, PHOTOS,
} from '../site.mjs';

const pad = (n) => String(n).padStart(2, '0');
const HERO_SIZES = '(min-width:900px) 66vw, 100vw';
const lead = MONTAGE[0].photo;

/* ---------- 1. the opening + hero ---------- */
/* Decides, before the hero is parsed, whether the opening plays: motion allowed, Save-Data
   off, not yet played this session; ?intro=1 always plays, ?intro=0 never. The failsafe
   removes the class if home.js has not taken over within 2.5 s. */
const gate = `<script>(function(){try{var d=document.documentElement,q=location.search,k='am01-intro-noir';if(/[?&]intro=0/.test(q)||!document.body.animate)return;if(!/[?&]intro=1/.test(q)){if(!window.matchMedia||matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(navigator.connection&&navigator.connection.saveData)return;if(sessionStorage.getItem(k))return;}try{sessionStorage.setItem(k,'1')}catch(e){}d.classList.add('intro');setTimeout(function(){if(!d.classList.contains('intro-run'))d.classList.remove('intro')},2500)}catch(e){}})();</script>`;

const beat = (b, i) => {
  const on = i === 0 ? ' on' : '';
  const inner = b.film
    ? film(b.film, { label: FILMS[b.film].label })
    : pic(b.photo, { alt: i === 0 ? undefined : '', sizes: HERO_SIZES, eager: i === 0, cls: 'hb-img', attrs: i === 0 ? '' : 'fetchpriority="low"' });
  return `<div class="hb${on}${b.film ? ' hb--film' : ''}" data-label="${b.label}"${i === 0 ? '' : ' aria-hidden="true"'}><div class="hb-i">${inner}</div></div>`;
};
/* the strip that whips through the gate in the opening: six passing frames (480w, loaded
   by the opening itself), then the lead photograph (already preloaded) where it locks, then
   one spare frame below it for the settle */
const PASS = ['glam-bronze', 'bride-pearls', 'bride-ruby', 'waves-blonde', 'bride-gold-waves', 'glam-sculpt'];
const strip = () => `<div class="op-strip">${PASS.map((k) => `<div class="op-f"><img data-src="${src(k, 480)}" alt="" width="480" height="${Math.round((480 * PHOTOS[k].h) / PHOTOS[k].w)}" style="object-position:${PHOTOS[k].pos}" decoding="async"></div>`).join('')}<div class="op-f op-f--lock"><img data-src="${src(lead, 800)}" data-srcset="${srcset(lead)}" sizes="${HERO_SIZES}" alt="" width="${PHOTOS[lead].w}" height="${PHOTOS[lead].h}" style="object-position:${PHOTOS[lead].pos}" decoding="async"></div><div class="op-f"><img data-src="${src('bride-ruby', 480)}" alt="" width="480" height="558" style="object-position:${PHOTOS['bride-ruby'].pos}" decoding="async"></div></div>`;

const hero = () => `${gate}
<section class="hr" id="top" data-hero aria-labelledby="hrT">
<div class="hr-frame hr-reel" id="reel" data-n="${MONTAGE.length}">${MONTAGE.map(beat).join('')}</div>
<div class="op" aria-hidden="true">
<div class="hr-frame op-gate"><div class="op-st">${strip()}</div></div>
<i class="op-rule"></i>
<p class="op-line">Hair + Makeup <span>&mdash;</span> ${SITE.area}</p>
</div>
<div class="hr-fade" aria-hidden="true"></div>
<p class="slate hr-place"><span class="sep"></span>${SITE.area}, FL</p>
<div class="wrap hr-copy">
<div class="hr-meta">
<p class="slate slate--champ" aria-hidden="true"><span class="hr-n"><b id="reelN">01</b> / ${pad(MONTAGE.length)}</span><span class="sep"></span><span id="reelL">${MONTAGE[0].label}</span></p>
<button class="hr-pause" id="reelPause" type="button" hidden><i aria-hidden="true"></i><span class="t">Pause</span><span class="vh"> the reel of her work</span></button>
</div>
<h1 class="d-xxl hr-t" id="hrT"><span class="vh">${SITE.name}, luxury hair and makeup in ${SITE.area}. </span><span class="hr-l">Soft glam to</span> <span class="hr-l hr-l2"><em>full glam.</em></span></h1>
<p class="hr-line">${HERO.line}</p>
<div class="acts hr-acts">${inquire(S, `${HERO.cta} ${arrow}`, 'btn btn--solid')}${book('event', HERO.second, 'btn btn--line')}</div>
</div>
</section>`;

/* ---------- 2. scenes ---------- */
const svc = (id) => SERVICES.groups.flatMap((g) => g.items).find((x) => x.id === id);
const SCENES = [
  { name: 'Bridal.', photo: 'bride-ruby', item: 'bridal-hair-makeup' },
  { name: 'Soft glam.', photo: 'bride-pearls', item: 'soft-to-full-glam' },
  { name: 'Full glam.', photo: 'glam-sculpt', item: 'events-photoshoots' },
  { name: 'Glam waves.', photo: 'waves-blonde', item: 'glam-waves' },
];
const scenes = () => `<section class="sc" id="scenes" aria-label="What she is known for" data-scenes>
<div class="sc-stage">
${SCENES.map((s, i) => `<div class="scn${i === 0 ? ' on' : ''}" data-i="${i}">
<div class="scn-ph"><div class="scn-im">${pic(s.photo, { sizes: '(min-width:900px) 68vw, 100vw' })}</div></div>
<div class="wrap scn-txt">
<p class="slate slate--champ scn-sl">Sc. ${pad(i + 1)} / ${pad(SCENES.length)}</p>
<h2 class="scn-h"><em>${s.name}</em></h2>
<p class="scn-p">${svc(s.item).summary}</p>
</div>
</div>`).join('\n')}
<div class="sc-ui" aria-hidden="true"><span class="sc-prog"><i></i></span><span class="slate sc-n">Sc. <b>01</b> / ${pad(SCENES.length)}</span></div>
</div>
</section>`;

/* ---------- 3. the artist ---------- */
const artist = () => `<section class="sec art" id="artist" aria-labelledby="artH">
<div class="wrap art-g">
<figure class="art-ph rv-im">${pic('artist-brushes', { sizes: '(min-width:900px) 46vw, 100vw' })}</figure>
<div class="art-txt">
${kick(INTRO.eyebrow, 'rv')}
${h(2, INTRO.heading, 'd-l rv-mask', 'id="artH"')}
<p class="lead rv" style="--d:.1s">${INTRO.lead}</p>
<div class="body art-body rv" style="--d:.18s">${INTRO.sentences.map((x) => `<p>${x}</p>`).join('')}</div>
<p class="rv" style="--d:.24s"><a class="lnk" href="${href(S, 'about')}">${INTRO.more} ${arrow}</a></p>
</div>
</div>
<div class="wrap"><p class="art-pull rv-mask"><em>Real-life filter skin.</em> <em>Never cakey.</em></p></div>
</section>`;

/* ---------- 4. the strip ---------- */
const capOf = (k) => (LOOKS.find((x) => x.photo === k) || {}).cap || '';
const STRIP = [...FEATURED, { photo: 'bride-ruby' }, { film: 'f2' }, { photo: 'glam-bronze' }, { photo: 'wedding-florals' }, { photo: 'golden-hour' }, { photo: 'wedding-night' }];
const stripSec = () => `<section class="sec strip" id="work" aria-labelledby="workH">
<div class="wrap strip-head">
<div>
${kick(WORK.label, 'rv')}
${h(2, WORK.heading, 'd-l rv-mask', 'id="workH"')}
</div>
<div class="strip-side">
<p class="body rv" style="--d:.1s">${WORK.line}</p>
<div class="strip-arrows" data-strip-ctl hidden><button type="button" class="strip-btn" data-dir="-1" aria-label="Previous looks" aria-controls="stripVp"><span aria-hidden="true">&larr;</span></button><button type="button" class="strip-btn" data-dir="1" aria-label="Next looks" aria-controls="stripVp"><span aria-hidden="true">&rarr;</span></button></div>
</div>
</div>
<div class="strip-vp" id="stripVp" tabindex="0" role="region" aria-label="${WORK.aria}, swipe or use the arrow keys" data-strip>
<ul class="strip-track">
${STRIP.map((it, i) => `<li class="strip-it">${it.film
    ? `<figure class="strip-fig">${film(it.film, { label: FILMS[it.film].label, cls: 'strip-ph' })}<figcaption class="slate"><b>${pad(i + 1)}</b> / ${pad(STRIP.length)}<span class="sep"></span>Film &middot; ${FILMS[it.film].label}</figcaption></figure>`
    : `<figure class="strip-fig"><div class="strip-ph">${pic(it.photo, { sizes: '(min-width:900px) 28vw, 72vw' })}</div><figcaption class="slate"><b>${pad(i + 1)}</b> / ${pad(STRIP.length)}<span class="sep"></span>${capOf(it.photo)}</figcaption></figure>`}</li>`).join('\n')}
</ul>
</div>
<div class="wrap strip-foot">
<a class="lnk" href="${href(S, 'portfolio')}">${WORK.all} ${arrow}</a>
<a class="lnk" href="${L.ig}" rel="external">Instagram ${SITE.handle} ${arrow}</a>
</div>
</section>`;

/* ---------- 5. two ways to book ---------- */
const ASK = ['Date', 'Ceremony time', 'Getting ready at', 'First look', 'Ready by'];
const [W, E] = PATHS;
const booking = () => `<section class="sec bk" id="book" aria-labelledby="bkH">
<div class="wrap">
<header class="bk-head">
${kick(FINAL.label, 'rv')}
<h2 class="vh" id="bkH">${FINAL.label}</h2>
<p class="lead rv" style="--d:.08s">${FINAL.line}</p>
</header>
<div class="bk-g">
<article class="bk-s rv" aria-labelledby="bkW">
<p class="slate slate--champ">The wedding <span class="sep"></span> ${W.kicker}</p>
<h3 class="d-l" id="bkW">The <em>wedding.</em></h3>
<p class="body">${W.body}</p>
<div class="bk-ask"><p class="slate">What the inquiry asks</p>
<dl class="qa">${ASK.map((q) => `<div><dt>${q}</dt><dd>&mdash;</dd></div>`).join('')}</dl></div>
<div class="acts">${inquire(S, `${W.cta} ${arrow}`, 'btn btn--solid')}${book('bridal-services', 'Book bridal services', 'btn btn--line')}</div>
<p class="small bk-note">${W.note}.</p>
</article>
<article class="bk-s rv" style="--d:.12s" aria-labelledby="bkE">
<p class="slate slate--champ">The event <span class="sep"></span> ${E.kicker}</p>
<h3 class="d-l" id="bkE">The <em>event.</em></h3>
<p class="body">${E.body}</p>
<ul class="ticks bk-pts">${E.points.map((p) => `<li>${p}</li>`).join('')}</ul>
<div class="acts">${book('event', E.cta, 'btn btn--solid')}</div>
<p class="small bk-note">${E.note}.</p>
</article>
</div>
<p class="bk-proof rv"><a class="lnk" href="${href(S, 'reviews')}">${FINAL.proof} ${arrow}</a></p>
</div>
</section>`;

const end = () => cta({ kick: SITE.areaLong, heading: FINAL.heading, actions: actions({ inq: HERO.cta, event: HERO.second }) });

export const home = () => page({
  path: '',
  title: 'Bridal Hair & Makeup Artist, Orlando + Tampa',
  description: `${SITE.name} is a luxury hair and makeup artist in ${SITE.area}, Florida: soft glam to full glam, glam waves and real-life-filter skin for brides and events.`,
  head: `<link rel="preload" as="image" href="${src(lead, 800)}" imagesrcset="${srcset(lead)}" imagesizes="${HERO_SIZES}" fetchpriority="high">`,
  css: ['home'],
  js: ['home'],
  bodyClass: 'home',
  main: [hero(), scenes(), artist(), stripSec(), booking(), end()].join('\n'),
});
