/* ==========================================================================
   INTAKE — the canonical project inquiry.

   There is ONE inquiry system on this site. This module owns its fields,
   its labels, its validation and its option lists. Two surfaces render it:

     /contact    the general project inquiry
     /free-demo  the Website Project Planner — eight website-specific
                 questions, then these exact same fields at the end

   The planner is an EXTENSION of this intake, not a second contact system.
   Its final "Your details" step renders the fields defined here, validates
   with the function defined here, and submits through sendInquiry() in
   lib/inquiry.ts — the same single backend path as the contact page.

   If a field needs adding, renaming or reordering, it happens here once and
   both surfaces follow. Never add a field to only one of them.
   ========================================================================== */

/** "What do you need?" — the one list, used by both surfaces and by the
    service pages that preselect a value. */
export const NEED_OPTIONS = [
  'Website / Web Development',
  'Google Ads',
  'Meta / Facebook Ads',
  'Multiple Services',
  'Not Sure',
] as const;
export type Need = (typeof NEED_OPTIONS)[number];

export const BUDGET_OPTIONS = [
  'Not sure yet',
  'Under $2,000',
  '$2,000 – $5,000',
  '$5,000 – $10,000',
  'Over $10,000',
];

export const TIMELINE_OPTIONS = [
  'As soon as possible',
  'Within a month',
  '1–3 months',
  'Just planning ahead',
];

export interface IntakeValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  need: string;
  budget: string;
  timeline: string;
  message: string;
}

export const EMPTY_INTAKE: IntakeValues = {
  name: '', email: '', phone: '', company: '', website: '',
  need: '', budget: '', timeline: '', message: '',
};

export type FieldKind = 'text' | 'email' | 'tel' | 'url' | 'select' | 'textarea';
/** The HTML enumerated values, so templates type-check against the DOM. */
export type InputMode = 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

export interface IntakeField {
  key: keyof IntakeValues;
  label: string;
  kind: FieldKind;
  required: boolean;
  autocomplete?: string;
  inputmode?: InputMode;
  placeholder?: string;
  options?: readonly string[];
  /** Empty option text for selects. */
  empty?: string;
  /** Spans both columns in the two-column grid. */
  full?: boolean;
}

/** The canonical field set, in canonical order. */
export const INTAKE_FIELDS: IntakeField[] = [
  { key: 'name',    label: 'Name',             kind: 'text',  required: true,  autocomplete: 'name' },
  { key: 'email',   label: 'Email',            kind: 'email', required: true,  autocomplete: 'email', inputmode: 'email' },
  { key: 'company', label: 'Business name',    kind: 'text',  required: false, autocomplete: 'organization' },
  { key: 'phone',   label: 'Phone',            kind: 'tel',   required: false, autocomplete: 'tel', inputmode: 'tel' },
  { key: 'website', label: 'Existing website', kind: 'url',   required: false, inputmode: 'url', placeholder: 'yourbusiness.com', full: true },
  { key: 'need',    label: 'What do you need?', kind: 'select', required: true, options: NEED_OPTIONS, empty: 'Choose one', full: true },
  { key: 'budget',  label: 'Budget',           kind: 'select', required: false, options: BUDGET_OPTIONS, empty: 'Prefer not to say' },
  { key: 'timeline',label: 'Timeline',         kind: 'select', required: false, options: TIMELINE_OPTIONS, empty: 'Not decided' },
  { key: 'message', label: 'Project details',  kind: 'textarea', required: true, full: true,
    placeholder: 'What the business does, what is not working, and what you want to happen.' },
];

export interface IntakeOptions {
  /** Keys the surface fixes itself and does not render as an input.
      The planner presets `need`, because it only handles website projects. */
  preset?: (keyof IntakeValues)[];
  /** Keys whose `required` is relaxed. The planner's answers already carry
      the project detail, so its message field is optional. */
  optional?: (keyof IntakeValues)[];
}

/** One validator for both surfaces. Returns a key → message map; empty means
    valid. Messages are written to be read by a person, not a developer. */
export function validateIntake(
  v: Partial<IntakeValues>,
  opts: IntakeOptions = {},
): Partial<Record<keyof IntakeValues, string>> {
  const errs: Partial<Record<keyof IntakeValues, string>> = {};
  const preset = new Set(opts.preset ?? []);
  const optional = new Set(opts.optional ?? []);

  for (const f of INTAKE_FIELDS) {
    if (preset.has(f.key) || !f.required || optional.has(f.key)) continue;
    const val = (v[f.key] ?? '').toString().trim();
    if (!val) {
      errs[f.key] =
        f.key === 'name' ? 'Enter your name so I know who I am replying to.'
        : f.key === 'need' ? 'Pick the closest option. “Not Sure” is a real answer.'
        : f.key === 'message' ? 'A sentence or two is enough, but I need something to reply to.'
        : `${f.label} is needed.`;
    }
  }

  const email = (v.email ?? '').trim();
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errs.email = 'Enter an email address — it needs an @ and a domain.';
  } else if (!email && !preset.has('email') && !optional.has('email')) {
    errs.email = 'Enter an email address — it needs an @ and a domain.';
  }

  const msg = (v.message ?? '').trim();
  if (!errs.message && msg && msg.length < 10 && !optional.has('message')) {
    errs.message = 'A sentence or two is enough, but I need something to reply to.';
  }

  return errs;
}

/** Map a service slug or a URL hint to a NEED_OPTIONS value, so a service
    page's "Start a project" button arrives with the right option selected. */
export function needFromHint(hint: string | null | undefined): Need | '' {
  if (!hint) return '';
  const h = hint.toLowerCase().replace(/^#/, '');
  if (h.includes('google')) return 'Google Ads';
  if (h.includes('meta') || h.includes('facebook')) return 'Meta / Facebook Ads';
  if (h.includes('web') || h.includes('website') || h.includes('design')) return 'Website / Web Development';
  if (h.includes('multiple')) return 'Multiple Services';
  const exact = NEED_OPTIONS.find((o) => o.toLowerCase() === hint.toLowerCase());
  return exact ?? '';
}
