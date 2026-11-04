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

export const collections = { services };
