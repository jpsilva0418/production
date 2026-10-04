/* ==========================================================================
   INDUSTRIES — who the services are a fit for.

   This is deliberately NOT the portfolio. /work is things JP has actually
   built; this is the kinds of business the work suits. The distinction is
   load-bearing, so the copy here says "I work with" and "this is a fit for",
   never "my clients include" — the only claimed clients are the three real
   projects in data/projects.ts.

   One hub page at /industries. Individual industry routes are added only
   when there is genuinely unique content to carry one; the construction page
   is the single example that earns it today, and `detail` links it.
   ========================================================================== */

export interface Industry {
  slug: string;
  name: string;
  /** One line on the card. */
  blurb: string;
  /** The business types this covers. Examples, not a client list. */
  examples: string[];
  /** What this kind of buyer's website actually has to do. */
  note: string;
  /** A dedicated page, where one exists and is worth having. */
  detail?: string;
  /** Pill tint from the design system. */
  tint: 'blue' | 'green' | 'amber' | 'red';
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'construction-home-services',
    name: 'Construction & home services',
    blurb:
      'Trades where the job is urgent, the quote is the conversion, and most of the traffic arrives on a phone.',
    examples: [
      'Contractors', 'Roofing', 'Cleaning', 'Landscaping', 'HVAC',
      'Plumbing', 'Electricians', 'Painters', 'Remodeling',
    ],
    note:
      'Someone with a leak is not browsing. The site has to answer the question, prove you are real, and put a phone number under their thumb — all before they lose patience with a slow page.',
    detail: '/industries/construction-web-design',
    tint: 'amber',
  },
  {
    slug: 'beauty-wellness',
    name: 'Beauty & wellness',
    blurb:
      'Visual work where the portfolio is the sale and booking has to be two taps away.',
    examples: [
      'Salons', 'Makeup artists', 'Hairstylists', 'Barbers',
      'Nail, lash & brow studios', 'Spas', 'Wellness businesses',
    ],
    note:
      'Clients decide by looking. The gallery is the spine of the site, not a subpage — and it has to stay fast on the phone they are scrolling it on.',
    tint: 'red',
  },
  {
    slug: 'creative-media',
    name: 'Creative & media',
    blurb:
      'People whose work is the proof, where the site has to get out of the way of it.',
    examples: [
      'Photographers', 'Videographers & filmmakers', 'Studios',
      'Creators', 'Production businesses',
    ],
    note:
      'Heavy media and a fast site are usually treated as a trade-off. They are not — it is a compression and loading problem, and it is solvable.',
    tint: 'blue',
  },
  {
    slug: 'professional-services',
    name: 'Professional services',
    blurb:
      'Considered purchases where credibility has to be established before anyone makes contact.',
    examples: [
      'Consultants', 'Accountants', 'Attorneys & law firms',
      'Agencies', 'Independent professionals',
    ],
    note:
      'Nobody hires an advisor from a thin page. Depth on what you actually do, who you do it for, and what happens on the first call is what earns the enquiry.',
    tint: 'green',
  },
  {
    slug: 'restaurants-hospitality',
    name: 'Restaurants & hospitality',
    blurb:
      'Where menu, hours and location are the whole job, and most sites get that exactly backwards.',
    examples: [
      'Restaurants', 'Cafés', 'Bars', 'Hotels & hospitality', 'Event businesses',
    ],
    note:
      'Menu and hours first, one tap from the homepage. Everything else is secondary — and a PDF menu on a phone loses customers to the place next door.',
    tint: 'amber',
  },
  {
    slug: 'real-estate',
    name: 'Real estate',
    blurb:
      'Listings that have to stay current, and valuation enquiries that have to reach a person.',
    examples: [
      'Agents', 'Brokers', 'Property management', 'Developments',
    ],
    note:
      'Listing structure decides whether a property page is findable at all, and whether the enquiry on it reaches the right agent while the lead is still warm.',
    tint: 'blue',
  },
];

export const byIndustrySlug = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);
