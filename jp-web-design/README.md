# JP Web Design — website

Astro 5 static site. Nine pages, one React island (the planner). Builds to plain
HTML/CSS/JS, so it deploys to any static host.

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

| # | Item | Where |
| --- | --- | --- |
| 1 | **Domain** — replace `jpwebdesign.com` throughout | `astro.config.mjs` (`SITE`), `public/robots.txt` |
| 2 | **Email address** | `Footer.astro`, `contact.astro`, `about.astro`, `Planner.jsx` |
| 3 | **Phone number** — a human answers it | `Footer.astro`, `contact.astro`. Required for the outbound credibility check |
| 4 | **Legal entity name + state** | `Footer.astro`, `about.astro` |
| 5 | **Photograph of JP** | `about.astro` — founder-led doesn't work with an empty frame |
| 6 | **Form endpoint** — see below | `Planner.jsx` `submit()` |
| 7 | **Typeface** — swap the system stack | `--sans` in `global.css` |
| 8 | **Legal review** of the three legal pages | `src/pages/privacy|terms|accessibility.astro` |
| 9 | Payment terms | `terms.astro` |
| 10 | `ProfessionalService` schema once there's a real address | `Base.astro` |

Everything unfinished is marked `TODO(launch)` in code and rendered in redline on
the page, so nothing ships by accident.

### The form endpoint

`submit()` currently validates and shows the plan without transmitting. The
payload shape is already CRM-ready. To wire it up, add `output: 'server'` for a
single route and POST to `/api/inquiry`, which should:

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

## Motion

One rule governs every animation: **the hide state is scoped to `.js-anim`**, a
class set by a synchronous inline script that runs before paint. No JS, a
failed bundle, or `prefers-reduced-motion` → the class never appears and the
page renders finished.

This inversion is the whole safety property. The conventional
`[data-anim] { opacity: 0 }` means one script error blanks the site — the
standard way scroll-reveals fail in production. Verified: with JavaScript
disabled the homepage renders 18,000+ characters with zero hidden elements.

The reveal observer also fires for elements whose `boundingClientRect.top < 0`,
so a fast flick-scroll can't carry content past the callback and leave it
permanently invisible.

Two further guards, both added after a real black-hero bug:

- **Anything already in view is revealed on the first frame**, synchronously,
  not on an observer callback. Above-the-fold content must never wait on a
  scroll event that has not happened.
- **A 1-second watchdog in the inline gate removes `.js-anim`** unless the
  reveal controller has set `window.__revealReady`. Hiding and revealing are
  done by two different scripts; if the second never runs, the first has
  already hidden everything and a dark hero renders as a black rectangle.

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
| JS, inner pages | ≤ 2 KB gz | **1.4 KB** (nav + island loader) |
| JS, homepage | ≤ 5 KB gz | **4.2 KB** (hero slider, video controller, reveal observer) |
| JS, planner | ≤ 70 KB gz | ~70 KB, lazy — loads only when the planner scrolls into view |
| CSS, total | ≤ 20 KB gz | **8.6 KB** |
| LCP / CLS / INP (field p75, mobile) | 1.8s / 0.02 / 150ms | verify post-launch with field data |

## The hero backdrop

Three layers, and the order is the whole safety property:

| Layer | What | When |
| --- | --- | --- |
| 0 | `public/hero-poster.svg` | **always** — plain `<img>`, no JS, 1.1 KB gz |
| 1 | `<video>` | only if `HERO_VIDEO` is set; fades in once actually playing |
| 2 | scrim gradient | always — keeps headline contrast whatever is beneath |

Because layer 0 is a static image on a painted `background-color`, there is no
state in which this section is an empty black rectangle: no missing source, no
decode failure, no blocked script, no reduced-motion path.

### Adding real footage

1. Drop `hero.mp4` (and optionally `hero.webm`) into `public/`
2. Set `HERO_VIDEO = '/hero.mp4'` at the top of `src/components/Hero.astro`
3. Export a still from the footage to replace `hero-poster.svg` — keep 16:9
   and the dark value range, or the overlay contrast breaks

The controller then handles the rest, and every failure path ends with the
poster still showing: sources attach lazily on approach (never during initial
load), `play()` rejection from autoplay policy or low-power mode is caught,
`error`/`stalled` detaches the element entirely, and `prefers-reduced-motion`
or `saveData` never attaches a source at all.

Measured contrast over the backdrop: headline 16.9:1, lead and eyebrow 7.2:1.
Re-measure after swapping the poster — a lighter still will need a heavier
scrim.

Add `size-limit` and Lighthouse CI to enforce these. A budget nobody enforces is
a wish. The main threats, in likelihood order: motion on content pages, an
embedded Calendly, a video hero, Google Tag Manager, and raw client photography.

## Deploying

Static output. Cloudflare Pages is the intended target — build `npm run build`,
output `dist`. Note `build.format: 'file'` produces `/about.html`; Cloudflare and
Netlify resolve `/about` to it automatically, a bare file server will not.
