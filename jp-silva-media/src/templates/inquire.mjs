/* INQUIRE — placeholder; the page builder replaces this file. */
import { layout } from './layout.mjs';
import { slate } from './partials.mjs';
export function renderInquire(ctx) {
  return layout(ctx, { id: 'inquire', route: 'inquire', title: 'Inquire', description: 'Inquire — JP Silva Media.', body: slate(ctx, { reel: 'Inquire', title: 'Inquire' }) });
}
