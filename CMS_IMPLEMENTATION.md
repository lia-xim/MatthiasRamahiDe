# Astro + Payload CMS Implementation

Stand: 2026-05-26

Dieses Repository enthält jetzt eine kontrollierte Astro/Payload-Migration. Die bestehenden statischen HTML-Dateien im Root bleiben unangetastet und dienen weiter als Referenz, bis das CMS-Modell stabil befüllt ist.

## Architektur

- Frontend: `apps/web` mit Astro 5 und `@astrojs/node`.
- CMS: `apps/cms` mit Payload 3, Next 15 und Postgres.
- Lokaler Schnellstart: Payload kann mit `PAYLOAD_DB=sqlite` ohne Docker in `apps/cms/payload-dev.db` laufen; Produktion/Staging bleiben auf Postgres.
- Datenbank lokal mit Postgres: `compose.cms.yml`.
- Medien: Payload Uploads lokal, optional S3-kompatibel über Cloudflare R2 oder Hetzner Object Storage.
- Preview: Payload erzeugt URLs auf Astro unter `/preview/<collection>/<slug>?secret=...`.
- Rebuild: Payload kann nach Änderungen `ASTRO_REBUILD_WEBHOOK_URL` aufrufen.

## Lokales Setup

Schnellstart ohne Docker/Postgres, gut für den ersten lokalen Payload-Test:

```powershell
corepack enable
corepack pnpm install --frozen-lockfile
corepack pnpm local:start
```

Das Skript startet Payload auf `3000` und Astro auf `4321`. Falls `.env`-Dateien fehlen, werden lokale Dateien mit SQLite und zufälligen Secrets erzeugt. Bestehende `.env`-Dateien werden nicht überschrieben.

Stoppen:

```powershell
corepack pnpm local:stop
```

Postgres-Variante, wenn Docker verfügbar ist:

```bash
corepack enable
corepack pnpm install --frozen-lockfile
docker compose -f compose.cms.yml up -d
cp apps/cms/.env.example apps/cms/.env
cp apps/web/.env.example apps/web/.env
corepack pnpm cms:dev
corepack pnpm web:dev
```

Danach öffnen:

- Payload Admin: `http://localhost:3000/admin`
- Astro Frontend: `http://localhost:4321`

Beim ersten Admin-Aufruf legt Payload den ersten User an. Danach im User-Profil einen API-Key erzeugen und den reinen Key-Wert in `apps/web/.env` als `PAYLOAD_PREVIEW_API_KEY` eintragen.

## ENV-Variablen

`apps/cms/.env`

- `PAYLOAD_SECRET`: langer zufälliger Secret-Wert.
- `PAYLOAD_PUBLIC_SERVER_URL`: z. B. `http://localhost:3000`.
- `PAYLOAD_DB`: `sqlite` für den lokalen No-Docker-Test, sonst `postgres`.
- `DATABASE_URI`: Postgres-Verbindung.
- `DATABASE_URL`: SQLite-Datei, z. B. `file:./payload-dev.db`, wenn `PAYLOAD_DB=sqlite`.
- `ASTRO_PREVIEW_URL`: z. B. `http://localhost:4321`.
- `ASTRO_PUBLIC_SITE_URL`: Live-URL für Canonicals.
- `PREVIEW_SECRET`: muss mit `apps/web` übereinstimmen.
- `ASTRO_REBUILD_WEBHOOK_URL`: optionaler Deploy-/Rebuild-Hook.
- `ASTRO_REBUILD_WEBHOOK_SECRET`: optionaler Bearer-Secret für den Hook.
- `S3_*`: optional für R2/Hetzner Object Storage.

`apps/web/.env`

- `ASTRO_PUBLIC_SITE_URL`
- `PAYLOAD_PUBLIC_SERVER_URL`
- `PREVIEW_SECRET`
- `PAYLOAD_PREVIEW_API_KEY`

Keine echten Secrets committen.

## Build-Status

Diese Checks wurden erfolgreich ausgeführt:

```bash
corepack pnpm --filter @matthias-ramahi/web build
corepack pnpm --filter @matthias-ramahi/cms build
```

Behobene Setup-Probleme:

- `@astrojs/check` ergänzt, weil `astro check` im Build-Skript verwendet wird.
- Astro `output: "hybrid"` auf `output: "static"` geändert; Astro 5 entfernt `hybrid`, die Kombination mit Node-Adapter und `prerender = false` Preview bleibt serverfähig.
- Payload Admin `searchParams` für Next/Payload korrekt typisiert.
- Payload `importMap` generiert und eingebunden.
- Payload Admin Root-Layout mit Payload-Providern und Server Functions eingebunden.
- Lokaler SQLite-Testmodus ergänzt, damit Payload ohne Docker/Postgres startbar ist.

## CMS-Modell

Collections:

- `media`: Bildbibliothek mit Vorschau, Alt-Text, Caption, Kategorie, Tags, Orientierung, Bildtyp, Bildstimmung, Verwendungszweck, Featured-Flag und responsiven Größen.
- `portfolio-projects`: Projekte mit Kategorie, Art Direction, Cover, Galerie, related Services, CTA und SEO.
- `portfolio-categories`: sortierbare Portfolio-Kapitel.
- `service-pages`: Leistungen mit Hero/Teaser, Proof Points, Zielgruppen, FAQ, related Pages, CTA und SEO.
- `local-seo-pages`: lokale Varianten mit Stadt, Leistung, kanonischer Hauptseite, Keyword-Hinweis, lokaler FAQ und Priorität.
- `journal-posts`: Beiträge mit Featured-Flag, Cover, Kategorie, Tags, Lesezeit, related Pages und SEO.
- `site-pages`: Home, About, Kontakt, Legal und generische Seiten.
- `users`: Admin-User mit API-Key-Unterstützung für Preview.

Globals:

- `navigation`: Header-Navigation, Fotografie-Unterseiten, Legal Links und Header-CTA.
- `site-settings`: Website-Name, Live-URL, SEO-Defaults, Owner, Kontakt und Standard-OG-Bild.
- `footer`: Statement, Kontakt, Footer-Links, Social Links und Legal Links.
- `global-ctas`: Standard-CTA und globales Kontaktmodul.

## Preview Testen

1. In `apps/cms/.env` und `apps/web/.env` denselben `PREVIEW_SECRET` setzen.
2. Payload Admin starten.
3. Astro Dev Server starten.
4. Einen Entwurf in `portfolio-projects`, `service-pages`, `journal-posts`, `local-seo-pages` oder `site-pages` öffnen.
5. Preview aufrufen.

Beispiel:

```text
http://localhost:4321/preview/portfolio-projects/mein-projekt?secret=...
```

Astro lädt Draft-Daten mit `draft=true` und API-Key. Preview-Seiten sind immer `noindex`.

## Inhalte Anlegen

Empfohlene Reihenfolge:

1. `site-settings`, `navigation`, `footer`, `global-ctas` pflegen.
2. Medien hochladen: Titel, Alt-Text, Caption, Orientierung, Mood, Tags und Verwendungszweck ausfüllen.
3. Portfolio-Kategorien anlegen.
4. Erste Portfolio-Projekte und Service-Seiten anlegen.
5. Home/About/Kontakt als `site-pages` anlegen.
6. Danach Journal und lokale SEO-Seiten.

## Bildstrategie

Payload erzeugt `thumb`, `mobile`, `card`, `hero` und `wide`. Astro nutzt `srcset`, `sizes`, Lazy Loading und feste Bilddimensionen, wenn Payload sie liefert. Lokale Payload-URLs werden im Frontend absolut auf `PAYLOAD_PUBLIC_SERVER_URL` aufgelöst; S3/R2-URLs bleiben unverändert.

Für Produktion empfohlen:

- S3-kompatibler Bucket für Medien.
- CDN davor, z. B. Cloudflare.
- Originale nicht direkt in Templates verwenden, sondern `card`, `hero` oder `wide`.
- Große Galerien kuratieren und paginieren, nicht als komplette Rohsammlung ausgeben.

## Migration

Nicht blind migrieren. Erst Modell befüllen und an 3-5 echten Seiten validieren. Details stehen in [Migrationsstrategie](docs/MIGRATION_STRATEGY.md).

Priorität:

1. Globals, Navigation, Footer, CTAs.
2. Home, Portfolio, Leistungen, About/Kontakt.
3. Haupt-Service-Seiten.
4. Portfolio-Projekte.
5. Journal.
6. Lokale SEO-Cluster.
7. Impressum/Datenschutz.

## Deployment

Hetzner-Hinweise stehen in [Deployment Hetzner](docs/DEPLOYMENT_HETZNER.md).

Kurzfassung:

- Postgres mit persistiertem Volume.
- Payload als Node/Next-Prozess oder Container.
- Astro als Node-Server, weil Preview-Routen SSR brauchen.
- Caddy oder Nginx als Reverse Proxy mit SSL.
- Backups für Postgres und Medien getrennt planen.
- Payload-Rebuild-Hook auf ein Deploy-Script oder CI/CD-Ziel zeigen lassen.

## Offene TODOs

- Echte Inhalte aus den bestehenden HTML-Seiten redaktionell in Payload übertragen.
- Medienbestand kuratieren und Alt-Texte finalisieren.
- Optional: automatisiertes Import-Script erst nach finaler Modellfreigabe.
- Optional: echte Rebuild-Webhook-Receiver/CI-Pipeline für Hetzner ergänzen.
- Optional: strukturierte Daten pro Seitentyp weiter ausbauen.
