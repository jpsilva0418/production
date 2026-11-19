#!/usr/bin/env python3
"""Logo layers for the /demo/yariiimakeup-01 design concept.

    python3 -I scripts/yariiimakeup-01-film.py <logo.jpg>

Input (not stored in this repository):
  logo.jpg   her public logo, 600x600, from her Booksy listing

Writes into public/demo/yariiimakeup-01/assets/:
  img/logo-ink.webp, img/logo-gold.webp   the logo split into its black line
                                          art and its gold dust, both on a
                                          transparent ground
  img/logo-wordmark.webp                  the YARIIIMAKEUP line of that same
                                          logo, for the header
  img/logo-full.webp                      the whole logo on the page's ivory

Nothing is redrawn or retouched. The logo is the published bitmap with its
cream ground removed, so it can sit on the page's ivory.

The two film clips are made by scripts/yariiimakeup-01-clips.py.
"""
import os
import sys

from PIL import Image

LOGO = sys.argv[1]
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "demo", "yariiimakeup-01", "assets")
IMG = os.path.join(ROOT, "img")

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
