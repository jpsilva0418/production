// The guided engine: a deterministic conversation that works with no AI provider at all.
// It answers only from the published site content (kb.ts), gathers the intake fields
// one question at a time, and never quotes, promises or decides coverage.
// The language-model engine (llm.ts) falls back to this whenever the provider is
// unavailable, so the assistant always has a real, honest brain behind it.

import { normalizeEmail, normalizePhone, redactSensitive, clean, type Category } from '../leads/schema';
import { officeLine, serviceFact, serviceNames } from './kb';
import { isReady, type Draft, type Field, type Locale, type TurnRequest, type TurnResponse } from './types';

const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const has = (t: string, re: RegExp) => re.test(t);

// ── language ────────────────────────────────────────────────────────────────
export function detectLanguageSwitch(text: string, current: Locale): Locale | null {
  const t = fold(text);
  const want: [Locale, RegExp][] = [
    ['pt', /\b(portugues|portuguese|brasileiro|em portugues|fal[ae] portugues)\b/],
    ['en', /\b(english|ingles|in english|em ingles|en ingles)\b/],
    ['es', /\b(espanol|spanish|espanhol|en espanol|castellano)\b/],
  ];
  for (const [l, re] of want) if (l !== current && re.test(t)) return l;
  return null;
}

// ── entity extraction ───────────────────────────────────────────────────────
/** "maria at gmail dot com", "maria arroba gmail ponto com" -> maria@gmail.com */
export function extractEmail(text: string): string | null {
  const direct = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  if (direct) return normalizeEmail(direct[0].replace(/[.,;]+$/, ''));
  const spoken = fold(text)
    .replace(/\s+(at|arroba)\s+/g, '@')
    .replace(/\s+(dot|ponto|punto)\s+/g, '.')
    .replace(/\s+(underscore|underline|guion bajo)\s+/g, '_')
    .replace(/\s+(dash|hyphen|hifen|traco|guion)\s+/g, '-');
  // Only the token touching the @ is taken: guessing that earlier words belong to the address would invent one.
  const m = spoken.match(/([a-z0-9._%+-]+)@([a-z0-9-]+(?:\.[a-z0-9-]+)+)/);
  if (!m) return null;
  return normalizeEmail(`${m[1]}@${m[2]}`);
}

export function extractPhone(text: string): string | null {
  // Join digit groups the way people say or type them: "978 555 0142", "(978) 555-0142".
  const m = text.match(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/);
  if (m) return normalizePhone(m[0]);
  const digits = text.replace(/[^\d]/g, '');
  return digits.length === 10 || (digits.length === 11 && digits[0] === '1') ? normalizePhone(digits) : null;
}

const BUSINESS = /\b(business|company|commercial|contractor|llc|inc|corp|fleet|employees?|restaurant|store|shop|empresa|negocio|comercial|firma|companhia|compania|frota|flota|funcionarios|empleados|loja|tienda|restaurante|construction|construcao|construccion|cleaning|limpeza|limpieza|landscap\w*|trucking)\b/;
const PERSONAL_HINT = /\b(personal|pessoal|my family|minha familia|mi familia|for me|para mim|para mi|myself)\b/;

const CATEGORY_RULES: [Category, RegExp][] = [
  ['workers_comp', /\b(workers?'? ?comp\w*|work comp|compensacao d[eo]s? trabalhador\w*|compensacion laboral|acidente de trabalho|accidente de trabajo)\b/],
  ['general_liability', /\b(general liability|liability|businessowners?|business owners?|bop|responsabilidade civil|responsabilidad civil)\b/],
  ['commercial_property', /\b(commercial property|propriedade comercial|propiedad comercial|business property|imovel comercial)\b/],
  ['inland_marine', /\b(inland marine|marina interior|tools? (and|&) equipment|equipment in transit|ferramentas|herramientas|cargo|carga)\b/],
  ['umbrella', /\b(umbrella|guarda-?chuva|paraguas|excess liability)\b/],
  ['recreational', /\b(boats?|jet ?skis?|pwc|snowmobiles?|watercraft|barcos?|lanchas?|motoneves?|motos? de nieve|motos? aquaticas?)\b/],
  ['life', /\b(life insurance|life|seguro de vida|vida)\b/],
  ['homeowners', /\b(home ?owners?|home|house|renters?|condo|apartment|casa|residencial|imobiliario|inquilino|aluguel|apartamento|vivienda|hogar|alquiler)\b/],
  ['commercial_auto', /\b(commercial auto|commercial vehicles?|work (truck|van|vehicle)s?|trucks?|vans?|caminh\w+|camion\w*|camioneta de trabajo|veiculos? comerciais?|vehiculos? comerciales?|auto comercial)\b/],
  ['personal_auto', /\b(car|cars|auto|vehicle|motorcycle|trailer|carro|carros|veiculo|moto|motocicleta|coche|automovil|vehiculo)\b/],
];

export function extractCategories(text: string): Category[] {
  const t = fold(text);
  const out: Category[] = [];
  for (const [cat, re] of CATEGORY_RULES) if (re.test(t)) out.push(cat);
  const business = BUSINESS.test(t);
  // "auto for my company" is a commercial vehicle; "liability" already implies business.
  if (out.includes('personal_auto') && business && !PERSONAL_HINT.test(t)) {
    out.splice(out.indexOf('personal_auto'), 1);
    if (!out.includes('commercial_auto')) out.push('commercial_auto');
  }
  if (out.includes('commercial_auto') && out.includes('personal_auto') && !/\b(and|e|y|also|tambem|tambien)\b/.test(t)) out.splice(out.indexOf('personal_auto'), 1);
  if (out.includes('commercial_property') && out.includes('homeowners') && !/\b(home|house|casa|hogar)\b/.test(t)) out.splice(out.indexOf('homeowners'), 1);
  if (out.includes('life') && /\bvida\b/.test(t) && !/seguro de vida|life/.test(t) && out.length > 1) out.splice(out.indexOf('life'), 1);
  return out;
}

export function extractLine(text: string): 'personal' | 'commercial' | null {
  const t = fold(text);
  if (BUSINESS.test(t)) return 'commercial';
  if (PERSONAL_HINT.test(t)) return 'personal';
  return null;
}

const STATES: [string, RegExp][] = [
  ['MA', /\b(ma|mass|massachusetts)\b/], ['NH', /\b(nh|new hampshire|nova hampshire|nuevo hampshire)\b/],
  ['RI', /\b(ri|rhode island)\b/], ['CT', /\b(ct|connecticut)\b/], ['ME', /\b(maine)\b/], ['VT', /\b(vt|vermont)\b/],
  ['NY', /\b(ny|new york|nova york|nueva york)\b/], ['NJ', /\b(nj|new jersey|nova jersey|nueva jersey)\b/], ['FL', /\b(fl|florida)\b/],
];
export function extractState(text: string, expected: boolean): string | null {
  const t = fold(text);
  for (const [code, re] of STATES) if (re.test(t)) return code;
  if (!expected) return null;
  const c = clean(text).replace(/[.!]+$/, '');
  return c.length >= 2 && c.length <= 40 && !/\d/.test(c) ? c : null;
}

export function extractUrgency(text: string): Draft['urgency'] {
  const t = fold(text);
  if (/\b(today|right now|now|asap|urgent\w*|immediately|hoje|agora|ja|hoy|ahora|ya|cuanto antes|quanto antes)\b/.test(t)) return 'today';
  if (/\b(this week|tomorrow|few days|esta semana|amanha|manana|proximos dias)\b/.test(t)) return 'this_week';
  if (/\b(this month|next week|next month|couple of weeks|este mes|semana que vem|proxima semana|mes que vem|proximo mes)\b/.test(t)) return 'this_month';
  if (/\b(just looking|looking around|research\w*|no rush|not sure|shopping|comparing|so pesquisando|pesquisando|sem pressa|solo (estoy )?viendo|sin prisa|comparando|cotando)\b/.test(t)) return 'researching';
  return null;
}

export function extractPreferred(text: string): Draft['preferred'] {
  const t = fold(text);
  if (/\b(whats ?app|zap)\b/.test(t)) return 'whatsapp';
  if (/\b(text|sms|texto|mensagem|mensaje)\b/.test(t)) return 'text';
  if (/\b(e-?mail|correo)\b/.test(t)) return 'email';
  if (/\b(call|phone|ligar|ligacao|telefone|llamada|llamar|telefono)\b/.test(t)) return 'phone';
  return null;
}

const NAME_LEAD = /^(?:.*?\b(?:my name is|my name's|this is|i am|i'm|it's|name is|meu nome e|me chamo|eu sou|sou o|sou a|aqui e o|aqui e a|mi nombre es|me llamo|yo soy|soy)\b)\s*/i;
export function extractName(text: string, expected: boolean): string | null {
  const raw = clean(text).replace(/[.!,]+$/, '');
  const led = NAME_LEAD.test(fold(raw));
  if (!led && !expected) return null;
  // Work on the original (accented) text, cutting the lead-in by word count.
  let name = raw;
  if (led) {
    const lead = fold(raw).match(NAME_LEAD)![0];
    name = raw.slice(lead.length);
  }
  name = name.split(/\s+(?:and|e|y)\s+(?:i|eu|yo|my|meu|mi)\b|[,.;]/i)[0].trim();
  const words = name.split(/\s+/).filter(Boolean);
  if (!words.length || words.length > 5 || /\d|@/.test(name)) return null;
  if (!/^[\p{L}][\p{L}'’.-]*(\s+[\p{L}][\p{L}'’.-]*)*$/u.test(name)) return null;
  const STOP = /^(yes|no|sim|nao|si|ok|okay|hello|hi|ola|hola|quote|insurance|seguro)$/;
  if (words.length === 1 && STOP.test(fold(words[0]))) return null;
  const PARTICLE = /^(da|de|do|das|dos|del|la|las|los|e|y|van|von|di)$/;
  return words.map((w, i) => (w === w.toLowerCase() && !(i > 0 && PARTICLE.test(w)) ? w[0].toUpperCase() + w.slice(1) : w)).join(' ').slice(0, 120);
}

const YES = /^(yes|yeah|yep|sure|ok|okay|please|correct|right|sim|claro|pode|isso|certo|si|claro que si|por favor|dale|correcto)\b/;
const NO = /^(no|nope|nah|not now|no thanks|nao|agora nao|nao obrigad[oa]|no gracias|ahora no)\b/;

// ── intents answered from published content ─────────────────────────────────
type Intent = 'hours' | 'location' | 'phone' | 'services' | 'price' | 'claim' | 'documents' | 'human' | 'coverage' | 'bind';
export function detectIntents(text: string): Intent[] {
  const t = fold(text);
  const out: Intent[] = [];
  if (has(t, /\b(human|real person|a person|someone|representative|agent|speak (to|with)|talk (to|with) (a|an|some)|pessoa|atendente|humano|alguem|falar com (um|uma|alguem)|agente|persona|alguien|representante|hablar con)\b/)) out.push('human');
  if (has(t, /\b(hours?|open|close[sd]?|horario|aberto|abre|fecha|abierto|cierra|que horas)\b/)) out.push('hours');
  if (has(t, /\b(where|address|located|location|directions|onde|endereco|localizacao|fica|donde|direccion|ubicacion)\b/)) out.push('location');
  if (has(t, /\b(phone number|your number|numero de telefone|telefone de voces|numero de telefono|what number)\b/)) out.push('phone');
  if (has(t, /\b(what (do you|kinds?|types?)|which (insurance|types?)|services|offer|quais seguros|que seguros|o que voces (oferecem|fazem)|tipos de seguro|que ofrecen|cuales seguros)\b/)) out.push('services');
  if (has(t, /\b(how much|price|cost|rate|premium|cheap\w*|quanto custa|preco|valor|custo|barato|cuanto cuesta|precio|costo|tarifa)\b/)) out.push('price');
  if (has(t, /\b(claim|accident happened|file a|sinistro|bati o carro|reclamacao|reclamo|siniestro|choque)\b/)) out.push('claim');
  if (has(t, /\b(certificate|coi|id card|proof of insurance|document\w*|certificado|comprovante|documento\w*|tarjeta de seguro|constancia)\b/)) out.push('documents');
  if (has(t, /\b(am i covered|is .{1,40} covered|does .{1,60} cover|will .{1,40} cover|what does .* cover|what is|o que e|o que cobre|cobre|esta coberto|que es|que cubre|cubre|estoy cubierto)\b/)) out.push('coverage');
  if (has(t, /\b(bind|start (the|my) policy|buy (it|now)|sign me up|activate|contratar agora|fechar agora|ativar|contratar ahora|activar)\b/)) out.push('bind');
  return out;
}

// ── wording ─────────────────────────────────────────────────────────────────
const fmtPhone = (e164: string) => `(${e164.slice(2, 5)}) ${e164.slice(5, 8)}-${e164.slice(8)}`;
/** Spoken read-back: "9 7 8, 5 5 5, 0 1 4 2" so the customer can verify each digit. */
const sayPhone = (e164: string) => `${e164.slice(2, 5).split('').join(' ')}, ${e164.slice(5, 8).split('').join(' ')}, ${e164.slice(8).split('').join(' ')}`;

const P = {
  en: {
    switched: 'Sure, we can continue in English.',
    sensitive: 'For your safety, please don’t share Social Security, card or license numbers here — I removed that from what I keep. An agent will ask for anything they need securely.',
    human: `Of course. You can call us at (978) 221-0139, Monday to Friday, 9 AM to 5 PM, or message a specialist on WhatsApp — both options are on your screen. I can also take down your request so an agent contacts you.`,
    hours: 'We’re open Monday through Friday, 9 AM to 5 PM.',
    location: (a: string) => `Our Chelmsford office is at ${a}.`,
    phone: 'Our phone number is (978) 221-0139.',
    services: (p: string, c: string) => `For you and your family we offer ${p}. For businesses we offer ${c}.`,
    price: 'I can’t give prices or quotes — rates depend on your details, and only a licensed agent can quote. I can take your information so an agent prepares one for you.',
    claim: 'I can’t handle or assess claims. Please call the office at (978) 221-0139 so a licensed agent can help you right away. I can also leave them a message for you.',
    documents: 'We make documents such as ID cards and certificates available through our WhatsApp service. You can message the team there, or I can pass your request along.',
    coverageLead: (n: string, s: string) => `Here is what we publish about ${n}: ${s}`,
    coverageTail: 'What a specific policy covers depends on the policy, so a licensed agent would need to confirm that for you.',
    coverageUnknown: 'I can’t say what a policy does or doesn’t cover — a licensed agent has to review that with you.',
    bind: 'I can’t start, change or bind a policy. A licensed agent has to do that with you.',
    askNeed: 'What kind of insurance can we help you with — for example auto, home, life, or something for your business?',
    askNeedAfterFaq: 'Is there an insurance need I can pass along to our team?',
    noNeed: 'No problem. If you need anything later, I’m here — or call us at (978) 221-0139.',
    gotNeed: (n: string) => `Got it — ${n}.`,
    gotNeedGeneric: 'Thanks, I’ve noted that.',
    askName: 'May I have your full name?',
    nameUnclear: 'Sorry, I didn’t catch your name. Could you say or type your first and last name?',
    thanksName: (n: string) => `Thanks, ${n}.`,
    askContact: 'What’s the best phone number or email to reach you?',
    contactUnclear: 'I couldn’t make out a phone number or email. Could you repeat it slowly, or type it in the box below?',
    gotPhone: (s: string) => `I have your number as ${s}.`,
    gotEmail: (e: string) => `I have your email as ${e}.`,
    askPreferred: 'Would you prefer a phone call, a text message, or WhatsApp?',
    askLine: 'Is this for you personally or for a business?',
    askState: 'Which state are you in?',
    askUrgency: 'How soon do you need this — today, this week, or are you just looking around?',
    askCallback: 'What’s the best time for an agent to reach you?',
    ready: 'Thank you. Please check the details on your screen — you can correct anything — then tap “Send to the team”. Nothing is sent until you confirm.',
    and: 'and',
  },
  pt: {
    switched: 'Claro, podemos continuar em português.',
    sensitive: 'Para a sua segurança, não informe aqui número de Social Security, cartão ou carteira de motorista — eu removi isso do que fica guardado. O agente pede o que precisar de forma segura.',
    human: `Claro. Você pode ligar para (978) 221-0139, de segunda a sexta, das 9h às 17h, ou mandar mensagem para um especialista no WhatsApp — as duas opções estão na sua tela. Também posso anotar o seu pedido para um agente entrar em contato.`,
    hours: 'Atendemos de segunda a sexta, das 9h às 17h.',
    location: (a: string) => `Nosso escritório de Chelmsford fica em ${a}.`,
    phone: 'Nosso telefone é (978) 221-0139.',
    services: (p: string, c: string) => `Para você e sua família, temos ${p}. Para empresas, temos ${c}.`,
    price: 'Não posso informar preços nem cotações — o valor depende dos seus dados, e só um agente licenciado pode cotar. Posso anotar suas informações para um agente preparar a cotação.',
    claim: 'Não consigo abrir nem avaliar sinistros. Ligue para o escritório no (978) 221-0139 para um agente licenciado ajudar você agora. Também posso deixar um recado para a equipe.',
    documents: 'Disponibilizamos documentos, como ID cards e certificados, pelo nosso atendimento no WhatsApp. Você pode falar com a equipe por lá, ou eu encaminho o seu pedido.',
    coverageLead: (n: string, s: string) => `Veja o que publicamos sobre ${n}: ${s}`,
    coverageTail: 'O que cada apólice cobre depende da apólice, então um agente licenciado precisa confirmar isso com você.',
    coverageUnknown: 'Não posso dizer o que uma apólice cobre ou não — um agente licenciado precisa analisar isso com você.',
    bind: 'Não posso contratar, alterar nem ativar uma apólice. Isso precisa ser feito com um agente licenciado.',
    askNeed: 'Com que tipo de seguro podemos ajudar — por exemplo auto, casa, vida ou algo para a sua empresa?',
    askNeedAfterFaq: 'Tem alguma necessidade de seguro que eu possa encaminhar para a equipe?',
    noNeed: 'Sem problema. Se precisar depois, estou por aqui — ou ligue para (978) 221-0139.',
    gotNeed: (n: string) => `Entendi — ${n}.`,
    gotNeedGeneric: 'Obrigada, anotei.',
    askName: 'Qual é o seu nome completo?',
    nameUnclear: 'Desculpe, não entendi o seu nome. Pode falar ou digitar nome e sobrenome?',
    thanksName: (n: string) => `Obrigada, ${n}.`,
    askContact: 'Qual é o melhor telefone ou e-mail para falar com você?',
    contactUnclear: 'Não consegui entender o telefone ou e-mail. Pode repetir devagar ou digitar no campo abaixo?',
    gotPhone: (s: string) => `Anotei o seu número como ${s}.`,
    gotEmail: (e: string) => `Anotei o seu e-mail como ${e}.`,
    askPreferred: 'Você prefere ligação, mensagem de texto ou WhatsApp?',
    askLine: 'O seguro é para você ou para uma empresa?',
    askState: 'Em qual estado você mora?',
    askUrgency: 'Para quando você precisa — hoje, esta semana, ou está só pesquisando?',
    askCallback: 'Qual é o melhor horário para o agente falar com você?',
    ready: 'Obrigada. Confira os dados na tela — você pode corrigir o que quiser — e toque em “Enviar para a equipe”. Nada é enviado antes de você confirmar.',
    and: 'e',
  },
  es: {
    switched: 'Claro, podemos continuar en español.',
    sensitive: 'Por tu seguridad, no compartas aquí números de Seguro Social, tarjetas ni licencia — eliminé eso de lo que guardo. El agente te pedirá lo necesario de forma segura.',
    human: `Claro. Puedes llamarnos al (978) 221-0139, de lunes a viernes, de 9 AM a 5 PM, o escribir a un especialista por WhatsApp — las dos opciones están en tu pantalla. También puedo tomar tu solicitud para que un agente te contacte.`,
    hours: 'Atendemos de lunes a viernes, de 9 AM a 5 PM.',
    location: (a: string) => `Nuestra oficina de Chelmsford está en ${a}.`,
    phone: 'Nuestro teléfono es (978) 221-0139.',
    services: (p: string, c: string) => `Para ti y tu familia ofrecemos ${p}. Para negocios ofrecemos ${c}.`,
    price: 'No puedo dar precios ni cotizaciones — la tarifa depende de tus datos y solo un agente con licencia puede cotizar. Puedo tomar tu información para que un agente la prepare.',
    claim: 'No puedo gestionar ni evaluar reclamos. Llama a la oficina al (978) 221-0139 para que un agente con licencia te ayude de inmediato. También puedo dejarles un mensaje.',
    documents: 'Entregamos documentos como tarjetas de seguro y certificados por nuestro servicio de WhatsApp. Puedes escribir al equipo ahí, o yo paso tu solicitud.',
    coverageLead: (n: string, s: string) => `Esto es lo que publicamos sobre ${n}: ${s}`,
    coverageTail: 'Lo que cubre cada póliza depende de la póliza, así que un agente con licencia debe confirmarlo contigo.',
    coverageUnknown: 'No puedo decir qué cubre o no una póliza — un agente con licencia debe revisarlo contigo.',
    bind: 'No puedo iniciar, cambiar ni contratar una póliza. Eso debe hacerlo un agente con licencia contigo.',
    askNeed: '¿Con qué tipo de seguro podemos ayudarte — por ejemplo auto, casa, vida o algo para tu negocio?',
    askNeedAfterFaq: '¿Hay alguna necesidad de seguro que pueda pasar a nuestro equipo?',
    noNeed: 'No hay problema. Si necesitas algo después, aquí estoy — o llámanos al (978) 221-0139.',
    gotNeed: (n: string) => `Entendido — ${n}.`,
    gotNeedGeneric: 'Gracias, lo anoté.',
    askName: '¿Me das tu nombre completo?',
    nameUnclear: 'Perdón, no entendí tu nombre. ¿Puedes decir o escribir tu nombre y apellido?',
    thanksName: (n: string) => `Gracias, ${n}.`,
    askContact: '¿Cuál es el mejor teléfono o correo para contactarte?',
    contactUnclear: 'No pude entender el teléfono o correo. ¿Puedes repetirlo despacio o escribirlo abajo?',
    gotPhone: (s: string) => `Tengo tu número como ${s}.`,
    gotEmail: (e: string) => `Tengo tu correo como ${e}.`,
    askPreferred: '¿Prefieres una llamada, un mensaje de texto o WhatsApp?',
    askLine: '¿Es para ti o para un negocio?',
    askState: '¿En qué estado vives?',
    askUrgency: '¿Para cuándo lo necesitas — hoy, esta semana, o solo estás viendo opciones?',
    askCallback: '¿Cuál es la mejor hora para que el agente te contacte?',
    ready: 'Gracias. Revisa los datos en tu pantalla — puedes corregir lo que quieras — y toca “Enviar al equipo”. No se envía nada hasta que confirmes.',
    and: 'y',
  },
} as const;

const joinList = (items: string[], and: string) => (items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`);

const QUESTION: Record<Field, keyof (typeof P)['en']> = {
  need: 'askNeed', name: 'askName', contact: 'askContact', preferred: 'askPreferred', line: 'askLine', state: 'askState', urgency: 'askUrgency', callback: 'askCallback',
};

/** Which question comes next. Required fields first; optional ones are asked once and never block. */
export function nextField(d: Draft, asked: Field[]): Field | null {
  if (!d.categories.length && !d.summary) return 'need';
  if (!d.name) return 'name';
  if (!d.phone && !d.email) return 'contact';
  const once = (f: Field, missing: boolean) => missing && !asked.includes(f);
  if (once('preferred', !d.preferred && !!d.phone)) return 'preferred';
  if (once('line', !d.line && !d.categories.length)) return 'line';
  if (once('state', !d.state)) return 'state';
  if (once('urgency', !d.urgency)) return 'urgency';
  if (once('callback', !d.callback)) return 'callback';
  return null;
}

/** Apply everything we can read out of one customer utterance to the draft. Shared with the LLM engine as a safety net. */
export function absorb(draft: Draft, text: string, expect: Field | null): { draft: Draft; got: Partial<Record<'phone' | 'email' | 'name' | 'categories', boolean>> } {
  const d: Draft = { ...draft, categories: [...draft.categories] };
  const got: Partial<Record<'phone' | 'email' | 'name' | 'categories', boolean>> = {};
  const email = extractEmail(text);
  if (email && email !== d.email) (d.email = email), (got.email = true);
  const phone = extractPhone(text);
  if (phone && phone !== d.phone) (d.phone = phone), (got.phone = true);
  const cats = extractCategories(text).filter((c) => !d.categories.includes(c));
  if (cats.length && !(expect === 'name' || expect === 'callback')) (d.categories = [...d.categories, ...cats]), (got.categories = true);
  const line = extractLine(text);
  if (line && (!d.line || d.line === 'unsure')) d.line = line;
  if (expect === 'line' && !line && /\b(not sure|nao sei|no se|both|ambos|os dois)\b/.test(fold(text))) d.line = 'unsure';
  // A free-text state is accepted only when the answer is not plainly about something else.
  const offTopic = !!(extractPreferred(text) || extractUrgency(text) || phone || email);
  const state = extractState(text, expect === 'state' && !offTopic);
  if (state && (expect === 'state' || !d.state) && (expect === 'state' || /\b(massachusetts|new hampshire|rhode island|connecticut|vermont|maine|new york|new jersey|florida)\b/.test(fold(text)) || /\b(in|from|em|no|na|en|de) (MA|NH)\b/.test(text))) d.state = state;
  const urgency = extractUrgency(text);
  if (urgency && (expect === 'urgency' || !d.urgency)) d.urgency = urgency;
  const preferred = extractPreferred(text);
  // "my phone is 978…" names the device, not a wish to be called: the call/text/WhatsApp question still gets asked.
  const incidental = preferred === 'phone' && !!phone && expect !== 'preferred';
  if (preferred && !incidental && (expect === 'preferred' || expect === 'contact' || !d.preferred)) d.preferred = preferred;
  if (!d.preferred && d.email && !d.phone) d.preferred = 'email';
  if (!phone && !email) {
    const name = extractName(text, expect === 'name');
    if (name && (expect === 'name' || !d.name)) (d.name = name), (got.name = true);
  }
  if (expect === 'callback') {
    const c = clean(text).slice(0, 120);
    if (c.length >= 2) d.callback = c;
  }
  return { draft: d, got };
}

export function guidedTurn(req: TurnRequest): TurnResponse {
  let locale = req.locale;
  const last = [...req.messages].reverse().find((m) => m.role === 'user');
  const { text: safeText, redacted } = redactSensitive(clean(last?.text ?? ''));
  const parts: string[] = [];
  const asked = [...req.asked];
  let expect = req.expect;

  const sw = detectLanguageSwitch(safeText, locale);
  if (sw) {
    locale = sw;
    parts.push(P[locale].switched);
  }
  const p = P[locale];
  if (redacted) parts.push(p.sensitive);

  const intents = sw && safeText.split(/\s+/).length <= 4 ? [] : detectIntents(safeText);
  const before = req.draft;
  const { draft, got } = absorb(before, safeText, expect);
  let handoff = false;
  const t = fold(safeText);

  // Answers from published content. Coverage, price, claims and binding always defer to a licensed agent.
  if (intents.includes('human')) (handoff = true), parts.push(p.human);
  if (intents.includes('hours')) parts.push(p.hours);
  if (intents.includes('location')) parts.push(p.location(officeLine()));
  if (intents.includes('phone') && !intents.includes('human')) parts.push(p.phone);
  if (intents.includes('services')) parts.push(p.services(joinList(serviceNames(locale, 'personal'), p.and), joinList(serviceNames(locale, 'commercial'), p.and)));
  if (intents.includes('claim')) (handoff = true), parts.push(p.claim);
  if (intents.includes('bind')) parts.push(p.bind);
  if (intents.includes('price')) parts.push(p.price);
  if (intents.includes('documents') && !intents.includes('coverage')) parts.push(p.documents);
  if (intents.includes('coverage') && !intents.includes('price')) {
    const cat = extractCategories(safeText)[0] ?? draft.categories[draft.categories.length - 1];
    const fact = cat ? serviceFact(cat, locale) : null;
    parts.push(fact ? `${p.coverageLead(fact.name, fact.summary)} ${p.coverageTail}` : p.coverageUnknown);
  }
  const answered = intents.some((i) => i !== 'human');
  const pureFaq = intents.length > 0 && !got.categories && !got.name && !got.phone && !got.email;

  // The customer's own description of what they need.
  const wasNeedTurn = expect === 'need' || (!before.summary && !before.categories.length && expect === null);
  if (wasNeedTurn && safeText && !pureFaq && !sw) {
    if (NO.test(t) && !got.categories) {
      return { reply: [...parts, p.noNeed].join(' '), locale, draft, expect: null, asked, ready: false, handoff, engine: 'guided' };
    }
    if (!(YES.test(t) && t.split(' ').length <= 3)) draft.summary = safeText.slice(0, 600);
  } else if (got.categories && safeText.length > 12 && !pureFaq && draft.summary.length < 500 && expect !== 'contact') {
    draft.summary = draft.summary ? `${draft.summary} ${safeText}`.slice(0, 600) : safeText.slice(0, 600);
  }

  // Acknowledge what was just captured, reading contact details back for confirmation.
  if (got.categories && !intents.includes('coverage')) {
    const names = draft.categories.filter((c) => !before.categories.includes(c)).map((c) => serviceFact(c, locale)?.name).filter(Boolean) as string[];
    if (names.length) parts.push(p.gotNeed(joinList(names, p.and)));
  } else if (wasNeedTurn && draft.summary && !before.summary && !answered) parts.push(p.gotNeedGeneric);
  if (got.name) parts.push(p.thanksName(draft.name!.split(' ')[0]));
  if (got.phone) parts.push(p.gotPhone(`${fmtPhone(draft.phone!)}`));
  if (got.email) parts.push(p.gotEmail(draft.email!));

  // Mark the question we just asked as asked, so optional ones are never repeated.
  if (expect && !asked.includes(expect)) asked.push(expect);
  const missedRequired = (expect === 'name' && !draft.name) || (expect === 'contact' && !draft.phone && !draft.email);

  const next = nextField(draft, asked);
  const ready = next === null && isReady(draft);
  if (ready) parts.push(p.ready);
  else if (next) {
    if (missedRequired && !answered && !handoff && !sw) parts.push(next === 'name' ? p.nameUnclear : p.contactUnclear);
    else if (next === 'need' && (answered || handoff)) parts.push(p.askNeedAfterFaq);
    else parts.push(p[QUESTION[next]] as string);
  }
  expect = ready ? null : next;
  return { reply: parts.join(' '), locale, draft, expect, asked, ready, handoff, engine: 'guided' };
}

export const speakablePhone = sayPhone;
