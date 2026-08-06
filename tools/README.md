# tools/

Outillage du site. Ce sont des programmes, pas de la documentation.

## site_model.py

**Source de vérité de l'arborescence.** Une entrée par (clé de page, langue) :
chemin dans le dépôt et URL servie. La clé regroupe les traductions d'une même
page — c'est elle qui produit les alternates `hreflang`.

Les slugs français sont ceux de la production `www.queryvision.ai`. **Les changer
casse le référencement acquis** : il faudrait alors ajouter une redirection 301
dans `nginx.conf`.

Toute page ajoutée, renommée ou supprimée se déclare ici d'abord.

## check_site.py

```bash
python3 tools/check_site.py
```

Applique la résolution d'URL de `nginx.conf` (`$uri` → `$uri.html` →
`$uri/index.html`) et vérifie :

1. tout `href`/`src` interne résout vers un fichier existant ;
2. toute ancre `#id` existe dans la page visée ;
3. les 17 URLs indexées de la production sont servies ou redirigées ;
4. les `hreflang` sont absolus, auto-référençants, réciproques, avec `x-default` ;
5. le `canonical` est présent, absolu, et égal à l'URL de la page.

Sort en code 1 s'il trouve quoi que ce soit. **À passer avant tout déploiement** —
c'est le seul garde-fou contre un lien mort introduit par un renommage.

## gen_sitemap.py

```bash
python3 tools/gen_sitemap.py 2026-08-06
```

Régénère `sitemap.xml` depuis `site_model.py`, alternates compris. La date de
`lastmod` est passée explicitement : elle doit refléter une décision, pas
l'instant où le script a tourné.

## Ce qui n'est pas outillé

Le contenu des pages est dupliqué dans les quatre langues. Il n'existe pas de
fichier de traduction : une correction de texte se fait quatre fois, à la main.
`check_site.py` vérifie la structure, **pas la cohérence des contenus entre
langues**.
