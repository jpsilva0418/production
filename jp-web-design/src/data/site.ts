/* ==========================================================================
   SITE — one source of truth for every business fact the site states.
   Nothing here may be invented. A fact JP has not confirmed stays `null`,
   and every template that renders it checks for null rather than printing a
   placeholder that looks real. `TODO(launch)` marks what must be filled in
   before the domain goes live.
   ========================================================================== */

export const SITE_NAME = 'JP Silva Digital';
export const FOUNDER = 'JP Silva';

export const EMAIL = 'jp@jpsilvadigital.com';

/** Display form and the tel: URI, kept together so they cannot drift. */
export const PHONE = '(774) 214-6342';
export const PHONE_URI = 'tel:+17742146342';

/** TODO(launch): confirmed service area. Drives copy only — never an address,
    and never LocalBusiness schema, which requires a real street address. */
export const SERVICE_AREA = 'Businesses across the United States';

/* No registered entity has been supplied, so the footer shows the plain
   brand copyright. Nothing is invented, and no placeholder is published. */
export const LEGAL_ENTITY: string | null = null;

/** Real profiles only. An empty array renders no social row. */
export const SOCIALS: { label: string; href: string }[] = [];

/** JP's own photograph, cropped two ways from one source. The compact crop
    is head-and-shoulders for the homepage circle; the wider one carries more
    of the frame for the larger portrait on /about. WebP first, JPEG fallback. */
export const FOUNDER_PHOTO = {
  /** Compact head-and-shoulders — homepage. */
  portrait: { webp: '/media/jp-silva-portrait.webp', jpg: '/media/jp-silva-portrait.jpg', size: 480 },
  /** Wider crop — /about. */
  wide: { webp: '/media/jp-silva.webp', jpg: '/media/jp-silva.jpg', size: 620 },
  alt: `${FOUNDER}, founder of ${SITE_NAME}`,
};

export const REPLY_SLA = 'one business day';
export const DEMO_TURNAROUND = '3–5 business days';
