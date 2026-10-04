/* ============================================================
   JP MEDIA — study manifest + media manifest
   ------------------------------------------------------------
   Every image/video slot in the six concepts resolves through this file.
   The plates are PROCEDURAL (light, haze, grain, horizon, metal, paper —
   see ../tools/make-plates.py). No photography is used. When JP's real
   stills and footage arrive, drop them into ../media/ and point the
   entries below at them — the concepts do not change.
   Project titles are WORKING LABELS, not real credits.
   ============================================================ */
window.JP_STUDY = {
  title: 'JP Media — Website Art Direction Study',
  concepts: [
    { n: '01', slug: 'concept-01', name: 'Picture Start', thesis: 'The site as an opening title sequence. Black, film-first, commanding: a director’s calling card, not a photo grid.' },
    { n: '02', slug: 'concept-02', name: 'Folio',         thesis: 'An art book you scroll. Bone paper, serif plates, red folios, exhibited photography with room to breathe.' },
    { n: '03', slug: 'concept-03', name: 'Dust & Light',  thesis: 'Low sun, grain and warm air. Texas as atmosphere, never costume: personal, grounded, cinematic.' },
    { n: '04', slug: 'concept-04', name: 'Silver',        thesis: 'A production house with architectural discipline. Gunmetal, hairline grids, slates and real credit tables.' },
    { n: '05', slug: 'concept-05', name: 'Soundcheck',    thesis: 'Rhythm, attitude, stage light. Kinetic type and frames that break the grid, built from the live-music world.' },
    { n: '06', slug: 'concept-06', name: 'Still',         thesis: 'Museum calm. One frame at a time, enormous quiet, typography that does not need to raise its voice.' }
  ]
};

window.JP_MEDIA = {
  /* resolve('plates/x.jpg') from a concept page → '../media/plates/x.jpg'; from the hub → 'media/plates/x.jpg' */
  base: (location.pathname.indexOf('/concept-') > -1) ? '../media/' : 'media/',
  url: function (p) { return this.base + p; },

  plates: {
    'night-halation': { src: 'plates/night-halation.jpg', small: 'plates/night-halation-900.jpg', w: 1800, h: 1012, tone: 'dark',  alt: 'A dark room with one warm light blooming through dust' },
    'night-beam':     { src: 'plates/night-beam.jpg',     small: 'plates/night-beam-720.jpg',     w: 1200, h: 2133, tone: 'dark',  alt: 'A single soft beam of light falling through darkness' },
    'dusk-horizon':   { src: 'plates/dusk-horizon.jpg',   small: 'plates/dusk-horizon-900.jpg',   w: 1800, h: 753,  tone: 'warm',  alt: 'A low sun burning over a dark horizon line' },
    'dusk-haze':      { src: 'plates/dusk-haze.jpg',      small: 'plates/dusk-haze-800.jpg',      w: 1400, h: 1750, tone: 'warm',  alt: 'Amber haze and drifting dust in evening light' },
    'ember':          { src: 'plates/ember.jpg',          small: 'plates/ember-900.jpg',          w: 1800, h: 1200, tone: 'warm',  alt: 'Deep red-brown light with a hot glowing edge' },
    'leak-warm':      { src: 'plates/leak-warm.jpg',      small: 'plates/leak-warm-900.jpg',      w: 1800, h: 1012, tone: 'warm',  alt: 'A warm film light leak burning in from the edge of frame' },
    'silver-edge':    { src: 'plates/silver-edge.jpg',    small: 'plates/silver-edge-900.jpg',    w: 1800, h: 1012, tone: 'cool',  alt: 'A graphite field cut by a hard diagonal of light' },
    'silver-brushed': { src: 'plates/silver-brushed.jpg', small: 'plates/silver-brushed-800.jpg', w: 1400, h: 1867, tone: 'cool',  alt: 'Brushed metal catching light from above' },
    'bone-paper':     { src: 'plates/bone-paper.jpg',     small: 'plates/bone-paper-800.jpg',     w: 1400, h: 1750, tone: 'light', alt: 'A sheet of bone-coloured paper with a soft shadow' },
    'mono-grain':     { src: 'plates/mono-grain.jpg',     small: 'plates/mono-grain-900.jpg',     w: 1800, h: 1200, tone: 'mono',  alt: 'A black-and-white field of light and heavy film grain' },
    'mono-leak':      { src: 'plates/mono-leak.jpg',      small: 'plates/mono-leak-800.jpg',      w: 1400, h: 2100, tone: 'mono',  alt: 'Black-and-white frame with a blown-out light leak' },
    'stage-red':      { src: 'plates/stage-red.jpg',      small: 'plates/stage-red-900.jpg',      w: 1800, h: 1012, tone: 'stage', alt: 'Hard red stage light and a white hot spot through haze' },
    'stage-vertical': { src: 'plates/stage-vertical.jpg', small: 'plates/stage-vertical-720.jpg', w: 1200, h: 2133, tone: 'stage', alt: 'Red stage wash and a flare from above' },
    'mist-white':     { src: 'plates/mist-white.jpg',     small: 'plates/mist-white-900.jpg',     w: 1800, h: 1200, tone: 'light', alt: 'Near-white mist with a faint grey gradient' }
  },

  loops: {
    dust:   { mp4: 'loops/dust.mp4',   webm: 'loops/dust.webm',   poster: 'loops/dust-poster.jpg',   w: 960, h: 540, tone: 'dark' },
    sun:    { mp4: 'loops/sun.mp4',    webm: 'loops/sun.webm',    poster: 'loops/sun-poster.jpg',    w: 960, h: 540, tone: 'warm' },
    stage:  { mp4: 'loops/stage.mp4',  webm: 'loops/stage.webm',  poster: 'loops/stage-poster.jpg',  w: 540, h: 960, tone: 'stage' },
    silver: { mp4: 'loops/silver.mp4', webm: 'loops/silver.webm', poster: 'loops/silver-poster.jpg', w: 960, h: 540, tone: 'cool' },
    mist:   { mp4: 'loops/mist.mp4',   webm: 'loops/mist.webm',   poster: 'loops/mist-poster.jpg',   w: 960, h: 540, tone: 'light' }
  },

  /* Real photographs of JP (supplied by the founder). Use for portrait / about slots. */
  photos: {
    'jp-portrait':     { src: 'photos/jp-portrait.jpg',     small: 'photos/jp-portrait-800.jpg',     w: 1320, h: 1308, alt: 'JP Silva laughing in a dry field under the sun, round glasses, white T-shirt' },
    'jp-portrait-4x5': { src: 'photos/jp-portrait-4x5.jpg', small: 'photos/jp-portrait-4x5-800.jpg', w: 1046, h: 1308, alt: 'JP Silva, portrait in afternoon light' },
    'jp-exhibition':   { src: 'photos/jp-exhibition.jpg',   small: 'photos/jp-exhibition-800.jpg',   w: 1320, h: 1034, alt: 'JP Silva standing beside his printed photographs at a gallery wall' }
  },


  /* ---- REAL FOOTAGE (supplied by the founder; iMessage-compressed exports, 512 px short side) ----
     Cut by tools/cut-media.sh. Every clip is muted. Sources:
       showreel  = JP's montage (portrait 9:16) — the signature opening asset
       field     = music video, dancers in a field at dusk (landscape)
       western   = music video, black-and-white western (landscape)
       nightride = music video, motorcycle at dusk (landscape)
       highway   = music video, chopper on a desert highway (landscape)
       forest    = short, rain-dark forest and campfire (portrait)
       jpsea     = JP himself at the sea, black and white (letterboxed band)
     Titles are unknown: present them by descriptor ("Music video — field at dusk"), never by an invented name. */
  film: {
    "ch-camera": {
        "mp4": "film/ch-camera.mp4",
        "webm": "film/ch-camera.webm",
        "poster": "film/ch-camera-poster.jpg",
        "w": 656,
        "h": 512,
        "dur": 3.2,
        "source": "highway",
        "alt": "Film camera on a motorcycle tank",
        "kb": 103
    },
    "ch-ride": {
        "mp4": "film/ch-ride.mp4",
        "webm": "film/ch-ride.webm",
        "poster": "film/ch-ride-poster.jpg",
        "w": 656,
        "h": 512,
        "dur": 3.4,
        "source": "highway",
        "alt": "Couple on a chopper on a desert highway",
        "kb": 351
    },
    "ch-road": {
        "mp4": "film/ch-road.mp4",
        "webm": "film/ch-road.webm",
        "poster": "film/ch-road-poster.jpg",
        "w": 656,
        "h": 512,
        "dur": 3.4,
        "source": "highway",
        "alt": "Rider on the open highway",
        "kb": 252
    },
    "fd-dance": {
        "mp4": "film/fd-dance.mp4",
        "webm": "film/fd-dance.webm",
        "poster": "film/fd-dance-poster.jpg",
        "w": 860,
        "h": 512,
        "dur": 3.6,
        "source": "field",
        "alt": "Dancers in a field, blue hour",
        "kb": 178
    },
    "fd-fence": {
        "mp4": "film/fd-fence.mp4",
        "webm": "film/fd-fence.webm",
        "poster": "film/fd-fence-poster.jpg",
        "w": 860,
        "h": 512,
        "dur": 3.4,
        "source": "field",
        "alt": "Dancers on a ranch fence at golden hour",
        "kb": 284
    },
    "fd-flare": {
        "mp4": "film/fd-flare.mp4",
        "webm": "film/fd-flare.webm",
        "poster": "film/fd-flare-poster.jpg",
        "w": 860,
        "h": 512,
        "dur": 4.0,
        "source": "field",
        "alt": "Dancers against the setting sun",
        "kb": 301
    },
    "fd-headlights": {
        "mp4": "film/fd-headlights.mp4",
        "webm": "film/fd-headlights.webm",
        "poster": "film/fd-headlights-poster.jpg",
        "w": 860,
        "h": 512,
        "dur": 5.2,
        "source": "field",
        "alt": "Truck headlights on a dark field",
        "kb": 198
    },
    "fd-truck": {
        "mp4": "film/fd-truck.mp4",
        "webm": "film/fd-truck.webm",
        "poster": "film/fd-truck-poster.jpg",
        "w": 860,
        "h": 512,
        "dur": 3.6,
        "source": "field",
        "alt": "Red pickup under a dusk sky",
        "kb": 145
    },
    "fo-dance": {
        "mp4": "film/fo-dance.mp4",
        "webm": "film/fo-dance.webm",
        "poster": "film/fo-dance-poster.jpg",
        "w": 492,
        "h": 960,
        "dur": 3.0,
        "source": "forest",
        "alt": "Figure spinning in a forest clearing",
        "kb": 203
    },
    "fo-fire": {
        "mp4": "film/fo-fire.mp4",
        "webm": "film/fo-fire.webm",
        "poster": "film/fo-fire-poster.jpg",
        "w": 492,
        "h": 960,
        "dur": 2.0,
        "source": "forest",
        "alt": "Campfire at night",
        "kb": 239
    },
    "fo-trees": {
        "mp4": "film/fo-trees.mp4",
        "webm": "film/fo-trees.webm",
        "poster": "film/fo-trees-poster.jpg",
        "w": 492,
        "h": 960,
        "dur": 2.6,
        "source": "forest",
        "alt": "Pines against a grey sky",
        "kb": 198
    },
    "fo-umbrella": {
        "mp4": "film/fo-umbrella.mp4",
        "webm": "film/fo-umbrella.webm",
        "poster": "film/fo-umbrella-poster.jpg",
        "w": 492,
        "h": 960,
        "dur": 2.2,
        "source": "forest",
        "alt": "Figure with an umbrella in a rain-dark forest",
        "kb": 127
    },
    "hero-montage": {
        "mp4": "film/hero-montage.mp4",
        "webm": "film/hero-montage.webm",
        "poster": "film/hero-montage-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 12.4,
        "source": "showreel",
        "alt": "Twelve-second hero edit cut from the showreel: hat, concert, wing, rider, sunset, horse, black-and-white, rooftop",
        "kb": 1492
    },
    "jp-sea-fade": {
        "mp4": "film/jp-sea-fade.mp4",
        "webm": "film/jp-sea-fade.webm",
        "poster": "film/jp-sea-fade-poster.jpg",
        "w": 504,
        "h": 390,
        "dur": 6.0,
        "source": "jpsea",
        "alt": "JP at the sea, dissolving into light",
        "kb": 291
    },
    "jp-sea": {
        "mp4": "film/jp-sea.mp4",
        "webm": "film/jp-sea.webm",
        "poster": "film/jp-sea-poster.jpg",
        "w": 504,
        "h": 390,
        "dur": 6.0,
        "source": "jpsea",
        "alt": "JP standing at a sea rail, black and white",
        "kb": 118
    },
    "m-bokeh": {
        "mp4": "film/m-bokeh.mp4",
        "webm": "film/m-bokeh.webm",
        "poster": "film/m-bokeh-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 1.6,
        "source": "showreel",
        "alt": "Light bokeh and sparks",
        "kb": 346
    },
    "m-bts": {
        "mp4": "film/m-bts.mp4",
        "webm": "film/m-bts.webm",
        "poster": "film/m-bts-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 1.8,
        "source": "showreel",
        "alt": "JP behind the camera on set",
        "kb": 200
    },
    "m-bw": {
        "mp4": "film/m-bw.mp4",
        "webm": "film/m-bw.webm",
        "poster": "film/m-bw-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 3.0,
        "source": "showreel",
        "alt": "Black-and-white motion blur",
        "kb": 319
    },
    "m-concert": {
        "mp4": "film/m-concert.mp4",
        "webm": "film/m-concert.webm",
        "poster": "film/m-concert-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 1.8,
        "source": "showreel",
        "alt": "Concert crowd, arms raised against stage light",
        "kb": 164
    },
    "m-hat": {
        "mp4": "film/m-hat.mp4",
        "webm": "film/m-hat.webm",
        "poster": "film/m-hat-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 1.6,
        "source": "showreel",
        "alt": "Cowboy hat turning to camera, desert light",
        "kb": 191
    },
    "m-horse": {
        "mp4": "film/m-horse.mp4",
        "webm": "film/m-horse.webm",
        "poster": "film/m-horse-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 1.5,
        "source": "showreel",
        "alt": "Horse mid-gallop",
        "kb": 248
    },
    "m-moto": {
        "mp4": "film/m-moto.mp4",
        "webm": "film/m-moto.webm",
        "poster": "film/m-moto-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 2.6,
        "source": "showreel",
        "alt": "Rider in a hat on a motorcycle, green grade",
        "kb": 261
    },
    "m-rooftop": {
        "mp4": "film/m-rooftop.mp4",
        "webm": "film/m-rooftop.webm",
        "poster": "film/m-rooftop-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 3.2,
        "source": "showreel",
        "alt": "Friends on a rooftop at sunset",
        "kb": 148
    },
    "m-studio": {
        "mp4": "film/m-studio.mp4",
        "webm": "film/m-studio.webm",
        "poster": "film/m-studio-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 1.6,
        "source": "showreel",
        "alt": "Two subjects in a white studio",
        "kb": 115
    },
    "m-sunset": {
        "mp4": "film/m-sunset.mp4",
        "webm": "film/m-sunset.webm",
        "poster": "film/m-sunset-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 1.8,
        "source": "showreel",
        "alt": "Two figures at sunset, red grade",
        "kb": 218
    },
    "m-truck": {
        "mp4": "film/m-truck.mp4",
        "webm": "film/m-truck.webm",
        "poster": "film/m-truck-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 1.5,
        "source": "showreel",
        "alt": "Yellow truck on an empty desert road",
        "kb": 172
    },
    "m-wing": {
        "mp4": "film/m-wing.mp4",
        "webm": "film/m-wing.webm",
        "poster": "film/m-wing-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 1.6,
        "source": "showreel",
        "alt": "Plane wing over a dry landscape",
        "kb": 188
    },
    "montage-full": {
        "mp4": "film/montage-full.mp4",
        "webm": null,
        "poster": "film/montage-full-poster.jpg",
        "w": 490,
        "h": 960,
        "dur": 47.6,
        "source": "showreel",
        "alt": "The full showreel, muted",
        "kb": 4805
    },
    "nr-dash": {
        "mp4": "film/nr-dash.mp4",
        "webm": "film/nr-dash.webm",
        "poster": "film/nr-dash-poster.jpg",
        "w": 778,
        "h": 512,
        "dur": 3.0,
        "source": "nightride",
        "alt": "Motorcycle dashboard at dusk, teal and orange",
        "kb": 133
    },
    "nr-headlight": {
        "mp4": "film/nr-headlight.mp4",
        "webm": "film/nr-headlight.webm",
        "poster": "film/nr-headlight-poster.jpg",
        "w": 778,
        "h": 512,
        "dur": 3.4,
        "source": "nightride",
        "alt": "Headlight coming down the road at night",
        "kb": 189
    },
    "nr-silhouette": {
        "mp4": "film/nr-silhouette.mp4",
        "webm": "film/nr-silhouette.webm",
        "poster": "film/nr-silhouette-poster.jpg",
        "w": 778,
        "h": 512,
        "dur": 3.2,
        "source": "nightride",
        "alt": "Rider silhouette at dusk",
        "kb": 155
    },
    "w-aim": {
        "mp4": "film/w-aim.mp4",
        "webm": "film/w-aim.webm",
        "poster": "film/w-aim-poster.jpg",
        "w": 680,
        "h": 512,
        "dur": 2.6,
        "source": "western",
        "alt": "Revolver raised beside a saguaro",
        "kb": 176
    },
    "w-draw": {
        "mp4": "film/w-draw.mp4",
        "webm": "film/w-draw.webm",
        "poster": "film/w-draw-poster.jpg",
        "w": 680,
        "h": 512,
        "dur": 3.0,
        "source": "western",
        "alt": "Revolver drawn against the sky, black and white",
        "kb": 99
    },
    "w-gallop": {
        "mp4": "film/w-gallop.mp4",
        "webm": "film/w-gallop.webm",
        "poster": "film/w-gallop-poster.jpg",
        "w": 680,
        "h": 512,
        "dur": 2.4,
        "source": "western",
        "alt": "Horse and rider at speed",
        "kb": 153
    },
    "w-portrait": {
        "mp4": "film/w-portrait.mp4",
        "webm": "film/w-portrait.webm",
        "poster": "film/w-portrait-poster.jpg",
        "w": 680,
        "h": 512,
        "dur": 3.0,
        "source": "western",
        "alt": "Hat portrait, black and white",
        "kb": 159
    },
    "w-ride": {
        "mp4": "film/w-ride.mp4",
        "webm": "film/w-ride.webm",
        "poster": "film/w-ride-poster.jpg",
        "w": 680,
        "h": 512,
        "dur": 3.0,
        "source": "western",
        "alt": "Rider at a gallop, black and white",
        "kb": 233
    },
    "w-saguaro": {
        "mp4": "film/w-saguaro.mp4",
        "webm": "film/w-saguaro.webm",
        "poster": "film/w-saguaro-poster.jpg",
        "w": 680,
        "h": 512,
        "dur": 1.5,
        "source": "western",
        "alt": "Saguaro under moving clouds",
        "kb": 102
    },
    "w-silhouette": {
        "mp4": "film/w-silhouette.mp4",
        "webm": "film/w-silhouette.webm",
        "poster": "film/w-silhouette-poster.jpg",
        "w": 680,
        "h": 512,
        "dur": 2.6,
        "source": "western",
        "alt": "Rider silhouetted against mountains",
        "kb": 63
    }
},
  stills: {
    "ch-camera": {
        "src": "stills/ch-camera.jpg",
        "w": 656,
        "h": 512,
        "source": "highway",
        "alt": "Film camera on a motorcycle tank"
    },
    "ch-detail": {
        "src": "stills/ch-detail.jpg",
        "w": 656,
        "h": 512,
        "source": "highway",
        "alt": "ch detail"
    },
    "ch-ride": {
        "src": "stills/ch-ride.jpg",
        "w": 656,
        "h": 512,
        "source": "highway",
        "alt": "Couple on a chopper on a desert highway"
    },
    "ch-road": {
        "src": "stills/ch-road.jpg",
        "w": 656,
        "h": 512,
        "source": "highway",
        "alt": "Rider on the open highway"
    },
    "fd-clouds": {
        "src": "stills/fd-clouds.jpg",
        "w": 860,
        "h": 512,
        "source": "field",
        "alt": "fd clouds"
    },
    "fd-fence": {
        "src": "stills/fd-fence.jpg",
        "w": 860,
        "h": 512,
        "source": "field",
        "alt": "Dancers on a ranch fence at golden hour"
    },
    "fd-flare": {
        "src": "stills/fd-flare.jpg",
        "w": 860,
        "h": 512,
        "source": "field",
        "alt": "Dancers against the setting sun"
    },
    "fd-headlights": {
        "src": "stills/fd-headlights.jpg",
        "w": 860,
        "h": 512,
        "source": "field",
        "alt": "Truck headlights on a dark field"
    },
    "fd-silhouettes": {
        "src": "stills/fd-silhouettes.jpg",
        "w": 860,
        "h": 512,
        "source": "field",
        "alt": "fd silhouettes"
    },
    "fd-truck": {
        "src": "stills/fd-truck.jpg",
        "w": 860,
        "h": 512,
        "source": "field",
        "alt": "Red pickup under a dusk sky"
    },
    "fo-fire": {
        "src": "stills/fo-fire.jpg",
        "w": 492,
        "h": 960,
        "source": "forest",
        "alt": "Campfire at night"
    },
    "fo-trees": {
        "src": "stills/fo-trees.jpg",
        "w": 492,
        "h": 960,
        "source": "forest",
        "alt": "Pines against a grey sky"
    },
    "fo-umbrella": {
        "src": "stills/fo-umbrella.jpg",
        "w": 492,
        "h": 960,
        "source": "forest",
        "alt": "Figure with an umbrella in a rain-dark forest"
    },
    "jp-sea-rail": {
        "src": "stills/jp-sea-rail.jpg",
        "w": 504,
        "h": 390,
        "source": "jpsea",
        "alt": "jp sea rail"
    },
    "jp-sea": {
        "src": "stills/jp-sea.jpg",
        "w": 504,
        "h": 390,
        "source": "jpsea",
        "alt": "JP standing at a sea rail, black and white"
    },
    "m-bokeh": {
        "src": "stills/m-bokeh.jpg",
        "w": 490,
        "h": 960,
        "source": "showreel",
        "alt": "Light bokeh and sparks"
    },
    "m-bw": {
        "src": "stills/m-bw.jpg",
        "w": 490,
        "h": 960,
        "source": "showreel",
        "alt": "Black-and-white motion blur"
    },
    "m-concert": {
        "src": "stills/m-concert.jpg",
        "w": 490,
        "h": 960,
        "source": "showreel",
        "alt": "Concert crowd, arms raised against stage light"
    },
    "m-hat": {
        "src": "stills/m-hat.jpg",
        "w": 490,
        "h": 960,
        "source": "showreel",
        "alt": "Cowboy hat turning to camera, desert light"
    },
    "m-horse": {
        "src": "stills/m-horse.jpg",
        "w": 490,
        "h": 960,
        "source": "showreel",
        "alt": "Horse mid-gallop"
    },
    "m-moto": {
        "src": "stills/m-moto.jpg",
        "w": 490,
        "h": 960,
        "source": "showreel",
        "alt": "Rider in a hat on a motorcycle, green grade"
    },
    "m-rooftop": {
        "src": "stills/m-rooftop.jpg",
        "w": 490,
        "h": 960,
        "source": "showreel",
        "alt": "Friends on a rooftop at sunset"
    },
    "m-studio": {
        "src": "stills/m-studio.jpg",
        "w": 490,
        "h": 960,
        "source": "showreel",
        "alt": "Two subjects in a white studio"
    },
    "m-sunset": {
        "src": "stills/m-sunset.jpg",
        "w": 490,
        "h": 960,
        "source": "showreel",
        "alt": "Two figures at sunset, red grade"
    },
    "m-wing": {
        "src": "stills/m-wing.jpg",
        "w": 490,
        "h": 960,
        "source": "showreel",
        "alt": "Plane wing over a dry landscape"
    },
    "nr-dash": {
        "src": "stills/nr-dash.jpg",
        "w": 778,
        "h": 512,
        "source": "nightride",
        "alt": "Motorcycle dashboard at dusk, teal and orange"
    },
    "nr-headlight": {
        "src": "stills/nr-headlight.jpg",
        "w": 778,
        "h": 512,
        "source": "nightride",
        "alt": "Headlight coming down the road at night"
    },
    "nr-silhouette": {
        "src": "stills/nr-silhouette.jpg",
        "w": 778,
        "h": 512,
        "source": "nightride",
        "alt": "Rider silhouette at dusk"
    },
    "w-aim": {
        "src": "stills/w-aim.jpg",
        "w": 680,
        "h": 512,
        "source": "western",
        "alt": "Revolver raised beside a saguaro"
    },
    "w-gallop": {
        "src": "stills/w-gallop.jpg",
        "w": 680,
        "h": 512,
        "source": "western",
        "alt": "Horse and rider at speed"
    },
    "w-hat": {
        "src": "stills/w-hat.jpg",
        "w": 680,
        "h": 512,
        "source": "western",
        "alt": "w hat"
    },
    "w-portrait": {
        "src": "stills/w-portrait.jpg",
        "w": 680,
        "h": 512,
        "source": "western",
        "alt": "Hat portrait, black and white"
    },
    "w-saguaro": {
        "src": "stills/w-saguaro.jpg",
        "w": 680,
        "h": 512,
        "source": "western",
        "alt": "Saguaro under moving clouds"
    },
    "w-silhouette": {
        "src": "stills/w-silhouette.jpg",
        "w": 680,
        "h": 512,
        "source": "western",
        "alt": "Rider silhouetted against mountains"
    },
    "w-skyward": {
        "src": "stills/w-skyward.jpg",
        "w": 680,
        "h": 512,
        "source": "western",
        "alt": "w skyward"
    }
},

  /* The body of work, as working labels. Each concept selects 4–6. */
  works: [
    { id: 'showreel',  label: 'Showreel',                     title: 'Showreel',                       year: '2025', roles: ['Direction', 'Camera', 'Edit'], note: 'A cross-section of the work',        film: 'hero-montage',   long: 'montage-full', still: 'm-sunset',    orient: 'portrait' },
    { id: 'field',     label: 'Music Video',                  title: 'Field at Dusk',                  year: '',     roles: ['Direction', 'Camera'],         note: 'Dancers, a red pickup, golden hour',  film: 'fd-flare',       still: 'fd-flare',    orient: 'landscape', alt: ['fd-fence','fd-truck','fd-dance','fd-headlights'] },
    { id: 'western',   label: 'Music Video',                  title: 'Western, Black & White',         year: '',     roles: ['Direction', 'Camera'],         note: 'Rider, revolver, saguaro',            film: 'w-ride',         still: 'w-silhouette', orient: 'landscape', alt: ['w-draw','w-silhouette','w-saguaro','w-gallop','w-aim','w-portrait'] },
    { id: 'nightride', label: 'Music Video',                  title: 'Night Ride',                     year: '',     roles: ['Camera', 'Edit'],              note: 'Motorcycle, dusk, headlights',        film: 'nr-silhouette',  still: 'nr-headlight', orient: 'landscape', alt: ['nr-dash','nr-headlight'] },
    { id: 'highway',   label: 'Music Video',                  title: 'Desert Highway',                 year: '',     roles: ['Camera'],                      note: 'A chopper, a film camera, open road', film: 'ch-ride',        still: 'ch-road',     orient: 'landscape', alt: ['ch-road','ch-camera'] },
    { id: 'forest',    label: 'Short · Personal',             title: 'Forest, Rain',                   year: '',     roles: ['Direction', 'Camera'],         note: 'Umbrella, pines, campfire',           film: 'fo-trees',       still: 'fo-trees',    orient: 'portrait',  alt: ['fo-umbrella','fo-dance','fo-fire'] },
    { id: 'prints',    label: 'Photography · Exhibited',      title: 'Prints',                         year: '2025', roles: ['Photography'],                 note: 'Niagra Arc · Sixth & Strings · Stacked Lives', photo: 'jp-exhibition', orient: 'landscape' },
    { id: 'self',      label: 'Personal',                     title: 'At the Sea',                     year: '',     roles: ['Camera'],                      note: 'JP, black and white',                 film: 'jp-sea',         still: 'jp-sea',      orient: 'band' }
  ],

  /* Verified public facts only. Anything else stays placeholder copy. */
  person: {
    name: 'JP Silva', studio: 'JP Media', roles: ['Filmmaker', 'Producer', 'Photographer'],
    city: 'Austin, Texas', coords: '30.2672° N, 97.7431° W', origin: 'Bauru, São Paulo, Brazil',
    instagram: '@jp.media', focus: ['Film', 'Music & live performance', 'Portraits', 'Landscape', 'Documentary'],
    movedToAustin: 'spring 2025', exhibited: true /* his prints have hung in a group exhibition (Niagra Arc, Sixth & Strings, Stacked Lives) */
  }
};
