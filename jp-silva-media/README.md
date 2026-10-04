# JP Silva Media — website

Filmmaker · producer · photographer, Austin, Texas. The design is **Picture Start** (selected and frozen):
black ground, Barlow Condensed title cards, IBM Plex Mono timecodes, letterboxed frames, an opening title sequence.

Static pages generated from data, plus one serverless function for project inquiries. No framework, no client
dependencies; the only runtime dependency is `@vercel/blob` for inquiry storage.

```
jp-silva-media/
  build.mjs                 static generator  → dist/ (web) or .preview/ (private preview)
  src/data/site.mjs         brand facts, socials, nav, about, services, inquiry options, home reel order
  src/data/projects.mjs     every piece of work (the portfolio's single source of truth)
  src/data/youtube.json     YouTube oEmbed metadata (written by the metadata job)
  src/templates/            layout + partials + one template per page type
  public/                   copied verbatim: assets/css, assets/js, media/, favicon
  api/inquire.mjs           POST /api/inquire (Vercel Function, Web-standard handler)
  lib/inquiry.mjs           validation, spam rules, storage adapters (Vercel Blob · local files)
  scripts/serve.mjs         local host that behaves like production (clean URLs, ranges, /api)
  scripts/check.mjs         link/asset/heading/noindex/JSON-LD/brand checks over a build
  scripts/test-*.mjs        inquiry, reel + project player tests
  tools/                    media pipeline (cut-media.sh, encode-films.sh) and the YouTube metadata fetcher
  vercel.json               clean URLs, headers (noindex while in preview), function config
```

## Run it

```bash
npm install            # only needed for the Blob storage adapter
npm run dev            # build + serve at http://127.0.0.1:8788 (inquiries saved to .data/inquiries/)
npm test               # inquiry tests + build + whole-site checks
```

## Add or change work

Edit `src/data/projects.mjs` — one object per project. Pages, the Work index, filters, the home reel and the sitemap
are generated from it. Fields: `slug, title, artist, client, category[], type, year, credits[], media, poster, gallery[],
description, featured, order`. Only add credits, years and descriptions that are verified.

- **A YouTube film:** add its id to `tools/youtube-ids.txt` and push. The `jpsm-media-meta` GitHub Action (this branch
  only) fetches its public title, channel and poster frame into `src/data/youtube.json` and `public/media/posters/`.
  Then add the project entry with `media: { kind: 'youtube', id }`. On the real host a tap anywhere on the poster plays
  it in the page (YouTube IFrame API, nocookie host). A film marked `embeddable: false` in `youtube.json` gets the
  poster with a link to YouTube instead, and the home reel leaves it out.
- **A film file:** put the master in a folder and adapt `tools/encode-films.sh` (H.264/AAC mp4 + VP9/Opus webm + poster).
- **Photos:** add images under `public/media/` and list them in the project's `gallery`.
- **Home reel order:** `site.reel.youtube` (real host) and `site.reel.files` (fallback when YouTube cannot load).

## Deploy (Vercel)

1. Vercel → Add New → Project → import `jpsilva0418/production`.
   Root Directory: `jp-silva-media` · Framework: Other · Build Command `node build.mjs` · Output Directory `dist`
   (all also set in `vercel.json`). Production Branch: `site/jp-silva-media` (Settings → Git).
2. Storage → Create → **Blob**, access **Private**, connect it to the project (adds `BLOB_READ_WRITE_TOKEN`).
   Inquiries are stored as `inquiries/<YYYY-MM>/<timestamp>-<id>.json` and can be read in Storage → Browse.
3. Optional email notification for each inquiry: set `RESEND_API_KEY` and `INQUIRY_NOTIFY_TO`. A failed email never
   loses an inquiry (storage happens first).
4. Redeploy.

Without a storage token the form never pretends: the API answers `503 storage_unconfigured` and the page shows the
error state with the direct email.

## Launch checklist (preview → public)

- Set `PREVIEW=0` in the Vercel environment (drops `noindex`, writes a crawlable robots.txt + sitemap) and remove the
  `X-Robots-Tag` header from `vercel.json`.
- Point `jpsilvamedia.com` at the project (canonical URLs already use `https://www.jpsilvamedia.com`).
- Confirm with JP: titles marked `titleConfirmed:false` in `projects.mjs` (his own uploads), his role on each film,
  the bio lines in `site.about` (sourced from his Voyage Phoenix interview and Instagram), the contact email.
- Replace the phone-compressed film exports with original masters when available (same slugs).

## Media notes

The films supplied for this build were phone-compressed exports (512 px short side). The design frames that
softness as film (letterbox, grain, grade, pillarboxed portrait clips) instead of stretching it; original masters drop
into the same paths. `tools/cut-media.sh` and `tools/encode-films.sh` regenerate everything from the source folder
with crops measured so no frame carries a black edge.
