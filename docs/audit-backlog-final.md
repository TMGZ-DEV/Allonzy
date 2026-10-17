# Audit final du backlog Allonzy

Bilan de l'affinage du 17/10/2026, mené dans le rôle de Product Owner à partir de l'audit initial ([`audit-backlog.md`](audit-backlog.md), gardé tel quel). Chaque point de l'audit initial est repris ici avec ce qui a été fait.

Le socle technique (§3.1 de l'audit initial : US00, authentification, base de données, CI, temps réel, hébergement, stockage des photos) est **volontairement hors de cet affinage**. Il sera traité avec le futur agent backend. Aucun code n'a été écrit.

> **Changement depuis l'audit initial : Garage remplace MinIO** pour le stockage des photos (décision du 17/10/2026). L'audit initial cite MinIO dans T00.2 et T00.7 (§3.1) ; il est gardé tel quel comme trace historique. MinIO ne publie plus d'image Docker gratuite depuis fin 2025 et son projet open source est en maintenance. Garage parle aussi le protocole S3, donc les recommandations restent valables : stockage objet, URL signées, taille maximale. L'audit de la stack et du stockage a été mis à jour dans le même sens.

## En bref

**Verdict : backlog fonctionnel prêt pour le Sprint 1, dès que le socle technique sera planifié.**

- Les 4 incohérences de dépendances et de critères sont corrigées.
- 11 tâches et 1 user story ont été ajoutées (#53 à #64) pour couvrir les gestes manquants : modifier son profil, mes groupes, quitter un groupe, transférer l'administration, corriger une dépense, qui rembourse qui, remboursement effectué, cocher un élément, modifier une activité, notifications.
- Les zones floues ont reçu une valeur par défaut écrite dans les critères d'acceptation : tailles, délais, formats, règles de calcul.
- Les 76 dépendances sont maintenant des liens « bloqué par » natifs de GitHub, et chaque référence dans le texte pointe vers son issue.
- Il reste à faire : le socle technique, le champ « Points » du board et le choix GitLab ou GitHub (voir « Ce qui reste »).

| Axe | Avant | Après | Commentaire |
|---|---|---|---|
| Conformité au format (DoR) | 5/5 | 5/5 | Les 12 nouveaux tickets suivent le même format |
| Fidélité de l'import | 5/5 | 5/5 | Les écarts avec le Sprint 0 sont voulus et listés plus bas |
| Niveau de détail des tâches | 4/5 | 4,5/5 | Valeurs fixées sur 16 tickets ; tests ajoutés sur 8 tâches |
| Couverture fonctionnelle | 3,5/5 | 4,5/5 | Les gestes CRUD de base sont couverts ; « mot de passe oublié » attend le socle |
| Couverture technique | 1,5/5 | 1,5/5 | Inchangée, hors périmètre de cet affinage |
| Cohérence des dépendances | 3,5/5 | 5/5 | Plus aucune dépendance vers une release plus tardive, plus de boucle |
| Exploitation dans GitHub | 3/5 | 4/5 | Dépendances natives, milestone « Hors périmètre » ; il manque le champ Points |

## 1. Chiffres avant / après

| Milestone | Avant | Après | Écart |
|---|---|---|---|
| Release 1 | 12 tâches, 37 pts | 18 tâches, 52 pts | +6 tâches : profil, mes groupes, quitter, transfert admin, corriger une dépense, remboursements |
| Release 2 | 15 tâches, 41 pts | 19 tâches, 51 pts | +3 tâches, et le sondage T03.4 remonté de la Release 3 |
| Release 3 | 14 tâches, 48 pts | 12 tâches, 37 pts | +2 tâches de notifications, −T03.4, −3 tâches Won't |
| Hors périmètre (nouveau) | – | 3 tâches, 11 pts | T05.3, T07.8, T07.9 (Won't) |
| **Total** | 10 US, 41 tâches, 126 pts | 11 US, 52 tâches, 151 pts | |

**À savoir pour la planification.** Avec la vélocité de 10 pts par semaine donnée en exemple par la stack, la Release 1 fonctionnelle représente environ 5 sprints, auxquels s'ajouteront les quelque 25 pts du socle technique (audit initial, §3.1). Les 7 points ajoutés en Should dans la Release 1 (quitter un groupe, transfert admin, qui rembourse qui) sont les premiers à décaler si le temps manque.

## 2. Décisions de Product Owner

| Décision | Choix | Raison |
|---|---|---|
| Sondages (T03.4, #16) | Remontés de Could / Release 3 à **Should / Release 2** | Le pitch met les sondages au cœur de l'usage « Échanger » ; la tâche ne dépend que de T03.1 (R1) et du temps réel déjà prévu pour la messagerie |
| US et Definition of Done | **Les US deviennent des épics** : elles restent ouvertes tant qu'il reste des sous-issues ; la DoD s'applique aux tâches | Sinon US01, US03, US05 et US07 ne peuvent jamais être fermées (critères en Release 3 ou en Won't). GitHub affiche déjà la progression des sous-issues |
| Points d'une US | Total de toutes ses tâches, **détaillé par release** dans l'issue | Garde un seul chiffre par US pour le board et donne quand même le chiffre de la release, comme le Sprint 0 |
| Règle « au-delà de 8 points, on découpe » | S'applique aux **tâches**, pas aux US | 10 US sur 11 dépassent 8 points ; aucune tâche ne les dépasse. À corriger dans la DoR du livrable Sprint 0 |
| Photo de profil en Release 1 | **Facultative** : avatar avec initiales tant que le stockage d'images n'existe pas | Évite que T01.1 et T02.4 attendent le stockage d'images, qui fait partie du socle |
| Devise | **Une devise par groupe**, choisie à la création (euro par défaut) ; multi-devises hors périmètre | Règle simple, qui rend T04.3 cohérent avec T04.1 |
| Répartition d'une dépense | **Parts égales** entre participants cochés ; parts personnalisées hors périmètre | Suffit pour la Release 1 ; à rouvrir après les tests avec de vrais groupes |
| Départ de l'administrateur | Transfert manuel (T02.7), ou **automatique au membre le plus ancien** s'il supprime son profil | Un groupe n'est jamais sans administrateur, et la suppression de profil n'est jamais bloquée |
| Notifications | Nouvelle **US11 en Could / Release 3** | Attendu sur une appli mobile de groupe, mais demande un service push qui relève du socle |
| Mot de passe oublié | **Non créé**, laissé au socle technique | Dépend de l'authentification et de l'envoi d'e-mails |
| Renumérotation T06.3 / T06.1 | **Non faite** | Changer les codes casserait la correspondance avec le Sprint 0 et le GitLab ; la dépendance native rend l'ordre visible |

## 3. Incohérences (audit initial, §4)

| Point | Avant | Après |
|---|---|---|
| US03 (#12) dépend de US07 (R2) | Dépendance affichée sans réserve | Retirée ; le stockage d'images est marqué « uniquement pour T03.5 » |
| T05.1 (#24) ↔ T08.1 (#43) | Dépendance circulaire | Critère « peut être ajoutée au calendrier » retiré de T05.1 ; il reste porté par T08.1 |
| T06.2 (#29) cite la liste perso (R3) | « liste personnelle ou liste commune » | Limité à la liste commune, avec renvoi vers T06.4 |
| T07.3 (#35) cite la suppression (R3) | « téléchargement, suppression » | Téléchargement seul, avec renvoi vers T07.6 |
| T01.1 (#2), T02.4 (#11) : photo en R1 | Photo sans stockage d'images | Photo facultative, avatar à initiales |
| US avec critères hors release (§4.3) | US01, US03, US05, US07 impossibles à fermer | Section « Périmètre par release » dans chaque US, critères Won't marqués « hors périmètre » |
| Tâches Won't en Release 3 | 3 tâches | Milestone « Hors périmètre » |
| Deux façons de compter les points (§4.4) | Total US ≠ total release | Les deux chiffres sont dans chaque US |
| T01.2 (#3) dépend de T02.3 (§4.5) | Dépendance sans explication | Précisée : on réutilise la logique serveur de retrait, pas l'action admin |

## 4. Fonctions ajoutées (audit initial, §3.2)

| Issue | Tâche | Priorité | Release | Pts |
|---|---|---|---|---|
| #54 | T01.6 - Consulter et modifier mon profil | Must | R1 | 3 |
| #55 | T02.5 - Voir la liste de mes groupes | Must | R1 | 2 |
| #56 | T02.6 - Quitter un groupe | Should | R1 | 2 |
| #57 | T02.7 - Transférer le rôle d'administrateur | Should | R1 | 2 |
| #58 | T04.5 - Modifier ou supprimer une dépense | Must | R1 | 3 |
| #59 | T04.6 - Voir qui rembourse qui | Should | R1 | 3 |
| #60 | T04.7 - Marquer un remboursement comme effectué | Should | R2 | 2 |
| #61 | T06.5 - Cocher un élément de liste | Should | R2 | 1 |
| #62 | T08.3 - Modifier une activité du calendrier | Could | R2 | 2 |
| #53 | US11 - Notifications | Could | R3 | 5 |
| #63 | T11.1 - Être notifié d'un nouveau message | Could | R3 | 3 |
| #64 | T11.2 - Être notifié d'une nouvelle dépense | Could | R3 | 2 |

Les US01, US02, US04, US06 et US08 ont été mises à jour (critères, tâches liées, points). T04.7 rend mesurable l'indicateur « dépenses soldées » du pitch : le groupe affiche « Comptes soldés » quand tous les soldes sont à zéro.

## 5. Zones floues tranchées (audit initial, §5)

| Ticket | Valeur écrite dans les critères |
|---|---|
| T01.1 (#2) | Pseudo obligatoire, 3 à 30 caractères (lettres, chiffres, « - », « _ »), unique sans tenir compte des majuscules ; prénom (50 car.), bio (160 car.) et photo facultatifs |
| T01.2 (#3) | E-mail, prénom, bio et photo supprimés ; pseudo remplacé par « Ancien membre » ; dépenses gardées dans les soldes ; rôle admin transmis |
| T01.4, T01.5 (#5, #6) | Voyage terminé = date de fin passée (calculé) ; pays comptés par code ISO ; un groupe quitté avant la fin n'est pas compté |
| T02.1 (#8) | Nom de 3 à 50 caractères ; pays en code ISO 3166 + ville libre facultative ; dates sans heure, fin ≥ début ; devise du groupe |
| T02.2 (#9) | Lien d'invitation valable 7 jours, régénérable ; une personne sans compte s'inscrit puis rejoint le groupe |
| T02.3 (#10) | Retrait logique (date de départ), dépenses gardées ; l'admin ne se retire pas lui-même |
| T03.1 (#13) | Message reçu en moins de 2 s sur le réseau de test ; 2 000 caractères max |
| T03.4 (#16) | 2 à 6 options |
| T03.5, T07.1 (#17, #33) | JPG, PNG, HEIC converti en JPEG ; 10 Mo max ; 1 photo par message, 10 par envoi dans la galerie |
| T04.1, T04.3 (#19, #21) | Devise du groupe ; 2 décimales max, stocké en centimes ; parts égales ; date du jour par défaut |
| T04.4 (#22) | Calcul en centimes ; centimes restants attribués un par un dans l'ordre d'arrivée (10 € / 3 = 3,34 + 3,33 + 3,33) |
| T09.1, T09.3 (#46, #48) | Disponibilités à la journée ; créneau = jours consécutifs, durée minimale réglable (2 jours par défaut) |

Des tâches techniques « écrire les tests » ont été ajoutées sur T02.2, T02.3 et T04.1, et sur les nouvelles tâches qui touchent aux droits ou aux calculs.

## 6. Exploitation dans GitHub et coquilles (audit initial, §6 et §7)

| Point | Résultat |
|---|---|
| Dépendances | **Fait.** 76 liens « bloqué par » natifs, et toutes les références du texte suivies de leur numéro (`T02.2 - … (#9)`) |
| Milestones | **Fait.** Descriptions à jour (tâches et points), milestone « Hors périmètre » créé |
| Coquilles | **Fait.** Les 10 « afin de » + voyelle, « afin de que » et « En tant que administrateur » sont corrigés |
| Pied de page « Generated by Claude Code » | **Pas faisable depuis une session Claude** : il est ajouté automatiquement à chaque écriture via l'API. Il faut le retirer à la main si on n'en veut pas |
| Champ « Points » et « Itération » du board | **Non fait.** Le board ne peut pas être modifié depuis une session Claude ; à ajouter à la main dans « Board Allonzy » |
| Labels d'état et labels par défaut | **Non fait.** À décider avec la configuration des colonnes du board |
| Branche `develop` | **Non faite**, elle relève du socle technique |

La correspondance code → numéro d'issue est à jour dans `backlog/github_issue_map.json` du dossier projet (US11 et tâches #53 à #64 incluses).

## 7. Ce qui reste

1. **Socle technique** (US00, environ 25 pts, plus « mot de passe oublié » et le service de notifications push), avec Garage comme stockage objet des photos : à planifier avec le futur agent backend, avant le Sprint 1.
2. **GitLab ou GitHub comme référence** des tickets (audit initial, §6.7) : le backlog GitHub est désormais en avance sur le CSV GitLab et sur le livrable Sprint 0. Si le GitLab de l'IUT reste la référence pour l'équipe, il faudra y reporter ces changements.
3. **Board** : ajouter les champs « Points » et « Itération », et décider du sort des labels « A faire » et « En cours ».
4. **Livrable Sprint 0** : mettre à jour la DoR (règle des 8 points sur les tâches), la story map et les totaux par release si le document est rendu à nouveau.
