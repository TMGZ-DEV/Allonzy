# Allonzy

Application mobile d'organisation de voyages en groupe : profils, groupes, dépenses partagées, calendrier commun et messagerie.

- Stack : React Native + Expo + TypeScript (mobile), Node.js + Express + Socket.IO (API), PostgreSQL + Prisma, stockage photos S3 sur Garage.
- Arborescence (monorepo, workspaces npm) : `apps/api/`, `apps/mobile/`, `packages/shared/`.
- Backlog : issues GitHub (US en épics, tâches en sous-issues, milestones Release 1/2/3 et « Hors périmètre »). Audit : `docs/audit-backlog-final.md`.
- Serveur de développement : `docs/infra/serveur-de-developpement.md`.
- Langue : français pour le code commenté, les commits, les PR et la documentation.

## Git

- `develop` est la branche par défaut et la cible de toutes les PR. `main` ne reçoit que les versions finales, fusionnées par Tomicho.
- Branches : `{type}/{numero}-{sujet}` : type parmi feat, fix, docs, chore ; sujet de 2 à 4 mots en minuscules, sans accents, séparés par des tirets, qui disent ce que fait le ticket (ex. `feat/12-creation-groupe`, `fix/31-solde-negatif`). 40 caractères au plus, jamais d'identifiant aléatoire ni de préfixe d'outil (`claude/…`). Le nom est choisi et la branche créée par l'agent `redacteur`. Les PR contiennent `Closes #<n>`.
- Aucune ligne de co-signature dans les commits.

## Definition of Done

Voir `.claude/definition-of-done.md`. Commandes de vérification : `npm install` (ou `npm ci`), puis `npm run check` (format:check, lint, typecheck, test).

## Agents

<!-- Section générée par le skill equipe-agents-github depuis .claude/team.config.yml. -->

- Le coordinateur (chat du projet) lit les annonces de la tâche « Tickets en attente : annonce dans le projet ». Il ouvre un fil neuf pour chaque récapitulatif, puis une session neuve sur le PC par ticket validé. Il ne code pas, ne fait pas lui-même les récapitulatifs et ne valide jamais seul un plan : il le présente tel quel à Tomicho, qui décide.
- Agent `chef-de-projet` (`.claude/agents/chef-de-projet.md`), deux modes :
  - mode récapitulatif : il analyse les tickets annoncés de la colonne « step:in_wait » du board « Board Allonzy » et demande la validation ;
  - mode exécution : sur un seul ticket validé, il fait créer la branche par le rédacteur, délègue un agent à la fois, vérifie le travail, pousse, ouvre la PR et passe le ticket en « step:in_verif ».
  Il n'écrit pas de code, ne valide jamais un plan et ne fusionne jamais.
- Agent `backend` (`.claude/agents/backend.md`) : API, base de données et temps réel — `apps/api/`, `packages/shared/`. Il ne doit jamais modifier les écrans, composants, styles ou la navigation de l'application mobile.
- Agent `frontend` (`.claude/agents/frontend.md`) : application mobile — `apps/mobile/`. Il ne doit jamais modifier l'API, le schéma de base ou `packages/shared/`.
- Agent `designer` (`.claude/agents/designer.md`) : identité visuelle — `docs/design/` (palette, typographie, maquettes basse fidélité). Il propose des pistes que Tomicho valide et ne touche jamais au code ; `frontend` traduit ensuite ses choix en jetons du thème.
- Agent de soutien `redacteur` (`.claude/agents/redacteur.md`, modèle haiku) : appelé par le chef de projet pour le nom et la création de la branche, les descriptions de PR, les commentaires GitHub, les fiches de `docs/decisions/` et la documentation ; il ne touche jamais au code. Les autres agents lui passent leurs besoins via leur compte rendu.
- Agent de soutien `securite` (`.claude/agents/securite.md`, modèle sonnet) : adjoint du backend. Le chef de projet l'appelle sur un plan ou un travail du backend qui touche l'authentification, le contrôle d'accès, l'exposition du serveur et les passerelles, les secrets, les dépendances ou l'envoi de photos. Il rend des constats classés (critique, important, mineur) ; un constat critique bloque la PR jusqu'à correction par le backend. Il ne code jamais.
- Plugin `ui-ux-pro-max` (bases de palettes par secteur, polices et styles d'interface) : utilisé par `designer` pour fonder ses pistes sur le domaine d'Allonzy au lieu de propositions improvisées.
- Plugin `ponytail` (écrire seulement le code nécessaire) : utilisé par `backend` et `frontend`, en mode `full`, avec `/ponytail-review` sur leurs modifications avant de rendre leur travail.
- Règle des rôles : chaque agent ne fait que la tâche de son rôle. Si le rôle requis n'existe pas ou n'est pas disponible, on le signale à Tomicho au lieu qu'un autre agent le fasse à sa place.
- Règle de délégation : une tâche qui touche l'API, la base, Socket.IO, l'authentification ou le stockage des photos va à `backend` ; un écran, un composant, le thème ou la navigation va à `frontend` ; l'identité visuelle ou une maquette va à `designer`. Un ticket qui en touche plusieurs suit l'ordre designer, backend, puis frontend sur une seule branche : le premier expose le contrat, le suivant construit dessus.
- Git : le rédacteur nomme et crée la branche à la demande du chef de projet ; les agents spécialisés committent dessus sans pousser ; le chef de projet vérifie, pousse et ouvre la PR vers `develop`.
- Plans obligatoires avant de coder : `backend` avant tout changement de schéma (migration Prisma) ou d'un contrat d'API déjà utilisé ; `frontend` avant tout changement de navigation ou des jetons du thème ; `designer` avant tout choix d'identité visuelle (il propose 2 ou 3 pistes). Le plan est validé par Tomicho.
- Chaque agent termine par un compte rendu : fichiers modifiés, décisions prises, vérifications lancées et résultat, points ouverts, plus les éléments propres à son rôle.
- Labels `step:in_wait` et `step:in_verif` : miroirs des colonnes du board, posés par le workflow « Synchroniser les labels avec le board ». Aucun agent ne les modifie.
- Sessions : une session neuve par récapitulatif et par ticket. Ne jamais enchaîner plusieurs lots dans une même session, car son historique serait relu à chaque action.
