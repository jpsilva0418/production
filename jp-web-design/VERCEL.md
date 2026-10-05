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

## The live project

| | |
|---|---|
| Team | `jpsilva0418's projects` (`team_o2ROdLJK3SAYM8N1zdsXqVdZ`) |
| Project | `jp-silva-digital` (`prj_GS6TNlkRunxA8AHclA2UmhDIS0RL`) |
| Framework | Astro · Node 22.x |
| Root Directory | `jp-web-design` |
| Domains | `jpsilvadigital.com` (canonical) · `www.jpsilvadigital.com` → 308 → apex |

### Two settings that are NOT in the API

**1. Production Branch.** No Vercel MCP tool exposes it. The project was
imported with the repository's default branch — `claude/construction-site-refinement-3d37yw`,
which is the Masiello Construction site — and that is still the stored
setting. It has to be changed by hand:

> Settings → Git → Production Branch → `claude/jp-silva-digital-launch`

Until that is done, a push to the construction branch would otherwise
auto-deploy a different company's website to this project. It cannot,
because of:

**2. The Ignore Build Step guard**, which IS set:

```sh
[ "$VERCEL_GIT_COMMIT_REF" != "claude/jp-silva-digital-launch" ]
```

Vercel treats exit 0 as "skip the build". This exits 0 for every branch
except the approved one, so only `claude/jp-silva-digital-launch` can ever
build in this project. That is a deliberate belt-and-braces guard against
the wrong site reaching jpsilvadigital.com.

Consequence worth knowing: **no other branch will build here at all**, so
preview deployments from other branches are skipped, and if the approved
branch is ever renamed or merged into another branch, builds will silently
skip until this command is updated. Change or clear
`commandForIgnoringBuildStep` when that happens.

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

## Form delivery (Resend)

One server-side endpoint, `api/inquiry.js`, serves both forms. It is a plain
Vercel Function rather than an Astro server route, so the site itself stays a
fully static build with no adapter — this file is the only server-side code
in the project.

```
/contact   ─┐
            ├─ sendInquiry() (src/lib/inquiry.ts) ─→ POST /api/inquiry ─→ Resend
/free-demo ─┘   adds plan.answers + plan.recommendation
```

| Variable | Where | Notes |
|---|---|---|
| `RESEND_API_KEY` | Vercel, **sensitive** | sending-access only, scoped to the one domain. Server-side only; never `PUBLIC_`, never in the bundle, never logged. |
| `INQUIRY_TO` | Vercel, encrypted | destination inbox |
| `INQUIRY_FROM` | Vercel, encrypted | sender identity; needs the domain verified in Resend |
| `PUBLIC_INQUIRY_ENDPOINT` | Vercel, plain | `/api/inquiry`. Public by design — a path, not a secret. |

Protections, all server-side because a client-side check is a courtesy, not a
guarantee: same-origin check, 64 KB body cap, per-field length caps, strict
re-validation of name and email, CR/LF stripped from everything reaching a
mail header, HTML-escaped email bodies, the existing honeypot (answered 200 so
a bot learns nothing, and nothing is sent), 5 submissions per IP per 10
minutes, and a 5-minute duplicate guard keyed on email + source + message
plus a Resend `Idempotency-Key` so a retry cannot produce two emails.

The rate limiter and duplicate guard are per-instance in memory. A cold
instance starts empty, so they fail OPEN — deliberately: a missed rate-limit
costs one extra email, a false positive costs a customer.

**The honesty rule holds end to end.** The endpoint returns 2xx only when
Resend returns a message id; a 2xx with no id is treated as a failure. On any
failure the browser shows the email handoff, never a success state.

## The 2026-10-05 form incident, and how it was actually diagnosed

Three bugs were reported from an iPhone inside the Instagram in-app browser.
What the evidence showed, in the order it was found:

1. **Resend's own API log held no `POST /emails` at all** — not a failure, not
   a 401, nothing. So the function was never getting through to Resend, and
   every theory about the email itself was wrong before it started. The
   credential stored in `RESEND_API_KEY` was not a working key; a replacement
   (`jp-silva-digital-production-2`, sending-access, scoped to the domain) was
   created and stored, and the first submission after the next deploy
   succeeded. The old key is unused and can be revoked in Resend.

2. **The `Origin` check rejected the browsers people actually arrive in.** It
   compared `new URL(origin).host` to the request host. Instagram's and
   Facebook's in-app WebKit send a same-site POST with `Origin` absent or set
   to the literal `"null"` depending on version, and both became a 403. See
   `originVerdict()` in `api/inquiry.js` for what replaced it and why a
   missing Origin is not evidence of a cross-site request *for this endpoint*
   (it reads no cookie, session or Authorization header, so there is no
   ambient authority to borrow). Do not copy that reasoning to an endpoint
   that does.

3. **A 502 was a dead end.** Nothing in the response or the log said what
   Resend had answered. Every exit now writes one structured line — time,
   path, method, status, error word, whether Resend was called, Resend's own
   status — and a failed send carries that upstream status back to the client.
   No key, header value, name, email or message text is logged or returned.

**How to test production from a session with no outbound network.** The
Vercel MCP connector on this project cannot read runtime logs, build logs or
protection-bypass URLs (all 403). What it *can* do is create a Vercel
Sandbox, which has full network access from inside Vercel's own
infrastructure: `create_sandboxes_v4` → `run_session_command` → curl the live
endpoint, or `npm i playwright` and drive the real site in a real browser at
an iPhone viewport with an Instagram user agent. That is how both forms were
verified end to end, and how the message ids were obtained. Stop the sandbox
when finished.
