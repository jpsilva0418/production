/* /demo/amairanymua-01 — site "atelier": the shell (document, header, menu, footer) and the page
   kit every Atelier page is built from. Documented for page authors in KIT.md.

   Atelier: an ivory atelier. Ivory paper, her espresso as the ink, very tall thin condensed caps
   (Noto Serif Display at its narrowest width), Allura for her "Glam By", Montserrat (the face of
   her own booking graphics) for everything else. Square corners, taupe hairlines, arched tops on
   portrait frames and film windows. One espresso band per page at most. */
import { head as stdHead, marker, href, NAV, SITE, HER, REVIEWS, FINAL, FOOTER, L, A, PHOTOS, FILMS, src as srcOf, srcset as srcsetOf, finePrint, inquire, book, pic, film, esc, arrow, pagesOf } from '../site.mjs';

export const S = 'atelier';
/** This site's asset folder: `${AT}/home.css` */
export const AT = `${A}/atelier`;
export { arrow };

/* ---------- the lockup: "Glam By" over "AMAIRANYMUA" ----------
   Her own logo lockup set as type (she has no logo file; finePrint() says so). "Glam By" is Allura
   as outlines taken from the font file (HarfBuzz-shaped, kerning applied, @fontsource/allura 5.3.0,
   OFL), defined ONCE per page as a <symbol> and drawn with <use>, so the lockup is identical
   everywhere and needs no font download before the opening. The caps are live text, one span per
   letter so the opening can raise them from a mask. */
const GLAM_D = 'M282 370Q246 370 224 350Q203 330 203 296Q203 269 218 236Q233 202 266 165Q334 87 418 37Q501-13 597-44Q611-82 623-122Q635-161 647-201Q598-155 539-110Q480-64 414-34Q348-3 277-3Q225-3 178-22Q132-42 103-82Q74-122 74-185Q74-340 212-464Q292-537 386-570Q481-602 586-602Q598-602 620-600Q643-597 667-590Q691-582 709-568Q727-555 730-534Q731-530 731-527Q731-524 731-521Q731-509 727-503Q723-497 718-497Q708-497 708-513Q706-540 690-554Q675-569 652-574Q630-579 607-579Q570-579 518-564Q467-548 410-520Q353-493 298-456Q242-418 197-374Q152-329 125-280Q98-231 98-181Q98-112 144-82Q189-51 259-51Q327-51 403-75Q460-92 501-118Q542-143 579-176Q616-210 658-250Q676-296 705-309Q734-322 759-322Q773-322 784-320Q795-318 799-318Q807-317 807-312Q807-303 795-305Q764-307 741-276Q718-246 704-204Q691-169 679-132Q667-95 653-58Q704-72 729-72Q741-72 745-69Q749-66 749-61Q749-52 742-55Q736-57 729-57Q716-57 696-52Q676-48 660-41Q644-34 640-24Q597 85 549 160Q501 235 452 282Q404 328 360 349Q316 370 282 370ZM310 344Q347 344 383 316Q419 287 452 242Q486 197 514 146Q541 95 561 49Q581 3 591-25Q509 2 439 47Q369 92 314 160Q284 197 270 229Q257 261 257 286Q257 313 272 328Q286 344 310 344ZM902 10Q860 10 844-11Q827-32 827-63Q827-92 840-136Q854-180 876-231Q898-282 924-332Q949-383 974-426Q1000-468 1019-494Q1038-519 1060-544Q1082-569 1109-586Q1136-603 1170-603Q1193-603 1210-590Q1226-578 1226-553Q1226-543 1222-530Q1219-517 1211-503Q1150-397 1066-307Q981-217 887-140Q883-125 880-113Q876-101 874-94Q873-89 873-84Q873-78 873-73Q873-49 881-31Q889-13 908-13Q926-13 952-30Q979-48 1006-74Q1033-99 1055-123Q1077-147 1086-160Q1089-163 1092-163Q1096-163 1098-159Q1101-155 1098-149Q1088-132 1066-107Q1044-82 1017-56Q990-31 965-12Q934 10 902 10ZM901-180Q939-206 980-248Q1021-289 1060-338Q1100-387 1132-435Q1165-483 1185-522Q1191-533 1194-542Q1196-550 1196-557Q1196-576 1180-576Q1166-576 1145-561Q1091-519 1045-454Q999-388 963-316Q927-244 901-180ZM1351 10Q1334 10 1320 2Q1305-6 1298-28Q1295-37 1295-53Q1295-75 1301-102Q1307-129 1314-148Q1309-146 1296-130Q1282-115 1262-94Q1243-72 1220-50Q1196-29 1171-15Q1146-1 1122-1Q1106-1 1088-10Q1070-20 1059-35Q1044-55 1044-76Q1044-103 1062-132Q1081-161 1110-188Q1140-216 1174-238Q1207-261 1238-276Q1268-292 1287-297Q1307-303 1332-303Q1346-303 1361-300Q1376-296 1386-288Q1394-284 1399-277Q1404-270 1404-262Q1404-254 1397-257Q1389-269 1376-272Q1362-276 1348-276Q1308-276 1260-250Q1212-224 1174-189Q1162-179 1142-154Q1121-130 1104-101Q1087-72 1087-48Q1087-35 1094-25Q1098-18 1107-18Q1121-18 1144-33Q1168-48 1193-70Q1218-91 1238-111Q1259-131 1268-140Q1273-145 1288-160Q1302-176 1319-194Q1336-212 1350-225Q1363-238 1367-238Q1372-238 1384-236Q1395-233 1403-228Q1411-223 1406-215Q1380-177 1364-136Q1349-94 1346-70Q1345-66 1345-62Q1345-59 1345-55Q1345-15 1373-15Q1388-15 1413-33Q1438-51 1464-76Q1490-101 1512-124Q1533-148 1541-160Q1544-163 1547-163Q1551-163 1554-160Q1557-156 1554-151Q1543-133 1522-108Q1501-83 1475-58Q1449-33 1424-15Q1411-5 1391 2Q1371 10 1351 10ZM1508 13Q1500 13 1503 6Q1507-1 1518-30Q1528-58 1542-97Q1555-136 1568-172Q1558-157 1546-143Q1535-129 1527-120Q1524-117 1523-117Q1520-117 1520-123Q1520-135 1526-145Q1547-172 1558-188Q1569-203 1576-216Q1584-228 1592-244Q1594-255 1600-271Q1605-287 1626-287Q1657-287 1657-274Q1657-270 1655-266Q1653-261 1651-256Q1639-229 1625-194Q1611-159 1600-128Q1588-97 1582-80Q1593-94 1615-120Q1637-145 1666-176Q1694-206 1724-234Q1755-261 1782-279Q1809-297 1828-297Q1851-297 1851-271Q1851-251 1835-219Q1828-204 1816-178Q1804-153 1797-140Q1815-156 1838-176Q1861-195 1886-212Q1912-229 1934-237Q1939-239 1954-244Q1969-248 1980-248Q1995-248 1995-238Q1995-231 1988-223Q1971-197 1958-168Q1944-138 1936-112Q1928-86 1926-70Q1925-66 1925-62Q1925-59 1925-55Q1925-15 1951-15Q1967-15 1992-32Q2017-50 2043-76Q2069-101 2090-124Q2112-148 2120-160Q2123-163 2126-163Q2130-163 2132-160Q2135-157 2133-152Q2124-135 2102-110Q2081-84 2054-58Q2028-33 2003-15Q1990-5 1970 2Q1951 10 1931 10Q1913 10 1898 2Q1884-6 1877-28Q1874-37 1874-51Q1874-73 1880-101Q1886-129 1893-148Q1898-162 1906-180Q1915-197 1922-209Q1891-197 1862-173Q1833-149 1810-124Q1786-100 1770-84Q1766-73 1754-66Q1743-59 1733-59Q1718-59 1718-72Q1718-77 1721-84Q1731-108 1744-134Q1756-159 1766-180Q1777-201 1781-209Q1789-223 1789-231Q1789-239 1782-239Q1775-239 1759-230Q1743-221 1717-198Q1696-179 1671-148Q1646-118 1623-86Q1600-54 1582-31Q1565-8 1558-4Q1552-1 1534 6Q1517 13 1508 13ZM2660 61Q2603 61 2565 39Q2527 17 2520-29V-35Q2512-24 2502-9Q2491 6 2480 16Q2468 27 2456 27Q2454 27 2444 25Q2435 23 2426 20Q2418 17 2417 13Q2414-6 2426-42Q2439-77 2460-120Q2480-163 2502-206Q2525-249 2544-284Q2563-318 2571-336Q2577-347 2579-354Q2581-362 2581-366Q2581-372 2579-376Q2581-388 2594-408Q2606-428 2625-448Q2644-468 2666-482Q2688-495 2707-495Q2713-495 2726-492Q2738-488 2750-481Q2761-474 2764-461Q2765-458 2765-455Q2765-452 2763-452Q2761-452 2758-454Q2754-455 2752-455Q2729-455 2702-433Q2675-411 2646-374Q2618-337 2591-293Q2564-249 2540-204Q2515-160 2497-122Q2479-85 2469-62Q2461-40 2461-31Q2461-17 2472-17Q2486-17 2502-36Q2513-49 2522-60Q2532-72 2539-70Q2553-70 2558-62Q2563-55 2564-45Q2565-35 2566-27Q2573 4 2598 24Q2624 45 2670 45Q2719 45 2758 29Q2797 13 2820-16Q2843-44 2843-80Q2843-105 2831-132Q2819-160 2793-188Q2771-214 2744-237Q2717-260 2698-280Q2678-299 2678-313Q2678-325 2694-334Q2710-344 2720-344Q2743-344 2778-353Q2814-362 2852-378Q2890-393 2922-412Q2953-431 2968-450Q2977-461 2982-474Q2988-486 2988-498Q2988-517 2972-532Q2955-548 2916-555Q2905-558 2890-559Q2875-560 2858-560Q2807-560 2740-550Q2673-541 2604-523Q2535-505 2475-478Q2415-451 2376-416Q2338-380 2333-337Q2331-312 2345-299Q2359-286 2378-280Q2397-273 2408-267Q2417-263 2417-259Q2417-254 2406-254Q2394-254 2376-260Q2358-266 2340-278Q2323-291 2312-309Q2301-327 2304-351Q2304-353 2303-358Q2302-364 2302-367Q2305-399 2330-428Q2354-457 2388-481Q2421-505 2450-521Q2482-538 2527-552Q2572-567 2624-578Q2675-589 2728-596Q2781-602 2827-602Q2876-602 2913-594Q2963-583 2990-555Q3017-527 3017-493Q3016-456 2994-428Q2973-401 2939-382Q2905-363 2866-350Q2826-338 2788-332Q2750-326 2722-325Q2764-300 2806-270Q2847-239 2874-203Q2902-167 2902-124Q2902-100 2892-74Q2881-49 2858-20Q2828 17 2774 39Q2721 61 2660 61ZM2938 367Q2926 364 2917 361Q2898 351 2890 338Q2882 326 2882 312Q2882 289 2898 262Q2913 236 2938 208Q2963 178 3002 147Q3040 116 3082 88Q3124 59 3156 38Q3173 3 3192-37Q3210-77 3227-114Q3244-152 3256-183Q3269-214 3275-231Q3259-212 3238-184Q3217-155 3192-124Q3167-92 3140-64Q3114-36 3086-18Q3058-1 3031-1Q2991-1 2976-22Q2960-42 2960-70Q2960-90 2966-110Q2971-130 2980-147Q2986-159 2999-179Q3012-199 3029-220Q3046-241 3064-255Q3081-269 3097-269Q3116-269 3126-256Q3136-242 3128-237Q3112-226 3088-204Q3065-181 3042-152Q3036-144 3028-127Q3019-110 3012-90Q3005-71 3005-55Q3005-48 3007-42Q3009-35 3014-32Q3022-26 3032-26Q3046-26 3064-35Q3081-44 3097-58Q3153-112 3197-171Q3241-230 3290-288Q3293-298 3307-298Q3323-298 3340-288Q3358-279 3355-273Q3346-253 3332-220Q3317-187 3300-149Q3283-111 3266-74Q3249-36 3235-6Q3247-12 3278-36Q3309-60 3346-94Q3383-129 3413-166Q3419-172 3422-172Q3428-172 3428-164Q3428-157 3422-148Q3407-128 3380-101Q3354-74 3324-46Q3293-19 3264 4Q3235 26 3214 38Q3183 104 3154 162Q3125 221 3101 257Q3085 282 3062 308Q3039 334 3012 352Q2985 369 2955 369Q2951 369 2947 368Q2943 368 2938 367ZM2941 345Q2949 345 2960 340Q2972 335 2985 324Q3023 293 3049 252Q3075 210 3096 164Q3116 118 3137 76Q3098 105 3049 144Q3000 184 2960 223Q2936 247 2925 270Q2914 294 2914 312Q2914 345 2941 345Z';
/* the ink box of the shaped run is x 74..3428, y -603..370 (font units). The symbol carries this
   viewBox; each <svg> that draws it uses 0 0 3420 1040 (the <use> maps the symbol into that box). */
const GLAM_VB = '40 -640 3420 1040';
const SYMBOL = `<svg class="sym" aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden"><symbol id="glamby" viewBox="${GLAM_VB}"><path d="${GLAM_D}"/></symbol></svg>`;

/** The lockup. Decorative inside a labelled link (aria-hidden); pass `label` to make it an image.
 *  cls: 'lk--lg' (footer size), 'lk--ivory' (on espresso). */
export const lockup = ({ cls = '', label = '' } = {}) => {
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
  const caps = HER.brand.caps.split('').map((c) => `<span>${c}</span>`).join('');
  return `<span class="lk${cls ? ` ${cls}` : ''}" ${a11y}><svg class="lk-s" viewBox="0 0 3420 1040" focusable="false" aria-hidden="true"><use href="#glamby" width="3420" height="1040"/></svg><span class="lk-c">${caps}</span></span>`;
};

/* ---------- navigation ----------
   Atelier's own page set (SITES.atelier.pages), labelled from NAV where NAV has the page (NAV still
   lists the first three sites' Services and Reviews, which Atelier does not have). */
const NOTES = { portfolio: 'The Looks · The Reel', bridal: 'Packages &amp; prices', about: 'Hey Gorgeous', journal: 'Notes from her chair', 'bridal-inquiry': 'Weddings start here' };
export const ANAV = pagesOf(S)
  .filter((p) => p && !p.includes('/'))
  .map((p) => {
    const n = NAV.find((x) => x.path === p);
    const label = p === 'journal' ? 'Journal' : p === 'about' ? 'About' : n?.label ?? p;
    return { path: p, label, menu: p === 'journal' ? 'Journal' : p === 'about' ? 'About' : n?.menu ?? label, note: NOTES[p] ?? n?.note ?? '', cta: p === 'bridal-inquiry' };
  });
const cur = (c, p) => (c === p || (p && c.startsWith(`${p}/`)) ? ' aria-current="page"' : '');
const pad2 = (k) => String(k).padStart(2, '0');

/* ---------- type furniture ---------- */
/** Kicker: small tracked caps above a heading. cls 'kick--c' centres it between two hairlines. */
export const kicker = (text, cls = '') => `<p class="kick${cls ? ` ${cls}` : ''}">${text}</p>`;
/** A display heading in the tall caps. `text` a string, or an array of lines (each its own line,
 *  each rises from a mask with .rv-mask). h(2, ['The', 'Experience'], 'd-xl rv-mask', 'id="expH"').
 *  Sizes: d-hero, d-xl, d-l, d-m, d-s. */
export const h = (level, text, cls = 'd-l', attrs = '') => {
  const lines = Array.isArray(text) ? text : [text];
  return `<h${level} class="${cls}"${attrs ? ` ${attrs}` : ''}>${lines.map((l) => `<span class="hl"><span>${l}</span></span>`).join(' ')}</h${level}>`;
};
/** A short paragraph in the lede size. */
export const lede = (text, cls = '') => `<p class="lede${cls ? ` ${cls}` : ''}">${text}</p>`;
/** A script word or signature in Allura. Only her words or her name; at most two per page. */
export const sig = (text, cls = '') => `<p class="sig${cls ? ` ${cls}` : ''}">${text}</p>`;
/** "Now booking 2026 & 2027 weddings" between two hairlines. */
export const bookingLine = (cls = '') => `<p class="booking${cls ? ` ${cls}` : ''}"><span>${HER.booking}</span></p>`;
/** A spec line: small caps separated by thin dots. spec(['13 years in makeup', 'Licensed &amp; insured']). */
export const spec = (items, cls = '') => `<ul class="spec${cls ? ` ${cls}` : ''}">${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
/** Both ways to book, as a button pair: the bridal inquiry (solid) and event glam (outline).
 *  tone: 'light' (ivory, linen, paper) | 'dark' (the espresso band, the menu). align: '' | 'c' (centred). */
export const actions = ({ inq = 'Bridal inquiry', event = 'Book event glam', tone = 'light', align = '', cls = '' } = {}) =>
  `<div class="acts acts--${tone}${align ? ` acts--${align}` : ''}${cls ? ` ${cls}` : ''}">${inquire(S, `<span>${inq}</span>`, 'btn btn--pri')}${book('event', `<span>${event}</span>`, 'btn btn--sec')}</div>`;
/** A quiet text link in small caps with an arrow: more(href(S, 'about'), 'More about Amairany'). */
export const more = (url, label, cls = '') => `<a class="more${cls ? ` ${cls}` : ''}" href="${url}">${label} ${arrow}</a>`;
/** The closing row of a section: centred buttons or links. next(inquire(S, 'Begin your inquiry', 'btn btn--pri'), more(...)). */
export const next = (...items) => `<div class="next rv">${items.join('')}</div>`;

/* ---------- frames ---------- */
const capHtml = (cap, credit) => (cap || credit ? `<figcaption class="cap">${cap ?? ''}${credit ? `<span class="cap-cr">Makeup by ${SITE.first} &middot; ${credit}</span>` : ''}</figcaption>` : '');

/** One of her photographs in an ARCHED window (the signature shape).
 *  ar: aspect ratio of the window, width/height as a CSS ratio ('3/5' default, '2/3', '5/8', '4/5').
 *  line: true adds the fine taupe arch drawn 8px outside the window.
 *  cap: small-caps caption; a collaborator's credit (PHOTOS[k].credit) is added automatically.
 *  rv: reveal class on the figure ('rv-arch' opens it from the bottom; 'rv'; '').
 *  sizes: ALWAYS give the real rendered width. A reel still (576 wide) must never be wider than
 *  ~600 CSS px. */
export const arch = (key, { ar = '3/5', sizes = '(max-width:899px) 70vw, 30vw', alt, eager = false, pos, cls = '', cap = '', line = false, rv = 'rv-arch' } = {}) =>
  `<figure class="arch${line ? ' arch--line' : ''}${cls ? ` ${cls}` : ''}${rv ? ` ${rv}` : ''}" style="--ar:${ar}"><div class="arch-w"><div class="arch-m">${pic(key, { alt, sizes, eager, pos })}</div></div>${capHtml(cap, PHOTOS[key]?.credit)}</figure>`;
/** One of her clips in an arched window (plays near the viewport, poster otherwise). Credits for
 *  collaborations are printed inside the frame by film(). */
export const archFilm = (id, { ar = '3/5', cls = '', cap = '', line = false, rv = 'rv-arch', label = '' } = {}) =>
  `<figure class="arch arch--film${line ? ' arch--line' : ''}${cls ? ` ${cls}` : ''}${rv ? ` ${rv}` : ''}" style="--ar:${ar}"><div class="arch-w"><div class="arch-m">${film(id, { label: label || FILMS[id].label })}</div></div>${capHtml(cap)}</figure>`;
/** A photograph in a square-cornered frame. ar as above ('4/5' default, '3/4', '1/1', '3/2', '16/9'). */
export const frame = (key, { ar = '4/5', sizes = '(max-width:899px) 92vw, 44vw', alt, eager = false, pos, cls = '', cap = '', rv = 'rv' } = {}) =>
  `<figure class="fr${cls ? ` ${cls}` : ''}${rv ? ` ${rv}` : ''}" style="--ar:${ar}"><div class="fr-m">${pic(key, { alt, sizes, eager, pos })}</div>${capHtml(cap, PHOTOS[key]?.credit)}</figure>`;
/** A clip in a square-cornered frame ('9/16' default: her clips are portrait). */
export const filmFrame = (id, { ar = '9/16', cls = '', cap = '', rv = 'rv', label = '' } = {}) =>
  `<figure class="fr fr--film${cls ? ` ${cls}` : ''}${rv ? ` ${rv}` : ''}" style="--ar:${ar}"><div class="fr-m">${film(id, { label: label || FILMS[id].label })}</div>${capHtml(cap)}</figure>`;
/** The picture-beside-film moment: a photograph and a clip side by side, two arches of different
 *  heights, bottom-aligned, at every width. */
export const pair = ({ image, film: f = 'f5', cap = '', filmCap = '', alt, pos, cls = '' } = {}) =>
  `<div class="pair${cls ? ` ${cls}` : ''}">${arch(image, { ar: '3/5', sizes: '(max-width:599px) 44vw, (max-width:1099px) 30vw, 300px', alt, pos, cap })}${archFilm(f, { ar: '5/8', cap: filmCap })}</div>`;

/* ---------- sections ---------- */
/** A section. tone: 'ivory' | 'linen' | 'paper' | 'espresso' (at most one espresso per page).
 *  rule: true draws a hairline across the top (between two sections of the same tone).
 *  wrap: false leaves out the inner .wrap (for full-bleed rails). */
export const section = ({ id = '', tone = 'ivory', cls = '', label = '', labelledby = '', wrap = true, rule = false }, inner) =>
  `<section class="sec sec--${tone}${rule ? ' sec--rule' : ''}${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''}${label ? ` aria-label="${esc(label)}"` : ''}${labelledby ? ` aria-labelledby="${labelledby}"` : ''}>${wrap ? `<div class="wrap">${inner}</div>` : inner}</section>`;
/** A section heading block. align: 'c' (centred, the default) | 'l'. id goes on the heading. */
export const sectionHead = ({ kick = '', heading, size = 'd-l', id = '', line = '', align = 'c', level = 2 }) =>
  `<div class="sh sh--${align}">${kick ? kicker(kick, `${align === 'c' ? 'kick--c ' : ''}rv`) : ''}${h(level, heading, `${size} rv-mask`, id ? `id="${id}"` : '')}${line ? lede(line, 'rv') : ''}</div>`;

/** The title card at the top of an interior page: kicker, the page's h1 in the tall caps, a line,
 *  both actions and the booking line, so the first screen of every page has both ways to book.
 *  With `image` (a photo key) or `film` (a FILMS id) an arched window stands beside the words on
 *  wide screens and under them on phones. tone 'ivory' | 'linen'. */
export const cover = ({ kick = '', heading = '', sub = '', actions: acts, image = '', film: f = '', alt, pos, tone = 'ivory', id = '', after = '' } = {}) => {
  const media = f ? archFilm(f, { ar: '3/5', cls: 'cover-m', rv: '', line: true }) : image ? arch(image, { ar: '3/5', eager: true, alt, pos, sizes: '(max-width:899px) 62vw, 380px', cls: 'cover-m', rv: '', line: true }) : '';
  return `<section class="cover sec--${tone}${media ? ' cover--m' : ''}"${id ? ` id="${id}"` : ''}>
<div class="wrap cover-in"><div class="cover-t">
${kick ? kicker(kick, 'rv') : ''}
${h(1, heading, 'd-xl rv-mask')}
${sub ? `<p class="lede rv" style="--d:.12s">${sub}</p>` : ''}
${acts === false ? '' : `<div class="rv" style="--d:.2s">${acts ?? actions()}</div>`}
${bookingLine('rv')}
${after}
</div>${media}</div>
</section>`;
};

/* ---------- content furniture ---------- */
/** Numbered steps (The Experience): items [{ n?, title, body, image?, pos? }]. */
export const steps = (items, cls = '') => `<ol class="steps${cls ? ` ${cls}` : ''}" data-stag=".1">${items.map((it, i) => `<li class="step rv">${it.image ? frame(it.image, { ar: '4/5', sizes: '(max-width:899px) 92vw, 30vw', pos: it.pos, rv: '' }) : ''}<p class="step-n" aria-hidden="true">${it.n ?? pad2(i + 1)}</p><h3 class="d-s step-t">${it.title}</h3><p class="step-b">${it.body}</p></li>`).join('')}</ol>`;

/** One package card. Price in the tall caps; `featured` marks "Most popular". tone 'dark' on the espresso band. */
export const packageCard = (p, { featured = /most popular/i.test(p.who), cls = '' } = {}) => `<article class="pk${featured ? ' pk--pop' : ''}${cls ? ` ${cls}` : ''}">
${featured ? '<p class="pk-tag">Most popular</p>' : ''}<h3 class="pk-n">${p.name}</h3><p class="pk-w">${p.who.replace(/\s*·\s*most popular/i, '')}</p>
<p class="pk-p"><span class="pk-cur">$</span>${p.price}</p>
<ul class="pk-l">${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
</article>`;

/** Love Notes: WeddingWire, The Knot and Google as three quiet one-tap links with their ratings, dated. */
export const loveNotes = ({ cls = '' } = {}) => {
  const sites = [...REVIEWS.sites.map((s) => ({ ...s, asOf: SITE.ratingsAsOf })), { ...REVIEWS.google, go: 'Read on Google' }];
  return `<ul class="ln${cls ? ` ${cls}` : ''}" data-stag=".08">${sites.map((s) => `<li class="rv"><a class="ln-a" href="${s.href}" rel="external"><span class="ln-n">${s.name}</span><span class="ln-s">${s.score}</span><span class="ln-m">${s.meta} &middot; as of ${s.asOf}</span><span class="ln-go">${s.go} ${arrow}</span></a></li>`).join('')}</ul>`;
};
/** A pull quote of HER OWN words (never a review), in the tall caps. cite: who said it. */
export const quote = (text, cite = '', cls = '') => `<blockquote class="pq${cls ? ` ${cls}` : ''}"><p>${text}</p>${cite ? `<cite>${cite}</cite>` : ''}</blockquote>`;
/** Questions and answers as native <details> (works with no script): faq(HER.faq). */
export const faq = (items, cls = '') => `<div class="faq${cls ? ` ${cls}` : ''}">${items.map(([q, a]) => `<details class="faq-i"><summary><span>${q}</span><i aria-hidden="true"></i></summary><div class="faq-a"><p>${a}</p></div></details>`).join('')}</div>`;
/** A hairline list of small facts: facts([['In makeup', '13 years'], ...]) — the value in the tall caps. */
export const facts = (items, cls = '') => `<dl class="facts${cls ? ` ${cls}` : ''}">${items.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;

/* ---------- the arched runway (home "The Looks"; reused on Portfolio) ----------
   A horizontal swipe rail of arched frames that ADVANCES ON ITS OWN while on screen (site.js), with
   arrows, a counter, a progress hairline and a pause. items: [{ photo, cap } | { film, cap }].
   Native scroll-snap does the swiping; without script it is a plain swipe rail. */
export const rail = ({ id, items, label = 'Her looks', auto = 3400, ar = '2/3', cls = '' }) => {
  const n = items.length;
  const slides = items.map((it, i) => `<li class="rail-it" data-i="${i}">${it.film
    ? archFilm(it.film, { ar, cap: it.cap ?? '', rv: '' })
    : arch(it.photo, { ar, sizes: '(max-width:599px) 64vw, (max-width:1099px) 36vw, 320px', cap: it.cap ?? '', rv: '' })}</li>`).join('');
  return `<div class="rail${cls ? ` ${cls}` : ''}" id="${id}" data-rail data-auto="${auto}">
<ul class="rail-track" tabindex="0" aria-label="${esc(label)}: swipe, or use the arrow keys">${slides}</ul>
<div class="wrap rail-ctl">
<p class="ctr" aria-hidden="true"><span data-rail-n>01</span><i></i><span>${pad2(n)}</span></p>
<div class="rail-bar" aria-hidden="true"><i data-rail-bar></i></div>
<div class="rail-btns"><button class="ic-btn" type="button" data-rail-prev aria-label="Previous look" hidden><span aria-hidden="true">&larr;</span></button><button class="ic-btn" type="button" data-rail-next aria-label="Next look" hidden><span aria-hidden="true">&rarr;</span></button><button class="pause" type="button" data-rail-toggle aria-controls="${id}" hidden><span class="pause-i" aria-hidden="true"></span><span class="pause-t">Pause</span></button></div>
</div>
</div>`;
};

/* ---------- the arch slideshow (home hero; reusable) ----------
   A stack of photographs inside one arched window; site.js changes them on its own with a vertical
   wipe that rises inside the arch (never a cross-fade). Group several under one [data-wall]
   element and give it one pause button (wallToggle). keys: photo keys; the first is eager unless
   eager:false; the rest load after the page has loaded. */
const PH = (k) => ({ ...PHOTOS[k], src: srcOf(k), srcset: srcsetOf(k) });
export const archShow = ({ keys, caps = [], ar = '3/5', sizes = '(max-width:899px) 30vw, 260px', eager = true, cls = '', offset = 0 }) => {
  const slides = keys.map((k, i) => {
    const P = PH(k);
    const img = i === 0
      ? pic(k, { sizes, eager })
      : `<img data-src="${P.src}" data-srcset="${P.srcset}" sizes="${sizes}" width="${P.w}" height="${P.h}" alt="${esc(P.alt)}" style="object-position:${P.pos}" decoding="async">`;
    return `<div class="cy-s${i === 0 ? ' is-on' : ''}" data-cap="${caps[i] ?? ''}"${i === 0 ? '' : ' aria-hidden="true"'}>${img}</div>`;
  }).join('');
  return `<figure class="arch arch--show${cls ? ` ${cls}` : ''}" style="--ar:${ar}"><div class="arch-w"><div class="arch-m" data-cycle data-offset="${offset}">${slides}</div></div></figure>`;
};
/** The pause button (and live caption) for a [data-wall] group. */
export const wallToggle = ({ id, cap = '' }) => `<div class="wall-ctl" data-wall-ctl="${id}"><button class="pause" type="button" data-wall-toggle aria-controls="${id}" hidden><span class="pause-i" aria-hidden="true"></span><span class="pause-t">Pause</span></button><p class="cap wall-cap" data-wall-cap aria-hidden="true">${cap}</p></div>`;

/* ---------- header, menu, footer ---------- */
function header(path) {
  const primary = ANAV.filter((n) => !n.cta);
  return `<header class="hd" id="siteHeader">
<div class="hd-in">
<a class="hd-logo" href="${href(S)}" aria-label="Glam By Amairanymua: ${SITE.name}, home">${lockup()}</a>
<nav class="hd-nav" aria-label="Primary">${primary.map((n) => `<a href="${href(S, n.path)}"${cur(path, n.path)}>${n.label}</a>`).join('')}</nav>
<div class="hd-tools">
${book('event', 'Book event', 'hd-ev')}
${inquire(S, 'Inquire', 'btn btn--pri btn--sm hd-cta', path === 'bridal-inquiry' ? 'aria-current="page"' : '')}
<button class="menu-btn" id="menuOpen" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-btn-t">Menu</span><span class="bars" aria-hidden="true"><i></i><i></i></span></button>
</div>
</div>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" inert>
<div class="menu-top"><a class="hd-logo" href="${href(S)}" aria-label="${SITE.name}, home" tabindex="-1">${lockup({ cls: 'lk--ivory' })}</a><button class="menu-x" id="menuClose" type="button">Close <span aria-hidden="true">&times;</span></button></div>
<div class="menu-body">
<nav aria-label="Main menu"><ol class="menu-list">
<li><a href="${href(S)}"${path === '' ? ' aria-current="page"' : ''}><span class="ml">Home</span><span class="mo">Start here</span></a></li>
${ANAV.map((n) => `<li><a href="${href(S, n.path)}"${cur(path, n.path)}><span class="ml">${n.menu}</span><span class="mo">${n.note}</span></a></li>`).join('\n')}
</ol></nav>
<div class="menu-side">
${bookingLine('booking--dark')}
${actions({ tone: 'dark' })}
<div class="menu-links">
<p class="menu-h">Follow</p>
<a href="${L.ig}" rel="external">Instagram</a><a href="${L.tiktok}" rel="external">TikTok</a><a href="${L.google}" rel="external">Google reviews</a>
<p class="menu-h">${HER.links.reviewsName}</p>
<a href="${L.ww}" rel="external">WeddingWire 5.0</a><a href="${L.knot}" rel="external">The Knot 5.0</a><a href="${L.google}" rel="external">Google 5.0</a>
</div>
</div>
</div>
<p class="menu-foot">${HER.badges.join(' &middot; ')} &middot; ${SITE.area}</p>
</div>`;
}

function footer() {
  return `<footer class="ft">
<div class="wrap">
<div class="ft-cta">
${kicker(FINAL.label, 'kick--c rv')}
<p class="d-xl ft-h rv-mask">${FINAL.heading.map((l) => `<span class="hl"><span>${l}</span></span>`).join(' ')}</p>
<p class="lede rv">${FINAL.line}</p>
<div class="rv">${actions({ align: 'c' })}</div>
${bookingLine('rv')}
</div>
<div class="ft-grid">
<div class="ft-brand"><a class="ft-logo" href="${href(S)}" aria-label="Glam By Amairanymua: ${SITE.name}, home">${lockup({ cls: 'lk--lg' })}</a><p class="ft-line">${FOOTER.line}</p></div>
<div><p class="ft-k">Explore</p><ul class="ft-l"><li><a href="${href(S)}">Home</a></li>${ANAV.map((n) => `<li><a href="${href(S, n.path)}">${n.menu}</a></li>`).join('')}</ul></div>
<div><p class="ft-k">Book</p><ul class="ft-l"><li>${inquire(S, 'Bridal inquiry')}</li><li>${book('bridal-services', 'Bridal services')}</li><li>${book('event', 'Event hair &amp; makeup')}</li><li><a href="${L.mail}">Email</a></li></ul></div>
<div><p class="ft-k">Follow</p><ul class="ft-l"><li><a href="${L.ig}" rel="external">Instagram</a></li><li><a href="${L.tiktok}" rel="external">TikTok</a></li><li><a href="${L.google}" rel="external">Google reviews</a></li></ul></div>
<div><p class="ft-k">${HER.links.reviewsName}</p><ul class="ft-l"><li><a href="${L.ww}" rel="external">WeddingWire &middot; 5.0 &middot; 31</a></li><li><a href="${L.knot}" rel="external">The Knot &middot; 5.0 &middot; 4</a></li><li><a href="${L.google}" rel="external">Google &middot; ${REVIEWS.google.score} &middot; ${REVIEWS.google.meta.replace(/\D+$/, '')}</a></li></ul></div>
</div>
<div class="ft-base">
${spec([SITE.handle, ...HER.badges, SITE.areaLong])}
<p class="ft-fine">${finePrint()}</p>
</div>
</div>
</footer>`;
}

/* ---------- the document ---------- */
const FONT_PRELOAD = ['noto-serif-display-cond-var', 'montserrat-var'].map((f) => `<link rel="preload" href="${A}/fonts/${f}.woff2" as="font" type="font/woff2" crossorigin>`).join('\n');
const asset = (x, ext) => (x.includes('/') ? x : `${AT}/${x}.${ext}`);

/** A whole Atelier document.
 *  path, title, description: as head() in site.mjs.  main: the page's content (inside <main id="main">).
 *  head: extra <head> markup (a preload for the page's lead image).  css / js: extra files, by name in
 *  assets/atelier/ without extension (css: ['pages-work']) or as a full path ('/demo/…/x.css').
 *  bodyClass: extra classes on <body>.  opening: markup inserted first in <body> (home only: the
 *  intro gate and overlay).  foot: extra markup after the scripts. */
export const page = ({ path = '', title, description, main, head = '', css = [], js = [], bodyClass = '', opening = '', foot = '' }) => `<!doctype html>
<html lang="en">
<head>
${stdHead(S, { path, title, description })}
${FONT_PRELOAD}
<link rel="stylesheet" href="${AT}/site.css">
${css.map((c) => `<link rel="stylesheet" href="${asset(c, 'css')}">`).join('\n')}
<script>(function(d){d.classList.add('js');setTimeout(function(){if(!window.__atelier)d.classList.remove('js');},3500);})(document.documentElement);</script>
${head}
</head>
<body class="atelier${bodyClass ? ` ${bodyClass}` : ''}">
${opening}<a class="skip" href="#main">Skip to content</a>
${SYMBOL}
${header(path)}
<main id="main">
${main}
</main>
${footer()}
${marker(S, path)}
<script src="${AT}/site.js" defer></script>
${js.map((j) => `<script src="${asset(j, 'js')}" defer></script>`).join('\n')}
${foot}
</body>
</html>
`;
