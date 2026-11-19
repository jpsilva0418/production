# `/demo/amairanymua-01` — Amairany Sierra, on the demo-family system

> **Being rewritten.** Founder direction changed on 2026-11-19: instead of one site in
> three colour directions, the demo is now **three completely different sites** (Veil,
> Noir, The Edit), each with its own logo opening, design and motion, built on shared
> facts, booking links, photographs and inquiry behaviour. The build is in progress on
> this branch. The sections below about "directions A, B, C" and the Sass by Kass port
> describe the superseded plan and will be replaced when the three sites are verified.
> What still holds: the booking links, the photographs, the film-slot rule (no stand-in
> video), the inquiry's questions and demo mode, the sourced-facts table, and the list of
> things for her to confirm.

An unlisted design preview for a prospective client: Amairany Sierra
(@amairanymua), bridal hair and makeup, Orlando + Tampa. It is **not** her
official website and says so on every page (a marker that stays on screen,
the page title, and the footer). `noindex` by meta tag and by the `/demo/(.*)`
header in `vercel.json`.

**State: review build. Three directions, awaiting the founder's pick. Not
deployed.** (`PICK = null` in `scripts/amairanymua-01/site.mjs`.)

## Why it was rebuilt

Founder feedback, 2026-11-19, on the first version (three single-page sites:
Première, The Cover, Golden Hour): *"it doesn't feel like our demo family."*
The instruction was to study `/demo/sass-by-kass-01` (entrance, pacing, type
scale, page structure, inquiry flow) and the YariiiMakeup build (how stills
and film are mixed), and rebuild Amairany to that same standard and feel, with
her own colours, photographs and name. That instruction overrides two lines of
the original kit: "don't resemble Kass" and "no forms".

So this version is a member of the family, not a relative of it:

- the **design system is Sass by Kass's own** (`tokens.css` + `system.css`,
  ported rule for rule into `assets/css/system.css`): the same type scale and
  type roles (Fraunces display, Figtree utility caps), the same rhythm,
  reveals, underline-to-fill buttons, kicker furniture, chapter slates, sticky
  chapters, covers, ghost words, note cards, grand footer and full-screen menu;
- the **pages are Kass's pages**, ported from her source and re-voiced: the
  pinned opening with a curved chapter rising over it, the short home page,
  the portfolio masonry with a sticky group bar, the services rows with a reel
  set into the corner of a photograph, the About title card with an arched
  portrait, the honest Reviews page, the four-step bridal inquiry;
- only the token **values**, the photographs, the words and the hero
  composition are Amairany's.

The first version's three directions are retired. They are in git history at
`dd6d627`.

## What is here

| Address (review build) | What it is |
| --- | --- |
| `/demo/amairanymua-01` | The founder's chooser: three directions, each shown by a real screenshot of its opening |
| `/demo/amairanymua-01/a` | **A · Espresso & Champagne** — full-bleed stills and film |
| `/demo/amairanymua-01/b` | **B · Peach & Cream** — an arched window of stills and film |
| `/demo/amairanymua-01/c` | **C · Rosewood & Blush** — a framed reel beside her name |

Each direction is a complete seven-page site with the same structure and words:

| Page | Path | Ported from (Sass by Kass) |
| --- | --- | --- |
| Home | `/` | `Hero.astro`, `Home.astro` |
| About Amairany | `/about` | `pages/about.astro` |
| Bridal | `/bridal` | built from family parts (Kass has no equivalent page) |
| Services | `/services` | `pages/services/index.astro` |
| Portfolio | `/portfolio` | `pages/portfolio.astro` |
| Reviews | `/reviews` | `pages/reviews.astro` |
| Bridal Inquiry | `/bridal-inquiry` | `pages/bridal-inquiry.astro`, `BridalInquiryForm.astro` |

The marker at the foot of every page ("Design preview · not the official
site") also carries a small **A · B · C · All** switch during review: it opens
the same page in another direction, so any two can be compared screen for
screen. Add `?intro=1` to a home address to replay its opening, `?intro=0` to
skip it.

### After the pick

Set `PICK = 'a'` (or `'b'`, `'c'`) in `scripts/amairanymua-01/site.mjs` and
rebuild. The chosen direction is then written at the demo root
(`/demo/amairanymua-01`, `/demo/amairanymua-01/portfolio`, …); the chooser,
the other two directions and the direction switch are no longer built.
`assets/css/chooser.css` and `assets/img/preview-*.webp` can then be deleted,
and the two unused palettes and hero compositions removed from `system.css`
and `hero.css` during the polish pass.

## The three directions

A direction is **a palette and a hero composition**. Nothing else differs.

What her photographs have in common: warm bronzed skin with a visible glow,
espresso hair, rose-nude glossy lips, champagne and gold on the lids, black
and ivory wardrobe. Her link page is peach and cream with charcoal type. Each
palette is taken from one of those, and fills the same token roles Kass's
blues fill.

| | A · Espresso & Champagne | B · Peach & Cream | C · Rosewood & Blush |
| --- | --- | --- | --- |
| Where it comes from | her hair and the champagne of her shimmer lids | her own link page | her rose-nude lip |
| Anchor (`--leaf`) | `#2E1F18` espresso | `#2F2A28` charcoal | `#5A2A35` rosewood |
| Light (`--sage`) | `#D8B894` champagne bronze | `#F2B894` peach | `#E3B4B4` rose-nude |
| Ground (`--ivory`) | `#FBF7F2` | `#FFF9F3` | `#FCF6F4` |
| Accent on dark (`--gold-lt`) | `#EAD3B3` | `#F6CDAF` | `#F0D5C4` |
| Hero | **dark.** Her work fills the screen edge to edge behind the frame: one column on a phone, three on a wide screen | **light.** Her name on cream above one arch-topped frame of moving pictures, two smaller frames beside it on wide screens | **dark.** Her name on the rosewood field beside a tall framed reel, a smaller frame set into its corner |
| Closest to | Kass's deep-navy hero, with the pictures moving behind it | Kass's About portrait arch | Kass's services rows (a reel set against a photograph) |

Every colour pairing used for text was measured at WCAG AA or better in all
three palettes (small caps and body text at 4.5:1 or more; headings at 7:1 or
more).

The palette and the hero are independent: "A's colours with C's hero" is a
change to two class names, not a rebuild.

### The opening

Kass's signature entrance, timing included, with Amairany's name where Kass's
logo is (Amairany has no verified logo file, so the mark is typography and the
footer says it is concept styling):

| Time | What happens |
| --- | --- |
| 0.00–1.15 s | a ring draws and widens; her name is revealed inside it at the centre of the screen |
| 1.15–1.35 s | hold |
| 1.35–2.25 s | the name travels to its place in the layout; the ring opens and fades |
| 1.55–2.75 s | header, frame, the pictures, rule, buttons and cue assemble around it |

About 2.75 seconds. It plays once per browser session per direction, never
under reduced motion or Save-Data, and never without script. The lead action
stays clickable throughout; any scroll, touch or key ends it at once; if its
script never takes over, a 2.5-second failsafe shows the finished hero. Only
wrappers move, with transform, opacity and clip-path, and no animated end
state is kept (the two rules Kass's source records after an iPhone WebKit
bug).

## Film and stills

Founder direction: mix film with stills in the hero and the gallery the way
Leti Silva Beauty and YariiiMakeup do; screen recordings of her reels are
coming; until then **leave marked slots and do not fake video**.

**No video file exists in this demo.** There are four film slots, `f1`–`f4`
(`FILMS` in `site.mjs`). Each renders, wherever it is used, as a marked plate
("Film 01 · A bridal reel plays here · Slot · clip to come") in the exact
frame the clip will play in. Nothing loops a photograph and calls it film,
nothing embeds Instagram, nothing is stock.

| Slot | Meant for | Used in |
| --- | --- | --- |
| `f1` | a bridal reel | hero (beat 3), home selection, portfolio › Bridal, services › Bridal Hair & Makeup |
| `f2` | a glam reel | hero (beat 7), portfolio › Glam & waves, services › Soft Glam to Full Glam, about › In motion |
| `f3` | a getting-ready reel | portfolio › Wedding day, about › In motion |
| `f4` | a glam-waves reel | portfolio › Glam & waves, services › Glam Waves & Event Hair |

The hero is a list of beats (`MONTAGE` in `site.mjs`): seven photographs with
two film beats cutting in. Pictures dissolve every 2.6 seconds or so; it rests
when it is off screen or covered, has a pause button, and stays on one still
for reduced motion, Save-Data and no script. A phone that refuses to autoplay
video will show each clip's poster frame and everything else runs unchanged.

### Filling a slot

    python3 scripts/amairanymua-01-film.py <recording> --probe
    python3 scripts/amairanymua-01-film.py <recording> bridal --start 2.4 --dur 5 --crop 0:210:1179:2096 --poster-at 1.2

`--probe` reports the recording's size and writes a contact sheet next to it,
to choose the seconds and the crop from. The second command writes
`assets/film/bridal.mp4` (silent H.264, 720 wide, portrait, at most 8 seconds)
and `assets/film/bridal.jpg` (its poster). Then set `file: 'bridal'` and an
`alt` on the slot in `site.mjs` and rebuild. Every place that uses the slot
plays the clip; nothing else changes. The script trims, crops away the phone
and app chrome, scales and removes the audio track, and nothing else. **It has
been run only on a synthetic test recording**, never on one of her reels.

Whose reel each clip is, and each client's consent to appear on a website, are
Amairany's to confirm. Her original files would look better than a screen
recording.

## Booking — her system, exactly as published

| Control | Goes to |
| --- | --- |
| **Bridal inquiry** (primary, everywhere) | the on-site inquiry page, `/bridal-inquiry` |
| "Open Amairany's inquiry form" (the inquiry's last step, and its no-script fallback) | `https://form.jotform.com/252119273398160` |
| Explore Bridal Services | `https://amairanymua.as.me/?appointmentType=category:Bridal%20Services` |
| Book Event Makeup & Hair / Book event glam | `https://amairanymua.as.me/?appointmentType=category:Hair%20%26%2For%20Makeup%20%28%20Travel%2F%20In%20Studio%29` |
| "her booking page" (packages and pricing, in text) | `https://amairanymua.as.me/schedule/bea4d83a` |

These four addresses are unchanged from the first version. They are written
once, in `site.mjs`, and every link to her booking system is made by one
helper (`book()`); `scripts/amairanymua-01-check.mjs` fails the build if any
`data-book` link in any page differs from this table by a character, or if any
link reaches her booking hosts without going through it. All external links
open in the same tab, the one-tap handoff that proved right for Instagram's
in-app browser on Sass by Kass.

Neither her JotForm nor her Acuity pages could be opened from the build
environment this time (its network allows package registries and GitHub only;
both returned `403` at the proxy), so nothing about them was re-read on
2026-11-19. Nothing was submitted or booked, then or before.

### The bridal inquiry (demo mode)

An on-site page like Kass's `/bridal-inquiry`: the same four-step system,
progress bar, card choices, validation, review with Edit, and session
persistence. It asks the questions her own JotForm asks, as listed by the
founder on 2026-11-19:

| Step | Questions |
| --- | --- |
| 1 · The day | wedding date (or "not set yet"), ceremony time, getting-ready location, first look, ready-by time |
| 2 · The glam | package, party size, inspiration |
| 3 · Your contact | name, email, phone, preferred contact |
| 4 · Review | every answer, with Edit |

Then the hand-off: "Design preview — nothing was sent", **Open Amairany's
inquiry form** (her JotForm, a plain link with nothing appended), **Copy my
answers**, and a way back.

**Nothing typed is sent anywhere.** The form has no action and no method; its
script never makes a network request (the checker fails the build on `fetch`,
`XMLHttpRequest`, `sendBeacon`, sockets or `form.submit()` anywhere in the
demo); answers live only in the visitor's own `sessionStorage` until "Start
over" or the tab closes; her form is not pre-filled by query string.

**To confirm with her** (her form could not be read from here, so these are
our reading of the question list, not a copy of her form):

- the option lists: first look (Yes / No / Not sure yet); package (her four
  collection names plus "Not sure yet"); party size (Just me / 2–4 / 5–8 /
  9 or more / Not sure yet); preferred contact (Text / Call / Email);
- which questions her form requires. Here only name and email are required;
- for the real site: whether inquiries should be delivered to her directly
  from this page, or keep finishing on her JotForm (which could then be
  pre-filled from these answers, once her form's field names are known).

## How it is built

    node scripts/amairanymua-01-build.mjs      # writes the pages and DEMO.json
    node scripts/amairanymua-01-check.mjs      # static safety checks; exits 1 on any failure
    python3 scripts/amairanymua-01-assets.py <folder-with-the-original-photos>
    python3 scripts/amairanymua-01-film.py <recording> <name> …

| File | Holds |
| --- | --- |
| `scripts/amairanymua-01/site.mjs` | **every fact, link, photograph, film slot and word of copy**, plus `PICK` |
| `scripts/amairanymua-01/layout.mjs` | the page shell: head, header, full-screen menu, footer, marker |
| `scripts/amairanymua-01/hero.mjs` | the three hero compositions and the entrance gate |
| `scripts/amairanymua-01/home.mjs` | the home page |
| `scripts/amairanymua-01/pages-work.mjs` | portfolio, reviews |
| `scripts/amairanymua-01/pages-story.mjs` | bridal, services, about |
| `scripts/amairanymua-01/inquiry.mjs` | the bridal inquiry |
| `scripts/amairanymua-01/chooser.mjs` | the chooser (review build only) |
| `assets/css/system.css` | tokens, the three palettes, the family grammar |
| `assets/css/{hero,home,work,story,inquiry,chooser}.css` | one stylesheet per page family |
| `assets/js/site.js` | shared runtime: menu, header, reveals, lazy films |
| `assets/js/{hero,home,inquiry}.js` | the opening and moving pictures; home chapters and carousel; the inquiry |

No dependencies, no build framework: the generator is plain Node, the pages
are plain HTML, CSS and script. Nothing is read from `/demo/_shared/`, and
nothing is shared with any other demo. Fonts are self-hosted OFL files
(Fraunces and Figtree variable, latin subset, from the `@fontsource-variable`
packages at 5.3.0, the same packages Sass by Kass builds from).

## Photographs

Twelve images supplied by the founder on 2026-11-18 as phone screenshots of
her Instagram posts, with his statement that Amairany gave permission to use
her photos and information for this demo. The originals are not in the
repository. Processing is trim, resize and WebP only
(`scripts/amairanymua-01-assets.py`). No new photograph was added in the
rebuild.

| File key | Used as | Note |
| --- | --- | --- |
| `artist-brushes` | About portrait (home and About) | Founder: "this is her" |
| `artist-spotlight-crop` | About › In motion | Founder: "this is her". The prop in the full frame reads "The Nail Times", so only a head-and-shoulders crop is used. **Confirm with her.** |
| `bride-crystal`, `bride-pearls`, `bride-gold-waves`, `bride-ruby` | hero, portfolio › Bridal, services, booking cards | |
| `glam-sculpt`, `waves-blonde`, `glam-bronze` | hero, portfolio › Glam & waves, services | |
| `wedding-florals`, `golden-hour`, `wedding-night` | portfolio › Wedding day, bridal page band, reviews | `wedding-night` shows a theme-park castle; her call whether it stays |

`pos` on each photograph in `site.mjs` is where the face sits, and is applied
wherever a frame crops the picture.

Still open: photographer credits for the professional images, and whether
each client is happy to be on a website rather than only on Instagram.

## What the copy claims, and where it comes from

| On the page | Source | Status |
| --- | --- | --- |
| "Luxury hair and makeup artist based in Florida", soft–full glam, glam waves, "real-life filter skin, never cakey", brides, events and photoshoots, "Secure your wedding day glam", à la carte / packages / custom experiences | Her link page, fetched 2026-11-18 | Her own words |
| Orlando + Tampa | Instagram display name | Her own words |
| Doing makeup since 2013; Aveda Institute Winter Park, 2018 | 2024 OrlandoVoyager interview ("around 2013") | **Confirm the year** |
| Trials, bridal party | WeddingWire / Zola listings; her inquiry form asks about party size | Confirm |
| In studio or on location | Name of her Acuity category | Confirm coverage area |
| The Luxe Bride, The Signature Soiree, The Luxe Gala, The Radiant Bride | Kit's read of her Acuity page, 2026-11-18 | Names only, no prices; can change |
| WeddingWire 5.0 · 31 reviews; The Knot 5.0 · 4 reviews | Kit's read, 2026-11-18; dated on the Reviews page | Counts will drift |
| amairanysmua@gmail.com | Her link page | Published by her |
| The inquiry's questions | Founder's list of her JotForm's questions, 2026-11-19 | Option lists are ours: confirm |

Left out until she confirms: years of experience as a number, "licensed and
insured", Puerto Rico and Greece 2027, any price, any studio address, **any
review quotation**, any description of what happens after an inquiry
(contract, deposit, reply time), TikTok. The site speaks about her in the
third person throughout: nothing has been written on her behalf.

Headlines are proposals: "Real skin, real glam.", "Every look, up close.",
"Brides first, then every occasion.", "Five stars, in their own words.",
"Tell her about your day.", and the section titles.

## Checks run

See the end of this document for the dated record of what was actually run.

## For her, before anything is sent on

1. Is the studio-spotlight photo you, and is it right for this site?
2. Photographer credits, and are all ten client photos cleared for a website?
3. Original video clips (or approval of the screen recordings), each client's
   consent to appear in them, and a logo file if one exists.
4. Year you started, and how you want experience worded.
5. Coverage area and travel; whether Puerto Rico and Greece 2027 should appear.
6. Which reviews can be quoted.
7. The inquiry's option lists (first look, package, party size, preferred
   contact), which questions are required, and whether inquiries should keep
   finishing on your JotForm.
