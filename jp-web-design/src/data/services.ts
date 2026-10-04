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
  /** Honest boundaries — what this service is not. */
  limits: string[];
  /** Detail-page process, 3–4 steps. */
  steps: { t: string; d: string }[];
  /** Maps to the inquiry form's `need` field. */
  needValue: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'web-design-development',
    name: 'Web Design & Development',
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
      'Analytics and Search Console connected before launch',
      'Domain connection, launch, and a post-launch support window',
    ],
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
    needValue: 'Website',
  },
  {
    slug: 'google-ads',
    name: 'Google Ads',
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
      'Ongoing optimisation: search terms, bids, budget, ad copy',
      'Plain-English reporting on what was spent and what came back',
    ],
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
  },
  {
    slug: 'meta-ads',
    name: 'Meta Ads',
    short: 'Meta Ads',
    blurb:
      'Facebook and Instagram campaigns for demand you have to create rather than capture — audiences, creative and tracking handled together.',
    problem:
      'Nobody searches for a service they have not thought about yet. Meta is how they find out it exists.',
    intro:
      'Meta advertising works differently from search: you are interrupting rather than answering, so the creative carries most of the weight. Setup, audiences and tracking still decide whether any of it is measurable.',
    includes: [
      'Facebook and Instagram campaign setup inside your own Business Manager',
      'Audience strategy: interest, lookalike, retargeting, and exclusions',
      'Creative direction and ad copy built for the feed, not repurposed print',
      'Pixel and Conversions API setup, verified end to end',
      'Landing page or lead form, aligned with the ad that sent the click',
      'Ongoing testing of creative, audience and placement',
      'Reporting on spend, results and what is being learned',
    ],
    limits: [
      'I will not promise a lead volume or a return before a campaign has data.',
      'Accounts, pixels and audiences stay in your Business Manager, in your name.',
      'Creative needs real material — photos, video, or a plan to get them.',
    ],
    steps: [
      { t: 'Offer and audience', d: 'What you are selling, who should see it, and whether Meta is the right channel at all.' },
      { t: 'Tracking first', d: 'Pixel and Conversions API set up and verified before any budget runs.' },
      { t: 'Test deliberately', d: 'A small number of real variables at a time, so results mean something.' },
      { t: 'Scale what works', d: 'Budget follows evidence, and the reporting shows you the same numbers I see.' },
    ],
    needValue: 'Meta / Facebook Ads',
  },
];

export const bySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

/** Options for the canonical inquiry form's "What do you need?" field. */
export const NEED_OPTIONS = [
  ...SERVICES.map((s) => s.needValue),
  'Multiple services',
  'Not sure yet',
];
