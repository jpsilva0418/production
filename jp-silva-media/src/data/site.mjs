/* ============================================================
   JP SILVA MEDIA — site facts (single source of truth)
   Everything a visitor reads about the business comes from here.
   Fields marked CONFIRM are sourced but should be confirmed with JP before launch.
   ============================================================ */
export const site = {
  brand: 'JP Silva Media',
  person: 'JP Silva',
  roles: ['Filmmaker', 'Producer', 'Photographer'],
  /* canonical origin at launch (his existing domain). The preview build is noindex. */
  url: 'https://www.jpsilvamedia.com',
  location: { city: 'Austin', region: 'Texas', regionCode: 'TX', country: 'US', coords: '30.2672° N · 97.7431° W' },
  origin: 'Bauru, São Paulo, Brazil',
  /* public contact address listed on jpsilvamedia.com/contact. CONFIRM it is the inbox JP wants on the new site. */
  email: 'jpsilvafilms@gmail.com',
  socials: [
    { id: 'instagram', label: 'Instagram', handle: '@jp.media', url: 'https://www.instagram.com/jp.media/' },
    { id: 'youtube', label: 'YouTube', handle: '@jpsilvafilms', url: 'https://www.youtube.com/@jpsilvafilms' }
  ],
  nav: [
    { id: 'work', label: 'Work', route: 'work', tc: '00:01' },
    { id: 'services', label: 'Services', route: 'services', tc: '00:02' },
    { id: 'about', label: 'About', route: 'about', tc: '00:03' },
    { id: 'inquire', label: 'Inquire', route: 'inquire', tc: '00:04' }
  ],

  /* ---- About (replaceable fields) ---- */
  about: {
    portrait: { src: 'media/photos/jp-portrait-4x5.jpg', small: 'media/photos/jp-portrait-4x5-800.jpg', w: 1046, h: 1308, alt: 'JP Silva laughing in a sunlit dry field, round glasses, white T-shirt' },
    portraitWide: { src: 'media/photos/jp-portrait.jpg', small: 'media/photos/jp-portrait-800.jpg', w: 1320, h: 1308, alt: 'JP Silva in a dry field under afternoon sun' },
    exhibition: { src: 'media/photos/jp-exhibition.jpg', small: 'media/photos/jp-exhibition-800.jpg', w: 1320, h: 1034, alt: 'JP Silva standing beside his printed photographs on a gallery wall', caption: 'Prints shown, group exhibition, 2025' },
    /* Short bio. Sources: Voyage Phoenix interview "Rising Stars: Meet JP Silva" (origin, age at move, Phoenix live-music
       start) and JP's own Instagram (Austin since spring 2025). CONFIRM wording with JP. */
    short: 'JP Silva is a filmmaker, producer and photographer based in Austin, Texas.',
    bio: [
      'Born in Bauru, São Paulo, Brazil, JP moved to the United States at thirteen. He started out shooting live shows in Phoenix, and the cameras followed the bands: music videos, tours, the long days and late nights in between.',
      'Today he makes music videos for artists, films for brands and venues, and photographs that sit somewhere between the two. He has been based in Austin since 2025.'
    ],
    philosophy: 'Feeling first. Whether it is a live show, a music video or a quiet minute behind the scenes, the job is to catch something honest while it is still raw.',
    /* JP's own words, from the About page of his current site (jpsilvamedia.com/about). */
    inHisWords: [
      'I’ve always been more interested in honest shots than “perfect” ones. As a filmmaker, I find myself drawn to the quiet pauses and the unscripted moments that people don’t usually plan for, but always feel.',
      'My process is built on observation. I show up to listen and understand the room before I ever hit record. Visually, I lean toward a moody, cinematic aesthetic, utilizing grain and raw textures to create films that feel more like a memory than a broadcast.'
    ],
    interview: { label: 'Rising Stars: Meet JP Silva of Austin, TX', outlet: 'Voyage Phoenix', url: 'https://voyagephoenix.com/interview/rising-stars-meet-jp-silva-of-austin-tx' },
    serviceArea: null /* e.g. 'Austin, Texas and on location' — CONFIRM before showing */,
    facts: [
      { label: 'Based', value: 'Austin, Texas', note: 'Since 2025' },
      { label: 'From', value: 'Bauru, São Paulo, Brazil' },
      { label: 'Works in', value: 'Music video, brand film, live, photography' },
      { label: 'Exhibited', value: 'Prints in a group exhibition', note: '2025' }
    ]
  },

  /* ---- Services ---- */
  services: {
    intro: 'Film, music video and photography for artists, venues and brands.',
    list: [
      { id: 'music-videos', title: 'Music videos', line: 'From the first idea to the final cut: performance, narrative, or both.', work: 'music-videos' },
      { id: 'film-video', title: 'Film & video production', line: 'Short films, documentary pieces and story-led video.', work: 'film-video' },
      { id: 'commercial', title: 'Commercial & brand content', line: 'Brand films, branded series and social cuts for companies and venues.', work: 'commercial' },
      { id: 'live', title: 'Live & event coverage', line: 'Shows, sessions and events, filmed and photographed as they happen.' },
      { id: 'photography', title: 'Photography', line: 'Editorial, live and on-set stills.', work: 'photography' },
      { id: 'portraits', title: 'Portrait sessions', line: 'Portraits for artists, press and personal work.' },
      { id: 'production', title: 'Creative production', line: 'Planning and producing shoots end to end: locations, schedule, people, delivery.' }
    ],
    process: [
      { title: 'Inquiry', line: 'Tell JP what you are making, when and where. A short reply follows by email.' },
      { title: 'Treatment & plan', line: 'The idea in writing, then the schedule, locations and budget around it.' },
      { title: 'Production', line: 'The shoot, planned so the day can stay loose enough for real moments.' },
      { title: 'Edit & delivery', line: 'The cut, the grade and every format you need to put it out.' }
    ]
  },

  /* ---- Inquiry ---- */
  inquiry: {
    types: ['Music video', 'Video / film production', 'Commercial / brand content', 'Photography', 'Portrait session', 'Event / coverage', 'Creative production', 'Other'],
    budgets: ['Under $1,000', '$1,000 – $2,500', '$2,500 – $5,000', '$5,000 – $10,000', '$10,000+', 'Not sure yet'],
    contactMethods: ['Email', 'Phone call', 'Text', 'Instagram'],
    heardFrom: ['Instagram', 'YouTube', 'A friend or referral', 'Saw a project', 'Search', 'Other'],
    next: [
      'JP reads every inquiry himself.',
      'You will get a reply by email, usually with a few questions about the idea, the date and the place.',
      'If it is time-sensitive, say so on Instagram too: @jp.media.'
    ]
  },

  /* ---- Home reel: which films play in the Featured Work reel, in order ---- */
  reel: {
    youtube: ['ready', 'a-grave-in-heaven', 'geronimo', 'the-ellwood', 'cued-up'],
    /* used when YouTube cannot load on the host (the private preview blocks embeds): his own files, with sound */
    files: ['field-at-dusk', 'western', 'night-ride', 'desert-highway', 'showreel'],
    segment: 28 /* seconds each film plays in the muted reel before the next one */
  }
};
