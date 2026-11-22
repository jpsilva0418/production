import { z } from 'zod';
import type { Config } from '../config';
import { CATEGORIES, clean, normalizeEmail, normalizePhone } from '../leads/schema';
import { guidedTurn } from './guided';
import { llmTurn, type Parse } from './llm';
import type { TurnRequest, TurnResponse } from './types';

const FIELDS = ['need', 'name', 'contact', 'preferred', 'line', 'state', 'urgency', 'callback'] as const;
const str = (max: number) => z.string().max(max * 3).transform((s) => clean(s).slice(0, max));
const nstr = (max: number) => z.union([str(max), z.null()]).transform((v) => v || null);

const turnInput = z
  .object({
    locale: z.enum(['en', 'pt', 'es']),
    messages: z.array(z.object({ role: z.enum(['user', 'assistant']), text: str(700) }).strict()).min(1).max(60),
    draft: z
      .object({
        name: nstr(120), phone: nstr(40), email: nstr(254),
        preferred: z.enum(['phone', 'text', 'whatsapp', 'email']).nullable(),
        line: z.enum(['personal', 'commercial', 'unsure']).nullable(),
        categories: z.array(z.enum(CATEGORIES)).max(CATEGORIES.length),
        state: nstr(40),
        urgency: z.enum(['today', 'this_week', 'this_month', 'researching']).nullable(),
        callback: nstr(120),
        summary: str(600),
      })
      .strict(),
    expect: z.enum(FIELDS).nullable(),
    asked: z.array(z.enum(FIELDS)).max(FIELDS.length),
  })
  .strict();

export function parseTurn(raw: unknown): TurnRequest | null {
  const p = turnInput.safeParse(raw);
  if (!p.success) return null;
  const v = p.data;
  if (v.messages[v.messages.length - 1].role !== 'user') return null;
  // The browser holds the draft, so it is untrusted: contact fields are re-normalised on every turn.
  return { ...v, draft: { ...v.draft, phone: normalizePhone(v.draft.phone), email: normalizeEmail(v.draft.email) } } as TurnRequest;
}

export async function runTurn(req: TurnRequest, cfg: Config, parse?: Parse): Promise<TurnResponse> {
  if (cfg.anthropicKey || parse) return llmTurn(req, cfg, parse);
  return guidedTurn(req);
}
