/* SERVICES — placeholder; the page builder replaces this file. */
import { layout } from './layout.mjs';
import { slate } from './partials.mjs';
export function renderServices(ctx) {
  return layout(ctx, { id: 'services', route: 'services', title: 'Services', description: 'Services — JP Silva Media.', body: slate(ctx, { reel: 'Services', title: 'Services' }) });
}
