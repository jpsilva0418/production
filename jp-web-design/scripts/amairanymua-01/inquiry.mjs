/* STUB — replaced by the bridal inquiry module. */
import { page } from './layout.mjs';
import { INQUIRY } from './site.mjs';
export const inquiry = (d) => page(d, { path: 'bridal-inquiry', title: 'Bridal Inquiry', description: 'Bridal inquiry.', headerLight: true, css: ['inquiry'], js: ['inquiry'], main: `<section class="bi"><div class="bi-in"><h1 class="bi-h">${INQUIRY.heading}</h1></div></section>` });
