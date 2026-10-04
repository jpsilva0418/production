/* ABOUT — placeholder; the page builder replaces this file. */
import { layout } from './layout.mjs';
import { slate } from './partials.mjs';
export function renderAbout(ctx) {
  return layout(ctx, { id: 'about', route: 'about', title: 'About', description: 'About — JP Silva Media.', body: slate(ctx, { reel: 'About', title: 'About' }) });
}
