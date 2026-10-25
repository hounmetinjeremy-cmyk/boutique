# Boutique - suivi

Objectif : boutique en ligne servie par un Cloudflare Worker, code versionne sur GitHub.

## Etat
1. Depot GitHub `boutique` cree - OK
2. Worker `boutique` deploye sur le compte 26a324f0e475aeaace451e11617c1109 - OK
3. Sous-domaine `hounmetinjeremy` active : https://boutique.hounmetinjeremy.workers.dev - OK (page testee par l utilisateur)
4. PROGRESS.md dans le depot - OK
5. README.md dans le depot - OK (commit 5c264b4)
6. index.js dans le depot - OK (commit a7edcc9, 6500 octets, relu en raw)
7. Binding KV ORDERS sur le Worker - A FAIRE
8. Aligner le Worker deploye sur index.js du depot - A FAIRE (redeploiement)

## Etapes suivantes
- PUT du script avec metadata { main_module: 'index.js', bindings: [{ type: 'kv_namespace', name: 'ORDERS', namespace_id: '3f8b5e43e2614a27bec5f3ac87a1e894' }] }
- Puis tester : GET / , GET /api/products , GET /panier , POST /api/orders

## Notes
- Pas d acces reseau depuis bash : le test HTTP de l URL ne peut pas etre fait par l agent.
- Le Worker en ligne a ete deploye avant la creation de index.js : le contenu du depot est une version
  de reference, pas forcement identique a l octet pres a ce qui tourne. Un redeploiement reglera l ecart.
- Sans binding KV, les commandes s affichent (CMD-...) mais ne sont pas stockees.
