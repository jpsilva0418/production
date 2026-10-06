# 01 — Completion report (rebuilt on Massachusetts sources)

> **Read `02-contamination-audit.md` first.** The initial build used facts from a different
> Colorado company; every item was removed and the content layer was reconstructed from the
> Massachusetts client's own materials. This report describes the corrected demo.

## Private preview URL

**https://magnolia-healthcare-demo.onrender.com** — Render static site `magnolia-healthcare-demo`
(workspace "My Workspace"), built from branch `claude/magnolia-healthcare-premium-bkmn0o`,
Root `magnolia-healthcare/`, auto-deploys on every push to that branch.

Why Render and not Vercel: the Vercel connector in this session is read-only (every
create/deploy call returns 403 "You don't have permission to create the project"). The
intended pattern (Vercel project `magnolia-healthcare-demo`, Root Directory
`magnolia-healthcare`, git-linked to `jpsilva0418/production`, Vercel Auth on preview URLs,
later a `*.jpsilvadigital.com` subdomain) is documented and ready; it needs the Vercel
connector re-authorised with write access (claude.ai → Customize → Connectors, then a new
session) or a `VERCEL_TOKEN` in the environment. The Render preview is public but `noindex`,
carries the demo badge, and sends nothing anywhere.

## Pages built (11 + redirects)

`/` · `/services` (six specialized-care rows + four "how we help") · `/mission` · `/blog` ·
`/blog/a-little-extra-love` · `/blog/art-class` (excerpt, flagged for migration) · `/consultation`
(+ `?for=care|self`, `&service=<slug>`) · `/careers` (+ PDF download) · `/apply` (caregiver
application, 9 steps) · `/login` (entry point only) · `/404` · `robots.txt` (disallow all) ·
sitemap. Redirects keep old preview links alive: `/contact`→`/consultation`, `/team` and
`/community`→`/mission`, `/accessibility`→`/`, old service and category URLs→hubs.

## Components reused / adapted from Letty Silva Beauty

Prologue hero system (veil title card → film, CSS-only, LCP-safe, reduced-motion = finished
page) · V2 motion grammar (`.rv` clip reveals, `.rv-im`, `.fade`, `data-stag`, parallax hosts,
late-reveal sweep) · underline-to-fill buttons with sheen, expanding-underline links · kicker
furniture, chapter slates, sticky chapters, cinema bands, ghost words, note card, light layers,
grain · full-screen menu (inert, focus trap, Escape) · grand footer · lazy film pattern ·
multi-step form state machine (progress, recap, review + edit, inline validation, copy fallback,
honeypot, analytics hooks) · inquiry handler modes (deliver / staged, never a false success) ·
blog system (featured, search, article, related) · SEO/JSON-LD helpers, content collections,
consts-as-truth, `format:'file'` build, demo badge.

## Magnolia-specific components created

`Mark.astro` (magnolia glyph — temporary logo) · `Plate.astro` (named photo slots) ·
`Prologue.astro` (the site's own headline over a supplied clip) · `ConsultForm.astro` (the
"Care starts here" form: first/last name, phone, email, message — plus optional context steps)
· `ApplicationForm.astro` (the paper application as a 9-step flow) · testimonial triptych ·
"How we help" ledger · "Magnolia Moments" journal.

## Animations

Veil title card → film reveal; line-by-line headline rise; clip reveals and image rises on
scroll; staggered lists; sticky chapter rails; two lazy films (hero, cinema band) that pause
off-screen and never load under reduced motion / Save-Data; button sheen; menu curtain. Every
animation's base state is the finished page.

## Responsive verification

Playwright, Chromium: 1440×900, 390×844 and 360/430 on the heavy pages. 27 route×viewport
captures, all 200 (404 page 404), one `<h1>` each, **no horizontal overflow** anywhere, no page
errors. The application flow was driven end-to-end on a 390-wide phone: empty-step errors with
focus, gate questions, CNA+Other certification, ungated experience fields that survive a Yes→No
toggle, review with "Edit → Back to review", draft restore after reload, demo-mode submit.

## Forms

- **Consultation** — the real form's fields (first name, last name, phone, email, message) with
  optional context (who the care is for, which care, timing, preferred contact). Only first name
  + email are required (the real form requires only email). Posts to `/api/inquiry`.
- **Caregiver application** — every field of the supplied PDF, nothing removed, one optional
  write-in added ("Other — please specify"). Required: name, phone, email, the two yes/no
  questions, the signed certification with date. Session draft, review, copy fallback. Posts to
  `/api/apply`; the email reproduces the paper sections, the certification statement verbatim and
  the office-use block. Adversarial verification findings (81 agents) were all applied: keyboard-
  reachable Continue with inline errors, announced errors, 44px targets, stacked buttons on
  phones, ungated experience fields, multi-select certification type, free-form ZIP, server-side
  date and gate checks, guarded delivery.
- Both forms: honeypot, rate limit, no false success — on a static host they accept in labelled
  **demo mode** and send nothing.

## Media sources and licences

See `MEDIA.md`: supplied photos and two supplied clips (labelled "supplied imagery", demo only
per the owner), generated placeholders elsewhere, the supplied PDF as the downloadable form. The
iStock/dreamstime-watermarked files were not used.

## Demo-only functionality

Forms accept in demo mode; `/login` links to the current site; the "Art Class" post shows an
excerpt with a migration notice; placeholders read "To be confirmed by Magnolia" for phone,
address and hours; the founder is unnamed.

## Not implemented (and why)

Service detail pages (no detail copy exists); community/team/accessibility pages (Colorado-
derived, removed); floating Phone/Facebook/WhatsApp/Chat buttons (destinations unknown); a
member area (not captured); calendar/app ideas (out of scope).

## Questions for the client

1. Phone number, street address, office hours. 2. Founder's name and a sentence about her.
3. The full text and photos of "Art Class" (and any newer posts). 4. Facebook / WhatsApp / chat
links. 5. The logo file (SVG). 6. Whether "Care up to 24 hours a day" and "Free, no commitment"
may be shown. 7. Jhenyfer Cristina's testimonial in full. 8. Which legal spelling to use:
"Magnolia Healthcare, Inc." (footer) or "Magnolia Healthcare Inc." (PDF).

## Build / test results

`astro check`: 0 errors · `astro build`: 11 pages · build-output scan for Colorado terms: 0
files · Playwright: 27 captures, 0 overflow, 0 errors · application flow: all checks pass.

## Next step

Founder reviews the Render preview; after approval, the client-demo subdomain
(`*.jpsilvadigital.com`) is attached and the link is sent to the client.
