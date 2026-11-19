# `/demo/amairanymua-01` — Amairany Sierra, three complete sites

An unlisted design preview for a prospective client: Amairany Sierra
(@amairanymua), luxury bridal hair and makeup, Orlando + Tampa. It is **not**
her official website and says so on every page (a marker that stays on screen,
the page title, and the footer). `noindex` by meta tag and by the `/demo/(.*)`
header in `vercel.json`.

**State: review build. Three complete sites, awaiting the founder's pick. Not
deployed.** (`PICK = null` in `scripts/amairanymua-01/site.mjs`.)

## What the founder asked for

2026-11-19, in two steps. First, after the first version (three single-page
directions): *"it doesn't feel like our demo family"*, study Sass by Kass and
the YariiiMakeup build, go multi-page, put a bridal inquiry on the site in demo
mode handing off to her JotForm, mix film with stills, keep her booking links.
Then, the brief this build answers:

> "Give me 3 previews of 3 different sites completely for her. I don't know
> exactly what she wants … We're showing her what we can do … animation,
> digital, everything. The sky's the limit. See how Leti Silva Beauty has a
> cool intro: a logo before the website generates, then a cool animation …
> I can't make them all look the same, and I don't want to. But the point is
> to show her work so people can book right away … and be like: damn, this is
> a nice site."

So there are three sites, each with its own design system, type, layout,
motion and logo-first opening. They share only her facts, booking links,
photographs, film slots and the inquiry's behaviour. Sass by Kass, Leti Silva
Beauty and YariiiMakeup were the standard of finish and the source of
mechanics (an opening that hands over to the page, film among stills, the
booking flow), not the look. The first version's directions are in git
history at `dd6d627`.

## The three sites

| | 1 · Veil | 2 · Noir | 3 · The Edit |
| --- | --- | --- | --- |
| Address (review build) | `/demo/amairanymua-01/veil` | `/demo/amairanymua-01/noir` | `/demo/amairanymua-01/edit` |
| Feeling | pearl and champagne; bridal luxury; light, ceremonial | espresso black; cinematic; dramatic | her link page's peach and cream with a Gulf blue; bold, social |
| Where it comes from | the veil in her night photograph, the robe-and-pearls bride, champagne shimmer on the lids | how she shoots: faces lit against dark backdrops | her own link page; Florida; Stories; the swatches and palettes on her table |
| Type | Cormorant Garamond + Jost | Instrument Serif + DM Mono + DM Sans | Bricolage Grotesque + Newsreader italic |
| The opening | three layers of tulle with her **A S** monogram in champagne foil lift off the hero like fabric; the name sets line by line | her name **draws itself** in champagne strokes on black (outlines from the font), then a reel of her portraits whips up and locks on the opening frame | three dry-brush **swatches** paint across cream, her wordmark stamps on, the peach floods into the hero |
| Hero | one tall picture, each still unveiled over the last with a soft edge | a full-screen vertical reel with fast cuts, slates carrying only true things | a **story viewer**: segmented bars, tap to go on, hold to pause, swipe |
| Signature below | a fine champagne **aisle** line drawing down the home page | **scenes**: a sticky full-screen sequence, one look wiping up over the next like film through a gate | an **eyeshadow palette**: six pans that switch the lookbook |
| Portfolio | a procession of tall framed prints; light viewer | a dark wall of faces, filter slates; viewer that dips through black | pan filter, masonry of off-square cards; story-style viewer |

Each site is seven pages: Home, About, Bridal, Services, Portfolio, Reviews and
the Bridal Inquiry. The lead action ("Bridal inquiry") and "Book event glam"
are on the first screen of every page, and on phones a booking bar stays within
reach after the hero (not on the inquiry page itself).

`/demo/amairanymua-01` is the founder's chooser: the three sites side by side,
each shown by real phone and wide screenshots of its home page
(`assets/img/preview-*.webp`, captured from the built pages). The marker at
the foot of every page also carries a **1 · 2 · 3 · All** switch during review:
it opens the same page in another site. Each opening plays once per browser
session per site; `?intro=1` replays it, `?intro=0` skips it.

### After the pick

Set `PICK = 'veil'` (or `'noir'`, `'edit'`) in `scripts/amairanymua-01/site.mjs`
and rebuild. That site is then written at the demo root and the chooser, the
other two sites and the switch are no longer built. The other two sites'
folders (`scripts/amairanymua-01/<id>/`, `assets/<id>/`), their fonts,
`assets/css/chooser.css` and `assets/img/preview-*.webp` can then be deleted.

## Film and stills

**No video file exists in this demo.** There are four film slots, `f1`–`f4`
(`FILMS` in `site.mjs`), placed among the photographs in each site's hero,
home page, portfolio, services and about pages. Until a clip exists each slot
renders as a marked plate in its site's style ("Film 01 · A bridal reel plays
here · Slot · clip to come"). Nothing loops or animates a photograph and calls
it film, nothing embeds Instagram, nothing is stock.

To fill a slot from a screen recording of one of her reels:

    python3 scripts/amairanymua-01-film.py <recording> --probe
    python3 scripts/amairanymua-01-film.py <recording> bridal --start 2.4 --dur 5 --crop 0:210:1179:2096 --poster-at 1.2

then set `file: 'bridal'` and an `alt` on the slot in `site.mjs` and rebuild.
Every place that uses the slot plays the clip (muted, looping, inline, poster
first, loaded near the viewport, still for reduced motion and Save-Data). The
script trims, crops away phone and app chrome, scales to 720 wide and removes
the audio, and nothing else. **It has been run only on a synthetic test
recording.** The "clip present" path of each site was not exercised with a
real clip in the browser.

## Booking — her system, exactly as published

| Control | Goes to |
| --- | --- |
| **Bridal inquiry** (primary, everywhere) | the site's own `/bridal-inquiry` page |
| "Open Amairany's inquiry form" (the inquiry's last step, and its no-script fallback) | `https://form.jotform.com/252119273398160` |
| Explore Bridal Services | `https://amairanymua.as.me/?appointmentType=category:Bridal%20Services` |
| Book Event Makeup & Hair / Book event glam | `https://amairanymua.as.me/?appointmentType=category:Hair%20%26%2For%20Makeup%20%28%20Travel%2F%20In%20Studio%29` |
| "her booking page" (packages and pricing, in text) | `https://amairanymua.as.me/schedule/bea4d83a` |

Written once in `site.mjs`; every link to her booking system is made by one
helper (`book()`). `scripts/amairanymua-01-check.mjs` fails the build if any
`data-book` link on any page differs from this table by a character, or if any
link reaches her booking hosts another way. External links open in the same
tab. Her JotForm and Acuity pages could not be opened from the build
environment (network allows package registries and GitHub only), so nothing
about them was re-read on 2026-11-19. Nothing was submitted or booked.

### The bridal inquiry (demo mode)

One shared component (`scripts/amairanymua-01/inquiry-core.mjs`,
`assets/js/inquiry.js`, `assets/css/inquiry-core.css`) skinned by each site
with CSS alone. Four steps, asking the questions her JotForm asks as listed by
the founder: **the day** (wedding date or "not set yet", ceremony time,
getting-ready location, first look, ready-by time), **the glam** (package,
party size, inspiration), **your contact** (name, email, phone, preferred
contact), **review** (every answer, with Edit). Then the hand-off: "Design
preview — nothing was sent", **Open Amairany's inquiry form** (a plain link,
nothing appended), **Copy my answers** (with two fallbacks), and a way back.

**Nothing typed is sent anywhere.** The form has no action or method, no script
makes a network request (the checker fails the build on `fetch`, XHR, beacons,
sockets or `form.submit()`), answers live only in the visitor's
`sessionStorage` (shared by the three sites, so switching previews keeps them)
until "Start over", and her form is not pre-filled.

**To confirm with her** (her form could not be read; these are our reading):
the option lists (first look: Yes / No / Not sure yet; package: her four
collection names plus "Not sure yet"; party size: Just me / 2–4 / 5–8 / 9 or
more / Not sure yet; preferred contact: Text / Call / Email); which questions
are required (here only name and email); and, for a real site, whether
inquiries should be delivered from this page or keep finishing on her JotForm.

## How it is built

    node scripts/amairanymua-01-build.mjs      # writes the pages and DEMO.json (add --dev to tolerate a module mid-edit)
    node scripts/amairanymua-01-check.mjs      # static safety checks; exits 1 on any failure
    python3 scripts/amairanymua-01-assets.py <folder-with-the-original-photos>
    python3 scripts/amairanymua-01-film.py <recording> <name> …

| File | Holds |
| --- | --- |
| `scripts/amairanymua-01/site.mjs` | **every fact, link, photograph, look, film slot and line of shared copy**, `PICK`, the standard `<head>`, the preview marker |
| `scripts/amairanymua-01/inquiry-core.mjs` | the shared inquiry markup |
| `scripts/amairanymua-01/<site>/` | `shell.mjs` (header, menu, footer, page kit), `home.mjs`, `pages-work.mjs` (portfolio, reviews), `pages-story.mjs` (about, services, bridal), `inquiry.mjs`, `index.mjs` |
| `scripts/amairanymua-01/chooser.mjs` | the chooser (review build only) |
| `assets/<site>/` | that site's `site.css`/`site.js` (tokens, shell, runtime), `home.*`, `pages-work.*`, `pages-story.*`, `inquiry.css`, and its own generated art (The Edit's swatch masks) |
| `assets/css/marker.css` | the preview marker (studio chrome, the same in all three) |
| `assets/js/inquiry.js`, `assets/css/inquiry-core.css` | the shared inquiry behaviour and structure |
| `assets/fonts/` | self-hosted OFL fonts (Cormorant Garamond, Jost, Instrument Serif, DM Mono, DM Sans, Bricolage Grotesque, Newsreader; latin subsets from the `@fontsource` packages, 5.3.0) |

No dependencies, no framework: plain Node writes plain HTML, CSS and script.
Nothing is read from `/demo/_shared/` and nothing is shared with any other demo.

## Photographs

Twelve images supplied by the founder on 2026-11-18 as phone screenshots of her
Instagram posts, with his statement that Amairany gave permission to use her
photos and information for this demo. The originals are not in the repository.
Processing is trim, resize and WebP only. No CSS filter alters her work; scrims
and fades sit at the edges of frames. Noir shows photographs with bright
backgrounds whole inside a fine champagne hairline rather than fading them into
black. `pos` on each photograph in `site.mjs` is where the face sits.

| File key | Note |
| --- | --- |
| `artist-brushes` | About portrait in all three sites. Founder: "this is her" |
| `artist-spotlight-crop` | Founder: "this is her". The full frame's prop reads "The Nail Times", so only a head-and-shoulders crop is used. **Confirm with her.** |
| `bride-crystal`, `bride-pearls`, `bride-gold-waves`, `bride-ruby`, `glam-sculpt`, `waves-blonde`, `glam-bronze` | heroes, portfolios, services |
| `wedding-florals`, `golden-hour`, `wedding-night` | wedding-day groups, picture bands, reviews. `wedding-night` shows a theme-park castle; her call whether it stays |

The largest file is 1280 px wide, so full-bleed pictures are soft on high-DPI
wide screens; The Edit frames its bridal band at wide sizes for that reason.
Still open: photographer credits, and whether each client is happy to be on a
website rather than only on Instagram.

## What the copy claims, and where it comes from

| On the page | Source | Status |
| --- | --- | --- |
| "Luxury hair and makeup artist based in Florida", soft–full glam, glam waves, "real-life filter skin, never cakey", brides, events and photoshoots, "Secure your wedding day glam", à la carte / packages / custom experiences | Her link page, fetched 2026-11-18 | Her own words |
| Orlando + Tampa | Instagram display name | Her own words |
| Doing makeup since 2013; Aveda Institute Winter Park, 2018 | 2024 OrlandoVoyager interview ("around 2013") | **Confirm the year** |
| Trials, bridal party | WeddingWire / Zola listings; her inquiry form asks about party size | Confirm |
| In studio or on location | Name of her Acuity category | Confirm coverage area |
| The Luxe Bride, The Signature Soiree, The Luxe Gala, The Radiant Bride | Kit's read of her Acuity page, 2026-11-18 | Names only, no prices; can change |
| WeddingWire 5.0 · 31 reviews; The Knot 5.0 · 4 reviews | Kit's read, 2026-11-18; dated on each Reviews page | Counts will drift |
| amairanysmua@gmail.com | Her link page | Published by her |
| The inquiry's questions | Founder's list of her JotForm's questions, 2026-11-19 | Option lists are ours: confirm |

Left out until she confirms: years of experience as a number, "licensed and
insured", Puerto Rico and Greece 2027, any price, any studio address, **any
review quotation** (the Reviews heading reads "Five stars, read them in full."
and links to the sites), any description of what happens after an inquiry,
TikTok. Third person throughout: nothing is written on her behalf. Headlines
and section titles are proposals. The wordmarks and monograms are concept
styling; she has no logo file.

## Checks run, 2026-11-19

Headless Chromium only (Playwright, touch emulation for phones). **No real
iPhone, no Safari/WebKit, no Instagram in-app browser.** Frame timings come
from a shared machine with software rendering, so smoothness on a real slow
phone is unproven.

- `node scripts/amairanymua-01-build.mjs` (strict) and
  `node scripts/amairanymua-01-check.mjs`: OK — 22 pages, 1135 links, 214
  booking links each exactly as documented, 159 images with alt text, no
  outbound requests, nothing shared with another demo.
- Browser smoke test of all 21 site pages at 320, 390, 768 and 1440, and at
  390 under reduced motion: no horizontal overflow, no console errors, nothing
  left hidden, no broken images, a booking action on the first screen. The
  builders also ran 375, 430, 1024, 1920 and landscape phones on their pages.
- Each opening captured frame by frame at 390×844 and 1440×900: plays once per
  session, `?intro=0`/`?intro=1` work, any tap, wheel or key ends it at once,
  the lead action is clickable during it, reduced motion and no-script show the
  finished page.
- Inquiry walked end to end on all three sites at 320, 390 and 1440:
  validation, Edit, reload, hand-off link exact, Copy read back from the
  clipboard, Start over; every request stayed on the local server.
- JavaScript off: every page complete and bookable. Keyboard only: skip link
  first, visible focus, menus trap and release focus, viewers and filters work.

## For her, before anything is sent on

1. Is the studio-spotlight photo you, and is it right for this site?
2. Photographer credits, and are all ten client photos cleared for a website?
3. Original video clips (or approval of screen recordings), each client's
   consent to appear in them, and a logo file if one exists.
4. Year you started, and how you want experience worded.
5. Coverage area and travel; whether Puerto Rico and Greece 2027 should appear.
6. Which reviews can be quoted.
7. The inquiry's option lists, which questions are required, and whether
   inquiries should keep finishing on your JotForm.
