# Boutique - suivi

Objectif : boutique en ligne servie par un Cloudflare Worker, code versionne sur GitHub.

## Plan
1. Depot GitHub `boutique` cree - OK
2. Worker `boutique` deploye (page HTML + /api/products + /api/orders + /panier) - fait
3. Sous-domaine workers.dev active - fait
4. Code source pousse dans le depot (index.js, README.md) - A FAIRE
5. Verification : relecture des fichiers + test de l URL - A FAIRE

## Notes
- Session limitee en appels : anticipation, le code sera pousse au tour suivant.
- Pas d acces reseau depuis bash : le test HTTP de l URL doit etre fait par l utilisateur.
- Panier sans JS : etat dans l URL (?items=1x2,3x1), commande en POST /api/orders.
