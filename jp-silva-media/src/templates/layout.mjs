import { esc, header, menu, footer } from './partials.mjs';

const gate = home => `<script>(function(h){try{h.className+=' js${home ? '' : ' is-opened'}';if(!matchMedia('(prefers-reduced-motion: reduce)').matches){h.className+=' js-anim';setTimeout(function(){if(!(window.JP&&window.JP.__loaded))h.className=h.className.replace(' js-anim','')},4000)}}catch(e){}})(document.documentElement)</script>`;
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;500;600&family=Barlow:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet">`;

export function orgGraph(ctx) {
  const s = ctx.site;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': s.url + '/#studio', name: s.brand, url: s.url + '/', email: s.email,
      founder: { '@id': s.url + '/#jp' }, address: { '@type': 'PostalAddress', addressLocality: s.location.city, addressRegion: s.location.regionCode, addressCountry: s.location.country },
      sameAs: s.socials.map(x => x.url) },
    { '@type': 'Person', '@id': s.url + '/#jp', name: s.person, jobTitle: s.roles.join(', '), worksFor: { '@id': s.url + '/#studio' },
      birthPlace: s.origin, address: { '@type': 'PostalAddress', addressLocality: s.location.city, addressRegion: s.location.regionCode, addressCountry: s.location.country },
      sameAs: s.socials.map(x => x.url) }
  ] };
}

/* page: { id, route, title, description, body, css[], js[], home, og, jsonld[], before } */
export function layout(ctx, page) {
  const s = ctx.site;
  const full = page.home ? `${s.brand} — Filmmaker, Producer, Photographer · Austin, Texas` : `${page.title} · ${s.brand}`;
  const og = page.og ? (ctx.target === 'preview' ? ctx.asset(page.og) : s.url + '/' + page.og) : (ctx.target === 'preview' ? ctx.asset('media/stills/m-rooftop.jpg') : s.url + '/media/stills/m-rooftop.jpg');
  const css = ['assets/css/base.css', 'assets/css/picture-start.css', 'assets/css/site.css', ...(page.css || [])]
    .map(c => `<link rel="stylesheet" href="${ctx.asset(c)}">`).join('\n');
  const js = ['assets/js/core.js', 'assets/js/site.js', ...(page.js || [])]
    .map(j => `<script src="${ctx.asset(j)}"></script>`).join('\n');
  const ld = [...(page.jsonld || [])].map(o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');
  const config = { base: ctx.asset(''), youtube: ctx.youtube, inquiry: ctx.inquiryTransport, page: page.id, email: s.email };
  return `<!doctype html>
<html lang="en" data-page="${page.id}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${ctx.preview ? '<meta name="robots" content="noindex,nofollow">\n' : ''}<title>${esc(full)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${ctx.abs(page.route)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(s.brand)}">
<meta property="og:title" content="${esc(page.home ? s.brand : full)}"><meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${ctx.abs(page.route)}"><meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#050505">
<link rel="icon" href="${ctx.asset('favicon.svg')}" type="image/svg+xml">
${gate(page.home)}
${FONTS}
${css}
${ld}
<script>window.JPSM=${JSON.stringify(config)};</script>
</head>
<body class="pg-${page.id}">
<a class="skip-link" href="#main">Skip to content</a>
<i class="grain-layer" aria-hidden="true"></i>
${page.before || ''}
${header(ctx, page.id)}

<main id="main">
${page.body}
</main>

${footer(ctx)}

${menu(ctx, page.id)}

${js}
</body>
</html>
`;
}
