import type { APIRoute } from 'astro';
// DEMO: never indexable. This build must never compete with Magnolia's live website.
export const GET: APIRoute = () => new Response(`User-agent: *\nDisallow: /\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
