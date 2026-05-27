# Deployment auf Hetzner

Diese Notiz beschreibt ein robustes Zielbild ohne Secrets im Repository.

## Zielbild

- Hetzner VPS oder Dedicated Server.
- Caddy oder Nginx als Reverse Proxy mit TLS.
- Postgres fuer Payload.
- Payload CMS als Next/Payload Container oder Prozess.
- Astro als Web-Prozess. Preview-Routen bleiben serverfaehig.
- Medien langfristig in S3-kompatiblem Object Storage, z. B. Cloudflare R2 oder Hetzner Object Storage.

## Artefakte

- `deploy/production.env.example`: Vorlage fuer Produktionsvariablen.
- `deploy/compose.hetzner.yml`: Compose-Skizze fuer Postgres, CMS und Web.
- `deploy/Caddyfile.example`: Reverse-Proxy- und TLS-Beispiel.
- `deploy/backup-postgres-media.sh`: Datenbank- und Medienbackup.
- `deploy/rebuild-astro.sh`: Pull, Install, Build, Restart.
- `deploy/rebuild-webhook.mjs`: kleiner lokaler Webhook-Receiver fuer Payload-Rebuilds.
- `apps/cms/Dockerfile` und `apps/web/Dockerfile`: Container-Builds.

## Ports

Intern:

- Payload: `3000`
- Astro: `4321`
- Postgres: `5432` nur intern
- Rebuild Webhook: `8787` nur `127.0.0.1`

Extern:

- `cms.matthiasramahi.de` -> Payload `3000`
- `matthiasramahi.de` -> Astro `4321`

## Reverse Proxy mit Caddy

Siehe `deploy/Caddyfile.example`.

Grundidee:

```caddyfile
matthiasramahi.de {
  reverse_proxy 127.0.0.1:4321
}

cms.matthiasramahi.de {
  reverse_proxy 127.0.0.1:3000
}
```

Caddy kuemmert sich automatisch um TLS, wenn DNS korrekt auf den Server zeigt.

## ENV

Produktionswerte aus `deploy/production.env.example` nach `deploy/production.env` kopieren und echte Secrets nur auf dem Server eintragen.

Wichtig:

- `PAYLOAD_SECRET` stark und dauerhaft.
- `PREVIEW_SECRET` identisch in CMS und Web.
- `PAYLOAD_PREVIEW_API_KEY` im Payload-Admin erzeugen und nur im Web-Env verwenden.
- `DATABASE_URI` auf Postgres zeigen lassen.
- `PAYLOAD_PUBLIC_SERVER_URL` auf die CMS-Domain.
- `ASTRO_PUBLIC_SITE_URL` auf die Live-Domain.
- `ASTRO_REBUILD_WEBHOOK_SECRET` stark und nur serverseitig.
- `RESEND_API_KEY` erst auf dem Server setzen; der Key darf nie ins Frontend.
- `CONTACT_FROM_EMAIL` muss zu einer in Resend verifizierten Domain passen.
- `CONTACT_QUEUE_DIR` zeigt auf das persistente Docker-Volume `contact-queue`.
- `CONTACT_RETRY_SECRET` stark setzen, wenn ein externer Uptime-Monitor oder Cron die Queue erneut zustellen soll.

Kontaktformular-Retry manuell:

```bash
curl -X POST https://matthiasramahi.de/api/contact-retry \
  -H "Authorization: Bearer $CONTACT_RETRY_SECRET"
```

## Postgres Backup

`deploy/backup-postgres-media.sh` nutzt:

```bash
DATABASE_URI="postgres://..." BACKUP_ROOT="/srv/backups/matthias-ramahi" ./deploy/backup-postgres-media.sh
```

Empfehlung:

- taeglich per cron oder systemd timer.
- Backups extern spiegeln.
- Restore testweise pruefen.

Restore:

```bash
gunzip -c payload.sql.gz | psql "$DATABASE_URI"
```

## Medien Backup

Wenn lokale Uploads verwendet werden:

- `PAYLOAD_MEDIA_DIR` auf den Payload-Medienordner setzen.
- Backup zusammen mit Datenbankzeitpunkt ablegen.

Wenn S3/R2/Hetzner Object Storage verwendet wird:

- Bucket-Versionierung pruefen.
- Lifecycle-Regeln bewusst setzen.
- Zugangsschluessel getrennt rotieren.
- Bucket-Backup oder Replikation separat einrichten.

## Rebuild Webhook

Payload ruft bei relevanten Aenderungen `ASTRO_REBUILD_WEBHOOK_URL` auf. Der Receiver:

1. prueft `Authorization: Bearer <ASTRO_REBUILD_WEBHOOK_SECRET>`.
2. startet `deploy/rebuild-astro.sh`.
3. verhindert parallele Builds.

Beispiel:

```bash
ASTRO_REBUILD_WEBHOOK_SECRET="..." node deploy/rebuild-webhook.mjs
```

Der Webhook sollte nur lokal erreichbar sein und per Reverse Proxy nicht oeffentlich exponiert werden.

## Production Checklist

- [ ] DNS auf Hetzner gesetzt.
- [ ] Caddy/Nginx aktiv und TLS gruen.
- [ ] `PAYLOAD_SECRET` stark und dauerhaft.
- [ ] `PREVIEW_SECRET` stark und in CMS/Web identisch.
- [ ] `PAYLOAD_PREVIEW_API_KEY` erzeugt.
- [ ] Postgres nicht oeffentlich erreichbar.
- [ ] `PAYLOAD_PUBLIC_SERVER_URL` korrekt.
- [ ] `ASTRO_PUBLIC_SITE_URL` korrekt.
- [ ] S3/R2 getestet oder lokaler Medienordner im Backup.
- [ ] Rebuild-Hook mit Secret getestet.
- [ ] Datenbank-Backup und Restore getestet.
- [ ] Medien-Backup getestet.
- [ ] `robots.txt` und `sitemap.xml` live pruefen.
- [ ] Preview-URL im Payload Admin pruefen.
