/* FEATURED WORK — the home reel. A director's reel of JP's real films right after the hero.
   Two engines share one UI (reel.js): YouTube (web host) and his own files with sound (preview host / fallback).
   The section is complete without JS: the first film's poster, title card, "Watch the film", and the other films. */
import { esc, pad2, runtime } from './partials.mjs';
import { displayTitle } from '../data/projects.mjs';

const credit = p => {
  const c = (p.credits || []).find(x => x.jp);
  return c ? `${c.role} ${c.name}` : null;
};

function entry(ctx, p, kind) {
  const yt = kind === 'youtube';
  const film = yt ? null : p.media.film;
  const poster = yt
    ? { src: ctx.asset(p.poster.src), small: ctx.asset(p.poster.small), w: 1280, h: 720 }
    : { src: ctx.asset(`media/films/${film}-poster.jpg`), small: null, w: p.media.w, h: p.media.h };
  return {
    id: p.id,
    title: p.title,
    display: displayTitle(p),
    artist: p.artist || p.client || (yt ? null : ctx.site.person),
    type: p.type || null,
    href: ctx.href('work/' + p.slug),
    youtubeId: yt ? p.media.id : null,
    youtubeUrl: yt ? `https://www.youtube.com/watch?v=${p.media.id}` : null,
    start: p.reelStart != null ? p.reelStart : null,
    duration: p.media.duration || null,
    files: yt ? null : { webm: ctx.asset(`media/films/${film}.webm`), mp4: ctx.asset(`media/films/${film}.mp4`) },
    w: yt ? 16 : p.media.w, h: yt ? 9 : p.media.h,
    portrait: !yt && p.media.h > p.media.w,
    poster: poster.src, posterSmall: poster.small, posterW: poster.w, posterH: poster.h,
    alt: p.poster ? p.poster.alt : '',
    credit: credit(p),
    credits: !!(p.credits && p.credits.length)
  };
}

export function reelSection(ctx) {
  const by = Object.fromEntries(ctx.projects.map(p => [p.id, p]));
  const r = ctx.site.reel;
  const yt = r.youtube.map(id => by[id]).filter(p => p && p.media && p.media.kind === 'youtube').map(p => entry(ctx, p, 'youtube'));
  const files = r.files.map(id => by[id]).filter(p => p && p.media && p.media.kind === 'file').map(p => entry(ctx, p, 'file'));
  const list = ctx.youtube && yt.length ? yt : files;
  const engine = list === yt ? 'youtube' : 'file';
  const f = list[0], n = list.length;
  const data = { engine, segment: r.segment, youtube: yt, files };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  const meta = e => [e.artist, e.type].filter(Boolean).map(esc).join('<b aria-hidden="true">·</b>');
  const pips = list.map((e, i) =>
    `<li><button type="button" class="rl-pip" data-i="${i}" aria-label="${esc(e.display)}"${i ? '' : ' aria-current="true"'}><i aria-hidden="true"></i></button></li>`).join('');
  const others = list.slice(1).map((e, i) =>
    `<li><a href="${e.href}"><small>${pad2(i + 2)}</small><span>${esc(e.display)}</span><i aria-hidden="true"></i><em>${esc(e.type || '')}</em></a></li>`).join('\n          ');
  const srcset = f.posterSmall ? ` srcset="${f.posterSmall} 640w, ${f.poster} ${f.posterW}w" sizes="(min-width:900px) 74vw, 100vw"` : '';
  const dur = f.duration ? runtime(f.duration) : null;

  return `<section class="rl" id="featured" aria-labelledby="featured-h" data-engine="${engine}">
    <div class="slate rl-slate">
      <p class="mono"><span>Reel 01 · Featured work</span><span class="rl-total">${pad2(n)} films</span></p>
      <h2 id="featured-h" data-reveal="clip">Featured work</h2>
    </div>
    <div class="rl-reel" id="rl" tabindex="-1">
      <div class="rl-stage">
        <div class="rl-rail rl-rail-l" aria-hidden="true">
          <p class="mono">Reel 01<br><span>Featured</span></p>
          <p class="rl-big"><b class="rl-bign">${pad2(1)}</b><span>/ ${pad2(n)}</span></p>
        </div>
        <div class="rl-screen${f.portrait ? ' is-portrait' : ''}" id="rl-screen">
          <div class="rl-poster">
            <img id="rl-img" class="${engine === 'file' ? 'is-contain' : ''}" src="${f.posterSmall || f.poster}"${srcset} width="${f.posterW}" height="${f.posterH}" alt="${esc(f.alt)}" loading="lazy" decoding="async">
          </div>
          <div class="rl-vids" id="rl-vids"></div>
          <div class="rl-yt" id="rl-yt"><div id="rl-yt-host"></div></div>
          <button type="button" class="rl-gate play" id="rl-gate" hidden><i aria-hidden="true"></i><span>Play film</span></button>
          <div class="rl-err" id="rl-err" hidden>
            <p class="mono">This film plays on YouTube</p>
            <p class="rl-err-row"><a class="leader-link" id="rl-err-yt" href="#" target="_blank" rel="noopener">Watch on YouTube ↗</a><button type="button" class="rl-btn" id="rl-err-next"><i aria-hidden="true"></i>Skip to next film</button></p>
          </div>
          <p class="rl-nojs-cta"><a class="leader-link" href="${f.href}">Watch the film<i aria-hidden="true"></i></a></p>
        </div>
        <div class="rl-rail rl-rail-r" aria-hidden="true">
          <p class="mono"><span class="rl-mode">Reel · ${r.segment} s cuts</span><br><span class="rl-snd-k">Sound off</span></p>
          <p class="rl-tc"><i></i><b>R01</b><span id="rl-tc">00:00:00:00</span></p>
        </div>
      </div>
      <div class="rl-strip">
        <ol class="rl-pips" id="rl-pips" aria-label="Films in the reel">${pips}</ol>
        <div class="rl-prog" id="rl-prog" role="progressbar" aria-label="Progress of the current film" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
      </div>
      <div class="rl-foot">
        <div class="rl-cap" id="rl-cap">
          <p class="rl-meta mono"><span class="rl-l"><span id="rl-meta">${meta(f)}</span></span></p>
          <h3 class="rl-title"><span class="rl-l"><span id="rl-title">${esc(f.display)}</span></span></h3>
          <a class="rl-proj" id="rl-proj" href="${f.href}">Project<span aria-hidden="true"> →</span><span class="vh" id="rl-proj-t"> ${esc(f.display)}</span></a>
          <p class="rl-sub mono"><span class="rl-l"><span id="rl-sub">${esc([f.credit, dur].filter(Boolean).join(' · '))}</span></span></p>
        </div>
        <div class="rl-ctl" id="rl-ctl">
          <button type="button" class="rl-btn rl-prev" id="rl-prev" aria-label="Previous film"><i aria-hidden="true"></i></button>
          <p class="rl-count mono" aria-hidden="true"><b id="rl-n">${pad2(1)}</b> / <span id="rl-of">${pad2(n)}</span></p>
          <button type="button" class="rl-btn rl-next" id="rl-next" aria-label="Next film"><i aria-hidden="true"></i></button>
          <span class="rl-gap" aria-hidden="true"></span>
          <button type="button" class="rl-btn rl-pp" id="rl-pp" aria-label="Play"><i aria-hidden="true"></i></button>
          <button type="button" class="rl-btn rl-snd" id="rl-snd" aria-pressed="false"><i aria-hidden="true"></i><span>Sound off</span></button>
        </div>
      </div>
      <div class="rl-nojs">
        <p class="mono">Also in the reel</p>
        <ol class="rl-list">
          ${others}
        </ol>
      </div>
      <p class="vh" id="rl-live" aria-live="polite"></p>
    </div>
    <script type="application/json" id="reel-data">${json}</script>
  </section>`;
}
