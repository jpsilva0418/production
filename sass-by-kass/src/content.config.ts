import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Kass's services — only the ones her supplied materials support (Instagram bio and
 *  highlights, her card, her photos and clips). No pricing is modelled: none was supplied;
 *  every card points at the right live booking path (HoneyBook or GlossGenius). */
const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    short: z.string(),                 // one line (cards)
    summary: z.string(),               // a paragraph (services page)
    points: z.array(z.string()).default([]),
    order: z.number().default(99),
    numeral: z.string(),
    plate: z.string(),                 // photo id (src/assets/plates)
    film: z.enum(['heroFilm', 'cineFilm', 'reelBlonde', 'reelBrunette']).optional(),
    /** Which destination books it: `bridal` → her HoneyBook inquiry, `salon` → GlossGenius. */
    path: z.enum(['bridal', 'salon']).default('salon'),
    serviceType: z.string(),
    draft: z.boolean().default(false),
  }),
});

/** Blog drafts — written for Kass to review and edit before launch. No invented facts, prices,
 *  timings or professional claims: planning questions and her own documented process only. */
const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().max(90),
    description: z.string().max(200),
    pubDate: z.coerce.date(),
    plate: z.string(),
    order: z.number().default(99),
    draft: z.boolean().default(true),     // true = awaiting Kass's review (shown with a draft note)
  }),
});

export const collections = { services, posts };
