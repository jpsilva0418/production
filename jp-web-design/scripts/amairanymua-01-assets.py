#!/usr/bin/env python3
"""Image pipeline for /demo/amairanymua-01.

Source: twelve photographs the founder supplied on 2026-11-18 as phone
screenshots of Amairany's own Instagram posts (1320px wide). The originals are
NOT in the repository; pass the folder that holds them:

    python3 scripts/amairanymua-01-assets.py <folder-with-originals>

What it does, and nothing else: trims the few edge pixels a screenshot picks
up from the neighbouring carousel slide, resizes to three widths, and writes
WebP (plus one JPEG for the link preview). No retouching, no colour change,
no face editing.
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "demo" / "amairanymua-01" / "assets" / "img"
WIDTHS = (480, 800, 1280)

# upload name -> (key, extra trim (left, top, right, bottom) on top of the default 8px)
SOURCES = {
    "39c4c4f0-image.jpg": ("artist-brushes", (0, 0, 26, 0)),
    "4dc1e78d-image.jpg": ("artist-spotlight", (4, 0, 0, 0)),
    "db2b452a-image.jpg": ("glam-sculpt", (0, 0, 0, 0)),
    "c968fdcf-image.jpg": ("bride-gold-waves", (0, 0, 0, 0)),
    "c5a80d10-image.jpg": ("bride-crystal", (0, 0, 0, 0)),
    "3b83aada-image.jpg": ("wedding-florals", (0, 0, 0, 0)),
    "57fc224c-image.jpg": ("wedding-night", (0, 0, 0, 0)),
    "b139af3b-image.jpg": ("golden-hour", (8, 6, 0, 0)),
    "b53a13c8-image.jpg": ("bride-ruby", (0, 0, 0, 0)),
    "e8bc0602-image.jpg": ("glam-bronze", (0, 0, 0, 0)),
    "c3d55ffd-image.jpg": ("waves-blonde", (0, 0, 0, 0)),
    "9d228949-image.jpg": ("bride-pearls", (0, 0, 0, 0)),
}
# extra crops cut from a source (key, source key, box as fractions l,t,r,b)
CROPS = {
    # head-and-shoulders from the studio spotlight portrait; the prop she is
    # holding is left out of frame
    "artist-spotlight-crop": ("artist-spotlight", (0.40, 0.235, 0.88, 0.60)),
}


def save(im: Image.Image, key: str) -> None:
    for nominal in WIDTHS:
        w = min(nominal, im.width)  # never upscale; the file keeps its nominal name
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(OUT / f"{key}-{nominal}.webp", "WEBP", quality=80, method=6)


def main() -> None:
    src = Path(sys.argv[1])
    OUT.mkdir(parents=True, exist_ok=True)
    done = {}
    for name, (key, extra) in SOURCES.items():
        im = Image.open(src / name).convert("RGB")
        l, t, r, b = (8 + e for e in extra)
        im = im.crop((l, t, im.width - r, im.height - b))
        done[key] = im
        save(im, key)
        print(key, im.size)
    for key, (parent, (l, t, r, b)) in CROPS.items():
        p = done[parent]
        im = p.crop((round(p.width * l), round(p.height * t), round(p.width * r), round(p.height * b)))
        done[key] = im
        for w in (480, im.width):
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(OUT / f"{key}-{w}.webp", "WEBP", quality=82, method=6)
        print(key, im.size)
    # link-preview image (1200x630), cut from the bridal hero
    og = done["bride-crystal"]
    w = og.width
    h = round(w * 630 / 1200)
    top = round(og.height * 0.08)
    og.crop((0, top, w, top + h)).resize((1200, 630), Image.LANCZOS).save(OUT / "og.jpg", "JPEG", quality=84, optimize=True, progressive=True)


if __name__ == "__main__":
    main()
