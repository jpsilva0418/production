#!/usr/bin/env python3
"""
Procedural cinematic plates for the JP Media art-direction study.

No photography is used anywhere in these plates. Every image is synthesised
(light, haze, grain, horizon bands, brushed metal, paper) so the six concepts
can be judged on composition, typography and motion while the real stills
and footage are dropped into the same slots later (see ../shared/media.js).

Run:  python3 make-plates.py            -> writes ../media/plates and ../media/loops
Needs: Pillow, numpy, ffmpeg (libx264 + libvpx-vp9)
"""
import math, os, subprocess, shutil, tempfile
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'media'))
PLATES = os.path.join(OUT, 'plates')
LOOPS = os.path.join(OUT, 'loops')
os.makedirs(PLATES, exist_ok=True); os.makedirs(LOOPS, exist_ok=True)
rng = np.random.default_rng(418)

# ---------- helpers (all arrays are float32 HxWx3 in 0..1) ----------
def canvas(w, h, rgb):
    a = np.empty((h, w, 3), np.float32); a[:] = np.array(rgb, np.float32) / 255.0; return a

def coords(w, h):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    return x / max(w - 1, 1), y / max(h - 1, 1)

def lerp(a, b, t): return a + (b - a) * t

def vgrad(w, h, stops):
    """stops: list of (pos 0..1, (r,g,b))."""
    _, y = coords(w, h)
    out = np.zeros((h, w, 3), np.float32)
    for i in range(len(stops) - 1):
        p0, c0 = stops[i]; p1, c1 = stops[i + 1]
        m = (y >= p0) & (y <= p1)
        t = np.clip((y - p0) / max(p1 - p0, 1e-6), 0, 1)
        for c in range(3):
            out[..., c] = np.where(m, lerp(c0[c], c1[c], t) / 255.0, out[..., c])
    return out

def smooth(x, e0, e1):
    t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)

def bloom(a, cx, cy, rx, ry, rgb, strength=1.0, power=2.0):
    h, w, _ = a.shape
    x, y = coords(w, h)
    d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
    g = np.exp(-d ** (power / 2)) * strength
    col = np.array(rgb, np.float32) / 255.0
    # screen blend
    return 1 - (1 - a) * (1 - g[..., None] * col)

def shaft(a, x0, y0, angle_deg, width, rgb, strength=0.6, soft=1.0):
    h, w, _ = a.shape
    x, y = coords(w, h)
    ang = math.radians(angle_deg)
    # distance from the line through (x0,y0) at angle
    dx, dy = x - x0, (y - y0) * (h / w)
    d = np.abs(dx * math.sin(ang) - dy * math.cos(ang))
    along = dx * math.cos(ang) + dy * math.sin(ang)
    g = np.exp(-(d / width) ** 2 * 2.0) * strength
    g *= smooth(along, -0.05, 0.15 * soft)  # fades in along its length
    col = np.array(rgb, np.float32) / 255.0
    return 1 - (1 - a) * (1 - g[..., None] * col)

def vignette(a, strength=0.55, power=2.2, cx=0.5, cy=0.5):
    h, w, _ = a.shape
    x, y = coords(w, h)
    d = np.sqrt(((x - cx) * 1.0) ** 2 + ((y - cy) * (h / w)) ** 2)
    v = 1 - strength * np.clip(d / 0.75, 0, 1) ** power
    return a * v[..., None]

def mottle(w, h, scale=12, amount=0.06):
    small = rng.random((max(h // scale, 2), max(w // scale, 2))).astype(np.float32)
    img = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(max(2, scale * 0.9)))
    m = (np.asarray(img).astype(np.float32) / 255.0 - 0.5) * 2 * amount
    return m[..., None]

def grain(a, amount=0.045, mono=0.8, blur=0.0):
    h, w, _ = a.shape
    g = rng.normal(0, 1, (h, w, 1)).astype(np.float32) * mono + rng.normal(0, 1, (h, w, 3)).astype(np.float32) * (1 - mono)
    # grain is stronger in midtones (like film)
    lum = a.mean(axis=2, keepdims=True)
    k = 1 - np.abs(lum - 0.5) * 1.4
    out = a + g * amount * np.clip(k, 0.25, 1)
    if blur:
        out = to_arr(to_img(out).filter(ImageFilter.GaussianBlur(blur)))
    return out

def dust(a, n=140, rgb=(255, 236, 210), max_r=2.2, strength=0.5, blur=1.2):
    h, w, _ = a.shape
    layer = np.zeros((h, w), np.float32)
    for _ in range(n):
        x = rng.integers(0, w); y = rng.integers(0, h); r = rng.uniform(0.6, max_r)
        s = rng.uniform(0.2, 1.0) * strength
        x0, x1 = max(0, int(x - 4)), min(w, int(x + 5)); y0, y1 = max(0, int(y - 4)), min(h, int(y + 5))
        yy, xx = np.mgrid[y0:y1, x0:x1]
        layer[y0:y1, x0:x1] += s * np.exp(-((xx - x) ** 2 + (yy - y) ** 2) / (2 * r * r))
    layer = to_arr1(to_img1(layer).filter(ImageFilter.GaussianBlur(blur)))
    col = np.array(rgb, np.float32) / 255.0
    return 1 - (1 - a) * (1 - np.clip(layer, 0, 1)[..., None] * col)

def blur(a, r):
    return to_arr(to_img(a).filter(ImageFilter.GaussianBlur(r)))

def to_img(a): return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGB')
def to_arr(im): return np.asarray(im).astype(np.float32) / 255.0
def to_img1(a): return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8), 'L')
def to_arr1(im): return np.asarray(im).astype(np.float32) / 255.0

def curve(a, lift=0.0, gamma=1.0, contrast=1.0):
    x = np.clip(a, 0, 1) ** gamma
    x = (x - 0.5) * contrast + 0.5
    return np.clip(x + lift, 0, 1)

def tint_shadows(a, rgb, amount=0.08):
    lum = a.mean(axis=2, keepdims=True)
    col = np.array(rgb, np.float32) / 255.0
    return a + (1 - lum) * amount * (col - 0.5) * 2

def save(a, name, widths=(1800, 900), quality=82):
    im = to_img(a)
    for wdt in widths:
        hgt = round(im.height * wdt / im.width)
        im2 = im.resize((wdt, hgt), Image.LANCZOS)
        suffix = '' if wdt == widths[0] else f'-{wdt}'
        p = os.path.join(PLATES, f'{name}{suffix}.jpg')
        im2.save(p, 'JPEG', quality=quality, optimize=True, progressive=True)
        print(f'  {os.path.relpath(p, OUT):40s} {im2.width}x{im2.height} {os.path.getsize(p)//1024} KB')

def size(aspect, w=1800):
    aw, ah = aspect; return w, round(w * ah / aw)

# ---------- PLATES ----------
print('plates')

# 01 night halation — black room, one warm practical bloom, dust in the air
w, h = size((16, 9))
a = canvas(w, h, (6, 6, 7))
a = bloom(a, 0.22, 0.28, 0.42, 0.55, (255, 168, 96), 0.55, 1.6)
a = bloom(a, 0.22, 0.28, 0.12, 0.16, (255, 214, 170), 0.55, 1.4)
a = bloom(a, 0.80, 0.85, 0.5, 0.4, (70, 60, 90), 0.25, 2.0)
a = dust(a, 160, strength=0.45)
a = a + mottle(w, h, 20, 0.02)
a = grain(a, 0.05)
a = vignette(a, 0.4)
save(a, 'night-halation')

# 01/05 night beam — a single soft white beam from above, vertical
w, h = size((9, 16), 1200)
a = canvas(w, h, (5, 5, 6))
a = shaft(a, 0.55, -0.05, 100, 0.09, (235, 232, 228), 0.75, 2.2)
a = bloom(a, 0.5, 1.02, 0.6, 0.18, (120, 110, 100), 0.35, 2.0)
a = dust(a, 90, rgb=(240, 240, 240), strength=0.4)
a = grain(a, 0.055)
save(a, 'night-beam', widths=(1200, 720))

# 03 dusk horizon — 2.39:1, burnt sky over a dark ragged ground band
w, h = size((239, 100))
a = vgrad(w, h, [(0.0, (26, 16, 14)), (0.30, (92, 36, 24)), (0.56, (196, 96, 44)), (0.68, (236, 160, 86)), (0.74, (120, 60, 34)), (1.0, (10, 8, 8))])
a = bloom(a, 0.62, 0.71, 0.26, 0.10, (255, 206, 140), 0.6, 1.3)
a = bloom(a, 0.62, 0.71, 0.08, 0.035, (255, 240, 210), 0.5, 1.2)
# ragged ground: 1D noise horizon
x1 = np.linspace(0, 1, w, dtype=np.float32)
hz = 0.73 + 0.012 * np.sin(x1 * 6.1) + 0.008 * np.sin(x1 * 23.7 + 1.0) + 0.004 * rng.normal(0, 1, w).astype(np.float32)
hz = np.convolve(hz, np.ones(25) / 25, mode='same')
_, y = coords(w, h)
ground = smooth(y - hz[None, :], 0.0, 0.012)
a = a * (1 - ground[..., None] * 0.96)
a = a + mottle(w, h, 16, 0.03)
a = grain(a, 0.06)
a = vignette(a, 0.35, 2.4)
save(a, 'dusk-horizon')

# 03 dusk haze — 4:5 portrait, amber haze and dust
w, h = size((4, 5), 1400)
a = vgrad(w, h, [(0.0, (46, 26, 18)), (0.5, (128, 72, 40)), (1.0, (30, 18, 14))])
a = bloom(a, 0.72, 0.36, 0.55, 0.42, (240, 170, 100), 0.55, 1.5)
a = shaft(a, 0.95, 0.05, 125, 0.14, (255, 200, 140), 0.35, 3.0)
a = dust(a, 220, rgb=(255, 225, 190), strength=0.55, max_r=2.6)
a = a + mottle(w, h, 14, 0.04)
a = grain(a, 0.065)
a = vignette(a, 0.45)
save(a, 'dusk-haze', widths=(1400, 800))

# 03 ember — 3:2, low red-brown light with a hot edge
w, h = size((3, 2))
a = canvas(w, h, (16, 10, 9))
a = bloom(a, 1.02, 0.55, 0.55, 0.9, (150, 50, 28), 0.7, 1.6)
a = bloom(a, 1.02, 0.55, 0.16, 0.5, (255, 140, 70), 0.55, 1.3)
a = bloom(a, 0.05, 0.9, 0.5, 0.5, (40, 28, 30), 0.3, 2.0)
a = a + mottle(w, h, 18, 0.035)
a = grain(a, 0.06)
save(a, 'ember')

# 04 silver edge — graphite field cut by a hard diagonal light
w, h = size((16, 9))
a = canvas(w, h, (28, 29, 32))
x, y = coords(w, h)
edge = smooth(x * 0.75 + y * 0.45, 0.63, 0.70)
light = np.array((190, 193, 198), np.float32) / 255.0
a = a * (1 - edge[..., None]) + (light * (0.55 + 0.45 * (1 - y[..., None])) * 0.8) * edge[..., None]
a = bloom(a, 0.9, 0.1, 0.5, 0.5, (230, 232, 236), 0.25, 2.0)
a = a + mottle(w, h, 30, 0.015)
a = grain(a, 0.03, blur=0.3)
save(a, 'silver-edge')

# 04 silver brushed — 3:4 vertical brushed metal
w, h = size((3, 4), 1400)
col = rng.normal(0, 1, (1, w)).astype(np.float32)
col = np.convolve(col[0], np.ones(5) / 5, mode='same')[None, :]
base = 0.42 + 0.06 * col + 0.10 * np.cos(np.linspace(0, 2.4, w, dtype=np.float32))[None, :]
_, y = coords(w, h)
base = base * (0.78 + 0.32 * (1 - y))
a = np.repeat(base[..., None], 3, axis=2)
a[..., 2] *= 1.04; a[..., 0] *= 0.985
a = a + rng.normal(0, 0.018, (h, w, 1)).astype(np.float32)
a = blur(a, 0.6)
a = bloom(a, 0.5, -0.1, 0.9, 0.5, (240, 242, 246), 0.22, 2.0)
a = vignette(a, 0.3)
save(a, 'silver-brushed', widths=(1400, 800))

# 02/06 bone paper — 4:5 cool bone sheet with a soft shadow edge
w, h = size((4, 5), 1400)
a = canvas(w, h, (236, 233, 226))
a = a + mottle(w, h, 10, 0.012) + mottle(w, h, 60, 0.02)
fiber = rng.normal(0, 1, (h, w, 1)).astype(np.float32) * 0.012
a = a + fiber
x, y = coords(w, h)
shade = smooth(x, 0.0, 0.35) * 0.08 + smooth(1 - y, 0.0, 0.5) * 0.03
a = a * (1 - (0.11 - shade)[..., None])
save(a, 'bone-paper', widths=(1400, 800))

# 02/06 mono grain — 3:2 black-and-white soft field, heavy grain
w, h = size((3, 2))
a = vgrad(w, h, [(0.0, (160, 160, 158)), (0.45, (92, 92, 90)), (1.0, (18, 18, 18))])
a = bloom(a, 0.3, 0.2, 0.5, 0.4, (235, 235, 232), 0.45, 1.8)
a = curve(a, gamma=1.15)
a = grain(a, 0.075, mono=1.0)
a = vignette(a, 0.5, 2.0)
save(a, 'mono-grain')

# 02 mono leak — 2:3 vertical, B&W with a blown light leak from the right edge
w, h = size((2, 3), 1400)
a = vgrad(w, h, [(0.0, (40, 40, 40)), (1.0, (12, 12, 12))])
a = bloom(a, 0.42, 0.5, 0.45, 0.4, (120, 120, 118), 0.5, 1.8)
a = bloom(a, 1.05, 0.35, 0.4, 0.5, (250, 250, 248), 0.95, 1.5)
a = bloom(a, 1.05, 0.35, 0.18, 0.25, (255, 255, 255), 1.0, 1.4)
a = grain(a, 0.065, mono=1.0)
save(a, 'mono-leak', widths=(1400, 800))

# 05 stage red — 16:9, black with hard red shafts, a white hot spot, smoke
w, h = size((16, 9))
a = canvas(w, h, (6, 4, 5))
a = shaft(a, 0.18, -0.05, 115, 0.08, (255, 46, 30), 0.85, 2.5)
a = shaft(a, 0.42, -0.05, 100, 0.06, (255, 60, 40), 0.75, 2.5)
a = shaft(a, 0.70, -0.05, 72, 0.07, (255, 40, 24), 0.8, 2.5)
a = bloom(a, 0.80, 0.18, 0.09, 0.14, (255, 245, 235), 0.9, 1.4)
a = bloom(a, 0.80, 0.18, 0.35, 0.45, (255, 90, 60), 0.4, 1.8)
a = a + np.clip(mottle(w, h, 40, 0.12), 0, 1) * np.array((0.9, 0.2, 0.15), np.float32) * 0.5 * (1 - coords(w, h)[1][..., None]) ** 2
a = dust(a, 120, rgb=(255, 180, 160), strength=0.5)
a = grain(a, 0.055)
save(a, 'stage-red')

# 05 stage vertical — 9:16, red wash and a top flare
w, h = size((9, 16), 1200)
a = canvas(w, h, (6, 4, 5))
a = shaft(a, 0.5, -0.02, 92, 0.16, (230, 36, 26), 0.8, 2.5)
a = bloom(a, 0.5, 0.0, 0.5, 0.18, (255, 230, 220), 0.7, 1.4)
a = bloom(a, 0.5, 0.0, 0.9, 0.4, (255, 70, 50), 0.4, 1.8)
a = a + mottle(w, h, 36, 0.10) * np.array((0.9, 0.15, 0.12), np.float32) * 0.5
a = dust(a, 110, rgb=(255, 190, 170), strength=0.5)
a = grain(a, 0.06)
save(a, 'stage-vertical', widths=(1200, 720))

# 01/03 warm leak — 16:9 film light leak burning in from the left
w, h = size((16, 9))
a = canvas(w, h, (8, 6, 6))
a = bloom(a, -0.05, 0.6, 0.45, 0.9, (200, 60, 30), 0.85, 1.5)
a = bloom(a, -0.05, 0.6, 0.22, 0.6, (255, 150, 60), 0.8, 1.3)
a = bloom(a, 0.05, 0.75, 0.10, 0.25, (255, 230, 190), 0.6, 1.2)
a = bloom(a, 0.9, 0.2, 0.3, 0.3, (40, 30, 50), 0.3, 2.0)
a = a + mottle(w, h, 18, 0.03)
a = grain(a, 0.06)
save(a, 'leak-warm')

# 06 mist white — 3:2 near-white fog with a faint grey gradient
w, h = size((3, 2))
a = vgrad(w, h, [(0.0, (238, 238, 236)), (0.6, (216, 216, 213)), (1.0, (190, 190, 188))])
a = a + mottle(w, h, 24, 0.03)
a = bloom(a, 0.7, 0.25, 0.5, 0.5, (252, 252, 250), 0.4, 1.6)
a = grain(a, 0.025, blur=0.4)
save(a, 'mist-white')

# ---------- LOOPS (seamless, 12 fps, 3 s) ----------
print('loops')
FPS, SECS = 12, 3
N = FPS * SECS

def encode(frames_dir, name, w, h):
    mp4 = os.path.join(LOOPS, f'{name}.mp4'); webm = os.path.join(LOOPS, f'{name}.webm'); poster = os.path.join(LOOPS, f'{name}-poster.jpg')
    base = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-framerate', str(FPS), '-i', os.path.join(frames_dir, 'f%03d.png')]
    subprocess.run(base + ['-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4], check=True)
    subprocess.run(base + ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '40', '-row-mt', '1', '-an', webm], check=True)
    shutil.copy(os.path.join(frames_dir, 'f000.png'), '/tmp/_p.png')
    Image.open('/tmp/_p.png').convert('RGB').save(poster, 'JPEG', quality=80, optimize=True, progressive=True)
    for p in (mp4, webm, poster):
        print(f'  {os.path.relpath(p, OUT):40s} {os.path.getsize(p)//1024} KB')

def render_loop(name, w, h, fn):
    d = tempfile.mkdtemp()
    for i in range(N):
        t = i / N
        a = fn(t)
        to_img(a).save(os.path.join(d, f'f{i:03d}.png'))
    encode(d, name, w, h)
    shutil.rmtree(d)

TAU = 2 * math.pi

# dust in a dark room (01, 06)
W, H = 960, 540
P = rng.random((90, 4)).astype(np.float32)  # x, y, speed-class, size
def loop_dust(t):
    a = canvas(W, H, (6, 6, 7))
    a = bloom(a, 0.22, 0.30, 0.42, 0.55, (255, 168, 96), 0.45 + 0.05 * math.sin(TAU * t), 1.6)
    a = bloom(a, 0.22, 0.30, 0.12, 0.16, (255, 214, 170), 0.5, 1.4)
    layer = np.zeros((H, W), np.float32)
    for px, py, sc, sz in P:
        k = 1 + int(sc * 2)          # integer wraps per loop -> seamless
        x = (px + 0.03 * math.sin(TAU * (t + px))) % 1.0
        y = (py - k * t) % 1.0
        xi, yi = int(x * (W - 1)), int(y * (H - 1)); r = 0.8 + sz * 1.4
        x0, x1 = max(0, xi - 4), min(W, xi + 5); y0, y1 = max(0, yi - 4), min(H, yi + 5)
        yy, xx = np.mgrid[y0:y1, x0:x1]
        layer[y0:y1, x0:x1] += (0.3 + 0.5 * sz) * np.exp(-((xx - xi) ** 2 + (yy - yi) ** 2) / (2 * r * r))
    layer = to_arr1(to_img1(layer).filter(ImageFilter.GaussianBlur(1.1)))
    a = 1 - (1 - a) * (1 - layer[..., None] * np.array((1, .93, .82), np.float32))
    a = grain(a, 0.03)
    return vignette(a, 0.4)
render_loop('dust', W, H, loop_dust)

# low sun through haze (03)
def loop_sun(t):
    a = vgrad(W, H, [(0.0, (30, 18, 14)), (0.45, (120, 58, 32)), (0.72, (220, 140, 72)), (0.78, (90, 44, 28)), (1.0, (12, 9, 8))])
    s = math.sin(TAU * t)
    a = bloom(a, 0.60 + 0.01 * s, 0.74, 0.28 + 0.02 * s, 0.11, (255, 206, 140), 0.6, 1.3)
    a = bloom(a, 0.60 + 0.01 * s, 0.74, 0.08, 0.035, (255, 240, 210), 0.5 + 0.05 * s, 1.2)
    a = shaft(a, 0.95 + 0.02 * math.cos(TAU * t), 0.05, 125 + 2 * s, 0.14, (255, 200, 140), 0.25 + 0.05 * s, 3.0)
    _, y = coords(W, H)
    hz = 0.76
    ground = smooth(y - hz, 0.0, 0.02)
    a = a * (1 - ground[..., None] * 0.95)
    a = a + mottle(W, H, 14, 0.03)
    return vignette(grain(a, 0.028), 0.35)
render_loop('sun', W, H, loop_sun)

# stage shafts flickering (05) — vertical 9:16
W2, H2 = 540, 960
def loop_stage(t):
    a = canvas(W2, H2, (6, 4, 5))
    f1 = 0.65 + 0.35 * max(0, math.sin(TAU * 2 * t)) ** 3
    f2 = 0.6 + 0.4 * max(0, math.sin(TAU * 3 * t + 1.2)) ** 2
    a = shaft(a, 0.35, -0.02, 97, 0.12, (240, 38, 26), 0.7 * f1, 2.5)
    a = shaft(a, 0.68, -0.02, 86, 0.10, (255, 60, 40), 0.65 * f2, 2.5)
    a = bloom(a, 0.5, -0.02, 0.5, 0.18, (255, 230, 220), 0.55 + 0.25 * f1, 1.4)
    a = bloom(a, 0.5, 0.0, 0.95, 0.42, (255, 70, 50), 0.35, 1.8)
    a = a + mottle(W2, H2, 36, 0.10) * np.array((0.9, 0.15, 0.12), np.float32) * 0.5
    return grain(a, 0.03)
render_loop('stage', W2, H2, loop_stage)

# silver light sweep over graphite (04)
def loop_silver(t):
    a = canvas(W, H, (28, 29, 32))
    x, y = coords(W, H)
    pos = 0.66 + 0.03 * math.sin(TAU * t)
    edge = smooth(x * 0.75 + y * 0.45, pos - 0.035, pos + 0.035)
    light = np.array((190, 193, 198), np.float32) / 255.0
    a = a * (1 - edge[..., None]) + (light * (0.55 + 0.45 * (1 - y[..., None])) * 0.8) * edge[..., None]
    a = bloom(a, 0.9, 0.1, 0.5, 0.5, (230, 232, 236), 0.22 + 0.04 * math.cos(TAU * t), 2.0)
    return grain(a, 0.025, blur=0.3)
render_loop('silver', W, H, loop_silver)

# drifting mist on near-white (06)
M1 = rng.random((H // 24 + 2, W // 24 + 2)).astype(np.float32)
def loop_mist(t):
    a = vgrad(W, H, [(0.0, (238, 238, 236)), (0.6, (216, 216, 213)), (1.0, (190, 190, 188))])
    sh = int((t * 24 * 2) % (24 * 2))
    big = Image.fromarray((M1 * 255).astype(np.uint8)).resize((W + 48, H + 48), Image.BICUBIC)
    m = (np.asarray(big).astype(np.float32) / 255.0 - 0.5) * 0.08
    m = np.roll(m, sh, axis=1)[24:24 + H, 24:24 + W]
    a = a + m[..., None]
    a = bloom(a, 0.7 + 0.02 * math.sin(TAU * t), 0.25, 0.5, 0.5, (252, 252, 250), 0.4, 1.6)
    return grain(a, 0.02, blur=0.4)
render_loop('mist', W, H, loop_mist)

# grain tile for CSS overlays (tileable 256px, transparent-ish PNG)
g = rng.normal(0.5, 0.18, (256, 256)).astype(np.float32)
tile = Image.fromarray((np.clip(g, 0, 1) * 255).astype(np.uint8), 'L')
tile.save(os.path.join(OUT, 'grain-256.png'), optimize=True)
print('  grain-256.png', os.path.getsize(os.path.join(OUT, 'grain-256.png')) // 1024, 'KB')
print('done')
