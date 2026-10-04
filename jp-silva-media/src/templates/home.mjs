/* HOME — Picture Start, frozen. The entrance, hero, features, contact strip, statement and closing credits are the
   selected design; this pass adds the featured film reel, a services call sheet and a real inquiry card. */
import { layout, orgGraph } from './layout.mjs';
import { esc, pad2, runtime, ratio, clipSources } from './partials.mjs';
import { reelSection } from './reel.mjs';

const OPENER = `<!-- Opening titles: visual chrome only, exists while the entrance runs -->
<div class="opener" id="opener" aria-hidden="true">
  <div class="bar bar-t"></div>
  <div class="bar bar-b"></div>
  <i class="cm cm-tl"></i><i class="cm cm-tr"></i><i class="cm cm-bl"></i><i class="cm cm-br"></i>
  <p class="op-mark"><i></i>Picture start</p>
  <p class="op-eyebrow ey">A visual world by</p>
  <p class="op-tc"><b>A001</b><span id="tc">00:00:00:00</span></p>
</div>
<p class="skip-hint">Tap to skip</p>`;

function card(ctx, p, n, total, { lines, label, title, note }) {
  const ln = (t, d) => `<span class="tc-line"${d ? ` style="--d:${d}s"` : ''}><span>${t}</span></span>`;
  return `<div class="tc">
          <div class="tc-top">
            <p class="tc-no">${ln(`<b>${pad2(n)}</b> / ${pad2(total)}`)}</p>
            <p class="tc-credits">${lines.map((l, i) => ln(esc(l), i ? (i * 0.09).toFixed(2) : 0)).join('')}</p>
          </div>
          <div class="tc-bottom">
            <p class="tc-label">${ln(esc(label))}</p>
            <h3 class="tc-title">${ln(esc(title), '.09')}</h3>
            <p class="tc-note">${ln(esc(note), '.18')}</p>
            <p class="tc-cta">${ln(`Watch the film<i aria-hidden="true"></i>`, '.27')}</p>
          </div>
        </div>
        <a class="feat-link" href="${ctx.href('work/' + p.slug)}" aria-label="Watch ${esc(p.title)}"></a>`;
}

function features(ctx) {
  const P = ctx.projects.reduce((m, p) => (m[p.id] = p, m), {});
  const meta = p => [p.type, runtime(p.media.duration), ratio(p.media.w, p.media.h)].filter(Boolean);
  const A = (p, file) => ctx.asset(file);
  const sr = P['showreel'], fd = P['field-at-dusk'], we = P['western'], nr = P['night-ride'], fo = P['forest-rain'], ch = P['desert-highway'];
  return `<section id="work" aria-labelledby="work-h">
    <div class="slate">
      <p class="mono"><span>Reel 02 · Selected films</span><span>06 films</span></p>
      <h2 id="work-h" data-reveal="clip">Features</h2>
    </div>

    <!-- 01 · the showreel as a triptych of three 9:16 frames -->
    <article class="feature f-tri" data-feature>
      <div class="feat-stage">
        <div class="tri">
          <figure class="frame tri-f"><img src="${A(sr, 'media/stills/m-wing.jpg')}" width="478" height="960" alt="Plane wing over a dry landscape" loading="lazy" decoding="async"><span class="frame-grade" aria-hidden="true"></span></figure>
          <figure class="frame tri-f"><img src="${A(sr, 'media/stills/m-bw.jpg')}" width="478" height="960" alt="A portrait in black and white" loading="lazy" decoding="async"><span class="frame-grade" aria-hidden="true"></span></figure>
          <figure class="frame tri-f"><img src="${A(sr, 'media/stills/m-rooftop.jpg')}" width="478" height="960" alt="Friends on a rooftop at sunset" loading="lazy" decoding="async"><span class="frame-grade" aria-hidden="true"></span></figure>
        </div>
        ${card(ctx, sr, 1, 6, { lines: ['Showreel', runtime(sr.media.duration), '9 : 16 · Three frames'], label: 'Showreel', title: 'Three frames', note: 'Wing · Black and white · Rooftop' })}
      </div>
    </article>

    <!-- 02 · reference frame: 2.39 band on desktop, full-bleed on phones -->
    <article class="feature f-ref" data-feature>
      <div class="feat-stage">
        <figure class="frame" style="--pos:50% 45%">
          <img src="${A(fd, 'media/film/fd-flare-poster.jpg')}" width="824" height="462" alt="Dancers against the setting sun" loading="lazy" decoding="async">
          <video class="jp-video" muted playsinline loop preload="none" aria-hidden="true" poster="${A(fd, 'media/film/fd-flare-poster.jpg')}">
            ${clipSources(ctx, 'fd-flare')}
          </video>
          <span class="frame-grade" aria-hidden="true"></span>
        </figure>
        ${card(ctx, fd, 2, 6, { lines: [...meta(fd).slice(1), '2.39 : 1 crop'], label: fd.type, title: fd.title, note: 'Dancers, a red pickup, golden hour' })}
      </div>
    </article>

    <!-- 03 · full-bleed, black and white; title top-left, credits bottom-right -->
    <article class="feature f-full" data-feature>
      <div class="feat-stage">
        <figure class="frame" style="--pos:50% 45%">
          <img src="${A(we, 'media/stills/w-gallop.jpg')}" width="630" height="496" alt="Horse and rider at speed, black and white" loading="lazy" decoding="async">
          <span class="frame-grade" aria-hidden="true"></span>
        </figure>
        ${card(ctx, we, 3, 6, { lines: [...meta(we).slice(1), 'Full frame · B&W'], label: we.type, title: we.title, note: 'Rider, revolver, saguaro' })}
      </div>
    </article>

    <!-- 04 · a quiet cut: small 2.39 band on desktop, light grade -->
    <article class="feature f-quiet" data-feature style="--grade-top:.3;--grade-bot:.45">
      <div class="feat-stage">
        <figure class="frame" style="--pos:50% 55%">
          <img src="${A(nr, 'media/stills/nr-headlight.jpg')}" width="734" height="384" alt="A headlight coming down the road at night" loading="lazy" decoding="async">
          <span class="frame-grade" aria-hidden="true"></span>
        </figure>
        ${card(ctx, nr, 4, 6, { lines: [...meta(nr).slice(1), 'Night'], label: nr.type, title: nr.title, note: 'Motorcycle, dusk, headlights' })}
      </div>
    </article>

    <!-- 05 · portrait still: full-bleed on phones, pillarboxed 9:16 beside its card on desktop -->
    <article class="feature f-tall" data-feature>
      <div class="feat-stage">
        <figure class="frame" style="--pos:50% 40%">
          <img src="${A(fo, 'media/stills/fo-trees.jpg')}" width="486" height="950" alt="Pines against a grey sky" loading="lazy" decoding="async">
          <span class="frame-grade" aria-hidden="true"></span>
        </figure>
        ${card(ctx, fo, 5, 6, { lines: [...meta(fo).slice(1)], label: fo.type, title: fo.title, note: 'Umbrella, pines, campfire' })}
      </div>
    </article>

    <!-- 06 · ultra-wide 2.76 band on desktop -->
    <article class="feature f-wide" data-feature>
      <div class="feat-stage">
        <figure class="frame" style="--pos:50% 58%">
          <img src="${A(ch, 'media/stills/ch-road.jpg')}" width="654" height="450" alt="A chopper on the open desert highway" loading="lazy" decoding="async">
          <span class="frame-grade" aria-hidden="true"></span>
        </figure>
        ${card(ctx, ch, 6, 6, { lines: [runtime(ch.media.duration), '2.76 : 1'], label: ch.type, title: ch.title, note: 'A chopper, a film camera, open road' })}
      </div>
    </article>
    <p class="feat-all"><a class="leader-link" href="${ctx.href('work')}">All work<i aria-hidden="true"></i></a></p>
  </section>`;
}

function strip(ctx) {
  const frames = [
    ['w-portrait', 630, 496, 'Hat portrait, black and white', 'Western, B&W', 'western'],
    ['fd-truck', 824, 462, 'A pickup with its lights on under a dusk sky', 'Field at Dusk', 'field-at-dusk'],
    ['m-concert', 478, 960, 'A crowd with arms raised against stage light', 'Showreel', 'showreel'],
    ['nr-dash', 734, 384, 'A motorcycle dashboard at dusk', 'Night Ride', 'night-ride'],
    ['ch-camera', 654, 450, 'A film camera on a motorcycle tank', 'Desert Highway', 'desert-highway'],
    ['fo-umbrella', 486, 950, 'A figure with an umbrella in a rain-dark forest', 'Forest, Rain', 'forest-rain']
  ];
  const items = frames.map(([n, w, h, alt, cap, slug], i) =>
    `<li${i ? '' : ' class="is-cur"'}><a href="${ctx.href('work/' + slug)}"><figure><div class="frame" style="aspect-ratio:${w}/${h}"><img src="${ctx.asset(`media/stills/${n}.jpg`)}" width="${w}" height="${h}" alt="${esc(alt)}" loading="lazy" decoding="async"></div><figcaption><b>FR ${pad2(i + 1)}</b><span>${esc(cap)}</span></figcaption></figure></a></li>`).join('\n        ');
  const ex = ctx.site.about.exhibition;
  const total = frames.length + 1;
  return `<section class="strip-sec" id="photography" aria-labelledby="photo-h">
    <div class="strip-pin">
      <div class="strip-head">
        <div>
          <p class="mono">Roll 03 · Stills</p>
          <h2 id="photo-h">Contact strip</h2>
        </div>
        <p class="strip-count"><b>FR 01</b> / ${pad2(total)}</p><span class="vh" id="strip-live" aria-live="polite"></span>
      </div>
      <ul class="strip" id="strip" aria-label="Stills from the films and prints from the exhibition">
        ${items}
        <li><a href="${ctx.href('work/prints')}"><figure><div class="frame" style="aspect-ratio:${ex.w}/${ex.h}"><img src="${ctx.asset(ex.small)}" width="${ex.w}" height="${ex.h}" alt="${esc(ex.alt)}" loading="lazy" decoding="async"></div><figcaption><b>FR ${pad2(total)}</b><span>Prints · Exhibited 2025</span></figcaption></figure></a></li>
      </ul>
      <p class="strip-foot mono"><span>Stills from the films · prints on the wall</span><span class="swipe">Swipe</span></p>
    </div>
  </section>`;
}

function services(ctx) {
  const rows = ctx.site.services.list.map((s, i) =>
    `<li data-reveal="rise"><a href="${ctx.href('services', s.id)}"><small>${pad2(i + 1)}</small><span class="cs-t">${esc(s.title)}</span><i aria-hidden="true"></i><span class="cs-l">${esc(s.line)}</span></a></li>`).join('\n      ');
  return `<section class="callsheet" id="services" aria-labelledby="services-h">
    <div class="slate">
      <p class="mono"><span>Call sheet · What JP makes</span><span>${pad2(ctx.site.services.list.length)} disciplines</span></p>
      <h2 id="services-h" data-reveal="clip">Services</h2>
    </div>
    <ol class="cs-list" data-stag=".06">
      ${rows}
    </ol>
    <p class="cs-all"><a class="leader-link" href="${ctx.href('services')}">How a project runs<i aria-hidden="true"></i></a></p>
  </section>`;
}

function about(ctx) {
  const a = ctx.site.about;
  const facts = a.facts.map(f => `<dt>${esc(f.label)}</dt><dd>${esc(f.value)}${f.note ? `<small>${esc(f.note)}</small>` : ''}</dd>`).join('\n        ');
  return `<section class="about" id="about" aria-labelledby="about-h">
    <div class="about-card">
      <h2 id="about-h" data-reveal="fade">Director’s statement</h2>
    </div>
    <div class="about-grid">
      <dl class="labels" data-reveal="fade">
        ${facts}
      </dl>
      <div class="statement" data-stag=".1">
        <p data-reveal>${esc(a.inHisWords[0])}</p>
        <p data-reveal>${esc(a.bio[0])}</p>
        <p class="statement-more" data-reveal><a class="leader-link" href="${ctx.href('about')}">More about JP<i aria-hidden="true"></i></a></p>
        <figure class="prints" data-reveal="img">
          <div class="frame" style="aspect-ratio:2.39/1">
            <img src="${ctx.asset(a.exhibition.small)}" srcset="${ctx.asset(a.exhibition.small)} 800w, ${ctx.asset(a.exhibition.src)} 1320w" sizes="(min-width:900px) 52vw, 100vw" width="1320" height="1034" alt="${esc(a.exhibition.alt)}" loading="lazy" decoding="async">
          </div>
          <figcaption><b>Prints shown</b><span>Group exhibition, 2025</span></figcaption>
        </figure>
      </div>
      <figure class="portrait" data-reveal="img">
        <div class="frame">
          <img src="${ctx.asset(a.portrait.small)}" srcset="${ctx.asset(a.portrait.small)} 800w, ${ctx.asset(a.portrait.src)} 1046w" sizes="300px" width="1046" height="1308" alt="${esc(a.portrait.alt)}" loading="lazy" decoding="async">
        </div>
        <figcaption><b>Portrait</b><span>JP Silva</span></figcaption>
      </figure>
    </div>
  </section>`;
}

function contact(ctx) {
  const s = ctx.site, ig = s.socials.find(x => x.id === 'instagram'), yt = s.socials.find(x => x.id === 'youtube');
  return `<section class="contact" id="contact" aria-labelledby="contact-h">
    <div class="cc" data-stag=".12">
      <h2 id="contact-h" class="cc-ey" data-reveal="fade">Now booking</h2>
      <p class="cc-title" data-reveal="fade">Tell JP what you’re making.</p>
      <dl class="cc-rows" data-reveal="fade">
        <div><dt>New project</dt><i aria-hidden="true"></i><dd><a href="${ctx.href('inquire')}">Start an inquiry</a></dd></div>
        <div><dt>Email</dt><i aria-hidden="true"></i><dd><a href="mailto:${s.email}">${s.email}</a></dd></div>
        <div><dt>Instagram</dt><i aria-hidden="true"></i><dd><a href="${ig.url}" rel="noopener" target="_blank">${ig.handle}</a></dd></div>
        <div><dt>YouTube</dt><i aria-hidden="true"></i><dd><a href="${yt.url}" rel="noopener" target="_blank">${yt.handle}</a></dd></div>
      </dl>
      <p class="cc-note mono" data-reveal="fade"><i aria-hidden="true"></i>Based in Austin, Texas</p>
    </div>
  </section>`;
}

export function renderHome(ctx) {
  const body = `  <!-- 1 · HERO: the end state of the title sequence. -->
  <section class="hero" aria-labelledby="name">
    <div class="hero-stage" id="stage">
      <figure class="frame band" id="band">
        <img src="${ctx.asset('media/film/hero-montage-poster.jpg')}" width="478" height="960" alt="" fetchpriority="high" decoding="async">
        <video class="jp-video" id="reel" muted playsinline preload="metadata" aria-hidden="true" poster="${ctx.asset('media/film/hero-montage-poster.jpg')}">
          ${clipSources(ctx, 'hero-montage')}
        </video>
        <span class="frame-grade" aria-hidden="true"></span>
      </figure>
      <figure class="frame dband" id="dband">
        <img src="${ctx.asset('media/film/fd-headlights-poster.jpg')}" width="824" height="462" alt="" loading="lazy" decoding="async">
        <video class="dv" muted playsinline preload="none" aria-hidden="true" poster="${ctx.asset('media/film/fd-headlights-poster.jpg')}">
          ${clipSources(ctx, 'fd-headlights')}
        </video>
        <video class="dv" muted playsinline preload="none" aria-hidden="true" poster="${ctx.asset('media/film/nr-silhouette-poster.jpg')}">
          ${clipSources(ctx, 'nr-silhouette')}
        </video>
        <span class="frame-grade" aria-hidden="true"></span>
      </figure>
      <p class="band-tc" aria-hidden="true"><b>A001</b><span id="band-tc">00:00:00:00</span></p>
      <h1 class="name" id="name">JP<br class="br-m"> Silva</h1>
    </div>
    <div class="hero-credits">
      <p class="roles">Filmmaker&nbsp;<b>·</b> Producer&nbsp;<b>·</b> Photographer</p>
      <p class="place"><span class="mono">Austin, Texas</span><span class="mono">${ctx.site.location.coords}</span></p>
    </div>
    <span class="cue" aria-hidden="true"></span>
  </section>

  <!-- 2 · FEATURED WORK: the film reel (YouTube where the host allows it; his own files otherwise) -->
  ${reelSection(ctx)}

  <!-- 3 · SELECTED FILMS: six title cards, each opens its film -->
  ${features(ctx)}

  <!-- 4 · INTERTITLE -->
  <section class="film" aria-label="Intertitle">
    <div class="intertitle">
      <p data-reveal="fade">Film that feels lived in, not staged.</p>
    </div>
  </section>

  <!-- 5 · PHOTOGRAPHY: contact strip -->
  ${strip(ctx)}

  <!-- 6 · SERVICES: a call sheet -->
  ${services(ctx)}

  <!-- 7 · ABOUT: director's statement -->
  ${about(ctx)}

  <!-- 8 · INQUIRY: an end-credit card -->
  ${contact(ctx)}`;

  return layout(ctx, {
    id: 'home', route: '', home: true,
    title: 'Home',
    description: 'JP Silva Media: music videos, brand films, live sessions and photography by JP Silva, filmmaker, producer and photographer in Austin, Texas.',
    before: OPENER,
    body,
    css: ['assets/css/reel.css'],
    js: ['assets/js/reel.js', 'assets/js/home.js'],
    og: 'media/stills/m-rooftop.jpg',
    jsonld: [orgGraph(ctx)]
  });
}
