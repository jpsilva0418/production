# Client demos — `<slug>.demo.jpsilvadigital.com`

Every client demo JP Silva Digital publishes, kept alive side by side. **Demos are permanent until
you explicitly retire one.** Publishing a demo never touches another demo, the JP Silva Digital
site, or any client's real website.

## The model: one slug → one frozen snapshot → one host

- **Slug** — lowercase words and digits joined by hyphens: `client`, `client-02`, `magnolia-07`.
  A slug is never reused, even after a demo is retired.
- **Snapshot** — `demos/<slug>/` in this repo: a complete static site, built once, committed.
  It only changes when you deliberately re-snapshot *that* slug. `DEMO.json` inside it records
  the client, the concept and the exact source commit it was built from.
- **Host** — one independent hosting service per slug, serving only that folder. Hosts share
  nothing, so a deploy of `magnolia-07` cannot change `magnolia-01`, `magnolia-05`,
  JP Silva Media, or anything else.
- **Registry** — `demos/registry.json` lists every demo, its host and its domain.

Why separate hosts instead of one wildcard router: a router would put every demo into one
deployment, so each publish would redeploy all of them. Separate hosts cost one extra click per
demo and remove that risk entirely. The DNS zone for `jpsilvadigital.com` is on Vercel DNS, so a
`<slug>.demo.jpsilvadigital.com` domain attached to a Vercel project resolves and gets its TLS
certificate automatically — no DNS records and no wildcard are needed.

## Demo safety (every snapshot)

- every page `noindex,nofollow`; no sitemap; `robots.txt` lets crawlers read the noindex only;
  `vercel.json` adds `X-Robots-Tag: noindex, nofollow, noarchive` on Vercel hosts;
- a visible "Design demo · not the live website" label;
- static hosting: forms have no server to reach, so they run in their labelled **demo mode** —
  nothing is sent anywhere, no client inbox or workflow is connected;
- no review tooling: the internal concept selector and `/preview` routes are stripped;
- no secrets: snapshots are plain HTML/CSS/JS/media.

## Adding a demo

1. **Build** the site in its own folder of this repo (as `magnolia-healthcare/` is).
2. **Snapshot** it into `demos/<slug>/`. For Magnolia concepts:
   `cd magnolia-healthcare && node scripts/snapshot-demo.mjs <slug> <concept>`
   (commit first so `DEMO.json` records a clean source commit). Commit the snapshot.
3. **Host** it — one new service per slug:
   - *Vercel (target):* New Project → this repo → Root Directory `demos/<slug>` → Framework
     "Other", no build command, output `.` → Deploy. Then Settings → Domains → add
     `<slug>.demo.jpsilvadigital.com`. Add `[ -n "$(git diff --name-only HEAD^ HEAD -- .)" ] && exit 1 || exit 0`
     as the Ignored Build Step so only changes to that folder redeploy it.
   - *Render (current):* New Static Site → this repo → build command `echo snapshot`, publish
     path `demos/<slug>`, auto-deploy off.
4. **Verify** the URL on a phone: opens straight into the demo, no selector, demo label present.
5. **Register** it in `demos/registry.json`, then send the URL.

Re-publishing a demo = re-run step 2 for that slug only, commit, and redeploy only that host.
Retiring a demo = only when asked: delete its host, keep its registry entry with `"status": "retired"`.

## Current state (October 2026)

| Slug | Concept | Live URL now | Custom domain |
|---|---|---|---|
| magnolia-01 | Magnolia 01 · Family, at Home | https://magnolia-01-demo.onrender.com | magnolia-01.demo.jpsilvadigital.com — pending |
| magnolia-05 | Magnolia 05 · Immersive Storytelling | https://magnolia-05-demo.onrender.com | magnolia-05.demo.jpsilvadigital.com — pending |
| magnolia-07 | Magnolia 07 · Family, at Home — Evolved | https://magnolia-07-demo.onrender.com | magnolia-07.demo.jpsilvadigital.com — pending |
| jp-silva-media | JP Silva Media | https://jpsilvadigital.com/demo/jp-silva-media | unchanged (see below) |

**Why the custom domains are pending:** the Vercel connection used by Claude can read the team but
is not allowed to create projects (`403 You don't have permission to create the project`). Either
reconnect Vercel at claude.ai → Customize → Connectors with a role that can create projects and
start a new session (Claude then attaches all three domains), or do step 3 (Vercel) yourself for
each slug — about two minutes each. Nothing in DNS needs editing either way.

## JP Silva Media

Lives at `https://jpsilvadigital.com/demo/jp-silva-media`: static files committed in
`jp-web-design/public/demo/jp-silva-media/`, served by the production `jp-silva-digital` project
(which also runs the live company site and its contact form). It was **not** moved or changed.
To bring it into this namespace later without breaking the existing link:
1. copy that folder to `demos/jp-silva-media/` and host it per step 3 at
   `jp-silva-media.demo.jpsilvadigital.com`;
2. verify the new URL;
3. only then, on the company site, optionally add a redirect from `/demo/jp-silva-media/:path*` to
   the new host — or keep both. That last step is a production change and needs your go-ahead.

An earlier design for one shared host at `preview.jpsilvadigital.com/<slug>` exists on the
`jp-silva-demos` / `site/jp-silva-media` branches (`jp-silva-demos/`). It was never deployed
(no such Vercel project exists) and is superseded by this per-slug model.
