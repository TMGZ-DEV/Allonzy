# Definition of Done — Allonzy


Un ticket traité par l'équipe d'agents est « terminé côté agents » quand toutes ces cases sont vraies. Il n'est réellement terminé qu'après la validation humaine.

## Vérifications automatiques (lancées par les spécialistes)
- [ ] Aucune commande définie pour l'instant : à compléter (install, typecheck, lint, test) quand le socle existera

## Vérifications du chef de projet (avant d'ouvrir la PR)
- [ ] Chaque critère d'acceptation est couvert, et la PR dit comment
- [ ] Aucun fichier hors du périmètre des spécialistes, aucun chemin protégé modifié
- [ ] Tests ajoutés ou mis à jour pour le code modifié
- [ ] Vérifications automatiques relancées par le chef de projet sur la branche complète
- [ ] PR vers `develop` avec `Closes #<n>`, ticket passé en « step:in_verif »

## Validation humaine
- [ ] Code relu
- [ ] Testé selon les critères d'acceptation (Expo Go sur téléphone, API sur le serveur de développement)
- [ ] Fusionné par un humain

<!-- libre:dod -->
<!-- Règles propres au projet (performance, accessibilité, compatibilité...). -->
<!-- /libre:dod -->
