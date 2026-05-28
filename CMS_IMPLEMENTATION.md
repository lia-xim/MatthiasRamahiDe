# Astro + Payload CMS Implementation

Stand: 2026-05-28

Dieses Repository enthaelt eine kontrollierte Astro/Payload-Migration fuer die bestehende Fotografie-Website. Die Root-HTML-Dateien bleiben unangetastet und dienen als visuelle Referenz, bis die jeweilige Seite in Astro/Payload abgenommen ist.

Ergaenzende Detaildokumente:

- `docs/MIGRATION_STRATEGY.md`
- `docs/LEGACY_REFERENCE_FREEZE.md`
- `docs/CMS_EDITOR_HARDENING.md`
- `docs/IMAGE_STRATEGY.md`
- `docs/DEPLOYMENT_HETZNER.md`

## Architektur

- Frontend: `apps/web` mit Astro 5. Lokal/Server kann `@astrojs/node` genutzt werden, fuer Vercel wird per `ASTRO_ADAPTER=vercel` der Vercel-Adapter aktiviert.
- CMS: `apps/cms` mit Payload 3, Next 15 und Postgres.
- Lokaler Schnellstart: Payload kann mit `PAYLOAD_DB=sqlite` ohne Docker in `apps/cms/payload-dev.db` laufen.
- Produktion/Staging: Payload + Postgres laufen per `deploy/compose.hetzner.yml` auf Hetzner; Astro Web ist fuer Vercel vorbereitet und aktuell als Vercel-Production-Deploy getestet.
- Medien: Payload Uploads lokal; S3-kompatibler Speicher wie Cloudflare R2 oder Hetzner Object Storage ist vorbereitet.
- Preview: Payload erzeugt Astro-Preview-URLs unter `/preview/<collection>/<slug>?secret=...`.
- Rebuild: Payload kann nach Aenderungen `ASTRO_REBUILD_WEBHOOK_URL` aufrufen.

## Legacy-Parity und Adoption

Die aktuelle HTML-Website ist die visuelle Wahrheit. Ziel ist nicht, alle HTML-Dateien direkt zu loeschen, sondern Seite fuer Seite die sichtbare Ausgabe in Astro/Payload zu uebernehmen.

- `corepack pnpm legacy:freeze` schreibt `docs/legacy-reference-manifest.json` mit Checksummen, Titel, Description, H1, Canonical, Dateigroesse und Seitentyp der Root-HTML-Dateien.
- `apps/web/src/lib/legacy.ts` ordnet alte HTML-Dateien und Alias-Routen Astro zu.
- `apps/web/src/lib/adoptedRoutes.ts` definiert, welche Legacy-URLs bereits vom Astro/Payload-Pfad uebernommen sind.
- `apps/web/src/middleware.ts` rewritet adoptierte `.html`-URLs im lokalen/serverseitigen Betrieb intern auf `/native/<slug>`, ohne die sichtbare URL zu aendern.
- `apps/web/src/pages/native/[slug].astro` rendert adoptierte URLs mit `LegacyPageShell`.
- `apps/web/src/pages/[slug].html.astro` baut jede alte `.html`-URL als echte Astro-Route. Adoptierte Seiten rendern mit `LegacyPageShell` aus Payload, nicht adoptierte Seiten bleiben rohe Legacy-Fallbacks. Das ist wichtig fuer Vercel, weil dort Middleware-Rewrites fuer nicht existierende statische `.html`-Dateien nicht ausreichen.
- Nicht adoptierte `.html`-Seiten bleiben als statischer Legacy-Fallback erreichbar.
- `/legacy-baseline/<slug>` liefert die rohe Legacy-Ausgabe nur als Test-Baseline.
- Root-HTML-Dateien werden nicht nach `apps/web/public` kopiert.

Aktuell adoptierte oeffentliche URLs:

- `fotografie.html`
- `automobil-fotografie.html`
- `sportwagen-fotografie.html`
- `oldtimer-fotografie.html`
- `motorrad-fotografie.html`
- `portraitfotografie.html`
- `landschaftsfotografie.html`
- `portfolio.html`
- `leistungen.html`
- `contact.html`
- `ueber-mich.html`
- `blog.html`
- `impressum.html`
- `datenschutz.html`
- sieben weitere Service-Seiten: `fotolabor-druck-duesseldorf.html`, `grossformatdruck-duesseldorf.html`, `werbetechnik-duesseldorf.html`, `webdesign-seo-duesseldorf.html`, `videografie-duesseldorf.html`, `viola-musik-duesseldorf.html`, `drucke-sonderanfertigungen-duesseldorf.html`
- die sieben aktuellen `blog-*.html` Journal-Detailseiten

Diese Seiten beziehen ihre Content-Basis aus Payload, wenn ein passendes Dokument mit `legacy.renderedBodyHtml` existiert. Wenn Payload nicht erreichbar ist oder kein Dokument vorhanden ist, bleibt die Root-HTML-Datei als Fallback verfuegbar. Mit `ASTRO_DISABLE_LEGACY_CMS_LOOKUP=true` kann der Datei-Fallback erzwungen werden.

### Native-Komponenten-Stand

Die Migration ist inzwischen zweigleisig:

- Native Astro-Komponenten mit Legacy-Optik: Startseite, `fotografie.html`, `automobil-fotografie.html`, `sportwagen-fotografie.html`, `oldtimer-fotografie.html`, `portfolio.html`, `leistungen.html`, sieben weitere Service-Seiten inklusive Fotolabor sowie `blog.html`; der Journal-Index nutzt veroeffentlichte `journal-posts` aus Payload, wenn sie erreichbar sind, und faellt sonst auf die eingefrorene Referenzliste zurueck.
- CMS-native strukturierte Templates: neue/dynamische Service-Seiten, Portfolio-Projekte, Journal-Beitraege unter `/journal/<slug>` und Local-SEO-Seiten ohne alte HTML-Datei.
- Bewusste Parity-Schicht: Motorrad, Portrait und Landschaft als verbleibende Haupt-Fotografie-Detailseiten, About, Kontakt, Legal, sieben bestehende `blog-*.html` Detailseiten und die alten Local-SEO-HTML-Seiten bleiben 1:1 ueber die Legacy-Schicht, bis ihr Body wirklich als natives Template abgenommen ist.

Local-SEO kann kontrolliert auf das neue native Template umgelegt werden:

```powershell
ASTRO_ENABLE_NATIVE_LOCAL_SEO_HTML_ROUTES=true
```

Dieser Schalter ist absichtlich getrennt von `ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES`, damit die aktuell visuell freigegebene Legacy-Parity fuer alte `.html`-URLs nicht versehentlich durch ein neues Template ersetzt wird.

## Lokales Setup

Schnellstart ohne Docker/Postgres:

```powershell
corepack enable
corepack pnpm install --frozen-lockfile
corepack pnpm local:start
```

Das Skript startet Payload auf `http://localhost:3000/admin` und Astro auf `http://localhost:4321`. Falls `.env`-Dateien fehlen, werden lokale Dateien mit SQLite und zufaelligen Secrets erzeugt. Bestehende `.env`-Dateien werden nicht ueberschrieben.

Stoppen:

```powershell
corepack pnpm local:stop
```

Wichtig fuer Builds: `cms:build` schreibt in `apps/cms/.next`. Wenn der Payload-Dev-Server parallel laeuft, kann der Admin danach ohne CSS/Assets erscheinen. Deshalb blockiert `cms:build` lokal, sobald auf Port 3000 ein Server laeuft. `production:check` startet ausserdem eine eigene Astro-Preview aus dem frisch gebauten `dist`-Ordner und erwartet deshalb freie Ports. Vor Release-Checks:

```powershell
corepack pnpm local:stop
corepack pnpm production:check
corepack pnpm local:start
```

Postgres-Variante:

```powershell
docker compose -f compose.cms.yml up -d
corepack pnpm cms:dev
corepack pnpm web:dev
```

Wenn die lokale SQLite-Datei aelter ist als das aktuelle Payload-Schema:

```powershell
corepack pnpm cms:schema-push-local
```

Der Befehl ist absichtlich nur fuer `PAYLOAD_DB=sqlite` erlaubt. Fuer Postgres/Staging/Produktion werden echte Payload-Migrationen verwendet.

## Content-Import

Globals seeden:

```powershell
corepack pnpm --filter @matthias-ramahi/cms seed:legacy
```

Nur die aktuell adoptierten Kernseiten importieren:

```powershell
corepack pnpm cms:import-adopted
```

Das ist der bevorzugte Befehl fuer die laufende Migration, weil er nur die Seitenfamilie aktualisiert, die bereits ueber Astro/Payload aktiviert ist.

Vollimport fuer Staging/Audit:

```powershell
corepack pnpm --filter @matthias-ramahi/cms import:legacy
```

Der Vollimport liest die Root-HTML-Dateien, importiert referenzierte Bilder in `media` und befuellt Site Pages, Service Pages, Local SEO Pages, Portfolio-Kategorien/-Projekte und Journal-Beitraege. Lokale SEO-Seiten bleiben standardmaessig Entwuerfe, bis sie redaktionell geprueft sind.

Der Import speichert fuer adoptierte Standardseiten, Service-Seiten und lokale SEO-Seiten zusaetzlich strukturierte `blocks` aus Ueberschriften, Textabschnitten und Figuren. Die 1:1-Ausgabe nutzt weiterhin `legacy.renderedBodyHtml`, bis die jeweilige Seite visuell freigegeben ist; die strukturierten Felder sind die vorbereitete Grundlage fuer native Astro-Komponenten.

Redaktions- und Produktionsreife auditieren:

```powershell
corepack pnpm cms:audit-readiness
corepack pnpm cms:audit-production -- --strict
corepack pnpm cms:audit-seo -- --strict
```

Produktionsbereit bedeutet: Pflichtfelder sind vorhanden, der Inhalt ist veroeffentlicht, und `legacy.migrationStatus` steht nicht mehr auf `seeded`, sondern auf `reviewed`, `componentized` oder `live`.

Aktive Kernseiten bewusst als visuell/release-geprueft markieren:

```powershell
corepack pnpm cms:review-adopted -- --write
corepack pnpm cms:harden-seo
corepack pnpm cms:sanitize-studio-language
```

`cms:review-adopted` setzt nur die definierte Produktionsgruppe aus Home, Fotografie-Uebersicht, sechs Haupt-Fotografie-Seiten, Portfolio, Leistungen, Kontakt, Ueber mich, Journal-Uebersicht, Legal-Seiten, weiteren Service-Seiten und sieben Journal-Detailseiten auf `reviewed`. Wenn ein Dokument, Pflichtfeld oder die alte Quelldatei nicht passt, wird blockiert statt stillschweigend freigegeben. `cms:harden-seo` staerkt gezielt kurze SEO-Basisdaten fuer Portfolio, Portfolio-Kategorien und zentrale Uebersichts-/Legal-Seiten. `cms:sanitize-studio-language` bereinigt alte Studio-Sprache in Globals und importierten Dokumenten; der Production-Audit prueft diese Inhalte ebenfalls.

Private-Staging-Freigabe fuer kuratierte Draft-Gruppen:

```powershell
corepack pnpm cms:approve-private-staging -- --collection=local-seo-pages
corepack pnpm cms:approve-private-staging -- --collection=local-seo-pages --write
```

Der erste Befehl ist ein Dry-Run. Mit `--write` werden nur Dokumente veroeffentlicht, die alle Pflichtfelder, SEO-Basisdaten, Slug, Alt-Text-Pflichten und Legacy-/Render-Metadaten erfuellen. Fuer das aktuelle private Staging wurden die Local-SEO-Seiten bewusst massenhaft freigegeben, weil die Sichtbarkeit serverseitig eingeschraenkt ist und die Inhalte danach online redaktionell nachgeprueft werden koennen.

## ENV-Variablen

`apps/cms/.env`

- `PAYLOAD_SECRET`
- `PAYLOAD_PUBLIC_SERVER_URL`
- `PAYLOAD_DB`
- `PAYLOAD_DB_PUSH`
- `DATABASE_URI`
- `DATABASE_URL`
- `ASTRO_PREVIEW_URL`
- `ASTRO_PUBLIC_SITE_URL`
- `PREVIEW_SECRET`
- `ASTRO_REBUILD_WEBHOOK_URL`
- `ASTRO_REBUILD_WEBHOOK_SECRET`
- `S3_*`

`apps/web/.env`

- `ASTRO_PUBLIC_SITE_URL`
- `PAYLOAD_PUBLIC_SERVER_URL`
- `PREVIEW_SECRET`
- `PAYLOAD_PREVIEW_API_KEY`
- `ASTRO_ENABLE_ADOPTED_ROUTES`: optional, Standard ist aktiv. Auf `false` setzen, wenn adoptierte `.html`-URLs temporaer wieder als statischer Legacy-Fallback gebaut werden sollen.
- `ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES`: Fuer private Staging-Deployments aktuell `true`. Auf `false` setzen, wenn lokale SEO-Seiten temporaer wieder als statischer Legacy-Fallback laufen sollen.
- `ASTRO_ENABLE_NATIVE_LOCAL_SEO_HTML_ROUTES`: optionaler Opt-in-Schalter, um alte Local-SEO-`.html`-URLs direkt mit dem neuen strukturierten Local-SEO-Template zu rendern.
- `ASTRO_ENABLE_CMS_DYNAMIC_ROUTES`: Standard aktiv. Erlaubt neuen Payload-Seiten ohne alte `.html`-Datei, strukturiert in Astro zu rendern.
- `ASTRO_ENABLE_CMS_JOURNAL_ROUTES`: aktiviert native `/journal/<slug>`-Builds.
- `ASTRO_ENABLE_CMS_SERVICE_ROUTES`: aktiviert native `/services/<slug>`-Routen; Canonical kann weiterhin auf die alte `.html`-URL zeigen.
- `PAYLOAD_FETCH_TIMEOUT_MS` und `PAYLOAD_FETCH_CACHE_MS`: steuern Payload-Fetches im Astro-Frontend.
- `RESEND_API_KEY`, `CONTACT_*`: Kontaktformular-Versand via Resend; in Vercel als Production ENV setzen.

Keine echten Secrets committen.

## CMS-Modell

Collections:

- `media`: Bildbibliothek mit Vorschau, Alt-Text, Caption, Kategorie, Tags, Orientierung, Bildtyp, Bildstimmung, Verwendungszweck, Featured-Flag und responsiven Groessen.
- `portfolio-projects`: Projekte mit Kategorie, Art Direction, Cover, Galerie, related Services, CTA und SEO.
- `portfolio-categories`: sortierbare Portfolio-Kapitel.
- `service-pages`: Leistungen mit Hero/Teaser, Proof Points, Zielgruppen, FAQ, related Pages, CTA und SEO.
- `local-seo-pages`: lokale Varianten mit Stadt, Leistung, kanonischer Hauptseite, Keyword-Hinweis, lokaler FAQ und Prioritaet.
- `journal-posts`: Beitraege mit Featured-Flag, Cover, Kategorie, Tags, Lesezeit, related Pages und SEO.
- `site-pages`: Home, Fotografie-Uebersicht, About, Kontakt, Legal und generische Seiten.
- `users`: Admin-User mit API-Key-Unterstuetzung fuer Preview.

Globals:

- `navigation`: Header-Navigation, Fotografie-Menue, Legal Links und Header-CTA.
- `site-settings`: Website-Name, Live-URL, SEO-Defaults, Owner, Kontakt und Standard-OG-Bild.
- `footer`: Statement, Kontakt, Footer-Links, Social Links und Legal Links.
- `global-ctas`: Standard-CTA und globales Kontaktmodul.

## Preview

1. In `apps/cms/.env` und `apps/web/.env` denselben `PREVIEW_SECRET` setzen.
2. Payload Admin starten.
3. Astro Dev Server starten.
4. Einen Entwurf in `portfolio-projects`, `service-pages`, `journal-posts`, `local-seo-pages` oder `site-pages` oeffnen.
5. Preview aufrufen.

Beispiel:

```text
http://localhost:4321/preview/portfolio-projects/mein-projekt?secret=...
```

Astro laedt Draft-Daten mit `draft=true` und API-Key. Preview-Seiten sind immer `noindex`. Neue CMS-Seiten ohne Legacy-Datei laufen ueber den generischen strukturierten Astro-Renderpfad; adoptierte Kernseiten bleiben visuell 1:1 ueber `LegacyPageShell`, solange ihre native Zerlegung noch nicht final abgenommen ist.

## Bildstrategie

Payload erzeugt `thumb`, `mobile`, `card`, `hero` und `wide`. Astro nutzt `srcset`, `sizes`, Lazy Loading und feste Bilddimensionen, wenn Payload sie liefert. Lokale Payload-URLs werden im Frontend absolut auf `PAYLOAD_PUBLIC_SERVER_URL` aufgeloest; S3/R2-URLs bleiben unveraendert.

Fuer Produktion:

- S3-kompatibler Bucket fuer Medien.
- CDN davor, z. B. Cloudflare.
- Originale nicht direkt in Templates verwenden, sondern `card`, `hero` oder `wide`.
- Grosse Galerien kuratieren und paginieren.

## QA-Stand

Zuletzt erfolgreich:

```powershell
corepack pnpm web:build
corepack pnpm cms:build
corepack pnpm cms:import-adopted
```

Aktueller Stand vom 2026-05-28:

- `web:build`: erfolgreich, inklusive `astro check` mit 0 Fehlern und 0 Warnungen.
- `cms:build`: erfolgreich.
- `cms:import-adopted`: erfolgreich, 29 adoptierte HTML-Dateien als aktuelle Content-Basis gescannt.
- `cms:review-adopted -- --write`: erfolgreich, 29 aktive Seiten stehen jetzt auf `reviewed`.
- `cms:review-portfolio`: erfolgreich, 6 Portfolio-Projekte und 6 Portfolio-Kategorien stehen auf `reviewed` / `structured-blocks`.
- `cms:audit-production -- --strict`: erfolgreich, 0 Errors und 0 Warnings.
- `cms:audit-seo -- --strict`: erfolgreich, 0 Errors und 0 Warnings.
- `production:check`: erfolgreich, inklusive Web-Build, CMS-Build, eigener Astro-Preview, 204/204 Legacy-Routen und Visual Regression.
- `cms:approve-private-staging -- --collection=local-seo-pages --write`: erfolgreich, 157 lokale SEO-Seiten fuer private Staging-Abnahme veroeffentlicht.
- `web:build` nach nativer Journal-Artikelkomponente und Local-SEO-Template-Gate: erfolgreich, `astro check` mit 0 Errors / 0 Warnings.
- `web:build` nach nativer Automobil-, Sportwagen- und Oldtimer-Body-Komponente: erfolgreich, `astro check` mit 0 Errors / 0 Warnings.
- Visual Regression 2026-05-29: `automotive-main` Desktop 1.985%, Mobile 1.705%; `sportscar-main` Desktop 1.779%, Mobile 0.008%; `oldtimer-main` Desktop 0.003%, Mobile 0.010%.
- Browser-Smoke 2026-05-29: `automobil-fotografie.html`, `sportwagen-fotografie.html` und `oldtimer-fotografie.html` laden sinnvollen Inhalt, Lightbox-Interaktion funktioniert, keine Console Errors/Warnings.
- Zielgerichtete Visual Regression nach der letzten Template-Aenderung: Portfolio, Leistungen, Journal-Index, Automotive-Journal-Detail und Local-SEO bleiben unter der harten 5%-Grenze; Local-SEO mobile bleibt wegen langer Legacy-Lazyload-Strecken eine dokumentierte Warnung.

Weitere QA-Befehle:

```powershell
corepack pnpm --filter @matthias-ramahi/web exec playwright install chromium
corepack pnpm production:check
corepack pnpm web:test:legacy-routes
corepack pnpm web:test:visual
corepack pnpm cms:audit-readiness
corepack pnpm cms:audit-production -- --strict
```

Aktueller Release-Audit nach der letzten Haertung:

- 29/29 aktive Produktionsseiten sind `published` und `reviewed`.
- Medienbibliothek: 104/104 ohne Audit-Fehler.
- Lokale SEO-Seiten: 157/157 `published` und `reviewed` fuer private Staging-Abnahme.
- Published Release-Dokumente gesamt: 198.
- Production-Audit: 0 Errors, 0 Warnings.

`web:test:visual` nutzt ein zweistufiges Modell: 2% ist das Ziel und erzeugt Warnungen, 5% ist die harte Fail-Grenze. Das ist noetig, weil einige Legacy-Seiten dynamische JS-/Lazyload-Bildstrecken enthalten, deren Screenshot-Pixel trotz gleicher Route und gleicher Bildquellen leicht schwanken. Die Test-Baseline normalisiert Root-relative Assets, CSS/JS und dynamisch erzeugte Bildpfade ueber `<base href="/">`.

## Deployment

Hetzner-Hinweise stehen in `docs/DEPLOYMENT_HETZNER.md`.

Kurzfassung:

- Postgres mit persistiertem Volume.
- Payload als Node/Next-Prozess oder Container.
- Astro als Node-Server, weil Preview-Routen SSR brauchen.
- Caddy oder Nginx als Reverse Proxy mit SSL.
- Backups fuer Postgres und Medien getrennt planen.
- Payload-Rebuild-Hook auf ein Deploy-Script oder CI/CD-Ziel zeigen lassen.

## Offene TODOs

- Weitere nicht aktive Importgruppen redaktionell pruefen und erst danach `legacy.migrationStatus` von `seeded` auf `reviewed`, `componentized` oder `live` setzen.
- Medienbestand weiter kuratieren: Alt-Texte, Captions, Featured-Auswahl, Mood/Tags und Verwendungszweck finalisieren.
- Weitere Legacy-Layouts aus dem Body in echte Astro-Komponenten zerlegen, sobald Visual Regression fuer den Seitentyp stabil gruen ist.
- Naechste native Body-Zerlegung: Motorrad, Portrait und Landschaft; danach About/Kontakt/Legal, danach die sieben bestehenden Journal-Detail-HTML-Seiten.
- Local-SEO-Seiten nach dem privaten Online-Test final redaktionell gegenlesen und bei Bedarf einzelne Seiten wieder auf Draft setzen.
- Optional: Rebuild-Hook auf dem Hetzner-Server aktivieren und mit echtem Secret testen.
