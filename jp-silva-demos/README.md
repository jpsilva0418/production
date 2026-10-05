# jp-silva-demos

Client website previews for JP Silva Digital: `https://preview.jpsilvadigital.com/<client-slug>`.
One Vercel project (`jp-silva-demos`, root directory `jp-silva-demos/`) serves every client.

- Each client is a folder of this repo with its own static build that accepts `--out`, `--base` and `--site-url`.
- Add a client by adding a line to `clients.json`.
- `/` and unknown paths are a plain 404. There is no index, listing or sitemap.
- Every response sends `X-Robots-Tag: noindex, nofollow, noarchive`, and every page has a robots meta tag.

| Client | URL |
|---|---|
| JP Silva Media | https://preview.jpsilvadigital.com/jp-silva-media |
