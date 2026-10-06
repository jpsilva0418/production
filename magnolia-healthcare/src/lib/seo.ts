import { SITE } from '../consts';

export interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

/** DEMO: every page is noindex by default. This build must never compete with
 *  Magnolia's real website in search. Flip the default only at a real launch. */
export function resolveSeo(input: SeoInput = {}) {
  const title = input.title ? `${input.title} · ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const description = input.description ?? SITE.description;
  const canonical = new URL(input.path ?? '/', SITE.url).href;
  const image = new URL(input.image ?? '/media/og-default.jpg', SITE.url).href;
  return { title, description, canonical, image, type: input.type ?? 'website', noindex: input.noindex ?? true };
}

export const BUSINESS_ID = `${SITE.url}/#business`;

const DAY = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** LocalBusiness structured data — only facts from consts.ts (owner-verifiable). */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phoneE164,
    email: SITE.email,
    foundingDate: String(SITE.founded),
    founder: { '@type': 'Person', name: SITE.founder },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.latitude, longitude: SITE.geo.longitude },
    openingHoursSpecification: SITE.hours
      .filter((h) => h.open && h.close)
      .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DAY[DAY.indexOf(h.day)], opens: h.open, closes: h.close })),
    areaServed: SITE.serviceArea.regions.map((r) => ({ '@type': 'AdministrativeArea', name: r })),
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

export function articleJsonLd(input: { title: string; description: string; path: string; pubDate: Date; updated?: Date; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    datePublished: input.pubDate.toISOString(),
    dateModified: (input.updated ?? input.pubDate).toISOString(),
    image: new URL(input.image ?? '/media/og-default.jpg', SITE.url).href,
    mainEntityOfPage: new URL(input.path, SITE.url).href,
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: new URL(c.path, SITE.url).href })),
  };
}
