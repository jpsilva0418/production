# Media inventory — Sass by Kass

Every image and clip in this demo was supplied by the founder for this prospect (uploaded in
the build conversation, 2026-11-01). Nothing is stock; nothing is generated. Phone screen
recordings were cropped to 9:16, scaled to 720×1280, stripped of audio and given poster frames
(`scripts/media/import-client-media.sh`). Photos were EXIF-stripped and capped at 1400px.

## Before launch (not needed for a private demo)

- Confirm Kass has the right to publish each wedding photograph (photographer credit /
  licence) and her clients' consent to appear.
- A few frames show third-party brands (a prosecco label, a watch, a laptop logo,
  printed foils). Fine for a private demo; crop or swap for the live site if preferred.
- Replace the temporary "SK" monogram (`src/components/Mark.astro`, `public/favicon.svg`)
  with her real logo when she has one.

## Photographs · `src/assets/plates/`

| File | Size | Shows | Used |
|---|---|---|---|
| kass-portrait.jpg | 941×1260 | Kassandra, black blazer, hands in hair | Home ch. i, About title card |
| kass-laptop.jpg | 969×1295 | Kassandra holding a laptop | About "In motion" strip |
| kass-card.jpg | 1013×1400 | "Meet your hairstylist" social graphic (text baked in) | reference only — personal details are hers to publish |
| glam-blonde.jpg | 1051×1400 | Blonde glam waves, dark backdrop | Home work tiles, Follow strip, Extensions card, Work/Color |
| balayage-back.jpg | 1081×1400 | Blonde lived-in color from behind | Color card, Work/Color |
| brunette-dimension.jpg | 1058×1400 | Brunette lob with fine highlights | Home work tiles, Follow strip, Work/Color |
| bride-veil.jpg | 1059×1400 | Bride & groom, veil in the wind | Bridal card, Work/Bridal, Follow strip, OG card |
| autumn-embrace.jpg | 1050×1400 | Bride & groom, autumn, low bun | Home work tiles, Work/Bridal |
| autumn-lookback.jpg | 1314×1400 | Bride looking back, beaded gown | Home "Now booking brides", Work/Bridal |
| bride-mother.jpg | 1174×1400 | Bride & her mother getting ready | Work/Bridal |
| bridesmaids.jpg | 1320×1273 | Bride & six bridesmaids in yellow | Work/Bridal |
| first-dance.jpg | 1156×1400 | First dance under a tent | Work/Bridal |
| prosecco.jpg | 1315×1320 | Bride & bridesmaids getting ready | Work/Bridal |
| boat.jpg | 1187×1400 | Engagement session on a boat, half-up style | Styling card, Work/Occasions |

## Clips · `public/media/` (mp4 + webm + poster jpg, 720×1280, 30 fps, muted)

| File | Length | Shows | Used |
|---|---|---|---|
| hero-film | 9.6 s | Brunette dimensional color: foils, then the reveal (printed foils visible ~1 s) | Home hero, Work/Color |
| cine-film | 6.2 s | Long dark glam waves swept to one side, salon | Home pinned band, About strip, Work/Occasions, Extensions row |
| reel-blonde | 8.2 s | Blonde lived-in reveal with face-framing layers ("During"/"After" captions baked in) | Home work tiles, About strip, Color row, Work/Color |
| reel-bride | 7.7 s | Bride, sleek half-up style, getting-ready room | Home work tiles + brides section, About strip, Bridal row, Work/Bridal |

`og-default.jpg` (1200×630) is a crop of bride-veil.jpg.
