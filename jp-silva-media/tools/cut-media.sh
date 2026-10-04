#!/usr/bin/env bash
# Curated cuts from JP Silva's supplied films (sources are iMessage-compressed exports, 512 px short side).
# Produces muted h264 + vp9 loops with posters, and still frames. Re-run when better masters arrive.
set -e
SRC=${1:-/root/.claude/uploads/e0535f77-93e9-53c6-ad6d-7e3e5a4f6f1f}
OUT=$(cd "$(dirname "$0")/.." && pwd)/media
FILM=$OUT/film; STILLS=$OUT/stills; mkdir -p "$FILM" "$STILLS"
M=$SRC/aa5ebb59-CC9A073A-8C9D-4101-B308-CB7FE9C7FB28.mp4   # montage / showreel (portrait)
FD=$SRC/6d047996-8E5C4E66-C22C-4BC7-BF0E-106CAFCAC56E.mp4  # field at dusk MV
W=$SRC/96fa1dda-3F8718DD-9D75-4B53-9F55-925675F7DE3F.mp4   # B&W western MV
NR=$SRC/7bb0c291-431DE943-BCB5-408F-A4C2-210526CC87A1.mp4  # night ride
CH=$SRC/b55681d7-D41FC76B-25B5-430E-9DFD-7D36325BF1B6.mp4  # desert highway chopper
FO=$SRC/aa460874-FA2A1871-53B2-47E7-9672-1846940C9071.mp4  # forest in rain (portrait)
JP=$SRC/54a3b54a-42792596-3370-419B-A83E-DA225EA98AEA.mp4  # JP at the sea (letterboxed portrait)

clip () { # name src start dur [vf]
  local name=$1 src=$2 ss=$3 t=$4 vf=${5:-null}
  ffmpeg -v error -y -ss "$ss" -t "$t" -i "$src" -vf "$vf,fps=30,format=yuv420p" -an -c:v libx264 -preset slow -crf 26 -movflags +faststart -pix_fmt yuv420p "$FILM/$name.mp4"
  ffmpeg -v error -y -ss "$ss" -t "$t" -i "$src" -vf "$vf,fps=30" -an -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 "$FILM/$name.webm"
  ffmpeg -v error -y -ss "$ss" -i "$src" -vf "$vf" -frames:v 1 -q:v 3 "$FILM/$name-poster.jpg"
  printf '  %-22s %5s KB mp4  %5s KB webm\n' "$name" $(( $(stat -c%s "$FILM/$name.mp4")/1024 )) $(( $(stat -c%s "$FILM/$name.webm")/1024 ))
}
FDC="crop=846:470:14:0"; NRC="crop=738:390:20:78"; CHC="crop=656:450:0:24"; WC="crop=636:500:0:6"
still () { # name src time [vf]
  ffmpeg -v error -y -ss "$3" -i "$2" -vf "${4:-null}" -frames:v 1 -q:v 2 "$STILLS/$1.jpg"
}

MVF="crop=490:960:22:0"   # montage: trim black edges
if [ -z "$SKIP_MONTAGE" ]; then
echo "montage cuts (portrait 490x960)"
clip m-hat      "$M" 0.0  1.6 "$MVF"
clip m-truck    "$M" 1.6  1.5 "$MVF"
clip m-concert  "$M" 5.25 0.33 "$MVF"   # crowd, arms up; a brand card follows at 5.63 — never extend
clip m-bts      "$M" 7.4  1.8 "$MVF"
clip m-wing     "$M" 12.2 1.6 "$MVF"
clip m-moto     "$M" 21.4 2.6 "$MVF"
clip m-sunset   "$M" 27.5 1.8 "$MVF"
clip m-bokeh    "$M" 30.65 0.65 "$MVF"  # sparks only; a brand card precedes at 30.3 and lettering follows at 31.6
clip m-studio   "$M" 32.2 1.6 "$MVF"
clip m-horse    "$M" 36.8 1.5 "$MVF"
clip m-bw       "$M" 38.3 3.0 "$MVF"
clip m-rooftop  "$M" 44.4 3.2 "$MVF"
# 12 s hero edit: eight cuts, hard cuts, no audio
ffmpeg -v error -y \
 -ss 0.0 -t 1.5 -i "$M" -ss 1.6 -t 1.4 -i "$M" -ss 5.25 -t 0.33 -i "$M" -ss 12.2 -t 1.4 -i "$M" -ss 21.4 -t 1.8 -i "$M" \
 -ss 27.5 -t 1.4 -i "$M" -ss 36.8 -t 1.2 -i "$M" -ss 38.3 -t 1.6 -i "$M" -ss 44.4 -t 2.0 -i "$M" \
 -filter_complex "[0:v]$MVF,fps=30,setpts=PTS-STARTPTS[a];[1:v]$MVF,fps=30,setpts=PTS-STARTPTS[b];[2:v]$MVF,fps=30,setpts=PTS-STARTPTS[c];[3:v]$MVF,fps=30,setpts=PTS-STARTPTS[d];[4:v]$MVF,fps=30,setpts=PTS-STARTPTS[e];[5:v]$MVF,fps=30,setpts=PTS-STARTPTS[f];[6:v]$MVF,fps=30,setpts=PTS-STARTPTS[g];[7:v]$MVF,fps=30,setpts=PTS-STARTPTS[h];[8:v]$MVF,fps=30,setpts=PTS-STARTPTS[i];[a][b][c][d][e][f][g][h][i]concat=n=9:v=1:a=0,format=yuv420p[v]" \
 -map "[v]" -an -c:v libx264 -preset slow -crf 25 -movflags +faststart "$FILM/hero-montage.mp4"
ffmpeg -v error -y -i "$FILM/hero-montage.mp4" -an -c:v libvpx-vp9 -b:v 0 -crf 35 -row-mt 1 "$FILM/hero-montage.webm"
ffmpeg -v error -y -i "$FILM/hero-montage.mp4" -frames:v 1 -q:v 3 "$FILM/hero-montage-poster.jpg"
echo "  hero-montage $(( $(stat -c%s "$FILM/hero-montage.mp4")/1024 )) KB"
# full montage, muted, for a long-form treatment
ffmpeg -v error -y -i "$M" -vf "$MVF,fps=30,format=yuv420p" -an -c:v libx264 -preset slow -crf 27 -movflags +faststart "$FILM/montage-full.mp4"
ffmpeg -v error -y -i "$FILM/montage-full.mp4" -an -c:v libvpx-vp9 -b:v 0 -crf 37 -row-mt 1 "$FILM/montage-full.webm"
ffmpeg -v error -y -ss 0 -i "$M" -vf "$MVF" -frames:v 1 -q:v 3 "$FILM/montage-full-poster.jpg"
echo "  montage-full $(( $(stat -c%s "$FILM/montage-full.mp4")/1024 )) KB"

fi
echo "field at dusk (cropped 846x470)"
clip fd-fence     "$FD" 1.6  3.4 "$FDC"
clip fd-flare     "$FD" 35.4 4.0 "$FDC"
clip fd-truck     "$FD" 49.8 3.6 "$FDC"
clip fd-dance     "$FD" 60.4 3.6 "$FDC"
clip fd-headlights "$FD" 1:18.4 5.2 "$FDC"
echo "western b&w (680x512)"
clip w-ride       "$W" 0.0  3.0 "$WC"
clip w-draw       "$W" 9.0  3.0 "$WC"
clip w-silhouette "$W" 15.0 2.6 "$WC"
clip w-saguaro    "$W" 30.0 1.5 "$WC"
clip w-gallop     "$W" 36.0 2.4 "$WC"
clip w-aim        "$W" 39.0 2.6 "$WC"
clip w-portrait   "$W" 55.4 3.0 "$WC"
echo "night ride (778x512)"
clip nr-dash      "$NR" 4.5  3.0 "$NRC"
clip nr-silhouette "$NR" 15.2 3.2 "$NRC"
clip nr-headlight "$NR" 30.4 3.4 "$NRC"
echo "desert highway (656x512)"
clip ch-ride      "$CH" 1.5  3.4 "$CHC"
clip ch-road      "$CH" 9.4  3.4 "$CHC"
clip ch-camera    "$CH" 20.6 3.2 "$CHC"
echo "forest (portrait 492x960)"
clip fo-umbrella  "$FO" 2.9  2.2 "crop=492:960:4:0"
clip fo-trees     "$FO" 12.6 2.6 "crop=492:960:4:0"
clip fo-dance     "$FO" 15.7 3.0 "crop=492:960:4:0"
clip fo-fire      "$FO" 21.8 2.0 "crop=492:960:4:0"
echo "jp at the sea (band 504x390)"
clip jp-sea       "$JP" 25.0 6.0 "crop=504:390:8:312"
clip jp-sea-fade  "$JP" 36.0 6.0 "crop=504:390:8:312"

echo "stills"
still m-hat     "$M" 0.3  "$MVF";   still m-concert "$M" 5.4 "$MVF";  still m-wing "$M" 12.6 "$MVF"
still m-moto    "$M" 22.6 "$MVF";   still m-sunset  "$M" 28.0 "$MVF"; still m-bokeh "$M" 30.9 "$MVF"
still m-studio  "$M" 32.6 "$MVF";   still m-horse   "$M" 37.2 "$MVF"; still m-bw "$M" 39.6 "$MVF"; still m-rooftop "$M" 46.4 "$MVF"
for x in "fd-fence 3.2" "fd-flare 36.4" "fd-truck 50.6" "fd-silhouettes 24.9" "fd-headlights 1:22.2" "fd-clouds 1:23.6"; do set -- $x; still $1 "$FD" $2 "$FDC"; done
for x in "w-aim 9.3" "w-silhouette 16.2" "w-saguaro 30.4" "w-gallop 36.6" "w-skyward 40.6" "w-portrait 57.2" "w-hat 51.4"; do set -- $x; still $1 "$W" $2 "$WC"; done
for x in "nr-dash 6.2" "nr-silhouette 16.8" "nr-headlight 32.2"; do set -- $x; still $1 "$NR" $2 "$NRC"; done
for x in "ch-ride 3.2" "ch-road 10.2" "ch-camera 20.9" "ch-detail 8.0"; do set -- $x; still $1 "$CH" $2 "$CHC"; done
still fo-trees  "$FO" 12.9 "crop=492:960:4:0"; still fo-fire "$FO" 22.3 "crop=492:960:4:0"; still fo-umbrella "$FO" 3.3 "crop=492:960:4:0"
still jp-sea    "$JP" 27.6 "crop=504:390:8:312"; still jp-sea-rail "$JP" 31.0 "crop=504:390:8:312"
du -sh "$FILM" "$STILLS"; ls "$STILLS" | wc -l
