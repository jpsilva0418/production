/* STUB — replaced by this site's WORK engineer (portfolio, journal, two posts). */
import { page } from './shell.mjs';
const stub = (path, title) => () => page({ path, title, description: `${title}.`, main: `<h1>${title}</h1><p>Not built yet.</p>` });
export const portfolio = stub('portfolio', 'Portfolio');
export const journal = stub('journal', 'Journal');
export const postPrepare = stub('journal/how-to-prepare', 'How to prepare');
export const postDestination = stub('journal/destination-bride', 'Destination bride');
