/* STUB — replaced by this site's STORY engineer (bridal, about). */
import { page } from './shell.mjs';
const stub = (path, title) => () => page({ path, title, description: `${title}.`, main: `<h1>${title}</h1><p>Not built yet.</p>` });
export const about = stub('about', 'About Amairany');
export const bridal = stub('bridal', 'Bridal');
