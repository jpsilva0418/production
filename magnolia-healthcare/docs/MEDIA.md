# Media inventory, sources and licences

**Status: demo only.** Per the owner's instruction, the demo uses the client's *supplied* imagery
and clips plus generated placeholders, all labelled. Nothing is scraped from the client's site or
any other site. Before launch every row must carry a documented licence or consent record.

## Supplied by the client (used as-is, labelled "supplied imagery")

| Asset | Where | Note |
|---|---|---|
| `src/assets/plates/supplied-team-5.jpg` | Home chapter i, /mission | Five-person team photo in front of the painted-magnolia sign. Appears generated/stock; the woman in white at the centre is the founder (confirmed). |
| `src/assets/plates/founder.jpg` | /mission portrait | 4:5 crop of the founder from the photo above (low resolution — a real portrait should replace it). |
| `src/assets/plates/supplied-team.jpg` | /careers | Four caregivers in branded scrubs (lotus sign). |
| `src/assets/plates/supplied-clinician.jpg` | /careers | Clinician in blue scrubs with stethoscope. |
| `public/media/hero-film.mp4/.webm`, `hero-poster.jpg` | Home prologue | Supplied clip: companion walking arm-in-arm with an older woman down a bright corridor (3–17 s, warmed slightly, 1280×720, no watermark). |
| `public/media/cine-film.mp4/.webm`, `cine-poster.jpg` | Home cinema band | Supplied clip: caregiver helping an older woman with medication at a kitchen table (0–12 s). |
| `public/downloads/magnolia-healthcare-caregiver-application.pdf` | /careers, /apply | The client's own application form, offered for download exactly as the current site does. |

**Not used:** the two iStock clips supplied as previews carry the "iStock by Getty Images"
watermark (unlicensed comps) and the two dreamstime-watermarked photos likewise. They can be used
only after the licence is purchased and the clean files obtained.

## Generated placeholders (replace before launch)

| Asset | Where | Made by |
|---|---|---|
| `src/assets/plates/*.jpg` (other than the supplied ones) | Service cards, blog cards, finale | `scripts/media/plates.mjs` — gradient + magnolia line art + grain with a baked "Demo placeholder" label |
| `public/media/og-default.jpg` | Share image | `scripts/media/plates.mjs` |
| `public/favicon.svg`, `src/components/Mark.astro` | Favicon, header, footer, veil | Single-colour magnolia glyph standing in for the real logo (painted white magnolia in a gold ring, "MAGNOLIA ♥ HEALTHCARE") |

## Production rule

Before launch, every entry above must be replaced or documented with: file name, source (owner /
photographer / stock library), licence (and licence ID or invoice), and the consent record for
identifiable people. A row without a documented licence does not ship.
