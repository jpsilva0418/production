/* /demo/amairanymua-01 — The Edit: About, Services and Bridal (the STORY pages).
   Built only from the page kit in shell.mjs (KIT.md) and the facts in site.mjs.
   Styles: assets/edit/pages-story.css. Runtime: assets/edit/pages-story.js (one quiet
   scroll-linked drift on the full-bleed wedding-day picture; nothing else needs script). */
import { SITE, ABOUT, INTRO, SERVICES, PATHS, BRIDAL, FINAL, FILMS, LOOKS, href, book, inquire, pic, src, srcset, arrow } from '../site.mjs';
import { page, S, hed, kick, spark, ticks, print, filmPrint, actions, cover, chapter, cta } from './shell.mjs';

const capOf = (k) => (LOOKS.find((x) => x.photo === k) || {}).cap || '';
const n2 = (i) => String(i + 1).padStart(2, '0');
/* the cover print's sizes in shell.mjs, repeated so the preload matches the <img> exactly */
const COVER_SIZES = '(max-width:899px) 80vw, 36vw';
const preload = (k) => `<link rel="preload" as="image" href="${src(k, 800)}" imagesrcset="${srcset(k)}" imagesizes="${COVER_SIZES}" fetchpriority="high">`;

/* ================================================================ ABOUT */

/* "Real-life filter skin. Never cakey." set as a headline: the first sentence heavy, the second italic */
const pullParts = ABOUT.pull.replace(/&[lr]dquo;/g, '').split(/(?<=\.)\s+/);

const story = chapter({
  id: 'story',
  kick: ABOUT.slateStory,
  heading: ['Behind the', 'brushes.'],
  body: `<div class="ab-story">
      <div class="body ab-s1 rv">${ABOUT.story.map((p) => `<p>${p}</p>`).join('')}</div>
      <figure class="ab-pull card card--peach rv-card">
        <span class="ab-q" aria-hidden="true">&ldquo;</span>
        <blockquote><p class="hed hed--l"><span class="hed-a">${pullParts[0]}</span> <em class="hed-b">${pullParts.slice(1).join(' ')}</em></p></blockquote>
        <figcaption class="ab-pull-cap">${spark()}<span>In her words &middot; ${SITE.handle}</span></figcaption>
      </figure>
      <div class="body ab-s2 rv">${ABOUT.story2.map((p) => `<p>${p}</p>`).join('')}</div>
    </div>
    <ul class="ab-facts" data-stag=".1">${ABOUT.facts.map(([k, v]) => `<li class="ab-fact rv"><span class="ab-fact-k">${k}</span><span class="ab-fact-v">${v}</span></li>`).join('')}</ul>`,
});

/* film and stills mixed: a getting-ready reel, her spotlight portrait, a glam reel, a full-glam close-up */
const motion = chapter({
  id: 'motion',
  tone: 'char',
  kick: 'Film and stills',
  heading: [ABOUT.motion.split(' ')[0], `${ABOUT.motion.split(' ').slice(1).join(' ')}.`],
  sub: `Her reels from ${SITE.handle} play here, cut in among the stills.`,
  cls: 'ab-mo',
  body: `<div class="mo-grid">
      <div class="mo-col">
        ${filmPrint('f3', { tilt: 'l', cls: 'rv-card', cap: `Film &middot; ${FILMS.f3.label}`, label: FILMS.f3.label })}
        ${print('glam-sculpt', { tilt: 'r', ratio: '4/5', cls: 'rv-card', sizes: '(max-width:639px) 44vw, 22vw', cap: capOf('glam-sculpt') })}
      </div>
      <div class="mo-col mo-col--b">
        ${print('artist-spotlight-crop', { tilt: 'r', ratio: '1/1', cls: 'rv-card', sizes: '(max-width:639px) 44vw, 22vw', cap: INTRO.caption })}
        ${filmPrint('f2', { tilt: 'l', cls: 'rv-card', cap: `Film &middot; ${FILMS.f2.label}`, label: FILMS.f2.label })}
      </div>
    </div>`,
});

/* three signatures, each with a small pressed-powder pan from the palette */
const BEST_SHADES = ['champagne', 'peach', 'bronze'];
const best = chapter({
  id: 'best',
  tone: 'gulf',
  align: 'center',
  kick: ABOUT.best.kick,
  heading: ABOUT.best.heading,
  sub: ABOUT.best.line,
  body: `<ol class="ab-best" data-stag=".1">${ABOUT.best.items.map(([t, d], i) => `<li class="ab-sig card card--cream rv">
        <span class="ab-pan" style="--c:var(--${BEST_SHADES[i]})" aria-hidden="true"></span>
        <span class="ab-sig-n" aria-hidden="true">${n2(i)}</span>
        <h3 class="hed hed--m">${t}</h3>
        <p class="ab-sig-d">${d}</p>
      </li>`).join('')}</ol>`,
});

export const about = () => page({
  path: 'about',
  title: `About ${SITE.first}`,
  description: `${SITE.name} is a luxury hair and makeup artist based in Florida, working across Orlando and Tampa, who has been doing makeup since 2013 and trained at the Aveda Institute in Winter Park.`,
  head: preload('artist-brushes'),
  css: ['pages-story'],
  bodyClass: 'pg-story',
  main: `${cover({
    kick: ABOUT.kick,
    heading: ABOUT.heading,
    sub: ABOUT.figLine,
    image: { photo: 'artist-brushes', sticker: SITE.handle },
    cls: 'st-cover',
  })}
${story}
${motion}
${best}
${cta({ kick: ABOUT.noteKick, copy: ABOUT.note })}`,
});

/* ================================================================ SERVICES */

const GROUP_HEADS = { weddings: ['For the', 'wedding day.'], events: ['For every', 'occasion.'] };
const GROUP_TONE = { weddings: 'cream', events: 'peach' };

const svcItem = (it, i) => {
  const media = it.film
    ? `<div class="svc-media svc-media--film">
          ${print(it.plate, { tilt: i % 2 ? 'r' : 'l', ratio: '4/5', cls: 'svc-ph rv-card', sizes: '(max-width:899px) 72vw, 34vw', cap: capOf(it.plate) })}
          ${filmPrint(it.film, { tilt: i % 2 ? 'l' : 'r', cls: 'svc-film rv-card', label: FILMS[it.film].label })}
        </div>`
    : `<div class="svc-media">
          ${print(it.plate, { tilt: i % 2 ? 'r' : 'l', ratio: '4/5', cls: 'svc-ph rv-card', sizes: '(max-width:899px) 80vw, 38vw', cap: capOf(it.plate) })}
        </div>`;
  return `<article class="svc${i % 2 ? ' svc--flip' : ''}" id="${it.id}" aria-labelledby="${it.id}-h">
        ${media}
        <div class="svc-copy rv">
          <span class="svc-n" aria-hidden="true">${n2(i)}</span>
          <h3 class="hed hed--l" id="${it.id}-h">${it.title}</h3>
          <p class="lede">${it.summary}</p>
          ${ticks(it.points)}
        </div>
      </article>`;
};

const groupActs = (g) => (g.id === 'weddings'
  ? `<div class="acts">${inquire(S, 'Bridal inquiry', 'btn btn--solid')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--line')}</div>
      <p><a class="lnk" href="${href(S, 'bridal')}">The bridal page ${arrow}</a></p>`
  : `<div class="acts">${book('event', 'Book Event Makeup &amp; Hair', 'btn btn--solid')}${book('schedule', 'Packages and pricing', 'btn btn--line')}</div>`);

const group = (g) => chapter({
  id: g.id,
  tone: GROUP_TONE[g.id],
  kick: g.label,
  heading: GROUP_HEADS[g.id],
  cls: `svc-group svc-group--${g.id}`,
  body: `<div class="svc-list">${g.items.map(svcItem).join('')}</div>
    <div class="svc-acts rv">${groupActs(g)}</div>${g.id === 'events' ? `
    <p class="small svc-price rv">${SERVICES.pricing} ${book('schedule', SERVICES.pricingLink, 'tx')}.</p>` : ''}`,
});

const wayCard = (p) => {
  const bridal = p.key === 'bridal';
  const acts = bridal
    ? `${inquire(S, p.cta, 'btn btn--solid')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--line')}`
    : book('event', p.cta, 'btn btn--solid');
  return `<article class="way card ${bridal ? 'card--peach' : 'card--gulf'} rv-card" aria-labelledby="way-${p.key}-h">
        <div class="way-ph ${bridal ? 'print--l' : 'print--r'}">${pic(p.plate, { sizes: '(max-width:899px) 80vw, 30vw' })}</div>
        <div class="way-copy">
          ${kick(p.kicker, 'cream')}
          <h3 class="hed hed--l" id="way-${p.key}-h">${p.title}</h3>
          <p class="way-body">${p.body}</p>
          ${ticks(p.points)}
          <div class="acts">${acts}</div>
          <p class="small way-note">${p.note}</p>
        </div>
      </article>`;
};

const ways = chapter({
  id: 'ways',
  kick: SERVICES.slateHow,
  heading: ['Which way', 'is yours?'],
  sub: FINAL.line,
  body: `<div class="ways" data-stag=".12">${PATHS.map(wayCard).join('')}</div>`,
});

export const services = () => page({
  path: 'services',
  title: 'Services',
  description: `Bridal hair and makeup, trials and the bridal party, soft glam to full glam, glam waves, events and photoshoots by ${SITE.name} across ${SITE.areaLong}, in studio or on location.`,
  head: preload('bride-gold-waves'),
  css: ['pages-story'],
  bodyClass: 'pg-story',
  main: `${cover({
    kick: SERVICES.kick,
    heading: SERVICES.heading,
    sub: SERVICES.sub,
    actions: `${actions()}
      <nav class="jump" aria-label="On this page">${SERVICES.groups.map((g) => `<a class="jump-a" href="#${g.id}">${spark()}<span>${g.label}</span></a>`).join('')}</nav>`,
    image: { photo: 'bride-gold-waves', sticker: 'Hair, makeup or both' },
    cls: 'st-cover',
  })}
${SERVICES.groups.map(group).join('\n')}
${ways}
${cta({ kick: ABOUT.noteKick, copy: ABOUT.note })}`,
});

/* ================================================================ BRIDAL */

const inqLink = (label) => `<a class="tx" href="${href(S, 'bridal-inquiry')}" data-inquire>${label}</a>`;
const fill = (html) => html
  .replace('{inq}', inqLink('bridal inquiry'))
  .replace('{bridal}', book('bridal-services', 'Bridal services', 'tx'))
  .replace('{event}', book('event', 'its own booking page', 'tx'))
  .replace('{sched}', book('schedule', 'her booking page', 'tx'));

const bridalActs = `<div class="acts">${inquire(S, 'Bridal inquiry', 'btn btn--solid')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--line')}</div>`;

/* what her inquiry form asks, shown as the form's own four steps */
const ask = chapter({
  id: 'asks',
  kick: BRIDAL.ask.kick,
  heading: BRIDAL.ask.heading,
  sub: BRIDAL.ask.line,
  body: `<ol class="asks" aria-label="${BRIDAL.slateAsk}" data-stag=".1">${BRIDAL.ask.steps.map(([t, d], i, all) => `<li class="ask card card--white rv">
        <span class="ask-bars" aria-hidden="true">${all.map((_, j) => `<i${j <= i ? ' class="on"' : ''}></i>`).join('')}</span>
        <span class="ask-k">Step ${i + 1} of ${all.length}</span>
        <h3 class="hed hed--m">${t}</h3>
        <p class="ask-d">${d}</p>
      </li>`).join('')}</ol>
    <div class="asks-go rv">${inquire(S, `Start the bridal inquiry ${arrow}`, 'btn btn--solid')}<p class="small">These are the questions ${SITE.first}’s own bridal inquiry asks.</p></div>`,
});

/* the wedding-day moment: golden hour on the Gulf, edge to edge */
const moment = `<section class="bleed" aria-label="Wedding day">
  <div class="bleed-f" data-drift>${pic('golden-hour', { sizes: '100vw', cls: 'bleed-im', pos: '44% 22%' })}</div>
  <p class="bleed-cap"><span class="sticker sticker--gulf">${capOf('golden-hour')}</span></p>
</section>`;

const collections = chapter({
  id: 'collections',
  tone: 'gulf',
  kick: BRIDAL.collections.kick,
  heading: BRIDAL.collections.heading,
  sub: BRIDAL.collections.line,
  cls: 'colls',
  body: `<ol class="coll-list" aria-label="${BRIDAL.slateCollections}" data-stag=".08">${BRIDAL.collections.names.map((nm, i) => `<li class="coll rv"><span class="coll-n" aria-hidden="true">${n2(i)}</span><span class="coll-t">${nm}</span></li>`).join('')}</ol>
    <p class="coll-note rv">${BRIDAL.collections.note} ${book('schedule', BRIDAL.collections.noteLink, 'tx')}.</p>`,
});

const faq = chapter({
  id: 'faq',
  kick: BRIDAL.slateFaq,
  heading: BRIDAL.faqHeading,
  cls: 'faq',
  body: `<div class="faq-list rv">${BRIDAL.faq.map(([q, a]) => `<details class="qa">
        <summary class="qa-q"><span class="qa-t">${q}</span><span class="qa-m" aria-hidden="true"></span></summary>
        <div class="qa-a"><p>${fill(a)}</p></div>
      </details>`).join('')}</div>`,
});

export const bridal = () => page({
  path: 'bridal',
  title: 'Bridal Hair & Makeup',
  description: `Bridal hair and makeup by ${SITE.name} for the bride and the people getting ready with her across ${SITE.areaLong}, starting with a short bridal inquiry.`,
  head: preload('bride-pearls'),
  css: ['pages-story'],
  js: ['pages-story'],
  bodyClass: 'pg-story',
  main: `${cover({
    kick: BRIDAL.kick,
    heading: BRIDAL.heading,
    sub: BRIDAL.sub,
    actions: bridalActs,
    image: { photo: 'bride-pearls', sticker: capOf('bride-pearls') },
    cls: 'st-cover',
  })}
${ask}
${collections}
${moment}
${faq}
${cta({ kick: BRIDAL.noteKick, copy: BRIDAL.note, heading: ['Tell her about', 'your day.'] })}`,
});
