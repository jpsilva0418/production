/* /demo/amairanymua-01 — site "noir": the Bridal Inquiry page.

   A title card (kicker, her question as the <h1>, the intro, and the small "Not a bride?" way
   out to her event booking page) with one of her dark-ground bridal portraits dissolving into
   the black behind it, then the shared inquiry as the centrepiece, then the two notes, then
   the end card every Noir page closes on (her line; back to the inquiry, or the event page).
   On phones the "Not a bride?" aside is left to the end card, so the inquiry's first step
   reaches the first screen.

   The form's markup and behaviour are SHARED by the three sites and are not written here:
   inquiryForm() (scripts/amairanymua-01/inquiry-core.mjs), assets/js/inquiry.js and the
   structure stylesheet assets/css/inquiry-core.css. Noir skins it in CSS alone, in
   assets/noir/inquiry.css (guide: SKINNING.md). The core stylesheet is linked BEFORE the skin so
   the skin's single-class rules win; both are placed in `head` (after site.css) for that order.
   The step buttons and the hand-off's two actions reuse Noir's own button classes. */
import { page, S, kick, cta } from './shell.mjs';
import { INQUIRY, FINAL, A, book, pic, src, srcset, arrow } from '../site.mjs';
import { inquiryForm, inquiryHead, inquiryFoot } from '../inquiry-core.mjs';

/* bride-gold-waves: shot on a grey backdrop, so it dissolves into the black without grading */
const PH = 'bride-gold-waves';
const PH_SIZES = '(min-width:900px) 50vw, 84vw';
/* her heading, set Noir's way: the last two words in italic champagne ("Tell her about" / "your day.") */
const words = INQUIRY.heading.split(' ');
const H = [words.slice(0, -2).join(' '), words.slice(-2).join(' ')];

export const inquiry = () => page({
  path: 'bridal-inquiry',
  title: INQUIRY.label,
  description: INQUIRY.body,
  bodyClass: 'iq-page',
  head: `<link rel="preload" as="image" href="${src(PH, 800)}" imagesrcset="${srcset(PH)}" imagesizes="${PH_SIZES}" fetchpriority="high">
${inquiryHead()}
<link rel="stylesheet" href="${A}/noir/inquiry.css">
${inquiryFoot()}`,
  main: `<section class="iq-top" aria-labelledby="iqH">
<div class="iq-ph">${pic(PH, { sizes: PH_SIZES, eager: true })}</div>
<div class="wrap iq-top-in">
${kick(INQUIRY.label, 'rv')}
<h1 class="d-xl iq-h rv-mask" id="iqH">${H[0]} <em>${H[1]}</em></h1>
<p class="lead iq-lead rv" style="--d:.12s">${INQUIRY.body}</p>
<aside class="iq-alt rv" style="--d:.2s" aria-labelledby="iqAltH">
<h2 class="iq-alt-h" id="iqAltH">${INQUIRY.qHeading}</h2>
<p class="iq-alt-p">${INQUIRY.qBody}</p>
<p class="iq-alt-a">${book('event', `${INQUIRY.qLink} ${arrow}`, 'lnk')}</p>
</aside>
</div>
</section>
<section class="iq" id="inquiry" aria-labelledby="iqCardH">
<div class="wrap">
<div class="iq-card">
<h2 class="slate slate--champ kick iq-kick" id="iqCardH">${INQUIRY.cardKick}</h2>
${inquiryForm(S, { primary: 'btn btn--solid', secondary: 'btn btn--line' })}
<div class="iq-notes">
<p class="iq-note">${INQUIRY.note}</p>
<p class="iq-demo">${INQUIRY.demoNote}</p>
</div>
</div>
</div>
</section>
${cta({
  kick: 'Ready when you are',
  heading: FINAL.heading,
  copy: `${INQUIRY.qHeading} ${INQUIRY.qBody}`,
  actions: `<div class="acts"><a class="btn btn--solid" href="#inquiry">Back to your inquiry <span class="arr" aria-hidden="true">&uarr;</span></a>${book('event', INQUIRY.qLink, 'btn btn--line')}</div>`,
})}`,
});
