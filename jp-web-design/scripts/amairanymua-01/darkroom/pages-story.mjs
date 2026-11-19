/* /demo/amairanymua-01 — site "darkroom": the STORY pages (Bridal, About).

   Bridal: the title card; all six of her packages as two price boards (hair & makeup packages,
   single services) with HER.packagesNote and her booking page for current pricing; "Destination
   bride?" as a print on the table under the safelight; her FAQ as native <details> rows whose
   answers come up like a print; how to prepare beside a print and a strip of film; the end card.

   About: the title card with her portrait print and "Hey Gorgeous!" in grease pencil; her About Me
   quoted as hers with years and badges as edge markings; her services (HER.services), and the
   photography question answered in her words as an FAQ card, kept apart from her services (film
   photography is her fiancé's separate service); "In motion": two prints beside two strips of
   film; Love Notes hung on a line in the dark; the end card.

   Every fact comes from site.mjs (HER, REVIEWS, SITE). Grease pencil carries her words or a
   two-word interface mark only. Styles: assets/darkroom/pages-story.css. */
import { SITE, HER, FINAL, ABOUT, L, href, inquire, book, arrow, src, srcset } from '../site.mjs';
import { S, page, cover, band, chapter, kick, h, print, strip, board, loveNotes, cta, note, ring, underline, tick, scrawlArrow, booking, more, edge } from './shell.mjs';

const pad = (n) => String(n).padStart(2, '0');
const COVER_SIZES = '(max-width:759px) 78vw, 36vw';
const preload = (key) => `<link rel="preload" as="image" href="${src(key, 800)}" imagesrcset="${srcset(key)}" imagesizes="${COVER_SIZES}" fetchpriority="high">`;
const pkg = (name) => HER.packages.find((p) => p.name === name);
/* "— Amairany, in her own words": the attribution under anything quoted from her */
const hers = (cls = '') => `<p class="edge st-src${cls ? ` ${cls}` : ''}">${SITE.first}, in her own words</p>`;
/* a line of edge markings (true information only), each item kept whole */
const specLine = (items, cls) => `<p class="edge spec ${cls}">${items.map((t) => `<span class="spec-i">${t}</span>`).join('<span class="spec-s" aria-hidden="true">&#9656;</span>')}</p>`;

/* ======================================================================
   BRIDAL
   ====================================================================== */
const GROUPS = [
  { id: 'hm', title: 'Hair &amp; makeup packages', sub: 'The bride, or the bride and her party', names: ['The Luxe Bride', 'The Signature Soiree', 'The Luxe Gala'], tilt: -0.5 },
  { id: 'single', title: 'Single services', sub: 'Makeup only, or hair only', names: ['The Radiant Bride', 'The Luxe Glam', 'Glam Hair'], tilt: 0.6 },
];
/* the kit's price board, every inclusion listed; the note is shown once, under both boards */
const groupBoard = (g, offset) => board({ pkgs: g.names.map(pkg), points: 99, popular: g.id === 'hm' ? 'The Signature Soiree' : '' })
  .replace(/<p class="board-note">[\s\S]*?<\/p>/, '')
  .replace(/(<span class="board-n" aria-hidden="true">)(\d+)(<\/span>)/g, (m, a, n, b) => `${a}${pad(+n + offset)}${b}`);

const packages = () => band(`${chapter({ kick: 'The price board', n: '02', heading: ['Six packages,', 'as listed.'], split: true, lead: 'All six of her bridal packages, with the prices and everything they include as listed on her booking page.' })}
<div class="bs-pk">
${GROUPS.map((g, i) => `<div class="bs-grp rv" style="--d:${(0.1 * i).toFixed(2)}s;--tilt:${g.tilt}deg">
<header class="bs-grp-h"><h3 class="d-s">${g.title}</h3><p class="edge">${g.sub} &middot; ${g.names.length} packages</p></header>
${groupBoard(g, i * 3)}
</div>`).join('\n')}
</div>
<div class="bs-pk-foot rv">
<p class="bs-pk-note">${HER.packagesNote}</p>
<p class="bs-pk-cur">Prices can change: current pricing is always on ${book('schedule', `her booking page ${arrow}`, 'bs-pk-link')}</p>
</div>`, { tone: 'paper', id: 'packages', label: 'Bridal packages' });

const destination = () => band(`<div class="bs-dest">
<div class="bs-dest-tx">
${kick('Travel', { n: '03', cls: 'rv' })}
${h(2, HER.destination.heading, 'd-l bs-dest-h rv', 'style="--d:.06s"')}
<blockquote class="bs-dest-q rv" style="--d:.12s"><p>&ldquo;${HER.destination.body.replace('worldwide', underline('worldwide'))}&rdquo;</p></blockquote>
${hers('rv')}
${specLine(['Central Florida', 'out of state', 'worldwide'], 'bs-dest-edge rv')}
<div class="acts bs-dest-acts rv" style="--d:.22s">${inquire(S, `Start your bridal inquiry ${arrow}`, 'btn btn--main')}<a class="btn btn--line" href="${L.mail}">Email ${SITE.first}</a></div>
</div>
<div class="bs-dest-pr rv" style="--d:.1s">
${print('golden-hour', { n: '03A', tilt: -2.2, note: 'worldwide', sizes: '(max-width:759px) 74vw, 34vw' })}
<span class="bs-dest-arrow" aria-hidden="true">${scrawlArrow('se')}</span>
</div>
</div>`, { tone: 'tray', id: 'destination', cls: 'bs-dest-b', label: HER.destination.heading });

const faq = () => `<div class="bs-faq">
<div class="bs-faq-hd">
${chapter({ kick: 'Good to know', n: '04', heading: ['Her answers,', 'as she wrote them.'], lead: 'The questions brides ask her most, answered in her own words. Tap a question to bring its answer up.' })}
</div>
<div class="bs-faq-l rv" style="--d:.1s">
${HER.faq.map(([q, a], i) => `<details class="faq"${i === 0 ? ' open' : ''}>
<summary class="faq-q"><span class="faq-n" aria-hidden="true">Q${pad(i + 1)}</span><span class="faq-t">${q}</span><span class="faq-mk" aria-hidden="true"></span></summary>
<div class="faq-a"><p>&ldquo;${a}&rdquo;</p></div>
</details>`).join('\n')}
${hers('bs-faq-src')}
</div>
</div>`;

const prepare = () => `<div class="bs-prep" id="prepare">
<div class="bs-prep-tx">
${kick('How to prepare', { n: '05', cls: 'rv' })}
${h(2, ['Before you sit', 'in her chair.'], 'd-l rv', 'style="--d:.06s"')}
<ol class="bs-prep-l rv rv-w" style="--d:.12s">
${HER.prepare.map((p, i) => `<li><span class="bs-prep-n" aria-hidden="true">${pad(i + 1)}</span><span class="bs-prep-t">${p}</span>${tick('bs-prep-tk')}</li>`).join('\n')}
</ol>
${hers('rv')}
<div class="rv" style="--d:.18s">${more(href(S, 'journal/how-to-prepare'), 'Read the note on preparing')}</div>
</div>
<div class="bs-pair">
<div class="bs-pair-pr">
${print('bride-pearls', { n: '05A', tilt: -1.6, sizes: '(max-width:759px) 50vw, 30vw', stage: 480 })}
<p class="edge bs-pair-cap"><span class="bs-pair-n">&#9656; 05A</span> Bridal &middot; getting ready</p>
</div>
<div class="bs-pair-film">
${strip('f1', { n: '06A', label: 'Bridal' })}
<p class="edge bs-pair-cap">Film 01 &middot; a bridal reel</p>
</div>
</div>
</div>`;

const faqPrep = () => band(`${faq()}\n${prepare()}`, { tone: 'paper', id: 'faq', label: 'Good to know, and how to prepare' });

export const bridal = () => page({
  path: 'bridal',
  title: 'Bridal Hair & Makeup Packages',
  description: `All six of ${SITE.name}’s bridal hair and makeup packages with prices as listed on her booking page, her answers to the questions brides ask, and how to prepare.`,
  head: preload('bride-ruby'),
  css: ['pages-story'],
  bodyClass: 'pg-bridal',
  main: `${cover({
    kick: `The Bridal Experience &middot; ${SITE.area}`,
    n: '01',
    heading: ['Bridal hair', '&amp; makeup.'],
    sub: 'Hair and makeup for the bride and the people getting ready with her. Six packages, priced as listed, and her own answers to what brides ask.',
    actions: `${booking('bs-cover-nowb')}<div class="acts">${inquire(S, `Bridal inquiry ${arrow}`, 'btn btn--main')}${book('bridal-services', 'Explore Bridal Services', 'btn btn--line')}</div>`,
    image: 'bride-ruby',
    frame: '01A',
    note: 'the bride',
    tilt: 2,
  })}
${packages()}
${destination()}
${faqPrep()}
${cta({ copy: FINAL.line, scrawl: 'Let’s create magic together!' })}`,
});

/* ======================================================================
   ABOUT
   ====================================================================== */
const [hey, iam] = HER.hello.split(/(?<=!)\s+/);
const SPEC = [...HER.years.map(([k, v]) => `${v} ${k.toLowerCase()}`), ...HER.badges];
const photoQ = HER.faq.find(([q]) => /photography/i.test(q));

const words = () => `<div class="ab-words">
${specLine(SPEC, 'ab-spec rv')}
<div class="ab-words-g">
<div class="ab-words-side">
${kick('Her About Me', { n: '02', cls: 'rv' })}
${h(2, ['In her', 'own words.'], 'd-l rv', 'style="--d:.06s"')}
<dl class="ab-yrs rv" style="--d:.12s">${HER.years.map(([k, v]) => `<div><dt>${k}</dt><dd>${v.replace(' years', '<span> years</span>')}</dd></div>`).join('')}</dl>
<ul class="ab-badges rv" style="--d:.16s">${HER.badges.map((b) => `<li>${tick()}<span class="edge">${b}</span></li>`).join('')}</ul>
</div>
<div class="ab-words-q">
<blockquote class="ab-q rv" style="--d:.1s">
${HER.about.map((p, i) => `<p${i === 0 ? ' class="ab-q1"' : ''}>${i === 0 ? '&ldquo;' : ''}${p.replace('“CAKE FREE”', ring('“CAKE FREE”'))}${i === HER.about.length - 1 ? '&rdquo;' : ''}</p>`).join('\n')}
</blockquote>
${hers('rv')}
</div>
</div>
</div>`;

const services = () => `<div class="ab-svc" id="services">
<div class="ab-svc-main">
${kick('Her services', { n: '03', cls: 'rv' })}
<ol class="ab-svc-l rv" style="--d:.06s">
${HER.services.map((s, i) => `<li><span class="ab-svc-n" aria-hidden="true">${pad(i + 1)}A</span><span class="ab-svc-t">${i === 0 ? underline(s) : s}</span></li>`).join('\n')}
</ol>
<div class="ab-svc-acts rv" style="--d:.12s">${more(href(S, 'bridal'), 'Bridal packages &amp; prices')}${book('event', `Book event glam ${arrow}`, 'more')}</div>
</div>
${photoQ ? `<aside class="ab-photo rv" style="--d:.16s" aria-labelledby="ab-photo-q">
<p class="edge ab-photo-k">From her FAQ</p>
<h3 class="d-s ab-photo-q" id="ab-photo-q">${photoQ[0]}</h3>
<p class="ab-photo-a">&ldquo;${photoQ[1]}&rdquo;</p>
${hers()}
</aside>` : ''}
</div>`;

const motion = () => band(`${chapter({ kick: ABOUT.motion, n: '04', heading: ['Stills beside', 'film.'], split: true, lead: `Her photographs next to her reels. Each strip of film holds a place for a clip from ${SITE.handle}.` })}
<div class="ab-mo">
<div class="ab-mo-p ab-mo-p--a">
<div class="ab-mo-pr">
${print('artist-spotlight-crop', { shape: 'sq', n: '21A', tilt: -1.5, sizes: '(max-width:759px) 50vw, 26vw', stage: 480 })}
<p class="edge ab-mo-cap"><span class="ab-mo-n">&#9656; 21A</span> ${SITE.first} &middot; in the studio</p>
</div>
<div class="ab-mo-film">
${strip('f3', { n: '22A', label: 'Getting ready' })}
<p class="edge ab-mo-cap">Film 03 &middot; getting ready</p>
</div>
</div>
<div class="ab-mo-p ab-mo-p--b">
<div class="ab-mo-film">
${strip('f2', { n: '23A', label: 'Full glam' })}
<p class="edge ab-mo-cap">Film 02 &middot; full glam</p>
</div>
<div class="ab-mo-pr">
${print('glam-sculpt', { n: '24A', tilt: 1.8, sizes: '(max-width:759px) 50vw, 26vw', stage: 480 })}
<p class="edge ab-mo-cap"><span class="ab-mo-n">&#9656; 24A</span> Full glam &middot; sculpted bronze</p>
</div>
</div>
</div>`, { tone: 'room', id: 'motion', cls: 'ab-mo-b', label: ABOUT.motion });

const love = () => band(`${chapter({ kick: `${HER.links.reviewsName} &middot; ${HER.links.reviewsLine.toLowerCase()}`, n: '05', heading: ['Love Notes,', 'one tap each.'], split: true, lead: 'Her reviews live where her clients wrote them. Each rating is shown with the date it was read; one tap opens the site, in full.' })}
<div class="ab-love rv" style="--d:.1s"><span class="grain" aria-hidden="true"></span>${loveNotes()}</div>`, { tone: 'paper', id: 'love', cls: 'ab-love-b', label: HER.links.reviewsName });

export const about = () => page({
  path: 'about',
  title: 'About Amairany',
  description: `About ${SITE.name}, a licensed and insured luxury hair and makeup artist in ${SITE.areaLong}, with 13 years in makeup and 4 in hair.`,
  head: preload('artist-brushes'),
  css: ['pages-story'],
  bodyClass: 'pg-about',
  main: `${cover({
    kick: `About ${SITE.first}`,
    n: '01',
    heading: [`<span class="ab-hey">${hey}</span>`, iam],
    sub: `${SITE.name}, ${SITE.role.toLowerCase()} in ${SITE.areaLong}. ${HER.services.map((x, i) => (i ? x.toLowerCase() : x)).join(', ').replace(/, ([^,]*)$/, ' and $1')}.`,
    image: 'artist-brushes',
    frame: '01A',
    note: 'the artist',
    tilt: -2,
    cls: 'ab-cover',
  })}
${band(`${words()}\n${services()}`, { tone: 'paper', id: 'story', label: `${SITE.first}, in her own words` })}
${motion()}
${love()}
${cta({ copy: ABOUT.note, scrawl: 'I’d love to have you in my chair!' })}`,
});

