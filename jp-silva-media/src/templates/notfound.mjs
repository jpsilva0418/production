/* 404 — placeholder; the pages builder replaces this file. */
import { layout } from './layout.mjs';
import { slate } from './partials.mjs';
export function renderNotFound(ctx) {
  return layout(ctx, { id: 'notfound', route: '404', title: 'Not found', description: 'This page does not exist.', body: slate(ctx, { reel: 'Error 404', title: 'Not found' }) });
}
