# Allonzy

Application mobile d'organisation de voyages en groupe : profils, groupes, dépenses partagées, calendrier commun et messagerie.

- Stack : React Native + Expo + TypeScript (mobile), Node.js + Express + Socket.IO (API), PostgreSQL + Prisma, stockage photos S3 sur Garage.
- Arborescence (monorepo) : `apps/api/`, `apps/mobile/`, `packages/shared/`. Pas encore de code : le premier ticket socle la crée.
- Backlog : issues GitHub (US en épics, tâches en sous-issues, milestones Release 1/2/3 et « Hors périmètre »). Audit : `docs/audit-backlog-final.md`.
- Serveur de développement : `docs/infra/serveur-de-developpement.md`.
- Langue : français pour le code commenté, les commits, les PR et la documentation.

## Git

- `develop` est la branche par défaut et la cible de toutes les PR. `main` ne reçoit que les versions finales, fusionnées par Tomicho.
- Branches : `{type}/{numero}-{titre-en-clair}`, type parmi feat, fix, docs, chore. Les PR contiennent `Closes #<n>`.
- Aucune ligne de co-signature dans les commits.

## Definition of Done

Voir `.claude/definition-of-done.md`. Commandes de vérification : aucune pour l'instant, à compléter quand le socle existera (install, typecheck, lint, test).

## Agents

<!-- Section générée par le skill equipe-agents-github depuis .claude/team.config.yml. -->

- Le coordinateur (chat du projet) lit les annonces de la tâche « Tickets en attente : annonce dans le projet ». Il ouvre un fil neuf pour chaque récapitulatif, puis une session neuve sur le PC par ticket validé. Il ne code pas, ne fait pas lui-même les récapitulatifs et ne valide jamais seul un plan : il le présente tel quel à Tomicho, qui décide.
- Agent `chef-de-projet` (`.claude/agents/chef-de-projet.md`), deux modes :
  - mode récapitulatif : il analyse les tickets annoncés de la colonne « step:in_wait » du board « Board Allonzy » et demande la validation ;
  - mode exécution : sur un seul ticket validé, il crée la branche, délègue un agent à la fois, vérifie le travail, pousse, ouvre la PR et passe le ticket en « step:in_verif ».
  Il n'écrit pas de code, ne valide jamais un plan et ne fusionne jamais.
- Agent `backend` (`.claude/agents/backend.md`) : API, base de données et temps réel — `apps/api/`, `packages/shared/`. Il ne doit jamais modifier les écrans, composants, styles ou la navigation de l'application mobile.
- Agent `frontend` (`.claude/agents/frontend.md`) : application mobile — `apps/mobile/`. Il ne doit jamais modifier l'API, le schéma de base ou `packages/shared/`.
- Agent de soutien `redacteur` (`.claude/agents/redacteur.md`, modèle haiku) : appelé par le chef de projet pour les descriptions de PR, les commentaires GitHub, les fiches de `docs/decisions/` et la documentation ; il ne touche jamais au code. Les autres agents lui passent leurs besoins via leur compte rendu.
- Règle des rôles : chaque agent ne fait que la tâche de son rôle. Si le rôle requis n'existe pas ou n'est pas disponible, on le signale à Tomicho au lieu qu'un autre agent le fasse à sa place.
- Règle de délégation : une tâche qui touche l'API, la base, Socket.IO, l'authentification ou le stockage des photos va à `backend` ; un écran, un composant, le thème ou la navigation va à `frontend`. Un ticket qui touche les deux suit l'ordre backend puis frontend sur une seule branche : le premier expose le contrat, le suivant construit dessus.
- Git : le chef de projet crée la branche ; les agents spécialisés committent dessus sans pousser ; le chef de projet vérifie, pousse et ouvre la PR vers `develop`.
- Plans obligatoires avant de coder : `backend` avant tout changement de schéma (migration Prisma) ou d'un contrat d'API déjà utilisé ; `frontend` avant tout changement de navigation ou des jetons du thème. Le plan est validé par Tomicho.
- Chaque agent termine par un compte rendu : fichiers modifiés, décisions prises, vérifications lancées et résultat, points ouverts, plus les éléments propres à son rôle.
- Labels `step:in_wait` et `step:in_verif` : miroirs des colonnes du board, posés par le workflow « Synchroniser les labels avec le board ». Aucun agent ne les modifie.
- Sessions : une session neuve par récapitulatif et par ticket. Ne jamais enchaîner plusieurs lots dans une même session, car son historique serait relu à chaque action.
