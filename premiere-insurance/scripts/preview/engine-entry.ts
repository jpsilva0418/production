// Browser bundle used ONLY by the single-file HTML preview (scripts/preview/build.mjs).
// It runs the same guided conversation engine and the same lead validation as the server,
// in the page, because a standalone HTML file has no server to call.
import { guidedTurn } from '../../src/server/assistant/guided';
import { validateLead, normalizeEmail, normalizePhone } from '../../src/server/leads/schema';

(window as any).__previewEngine = {
  turn(req: any) {
    const draft = { ...req.draft, phone: normalizePhone(req.draft?.phone), email: normalizeEmail(req.draft?.email) };
    return guidedTurn({ ...req, draft });
  },
  validate: (raw: unknown) => validateLead(raw),
};
