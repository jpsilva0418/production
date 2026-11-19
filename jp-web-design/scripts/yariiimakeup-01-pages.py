#!/usr/bin/env python3
"""Build /demo/yariiimakeup-01/inquire from the home page's own parts.

    python3 -I scripts/yariiimakeup-01-pages.py

The inquiry page shares the home page's head, header, menu and footer. Rather
than keep two hand-edited copies, this script takes them from index.html,
points their section links back at the home page, and wraps the body in
scripts/yariiimakeup-01-inquire.html around them. Run it after changing
either file. No opening animation, hero, gallery or sticky bar on this page.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
DEMO = os.path.join(HERE, "..", "public", "demo", "yariiimakeup-01")
HOME = "/demo/yariiimakeup-01"

src = open(os.path.join(DEMO, "index.html"), encoding="utf-8").read()
body = open(os.path.join(HERE, "yariiimakeup-01-inquire.html"), encoding="utf-8").read()
body = body[body.index("<main"):]  # drop the template's own comment


def cut(a, b, include_b=True):
    i = src.index(a)
    j = src.index(b, i) + (len(b) if include_b else 0)
    return src[i:j]


head = cut("<!doctype html>", "</head>")
head = re.sub(r"<title>.*?</title>", "<title>Send an Inquiry · YariiiMakeup · Design concept</title>", head)
head = re.sub(r'(<meta name="description" content=")[^"]*', r"\1Send YariiiMakeup an inquiry about bridal, Sweet 16, prom, events, hair or makeup classes. Design concept, not the official website.", head)
head = head.replace('href="https://jpsilvadigital.com%s"' % HOME, 'href="https://jpsilvadigital.com%s/inquire"' % HOME)
head = head.replace('content="https://jpsilvadigital.com%s"' % HOME, 'content="https://jpsilvadigital.com%s/inquire"' % HOME)
head = re.sub(r"<!--\s*The opening plays.*?-->\s*<script>.*?</script>", "<script>document.documentElement.classList.add('js')</script>", head, flags=re.S)
head = re.sub(r'<link rel="preload" as="image" href="[^"]*(logo-ink|-tall-)[^"]*"[^>]*>\n', "", head)
assert "yarii:opened" not in head and "<script>document.documentElement.classList.add('js')</script>" in head

shell = cut('<a class="skip"', '<main id="main">', include_b=False)
foot = cut('<footer class="foot">', "</footer>")


def to_home(html):
    html = html.replace('href="#top"', 'href="%s"' % HOME)
    return re.sub(r'href="#(about|work|services|words|motion|book)"', lambda m: 'href="%s#%s"' % (HOME, m.group(1)), html)


shell = to_home(shell)
shell = shell.replace('<a class="inq-link" href="%s/inquire"' % HOME, '<a class="inq-link" href="%s/inquire" aria-current="page"' % HOME)
foot = to_home(foot)

page = (head + "\n<body class=\"page-inquire\">\n\n" + shell + body + "\n" + foot +
        '\n\n<script src="%s/assets/js/site.js" defer></script>\n</body>\n</html>\n' % HOME)
assert "#inquire\"" not in shell
out = os.path.join(DEMO, "inquire")
os.makedirs(out, exist_ok=True)
open(os.path.join(out, "index.html"), "w", encoding="utf-8").write(page)
print("wrote", os.path.relpath(os.path.join(out, "index.html")), len(page), "bytes")
