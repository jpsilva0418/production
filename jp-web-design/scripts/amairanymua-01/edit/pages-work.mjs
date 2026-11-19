/* STUB — replaced by this site's WORK engineer (portfolio, reviews). */
import { page } from './shell.mjs';
const stub = (path, title) => () => page({ path, title, description: `${title}.`, main: `<h1>${title}</h1><p>Not built yet.</p>` });
export const portfolio = stub('portfolio', 'Portfolio');
export const reviews = stub('reviews', 'Reviews');
