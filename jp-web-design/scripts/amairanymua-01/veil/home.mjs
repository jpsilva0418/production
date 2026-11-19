/* /demo/amairanymua-01 — site "veil": the home page.

   1 the opening (the veil lifts off the page, carrying her monogram) and the hero (one tall,
     slow, cross-dissolving picture of her work, led by the bride in satin and pearls)
   2 the signature: "Real-life filter skin. Never cakey." and the artist
   3 the looks: a snap-scrolling rail of tall frames, film among the stills
   4 the night band: the cathedral veil, "Secure your wedding day glam."
   5 two ways to book, where the aisle ends
   The aisle: one fine champagne line drawn down the page by scrolling, a pearl at each chapter. */
import { page, monogram, frame, filmFrame, foil, kick, heading, rule, pearl, points, lookCap, MONO_D, MONO_VB } from './shell.mjs';
import { SITE, L, HERO, INTRO, WORK, FEATURED, PATHS, FINAL, MONTAGE, FILMS, PHOTOS, PORTFOLIO_PAGE, BRIDAL, href, inquire, book, pic, srcset, src, film, esc, arrow } from '../site.mjs';

const S = 'veil';
const LEAD = 'bride-pearls';
const HERO_SIZES = '(max-width:899px) 100vw, 44vw';
/* the hero's sequence: the bride in pearls first, then MONTAGE in its own order */
const BEATS = [{ photo: LEAD, label: 'Soft glam' }, ...MONTAGE.filter((b) => b.photo !== LEAD)];

/* The decision, inline and before anything paints: play the opening only when motion is
   allowed, Save-Data is off and it has not played this session, or when ?intro=1 asks.
   ?intro=0 never plays. If home.js has not taken over within 2.5 s, the class is removed. */
const decide = `<script>(function(h){var p=false,k='am01-intro-veil',m=/[?&]intro=([01])/.exec(location.search);try{if(m)p=m[1]==='1';else{var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,sd=navigator.connection&&navigator.connection.saveData,seen=false;try{seen=!!sessionStorage.getItem(k)}catch(e){}p=!rm&&!sd&&!seen}}catch(e){p=false}if(!p)return;h.classList.add('intro');window.__veilT0=(window.performance&&performance.now)?performance.now():0;try{sessionStorage.setItem(k,'1')}catch(e){}setTimeout(function(){if(!window.__veilOp)h.classList.remove('intro')},2500)})(document.documentElement)</script>`;

/* The veil: three layers of tulle, the monogram on the front one. Pure CSS paints it; the
   specular light is a band moving inside the monogram's own outline. */
const opening = () => `${decide}
<div class="op" aria-hidden="true">
  <div class="op-l op-l3"><i class="op-folds"></i></div>
  <div class="op-l op-l2"><i class="op-folds"></i></div>
  <div class="op-l op-l1"><i class="op-folds"></i>
    <div class="op-mark">
      <svg class="op-mono" viewBox="${MONO_VB}" focusable="false"><defs><clipPath id="op-clip"><path d="${MONO_D}"/></clipPath><linearGradient id="op-glint-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFDFA" stop-opacity="0"/><stop offset=".5" stop-color="#FFFDFA" stop-opacity=".95"/><stop offset="1" stop-color="#FFFDFA" stop-opacity="0"/></linearGradient></defs><use href="#vl-as" fill="url(#vl-foil)"/><g clip-path="url(#op-clip)"><g transform="skewX(-16)"><rect class="op-glint" x="-420" y="0" width="300" height="720" fill="url(#op-glint-g)"/></g></g></svg>
      <p class="op-name">${SITE.name}</p>
      <span class="op-rule"></span>
      <p class="op-sub">Hair + Makeup</p>
    </div>
  </div>
</div>`;

/* one beat of the hero picture: the lead is a real, eager image; the rest wait for home.js */
const beat = (b, i) => {
  if (b.film) {
    return `<div class="beat beat--film${i === 0 ? ' is-on' : ''}" data-label="${esc(b.label)}" aria-hidden="true">${film(b.film, { label: FILMS[b.film].label })}<i class="beat-veil"></i></div>`;
  }
  const img = pic(b.photo, { sizes: HERO_SIZES, eager: i === 0, alt: i === 0 ? undefined : '' });
  const lazy = i === 0 ? img : img.replace(/ srcset="/, ' data-srcset="').replace(/ src="/, ' data-src="').replace(' loading="lazy"', '');
  return `<div class="beat${i === 0 ? ' is-on' : ''}" data-label="${esc(b.label)}"${i === 0 ? '' : ' aria-hidden="true"'}>${lazy}</div>`;
};

const hero = () => `<section class="hero" id="top" aria-label="${esc(HERO.label)}" data-bar-after>
  <div class="hero-pic">
    <div class="hero-clip"><div class="hero-pic-in" data-reel>
      ${BEATS.map(beat).join('\n      ')}
    </div></div>
    <i class="hero-tulle" aria-hidden="true"></i>
    <div class="hero-meta">
      <p class="hero-lbl" aria-hidden="true"><span class="hero-n">01</span><span class="hero-of">/ ${String(BEATS.length).padStart(2, '0')}</span><span class="hero-l">${BEATS[0].label}</span></p>
      <button class="hero-pause" type="button" aria-pressed="false" aria-label="Pause the slideshow" hidden><span class="pz" aria-hidden="true"></span></button>
    </div>
  </div>
  <div class="hero-txt">
    <h1 class="hero-name"><span class="hero-ln"><span>Amairany</span></span> <span class="hero-ln"><span>Sierra</span></span></h1>
    <span class="hero-rule" aria-hidden="true"><i></i></span>
    <p class="hero-sub">${HERO.sub}</p>
    <div class="hero-act acts">${inquire(S, HERO.cta, 'btn')}${book('event', HERO.second, 'btn btn--line')}</div>
    <a class="hero-cue" href="#signature"><span>${HERO.cue}</span><i aria-hidden="true"></i></a>
  </div>
</section>`;

const signature = () => `<section class="sec sig" id="signature" aria-labelledby="sig-h">
  <div class="wrap">
    <div class="chap-head sig-head">
      ${pearl('aisle-pearl')}
      ${kick('Her signature', 'rv')}
      <h2 class="disp sig-q" id="sig-h"><span class="ln rv-line"><span>Real-life filter skin.</span></span> <span class="ln rv-line" style="--d:.14s"><span>${foil('Never cakey.')}</span></span></h2>
    </div>
    <div class="sig-grid">
      <div class="sig-txt">
        <p class="lede rv">${INTRO.lead}</p>
        <div class="sig-body body">
          ${INTRO.sentences.map((s, i) => `<p class="rv" style="--d:${(0.08 * (i + 1)).toFixed(2)}s">${s}</p>`).join('\n          ')}
        </div>
        <ul class="vals rv" aria-label="What she does">${INTRO.values.map((v) => `<li>${v}</li>`).join('')}</ul>
        <a class="lnk rv" href="${href(S, 'about')}">${INTRO.more} ${arrow}</a>
      </div>
      ${frame('artist-brushes', { cap: INTRO.caption, ar: '4/5', sizes: '(max-width:899px) 86vw, 34vw', cls: 'sig-fig' })}
    </div>
  </div>
</section>`;

const railItem = (it, i) => {
  const inner = it.film
    ? filmFrame(it.film, { cap: `${FILMS[it.film].label} &middot; Film`, ar: '3/4' })
    : frame(it.photo, { cap: true, ar: '3/4', sizes: '(max-width:599px) 74vw, (max-width:1099px) 42vw, 380px' });
  return `<li class="rail-it" style="--d:${(Math.min(i, 3) * 0.08).toFixed(2)}s">${inner}</li>`;
};

const looks = () => `<section class="sec looks" id="looks" aria-labelledby="looks-h">
  <div class="wrap chap-head">
    ${pearl('aisle-pearl')}
    ${kick(WORK.label, 'rv')}
    ${heading(['Soft glam to', 'full glam.'], { id: 'looks-h' })}
    <p class="lede rv" style="--d:.18s">${WORK.line}</p>
  </div>
  <div class="rail" data-rail>
    <ol class="rail-track" tabindex="0" aria-label="${esc(WORK.aria)}, scrolls sideways">
      ${FEATURED.map(railItem).join('\n      ')}
    </ol>
    <div class="wrap rail-ui">
      <span class="rail-prog" aria-hidden="true"><i></i></span>
      <span class="rail-count" aria-hidden="true"><b>01</b> / ${String(FEATURED.length).padStart(2, '0')}</span>
      <span class="rail-btns">
        <button class="rail-b rail-prev" type="button" aria-label="Previous look" disabled><span aria-hidden="true">&larr;</span></button>
        <button class="rail-b rail-next" type="button" aria-label="Next look"><span aria-hidden="true">&rarr;</span></button>
      </span>
    </div>
  </div>
  <div class="wrap looks-act rv">
    <a class="btn" href="${href(S, 'portfolio')}">${WORK.all}</a>
    <a class="lnk" href="${L.ig}" rel="external">${PORTFOLIO_PAGE.ig} ${arrow}</a>
  </div>
</section>`;

const night = () => `<section class="night" id="night" aria-labelledby="night-h">
  <div class="night-pic rv-im">${pic('wedding-night', { sizes: '(max-width:899px) 100vw, 62vw', pos: '76% 50%' })}<i class="tulle tulle--night" aria-hidden="true"></i></div>
  <div class="night-txt">
    ${kick(BRIDAL.kick, 'rv')}
    <h2 class="disp night-h" id="night-h"><span class="ln rv-line"><span>${FINAL.heading[0]}</span></span> <span class="ln rv-line" style="--d:.14s"><span>${foil(FINAL.heading[1])}</span></span></h2>
    <p class="night-line rv" style="--d:.22s">${BRIDAL.sub}</p>
    <div class="night-act rv" style="--d:.3s">${inquire(S, 'Bridal inquiry', 'btn btn--light')}${book('bridal-services', `Explore Bridal Services ${arrow}`, 'lnk lnk--light')}</div>
  </div>
</section>`;

const path = (p, i) => `<article class="path rv" style="--d:${(i * 0.12).toFixed(2)}s" aria-labelledby="path-${p.key}">
  ${frame(p.plate, { ar: '4/3', sizes: '(max-width:899px) 86vw, 40vw', cls: 'path-fig', alt: '' })}
  <div class="path-txt">
    ${kick(p.kicker)}
    <h3 id="path-${p.key}">${p.title}</h3>
    <p class="path-body">${p.body}</p>
    ${points(p.points)}
    <div class="path-act">
      ${p.key === 'bridal'
        ? `${inquire(S, p.cta, 'btn')}${book('bridal-services', `Explore Bridal Services ${arrow}`, 'lnk')}`
        : book('event', p.cta, 'btn')}
    </div>
    <p class="path-note">${p.note}</p>
  </div>
</article>`;

const booking = () => `<section class="sec book" id="book" aria-labelledby="book-h">
  <div class="wrap chap-head">
    ${kick('Weddings &amp; events', 'rv')}
    ${heading(['Two ways', 'to book.'], { id: 'book-h' })}
    <p class="lede rv" style="--d:.18s">${FINAL.line}</p>
  </div>
  <div class="wrap paths">
    ${PATHS.map(path).join('\n    ')}
  </div>
  <p class="wrap proof rv"><a class="lnk" href="${href(S, 'reviews')}">${FINAL.proof} ${arrow}</a></p>
</section>`;

export const home = () => page({
  path: '',
  title: 'Bridal Hair & Makeup Artist, Orlando + Tampa',
  description: `${SITE.name}, luxury bridal hair and makeup artist across ${SITE.areaLong}: soft glam to full glam, glam waves and real-life-filter skin.`,
  head: `<link rel="preload" as="image" imagesrcset="${srcset(LEAD)}" imagesizes="${HERO_SIZES}" fetchpriority="high">`,
  css: ['home'],
  js: ['home'],
  bodyClass: 'is-home',
  pre: opening(),
  main: `${hero()}
<div class="aisle-wrap" data-aisle>
  <div class="aisle" aria-hidden="true"><i class="aisle-line"></i><i class="aisle-tip"></i></div>
  ${signature()}
  ${looks()}
  ${night()}
  <div class="aisle-end" aria-hidden="true">${pearl('aisle-pearl aisle-pearl--end')}</div>
</div>
${booking()}`,
});
