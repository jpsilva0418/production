import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
/** Magnolia's blog is titled "Magnolia Moments" on the current site and has no
 *  categories — the hub is a single flat journal. */
export const BLOG_NAME = 'Magnolia Moments';

export async function getPublishedPosts(): Promise<Post[]> {
  return (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.data.order - b.data.order);
}

export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

export function relatedPosts(post: Post, all: Post[], count = 3): Post[] {
  const score = (p: Post) =>
    p.data.tags.filter((t) => post.data.tags.includes(t)).length;
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .slice(0, count)
    .map(({ p }) => p);
}

export const fmtDate = (d: Date) => new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(d);
