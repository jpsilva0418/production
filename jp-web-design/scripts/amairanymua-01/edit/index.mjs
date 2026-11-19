/* /demo/amairanymua-01 — site "edit": which module renders which page. */
import { home } from './home.mjs';
import { portfolio, reviews } from './pages-work.mjs';
import { about, services, bridal } from './pages-story.mjs';
import { inquiry } from './inquiry.mjs';
export const render = { '': home, about, bridal, services, portfolio, reviews, 'bridal-inquiry': inquiry };
