// "B": tap once and talk. A hands-free call with the assistant, from the orb in the hero.
// One tap asks for the microphone and starts the conversation; after that the customer just
// talks — each turn ends on a natural pause, the reply is spoken, and it listens again.
// Tap again to end the call. English | Português sit right under the orb.

import {
  STR, button, canListen, canSpeak, Conversation, el, buildReview, hasStrings, humanOptions, listen, pause, primeMicrophone,
  sentCard, speak, stopListening, stopSpeaking, type Locale, type TurnResult,
} from './core';

type State = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'paused' | 'review' | 'sample';

const root = document.querySelector<HTMLElement>('[data-call]');
if (root && hasStrings()) init(root);

function init(root: HTMLElement) {
  const orb = root.querySelector<HTMLButtonElement>('[data-call-orb]')!;
  const hint = root.querySelector<HTMLElement>('[data-call-hint]')!;
  const captions = root.querySelector<HTMLElement>('[data-call-captions]')!;
  const panel = root.querySelector<HTMLElement>('[data-call-panel]')!;
  const langBtns = [...root.querySelectorAll<HTMLButtonElement>('[data-call-lang]')];
  const sheet = document.querySelector<HTMLDialogElement>('#call-review')!;
  const sheetBody = sheet.querySelector<HTMLElement>('[data-call-review-body]')!;

  const convo = new Conversation((root.dataset.lang as Locale) || 'en');
  let state: State = 'idle';
  let inCall = false, silences = 0, run = 0, micGranted = false;
  const v = () => STR[convo.locale].v;
  const a = () => STR[convo.locale].a;

  // ── display ──────────────────────────────────────────────────────────────
  const statusLine = el('p', 'call__status');
  statusLine.setAttribute('role', 'status');
  const botLine = el('p', 'call__bot');
  const userLine = el('p', 'call__user');
  captions.append(statusLine, botLine, userLine);

  function setState(s: State) {
    state = s;
    orb.dataset.state = s;
    const V = v();
    hint.textContent = s === 'idle' ? V.tapToTalk : s === 'connecting' ? V.connecting : s === 'speaking' ? V.tapToInterrupt
      : s === 'paused' ? V.tapToContinue : s === 'sample' ? V.stopSample : s === 'review' ? V.checkDetails : V.tapToEnd;
    statusLine.textContent = s === 'listening' ? V.listening : s === 'thinking' ? V.thinking : s === 'speaking' ? V.speaking : '';
    orb.setAttribute('aria-label', hint.textContent);
    root.classList.toggle('is-live', inCall || s === 'sample');
  }
  function caption(role: 'bot' | 'user', text: string, who?: string) {
    if (role === 'bot') { botLine.textContent = text; userLine.textContent = ''; }
    else { userLine.replaceChildren(); if (who) userLine.append(el('span', 'call__who', `${who}: `)); userLine.append(document.createTextNode(text)); }
  }
  function showPanel(...nodes: Node[]) { panel.replaceChildren(...nodes); panel.hidden = nodes.length === 0; }
  function setLang(l: Locale) {
    convo.locale = l;
    root.dataset.lang = l;
    langBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.callLang === l)));
    root.lang = STR[l].speech;
    // The call's own words follow the conversation language, not just the page's.
    const V = STR[l].v;
    root.querySelector('.call__title')!.textContent = V.callTitle;
    root.querySelector('.call__sub')!.textContent = V.callSub;
    root.querySelector('.call__note')!.textContent = V.notice;
    root.querySelector('[data-call-type]')!.textContent = V.typeInstead;
    root.querySelector('[data-call-sample]')!.textContent = V.sample;
    setState(state);
  }

  async function say(text: string) {
    if (!canSpeak()) { await pause(Math.min(3000, 700 + text.length * 28)); return; }
    setState('speaking');
    await speak(text, convo.locale);
  }

  // ── the call ─────────────────────────────────────────────────────────────
  async function startCall() {
    const my = ++run;
    showPanel();
    if (!canListen()) return unavailable();
    setState('connecting');
    // Ask for the microphone inside the tap, the way a phone call would.
    const mic = await primeMicrophone(convo.locale);
    if (my !== run) return;
    if (mic === 'denied') return denied();
    if (mic === 'unavailable') return unavailable();
    micGranted = true;
    inCall = true;
    silences = 0;
    convo.reset(convo.locale);
    convo.usedVoice = true;
    const g = convo.greeting();
    caption('bot', g);
    await say(g);
    if (my === run && inCall) listenTurn();
  }

  function listenTurn(fromTap = false) {
    if (!inCall) return;
    const my = run;
    const ok = listen(convo.locale, {
      onStart: () => { if (my === run) setState('listening'); },
      onInterim: (t) => caption('user', t, v().you),
      onFinal: (t) => { silences = 0; userSaid(t); },
      onSilence: async () => {
        if (my !== run || !inCall) return;
        if (++silences >= 2) { caption('bot', v().stillThere); await say(v().stillThere); if (inCall) setState('paused'); }
        else listenTurn();
      },
      onError: (k) => {
        if (my !== run) return;
        if (k === 'denied' && (fromTap || !micGranted)) denied();
        else if (k === 'nomic') unavailable();
        else setState('paused'); // e.g. iOS wanting a tap per turn: wait for one
      },
    });
    if (!ok) setState('paused');
  }

  async function userSaid(text: string) {
    caption('user', text, v().you);
    setState('thinking');
    afterTurn(await convo.send(text));
  }

  async function afterTurn(res: TurnResult) {
    if (!inCall) return;
    const my = run;
    if (!res.ok) {
      const msg = a()[res.kind === 'offline' ? 'offline' : 'apiError'];
      caption('bot', msg);
      showPanel(button(a().retry, 'btn--ink', async () => { showPanel(); setState('thinking'); afterTurn(await convo.request()); }), humanOptions(convo.locale, endCall));
      await say(msg);
      if (my === run) setState('paused');
      return;
    }
    if (res.localeChanged) setLang(convo.locale);
    caption('bot', res.reply);
    if (res.handoff) showPanel(humanOptions(convo.locale, endCall));
    await say(res.reply);
    if (my !== run || !inCall) return;
    res.ready ? openReview() : listenTurn();
  }

  function openReview() {
    stopListening();
    setState('review');
    sheet.querySelector('[data-call-review-title]')!.textContent = v().checkDetails;
    sheetBody.replaceChildren(buildReview(convo, {
      onSent: (ref) => {
        sheet.close();
        inCall = false;
        run++;
        showPanel(sentCard(convo.locale, ref));
        caption('bot', `${a().sentTitle}. ${a().sentHours}`);
        speak(`${a().sentTitle}. ${a().sentHours}`, convo.locale).then(() => setState('idle'));
        setState('idle');
      },
      onBack: () => { sheet.close(); },
      onLeave: () => { sheet.close(); endCall(); },
      onStartReal: () => { sheet.close(); startCall(); },
    }));
    if (!sheet.open) sheet.showModal();
  }

  function endCall(silent = false) {
    run++;
    inCall = false;
    stopSpeaking(); stopListening();
    setState('idle');
    if (!silent) { caption('bot', v().callEnded); }
  }

  /** Switch language mid-call; the assistant confirms and carries on from where it was. */
  async function switchLanguage(l: Locale) {
    if (l === convo.locale) return;
    if (!inCall || !convo.started) {
      setLang(l);
      if (inCall) { stopSpeaking(); stopListening(); convo.reset(l); const g = convo.greeting(); caption('bot', g); await say(g); listenTurn(); }
      return;
    }
    stopSpeaking(); stopListening();
    setState('thinking');
    afterTurn(await convo.send(`(${l === 'pt' ? 'Português' : 'English'})`));
  }

  function unavailable() {
    inCall = false;
    setState('idle');
    const box = el('div', 'call__notice');
    box.append(el('strong', undefined, v().unavailable), el('p', undefined, v().unavailableHint),
      button(v().sample, 'btn--primary', runSample), button(v().typeInstead, 'btn--ghost', typeInstead));
    showPanel(box);
  }
  function denied() {
    inCall = false;
    setState('idle');
    const box = el('div', 'call__notice');
    box.append(el('strong', undefined, v().denied), button(v().typeInstead, 'btn--ghost', typeInstead), button(v().sample, 'btn--ghost', runSample));
    showPanel(box);
  }
  function typeInstead() {
    endCall(true);
    window.dispatchEvent(new CustomEvent('pi:open-assistant', { detail: { mode: 'text', lang: convo.locale } }));
  }

  // ── sample call: scripted customer lines, live replies from the same engine ──
  async function runSample() {
    endCall(true);
    const my = ++run;
    const locale = convo.locale;
    convo.reset(locale);
    convo.sample = true;
    setState('sample');
    const banner = el('p', 'call__banner', v().sampleBanner);
    showPanel(banner);
    const alive = () => my === run;
    const g = convo.greeting();
    caption('bot', g);
    await say(g);
    for (const line of STR[locale].v.sampleLines as string[]) {
      if (!alive()) return;
      setState('sample');
      await pause(500);
      caption('user', line, v().sampleCustomer);
      await pause(900);
      const res = await convo.send(line);
      if (!alive() || !res.ok) return;
      caption('bot', res.reply);
      await say(res.reply);
      if (res.ready) break;
    }
    if (!alive()) return;
    setState('idle');
    sheet.querySelector('[data-call-review-title]')!.textContent = v().checkDetails;
    sheetBody.replaceChildren(buildReview(convo, { onSent: () => {}, onBack: () => sheet.close(), onLeave: () => sheet.close(), onStartReal: () => { sheet.close(); startCall(); } }));
    sheet.showModal();
  }

  // ── wiring ───────────────────────────────────────────────────────────────
  orb.addEventListener('click', () => {
    if (state === 'sample') { run++; stopSpeaking(); setState('idle'); showPanel(); caption('bot', ''); return; }
    if (state === 'review') return openReview();
    if (!inCall) return void startCall();
    if (state === 'speaking') { stopSpeaking(); listenTurn(true); return; }
    if (state === 'paused') { listenTurn(true); return; }
    endCall();
  });
  langBtns.forEach((b) => b.addEventListener('click', () => switchLanguage(b.dataset.callLang as Locale)));
  root.querySelector('[data-call-type]')!.addEventListener('click', typeInstead);
  root.querySelector('[data-call-sample]')!.addEventListener('click', runSample);
  sheet.addEventListener('close', () => { if (state === 'review' && inCall) listenTurn(true); });
  window.addEventListener('pi:call-start', () => {
    orb.scrollIntoView({ block: 'center', behavior: 'smooth' });
    if (!inCall && state !== 'sample') startCall();
  });
  window.addEventListener('pagehide', () => endCall(true));
  setLang(convo.locale);
  setState('idle');
}
