/* INQUIRE — the only form on the site. A title card, then the form as four numbered chapters (a real sequence) plus an
   optional reel; contact and "what happens next" on the side. Works without JavaScript (the form opens an email to JP);
   with JavaScript it posts to /api/inquire (web) or the artifact database (private preview). */
import { layout } from './layout.mjs';
import { esc, slate } from './partials.mjs';

const field = ({ id, label, req, type = 'text', hint, attrs = '', tag = 'input', after = '' }) => {
  const desc = [hint ? `${id}-hint` : '', `${id}-err`].filter(Boolean).join(' ');
  const control = tag === 'textarea'
    ? `<textarea id="${id}" name="${id}" ${attrs} aria-describedby="${desc}"${req ? ' required aria-required="true"' : ''}></textarea>`
    : `<input id="${id}" name="${id}" type="${type}" ${attrs} aria-describedby="${desc}"${req ? ' required aria-required="true"' : ''}>`;
  return `<div class="fld" data-field="${id}">
          <label class="fld-l" for="${id}">${label}${req ? '<b aria-hidden="true">*</b>' : '<em>Optional</em>'}</label>
          ${control}${after}
          ${hint ? `<p class="fld-hint" id="${id}-hint">${hint}</p>` : ''}
          <p class="fld-err" id="${id}-err" hidden></p>
        </div>`;
};

const options = (name, legend, list, { req = true, cls = '', hint = '' } = {}) => `<fieldset class="opts ${cls}" data-field="${name}" id="${name}-set" aria-describedby="${hint ? `${name}-hint ` : ''}${name}-err"${req ? ' aria-required="true"' : ''}>
          <legend class="fld-l">${legend}${req ? '<b aria-hidden="true">*</b>' : '<em>Optional</em>'}</legend>
          ${hint ? `<p class="fld-hint" id="${name}-hint">${hint}</p>` : ''}
          <div class="opt-list">
            ${list.map((t, i) => `<label class="opt"><input type="radio" name="${name}" id="${name}-${i}" value="${esc(t)}"${req && i === 0 ? ' required' : ''}><i class="opt-m" aria-hidden="true"></i><span class="opt-t">${esc(t)}</span><span class="opt-s" aria-hidden="true">Selected</span></label>`).join('\n            ')}
          </div>
          <p class="fld-err" id="${name}-err" hidden></p>
        </fieldset>`;

const select = (id, label, list) => `<div class="fld fld-sel" data-field="${id}">
          <label class="fld-l" for="${id}">${label}<em>Optional</em></label>
          <select id="${id}" name="${id}" aria-describedby="${id}-err"><option value="">Choose</option>${list.map(t => `<option>${esc(t)}</option>`).join('')}</select>
          <p class="fld-err" id="${id}-err" hidden></p>
        </div>`;

const chapter = (n, title, note, inner, extra = '') => `<section class="ch" id="ch-${n}" aria-labelledby="ch-${n}-h"${extra}>
        <header class="ch-head">
          <h2 id="ch-${n}-h"><span class="ch-n" aria-hidden="true">${n}</span><span class="vh">Chapter ${Number(n)}: </span>${title}</h2>
          <p class="mono">${note}</p>
        </header>
        <div class="ch-body">
        ${inner}
        </div>
      </section>`;

export function renderInquire(ctx) {
  const s = ctx.site, I = s.inquiry;
  const ig = s.socials.find(x => x.id === 'instagram'), yt = s.socials.find(x => x.id === 'youtube');
  const next = `<ol class="inq-next">${I.next.map(t => `<li>${esc(t)}</li>`).join('')}</ol>`;
  const direct = `<dl class="cc-rows inq-direct">
          <div><dt>Email</dt><i aria-hidden="true"></i><dd><a href="mailto:${s.email}">${esc(s.email)}</a></dd></div>
          <div><dt>Instagram</dt><i aria-hidden="true"></i><dd><a href="${ig.url}" rel="noopener" target="_blank">${esc(ig.handle)}<span class="vh"> (opens Instagram)</span></a></dd></div>
          <div><dt>YouTube</dt><i aria-hidden="true"></i><dd><a href="${yt.url}" rel="noopener" target="_blank">${esc(yt.handle)}<span class="vh"> (opens YouTube)</span></a></dd></div>
        </dl>`;

  const form = `<form class="inq-form" id="inq-form" action="mailto:${s.email}?subject=${encodeURIComponent('New project inquiry')}" method="post" enctype="text/plain" aria-labelledby="page-h" data-transport="${ctx.inquiryTransport}">
    <div class="inq-summary" id="inq-summary" tabindex="-1" hidden>
      <h2 class="inq-summary-h" id="inq-summary-h">Check <span data-count>these</span> before sending</h2>
      <ul></ul>
    </div>
    <fieldset class="inq-all" id="inq-all">
      <legend class="vh">New project inquiry</legend>
      <p class="inq-req mono"><i aria-hidden="true"></i>Fields marked <b>*</b> are required</p>
      ${chapter('01', 'Contact', 'Who JP is replying to', `
        ${field({ id: 'name', label: 'Name', req: true, attrs: 'autocomplete="name" maxlength="120" enterkeyhint="next" autocapitalize="words" spellcheck="false"' })}
        ${field({ id: 'email', label: 'Email', req: true, type: 'email', attrs: 'autocomplete="email" inputmode="email" maxlength="254" enterkeyhint="next" autocapitalize="off" spellcheck="false"' })}
        ${field({ id: 'phone', label: 'Phone', type: 'tel', hint: 'Only if you would rather talk.', attrs: 'autocomplete="tel" inputmode="tel" maxlength="40" enterkeyhint="next"' })}`)}
      ${chapter('02', 'Project', 'What are we making', options('type', 'What are you looking for?', I.types, { cls: 'opts-type' }))}
      <div class="inq-later" id="inq-later">
        <div class="inq-later-in">
      ${chapter('03', 'Details', 'When, where, what', `
        <div class="fld-pair">
        ${field({ id: 'timeline', label: 'Desired date or timeline', hint: 'A date, a month, or “flexible”.', attrs: 'maxlength="200" enterkeyhint="next" autocomplete="off"' })}
        ${field({ id: 'date', label: 'Pick a date', type: 'date', attrs: 'enterkeyhint="next"' })}
        </div>
        ${field({ id: 'location', label: 'Location', hint: 'City, venue, or “not decided”.', attrs: 'maxlength="200" enterkeyhint="next" autocomplete="off"' })}
        ${field({ id: 'message', label: 'Tell JP about the project', req: true, tag: 'textarea', hint: 'The idea, the artist or brand, what it is for. 20 to 4,000 characters.', attrs: 'rows="7" minlength="20" maxlength="4000" enterkeyhint="enter" autocapitalize="sentences"', after: '<p class="fld-count" aria-hidden="true"><span id="message-count">0</span> / 4000</p>' })}`)}
      ${chapter('04', 'Budget', 'A range is enough', options('budget', 'Budget', I.budgets, { cls: 'opts-budget', hint: 'It shapes the plan, not the reply. “Not sure yet” is a real answer.' }))}
      <details class="inq-more" id="inq-more">
        <summary><span class="im-t">Add references and details</span><span class="im-o mono">Optional</span><i aria-hidden="true"></i></summary>
        <div class="inq-more-in">
          ${field({ id: 'reference', label: 'Reference or inspiration link', type: 'url', hint: 'A video, a moodboard, a song.', attrs: 'inputmode="url" autocomplete="off" maxlength="300" enterkeyhint="next" autocapitalize="off" spellcheck="false" placeholder="https://"' })}
          ${field({ id: 'social', label: 'Your social or website', type: 'url', attrs: 'inputmode="url" autocomplete="url" maxlength="300" enterkeyhint="next" autocapitalize="off" spellcheck="false" placeholder="https://"' })}
          <div class="fld-pair">
          ${select('contactMethod', 'Preferred contact', I.contactMethods)}
          ${select('heardFrom', 'How did you hear about JP?', I.heardFrom)}
          </div>
        </div>
      </details>
      <div class="hp" aria-hidden="true">
        <label for="company">Company (leave empty)</label>
        <input id="company" name="company" type="text" tabindex="-1" autocomplete="off">
      </div>
      <div class="inq-send">
        <button type="submit" class="btn-send" id="inq-submit"><span class="bs-t">Send inquiry</span><i aria-hidden="true"></i></button>
        <p class="mono inq-send-note">Goes straight to JP · Reply by email</p>
      </div>
      <noscript><p class="inq-nojs mono"><i></i>Without JavaScript, sending opens your email app with the inquiry addressed to ${esc(s.email)}.</p></noscript>
        </div>
      </div>
    </fieldset>
    <div class="inq-alert" id="inq-error" tabindex="-1" hidden>
      <p class="mono ia-k"><i aria-hidden="true"></i>Not sent</p>
      <h2 class="ia-h">It didn’t go through.</h2>
      <p class="ia-why" id="inq-error-why"></p>
      <p class="ia-keep">Everything you wrote is still here.</p>
      <div class="ia-act">
        <button type="button" class="btn-send btn-retry" id="inq-retry"><span class="bs-t">Try again</span><i aria-hidden="true"></i></button>
        <a class="leader-link" id="inq-mail" href="mailto:${s.email}">Email JP instead<i aria-hidden="true"></i></a>
      </div>
      <div class="ia-copy">
        <label class="fld-l" for="inq-error-text">Your inquiry, ready to paste into an email to ${esc(s.email)}</label>
        <textarea id="inq-error-text" readonly rows="7"></textarea>
        <button type="button" class="btn-copy" data-copy="#inq-error-text">Copy inquiry</button>
        <p class="ia-copied mono" role="status" aria-live="polite"></p>
      </div>
    </div>
    <p class="vh" id="inq-status" role="status" aria-live="polite"></p>
  </form>`;

  /* end card + preview fallback: rendered here (facts from the data), filled by inquire.js */
  const end = `<template id="inq-end-t">
    <section class="inq-end" id="inq-end" tabindex="-1" aria-labelledby="inq-end-h">
      <p class="mono ie-k"><span><i aria-hidden="true"></i>Received</span><span data-tc>00:00:00:00</span></p>
      <h2 class="ie-h" id="inq-end-h">Your project is in.</h2>
      <dl class="cc-rows ie-ref"><div><dt>Reference</dt><i aria-hidden="true"></i><dd data-id></dd></div></dl>
      <h3 class="ie-sub mono">What happens next</h3>
      ${next}
      <h3 class="ie-sub mono">What you sent</h3>
      <dl class="ie-sum" data-sum></dl>
      <nav class="ie-links" aria-label="Continue">
        <a class="leader-link" href="${ctx.href('')}">Home<i aria-hidden="true"></i></a>
        <a class="leader-link" href="${ctx.href('work')}">Work<i aria-hidden="true"></i></a>
      </nav>
    </section>
  </template>
  <template id="inq-off-t">
    <section class="inq-end inq-off" id="inq-off" tabindex="-1" aria-labelledby="inq-off-h">
      <p class="mono ie-k"><span><i aria-hidden="true"></i>Not sent</span><span>Preview</span></p>
      <h2 class="ie-h" id="inq-off-h">Online inquiries open when the site goes live.</h2>
      <p class="ie-p">Email JP instead: <a href="mailto:${s.email}" data-mail>${esc(s.email)}</a>. Your inquiry is written out below, ready to paste.</p>
      <div class="ia-copy">
        <label class="fld-l" for="inq-off-text">Your inquiry</label>
        <textarea id="inq-off-text" readonly rows="9"></textarea>
        <button type="button" class="btn-copy" data-copy="#inq-off-text">Copy inquiry</button>
        <p class="ia-copied mono" role="status" aria-live="polite"></p>
      </div>
      <nav class="ie-links" aria-label="Continue">
        <button type="button" class="leader-link" data-back>Back to the form<i aria-hidden="true"></i></button>
        <a class="leader-link" href="${ctx.href('work')}">Work<i aria-hidden="true"></i></a>
      </nav>
    </section>
  </template>`;

  const body = `${slate(ctx, { reel: 'Reel 05 · New project · Austin, Texas', right: '00:04', title: 'Inquire', sub: 'Tell JP what you’re making. It takes about two minutes.' })}
  <div class="inq">
    <div class="inq-main" id="inq-main">
  ${form}
  ${end}
    </div>
    <aside class="inq-side" aria-label="Direct contact and what happens next">
      <section class="is-block" aria-labelledby="direct-h">
        <h2 class="is-h mono" id="direct-h">Direct</h2>
        ${direct}
      </section>
      <section class="is-block is-next" aria-labelledby="next-h">
        <h2 class="is-h mono" id="next-h">What happens next</h2>
        ${next}
      </section>
      <p class="cc-note mono is-based"><i aria-hidden="true"></i>Based in ${esc(s.location.city)}, ${esc(s.location.region)}</p>
    </aside>
  </div>`;

  return layout(ctx, {
    id: 'inquire', route: 'inquire', title: 'Inquire',
    description: `Start a project with ${s.person}: music videos, film, brand content and photography from Austin, Texas. Tell JP what you are making, when and where.`,
    body,
    css: ['assets/css/inquire.css'],
    js: ['assets/js/inquire.js'],
    jsonld: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: `Inquire · ${s.brand}`, url: ctx.abs('inquire'),
      about: { '@type': 'Organization', name: s.brand, email: s.email, url: s.url + '/', sameAs: s.socials.map(x => x.url) } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: ctx.abs('') }, { '@type': 'ListItem', position: 2, name: 'Inquire', item: ctx.abs('inquire') }] }]
  });
}
