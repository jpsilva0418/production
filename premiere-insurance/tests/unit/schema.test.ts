import { describe, expect, it } from 'vitest';
import { queueFor, targetsFor } from '../../src/server/leads/routing';
import { normalizeEmail, normalizePhone, redactSensitive, validateLead } from '../../src/server/leads/schema';
import { cfg, lead } from './helpers';

describe('contact normalisation', () => {
  it('accepts the ways people write US numbers', () => {
    for (const p of ['(978) 555-0142', '978-555-0142', '978.555.0142', '+1 978 555 0142', '19785550142']) expect(normalizePhone(p)).toBe('+19785550142');
  });
  it('rejects numbers that cannot be dialled', () => {
    for (const p of ['555-0142', '123-456-7890', '978-155-0142', '97855501423', 'call me']) expect(normalizePhone(p)).toBeNull();
  });
  it('validates email', () => {
    expect(normalizeEmail(' Maria@Example.COM ')).toBe('maria@example.com');
    for (const e of ['maria@', 'maria example.com', 'a@b', 'x@y..com']) expect(normalizeEmail(e)).toBeNull();
  });
});

describe('lead validation', () => {
  it('accepts a complete lead and derives the line from the categories', () => {
    const r = validateLead(lead());
    expect(r.ok && r.lead.line).toBe('personal');
    expect(r.ok && r.lead.phone).toBe('+19785550142');
    const c = validateLead(lead({ categories: ['workers_comp', 'general_liability'] }));
    expect(c.ok && c.lead.line).toBe('commercial');
    const m = validateLead(lead({ categories: ['homeowners', 'commercial_auto'] }));
    expect(m.ok && m.lead.line).toBe('mixed');
    const u = validateLead(lead({ categories: [], line: 'commercial' }));
    expect(u.ok && u.lead.line).toBe('commercial');
  });
  it('needs a name and at least one way to reach the customer', () => {
    expect(validateLead(lead({ name: 'M' }))).toEqual({ ok: false, errors: ['name'] });
    expect(validateLead(lead({ phone: null, email: null }))).toEqual({ ok: false, errors: ['contact'] });
    expect(validateLead(lead({ phone: '12345', email: null }))).toEqual({ ok: false, errors: ['phone'] });
    expect(validateLead(lead({ email: 'nope', phone: null }))).toEqual({ ok: false, errors: ['email'] });
    expect(validateLead(lead({ email: null })).ok).toBe(true);
  });
  it('rejects unknown fields, unknown categories and oversized input', () => {
    expect(validateLead({ ...lead(), role: 'admin' }).ok).toBe(false);
    expect(validateLead(lead({ categories: ['crypto'] })).ok).toBe(false);
    expect(validateLead(lead({ summary: 'x'.repeat(6000) })).ok).toBe(false);
    expect(validateLead(lead({ queue: 'personal' })).ok).toBe(false);
  });
  it('strips line breaks so customer text cannot inject mail headers', () => {
    const r = validateLead(lead({ name: 'Maria\r\nBcc: attacker@example.com' }));
    expect(r.ok && r.lead.name).toBe('Maria Bcc: attacker@example.com');
  });
  it('removes SSN- and card-shaped numbers from the summary but keeps phone numbers', () => {
    const r = validateLead(lead({ summary: 'My SSN is 123-45-6789 and card 4111 1111 1111 1111, call 978-555-0142' }));
    expect(r.ok && r.lead.summary).not.toMatch(/6789|4111/);
    expect(r.ok && r.lead.summary).toContain('978-555-0142');
    expect(redactSensitive('nothing here').redacted).toBe(false);
  });
  it('keeps a transcript only with consent', () => {
    const t = [{ role: 'user', text: 'hello' }];
    expect((validateLead(lead({ transcript: t })) as any).lead.transcript).toBeNull();
    expect((validateLead(lead({ transcript: t, transcriptConsent: true })) as any).lead.transcript).toHaveLength(1);
  });
});

describe('routing', () => {
  it('sends personal and commercial inquiries to separate queues, everything else to general', () => {
    expect(queueFor({ line: 'personal', honeypot: false })).toBe('personal');
    expect(queueFor({ line: 'commercial', honeypot: false })).toBe('commercial');
    expect(queueFor({ line: 'mixed', honeypot: false })).toBe('general');
    expect(queueFor({ line: 'unsure', honeypot: false })).toBe('general');
    expect(queueFor({ line: 'personal', honeypot: true })).toBe('quarantine');
  });
  it('targets the reps configured for the queue and falls back to general', () => {
    expect(targetsFor('commercial', cfg())).toEqual([{ channel: 'inbox', target: 'commercial' }, { channel: 'email', target: 'commercial@example.com' }]);
    const noCommercial = cfg({ routes: { personal: [], commercial: [], general: ['office@example.com'] } });
    expect(targetsFor('commercial', noCommercial)[1]).toEqual({ channel: 'email', target: 'office@example.com' });
  });
  it('never emails quarantined leads, and uses the inbox alone when email is not configured', () => {
    expect(targetsFor('quarantine', cfg())).toEqual([{ channel: 'inbox', target: 'quarantine' }]);
    expect(targetsFor('personal', cfg({ resendKey: undefined }))).toEqual([{ channel: 'inbox', target: 'personal' }]);
  });
  it('adds the CRM endpoint when one is configured', () => {
    expect(targetsFor('personal', cfg({ crmWebhookUrl: 'https://crm.example.com/hooks/leads' })).at(-1)).toEqual({ channel: 'webhook', target: 'crm.example.com' });
  });
});
