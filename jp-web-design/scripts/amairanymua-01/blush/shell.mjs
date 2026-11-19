/* /demo/amairanymua-01 — site "blush": the shell (document, header, menu, footer, the floating
   inquiry pill) and the page kit every Blush page is built from. Documented for page authors in
   KIT.md (handed over with this file).

   Blush: a warm, personal welcome. Cream and blush grounds with her espresso as the ink; Petrona,
   a soft serif that slips into italic mid-line; one script word now and then (Great Vibes); Nunito
   Sans for everything small. Soft shapes: circles (her seal, portrait frames, film windows), arches,
   pill buttons, 22px cards, blush hairlines, lots of air. */
import { head as stdHead, marker, href, NAV, SITE, HER, REVIEWS, SOCIAL, FILMS, L, A, PHOTOS, src as srcOf, srcset as srcsetOf, finePrint, inquire, book, pic, film, esc, arrow, pagesOf } from '../site.mjs';

export const S = 'blush';
/** This site's asset folder (CSS, JS, SVG). */
export const B = `${A}/blush`;
export { arrow };

/* ---------- the seal ----------
   Her monogram seal, set as type and then converted to outlines from the fonts themselves (fontTools,
   no font download needed, identical everywhere): an "A" in Petrona roman, an "S" in Petrona italic,
   and "GLAM BY AMAIRANYMUA · HAIR & MAKEUP · CENTRAL FLORIDA ·" in Nunito Sans 650 set around a
   168-unit circle, one path per glyph, in a 400×400 box centred on (200,200).
   The outlines are defined ONCE per page (sealDefs, first thing in <body>) and drawn by <use>,
   so a page can show the seal several times for the cost of one. The home opening inlines its own
   copy (sealParts) because it animates the glyphs one by one. */
const RING = ["M211.6 32.6Q209.6 32.4 208.3 31.6Q207 30.8 206.4 29.4Q205.8 27.9 205.9 26Q206 24.1 206.8 22.8Q207.6 21.5 209 20.8Q210.4 20.1 212.3 20.3Q213.2 20.3 213.9 20.5Q214.7 20.8 215.3 21.1Q216 21.5 216.4 21.9L215.6 23.4Q214.9 22.7 214 22.4Q213.2 22.1 212.2 22Q210.3 21.9 209.2 23Q208.1 24 208 26.2Q207.8 28.3 208.8 29.5Q209.7 30.7 211.8 30.9Q212.5 30.9 213.2 30.8Q214 30.7 214.6 30.5L214.2 31.4L214.4 27.6L211.6 27.5L211.7 26L216.2 26.3L215.8 32Q215.3 32.2 214.6 32.3Q213.9 32.5 213.1 32.5Q212.3 32.6 211.6 32.6Z", "M227.4 34.2 229.6 22.4 231.5 22.8 229.7 32.9 235.4 34 235.1 35.6Z", "M244.4 37.9 253.1 28 254.7 28.5 256.2 41.6 254.3 41 253.9 37.3 254.6 38.1 247.7 35.9 248.7 35.7 246.3 38.5ZM253.2 30.3 249.1 35.2 248.8 34.6 254.4 36.4 253.9 36.7 253.3 30.3Z", "M266.1 45.4 271.2 34.6 272.7 35.3 273.2 45 272.8 44.8 280.6 39 282 39.7 276.9 50.5 275.3 49.8 279.2 41.5 279.5 41.7 272.8 46.6 271.8 46.1 271.2 37.8 271.6 37.9 267.7 46.2Z", "M298.7 63.9 306 54.4 310 57.5Q311.5 58.7 311.8 60Q312.1 61.3 311.2 62.4Q310.6 63.3 309.6 63.5Q308.7 63.7 307.6 63.2L307.8 63Q308.4 63.6 308.6 64.3Q308.9 65 308.7 65.7Q308.6 66.3 308.1 67Q307.5 67.8 306.6 68.1Q305.8 68.4 304.8 68.2Q303.9 67.9 302.9 67.2ZM301.1 63.9 303.6 65.8Q304 66.1 304.3 66.3Q304.7 66.5 305 66.5Q305.3 66.6 305.6 66.5Q305.9 66.4 306.2 66.3Q306.4 66.1 306.6 65.8Q306.9 65.5 307 65.2Q307.1 64.9 307.1 64.6Q307.1 64.3 307 64Q306.8 63.7 306.6 63.4Q306.3 63.1 305.9 62.8L303.4 60.9ZM304.3 59.7 306.6 61.4Q307.6 62.2 308.3 62.2Q309 62.1 309.6 61.4Q310.1 60.7 310 60Q309.8 59.3 308.8 58.5L306.5 56.8Z", "M316.7 79.2 321.1 74.8 320.5 75.9 321.8 67.4 323.5 69 322.5 75.1 322.2 74.7 328.2 73.7 329.8 75.2 321.3 76.7 322.5 76.1 318.1 80.6Z", "M335.9 101.1 348.9 98.8 349.8 100.2 342.8 111.3 341.7 109.7 343.7 106.6 343.7 107.6 339.7 101.6 340.6 102 337 102.7ZM347.5 100.7 341.3 101.9 341.4 101.3 344.7 106.1 344 106.1 347.5 100.7Z", "M348.1 120.5 358.9 115.3 359.6 116.7 354 124.7 353.7 124.2 363.5 124.5 364.2 126 353.4 131.3 352.6 129.7 360.8 125.6 361 126 352.7 125.6 352.2 124.6 357 117.7 357.1 118.1 348.9 122.1Z", "M357.5 141.1 370.5 142.4 371 144 361.4 152.9 360.7 151 363.5 148.5 363.3 149.5 361 142.6 361.7 143.3 358.1 143ZM368.7 143.9 362.4 143.4 362.7 142.8 364.5 148.3 363.9 148.1 368.7 143.9Z", "M363.9 163.1 375.6 160.6 376 162.5 364.3 165.1Z", "M366.4 176.7 378.3 175.4 378.9 180.4Q379.1 182.4 378.3 183.5Q377.5 184.7 375.8 184.9Q374.8 185 373.9 184.6Q373.1 184.2 372.6 183.3Q372 182.5 371.9 181.2L372.2 181.3L372.2 181.8Q372.3 182.5 372 183.1Q371.7 183.6 371 184.1L367.5 186.5L367.3 184.4L370.9 181.9Q371.3 181.6 371.4 181.3Q371.6 181 371.7 180.7Q371.7 180.3 371.7 179.9L371.5 178.1L366.7 178.7ZM373 177.9 373.3 180.7Q373.4 181.9 374 182.5Q374.6 183.1 375.6 183Q376.6 182.9 377 182.2Q377.5 181.5 377.3 180.3L377 177.5Z", "M368.1 196.1 380 201.7 380 203.3 367.9 208.5 367.9 206.5 371.3 205.1 370.8 205.9 370.9 198.7 371.4 199.6 368 198.1ZM377.8 202.4 372 199.9 372.5 199.4 372.4 205.3 371.9 204.9 377.8 202.4Z", "M367 219.1 378.9 220.8 378.6 222.2 368.4 227.9 368.5 227.5 377.7 228.8 377.4 230.6 365.6 228.9 365.8 227.5 376 221.8 375.9 222.2 366.7 220.9Z", "M362.3 243.3 368.3 244.9 367 245 375.1 242 374.5 244.2 368.7 246.3 368.9 245.9 372.7 250.6 372.2 252.8 366.7 246.1 367.8 246.8 361.8 245.2Z", "M357.3 259.2 368.4 263.9 367.7 265.4 358.1 266.3 358.3 265.8 364.4 273.4 363.8 274.9 352.7 270.2 353.4 268.6 361.8 272.1 361.7 272.5 356.5 266 356.9 264.9 365.2 264 365.1 264.4 356.6 260.9Z", "M344.7 285Q345.9 282.9 347.7 282.4Q349.4 282 351.6 283.2L357.7 286.8L356.7 288.5L350.6 285Q349.2 284.1 348 284.3Q346.9 284.6 346.2 285.9Q345.4 287.1 345.8 288.2Q346.1 289.3 347.6 290.2L353.7 293.8L352.7 295.4L346.5 291.8Q344.4 290.6 343.9 288.8Q343.5 287.1 344.7 285Z", "M336.5 298.1 342.7 309.7 341.7 311 328.9 307.9 330.1 306.3 333.7 307.3 332.8 307.6 337.2 301.9 337.1 302.9 335.3 299.7ZM340.5 309 337.4 303.5 338 303.4 334.4 308 334.3 307.4 340.5 309Z", "M314.5 327.6 316 329.2 314.3 330.7 312.9 329Z", "M290.5 341.6 296.7 351.9 295 352.9 292.4 348.5 286.9 351.8 289.5 356.2 287.8 357.2 281.6 346.9 283.3 345.9 286 350.4 291.5 347.1 288.9 342.6Z", "M272.2 351.8 272 365 270.5 365.6 260.8 356.7 262.7 355.9 265.3 358.5 264.4 358.3 271 355.5 270.4 356.3 270.4 352.6ZM270.4 363.3 270.4 356.9 271 357.2 265.6 359.5 265.8 358.9 270.4 363.3Z", "M250.8 360.1 254.4 371.6 252.5 372.2 248.9 360.7Z", "M237.5 363.8 239.9 375.6 234.9 376.6Q233 377 231.7 376.3Q230.5 375.5 230.2 373.9Q230 372.8 230.3 372Q230.6 371.1 231.4 370.5Q232.2 369.9 233.5 369.6L233.4 369.9L232.9 370Q232.2 370.2 231.7 369.9Q231.1 369.7 230.6 369L227.8 365.8L229.9 365.3L232.7 368.7Q233 369 233.3 369.2Q233.6 369.4 234 369.4Q234.4 369.4 234.8 369.3L236.5 369L235.6 364.2ZM236.8 370.4 234.1 371Q232.9 371.2 232.4 371.8Q231.9 372.5 232.1 373.5Q232.3 374.5 233 374.8Q233.7 375.2 234.9 375L237.6 374.4Z", "M199.7 367.8Q201 367.8 201.9 368.3Q202.8 368.7 203.3 369.4Q203.8 370.1 203.7 371Q203.7 371.8 203.4 372.4Q203.2 373.1 202.6 373.6Q202 374.1 201.3 374.6L200.7 374.9L201 374.5Q201.7 375.3 202.1 376Q202.4 376.7 202.4 377.4Q202.4 378.2 202 378.8Q201.6 379.5 200.8 379.8Q200.1 380.2 199.1 380.1Q198.2 380.1 197.6 379.8Q196.9 379.5 196.6 378.9Q196.2 378.3 196.2 377.6Q196.2 376.9 196.5 376.4Q196.7 375.8 197.3 375.3Q197.9 374.7 198.8 374.2L198.8 374.7L195.9 371.5L196.3 371.5Q195.9 372.1 195.6 373.1Q195.4 374.1 195.3 375.1L193.7 375.1Q193.8 373.7 194.1 372.5Q194.5 371.2 195.2 370.3L195.2 370.8L192.5 367.9L194.8 368L196.3 369.6L195.8 369.6Q196.5 368.8 197.6 368.3Q198.6 367.8 199.7 367.8ZM199.6 369.4Q198.7 369.4 198.1 369.7Q197.4 370 196.8 370.7L196.9 370.2L200.4 373.9L199.6 373.8L200.1 373.5Q200.7 373.2 201.1 372.8Q201.5 372.5 201.7 372.1Q201.8 371.7 201.8 371.2Q201.8 370.3 201.3 369.9Q200.7 369.4 199.6 369.4ZM199.1 378.8Q199.8 378.8 200.2 378.4Q200.6 378 200.6 377.4Q200.6 377.1 200.5 376.8Q200.4 376.5 200.1 376.1Q199.9 375.8 199.4 375.3L199.9 375.3Q199.1 375.7 198.7 376.1Q198.2 376.4 198.1 376.8Q197.9 377.1 197.9 377.5Q197.8 378.1 198.2 378.4Q198.6 378.8 199.1 378.8Z", "M168.5 365.1 165.9 376.8 164.3 376.5 161.7 367.1 162.2 367.2 155.8 374.5 154.2 374.2 156.9 362.5 158.6 362.9 156.6 371.8 156.2 371.7 161.7 365.5 162.9 365.7 165.1 373.7 164.7 373.6 166.8 364.7Z", "M146.7 359.4 137.4 368.8 135.9 368.2 135.1 355.1 137 355.8 137.1 359.5 136.5 358.7 143.3 361.2 142.3 361.4 144.8 358.7ZM137.5 366.5 141.8 361.8 142.1 362.4 136.6 360.4 137.2 360.1 137.4 366.4Z", "M125.5 350.6 119.9 361.2 118.2 360.3 120.6 355.6 120.6 355.6 113.3 357.8 111.2 356.6 119.8 354.1 119.3 354.9 116.5 345.9 118.7 347 121.1 354.6 121.1 354.6 123.7 349.7Z", "M107.9 340.6 101.1 350.4 94.6 346 95.5 344.7 100.5 348.1 102.5 345.2 97.8 342 98.7 340.7 103.4 343.9 105.5 340.8 100.5 337.4 101.4 336.1Z", "M88.9 325.8Q90.7 327.4 90.8 329.2Q90.9 331 89.3 332.9L84.6 338.2L83.1 336.9L87.8 331.6Q88.9 330.3 88.9 329.2Q88.9 328 87.7 327.1Q86.6 326.1 85.5 326.2Q84.4 326.3 83.3 327.6L78.6 332.9L77.1 331.6L81.8 326.3Q83.5 324.4 85.3 324.3Q87 324.2 88.9 325.8Z", "M76.8 314.3 67.8 322.2 64.4 318.4Q63.5 317.4 63.3 316.4Q63 315.4 63.3 314.5Q63.6 313.6 64.5 312.9Q65.4 312.1 66.3 311.9Q67.2 311.7 68.2 312.1Q69.1 312.5 70 313.5L72 315.8L75.5 312.8ZM70.9 316.8 69 314.7Q68.2 313.8 67.4 313.7Q66.5 313.6 65.8 314.3Q65 315 65 315.8Q65 316.6 65.8 317.6L67.6 319.7Z", "M53.7 289.4 51.8 290.5 50.7 288.6 52.6 287.5Z", "M42.5 258.1Q43.2 259.8 42.9 261.3Q42.7 262.8 41.6 263.9Q40.6 265.1 38.8 265.7Q37 266.4 35.5 266.2Q34 266 32.8 265.1Q31.6 264.1 31 262.4Q30.6 261.2 30.5 260.1Q30.5 259 30.9 258.1L32.6 258.1Q32.3 259.1 32.3 260Q32.3 260.8 32.6 261.7Q33.3 263.5 34.7 264Q36.1 264.5 38.1 263.8Q40.1 263 40.8 261.7Q41.5 260.4 40.9 258.6Q40.5 257.7 39.9 257.1Q39.4 256.4 38.5 255.9L39.7 254.8Q40.6 255.2 41.4 256Q42.1 256.9 42.5 258.1Z", "M37.7 243.7 26.1 246.5 24.2 238.9 25.7 238.5 27.2 244.3 30.6 243.5 29.3 238 30.8 237.6 32.1 243.1 35.7 242.2 34.3 236.4 35.9 236Z", "M33.8 224.8 21.9 226.3 21.7 224.8 30.1 216.7 30.1 217.1 20.9 218.2 20.7 216.4 32.6 214.9 32.8 216.4 24.4 224.5 24.3 224.1 33.6 223Z", "M32 200.2 21.7 200.1 21.6 204.3 20 204.3 20 194 21.7 194 21.7 198.2 32 198.2Z", "M32.8 183.5 20.9 182 21.5 177Q21.7 175 22.8 174.1Q23.9 173.2 25.5 173.4Q26.6 173.5 27.3 174.1Q28.1 174.7 28.4 175.6Q28.7 176.6 28.5 177.9L28.3 177.7L28.3 177.2Q28.4 176.5 28.8 176Q29.2 175.6 30 175.3L34 173.7L33.7 175.8L29.7 177.4Q29.2 177.6 29 177.8Q28.7 178.1 28.6 178.4Q28.4 178.7 28.4 179.2L28.2 180.9L33 181.6ZM26.7 180.8 27 178Q27.2 176.8 26.8 176.1Q26.3 175.4 25.3 175.3Q24.3 175.1 23.7 175.7Q23.2 176.3 23 177.5L22.7 180.3Z", "M35.7 164.3 25.5 156.1 25.9 154.5 38.8 152.3 38.3 154.2 34.7 154.8 35.4 154.1 33.6 161.1 33.3 160.1 36.2 162.3ZM27.7 155.8 32.8 159.7 32.2 160 33.7 154.3 34.1 154.9 27.8 155.8Z", "M42.2 142.2 31 137.9 31.8 136 41.4 139.8 43.5 134.3 45 135Z", "M56.2 113.1 46 106.7 50.1 100.2 51.5 101.1 48.4 105.9 51.5 107.8 54.3 103.3 55.7 104.1 52.8 108.7 57.2 111.5Z", "M66.7 97.8 57.3 90.3 58.5 88.7 66.6 95.2 70.2 90.6 71.5 91.7Z", "M82.6 80Q81.7 80.9 80.7 81.4Q79.6 81.8 78.5 81.7Q77.4 81.7 76.3 81.1Q75.2 80.6 74.3 79.6Q73.3 78.6 72.8 77.5Q72.3 76.4 72.2 75.3Q72.2 74.2 72.6 73.2Q73.1 72.1 74 71.2Q74.9 70.3 76 69.9Q77 69.5 78.1 69.5Q79.2 69.6 80.3 70.1Q81.4 70.6 82.4 71.6Q83.4 72.6 83.9 73.7Q84.4 74.8 84.4 75.9Q84.5 77 84 78.1Q83.6 79.1 82.6 80ZM81.4 78.8Q82.3 78 82.5 77.1Q82.7 76.1 82.3 75.1Q81.9 74.1 80.9 73.1Q79.9 72.1 78.9 71.7Q77.9 71.2 77 71.4Q76 71.6 75.2 72.4Q74.4 73.2 74.2 74.2Q74 75.1 74.4 76.1Q74.7 77.1 75.7 78.2Q76.7 79.2 77.7 79.6Q78.7 80 79.7 79.8Q80.6 79.6 81.4 78.8Z", "M95.3 68.5 88.1 59 92.1 55.9Q93.7 54.7 95.1 54.8Q96.5 54.9 97.5 56.3Q98.2 57.2 98.3 58.1Q98.4 59 97.9 59.9Q97.4 60.8 96.4 61.5L96.4 61.3L96.8 61Q97.3 60.5 97.9 60.5Q98.6 60.5 99.3 60.8L103.2 62.6L101.5 63.9L97.5 62.1Q97.1 61.9 96.7 61.9Q96.4 61.9 96.1 62Q95.7 62.1 95.4 62.4L93.9 63.5L96.9 67.3ZM93.1 62.3 95.3 60.6Q96.3 59.9 96.5 59.1Q96.7 58.3 96 57.5Q95.4 56.7 94.6 56.6Q93.8 56.6 92.8 57.4L90.6 59Z", "M112.3 56.7 106.1 46.4 107.8 45.4 114 55.7Z", "M124.3 49.9 119.3 39.1 123.2 37.2Q125 36.4 126.6 36.4Q128.1 36.5 129.3 37.4Q130.6 38.3 131.4 40Q132.2 41.8 132.1 43.3Q132 44.8 131 46Q130.1 47.2 128.3 48.1ZM125.4 47.6 127.5 46.7Q129.4 45.7 129.9 44.3Q130.4 42.9 129.5 40.9Q128.6 38.9 127.2 38.4Q125.7 37.9 123.8 38.8L121.7 39.7Z", "M143.4 41.7 144.9 28.7 146.5 28.2 155.2 38 153.3 38.6 150.9 35.8 151.9 36 145 38.2 145.7 37.4 145.3 41.1ZM146.3 30.5 145.7 36.8 145.2 36.5 150.7 34.7 150.5 35.3 146.3 30.5Z", "M178.2 29.9 177.9 27.8 180.1 27.5 180.4 29.7Z"];
const MONO_A = "M136.5 240Q136.5 237.8 137.2 236.5Q137.9 235.3 138.9 235L147.4 232.5L144 236.1L177.5 144.4Q177.9 143.3 178.9 142.7Q179.9 142.2 181 142Q182.1 141.8 183 141.8Q183.8 141.8 184.6 141.8Q185.5 141.9 186.4 142.2L222.9 235.7L218.3 232.2L231.5 234.9Q231.5 236.8 230.9 237.9Q230.3 239 228.7 240H199.9Q199.9 237.8 200.6 236.5Q201.2 235.3 202.3 235L212.4 232.4L211 235.2L178.6 152.3L181.3 152L150.5 236.1L150.1 232.2L163 234.9Q163 236.8 162.5 237.9Q162 239 160.1 240ZM159 207.2 160.6 201.5H200.5L202.3 207.2Z";
const MONO_S = "M224.4 257.8Q220.1 257.8 215 256.8Q210 255.9 205.1 254.2Q200.2 252.5 196.2 250.4L201.6 230.6Q203 228.5 205.3 228.5Q206.9 228.5 207.5 229.1L205.4 248.4L203.7 244Q206.1 246.2 209.8 248Q213.5 249.8 217.6 250.8Q221.7 251.9 225.3 251.9Q231.5 251.9 236.4 249Q241.4 246.1 244.4 241.4Q247.4 236.8 247.4 231.2Q247.4 227.3 245.9 224.4Q244.4 221.4 240.5 218.3Q236.6 215.2 229.4 211.2Q221.7 206.8 217.4 203.3Q213.1 199.9 211.4 196.1Q209.7 192.3 209.7 187.3Q209.7 178.8 213.7 172.1Q217.7 165.5 224.6 161.6Q231.5 157.8 240.3 157.8Q245.8 157.8 252 159.4Q258.2 161.1 263.8 164.3L258.8 183.2Q256.9 183.2 255.7 182.5Q254.5 181.8 254.5 180.7L255.3 166L257.1 171.3Q254.6 167.8 249.6 165.8Q244.6 163.7 239.1 163.7Q233.2 163.7 228.7 166Q224.2 168.4 221.6 172.6Q219.1 176.8 219.1 182.4Q219.1 186.1 220.4 188.9Q221.8 191.6 225.9 194.5Q229.9 197.3 237.7 201.6Q245.3 205.7 249.7 209.5Q254.1 213.3 256 217.5Q257.9 221.7 257.9 227.1Q257.9 235.6 253.5 242.6Q249 249.6 241.4 253.7Q233.7 257.8 224.4 257.8Z";

const SEAL_VB = '0 0 400 400';
/** The seal's static parts, as SVG markup inside a 400×400 viewBox. `glyphs` inlines one path per
 *  ring glyph (the opening animates them); otherwise the ring is a <use> of the page's defs. */
export const sealParts = ({ glyphs = false } = {}) => `<circle class="seal-disc" cx="200" cy="200" r="198"/><circle class="seal-r1" cx="200" cy="200" r="190" pathLength="1"/><circle class="seal-r2" cx="200" cy="200" r="150" pathLength="1"/><g class="seal-txt">${glyphs ? RING.map((d) => `<path d="${d}"/>`).join('') : '<use href="#blSealRing"/>'}</g><g class="seal-mono"><g class="seal-a">${glyphs ? `<path d="${MONO_A}"/>` : '<use href="#blSealA"/>'}</g><g class="seal-s">${glyphs ? `<path d="${MONO_S}"/>` : '<use href="#blSealS"/>'}</g></g>`;
const sealDefs = () => `<svg class="seal-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs><g id="blSealRing">${RING.map((d) => `<path d="${d}"/>`).join('')}</g><path id="blSealA" d="${MONO_A}"/><path id="blSealS" d="${MONO_S}"/></defs></svg>`;
/** The seal. cls: 'seal--spin' turns the ring text slowly (only while on screen; never under reduced
 *  motion); 'seal--plain' drops the blush disc (for use on a blush ground). Sized by CSS (width). */
export const seal = ({ cls = '', label = '' } = {}) =>
  `<svg class="seal${cls ? ` ${cls}` : ''}" viewBox="${SEAL_VB}" focusable="false" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}>${sealParts()}</svg>`;

/* ---------- navigation ----------
   Blush's own page set (SITES.blush.pages). NAV in site.mjs still lists the first three sites'
   Services and Reviews, which Blush does not have, so the labels come from NAV where it has the
   page and from here otherwise. */
const NOTES = { portfolio: 'The Looks &amp; The Reel', bridal: 'Packages, prices &amp; questions', about: 'Hey Gorgeous', journal: 'Notes from her chair', 'bridal-inquiry': 'Weddings start here' };
export const BNAV = pagesOf(S)
  .filter((p) => p && !p.includes('/'))
  .map((p) => {
    const n = NAV.find((x) => x.path === p);
    return { path: p, label: p === 'journal' ? 'Journal' : n?.label ?? p, menu: p === 'journal' ? 'Journal' : n?.menu ?? p, note: NOTES[p] ?? n?.note ?? '', cta: p === 'bridal-inquiry' };
  });
const cur = (c, p) => (c === p || (p && c.startsWith(`${p}/`)) ? ' aria-current="page"' : '');

/* ---------- type ---------- */
/** Mixed roman / italic: every *phrase* between asterisks is set in the italic. mix('Soft glam, *cake free*.') */
export const mix = (t) => String(t).replace(/\*([^*]+)\*/g, '<em>$1</em>');
/** Kicker: small tracked caps with a tiny ring in front. tone 'soft' greys it (on blush grounds keep the default). */
export const kicker = (text, cls = '') => `<p class="kick${cls ? ` ${cls}` : ''}">${text}</p>`;
/** A display heading in Petrona with *italic* phrases. Sizes: d-xl, d-l, d-m, d-s.
 *  h(2, 'Fresh from *her chair*', 'd-l'). `text` may also be [line1, line2]: line 2 starts a new line. */
export const h = (level, text, cls = 'd-l', attrs = '') => {
  const t = Array.isArray(text) ? text.map(mix).join('<br>') : mix(text);
  return `<h${level} class="${cls}"${attrs ? ` ${attrs}` : ''}>${t}</h${level}>`;
};
/** One script word (Great Vibes, mauve). Sparingly: at most two per page. */
export const script = (word, cls = '') => `<span class="scr${cls ? ` ${cls}` : ''}">${word}</span>`;
/** The Stewardess lockup: spaced caps with a script word laid over them. The accessible name is
 *  `label` (or caps + word). overCaps({ caps: 'Love', word: 'notes', level: 2 }) */
export const overCaps = ({ caps, word, level = 2, cls = '', label = '' }) =>
  `<h${level} class="oc${cls ? ` ${cls}` : ''}" aria-label="${esc(label || `${caps} ${word}`)}"><span class="oc-c" aria-hidden="true">${caps}</span><span class="oc-s" aria-hidden="true">${word}</span></h${level}>`;
/** A lead paragraph. */
export const lede = (text, cls = '') => `<p class="lede${cls ? ` ${cls}` : ''}">${text}</p>`;

/* ---------- actions ---------- */
/** "Now booking 2026 & 2027 weddings" as a soft chip with a live dot. */
export const bookingLine = (cls = '') => `<p class="chip${cls ? ` ${cls}` : ''}"><i class="chip-dot" aria-hidden="true"></i>${HER.booking}</p>`;
/** Both ways to book: the bridal inquiry (primary, ink pill) and event glam (outlined). */
export const actions = ({ inq = 'Begin your inquiry', event = 'Book event glam', cls = '' } = {}) =>
  `<div class="acts${cls ? ` ${cls}` : ''}">${inquire(S, `${inq} ${arrow}`, 'btn btn--pri')}${book('event', event, 'btn btn--sec')}</div>`;
/** A quiet text link with an arrow. more(href('blush','about'), 'More about Amairany') */
export const more = (url, label, cls = '') => `<a class="more${cls ? ` ${cls}` : ''}" href="${url}"${/^https?:/.test(url) ? ' rel="external"' : ''}>${label} ${arrow}</a>`;
/** The next step every section ends on: a short line and up to two links (the inquiry by default).
 *  next({ line: 'Love what you see?', go: [inquire(S, 'Begin your inquiry'), more(href(S,'portfolio'), 'See every look')] }) */
export const next = ({ line = '', go, cls = '' } = {}) =>
  `<div class="next${cls ? ` ${cls}` : ''}">${line ? `<p class="next-l">${line}</p>` : ''}<div class="next-go">${(go ?? [inquire(S, `Begin your inquiry ${arrow}`, 'more')]).join('')}</div></div>`;

/* ---------- frames ---------- */
const SHAPES = ['circle', 'arch', 'card', 'tall', 'sq', 'wide'];
/** One of her photographs in a soft frame.
 *  shape: 'circle' | 'arch' (portrait with a round top) | 'card' (3:4, 22px corners) | 'tall' (9:16,
 *  for the 576px reel stills) | 'sq' | 'wide' (3:2).  cap: a caption under the frame (her credit is
 *  added automatically for the collaboration stills).  rv: reveal class on the figure. */
export const frame = (key, { shape = 'card', sizes = '(max-width:899px) 88vw, 40vw', alt, eager = false, pos, cls = '', cap = '', rv = 'rv-im' } = {}) => {
  if (!SHAPES.includes(shape)) throw new Error(`frame shape "${shape}"`);
  const credit = PHOTOS[key]?.credit ? `Makeup by ${SITE.first} &middot; ${PHOTOS[key].credit}` : '';
  const c = [cap, credit].filter(Boolean).join(' &middot; ');
  return `<figure class="fr fr--${shape}${cls ? ` ${cls}` : ''}${rv ? ` ${rv}` : ''}"><div class="fr-m">${pic(key, { alt, sizes, eager, pos })}</div>${c ? `<figcaption class="cap">${c}</figcaption>` : ''}</figure>`;
};
/** Where a clip's finished look begins, in seconds. Four of her clips open on the client before
 *  any makeup (a TikTok transformation); on this site they play, and loop, from the finished look.
 *  filmFrame() applies it automatically (data-film-from, read by site.js). */
export const FILM_FROM = { f2: 4.2, f7: 4.7, f13: 4.2, f14: 2.2 };
const fromAttr = (id) => (FILM_FROM[id] ? ` data-film-from="${FILM_FROM[id]}"` : '');
/** A film in the same frames: her clip (lazy, muted, looping; site.js plays it near the viewport,
 *  at most three at once, and leaves the poster for reduced motion / Save-Data). */
export const filmFrame = (id, { shape = 'tall', label = '', cls = '', cap = '', rv = 'rv-im' } = {}) =>
  `<figure class="fr fr--film fr--${shape}${cls ? ` ${cls}` : ''}${rv ? ` ${rv}` : ''}"${fromAttr(id)}><div class="fr-m">${film(id, { label })}</div>${cap ? `<figcaption class="cap">${cap}</figcaption>` : ''}</figure>`;
/** A picture beside a film: an arch portrait with a round film window overlapping its corner. */
export const pair = ({ image, film: f = 'f7', cap = '', filmCap = '', alt, pos, cls = '' } = {}) =>
  `<div class="pair${cls ? ` ${cls}` : ''}">${frame(image, { shape: 'arch', sizes: '(max-width:899px) 64vw, 30vw', alt, pos, cap, cls: 'pair-ph' })}${filmFrame(f, { shape: 'circle', cap: filmCap, cls: 'pair-film' })}</div>`;

/* ---------- sections ---------- */
/** A section. tone: 'cream' (the page) | 'blush' | 'paper' (white-warm). `wrap: false` leaves out the inner .wrap. */
export const section = ({ id = '', tone = 'cream', cls = '', label = '', labelledby = '', wrap = true }, inner) =>
  `<section class="sec sec--${tone}${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''}${label ? ` aria-label="${esc(label)}"` : ''}${labelledby ? ` aria-labelledby="${labelledby}"` : ''}>${wrap ? `<div class="wrap">${inner}</div>` : inner}</section>`;
/** A section's heading block: kicker, heading, line. align 'center' | 'left'. */
export const secHead = ({ kick = '', heading, line = '', level = 2, size = 'd-l', id = '', align = 'center', cls = '' }) =>
  `<header class="sh sh--${align}${cls ? ` ${cls}` : ''}">${kick ? kicker(kick, 'rv') : ''}${h(level, heading, `${size} rv`, id ? `id="${id}"` : '')}${line ? lede(line, 'rv') : ''}</header>`;

/** The title card at the top of an interior page: kicker, the page's h1 (mixed roman/italic), a
 *  line, both actions, and a portrait (arch) or a film (circle) beside it. */
export const cover = ({ kick = '', heading = '', sub = '', actions: acts, image = '', film: f = '', alt, pos, h1 = true, id = '', after = '' } = {}) => `<section class="cover${image || f ? ' cover--art' : ''}"${id ? ` id="${id}"` : ''}>
<div class="wrap cover-in"><div class="cover-txt">
${kick ? kicker(kick, 'rv') : ''}
${h(h1 ? 1 : 2, heading, 'd-xl rv')}
${sub ? lede(sub, 'rv') : ''}
${acts === false ? '' : `<div class="rv">${acts ?? actions()}</div>`}
${bookingLine('rv')}
${after}
</div>${f ? `<div class="cover-art">${filmFrame(f, { shape: 'circle', rv: '' })}</div>` : image ? `<div class="cover-art">${frame(image, { shape: 'arch', eager: true, alt, pos, sizes: '(max-width:899px) 70vw, 34vw', rv: '' })}</div>` : ''}</div>
</section>`;

/** The closing every interior page ends on (just before the footer): a round portrait beside her
 *  own line and both actions, on cream, so it never doubles the blush footer under it.
 *  image: a PHOTOS key for the circle (pick one the page has not already used). */
export const closing = ({ kick = 'Two ways to book', heading = 'Secure your *wedding day glam.*', line = 'Weddings start with an inquiry. Events book straight onto her calendar.', image = 'bride-crystal', alt = '' } = {}) =>
  section({ tone: 'cream', cls: 'close', label: 'Book' }, `<div class="close-in">${frame(image, { shape: 'circle', sizes: '(max-width:899px) 60vw, 360px', alt, cls: 'close-ph' })}<div class="close-txt">${kicker(kick, 'rv')}${h(2, heading, 'd-xl rv')}${line ? lede(line, 'rv') : ''}<div class="rv">${actions()}</div>${bookingLine('rv')}</div></div>`);

/* ---------- content kit ---------- */
/** Love Notes: WeddingWire, The Knot and Google as three one-tap pills with their ratings, dated. */
export const loveNotes = ({ cls = '' } = {}) => {
  const sites = [...REVIEWS.sites.map((s) => ({ ...s, asOf: SITE.ratingsAsOf })), { ...REVIEWS.google, go: 'Read on Google' }];
  return `<ul class="ln${cls ? ` ${cls}` : ''}" data-stag=".08">${sites.map((s) => `<li class="rv"><a class="ln-a" href="${s.href}" rel="external"><span class="ln-n">${s.name}</span><span class="ln-s" aria-label="rated ${s.score} out of 5">${s.score}<i aria-hidden="true">&#9733;</i></span><span class="ln-m">${s.meta}</span><span class="ln-go" aria-hidden="true">${arrow}</span></a></li>`).join('')}</ul><p class="ln-asof">Ratings as shown on each site: WeddingWire and The Knot on ${SITE.ratingsAsOf}, Google on ${REVIEWS.google.asOf}.</p>`;
};
/** One package card: name, who it is for, the price (as listed on her booking page), what it
 *  includes. `featured` (default: the one her page calls most popular) adds the script tag. */
export const packageCard = (p, { featured = /most popular/i.test(p.who), cls = '' } = {}) => `<article class="pk${featured ? ' pk--pop' : ''}${cls ? ` ${cls}` : ''}">
${featured ? `<p class="pk-tag">${script('most popular')}</p>` : ''}<h3 class="pk-n">${p.name}</h3><p class="pk-w">${p.who.replace(/\s*·\s*most popular/i, '')}</p>
<p class="pk-p"><span class="pk-cur">$</span>${p.price}</p>
<ul class="pk-l">${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
</article>`;
/** The note that must sit with any prices. */
export const packagesNote = (cls = '') => `<p class="pk-note${cls ? ` ${cls}` : ''}">${HER.packagesNote}</p>`;
/** A pull quote of her own words (italic Petrona, mauve rules). cite: who said it. */
export const quote = (text, cite = '', cls = '') => `<blockquote class="pq${cls ? ` ${cls}` : ''}"><p>${text}</p>${cite ? `<cite>${cite}</cite>` : ''}</blockquote>`;
/** Questions and answers as native <details> (soft accordions): faq(HER.faq). Works with no script. */
export const faq = (items, cls = '') => `<div class="faq${cls ? ` ${cls}` : ''}">${items.map(([q, a]) => `<details class="faq-i"><summary><span>${q}</span><i aria-hidden="true"></i></summary><div class="faq-a"><p>${a}</p></div></details>`).join('')}</div>`;
/** TikTok reach, always dated: "178.1K followers · 3.9M likes on TikTok, as of …". */
export const socialLine = (cls = '') => `<p class="soc${cls ? ` ${cls}` : ''}"><strong>${SOCIAL.tiktok.followers}</strong> followers &middot; <strong>${SOCIAL.tiktok.likes}</strong> likes on TikTok <span class="soc-d">as of ${SOCIAL.asOf}</span></p>`;

/* ---------- The Looks: a soft swipe rail that advances on its own ----------
   items: [{ photo, cap } | { film, cap }]. Native scroll-snap does the swiping; site.js adds the
   auto-advance (only on screen, paused by any touch, never under reduced motion), the arrows, the
   counter and the pause button. With no script it is a plain swipe rail. */
export const rail = ({ id, items, label = 'Her looks', auto = 3800, cls = '' }) => {
  const n = items.length;
  const slides = items.map((it, i) => {
    const capOf = it.cap ?? (it.film ? FILMS[it.film].title : '');
    return `<li class="rail-it" data-i="${i}">${it.film
      ? filmFrame(it.film, { shape: 'card', label: it.label ?? FILMS[it.film].label, cap: capOf, rv: '' })
      : frame(it.photo, { shape: 'card', sizes: '(max-width:599px) 74vw, (max-width:1099px) 40vw, 300px', cap: capOf, rv: '' })}</li>`;
  }).join('');
  return `<div class="rail${cls ? ` ${cls}` : ''}" id="${id}" data-rail data-auto="${auto}">
<ul class="rail-track" tabindex="0" aria-label="${esc(label)}: swipe, or use the arrow keys">${slides}</ul>
<div class="rail-ctl">
<button class="ic" type="button" data-rail-prev aria-label="Previous look" hidden><span aria-hidden="true">&larr;</span></button>
<p class="rail-n" aria-hidden="true"><span data-rail-n>1</span> / ${n}</p>
<button class="ic" type="button" data-rail-next aria-label="Next look" hidden><span aria-hidden="true">&rarr;</span></button>
<button class="pz" type="button" data-rail-toggle aria-controls="${id}" hidden><span class="pz-i" aria-hidden="true"></span><span class="pz-t">Pause</span></button>
</div>
</div>`;
};

/* ---------- her reels: round film windows ----------
   ids: FILMS keys. Each window shows the clip in a circle, its title, and the view count where
   FILMS has one (dated). Collaboration clips carry their credit inside the circle. */
export const reels = ({ ids, cls = '' }) => `<ul class="reels${cls ? ` ${cls}` : ''}" data-stag=".1">${ids.map((id) => {
  const f = FILMS[id];
  return `<li class="reel rv">${filmFrame(id, { shape: 'circle', rv: '' })}<p class="reel-t">${f.title}</p><p class="reel-m">${f.label}${f.views ? ` &middot; ${f.views} views` : ''}</p></li>`;
}).join('')}</ul>`;

/* ---------- header, menu, pill, footer ---------- */
const wordmark = () => `<span class="wm"><span class="wm-n">Amairany<span class="wm-l"> Sierra</span></span><span class="wm-t">Hair &amp; Makeup</span></span>`;

function header(path) {
  const primary = BNAV.filter((n) => !n.cta);
  return `<header class="hd" id="siteHeader">
<div class="hd-in">
<a class="hd-logo" href="${href(S)}" aria-label="${SITE.name}, hair and makeup: home">${seal({ cls: 'hd-seal' })}${wordmark()}</a>
<nav class="hd-nav" aria-label="Primary">${primary.map((n) => `<a href="${href(S, n.path)}"${cur(path, n.path)}>${n.label}</a>`).join('')}</nav>
<div class="hd-tools">
${book('event', 'Book event', 'hd-ev')}
${inquire(S, 'Inquire', 'btn btn--pri btn--sm hd-cta', path === 'bridal-inquiry' ? 'aria-current="page"' : '')}
<button class="menu-btn" id="menuOpen" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-btn-t">Menu</span><span class="bars" aria-hidden="true"><i></i><i></i></span></button>
</div>
</div>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" inert>
<div class="menu-top"><a class="hd-logo" href="${href(S)}" aria-label="${SITE.name}, home">${seal({ cls: 'hd-seal' })}${wordmark()}</a><button class="menu-x" id="menuClose" type="button"><span>Close</span><i aria-hidden="true"></i></button></div>
<div class="menu-body">
<nav aria-label="Main menu"><ul class="menu-list">
<li><a href="${href(S)}"${path === '' ? ' aria-current="page"' : ''}><span class="ml">Home</span><span class="mo">Welcome</span></a></li>
${BNAV.map((n) => `<li><a href="${href(S, n.path)}"${cur(path, n.path)}><span class="ml">${n.menu}</span><span class="mo">${n.note}</span></a></li>`).join('\n')}
</ul></nav>
<div class="menu-side">
${bookingLine()}
${actions({ cls: 'acts--stack' })}
<div class="menu-links">
<div><p class="menu-h">Follow</p><a href="${L.ig}" rel="external">Instagram</a><a href="${L.tiktok}" rel="external">TikTok</a><a href="${L.google}" rel="external">Google reviews</a></div>
<div><p class="menu-h">${HER.links.reviewsName}</p><a href="${L.ww}" rel="external">WeddingWire &middot; 5.0</a><a href="${L.knot}" rel="external">The Knot &middot; 5.0</a></div>
</div>
</div>
</div>
${seal({ cls: 'menu-seal seal--plain' })}
<p class="menu-foot">${HER.badges.join(' &middot; ')} &middot; ${SITE.area}</p>
</div>`;
}

/** The floating pill (every page but the inquiry itself): bottom-centre once the first screen has
 *  scrolled away; the preview marker is lifted above it while it shows. */
const pill = (path) => (path === 'bridal-inquiry' ? '' : `<a class="pill" id="blPill" href="${href(S, 'bridal-inquiry')}" data-inquire><span class="pill-dot" aria-hidden="true"></span><span>Begin your inquiry</span>${arrow}</a>`);

function footer() {
  return `<footer class="ft">
<div class="wrap">
<div class="ft-top">
<a class="ft-logo" href="${href(S)}" aria-label="${SITE.name}, home">${seal({ cls: 'ft-seal seal--spin' })}</a>
<p class="ft-line">${mix('Soft glam to full glam, *cake free*, for brides across Orlando + Tampa and destination weddings worldwide.')}</p>
${actions({ cls: 'acts--center' })}
${bookingLine('ft-book')}
</div>
<div class="ft-grid">
<div><p class="ft-h">Explore</p><ul class="ft-l"><li><a href="${href(S)}">Home</a></li>${BNAV.map((n) => `<li><a href="${href(S, n.path)}">${n.menu}</a></li>`).join('')}</ul></div>
<div><p class="ft-h">Book</p><ul class="ft-l"><li>${inquire(S, 'Bridal inquiry')}</li><li>${book('bridal-services', 'Bridal services')}</li><li>${book('event', 'Event hair &amp; makeup')}</li><li><a href="${L.mail}">Email ${SITE.first}</a></li></ul></div>
<div><p class="ft-h">Follow</p><ul class="ft-l"><li><a href="${L.ig}" rel="external">Instagram ${SITE.handle}</a></li><li><a href="${L.tiktok}" rel="external">TikTok ${SITE.handle}</a></li><li><a href="${L.google}" rel="external">Google reviews</a></li></ul></div>
<div><p class="ft-h">${HER.links.reviewsName}</p><ul class="ft-l"><li><a href="${L.ww}" rel="external">WeddingWire &middot; 5.0 &middot; 31 reviews</a></li><li><a href="${L.knot}" rel="external">The Knot &middot; 5.0 &middot; 4 reviews</a></li><li><a href="${L.google}" rel="external">Google &middot; ${REVIEWS.google.score} &middot; ${REVIEWS.google.meta}</a></li></ul></div>
</div>
<div class="ft-base">
<p class="ft-badges">${[SITE.name, ...HER.badges, SITE.areaLong].join(' <i aria-hidden="true"></i> ')}</p>
<p class="ft-fine">${finePrint()}</p>
</div>
</div>
</footer>`;
}

/* ---------- the document ---------- */
/* Two preloads only: the roman display face and the sans (the italic and the script load on use). */
const FONT_PRELOAD = ['petrona-var', 'nunito-sans-var'].map((f) => `<link rel="preload" href="${A}/fonts/${f}.woff2" as="font" type="font/woff2" crossorigin>`).join('\n');
const extra = (list, ext) => list.map((c) => (c.includes('/') ? c : `${B}/${c}.${ext}`));

/** A whole Blush document.
 *  path, title, description: as head() in site.mjs.  main: the page's content (inside <main id="main">).
 *  head: extra <head> markup (a preload for the page's lead image, say).  preHead: markup placed
 *  BEFORE site.css (the Bridal Inquiry passes inquiryHead() here, as inquiry-core.mjs asks).  css / js: extra file names
 *  in assets/blush/ without extension (or full paths), e.g. css: ['pages-work'], js: ['pages-work'].
 *  bodyClass: extra classes on <body>.  opening: markup placed first in <body> (home only: the
 *  opening's gate script and overlay).  foot: extra markup after the scripts (e.g. inquiryFoot()). */
export const page = ({ path = '', title, description, main, head = '', preHead = '', css = [], js = [], bodyClass = '', opening = '', foot = '' }) => `<!doctype html>
<html lang="en">
<head>
${stdHead(S, { path, title, description })}
${FONT_PRELOAD}
${preHead}
<link rel="stylesheet" href="${B}/site.css">
${extra(css, 'css').map((c) => `<link rel="stylesheet" href="${c}">`).join('\n')}
<script>(function(d){d.classList.add('js');setTimeout(function(){if(!window.__blush)d.classList.remove('js');},3500);})(document.documentElement);</script>
${head}
</head>
<body class="blush${bodyClass ? ` ${bodyClass}` : ''}">
${sealDefs()}
${opening}<a class="skip" href="#main">Skip to content</a>
${header(path)}
<main id="main">
${main}
</main>
${footer()}
${pill(path)}
${marker(S, path)}
<script src="${B}/site.js" defer></script>
${extra(js, 'js').map((j) => `<script src="${j}" defer></script>`).join('\n')}
${foot}
</body>
</html>
`;

