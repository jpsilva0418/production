// Page behaviour: menu, language preference, contact sheet, background video, quote form.
// Everything here enhances a page that already works without JavaScript (links, tel:, WhatsApp).

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

// ── language preference ────────────────────────────────────────────────────
// The URL is the source of truth for language. The explicit choice is remembered so a
// returning visitor who opens the root URL lands on the language they picked.
const locale = document.body.dataset.locale ?? 'en';
$$<HTMLAnchorElement>('[data-set-lang]').forEach((a) =>
  a.addEventListener('click', () => {
    try {
      localStorage.setItem('pi-lang', a.dataset.setLang!);
      sessionStorage.setItem('pi-lang-ack', '1');
    } catch { /* private mode: the link still works */ }
  }),
);

// ── mobile menu ────────────────────────────────────────────────────────────
const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
const menu = $('#mobile-menu');
function setMenu(open: boolean) {
  if (!toggle || !menu) return;
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  $('[data-menu-label]', toggle)!.textContent = open ? toggle.dataset.labelClose! : toggle.dataset.labelOpen!;
  $('[data-menu-icon="open"]', toggle)!.hidden = open;
  $('[data-menu-icon="close"]', toggle)!.hidden = !open;
  document.documentElement.style.overflow = open ? 'hidden' : '';
}
toggle?.addEventListener('click', () => setMenu(!!menu!.hidden));
menu?.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && !menu.hidden) { setMenu(false); toggle?.focus(); } });
// Desktop dropdowns close when focus or a click leaves them.
document.addEventListener('click', (e) => $$<HTMLDetailsElement>('.nav details[open]').forEach((d) => { if (!d.contains(e.target as Node)) d.open = false; }));

// ── dialogs ────────────────────────────────────────────────────────────────
const reach = $<HTMLDialogElement>('#reach');
document.addEventListener('click', (e) => {
  const el = e.target as Element;
  if (el.closest('[data-open-reach]')) reach?.showModal();
  const closer = el.closest('[data-close-dialog]');
  if (closer) closer.closest('dialog')?.close();
  if (el.closest('[data-open-assistant]')) { reach?.close(); setMenu(false); }
  if (el.closest('[data-open-livechat]')) { reach?.close(); openLiveChat(); }
});
reach?.addEventListener('click', (e) => { if (e.target === reach) reach.close(); }); // backdrop

// ── existing live chat (Callbell), loaded only when a visitor asks for it ──
let callbellLoaded = false;
export function openLiveChat() {
  const raw = document.body.dataset.callbell;
  if (!raw) return false;
  const w = window as any;
  if (callbellLoaded) { w.Callbell?.open?.(); return true; }
  callbellLoaded = true;
  const cfg = JSON.parse(raw);
  w.callbellSettings = { uuid: cfg.uuid, script_token: cfg.scriptToken };
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://dash.callbell.eu/include/livechat/${cfg.scriptToken}/${cfg.uuid}.js`;
  s.onload = () => setTimeout(() => w.Callbell?.open?.(), 600);
  document.head.append(s);
  return true;
}

// ── background video: play only while visible, never with reduced motion or data saver ──
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator as any).connection?.saveData;
if (!calm && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      const v = en.target as HTMLVideoElement;
      if (en.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }
  }, { rootMargin: '200px' });
  $$<HTMLVideoElement>('video[data-autoplay]').forEach((v) => io.observe(v));
}

// ── quote form ─────────────────────────────────────────────────────────────
export const newKey = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`).replace(/[^A-Za-z0-9_-]/g, '');

export type SubmitOutcome = { ok: true; reference: string } | { ok: false; kind: 'invalid'; fields: string[] } | { ok: false; kind: 'offline' | 'rate' | 'unavailable' | 'error' };

/** Send a lead. Resolves ok only when the server confirms it stored the lead and returned a reference. */
export async function sendLead(payload: Record<string, unknown>): Promise<SubmitOutcome> {
  if (!navigator.onLine) return { ok: false, kind: 'offline' };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20_000);
  try {
    const res = await fetch('/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), signal: ctrl.signal });
    const body = await res.json().catch(() => null);
    if (res.ok && body?.ok === true && typeof body.reference === 'string') return { ok: true, reference: body.reference };
    if (res.status === 400 && body?.error === 'invalid') return { ok: false, kind: 'invalid', fields: body.fields ?? [] };
    if (res.status === 429) return { ok: false, kind: 'rate' };
    if (res.status === 503) return { ok: false, kind: 'unavailable' };
    return { ok: false, kind: 'error' };
  } catch {
    return { ok: false, kind: navigator.onLine ? 'error' : 'offline' };
  } finally {
    clearTimeout(timer);
  }
}

const digits = (s: string) => s.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');

$$<HTMLFormElement>('[data-lead-form]').forEach((form) => {
  const msg = JSON.parse(form.dataset.msg!);
  const status = $('[data-form-status]', form)!;
  const button = $<HTMLButtonElement>('button[type=submit]', form)!;
  // One key per filled-in form: a retry after a lost response can never create a second lead.
  let key = newKey();

  const setErr = (name: string, text: string | null) => {
    const el = $(`[data-err="${name}"]`, form);
    if (el) { el.textContent = text ?? ''; el.hidden = !text; }
    const input = form.elements.namedItem(name);
    if (input instanceof HTMLInputElement) input.setAttribute('aria-invalid', text ? 'true' : 'false');
  };
  const show = (kind: 'ok' | 'bad', html: string) => { status.innerHTML = `<div class="notice ${kind === 'ok' ? 'notice--ok' : ''}">${html}</div>`; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (button.disabled) return; // a second tap while the first is still in flight
    const fd = new FormData(form);
    const val = (k: string) => String(fd.get(k) ?? '').trim();
    ['name', 'phone', 'email', 'contact', 'categories'].forEach((k) => setErr(k, null));
    status.textContent = '';

    const errs: [string, string][] = [];
    if (val('name').length < 2) errs.push(['name', msg.invalid.name]);
    if (val('phone') && digits(val('phone')).length !== 10) errs.push(['phone', msg.invalid.phone]);
    if (val('email') && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(val('email'))) errs.push(['email', msg.invalid.email]);
    if (!val('phone') && !val('email')) errs.push(['contact', msg.invalid.contact]);
    if (!fd.getAll('categories').length) errs.push(['categories', msg.invalid.categories]);
    if (errs.length) {
      errs.forEach(([k, m]) => setErr(k, m));
      const first = errs[0][0] === 'contact' ? 'phone' : errs[0][0];
      (form.elements.namedItem(first) as HTMLElement | RadioNodeList | null as any)?.focus?.();
      if (errs[0][0] === 'categories') $<HTMLInputElement>('input[name=categories]', form)?.focus();
      return;
    }

    button.disabled = true;
    button.textContent = msg.sending;
    const out = await sendLead({
      idempotencyKey: key, source: 'form', locale: form.dataset.locale,
      name: val('name'), phone: val('phone') || null, email: val('email') || null,
      preferredContact: val('preferredContact') || null, categories: fd.getAll('categories'), state: val('state') || null,
      summary: val('summary'), details: { address: val('address') || null, city: val('city') || null, zip: val('zip') || null },
      smsConsent: fd.get('smsConsent') === 'on', company_website: val('company_website') || undefined,
    });
    button.disabled = false;
    button.textContent = msg.submit;

    if (out.ok) {
      // Success is shown only now: the server has stored the lead and given us its reference.
      const ref = document.createElement('span');
      ref.className = 'ref';
      ref.textContent = out.reference;
      show('ok', `<strong>${msg.successTitle}</strong>${msg.successBody} `);
      status.firstElementChild!.append(ref);
      form.reset();
      key = newKey();
      status.scrollIntoView({ block: 'center', behavior: 'smooth' });
      (window as any).dataLayer?.push({ event: 'lead_submitted', lead_source: 'form' }); // no customer data
      return;
    }
    if (out.kind === 'invalid') {
      out.fields.forEach((f) => setErr(f, msg.invalid[f] ?? msg.errorGeneric));
      if (!out.fields.some((f) => msg.invalid[f])) show('bad', msg.errorGeneric);
      return;
    }
    show('bad', out.kind === 'offline' ? msg.errorOffline : out.kind === 'rate' ? msg.errorRate : out.kind === 'unavailable' ? msg.errorUnavailable : msg.errorGeneric);
  });
});

export { locale };
