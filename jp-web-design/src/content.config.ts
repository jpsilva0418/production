import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* Blog content lives as Markdown on disk and is typed here. Deliberately no
   CMS: a handful of long-form posts a month does not justify a database, an
   admin UI, or a second deploy target. Adding a post is adding a .md file.

   The schema is strict so a missing description or a malformed date fails the
   build rather than shipping a page with an empty <meta name="description">. */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70),
    /** Used for the card excerpt AND the meta description, so keep it honest. */
    description: z.string().min(60).max(165),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(['Websites', 'Advertising', 'Working together']),
    /** Minutes, rounded. Stated rather than computed so it is never wrong. */
    readingTime: z.number().int().positive(),
    /** Omit to render the post without a lead image. */
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
