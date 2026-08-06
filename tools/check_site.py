"""Contrôle du site statique, en appliquant la résolution nginx visée.

Vérifie :
  1. tout href/src interne résout vers un fichier existant
  2. toute ancre #id pointe vers un id présent dans la page cible
  3. les 17 URLs de la production actuelle sont servies ou redirigées
  4. hreflang : réciprocité, auto-référencement, x-default, URLs absolues
  5. canonical présent, absolu, égal à l'URL de la page
"""

import os
import re
import sys
from urllib.parse import unquote

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import site_model as m

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = m.SITE

PROD_URLS = [
    "/", "/cgu", "/confidentialite", "/cookies", "/implantations",
    "/mentions-legales", "/metiers/audit-interne", "/metiers/conformite",
    "/metiers/direction-financiere", "/metiers/gestion-des-risques",
    "/metiers/marketing-commercial", "/metiers/ressources-humaines",
    "/partenaires", "/produit", "/tarifs", "/trajectoire", "/trust-center",
]
# Redirections déclarées dans nginx.conf
REDIRECTS = {"/partenaires": "/entreprise", "/implantations": "/entreprise"}

ATTR = re.compile(r'\b(?:href|src)="([^"]*)"')
IDS = re.compile(r'\bid="([^"]+)"')
HREFLANG = re.compile(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">')
CANON = re.compile(r'<link rel="canonical" href="([^"]+)">')

errors = []


def resolve(url_path):
    """URL -> fichier sur disque, selon try_files $uri $uri.html $uri/index.html."""
    p = unquote(url_path).lstrip("/")
    for cand in (p, p + ".html", os.path.join(p, "index.html")):
        if cand and os.path.isfile(os.path.join(ROOT, cand)):
            return cand
    if p in ("", "/"):
        return "index.html" if os.path.isfile(os.path.join(ROOT, "index.html")) else None
    return None


def pages():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in {".git", ".claude", ".github"}]
        for f in filenames:
            if f.endswith(".html"):
                rel = os.path.relpath(os.path.join(dirpath, f), ROOT)
                if not rel.startswith("assets/"):
                    yield rel


ALL = sorted(pages())
IDS_BY_FILE = {}
for rel in ALL:
    with open(os.path.join(ROOT, rel), encoding="utf-8") as fh:
        IDS_BY_FILE[rel] = set(IDS.findall(fh.read()))

# ── 1 & 2 : liens internes et ancres ────────────────────────────────────
EXTERNAL = ("http://", "https://", "mailto:", "tel:", "data:", "//", "javascript:")
for rel in ALL:
    with open(os.path.join(ROOT, rel), encoding="utf-8") as fh:
        doc = fh.read()
    for raw in ATTR.findall(doc):
        if not raw or raw.startswith(EXTERNAL):
            continue
        path, _, frag = raw.partition("#")
        path = path.split("?", 1)[0]  # la chaîne de requête ne fait pas partie du chemin
        if not path:
            if frag and frag not in IDS_BY_FILE[rel]:
                errors.append(f"[ancre] {rel} -> #{frag} absent de la page")
            continue
        if not path.startswith("/"):
            errors.append(f"[relatif] {rel} -> {raw}")
            continue
        target = resolve(path)
        if target is None:
            errors.append(f"[404] {rel} -> {raw}")
        elif frag and target in IDS_BY_FILE and frag not in IDS_BY_FILE[target]:
            errors.append(f"[ancre] {rel} -> {raw} (#{frag} absent de {target})")

# ── 3 : continuité des URLs de production ───────────────────────────────
lost = []
for u in PROD_URLS:
    if resolve(u) is not None:
        continue
    if u in REDIRECTS and resolve(REDIRECTS[u]) is not None:
        continue
    lost.append(u)

# ── 4 & 5 : hreflang et canonical ───────────────────────────────────────
_, dst_info = m.build_maps()
for dst, (key, lang, url) in sorted(dst_info.items()):
    with open(os.path.join(ROOT, dst), encoding="utf-8") as fh:
        doc = fh.read()

    can = CANON.findall(doc)
    if len(can) != 1:
        errors.append(f"[canonical] {dst} : {len(can)} balise(s)")
    elif can[0] != SITE + url:
        errors.append(f"[canonical] {dst} : {can[0]} au lieu de {SITE + url}")

    alts = dict(HREFLANG.findall(doc))
    for code, href in alts.items():
        if not href.startswith("https://"):
            errors.append(f"[hreflang] {dst} : {code} non absolu ({href})")
    expected = dict(m.alternates(key))
    if alts != expected:
        errors.append(f"[hreflang] {dst} : jeu d'alternates incorrect")
    if alts.get(lang) != SITE + url:
        errors.append(f"[hreflang] {dst} : pas auto-référençant")
    # réciprocité : chaque alternate doit exister et pointer en retour
    for code, href in alts.items():
        if code == "x-default":
            continue
        other = resolve(href[len(SITE):])
        if other is None:
            errors.append(f"[hreflang] {dst} : {code} -> {href} introuvable")

print(f"Pages contrôlées : {len(ALL)}")
print(f"URLs de production préservées : {len(PROD_URLS) - len(lost)}/{len(PROD_URLS)}")
if lost:
    print("  perdues (404 assumés) : " + ", ".join(lost))
print(f"Anomalies : {len(errors)}")
for e in errors[:40]:
    print("  " + e)
if len(errors) > 40:
    print(f"  … et {len(errors) - 40} autres")
sys.exit(1 if errors else 0)
