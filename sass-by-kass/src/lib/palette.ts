/** The three blue directions under review (see src/styles/palettes.css). In the review
 *  build every page follows the direction chosen on /preview/<id> (remembered in
 *  localStorage). A client-demo build (DEMO_PALETTE=a|b|c) is locked to one. */
export const PALETTES = [
  { id: 'a', name: 'Deep Navy', line: 'Rich navy, white, cool neutrals and a silver accent — editorial luxury.' },
  { id: 'b', name: 'Modern Royal', line: 'A fashion-forward cobalt, crisp white and cool grey — energetic, still premium.' },
  { id: 'c', name: 'Soft Blue', line: 'Dusty ice-blue, warm white and muted navy text — refined and feminine.' },
] as const;
export type PaletteId = (typeof PALETTES)[number]['id'];
export const DEFAULT_PALETTE: PaletteId = 'a';

const envLock = (import.meta.env.DEMO_PALETTE || process.env.DEMO_PALETTE || '').toLowerCase();
/** The palette a client-demo build is locked to, or null in the review build. */
export const LOCKED_PALETTE: PaletteId | null = (['a', 'b', 'c'] as const).find((p) => p === envLock) ?? null;
