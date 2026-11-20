#!/usr/bin/env python3
"""Build the single-file concept previews.

    python3 -I concepts/build.py <out-dir>

Each concepts/<name>/index.html is a template. Tokens are replaced with inlined data:
  {{font:<file>}}  -> data:font/woff2;base64,...   (from assets/fonts)
  {{img:<file>}}   -> data:image/...;base64,...    (from assets/img)
  {{js:common}}    -> shared/common.js
The result is one HTML file per concept with no external requests (fonts, images, scripts
inlined). Links out (Square, WhatsApp, Instagram, Maps) are ordinary links."""
import base64, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
MIME = {'.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg'}
def uri(folder, name):
    p = os.path.join(HERE, 'assets', folder, name)
    return f"data:{MIME[os.path.splitext(name)[1]]};base64,{base64.b64encode(open(p, 'rb').read()).decode()}"
os.makedirs(OUT, exist_ok=True)
for name in sorted(os.listdir(HERE)):
    tpl = os.path.join(HERE, name, 'index.html')
    if not os.path.isfile(tpl): continue
    html = open(tpl).read()
    html = re.sub(r'\{\{font:([\w.-]+)\}\}', lambda m: uri('fonts', m.group(1)), html)
    html = re.sub(r'\{\{img:([\w.-]+)\}\}', lambda m: uri('img', m.group(1)), html)
    html = html.replace('{{js:common}}', open(os.path.join(HERE, 'shared', 'common.js')).read())
    # an image used more than once is stored once and assigned at load
    srcs = re.findall(r'<img src="(data:[^"]+)"', html)
    dup = {u for u in srcs if srcs.count(u) > 1}
    if dup:
        keys = {u: f'i{n}' for n, u in enumerate(sorted(dup))}
        html = re.sub(r'<img src="(data:[^"]+)"', lambda m: f'<img data-img="{keys[m.group(1)]}" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="' if m.group(1) in keys else m.group(0), html)
        js = 'var M={' + ','.join(f'{k}:"{u}"' for u, k in keys.items()) + '};document.querySelectorAll("img[data-img]").forEach(function(i){i.src=M[i.dataset.img]});'
        html = html.replace('</body>', f'<script>{js}</script></body>', 1)
    left = re.findall(r'\{\{[^}]*\}\}', html)
    if left: raise SystemExit(f'{name}: unresolved tokens {left}')
    if re.search(r'(?:src|href)="/(?!/)', html): raise SystemExit(f'{name}: root-relative path left')
    if 'noindex' not in html: raise SystemExit(f'{name}: missing noindex')
    out = os.path.join(OUT, f'Karolayne-Souza-{name}.html')
    open(out, 'w').write(html)
    print(f'{os.path.basename(out)}  {os.path.getsize(out)/1e6:.2f} MB')
