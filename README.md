# Masiello Construction — Website

Static single-page site. No build step, no dependencies. Open `index.html` or
serve the folder with any static host.

```
index.html
robots.txt
assets/
  css/styles.css
  js/main.js
  img/            placeholder SVGs — replace with client photography
```

## Before launch

Everything below is a placeholder and must be replaced with real client data.

| What | Where |
| --- | --- |
| Phone number | `PHONE_E164` and `PHONE_DISPLAY` in `assets/js/main.js`; `telephone` in the JSON-LD block in `index.html` |
| Form endpoint | `FORM_ENDPOINT` in `assets/js/main.js` (falls back to a mailto handoff while `null`) |
| Inbox address | `INBOX` in `assets/js/main.js` and the mailto link in the contact section |
| Office address & hours | Contact section and JSON-LD in `index.html` |
| Domain | `canonical`, `og:url`, `og:image` in `index.html`; `robots.txt` |
| Photography | `assets/img/placeholder-*.svg` — keep the same aspect ratios (hero 4:5 and 4:3, projects 4:3) |
| Testimonials | Names, roles, and quotes in the testimonials section |
| Project names & locations | Projects section |

## Conventions

- **Spacing** — every gap comes from the `--s-*` scale in `styles.css`. Section
  padding is `--section-y`. Do not introduce one-off pixel values.
- **Type** — one `<h1>` (the hero), one `<h2>` per section, `<h3>` for cards.
  Sizes come from the `--fs-*` tokens.
- **Copy** — two short sentences maximum per block. Headings stay under six words.
- **Navigation** — nav hrefs must match section `id`s: `#home`, `#about`,
  `#services`, `#projects`, `#contact`. The estimate CTA targets `#estimate`
  (the form itself). Anchor offset is handled by `scroll-padding-top` on `html`.
