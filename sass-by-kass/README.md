# Sass by Kass — premium website demo

A private design demo for **Sass by Kass** (Kassandra, Massachusetts hair stylist —
hand-tied extensions, dimensional color, bridal hair), built on the approved client-demo
template (Astro 7, static, no UI framework) with the client's own photos, clips and
business facts as the only source of truth.

> This is a demo. It is `noindex,nofollow,noarchive` everywhere, carries a visible
> "Design demo" badge, never sends form submissions anywhere unless delivery secrets are
> deliberately set, and is never pointed at the client's real domain.

- Media inventory and provenance: `docs/MEDIA.md`
- Blue directions under review: `src/styles/palettes.css` (A deep navy · B modern royal · C soft blue)

## Run

Requires Node 22.12+.

```bash
npm ci
npm run dev       # http://localhost:4321  → /preview/a, /preview/b, /preview/c
npm run check     # astro check (types + content)
npm run build     # static build -> dist/
```

Re-import the client's media from the uploads folder (needs ffmpeg + Pillow):

```bash
bash scripts/media/import-client-media.sh <uploads-dir>
```

## Structure

```
src/
  consts.ts            every business fact (from the client's supplied materials) — single source of truth
  lib/content.ts       all copy, media map and portfolio groups
  lib/palette.ts       the three directions; DEMO_PALETTE locks a client build to one
  content/services     the four services her materials support (no pricing modelled)
  styles/tokens.css    token roles + default values · palettes.css the three directions · system.css shared grammar
  layouts/BaseLayout   HTML shell, SEO, header/footer, palette switch, shared runtime (menu, reveals, films)
  components/          Hero, Home (the five chapters), Film, WorkTile, EnquiryForm, Header, Footer, Mark, PaletteBar
  pages/               /  /work  /services  /about  /book  /preview/[a|b|c]  404
api/inquiry.js         Vercel function: enquiries (Resend when configured, else demo mode)
scripts/snapshot-demo.mjs   publishes one locked direction into the JP Silva Digital demo library
```

## Publishing the private demo

`node scripts/snapshot-demo.mjs <slug> <a|b|c> --lib <path-to>/jp-web-design/public/demo`
builds the chosen direction as a frozen, unlisted `/demo/<slug>` (noindex, demo-only forms,
no review bar, no /preview routes). The library's existing demos are never touched.
