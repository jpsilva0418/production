# Rouge — Amairany Sierra, design preview 4

The source of `/demo/amairanymua-01/rouge`: a red, black and white website concept for
Amairany Sierra (@amairanymua), built with Astro. Not her official site; every page is noindex
and carries the "Design preview" marker.

- **Facts, links, photographs, film slots and copy** are read at build time from
  `../jp-web-design/scripts/amairanymua-01/site.mjs` (the single source all the previews share);
  the bridal inquiry is the shared component in `inquiry-core.mjs` plus
  `/demo/amairanymua-01/assets/js/inquiry.js`. Nothing about her is typed in this project.
- **Photographs**: `src/assets/plates/` holds JPEG conversions of her own images (same keys as
  `PHOTOS` in site.mjs).
- **Film**: no clip exists yet, so every film frame is a marked slot. Set `FILMS[id].file` in
  site.mjs (and add the .mp4/.jpg to `/demo/amairanymua-01/assets/film/`) and the slot plays it.

```sh
npm ci
node scripts/publish.mjs          # build and replace ../jp-web-design/public/demo/amairanymua-01/rouge/
cd ../jp-web-design && node scripts/amairanymua-01-check.mjs
```

`npm run dev` serves the site locally under `/demo/amairanymua-01/rouge` (the shared assets it
links, such as the marker stylesheet and the inquiry script, are served by the demo host).
