/**
 * Central site constants (non-secret) for the Sass by Kass demo.
 *
 * SOURCE OF TRUTH: the material supplied for this prospect only — her Instagram profile
 * (@sassbykass: "KASSANDRA : MA HAIR STYLIST", "Hand-Tied Extensions & Dimensional hair",
 * "BOOKING 2026 BRIDES", "Text +15085061845 with questions", GlossGenius link), her
 * "Meet your hairstylist" card (lived-in color & bridal, MA) and her supplied photos and
 * clips. Anything the materials do not establish is left `null` and never guessed:
 * no prices, no years in business, no salon address, no reviews.
 */
export const SITE = {
  name: 'Sass by Kass',
  owner: 'Kassandra',
  nick: 'Kass',
  /** Wordmark sub-line and the <title> suffix. */
  tagline: 'Hair by Kassandra',
  role: 'Massachusetts hair stylist',
  description:
    'Sass by Kass is Kassandra — a Massachusetts hair stylist specializing in hand-tied extensions, dimensional color and bridal hair. Book online in a minute, or text with questions.',
  /** Demo origin only. Her real domain (if any) is never pointed at this build. */
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://sass-by-kass-demo.vercel.app',
  locale: 'en_US',
  /** From her Instagram bio: "Text +15085061845 with questions". */
  phone: '(508) 506-1845',
  phoneE164: '+15085061845',
  /** Her live online booking (link in bio), tracking parameters removed. */
  booking: 'https://sassbykass.glossgenius.com/',
  instagram: { handle: '@sassbykass', url: 'https://www.instagram.com/sassbykass/' },
  /** No public email was supplied. */
  email: null as string | null,
  /** The only location on record is the state ("MA"). */
  area: { label: 'Massachusetts', region: 'Massachusetts', regionCode: 'MA' },
  specialties: ['Hand-tied extensions', 'Dimensional color', 'Bridal hair'] as const,
  links: {
    work: '/work',
    services: '/services',
    about: '/about',
    book: '/book',
    enquiry: '/book#enquiry',
    bridal: '/book?for=bridal',
    extensions: '/book?for=extensions',
  },
  nav: [
    { href: '/work', label: 'Work', note: 'Color, extensions, bridal' },
    { href: '/services', label: 'Services', note: 'What Kass does' },
    { href: '/about', label: 'Meet Kass', note: 'The stylist behind the chair' },
    { href: '/book', label: 'Book', note: 'Online booking & enquiries' },
  ],
} as const;

export const TEL = `tel:${SITE.phoneE164}`;
export const SMS = `sms:${SITE.phoneE164}`;
