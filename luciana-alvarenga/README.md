# Studio Luciana Alvarenga — website demo (3 home-page variations)

Free demo by JP Silva Digital. Built on the Leti Silva Beauty foundation (ported from the real
`leti-silva-beauty` source: `tokens.css`, `v2.css`, home page, header/menu, footer, runway script),
re-dressed in Luciana's "Champagne Glow" identity. PT-BR first, PT | EN toggle (saved in `localStorage`).

## The three variations
| | Name | Hero | Rhythm | Headline |
|---|---|---|---|---|
| I | **Champagne Glow** | full-bleed video, scrim + grain + breathing LED glow | porcelain / sand, noir signature, studio fades to noir | AQUI SEU OLHAR / É MINHA RESPONSABILIDADE |
| II | **Noir Dourado** | split screen: type on noir, video in a framed panel | noir-led, Bodoni italic, Marcellus caps, light signature | REALÇAR OLHARES / *valorizar a beleza* |
| III | **Atelier Porcelana** | light hero, video inside her brand arch with LED halo (from the "VEM AÍ" render) | porcelain-led, arches on cards | MAIS QUE UM ESTÚDIO / *uma nova experiência* |

All three share the same home order: Hero → A Artista → Resultados (pinned runway) → Brow Lamination
(signature) → Serviços → Lash Lifting → O Estúdio → Antes de agendar → Depoimentos → Final CTA → Footer,
plus the mobile WhatsApp bar, edge rails, back-to-top, and a full reduced-motion / saveData fallback.

## Files
- `dist/preview/*.html` — **one self-contained file per variation** (fonts, images and videos inlined, ~6.8 MB). Opens anywhere, including straight from a phone.
- `dist/site/` — the deployable version (linked WebP `srcset`, lazy video, `index.html` lists the 3 variations).
- `src/` — `build.mjs` (template + variations), `content.mjs` (all PT/EN strings + her quotes), `styles.css`, `runtime.js`.
- `scripts/media.sh` — rebuilds `assets/` from the three unzipped client zips (originals untouched).

## Live link (how JP reviews it)
**https://jpsilvadigital.com/demo/luciana-alvarenga-01** — variations II and III at `/noir-dourado` and
`/atelier-porcelana`; each page's footer links to the other two. Publish after any change with
`node src/build.mjs --publish` (writes into `jp-web-design/public/demo/`, see `jp-web-design/DEMOS.md`),
then deploy the site. Never hand over the HTML files alone — they don't open on a phone.

## Run / deploy (standalone)
```
node src/build.mjs                 # needs ImageMagick `identify`; writes dist/
npx serve dist/site                # or any static server
```
Netlify / Vercel / Cloudflare Pages: static site, publish directory `dist/site`, no build command
(or build command `node src/build.mjs`). Remove `<meta name="robots" content="noindex">` at launch.

## Video choices
Hero: `hero-reel-01` (brow lamination + lash lifting, the smile) crossfading into `hero-reel-02`.
Runway: v01 (cropped 4:5), v05 (9:16 arch), v04 (the process). Signature: v03 (~6 weeks).
Lash section: v06. **Not used:** v09 (text overlays + countdown read as an IG story, not a luxury
site), v02 / v07 / v08 (kept for the service pages). Web encodes are silent H.264, 0.3–1 MB each.

## Remaining placeholders (all visible on the page or marked in comments)
- `[ENDEREÇO]` — studio address (footer, policies, studio section, JSON-LD)
- `[HORÁRIO]` — Mon–Sat hours (menu footer, policies). Sunday closed is the only published rule. `[CONFIRMAR]`
- `[DURAÇÃO]` ×6 and `[PREÇO]` ×6 — service cards ("Valor sob consulta" shown)
- `[Depoimento real …] — [NOME]` ×3 — testimonials (never invented)
- `[CONFIRMAR: políticas 2027]` — policies are the Dec 2026 flyer wording, lightly edited
- Domain `studiolucianaalvarenga.com.br` — assumed in canonical / OG / JSON-LD
- JSON-LD `openingHoursSpecification` — TODO
- Logo — recreated SVG ("recreated, replace with the vector")
- Her quote "atende todos os tipo de gostos" was normalized to "tipos" — revert if she prefers verbatim
- Design masculino card uses `reference/other-results/design-masculino.jpg` (rotated upright) — confirm consent

## Not built yet
`/sobrancelhas`, `/lash-lifting`, `/agendar` — the next step once a variation is chosen. In-page links
currently point to the matching home sections.
