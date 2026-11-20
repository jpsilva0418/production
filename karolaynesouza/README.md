# Karolayne Souza Beauty — website demo

A private design demo for **Karolayne Souza** (@karolaynesouzabeauty.us), Brazilian lash & brow
artist in Milford, MA. Built on the Sass by Kass rev-01 foundation (Astro, static, no UI
framework) with her own photos and published facts as the only source of truth.

> Demo only: `noindex,nofollow,noarchive` everywhere, a visible "Design demo" badge, a booking
> request form that never sends anything, and never pointed at her real domain.

- Facts: `src/consts.ts` — prices, links, address, offer (from her price list, Instagram, Linktree)
- Copy, prices and media map: `src/lib/content.ts`
- Directions: `src/styles/palettes.css` — **A Noir Studio** (published) · B Blush Noir · C Nude Espresso
- Her originals and their provenance: `media-intake/` (`brand-brief.md`, `sources.md`)

## Run

```bash
npm ci
npm run dev       # http://localhost:4321  → /preview/a, /preview/b, /preview/c
npm run build
```

## Adding her reels and posts

```bash
bash scripts/encode-reel.sh <clip.mp4> <name> [poster-second]   # 720px VP9 webm + H.264 mp4 + poster
```

Then in `src/lib/content.ts`: `MEDIA.heroFilm` (a clip with no burned-in text — the portrait stays
its poster/fallback), `MEDIA.pinnedFilm` (her best reel, pinned on the home page), `MEDIA.reels`
(mixed into the work grid). Photos go into `src/assets/plates/` (`lashes-*`, `brows-*`, `combo-*`)
plus one line in `PHOTOS`; a second portrait goes in as `MEDIA.plates.portraitAbout`.

## Publishing

```bash
node scripts/snapshot-demo.mjs karolaynesouza-01 a --lib ../jp-web-design/public/demo [--republish]
```

Builds direction A as a frozen, unlisted `/demo/karolaynesouza-01`; hashed assets go to the
append-only `/demo/_shared/assets/`, her media to `/demo/_shared/karolaynesouza/`. Other demos are
never touched.
