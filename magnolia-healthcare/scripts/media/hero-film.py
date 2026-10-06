#!/usr/bin/env python3
"""
TEMPORARY DEMO ASSET — "Morning light" ambient hero film for the Magnolia demo.

Procedurally rendered (no footage, no people, no third-party media): a slow,
seamlessly looping field of warm light — ivory/petal/brass bokeh drifting over a
soft gradient with a travelling light shaft, vignette and fine grain. Shown under
a magnolia-leaf scrim in the home prologue so the hero reads as atmosphere, not
decoration. It exists so the cinematic hero system can be judged now; a licensed
caregiver/senior clip replaces it later by swapping two files (see docs/MEDIA.md).

Output: <dir>/f0000.png … -> encoded by build-media.sh into mp4/webm + poster.
"""
import math, os, sys
import numpy as np
from PIL import Image

W, H = 1280, 720
FPS, SECONDS = 24, 10
N = FPS * SECONDS
OUT = sys.argv[1] if len(sys.argv) > 1 else 'hero-film-frames'
os.makedirs(OUT, exist_ok=True)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
u = xx / W; v = yy / H

ivory = np.array([248, 244, 238], np.float32)
linen = np.array([241, 234, 225], np.float32)
petal = np.array([233, 207, 199], np.float32)
brass = np.array([205, 180, 140], np.float32)
white = np.array([255, 253, 251], np.float32)

def mix(a, b, t):
    t = t[..., None]
    return a * (1 - t) + b * t

# a deeper warm field (linen -> petal -> brass) so that, under the hero's leaf scrim,
# the bright bokeh and the light shaft read as light moving through the room
base = mix(linen, petal, np.clip(v * 1.15, 0, 1) * 0.9)
base = mix(base, brass, np.clip(1.15 - (u * 0.9 + (1 - v) * 1.1), 0, 1) * 0.6)
base = mix(base, ivory, np.clip(0.55 - ((u - 0.35) ** 2 * 1.4 + (v - 0.3) ** 2 * 2.2), 0, 1) * 0.5)

rng = np.random.default_rng(7)
orbs = []
for i in range(9):
    orbs.append(dict(
        cx=rng.uniform(0.05, 0.95), cy=rng.uniform(0.1, 0.9),
        r=rng.uniform(0.12, 0.34), ax=rng.uniform(0.04, 0.1), ay=rng.uniform(0.03, 0.08),
        ph=rng.uniform(0, 2 * math.pi), k=int(rng.integers(1, 3)),
        col=[white, petal, brass, white][i % 4], amp=rng.uniform(0.6, 0.95)))

vign = 1 - 0.4 * np.clip(((u - 0.5) ** 2 * 1.6 + (v - 0.5) ** 2 * 2.2) * 1.4, 0, 1)
grain = rng.normal(0, 1, (H, W)).astype(np.float32)

for f in range(N):
    t = f / N
    img = base.copy()
    for o in orbs:
        cx = o['cx'] + o['ax'] * math.sin(2 * math.pi * o['k'] * t + o['ph'])
        cy = o['cy'] + o['ay'] * math.cos(2 * math.pi * o['k'] * t + o['ph'] * 0.7)
        d2 = ((u - cx) ** 2 * (W / H) ** 2 + (v - cy) ** 2) / (o['r'] ** 2)
        g = np.exp(-d2 * 2.2) * (o['amp'] * (0.85 + 0.15 * math.sin(2 * math.pi * t + o['ph'])))
        img = mix(img, o['col'], g)
    sx = (u - 0.3 * v) - (t * 1.6 - 0.3)
    shaft = np.exp(-(sx ** 2) / 0.02) * 0.34 + np.exp(-((sx - 0.26) ** 2) / 0.03) * 0.16
    img = mix(img, white, shaft)
    img = img * vign[..., None]
    img = img + grain[..., None] * 2.2
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(f'{OUT}/f{f:04d}.png', compress_level=1)
    if f % 48 == 0: print('frame', f, '/', N)
print('done', N, 'frames')
