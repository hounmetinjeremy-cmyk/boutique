# Boutique

Boutique en ligne servie par un Cloudflare Worker (un seul fichier, sans dependance).

- URL de production : https://boutique.hounmetinjeremy.workers.dev
- Compte Cloudflare : 26a324f0e475aeaace451e11617c1109
- Nom du Worker : boutique

## Pages et API

| Route | Methode | Role |
|---|---|---|
| / | GET | Catalogue (8 produits), rendu serveur |
| /?items=1x2,3x1 | GET | Catalogue + panier dans l URL |
| /panier | GET | Recapitulatif du panier + formulaire de commande |
| /api/products | GET | Liste des produits en JSON |
| /api/orders | POST | Commande (formulaire HTML ou JSON) |
| /api/health | GET | Sonde de sante |

## Fonctionnement

Le panier n utilise pas de JavaScript cote client : son etat vit dans le parametre d URL `items`
(format `id x quantite`, ex. `?items=1x2,3x1`). Le bouton Ajouter recharge la page avec le panier mis a jour.
La commande poste ce panier sur `/api/orders`, qui valide les lignes et les coordonnees, calcule le total
et renvoie une page de confirmation avec un identifiant `CMD-...`.

## Persistance des commandes

Le code ecrit la commande dans le binding KV `ORDERS` si il existe. A ce jour le Worker n a aucun binding :
les commandes sont affichees mais pas stockees.

A faire : ajouter le binding KV `ORDERS` (namespace existant `ma-boutique-orders`,
id `3f8b5e43e2614a27bec5f3ac87a1e894`) puis redeployer.

## Paiement

Aucun paiement reel : le tunnel de commande est simule, aucun debit.
