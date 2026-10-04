/* ==========================================================================
   SERVICES — three pillars, one shape. The Services page, the homepage
   overview, the detail routes and the inquiry form's "what do you need"
   options all read from here, so adding a service never means editing five
   templates.

   Hard rule inherited from the original site: no performance promises. No
   entry may claim a ranking, a lead count, a return on ad spend, or a
   percentage. `assertNoClaims()` in planner/logic.js guards generated copy;
   this file is guarded by review.
   ========================================================================== */

export interface Service {
  slug: string;
  name: string;
  /** H1 on the detail page, where it differs from `name` — Meta's service is
      sold as Meta Ads but bought as Facebook and Instagram, so the page says
      both while the brand name stays short everywhere else. */
  pageTitle?: string;
  /** Navigation label, where the menu needs more than `name`. */
  navLabel?: string;
  /** <title> and meta description for the detail page. */
  seoTitle: string;
  seoDescription: string;
  /** Nav/card short form. */
  short: string;
  /** One sentence, used on the homepage overview and the services index. */
  blurb: string;
  /** The problem this pillar actually solves, in the buyer's words. */
  problem: string;
  /** Detail-page intro. */
  intro: string;
  /** What the work includes. Deliverables, not outcomes. */
  includes: string[];
  /** Who the service actually suits, and the one case where it does not.
      Buyers self-select here before reading the deliverables. */
  fitFor: { t: string; d: string }[];
  /** The honest counter-case: when this is the wrong thing to buy. */
  notFor: string;
  /** Honest boundaries — what this service is not. */
  limits: string[];
  /** Detail-page process, 3–4 steps. */
  steps: { t: string; d: string }[];
  /** Maps to the inquiry form's `need` field. */
  needValue: string;
  /** Blog post ids that support this page's intent. Informational content
      pointing at the commercial page, not competing with it. Ids must match
      filenames in src/content/blog. */
  reading: string[];
}

export const SERVICES: Service[] = [
  {
    slug: 'web-design-development',
    name: 'Web Design & Development',
    seoTitle: 'Web Design & Development in Massachusetts',
    seoDescription:
      'Custom business websites, redesigns and landing pages, designed and built end to end. Massachusetts-based, working nationwide. Start with a free homepage demo.',
    short: 'Websites',
    blurb:
      'Custom business websites, redesigns and landing pages — designed around how your customers actually decide.',
    problem:
      'Your site came from the same builder as three competitors’, or it has quietly stopped doing its job.',
    intro:
      'This is the core of the business and the reason the free demo exists. I design and build the site myself — structure, copy, design, code and launch — so the person you talk to on the first call is the person who ships it.',
    includes: [
      'Custom design, not a template with your logo dropped in',
      'Mobile-first build that stays fast on a phone over LTE',
      'Copywriting from an hour of your time, not a blank document you have to fill',
      'Service pages, project galleries and FAQs where they earn their place',
      'Inquiry forms, click-to-call and click-to-email wired and tested',
      'On-page SEO: titles, metas, heading structure, schema, sitemap',
      'Analytics and Search Console connected before your site goes live',
      'Domain connection, launch, and a post-launch support window',
    ],
    fitFor: [
      { t: 'A business with no website at all', d: 'Or one that exists only as a social page, which you do not own and cannot change the rules of.' },
      { t: 'A site that looks nothing like the quality of the work', d: 'The most common reason a good business loses the call to a worse one.' },
      { t: 'A site that gets traffic but no calls', d: 'That is a structure problem, and it is usually solvable without a full rebuild.' },
      { t: 'A business about to start advertising', d: 'Paid clicks landing on a page that cannot answer them is the most expensive mistake in small-business marketing.' },
    ],
    notFor:
      'If your current site is working and you simply dislike how it looks, say so on the call — a redesign is sometimes the wrong purchase, and I would rather tell you that than sell you one.',
    limits: [
      'I do not sell monthly SEO retainers and I will not promise rankings.',
      'I take one project at a time. If I am at capacity I say so rather than leave you waiting.',
      'If a cheaper option is genuinely right for you, I will tell you that instead.',
    ],
    steps: [
      { t: 'The free demo', d: 'Answer the planner, and I design your homepage concept for free. You decide after you have seen it.' },
      { t: 'Scope and date', d: 'A written scope, a fixed price and a launch date, agreed before any work starts.' },
      { t: 'Build and review', d: 'You review on a real URL, not a PDF. Revision rounds are named in the proposal.' },
      { t: 'Launch and hand over', d: 'Domain, hosting, code, content and analytics are all in your name from day one.' },
    ],
    needValue: 'Website / Web Development',
    reading: [
      'what-a-small-business-website-needs-to-convert',
      'signs-your-website-needs-a-redesign',
      'website-seo-basics-for-small-businesses',
    ],
  },
  {
    slug: 'google-ads',
    name: 'Google Ads',
    seoTitle: 'Google Ads Management in Massachusetts',
    seoDescription:
      'Google Ads and PPC management for small and local businesses: campaign setup, keyword strategy, negative keywords, conversion tracking and ongoing optimisation.',
    short: 'Google Ads',
    blurb:
      'Search campaigns for people already looking for what you do — set up properly, tracked honestly, managed month to month.',
    problem:
      'Someone searches for your service tonight. Right now a competitor is the result they tap.',
    intro:
      'Google Ads reaches people at the moment they are looking. That makes it the most direct channel available to a local business — and the easiest to waste money on, because a campaign that is not tracking conversions is just buying clicks.',
    includes: [
      'Account and campaign structure built from your services, not a generic template',
      'Keyword research, match types, and a negative keyword list from day one',
      'Search campaigns written around what people actually type',
      'Conversion tracking for calls and form submissions, verified before spend starts',
      'Landing-page alignment so the click lands on a page about what was searched',
      'Geographic targeting set to the area you actually serve, and exclusions for the areas you do not',
      'Ad scheduling matched to when enquiries actually arrive and get answered',
      'Call extensions, so urgent customers can ring you straight from the ad',
      'Ongoing optimisation: search terms, negative keywords, bids, budget, ad copy',
      'Plain-English reporting on what was spent and what came back',
    ],
    fitFor: [
      { t: 'Urgent and emergency services', d: 'Plumbing, roofing after a storm, locksmiths, auto repair. The search is the moment of need, and whoever appears gets the call.' },
      { t: 'Established, well-understood services', d: 'Cleaning, landscaping, accounting, legal. People already know these exist and search for them by name.' },
      { t: 'High-consideration local purchases', d: 'Someone researching a contractor for a kitchen remodel searches, compares and reads. You want to be in that comparison.' },
      { t: 'Businesses with a page worth landing on', d: 'Search advertising buys attention. What happens in the ten seconds after the click is the landing page’s job.' },
    ],
    notFor:
      'If nobody is searching for what you sell yet — a new treatment, an unfamiliar offer — search cannot help, because there is no existing demand to capture. That is a Meta Ads problem, and I will say so rather than spend your budget finding out.',
    limits: [
      'I will not promise a cost per lead or a return on ad spend before a campaign has data.',
      'Ad spend is paid by you directly to Google. It is never bundled into my fee.',
      'If your landing page is not ready, I will say so before running ads to it.',
    ],
    steps: [
      { t: 'Account review', d: 'What exists, what it has cost, and whether conversions were ever tracked correctly.' },
      { t: 'Structure and tracking', d: 'Campaigns, keywords and conversion tracking set up and tested before spend begins.' },
      { t: 'Launch small', d: 'Start at a controlled budget, confirm the data is real, then scale what works.' },
      { t: 'Manage and report', d: 'Ongoing optimisation with reporting you can actually read.' },
    ],
    needValue: 'Google Ads',
    reading: [
      'how-google-ads-works-for-service-businesses',
      'google-ads-vs-meta-ads-for-local-business',
      'fix-the-landing-page-before-running-ads',
    ],
  },
  {
    slug: 'meta-ads',
    name: 'Meta Ads',
    pageTitle: 'Meta Ads — Facebook & Instagram',
    navLabel: 'Meta Ads — Facebook & Instagram',
    seoTitle: 'Facebook & Instagram Ads Management',
    seoDescription:
      'Facebook and Instagram campaigns run from one Meta Ads Manager account: audience strategy, creative, retargeting, Pixel tracking and plain-English reporting.',
    short: 'Meta Ads',
    blurb:
      'Facebook and Instagram advertising for demand you have to create rather than capture — audiences, creative and tracking handled together.',
    problem:
      'Nobody searches for a service they have not thought about yet. Facebook and Instagram are how they find out it exists.',
    intro:
      'Facebook and Instagram are one advertising system — Meta Ads — run from a single Ads Manager account, with one pixel, one set of audiences and one budget deciding which feed an ad appears in. Treating them as two separate campaigns is how small budgets get split in half. Meta advertising also works differently from search: you are interrupting rather than answering, so the creative carries most of the weight, while setup and tracking decide whether any of it is measurable.',
    includes: [
      'Facebook and Instagram campaign setup in Meta Ads Manager, inside your own Business Manager',
      'Audience strategy: interest and behaviour targeting, lookalikes, custom audiences and exclusions',
      'Retargeting the people who already visited your site or engaged with your posts',
      'Creative direction and ad copy built for the feed and for Stories and Reels, not repurposed print',
      'Meta Pixel and Conversions API setup, verified end to end',
      'Placement strategy across Facebook, Instagram and the rest of the Meta network',
      'Landing page or instant lead form, aligned with the ad that sent the click',
      'Ongoing testing of creative, audience and placement',
      'Reporting on spend, results and what is being learned',
    ],
    fitFor: [
      { t: 'Visual results', d: 'Beauty, aesthetics, fitness, interiors, photography, food. A before-and-after stops a thumb in a way a text ad cannot.' },
      { t: 'New or unfamiliar offers', d: 'If you have to explain it before someone wants it, search cannot help — nobody searches for what they have not heard of.' },
      { t: 'Impulse and discretionary purchases', d: 'Treatments, classes, events, seasonal offers — decisions made in the feed rather than researched.' },
      { t: 'Retargeting, for almost any business', d: 'Showing a relevant ad to someone who already visited your site is among the most sensible advertising a small business can run.' },
    ],
    notFor:
      'If people are already searching for exactly what you sell, Google is usually the cheaper first move and Meta is better kept for retargeting. I have written about how to tell the two apart.',
    limits: [
      'I will not promise a lead volume or a return before a campaign has data.',
      'Accounts, pixels and audiences stay in your Business Manager, in your name.',
      'Creative needs real material — photos, video, or a plan to get them.',
    ],
    steps: [
      { t: 'Offer and audience', d: 'What you are selling, who should see it on Facebook or Instagram, and whether Meta is the right channel at all.' },
      { t: 'Tracking first', d: 'Pixel and Conversions API set up and verified before any budget runs.' },
      { t: 'Test deliberately', d: 'A small number of real variables at a time, so results mean something.' },
      { t: 'Scale what works', d: 'Budget follows evidence, and the reporting shows you the same numbers I see.' },
    ],
    needValue: 'Meta / Facebook Ads',
    reading: [
      'google-ads-vs-meta-ads-for-local-business',
      'fix-the-landing-page-before-running-ads',
    ],
  },
];

export const bySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

/* The "What do you need?" options live in lib/intake.ts — one canonical list
   shared by the contact page, the planner and these service pages. */
export { NEED_OPTIONS } from '../lib/intake';
