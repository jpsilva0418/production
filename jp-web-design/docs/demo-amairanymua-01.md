# `/demo/amairanymua-01` — Amairany Sierra, six complete sites

An unlisted design preview for a prospective client: Amairany Sierra
(@amairanymua), luxury bridal hair and makeup, Orlando + Tampa. It is **not**
her official website and says so on every page: a marker that stays on screen,
the page title, and the footer. It is `noindex` by meta tag and by the
`/demo/(.*)` header in `vercel.json`.

**State: review build. Six complete sites in two rounds, awaiting the founder's
pick. Not deployed.** (`PICK = null` in `scripts/amairanymua-01/site.mjs`.)

## What the founder asked for

2026-11-19, in three steps.

1. **Rework the first version.** After the first version (three single-page
   directions) he said *"it doesn't feel like our demo family"*. He asked us to:
   - study Sass by Kass and the YariiiMakeup build;
   - go multi-page;
   - put a bridal inquiry on the site in demo mode, handing off to her JotForm;
   - mix film with stills;
   - keep her booking links.
2. **Round one** (Veil, Noir, The Edit):

   > "Give me 3 previews of 3 different sites completely for her … the sky's
   > the limit. See how Leti Silva Beauty has a cool intro … I can't make
   > them all look the same … the point is to show her work so people can
   > book right away … and be like: damn, this is a nice site."

3. **Round two** (Rouge, Maison, Darkroom), from a zip of references: her
   current booking site, her JotForm, her profiles, Faces by Clara and Leti
   Silva Beauty. He asked for:
   - one site that looks like the first Sass by Kass build, in her colours;
   - others with a completely different vibe and animation;
   - an intro before the site opens;
   - a picture next to a video;
   - the inquiry next to the booking, with her About right under;
   - a slideshow that advances on its own;
   - a portfolio page like Leti's;
   - a blog;
   - "2026, 2027 bookings";
   - her own form's questions kept.

   Her colours are **red, black and white**.

   His later notes on round two:
   - **The red:** *"That red looks atrocious. It needs to be like a soft, glam,
     little red … very light … I don't want anything outlandish."* Every
     round-two site was moved to the soft palette below.
   - **Photography:** *"That service is separate"*, read as meaning the film
     photography on her site is her fiancé's service, not hers. It is not
     listed among her services; her own FAQ answer says so.
   - **Links:** her Instagram, TikTok and Google should each be one tap away,
     and *"take them directly to the site"*.

The first version's directions are in git history at `dd6d627`.

## The six sites

`/demo/amairanymua-01` is the founder's chooser. Round two comes first, then
round one. Each card shows real phone and wide screenshots of the site's home
page (`assets/img/preview-*.webp`, captured from the built pages).

The marker at the foot of every page carries a **1–6 · All** switch during
review. It opens the same page in another site where that page exists.

Each opening plays once per browser session per site. `?intro=1` replays it
and `?intro=0` skips it.

### Round two: her colours (red, black and white)

The red is used softly in all three sites:

| Colour | Hex | Where it is used | Contrast |
| --- | --- | --- | --- |
| Soft rose | `#D9868C` | lines, script, dots, accents on black | 7.25:1 |
| Rosewood | `#A8505A` | small rose text on white | 5.30:1 |
| Blush | `#F6E3E3` | fills and bands | (fill only) |

There is no saturated red, no red buttons, no red fields and no white text on
red.

| | 4 · Rouge | 5 · Maison | 6 · Darkroom |
| --- | --- | --- | --- |
| Address | `…/rouge` | `…/maison` | `…/darkroom` |
| Idea | the first Sass by Kass build, done for her | her own brand, "Glam By Amairanymua", presented like a fashion house | black-and-white prints developing under a soft rose glow |
| Type | Fraunces + Figtree; her lockup in Pinyon Script over spaced caps | Italiana caps + Hanken Grotesk; Mrs Saint Delafield for "Glam By" and one note per page | Syne + IBM Plex Sans/Mono; Caveat as the grease pencil |
| The opening | the AS seal draws, "Glam By" writes on in rose, the caps set, and the black lifts as the headline rises | "Glam By" writes itself stroke by stroke, the caps track in, and the black parts like a curtain | a print develops in a tray, her name is written on its border, and the print lifts into the hero |
| Self-advancing slideshow | hero, an upward hard-edged wipe every 5.5 s | hero, a wipe with a thin rose edge; the runway rail also advances | hero, a stack of prints where the top one slides off |
| Picture beside film | home About | split hero, with photo and film frame side by side | the contact sheet |
| Pages | Home, Work, Services, About, Book (the inquiry is on Book) | Home, Portfolio, Bridal, About, Journal + 2 articles, Bridal Inquiry | the same as Maison |
| Built by | its own Astro project, `amairanymua-01-rouge/` | this generator | this generator |

All three sites share these features:

- **Inquiry beside booking:** the bridal inquiry and the event booking sit side
  by side near the top of the home page, with her About right under them.
- **Booking line:** "Now booking 2026 &amp; 2027 weddings" is near the top.
- **Her own words:** her About is quoted in the first person, as hers. Her six
  packages appear with the prices from her booking page.
- **Love Notes:** her own name for reviews. These are links to WeddingWire
  (5.0 · 31), The Knot (5.0 · 4) and Google (5.0 · 2), each dated.
- **Her links:** Instagram, TikTok and Google reviews are one tap away, in the
  same tab.

Maison and Darkroom also have:

- a **portfolio** in the shape of Leti Silva Beauty's: The Looks (a rail with
  film among stills), The Reel (film), and every look in a grid with a viewer;
- a **journal** with two sample articles, each labelled "Sample article, to be
  written with Amairany". The articles are built only from her own words:
  "How to prepare for your glam" and "Destination bride?".

### Round one: other palettes

| | 1 · Veil | 2 · Noir | 3 · The Edit |
| --- | --- | --- | --- |
| Feeling | pearl and champagne; bridal luxury | espresso black; cinematic | her link page's peach and cream, with Gulf blue |
| Type | Cormorant Garamond + Jost | Instrument Serif + DM Mono + DM Sans | Bricolage Grotesque + Newsreader italic |
| The opening | tulle layers with her **A S** monogram in champagne foil lift off the hero | her name draws itself in champagne on black, then a reel of portraits locks on | three makeup swatches paint across, her wordmark stamps on, and peach floods the page |
| Hero | one tall picture, each still unveiled under a feathered edge | a full-screen reel with cuts and slates | a story viewer: tap, hold, swipe |
| Below | a champagne aisle line down the home page | sticky full-screen scenes, wiped like film through a gate | an eyeshadow palette that switches the lookbook |

Each round-one site has seven pages: Home, About, Bridal, Services, Portfolio,
Reviews and Bridal Inquiry. All three round-one sites carry the TikTok and
Google review links too.

### After the pick

Set `PICK` in `scripts/amairanymua-01/site.mjs` to the chosen id and rebuild.
That site is then written at the demo root, and the chooser, the other sites
and the switch are no longer built.

- **Rouge** is prebuilt. It is published from its own project
  (`node scripts/publish.mjs` in `amairanymua-01-rouge/`), so picking it also
  means pointing its base at the demo root.
- **Deleting the rest:** the unchosen sites' folders, their fonts,
  `assets/css/chooser.css` and `assets/img/preview-*.webp` can then be deleted.

## Film and stills

**No video file exists in this demo.** There are four film slots, `f1`–`f4`
(`FILMS` in `site.mjs`), placed among the photographs in every site. Until a
clip exists, each slot renders as a marked plate in its site's style ("Film 01
· A bridal reel plays here · Slot · clip to come"). There is:

- no looped or animated photograph presented as film;
- no Instagram embed;
- no stock footage.

To fill a slot from a screen recording of one of her reels:

    python3 scripts/amairanymua-01-film.py <recording> --probe
    python3 scripts/amairanymua-01-film.py <recording> bridal --start 2.4 --dur 5 --crop 0:210:1179:2096 --poster-at 1.2

Then set `file: 'bridal'` and an `alt` on the slot in `site.mjs`, rebuild, and
republish Rouge. Every place that uses the slot then plays the clip: muted,
looping, inline, poster first, and still under reduced motion and Save-Data.

**The script has been run only on a synthetic test recording.** No site's
"clip present" path has been exercised with a real clip.

## Booking: her system, exactly as published

| Control | Goes to |
| --- | --- |
| **Bridal inquiry** (primary, everywhere) | the site's own inquiry page (Rouge: `book#bridal-inquiry`) |
| "Open Amairany's inquiry form" (the inquiry's last step, and its no-script fallback) | `https://form.jotform.com/252119273398160` |
| Explore Bridal Services | `https://amairanymua.as.me/?appointmentType=category:Bridal%20Services` |
| Book Event Makeup & Hair / Book event glam | `https://amairanymua.as.me/?appointmentType=category:Hair%20%26%2For%20Makeup%20%28%20Travel%2F%20In%20Studio%29` |
| "her booking page" (packages and pricing, in text) | `https://amairanymua.as.me/schedule/bea4d83a` |
| Instagram · TikTok · Google reviews | `instagram.com/amairanymua` · `tiktok.com/@amairanymua` · `g.page/r/CcFKfY0wSWDnEAE/review` |

These addresses are written once in `site.mjs`. Every link to her booking
system is made by one helper, `book()`, including in Rouge, which imports
`site.mjs` at build time. `scripts/amairanymua-01-check.mjs` fails the build if:

- any `data-book` link on any page differs from this table by a single
  character;
- any link reaches her booking hosts another way;
- any page carries a `target` attribute.

Her JotForm, Acuity, Google and TikTok pages could not be opened from the build
environment, which allows package registries and GitHub only. Their content
comes from the founder's screenshots and screen recording of 2026-11-19.
Nothing was submitted or booked.

### The bridal inquiry (demo mode)

One shared component (`scripts/amairanymua-01/inquiry-core.mjs`,
`assets/js/inquiry.js`, `assets/css/inquiry-core.css`) is skinned by each site
with CSS alone. It asks her JotForm's questions, with its answer choices, as
shown in the founder's recording, over four steps:

| Step | Questions |
| --- | --- |
| **The day** | wedding date or "not set yet", ceremony time, getting-ready location, first look ("Absolutely, DUH!" / "No"), ready-by time |
| **The glam** | her six packages or "Not sure yet", the number of guests needing makeup, the number needing hair, and inspiration |
| **Your contact** | name, email, phone, where you are in planning ("Dating around" / "Ready to commit"), how to reach you ("Email me! I never answer the phone" / "Call me!" / "Text me!"), how you heard of her, and any questions |
| **Review** | every answer, with Edit |

Then comes the hand-off:

- "Design preview: nothing was sent";
- **Open Amairany's inquiry form**, a plain link with nothing appended (photos
  are added on her form);
- **Copy my answers**;
- her promise of a proposal within 24 to 48 hours.

**Nothing typed is sent anywhere:**

- the form has no action or method;
- no script makes a network request (the checker fails the build on `fetch`,
  XHR, beacons, sockets or `form.submit()`);
- answers live only in the visitor's `sessionStorage` until "Start over";
- her form is not pre-filled.

**To confirm with her:** which questions are required (here, only name and
email), and whether a real site should deliver inquiries itself or keep
finishing on her JotForm.

## How it is built

    node scripts/amairanymua-01-build.mjs      # writes the pages and DEMO.json (add --dev to tolerate a module mid-edit)
    node scripts/amairanymua-01-check.mjs      # static safety checks; exits 1 on any failure
    (cd ../amairanymua-01-rouge && npm ci && node scripts/publish.mjs)   # rebuilds and republishes Rouge
    node scripts/amairanymua-01-bundle.mjs <site> <out.html>             # one self-contained preview file
    python3 scripts/amairanymua-01-assets.py <folder-with-the-original-photos>
    python3 scripts/amairanymua-01-film.py <recording> <name> …

| File | Holds |
| --- | --- |
| `scripts/amairanymua-01/site.mjs` | **every fact, link, photograph, look, film slot and line of shared copy**: `HER` (from her own site), `INQUIRY`, `REVIEWS`, `SITES`, `PICK`, the standard `<head>`, the preview marker |
| `scripts/amairanymua-01/inquiry-core.mjs` | the shared inquiry markup |
| `scripts/amairanymua-01/<site>/` | for each generated site: `shell.mjs`, `home.mjs`, `pages-work.mjs`, `pages-story.mjs`, `inquiry.mjs`, `index.mjs` |
| `amairanymua-01-rouge/` (repository root) | Rouge's Astro project. It reads `site.mjs` and `inquiry-core.mjs` from disk at build time (a small Vite plugin, never a copy) and publishes into `public/demo/amairanymua-01/rouge/` |
| `scripts/amairanymua-01/chooser.mjs` | the chooser (review build only) |
| `scripts/amairanymua-01-bundle.mjs` | packs one site into a single HTML file for review in chat (pages gzip+base64 in an iframe, assets as data URIs, links routed inside the file) |
| `assets/<site>/` | each site's CSS, scripts and generated art (The Edit's swatch masks, Darkroom's develop stages) |
| `assets/css/marker.css` | the preview marker (studio chrome, the same in every site) |
| `assets/fonts/` | self-hosted OFL fonts, latin subsets from the `@fontsource` packages, 5.3.0 |

The generated sites have no dependencies and no framework: plain Node writes
plain HTML, CSS and script. Rouge needs `npm ci` in its own folder. Nothing is
read from `/demo/_shared/` and nothing is shared with any other demo.

## Photographs

The founder supplied twelve images on 2026-11-18, as phone screenshots of her
Instagram posts. He stated that Amairany gave permission to use her photos and
information for this demo. The originals are not in the repository.

- **Processing:** trim, resize and WebP only. No CSS filter alters her work.
- **Develop stages:** Darkroom's opening uses generated stages of one
  photograph (light, then mid) as a transition only. Every resting image is her
  original.
- **Position:** `pos` on each photograph in `site.mjs` is where the face sits.

| File key | Note |
| --- | --- |
| `artist-brushes` | the About portrait. Founder: "this is her" |
| `artist-spotlight-crop` | Founder: "this is her". The full frame's prop reads "The Nail Times", so only a head-and-shoulders crop is used. **Confirm with her.** |
| `bride-crystal`, `bride-pearls`, `bride-gold-waves`, `bride-ruby`, `glam-sculpt`, `waves-blonde`, `glam-bronze` | heroes and portfolios |
| `wedding-florals`, `golden-hour`, `wedding-night` | wedding-day groups. `wedding-night` shows a theme-park castle; it is her call whether it stays |

The largest file is 1280 px wide, so full-bleed pictures are soft on high-DPI
wide screens. Still open: photographer credits, and whether each client is
happy to be on a website rather than only on Instagram.

## What the copy claims, and where it comes from

| On the page | Source | Status |
| --- | --- | --- |
| "Hey Gorgeous! I'm Amairany." and her About; 13 years in makeup, 4 in hair; "CAKE FREE"; Disney sets, celebrity clients, destination weddings | her booking site, from the founder's recording, 2026-11-19 | Her own words, quoted in the first person |
| Licensed &amp; insured · Central Florida | her booking site, as above | Her own words |
| The six packages and prices (The Luxe Bride 1,300; The Signature Soiree 2,600; The Luxe Gala 3,300; The Radiant Bride 750; The Luxe Glam 1,500; Glam Hair 1,500) and what each includes | her booking page, as above | Prices can change; dated "November 2026" on the page |
| Destination brides, the FAQ, how to prepare, the 24–48 hour proposal | her booking site and JotForm, as above | Her own words |
| "Now booking 2026 &amp; 2027 weddings" | the founder ("2026, 2027 bookings") | Confirm |
| Soft–full glam, glam waves, "real-life filter skin, never cakey", Orlando + Tampa | her link page and Instagram, 2026-11-18 | Her own words |
| "Since 2013", Aveda Institute 2018 (Rouge's About story, and round one) | the 2024 OrlandoVoyager interview | **Confirm** |
| WeddingWire 5.0 · 31; The Knot 5.0 · 4 (read 2026-11-18); Google 5.0 · 2 (founder's screenshot, 2026-11-19) | as stated | Counts will drift |
| Photography is a separate service, her fiancé's | her own FAQ answer and the founder, 2026-11-19 | Not listed as her service |

Not written anywhere until she confirms: any review quotation. The headings
read "Five stars, read them in full." or "Love Notes" and link to the sites.

Outside her quoted words, everything is in the third person. Headlines and
section titles are proposals. The lockups are her "Glam By AMAIRANYMUA" set as
type in a stand-in face; she has no logo file. The journal articles are
samples, labelled as such.

## Checks run, 2026-11-19

Headless Chromium only (Playwright, touch emulation for phones). **No real
iPhone, no Safari/WebKit, no Instagram in-app browser.** Frame timings come
from a shared machine with software rendering, so smoothness on a real slow
phone is unproven.

- **Build and checker:** `node scripts/amairanymua-01-build.mjs` and
  `node scripts/amairanymua-01-check.mjs`. The result at the final commit is
  recorded in the commit message.
- **Smoke tests:** each site's builders smoke-tested their pages at 320, 375,
  390, 430, 768, 1024 and 1440, and under reduced motion. They checked for:
  - horizontal overflow;
  - console errors;
  - anything left hidden;
  - broken images;
  - a booking action on the first screen.
- **Openings:** each was captured frame by frame at 390×844 and 1440×900. Each
  plays once per session, `?intro=0`/`?intro=1` work, and a wheel, tap or key
  ends it. Reduced motion and no-script show the finished page.
- **Inquiry:** walked end to end on every site. Checked:
  - validation;
  - Edit;
  - reload;
  - the hand-off link is exact;
  - Copy, read back from the clipboard;
  - Start over;
  - every request stayed on the local server.
- **JavaScript off:** every page is complete and bookable.
- **Keyboard only:** focus is visible; menus and viewers trap and release
  focus.
- **Preview files:** each was tested opened as `file://` and inside a sandboxed
  iframe (scripts only, opaque origin): every page opens, the inquiry advances
  a step, there are no errors, and no network requests are made.

## For her, before anything is sent on

1. Is the studio-spotlight photo you, and is it right for a website?
2. Photographer credits, and are all ten client photos cleared for a website?
3. Original video clips (or approval of screen recordings), each client's
   consent to appear in them, and a logo file if one exists.
4. Year you started, and whether Aveda 2018 should appear.
5. Which reviews can be quoted.
6. Which inquiry questions are required, and whether inquiries should keep
   finishing on your JotForm.
7. That the prices and "now booking 2026 &amp; 2027" are current.
