#!/usr/bin/env bash
# Long-form films WITH their soundtracks, from the founder-supplied exports (512 px short side).
# H.264/AAC mp4 (every real browser) + VP9/Opus webm (free codec, also what headless test browsers decode).
# Output: public/media/films/<slug>.{mp4,webm} and <slug>-poster.jpg
set -e
SRC=${1:-/root/.claude/uploads/e0535f77-93e9-53c6-ad6d-7e3e5a4f6f1f}
OUT=$(cd "$(dirname "$0")/.." && pwd)/public/media/films
mkdir -p "$OUT"
enc () { # slug file crop posterAt
  local slug=$1 src=$SRC/$2 vf="$3,format=yuv420p" at=$4
  ffmpeg -v error -y -i "$src" -vf "$vf" -c:v libx264 -preset slow -crf 25 -profile:v high -c:a aac -b:a 128k -ac 2 -movflags +faststart "$OUT/$slug.mp4"
  ffmpeg -v error -y -i "$src" -vf "$3" -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -c:a libopus -b:a 96k "$OUT/$slug.webm"
  ffmpeg -v error -y -ss "$at" -i "$src" -vf "$3" -frames:v 1 -q:v 2 "$OUT/$slug-poster.jpg"
  printf '  %-16s %6s KB mp4 %6s KB webm  %ss\n' "$slug" $(( $(stat -c%s "$OUT/$slug.mp4")/1024 )) $(( $(stat -c%s "$OUT/$slug.webm")/1024 )) "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/$slug.mp4" | cut -d. -f1)"
}
enc showreel       aa5ebb59-CC9A073A-8C9D-4101-B308-CB7FE9C7FB28.mp4 "crop=478:960:34:0"  27.9
enc field-at-dusk  6d047996-8E5C4E66-C22C-4BC7-BF0E-106CAFCAC56E.mp4 "crop=824:462:14:6"  36.4
enc western        96fa1dda-3F8718DD-9D75-4B53-9F55-925675F7DE3F.mp4 "crop=630:496:0:6"   57.2
enc night-ride     7bb0c291-431DE943-BCB5-408F-A4C2-210526CC87A1.mp4 "crop=734:384:5:80" 16.8
enc desert-highway b55681d7-D41FC76B-25B5-430E-9DFD-7D36325BF1B6.mp4 "crop=654:450:0:24"  3.2
enc forest-rain    aa460874-FA2A1871-53B2-47E7-9672-1846940C9071.mp4 "crop=486:950:5:0"   12.9
enc at-the-sea     54a3b54a-42792596-3370-419B-A83E-DA225EA98AEA.mp4 "crop=490:378:20:320" 27.6
