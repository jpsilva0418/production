/* WORK — the portfolio index. An editorial index of frames in black, composed like an edit:
   a lead frame, then pairs, then a full-width 2.39 moment, then pairs again. The composition is derived
   deterministically from order (see `compose`, mirrored in assets/js/work.js for filtering). */
import { layout, orgGraph } from './layout.mjs';
import { esc, pad2, runtime, ratio, img } from './partials.mjs';
import { displayTitle } from '../data/projects.mjs';

/* slot pattern: lead · pair · pair · wide · pair · pair · (repeat). A pair left alone becomes wide. */
export const PATTERN = ['lead', 'pa', 'pb', 'wide', 'pc', 'pd'];
export function compose(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const k = i % PATTERN.length;
    out.push(n === 1 ? 'lead' : (k === 1 || k === 4) && i === n - 1 ? 'wide' : PATTERN[k]);
  }
  return out;
}

/* the frame's real geometry */
export function geometry(p) {
  const m = p.media;
  if (m.kind === 'youtube') return { w: 16, h: 9, label: null };
  if (m.kind === 'file') return { w: m.w, h: m.h, label: ratio(m.w, m.h) };
  return { w: p.poster.w, h: p.poster.h, label: null };
}

const catLabel = (ctx, id) => (ctx.categories.find(c => c.id === id) || {}).label || id;

function item(ctx, p, i, total, slot) {
  const g = geometry(p);
  const portrait = g.h > g.w;
  const m = p.media;
  const music = p.artist && p.category.includes('music-videos');
  const meta = [catLabel(ctx, p.category[0]), m.kind === 'file' ? runtime(m.duration) : null, g.label, m.kind === 'youtube' ? 'YouTube' : null].filter(Boolean);
  const fr = `FR ${pad2(p.order)}`;
  const film = m.kind === 'file' ? ` data-film="${ctx.asset(`media/films/${m.film}.webm`)}" data-film-mp4="${ctx.asset(`media/films/${m.film}.mp4`)}"` : '';
  const sizes = /^p/.test(slot) ? '(min-width:900px) 46vw, 100vw' : '(min-width:900px) 92vw, 100vw';
  return `<li class="wk-item" data-slot="${slot}" data-cats="${esc(p.category.join(' '))}" data-kind="${m.kind}"${portrait ? ' data-portrait' : ''} style="--ar:${g.w}/${g.h};--arw:${(g.w / g.h).toFixed(4)}">
        <a class="wk-link" href="${ctx.href('work/' + p.slug)}">
          <div class="frame wk-frame"${film}>
            ${img(ctx, p.poster, { sizes, eager: i === 0, alt: '' })}
            <span class="frame-grade" aria-hidden="true"></span>
            <span class="wk-fr mono" aria-hidden="true"><b>${fr}</b> / ${pad2(total)}</span>
            ${m.kind === 'file' ? '<span class="wk-hint mono" aria-hidden="true"><i></i>Preview</span>' : ''}
          </div>
          <div class="wk-card">
            <p class="wk-label">${esc(p.type)}</p>
            <h2 class="wk-title">${music ? `<span class="wk-artist">${esc(p.artist)}</span><span class="wk-dash"> — </span><span class="wk-name">${esc(p.title)}</span>` : `<span class="wk-name">${esc(displayTitle(p))}</span>`}</h2>
            <p class="wk-meta mono">${meta.map(esc).join('<i aria-hidden="true">·</i>')}</p>
          </div>
        </a>
      </li>`;
}

export function renderWork(ctx) {
  const list = ctx.sorted();
  const total = list.length;
  const slots = compose(total);
  const used = ctx.categories.map(c => ({ ...c, n: list.filter(p => p.category.includes(c.id)).length })).filter(c => c.n > 0);
  const filters = [{ id: 'all', label: 'All', n: total }, ...used].map(c =>
    `<li><button type="button" class="wk-f" data-cat="${c.id}" aria-pressed="${c.id === 'all'}" aria-controls="wk-list"><i aria-hidden="true"></i><span>${esc(c.label)}</span><small>${pad2(c.n)}</small></button></li>`).join('\n      ');

  const body = `
  <header class="page-slate wk-slate">
    <p class="mono"><span>Reel 02 · Work</span><span>${pad2(total)} pieces</span></p>
    <h1 id="page-h">Work</h1>
    <p class="page-sub">Music videos, venue and brand films, live sessions, his own films, and prints. Every piece opens on its own page, at its real aspect.</p>
  </header>

  <section class="wk" aria-labelledby="page-h">
    <nav class="wk-filter" aria-label="Filter work by category">
      <p class="mono wk-filter-k">Show</p>
      <ul>
      ${filters}
      </ul>
      <p class="mono wk-count" id="wk-count" aria-hidden="true"><b>${pad2(total)}</b> / ${pad2(total)} pieces</p>
    </nav>
    <p class="vh" id="wk-live" aria-live="polite"></p>
    <ol class="wk-list" id="wk-list">
      ${list.map((p, i) => item(ctx, p, i, total, slots[i])).join('\n      ')}
    </ol>
    <p class="wk-empty mono" id="wk-empty" hidden>Nothing in this category yet.</p>
  </section>

  <section class="wk-end" aria-label="Start a project">
    <p class="mono">End of reel</p>
    <p class="wk-end-t">Have something to make?</p>
    <p><a class="leader-link" href="${ctx.href('inquire')}">Start a project<i aria-hidden="true"></i></a></p>
  </section>`;

  const cats = used.map(c => c.label.toLowerCase()).join(', ');
  return layout(ctx, {
    id: 'work', route: 'work', title: 'Work',
    description: `The work of JP Silva Media: ${total} pieces across ${cats}. Filmmaker, producer and photographer JP Silva, Austin, Texas.`,
    body,
    css: ['assets/css/work.css'],
    js: ['assets/js/work.js'],
    og: list[0].poster.src,
    jsonld: [orgGraph(ctx), {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Work', url: ctx.abs('work'),
      isPartOf: { '@type': 'WebSite', name: ctx.site.brand, url: ctx.site.url + '/' },
      mainEntity: { '@type': 'ItemList', numberOfItems: total, itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: ctx.abs('work/' + p.slug), name: displayTitle(p) })) }
    }]
  });
}
