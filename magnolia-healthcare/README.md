# Magnolia Healthcare — premium website demo

A private design demo for **Magnolia Healthcare, Inc.** (home care agency, anywhere in
Massachusetts — magnoliahealthcareinc.com), built on the craftsmanship of the Leti Silva Beauty
site as the technical foundation and Magnolia's own supplied materials as the only source of
truth. See `docs/02-contamination-audit.md` for the purge of an earlier, wrongly sourced build.

> This is a demo. It is `noindex` everywhere, carries a visible "Design demo" badge, never
> sends form submissions anywhere unless delivery secrets are deliberately set, and is never
> pointed at Magnolia's real domain. Magnolia's live website is untouched.

- Assessment and content provenance: `docs/00-assessment.md`
- Contamination audit (what was removed and why): `docs/02-contamination-audit.md`
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
  consts.ts            every business fact (from Magnolia's supplied materials) — single source of truth
  content/services     six specialized-care + four how-we-help items (the current site's own sentences)
  content/posts        "Magnolia Moments" — the two posts on the current blog
  styles/tokens.css    Magnolia design tokens (colour, type, rhythm, radii)
  styles/magnolia.css  shared grammar ported from Letty Silva Beauty (reveals, buttons, menu, footer…)
  layouts/BaseLayout   HTML shell, SEO, header/footer, shared runtime (menu, reveals, films)
  components/          Prologue (cinematic hero), ConsultForm, ApplicationForm, Plate, BlogCard, Header, Footer…
  pages/               / services mission blog consultation careers apply login 404
api/inquiry.js         Vercel function: consultation requests (Resend when configured, else demo mode)
api/apply.js           Vercel function: caregiver applications (same contract)
scripts/media/         generators for the temporary hero film and placeholder plates
docs/                  assessment, media inventory, completion report
```

## Deploy (preview-first workflow)

Preview: Render static site `magnolia-healthcare-demo` (https://magnolia-healthcare-demo.onrender.com),
root `magnolia-healthcare/`, build `npm ci && npm run build` with `BUILD_FORMAT=directory`,
auto-deploys from branch `claude/magnolia-healthcare-premium-bkmn0o`. The client-demo subdomain
(`*.jpsilvadigital.com`, Vercel-managed DNS) is attached only after founder approval.
