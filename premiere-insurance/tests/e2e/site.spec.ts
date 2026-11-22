import { expect, test } from '@playwright/test';
import { createHmac } from 'node:crypto';
import { db, leads, resetDb, staffInbox } from './helpers';

test.beforeEach(resetDb);

const SLUGS = ['life-insurance', 'homeowners', 'personal-auto', 'recreational-vehicle-insurance', 'commercial-auto', 'general-liability', 'workers-compensation', 'commercial-property', 'inland-marine', 'umbrella', 'privacy-policy'];

test.describe('language', () => {
  test('Português | English is in the header without opening the menu, and switches the whole page', async ({ page }) => {
    await page.goto('/');
    const sw = page.getByRole('group', { name: 'Language' });
    await expect(sw).toBeVisible();
    await expect(sw.getByRole('link')).toHaveText(['Português', 'English']);
    await expect(sw.getByRole('link', { name: 'English' })).toHaveAttribute('aria-current', 'true');
    const box = await sw.boundingBox();
    expect(box!.y).toBeLessThan(64); // in the top bar itself

    await sw.getByRole('link', { name: 'Português' }).click();
    await expect(page).toHaveURL(/\/pt\/home$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Premiere Insurance');
    await expect(page.locator('.hero__tagline')).toHaveText('Cuidamos do que importa para você.');
    await expect(page.getByRole('heading', { name: 'Fale com nossa assistente de IA' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Quem nós somos' })).toBeVisible();
    await expect(page.getByLabel('Nome completo')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar solicitação' })).toBeVisible();
    await expect(page.locator('.consent')).toContainText('Ao marcar esta caixa');
    // No English interface copy left behind on the Portuguese page.
    const text = await page.locator('main').innerText();
    for (const en of ['Full name', 'Submit inquiry', 'Come visit us', 'Learn more', 'Talk to our AI assistant', 'Phone number', 'Who we are']) expect(text.toLowerCase()).not.toContain(en.toLowerCase());
  });

  test('remembers the chosen language on return, and never traps the visitor in it', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('group', { name: 'Language' }).getByRole('link', { name: 'Português' }).click();
    await expect(page).toHaveURL(/\/pt\/home$/);
    // A later visit to the root (new tab = new session) lands on Portuguese.
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('/');
    await expect(page).toHaveURL(/\/pt\/home$/);
    // Choosing English sticks: no bouncing back.
    await page.getByRole('group', { name: 'Idioma' }).getByRole('link', { name: 'English' }).click();
    await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
  });

  test('a first-time visitor is never redirected', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  });

  test('the switch keeps you on the same page, and Spanish is still reachable', async ({ page }) => {
    await page.goto('/en/workers-compensation');
    await page.getByRole('group', { name: 'Language' }).getByRole('link', { name: 'Português' }).click();
    await expect(page).toHaveURL(/\/pt\/workers-compensation$/);
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.locator('#mobile-menu').getByRole('link', { name: 'Español' }).click();
    await expect(page).toHaveURL(/\/es\/workers-compensation$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-US');
    await expect(page.getByLabel('Nombre completo')).toBeVisible();
  });
});

test.describe('nothing that worked on the live site is lost', () => {
  test('every live URL still resolves in all three languages, with hreflang alternates', async ({ request }) => {
    for (const path of ['/', '/pt/home', '/es/home', ...['en', 'pt', 'es'].flatMap((l) => SLUGS.map((s) => `/${l}/${s}`))]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
      const html = await res.text();
      expect(html, path).toContain('hreflang="pt"');
      expect(html, path).toContain('rel="canonical"');
    }
  });
  test('phone, WhatsApp, both offices, the map and the carriers are all present', async ({ page }) => {
    await page.goto('/en/personal-auto');
    await expect(page.locator('a[href="tel:+19782210139"]').first()).toBeAttached();
    await expect(page.locator('a[href="https://wa.me/19782210139"]').first()).toBeAttached();
    await expect(page.getByText('Summer St, Unit 19, Chelmsford, MA 01824').first()).toBeVisible();
    await expect(page.getByText('116 Union St, Clinton, MA 01510')).toBeVisible();
    await expect(page.locator('iframe.map')).toHaveAttribute('src', /google\.com\/maps\/embed/);
    await expect(page.locator('.carriers img')).toHaveCount(17);
    await expect(page.getByRole('heading', { name: 'Factors Affecting Your Auto Insurance Premiums' })).toBeVisible();
  });
  test('the menu lists the same personal and commercial lines as the live navigation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).click();
    const menu = page.locator('#mobile-menu');
    for (const label of ['Life Insurance', 'Homeowners | Renters', 'Auto | Motorcycle | Trailer', 'Boat | PWC | Snowmobile', 'Commercial Auto', 'Businessowner | General Liability', "Workers' Compensation", 'Commercial Property', 'Inland Marine', 'Umbrella']) await expect(menu.getByRole('link', { name: label, exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  });
  test('desktop header shows navigation, the language switch and the call button together @desktop', async ({ page }) => {
    await page.goto('/pt/home');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Idioma' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Ligar \(978\) 221-0139/ }).first()).toBeVisible();
    await page.getByText('Seguros Comerciais').first().click();
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Seguro de Propriedade Comercial' })).toBeVisible();
  });
});

test.describe('a person is always one tap away', () => {
  test('the dock keeps Call, the AI assistant and every other channel in reach', async ({ page }) => {
    await page.goto('/pt/home');
    const dock = page.locator('[data-dock]');
    await expect(dock.getByRole('link', { name: 'Ligar' })).toHaveAttribute('href', 'tel:+19782210139');
    await dock.getByRole('button', { name: 'Opções de contato' }).click();
    const sheet = page.locator('#reach');
    await expect(sheet.getByRole('link', { name: /WhatsApp com um especialista/ })).toHaveAttribute('href', 'https://wa.me/19782210139');
    await expect(sheet.getByRole('link', { name: /Ligar \(978\) 221-0139/ })).toBeVisible();
    await expect(sheet.getByRole('button', { name: /Fale com nossa assistente de IA/ })).toBeVisible();
    // Only one chat product is on the page: the old widget is not auto-loaded next to the assistant.
    expect(await page.locator('script[src*="callbell"]').count()).toBe(0);
    await sheet.getByRole('link', { name: /Pedir uma cotação/ }).click();
    await expect(sheet).toBeHidden();
  });
});

test.describe('quote form', () => {
  const fill = async (page: any) => {
    await page.getByLabel('Full name').fill('Maria Souza');
    await page.getByLabel('Phone number').fill('(978) 555-0142');
    await page.getByLabel('Email').fill('maria@example.com');
    await page.getByLabel('Workers Compensation').check();
  };

  test('explains what is missing, in place, without sending anything', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Submit inquiry' }).click();
    await expect(page.getByText('Enter your full name.')).toBeVisible();
    await expect(page.getByText('Enter a phone number or an email so we can reach you.')).toBeVisible();
    await expect(page.getByText('Choose at least one type of policy.')).toBeVisible();
    await page.getByLabel('Full name').fill('Maria Souza');
    await page.getByLabel('Phone number').fill('12345');
    await page.getByRole('button', { name: 'Submit inquiry' }).click();
    await expect(page.getByText('Enter a 10-digit US phone number.')).toBeVisible();
    expect(await leads()).toHaveLength(0);
  });

  test('shows a reference only after the lead is stored, routed to the commercial queue', async ({ page }) => {
    await page.goto('/');
    await fill(page);
    await page.getByLabel(/Anything we should know/).fill('Cleaning company with 6 employees.');
    await page.getByRole('button', { name: 'Submit inquiry' }).click();
    await expect(page.getByText('Thank you! Your inquiry has been received.')).toBeVisible();
    const ref = await page.locator('[data-lead-form] .ref').innerText();
    const rows = await leads();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ ref, source: 'form', locale: 'en', queue: 'commercial', line: 'commercial', name: 'Maria Souza', phone: '+19785550142', email: 'maria@example.com', categories: ['workers_comp'], delivery_status: 'delivered' });
    await staffInbox(page);
    const row = page.locator(`tr[data-ref="${ref}"]`);
    await expect(row).toContainText('Maria Souza');
    await expect(row).toContainText('commercial');
    await expect(row).toContainText('Cleaning company with 6 employees.');
  });

  test('a service page pre-selects its own policy, in the page language', async ({ page }) => {
    await page.goto('/pt/workers-compensation');
    await expect(page.getByLabel('Workers Compensation')).toBeChecked();
    await page.getByLabel('Nome completo').fill('João da Silva');
    await page.getByLabel('E-mail').fill('joao@example.com');
    await page.getByRole('button', { name: 'Enviar solicitação' }).click();
    await expect(page.getByText('Obrigado! Recebemos sua solicitação.')).toBeVisible();
    expect((await leads())[0]).toMatchObject({ locale: 'pt', queue: 'commercial', name: 'João da Silva' });
  });

  test('never claims success when the server could not store the lead, and a retry does not duplicate', async ({ page }) => {
    await page.goto('/');
    await fill(page);
    let fail = true;
    await page.route('**/api/leads', (route) => (fail ? route.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false,"error":"unavailable"}' }) : route.continue()));
    await page.getByRole('button', { name: 'Submit inquiry' }).click();
    await expect(page.getByText(/Online inquiries are temporarily unavailable/)).toBeVisible();
    await expect(page.getByText('Thank you!')).toHaveCount(0);
    expect(await leads()).toHaveLength(0);
    await expect(page.getByLabel('Full name')).toHaveValue('Maria Souza'); // nothing the customer typed is lost
    fail = false;
    await page.getByRole('button', { name: 'Submit inquiry' }).click();
    await expect(page.getByText('Thank you! Your inquiry has been received.')).toBeVisible();
    expect(await leads()).toHaveLength(1);
  });

  test('a lost connection is reported honestly', async ({ page, context }) => {
    await page.goto('/');
    await fill(page);
    await context.setOffline(true);
    await page.getByRole('button', { name: 'Submit inquiry' }).click();
    await expect(page.getByText(/You appear to be offline\. Your inquiry was not sent/)).toBeVisible();
    await context.setOffline(false);
    expect(await leads()).toHaveLength(0);
  });

  test('a response that never arrives is not treated as success, and the resend is idempotent', async ({ page }) => {
    await page.goto('/');
    await fill(page);
    // The server stores the lead but the reply is lost on the way back.
    let drop = true;
    await page.route('**/api/leads', async (route) => { if (drop) { await route.fetch(); await route.abort('connectionreset'); } else await route.continue(); });
    await page.getByRole('button', { name: 'Submit inquiry' }).click();
    await expect(page.getByText(/We could not send your inquiry/)).toBeVisible();
    drop = false;
    await page.getByRole('button', { name: 'Submit inquiry' }).click();
    await expect(page.getByText('Thank you! Your inquiry has been received.')).toBeVisible();
    expect(await leads()).toHaveLength(1); // same key: one lead, not two
  });
});

test.describe('backend safety', () => {
  const body = (over = {}) => ({ idempotencyKey: `e2e-${Date.now()}-abcdefghij`, source: 'form', locale: 'en', name: 'Test Person', phone: '978-555-0100', categories: ['life'], ...over });

  test('refuses cross-site posts, oversized bodies, the wrong content type and forged sources', async ({ request }) => {
    expect((await request.post('/api/leads', { data: body(), headers: { origin: 'https://evil.example' } })).status()).toBe(403);
    expect((await request.post('/api/leads', { data: body({ summary: 'x'.repeat(60_000) }) })).status()).toBe(413);
    expect((await request.post('/api/leads', { data: 'name=x', headers: { 'content-type': 'text/plain' } })).status()).toBe(415);
    expect((await request.post('/api/leads', { data: body({ source: 'phone' }) })).status()).toBe(400);
    expect((await request.post('/api/leads', { data: body({ queue: 'personal', follow_up_status: 'closed' }) })).status()).toBe(400);
    expect(await leads()).toHaveLength(0);
  });

  test('rate-limits a single address', async ({ request }) => {
    const codes = [];
    for (let i = 0; i < 8; i++) codes.push((await request.post('/api/leads', { data: body({ idempotencyKey: `e2e-rate-${i}-abcdefghijkl`, phone: `978-555-01${20 + i}` }) })).status());
    expect(codes.filter((c) => c === 201)).toHaveLength(6);
    expect(codes.slice(6)).toEqual([429, 429]);
  });

  test('customer text is shown to staff as text, never executed', async ({ page, request }) => {
    const res = await request.post('/api/leads', { data: body({ name: '<img src=x onerror="window.__xss=1">', summary: '<script>window.__xss=1</script>' }) });
    expect(res.status()).toBe(201);
    await staffInbox(page);
    await expect(page.getByText('<img src=x onerror="window.__xss=1">')).toBeVisible();
    expect(await page.evaluate(() => (window as any).__xss)).toBeUndefined();
  });

  test('the inbox needs the staff code, and a wrong one is refused', async ({ page }) => {
    await request_seed();
    await page.goto('/staff/leads');
    await expect(page.locator('table')).toHaveCount(0);
    await page.getByLabel('Staff access code').fill('guess');
    await page.getByRole('button', { name: 'Open inbox' }).click();
    await expect(page.getByText('That code is not correct.')).toBeVisible();
    await expect(page.locator('table')).toHaveCount(0);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/);
    async function request_seed() { await page.request.post('/api/leads', { data: body() }); }
  });

  test('staff can record follow-up, and it is audited', async ({ page, request }) => {
    await request.post('/api/leads', { data: body() });
    await staffInbox(page);
    await page.locator('select[name=status]').selectOption('contacted');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('select[name=status]')).toHaveValue('contacted');
    const ev = (await db.query(`select type, actor from lead_events order by id`)).rows.map((e) => `${e.actor}:${e.type}`);
    expect(ev).toEqual(['system:lead_created', 'staff:inbox_login', 'staff:follow_up_changed']);
  });

  test('health reports configuration as booleans and leaks nothing', async ({ request }) => {
    const h = await (await request.get('/api/health')).json();
    expect(h).toMatchObject({ ok: true, leads: { database: true, emailDelivery: false, staffInbox: true }, assistant: { engine: 'guided' }, phoneIntake: true });
    expect(JSON.stringify(h)).not.toMatch(/e2e-|postgres|secret/);
  });

  test('the retry job is closed without its secret', async ({ request }) => {
    expect((await request.get('/api/cron/deliver')).status()).toBe(401);
    expect((await request.get('/api/cron/deliver', { headers: { authorization: 'Bearer e2e-cron' } })).status()).toBe(200);
  });
});

test.describe('phone intake adapter', () => {
  const call = { call_id: 'CA1234567890abcdef', language: 'pt', name: 'Carlos Lima', caller_number: '+1 508 555 0177', categories: ['commercial_auto'], summary: 'Tem duas vans para a empresa de pintura.', best_time: 'manhã', recording_consent: false, transcript: [{ role: 'user', text: 'oi' }] };
  const signed = (payload: unknown, secret = 'e2e-phone-secret', ts = Math.floor(Date.now() / 1000)) => {
    const raw = JSON.stringify(payload);
    return { data: raw, headers: { 'content-type': 'application/json', 'x-premiere-timestamp': String(ts), 'x-premiere-signature': 'sha256=' + createHmac('sha256', secret).update(`${ts}.${raw}`).digest('hex') } };
  };

  test('a signed call result becomes a lead in the same pipeline; a provider retry does not duplicate it', async ({ request }) => {
    const a = await request.post('/api/phone/lead', signed(call));
    expect(a.status()).toBe(201);
    const b = await request.post('/api/phone/lead', signed(call));
    expect(b.status()).toBe(200);
    expect((await b.json()).reference).toBe((await a.json()).reference);
    const rows = await leads();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ source: 'phone', locale: 'pt', queue: 'commercial', phone: '+15085550177', preferred_contact: 'phone', callback_time: 'manhã', transcript: null });
  });
  test('unsigned, wrongly signed and stale requests are refused', async ({ request }) => {
    expect((await request.post('/api/phone/lead', { data: call })).status()).toBe(401);
    expect((await request.post('/api/phone/lead', signed(call, 'wrong-secret'))).status()).toBe(401);
    expect((await request.post('/api/phone/lead', signed(call, 'e2e-phone-secret', Math.floor(Date.now() / 1000) - 3600))).status()).toBe(401);
    expect(await leads()).toHaveLength(0);
  });
  test('a transcript is stored only when the caller consented on the call', async ({ request }) => {
    await request.post('/api/phone/lead', signed({ ...call, call_id: 'CAconsent000000001', recording_consent: true }));
    expect((await leads())[0].transcript).toEqual([{ role: 'user', text: 'oi' }]);
  });
});
