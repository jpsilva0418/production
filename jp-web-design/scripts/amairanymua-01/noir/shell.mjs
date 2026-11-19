/* STUB — replaced by this site's LEAD with its real shell (header, menu, footer, page furniture). */
import { head, marker, href, NAV, SITE, finePrint, inquire, book } from '../site.mjs';
const S = 'noir';
export const page = ({ path = '', title, description, main }) => `<!doctype html>
<html lang="en"><head>
${head(S, { path, title, description })}
</head><body style="font-family:system-ui;margin:0;padding:24px 20px 90px;max-width:760px">
<a href="#main">Skip to content</a>
<header><p><a href="${href(S)}">${SITE.name}</a> · ${NAV.map((n) => `<a href="${href(S, n.path)}">${n.label}</a>`).join(' · ')}</p></header>
<main id="main">${main}<p>${inquire(S)} · ${book('event', 'Book event glam')}</p></main>
<footer><p style="font-size:12px">${finePrint()}</p></footer>
${marker(S, path)}
</body></html>
`;
