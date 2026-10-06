# 04 — Six premium evolutions of the Magnolia website (design review)

**Review surface:** `/preview` (index) · `/preview/01` … `/preview/06`. A development-only
selector bar sits at the bottom of each concept (keys 1–6 switch, H hides, 0 returns to the
index). It is rendered only by pages under `/preview` and never ships on the client site.
Preview host: https://magnolia-healthcare-demo.onrender.com/preview

All six descend from the Preservation Map (`03-preservation-map.md`): the same navigation
(Home · Our Mission · Blog · Consultation · Careers · Log in), the same hero words, the full
mission statement, the six Specialized Care items, the four How We Help items, the three
testimonials, the "Let's talk…" banner with only the two approved claims, Magnolia Moments,
Join Our Team with the PDF, and the footer. No concept adds a business fact; the founder stays
unnamed; phone/address/hours remain placeholders.

| # | Concept | Philosophy in one line | Palette stance |
|---|---|---|---|
| 01 | Family, at Home | The direction already in the preview, kept and completed: veil → corridor film, cream serif, blush italic, chapters with sticky rails, light layers and grain. | the deeper, cinematic reading of her palette |
| 02 | Modern Editorial Healthcare | A printed magazine about Magnolia: masthead nav, numbered Contents, essay-style mission, an index of care whose photo swaps as you move, "Letters" testimonials, colophon footer. | white paper, pale-sage mission panel with a curved top, one deep-green notice |
| 03 | Warm Human Premium | The people first: the team photo is the hero in an arch frame with the film as a polaroid; the mission as a four-line promise; voices up front; soft rounded cards. | warm ivory, pale sage bands, the curve, one deep-green panel |
| 04 | Architectural Minimal | One idea per screen: the headline as a single enormous line, the film in a hairline frame with a playback rule, four numbered mission rows, an accordion index, hairline tables. | white, charcoal, gold hairlines, one flat sage field |
| 05 | Immersive Storytelling | A day of care: the film is pinned and light chapters slide over it on her curved sage edge; the mission unfolds sentence by sentence; care is a swipeable sequence; chapter rail / progress bar. | white and pale-sage cards, one deep-green chapter |
| 06 | Signature Magnolia | Her site's own DNA rebuilt: centred logo nav, film with the halftone and the sage curve, pale mission panel over the team photo, double gold-hairline cards, a real carousel, the green banner with the lotus, Blog bar, Join our team strip, one Contact button. | white with green exactly where she uses it |

## Magnolia → premium traceability

| Existing element | 01 | 02 | 03 | 04 | 05 | 06 |
|---|---|---|---|---|---|---|
| Centred logo + hamburger, 5 items, Log in | shared light header, full-screen menu | masthead with sticky rule row; Contents sheet on mobile | centred logo over a nav row; full-screen menu | thin hairline bar, text-link CTA; large-type menu | minimal bar + Menu at all widths; chapter rail | centred logo with split nav; dropdown on mobile |
| Video hero + headline + Free Consultation | veil → film, "Care that feels like family, at home" with the site's headline as eyebrow | split cover, film as a 4:5 "film still" | team photo arch + film polaroid | one-line headline, film in a 21:9 hairline frame | pinned film, chapters slide over it | film + halftone + concave sage curve |
| Curved sage band | — (dark chapters) | curved top on the mission panel | curved band under the hero | shallow arc into the mission panel | the edge of every chapter card | the curve, as hers |
| Our Mission statement | Chapter i with sticky rail + values | essay: drop cap, pull quote, two columns | pale band + "promise" in four numbered lines | four hairline rows, 01–04 | sentences unfold on scroll | pale sage panel, as hers |
| Team photo / founder (woman in white) | Chapter iii: founder portrait + team, parallax | Pl. I / Pl. II editorial profile | arch portrait + two-up gallery | portrait and team plates on an offset grid | parallax team plate + founder inset | "Meet the founder" gold-ringed arch + team |
| Six Specialized Care cards | gold-hairline grid with photos | index list with sticky photo swap | warm 3×2 cards with photo tops | accordion index | horizontal snap sequence | double-gold-hairline cards with medallions |
| Four How We Help | dark ledger | four columns under a rule | panels on blush | hairline table | stacked rows beside a sticky heading | gold-frame cards |
| Three testimonials | triptych | "Letters" page | rounded cards, early | single column, very large | fade in one after another | real carousel |
| "Let's talk…" banner | finale over the corridor poster | boxed deep-green notice | inset deep-green panel | flat sage field + the one solid button | the deep-green "Begin" chapter | her green banner with gold icons + lotus |
| Magnolia Moments | two cards + "All posts" tile | two teasers | two warm cards | two index rows | two cards | Blog bar + two gold-framed cards |
| Join Our Team + PDF | note card | classified box | two-column card | one hairline row | strip with the team photo | careers-green strip |
| Footer | grand footer | colophon | pale sage | hairline rows | light, compact | white, centred |
| Floating Phone/Facebook/WhatsApp/Chat | not reproduced (destinations unknown) | — | — | — | — | one Contact button with placeholders |

## Letty Silva Beauty systems reused

Prologue hero (veil → film, poster-first, reduced-motion safe) · full-screen menu (inert, focus
trap, Escape) · sticky/hiding header · V2 reveal grammar (clip reveals, image reveals, fades,
stagger) · parallax pairs · lazy films · light layers and grain · chapter rails and slates ·
cinema bands · note card · card hover system · underline-to-fill buttons with sheen · expanding
underline links · tokens with Fraunces opsz/SOFT axes · BlogCard · Plate · Mark · the demo badge.

## Mobile status

Every concept was designed at 360, 390 and 1440 and verified with Playwright on the built
site: no horizontal overflow at any width, one `<h1>` per page, no console or page errors, the
selector present. Each concept has its own accessible mobile menu (44 px targets) and stacked
CTAs; 05 and 06 add touch sequences/carousels with keyboard support.

## Open questions

1. Phone, address, hours. 2. The founder's name and a sentence about her. 3. Facebook /
WhatsApp / chat destinations (the floating buttons). 4. The logo file (SVG). 5. Whether
"Care up to 24 hours a day" and "Free, no commitment" may be shown. 6. The full "Art Class"
post. 7. Preferred legal spelling ("Magnolia Healthcare, Inc." vs "Magnolia Healthcare Inc.").
