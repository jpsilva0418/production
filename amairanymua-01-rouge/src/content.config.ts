import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Amairany's four services. Each file names a service in SERVICES (site.mjs) by `key` and
 *  sets only its order and numeral here, so no fact about her is typed twice. No pricing is
 *  modelled: current packages and pricing live on her own booking page. */
const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/services' }),
  schema: z.object({
    key: z.string(),
    order: z.number().default(99),
    numeral: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services };
