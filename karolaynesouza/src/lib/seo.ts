import { SITE } from '../consts';

export interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

/** DEMO: every page is noindex,nofollow,noarchive by default. This build must never
 *  compete with anything the client already has in search. Flip only at a real launch. */
export function resolveSeo(input: SeoInput = {}) {
  const title = input.title ? `${input.title} · ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const description = input.description ?? SITE.description;
  const canonical = new URL(input.path ?? '/', SITE.url).href;
  const image = new URL(input.image ?? '/media/og-default.jpg', SITE.url).href;
  return { title, description, canonical, image, type: input.type ?? 'website', noindex: input.noindex ?? true };
}

export const BUSINESS_ID = `${SITE.url}/#business`;

/** BeautySalon structured data — only facts she has published. No opening hours (unconfirmed),
 *  no email, no price range, no ratings. */
export function businessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': BUSINESS_ID,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phoneE164,
    slogan: SITE.motto,
    image: new URL('/media/og-default.jpg', SITE.url).href,
    sameAs: [SITE.instagram.url],
    address: { '@type': 'PostalAddress', streetAddress: SITE.address.street, addressLocality: SITE.address.city, addressRegion: SITE.address.region, postalCode: SITE.address.zip, addressCountry: 'US' },
    founder: { '@type': 'Person', name: SITE.owner },
  };
}

export function serviceJsonLd(input: { name: string; description: string; path: string; serviceType: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: new URL(input.path, SITE.url).href,
    provider: { '@id': BUSINESS_ID },
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: new URL(c.path, SITE.url).href })),
  };
}
