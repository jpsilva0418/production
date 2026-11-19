/* /demo/amairanymua-01 — the single source of facts, links, media and copy.

   Every page module reads from here, so a correction is made once. Rule (the
   same one the Sass by Kass source keeps): nothing here is invented. Every
   fact comes from the table in docs/demo-amairanymua-01.md; where her own
   materials are silent the copy stays neutral, and anything she still has to
   confirm is listed in that document.

   PICK decides what the build writes:
     null             review build — a chooser at the root and one full site
                      per direction under /a, /b and /c, each with a small
                      direction switch in the preview marker
     'a' | 'b' | 'c'  client build — that one direction at the root, no
                      chooser, no switch */
export const PICK = null;

export const SLUG = 'amairanymua-01';
export const BASE = `/demo/${SLUG}`;
export const A = `${BASE}/assets`;
export const ORIGIN = 'https://jpsilvadigital.com';

/* ---------- her booking system, exactly as published on her link page ----------
   The site only ever links to these. Checked by scripts/amairanymua-01-check.mjs:
   every data-book link in every page must equal one of these four. */
export const L = {
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
/* data-book value -> the only address it may carry */
export const BOOK = { 'bridal-form': L.jot, 'bridal-services': L.bridal, event: L.event, schedule: L.sched };

export const SITE = {
  name: 'Amairany Sierra',
  first: 'Amairany',
  handle: '@amairanymua',
  email: 'amairanysmua@gmail.com',
  /* her link page: "Luxury hair and makeup artist based in Florida" */
  tagline: 'Luxury Hair + Makeup',
  role: 'Luxury hair + makeup artist',
  /* her Instagram display name */
  area: 'Orlando + Tampa',
  areaLong: 'Orlando + Tampa, Florida',
  /* the date the ratings on the Reviews page were read */
  ratingsAsOf: 'November 18, 2026',
};

/* ---------- the three directions ----------
   One structure, one set of words and photographs. A direction is a palette
   (assets/css/system.css, body.pal-*) and a hero composition (hero.mjs,
   assets/css/hero.css). `heroTone` tells the header whether the home hero
   under it is dark ('film') or light. */
export const DIRS = {
  a: {
    id: 'a', letter: 'A', name: 'Espresso', full: 'Espresso & Champagne', theme: '#2E1F18', heroTone: 'film',
    hero: 'Full-bleed stills and film',
    blurb: 'Deep espresso, warm cream and the champagne of her shimmer lids. The opening draws her name inside a ring, then the field lifts onto her work in motion, edge to edge: one column on a phone, three on a wide screen.',
    swatch: ['#2E1F18', '#FBF7F2', '#EAD3B3', '#D8B894'],
  },
  b: {
    id: 'b', letter: 'B', name: 'Peach & Cream', full: 'Peach & Cream', theme: '#FFF9F3', heroTone: 'light',
    hero: 'An arched window of stills and film',
    blurb: 'The peach, cream and charcoal of her own link page. A light, airy opening: her name on cream, and her work moving inside an arched frame, with charcoal chapters further down.',
    swatch: ['#FFF9F3', '#F2B894', '#2F2A28', '#F9D9C2'],
  },
  c: {
    id: 'c', letter: 'C', name: 'Rosewood', full: 'Rosewood & Blush', theme: '#5A2A35', heroTone: 'film',
    hero: 'A framed reel beside her name',
    blurb: 'A deep rosewood taken from her rose-nude lip, with blush canvases and champagne-rose accents. Her name sits on the rosewood field beside a tall framed reel, the way a phone holds one.',
    swatch: ['#5A2A35', '#FCF6F4', '#F0D5C4', '#E3B4B4'],
  },
};
export const DIR_IDS = PICK ? [PICK] : Object.keys(DIRS);

/* ---------- addresses ---------- */
export const PAGES = ['', 'about', 'bridal', 'services', 'portfolio', 'reviews', 'bridal-inquiry'];
/** The root of one direction's site: /demo/amairanymua-01/a in review, the demo root once picked. */
export const root = (d) => (PICK ? BASE : `${BASE}/${d}`);
/** An internal address inside one direction. href('a', 'portfolio') -> /demo/amairanymua-01/a/portfolio */
export const href = (d, path = '') => (path ? `${root(d)}/${path}` : root(d));
/** Where a page is written, relative to the demo folder. */
export const outFile = (d, path = '') => `${PICK ? '' : `${d}/`}${path ? `${path}/` : ''}index.html`;

export const NAV = [
  { path: 'about', label: 'About', menu: 'About Amairany', note: 'The artist behind the brushes' },
  { path: 'bridal', label: 'Bridal', menu: 'Bridal', note: 'Your wedding day glam' },
  { path: 'services', label: 'Services', menu: 'Services', note: 'Brides, events, photoshoots' },
  { path: 'portfolio', label: 'Portfolio', menu: 'Portfolio', note: 'Photographs and film' },
  { path: 'reviews', label: 'Reviews', menu: 'Reviews', note: 'Where her clients wrote them' },
  { path: 'bridal-inquiry', label: 'Bridal Inquiry', menu: 'Bridal Inquiry', note: 'Weddings start here', cta: true },
];

/* ---------- helpers ---------- */
export const esc = (s) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/gi, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
/** External links open in the SAME tab (the family rule, from Sass by Kass): a plain https
 *  anchor is the smoothest one-tap handoff inside Instagram's in-app browser. */
export const ext = (h) => (/^https?:/.test(h) ? ' rel="external"' : '');
/** A link into her own booking system. `kind` is a key of BOOK; the address is never typed by hand. */
export const book = (kind, label, cls = '', attrs = '') => {
  if (!BOOK[kind]) throw new Error(`unknown booking link "${kind}"`);
  return `<a${cls ? ` class="${cls}"` : ''} href="${BOOK[kind]}" data-book="${kind}" rel="external"${attrs ? ` ${attrs}` : ''}>${label}</a>`;
};
/** The primary action everywhere: the on-site bridal inquiry. */
export const inquire = (d, label = 'Bridal inquiry', cls = 'btn btn--solid', attrs = '') =>
  `<a class="${cls}" href="${href(d, 'bridal-inquiry')}"${attrs ? ` ${attrs}` : ''}>${label}</a>`;
export const arrow = '<span class="arr" aria-hidden="true">&rarr;</span>';

/* ---------- photographs ----------
   Twelve of her own images (docs: "Photographs"). w/h are the real pixel sizes of the
   -1280 files; `pos` is where the face sits, used as object-position wherever a frame
   crops the picture. Captions describe the look; nobody is named. */
export const PHOTOS = {
  'artist-brushes': { w: 1278, h: 1624, pos: '50% 26%', alt: 'Amairany Sierra holding a fan of makeup brushes toward the camera.' },
  'artist-spotlight-crop': { w: 624, h: 625, pos: '40% 40%', widths: [480, 624], alt: 'Amairany Sierra in a studio spotlight, hair in a sculpted updo with face-framing curls.' },
  'bride-crystal': { w: 1280, h: 1546, pos: '50% 27%', alt: 'Bride with glossy side-swept waves pinned by a crystal clip, a soft pink lip and fluttery lashes, in a beaded strapless gown.' },
  'bride-pearls': { w: 1280, h: 1682, pos: '50% 40%', alt: 'Bride getting ready by the ocean in a satin robe and pearls, with soft bronzed glam and face-framing waves.' },
  'glam-sculpt': { w: 1280, h: 1666, pos: '50% 36%', alt: 'Close-up of a full-glam look: smoky bronze eye, flushed cheek, glossy nude lip and a sleek half-up style.' },
  'bride-gold-waves': { w: 1280, h: 1691, pos: '50% 28%', alt: 'Bride with a gold shimmer eye, glowing skin and long brushed-out waves, wearing gold jewellery and a red and gold embroidered top.' },
  'bride-ruby': { w: 1280, h: 1487, pos: '52% 38%', alt: 'Bride with a silver shimmer eye, rose lip and side-swept waves, wearing a jewelled headpiece and a ruby necklace.' },
  'waves-blonde': { w: 1280, h: 1691, pos: '50% 36%', alt: 'Half-up blonde glam waves with a soft smoky eye and a glossy lip, photographed beside a window.' },
  'glam-bronze': { w: 1280, h: 1707, pos: '50% 40%', alt: 'Bronzed full-glam look with winged liner, lifted lashes and a glossy lip, with long highlighted layers.' },
  'wedding-florals': { w: 1280, h: 1273, pos: '58% 24%', alt: 'Newlyweds in white beside a wall of flowers; the bride has pastel pink waves and soft, glowing makeup.' },
  'golden-hour': { w: 1280, h: 1583, pos: '42% 36%', alt: 'A couple embracing on the beach at sunset; she wears soft glam with long, smooth hair.' },
  'wedding-night': { w: 1280, h: 1587, pos: '60% 52%', alt: 'Bride and groom forehead to forehead at night, her cathedral veil sweeping across the frame in front of an illuminated castle.' },
};
export const srcset = (k) => (PHOTOS[k].widths ?? [480, 800, 1280]).map((w) => `${A}/img/${k}-${w}.webp ${w}w`).join(', ');
export const src = (k, w) => `${A}/img/${k}-${w ?? ((PHOTOS[k].widths ?? [480, 800])[1] ?? 480)}.webp`;
/** An <img> for one of her photographs. `alt: ''` marks it decorative. `pos` overrides the focal point. */
export const pic = (k, { alt, sizes = '(max-width:899px) 90vw, 50vw', cls = '', eager = false, pos, attrs = '' } = {}) => {
  const p = PHOTOS[k];
  if (!p) throw new Error(`photo "${k}" is not in PHOTOS`);
  return `<img src="${src(k)}" srcset="${srcset(k)}" sizes="${sizes}" width="${p.w}" height="${p.h}" alt="${esc(alt ?? p.alt)}"${cls ? ` class="${cls}"` : ''} style="object-position:${pos ?? p.pos}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${attrs ? ` ${attrs}` : ''}>`;
};

/* ---------- film ----------
   No video file exists for this demo yet: the founder is supplying screen recordings of
   her reels. Until a clip is here its place is a MARKED SLOT, never a stand-in video.

   To fill a slot: put <name>.mp4 (H.264, silent, portrait) and <name>.jpg (its poster
   frame) in assets/film/, set `file: '<name>'` below and describe what it shows in
   `alt`. Every place that uses the slot (hero, home, portfolio, services, about) then
   plays the clip. Nothing else changes. */
export const FILMS = {
  f1: { n: 1, file: null, label: 'Bridal', title: 'A bridal reel', pos: '50% 35%', alt: '' },
  f2: { n: 2, file: null, label: 'Full glam', title: 'A glam reel', pos: '50% 35%', alt: '' },
  f3: { n: 3, file: null, label: 'Getting ready', title: 'A getting-ready reel', pos: '50% 35%', alt: '' },
  f4: { n: 4, file: null, label: 'Glam waves', title: 'A glam-waves reel', pos: '50% 35%', alt: '' },
};
export const filmSrc = (id) => (FILMS[id].file ? { mp4: `${A}/film/${FILMS[id].file}.mp4`, poster: `${A}/film/${FILMS[id].file}.jpg` } : null);
/** A 9:16 film tile. With a file: a lazy, muted, looping clip that shows its poster first, loads
 *  near the viewport, rests off screen and stays a still for reduced motion or Save-Data
 *  (assets/js/site.js). Without one: the marked slot. `label` is the small tag in the corner. */
export const film = (id, { label = 'Reel', cls = '' } = {}) => {
  const f = FILMS[id];
  if (!f) throw new Error(`film "${id}" is not in FILMS`);
  const s = filmSrc(id);
  const n = String(f.n).padStart(2, '0');
  if (!s) {
    return `<div class="film film--slot${cls ? ` ${cls}` : ''}" data-film-slot="${id}"><div class="slot" role="img" aria-label="Film slot ${f.n}: ${esc(f.title.toLowerCase())} from ${SITE.handle} will play here."><span class="slot-ic" aria-hidden="true"></span><span class="slot-n" aria-hidden="true">Film ${n}</span><span class="slot-t" aria-hidden="true">${f.title} plays here</span><span class="slot-s" aria-hidden="true">Slot &middot; clip to come</span></div></div>`;
  }
  return `<div class="film${cls ? ` ${cls}` : ''}" data-film-tile><video data-film muted loop playsinline preload="none" poster="${s.poster}" disablepictureinpicture disableremoteplayback tabindex="-1" aria-label="${esc(f.alt || `Silent looping clip: ${f.title.toLowerCase()}.`)}" style="object-position:${f.pos}"><source data-src="${s.mp4}" type="video/mp4"></video><i class="grain" aria-hidden="true"></i>${label ? `<span class="film-lbl" aria-hidden="true">${label}</span>` : ''}</div>`;
};
/** One portfolio tile: a framed photograph or a film. item = { photo, alt?, span? } | { film, span? }.
 *  span: 'tall' | 'wide' | 'big' drives the masonry shape. */
export const tile = (item, { sizes = '(max-width:899px) 82vw, 33vw', label } = {}) => {
  const span = item.span ? ` tile--${item.span}` : '';
  if (item.film) return `<div class="tile tile--film rv-im${span}">${film(item.film, { label: label ?? 'Reel' })}</div>`;
  return `<div class="tile rv-im${span}"><div class="ph tile-ph">${pic(item.photo, { alt: item.alt, sizes })}<i class="grain" aria-hidden="true"></i></div></div>`;
};

/* ====================================================================
   COPY — the single copy source for every page. Her own words are kept
   as she wrote them (link page, Instagram); headlines are proposals.
   ==================================================================== */
export const HERO = {
  label: `${SITE.name} — luxury hair and makeup artist, ${SITE.area}`,
  sub: `${SITE.tagline} &middot; ${SITE.area}`,
  line: 'Soft glam to full glam, glam waves and real-life-filter skin, for brides and events.',
  cta: 'Bridal inquiry',
  second: 'Book event glam',
  cue: `Meet ${SITE.first}`,
};
/* What the hero shows, in order: photographs, with her films cutting in. Each beat names the
   picture, its small title, and the two pictures beside it where a direction shows three. */
export const MONTAGE = [
  { photo: 'bride-crystal', label: 'Bridal', l: 'glam-sculpt', r: 'bride-pearls' },
  { photo: 'glam-sculpt', label: 'Full glam', l: 'bride-gold-waves', r: 'waves-blonde' },
  { film: 'f1', label: 'Bridal', l: 'bride-pearls', r: 'bride-ruby' },
  { photo: 'bride-gold-waves', label: 'Bridal', l: 'glam-bronze', r: 'bride-crystal' },
  { photo: 'bride-pearls', label: 'Soft glam', l: 'waves-blonde', r: 'glam-sculpt' },
  { photo: 'waves-blonde', label: 'Glam waves', l: 'bride-ruby', r: 'bride-gold-waves' },
  { film: 'f2', label: 'Full glam', l: 'bride-crystal', r: 'glam-bronze' },
  { photo: 'bride-ruby', label: 'Bridal', l: 'glam-sculpt', r: 'bride-pearls' },
  { photo: 'glam-bronze', label: 'Full glam', l: 'bride-gold-waves', r: 'waves-blonde' },
];

export const INTRO = {
  eyebrow: `About ${SITE.first}`,
  heading: ['Meet', `${SITE.first}.`],
  lead: `${SITE.name} is a luxury hair and makeup artist based in Florida, working across Orlando and Tampa.`,
  sentences: [
    'Her signature is what she calls real-life-filter skin: complexion work that still looks like skin, in person and in photographs. Never cakey.',
    'From there the look goes wherever you want it: soft glam, full glam, glam waves.',
    'She works with brides and the people getting ready with them, and with clients dressing for events and photoshoots.',
  ],
  values: ['Soft glam', 'Full glam', 'Glam waves'],
  caption: `${SITE.name} &middot; ${SITE.handle}`,
  more: `More about ${SITE.first}`,
};

export const WORK = {
  label: 'Bridal portfolio',
  heading: ['Real skin,', 'real glam.'],
  line: 'Real clients in real light. Swipe through a few favorites, photographs and film, or open the full portfolio.',
  all: 'Open the portfolio',
  aria: `A selection of ${SITE.first}’s work`,
};
/* the home page's swipeable selection: photographs with one film among them */
export const FEATURED = [
  { photo: 'bride-crystal' },
  { film: 'f1' },
  { photo: 'bride-pearls' },
  { photo: 'glam-sculpt' },
  { photo: 'bride-gold-waves' },
  { photo: 'waves-blonde' },
];

/* The two destinations. Weddings lead everywhere. */
export const PATHS = [
  {
    key: 'bridal', kicker: 'Weddings', title: 'The Bridal Experience', plate: 'bride-ruby',
    body: 'For the bride and the people getting ready with her. Start with a short bridal inquiry: your date, your timeline and who needs hair and makeup.',
    points: ['Bridal packages and custom bridal experiences', 'Hair, makeup or both', 'Trial appointments to design the look first'],
    cta: 'Bridal inquiry', note: `A short inquiry here, finished on ${SITE.first}’s own form`,
  },
  {
    key: 'event', kicker: 'Events & everyday glam', title: 'Event Makeup & Hair', plate: 'glam-bronze',
    body: 'Glam for the celebration, the night out or the photoshoot. Choose your service and your time on her booking page.',
    points: ['Soft glam to full glam', 'Glam waves and event hair', 'In studio or on location'],
    cta: 'Book Event Makeup &amp; Hair', note: 'Opens her own booking page',
  },
];
export const FINAL = {
  label: 'Two ways to book',
  /* "Secure your wedding day glam" is her own line, from her link page */
  heading: ['Secure your', 'wedding day glam.'],
  line: 'Weddings start with an inquiry, so the reply you get is about your day. Events book straight onto her calendar.',
  proof: '5.0 on WeddingWire &middot; 31 reviews',
};

export const PORTFOLIO = [
  {
    id: 'bridal', title: 'Bridal', line: 'Soft-to-full glam for the wedding day, on skin that still looks like skin.',
    items: [
      { photo: 'bride-crystal', span: 'big' },
      { film: 'f1', span: 'tall' },
      { photo: 'bride-pearls' },
      { photo: 'bride-gold-waves' },
      { photo: 'bride-ruby', span: 'wide' },
    ],
  },
  {
    id: 'wedding-day', title: 'Wedding day', line: 'The day itself: the portraits, the light, the two of you.',
    items: [
      { photo: 'wedding-florals', span: 'wide' },
      { film: 'f3', span: 'tall' },
      { photo: 'golden-hour' },
      { photo: 'wedding-night' },
    ],
  },
  {
    id: 'glam', title: 'Glam & waves', line: 'Events, photoshoots and nights worth dressing up for.',
    items: [
      { photo: 'glam-sculpt', span: 'big' },
      { film: 'f2', span: 'tall' },
      { photo: 'waves-blonde' },
      { film: 'f4', span: 'tall' },
      { photo: 'glam-bronze' },
    ],
  },
];
export const PORTFOLIO_PAGE = {
  ghost: 'glam',
  kick: 'Portfolio',
  heading: ['Every look,', 'up close.'],
  sub: (n) => `Brides first, then glam and waves. ${n} favorites, photographs and film. Tap a group to jump to it.`,
  noteKick: 'Like what you see?',
  note: 'Getting married? Start a bridal inquiry. Dressing for an event? Choose a time on her calendar.',
  ig: `More on Instagram ${SITE.handle}`,
};

export const BRIDAL = {
  ghost: 'bridal',
  kick: 'The Bridal Experience',
  heading: ['Secure your', 'wedding day glam.'],
  sub: `Bridal hair and makeup for you and the people getting ready with you, across ${SITE.area}. It starts with a short inquiry.`,
  slateAsk: 'What the inquiry asks',
  ask: {
    kick: 'Four short steps',
    heading: ['Start with', 'your day.'],
    line: `${SITE.first}’s bridal inquiry asks about the day before it asks about the glam, so her reply is about your wedding and not a generic price list.`,
    steps: [
      ['The day', 'Your wedding date and ceremony time.'],
      ['The morning', 'Where you are getting ready, whether there is a first look, and the time you need to be ready by.'],
      ['The glam', 'The package you have in mind, how many people need hair and makeup, and your inspiration.'],
      ['You', 'Your name, email and phone, and how you would like to be contacted.'],
    ],
  },
  slateCollections: 'Bridal collections',
  collections: {
    kick: 'On her booking page',
    heading: ['Four bridal', 'collections.'],
    line: 'À la carte services, bridal packages and custom bridal experiences. These are the collections on her booking page today.',
    /* names as read from her Acuity page on 2026-11-18: names only, no prices, and they can change */
    names: ['The Luxe Bride', 'The Signature Soiree', 'The Luxe Gala', 'The Radiant Bride'],
    note: 'What each one includes, and current pricing, is always live on',
    noteLink: 'her booking page',
  },
  slateFaq: 'Good to know',
  faqHeading: ['Before you', 'inquire.'],
  /* [question, answer html]. {inq} {bridal} {event} {sched} are replaced with links by the page. */
  faq: [
    ['How do I book my wedding?', 'Start with the {inq}. It asks for your date, ceremony time, getting-ready location and how many people need hair and makeup, so the reply you get is about your day. Already know what you want? {bridal} can be booked directly.'],
    ['Do you offer bridal trials?', 'Yes. Trials are part of the bridal services. Mention yours in the inquiry and it is planned around your date.'],
    ['Can you do hair and makeup for my bridal party?', 'Yes. The inquiry asks how many people are getting ready with you, so the morning can be timed properly.'],
    ['Do you come to me?', `Appointments are offered both in studio and on location across ${SITE.area}. For anything further afield, ask in the inquiry.`],
    ['What does &ldquo;real-life filter&rdquo; mean?', `It is how ${SITE.first} describes her skin work: skin that still looks like skin, in person and on camera. Soft glam or full glam, never cakey.`],
    ['Where can I see pricing?', 'Current packages and pricing live on {sched}, so they are always up to date.'],
    ['I’m not a bride. Can I still book?', 'Of course. Event and everyday glam has {event}, with in-studio and travel options.'],
  ],
  noteKick: 'Ready when you are',
  note: 'Tell Amairany your date, your timeline and who is getting ready with you.',
};

export const SERVICES = {
  ghost: 'glam',
  kick: 'Services',
  heading: ['Brides first,', 'then every occasion.'],
  sub: 'Hair, makeup or both. Bridal services for the wedding day, and soft-to-full glam for events and photoshoots. Each has its own direct way to book.',
  groups: [
    {
      id: 'weddings', label: 'Bridal hair & makeup', path: 'bridal',
      items: [
        { id: 'bridal-hair-makeup', title: 'Bridal Hair &amp; Makeup', plate: 'bride-crystal', film: 'f1', summary: 'Wedding-day hair, makeup or both, on real-life-filter skin that still looks like skin in every photograph.', points: ['Soft glam to full glam', 'Glam waves and bridal hair', 'Bridal packages and custom bridal experiences'] },
        { id: 'bridal-trial-party', title: 'Trials &amp; the Bridal Party', plate: 'bride-pearls', summary: 'A trial to design the look before the day, and hair and makeup for the people getting ready beside you.', points: ['Trial appointments', 'Bridal party and family', 'Planned around your ceremony time'] },
      ],
    },
    {
      id: 'events', label: 'Events & everyday glam', path: 'event',
      items: [
        { id: 'soft-to-full-glam', title: 'Soft Glam to Full Glam', plate: 'glam-sculpt', film: 'f2', summary: 'From barely-there to full glam, always on skin that never reads cakey.', points: ['Soft glam', 'Full glam', 'Real-life-filter skin'] },
        { id: 'glam-waves', title: 'Glam Waves &amp; Event Hair', plate: 'waves-blonde', film: 'f4', summary: 'Glam waves and polished styling for the event, the night out or the shoot.', points: ['Glam waves', 'Event hair', 'Hair, makeup or both'] },
        { id: 'events-photoshoots', title: 'Events &amp; Photoshoots', plate: 'glam-bronze', summary: 'Glam for the celebration or the camera, in studio or on location.', points: ['Events and celebrations', 'Photoshoots', 'In studio or on location'] },
      ],
    },
  ],
  pricing: 'Current packages and pricing are always live on',
  pricingLink: 'her booking page',
  slateHow: 'Two ways to book',
};

export const ABOUT = {
  kick: `About ${SITE.first}`,
  heading: ['Meet', `${SITE.first}.`],
  figKick: `${SITE.name} &middot; ${SITE.role}`,
  figLine: 'Soft glam to full glam, glam waves and luxury bridal.',
  slateStory: 'The story',
  storyKick: 'Behind the brushes',
  /* "since 2013" and "Aveda Institute, Winter Park, 2018" are from a 2024 OrlandoVoyager interview: she confirms the years */
  story: [
    `${SITE.name} is a luxury hair and makeup artist based in Florida, working across Orlando and Tampa. She has been doing makeup since 2013 and trained at the Aveda Institute in Winter Park, graduating in 2018.`,
    'Her signature is what she calls real-life-filter skin: complexion work that still looks like skin, in person and in photographs.',
  ],
  pull: '&ldquo;Real-life filter skin. Never cakey.&rdquo;',
  story2: [
    'From there the look goes wherever you want it: soft glam, full glam, glam waves. She works with brides and the people getting ready with them, and with clients dressing for events and photoshoots.',
    `Based in ${SITE.areaLong}. Appointments in studio or on location.`,
  ],
  facts: [['Doing makeup since', '2013'], ['Trained at', 'Aveda Institute'], ['Based in', SITE.area]],
  motion: 'In motion',
  slateBest: 'What she is known for',
  best: {
    kick: 'Three signatures',
    heading: ['Skin, glam,', 'waves.'],
    line: 'The three things her work is known for, and the look that suits the face in front of her.',
    items: [
      ['Real-life-filter skin', 'Complexion work that still looks like skin, in person and in photographs. Never cakey.'],
      ['Soft glam to full glam', 'From barely-there to full glam, for the wedding day, the event or the shoot.'],
      ['Glam waves', 'Brushed-out glam waves and polished event hair.'],
    ],
  },
  noteKick: 'Ready when you are',
  note: 'Getting married? Start a bridal inquiry. Dressing for an event? Choose a time on her calendar.',
};

export const REVIEWS = {
  ghost: 'kind words',
  kick: 'Reviews',
  heading: ['Five stars,', 'in their own words.'],
  sub: `${SITE.first}’s reviews live where her clients wrote them. Ratings and review counts are as shown on each site on ${SITE.ratingsAsOf}.`,
  /* no review is quoted until she chooses which ones to share */
  sites: [
    { name: 'WeddingWire', score: '5.0', meta: '31 reviews', go: 'Read on WeddingWire', href: L.ww },
    { name: 'The Knot', score: '5.0', meta: '4 reviews', go: 'Read on The Knot', href: L.knot },
  ],
  google: { name: 'Google', line: `Worked with ${SITE.first}?`, go: 'Leave a review', href: L.google },
  emptyKick: 'Word for word',
  emptyHeading: 'Her clients’ words, published as they wrote them.',
  emptyBody: `Review excerpts will appear here once ${SITE.first} has chosen which ones to share. Until then, every review is one tap away, in full, on the site it was written on.`,
  noteKick: 'Ready when you are',
  note: 'Getting married? Start a bridal inquiry. Dressing for an event? Choose a time on her calendar.',
};

/* The on-site bridal inquiry. It asks the questions her own JotForm asks (as listed by the
   founder, 2026-11-19); nothing typed here is sent anywhere, and the last step hands the
   bride to her real form. The option lists (first look, package, party size, preferred
   contact) are OUR reading: her form could not be opened from the build environment, so
   she confirms them. */
export const INQUIRY = {
  label: 'Bridal Inquiry',
  heading: 'Tell her about your day.',
  body: `Your date, your timeline and who is getting ready with you. These are the questions ${SITE.first}’s own bridal inquiry asks, so her reply is about your wedding.`,
  qHeading: 'Not a bride?',
  qBody: 'Event and everyday glam books straight onto her calendar.',
  qLink: 'Book Event Makeup &amp; Hair',
  cardKick: 'Your bridal inquiry',
  note: 'An inquiry is not a confirmed booking, and no payment is taken here.',
  demoNote: 'Design preview: what you type stays in this browser and is not sent anywhere.',
  steps: [
    { key: 'day', label: 'The day', legend: 'Tell her about the day' },
    { key: 'glam', label: 'The glam', legend: 'Who is getting ready?' },
    { key: 'contact', label: 'Your contact', legend: `How can ${SITE.first} reach you?` },
    { key: 'review', label: 'Review', legend: 'Review your bridal inquiry' },
  ],
  firstLook: ['Yes', 'No', 'Not sure yet'],
  packages: [...['The Luxe Bride', 'The Signature Soiree', 'The Luxe Gala', 'The Radiant Bride'], 'Not sure yet'],
  party: [['Just me', 'Just me'], ['2–4 people', '2&ndash;4'], ['5–8 people', '5&ndash;8'], ['9 or more', '9 or more'], ['Not sure yet', 'Not sure yet']],
  contactBy: ['Text', 'Call', 'Email'],
  consent: `Sending an inquiry does not book your date or take any payment. ${SITE.first} replies to talk through your day.`,
  handoff: {
    strip: '<strong>Design preview</strong> &mdash; nothing was sent. Your answers never left this browser.',
    kick: 'One last step',
    heading: `Finish on ${SITE.first}’s own form.`,
    body: `Bridal inquiries reach ${SITE.first} through her own inquiry form. Copy your answers, open her form and paste them in. It asks the same questions.`,
    go: `Open ${SITE.first}’s inquiry form`,
    copy: 'Copy my answers',
    back: 'Back to my answers',
  },
};

export const FOOTER = {
  line: `Luxury hair and makeup by ${SITE.name}: soft-to-full glam, glam waves and real-life-filter skin for brides and events across ${SITE.area}.`,
  fine: `Design preview by JP Silva Digital for ${SITE.name}. This is a concept, not her official website. Photography from ${SITE.handle}, shown with her permission. Booking buttons open her own inquiry form and booking pages. The wordmark is concept styling, not an official logo.`,
};
