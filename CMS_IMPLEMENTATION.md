# Astro + Payload CMS Implementation

Stand: 2026-05-27

Ergaenzung 2026-05-27: Editor-Hardening, Bildstrategie, Preview/SEO und Hetzner-Artefakte sind in `docs/CMS_EDITOR_HARDENING.md`, `docs/IMAGE_STRATEGY.md` und `docs/DEPLOYMENT_HETZNER.md` dokumentiert.

Dieses Repository enthält jetzt eine kontrollierte Astro/Payload-Migration. Die bestehenden statischen HTML-Dateien im Root bleiben unangetastet und dienen weiter als Referenz, bis das CMS-Modell stabil befüllt ist.

## Architektur

- Frontend: `apps/web` mit Astro 5 und `@astrojs/node` im `output: "server"`-Modus.
- CMS: `apps/cms` mit Payload 3, Next 15 und Postgres.
- Lokaler Schnellstart: Payload kann mit `PAYLOAD_DB=sqlite` ohne Docker in `apps/cms/payload-dev.db` laufen; Produktion/Staging bleiben auf Postgres.
- Datenbank lokal mit Postgres: `compose.cms.yml`.
- Medien: Payload Uploads lokal, optional S3-kompatibel über Cloudflare R2 oder Hetzner Object Storage.
- Preview: Payload erzeugt URLs auf Astro unter `/preview/<collection>/<slug>?secret=...`.
- Rebuild: Payload kann nach Änderungen `ASTRO_REBUILD_WEBHOOK_URL` aufrufen.

## Legacy-Parity in Astro

Die alte statische Website bleibt die visuelle Wahrheit. Astro rendert die alten `.html`-URLs inzwischen ueber eine kontrollierte Legacy-Komponentenschicht, damit Header, Footer, SEO, Asset-Pfade und spaeter CMS-Daten zentral steuerbar sind, ohne die Root-HTML-Dateien zu ueberschreiben.

- Die alten `.html`-Dateien im Projekt-Root werden nicht überschrieben.
- `apps/web/src/lib/legacy.ts` ordnet alte HTML-Dateien und Alias-Routen Astro zu.
- `apps/web/src/middleware.ts` rewritet alte Root-URLs wie `/leistungen.html` intern auf `/componentized/leistungen`; die sichtbare URL bleibt erhalten.
- `apps/web/src/components/legacy/LegacyPageShell.astro` rendert Head, Header, Hero/Footer-Komponenten und den noch nicht extrahierten Legacy-Body.
- `apps/web/src/components/legacy/LegacyPageShell.astro` fragt Payload standardmaessig nach `legacy.renderedBodyHtml`. Wenn ein CMS-Dokument vorhanden ist, ist Payload die aktive Content-Quelle; wenn Payload nicht erreichbar ist oder kein Dokument existiert, bleibt die Legacy-Datei der Fallback. Mit `ASTRO_DISABLE_LEGACY_CMS_LOOKUP=true` kann man den Datei-Fallback erzwingen.
- `apps/web/src/pages/legacy-baseline/` und `/legacy-baseline/<slug>` liefern die rohe Legacy-Seite nur als Dev-/Test-Baseline aus und normalisieren dafuer Asset-Pfade.
- `tools/sync-legacy-public.mjs` synchronisiert vorhandene Assets nach `apps/web/public`, damit Astro sie lokal und im Build ausliefern kann. Root-HTML-Dateien werden dabei nicht nach `apps/web/public` kopiert; alte generierte Public-HTML-Kopien werden entfernt, damit Astro-Middleware und componentized Rendering die alten URLs kontrollieren.
- `predev`, `prebuild` und `prepreview` in `apps/web/package.json` führen den Asset-Sync automatisch aus.
- Die synchronisierten Dateien in `apps/web/public/assets` und Root-Medien sind generierte lokale Kopien und werden nicht committed.
- `weitere-dienstleistungen.html` ist als Dublette konsolidiert und leitet per `308` auf `/leistungen.html` weiter.

Der nächste Migrationsschritt ist weiterhin nicht ein neues Design, sondern das schrittweise Nachbauen weiterer Body-Bereiche als echte Astro-Komponenten. Jede extrahierte Komponente wird gegen die Legacy-Baseline verglichen, bevor sie den jeweiligen Body-Abschnitt ersetzt.

Aktueller Parity-Startpunkt:

- `apps/web/src/data/legacyContent.ts` enthält echte Texte, Links, SEO-Snippets und Footer-/Navigation-Daten aus der bestehenden HTML-Seite.
- `apps/web/src/components/legacy/LegacyHeader.astro`, `LegacyHero.astro` und `LegacyFooter.astro` bilden die ersten extrahierten Astro-Komponenten mit den originalen CSS-Klassen.
- `apps/web/src/layouts/BaseLayout.astro` nutzt denselben Legacy-Header/Footer-Rahmen auch fuer CMS-native Astro-Seiten wie Journal, Portfolio, Services und Preview. Dadurch sehen CMS-Seiten nicht mehr wie ein zweites Designsystem aus.
- `http://localhost:4321/componentized/<slug>` rendert Legacy-Seiten mit extrahiertem Astro-Header/Footer und originaler Body-Struktur, z. B. `/componentized/portfolio`, `/componentized/blog-automotive-fotografie-duesseldorf`.
- `http://localhost:4321/componentized-home` leitet auf `/componentized/index` weiter.
- Die öffentlichen Legacy-URLs nutzen jetzt dieselbe componentized Render-Schicht; die rohe Ausgabe bleibt nur Baseline.
- `apps/web/scripts/visual-regression.mjs` vergleicht Startseite, Portfolio, Leistungen, About, Kontakt, Journal, einen Journal-Detailartikel, wichtige Service-Seiten und eine lokale SEO-Seite auf Desktop und Mobile. Diff-Bilder landen in `apps/web/.visual-regression`.
- `apps/web/scripts/legacy-route-audit.mjs` prueft alle Root-HTML-URLs auf Status 200, Titel, Header/Footer und kaputte Bilder.

Visual-Regression-Test:

```powershell
corepack pnpm --filter @matthias-ramahi/web exec playwright install chromium
corepack pnpm --filter @matthias-ramahi/web test:legacy-routes
corepack pnpm --filter @matthias-ramahi/web test:visual
```

Der Test nutzt aktuell eine 2%-Schwelle, weil Canvas, Lazy Images und Subpixel-Rendering minimale Abweichungen erzeugen. Neue Komponenten sollen diese Schwelle nicht erhöhen, sondern die Differenz weiter senken.

Aktueller QA-Stand vom 2026-05-27:

- `corepack pnpm web:test:legacy-routes`: 197/197 alte HTML-Routen geprueft.
- `corepack pnpm web:test:visual`: alle Desktop- und Mobile-Vergleiche unter 2% Abweichung; Home Desktop liegt nach Baseline-Korrektur bei 1,947%.
- `corepack pnpm cms:audit-readiness`: 0 fehlende Pflichtfelder. Importierte Inhalte bleiben als `seeded` markiert, bis sie redaktionell/visuell abgenommen sind.
- `corepack pnpm cms:build` und `corepack pnpm web:build`: erfolgreich.

## Lokales Setup

Schnellstart ohne Docker/Postgres, gut für den ersten lokalen Payload-Test:

```powershell
corepack enable
corepack pnpm install --frozen-lockfile
corepack pnpm local:start
```

Das Skript startet Payload auf `3000` und Astro auf `4321`. Falls `.env`-Dateien fehlen, werden lokale Dateien mit SQLite und zufälligen Secrets erzeugt. Bestehende `.env`-Dateien werden nicht überschrieben.

`local:start` bereinigt vor dem Payload-Dev-Start den generierten Next-Ordner `apps/cms/.next`. Dadurch kann ein vorheriger `cms:build` den lokalen Admin nicht mit stale Vendor-Chunks blockieren. Fuer SQLite setzt das Skript `PAYLOAD_DB_PUSH=true` nur beim ersten Start ohne vorhandene `payload-dev.db`; danach wird `PAYLOAD_DB_PUSH=false` verwendet, damit Payload bestehende Indizes nicht erneut anlegt.

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

Legacy-Globals in Payload seeden:

```powershell
corepack pnpm --filter @matthias-ramahi/cms seed:legacy
```

Der Seed befüllt Navigation, Website-Einstellungen, Footer, globale CTAs und die wichtigsten Standardseiten mit echten Texten aus der bestehenden HTML-Seite. SEO-Beschreibungen werden beim Seed auf die im CMS erlaubte Länge gekürzt, die Quelle bleibt in `legacyContent.ts` nachvollziehbar.

Legacy-HTML als kontrollierte Content-Basis in Payload importieren:

```powershell
corepack pnpm --filter @matthias-ramahi/cms import:legacy
```

Der Import liest die Root-HTML-Dateien, importiert referenzierte Bilder in `media` und befüllt Site Pages, Service Pages, Local SEO Pages, Portfolio-Kategorien/-Projekte und Journal-Beiträge. Journal-Detailseiten wie `blog-automotive-fotografie-duesseldorf.html` werden mit Coverbild, Tags, SEO, Related Links, Lesezeit und Content-Blöcken angelegt. Lokale SEO-Seiten bleiben standardmäßig Entwürfe, bis sie redaktionell geprüft sind.

Redaktions- und Produktionsreife auditieren:

```powershell
corepack pnpm cms:audit-readiness
```

Das Audit schreibt nichts in die Datenbank. Es unterscheidet zwischen Feld-Vollstaendigkeit und echter Produktionsreife. Produktionsbereit bedeutet: Pflichtfelder sind vorhanden, der Inhalt ist veroeffentlicht, und `legacy.migrationStatus` steht nicht mehr auf `seeded`, sondern auf `reviewed`, `componentized` oder `live`. Damit bleibt klar sichtbar, welche Inhalte nur importiert und welche wirklich redaktionell/visuell abgenommen sind.

## ENV-Variablen

`apps/cms/.env`

- `PAYLOAD_SECRET`: langer zufälliger Secret-Wert.
- `PAYLOAD_PUBLIC_SERVER_URL`: z. B. `http://localhost:3000`.
- `PAYLOAD_DB`: `sqlite` für den lokalen No-Docker-Test, sonst `postgres`.
- `PAYLOAD_DB_PUSH`: standardmaessig `false`. Nur fuer einen frischen lokalen Schema-Bootstrap kurz auf `true` setzen, danach wieder `false`.
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
- Astro `output: "hybrid"` auf `output: "server"` geändert; Astro 5 entfernt `hybrid`, Preview, Middleware-Rewrites und alte `.html`-URLs laufen damit sauber ueber den Node-Adapter.
- Payload Admin `searchParams` für Next/Payload korrekt typisiert.
- Payload `importMap` generiert und eingebunden.
- Payload Admin Root-Layout mit Payload-Providern und Server Functions eingebunden.
- Lokaler SQLite-Testmodus ergänzt, damit Payload ohne Docker/Postgres startbar ist.

Payload-Schema-Push ist nicht mehr implizit aktiv. Das verhindert lokale SQLite-Duplicate-Index-Fehler und ist naeher am Produktionsbetrieb mit kontrollierten Schema-Aenderungen.

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
5. Journal, inklusive echter Blog-Detailseiten.
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

- Importierte Inhalte redaktionell prüfen und den `legacy.migrationStatus` von `seeded` auf `reviewed`, `componentized` oder `live` setzen.
- Medienbestand weiter kuratieren: Alt-Texte, Captions, Featured-Auswahl, Mood/Tags und Verwendungszweck finalisieren.
- Weitere Legacy-Layouts aus dem Body in echte Astro-Komponenten zerlegen, sobald Visual Regression für den Seitentyp stabil grün ist.
- Optional: Rebuild-Hook auf dem Hetzner-Server aktivieren und einmal mit echtem Secret testen.
- Optional: strukturierte Daten pro Seitentyp weiter ausbauen.
