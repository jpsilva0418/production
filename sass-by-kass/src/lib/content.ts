/**
 * SITE COPY — the single copy source for every page. Bridal-first, from the facts in
 * src/consts.ts. Rule: no invented numbers, credentials, prices, reviews or locations;
 * where a fact is unknown the copy stays neutral.
 */
import { SITE, TEL, SMS, ext } from '../consts';
export { SITE, TEL, SMS, ext };

export const HERO = {
  eyebrow: ['Bridal', 'Wedding parties', 'Massachusetts'],
  lines: ['Wedding hair,', 'made to last'],
  italic: 'the whole day.',
  sub: 'Bridal and hair artistry by Kassandra — for the bride and everyone getting ready with her. Now booking brides.',
  cta: 'Bridal inquiry',
  ctaHref: SITE.bridal,
  salon: 'Book in-salon',
  salonHref: SITE.booking,
  cue: 'Meet Kass',
} as const;

export const INTRO = {
  eyebrow: 'About Kass',
  heading: ['Hi, I’m', 'Kass.'],
  lead: 'I’m Kassandra — Kass to everyone who sits in my chair — a Massachusetts hair artist who lives for wedding mornings.',
  sentences: [
    'Bridal is my heart: polished, timeless hair that still looks perfect at the last dance, for the bride and everyone getting ready with her.',
    'In the salon I do hand-tied extensions and dimensional color — hair that looks expensive and grows out softly.',
    'Fair warning: I’m a talker. Come for the hair, stay for the chat.',
  ],
  values: ['Bridal', 'Extensions', 'Color'],
  caption: 'Kassandra · Sass by Kass',
} as const;

/** The two destinations. Bridal is the lead path everywhere. */
export const PATHS = [
  {
    key: 'bridal',
    kicker: 'Weddings',
    title: 'Bridal & Wedding Hair',
    body: 'For the bride, her party and her family. Send Kass a short bridal inquiry and she’ll reply by email with availability, your package, contract and deposit details.',
    points: ['Brides and bridal parties', 'Updos, soft waves, half-up', 'Booked with a contract and deposit'],
    cta: 'Bridal inquiry',
    href: SITE.bridal,
    note: 'A short on-site form — Kass replies by email',
    plate: 'bride-veil',
  },
  {
    key: 'salon',
    kicker: 'In the salon',
    title: 'In-Salon Services',
    body: 'Hand-tied extensions, dimensional color and styling. Pick a service and a time online, any hour of the day.',
    points: ['Hand-tied extensions', 'Dimensional color', 'Styling and occasions'],
    cta: 'Book in-salon',
    href: SITE.booking,
    note: 'Opens her GlossGenius booking',
    plate: 'balayage-back',
  },
] as const;

export const SECTION_LABELS = {
  paths: 'Two ways to book',
  portfolio: 'Bridal portfolio',
  reviews: 'Reviews',
  follow: 'Follow along',
} as const;

export const WORK = {
  heading: ['Her brides,', 'her work.'],
  line: 'Real weddings, real mornings, real light. Swipe through a few favorites, or open the full portfolio.',
  all: 'Open the portfolio',
} as const;

/** Verified client reviews ONLY — quote, first name, and where it came from (e.g. "Google",
 *  "Instagram DM, shared with permission"). None have been supplied yet: until there is at
 *  least one, the home teaser and /reviews show an honest empty state. */
export const REVIEWS: { quote: string; name: string; source: string; kind?: 'bridal' | 'salon' }[] = [];

export const REVIEWS_EMPTY = {
  heading: 'Kind words, word for word.',
  body: 'Reviews from Kass’s brides and salon clients will be published here exactly as they were written, with their permission.',
} as const;

export const BAND = { caption: `${SITE.name} <b>&middot;</b> ${SITE.tagline}` } as const;

export const FINAL = {
  eyebrow: 'Ready when you are',
  heading: 'Two ways to book with Kass.',
  body: 'Getting married? Start with a bridal inquiry. Booking for yourself? Choose a salon time online.',
  bridal: { label: 'Bridal inquiry', href: SITE.bridal, note: 'Weddings and bridal parties' },
  salon: { label: 'Book in-salon', href: SITE.booking, note: 'Extensions, color, styling' },
} as const;

export const FOLLOW = {
  heading: SITE.instagram.handle,
  body: 'New brides, before-and-afters and the occasional yap — follow along on Instagram.',
  cta: 'Follow on Instagram',
  href: SITE.instagram.url,
  tiles: ['bride-mother', 'glam-blonde', 'autumn-embrace'] as const,
} as const;

export const FOOTER = {
  line: 'Bridal and hair artistry by Kassandra — wedding hair, hand-tied extensions and dimensional color in Massachusetts.',
} as const;

/** Supplied media (docs/MEDIA.md). Every file here is the client's own.
 *  BRANDING-SHOOT SLOTS: `portrait` and `portrait2` are the About photographs. When her
 *  professional shoot arrives, replace src/assets/plates/kass-portrait.jpg and kass-laptop.jpg
 *  with the new files (same names, any size ≥ 1200px tall, portrait) — no code changes. */
export const MEDIA = {
  heroFilm: { webm: '/media/reel-bride.webm', mp4: '/media/reel-bride.mp4', poster: '/media/reel-bride.jpg', alt: 'A bride in a sleek half-up style, getting ready', ratio: '9/16' },
  cineFilm: { webm: '/media/cine-film.webm', mp4: '/media/cine-film.mp4', poster: '/media/cine-film.jpg', alt: 'Long, dark glam waves swept to one side', ratio: '9/16' },
  reelBlonde: { webm: '/media/reel-blonde.webm', mp4: '/media/reel-blonde.mp4', poster: '/media/reel-blonde.jpg', alt: 'Blonde lived-in color reveal with face-framing layers', ratio: '9/16' },
  reelBrunette: { webm: '/media/hero-film.webm', mp4: '/media/hero-film.mp4', poster: '/media/hero-film.jpg', alt: 'Brunette dimensional color: foils, then the reveal', ratio: '9/16' },
  plates: {
    portrait: 'kass-portrait',
    portrait2: 'kass-laptop',
  },
} as const;

export interface Film { webm: string; mp4: string; poster: string; alt: string; ratio: string }

export type WorkItem =
  | { kind: 'photo'; plate: string; alt: string; span?: 'tall' | 'wide' | 'big' }
  | { kind: 'film'; film: Film; span?: 'tall' | 'wide' | 'big' };

/** Portfolio groups — bridal first. To add her new wedding photos: drop the file into
 *  src/assets/plates and add one line to the right group. */
export const PORTFOLIO: { id: string; title: string; line: string; items: WorkItem[] }[] = [
  {
    id: 'bridal', title: 'Bridal', line: 'Polished, timeless and built to last from the first look to the last dance.',
    items: [
      { kind: 'photo', plate: 'bride-veil', alt: 'A bride with a low, soft updo and a veil in the wind', span: 'big' },
      { kind: 'film', film: MEDIA.heroFilm, span: 'tall' },
      { kind: 'photo', plate: 'autumn-lookback', alt: 'A bride in a beaded gown looking back, polished waves' },
      { kind: 'photo', plate: 'autumn-embrace', alt: 'A bride with a sleek low bun, autumn light' },
      { kind: 'photo', plate: 'first-dance', alt: 'The first dance under a white tent' },
    ],
  },
  {
    id: 'getting-ready', title: 'Getting ready', line: 'The morning of: the bride, her mother, her party — everyone camera-ready on time.',
    items: [
      { kind: 'photo', plate: 'bride-mother', alt: 'A bride and her mother getting ready, soft updos', span: 'wide' },
      { kind: 'photo', plate: 'prosecco', alt: 'A bride and bridesmaids getting ready, slicked ponytails and buns' },
      { kind: 'photo', plate: 'bridesmaids', alt: 'A bride and six bridesmaids in pale yellow', span: 'wide' },
    ],
  },
  {
    id: 'occasions', title: 'Occasions', line: 'Engagement shoots and nights worth dressing up for.',
    items: [
      { kind: 'photo', plate: 'boat', alt: 'A couple on a boat; her hair in a soft half-up style', span: 'big' },
      { kind: 'film', film: MEDIA.cineFilm, span: 'tall' },
    ],
  },
  {
    id: 'salon', title: 'In the salon', line: 'Lived-in blondes, dimensional brunettes and hand-tied extensions.',
    items: [
      { kind: 'photo', plate: 'glam-blonde', alt: 'Bright blonde glam waves with a deep side part', span: 'big' },
      { kind: 'film', film: MEDIA.reelBrunette, span: 'tall' },
      { kind: 'photo', plate: 'balayage-back', alt: 'Blonde lived-in color seen from behind, soft waves' },
      { kind: 'film', film: MEDIA.reelBlonde, span: 'tall' },
      { kind: 'photo', plate: 'brunette-dimension', alt: 'Dark brunette lob with fine caramel highlights' },
    ],
  },
];

/** The home page's swipeable bridal selection. */
export const FEATURED: WorkItem[] = [
  { kind: 'photo', plate: 'bride-veil', alt: 'A bride with a low, soft updo and a veil in the wind' },
  { kind: 'film', film: MEDIA.heroFilm },
  { kind: 'photo', plate: 'bride-mother', alt: 'A bride and her mother getting ready, soft updos' },
  { kind: 'photo', plate: 'autumn-lookback', alt: 'A bride in a beaded gown looking back, polished waves' },
  { kind: 'photo', plate: 'bridesmaids', alt: 'A bride and six bridesmaids in pale yellow' },
  { kind: 'photo', plate: 'autumn-embrace', alt: 'A bride with a sleek low bun, autumn light' },
];

/** Her own "Need makeup recommendations?" board (bridal reference brochure), as native text.
 *  Handles are transcribed from the board. One is corrected: the board reads "@LETISILVABAUTY",
 *  but her Instagram shows the account as @letisilvabeauty. `verified` = the handle was seen on a
 *  source other than the board; the rest are exactly as Kass wrote them and should be confirmed
 *  with her before launch. */
export const MAKEUP: { group: string; artists: { handle: string; verified?: boolean }[] }[] = [
  { group: 'Soft glam', artists: [{ handle: 'letisilvabeauty', verified: true }, { handle: 'chelseaelizabethbeauty' }, { handle: 'brushedbyjulia' }, { handle: 'jill_aesthetics_' }] },
  { group: 'Full glam', artists: [{ handle: 'amaribeautyandbrows' }, { handle: 'gabriellacorricelli' }, { handle: 'beauty_by_mariachristina' }] },
  { group: 'Airbrush', artists: [{ handle: 'makeupnikki' }] },
];
export const igUrl = (h: string) => `https://www.instagram.com/${h}/`;

/** The bridal inquiry page's introduction — Kass's own "Ready to book?" words from her brochure,
 *  adapted only where the brochure says "email me": on the site, the form IS that message. */
export const READY = {
  label: 'Bridal Inquiry',
  heading: 'Ready to book?',
  body: 'Amazing! Just tell me about your day and which package you’d like below. When you send your inquiry it comes straight to me, and I’ll reply by email to confirm availability, send your contract and let you know how to send your deposit.',
  qHeading: 'More questions?',
  qBody: 'Please feel free to add any further questions in the form — I would be happy to answer them.',
  note: 'Sending the form is an inquiry, not a confirmed booking — no payment is taken here.',
} as const;
