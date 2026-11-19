/* /demo/amairanymua-01 — The Edit: the home page.
   1 the opening (three swatches, her name stamps in, the peach floods into the hero)
   2 the hero: a story viewer of her looks   3 the ticker   4 the palette (lookbook)
   5 meet her   6 two ways to book   7 proof strip. Styles: assets/edit/home.css; runtime:
   assets/edit/home.js (opening, story, palette). */
import { A, SITE, L, HERO, INTRO, PATHS, FINAL, REVIEWS, MONTAGE, PORTFOLIO, ABOUT, PHOTOS, LOOKS, looksIn, href, book, inquire, pic, film, srcset, src, arrow } from '../site.mjs';
import { page, S, wordmark, hed, kick, spark, pills, ticks, print } from './shell.mjs';

/* ---------------------------------------------------------------- 1 the opening */
/* Decides before anything paints whether the opening plays: motion allowed, Save-Data off,
   not yet played this browser session — or ?intro=1 (always), ?intro=0 (never). A failsafe
   removes the class if home.js has not taken over within 2.5 s. */
const decide = `<script>(function(d){try{var q=location.search,k='am01-intro-edit',s=null;try{s=window.sessionStorage}catch(e){}
var force=/[?&]intro=1(&|$)/.test(q),never=/[?&]intro=0(&|$)/.test(q);
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,sd=navigator.connection&&navigator.connection.saveData;
var seen=false;try{seen=!!(s&&s.getItem(k))}catch(e){}
if(!never&&(force||(!rm&&!sd&&!seen))){d.classList.add('intro');try{s&&s.setItem(k,'1')}catch(e){}
setTimeout(function(){if(!window.__editIntro)d.classList.remove('intro')},2500)}}catch(e){}})(document.documentElement)</script>`;

const opening = `${decide}
<div class="op" id="op" aria-hidden="true">
  <div class="op-bg"></div>
  <div class="op-flood"></div>
  <div class="op-sws">
    <div class="op-sw op-sw1"><i></i></div>
    <div class="op-sw op-sw2"><i></i></div>
    <div class="op-sw op-sw3"><i></i></div>
  </div>
  <div class="op-wm">${wordmark('wm--op')}</div>
</div>`;

/* ---------------------------------------------------------------- 2 the hero: a story */
const lazyAttrs = (html) => html.replace(/ srcset="/, ' data-srcset="').replace(/ src="/, ' data-src="').replace(' loading="lazy"', '');
const beat = (b, i) => {
  if (b.film) {
    return `<div class="st-f st-f--film" data-i="${i}" data-label="${b.label}">${film(b.film, { label: '' })}</div>`;
  }
  const img = pic(b.photo, { sizes: '(max-width:899px) 100vw, (max-height:500px) 30vw, 440px', eager: i === 0 });
  return `<div class="st-f" data-i="${i}" data-label="${b.label}">${i < 2 ? img : lazyAttrs(img)}</div>`;
};

const hero = `<section class="hero f-peach" data-dock-after aria-labelledby="hero-h">
  <div class="hero-in">
    <div class="hero-story">
      <i class="hero-back" aria-hidden="true"></i>
      <div class="story" data-story role="group" aria-roledescription="story" aria-label="${SITE.first}’s looks, one at a time">
        <div class="st-frames">${MONTAGE.map(beat).join('')}</div>
        <div class="st-shade" aria-hidden="true"></div>
        <div class="st-bars" aria-hidden="true">${MONTAGE.map(() => '<span class="st-bar"><i></i></span>').join('')}</div>
        <button class="st-tap st-prev" type="button" aria-label="Previous look"></button>
        <button class="st-tap st-next" type="button" aria-label="Next look"></button>
        <div class="st-top">
          <a class="st-chip" href="${L.ig}" rel="external"><span class="st-chip-p"><span class="st-dot" aria-hidden="true"></span>${SITE.handle}</span></a>
          <span class="st-lbl" aria-hidden="true">${MONTAGE[0].label}</span>
          <button class="st-pause" type="button" aria-pressed="false" aria-label="Pause the story"><span class="st-pi" aria-hidden="true"></span></button>
        </div>
        <p class="sr" aria-live="polite" data-story-status></p>
      </div>
    </div>
    <div class="hero-copy">
      <p class="kick kick--cream hero-kick">${HERO.sub}</p>
      <div class="hero-tag">
        <h1 class="hed hero-h" id="hero-h"><span class="hl"><span class="hl-i">Soft glam to</span></span> <span class="hl"><em class="hl-i">full glam.</em></span></h1>
      </div>
      <p class="hero-line">${HERO.line}</p>
      <div class="acts hero-acts">${inquire(S, 'Bridal inquiry', 'btn btn--solid')}${book('event', 'Book event glam', 'btn btn--line')}</div>
    </div>
  </div>
</section>`;

/* ---------------------------------------------------------------- 3 the ticker */
const WORDS = ['Soft glam', 'Full glam', 'Glam waves', 'Real-life filter skin', 'Never cakey', 'Brides', 'Events', 'Photoshoots'];
const run = () => `<div class="tick-run">${[...WORDS, ...WORDS].map((w) => `<span class="tick-w">${w}</span>${spark()}`).join('')}</div>`;
const ticker = `<div class="tick" aria-hidden="true"><div class="tick-track">${run()}${run()}</div></div>`;

/* ---------------------------------------------------------------- 4 the palette */
const capOf = (k) => (LOOKS.find((x) => x.photo === k) || {}).cap || '';
const PANS = [
  { id: 'bridal', name: 'Bridal', shade: 'champagne', line: PORTFOLIO[0].line, photos: looksIn('bridal').map((x) => x.photo) },
  { id: 'soft', name: 'Soft glam', shade: 'peach', line: ABOUT.best.items[0][1], photos: looksIn('soft').map((x) => x.photo) },
  { id: 'full', name: 'Full glam', shade: 'bronze', line: ABOUT.best.items[1][1], photos: looksIn('full').map((x) => x.photo) },
  { id: 'waves', name: 'Glam waves', shade: 'lip', line: ABOUT.best.items[2][1], photos: looksIn('waves').map((x) => x.photo) },
  { id: 'wedding', name: 'Wedding day', shade: 'gulf', line: PORTFOLIO[1].line, photos: looksIn('wedding').map((x) => x.photo) },
  { id: 'film', name: 'On film', shade: 'charcoal', line: `Her reels from ${SITE.handle} play here. Four slots, clips to come.`, films: ['f1', 'f2', 'f3', 'f4'] },
];
const pan = (p, i) => `<a class="pan pan--${p.shade}" href="#look-${p.id}" id="pan-${p.id}" data-pan="${p.id}" style="--c:var(--${p.shade})"${i === 0 ? ' aria-current="true"' : ''}><span class="pan-dish" aria-hidden="true"></span><span class="pan-n">${p.name}</span></a>`;
const lookPanel = (p, i) => {
  const items = p.films
    ? p.films.map((f) => `<figure class="look-it look-it--film">${film(f, { label: 'Film' })}</figure>`).join('')
    : p.photos.slice(0, 3).map((k, j) => `<figure class="look-it${j === 0 ? ' look-it--big' : ''}"><div class="look-f">${pic(k, { sizes: j === 0 ? '(max-width:899px) 88vw, 34vw' : '(max-width:899px) 44vw, 17vw' })}</div><figcaption>${capOf(k)}</figcaption></figure>`).join('');
  const n = p.films ? p.films.length : p.photos.length;
  return `<section class="look" id="look-${p.id}" data-look="${p.id}" style="--acc:var(--${p.shade})" aria-labelledby="look-${p.id}-h">
      <header class="look-hd">
        <span class="look-sw" aria-hidden="true"></span>
        <div class="look-t"><h3 class="hed hed--m" id="look-${p.id}-h">${p.name}</h3><p class="look-n">${p.films ? `${n} film slots` : `${n} looks`} &middot; shade ${String(i + 1).padStart(2, '0')}</p></div>
      </header>
      <p class="look-line">${p.line}</p>
      <div class="look-grid${p.films ? ' look-grid--film' : ''}">${items}</div>
      <p class="look-more"><a class="lnk" href="${href(S, 'portfolio')}">${p.films ? 'Film in the portfolio' : `See every look in the portfolio`} ${arrow}</a></p>
    </section>`;
};
const palette = `<section class="sec f-cream pal" id="looks" aria-labelledby="looks-h">
  <div class="wrap">
    <header class="sec-hd pal-hd rv">
      ${kick('The lookbook', 'peach')}
      ${hed(['Pick your', 'glam.'], { id: 'looks-h' })}
      <p class="lede">Six shades, six looks. Choose a pan and the lookbook changes with it.</p>
    </header>
    <div class="pal-grid">
      <div class="pal-case rv-card">
        <div class="pal-lid" aria-hidden="true"><span class="pal-brand">${wordmark()}</span><span class="pal-no">The Edit &middot; six shades</span></div>
        <nav class="pal-well" aria-label="Looks" data-pans>${PANS.map(pan).join('')}</nav>
      </div>
      <div class="pal-panels" data-looks>${PANS.map(lookPanel).join('\n    ')}</div>
    </div>
  </div>
</section>`;

/* ---------------------------------------------------------------- 5 meet her */
const meet = `<section class="sec f-gulf meet" id="meet" aria-labelledby="meet-h">
  <div class="wrap meet-in">
    ${print('artist-brushes', { tilt: 'l', ratio: '4/5', sizes: '(max-width:899px) 86vw, 42vw', cls: 'meet-print rv-card', sticker: SITE.handle })}
    <div class="meet-copy">
      <div class="rv">${kick(INTRO.eyebrow, 'cream')}</div>
      <div class="rv" style="--d:.06s">${hed(INTRO.heading, { id: 'meet-h' })}</div>
      <p class="lede meet-lead rv" style="--d:.12s">${INTRO.lead}</p>
      <div class="body meet-body rv" style="--d:.18s">${INTRO.sentences.map((s) => `<p>${s}</p>`).join('')}</div>
      <div class="rv" style="--d:.24s">${pills(INTRO.values)}</div>
      <p class="rv" style="--d:.3s"><a class="btn btn--solid" href="${href(S, 'about')}">${INTRO.more} ${arrow}</a></p>
    </div>
  </div>
</section>`;

/* ---------------------------------------------------------------- 6 two ways to book */
const pathCard = (p) => {
  const bridal = p.key === 'bridal';
  const acts = bridal
    ? `${inquire(S, p.cta, 'btn btn--solid')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--line')}`
    : `${book('event', p.cta, 'btn btn--solid')}`;
  return `<article class="path card ${bridal ? 'card--peach' : 'card--gulf'} rv-card" aria-labelledby="path-${p.key}-h">
      <div class="path-ph${bridal ? ' print--l' : ' print--r'}">${pic(p.plate, { sizes: '(max-width:899px) 80vw, 30vw' })}</div>
      <div class="path-copy">
        ${kick(p.kicker, 'cream')}
        <h3 class="hed hed--l" id="path-${p.key}-h">${p.title}</h3>
        <p class="path-body">${p.body}</p>
        ${ticks(p.points)}
        <div class="acts">${acts}</div>
        <p class="small path-note">${p.note}</p>
      </div>
    </article>`;
};
const ways = `<section class="sec f-cream ways" id="book" aria-labelledby="book-h">
  <div class="wrap">
    <header class="sec-hd rv">
      ${kick(FINAL.label)}
      ${hed(['Bride, or', 'guest&nbsp;of&nbsp;honor?'], { id: 'book-h' })}
      <p class="lede">${FINAL.line}</p>
    </header>
    <div class="ways-grid" data-stag=".12">${PATHS.map(pathCard).join('')}</div>
  </div>
</section>`;

/* ---------------------------------------------------------------- 7 proof */
const proof = `<section class="proof f-cream" aria-labelledby="proof-h">
  <div class="wrap proof-in rv">
    ${hed(REVIEWS.heading, { id: 'proof-h', size: 'l' })}
    <ul class="proof-chips">
      ${REVIEWS.sites.map((s) => `<li><a class="proof-chip" href="${href(S, 'reviews')}"><span class="proof-s">${s.score}</span><span class="proof-stars" aria-hidden="true">${spark()}${spark()}${spark()}${spark()}${spark()}</span><span class="proof-n">${s.name} &middot; ${s.meta}</span>${arrow}</a></li>`).join('')}
    </ul>
    <p class="small proof-date">Ratings and review counts as shown on each site on ${SITE.ratingsAsOf}.</p>
  </div>
</section>`;

export const home = () => page({
  path: '',
  title: 'Bridal Hair & Makeup Artist, Orlando + Tampa',
  description: `${SITE.name}, luxury bridal hair and makeup artist in ${SITE.areaLong}: soft glam to full glam, glam waves and real-life-filter skin.`,
  head: `<link rel="preload" as="image" href="${src('bride-crystal', 800)}" imagesrcset="${srcset('bride-crystal')}" imagesizes="(max-width:899px) 100vw, (max-height:500px) 30vw, 440px" fetchpriority="high">`,
  css: ['home'],
  js: ['home'],
  bodyClass: 'home',
  pre: opening,
  main: `${hero}
${ticker}
${palette}
${meet}
${ways}
${proof}`,
});
