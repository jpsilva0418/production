/* /demo/amairanymua-01 — the single source of facts, links, media and shared copy.

   Three completely different sites are built for Amairany Sierra (scripts/amairanymua-01/
   veil, noir and edit). Each has its own design, type, layout, motion and opening, but
   ALL of them read their facts, her booking links, her photographs, the film slots and
   the fact-carrying copy from this file, so a correction is made once and no site can
   say something about her that another does not.

   Rule (the one the Sass by Kass source keeps): nothing here is invented. Every fact
   comes from the table in docs/demo-amairanymua-01.md; where her own materials are
   silent the copy stays neutral, and anything she still has to confirm is listed there.

   PICK decides what the build writes:
     null                       review build — a chooser at the root and the three sites
                                under /veil, /noir and /edit, each with a small switch
                                between them in the preview marker
     'veil' | 'noir' | 'edit'   client build — that one site at the root, no chooser */
export const PICK = null;

export const SLUG = 'amairanymua-01';
export const BASE = `/demo/${SLUG}`;
export const A = `${BASE}/assets`;
export const ORIGIN = 'https://jpsilvadigital.com';

/* ---------- her booking system, exactly as published on her link page ----------
   The site only ever links to these. Checked by scripts/amairanymua-01-check.mjs:
   every data-book link in every page must equal one of these four. */
export const L = {
  jot: 'https://form.jotform.com/252119273398160',
  bridal: 'https://amairanymua.as.me/?appointmentType=category:Bridal%20Services',
  event: 'https://amairanymua.as.me/?appointmentType=category:Hair%20%26%2For%20Makeup%20%28%20Travel%2F%20In%20Studio%29',
  sched: 'https://amairanymua.as.me/schedule/bea4d83a',
  ig: 'https://www.instagram.com/amairanymua/',
  mail: 'mailto:amairanysmua@gmail.com',
  ww: 'https://www.weddingwire.com/biz/amairany-mua/cc8a47182a74f929.html',
  knot: 'https://www.theknot.com/marketplace/amairany-mua-kissimmee-fl-2075948',
  google: 'https://g.page/r/CcFKfY0wSWDnEAE/review',
  /* her TikTok profile, @amairanymua (founder's screenshot of the profile, 2026-11-19) */
  tiktok: 'https://www.tiktok.com/@amairanymua',
};
/* data-book value -> the only address it may carry */
export const BOOK = { 'bridal-form': L.jot, 'bridal-services': L.bridal, event: L.event, schedule: L.sched };

export const SITE = {
  name: 'Amairany Sierra',
  first: 'Amairany',
  handle: '@amairanymua',
  email: 'amairanysmua@gmail.com',
  /* her link page: "Luxury hair and makeup artist based in Florida" */
  tagline: 'Luxury Hair + Makeup',
  role: 'Luxury hair + makeup artist',
  /* her Instagram display name */
  area: 'Orlando + Tampa',
  areaLong: 'Orlando + Tampa, Florida',
  /* the date the ratings on the Reviews page were read */
  ratingsAsOf: 'November 18, 2026',
};

/* ---------- the sites ---------- */
export const SITES = {
  veil: {
    id: 'veil', n: 1, name: 'Veil', theme: '#FAF7F3',
    line: 'Pearl and champagne. Bridal luxury.',
    intro: 'A tulle veil carrying her monogram in champagne foil lifts off the page.',
    blurb: 'Light, luminous and unhurried, for the bride who wants it to feel expensive. Her work unveils as you scroll, along a fine line that runs the length of the page like an aisle.',
    swatch: ['#FAF7F3', '#EFE7DE', '#D9B98A', '#7A4E33', '#211713'],
  },
  noir: {
    id: 'noir', n: 2, name: 'Noir', theme: '#0E0A09',
    line: 'Espresso black. Cinematic.',
    intro: 'Her name draws itself on black, then her portraits spin like a reel and lock onto the opening frame.',
    blurb: 'Dark and dramatic, built on the way she shoots: faces lit against a dark backdrop. Scrolling moves through full-screen scenes, one look dissolving into the next.',
    swatch: ['#0E0A09', '#1E1512', '#C08A5B', '#E6CFA6', '#F3EADF'],
  },
  edit: {
    id: 'edit', n: 3, name: 'The Edit', theme: '#F9C7A8',
    line: 'Peach, cream and Gulf blue. Modern and social.',
    intro: 'Three makeup swatches paint across the screen, her name stamps in, and the peach floods the page.',
    blurb: 'Her own link-page colours, turned up. Bold, playful and made for the bride who found her on Instagram: the opening is a tap-through story of her looks, and the lookbook is an eyeshadow palette.',
    swatch: ['#FFF7EE', '#F9C7A8', '#9CC4E4', '#C2545C', '#2B2523'],
  },
};
/* Round two (founder, 2026-11-19): three more previews built from his zip of references — her
   current booking site, her JotForm, Faces by Clara, Leti Silva Beauty — and the first Sass by Kass
   build. `prebuilt` sites are built by their own project and copied in whole (the build skips them;
   the checker still applies every rule to their pages). `pages` overrides the default page list. */
/* Round three (founder, 2026-11-19): lighter, built on four references he sent (Galya Makeup
   Artistry, Emily Lynn &amp; Co, The Styling Stewardess, Valeria Nichols), with Leti Silva Beauty's
   structure, and her own clips at last. Listed first in the chooser. */
Object.assign(SITES, {
  atelier: {
    id: 'atelier', n: 7, name: 'Atelier', theme: '#F6F1EA',
    pages: ['', 'portfolio', 'bridal', 'about', 'journal', 'journal/how-to-prepare', 'journal/destination-bride', 'bridal-inquiry'],
    line: 'Ivory and espresso. Quiet, editorial luxury.',
    intro: 'A fine line draws down the ivory page, her &ldquo;Glam By&rdquo; writes on above it, and an arched window opens out of the line onto her bridal film, then travels into the page.',
    blurb: 'Ivory and espresso with tall couture caps: her clips play in arched windows like portraits on a gallery wall, beside the inquiry, her packages, her journal and Love Notes.',
    swatch: ['#F6F1EA', '#EAE1D6', '#36302A', '#C9A9A0'],
  },
  blush: {
    id: 'blush', n: 8, name: 'Blush', theme: '#FBF6F2',
    pages: ['', 'portfolio', 'bridal', 'about', 'journal', 'journal/how-to-prepare', 'journal/destination-bride', 'bridal-inquiry'],
    line: 'Warm cream and blush. Soft, romantic, personal.',
    intro: 'Her monogram seal draws itself on cream, its centre opens onto her film, and the round window settles into the page.',
    blurb: 'Soft cream and blush with her espresso as the ink: a round hero playing her film, two ways to book with her About right under, her reels in round windows, and an inquiry that starts with your wedding date.',
    swatch: ['#FBF6F2', '#F3E2DC', '#B88A82', '#3B3330'],
  },
  cocoa: {
    id: 'cocoa', n: 9, name: 'Cocoa', theme: '#36302A',
    pages: ['', 'portfolio', 'bridal', 'about', 'journal', 'journal/how-to-prepare', 'journal/destination-bride', 'bridal-inquiry'],
    line: 'Her espresso and cream. Confident, social, proven.',
    intro: 'Her lockup on espresso, her real numbers counting up, three of her most-viewed reels rising into a fan, then the espresso lifts away onto the cream hero.',
    blurb: 'Built to convert: a hero of her reels that moves on its own, her numbers, &ldquo;What brings you here?&rdquo;, her About, the viral grid with real view counts, packages with prices, The Looks with filters and Love Notes.',
    swatch: ['#F4EDE4', '#36302A', '#5A4A3F', '#D9B8A8'],
  },
});
Object.assign(SITES, {
  rouge: {
    id: 'rouge', n: 4, name: 'Rouge', theme: '#0D0D0D', prebuilt: true,
    pages: ['', 'work', 'services', 'about', 'book'],   /* its own project's page set (amairanymua-01-rouge/) */
    line: 'Black and white with a soft rose-red. Warm and polished.',
    intro: 'Her AS seal draws itself, &ldquo;Glam By&rdquo; writes on in rose, the caps set beneath, and the black lifts away as the headline rises.',
    blurb: 'A warm dark hero where her looks change on their own, curved chapters, a wall of her work, her six packages with prices, and the inquiry beside the event booking. Five tight pages from her photographs to booking.',
    swatch: ['#0D0D0D', '#FFFFFF', '#D9868C', '#F6E3E3'],
  },
  maison: {
    id: 'maison', n: 5, name: 'Maison', theme: '#0B0B0B',
    pages: ['', 'portfolio', 'bridal', 'about', 'journal', 'journal/how-to-prepare', 'journal/destination-bride', 'bridal-inquiry'],
    line: 'Glam By Amairanymua, as a fashion house. Black, white and a soft rose-red.',
    intro: 'Her "Glam By" script writes itself in red on black, the caps set beneath it, and the page opens like a curtain onto her work.',
    blurb: 'Built on her own brand, the way a fashion house would present it: editorial black and white, red used like a lipstick, a runway of her looks with film among them, her journal, and the inquiry beside the booking.',
    swatch: ['#0B0B0B', '#FFFFFF', '#D9868C', '#F6E3E3'],
  },
  darkroom: {
    id: 'darkroom', n: 6, name: 'Darkroom', theme: '#0E0B0B',
    pages: ['', 'portfolio', 'bridal', 'about', 'journal', 'journal/how-to-prepare', 'journal/destination-bride', 'bridal-inquiry'],
    line: 'Black and white prints under a soft rose glow. Warm and playful.',
    intro: 'Under a soft rose glow a print develops in the tray: her photograph surfaces, then her name, and the print lifts out into the page.',
    blurb: 'Red, black and white as a darkroom: prints develop as you scroll, the portfolio hangs on a line to dry, and the hero is a slideshow of prints coming up one after another.',
    swatch: ['#0E0B0B', '#F7F3EE', '#D9868C', '#F6E3E3'],
  },
});
export const SITE_IDS = PICK ? [PICK] : Object.keys(SITES);
/** A short label for any page path of any site. */
export const PAGE_LABEL = { '': 'Home', about: 'About', bridal: 'Bridal', services: 'Services', portfolio: 'Portfolio', reviews: 'Reviews', 'bridal-inquiry': 'Bridal Inquiry', work: 'Work', book: 'Book', journal: 'Journal' };
/** Sites this build writes (not the prebuilt ones). */
export const BUILT_IDS = SITE_IDS.filter((id) => !SITES[id].prebuilt);
/** The pages of one site. */
export const pagesOf = (id) => SITES[id].pages ?? PAGES;

/* ---------- addresses ---------- */
export const PAGES = ['', 'about', 'bridal', 'services', 'portfolio', 'reviews', 'bridal-inquiry'];
/** The root of one site: /demo/amairanymua-01/veil in review, the demo root once picked. */
export const root = (s) => (PICK ? BASE : `${BASE}/${s}`);
/** An internal address inside one site. href('veil', 'portfolio') -> /demo/amairanymua-01/veil/portfolio */
export const href = (s, path = '') => (path ? `${root(s)}/${path}` : root(s));
/** Where a page is written, relative to the demo folder. */
export const outFile = (s, path = '') => `${PICK ? '' : `${s}/`}${path ? `${path}/` : ''}index.html`;

export const NAV = [
  { path: 'about', label: 'About', menu: 'About Amairany', note: 'The artist behind the brushes' },
  { path: 'bridal', label: 'Bridal', menu: 'Bridal', note: 'Your wedding day glam' },
  { path: 'services', label: 'Services', menu: 'Services', note: 'Brides, events, photoshoots' },
  { path: 'portfolio', label: 'Portfolio', menu: 'Portfolio', note: 'Photographs and film' },
  { path: 'reviews', label: 'Reviews', menu: 'Reviews', note: 'Where her clients wrote them' },
  { path: 'bridal-inquiry', label: 'Bridal Inquiry', menu: 'Bridal Inquiry', note: 'Weddings start here', cta: true },
];

/* ---------- helpers ---------- */
export const esc = (s) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/gi, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
/** External links open in the SAME tab (the family rule, from Sass by Kass): a plain https
 *  anchor is the smoothest one-tap handoff inside Instagram's in-app browser. */
export const ext = (h) => (/^https?:/.test(h) ? ' rel="external"' : '');
/** A link into her own booking system. `kind` is a key of BOOK; the address is never typed by hand. */
export const book = (kind, label, cls = '', attrs = '') => {
  if (!BOOK[kind]) throw new Error(`unknown booking link "${kind}"`);
  return `<a${cls ? ` class="${cls}"` : ''} href="${BOOK[kind]}" data-book="${kind}" rel="external"${attrs ? ` ${attrs}` : ''}>${label}</a>`;
};
/** The primary action everywhere: the on-site bridal inquiry. */
export const inquire = (s, label = 'Bridal inquiry', cls = '', attrs = '') =>
  `<a${cls ? ` class="${cls}"` : ''} href="${href(s, 'bridal-inquiry')}" data-inquire${attrs ? ` ${attrs}` : ''}>${label}</a>`;
export const arrow = '<span class="arr" aria-hidden="true">&rarr;</span>';

/* ---------- photographs ----------
   Twelve of her own images (docs: "Photographs"). w/h are the real pixel sizes of the
   -1280 files; `pos` is where the face sits, used as object-position wherever a frame
   crops the picture. Captions describe the look; nobody is named. */
export const PHOTOS = {
  'artist-brushes': { w: 1278, h: 1624, pos: '50% 26%', alt: 'Amairany Sierra holding a fan of makeup brushes toward the camera.' },
  'artist-spotlight-crop': { w: 624, h: 625, pos: '40% 40%', widths: [480, 624], alt: 'Amairany Sierra in a studio spotlight, hair in a sculpted updo with face-framing curls.' },
  'bride-crystal': { w: 1280, h: 1546, pos: '50% 27%', alt: 'Bride with glossy side-swept waves pinned by a crystal clip, a soft pink lip and fluttery lashes, in a beaded strapless gown.' },
  'bride-pearls': { w: 1280, h: 1682, pos: '50% 40%', alt: 'Bride getting ready by the ocean in a satin robe and pearls, with soft bronzed glam and face-framing waves.' },
  'glam-sculpt': { w: 1280, h: 1666, pos: '50% 36%', alt: 'Close-up of a full-glam look: smoky bronze eye, flushed cheek, glossy nude lip and a sleek half-up style.' },
  'bride-gold-waves': { w: 1280, h: 1691, pos: '50% 28%', alt: 'Bride with a gold shimmer eye, glowing skin and long brushed-out waves, wearing gold jewellery and a red and gold embroidered top.' },
  'bride-ruby': { w: 1280, h: 1487, pos: '52% 38%', alt: 'Bride with a silver shimmer eye, rose lip and side-swept waves, wearing a jewelled headpiece and a ruby necklace.' },
  'waves-blonde': { w: 1280, h: 1691, pos: '50% 36%', alt: 'Half-up blonde glam waves with a soft smoky eye and a glossy lip, photographed beside a window.' },
  'glam-bronze': { w: 1280, h: 1707, pos: '50% 40%', alt: 'Bronzed full-glam look with winged liner, lifted lashes and a glossy lip, with long highlighted layers.' },
  'wedding-florals': { w: 1280, h: 1273, pos: '58% 24%', alt: 'Newlyweds in white beside a wall of flowers; the bride has pastel pink waves and soft, glowing makeup.' },
  'golden-hour': { w: 1280, h: 1583, pos: '42% 36%', alt: 'A couple embracing on the beach at sunset; she wears soft glam with long, smooth hair.' },
  'wedding-night': { w: 1280, h: 1587, pos: '60% 52%', alt: 'Bride and groom forehead to forehead at night, her cathedral veil sweeping across the frame in front of an illuminated castle.' },
  /* round three (2026-11-19): frames from her own TikTok clips (scripts/amairanymua-01-media.py),
     576 wide, portrait 9:16. `credit` names a collaborator credited in her own caption; where it is
     set, the look is captioned as her makeup with that hair credit, never as hers alone. */
  'artist-chair': { w: 800, h: 830, pos: '35% 20%', widths: [480, 800], alt: 'Amairany Sierra in a black suit and strappy heels, leaning back in a director’s chair.' },
  'artist-chair-cut': { w: 800, h: 830, pos: '35% 20%', widths: [480, 800], alt: 'Amairany Sierra in a black suit and strappy heels, leaning back in a director’s chair.' },
  'reel-veil-reveal': { w: 576, h: 1024, pos: '50% 30%', widths: [480, 576], alt: 'Bride in a veil and off-the-shoulder lace gown with soft glam and a sleek pulled-back style.' },
  'reel-morning-veil': { w: 576, h: 1024, pos: '50% 30%', widths: [480, 576], alt: 'Bride on her wedding morning in a lace-edged veil and pearls, with soft glam and a glowing complexion.' },
  'reel-bride-gown': { w: 576, h: 1024, pos: '50% 28%', widths: [480, 576], alt: 'Bride in a lace gown with long, glossy dark waves and bronzed soft glam.' },
  'reel-bride-pearls-updo': { w: 576, h: 1024, pos: '50% 32%', widths: [480, 576], alt: 'Bride with deep skin, a sleek updo with face-framing tendrils, full glam and a pearl necklace, in a strapless lace gown.' },
  'reel-final-touch': { w: 576, h: 1024, pos: '50% 38%', widths: [480, 576], alt: 'A final brush of powder for a bride in a strapless lace gown, moments before the aisle.' },
  'reel-burgundy': { w: 576, h: 1024, pos: '50% 32%', widths: [480, 576], alt: 'Bride with burgundy hair in bangs and big glam waves, a red lip, in a white satin robe.' },
  'reel-curly-updo': { w: 576, h: 1024, pos: '50% 34%', widths: [480, 576], alt: 'A textured curly updo from behind, finished with pearl pins, above a beaded open-back dress.' },
  'reel-bridesmaid-half-up': { w: 576, h: 1024, pos: '50% 34%', widths: [480, 576], alt: 'A bridesmaid’s half-up style with long brushed curls, in a pink robe.' },
  'reel-bridesmaid-waves': { w: 576, h: 1024, pos: '50% 34%', widths: [480, 576], alt: 'A bridesmaid’s long glossy vintage waves from behind, in a striped pink robe.' },
  'reel-copper': { w: 576, h: 1024, pos: '50% 34%', widths: [480, 576], credit: 'Hair by @.artistic.aestheticss', alt: 'Full glam with soft lashes and a glossy nude lip, with layered copper hair and curtain bangs.' },
  'reel-red-waves': { w: 576, h: 1024, pos: '50% 30%', widths: [480, 576], alt: 'Full glam outdoors with bright red layered hair, a sculpted cheek and a nude lip.' },
  'reel-pink': { w: 576, h: 1024, pos: '50% 34%', widths: [480, 576], credit: 'With Alejandro Lopez', alt: 'A smoky glam eye with hot-pink and black layered hair.' },
  'reel-editorial': { w: 576, h: 1024, pos: '50% 32%', widths: [480, 576], alt: 'Editorial glam: a graphic orange and pink eye with long dark curls.' },
};
export const srcset = (k) => (PHOTOS[k].widths ?? [480, 800, 1280]).map((w) => `${A}/img/${k}-${w}.webp ${w}w`).join(', ');
export const src = (k, w) => `${A}/img/${k}-${w ?? ((PHOTOS[k].widths ?? [480, 800])[1] ?? 480)}.webp`;
/** An <img> for one of her photographs. `alt: ''` marks it decorative. `pos` overrides the focal point. */
export const pic = (k, { alt, sizes = '(max-width:899px) 90vw, 50vw', cls = '', eager = false, pos, attrs = '' } = {}) => {
  const p = PHOTOS[k];
  if (!p) throw new Error(`photo "${k}" is not in PHOTOS`);
  return `<img src="${src(k)}" srcset="${srcset(k)}" sizes="${sizes}" width="${p.w}" height="${p.h}" alt="${esc(alt ?? p.alt)}"${cls ? ` class="${cls}"` : ''} style="object-position:${pos ?? p.pos}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${attrs ? ` ${attrs}` : ''}>`;
};

/* ====================================================================
   FROM HER OWN SITE — the founder's screen recording of amairanymua.as.me
   and of her JotForm bridal inquiry, 2026-11-19. Her words, kept as she
   wrote them (light punctuation fixes only). Prices are as listed on her
   booking page that day and can change.
   ==================================================================== */
export const HER = {
  brand: { script: 'Glam By', caps: 'AMAIRANYMUA' },   /* her own logo lockup, set as type (no logo file) */
  badges: ['Licensed &amp; insured', 'Central Florida'],
  hello: 'Hey Gorgeous! I’m Amairany.',
  about: [
    'With 13 years in makeup and 4 in hair, I specialize in customizable soft-full glam “CAKE FREE” makeup that makes you feel effortlessly radiant.',
    'My work has spanned Disney sets, celebrity clients, and dream destination weddings worldwide, but my favorite role is being your ultimate hype woman on your big day.',
    'I bring warm vibes &amp; total devotion to making you look and feel your absolute best. Let’s create magic together!',
  ],
  years: [['In makeup', '13 years'], ['In hair', '4 years']],
  /* her own services (her site's grid also shows film photography: that is her fiancé's, a separate service — founder, 2026-11-19) */
  services: ['Bridal', 'Engagement', 'Event glam'],
  /* now booking (founder: "2026, 2027 bookings"; her form asks 2027–2028 brides to specify their date) */
  booking: 'Now booking 2026 &amp; 2027 weddings',
  packages: [
    { name: 'The Luxe Bride', price: '1,300', who: 'Bride only · hair &amp; makeup', points: ['Two-part bridal artistry: private preview session + wedding-day application', 'Signature skin prep + guide', 'Lashes included', 'Deluxe touch-up kit', '30 min post-ceremony touch-ups', 'Travel included'] },
    { name: 'The Signature Soiree', price: '2,600', who: 'Bride + 3 · most popular', points: ['Two-part bridal artistry', 'Signature skin prep', 'Premium hair, makeup &amp; lashes for 3 VIP guests', '1 hour post-ceremony touch-ups', 'Luxury touch-up kits', 'Timeline management', 'Travel included'] },
    { name: 'The Luxe Gala', price: '3,300', who: 'Bride + 5', points: ['Two-part bridal artistry', 'Premium hair, makeup &amp; lashes for 5 VIP guests', 'An additional professional artist to keep your morning on schedule', '1 hour post-ceremony touch-ups', 'Hair extension rental included', 'Timeline management', 'Travel included'] },
    { name: 'The Radiant Bride', price: '750', who: 'Bride only · makeup only', points: ['Makeup preview &amp; wedding-day makeup', 'Body glow', 'Luxury skin prep + guide', 'Strip lashes / individuals', '1 hour touch-up', 'Luxury touch-up kit', 'Wedding content of your wedding-day glam'] },
    { name: 'The Luxe Glam', price: '1,500', who: 'Bride + 4 · makeup only', points: ['Makeup preview &amp; wedding-day makeup', 'Body glow', 'Luxury skin prep + guide', 'Strip lashes / individuals for all', '1 hour touch-up', 'Wedding content of your wedding-day glam'] },
    { name: 'Glam Hair', price: '1,500', who: 'Bride + 4 · hair only', points: ['Hair preview &amp; wedding-day hair', '4 hair services', 'Extension install for the bride', 'Hair touch-ups'] },
  ],
  packagesNote: 'Bridal party services &amp; custom upgrades are available. Prices as listed on her booking page, November 2026.',
  destination: { heading: 'Destination bride?', body: 'I travel worldwide for my brides. Reach out directly to discuss travel availability &amp; receive a custom quote. I’d love to have you in my chair!' },
  faq: [
    ['Do you travel?', 'Yes, I travel all across Central Florida &amp; out of state.'],
    ['Can you hold my date?', 'Unfortunately no. Dates cannot be held without a signed contract &amp; a non-refundable retainer.'],
    ['Do you recommend hair extensions?', 'For max volume &amp; longevity with glam waves, hair extensions are highly recommended. You can either rent them directly with me or I can guide you toward the best extensions to purchase.'],
    ['Is there a booking minimum?', 'I do not have a booking minimum for hair &amp; makeup.'],
    ['Do you offer trials?', 'Yes! Preview sessions are available for both hair and makeup. Our packages already include your preview, but you are always welcome to book a trial session prior to signing if you prefer.'],
    ['Do you offer photography?', 'Photography is a separate service: my fiancé is a photographer. He offers film / polaroid photography for weddings &amp; special events.'],
  ],
  prepare: ['Please come in with a clean face.', 'Hair should be washed and blown out a day before your appointment.'],
  /* what her form says after it is sent */
  afterInquiry: 'Thank you for reaching out! A custom investment proposal &amp; availability confirmation will be sent within the next 24 to 48 hours.',
  /* her link page */
  links: { reviewsName: 'Love Notes', reviewsLine: 'Client reviews' },
};

/* Every look, with what it shows. `cats` is our reading of each picture (a look is "bridal" only
   where there is a veil, a gown, a robe-and-pearls morning or a wedding portrait); she confirms. */
export const LOOK_CATS = { bridal: 'Bridal', soft: 'Soft glam', full: 'Full glam', waves: 'Glam waves', wedding: 'Wedding day' };
export const LOOKS = [
  { photo: 'bride-crystal', cats: ['bridal', 'waves'], cap: 'Bridal · Glam waves' },
  { photo: 'bride-pearls', cats: ['bridal', 'soft'], cap: 'Bridal · Soft glam' },
  { photo: 'glam-sculpt', cats: ['full'], cap: 'Full glam · Sculpted bronze' },
  { photo: 'bride-gold-waves', cats: ['bridal', 'full', 'waves'], cap: 'Bridal · Gold shimmer' },
  { photo: 'waves-blonde', cats: ['waves', 'full'], cap: 'Glam waves · Smoky eye' },
  { photo: 'bride-ruby', cats: ['bridal', 'full', 'waves'], cap: 'Bridal · Full glam' },
  { photo: 'glam-bronze', cats: ['full', 'waves'], cap: 'Full glam · Winged liner' },
  { photo: 'wedding-florals', cats: ['wedding', 'soft'], cap: 'Wedding day · Soft glam' },
  { photo: 'golden-hour', cats: ['wedding', 'soft'], cap: 'Wedding day · Golden hour' },
  { photo: 'wedding-night', cats: ['wedding', 'bridal'], cap: 'Wedding day · After dark' },
];
/** The looks in one category, in LOOKS order. */
export const looksIn = (cat) => LOOKS.filter((x) => x.cats.includes(cat));
/* Round three's portfolio (Atelier, Blush, Cocoa only; sites 1–6 keep LOOKS): her newest work first,
   frames from her own clips (576 wide), then the ten earlier photographs. Two more categories: hair
   (styles shown from behind, bridal parties) and editorial (colour and transformations). `credit`
   comes from PHOTOS where her caption names a collaborator: show it with the caption. */
export const LOOK_CATS3 = { bridal: 'Bridal', soft: 'Soft glam', full: 'Full glam', hair: 'Hair', editorial: 'Editorial', wedding: 'Wedding day' };
export const LOOKS3 = [
  { photo: 'reel-morning-veil', cats: ['bridal', 'soft'], cap: 'Bridal · Morning veil', film: 'f7' },
  { photo: 'reel-bride-pearls-updo', cats: ['bridal', 'full', 'hair'], cap: 'Bridal · Sleek updo &amp; pearls', film: 'f5' },
  { photo: 'reel-veil-reveal', cats: ['bridal', 'soft'], cap: 'Bridal · The reveal', film: 'f1' },
  { photo: 'reel-bride-gown', cats: ['bridal', 'full'], cap: 'Bridal · Glam waves', film: 'f4' },
  { photo: 'reel-burgundy', cats: ['bridal', 'full'], cap: 'Bridal · Burgundy waves, red lip', film: 'f6' },
  { photo: 'reel-final-touch', cats: ['bridal', 'soft'], cap: 'Bridal · Final touches', film: 'f3' },
  { photo: 'reel-curly-updo', cats: ['hair', 'bridal'], cap: 'Hair · Curly updo with pearl pins', film: 'f9' },
  { photo: 'reel-bridesmaid-half-up', cats: ['hair'], cap: 'Bridal party · Half-up curls', film: 'f8' },
  { photo: 'reel-bridesmaid-waves', cats: ['hair'], cap: 'Bridal party · Vintage waves', film: 'f8' },
  { photo: 'reel-copper', cats: ['full', 'editorial'], cap: 'Full glam · Copper', film: 'f2', credit: PHOTOS['reel-copper'].credit },
  { photo: 'reel-red-waves', cats: ['full', 'editorial'], cap: 'Transformation · Red waves', film: 'f13' },
  { photo: 'reel-pink', cats: ['editorial'], cap: 'Editorial · Pink', film: 'f10', credit: PHOTOS['reel-pink'].credit },
  { photo: 'reel-editorial', cats: ['editorial', 'full'], cap: 'Editorial · Graphic colour', film: 'f12' },
  ...LOOKS.map((l) => ({ ...l, cats: l.cats.map((c) => (c === 'waves' ? 'hair' : c)).filter((c, i, a) => a.indexOf(c) === i) })),
];
export const looksIn3 = (cat) => LOOKS3.filter((x) => x.cats.includes(cat));

/* ---------- film ----------
   Every film below has a real clip of her own work (2026-11-19). A film with `file: null` would
   render as a MARKED SLOT, never a stand-in video.

   To fill a slot: put <name>.mp4 (H.264, silent, portrait) and <name>.jpg (its poster
   frame) in assets/film/, set `file: '<name>'` below and describe what it shows in
   `alt`. Every place that uses the slot (hero, home, portfolio, services, about) then
   plays the clip. Nothing else changes. */
/* 2026-11-19: her own clips, from the founder's media pack (her public TikTok, the last ~12 s of
   each post, silent). f1–f4 keep their ids, so every earlier site now plays real film too.
   `views` is the post's view count as listed in the pack on 2026-11-19 (only the pinned posts are
   large enough to be worth quoting). `credit` repeats a collaborator named in her caption. */
export const FILMS = {
  f1: { n: 1, file: 'veil-reveal', label: 'Bridal', title: 'A bridal reveal', pos: '50% 30%', alt: 'Silent clip: a bride in a veil and lace gown turns toward the camera, soft glam finished.' },
  f2: { n: 2, file: 'copper-glam', label: 'Full glam', title: 'Full glam', pos: '50% 35%', credit: 'Hair by @.artistic.aestheticss', views: '1.6M', alt: 'Silent clip: full glam with layered copper hair and curtain bangs, turning to the light.' },
  f3: { n: 3, file: 'final-moments', label: 'Getting ready', title: 'Final moments before the aisle', pos: '50% 38%', alt: 'Silent clip: final touches of powder for a bride in a strapless lace gown.' },
  f4: { n: 4, file: 'robe-to-gown', label: 'Glam waves', title: 'Robe to gown', pos: '50% 28%', alt: 'Silent clip: a bride with long dark glam waves, from her robe to her wedding dress.' },
  f5: { n: 5, file: 'pearls-reveal', label: 'Bridal', title: 'The glam reveal', pos: '50% 32%', alt: 'Silent clip: a bride with a sleek updo and pearls sees her finished glam.' },
  f6: { n: 6, file: 'bride-reaction', label: 'Bridal', title: 'Her reaction', pos: '50% 32%', alt: 'Silent clip: a bride with burgundy waves and a red lip reacts to her look.' },
  f7: { n: 7, file: 'morning-veil', label: 'Bridal', title: 'An early bridal morning', pos: '50% 30%', alt: 'Silent clip: a bride in a lace veil and pearls on her wedding morning.' },
  f8: { n: 8, file: 'bridesmaids', label: 'Bridal party', title: 'The bridesmaids', pos: '50% 34%', alt: 'Silent clip: bridesmaids’ waves, half-up styles and updos, in pink robes.' },
  f9: { n: 9, file: 'curly-updo', label: 'Hair', title: 'A curly updo', pos: '50% 34%', alt: 'Silent clip: a textured curly updo finished with pearl pins, seen from behind.' },
  f10: { n: 10, file: 'pink-transformation', label: 'Editorial', title: 'A pink transformation', pos: '50% 34%', credit: 'With Alejandro Lopez', alt: 'Silent clip: hot-pink and black hair with smoky glam, turning to camera.' },
  f11: { n: 11, file: 'pink-glam', label: 'Editorial', title: 'Pink glam', pos: '50% 34%', credit: 'With Alejandro Lopez', alt: 'Silent clip: close-ups of hot-pink hair and glam, then the chair reveal.' },
  f12: { n: 12, file: 'editorial-glam', label: 'Editorial', title: 'Editorial colour', pos: '50% 32%', alt: 'Silent clip: a graphic orange and pink eye with long dark curls.' },
  f13: { n: 13, file: 'transformation', label: 'Transformation', title: 'The transformation', pos: '50% 30%', views: '1.1M', alt: 'Silent clip: full glam and red waves outdoors, the end of a transformation.' },
  f14: { n: 14, file: 'copper-finish', label: 'Full glam', title: 'The finish', pos: '50% 35%', views: '1.5M', credit: 'Hair by @.artistic.aestheticss' /* same copper look as f2, whose caption credits the hair; this post has no caption, so the credit is carried over: confirm with her */, alt: 'Silent clip: the finished copper glam, close to camera.' },
};
export const filmSrc = (id) => (FILMS[id].file ? { mp4: `${A}/film/${FILMS[id].file}.mp4`, poster: `${A}/film/${FILMS[id].file}.jpg` } : null);
/** One film frame. With a file: a muted, looping, playsinline <video data-film> with its poster
 *  and a lazy data-src (each site's own script loads and plays it near the viewport, rests it off
 *  screen, and leaves it a still for reduced motion or Save-Data). Without one: the MARKED SLOT.
 *  The class names are a contract (.film, .film--slot, .slot, .slot-ic, .slot-n, .slot-t, .slot-s,
 *  .film-lbl); each site styles them in its own manner. `label` is the small tag in the corner. */
export const film = (id, { label = 'Reel', cls = '' } = {}) => {
  const f = FILMS[id];
  if (!f) throw new Error(`film "${id}" is not in FILMS`);
  const s = filmSrc(id);
  const n = String(f.n).padStart(2, '0');
  if (!s) {
    return `<div class="film film--slot${cls ? ` ${cls}` : ''}" data-film-slot="${id}"><div class="slot" role="img" aria-label="Film slot ${f.n}: ${esc(f.title.toLowerCase())} from ${SITE.handle} will play here."><span class="slot-ic" aria-hidden="true"></span><span class="slot-n" aria-hidden="true">Film ${n}</span><span class="slot-t" aria-hidden="true">${f.title} plays here</span><span class="slot-s" aria-hidden="true">Slot &middot; clip to come</span></div></div>`;
  }
  return `<div class="film${cls ? ` ${cls}` : ''}" data-film-tile><video data-film muted loop playsinline preload="none" poster="${s.poster}" disablepictureinpicture disableremoteplayback tabindex="-1" aria-label="${esc((f.alt || `Silent looping clip: ${f.title.toLowerCase()}.`) + (f.credit ? ` Makeup by ${SITE.first}; ${f.credit.replace(/^With /, 'with ')}.` : ''))}" style="object-position:${f.pos}"><source data-src="${s.mp4}" type="video/mp4"></video>${label ? `<span class="film-lbl" aria-hidden="true">${label}</span>` : ''}${f.credit ? `<span class="film-credit" aria-hidden="true" style="position:absolute;right:8px;bottom:8px;z-index:2;font:500 10px/1.3 system-ui,sans-serif;letter-spacing:.03em;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.7)">Makeup by ${SITE.first} &middot; ${f.credit}</span>` : ''}</div>`;
};
/* ---------- what every page must carry ---------- */
/** The standard <head> block: charset, viewport, title, description, noindex, canonical, Open
 *  Graph, favicon, theme colour and the preview marker's stylesheet. A site's shell adds its own
 *  fonts, stylesheets and scripts after it. `title` is the page's own; the site name and
 *  "design preview" are appended here so no page can forget them. */
export const head = (s, { path = '', title, description }) => {
  const url = `${ORIGIN}${href(s, path)}`;
  const full = `${title} · ${SITE.name} · design preview`;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)} Design preview, not the official website.">
<meta name="robots" content="noindex,nofollow,noarchive">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name} · design preview">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="A website concept for ${SITE.handle} by JP Silva Digital. Design preview, not the official website.">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ORIGIN}${A}/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="${A}/img/favicon.svg">
<meta name="theme-color" content="${SITES[s].theme}">
<link rel="stylesheet" href="${A}/css/marker.css">`;
};
/** The "Design preview · not the official site" marker: on every page of every site, always on
 *  screen, styled by assets/css/marker.css (studio chrome, the same in every site, never
 *  restyled by a site). During review it also carries the switch between the sites: the same
 *  page in each of them where that page exists, and the way back to the chooser. A site that has a bar
 *  fixed to the bottom of the screen lifts the marker above it by setting --marker-bottom. */
const HOW_MANY = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][Object.keys(SITES).length] || String(Object.keys(SITES).length);
export const marker = (s, path = '') => {
  const sw = PICK ? '' : `<span class="demo-dirs" role="navigation" aria-label="The ${HOW_MANY} previews"><span class="demo-dirs-k" aria-hidden="true">Preview</span>${Object.values(SITES).sort((a, b) => a.n - b.n)
    .map((x) => `<a href="${BASE}/${x.id}${path && pagesOf(x.id).includes(path) ? `/${path}` : ''}"${x.id === s ? ' aria-current="true"' : ''} aria-label="Preview ${x.n}: ${x.name}">${x.n}</a>`)
    .join('')}<a class="demo-all" href="${BASE}" aria-label="All ${HOW_MANY} previews">All</a></span>`;
  return `<div class="demo-flag${PICK ? '' : ' demo-flag--review'}"><span class="demo-flag-t">Design preview &middot; not the official site</span>${sw}</div>`;
};
/** The footer's fine print, the same words in every site. */
export const finePrint = () => `${FOOTER.fine}${PICK ? '' : ` <a href="${BASE}">See all ${HOW_MANY} previews</a>.`}`;

/* ====================================================================
   COPY — the single copy source for every page. Her own words are kept
   as she wrote them (link page, Instagram); headlines are proposals.
   ==================================================================== */
export const HERO = {
  label: `${SITE.name} — luxury hair and makeup artist, ${SITE.area}`,
  sub: `${SITE.tagline} &middot; ${SITE.area}`,
  line: 'Soft glam to full glam, glam waves and real-life-filter skin, for brides and events.',
  cta: 'Bridal inquiry',
  second: 'Book event glam',
  cue: `Meet ${SITE.first}`,
};
/* What the hero shows, in order: photographs, with her films cutting in. Each beat names the
   picture, its small title, and the two pictures beside it where a direction shows three. */
export const MONTAGE = [
  { photo: 'bride-crystal', label: 'Bridal', l: 'glam-sculpt', r: 'bride-pearls' },
  { photo: 'glam-sculpt', label: 'Full glam', l: 'bride-gold-waves', r: 'waves-blonde' },
  { film: 'f1', label: 'Bridal', l: 'bride-pearls', r: 'bride-ruby' },
  { photo: 'bride-gold-waves', label: 'Bridal', l: 'glam-bronze', r: 'bride-crystal' },
  { photo: 'bride-pearls', label: 'Soft glam', l: 'waves-blonde', r: 'glam-sculpt' },
  { photo: 'waves-blonde', label: 'Glam waves', l: 'bride-ruby', r: 'bride-gold-waves' },
  { film: 'f2', label: 'Full glam', l: 'bride-crystal', r: 'glam-bronze' },
  { photo: 'bride-ruby', label: 'Bridal', l: 'glam-sculpt', r: 'bride-pearls' },
  { photo: 'glam-bronze', label: 'Full glam', l: 'bride-gold-waves', r: 'waves-blonde' },
];

export const INTRO = {
  eyebrow: `About ${SITE.first}`,
  heading: ['Meet', `${SITE.first}.`],
  lead: `${SITE.name} is a luxury hair and makeup artist based in Florida, working across Orlando and Tampa.`,
  sentences: [
    'Her signature is what she calls real-life-filter skin: complexion work that still looks like skin, in person and in photographs. Never cakey.',
    'From there the look goes wherever you want it: soft glam, full glam, glam waves.',
    'She works with brides and the people getting ready with them, and with clients dressing for events and photoshoots.',
  ],
  values: ['Soft glam', 'Full glam', 'Glam waves'],
  caption: `${SITE.name} &middot; ${SITE.handle}`,
  more: `More about ${SITE.first}`,
};

export const WORK = {
  label: 'Bridal portfolio',
  heading: ['Real skin,', 'real glam.'],
  line: 'Real clients in real light. Swipe through a few favorites, photographs and film, or open the full portfolio.',
  all: 'Open the portfolio',
  aria: `A selection of ${SITE.first}’s work`,
};
/* the home page's swipeable selection: photographs with one film among them */
export const FEATURED = [
  { photo: 'bride-crystal' },
  { film: 'f1' },
  { photo: 'bride-pearls' },
  { photo: 'glam-sculpt' },
  { photo: 'bride-gold-waves' },
  { photo: 'waves-blonde' },
];

/* The two destinations. Weddings lead everywhere. */
export const PATHS = [
  {
    key: 'bridal', kicker: 'Weddings', title: 'The Bridal Experience', plate: 'bride-ruby',
    body: 'For the bride and the people getting ready with her. Start with a short bridal inquiry: your date, your timeline and who needs hair and makeup.',
    points: ['Bridal packages and custom bridal experiences', 'Hair, makeup or both', 'Trial appointments to design the look first'],
    cta: 'Bridal inquiry', note: `A short inquiry here, finished on ${SITE.first}’s own form`,
  },
  {
    key: 'event', kicker: 'Events & everyday glam', title: 'Event Makeup & Hair', plate: 'glam-bronze',
    body: 'Glam for the celebration, the night out or the photoshoot. Choose your service and your time on her booking page.',
    points: ['Soft glam to full glam', 'Glam waves and event hair', 'In studio or on location'],
    cta: 'Book Event Makeup &amp; Hair', note: 'Opens her own booking page',
  },
];
export const FINAL = {
  label: 'Two ways to book',
  /* "Secure your wedding day glam" is her own line, from her link page */
  heading: ['Secure your', 'wedding day glam.'],
  line: 'Weddings start with an inquiry, so the reply you get is about your day. Events book straight onto her calendar.',
  proof: '5.0 on WeddingWire &middot; 31 reviews',
};

export const PORTFOLIO = [
  {
    id: 'bridal', title: 'Bridal', line: 'Soft-to-full glam for the wedding day, on skin that still looks like skin.',
    items: [
      { photo: 'bride-crystal', span: 'big' },
      { film: 'f1', span: 'tall' },
      { photo: 'bride-pearls' },
      { photo: 'bride-gold-waves' },
      { photo: 'bride-ruby', span: 'wide' },
    ],
  },
  {
    id: 'wedding-day', title: 'Wedding day', line: 'The day itself: the portraits, the light, the two of you.',
    items: [
      { photo: 'wedding-florals', span: 'wide' },
      { film: 'f3', span: 'tall' },
      { photo: 'golden-hour' },
      { photo: 'wedding-night' },
    ],
  },
  {
    id: 'glam', title: 'Glam & waves', line: 'Events, photoshoots and nights worth dressing up for.',
    items: [
      { photo: 'glam-sculpt', span: 'big' },
      { film: 'f2', span: 'tall' },
      { photo: 'waves-blonde' },
      { film: 'f4', span: 'tall' },
      { photo: 'glam-bronze' },
    ],
  },
];
export const PORTFOLIO_PAGE = {
  ghost: 'glam',
  kick: 'Portfolio',
  heading: ['Every look,', 'up close.'],
  sub: (n) => `Brides first, then glam and waves. ${n} favorites, photographs and film. Tap a group to jump to it.`,
  noteKick: 'Like what you see?',
  note: 'Getting married? Start a bridal inquiry. Dressing for an event? Choose a time on her calendar.',
  ig: `More on Instagram ${SITE.handle}`,
};

export const BRIDAL = {
  ghost: 'bridal',
  kick: 'The Bridal Experience',
  heading: ['Secure your', 'wedding day glam.'],
  sub: `Bridal hair and makeup for you and the people getting ready with you, across ${SITE.area}. It starts with a short inquiry.`,
  slateAsk: 'What the inquiry asks',
  ask: {
    kick: 'Four short steps',
    heading: ['Start with', 'your day.'],
    line: `${SITE.first}’s bridal inquiry asks about the day before it asks about the glam, so her reply is about your wedding and not a generic price list.`,
    steps: [
      ['The day', 'Your wedding date and ceremony time.'],
      ['The morning', 'Where you are getting ready, whether there is a first look, and the time you need to be ready by.'],
      ['The glam', 'The package you have in mind, how many people need hair and makeup, and your inspiration.'],
      ['You', 'Your name, email and phone, and how you would like to be contacted.'],
    ],
  },
  slateCollections: 'Bridal collections',
  collections: {
    kick: 'On her booking page',
    heading: ['Four bridal', 'collections.'],
    line: 'À la carte services, bridal packages and custom bridal experiences. These are the collections on her booking page today.',
    /* names as read from her Acuity page on 2026-11-18: names only, no prices, and they can change */
    names: ['The Luxe Bride', 'The Signature Soiree', 'The Luxe Gala', 'The Radiant Bride'],
    note: 'What each one includes, and current pricing, is always live on',
    noteLink: 'her booking page',
  },
  slateFaq: 'Good to know',
  faqHeading: ['Before you', 'inquire.'],
  /* [question, answer html]. {inq} {bridal} {event} {sched} are replaced with links by the page. */
  faq: [
    ['How do I book my wedding?', 'Start with the {inq}. It asks for your date, ceremony time, getting-ready location and how many people need hair and makeup, so the reply you get is about your day. Already know what you want? {bridal} can be booked directly.'],
    ['Do you offer bridal trials?', 'Yes. Trials are part of the bridal services. Mention yours in the inquiry and it is planned around your date.'],
    ['Can you do hair and makeup for my bridal party?', 'Yes. The inquiry asks how many people are getting ready with you, so the morning can be timed properly.'],
    ['Do you come to me?', `Appointments are offered both in studio and on location across ${SITE.area}. For anything further afield, ask in the inquiry.`],
    ['What does &ldquo;real-life filter&rdquo; mean?', `It is how ${SITE.first} describes her skin work: skin that still looks like skin, in person and on camera. Soft glam or full glam, never cakey.`],
    ['Where can I see pricing?', 'Current packages and pricing live on {sched}, so they are always up to date.'],
    ['I’m not a bride. Can I still book?', 'Of course. Event and everyday glam has {event}, with in-studio and travel options.'],
  ],
  noteKick: 'Ready when you are',
  note: 'Tell Amairany your date, your timeline and who is getting ready with you.',
};

export const SERVICES = {
  ghost: 'glam',
  kick: 'Services',
  heading: ['Brides first,', 'then every occasion.'],
  sub: 'Hair, makeup or both. Bridal services for the wedding day, and soft-to-full glam for events and photoshoots. Each has its own direct way to book.',
  groups: [
    {
      id: 'weddings', label: 'Bridal hair & makeup', path: 'bridal',
      items: [
        { id: 'bridal-hair-makeup', title: 'Bridal Hair &amp; Makeup', plate: 'bride-crystal', film: 'f1', summary: 'Wedding-day hair, makeup or both, on real-life-filter skin that still looks like skin in every photograph.', points: ['Soft glam to full glam', 'Glam waves and bridal hair', 'Bridal packages and custom bridal experiences'] },
        { id: 'bridal-trial-party', title: 'Trials &amp; the Bridal Party', plate: 'bride-pearls', summary: 'A trial to design the look before the day, and hair and makeup for the people getting ready beside you.', points: ['Trial appointments', 'Bridal party and family', 'Planned around your ceremony time'] },
      ],
    },
    {
      id: 'events', label: 'Events & everyday glam', path: 'event',
      items: [
        { id: 'soft-to-full-glam', title: 'Soft Glam to Full Glam', plate: 'glam-sculpt', film: 'f2', summary: 'From barely-there to full glam, always on skin that never reads cakey.', points: ['Soft glam', 'Full glam', 'Real-life-filter skin'] },
        { id: 'glam-waves', title: 'Glam Waves &amp; Event Hair', plate: 'waves-blonde', film: 'f4', summary: 'Glam waves and polished styling for the event, the night out or the shoot.', points: ['Glam waves', 'Event hair', 'Hair, makeup or both'] },
        { id: 'events-photoshoots', title: 'Events &amp; Photoshoots', plate: 'glam-bronze', summary: 'Glam for the celebration or the camera, in studio or on location.', points: ['Events and celebrations', 'Photoshoots', 'In studio or on location'] },
      ],
    },
  ],
  pricing: 'Current packages and pricing are always live on',
  pricingLink: 'her booking page',
  slateHow: 'Two ways to book',
};

export const ABOUT = {
  kick: `About ${SITE.first}`,
  heading: ['Meet', `${SITE.first}.`],
  figKick: `${SITE.name} &middot; ${SITE.role}`,
  figLine: 'Soft glam to full glam, glam waves and luxury bridal.',
  slateStory: 'The story',
  storyKick: 'Behind the brushes',
  /* "since 2013" and "Aveda Institute, Winter Park, 2018" are from a 2024 OrlandoVoyager interview: she confirms the years */
  story: [
    `${SITE.name} is a luxury hair and makeup artist based in Florida, working across Orlando and Tampa. She has been doing makeup since 2013 and trained at the Aveda Institute in Winter Park, graduating in 2018.`,
    'Her signature is what she calls real-life-filter skin: complexion work that still looks like skin, in person and in photographs.',
  ],
  pull: '&ldquo;Real-life filter skin. Never cakey.&rdquo;',
  story2: [
    'From there the look goes wherever you want it: soft glam, full glam, glam waves. She works with brides and the people getting ready with them, and with clients dressing for events and photoshoots.',
    `Based in ${SITE.areaLong}. Appointments in studio or on location.`,
  ],
  facts: [['Doing makeup since', '2013'], ['Trained at', 'Aveda Institute'], ['Based in', SITE.area]],
  motion: 'In motion',
  slateBest: 'What she is known for',
  best: {
    kick: 'Three signatures',
    heading: ['Skin, glam,', 'waves.'],
    line: 'The three things her work is known for, and the look that suits the face in front of her.',
    items: [
      ['Real-life-filter skin', 'Complexion work that still looks like skin, in person and in photographs. Never cakey.'],
      ['Soft glam to full glam', 'From barely-there to full glam, for the wedding day, the event or the shoot.'],
      ['Glam waves', 'Brushed-out glam waves and polished event hair.'],
    ],
  },
  noteKick: 'Ready when you are',
  note: 'Getting married? Start a bridal inquiry. Dressing for an event? Choose a time on her calendar.',
};

/* Her reach, from the founder's media pack (her public TikTok profile), read 2026-11-19. Dated on
   the page wherever it is quoted; counts drift. */
export const SOCIAL = {
  asOf: 'November 19, 2026',
  tiktok: { followers: '178.1K', likes: '3.9M' },
  pinned: [{ film: 'f2', views: '1.6M' }, { film: 'f14', views: '1.5M' }, { film: 'f13', views: '1.1M' }],
  igLine: 'Florida + destination bridal hair &amp; makeup. Soft glam, full glam, bridal hair. Real-life filter, never cakey.',
};

export const REVIEWS = {
  ghost: 'kind words',
  kick: 'Reviews',
  heading: ['Five stars,', 'read them in full.'],
  sub: `${SITE.first}’s reviews live where her clients wrote them. Ratings and review counts are as shown on each site on ${SITE.ratingsAsOf}.`,
  /* no review is quoted until she chooses which ones to share */
  sites: [
    { name: 'WeddingWire', score: '5.0', meta: '31 reviews', go: 'Read on WeddingWire', href: L.ww },
    { name: 'The Knot', score: '5.0', meta: '4 reviews', go: 'Read on The Knot', href: L.knot },
  ],
  /* her Google Business listing "Amairanymua": 5.0 from 2 reviews, as seen in the founder's screenshot, 2026-11-19 */
  google: { name: 'Google', score: '5.0', meta: '2 reviews', asOf: 'November 19, 2026', line: `Rated 5.0 on Google from 2 reviews. Worked with ${SITE.first}? Leave her a review there.`, go: 'Review on Google', href: L.google },
  emptyKick: 'Word for word',
  emptyHeading: 'Her clients’ words, published as they wrote them.',
  emptyBody: `Review excerpts will appear here once ${SITE.first} has chosen which ones to share. Until then, every review is one tap away, in full, on the site it was written on.`,
  noteKick: 'Ready when you are',
  note: 'Getting married? Start a bridal inquiry. Dressing for an event? Choose a time on her calendar.',
};

/* The on-site bridal inquiry. It asks the questions her own JotForm asks, with its answer
   choices, as shown in the founder's screen recording of the form (2026-11-19); nothing typed
   here is sent anywhere, and the last step hands the bride to her real form. Her form could
   not be opened from the build environment, so the recording is the only source: she
   confirms which questions are required. */
export const INQUIRY = {
  label: 'Bridal Inquiry',
  heading: 'Tell her about your day.',
  body: `Your date, your timeline and who is getting ready with you. These are the questions ${SITE.first}’s own bridal inquiry asks, so her reply is about your wedding.`,
  qHeading: 'Not a bride?',
  qBody: 'Event and everyday glam books straight onto her calendar.',
  qLink: 'Book Event Makeup &amp; Hair',
  cardKick: 'Your bridal inquiry',
  note: 'An inquiry is not a confirmed booking, and no payment is taken here.',
  demoNote: 'Design preview: what you type stays in this browser and is not sent anywhere.',
  steps: [
    { key: 'day', label: 'The day', legend: 'Tell her about the day' },
    { key: 'glam', label: 'The glam', legend: 'Who is getting ready?' },
    { key: 'contact', label: 'Your contact', legend: `How can ${SITE.first} reach you?` },
    { key: 'review', label: 'Review', legend: 'Review your bridal inquiry' },
  ],
  /* answer choices exactly as her JotForm offers them (founder's recording, 2026-11-19) */
  firstLook: ['Absolutely, DUH!', 'No'],
  packages: ['The Luxe Bride', 'The Signature Soiree', 'The Luxe Gala', 'The Radiant Bride', 'The Luxe Glam', 'Glam Hair', 'Not sure yet'],
  stage: ['Dating around: searching for quotes', 'Ready to commit: looking to book my dream HMUA'],
  contactBy: ['Email me! I never answer the phone', 'Call me!', 'Text me!'],
  heardFrom: ['Instagram', 'Facebook', 'TikTok', 'Google', 'WeddingWire', 'The Knot', 'Zola', 'Other'],
  consent: `Sending an inquiry does not book your date or take any payment. ${SITE.first} replies to talk through your day.`,
  handoff: {
    strip: '<strong>Design preview</strong> &mdash; nothing was sent. Your answers never left this browser.',
    kick: 'One last step',
    heading: `Finish on ${SITE.first}’s own form.`,
    body: `Bridal inquiries reach ${SITE.first} through her own inquiry form. Copy your answers, open her form and paste them in: it asks the same questions, and there you can add photos of the hair and makeup you love. She sends a custom proposal and her availability within 24 to 48 hours.`,
    go: `Open ${SITE.first}’s inquiry form`,
    copy: 'Copy my answers',
    back: 'Back to my answers',
  },
};

export const FOOTER = {
  line: `Luxury hair and makeup by ${SITE.name}: soft-to-full glam, glam waves and real-life-filter skin for brides and events across ${SITE.area}.`,
  fine: `Design preview by JP Silva Digital for ${SITE.name}. This is a concept, not her official website. Photography from ${SITE.handle}, shown with her permission. Booking buttons open her own inquiry form and booking pages. The wordmark is concept styling, not an official logo.`,
};
