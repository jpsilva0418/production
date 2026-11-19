/* /demo/amairanymua-01 — site "atelier": the Bridal Inquiry page.

   The inquiry BESIDE the booking (the founder's ask). A compact ivory title (INQUIRY.label, the
   page's h1, the intro, the booking line), then a linen spread: the inquiry on a white sheet in the
   main column, and beside it a sticky side column — "Not a bride?" (her event booking page, on a
   small espresso panel), Destination bride? (her words) and How to prepare (her two asks). On
   phones the sheet comes first, then those three.

   The form's markup and behaviour are SHARED and are not written here: inquiryForm()
   (scripts/amairanymua-01/inquiry-core.mjs), assets/js/inquiry.js and the structure stylesheet
   assets/css/inquiry-core.css. Atelier skins it in CSS alone, in assets/atelier/inquiry.css (guide:
   SKINNING.md). The core stylesheet is listed BEFORE the skin so the skin's single-class rules win;
   the step buttons and the hand-off's two actions reuse Atelier's own .btn classes. The shell's
   footer closes the page with both ways to book, as on every page. */
import { page, S, kicker, h, lede, bookingLine, more, lockup, arrow } from './shell.mjs';
import { INQUIRY, HER, SITE, A, href, book } from '../site.mjs';
import { inquiryForm, inquiryFoot, INQUIRY_CSS } from '../inquiry-core.mjs';

/* her heading as two lines of the tall caps: "Tell her about" / "your day." */
const words = INQUIRY.heading.split(' ');
const H1 = [words.slice(0, -2).join(' '), words.slice(-2).join(' ')];

const top = () => `<section class="iq-top" aria-labelledby="iqH">
<div class="wrap iq-top-in">
<div class="iq-top-h">
${kicker(INQUIRY.label, 'rv')}
${h(1, H1, 'd-xl rv-mask', 'id="iqH"')}
</div>
<div class="iq-top-t">
${lede(INQUIRY.body, 'rv')}
${bookingLine('rv iq-book')}
<p class="iq-alt rv">${book('event', `${INQUIRY.qHeading} Book event glam ${arrow}`, 'more')}</p>
</div>
</div>
</section>`;

/* the side column: three short blocks; the first a small espresso panel (the page has no band) */
const side = () => `<aside class="iq-side" aria-label="Other ways to book, and how to prepare">
<section class="iq-blk iq-ev" aria-labelledby="iqEvH">
<p class="kick">Event &amp; everyday glam</p>
<h2 class="d-m" id="iqEvH">${INQUIRY.qHeading}</h2>
<p class="iq-ev-b">${INQUIRY.qBody}</p>
<div class="acts acts--dark">${book('event', `<span>${INQUIRY.qLink}</span>`, 'btn btn--pri')}</div>
</section>
<section class="iq-blk iq-dest" aria-labelledby="iqDestH">
<h2 class="d-s" id="iqDestH">${HER.destination.heading}</h2>
<blockquote class="iq-q"><p>&ldquo;${HER.destination.body}&rdquo;</p><cite>${SITE.first}, in her words</cite></blockquote>
${more(href(S, 'journal/destination-bride'), 'Destination brides')}
</section>
<section class="iq-blk iq-prep" aria-labelledby="iqPrepH">
<h2 class="d-s" id="iqPrepH">How to prepare</h2>
<ol class="iq-steps">${HER.prepare.map((p, i) => `<li><span class="iq-n" aria-hidden="true">0${i + 1}</span><span>&ldquo;${p}&rdquo;</span></li>`).join('')}</ol>
${more(href(S, 'journal/how-to-prepare'), 'Read the article')}
</section>
</aside>`;

/* the spread: the white sheet (main column) beside the side column */
const spread = () => `<section class="sec sec--linen iq" id="inquiry" aria-label="${INQUIRY.label}">
<div class="wrap iq-g">
<div class="iq-main">
<div class="iq-sheet">
<div class="iq-sheet-hd"><h2 class="kick iq-sheet-k">${INQUIRY.cardKick}</h2>${lockup({ cls: 'iq-lk' })}</div>
${inquiryForm(S, { primary: 'btn btn--pri', secondary: 'btn btn--sec' })}
</div>
<div class="iq-notes">
<p class="iq-note">${INQUIRY.note}</p>
<p class="iq-demo">${INQUIRY.demoNote}</p>
</div>
</div>
${side()}
</div>
</section>`;

export const inquiry = () => page({
  path: 'bridal-inquiry',
  title: INQUIRY.label,
  description: `Start a bridal inquiry with ${SITE.name}: your wedding date, your timeline and who is getting ready with you, ${HER.booking.replace('&amp;', '&').replace(/^N/, 'n')}.`,
  bodyClass: 'iq-page',
  /* core structure first, then the skin */
  css: [...INQUIRY_CSS.map((n) => `${A}/css/${n}.css`), 'inquiry'],
  foot: inquiryFoot(),
  main: top() + spread(),
});
