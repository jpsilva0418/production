#!/usr/bin/env bash
# Sass by Kass — turns the client's supplied phone media into web assets.
#   bash scripts/media/import-client-media.sh <uploads-dir>
# Photos  -> src/assets/plates/<name>.jpg   (EXIF stripped, ≤1400px long edge, q86; Astro makes the responsive set)
# Videos  -> public/media/<name>.{mp4,webm,jpg}  (9:16 crop, 720×1280, no audio, poster frame)
# Usage of each file is recorded in docs/MEDIA.md.
set -euo pipefail
UP="${1:?uploads dir}"
HERE="$(cd "$(dirname "$0")/../.." && pwd)"
PL="$HERE/src/assets/plates"; MD="$HERE/public/media"
mkdir -p "$PL" "$MD"

photo() { # photo <upload-id> <name>
  local src=""; for c in "$UP"/$1-*; do src="$c"; break; done
  [ -f "$src" ] || { echo "missing upload $1" >&2; exit 1; }
  python3 - "$src" "$PL/$2.jpg" <<'PY'
import sys; from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open(sys.argv[1])).convert('RGB')
im.thumbnail((1400, 1400), Image.LANCZOS)
im.save(sys.argv[2], 'JPEG', quality=86, optimize=True, progressive=True)
print(sys.argv[2].split('/')[-1], im.size)
PY
}
film() { # film <upload-id> <name> <poster-seconds>
  local src=""; for c in "$UP"/$1-*.mov; do src="$c"; break; done
  [ -f "$src" ] || { echo "missing upload $1" >&2; exit 1; }
  # exact 9:16 centre crop, then 720x1280
  local vf="crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale=720:1280:flags=lanczos,fps=30,format=yuv420p"
  ffmpeg -v error -y -i "$src" -an -vf "$vf" -c:v libx264 -preset slow -crf 25 -profile:v high -level 4.0 -movflags +faststart "$MD/$2.mp4"
  ffmpeg -v error -y -i "$src" -an -vf "$vf" -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -deadline good -cpu-used 2 "$MD/$2.webm"
  ffmpeg -v error -y -ss "$3" -i "$MD/$2.mp4" -frames:v 1 -q:v 3 "$MD/$2.jpg"
  echo "$2: $(du -h "$MD/$2.mp4" | cut -f1) mp4, $(du -h "$MD/$2.webm" | cut -f1) webm"
}

# ---- Kass ----
photo 9868bac5 kass-portrait      # black blazer, hands in hair (About / home intro)
photo 73326243 kass-laptop        # black blazer with laptop (booking page)
# 177e2cba "Meet your hairstylist" card: reference only, kept in docs/reference (personal details are hers to publish)
# ---- her work · colour ----
photo 93bfe7bd glam-blonde        # blonde glam waves, dark backdrop
photo 6a3f9f1c balayage-back      # blonde lived-in colour from behind, salon
photo 2f340d1b brunette-dimension # brunette dimensional highlights, salon
# ---- her work · bridal & occasions ----
photo 21f7fbc8 bride-veil         # bride & groom, veil in the wind
photo 81680e1d autumn-embrace     # bride & groom, autumn, soft updo
photo 027bf845 autumn-lookback    # bride looking back, beaded gown, polished waves
photo 48fa06b1 bride-mother       # bride & mother, getting ready
photo 9a7c0202 bridesmaids        # bride & bridesmaids in yellow
photo 63376aea first-dance        # first dance under the tent
photo 1880651a prosecco           # bride & bridesmaids, getting ready
photo 7f22900e boat               # engagement session on a boat, half-up style

# ---- films (all vertical phone clips) ----
film 405d632c hero-film 7.5       # brunette dimensional colour · foils then the reveal
film 5198f512 cine-film 3.0       # long dark glam waves, salon
film 2b0d6192 reel-blonde 6.0     # blonde lived-in colour reveal with face-framing layers
film 47bda62c reel-bride 2.0      # bride, sleek half-up style, getting-ready room

# ---- Open Graph card (1200×630) from the bridal veil photograph ----
python3 - "$PL/bride-veil.jpg" "$MD/og-default.jpg" <<'PY'
import sys; from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); w, h = im.size
tw, th = 1200, 630; s = max(tw / w, th / h); im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
w, h = im.size; left = (w - tw) // 2; top = int((h - th) * 0.18)
im.crop((left, top, left + tw, top + th)).save(sys.argv[2], 'JPEG', quality=84, optimize=True, progressive=True)
print('og-default.jpg 1200x630')
PY
echo done
