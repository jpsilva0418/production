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
}
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


for name, (folder, f, box) in LOOKS.items():
    im = crop(Image.open(os.path.join(folder, f)).convert("RGB"), box)
    print(name, *save(im, name))
