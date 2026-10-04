# JP Media — Website Art Direction Study

Private prospect preview for **JP Silva / JP Media** (filmmaker · producer · photographer, Austin, Texas).
One hub, six complete homepage directions. Static HTML/CSS/JS, no build step, no dependencies.
Every page is `noindex,nofollow`; nothing here is a live site.

```
jp-media/
  index.html  hub.css  hub.js        the hub: six directions, each name set in its own typeface
  concept-01/ … concept-06/          one complete homepage each: index.html, concept.css, concept.js
  shared/
    base.css                         reset · motion gate · reveal grammar · media frames · grain · study nav
    core.js                          gate · reveal · entrance sequencer · video gating · frame loop · study nav
    media.js                         JP_STUDY (concept list) + JP_MEDIA (plates, loops, works, verified facts)
  media/
    plates/                          procedural stills (light, haze, horizon, metal, paper, grain) + small variants
    loops/                           five 3 s seamless loops: webm + mp4 + poster
    grain-256.png                    tileable grain for CSS overlays
  tools/make-plates.py               regenerates every plate and loop (Pillow, numpy, ffmpeg)
```

| # | Concept | Territory | Ground |
|---|---|---|---|
| 01 | Picture Start | Cinema / opening titles | black |
| 02 | Folio | Editorial / gallery, art book | bone paper |
| 03 | Dust & Light | Texas / analog | umber, low sun |
| 04 | Silver | Production house / modernist | gunmetal + light panels |
| 05 | Soundcheck | Kinetic / music / culture | black + stage red |
| 06 | Still | Quiet cinema / luxury minimalism | near-white |

## Run it

Serve the repository root (or this folder) with any static server and open `/jp-media/index.html`:

```bash
python3 -m http.server 8787        # from the repository root → http://127.0.0.1:8787/jp-media/
```

## About the frames

JP's stills and footage were not available when this study was built (nothing was uploaded to the session
and his site, Instagram and YouTube are blocked from the build sandbox). Every frame therefore carries a
**procedural stand-in** made of light, haze and grain. Nothing is a photograph and nothing is borrowed from
another client. Project titles are working labels.

To bring in real selects: drop files into `media/` and edit the `plates`, `loops` and `works` entries in
`shared/media.js` (or the `src`/`srcset`/`poster` attributes in a concept). Keep the aspect ratios of the slots
or let `object-fit: cover` crop; no layout changes are needed.

## Conventions that every concept follows

- **Finished at rest.** Base styles are the final state. Hide-states exist only under `html.js-anim`, which an
  inline gate adds before paint when JavaScript runs and motion is allowed. No JS, a failed script, or
  `prefers-reduced-motion` renders the page complete. A 4 s head fallback and a 12 s sequencer guard make it
  impossible for an entrance to hold the page.
- **One entrance per concept**, skippable on tap, wheel or key; shortened on the second visit in a session.
- **Video** is declarative (`muted playsinline loop autoplay`, real sources, poster first); it fades in on
  `playing`, pauses off-screen, self-removes on error and is dropped entirely under reduced motion or Save-Data.
  One playing loop per viewport.
- **Mobile first**: 390/430 designed, 1440 designed, `100svh`, no horizontal scroll, 44 px targets, no hover-only
  functionality, native scroll-snap strips for horizontal sequences.
- **Nothing fabricated**: no clients, awards, press, testimonials, logos or statistics. No email address is
  published; "Email" controls are demo-safe. Verified facts live in `shared/media.js → JP_MEDIA.person`.
- **Only external resource**: Google Fonts.

## If a direction is chosen

Each concept is a self-contained page that can become the production site: port it into the stack of choice,
replace the plates with selects, wire the contact control, add canonical/OG image/sitemap/schema for the real
domain, and remove the study nav (`data-concept` on `<body>`) and the `noindex` meta.
