/**
 * /demo/amairanymua-01 — THE SHARED BRIDAL INQUIRY: markup only, no visual design.
 *
 * The three sites (veil, noir, edit) each have a bridal-inquiry page that looks nothing like
 * the others, but all three ask the same questions and behave the same way. This module
 * writes the form's markup; assets/js/inquiry.js is its behaviour; assets/css/inquiry-core.css
 * is structure only (what must hold on an iPhone whatever the skin does). A site skins it with
 * CSS alone. The guide for that is SKINNING.md (handed to each site team).
 *
 * THE CONTRACT
 *   inquiryForm(site, classes?)   one HTML string: <div class="cf-inquiry" id="cfInquiry"> holding
 *                                 a <noscript> line with her real form, the four-step <form id="cfForm">
 *                                 (no action, no method) and the pre-rendered hand-off #cfHandoff.
 *                                 `site` is 'veil' | 'noir' | 'edit'. `classes` is optional:
 *                                 { primary, secondary } are appended to the step buttons and to the
 *                                 hand-off's link and copy button, so a site can reuse its own
 *                                 button classes instead of restating them for .cf-btn.
 *   INQUIRY_CSS                   ['inquiry-core']  -> assets/css/<name>.css, loaded BEFORE the site's own CSS
 *   INQUIRY_SCRIPTS               ['inquiry']       -> assets/js/<name>.js
 *   inquiryHead() / inquiryFoot() the <link> and <script defer> tags for those, ready to place
 *   INQUIRY_FIELDS                the questions, in the order her own form asks them
 *
 * HOOKS (all style-free; the full list with states is in SKINNING.md)
 *   wrapper  .cf-inquiry[data-view="form"|"handoff"]   .cf-noscript
 *   form     .cf-form(.ready) .cf-prog (li.done / li.now, .cf-prog-bar, .cf-prog-lbl, .cf-sr)
 *            .cf-step > legend   .cf-field(.cf-field[data-invalid])  .cf-two  .cf-lbl .cf-req .cf-opt
 *            .cf-input (every text-like input and the textarea)   .cf-check
 *            .cf-cards(.cf-cards-2|.cf-cards-3) > .cf-card > input + span   .cf-hint  .cf-err
 *            .cf-review > .cf-rev-group > .cf-rev-head (.cf-rev-title, .cf-rev-edit) + .cf-rev-list
 *            (.cf-rev-row > .cf-rev-q + .cf-rev-a) | .cf-rev-none   .cf-consent
 *            .cf-nav > .cf-btn.cf-btn--secondary#cfBack + .cf-btn.cf-btn--primary#cfNext   .cf-reset
 *   handoff  .cf-handoff > .cf-strip .cf-kick h2 .cf-handoff-body .cf-actions (.cf-go .cf-copy .cf-back)
 *            .cf-status .cf-copytext
 *   property --cf-scroll-offset (default 88px): where a step's top rests below the site's header
 *
 * The questions are her JotForm's, as listed by the founder on 2026-11-19: name, email, phone,
 * wedding date, ceremony time, getting-ready location, first look, ready-by time, package,
 * party size, inspiration, preferred contact. Only name and email are required.
 *
 * DEMO MODE IS ABSOLUTE. Nothing typed is sent anywhere: the form has no action and no method,
 * the script only moves between steps, and the last step is a plain link to her real form with
 * nothing appended to its address. scripts/amairanymua-01-check.mjs fails the build otherwise.
 *
 * Ids and field names are the script's contract: never rename them, and never render the
 * component twice on one page.
 */
import { A, SITE, SITES, INQUIRY, book, arrow, esc } from './site.mjs';

export const INQUIRY_CSS = ['inquiry-core'];
export const INQUIRY_SCRIPTS = ['inquiry'];
/** The stylesheet tag(s) for a page's <head>. Place them BEFORE the site's own stylesheet. */
export const inquiryHead = () => INQUIRY_CSS.map((n) => `<link rel="stylesheet" href="${A}/css/${n}.css">`).join('\n');
/** The script tag(s). Deferred, so they can sit in the head or at the end of the body. */
export const inquiryFoot = () => INQUIRY_SCRIPTS.map((n) => `<script src="${A}/js/${n}.js" defer></script>`).join('\n');

/* Every question: its control name, its step, the short label the review and the copied
   summary use, and how its value is shown. The ORDER is the order her own form asks them in
   (the founder's list), which is the order the copied summary follows so a bride can work
   down her form with it. `dateUnknown` is the "Date not set yet" tick beside the date. */
export const INQUIRY_FIELDS = [
  { name: 'fullName', step: 'contact', short: 'Full name' },
  { name: 'email', step: 'contact', short: 'Email' },
  { name: 'phone', step: 'contact', short: 'Phone' },
  { name: 'weddingDate', step: 'day', short: 'Wedding date', kind: 'date' },
  { name: 'dateUnknown', step: 'day', short: 'Wedding date' },
  { name: 'ceremonyTime', step: 'day', short: 'Ceremony time', kind: 'time' },
  { name: 'gettingReady', step: 'day', short: 'Getting-ready location' },
  { name: 'firstLook', step: 'day', short: 'First look' },
  { name: 'readyBy', step: 'day', short: 'Ready by', kind: 'time' },
  { name: 'package', step: 'glam', short: 'Package' },
  { name: 'makeupGuests', step: 'glam', short: 'Guests needing makeup (not counting the bride)' },
  { name: 'hairGuests', step: 'glam', short: 'Guests needing hair (not counting the bride)' },
  { name: 'inspiration', step: 'glam', short: 'Inspiration' },
  { name: 'stage', step: 'contact', short: 'Right now I’m' },
  { name: 'contactBy', step: 'contact', short: 'Preferred way to chat' },
  { name: 'questions', step: 'contact', short: 'Questions' },
  { name: 'heardFrom', step: 'contact', short: 'Heard about her on' },
];

const OPT = '<span class="cf-opt">optional</span>';
const REQ = '<span class="cf-req">required</span>';
const cx = (...c) => c.filter(Boolean).join(' ');

/** One labelled single-line control. `error` adds the message the script shows and ties to it. */
const input = ({ name, label, type = 'text', required = false, error = '', attrs = '' }) => `<div class="cf-field">
<label class="cf-lbl" for="cf-${name}">${label} ${required ? REQ : OPT}</label>
<input class="cf-input" id="cf-${name}" name="${name}" type="${type}"${required ? ' required' : ''}${error ? ` aria-describedby="cf-${name}-err"` : ''}${attrs ? ` ${attrs}` : ''}>${error ? `
<p class="cf-err" id="cf-${name}-err" hidden>${error}</p>` : ''}
</div>`;

/** One question answered by choosing a card. `options` is [value, labelHtml][]; `cols` is the layout hint. */
const cards = ({ name, label, options, cols, hint = '' }) => `<div class="cf-field" role="radiogroup" aria-labelledby="cf-${name}-label"${hint ? ` aria-describedby="cf-${name}-hint"` : ''}>
<span class="cf-lbl" id="cf-${name}-label">${label} ${OPT}</span>
<div class="cf-cards cf-cards-${cols}">
${options.map(([value, html]) => `<label class="cf-card"><input type="radio" name="${name}" value="${esc(value)}"><span>${html}</span></label>`).join('\n')}
</div>${hint ? `
<p class="cf-hint" id="cf-${name}-hint">${hint}</p>` : ''}
</div>`;
const same = (list) => list.map((v) => [v, v]);

/** What the script needs to know, written once here and read from the page: the step labels,
 *  the questions and the title of the copied summary. `<` is escaped so the block can never
 *  close its own <script>. */
const data = () => JSON.stringify({
  title: `Bridal inquiry — ${SITE.name}`,
  steps: INQUIRY.steps.map((s) => ({ key: s.key, label: s.label })),
  fields: INQUIRY_FIELDS.map((f) => [f.name, f.step, f.short, f.kind ?? '']),
}).replace(/</g, '\\u003c');

/**
 * The whole inquiry component for one page of one site.
 * @param {string} site any id in SITES (prebuilt sites included)
 * @param {{primary?: string, secondary?: string}} [classes] the site's own button classes, appended
 * @returns {string} HTML
 */
export const inquiryForm = (site, { primary = '', secondary = '' } = {}) => {
  if (!SITES[site]) throw new Error(`inquiryForm: unknown site "${site}"`);
  const [day, glam, contact, review] = INQUIRY.steps;
  const h = INQUIRY.handoff;
  return `<div class="cf-inquiry" id="cfInquiry" data-site="${site}" data-view="form">
<noscript><style>.cf-inquiry .cf-form{display:none}</style><p class="cf-noscript">This form needs JavaScript. ${book('bridal-form', h.go)}</p></noscript>
<script type="application/json" id="cfData">${data()}</script>
<form id="cfForm" class="cf-form" novalidate>
<ol class="cf-prog" id="cfProg" aria-label="Progress"></ol>

<fieldset class="cf-step" data-step="${day.key}">
<legend tabindex="-1">${day.legend}</legend>
<div class="cf-two">
<div class="cf-field">
<label class="cf-lbl" for="cf-weddingDate">Wedding date ${OPT}</label>
<input class="cf-input" id="cf-weddingDate" name="weddingDate" type="date">
<label class="cf-check"><input type="checkbox" name="dateUnknown" value="Not set yet"><span>Date not set yet</span></label>
</div>
${input({ name: 'ceremonyTime', label: 'Ceremony time', type: 'time' })}
</div>
${input({ name: 'gettingReady', label: 'Getting-ready location', attrs: 'maxlength="160" placeholder="Venue, hotel or address" autocomplete="off" enterkeyhint="next"' })}
${cards({ name: 'firstLook', label: 'Do you plan on doing a first look?', options: same(INQUIRY.firstLook), cols: 2 })}
${input({ name: 'readyBy', label: 'What time do you need to be ready by?', type: 'time' })}
</fieldset>

<fieldset class="cf-step" data-step="${glam.key}" hidden>
<legend tabindex="-1">${glam.legend}</legend>
${cards({ name: 'package', label: 'Package you are interested in', options: same(INQUIRY.packages), cols: 2, hint: `Packages and what they include are on ${book('schedule', 'her booking page')}.` })}
<div class="cf-two">
${input({ name: 'makeupGuests', label: 'How many guests need makeup? (not counting you)', type: 'number', attrs: 'min="0" max="40" step="1" inputmode="numeric" enterkeyhint="next"' })}
${input({ name: 'hairGuests', label: 'How many guests need hair? (not counting you)', type: 'number', attrs: 'min="0" max="40" step="1" inputmode="numeric" enterkeyhint="next"' })}
</div>
<div class="cf-field">
<label class="cf-lbl" for="cf-inspiration">Inspiration ${OPT}</label>
<textarea class="cf-input" id="cf-inspiration" name="inspiration" rows="4" maxlength="1500" placeholder="The hair and makeup you are obsessing over, or links to photos you love"></textarea>
<p class="cf-hint">Photos of the looks you love (and of your hair) are added on her own form at the last step.</p>
</div>
</fieldset>

<fieldset class="cf-step" data-step="${contact.key}" hidden>
<legend tabindex="-1">${contact.legend}</legend>
${input({ name: 'fullName', label: 'Full name', required: true, error: 'Please enter your name.', attrs: 'maxlength="120" autocomplete="name" autocapitalize="words" enterkeyhint="next"' })}
<div class="cf-two">
${input({ name: 'email', label: 'Email', type: 'email', required: true, error: 'Please enter your email address, like name@example.com.', attrs: 'maxlength="160" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" enterkeyhint="next"' })}
${input({ name: 'phone', label: 'Phone', type: 'tel', error: 'That phone number does not look complete.', attrs: 'maxlength="40" autocomplete="tel" inputmode="tel" enterkeyhint="next"' })}
</div>
${cards({ name: 'stage', label: 'Right now I’m', options: same(INQUIRY.stage), cols: 2 })}
${cards({ name: 'contactBy', label: 'My preferred way to chat', options: same(INQUIRY.contactBy), cols: 3 })}
<div class="cf-field">
<label class="cf-lbl" for="cf-questions">Any questions for ${SITE.first}? ${OPT}</label>
<textarea class="cf-input" id="cf-questions" name="questions" rows="3" maxlength="1500"></textarea>
</div>
${cards({ name: 'heardFrom', label: 'How did you hear about her?', options: same(INQUIRY.heardFrom), cols: 2 })}
</fieldset>

<fieldset class="cf-step" data-step="${review.key}" hidden>
<legend tabindex="-1">${review.legend}</legend>
<div id="cfReview" class="cf-review"></div>
<p class="cf-consent">${INQUIRY.consent}</p>
</fieldset>

<div class="cf-nav">
<button type="button" id="cfBack" class="${cx('cf-btn cf-btn--secondary', secondary)}" hidden>Back</button>
<button type="submit" id="cfNext" class="${cx('cf-btn cf-btn--primary', primary)}">Continue</button>
</div>
<button type="button" id="cfReset" class="cf-reset" hidden>Start over</button>
</form>

<div class="cf-handoff" id="cfHandoff" hidden>
<p class="cf-strip">${h.strip}</p>
<span class="cf-kick">${h.kick}</span>
<h2 tabindex="-1" id="cfHandoffHead">${h.heading}</h2>
<p class="cf-handoff-body">${h.body}</p>
<div class="cf-actions">
${book('bridal-form', `${h.go} ${arrow}`, cx('cf-go', primary))}
<button type="button" id="cfCopy" class="${cx('cf-copy', secondary)}">${h.copy}</button>
<button type="button" id="cfBackToAnswers" class="cf-back">${h.back}</button>
</div>
<p id="cfCopyStatus" class="cf-status" role="status" aria-live="polite"></p>
<textarea id="cfCopyText" class="cf-copytext" rows="10" readonly aria-label="Your answers, ready to copy" hidden></textarea>
</div>
</div>`;
};
