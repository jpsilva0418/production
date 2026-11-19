/* /demo/amairanymua-01 — site "maison": the shell (document, header, menu, footer) and the page kit
   every Maison page is built from. Documented for page authors in KIT.md.

   Maison: her own brand, "Glam By Amairanymua", presented like a fashion house. Black and white
   pages that alternate like a lookbook; red used exactly like a lipstick (the script, one rule, the
   active state); Italiana caps, Mrs Saint Delafield for the script, Hanken Grotesk for everything
   else. Square corners, hairlines, tall portrait frames. */
import { head as stdHead, marker, href, NAV, SITE, HER, REVIEWS, L, A, PHOTOS, src as srcOf, srcset as srcsetOf, finePrint, inquire, book, pic, film, esc, arrow, pagesOf } from '../site.mjs';

export const S = 'maison';
export const M = `${A}/maison`;
export { arrow };

/* ---------- the lockup: "Glam By" over "AMAIRANYMUA" ----------
   Her own logo lockup set as type (she has no logo file). The script is Mrs Saint Delafield as
   outlines taken from the font file itself (HarfBuzz-shaped, kerning applied; one entry per glyph,
   one string per contour), so it is identical everywhere and needs no font download. The caps are
   live Italiana text, one span per letter so the opening can track them in. `draw: true` (the home
   page only) adds the opening's stroke layer: every contour with pathLength="1". */
const GLAM = [{"g":"G","c":["M64 -85Q97 -59 161 -59Q188 -59 225 -64Q260 -105 366 -256Q472 -408 528 -462Q532 -465 532 -470Q532 -476 529 -476L462 -436Q396 -396 300 -356Q204 -316 131 -316Q21 -316 21 -385Q21 -425 59 -482Q0 -485 0 -509Q0 -514 4 -519Q9 -524 12 -524Q15 -524 34 -518Q52 -511 80 -510Q148 -596 253 -664Q358 -732 437 -732Q482 -732 482 -709Q482 -680 420 -630Q358 -580 266 -536Q173 -493 99 -484Q77 -446 77 -417Q77 -354 185 -354Q246 -354 356 -402Q466 -451 578 -537Q733 -658 754 -681Q760 -690 766 -690Q773 -690 778 -685Q783 -680 783 -674Q783 -668 776 -664Q695 -599 615 -512Q535 -426 486 -362Q438 -297 372 -204Q305 -111 278 -75Q343 -92 402 -118Q461 -143 473 -157Q483 -157 483 -146Q483 -131 410 -100Q338 -68 256 -47Q158 74 83 74Q53 74 38 42Q24 11 24 -26Q24 -62 30 -84Q37 -107 46 -107Q54 -107 57 -104Q60 -101 62 -94Q63 -88 64 -85Z","M387 -697Q335 -697 252 -640Q170 -582 119 -513Q209 -527 314 -588Q418 -650 418 -682Q418 -697 387 -697Z","M102 25Q141 25 198 -34Q160 -28 118 -28Q76 -28 56 -48Q48 -47 48 -32Q48 -16 50 -6Q53 5 66 15Q78 25 102 25Z"]},{"g":"l","c":["M805 -166Q812 -171 818 -171Q824 -171 824 -164V-162Q720 -76 666 -42Q596 11 548 11Q506 11 506 -39Q506 -106 592 -238Q679 -369 787 -474Q895 -579 950 -579Q975 -579 975 -557Q975 -502 844 -376Q712 -249 585 -160Q548 -89 548 -52Q548 -15 574 -15Q600 -15 642 -45Q713 -87 780 -145Z","M925 -547Q883 -547 776 -426Q669 -305 599 -184Q714 -266 824 -384Q934 -503 934 -538Q934 -547 925 -547Z"]},{"g":"a","c":["M909 -120Q903 -120 903 -124Q903 -129 910 -135Q943 -162 943 -184Q943 -198 918 -200Q873 -199 810 -135Q748 -71 748 -39Q748 -28 760 -28Q773 -28 794 -45Q813 -57 865 -105Q877 -117 888 -117Q902 -117 902 -104Q902 -99 899 -96Q896 -93 888 -84Q880 -74 874 -66Q856 -40 856 -32Q856 -12 872 -12Q893 -12 951 -50Q1009 -89 1057 -128L1105 -166Q1112 -171 1118 -171Q1124 -171 1124 -164V-162Q1047 -97 962 -40Q876 17 849 17Q817 17 817 -17Q817 -25 820 -32Q823 -39 823 -42Q823 -45 821 -46Q818 -46 782 -19Q747 8 720 8Q694 8 694 -20Q694 -48 732 -96Q769 -143 832 -182Q895 -221 955 -221Q969 -221 978 -214Q988 -207 988 -192Q988 -178 959 -149Q930 -120 909 -120Z"]},{"g":"m","c":["M1111 -174 1109 -185Q1109 -190 1130 -190Q1142 -190 1142 -175Q1142 -160 1108 -108Q1073 -57 1073 -55Q1073 -53 1077 -53Q1081 -53 1170 -123Q1258 -193 1276 -193Q1294 -193 1294 -180Q1294 -168 1284 -152Q1274 -137 1242 -96Q1210 -56 1208 -53Q1206 -50 1206 -46Q1206 -42 1212 -42Q1219 -42 1311 -110Q1403 -178 1416 -178Q1429 -178 1429 -167Q1429 -147 1385 -97Q1341 -47 1341 -34Q1341 -20 1352 -20Q1362 -20 1404 -48Q1479 -98 1542 -149L1564 -167Q1572 -172 1578 -172Q1583 -172 1583 -166V-163Q1372 13 1322 13Q1293 13 1293 -11Q1293 -31 1322 -70Q1351 -109 1351 -112Q1351 -116 1348 -116Q1346 -116 1266 -59Q1187 -2 1172 -2Q1165 -2 1160 -8Q1155 -13 1155 -19Q1155 -37 1198 -92Q1241 -146 1241 -151Q1241 -156 1235 -156Q1228 -156 1093 -46L1043 -6Q1030 5 1024 5Q1017 5 1011 2Q1005 -2 1005 -9Q1005 -16 1022 -43Q1040 -70 1068 -109Q1111 -167 1111 -174Z"]},{"g":"B","c":["M2239 -394Q2239 -394 2283 -397Q2354 -397 2388 -370Q2423 -344 2423 -296Q2423 -247 2379 -182Q2335 -117 2265 -64H2322Q2357 -64 2371 -67Q2385 -70 2387 -70Q2401 -70 2401 -55Q2401 -40 2381 -39Q2304 -39 2233 -41Q2121 30 2013 30Q1962 30 1932 11Q1902 -8 1902 -28Q1902 -47 1918 -58Q1935 -69 1965 -69Q2082 -69 2227 -64Q2287 -113 2323 -178Q2359 -242 2359 -294Q2359 -377 2270 -377Q2235 -377 2198 -366Q2160 -355 2152 -350Q2145 -346 2143 -346Q2137 -346 2137 -354Q2137 -363 2163 -375Q2277 -430 2386 -522Q2495 -613 2495 -652Q2495 -670 2467 -670Q2353 -669 2154 -499Q2114 -396 2022 -246Q1931 -96 1831 22Q1731 141 1682 141Q1652 141 1652 110Q1652 39 1786 -143Q1921 -325 2091 -478Q2121 -551 2121 -584Q2121 -618 2105 -638Q2089 -657 2058 -666Q2009 -679 1954 -679Q1900 -679 1871 -676Q1842 -674 1800 -666Q1759 -659 1733 -640Q1707 -622 1707 -594Q1707 -565 1735 -550Q1763 -534 1804 -528Q1844 -522 1884 -515Q1924 -508 1952 -488Q1980 -467 1980 -430Q1980 -420 1976 -420Q1971 -420 1968 -423Q1966 -426 1960 -435Q1951 -448 1934 -455Q1916 -462 1880 -468Q1843 -475 1810 -482Q1778 -490 1745 -502Q1712 -514 1692 -536Q1672 -558 1672 -588Q1672 -617 1697 -640Q1722 -663 1763 -676Q1847 -701 1938 -701Q2174 -701 2174 -577Q2174 -566 2169 -544Q2371 -707 2497 -707Q2553 -707 2553 -673Q2553 -624 2450 -534Q2348 -444 2239 -394Z","M1707 112Q1736 112 1862 -74Q1989 -259 2065 -419Q1915 -276 1800 -122Q1684 33 1684 89Q1684 112 1707 112Z","M2196 -42 2015 -46Q1938 -46 1938 -23Q1938 -10 1964 2Q1990 13 2024 13Q2113 13 2196 -42Z"]},{"g":"y","c":["M2494 114 2507 97Q2523 78 2527 72Q2498 85 2481 90Q2464 94 2464 96Z","M2499 174Q2499 164 2496 153Q2349 337 2349 373Q2349 376 2352 376Q2369 376 2404 343Q2439 310 2469 261Q2499 212 2499 174Z","M2419 97Q2422 89 2424 88Q2425 87 2431 86Q2437 86 2469 78Q2501 69 2545 50Q2673 -113 2680 -128Q2688 -142 2688 -145Q2688 -148 2684 -148Q2680 -148 2675 -141Q2673 -140 2648 -118Q2624 -95 2600 -76Q2577 -57 2546 -40Q2515 -22 2493 -22Q2471 -22 2471 -38Q2472 -75 2522 -140Q2571 -205 2588 -205Q2605 -205 2605 -196Q2605 -191 2560 -134Q2514 -77 2514 -63Q2514 -49 2523 -49Q2541 -49 2626 -122Q2712 -195 2732 -195Q2738 -195 2744 -189Q2749 -183 2749 -176Q2749 -154 2605 21Q2740 -54 2856 -149L2878 -167Q2886 -172 2891 -172Q2896 -172 2896 -167L2895 -163Q2900 -163 2842 -119Q2784 -75 2735 -41Q2686 -7 2584 45L2513 132Q2527 152 2527 179Q2527 225 2488 282Q2449 338 2400 376Q2352 413 2321 413Q2312 413 2304 406Q2297 400 2297 388Q2297 377 2308 354Q2320 331 2342 300Q2365 270 2385 246Q2405 221 2436 184Q2467 147 2482 129Q2464 113 2442 109Q2419 105 2419 97Z"]}];
/* Ink box of the shaped run: x 0..2896, y -732..413 (font units); the viewBox adds a little air. */
const GLAM_VB = '-50 -770 3000 1220';

/** The lockup. `draw` adds the opening's stroke layer (home header only). The lockup is
 *  decorative inside a labelled link, so it is aria-hidden; pass `label` to make it an image. */
export const lockup = ({ draw = false, cls = '', label = '' } = {}) => {
  const fill = GLAM.map((g, i) => `<path class="lk-g" data-g="${i}" d="${g.c.join('')}"/>`).join('');
  const stroke = draw ? `<g class="lk-sk">${GLAM.map((g, i) => `<g class="lk-sg" data-g="${i}">${g.c.map((d) => `<path pathLength="1" d="${d}"/>`).join('')}</g>`).join('')}</g>` : '';
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
  const caps = HER.brand.caps.split('').map((c) => `<span>${c}</span>`).join('');
  return `<span class="lk${cls ? ` ${cls}` : ''}" ${a11y}><svg class="lk-s" viewBox="${GLAM_VB}" focusable="false" aria-hidden="true"><g class="lk-f">${fill}</g>${stroke}</svg><span class="lk-c">${caps}</span></span>`;
};

/* ---------- navigation ----------
   Maison's own page set (SITES.maison.pages), labelled from NAV where NAV has the page. NAV in
   site.mjs still lists the first three sites' Services and Reviews, which Maison does not have. */
const NOTES = { portfolio: 'The Looks, The Reel', bridal: 'Packages and prices', about: 'Hey Gorgeous', journal: 'Notes from her chair', 'bridal-inquiry': 'Weddings start here' };
export const MNAV = pagesOf(S)
  .filter((p) => p && !p.includes('/'))
  .map((p) => {
    const n = NAV.find((x) => x.path === p);
    return { path: p, label: p === 'journal' ? 'Journal' : n?.label ?? p, menu: p === 'journal' ? 'Journal' : n?.menu ?? p, note: NOTES[p] ?? n?.note ?? '', cta: p === 'bridal-inquiry' };
  });
const cur = (c, p) => (c === p || (p && c.startsWith(`${p}/`)) ? ' aria-current="page"' : '');

/* ---------- small furniture ---------- */
/** Kicker: small tracked caps above a heading, with a short hairline in front. tone 'rouge' makes it red. */
export const kicker = (text, cls = '') => `<p class="kick${cls ? ` ${cls}` : ''}">${text}</p>`;
/** A display heading in Italiana. `text` a string, or [line1, line2]: line 2 is set on its own line,
 *  indented (the lookbook break). h(2, ['The', 'Looks'], 'd-l'). Sizes: d-xxl, d-xl, d-l, d-m, d-s. */
export const h = (level, text, cls = 'd-l', attrs = '') => {
  const [a, b = ''] = Array.isArray(text) ? text : [text];
  return `<h${level} class="${cls}"${attrs ? ` ${attrs}` : ''}>${b ? `<span class="hl">${a}</span> <span class="hl hl--in">${b}</span>` : a}</h${level}>`;
};
/** The red hand-written note: Mrs Saint Delafield in red. AT MOST ONE per page, and only her words. */
export const note = (text, cls = '') => `<p class="note${cls ? ` ${cls}` : ''}">${text}</p>`;
/** A thin red-ruled line of small caps: ruled(HER.booking). */
export const ruled = (text, cls = '') => `<p class="ruled${cls ? ` ${cls}` : ''}">${text}</p>`;
/** "Now booking 2026 & 2027 weddings", ruled in red. */
export const bookingLine = (cls = '') => ruled(HER.booking, cls);
/** A spec line: small caps separated by hairlines. spec(['13 years in makeup', 'Licensed &amp; insured']). */
export const spec = (items, cls = '') => `<ul class="spec${cls ? ` ${cls}` : ''}">${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
/** Both ways to book, as a button pair. tone: 'light' (on white/silk) | 'dark' (on black) | 'rouge' (on the red band). */
export const actions = ({ inq = 'Bridal inquiry', event = 'Book event glam', tone = 'light', cls = '' } = {}) =>
  `<div class="acts acts--${tone}${cls ? ` ${cls}` : ''}">${inquire(S, `${inq} ${arrow}`, `btn btn--pri`)}${book('event', event, 'btn btn--sec')}</div>`;
/** A quiet text link with an arrow: more(href('maison','about'), 'More about Amairany'). */
export const more = (url, label, cls = '') => `<a class="more${cls ? ` ${cls}` : ''}" href="${url}">${label} ${arrow}</a>`;

/** One of her photographs in a frame.
 *  shape: 'tall' (4:5) | 'port' (3:4) | 'vert' (9:16) | 'sq' | 'wide' (3:2) | '' (natural)
 *  cap: small-caps caption under the frame. rv: reveal class on the figure ('rv-im' | 'rv' | ''). */
export const frame = (key, { shape = 'tall', sizes = '(max-width:899px) 92vw, 46vw', alt, eager = false, pos, cls = '', cap = '', rv = 'rv-im' } = {}) =>
  `<figure class="fr${shape ? ` fr--${shape}` : ''}${cls ? ` ${cls}` : ''}${rv ? ` ${rv}` : ''}"><div class="fr-m">${pic(key, { alt, sizes, eager, pos })}</div>${cap ? `<figcaption class="cap">${cap}</figcaption>` : ''}</figure>`;
/** A film frame: the clip when it exists, otherwise the marked slot, in the same frame shapes. */
export const filmFrame = (id, { shape = 'vert', label = 'Reel', cls = '', cap = '', rv = 'rv-im' } = {}) =>
  `<figure class="fr fr--film${shape ? ` fr--${shape}` : ''}${cls ? ` ${cls}` : ''}${rv ? ` ${rv}` : ''}"><div class="fr-m">${film(id, { label })}</div>${cap ? `<figcaption class="cap">${cap}</figcaption>` : ''}</figure>`;
/** The picture-beside-film moment: a photograph and a film frame side by side (side by side at
 *  every width, picture first). */
export const pair = ({ image, film: f = 'f1', cap = '', filmCap = '', alt, pos, cls = '' } = {}) =>
  `<div class="pair${cls ? ` ${cls}` : ''}">${frame(image, { shape: 'tall', sizes: '(max-width:899px) 58vw, 34vw', alt, pos, cap })}${filmFrame(f, { shape: 'vert', cap: filmCap })}</div>`;

/** A section. tone: 'blanc' | 'silk' | 'noir' | 'rouge'. `wrap: false` leaves out the inner .wrap. */
export const section = ({ id = '', tone = 'blanc', cls = '', label = '', labelledby = '', wrap = true }, inner) =>
  `<section class="sec sec--${tone}${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''}${label ? ` aria-label="${esc(label)}"` : ''}${labelledby ? ` aria-labelledby="${labelledby}"` : ''}>${wrap ? `<div class="wrap">${inner}</div>` : inner}</section>`;

/** The title card at the top of an interior page: kicker, big Italiana heading (the page's h1
 *  unless h1:false), a line, actions, and optionally a tall portrait beside it. tone 'blanc' | 'noir'. */
export const cover = ({ kick = '', heading = '', sub = '', actions: acts, image = '', alt, pos, tone = 'blanc', h1 = true, id = '', after = '' } = {}) => `<section class="cover sec--${tone}${image ? ' cover--ph' : ''}"${id ? ` id="${id}"` : ''}>
<div class="wrap cover-in"><div class="cover-txt">
${kick ? kicker(kick, 'rv') : ''}
${h(h1 ? 1 : 2, heading, 'd-xl rv-mask')}
${sub ? `<p class="lede rv" style="--d:.12s">${sub}</p>` : ''}
${acts === false ? '' : `<div class="rv" style="--d:.2s">${acts ?? actions({ tone: tone === 'noir' ? 'dark' : 'light' })}</div>`}
${after}
</div>${image ? frame(image, { shape: 'port', eager: true, alt, pos, sizes: '(max-width:899px) 92vw, 40vw', cls: 'cover-ph', rv: '' }) : ''}</div>
</section>`;

/** The one deliberate red band: a closing call to action. Use once per page, at the end. */
export const closing = ({ kick = 'Two ways to book', heading = ['Secure your', 'wedding day glam.'], line = 'Weddings start with an inquiry. Events book straight onto her calendar.' } = {}) =>
  section({ tone: 'rouge', cls: 'close', label: 'Book' }, `${kicker(kick, 'rv')}${h(2, heading, 'd-xl rv-mask')}${line ? `<p class="lede rv" style="--d:.1s">${line}</p>` : ''}<div class="rv" style="--d:.18s">${actions({ tone: 'rouge' })}</div>${bookingLine('rv')}`);

/** Love Notes: WeddingWire, The Knot and Google as three one-tap links with their ratings, dated. */
export const loveNotes = ({ cls = '' } = {}) => {
  const sites = [...REVIEWS.sites.map((s) => ({ ...s, asOf: SITE.ratingsAsOf })), { ...REVIEWS.google, go: 'Read on Google' }];
  return `<ul class="ln-list${cls ? ` ${cls}` : ''}" data-stag=".08">${sites.map((s) => `<li class="rv"><a class="ln-a" href="${s.href}" rel="external"><span class="ln-n">${s.name}</span><span class="ln-s">${s.score}</span><span class="ln-m">${s.meta} &middot; as of ${s.asOf}</span><span class="ln-go">${s.go} ${arrow}</span></a></li>`).join('')}</ul>`;
};

/** One package card. `price` is set in Italiana; `featured` marks "most popular" in red. */
export const packageCard = (p, { featured = /most popular/i.test(p.who), cls = '' } = {}) => `<article class="pk${featured ? ' pk--pop' : ''}${cls ? ` ${cls}` : ''}">
${featured ? '<p class="pk-tag">Most popular</p>' : ''}<h3 class="pk-n">${p.name}</h3><p class="pk-w">${p.who.replace(/\s*·\s*most popular/i, '')}</p>
<p class="pk-p"><span class="pk-cur">$</span>${p.price}</p>
<ul class="pk-l">${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
</article>`;

/** A pull quote of her own words. */
export const quote = (text, cite = '', cls = '') => `<blockquote class="pq${cls ? ` ${cls}` : ''}"><p>${text}</p>${cite ? `<cite>${cite}</cite>` : ''}</blockquote>`;
/** Questions and answers as native <details>: faq(HER.faq). Works with no script. */
export const faq = (items, cls = '') => `<div class="faq${cls ? ` ${cls}` : ''}">${items.map(([q, a]) => `<details class="faq-i"><summary><span>${q}</span><i aria-hidden="true"></i></summary><div class="faq-a"><p>${a}</p></div></details>`).join('')}</div>`;

/* ---------- the runway rail (home "The Looks"; reused on Portfolio) ----------
   A horizontal swipe rail that ADVANCES ON ITS OWN (site.js), with arrows, a counter, and a pause.
   items: [{ photo, cap } | { film, cap }]. Native scroll-snap does the swiping; nothing is hidden
   without script (it is then a plain swipe rail). */
export const rail = ({ id, items, label = 'Her looks', auto = 3600, tone = 'blanc', cls = '' }) => {
  const n = items.length;
  const pad = (k) => String(k).padStart(2, '0');
  const slides = items.map((it, i) => `<li class="rail-it" data-i="${i}">${it.film
    ? filmFrame(it.film, { shape: 'tall', label: it.cap?.split(' · ')[0] ?? 'Reel', cap: it.cap ?? '', rv: '' })
    : frame(it.photo, { shape: 'tall', sizes: '(max-width:599px) 72vw, (max-width:1099px) 42vw, 26vw', cap: it.cap ?? '', rv: '' })}</li>`).join('');
  return `<div class="rail rail--${tone}${cls ? ` ${cls}` : ''}" id="${id}" data-rail data-auto="${auto}">
<ul class="rail-track" tabindex="0" aria-label="${esc(label)}: swipe, or use the arrow keys">${slides}</ul>
<div class="rail-ctl">
<p class="ctr" aria-hidden="true"><span class="ctr-n" data-rail-n>01</span><span class="ctr-sep"></span><span>${pad(n)}</span></p>
<div class="rail-bar" aria-hidden="true"><i data-rail-bar></i></div>
<div class="rail-btns"><button class="ic-btn" type="button" data-rail-prev aria-label="Previous look" hidden><span aria-hidden="true">&larr;</span></button><button class="ic-btn" type="button" data-rail-next aria-label="Next look" hidden><span aria-hidden="true">&rarr;</span></button><button class="pause" type="button" data-rail-toggle aria-controls="${id}" hidden><span class="pause-i" aria-hidden="true"></span><span class="pause-t">Pause</span></button></div>
</div>
</div>`;
};

/* ---------- the self-advancing wipe slideshow (home hero; reusable) ----------
   keys: photo keys. The first is the eager LCP; the rest load after the page has loaded (site.js).
   Each change is a hard wipe in the direction of reading with a thin red line riding its edge;
   never a cross-fade. Controls are separate (wipeControls) so they can sit anywhere. */
export const wipe = ({ id, keys, caps = [], sizes = '(max-width:899px) 58vw, 36vw', hold = 3200, eager = true, cls = '' }) => {
  const slides = keys.map((k, i) => {
    const P = PHOTOS_OF(k);
    const img = i === 0
      ? pic(k, { sizes, eager })
      : `<img data-src="${P.src}" data-srcset="${P.srcset}" sizes="${sizes}" width="${P.w}" height="${P.h}" alt="${esc(P.alt)}" style="object-position:${P.pos}" decoding="async">`;
    return `<figure class="wipe-s${i === 0 ? ' is-on' : ''}" data-cap="${caps[i] ?? ''}"${i === 0 ? '' : ' aria-hidden="true"'}><div class="wipe-i">${img}</div><i class="wipe-e" aria-hidden="true"></i></figure>`;
  }).join('');
  return `<div class="wipe${cls ? ` ${cls}` : ''}" id="${id}" data-wipe data-hold="${hold}" role="group" aria-roledescription="slideshow" aria-label="Her looks, changing every few seconds">${slides}</div>`;
};
/** The counter, caption and pause for a wipe slideshow. */
export const wipeControls = ({ id, n, cap = '' }) => `<div class="wipe-ctl" data-wipe-ctl="${id}">
<p class="ctr" aria-hidden="true"><span class="ctr-n" data-wipe-n>01</span><span class="ctr-sep"></span><span>${String(n).padStart(2, '0')}</span></p>
<p class="cap wipe-cap" data-wipe-cap aria-hidden="true">${cap}</p>
<button class="pause" type="button" data-wipe-toggle aria-controls="${id}" hidden><span class="pause-i" aria-hidden="true"></span><span class="pause-t">Pause</span></button>
</div>`;

const PHOTOS_OF = (k) => ({ ...PHOTOS[k], src: srcOf(k), srcset: srcsetOf(k) });

/* ---------- header, menu, footer ---------- */
function header(path, draw) {
  const primary = MNAV.filter((n) => !n.cta);
  return `<header class="hd" id="siteHeader">
<div class="hd-in">
<a class="hd-logo" href="${href(S)}" aria-label="Glam By Amairanymua: ${SITE.name}, home">${lockup({ draw })}</a>
<nav class="hd-nav" aria-label="Primary">${primary.map((n) => `<a href="${href(S, n.path)}"${cur(path, n.path)}>${n.label}</a>`).join('')}</nav>
<div class="hd-tools">
${book('event', 'Book event', 'hd-ev')}
${inquire(S, '<span class="hd-cta-b">Bridal </span>inquiry', 'btn btn--pri btn--sm hd-cta', path === 'bridal-inquiry' ? 'aria-current="page"' : '')}
<button class="menu-btn" id="menuOpen" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-btn-t">Menu</span><span class="bars" aria-hidden="true"><i></i><i></i></span></button>
</div>
</div>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" inert>
<div class="menu-top"><a class="hd-logo" href="${href(S)}" aria-label="${SITE.name}, home" tabindex="-1">${lockup()}</a><button class="menu-x" id="menuClose" type="button">Close <span aria-hidden="true">&times;</span></button></div>
<div class="menu-body">
<nav aria-label="Main menu"><ol class="menu-list">
<li><a href="${href(S)}"${path === '' ? ' aria-current="page"' : ''}><span class="mn">01</span><span class="ml">Home</span><span class="mo">Start here</span></a></li>
${MNAV.map((n, i) => `<li><a href="${href(S, n.path)}"${cur(path, n.path)}><span class="mn">${String(i + 2).padStart(2, '0')}</span><span class="ml">${n.menu}</span><span class="mo">${n.note}</span></a></li>`).join('\n')}
</ol></nav>
<div class="menu-side">
${bookingLine()}
${actions({ tone: 'dark' })}
<div class="menu-links">
<p class="menu-h">Follow</p>
<a href="${L.ig}" rel="external">Instagram</a><a href="${L.tiktok}" rel="external">TikTok</a><a href="${L.google}" rel="external">Google reviews</a>
<p class="menu-h">${HER.links.reviewsName}</p>
<a href="${L.ww}" rel="external">WeddingWire 5.0</a><a href="${L.knot}" rel="external">The Knot 5.0</a>
</div>
</div>
</div>
<p class="menu-foot">${HER.badges.join(' &middot; ')} &middot; ${SITE.area}</p>
</div>`;
}

function footer() {
  return `<footer class="ft">
<div class="wrap">
<div class="ft-top">
<a class="ft-logo" href="${href(S)}" aria-label="Glam By Amairanymua: ${SITE.name}, home">${lockup()}</a>
${bookingLine('ft-book')}
${actions({ tone: 'dark', cls: 'ft-acts' })}
</div>
<div class="ft-grid">
<div><p class="ft-h">Explore</p><ul class="ft-l"><li><a href="${href(S)}">Home</a></li>${MNAV.map((n) => `<li><a href="${href(S, n.path)}">${n.menu}</a></li>`).join('')}</ul></div>
<div><p class="ft-h">Book</p><ul class="ft-l"><li>${inquire(S, 'Bridal inquiry')}</li><li>${book('bridal-services', 'Bridal services')}</li><li>${book('event', 'Event hair &amp; makeup')}</li><li><a href="${L.mail}">Email</a></li></ul></div>
<div><p class="ft-h">Follow</p><ul class="ft-l"><li><a href="${L.ig}" rel="external">Instagram ${SITE.handle}</a></li><li><a href="${L.tiktok}" rel="external">TikTok ${SITE.handle}</a></li><li><a href="${L.google}" rel="external">Google reviews</a></li></ul></div>
<div><p class="ft-h">${HER.links.reviewsName}</p><ul class="ft-l"><li><a href="${L.ww}" rel="external">WeddingWire &middot; 5.0 &middot; 31</a></li><li><a href="${L.knot}" rel="external">The Knot &middot; 5.0 &middot; 4</a></li><li><a href="${L.google}" rel="external">Google &middot; ${REVIEWS.google.score} &middot; ${REVIEWS.google.meta.replace(/\D+$/, '')}</a></li></ul></div>
</div>
<div class="ft-base">
${spec([SITE.name, ...HER.badges, SITE.areaLong])}
<p class="ft-fine">${finePrint()}</p>
</div>
</div>
</footer>`;
}

/* ---------- the document ---------- */
const FONT_PRELOAD = ['italiana-400', 'hanken-grotesk-var'].map((f) => `<link rel="preload" href="${A}/fonts/${f}.woff2" as="font" type="font/woff2" crossorigin>`).join('\n');

/** A whole Maison document.
 *  path, title, description: as head() in site.mjs.  main: the page's content (inside <main id="main">).
 *  head: extra <head> markup (a preload for the page's lead image, say).  css / js: extra file names
 *  in assets/maison/ (without extension), e.g. css: ['pages-work'], js: ['pages-work'].
 *  bodyClass: extra classes on <body>.  opening: markup inserted first in <body> (home only: the
 *  intro gate and overlay); when given, the header lockup carries the opening's stroke layer.
 *  foot: extra markup after the scripts (e.g. inquiryFoot()). */
export const page = ({ path = '', title, description, main, head = '', css = [], js = [], bodyClass = '', opening = '', foot = '' }) => `<!doctype html>
<html lang="en">
<head>
${stdHead(S, { path, title, description })}
${FONT_PRELOAD}
<link rel="stylesheet" href="${M}/site.css">
${css.map((c) => (c.includes('/') ? `<link rel="stylesheet" href="${c}">` : `<link rel="stylesheet" href="${M}/${c}.css">`)).join('\n')}
<script>(function(d){d.classList.add('js');setTimeout(function(){if(!window.__maison)d.classList.remove('js');},3500);})(document.documentElement);</script>
${head}
</head>
<body class="maison${bodyClass ? ` ${bodyClass}` : ''}">
${opening}<a class="skip" href="#main">Skip to content</a>
${header(path, !!opening)}
<main id="main">
${main}
</main>
${footer()}
${marker(S, path)}
<script src="${M}/site.js" defer></script>
${js.map((j) => (j.includes('/') ? `<script src="${j}" defer></script>` : `<script src="${M}/${j}.js" defer></script>`)).join('\n')}
${foot}
</body>
</html>
`;
