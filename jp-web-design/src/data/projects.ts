/* ==========================================================================
   PROJECTS — real work only.

   Every entry here is a project JP built and supplied recordings of. There
   are no invented businesses, no borrowed logos and no case studies for
   clients that do not exist.

   HARD RULE — outcomes. `outcome` describes what was built and what it does.
   It may never contain a metric that was not measured and supplied by the
   client: no percentage lifts, no lead counts, no revenue, no ROAS. If a
   real, verified number arrives later, it goes in `results` with its source
   named — and until then `results` stays null and the card renders without
   it. This is the same honesty rule the original spec-build plates used.

   `status` follows the plate system: 'live' for work in service,
   'development' for work not yet public. Labels only ever upgrade.
   ========================================================================== */

export interface Project {
  slug: string;
  name: string;
  category: string;
  /** Card summary — one sentence. */
  summary: string;
  /** Services actually provided on this project. */
  services: string[];
  status: 'live' | 'development';
  /** Public URL, or null while a project is not yet published. */
  url: string | null;
  /** Poster frame from JP's own screen recording. */
  image: string;
  imageAlt: string;
  /** Optional screen recording shown on the detail page. */
  clip: string | null;
  /** Detail page. */
  overview: string;
  challenge: string;
  work: string[];
  outcome: string;
  /** Verified, client-supplied figures only. Null until then. */
  results: { label: string; value: string; source: string }[] | null;
  /** Accent used for the card's media backdrop. */
  tint: string;
}

export const PROJECTS: Project[] = [
  {
    slug: 'leti-silva-beauty',
    name: 'Leti Silva Beauty',
    category: 'Beauty & bridal',
    summary:
      'A bridal and wedding makeup studio in Westborough, Massachusetts, with a portfolio that has to carry the sale.',
    services: ['Web design', 'Web development', 'Content structure', 'On-page SEO'],
    status: 'live',
    url: 'https://letisilvabeauty.com',
    image: '/media/leti.jpg',
    imageAlt: 'The Leti Silva Beauty homepage, showing the studio wordmark over a bridal photograph',
    clip: '/media/leti',
    overview:
      'Leti Silva Beauty is a luxury bridal makeup studio serving weddings across New England. In this category the buying decision is almost entirely visual: a bride is comparing portfolios, and whichever one feels most like her own wedding wins the inquiry.',
    challenge:
      'Bridal portfolios usually fail in one of two ways. Either the photography is buried three clicks deep behind a brochure site, or the gallery is so heavy it stalls on the phone every bride is actually browsing on. The site also had to carry a second audience — studio services and makeup lessons — without diluting the bridal story.',
    work: [
      'Built the portfolio as the spine of the site rather than a subpage, so the work is the first thing encountered.',
      'Structured bridal, studio services and makeup classes as distinct paths that do not compete on the homepage.',
      'Designed a full-screen navigation that keeps the type and the imagery in the same editorial register.',
      'Built a multi-step inquiry flow that asks what the day needs — bride only, bridal party, trial, destination — so the first reply can be specific.',
      'Set up the blog as a real content surface for bridal planning questions, not an empty "news" page.',
    ],
    outcome:
      'A site where the portfolio does the selling and the inquiry form arrives pre-qualified, with the day, location and party size already answered.',
    results: null,
    tint: '#2a211c',
  },
  {
    slug: 'vcleaning-services',
    name: 'V Cleaning Services',
    category: 'Home & commercial services',
    summary:
      'A family-run cleaning company in Central Massachusetts that competes against national franchises for the same searches.',
    services: ['Web design', 'Web development', 'Local SEO foundation', 'Quote funnel'],
    status: 'live',
    url: 'https://vcleaningservices.com',
    image: '/media/vcleaning.jpg',
    imageAlt: 'The V Cleaning Services homepage, showing the "V is for Vital" hero over a photograph of the cleaning team',
    clip: '/media/vcleaning',
    overview:
      'V Cleaning Services has cleaned homes, offices, schools and post-construction sites around Clinton and Central Massachusetts for nearly thirty years. The competition on every search result is a national franchise with a marketing department.',
    challenge:
      'A service business with three distinct offerings — residential, commercial and post-construction — usually ends up with one vague "our services" page that ranks for nothing and answers nobody. The site also had to make a thirty-year family business feel more credible than a franchise, without a single fabricated review.',
    work: [
      'Split the offering into residential, commercial and construction cleaning, each with its own real page and vocabulary.',
      'Wrote an honest comparison section measuring the company against named national competitors on criteria a buyer actually weighs.',
      'Built a three-step quote funnel — property, service, contact — that is short enough to finish on a phone.',
      'Put tap-to-call and a free quote in a persistent bar, because home-services traffic is overwhelmingly mobile.',
      'Structured service-area pages around the towns actually served rather than an invented radius.',
    ],
    outcome:
      'A site that answers the three different questions three different buyers arrive with, and routes all of them into one short quote form.',
    results: null,
    tint: '#d9e9f6',
  },
  {
    slug: 'behold-money',
    name: 'Behold Money',
    category: 'Software · Personal finance',
    summary:
      'A personal finance app — accounts, cash flow, calendar and an AI assistant — designed and built end to end.',
    services: ['Product design', 'Application development', 'Marketing site'],
    status: 'development',
    url: null,
    image: '/media/beholdmoney.jpg',
    imageAlt: 'The Behold Money marketing site, showing the app on a phone beneath the headline "Clarity for your money"',
    clip: '/media/beholdmoney',
    overview:
      'Behold Money is a personal finance application: connected accounts, net worth, cash flow, a money calendar, transaction history and an assistant that answers questions about your own spending. It is my own product, built to the same standard as client work.',
    challenge:
      'Personal finance apps fail at the first screen. They either demand every account be connected before showing anything, or they present a wall of charts that answers no question a person actually has. The hard problem is making a financial position legible in the five seconds before someone closes the app.',
    work: [
      'Designed the workspace around one question — what is safe to spend — rather than a dashboard of every available metric.',
      'Built account grouping, cash-flow summaries, a transaction calendar and recurring-item tracking.',
      'Added a themeable interface, including a full light mode, because finance apps are used in daylight.',
      'Built the assistant as a guided surface with real starting points instead of an empty chat box.',
      'Built and shipped the marketing site alongside the product.',
    ],
    outcome:
      'A working application and marketing site, currently in development ahead of a public release.',
    results: null,
    tint: '#1a1530',
  },
];

export const bySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export const STATUS_LABEL: Record<Project['status'], string> = {
  live: 'In service',
  development: 'In development',
};
