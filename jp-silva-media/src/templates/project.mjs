/* PROJECT — one page per work: title card, the film as the hero at its real aspect, credits as leader rows,
   a contact strip of frames that opens the lightbox, then the next and previous reels. */
import { layout } from './layout.mjs';
import { esc, pad2, runtime, ratio, img, sources, leader } from './partials.mjs';
import { displayTitle } from '../data/projects.mjs';

const catLabel = (ctx, id) => (ctx.categories.find(c => c.id === id) || {}).label || id;
const ytWatch = id => `https://www.youtube.com/watch?v=${id}`;
const music = p => !!(p.artist && p.category.includes('music-videos'));

function titleCard(ctx, p, n, total) {
  const title = music(p)
    ? `<span class="pj-artist">${esc(p.artist)}</span><span class="vh"> — </span><span class="pj-name">${esc(p.title)}</span>`
    : `<span class="pj-name">${esc(p.title)}</span>`;
  return `<header class="page-slate pj-slate">
    <p class="mono"><span>Work · ${esc(catLabel(ctx, p.category[0]))} · <b class="pj-fr">FR ${pad2(n)}</b> / ${pad2(total)}</span><span><a class="pj-back" href="${ctx.href('work')}">All work</a></span></p>
    <h1 id="page-h" class="pj-h${music(p) ? ' is-music' : ''}">${title}</h1>
    <p class="pj-type mono"><i aria-hidden="true"></i>${esc(p.type)}${p.client && !p.type.includes(p.client) ? ` · ${esc(p.client)}` : ''}</p>
  </header>`;
}

function hero(ctx, p) {
  const m = p.media;
  const name = displayTitle(p);
  if (m.kind === 'youtube') {
    const poster = img(ctx, p.poster, { sizes: '(min-width:900px) 92vw, 100vw', eager: true });
    const control = ctx.youtube
      ? `<button type="button" class="play pj-play" data-yt="${esc(m.id)}" aria-label="Play ${esc(name)} (loads YouTube, with sound)"><i aria-hidden="true"></i><span>Play film</span></button>`
      : `<a class="play pj-play" href="${ytWatch(m.id)}" target="_blank" rel="noopener"><i aria-hidden="true"></i><span>Watch on YouTube <b aria-hidden="true">↗</b></span><span class="vh"> (opens in a new tab)</span></a>`;
    return `<section class="pj-stage" aria-label="Film">
    <div class="pj-screen" style="--ar:16/9;--arn:${(16 / 9).toFixed(4)}">
      <div class="frame pj-yt" id="pj-yt" data-title="${esc(name)}">
        ${poster}
        <span class="frame-grade" aria-hidden="true"></span>
        ${control}
        <p class="pj-screen-t mono" aria-hidden="true"><span>${esc(name)}</span><span>YouTube · 16 : 9</span></p>
      </div>
    </div>
    <p class="pj-under mono">${ctx.youtube ? `<a href="${ytWatch(m.id)}" target="_blank" rel="noopener">Watch on YouTube <span aria-hidden="true">↗</span><span class="vh"> (opens in a new tab)</span></a>` : '<span>Plays on YouTube</span>'}<span>Channel · ${esc(m.channel)}</span></p>
  </section>`;
  }
  if (m.kind === 'file') {
    const portrait = m.h > m.w;
    return `<section class="pj-stage" aria-label="Film">
    <div class="pj-screen${portrait ? ' is-portrait' : ''}" style="--ar:${m.w}/${m.h};--arn:${(m.w / m.h).toFixed(4)}">
      <div class="frame pj-film" id="pj-film">
        <video id="pj-video" playsinline preload="metadata" poster="${ctx.asset(`media/films/${m.film}-poster.jpg`)}" width="${m.w}" height="${m.h}" aria-label="${esc(name)}, film">
          ${sources(ctx, m.film)}
        </video>
        <button type="button" class="play pj-play" id="pj-play" aria-label="Play ${esc(name)} with sound"><i aria-hidden="true"></i><span>Play with sound</span></button>
        <p class="pj-screen-t mono" aria-hidden="true"><span>${esc(runtime(m.duration))}</span><span>${esc(ratio(m.w, m.h))}</span></p>
      </div>
    </div>
    <noscript><p class="pj-under mono"><a href="${ctx.asset(`media/films/${m.film}.mp4`)}">Open the film file</a></p></noscript>
  </section>`;
  }
  /* photography: the photo, large; opens the lightbox */
  const g = p.gallery[0] || p.poster;
  return `<section class="pj-stage" aria-label="Photograph">
    <div class="pj-screen is-photo" style="--ar:${p.poster.w}/${p.poster.h};--arn:${(p.poster.w / p.poster.h).toFixed(4)}">
      <a class="frame pj-photo" href="${ctx.asset(g.src)}" data-lb="0" aria-label="Open the photograph full screen">
        ${img(ctx, p.poster, { sizes: '(min-width:900px) 80vw, 100vw', eager: true })}
        <span class="pj-open mono" aria-hidden="true"><i></i>Full frame</span>
      </a>
    </div>
  </section>`;
}

function credits(ctx, p) {
  const m = p.media, rows = [];
  if (p.artist) rows.push(['Artist', esc(p.artist)]);
  if (p.client) rows.push(['Client', esc(p.client)]);
  rows.push(['Type', esc(p.type)]);
  rows.push(['Category', p.category.map(c => esc(catLabel(ctx, c))).join(' · ')]);
  if (m.kind === 'file') { rows.push(['Runtime', runtime(m.duration)]); rows.push(['Aspect', ratio(m.w, m.h)]); }
  if (p.year) rows.push(['Year', String(p.year)]);
  for (const c of p.credits || []) rows.push([esc(c.role), c.jp ? `<span class="pj-jp"><i aria-hidden="true"></i>${esc(c.name)}</span>` : esc(c.name)]);
  if (m.kind === 'youtube') {
    const meta = ctx.ytMeta && ctx.ytMeta[m.id];
    rows.push(['Channel', meta && meta.authorUrl ? `<a href="${esc(meta.authorUrl)}" target="_blank" rel="noopener">${esc(m.channel)}<span class="vh"> on YouTube (opens in a new tab)</span></a>` : esc(m.channel)]);
  }
  const verified = (p.credits || []).length ? `<p class="pj-src mono">Credits as they appear on the film’s own title card.</p>` : '';
  return `<section class="sec pj-credits" aria-labelledby="cr-h">
    <div class="pj-cr-grid">
      <div class="pj-cr-head">
        <p class="mono">Credits</p>
        <h2 id="cr-h">${esc(displayTitle(p))}</h2>
        ${verified}
      </div>
      <div class="pj-rows">
        ${rows.map(([k, v]) => leader(k, v)).join('\n        ')}
        ${p.description ? `<p class="pj-desc">${esc(p.description)}</p>` : ''}
      </div>
    </div>
  </section>`;
}

function frames(ctx, p) {
  if (!p.gallery.length || p.media.kind === 'photo') return '';
  const n = p.gallery.length;
  const items = p.gallery.map((g, i) =>
    `<li${i ? '' : ' class="is-cur"'}><a href="${ctx.asset(g.src)}" data-lb="${i}" aria-label="Open frame ${i + 1} of ${n}: ${esc(g.alt)}"><figure><div class="frame" style="aspect-ratio:${g.w}/${g.h}"><img src="${ctx.asset(g.src)}" width="${g.w}" height="${g.h}" alt="${esc(g.alt)}" loading="lazy" decoding="async"></div><figcaption><b>FR ${pad2(i + 1)}</b><span>${esc(g.alt)}</span></figcaption></figure></a></li>`).join('\n        ');
  return `<section class="strip-sec pj-frames" aria-labelledby="fr-h">
    <div class="strip-head">
      <div>
        <p class="mono">Roll · Frames from the film</p>
        <h2 id="fr-h">Frames</h2>
      </div>
      <p class="strip-count"><b>${pad2(n)}</b> frames</p>
    </div>
    <ul class="strip pj-strip" aria-label="Frames from ${esc(displayTitle(p))}">
        ${items}
    </ul>
    <p class="strip-foot mono"><span>Open a frame to view it full screen</span><span class="swipe">Swipe</span></p>
  </section>`;
}

function lightbox(ctx, p) {
  const imgs = p.gallery;
  if (!imgs.length) return '';
  const single = imgs.length < 2;
  return `<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Frames, full screen" hidden data-items='${esc(JSON.stringify(imgs.map(g => ({ src: ctx.asset(g.src), w: g.w, h: g.h, alt: g.alt }))))}'>
    <div class="lb-top">
      <p class="lb-count mono" aria-live="polite"><b id="lb-n">FR 01</b> / ${pad2(imgs.length)}</p>
      <button type="button" class="lb-btn lb-close" id="lb-close">Close<span aria-hidden="true">■</span></button>
    </div>
    <figure class="lb-fig">
      <div class="lb-img" id="lb-stage"><img id="lb-img" alt="" decoding="async"></div>
      <figcaption class="lb-cap mono" id="lb-cap"></figcaption>
    </figure>
    <div class="lb-nav"${single ? ' hidden' : ''}>
      <button type="button" class="lb-btn" id="lb-prev" aria-label="Previous frame"><span aria-hidden="true">←</span>Prev</button>
      <button type="button" class="lb-btn" id="lb-next" aria-label="Next frame">Next<span aria-hidden="true">→</span></button>
    </div>
  </div>`;
}

function nextPrev(ctx, p, list) {
  const i = list.indexOf(p);
  const prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
  const card = (q, dir) => `<a class="pj-np-card" href="${ctx.href('work/' + q.slug)}" rel="${dir === 'Next' ? 'next' : 'prev'}">
        <div class="frame" style="aspect-ratio:16/9">${img(ctx, q.poster, { sizes: '(min-width:900px) 46vw, 100vw', alt: '' })}<span class="frame-grade" aria-hidden="true"></span></div>
        <p class="mono pj-np-k"><span>${dir === 'Next' ? 'Next reel' : 'Previous reel'}</span><span>FR ${pad2(q.order)}</span></p>
        <p class="pj-np-t">${esc(displayTitle(q))}</p>
        <p class="mono pj-np-s">${esc(q.type)}</p>
      </a>`;
  return `<nav class="pj-np" aria-label="More work">
    <div class="pj-np-grid">
      ${card(prev, 'Previous')}
      ${card(next, 'Next')}
    </div>
    <div class="pj-np-foot">
      <a class="leader-link" href="${ctx.href('work')}">All work<i aria-hidden="true"></i></a>
      <a class="leader-link" href="${ctx.href('inquire')}">Start a project like this<i aria-hidden="true"></i></a>
    </div>
  </nav>`;
}

export function renderProject(ctx, p) {
  const list = ctx.sorted();
  const n = list.indexOf(p) + 1, total = list.length;
  const name = displayTitle(p);
  const typeLc = p.type.charAt(0).toLowerCase() + p.type.slice(1);
  const description = `${name}, ${typeLc}. Work by ${ctx.site.brand}, Austin, Texas.`;
  const S = ctx.site.url;
  const work = {
    '@context': 'https://schema.org', '@type': 'CreativeWork', name, url: ctx.abs('work/' + p.slug),
    image: S + '/' + p.poster.src, genre: p.category.map(c => catLabel(ctx, c)),
    ...(p.year ? { dateCreated: String(p.year) } : {}),
    ...(p.artist ? { byArtist: { '@type': 'MusicGroup', name: p.artist } } : {}),
    ...(p.media.kind !== 'youtube' ? { creator: { '@type': 'Organization', name: ctx.site.brand, url: S + '/' } } : {}),
    ...((p.credits || []).some(c => c.jp) ? { contributor: { '@type': 'Person', name: ctx.site.person } } : {}),
    ...(p.media.kind === 'youtube' ? { sameAs: ytWatch(p.media.id) } : {})
  };
  if (work.byArtist) { work.about = work.byArtist; delete work.byArtist; }
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Work', item: ctx.abs('work') },
    { '@type': 'ListItem', position: 2, name, item: ctx.abs('work/' + p.slug) }] };

  const body = `
  ${titleCard(ctx, p, n, total)}
  ${hero(ctx, p)}
  ${credits(ctx, p)}
  ${frames(ctx, p)}
  ${nextPrev(ctx, p, list)}
  ${lightbox(ctx, p)}`;

  return layout(ctx, {
    id: 'project', route: 'work/' + p.slug, title: name, description, body,
    css: ['assets/css/work.css'], js: ['assets/js/project.js'],
    og: p.poster.src, jsonld: [crumbs, work]
  });
}
