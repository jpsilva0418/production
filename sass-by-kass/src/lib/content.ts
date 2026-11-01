/**
 * SITE COPY — the single copy source for every page. Written for a premium hair stylist
 * from the facts in src/consts.ts. Rule: no invented numbers, credentials, prices,
 * reviews or locations; where a fact is unknown the copy stays neutral.
 */
import { SITE, TEL, SMS } from '../consts';
export { SITE, TEL, SMS };

export const HERO = {
  eyebrow: ['Hand-tied extensions', 'Dimensional color', 'Bridal'],
  lines: ['Hair with', 'a little more'],
  italic: 'sass.',
  sub: 'Hand-tied extensions, dimensional color and bridal hair by Kassandra — a Massachusetts stylist. Now booking brides.',
  cta: 'Book an appointment',
  ctaHref: SITE.booking,
  secondary: 'View my work',
  secondaryHref: SITE.links.work,
  loc: `${SITE.name} · ${SITE.area.label} · ${SITE.instagram.handle}`,
} as const;

export const INTRO = {
  eyebrow: 'The stylist',
  heading: ['Hi, I’m', 'Kass.'],
  lead: 'I’m Kassandra — Kass to everyone who sits in my chair — a Massachusetts hair stylist who lives in color, extensions and bridal.',
  sentences: [
    'My thing is hair that looks expensive and feels effortless: dimensional color that grows out softly, hand-tied extensions you forget you’re wearing, and wedding hair that still looks perfect at the last dance.',
    'Appointments here start with a real conversation — your hair, your routine, what you actually want — and end with a plan to get you there.',
    'Fair warning: I’m a talker. Come for the hair, stay for the chat.',
  ],
  values: ['Extensions', 'Color', 'Bridal'],
  caption: 'Kassandra · Sass by Kass',
} as const;

export const SECTION_LABELS = {
  work: 'The work',
  services: 'Signature services',
  how: 'How booking works',
  follow: 'Follow along',
  bridal: 'Now booking brides',
} as const;

export const WORK = {
  heading: ['Let the work', 'speak.'],
  line: 'Color, extensions and bridal — on real clients, in real light. Swipe through a few favorites, or see the full portfolio.',
  all: 'See all the work',
} as const;

export const SERVICES_INTRO = {
  heading: ['What I do', 'best.'],
  line: 'Four things, done properly — and a plan that fits the hair you already have.',
} as const;

/** The three honest ways to start. */
export const HOW = [
  { title: 'Book online', body: 'Pick a service and a time on GlossGenius, any hour of the day. New clients welcome.', href: SITE.booking, cta: 'Open booking', external: true },
  { title: 'Text with questions', body: `Not sure what to book? Text ${SITE.phone} and Kass will point you to the right appointment.`, href: SMS, cta: 'Send a text' },
  { title: 'Brides & extensions', body: 'Weddings and first-time extensions start with a quick enquiry, so the plan and the timing are right before anything goes on the calendar.', href: SITE.links.enquiry, cta: 'Start an enquiry' },
] as const;

export const BAND = { caption: `${SITE.name} <b>&middot;</b> ${SITE.area.label}` } as const;

export const BOOK = {
  eyebrow: 'Ready when you are',
  heading: 'Let’s make your hair the easy part.',
  body: 'Book online in a minute, or text with a question first. Brides and extension clients: start with the enquiry and Kass will come back to you with a plan.',
  points: ['Book online 24/7', `Text ${SITE.phone}`, SITE.area.label],
  cta: 'Book an appointment',
  ctaHref: SITE.booking,
  alt: 'Call or text Kass',
  altHref: TEL,
} as const;

export const FOLLOW = {
  heading: SITE.instagram.handle,
  body: 'New work, before-and-afters and the occasional yap — follow along on Instagram.',
  cta: 'Follow on Instagram',
  href: SITE.instagram.url,
  tiles: ['glam-blonde', 'bride-veil', 'brunette-dimension'] as const,
} as const;

export const BRIDAL = {
  banner: SECTION_LABELS.bridal,
  heading: 'Getting married? Let’s talk hair.',
  body: 'Tell Kass about the day — the date, where you’re getting ready and how many of you there are — and she’ll come back with availability and a plan.',
  cta: 'Bridal enquiry',
  ctaHref: SITE.links.bridal,
  alt: 'Text Kass',
  altHref: SMS,
  plate: 'autumn-lookback',
} as const;

export const FOOTER = {
  line: 'Hand-tied extensions, dimensional color and bridal hair — by Kassandra, in Massachusetts.',
} as const;

/** Supplied media (docs/MEDIA.md). Every file here is the client's own. */
export const MEDIA = {
  heroFilm: { webm: '/media/hero-film.webm', mp4: '/media/hero-film.mp4', poster: '/media/hero-film.jpg', alt: 'Brunette dimensional color: foils, then the reveal', ratio: '9/16' },
  cineFilm: { webm: '/media/cine-film.webm', mp4: '/media/cine-film.mp4', poster: '/media/cine-film.jpg', alt: 'Long, dark glam waves swept to one side', ratio: '9/16' },
  reelBlonde: { webm: '/media/reel-blonde.webm', mp4: '/media/reel-blonde.mp4', poster: '/media/reel-blonde.jpg', alt: 'Blonde lived-in color reveal with face-framing layers', ratio: '9/16' },
  reelBride: { webm: '/media/reel-bride.webm', mp4: '/media/reel-bride.mp4', poster: '/media/reel-bride.jpg', alt: 'A bride in a sleek half-up style, getting ready', ratio: '9/16' },
  plates: {
    portrait: 'kass-portrait',
    laptop: 'kass-laptop',
    glamBlonde: 'glam-blonde',
    balayage: 'balayage-back',
    brunette: 'brunette-dimension',
    brideVeil: 'bride-veil',
    autumnEmbrace: 'autumn-embrace',
    autumnLookback: 'autumn-lookback',
    brideMother: 'bride-mother',
    bridesmaids: 'bridesmaids',
    firstDance: 'first-dance',
    prosecco: 'prosecco',
    boat: 'boat',
  },
} as const;

export interface Film { webm: string; mp4: string; poster: string; alt: string; ratio: string }

/** Portfolio items, grouped. `alt` describes the hair, never names a client. */
export type WorkItem =
  | { kind: 'photo'; plate: string; alt: string; span?: 'tall' | 'wide' | 'big' }
  | { kind: 'film'; film: Film; span?: 'tall' | 'wide' | 'big' };

export const PORTFOLIO: { id: string; title: string; line: string; items: WorkItem[] }[] = [
  {
    id: 'color', title: 'Color', line: 'Lived-in blondes and dimensional brunettes — blended by hand so the grow-out stays soft.',
    items: [
      { kind: 'film', film: MEDIA.heroFilm, span: 'tall' },
      { kind: 'photo', plate: 'glam-blonde', alt: 'Bright blonde glam waves with a deep side part', span: 'big' },
      { kind: 'photo', plate: 'balayage-back', alt: 'Blonde lived-in color seen from behind, soft waves' },
      { kind: 'film', film: MEDIA.reelBlonde, span: 'tall' },
      { kind: 'photo', plate: 'brunette-dimension', alt: 'Dark brunette lob with fine caramel highlights' },
    ],
  },
  {
    id: 'bridal', title: 'Bridal', line: 'Polished, timeless and built to last from the first look to the last dance.',
    items: [
      { kind: 'photo', plate: 'bride-veil', alt: 'A bride with a low, soft updo and a veil in the wind', span: 'big' },
      { kind: 'film', film: MEDIA.reelBride, span: 'tall' },
      { kind: 'photo', plate: 'autumn-lookback', alt: 'A bride in a beaded gown looking back, polished waves' },
      { kind: 'photo', plate: 'bride-mother', alt: 'A bride and her mother getting ready, soft updos', span: 'wide' },
      { kind: 'photo', plate: 'autumn-embrace', alt: 'A bride with a sleek low bun, autumn light' },
      { kind: 'photo', plate: 'bridesmaids', alt: 'A bride and six bridesmaids in pale yellow', span: 'wide' },
      { kind: 'photo', plate: 'prosecco', alt: 'A bride and bridesmaids getting ready, slicked ponytails and buns' },
      { kind: 'photo', plate: 'first-dance', alt: 'The first dance under a white tent' },
    ],
  },
  {
    id: 'occasions', title: 'Occasions', line: 'Soft waves, sleek half-ups and glam for the nights worth dressing up for.',
    items: [
      { kind: 'film', film: MEDIA.cineFilm, span: 'tall' },
      { kind: 'photo', plate: 'boat', alt: 'A couple on a boat; her hair in a soft half-up style', span: 'big' },
    ],
  },
];

/** The home page's swipeable selection: five mixed tiles. */
export const FEATURED: WorkItem[] = [
  { kind: 'film', film: MEDIA.reelBlonde },
  { kind: 'photo', plate: 'bride-veil', alt: 'A bride with a low, soft updo and a veil in the wind' },
  { kind: 'photo', plate: 'glam-blonde', alt: 'Bright blonde glam waves with a deep side part' },
  { kind: 'film', film: MEDIA.reelBride },
  { kind: 'photo', plate: 'brunette-dimension', alt: 'Dark brunette lob with fine caramel highlights' },
  { kind: 'photo', plate: 'autumn-embrace', alt: 'A bride with a sleek low bun, autumn light' },
];
