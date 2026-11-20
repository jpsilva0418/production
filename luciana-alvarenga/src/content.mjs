// All visible strings, PT-BR first. Only facts from brand-facts.md; anything unknown is a
// visible [PLACEHOLDER]. Her quotes stay in Portuguese everywhere; EN mode shows a small
// italic translation (".tr") under them instead of replacing them.

export const PHONE_DISPLAY = '(62) 99305-5281';
export const IG = 'https://www.instagram.com/studiolucianaalvarenga/';
// Her own bio link, verbatim.
export const WA_DEFAULT = 'https://api.whatsapp.com/send?phone=5562993055281&text=Ol%C3%A1%2Cgostaria+de+agendar+um+hor%C3%A1rio%21';
export const wa = (msg) => `https://api.whatsapp.com/send?phone=5562993055281&text=${encodeURIComponent(msg)}`;
export const waService = (svc) => wa(`Olá, Luciana! Gostaria de agendar ${svc}.`);

export const dict = {
  pt: {
    'meta.title': 'Designer de Sobrancelhas em Goiânia — Brow Lamination, Henna & Lash Lifting · Studio Luciana Alvarenga',
    'skip': 'Pular para o conteúdo',
    'nav.book': 'Agendar', 'nav.menu': 'Menu', 'nav.close': 'Fechar',
    'm.1': 'Início', 'm.2': 'Resultados', 'm.3': 'Serviços', 'm.4': 'O Estúdio', 'm.5': 'Sobre', 'm.6': 'Agendar',
    'm.sub1': 'Brow lamination', 'm.sub2': 'Lash lifting', 'm.sub3': 'Antes de agendar',
    'm.foot1': 'Goiânia · Goiás', 'm.foot2': 'Segunda a sábado · [HORÁRIO]',

    'h.v1.1': 'Aqui seu olhar', 'h.v1.2': 'é minha responsabilidade',
    'h.v2.1': 'Realçar olhares', 'h.v2.2': 'valorizar a beleza',
    'h.v3.1': 'Mais que um estúdio', 'h.v3.2': 'uma nova experiência',
    'h.it': 'Design de sobrancelhas, brow lamination e lash lifting em Goiânia.',
    'h.cta': 'Agendar pelo WhatsApp', 'h.link': 'Ver resultados', 'h.cue': 'Descubra',
    'h.kick': 'Designer de Sobrancelhas · Goiânia',

    'a.kick': 'Conheça a Luciana', 'a.t': 'A Artista',
    'a.p2': 'Aqui, cada detalhe é planejado de acordo com o seu rosto — do design personalizado ao brow lamination e ao lash lifting, agora no novo estúdio em Goiânia.',
    'a.cert': 'Profissional certificada em Design de Sobrancelhas',
    'a.cap': 'Luciana Alvarenga · Designer de Sobrancelhas',
    'a.tags': 'Design <i>✦</i> Henna <i>✦</i> Tintura <i>✦</i> Brow lamination <i>✦</i> Lash lifting',
    'a.link': 'Agendar com a Luciana',

    'r.kick': 'Resultados reais', 'r.t': 'O Olhar', 'r.it': 'Cada detalhe planejado de acordo com o seu rosto.',
    'r.count': 'dez olhares — um só cuidado',
    'r.1': 'Design com henna', 'r.2': 'Brow lamination', 'r.3': 'Lash lifting', 'r.4': 'Brow lamination', 'r.5': 'Lash lifting',
    'r.6': 'Brow lamination', 'r.7': 'Design + lash lifting', 'r.8': 'O processo · Design com tintura', 'r.9': 'Lash lifting',
    'r.10': 'Brow lamination com tintura', 'r.end': 'Veja mais no Instagram', 'r.endl': 'Abrir o Instagram', 'r.vid': 'Vídeo',

    's.slate': 'Assinatura', 's.t': 'Brow Lamination', 's.line': 'Fios alinhados, preenchidos e do seu jeito.',
    's.attr': 'Luciana, sobre brow lamination',
    's.i1': 'Brow lamination com tintura', 's.n1': 'sobrancelhas mais preenchidas e volumosas',
    's.i2': 'Brow lamination sem tintura', 's.n2': 'para quem prefere o tom natural dos fios',
    's.i3': 'Design com tintura', 's.n3': 'desenho e cor em harmonia',
    's.i4': 'Brow lamination + lash lifting', 's.n4': 'o combo do olhar completo',
    's.capsmall': 'Resultado de uma cliente · não é uma garantia de duração',
    's.cta': 'Agendar brow lamination', 's.link': 'Ver todos os serviços',

    'sv.kick': 'Goiânia · Goiás', 'sv.t': 'Serviços', 'sv.it': 'Cada procedimento pensado para o seu rosto. Valores sob consulta pelo WhatsApp.',
    'sv.ghost': 'sobrancelhas',
    'sv.1': 'Design personalizado', 'sv.1d': 'Pensado para o formato do seu rosto, preservando a naturalidade que encanta.',
    'sv.2': 'Design com henna', 'sv.2d': 'Tons castanho claro, médio, escuro ou preta — e o delicado efeito ombré.',
    'sv.3': 'Design com tintura', 'sv.3d': 'O design personalizado com cor para definir e realçar os fios.',
    'sv.4': 'Brow lamination', 'sv.4d': 'Com ou sem tintura: fios alinhados, preenchidos e do seu jeito.',
    'sv.5': 'Lash lifting', 'sv.5d': 'Curvatura, alongamento e definição nos seus cílios naturais, sem extensões.',
    'sv.6': 'Design masculino & infantil', 'sv.6d': 'Simetria e harmonia para eles; para elas, o primeiro design respeitando a naturalidade.',
    'sv.price': 'Valor sob consulta', 'sv.book': 'Agendar',
    'sv.combos': '<b>Combos</b> &nbsp;Design + lash lifting <b>✦</b> Brow lamination + lash lifting',
    'sv.cta': 'Agendar pelo WhatsApp',

    'l.kick': 'Cílios naturais', 'l.t': 'Lash Lifting', 'l.cap': 'Naturalidade e delicadeza',
    'l.cta': 'Agendar lash lifting', 'l.link': 'Combos com design',

    'st.kick': 'Um novo capítulo · Nov 2026', 'st.t': 'O Estúdio', 'st.it': 'Mais que um estúdio — uma nova experiência para você.',
    'st.c1': 'A sala de atendimento', 'st.c2': 'O espelho', 'st.c3': 'Os detalhes', 'st.c4': 'O lounge',
    'st.addr': 'Goiânia · GO — [ENDEREÇO]',

    'p.kick': 'Políticas do estúdio', 'p.t': 'Antes de agendar',
    'p.it': 'Combinados simples para que cada atendimento aconteça com calma e no seu horário.',
    'p.q1': 'Sinal de 50% via Pix', 'p.a1': 'Para garantir o seu horário, é necessário um sinal de 50% por Pix do valor do procedimento desejado. O sinal é uma garantia da reserva e é descontado do valor total do seu atendimento.',
    'p.q2': 'Tolerância de 10 minutos', 'p.a2': 'A tolerância é de 10 minutos. Após esse tempo, o seu horário será cancelado e reagendado. Chegue de 10 a 15 minutos antes.',
    'p.q3': 'Reagendamento com 48h', 'p.a3': 'Para reagendar, é necessário avisar com pelo menos 48 horas de antecedência. Em caso de falta ou cancelamento em cima da hora, o sinal não será reembolsado.',
    'p.q4': 'Formas de pagamento', 'p.a4': 'Aceitamos Pix, dinheiro e cartão (crédito ou débito).',
    'p.q5': 'Confirmação pelo WhatsApp', 'p.a5': 'No dia do seu atendimento, você recebe uma mensagem pelo WhatsApp para a confirmação do seu horário.',
    'p.hours': 'Horário', 'p.h1': 'Segunda a sábado · [HORÁRIO]', 'p.h2': 'Domingo · fechado',
    'p.where': 'Onde', 'p.w1': 'Goiânia · GO — [ENDEREÇO]',

    'd.kick': 'Depoimentos', 'd.t': 'Quem confia', 'd.ph': '“[Depoimento real — print do destaque FEEDBACK]”', 'd.name': '— [NOME]',
    'd.note': 'Espaço reservado · depoimentos reais com autorização das clientes',

    'f.kick': 'Agende seu horário', 'f.t': 'Seu olhar começa aqui.', 'f.ig': 'Seguir no Instagram',

    'ft.follow': 'Siga', 'ft.n1': 'Início', 'ft.n2': 'Resultados', 'ft.n3': 'Brow lamination', 'ft.n4': 'Serviços', 'ft.n5': 'Lash lifting',
    'ft.n6': 'O Estúdio', 'ft.n7': 'Antes de agendar', 'ft.n8': 'Instagram', 'ft.n9': 'WhatsApp',
    'ft.bar3': 'Aqui seu olhar é minha responsabilidade',
    'bar.cta': 'Agendar', 'bar.sub': 'Goiânia · WhatsApp', 'top': 'Voltar ao topo',
  },
  en: {
    'meta.title': 'Brow Designer in Goiânia — Brow Lamination, Henna & Lash Lifting · Studio Luciana Alvarenga',
    'skip': 'Skip to content',
    'nav.book': 'Book', 'nav.menu': 'Menu', 'nav.close': 'Close',
    'm.1': 'Home', 'm.2': 'Results', 'm.3': 'Services', 'm.4': 'The Studio', 'm.5': 'About', 'm.6': 'Book',
    'm.sub1': 'Brow lamination', 'm.sub2': 'Lash lifting', 'm.sub3': 'Before you book',
    'm.foot1': 'Goiânia · Goiás, Brazil', 'm.foot2': 'Monday to Saturday · [HOURS]',

    'h.v1.1': 'Your gaze', 'h.v1.2': 'is my responsibility',
    'h.v2.1': 'Enhancing the gaze', 'h.v2.2': 'honoring your beauty',
    'h.v3.1': 'More than a studio', 'h.v3.2': 'a new experience',
    'h.it': 'Brow design, brow lamination and lash lifting in Goiânia.',
    'h.cta': 'Book on WhatsApp', 'h.link': 'See results', 'h.cue': 'Discover',
    'h.kick': 'Brow Designer · Goiânia',

    'a.kick': 'Meet Luciana', 'a.t': 'The Artist',
    'a.p2': 'Here, every detail is planned around your face — from custom brow design to brow lamination and lash lifting, now in the new studio in Goiânia.',
    'a.cert': 'Certified brow design professional',
    'a.cap': 'Luciana Alvarenga · Brow Designer',
    'a.tags': 'Brow design <i>✦</i> Henna <i>✦</i> Tint <i>✦</i> Brow lamination <i>✦</i> Lash lifting',
    'a.link': 'Book with Luciana',

    'r.kick': 'Real results', 'r.t': 'The Gaze', 'r.it': 'Every detail planned around your face.',
    'r.count': 'ten looks — one standard of care',
    'r.1': 'Henna brow design', 'r.2': 'Brow lamination', 'r.3': 'Lash lifting', 'r.4': 'Brow lamination', 'r.5': 'Lash lifting',
    'r.6': 'Brow lamination', 'r.7': 'Brow design + lash lifting', 'r.8': 'The process · Tinted brow design', 'r.9': 'Lash lifting',
    'r.10': 'Tinted brow lamination', 'r.end': 'See more on Instagram', 'r.endl': 'Open Instagram', 'r.vid': 'Video',

    's.slate': 'Signature', 's.t': 'Brow Lamination', 's.line': 'Aligned, fuller brows — exactly your way.',
    's.attr': 'Luciana, on brow lamination',
    's.i1': 'Tinted brow lamination', 's.n1': 'fuller, more voluminous brows',
    's.i2': 'Brow lamination, no tint', 's.n2': 'for those who prefer their natural shade',
    's.i3': 'Tinted brow design', 's.n3': 'shape and colour in harmony',
    's.i4': 'Brow lamination + lash lifting', 's.n4': 'the complete-gaze combo',
    's.capsmall': 'One client’s result · not a guaranteed duration',
    's.cta': 'Book brow lamination', 's.link': 'See all services',

    'sv.kick': 'Goiânia · Goiás', 'sv.t': 'Services', 'sv.it': 'Every treatment planned for your face. Pricing on request via WhatsApp.',
    'sv.ghost': 'sobrancelhas',
    'sv.1': 'Custom brow design', 'sv.1d': 'Designed around the shape of your face, keeping the natural look that charms.',
    'sv.2': 'Henna brow design', 'sv.2d': 'Light, medium or dark brown or black tones — and a soft ombré effect.',
    'sv.3': 'Tinted brow design', 'sv.3d': 'Custom design with colour to define and lift the brow hairs.',
    'sv.4': 'Brow lamination', 'sv.4d': 'With or without tint: aligned, fuller brows, your way.',
    'sv.5': 'Lash lifting', 'sv.5d': 'Curl, length and definition for your natural lashes, no extensions.',
    'sv.6': 'Men’s & first brow design', 'sv.6d': 'Symmetry and harmony for him; for girls, a first design that respects their natural brows.',
    'sv.price': 'Price on request', 'sv.book': 'Book',
    'sv.combos': '<b>Combos</b> &nbsp;Brow design + lash lifting <b>✦</b> Brow lamination + lash lifting',
    'sv.cta': 'Book on WhatsApp',

    'l.kick': 'Natural lashes', 'l.t': 'Lash Lifting', 'l.cap': 'Natural and delicate',
    'l.cta': 'Book lash lifting', 'l.link': 'Combos with brow design',

    'st.kick': 'A new chapter · Nov 2026', 'st.t': 'The Studio', 'st.it': 'More than a studio — a new experience for you.',
    'st.c1': 'The treatment room', 'st.c2': 'The mirror', 'st.c3': 'The details', 'st.c4': 'The lounge',
    'st.addr': 'Goiânia · GO — [ADDRESS]',

    'p.kick': 'Studio policies', 'p.t': 'Before you book',
    'p.it': 'A few simple agreements so every appointment runs calmly and on time.',
    'p.q1': '50% deposit via Pix', 'p.a1': 'To secure your appointment, a 50% deposit of the treatment price is required via Pix. It guarantees your slot and is deducted from your total.',
    'p.q2': '10-minute grace period', 'p.a2': 'The grace period is 10 minutes. After that, your appointment is cancelled and rescheduled. Please arrive 10 to 15 minutes early.',
    'p.q3': 'Rescheduling with 48h notice', 'p.a3': 'To reschedule, please give at least 48 hours’ notice. For no-shows or last-minute cancellations, the deposit is not refunded.',
    'p.q4': 'Payment methods', 'p.a4': 'We accept Pix, cash and card (credit or debit).',
    'p.q5': 'WhatsApp confirmation', 'p.a5': 'On the day of your appointment you’ll receive a WhatsApp message to confirm your time.',
    'p.hours': 'Hours', 'p.h1': 'Monday to Saturday · [HOURS]', 'p.h2': 'Sunday · closed',
    'p.where': 'Where', 'p.w1': 'Goiânia · GO — [ADDRESS]',

    'd.kick': 'Kind words', 'd.t': 'In their words', 'd.ph': '“[Real testimonial — from the FEEDBACK highlight]”', 'd.name': '— [NAME]',
    'd.note': 'Placeholder · real testimonials with clients’ permission',

    'f.kick': 'Book your appointment', 'f.t': 'Your gaze begins here.', 'f.ig': 'Follow on Instagram',

    'ft.follow': 'Follow', 'ft.n1': 'Home', 'ft.n2': 'Results', 'ft.n3': 'Brow lamination', 'ft.n4': 'Services', 'ft.n5': 'Lash lifting',
    'ft.n6': 'The Studio', 'ft.n7': 'Before you book', 'ft.n8': 'Instagram', 'ft.n9': 'WhatsApp',
    'ft.bar3': 'Your gaze is my responsibility',
    'bar.cta': 'Book', 'bar.sub': 'Goiânia · WhatsApp', 'top': 'Back to top',
  },
};

// Her words — always Portuguese; `en` is the small translation shown in EN mode.
export const quotes = {
  image: { pt: 'Minha imagem é o reflexo da profissional que escolhi ser.', en: 'My image is the reflection of the professional I chose to be.' },
  purpose: { pt: 'Mais do que sobrancelhas, meu propósito é realçar olhares, valorizar a beleza individual e proporcionar experiências que transmitam confiança e autoestima.',
    en: 'More than brows, my purpose is to enhance the gaze, honor individual beauty and create experiences that convey confidence and self-esteem.' },
  identity: { pt: 'Não é apenas sobre beleza, é sobre identidade, autoridade e excelência em cada detalhe.',
    en: 'It isn’t only about beauty — it’s about identity, authority and excellence in every detail.' },
  lamination: { pt: 'Sempre pergunto se quer mais grossas ou não, se quer que deixe o pelo mais para cima ou um pouco mais “deitadinho”… atende todos os tipos de gostos! Além de preencher falhas.',
    en: 'I always ask whether you want them thicker or not, whether to set the hairs more upward or a little more “laid down”… it suits every taste! It also fills in gaps.' },
  sixWeeks: { pt: 'Brow lamination com quase 1 mês e meio de procedimento… fios íntegros e saudáveis!',
    en: 'Brow lamination almost a month and a half after the treatment… intact, healthy hairs!' },
  lashDef: { pt: 'O lash lifting é um procedimento estético realizado nos cílios naturais para dar curvatura, alongamento e definição, sem a necessidade de cílios postiços ou extensões.',
    en: 'Lash lifting is a treatment on your natural lashes that adds curl, length and definition, with no need for false lashes or extensions.' },
  lashMascara: { pt: '…podendo ser usado rímel normalmente para deixar ainda mais curvado e pigmentado. Fica lindo demais, ideal para quem gosta de naturalidade e delicadeza!',
    en: '…and you can wear mascara as usual to make it even curlier and darker. It looks beautiful — ideal if you love a natural, delicate look!' },
  studio: { pt: 'Hoje meu coração transborda gratidão… cada coisa que hoje faz parte desse espaço, já foi motivo de muita oração.',
    en: 'Today my heart overflows with gratitude… everything that is part of this space was once the subject of many prayers.' },
  selfcare: { pt: 'Não é sobre sobrancelhas… é sobre se permitir um momento só seu… um momento de pausa, um gesto de amor próprio e autocuidado.',
    en: 'It isn’t about brows… it’s about allowing yourself a moment of your own… a pause, a gesture of self-love and self-care.' },
  wall: { pt: 'Apaixone-se pelo ato de se cuidar.', en: 'Fall in love with taking care of yourself.' },
  faith: { pt: 'Faça por amor e com amor, e Deus honrará as tuas mãos!', en: 'Do it for love and with love, and God will honor your hands!' },
};
