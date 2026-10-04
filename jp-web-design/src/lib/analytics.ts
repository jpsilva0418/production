/* ==========================================================================
   ANALYTICS — one module, one place to add a tag.

   Nothing on this site calls gtag or fbq directly. Pages call `track()`, and
   this module decides what that means. That keeps tracking scripts out of
   individual pages and means a future provider swap is one file.

   CONFIGURING IT (all optional; unset = no script loads, no cookie is set):
     PUBLIC_GA_ID=G-XXXXXXXXXX        Google Analytics 4
     PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXX  Google Ads conversion tracking
     PUBLIC_META_PIXEL_ID=XXXXXXXXXX  Meta Pixel

   With none set the site ships zero tracking bytes, which is the correct
   state until JP has the accounts. `track()` stays safe to call regardless —
   it no-ops. Server-side conversion APIs (Meta CAPI, Google offline
   conversions) need secret keys and must not be wired here; they belong on a
   server route.
   ========================================================================== */

export const GA_ID = (import.meta.env.PUBLIC_GA_ID as string | undefined) ?? '';
export const ADS_ID = (import.meta.env.PUBLIC_GOOGLE_ADS_ID as string | undefined) ?? '';
export const PIXEL_ID = (import.meta.env.PUBLIC_META_PIXEL_ID as string | undefined) ?? '';
export const hasAnalytics = Boolean(GA_ID || ADS_ID || PIXEL_ID);

/** The conversions worth counting. Named once so reports stay comparable and
    a typo cannot invent a second event that silently splits the data. */
export const EVENTS = {
  /* Intent — a click, not yet a conversion. */
  demoStart: 'get_free_demo_click',   // any "Get your free demo" button
  startProject: 'start_project_click',// any "Start a project" button
  projectView: 'project_view',        // portfolio project opened
  call: 'call_click',
  email: 'email_click',
  social: 'social_click',

  /* Conversions — fired ONLY after a genuine 2xx from the endpoint. Opening
     a form, focusing a field or failing validation fires none of these. */
  contactSubmit: 'contact_submit',
  demoComplete: 'free_demo_submit',

  /* Which service the converted inquiry named. Fired alongside the
     submission event, never instead of it. */
  webDesignInquiry: 'web_design_inquiry',
  googleAdsInquiry: 'google_ads_inquiry',
  metaAdsInquiry: 'meta_ads_inquiry',
} as const;

/** Map a "What do you need?" answer to its conversion event. Returns null for
    "Multiple Services" and "Not Sure", which name no single service. */
export function serviceEvent(need: string | undefined): EventName | null {
  if (!need) return null;
  if (need.startsWith('Website')) return EVENTS.webDesignInquiry;
  if (need.startsWith('Google')) return EVENTS.googleAdsInquiry;
  if (need.startsWith('Meta')) return EVENTS.metaAdsInquiry;
  return null;
}

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    /** Meta's loader sets this itself; declared so the snippet type-checks. */
    _fbq?: unknown;
    dataLayer?: unknown[];
  }
}

/** Fire a conversion. Safe before any tag loads, and safe when none exist. */
export function track(event: EventName, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', event, params);
    /* Meta's standard events are a fixed vocabulary; everything else must go
       through trackCustom or it is silently dropped. */
    if (event === EVENTS.contactSubmit || event === EVENTS.demoComplete) {
      window.fbq?.('track', 'Lead', params);
    } else {
      window.fbq?.('trackCustom', event, params);
    }
  } catch {
    /* Tracking must never break a form submission. */
  }
}

/** Delegated binding for links and buttons that carry `data-track="event"`.
    Called once by Analytics.astro, so no page wires its own listeners. */
export function bindDelegatedTracking(): void {
  if (typeof document === 'undefined') return;
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      const name = el.dataset.track as EventName | undefined;
      if (!name) return;
      track(name, el.dataset.trackLabel ? { label: el.dataset.trackLabel } : {});
    },
    { passive: true },
  );
}
