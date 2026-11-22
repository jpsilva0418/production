// "A": the assistant panel. A conversation by voice or text with a visible transcript.
// Opened from the hero card already in the chosen language (English | Português), from the
// contact dock, or from any "Ask about this" link.

import {
  STR, button, canListen, canSpeak, Conversation, el, buildReview, hasStrings, humanOptions, listen, pause, sentCard,
  speak, stopListening, stopSpeaking, type Locale,
} from './core';

type Phase = 'chat' | 'review' | 'sent' | 'ended' | 'sample';
type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

const dialog = document.querySelector<HTMLDialogElement>('#assistant');
if (dialog && hasStrings()) init(dialog);

function init(dialog: HTMLDialogElement) {
  const q = <T extends HTMLElement = HTMLElement>(name: string) => dialog.querySelector<T>(`[data-a="${name}"]`)!;
  const log = q('log'), status = q('status'), mic = q<HTMLButtonElement>('mic'), micLabel = q('mic-label');
  const voiceRow = q('voice'), muteBtn = q<HTMLButtonElement>('mute'), input = q<HTMLInputElement>('input'), composer = q<HTMLFormElement>('composer');

  const convo = new Conversation((dialog.dataset.locale as Locale) ?? 'en');
  let phase: Phase = 'ended';
  let mode: 'voice' | 'text' = 'text';
  let voiceState: VoiceState = 'idle';
  let muted = false, micGranted = false, sampleRun = 0;
  let opener: Element | null = null;
  const a = () => STR[convo.locale].a;
  const v = () => STR[convo.locale].v;

  // ── rendering ────────────────────────────────────────────────────────────
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
  const leave = () => { shutdown(); dialog.close(); };
  const human = () => { const box = el('div', 'msg msg--sys'); box.append(el('strong', undefined, a().humanTitle), humanOptions(convo.locale, leave)); log.append(box); scroll(); };

  function applyStrings() {
    dialog.querySelectorAll<HTMLElement>('[data-t]').forEach((n) => (n.textContent = a()[n.dataset.t!]));
    dialog.querySelectorAll<HTMLElement>('[data-v]').forEach((n) => (n.textContent = v()[n.dataset.v!]));
    dialog.querySelectorAll<HTMLButtonElement>('[data-a-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.aLang === convo.locale)));
    input.placeholder = a().inputPh;
    dialog.lang = STR[convo.locale].speech;
    q('close').setAttribute('aria-label', STR[convo.locale].close);
    q('mute-label').textContent = muted ? a().unmute : a().mute;
    setVoice(voiceState);
  }

  function setVoice(next: VoiceState) {
    voiceState = next;
    mic.dataset.state = next;
    status.textContent = mode === 'voice' || phase === 'sample' ? a().state[next] : next === 'thinking' ? a().state.thinking : '';
    micLabel.textContent = next === 'listening' ? a().tapToStop : next === 'speaking' ? a().interrupt : a().tapToTalk;
    mic.disabled = next === 'thinking';
  }

  async function say(text: string) {
    if ((mode !== 'voice' && phase !== 'sample') || muted || !canSpeak()) return;
    setVoice('speaking');
    await speak(text, convo.locale, muted);
    if (voiceState === 'speaking') setVoice('idle');
  }

  // ── listening, hands-free ────────────────────────────────────────────────
  let interim: HTMLElement | null = null;
  function listenTurn(fromTap = false) {
    if (mode !== 'voice' || phase !== 'chat') return;
    const started = listen(convo.locale, {
      onStart: () => { micGranted = true; setVoice('listening'); },
      onInterim: (t) => {
        interim ??= bubble('user', '', a().you);
        interim.classList.add('msg--interim');
        interim.lastElementChild!.textContent = t;
        scroll();
      },
      onFinal: (t) => { interim?.remove(); interim = null; convo.usedVoice = true; sendUser(t); },
      onSilence: () => { interim?.remove(); interim = null; setVoice('idle'); if (fromTap) sys(a().didNotHear); },
      onError: (k) => {
        interim?.remove(); interim = null;
        // A refusal after the customer tapped is a real "no". An automatic restart being blocked
        // (iOS wants a tap for each turn) just means: wait for a tap.
        if (k === 'denied' && fromTap) toText('micDenied');
        else if (k === 'nomic') toText('micUnsupported');
        else setVoice('idle');
      },
    });
    if (!started) setVoice('idle');
  }

  function toText(reason: 'micDenied' | 'micUnsupported') {
    mode = 'text';
    voiceRow.hidden = true;
    stopSpeaking(); stopListening();
    const box = sys(a()[reason]);
    box.append(document.createElement('br'), button(v().sample, 'btn--ghost', startSample));
    setVoice('idle');
    input.focus();
  }

  // ── conversation ─────────────────────────────────────────────────────────
  function start(m: 'voice' | 'text', locale: Locale) {
    sampleRun++;
    shutdown();
    convo.reset(locale);
    phase = 'chat';
    mode = m;
    log.textContent = '';
    voiceRow.hidden = m !== 'voice';
    applyStrings();
    if (m === 'voice' && !canListen()) {
      mode = 'text'; voiceRow.hidden = true;
      const box = sys(`${v().unavailable} ${v().unavailableHint}`);
      box.append(document.createElement('br'), button(v().sample, 'btn--ghost', startSample));
    }
    const greeting = convo.greeting();
    bubble('bot', greeting, a().bot);
    if (mode === 'voice') {
      // Called inside the tap that opened the conversation, which is what lets iOS Safari speak.
      say(greeting).then(() => listenTurn());
      if (!canSpeak()) listenTurn();
    } else {
      setVoice('idle');
      input.focus();
    }
  }

  async function handle(res: Awaited<ReturnType<Conversation['request']>>) {
    if (phase !== 'chat') return;
    if (!res.ok) return fail(res.kind);
    if (res.localeChanged) applyStrings();
    bubble('bot', res.reply, a().bot);
    if (res.handoff) human();
    if (mode === 'voice') {
      await say(res.reply);
      if (phase !== 'chat') return;
      res.ready ? review() : listenTurn();
    } else {
      setVoice('idle');
      res.ready ? review() : input.focus();
    }
  }

  function fail(kind: 'offline' | 'api') {
    setVoice('idle');
    const box = sys(a()[kind === 'offline' ? 'offline' : 'apiError']);
    box.append(document.createElement('br'), button(a().retry, 'btn--ink', async () => { box.remove(); setVoice('thinking'); handle(await convo.request()); }), humanOptions(convo.locale, leave));
    scroll();
  }

  async function sendUser(text: string) {
    if (phase !== 'chat' || voiceState === 'thinking' || !text) return;
    stopSpeaking(); stopListening();
    log.querySelector('.review')?.remove();
    bubble('user', text, a().you);
    setVoice('thinking');
    handle(await convo.send(text));
  }

  /** Switch language mid-conversation; the assistant confirms and carries on from where it was. */
  async function switchLanguage(to: Locale) {
    if (to === convo.locale) return;
    if (phase !== 'chat' || !convo.started) return start(mode, to);
    stopSpeaking(); stopListening();
    setVoice('thinking');
    handle(await convo.send(`(${to === 'pt' ? 'Português' : to === 'es' ? 'Español' : 'English'})`));
  }

  function review() {
    log.querySelector('.review')?.remove();
    phase = 'review';
    const card = buildReview(convo, {
      onSent: sent,
      onBack: () => { card.remove(); phase = 'chat'; mode === 'voice' ? listenTurn(true) : input.focus(); },
      onLeave: leave,
      onStartReal: () => start(canListen() ? 'voice' : 'text', convo.locale),
    });
    log.append(card);
    scroll();
    if (mode === 'text') card.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
  }

  function sent(reference: string) {
    if (phase === 'sent') return;
    phase = 'sent';
    stopListening();
    log.querySelector('.review')?.remove();
    const card = sentCard(convo.locale, reference);
    log.append(card, button(a().newConversation, 'btn--ghost', () => start(mode, convo.locale)));
    scroll();
    card.focus();
    say(`${a().sentTitle}. ${a().sentHours}`);
  }

  // ── sample call: scripted customer lines, live replies from the same engine ──
  async function startSample() {
    const run = ++sampleRun;
    shutdown();
    const locale = convo.locale;
    convo.reset(locale);
    convo.sample = true;
    phase = 'sample';
    log.textContent = '';
    voiceRow.hidden = false;
    applyStrings();
    sys(v().sampleBanner);
    const alive = () => run === sampleRun && dialog.open;
    const g = convo.greeting();
    bubble('bot', g, a().bot);
    await say(g); await pause(500);
    for (const line of STR[locale].v.sampleLines as string[]) {
      if (!alive()) return;
      setVoice('listening');
      await pause(700);
      bubble('user', line, v().sampleCustomer);
      setVoice('thinking');
      const res = await convo.send(line);
      if (!alive()) return;
      if (!res.ok) { fail(res.kind); return; }
      bubble('bot', res.reply, a().bot);
      await say(res.reply);
      if (!canSpeak() || muted) await pause(Math.min(2600, 600 + res.reply.length * 25));
      if (res.ready) break;
    }
    if (!alive()) return;
    setVoice('idle');
    phase = 'review';
    log.append(buildReview(convo, { onSent: () => {}, onBack: () => {}, onLeave: leave, onStartReal: () => start(canListen() ? 'voice' : 'text', locale) }));
    scroll();
  }

  function shutdown() {
    stopSpeaking(); stopListening();
    setVoice('idle');
  }
  function end() {
    const wasSent = phase === 'sent';
    sampleRun++;
    shutdown();
    phase = 'ended';
    log.querySelector('.review')?.remove();
    if (!wasSent) sys(a().ended);
    log.append(button(a().newConversation, 'btn--ghost', () => start(mode, convo.locale)));
    scroll();
  }

  // ── wiring ───────────────────────────────────────────────────────────────
  function open(opts: { mode?: 'voice' | 'text'; lang?: Locale; topic?: string }) {
    if (!dialog.open) dialog.showModal();
    const lang = opts.lang ?? convo.locale;
    const fresh = phase === 'ended' || phase === 'sent' || phase === 'sample' || !convo.started;
    if (fresh || opts.lang) start(opts.mode ?? (opts.lang ? 'voice' : 'text'), lang);
    if (opts.topic) { input.value = opts.topic; if (mode === 'text') input.focus(); }
  }

  document.addEventListener('click', (e) => {
    const t = (e.target as Element).closest<HTMLElement>('[data-open-assistant]');
    if (!t) return;
    // In the tap-and-talk layout a plain "AI assistant" tap starts the call where the orb is.
    if (document.documentElement.dataset.voice === 'call' && !t.dataset.topic && !t.dataset.openAssistant && document.querySelector('[data-call]')) {
      window.dispatchEvent(new CustomEvent('pi:call-start'));
      return;
    }
    opener = t;
    const want = t.dataset.openAssistant;
    open({ mode: want === 'voice' || want === 'text' ? want : undefined, lang: (t.dataset.lang as Locale) || undefined, topic: t.dataset.topic });
  });
  window.addEventListener('pi:open-assistant', (e: Event) => { const d = (e as CustomEvent).detail ?? {}; open({ mode: d.mode, lang: d.lang }); });

  mic.addEventListener('click', () => {
    if (phase === 'sample') return;
    if (voiceState === 'listening') stopListening(), setVoice('idle');
    else if (voiceState === 'speaking') { stopSpeaking(); setVoice('idle'); listenTurn(true); }
    else if (voiceState === 'idle') listenTurn(true);
  });
  muteBtn.addEventListener('click', () => {
    muted = !muted;
    muteBtn.setAttribute('aria-pressed', String(muted));
    q('mute-on').hidden = muted; q('mute-off').hidden = !muted;
    q('mute-label').textContent = muted ? a().unmute : a().mute;
    if (muted && voiceState === 'speaking') { stopSpeaking(); setVoice('idle'); }
  });
  composer.addEventListener('submit', (e) => e.preventDefault());
  composer.addEventListener('click', (e) => { if ((e.target as Element).closest('button[type=submit]')) { e.preventDefault(); typed(); } });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); typed(); } });
  function typed() {
    const val = input.value.trim();
    if (!val) return;
    if (phase === 'ended' || phase === 'sent' || phase === 'sample') start('text', convo.locale);
    input.value = '';
    sendUser(val);
  }
  dialog.querySelectorAll<HTMLButtonElement>('[data-a-lang]').forEach((b) => b.addEventListener('click', () => switchLanguage(b.dataset.aLang as Locale)));
  q('human').addEventListener('click', human);
  q('sample').addEventListener('click', startSample);
  q('end').addEventListener('click', end);
  q('close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (phase === 'chat' || phase === 'review' || phase === 'sample') end(); else shutdown();
    (opener as HTMLElement | null)?.focus?.();
  });
  window.addEventListener('offline', () => { if (dialog.open && phase === 'chat') sys(a().offline); });
  window.addEventListener('pagehide', shutdown);
  applyStrings();
}
