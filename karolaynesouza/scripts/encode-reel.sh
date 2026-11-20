#!/usr/bin/env bash
# Encode one of her clips for the site: 720px wide, muted, VP9 webm + H.264 mp4 + a poster jpg.
#   bash scripts/encode-reel.sh <input.mp4> <name> [poster-second]
# Writes public/media/<name>.webm, <name>.mp4, <name>.jpg. Then add the clip to MEDIA in
# src/lib/content.ts (heroFilm for a clip with no burned-in text, pinnedFilm, or reels[]).
set -euo pipefail
in="$1"; name="$2"; at="${3:-1}"
out="$(cd "$(dirname "$0")/.." && pwd)/public/media"; mkdir -p "$out"
vf="scale=720:-2:flags=lanczos,fps=30"
ffmpeg -y -loglevel error -i "$in" -an -vf "$vf" -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -deadline good -cpu-used 4 "$out/$name.webm"
ffmpeg -y -loglevel error -i "$in" -an -vf "$vf" -c:v libx264 -preset veryfast -crf 23 -pix_fmt yuv420p -profile:v high -movflags +faststart "$out/$name.mp4"
ffmpeg -y -loglevel error -ss "$at" -i "$in" -frames:v 1 -vf "scale=720:-2:flags=lanczos" -q:v 2 "$out/$name.jpg"
ls -la "$out/$name".*
