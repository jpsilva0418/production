/* /demo/amairanymua-01 — site "cocoa": the Bridal Inquiry page.

   The inquiry BESIDE the booking. A cream title card (her question as the h1, the intro, her
   booking line, and on phones a one-tap way to the event booking), then the form on a milk sheet
   in the main column with a sticky side column on wide screens: "Not a bride?" (her event booking
   page), Destination bride? (her words) and How to prepare (her two asks). On phones the form
   comes first, then those. The closing band here points back to the form rather than to this same
   page.

   The form's markup and behaviour are SHARED and are not written here: inquiryForm()
   (scripts/amairanymua-01/inquiry-core.mjs), assets/js/inquiry.js and the structure stylesheet
   assets/css/inquiry-core.css, loaded BEFORE Cocoa's skin (assets/cocoa/inquiry.css) so the skin's
   single-class rules win. The step buttons and the hand-off's actions reuse Cocoa's own .btn. */
import { page, S, kicker, h, lede, bookingChip, rateChip, section, more, quote, arrow } from './shell.mjs';
import { INQUIRY, HER, SITE, A, href, book } from '../site.mjs';
import { inquiryForm, inquiryFoot, INQUIRY_CSS } from '../inquiry-core.mjs';

const top = () => `<section class="iq-top" aria-labelledby="iqH">
<div class="wrap iq-top-in">
<div class="iq-top-h">
${bookingChip()}
${kicker(INQUIRY.label)}
${h(1, INQUIRY.heading.replace(/your day\.$/, '<em>your day.</em>'), 'd-xl', 'id="iqH"')}
</div>
<div class="iq-top-t">
${lede(INQUIRY.body)}
<p class="iq-jump">${book('event', `${INQUIRY.qHeading} Book event glam ${arrow}`, 'lnk')}</p>
<div class="iq-top-r">${rateChip('ww')}</div>
</div>
</div>
</section>`;

const side = () => `<aside class="iq-side" aria-label="Other ways to book, and how to prepare">
<section class="iq-blk iq-ev" aria-labelledby="iqEvH">
${kicker('Event &amp; everyday glam')}
<h2 class="d-m" id="iqEvH">${INQUIRY.qHeading}</h2>
<p>${INQUIRY.qBody}</p>
${book('event', `${INQUIRY.qLink} ${arrow}`, 'btn btn--out btn--block')}
</section>
<section class="iq-blk iq-dest" aria-labelledby="iqDestH">
<h2 class="d-s" id="iqDestH">${HER.destination.heading.replace('bride?', '<em>bride?</em>')}</h2>
${quote(HER.destination.body, `${SITE.first}, in her words`, 'iq-q')}
${more(href(S, 'journal/destination-bride'), 'Destination brides')}
</section>
<section class="iq-blk iq-prep" aria-labelledby="iqPrepH">
<h2 class="d-s" id="iqPrepH">How to <em>prepare</em></h2>
<ol class="iq-steps">${HER.prepare.map((p, i) => `<li><span class="iq-n num" aria-hidden="true">0${i + 1}</span><span>${p}</span></li>`).join('')}</ol>
${more(href(S, 'journal/how-to-prepare'), 'Read the article')}
</section>
</aside>`;

const spread = () => section({ id: 'inquiry', tone: 'cream', cls: 'iq', label: INQUIRY.label }, `
<div class="iq-g">
<div class="iq-main">
<div class="iq-card">
<div class="iq-card-hd"><h2 class="kick iq-card-k">${INQUIRY.cardKick}</h2><span class="iq-card-s">Four short steps</span></div>
${inquiryForm(S, { primary: 'btn btn--pri', secondary: 'btn btn--out' })}
</div>
<div class="iq-notes">
<p class="iq-note">${INQUIRY.note}</p>
<p class="iq-demo"><span class="iq-demo-dot" aria-hidden="true"></span><span>${INQUIRY.demoNote}</span></p>
</div>
</div>
${side()}
</div>`);

/* the closing band, pointed back at the form (closing() would link to this same page) */
const band = () => section({ tone: 'espresso', cls: 'close on-dark', labelledby: 'iqCloseH' }, `${bookingChip('rv')}${kicker('Two ways to book', 'rv')}${h(2, 'Secure your wedding day <em>glam.</em>', 'd-xl rv', 'id="iqCloseH"')}${lede('Weddings start with the inquiry above. Events book straight onto her calendar.', 'rv')}<div class="rv"><div class="acts"><a class="btn btn--cream" href="#inquiry">Back to your inquiry <span class="arr" aria-hidden="true">&uarr;</span></a>${book('event', 'Book event glam', 'btn btn--out-l')}</div></div>`);

export const inquiry = () => page({
  path: 'bridal-inquiry',
  title: INQUIRY.label,
  description: `Start a bridal inquiry with ${SITE.name}: your date, your morning and who is getting ready with you, in four short steps, then finish on her own form.`,
  bodyClass: 'iq-page',
  bar: false,
  css: [...INQUIRY_CSS.map((n) => `${A}/css/${n}.css`), 'inquiry'],
  foot: inquiryFoot(),
  main: top() + spread() + band(),
});
