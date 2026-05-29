# Migrationsstrategie

Ziel: die bestehende HTML-Website kontrolliert in Payload ueberfuehren, ohne alte Dateien zu ueberschreiben oder SEO-Strukturen unbedacht zu verlieren.

## Grundregel

Alte URLs bleiben zunaechst 1:1 erreichbar. Eine neue CMS-Seite ersetzt eine Legacy-URL erst, wenn:

1. das Content-Modell fuer diesen Seitentyp stabil ist,
2. die echte Legacy-Kopie in Payload uebertragen wurde,
3. Astro visuell gegen die alte Seite geprueft wurde,
4. Canonical und Sitemap stimmen,
5. Preview und Published-Version funktionieren.

Redirects werden nur gesetzt, wenn eine URL wirklich konsolidiert werden soll. Standard ist URL-Erhalt, nicht pauschale Umleitung.

## Bestandsaufnahme

| Altbestand | Neuer CMS-Typ | Vorgehen |
|---|---|---|
| `index.html` | `site-pages` mit `pageType: home` | Inhalt und Bilddramaturgie als Home-Seite nachbauen. |
| `ueber-mich.html` | `site-pages` mit `pageType: about` | Text, Portrait/Arbeitsweise und Kontaktmodul uebertragen. |
| `contact.html` | `site-pages` mit `pageType: contact` | Kontaktinformationen und Anfragehinweise uebertragen. |
| `impressum.html`, `datenschutz.html` | `site-pages` mit `pageType: legal` | Juristische Texte manuell pruefen und uebertragen. |
| `portfolio.html` | Portfolio-Index + `portfolio-projects` | Erst Struktur, dann echte Serien als Projekte. |
| `floating-archive.html`, `narrative-stage.html`, `experimental-lens.html`, `radikale-fotografie-portfolio-konzepte.html` | Konzeptarchiv | Als noindex Astro-Archivseiten erhalten; nicht als aktive Portfolio-Projekte ausgeben, solange sie nur Konzeptmaterial sind. |
| `blog.html`, `blog-journal.html` | Journal-Index / `site-pages` | Index-Varianten pruefen, eine kanonische Uebersicht festlegen. |
| `blog-*.html` Detailseiten | `journal-posts` | Alte URLs laufen bereits ueber einen nativen Astro-Artikelrenderer; Payload-Journalfelder bleiben die Zielquelle fuer weitere redaktionelle Pflege. |
| `leistungen.html`, `weitere-dienstleistungen.html` | Services-Index / `site-pages` | Eine kanonische Uebersicht definieren. |
| Hauptleistungen, z. B. `automobil-fotografie-duesseldorf.html` | `service-pages` | Als kanonische Service-Seiten pflegen und alte URL als Canonical setzen. |
| Stadt-/Keyword-Seiten, z. B. `automobil-fotografie-koeln.html` | `local-seo-pages` | Ueber sechs Kategorie-Familien migrieren: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait, Landschaft. |
| Bilddateien im Root und `assets/**` | `media` | Kuratieren, nicht blind massenhaft hochladen. |

## Priorisierte Migrationsliste

1. Globals: `site-settings`, `navigation`, `footer`, `global-ctas`.
2. Medien: 20-40 starke Bilder mit Alt-Texten und Moods.
3. Home, Portfolio-Index, Services-Index.
4. Fotografie-Uebersicht und sechs neutrale Fotografie-Hauptseiten: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait, Landschaft.
5. Weitere Services: Fotolabor, Grossformatdruck, Werbetechnik, Webdesign/SEO, Viola, Videografie, Sonderanfertigungen.
6. About, Kontakt, Impressum, Datenschutz.
7. Erste 3-6 Portfolio-Projekte.
8. Journal-Detailseiten.
9. Lokale SEO-Cluster.

## Native-Komponenten-Status

Stand 2026-05-29:

| Seitentyp | Status | Naechster Schritt |
|---|---|---|
| Startseite | Native Astro-Komponente mit Payload-Textbasis und Legacy-Optik | Weiter schrittweise echte CMS-Felder fuer einzelne Teaser/Bildmodule verbinden. |
| Fotografie-Uebersicht | Native Astro-Komponente | Weiter CMS-Felder fuer Teaser, Menues und Bildmodule anbinden, ohne die freigegebene Optik zu veraendern. |
| Portfolio-Uebersicht | Native Astro-Komponente | Portfolio-Projekte weiter aus Payload speisen, ohne die aktuelle Galerieoptik zu verlieren. |
| Leistungen-Uebersicht | Native Astro-Komponente | Service-Index mittelfristig aus `service-pages` sortieren. |
| Weitere Service-Seiten | Native Astro-Komponenten fuer sieben Seiten | Texte/Bilder koennen weiter ueber Payload-Dokumente gegen die statische Content-Basis ersetzt werden. |
| Journal-Uebersicht | Native Astro-Komponente mit Payload-Listing-Fallback | Weiter Design-Parity halten, waehrend `journal-posts` redaktionell wachsen. |
| Neue Journal-Routen `/journal/<slug>` | CMS-native Artikelkomponente | ENV `ASTRO_ENABLE_CMS_JOURNAL_ROUTES=true` setzen, wenn die Route live gebaut werden soll. |
| Neue Local-SEO-Routen | CMS-native Local-SEO-Komponente | Fuer neue Seiten ohne Legacy-Datei weiter als strukturierter CMS-Pfad nutzen. |
| Alte Local-SEO-HTML-Seiten | Native Local-SEO-Family-Renderer | Standardmaessig aktiv: lokale Varianten erben eine der sechs Kategorie-Familien, werden aus typisierten Familieninhalten/Payload-Feldern gerendert und brauchen kein rohes Legacy-Body-HTML mehr. |
| Sechs Haupt-Fotografie-Detailseiten | Alle sechs Seiten sind native Astro-Body-Templates mit Legacy-CSS/JS-Parity und visueller Freigabe. | Inhalte weiter behutsam aus Payload-Feldern speisen, ohne Layout-HTML als CMS-Hack zu speichern. |
| About, Kontakt, Legal | `ueber-mich.html` und `contact.html` sind native Astro-Body-Templates; `impressum.html` und `datenschutz.html` sind typisierte Legal-Templates mit `BaseLayout`. | Juristische Inhalte bei echten Rechtsaenderungen manuell pflegen; keine Legacy-Body-Abhaengigkeit mehr fuer Legal. |
| Bestehende `blog-*.html` Detailseiten | Native Astro-Artikelrenderer auf alter URL mit `BaseLayout`, BlogPosting-/FAQ-/Breadcrumb-JSON-LD und typisierter Content-Basis. | Final Payload-Journalfelder angleichen und visuelle Regression fuer alle sieben Artikel dauerhaft im Release-Gate halten. |

## Eingefrorene visuelle Referenz

Die aktuellen Root-HTML-Dateien sind eingefrorene visuelle Wahrheit fuer die Migration. Sie enthalten die letzten Text-, CTA-, Hero-, SEO- und Bildperformance-Aenderungen und werden nicht geloescht oder ueberschrieben.

Der Manifest-Stand wird mit folgendem Befehl aktualisiert:

```powershell
corepack pnpm legacy:freeze
```

Das schreibt `docs/legacy-reference-manifest.json` mit Checksumme, Titel, Description, H1, Canonical, Dateigroesse und Seitentyp fuer alle Root-HTML-Dateien. Der Freeze ersetzt keine visuelle Abnahme, macht aber unbeabsichtigte Legacy-Aenderungen nachvollziehbar.

## Kontrollierter Import-Stand

`corepack pnpm --filter @matthias-ramahi/cms import:legacy` ist der vollstaendige Staging-Import fuer die bestehende Website. Er ueberschreibt keine alten HTML-Dateien, sondern erzeugt oder aktualisiert Payload-Dokumente anhand von Slugs.

Fuer die aktive Produktionsmigration gibt es zusaetzlich den begrenzten Import:

```powershell
corepack pnpm cms:import-adopted
```

Dieser importiert nur die aktuell adoptierten Kern- und Produktionsseiten. Das verhindert, dass lokale SEO-Cluster versehentlich als fertig gelten, bevor ihr Template und ihre redaktionelle Qualitaet stabil sind.

Aktuell werden importiert:

- Medien mit Legacy-Pfad, Alt-Text-Fallback, Kategorie, Mood, Verwendungszweck und Featured-Hinweis.
- `site-pages` fuer Home, Portfolio, Leistungen, About, Kontakt, Blog, Impressum und Datenschutz.
- `service-pages` fuer die kanonischen Leistungsseiten.
- `local-seo-pages` fuer Stadt-/Keyword-Seiten als Entwuerfe.
- `portfolio-categories` und `portfolio-projects` aus der bestehenden Portfolio-Uebersicht.
- `journal-posts` aus Blog-Detailseiten wie `blog-automotive-fotografie-duesseldorf.html`.

Nach jedem Import gilt: Inhalte sind eine Content-Basis, keine finale redaktionelle Freigabe. Der Status `legacy.migrationStatus` bleibt `seeded`, bis ein Mensch Text, Bildauswahl, Alt-Texte, Canonical und Layout-Parity geprueft hat.

Der Import legt bei Standardseiten, Service-Seiten und lokalen SEO-Seiten bereits strukturierte `blocks` aus Ueberschriften, Textabschnitten und Figuren an. Das ersetzt die Legacy-Ausgabe noch nicht automatisch, verhindert aber, dass die Migration langfristig bei grossen HTML-Fragmenten stecken bleibt.

Der aktuelle Freigabestand ist messbar mit:

```powershell
corepack pnpm cms:audit-readiness
corepack pnpm cms:audit-production -- --strict
```

Das Audit trennt Feld-Vollstaendigkeit von Produktionsreife. Ein Dokument ist erst produktionsbereit, wenn die Pflichtfelder vollstaendig sind, der Publish-Status passt und `legacy.migrationStatus` auf `reviewed`, `componentized` oder `live` steht.

Die aktive Produktionsgruppe kann mit einem bewusst engen Script freigegeben werden:

```powershell
corepack pnpm cms:review-adopted -- --write
```

Dieses Script markiert nur die definierte Produktionsseitenliste als `reviewed` und blockiert bei fehlenden Dokumenten, falscher Legacy-Quelle, fehlenden Pflichtfeldern oder nicht veroeffentlichten Inhalten. Stand 2026-05-28 sind 29/29 aktive Produktionsseiten reviewed und der Production-Audit meldet 0 Errors / 0 Warnings.

## URL-Erhalt

Aktuell bleiben alle alten Root-HTML-URLs 1:1 erreichbar. Die Migration ist aber nicht mehr ein Big Bang, sondern in drei klare Gruppen geteilt:

- Alle 217 bisherigen Root-HTML-URLs werden im Vercel-/Static-Build aus `apps/web/src/pages/[slug].html.astro` und `apps/web/src/lib/adoptedRoutes.ts` erzeugt. Die Root-HTML-Dateien sind Referenz, aber nicht mehr Produktionsquelle.
- Adoptierte Kernseiten und alle Local-SEO-Seiten werden ueber native Astro-Komponenten, den Local-SEO-Family-Renderer oder den Journal-/Legal-Renderer ausgegeben. Die sichtbare URL bleibt z. B. `/fotografie.html`, `/portfolio.html`, `/automobil-fotografie-koeln.html` oder `/blog-serie-kuratieren.html`.
- Echte Dubletten redirecten mit 308 auf die kanonische Zielseite.
- Neue Payload-Seiten ohne passende Root-HTML-Datei koennen ueber den generischen strukturierten Astro-Renderpfad laufen. Dieser Pfad ist fuer neue Seiten gedacht, nicht fuer ungepruefte 1:1-Ersetzungen.

Die rohe Legacy-Ausgabe ist kein Astro-App-Renderpfad mehr. Fuer Visual Regression startet `apps/web/scripts/visual-regression.mjs` einen separaten lokalen Referenzserver aus den Root-HTML-Dateien; produktive Routen bleiben dadurch vollstaendig Astro-nativ.

Wichtig: Der Public-Asset-Sync kopiert keine Root-HTML-Dateien mehr nach `apps/web/public`. Die alten HTML-Dateien bleiben im Projekt-Root unangetastet, aber sie blockieren die Astro-Routen nicht als statische Public-Dateien. Der alte `src/pages/[slug].html.ts`-Fallback ist entfernt; `.html`-Routen kommen aus dem nativen Routenmodell.

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
- die sieben weiteren Service-Seiten: `fotolabor-druck-duesseldorf.html`, `grossformatdruck-duesseldorf.html`, `werbetechnik-duesseldorf.html`, `webdesign-seo-duesseldorf.html`, `videografie-duesseldorf.html`, `viola-musik-duesseldorf.html`, `drucke-sonderanfertigungen-duesseldorf.html`
- alle sieben `blog-*.html` Journal-Detailseiten
- alle bestehenden Stadt-/Keyword-Seiten ueber die sechs Familienrenderer
- die noindex Konzeptarchiv-Seiten `radikale-fotografie-portfolio-konzepte.html`, `floating-archive.html`, `narrative-stage.html`, `experimental-lens.html`

Fuer migrierte Seiten gilt:

- `seo.canonicalUrl` im CMS auf die bestehende Live-URL setzen, z. B. `https://matthiasramahi.de/automobil-fotografie-duesseldorf.html`.
- Sitemap soll die kanonische URL enthalten.
- Alte `.html`-Datei nicht ueberschreiben.
- Erst nach visueller Freigabe entscheidet man, ob Astro den Body-Abschnitt komplett aus CMS-Komponenten rendert oder ob die Legacy-Body-Struktur noch als Parity-Schicht erhalten bleibt.

Redirects sind nur sinnvoll bei echten Dubletten, z. B. wenn `blog.html` und `blog-journal.html` inhaltlich dasselbe Ziel haben.

Aktuelle Redirects:

- `weitere-dienstleistungen.html` -> `/leistungen.html` mit `308`, weil die Leistungen-Uebersicht die kanonische Seite ist.
- `blog-journal.html` -> `/blog.html`
- `matthias-ramahi-portfolio.html` -> `/portfolio.html`
- `portfolio-1-tunnel.html` -> `/portfolio.html`
- `fotografie-landing-experience.html` -> `/fotografie-duesseldorf.html`
- `portraitfotografie-experience.html` -> `/portraitfotografie-duesseldorf.html`

## Lokale SEO-Seiten

Lokale/keywordbasierte Seiten werden nicht blind als finale oeffentliche Inhalte behandelt. Fuer das aktuelle private Staging sind die importierten Seiten nach Audit freigegeben, damit sie online geprueft werden koennen. Vorgehen fuer weitere Pflege:

1. Haupt-Service-Seite stabilisieren.
2. Lokale Seite als `local-seo-pages` mit echter Stadt-/Regionslogik anlegen.
3. `canonicalServicePage` setzen, wenn die lokale Seite Cluster-Zugehoerigkeit hat.
4. Eigene lokale Einleitung, lokale Proof Points und FAQ pflegen.
5. Interne Links zur Hauptseite und verwandten Services setzen.

Qualitaetsregel: keine Seiten, bei denen nur der Stadtname getauscht wurde.

Architekturregel: Lokale Seiten benutzen kein einheitliches generisches Landingpage-Template. Jede lokale Kategorie-Seite gehoert zu genau einer der sechs visuellen Familien:

- Automobil: `automobil-fotografie-*`, `automotive-fotografie-*`, `autofotografie-*`, `autohaus-fotografie-*`, `autoverkauf-fotos-*`, `fahrzeugfotografie-*`.
- Sportwagen: `sportwagen-fotografie-*`, `sportwagen-shooting-*`, `sportwagen-fotoshooting-*`, `performance-car-fotografie-*`, `exotic-car-fotografie-*`, `supersportwagen-fotografie-*`.
- Oldtimer: `oldtimer-fotografie-*`, `oldtimer-shooting-*`, `oldtimer-verkaufsfotos-*`, `classic-car-fotografie-*`, `youngtimer-fotografie-*`, `sammlerfahrzeug-fotografie-*`.
- Motorrad: `motorrad-fotografie-*`, `motorrad-shooting-*`, `motorrad-verkaufsfotos-*`, `bike-fotografie-*`, `custom-bike-fotografie-*`, `biker-portrait-*`.
- Portrait: `portraitfotografie-*`, `business-portrait-*`, `headshot-fotograf-*`, `personal-branding-fotografie-*`, `unternehmensportrait-*`, `pressefoto-*`.
- Landschaft: `landschaftsfotografie-*`, `landschaftsbilder-*`, `fine-art-prints-*`, `wandbilder-landschaftsfotografie-*`, `naturfotografie-prints-*`.

Die neutralen Seiten `fotografie-duesseldorf.html`, `fotografie-nrw.html` und `fotografie-deutschland.html` bleiben separat und erben nicht von einer Kategorie-Familie.

Technischer Gate:

- `ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES=false` schaltet nur den Middleware-Rewrite fuer lokale SEO-Familien temporaer ab; der statische Vercel-Build bleibt bewusst nativ.
- `cms:approve-private-staging -- --collection=local-seo-pages --write` veroeffentlicht nur vollstaendige Local-SEO-Dokumente fuer privates Staging.
- `cms:audit-production -- --strict` stellt sicher, dass veroeffentlichte lokale SEO-Seiten `reviewed`, SEO-vollstaendig und frei von blockierenden Sprach-/Medienproblemen sind.

## Bildmigration

1. Bestehende Bilder sichten und Dubletten entfernen.
2. Pro Bild festlegen: Kategorie, Orientierung, Mood, Bildtyp, Verwendungszweck.
3. Alt-Text fachlich schreiben, nicht nur Dateiname.
4. Featured-Bilder markieren.
5. Erst danach Seiten mit Medien verknuepfen.

## Visuelle Freigabe

Die Legacy-Ausgabe ist weiterhin die visuelle Wahrheit. Fuer jede Ersetzung gilt:

1. Alte URL und adoptierte Astro-URL in `apps/web/scripts/visual-regression.mjs` aufnehmen.
2. Desktop und Mobile vergleichen.
3. Bekannte neue Soll-Abweichungen dokumentieren, aktuell: SEO-Anpassungen, Bildperformance/optimierte Bilder, groessere CTAs und zentralisiertes Formularsystem.
4. Erst danach eine CMS-Route als Live-Ersatz aktivieren.

Aktueller Pruefstand:

- `corepack pnpm --filter @matthias-ramahi/web test:legacy-routes` prueft alle Root-HTML-URLs auf Status 200, Titel, Header/Footer und kaputte Bilder.
- `corepack pnpm --filter @matthias-ramahi/web test:visual` vergleicht die wichtigsten Seiten gegen die rohe Legacy-Baseline auf Desktop und Mobile.
- Visual Regression nutzt 2% als Zielwert und 5% als harte Fail-Grenze. Ueberschreitungen des Zielwerts werden als Warnung ausgegeben, weil mehrere Legacy-Seiten dynamische JS-/Lazyload-Bildstrecken enthalten.
- Bekannte Soll-Ausnahmen bleiben die vom Nutzer gewuenschten Aenderungen: SEO-Anpassungen, Bildperformance/optimierte Bilder, groessere CTAs und zentralisiertes Formularsystem.
- Stand 2026-05-28: Web- und CMS-Build laufen. Die adoptierten Kernseiten werden nicht mehr als statische Legacy-Kopien prerendered, sondern sind fuer den Astro/Payload-Renderpfad reserviert.
- Stand 2026-05-28: Die aktive Produktionsgruppe ist reviewed, 157 lokale SEO-Seiten sind fuer privates Staging published/reviewed, der Production-Audit ist fehlerfrei, und `production:check` ist der zentrale Release-Befehl fuer die naechste Abnahme.
- Stand 2026-05-29: `automobil-fotografie.html`, `sportwagen-fotografie.html` und `oldtimer-fotografie.html` rendern als native Astro-Komponenten. Visual Regression gegen den separaten Root-HTML-Referenzserver: Automobil Desktop 1.985%, Mobile 1.705%; Sportwagen Desktop 1.779%, Mobile 0.008%; Oldtimer Desktop 0.003%, Mobile 0.010%. Browser-Smoke: Lightbox und Konsole fehlerfrei; Sportwagen- und Oldtimer-Lightbox wurden durch gesetzte `src`-Attribute fuer `data-src`-Tiles gehaertet.
- Stand 2026-05-29: `motorrad-fotografie.html`, `portraitfotografie.html`, `landschaftsfotografie.html`, `contact.html` und `ueber-mich.html` sind ebenfalls native Astro-Body-Templates. Die Dev-Middleware rendert dieselbe native Logik wie der statische Build; Legacy-CSS-Variablen werden nach Astro-CSS wiederhergestellt, damit `tokens.css` die eingefrorene Optik nicht ueberschreibt. Visual Regression ueber acht Kernseiten bleibt unter 5%; Kontakt, Landschaft, About und Oldtimer liegen praktisch pixelgleich.
- Stand 2026-05-29: alle sieben bestehenden `blog-*.html` Journal-Detailseiten laufen auf den alten URLs ueber den nativen Artikelrenderer mit `BaseLayout`. HTTP-Smoke meldet `x-cms-render-source: structured-astro`, Browser-Smoke fuer Automotive- und Fine-Art-Artikel ist ohne Error-Overlay, ohne relevante Console Errors/Warnings und mit BlogPosting-JSON-LD bestanden.
- Stand 2026-05-29: `impressum.html` und `datenschutz.html` sind nicht mehr aus Legacy-HTML-Sections zusammengesetzt, sondern rendern aus `legalContent.ts` als native Astro-Seiten. Local-SEO-Payload-Dokumente werden fuer den Build ueber einen gecachten Legacy-URL-Index geladen, nicht mehr pro Route einzeln.
- Stand 2026-05-29: alle 217 Root-HTML-URLs werden im Astro-Build nativ erzeugt. Es gibt keine rohe Produktionsausgabe ueber `set:html={legacyHtml}` mehr; Root-HTML bleibt nur Referenz/Baseline. Alias-Dubletten redirecten, Konzeptseiten sind noindex Astro-Archivseiten.
- Stand 2026-05-29: die alte App-interne Legacy-/Componentized-Bruecke ist entfernt. `apps/web/src` enthaelt keine Route und keine Komponente mehr, die Root-HTML als Produktions- oder Preview-Body rendert. Visual Regression liest alte HTML-Dateien nur noch ueber einen separaten QA-Referenzserver.
- Stand 2026-05-29: Site-Quality-Audit ueber 233 Routen und 466 Desktop-/Mobile-Checks ist ohne Failures. Uebrig sind nur Long-Task-Warnungen fuer bild- und animationsreiche Seiten.
