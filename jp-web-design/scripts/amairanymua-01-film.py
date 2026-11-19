#!/usr/bin/env python3
"""Film pipeline for /demo/amairanymua-01: one screen recording in, one film slot filled.

The site has four marked film slots (FILMS in scripts/amairanymua-01/site.mjs). Each is
empty until a clip exists. This script cuts one clip from a screen recording of one of
Amairany's reels and writes the two files a slot needs:

    public/demo/amairanymua-01/assets/film/<name>.mp4   silent H.264, 720 wide, portrait
    public/demo/amairanymua-01/assets/film/<name>.jpg   its poster frame

then prints the one line to change in site.mjs. Example:

    python3 scripts/amairanymua-01-film.py ~/Downloads/reel-1.mov bridal \\
        --start 2.4 --dur 5 --crop 0:210:1179:2096 --poster-at 1.2

What it does, and nothing else: trims to the seconds asked for, crops away the phone's
status bar and the app's chrome (--crop x:y:w:h in the recording's own pixels; run with
--probe first to see its size and get a contact sheet), scales to 720 wide, removes the
audio track, and encodes. No colour change, no retouching, no speed change, no
interpolation. The recording itself is never added to the repository.

Whose reel it is, and each client's consent to appear on a website, are Amairany's to
confirm; her original files would look better than a screen recording.

Needs ffmpeg and ffprobe on PATH.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "demo" / "amairanymua-01" / "assets" / "film"
WIDTH = 720           # delivered width; height follows the crop, kept even
MAX_SECONDS = 8.0     # a slot is a short loop, not the whole reel
CRF = 26              # visually clean at this size; about 250-450 kB for five seconds


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"{cmd[0]} failed:\n{r.stderr.strip()[-1200:]}")
    return r.stdout


def probe(src: Path) -> dict:
    j = json.loads(run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=width,height,r_frame_rate,duration:stream_side_data=rotation:format=duration",
                        "-of", "json", str(src)]))
    s = j["streams"][0]
    w, h = int(s["width"]), int(s["height"])
    rot = 0
    for sd in s.get("side_data_list", []):
        rot = int(sd.get("rotation", 0)) or rot
    if abs(rot) in (90, 270):  # ffmpeg applies the rotation on decode, so report the upright size
        w, h = h, w
    dur = float(s.get("duration") or j["format"]["duration"])
    return {"w": w, "h": h, "dur": dur}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("recording", type=Path, help="the screen recording (any format ffmpeg reads)")
    ap.add_argument("name", nargs="?", help="slot file name, lowercase letters, digits and hyphens (e.g. bridal)")
    ap.add_argument("--probe", action="store_true", help="only report the recording's size and length and write a contact sheet next to it")
    ap.add_argument("--start", type=float, default=0.0, help="where the clip starts, in seconds")
    ap.add_argument("--dur", type=float, default=5.0, help=f"clip length in seconds (at most {MAX_SECONDS:g})")
    ap.add_argument("--crop", help="x:y:w:h in the recording's pixels; default is the whole frame")
    ap.add_argument("--poster-at", type=float, default=0.0, help="poster frame, in seconds from the start of the clip")
    ap.add_argument("--out-dir", type=Path, default=OUT, help="write somewhere else (for trying a cut without touching the site)")
    a = ap.parse_args()

    if not a.recording.is_file():
        sys.exit(f"no such file: {a.recording}")
    info = probe(a.recording)
    print(f"recording: {info['w']}x{info['h']}, {info['dur']:.2f}s")

    if a.probe:
        sheet = a.recording.with_suffix(".contact.jpg")
        n = 12
        step = max(info["dur"] / n, 0.04)
        run(["ffmpeg", "-y", "-v", "error", "-i", str(a.recording), "-vf",
             f"fps=1/{step:.4f},scale=240:-2,tile=6x2", "-frames:v", "1", "-q:v", "4", str(sheet)])
        print(f"contact sheet: {sheet}  (one frame every {step:.2f}s, left to right, top to bottom)")
        return

    if not a.name or not a.name.replace("-", "").isalnum() or a.name != a.name.lower():
        sys.exit("give the slot file a lowercase name made of letters, digits and hyphens, e.g. bridal")
    if not 0 < a.dur <= MAX_SECONDS:
        sys.exit(f"--dur must be between 0 and {MAX_SECONDS:g} seconds")
    if a.start < 0 or a.start + a.dur > info["dur"] + 0.05:
        sys.exit(f"--start {a.start:g} + --dur {a.dur:g} runs past the end of the recording ({info['dur']:.2f}s)")
    if not 0 <= a.poster_at <= a.dur:
        sys.exit("--poster-at must fall inside the clip")

    x, y, w, h = 0, 0, info["w"], info["h"]
    if a.crop:
        try:
            x, y, w, h = (int(v) for v in a.crop.split(":"))
        except ValueError:
            sys.exit("--crop is x:y:w:h in whole pixels")
        if x < 0 or y < 0 or w <= 0 or h <= 0 or x + w > info["w"] or y + h > info["h"]:
            sys.exit(f"--crop {a.crop} does not fit inside {info['w']}x{info['h']}")
    if h < w:
        sys.exit("the cropped frame is landscape; the film slots are portrait (9:16). Choose a taller crop.")
    out_h = round(WIDTH * h / w / 2) * 2
    vf = f"crop={w}:{h}:{x}:{y},scale={WIDTH}:{out_h}:flags=lanczos,setsar=1"

    out = a.out_dir.resolve()
    out.mkdir(parents=True, exist_ok=True)
    mp4, jpg = out / f"{a.name}.mp4", out / f"{a.name}.jpg"
    run(["ffmpeg", "-y", "-v", "error", "-ss", f"{a.start:.3f}", "-i", str(a.recording), "-t", f"{a.dur:.3f}",
         "-vf", vf, "-an", "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-preset", "slow",
         "-crf", str(CRF), "-r", "30", "-movflags", "+faststart", "-map_metadata", "-1", str(mp4)])
    run(["ffmpeg", "-y", "-v", "error", "-ss", f"{a.start + a.poster_at:.3f}", "-i", str(a.recording),
         "-vf", vf, "-frames:v", "1", "-q:v", "3", "-map_metadata", "-1", str(jpg)])

    made = probe(mp4)
    shown = lambda f: f.relative_to(ROOT) if ROOT in f.parents else f
    print(f"wrote {shown(mp4)}  {made['w']}x{made['h']}, {made['dur']:.2f}s, {mp4.stat().st_size / 1024:.0f} kB, no audio")
    print(f"wrote {shown(jpg)}  {jpg.stat().st_size / 1024:.0f} kB")
    print(f"\nNow, in scripts/amairanymua-01/site.mjs, set the slot's file and describe the clip:\n"
          f"    f1: {{ n: 1, file: '{a.name}', ..., alt: 'Silent looping clip: <what it shows>.' }}\n"
          f"then:  node scripts/amairanymua-01-build.mjs && node scripts/amairanymua-01-check.mjs")


if __name__ == "__main__":
    main()
