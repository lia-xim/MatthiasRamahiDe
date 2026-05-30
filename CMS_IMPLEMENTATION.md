# Astro + Payload CMS Implementation

Stand: 2026-05-29

Dieses Repository enthaelt eine kontrollierte Astro/Payload-Migration fuer die bestehende Fotografie-Website. Die alten HTML-Dateien liegen als eingefrorene Referenz unter `legacy-reference/html`; im Repository-Root liegen keine aktiven Legacy-HTML-Routen mehr.

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

- `corepack pnpm legacy:freeze` schreibt `docs/legacy-reference-manifest.json` mit Checksummen, Titel, Description, H1, Canonical, Dateigroesse und Seitentyp der archivierten HTML-Dateien aus `legacy-reference/html`.
- `corepack pnpm legacy:freeze:check` vergleicht die aktuelle Archiv-Referenz gegen dieses Manifest und schlaegt fehl, sobald Dateien hinzugekommen, entfernt oder inhaltlich veraendert wurden. `production:check` fuehrt diesen Check vor den Build-/Audit-Schritten aus.
- `apps/web/src/lib/adoptedRoutes.ts` ist die kanonische Routenquelle fuer alte `.html`-URLs: native Seiten, Local-SEO-Varianten und echte Redirect-Dubletten werden dort modelliert.
- Die alte App-interne Legacy-/Componentized-Bruecke ist entfernt. Legacy-HTML wird nicht mehr aus `apps/web/src` gerendert.
- Visual Regression startet bei Bedarf einen separaten, kurzlebigen Referenzserver aus `legacy-reference/html`. Damit bleibt die alte Website vergleichbar, ohne Teil des produktiven Astro-App-Codes zu sein.
- Die alten App-Routenverzeichnisse `apps/web/src/pages/legacy-baseline` und `apps/web/src/pages/componentized` sind entfernt. Der `native:guard` blockiert ihre Rueckkehr, damit Baseline-/Componentized-Ausgaben nicht wieder als Astro-Seiten auftauchen.
- `apps/web/src/middleware.ts` rewritet adoptierte `.html`-URLs im lokalen/serverseitigen Betrieb intern auf `/native/<slug>`, ohne die sichtbare URL zu aendern.
- `apps/web/src/pages/native/[slug].astro` rendert adoptierte URLs mit der zentralen nativen Astro-Komponente `NativeAdoptedPage`.
- `apps/web/src/lib/nativeAdoptedRouteRegistry.ts` ist die zentrale Registry fuer native Renderer-Typen. Neue adoptierte Seitentypen muessen dort explizit auf einen nativen Renderer-Typ gemappt werden, sonst schlaegt der Dispatcher fail-closed fehl.
- `corepack pnpm native:coverage` prueft das eingefrorene Archiv-Manifest gegen Astro-Routenmodell, Registry und Redirect-Modell. Der aktuelle Stand ist 217/217 abgedeckt und 217/217 im Routenmodell gespiegelt: 211 native Renderer, 6 Redirects.
- `apps/web/src/pages/[slug].html.astro` baut alle 217 bisherigen `.html`-URLs als echte Astro-Routen aus dem Routenmodell. Es liest keine archivierten HTML-Dateien mehr als Produktionsquelle.
- Produktionsassets fuer die adoptierten Seiten werden ueber neutrale `native-*` CSS/JS-Dateien geladen. Alte `legacy-*` Assets bleiben nur fuer die eingefrorene Referenz/Baseline erhalten.
- Der Web-Prebuild nutzt `tools/sync-public-assets.mjs`; archivierte HTML-Dateien werden nicht in `apps/web/public` veroeffentlicht und standardmaessig auch nicht als Asset-Quelle gescannt. Nur QA-Sonderlaeufe duerfen die Archiv-Referenz explizit mit `SYNC_INCLUDE_ROOT_REFERENCE_HTML=true` einbeziehen.
- `corepack pnpm native:guard` prueft den gebauten Produktionspfad auf Public-HTML-Schatten, alte Baseline-/Componentized-Routenverzeichnisse, Public-`legacy-*` Assets, rohe Legacy-Render-Marker, unerwartete Runtime-`node:fs`-Zugriffe, fehlende native Layout-Marker, fail-closed Dispatch fuer adoptierte Routen und vollstaendige Native-Coverage des eingefrorenen HTML-Manifests. `production:check` fuehrt diesen Guard nach dem Web-Build aus.
- Echte Dubletten wie `blog-journal.html`, `weitere-dienstleistungen.html`, `matthias-ramahi-portfolio.html`, `portfolio-1-tunnel.html`, `fotografie-landing-experience.html` und `portraitfotografie-experience.html` sind 308-Redirects auf die kanonischen Seiten.
- Experimentelle Konzeptseiten (`radikale-fotografie-portfolio-konzepte.html`, `floating-archive.html`, `narrative-stage.html`, `experimental-lens.html`) rendern als native, noindex gesetzte Astro-Archivseiten.
- Es gibt keine oeffentliche oder interne Astro-Route mehr, die rohe Legacy-HTML-Seiten ausliefert. Die archivierten HTML-Dateien bleiben nur Projektarchiv und QA-Referenz.
- HTML-Dateien aus `legacy-reference/html` werden nicht nach `apps/web/public` kopiert.
- Alte HTML-Mutationsskripte sind nicht mehr Teil des normalen Wartungspfads. `seo:fix` gibt nur noch Native-/CMS-Hinweise aus; `legacy:seo:fix` ist absichtlich blockiert und verweist auf das Archiv, statt die alten Bulk-Mutationsskripte auszufuehren.

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
- `fotografie-duesseldorf.html`, `fotografie-nrw.html`, `fotografie-deutschland.html`
- sieben weitere Service-Seiten: `fotolabor-druck-duesseldorf.html`, `grossformatdruck-duesseldorf.html`, `werbetechnik-duesseldorf.html`, `webdesign-seo-duesseldorf.html`, `videografie-duesseldorf.html`, `viola-musik-duesseldorf.html`, `drucke-sonderanfertigungen-duesseldorf.html`
- die sieben aktuellen `blog-*.html` Journal-Detailseiten
- alle bestehenden Local-SEO- und Keyword-HTML-Seiten ueber den sechs Familienrenderer
- vier noindex Konzeptarchiv-Seiten als native Astro-Archivseiten

Diese Seiten beziehen ihre Content-Basis aus Payload, wenn ein passendes Dokument vorhanden ist. Wo Payload nicht erreichbar ist oder noch kein Dokument vorhanden ist, rendert Astro aus typisierten Content-Basen und Familienmodellen im Code. Die archivierten HTML-Dateien sind Referenz/Baseline, aber kein oeffentlicher Produktions-Fallback mehr.

### Native-Komponenten-Stand

Die Migration ist inzwischen zweigleisig:

- Native Astro-Komponenten mit Legacy-Optik: Startseite, `fotografie.html`, alle sechs Haupt-Fotografie-Seiten (`automobil-fotografie.html`, `sportwagen-fotografie.html`, `oldtimer-fotografie.html`, `motorrad-fotografie.html`, `portraitfotografie.html`, `landschaftsfotografie.html`), `portfolio.html`, `leistungen.html`, sieben weitere Service-Seiten inklusive Fotolabor, `contact.html`, `ueber-mich.html` sowie `blog.html`; der Journal-Index nutzt veroeffentlichte `journal-posts` aus Payload, wenn sie erreichbar sind, und faellt sonst auf die eingefrorene Referenzliste zurueck.
- Native Journal-Legacy-URLs: die sieben bestehenden `blog-*.html` Detailseiten laufen auf ihren alten URLs ueber einen strukturierten Astro-Artikelrenderer mit `BaseLayout`, Article-/FAQ-/Breadcrumb-JSON-LD, `noindex`-faehigem Preview-Pfad und typisierter Content-Basis. Sie verwenden kein rohes Legacy-Body-HTML mehr; Support-Artikel teilen sich `assets/journal-support.css`, Feature-Artikel die Automotive-Artikel-CSS.
- CMS-native strukturierte Templates: neue/dynamische Service-Seiten, Portfolio-Projekte, Journal-Beitraege unter `/journal/<slug>` und Local-SEO-Seiten ohne alte HTML-Datei.
- Native Legal-Seiten: `impressum.html` und `datenschutz.html` nutzen eine typisierte lokale Content-Basis in `apps/web/src/lib/legalContent.ts`, rendern ueber `BaseLayout` und geben WebPage-/Breadcrumb-JSON-LD aus.
- Local-SEO-Family-Schicht: alle alten lokalen Kategorie- und Keyword-HTML-Seiten laufen ueber `NativeLocalSeoFamilyPage`. Der Renderer erkennt sechs Layout-Familien (`automobil`, `sportwagen`, `oldtimer`, `motorrad`, `portrait`, `landschaft`) anhand von Slug/Legacy-URL und nutzt die jeweilige Kategorie-Hauptseite als Parent-Konzept. Payload kann SEO/Content ueberlagern, wenn ein Dokument vorhanden ist. Ohne Payload bleibt die lokale Seite trotzdem aus dem Familienmodell korrekt renderbar.
- Native Familienlogik: die sechs Familienrenderer teilen sich `nativeFamilyPageContext` fuer Scope, Preview, Parent-/Cluster-Links und lokale SEO-Varianten. `NativeFamilyClusterLinks` rendert die verwandten Fotografie-Bereiche konsistent in allen Familienseiten.
- Konzeptarchiv: alte experimentelle Konzeptseiten sind als noindex Astro-Seiten erhalten, aber nicht mehr als rohe Legacy-Ausgabe.

Local-SEO-Family-Routing ist standardmaessig aktiv und kann nur bewusst abgeschaltet werden:

```powershell
ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES=false
```

Die neutralen Uebersichtsseiten `fotografie-duesseldorf.html`, `fotografie-nrw.html` und `fotografie-deutschland.html` bleiben separat: Sie sind kein Kategorie-Clone, sondern neutrale Fotografie-Landingpages mit eigener Struktur.

## Lokales Setup

Runtime: Das Repository ist auf Node `22.x` ausgelegt. `package.json`, `.nvmrc` und `.node-version` zeigen alle auf Node 22; Docker nutzt ebenfalls `node:22-alpine`. Wenn lokal Node 24 oder neuer aktiv ist, bauen die Apps aktuell zwar, aber `pnpm` zeigt Engine-Warnungen. Vor Release-Checks sollte lokal Node 22 aktiv sein.

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

Wichtig fuer Builds: `cms:build` schreibt in `apps/cms/.next`. Wenn der Payload-Dev-Server parallel laeuft, kann der Admin danach ohne CSS/Assets erscheinen. Deshalb blockiert `cms:build` lokal, sobald auf Port 3000 ein Server laeuft. `production:check` prueft standardmaessig den frisch gebauten statischen Astro-Output ohne den laufenden Dev-Server zu stoppen. Eine zusaetzliche Astro-Preview kann bewusst mit `PRODUCTION_CHECK_START_PREVIEW=true` aktiviert werden und sucht dann automatisch einen freien Port. Vor Release-Checks:

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

Der Vollimport liest die archivierten HTML-Dateien aus `legacy-reference/html`, importiert referenzierte Bilder in `media` und befuellt Site Pages, Service Pages, Local SEO Pages, Portfolio-Kategorien/-Projekte und Journal-Beitraege. Lokale SEO-Seiten bleiben standardmaessig Entwuerfe, bis sie redaktionell geprueft sind.

Der Import speichert fuer adoptierte Standardseiten, Service-Seiten und lokale SEO-Seiten zusaetzlich strukturierte `blocks` aus Ueberschriften, Textabschnitten und Figuren. Die produktive 1:1-Ausgabe laeuft inzwischen ueber native Astro-Komponenten und typisierte Content-Basen; importierte Legacy-Felder bleiben Kontroll- und Migrationsmetadaten, aber kein Produktions-Renderpfad.

Redaktions- und Produktionsreife auditieren:

```powershell
corepack pnpm cms:audit-readiness
corepack pnpm cms:audit-production -- --strict
corepack pnpm cms:audit-seo -- --strict
```

Produktionsbereit bedeutet: Pflichtfelder sind vorhanden, der Inhalt ist veroeffentlicht, `legacy.migrationStatus` steht nicht mehr auf `seeded`, sondern auf `reviewed`, `componentized` oder `live`, und `legacy.renderSource` ist release-faehig. Release-faehig sind aktuell `native-component` und `structured-blocks`; `payload-legacy-html` bleibt nur Import-/Archivstatus und faellt im strikten Production-Audit durch.

Aktive Kernseiten bewusst als visuell/release-geprueft markieren:

```powershell
corepack pnpm cms:review-adopted -- --write
corepack pnpm cms:harden-seo
corepack pnpm cms:sanitize-studio-language
```

`cms:review-adopted` setzt nur die definierte Produktionsgruppe aus Home, Fotografie-Uebersicht, sechs Haupt-Fotografie-Seiten, Portfolio, Leistungen, Kontakt, Ueber mich, Journal-Uebersicht, Legal-Seiten, weiteren Service-Seiten und sieben Journal-Detailseiten auf `reviewed` und `native-component`. Wenn ein Dokument, Pflichtfeld oder die alte Quelldatei nicht passt, wird blockiert statt stillschweigend freigegeben. `cms:harden-seo` staerkt gezielt kurze SEO-Basisdaten fuer Portfolio, Portfolio-Kategorien und zentrale Uebersichts-/Legal-Seiten. `cms:sanitize-studio-language` bereinigt alte Studio-Sprache in Globals und importierten Dokumenten; der Production-Audit prueft diese Inhalte ebenfalls.

Private-Staging-Freigabe fuer kuratierte Draft-Gruppen:

```powershell
corepack pnpm cms:approve-private-staging -- --collection=local-seo-pages
corepack pnpm cms:approve-private-staging -- --collection=local-seo-pages --write
```

Der erste Befehl ist ein Dry-Run. Mit `--write` werden nur Dokumente veroeffentlicht, die alle Pflichtfelder, SEO-Basisdaten, Slug, Alt-Text-Pflichten und Legacy-/Render-Metadaten erfuellen. Fuer das aktuelle private Staging wurden die Local-SEO-Seiten bewusst massenhaft freigegeben und auf `native-component` gesetzt, weil die Sichtbarkeit serverseitig eingeschraenkt ist und die Inhalte danach online redaktionell nachgeprueft werden koennen.

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
- `ASTRO_ENABLE_ADOPTED_ROUTES`: optional, Standard ist aktiv. Auf `false` setzen nur fuer technische Tests; im Produktionsbuild fuehrt das fuer adoptierte `.html`-Routen zu 404 statt zu rohem Legacy-Fallback.
- `ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES`: optional, Standard ist aktiv. Auf `false` setzen, wenn lokale SEO-Seiten im Middleware-SSR-Pfad nicht intern auf `/native/<slug>` rewritten werden sollen. Der statische Vercel-Build bleibt bewusst nativ.
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

Astro laedt Draft-Daten mit `draft=true` und API-Key. Preview-Seiten sind immer `noindex`. Neue CMS-Seiten ohne Legacy-Datei laufen ueber den generischen strukturierten Astro-Renderpfad. Local-SEO-Previews nutzen den Family-Renderer, Journal-Previews die native Journal-Komponente, alle anderen Collections den strukturierten CMS-Renderer. Rohe Legacy-Preview-Ausgabe ist nicht mehr der Default.

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

`web:build` ruft `tools/run-web-build.mjs` auf. Das Script setzt fuer Astro-Check/Build standardmaessig `NODE_OPTIONS=--max-old-space-size=4096`, damit der grosse statische Legacy-/CMS-Routenbestand reproduzierbar baut. Bei Bedarf kann der Wert lokal mit `WEB_BUILD_MAX_OLD_SPACE_SIZE` ueberschrieben werden.

Aktueller Stand vom 2026-05-29:

- `web:build`: erfolgreich, inklusive `astro check` mit 0 Fehlern und 0 Warnungen.
- `cms:build`: erfolgreich.
- `cms:import-adopted`: erfolgreich, 29 adoptierte HTML-Dateien als aktuelle Content-Basis gescannt.
- `cms:review-adopted -- --write`: erfolgreich, 29 aktive Seiten stehen jetzt auf `reviewed`.
- `cms:review-portfolio`: erfolgreich, 6 Portfolio-Projekte und 6 Portfolio-Kategorien stehen auf `reviewed` / `structured-blocks`.
- `cms:audit-production -- --strict`: erfolgreich, 0 Errors und 0 Warnings.
- `cms:audit-seo -- --strict`: erfolgreich, 0 Errors und 0 Warnings.
- `production:check`: erfolgreich, inklusive Web-Build, CMS-Build, eigener Astro-Preview, Routen-Audit und Visual Regression.
- `cms:approve-private-staging -- --collection=local-seo-pages --write`: erfolgreich, 157 lokale SEO-Seiten fuer private Staging-Abnahme veroeffentlicht.
- `cms:audit-readiness -- --strict` nach Render-Source-Haertung: erfolgreich. Site Pages 9/9, Service Pages 13/13, Local SEO 157/157 und Journal 7/7 stehen auf `native-component`; Portfolio-Kategorien 6/6 und Portfolio-Projekte 6/6 stehen auf `structured-blocks`; nicht release-faehige Render-Quellen: 0.
- `web:build` nach nativer Journal-Artikelkomponente und Local-SEO-Template-Gate: erfolgreich, `astro check` mit 0 Errors / 0 Warnings.
- `web:build` nach nativer Automobil-, Sportwagen- und Oldtimer-Body-Komponente: erfolgreich, `astro check` mit 0 Errors / 0 Warnings.
- Visual Regression 2026-05-29: `automotive-main` Desktop 1.985%, Mobile 1.705%; `sportscar-main` Desktop 1.779%, Mobile 0.008%; `oldtimer-main` Desktop 0.003%, Mobile 0.010%.
- Browser-Smoke 2026-05-29: `automobil-fotografie.html`, `sportwagen-fotografie.html` und `oldtimer-fotografie.html` laden sinnvollen Inhalt, Lightbox-Interaktion funktioniert, keine Console Errors/Warnings.
- `web:build` nach nativer Motorrad-, Portrait-, Landschaft-, Kontakt- und Ueber-mich-Zerlegung: erfolgreich, `astro check` mit 0 Errors / 0 Warnings.
- Visual Regression 2026-05-29 ueber acht Kernseiten: Automobil 0.016%/1.705%, Sportwagen 2.806%/0.253%, Oldtimer 0.003%/0.010%, Motorrad 2.516%/0.473%, Portrait 1.048%/0.010%, Landschaft 0.003%/0.012%, Ueber mich 0.003%/0.010%, Kontakt 0.017%/1.869% Desktop/Mobile.
- Browser-Smoke 2026-05-29: Motorrad, Portrait und Landschaft oeffnen ihre Lightbox; Kontaktformular und Kopierbutton funktionieren; Ueber-mich-Kapitel und Kontaktmodul sind vorhanden; keine relevanten Console Errors/Warnings.
- Zielgerichtete Visual Regression nach der letzten Template-Aenderung: Portfolio, Leistungen, Journal-Index, Automotive-Journal-Detail und Local-SEO bleiben unter der harten 5%-Grenze; Local-SEO mobile bleibt wegen langer Legacy-Lazyload-Strecken eine dokumentierte Warnung.
- Local-SEO-Family-Smoke 2026-05-29: je eine Koeln-Seite pro Familie (`automobil`, `sportwagen`, `oldtimer`, `motorrad`, `portrait`, `landschaft`) rendert mit richtigem Family-Marker und Parent; Browser-Smoke fuer Motorrad Koeln ohne Console Errors und ohne Error-Overlay.
- `web:build` nach Aktivierung des Local-SEO-Family-Renderers: erfolgreich, `astro check` mit 0 Errors / 0 Warnings.
- `web:build` nach Entkopplung der sieben bestehenden Journal-Detailseiten: erfolgreich, `astro check` mit 0 Errors / 0 Warnings; die alten `blog-*.html` URLs senden `x-cms-render-source: structured-astro` und `x-cms-page-kind: journal-native-html-url`.
- Browser-Smoke 2026-05-29: `blog-automotive-fotografie-duesseldorf.html` und `blog-fine-art-druck.html` rendern mit `BaseLayout`, Article-Markup und BlogPosting-JSON-LD, ohne Vite-Overlay, ohne relevante Console Errors/Warnings und ohne kaputte Kernbilder.
- `web:build` nach typisierten Legal-Seiten und gecachtem Local-SEO-Legacy-URL-Index: erfolgreich, `astro check` mit 0 Errors / 0 Warnings. Der Build fragt Local-SEO-Dokumente nicht mehr seitenweise ab, sondern indexiert sie gesammelt nach Legacy-URL.
- Browser-Smoke 2026-05-29: `impressum.html` und `datenschutz.html` rendern mit `BaseLayout`, typisierten Legal-Bloecken, Header/Footer und WebPage-JSON-LD; `blog-fine-art-druck.html` rendert wieder alle vier Support-Artikelabschnitte. Keine kaputten Bilder, kein Error-Overlay, keine Console Errors/Warnings.
- `web:build` nach vollstaendiger `.html`-Routenentkopplung: erfolgreich. Alle 217 bisherigen `.html`-URLs werden aus dem nativen Astro-Routenmodell gebaut; 6 Dubletten redirecten kanonisch, 4 Konzeptseiten sind noindex Astro-Archivseiten, alle Local-SEO-Varianten laufen ueber den Family-Renderer.
- `web:build` nach Entfernung der App-internen Legacy-/Componentized-Bruecke: erfolgreich; die Visual-Regression-Baseline wird nun als separater Referenzserver aus `legacy-reference/html` gestartet und ist nicht mehr Teil der Astro-Produktionsrouten.
- Route-Audit 2026-05-29: 217/217 historische `.html`-URLs im Build vorhanden, keine fehlenden nativen HTML-Routen und keine rohen Legacy-Render-Marker. Der standalone statische Audit prueft 216/217 Routen und ueberspringt nur `/`, solange keine `LEGACY_AUDIT_BASE_URL` auf eine laufende Astro-Preview zeigt; bekannte Alias-Redirects werden vor dem Browser-Render als Redirects geprueft.
- Native-Production-Guard 2026-05-29: erfolgreich. `apps/web/public` enthaelt keine HTML-Schatten, die alten `legacy-baseline`-/`componentized`-Routenverzeichnisse sind entfernt, es gibt keine `legacy-*` Public-Assets, der Astro-/CMS-Produktionscode enthaelt keine Mojibake-Muster, der Astro-Runtime-Code enthaelt keinen rohen Legacy-Renderpfad, und adoptierte Routen laufen ueber die native Renderer-Registry und schlagen hart fehl, wenn kein nativer Renderer registriert ist. `native:coverage` bestaetigt 217/217 eingefrorene HTML-Dateien und 217/217 Routenmodell-Dateien: 211 native, 6 Redirects.
- Finaler Native-Family-Lauf 2026-05-29: alle sechs Haupt-Fotografie-Seiten und repraesentative Local-SEO-Varianten pro Familie laufen ueber native Astro-Komponenten. Visual Regression bleibt fuer Desktop und Mobile unter der harten 5%-Grenze; dokumentierte Warnungen liegen nur ueber dem 2%-Zielwert und stammen aus bekannten Lazyload-/Bildstrecken.
- Finaler Web-Build 2026-05-29: `corepack pnpm --filter @matthias-ramahi/web build` erfolgreich, `astro check` ueber 80 Dateien mit 0 Errors / 0 Warnings / 0 Hints.
- Finaler Route-Audit 2026-05-29: `corepack pnpm --filter @matthias-ramahi/web test:legacy-routes` erfolgreich, 216/217 statisch auditierbare HTML-Routen geprueft; `/` wird im vollstaendigen `production:check` gegen die temporaere Astro-Preview mitgeprueft.
- Finaler Asset-Entkopplungslauf 2026-05-29: `corepack pnpm --filter @matthias-ramahi/web build` laeuft mit `sync-public-assets`, kopiert 174/174 referenzierte native Assets ohne Archiv-HTML-Scan und nutzt im Astro-Produktionscode keine `legacy-*` Assetpfade mehr.
- Finaler Site-Quality-Audit 2026-05-29: `corepack pnpm --filter @matthias-ramahi/web test:site-quality -- --route-source=all --strict --timeout-ms=45000` erfolgreich, 452 Checks ueber 226 Routen, 0 Failures. Payload-Medien von `cms.matthiasramahi.de` gelten als First-Party; uebrig sind nur Long-Task-Warnungen auf bild-/animationsreichen Seiten.
- Bild-/Asset-Haertung 2026-05-29: Lazyload-Bilder haben echte `src`-Fallbacks, die mobile Sticky-CTA erscheint erst nach Scrolltiefe, und `tools/prune-unused-dist-assets.mjs` behandelt Root-Assets wie `assets/...` und `_astro/...` korrekt.
- Release-Check-Haertung 2026-05-29: `production:check` laeuft wieder vollstaendig durch. Der Runner prueft zuerst `legacy:freeze:check`, teilt die Visual Regression danach in drei Gruppen, streamt Vergleichsergebnisse fortlaufend, startet bei belegtem Port automatisch eine temporaere Astro-Preview auf einem freien Port und raeumt sie danach auf. Letzter Voll-Lauf: Freeze-Check 217/217 aktuell, CMS Production/SEO Audit 0 Errors / 0 Warnings, Web- und CMS-Build erfolgreich, `native:guard` erfolgreich, Route-Audit 217/217, alle drei Visual-Gruppen unter der harten Fail-Grenze.

Weitere QA-Befehle:

```powershell
corepack pnpm --filter @matthias-ramahi/web exec playwright install chromium
corepack pnpm legacy:freeze:check
corepack pnpm native:coverage
corepack pnpm production:check
corepack pnpm native:guard
corepack pnpm web:test:legacy-routes
corepack pnpm web:test:visual
corepack pnpm cms:audit-readiness
corepack pnpm cms:audit-production -- --strict
```

Wenn der komplette Visual-Lauf lokal laenger als das Terminal-Timeout braucht, wird er in Gruppen ausgefuehrt:

```powershell
$env:VISUAL_PAGES='home,portfolio,photography-index,automotive-main,sportscar-main,oldtimer-main,motorcycle-main,portrait-main,landscape-main'; corepack pnpm --filter @matthias-ramahi/web test:visual; Remove-Item Env:VISUAL_PAGES
$env:VISUAL_PAGES='services,service-fotolabor,service-grossformat,service-werbetechnik,service-webdesign,service-videografie,service-viola,service-sonder,about,contact,journal,journal-detail'; corepack pnpm --filter @matthias-ramahi/web test:visual; Remove-Item Env:VISUAL_PAGES
$env:VISUAL_PAGES='local-seo,local-seo-sportscar,local-seo-oldtimer,local-seo-motorcycle,local-seo-portrait,local-seo-landscape'; corepack pnpm --filter @matthias-ramahi/web test:visual; Remove-Item Env:VISUAL_PAGES
```

Aktueller Release-Audit nach der letzten Haertung:

- 29/29 aktive Produktionsseiten sind `published` und `reviewed`.
- Medienbibliothek: 104/104 ohne Audit-Fehler.
- Lokale SEO-Seiten: 157/157 `published`, `reviewed` und `native-component` fuer private Staging-Abnahme.
- Release-faehige Render-Quellen: `native-component` fuer Site-/Service-/Local-SEO-/Journal-Seiten, `structured-blocks` fuer Portfolio-Kategorien und Portfolio-Projekte.
- Published Release-Dokumente gesamt: 198.
- Production-Audit: 0 Errors, 0 Warnings.

`web:test:visual` nutzt ein zweistufiges Modell: 2% ist das Ziel und erzeugt Warnungen, 5% ist die harte Fail-Grenze. Das ist noetig, weil einige Referenzseiten dynamische JS-/Lazyload-Bildstrecken enthalten, deren Screenshot-Pixel trotz gleicher Route und gleicher Bildquellen leicht schwanken. Die Test-Baseline wird ausserhalb der Astro-App aus `legacy-reference/html` serviert und normalisiert root-relative Assets, CSS/JS und dynamisch erzeugte Bildpfade ueber `<base href="/">`.

`production:check` fuehrt die Visual Regression standardmaessig in drei Gruppen aus und setzt `VISUAL_SCREENSHOT_DELAY_MS=1000`, falls kein anderer Wert konfiguriert ist. Der Visual-Runner schreibt jedes Ergebnis direkt nach dem Vergleich, damit lange Laeufe nicht wie eingefroren wirken und temporaere Astro-Preview-Prozesse im Fehlerfall zuverlaessig aufgeraeumt werden koennen.

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

- Die alten HTML-Dateien liegen jetzt unter `legacy-reference/html`. Sie sind keine Runtime-Abhaengigkeit mehr, sondern nur noch QA-Referenz.
- Lokale Maschine auf Node 22.x umstellen, wenn noch Node 24 aktiv ist. Das Repository enthaelt jetzt `.nvmrc` und `.node-version`; die aktive Shell muss den Wechsel trotzdem ausfuehren.
- Medienbestand weiter kuratieren: Alt-Texte, Captions, Featured-Auswahl, Mood/Tags und Verwendungszweck finalisieren.
- Local-SEO-Family-Content weiter redaktionell verbessern: die technische Ausgabe ist nativ, aber einzelne Stadt-/Keyword-Texte sollten nach privatem Online-Test weiter gegen Copy/Prioritaet/Interlinking geprueft werden.
- Local-SEO-Seiten nach dem privaten Online-Test final redaktionell gegenlesen und bei Bedarf einzelne Seiten wieder auf Draft setzen.
- Optional: Performance-Feinschliff fuer Long-Task-Warnungen auf sehr bildreichen Seiten, ohne die visuelle Parity zu riskieren.
- Optional: Rebuild-Hook auf dem Hetzner-Server aktivieren und mit echtem Secret testen.
