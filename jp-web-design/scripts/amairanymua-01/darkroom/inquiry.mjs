/* /demo/amairanymua-01 — site "darkroom": the Bridal Inquiry page.

   The inquiry BESIDE the booking (the founder's ask). A short title card in the dark room (her
   question as the <h1>, the intro, Now booking, and on wide screens one print lying on the table
   beside it), then the table itself: the inquiry as a sheet of photographic paper in the main
   column, and beside it a sticky side column: "Not a bride?" (a card clipped to the table, her
   event booking page), Destination bride? (her words, her line in grease pencil) and How to
   prepare (her two asks). On phones the sheet comes first, then those three.

   The form's markup and behaviour are SHARED and are not written here: inquiryForm()
   (scripts/amairanymua-01/inquiry-core.mjs), assets/js/inquiry.js and the structure stylesheet
   assets/css/inquiry-core.css. Darkroom skins it in CSS alone, in assets/darkroom/inquiry.css
   (guide: SKINNING.md). The core stylesheet is listed BEFORE the skin so the skin's single-class
   rules win. The step buttons and the hand-off's two actions reuse Darkroom's own .btn classes
   (the sheet is .on-paper, so the primary is the dark room on paper: never red). */
import { S, page, kick, h, note, booking, print, more, scrawlArrow, tick, edge } from './shell.mjs';
import { INQUIRY, HER, SITE, PATHS, A, href, book, arrow, src, srcset } from '../site.mjs';
import { inquiryForm, INQUIRY_CSS, INQUIRY_SCRIPTS } from '../inquiry-core.mjs';

/* the one print on the title card: wide screens only (display:none below 960px, and lazy, so a
   phone never downloads it); preloaded for wide screens, where it is above the fold */
const PH = 'bride-crystal';
const PH_SIZES = '(min-width:960px) 300px, 1px';

/* her destination line, split so its last sentence ("I’d love to have you in my chair!") is
   written in grease pencil under the rest (her words, both halves) */
const dest = HER.destination.body;
const cut = dest.lastIndexOf('. ') + 1;
const destBody = dest.slice(0, cut).trim();
const destLine = dest.slice(cut).trim();

const top = () => `<section class="band band--room band--glow iq-top" aria-labelledby="iqH">
<span class="grain" aria-hidden="true"></span>
<div class="wrap iq-top-in">
<div class="iq-top-tx">
${kick(INQUIRY.label, { n: '01', cls: 'rv' })}
${h(1, INQUIRY.heading, 'd-xl iq-h rv', 'id="iqH" style="--d:.06s"')}
<p class="lead iq-lead rv" style="--d:.14s">${INQUIRY.body}</p>
<div class="rv" style="--d:.2s">${booking('iq-nowb')}</div>
</div>
<div class="iq-top-pr" aria-hidden="true">
${print(PH, { shape: 'port', alt: '', n: '01A', note: 'the bride', tilt: 2.4, sizes: PH_SIZES, stage: 480 })}
</div>
</div>
</section>`;

/* the sheet on the table: the card kick, the shared form, a print's bottom border (frame number) */
const sheet = () => `<div class="iq-main">
<p class="iq-start" aria-hidden="true">${note('start here', { rot: -6 })}${scrawlArrow('se', 'iq-start-ar')}</p>
<div class="iq-sheet on-paper">
<div class="iq-sheet-hd">${kick(INQUIRY.cardKick, { cls: 'iq-sheet-k' })}${edge('4 steps', 'iq-sheet-e')}</div>
${inquiryForm(S, { primary: 'btn btn--main', secondary: 'btn btn--line' })}
<span class="iq-sheet-b pr-b" aria-hidden="true"><span class="pr-n">&#9656; 01A</span></span>
</div>
<div class="iq-notes">
<p class="iq-note">${INQUIRY.note}</p>
<p class="iq-demo"><span class="iq-demo-dot" aria-hidden="true"></span><span>${INQUIRY.demoNote}</span></p>
</div>
</div>`;

/* beside it: the event card clipped to the table, then her two notes */
const side = () => `<aside class="iq-side" aria-label="Other ways to book, and how to prepare">
<div class="iq-side-in">
<section class="iq-ev on-paper" aria-labelledby="iqEvH">
<span class="clip" aria-hidden="true"></span>
<p class="edge iq-ev-k">${PATHS[1].kicker}</p>
<h2 class="d-m iq-ev-h" id="iqEvH">${INQUIRY.qHeading} <span class="h-b">Book event glam.</span></h2>
<p class="iq-ev-b">${INQUIRY.qBody}</p>
${book('event', `${INQUIRY.qLink} ${arrow}`, 'btn btn--line iq-ev-btn')}
<span class="iq-ev-n" aria-hidden="true">${note('the event', { rot: -3, cls: 'gp--sm' })}<span class="pr-n">&#9656; 02A</span></span>
</section>
<section class="iq-blk iq-dest" aria-labelledby="iqDestH">
<h2 class="d-s iq-blk-h" id="iqDestH">${HER.destination.heading}</h2>
<blockquote class="iq-q">
<p>${destBody}</p>
<p class="iq-q-gp">${note(destLine, { rot: -3, say: true })}</p>
</blockquote>
<p class="edge iq-cite">${SITE.first}, in her own words</p>
${more(href(S, 'journal/destination-bride'), 'Destination brides')}
</section>
<section class="iq-blk iq-prep" aria-labelledby="iqPrepH">
<h2 class="d-s iq-blk-h" id="iqPrepH">How to prepare</h2>
<ol class="iq-steps">${HER.prepare.map((p, i) => `<li><span class="iq-n" aria-hidden="true">0${i + 1}${tick('iq-tk')}</span><span>${p}</span></li>`).join('')}</ol>
${more(href(S, 'journal/how-to-prepare'), 'How to prepare for your glam')}
</section>
</div>
</aside>`;

const table = () => `<section class="band band--tray iq-table" id="inquiry" aria-label="${INQUIRY.label}">
<span class="grain" aria-hidden="true"></span>
<div class="wrap iq-g">
${sheet()}
${side()}
</div>
</section>`;

export const inquiry = () => page({
  path: 'bridal-inquiry',
  title: 'Bridal Inquiry',
  description: `Tell ${SITE.first} about your wedding day: a short bridal inquiry, finished on her own form, beside her event booking.`,
  head: `<link rel="preload" as="image" href="${src(PH, 480)}" imagesrcset="${srcset(PH)}" imagesizes="${PH_SIZES}" media="(min-width: 960px)">`,
  css: [...INQUIRY_CSS.map((n) => `${A}/css/${n}.css`), 'inquiry'],
  js: INQUIRY_SCRIPTS.map((n) => `${A}/js/${n}.js`),
  bodyClass: 'pg-iq',
  main: `${top()}
${table()}`,
});
