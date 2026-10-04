/* ==========================================================================
   SITE — one source of truth for every business fact the site states.
   Nothing here may be invented. A fact JP has not confirmed stays `null`,
   and every template that renders it checks for null rather than printing a
   placeholder that looks real. `TODO(launch)` marks what must be filled in
   before the domain goes live.
   ========================================================================== */

export const SITE_NAME = 'JP Silva Digital';
export const FOUNDER = 'JP Silva';

/** TODO(launch): the real inbox. Used in mailto links and schema. */
export const EMAIL = 'jp@jpsilvadigital.com';

/** TODO(launch): a number a human answers. `null` renders nothing at all. */
export const PHONE: string | null = null;

/** TODO(launch): confirmed service area. Drives copy only — never an address,
    and never LocalBusiness schema, which requires a real street address. */
export const SERVICE_AREA = 'Businesses across the United States';

/** TODO(launch): the registered entity and state, for the footer and terms. */
export const LEGAL_ENTITY: string | null = null;

/** Real profiles only. An empty array renders no social row. */
export const SOCIALS: { label: string; href: string }[] = [];

/** Replace with the real founder photograph (see README → Founder photo).
    The placeholder is a marked empty frame, never a stock or generated face. */
export const FOUNDER_PHOTO = {
  src: '/media/founder-placeholder.svg',
  alt: `${FOUNDER}, founder of ${SITE_NAME}`,
  /** Flips to true once the real photo is in place; gates the "photo pending" note. */
  isReal: false,
};

export const REPLY_SLA = 'one business day';
export const DEMO_TURNAROUND = '3–5 business days';
