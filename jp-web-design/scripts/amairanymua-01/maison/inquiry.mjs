/* /demo/amairanymua-01 — site "maison": the Bridal Inquiry page.

   The inquiry BESIDE the booking (the founder's ask). A compact title card (her question as the
   <h1>, the intro, the booking line, and on wide screens one small portrait like the contents
   page of a lookbook), then a silk spread: the inquiry on its white card in the main column, and
   beside it a sticky side column — "Not a bride?" (the black panel: her event booking page),
   Destination bride? (her words) and How to prepare (her two asks). On phones the form comes
   first, then those. Then her FAQ, then the red band, which here sends you back to the card
   rather than to this same page.

   The form's markup and behaviour are SHARED and are not written here: inquiryForm()
   (scripts/amairanymua-01/inquiry-core.mjs), assets/js/inquiry.js and the structure stylesheet
   assets/css/inquiry-core.css. Maison skins it in CSS alone, in assets/maison/inquiry.css (guide:
   SKINNING.md). The core stylesheet is listed BEFORE the skin so the skin's single-class rules win.
   The step buttons and the hand-off's two actions reuse Maison's own .btn classes. */
import { page, S, kicker, h, bookingLine, section, faq, more, frame, lockup, arrow } from './shell.mjs';
import { INQUIRY, HER, SITE, A, href, book, src, srcset } from '../site.mjs';
import { inquiryForm, inquiryFoot, INQUIRY_CSS } from '../inquiry-core.mjs';

/* the one portrait (wide screens only, so the form keeps the phone's first screen; lazy, so a
   phone never downloads it, and preloaded for wide screens only) */
const PH = 'bride-ruby';
const PH_SIZES = '(min-width:900px) 15vw, 1px';
const PH_MEDIA = '(min-width: 900px)';

/* her heading, set as Maison sets every page title: two lines, the second indented */
const words = INQUIRY.heading.split(' ');
const H1 = [words.slice(0, -2).join(' '), words.slice(-2).join(' ')];

const top = () => `<section class="iq-top" aria-labelledby="iqH">
<div class="wrap iq-top-in">
<div class="iq-top-h">
${kicker(INQUIRY.label, 'rv')}
${h(1, H1, 'd-xl rv-mask', 'id="iqH"')}
</div>
<div class="iq-top-t">
<p class="lede rv" style="--d:.12s">${INQUIRY.body}</p>
${bookingLine('rv iq-book')}
<p class="iq-alt-jump rv" style="--d:.18s">${book('event', `${INQUIRY.qHeading} Book event glam ${arrow}`, 'more')}</p>
</div>
${frame(PH, { shape: 'port', sizes: PH_SIZES, cls: 'iq-ph', rv: '', cap: 'Bridal &middot; Full glam' })}
</div>
</section>`;

/* the side column: three short blocks, the first a black panel */
const side = () => `<aside class="iq-side" aria-label="Other ways to book, and how to prepare">
<section class="iq-blk iq-ev tone-noir" aria-labelledby="iqEvH">
${kicker('Event &amp; everyday glam')}
<h2 class="d-m" id="iqEvH">${INQUIRY.qHeading}</h2>
<p>${INQUIRY.qBody}</p>
${book('event', `${INQUIRY.qLink} ${arrow}`, 'btn btn--pri')}
</section>
<section class="iq-blk iq-dest" aria-labelledby="iqDestH">
${kicker('Worldwide')}
<h2 class="d-s" id="iqDestH">${HER.destination.heading}</h2>
<blockquote class="iq-q"><p>${HER.destination.body}</p><cite>${SITE.first}</cite></blockquote>
${more(href(S, 'journal/destination-bride'), 'Destination brides')}
</section>
<section class="iq-blk iq-prep" aria-labelledby="iqPrepH">
${kicker('Before your appointment')}
<h2 class="d-s" id="iqPrepH">How to prepare</h2>
<ol class="iq-steps">${HER.prepare.map((p, i) => `<li><span class="iq-n" aria-hidden="true">0${i + 1}</span><span>${p}</span></li>`).join('')}</ol>
${more(href(S, 'journal/how-to-prepare'), 'Read the article')}
</section>
</aside>`;

/* the spread: the card (main column) beside the side column */
const spread = () => section({ id: 'inquiry', tone: 'silk', cls: 'iq', label: INQUIRY.label }, `
<div class="iq-g">
<div class="iq-main">
<div class="iq-card">
<div class="iq-card-hd"><h2 class="kick iq-card-k">${INQUIRY.cardKick}</h2>${lockup({ cls: 'iq-lk' })}</div>
${inquiryForm(S, { primary: 'btn btn--pri', secondary: 'btn btn--sec' })}
</div>
<div class="iq-notes">
<p class="iq-note">${INQUIRY.note}</p>
<p class="iq-demo">${INQUIRY.demoNote}</p>
</div>
</div>
${side()}
</div>`);

const questions = () => section({ tone: 'blanc', cls: 'iq-faq', labelledby: 'iqFaqH' }, `
<div class="iq-faq-g">
<div class="iq-faq-hd">${kicker('Good to know', 'rv')}${h(2, ['Before you', 'inquire.'], 'd-l rv-mask', 'id="iqFaqH"')}
<p class="lede rv" style="--d:.1s">In her words: travel, dates, extensions, trials and photography.</p></div>
${faq(HER.faq, 'rv')}
</div>`);

/* the red band, pointed back at the card (closing() would link to this same page) */
const band = () => section({ tone: 'rouge', cls: 'close', label: 'Book' }, `
${kicker('Two ways to book', 'rv')}
${h(2, ['Secure your', 'wedding day glam.'], 'd-xl rv-mask')}
<p class="lede rv" style="--d:.1s">Weddings start with an inquiry. Events book straight onto her calendar.</p>
<div class="rv" style="--d:.18s"><div class="acts acts--rouge"><a class="btn btn--pri" href="#inquiry">Back to your inquiry <span class="arr" aria-hidden="true">&uarr;</span></a>${book('event', 'Book event glam', 'btn btn--sec')}</div></div>
${bookingLine('rv')}`);

export const inquiry = () => page({
  path: 'bridal-inquiry',
  title: INQUIRY.label,
  description: `${INQUIRY.body} ${HER.booking.replace('&amp;', '&')}.`,
  bodyClass: 'iq-page',
  head: `<link rel="preload" as="image" href="${src(PH)}" imagesrcset="${srcset(PH)}" imagesizes="${PH_SIZES}" media="${PH_MEDIA}" fetchpriority="high">`,
  /* core structure first, then the skin */
  css: [...INQUIRY_CSS.map((n) => `${A}/css/${n}.css`), 'inquiry'],
  foot: inquiryFoot(),
  main: top() + spread() + questions() + band(),
});
