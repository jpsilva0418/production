/* /demo/amairanymua-01 — site "blush": the Bridal Inquiry page.

   The inquiry BESIDE the booking (the founder's ask), in Blush's manner: a short title card (her
   inquiry's own heading as the <h1>, the intro, the booking chip, and on wide screens her seal
   turning slowly where an interior page would put its portrait), then the spread: the four-step
   inquiry on a white card in the main column, and a sticky side column — "Not a bride?" (a blush
   card to her event booking page), Destination bride? (her own words) and How to prepare (her two
   asks). On phones the form comes first, then those three.

   The form's markup and behaviour are SHARED and are not written here: inquiryForm()
   (scripts/amairanymua-01/inquiry-core.mjs), assets/js/inquiry.js and the structure stylesheet
   assets/css/inquiry-core.css, which on this site loads BEFORE site.css (page()'s preHead), so
   the kit and this page's skin (assets/blush/inquiry.css) both win over it. The step buttons and
   the hand-off's two actions reuse the kit's .btn classes. The home page's "Tell her about your
   day" card hands a wedding date to this form through the inquiry's own saved state
   (sessionStorage 'am01-bridal-inquiry-v1'); nothing here reads, renames or clears it. No floating
   pill on this page: the form is the page. */
import { page, S, kicker, mix, lede, bookingLine, section, seal, more, quote, arrow } from './shell.mjs';
import { INQUIRY, HER, SITE, href, book } from '../site.mjs';
import { inquiryForm, inquiryHead, inquiryFoot } from '../inquiry-core.mjs';

const top = () => `<section class="iq-top" aria-labelledby="iqH">
<div class="wrap iq-top-in">
<div class="iq-top-t">
${kicker(INQUIRY.label, 'rv')}
<h1 class="d-xl rv" id="iqH">${mix(INQUIRY.heading.replace('your day.', '*your day.*'))}</h1>
${lede(INQUIRY.body, 'rv')}
${bookingLine('rv')}
<p class="iq-alt"><span class="iq-alt-l">${INQUIRY.qHeading}</span>${book('event', `Book event glam ${arrow}`, 'more')}</p>
</div>
${seal({ cls: 'iq-seal seal--spin' })}
</div>
</section>`;

const side = () => `<aside class="iq-side" aria-label="Other ways to book, and how to prepare">
<section class="iq-blk iq-ev" aria-labelledby="iqEvH">
${kicker('Event &amp; everyday glam')}
<h2 class="d-m" id="iqEvH">${mix(INQUIRY.qHeading.replace('bride?', '*bride?*'))}</h2>
<p>${INQUIRY.qBody}</p>
${book('event', `${INQUIRY.qLink} ${arrow}`, 'btn btn--sec')}
</section>
<section class="iq-blk iq-dest" aria-labelledby="iqDestH">
<h2 class="d-s" id="iqDestH">${mix(HER.destination.heading.replace('bride?', '*bride?*'))}</h2>
${quote(HER.destination.body, SITE.first, 'iq-q')}
${more(href(S, 'journal/destination-bride'), 'Destination brides')}
</section>
<section class="iq-blk iq-prep" aria-labelledby="iqPrepH">
<h2 class="d-s" id="iqPrepH">${mix('How to *prepare*')}</h2>
<ol class="iq-steps">${HER.prepare.map((p, i) => `<li><span class="iq-n" aria-hidden="true">0${i + 1}</span><span>${p}</span></li>`).join('')}</ol>
${more(href(S, 'journal/how-to-prepare'), 'Read the article')}
</section>
</aside>`;

const spread = () => section({ id: 'inquiry', tone: 'cream', cls: 'iq', label: INQUIRY.label }, `
<div class="iq-g">
<div class="iq-main">
<div class="iq-card">
<div class="iq-card-hd"><h2 class="kick iq-card-k">${INQUIRY.cardKick}</h2>${seal({ cls: 'iq-card-seal' })}</div>
${inquiryForm(S, { primary: 'btn btn--pri', secondary: 'btn btn--sec' })}
</div>
<div class="iq-notes">
<p class="iq-note">${INQUIRY.note}</p>
<p class="iq-demo"><i aria-hidden="true"></i><span>${INQUIRY.demoNote}</span></p>
</div>
</div>
${side()}
</div>`);

export const inquiry = () => page({
  path: 'bridal-inquiry',
  title: INQUIRY.label,
  description: `Start ${SITE.name}’s bridal inquiry with your wedding date, your timeline and who is getting ready with you, then finish on her own form.`,
  preHead: inquiryHead(),
  css: ['inquiry'],
  foot: inquiryFoot(),
  bodyClass: 'iq-page',
  main: top() + spread(),
});
