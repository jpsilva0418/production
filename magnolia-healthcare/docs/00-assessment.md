# 00 — Implementation assessment (Magnolia Healthcare premium demo)

Written before implementation, kept as the record of what the demo is built on.

## Evidence honesty — read first

- **The Magnolia recordings did not arrive in this session.** The uploads folder was empty, so
  nothing could be inventoried from them.
- **Magnolia's live site (`magnoliahealthcareservices.com`) is blocked by this environment's
  network policy** (the proxy denies the host), as are Wix asset hosts, Yelp/Nextdoor and every
  stock-media site. The content inventory below was assembled from **search-engine snippets of
  Magnolia's own pages** (title/URL/description text), cross-checked against care directories for
  consistency only. Visual identity (logo, colours, photography) **could not be observed**.
- Consequence: every colour is a token and every image slot is a named plate, so re-tuning to
  the real brand once the recordings are reviewed is a one-file / one-folder change.

## 1. Magnolia content & page inventory (from Magnolia's own pages)

| Current page | URL | What it carries | Demo surface |
|---|---|---|---|
| Home — "Denver Metro Home Care" | `/` | Locally owned, Colorado-licensed, non-medical home care; personal care, homemaking, companionship, individualized dementia support; NAP, hours | `/` |
| Services | `/services-6` | Four services with inclusions; "every care plan is built around the client's routines, preferences, culture, and goals for independence" | `/services`, `/services/<slug>` |
| About Us | `/about-us` | Founder Madina Sorensen; mission statement; "more than a service provider — we're a family"; main goal; est. 2023, growing; three core values | `/mission` |
| Our Caregivers | `/our-caregivers` | Carefully selected, extensive training, state & federal background checks, ongoing development; "Apply now" — tailored schedules, meaningful work, continuous professional development | `/team`, `/careers` |
| Community + Groups | `/community`, `/groups` | Community events for social connection, relationships, support networks; owner's commitment; public group "Magnolia Healthcare Family" ("a space for us to connect and share with each other") | `/community` |
| Blog | `/blog`, `/post/<slug>` | Six articles (titles captured; two slugs confirmed; Feb 6 2024 dates on several): Cultural Diversity in Healthcare: Embracing Differences · The Importance of Non-Medical Home Care Services · Putting Clients First: The Core Value of Magnolia Healthcare · Building Trust: The Key to Exceptional Home Care Services · Continuous Quality Improvement in Home Care: A Commitment · Accountability and Responsibility in Healthcare Services | `/blog`, `/blog/<slug>`, `/blog/category/<cat>` |
| Accessibility Statement | `/items/this-is-a-title-01` | Partially conformant WCAG 2.1 AA; feedback phone/email/address; 24–48h response | `/accessibility` |
| Log in / Sign up (Wix members) | site chrome | Member sign-in for the community groups | `/login` (entry point only) |
| Contact details | site-wide | 8795 Ralston Rd., Suite 245, Arvada, CO 80002 · 720-661-9498 · fax 303-500-1236 · Wecare@Magnoliahealthcareservices.com · Mon–Fri 8:30–5:30, closed major holidays | footer, `/contact`, `/services` |

Claims found **only** in third-party directories and therefore **not used**: Medicaid approval,
licence number / "Class B", "Arvada Community Votes winner", specific hiring counties, exact city
list (Lakewood, Westminster, Golden, Wheat Ridge, Edgewater). All are listed as client questions.

## 2. Letty Silva Beauty systems reused (and how)

| Letty system | Reused as |
|---|---|
| Prologue title-card hero (veil lifts, CSS-only, finished-state base, LCP-safe) | `Prologue.astro` — leaf veil with mark + name → ambient film under scrim |
| V2 motion grammar (`.rv` clip reveal, `.rv-im`, `.fade`, `data-stag`, parallax hosts, reveal sweep) | `magnolia.css` + BaseLayout runtime, verbatim logic |
| Underline-to-fill buttons with one sheen sweep, expanding-underline text links | `.btn--solid/.btn--line/.btn--ivory/.btn--ghost`, `.tlk`, `.arrow-link` |
| Kicker furniture, chapter slates, sticky chapters, cinema bands, ghost words, invitation card, light layers, grain | ported 1:1, re-coloured, radii softened |
| Full-screen menu (inert, focus-trapped, Escape, staggered list) | `Header.astro` + runtime; plus a visible desktop nav and sticky compact bar |
| Grand footer | `Footer.astro`, restructured as brand / explore / hours / contact |
| Lazy film pattern (preload=none, data-src promotion, pause off-screen, reduced-motion + Save-Data = poster) | Prologue + `video[data-film]` runtime |
| Multi-step InquiryForm state machine (type-locked paths, progress, recap, review+edit, gated Continue, error/success, copy fallback, honeypot, analytics hooks) | `ConsultForm.astro` |
| Inquiry Worker (modes: deliver / staged, never a false success; sanitising; rate throttle) | `api/inquiry.js` (Vercel function) |
| Blog system (cards, hub with featured + pills + search + empty state, article template, category hubs, related posts, structured data) | `BlogCard/BlogCta`, `blog/*` |
| SEO/JSON-LD helpers, content collections, consts-as-source-of-truth, `format:'file'` build, staging badge | `lib/seo.ts`, `content.config.ts`, `consts.ts`, demo flag |
| Self-hosted fonts via `@font-face` | Fontsource variable fonts (Fraunces, Figtree) |

## 3. Magnolia design-system direction

- **Identity from the magnolia itself**: ivory petal grounds (`#F8F4EE`), a deep magnolia-leaf
  green anchor (`#1E3F36`), blush petal accent (`#E9CFC7`), brass hairlines (`#8A6A3C`, 4.6:1 on
  ivory). Dark sections are leaf green, never black.
- **Type**: Fraunces (variable optical size, soft axis) for display and italic "voice" lines;
  Figtree for body/UI. Nothing from Letty's beauty palette (taupe/chocolate/gold script) survives.
- **Shape**: gentle radii (5/12/20px), hairlines over borders, framed plates — warm and human,
  not clinical, not pill-soup.
- **Motion**: Letty's restraint rule — at most one light effect per viewport, transform/opacity
  only, reduced motion = complete static page.
- **Imagery**: every photo slot is a "plate" placeholder (gradient + magnolia line illustration +
  baked "demo placeholder" label). Real caregiver/senior photography drops into the same slots.
- CONFIRM against the recordings: real logo artwork, exact brand colours.

## 4. Page architecture

`/` · `/services` · `/services/{personal-care,homemaking,companionship,alzheimers-dementia-support}` ·
`/mission` · `/team` · `/community` · `/blog` · `/blog/<6 slugs>` · `/blog/category/<3>` ·
`/contact` (+`?for=care|self|team`, `&service=<slug>`) · `/careers` (interim) · `/login` (entry
only) · `/accessibility` · `/404` · `/robots.txt` (disallow all — demo) · `/sitemap-index.xml`.

## 5. Media / video requirements

- Hero: one licensed 10–20 s clip, 16:9 (desktop) — caregiver + older adult at home, warm
  daylight, no dialogue. Deliver as H.264 mp4 ≤ 2 MB + VP9 webm + 1600px poster. Until then a
  procedurally rendered "morning light" film is in place (see `docs/MEDIA.md`).
- Plates: ~20 photo slots listed in `docs/MEDIA.md` with aspect ratios. Owner photography
  preferred (with consent); otherwise licensed stock with the source/licence logged.
- Founder portrait; caregiver profiles only as Magnolia chooses to share.

## 6. JP Solo Media / JP Silva Digital preview & demo deployment pattern

No project named "JP Solo Media" exists in the connected accounts; the closest match is the
**`jp-silva-digital` Vercel project** (Astro, git-linked, branch preview URLs such as
`jp-silva-digital-git-<branch>-jpsilva0418s-projects.vercel.app`, Vercel Auth on all non-custom
domains, custom domains `jpsilvadigital.com` / `www`). **`jpsilvadigital.com` is a Vercel-managed
zone (Vercel nameservers)**, so a client-demo subdomain is a one-step `add_project_domain`
(e.g. `magnolia.jpsilvadigital.com`) with DNS auto-provisioned — no other domain is touched.
Reused pattern: separate Vercel project → `rootDirectory: magnolia-healthcare` in
`jpsilva0418/production` → branch deployment = private preview → subdomain only after approval.

## 7. Blockers & assumptions

- **Not a blocker, but a flag**: the recordings are missing and the live site is unreachable;
  content was reconstructed from Magnolia's own page snippets. Review needed before client send.
- Blog article bodies could not be captured → articles render an honest migration notice.
- Signup/application: the reference (Magnolia's 3-page caregiver application PDF) arrived after the initial build; the flow is now built at `/apply` (see the completion report).
- Purpose of member login unconfirmed → entry point only.
- The `production` GitHub repository is **public**; a dedicated private repo is a one-command
  move if preferred before the client sees the URL.
