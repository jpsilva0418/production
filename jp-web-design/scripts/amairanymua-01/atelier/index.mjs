/* /demo/amairanymua-01 — site "atelier": which module renders which page. */
import { home } from './home.mjs';
import { portfolio, journal, postPrepare, postDestination } from './pages-work.mjs';
import { about, bridal } from './pages-story.mjs';
import { inquiry } from './inquiry.mjs';
export const render = { '': home, portfolio, bridal, about, journal, 'journal/how-to-prepare': postPrepare, 'journal/destination-bride': postDestination, 'bridal-inquiry': inquiry };
