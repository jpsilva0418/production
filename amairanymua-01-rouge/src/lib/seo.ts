import { SITE, ORIGIN, A } from '../consts';

export interface SeoInput {
  title: string;
  description: string;
  path?: string;
}

/** DESIGN PREVIEW: every page is noindex,nofollow,noarchive and its title says "design preview".
 *  No structured data: this is a concept, not her business listing. */
export function resolveSeo(input: SeoInput) {
  const title = `${input.title} · ${SITE.name} · design preview`;
  const description = `${input.description} Design preview, not the official website.`;
  const canonical = `${ORIGIN}${input.path ?? '/demo/amairanymua-01/rouge'}`;
  const image = `${ORIGIN}${A}/img/og.jpg`;
  return { title, description, canonical, image };
}
