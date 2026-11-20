#!/usr/bin/env bash
# Builds web media from the curated package. Originals are never modified.
# Usage: scripts/media.sh <folder holding the three unzipped Luciana zips>
#   (expects <src>/pkg, <src>/v1, <src>/v2 as unzipped by JP's package layout)
set -euo pipefail
SRC="${1:?path to unzipped package root}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/assets"
IMG="$OUT/img"; VID="$OUT/video"
mkdir -p "$IMG" "$VID"
C="$SRC/pkg/curated"; V1="$SRC/v1/curated/videos"; V2="$SRC/v2/curated/videos"

# ---------- stills → WebP at 480/800/1280 (never upscaled) ----------
still () { # name source [extra convert ops]
  local name="$1" src="$2"; shift 2
  local w; w=$(identify -format '%w' "$src")
  for t in 480 800 1280; do
    [ "$t" -gt "$w" ] && [ "$t" -ne 480 ] && continue
    convert "$src" "$@" -auto-orient -strip -resize "${t}x>" -quality 72 -define webp:method=6 "$IMG/${name}-${t}.webp"
  done
}
still luciana-portrait "$C/hero/hero-still-01_luciana-tweezers-brow-portrait.jpg"
still luciana-mirror   "$C/hero/hero-still-02_luciana-LA-mirror-seated.jpg"
still studio-room      "$C/hero/hero-still-03_studio-room-LA-logo-glow.jpg"
still studio-mirror    "$C/brand/b01_studio-organic-mirror-LED.jpg"
still studio-cart      "$C/brand/b02_studio-gold-cart-products.jpg"
still studio-lounge    "$C/brand/b03_studio-lounge-script-wall-certificate.jpg"
still luciana-blazer   "$C/brand/b04_luciana-black-blazer-full.jpg"
still luciana-standing "$C/brand/b07_luciana-standing-beige.jpg"
for f in "$C"/results/r*.jpg; do
  b=$(basename "$f" .jpg); still "${b%%_*}" "$f"
done
still masculino "$SRC/v2/reference/other-results/design-masculino.jpg" -rotate 90
# hero posters
still hero1-poster "$C/hero/hero-reel-01_poster_1280x720.jpg"
still hero2-poster "$C/hero/hero-reel-02_poster_1280x720.jpg"

# ---------- videos: silent, faststart, lighter web encodes ----------
enc () { # out in vf start dur crf
  ffmpeg -v error -y -ss "$4" -t "$5" -i "$2" -an -vf "$3" -c:v libx264 -preset slow -crf "$6" \
    -pix_fmt yuv420p -profile:v high -movflags +faststart "$VID/$1.mp4"
  ffmpeg -v error -y -ss 0.4 -i "$VID/$1.mp4" -frames:v 1 -q:v 3 "$VID/$1-poster.jpg"
  convert "$VID/$1-poster.jpg" -quality 70 "$VID/$1-poster.webp" && rm "$VID/$1-poster.jpg"
}
enc hero1      "$C/hero/hero-reel-01_brow-lamination-lash-lifting_Dc2Ww-Lu7Z6_1280x720.mp4" "scale=1280:-2" 0 14.6 27
enc hero2      "$C/hero/hero-reel-02_design-lash-lifting_DelNwKNuXN5_1280x720.mp4"          "scale=1280:-2" 0 12 27
enc v01-lamination "$V1/landscape-results/v01_brow-lamination_DRZ-SbADkVR_1280x720.mp4"     "crop=576:720:352:0,scale=480:600" 1 11 29
enc v03-six-weeks  "$V1/landscape-results/v03_brow-lamination-6-semanas-design-tintura_DIFzpwmxwI5_1280x720.mp4" "scale=960:-2" 0 12 29
enc v04-process    "$V1/landscape-results/v04_design-com-tintura-process_DNw5lKcWAK8_1280x720.mp4" "crop=576:720:300:0,scale=480:600" 0 11 29
enc v05-lash       "$V2/vertical-lash-macros/v05_lash-lifting-perfeicao_DQ3Kg65jtlj_720x1280.mp4"   "scale=432:-2" 0 12 29
enc v06-lash       "$V2/vertical-lash-macros/v06_lash-lifting-naturalidade_DSVx4yWAaVI_720x1280.mp4" "scale=432:-2" 0 12 29

# ---------- OG image 1200×630 from the hero poster ----------
convert "$C/hero/hero-reel-01_poster_1280x720.jpg" -gravity center -crop 1200x630+0+0 +repage -quality 82 "$OUT/og-default.jpg"
echo "done"; du -sh "$IMG" "$VID"
