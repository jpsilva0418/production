#!/usr/bin/env python3
"""Media pipeline for /demo/amairanymua-01, round three (2026-11-19).

Source: the founder's media pack for Amairany ("amairanymua-media"), collected from her public
TikTok and her booking page: 14 silent clips (H.264, 576x1024, the last ~12 s of each post),
stills pulled from them, and her own branded graphics. The pack is NOT in the repository; pass
its folder:

    python3 -I scripts/amairanymua-01-media.py <media-folder>

What it does, and nothing else:
  * stills  -> assets/img/<key>-480.webp and -576.webp (resize + WebP; no retouching)
  * clips   -> assets/film/<name>.mp4 (re-encoded H.264, silent, faststart, 576 wide) and
               assets/film/<name>.jpg (its poster: one frame of the same clip)
  * her director's-chair portrait, cut from her own "About" graphic (B3), on its white ground
    and as a transparent cut-out (near-white keyed to alpha, feathered), at 480/800 wide.
Nothing is generated, beautified or recoloured.
"""
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "public" / "demo" / "amairanymua-01" / "assets" / "img"
FILM = ROOT / "public" / "demo" / "amairanymua-01" / "assets" / "film"

# still file (in stills/) -> photo key
STILLS = {
    "01_pinned_copper-hair-glam_1.6M_f97.jpg": "reel-copper",
    "03_pinned_transformation_1.1M_f97.jpg": "reel-red-waves",
    "04_bride-veil-glam-reveal_f97.jpg": "reel-veil-reveal",
    "05_bride-robe-to-dress-reveal_f97.jpg": "reel-bride-gown",
    "06_bride-glam-reveal-deep-skin_f97.jpg": "reel-bride-pearls-updo",
    "07_bride-soft-glam-deep-skin_f55.jpg": "reel-final-touch",
    "08_bride-reactions-burgundy-hair_f97.jpg": "reel-burgundy",
    "09_early-bridal-morning-veil_f96.jpg": "reel-morning-veil",
    "10_bridesmaids-hairstyles_f55.jpg": "reel-bridesmaid-half-up",
    "10_bridesmaids-hairstyles_f80.jpg": "reel-bridesmaid-waves",
    "11_curly-updo_f97.jpg": "reel-curly-updo",
    "12_pink-hair-transformation_f8.jpg": "reel-pink",
    "14_editorial-glam-makeup_f93.jpg": "reel-editorial",
}

# round four (2026-11-19): more of her work. More frames from her clips, and the client photos inside
# her own booking-page graphics (price sheet B4, service tiles B2, FAQ page B5). Her fiancé's film
# photography tiles in B2 are NOT used: that is his work, not hers. One B4 photo (The Radiant Bride)
# is the same bride as `bride-crystal`, and its Glam Hair photo is the same look as tile-event-glam:
# both skipped. Frames with her burned-in captions are skipped too.
STILLS_MORE = {
    "01_pinned_copper-hair-glam_1.6M_f55.jpg": "reel-copper-2",
    "06_bride-glam-reveal-deep-skin_f85.jpg": "reel-pearls-updo-2",
    "08_bride-reactions-burgundy-hair_f80.jpg": "reel-burgundy-2",
    "09_early-bridal-morning-veil_f99.jpg": "reel-morning-veil-2",
    "10_bridesmaids-hairstyles_f20.jpg": "reel-bridesmaid-updo",
    "11_curly-updo_f90.jpg": "reel-curly-updo-2",
    "12_pink-hair-transformation_f97.jpg": "reel-pink-2",
    "14_editorial-glam-makeup_f98.jpg": "reel-editorial-2",
}
# graphic -> {key: (left, top, right, bottom) in source pixels}
BRAND_CROPS = {
    "B4_bridal-packages-price-sheet.jpg": {
        "sheet-luxe-bride": (34, 403, 296, 740),
        "sheet-signature": (664, 804, 946, 1145),
        "sheet-luxe-gala": (34, 1227, 306, 1569),
        "sheet-luxe-glam": (1022, 704, 1286, 1057),
    },
    "B2_service-categories_bridal-engagement-eventglam-film.jpg": {
        "tile-bridal": (44, 38, 454, 652),
        "tile-engagement": (505, 38, 913, 652),
        "tile-event-glam": (982, 42, 1441, 656),
    },
    "B5_faqs-how-to-prepare.jpg": {
        "studio-waves": (1066, 136, 1999, 1408),
        "studio-updo": (0, 1965, 709, 2866),
    },
}

# clip file (in videos/) -> (film name, poster time in seconds)
CLIPS = {
    "04_bride-veil-glam-reveal.mp4": ("veil-reveal", 6.0),
    "01_pinned_copper-hair-glam_1.6M.mp4": ("copper-glam", 9.0),
    "07_bride-soft-glam-deep-skin.mp4": ("final-moments", 4.0),
    "05_bride-robe-to-dress-reveal.mp4": ("robe-to-gown", 11.0),
    "06_bride-glam-reveal-deep-skin.mp4": ("pearls-reveal", 11.5),
    "08_bride-reactions-burgundy-hair.mp4": ("bride-reaction", 11.0),
    "09_early-bridal-morning-veil.mp4": ("morning-veil", 11.5),
    "10_bridesmaids-hairstyles.mp4": ("bridesmaids", 6.5),
    "11_curly-updo.mp4": ("curly-updo", 11.5),
    "12_pink-hair-transformation.mp4": ("pink-transformation", 1.0),
    "13_pink-hair-glam.mp4": ("pink-glam", 1.0),
    "14_editorial-glam-makeup.mp4": ("editorial-glam", 11.0),
    "03_pinned_transformation_1.1M.mp4": ("transformation", 11.5),
    "02_pinned_copper-hair-glam_1.5M.mp4": ("copper-finish", 5.0),
}


def stills(src: Path) -> None:
    for name, key in STILLS.items():
        im = Image.open(src / "stills" / name).convert("RGB")
        for w in (480, 576):
            out = im if im.width == w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            out.save(IMG / f"{key}-{w}.webp", "WEBP", quality=84, method=6)
        print("still", key, im.size)


def portrait(src: Path) -> None:
    im = Image.open(src / "brand-images" / "B3_about-amairany-portrait-and-bio.jpg").convert("RGB")
    cut = im.crop((100, 130, 900, 960))  # the chair and her, nothing of the text beside it
    # near-white -> transparent, with a soft edge so the outline does not fringe on cream
    g = cut.convert("L")
    alpha = g.point(lambda v: 0 if v > 244 else (255 if v < 226 else int((244 - v) * 255 / 18)))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))
    rgba = cut.copy()
    rgba.putalpha(alpha)
    for w in (480, 800):
        h = round(cut.height * w / cut.width)
        cut.resize((w, h), Image.LANCZOS).save(IMG / f"artist-chair-{w}.webp", "WEBP", quality=86, method=6)
        rgba.resize((w, h), Image.LANCZOS).save(IMG / f"artist-chair-cut-{w}.webp", "WEBP", quality=86, method=6)
    print("portrait", cut.size)


def clips(src: Path) -> None:
    FILM.mkdir(parents=True, exist_ok=True)
    for name, (key, at) in CLIPS.items():
        inp = src / "videos" / name
        mp4 = FILM / f"{key}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(inp), "-an", "-vf", "scale=576:-2",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "31", "-pix_fmt", "yuv420p",
                        "-movflags", "+faststart", str(mp4)], check=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(at), "-i", str(inp), "-frames:v", "1",
                        "-vf", "scale=576:-2", "-q:v", "4", str(FILM / f"{key}.jpg")], check=True)
        print("clip", key, mp4.stat().st_size // 1024, "kB")


def more(src: Path) -> None:
    for name, key in STILLS_MORE.items():
        im = Image.open(src / "stills" / name).convert("RGB")
        for w in (480, 576):
            out = im if im.width == w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            out.save(IMG / f"{key}-{w}.webp", "WEBP", quality=84, method=6)
        print("still", key)
    for graphic, crops in BRAND_CROPS.items():
        g = Image.open(src / "brand-images" / graphic).convert("RGB")
        for key, box in crops.items():
            im = g.crop(box)
            widths = sorted({w for w in (480, 800) if w < im.width} | {im.width})
            for w in widths:
                out = im if im.width == w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
                out.save(IMG / f"{key}-{w}.webp", "WEBP", quality=86, method=6)
            print("crop", key, im.size, widths)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    folder = Path(sys.argv[1])
    stills(folder)
    portrait(folder)
    more(folder)
    if "--no-clips" not in sys.argv:
        clips(folder)
