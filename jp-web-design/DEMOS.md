# Client demo library — `jpsilvadigital.com/demo/<slug>`

Unlisted design demos built for prospective clients. Each one lives at its own
permanent URL inside this site, is plain static files, and ships with the site's
normal Vercel deploy. No subdomains, no DNS, no separate project.

## Registry

| Slug | Client | What it is | Source |
| --- | --- | --- | --- |
| `jp-silva-media` | JP Silva Media | Filmmaker portfolio demo | hand-built, in this folder |
| `magnolia-01` | Magnolia Healthcare, Inc. (MA) | Concept 01 · Family, at Home | `jpsilva0418/production` → `magnolia-healthcare/`, see `DEMO.json` |
| `magnolia-05` | Magnolia Healthcare, Inc. (MA) | Concept 05 · Immersive Storytelling | same |
| `magnolia-07` | Magnolia Healthcare, Inc. (MA) | Concept 07 · Family, at Home · Evolved | same |
| `sass-by-kass-01` | Sass by Kass — Kassandra, hair stylist (MA) | Revision 03 · logo hero, signature entrance, bridal inquiry (republished 2026-11-11) | `jpsilva0418/production` → `sass-by-kass/`, see `DEMO.json` |
| `yariiimakeup-01` | YariiiMakeup — makeup & hair artist (Poinciana / Kissimmee, FL) | Concept 01 · All eyes on you: her logo draws and its eyes open onto a hero of her work in motion, portfolio of stills and film, About, demo-only inquiry form, Booksy booking (prospect concept, 2026-11-19) | hand-built, in this folder; notes in `docs/demo-yariiimakeup-01.md` |
| `amairanymua-01` | Amairany Sierra — @amairanymua, bridal hair & makeup (FL) | Nine complete sites to choose from (2026-11-19), in three rounds: Atelier, Blush, Cocoa (lighter, after four reference sites); Rouge, Maison, Darkroom (her red, black and white, softened to a rose); Veil, Noir, The Edit. Each has its own opening, an on-site bridal inquiry in demo mode with her JotForm's questions, and her real clips. Published for review 2026-11-19; awaiting founder's pick | hand-built by `scripts/amairanymua-01-build.mjs` + `scripts/amairanymua-01/`; Rouge from `amairanymua-01-rouge/` (Astro). See `docs/demo-amairanymua-01.md` |
| `karolaynesouza-01` | Karolayne Souza Beauty — @karolaynesouzabeauty.us, Brazilian lash & brow artist (Milford, MA) | Four directions to choose from (2026-11-20), all with her real work, her price list, EN/PT and booking: **A · Noir Studio** at the slug root (Astro: blink opening, eyelid hero); **B · Ivory Atelier** `/ivory-atelier` (light editorial, doors opening); **C · Espresso Lash Lab** `/espresso-lash-lab` (dark, closed-eye opening, Lash Lab); **D · The Lash Book** `/lash-book` (lookbook, book-cover opening). B–D are single-file pages. Awaiting founder's pick | A: `jpsilva0418/production` → `karolaynesouza/` (`scripts/snapshot-demo.mjs`); B–D: `karolaynesouza/concepts/build.py --publish`. See `DEMO.json` |
| `luciana-alvarenga-01` | Studio Luciana Alvarenga — @studiolucianaalvarenga, brow designer (Goiânia, GO, Brazil) | Five home-page variations to choose from (2026-11-20); IV · Preto & Branco `/preto-e-branco` and V · Rosé `/rose` are separate new designs (own layout, nav and sections); all heroes open on her photoshoot, not client close-ups, PT-first with PT \| EN, her real result reels, WhatsApp booking with per-service messages, Dec 2026 policies: a chooser gallery at the slug root (Amairany format) with **I · Champagne Glow** `/champagne-glow`; **II · Noir Dourado** `/noir-dourado` (split-screen, noir-led); **III · Atelier Porcelana** `/atelier-porcelana` (light, video inside her brand arch). Built on the Leti Silva Beauty foundation. Awaiting founder's pick | `jpsilva0418/production` → `luciana-alvarenga/` (`node src/build.mjs --publish`). See `DEMO.json` |
| `juliana-menezes-01` | Ju Menezes Beauty — Juliana Menezes, @unhasdajuboston, nail & PMU artist (Malden, MA) | Three complete sites to choose from (2026-11-22), PT-first with PT \| EN, her real work, her full Setmore menu and prices, her Setmore reviews, Setmore + WhatsApp booking, no forms: a chooser gallery at the slug root (Amairany format) with **01 · Noir** `/noir` (navy and champagne, colour-chart gallery); **02 · Atelier** `/atelier` (her bio.site greige, Nails · Brows · Lips panels); **03 · Fúcsia** `/fucsia` (wine and fuchsia, her “Quem sou eu?”). Each preview carries a bottom bar to switch designs or return to the gallery. Single-file pages; images in `/demo/_shared/juliana-menezes/`. Awaiting founder's pick | `jpsilva0418/production` → `juliana-menezes/` (`python3 -I build.py publish`). See `DEMO.json` |

Each generated demo has a `DEMO.json` that records its client, concept, source
commit and build time.

## Rules

0. **Hand JP the link, never a file.** Every demo is delivered as its
   `https://jpsilvadigital.com/demo/<slug>` URL. Self-contained HTML files and
   `.vercel.app` preview links do not open reliably on his phone (files don't
   render in the Claude app; preview URLs sit behind Vercel login).

1. **A slug belongs to one client, forever.** Never reuse, rename or overwrite
   another client's folder. A new company, or a new direction worth keeping
   separately, gets a new slug (for example, `acme-01`).
2. **Unlisted, never indexed.** `vercel.json` sends `X-Robots-Tag: noindex,
   nofollow, noarchive` for `/demo/(.*)`. Every page also carries
   `<meta name="robots" content="noindex,nofollow">`. Nothing under `/demo`
   is linked from the site or listed in the sitemap, and `check:links` skips it.
3. **Demo-safe.** Demos never post to this site's `/api/*`. Their forms finish
   on a "Demo mode — not sent anywhere" state. They also never touch the
   client's live website or domains.
4. **Shared stores are append-only.** Two shared folders hold the heavy files:
   - `/demo/_shared/assets/` holds content-hashed CSS, JS and images.
   - `/demo/_shared/<client>/` holds a client's films, posters and PDFs.

   The builder adds files and reuses identical ones. It refuses to overwrite a
   file whose content differs, so publishing one demo can never change
   another. Don't hand-edit or delete anything in `_shared` unless every demo
   that references it is gone.

## Adding a demo

For a site built from the Magnolia codebase, or a copy of it:

```bash
# in the source project (e.g. jpsilva0418/production/magnolia-healthcare)
node scripts/snapshot-demo.mjs <new-slug> <concept> --lib <path-to>/jp-web-design/public/demo
```

The builder does the following:

- runs a client build: no review selector, demo-only forms, a "Design demo"
  marker;
- re-roots every link under `/demo/<new-slug>`;
- stores shared files;
- runs safety scans (noindex, no stray root links, no API calls);
- writes `DEMO.json`.

It refuses an existing slug. `--republish` refreshes a slug only for the same
client.

For any other static build, copy its output into `public/demo/<new-slug>/`.
Every link inside it must stay under `/demo/<new-slug>/`, and every page needs
the robots meta.

Then add a row to the registry above, `npm run build && npm run check:links`,
commit, and push to the production branch. The client link is
`https://jpsilvadigital.com/demo/<new-slug>`.
