#!/usr/bin/env python3
"""Logo layers and films for the /demo/yariiimakeup-01 design concept.

    python3 -I scripts/yariiimakeup-01-film.py <logo.jpg> <reel.mov> <path-to>/photos

Inputs (none of them is stored in this repository):
  logo.jpg   her public logo, 600x600, from her Booksy listing
  reel.mov   the transformation reel supplied by the founder (a screen recording)
  photos/    the eleven portfolio photographs from the content package

Writes into public/demo/yariiimakeup-01/assets/:
  img/logo-ink.webp, img/logo-gold.webp   the logo split into its black line
                                          art and its gold dust, both on a
                                          transparent ground
  img/logo-wordmark.webp                  the YARIIIMAKEUP line of that same
                                          logo, for the header
  img/logo-full.webp                      the whole logo on the page's ivory
  film/intro.mp4                          the opening montage (silent)
  film/hero.mp4, img/hero-film.jpg        the looping hero film and its poster

Nothing is redrawn or retouched. The logo is the published bitmap with its
cream ground removed, so it can sit on the page's ivory. The films are cuts,
crops and speed changes of the supplied reel plus stills of real portfolio
photographs; the crop also removes the editing app's corner watermark. No
audio is kept.
"""
import os
import subprocess
import sys
import tempfile

from PIL import Image

LOGO, REEL, PHOTOS = sys.argv[1:4]
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "demo", "yariiimakeup-01", "assets")
IMG = os.path.join(ROOT, "img")
FILM = os.path.join(ROOT, "film")
os.makedirs(FILM, exist_ok=True)

# ───────────────────────── logo ─────────────────────────
src = Image.open(LOGO).convert("RGB")
assert src.size == (600, 600), src.size
big = src.resize((1200, 1200), Image.LANCZOS)
BG = (245, 246, 241)  # the logo's own ground, sampled from its flat areas
px = big.load()
ink = Image.new("RGBA", big.size, (0, 0, 0, 0))
gold = Image.new("RGBA", big.size, (0, 0, 0, 0))
ip, gp = ink.load(), gold.load()
for y in range(big.height):
    for x in range(big.width):
        p = px[x, y]
        # colour-to-alpha against the ground: how far is this pixel from cream?
        a = max((BG[c] - p[c]) / BG[c] for c in range(3))
        if a < 0.07:
            continue
        a = min(1.0, a)
        col = [max(0, min(255, round(BG[c] - (BG[c] - p[c]) / a))) for c in range(3)]
        mx, mn = max(col), min(col)
        sat = 0 if mx == 0 else (mx - mn) / mx
        # the gold dust and arcs are the only saturated, warm pixels in the logo
        if sat > 0.3 and mx > 90 and col[0] >= col[2]:
            gp[x, y] = (col[0], col[1], col[2], round(a * 255))
        else:
            ip[x, y] = (col[0], col[1], col[2], round(a * 255))

ink.resize((900, 900), Image.LANCZOS).save(os.path.join(IMG, "logo-ink.webp"), "WEBP", quality=86, method=6)
gold.resize((900, 900), Image.LANCZOS).save(os.path.join(IMG, "logo-gold.webp"), "WEBP", quality=80, method=6)
# the whole logo on the page's ivory, for the footer
full = Image.new("RGBA", big.size, (245, 239, 230, 255))
full.alpha_composite(ink)
full.alpha_composite(gold)
full.convert("RGB").resize((600, 600), Image.LANCZOS).save(os.path.join(IMG, "logo-full.webp"), "WEBP", quality=88, method=6)

# The header uses the YARIIIMAKEUP line of the same bitmap. Measured on the
# 600px source: the line's ink spans x 21.5-555, y 333-389.5; 3px of air added.
WM = (18.5, 330.0, 558.0, 392.5)
word = ink.crop(tuple(round(v * 2) for v in WM))
word = word.resize((720, round(word.height * 720 / word.width)), Image.LANCZOS)
word.save(os.path.join(IMG, "logo-wordmark.webp"), "WEBP", quality=94, method=6)
print("wordmark", word.size, "box fractions", [round(v / 600, 5) for v in WM])

# ───────────────────────── films ─────────────────────────
W, H = 720, 1180
CROP = "crop=1024:1680:24:48"  # trims the editing app's watermark and the recording's edge
tmp = tempfile.mkdtemp()


def run(args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error"] + args, check=True)


def clip(name, ss, to, speed, extra=""):
    out = os.path.join(tmp, name + ".mp4")
    vf = f"trim=start={ss}:end={to},setpts=(PTS-STARTPTS)/{speed},{CROP},scale={W}:{H}:flags=lanczos,fps=30{extra},format=yuv420p"
    run(["-i", REEL, "-an", "-vf", vf, "-c:v", "libx264", "-crf", "14", "-preset", "fast", out])
    return out


def still(name, photo, cx, frames, box=None):
    """A portfolio photograph as a few frames, cropped to the film's shape around the face."""
    im = Image.open(os.path.join(PHOTOS, photo)).convert("RGB")
    if box:
        im = im.crop(tuple(round(v * s) for v, s in zip(box, (im.width, im.height, im.width, im.height))))
    cw = min(im.width, round(im.height * W / H))
    ch = round(cw * H / W)
    left = max(0, min(im.width - cw, round(im.width * cx - cw / 2)))
    im = im.crop((left, 0, left + cw, ch)).resize((W, H), Image.LANCZOS)
    png = os.path.join(tmp, name + ".png")
    im.save(png)
    out = os.path.join(tmp, name + ".mp4")
    run(["-loop", "1", "-t", str(frames / 30), "-i", png, "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "14", "-preset", "fast", out])
    return out


# The opening: ring light, the bare-faced beat, a flash, the finished look,
# a strobe of portfolio looks, and the mirror shot.
parts = [
    clip("a-ring", 0.55, 1.45, 2.6, ",fade=t=in:st=0:d=0.12"),
    clip("b-before", 3.5, 4.6, 1.9),
    clip("c-gown", 5.85, 6.85, 1.0, ",fade=t=in:st=0:d=0.22:color=white"),
    still("d1", "12-instagram-portfolio.jpeg", 0.63, 4),
    still("d2", "02-booksy-portfolio.jpeg", 0.56, 4, (0, 0.035, 1, 1)),
    still("d3", "10-instagram-portfolio.jpeg", 0.5, 4, (0.03, 0, 0.97, 0.965)),
    still("d4", "09-booksy-portfolio.jpeg", 0.55, 4),
    still("d5", "04-booksy-portfolio.jpeg", 0.42, 4),
    clip("e-mirror", 7.45, 8.5, 1.15),
]
lst = os.path.join(tmp, "list.txt")
open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
run(["-f", "concat", "-safe", "0", "-i", lst, "-an", "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
     "-crf", "25", "-preset", "slow", "-movflags", "+faststart", os.path.join(FILM, "intro.mp4")])

# The hero loop: the finished look and the mirror shot, slowed and cross-faded so
# the last frame meets the first.
a = clip("h-gown", 5.85, 6.95, 0.5)
b = clip("h-mirror", 7.45, 8.55, 0.5)
loop = os.path.join(tmp, "loop.mp4")
run(["-i", a, "-i", b, "-i", a, "-filter_complex",
     "[0][1]xfade=transition=fade:duration=0.5:offset=1.7[x];[x][2]xfade=transition=fade:duration=0.5:offset=3.4,trim=start=0.5:end=3.9,setpts=PTS-STARTPTS,scale=540:-2:flags=lanczos,format=yuv420p",
     "-an", "-c:v", "libx264", "-profile:v", "high", "-crf", "27", "-preset", "slow", "-movflags", "+faststart", os.path.join(FILM, "hero.mp4")])
run(["-ss", "0", "-i", os.path.join(FILM, "hero.mp4"), "-frames:v", "1", "-q:v", "4", os.path.join(IMG, "hero-film.jpg")])

for f in ("intro.mp4", "hero.mp4"):
    p = os.path.join(FILM, f)
    d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout.strip()
    print(f, round(os.path.getsize(p) / 1024), "KB", d, "s")
