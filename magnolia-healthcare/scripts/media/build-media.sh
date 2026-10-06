#!/usr/bin/env bash
# Encodes the procedurally rendered hero film into aggressively optimised web/mobile
# formats and writes the poster. Run from anywhere:  bash scripts/media/build-media.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
TMP="${TMPDIR:-/tmp}/magnolia-hero-frames"
rm -rf "$TMP"; mkdir -p "$TMP" public/media
python3 scripts/media/hero-film.py "$TMP"
# H.264 (universal, incl. iOS Safari): 1280x720, 24fps, silent, faststart for instant playback
ffmpeg -y -loglevel error -framerate 24 -i "$TMP/f%04d.png" -an -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p \
  -preset slow -crf 30 -g 48 -movflags +faststart public/media/hero-film.mp4
# VP9 (smaller for Chrome/Firefox/Android)
ffmpeg -y -loglevel error -framerate 24 -i "$TMP/f%04d.png" -an -c:v libvpx-vp9 -pix_fmt yuv420p -b:v 0 -crf 40 -row-mt 1 -deadline good -cpu-used 2 public/media/hero-film.webm
# Poster = first frame (also the reduced-motion / Save-Data / no-JS still)
ffmpeg -y -loglevel error -i "$TMP/f0000.png" -vf scale=1600:-2 -q:v 4 public/media/hero-poster.jpg
ls -la public/media
