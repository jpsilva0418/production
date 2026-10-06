# Magnolia Healthcare — premium website demo

A private design demo for **Magnolia Healthcare** (non-medical home care, Arvada, CO), built on
the craftsmanship of the Leti Silva Beauty site as the technical foundation and Magnolia's own
identity, content and business facts as the source of truth.

> This is a demo. It is `noindex` everywhere, carries a visible "Design demo" badge, never
> sends form submissions anywhere unless delivery secrets are deliberately set, and is never
> pointed at Magnolia's real domain. Magnolia's live website is untouched.

- Assessment and content provenance: `docs/00-assessment.md`
- Media inventory and licences: `docs/MEDIA.md`
- Completion report: `docs/01-completion-report.md`

## Run

Requires Node 22+.

```bash
npm install
npm run dev       # http://localhost:4321
npm run check     # astro check (types + content)
npm run build     # static build -> dist/
npm run preview
```

Regenerate the temporary demo media (needs python3 + numpy + Pillow + ffmpeg; plates need a
Playwright install to point at):

```bash
bash scripts/media/build-media.sh
node scripts/media/plates.mjs <dir-with-playwright-node_modules> src/assets/plates
```

## Structure

```
src/
  consts.ts            every business fact (from Magnolia's current site) — single source of truth
  content/services     the four real services
  content/posts        the six existing blog articles (bodies pending migration)
  styles/tokens.css    Magnolia design tokens (colour, type, rhythm, radii)
  styles/magnolia.css  shared grammar ported from Letty Silva Beauty (reveals, buttons, menu, footer…)
  layouts/BaseLayout   HTML shell, SEO, header/footer, shared runtime (menu, reveals, films)
  components/          Prologue (cinematic hero), ConsultForm, ApplicationForm, Plate, BlogCard, Header, Footer…
  pages/               / services mission team community blog contact careers apply login accessibility 404
api/inquiry.js         Vercel function: consultation requests (Resend when configured, else demo mode)
api/apply.js           Vercel function: caregiver applications (same contract)
scripts/media/         generators for the temporary hero film and placeholder plates
docs/                  assessment, media inventory, completion report
```

## Deploy (preview-first workflow)

Vercel project `magnolia-healthcare-demo`, Root Directory `magnolia-healthcare`, framework Astro.
Branch deployments are the private preview (Vercel Auth protected). The client-demo subdomain
(`*.jpsilvadigital.com`, Vercel-managed DNS) is attached only after founder approval.
