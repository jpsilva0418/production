/* 404 — a missing reel card. */
import { layout } from './layout.mjs';
export function renderNotFound(ctx) {
  const body = `<section class="nf" aria-labelledby="nf-h">
    <div class="nf-card">
      <i class="cm cm-tl" aria-hidden="true"></i><i class="cm cm-tr" aria-hidden="true"></i><i class="cm cm-bl" aria-hidden="true"></i><i class="cm cm-br" aria-hidden="true"></i>
      <p class="mono nf-top"><span><i aria-hidden="true"></i>Error 404 · Reel not found</span><span>Reel — · No picture</span></p>
      <h1 id="nf-h">This reel is missing</h1>
      <p class="nf-line">The page you asked for isn’t on any reel. It may have moved, or the link may be wrong.</p>
      <nav class="nf-links" aria-label="Where to go">
        <div class="leader-row"><span class="lr-k">Reel 01</span><i aria-hidden="true"></i><span class="lr-v"><a href="${ctx.href('')}">Home</a></span></div>
        <div class="leader-row"><span class="lr-k">Reel 02</span><i aria-hidden="true"></i><span class="lr-v"><a href="${ctx.href('work')}">Work</a></span></div>
        <div class="leader-row"><span class="lr-k">Reel 05</span><i aria-hidden="true"></i><span class="lr-v"><a href="${ctx.href('inquire')}">Inquire</a></span></div>
      </nav>
    </div>
  </section>`;
  return layout(ctx, { id: 'notfound', route: '404', title: 'Reel not found',
    description: 'Error 404: this page is not part of the JP Silva Media site. Head back to the work, the home page or the inquiry form.',
    body, css: ['assets/css/pages.css'] });
}
