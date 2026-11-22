// Shared by both voice experiences: the assistant panel ("A", assistant.ts) and the
// tap-and-talk call ("B", call.ts).
//
// Voice uses the browser's own speech services (Web Speech API). Recognition turns the
// customer's speech into text on the device or by the browser vendor; synthesis reads replies
// aloud. No audio is recorded, uploaded or stored by this site. Replies come from
// /api/assistant/turn. Nothing is submitted until the customer taps Send on the review card,
// and success is shown only when /api/leads confirms the lead is stored.

import { newKey, onSubmit, openLiveChat, sendLead } from './site';

export type Locale = 'en' | 'pt' | 'es';
export interface Draft { name: string | null; phone: string | null; email: string | null; preferred: string | null; line: string | null; categories: string[]; state: string | null; urgency: string | null; callback: string | null; summary: string; }
export interface Msg { role: 'user' | 'assistant'; text: string; }

const json = (sel: string) => { const n = document.querySelector(sel); return n ? JSON.parse(n.textContent!) : null; };
export const STR: Record<Locale, any> = json('[data-a="strings"]') ?? {};
export const SITE: { tel: string; whatsapp: string } = json('[data-a="site"]') ?? { tel: '', whatsapp: '' };
export const hasStrings = () => Object.keys(STR).length > 0;

export const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text; // customer and assistant text is only ever inserted as text
  return n;
};
export const button = (label: string, cls: string, onClick: () => void) => {
  const b = el('button', `btn ${cls}`, label);
  b.type = 'button';
  b.addEventListener('click', onClick);
  return b;
};
export const link = (label: string, cls: string, href: string, external = false) => {
  const l = el('a', `btn ${cls}`, label);
  l.href = href;
  if (external) { l.target = '_blank'; l.rel = 'noopener'; }
  return l;
};
export const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── conversation ───────────────────────────────────────────────────────────
export const emptyDraft = (): Draft => ({ name: null, phone: null, email: null, preferred: null, line: null, categories: [], state: null, urgency: null, callback: null, summary: '' });

export type TurnResult =
  | { ok: true; reply: string; ready: boolean; handoff: boolean; localeChanged: boolean }
  | { ok: false; kind: 'offline' | 'api' };

export class Conversation {
  messages: Msg[] = [];
  draft: Draft = emptyDraft();
  expect: string | null = null;
  asked: string[] = [];
  leadKey = newKey();
  usedVoice = false;
  sample = false;
  constructor(public locale: Locale) {}

  reset(locale: Locale = this.locale) {
    this.locale = locale;
    this.messages = []; this.draft = emptyDraft(); this.expect = null; this.asked = [];
    this.leadKey = newKey(); this.usedVoice = false; this.sample = false;
  }
  get started() { return this.messages.some((m) => m.role === 'user'); }

  greeting() {
    const g = STR[this.locale].a.greeting as string;
    this.messages.push({ role: 'assistant', text: g });
    return g;
  }

  /** The customer said something. */
  send(text: string) {
    this.messages.push({ role: 'user', text: text.slice(0, 600) });
    return this.request();
  }

  /** Re-send the last turn after a failure (the customer's words are kept). */
  async request(): Promise<TurnResult> {
    if (!navigator.onLine) return { ok: false, kind: 'offline' };
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20_000);
    try {
      const res = await fetch('/api/assistant/turn', {
        method: 'POST', headers: { 'content-type': 'application/json' }, signal: ctrl.signal,
        body: JSON.stringify({ locale: this.locale, messages: this.messages.slice(-60), draft: this.draft, expect: this.expect, asked: this.asked }),
      });
      const out = await res.json().catch(() => null);
      if (!res.ok || !out?.ok || typeof out.reply !== 'string') return { ok: false, kind: navigator.onLine ? 'api' : 'offline' };
      const localeChanged = out.locale !== this.locale;
      this.locale = out.locale; this.draft = out.draft; this.expect = out.expect; this.asked = out.asked;
      this.messages.push({ role: 'assistant', text: out.reply });
      return { ok: true, reply: out.reply, ready: !!out.ready, handoff: !!out.handoff, localeChanged };
    } catch {
      return { ok: false, kind: navigator.onLine ? 'api' : 'offline' };
    } finally {
      clearTimeout(timer);
    }
  }
}

// ── speech out ─────────────────────────────────────────────────────────────
const synth: SpeechSynthesis | undefined = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : undefined;
export const canSpeak = () => !!synth;
let speakToken = 0;
synth?.getVoices(); // some browsers load the voice list lazily

function pickVoice(locale: Locale): SpeechSynthesisVoice | undefined {
  const want = STR[locale].speech.toLowerCase();
  const voices = synth?.getVoices() ?? [];
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
  return voices.find((v) => norm(v) === want && v.localService) ?? voices.find((v) => norm(v) === want) ?? voices.find((v) => norm(v).startsWith(want.slice(0, 2)));
}

export function stopSpeaking() {
  speakToken++;
  try { synth?.cancel(); } catch { /* ignore */ }
}

/** Read text aloud; resolves when finished, interrupted, unavailable or muted. */
export function speak(text: string, locale: Locale, muted = false): Promise<void> {
  if (muted || !synth) return Promise.resolve();
  stopSpeaking();
  const token = ++speakToken;
  return new Promise((resolve) => {
    let finished = false;
    const finish = () => { if (finished) return; finished = true; clearTimeout(watchdog); clearInterval(poll); resolve(); };
    // Short utterances: long ones are cut off after ~15 s in Chromium.
    const parts = text.match(/[^.!?…]+[.!?…]*\s*/g)?.map((p) => p.trim()).filter(Boolean) ?? [text];
    const voice = pickVoice(locale);
    parts.forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = STR[locale].speech;
      if (voice) u.voice = voice;
      u.rate = 1.03;
      if (i === parts.length - 1) { u.onend = finish; u.onerror = finish; }
      synth.speak(u);
    });
    // Interrupted by stopSpeaking(), or a browser that never fires onend: never leave anyone stuck.
    const poll = setInterval(() => { if (token !== speakToken) finish(); }, 120);
    const watchdog = setTimeout(finish, Math.min(60_000, 2500 + text.length * 95));
  });
}

// ── speech in ──────────────────────────────────────────────────────────────
export const SR: any = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : undefined;
export const canListen = () => !!SR;
let active: any = null;
/** Pause after speech that ends the customer's turn. */
const silenceMs = () => (window as any).__silenceMs ?? 1300;

export interface ListenHandlers {
  onStart?(): void;
  onInterim?(text: string): void;
  onFinal(text: string): void;
  onSilence?(): void;
  onError?(kind: 'denied' | 'nomic' | 'network' | 'other'): void;
}

export function stopListening() {
  const r = active;
  active = null;
  try { r?.abort(); } catch { /* ignore */ }
}

/**
 * Listen for one turn, hands-free: the turn ends after a short pause in speech, so the
 * customer never has to press anything to send. Returns false if listening could not start.
 */
export function listen(locale: Locale, h: ListenHandlers): boolean {
  stopListening();
  if (!SR) return false;
  const r = new SR();
  active = r;
  r.lang = STR[locale].speech;
  r.interimResults = true;
  r.continuous = true;
  r.maxAlternatives = 1;
  let finalText = '', interim = '', done = false, timer: any = 0;
  const maxTimer = setTimeout(() => finish(true), 25_000);
  const finish = (deliver: boolean) => {
    if (done) return;
    done = true;
    clearTimeout(timer); clearTimeout(maxTimer);
    if (active === r) active = null;
    try { r.stop(); } catch { /* ignore */ }
    const text = `${finalText} ${interim}`.replace(/\s+/g, ' ').trim();
    if (!deliver) return;
    text ? h.onFinal(text) : h.onSilence?.();
  };
  const fail = (kind: 'denied' | 'nomic' | 'network' | 'other') => {
    if (done) return;
    done = true;
    clearTimeout(timer); clearTimeout(maxTimer);
    if (active === r) active = null;
    h.onError?.(kind);
  };
  const arm = (ms: number) => { clearTimeout(timer); timer = setTimeout(() => finish(true), ms); };
  r.onstart = () => { h.onStart?.(); arm(9000); };
  r.onresult = (e: any) => {
    if (done) return;
    interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalText += ` ${t}`; else interim += t;
    }
    h.onInterim?.(`${finalText} ${interim}`.replace(/\s+/g, ' ').trim());
    arm(silenceMs());
  };
  r.onerror = (e: any) => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') fail('denied');
    else if (e.error === 'audio-capture') fail('nomic');
    else if (e.error === 'network') fail('network');
    else if (e.error === 'no-speech') finish(true);
    // 'aborted' is our own stop
  };
  r.onend = () => { if (active === r || !done) finish(true); };
  try { r.start(); } catch { active = null; done = true; clearTimeout(maxTimer); return false; }
  return true;
}

/** Start recognition inside the tap, so the browser asks for the microphone right away. */
export function primeMicrophone(locale: Locale): Promise<'granted' | 'denied' | 'unavailable'> {
  if (!SR) return Promise.resolve('unavailable');
  return new Promise((resolve) => {
    let settled = false;
    const settle = (v: 'granted' | 'denied' | 'unavailable') => { if (settled) return; settled = true; stopListening(); resolve(v); };
    const ok = listen(locale, {
      onStart: () => settle('granted'),
      onFinal: () => settle('granted'),
      onSilence: () => settle('granted'),
      onError: (k) => settle(k === 'denied' ? 'denied' : k === 'nomic' ? 'unavailable' : 'granted'),
    });
    if (!ok) settle('unavailable');
    setTimeout(() => settle('granted'), 8000); // a slow permission prompt: carry on and let the next listen report
  });
}

// ── human contact, review card ─────────────────────────────────────────────
export function humanOptions(locale: Locale, onLeave: () => void) {
  const s = STR[locale];
  const box = el('div', 'human-opts');
  box.append(link(s.call, 'btn--primary', SITE.tel), link(s.whatsapp, 'btn--ghost', SITE.whatsapp, true));
  if (document.body.dataset.callbell) box.append(button(s.livechat, 'btn--ghost', () => { onLeave(); openLiveChat(); }));
  const form = link(s.form, 'btn--ghost', '#getaquote');
  form.addEventListener('click', onLeave);
  box.append(form);
  return box;
}

const fmtPhone = (p: string | null) => (p ? `(${p.slice(2, 5)}) ${p.slice(5, 8)}-${p.slice(8)}` : '');

/** The editable summary the customer confirms. Nothing is sent before they tap Send. */
export function buildReview(convo: Conversation, opts: { onSent(ref: string): void; onBack(): void; onLeave(): void; onStartReal?(): void }) {
  const locale = convo.locale, s = STR[locale].a, S = STR[locale];
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
  const d = convo.draft;
  card.append(field(s.fields.name, 'name', d.name ?? '', 'text', { autocomplete: 'name', maxlength: '120' }));
  const two = el('div', 'two');
  two.append(field(s.fields.phone, 'phone', fmtPhone(d.phone), 'tel', { autocomplete: 'tel', inputmode: 'tel', maxlength: '40' }), field(s.fields.email, 'email', d.email ?? '', 'email', { autocomplete: 'email', inputmode: 'email', maxlength: '254' }));
  card.append(two);
  const pf = el('div', 'field'), pl = el('label', undefined, s.fields.preferred), ps = el('select', 'input');
  ps.id = 'rv-preferred'; pl.htmlFor = ps.id; ps.name = 'preferred';
  for (const [v, label] of Object.entries(S.pref as Record<string, string>)) { const o = el('option', undefined, label); o.value = v; o.selected = v === (d.preferred ?? (d.phone ? 'phone' : 'email')); ps.append(o); }
  pf.append(pl, ps);
  card.append(pf);
  const cats = d.categories.map((c) => S.cats[c]).filter(Boolean).join(', ');
  if (cats) { const p = el('p'); p.append(el('strong', undefined, `${s.fields.category}: `), document.createTextNode(cats)); card.append(p); }
  const sf = el('div', 'field'), sl = el('label', undefined, s.fields.summary), st = el('textarea', 'input');
  st.id = 'rv-summary'; sl.htmlFor = st.id; st.name = 'summary'; st.rows = 3; st.maxLength = 600; st.value = d.summary;
  sf.append(sl, st);
  card.append(sf);
  const two2 = el('div', 'two');
  two2.append(field(s.fields.state, 'state', d.state ?? '', 'text', { maxlength: '40' }), field(s.fields.callback, 'callback', d.callback ?? '', 'text', { maxlength: '120' }));
  card.append(two2);
  const cl = el('label', 'consent'), cb = el('input');
  cb.type = 'checkbox'; cb.name = 'transcript';
  cl.append(cb, el('span', undefined, s.keepTranscript));
  const status = el('div'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');

  if (convo.sample) {
    // A sample call never reaches the team.
    const n = el('div', 'notice notice--info');
    n.append(el('strong', undefined, S.v.sampleEnd));
    card.append(n, button(S.v.startReal, 'btn--primary btn--block', () => opts.onStartReal?.()));
    return card;
  }
  const send = el('button', 'btn btn--primary btn--block', s.confirmSend); send.type = 'submit';
  card.append(cl, status, send, button(s.edit, 'btn--ghost btn--block', opts.onBack));

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

    send.disabled = true; send.textContent = s.sendingLead; status.textContent = '';
    const out = await sendLead({
      idempotencyKey: convo.leadKey, source: convo.usedVoice ? 'web_voice' : 'web_text', locale: convo.locale,
      name: val('name'), phone: val('phone') || null, email: val('email') || null, preferredContact: val('preferred') || null,
      line: d.line, categories: d.categories, state: val('state') || null, urgency: d.urgency, callbackTime: val('callback') || null,
      summary: val('summary'), transcriptConsent: cb.checked, transcript: cb.checked ? convo.messages.slice(-80) : null,
    });
    send.disabled = false; send.textContent = s.confirmSend;
    if (out.ok) return opts.onSent(out.reference);
    if (out.kind === 'invalid') {
      out.fields.forEach((f) => { const n = card.querySelector<HTMLElement>(`[data-err="${f === 'contact' ? 'phone' : f}"]`); if (n) { n.textContent = inv[f] ?? ''; n.hidden = false; } });
      return;
    }
    // Honest failure: say plainly that nothing was received, and keep every way to reach a person in view.
    const n = el('div', 'notice');
    n.append(el('strong', undefined, s.sendFailed), humanOptions(convo.locale, opts.onLeave));
    status.replaceChildren(n);
  });
  return card;
}

/** The confirmation shown once the server has stored the lead. */
export function sentCard(locale: Locale, reference: string) {
  const s = STR[locale].a;
  const card = el('div', 'notice notice--ok');
  card.setAttribute('tabindex', '-1');
  card.append(el('strong', undefined, s.sentTitle), el('span', undefined, `${s.sentBody} `), el('span', 'ref', reference), el('p', undefined, s.sentHours));
  (window as any).dataLayer?.push({ event: 'lead_submitted' }); // no customer data
  return card;
}
