# 01 — Completion report: initial build (Stage 1 → Stage 2)

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

## Pages built (24)

`/` · `/services` · `/services/personal-care` · `/services/homemaking` · `/services/companionship` ·
`/services/alzheimers-dementia-support` · `/mission` · `/team` · `/community` · `/blog` ·
six `/blog/<slug>` articles · `/blog/category/{our-values,home-care,quality}` · `/contact`
(+ `?for=care|self|team`, `&service=<slug>`) · `/careers` · `/login` · `/accessibility` · `/404` ·
`robots.txt` (disallow all) · sitemap.

## Components reused / adapted from Letty Silva Beauty

Prologue hero system (veil title card → film, CSS-only, LCP-safe, reduced-motion = finished
page) · V2 motion grammar (`.rv` clip reveals, `.rv-im`, `.fade`, `data-stag`, parallax hosts,
late-reveal sweep) · underline-to-fill buttons with sheen, expanding-underline links · kicker
furniture, chapter slates, sticky chapters, cinema bands, ghost words, note card, light layers,
grain · full-screen menu (inert, focus trap, Escape) · grand footer · lazy film pattern ·
InquiryForm state machine (type-locked paths, progress, recap, review + edit, gated Continue,
copy fallback, honeypot, analytics hooks) · inquiry handler modes (deliver / staged, never a
false success) · blog system (featured, pills, search, article, category hubs, related) ·
SEO/JSON-LD helpers, content collections, consts-as-truth, `format:'file'` build, demo badge.

## Magnolia-specific components created

`Mark.astro` (magnolia glyph — temporary logo) · `Plate.astro` (named photo slots) ·
`ConsultForm.astro` (care / team / other paths, inline validation) · `Header.astro` with
visible desktop nav, phone, CTA, sticky compact bar that hides on fast scroll-down ·
`api/inquiry.js` (Vercel function) · tokens + grammar (`tokens.css`, `magnolia.css`) ·
page templates for services detail, mission, caregivers, community, careers, login, accessibility.

## Animations / interactions

Prologue sequence (veil, mark, rising headline lines, staged CTAs, scroll cue) · ambient film
under scrim with Ken Burns settle · clip-reveals and staggered rows · sheen sweep on cards /
buttons · living stills (slow drift) on plates · sticky chapter columns · light shaft / dusk
layers (one per viewport) · ghost words · header stick/hide · menu stagger · form step
transitions with focus management · copy-link / copy-request feedback · back-to-top.

## Responsive verification (headless Chromium)

| Check | Result |
|---|---|
| Horizontal overflow at 360 / 390 / 430 / 1440 on every route | none |
| Console / page errors | none (only the expected 404 on `/does-not-exist`) |
| One `h1` per page, titles set | yes |
| Consultation flow (preselect via URL, recap, inline errors, Back keeps answers, review/edit, demo-mode thank-you, focus to heading) | pass |
| Mobile menu: open/close, `inert`, focus trap, Escape returns focus | pass |
| Tap targets ≥ 44 px in header and menu | pass |
| `prefers-reduced-motion`: page complete immediately, no film sources loaded | pass |
| Keyboard: skip link first, visible focus ring | pass |
| `astro check` | 0 errors, 0 warnings |

Not yet verified: real devices (founder review), iOS Safari video autoplay, Lighthouse.

## Forms implemented

Consultation request (`/contact`): type → care details (support types, timing, city/ZIP) or
team interest or free text → contact (name, phone, email, preferred method) → notes → review →
send. Delivered via Resend when `RESEND_API_KEY` + `INQUIRY_TO_EMAIL` are set on Vercel;
otherwise accepted in **labelled demo mode** (nothing sent). Careers uses the same flow
(`?for=team`) as an expression of interest only.

## Media sources / licences

None external. Every asset is generated in-repo (ambient hero film, placeholder plates with a
baked "demo placeholder" label, SVG mark). Full inventory, specs and the replacement rule:
`docs/MEDIA.md`.

## Demo-only functionality

Demo badge · `noindex` + robots disallow · form demo mode · `/login` entry point without
authentication · `/careers` interim notice · blog articles with migration notice ·
placeholder plates and caregiver tiles.

## Intentionally NOT implemented

Signup/application flow (awaiting the reference recording) · anything behind member login ·
calendar / scheduling / portal / dispatch · pricing · testimonials, reviews, awards,
statistics, licence numbers, insurance acceptance, service-area city lists (not on Magnolia's
own site) · client-demo subdomain (Stage 4, after approval).

## Remaining client questions

1. Logo artwork and brand colours (could not be viewed — tokens ready to re-tune).
2. Exact service area (cities/counties) to state publicly.
3. Licence number / "Class B" / Medicaid acceptance / Community Votes award — may we cite them?
4. Full text of the six blog articles (for word-for-word migration) and their real dates.
5. Caregiver profiles Magnolia wants shown (names, roles, photos, consent).
6. Founder portrait and any owner photography / event photos (with consent).
7. What members see after sign-in (purpose of the Wix member area).
8. The signup/application recording.
9. Photography / footage licensing budget vs. owner-supplied media.
10. Which inbox should receive consultation requests when the form goes live.

## Build / test results

`astro check`: 0 errors · `astro build`: 24 pages · Playwright sweep: 37 route/viewport
captures, 0 overflow, 0 errors · interaction tests: all pass (details above).

## Proposed next step toward the client-demo subdomain

1. Founder reviews the preview on phone + desktop; feedback round(s) land on the same branch
   (auto-redeploys).
2. Re-authorise the Vercel connector with write access (or add `VERCEL_TOKEN`), then create
   the Vercel project `magnolia-healthcare-demo` (Root Directory `magnolia-healthcare`,
   git-linked) — the Vercel preview URL is Auth-protected like `jp-silva-digital`.
3. Only after approval: `add_project_domain` → `magnolia.jpsilvadigital.com` (zone is on
   Vercel DNS, so no other domain or deployment is touched), flip `PUBLIC_SITE_URL`, keep
   `noindex`, send the clean link.
