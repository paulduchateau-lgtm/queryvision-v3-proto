"""Régénère sitemap.xml à partir de tools/site_model.py.

    python3 tools/gen_sitemap.py [AAAA-MM-JJ]

Sans argument, la date du jour n'est PAS devinée : il faut la passer
explicitement, pour que le lastmod reflète une décision et non l'instant
où quelqu'un a lancé le script.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import site_model as m

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PRIORITY = {
    "home": "1.0",
    "trust-center": "0.9",
    "company": "0.8",
    "contact": "0.8",
    "ai-info": "0.8",
    "agent-query-vision": "0.7",
    "agent-spot-vision": "0.7",
    "metier-risques": "0.7",
    "metier-conformite": "0.7",
    "metier-audit": "0.7",
    "metier-finance": "0.7",
    "metier-rh": "0.7",
    "metier-marketing": "0.7",
    "legal-terms": "0.3",
    "legal-privacy": "0.3",
    "legal-cookies": "0.3",
    "legal-notice": "0.3",
}
CHANGEFREQ = {"home": "weekly", "trust-center": "monthly"}


def build(lastmod):
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'
        ' xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    n = 0
    for key in m.PAGES:
        alts = m.alternates(key)
        for lang in m.LANGS:
            loc = m.SITE + m.url_for(m.PAGES[key][lang][1])
            out.append("  <url>")
            out.append(f"    <loc>{loc}</loc>")
            for code, href in alts:
                out.append(
                    f'    <xhtml:link rel="alternate" hreflang="{code}" href="{href}"/>'
                )
            out.append(f"    <lastmod>{lastmod}</lastmod>")
            out.append(f"    <changefreq>{CHANGEFREQ.get(key, 'monthly')}</changefreq>")
            out.append(f"    <priority>{PRIORITY[key]}</priority>")
            out.append("  </url>")
            n += 1
    out.append("</urlset>")
    return "\n".join(out) + "\n", n


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    xml, n = build(sys.argv[1])
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as fh:
        fh.write(xml)
    print(f"sitemap.xml régénéré : {n} URLs, lastmod {sys.argv[1]}")
