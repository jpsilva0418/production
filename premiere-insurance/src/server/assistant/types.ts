import type { Category } from '../leads/schema';

export type Locale = 'en' | 'pt' | 'es';
export type Field = 'need' | 'name' | 'contact' | 'preferred' | 'line' | 'state' | 'urgency' | 'callback';

/** What the assistant has gathered so far. Held by the browser, re-validated by the server on every turn and at submission. */
export interface Draft {
  name: string | null;
  phone: string | null; // E.164
  email: string | null;
  preferred: 'phone' | 'text' | 'whatsapp' | 'email' | null;
  line: 'personal' | 'commercial' | 'unsure' | null;
  categories: Category[];
  state: string | null;
  urgency: 'today' | 'this_week' | 'this_month' | 'researching' | null;
  callback: string | null;
  summary: string;
}
export const emptyDraft = (): Draft => ({ name: null, phone: null, email: null, preferred: null, line: null, categories: [], state: null, urgency: null, callback: null, summary: '' });

export interface TurnRequest {
  locale: Locale;
  messages: { role: 'user' | 'assistant'; text: string }[];
  draft: Draft;
  expect: Field | null;
  asked: Field[];
}
export interface TurnResponse {
  reply: string;
  locale: Locale;
  draft: Draft;
  expect: Field | null;
  asked: Field[];
  /** every required detail is present: the browser shows the review card */
  ready: boolean;
  /** the customer asked for a person: the browser shows the human contact options */
  handoff: boolean;
  engine: 'guided' | 'llm';
}

export const isReady = (d: Draft) => !!d.name && (!!d.phone || !!d.email) && (d.categories.length > 0 || d.summary.length > 0);
