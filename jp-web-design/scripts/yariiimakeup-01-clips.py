#!/usr/bin/env python3
"""Cleaner cuts of the two moving clips from the transformation reel (a phone screen recording).

    python3 -I scripts/yariiimakeup-01-clips.py <reel.mov> <outdir>                       # the recommended pair + posters
    python3 -I scripts/yariiimakeup-01-clips.py <reel.mov> <outdir> --width 1024          # the larger pair
    python3 -I scripts/yariiimakeup-01-clips.py <reel.mov> <outdir> --cut published       # the cut times in use on the site today
    python3 -I scripts/yariiimakeup-01-clips.py <reel.mov> <outdir> --strength 0          # no sharpening at all (control)
    python3 -I scripts/yariiimakeup-01-clips.py <reel.mov> <outdir> --edgefix             # also trims the black strip on the right

Needs ffmpeg built with libx264 and zscale (zimg), and Pillow for the posters. Nothing else.

Writes <outdir>/gown.mp4, mirror.mp4 (H.264 High, yuv420p, 30 fps, no audio, +faststart) and
<outdir>/film-gown.jpg, film-mirror.jpg (the first frame of each clip, colour-matched to the film).

WHAT IS DONE TO THE PICTURE, in order, and nothing else:
  1. cut            trim to the shot, half speed. Every displayed frame is one real recorded frame, shown for
                    twice its recorded time (no blended and no interpolated in-between frames).
  2. crop           crop=1024:1680:24:48 (removes the editing app's corner watermark; see EDGE below for the
                    right-hand border it does not quite clear).
  3. exact convert  full-range 8-bit -> limited-range 16-bit with zimg, so nothing is rounded twice.
  4. sharpen        one fixed, linear, luma-only band boost (a difference of two Gaussians):
                        Y' = Y + K * (G(0.7 px) - G(2.2 px)) * Y        K = 1.2
                    Measured on this ffmpeg: detail is lifted x1.2 at 0.05 cycles/px, x1.8 at the peak
                    (0.16-0.20 cycles/px, where the recording's remaining detail sits), easing to x1.4 at the
                    source's pixel limit, and x1.0 at DC, so average brightness cannot move. The two chroma
                    planes are passed through untouched (checked bit-for-bit when the clips were built),
                    so hue and saturation cannot move. It is the same kernel on every pixel of every frame:
                    it cannot invent or repaint anything.
  5. resize         Lanczos to 720x1180 (zimg), error-diffusion dither down to 8 bit.
  6. encode         x264 veryslow, crf 20, level 3.1 (720) / 4.0 (1024), tagged BT.709 limited.

WHAT WAS TESTED AND LEFT OUT (see the comparison sheets):
  denoise / deblock   hqdn3d, atadenoise, nlmeans, tmix, tmedian, deblock, pp, spp, uspp, fspp, pp7: the
                      recording is soft, not noisy or blocky, so none of them changed what you see; tmix and
                      tmedian ghost badly on the mirror shot where she moves; nlmeans smooths skin.
  unsharp / cas       8-bit only in this ffmpeg build (at 16 bit unsharp silently does nothing and cas
                      breaks), and cas darkens the picture slightly. The band boost above does the same job
                      at full precision and puts its peak where the picture's detail is, not at the pixel
                      limit where only block edges live.
  frame blending      softens every other frame into a double exposure while she moves.
  minterpolate mci    synthesises the in-between frames. Not used.

CUTS. 'tight' (default) keeps the published shots but drops the frames the reel's own transitions damage:
  gown    5.85 - 6.86 s   the four source frames from 6.87 to 6.95 are already softening into the next cut
  mirror  7.49 - 8.55 s   the frame at 7.47 is still inside the blur of the incoming transition, and it is
                          the clip's first frame today
'published' reproduces 5.85-6.95 and 7.45-8.55 exactly. The reel's bare-faced "before" shot (2.5-4.7 s) is
not used by either. No audio is kept.

KNOWN LIMITS (nothing here can fix them without inventing detail):
  - The recording holds real detail only up to about 0.25-0.3 cycles/px, i.e. roughly a 500-600 px wide
    picture inside the 1024 px frame. In the gown shot her face is about 180 px wide in the frame.
  - In the moving parts of the mirror shot the screen recorder alternates better and worse frames, so
    sharpness pulses slightly from frame to frame. Averaging neighbours evens it out but ghosts her face.
"""
import argparse
import io
import os
import subprocess

from PIL import Image

CROP = "crop=1024:1680:24:48"
# EDGE. The standard crop does not quite clear the recording's right-hand border: the picture ends about
# 8 px (gown) to 13 px (mirror) before the crop does, leaving a near-black strip down the right side of
# both clips (it is in the files on the site today). --edgefix trims a further 24 px off the right and
# 20 px off top and bottom (same shape, 2.4% tighter framing) so the strip is gone. Any still or poster shown
# with an --edgefix clip must be cut the same way, or use the poster this script writes.
EDGE_TRIM = "crop=1000:1640:0:20"
HEIGHT = {720: 1180, 1024: 1680}
LEVEL = {720: "3.1", 1024: "4.0"}
CUTS = {
    "tight": {"gown": (5.85, 6.86), "mirror": (7.49, 8.55)},
    "published": {"gown": (5.85, 6.95), "mirror": (7.45, 8.55)},
}
# crf per width and clip. 1024 mirror is held at 23 so every file stays under ~450 KB.
CRF = {720: {"gown": 20, "mirror": 20}, 1024: {"gown": 20, "mirror": 23}}
S1, S2 = 0.7, 2.2  # the two Gaussian radii of the band boost, in source pixels

SLOW = {
    "dup": "fps=30",  # each real frame held twice
    "blend": "fps=15,minterpolate=fps=30:mi_mode=blend",  # in-betweens are 50/50 double exposures
    "mci": "fps=15,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=none",  # SYNTHESISED in-betweens
}


def band_boost(k, guard_right_edge):
    """Luma-only difference-of-Gaussians boost at 16 bit. 4096..60160 is legal limited-range luma.
    guard_right_edge: fade the boost to nothing over x = 988..1000, so the recording's black border that the
    standard crop still contains (see EDGE above) is passed through exactly as recorded, not accentuated."""
    w = "*clip((1000-X)/12,0,1)" if guard_right_edge else ""
    return (
        f"split=3[o][a][b];"
        f"[a]gblur=sigma={S1}:steps=4:planes=1[a1];[b]gblur=sigma={S2}:steps=4:planes=1[b1];"
        f"[a1][b1]blend=c0_expr='A-B+32768':c1_expr='A':c2_expr='A'[d];"
        f"[o][d]blend=c0_expr='clip(A+{k}*(B-32768){w},4096,60160)':c1_expr='A':c2_expr='A'"
    )


def chain(ss, to, width, strength, slow, edgefix=False):
    # The half-speed step comes straight after the cut, before the two-input blend filters. Placed after
    # them, the fps filter no longer learns where the stream ends and silently drops the last real frame.
    c = [
        f"trim=start={ss}:end={to}",
        "setpts=(PTS-STARTPTS)/0.5",
        SLOW[slow],
        CROP,
    ]
    if edgefix:
        c.append(EDGE_TRIM)
    c += ["zscale=rangein=full:range=limited", "format=yuv420p16le"]
    if strength > 0:
        c.append(band_boost(strength, guard_right_edge=not edgefix))
    size = f"w={width}:h={HEIGHT[width]}:filter=lanczos:" if (width != 1024 or edgefix) else ""
    c += [f"zscale={size}dither=error_diffusion", "format=yuv420p"]
    return ",".join(c)


def ffmpeg(args, **kw):
    return subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-nostdin"] + args, check=True, **kw)


def probe(path, entries):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", entries, "-of", "csv=p=0", path],
                       capture_output=True, text=True, check=True)
    return r.stdout.strip()


def make(reel, outdir, name, ss, to, width, strength, slow, crf, suffix="", edgefix=False):
    out = os.path.join(outdir, f"{name}{suffix}.mp4")
    ffmpeg(["-i", reel, "-an", "-vf", chain(ss, to, width, strength, slow, edgefix),
            "-c:v", "libx264", "-profile:v", "high", "-level", LEVEL[width], "-pix_fmt", "yuv420p",
            "-crf", str(crf), "-preset", "veryslow",
            "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
            "-movflags", "+faststart", out])
    # Poster: the clip's own first frame, decoded with the film's BT.709 matrix to RGB and only then saved
    # as JPEG. (Letting ffmpeg write the JPEG directly keeps BT.709 numbers inside a file every decoder reads
    # as BT.601, which shifts skin about 3 levels away from red against the film it stands in for.)
    png = ffmpeg(["-i", out, "-frames:v", "1", "-vf", "scale=in_color_matrix=bt709:in_range=tv,format=rgb24",
                  "-f", "image2pipe", "-c:v", "png", "-"], capture_output=True).stdout
    poster = os.path.join(outdir, f"film-{name}{suffix}.jpg")
    Image.open(io.BytesIO(png)).convert("RGB").save(poster, "JPEG", quality=84, optimize=True, progressive=True)
    dur = probe(out, "format=duration")
    info = probe(out, "stream=width,height,profile,level,pix_fmt,nb_frames")
    print(f"{os.path.basename(out):22s} {os.path.getsize(out) / 1024:7.1f} KB  {float(dur):.3f} s  {info}   "
          f"poster {os.path.basename(poster)} {os.path.getsize(poster) / 1024:.1f} KB")
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("reel")
    ap.add_argument("outdir")
    ap.add_argument("--width", type=int, default=720, choices=(720, 1024))
    ap.add_argument("--strength", type=float, default=1.2, help="K of the band boost; 0 disables it")
    ap.add_argument("--cut", default="tight", choices=tuple(CUTS))
    ap.add_argument("--slow", default="dup", choices=tuple(SLOW))
    ap.add_argument("--crf", type=int, default=None)
    ap.add_argument("--suffix", default="")
    ap.add_argument("--only", default=None, choices=("gown", "mirror"))
    ap.add_argument("--edgefix", action="store_true", help="also trim the black strip the standard crop leaves on the right")
    a = ap.parse_args()
    os.makedirs(a.outdir, exist_ok=True)
    for name, (ss, to) in CUTS[a.cut].items():
        if a.only and a.only != name:
            continue
        make(a.reel, a.outdir, name, ss, to, a.width, a.strength, a.slow,
             a.crf if a.crf is not None else CRF[a.width][name], a.suffix, a.edgefix)
