/**
 * SITE COPY for Rouge. Every block is read from site.mjs (the copy shared by all four previews)
 * and only re-shaped here. Rule kept from the source build: no invented facts, numbers,
 * credentials, prices, reviews or process. Where a line is our own framing (a section label)
 * it says nothing about her.
 */
import { SM, SITE, L, LINKS } from '../consts';
export { SITE, L, LINKS };

export const PHOTOS = SM.PHOTOS as Record<string, { w: number; h: number; pos: string; alt: string }>;
export const FILMS = SM.FILMS as Record<string, { n: number; file: string | null; label: string; title: string; pos: string; alt: string }>;
export const LOOKS = SM.LOOKS as { photo: string; cats: string[]; cap: string }[];
export const HERO_C = SM.HERO;
export const INTRO = SM.INTRO;
export const WORK_C = SM.WORK;
export const PATHS = SM.PATHS as { key: string; kicker: string; title: string; plate: string; body: string; points: string[]; cta: string; note: string }[];
export const FINAL = SM.FINAL;
export const PORTFOLIO_PAGE = SM.PORTFOLIO_PAGE;
export const BRIDAL_C = SM.BRIDAL;
export const SERVICES_C = SM.SERVICES;
export const ABOUT = SM.ABOUT;
export const INQUIRY = SM.INQUIRY;
export const FOOTER = SM.FOOTER;

/** The caption of a photograph, from LOOKS (e.g. "Bridal · Glam waves"). */
export const capOf = (photo: string) => LOOKS.find((l) => l.photo === photo)?.cap ?? '';

/** The opening: her photographs, changing slowly. Both leads are shot on dark grounds. */
export const HERO = {
  eyebrow: INTRO.values as string[],
  lines: [SM.WORK.heading[0], 'real'],
  italic: 'glam.',
  sub: SM.HERO.line as string,
  cta: SM.HERO.cta as string,
  second: SM.HERO.second as string,
  loc: `${SITE.name} · ${SITE.area} · ${SITE.handle}`,
  slides: ['bride-crystal', 'bride-ruby', 'glam-sculpt', 'bride-gold-waves', 'waves-blonde', 'bride-pearls'],
};

/** Portfolio items. A photo carries her alt text from PHOTOS; a film is a slot until its file exists. */
export type WorkItem = { kind: 'photo'; plate: string; span?: string } | { kind: 'film'; film: string; span?: string };
const toItem = (x: { photo?: string; film?: string; span?: string }): WorkItem =>
  x.film ? { kind: 'film', film: x.film, span: x.span } : { kind: 'photo', plate: x.photo as string, span: x.span };

export const PORTFOLIO = (SM.PORTFOLIO as { id: string; title: string; line: string; items: { photo?: string; film?: string; span?: string }[] }[])
  .map((g) => ({ id: g.id, title: g.title, line: g.line, items: g.items.map(toItem) }));
export const FEATURED: WorkItem[] = (SM.FEATURED as { photo?: string; film?: string }[]).map(toItem);

/** Services: the markdown files hold only order and numeral; the words come from SERVICES. */
type Svc = { id: string; title: string; plate: string; film?: string; summary: string; points: string[]; group: string; path: string };
export const SERVICE_BY_ID: Record<string, Svc> = Object.fromEntries(
  (SM.SERVICES.groups as { id: string; path: string; items: Omit<Svc, 'group' | 'path'>[] }[])
    .flatMap((g) => g.items.map((s) => [s.id, { ...s, group: g.id, path: g.path }])),
);

export const SECTION_LABELS = {
  work: WORK_C.label as string,
  services: SERVICES_C.kick as string,
  how: SERVICES_C.slateHow as string,
  follow: 'Follow along',
  bridal: BRIDAL_C.kick as string,
};
