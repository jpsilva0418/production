# 03 — Magnolia Preservation Map

Reconstructed from the client's screen recordings of **magnoliahealthcareinc.com** (five clips, 87
frames read), the supplied CTA banner, the supplied Caregiver Application PDF, and the supplied
photos/clips. This is the blueprint every design concept descends from. Nothing listed here may
silently disappear in the redesign.

## 1. Existing navigation

Hamburger menu (mobile and desktop recordings both show the hamburger-only header with the
centred logo): **Home · Our Mission · Blog · Consultation · Careers**, plus a member avatar
"Log in" control at the top of the menu (Wix: email/password, Google, Facebook).

## 2. Existing pages

| Page | Seen in | Status |
|---|---|---|
| Home | all home-tour clips | fully captured |
| Our Mission | menu item; the home "Our Mission" section | page body not separately captured — treat the home mission statement as its content |
| Blog "Magnolia Moments" | list + two post pages | fully captured |
| Consultation ("Care starts here") | banner + form | fully captured |
| Careers / Join Our Team | page | fully captured |
| Log in / Sign up | Wix modal | entry point only |
| Team, Portfolio/Gallery, Founder | — | **do not exist as pages** on the current site; the team photograph and the blog's photos are the only "gallery"/team material; the founder is unnamed |

## 3. Existing homepage, section by section (in order)

1. **Header** — centred logo (painted white magnolia, green leaves, thin gold arc; "MAGNOLIA" dark serif, small heart, "HEALTHCARE" gold letterspaced), hamburger right.
2. **Hero** — looping video of a caregiver embracing an older person with a halftone-dot overlay; "BECAUSE EVERY LIFE MATTERS" (white serif caps); "HOME CARE AGENCY" (small caps); white button "Free Consultation"; down-arrow; the hero ends in a **curved sage-green band** (the site's most distinctive shape).
3. **Our Mission** — pale sage panel; heading "Our Mission"; thin rule; eyebrow "DEDICATED PROFESSIONALS AT YOUR SERVICE"; the statement: *"Our mission is to provide a higher standard of care — one built on compassion, excellence, and respect for every individual. We believe caring for someone means seeing the person beyond their needs and creating an environment where they feel safe, valued, and understood. Our caregivers are thoughtfully selected, trained, and committed to bringing warmth, dignity, and genuine human connection into every home. We are committed to delivering exceptional care, maintaining the highest standards, and being a trusted partner to every client and family we serve."*
4. **Team photograph** — five people in scrubs (woman in white at centre = founder) in front of the Magnolia sign.
5. **WHY CHOOSE US? · Specialized Care** (arrow down) — six framed cards with gold hairline borders: Hospice & Palliative · Alzheimer's & Dementia Care · Rehabilitation Support · Geriatric Care · Parkinson's · ALS & Multiple Sclerosis (one sentence each, see `src/content/services`).
6. **HOW WE HELP** — four cards: 24/7 Caregiver Support · Case Management · Nursing Support · Chat Support (one sentence each).
7. **WHAT OUR CLIENTS SAY** — carousel of three quotes: Olivia Bennet · Jhenyfer Cristina · Joseph Williams.
8. **Floating contact buttons** — Phone · Facebook · WhatsApp · Chat (destinations not captured).
9. **Footer** — "Magnolia Healthcare, inc." (+ email on the consultation page).

## 4. Existing consultation page

Dark forest-green banner: "Let's talk about the care your family needs" · "Tell us a little about
your loved one. We'll reach out to set up a free consultation and find the caregiver who fits
them best." · three gold icons: Free, no commitment / **Anywhere in Massachusetts** / Care up to
24 hours a day · gold lotus line-art. Form "CARE STARTS HERE": First Name · Last Name · Phone ·
Email * · Message · Send. Footer: info@magnoliahealthcareinc.com · Magnolia Healthcare, inc.
(Owner's rule: only the "free consultation" claim is carried into the demo.)

## 5. Existing careers page

Green banner "JOIN OUR TEAM" · "INTERESTED IN JOINING OUR TEAM?" · "We'd love to hear from you!
Please complete our application and email the completed form to us. We look forward to learning
more about you and your experience." · "DOWNLOAD OUR APPLICATION FORM" · "Please download our
application form, complete it, and email the completed application to:
info@magnoliahealthcareinc.com." · "Our Application — DOWNLOAD >" · four-caregiver team photo.

## 6. Existing application (PDF, 3 pages)

Personal information (name, phone, email, address, city, state, ZIP) · Availability (days,
preferred time) · Professional certification & license (yes/no; type CNA/HHA/Other, number,
state, expiration; "if no" training note) · Caregiving experience (yes/no, years, where worked)
· Areas of experience (12 checkboxes + other) · Employment history (two positions) · Two
professional references · Applicant certification statement, signature, date · Office-use block.

## 7. Existing blog

"MAGNOLIA MOMENTS" heading; dark "Blog" bar with search; posts by "Magnolia Healthcare, inc.",
date, read time, views/comments/likes; post page with share (Facebook, X, LinkedIn, link),
"Recent Posts / See All", comments. Posts: "A Little Extra Love" (full text) · "Art Class"
(excerpt).

## 8. Existing visual identity

**Green is subtle.** The site is predominantly white and airy; green appears as pale panels, one
curved band, one careers band, one deep banner. Sampled from the owner's own screenshots and
recordings (relationships matter more than exact values):

| Role | Sampled | Where |
|---|---|---|
| Canvas | `#FEFEFE` / pale grey `#F3F3F3` | header, cards area, consultation form |
| Pale sage panel | `#EAEDE8` | "Our Mission" panel |
| Curved band | `#B1C09D` | the wave under the hero |
| Menu accent | `#B9C7A8` | active menu item, avatar |
| Careers band | `#7FA45E` | "Join our team" banner |
| Deep forest green | `#122E1F` | the one "Let's talk" consultation banner (light-green heading, white body, gold icons), Send button |
| Gold | `#B9975B`-ish | logo ring and "HEALTHCARE", card hairlines, icons, lotus line art |
| Type | charcoal/dark neutral | thin light serif headings (often caps), humanist sans body |

Recurring motifs: the large clean centred logo · the curved/wave section transition · gold
hairline card frames · a halftone-dot overlay on the hero video · the magnolia flower and lotus
line art · large emotional care photography · team imagery in sage / pink / blue scrubs with a
small gold embroidered logo · generous whitespace · a soft, compassionate atmosphere.

Concept 01 is deliberately the deeper, cinematic interpretation of this palette (the founder's
chosen direction); concepts 02–06 sit close to the site's own light tonal balance.

## 9. Existing functionality

Hero video · consultation form (email required) · downloadable PDF application · blog with
search, share, comments · member log in / sign up · floating contact buttons · free consultation
CTA repeated.

## 10. Founder / team / mission

Founder: unnamed; the woman in white at the centre of the five-person photo. No biography, no
credentials, no founding year in the materials. Team: two photos, no names or roles. Mission: the
statement above, verbatim.

---

# Preservation checklist → Letty Silva Beauty systems

| Magnolia element (must survive) | Carried by (Letty system) |
|---|---|
| Centred logo header + hamburger menu with the five destinations + Log in | Header/menu system (full-screen menu, inert + focus trap) with a visible desktop nav added |
| Video hero + "Because every life matters" / "Home care agency" / Free Consultation | Prologue (veil → film, poster-first, reduced-motion safe) with the supplied clips |
| Curved sage band under the hero | CSS shape at the hero's foot (kept as a signature motif in the concepts that lean on it) |
| Our Mission statement, verbatim | Chapter/story sections (drop cap, pull quote, sticky rail) |
| Team photograph; founder = woman in white | Framed plates, living-still rise, portrait frame — no names |
| Six Specialized Care cards with gold hairlines | Card system (hover lift, hairline, numeral) in a grid/strip/index per concept |
| Four How We Help items | Ledger / panel systems |
| Three testimonials | Triptych / quiet carousel |
| "Let's talk about the care your family needs" banner + free consultation + Massachusetts | Finale band / note card; ConsultForm multi-step with the real fields |
| Magnolia Moments blog | Blog hub + article template, search, related; share row |
| Join Our Team + PDF download + the application fields | Careers page + ApplicationForm 9-step flow; PDF kept as download |
| Log in entry point | Branded entry page → current site |
| Footer "Magnolia Healthcare, inc." + email | Grand footer (contact column, placeholders for unknowns) |
| Floating Phone/Facebook/WhatsApp/Chat | Not reproduced until destinations are supplied (listed as an open question) |
| Palette: white / sage / forest green / gold | Tokens (`--ivory`, `--sage`, `--leaf`, `--brass/--gold-lt`) — each concept re-tunes within this family only |
