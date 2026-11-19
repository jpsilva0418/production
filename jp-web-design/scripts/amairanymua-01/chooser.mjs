/* /demo/amairanymua-01 — the founder's chooser (review build only).

   Three directions of ONE site. Each card shows the direction's real opening (a
   screenshot of the built page, phone and wide), what makes it different, and a way
   in. Once a direction is picked (PICK in site.mjs) this page, its stylesheet and the
   preview images are no longer built or needed. */
import { A, BASE, ORIGIN, DIRS, NAV, SITE, FILMS } from './site.mjs';

const PREVIEW = { phone: [780, 1688], wide: [1440, 900] };
const shot = (d, kind, alt) => {
  const [w, h] = PREVIEW[kind];
  return `<img src="${A}/img/preview-${d}-${kind}.webp" width="${w}" height="${h}" alt="${alt}" loading="${d === 'a' ? 'eager' : 'lazy'}" decoding="async">`;
};

export function chooser() {
  const slots = Object.values(FILMS).filter((f) => !f.file).length;
  const cards = Object.values(DIRS).map((x) => `<article class="ch-card pal-${x.id}" aria-labelledby="ch-${x.id}">
      <a class="ch-shots" href="${BASE}/${x.id}?intro=1" aria-label="Open direction ${x.letter}, ${x.full}, and watch its opening">
        <span class="ch-wide">${shot(x.id, 'wide', `Direction ${x.letter}, ${x.full}: the home page opening on a wide screen.`)}</span>
        <span class="ch-phone">${shot(x.id, 'phone', `Direction ${x.letter}, ${x.full}: the home page opening on a phone.`)}</span>
      </a>
      <div class="ch-body">
        <p class="ch-k"><span class="ch-letter" aria-hidden="true">${x.letter}</span> Direction ${x.letter}</p>
        <h2 class="ch-t" id="ch-${x.id}">${x.full}</h2>
        <p class="ch-hero">${x.hero}</p>
        <p class="ch-p">${x.blurb}</p>
        <p class="ch-sw" aria-hidden="true">${x.swatch.map((c) => `<i style="background:${c}"></i>`).join('')}</p>
        <a class="btn btn--solid ch-go" href="${BASE}/${x.id}?intro=1">Open direction ${x.letter}</a>
        <p class="ch-pages"><span class="ch-pages-k">Jump to</span> ${NAV.map((n) => `<a href="${BASE}/${x.id}/${n.path}">${n.label}</a>`).join('')}</p>
      </div>
    </article>`).join('\n    ');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${SITE.name} — three directions · design preview</title>
<meta name="description" content="Three design directions for ${SITE.name} (${SITE.handle}) by JP Silva Digital. Design preview, not the official website.">
<meta name="robots" content="noindex,nofollow,noarchive">
<link rel="canonical" href="${ORIGIN}${BASE}">
<meta property="og:title" content="${SITE.name} — website concept">
<meta property="og:description" content="Three directions by JP Silva Digital. Design preview, not the official website.">
<meta property="og:image" content="${ORIGIN}${A}/img/og.jpg">
<link rel="icon" type="image/svg+xml" href="${A}/img/favicon.svg">
<meta name="theme-color" content="#FBF7F2">
<link rel="preload" as="font" type="font/woff2" href="${A}/fonts/fraunces-var.woff2" crossorigin>
<link rel="stylesheet" href="${A}/css/system.css">
<link rel="stylesheet" href="${A}/css/chooser.css">
</head>
<body class="ch">
<main id="main" class="ch-wrap">
  <header class="ch-head">
    <p class="ch-flag">Design preview &middot; not the official site</p>
    <h1 class="disp ch-h">${SITE.name}, <span class="ital">three directions.</span></h1>
    <p class="ch-lede">One site, built on the same system as Sass by Kass: seven pages, the same words, her photographs and her own booking links. A direction is a colour palette and an opening. Open each one on your phone, watch the opening, then pick the one to finish.</p>
  </header>

  <div class="ch-grid">
    ${cards}
  </div>

  <section class="ch-same" aria-labelledby="ch-same-h">
    <h2 class="ch-same-h" id="ch-same-h">The same in all three</h2>
    <ul class="ch-list">
      <li><b>Seven pages</b> Home, About, Bridal, Services, Portfolio, Reviews and the Bridal Inquiry.</li>
      <li><b>The opening</b> Her name is drawn inside a ring, travels to its place, and the page assembles around it in under three seconds. Once per visit; any tap or scroll ends it.</li>
      <li><b>Stills and film</b> Her photographs move through the hero and the galleries with film cutting in. ${slots} film ${slots === 1 ? 'slot is' : 'slots are'} marked and waiting for her reels: no stand-in video anywhere.</li>
      <li><b>Bridal inquiry</b> On the site, in four short steps, asking her own form&rsquo;s questions. Demo mode: nothing is sent, and the last step hands off to her real form.</li>
      <li><b>Her booking</b> Event bookings and bridal services open her own booking pages, at the addresses on her link page.</li>
    </ul>
    <p class="ch-foot">The small marker at the foot of every page switches between A, B and C on the same page, so any two can be compared screen for screen.</p>
  </section>

  <p class="ch-fine">Concepts by JP Silva Digital for ${SITE.name} (${SITE.handle}). This is a concept, not her official website. Photography from ${SITE.handle}, shown with her permission. The wordmark is concept styling, not an official logo.</p>
</main>
</body>
</html>
`;
}
