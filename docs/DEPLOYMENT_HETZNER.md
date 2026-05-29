# Deployment: Payload auf Hetzner, Astro auf Vercel

Stand: 2026-05-29

Diese Notiz beschreibt den aktuellen Zielstand: Payload/Postgres laufen auf dem eigenen Hetzner-Server, das Astro-Frontend wird ueber Vercel ausgeliefert. Secrets bleiben ausserhalb des Repositories.

## Aktueller Teststand

- Payload CMS: Hetzner, Docker Compose, intern Port `3300`, aktuell technisch erreichbar unter `http://176.9.46.29:3300/admin/login`, Zieladresse `https://cms.matthiasramahi.de/admin/login`.
- Postgres: Docker-Volume im Payload-Compose-Stack, nicht nach aussen publiziert.
- Astro Web: Vercel-Projekt `matthias-ramahi`, aktueller Alias `https://matthias-ramahi.vercel.app`.
- Live-Domain: `matthiasramahi.de` bleibt als Canonical gesetzt, DNS wird spaeter umgestellt.
- Bestehende Serverdienste auf Hetzner bleiben unberuehrt. Der Payload-Stack nutzt nur den Projektordner `/home/contextter/matthias-ramahi` und den eigenen Docker-Compose-Namespace.

## Artefakte

- `deploy/compose.hetzner.yml`: Payload + Postgres fuer Hetzner.
- `deploy/production.env.example`: Vorlage fuer Server-Secrets.
- `deploy/Caddyfile.example`: alternative Caddy-Variante fuer `cms.matthiasramahi.de`.
- `deploy/nginx-payload-cms.conf`: Nginx-Reverse-Proxy fuer `cms.matthiasramahi.de` auf Payload.
- `deploy/backup-postgres-media.sh`: Datenbank- und Medienbackup.
- `vercel.json`: Vercel-Projektkonfiguration fuer Astro.
- `tools/run-vercel-build.mjs`: lokaler Vercel-Build mit Astro/Vercel-Adapter.
- `tools/copy-vercel-output.mjs`: kopiert `apps/web/.vercel/output` nach `.vercel/output`.

## Payload auf Hetzner

Server-ENV aus Vorlage kopieren und echte Werte nur auf dem Server setzen:

```bash
cp deploy/production.env.example deploy/production.env
```

Wichtige Werte:

- `PAYLOAD_SECRET`: stark und dauerhaft.
- `PREVIEW_SECRET`: identisch mit Vercel/Astro.
- `PAYLOAD_ADMIN_EMAIL`, `PAYLOAD_ADMIN_PASSWORD`, optional `PAYLOAD_ADMIN_API_KEY`.
- `DATABASE_URI`: Postgres-URI aus dem Compose-Stack.
- `PAYLOAD_PUBLIC_SERVER_URL`: `https://cms.matthiasramahi.de`.
- `PAYLOAD_BIND_ADDRESS`: nach aktivem Reverse Proxy `127.0.0.1`, fuer kurzfristige Porttests optional `0.0.0.0`.
- `RESEND_API_KEY`, `PAYLOAD_EMAIL_FROM_ADDRESS`, `PAYLOAD_EMAIL_FROM_NAME`.

Start/Aktualisierung:

```bash
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env up -d postgres cms
```

Migrationen und Admin:

```bash
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env run --rm cms pnpm --filter @matthias-ramahi/cms migrate
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env run --rm cms pnpm --filter @matthias-ramahi/cms ensure:admin
```

Audits:

```bash
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env run --rm cms pnpm --filter @matthias-ramahi/cms audit:readiness -- --strict
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env run --rm cms pnpm --filter @matthias-ramahi/cms audit:production -- --strict
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env run --rm cms pnpm --filter @matthias-ramahi/cms audit:seo -- --strict
```

## Astro auf Vercel

Projekt ist mit Vercel verlinkt. Produktions-ENV muss im Vercel-Projekt gesetzt sein:

- `ASTRO_PUBLIC_SITE_URL=https://matthiasramahi.de`
- `PAYLOAD_PUBLIC_SERVER_URL=https://cms.matthiasramahi.de`.
- `PREVIEW_SECRET`
- `PAYLOAD_PREVIEW_API_KEY`
- `ASTRO_ENABLE_ADOPTED_ROUTES=true`
- `ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES=true`
- `ASTRO_ENABLE_CMS_DYNAMIC_ROUTES=true`
- `ASTRO_ENABLE_CMS_JOURNAL_ROUTES=true`
- `ASTRO_ENABLE_CMS_SERVICE_ROUTES=true`
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `CONTACT_ALERT_EMAIL`
- `CONTACT_QUEUE_DIR=/tmp/matthias-contact-queue`
- `CONTACT_RETRY_SECRET`
- `CONTACT_IP_HASH_SALT`
- `PAYLOAD_FETCH_TIMEOUT_MS=3500`
- `PAYLOAD_FETCH_CACHE_MS=300000`

Build und Deploy:

```powershell
corepack pnpm vercel:build
npx vercel@latest deploy --prebuilt --prod --yes --archive=tgz --scope lia-xims-projects
```

Hinweis: Der lokale Node-24-Hinweis beim Build ist nicht kritisch; Vercel fuehrt Serverless Functions mit Node 22 aus.

## URL-Strategie

- Alte `.html`-URLs bleiben erreichbar und sind fuer SEO die primaere sichtbare URL.
- Alle 217 bisherigen Root-HTML-URLs werden als Astro-Routen gebaut; die Root-HTML-Dateien sind nur noch visuelle Referenz/Baseline, nicht Produktionsquelle.
- Adoptierte Kernseiten laufen ueber native Astro-Komponenten, Local-SEO-Seiten ueber den Family-Renderer, Journal-/Legal-Seiten ueber eigene strukturierte Renderer.
- Echte Dubletten redirecten kanonisch mit 308, z. B. `blog-journal.html` zu `/blog.html` oder `weitere-dienstleistungen.html` zu `/leistungen.html`.
- Konzeptseiten bleiben noindex Astro-Archivseiten, damit alte Links nicht brechen, aber keine SEO-Dubletten entstehen.
- Native neue Routen wie `/portfolio/<slug>` existieren fuer Portfolio-Projekte.
- Service- und Journal-Nativrouten duerfen auf die erhaltene `.html`-Canonical zurueckfuehren, damit keine Duplicate-Content-Struktur entsteht.

## CMS-Reverse-Proxy mit Nginx

DNS fuer `cms.matthiasramahi.de` zeigt bei Vercel DNS auf den Hetzner-Server:

```txt
cms  A  176.9.46.29
```

Auf dem Server laeuft bereits Nginx. Deshalb wird keine neue Proxy-Software installiert, sondern nur eine neue Site ergaenzt. Die vorbereitete Datei liegt unter `deploy/nginx-payload-cms.conf`.

Aktivierung auf dem Server:

```bash
cd /home/contextter/matthias-ramahi
bash deploy/activate-payload-nginx.sh
```

Das Skript fuehrt intern diese Schritte aus:

```bash
sudo cp deploy/nginx-payload-cms.conf /etc/nginx/sites-available/matthias-ramahi-cms.conf
sudo ln -s /etc/nginx/sites-available/matthias-ramahi-cms.conf /etc/nginx/sites-enabled/matthias-ramahi-cms.conf
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d cms.matthiasramahi.de
PAYLOAD_BIND_ADDRESS=127.0.0.1
PAYLOAD_PUBLIC_SERVER_URL=https://cms.matthiasramahi.de
```

Pruefung:

```bash
curl -I https://cms.matthiasramahi.de/admin/login
curl -I http://127.0.0.1:3300/admin/login
```

## Rebuild bei CMS-Aenderungen

Payload kann `ASTRO_REBUILD_WEBHOOK_URL` aufrufen. Fuer Vercel ist langfristig ein Vercel Deploy Hook sinnvoll. Sobald Git/Vercel sauber verbunden ist:

1. Deploy Hook fuer den Produktionsbranch in Vercel erzeugen.
2. Hook-URL als `ASTRO_REBUILD_WEBHOOK_URL` im Payload-Server setzen.
3. Optional `ASTRO_REBUILD_WEBHOOK_SECRET` nutzen, falls ein eigener Proxy/Receiver davor sitzt.

Bis dahin gilt: Nach groesseren CMS-Aenderungen manuell `corepack pnpm vercel:build` und `vercel deploy --prebuilt --prod` ausfuehren.

## Backup

Datenbank:

```bash
DATABASE_URI="postgres://..." BACKUP_ROOT="/srv/backups/matthias-ramahi" ./deploy/backup-postgres-media.sh
```

Medien:

- Aktuell liegen Medien lokal im Payload-Volume.
- Dieses Volume muss zusammen mit Postgres gesichert werden.
- Vor R2/Hetzner Object Storage erst die Media-URL-Strategie und Backups festziehen.

## Production Checklist

- [x] Payload-Compose auf Hetzner laeuft.
- [x] Postgres-Migrationen sind angewendet.
- [x] Admin-User/API-Key ist erzeugt.
- [x] Resend ist in Payload und Vercel als ENV gesetzt.
- [x] Vercel Production Deploy ist erstellt.
- [x] CMS-Readiness-, Production- und SEO-Audits laufen ohne Fehler/Warnungen.
- [x] Legacy-HTML-Routen antworten auf Vercel.
- [x] Preview-Route antwortet mit `noindex`.
- [x] DNS fuer `cms.matthiasramahi.de` auf Hetzner zeigen lassen.
- [ ] Reverse Proxy fuer CMS-Domain aktivieren, ohne bestehende Serverdienste zu stoeren.
- [ ] Vercel-Domain `matthiasramahi.de` final verbinden.
- [ ] Deploy Hook fuer automatische Rebuilds nach CMS-Aenderungen einrichten.
- [ ] Backup/Restore mindestens einmal praktisch testen.
