# Deployment auf Hetzner

Diese Notiz beschreibt ein robustes Zielbild, ohne Secrets ins Repository zu schreiben.

## Zielbild

- Hetzner VPS oder Dedicated Server.
- Caddy oder Nginx als Reverse Proxy mit TLS.
- Postgres für Payload.
- Payload CMS als Node/Next-Prozess oder Container.
- Astro als Node-Prozess, weil Preview-Routen SSR verwenden.
- Medien idealerweise in S3-kompatiblem Object Storage.

## Ports

Intern:

- Payload: `3000`
- Astro: `4321`
- Postgres: `5432` nur intern

Extern:

- `cms.matthiasramahi.de` -> Payload `3000`
- `matthiasramahi.de` -> Astro `4321`

## Reverse Proxy Beispiel Caddy

```caddyfile
matthiasramahi.de {
  reverse_proxy 127.0.0.1:4321
}

cms.matthiasramahi.de {
  reverse_proxy 127.0.0.1:3000
}
```

## Postgres

Für Produktion:

- starkes Passwort,
- eigenes Volume,
- tägliche Dumps,
- Zugriff nur lokal oder über internes Docker-Netz.

Backup-Beispiel:

```bash
pg_dump "$DATABASE_URI" > "backups/payload-$(date +%F).sql"
```

Restore-Beispiel:

```bash
psql "$DATABASE_URI" < backups/payload-YYYY-MM-DD.sql
```

## Medien-Backups

Wenn lokale Uploads verwendet werden:

- Payload `media`-Ordner regelmäßig sichern.
- Backup zusammen mit Datenbankversion dokumentieren.

Wenn R2/Hetzner Object Storage verwendet wird:

- Bucket-Versionierung prüfen.
- Lifecycle-Regeln bewusst setzen.
- Zugangsschlüssel getrennt rotieren.

## Rebuild-Webhook

Payload ruft bei relevanten Änderungen `ASTRO_REBUILD_WEBHOOK_URL` auf. Der Receiver sollte:

1. Bearer-Token gegen `ASTRO_REBUILD_WEBHOOK_SECRET` prüfen.
2. Frontend-Repo aktualisieren.
3. `corepack pnpm install --frozen-lockfile` ausführen, falls nötig.
4. `corepack pnpm web:build` ausführen.
5. Astro-Prozess neu starten.

Kein Rebuild-Secret ins Repo schreiben.

## Systemd-Skizze

Payload:

```ini
[Service]
WorkingDirectory=/srv/matthias-ramahi
EnvironmentFile=/srv/matthias-ramahi/apps/cms/.env
ExecStart=/usr/bin/corepack pnpm cms:start
Restart=always
```

Astro:

```ini
[Service]
WorkingDirectory=/srv/matthias-ramahi
EnvironmentFile=/srv/matthias-ramahi/apps/web/.env
ExecStart=/usr/bin/node apps/web/dist/server/entry.mjs
Restart=always
```

Den genauen Astro-Startpfad nach dem ersten Produktionsbuild auf dem Server prüfen.

## Produktions-Checkliste

- [ ] `PAYLOAD_SECRET` stark und eindeutig.
- [ ] `PREVIEW_SECRET` stark und in CMS/Web identisch.
- [ ] `PAYLOAD_PREVIEW_API_KEY` nur im Web-Env.
- [ ] Postgres nicht öffentlich erreichbar.
- [ ] HTTPS aktiv.
- [ ] `PAYLOAD_PUBLIC_SERVER_URL` auf CMS-Domain gesetzt.
- [ ] `ASTRO_PUBLIC_SITE_URL` auf Live-Domain gesetzt.
- [ ] S3/R2 getestet oder lokaler Medienordner im Backup.
- [ ] Rebuild-Hook mit Secret abgesichert.
- [ ] Datenbank-Backup und Restore getestet.
- [ ] Medien-Backup getestet.
