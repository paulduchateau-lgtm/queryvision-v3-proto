"""Modèle unique de l'arborescence cible du site QueryVision v3.

Une entrée par (clé de page, langue). La clé regroupe les traductions d'une même
page : c'est elle qui produit les alternates hreflang.

`src`  = chemin actuel dans le dépôt (None si la page est à créer)
`dst`  = chemin cible dans le dépôt
`url`  = URL servie (sans extension, absolue depuis la racine)

Les slugs français sont ceux de la production actuelle (www.queryvision.ai) :
ils ne doivent pas changer, sinon il faut des redirections 301.
"""

SITE = "https://www.queryvision.ai"
LANGS = ["fr", "en", "es", "de"]
XDEFAULT = "fr"

# clé -> { langue: (src, dst) }   ; url dérivée de dst
PAGES = {
    "home": {
        "fr": ("fr/index.html", "index.html"),
        "en": ("en/index.html", "en/index.html"),
        "es": ("es/index.html", "es/index.html"),
        "de": ("de/index.html", "de/index.html"),
    },
    "company": {
        "fr": ("fr/entreprise.html", "entreprise.html"),
        "en": ("en/company.html", "en/company.html"),
        "es": ("es/empresa.html", "es/empresa.html"),
        "de": ("de/unternehmen.html", "de/unternehmen.html"),
    },
    "contact": {
        "fr": ("fr/contact.html", "contact.html"),
        "en": ("en/contact.html", "en/contact.html"),
        "es": ("es/contacto.html", "es/contacto.html"),
        "de": ("de/kontakt.html", "de/kontakt.html"),
    },
    "ai-info": {
        "fr": ("fr/ai-info.html", "ai-info.html"),
        "en": ("en/ai-info.html", "en/ai-info.html"),
        "es": ("es/ai-info.html", "es/ai-info.html"),
        "de": ("de/ai-info.html", "de/ai-info.html"),
    },
    "trust-center": {
        "fr": ("fr/trust-center.html", "trust-center.html"),
        "en": ("en/trust-center.html", "en/trust-center.html"),
        "es": ("es/trust-center.html", "es/trust-center.html"),
        "de": ("de/trust-center.html", "de/trust-center.html"),
    },
    "agent-query-vision": {
        "fr": ("fr/agents/query-vision.html", "agents/query-vision.html"),
        "en": ("en/agents/query-vision.html", "en/agents/query-vision.html"),
        "es": ("es/agentes/query-vision.html", "es/agentes/query-vision.html"),
        "de": ("de/agenten/query-vision.html", "de/agenten/query-vision.html"),
    },
    "agent-spot-vision": {
        "fr": ("fr/agents/spot-vision.html", "agents/spot-vision.html"),
        "en": ("en/agents/spot-vision.html", "en/agents/spot-vision.html"),
        "es": ("es/agentes/spot-vision.html", "es/agentes/spot-vision.html"),
        "de": ("de/agenten/spot-vision.html", "de/agenten/spot-vision.html"),
    },
    # ── Légal : aplati, plus de sous-dossier legal/ ──────────────────────
    "legal-terms": {
        "fr": ("fr/legal/cgu.html", "cgu.html"),
        "en": ("en/legal/terms-of-use.html", "en/terms-of-use.html"),
        "es": ("es/legal/condiciones-de-uso.html", "es/condiciones-de-uso.html"),
        "de": (
            "de/rechtliches/nutzungsbedingungen.html",
            "de/nutzungsbedingungen.html",
        ),
    },
    "legal-privacy": {
        "fr": ("fr/legal/confidentialite.html", "confidentialite.html"),
        "en": ("en/legal/privacy-policy.html", "en/privacy-policy.html"),
        "es": ("es/legal/privacidad.html", "es/privacidad.html"),
        "de": ("de/rechtliches/datenschutz.html", "de/datenschutz.html"),
    },
    "legal-cookies": {
        "fr": ("fr/legal/cookies.html", "cookies.html"),
        "en": ("en/legal/cookies.html", "en/cookies.html"),
        "es": ("es/legal/cookies.html", "es/cookies.html"),
        "de": ("de/rechtliches/cookies.html", "de/cookies.html"),
    },
    "legal-notice": {
        "fr": ("fr/legal/mentions-legales.html", "mentions-legales.html"),
        "en": ("en/legal/legal-notice.html", "en/legal-notice.html"),
        "es": ("es/legal/aviso-legal.html", "es/aviso-legal.html"),
        "de": ("de/rechtliches/impressum.html", "de/impressum.html"),
    },
    # ── Métiers : slugs FR = ceux de la prod ─────────────────────────────
    "metier-risques": {
        "fr": ("fr/metiers/risques.html", "metiers/gestion-des-risques.html"),
        "en": ("en/teams/risk.html", "en/teams/risk.html"),
        "es": ("es/funciones/riesgos.html", "es/funciones/riesgos.html"),
        "de": ("de/funktionen/risiken.html", "de/funktionen/risiken.html"),
    },
    "metier-conformite": {
        "fr": ("fr/metiers/conformite.html", "metiers/conformite.html"),
        "en": ("en/teams/compliance.html", "en/teams/compliance.html"),
        "es": ("es/funciones/cumplimiento.html", "es/funciones/cumplimiento.html"),
        "de": ("de/funktionen/compliance.html", "de/funktionen/compliance.html"),
    },
    "metier-audit": {
        "fr": ("fr/metiers/audit.html", "metiers/audit-interne.html"),
        "en": ("en/teams/audit.html", "en/teams/audit.html"),
        "es": ("es/funciones/auditoria.html", "es/funciones/auditoria.html"),
        "de": ("de/funktionen/audit.html", "de/funktionen/audit.html"),
    },
    "metier-finance": {
        "fr": ("fr/metiers/finance.html", "metiers/direction-financiere.html"),
        "en": ("en/teams/finance.html", "en/teams/finance.html"),
        "es": ("es/funciones/finanzas.html", "es/funciones/finanzas.html"),
        "de": ("de/funktionen/finanzen.html", "de/funktionen/finanzen.html"),
    },
    # ── Nouvelles pages métiers (slugs FR = ceux de la prod) ─────────────
    "metier-rh": {
        "fr": (None, "metiers/ressources-humaines.html"),
        "en": (None, "en/teams/human-resources.html"),
        "es": (None, "es/funciones/recursos-humanos.html"),
        "de": (None, "de/funktionen/personalwesen.html"),
    },
    "metier-marketing": {
        "fr": (None, "metiers/marketing-commercial.html"),
        "en": (None, "en/teams/marketing-sales.html"),
        "es": (None, "es/funciones/marketing-ventas.html"),
        "de": (None, "de/funktionen/marketing-vertrieb.html"),
    },
}


def url_for(dst):
    """Chemin de fichier -> URL servie, sans extension."""
    if dst == "index.html":
        return "/"
    if dst.endswith("/index.html"):
        return "/" + dst[: -len("index.html")]
    return "/" + dst[: -len(".html")]


def build_maps():
    """src -> url, et dst -> (clé, langue, url)."""
    src_to_url = {}
    dst_info = {}
    for key, langs in PAGES.items():
        for lang, (src, dst) in langs.items():
            u = url_for(dst)
            if src:
                src_to_url[src] = u
            dst_info[dst] = (key, lang, u)
    return src_to_url, dst_info


def alternates(key):
    """Alternates hreflang d'une clé de page, en URLs absolues."""
    out = []
    for lang in LANGS:
        dst = PAGES[key][lang][1]
        out.append((lang, SITE + url_for(dst)))
    xd = SITE + url_for(PAGES[key][XDEFAULT][1])
    out.append(("x-default", xd))
    return out
