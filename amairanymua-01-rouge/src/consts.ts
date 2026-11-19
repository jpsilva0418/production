/**
 * Central constants for ROUGE, Amairany Sierra's fourth design preview.
 *
 * SOURCE OF TRUTH: every fact, link, photograph and film slot comes from
 * ../jp-web-design/scripts/amairanymua-01/site.mjs, the single file all four previews read.
 * Nothing about her is typed here; this file only re-shapes those values for the components.
 * She has published no phone number to us, so there is none anywhere in this site.
 */
// @ts-ignore — plain ES module outside the project root; Vite bundles it at build time
import * as S from '../../jp-web-design/scripts/amairanymua-01/site.mjs';

export const SM = S as any;
export const SITE = SM.SITE as {
  name: string; first: string; handle: string; email: string; tagline: string; role: string; area: string; areaLong: string;
};
/** Her published addresses (L) and the four booking addresses (BOOK), read-only. */
export const L = SM.L as Record<string, string>;
export const BOOK = SM.BOOK as Record<string, string>;
/** /demo/amairanymua-01 and its shared assets folder. */
export const DEMO = SM.BASE as string;
export const A = SM.A as string;
export const ORIGIN = SM.ORIGIN as string;
/** This site's own root. */
export const ROOT = `${DEMO}/rouge`;
/** An internal address: u('work') -> /demo/amairanymua-01/rouge/work, u() -> the home page. */
export const u = (path = '') => (path ? `${ROOT}/${path.replace(/^\//, '')}` : ROOT);

export const LINKS = {
  home: u(),
  work: u('work'),
  services: u('services'),
  about: u('about'),
  book: u('book'),
  inquiry: `${u('book')}#bridal-inquiry`,
};

export const NAV = [
  { href: LINKS.work, label: 'Work', note: 'Photographs and film' },
  { href: LINKS.services, label: 'Services', note: 'Brides, events, photoshoots' },
  { href: LINKS.about, label: 'About', note: 'The artist behind the brushes' },
  { href: LINKS.book, label: 'Book', note: 'Weddings start here' },
];

/** The three places to see more of her work and leave a review (founder request, 2026-11-19). */
export const SOCIAL = [
  { key: 'ig', label: 'Instagram', value: SITE.handle, href: L.ig },
  { key: 'tiktok', label: 'TikTok', value: SITE.handle, href: L.tiktok },
  { key: 'google', label: 'Google reviews', value: 'Review on Google', href: L.google },
];

/** A link into her booking system, exactly as site.mjs builds it (data-book + the documented
 *  address, same tab). Returns HTML for set:html. */
export const book = (kind: string, label: string, cls = '', attrs = '') => SM.book(kind, label, cls, attrs) as string;
export const film = (id: string, opts: { label?: string; cls?: string } = {}) => SM.film(id, opts) as string;
/** The preview marker for a Rouge page, from site.mjs (links all the previews). */
export const marker = (path = '') => SM.marker('rouge', path) as string;

/** Her own words, from her current site and form (site.mjs HER), used as she wrote them. */
export const HER = SM.HER as {
  brand: { script: string; caps: string }; badges: string[]; hello: string; about: string[]; years: [string, string][];
  services: string[]; booking: string; packages: { name: string; price: string; who: string; points: string[] }[];
  packagesNote: string; destination: { heading: string; body: string }; faq: [string, string][]; prepare: string[];
  links: { reviewsName: string; reviewsLine: string };
};
/** "Love Notes": where her clients wrote their reviews, one tap each. Ratings as read on SITE.ratingsAsOf. */
type Love = { name: string; score: string; meta: string; go: string; href: string; asOf: string };
export const LOVE: Love[] = [
  ...(SM.REVIEWS.sites as Love[]).map((x) => ({ ...x, asOf: x.asOf ?? (SM.SITE.ratingsAsOf as string) })),
  { name: SM.REVIEWS.google.name, score: SM.REVIEWS.google.score ?? '', meta: SM.REVIEWS.google.meta ?? '', go: SM.REVIEWS.google.go, href: SM.REVIEWS.google.href, asOf: SM.REVIEWS.google.asOf ?? '' },
];
export const RATINGS_AS_OF = SM.SITE.ratingsAsOf as string;
