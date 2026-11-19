#!/usr/bin/env python3
"""Photograph derivatives for the /demo/yariiimakeup-01 design concept.

    python3 -I scripts/yariiimakeup-01-assets.py <package>/photos <booksy-photos>

Two source folders, neither stored in this repository:
  <package>/photos   the eleven photographs in the founder's content package
  <booksy-photos>    photographs published on her public Booksy listing
                     (services and portfolio), saved under the short names
                     below; docs/demo-yariiimakeup-01.md lists each address

Only geometric operations are applied: crop, downscale, re-encode. No
retouching, colour grading, sharpening or upscaling: the makeup and hair in
every image are exactly what the source shows.

Not used, on purpose: the studio-style images whose production method and
subject are unverified, product graphics, photographs that read as reposted
inspiration rather than her own work, and photographs her clients attached
to their reviews.
"""
import os
import sys
from PIL import Image

PKG, BOOKSY = sys.argv[1:3]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "demo", "yariiimakeup-01", "assets", "img")
os.makedirs(OUT, exist_ok=True)

# name -> (folder, source file, display crop as fractions x0,y0,x1,y1)
LOOKS = {
    # from the content package (her Instagram and Booksy)
    "look-02": (PKG, "02-booksy-portfolio.jpeg", (0.0, 0.035, 1.0, 1.0)),      # black bar baked into the top
    "look-09": (PKG, "09-booksy-portfolio.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "look-10": (PKG, "10-instagram-portfolio.jpeg", (0.03, 0.0, 0.97, 0.965)),  # Instagram's blurred padding
    "look-11": (PKG, "11-instagram-portfolio.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "look-12": (PKG, "12-instagram-portfolio.jpeg", (0.0, 0.0, 1.0, 1.0)),
    # from her public Booksy listing
    "bridal-waves": (BOOKSY, "bridal-waves.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "bridal-bouquet": (BOOKSY, "bridal-bouquet.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "bridal-profile": (BOOKSY, "bridal-profile.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "bridal-ring": (BOOKSY, "bridal-ring.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "soft-hairpiece": (BOOKSY, "soft-hairpiece.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "soft-comb": (BOOKSY, "soft-comb.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "glam-teal": (BOOKSY, "glam-teal.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "glam-bronze": (BOOKSY, "glam-bronze.jpeg", (0.06, 0.0, 0.94, 0.88)),       # a player icon in the corner
    "hair-black-waves": (BOOKSY, "hair-black-waves.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "hair-vine": (BOOKSY, "hair-vine.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "hair-long-waves": (BOOKSY, "hair-long-waves.jpeg", (0.09, 0.06, 0.97, 0.94)),  # black bars at the sides
    "sweet16-crown": (BOOKSY, "sweet16-crown.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "prom-lilac": (BOOKSY, "prom-lilac.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "studio-station": (BOOKSY, "studio-station.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "hair-bride-back": (BOOKSY, "hair-bride-back.jpeg", (0.0, 0.0, 1.0, 1.0)),       # hero only
}
HERO_ONLY = {"hair-bride-back"}

# Tall crops for the full-bleed hero, cut from the source at its own resolution.
# The hero fills a tall box; drawing a square derivative into it enlarges the
# picture to the box height (about 2.75x on a 3x phone with an 800px square).
# These keep the full height of the source and only trim the sides, centred on
# the face, so a 2340px source fills a phone at 1:1. Two sizes: 1000px tall for
# ordinary screens, and the source's own height (up to 1800px) for dense ones.
# name -> horizontal centre of the face, as a fraction of the cropped picture
TALL = {
    "glam-teal": 0.48, "bridal-profile": 0.56, "soft-comb": 0.34, "look-10": 0.50, "look-09": 0.55,
    "hair-black-waves": 0.42, "soft-hairpiece": 0.52, "bridal-ring": 0.58, "look-12": 0.64, "prom-lilac": 0.50,
    "hair-long-waves": 0.55, "hair-vine": 0.44, "look-11": 0.36, "bridal-bouquet": 0.50, "look-02": 0.56,
    "sweet16-crown": 0.50, "glam-bronze": 0.56, "bridal-waves": 0.50, "hair-bride-back": 0.45, "studio-station": 0.40,
}
TALL_ASPECT = 0.62  # width / height
WIDTHS = (480, 800, 1200)


def crop(im, box):
    w, h = im.size
    return im.crop((round(w * box[0]), round(h * box[1]), round(w * box[2]), round(h * box[3])))


def save(im, name):
    made = []
    for w in WIDTHS:
        w = min(w, im.width)
        if w in made:
            continue
        made.append(w)
        im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=80, method=6)
    w = min(800, im.width)
    im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(os.path.join(OUT, f"{name}-{w}.jpg"), "JPEG", quality=82, optimize=True, progressive=True)
    return made, im.size


def save_tall(im, name, fx):
    w, h = im.size
    cw = min(w, round(h * TALL_ASPECT))
    left = max(0, min(w - cw, round(w * fx - cw / 2)))
    tall = im.crop((left, 0, left + cw, h))
    made = []
    for th in (min(1000, tall.height), min(1800, tall.height)):
        if th in made or (th > 1000 and th < 1300):
            continue  # never enlarged; a second size only where the source is genuinely taller
        made.append(th)
        tw = round(tall.width * th / tall.height)
        tall.resize((tw, th), Image.LANCZOS).save(os.path.join(OUT, f"{name}-tall-{th}.webp"), "WEBP", quality=82, method=6)
    return made, tall.size


for name, (folder, f, box) in LOOKS.items():
    im = crop(Image.open(os.path.join(folder, f)).convert("RGB"), box)
    if name not in HERO_ONLY:
        print(name, *save(im, name))
    if name in TALL:
        print(name, "tall", *save_tall(im, name, TALL[name]))
