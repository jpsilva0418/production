/* ==========================================================================
   ROUTES — the one canonical route map.

   Every navigation component reads from here. Nothing may invent its own
   href: a label that appears in two menus has to resolve to the same URL in
   both, and a route that moves has to move in one place.

   Rules this file encodes:
     · one canonical URL per destination — no second address for the same page
     · no homepage anchors standing in for a page
     · hashes only where a section genuinely is the destination

   `build.format: 'file'` emits about.html, so a live pathname arrives as
   '/about.html'. `normalise()` is the one place that is undone; both menus
   and the navigation script use it so current-page detection and same-route
   detection can never disagree.
   ========================================================================== */
import { SERVICES } from './services';

export interface Route {
  /** Canonical path. Extensionless, no trailing slash, '/' for the root. */
  path: string;
  /** Menu label. */
  label: string;
  /** Longer label where a menu has room for it. */
  longLabel?: string;
}

export const ROUTES = {
  home:       { path: '/',           label: 'Home' },
  services:   { path: '/services',   label: 'Services',   longLabel: 'All Services' },
  work:       { path: '/work',       label: 'Work',       longLabel: 'Selected Work' },
  industries: { path: '/industries', label: 'Industries', longLabel: 'Industries I Work With' },
  about:      { path: '/about',      label: 'About Me' },
  blog:       { path: '/blog',       label: 'Blog' },
  process:    { path: '/process',    label: 'Process' },
  contact:    { path: '/contact',    label: 'Contact' },
  freeDemo:   { path: '/free-demo',  label: 'Free Demo', longLabel: 'Free Homepage Demo' },
  privacy:    { path: '/privacy',    label: 'Privacy' },
  terms:      { path: '/terms',      label: 'Terms' },
  accessibility: { path: '/accessibility', label: 'Accessibility' },
} as const satisfies Record<string, Route>;

/** The three service pages, derived from the service data so they cannot drift. */
export const SERVICE_ROUTES: Route[] = SERVICES.map((s) => ({
  path: `/services/${s.slug}`,
  label: s.navLabel ?? s.name,
  longLabel: s.pageTitle ?? s.name,
}));

/** Service page + "All Services", in menu order. */
export const SERVICE_CHILDREN: Route[] = [
  ...SERVICE_ROUTES,
  { path: ROUTES.services.path, label: ROUTES.services.longLabel },
];

/** Dynamic route prefixes. Used by the link checker, not by menus. */
export const DYNAMIC_PREFIXES = ['/blog/', '/work/', '/services/', '/industries/'] as const;

/* --------------------------------------------------------------------------
   Contact with a service preselected. ONE form implementation, one URL
   shape. `?service=` is read by src/lib/intake.ts#needFromHint.

   Deliberately no '#slug' on the end. That hash was a second hint channel,
   but /contact has no element with those ids, so it shipped as a dead
   fragment on every service CTA — a URL that looks like section navigation
   and is not.
   -------------------------------------------------------------------------- */
export const contactFor = (serviceSlug: string) =>
  `${ROUTES.contact.path}?service=${serviceSlug}`;

/* --------------------------------------------------------------------------
   Path normalisation. '/about.html' → '/about', '/work/' → '/work',
   '/index.html' → '/'. Used server-side for aria-current and client-side by
   the navigation script, from the same source, so "am I already here?" has
   exactly one answer.
   -------------------------------------------------------------------------- */
export function normalise(pathname: string): string {
  const p = pathname
    .replace(/\.html$/, '')
    .replace(/\/index$/, '')
    .replace(/(.)\/+$/, '$1');
  return p === '' ? '/' : p;
}
