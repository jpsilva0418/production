# `/demo/yariiimakeup-01` — YariiiMakeup, concept 01 "First Look"

An unlisted design concept for a prospective client: YariiiMakeup, a makeup and
hair artist in Poinciana / Kissimmee, Florida. It is **not** her official
website, she has not commissioned or endorsed it, and it says so on the page
(top strip and footer). `noindex` by meta tag and by the `/demo/(.*)` header in
`vercel.json`.

Hand-built static files in `public/demo/yariiimakeup-01/`. No build step, no
dependencies, nothing shared with any other demo: its fonts, images, CSS and
script all live in its own folder, and it reads nothing from `/demo/_shared/`.

## The direction, in one paragraph

Her logo is a pair of winged-liner eyes and her strongest work is the sculpted
eye, so the site is built on that. The page opens as a cat-eye-shaped window
onto the eyes of a real portfolio photograph; a liner stroke draws along the
lid and flicks into a wing; the eye opens into the full face and the headline,
"All eyes on you.", sets in. About 1.9 seconds, never in front of a booking
button, skipped for repeat visits and for reduced motion. Ivory, ink and a
restrained gold follow the black/cream/gold of her logo; the only other colour
is sampled from her own photographs.

Two directions were considered and dropped:

- **Plum / oxblood luxe** (suggested in the first brief). Nothing in her logo
  is plum, and the one deep red in the portfolio is a lip colour on one look.
  A palette built on it would have been our taste, not her brand.
- **Spotlight reveal**, from the round studio spotlight in look 05. Striking,
  but a circle opening onto a logo is the Sass by Kass entrance, and it is one
  photograph's idea rather than hers.

## What is verified, proposed, and pending

**Verified from her public sources** (as collected in the founder's package,
2026-11-17/18): the name YariiiMakeup; Instagram `@yariiimakeup` with display
name Yaribel Vasquez; Poinciana on Instagram and Kissimmee on Booksy; the
booking link `https://yarimakeup.booksy.com/`; the service names used in the
Services section; the three review excerpts and their sources; the Reel URL.

**Proposed creative copy** (ours, for her approval): every headline, the hero
line, the service descriptions, the look titles in the gallery.

**Pending her approval or input**

- Her logo. The page uses a temporary typographic wordmark and says so.
- Portrait and biography. Both are visible, labelled placeholders. Nothing has
  been written on her behalf.
- Photo selection, usage rights and photographer credits for every image.
- Bridal portfolio images. None of the supplied photographs is bridal, so the
  gallery has no Bridal filter; a concept note marks where it goes.
- Which review excerpts she wants shown. No star rating or count is displayed.
- Service priorities, travel area, current prices (Booksy stays the source).
- Whether "Yaribel Vasquez" is the name she wants on the site.
- Spanish. Nothing is translated; no unreviewed translation is published.
- Phone number. Public on her Instagram, deliberately not on the page.

## Photographs

Eleven sources were supplied. Seven are used; four are not.

| Look | Source file | Where | Notes |
| --- | --- | --- | --- |
| 01 | `03-booksy-portfolio` | hero, gallery, services | highest-resolution source; hero uses two art-directed crops |
| 02 | `12-instagram-portfolio` | gallery, hero satellite | pageant client; her caption covers makeup and styling |
| 03 | `10-instagram-portfolio` | gallery, services | her caption: makeup and blowout; Instagram's blurred padding trimmed |
| 04 | `02-booksy-portfolio` | gallery | black bar baked into the top of the source trimmed |
| 05 | `09-booksy-portfolio` | gallery, services, hero satellite | studio photograph; photographer credit needed |
| 06 | `11-instagram-portfolio` | gallery | pageant client; tagged makeup only |
| 07 | `04-booksy-portfolio` | gallery, services | |

**Not used: `05`, `06`, `07`, `08`.** These are studio-style images whose
production method and subject are unverified (the package's manifest flags them
the same way). A makeup portfolio has to show makeup that was really applied,
so they stay out until Yaribel says what they are. None is presented as her
portrait.

Derivatives are produced by `scripts/yariiimakeup-01-assets.py`: crop,
downscale, re-encode. No retouching, grading, sharpening or upscaling.

The three small dots beside each look are its lip, lid and glow tones, read
from the pixels of that photograph. They are colour samples, not product
shades, and the lightbox says so.

## Booking

Every booking control is a plain link to `https://yarimakeup.booksy.com/`,
opening in the same tab (the one-tap handoff that proved right for in-app
browsers on Sass by Kass). There are fourteen: header, mobile menu, hero,
after the gallery, four services plus "every service", the artist facts, the
lightbox, the final section, the footer, and a sticky dock on phones. No
service-level deep links are used because none has been confirmed. There is no
form on the page and nothing is collected or sent.

## The Reel

Instagram's official embed (`blockquote.instagram-media` + `embed.js`), loaded
only when the visitor presses play, so the page makes no third-party request on
load. If Instagram's script fails or has not produced a player within nine
seconds, the panel swaps to a "Watch on Instagram" fallback. No video file is
hosted, downloaded or extracted.

## Changing it

- Logo arrives: replace the `.wm` markup in `index.html` (header and footer)
  and remove the wordmark sentence from the footer note.
- New photographs: add them to the script's `LOOKS`, re-run it, and add a
  `<li class="look">` with its categories and sampled tones. Update the counts
  on the filter chips.
- The opening is all CSS under `html.opening` in `assets/css/site.css`. Append
  `?intro=1` to the URL to replay it, `?intro=0` to skip it.
