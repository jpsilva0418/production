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

Each generated demo has a `DEMO.json` that records its client, concept, source
commit and build time.

## Rules

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
