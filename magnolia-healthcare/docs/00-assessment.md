# 00 — Implementation assessment (Magnolia Healthcare, Inc. premium demo)

Kept as the record of what the demo is built on. **Superseded in part by
`02-contamination-audit.md`:** the first version of this document was assembled from search
snippets of a *different* Colorado company with a similar name; that content has been purged and
this document now describes the Massachusetts client only.

## Source of truth

The client is **Magnolia Healthcare, Inc.** (magnoliahealthcareinc.com, a Wix site), a home care
agency serving **anywhere in Massachusetts**. Every fact below was transcribed from the client's
own supplied materials — five screen recordings of the site (87 frames read), the supplied
caregiver application PDF, the supplied CTA banner, photos and clips. No external site was used.
Facts the materials do not establish are left as explicit placeholders.

## 1. Content inventory (from the current site) → demo surface

| Current site | What it carries (verbatim where quoted) | Demo surface |
|---|---|---|
| Home hero | "BECAUSE EVERY LIFE MATTERS" · "HOME CARE AGENCY" · button "Free Consultation" over a video of a caregiver embracing an older person; sage-green curved band | `/` prologue (supplied clip) |
| Our Mission | "DEDICATED PROFESSIONALS AT YOUR SERVICE" + the four-sentence mission statement ("Our mission is to provide a higher standard of care — one built on compassion, excellence, and respect for every individual…") | `/` chapter i, `/mission` |
| Why choose us? · Specialized Care | Hospice & Palliative · Alzheimer's & Dementia Care · Rehabilitation Support · Geriatric Care · Parkinson's · ALS & Multiple Sclerosis, one sentence each | `/` services grid, `/services` |
| How we help | 24/7 Caregiver Support · Case Management · Nursing Support · Chat Support, one sentence each | `/` chapter ii, `/services#how` |
| What our clients say | Three testimonials (Olivia Bennet, Jhenyfer Cristina — partially legible, Joseph Williams) | `/` triptych |
| Consultation ("Care starts here") | Banner: "Let's talk about the care your family needs…"; icons "Free, no commitment" / "Anywhere in Massachusetts" / "Care up to 24 hours a day"; form First Name, Last Name, Phone, Email*, Message, Send | `/consultation` (only the "free consultation" and "Anywhere in Massachusetts" claims are carried, per the owner) |
| Blog "Magnolia Moments" | "A Little Extra Love" (full text, Sep 17) · "Art Class" (excerpt only, Sep 17); by "Magnolia Healthcare, inc."; share, recent posts, comments | `/blog`, `/blog/<slug>` |
| Join Our Team | "Interested in joining our team? We'd love to hear from you!…" · "Download our application form… email the completed application to: info@magnoliahealthcareinc.com" · "Our Application — DOWNLOAD" | `/careers` (PDF download kept) + `/apply` (the form rebuilt online) |
| Menu | Home · Our Mission · Blog · Consultation · Careers · Log in (Wix: email/password, Google, Facebook) | header, menu, `/login` entry point |
| Footer | "Magnolia Healthcare, inc." · email | footer |
| Floating buttons | Phone · Facebook · WhatsApp · Chat (destinations not captured) | not reproduced (unknown targets) |

## 2. Not established by the materials (placeholders, never invented)

Phone · street address · hours · founder's name/biography · founding year · licensing, insurance,
accreditation · staff names/roles · social URLs · pricing · full "Art Class" text · member area.

## 3. Visual identity observed

White ground, sage-green bands, dark forest-green consultation banner, gold accents; logo = a
painted white magnolia with green leaves in a thin gold ring over "MAGNOLIA ♥ HEALTHCARE"; light
serif headings, humanist sans body. The demo's tokens keep that family (deep leaf green, sage,
brass/gold, ivory) and the real logo file replaces `Mark.astro` when supplied.

## 4. Architecture (unchanged)

Astro static site on the Leti Silva Beauty foundation: `consts.ts` as single source of truth,
content collections for services/posts, shared motion grammar, Prologue hero, multi-step forms
posting to `api/*` (deliver via Resend when configured, otherwise labelled demo mode), `noindex`
everywhere, demo badge, never pointed at the real domain.
