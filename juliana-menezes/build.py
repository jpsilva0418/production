"""Build the three Juliana Menezes demo sites.
python3 -I build.py dev      -> <site>.html beside img/ (relative image paths)
python3 -I build.py final    -> out/<name>.html, every image inlined (portable single file)
python3 -I build.py publish  -> jp-web-design/public/demo/juliana-menezes-01/<site>/index.html
                                 with images in /demo/_shared/juliana-menezes/img/ (append-only)"""
import re, sys, base64, pathlib, html
HERE = pathlib.Path(__file__).resolve().parent
mode = sys.argv[1] if len(sys.argv) > 1 else 'dev'
B = HERE; T = HERE/'templates'; OUT = HERE/'out'
LIB = HERE.parent/'jp-web-design'/'public'/'demo'
SLUG = 'juliana-menezes-01'; SHARED = '/demo/_shared/juliana-menezes'
SITES = [('noir','Noir'),('atelier','Atelier'),('fucsia','Fúcsia')]

SERVICES = [
 ('Unhas', 'Nails', [
  ('Manicure Regular','Classic manicure','50 min',40),
  ('Pedicure Regular','Classic pedicure','55 min',45),
  ('Manicure e Pedicure','Manicure & pedicure','1h40',65),
  ('Manicure + Esmaltação em Gel','Manicure + gel polish','1h30',45),
  ('Pedicure + Esmaltação em Gel','Pedicure + gel polish','1h30',50),
  ('Pé e Mão com Esmaltação em Gel','Hands & feet, gel polish','2h30',85),
  ('Mão c/ Esmalte em Gel + Pé Regular','Gel hands + classic pedicure','2h30',80),
  ('Banho de Gel','Gel overlay','2h',80),
  ('Banho de Gel + Pé Regular','Gel overlay + classic pedicure','3h',120),
  ('Banho de Gel + Pé + Esmalte em Gel','Gel overlay + pedicure with gel','3h30',125),
  ('Alongamento — Primeira Aplicação','Extensions — first set','3h',120),
  ('Manutenção','Extension fill','2h30',90),
  ('Manutenção + Pé c/ Esmalte em Gel','Fill + pedicure with gel','3h30',135),
  ('Manutenção + Pé com Esmalte Regular','Fill + classic pedicure','3h30',130),
  ('Remoção do Alongamento','Extension removal, with cuticle care & polish','1h30',65),
  ('Spa dos Pés','Foot spa — e-file smoothing, cuticle care & polish','2h',70),
  ('Troca de Esmalte em Gel (sem cutícula)','Gel polish change (no cuticle work)','40 min',25),
  ('Remoção do Esmalte em Gel (sem cutícula)','Gel polish removal (no cuticle work)','30 min',15),
  ('Reposição de 1 Unha','Single nail repair','30 min',15),
 ]),
 ('Sobrancelhas & Lábios', 'Brows & Lips', [
  ('Design de Sobrancelhas','Brow design — wax & tweezers, shaped to your face','40 min',35),
  ('Brow Lamination','Brow lamination','1h',70),
  ('Micropigmentação Fio a Fio','Hair-stroke brow microblading','3h',399),
  ('Micropigmentação Labial','Lip blush (lip PMU)','3h',399),
  ('Retoque de Micropigmentação','PMU touch-up','2h',80),
 ]),
]
REVIEWS = [
 ('Queria te elogiar pelo trabalho de hoje. Minhas unhas ficaram perfeitas e impecáveis! Adorei a atenção aos detalhes.','Daniela A.'),
 ('Como sempre um trabalho impecável, cutículas fundinhas e perfeitas.','Jessica D.'),
 ('Juliana é a melhor! Super atenciosa e detalhista.','Paula E.'),
 ('Excelente profissional. Sempre saio muito satisfeita e feliz.','Rose V.'),
 ('The best, my nails always beautiful!','Bruna'),
 ('Juliana é perfeita no trabalho dela ♥️','Laura C.'),
]
LINKS = dict(BOOK='https://julianamenezes.setmore.com/', WA='https://wa.me/17815028753',
             IG='https://www.instagram.com/unhasdajuboston/', COURSE='https://wa.link/t5uszo')

def bi(pt, en): return f'<span class="pt">{pt}</span><span class="en" lang="en">{en}</span>'

def services_html(groups=None, ids=False):
    out = []
    for gi,(gpt,gen,items) in enumerate(SERVICES):
        if groups is not None and gi not in groups: continue
        out.append(f'<div class="menu-group"><h3 class="menu-title">{bi(gpt,gen)}</h3><ul class="menu">')
        for pt,en,d,p in items:
            out.append(f'<li><span class="svc"><span class="svc-name">{bi(html.escape(pt),html.escape(en))}</span>'
                       f'<span class="svc-time">{d}</span></span><span class="dots" aria-hidden="true"></span>'
                       f'<span class="price">${p}</span></li>')
        out.append('</ul></div>')
    return '\n'.join(out)

def reviews_html():
    return '\n'.join(f'<figure class="review"><blockquote lang="{"en" if q.startswith("The best") else "pt-BR"}">{q}</blockquote>'
                     f'<figcaption>{n}</figcaption></figure>' for q,n in REVIEWS)

COMMON_JS = (T/'common.js').read_text()

def render(name):
    s = (T/f'{name}.html').read_text()
    s = s.replace('{{SERVICES}}', services_html()).replace('{{SERVICES_NAILS}}', services_html([0])) \
         .replace('{{SERVICES_BROWS}}', services_html([1])).replace('{{REVIEWS}}', reviews_html()) \
         .replace('{{COMMON_JS}}', COMMON_JS)
    for k,v in LINKS.items(): s = s.replace('{{'+k+'}}', v)
    s = re.sub(r'\[\[(.+?)\|\|(.+?)\]\]', lambda m: bi(m.group(1), m.group(2)), s, flags=re.S)
    assert '{{' not in s and '[[' not in s, name
    return s

def inline(s):
    def rep(m):
        p = B/m.group(1)
        return 'data:image/jpeg;base64,' + base64.b64encode(p.read_bytes()).decode()
    return re.sub(r'(img/[\w-]+\.jpg)', lambda m: rep(m), s)


DEMO_BAR_CSS = """<style>
.jm-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom));z-index:60;display:flex;align-items:center;gap:6px;
  padding:5px 6px 5px 14px;border-radius:999px;background:rgba(18,14,16,.88);color:#f3ece6;font:600 10.5px/1 system-ui,-apple-system,'Segoe UI',sans-serif;letter-spacing:.12em;text-transform:uppercase;
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 12px 30px -12px rgba(0,0,0,.5);white-space:nowrap}
.jm-bar span{opacity:.75;margin-right:4px}
.jm-bar a{display:inline-grid;place-items:center;min-width:30px;height:30px;padding:0 8px;border-radius:15px;color:#f3ece6;text-decoration:none;letter-spacing:.06em}
.jm-bar a[aria-current="true"]{background:#f3ece6;color:#161113}
.jm-bar a:focus-visible{outline:2px solid #fff;outline-offset:2px}
@media(hover:hover){.jm-bar a:not([aria-current="true"]):hover{background:rgba(255,255,255,.16)}}
@media(max-width:980px){.jm-bar{transition:bottom .35s ease}body.scrolled .jm-bar{bottom:calc(84px + env(safe-area-inset-bottom))}}
@media(max-width:380px){.jm-bar span{display:none}}
</style>"""

def demo_bar(cur):
    cur_attr = ' aria-current="true"'
    links = ''.join(f'<a href="/demo/{SLUG}/{k}"{cur_attr if k==cur else ""} aria-label="Prévia {i+1}, {n}">{i+1:02d}</a>'
                    for i,(k,n) in enumerate(SITES))
    return (f'<nav class="jm-bar" aria-label="Prévias de design"><span>Prévia de design</span>{links}'
            f'<a href="/demo/{SLUG}" aria-label="Ver todas as prévias">Todas</a></nav>')

def publish():
    import shutil, hashlib, json, subprocess, datetime
    simg = LIB/'_shared'/'juliana-menezes'/'img'; simg.mkdir(parents=True, exist_ok=True)
    for f in sorted((B/'img').glob('*.jpg')):
        dst = simg/f.name
        if dst.exists() and dst.read_bytes() != f.read_bytes():
            sys.exit(f'refusing to overwrite differing shared file {dst}')
        shutil.copyfile(f, dst)
    for k,n in SITES:
        s = render(k)
        s = s.replace('<meta name="robots" content="noindex">', '<meta name="robots" content="noindex,nofollow,noarchive">\n'
                      f'<link rel="canonical" href="https://jpsilvadigital.com/demo/{SLUG}/{k}">')
        s = re.sub(r'(?<![\w/])img/([\w-]+\.jpg)', SHARED + r'/img/\1', s)
        s = s.replace('</head>', DEMO_BAR_CSS + '\n</head>', 1).replace('<script>', demo_bar(k) + '\n<script>', 1)
        assert 'noindex,nofollow' in s and '/api/' not in s and 'src="img/' not in s
        d = LIB/SLUG/k; d.mkdir(parents=True, exist_ok=True); (d/'index.html').write_text(s)
        print('wrote', d/'index.html')
    (LIB/SLUG/'index.html').write_text((HERE/'gallery.html').read_text()); print('wrote', LIB/SLUG/'index.html')
    commit = subprocess.run(['git','rev-parse','HEAD'],cwd=HERE,capture_output=True,text=True).stdout.strip()
    (LIB/SLUG/'DEMO.json').write_text(json.dumps({
        'slug': SLUG, 'url': f'https://jpsilvadigital.com/demo/{SLUG}', 'client': 'Ju Menezes Beauty — Juliana Menezes (@unhasdajuboston)',
        'sourceRepo': 'jpsilva0418/production', 'sourceDir': 'juliana-menezes', 'sourceCommit': commit,
        'builtAt': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),
        'pages': len(SITES), 'shared': {'media': SHARED + '/'},
        'variations': {f'{i+1:02d}': {'name': n, 'path': f'/demo/{SLUG}/{k}'} for i,(k,n) in enumerate(SITES)},
    }, ensure_ascii=False, indent=2) + '\n')

NAMES = {'noir':'Juliana-Menezes-Preview-1-Noir', 'atelier':'Juliana-Menezes-Preview-2-Atelier', 'fucsia':'Juliana-Menezes-Preview-3-Fucsia'}
if mode == 'publish':
    publish()
else:
    OUT.mkdir(exist_ok=True)
    for n in (sys.argv[2:] or NAMES):
        s = render(n)
        (B/f'{n}.html').write_text(s)
        if mode == 'final':
            f = OUT/f'{NAMES[n]}.html'; f.write_text(inline(s)); print(f, f.stat().st_size//1024, 'KB')
        else: print(B/f'{n}.html')
