// "B": tap once and talk (?voice=call).
import { expect, test } from '@playwright/test';
import { callListening, fakeSpeech, leads, resetDb, sayOnCall, staffInbox } from './helpers';

test.beforeEach(resetDb);
const orb = (page: any) => page.locator('[data-call-orb]');
const bot = (page: any) => page.locator('.call__bot');

test('the orb and English | Português are in the first screen on a phone', async ({ page }) => {
  await page.goto('/pt/home?voice=call');
  await expect(page.locator('.talk-card')).toBeHidden(); // only one voice entry point at a time
  const vh = page.viewportSize()!.height;
  for (const loc of [orb(page), page.getByRole('button', { name: 'English', exact: true }).first(), page.getByRole('button', { name: 'Português', exact: true }).first()]) {
    const box = (await loc.boundingBox())!;
    expect(box.y + box.height).toBeLessThan(vh - 60); // above the dock, no scrolling
  }
  await expect(page.locator('[data-call-lang="pt"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.call__note')).toContainText('não é uma agente licenciada');
});

test('one tap starts a hands-free call: no more taps until the details are confirmed', async ({ page }) => {
  await fakeSpeech(page);
  await page.goto('/?voice=call');
  await orb(page).click();
  await expect(bot(page)).toContainText('I’m an AI, not a licensed agent');
  await callListening(page);
  await expect(page.locator('[data-call-hint]')).toHaveText('Tap to end call');
  const startsBefore = await page.evaluate(() => (window as any).__starts);

  await sayOnCall(page, 'I need insurance for my car');
  await expect(bot(page)).toContainText('May I have your full name?');
  await sayOnCall(page, 'Maria Souza');
  await sayOnCall(page, 'my number is 978 555 0142');
  await expect(bot(page)).toContainText('(978) 555-0142');
  await sayOnCall(page, 'text is fine');
  await sayOnCall(page, 'Massachusetts');
  await sayOnCall(page, 'this week');
  await sayOnCall(page, 'after 3 pm');
  // It listened again by itself after every reply.
  expect(await page.evaluate(() => (window as any).__starts)).toBeGreaterThanOrEqual(startsBefore + 6);

  const sheet = page.locator('#call-review');
  await expect(sheet).toBeVisible();
  await expect(sheet.getByLabel('Name')).toHaveValue('Maria Souza');
  expect(await leads()).toHaveLength(0);
  await sheet.getByRole('button', { name: 'Send to the team' }).click();
  await expect(page.locator('[data-call-panel]')).toContainText('Your request was received');
  const ref = await page.locator('[data-call-panel] .ref').innerText();
  const [row] = await leads();
  expect(row).toMatchObject({ ref, source: 'web_voice', locale: 'en', queue: 'personal', phone: '+19785550142', preferred_contact: 'text', state: 'MA', urgency: 'this_week' });
  await staffInbox(page);
  await expect(page.locator(`tr[data-ref="${ref}"]`)).toContainText('Maria Souza');
});

test('Português chosen on screen: the call is in pt-BR from the first word', async ({ page }) => {
  await fakeSpeech(page);
  await page.goto('/?voice=call');
  await page.locator('[data-call-lang="pt"]').click();
  await expect(page.locator('[data-call-hint]')).toHaveText('Toque para falar');
  await orb(page).click();
  await expect(bot(page)).toContainText('assistente virtual da Premiere Insurance');
  await callListening(page);
  expect(await page.evaluate(() => (window as any).__listenLang)).toBe('pt-BR');
  expect(await page.evaluate(() => (window as any).__spoken[0].lang)).toBe('pt-BR');
  await sayOnCall(page, 'preciso de seguro para minha casa');
  await expect(bot(page)).toContainText('Qual é o seu nome completo?');
});

test('switching language mid-call, by voice or with the buttons', async ({ page }) => {
  await fakeSpeech(page);
  await page.goto('/?voice=call');
  await orb(page).click();
  await sayOnCall(page, 'I need home insurance');
  await expect(bot(page)).toContainText('May I have your full name?');
  await page.locator('[data-call-lang="pt"]').click();
  await expect(bot(page)).toContainText('Claro, podemos continuar em português.');
  await callListening(page);
  expect(await page.evaluate(() => (window as any).__listenLang)).toBe('pt-BR');
  await sayOnCall(page, 'in english please');
  await expect(bot(page)).toContainText('Sure, we can continue in English.');
  await expect(page.locator('[data-call-lang="en"]')).toHaveAttribute('aria-pressed', 'true');
});

test('tap while it speaks interrupts; tap while it listens ends the call', async ({ page }) => {
  await fakeSpeech(page, { slowVoice: true });
  await page.goto('/?voice=call');
  await orb(page).click();
  await expect(orb(page)).toHaveAttribute('data-state', 'speaking');
  await expect(page.locator('[data-call-hint]')).toHaveText('Tap to interrupt');
  await orb(page).click();
  await callListening(page);
  await orb(page).click();
  await expect(orb(page)).toHaveAttribute('data-state', 'idle');
  await expect(bot(page)).toContainText('Call ended. Nothing was sent.');
  expect(await leads()).toHaveLength(0);
});

test('no microphone in this browser or viewer: says so, plays a sample call, offers typing', async ({ page }) => {
  await fakeSpeech(page, { mic: 'none' });
  await page.goto('/?voice=call');
  await orb(page).click();
  const panel = page.locator('[data-call-panel]');
  await expect(panel).toContainText('Voice isn’t available here');
  await panel.getByRole('button', { name: 'Play a sample call' }).click();
  await expect(page.locator('.call__user')).toContainText('Customer (sample)');
  const sheet = page.locator('#call-review');
  await expect(sheet).toBeVisible({ timeout: 25_000 });
  await expect(sheet).toContainText('That was a sample call — nothing was sent to the team.');
  expect(await leads()).toHaveLength(0);
  await sheet.getByRole('button', { name: 'Close' }).click();
  await page.locator('[data-call-type]').click();
  await expect(page.locator('#assistant')).toBeVisible();
  await expect(page.locator('#assistant [data-a="input"]')).toBeFocused();
});

test('microphone refused: plain explanation and typing', async ({ page }) => {
  await fakeSpeech(page, { mic: 'deny' });
  await page.goto('/?voice=call');
  await orb(page).click();
  await expect(page.locator('[data-call-panel]')).toContainText('The microphone is blocked');
  await expect(orb(page)).toHaveAttribute('data-state', 'idle');
});

test('the dock’s AI button starts the call at the orb', async ({ page }) => {
  await fakeSpeech(page);
  await page.goto('/?voice=call');
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.locator('[data-dock]').getByRole('button', { name: 'AI assistant' }).click();
  await callListening(page);
  await expect(page.locator('#assistant')).toBeHidden();
});
