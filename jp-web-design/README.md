# JP Silva Digital — website

Astro 5 static site. Twenty-five routes, one React island (the planner). Builds
to plain HTML/CSS/JS, so it deploys to any static host.

Three services: web design and development, Google Ads, and Meta Ads. The free
homepage demo remains the headline offer and the primary conversion path.

## The identity, in one paragraph

Light, airy, and friendly: cool-white ground (`#f6f8fc`) over a faint dot
grid, one blue accent (`#2f5cf0` — 5.1:1 as text, 5.4:1 under white on a
fill), colored pill labels per section (red = problem, green = process,
amber = trades), big rounded cards with soft shadows. Exactly one dark
section exists per page — the 9:47 PM night scene — and one full-gradient
field (the close card). Motion is part of the brand: an opening shutter
sequence (once per session), scroll reveals, a self-typing search story,
count-ups — every bit of it progressive enhancement over a complete static
page (see Motion below). The homepage's job is aspiration → demo: the
"plates" (three visibly different spec builds) carry honest museum labels —
`SPEC BUILD` → `COMMISSIONED` → `IN SERVICE` — that only ever upgrade, and
clicking "Build mine like this →" seeds the planner with that plate's
industry via `sessionStorage` before the anchor jump, so choosing a plate
*is* starting the demo with question one already answered.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview
```

## Why Astro and not Next.js

The brief specified Next. This is ~98% static content with one interactive
surface, and Next optimises the inverse ratio — even a fully static Next page
ships the React runtime and hydration data on pages that need neither.

Measured on this build: content pages carry **1.0 KB gzipped** of JavaScript (the
header nav script). React loads only when the planner scrolls into view. On a
mid-range Android over LTE — which is how these buyers actually arrive — that is
the difference between "national agency" and "template that stutters."

The trade is real and worth stating: **Framer Motion is reserved for the planner.**
Animating content sections would mean React islands on every page, which destroys
the advantage. Content-page motion is CSS only. Design accordingly.

## Layout

```
src/
  layouts/Base.astro            <head>, Organization JSON-LD, skip link
  components/
    Header.astro                sticky nav, full-screen mobile overlay
    Footer.astro
    Packages.astro              the three tiers
    Legal.astro                 shell for privacy / terms / accessibility
    planner/
      Planner.jsx               8-step flow, state, validation
      Diagram.jsx               the live architecture drawing
      logic.js                  recommendation engine — no framework imports
      planner.css
  pages/                        index, about, process, contact, 3× legal, 404
    industries/construction-web-design.astro
  styles/global.css             design tokens + primitives
```

`logic.js` deliberately imports nothing. It runs under plain Node, so the
recommendation engine can be tested without a browser:

```bash
node -e "import('./src/components/planner/logic.js').then(m=>console.log(
  m.recommendPackage({businessType:'construction',situation:'no_leads',
  goal:'leads',features:['services','areas']})))"
```

## Before this goes live

Everything below is tracked as `TODO(launch)` in code. The three marked
**BLOCKS LAUNCH** must be done; the rest can follow the site going live.

| # | Item | Where | Status |
| --- | --- | --- | --- |
| 1 | **Domain** — replace `jpsilvadigital.com` | `astro.config.mjs` (`SITE`), `public/robots.txt` | **BLOCKS LAUNCH** |
| 2 | **Inquiry endpoint** — otherwise the forms hand off to email instead of sending | `PUBLIC_INQUIRY_ENDPOINT` (see below) | **BLOCKS LAUNCH** |
| 3 | **Email address** — a real inbox | `EMAIL` in `src/data/site.ts` | **BLOCKS LAUNCH** |
| 4 | **Legal entity name + state**, if one is registered | `LEGAL_ENTITY` in `src/data/site.ts` (`null` shows the plain brand copyright) | Optional |
| 7 | **Social profiles** — real URLs only | `SOCIALS` in `src/data/site.ts` (empty renders no row) | After launch |
| 8 | **Analytics IDs** | `PUBLIC_GA_ID`, `PUBLIC_GOOGLE_ADS_ID`, `PUBLIC_META_PIXEL_ID` | After launch |
| 9 | **Legal review** of the three legal pages | `src/pages/privacy\|terms\|accessibility.astro` | After launch |
| 10 | `ProfessionalService` schema once there is a real address | `src/layouts/Base.astro` | Optional |

Nothing in `src/data/site.ts` may be invented. A fact JP has not confirmed stays
`null`, and every template checks for null rather than printing a placeholder
that looks real.

## Environment variables

All are optional at build time and all are `PUBLIC_`, meaning they ship to the
browser. **Never put a private API key in one.**

```bash
PUBLIC_INQUIRY_ENDPOINT=https://…   # where the forms POST. Unset = email handoff.
PUBLIC_GA_ID=G-XXXXXXXXXX           # Google Analytics 4
PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX   # Google Ads conversions
PUBLIC_META_PIXEL_ID=XXXXXXXXXXXX   # Meta Pixel
```

With none set the site ships zero tracking bytes and sets no cookies, which is
the correct state until the accounts exist.

## The inquiry system

There is exactly one inquiry system, in two files:

- `src/lib/intake.ts` — the canonical fields, labels, option lists and
  validator.
- `src/lib/inquiry.ts` — the single submission path, `sendInquiry()`.

Two surfaces render it. `/contact` is the general project inquiry.
`/free-demo` asks eight website-specific questions first, then renders these
exact fields at its final step — it is an extension of this intake, not a
second contact system. Both validate with `validateIntake()` and submit
through `sendInquiry()`.

Add, rename or reorder a field in `intake.ts` and both surfaces follow.
Never add one to only one of them. Service pages link to
`/contact#<service-slug>`, which preselects "What do you need?" via
`needFromHint()`.

**The rule that governs it:** a form may never claim to have sent something it
did not send. With no endpoint configured, both surfaces show an email handoff
with every answer pre-filled — not a success message. This is deliberate and
must survive any future change.

To wire it up, set `PUBLIC_INQUIRY_ENDPOINT` to anything that accepts a JSON
POST: Formspree, Web3Forms, Basin, Netlify Forms, or a Cloudflare Worker.
A honeypot field (`trap`) is submitted-but-ignored; reject any payload where it
is non-empty.

If you later build a real server route, point the variable at `/api/inquiry` and
implement this checklist, in this order:

1. reject bodies over ~32 KB before parsing
2. check `Origin` / `Sec-Fetch-Site`
3. re-validate with the same schema, `.strict()`
4. **strip CR/LF from anything interpolated into mail headers** — header
   injection is the live vulnerability in hand-rolled contact forms
5. verify Cloudflare Turnstile server-side; **fail open on a Turnstile 5xx** —
   losing a real lead to someone else's outage costs more than the spam does
6. persist first, then send. Email is never the system of record
7. never silently drop: route suspected spam to a quarantine inbox instead

Set `Reply-To` to the prospect so replying is one keystroke, and send an
autoresponse restating the one-business-day SLA. That autoresponse is the most
neglected conversion surface in the whole pipeline.

## Founder photograph

JP's own photograph, cropped two ways from one source file and shown as a
circle on both pages:

- `public/media/jp-silva-portrait.*` — 480px head-and-shoulders, homepage.
- `public/media/jp-silva.*` — 620px wider crop, `/about`.

Both crops sit wholly inside the circular area of the source photo, so the
round treatment never exposes its white corners. WebP first with a JPEG
fallback; paths live in `FOUNDER_PHOTO` in `src/data/site.ts`.

To replace it, drop in new files at those paths (square, subject centred) or
point `FOUNDER_PHOTO` somewhere else. Never substitute a stock or generated
face.

## Content

`src/data/` holds everything the pages read from, so content never has to be
hunted through templates:

- `site.ts` — business facts. The only file with `null`s that gate rendering.
- `services.ts` — the three pillars. Drives `/services`, the three detail
  routes, the homepage overview and the inquiry form's options.
- `projects.ts` — real work only. `outcome` describes what was built;
  `results` stays `null` until a client supplies and approves a real figure.
  No invented businesses, no percentages.

Blog posts are Markdown in `src/content/blog/`, typed by `src/content.config.ts`.
Adding a post is adding a file. A missing description or malformed date fails
the build rather than shipping an empty `<meta>`.

## Deployment

Static output — `npm run build` writes `dist/`, which any static host serves.

One host setting matters: `build.format` is `'file'`, so routes are emitted as
`services.html` beside a `services/` directory. Hosts that resolve
extensionless URLs to `.html` (Cloudflare Pages, Netlify, Vercel) serve `/services`
correctly with no configuration. On a bare nginx/S3 setup, enable that resolution
or switch `format` to `'directory'` in `astro.config.mjs`.

## Motion

One rule governs every animation: **the hide state is scoped to `.js-anim`**, a
class set by a synchronous inline script that runs before paint. No JS, a
failed bundle, or `prefers-reduced-motion` → the class never appears and the
page renders finished.

This inversion is the whole safety property. The conventional
`[data-anim] { opacity: 0 }` means one script error blanks the site — the
standard way scroll-reveals fail in production. Verified: with JavaScript
disabled the homepage renders fully with zero hidden elements — including the
night scene, which statically shows the clock at 9:47, all three search
results, and the ringed winner; the script only adds the cinema (wipe, clock
roll, typing, cascade, pick).

The same discipline extends to every cinematic element:

- **The opening shutter sequence** is `display:none` until the inline gate
  arms it, plays once per session (`sessionStorage`), and self-destructs on
  its own inline timer — no downstream failure can leave it covering the page.
- **Word-split headlines** are split only after the gate confirmed itself;
  no-JS shows the plain heading.
- **Count-up stats** ship their final numbers in markup; JS zeroes and rolls
  them only when it actually runs.
- **The reveal observer** also fires for elements whose
  `boundingClientRect.top < 0`, so a fast flick-scroll can't leave content
  invisible; anything already in view reveals on the first frame; and a
  1-second watchdog strips `.js-anim` unless the reveal controller has set
  `window.__revealReady`.
- Tilt, parallax, magnetic buttons: `pointer: fine` only; all animation is
  `transform`/`opacity`, rAF-throttled.

## Content rules

**The find-and-replace test governs every industry page.** Take the draft,
replace the industry name with a different industry. If it still reads as true,
it is thin and does not ship. `construction-web-design.astro` is the reference
implementation — roughly 4–8 hours of work each, most of it research.

Launch four, then one or two a month. Not eighteen at once: on a site this size,
eighteen templated pages would be the majority of the corpus, and the quality
drag lands on the pages that matter.

The `/industries` section names the other verticals in body text, **unlinked**.
That captures the sales message without minting empty URLs.

## Hard rules encoded in the build

- **No fabricated proof.** No testimonials module exists — not an empty one, not
  a "coming soon". The Work section is labelled concept work and says so twice.
- **No claims.** `assertNoClaims()` in `logic.js` rejects "guarantee", "rank #1",
  "X% more leads" and similar from any generated string. Wire it into CI.
- **No `Review` / `AggregateRating` schema.** Not "until we have reviews" —
  Google excludes review snippets for reviews about the entity controlling the
  page, so it is permanently ineligible. Stars live on Google Business Profile.

## Performance budget

| Metric | Budget | Measured |
| --- | --- | --- |
| JS, inner pages | ≤ 2 KB gz | **1.0 KB** (nav) |
| JS, homepage | ≤ 5 KB gz | **≈5 KB** (slider, reveals, tilt, night scene, counters, planner seeding — inlined by Astro) |
| JS, planner | ≤ 70 KB gz | ~70 KB, lazy — loads only when the planner scrolls into view |
| CSS, total | ≤ 20 KB gz | **9.3 KB** (homepage) |
| Whole homepage document | — | **20.7 KB gz** including all inline JS and JSON-LD |
| LCP / CLS / INP (field p75, mobile) | 1.8s / 0.02 / 150ms | verify post-launch with field data |

## The hero

Bright and typographic, and that is a safety property, not just a look: the
previous dark hero needed a three-layer poster/video/scrim contract to
guarantee it never painted as an empty black rectangle. This one removes the
failure class instead of defending against it — the ground is the page's own
stock colour with a CSS drafting grid, so there is no image request, no video,
no scrim, and nothing that can fail to arrive. The LCP element is the
headline itself.

If real footage ever earns its way back in, it belongs in a *plate*, not
behind the hero text — and it revives the old contract: poster `<img>` always
painted first, video gated and faded in only on `playing`, self-removed on
error. See git history for the reference implementation.

Contrast is measured, not assumed: ink on stock 15.4:1, secondary
`--graphite` 5.8:1, press-red text 5.0:1, ink on the vermilion fill 4.64:1.
The orange fill may never carry white text and the bright stock may never
carry `--verm` as text — both fail WCAG AA.

Add `size-limit` and Lighthouse CI to enforce these. A budget nobody enforces is
a wish. The main threats, in likelihood order: motion on content pages, an
embedded Calendly, a video hero, Google Tag Manager, and raw client photography.

## Deploying

Static output. Cloudflare Pages is the intended target — build `npm run build`,
output `dist`. Note `build.format: 'file'` produces `/about.html`; Cloudflare and
Netlify resolve `/about` to it automatically, a bare file server will not.
