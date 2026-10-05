# Deployment — JP Silva Digital

## The two things that must be right, or the wrong site ships

This repository holds **two unrelated sites**:

| Path | Site |
|---|---|
| repository root (`index.html`, `assets/`) | **Masiello Construction** — a separate static site |
| `jp-web-design/` | **JP Silva Digital** — this site |

The repository's *default* branch is `claude/construction-site-refinement-3d37yw`,
which is the Masiello site. So a Vercel project created with default settings
would build the wrong directory from the wrong branch.

The project must therefore set:

- **Root Directory:** `jp-web-design`
- **Production Branch:** `claude/jp-silva-digital-launch`
- **Framework Preset:** Astro

## Build

| | |
|---|---|
| Install | `npm install` |
| Build | `npm run build` (`astro build`) |
| Output | `dist` |
| Output mode | static — no server adapter, no serverless functions |

## Routing

`astro.config.mjs` uses `build.format: 'file'` and `trailingSlash: 'never'`, so
the build emits `about.html`, not `about/index.html`.

`vercel.json` matches that exactly:

- `cleanUrls: true` — serves `/about` from `about.html`, and 308-redirects
  `/about.html` → `/about`, so each page has **one** address. Without this,
  both URLs would serve 200 and every page would have a duplicate competing
  with its own canonical.
- `trailingSlash: false` — 308-redirects `/about/` → `/about`.

The canonical URLs in `src/layouts/Base.astro` are extensionless with no
trailing slash, so all three agree.

## Environment variables

All optional. Unset is a valid, honest state — nothing fabricates a result
when a key is missing.

| Variable | Effect when unset |
|---|---|
| `PUBLIC_INQUIRY_ENDPOINT` | Both forms tell the visitor they could not send and offer a pre-filled email. **No form ever claims to have sent something it did not send.** |
| `PUBLIC_GA_ID` | GA4 does not load |
| `PUBLIC_GOOGLE_ADS_ID` | Google Ads tag does not load |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel does not load |
| `PUBLIC_GSC_VERIFICATION` | No verification meta tag rendered |

## Domains

| | |
|---|---|
| Canonical | `https://jpsilvadigital.com` (apex) |
| Redirects to it | `https://www.jpsilvadigital.com` — 308, via the host redirect in `vercel.json` |

Both must be added to the project. The redirect is config-as-code so it holds
regardless of dashboard state; if Vercel's own domain settings also redirect
www, that fires first and this rule simply never matches. Do **not** configure
the apex to redirect to www — that inverts the canonical the whole site
advertises.

The redirect is host-conditional, so `*.vercel.app` deployment URLs are
unaffected and preview deployments keep working.

`astro.config.mjs` exports `SITE`, which drives canonical URLs, Open Graph
URLs, the sitemap and all structured data. `public/robots.txt` carries the
same host. Changing the domain is that one constant plus that one file —
and `npm run check:links` fails the build if they ever disagree, or if any
page ships a canonical, og:url, og:image, JSON-LD URL or sitemap entry on a
different host.

## Verifying a deploy

```
npm run build && npm run check:links
```

`scripts/check-links.mjs` asserts every expected route shipped, every internal
href resolves, every `#fragment` has a target, no placeholder or stale
homepage-anchor href is present, the phone and email are the canonical ones,
and no developer note reached the HTML.
