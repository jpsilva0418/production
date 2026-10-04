#!/usr/bin/env python3
"""Generate docs/seo-map.md from the production build.

Run after `npm run build`:

    python3 scripts/seo-map.py

The map is generated rather than hand-written so it can never drift from what
actually ships. Intent and keyword themes are the only hand-maintained part —
everything else (titles, descriptions, H1s, canonicals, indexability, internal
link counts) is read out of dist/.

No keyword volumes appear anywhere. No volume data source was reachable from
this environment, so themes are classified by intent and commercial value
instead. Quoting volumes without a tool would be inventing numbers.
"""
import collections
import glob
import html
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
OUT = os.path.join(ROOT, 'docs', 'seo-map.md')

# (primary intent, primary theme, secondary themes, intent class, primary CTA)
INTENT = {
    '/': (
        'Brand + combined offer, Massachusetts',
        'JP Silva Digital; web design Massachusetts; digital advertising Massachusetts',
        'website design MA; Google Ads MA; Meta Ads MA; small business digital services',
        'Commercial / navigational', 'Get Your Free Demo'),
    '/services': (
        'Service hub — the relationship between the three',
        'web design and advertising services',
        'websites + Google Ads + Meta Ads together; one person, start to finish',
        'Commercial', 'Get Your Free Demo'),
    '/services/web-design-development': (
        'Web design / website development',
        'web design Massachusetts; website design Massachusetts; web developer Massachusetts',
        'small business web design; custom website development; responsive design; '
        'website redesign; landing page design; conversion-focused website',
        'Commercial (high)', 'Get Your Free Demo'),
    '/services/google-ads': (
        'Google Ads management',
        'Google Ads management; Google Ads Massachusetts; PPC management',
        'Google Search Ads; Google advertising; PPC for small business; keyword strategy; '
        'negative keywords; conversion tracking; lead generation',
        'Commercial (high)', 'Start a Google Ads project'),
    '/services/meta-ads': (
        'Meta / Facebook / Instagram advertising management',
        'Facebook Ads management; Instagram Ads management; Meta Ads management',
        'Meta Ads Manager; Facebook advertising; Instagram advertising; '
        'social media advertising for small business; retargeting',
        'Commercial (high)', 'Start a Meta Ads project'),
    '/work': (
        'Proof — real projects',
        'web design portfolio; selected work',
        'project detail; services performed per project',
        'Commercial / trust', 'Get Your Free Demo'),
    '/industries': (
        'Who the services suit',
        'industries served; web design for contractors / salons / professional services',
        'construction & home services; beauty & wellness; creative & media; '
        'professional services; hospitality; real estate',
        'Commercial / navigational', 'Get Your Free Demo'),
    '/about': (
        'Founder entity + trust',
        'JP Silva; founder web designer Massachusetts',
        'who you work with; how I work; why the business exists',
        'Trust / entity', 'Get Your Free Demo'),
    '/blog': (
        'Informational hub supporting the service pages',
        'small business website and advertising advice',
        'per-article topics; see each post',
        'Informational', 'Get Your Free Demo'),
    '/contact': (
        'Conversion — general project inquiry',
        'contact JP Silva Digital',
        'start a project; free consultation',
        'Transactional', 'Send my inquiry'),
    '/free-demo': (
        'Conversion — free homepage demo planner',
        'free homepage demo; website project planner',
        'eight questions; website plan on screen',
        'Transactional', 'Complete the planner'),
}


def route_for(path: str) -> str:
    r = '/' + path.replace(DIST + os.sep, '').replace('.html', '').replace(os.sep, '/')
    r = r.replace('/index', '/')
    return r if r == '/' else r.rstrip('/')


def grab(doc: str, pattern: str) -> str:
    m = re.search(pattern, doc, re.S)
    return html.unescape(m.group(1)).strip() if m else ''


def strip_chrome(doc: str) -> str:
    """Remove header, mobile nav and footer so link counts measure content."""
    doc = re.sub(r'<header[\s\S]*?</header>', '', doc)
    doc = re.sub(r'<div class="mnav"[\s\S]*?</div>\s*</div>', '', doc)
    return re.sub(r'<footer[\s\S]*?</footer>', '', doc)


def main() -> None:
    pages = {}
    for f in sorted(glob.glob(os.path.join(DIST, '**', '*.html'), recursive=True)):
        pages[route_for(f)] = open(f, encoding='utf-8').read()

    inbound = collections.Counter()
    outbound = {}
    for route, doc in pages.items():
        links = {(l.rstrip('/') or '/') for l in re.findall(r'href="(/[^"#?]*)"', strip_chrome(doc))}
        outbound[route] = links
        for link in links:
            if link != route:
                inbound[link] += 1

    out = [
        '# SEO map — JP Silva Digital', '',
        'Generated from the production build by `scripts/seo-map.py`, so it describes what',
        'actually ships rather than what was intended. Regenerate after any change to titles,',
        'descriptions or internal links.', '',
        '**Positioning:** Massachusetts-based. Serving Greater Boston, MetroWest, and businesses nationwide.', '',
        '**No keyword volumes are given.** No keyword-volume data source was reachable from the',
        'build environment, so themes below are classified by search intent and commercial value,',
        'not by estimated volume. Anyone quoting volumes for these terms without a tool is guessing.', '',
        'The brand suffix `| JP Silva Digital` is appended centrally in `src/layouts/Base.astro`;',
        'pages supply only the distinctive part of the title.', '',
    ]

    for route, (intent, primary, secondary, cls, cta) in INTENT.items():
        doc = pages.get(route)
        if not doc:
            out += [f'## `{route}`', '', '> **MISSING FROM BUILD.**', '']
            continue
        title = grab(doc, r'<title>(.*?)</title>')
        desc = grab(doc, r'<meta name="description" content="(.*?)"')
        canonical = grab(doc, r'<link rel="canonical" href="(.*?)"')
        h1 = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', grab(doc, r'<h1[^>]*>([\s\S]*?)</h1>'))).strip()
        outs = sorted(
            x for x in outbound[route]
            if x in INTENT or x.startswith(('/blog/', '/work/', '/services/'))
        )[:8]
        out += [
            f'## `{route}`', '', '| | |', '|---|---|',
            f'| **Primary intent** | {intent} |',
            f'| **Primary theme** | {primary} |',
            f'| **Secondary themes** | {secondary} |',
            f'| **Intent class** | {cls} |',
            f'| **Title** ({len(title)} chars) | {title} |',
            f'| **Meta description** ({len(desc)} chars) | {desc} |',
            f'| **H1** | {h1} |',
            f'| **Primary CTA** | {cta} |',
            f'| **Canonical** | `{canonical}` |',
            f'| **Indexing** | {"noindex" if "noindex" in doc else "index, follow"} |',
            f'| **Internal links in** | {inbound.get(route, 0)} (content links, excluding nav and footer) |',
            f'| **Internal links out** | {", ".join("`" + x + "`" for x in outs) or "—"} |',
            '',
        ]

    out += [
        '## Cannibalisation guard', '',
        '- `/` targets the brand and the combined offer. It does not compete for '
        '`web design Massachusetts`; that is `/services/web-design-development`.',
        '- `/services` is a hub: it summarises and links, while the child pages carry the commercial depth.',
        "- Blog articles are informational and link **into** the service pages. None targets a service page's commercial term.",
        '- `/industries` targets audience language ("web design for contractors"), not service language.',
        '- `/work` targets portfolio and proof language, not service terms.', '',
        '## Deliberate omissions', '',
        '- **No city pages.** No `/web-design-boston` style routes. Regional signals live inside the '
        'canonical pages instead. A local page would need genuinely unique content and a real reason first.',
        '- **No LocalBusiness schema.** It requires a verifiable street address, which has not been '
        'supplied. Organization schema carries the real facts instead.',
        '- **No aggregateRating, review, award, founding date, employee count or price range** in '
        'structured data. None of it is verified.', '',
    ]

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w', encoding='utf-8').write('\n'.join(out))
    print(f'{OUT}: {sum(1 for r in INTENT if r in pages)}/{len(INTENT)} pages documented')


if __name__ == '__main__':
    main()
