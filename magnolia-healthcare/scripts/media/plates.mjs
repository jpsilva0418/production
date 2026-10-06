/**
 * TEMPORARY DEMO ASSETS — "plates": warm, quiet placeholder imagery for every photo slot.
 * Each plate is a rendered composition (gradient field + magnolia line illustration +
 * light + grain) with a discreet "demo placeholder" label baked in, so a placeholder can
 * never be mistaken for a real photograph. No third-party media is used anywhere.
 * Replace each file with licensed/owner photography of the same aspect ratio (docs/MEDIA.md).
 *
 * Usage: node scripts/media/plates.mjs <path-to-playwright-module-dir> <out-dir>
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const [,, pwDir, outDir] = process.argv;
const require = createRequire(path.join(pwDir, 'package.json'));
const { chromium } = require('playwright');
fs.mkdirSync(outDir, { recursive: true });

const MAGNOLIA = `
<svg viewBox="0 0 400 400" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M200 392 C 196 335, 204 300, 200 252"/>
  <path d="M200 332 C 150 332, 108 302, 92 250 C 148 244, 190 274, 200 332 Z"/>
  <path d="M198 328 C 166 302, 140 278, 118 262"/>
  <path d="M202 302 C 252 297, 292 270, 308 224 C 256 224, 215 256, 202 302 Z"/>
  <path d="M204 298 C 238 276, 266 254, 286 240"/>
  <path d="M200 252 C 138 242, 86 200, 82 136 C 128 148, 180 190, 200 252 Z"/>
  <path d="M200 252 C 262 242, 314 200, 318 136 C 272 148, 220 190, 200 252 Z"/>
  <path d="M200 252 C 158 216, 148 158, 168 106 C 200 138, 206 200, 200 252 Z"/>
  <path d="M200 252 C 242 216, 252 158, 232 106 C 200 138, 194 200, 200 252 Z"/>
  <path d="M200 252 C 178 214, 178 148, 200 90 C 222 148, 222 214, 200 252 Z"/>
  <path d="M200 252 C 166 214, 132 182, 112 162"/>
  <path d="M200 252 C 234 214, 268 182, 288 162"/>
  <path d="M200 252 C 186 220, 186 170, 200 130"/>
</svg>`;

// mood: [bg stops], ink colour for the illustration, label colour, dark?
const MOODS = {
  ivory:  { bg: ['#FBF8F3', '#F1EAE1', '#E9CFC7'], ink: 'rgba(138,106,60,.55)', label: 'rgba(74,84,80,.7)', light: 'rgba(255,253,251,.7)' },
  linen:  { bg: ['#F4EEE6', '#E8E0D4', '#DCD0C0'], ink: 'rgba(30,63,54,.45)', label: 'rgba(74,84,80,.7)', light: 'rgba(255,253,251,.7)' },
  sage:   { bg: ['#F3F1EA', '#E3E6DC', '#C9D2C8'], ink: 'rgba(30,63,54,.42)', label: 'rgba(74,84,80,.7)', light: 'rgba(255,253,251,.65)' },
  petal:  { bg: ['#F9F0EC', '#EFD8D1', '#E2BDB3'], ink: 'rgba(138,106,60,.5)', label: 'rgba(74,84,80,.7)', light: 'rgba(255,253,251,.7)' },
  brass:  { bg: ['#F8F1E6', '#ECDCC5', '#D9C2A1'], ink: 'rgba(30,63,54,.42)', label: 'rgba(74,84,80,.7)', light: 'rgba(255,253,251,.7)' },
  leaf:   { bg: ['#2A5245', '#1E3F36', '#152E27'], ink: 'rgba(205,180,140,.55)', label: 'rgba(248,244,238,.6)', light: 'rgba(205,180,140,.22)', dark: true },
};

// id, width, height, mood, illustration placement (x%, y%, size%, rotate)
const PLATES = [
  ['personal-care',  1600, 1200, 'ivory', [62, 18, 82, -8]],
  ['homemaking',     1600, 1200, 'linen', [-18, 22, 84, 12]],
  ['companionship',  1600, 1200, 'brass', [58, -6, 86, 6]],
  ['dementia',       1600, 1200, 'petal', [60, 24, 80, -14]],
  ['mission',        1600, 1200, 'sage',  [-12, 10, 90, 8]],
  ['community',      1600, 1200, 'petal', [55, 10, 84, -4]],
  ['office',         1600, 1200, 'linen', [60, 30, 78, 10]],
  ['home',           1600, 1200, 'ivory', [-10, 30, 86, -10]],
  ['founder',        1200, 1500, 'leaf',  [20, 38, 95, 0]],
  ['team-1',         1200, 1500, 'ivory', [28, 36, 92, -6]],
  ['team-2',         1200, 1500, 'linen', [-8, 40, 90, 8]],
  ['team-3',         1200, 1500, 'petal', [30, 34, 92, 4]],
  ['cine',           2400, 1030, 'leaf',  [66, -20, 70, -8]],
  ['cine-light',     2400, 1030, 'brass', [-6, -18, 74, 10]],
  ['blog-1',         1600, 1067, 'ivory', [58, 12, 88, -6]],
  ['blog-2',         1600, 1067, 'sage',  [-14, 16, 86, 10]],
  ['blog-3',         1600, 1067, 'petal', [60, -2, 84, 4]],
  ['blog-4',         1600, 1067, 'linen', [-10, 20, 88, -12]],
  ['blog-5',         1600, 1067, 'brass', [56, 18, 86, 8]],
  ['blog-6',         1600, 1067, 'ivory', [-16, 8, 90, -4]],
  ['og',             1200, 630,  'leaf',  [70, -10, 110, -6]],
];

const html = (id, w, h, m, [x, y, s, r]) => `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:${m.bg[1]}}
  .p{position:relative;width:${w}px;height:${h}px;overflow:hidden;
    background:radial-gradient(120% 90% at 18% 12%, ${m.bg[0]} 0%, ${m.bg[1]} 48%, ${m.bg[2]} 100%)}
  .light{position:absolute;inset:-20%;background:linear-gradient(118deg, transparent 36%, ${m.light} 48%, transparent 58%);opacity:.75}
  .glow{position:absolute;inset:0;background:radial-gradient(60% 50% at 78% 82%, ${m.bg[2]} 0%, transparent 70%);opacity:.8}
  .ill{position:absolute;left:${x}%;top:${y}%;width:${s}%;aspect-ratio:1;color:${m.ink};transform:rotate(${r}deg)}
  .ill svg{width:100%;height:100%}
  .vig{position:absolute;inset:0;background:radial-gradient(110% 90% at 50% 50%, transparent 55%, rgba(0,0,0,${m.dark ? '.35' : '.08'}) 100%)}
  .grain{position:absolute;inset:0;opacity:${m.dark ? '.08' : '.06'};
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")}
  .lbl{position:absolute;left:${Math.round(w * .025)}px;bottom:${Math.round(w * .022)}px;font:600 ${Math.round(w * .011)}px/1 'Segoe UI',system-ui,sans-serif;
    letter-spacing:.24em;text-transform:uppercase;color:${m.label}}
</style></head><body><div class="p"><div class="light"></div><div class="glow"></div><div class="ill">${MAGNOLIA}</div><div class="vig"></div><div class="grain"></div>
<div class="lbl">Demo placeholder · licensed photography to follow</div></div></body></html>`;

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [id, w, h, mood, place] of PLATES) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(html(id, w, h, MOODS[mood], place));
  await page.screenshot({ path: path.join(outDir, `${id}.jpg`), type: 'jpeg', quality: 84, fullPage: false });
  await page.close();
  console.log('plate', id, `${w}x${h}`);
}
await browser.close();
