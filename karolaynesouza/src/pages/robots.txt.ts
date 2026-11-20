import type { APIRoute } from 'astro';
// DEMO: never indexable. This build must never compete with anything of the client's in search.
export const GET: APIRoute = () => new Response(`User-agent: *\nDisallow: /\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
