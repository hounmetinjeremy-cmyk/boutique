# Boutique - suivi

Objectif : boutique en ligne servie par un Cloudflare Worker, code versionne sur GitHub.

## Etat final
1. Depot GitHub `boutique` - OK
2. `index.js` (source du Worker, 80 lignes) - OK, commit afe3362
3. `README.md` - OK, commit 5c264b4
4. Worker redeploye avec `main_module: index.js` - PUT HTTP 200, deployOk true, 6429 octets
5. Binding KV `ORDERS` -> namespace `ma-boutique-orders` (3f8b5e43e2614a27bec5f3ac87a1e894) - CONFIRME
   Preuve : GET /accounts/26a3.../workers/scripts/boutique/settings
   -> bindings: [{ name: ORDERS, type: kv_namespace, namespace_id: 3f8b5e43e2614a27bec5f3ac87a1e894 }]
6. URL : https://boutique.hounmetinjeremy.workers.dev

## Pieges rencontres (a retenir)
- GET /workers/scripts/{nom} renvoie bindings: [] et un tableau d octets indexe (0..N) : ce n est pas
  la bonne source pour verifier les bindings. Utiliser /settings ou /script-settings.
- GET /workers/scripts/{nom}/content renvoie 405 : pour lire le code, essayer /content/v2.
- Remplacer le Worker en ligne ecrase la version precedente : pas de retour arriere automatique.

## Reste a faire (cote utilisateur, l agent n a pas d acces reseau)
- Charger l URL et verifier : /, /?items=1x2,3x1, /panier, /api/products, /api/health, puis une commande
  reelle pour confirmer l ecriture dans KV.
