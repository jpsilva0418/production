/* /demo/amairanymua-01 — site "veil": the Bridal Inquiry page.

   The title card (her label, the page's h1, the line under it, and a quiet "Not a bride?" aside
   that sends event bookings to her own booking page), then the inquiry itself as the
   centrepiece: one matted card on a satin band, the shared four-step form inside it, and the
   two notes under it (not a booking; nothing leaves this browser). On wide screens one of her
   bridal portraits stands beside the card and stays in view while the bride fills it in (it is
   only displayed from 1200px, so it carries no reveal: a hidden element can never be revealed).

   The form's markup and behaviour are shared by the three sites (../inquiry-core.mjs,
   assets/js/inquiry.js, assets/css/inquiry-core.css); this page only places it and the skin
   (assets/veil/inquiry.css) dresses it. Step buttons reuse the kit's .btn / .btn--line. */
import { page, cover, frame, pearl } from './shell.mjs';
import { inquiryForm, INQUIRY_CSS, INQUIRY_SCRIPTS } from '../inquiry-core.mjs';
import { A, SITE, INQUIRY, book, arrow } from '../site.mjs';

/* "Tell her about your day." set as the kit's display pair: the last two words in italic foil */
const words = INQUIRY.heading.split(' ');
const H1 = [words.slice(0, -2).join(' '), words.slice(-2).join(' ')];

const notBride = () => `<aside class="iq-alt" aria-labelledby="iq-alt-h">
  <h2 class="iq-alt-h" id="iq-alt-h">${INQUIRY.qHeading}</h2>
  <p class="iq-alt-p">${INQUIRY.qBody}</p>
  ${book('event', `${INQUIRY.qLink} ${arrow}`, 'lnk iq-alt-a')}
</aside>`;

const card = () => `<section class="iq" id="inquiry" aria-labelledby="iq-kick">
  <div class="wrap iq-grid">
    <div class="iq-side" aria-hidden="true">
      ${frame('bride-gold-waves', { cap: true, ar: '3/4', sizes: '(min-width:1440px) 380px, 26vw', alt: '', cls: 'iq-fig' }).replace(' rv-im"', '"')}
    </div>
    <div class="iq-col">
      <div class="iq-card">
        <div class="iq-card-in">
          <div class="iq-card-head">
            ${pearl('iq-clasp')}
            <p class="kick iq-kick" id="iq-kick">${INQUIRY.cardKick}</p>
          </div>
          ${inquiryForm('veil', { primary: 'btn', secondary: 'btn btn--line' })}
        </div>
      </div>
      <div class="iq-notes">
        <p class="iq-note">${INQUIRY.note}</p>
        <p class="iq-demo">${INQUIRY.demoNote}</p>
      </div>
    </div>
  </div>
</section>`;

export const inquiry = () => page({
  path: 'bridal-inquiry',
  title: 'Bridal Inquiry',
  description: `Start a bridal inquiry with ${SITE.name}: your date, your timeline and who is getting ready with you.`,
  bodyClass: 'no-bar is-inquiry',
  css: [...INQUIRY_CSS.map((n) => `${A}/css/${n}.css`), 'inquiry'],
  js: INQUIRY_SCRIPTS.map((n) => `${A}/js/${n}.js`),
  main: `${cover({ kick: INQUIRY.label, heading: H1, sub: INQUIRY.body, actions: notBride() })}
${card()}`,
});
