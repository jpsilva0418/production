/**
 * Central site constants (non-secret) for the Sass by Kass demo.
 *
 * SOURCE OF TRUTH: the material supplied for this prospect only —
 *  · her Instagram profile (@sassbykass: "KASSANDRA : MA HAIR STYLIST", "Hand-Tied Extensions &
 *    Dimensional hair", "BOOKING 2026 BRIDES", "Text +15085061845 with questions", GlossGenius link);
 *  · her bridal reference brochure ("Kassandra Ortiz", "SassByKass@yahoo.com", "Bridal and Hair
 *    Artistry", bridal bookings confirmed by email with a contract and deposit);
 *  · the founder's handoffs (Nov 2026): bridal-first; bridal inquiries on-site, salon via GlossGenius;
 *  · her supplied photos and clips.
 * Anything the materials do not establish is left `null` and never guessed: no prices, no years in
 * business, no salon address, no reviews.
 */

/** HoneyBook: Kass may use it AFTER receiving an inquiry (contract, availability, deposit). It is
 *  not the website's bridal entry point — the on-site /bridal-inquiry form is (handoff v2). */

const EMAIL = 'SassByKass@yahoo.com';

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
  /** Bridal & wedding inquiries: the on-site, bridal-only inquiry page. */
  bridal: '/bridal-inquiry',
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
    blog: '/blog',
    bridalInquiry: '/bridal-inquiry',
  },
  nav: [
    { href: '/about', label: 'About Kass', note: 'The artist behind the chair' },
    { href: '/services', label: 'Bridal Services', note: 'Weddings, then the salon' },
    { href: '/portfolio', label: 'Portfolio', note: 'Photos and films' },
    { href: '/reviews', label: 'Reviews', note: 'Kind words from clients' },
    { href: '/blog', label: 'Blog', note: 'Bridal hair notes' },
    { href: '/book', label: 'Book / Inquire', note: 'Wedding or salon' },
  ],
} as const;

export const TEL = `tel:${SITE.phoneE164}`;
export const SMS = `sms:${SITE.phoneE164}`;
/** Attributes for a link that leaves the site (HoneyBook, GlossGenius, Instagram). A mailto
 *  fallback opens the visitor's mail app and needs no new tab. */
/** External links open in the SAME tab (founder decision, Nov 2026): a plain https anchor is the
 *  smoothest one-tap handoff, especially inside Instagram's in-app browser, where target=_blank
 *  forces a new-window handoff. No window.open, no redirects, no app-scheme tricks. */
export const ext = (href: string) => (href.startsWith('http') ? { rel: 'external' } : {});
