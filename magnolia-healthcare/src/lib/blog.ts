import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type CategoryKey = Post['data']['category'];

/** Category hubs. Magnolia's current blog has no categories of its own; these
 *  three group the six existing articles by their subject and are easy to
 *  rename or remove if the client prefers a flat journal. */
export const CATEGORIES: Record<CategoryKey, { name: string; blurb: string; intro: string }> = {
  'our-values': {
    name: 'Our Values',
    blurb: 'What guides every visit — respect, compassion, honesty.',
    intro: 'Articles about the values Magnolia Healthcare is built on: putting clients first, building trust, and taking responsibility for the care we give.',
  },
  'home-care': {
    name: 'Home Care',
    blurb: 'Why non-medical care at home matters.',
    intro: 'Plain-language articles about non-medical home care — what it is, who it helps, and how it supports independence at home.',
  },
  'quality': {
    name: 'Quality & Accountability',
    blurb: 'How we keep improving.',
    intro: 'How Magnolia Healthcare approaches quality, accountability, and continuous improvement in home care.',
  },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

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
    (p.data.category === post.data.category ? 2 : 0) + p.data.tags.filter((t) => post.data.tags.includes(t)).length;
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .slice(0, count)
    .map(({ p }) => p);
}

export const fmtDate = (d: Date) => new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(d);
