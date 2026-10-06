/**
 * Central site constants (non-secret) for the Magnolia Healthcare demo.
 *
 * EVERY business fact here comes from Magnolia's current public website
 * (magnoliahealthcareservices.com) as captured in docs/00-assessment.md.
 * Nothing below is invented. Items marked CONFIRM are known from the site but
 * should be re-verified against the client's recordings before the demo is sent.
 */
export const SITE = {
  name: 'Magnolia Healthcare',
  legalName: 'Magnolia Healthcare LLC',
  /** Existing site <title>: "Denver Metro Home Care" */
  tagline: 'Denver Metro Home Care',
  description:
    'Magnolia Healthcare is a locally owned, Colorado-licensed provider of non-medical home care in Arvada and the Denver Metro area — personal care, homemaking, companionship, and Alzheimer’s & dementia support, at home.',
  /** Demo origin only. Magnolia's real domain is never pointed at this build. */
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://magnolia-healthcare-demo.vercel.app',
  /** The client's current, live website (for reference links in the demo footer). */
  currentSite: 'https://www.magnoliahealthcareservices.com',
  locale: 'en_US',
  founded: 2023,
  founder: 'Madina Sorensen',
  address: {
    street: '8795 Ralston Rd., Suite 245',
    locality: 'Arvada',
    region: 'CO',
    postalCode: '80002',
    country: 'US',
  },
  phone: '720-661-9498',
  phoneE164: '+17206619498',
  fax: '303-500-1236',
  email: 'Wecare@Magnoliahealthcareservices.com',
  /** Accessibility-statement contact on the current site (separate inbox). */
  accessibilityEmail: 'magnoliahealthcare1@gmail.com',
  hours: [
    { day: 'Monday', open: '08:30', close: '17:30' },
    { day: 'Tuesday', open: '08:30', close: '17:30' },
    { day: 'Wednesday', open: '08:30', close: '17:30' },
    { day: 'Thursday', open: '08:30', close: '17:30' },
    { day: 'Friday', open: '08:30', close: '17:30' },
    { day: 'Saturday', open: null, close: null },
    { day: 'Sunday', open: null, close: null },
  ],
  hoursNote: 'Closed major holidays.',
  // Arvada, CO town-centre approximation — LocalBusiness geo only.
  geo: { latitude: 39.8028, longitude: -105.0875 },
  /** The current site describes the service area as the Denver Metro. The exact
   *  list of cities/counties is a CONFIRM item for the client. */
  serviceArea: { label: 'Arvada & the Denver Metro area', regions: ['Denver Metro'] },
  links: {
    consult: '/contact',
    consultCare: '/contact?for=care',
    services: '/services',
    mission: '/mission',
    team: '/team',
    community: '/community',
    blog: '/blog',
    careers: '/careers',
    apply: '/apply',
    login: '/login',
    accessibility: '/accessibility',
  },
  nav: [
    { href: '/services', label: 'Services', note: 'Four kinds of care, at home' },
    { href: '/mission', label: 'Our Mission', note: 'More than a provider — a family' },
    { href: '/team', label: 'Our Caregivers', note: 'Selected, trained, trusted' },
    { href: '/community', label: 'Community', note: 'Events & connection' },
    { href: '/blog', label: 'Blog', note: 'From the Magnolia team' },
    { href: '/contact', label: 'Contact', note: 'Request a consultation' },
  ],
} as const;

export const fmtTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return m ? `${h12}:${String(m).padStart(2, '0')} ${ap}` : `${h12} ${ap}`;
};
