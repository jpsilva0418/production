// The assistant's only source of facts: the business's own published pages.
// Anything not in here, the assistant must hand to a licensed agent.
import servicesJson from '../../content/services.json';
import { site, services } from '../../content/site';
import { dict } from '../../i18n';
import type { Locale } from './types';
import type { Category } from '../leads/schema';

type Page = { h1: string; summary: string; sections: { title: string }[] };
const pages = servicesJson as unknown as Record<string, Record<Locale, Page>>;

export function serviceFact(category: Category, locale: Locale): { name: string; summary: string } | null {
  const def = services.find((s) => s.category === category);
  if (!def) return null;
  const [name, card] = dict[locale].cards[def.slug];
  const page = pages[def.slug]?.[locale];
  return { name, summary: page?.summary || card };
}

export function serviceNames(locale: Locale, line: 'personal' | 'commercial') {
  return services.filter((s) => s.line === line).map((s) => dict[locale].cards[s.slug][0]);
}

export const officeLine = (id = 'chelmsford') => {
  const o = site.offices.find((x) => x.id === id)!;
  return `${o.street}, ${o.city}, ${o.state} ${o.zip}`;
};

/** Plain-text knowledge base for the language model, in the conversation's language. */
export function knowledgeBase(locale: Locale): string {
  const d = dict[locale];
  const lines = [
    `Business: ${site.agencyName} (${site.legalName}), an independent insurance agency serving customers since ${site.since}.`,
    `Phone: ${site.phone.display}. WhatsApp: same number. Hours: Monday to Friday, 9 AM to 5 PM (Eastern).`,
    `Offices: ${site.offices.map((o) => `${o.city} — ${o.street}, ${o.city}, ${o.state} ${o.zip}, phone ${o.phone}`).join('; ')}.`,
    `Documents: ${d.documents.body}`,
    `About: ${d.about.body}`,
    '',
    'Insurance offered (category id — name — published description):',
    ...services.map((s) => {
      const f = serviceFact(s.category as Category, locale)!;
      return `- ${s.category} (${s.line}) — ${f.name} — ${d.cards[s.slug][1]} ${f.summary}`;
    }),
  ];
  return lines.join('\n');
}
