# Audit du backlog Allonzy

Audit des 51 issues importées le 17/10/2026 depuis l'export GitLab (10 user stories, 41 tâches), comparées au livrable Sprint 0, au document de stack technique et au poster du pitch. L'audit propose des changements : aucune issue n'a été modifiée.

Il complète l'audit de la stack et du stockage (`/mnt/project-files/audits/audit_stack_et_stockage.md` dans le dossier du projet), qui détaille le modèle de données, l'hébergement et le stockage des photos. Je n'ai pas refait cette analyse ici : les recommandations ci-dessous restent alignées sur lui et y renvoient quand c'est utile.

## En bref

**Verdict : bon backlog, prêt pour l'affinage, pas encore prêt pour le Sprint 1.**

- La forme est solide. Chaque ticket respecte la Definition of Ready : format « En tant que… je souhaite… afin de… », 2 à 4 critères d'acceptation, tâches techniques, estimation Fibonacci, dépendances. L'import est fidèle : les points, priorités et releases correspondent au Sprint 0 au point près (37 / 41 / 48 pts, 12 / 15 / 14 tâches).
- Le fond couvre bien le descriptif. Les cinq fonctions annoncées (profils, groupes, dépenses, calendrier commun, messagerie) ont toutes leur US, plus cinq US en bonus (activités, listes, galerie, disponibilités, carte).
- **Le gros manque, c'est le socle technique.** L'authentification est citée comme dépendance par US01, US02 et T01.1, mais aucun ticket ne la porte. Il manque aussi l'initialisation du projet, la base de données, la CI, le temps réel et le stockage des photos. Sans ces tickets, la Release 1 démarre bloquée et sa vélocité sera faussée.
- Il manque aussi quelques fonctions attendues : modifier son profil, quitter un groupe, modifier ou supprimer une dépense, savoir qui rembourse qui.
- Il y a quelques incohérences à corriger : une dépendance US03 vers US07 qui casse l'ordre des releases, des critères d'acceptation qui renvoient à des tâches planifiées plus tard, une dépendance circulaire T05.1 ↔ T08.1, et la photo de profil prévue en Release 1 alors que le stockage d'images n'arrive qu'en Release 2.

| Axe | Note | Commentaire |
|---|---|---|
| Conformité au format (DoR) | 5/5 | Tous les champs sont présents sur les 51 tickets |
| Fidélité de l'import | 5/5 | Points, priorités, releases et sous-issues sont conformes au Sprint 0 |
| Niveau de détail des tâches | 4/5 | Critères testables, quelques valeurs à fixer (tailles, délais, champs) |
| Couverture fonctionnelle | 3,5/5 | Le descriptif est couvert, mais il manque des gestes CRUD de base |
| Couverture technique | 1,5/5 | Aucun ticket de socle (auth, BDD, CI, temps réel, stockage) |
| Cohérence des dépendances | 3,5/5 | Ordre des tâches respecté, 4 incohérences ponctuelles |
| Exploitation dans GitHub | 3/5 | Dépendances en texte libre, pas de champ points, labels doublons |

## 1. Ce qui a été vérifié

| Contrôle | Résultat |
|---|---|
| Nombre d'issues | 51 (#1 à #51) : 10 US et 41 tâches |
| Sous-issues | Chaque tâche est rattachée à son US (5, 4, 5, 4, 3, 4, 9, 2, 3, 2) |
| Points US = somme des tâches | Oui pour les 10 US |
| Échelle Fibonacci (1, 2, 3, 5, 8) | Oui, aucune tâche au-delà de 8 |
| Totaux par milestone | Release 1 = 37 pts, Release 2 = 41 pts, Release 3 = 48 pts, total 126 pts |
| Une tâche ne dépend jamais d'une tâche planifiée plus tard | Oui pour les 41 tâches |
| Une US ne dépend jamais d'une US planifiée plus tard | **Non : US03 (R1) dépend de US07 (R2)**, voir 4.1 |
| Labels | 3 types (User Story, Task) + 4 priorités MoSCoW + 2 états (A faire, En cours) |

## 2. Correspondance avec le descriptif d'Allonzy

| Fonction annoncée | US | Release | Avis |
|---|---|---|---|
| Gestion des profils | US01 (#1) | R1, stats et centres d'intérêt en R3 | Couvert, mais pas de « modifier mon profil » |
| Constitution des groupes | US02 (#7) | R1 | Couvert, mais pas de « quitter un groupe » ni de « mes groupes » |
| Dépenses partagées | US04 (#18) | R1 | Couvert pour la saisie et les soldes, pas pour la correction ni le remboursement |
| Calendrier commun | US08 (#42) + US09 (#45) | R2 | Bien couvert, avec un vrai plus (meilleurs créneaux) |
| Messagerie dédiée | US03 (#12) | R1 pour le texte, R3 pour le reste | Couvert |

Écart avec le pitch : le poster place les **sondages** au cœur de l'usage « Échanger et se souvenir », mais T03.4 (#16) est en Could, Release 3, donc hors rendu. Si le pitch est montré au jury, soit on remonte T03.4 en Release 2, soit on retire « sondages » du pitch.

Les trois indicateurs du pitch (groupes actifs, temps gagné, dépenses soldées) n'ont aucun ticket qui les rend mesurables. Le troisième suppose de pouvoir marquer un remboursement comme fait (voir 3.2).

## 3. Ce qui manque

### 3.1 Socle technique (bloquant pour la Release 1)

La stack technique décrit précisément ce qu'il faut monter, mais rien n'est dans le backlog. Je propose une US « US00 - Socle technique » en Must, Release 1, avec ces tâches (estimations indicatives) :

| Proposition | Pts | Pourquoi |
|---|---|---|
| T00.1 - Initialiser le monorepo `mobile/`, `api/`, `shared/` (Expo, Express, TypeScript strict, ESLint, Prettier) | 3 | Prérequis à tout le reste, décrit en 2.2 de la stack |
| T00.2 - Docker Compose (PostgreSQL + MinIO), schéma Prisma initial relu en équipe, seed de démo | 3 | Toutes les US en dépendent ; règles du schéma dans l'audit stack, §4 et §5 |
| T00.3 - Pipeline CI (typage, lint, format, tests Jest avec base PostgreSQL) | 3 | Exigée par la DoD et par la stack (4.5) |
| T00.4 - Inscription, connexion et déconnexion (bcrypt, jeton court + jeton de rafraîchissement, expo-secure-store) | 5 | **Citée en dépendance par US01, US02 et T01.1, sans ticket.** Le jeton de rafraîchissement permet la déconnexion exigée par T01.2 (audit stack, §3.3) |
| T00.5 - Contrôle d'accès « membre » et « admin » côté API, avec tests « non-membre = 403 » | 2 | Répété dans une dizaine de critères (« seuls les membres… ») ; mieux vaut le faire une fois (audit stack, §3.4) |
| T00.6 - Serveur Socket.IO avec un salon par groupe | 3 | Dépendance technique de T03.1, utile aussi pour les mises à jour en direct |
| T00.7 - Stockage des images en stockage objet S3 (MinIO en dev), URL signées, taille max | 3 | Nécessaire dès T01.1 (photo de profil), réutilisé par T03.5 et T07.1. Le disque de l'API est déconseillé (audit stack, §3.2) |
| T00.8 - Hébergement de l'API, de la base et du stockage, avec sauvegarde quotidienne | 3 | Nécessaire pour la recette sur téléphone et les tests avec de vrais groupes (audit stack, §2) |

Ça fait environ **25 points**. Avec la vélocité de 10 pts par semaine prise en exemple dans la stack, la Release 1 passe d'environ 4 à environ 6 sprints. Il vaut mieux le savoir maintenant.

Alternative si vous ne voulez pas gonfler la Release 1 : basculer T00.6 dans T03.1 et T00.7 dans T07.1, et garder la photo de profil optionnelle en Release 1.

### 3.2 Fonctions manquantes

| Proposition | US | Priorité suggérée | Pourquoi |
|---|---|---|---|
| Consulter et modifier mon profil | US01 | Must, R1 | Le critère de US01 dit « créer, consulter et supprimer », aucune tâche ne couvre la consultation ni la modification |
| Voir la liste de mes groupes (écran d'accueil) | US02 | Must, R1 | Citée dans les critères de T02.1 et T02.2 sans tâche dédiée |
| Quitter un groupe | US02 | Should, R1 | Seul l'admin peut retirer quelqu'un ; un membre ne peut pas partir de lui-même |
| Transférer le rôle d'administrateur | US02 | Should, R1 | Que devient le groupe si l'admin supprime son profil (T01.2) ? |
| Modifier ou supprimer une dépense | US04 | Must, R1 | Une erreur de saisie fausse définitivement les soldes, alors que c'est le cœur de la promesse « sans conflit » |
| Voir qui rembourse qui (liste de virements simplifiée) | US04 | Should, R1 | US04 promet « qui doit combien à qui » ; T04.4 n'affiche qu'un solde par membre |
| Marquer un remboursement comme effectué | US04 | Should, R2 | Nécessaire pour l'indicateur « dépenses soldées » du pitch |
| Modifier une activité du calendrier | US08 | Could, R2 | Seuls l'ajout et le retrait existent |
| Cocher un élément de liste (fait / pas fait) | US06 | Should, R2 | Indispensable pour une liste de courses (audit stack, §4.6) |
| Mot de passe oublié | US00 | Should, R2 | Demande un envoi d'e-mails (audit stack, §3.3) |
| Notifications (nouveau message, nouvelle dépense) | Nouvelle US | Could, R2 ou R3 | Attendu sur une appli mobile de groupe, non prévu |

## 4. Incohérences à corriger

### 4.1 US03 dépend de US07 (#12)

US03 (Release 1) déclare « Dépend de la User Story US07 - Galerie photo partagée » (Release 2). Le livrable Sprint 0 précise que cette dépendance ne concerne que T03.5 (Release 3), mais l'issue GitHub l'affiche sans réserve. **Correction :** retirer la ligne de US03 ; elle est déjà portée par T03.5 (#17).

### 4.2 Critères d'acceptation qui renvoient à des tâches plus tardives

| Ticket | Critère | Problème | Correction proposée |
|---|---|---|---|
| T06.2 (#29), R2 | « ma liste personnelle ou la liste commune » | La liste personnelle est T06.4 (#31), en R3 | Limiter le critère à la liste commune, ou remonter T06.4 en R2 |
| T07.3 (#35), R2 | « action groupée (téléchargement, suppression) » | La suppression est T07.6 (#38), en R3 | Retirer « suppression » de la formulation |
| T05.1 (#24), R2 | « peut ensuite être ajoutée au calendrier partagé » | C'est T08.1 (#43) qui le fait, et T08.1 dépend de T05.1 : **dépendance circulaire** | Retirer ce critère de T05.1, il est déjà dans T08.1 |
| T01.1 (#2), R1 | « pseudo, photo » | Le stockage d'images arrive avec T07.1 (#33), en R2 | Ajouter T00.7 en R1 ou rendre la photo facultative en R1 |
| T02.4 (#11), R1 | « le pseudo et la photo de chaque membre » | Même problème | Idem |

### 4.3 Les US portent des critères hors release

US01, US03, US05 et US07 ont des critères d'acceptation remplis seulement par des tâches de Release 3, parfois en Won't (likes, propositions automatiques). Avec la DoD actuelle, ces US ne pourront jamais être fermées à la fin de leur release, et une US en Won't est par définition hors rendu.

Deux options :
1. **Recommandé :** traiter les US comme des épics, qui restent ouvertes tant qu'il reste des sous-issues, et appliquer la DoD aux tâches. GitHub affiche déjà la progression des sous-issues.
2. Découper chaque critère d'US par release (« Release 1 : … / Release 3 : … »), comme le fait le livrable Sprint 0 avec sa section « Périmètre de la release ».

Dans les deux cas, je suggère un milestone « Hors périmètre » pour les 3 tâches Won't (T05.3 #26, T07.8 #40, T07.9 #41) au lieu de Release 3.

### 4.4 Deux façons de compter les points d'une US

Les issues GitHub donnent le total complet de l'US (US01 = 11 pts, US03 = 18, US07 = 20), alors que le livrable Sprint 0 donne le total de la release seulement (US01 = 5, US03 = 8, US07 = 12). Les deux sont justes, mais il faut en choisir un pour le burndown. De plus, la DoR dit « au-delà de 8 points, elle est découpée », alors que 9 US sur 10 dépassent 8 points. La règle vise sans doute les tâches : il faudrait l'écrire ainsi.

### 4.5 Dépendances discutables

- T01.2 (#3) dépend de T02.3 (#10), « Retirer un membre ». Supprimer son profil n'a pas besoin de l'action admin, il faut juste la même logique de retrait côté serveur. La dépendance peut rester, mais elle mérite d'être précisée.
- T06.1 (#28) dépend de T06.3 (#30) : c'est logique, mais l'ordre des numéros est trompeur. Renuméroter T06.3 en T06.1 rendrait la story map plus lisible.

## 5. Niveau de détail

Les tâches sont globalement assez détaillées pour être prises en sprint : chaque critère est vérifiable par un testeur qui n'a pas développé la fonction, ce que demande la recette (stack 4.6). Il reste des valeurs à fixer avant de commencer :

| Ticket | À préciser |
|---|---|
| T01.1 (#2) | Quels champs sont « informations de base » et lesquels sont obligatoires ? |
| T02.1 (#8) | La destination doit être un code pays ISO plus une ville en texte libre, sinon T01.4 (#5) compte « Portugal » et « Lisbonne » comme deux pays (audit stack, §4.3) |
| T01.4, T01.5 (#5, #6) | Écrire qu'un voyage « terminé » est un groupe dont la date de fin est passée (calculé, pas un statut) |
| T02.2 (#9) | Le lien d'invitation fonctionne-t-il pour quelqu'un qui n'a pas encore de compte ? Expire-t-il ? |
| T03.1 (#13) | « En quelques secondes » : fixer une valeur testable (par exemple moins de 2 s) |
| T03.5, T07.1 (#17, #33) | Taille maximale des photos (par exemple 10 Mo), nombre de photos par envoi, conversion des photos HEIC des iPhone en JPEG (audit stack, §3.2) |
| T04.1, T04.3 (#19, #21) | T04.3 parle de devise, T04.1 n'a pas de champ devise : écrire « une devise par groupe, multi-devises hors périmètre ». Répartition autre qu'à parts égales prévue ou non ? |
| T04.4 (#22) | Montants en centimes entiers et règle d'attribution du centime restant (10 € / 3 = 3,34 + 3,33 + 3,33), sinon « la somme des soldes est égale à zéro » ne tient pas (audit stack, §4.1) |
| T02.3 (#10) | Le retrait est logique (date de départ sur le membre), sans supprimer la ligne, pour que ses dépenses restent dans les soldes (audit stack, §4.2) |
| T09.3 (#48) | Granularité d'un créneau (jour, demi-journée) et durée minimale |

Sur la qualité : seules T04.4 et T09.3 citent explicitement des tests unitaires. Comme la DoD et la stack (4.4) imposent des tests sur la logique métier et les endpoints critiques, la DoD suffit, mais l'ajouter en tâche technique sur T04.1, T02.2 et T02.3 (droits) éviterait les oublis.

## 6. Exploitation dans GitHub

Le backlog a été conçu pour GitLab. Sur GitHub, quelques ajustements le rendraient plus pratique :

1. **Lier les dépendances.** Elles sont en texte libre (« Dépend de la tâche T02.2 »). GitHub sait gérer « bloqué par » entre issues, et un simple `#9` dans le texte crée déjà un lien cliquable. La correspondance code → numéro est dans `backlog/github_issue_map.json` du dossier projet.
2. **Story points.** L'estimation est dans le texte, donc ni GitHub ni le board ne peuvent la sommer. Un champ « Points » de type nombre dans le GitHub Project « Board Allonzy » réglerait le burndown.
3. **Labels d'état.** « A faire » et « En cours » font doublon avec les colonnes du board. La stack prévoit aussi une colonne « Test » qui n'a pas de label. Je suggère de garder l'état uniquement dans le board.
4. **Labels par défaut.** Les 9 labels GitHub d'origine (enhancement, good first issue…) n'ont pas d'usage. La stack prévoit un label « Bug » : on peut renommer « bug » et supprimer les autres.
5. **Milestones.** Ils n'ont pas de date d'échéance. La stack prévoit un milestone par sprint ; sur GitHub, mieux vaut garder les milestones pour les releases et utiliser un champ « Itération » du Project pour les sprints.
6. **Pied de page parasite.** Les 51 issues et les 3 descriptions de milestone se terminent par « Generated by Claude Code », ajouté pendant l'import. On peut le retirer.
7. **GitLab ou GitHub ?** La stack, la DoR, la DoD et le cycle de vie parlent de GitLab de l'IUT (merge requests, GitLab CI, bouton « Create merge request »). Si GitHub reste un miroir personnel, il faut décider lequel fait foi pour les tickets, sinon les numéros vont diverger (`Closes #12` ne pointe pas sur le même ticket des deux côtés).
8. **Branches.** La stack prévoit `main` et `develop` protégées. Le dépôt n'avait aucune branche ; `main` a été créée avec un README pour servir de base à cette PR. `develop` reste à créer.

## 7. Coquilles

Le générateur a écrit « afin de » devant une voyelle ou « que » sans élision. Ça apparaît dans plusieurs issues et dans le livrable Sprint 0 :

| Ticket | Texte actuel | Correction |
|---|---|---|
| US02 (#7) | afin de organiser | afin d'organiser |
| T01.3 (#4) | afin de être connu | afin d'être connu |
| T01.5 (#6) | afin de avoir | afin d'avoir |
| T02.2 (#9) | En tant que administrateur… afin de inviter | En tant qu'administrateur… afin d'inviter |
| T02.3 (#10) | En tant que administrateur | En tant qu'administrateur |
| T03.1 (#13) | afin de échanger | afin d'échanger |
| T04.1 (#19) | afin de que chacun sache | afin que chacun sache |
| T07.3 (#35) | afin de effectuer | afin d'effectuer |
| T09.1 (#46) | afin de que le groupe sache | afin que le groupe sache |
| T10.2 (#51) | afin de estimer | afin d'estimer |

## 8. Plan d'action proposé

Dans l'ordre, avant le Sprint 1 :

1. Choisir l'hébergement et le stockage des photos (audit stack, §7), puis créer US00 et ses tâches de socle (3.1), en Must, Release 1.
2. Ajouter les tâches manquantes Must de la Release 1 (3.2) : consulter et modifier son profil, mes groupes, modifier ou supprimer une dépense.
3. Corriger les incohérences de 4.1 et 4.2.
4. Trancher les trois décisions de produit : US en épics ou critères par release (4.3), sondages dans le rendu ou non (section 2), GitLab ou GitHub comme référence (6.7).
5. Fixer les valeurs de la section 5 au fil du sprint planning, ticket par ticket.
6. Ajuster GitHub (section 6) et corriger les coquilles (section 7).

Je peux appliquer les points 1, 2, 3, 6 et 7 directement sur les issues dès que tu valides.
