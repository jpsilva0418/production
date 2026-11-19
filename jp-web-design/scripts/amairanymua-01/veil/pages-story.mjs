/* /demo/amairanymua-01 — site "veil": the story pages (About, Services, Bridal).

   Built from the page kit in shell.mjs, in Veil's manner: centred and ceremonial, tall
   hairline frames, light Cormorant with the second line in italic foil. One device per
   section. A short champagne thread (the home page's aisle, in miniature) runs from each
   title card down to the first chapter's pearl.

   Every fact, link, photograph and film slot comes from ../site.mjs. Page styles live in
   assets/veil/pages-story.css; there is no page script (the FAQ is native <details>). */
import { SITE, ABOUT, SERVICES, PATHS, BRIDAL, FINAL, PORTFOLIO, href, inquire, book, arrow, srcset, pic, esc } from '../site.mjs';
import { page, cover, chapter, cta, frame, filmFrame, actions, points, foil, kick, pearl, rule, lookCap } from './shell.mjs';

const S = 'veil';
const CSS = ['pages-story'];

/** The champagne thread from a title card down to the next chapter's pearl. */
const thread = () => `<div class="st-thread" aria-hidden="true"><i class="rv"></i></div>`;
/** A preload for a page's lead photograph (the LCP), matching the <img>'s own srcset/sizes. */
const preload = (key, sizes) => `<link rel="preload" as="image" imagesrcset="${srcset(key)}" imagesizes="${sizes}" fetchpriority="high">`;

/* =====================================================================
   ABOUT
   ===================================================================== */
const ABOUT_LEAD = 'artist-brushes';
const ABOUT_SIZES = '(max-width:899px) min(88vw, 30rem), 30rem';

/* her line, set as the home page sets it: the first sentence plain, the second in foil */
const PULL = ABOUT.pull.split(/(?<=\.) /);
const aboutStory = () => chapter({
  id: 'story', kick: ABOUT.slateStory, heading: ['Behind', 'the brushes.'],
  body: `<div class="wrap wrap--text st-story">
    <div class="body center">
      ${ABOUT.story.map((p, i) => `<p class="rv" style="--d:${(i * 0.08).toFixed(2)}s">${p}</p>`).join('\n      ')}
    </div>
    <blockquote class="st-pull"><p class="disp"><span class="ln rv-line"><span>${PULL[0]}</span></span> <span class="ln rv-line" style="--d:.14s"><span>${foil(PULL[1])}</span></span></p></blockquote>
    <div class="body center">
      ${ABOUT.story2.map((p, i) => `<p class="rv" style="--d:${(i * 0.08).toFixed(2)}s">${p}</p>`).join('\n      ')}
    </div>
  </div>
  <div class="wrap">
    <dl class="st-facts" data-stag=".1">
      ${ABOUT.facts.map(([k, v]) => `<div class="st-fact rv"><dt class="kick">${k}</dt><dd>${v}</dd></div>`).join('\n      ')}
    </dl>
  </div>`,
});

const aboutMotion = () => chapter({
  id: 'motion', tone: 'satin', kick: 'Photographs and film', heading: ['In', 'motion.'],
  body: `<div class="wrap">
    <div class="st-motion" data-stag=".12">
      ${filmFrame('f3', { ar: '3/4' })}
      ${frame('artist-spotlight-crop', { cap: SITE.name, ar: '3/4', sizes: '(max-width:899px) 44vw, 22vw', pos: '40% 40%' })}
      ${filmFrame('f2', { ar: '3/4' })}
      ${frame('bride-gold-waves', { cap: true, ar: '3/4', sizes: '(max-width:899px) 44vw, 22vw' })}
    </div>
  </div>`,
});

const aboutBest = () => chapter({
  id: 'known', kick: ABOUT.slateBest, heading: ABOUT.best.heading, lede: ABOUT.best.line,
  body: `<div class="wrap">
    <ul class="st-best" data-stag=".12">
      ${ABOUT.best.items.map(([t, d]) => `<li class="rv">${pearl()}<h3>${t}</h3><p>${d}</p></li>`).join('\n      ')}
    </ul>
    <p class="st-more rv"><a class="lnk" href="${href(S, 'portfolio')}">See the portfolio ${arrow}</a></p>
  </div>`,
});

export const about = () => page({
  path: 'about',
  title: `About ${SITE.first}`,
  description: `${SITE.name} is a luxury hair and makeup artist based in Florida, working across Orlando and Tampa, doing makeup since 2013 and trained at the Aveda Institute in Winter Park.`,
  head: preload(ABOUT_LEAD, ABOUT_SIZES),
  css: CSS,
  bodyClass: 'pg-story pg-about',
  main: `${cover({
    kick: ABOUT.kick, heading: ABOUT.heading, sub: ABOUT.figLine, actions: actions(),
    media: frame(ABOUT_LEAD, { cap: ABOUT.figKick, ar: '4/5', eager: true, sizes: ABOUT_SIZES, cls: 'st-portrait' }),
  })}
${thread()}
${aboutStory()}
${aboutMotion()}
${aboutBest()}
${cta({ kick: ABOUT.noteKick, copy: ABOUT.note })}`,
});

/* =====================================================================
   SERVICES
   ===================================================================== */
const svcItem = (it) => {
  const media = it.film
    ? `<div class="svc-media svc-media--pair">
        ${frame(it.plate, { cap: true, ar: '4/5', sizes: '(max-width:899px) 50vw, 24vw' })}
        ${filmFrame(it.film, { ar: '3/4', cls: 'svc-film' })}
      </div>`
    : `<div class="svc-media">${frame(it.plate, { cap: true, ar: '4/5', sizes: '(max-width:899px) min(84vw, 26rem), 26rem' })}</div>`;
  return `<article class="svc" id="${it.id}" aria-labelledby="${it.id}-h">
      ${media}
      <div class="svc-txt rv">
        ${pearl('svc-pearl')}
        <h3 id="${it.id}-h">${it.title}</h3>
        <p class="svc-sum">${it.summary}</p>
        ${points(it.points)}
      </div>
    </article>`;
};

const SVC_HEAD = {
  weddings: { kick: PATHS[0].kicker, heading: ['Bridal hair', '&amp; makeup.'], tone: '' },
  events: { kick: 'Every occasion', heading: ['Events &amp;', 'everyday glam.'], tone: 'satin' },
};
const svcActs = {
  weddings: `${inquire(S, 'Bridal inquiry', 'btn')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--line')}`,
  events: `${book('event', 'Book Event Makeup &amp; Hair', 'btn')}${book('schedule', 'Packages and pricing', 'btn btn--line')}`,
};

const svcGroup = (g) => chapter({
  id: g.id, kick: SVC_HEAD[g.id].kick, heading: SVC_HEAD[g.id].heading, tone: SVC_HEAD[g.id].tone,
  body: `<div class="wrap svc-list">
    ${g.items.map(svcItem).join('\n    ')}
  </div>
  <div class="wrap svc-act rv"><div class="acts">${svcActs[g.id]}</div></div>
  ${g.id === 'events' ? `<p class="wrap small svc-price rv">${SERVICES.pricing} ${book('schedule', SERVICES.pricingLink)}.</p>` : ''}`,
});

const panel = (p) => `<article class="st-path rv" aria-labelledby="sp-${p.key}">
      ${pearl('st-path-pearl')}
      ${kick(p.kicker)}
      <h3 id="sp-${p.key}">${p.title}</h3>
      ${rule()}
      <p class="st-path-body">${p.body}</p>
      ${points(p.points)}
      <div class="st-path-act">
        ${p.key === 'bridal'
          ? `${inquire(S, p.cta, 'btn')}${book('bridal-services', `Explore Bridal Services ${arrow}`, 'lnk')}`
          : book('event', p.cta, 'btn')}
      </div>
      <p class="st-path-note">${p.note}</p>
    </article>`;

const svcPaths = () => chapter({
  id: 'how', kick: SERVICES.slateHow, heading: ['Two ways', 'to book.'], lede: FINAL.line,
  body: `<div class="wrap st-paths" data-stag=".12">
    ${PATHS.map(panel).join('\n    ')}
  </div>`,
});

export const services = () => page({
  path: 'services',
  title: 'Services',
  description: `Bridal hair and makeup, trials and the bridal party, soft glam to full glam, glam waves and event hair by ${SITE.name}, across ${SITE.areaLong}.`,
  css: CSS,
  bodyClass: 'pg-story pg-services',
  main: `${cover({
    kick: SERVICES.kick, heading: SERVICES.heading, sub: SERVICES.sub,
    actions: actions('', { second: 'Book Event Makeup &amp; Hair' }),
    media: `<nav class="st-index rv" style="--d:.36s" aria-label="On this page">${SERVICES.groups.map((g) => `<a class="lnk" href="#${g.id}">${g.label}</a>`).join('<i aria-hidden="true"></i>')}</nav>`,
  })}
${thread()}
${SERVICES.groups.map(svcGroup).join('\n')}
${svcPaths()}
${cta({ kick: ABOUT.noteKick, copy: ABOUT.note })}`,
});

/* =====================================================================
   BRIDAL
   ===================================================================== */
const BRIDAL_LEAD = 'bride-gold-waves';
const BRIDAL_SIZES = '(max-width:899px) min(80vw, 22rem), 25vw';
/* the full-bleed wedding-day picture: the couple at golden hour, luminous like the site.
   Faces sit at 15-45% down the picture; 14% keeps both heads in the wide crop. */
const BLEED = 'golden-hour';

const side = (key) => frame(key, { ar: '3/4', sizes: '22vw', cls: 'st-trio-side' }).replace(' rv-im"', '"');
const bridalCover = () => cover({
  kick: BRIDAL.kick, heading: BRIDAL.heading, sub: BRIDAL.sub,
  actions: `<div class="acts">${inquire(S, 'Bridal inquiry', 'btn')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--line')}</div>`,
  /* the side frames show only on wide screens; they are unveiled with the trio as a whole
     (pages-story.css), so a frame that is display:none on a phone never waits for a reveal */
  media: `<div class="st-trio rv">
    ${side('bride-crystal')}
    ${frame(BRIDAL_LEAD, { cap: lookCap(BRIDAL_LEAD), ar: '3/4', eager: true, sizes: BRIDAL_SIZES, cls: 'st-trio-mid' })}
    ${side('bride-ruby')}
  </div>`,
});

const bridalAsk = () => chapter({
  id: 'asks', tone: 'satin', kick: BRIDAL.ask.kick, heading: BRIDAL.ask.heading, lede: BRIDAL.ask.line,
  body: `<div class="wrap wrap--narrow">
    <div class="ask rv">
      <p class="ask-t cap">${BRIDAL.slateAsk}</p>
      <dl class="ask-list">
        ${BRIDAL.ask.steps.map(([k, v]) => `<div class="ask-row"><dt>${k}</dt><dd>${v}</dd></div>`).join('\n        ')}
      </dl>
      <div class="ask-act">${inquire(S, 'Start your bridal inquiry', 'btn')}</div>
    </div>
  </div>`,
});

const bridalBleed = () => `<section class="st-bleed" aria-label="${esc(lookCap(BLEED))}">
  <figure class="st-bleed-fig rv-im">
    <span class="frame-im">${pic(BLEED, { sizes: '100vw', pos: '45% 14%' })}<i class="tulle" aria-hidden="true"></i></span>
    <figcaption class="st-bleed-cap"><span class="cap">${lookCap(BLEED)}</span><span class="st-bleed-line">${PORTFOLIO[1].line}</span></figcaption>
  </figure>
</section>`;

const collName = (n) => (/^The /.test(n) ? `<span class="coll-the">The</span> ${n.slice(4)}` : n);
const bridalCollections = () => chapter({
  id: 'collections', kick: BRIDAL.collections.kick, heading: BRIDAL.collections.heading, lede: BRIDAL.collections.line,
  body: `<div class="wrap wrap--narrow">
    <ul class="coll" data-stag=".1">
      ${BRIDAL.collections.names.map((n) => `<li class="rv">${collName(n)}</li>`).join('\n      ')}
    </ul>
    <p class="small coll-note rv">${BRIDAL.collections.note} ${book('schedule', BRIDAL.collections.noteLink)}.</p>
  </div>`,
});

const faqLinks = (a) => a
  .replace('{inq}', `<a href="${href(S, 'bridal-inquiry')}" data-inquire>bridal inquiry</a>`)
  .replace('{bridal}', book('bridal-services', 'Bridal services'))
  .replace('{event}', book('event', 'its own booking page'))
  .replace('{sched}', book('schedule', 'her booking page'));

const bridalFaq = () => chapter({
  id: 'faq', kick: BRIDAL.slateFaq, heading: BRIDAL.faqHeading,
  body: `<div class="wrap wrap--narrow">
    <div class="faq rv">
      ${BRIDAL.faq.map(([q, a]) => `<details class="faq-it"><summary><span class="faq-q">${q}</span><i class="faq-mk" aria-hidden="true"></i></summary><div class="faq-a"><p>${faqLinks(a)}</p></div></details>`).join('\n      ')}
    </div>
  </div>`,
});

export const bridal = () => page({
  path: 'bridal',
  title: 'Bridal Hair & Makeup',
  description: `Bridal hair and makeup by ${SITE.name} for you and the people getting ready with you, across ${SITE.areaLong}, starting with a short bridal inquiry.`,
  head: preload(BRIDAL_LEAD, BRIDAL_SIZES),
  css: CSS,
  bodyClass: 'pg-story pg-bridal',
  main: `${bridalCover()}
${thread()}
${bridalAsk()}
${bridalBleed()}
${bridalCollections()}
${bridalFaq()}
${cta({ kick: BRIDAL.noteKick, copy: BRIDAL.note })}`,
});
