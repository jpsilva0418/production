/* ============================================================
   JP SILVA MEDIA — work (single source of truth)
   One entry per project. Pages, the Work index, the home reel and the sitemap are generated from this list.

   Field guide
     slug        URL: /work/<slug>
     title       the work's real title. For his own uploads whose release title is not known yet, a working
                 descriptor is used and `titleConfirmed:false` marks it for JP to confirm.
     artist      artist (music) — client: company/brand — both optional
     category    ids from `categories` below (first one is primary)
     type        one line, e.g. "Official music video"
     year        only when verified (null otherwise)
     credits     only credits that are verified, each with its source
     media       { kind:'youtube', id } | { kind:'file', film:'<slug>' } (public/media/films/<slug>.mp4|.webm)
                 | { kind:'photo' }
     poster      { src, small, w, h, alt } (relative to public/)
     gallery     [{ src, w, h, alt }] stills (lightbox)
     featured    shown on the home page
     order       sort order on the Work index (ascending)
   ============================================================ */

export const categories = [
  { id: 'music-videos', label: 'Music videos' },
  { id: 'venue-showcase', label: 'Venue showcase' },
  { id: 'live', label: 'Live performance' },
  { id: 'commercial', label: 'Commercial & brand' },
  { id: 'film-video', label: 'Film & video' },
  { id: 'photography', label: 'Photography' },
  { id: 'portraits', label: 'Portraits' },
  { id: 'personal', label: 'Personal projects' }
];

const yt = (id, alt) => ({ src: `media/posters/yt-${id}.jpg`, small: `media/posters/yt-${id}-640.jpg`, w: 1280, h: 720, alt });
const still = (name, w, h, alt) => ({ src: `media/stills/${name}.jpg`, w, h, alt });
const FD = [824, 462], WE = [630, 496], NR = [734, 384], CH = [654, 450], PORT = [478, 960], FO = [486, 950], SEA = [490, 378];

export const projects = [
  /* ---------------- On YouTube (titles and channels from YouTube's oEmbed, Oct 2026) ---------------- */
  {
    id: 'ready', slug: 'ready', order: 1, featured: true,
    title: 'READY', artist: 'R-Dee', client: null,
    category: ['music-videos'], type: 'Official music video', year: null,
    credits: [],
    media: { kind: 'youtube', id: 'uM2j8bYrv68', channel: 'R-Dee' },
    poster: yt('uM2j8bYrv68', 'R-Dee and his crew in a red-lit warehouse, a frame from the READY music video'),
    gallery: [], description: null
  },
  {
    id: 'a-grave-in-heaven', slug: 'a-grave-in-heaven', order: 2, featured: true,
    title: 'A Grave In Heaven', artist: 'CZYK', client: null,
    category: ['music-videos'], type: 'Official music video', year: null,
    credits: [],
    media: { kind: 'youtube', id: 'bQmgSBOyIBQ', channel: 'CZYK' },
    poster: yt('bQmgSBOyIBQ', 'A dancer in green light against black, a frame from the CZYK video'),
    gallery: [], description: null
  },
  {
    id: 'geronimo', slug: 'geronimo', order: 3, featured: true,
    title: 'Geronimo', artist: 'Ian Munsick', client: null,
    category: ['music-videos'], type: 'Official music video', year: null,
    /* Source: the film's own title card (poster frame). */
    credits: [
      { role: 'Directed by', name: 'Ben Christensen' },
      { role: 'Shot by', name: 'Isaac Spotts, JP Silva, Jay', jp: true },
      { role: 'Edited by', name: 'Jay, Keaton Hubbard' }
    ],
    media: { kind: 'youtube', id: 'D9iNANLSWJI', channel: 'IanMunsickVEVO' },
    poster: yt('D9iNANLSWJI', 'Title card for Ian Munsick, Geronimo: a white cowboy hat over gold lettering'),
    gallery: [], description: null
  },
  {
    id: 'the-ellwood', slug: 'the-ellwood-at-goleta-beach', order: 4, featured: true,
    title: 'The Ellwood at Goleta Beach', artist: null, client: 'GigFinesse',
    category: ['venue-showcase', 'commercial'], type: 'Venue showcase for GigFinesse', year: null,
    credits: [],
    media: { kind: 'youtube', id: 'IO-0co8MI4Y', channel: 'GigFinesse' },
    poster: yt('IO-0co8MI4Y', 'A singer at a gold microphone in warm window light'),
    gallery: [], description: null
  },
  {
    id: 'cued-up', slug: 'cued-up-mer-bear', order: 5, featured: true,
    title: 'Cue’d Up ft. Mer Bear', artist: 'Mer Bear', client: 'GigFinesse',
    category: ['live', 'commercial'], type: 'GigFinesse Originals, live session', year: null,
    credits: [],
    media: { kind: 'youtube', id: '3qoGu5U9sfc', channel: 'GigFinesse' },
    poster: yt('3qoGu5U9sfc', 'Mer Bear singing at a DJ setup on a cliff above the ocean'),
    gallery: [], description: null
  },

  /* ---------------- His own films (supplied by the founder; release titles to confirm) ---------------- */
  {
    id: 'showreel', slug: 'showreel', order: 6, featured: true,
    title: 'Showreel', artist: null, client: null, titleConfirmed: true,
    category: ['film-video'], type: 'A cross-section of the work', year: null,
    credits: [],
    media: { kind: 'file', film: 'showreel', w: 478, h: 960, duration: 47.6 },
    poster: still('m-sunset', ...PORT, 'Two figures at sunset, a frame from the showreel'),
    gallery: [
      still('m-hat', ...PORT, 'Cowboy hat turning to camera in desert light'),
      still('m-concert', ...PORT, 'A crowd with arms raised against stage light'),
      still('m-wing', ...PORT, 'A plane wing over a dry landscape'),
      still('m-moto', ...PORT, 'A rider in a hat on a motorcycle, green grade'),
      still('m-studio', ...PORT, 'Two subjects in a white studio'),
      still('m-bw', ...PORT, 'A portrait in black and white'),
      still('m-rooftop', ...PORT, 'Friends on a rooftop at sunset')
    ],
    description: null
  },
  {
    id: 'field-at-dusk', slug: 'field-at-dusk', order: 7, featured: true,
    title: 'Field at Dusk', titleConfirmed: false, artist: null, client: null,
    category: ['film-video'], type: 'Film', year: null, credits: [],
    media: { kind: 'file', film: 'field-at-dusk', w: 824, h: 462, duration: 85.6 },
    poster: still('fd-flare', ...FD, 'Dancers against the setting sun'),
    gallery: [
      still('fd-fence', ...FD, 'Dancers on a ranch fence at golden hour'),
      still('fd-silhouettes', ...FD, 'Silhouettes dancing at sunset'),
      still('fd-truck', ...FD, 'A pickup with its lights on under a dusk sky'),
      still('fd-headlights', ...FD, 'Headlights crossing a dark field'),
      still('fd-clouds', ...FD, 'Clouds over the field after sundown')
    ],
    description: null
  },
  {
    id: 'western', slug: 'western', order: 8, featured: true,
    title: 'Western, Black & White', titleConfirmed: false, artist: null, client: null,
    category: ['film-video'], type: 'Film', year: null, credits: [],
    media: { kind: 'file', film: 'western', w: 630, h: 496, duration: 60 },
    poster: still('w-gallop', ...WE, 'Horse and rider at speed, black and white'),
    gallery: [
      still('w-portrait', ...WE, 'Hat portrait, black and white'),
      still('w-aim', ...WE, 'A revolver raised against the sky'),
      still('w-silhouette', ...WE, 'A rider silhouetted against mountains'),
      still('w-saguaro', ...WE, 'A saguaro under moving cloud'),
      still('w-skyward', ...WE, 'A revolver pointed skyward beside a saguaro'),
      still('w-hat', ...WE, 'A wide hat brim in profile')
    ],
    description: null
  },
  {
    id: 'night-ride', slug: 'night-ride', order: 9, featured: true,
    title: 'Night Ride', titleConfirmed: false, artist: null, client: null,
    category: ['film-video'], type: 'Film', year: null, credits: [],
    media: { kind: 'file', film: 'night-ride', w: 734, h: 384, duration: 36.7 },
    poster: still('nr-headlight', ...NR, 'A headlight coming down the road at night'),
    gallery: [
      still('nr-dash', ...NR, 'A motorcycle dashboard at dusk'),
      still('nr-silhouette', ...NR, 'A rider in silhouette against a dusk sky'),
      still('nr-headlight', ...NR, 'A headlight coming down the road at night')
    ],
    description: null
  },
  {
    id: 'desert-highway', slug: 'desert-highway', order: 10, featured: false,
    title: 'Desert Highway', titleConfirmed: false, artist: null, client: null,
    category: ['film-video'], type: 'Film', year: null, credits: [],
    media: { kind: 'file', film: 'desert-highway', w: 654, h: 450, duration: 23.9 },
    poster: still('ch-road', ...CH, 'A chopper on the open desert highway'),
    gallery: [
      still('ch-ride', ...CH, 'A couple riding a chopper through the desert'),
      still('ch-camera', ...CH, 'A film camera resting on a motorcycle tank'),
      still('ch-detail', ...CH, 'Studs on a leather motorcycle seat')
    ],
    description: null
  },
  {
    id: 'forest-rain', slug: 'forest-rain', order: 11, featured: false,
    title: 'Forest, Rain', titleConfirmed: false, artist: null, client: null,
    category: ['film-video'], type: 'Film', year: null, credits: [],
    media: { kind: 'file', film: 'forest-rain', w: 486, h: 950, duration: 23.8 },
    poster: still('fo-trees', ...FO, 'Pines against a grey sky'),
    gallery: [
      still('fo-umbrella', ...FO, 'A figure with an umbrella in a rain-dark forest'),
      still('fo-fire', ...FO, 'A campfire at night')
    ],
    description: null
  },
  {
    id: 'at-the-sea', slug: 'at-the-sea', order: 12, featured: false,
    title: 'At the Sea', titleConfirmed: false, artist: null, client: null,
    category: ['personal'], type: 'Personal film', year: null, credits: [],
    media: { kind: 'file', film: 'at-the-sea', w: 490, h: 378, duration: 42.8 },
    poster: still('jp-sea', ...SEA, 'JP Silva at a sea rail in black and white'),
    gallery: [still('jp-sea-rail', ...SEA, 'JP at the rail, the sea beyond')],
    description: null
  },

  /* ---------------- Photography ---------------- */
  {
    id: 'prints', slug: 'prints', order: 13, featured: false,
    title: 'Prints', titleConfirmed: true, artist: null, client: null,
    category: ['photography'], type: 'Group exhibition', year: 2025,
    credits: [], media: { kind: 'photo' },
    poster: { src: 'media/photos/jp-exhibition.jpg', small: 'media/photos/jp-exhibition-800.jpg', w: 1320, h: 1034, alt: 'JP Silva beside four of his prints on a gallery wall' },
    gallery: [{ src: 'media/photos/jp-exhibition.jpg', w: 1320, h: 1034, alt: 'JP Silva beside four of his prints on a gallery wall: a rainbow over a cliff, a night street, a hillside city and a portrait in black and white' }],
    /* the print titles are legible on the wall labels in the photo */
    description: 'Four prints on the wall, including Niagra Arc, Sixth & Strings and Stacked Lives.'
  }
];

export const byId = Object.fromEntries(projects.map(p => [p.id, p]));
export const sorted = () => projects.slice().sort((a, b) => a.order - b.order);
export const displayTitle = p => p.artist && p.category.includes('music-videos') ? `${p.artist} — ${p.title}` : p.title;
