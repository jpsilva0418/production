// The website assistant: a real two-way conversation by voice or text.
//
// Voice uses the browser's own speech services (Web Speech API): recognition turns the
// customer's speech into text on the device / by the browser vendor, and synthesis reads
// the reply aloud. No audio is recorded, uploaded or stored by this site. The reply itself
// comes from /api/assistant/turn. Where the browser cannot do voice, or the microphone is
// refused, the same conversation continues by typing.
//
// Nothing is submitted by the conversation. The customer reviews an editable summary and
// taps Send; success is shown only when /api/leads confirms the lead is stored.

import { newKey, onSubmit, openLiveChat, sendLead } from './site';

type Locale = 'en' | 'pt' | 'es';
type Phase = 'intro' | 'chat' | 'review' | 'sent' | 'ended';
type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';
interface Draft { name: string | null; phone: string | null; email: string | null; preferred: string | null; line: string | null; categories: string[]; state: string | null; urgency: string | null; callback: string | null; summary: string; }
interface Msg { role: 'user' | 'assistant'; text: string; }

const dialog = document.querySelector<HTMLDialogElement>('#assistant');
if (dialog) init(dialog);

function init(dialog: HTMLDialogElement) {
  const q = <T extends HTMLElement = HTMLElement>(name: string) => dialog.querySelector<T>(`[data-a="${name}"]`)!;
  const STR = JSON.parse(q('strings').textContent!) as Record<Locale, any>;
  const SITE = JSON.parse(q('site').textContent!) as { tel: string; whatsapp: string };
  const liveChat = !!dialog.dataset.liveChat;

  const log = q('log'), stage = q('stage'), status = q('status'), mic = q<HTMLButtonElement>('mic'), micLabel = q('mic-label');
  const voiceRow = q('voice'), muteBtn = q<HTMLButtonElement>('mute'), input = q<HTMLInputElement>('input'), composer = q<HTMLFormElement>('composer');
  const langSel = q<HTMLSelectElement>('lang');

  const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const synth: SpeechSynthesis | undefined = 'speechSynthesis' in window ? window.speechSynthesis : undefined;

  const emptyDraft = (): Draft => ({ name: null, phone: null, email: null, preferred: null, line: null, categories: [], state: null, urgency: null, callback: null, summary: '' });
  let locale = (dialog.dataset.locale as Locale) ?? 'en';
  let phase: Phase = 'intro';
  let mode: 'voice' | 'text' = 'text';
  let voiceState: VoiceState = 'idle';
  let usedVoice = false, micGranted = false, muted = false;
  let messages: Msg[] = [], draft = emptyDraft(), expect: string | null = null, asked: string[] = [];
  let leadKey = newKey();
  let recognition: any = null, heardFinal = false, userStartedListening = false;
  let speakToken = 0, pendingTopic = '';
  let lastFailed: (() => void) | null = null;
  let opener: Element | null = null;

  const a = () => STR[locale].a;

  // ── rendering ────────────────────────────────────────────────────────────
  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text; // customer and model text is only ever inserted as text
    return n;
  };
  const scroll = () => requestAnimationFrame(() => (log.scrollTop = log.scrollHeight));
  function bubble(kind: 'bot' | 'user' | 'sys', text: string, who?: string) {
    const b = el('div', `msg msg--${kind}`);
    if (who) b.append(el('span', 'who', who));
    b.append(el('span', undefined, text));
    log.append(b);
    scroll();
    return b;
  }
  const sys = (text: string) => bubble('sys', text);
  const button = (label: string, cls: string, onClick: () => void) => {
    const b = el('button', `btn ${cls}`, label);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  };
  const link = (label: string, cls: string, href: string, external = false) => {
    const l = el('a', `btn ${cls}`, label);
    l.href = href;
    if (external) { l.target = '_blank'; l.rel = 'noopener'; }
    return l;
  };

  function applyStrings() {
    const s = a();
    dialog.querySelectorAll<HTMLElement>('[data-t]').forEach((n) => (n.textContent = s[n.dataset.t!]));
    input.placeholder = s.inputPh;
    langSel.value = locale;
    q('close').setAttribute('aria-label', STR[locale].close);
    dialog.lang = STR[locale].speech;
    q('mute-label').textContent = muted ? s.unmute : s.mute;
    setVoice(voiceState);
  }

  function setVoice(next: VoiceState) {
    voiceState = next;
    const s = a();
    mic.dataset.state = next;
    status.textContent = mode === 'voice' ? s.state[next] : next === 'thinking' ? s.state.thinking : '';
    micLabel.textContent = next === 'listening' ? s.tapToStop : next === 'speaking' ? s.interrupt : s.tapToTalk;
    mic.disabled = next === 'thinking';
  }

  function humanOptions(container: HTMLElement) {
    const s = STR[locale];
    const box = el('div', 'human-opts');
    box.append(link(s.call, 'btn--primary', SITE.tel), link(s.whatsapp, 'btn--ghost', SITE.whatsapp, true));
    if (liveChat) box.append(button(s.livechat, 'btn--ghost', () => { shutdown(); dialog.close(); openLiveChat(); }));
    const form = link(s.form, 'btn--ghost', '#getaquote');
    form.addEventListener('click', () => { shutdown(); dialog.close(); });
    box.append(form);
    container.append(box);
  }

  function renderIntro() {
    phase = 'intro';
    log.textContent = '';
    stage.hidden = true;
    const s = a();
    const card = el('div', 'assistant__intro');
    card.append(el('h3', undefined, s.consentTitle), el('p', undefined, s.disclosure), el('p', undefined, s.consentVoice), el('p', undefined, s.consentData));
    const actions = el('div', 'actions');
    const voiceBtn = button(s.startVoice, 'btn--primary', () => start('voice'));
    actions.append(voiceBtn, button(s.startText, 'btn--ghost', () => start('text')));
    card.append(actions);
    const h = el('p', undefined);
    const hb = el('button', 'linkish', s.human);
    hb.type = 'button';
    hb.addEventListener('click', () => { hb.remove(); card.append(el('h3', undefined, s.humanTitle)); humanOptions(card); scroll(); });
    h.append(hb);
    card.append(h);
    log.append(card);
    voiceBtn.focus();
  }

  // ── speech out ───────────────────────────────────────────────────────────
  function pickVoice(): SpeechSynthesisVoice | undefined {
    const want = STR[locale].speech.toLowerCase();
    const voices = synth?.getVoices() ?? [];
    const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
    return voices.find((v) => norm(v) === want && v.localService) ?? voices.find((v) => norm(v) === want) ?? voices.find((v) => norm(v).startsWith(want.slice(0, 2)));
  }
  synth?.getVoices(); // some browsers load the list lazily

  function stopSpeaking() {
    speakToken++;
    try { synth?.cancel(); } catch { /* ignore */ }
  }

  /** Read text aloud, then call done(). done() also runs when speech is unavailable, muted, interrupted or stalls. */
  function speak(text: string, done: () => void) {
    if (mode !== 'voice' || muted || !synth) return done();
    stopSpeaking();
    const token = ++speakToken;
    let finished = false;
    const finish = () => { if (finished || token !== speakToken) return; finished = true; clearTimeout(watchdog); done(); };
    // Short utterances: long ones are cut off after ~15 s in Chromium.
    const parts = text.match(/[^.!?…]+[.!?…]*\s*/g)?.map((p) => p.trim()).filter(Boolean) ?? [text];
    const voice = pickVoice();
    parts.forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = STR[locale].speech;
      if (voice) u.voice = voice;
      u.rate = 1.02;
      if (i === parts.length - 1) { u.onend = finish; u.onerror = finish; }
      synth.speak(u);
    });
    setVoice('speaking');
    // Safari occasionally never fires onend; never leave the customer stuck in "Speaking…".
    const watchdog = setTimeout(finish, Math.min(60_000, 2500 + text.length * 95));
  }

  // ── speech in ────────────────────────────────────────────────────────────
  function stopListening() {
    try { recognition?.abort(); } catch { /* ignore */ }
    recognition = null;
  }

  function toText(reasonKey: 'micDenied' | 'micUnsupported') {
    mode = 'text';
    voiceRow.hidden = true;
    stopSpeaking();
    stopListening();
    sys(a()[reasonKey]);
    setVoice('idle');
    input.focus();
  }

  function listen(fromGesture: boolean) {
    if (mode !== 'voice' || phase !== 'chat' || !SR) return;
    stopListening();
    stopSpeaking();
    heardFinal = false;
    userStartedListening = fromGesture;
    const r = new SR();
    recognition = r;
    r.lang = STR[locale].speech;
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 1;
    let interim: HTMLElement | null = null;
    r.onstart = () => { micGranted = true; setVoice('listening'); };
    r.onresult = (e: any) => {
      let finalText = '', partial = '';
      for (let i = e.resultIndex; i < e.results.length; i++) (e.results[i].isFinal ? (finalText += e.results[i][0].transcript) : (partial += e.results[i][0].transcript));
      if (partial && !finalText) {
        interim ??= bubble('user', '', a().you);
        interim.classList.add('msg--interim');
        interim.lastElementChild!.textContent = partial;
        scroll();
      }
      if (finalText.trim()) {
        heardFinal = true;
        interim?.remove();
        interim = null;
        usedVoice = true;
        recognition = null;
        try { r.stop(); } catch { /* ignore */ }
        sendUser(finalText.trim());
      }
    };
    r.onerror = (e: any) => {
      if (recognition !== r) return;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        recognition = null;
        // A refusal after the customer tapped the microphone is a real "no". An automatic
        // restart being blocked (iOS wants a tap each time) just means: wait for a tap.
        if (userStartedListening && !micGranted) toText('micDenied');
        else setVoice('idle');
      } else if (e.error === 'audio-capture') { recognition = null; toText('micUnsupported'); }
    };
    r.onend = () => {
      interim?.remove();
      if (recognition !== r) return;
      recognition = null;
      if (!heardFinal) {
        setVoice('idle');
        if (userStartedListening) sys(a().didNotHear);
      }
    };
    try { r.start(); } catch { recognition = null; setVoice('idle'); }
  }

  // ── conversation ─────────────────────────────────────────────────────────
  function start(m: 'voice' | 'text') {
    phase = 'chat';
    mode = m;
    log.textContent = '';
    stage.hidden = false;
    voiceRow.hidden = m !== 'voice';
    if (m === 'voice' && !SR) { mode = 'text'; voiceRow.hidden = true; sys(a().micUnsupported); }
    else if (m === 'voice' && !synth) sys(a().ttsUnsupported);
    applyStrings();
    const greeting = a().greeting;
    messages = [{ role: 'assistant', text: greeting }];
    bubble('bot', greeting, a().bot);
    if (pendingTopic) { input.value = pendingTopic; pendingTopic = ''; }
    // Called inside the tap that opened the conversation, which is what lets iOS Safari speak.
    speak(greeting, () => { setVoice('idle'); listen(false); });
    if (mode === 'text') { setVoice('idle'); input.focus(); }
  }

  async function turn() {
    lastFailed = null;
    setVoice('thinking');
    const body = JSON.stringify({ locale, messages: messages.slice(-60), draft, expect, asked });
    let out: any = null;
    if (!navigator.onLine) return fail('offline');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20_000);
    try {
      const res = await fetch('/api/assistant/turn', { method: 'POST', headers: { 'content-type': 'application/json' }, body, signal: ctrl.signal });
      out = await res.json().catch(() => null);
      if (!res.ok || !out?.ok || typeof out.reply !== 'string') out = null;
    } catch { out = null; }
    clearTimeout(timer);
    if (phase !== 'chat') return; // ended while we waited
    if (!out) return fail(navigator.onLine ? 'apiError' : 'offline');

    if (out.locale !== locale) { locale = out.locale; applyStrings(); }
    draft = out.draft; expect = out.expect; asked = out.asked;
    messages.push({ role: 'assistant', text: out.reply });
    bubble('bot', out.reply, a().bot);
    if (out.handoff) { const box = el('div', 'msg msg--sys'); box.append(el('strong', undefined, a().humanTitle)); humanOptions(box); log.append(box); scroll(); }
    speak(out.reply, () => { setVoice('idle'); if (out.ready) review(); else listen(false); });
    if (mode === 'text') { setVoice('idle'); out.ready ? review() : input.focus(); }
  }

  function fail(kind: 'offline' | 'apiError') {
    setVoice('idle');
    const box = sys(a()[kind]);
    lastFailed = () => { box.remove(); turn(); };
    box.append(document.createElement('br'), button(a().retry, 'btn--ink', () => lastFailed?.()));
    humanOptions(box);
    scroll();
  }

  function sendUser(text: string) {
    if (phase !== 'chat' || voiceState === 'thinking' || !text) return;
    stopSpeaking();
    stopListening();
    log.querySelector('.review')?.remove();
    messages.push({ role: 'user', text: text.slice(0, 600) });
    bubble('user', text, a().you);
    turn();
  }

  // ── review, submit, confirmation ─────────────────────────────────────────
  function review() {
    log.querySelector('.review')?.remove();
    const s = a(), S = STR[locale];
    const card = el('form', 'review');
    card.noValidate = true;
    card.append(el('h3', undefined, s.reviewTitle), el('p', undefined, s.reviewIntro));
    const field = (label: string, name: string, value: string, type = 'text', attrs: Record<string, string> = {}) => {
      const f = el('div', 'field'), l = el('label', undefined, label), i = el('input', 'input');
      i.id = `rv-${name}`; l.htmlFor = i.id; i.name = name; i.type = type; i.value = value;
      for (const [k, v] of Object.entries(attrs)) i.setAttribute(k, v);
      const e = el('p', 'err'); e.hidden = true; e.dataset.err = name;
      f.append(l, i, e);
      return f;
    };
    const fmt = (p: string | null) => (p ? `(${p.slice(2, 5)}) ${p.slice(5, 8)}-${p.slice(8)}` : '');
    card.append(field(s.fields.name, 'name', draft.name ?? '', 'text', { autocomplete: 'name', maxlength: '120' }));
    const two = el('div', 'two');
    two.append(field(s.fields.phone, 'phone', fmt(draft.phone), 'tel', { autocomplete: 'tel', inputmode: 'tel', maxlength: '40' }), field(s.fields.email, 'email', draft.email ?? '', 'email', { autocomplete: 'email', inputmode: 'email', maxlength: '254' }));
    card.append(two);
    const pf = el('div', 'field'), pl = el('label', undefined, s.fields.preferred), ps = el('select', 'input');
    ps.id = 'rv-preferred'; pl.htmlFor = ps.id; ps.name = 'preferred';
    for (const [v, label] of Object.entries(S.pref as Record<string, string>)) { const o = el('option', undefined, label); o.value = v; o.selected = v === (draft.preferred ?? (draft.phone ? 'phone' : 'email')); ps.append(o); }
    pf.append(pl, ps);
    card.append(pf);
    const cats = draft.categories.map((c) => S.cats[c]).filter(Boolean).join(', ');
    if (cats) { const p = el('p'); p.append(el('strong', undefined, `${s.fields.category}: `), document.createTextNode(cats)); card.append(p); }
    const sf = el('div', 'field'), sl = el('label', undefined, s.fields.summary), st = el('textarea', 'input');
    st.id = 'rv-summary'; sl.htmlFor = st.id; st.name = 'summary'; st.rows = 3; st.maxLength = 600; st.value = draft.summary;
    sf.append(sl, st);
    card.append(sf);
    const two2 = el('div', 'two');
    two2.append(field(s.fields.state, 'state', draft.state ?? '', 'text', { maxlength: '40' }), field(s.fields.callback, 'callback', draft.callback ?? '', 'text', { maxlength: '120' }));
    card.append(two2);
    const cl = el('label', 'consent'), cb = el('input');
    cb.type = 'checkbox'; cb.name = 'transcript';
    cl.append(cb, el('span', undefined, s.keepTranscript));
    card.append(cl);
    const st2 = el('div'); st2.setAttribute('role', 'status'); st2.setAttribute('aria-live', 'polite');
    const send = el('button', 'btn btn--primary btn--block', s.confirmSend); send.type = 'submit';
    card.append(st2, send, button(s.edit, 'btn--ghost btn--block', () => { card.remove(); phase = 'chat'; mode === 'voice' ? listen(true) : input.focus(); }));
    log.append(card);
    phase = 'review';
    scroll();
    if (mode === 'text') card.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });

    onSubmit(card, async () => {
      if (send.disabled) return; // a second tap while the first is still in flight
      const fd = new FormData(card), val = (k: string) => String(fd.get(k) ?? '').trim();
      const inv = S.invalid, errs: Record<string, string> = {};
      const d10 = val('phone').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
      if (val('name').length < 2) errs.name = inv.name;
      if (val('phone') && d10.length !== 10) errs.phone = inv.phone;
      if (val('email') && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(val('email'))) errs.email = inv.email;
      if (!val('phone') && !val('email')) errs.phone = inv.contact;
      card.querySelectorAll<HTMLElement>('[data-err]').forEach((n) => { const m = errs[n.dataset.err!]; n.textContent = m ?? ''; n.hidden = !m; });
      if (Object.keys(errs).length) { card.querySelector<HTMLInputElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus(); return; }

      send.disabled = true; send.textContent = s.sendingLead; st2.textContent = '';
      const out = await sendLead({
        idempotencyKey: leadKey, source: usedVoice ? 'web_voice' : 'web_text', locale,
        name: val('name'), phone: val('phone') || null, email: val('email') || null, preferredContact: val('preferred') || null,
        line: draft.line, categories: draft.categories, state: val('state') || null, urgency: draft.urgency, callbackTime: val('callback') || null,
        summary: val('summary'), transcriptConsent: cb.checked, transcript: cb.checked ? messages.slice(-80) : null,
      });
      send.disabled = false; send.textContent = s.confirmSend;
      if (out.ok) return sent(out.reference);
      if (out.kind === 'invalid') {
        out.fields.forEach((f) => { const n = card.querySelector<HTMLElement>(`[data-err="${f === 'contact' ? 'phone' : f}"]`); if (n) { n.textContent = inv[f] ?? ''; n.hidden = false; } });
        return;
      }
      // Honest failure: say plainly that nothing was received, and keep every way to reach a person in view.
      st2.textContent = '';
      const n = el('div', 'notice');
      n.append(el('strong', undefined, s.sendFailed));
      humanOptions(n);
      st2.append(n);
      scroll();
    });
  }

  function sent(reference: string) {
    if (phase === 'sent') return;
    phase = 'sent';
    stopListening();
    log.querySelector('.review')?.remove();
    stage.hidden = true;
    const s = a();
    const card = el('div', 'notice notice--ok');
    card.setAttribute('tabindex', '-1');
    card.append(el('strong', undefined, s.sentTitle), el('span', undefined, `${s.sentBody} `), el('span', 'ref', reference), el('p', undefined, s.sentHours));
    log.append(card, button(s.newConversation, 'btn--ghost', reset));
    scroll();
    card.focus();
    speak(`${s.sentTitle}. ${s.sentHours}`, () => setVoice('idle'));
    (window as any).dataLayer?.push({ event: 'lead_submitted', lead_source: usedVoice ? 'web_voice' : 'web_text' }); // no customer data
  }

  function shutdown() {
    stopSpeaking();
    stopListening();
    setVoice('idle');
  }
  function end() {
    const wasSent = phase === 'sent';
    shutdown();
    phase = 'ended';
    stage.hidden = true;
    log.querySelector('.review')?.remove();
    if (!wasSent) sys(a().ended);
    log.append(button(a().newConversation, 'btn--ghost', reset));
    scroll();
  }
  function reset() {
    shutdown();
    messages = []; draft = emptyDraft(); expect = null; asked = []; usedVoice = false; leadKey = newKey();
    renderIntro();
  }

  // ── wiring ───────────────────────────────────────────────────────────────
  document.addEventListener('click', (e) => {
    const t = (e.target as Element).closest<HTMLElement>('[data-open-assistant]');
    if (!t) return;
    opener = t;
    pendingTopic = t.dataset.topic ?? '';
    if (!dialog.open) dialog.showModal();
    // Opening always lands on the disclosure and consent screen; an in-progress conversation is kept.
    if (phase === 'intro' || phase === 'ended' || phase === 'sent') reset();
    else if (pendingTopic) { input.value = pendingTopic; pendingTopic = ''; }
  });
  mic.addEventListener('click', () => {
    if (voiceState === 'listening') { try { recognition?.stop(); } catch { /* ignore */ } }
    else if (voiceState === 'speaking') { stopSpeaking(); setVoice('idle'); if (phase === 'chat') listen(true); }
    else if (voiceState === 'idle') listen(true);
  });
  muteBtn.addEventListener('click', () => {
    muted = !muted;
    muteBtn.setAttribute('aria-pressed', String(muted));
    q('mute-on').hidden = muted; q('mute-off').hidden = !muted;
    q('mute-label').textContent = muted ? a().unmute : a().mute;
    if (muted && voiceState === 'speaking') { stopSpeaking(); setVoice('idle'); }
  });
  onSubmit(composer, () => { const v = input.value.trim(); if (!v) return; input.value = ''; sendUser(v); });
  q('human').addEventListener('click', () => { const box = el('div', 'msg msg--sys'); box.append(el('strong', undefined, a().humanTitle)); humanOptions(box); log.append(box); scroll(); });
  q('end').addEventListener('click', end);
  q('close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (phase === 'chat' || phase === 'review') end(); else shutdown(); (opener as HTMLElement | null)?.focus?.(); });
  langSel.addEventListener('change', () => {
    locale = langSel.value as Locale;
    stopSpeaking(); stopListening();
    applyStrings();
    if (phase === 'intro') renderIntro();
    else if (phase === 'chat') { const g = a().greeting; messages.push({ role: 'assistant', text: g }); bubble('bot', g, a().bot); speak(g, () => { setVoice('idle'); listen(false); }); }
  });
  window.addEventListener('offline', () => { if (dialog.open && phase === 'chat') sys(a().offline); });
  window.addEventListener('pagehide', shutdown);
  applyStrings();
}
