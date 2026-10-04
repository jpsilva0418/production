/* PROJECT — placeholder; the work builder replaces this file. */
import { layout } from './layout.mjs';
import { slate, esc } from './partials.mjs';
export function renderProject(ctx, p) {
  return layout(ctx, { id: 'project', route: 'work/' + p.slug, title: p.title, description: esc(p.type), body: slate(ctx, { reel: 'Work', title: esc(p.title) }) });
}
