/* /demo/amairanymua-01 — The Edit: the Bridal Inquiry page.

   A peach title card (the h1, her intro line and the small "Not a bride?" card that sends event
   bookings to her own booking page), then the shared four-step inquiry as the centrepiece: a white
   card that rises out of the peach onto cream, its progress drawn as story bars. Beside it on wide
   screens, one of her photographs and the two honest notes (not a booking; nothing is sent).

   The form's markup and behaviour are shared by the three sites (inquiry-core.mjs, assets/js/
   inquiry.js, assets/css/inquiry-core.css); this page only places it and skins it, in
   assets/edit/inquiry.css. The core stylesheet must load BEFORE the skin, and page() writes `css`
   links before `head`, so both stylesheets are passed through `head` here, in order. */
import { A, INQUIRY, LOOKS, book, arrow } from '../site.mjs';
import { inquiryForm, inquiryHead, inquiryFoot } from '../inquiry-core.mjs';
import { page, S, hed, kick, spark, print } from './shell.mjs';

/** The Edit's headline manner: the last two words become the Newsreader italic counter-phrase.
 *  The words are INQUIRY.heading exactly; only the styling is split. */
const split = (s) => {
  const w = s.trim().split(/\s+/);
  return w.length > 2 ? [w.slice(0, -2).join(' '), w.slice(-2).join(' ')] : [s, ''];
};

const capOf = (k) => (LOOKS.find((x) => x.photo === k) || {}).cap || '';

/* the small card for anyone who is not a bride: event bookings go straight to her booking page */
const notBride = `<aside class="iq-q" aria-labelledby="iq-q-h">
      <h2 class="hed hed--s iq-q-h" id="iq-q-h">${INQUIRY.qHeading}</h2>
      <p class="iq-q-t">${INQUIRY.qBody}</p>
      ${book('event', `${INQUIRY.qLink} ${arrow}`, 'btn btn--line btn--sm iq-q-go')}
    </aside>`;

const cover = `<section class="cover f-peach iq-cover">
  <div class="wrap iq-cover-in">
    <div class="cover-copy iq-cover-copy">
      ${kick(INQUIRY.label)}
      ${hed(split(INQUIRY.heading), { tag: 'h1', size: 'xxl', cls: 'iq-h' })}
      <p class="lede cover-sub">${INQUIRY.body}</p>
    </div>
    ${notBride}
  </div>
</section>`;

const stage = `<section class="iq-sec f-cream" aria-labelledby="iq-card-k">
  <div class="wrap iq-grid">
    <div class="iq-card">
      <p class="kick kick--peach iq-card-k" id="iq-card-k">${INQUIRY.cardKick}</p>
      ${inquiryForm(S, { primary: 'btn btn--solid', secondary: 'btn btn--line' })}
    </div>
    <div class="iq-side">
      ${print('bride-pearls', { tilt: 'r', ratio: '4/5', sizes: '(max-width:899px) 1px, 360px', cls: 'iq-print', sticker: capOf('bride-pearls') })}
      <p class="iq-note">${spark()}<span>${INQUIRY.note}</span></p>
      <p class="iq-demo"><span class="iq-demo-dot" aria-hidden="true"></span><span>${INQUIRY.demoNote}</span></p>
    </div>
  </div>
</section>`;

export const inquiry = () => page({
  path: 'bridal-inquiry',
  title: 'Bridal Inquiry',
  description: 'Start a bridal inquiry with Amairany Sierra: your date, your timeline and who is getting ready with you, then finish on her own inquiry form.',
  head: `${inquiryHead()}
<link rel="stylesheet" href="${A}/edit/inquiry.css">
${inquiryFoot()}`,
  bodyClass: 'iq',
  dock: false,
  main: `${cover}
${stage}`,
});
