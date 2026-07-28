/* ==========================================================================
   Recommendation engine — derive → compose → constrain → author.
   Deliberately NOT a decision tree: trees produce visibly branchy,
   template-swapped output. Composition produces plans that read as written.

   Hard rule enforced by assertNoClaims() at the bottom: nothing this file
   emits may promise rankings, revenue, lead volume, or cite a statistic.
   ========================================================================== */

export const BUSINESS_TYPES = [
  { id: 'construction', label: 'Construction or home services' },
  { id: 'beauty',       label: 'Beauty or wellness' },
  { id: 'professional', label: 'Professional services' },
  { id: 'restaurant',   label: 'Restaurant or hospitality' },
  { id: 'creative',     label: 'Creative or studio' },
  { id: 'realestate',   label: 'Real estate' },
  { id: 'ecommerce',    label: 'E-commerce' },
  { id: 'other',        label: 'Something else' },
];

export const SITUATIONS = [
  { id: 'none',      label: 'I do not have a website' },
  { id: 'outdated',  label: 'My website looks outdated' },
  { id: 'no_leads',  label: 'My website is not generating leads' },
  { id: 'hard_edit', label: 'My website is difficult to update' },
  { id: 'seo',       label: 'I need stronger SEO' },
  { id: 'new_biz',   label: 'I am starting a new business' },
  { id: 'store',     label: 'I need an online store' },
  { id: 'advanced',  label: 'I need advanced website features' },
  { id: 'unsure',    label: 'I am not sure yet' },
];

export const GOALS = [
  { id: 'leads',      label: 'Generate leads' },
  { id: 'booking',    label: 'Book appointments' },
  { id: 'sell',       label: 'Sell products' },
  { id: 'credible',   label: 'Build credibility' },
  { id: 'showcase',   label: 'Showcase work' },
  { id: 'rank',       label: 'Rank better in search engines' },
  { id: 'explain',    label: 'Explain my services' },
  { id: 'replace',    label: 'Replace an outdated website' },
  { id: 'other',      label: 'Something else' },
];

export const PACKAGE_CHOICES = [
  { id: 'starter', label: 'Starter Website',
    desc: 'A focused one-page website for a new or small business that needs a professional online presence.' },
  { id: 'growth',  label: 'Business Growth Website',
    desc: 'A strategic multi-page website with stronger SEO, service pages, and lead-generation features.' },
  { id: 'custom',  label: 'Custom Website',
    desc: 'A fully tailored website with advanced functionality, integrations, content, or SEO requirements.' },
  { id: 'unsure',  label: "I'm not sure yet",
    desc: 'Recommend the best option based on my answers.' },
  { id: 'else',    label: 'Something else',
    desc: 'Tell me briefly what you have in mind.' },
];

/* Grouped so a 17-option list is scannable rather than a wall. */
export const FEATURE_GROUPS = [
  { group: 'Getting inquiries', items: [
    { id: 'forms',    label: 'Contact or estimate forms' },
    { id: 'booking',  label: 'Online booking' },
    { id: 'reviews',  label: 'Reviews' },
    { id: 'advforms', label: 'Advanced forms' },
  ]},
  { group: 'Explaining the work', items: [
    { id: 'services', label: 'Service pages' },
    { id: 'gallery',  label: 'Project gallery' },
    { id: 'faq',      label: 'Frequently asked questions' },
    { id: 'blog',     label: 'Blog' },
  ]},
  { group: 'Getting found', items: [
    { id: 'localseo', label: 'Local SEO' },
    { id: 'areas',    label: 'Service-area pages' },
  ]},
  { group: 'Selling and systems', items: [
    { id: 'payments', label: 'Online payments' },
    { id: 'ecom',     label: 'E-commerce' },
    { id: 'crm',      label: 'CRM integration' },
    { id: 'email',    label: 'Email marketing integration' },
    { id: 'portal',   label: 'Customer portal' },
    { id: 'tools',    label: 'Custom interactive tools' },
  ]},
  { group: '', items: [
    { id: 'unsure',   label: 'I am not sure yet' },
  ]},
];

export const TIMELINES = [
  { id: 'asap',      label: 'As soon as possible' },
  { id: 'd30',       label: 'Within 30 days' },
  { id: 'm13',       label: 'Within one to three months' },
  { id: 'm3plus',    label: 'More than three months from now' },
  { id: 'research',  label: 'I am still researching' },
];

export const RECOMMEND_CHOICES = [
  { id: 'yes',     label: 'Yes, recommend the best option' },
  { id: 'know',    label: 'I already know what I need' },
  { id: 'discuss', label: 'I would like to discuss it first' },
];

/* -------------------------------------------------------------------------
   Stage 1 — Derive
   ------------------------------------------------------------------------- */
const CUSTOM_FEATURES = ['ecom', 'payments', 'portal', 'crm', 'tools', 'advforms'];
const GROWTH_FEATURES = ['services', 'gallery', 'localseo', 'areas', 'blog', 'faq', 'reviews'];

export function derive(a) {
  const f = a.features || [];

  const needsCommerce =
    a.goal === 'sell' || a.situation === 'store' || f.includes('ecom') ||
    a.businessType === 'ecommerce';

  const needsAdvanced =
    a.situation === 'advanced' || f.filter((x) => CUSTOM_FEATURES.includes(x)).length >= 2;

  const wantsBooking = a.goal === 'booking' || f.includes('booking');

  let archetype = 'CREDIBILITY';
  if (needsCommerce) archetype = 'ECOM';
  else if (wantsBooking) archetype = 'BOOKING';
  else if (a.goal === 'leads' || a.goal === 'rank' || a.situation === 'no_leads') archetype = 'LEAD_GEN';
  else if (a.goal === 'showcase') archetype = 'SHOWCASE';
  else if (a.businessType === 'construction' && a.goal === 'credible') archetype = 'B2B_CREDIBILITY';

  const depth = f.filter((x) => GROWTH_FEATURES.includes(x)).length;

  return { needsCommerce, needsAdvanced, wantsBooking, archetype, depth };
}

/* -------------------------------------------------------------------------
   Stage 2 — Choose the package
   ------------------------------------------------------------------------- */
export function recommendPackage(a) {
  const d = derive(a);
  const f = a.features || [];
  const reasons = [];

  if (d.needsCommerce) {
    reasons.push(
      a.goal === 'sell'
        ? 'you said the site’s main job is selling products'
        : 'you need an online store'
    );
  }
  if (d.needsAdvanced) reasons.push('the features you selected need custom build work');
  if (d.needsCommerce || d.needsAdvanced) {
    return { pkg: 'custom', reasons };
  }

  const growthSignals = [];
  if (a.goal === 'leads')          growthSignals.push('generating leads is the primary goal');
  if (a.goal === 'rank')           growthSignals.push('search visibility is the primary goal');
  if (a.situation === 'no_leads')  growthSignals.push('your current site is not producing inquiries');
  if (a.situation === 'seo')       growthSignals.push('you need a stronger SEO foundation');
  if (f.includes('services'))      growthSignals.push('you need individual service pages');
  if (f.includes('areas'))         growthSignals.push('you need service-area coverage');
  if (f.includes('localseo'))      growthSignals.push('local search matters to you');
  if (d.wantsBooking)              growthSignals.push('appointment booking has to work properly');
  if (d.depth >= 3)                growthSignals.push('the feature set you picked spans several pages');

  if (growthSignals.length >= 2) return { pkg: 'growth', reasons: growthSignals.slice(0, 3) };

  const starterSignals = [];
  if (a.situation === 'new_biz')  starterSignals.push('you are starting a new business');
  if (a.situation === 'none')     starterSignals.push('you do not have a site yet');
  if (a.goal === 'credible')      starterSignals.push('credibility is the main job, not lead volume');
  if (d.depth <= 1)               starterSignals.push('you do not need a wide page structure yet');

  if (starterSignals.length >= 2 && growthSignals.length === 0) {
    return { pkg: 'starter', reasons: starterSignals.slice(0, 3) };
  }

  return {
    pkg: 'growth',
    reasons: growthSignals.length
      ? growthSignals.slice(0, 3)
      : ['your answers point to more than a single page can carry'],
  };
}

/* -------------------------------------------------------------------------
   Stage 3 — Compose the page architecture.
   Named in the visitor's own vocabulary, never "Service Page 3".
   ------------------------------------------------------------------------- */
/* Pages carry a canonical key so a pack page and an archetype page that mean
   the same thing collapse instead of both appearing. "Book Online" and
   "Booking" in the same plan is exactly the tell that the output was
   assembled rather than written. */
const P = (key, label) => ({ key, label });

const PACK_PAGES = {
  construction: [P('services', 'Services'), P('proof', 'Recent Projects'), P('areas', 'Service Areas'),
                 P('credentials', 'Licenses & Insurance'), P('inquiry', 'Request an Estimate')],
  beauty:       [P('services', 'Treatments & Services'), P('proof', 'Before & After'), P('pricing', 'Pricing'),
                 P('booking', 'Book Online'), P('firstvisit', 'Your First Visit')],
  professional: [P('services', 'Practice Areas'), P('credentials', 'Team & Credentials'),
                 P('approach', 'Results & Approach'), P('inquiry', 'Consultation Request')],
  restaurant:   [P('menu', 'Menu'), P('hours', 'Location & Hours'), P('booking', 'Reservations'),
                 P('events', 'Private Events')],
  creative:     [P('proof', 'Portfolio'), P('services', 'Services'), P('about2', 'About the Studio'),
                 P('inquiry', 'Enquire')],
  realestate:   [P('listings', 'Listings'), P('buyers', 'Buyers'), P('sellers', 'Sellers'),
                 P('guides', 'Neighborhood Guides'), P('inquiry', 'Valuation Request')],
  ecommerce:    [P('shop', 'Shop'), P('product', 'Product Pages'), P('checkout', 'Cart & Checkout'),
                 P('policies', 'Shipping & Returns')],
  other:        [P('services', 'Services'), P('proof', 'Work')],
};

const ARCHETYPE_PAGES = {
  LEAD_GEN:        [P('inquiry', 'Quote Request')],
  BOOKING:         [P('booking', 'Booking'), P('policies', 'Booking Policies')],
  ECOM:            [P('shop', 'Categories'), P('checkout', 'Checkout'), P('policies', 'Store Policies')],
  SHOWCASE:        [P('proof', 'Gallery')],
  B2B_CREDIBILITY: [P('capabilities', 'Capabilities'), P('prequal', 'Prequalification'), P('careers', 'Careers')],
  CREDIBILITY:     [],
};

export function composePages(a) {
  const { pkg } = recommendPackage(a);
  const d = derive(a);
  const f = a.features || [];

  if (pkg === 'starter') {
    return {
      label: 'One page, structured in sections',
      pages: ['Hero', 'About', 'Services overview', 'Proof or gallery', 'Contact'],
    };
  }

  const base = [P('home', 'Home'), P('about', 'About'), P('contact', 'Contact')];
  const pack = (PACK_PAGES[a.businessType] || PACK_PAGES.other).slice(0, pkg === 'custom' ? 6 : 4);
  const arch = ARCHETYPE_PAGES[d.archetype] || [];

  const extra = [];
  if (f.includes('faq')) extra.push(P('faq', 'FAQ'));
  if (f.includes('reviews')) extra.push(P('reviews', 'Reviews'));
  if (f.includes('blog')) extra.push(P('blog', 'Insights'));
  /* Only add the area hub if the pack didn't already supply an areas page —
     and when it did, upgrade that page's label rather than duplicating it. */
  if (f.includes('areas')) extra.push(P('areas', 'Service Areas hub + up to 4 town pages'));

  const seen = new Map();
  for (const page of [...base, ...pack, ...arch, ...extra]) {
    // Later entries win on label so the more specific wording survives.
    if (seen.has(page.key)) seen.set(page.key, page);
    else seen.set(page.key, page);
  }

  const pages = [...seen.values()].map((x) => x.label);
  return { label: `${pages.length} pages`, pages };
}

/* -------------------------------------------------------------------------
   Stage 4 — Derived feature set and SEO focus.
   Deriving is more accurate than asking, and showing someone a list they
   never asked for but immediately recognise as correct is the real payoff.
   ------------------------------------------------------------------------- */
export function deriveFeatures(a) {
  const d = derive(a);
  const f = a.features || [];
  const out = new Set();

  out.add('Mobile-first layout and tap-to-call');
  if (d.archetype === 'LEAD_GEN' || a.businessType === 'construction') {
    out.add('Estimate form that qualifies before it reaches your inbox');
    out.add('Sticky call button on mobile');
  }
  if (d.wantsBooking) out.add('Booking integrated into navigation, not buried in the footer');
  if (d.needsCommerce) out.add('Product and category structure built for search');
  if (f.includes('gallery') || a.goal === 'showcase') out.add('Project galleries organised by job, not one long grid');
  if (f.includes('localseo') || f.includes('areas')) out.add('Google Business Profile alignment and consistent business details');
  if (f.includes('crm') || f.includes('email')) out.add('Form submissions delivered into your existing tools');
  if (a.businessType === 'beauty') out.add('Consent-governed before-and-after handling');
  if (a.businessType === 'professional') out.add('Credential and jurisdiction display');
  out.add('Analytics and Search Console configured at launch');

  return [...out];
}

export function seoFocus(a) {
  const f = a.features || [];
  const out = [];
  if (f.includes('areas')) {
    out.push('One page per service area you genuinely work in — capped, not forty');
  }
  if (f.includes('localseo') || a.businessType === 'construction' || a.businessType === 'beauty') {
    out.push('Google Business Profile as the primary local surface');
  }
  if (a.goal === 'rank' || a.situation === 'seo') {
    out.push('One page per service line, each targeting a single search intent');
  }
  if (derive(a).needsCommerce) out.push('Category and product structure, with crawl control on filters');
  if (!out.length) out.push('Clean structure, fast pages, and one clear topic per page');
  out.push('Correct schema for your business type');
  return out;
}

/* -------------------------------------------------------------------------
   Stage 5 — What to cut. Templates only add; naming one thing to leave out
   is the strongest anti-generic signal the output can carry.
   ------------------------------------------------------------------------- */
/* Every plan names one thing to leave out. Templates only ever add, so this
   line does more anti-generic work than any other string in the output —
   which means the fallback has to be a genuine last resort, not the usual
   answer. Ordered most-specific first. */
export function cutAdvice(a) {
  const f = a.features || [];
  const d = derive(a);

  if (f.includes('blog'))
    return 'Hold the blog until there is someone to write it. Two posts and then silence reads worse than no blog at all.';
  if (f.includes('portal'))
    return 'Leave the customer portal to a later phase. Accounts roughly multiply the security surface, and they are almost never what wins the first customer.';
  if (f.includes('areas'))
    return 'Cap service-area pages at the towns you have genuinely worked in. Near-duplicate location pages get treated as thin content, and forty of them will drag down the pages that matter.';
  if (a.businessType === 'restaurant')
    return 'Skip the homepage photo carousel. Menu and hours are what people came for, and a carousel buries both behind a slide they have to wait for.';
  if (a.businessType === 'beauty')
    return 'Leave the membership portal out of round one. Get booking working properly first — that is where the revenue actually leaks.';
  if (d.needsCommerce)
    return 'Do not build a blog and a lookbook alongside the store. Product and category pages are what sell; everything else competes with them for attention.';
  if (a.businessType === 'professional')
    return 'Skip the news feed. Firm announcements attract nobody, and a stale one signals a practice that has stopped paying attention.';
  if (a.businessType === 'realestate')
    return 'Do not build neighbourhood guides for every town at once. Two written properly outperform fifteen written thinly.';
  if (a.businessType === 'creative')
    return 'Cut the services page down to one line each. Your portfolio is the argument — a long services list dilutes it.';
  if (a.businessType === 'construction' && d.archetype === 'B2B_CREDIBILITY')
    return 'No live chat. Wrong buyer and wrong sales cycle — an unanswered chat window costs you more credibility than it ever wins.';
  if (a.businessType === 'construction')
    return 'Skip the testimonial slider. One named project with the scope and the town beats five anonymous quotes.';
  if (f.includes('gallery') && f.includes('services'))
    return 'Do not give every service its own gallery. One well-organised gallery, filtered, beats six half-full ones.';
  return 'Resist a page for every idea. A tighter site that answers one question well beats a wider one that answers none.';
}

export function riskCallout(a) {
  if (a.situation === 'hard_edit' || a.situation === 'outdated') {
    return 'If we move off your current platform, the page addresses change. That needs a redirect map on day one or you lose whatever search visibility you have.';
  }
  if (a.businessType === 'beauty') {
    return 'Before-and-after images need documented written consent per client, and they carry real advertising-policy exposure. The plan includes a consent workflow, not just a gallery.';
  }
  if (a.businessType === 'construction') {
    return 'Your photos are usually the strongest asset you own and the thing most contractor sites bury. Getting them shot and organised is normally the critical path, not the design.';
  }
  if (derive(a).needsCommerce) {
    return 'Payments, tax, and shipping rules need deciding in week one. They shape the build more than the visual design does.';
  }
  return null;
}

export function timeline(a) {
  const { pkg } = recommendPackage(a);
  const base = pkg === 'starter' ? [2, 3] : pkg === 'growth' ? [5, 7] : [8, 12];
  const note =
    a.timeline === 'asap'
      ? 'Fastest route is to cut scope into a second phase rather than compress the build.'
      : 'Assumes photos and content decisions land in the first two weeks.';
  return { low: base[0], high: base[1], note };
}

/* -------------------------------------------------------------------------
   Guardrail. Runs on every generated string in dev.
   ------------------------------------------------------------------------- */
const FORBIDDEN = [
  /guarantee/i, /rank\s*#?1/i, /\d+\s*%\s*more/i, /double your/i,
  /best[- ]in[- ]class/i, /cutting[- ]edge/i, /revolutionary/i,
];

export function assertNoClaims(strings) {
  const bad = [];
  for (const s of strings) {
    if (typeof s !== 'string') continue;
    for (const re of FORBIDDEN) if (re.test(s)) bad.push({ s, re: String(re) });
  }
  return bad;
}

export const PACKAGE_META = {
  starter: {
    name: 'Starter Website',
    blurb: 'A focused, professional one-page website for businesses that need a strong and credible online presence.',
    cta: 'Request Starter Pricing',
  },
  growth: {
    name: 'Business Growth Website',
    blurb: 'A strategic multi-page website built to establish trust, explain your services, generate qualified inquiries, and create a stronger SEO foundation.',
    cta: 'Request Growth Website Pricing',
  },
  custom: {
    name: 'Custom Website',
    blurb: 'A completely tailored website strategy for businesses with advanced goals, features, content, integrations, or long-term growth plans.',
    cta: 'Discuss a Custom Project',
  },
};
