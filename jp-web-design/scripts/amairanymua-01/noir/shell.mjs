/* /demo/amairanymua-01 — site "noir": the shell (document, header, menu, footer, booking bar)
   and the page kit every Noir page is built from. Documented for page authors in KIT.md.

   Noir: "a film about her work". Espresso black, bone and champagne; Instrument Serif at
   enormous sizes, DM Mono slates, DM Sans body. No cards, no rounded corners, no boxes. */
import { head, marker, href, NAV, SITE, finePrint, inquire, book, pic, esc, arrow, L, A, FOOTER } from '../site.mjs';

export const S = 'noir';
const N = `${A}/noir`;

/* ---------- the wordmark ----------
   "Amairany Sierra" in Instrument Serif Italic, as outlines taken from the font file itself
   (HarfBuzz-shaped, kerning applied; one entry per glyph, one string per contour). The
   home page's opening strokes each contour on (`draw: true` adds the stroke layer, each
   contour with pathLength="1"); everywhere else the wordmark is simply filled. */
const WM_GLYPHS = [{"g":"A","c":["M-62 0Q-74 0 -74 -10Q-74 -19 -58 -23L-42 -26Q-22 -30 -8 -46Q7 -61 20 -89L319 -714Q324 -724 329 -727Q334 -730 338 -730Q343 -730 346 -727Q350 -724 350 -714L361 -80Q362 -52 368 -42Q374 -31 393 -26L406 -23Q418 -20 418 -11Q418 0 401 0H236Q223 0 223 -10Q223 -21 243 -23L263 -25Q280 -27 286 -36Q293 -45 293 -67L291 -222Q291 -248 264 -248H157Q131 -248 118 -222L53 -88Q26 -31 71 -25L85 -23Q100 -21 100 -11Q100 0 83 0Z","M161 -278H273Q290 -278 290 -295L288 -568H283L152 -295Q148 -288 151 -283Q154 -278 161 -278Z"]},{"g":"m","c":["M1030 9Q994 9 976 -21Q958 -51 974 -114L1051 -404Q1062 -443 1054 -458Q1047 -473 1033 -473Q1013 -473 987 -446Q961 -418 932 -371Q904 -324 877 -264Q850 -204 827 -139Q804 -74 789 -11Q786 0 775 0H736Q722 0 725 -13L817 -404Q826 -443 820 -458Q813 -473 799 -473Q780 -473 754 -446Q728 -418 700 -371Q672 -324 645 -264Q618 -204 595 -139Q572 -74 558 -11Q555 0 544 0H503Q489 0 492 -13L587 -412Q592 -434 588 -446Q585 -459 570 -459Q552 -459 530 -432Q509 -406 482 -332Q478 -319 468 -319Q453 -319 460 -337Q482 -406 506 -445Q531 -484 556 -500Q581 -516 602 -516Q635 -516 649 -492Q663 -467 650 -411L625 -303Q624 -296 628 -295Q632 -294 635 -300Q693 -420 740 -468Q787 -516 826 -516Q863 -516 878 -486Q894 -456 880 -394L859 -303Q858 -296 862 -295Q866 -294 869 -300Q907 -381 940 -428Q974 -476 1004 -496Q1034 -516 1060 -516Q1097 -516 1114 -486Q1131 -456 1114 -394L1038 -104Q1031 -76 1037 -62Q1043 -48 1059 -48Q1079 -48 1098 -74Q1118 -101 1139 -175Q1142 -186 1152 -186Q1160 -186 1162 -180Q1163 -174 1161 -166Q1142 -98 1120 -60Q1098 -21 1076 -6Q1053 9 1030 9Z"]},{"g":"a","c":["M1273 9Q1237 9 1217 -22Q1197 -53 1197 -113Q1197 -170 1213 -228Q1229 -285 1257 -337Q1285 -389 1320 -429Q1356 -469 1396 -492Q1435 -516 1474 -516Q1493 -516 1510 -508Q1527 -501 1538 -485Q1544 -476 1550 -476Q1556 -476 1562 -485Q1573 -501 1580 -506Q1587 -510 1593 -510Q1606 -510 1603 -496L1514 -113Q1499 -48 1534 -48Q1557 -48 1576 -79Q1594 -110 1613 -175Q1616 -186 1626 -186Q1633 -186 1635 -180Q1637 -174 1635 -166Q1616 -72 1584 -32Q1552 9 1507 9Q1468 9 1452 -24Q1435 -57 1448 -114L1461 -169Q1463 -176 1458 -177Q1454 -178 1451 -172Q1396 -71 1354 -31Q1311 9 1273 9Z","M1298 -42Q1322 -42 1351 -71Q1380 -100 1408 -146Q1437 -192 1461 -245Q1485 -298 1500 -347Q1514 -396 1514 -430Q1514 -491 1471 -491Q1445 -491 1416 -468Q1387 -444 1360 -404Q1334 -364 1312 -314Q1291 -263 1278 -208Q1265 -154 1265 -102Q1265 -67 1274 -54Q1282 -42 1298 -42Z"]},{"g":"i","c":["M1862 -605Q1843 -605 1830 -618Q1818 -632 1818 -651Q1818 -678 1834 -694Q1851 -710 1872 -710Q1892 -710 1906 -698Q1919 -685 1919 -665Q1919 -637 1902 -621Q1885 -605 1862 -605Z","M1780 10Q1747 10 1733 -14Q1719 -39 1732 -95L1806 -412Q1811 -434 1808 -446Q1804 -459 1789 -459Q1771 -459 1750 -432Q1728 -406 1701 -332Q1697 -319 1687 -319Q1672 -319 1679 -337Q1701 -406 1726 -445Q1750 -484 1775 -500Q1800 -516 1821 -516Q1856 -516 1870 -492Q1884 -467 1871 -411L1797 -94Q1792 -72 1796 -60Q1799 -47 1814 -47Q1832 -47 1854 -74Q1875 -100 1902 -174Q1906 -187 1916 -187Q1931 -187 1924 -169Q1903 -101 1878 -62Q1852 -22 1827 -6Q1802 10 1780 10Z"]},{"g":"r","c":["M2010 0Q1996 0 1999 -13L2094 -412Q2099 -434 2096 -446Q2092 -459 2077 -459Q2059 -459 2038 -432Q2016 -406 1989 -332Q1985 -319 1975 -319Q1960 -319 1967 -337Q1989 -406 2014 -445Q2038 -484 2063 -500Q2088 -516 2109 -516Q2142 -516 2156 -492Q2170 -467 2157 -411L2146 -364Q2145 -357 2149 -356Q2153 -355 2156 -361Q2194 -448 2225 -482Q2256 -516 2296 -516Q2323 -516 2336 -502Q2350 -487 2350 -462Q2350 -437 2338 -422Q2326 -407 2307 -407Q2291 -407 2284 -415Q2277 -423 2274 -434Q2270 -444 2266 -452Q2262 -460 2253 -460Q2238 -460 2214 -422Q2190 -384 2162 -320Q2135 -255 2110 -175Q2084 -95 2065 -11Q2062 0 2051 0Z"]},{"g":"a","c":["M2385 9Q2349 9 2329 -22Q2309 -53 2309 -113Q2309 -170 2325 -228Q2341 -285 2369 -337Q2397 -389 2432 -429Q2468 -469 2508 -492Q2547 -516 2586 -516Q2605 -516 2622 -508Q2639 -501 2650 -485Q2656 -476 2662 -476Q2668 -476 2674 -485Q2685 -501 2692 -506Q2699 -510 2705 -510Q2718 -510 2715 -496L2626 -113Q2611 -48 2646 -48Q2669 -48 2688 -79Q2706 -110 2725 -175Q2728 -186 2738 -186Q2745 -186 2747 -180Q2749 -174 2747 -166Q2728 -72 2696 -32Q2664 9 2619 9Q2580 9 2564 -24Q2547 -57 2560 -114L2573 -169Q2575 -176 2570 -177Q2566 -178 2563 -172Q2508 -71 2466 -31Q2423 9 2385 9Z","M2410 -42Q2434 -42 2463 -71Q2492 -100 2520 -146Q2549 -192 2573 -245Q2597 -298 2612 -347Q2626 -396 2626 -430Q2626 -491 2583 -491Q2557 -491 2528 -468Q2499 -444 2472 -404Q2446 -364 2424 -314Q2403 -263 2390 -208Q2377 -154 2377 -102Q2377 -67 2386 -54Q2394 -42 2410 -42Z"]},{"g":"n","c":["M2823 -13 2918 -412Q2923 -434 2920 -446Q2916 -459 2901 -459Q2883 -459 2862 -432Q2840 -406 2813 -332Q2809 -319 2799 -319Q2784 -319 2791 -337Q2813 -406 2838 -445Q2862 -484 2887 -500Q2912 -516 2933 -516Q2966 -516 2980 -492Q2994 -467 2981 -411L2956 -303Q2955 -296 2959 -295Q2963 -294 2966 -300Q3005 -381 3041 -428Q3077 -476 3109 -496Q3141 -516 3167 -516Q3204 -516 3221 -486Q3238 -456 3221 -394L3145 -104Q3138 -76 3144 -62Q3150 -48 3166 -48Q3186 -48 3206 -74Q3225 -101 3246 -175Q3249 -186 3259 -186Q3267 -186 3268 -180Q3270 -174 3268 -166Q3249 -98 3227 -60Q3205 -21 3182 -6Q3160 9 3137 9Q3101 9 3083 -21Q3065 -51 3081 -114L3158 -404Q3169 -443 3162 -458Q3154 -473 3140 -473Q3118 -473 3090 -446Q3062 -418 3033 -370Q3004 -323 2976 -263Q2948 -203 2926 -138Q2903 -73 2889 -11Q2886 0 2875 0H2834Q2820 0 2823 -13Z"]},{"g":"y","c":["M3264 215Q3226 215 3205 196Q3184 176 3184 148Q3184 127 3195 116Q3206 106 3219 106Q3238 106 3246 116Q3254 126 3258 140Q3262 153 3270 163Q3279 173 3298 173Q3335 173 3371 144Q3407 114 3430 62Q3453 11 3450 -53L3435 -412Q3434 -438 3426 -448Q3418 -459 3406 -459Q3384 -459 3364 -432Q3344 -406 3331 -332Q3328 -319 3318 -319Q3304 -319 3307 -337Q3319 -406 3340 -445Q3362 -484 3386 -500Q3411 -516 3432 -516Q3463 -516 3481 -494Q3499 -473 3501 -421L3515 -37Q3515 -30 3520 -28Q3524 -27 3528 -33Q3563 -82 3592 -134Q3620 -187 3637 -238Q3654 -289 3654 -332Q3654 -374 3645 -398Q3636 -423 3626 -440Q3617 -457 3617 -477Q3617 -516 3651 -516Q3699 -516 3699 -410Q3699 -352 3679 -284Q3659 -215 3624 -144Q3590 -74 3546 -10Q3501 54 3452 105Q3404 156 3356 186Q3307 215 3264 215Z"]},{"g":"S","c":["M4052 9Q4024 9 3992 3Q3961 -3 3934 -14Q3906 -24 3890 -38Q3885 -43 3884 -48Q3882 -53 3884 -63L3912 -220Q3915 -238 3928 -238Q3940 -238 3940 -218L3941 -179Q3943 -95 3970 -58Q3997 -21 4058 -21Q4114 -21 4151 -62Q4188 -102 4188 -170Q4188 -214 4164 -262Q4140 -310 4097 -358Q4046 -415 4022 -462Q3997 -509 3997 -561Q3997 -602 4017 -640Q4037 -679 4078 -704Q4118 -730 4181 -730Q4268 -730 4314 -691Q4328 -680 4324 -658L4296 -512Q4293 -497 4282 -497Q4271 -497 4269 -514L4268 -535Q4264 -616 4246 -658Q4227 -701 4172 -701Q4132 -701 4108 -683Q4084 -665 4073 -638Q4062 -612 4062 -586Q4062 -557 4070 -530Q4078 -504 4098 -474Q4117 -445 4151 -403Q4199 -346 4226 -294Q4253 -242 4253 -193Q4253 -134 4226 -88Q4200 -43 4155 -17Q4110 9 4052 9Z"]},{"g":"i","c":["M4507 -605Q4488 -605 4476 -618Q4463 -632 4463 -651Q4463 -678 4480 -694Q4496 -710 4517 -710Q4537 -710 4550 -698Q4564 -685 4564 -665Q4564 -637 4547 -621Q4530 -605 4507 -605Z","M4425 10Q4392 10 4378 -14Q4364 -39 4377 -95L4451 -412Q4456 -434 4452 -446Q4449 -459 4434 -459Q4416 -459 4394 -432Q4373 -406 4346 -332Q4342 -319 4332 -319Q4317 -319 4324 -337Q4346 -406 4370 -445Q4395 -484 4420 -500Q4445 -516 4466 -516Q4501 -516 4515 -492Q4529 -467 4516 -411L4442 -94Q4437 -72 4440 -60Q4444 -47 4459 -47Q4477 -47 4498 -74Q4520 -100 4547 -174Q4551 -187 4561 -187Q4576 -187 4569 -169Q4548 -101 4522 -62Q4497 -22 4472 -6Q4447 10 4425 10Z"]},{"g":"e","c":["M4720 9Q4667 9 4635 -32Q4603 -74 4603 -150Q4603 -216 4626 -281Q4650 -346 4688 -399Q4726 -452 4772 -484Q4817 -516 4860 -516Q4907 -516 4928 -494Q4948 -471 4948 -433Q4948 -388 4916 -344Q4885 -299 4828 -264Q4772 -229 4696 -212Q4674 -207 4673 -187Q4672 -180 4672 -172Q4672 -165 4672 -158Q4672 -101 4692 -72Q4711 -43 4745 -43Q4783 -43 4818 -78Q4854 -113 4878 -177Q4881 -186 4890 -186Q4896 -186 4898 -181Q4899 -176 4897 -169Q4865 -81 4820 -36Q4774 9 4720 9Z","M4683 -250Q4681 -243 4686 -238Q4690 -234 4697 -236Q4759 -253 4801 -288Q4843 -322 4864 -365Q4886 -408 4886 -449Q4886 -491 4853 -491Q4824 -491 4790 -457Q4756 -423 4727 -368Q4698 -313 4683 -250Z"]},{"g":"r","c":["M5003 0Q4989 0 4992 -13L5087 -412Q5092 -434 5088 -446Q5085 -459 5070 -459Q5052 -459 5030 -432Q5009 -406 4982 -332Q4978 -319 4968 -319Q4953 -319 4960 -337Q4982 -406 5006 -445Q5031 -484 5056 -500Q5081 -516 5102 -516Q5135 -516 5149 -492Q5163 -467 5150 -411L5139 -364Q5138 -357 5142 -356Q5146 -355 5149 -361Q5187 -448 5218 -482Q5249 -516 5289 -516Q5316 -516 5330 -502Q5343 -487 5343 -462Q5343 -437 5331 -422Q5319 -407 5300 -407Q5284 -407 5277 -415Q5270 -423 5266 -434Q5263 -444 5259 -452Q5255 -460 5246 -460Q5231 -460 5207 -422Q5183 -384 5156 -320Q5128 -255 5102 -175Q5077 -95 5058 -11Q5055 0 5044 0Z"]},{"g":"r","c":["M5371 0Q5357 0 5360 -13L5455 -412Q5460 -434 5456 -446Q5453 -459 5438 -459Q5420 -459 5398 -432Q5377 -406 5350 -332Q5346 -319 5336 -319Q5321 -319 5328 -337Q5350 -406 5374 -445Q5399 -484 5424 -500Q5449 -516 5470 -516Q5503 -516 5517 -492Q5531 -467 5518 -411L5507 -364Q5506 -357 5510 -356Q5514 -355 5517 -361Q5555 -448 5586 -482Q5617 -516 5657 -516Q5684 -516 5698 -502Q5711 -487 5711 -462Q5711 -437 5699 -422Q5687 -407 5668 -407Q5652 -407 5645 -415Q5638 -423 5634 -434Q5631 -444 5627 -452Q5623 -460 5614 -460Q5599 -460 5575 -422Q5551 -384 5524 -320Q5496 -255 5470 -175Q5445 -95 5426 -11Q5423 0 5412 0Z"]},{"g":"a","c":["M5746 9Q5710 9 5690 -22Q5670 -53 5670 -113Q5670 -170 5686 -228Q5702 -285 5730 -337Q5758 -389 5794 -429Q5829 -469 5868 -492Q5908 -516 5947 -516Q5966 -516 5983 -508Q6000 -501 6011 -485Q6017 -476 6023 -476Q6029 -476 6035 -485Q6046 -501 6053 -506Q6060 -510 6066 -510Q6079 -510 6076 -496L5987 -113Q5972 -48 6007 -48Q6030 -48 6048 -79Q6067 -110 6086 -175Q6089 -186 6099 -186Q6106 -186 6108 -180Q6110 -174 6108 -166Q6089 -72 6057 -32Q6025 9 5980 9Q5941 9 5924 -24Q5908 -57 5921 -114L5934 -169Q5936 -176 5932 -177Q5927 -178 5924 -172Q5869 -71 5826 -31Q5784 9 5746 9Z","M5771 -42Q5795 -42 5824 -71Q5853 -100 5882 -146Q5910 -192 5934 -245Q5958 -298 5972 -347Q5987 -396 5987 -430Q5987 -491 5944 -491Q5918 -491 5889 -468Q5860 -444 5834 -404Q5807 -364 5786 -314Q5764 -263 5751 -208Q5738 -154 5738 -102Q5738 -67 5746 -54Q5755 -42 5771 -42Z"]}];
const WM_VB = '-90 -745 6215 975';
let wmCount = 0;
/** The concept wordmark as inline SVG. `draw` adds the opening's stroke layer (home only).
 *  It is decorative inside a labelled link, so it is aria-hidden; pass `label` to make it an image. */
export const wordmark = ({ draw = false, cls = '', label = '' } = {}) => {
  wmCount += 1;
  const fill = WM_GLYPHS.map((g, i) => `<path class="wm-g" data-g="${i}" d="${g.c.join('')}"/>`).join('');
  const stroke = draw
    ? `<g class="wm-s">${WM_GLYPHS.map((g, i) => `<g class="wm-sg" data-g="${i}">${g.c.map((d) => `<path pathLength="1" d="${d}"/>`).join('')}</g>`).join('')}</g>`
    : '';
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="wm${cls ? ` ${cls}` : ''}" viewBox="${WM_VB}" width="160" height="25" ${a11y}><g class="wm-f">${fill}</g>${stroke}</svg>`;
};

/* ---------- small furniture ---------- */
/** A slate: mono, uppercase, tracked. Only ever true things (a place, a look, a scene number). */
export const slate = (text, cls = '') => `<p class="slate${cls ? ` ${cls}` : ''}">${text}</p>`;
/** A kicker: a slate with a short champagne rule in front, above a heading. */
export const kick = (text, cls = '') => `<p class="slate slate--champ kick${cls ? ` ${cls}` : ''}">${text}</p>`;
/** A heading with the second part in italic champagne: h(2, ['Soft glam to', 'full glam.'], 'd-l'). */
export const h = (level, [a, b = ''], cls = 'd-l', attrs = '') =>
  `<h${level} class="${cls}"${attrs ? ` ${attrs}` : ''}>${a}${b ? ` <em>${b}</em>` : ''}</h${level}>`;
/** Both ways to book, as a button pair. `size` '' or 'btn--sm'. */
export const actions = ({ inq = 'Bridal inquiry', event = 'Book event glam', size = '', cls = '' } = {}) =>
  `<div class="acts${cls ? ` ${cls}` : ''}">${inquire(S, `${inq} ${arrow}`, `btn btn--solid${size ? ` ${size}` : ''}`)}${book('event', event, `btn btn--line${size ? ` ${size}` : ''}`)}</div>`;
/** One of her photographs in a frameless frame that dissolves into the ground.
 *  shape: 'tall' (4:5) | 'port' (3:4) | 'vert' (9:16) | 'sq' | 'wide' (16:10) | '' (natural)
 *  fade:  '' | 'fade' (all edges) | 'fade-b' | 'fade-l' | 'fade-r' | 'fade-x' */
export const frame = (key, { shape = 'tall', fade = '', sizes = '(max-width:899px) 92vw, 46vw', alt, eager = false, pos, cls = '', rv = 'rv-im' } = {}) =>
  `<figure class="ph${shape ? ` ph--${shape}` : ''}${fade ? ` ph--${fade}` : ''}${cls ? ` ${cls}` : ''}">${pic(key, { alt, sizes, eager, pos, cls: rv })}</figure>`;

/* ---------- page kit: the three section builders ---------- */
/** A title card for the top of an inner page: mono kicker, huge serif heading (second part
 *  italic), one line, actions, and optionally one of her portraits dissolving into the black.
 *  The heading is the page's <h1> unless h1:false. */
export const cover = ({ kick: k = '', heading = ['', ''], sub = '', actions: acts, image = '', pos, alt, short = false, h1 = true, id = '' } = {}) => `<section class="cover${image ? ' cover--ph' : ''}${short ? ' cover--short' : ''}"${id ? ` id="${id}"` : ''}>
${image ? `<div class="cover-ph" aria-hidden="${alt === '' ? 'true' : 'false'}">${pic(image, { alt, pos, eager: true, sizes: '(max-width:899px) 100vw, 58vw' })}</div>` : ''}
<div class="wrap cover-in"><div class="cover-txt">
${k ? kick(k, 'rv') : ''}
${h(h1 ? 1 : 2, heading, 'd-xl rv-mask')}
${sub ? `<p class="cover-sub rv" style="--d:.15s">${sub}</p>` : ''}
${acts === false ? '' : `<div class="rv" style="--d:.25s">${acts ?? actions()}</div>`}
</div></div>
</section>`;
/** A section's opening: kicker, heading, lead. `split` sets the lead beside the heading on wide screens. */
export const chapter = ({ kick: k = '', heading = ['', ''], lead = '', level = 2, size = 'd-l', split = false, id = '' } = {}) => `<header class="ch${split ? ' ch--split' : ''}"${id ? ` id="${id}"` : ''}>
<div>${k ? kick(k, 'rv') : ''}${h(level, heading, `${size} ch-h rv-mask`)}</div>
${lead ? `<p class="lead ch-lead rv" style="--d:.12s">${lead}</p>` : ''}
</header>`;
/** The end card every page closes on: her line, enormous, and both ways to book. */
export const cta = ({ kick: k = 'Ready when you are', heading = ['Secure your', 'wedding day glam.'], copy = '', actions: acts, id = '' } = {}) => `<section class="cta"${id ? ` id="${id}"` : ''}>
<div class="wrap">
${k ? kick(k, 'rv') : ''}
${h(2, heading, 'd-xl cta-h rv-mask')}
${copy ? `<p class="cta-copy rv" style="--d:.12s">${copy}</p>` : ''}
<div class="rv" style="--d:.22s">${acts ?? actions({ cls: '' })}</div>
</div>
</section>`;

/* ---------- the shell ---------- */
const pad = (n) => String(n).padStart(2, '0');
const PAGES_ALL = [{ path: '', label: 'Home', menu: 'Home', note: SITE.tagline }, ...NAV];
const cur = (p, path) => (p === path ? ' aria-current="page"' : '');

const header = (path) => `<header class="hd" id="siteHeader">
<div class="wrap hd-in">
<a class="hd-wm" href="${href(S)}" aria-label="${SITE.name}, home"${path === '' ? ' aria-current="page"' : ''}>${wordmark({ draw: path === '' })}</a>
<nav class="hd-nav" aria-label="Main">${NAV.filter((n) => !n.cta).map((n) => `<a href="${href(S, n.path)}"${cur(n.path, path)}>${n.label}</a>`).join('')}</nav>
<span class="hd-cta hd-ev">${book('event', 'Book event glam', 'btn btn--line btn--sm')}</span>
<span class="hd-cta">${inquire(S, 'Bridal inquiry', 'btn btn--solid btn--sm', path === 'bridal-inquiry' ? 'aria-current="page"' : '')}</span>
<button class="hd-menu" id="menuOpen" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menu"><span class="t" aria-hidden="true">Menu</span><i aria-hidden="true"></i></button>
</div>
</header>`;

const menu = (path) => `<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" inert>
<div class="wrap menu-top">
<a class="hd-wm" href="${href(S)}" aria-label="${SITE.name}, home">${wordmark()}</a>
<button class="menu-x" id="menuClose" type="button"><span>Close</span><i aria-hidden="true"></i></button>
</div>
<nav class="wrap menu-body" aria-label="Pages">
<ol class="menu-list">${PAGES_ALL.map((n, i) => `<li style="--i:${i}"><a href="${href(S, n.path)}"${cur(n.path, path)}><span class="n" aria-hidden="true">${pad(i + 1)}</span><span class="w">${n.menu}</span><span class="note">${n.note}</span></a></li>`).join('')}</ol>
<div class="menu-foot">
${actions({ inq: 'Bridal inquiry', event: 'Book event glam' })}
<div><p class="slate">${SITE.areaLong}</p><p><a class="slate slate--champ" href="${L.ig}" rel="external">Instagram ${SITE.handle}</a></p></div>
</div>
</nav>
</div>`;

const footer = (path) => `<footer class="ft">
<div class="wrap">
<div class="ft-top">
<div>
<a class="hd-wm ft-wm" href="${href(S)}" aria-label="${SITE.name}, home">${wordmark()}</a>
<p class="ft-line">${FOOTER.line}</p>
<div class="ft-acts">${actions({ size: 'btn--sm' })}</div>
</div>
<div class="ft-cols">
<div class="ft-col"><h2 class="slate slate--champ">Pages</h2><ul>${PAGES_ALL.map((n) => `<li><a href="${href(S, n.path)}"${cur(n.path, path)}>${n.label}</a></li>`).join('')}</ul></div>
<div class="ft-col"><h2 class="slate slate--champ">Book</h2><ul><li>${inquire(S, 'Bridal inquiry')}</li><li>${book('bridal-services', 'Bridal services')}</li><li>${book('event', 'Event makeup &amp; hair')}</li><li>${book('schedule', 'All services')}</li></ul></div>
<div class="ft-col"><h2 class="slate slate--champ">Elsewhere</h2><ul><li><a href="${L.ig}" rel="external">Instagram</a></li><li><a href="${L.mail}">Email</a></li><li><a href="${L.ww}" rel="external">WeddingWire</a></li><li><a href="${L.knot}" rel="external">The Knot</a></li></ul></div>
</div>
</div>
<p class="ft-fine">${finePrint()}</p>
<div class="ft-base"><p class="slate">${SITE.areaLong}</p><p class="slate">${SITE.handle}</p></div>
</div>
</footer>`;

const bar = () => `<div class="bar" id="bookBar">${inquire(S, 'Bridal inquiry', 'btn btn--solid')}${book('event', 'Book event glam', 'btn btn--line')}</div>`;

/** A whole Noir document.
 *  path: '' | 'about' | ...; title/description: this page's own; main: the page's markup
 *  (inside <main id="main">); head: extra <head> markup (preloads); css/js: extra file names
 *  in assets/noir without extension (e.g. css:['pages'], js:['pages']); bodyClass.
 *  bookBar: the phone booking bar. Off on the bridal inquiry itself, where its "Bridal
 *  inquiry" would only jump to the form the visitor is already filling in. */
export const page = ({ path = '', title, description, main, head: extra = '', css = [], js = [], bodyClass = '', bookBar = path !== 'bridal-inquiry' }) => `<!doctype html>
<html lang="en" class="noir">
<head>
${head(S, { path, title, description })}
<link rel="preload" href="${A}/fonts/instrument-serif.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${A}/fonts/instrument-serif-italic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${N}/site.css">
${css.map((c) => `<link rel="stylesheet" href="${N}/${c}.css">`).join('\n')}
${extra}
<script>(function(d){d.classList.add('js');setTimeout(function(){if(!window.__noir)d.classList.remove('js')},3500)})(document.documentElement)</script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<a class="skip" href="#main">Skip to content</a>
${header(path)}
${menu(path)}
<main id="main">
${main}
</main>
${footer(path)}
${bookBar ? bar() : ''}
${marker(S, path)}
<script src="${N}/site.js" defer></script>
${js.map((s) => `<script src="${N}/${s}.js" defer></script>`).join('\n')}
</body>
</html>
`;
