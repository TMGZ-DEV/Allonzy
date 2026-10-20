# Allonzy

Application d'organisation de voyages en groupe (profils, groupes, dépenses partagées, calendrier commun, messagerie).

## Prérequis

- Node 22 (version indiquée dans `.nvmrc`). Le projet exige Node `>=22.12.0 <23` : l'installation échoue hors de cette plage (`engine-strict`).
- npm 10.
- Expo Go compatible SDK 58 sur le téléphone, pour tester l'application mobile.

## Arborescence

- `apps/api/` : API (Express, Socket.IO, Prisma), squelette pour l'instant.
- `apps/mobile/` : application mobile (React Native, Expo).
- `packages/shared/` : types et contrats partagés, `@allonzy/shared`.

## Installation

Depuis la racine, une seule fois :

```bash
npm install
```

Il n'y a qu'un seul fichier de lock, à la racine : n'installez pas paquet par paquet. En CI, utilisez `npm ci`.

## Commandes

Toutes se lancent depuis la racine.

| Commande                 | Effet                                                  |
| ------------------------ | ------------------------------------------------------ |
| `npm run format`         | Formate le code avec Prettier.                         |
| `npm run format:check`   | Vérifie le formatage sans rien modifier.               |
| `npm run lint`           | Lance ESLint dans chaque paquet.                       |
| `npm run typecheck`      | Lance TypeScript (`tsc --noEmit`) dans chaque paquet.  |
| `npm test`               | Lance les tests de chaque paquet.                      |
| `npm run check`          | Enchaîne `format:check`, `lint`, `typecheck` et `test`. |

## Application mobile

Depuis la racine :

```bash
npm run start -w @allonzy/mobile
```

Ou, depuis `apps/mobile/` : `npm run start`. Puis scannez le QR code affiché dans le terminal avec Expo Go.

## API

Pour l'instant, l'API ne contient qu'un paquet minimal de test :

```bash
npm test -w @allonzy/api
```

Il n'y a pas encore de serveur à lancer : il arrivera avec le ticket T13.1 (#79).

## Paquet partagé

`@allonzy/shared` est consommé directement en sources TypeScript, sans étape de compilation. Un paquet qui l'utilise doit le déclarer dans son `package.json` :

```json
"@allonzy/shared": "*"
```

## Documentation

- [Serveur de développement](docs/infra/serveur-de-developpement.md) : rôle, architecture et impacts du serveur auto-hébergé.
- [Aide-mémoire du serveur](docs/infra/aide-memoire-serveur.md) : connexion, commandes et sauvegardes.
