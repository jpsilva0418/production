/* WORK — placeholder; the page builder replaces this file. */
import { layout } from './layout.mjs';
import { slate } from './partials.mjs';
export function renderWork(ctx) {
  return layout(ctx, { id: 'work', route: 'work', title: 'Work', description: 'Work — JP Silva Media.', body: slate(ctx, { reel: 'Work', title: 'Work' }) });
}
