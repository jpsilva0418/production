# Contamination audit — Colorado "Magnolia Healthcare" content removed

**Why this exists.** The first build of this demo took its business facts from the website of a
*different* company with a similar name (a Colorado/Arvada agency). The client is **Magnolia
Healthcare, Inc. of Massachusetts** (magnoliahealthcareinc.com). Every fact in the demo was
re-derived from the Massachusetts client's own supplied materials only; everything below was
removed or replaced. Final build scan: `grep -riE "arvada|denver|colorado|80002|720-661|303-500|
ralston|madina|sorensen|wecare|magnoliahealthcareservices" dist` → **0 files**.

## Sources now used (and nothing else)

| Source | What it established |
|---|---|
| Screen recordings of magnoliahealthcareinc.com (5 clips, 87 frames read) | Hero "Because every life matters" / "Home care agency" / "Free Consultation"; the full Our Mission statement; six Specialized Care cards; four How We Help cards; three client testimonials; blog "Magnolia Moments" (2 posts); Join Our Team page copy; consultation page copy and form fields; menu (Home · Our Mission · Blog · Consultation · Careers · Log in); footer "Magnolia Healthcare, inc."; email info@magnoliahealthcareinc.com; palette (white, sage, dark green, gold) and logo |
| Supplied CTA banner image | "Let's talk about the care your family needs…", "Anywhere in Massachusetts" |
| Supplied Caregiver Application PDF | Every field of the application; "Magnolia Healthcare Inc." |
| Supplied photos (team ×2, clinician) and clips (corridor walk, kitchen scene) | Imagery, labelled "supplied imagery"; the founder is the woman in white at the centre of the five-person team photo (confirmed by the founder of the project) |
| Owner instructions | Only the "free consultation" claim from the banner may appear |

## Items found and removed / replaced

| # | Where | Colorado-derived item | Now |
|---|---|---|---|
| 1 | `src/consts.ts` | legalName "Magnolia Healthcare LLC" | "Magnolia Healthcare, Inc." (site footer, PDF) |
| 2 | `src/consts.ts`, `<title>`s | tagline "Denver Metro Home Care" | "Home Care Agency" (hero) |
| 3 | `src/consts.ts`, meta descriptions, JSON-LD | description "locally owned, Colorado-licensed provider of non-medical home care in Arvada and the Denver Metro" | first sentence of the real mission statement |
| 4 | `src/consts.ts`, footer, login | currentSite magnoliahealthcareservices.com | magnoliahealthcareinc.com |
| 5 | `src/consts.ts`, footer, contact, services, JSON-LD | address 8795 Ralston Rd., Suite 245, Arvada, CO 80002 + geo coordinates | not established → `null`, rendered "To be confirmed by Magnolia"; JSON-LD carries only region MA |
| 6 | consts, header, footer, contact, careers, apply, both forms, 404 | phone 720-661-9498, fax 303-500-1236 | no phone is published in the supplied materials → placeholder; every "Call" CTA became the office email |
| 7 | consts, footer, contact, forms | email Wecare@Magnoliahealthcareservices.com | info@magnoliahealthcareinc.com |
| 8 | consts, accessibility page | accessibility inbox magnoliahealthcare1@gmail.com | removed with the page |
| 9 | consts, footer, contact, services, apply rail | hours Mon–Fri 8:30–5:30, "Closed major holidays" | not established → placeholder |
| 10 | consts, Prologue, home, mission, team, footer | "Founded 2023", "Locally owned · Colorado-licensed" | removed; nothing about founding year or licensing is claimed |
| 11 | consts, home, mission, team, MEDIA.md | founder "Madina Sorensen" + biography ("background in healthcare and special education…") | founder unnamed: "Founder · To be confirmed by Magnolia"; portrait cropped from the supplied team photo |
| 12 | consts, Prologue, header menu, cine caption, services | service area "Arvada & the Denver Metro area" | "Anywhere in Massachusetts" (supplied banner) |
| 13 | `src/content/services/*` (4 files), home, services pages | Personal Care / Homemaking / Companionship / Alzheimer's & Dementia Support with invented "includes" bullets | the six Specialized Care + four How We Help items, each with the site's own sentence; detail pages removed (no detail copy exists) |
| 14 | home, mission | Colorado mission ("more than a provider — a family", "elderly, blind, and disabled…", Respect/Compassion/Honesty values) | the real mission statement verbatim; values = Compassion · Excellence · Respect (its own words) |
| 15 | home "Why families choose Magnolia" ledger, team page | "state and federal background checks", "extensive training", "individualized care plans… culture" | removed; only "thoughtfully selected, trained" (mission) is said |
| 16 | `src/content/posts/*` (6 files), `src/lib/blog.ts` categories | six Colorado blog articles and three invented categories | "Magnolia Moments" with the two real posts (one full, one excerpt flagged for migration); no categories |
| 17 | `src/pages/community.astro`, home panel, nav | "Community" page / "Magnolia Healthcare Family" Wix group / community events | removed; redirect → /mission |
| 18 | `src/pages/team.astro` | "Our Caregivers" page built on Colorado claims | removed; the team photo lives on /mission and /careers; redirect → /mission |
| 19 | `src/pages/accessibility.astro` | Colorado accessibility statement (WCAG claim, contacts) | removed; redirect → / |
| 20 | `src/pages/login.astro` | "Member sign in… community groups" → Colorado site | "Log in" (the real site's Wix control) → magnoliahealthcareinc.com |
| 21 | `src/pages/careers.astro` | "Tailored schedules, continuous professional development…" | the real Join Our Team copy + the supplied PDF as the download |
| 22 | `ConsultForm.astro`, `ApplicationForm.astro` | placeholders "Arvada", "80002", "CO"; care types = Colorado services; "Community event" option | city/ZIP removed from the consultation form (not on the real form), "MA"; care types = the real list |
| 23 | `api/inquiry.js`, `api/apply.js` | required phone (real form requires only email) | consultation requires first name + email |
| 24 | JSON-LD (`src/lib/seo.ts`) | telephone, foundingDate, founder, street address, opening hours, areaServed "Denver Metro" | only name, legal name, email, region MA, areaServed Massachusetts |
| 25 | `Header.astro` menu foot, `Footer.astro` bar | "Arvada, Colorado", "Locally owned · Colorado-licensed · Non-medical home care" | legal name · "Home Care Agency · Anywhere in Massachusetts" |
| 26 | Prologue | "Care that feels like family, at home", "Non-medical home care · Arvada…" | "Because every life matters" (the site's headline) |
| 27 | Hero film / cine band | generated ambient film | two of the client's own supplied clips |
| 28 | `docs/00-assessment.md`, `docs/MEDIA.md`, `docs/01-completion-report.md`, `README.md` | all Colorado provenance notes | rewritten |
| 29 | Old URLs | /contact, /team, /community, /accessibility, /services/<colorado-slug>, /blog/category/* | redirected so no shared preview link 404s |

## What is deliberately left unknown

Phone number · street address · office hours · founder's name and biography · founding year ·
licensing/insurance · staff names and roles · social links (the site shows Phone / Facebook /
WhatsApp / Chat buttons but their destinations were not captured) · the full text of the
"Art Class" post · what members see after logging in. Each is rendered as an explicit
placeholder or omitted — never filled from another company.
