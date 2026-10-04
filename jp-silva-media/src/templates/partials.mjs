/* Shared building blocks. Every page is assembled from these so header, menu and footer never drift. */
export const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const pad2 = n => (n < 10 ? '0' : '') + n;
export const runtime = sec => { if (!sec) return null; const s = Math.round(sec); return pad2(Math.floor(s / 60)) + ':' + pad2(s % 60); };
export const ratio = (w, h) => { if (!w || !h) return null; const r = w / h; const known = [[2.39, '2.39 : 1'], [16 / 9, '16 : 9'], [1.85, '1.85 : 1'], [4 / 3, '4 : 3'], [1.27, '1.27 : 1'], [9 / 16, '9 : 16'], [1.3, '1.3 : 1']]; let best = known[0], bd = 9; for (const k of known) { const d = Math.abs(k[0] - r); if (d < bd) { bd = d; best = k; } } return bd < 0.06 ? best[1] : r.toFixed(2) + ' : 1'; };
export const sources = (ctx, film) => `<source src="${ctx.asset(`media/films/${film}.webm`)}" type="video/webm"><source src="${ctx.asset(`media/films/${film}.mp4`)}" type="video/mp4">`;
export const clipSources = (ctx, clip) => `<source src="${ctx.asset(`media/film/${clip}.webm`)}" type="video/webm"><source src="${ctx.asset(`media/film/${clip}.mp4`)}" type="video/mp4">`;

/* <img> for a poster/still object { src, small, w, h, alt } */
export function img(ctx, o, { sizes = '100vw', eager = false, cls = '', alt } = {}) {
  if (!o) return '';
  const srcset = o.small ? ` srcset="${ctx.asset(o.small)} ${o.small.includes('-640') ? 640 : 800}w, ${ctx.asset(o.src)} ${o.w}w" sizes="${sizes}"` : '';
  return `<img${cls ? ` class="${cls}"` : ''} src="${ctx.asset(o.small || o.src)}"${srcset} width="${o.w}" height="${o.h}" alt="${esc(alt != null ? alt : o.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}

export function header(ctx, current) {
  const links = ctx.site.nav.filter(n => n.id !== 'inquire').map(n =>
    `<li><a href="${ctx.href(n.route)}"${current === n.id ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('');
  return `<header class="site-head">
  <a class="wordmark" href="${ctx.href('')}"${current === 'home' ? ' aria-current="page"' : ''} aria-label="${esc(ctx.site.brand)}, home"><i aria-hidden="true"></i>${esc(ctx.site.brand)}</a>
  <nav class="head-nav" aria-label="Primary">
    <ul class="head-links">${links}</ul>
    <a class="head-cta" href="${ctx.href('inquire')}"${current === 'inquire' ? ' aria-current="page"' : ''}>Inquire<span aria-hidden="true">■</span></a>
    <button type="button" id="menu-btn" class="menu-btn" aria-expanded="false" aria-controls="menu">Index<span aria-hidden="true">■</span></button>
  </nav>
</header>`;
}

export function menu(ctx, current) {
  const items = [{ id: 'home', label: 'Home', route: '', tc: '00:00' }, ...ctx.site.nav];
  const list = items.map((n, i) => `<a href="${ctx.href(n.route)}" style="--i:${i}"${current === n.id ? ' aria-current="page"' : ''}><small>${n.tc}</small>${n.label}</a>`).join('\n      ');
  const ig = ctx.site.socials.find(s => s.id === 'instagram');
  return `<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Index" inert aria-hidden="true">
  <div class="menu-head">
    <span class="wordmark"><i aria-hidden="true"></i>Index</span>
    <button type="button" class="menu-close" id="menu-close">Close</button>
  </div>
  <div class="menu-body">
    <nav class="menu-list" aria-label="Index">
      ${list}
    </nav>
    <dl class="menu-side mono">
      <dt>Studio</dt><dd>${esc(ctx.site.brand)}</dd>
      <dt>Based</dt><dd>Austin, Texas<br>${ctx.site.location.coords}</dd>
      <dt>Works in</dt><dd>Music video, brand film, live, photography</dd>
      <dt>Email</dt><dd><a href="mailto:${ctx.site.email}">${ctx.site.email}</a></dd>
    </dl>
  </div>
  <p class="menu-foot mono"><span>${esc(ctx.site.brand)} · Austin, Texas</span><a href="${ig.url}" rel="noopener" target="_blank">Instagram ${ig.handle}</a></p>
</div>`;
}

export function footer(ctx) {
  const nav = ctx.site.nav.map(n => `<a href="${ctx.href(n.route)}">${n.label}</a>`).join('');
  const social = ctx.site.socials.map(s => `<li><a href="${s.url}" rel="noopener" target="_blank"><span>${s.label}</span>${esc(s.handle)}</a></li>`).join('');
  return `<footer class="credits" aria-label="Closing credits">
  <dl class="roll" data-stag=".1">
    <div data-reveal="rise"><dt>Filmmaker · Producer · Photographer</dt><dd>${esc(ctx.site.person)}</dd></div>
    <div data-reveal="rise"><dt>Studio</dt><dd>${esc(ctx.site.brand)}</dd></div>
    <div data-reveal="rise"><dt>Based in</dt><dd>Austin, Texas</dd></div>
  </dl>
  <nav class="foot-nav" aria-label="Footer" data-reveal="fade">${nav}</nav>
  <ul class="foot-social mono" data-reveal="fade">${social}<li><a href="mailto:${ctx.site.email}"><span>Email</span>${ctx.site.email}</a></li></ul>
  <p class="picture-end" data-reveal="fade"><i></i><i></i><i></i><i></i>Picture end<em aria-hidden="true"></em></p>
  <p class="foot-legal mono">© ${ctx.year} ${esc(ctx.site.brand)} · Austin, Texas</p>
</footer>`;
}

/* inner-page title card: a slate line + the page title */
export function slate(ctx, { reel, right, title, id = 'page-h', sub }) {
  return `<header class="page-slate">
    <p class="mono"><span>${reel}</span>${right ? `<span>${right}</span>` : ''}</p>
    <h1 id="${id}">${title}</h1>${sub ? `\n    <p class="page-sub">${sub}</p>` : ''}
  </header>`;
}

/* a leader-dotted call to action row: label ........ value */
export const leader = (label, inner) => `<div class="leader-row"><span class="lr-k">${label}</span><i aria-hidden="true"></i><span class="lr-v">${inner}</span></div>`;
