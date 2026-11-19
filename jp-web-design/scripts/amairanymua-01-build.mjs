#!/usr/bin/env node
/* Generates the static pages of /demo/amairanymua-01:

     index.html     the founder's chooser — three directions side by side
     premiere.html  Direction A · night-at-the-movies
     cover.html     Direction B · the magazine cover
     golden.html    Direction C · golden hour

   One set of facts, links and photographs feeds all three, so a correction
   made here lands in every direction. Run:  node scripts/amairanymua-01-build.mjs
   It writes only inside public/demo/amairanymua-01/. Sources and open
   questions: docs/demo-amairanymua-01.md */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'demo', 'amairanymua-01');
const BASE = '/demo/amairanymua-01';
const A = `${BASE}/assets`;
const ORIGIN = 'https://jpsilvadigital.com';

/* Her own booking system, exactly as published on her link page. The site
   only ever links to these; it has no form of its own. */
const L = {
  jot: 'https://form.jotform.com/252119273398160',
  bridal: 'https://amairanymua.as.me/?appointmentType=category:Bridal%20Services',
  event: 'https://amairanymua.as.me/?appointmentType=category:Hair%20%26%2For%20Makeup%20%28%20Travel%2F%20In%20Studio%29',
  sched: 'https://amairanymua.as.me/schedule/bea4d83a',
  ig: 'https://www.instagram.com/amairanymua/',
  mail: 'mailto:amairanysmua@gmail.com',
  ww: 'https://www.weddingwire.com/biz/amairany-mua/cc8a47182a74f929.html',
  knot: 'https://www.theknot.com/marketplace/amairany-mua-kissimmee-fl-2075948',
  google: 'https://g.page/r/CcFKfY0wSWDnEAE/review',
};
const REELS = ['Df8bMz5xqHY', 'Df1_Sa5x_-A', 'DfzagW0xr4O', 'DfrsDQRR7vR', 'DfmicyNxkGj', 'Dfj-Uyaxujl', 'DfhtcQOxcBO', 'DfhY4A8RWH0'];

const DIM = {
  'artist-brushes': [1278, 1624], 'artist-spotlight-crop': [624, 625], 'glam-sculpt': [1304, 1697],
  'bride-gold-waves': [1304, 1723], 'bride-crystal': [1304, 1575], 'wedding-florals': [1304, 1297],
  'wedding-night': [1304, 1617], 'golden-hour': [1296, 1603], 'bride-ruby': [1304, 1515],
  'glam-bronze': [1304, 1739], 'waves-blonde': [1304, 1723], 'bride-pearls': [1304, 1714],
};
const srcset = (k) => k === 'artist-spotlight-crop'
  ? `${A}/img/${k}-480.webp 480w, ${A}/img/${k}-624.webp 624w`
  : `${A}/img/${k}-480.webp 480w, ${A}/img/${k}-800.webp 800w, ${A}/img/${k}-1280.webp 1280w`;
const pic = (k, alt, sizes, o = {}) => {
  const [w, h] = DIM[k];
  const src = k === 'artist-spotlight-crop' ? `${A}/img/${k}-480.webp` : `${A}/img/${k}-800.webp`;
  return `<img src="${src}" srcset="${srcset(k)}" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}"${o.cls ? ` class="${o.cls}"` : ''}${o.attr ? ` ${o.attr}` : ''}${o.eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
};

/* The portfolio. Captions describe the look; nobody is named. */
const LOOKS = [
  { k: 'bride-crystal', c: 'bridal waves', cap: 'Bridal · Glam waves', s: 'the bride', alt: 'Bride with glossy side-swept waves pinned by a crystal clip, a soft pink lip and fluttery lashes, in a beaded strapless gown.' },
  { k: 'bride-pearls', c: 'bridal soft', cap: 'Bridal · Soft glam', s: 'soft glam', alt: 'Bride getting ready by the ocean in a satin robe and pearls, with soft bronzed glam and face-framing waves.' },
  { k: 'glam-sculpt', c: 'full', cap: 'Full glam · Sculpted bronze', s: 'full glam', alt: 'Close-up of a full-glam look: smoky bronze eye, flushed cheek, glossy nude lip and a sleek half-up style.' },
  { k: 'bride-gold-waves', c: 'bridal full waves', cap: 'Bridal · Gold shimmer', s: 'gold shimmer', alt: 'Bride with a gold shimmer eye, glowing skin and long brushed-out waves, wearing gold jewellery and a red and gold embroidered top.' },
  { k: 'waves-blonde', c: 'waves full', cap: 'Glam waves · Smoky eye', s: 'glam waves', alt: 'Half-up blonde glam waves with a soft smoky eye and a glossy lip, photographed beside a window.' },
  { k: 'bride-ruby', c: 'bridal full waves', cap: 'Bridal · Full glam', s: 'full glam', alt: 'Bride with a silver shimmer eye, rose lip and side-swept waves, wearing a jewelled headpiece and a ruby necklace.' },
  { k: 'glam-bronze', c: 'full waves', cap: 'Full glam · Winged liner', s: 'bronzed', alt: 'Bronzed full-glam look with winged liner, lifted lashes and a glossy lip, with long highlighted layers.' },
  { k: 'wedding-florals', c: 'bridal soft', cap: 'Wedding day · Soft glam', s: 'wedding day', alt: 'Newlyweds in white beside a wall of flowers; the bride has pastel pink waves and soft, glowing makeup.' },
  { k: 'golden-hour', c: 'soft', cap: 'Soft glam · Golden hour', s: 'golden hour', alt: 'A couple embracing on the beach at sunset; she wears soft glam with long, smooth hair.' },
  { k: 'wedding-night', c: 'bridal', cap: 'Bridal · After dark', s: 'after dark', alt: 'Bride and groom forehead to forehead at night, her cathedral veil sweeping across the frame in front of an illuminated castle.' },
];
const FILTERS = [['all', 'All looks'], ['bridal', 'Bridal'], ['soft', 'Soft glam'], ['full', 'Full glam'], ['waves', 'Glam waves']];

const SERVICES = [
  ['Bridal hair &amp; makeup', 'Wedding-morning hair, makeup or both, designed around your dress, your features and your timeline.', 'Bridal'],
  ['Bridal trial', 'A preview appointment to design the look together before the day.', 'Bridal'],
  ['Bridal party &amp; family', 'Hair and makeup for the people getting ready beside you, timed so nobody is rushed.', 'Bridal'],
  ['Soft glam to full glam', 'From barely-there to full glam, always on real-life-filter skin that never reads cakey.', 'Bridal · Events'],
  ['Glam waves &amp; event hair', 'Hollywood-style glam waves, updos and polished styling.', 'Bridal · Events'],
  ['Events &amp; photoshoots', 'Glam for the celebration, the night out or the shoot, in studio or on location.', 'Events'],
];
const PACKAGES = ['The Luxe Bride', 'The Signature Soiree', 'The Luxe Gala', 'The Radiant Bride'];

const FAQ = [
  ['How do I book my wedding?', `Start with the <a href="${L.jot}">bridal inquiry form</a>. It asks for your date, ceremony time, getting-ready location and how many people need hair and makeup, so the reply you get is about your day. Already know what you want? <a href="${L.bridal}">Bridal services</a> can be booked directly.`],
  ['Do you offer bridal trials?', 'Yes. Trials are part of the bridal services. Mention yours on the inquiry form and it gets planned around your date.'],
  ['Can you do hair and makeup for my bridal party?', 'Yes. The inquiry form asks how many people are getting ready with you, so the morning can be timed properly.'],
  ['Do you come to me?', 'Appointments are offered both in studio and on location across Orlando and Tampa. For anything further afield, ask on the inquiry form.'],
  ['I\'m not a bride. Can I still book?', `Of course. Event and everyday glam has <a href="${L.event}">its own booking page</a>, with in-studio and travel options.`],
  ['What does &ldquo;real-life filter&rdquo; mean?', 'It is how Amairany describes her skin work: smooth, even and luminous, but still skin. Soft glam or full glam, it should never look cakey.'],
  ['Where can I see pricing?', `Current packages and pricing live on <a href="${L.sched}">her booking page</a>, so they are always up to date.`],
];

const arr = ' <span class="arr" aria-hidden="true">→</span>';
const INQ = `<a class="btn btn--pri" data-book="bridal-inquiry" href="${L.jot}">Inquire About Your Wedding${arr}</a>`;
const LOOKS_BTN = `<a class="btn btn--line" href="#portfolio">See the Looks</a>`;
const BRIDAL_BTN = `<a class="btn btn--line" data-book="bridal-services" href="${L.bridal}">Explore Bridal Services</a>`;
const EVENT_BTN = `<a class="btn btn--pri" data-book="event" href="${L.event}">Book Event Makeup &amp; Hair${arr}</a>`;
const EVENT_LINE = `<a class="btn btn--line" data-book="event" href="${L.event}">Book Event Makeup &amp; Hair</a>`;
const NAV = [['#portfolio', 'Portfolio'], ['#experience', 'Bridal &amp; Events'], ['#services', 'Services'], ['#about', 'About'], ['#reviews', 'Reviews'], ['#faq', 'FAQ']];

/* ---------- the three directions ---------- */
const T = {
  premiere: {
    n: 1, name: 'Première', tag: 'A night at the movies', theme: '#0c0908', intro: 3000, font: 'gloock.woff2',
    blurb: 'Ink black, warm cream and champagne. The page opens on a cinemascope slit across the bride\'s eyes, the frame opens, and her work plays like scenes — film-frame reels, ticket-stub booking, end credits.',
    swatch: ['#0c0908', '#f4eadf', '#dcbd91'],
    hero: 'bride-crystal', heroSizes: '(min-width:960px) 58vw, 100vw', paths: ['bride-ruby', 'waves-blonde'], fin: 'wedding-night',
    pathK: ['Admit one · The bride', 'Admit one · The guest of honor'],
    h: {
      portfolio: ['Scene 01 · The Looks', 'Every look, ready for its close-up.'],
      experience: ['Scene 02 · Choose Your Story', 'Two ways to book.'],
      services: ['Scene 03 · The Glam Menu', 'What&rsquo;s on the call sheet.'],
      about: ['Scene 04 · The Artist', 'Behind the brushes.'],
      reviews: ['Scene 05 · The Reviews', 'Five stars, start to finish.'],
      film: ['Scene 06 · On Film', 'Watch the glam happen.'],
      faq: ['Scene 07 · Before You Book', 'Good questions.'],
      fin: 'Your leading-lady moment starts here.',
    },
  },
  cover: {
    n: 2, name: 'The Cover', tag: 'Her own bridal issue', theme: '#fbf0ea', intro: 2600, font: 'playfair-italic-var.woff2',
    blurb: 'Blush, cream and a berry lip. A camera flash, the photo pulls into focus and her name sets like a magazine masthead. Taped prints for the lookbook, script captions, a spinning &ldquo;secure your wedding day glam&rdquo; stamp.',
    swatch: ['#fbf0ea', '#8a2440', '#f5d9d0'],
    hero: 'bride-pearls', heroSizes: '(min-width:900px) 42vw, 100vw', paths: ['bride-crystal', 'glam-bronze'], fin: 'wedding-florals',
    pathK: ['For the bride', 'For the guest of honor'],
    h: {
      portfolio: ['the lookbook', 'Soft, full &amp; <b>everything</b> in between.'],
      experience: ['pick your moment', 'Bride, or <b>guest of honor?</b>'],
      services: ['the glam menu', 'Pick your <b>glam.</b>'],
      about: ['meet your artist', 'Hi, she&rsquo;s <b>Amairany.</b>'],
      reviews: ['love notes', 'Her brides said <b>five stars.</b>'],
      film: ['get ready with her', 'Straight from <b>the reel.</b>'],
      faq: ['asked &amp; answered', 'The <b>quick</b> answers.'],
      fin: 'Secure your wedding day glam.',
    },
  },
  golden: {
    n: 3, name: 'Golden Hour', tag: 'Warm, luminous, quiet', theme: '#f8f0e7', intro: 2700, font: 'instrument-serif.woff2',
    blurb: 'Her link page&rsquo;s peach and cream with a cocoa ink. The portrait starts in low light and a sunbeam crosses it — the glow-up. Arched frames, a masonry portfolio at the photographs&rsquo; own proportions, generous white space.',
    swatch: ['#f8f0e7', '#2b1c15', '#efc09c'],
    hero: 'glam-sculpt', heroSizes: '(min-width:900px) 430px, 76vw', paths: ['bride-pearls', 'glam-bronze'], fin: 'golden-hour',
    pathK: ['For the bride', 'For the celebration'],
    h: {
      portfolio: ['01 — Portfolio', 'Skin that still looks like <em>skin.</em>'],
      experience: ['02 — The Experience', 'A wedding morning, or a <em>night out.</em>'],
      services: ['03 — Services', 'Hair, makeup, <em>or both.</em>'],
      about: ['04 — Behind the Artistry', 'Amairany <em>Sierra.</em>'],
      reviews: ['05 — Kind Words', 'Rated 5.0 by <em>her brides.</em>'],
      film: ['06 — In Motion', 'See it <em>move.</em>'],
      faq: ['07 — Good to Know', 'Before you <em>book.</em>'],
      fin: 'Let&rsquo;s plan your <em>wedding morning.</em>',
    },
  },
};

const SUB = 'Soft-to-full glam and glam waves for brides and events across Orlando + Tampa. Skin that still looks like skin. Never cakey.';

const heroes = {
  premiere: (t) => `<section class="hero hero--pre" aria-labelledby="hero-t">
  <div class="hero__reel" data-reel="bride-ruby,glam-sculpt,bride-gold-waves" data-base="${A}/img/">${pic(t.hero, LOOKS[0].alt, t.heroSizes, { eager: true, cls: 'hero__img is-on' })}</div>
  <div class="hero__scrim"></div><div class="hero__grain"></div>
  <div class="hero__bar hero__bar--t" aria-hidden="true"></div>
  <div class="hero__bar hero__bar--b" aria-hidden="true"><span>Amairany Sierra presents</span></div>
  <div class="hero__in wrap">
    <p class="hero__credit">Bridal hair &amp; makeup</p>
    <h1 class="hero__t" id="hero-t"><span class="ln"><span style="--i:0">Timeless hair.</span></span><span class="ln"><span style="--i:1"><em>Real-life</em></span></span><span class="ln"><span style="--i:2"><em>filter</em> glam.</span></span></h1>
    <p class="hero__sub">${SUB}</p>
    <div class="hero__act">${INQ}${LOOKS_BTN}</div>
    <p class="hero__meta">Orlando + Tampa · Brides · Events</p>
  </div>
</section>`,
  cover: (t) => `<section class="hero hero--cov" aria-labelledby="hero-t">
  <div class="cov wrap">
    <div class="cov__card">
      ${pic(t.hero, LOOKS[1].alt, t.heroSizes, { eager: true })}
      <div class="cov__flash" aria-hidden="true"></div>
      <p class="cov__issue"><span>The Bridal Issue</span><span>Orlando + Tampa</span></p>
      <h1 class="cov__mast" id="hero-t"><span class="cov__letters" aria-hidden="true">${'Amairany'.split('').map((c, i) => `<i style="--i:${i}">${c}</i>`).join('')}</span><span class="vh">Amairany Sierra — bridal hair and makeup artist, Orlando + Tampa</span></h1>
      <ul class="cov__lines"><li>Inside <b>Soft glam to full glam</b></li><li>Plus <b>Real-life filter skin</b></li></ul>
      <a class="cov__badge" data-book="bridal-inquiry" href="${L.jot}" aria-label="Inquire about your wedding"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><path id="cb" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs><text font-family="'DM Sans',sans-serif" font-size="8.4" font-weight="600" letter-spacing="2.1" fill="currentColor"><textPath href="#cb">SECURE YOUR WEDDING DAY GLAM ✦ </textPath></text></svg><b>Inquire</b></a>
    </div>
    <div class="cov__text">
      <p class="kicker">your hair &amp; makeup artist</p>
      <p class="cov__h">Timeless hair. <b>Real-life-filter</b> glam.</p>
      <p class="hero__sub">${SUB}</p>
      <div class="hero__act">${INQ}${LOOKS_BTN}</div>
      <nav class="cov__toc" aria-label="In this issue"><a href="#portfolio">The Lookbook</a><a href="#experience">Brides &amp; Events</a><a href="#services">The Glam Menu</a><a href="#about">Meet Amairany</a><a href="#reviews">Love Notes</a></nav>
    </div>
  </div>
</section>`,
  golden: (t) => `<section class="hero hero--gol" aria-labelledby="hero-t">
  <div class="gol wrap">
    <div class="gol__media">
      <div class="gol__arch">${pic(t.hero, LOOKS[2].alt, t.heroSizes, { eager: true })}<span class="gol__beam" aria-hidden="true"></span></div>
      <div class="gol__chip gol__chip--a">${pic('bride-crystal', '', '150px')}</div>
      <div class="gol__chip gol__chip--b">${pic('waves-blonde', '', '150px')}</div>
    </div>
    <div class="gol__text">
      <p class="kicker">Amairany Sierra · Orlando + Tampa</p>
      <h1 class="gol__t" id="hero-t"><span class="ln"><span style="--i:0">Real-life filter.</span></span><span class="ln"><span style="--i:1"><em>Never cakey.</em></span></span></h1>
      <p class="hero__sub">Timeless hair and soft-to-full glam for brides, events and photoshoots.</p>
      <div class="hero__act">${INQ}${LOOKS_BTN}</div>
      <p class="gol__proof"><span class="stars" aria-hidden="true">★★★★★</span> <a href="#reviews">5.0 on WeddingWire · 31 reviews</a></p>
    </div>
  </div>
</section>`,
};

const head = (id, [k, t], lede) => `<header class="sec__head rv"><p class="kicker">${k}</p><h2 class="h2" id="${id}-t">${t}</h2>${lede ? `<p class="lede">${lede}</p>` : ''}</header>`;

function page(id) {
  const t = T[id];
  const gal = LOOKS.map((x, i) => {
    let mod = '', sizes = '(min-width:1100px) 25vw, (min-width:760px) 33vw, 50vw';
    if (id === 'premiere' && i === 0) { mod = ' gal__it--lead'; sizes = '(min-width:760px) 50vw, 100vw'; }
    if (id === 'premiere' && x.k === 'wedding-night') { mod = ' gal__it--pano'; sizes = '100vw'; }
    if (id === 'cover') sizes = '(min-width:1040px) 20vw, (min-width:700px) 33vw, 50vw';
    return `<a class="gal__it${mod}" href="${A}/img/${x.k}-1280.webp" data-c="${x.c}" data-cap="${x.cap}"><span class="gal__fr">${pic(x.k, x.alt, sizes)}</span><span class="gal__cap">${id === 'cover' ? x.s : x.cap}</span></a>`;
  }).join('\n      ');

  const footTop = id === 'premiere'
    ? `<div class="credits"><p class="credits__t">Amairany Sierra</p><dl>
      <div><dt>Hair &amp; makeup</dt><dd>Amairany Sierra</dd></div>
      <div><dt>Based in</dt><dd>Orlando + Tampa, Florida</dd></div>
      <div><dt>Specialties</dt><dd>Soft–full glam · Glam waves · Luxury bridal</dd></div>
      <div><dt>Instagram</dt><dd><a href="${L.ig}">@amairanymua</a></dd></div>
      <div><dt>Email</dt><dd><a href="${L.mail}">amairanysmua@gmail.com</a></dd></div>
      <div><dt>Bookings</dt><dd><a href="${L.jot}">Bridal inquiry</a> · <a href="${L.event}">Event glam</a></dd></div>
    </dl></div>`
    : `<p class="foot__mark">Amairany Sierra</p><p class="foot__tag">Luxury hair + makeup · Orlando + Tampa, Florida</p>
    <nav class="foot__links" aria-label="Contact and booking"><a href="${L.ig}">Instagram @amairanymua</a><a href="${L.mail}">amairanysmua@gmail.com</a><a href="${L.jot}">Bridal inquiry</a><a href="${L.bridal}">Bridal services</a><a href="${L.event}">Event glam</a></nav>`;

  return `<!doctype html>
<html lang="en" class="t-${id}" data-intro="${t.intro}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Amairany Sierra — Bridal Hair &amp; Makeup, Orlando + Tampa · design preview</title>
<meta name="description" content="Design preview for Amairany Sierra (@amairanymua): soft-to-full glam, real-life-filter skin and glam waves for brides and events in Orlando + Tampa. Not the official website.">
<meta name="theme-color" content="${t.theme}">
<meta property="og:type" content="website">
<meta property="og:title" content="Amairany Sierra — Bridal Hair &amp; Makeup · design preview">
<meta property="og:description" content="A website concept for @amairanymua by JP Silva Digital.">
<meta property="og:image" content="${ORIGIN}${A}/img/og.jpg">
<link rel="icon" type="image/svg+xml" href="${A}/img/favicon.svg">
<link rel="preload" as="image" href="${A}/img/${t.hero}-800.webp" imagesrcset="${srcset(t.hero)}" imagesizes="${t.heroSizes}" fetchpriority="high">
<link rel="preload" as="font" type="font/woff2" href="${A}/fonts/${t.font}" crossorigin>
<link rel="stylesheet" href="${A}/css/core.css">
<link rel="stylesheet" href="${A}/css/${id}.css">
<script>(function(){var d=document.documentElement;d.classList.add('js');try{var k='am01-intro-${id}',rm=matchMedia('(prefers-reduced-motion: reduce)').matches,sd=navigator.connection&&navigator.connection.saveData;if(!rm&&!sd&&(/[?&]intro=1/.test(location.search)||!sessionStorage.getItem(k))){d.classList.add('intro-play');sessionStorage.setItem(k,'1')}}catch(e){}setTimeout(function(){if(!window.__am01)d.classList.add('rv-all')},3000)})();</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<p class="flag">Design preview · not the official site · <a href="${BASE}">${t.n} of 3</a></p>
${id === 'premiere' ? '<div class="prog" aria-hidden="true"></div>' : ''}
<header class="nav" id="top">
  <a class="brand" href="#top" aria-label="Amairany Sierra, hair and makeup — top of page"><b>Amairany Sierra</b><small>Hair &amp; Makeup</small></a>
  <nav class="nav__links" aria-label="Sections">${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</nav>
  <div class="nav__r"><a class="btn btn--pri btn--sm" data-book="bridal-inquiry" href="${L.jot}" aria-label="Inquire about your wedding">Inquire</a><button class="nav__burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu"><i></i></button></div>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="menu__top"><span class="brand"><b>Amairany Sierra</b></span><button class="menu__x" type="button" data-close aria-label="Close menu">×</button></div>
  <nav class="menu__links" aria-label="Sections">${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</nav>
  <div class="menu__act">${INQ}${EVENT_LINE}</div>
</div>

<main id="main">
${heroes[id](t)}

<div class="mq" aria-hidden="true"><div class="mq__track">${'<span>Soft glam</span><span>Full glam</span><span>Real-life filter skin</span><span>Never cakey</span><span>Glam waves</span><span>Luxury bridal</span><span>Events</span><span>Photoshoots</span>'.repeat(2)}</div></div>

<section class="sec" id="portfolio" aria-labelledby="portfolio-t">
  <div class="wrap">
    ${head('portfolio', t.h.portfolio, 'Real clients, real skin. Tap any look to see it full screen.')}
    <div class="chips" role="group" aria-label="Filter the looks">${FILTERS.map(([f, l], i) => `<button class="chip" type="button" data-f="${f}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>
    <p class="vh" id="gal-live" aria-live="polite"></p>
    <div class="gal rv" id="gal">
      ${gal}
    </div>
    <div class="cta-row rv">${INQ}<a class="tlink" href="${L.ig}">More on Instagram @amairanymua</a></div>
  </div>
</section>

<section class="sec sec--alt" id="experience" aria-labelledby="experience-t">
  <div class="wrap">
    ${head('experience', t.h.experience, 'Weddings and events are booked separately, so each gets the right questions.')}
    <div class="paths">
      <article class="path path--a rv">
        <div class="path__img">${pic(t.paths[0], '', '(min-width:820px) 50vw, 100vw')}</div>
        <div class="path__body">
          <p class="path__k">${t.pathK[0]}</p>
          <h3 class="path__t">The Bridal Experience</h3>
          <ul class="path__list"><li>Bridal packages and custom luxury experiences, tailored to you</li><li>Hair, makeup or both, for you and your party</li><li>Trial appointments to design the look first</li></ul>
          <div class="path__act">${INQ}${BRIDAL_BTN}</div>
        </div>
      </article>
      <article class="path path--b rv" style="--d:.12s">
        <div class="path__img">${pic(t.paths[1], '', '(min-width:820px) 50vw, 100vw')}</div>
        <div class="path__body">
          <p class="path__k">${t.pathK[1]}</p>
          <h3 class="path__t">Event &amp; Everyday Glam</h3>
          <ul class="path__list"><li>Soft glam to full glam</li><li>Glam waves and event hair</li><li>In studio or on location</li></ul>
          <div class="path__act">${EVENT_BTN}</div>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="sec" id="services" aria-labelledby="services-t">
  <div class="wrap">
    ${head('services', t.h.services, 'À la carte services, bridal packages and custom bridal experiences.')}
    <ul class="svc rv">
      ${SERVICES.map(([n, d, g]) => `<li class="svc__it"><h3 class="svc__n">${n}</h3><p class="svc__d">${d}</p><p class="svc__tag">${g}</p></li>`).join('\n      ')}
    </ul>
    <p class="note rv">Bridal collections currently on Amairany&rsquo;s booking page:</p>
    <ul class="pk rv">${PACKAGES.map((p) => `<li>${p}</li>`).join('')}</ul>
    <p class="note rv">What each one includes, and current pricing, is always live on <a href="${L.sched}">her booking page</a>.</p>
    <div class="cta-row rv">${INQ}${EVENT_LINE}</div>
  </div>
</section>

<section class="sec sec--alt" id="about" aria-labelledby="about-t">
  <div class="wrap about">
    <div class="about__media rv">
      <div class="about__main">${pic('artist-brushes', 'Amairany Sierra holding a fan of makeup brushes toward the camera.', '(min-width:900px) 40vw, 90vw')}</div>
      <div class="about__sub">${pic('artist-spotlight-crop', 'Amairany Sierra in a studio spotlight, hair in a sculpted updo with face-framing curls.', '180px')}</div>
    </div>
    <div class="about__body">
      ${head('about', t.h.about)}
      <p class="rv">Amairany Sierra is a luxury hair and makeup artist based in Florida, working across Orlando and Tampa. She has been doing makeup since 2013 and trained at the Aveda Institute in Winter Park, graduating in 2018.</p>
      <p class="rv">Her signature is what she calls real-life-filter skin: complexion work that looks like skin in person and in photographs, never cakey. From there the look goes wherever you want it — soft glam, full glam, glam waves.</p>
      <p class="rv">Wedding mornings are her focus: close attention to detail, and a calm room while you get ready.</p>
      <dl class="facts rv"><div><dt>Doing makeup since</dt><dd>2013</dd></div><div><dt>Trained at</dt><dd>Aveda Institute</dd></div><div><dt>Based in</dt><dd>Orlando + Tampa</dd></div></dl>
      <div class="cta-row rv">${INQ}</div>
    </div>
  </div>
</section>

<section class="sec" id="reviews" aria-labelledby="reviews-t">
  <div class="wrap">
    ${head('reviews', t.h.reviews, 'Read them where they were written.')}
    <div class="revs">
      <a class="rev rv" href="${L.ww}"><span class="rev__score">5.0</span><span class="stars" aria-hidden="true">★★★★★</span><span class="rev__src">WeddingWire</span><span class="rev__meta">31 reviews</span><span class="rev__go">Read on WeddingWire</span></a>
      <a class="rev rv" style="--d:.08s" href="${L.knot}"><span class="rev__score">5.0</span><span class="stars" aria-hidden="true">★★★★★</span><span class="rev__src">The Knot</span><span class="rev__meta">4 reviews</span><span class="rev__go">Read on The Knot</span></a>
      <a class="rev rv" style="--d:.16s" href="${L.google}"><span class="rev__score">♡</span><span class="stars" aria-hidden="true">Love notes</span><span class="rev__src">Google</span><span class="rev__meta">Worked with Amairany?</span><span class="rev__go">Leave a love note</span></a>
    </div>
    <p class="note rv">Ratings and review counts as shown on each site on November 18, 2026.</p>
  </div>
</section>

<section class="sec sec--alt" id="film" aria-labelledby="film-t">
  <div class="wrap">
    ${head('film', t.h.film, 'Reels from @amairanymua. Tap one to play it here, or open it on Instagram.')}
    <div class="reels rv">
      ${REELS.map((r, i) => `<a class="reel" href="https://www.instagram.com/amairanymua/reel/${r}/" data-id="${r}" aria-label="Play reel ${i + 1} from @amairanymua"><span class="reel__n">Reel ${String(i + 1).padStart(2, '0')}</span><span class="reel__play" aria-hidden="true"></span><span class="reel__t">@amairanymua</span></a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="sec" id="faq" aria-labelledby="faq-t">
  <div class="wrap">
    ${head('faq', t.h.faq)}
    <div class="faq rv">
      ${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p class="faq__a">${a}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="fin" aria-labelledby="fin-t">
  <div class="fin__bg">${pic(t.fin, '', '100vw', { attr: 'data-par' })}</div>
  <div class="fin__in wrap">
    <h2 class="fin__t rv" id="fin-t">${t.h.fin}</h2>
    <p class="rv">Tell Amairany your date, your vision and who is getting ready with you.</p>
    <div class="hero__act rv">${INQ}${EVENT_LINE}</div>
  </div>
</section>
</main>

<footer class="foot">
  <div class="wrap">
    ${footTop}
    <p class="foot__fine">Design preview by JP Silva Digital for Amairany Sierra. This is a concept, not her official website. Photography from @amairanymua, shown with her permission. Booking buttons open her own inquiry form and scheduling pages. The wordmark is concept styling, not an official logo. <button type="button" data-replay="am01-intro-${id}">Replay the opening</button> · <a href="${BASE}">See all three directions</a></p>
  </div>
</footer>

<div class="dock"><a class="btn btn--pri" data-book="bridal-inquiry" href="${L.jot}">Inquire · Wedding</a><a class="btn btn--line" data-book="event" href="${L.event}">Event Glam</a></div>

<dialog class="lb" aria-label="Portfolio viewer"><div class="dlg"><button class="dlg__x" type="button" aria-label="Close">×</button><img class="lb__img" alt=""><div class="lb__bar"><button class="lb__p" type="button" aria-label="Previous look">←</button><p class="lb__cap"><span class="lb__t"></span><span class="lb__n"></span></p><button class="lb__nx" type="button" aria-label="Next look">→</button></div></div></dialog>
<dialog class="rd" aria-label="Instagram reel"><div class="dlg"><button class="dlg__x" type="button" aria-label="Close">×</button><div class="rd__frame"></div><a class="rd__open" href="${L.ig}">Open on Instagram</a></div></dialog>
<script src="${A}/js/site.js" defer></script>
</body>
</html>
`;
}

function chooser() {
  const cards = Object.entries(T).map(([id, t]) => `<a class="card" href="${BASE}/${id}">
      <span class="card__img">${pic(t.hero, '', '(min-width:900px) 30vw, 92vw')}</span>
      <span class="card__body"><span class="card__k">Direction ${'ABC'[t.n - 1]} · ${t.tag}</span><span class="card__t">${t.name}</span><span class="card__p">${t.blurb}</span>
      <span class="card__sw">${t.swatch.map((c) => `<i style="background:${c}"></i>`).join('')}</span><span class="card__go">Open ${t.name} →</span></span></a>`).join('\n    ');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Amairany Sierra — three website directions · design preview</title>
<link rel="icon" type="image/svg+xml" href="${A}/img/favicon.svg">
<meta property="og:title" content="Amairany Sierra — website concept">
<meta property="og:description" content="Three directions by JP Silva Digital. Design preview, not the official website.">
<meta property="og:image" content="${ORIGIN}${A}/img/og.jpg">
<style>
*{box-sizing:border-box}body{margin:0;background:#15110f;color:#f3e9dd;font:400 1rem/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.w{width:min(100% - 40px,1180px);margin:0 auto;padding:clamp(36px,7vw,80px) 0}
.k{font-size:.6875rem;letter-spacing:.2em;text-transform:uppercase;color:#cdb08a;margin:0 0 14px}
h1{font:400 clamp(2.25rem,7vw,4rem)/1.02 Georgia,"Times New Roman",serif;margin:0 0 14px;letter-spacing:-.01em}
.l{max-width:60ch;color:#c9bcae;margin:0 0 clamp(28px,5vw,48px)}
.g{display:grid;gap:18px}@media(min-width:900px){.g{grid-template-columns:repeat(3,1fr)}}
.card{display:flex;flex-direction:column;background:#211a17;border-radius:10px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .3s}
.card:hover{transform:translateY(-4px)}.card:focus-visible{outline:2px solid #dcbd91;outline-offset:3px}
.card__img{display:block;aspect-ratio:4/3;overflow:hidden}.card__img img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.card__body{display:grid;gap:8px;padding:20px 20px 22px}
.card__k{font-size:.6875rem;letter-spacing:.16em;text-transform:uppercase;color:#cdb08a}
.card__t{font:400 1.875rem/1.1 Georgia,serif}.card__p{font-size:.9375rem;color:#c9bcae}
.card__sw{display:flex;gap:6px;margin-top:6px}.card__sw i{width:26px;height:26px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)}
.card__go{margin-top:8px;font-weight:600;font-size:.8125rem;letter-spacing:.12em;text-transform:uppercase}
.f{margin-top:36px;font-size:.8125rem;color:#a99b8d;max-width:70ch}
</style>
</head>
<body>
<main class="w">
  <p class="k">Design preview · not the official site</p>
  <h1>Amairany Sierra, three ways.</h1>
  <p class="l">Same photographs, same booking links, same words about her. Three different worlds to put them in. Open each one on your phone, watch the opening, then pick the direction to finish.</p>
  <div class="g">
    ${cards}
  </div>
  <p class="f">Concepts by JP Silva Digital for Amairany Sierra (@amairanymua). Booking buttons in every direction open her own inquiry form and scheduling pages; nothing here collects or sends anything.</p>
</main>
</body>
</html>
`;
}

for (const id of Object.keys(T)) writeFileSync(join(OUT, `${id}.html`), page(id));
writeFileSync(join(OUT, 'index.html'), chooser());
writeFileSync(join(OUT, 'DEMO.json'), JSON.stringify({
  slug: 'amairanymua-01',
  url: `${ORIGIN}${BASE}`,
  client: 'Amairany Sierra (@amairanymua)',
  pages: ['index', ...Object.keys(T)],
  directions: Object.fromEntries(Object.entries(T).map(([id, t]) => [id, `${t.name} — ${t.tag}`])),
  source: 'jp-web-design/scripts/amairanymua-01-build.mjs',
  shared: 'none — fonts, images, CSS and script all live in this folder',
  note: 'Unlisted design preview — not the official website. noindex. No forms: booking buttons link to the artist\'s own JotForm and Acuity pages.',
}, null, 2) + '\n');
console.log('built', Object.keys(T).length + 1, 'pages in', OUT);
