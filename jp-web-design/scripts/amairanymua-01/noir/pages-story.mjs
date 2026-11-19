/* /demo/amairanymua-01 — site "noir": the story pages (About, Services, Bridal).
   Built only from the page kit in shell.mjs (documented in KIT.md) and the copy in site.mjs.
   Page-specific styles in assets/noir/pages-story.css; no page script (site.js covers reveals
   and lazy films; the FAQ is native <details>). */
import { page, cover, chapter, cta, frame, slate, kick, h, actions, S } from './shell.mjs';
import {
  SITE, INTRO, ABOUT, SERVICES, PATHS, BRIDAL, FINAL, FILMS, LOOKS,
  href, inquire, book, pic, src, srcset, film, arrow,
} from '../site.mjs';

const pad = (n) => String(n).padStart(2, '0');
const preload = (key, sizes, w = 800) =>
  `<link rel="preload" as="image" href="${src(key, w)}" imagesrcset="${srcset(key)}" imagesizes="${sizes}" fetchpriority="high">`;
const capOf = (k) => (LOOKS.find((x) => x.photo === k) || {}).cap || '';
/* A title split for the roman/italic mix: before "&amp;" or after " to ", else before the last word. */
const split = (t) => {
  if (t.includes(' &amp; ')) { const i = t.indexOf(' &amp; '); return [t.slice(0, i), t.slice(i + 1)]; }
  if (t.includes(' to ')) { const i = t.lastIndexOf(' to ') + 4; return [t.slice(0, i - 1), t.slice(i)]; }
  const i = t.lastIndexOf(' ');
  return i > 0 ? [t.slice(0, i), t.slice(i + 1)] : [t, ''];
};

/* =========================== ABOUT =========================== */
const COVER_AB = '(min-width:900px) 40vw, 84vw';

const aboutCover = () => `<section class="ab-cv" aria-labelledby="abH">
<div class="wrap ab-cv-g">
<div class="ab-cv-txt">
${kick(ABOUT.kick, 'rv')}
${h(1, ABOUT.heading, 'd-xl rv-mask', 'id="abH"')}
<p class="cover-sub rv" style="--d:.15s">${ABOUT.figLine}</p>
<div class="rv" style="--d:.25s">${actions()}</div>
</div>
<figure class="ab-cv-fig rv-fade">
<div class="ab-cv-ph">${pic('artist-brushes', { sizes: COVER_AB, eager: true })}</div>
<figcaption class="slate">${ABOUT.figKick}</figcaption>
</figure>
</div>
</section>`;

const pull = ABOUT.pull.replace('Never cakey.', '<em>Never cakey.</em>');
const aboutStory = () => `<section class="sec ab-st" aria-labelledby="abStH">
<div class="wrap">
<div class="ab-st-g">
${chapter({ kick: ABOUT.slateStory, heading: ['Behind the', 'brushes.'] }).replace('<h2 class', '<h2 id="abStH" class')}
<div class="ab-st-r">
<p class="lead rv">${ABOUT.story[0]}</p>
<p class="body rv" style="--d:.1s">${ABOUT.story[1]}</p>
</div>
</div>
<blockquote class="ab-pull rv-mask"><p>${pull}</p></blockquote>
<div class="ab-st-g">
<p class="slate slate--champ ab-st-k rv">${INTRO.values.join(' &middot; ')}</p>
<div class="ab-st-r body rv">${ABOUT.story2.map((p) => `<p>${p}</p>`).join('')}</div>
</div>
<dl class="ab-facts" data-stag=".1">
${ABOUT.facts.map(([k, v], i) => `<div class="rv"><dt class="slate"><span><b>${pad(i + 1)}</b></span><span class="sep"></span><span>${k}</span></dt><dd>${v}</dd></div>`).join('\n')}
</dl>
</div>
</section>`;

/* In motion: film and stills mixed, four vertical frames like a row of reels */
const MOTION = [
  { film: 'f3' },
  { photo: 'artist-spotlight-crop', cap: SITE.name },
  { film: 'f2' },
  { photo: 'glam-bronze', cap: capOf('glam-bronze') },
];
const aboutMotion = () => `<section class="sec ab-mo" aria-labelledby="abMoH">
<div class="wrap">
${chapter({ kick: 'Film and stills', heading: ['In', 'motion.'] }).replace('<h2 class', '<h2 id="abMoH" class')}
<ul class="ab-mo-g" data-stag=".1">
${MOTION.map((m, i) => `<li class="rv"><figure>${m.film
    ? film(m.film, { label: FILMS[m.film].label, cls: 'ph--vert' })
    : frame(m.photo, { shape: 'vert', sizes: '(min-width:900px) 22vw, 44vw', rv: '' })}<figcaption class="slate"><span><b>${pad(i + 1)}</b> / ${pad(MOTION.length)}</span><span class="sep"></span><span>${m.film ? `Film &middot; ${FILMS[m.film].label}` : m.cap}</span></figcaption></figure></li>`).join('\n')}
</ul>
</div>
</section>`;

const aboutBest = () => `<section class="sec sec--join ab-best" aria-labelledby="abBeH">
<div class="wrap">
<hr class="rule ab-rule">
${chapter({ kick: ABOUT.slateBest, heading: ABOUT.best.heading, lead: ABOUT.best.line, split: true }).replace('<h2 class', '<h2 id="abBeH" class')}
<ol class="ls ab-ls" data-stag=".08">
${ABOUT.best.items.map(([t, d], i) => `<li class="rv"><span class="n">${pad(i + 1)}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join('\n')}
</ol>
<p class="ab-more rv"><a class="lnk" href="${href(S, 'portfolio')}">See her work ${arrow}</a></p>
</div>
</section>`;

export const about = () => page({
  path: 'about',
  title: `About ${SITE.first}`,
  description: `${SITE.name} is a luxury hair and makeup artist based in Florida, working across Orlando and Tampa, who has been doing makeup since 2013 and trained at the Aveda Institute.`,
  head: preload('artist-brushes', COVER_AB),
  css: ['pages-story'],
  bodyClass: 'pg-about',
  main: [aboutCover(), aboutStory(), aboutMotion(), aboutBest(), cta({ kick: ABOUT.noteKick, copy: ABOUT.note })].join('\n'),
});

/* =========================== SERVICES =========================== */
const COVER_SV = '(max-width:899px) 100vw, 58vw';
const items = SERVICES.groups.flatMap((g) => g.items);
const total = items.length;
const GROUP_H = { weddings: ['Bridal hair', '&amp; makeup.'], events: ['Events &amp;', 'everyday glam.'] };
const GROUP_ACTS = {
  weddings: () => `${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--solid')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--line')}`,
  events: () => `${book('event', 'Book Event Makeup &amp; Hair', 'btn btn--solid')}${book('schedule', 'Packages and pricing', 'btn btn--line')}`,
};

const svItem = (it, g, flip) => {
  const n = items.indexOf(it) + 1;
  const [a, b] = split(it.title);
  return `<article class="sv-it${flip ? ' sv-it--flip' : ''}${it.film ? ' sv-it--film' : ''}" id="${it.id}" aria-labelledby="${it.id}-h">
<div class="sv-media">
${frame(it.plate, { shape: 'tall', fade: 'fade-b', sizes: '(min-width:900px) 40vw, 100vw', cls: 'sv-ph' })}
${it.film ? `<div class="sv-film rv" style="--d:.2s">${film(it.film, { label: FILMS[it.film].label, cls: 'ph--vert' })}</div>` : ''}
</div>
<div class="sv-txt">
${slate(`<span><b>${pad(n)}</b> / ${pad(total)}</span><span class="sep"></span><span>${g.label}</span>`, 'rv')}
<h3 class="d-m rv-mask" id="${it.id}-h">${a}${b ? ` <em>${b}</em>` : ''}</h3>
<p class="lead rv" style="--d:.1s">${it.summary}</p>
<ul class="ticks rv" style="--d:.16s">${it.points.map((p) => `<li>${p}</li>`).join('')}</ul>
</div>
</article>`;
};

let flipCount = 0;
const svGroup = (g, gi) => `<section class="sec sv-g${gi ? ' sv-g--2' : ''}" id="${g.id}" aria-labelledby="${g.id}-h">
<div class="wrap">
<header class="sv-gh">
${kick(`<span><b>${pad(gi + 1)}</b> / ${pad(SERVICES.groups.length)}</span><span class="sep"></span><span>${g.label}</span>`, 'rv sv-gk')}
${h(2, GROUP_H[g.id] || split(g.label), 'd-l rv-mask', `id="${g.id}-h"`)}
</header>
<div class="sv-list">
${g.items.map((it) => svItem(it, g, (flipCount++) % 2 === 1)).join('\n')}
</div>
<div class="sv-go rv">
<p class="slate slate--champ">${g.label}</p>
<div class="acts">${GROUP_ACTS[g.id]()}</div>
</div>
${gi === SERVICES.groups.length - 1 ? `<p class="small sv-price rv">${SERVICES.pricing} ${book('schedule', SERVICES.pricingLink, 'tlink')}.</p>` : ''}
</div>
</section>`;

const [PW, PE] = PATHS;
const pathSlate = (p, i, acts) => {
  const [a, b] = split(p.title);
  return `<article class="sv-path rv"${i ? ' style="--d:.12s"' : ''} aria-labelledby="path-${p.key}">
<p class="slate slate--champ"><span><b>${pad(i + 1)}</b> / ${pad(PATHS.length)}</span><span class="sep"></span><span>${p.kicker}</span></p>
<h3 class="d-m" id="path-${p.key}">${a} <em>${b}</em></h3>
<p class="body">${p.body}</p>
<ul class="ticks">${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
<div class="acts">${acts}</div>
<p class="small">${p.note}.</p>
</article>`;
};
const svPaths = () => `<section class="sec sv-paths" aria-labelledby="svPathsH">
<div class="wrap">
${chapter({ kick: SERVICES.slateHow, heading: ['Two ways', 'to book.'], lead: FINAL.line, split: true }).replace('<h2 class', '<h2 id="svPathsH" class')}
<div class="sv-paths-g">
${pathSlate(PW, 0, `${inquire(S, `${PW.cta} ${arrow}`, 'btn btn--solid')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--line')}`)}
${pathSlate(PE, 1, book('event', PE.cta, 'btn btn--solid'))}
</div>
</div>
</section>`;

export const services = () => {
  flipCount = 0;
  return page({
    path: 'services',
    title: 'Services',
    description: `${SITE.name} offers bridal hair and makeup for the wedding day, and soft-to-full glam for events and photoshoots, in ${SITE.area}.`,
    head: preload('bride-gold-waves', COVER_SV),
    css: ['pages-story'],
    bodyClass: 'pg-services',
    main: [
      cover({
        kick: SERVICES.kick, heading: SERVICES.heading, sub: SERVICES.sub, image: 'bride-gold-waves',
        actions: `<div class="acts">${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--solid')}${book('event', 'Book Event Makeup &amp; Hair', 'btn btn--line')}</div>`,
      }),
      ...SERVICES.groups.map(svGroup),
      svPaths(),
      cta({ kick: 'Ready when you are', copy: ABOUT.note }),
    ].join('\n'),
  });
};

/* =========================== BRIDAL =========================== */
const COVER_BR = '(max-width:899px) 100vw, 58vw';

const brAsk = () => `<section class="sec br-ask" aria-labelledby="brAskH">
<div class="wrap">
${chapter({ kick: BRIDAL.ask.kick, heading: BRIDAL.ask.heading, lead: BRIDAL.ask.line, split: true }).replace('<h2 class', '<h2 id="brAskH" class')}
<div class="br-sheet">
<p class="slate slate--champ br-sheet-k">${BRIDAL.slateAsk}<span class="sep"></span>${SITE.first}&rsquo;s bridal inquiry</p>
<ol class="br-steps" data-stag=".08">
${BRIDAL.ask.steps.map(([t, d], i) => `<li class="rv"><p class="slate"><span><b>${pad(i + 1)}</b> / ${pad(BRIDAL.ask.steps.length)}</span></p><h3 class="br-st-t">${t}</h3><p class="br-st-d">${d}</p></li>`).join('\n')}
</ol>
<div class="acts br-sheet-go rv">${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--solid')}</div>
</div>
</div>
</section>`;

/* one full-bleed moment from her wedding-day photographs: after dark, the veil across the frame */
const brMoment = () => `<section class="br-mo" aria-label="Wedding day">
<figure class="br-mo-ph">${pic('wedding-night', { sizes: '100vw', pos: '68% 50%', cls: 'rv-im' })}</figure>
<div class="wrap br-mo-cap">${slate(capOf('wedding-night'), 'slate--bone')}</div>
</section>`;

const brCollections = () => `<section class="sec br-col" aria-labelledby="brColH">
<div class="wrap">
${chapter({ kick: BRIDAL.collections.kick, heading: BRIDAL.collections.heading, lead: BRIDAL.collections.line, split: true }).replace('<h2 class', '<h2 id="brColH" class')}
<ol class="br-names" data-stag=".08">
${BRIDAL.collections.names.map((n, i) => `<li class="rv"><span class="n">${pad(i + 1)}</span><span class="w">${n}</span></li>`).join('\n')}
</ol>
<p class="small br-col-note rv">${BRIDAL.collections.note} ${book('schedule', BRIDAL.collections.noteLink, 'tlink')}.</p>
</div>
</section>`;

const fill = (s) => s
  .replace('{inq}', `<a class="tlink" href="${href(S, 'bridal-inquiry')}">bridal inquiry</a>`)
  .replace('{bridal}', book('bridal-services', 'Bridal services', 'tlink'))
  .replace('{event}', book('event', 'its own booking page', 'tlink'))
  .replace('{sched}', book('schedule', 'her booking page', 'tlink'));

const brFaq = () => `<section class="sec sec--join br-faq" aria-labelledby="brFaqH">
<div class="wrap">
<hr class="rule ab-rule">
<div class="br-faq-g">
${chapter({ kick: BRIDAL.slateFaq, heading: BRIDAL.faqHeading }).replace('<h2 class', '<h2 id="brFaqH" class')}
<div class="br-qs">
${BRIDAL.faq.map(([q, a], i) => `<details class="br-q rv"><summary><span class="n" aria-hidden="true">${pad(i + 1)}</span><span class="q">${q}</span><i aria-hidden="true"></i></summary><div class="br-a"><p>${fill(a)}</p></div></details>`).join('\n')}
</div>
</div>
</div>
</section>`;

export const bridal = () => page({
  path: 'bridal',
  title: 'Bridal Hair & Makeup',
  description: `Bridal hair and makeup by ${SITE.name} for the bride and the people getting ready with her, across ${SITE.area}, starting with a short bridal inquiry.`,
  head: preload('bride-ruby', COVER_BR),
  css: ['pages-story'],
  bodyClass: 'pg-bridal',
  main: [
    cover({
      kick: BRIDAL.kick, heading: BRIDAL.heading, sub: BRIDAL.sub, image: 'bride-ruby',
      actions: `<div class="acts">${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--solid')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--line')}</div>`,
    }),
    brAsk(),
    brMoment(),
    brCollections(),
    brFaq(),
    cta({ kick: BRIDAL.noteKick, heading: ['Tell her about', 'your day.'] /* INQUIRY.heading */, copy: BRIDAL.note, actions: `<div class="acts">${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--solid')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--line')}</div>` }),
  ].join('\n'),
});
