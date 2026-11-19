/* /demo/amairanymua-01 — HOME. Short, in the family's order (ported from the Sass by Kass
   Home component):
     ① the opening (hero.mjs: one composition per direction, pinned while the page rises over it)
     ② About Amairany, the curved card directly beneath the opening
     ③ the portfolio selection: a swipeable track of photographs with a film among them,
        a three-column grid on wide screens
     ④ the two ways to book (Kass's home ends on her makeup recommendations; Amairany's
        ends on the two destinations: the on-site bridal inquiry and her event booking page)
     then the footer. Reviews, services and the full portfolio live on their own pages.

   Every word and address comes from site.mjs. Styles: assets/css/home.css. Behaviour (the
   progress bar, the pinned hero's cover state, the easing curves, the carousel):
   assets/js/home.js. */
import { page } from './layout.mjs';
import { DIRS, SITE, L, INTRO, WORK, FEATURED, PATHS, FINAL, href, pic, tile, book, inquire } from './site.mjs';
import { hero, heroHead, heroCss, heroJs } from './hero.mjs';

/* ② About: the chapter card that rises over the pinned hero */
const about = (d) => `<section class="c7-ch c7-ch--first" id="about" data-chapter="about" data-tone="light" data-curve>
  <div class="c7-light" aria-hidden="true"><i class="lx-shaft"></i></div>
  <div class="wrap c7-mis">
    <div class="c7-mis-t">
      <h2 class="disp c7-mis-h rv" style="--d:.06s">${INTRO.heading[0]} <span class="ital">${INTRO.heading[1]}</span></h2>
      <p class="kick rv" style="--d:.1s">${INTRO.eyebrow}</p>
      <p class="c7-mis-s c7-mis-s--lead rv" style="--d:.16s">${INTRO.lead}</p>
      ${INTRO.sentences.map((s, i) => `<p class="c7-mis-s rv" style="--d:${(0.28 + i * 0.12).toFixed(2)}s">${s}</p>`).join('\n      ')}
      <div class="c7-mis-foot fade" style="--d:.62s">
        <ul class="c7-vals" aria-label="Looks">${INTRO.values.map((v) => `<li>${v}</li>`).join('')}</ul>
        <a class="tlk" href="${href(d, 'about')}">${INTRO.more}</a>
      </div>
    </div>
    <figure class="c7-mis-f">
      <div class="ph ph--framed rv-im" style="--d:.2s">${pic('artist-brushes', { cls: 'lv lv--rise', sizes: '(max-width:899px) 90vw, 520px' })}<i class="grain" aria-hidden="true"></i></div>
      <figcaption class="fade" style="--d:.3s">${INTRO.caption}</figcaption>
    </figure>
  </div>
</section>`;

/* ③ Portfolio: prev / next / dots sit over a native scroll-snap track, so it swipes with
      or without script; the controls are only shown when script is there to drive them */
const work = (d) => `<section class="c7-care c7-work" id="portfolio" data-chapter="portfolio" data-tone="light">
  <div class="wrap c7-care-h">
    <div>
      <p class="kick rv" style="--d:.04s">${WORK.label}</p>
      <h2 class="disp rv" style="--d:.08s">${WORK.heading[0]}<br><span class="ital">${WORK.heading[1]}</span></h2>
    </div>
    <p class="ital c7-care-line rv" style="--d:.12s">${WORK.line}</p>
  </div>
  <div class="c7-seq">
    <ul class="c7-trk c7-trk--work fade" id="c7Trk" tabindex="0" aria-label="${WORK.aria}">
      ${FEATURED.map((item, i) => `<li class="c7-pn c7-pn--tile" style="--i:${i}">${tile(item, { sizes: '(max-width:899px) 82vw, 400px' })}</li>`).join('\n      ')}
    </ul>
    <div class="c7-ctl">
      <div class="c7-dots" role="group" aria-label="Go to item">
        ${FEATURED.map((_, i) => `<button type="button" class="c7-dot" data-go="${i}" aria-label="Item ${i + 1} of ${FEATURED.length}"${i === 0 ? ' aria-current="true"' : ''}><i></i></button>`).join('')}
      </div>
      <div class="c7-arrows">
        <button type="button" class="c7-arr" id="c7Prev" aria-label="Previous">&larr;</button>
        <button type="button" class="c7-arr" id="c7Next" aria-label="Next">&rarr;</button>
      </div>
    </div>
  </div>
  <div class="wrap c7-work-foot fade"><a class="btn btn--line" href="${href(d, 'portfolio')}">${WORK.all}</a><a class="tlk" href="${L.ig}" rel="external">More on Instagram ${SITE.handle}</a></div>
</section>`;

/* ④ Two ways to book. Weddings lead: the bridal card carries the solid action.
      Her photographs are close portraits, so each card's plate is framed from just above the
      hairline (PHOTOS' own focal point centres the face, which would crop the forehead here). */
const PLATE_POS = { 'bride-ruby': '52% 17%', 'glam-bronze': '50% 18%' };
const path = (d, p) => {
  const bridal = p.key === 'bridal';
  const act = bridal
    ? `${inquire(d, p.cta)}${book('bridal-services', 'Explore Bridal Services', 'tlk')}`
    : book('event', p.cta, 'btn btn--line');
  return `<article class="c7-path${bridal ? ' c7-path--bridal' : ''} fade">
        <div class="ph c7-path-ph">${pic(p.plate, { alt: '', sizes: '(max-width:819px) 90vw, 600px', pos: PLATE_POS[p.plate] })}<i class="grain" aria-hidden="true"></i></div>
        <div class="c7-path-b">
          <span class="caps-xs">${p.kicker}</span>
          <h3>${p.title}</h3>
          <p>${p.body}</p>
          <ul>${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
          <div class="c7-path-act">${act}</div>
          <span class="c7-path-note">${p.note}</span>
        </div>
      </article>`;
};
const bookChapter = (d) => `<section class="c7-ch c7-after c7-paths" id="book" data-chapter="book" data-tone="light" data-curve aria-labelledby="c7BookH">
  <div class="wrap">
    <header class="c7-paths-h">
      <p class="kick kick--c rv">${FINAL.label}</p>
      <h2 class="disp rv" id="c7BookH" style="--d:.06s">${FINAL.heading[0]}<br><span class="ital">${FINAL.heading[1]}</span></h2>
      <p class="c7-paths-line fade" style="--d:.1s">${FINAL.line}</p>
    </header>
    <div class="c7-dual" data-stag=".1">
      ${PATHS.map((p) => path(d, p)).join('\n      ')}
    </div>
    <p class="c7-paths-proof fade"><a class="tlk" href="${href(d, 'reviews')}">${FINAL.proof}</a></p>
  </div>
</section>`;

export const home = (d) => page(d, {
  path: '',
  title: 'Bridal Hair & Makeup Artist, Orlando + Tampa',
  description: `${SITE.name} is a luxury hair and makeup artist for brides and events across ${SITE.area}: soft glam to full glam, glam waves and real-life-filter skin.`,
  home: true,
  headerLight: DIRS[d].heroTone !== 'light',
  css: [...heroCss, 'home'],
  js: [...heroJs, 'home'],
  head: heroHead(d),
  main: `<div class="c7-prog" id="c7Prog" aria-hidden="true"></div>

<!-- ① the opening -->
${hero(d)}

<!-- ② About Amairany, directly beneath the opening -->
${about(d)}

<!-- ③ the portfolio selection -->
${work(d)}

<!-- ④ the two ways to book -->
${bookChapter(d)}`,
});
