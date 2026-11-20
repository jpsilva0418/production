/** The three directions under review (see src/styles/palettes.css). In the review build every
 *  page follows the direction chosen on /preview/<id> (remembered in localStorage). A
 *  client-demo build (DEMO_PALETTE=a|b|c) is locked to one. */
export const PALETTES = [
  { id: 'a', name: 'Noir Studio', line: 'Black, cream and gold — her studio, her price list, her Linktree.' },
  { id: 'b', name: 'Blush Noir', line: 'Soft blush grounds, black type and a rose-gold accent — feminine, still sharp.' },
  { id: 'c', name: 'Nude Espresso', line: 'Warm nude, espresso and caramel — skin tones, close to the work itself.' },
] as const;
export type PaletteId = (typeof PALETTES)[number]['id'];
export const DEFAULT_PALETTE: PaletteId = 'a';

const envLock = (import.meta.env.DEMO_PALETTE || process.env.DEMO_PALETTE || '').toLowerCase();
/** The palette a client-demo build is locked to, or null in the review build. */
export const LOCKED_PALETTE: PaletteId | null = (['a', 'b', 'c'] as const).find((p) => p === envLock) ?? null;
