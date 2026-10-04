/* ==========================================================================
   SITE — one source of truth for every business fact the site states.
   Nothing here may be invented. A fact JP has not confirmed stays `null`,
   and every template that renders it checks for null rather than printing a
   placeholder that looks real. `TODO(launch)` marks what must be filled in
   before the domain goes live.
   ========================================================================== */

export const SITE_NAME = 'JP Silva Digital';
export const FOUNDER = 'JP Silva';

export const EMAIL = 'jpsilva0418@gmail.com';

/** Display form and the tel: URI, kept together so they cannot drift. */
export const PHONE = '(774) 214-6352';
export const PHONE_URI = 'tel:+17742146352';

/* ---------------------------------------------------------------- Geography
   One canonical positioning, used deliberately rather than pasted onto every
   page. The business is based in Massachusetts and works remotely nationwide;
   neither half may be allowed to hide the other.

   These drive copy and schema `areaServed` only. There is deliberately no
   street address and no LocalBusiness schema: that type requires a real
   verifiable address, and JP has not supplied one. Inventing one is the
   fastest way to a manual action. */
export const BASE_STATE = 'Massachusetts';
export const REGIONS = ['Greater Boston', 'MetroWest'];
/** The full positioning sentence. Use where it genuinely helps a reader. */
export const POSITIONING =
  'Massachusetts-based. Serving Greater Boston, MetroWest, and businesses nationwide.';
/** Short form for tight spots like the footer. */
export const SERVICE_AREA = 'Massachusetts-based, working with businesses nationwide';

/* No registered entity has been supplied, so the footer shows the plain
   brand copyright. Nothing is invented, and no placeholder is published. */
export const LEGAL_ENTITY: string | null = null;

/** Real profiles only, exactly as JP supplied them — no handle was inferred.
    An empty array renders no social row anywhere, and `sameAs` is omitted
    from the Organization schema rather than published empty.

    NOT VERIFIED FROM THIS ENVIRONMENT: the build sandbox's egress proxy
    denies instagram.com, x.com, facebook.com and linkedin.com, so these
    URLs could not be fetched to confirm they resolve. Each needs one tap
    before launch.

    The LinkedIn URL is the supplied one with its `utm_*` tracking
    parameters removed — same profile path, nothing else changed. The
    Facebook link is a /share/ redirect and is kept byte-for-byte, since a
    cleaner canonical form cannot be derived without resolving it. */
export type SocialId = 'instagram' | 'x' | 'facebook' | 'linkedin';

export const SOCIALS: { id: SocialId; label: string; handle?: string; href: string }[] = [
  { id: 'instagram', label: 'Instagram', handle: '@jpsilva1994',
    href: 'https://www.instagram.com/jpsilva1994/' },
  { id: 'x', label: 'X', handle: '@Jpzs0w',
    href: 'https://x.com/Jpzs0w' },
  { id: 'facebook', label: 'Facebook',
    href: 'https://www.facebook.com/share/1CMTuH1NRC/?mibextid=wwXIfr' },
  { id: 'linkedin', label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jp-silva-117aa5a8' },
];

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
