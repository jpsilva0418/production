import { z } from 'zod';

export const CATEGORIES = [
  'life', 'homeowners', 'personal_auto', 'recreational',
  'commercial_auto', 'general_liability', 'workers_comp', 'commercial_property', 'inland_marine', 'umbrella',
  'other',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const PERSONAL: Category[] = ['life', 'homeowners', 'personal_auto', 'recreational'];
// Umbrella is listed under "For Commercial" in the site navigation.
export const COMMERCIAL: Category[] = ['commercial_auto', 'general_liability', 'workers_comp', 'commercial_property', 'inland_marine', 'umbrella'];

export const SOURCES = ['web_voice', 'web_text', 'form', 'phone'] as const;
export const PREFERRED = ['phone', 'text', 'whatsapp', 'email'] as const;
export const URGENCY = ['today', 'this_week', 'this_month', 'researching'] as const;

// Strip control characters (incl. CR/LF, which would allow mail-header
// injection) and collapse whitespace. Customer text is untrusted everywhere.
export const clean = (s: string) => s.replace(new RegExp("[\\u0000-\\u001f\\u007f\\u200b-\\u200f\\u2028-\\u202e]", "g"), " ").replace(/\s+/g, " ").trim();

const text = (max: number) => z.string().max(max * 4).transform(clean).pipe(z.string().max(max));
const optText = (max: number) => text(max).nullish().transform((v) => (v ? v : null));

/** US numbers only: returns E.164 (+1XXXXXXXXXX) or null. */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let d = raw.replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  if (d.length !== 10) return null;
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(d)) return null;
  return `+1${d}`;
}
export function normalizeEmail(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const e = clean(raw).toLowerCase();
  return /^[a-z0-9._%+-]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(e) && e.length <= 254 ? e : null;
}

// Things the first-contact intake must never hold on to.
const SENSITIVE: [RegExp, string][] = [
  [/\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g, '[removed: looks like an SSN]'],
  [/\b(?:\d[ -]?){13,19}\b/g, '[removed: looks like a card number]'],
];
export function redactSensitive(s: string): { text: string; redacted: boolean } {
  let redacted = false;
  let out = s;
  for (const [re, label] of SENSITIVE) {
    out = out.replace(re, (m) => {
      // A 10/11-digit phone number is not a card number.
      const digits = m.replace(/\D/g, '');
      if (label.includes('card') && digits.length < 13) return m;
      redacted = true;
      return label;
    });
  }
  return { text: out, redacted };
}

export const leadInput = z
  .object({
    idempotencyKey: z.string().regex(/^[A-Za-z0-9_-]{16,80}$/),
    source: z.enum(SOURCES),
    locale: z.enum(['en', 'pt', 'es']),
    name: text(120).pipe(z.string().min(2)),
    phone: optText(40),
    email: optText(254),
    preferredContact: z.enum(PREFERRED).nullish().transform((v) => v ?? null),
    line: z.enum(['personal', 'commercial', 'unsure']).nullish().transform((v) => v ?? null),
    categories: z.array(z.enum(CATEGORIES)).max(CATEGORIES.length).default([]),
    state: optText(40),
    urgency: z.enum(URGENCY).nullish().transform((v) => v ?? null),
    callbackTime: optText(120),
    summary: text(1200).nullish().transform((v) => v ?? ''),
    details: z
      .object({ address: optText(200), city: optText(80), zip: optText(12) })
      .partial()
      .default({}),
    transcript: z
      .array(z.object({ role: z.enum(['user', 'assistant']), text: text(1200) }))
      .max(80)
      .nullish()
      .transform((v) => v ?? null),
    transcriptConsent: z.boolean().default(false),
    smsConsent: z.boolean().default(false),
    // Honeypot: real people never fill this in.
    company_website: z.string().max(200).optional(),
  })
  .strict();

export type LeadInputRaw = z.input<typeof leadInput>;

export interface ValidLead {
  idempotencyKey: string;
  source: (typeof SOURCES)[number];
  locale: 'en' | 'pt' | 'es';
  name: string;
  phone: string | null;
  email: string | null;
  preferredContact: (typeof PREFERRED)[number] | null;
  line: 'personal' | 'commercial' | 'mixed' | 'unsure';
  categories: Category[];
  state: string | null;
  urgency: (typeof URGENCY)[number] | null;
  callbackTime: string | null;
  summary: string;
  details: Record<string, string>;
  transcript: { role: 'user' | 'assistant'; text: string }[] | null;
  transcriptConsent: boolean;
  smsConsent: boolean;
  honeypot: boolean;
}

export type FieldError = 'name' | 'contact' | 'email' | 'phone' | 'categories' | 'payload';

export function deriveLine(categories: Category[], stated: 'personal' | 'commercial' | 'unsure' | null): ValidLead['line'] {
  const p = categories.some((c) => PERSONAL.includes(c));
  const c = categories.some((c2) => COMMERCIAL.includes(c2));
  if (p && c) return 'mixed';
  if (c) return 'commercial';
  if (p) return 'personal';
  return stated ?? 'unsure';
}

export function validateLead(raw: unknown): { ok: true; lead: ValidLead } | { ok: false; errors: FieldError[] } {
  const parsed = leadInput.safeParse(raw);
  if (!parsed.success) {
    const errs = new Set<FieldError>();
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? '');
      errs.add(k === 'name' ? 'name' : k === 'categories' ? 'categories' : 'payload');
    }
    return { ok: false, errors: [...errs] };
  }
  const v = parsed.data;
  const errors: FieldError[] = [];
  const phone = normalizePhone(v.phone);
  const email = normalizeEmail(v.email);
  if (v.phone && !phone) errors.push('phone');
  if (v.email && !email) errors.push('email');
  if (!phone && !email && !errors.length) errors.push('contact');
  if (errors.length) return { ok: false, errors };

  const categories = [...new Set(v.categories)] as Category[];
  const summary = redactSensitive(v.summary).text;
  const transcript = v.transcriptConsent && v.transcript ? v.transcript.map((m) => ({ role: m.role, text: redactSensitive(m.text).text })) : null;
  const details: Record<string, string> = {};
  for (const [k, val] of Object.entries(v.details ?? {})) if (val) details[k] = val;

  return {
    ok: true,
    lead: {
      idempotencyKey: v.idempotencyKey,
      source: v.source,
      locale: v.locale,
      name: v.name,
      phone,
      email,
      preferredContact: v.preferredContact,
      line: deriveLine(categories, v.line),
      categories,
      state: v.state,
      urgency: v.urgency,
      callbackTime: v.callbackTime,
      summary,
      details,
      transcript,
      transcriptConsent: !!transcript,
      smsConsent: v.smsConsent,
      honeypot: !!v.company_website,
    },
  };
}
