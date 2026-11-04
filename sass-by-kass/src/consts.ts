/**
 * Central site constants (non-secret) for the Sass by Kass demo.
 *
 * SOURCE OF TRUTH: the material supplied for this prospect only —
 *  · her Instagram profile (@sassbykass: "KASSANDRA : MA HAIR STYLIST", "Hand-Tied Extensions &
 *    Dimensional hair", "BOOKING 2026 BRIDES", "Text +15085061845 with questions", GlossGenius link);
 *  · her bridal reference brochure ("Kassandra Ortiz", "SassByKass@yahoo.com", "Bridal and Hair
 *    Artistry", bridal bookings confirmed by email with a contract and deposit);
 *  · the founder's handoff (Nov 2026): bridal-first, HoneyBook for weddings, GlossGenius for salon;
 *  · her supplied photos and clips.
 * Anything the materials do not establish is left `null` and never guessed: no prices, no years in
 * business, no salon address, no reviews.
 */

/** Her existing HoneyBook bridal inquiry link. NOT YET SUPPLIED — paste it here and every
 *  "Bridal inquiry" button on the site switches to it. Until then bridal inquiries go to her
 *  email, which is how her own bridal brochure says to book. */
const HONEYBOOK: string | null = null;

const EMAIL = 'SassByKass@yahoo.com';
const BRIDAL_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('Bridal inquiry')}&body=${encodeURIComponent('Hi Kass! I’d love to talk about hair for my wedding.\n\nWedding date:\nWhere we’re getting ready:\nHow many of us need hair:\n')}`;

export const SITE = {
  name: 'Sass by Kass',
  owner: 'Kassandra',
  nick: 'Kass',
  /** The tagline on her own logo. */
  tagline: 'Bridal and Hair Artistry',
  role: 'Massachusetts bridal & hair artist',
  description:
    'Sass by Kass is Kassandra — bridal and hair artistry in Massachusetts. Wedding hair for brides and their parties, plus hand-tied extensions and dimensional color in the salon.',
  /** Demo origin only. Her real domain (if any) is never pointed at this build. */
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://sass-by-kass-demo.vercel.app',
  locale: 'en_US',
  /** From her Instagram bio: "Text +15085061845 with questions". */
  phone: '(508) 506-1845',
  phoneE164: '+15085061845',
  /** From her bridal brochure. */
  email: EMAIL,
  /** In-salon booking: her live GlossGenius page (link in bio), tracking parameters removed. */
  booking: 'https://sassbykass.glossgenius.com/',
  /** Bridal & wedding inquiries: HoneyBook when supplied, her email until then. */
  bridal: HONEYBOOK ?? BRIDAL_MAILTO,
  bridalIsHoneyBook: HONEYBOOK !== null,
  instagram: { handle: '@sassbykass', url: 'https://www.instagram.com/sassbykass/' },
  /** The only location on record is the state ("MA"). */
  area: { label: 'Massachusetts', region: 'Massachusetts', regionCode: 'MA' },
  specialties: ['Bridal hair', 'Hand-tied extensions', 'Dimensional color'] as const,
  links: {
    about: '/about',
    services: '/services',
    portfolio: '/portfolio',
    reviews: '/reviews',
    book: '/book',
  },
  nav: [
    { href: '/about', label: 'About Kass', note: 'The artist behind the chair' },
    { href: '/services', label: 'Bridal Services', note: 'Weddings, then the salon' },
    { href: '/portfolio', label: 'Portfolio', note: 'Photos and films' },
    { href: '/reviews', label: 'Reviews', note: 'Kind words from clients' },
    { href: '/book', label: 'Book / Inquire', note: 'Wedding or salon' },
  ],
} as const;

export const TEL = `tel:${SITE.phoneE164}`;
export const SMS = `sms:${SITE.phoneE164}`;
/** Attributes for a link that leaves the site (HoneyBook, GlossGenius, Instagram). A mailto
 *  fallback opens the visitor's mail app and needs no new tab. */
export const ext = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {});
