# Media inventory, sources and licences

**Status: every image and video in this demo is a temporary, procedurally generated asset
created inside this repository. No third-party media, stock footage, scraped imagery or
photographs of real people are used anywhere.** Nothing here needs a licence; nothing here
should remain in a production site either.

## Why there is no real footage yet

This build environment's network policy blocks every stock-media host (Pexels, Pixabay, Coverr,
Mixkit, Unsplash, Wikimedia) as well as Magnolia's own site, so licensed clips could not be
fetched and optimised here. The cinematic hero *system* is therefore demonstrated with an
ambient film; swapping in a real clip is a two-file change.

## Generated assets

| Asset | Where | Made by | Replace with |
|---|---|---|---|
| `public/media/hero-film.mp4` / `.webm` | Home prologue (`src/components/Prologue.astro`) | `scripts/media/hero-film.py` + `build-media.sh` (numpy + ffmpeg): 1280×720, 24 fps, 10 s seamless loop, silent; H.264 crf 30 (~190 KB) and VP9 crf 40 (~40 KB) | A licensed 10–20 s clip: caregiver and older adult at home, warm daylight, no dialogue, 16:9. Encode with the same ffmpeg flags; target ≤ 2 MB mp4. Keep `preload="none"` + poster behaviour. |
| `public/media/hero-poster.jpg` | Hero poster / reduced-motion still / Save-Data still | first frame, 1600 px wide | The clip's best frame, 1600 px, ~80 quality |
| `public/media/og-default.jpg` | Open Graph share image | `scripts/media/plates.mjs` (1200×630) | Brand share image with the real logo |
| `src/assets/plates/*.jpg` | Every photo slot (see table below) | `scripts/media/plates.mjs` — Chromium-rendered gradient + magnolia line illustration + grain, with a baked "Demo placeholder" label | Owner photography (with written consent from everyone pictured) or licensed stock, same aspect ratio, same file name |
| `public/favicon.svg`, `src/components/Mark.astro` | Favicon, header, footer, prologue veil | Hand-drawn magnolia glyph (SVG) | Magnolia's official logo artwork (SVG preferred) |

### Plate slots (aspect ratio · where used · what the real photograph should show)

| Plate | Ratio | Used on | Subject for the real photo |
|---|---|---|---|
| `home` | 4:3 | Home chapter i | Caregiver and client at home, daylight |
| `personal-care` | 4:3 | Home services card, /services, /services/personal-care | Respectful personal-care moment (hands, assistance with mobility) |
| `homemaking` | 4:3 | same | Kitchen / meal preparation, tidy home |
| `companionship` | 4:3 | same, /community | Conversation, a walk, a game |
| `dementia` | 4:3 | same | Calm routine, familiar objects, patient presence |
| `cine` | 21:9 | Home cinema band | Wide, quiet domestic scene |
| `cine-light` | 21:9 | Home finale, /mission band | Warm wide scene, lighter tone |
| `founder` | 4:5 | Home mission chapter, /mission, /team | Madina Sorensen portrait |
| `team-1..3` | 4:5 | /team, /careers | Caregiver portraits — only those Magnolia chooses to publish |
| `mission` | 4:3 | /community gallery | Community event |
| `community`, `office` | 4:3 | /community gallery | Event photos; the Arvada office |
| `blog-1..6` | 3:2 | Blog cards and article heroes | Editorial imagery per article |

## Production rule

Before launch, every entry above must be replaced and this file updated with: file name, source
(owner / photographer / stock library), licence (and licence ID or invoice), and the consent
record for identifiable people. A row without a documented licence does not ship.
