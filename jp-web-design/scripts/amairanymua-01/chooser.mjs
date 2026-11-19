/* /demo/amairanymua-01 — the founder's chooser (review build only).

   Six different sites for one artist, in two rounds: round two (4–6, her own red, black and
   white) first, then round one (1–3). Each card shows the site's real
   home page (a screenshot of the built page, phone and wide screen), how it opens,
   what it feels like, and a way in. Once one is picked (PICK in site.mjs) this page,
   its stylesheet and the preview images are no longer built or needed. */
import { A, BASE, ORIGIN, SITES, SITE, FILMS, pagesOf, PAGE_LABEL } from './site.mjs';

const PREVIEW = { phone: [780, 1688], wide: [1440, 900] };
const shot = (id, kind, alt) => {
  const [w, h] = PREVIEW[kind];
  return `<img src="${A}/img/preview-${id}-${kind}.webp" width="${w}" height="${h}" alt="${alt}" loading="${id === 'veil' ? 'eager' : 'lazy'}" decoding="async">`;
};

export function chooser() {
  const open = Object.values(FILMS).filter((f) => !f.file).length;
  const card = (x) => `<article class="ch-card" aria-labelledby="ch-${x.id}">
      <a class="ch-shots" href="${BASE}/${x.id}?intro=1" aria-label="Open preview ${x.n}, ${x.name}, and watch its opening" style="--ground:${x.swatch[0]}">
        <span class="ch-wide">${shot(x.id, 'wide', `${x.name}: the home page on a wide screen.`)}</span>
        <span class="ch-phone">${shot(x.id, 'phone', `${x.name}: the home page on a phone.`)}</span>
      </a>
      <div class="ch-body">
        <p class="ch-k"><span class="ch-n" aria-hidden="true">${x.n}</span> Preview ${x.n}</p>
        <h3 class="ch-t" id="ch-${x.id}">${x.name}</h3>
        <p class="ch-line">${x.line}</p>
        <p class="ch-p">${x.blurb}</p>
        <p class="ch-intro"><span>The opening</span> ${x.intro}</p>
        <p class="ch-sw" aria-hidden="true">${x.swatch.map((c) => `<i style="background:${c}"></i>`).join('')}</p>
        <a class="ch-go" href="${BASE}/${x.id}?intro=1">Open ${x.name} <span aria-hidden="true">&rarr;</span></a>
        <p class="ch-pages"><span class="ch-pages-k">Jump to</span> ${pagesOf(x.id).filter((p) => p && PAGE_LABEL[p]).map((p) => `<a href="${BASE}/${x.id}/${p}">${PAGE_LABEL[p]}</a>`).join('')}</p>
      </div>
    </article>`;
  const all = Object.values(SITES);
  const rounds = [
    { id: 'two', k: 'Round two', h: 'In her colours.', p: 'Red, black and white, from her own brand: &ldquo;Glam By Amairanymua&rdquo;. The red is a soft rose, used lightly. Each has an opening before the site appears, a photograph beside a film frame, the bridal inquiry beside the event booking with her About right under, a slideshow that moves on its own, and her links one tap away.', sites: all.filter((x) => x.n > 3) },
    { id: 'one', k: 'Round one', h: 'Three more directions.', p: 'The first three, in other palettes: pearl and champagne, espresso black, and peach.', sites: all.filter((x) => x.n <= 3) },
  ].filter((r) => r.sites.length);
  const cards = rounds.map((r) => `<section class="ch-round" aria-labelledby="ch-r-${r.id}">
    <div class="ch-round-head">
      <p class="ch-round-k">${r.k}</p>
      <h2 class="ch-round-h" id="ch-r-${r.id}">${r.h}</h2>
      <p class="ch-round-p">${r.p}</p>
    </div>
    <div class="ch-grid">
    ${r.sites.map(card).join('\n    ')}
    </div>
  </section>`).join('\n  ');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${SITE.name} — six previews · design preview</title>
<meta name="description" content="Six website previews for ${SITE.name} (${SITE.handle}) by JP Silva Digital. Design preview, not the official website.">
<meta name="robots" content="noindex,nofollow,noarchive">
<link rel="canonical" href="${ORIGIN}${BASE}">
<meta property="og:title" content="${SITE.name} — six website previews">
<meta property="og:description" content="Six previews by JP Silva Digital. Design preview, not the official website.">
<meta property="og:image" content="${ORIGIN}${A}/img/og.jpg">
<link rel="icon" type="image/svg+xml" href="${A}/img/favicon.svg">
<meta name="theme-color" content="#F7F4F0">
<link rel="preload" as="font" type="font/woff2" href="${A}/fonts/instrument-serif.woff2" crossorigin>
<link rel="stylesheet" href="${A}/css/chooser.css">
</head>
<body class="ch">
<main id="main" class="ch-wrap">
  <header class="ch-head">
    <p class="ch-flag">Design preview &middot; not the official site</p>
    <h1 class="ch-h">${SITE.name}, <em>six ways.</em></h1>
    <p class="ch-lede">Six complete sites, each with its own look, type and motion, and its own opening. They share her photographs, her words, her prices, her booking links and her bridal inquiry. Open each one on your phone, watch the opening, tap around, then pick the one to finish.</p>
  </header>

  ${cards}

  <section class="ch-same" aria-labelledby="ch-same-h">
    <h2 class="ch-same-h" id="ch-same-h">In every one</h2>
    <ul class="ch-list">
      <li><b>Book in one tap</b> &ldquo;Bridal inquiry&rdquo; and &ldquo;Book event glam&rdquo; are on the first screen of every page and stay within reach as you scroll.</li>
      <li><b>Bridal inquiry</b> On the site, in short steps, asking her own form&rsquo;s questions with her own answer choices. Demo mode: nothing is sent, and the last step hands off to her real form.</li>
      <li><b>Her booking</b> Event bookings and bridal services open her own booking pages, at the addresses on her link page.</li>
      <li><b>Her links</b> Instagram, TikTok and her Google reviews open in one tap, and her WeddingWire and The Knot ratings link to the reviews themselves.</li>
      <li><b>Stills and film</b> Her photographs move through the hero and the portfolio with film cutting in. ${open} film ${open === 1 ? 'spot is' : 'spots are'} marked and waiting for her reels: no stand-in video anywhere.</li>
      <li><b>Pages</b> Round two: Home, Portfolio, Bridal, About, a Journal with two sample articles, and the Bridal Inquiry (Rouge keeps a tighter five). Round one: Home, About, Bridal, Services, Portfolio, Reviews and the Bridal Inquiry.</li>
    </ul>
    <p class="ch-foot">The small marker at the foot of every page switches between 1 and 6 on the same page where that page exists, so any two can be compared screen for screen. The opening plays once per visit: add <code>?intro=1</code> to replay it.</p>
  </section>

  <p class="ch-fine">Concepts by JP Silva Digital for ${SITE.name} (${SITE.handle}). These are concepts, not her official website. Photography from ${SITE.handle}, shown with her permission. The wordmarks and monograms are concept styling, not an official logo.</p>
</main>
</body>
</html>
`;
}
