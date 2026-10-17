# Aide-mémoire du serveur

Référence rapide pour administrer `allonzy-server`. Le contexte général est dans [Serveur de développement](serveur-de-developpement.md).

## Machine

| Élément | Valeur |
|---|---|
| Nom d'hôte | `allonzy-server` |
| Utilisateur | `tmz` |
| Dossier du projet | `~/allonzy` |
| Système | Ubuntu Server LTS, dual boot avec Windows |
| Disque | SSD 240 Go, LVM, environ 98 Go alloués (extensible avec `lvextend`) |

## Se connecter

```
ssh tmz@allonzy-server
```

- Fonctionne partout grâce à Tailscale. Sur le réseau local, l'adresse `192.168.8.96` marche aussi.
- Authentification par clé uniquement.

## Fichiers

Tout se trouve dans `~/allonzy`.

| Fichier | Contenu | Droits |
|---|---|---|
| `compose.yaml` | Définition des services | standard |
| `.env` | Secrets et variables | `600` |
| `garage.toml` | Configuration de Garage | `600` |
| `backup.sh` | Script de sauvegarde | `700` |

Variables de `.env` : `POSTGRES_PASSWORD`, `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.

## Docker

Toutes les commandes se lancent dans `~/allonzy`.

| Besoin | Commande |
|---|---|
| État des services | `docker compose ps` |
| Logs d'un service | `docker compose logs --tail 50 <service>` |
| Démarrer ou appliquer une modification | `docker compose up -d` |
| Redémarrer un service | `docker compose restart <service>` |
| Arrêter un service | `docker compose stop <service>` |
| Mettre à jour les images | `docker compose pull && docker compose up -d` |

Services : `db`, `garage`, `uptime-kuma`.

## PostgreSQL

| Élément | Valeur |
|---|---|
| Base | `allonzy` |
| Utilisateur | `allonzy` |
| Port | `127.0.0.1:5432` |

- Console SQL : `docker compose exec db psql -U allonzy`
- Depuis un poste : client PostgreSQL (DataGrip) avec tunnel SSH vers `tmz@allonzy-server`, hôte `localhost`, port `5432`.

## Garage

| Élément | Valeur |
|---|---|
| Endpoint | `127.0.0.1:3900` (`http://garage:3900` depuis les conteneurs) |
| Région | `garage` |
| Bucket | `allonzy-photos` |
| Clé | `allonzy-api` |
| Adressage | path-style |

Raccourci à taper dans `~/allonzy` :

```
alias garage="docker compose exec garage /garage"
```

| Besoin | Commande |
|---|---|
| État du nœud | `garage status` |
| Contenu du bucket | `garage bucket info allonzy-photos` |
| Afficher la clé | `garage key info allonzy-api --show-secret` |

Depuis un poste : ouvrir le tunnel `ssh -N -L 3900:localhost:3900 tmz@allonzy-server`, puis un client S3 (WinSCP) sur `localhost:3900`.

## Uptime Kuma

- Adresse : celle donnée par `tailscale serve status`, accessible uniquement depuis les appareils Tailscale.
- Sondes : `db:5432` et `garage:3900`.

## Sauvegardes

| Élément | Valeur |
|---|---|
| Script | `~/allonzy/backup.sh` |
| Fréquence | chaque nuit à 3 h (cron) |
| Base | `~/backups/db/`, conservée 14 jours |
| Photos | `~/backups/photos/` (copie miroir) |
| Journal | `~/backups/backup.log` |

- Sauvegarde manuelle : `./backup.sh`
- Voir la planification : `crontab -l`

Restaurer dans une base de test, sans toucher à la vraie :

```
docker compose exec db createdb -U allonzy restore_test
docker compose exec -T db pg_restore -U allonzy -d restore_test < ~/backups/db/<fichier>.dump
docker compose exec db dropdb -U allonzy restore_test
```

## Sécurité

| Élément | Commande ou emplacement |
|---|---|
| Pare-feu | `sudo ufw status` |
| Configuration SSH | `/etc/ssh/sshd_config.d/00-securite.conf` |
| Mises à jour automatiques | `systemctl status unattended-upgrades` |
| Mises à jour manuelles | `sudo apt update && sudo apt upgrade -y` |

## Tailscale

| Besoin | Commande |
|---|---|
| Appareils connectés | `tailscale status` |
| Services publiés | `tailscale serve status` |

Sous Windows, Tailscale n'a pas de fenêtre : l'application est dans la zone de notification.

## Claude sur le serveur

- `claude remote-control` tourne dans la session tmux `claude`.
- Revenir dans la session : `tmux attach -t claude`
- Se détacher sans l'arrêter : `Ctrl+B`, puis `D`.
- Relancer si besoin : `cd ~/allonzy && claude remote-control`

## Dépannage

| Symptôme | Action |
|---|---|
| Service en `Restarting` | Lire `docker compose logs <service>` |
| `>` à la place de l'invite du shell | Un guillemet n'est pas fermé, `Ctrl+C` puis retaper |
| Erreur de configuration | Vérifier l'orthographe anglaise des clés (`environment`, `image`) |
| Valeur refusée dans un `.toml` | Mettre le texte entre guillemets |
| Session Claude refusée | Vérifier que `claude remote-control` tourne dans tmux |
