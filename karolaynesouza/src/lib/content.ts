/**
 * SITE COPY + MEDIA MAP — the single copy source for every page, from the facts in src/consts.ts.
 * Rule: no invented numbers, credentials, reviews, hours or prices. Prices are her official price
 * list (media-intake/brand-price-list-en.jpg); anything not on it reads "Ask".
 */
import { SITE, TEL, ext } from '../consts';
export { SITE, TEL, ext };

export interface Film { webm: string; mp4: string; poster: string; alt: string; ratio?: string }

/** Her own media. Every file is hers (media-intake/ holds the originals and their provenance).
 *
 *  FILM SLOTS — `heroFilm` (the opening, a clip with NO burned-in text) and `pinnedFilm` (her best
 *  reel, pinned full-height on the home page) are null until her reels arrive: encode each clip
 *  with `bash scripts/encode-reel.sh <clip.mp4> <name>` (720px, VP9 webm + H.264 mp4 + poster),
 *  then set the slot here. While a slot is null the hero shows her portrait and the pinned band is
 *  left out — never a placeholder. */
export const MEDIA: {
  heroFilm: Film | null;
  pinnedFilm: Film | null;
  reels: Film[];
  plates: { portrait: string; portraitAbout: string; lashes: string };
} = {
  heroFilm: null,
  pinnedFilm: null,
  /** Instagram reels for the work grid, e.g.
   *  { webm: '/media/reel-hybrid.webm', mp4: '/media/reel-hybrid.mp4', poster: '/media/reel-hybrid.jpg', alt: 'Hybrid set, before and after' } */
  reels: [],
  plates: {
    /** Hero poster/fallback. */
    portrait: 'karolayne-portrait',
    /** About page portrait — swap for a second photo of her when one arrives (same folder). */
    portraitAbout: 'karolayne-portrait',
    lashes: 'lashes-closeup',
  },
};

export type WorkItem =
  | { kind: 'photo'; plate: string; alt: string; tag: string; span?: 'tall' | 'wide' | 'big' }
  | { kind: 'film'; film: Film; tag: string; span?: 'tall' | 'wide' | 'big' };

/** The work, in one mixed list (photos and reels together, like her grid). To add her posts:
 *  drop the photo into src/assets/plates (lashes-*, brows-*, combo-*) and add one line; reels go
 *  through MEDIA.reels and are mixed in below. */
const PHOTOS: WorkItem[] = [
  { kind: 'photo', plate: 'lashes-closeup', alt: 'A client’s eye in profile: full, soft lash extensions and a groomed brow', tag: 'Lashes', span: 'big' },
];
const interleave = (a: WorkItem[], b: WorkItem[]) => {
  const out: WorkItem[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) { if (a[i]) out.push(a[i]); if (b[i]) out.push(b[i]); }
  return out;
};
export const WORK_ITEMS: WorkItem[] = interleave(PHOTOS, MEDIA.reels.map((film) => ({ kind: 'film', film, tag: 'Reel', span: 'tall' }) as WorkItem));

export const HERO = {
  eyebrow: ['Lashes', 'Eyebrow designer', 'Milford, MA'],
  lines: ['Premium finish,'],
  italic: 'perfect symmetry.',
  sub: 'Brazilian lash & brow artist Karolayne Souza — lash extensions and eyebrow design in a private studio in Milford.',
  cta: 'Book on WhatsApp',
  ctaHref: SITE.whatsapp,
  online: 'Book online',
  onlineHref: SITE.booking,
  cue: 'Meet Karolayne',
} as const;

export const INTRO = {
  eyebrow: 'Meet Karolayne',
  heading: ['Olá, I’m', 'Karolayne.'],
  lead: 'A Brazilian lash & brow artist in Milford — every set built for a premium finish and perfect symmetry.',
  sentences: [
    'Lash extensions from a natural classic set to Russian volume, mapped to your eyes and the look you want.',
    'Eyebrow design, with or without henna, shaped for balance — so your brows and lashes finish each other.',
  ],
  values: ['Lashes', 'Brows', 'Combo'],
} as const;

/** Her official price list, exactly. US dollars. */
export const LASHES = {
  title: 'Eyelash extensions',
  pt: 'Extensão de cílios',
  cols: ['Full set', '2-week fill', 'Fill 16–25 days'],
  colsNote: ['', '15 days', ''],
  rows: [
    { name: 'Classic set', pt: 'Clássica fio a fio', prices: [80, 55, 65], line: 'One extension on each natural lash — clean, defined, natural.' },
    { name: 'Hybrid volume', pt: 'Volume híbrido', prices: [90, 60, 70], line: 'Classic and volume mixed — fuller, still soft.' },
    { name: 'Brazilian volume', pt: 'Volume brasileiro', prices: [100, 65, 75], line: 'Light, airy fullness with a polished line.' },
    { name: 'Russian volume', pt: 'Volume russo', prices: [120, 75, 85], line: 'Handmade fans for the fullest, most dramatic set.' },
  ],
} as const;

export const BROWS = {
  title: 'Eyebrow design',
  pt: 'Design de sobrancelhas',
  rows: [
    { name: 'Eyebrow design', pt: 'Design de sobrancelhas', price: 25 as number | null },
    { name: 'Eyebrow design + henna', pt: 'Design com henna', price: 35 as number | null },
  ],
} as const;

/** Offered (an Instagram highlight is titled "Lash Removal") but not priced on her list. */
export const EXTRAS = [{ name: 'Lash removal', pt: 'Remoção de cílios', price: null as number | null }];

export const PRICE_NOTE = 'Prices from Karolayne’s current price list, in US dollars. Fills are priced by how long it has been since your last appointment.';

export const STUDIO = {
  heading: ['A private room,', 'all yours.'],
  body: 'Her studio is a private room in black and white, with the sign on the wall: Lashes & Brows — by Karolayne Souza. No salon floor — just you, the bed and the ring light.',
} as const;

export const WORK = {
  heading: ['Her work,', 'up close.'],
  line: 'Lashes, brows and combo sets from her chair. New work goes up on Instagram first.',
  all: 'See the work',
} as const;

export const FINAL = {
  eyebrow: 'Agende seu horário',
  heading: 'Book your appointment.',
  body: 'Message Karolayne on WhatsApp, or pick a time online. Her Instagram offer: book now, 15% off — ask her for the details when you book.',
} as const;

export const FOOTER = {
  line: 'Brazilian lash & brow artist in Milford, MA. Beauty • care • confidence.',
} as const;

/** Demo-only appointment request (the /book page). It never contacts any server. */
export const REQUEST = {
  heading: 'Or leave a request',
  body: 'Tell Karolayne what you’d like and when, and she’ll message you back to confirm.',
  services: ['Classic set', 'Hybrid volume', 'Brazilian volume', 'Russian volume', 'Lash fill', 'Eyebrow design', 'Eyebrow design + henna', 'Lash removal', 'Not sure yet'],
  demo: 'Demo mode — this request was not sent anywhere. On the live site it would reach Karolayne directly.',
} as const;

export const money = (n: number | null) => (n == null ? 'Ask' : `$${n}`);
