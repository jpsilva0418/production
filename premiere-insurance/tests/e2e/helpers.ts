import { expect, type Page } from '@playwright/test';
import pg from 'pg';

export const db = new pg.Pool({ connectionString: process.env.E2E_DATABASE_URL, max: 2 });
export const resetDb = () => db.query('truncate lead_events, lead_deliveries, leads, rate_limits restart identity cascade');
export const leads = async () => (await db.query('select * from leads order by created_at')).rows;

/**
 * Stand-ins for the browser's speech services, so the voice state machine can be driven in CI.
 * This replaces the microphone and the loudspeaker only — the conversation, the API calls
 * and the database behind them are the real ones.
 *   window.__say(text)     the customer says something (final recognition result)
 *   window.__spoken        everything the assistant read aloud, with the language used
 */
export async function fakeSpeech(page: Page, opts: { mic?: 'ok' | 'deny' | 'none'; slowVoice?: boolean } = {}) {
  await page.addInitScript(({ mic, slowVoice }) => {
    const w = window as any;
    w.__spoken = [];
    w.__cancelled = 0;
    let pending: any[] = [];
    const synth = {
      speaking: false,
      getVoices: () => [{ lang: 'pt-BR', name: 'Luciana', localService: true }, { lang: 'en-US', name: 'Samantha', localService: true }, { lang: 'es-US', name: 'Paulina', localService: true }],
      speak(u: any) {
        w.__spoken.push({ text: u.text, lang: u.lang, voice: u.voice?.name });
        const t = setTimeout(() => u.onend?.({}), slowVoice ? 60_000 : 20);
        pending.push(t);
      },
      cancel() { w.__cancelled++; pending.forEach(clearTimeout); pending = []; },
      addEventListener() {},
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
    // The native utterance only accepts native voice objects; the stand-in voices need a plain one.
    w.SpeechSynthesisUtterance = class { text: string; lang = ''; voice: any = null; rate = 1; onend: any; onerror: any; constructor(t: string) { this.text = t; } };
    if (mic === 'none') { delete w.SpeechRecognition; delete w.webkitSpeechRecognition; return; }
    w.__silenceMs = 150;
    w.__starts = 0;
    class FakeRecognition {
      lang = ''; interimResults = false; continuous = false; maxAlternatives = 1;
      onstart: any; onresult: any; onerror: any; onend: any; live = false;
      start() {
        w.__recognition = this;
        w.__listenLang = this.lang;
        w.__starts++;
        setTimeout(() => {
          if (mic === 'deny') { this.onerror?.({ error: 'not-allowed' }); this.onend?.({}); return; }
          this.live = true;
          this.onstart?.({});
        }, 10);
      }
      stop() { if (!this.live) return; this.live = false; if (w.__recognition === this) w.__recognition = null; setTimeout(() => this.onend?.({}), 5); }
      abort() { this.live = false; if (w.__recognition === this) w.__recognition = null; }
    }
    w.SpeechRecognition = FakeRecognition;
    w.webkitSpeechRecognition = FakeRecognition;
    w.__say = (text: string) => {
      const r = w.__recognition;
      if (!r || !r.live) throw new Error('assistant is not listening');
      r.onresult?.({ resultIndex: 0, results: [Object.assign([{ transcript: text }], { isFinal: true })] });
    };
  }, { mic: opts.mic ?? 'ok', slowVoice: !!opts.slowVoice });
}

export const assistant = (page: Page) => page.locator('#assistant');
export const botSays = (page: Page, text: string | RegExp) => expect(assistant(page).locator('.msg--bot').last()).toContainText(text);
export const listening = (page: Page) => expect(assistant(page).locator('[data-a="mic"]')).toHaveAttribute('data-state', 'listening');
export const callListening = (page: Page) => expect(page.locator('[data-call-orb]')).toHaveAttribute('data-state', 'listening');

/** The customer speaks (panel). */
export async function say(page: Page, text: string) {
  await listening(page);
  await page.evaluate((t) => (window as any).__say(t), text);
  // The turn ends on the pause after speech; wait for it so the next line is a new turn.
  await expect(assistant(page).locator('[data-a="mic"]')).not.toHaveAttribute('data-state', 'listening');
}
/** The customer speaks (tap-and-talk call). */
export async function sayOnCall(page: Page, text: string) {
  await callListening(page);
  await page.evaluate((t) => (window as any).__say(t), text);
  await expect(page.locator('[data-call-orb]')).not.toHaveAttribute('data-state', 'listening');
}
export async function type(page: Page, text: string) {
  const input = assistant(page).locator('[data-a="input"]');
  await expect(assistant(page).locator('[data-a="mic"]')).not.toHaveAttribute('data-state', 'thinking');
  await input.fill(text);
  await input.press('Enter');
}
export async function staffInbox(page: Page) {
  await page.goto('/staff/leads');
  await page.getByLabel('Staff access code').fill('e2e-staff-code');
  await page.getByRole('button', { name: 'Open inbox' }).click();
  await expect(page.getByRole('heading', { name: 'Lead inbox' })).toBeVisible();
}
