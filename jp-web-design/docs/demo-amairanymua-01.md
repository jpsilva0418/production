# `/demo/amairanymua-01` — Amairany Sierra, three directions

An unlisted design preview for a prospective client: Amairany Sierra
(@amairanymua), bridal hair and makeup, Orlando + Tampa. It is **not** her
official website and says so on every page (top strip and footer). `noindex`
by meta tag and by the `/demo/(.*)` header in `vercel.json`.

Founder direction, 2026-11-18: build three style previews to choose from, make
the opening cinematic, keep her own booking system, and do not repeat Sass by
Kass or YariiiMakeup.

| Page | What it is |
| --- | --- |
| `/demo/amairanymua-01` | The founder's chooser: three cards, one per direction |
| `/demo/amairanymua-01/premiere` | A · Première — night at the movies |
| `/demo/amairanymua-01/cover` | B · The Cover — her own bridal issue |
| `/demo/amairanymua-01/golden` | C · Golden Hour — warm, luminous, quiet |

Once a direction is chosen, it becomes `index.html`, the other two and the
chooser are removed, and the "n of 3" link comes out of the top strip.

## How it is built

`scripts/amairanymua-01-build.mjs` writes the four pages into
`public/demo/amairanymua-01/`. One set of facts, links and photographs feeds
all three directions, so a correction is made once. `core.css` holds the
structure; `premiere.css`, `cover.css` and `golden.css` each hold one
direction's type, colour, hero and entrance. `site.js` is one small script.
No dependencies, nothing read from `/demo/_shared/`, nothing shared with any
other demo. Fonts are self-hosted OFL files (Gloock, Antonio, Jost · Playfair
Display, Pinyon Script, DM Sans · Instrument Serif, Outfit).

    node scripts/amairanymua-01-build.mjs
    python3 scripts/amairanymua-01-assets.py <folder-with-the-original-photos>

## The three directions, and why

What the photographs have in common: warm bronzed skin with a visible glow,
espresso hair, rose-nude glossy lips, champagne and gold on the lids, black
and ivory wardrobe, plain grey walls or a real location behind. Her link page
is peach and cream with charcoal type.

- **A · Première.** Ink black, cream and the champagne of her shimmer lids.
  The page opens on a 2.39:1 letterbox across the bride's eyes with "Amairany
  Sierra presents", the bars open to the full frame and the title rises.
  After load, three more of her stills cut slowly through the hero. Sections
  are scenes, the two booking paths are ticket stubs, the reels sit in film
  frames, the footer is an end-credit roll.
- **B · The Cover.** Blush, cream and a berry lip. A camera flash, the photo
  pulls from blur into focus and "Amairany" sets as a magazine masthead. A
  spinning stamp carries her own line, "Secure your wedding day glam". The
  lookbook is taped prints with script captions; reviews are "Love Notes",
  the name she uses on her link page.
- **C · Golden Hour.** Her link page's peach and cream with a cocoa ink. The
  portrait starts in low light and a sunbeam crosses it. Arched frames, a
  masonry portfolio at the photographs' own proportions, more white space.

Kept apart from the other demos on purpose: no circle opening onto a logo
(Sass by Kass), no montage resolving into a logo and no Bodoni (YariiiMakeup).

Each entrance runs about two to three seconds, plays once per session, ends at
once on any tap, key or scroll, and never plays under reduced motion or
Save-Data. The header's Inquire button is on screen from the first frame. If
the script never loads, CSS alone finishes the entrance and a timer reveals
every section.

## Booking — her system, untouched

The site has no form. Every button is a plain link, same tab, to the
addresses on her own link page:

| Button | Goes to |
| --- | --- |
| Inquire About Your Wedding (primary, everywhere) | `https://form.jotform.com/252119273398160` |
| Explore Bridal Services | `https://amairanymua.as.me/?appointmentType=category:Bridal%20Services` |
| Book Event Makeup & Hair | `https://amairanymua.as.me/?appointmentType=category:Hair%20%26%2For%20Makeup%20%28%20Travel%2F%20In%20Studio%29` |
| "her booking page" (pricing, in text) | `https://amairanymua.as.me/schedule/bea4d83a` |

Checked 2026-11-18: every `data-book` link in all three pages matches this
table exactly (automated). The JotForm address was fetched read-only and is
titled "Bridal Inquiry Form". The Acuity pages render with JavaScript, so a
plain fetch shows only "Schedule Appointment"; the kit's own read-only check
the same day lists the categories. Nothing was submitted or booked.

## Photographs

Twelve images supplied by the founder on 2026-11-18 as phone screenshots of
her Instagram posts, with his statement that Amairany gave permission to use
her photos and information for this demo. The originals are not in the
repository. Processing is trim, resize and WebP only.

| File key | Used as | Note |
| --- | --- | --- |
| `artist-brushes` | About portrait | Founder: "this is her" |
| `artist-spotlight` (+ `-crop`) | About, small inset | Founder: "this is her". The prop in the full frame reads "The Nail Times", so only a head-and-shoulders crop is used. **Confirm with her.** |
| `bride-crystal` | Hero A, portfolio, link preview | |
| `bride-pearls` | Hero B, portfolio | |
| `glam-sculpt` | Hero C, portfolio | |
| `bride-gold-waves`, `bride-ruby`, `waves-blonde`, `glam-bronze`, `wedding-florals`, `golden-hour`, `wedding-night` | Portfolio, booking cards, closing image | `wedding-night` shows a theme-park castle; her call whether it stays |

Still open: photographer credits for the professional images, and whether
each client is happy to be on a website rather than only on Instagram.

The kit's 17 public image addresses (WeddingWire, Liinks, Acuity) could not
be fetched: this workspace's network allows only package registries and
GitHub, and all 17 returned `403` at the proxy. None of them is used.

## Film

No video files exist for this demo. The eight reel addresses in the kit are
shown as tiles; tapping one loads Instagram's own embed for that reel in a
dialog, with "Open on Instagram" beside it. Without script the tiles are
plain links to the reels. **Playback of the embeds was not tested** (no
access to instagram.com from here). When she sends original clips they go in
`assets/film/` and replace the hero stills and the tiles.

## What the copy claims, and where it comes from

| On the page | Source | Status |
| --- | --- | --- |
| "Luxury hair and makeup artist based in Florida", soft–full glam, glam waves, "real-life filter skin, never cakey", brides, events and photoshoots, "Secure your wedding day glam", à la carte / packages / custom experiences | Her link page, fetched 2026-11-18 | Her own words |
| Orlando + Tampa | Instagram display name | Her own words |
| Doing makeup since 2013; Aveda Institute Winter Park, 2018 | 2024 OrlandoVoyager interview ("around 2013") | **Confirm the year** |
| Trials, bridal party, updos | WeddingWire / Zola listings; her inquiry form asks about party size | Confirm |
| In studio or on location | Name of her Acuity category | Confirm coverage area |
| The Luxe Bride, The Signature Soiree, The Luxe Gala, The Radiant Bride | Kit's read of her Acuity page, 2026-11-18 | Names only, no prices; can change |
| WeddingWire 5.0 · 31 reviews; The Knot 5.0 · 4 reviews | Kit's read, 2026-11-18; dated on the page | Counts will drift |
| amairanysmua@gmail.com | Her link page | Published by her |

Left out until she confirms: years of experience as a number, "licensed and
insured", Puerto Rico and Greece 2027, any price, any studio address, any
review quotation, TikTok (her link page's address has no `@` and may not
resolve). The wordmark is typography only; she has no verified logo file and
the footer says the wordmark is concept styling.

Headlines are proposals: "Timeless hair. Real-life filter glam.", "Real-life
filter. Never cakey.", and the section titles.

## Checks run, 2026-11-18

Headless Chrome only. **No real iPhone or Safari was used.**

- 320, 375, 390, 430, 768, 1024 and 1440 wide, all three directions: no
  horizontal overflow; the primary booking button is inside the first screen
  at every size.
- Entrances captured frame by frame; reduced motion shows the finished page
  with nothing hidden and the marquee stopped.
- Phone menu (open, Esc, link), portfolio filter, lightbox (tap, arrows,
  wrap-around, Esc, focus returns), sticky booking bar, reel dialog.
- Keyboard: skip link first, visible focus ring on every stop.
- One `h1` per page, every image has an `alt`, no form fields, no third-party
  request on load, no link leaves `/demo/amairanymua-01` except to her own
  booking pages, her profiles and the review sites.
- `npm run build`, `npm run check:links`, `npm run check`: pass.
- Every other tracked file is byte-identical to `claude/jp-silva-digital-launch`
  at `f6ad7bd`; the only edit to an existing file is one new row in `DEMOS.md`.

## For her, before anything is sent on

1. Is the studio-spotlight photo you, and is it right for this site?
2. Photographer credits, and are all ten client photos cleared for a website?
3. Original video clips, and a logo file if one exists.
4. Year you started, and how you want experience worded.
5. Coverage area and travel; whether Puerto Rico and Greece 2027 should appear.
6. Which reviews can be quoted.
