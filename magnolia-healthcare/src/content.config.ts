import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** The care Magnolia Healthcare, Inc. describes on its current site: six "Specialized
 *  Care" cards and four "How We Help" cards. `summary` is the site's own sentence,
 *  verbatim. No pricing is modelled: the current site publishes none. */
const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    short: z.string(),            // one-line summary (cards, ledger rows)
    summary: z.string(),          // the current site's description, verbatim
    kind: z.enum(['specialized', 'support']),
    order: z.number().default(99),
    numeral: z.string(),
    plate: z.string(),            // placeholder plate id (see src/assets/plates)
    serviceType: z.string(),
    draft: z.boolean().default(false),
  }),
});

/** "Magnolia Moments" — the posts on Magnolia's current blog, transcribed from the
 *  screen recording. A post whose full text was not captured is flagged `migrate: true`
 *  and renders an honest migration notice instead of invented copy. */
const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().max(90),
    description: z.string().max(200),
    pubDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    plate: z.string(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    migrate: z.boolean().default(false),
    sourceUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, posts };
