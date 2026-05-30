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
- `deploy/deploy-cms-hetzner.sh`: sicherer Server-Deploy fuer GitHub Actions oder manuelle SSH-Ausfuehrung.
- `.github/workflows/deploy-cms-hetzner.yml`: automatischer CMS-Deploy nach `main`-Push.
- `tools/assert-cms-deploy-data-safe.mjs`: Guard gegen Seeds, Imports und Content-schreibende Migrationen im Deploy-Pfad.
- `vercel.json`: Vercel-Projektkonfiguration fuer Astro.
- `tools/run-vercel-build.mjs`: lokaler Vercel-Build mit Astro/Vercel-Adapter.
- `tools/copy-vercel-output.mjs`: kopiert `apps/web/.vercel/output` nach `.vercel/output`.
- `.nvmrc` und `.node-version`: lokale Runtime-Pins auf Node 22 passend zu `package.json` und den Dockerfiles.

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
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env up -d --build postgres cms
```

Bei CMS-Code- oder Schema-Aenderungen ist die sichere Reihenfolge:

```bash
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env build cms
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env up -d postgres
BACKUP_DIR="backups/cms/manual-$(date -u +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env exec -T postgres pg_dump -U payload -d payload | gzip -c > "$BACKUP_DIR/payload.sql.gz"
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env run --rm cms pnpm --filter @matthias-ramahi/cms migrate
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env up -d cms
```

Fuer echte Deployments bevorzugt `bash deploy/deploy-cms-hetzner.sh`: Das Script erstellt vor jeder produktiven Migration automatisch ein Backup unter `backups/cms/<timestamp>`.

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

## Automatischer CMS-Deploy via GitHub Actions

Der Workflow `.github/workflows/deploy-cms-hetzner.yml` deployed Payload automatisch auf Hetzner, wenn relevante CMS-/Deploy-Dateien nach `main` gepusht werden. Vercel deployed das Astro-Frontend weiter ueber die Vercel-GitHub-Integration. Beide Deployments laufen damit vom gleichen GitHub-Push los, bleiben aber sauber getrennte Ziele.

Content-Sicherheit: Der automatische Deploy fuehrt keine Seeds, keine Legacy-Imports, keinen lokalen Schema-Push und keine Admin-User-Synchronisation aus. Er baut den CMS-Code, startet Postgres, erstellt ein Backup und laesst nur Payload-Migrationen laufen. Migrationen duerfen im Deploy-Pfad nur technische Schema-Aenderungen enthalten; Content-schreibende `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `DROP TABLE` oder Payload-Write-Calls werden durch `corepack pnpm cms:deploy-data-safe` im Workflow blockiert.

GitHub-Secrets fuer das Repository:

- `HETZNER_HOST`: Server-IP oder Hostname, z. B. `176.9.46.29`.
- `HETZNER_USER`: SSH-User auf dem Server, z. B. `contextter`.
- `HETZNER_SSH_KEY`: privater Deploy-Key fuer diesen User.
- `HETZNER_PORT`: optional, default `22`.
- `HETZNER_DEPLOY_PATH`: optional, default `/home/contextter/matthias-ramahi`.
- `CMS_HEALTH_URL`: optional, default `http://127.0.0.1:3300/admin/login`.
- `CMS_AUDIT_DATABASE_URI`: optional, nur wenn der GitHub-Runner die Audit-Datenbank direkt erreichen kann.
- `CMS_AUDIT_PAYLOAD_SECRET`: optional, Secret fuer die direkten CMS-Daten-Audits in GitHub Actions.

Empfohlener SSH-Key auf dem Server:

```bash
ssh-keygen -t ed25519 -C github-cms-deploy -f ~/.ssh/github-cms-deploy
cat ~/.ssh/github-cms-deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github-cms-deploy
```

Nur der private Key aus dem letzten Befehl kommt als `HETZNER_SSH_KEY` in GitHub Secrets. `deploy/production.env` bleibt ausschliesslich auf dem Hetzner-Server und ist per `.gitignore` ausgeschlossen.

Der Deploy-Ablauf auf dem Server ist bewusst konservativ:

```bash
cd /home/contextter/matthias-ramahi
git fetch --prune origin main
git pull --ff-only origin main
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env build cms
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env up -d postgres
# deploy/deploy-cms-hetzner.sh schreibt hier automatisch ein Backup nach backups/cms/<timestamp>
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env run --rm cms pnpm --filter @matthias-ramahi/cms migrate
docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env up -d cms
curl -I http://127.0.0.1:3300/admin/login
```

Das Script bricht ab, wenn auf dem Server getrackte lokale Aenderungen liegen. Dadurch wird nie still etwas ueberschrieben. Ungetrackte Server-Dateien wie `deploy/production.env` bleiben erlaubt.

Wichtig: CMS-Inhalte sind Datenbankdaten, nicht Git-Dateien. Lokale oder produktive redaktionelle Aenderungen werden durch einen Code-Deploy nicht aus dem Repository ueberschrieben. Wenn neue technische Felder gebraucht werden, wird dafuer eine Schema-Migration geschrieben; Seed-/Import-/Admin-Scripts bleiben manuelle Einmalaktionen und duerfen nicht in den automatischen Deploy.

Manueller Test auf dem Server:

```bash
cd /home/contextter/matthias-ramahi
bash deploy/deploy-cms-hetzner.sh
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

Hinweis: Das Repository ist auf Node 22 gepinnt (`package.json`, `.nvmrc`, `.node-version`, Dockerfiles). Falls lokal noch Node 24 aktiv ist, erzeugt `pnpm` Engine-Warnungen; fuer Release-Checks und manuelle Vercel-Builds sollte die Shell auf Node 22 wechseln. Vercel richtet sich nach der `engines.node`-Angabe.

### Live-CMS-Seiten

Die Startseite wird als Server-Route auf Vercel gerendert und liest die Payload-Daten live vom Hetzner-CMS. Dadurch brauchen reine Inhalts- und Bildwechsel im CMS keinen neuen Vercel-Deploy mehr. Code-, Layout- und Template-Aenderungen bleiben weiterhin Vercel-Deployments.

Relevante Vercel-ENV:

```bash
ASTRO_LIVE_CMS_CACHE_MS=30000
ASTRO_LIVE_PAGE_CACHE_SECONDS=60
ASTRO_LIVE_PAGE_STALE_SECONDS=300
```

- `ASTRO_LIVE_CMS_CACHE_MS`: kurzer Runtime-Cache fuer Payload-API-Antworten innerhalb der Vercel Function.
- `ASTRO_LIVE_PAGE_CACHE_SECONDS`: Edge-/CDN-Zeit, nach der die HTML-Seite erneut aus Payload gerendert werden darf.
- `ASTRO_LIVE_PAGE_STALE_SECONDS`: alte HTML-Version darf kurz weiter ausgeliefert werden, waehrend Vercel im Hintergrund aktualisiert.

Fuer sofortiges Testen kann `ASTRO_LIVE_PAGE_CACHE_SECONDS=0` gesetzt werden. Fuer Produktion ist ein kurzer Cache sinnvoller, weil er Payload schuetzt und die Seite schnell haelt.

Wichtig fuer neue CMS-Felder: Reine Inhalts- und Bildwechsel passieren danach live im Payload-Admin. Wenn aber das Datenmodell selbst erweitert wird, z. B. ein neuer Startseiten-`Hero-Slider`, muss zuerst Payload auf Hetzner mit der passenden Migration aktualisiert werden. Danach muss das Astro-Frontend auf Vercel deployed werden, damit es die neuen Felder ausliest.

Startseiten-Hero pflegen:

1. Payload oeffnen: `Standardseiten` -> `Startseite`.
2. Tab `Hero` oeffnen.
3. Im `Hero-Slider` Slides hinzufuegen, sortieren oder entfernen.
4. Pro Slide `Slide-Bild`, `Titel Zeile 1`, optional `Titel Zeile 2`, `Kurztext` und Button-Ziele setzen.
5. Speichern/veroeffentlichen. Die Startseite aktualisiert sich danach innerhalb der Live-Cache-Zeit.

Das Feld `Bilder` -> `Hero-Bild` bleibt ein einzelnes Seitenbild fuer Fallbacks, Social/SEO-Defaults und klassische Seitentemplates. Die Startseiten-Slideshow wird nicht mehr dort gepflegt.

## URL-Strategie

- Alte `.html`-URLs bleiben erreichbar und sind fuer SEO die primaere sichtbare URL.
- Alle 217 bisherigen `.html`-URLs werden als Astro-Routen gebaut; die alten HTML-Dateien liegen nur noch unter `legacy-reference/html` als visuelle Referenz/Baseline, nicht als Produktionsquelle.
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
- [x] GitHub-Actions-Workflow fuer automatischen CMS-Deploy ist vorbereitet.
- [ ] Reverse Proxy fuer CMS-Domain aktivieren, ohne bestehende Serverdienste zu stoeren.
- [ ] Vercel-Domain `matthiasramahi.de` final verbinden.
- [ ] GitHub-Secrets fuer Hetzner-Deploy im Repository eintragen.
- [ ] Ersten GitHub-Actions-CMS-Deploy manuell via `workflow_dispatch` testen.
- [ ] Deploy Hook fuer automatische Vercel-Rebuilds nach CMS-Aenderungen einrichten.
- [ ] Backup/Restore mindestens einmal praktisch testen.
