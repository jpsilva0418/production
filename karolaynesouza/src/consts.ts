/**
 * Central site constants (non-secret) for the Karolayne Souza Beauty demo.
 *
 * SOURCE OF TRUTH — only what she has published herself, collected 2026-11-20
 * (media-intake/brand-brief.md and media-intake/sources.md):
 *  · Instagram @karolaynesouzabeauty.us — "LASHES • EYEBROW DESIGNER", "Brazilian Lash & Brow
 *    Artist", "Acabamento premium e simetria perfeita", "Milford, Ma | Book NOW 15% off";
 *  · her Linktree — WhatsApp booking, Square online booking, "153 Main St, Milford";
 *  · her official bilingual price list (Canva), which also prints her WhatsApp number;
 *  · the founder's handoff (studio: private room, black/white decor, wall sign).
 * Not published by her, so left out on purpose: opening hours (directories disagree, Saturday
 * reads "5 AM"), email (directory-only), suite number, reviews, years in business.
 */
export const SITE = {
  name: 'Karolayne Souza Beauty',
  owner: 'Karolayne Souza',
  first: 'Karolayne',
  /** The two lines under her KS monogram (price list). */
  tagline: 'Lashes & Brows',
  role: 'Brazilian lash & brow artist',
  /** Her Instagram bio, verbatim (Portuguese). */
  motto: 'Acabamento premium e simetria perfeita',
  mottoEn: 'Premium finish, perfect symmetry',
  description:
    'Karolayne Souza is a Brazilian lash & brow artist in Milford, MA — classic, hybrid, Brazilian and Russian volume lash extensions and eyebrow design, with a premium finish and perfect symmetry.',
  /** Demo origin only. Her real domain is never pointed at this build. */
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://karolaynesouza-demo.vercel.app',
  locale: 'en_US',
  /** WhatsApp — the link in her Instagram bio. Primary booking path. */
  whatsapp: 'https://wa.me/message/TUZVGBQYHKYWP1',
  /** Printed on her price list ("WhatsApp 351 210 2876") and on her Linktree. */
  phone: '(351) 210-2876',
  phoneE164: '+13512102876',
  /** Online booking: her Square Appointments page, linked from her Linktree ("Book Online"). */
  booking: 'https://squareup.com/appointments/book/LR6ZD40XEYFP5',
  /** Her bio offer, verbatim: "Book NOW 15% off". Terms are not published. */
  offer: 'Book now — 15% off',
  instagram: { handle: '@karolaynesouzabeauty.us', url: 'https://www.instagram.com/karolaynesouzabeauty.us/' },
  address: { street: '153 Main St', city: 'Milford', region: 'MA', zip: '01757', label: '153 Main St, Milford, MA 01757' },
  /** Her own Linktree location link. */
  maps: 'https://maps.app.goo.gl/biwgyD9JFyAWDFcA9',
  area: { label: 'Milford, MA', region: 'Massachusetts', regionCode: 'MA' },
  links: { about: '/about', services: '/services', work: '/work', book: '/book' },
  nav: [
    { href: '/work', label: 'Work', note: 'Lashes, brows and reels' },
    { href: '/services', label: 'Services & prices', note: 'From her price list' },
    { href: '/about', label: 'Meet Karolayne', note: 'The artist and the studio' },
    { href: '/book', label: 'Book', note: 'WhatsApp or online' },
  ],
} as const;

export const TEL = `tel:${SITE.phoneE164}`;
/** External links open in the SAME tab: the smoothest one-tap handoff, especially inside
 *  Instagram's in-app browser. */
export const ext = (href: string) => (href.startsWith('http') ? { rel: 'external' } : {});
