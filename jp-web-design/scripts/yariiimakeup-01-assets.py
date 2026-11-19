#!/usr/bin/env python3
"""Image derivatives for the /demo/yariiimakeup-01 design concept.

Reads the 11 source photographs from the founder's content package and writes
web derivatives into public/demo/yariiimakeup-01/assets/img/.

Only geometric operations are applied: crop, downscale, re-encode. No
retouching, colour grading, sharpening or upscaling: the makeup in every
image is exactly what the source shows.

    python3 -I scripts/yariiimakeup-01-assets.py <path-to>/photos

Seven of the eleven sources are used. 05, 06, 07 and 08 are studio-style
images whose production method and subject are unverified (see the asset
manifest), so they are not presented as portfolio work.
"""
import os
import sys
from PIL import Image

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "demo", "yariiimakeup-01", "assets", "img")
os.makedirs(OUT, exist_ok=True)

# name -> (source file, display crop as fractions x0,y0,x1,y1)
# 02: trims the black bar that is baked into the top of the source.
# 10: trims the blurred padding Instagram added at the sides and bottom.
LOOKS = {
    "look-02": ("02-booksy-portfolio.jpeg", (0.0, 0.035, 1.0, 1.0)),
    "look-03": ("03-booksy-portfolio.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "look-04": ("04-booksy-portfolio.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "look-09": ("09-booksy-portfolio.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "look-10": ("10-instagram-portfolio.jpeg", (0.03, 0.0, 0.97, 0.965)),
    "look-11": ("11-instagram-portfolio.jpeg", (0.0, 0.0, 1.0, 1.0)),
    "look-12": ("12-instagram-portfolio.jpeg", (0.0, 0.0, 1.0, 1.0)),
}
WIDTHS = (480, 800, 1200, 1600)

def crop(im, box):
    w, h = im.size
    return im.crop((round(w * box[0]), round(h * box[1]), round(w * box[2]), round(h * box[3])))


def save(im, name, widths, jpg_width):
    made = []
    for w in widths:
        if w > im.width:
            w = im.width
        if any(m == w for m in made):
            continue
        made.append(w)
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=80, method=6)
    w = min(jpg_width, im.width)
    r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    r.save(os.path.join(OUT, f"{name}-{w}.jpg"), "JPEG", quality=82, optimize=True, progressive=True)
    return made, w, im.size


for name, (f, box) in LOOKS.items():
    im = crop(Image.open(os.path.join(SRC, f)).convert("RGB"), box)
    print(name, *save(im, name, WIDTHS, 800))
