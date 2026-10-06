/**
 * VERBATIM MAGNOLIA CONTENT — the single copy source for the design previews.
 * Every string here was transcribed from Magnolia Healthcare, Inc.'s own materials
 * (docs/03-preservation-map.md). Concepts may re-stage, re-order and re-style these blocks;
 * they may NOT add business facts, claims, names, numbers, services or testimonials.
 */
import { SITE, TESTIMONIALS, TBC } from '../consts';
export { SITE, TESTIMONIALS, TBC };

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/mission', label: 'Our Mission' },
  { href: '/blog', label: 'Blog' },
  { href: '/consultation', label: 'Consultation' },
  { href: '/careers', label: 'Careers' },
] as const;
export const LOGIN = { href: '/login', label: 'Log in' } as const;

export const HERO = {
  headline: 'Because every life matters',
  sub: 'Home care agency',
  cta: 'Free consultation',
  ctaHref: SITE.links.consultCare,
  /** The supplied CTA banner's service-area line — the only location fact on record. */
  area: 'Anywhere in Massachusetts',
} as const;

export const MISSION = {
  heading: 'Our Mission',
  eyebrow: 'Dedicated professionals at your service',
  sentences: [
    'Our mission is to provide a higher standard of care — one built on compassion, excellence, and respect for every individual.',
    'We believe caring for someone means seeing the person beyond their needs and creating an environment where they feel safe, valued, and understood.',
    'Our caregivers are thoughtfully selected, trained, and committed to bringing warmth, dignity, and genuine human connection into every home.',
    'We are committed to delivering exceptional care, maintaining the highest standards, and being a trusted partner to every client and family we serve.',
  ],
  /** The three words the statement itself leans on — usable as a values triplet. */
  values: ['Compassion', 'Excellence', 'Respect'],
} as const;

export const SECTION_LABELS = {
  why: 'Why choose us?',
  specialized: 'Specialized care',
  how: 'How we help',
  voices: 'What our clients say',
  blog: 'Magnolia Moments',
  team: 'Join our team',
} as const;

/** "Let's talk…" banner (the consultation page). Only `free consultation` and the
 *  Massachusetts line are approved claims; the other two icon captions stay out. */
export const BANNER = {
  eyebrow: 'Care starts here',
  heading: 'Let’s talk about the care your family needs.',
  body: 'Tell us a little about your loved one. We’ll reach out to set up a free consultation and find the caregiver who fits them best.',
  points: ['Free consultation', 'Anywhere in Massachusetts'],
  cta: 'Free consultation',
  ctaHref: SITE.links.consultCare,
} as const;

export const CAREERS = {
  banner: 'Join our team',
  heading: 'Interested in joining our team?',
  body: 'We’d love to hear from you! Please complete our application and email the completed form to us. We look forward to learning more about you and your experience.',
  download: 'Download our application form',
  pdf: '/downloads/magnolia-healthcare-caregiver-application.pdf',
  apply: SITE.links.apply,
} as const;

export const FOUNDER = {
  /** No name, biography, credentials or founding year exist in the materials. */
  label: 'Founder',
  name: SITE.founder ?? TBC,
  note: 'The woman in white at the centre of the team photograph. Name and story to be supplied by Magnolia.',
  plate: 'founder',
} as const;

export const FOOTER = {
  legal: SITE.legalName,
  email: SITE.email,
  area: HERO.area,
  tagline: SITE.tagline,
} as const;

/** Supplied media (docs/MEDIA.md). Everything else in src/assets/plates is a generated placeholder. */
export const MEDIA = {
  heroFilm: { webm: '/media/hero-film.webm', mp4: '/media/hero-film.mp4', poster: '/media/hero-poster.jpg', note: 'companion walking arm-in-arm with an older woman, bright corridor, 14 s' },
  cineFilm: { webm: '/media/cine-film.webm', mp4: '/media/cine-film.mp4', poster: '/media/cine-poster.jpg', note: 'caregiver helping an older woman with medication at a kitchen table, 12 s' },
  plates: {
    team5: 'supplied-team-5',      // five people, founder in white at centre, magnolia sign (652×452)
    team4: 'supplied-team',        // four caregivers in scrubs, lotus sign (640×654)
    clinician: 'supplied-clinician', // clinician in blue scrubs, 4:5-ish (1063×1057)
    founder: 'founder',            // 4:5 crop of the founder (560×698)
    hug: 'dementia',               // caregiver embracing an older woman, kitchen, walker (624×468)
    couple: 'companionship',       // caregiver with an older couple (448×336, soft)
    window: 'personal-care',       // woman pointing out of a window beside an older woman (602×452)
  },
} as const;
