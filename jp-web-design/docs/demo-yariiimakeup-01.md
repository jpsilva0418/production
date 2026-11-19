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
headline is "All eyes on you." and the site opens on her logo. On a first
visit the logo draws itself on ivory, in its own colours, in about a second.
Then its eyes open: a cat-eye widens from the logo out past every corner of
the screen, the site is behind it already moving, and the YARIIIMAKEUP line of
the logo travels up into the header and stays there. Two and a third seconds
from first paint to the finished page.

What the eye opens onto is the hero: her work in motion. On phones, ten
photographs dissolve through one full screen; on wide screens, three columns
of photographs, with the two short film clips playing in a side column. Each
picture carries a small title (Glam, Bridal, Hair, Pageant, Sweet 16), with
the headline and Book Now over it. It makes six quick
cuts as the eye opens, then settles to a slow dissolve. Stills and film are
mixed the same way in the gallery: two moving tiles among eighteen
photographs. Ivory, ink and a restrained gold are the logo's own colours.

Book Now is on screen for all of the opening. Any tap, key or scroll ends it
at once, it plays once per session, and never for reduced motion or
Save-Data. The logo drawing is CSS, so it starts with the first paint and
needs no script; if the script that ends it never loads, the curtain removes
itself after three seconds. The hero rests when it is off screen, has a pause
button, and stays on one still photograph for reduced motion. It is built
from photographs on purpose: a phone that refuses to autoplay video shows
each clip's still frame and everything else runs unchanged.

Founder direction, 2026-11-19, in three steps. First: the close-up hero
photograph was not liked, and the opening should be a cinematic launch with
her logo, after the first Sass by Kass entrance. Then: a montage of many
pictures and clips rather than one video, better pictures, and photographs
mixed with video through the page the way Leti Silva Beauty does. Then, on
seeing a six-second montage ahead of the site: turn it round. Open on the
logo, keep it short, and let the logo go into the moving pictures, which
become the hero's background.

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

Two short silent clips, `film/gown.mp4` and `film/mirror.mp4`, cut from one
9.5-second transformation reel supplied by the founder as a screen recording.
They are the two moving tiles in the gallery and play in a side column of the
desktop hero. `scripts/yariiimakeup-01-clips.py` makes them, and reproduces
the committed files byte for byte:

    python3 -I scripts/yariiimakeup-01-clips.py <reel.mov> public/demo/yariiimakeup-01/assets/film --edgefix

(then move the two `film-*.jpg` posters it writes into `assets/img/`).

**They are soft, and that is the recording, not the encoding.** Measured on
2026-11-19: the screen recording holds real detail only up to about a
500-600px-wide picture inside its 1024px frame; in the blue-dress shot her
face is about 180px wide. Stacking all 36 frames of the shot (aligned to a
few hundredths of a pixel) removed compression mottle but recovered no detail,
because the frames are near-copies of one already-compressed picture. Lowering
the encoder's compression changed nothing visible, and the denoise and deblock
filters tried either did nothing or ghosted her face. What the clips get is
one fixed sharpening of brightness only (a difference of Gaussians at source
resolution; colour is passed through untouched), about a third more edge
contrast, plus two trims: the shots no longer start or end on frames blurred
by the reel's own transitions, and a dark strip the crop left down the right
edge is gone. No AI upscaler or face restorer is used; those repaint faces.

Because of that limit they are never shown full screen: not in the phone
hero, where the blue-dress shot looked plainly blurry, only small in the
gallery and in a desktop side column. **Her original video files would fix
this properly.** A reel downloaded from her own Instagram app, or the camera
file, holds two to four times the detail of a screen recording.

The reel's bare-faced "before" shot is not used anywhere. Whose reel it is and
the client's consent to appear on a website are Yaribel's to confirm.

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
- Which of the gallery photographs are her own work, and the captions and
  categories we gave them.
- Which review excerpts she wants shown. No star rating or count is displayed.
- Service priorities, travel area, current prices (Booksy stays the source).
- Whether "Yaribel Vasquez" is the name she wants on the site.
- Spanish. Nothing is translated; no unreviewed translation is published.
- Phone number. Public on her Instagram, deliberately not on the page.

## Photographs

Eighteen photographs in the gallery, a nineteenth beside the Classes service.
They come from two places:

- **The founder's content package** (her Instagram and Booksy): `look-02`,
  `look-09`, `look-10`, `look-11`, `look-12`.
- **Her public Booksy listing**, fetched 2026-11-19. The listing publishes
  about a hundred photographs against her services; these fourteen were
  chosen. Each is at
  `https://d2zdpiztbgorvt.cloudfront.net/region1/us/844702/service_photos/<file>`:

| Name here | Booksy file |
| --- | --- |
| `bridal-profile` | `72060b99f3444ecaa90a42d86ef77d54.jpeg` |
| `bridal-bouquet` | `9c4305a6cee245b3abcfa4baae7801f2.jpeg` |
| `bridal-ring` | `71a81954dd1d408493c8eadf63320dc9.jpeg` |
| `bridal-waves` | `ed0a6f8f773d41aba145c60a6bbf3657.jpeg` |
| `soft-hairpiece` | `2d593107ff46404bb0ddfdd5e845931e.jpeg` |
| `soft-comb` | `f2a368dc401e43f08e12b81f7682e95e.jpeg` |
| `glam-teal` | `22f3d1cb0a5549f297dfd1307c348673.jpeg` |
| `glam-bronze` | `b4819f6e7d56494ba33fdc1c0fc762b3.jpeg` |
| `hair-black-waves` | `18e7aba1747b495988ba6e167f777ae3.jpeg` |
| `hair-vine` | `52c5693d2c06456889c6451f870337a9.jpeg` |
| `hair-long-waves` | `fe8eb86826914a3bb36341c64e0e1978.jpeg` |
| `sweet16-crown` | `0cd3847a0591412fb6a3e642051d6dcb.jpeg` |
| `prom-lilac` | `c5712bfd9a83482dba42415e4c454f0a.jpeg` |
| `studio-station` | `fd708f4ed3684027b3996be5b99a9bd3.jpeg` |

How they were chosen: real, well lit, one clear subject, high enough
resolution, and a spread across bridal, soft glam, full glam, hair,
Sweet 16 / prom and pageant.

Left out on purpose:

- the studio-style images whose production method and subject are unverified
  (package `05`-`08` and their matches on Booksy);
- product graphics and promotional cards;
- photographs that read as reposted inspiration rather than her own work
  (very polished editorial images at screenshot sizes). She may well have done
  them; they stay out until she says so;
- the close-up the founder did not like (package `03`);
- photographs her clients attached to their reviews.

**Everything here is hers to confirm.** Booksy does not say which photograph
belongs to which service for most of them, so the categories and captions are
our reading of what each picture shows ("Bridal" only where there is a veil,
bouquet, ring or wedding-morning robe, or where Booksy ties it to her wedding
service). Derivatives are produced by `scripts/yariiimakeup-01-assets.py`:
crop, downscale, re-encode, nothing else.

The hero uses its own tall crops (`*-tall-<height>.webp`), cut from each
source at the source's own resolution and centred on the face. The earlier
hero drew 800px squares into a tall box, which enlarged them about 2.75x on a
3x phone and was the main reason it looked soft. Measured after the change
(390px phone at 3x): the ten phone pictures are enlarged 1.34-1.79x, 1.52x on
average; on a 1440px laptop they are drawn at or below their own size. Only
four of her photographs (about 2300px tall) fill a phone at better than 1.4x;
the rest of the Booksy photographs are 1000-1440px and are kept to the gallery
and the desktop side columns. Larger originals from her would sharpen the
hero further.

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
- Her original reel, or more clips, arrive: re-run the same script; adjust the
  cut times in its films section.
- New photographs: add them to `scripts/yariiimakeup-01-assets.py`, re-run it,
  add a `<li class="look">` with its categories, and update the counts on the
  filter chips.
- The hero's moving pictures are a list: the JSON in `#montage-data` in
  `index.html`. Each beat names a picture or clip, where to centre it, its
  title, and the two pictures beside it on wide screens.
- The opening is the `.curtain` block in `index.html`, "THE OPENING" in
  `assets/css/site.css`, and "The opening" in `assets/js/site.js`. Append
  `?intro=1` to the URL to replay it, `?intro=0` to skip it.
