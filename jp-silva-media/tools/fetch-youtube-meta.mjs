#!/usr/bin/env node
/* Fetches public metadata and poster frames for the ids in tools/youtube-ids.txt.
   Runs on a GitHub Actions runner (the build sandbox cannot reach YouTube).
   Writes:
     src/data/youtube.json            { [id]: { title, author, authorUrl, poster, … } }  (existing entries are kept)
     public/media/posters/yt-<id>.jpg poster frame (maxres → sd → hq) — only for ids that have no poster yet
   To add a film: append its id to tools/youtube-ids.txt and push; then add a project entry in src/data/projects.mjs. */
import fs from 'node:fs/promises';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const H = { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9', cookie: 'CONSENT=YES+1; SOCS=CAI' };
const ids = (await fs.readFile(path.join(ROOT, 'tools/youtube-ids.txt'), 'utf8')).split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
await fs.mkdir(path.join(ROOT, 'public/media/posters'), { recursive: true });
await fs.mkdir(path.join(ROOT, 'src/data'), { recursive: true });
const get = async (url, as = 'text') => { const r = await fetch(url, { headers: H, redirect: 'follow' }); if (!r.ok) throw new Error(url + ' → ' + r.status); return as === 'buf' ? Buffer.from(await r.arrayBuffer()) : as === 'json' ? r.json() : r.text(); };
const pick = (html, re) => { const m = html.match(re); return m ? m[1] : null; };
const unesc = s => s == null ? null : JSON.parse('"' + s + '"');
let out = {};
try { out = JSON.parse(await fs.readFile(path.join(ROOT, 'src/data/youtube.json'), 'utf8')); } catch (e) {}
const exists = async p => { try { await fs.access(p); return true; } catch (e) { return false; } };
for (const id of ids) {
  if (out[id] && out[id].title && await exists(path.join(ROOT, `public/media/posters/yt-${id}.jpg`))) { console.log('keep', id); continue; }
  const rec = { id };
  try { const o = await get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, 'json'); rec.title = o.title; rec.author = o.author_name; rec.authorUrl = o.author_url; } catch (e) { rec.oembedError = String(e.message); }
  // 1) innertube player endpoint (structured; no page scraping)
  try {
    const r = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', { method: 'POST', headers: { ...H, 'content-type': 'application/json', origin: 'https://www.youtube.com' },
      body: JSON.stringify({ videoId: id, context: { client: { clientName: 'WEB', clientVersion: '2.20240726.00.00', hl: 'en', gl: 'US' } } }) });
    const j = await r.json();
    const vd = j.videoDetails || {}, mf = (j.microformat && j.microformat.playerMicroformatRenderer) || {};
    rec.lengthSeconds = Number(vd.lengthSeconds) || null;
    rec.description = vd.shortDescription || null;
    rec.channelId = vd.channelId || null;
    rec.publishDate = mf.publishDate || mf.uploadDate || null;
    rec.embeddable = (j.playabilityStatus && typeof j.playabilityStatus.playableInEmbed === 'boolean') ? j.playabilityStatus.playableInEmbed : (mf.isFamilySafe != null ? null : null);
    rec.playability = j.playabilityStatus && j.playabilityStatus.status;
  } catch (e) { rec.playerError = String(e.message); }
  // 2) watch page as a fallback for anything still missing
  if (!rec.lengthSeconds || !rec.description || !rec.publishDate) {
    try {
      const html = await get(`https://www.youtube.com/watch?v=${id}&hl=en&has_verified=1&bpctr=9999999999`);
      rec.lengthSeconds = rec.lengthSeconds || Number(pick(html, /"lengthSeconds":"(\d+)"/)) || null;
      rec.publishDate = rec.publishDate || pick(html, /"publishDate":"([^"]+)"/) || pick(html, /"uploadDate":"([^"]+)"/) || pick(html, /itemprop="datePublished" content="([^"]+)"/);
      rec.description = rec.description || unesc(pick(html, /"shortDescription":"((?:[^"\\]|\\.)*)"/)) || pick(html, /<meta name="description" content="([^"]*)"/);
      if (!rec.lengthSeconds && !rec.description) rec.watchHead = html.slice(0, 300);
    } catch (e) { rec.watchError = String(e.message); }
  }
  for (const q of ['maxresdefault', 'sddefault', 'hqdefault']) {
    try { const buf = await get(`https://i.ytimg.com/vi/${id}/${q}.jpg`, 'buf'); if (buf.length > 3000) { await fs.writeFile(path.join(ROOT, `public/media/posters/yt-${id}.jpg`), buf); rec.poster = `posters/yt-${id}.jpg`; rec.posterQuality = q; break; } } catch (e) { /* try next */ }
  }
  out[id] = rec;
  console.log(JSON.stringify({ id, title: rec.title, author: rec.author, length: rec.lengthSeconds, date: rec.publishDate, embeddable: rec.embeddable, playability: rec.playability, poster: rec.posterQuality, err: rec.playerError || rec.watchError || rec.watchHead }));
  if (rec.description) console.log('DESC ' + id + ' :: ' + rec.description.replace(/\n/g, ' | ').slice(0, 1500));
}
await fs.writeFile(path.join(ROOT, 'src/data/youtube.json'), JSON.stringify(out, null, 2) + '\n');
