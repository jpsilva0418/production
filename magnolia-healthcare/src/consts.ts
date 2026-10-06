/**
 * Central site constants (non-secret) for the Magnolia Healthcare demo.
 *
 * SOURCE OF TRUTH: the Massachusetts client's own materials only — the screen
 * recordings of magnoliahealthcareinc.com, the supplied Caregiver Application PDF,
 * the supplied photos/videos and the supplied CTA banner (docs/00-assessment.md).
 * Nothing here is borrowed from any other company called "Magnolia Healthcare".
 * A fact the supplied materials do not establish is left `null` and rendered as an
 * explicit "to be confirmed" placeholder — never guessed.
 */
export const SITE = {
  name: 'Magnolia Healthcare',
  /** Footer and Instagram bio on the current site: "Magnolia Healthcare, inc." */
  legalName: 'Magnolia Healthcare, Inc.',
  /** Hero sub-line on the current site. */
  tagline: 'Home Care Agency',
  /** Hero headline on the current site. */
  headline: 'Because every life matters',
  /** From the current site's mission statement (verbatim first sentence). */
  description:
    'Magnolia Healthcare, Inc. is a Massachusetts home care agency. Our mission is to provide a higher standard of care — one built on compassion, excellence, and respect for every individual.',
  /** Demo origin only. Magnolia's real domain is never pointed at this build. */
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://magnolia-healthcare-demo.onrender.com',
  /** The client's current, live website (reference link in the demo footer). */
  currentSite: 'https://www.magnoliahealthcareinc.com',
  locale: 'en_US',
  /** "Join Our Team" page: applications are emailed to this address. */
  email: 'info@magnoliahealthcareinc.com',
  /** NOT established by the supplied materials — rendered as a placeholder. */
  phone: null as string | null,
  phoneE164: null as string | null,
  /** Street address: not established by the supplied materials. */
  address: null as null | { street: string; locality: string; region: string; postalCode: string },
  /** Office hours: not established by the supplied materials. */
  hours: null as null | { label: string; value: string }[],
  /** Founding year / founder name: not established. The founder is the woman in white
   *  at the centre of the supplied team photo; her name is supplied by Magnolia, never guessed. */
  founded: null as number | null,
  founder: null as string | null,
  /** The supplied CTA banner says "Anywhere in Massachusetts". */
  serviceArea: { label: 'Anywhere in Massachusetts', region: 'Massachusetts', regionCode: 'MA' },
  /** Floating contact buttons on the current site (Phone / Facebook / WhatsApp / Chat) —
   *  destinations were not captured, so these are labels only until confirmed. */
  social: { instagram: 'https://www.instagram.com/', facebook: null as string | null, whatsapp: null as string | null },
  links: {
    consult: '/consultation',
    consultCare: '/consultation?for=care',
    services: '/services',
    mission: '/mission',
    blog: '/blog',
    careers: '/careers',
    apply: '/apply',
    login: '/login',
  },
  /** The current site's menu: Home · Our Mission · Blog · Consultation · Careers (+ Log in).
   *  Services is added because the site's "Specialized Care" and "How We Help" sections
   *  deserve a destination of their own. */
  nav: [
    { href: '/services', label: 'Services', note: 'Specialized care & how we help' },
    { href: '/mission', label: 'Our Mission', note: 'Dedicated professionals at your service' },
    { href: '/blog', label: 'Blog', note: 'From the Magnolia team' },
    { href: '/careers', label: 'Careers', note: 'Join our team' },
    { href: '/consultation', label: 'Consultation', note: 'Free consultation' },
  ],
} as const;

/** Shown wherever a fact is not yet established by Magnolia's supplied materials. */
export const TBC = 'To be confirmed by Magnolia';

/** The three client testimonials carried on the current site's "What our clients say"
 *  carousel, transcribed from the screen recording. */
export const TESTIMONIALS = [
  { quote: 'The caregivers from Magnolia Services have made a world of difference in my mother’s life. They are attentive, kind, and truly care.', name: 'Olivia Bennet' },
  { quote: 'I can’t thank the team enough for their support during my recovery. They were not just caregivers; they became friends.', name: 'Jhenyfer Cristina', partial: true },
  { quote: 'My father has never been happier. The companionship and care he receives are remarkable.', name: 'Joseph Williams' },
] as const;
