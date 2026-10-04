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

  /* The body of work, as working labels. Each concept selects 4–6. */
  works: [
    { id: 'film-01',   label: 'Selected Film',       title: 'Working Title I',   year: '2025', roles: ['Direction', 'Camera', 'Edit'],      note: 'Short film · narrative',           plate: 'night-halation', loop: 'dust' },
    { id: 'live-01',   label: 'Music · Live',         title: 'Live, Austin',      year: '2025', roles: ['Camera', 'Edit'],                   note: 'Live performance film',           plate: 'stage-red',      loop: 'stage' },
    { id: 'mv-01',     label: 'Music Video',          title: 'Soundcheck',        year: '2024', roles: ['Direction', 'Camera'],              note: 'Music video',                     plate: 'stage-vertical' },
    { id: 'tour-01',   label: 'Documentary · Personal', title: 'Tour Diary',      year: '2024', roles: ['Camera', 'Photography'],            note: 'On the road with a touring band', plate: 'leak-warm',      loop: 'sun' },
    { id: 'por-01',    label: 'Photography Series',   title: 'Portraits, Vol. I', year: '2025', roles: ['Photography'],                      note: 'Portrait series',                 plate: 'mono-leak' },
    { id: 'land-01',   label: 'Landscape · Personal', title: 'Hill Country',      year: '2024', roles: ['Photography'],                      note: 'Landscape series, Texas',         plate: 'dusk-horizon',   loop: 'sun' },
    { id: 'bw-01',     label: 'Photography Series',   title: 'Black & White',     year: '2023', roles: ['Photography'],                      note: 'Monochrome series',               plate: 'mono-grain' },
    { id: 'bts-01',    label: 'Behind the Work',      title: 'Production Stills', year: '2025', roles: ['Photography'],                      note: 'Behind the scenes',               plate: 'dusk-haze' }
  ],

  /* Verified public facts only. Anything else stays placeholder copy. */
  person: {
    name: 'JP Silva', studio: 'JP Media', roles: ['Filmmaker', 'Producer', 'Photographer'],
    city: 'Austin, Texas', coords: '30.2672° N, 97.7431° W', origin: 'Bauru, São Paulo, Brazil',
    instagram: '@jp.media', focus: ['Film', 'Music & live performance', 'Portraits', 'Landscape', 'Documentary']
  }
};
