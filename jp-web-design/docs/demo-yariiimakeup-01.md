# `/demo/yariiimakeup-01` — YariiiMakeup, concept 01 "All eyes on you"

An unlisted design concept for a prospective client: YariiiMakeup, a makeup and
hair artist in Poinciana / Kissimmee, Florida. It is **not** her official
website, she has not commissioned or endorsed it, and it says so on the page
(top strip and footer). `noindex` by meta tag and by the `/demo/(.*)` header in
`vercel.json`.

Hand-built static files in `public/demo/yariiimakeup-01/`. No build step, no
dependencies, nothing shared with any other demo: its fonts, images, CSS and
script all live in its own folder, and it reads nothing from `/demo/_shared/`.

## The direction, in one paragraph

Her logo is a pair of winged-liner eyes, so the site is built on that: the
headline is "All eyes on you." and the opening ends on her logo. On a first
visit a short silent film of her work plays full screen (ring light, the
bare-faced beat, a flash, the finished look, a strobe of portfolio looks, the
mirror shot). A cat-eye of light opens over it, her logo draws itself in its
own colours, and the YARIIIMAKEUP line of that logo travels up into the header
and stays there. The hero behind it is the same work on film: full screen
under the headline on phones, in a tall frame beside it on desktop. Ivory, ink
and a restrained gold are the logo's own colours.

The opening runs about 6.4 seconds (film 3.5, logo 1.9, handoff 0.9). Book Now
is on screen for all of it. Any tap, key or scroll ends it at once, there is a
Skip control, it plays once per session, and it never plays for reduced motion
or Save-Data. If the film cannot play (autoplay refused, file unreachable) the
opening goes straight to the logo; if the script never loads, the curtain
removes itself.

This replaced the first revision's opening (a cat-eye window onto a close-up
portfolio photograph) at the founder's direction on 2026-11-19: the close-up
was not liked, and the brief became a cinematic launch that resolves into her
logo, after the first Sass by Kass entrance.

Directions considered and dropped:

- **Plum / oxblood luxe** (suggested in the first brief). Nothing in her logo
  is plum, and the one deep red in the portfolio is a lip colour on one look.
- **Spotlight reveal**, from the round studio spotlight in one photograph. A
  circle opening onto a logo is the Sass by Kass entrance.

## Her logo

The public copy from her Booksy listing, 600x600 JPEG: two eyes in winged
liner, YARIIIMAKEUP, "Yaribel vasquez" in script, a rule, "Profesional makeup
artist", gold dust on cream. It is used as published. Nothing is redrawn:

- `logo-ink.webp` and `logo-gold.webp` are the same bitmap with its cream
  ground removed and split into black line art and gold dust, so the logo can
  sit on the page's ivory and draw itself in the opening.
- `logo-wordmark.webp` is the YARIIIMAKEUP line cut from that bitmap, for the
  header, where the whole square logo would be too small to read.
- `logo-full.webp` is the whole logo on ivory, for the footer.

600px is enough for these sizes and no more. Her master file (vector or a
large PNG) is still needed, and "Profesional" is spelled as in her logo.

## The films

Both are cut from one 9.5-second transformation reel supplied by the founder
as a screen recording (`scripts/yariiimakeup-01-film.py` documents every cut):

- `film/intro.mp4`, 3.5s, the opening montage: reel footage plus five real
  portfolio photographs as a strobe.
- `film/hero.mp4`, 3.4s, the looping hero: the finished look and the mirror
  shot, slowed, cross-faded so the loop has no seam.

Silent. The crop removes the editing app's corner watermark. The reel shows a
client before and after her makeup; that is her own transformation, not an
effect made here. Whose reel it is, and the client's consent to appear on a
website, are Yaribel's to confirm, and her original file would look
considerably better than a screen recording.

## What is verified, proposed, and pending

**Verified from her public sources** (as collected in the founder's package,
2026-11-17/18): the name YariiiMakeup; Instagram `@yariiimakeup` with display
name Yaribel Vasquez; Poinciana on Instagram and Kissimmee on Booksy; the
booking link `https://yarimakeup.booksy.com/`; the service names used in the
Services section; the three review excerpts and their sources; the Reel URL.

**Proposed creative copy** (ours, for her approval): every headline, the hero
line, the service descriptions, the look titles in the gallery.

**Pending her approval or input**

- Her logo's master file, and her say on how it is used.
- The reel: that it is hers to use, the client's consent, and the original file.
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
| 01 | `10-instagram-portfolio` | gallery lead, services, opening film | her caption: makeup and blowout; Instagram's blurred padding trimmed |
| 02 | `12-instagram-portfolio` | gallery, hero still, opening film | pageant client; her caption covers makeup and styling |
| 03 | `04-booksy-portfolio` | gallery, services, opening film | |
| 04 | `02-booksy-portfolio` | gallery, opening film | black bar baked into the top of the source trimmed |
| 05 | `09-booksy-portfolio` | gallery, services, hero still, opening film | studio photograph; photographer credit needed |
| 06 | `03-booksy-portfolio` | gallery, services | no longer the hero or the gallery lead: the founder did not like the close-up |
| 07 | `11-instagram-portfolio` | gallery | pageant client; tagged makeup only |

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

- Logo master arrives: re-run `scripts/yariiimakeup-01-film.py` with it (the
  band and wordmark measurements in the script and in `site.css` assume the
  same artwork at 600px).
- Her original reel arrives: re-run the same script with it; adjust the cut
  times at the top of the films section.
- New photographs: add them to `scripts/yariiimakeup-01-assets.py`, re-run it,
  and add a `<li class="look">` with its categories and sampled tones. Update
  the counts on the filter chips.
- The opening is the `.curtain` block in `index.html`, "THE OPENING" in
  `assets/css/site.css`, and the intro section of `assets/js/site.js`. Append
  `?intro=1` to the URL to replay it, `?intro=0` to skip it.
