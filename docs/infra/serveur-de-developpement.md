# Serveur de développement

Allonzy dispose d'un serveur Linux auto-hébergé. Il sert au développement et aux tests. Il n'est pas la production.

Pour l'exploitation au quotidien (connexion, commandes, sauvegardes), voir l'[aide-mémoire](aide-memoire-serveur.md).

## Rôle

- Héberger la base de données PostgreSQL.
- Stocker les photos dans un stockage objet compatible S3.
- Accueillir l'API quand son code existera.
- Superviser l'état des services.

## Architecture

```
Téléphone / PC ── Tailscale (WireGuard) ──▶ allonzy-server (Ubuntu Server)
                                             └─ Docker Compose
                                                 ├─ db           PostgreSQL 17
                                                 ├─ garage       Garage v2.1.0 (S3)
                                                 └─ uptime-kuma  supervision
```

- Chaque service tourne dans un conteneur Docker, décrit dans un seul fichier `compose.yaml`.
- Les données vivent dans des volumes Docker et survivent aux mises à jour des conteneurs.
- Le serveur n'expose aucun port sur Internet. L'accès à distance passe par Tailscale, un réseau privé chiffré entre les appareils autorisés.
- Les services n'écoutent que sur le serveur lui-même. On y accède par tunnel SSH ou via Tailscale.

## Choix techniques

| Besoin | Choix | Raison |
|---|---|---|
| Base de données | PostgreSQL 17 | Stack du projet (Prisma) |
| Stockage des photos | Garage | Compatible S3, léger, conçu pour l'auto-hébergement |
| Supervision | Uptime Kuma | Tableau de bord simple, alertes possibles |
| Accès distant | Tailscale | Aucun port à ouvrir, chiffré de bout en bout |

Garage remplace MinIO. MinIO ne publie plus d'image Docker gratuite depuis fin 2025 et son dépôt open source est en maintenance.

## Sécurité

- Connexion SSH par clé uniquement, root interdit.
- Pare-feu actif, seul SSH est autorisé.
- Mises à jour de sécurité automatiques.
- Secrets stockés sur le serveur, jamais dans le dépôt.

## Sauvegardes

- Base et photos sauvegardées chaque nuit à 3 h.
- Restauration testée.
- Limite : les sauvegardes restent sur le même disque. La production exigera une copie chiffrée hors machine.

## Impacts sur le projet

- Le stockage des photos cible Garage (S3), plus MinIO.
- L'API lit sa configuration depuis des variables d'environnement : `DATABASE_URL` côté Prisma, `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` côté stockage.
- L'API utilise un client S3 en adressage path-style.
- L'application mobile réduit les photos avant envoi (environ 1600 px, qualité 75 %, miniature 300 px).
- L'API sera ajoutée comme service supplémentaire dans `compose.yaml`.
- L'application mobile peut joindre le serveur depuis n'importe quel réseau via Tailscale, ce qui permet de tester sur téléphone.
- L'hébergement de production reste à décider. Un VPS est recommandé.
