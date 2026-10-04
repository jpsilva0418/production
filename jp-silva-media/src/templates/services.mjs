/* SERVICES — a call sheet of what JP makes, proof from the work, how a project runs, and a closing title card. */
import { layout, orgGraph } from './layout.mjs';
import { esc, pad2, slate, img } from './partials.mjs';

function proof(ctx, s) {
  const ask = `<p class="svc-ask mono"><i aria-hidden="true"></i><a href="${ctx.href('inquire')}?service=${encodeURIComponent(s.id)}">Inquire<span class="vh"> about ${esc(s.title)}</span></a></p>`;
  if (!s.work) return ask;
  const works = ctx.projects.slice().sort((a, b) => a.order - b.order).filter(p => p.category.includes(s.work)).slice(0, 3);
  if (!works.length) return ask;
  const title = p => p.artist && p.category.includes('music-videos') ? `${p.artist} — ${p.title}` : p.title;
  const items = works.map((p, i) => `<li><a href="${ctx.href('work/' + p.slug)}"><figure><div class="frame svc-pf">${img(ctx, p.poster, { sizes: '(min-width:900px) 180px, 40vw', alt: '' })}</div><figcaption><b>FR ${pad2(i + 1)}</b><span>${esc(title(p))}</span></figcaption></figure></a></li>`).join('');
  return `<ul class="svc-proof" aria-label="${esc(s.title)}: selected work">${items}</ul>`;
}

export function renderServices(ctx) {
  const S = ctx.site.services;
  const list = S.list.map((s, i) => `<li class="svc-item" id="${s.id}" aria-labelledby="${s.id}-h" data-reveal="rise">
        <p class="svc-no mono">${pad2(i + 1)}</p>
        <div class="svc-main">
          <h3 class="svc-t" id="${s.id}-h">${esc(s.title)}</h3>
          <p class="svc-l">${esc(s.line)}</p>
        </div>
        ${proof(ctx, s)}
      </li>`).join('\n      ');
  const steps = S.process.map((p, i) => `<li class="svc-step" data-reveal="rise">
        <p class="svc-tc mono"><b>${pad2(i + 1)}</b><span>00:0${i}:00:00</span></p>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.line)}</p>
      </li>`).join('\n      ');
  const body = `${slate(ctx, { reel: 'Reel 03 · Services', right: `${pad2(S.list.length)} disciplines`, title: 'Services', sub: esc(S.intro) })}

  <section class="sec svc-sheet" aria-labelledby="sheet-h">
    <div class="sec-head"><h2 id="sheet-h">Call sheet</h2><p class="mono">What JP makes</p></div>
    <ol class="svc-list" data-stag=".06">
      ${list}
    </ol>
  </section>

  <section class="sec svc-run" aria-labelledby="run-h">
    <div class="sec-head"><h2 id="run-h">How a project runs</h2><p class="mono">${pad2(S.process.length)} steps · In order</p></div>
    <ol class="svc-steps" data-stag=".1">
      ${steps}
    </ol>
  </section>

  <section class="svc-end" aria-labelledby="end-h">
    <div class="cc" data-stag=".12">
      <p class="mono" data-reveal="fade">Next · Inquiry</p>
      <h2 id="end-h" class="cc-title svc-end-t" data-reveal="fade">Tell JP what you’re making.</h2>
      <dl class="cc-rows" data-reveal="fade">
        <div><dt>New project</dt><i aria-hidden="true"></i><dd><a href="${ctx.href('inquire')}">Start an inquiry</a></dd></div>
        <div><dt>Email</dt><i aria-hidden="true"></i><dd><a href="mailto:${ctx.site.email}">${ctx.site.email}</a></dd></div>
      </dl>
    </div>
  </section>`;
  return layout(ctx, {
    id: 'services', route: 'services', title: 'Services',
    description: 'Music videos, film and brand content, live coverage, photography, portraits and creative production by JP Silva in Austin, Texas — and how a project runs.',
    body, css: ['assets/css/pages.css'],
    jsonld: [orgGraph(ctx)]
  });
}
