// Variations IV and V — new designs, not re-skins. Different structure, navigation and sections.
//   IV · Preto & Branco — modern editorial minimal: sticky top bar, split portrait hero, service menu as a list,
//        results grid, numbered "how to book". White, black, a hairline of gold.
//   V  · Rosé — warm, app-like: rounded cards, swipeable services, phone-frame reels, 3-step booking, sticky CTA card.

export const EXTRA = {
  pt: {
    'x.nav1': 'Resultados', 'x.nav2': 'Serviços', 'x.nav3': 'Sobre', 'x.nav4': 'Como agendar',
    'x.h': 'Aqui seu olhar é minha responsabilidade.',
    'x.sub': 'Design de sobrancelhas, brow lamination e lash lifting no novo estúdio em Goiânia.',
    'x.svc': 'O menu', 'x.svct': 'Procedimentos', 'x.res': 'Trabalho recente', 'x.rest': 'Resultados reais',
    'x.about': 'Sobre', 'x.how': 'Como agendar', 'x.howt': 'Três passos, tudo pelo WhatsApp',
    'x.s1': 'Chame no WhatsApp', 'x.s1d': 'Conte qual procedimento deseja e receba os horários disponíveis.',
    'x.s2': 'Garanta com o sinal', 'x.s2d': 'Sinal de 50% via Pix, descontado do valor total no dia.',
    'x.s3': 'Confirmação no dia', 'x.s3d': 'Você recebe uma mensagem para confirmar. Chegue 10 a 15 minutos antes.',
    'x.more': 'Ver todas as políticas', 'x.studio': 'O novo estúdio', 'x.cta': 'Pronta para o seu novo olhar?',
    'x.choose': 'Escolha o seu procedimento', 'x.swipe': 'deslize para ver todos', 'x.reels': 'Em movimento',
    'x.hi': 'Olá, eu sou a Luciana', 'x.open': 'Novo estúdio · Nov 2026',
  },
  en: {
    'x.nav1': 'Results', 'x.nav2': 'Services', 'x.nav3': 'About', 'x.nav4': 'How to book',
    'x.h': 'Your gaze is my responsibility.',
    'x.sub': 'Brow design, brow lamination and lash lifting in the new studio in Goiânia.',
    'x.svc': 'The menu', 'x.svct': 'Treatments', 'x.res': 'Recent work', 'x.rest': 'Real results',
    'x.about': 'About', 'x.how': 'How to book', 'x.howt': 'Three steps, all on WhatsApp',
    'x.s1': 'Message on WhatsApp', 'x.s1d': 'Tell her which treatment you want and get the available times.',
    'x.s2': 'Secure it with a deposit', 'x.s2d': '50% deposit via Pix, deducted from the total on the day.',
    'x.s3': 'Confirmation on the day', 'x.s3d': 'You’ll get a message to confirm. Arrive 10 to 15 minutes early.',
    'x.more': 'See all policies', 'x.studio': 'The new studio', 'x.cta': 'Ready for your new look?',
    'x.choose': 'Choose your treatment', 'x.swipe': 'swipe to see them all', 'x.reels': 'In motion',
    'x.hi': 'Hi, I’m Luciana', 'x.open': 'New studio · Nov 2026',
  },
};

const SVCS = [
  [1, 'r06', 'Design personalizado'], [2, 'r16', 'Design com henna'], [3, 'r18', 'Design com tintura'],
  [4, 'r08', 'Brow lamination'], [5, 'r05', 'Lash lifting'], [6, 'masculino', 'Design masculino'],
];
const POL = [1, 2, 3, 4, 5];

export function bodyIV(c) {
  const { img, vid, T, t, quote, Q, waService, WA, IG, logoH, logoFull, menu, policies } = c;
  return `
<header class="bar">
  <div class="bar-in">
    <a class="bar-logo" href="#inicio" aria-label="Studio Luciana Alvarenga — início">${logoH('dark')}</a>
    <nav class="bar-nav" aria-label="Seções">
      <a href="#resultados">${T('x.nav1')}</a><a href="#servicos">${T('x.nav2')}</a><a href="#artista">${T('x.nav3')}</a><a href="#como-agendar">${T('x.nav4')}</a>
    </nav>
    <div class="bar-tools">
      <div class="lang" role="group" aria-label="Idioma / Language"><button type="button" data-lang="pt" aria-pressed="true">PT</button><i aria-hidden="true">|</i><button type="button" data-lang="en" aria-pressed="false">EN</button></div>
      <a class="pill pill--dark bar-book" href="${WA}" target="_blank" rel="noopener">${T('nav.book')}</a>
      <button class="menu-btn bar-menu" id="menuOpen" aria-expanded="false" aria-controls="menu"><span class="sr">Abrir menu</span><span class="bars" aria-hidden="true"><i></i><i></i></span></button>
    </div>
  </div>
</header>
${menu}
<main id="conteudo">
  <section class="m-hero hero" id="inicio" aria-label="Início">
    <div class="m-hero-copy">
      <p class="m-eyebrow fade in">${T('h.kick')}</p>
      <h1 class="m-h1 rv in">${t('x.h').replace('responsabilidade.', '<em>responsabilidade.</em>').replace('responsibility.', '<em>responsibility.</em>')}</h1>
      <p class="m-sub" data-i18n="x.sub">${t('x.sub')}</p>
      <div class="m-ctas"><a class="pill pill--dark" href="${WA}" target="_blank" rel="noopener">${T('h.cta')}</a><a class="m-link" href="#resultados">${T('h.link')} &rarr;</a></div>
      <dl class="m-facts">
        <div><dt>${T('x.svct')}</dt><dd>6</dd></div><div><dt>Goiânia</dt><dd>GO</dd></div><div><dt>${T('x.open')}</dt><dd>✦</dd></div>
      </dl>
    </div>
    <figure class="m-hero-img">${img('luciana-blazer', { alt: 'Luciana Alvarenga, designer de sobrancelhas', eager: true, inlineW: 1280, sizes: '(max-width:899px) 100vw, 50vw', pos: '50% 18%' })}</figure>
  </section>

  <div class="m-marquee" aria-hidden="true"><div class="m-mq-in">${Array(2).fill('Design personalizado ✦ Design com henna ✦ Design com tintura ✦ Brow lamination ✦ Lash lifting ✦ Design masculino ✦ ').join('')}</div></div>

  <section class="m-sec" id="resultados" aria-labelledby="iv-res">
    <div class="m-wrap">
      <div class="m-head"><p class="m-eyebrow">${T('x.res')}</p><h2 class="m-h2" id="iv-res" data-i18n="x.rest">${t('x.rest')}</h2></div>
      <div class="m-grid" data-stag=".05">
        <figure class="m-tile m-tile--tall fade">${vid('v04-process', { label: 'Vídeo: o processo do design com tintura' })}<figcaption>${T('r.8')}</figcaption></figure>
        <figure class="m-tile fade">${img('r01', { alt: 'Design com henna em close', sizes: '(max-width:719px) 50vw, 25vw' })}<figcaption>${T('r.1')}</figcaption></figure>
        <figure class="m-tile fade">${img('r04', { alt: 'Lash lifting em close', sizes: '(max-width:719px) 50vw, 25vw' })}<figcaption>${T('r.3')}</figcaption></figure>
        <figure class="m-tile fade">${img('r09', { alt: 'Brow lamination no rosto da cliente', sizes: '(max-width:719px) 50vw, 25vw' })}<figcaption>${T('r.2')}</figcaption></figure>
        <figure class="m-tile fade">${img('r11', { alt: 'Design e lash lifting', sizes: '(max-width:719px) 50vw, 25vw' })}<figcaption>${T('r.7')}</figcaption></figure>
        <figure class="m-tile m-tile--wide fade">${vid('v03-six-weeks', { label: 'Vídeo: brow lamination com quase seis semanas' })}<figcaption>${T('r.2')} · ${quote(Q.sixWeeks, '', 'span')}</figcaption></figure>
        <figure class="m-tile fade">${img('r19', { alt: 'Brow lamination com tintura', sizes: '(max-width:719px) 50vw, 25vw' })}<figcaption>${T('r.10')}</figcaption></figure>
        <figure class="m-tile fade">${img('r07', { alt: 'Close de brow lamination', sizes: '(max-width:719px) 50vw, 25vw' })}<figcaption>${T('r.6')}</figcaption></figure>
        <figure class="m-tile m-tile--wide fade">${img('r17', { alt: 'Brow lamination no rosto da cliente', sizes: '(max-width:719px) 100vw, 50vw' })}<figcaption>${T('r.4')}</figcaption></figure>
      </div>
      <a class="m-link" href="${IG}" target="_blank" rel="noopener">@studiolucianaalvarenga &rarr;</a>
    </div>
  </section>

  <section class="m-sec m-sec--grey" id="servicos" aria-labelledby="iv-svc">
    <div class="m-wrap m-split">
      <div class="m-head m-sticky"><p class="m-eyebrow">${T('x.svc')}</p><h2 class="m-h2" id="iv-svc" data-i18n="x.svct">${t('x.svct')}</h2><p class="m-note" data-i18n="sv.it">${t('sv.it')}</p></div>
      <ol class="m-menu">
        ${SVCS.map(([i, , svc], k) => `<li class="fade"><span class="m-n">0${k + 1}</span><div class="m-mi"><h3 data-i18n="sv.${i}">${t(`sv.${i}`)}</h3><p data-i18n="sv.${i}d">${t(`sv.${i}d`)}</p><span class="m-meta"><span class="ph-tag">[DURAÇÃO]</span> <span class="ph-tag">[PREÇO]</span></span></div><a class="m-book" href="${waService(svc)}" target="_blank" rel="noopener" aria-label="Agendar ${svc}">${T('sv.book')} &rarr;</a></li>`).join('')}
      </ol>
    </div>
  </section>

  <section class="m-sec" id="artista" aria-labelledby="iv-about">
    <div class="m-wrap m-about">
      <figure class="m-about-img fade">${img('luciana-seated', { alt: 'Luciana Alvarenga sentada com a pinça', sizes: '(max-width:899px) 100vw, 45vw' })}</figure>
      <div>
        <p class="m-eyebrow">${T('x.about')}</p>
        <h2 class="m-h2" id="iv-about">Luciana Alvarenga</h2>
        ${quote(Q.purpose, 'm-quote')}
        <p data-i18n="a.p2">${t('a.p2')}</p>
        <p class="m-cert">✦ <span data-i18n="a.cert">${t('a.cert')}</span></p>
        <p class="m-sign">Luciana Alvarenga</p>
      </div>
    </div>
  </section>

  <section class="m-sec m-sec--black" id="estudio" aria-labelledby="iv-st">
    <div class="m-wrap">
      <div class="m-head"><p class="m-eyebrow">${T('st.kick')}</p><h2 class="m-h2" id="iv-st" data-i18n="x.studio">${t('x.studio')}</h2></div>
      <div class="m-studio" data-stag=".08">
        ${[['studio-room', 'st.c1'], ['studio-mirror', 'st.c2'], ['studio-lounge', 'st.c4']].map(([n, k]) => `<figure class="fade">${img(n, { alt: t(k), sizes: '(max-width:719px) 80vw, 30vw' })}<figcaption>${T(k)}</figcaption></figure>`).join('')}
      </div>
      ${quote(Q.wall, 'm-wall')}
    </div>
  </section>

  <section class="m-sec" id="como-agendar" aria-labelledby="iv-how">
    <div class="m-wrap">
      <div class="m-head"><p class="m-eyebrow">${T('x.how')}</p><h2 class="m-h2" id="iv-how" data-i18n="x.howt">${t('x.howt')}</h2></div>
      <ol class="m-steps" data-stag=".08">${[1, 2, 3].map((i) => `<li class="fade"><span>0${i}</span><h3 data-i18n="x.s${i}">${t(`x.s${i}`)}</h3><p data-i18n="x.s${i}d">${t(`x.s${i}d`)}</p></li>`).join('')}</ol>
      ${policies}
    </div>
  </section>

  <section class="m-cta" id="agendar" aria-labelledby="iv-cta">
    <h2 id="iv-cta" data-i18n="x.cta">${t('x.cta')}</h2>
    <a class="pill pill--light" href="${WA}" target="_blank" rel="noopener">${T('h.cta')}</a>
  </section>
</main>`;
}

export function bodyV(c) {
  const { img, vid, T, t, quote, Q, waService, WA, IG, logoH, menu, policies } = c;
  return `
<header class="rh">
  <a class="rh-logo" href="#inicio" aria-label="Studio Luciana Alvarenga — início">${logoH('dark')}</a>
  <div class="rh-tools">
    <div class="lang" role="group" aria-label="Idioma / Language"><button type="button" data-lang="pt" aria-pressed="true">PT</button><i aria-hidden="true">|</i><button type="button" data-lang="en" aria-pressed="false">EN</button></div>
    <button class="rh-menu" id="menuOpen" aria-expanded="false" aria-controls="menu"><span data-i18n="nav.menu">${t('nav.menu')}</span></button>
  </div>
</header>
${menu}
<main id="conteudo">
  <section class="r-hero hero" id="inicio" aria-label="Início">
    <div class="r-hero-copy">
      <span class="chip chip--soft">✦ ${T('x.open')}</span>
      <h1 class="r-h1"><span data-i18n="h.v1.1">${t('h.v1.1')}</span> <em data-i18n="h.v1.2">${t('h.v1.2')}</em></h1>
      <p class="r-sub" data-i18n="x.sub">${t('x.sub')}</p>
      <div class="r-ctas"><a class="r-btn" href="${WA}" target="_blank" rel="noopener">${T('h.cta')}</a><a class="r-btn r-btn--ghost" href="#servicos">${T('x.choose')}</a></div>
    </div>
    <div class="r-hero-art">
      <figure class="r-card r-card--main">${img('luciana-mirror2', { alt: 'Luciana Alvarenga com o espelho LA', eager: true, sizes: '(max-width:899px) 80vw, 34vw', inlineW: 800, pos: '50% 26%' })}</figure>
      <figure class="r-card r-card--a">${img('r01', { alt: 'Design com henna', sizes: '160px', inlineW: 480 })}</figure>
      <figure class="r-card r-card--b">${img('r14', { alt: 'Lash lifting', sizes: '160px', inlineW: 480 })}</figure>
      <span class="chip chip--float chip--1">Brow lamination</span><span class="chip chip--float chip--2">Lash lifting</span>
    </div>
  </section>

  <section class="r-sec" id="servicos" aria-labelledby="v-svc">
    <div class="r-head"><h2 id="v-svc" data-i18n="x.choose">${t('x.choose')}</h2><span data-i18n="x.swipe">${t('x.swipe')}</span></div>
    <div class="r-swipe">
      ${SVCS.map(([i, im, svc]) => `<article class="r-svc">${img(im, { alt: svc, sizes: '280px', inlineW: 480 })}<div><h3 data-i18n="sv.${i}">${t(`sv.${i}`)}</h3><p data-i18n="sv.${i}d">${t(`sv.${i}d`)}</p><div class="r-svc-f"><span class="ph-tag">[PREÇO]</span><a href="${waService(svc)}" target="_blank" rel="noopener" aria-label="Agendar ${svc}">${T('sv.book')}</a></div></div></article>`).join('')}
    </div>
  </section>

  <section class="r-sec r-sec--wine" id="resultados" aria-labelledby="v-res">
    <div class="r-head"><h2 id="v-res" data-i18n="x.reels">${t('x.reels')}</h2><span data-i18n="r.it">${t('r.it')}</span></div>
    <div class="r-phones">
      ${[['v05-lash', 'r.3'], ['v01-lamination', 'r.2'], ['v06-lash', 'l.cap'], ['v04-process', 'r.8']].map(([n, k]) => `<figure class="r-phone fade">${vid(n, { label: 'Vídeo: ' + t(k) })}<figcaption>${T(k)}</figcaption></figure>`).join('')}
    </div>
    <div class="r-strip">${['r09', 'r07', 'r03', 'r19', 'r17', 'r11'].map((n) => img(n, { alt: 'Resultado', sizes: '140px', inlineW: 480 })).join('')}</div>
  </section>

  <section class="r-sec" id="artista" aria-labelledby="v-about">
    <div class="r-about">
      <figure class="r-card">${img('luciana-portrait', { alt: 'Luciana Alvarenga', sizes: '(max-width:899px) 90vw, 40vw', pos: '50% 25%' })}</figure>
      <div class="r-bubble">
        <h2 id="v-about" data-i18n="x.hi">${t('x.hi')}</h2>
        ${quote(Q.purpose, '')}
        ${quote(Q.selfcare, 'r-small')}
        <p class="chip chip--soft">✦ <span data-i18n="a.cert">${t('a.cert')}</span></p>
      </div>
    </div>
  </section>

  <section class="r-sec r-sec--blush" id="como-agendar" aria-labelledby="v-how">
    <div class="r-head"><h2 id="v-how" data-i18n="x.howt">${t('x.howt')}</h2></div>
    <ol class="r-steps">${[1, 2, 3].map((i) => `<li class="fade"><b>${i}</b><h3 data-i18n="x.s${i}">${t(`x.s${i}`)}</h3><p data-i18n="x.s${i}d">${t(`x.s${i}d`)}</p></li>`).join('')}</ol>
    ${policies}
  </section>

  <section class="r-sec" id="estudio" aria-labelledby="v-st">
    <div class="r-head"><h2 id="v-st" data-i18n="x.studio">${t('x.studio')}</h2><span data-i18n="st.it">${t('st.it')}</span></div>
    <div class="r-studio">${['studio-room', 'studio-mirror', 'studio-cart', 'studio-lounge'].map((n) => `<figure class="r-card fade">${img(n, { alt: 'O estúdio', sizes: '(max-width:719px) 45vw, 22vw', inlineW: 480 })}</figure>`).join('')}</div>
    ${quote(Q.wall, 'r-wall')}
  </section>

  <section class="r-final" id="agendar" aria-labelledby="v-cta">
    <div class="r-final-card">
      <h2 id="v-cta" data-i18n="f.t">${t('f.t')}</h2>
      ${quote(Q.identity, '')}
      <div class="r-ctas"><a class="r-btn" href="${WA}" target="_blank" rel="noopener">${T('h.cta')}</a><a class="r-btn r-btn--ghost" href="${IG}" target="_blank" rel="noopener">Instagram</a></div>
    </div>
  </section>
</main>`;
}

export const CSS_IV = `
:root{--porcelain:#fff;--noir:#0E0E0E;--cocoa:#111;--cocoa-soft:#4b4b49;--gold-text:#7A6440;--champagne:#E6D7BF;--gold:#A8915F;--hairlt:rgba(17,17,17,.14);--hairlt-strong:rgba(17,17,17,.3)}
body{background:#fff;color:#2a2a28;font-family:'Jost',system-ui,sans-serif;font-size:1rem;line-height:1.7}
.edge{display:none}
.bar{position:sticky;top:0;z-index:70;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid #e9e9e6}
.bar-in{width:min(92vw,1320px);margin:auto;display:flex;align-items:center;gap:2rem;height:72px}
.bar-logo svg{height:40px;width:auto}
.bar-nav{display:flex;gap:2rem;margin-left:auto;font-size:.82rem;letter-spacing:.04em}
.bar-nav a{color:#111;position:relative;padding:.4rem 0}.bar-nav a:hover{color:#7A6440}
.bar-tools{display:flex;align-items:center;gap:1rem}
.bar .lang{color:#111}.bar .menu-btn .bars i{background:#111}
.bar-menu{display:none}
@media(max-width:899px){.bar-nav,.bar-book{display:none}.bar-menu{display:inline-flex}.bar-tools{margin-left:auto}}
.pill{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 1.6rem;border-radius:999px;font-size:.8rem;font-weight:500;letter-spacing:.06em;transition:background .3s,color .3s,transform .3s}
.pill:hover{transform:translateY(-1px)}
.pill--dark{background:#111;color:#fff}.pill--dark:hover{background:#7A6440}
.pill--light{background:#fff;color:#111}.pill--light:hover{background:#E6D7BF}
.m-hero{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100svh - 72px);place-items:stretch;text-align:left;overflow:visible}
.m-hero-copy{display:flex;flex-direction:column;justify-content:center;padding:clamp(3rem,6vw,6rem) clamp(1.4rem,5vw,5rem) clamp(3rem,6vw,5rem) max(4vw,calc((100vw - 1320px)/2))}
.m-eyebrow{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:#7A6440;margin-bottom:1.2rem}
.m-h1{font-family:'Bodoni Moda',Georgia,serif;font-weight:400;font-size:clamp(2.6rem,5.6vw,5.6rem);line-height:1.02;letter-spacing:-.01em;color:#111}
.m-h1 em{font-style:italic;color:#7A6440}
.m-sub{font-size:1.1rem;max-width:30em;margin-top:1.6rem;color:#4b4b49}
.m-ctas{display:flex;align-items:center;gap:1.6rem;flex-wrap:wrap;margin-top:2.2rem}
.m-link{display:inline-flex;align-items:center;min-height:44px;font-size:.85rem;color:#111;border-bottom:1px solid #111;width:fit-content}
.m-link:hover{color:#7A6440;border-color:#7A6440}
.m-facts{display:flex;gap:2.6rem;margin:3rem 0 0;padding-top:1.4rem;border-top:1px solid #e3e3e0}
.m-facts div{display:flex;flex-direction:column-reverse}.m-facts dt{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#77756f}
.m-facts dd{margin:0;font-family:'Bodoni Moda',Georgia,serif;font-size:1.8rem;color:#111}
.m-hero-img{margin:0;position:relative;overflow:hidden;background:#111}
.m-hero-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.15) contrast(1.03);animation:lvBreathe 14s ease-in-out infinite alternate}
@media(max-width:899px){.m-hero{grid-template-columns:1fr;min-height:0}.m-hero-img{aspect-ratio:4/5;order:-1}.m-hero-copy{padding:2.4rem 6vw 3rem}.m-facts{gap:1.6rem}}
.m-marquee{overflow:hidden;background:#111;color:#fff;padding:1rem 0;font-family:'Bodoni Moda',Georgia,serif;font-size:1.3rem;white-space:nowrap}
.m-mq-in{display:inline-block;animation:mq 40s linear infinite}
@keyframes mq{to{transform:translateX(-50%)}}
.m-sec{padding:clamp(80px,10vw,140px) 0}
.m-sec--grey{background:#F4F4F1}.m-sec--black{background:#0E0E0E;color:#d9d9d4}
.m-sec--black .m-h2{color:#fff}.m-sec--black .m-eyebrow{color:#E6D7BF}
.m-wrap{width:min(92vw,1320px);margin:auto}
.m-head{margin-bottom:clamp(2rem,4vw,3.4rem)}
.m-h2{font-family:'Bodoni Moda',Georgia,serif;font-weight:400;font-size:clamp(2.2rem,4vw,3.8rem);line-height:1.05;color:#111}
.m-note{margin-top:1rem;max-width:24em;color:#4b4b49}
.m-grid{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:clamp(180px,20vw,300px);gap:12px;margin-bottom:2rem}
.m-tile{position:relative;margin:0;overflow:hidden;background:#eee}
.m-tile--tall{grid-row:span 2}.m-tile--wide{grid-column:span 2}
.m-tile img,.m-tile video{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
.m-tile:hover img,.m-tile:hover video{transform:scale(1.04)}
.m-tile figcaption{position:absolute;left:0;right:0;bottom:0;padding:2.4rem 1rem .9rem;font-size:.74rem;letter-spacing:.08em;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.65))}
.m-tile figcaption .tr{display:none!important}
@media(max-width:719px){.m-grid{grid-template-columns:1fr 1fr;grid-auto-rows:44vw}.m-tile--wide{grid-column:span 2}}
.m-split{display:grid;grid-template-columns:minmax(240px,380px) 1fr;gap:clamp(2rem,6vw,6rem)}
.m-sticky{position:sticky;top:110px;align-self:start}
@media(max-width:899px){.m-split{grid-template-columns:1fr}.m-sticky{position:static}}
.m-menu{border-top:1px solid #111}
.m-menu li{display:grid;grid-template-columns:3.2rem 1fr auto;gap:1.2rem;align-items:start;padding:1.6rem 0;border-bottom:1px solid #d9d9d4}
.m-n{font-family:'Bodoni Moda',Georgia,serif;font-size:1.1rem;color:#7A6440;padding-top:.3rem}
.m-mi h3{font-family:'Bodoni Moda',Georgia,serif;font-weight:400;font-size:1.55rem;color:#111;margin:0}
.m-mi p{margin:.4rem 0 .8rem;color:#4b4b49;max-width:34em}
.m-meta{display:flex;gap:.5rem;color:#77756f}
.m-book{display:inline-flex;align-items:center;min-height:44px;font-size:.82rem;font-weight:500;color:#111;white-space:nowrap}
.m-book:hover{color:#7A6440}
@media(max-width:599px){.m-menu li{grid-template-columns:2.2rem 1fr}.m-book{grid-column:2}}
.m-about{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(2rem,6vw,6rem);align-items:center}
.m-about-img{margin:0;aspect-ratio:4/5;overflow:hidden}.m-about-img img{width:100%;height:100%;object-fit:cover}
.m-quote{font-family:'Bodoni Moda',Georgia,serif;font-size:clamp(1.3rem,2vw,1.7rem);line-height:1.4;color:#111;margin:1.6rem 0}
.m-cert{margin-top:1.4rem;font-size:.82rem;letter-spacing:.06em;color:#7A6440}
.m-sign{font-family:'Parisienne',cursive;font-size:2.2rem;color:#111;margin-top:1rem}
@media(max-width:899px){.m-about{grid-template-columns:1fr}}
.m-studio{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.m-studio figure{margin:0}.m-studio img{width:100%;height:auto;aspect-ratio:3/4;object-fit:cover}
.m-studio figcaption{margin-top:.8rem;font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:#a9a9a3}
@media(max-width:719px){.m-studio{grid-template-columns:repeat(3,72vw);overflow-x:auto;scroll-snap-type:x mandatory}.m-studio figure{scroll-snap-align:start}}
.m-wall{font-family:'Parisienne',cursive;font-size:clamp(2rem,4vw,3.2rem);color:#E6D7BF;text-align:center;margin-top:3rem}
.m-wall .tr{font-family:'Jost',sans-serif;font-size:.9rem;color:#a9a9a3}
.m-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:3rem}
.m-steps li{border:1px solid #e3e3e0;padding:1.8rem}
.m-steps span{font-family:'Bodoni Moda',Georgia,serif;font-size:2.4rem;color:#7A6440}
.m-steps h3{font-family:'Bodoni Moda',Georgia,serif;font-weight:400;font-size:1.35rem;color:#111;margin:.6rem 0}
.m-steps p{color:#4b4b49}
@media(max-width:799px){.m-steps{grid-template-columns:1fr}}
.m-cta{background:#111;color:#fff;text-align:center;padding:clamp(80px,10vw,130px) 6vw}
.m-cta h2{font-family:'Bodoni Moda',Georgia,serif;font-weight:400;font-size:clamp(2.2rem,4.6vw,4.2rem);margin-bottom:2rem}
.pfaq summary{font-family:'Bodoni Moda',Georgia,serif}
`;

export const CSS_V = `
:root{--porcelain:#FBF3EF;--noir:#3A1D24;--cocoa:#3A1D24;--cocoa-soft:#6B4A4E;--gold-text:#9A4F45;--champagne:#F1C7B8;--gold:#C98E7E;
  --hairlt:rgba(154,79,69,.2);--hairlt-strong:rgba(154,79,69,.36);--r:28px}
body{background:#FBF3EF;color:#5b3e42;font-family:'Jost',system-ui,sans-serif;font-size:1.02rem;line-height:1.7}
.edge{display:none}
.rh{position:fixed;top:12px;left:12px;right:12px;z-index:70;display:flex;align-items:center;justify-content:space-between;padding:8px 10px 8px 18px;border-radius:999px;
  background:rgba(251,243,239,.82);backdrop-filter:blur(14px);box-shadow:0 10px 30px -18px rgba(58,29,36,.45);max-width:1100px;margin:auto}
.rh-logo svg{height:36px;width:auto}
.rh-tools{display:flex;align-items:center;gap:.8rem}
.rh .lang{color:#3A1D24}
.rh-menu{min-height:44px;padding:0 1.2rem;border-radius:999px;border:0;background:#3A1D24;color:#FBF3EF;font-size:.78rem;letter-spacing:.08em;cursor:pointer}
.chip{display:inline-flex;align-items:center;gap:.4rem;padding:.5rem 1rem;border-radius:999px;font-size:.78rem;letter-spacing:.04em}
.chip--soft{background:#F5DED5;color:#9A4F45}
.r-hero{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(2rem,5vw,5rem);align-items:center;min-height:100svh;place-items:center stretch;text-align:left;
  padding:110px max(5vw,calc((100vw - 1180px)/2)) 60px;background:radial-gradient(60% 60% at 80% 40%,#F6D9CE 0,#FBF3EF 70%);overflow:hidden}
.r-h1{font-family:'Gilda Display',Georgia,serif;font-weight:400;font-size:clamp(2.6rem,5.4vw,5rem);line-height:1.04;color:#3A1D24;margin:1.4rem 0 1.2rem}
.r-h1 em{font-style:italic;color:#9A4F45}
.r-sub{font-size:1.1rem;max-width:30em}
.r-ctas{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:2rem}
.r-btn{display:inline-flex;align-items:center;min-height:50px;padding:0 1.6rem;border-radius:999px;background:#3A1D24;color:#FBF3EF;font-size:.86rem;font-weight:500;transition:transform .3s,background .3s}
.r-btn:hover{transform:translateY(-2px);background:#9A4F45}
.r-btn--ghost{background:transparent;color:#3A1D24;box-shadow:inset 0 0 0 1px rgba(58,29,36,.3)}.r-btn--ghost:hover{background:#F5DED5}
.r-hero-art{position:relative;height:min(78svh,640px)}
.r-card{margin:0;overflow:hidden;border-radius:var(--r);box-shadow:0 30px 60px -30px rgba(58,29,36,.5);background:#eed}
.r-card img{width:100%;height:100%;object-fit:cover}
.r-card--main{position:absolute;inset:0 12% 0 8%}
.r-card--a,.r-card--b{position:absolute;width:clamp(110px,12vw,160px);aspect-ratio:1;border:6px solid #FBF3EF}
.r-card--a{left:-2%;bottom:8%;animation:float 7s ease-in-out infinite alternate}.r-card--b{right:0;top:10%;animation:float 8s ease-in-out 1s infinite alternate}
@keyframes float{to{transform:translateY(-12px)}}
.chip--float{position:absolute;background:#fff;color:#3A1D24;box-shadow:0 10px 24px -14px rgba(58,29,36,.5)}
.chip--1{right:4%;bottom:18%}.chip--2{left:2%;top:16%}
@media(max-width:899px){.r-hero{grid-template-columns:1fr;padding-top:100px}.r-hero-art{height:110vw;max-height:520px;order:-1}}
.r-sec{padding:clamp(70px,9vw,120px) max(5vw,calc((100vw - 1180px)/2))}
.r-sec--wine{background:#3A1D24;color:#f3dcd3}.r-sec--wine .r-head h2{color:#FBF3EF}.r-sec--wine .r-head span{color:#F1C7B8}
.r-sec--blush{background:#F5E1D9}
.r-head{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:2rem}
.r-head h2{font-family:'Gilda Display',Georgia,serif;font-weight:400;font-size:clamp(2rem,3.8vw,3.2rem);color:#3A1D24;line-height:1.1}
.r-head span{font-size:.86rem;color:#9A4F45}
.r-swipe{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px 4px 26px;margin:0 -4px;scrollbar-width:none}
.r-swipe::-webkit-scrollbar{display:none}
.r-svc{flex:0 0 clamp(250px,26vw,300px);scroll-snap-align:start;background:#fff;border-radius:var(--r);overflow:hidden;box-shadow:0 20px 40px -28px rgba(58,29,36,.45);display:flex;flex-direction:column}
.r-svc img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover}
.r-svc>div{padding:1.2rem 1.3rem 1.3rem;display:flex;flex-direction:column;flex:1}
.r-svc h3{font-family:'Gilda Display',Georgia,serif;font-weight:400;font-size:1.4rem;color:#3A1D24;margin:0 0 .4rem}
.r-svc p{font-size:.94rem;flex:1}
.r-svc-f{display:flex;justify-content:space-between;align-items:center;margin-top:1rem}
.r-svc-f a{display:inline-flex;align-items:center;min-height:42px;padding:0 1.1rem;border-radius:999px;background:#F5DED5;color:#3A1D24;font-size:.8rem;font-weight:500}
.r-svc-f a:hover{background:#3A1D24;color:#fff}
.r-phones{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.r-phone{margin:0;padding:8px;border-radius:34px;background:#24111a;box-shadow:0 30px 50px -30px #000}
.r-phone video{width:100%;aspect-ratio:9/16;object-fit:cover;border-radius:26px;display:block}
.r-phone figcaption{text-align:center;font-size:.8rem;padding:.7rem 0 .3rem;color:#F1C7B8}
@media(max-width:899px){.r-phones{grid-template-columns:repeat(4,62vw);overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:10px}.r-phone{scroll-snap-align:center}}
.r-strip{display:flex;gap:10px;margin-top:2rem;overflow-x:auto;scrollbar-width:none}
.r-strip img{flex:0 0 clamp(110px,14vw,150px);width:clamp(110px,14vw,150px);height:auto;aspect-ratio:1;object-fit:cover;border-radius:18px}
.r-about{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(2rem,5vw,4rem);align-items:center}
.r-about .r-card{aspect-ratio:4/5}
.r-bubble{background:#fff;border-radius:var(--r);padding:clamp(1.8rem,4vw,3rem);box-shadow:0 30px 60px -40px rgba(58,29,36,.5)}
.r-bubble h2{font-family:'Gilda Display',Georgia,serif;font-weight:400;font-size:clamp(2rem,3.4vw,2.8rem);color:#3A1D24;margin-bottom:1rem}
.r-bubble p{margin-bottom:1rem}.r-small{font-style:italic;color:#9A4F45}
@media(max-width:899px){.r-about{grid-template-columns:1fr}}
.r-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:2.4rem}
.r-steps li{background:#fff;border-radius:var(--r);padding:1.8rem}
.r-steps b{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:#3A1D24;color:#FBF3EF;font-weight:500}
.r-steps h3{font-family:'Gilda Display',Georgia,serif;font-weight:400;font-size:1.35rem;color:#3A1D24;margin:1rem 0 .4rem}
@media(max-width:799px){.r-steps{grid-template-columns:1fr}}
.r-studio{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.r-studio .r-card{aspect-ratio:3/4}
@media(max-width:719px){.r-studio{grid-template-columns:1fr 1fr}}
.r-wall{font-family:'Parisienne',cursive;font-size:clamp(2rem,4vw,3rem);color:#9A4F45;text-align:center;margin-top:2.6rem}
.r-wall .tr{font-family:'Jost',sans-serif;font-size:.9rem}
.r-final{padding:0 max(4vw,calc((100vw - 1180px)/2)) clamp(70px,9vw,120px)}
.r-final-card{background:#3A1D24;color:#f3dcd3;border-radius:36px;padding:clamp(3rem,7vw,5.5rem) clamp(1.6rem,6vw,5rem);text-align:center;
  background-image:radial-gradient(60% 80% at 50% 0,rgba(241,199,184,.25),transparent 70%)}
.r-final-card h2{font-family:'Gilda Display',Georgia,serif;font-weight:400;font-size:clamp(2.2rem,5vw,4rem);color:#FBF3EF;margin-bottom:1rem}
.r-final-card .r-ctas{justify-content:center}.r-final-card .r-btn{background:#F1C7B8;color:#3A1D24}.r-final-card .r-btn--ghost{background:transparent;color:#FBF3EF;box-shadow:inset 0 0 0 1px rgba(251,243,239,.4)}
.foot{border-radius:36px 36px 0 0}
.pfaq{background:#fff;border-radius:var(--r);padding:.4rem 1.6rem}
`;

// compact policy accordion reused by IV and V
export function policyList(t) {
  return `<div class="pfaq faq">${POL.map((i) => `<details><summary><span class="t" data-i18n="p.q${i}">${t(`p.q${i}`)}</span></summary><p class="ans" style="padding-left:0" data-i18n="p.a${i}">${t(`p.a${i}`)}</p></details>`).join('')}
  <!-- [CONFIRMAR: políticas 2027] --></div>`;
}
