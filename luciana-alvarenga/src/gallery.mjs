// Builds the chooser page at /demo/luciana-alvarenga-01 — same format as the other JP Silva Digital demos
// (Amairany, Karolayne): a card per design with wide + phone screenshots, swatches, Open and Jump-to links.
// Run after `node src/build.mjs` (needs dist/site) — `node src/gallery.mjs` (local) or `--publish`.
import { writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLISH = process.argv.includes('--publish');
const SLUG = 'luciana-alvarenga-01';
const LIB = join(ROOT, '..', 'jp-web-design', 'public', 'demo');
const SHARED = join(LIB, '_shared', 'luciana-alvarenga');
const SITE = join(ROOT, 'dist', 'site');

const D = [
  { n: 1, slug: 'variacao-1-champagne-glow', path: '/champagne-glow', name: 'Champagne Glow', ground: '#F6EFE6',
    line: 'Porcelana e dourado champanhe. Cinematográfica.', p: 'A base do site da Leti Silva Beauty no estilo da Luciana: retrato de abertura em tela cheia, a galeria “O Olhar” em slideshow, brow lamination como assinatura e o novo estúdio.',
    sw: ['#F6EFE6', '#E8DBCC', '#E9C6A1', '#1A0E0C'], jump: [['Resultados', 'resultados'], ['Serviços', 'servicos'], ['Estúdio', 'estudio'], ['Agendar', 'agendar']] },
  { n: 2, slug: 'variacao-2-noir-dourado', path: '/noir-dourado', name: 'Noir Dourado', ground: '#1A0E0C',
    line: 'Noir e dourado. Noturna e editorial.', p: 'Tela dividida na abertura com o retrato do espelho LA, títulos em Bodoni itálico, a galeria sobre fundo escuro e os serviços em noir.',
    sw: ['#1A0E0C', '#251512', '#E9C6A1', '#E8DBCC'], jump: [['Resultados', 'resultados'], ['Serviços', 'servicos'], ['Estúdio', 'estudio'], ['Agendar', 'agendar']] },
  { n: 3, slug: 'variacao-3-atelier-porcelana', path: '/atelier-porcelana', name: 'Atelier Porcelana', ground: '#FBF4EA',
    line: 'Luminosa, com o arco da marca.', p: 'O arco iluminado da marca como moldura do retrato, como no render “VEM AÍ”; arcos nas fotos e nos cartões de serviço.',
    sw: ['#FBF4EA', '#E8DBCC', '#B08F66', '#312017'], jump: [['Resultados', 'resultados'], ['Serviços', 'servicos'], ['Estúdio', 'estudio'], ['Agendar', 'agendar']] },
  { n: 4, slug: 'variacao-4-preto-e-branco', path: '/preto-e-branco', name: 'Preto & Branco', ground: '#FFFFFF',
    line: 'Branco, preto e um fio de dourado. Atemporal.', p: 'Um site novo, moderno e simples: barra fixa com menu, título ao lado do retrato, grade de resultados, menu de procedimentos e agendamento em três passos.',
    sw: ['#FFFFFF', '#F4F4F1', '#7A6440', '#111111'], jump: [['Resultados', 'resultados'], ['Procedimentos', 'servicos'], ['Como agendar', 'como-agendar']] },
  { n: 5, slug: 'variacao-5-rose', path: '/rose', name: 'Rosé', ground: '#FBF3EF',
    line: 'Rosé e vinho suaves. Acolhedora.', p: 'Outro site novo: cartões arredondados, serviços em slideshow, vídeos em molduras de celular, um cartão “Olá, eu sou a Luciana” e agendamento em três passos.',
    sw: ['#FBF3EF', '#F5DED5', '#9A4F45', '#3A1D24'], jump: [['Serviços', 'servicos'], ['Vídeos', 'resultados'], ['Como agendar', 'como-agendar']] },
];

const base = PUBLISH ? `/demo/${SLUG}` : '.';
const media = PUBLISH ? '/demo/_shared/luciana-alvarenga' : './assets';
const href = (d) => PUBLISH ? `${base}${d.path}` : `${d.slug}.html`;

// screenshots
const shots = join(ROOT, 'assets', 'gallery');
mkdirSync(shots, { recursive: true });
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const b = await chromium.launch();
for (const d of D) {
  for (const [kind, vp, scale] of [['wide', { width: 1440, height: 900 }, 1], ['phone', { width: 390, height: 844 }, 2]]) {
    const c = await b.newContext({ viewport: vp, deviceScaleFactor: scale, reducedMotion: 'reduce' });
    const p = await c.newPage();
    await p.goto('file://' + join(SITE, d.slug + '.html'));
    await p.addStyleTag({ content: '.demo-bar,.mbar,#toTop{display:none!important}' });
    await p.waitForTimeout(900);
    mkdirSync(join(ROOT, 'dist', 'shots'), { recursive: true }); const png = join(ROOT, 'dist', 'shots', `${d.n}-${kind}.png`);
    await p.screenshot({ path: png });
    execFileSync('convert', [png, '-resize', kind === 'wide' ? '1200x' : '520x', '-quality', '74', join(shots, `luciana-${d.n}-${kind}.webp`)]);
    await c.close();
  }
}
await b.close();
if (PUBLISH) {
  mkdirSync(join(SHARED, 'gallery'), { recursive: true });
  for (const d of D) for (const k of ['wide', 'phone']) copyFileSync(join(shots, `luciana-${d.n}-${k}.webp`), join(SHARED, 'gallery', `luciana-${d.n}-${k}.webp`));
}

const card = (d) => `
    <article class="ch-card" aria-labelledby="ch-${d.n}">
      <a class="ch-shots" href="${href(d)}" aria-label="Abrir a prévia ${d.n}, ${d.name}" style="--ground:${d.ground}">
        <span class="ch-wide"><img src="${media}/gallery/luciana-${d.n}-wide.webp" width="1200" height="750" alt="${d.name}: página inicial no computador." loading="lazy" decoding="async"></span>
        <span class="ch-phone"><img src="${media}/gallery/luciana-${d.n}-phone.webp" width="520" height="1125" alt="${d.name}: página inicial no celular." loading="lazy" decoding="async"></span>
      </a>
      <div class="ch-body">
        <p class="ch-k"><span class="ch-n" aria-hidden="true">${d.n}</span> Prévia ${d.n}</p>
        <h3 class="ch-t" id="ch-${d.n}">${d.name}</h3>
        <p class="ch-line">${d.line}</p>
        <p class="ch-p">${d.p}</p>
        <p class="ch-sw" aria-hidden="true">${d.sw.map((c) => `<i style="background:${c}"></i>`).join('')}</p>
        <a class="ch-go" href="${href(d)}">Abrir ${d.name} <span aria-hidden="true">&rarr;</span></a>
        <p class="ch-pages"><span class="ch-pages-k">Ir para</span> ${d.jump.map(([l, id]) => `<a href="${href(d)}#${id}">${l}</a>`).join('')}</p>
      </div>
    </article>`;

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Studio Luciana Alvarenga — cinco prévias · prévia de design</title>
<meta name="description" content="Cinco prévias de site para o Studio Luciana Alvarenga (@studiolucianaalvarenga), por JP Silva Digital. Prévia de design, não é o site oficial.">
<meta name="robots" content="noindex,nofollow,noarchive">
<link rel="canonical" href="https://jpsilvadigital.com/demo/${SLUG}">
<meta property="og:title" content="Studio Luciana Alvarenga — cinco prévias de site">
<meta property="og:description" content="Cinco prévias por JP Silva Digital. Prévia de design, não é o site oficial.">
<meta property="og:image" content="https://jpsilvadigital.com/demo/_shared/luciana-alvarenga/og-default.jpg">
<meta name="theme-color" content="#F7F4F0">
<link rel="stylesheet" href="${media}/chooser/chooser.css">
</head>
<body class="ch">
<main id="main" class="ch-wrap">
  <header class="ch-head">
    <p class="ch-flag">Prévia de design &middot; não é o site oficial</p>
    <h1 class="ch-h">Studio Luciana Alvarenga, <em>cinco caminhos.</em></h1>
    <p class="ch-lede">Cinco sites completos, cada um com sua cara, tipografia e movimento. Todos usam as fotos e os vídeos dela, as palavras dela, as políticas do estúdio e o agendamento pelo WhatsApp, em português e inglês. Abra cada um no celular, navegue, e escolha o favorito.</p>
  </header>
  <section class="ch-round" aria-labelledby="ch-r1">
    <div class="ch-round-head">
      <p class="ch-round-k">Prévias 1–3</p>
      <h2 class="ch-round-h" id="ch-r1">Na linha da Leti Silva Beauty.</h2>
      <p class="ch-round-p">A mesma estrutura, espaço e movimento do site da Leti, vestidos com as cores do estúdio da Luciana: porcelana, champanhe e o arco da marca.</p>
    </div>
    <div class="ch-grid">${D.slice(0, 3).map(card).join('')}
    </div>
  </section>
  <section class="ch-round" aria-labelledby="ch-r2">
    <div class="ch-round-head">
      <p class="ch-round-k">Prévias 4–5</p>
      <h2 class="ch-round-h" id="ch-r2">Dois caminhos novos.</h2>
      <p class="ch-round-p">Estrutura, navegação e seções diferentes: um preto e branco atemporal e um rosé acolhedor.</p>
    </div>
    <div class="ch-grid">${D.slice(3).map(card).join('')}
    </div>
  </section>
  <p class="ch-fine">Prévia de design por JP Silva Digital para o Studio Luciana Alvarenga. É um conceito, não o site oficial. Fotos e vídeos do @studiolucianaalvarenga. O logo foi redesenhado como conceito. Preços, durações, endereço, horário e depoimentos aparecem como espaços reservados até a Luciana confirmar.</p>
</main>
</body>
</html>
`;
if (PUBLISH) writeFileSync(join(LIB, SLUG, 'index.html'), html);
else { writeFileSync(join(SITE, 'index.html'), html); if (!existsSync(join(SITE, 'assets', 'gallery'))) mkdirSync(join(SITE, 'assets', 'gallery'), { recursive: true });
  for (const d of D) for (const k of ['wide', 'phone']) copyFileSync(join(shots, `luciana-${d.n}-${k}.webp`), join(SITE, 'assets', 'gallery', `luciana-${d.n}-${k}.webp`));
  mkdirSync(join(SITE, 'assets', 'chooser'), { recursive: true }); }
console.log('gallery written', PUBLISH ? `/demo/${SLUG}` : 'dist/site/index.html');
