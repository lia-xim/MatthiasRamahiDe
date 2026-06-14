# Tina-Migrationsplan

Stand: 2026-06-13

Ziel: Payload durch TinaCMS ersetzen, ohne die bestehende Astro-Website, SEO-Struktur,
Bildpipeline oder bereits gepflegte Inhalte zu verlieren. Payload bleibt bis zur finalen
Abnahme unveraendert auf dem Server. Es wird nichts geloescht, bevor die Tina-Version
seitenweise und technisch nachweisbar gleichwertig oder besser ist.

## Entscheidung

Empfehlung fuer dieses Projekt: Tina self-hosted auf dem bestehenden Hetzner-Server
vorbereiten, aber die Migration so bauen, dass ein TinaCloud-Test jederzeit moeglich
bleibt.

Warum self-hosted als Ziel:

- Die Website ist ein langlebiges, eher selten redaktionell angepasstes Projekt.
- Der Server existiert bereits und laeuft mit Docker, Postgres, Reverse Proxy und SSH.
- Inhalte bleiben repo-/dateibasiert und koennen versioniert, exportiert und lokal
  gebaut werden.
- Keine harte Abhaengigkeit von TinaCloud-Userlimits oder externem CMS-Dienst.
- Medien, SEO-Daten und Build-Pipeline koennen exakt an die vorhandene Astro-Logik
  angepasst werden.

Warum TinaCloud trotzdem als Testpfad sinnvoll ist:

- Der Free-Tier reicht laut aktueller Tina-Preisseite fuer 2 User, 2 Rollen und ein
  Projekt.
- TinaCloud ist fuer den schnellsten ersten visuellen Editor wahrscheinlich der
  geringere Betriebsaufwand.
- Paid-Tiers bringen vor allem mehr User, Support, Editorial Workflow und spaeter
  AI Assist. AI Assist ist aktuell als "Coming Soon" gelistet und deshalb kein
  belastbarer Grund fuer einen Paid-Tier.

Quellen:

- https://tina.io/pricing
- https://tina.io/docs/tinacloud
- https://tina.io/docs/self-hosted/overview
- https://tina.io/docs/self-hosted/manual-setup
- https://tina.io/docs/frameworks/astro
- https://tina.io/docs/reference/media/repo-based
- https://tina.io/docs/contextual-editing/astro/

## Aktueller Sicherungsstand

Payload-Produktion wurde per SSH gesichert. Die laufende Installation wurde nicht
geloescht und nicht veraendert.

Server:

| Artefakt | Pfad |
|---|---|
| Backup-Ordner | `/home/contextter/matthias-ramahi/backups/cms/tina-migration-20260613-002033` |
| Postgres Dump | `/home/contextter/matthias-ramahi/backups/cms/tina-migration-20260613-002033/payload.sql.gz` |
| Medienarchiv | `/home/contextter/matthias-ramahi/backups/cms/tina-migration-20260613-002033/media.tar.gz` |
| Strukturierter Payload-Export | `/home/contextter/matthias-ramahi/backups/cms/tina-migration-20260613-002033/payload-export` |
| Local-SEO-SQL-Sonderdump | `/home/contextter/matthias-ramahi/backups/cms/tina-migration-20260613-002033/local-seo-tables.sql.gz` |

Lokal:

| Artefakt | Pfad |
|---|---|
| Backup-Ordner | `outputs/payload-tina-migration-20260613-002033` |
| Postgres Dump | `outputs/payload-tina-migration-20260613-002033/payload.sql.gz` |
| Medienarchiv | `outputs/payload-tina-migration-20260613-002033/media.tar.gz` |
| Strukturierter Payload-Export | `outputs/payload-tina-migration-20260613-002033/payload-export` |
| Export-Manifest | `outputs/payload-tina-migration-20260613-002033/payload-export/payload-export.manifest.json` |
| Local-SEO-SQL-Sonderdump | `outputs/payload-tina-migration-20260613-002033/local-seo-tables.sql.gz` |

Strukturierter Export aus Produktion:

| Bereich | Anzahl |
|---|---:|
| `site-pages` | 9 |
| `service-pages` | 13 |
| `portfolio-categories` | 6 |
| `portfolio-projects` | 6 |
| `journal-posts` | 7 |
| `media` | 446 |
| Medien-Dateien inkl. Derivate | 4416 |
| Medien-Gesamtgroesse | 600176208 Bytes |

Local-SEO-Sonderrettung:

- `local-seo-pages` konnte ueber die aktuelle Payload-API nicht sauber exportiert
  werden, weil Produktionsdatenbank und aktueller Code bei mindestens einem
  Untertabellen-Namen auseinanderlaufen.
- Die produktiven Local-SEO-Tabellen wurden deshalb separat als SQL gesichert.
- Aus diesem SQL-Dump wurden 216 Local-SEO-Seiten aus 23 Tabellen rekonstruiert.
- Die erzeugten Dateien liegen unter
  `outputs/payload-tina-migration-20260613-002033/payload-export/collections`.
- Die wichtigste Kontroll-Datei ist
  `outputs/payload-tina-migration-20260613-002033/payload-export/collections/local-seo-pages.rescue-manifest.json`.
- Vor der Tina-Generierung muessen diese rekonstruierten Dokumente noch gegen die
  gerenderten lokalen SEO-Seiten geprueft werden.

## Grundprinzip fuer den Umbau

Astro bleibt die Website. Tina wird die Redaktionsoberflaeche und die strukturierte
Content-Quelle. Die vorhandene technische Logik wird nicht blind gegen Tina ersetzt,
sondern in einen CMS-neutralen Vertrag ueberfuehrt:

1. Content-Dateien enthalten Texte, Reihenfolgen, Bildreferenzen, SEO-Felder,
   strukturierte Module und Seitentypen.
2. Medien liegen im Repo-kompatiblen Public-Bereich, damit Tina sie anzeigen und
   austauschen kann.
3. Ein eigenes Media-Manifest bewahrt die Informationen, die Payload bisher geliefert
   hat: Breite, Hoehe, Alt-Text, Fokuspunkt, dominante Farbe, Blur Placeholder,
   responsive Derivate und MIME-Varianten.
4. Astro rendert aus diesem Vertrag, nicht mehr direkt aus Payload-Objekten.
5. Payload bleibt als Read-only-Referenz stehen, bis Export, Tina-Content,
   Bildausgabe, SEO und visuelle Seitenpruefung abgeschlossen sind.

## Aktueller Umsetzungsstand

Stand nach der ersten technischen Umstellung am 2026-06-13:

- Tina ist parallel in `apps/web` installiert.
- Die Admin-App laeuft lokal unter `http://localhost:4321/admin/index.html`.
- Die lokale Tina-GraphQL-API laeuft unter `http://localhost:4001/graphql`.
- `apps/web/tina/config.ts` bildet die Payload-Collections und Globals als
  Tina-Collections ab.
- Der Payload-Export wurde nach Tina-JSON-Dateien unter `apps/web/content`
  konvertiert.
- Importierte Tina-Dokumente:

| Bereich | Anzahl |
|---|---:|
| `pages` | 9 |
| `servicePages` | 13 |
| `localSeoPages` | 216 |
| `portfolioCategories` | 6 |
| `portfolioProjects` | 6 |
| `journalPosts` | 7 |
| `siteSettings` | 1 |
| `navigation` | 1 |
| `globalCtas` | 1 |
| `footer` | 1 |

- Tina API-Check: `localSeoPagesConnection(first: 250)` meldet 216 Dokumente.
  Ohne `first` zeigt die lokale Connection nur das Default-Limit von 50.
- Das Media-Manifest liegt unter `apps/web/src/data/tinaMediaManifest.json`.
- Payload-Medien wurden lokal nach `apps/web/public/uploads/payload` gespiegelt:
  4416 Dateien, rund 572 MB.
- `ASTRO_CONTENT_SOURCE=tina` aktiviert den Tina/Datei-Adapter hinter den
  bestehenden `payload.ts`-Funktionen.
- `corepack pnpm web:build` laeuft mit `ASTRO_CONTENT_SOURCE=tina` erfolgreich.
- Der Dist-Pruner behaelt `uploads/payload` inzwischen im Build-Output.
- Fuer kuenftige neue Tina-Uploads existiert der Optimizer
  `corepack pnpm tina:media-optimize`. Er erzeugt WebP-/AVIF-Derivate,
  Dominant Color, Blur Placeholder, Dimensionen und Manifest-Eintraege unter
  `apps/web/public/uploads/generated`, ohne den eingefrorenen Payload-Import zu
  veraendern.
- HTTP-Smoke mit Tina-Quelle:
  `/`, `/automobil-fotografie-duesseldorf.html`, `/automobil-fotografie.html`,
  `/portfolio/portfolio-auswahl-automobil`, `/leistungen.html`, `/blog.html`,
  `/portfolio.html`, `/sitemap.xml` und `/sitemap-images.xml` liefen ohne
  Payload-Media-Host.
- Fokussierter Site-Quality-Audit gegen `http://localhost:4321` mit Tina-Quelle:
  10 Checks, 0 Failures. Bestehende Warnklassen bleiben sichtbar:
  Touch-Target-Groessen, einzelne oversized images, Third-Party-Analytics und
  lokale Long-Task-Warnungen.
- `corepack pnpm seo:audit:strict` ist nach Ausschluss technischer HTML-Dateien
  (`admin/`, Google-Site-Verification) gruen.
- Das Runtime-Media-Manifest enthaelt keine alten Payload-Media-Host-URLs mehr;
  die alten URLs bleiben nur im lokalen Payload-Export/Backup als Nachweisquelle.
- Repraesentativer Site-Quality-Lauf gegen `http://localhost:4321` mit Tina-Quelle:
  12 Routen, 24 mobile/desktop Checks, 0 Failures. Sichtbar bleiben bekannte
  Warnklassen: Touch-Target-Groessen, einzelne oversized images, Third-Party-
  Request und Long-Task-Warnungen.
- Der vorhandene Visual-Regression-Vergleich gegen `legacy-reference/html`
  scheitert fuer aktuelle Tina/Payload-Inhalte erwartbar, weil die Referenz alte
  Fallback-Inhalte enthaelt. Beispiel: aktueller Export rendert auf der Startseite
  den Hero "MATTHIAS RAMAHI FOTOGRAFIE", die Legacy-Referenz noch
  "FOTOGRAFIE DUESSELDORF". Fuer finale Abnahme braucht es deshalb eine neue
  Baseline gegen den aktuellen Payload-Produktionsstand oder direkte
  Seitenabnahme in Tina.
- Ein durch QA gefundener Restpfad auf Portfolio-Hero-Slides wurde behoben:
  Hero/Canvas-Bilder verwenden nun ebenfalls die zentrale Tina-/Upload-
  Bildaufloesung statt absolute CMS-Media-URLs.
- Neues strukturelles Tina-Audit:
  `corepack pnpm web:audit:tina-content -- --strict`.
  Ergebnis am 2026-06-13: 261 Dokumente, 1286 lokale Asset-Referenzen,
  6 Tina-Referenzen, 0 Failures, 0 Warnings. Das Audit prueft Import-
  Zaehlungen, Admin-Build, Media-Manifest, lokale Bilddateien, alte
  Payload-URLs, fehlende Referenzen und doppelte Slugs.
- Neues visuelles Payload-vs-Tina-Gate:
  `corepack pnpm web:test:cms-parity -- --viewports=mobile,desktop --strict`.
  Das Gate startet Payload- und Tina-Astro parallel, friert dynamische Hero-/
  Lazy-Load-Zustaende fuer Screenshots ein, vergleicht Titel, Description,
  Canonical, OG-Bild-Identitaet, H1, Body-Text, Bilder, Requests und
  Fullpage-Pixel. Ein fokussierter Musterlauf ueber 7 Seitentypen und
  14 mobile/desktop Checks ist gruen.
- Bei importierten Longtail-SEO-Seiten wurden mit `...` abgeschnittene
  Meta-Descriptions gegen die vollstaendigen authored SEO-Descriptions
  ersetzt, wenn diese laenger sind. Dadurch entspricht Tina dem aktuell
  gerenderten Payload-/Fallback-Stand, ohne echte CMS-Texte pauschal zu
  ueberschreiben.

## Server-Staging fuer self-hosted Tina

Payload bleibt unveraendert unter dem bestehenden Stack erreichbar. Tina wurde
parallel als separates Docker-Staging auf dem Contextor/Hetzner-Server
aufgesetzt.

| Bereich | Wert |
|---|---|
| Staging-Pfad | `/home/contextter/matthias-ramahi-tina-staging` |
| Compose-Datei | `/home/contextter/matthias-ramahi-tina-staging/deploy/compose.tina-staging.yml` |
| Container | `matthias-ramahi-tina-staging-tina-web-1` |
| Astro/Tina UI | `127.0.0.1:4334 -> container:4321` |
| Tina GraphQL | `127.0.0.1:4001 -> proxy:4002 -> Tina ::1:4001` |
| Medien | `apps/web/public/uploads/payload`, aus Payload-Backup entpackt |

Server-Checks am 2026-06-13:

- `http://127.0.0.1:4334/` liefert 200.
- `http://127.0.0.1:4334/admin/index.html` liefert 200.
- `POST http://127.0.0.1:4001/graphql` mit `{ __typename }` liefert
  `{"data":{"__typename":"Query"}}`.
- Beispielmedium `/uploads/payload/_DSC3882.webp` liefert 200.
- Im Container ist `apps/web/content` schreibbar.
- Im Container ist `apps/web/public/uploads` schreibbar.
- Im Container ist `pnpm --filter @matthias-ramahi/web audit:tina-content -- --strict`
  gruen.

Zugriff per SSH-Tunnel vom lokalen Rechner:

```bash
ssh -N -L 4334:127.0.0.1:4334 -L 4001:127.0.0.1:4001 contextter@176.9.46.29
```

Danach:

- Website/Staging: `http://localhost:4334/`
- Tina Admin: `http://localhost:4334/admin/index.html`
- Tina GraphQL: `http://localhost:4001/graphql`

Hinweis: Das ist ein privates, localhost-gebundenes Editor-Staging. Fuer eine
oeffentliche self-hosted Tina-Produktionsoberflaeche braucht es noch Reverse
Proxy/Nginx, Auth-Haertung und eine bewusste Entscheidung, ob die lokale Tina-
Dev-Bridge reicht oder die offizielle Self-hosted-Backend-Variante mit
Auth/Database/Git-Provider aufgebaut wird. Nginx-Aktivierung braucht auf dem
Server Root-/Sudo-Zugriff; aktuell liegt der sichere Stand hinter SSH-Tunnel.

Wichtige neue Befehle:

```bash
corepack pnpm tina:rescue-local-seo
corepack pnpm tina:media-manifest
corepack pnpm tina:media-optimize
corepack pnpm tina:content-import
corepack pnpm tina:media-sync
ASTRO_CONTENT_SOURCE=tina corepack pnpm web:build
corepack pnpm web:tina:dev
corepack pnpm web:audit:tina-content -- --strict
corepack pnpm web:test:cms-parity -- --viewports=mobile,desktop --strict
```

Hinweis: `apps/web/public/uploads/payload` ist bewusst per `.gitignore`
ausgeschlossen. Die Dateien werden aus dem Payload-Backup synchronisiert und
duerfen nicht als 572-MB-Binaerpaket ins Repo wandern. Fuer den spaeteren
Serverbetrieb muss dieser Sync im Deploy-/Releaseprozess fest verankert werden.

## Bildpipeline

Das Bildermanagement geht bei einem Wechsel nicht automatisch verloren, aber es ist
der wichtigste Teil der Migration. Tina speichert und referenziert Bilder. Die
Komprimierung, AVIF/WebP-Derivate, BlurDataURL, Fokuspunkt-Logik und responsive
Ausgabe muessen wir als eigene Pipeline erhalten.

Zielzustand:

- Upload-/Arbeitsordner fuer Tina: `apps/web/public/uploads`.
- Uebernommene Payload-Dateien: `apps/web/public/uploads/payload`.
- Generierte optimierte Dateien fuer neue Uploads:
  `apps/web/public/uploads/generated`.
- Media-Manifest: `apps/web/src/data/tinaMediaManifest.json`.
- Astro bekommt Media-Objekte ueber den Tina-Adapter, der Bildreferenzen aus dem
  Tina-Content gegen das Media-Manifest aufloest.
- Fuer neue Tina-Uploads laeuft ein lokaler oder serverseitiger Optimizer, der die
  fehlenden Derivate nachzieht: `corepack pnpm tina:media-optimize`.
- Der Optimizer ignoriert den eingefrorenen Payload-Import unter
  `apps/web/public/uploads/payload`, verarbeitet nur neue Tina-Dateien direkt unter
  `apps/web/public/uploads` und schreibt WebP-/AVIF-Derivate plus Metadaten in das
  gemeinsame Media-Manifest.

Abnahmekriterien:

- Jedes aktuell verwendete Payload-Bild hat in Tina dieselbe Bildreferenz oder einen
  bewusst dokumentierten Ersatz.
- Original, WebP und AVIF sind vorhanden, wenn sie vorher fuer die Seite relevant
  waren.
- Alt-Text, Caption, Fokuspunkt, dominante Farbe und Placeholder gehen nicht verloren.
- Keine Seite rendert nach der Migration groessere Bilder als vorher ohne bewussten
  Grund.
- SEO-OG-Bilder und JSON-LD-Bildreferenzen zeigen auf gueltige Dateien.

## Content-Modell

Tina soll die echten Seitentypen abbilden, nicht nur ein grosses freies HTML-Feld.

Geplante Tina-Collections:

| Tina-Bereich | Entspricht Payload | Zweck |
|---|---|---|
| `pages` | `site-pages` | Home, About, Kontakt, Legal, Indizes |
| `servicePages` | `service-pages` | Hauptleistungen und Service-Detailseiten |
| `localSeoPages` | `local-seo-pages` | Stadt-/Keyword-Seiten nach SQL-Rekonstruktion |
| `portfolioProjects` | `portfolio-projects` | Projektseiten und Galerien |
| `portfolioCategories` | `portfolio-categories` | Kategorien/Filter |
| `journalPosts` | `journal-posts` | Artikel und BlogPosting-SEO |
| `navigation` | Global `navigation` | Hauptnavigation, Footer-Navigation |
| `siteSettings` | Global `site-settings` | globale SEO-/Brand-/Kontaktwerte |
| `globalCtas` | Global `global-ctas` | wiederverwendbare CTA-Texte |
| `footer` | Global `footer` | Footer-Inhalte |

Wichtige Feldgruppen:

- `seo`: title, description, canonical, legacyUrl, noindex, focusKeyword,
  searchIntent, OG image, JSON-LD Optionen.
- `hero`: Headline, Eyebrow, Lead, Hauptbild, Bildpanels, CTAs.
- `blocks`: typisierte Inhaltsmodule wie Text, Bildfolge, Quote, FAQ, Linkliste,
  CTA, Prozess, Portfolio-Teaser.
- `media`: Bildreferenz plus optionaler Override fuer Alt-Text, Caption und Crop.
- `routing`: slug, legacy URL, canonical URL, publish state.

## SEO und Metadaten

Die SEO-Schicht bleibt eine eigene Abnahmespur. Tina ersetzt nur die Datenquelle.

Zu pruefen:

- Canonical pro URL.
- Meta title und description.
- Open Graph und Twitter Cards.
- Breadcrumb-JSON-LD.
- BlogPosting-/Article-JSON-LD fuer Journal.
- FAQ-JSON-LD, wo vorhanden.
- LocalBusiness-/Service-Kontext fuer lokale SEO-Seiten, soweit aktuell genutzt.
- Sitemap und Robots/noindex.
- Redirects nur dort, wo wirklich gewollt.

Abnahmekriterium: Fuer jede aktive Seite vergleichen wir vor/nach Migration HTML
Head, Canonical, Statuscode, H1, OG-Bild, interne Links und strukturierte Daten.

## Umsetzungsschritte

### Phase 1: Export finalisieren

- Payload-Backups behalten und versioniert dokumentieren.
- Export-Script fuer Payload als wiederholbaren Befehl im Repo halten.
- Local-SEO-SQL-Dump in strukturierte JSON-Dokumente umwandeln.
- Medienarchiv entpacken und gegen `media-files.manifest.json` pruefen.
- Exportbericht erzeugen: jede Payload-ID, jeder Slug, jede Bilddatei, jede
  Referenz muss entweder gemappt oder als bewusst ungenutzt markiert sein.

### Phase 2: CMS-neutraler Datenvertrag

- Gemeinsame TypeScript-Typen fuer Seiten, Blocks, SEO und Media definieren.
- Adapter fuer aktuellen Payload-Export schreiben.
- Adapter fuer kuenftigen Tina-Content schreiben.
- Astro-Seiten zuerst gegen den Vertrag stabilisieren, damit Tina nicht direkt in
  alle Renderer hineinragt.

### Phase 3: Tina installieren

- Tina in `apps/web` integrieren.
- `tina/config.ts` mit Collections, Feldern und Templates aufbauen.
- Repo-based media konfigurieren.
- Astro Visual Editing aktivieren und nur die benoetigten Inseln/Editable-Regionen
  anbinden.
- Lokale Admin-Route testen.

### Phase 4: Content generieren

- Payload-Export nach Tina-Dateien transformieren.
- Globale Daten zuerst migrieren.
- Danach Seiten in dieser Reihenfolge: Home, Service-Index, Portfolio-Index,
  Service-Detailseiten, About/Kontakt/Legal, Portfolio-Projekte, Journal,
  Local-SEO.
- Jede Datei mit altem Payload-Dokument und aktueller Route verknuepfen.

### Phase 5: Media-Transfer und Optimizer

- Originale und bestehende Derivate aus Payload uebernehmen. Erledigt fuer den
  aktuellen Export: `corepack pnpm tina:media-sync`.
- Dateinamen normalisieren, ohne bestehende Referenzen kaputt zu machen. Fuer die
  Migration werden die Payload-Dateinamen beibehalten und URL-encoded referenziert.
- Manifest aus exportierten Payload-Mediendaten erzeugen. Erledigt:
  `corepack pnpm tina:media-manifest`.
- Optimizer fuer neue Tina-Uploads bauen. Erledigt:
  `corepack pnpm tina:media-optimize`.
- `ResponsiveImage.astro` ueber den Tina-Adapter mit Manifest-basierten Media-
  Objekten versorgen.

### Phase 6: Astro umstellen

- Payload-Fetches hinter Feature Flag lassen. Erledigt:
  `ASTRO_CONTENT_SOURCE=payload|auto|tina`.
- Tina/Content-Dateien als primaere Quelle aktivieren. Erledigt fuer lokale
  Tests mit `ASTRO_CONTENT_SOURCE=tina`.
- Fallbacks nur noch fuer bewusst nicht migrierte Sonderfaelle.
- Build ohne laufendes Payload muss funktionieren. Erledigt fuer
  `ASTRO_CONTENT_SOURCE=tina`.
- Preview/Edit-Modus darf die Produktionsausgabe nicht veraendern.

### Phase 7: QA

- Build, Typecheck und bestehende Audits ausfuehren.
- Screenshot-/Playwright-Vergleich fuer alle aktiven Seitentypen.
- SEO-Audit vor/nach Migration.
- Bildgewicht und responsive `srcset` pruefen.
- Linkcheck und Sitemap pruefen.
- Tina-Editor-Workflow testen: Text aendern, Bild tauschen, SEO-Feld aendern,
  speichern, bauen, Ergebnis ansehen.

### Phase 8: Server-Switch

- Self-hosted Tina parallel zur vorhandenen Payload-Installation deployen.
- Reverse Proxy und Auth absichern.
- Backups fuer Tina-DB/Auth/Git-Content einrichten.
- Payload nur dann abschalten, wenn alle Abnahmekriterien erfuellt sind.
- Payload-Datenbank und Medienarchiv langfristig als Freeze behalten, bis die
  Tina-Produktion mehrere reale Aenderungen ueberstanden hat.

## Risiken

| Risiko | Gegenmassnahme |
|---|---|
| Payload- und Produktionsschema laufen auseinander | SQL-Dumps als Wahrheit behalten, API-Export nur dort nutzen, wo er funktioniert |
| Bildderivate gehen verloren | Medienarchiv plus Manifest pruefen, eigene Optimizer-Pipeline bauen |
| Tina-Editor kann nicht alle Layouts sauber bearbeiten | Seitentypen und Blocks typisieren, keine rohen HTML-Felder als Hauptloesung |
| SEO veraendert sich unbemerkt | Head-/Sitemap-/JSON-LD-Vergleich als Pflichtgate |
| Self-hosted Tina braucht mehr Wartung als erwartet | TinaCloud-Free-Testpfad offenhalten |
| Git-basierte Medien werden zu gross | Uploads strukturieren, generierte Derivate ggf. getrennt behandeln |

## Definition of Done

Die Migration ist erst fertig, wenn:

- alle aktiven Seiten aus Tina-Content oder Tina-kompatiblen Content-Dateien gebaut
  werden,
- Texte, Bilder, CTAs, SEO-Felder und sichtbare Module im Editor bearbeitbar sind,
- alle produktiven Payload-Inhalte aus dem Export zugeordnet oder bewusst
  ausgeschlossen sind,
- kein Produktionsbuild Payload benoetigt,
- Bildoptimierung, responsive Ausgabe und Metadaten wieder funktionieren,
- alle relevanten Seiten visuell und technisch abgenommen sind,
- Payload auf dem Server noch als Backup vorhanden ist, aber nicht mehr fuer die
  Website benoetigt wird.
