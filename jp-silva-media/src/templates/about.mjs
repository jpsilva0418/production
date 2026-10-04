/* ABOUT — portrait + bio, his own words as an intertitle, facts, the exhibition print, links. */
import { layout, orgGraph } from './layout.mjs';
import { esc, slate, img, leader } from './partials.mjs';

export function renderAbout(ctx) {
  const s = ctx.site, a = s.about;
  const facts = a.facts.map(f => leader(esc(f.label), `${esc(f.value)}${f.note ? ` <small>${esc(f.note)}</small>` : ''}`)).join('\n        ');
  const links = [
    ...s.socials.map(x => leader(esc(x.label), `<a href="${x.url}" rel="noopener" target="_blank">${esc(x.handle)}<span class="vh"> (opens in a new tab)</span></a>`)),
    leader('Email', `<a href="mailto:${s.email}">${s.email}</a>`),
    leader('New project', `<a href="${ctx.href('inquire')}">Start an inquiry</a>`)
  ].join('\n        ');
  const ex = a.exhibition;
  const body = `${slate(ctx, { reel: 'Reel 04 · About · Austin, Texas', right: esc(s.roles.join(' · ')), title: 'About' })}

  <section class="sec ab-intro" aria-label="Biography">
    <figure class="ab-portrait" data-reveal="img">
      <div class="frame">${img(ctx, a.portrait, { sizes: '(min-width:900px) 30vw, 92vw', eager: true })}<span class="frame-grade" aria-hidden="true"></span></div>
      <figcaption><b>Portrait</b><span>${esc(s.person)}</span></figcaption>
    </figure>
    <div class="ab-bio prose" data-stag=".1">
      <p class="ab-lede" data-reveal>${esc(a.short)}</p>
      ${a.bio.map(p => `<p data-reveal>${esc(p)}</p>`).join('\n      ')}
    </div>
  </section>

  <section class="ab-words" aria-labelledby="words-h">
    <h2 id="words-h" class="mono"><i aria-hidden="true"></i>In his words</h2>
    <figure>
      <blockquote cite="https://www.jpsilvamedia.com/about" data-stag=".14">
        ${a.inHisWords.map((p, i) => `<p class="${i ? 'ab-q2' : 'ab-q1'}" data-reveal="fade">${esc(p)}</p>`).join('\n        ')}
      </blockquote>
      <figcaption class="mono"><b>${esc(s.person)}</b><span>From jpsilvamedia.com</span></figcaption>
    </figure>
  </section>

  <section class="sec ab-facts" aria-labelledby="facts-h">
    <div class="ab-col-k"><div class="sec-head"><h2 id="facts-h">Facts</h2></div></div>
    <div class="ab-rows" data-reveal="fade">
        ${facts}
    </div>
  </section>

  <section class="sec ab-print" aria-labelledby="print-h">
    <div class="sec-head"><h2 id="print-h">On the wall</h2><p class="mono">Photography</p></div>
    <figure class="ab-frame" data-reveal="img">
      <div class="frame" style="aspect-ratio:${ex.w}/${ex.h}">${img(ctx, ex, { sizes: '(min-width:900px) 60vw, 92vw' })}</div>
      <figcaption class="mono"><b>${esc(ex.caption)}</b><a class="ab-cap-link" href="${ctx.href('work/prints')}">View the prints</a></figcaption>
    </figure>
    <div class="ab-read">
      <p class="mono">Interview · ${esc(a.interview.outlet)}</p>
      <p class="ab-read-t">${esc(a.interview.label)}</p>
      <a class="leader-link" href="${a.interview.url}" rel="noopener" target="_blank">Read<span class="vh"> the interview on ${esc(a.interview.outlet)} (opens in a new tab)</span><i aria-hidden="true"></i></a>
    </div>
  </section>

  <section class="sec ab-contact" aria-labelledby="contact-h">
    <figure class="ab-wide" data-reveal="img"><div class="frame">${img(ctx, a.portraitWide, { sizes: '100vw' })}<span class="frame-grade" aria-hidden="true"></span></div></figure>
    <div class="ab-col-k"><div class="sec-head"><h2 id="contact-h">Find JP</h2></div></div>
    <div class="ab-rows" data-reveal="fade">
        ${links}
      <p class="ab-cta"><a class="leader-link" href="${ctx.href('inquire')}">Tell JP what you’re making<i aria-hidden="true"></i></a></p>
    </div>
  </section>`;
  const graph = orgGraph(ctx)['@graph'];
  const person = graph.find(n => n['@type'] === 'Person');
  return layout(ctx, {
    id: 'about', route: 'about', title: 'About',
    description: 'About JP Silva: filmmaker, producer and photographer from Bauru, Brazil, based in Austin, Texas — music videos, brand films, live work and exhibited prints.',
    body, css: ['assets/css/pages.css'], og: a.portrait.src,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'ProfilePage', url: ctx.abs('about'), name: `About ${s.person}`,
      mainEntity: { ...person, image: s.url + '/' + a.portrait.src, description: a.short }, about: { '@id': s.url + '/#jp' } },
      { '@context': 'https://schema.org', '@graph': graph.filter(n => n['@type'] === 'Organization') }]
  });
}
