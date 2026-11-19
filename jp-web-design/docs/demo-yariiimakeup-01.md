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
visit a montage of her work cuts across the screen: eleven beats of
photographs and three short clips, each titled with what it is (Glam, Bridal,
Hair, Pageant, Events, Sweet 16). Phones get one full-screen column; wide
screens get three columns cutting together, thirty-one photographs in under
four seconds. A cat-eye of light opens over it, her logo draws itself in its
own colours, and the YARIIIMAKEUP line of that logo travels up into the header
and stays there. Stills and film are mixed through the page the same way: a
film hero, and two moving tiles among the eighteen photographs of the gallery.
Ivory, ink and a restrained gold are the logo's own colours.

The opening runs about 6.5 seconds (montage 3.9, logo 1.6, handoff 0.9). Book
Now is on screen for all of it. Any tap, key or scroll ends it at once, there
is a Skip control, it plays once per session, and it never plays for reduced
motion or Save-Data. The montage is mostly photographs on purpose: if a phone
refuses to autoplay video, the clips simply show their still frame and the
montage runs unchanged. If pictures are slow it starts anyway after 1.6
seconds; if the script never loads, the curtain removes itself.

Founder direction, 2026-11-19, in two steps. First: the close-up hero
photograph was not liked, and the opening should be a cinematic launch that
resolves into her logo, after the first Sass by Kass entrance. Then: make it
a montage of many pictures and clips rather than one video, pull better
pictures, and mix photographs with video through the page the way Leti Silva
Beauty does.

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

All cut from one 9.5-second transformation reel supplied by the founder as a
screen recording (`scripts/yariiimakeup-01-film.py` documents every cut):

- `film/ring.mp4`, `gown.mp4`, `mirror.mp4`: three short silent clips. They
  are the film beats of the opening montage and, slowed, the two moving tiles
  in the gallery.
- `film/hero.mp4`: the looping hero, the finished look and the mirror shot
  cross-faded so the loop has no seam.

Silent. The crop removes the editing app's corner watermark. The reel's
bare-faced "before" shot is not used anywhere. Whose reel it is and the
client's consent to appear on a website are Yaribel's to confirm, and her
original files would look considerably better than a screen recording. More
clips would make the montage and the gallery richer: Instagram could not be
reached from the build environment, so the only video is this one reel.

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
- The montage is a list: the JSON in `#montage-data` in `index.html`. Each beat
  names a picture or clip, its length, where to centre it, its title, and the
  two pictures beside it on wide screens.
- The opening is the `.curtain` block in `index.html`, "THE OPENING" in
  `assets/css/site.css`, and the intro section of `assets/js/site.js`. Append
  `?intro=1` to the URL to replay it, `?intro=0` to skip it.
